// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/*
    ___           ___           ___           ___           ___           ___           ___           ___   
   /  /\         /  /\         /  /\         /__/|         /__/\         /  /\         /  /\         /  /\  
  /  /:/        /  /::\       /  /::\       |  |:|        |  |::\       /  /::\       /  /::\       /  /:/_ 
 /  /:/        /  /:/\:\     /  /:/\:\      |  |:|        |  |:|:\     /  /:/\:\     /  /:/\:\     /  /:/ /\
/  /:/  ___   /  /:/  \:\   /  /:/  \:\   __|  |:|      __|__|:|\:\   /  /:/  \:\   /  /:/~/:/    /  /:/ /:/_
/__/:/  /  /\ /__/:/ \__\:\ /__/:/ \__\:\ /__/\_|:|____ /__/::::| \:\ /__/:/ \__\:\ /__/:/ /:/___ /__/:/ /:/ /\
\  \:\ /  /:/ \  \:\ /  /:/ \  \:\ /  /:/ \  \:\/:::::/ \  \:\~~\__\/ \  \:\ /  /:/ \  \:\/:::::/ \  \:\/:/ /:/
\  \:\  /:/   \  \:\  /:/   \  \:\  /:/   \  \::/~~~~   \  \:\        \  \:\  /:/   \  \::/~~~~   \  \::/ /:/
 \  \:\/:/     \  \:\/:/     \  \:\/:/     \  \:\        \  \:\        \  \:\/:/     \  \:\        \  \:\/:/
  \  \::/       \  \::/       \  \::/       \  \:\        \  \:\        \  \::/       \  \:\        \  \::/ 
   \__\/         \__\/         \__\/         \__\/         \__\/         \__\/         \__\/         \__\/   


 CookMoreTier Membership System
 ================================
 A tiered NFT membership system with Pro, Group and OG levels.
 Features dynamic metadata, USDC payments, and upgradability.
*/

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title CookMoreTier
/// @notice Tiered NFT Membership System with Pro, Group, and OG levels and Treasury Split Logic.
contract CookMoreTier is ERC721URIStorage, ReentrancyGuard, AccessControl {
    using Counters for Counters.Counter;

    IERC20 public immutable usdc;
    address public adminTreasury; // Admin Treasury Address

    uint256 public immutable proPrice;
    uint256 public immutable groupPrice;
    uint256 public immutable ogPrice;

    string private proBaseURI;
    string private groupBaseURI;
    string private ogBaseURI;

    Counters.Counter private tokenIdCounter;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant FINANCIAL_MANAGER_ROLE = keccak256("FINANCIAL_MANAGER_ROLE");

    // OG Tier limits
    uint256 public constant MAX_OG_SUPPLY = 500;
    uint256 public constant ADMIN_OG_LIMIT = 20;
    Counters.Counter private ogMintedCount;
    Counters.Counter private adminOGMintedCount;

    // Pro and Group limits
    uint256 public constant ADMIN_PRO_LIMIT = 500;
    uint256 public constant ADMIN_GROUP_LIMIT = 500;
    Counters.Counter private adminProMintedCount;
    Counters.Counter private adminGroupMintedCount;

    mapping(uint256 => string) public tokenTier; // Tracks tier by tokenId

    /// @dev Events
    event Minted(address indexed user, uint256 tokenId, string tier);
    event FundsSplit(address indexed treasury, uint256 adminShare, uint256 protocolShare);
    event FundsWithdrawn(address indexed recipient, uint256 amount);
    event BaseURIsUpdated(string proURI, string groupURI, string ogURI);
    event AdminTreasuryUpdated(address newTreasury);

    /// @dev Custom Errors
    error USDCTransferFailed();
    error OGSupplyExceeded();
    error AdminOGCapExceeded();
    error AdminProCapExceeded();
    error AdminGroupCapExceeded();
    error NoFundsToWithdraw();
    error InvalidAddress();

    constructor(
        address _usdc,
        address _adminTreasury,
        uint256 _proPrice,
        uint256 _groupPrice,
        uint256 _ogPrice
    ) ERC721("CookMoreTier Membership NFT", "TIER") {
        require(_usdc != address(0), "Invalid USDC address");
        require(_adminTreasury != address(0), "Invalid treasury address");

        usdc = IERC20(_usdc);
        adminTreasury = _adminTreasury;

        proPrice = _proPrice;
        groupPrice = _groupPrice;
        ogPrice = _ogPrice;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(FINANCIAL_MANAGER_ROLE, msg.sender);
    }

    /// @notice Mint Pro Tier
    function mintPro() external nonReentrant {
        _processPayment(proPrice);
        _mintTier(msg.sender, "Pro", proBaseURI);
    }

    /// @notice Mint Group Tier
    function mintGroup() external nonReentrant {
        _processPayment(groupPrice);
        _mintTier(msg.sender, "Group", groupBaseURI);
    }

    /// @notice Mint OG Tier with capped supply
    function mintOG() external nonReentrant {
        if (ogMintedCount.current() >= MAX_OG_SUPPLY) revert OGSupplyExceeded();
        _processPayment(ogPrice);
        ogMintedCount.increment();
        _mintTier(msg.sender, "OG", ogBaseURI);
    }

    /// @notice Admin Mint Pro, Group, or OG Tokens
    function adminMintPro(address recipient) external onlyRole(ADMIN_ROLE) {
        if (adminProMintedCount.current() >= ADMIN_PRO_LIMIT) revert AdminProCapExceeded();
        adminProMintedCount.increment();
        _mintTier(recipient, "Pro", proBaseURI);
    }

    function adminMintGroup(address recipient) external onlyRole(ADMIN_ROLE) {
        if (adminGroupMintedCount.current() >= ADMIN_GROUP_LIMIT) revert AdminGroupCapExceeded();
        adminGroupMintedCount.increment();
        _mintTier(recipient, "Group", groupBaseURI);
    }

    function adminMintOG(address recipient) external onlyRole(ADMIN_ROLE) {
        if (adminOGMintedCount.current() >= ADMIN_OG_LIMIT) revert AdminOGCapExceeded();
        if (ogMintedCount.current() >= MAX_OG_SUPPLY) revert OGSupplyExceeded();

        adminOGMintedCount.increment();
        ogMintedCount.increment();
        _mintTier(recipient, "OG", ogBaseURI);
    }

    /// @notice Withdraw Protocol Funds
    function withdrawFunds() external onlyRole(FINANCIAL_MANAGER_ROLE) {
        uint256 balance = usdc.balanceOf(address(this));
        if (balance == 0) revert NoFundsToWithdraw();
        if (!usdc.transfer(msg.sender, balance)) revert USDCTransferFailed();

        emit FundsWithdrawn(msg.sender, balance);
    }

    /// @notice Set the Admin Treasury Address
    function setAdminTreasury(address _newTreasury) external onlyRole(ADMIN_ROLE) {
        if (_newTreasury == address(0)) revert InvalidAddress();
        adminTreasury = _newTreasury;
        emit AdminTreasuryUpdated(_newTreasury);
    }

    /// @dev SupportsInterface Override
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @dev Internal Payment Processing with Split
    function _processPayment(uint256 price) internal {
        uint256 adminShare = (price * 20) / 100; // 20% to Admin Treasury
        uint256 protocolShare = price - adminShare;

        require(usdc.transferFrom(msg.sender, adminTreasury, adminShare), "Admin share failed");
        require(usdc.transferFrom(msg.sender, address(this), protocolShare), "Protocol share failed");

        emit FundsSplit(adminTreasury, adminShare, protocolShare);
    }

    /// @dev Internal Minting Logic
    function _mintTier(address recipient, string memory tier, string memory baseURI) internal {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();

        _mint(recipient, tokenId);
        _setTokenURI(tokenId, baseURI);
        tokenTier[tokenId] = tier;

        emit Minted(recipient, tokenId, tier);
    }
}

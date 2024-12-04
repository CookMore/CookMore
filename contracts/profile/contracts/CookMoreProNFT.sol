// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title CookMoreProNFT
/// @notice Implements the Pro tier NFT membership.
contract CookMoreProNFT is ERC721URIStorage, ReentrancyGuard, Ownable {
    IERC20 public immutable usdc;
    uint256 public immutable price;
    string private baseURI;
    uint256 private tokenIdCounter;

    /// @dev Events
    event Minted(address indexed user, uint256 tokenId);
    event Gifted(address indexed from, address indexed to, uint256 tokenId);

    /// @param _usdc Address of the USDC token contract.
    /// @param _price Price for minting a Pro NFT in USDC.
    constructor(
        address _usdc,
        uint256 _price
    ) ERC721("CookMore Pro Membership", "PRO") Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_price > 0, "Price must be greater than zero");

        usdc = IERC20(_usdc);
        price = _price;
        tokenIdCounter = 0;
    }

    /// @dev Mint a Pro NFT.
    function mint() external nonReentrant {
        require(usdc.transferFrom(msg.sender, address(this), price), "USDC transfer failed");
        _mintTo(msg.sender);
    }

    /// @dev Gift a Pro NFT to another address.
    function gift(address recipient) external nonReentrant {
        require(recipient != address(0), "Invalid recipient address");
        require(usdc.transferFrom(msg.sender, address(this), price), "USDC transfer failed");
        
        _mintTo(recipient);
        emit Gifted(msg.sender, recipient, tokenIdCounter);
    }

    /// @dev Admin mint a Pro NFT to a user for free.
    function adminMint(address recipient) external onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        _mintTo(recipient);
    }

    /// @dev Set metadata base URI.
    function setBaseURI(string calldata _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    /// @dev Withdraw accumulated USDC.
    function withdrawFunds() external onlyOwner {
        uint256 balance = usdc.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        require(usdc.transfer(owner(), balance), "USDC withdrawal failed");
    }

    /// @dev Internal function to mint a Pro NFT.
    function _mintTo(address recipient) internal {
        uint256 tokenId = ++tokenIdCounter;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, baseURI);
        emit Minted(recipient, tokenId);
    }
} 
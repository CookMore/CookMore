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

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICookMoreProfileRegistry {
    function adminDeleteProfile(address wallet) external;
}

interface ICookMoreMetadata {
    function updateMetadata(
        uint256 profileId,
        string calldata name,
        string calldata bio,
        string calldata avatar,
        string calldata ipfsNotesCID
    ) external;
}

/// @title CookMoreAccessControl
/// @notice Manages roles, treasury operations, and moderation.
contract CookMoreAccessControl is AccessControl, Pausable, Ownable {
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant FINANCIAL_MANAGER_ROLE = keccak256("FINANCIAL_MANAGER_ROLE");
    bytes32 public constant FEATURE_MANAGER_ROLE = keccak256("FEATURE_MANAGER_ROLE");
    bytes32 public constant CONTENT_MODERATOR_ROLE = keccak256("CONTENT_MODERATOR_ROLE");

    IERC20 public usdc; // USDC token reference
    address public treasury; // Treasury wallet for fund management

    /// @dev Events
    event FundsWithdrawn(address indexed recipient, uint256 amount);
    event ProfileDeleted(address indexed wallet);
    event MetadataFlagged(uint256 indexed profileId, string placeholderCID);
    event TreasuryUpdated(address indexed newTreasury);

    /// @notice Constructor initializes admin and treasury wallet
    constructor(address _admin, address _usdc, address _treasury) Ownable(_admin) {
        require(_admin != address(0), "Invalid admin address");
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);

        usdc = IERC20(_usdc);
        treasury = _treasury;
    }

    /// @notice Withdraw funds from the treasury
    function withdrawFunds(address recipient, uint256 amount) external {
        require(
            hasRole(ADMIN_ROLE, msg.sender) || hasRole(FINANCIAL_MANAGER_ROLE, msg.sender),
            "Not authorized to withdraw"
        );
        require(usdc.balanceOf(treasury) >= amount, "Insufficient treasury balance");
        require(usdc.transferFrom(treasury, recipient, amount), "USDC transfer failed");

        emit FundsWithdrawn(recipient, amount);
    }

    /// @notice Delete a flagged user profile
    function deleteProfile(address profileRegistry, address user) external onlyRole(FEATURE_MANAGER_ROLE) {
        ICookMoreProfileRegistry(profileRegistry).adminDeleteProfile(user);
        emit ProfileDeleted(user);
    }

    /// @notice Flag malicious metadata
    function flagMetadata(address metadataContract, uint256 profileId, string calldata placeholderCID)
        external
        onlyRole(CONTENT_MODERATOR_ROLE)
    {
        ICookMoreMetadata(metadataContract).updateMetadata(
            profileId,
            "Flagged",
            "Content flagged for abuse",
            placeholderCID,
            "Flagged"
        );
        emit MetadataFlagged(profileId, placeholderCID);
    }

    /// @notice Update the treasury wallet address
    function updateTreasury(address newTreasury) external onlyRole(ADMIN_ROLE) {
        require(newTreasury != address(0), "Invalid treasury address");
        treasury = newTreasury;

        emit TreasuryUpdated(newTreasury);
    }

    /// @notice Pause platform operations
    function pausePlatform() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /// @notice Unpause platform operations
    function unpausePlatform() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}

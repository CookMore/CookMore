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
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title CookMoreProfileRegistry
/// @notice Manages user profiles with NFT-based tiered upgrades.
contract CookMoreProfileRegistry is AccessControl, Pausable {
    enum ProfileTier { FREE, PRO, GROUP, OG }

    struct Profile {
        uint256 profileId;
        address wallet;
        string metadataURI;
        ProfileTier tier;
        bool exists;
    }

    IERC721 public cookMoreTierNFT;
    uint256 private profileCounter;

    mapping(address => Profile) private profiles;

    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @dev Events
    event ProfileCreated(address indexed wallet, uint256 profileId, string metadataURI);
    event ProfileUpdated(address indexed wallet, uint256 profileId, string metadataURI);
    event ProfileUpgraded(address indexed wallet, uint256 profileId, ProfileTier newTier);
    event ProfileDeleted(address indexed wallet, uint256 profileId);

    constructor(address _cookMoreTierNFT) {
        require(_cookMoreTierNFT != address(0), "Invalid NFT contract address");

        cookMoreTierNFT = IERC721(_cookMoreTierNFT);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Create a new profile
    function createProfile(string memory metadataURI) external whenNotPaused {
        require(!profiles[msg.sender].exists, "Profile already exists");

        profileCounter++;
        profiles[msg.sender] = Profile({
            profileId: profileCounter,
            wallet: msg.sender,
            metadataURI: metadataURI,
            tier: ProfileTier.FREE,
            exists: true
        });

        emit ProfileCreated(msg.sender, profileCounter, metadataURI);
    }

    /// @notice Update profile metadata
    function updateProfile(string memory metadataURI) external whenNotPaused {
        require(profiles[msg.sender].exists, "Profile does not exist");

        profiles[msg.sender].metadataURI = metadataURI;
        emit ProfileUpdated(msg.sender, profiles[msg.sender].profileId, metadataURI);
    }

    /// @notice Upgrade user tier based on NFT ownership
    function upgradeTier() external whenNotPaused {
        require(profiles[msg.sender].exists, "Profile does not exist");

        Profile storage profile = profiles[msg.sender];

        // Check NFT ownership for tier upgrades
        if (cookMoreTierNFT.balanceOf(msg.sender) > 0) {
            profile.tier = ProfileTier.OG; // Example: Defaulting to OG tier
        } else {
            revert("No eligible NFT for upgrade");
        }

        emit ProfileUpgraded(msg.sender, profile.profileId, profile.tier);
    }

    /// @notice Admin deletes a user profile
    function adminDeleteProfile(address wallet) external onlyRole(ADMIN_ROLE) whenNotPaused {
        require(profiles[wallet].exists, "Profile does not exist");

        uint256 profileId = profiles[wallet].profileId;
        delete profiles[wallet];

        emit ProfileDeleted(wallet, profileId);
    }

    /// @notice Retrieve a user's profile
    function getProfile(address wallet) external view returns (Profile memory) {
        return profiles[wallet];
    }

    /// @notice Pause the registry
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /// @notice Unpause the registry
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}

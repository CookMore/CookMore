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


 CookMoreAccessControl System
 ================================
 Role-based permissions and tier-specific feature access.
*/

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./CookMoreAccessControl.sol";

/// @title CookMoreProfileRegistry
/// @notice Maps wallet addresses to profile IDs and manages profile creation/updates.
contract CookMoreProfileRegistry is Pausable {
    enum ProfileTier { FREE, PRO, GROUP }

    struct Profile {
        uint256 profileId;
        address wallet;
        string metadataURI; // Link to detailed metadata (e.g., IPFS URI)
        ProfileTier tier;
        bool exists;
    }

    CookMoreAccessControl public accessControl;
    IERC721 public proNFT;
    IERC721 public groupNFT;

    uint256 private profileCounter;
    mapping(address => Profile) private profiles;

    /// @dev Events
    event ProfileCreated(address indexed wallet, uint256 profileId, string metadataURI, ProfileTier tier);
    event ProfileUpdated(address indexed wallet, uint256 profileId, string metadataURI, ProfileTier tier);
    event ProfileDeleted(address indexed wallet, uint256 profileId);
    event ProfileTierUpgraded(address indexed wallet, uint256 profileId, ProfileTier newTier);
    event NFTContractsUpdated(address proNFT, address groupNFT);

    /**
     * @notice Initializes the registry with access control and NFT contract references.
     * @param _accessControl Address of the CookMoreAccessControl contract.
     * @param _proNFT Address of the Pro NFT contract.
     * @param _groupNFT Address of the Group NFT contract.
     */
    constructor(address _accessControl, address _proNFT, address _groupNFT) {
        require(_accessControl != address(0), "Invalid AccessControl address");
        require(_proNFT != address(0), "Invalid Pro NFT address");
        require(_groupNFT != address(0), "Invalid Group NFT address");

        accessControl = CookMoreAccessControl(_accessControl);
        proNFT = IERC721(_proNFT);
        groupNFT = IERC721(_groupNFT);
        profileCounter = 0;
    }

    /// @dev Restricts actions to Admins.
    modifier onlyAdmin() {
        require(accessControl.hasRole(accessControl.ADMIN_ROLE(), msg.sender), "Not an Admin");
        _;
    }

    /// @dev Restricts actions to Profile Owners.
    modifier onlyProfileOwner() {
        require(profiles[msg.sender].exists, "Profile does not exist");
        _;
    }

    /// @notice Creates a new profile. Free profiles don't require NFT, Pro/Group profiles do.
    /// @param _metadataURI URI of the profile metadata.
    /// @param _tier The tier of profile to create (FREE, PRO, or GROUP)
    function createProfile(string memory _metadataURI, ProfileTier _tier) external whenNotPaused {
        require(!profiles[msg.sender].exists, "Profile already exists");
        
        // For PRO and GROUP tiers, verify NFT ownership
        if (_tier == ProfileTier.PRO) {
            require(proNFT.balanceOf(msg.sender) > 0, "Must own Pro tier NFT");
        } else if (_tier == ProfileTier.GROUP) {
            require(groupNFT.balanceOf(msg.sender) > 0, "Must own Group tier NFT");
        }
        // FREE tier does not require any NFT ownership

        profileCounter++;
        profiles[msg.sender] = Profile({
            profileId: profileCounter,
            wallet: msg.sender,
            metadataURI: _metadataURI,
            tier: _tier,
            exists: true
        });

        emit ProfileCreated(msg.sender, profileCounter, _metadataURI, _tier);
    }

    /// @notice Updates the metadata URI of the sender's profile.
    /// @param _metadataURI New URI for the profile metadata.
    function updateProfile(string memory _metadataURI) external onlyProfileOwner whenNotPaused {
        Profile storage profile = profiles[msg.sender];
        
        // For PRO and GROUP tiers, verify NFT ownership is maintained
        if (profile.tier == ProfileTier.PRO) {
            require(proNFT.balanceOf(msg.sender) > 0, "Must maintain Pro tier NFT");
        } else if (profile.tier == ProfileTier.GROUP) {
            require(groupNFT.balanceOf(msg.sender) > 0, "Must maintain Group tier NFT");
        }

        profile.metadataURI = _metadataURI;
        emit ProfileUpdated(msg.sender, profile.profileId, _metadataURI, profile.tier);
    }

    /// @notice Upgrades a profile's tier when user acquires a new NFT
    function upgradeTier() external onlyProfileOwner whenNotPaused {
        Profile storage profile = profiles[msg.sender];
        
        // Determine highest tier based on NFT ownership
        ProfileTier newTier;
        if (groupNFT.balanceOf(msg.sender) > 0) {
            newTier = ProfileTier.GROUP;
        } else if (proNFT.balanceOf(msg.sender) > 0) {
            newTier = ProfileTier.PRO;
        } else {
            revert("Must own a valid Tier NFT");
        }
        
        require(newTier > profile.tier, "Can only upgrade to higher tier");
        
        profile.tier = newTier;
        emit ProfileTierUpgraded(msg.sender, profile.profileId, newTier);
    }

    /// @notice Admin function to delete a profile.
    /// @param _wallet Address of the profile to delete.
    function adminDeleteProfile(address _wallet) external onlyAdmin whenNotPaused {
        require(profiles[_wallet].exists, "Profile does not exist");
        uint256 profileId = profiles[_wallet].profileId;
        delete profiles[_wallet];
        emit ProfileDeleted(_wallet, profileId);
    }

    /// @notice Batch delete profiles (admin only)
    /// @param _wallets Array of wallet addresses to delete
    function batchDeleteProfiles(address[] calldata _wallets) external onlyAdmin whenNotPaused {
        for (uint256 i = 0; i < _wallets.length; i++) {
            if (profiles[_wallets[i]].exists) {
                uint256 profileId = profiles[_wallets[i]].profileId;
                delete profiles[_wallets[i]];
                emit ProfileDeleted(_wallets[i], profileId);
            }
        }
    }

    /// @notice Updates the NFT contract addresses
    /// @param _proNFT New Pro NFT contract address
    /// @param _groupNFT New Group NFT contract address
    function updateNFTContracts(address _proNFT, address _groupNFT) external onlyAdmin {
        require(_proNFT != address(0), "Invalid Pro NFT address");
        require(_groupNFT != address(0), "Invalid Group NFT address");
        proNFT = IERC721(_proNFT);
        groupNFT = IERC721(_groupNFT);
        emit NFTContractsUpdated(_proNFT, _groupNFT);
    }

    /// @notice Check if a wallet has an active profile
    /// @param _wallet Address to check
    /// @return bool True if the wallet has an active profile
    function hasProfile(address _wallet) external view returns (bool) {
        return profiles[_wallet].exists;
    }

    /// @notice Get total number of profiles
    /// @return uint256 Total number of profiles created
    function getTotalProfiles() external view returns (uint256) {
        return profileCounter;
    }

    /// @notice Retrieves the profile associated with a wallet address.
    /// @param _wallet Address of the profile owner.
    /// @return Profile structure of the specified wallet.
    function getProfile(address _wallet) external view returns (Profile memory) {
        return profiles[_wallet];
    }

    /// @notice Pauses the contract in case of an emergency.
    function pause() external onlyAdmin {
        _pause();
    }

    /// @notice Unpauses the contract.
    function unpause() external onlyAdmin {
        _unpause();
    }
}
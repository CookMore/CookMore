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
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title CookMoreMetadata
/// @notice Manages metadata for profiles and enables content moderation.
/// @dev Works alongside CookMoreTier and AccessControl contracts.
contract CookMoreMetadata is AccessControl {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant FEATURE_MANAGER_ROLE = keccak256("FEATURE_MANAGER_ROLE");
    bytes32 public constant CONTENT_MODERATOR_ROLE = keccak256("CONTENT_MODERATOR_ROLE");

    // Profile Metadata structure
    struct Metadata {
        uint256 profileId;
        string name;
        string bio;
        string avatar;
        string ipfsNotesCID;
        bool flagged; // Status to mark malicious content
    }

    Counters.Counter private profileCounter;
    mapping(uint256 => Metadata) private metadataStore;

    /// @dev Events
    event MetadataCreated(uint256 indexed profileId, string name, string bio, string avatar, string ipfsNotesCID);
    event MetadataUpdated(uint256 indexed profileId, string name, string bio, string avatar, string ipfsNotesCID);
    event MetadataFlagged(uint256 indexed profileId, string placeholderCID);

    /// @notice Constructor sets up the initial admin role.
    /// @param _admin Address of the initial admin.
    constructor(address _admin) {
        require(_admin != address(0), "Invalid admin address");
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
    }

    /// @notice Create metadata for a new profile.
    /// @param name Name of the profile.
    /// @param bio Bio or description of the profile.
    /// @param avatar IPFS CID for the avatar image.
    /// @param ipfsNotesCID IPFS CID for additional notes.
    /// @return profileId The generated profile ID.
    function createMetadata(
        string calldata name,
        string calldata bio,
        string calldata avatar,
        string calldata ipfsNotesCID
    ) external onlyRole(FEATURE_MANAGER_ROLE) returns (uint256) {
        profileCounter.increment();
        uint256 profileId = profileCounter.current();

        metadataStore[profileId] = Metadata({
            profileId: profileId,
            name: name,
            bio: bio,
            avatar: avatar,
            ipfsNotesCID: ipfsNotesCID,
            flagged: false
        });

        emit MetadataCreated(profileId, name, bio, avatar, ipfsNotesCID);
        return profileId;
    }

    /// @notice Update existing metadata for a profile.
    /// @param profileId The ID of the profile to update.
    /// @param name Updated name of the profile.
    /// @param bio Updated bio of the profile.
    /// @param avatar Updated avatar CID.
    /// @param ipfsNotesCID Updated notes CID.
    function updateMetadata(
        uint256 profileId,
        string calldata name,
        string calldata bio,
        string calldata avatar,
        string calldata ipfsNotesCID
    ) external onlyRole(FEATURE_MANAGER_ROLE) {
        require(metadataStore[profileId].profileId != 0, "Metadata does not exist");
        require(!metadataStore[profileId].flagged, "Metadata flagged, cannot update");

        metadataStore[profileId].name = name;
        metadataStore[profileId].bio = bio;
        metadataStore[profileId].avatar = avatar;
        metadataStore[profileId].ipfsNotesCID = ipfsNotesCID;

        emit MetadataUpdated(profileId, name, bio, avatar, ipfsNotesCID);
    }

    /// @notice Flag metadata as malicious and replace it with a placeholder.
    /// @param profileId The ID of the profile to flag.
    /// @param placeholderCID The IPFS CID for the placeholder content.
    function flagMetadata(uint256 profileId, string calldata placeholderCID) external onlyRole(CONTENT_MODERATOR_ROLE) {
        require(metadataStore[profileId].profileId != 0, "Metadata does not exist");
        metadataStore[profileId].flagged = true;

        metadataStore[profileId].name = "Flagged";
        metadataStore[profileId].bio = "Content flagged for abuse";
        metadataStore[profileId].avatar = placeholderCID;
        metadataStore[profileId].ipfsNotesCID = "Flagged";

        emit MetadataFlagged(profileId, placeholderCID);
    }

    /// @notice Retrieve metadata for a specific profile.
    /// @param profileId The ID of the profile to fetch metadata for.
    /// @return Metadata The profile's metadata.
    function getMetadata(uint256 profileId) external view returns (Metadata memory) {
        require(metadataStore[profileId].profileId != 0, "Metadata does not exist");
        return metadataStore[profileId];
    }
}

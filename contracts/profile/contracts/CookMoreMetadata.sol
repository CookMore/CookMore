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


 CookMoreMetadata System
 ==========================
 Manages and stores on-chain metadata for user profiles, including integration with off-chain data (IPFS).
*/


import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./CookMoreProfileRegistry.sol";
import "./CookMoreAccessControl.sol";


/// @title CookMoreMetadata
/// @notice Stores and manages on-chain metadata, with references to off-chain IPFS notes.
contract CookMoreMetadata is AccessControl, Pausable {
   bytes32 public constant METADATA_MANAGER_ROLE = keccak256("METADATA_MANAGER_ROLE");


   struct Metadata {
       uint256 profileId;
       string name;
       string bio;
       string avatar; // Profile picture URI
       string ipfsNotesCID; // CID for additional notes
       bool exists;
   }


   CookMoreProfileRegistry public profileRegistry;
   CookMoreAccessControl public accessControl;


   mapping(uint256 => Metadata) private metadataStore;
   mapping(address => uint256) private walletToProfileId;


   event MetadataCreated(uint256 profileId, string name, string bio, string avatar, string ipfsNotesCID);
   event MetadataUpdated(uint256 profileId, string name, string bio, string avatar, string ipfsNotesCID);


   constructor(address _accessControl, address _profileRegistry) {
       require(_accessControl != address(0), "Invalid AccessControl address");
       require(_profileRegistry != address(0), "Invalid ProfileRegistry address");


       accessControl = CookMoreAccessControl(_accessControl);
       profileRegistry = CookMoreProfileRegistry(_profileRegistry);


       _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
       _grantRole(METADATA_MANAGER_ROLE, msg.sender);
   }


   /// @notice Creates metadata for a profile.
   function createMetadata(
       uint256 profileId,
       string calldata name,
       string calldata bio,
       string calldata avatar,
       string calldata ipfsNotesCID
   ) external onlyRole(METADATA_MANAGER_ROLE) whenNotPaused {
       address wallet = profileRegistry.getProfile(msg.sender).wallet;
       require(wallet != address(0), "Profile does not exist");
       require(!metadataStore[profileId].exists, "Metadata already exists");


       metadataStore[profileId] = Metadata({
           profileId: profileId,
           name: name,
           bio: bio,
           avatar: avatar,
           ipfsNotesCID: ipfsNotesCID,
           exists: true
       });


       walletToProfileId[wallet] = profileId;


       emit MetadataCreated(profileId, name, bio, avatar, ipfsNotesCID);
   }


   /// @notice Updates metadata for a profile.
   function updateMetadata(
       uint256 profileId,
       string calldata name,
       string calldata bio,
       string calldata avatar,
       string calldata ipfsNotesCID
   ) external onlyRole(METADATA_MANAGER_ROLE) whenNotPaused {
       require(metadataStore[profileId].exists, "Metadata does not exist");


       Metadata storage metadata = metadataStore[profileId];
       metadata.name = name;
       metadata.bio = bio;
       metadata.avatar = avatar;
       metadata.ipfsNotesCID = ipfsNotesCID;


       emit MetadataUpdated(profileId, name, bio, avatar, ipfsNotesCID);
   }


   /// @notice Retrieves metadata for a profile.
   function getMetadata(uint256 profileId) external view returns (Metadata memory) {
       require(metadataStore[profileId].exists, "Metadata does not exist");
       return metadataStore[profileId];
   }
}



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
import "@openzeppelin/contracts/access/Ownable.sol";


interface ICookMoreTier {
   function isGroupTier(uint256 tokenId) external view returns (bool);
   function ownerOf(uint256 tokenId) external view returns (address);
}


/// @title CookMoreAccessControl
/// @notice Provides role-based permissions and token-gated access controls.
contract CookMoreAccessControl is AccessControl, Pausable, Ownable {
   // Roles
   bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
   bytes32 public constant FEATURE_MANAGER_ROLE = keccak256("FEATURE_MANAGER_ROLE");


   ICookMoreTier public cookMoreTier;


   /// @notice Initializes the contract and assigns roles.
   /// @param _initialAdmin The address to assign the ADMIN_ROLE.
   /// @param _cookMoreTier The address of the CookMoreTier contract.
   constructor(address _initialAdmin, address _cookMoreTier) Ownable(_initialAdmin) {
       require(_initialAdmin != address(0), "Initial admin cannot be zero address");
       require(_cookMoreTier != address(0), "CookMoreTier address cannot be zero");


       cookMoreTier = ICookMoreTier(_cookMoreTier);


       _grantRole(DEFAULT_ADMIN_ROLE, _initialAdmin);
       _grantRole(ADMIN_ROLE, _initialAdmin);
   }


   /// @notice Restrict access to Pro tier users.
   modifier onlyProTier(uint256 tokenId) {
       require(!cookMoreTier.isGroupTier(tokenId), "Group tier required");
       require(cookMoreTier.ownerOf(tokenId) == msg.sender, "Not the token owner");
       _;
   }


   /// @notice Restrict access to Group tier users.
   modifier onlyGroupTier(uint256 tokenId) {
       require(cookMoreTier.isGroupTier(tokenId), "Pro tier not sufficient");
       require(cookMoreTier.ownerOf(tokenId) == msg.sender, "Not the token owner");
       _;
   }


   /// @notice Grant Feature Manager role.
   /// @param account Address to grant the role.
   function grantFeatureManager(address account) external onlyRole(ADMIN_ROLE) {
       _grantRole(FEATURE_MANAGER_ROLE, account);
   }


   /// @notice Revoke Feature Manager role.
   /// @param account Address to revoke the role.
   function revokeFeatureManager(address account) external onlyRole(ADMIN_ROLE) {
       _revokeRole(FEATURE_MANAGER_ROLE, account);
   }


   /// @notice Pause the contract (Admin only).
   function pause() external onlyRole(ADMIN_ROLE) {
       _pause();
   }


   /// @notice Unpause the contract (Admin only).
   function unpause() external onlyRole(ADMIN_ROLE) {
       _unpause();
   }


   /// @notice Example restricted feature for Pro tier users.
   /// @param tokenId Token ID of the user.
   function accessProFeature(uint256 tokenId) external view onlyProTier(tokenId) whenNotPaused {
       // Logic for Pro-tier specific feature
   }


   /// @notice Example restricted feature for Group tier users.
   /// @param tokenId Token ID of the user.
   function accessGroupFeature(uint256 tokenId) external view onlyGroupTier(tokenId) whenNotPaused {
       // Logic for Group-tier specific feature
   }
}

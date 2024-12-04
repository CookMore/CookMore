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
 A tiered NFT membership system with Pro and Group levels.
 Features dynamic metadata, USDC payments, and upgradability.
*/


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/// @title CookMoreTier
/// @notice Implements a tiered NFT membership system with Pro and Group levels.
contract CookMoreTier is ERC721URIStorage, ReentrancyGuard, Ownable {
   IERC20 public immutable usdc;
   uint256 public immutable proPrice;
   uint256 public immutable groupPrice;


   string private proBaseURI;
   string private groupBaseURI;


   uint256 private tokenIdCounter;


   mapping(uint256 => bool) public isGroupTier;


   /// @dev Events
   event Minted(address indexed user, uint256 tokenId, string tier);
   event Upgraded(address indexed user, uint256 tokenId);
   event Gifted(address indexed from, address indexed to, uint256 tokenId, string tier);


   /// @param _usdc Address of the USDC token contract.
   /// @param _proPrice Price for minting a Pro NFT in USDC.
   /// @param _groupPrice Price for minting a Group NFT in USDC.
  constructor(
   address _usdc,
   uint256 _proPrice,
   uint256 _groupPrice
) ERC721("CookMoreTier Membership NFT", "TIER") Ownable(msg.sender) {
   require(_usdc != address(0), "Invalid USDC address");
   require(_proPrice > 0, "Pro price must be greater than zero");
   require(_groupPrice > _proPrice, "Group price must be greater than Pro price");


   usdc = IERC20(_usdc);
   proPrice = _proPrice;
   groupPrice = _groupPrice;
   tokenIdCounter = 0;
}




   /// @dev Mint a Pro NFT.
   function mintPro() external nonReentrant {
       require(usdc.transferFrom(msg.sender, address(this), proPrice), "USDC transfer failed");


       _mintTier(msg.sender, false);
   }


   /// @dev Mint a Group NFT.
   function mintGroup() external nonReentrant {
       require(usdc.transferFrom(msg.sender, address(this), groupPrice), "USDC transfer failed");


       _mintTier(msg.sender, true);
   }


   /// @dev Gift a Pro or Group NFT to another address.
   function giftTier(address recipient, bool groupTier) external nonReentrant {
       require(recipient != address(0), "Invalid recipient address");


       uint256 cost = groupTier ? groupPrice : proPrice;
       require(usdc.transferFrom(msg.sender, address(this), cost), "USDC transfer failed");


       _mintTier(recipient, groupTier);


       emit Gifted(msg.sender, recipient, tokenIdCounter, groupTier ? "Group" : "Pro");
   }


   /// @dev Admin mint a Pro or Group NFT to a user for free.
   function adminMint(address recipient, bool groupTier) external onlyOwner {
       require(recipient != address(0), "Invalid recipient address");


       _mintTier(recipient, groupTier);
   }


   /// @dev Upgrade a Pro NFT to Group tier.
   function upgradeToGroup(uint256 tokenId) external nonReentrant {
       require(ownerOf(tokenId) == msg.sender, "Caller is not the token owner");
       require(!isGroupTier[tokenId], "Token is already Group tier");


       uint256 upgradeCost = groupPrice - proPrice;
       require(usdc.transferFrom(msg.sender, address(this), upgradeCost), "USDC transfer failed");


       isGroupTier[tokenId] = true;
       _setTokenURI(tokenId, groupBaseURI);


       emit Upgraded(msg.sender, tokenId);
   }


   /// @dev Set metadata base URIs for Pro and Group NFTs.
   function setBaseURIs(string calldata _proBaseURI, string calldata _groupBaseURI) external onlyOwner {
       proBaseURI = _proBaseURI;
       groupBaseURI = _groupBaseURI;
   }


   /// @dev Withdraw accumulated USDC.
   function withdrawFunds() external onlyOwner {
       uint256 balance = usdc.balanceOf(address(this));
       require(balance > 0, "No funds to withdraw");


       require(usdc.transfer(owner(), balance), "USDC withdrawal failed");
   }


   /// @dev Internal function to mint a tier NFT.
   function _mintTier(address recipient, bool groupTier) internal {
       uint256 tokenId = ++tokenIdCounter;
       _mint(recipient, tokenId);


       isGroupTier[tokenId] = groupTier;
       _setTokenURI(tokenId, groupTier ? groupBaseURI : proBaseURI);


       emit Minted(recipient, tokenId, groupTier ? "Group" : "Pro");
   }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IAccessControl {
    function hasRole(bytes32 role, address account) external view returns (bool);
    function ADMIN_ROLE() external view returns (bytes32);
    function CONTENT_MODERATOR_ROLE() external view returns (bytes32);
}

/**
 * @title StickyNoteNFT
 * @notice An ERC-721 contract for sticky note NFTs with role-based burning capabilities.
 */
contract StickyNoteNFT is ERC721Enumerable {
    using Counters for Counters.Counter;

    // Counter for token IDs
    Counters.Counter private _tokenIdCounter;

    // Access Control contract
    IAccessControl public accessControl;

    // Metadata structure
    struct NoteMetadata {
        string name; // Name of the note
        string description; // Description of the note
        string text; // Main text content
        string color; // Hex color value
        uint256 fontSize; // Font size
        string metadataURI; // Off-chain metadata URI (e.g., IPFS)
    }

    // Mapping token ID to metadata
    mapping(uint256 => NoteMetadata) private _tokenMetadata;

    // Events
    event NoteMinted(address indexed owner, uint256 indexed tokenId, string name, string description, string text, string color, uint256 fontSize, string metadataURI);
    event NoteBurned(uint256 indexed tokenId);
    event NoteUpdated(uint256 indexed tokenId, string name, string description, string text, string color, uint256 fontSize, string metadataURI);

    /**
     * @notice Constructor to initialize the StickyNoteNFT contract.
     * @param accessControlAddress The address of the AccessControl contract.
     */
    constructor(address accessControlAddress) ERC721("StickyNoteNFT", "NOTE") {
        require(accessControlAddress != address(0), "Invalid AccessControl address");
        accessControl = IAccessControl(accessControlAddress);
    }

    /**
     * @notice Helper function to check if a token exists.
     * @param tokenId The ID of the token to check.
     * @return True if the token exists, false otherwise.
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return bytes(_tokenMetadata[tokenId].name).length > 0;
    }

    /**
     * @notice Mint a new sticky note NFT.
     * @param name The name of the note.
     * @param description A brief description of the note.
     * @param text The text content of the note (max 500 characters).
     * @param color The hex color code for the note.
     * @param fontSize The font size for the note.
     * @param metadataURI The URI for off-chain metadata.
     */
    function mint(
        string memory name,
        string memory description,
        string memory text,
        string memory color,
        uint256 fontSize,
        string memory metadataURI
    ) external {
        require(bytes(text).length <= 500, "Text exceeds 500 characters");
        require(bytes(color).length == 7 && bytes(color)[0] == '#', "Invalid color format");
        require(fontSize > 0 && fontSize <= 72, "Invalid font size");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _mint(msg.sender, tokenId);
        _tokenMetadata[tokenId] = NoteMetadata(name, description, text, color, fontSize, metadataURI);

        emit NoteMinted(msg.sender, tokenId, name, description, text, color, fontSize, metadataURI);
    }

    /**
     * @notice Batch mint new sticky note NFTs.
     * @param recipients Array of recipient addresses.
     * @param names Array of names for each note.
     * @param descriptions Array of descriptions for each note.
     * @param texts Array of text content for each note.
     * @param colors Array of hex color codes for each note.
     * @param fontSizes Array of font sizes for each note.
     * @param metadataURIs Array of URIs for off-chain metadata for each note.
     */
    function batchMint(
        address[] memory recipients,
        string[] memory names,
        string[] memory descriptions,
        string[] memory texts,
        string[] memory colors,
        uint256[] memory fontSizes,
        string[] memory metadataURIs
    ) external {
        require(
            recipients.length == names.length &&
            names.length == descriptions.length &&
            descriptions.length == texts.length &&
            texts.length == colors.length &&
            colors.length == fontSizes.length &&
            fontSizes.length == metadataURIs.length,
            "Input arrays must have the same length"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            require(bytes(texts[i]).length <= 500, "Text exceeds 500 characters");
            require(bytes(colors[i]).length == 7 && bytes(colors[i])[0] == '#', "Invalid color format");
            require(fontSizes[i] > 0 && fontSizes[i] <= 72, "Invalid font size");

            _tokenIdCounter.increment();
            uint256 tokenId = _tokenIdCounter.current();

            _mint(recipients[i], tokenId);
            _tokenMetadata[tokenId] = NoteMetadata(names[i], descriptions[i], texts[i], colors[i], fontSizes[i], metadataURIs[i]);

            emit NoteMinted(recipients[i], tokenId, names[i], descriptions[i], texts[i], colors[i], fontSizes[i], metadataURIs[i]);
        }
    }

    /**
     * @notice Batch burn sticky note NFTs.
     * @param tokenIds Array of token IDs to burn.
     */
    function batchBurn(uint256[] memory tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(ownerOf(tokenId) == msg.sender, "You do not own this token");
            _burn(tokenId);
            delete _tokenMetadata[tokenId];

            emit NoteBurned(tokenId);
        }
    }

    /**
     * @notice Burn a sticky note NFT that the caller owns.
     * @param tokenId The ID of the token to burn.
     */
    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "You do not own this token");
        _burn(tokenId);
        delete _tokenMetadata[tokenId];

        emit NoteBurned(tokenId);
    }

    /**
     * @notice Admin or Content Moderator function to burn any NFT.
     * @param tokenId The ID of the token to burn.
     */
    function adminBurn(uint256 tokenId) external {
        require(
            accessControl.hasRole(accessControl.ADMIN_ROLE(), msg.sender) || 
            accessControl.hasRole(accessControl.CONTENT_MODERATOR_ROLE(), msg.sender),
            "Not authorized"
        );
        _burn(tokenId);
        delete _tokenMetadata[tokenId];

        emit NoteBurned(tokenId);
    }

    /**
     * @notice Update metadata of a sticky note NFT.
     * @param tokenId The ID of the token to update.
     * @param name The new name of the note.
     * @param description The new description of the note.
     * @param text The new text content of the note.
     * @param color The new hex color code for the note.
     * @param fontSize The new font size for the note.
     * @param metadataURI The new URI for off-chain metadata.
     */
    function updateMetadata(
        uint256 tokenId,
        string memory name,
        string memory description,
        string memory text,
        string memory color,
        uint256 fontSize,
        string memory metadataURI
    ) external {
        require(ownerOf(tokenId) == msg.sender, "You do not own this token");
        require(bytes(text).length <= 500, "Text exceeds 500 characters");
        require(bytes(color).length == 7 && bytes(color)[0] == '#', "Invalid color format");
        require(fontSize > 0 && fontSize <= 72, "Invalid font size");

        _tokenMetadata[tokenId] = NoteMetadata(name, description, text, color, fontSize, metadataURI);

        emit NoteUpdated(tokenId, name, description, text, color, fontSize, metadataURI);
    }

    /**
     * @notice Get metadata for a token.
     * @param tokenId The ID of the token to fetch metadata for.
     * @return name The name of the note.
     * @return description The description of the note.
     * @return text The text content of the note.
     * @return color The hex color code of the note.
     * @return fontSize The font size of the note.
     * @return metadataURI The URI for off-chain metadata.
     */
    function getMetadata(uint256 tokenId) external view returns (
        string memory name,
        string memory description,
        string memory text,
        string memory color,
        uint256 fontSize,
        string memory metadataURI
    ) {
        require(_exists(tokenId), "Token does not exist");
        NoteMetadata memory metadata = _tokenMetadata[tokenId];
        return (metadata.name, metadata.description, metadata.text, metadata.color, metadata.fontSize, metadata.metadataURI);
    }

    /**
     * @notice Get all NFTs owned by a specific address.
     * @param _owner The address to query for owned tokens.
     * @return ids Array of token IDs owned by the address.
     * @return names Array of names for each token.
     * @return descriptions Array of descriptions for each token.
     * @return texts Array of text content for each token.
     * @return colors Array of hex color codes for each token.
     * @return fontSizes Array of font sizes for each token.
     * @return metadataURIs Array of URIs for off-chain metadata for each token.
     */
    function getNft(address _owner) public view returns (
        uint256[] memory ids,
        string[] memory names,
        string[] memory descriptions,
        string[] memory texts,
        string[] memory colors,
        uint256[] memory fontSizes,
        string[] memory metadataURIs
    ) {
        uint256 count = balanceOf(_owner);
        require(count > 0, "Owner has no NFTs");

        ids = new uint256[](count);
        names = new string[](count);
        descriptions = new string[](count);
        texts = new string[](count);
        colors = new string[](count);
        fontSizes = new uint256[](count);
        metadataURIs = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(_owner, i);
            ids[i] = tokenId;

            NoteMetadata memory metadata = _tokenMetadata[tokenId];
            names[i] = metadata.name;
            descriptions[i] = metadata.description;
            texts[i] = metadata.text;
            colors[i] = metadata.color;
            fontSizes[i] = metadata.fontSize;
            metadataURIs[i] = metadata.metadataURI;
        }
    }
}

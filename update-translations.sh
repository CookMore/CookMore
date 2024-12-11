#!/bin/bash

# Array of languages
languages=("en" "es" "fr" "de" "it" "pt" "ru" "ja" "ko" "zh" "ar" "hi")

# Create messages directory if it doesn't exist
mkdir -p src/messages

# Generate language files
for lang in "${languages[@]}"; do
  # Create language directory if it doesn't exist
  mkdir -p "src/messages/$lang"
  
  # Create common.json for each language
  cat > "src/messages/$lang/common.json" << 'JSON'
{
  "app": {
    "name": "CookMore",
    "description": "Decentralized Recipe Management",
    "tagline": "Cook, Share, Earn"
  },
  "navigation": {
    "home": "Home",
    "explore": "Explore",
    "kitchen": "Kitchen",
    "profile": "Profile",
    "settings": "Settings"
  },
  "wallet": {
    "connect": "Connect Wallet",
    "disconnect": "Disconnect Wallet",
    "connecting": "Connecting...",
    "connected": "Connected",
    "notConnected": "Not Connected",
    "copy": "Copy Address",
    "copied": "Copied!",
    "network": {
      "title": "Network",
      "base": "Base",
      "baseSepolia": "Base Sepolia",
      "unsupported": "Unsupported Network"
    },
    "types": {
      "embedded": "Embedded Wallet",
      "coinbase": "Coinbase Wallet",
      "other": "External Wallet"
    },
    "errors": {
      "connect": "Failed to connect wallet",
      "disconnect": "Failed to disconnect wallet",
      "network": "Please switch to a supported network"
    }
  },
  "profile": {
    "tiers": {
      "free": "Free",
      "pro": "Pro",
      "group": "Group"
    },
    "actions": {
      "create": "Create Profile",
      "edit": "Edit Profile",
      "save": "Save Changes",
      "delete": "Delete Profile"
    },
    "status": {
      "loading": "Loading Profile...",
      "error": "Error Loading Profile",
      "notFound": "Profile Not Found",
      "verified": "Verified",
      "unverified": "Unverified"
    }
  },
  "ipfs": {
    "upload": {
      "start": "Starting Upload...",
      "progress": "Uploading: {progress}%",
      "success": "Upload Complete",
      "error": "Upload Failed"
    },
    "gateway": {
      "pinata": "Pinata Gateway",
      "infura": "Infura Gateway",
      "fallback": "Fallback Gateway"
    }
  },
  "nft": {
    "mint": {
      "start": "Starting Mint...",
      "pending": "Transaction Pending...",
      "success": "NFT Minted Successfully",
      "error": "Mint Failed"
    },
    "tiers": {
      "check": "Checking Tier Status...",
      "update": "Updating Tier...",
      "error": "Error Checking Tier"
    }
  },
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "submit": "Submit",
    "confirm": "Confirm"
  }
}
JSON
done

echo "Translation files updated successfully!"

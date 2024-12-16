export const PROFILE_REGISTRY_ABI = [
  // Read functions
  {
    inputs: [{ internalType: 'address', name: '_wallet', type: 'address' }],
    name: 'hasProfile',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_wallet', type: 'address' }],
    name: 'getProfile',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'profileId', type: 'uint256' },
          { internalType: 'address', name: 'wallet', type: 'address' },
          { internalType: 'string', name: 'metadataURI', type: 'string' },
          { internalType: 'enum CookMoreProfileRegistry.ProfileTier', name: 'tier', type: 'uint8' },
          { internalType: 'bool', name: 'exists', type: 'bool' },
        ],
        internalType: 'struct CookMoreProfileRegistry.Profile',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalProfiles',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [
      { internalType: 'string', name: '_metadataURI', type: 'string' },
      { internalType: 'enum CookMoreProfileRegistry.ProfileTier', name: '_tier', type: 'uint8' },
    ],
    name: 'createProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_metadataURI', type: 'string' }],
    name: 'updateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'upgradeTier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Contract references
  {
    inputs: [],
    name: 'accessControl',
    outputs: [{ internalType: 'contract CookMoreAccessControl', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proNFT',
    outputs: [{ internalType: 'contract IERC721', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'groupNFT',
    outputs: [{ internalType: 'contract IERC721', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'wallet', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'metadataURI', type: 'string' },
      {
        indexed: false,
        internalType: 'enum CookMoreProfileRegistry.ProfileTier',
        name: 'tier',
        type: 'uint8',
      },
    ],
    name: 'ProfileCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'wallet', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'metadataURI', type: 'string' },
      {
        indexed: false,
        internalType: 'enum CookMoreProfileRegistry.ProfileTier',
        name: 'tier',
        type: 'uint8',
      },
    ],
    name: 'ProfileUpdated',
    type: 'event',
  },
] as const

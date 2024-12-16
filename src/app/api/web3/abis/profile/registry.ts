export const PROFILE_REGISTRY_ABI = [
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
    inputs: [
      { internalType: 'string', name: '_metadataURI', type: 'string' },
      { internalType: 'enum CookMoreProfileRegistry.ProfileTier', name: '_tier', type: 'uint8' },
    ],
    name: 'createProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

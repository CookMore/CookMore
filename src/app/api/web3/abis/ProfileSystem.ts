export const PROFILE_SYSTEM_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataURI',
        type: 'string',
      },
      {
        internalType: 'enum CookMoreProfileRegistry.ProfileTier',
        name: '_tier',
        type: 'uint8',
      },
    ],
    name: 'createProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function' as const,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_wallet',
        type: 'address',
      },
    ],
    name: 'getProfile',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'metadataURI',
            type: 'string',
          },
          {
            internalType: 'enum CookMoreProfileRegistry.ProfileTier',
            name: 'tier',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'exists',
            type: 'bool',
          },
        ],
        internalType: 'struct CookMoreProfileRegistry.Profile',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function' as const,
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataURI',
        type: 'string',
      },
    ],
    name: 'updateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function' as const,
  },
  {
    inputs: [
      {
        internalType: 'enum CookMoreProfileRegistry.ProfileTier',
        name: '_tier',
        type: 'uint8',
      },
    ],
    name: 'upgradeTier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function' as const,
  },
] as const

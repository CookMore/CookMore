// e.g., in a config file or constants
export const JOB_TIERS = {
  '3-months': {
    label: '3 months',
    priceUSD: 10,
    durationDays: 90,
  },
  '6-months': {
    label: '6 months',
    priceUSD: 20,
    durationDays: 180,
  },
  '1-year': {
    label: '1 year',
    priceUSD: 30,
    durationDays: 365,
  },
} as const

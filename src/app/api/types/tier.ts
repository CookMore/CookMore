export const mapTierDataToTierType = (tierData: any): TierType => {
  // Add proper mapping logic based on your contract's return values
  switch (tierData.toString()) {
    case '0':
      return 'LTE'
    case '1':
      return 'BASIC'
    case '2':
      return 'PRO'
    default:
      return 'LTE'
  }
}

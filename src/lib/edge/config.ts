export const edgeConfig = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1'], // Key regions for low latency
  maxDuration: 5000, // 5 second timeout
}

export const edgeHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
}

export const customSerializer = {
  serialize: (value: any) => {
    if (typeof value === 'bigint') {
      return value.toString()
    }
    return value
  },
}

// Use this in your QueryClient config:
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ... other options
      serialize: customSerializer.serialize,
    },
  },
})

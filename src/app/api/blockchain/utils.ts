export function serializeBigInt<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'bigint') {
    return Number(obj) as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt) as unknown as T
  }

  if (typeof obj === 'object') {
    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      result[key] = serializeBigInt(value)
    }
    return result as T
  }

  return obj
}

// Custom replacer function for JSON.stringify
export const bigIntReplacer = (_key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString()
  }
  return value
}

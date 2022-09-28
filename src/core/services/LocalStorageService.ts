

export const setLocalCacheItem = async (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalCacheItem = async (key: string) => {
  const storedItemString = localStorage.getItem(key)
  if (!storedItemString)
    return null

  return JSON.parse(storedItemString)
}
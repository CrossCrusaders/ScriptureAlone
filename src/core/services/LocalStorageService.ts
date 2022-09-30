

export const setLocalCacheItem = async (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalCacheItem = async (key: string) => {
  const storedItemString = localStorage.getItem(key)
  if (!storedItemString)
    return null

  return JSON.parse(storedItemString)
}


export const setSessionCacheItem = async (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export const getSessionCacheItem = async (key: string) => {
  const storedItemString = sessionStorage.getItem(key)
  if (!storedItemString)
    return null

  return JSON.parse(storedItemString)
}
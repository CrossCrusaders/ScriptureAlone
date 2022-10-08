

export const setLocalCacheItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalCacheItem = (key: string) => {
  const storedItemString = localStorage.getItem(key)
  if (!storedItemString)
    return null

  return JSON.parse(storedItemString)
}


export const setSessionCacheItem = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export const getSessionCacheItem = (key: string) => {
  const storedItemString = sessionStorage.getItem(key)
  if (!storedItemString)
    return null

  return JSON.parse(storedItemString)
}
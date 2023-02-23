

export const setLocalCacheItem = (key: string, value: any, isJson: boolean) => {
  if(isJson)
    localStorage.setItem(key, JSON.stringify(value))
  else
    localStorage.setItem(key, value)
}

export const getLocalCacheItem = (key: string, isJson: boolean) => {
  const storedItemString = localStorage.getItem(key)
  if (!storedItemString)
    return null

  if(!isJson)
    return storedItemString
    
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
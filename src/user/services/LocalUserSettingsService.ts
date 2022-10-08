import { getLocalCacheItem, setLocalCacheItem } from '../../cache/services/LocalStorageService'

export interface UserSettings {
  lastSearchedBibleId?: string
  lastReadBibleId?: string
  lastReadBookId?: number
  lastReadChapter?: number
  visitedBefore?: boolean
}

export type UserSettingsKey = keyof UserSettings

const userSettingsLocalStorageKey = '__sa_user_settings__'

let userSettings: UserSettings = getLocalCacheItem(userSettingsLocalStorageKey)

if (!userSettings) {
  userSettings = {}
}

export function getUserSetting(key: UserSettingsKey) {
  return userSettings[key]
}

export function getUserSettings() {
  return userSettings
}

export function setUserSetting(key: UserSettingsKey, value: any) {
  userSettings[key] = value
  setLocalCacheItem(userSettingsLocalStorageKey, userSettings)
}


export function setUserSettings(settings: Partial<UserSettings>) {
  for (const key in settings) {
    userSettings[key as UserSettingsKey] = settings[key as UserSettingsKey] as any
  }
  setLocalCacheItem(userSettingsLocalStorageKey, userSettings)
}

// TODO: add a bunch of helper functions 
// so we don't have to specify keys everytime
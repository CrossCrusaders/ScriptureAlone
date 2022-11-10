export interface Profile {
  id: string
  name: string
  avatar: string
  bio: string
  pushNotifications: boolean
  emailNotifications: boolean
}

export interface User {
  [x: string]: any
  user: any
  created: Date
  email: string
  id: string
  lastResetSentAt: Date
  lastVerificationSentAt: Date
  profile: Profile
  updated: Date
  verified: boolean
  isNew: boolean
}

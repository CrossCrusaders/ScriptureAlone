import { ref } from "vue"
import PocketBaseClient from "../../api/PocketBaseClient"
import { setLocalCacheItem } from "../../cache/services/LocalStorageService"
import { User } from "../User"

// Global State
const userLocalStorageKey = '__scripture_alone_user__'

const existingToken = localStorage.getItem(userLocalStorageKey)

const token = ref(existingToken)
const user = ref<User | null | undefined>(null)

export const requestResetPasswordLink = async (email: string) => {
  await PocketBaseClient.users.requestPasswordReset(email)
  return true
}

export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
  await PocketBaseClient.users.confirmPasswordReset(token, password, confirmPassword)
  return true
}

export const requestResetEmailLink = async (newEmail: string) => {
  await PocketBaseClient.users.requestEmailChange(newEmail)
  return true
}

export const resetEmail = async (token: string, password: string) => {
  await PocketBaseClient.users.confirmEmailChange(token, password)
  return true
}

// Utility Functions
export const logIn = async ({ email, password }: { email: string, password: string }) => {
  const result = await PocketBaseClient.users.authViaEmail(email, password)
  user.value = result.user as any
  token.value = result.token

  return result
}

export const register = async ({ email, password, username }: { email: string, password: string, username: string }) => {
  const user = await PocketBaseClient.users.create({
    email: email,
    password: password,
    passwordConfirm: password,
  })


  let authedUser = await logIn({ email, password })
  if (!user || !user.profile)
    throw new Error('Failed to create user')


  const updatedProfile = await PocketBaseClient.records.update('profiles', user.profile.id, {
    name: username,
    pushNotifications: true,
    emailNotifications: true,
  })

  authedUser = await logIn({ email, password })
  // send verification email
  // TODO: When we have an email server-- await client.users.requestVerification(user.email)


  return authedUser
}

export const logOut = async () => {
  PocketBaseClient.authStore.clear();
  user.value = null;
}

export const isAuthenticated = async () => {
  return true
}


// Composable
export function useAuth() {
  if (PocketBaseClient.authStore.isValid) {
    user.value = PocketBaseClient.authStore.model as any
    token.value = PocketBaseClient.authStore.token
  }
  return {
    token,
    user,
    isAuthenticated,
    logIn,
    register
  }
}

export async function deleteAccount(email: string, password: string){
  const result = await PocketBaseClient.users.authViaEmail(email, password)
  if(result.user != null && result.user != undefined){
    var DeleteTheAccount = await PocketBaseClient.users.delete(result.user.id);
    var LogOut = await logOut()
  }
}
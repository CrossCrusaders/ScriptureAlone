import PocketBaseClient from "./PocketBaseClient"


export const logIn = async ({ email, password }: { email: string, password: string }) => {
  const result = await PocketBaseClient.users.authViaEmail(email, password)
  return result
}

export const register = async ({ email, password, username }: { email: string, password: string, username: string }) => {
  const user = await PocketBaseClient.users.create({
    email: email,
    password: password,
    passwordConfirm: password,
  })

  const authedUser = await logIn({ email, password })

  if (!user || !user.profile)
    throw new Error('Failed to create user')


  const updatedProfile = await PocketBaseClient.records.update('profiles', user.profile.id, {
    name: username,
  })

  // send verification email
  // TODO: When we have an email server-- await client.users.requestVerification(user.email)

  return authedUser
}
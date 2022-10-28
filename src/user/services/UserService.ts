import { User } from "../../auth/User";
import { getBucketUrl } from "../../api/BucketStorageService";
import { useRouter } from "vue-router";
import { useAuth } from "../../auth/services/AuthService";
import PocketBaseClient from "../../api/PocketBaseClient";
import { UserFavoriteSermon } from "../UserFavoriteSermon";

const { user } = useAuth()

export enum ToggleAction {
  noop,
  deleted,
  created,
}

export async function getUser() {

}

export function getUserProfileImage(user?: User | null | undefined) {
  if (user && user.profile && user.profile.avatar)
    return getBucketUrl(user.profile, user.profile.avatar)

  return "/logo-bible.png"
}

export const defaultImage = '/logo-bible.png'

export async function isUserFavoriteSermon(sermonId: string) {
  if (!user.value)
    return false
  const existingFavorite = await PocketBaseClient.records.getList('userFavoriteSermons', 1, 1, { filter: `user='${user.value.id}' && sermon='${sermonId}'` })
  return !!existingFavorite.items.length
}


export async function toggleUserFavoriteSermon(sermonId: string) {
  if (!user.value)
    return ToggleAction.noop


  const existingFavorite = await PocketBaseClient.records.getList('userFavoriteSermons', 1, 1, { filter: `user='${user.value.id}' && sermon='${sermonId}'` })
  if (existingFavorite.items.length) {
    const deleted = await PocketBaseClient.records.delete('userFavoriteSermons', existingFavorite.items[0].id)
    return ToggleAction.deleted
  }
  else {

    const favorite = await PocketBaseClient.records.create('userFavoriteSermons', {
      sermon: sermonId,
      user: user.value.id
    })
    return ToggleAction.created
  }
}

export async function toggleUserFavoriteDevotionalId(devotionalId: string) {
  if (!user.value)
    return ToggleAction.noop

  const existingFavorite = await PocketBaseClient.records.getList('userFavoriteDevotionals', 1, 1, { filter: `user='${user.value.id}' && devotional='${devotionalId}'` })
  if (existingFavorite.items.length) {
    // TODO: delete
    const deleted = await PocketBaseClient.records.delete('userFavoriteDevotionals', existingFavorite.items[0].id)

    return ToggleAction.deleted
  }
  else {
    const favorite = await PocketBaseClient.records.create('userFavoriteDevotionals', {
      devotional: devotionalId,
      user: user.value.id
    })

    return ToggleAction.created
  }
}

export async function getAllUserFavoriteSermons(): Promise<UserFavoriteSermon[]> {
  if (!user.value)
    return []

  const results = await PocketBaseClient.records.getFullList('userFavoriteSermons', 255, { filter: `user=${user.value.id}` })
  return results as any[]
}

export async function getAllUserFavoriteDevotionals() {
  if (!user.value)
    return

  const results = await PocketBaseClient.records.getFullList('userFavoriteSermons', 255, { filter: `user=${user.value.id}` })
  return results as any[]
}
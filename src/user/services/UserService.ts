import { User } from "../../auth/User"
import { getBucketUrl } from "../../api/BucketStorageService"
import { useAuth } from "../../auth/services/AuthService"
import PocketBaseClient from "../../api/PocketBaseClient"
import { ref } from "vue"
import { UserFavoriteDevotional } from "../UserFavoriteDevotional"

const { user } = useAuth()

export enum ToggleAction {
  noop,
  deleted,
  created,
}

export function getUserProfileImage(user?: User | null | undefined) {
  if (user && user.profile && user.profile.avatar)
    return getBucketUrl(user.profile, user.profile.avatar)

  return "/logo-bible.png"
}

export const defaultImage = '/logo-bible.png'

const isUserFavoriteDevotionalsDirty = ref(true)
const allUserFavoriteDevotionals = ref<UserFavoriteDevotional[]>([])

export async function toggleUserFavoriteDevotional(devotionalId: string) {
  let action = ToggleAction.noop

  if (!user.value)
    return ToggleAction.noop



  const existingFavorite = allUserFavoriteDevotionals.value.find(fav => fav.devotional === devotionalId)
  if (existingFavorite) {
    allUserFavoriteDevotionals.value = [...allUserFavoriteDevotionals.value].filter(item => item.devotional != existingFavorite.devotional)
    const deleted = await PocketBaseClient.records.delete('userFavoriteDevotionals', existingFavorite.id)
    return ToggleAction.deleted
  }
  else {
    const favoriteDevotionals = await getAllUserFavoriteDevotionals();
    var isFavoriteAlready = false;
    favoriteDevotionals.forEach((devotional) => {
      if (devotional.devotional == devotionalId) {
        isFavoriteAlready = true;
      }
    })
    if (isFavoriteAlready == false) {
      const userFavoriteDevotional = {
        devotional: devotionalId,
        user: user.value.id
      }
      const favorite: any = await PocketBaseClient.records.create('userFavoriteDevotionals', userFavoriteDevotional)
      allUserFavoriteDevotionals.value = [...allUserFavoriteDevotionals.value, favorite]
      return ToggleAction.created
    }
  }
}

export async function getAllUserFavoriteDevotionals(): Promise<UserFavoriteDevotional[]> {
  if (!user.value)
    return []
  const results = await PocketBaseClient.records.getFullList('userFavoriteDevotionals', 255, { filter: `user='${user.value.id}'` })
  return results as any[]
}

export const loadFavorites = async () => {
  // No user... no favorites
  if (!user.value)
    return
  if (isUserFavoriteDevotionalsDirty.value) {
    const favoriteDevotionals = await getAllUserFavoriteDevotionals()
    allUserFavoriteDevotionals.value = favoriteDevotionals
    isUserFavoriteDevotionalsDirty.value = false
  }
}

export const isUserFavoriteDevotional = (devotionalId: string) => {
  return allUserFavoriteDevotionals.value.some(favoriteDevo => favoriteDevo.devotional === devotionalId)
}

export function useUserFavorites() {
  return {
    loadFavorites,
    isUserFavoriteDevotional,
    toggleUserFavoriteDevotional,
    markFavoriteDevotionalsDirty() {
      isUserFavoriteDevotionalsDirty.value = true
    }
  }
}

export async function updateUserProfile(name: string | Blob, bio: string | Blob, pfp: File | Blob | null, user: User | null | undefined, pushNotifications: boolean, emailNotifications: boolean) {
  if (!user)
    return;

  var formData = new FormData();

  formData.append('avatar', pfp || "");
  formData.append('name', name);
  formData.append('bio', bio);
  formData.append('pushNotifications', "true");
  formData.append('emailNotifications', "true")

  const updatedProfile = await PocketBaseClient.records.update('profiles', user.profile.id, formData)

  user.profile = updatedProfile as any;

  await refreshUser()

  return user;
}

export async function refreshUser(){
  await PocketBaseClient.users.refresh();
}
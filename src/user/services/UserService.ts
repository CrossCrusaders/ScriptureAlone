import { Devotional } from './../../devotionals/Devotional';
import { Profile } from './../../auth/User';
import { User } from "../../auth/User"
import { getBucketUrl } from "../../api/BucketStorageService"
import { useRouter } from "vue-router"
import { useAuth } from "../../auth/services/AuthService"
import PocketBaseClient from "../../api/PocketBaseClient"
import { UserFavoriteSermon } from "../UserFavoriteSermon"
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

const isUserFavoriteSermonsDirty = ref(true)
const isUserFavoriteDevotionalsDirty = ref(true)

const allUserFavoriteSermons = ref<UserFavoriteSermon[]>([])
const allUserFavoriteDevotionals = ref<UserFavoriteDevotional[]>([])



export async function toggleUserFavoriteSermon(sermonId: string) {
  let action = ToggleAction.noop

  if (!user.value)
    return ToggleAction.noop



  const existingFavorite = allUserFavoriteSermons.value.find(fav => fav.sermon === sermonId) // await PocketBaseClient.records.getList('userFavoriteSermons', 1, 1, { filter: `user='${user.value.id}' && sermon='${sermonId}'` })
  if (existingFavorite) {
    allUserFavoriteSermons.value = [...allUserFavoriteSermons.value].filter(item => item.sermon != existingFavorite.sermon)
    const deleted = await PocketBaseClient.records.delete('userFavoriteSermons', existingFavorite.id)
    return ToggleAction.deleted
  }
  else {
    const favoriteSermons = await getAllUserFavoriteSermons();
    var isFavoriteAlready = false;
    favoriteSermons.forEach((sermon) => {
      if (sermon.sermon == sermonId) {
        isFavoriteAlready = true;
      }
    })
    if (isFavoriteAlready == false) {
      const userFavoriteSermon = {
        sermon: sermonId,
        user: user.value.id
      }
      const favorite: any = await PocketBaseClient.records.create('userFavoriteSermons', userFavoriteSermon)
      allUserFavoriteSermons.value = [...allUserFavoriteSermons.value, favorite]
      return ToggleAction.created
    }
  }
}

export async function toggleUserFavoriteDevotional(devotionalId: string) {
  let action = ToggleAction.noop

  if (!user.value)
    return ToggleAction.noop

  const existingFavorite = allUserFavoriteDevotionals.value.find(fav => fav.devotional === devotionalId) // await PocketBaseClient.records.getList('userFavoriteSermons', 1, 1, { filter: `user='${user.value.id}' && sermon='${sermonId}'` })
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
      allUserFavoriteSermons.value = [...allUserFavoriteSermons.value, favorite]
      return ToggleAction.created
    }
  }
}


export async function getAllUserFavoriteSermons(): Promise<UserFavoriteSermon[]> {
  if (!user.value)
    return []
  const results = await PocketBaseClient.records.getFullList('userFavoriteSermons', 255, { filter: `user='${user.value.id}'` })
  return results as any[]
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

  if (isUserFavoriteSermonsDirty.value) {
    const favoriteSermons = await getAllUserFavoriteSermons()
    allUserFavoriteSermons.value = favoriteSermons
    isUserFavoriteSermonsDirty.value = false
  }
  if (isUserFavoriteDevotionalsDirty.value) {
    const favoriteDevotionals = await getAllUserFavoriteDevotionals()
    allUserFavoriteDevotionals.value = favoriteDevotionals
    isUserFavoriteDevotionalsDirty.value = false
  }
}

export const isUserFavoriteSermon = (sermonId: string) => {
  return allUserFavoriteSermons.value.some(favoriteSermon => favoriteSermon.sermon === sermonId)
}

export const isUserFavoriteDevotional = (devotionalId: string) => {
  return allUserFavoriteDevotionals.value.some(favoriteDevo => favoriteDevo.devotional === devotionalId)
}

export function useUserFavorites() {
  return {
    loadFavorites,
    isUserFavoriteSermon,
    isUserFavoriteDevotional,
    toggleUserFavoriteSermon,
    toggleUserFavoriteDevotional,
    markFavoriteSermonsDirty() {
      isUserFavoriteSermonsDirty.value = true
    },
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
  formData.append('pushNotifications', pushNotifications.toString());
  formData.append('emailNotifications', emailNotifications.toString())

  const updatedProfile = await PocketBaseClient.records.update('profiles', user.profile.id, formData)

  user.profile = updatedProfile as any;

  await refreshUser()

  return user;
}

export async function refreshUser(){
  await PocketBaseClient.users.refresh();
}
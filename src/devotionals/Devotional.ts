import { Author, transformAuthorResponse } from "../authors/Author"
import { getStorageBucketItemUrl } from "../core/services/BucketStorageService"

export interface Category {
  created: Date,
  iconName: string,
  iconType: string,
  id: string,
  label: string,
  updated: Date,

}

export interface Devotional {
  id?: string
  coverImage?: any
  description?: string
  externalAudioFileUrl?: string
  externalCoverImageUrl?: string
  externalVideoFileUrl?: string
  audioFile?: string,

  devotionalDate?: Date
  title?: string
  transcript?: string
  created?: Date
  updated?: Date
  accordionText?: string

  categories?: Category[]
  author?: Author

  collectionId?: string
  collectionName?: string

  duration: number
}


export const transformDevotionalResponse = (response: any): Devotional => {
  const devotional: Devotional = {
    ...response,
    collectionId: response['@collectionId'],
    collectionName: response['@collectionName'],
  }

  // The @expand indicates that there are relationships to map
  if (response['@expand']) {

    const { categories, author } = response['@expand']

    if (categories) {
      devotional.categories = [...categories]
    }

    if (author) {
      devotional.author = transformAuthorResponse({ ...author })
    }
  }

  if (devotional.audioFile && devotional.collectionId && devotional.id) {
    devotional.audioFile = getStorageBucketItemUrl(devotional.collectionId, devotional.id, devotional.audioFile)
  }

  return devotional
}

export const transformDevotionalResponses = (responses: any[]) =>
  responses.map(r => transformDevotionalResponse(r))


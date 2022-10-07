import { Author, transformAuthorResponse } from "../authors/Author"
import { getBucketUrl } from "../core/services/BucketStorageService"

export interface Category {
  created: Date,
  iconName: string,
  iconType: string,
  id: string,
  label: string,
  updated: Date,

}

export interface Sermon {
  id?: string
  coverImage?: any
  description?: string
  externalAudioFileUrl?: string
  externalCoverImageUrl?: string
  externalVideoFileUrl?: string
  audioFile?: string,

  sermonDate?: Date
  title?: string
  transcript?: string
  created?: Date
  updated?: Date

  categories?: Category[]
  author?: Author

  collectionId?: string
  collectionName?: string

  duration: number
}


export const transformSermonResponse = (response: any): Sermon => {
  const sermon: Sermon = {
    ...response,
    collectionId: response['@collectionId'],
    collectionName: response['@collectionName'],
  }

  // The @expand indicates that there are relationships to map
  if (response['@expand']) {

    const { categories, author } = response['@expand']

    if (categories) {
      sermon.categories = [...categories]
    }

    if (author) {
      sermon.author = transformAuthorResponse({ ...author })
    }
  }

  if (sermon.audioFile && sermon.collectionId && sermon.id) {
    sermon.audioFile = getBucketUrl(sermon, sermon.audioFile)
  }

  return sermon
}

export const transformSermonResponses = (responses: any[]) =>
  responses.map(r => transformSermonResponse(r))


import { Author, transformAuthorResponse } from "../authors/Author"
import { getBucketUrl } from "../api/BucketStorageService"

export interface Category {
  created: Date,
  iconName: string
  id: string
  label: string
  updated: Date
  colorEnd: string
  colorStart: string
  textColor: string
  customCss: any
  key: string
}

/**
@collectionId: "td6b1l9mrk0pshl"
@collectionName: "sermonCategories"
colorEnd: "#5f0963"
colorStart:"#a000a8"
created: "2022-09-24 12:07:20.954"
customCss: null
iconName: "cross"
iconType: ""
id: "pq9ks66fu4nje8h"
label: "Salvation"
textColor: "#ffffff"
updated: "2022-10-14 11:28:24.508"
 */

export const transformCategoryResponse = (response: any): Category => {
  return {
    ...response
  } as Category
}

export const transformCategoryResponses = (responses: any[]) => responses.map(r => transformCategoryResponse(r))

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

  if (sermon.coverImage) {
    sermon.coverImage = getBucketUrl(sermon, sermon.coverImage)
  }

  if (sermon.sermonDate)
    sermon.sermonDate = new Date((sermon.sermonDate as any).replace(' ', 'T'))

  if (sermon.updated)
    sermon.updated = new Date((sermon.updated as any).replace(' ', 'T'))

  if (sermon.created)
    sermon.created = new Date((sermon.created as any).replace(' ', 'T'))

  return sermon
}

export const transformSermonResponses = (responses: any[]) =>
  responses.map(r => transformSermonResponse(r))


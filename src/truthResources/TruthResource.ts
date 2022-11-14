import { Author, transformAuthorResponse } from "../authors/Author"
import { getBucketUrl } from "../api/BucketStorageService"

export interface Category {
  created: Date,
  iconName: string,
  iconType: string,
  id: string,
  label: string,
  updated: Date,
}

export interface TruthResource {
  id?: string
  coverImage?: any
  description?: string
  truthResourceDate?: Date
  //externalAudioFileUrl?: string
  //externalCoverImageUrl?: string
  //externalVideoFileUrl?: string
  //audioFile?: string,

  //devotionalDate?: Date
  title?: string
  //transcript?: string
  created?: Date
  updated?: Date
  //accordionText?: string

  //categories?: Category[]
  author?: Author

  collectionId?: string
  collectionName?: string

  isSeries?: boolean

  pdf: any
  pageAmount: number
}


export const transformTruthResourceResponse = (response: any): TruthResource => {
  const truthResource: TruthResource = {
    ...response,
    collectionId: response['@collectionId'],
    collectionName: response['@collectionName'],
  }

  // The @expand indicates that there are relationships to map
  if (response['@expand']) {

    const { categories, author, sections } = response['@expand']

    /*
    if (categories) {
        truthResource.categories = [...categories]
    }
    */

    if (author) {
        truthResource.author = transformAuthorResponse({ ...author })
    }
  }

  if (truthResource.coverImage)
    truthResource.coverImage = getBucketUrl(truthResource, truthResource.coverImage)

  return truthResource
}

export const transformTruthResourceResponses = (responses: any[]) =>
  responses.map(r => transformTruthResourceResponse(r))
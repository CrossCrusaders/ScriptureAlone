import { Church } from "../church/Church";
import { getBucketUrl } from "../api/BucketStorageService";

export interface Author {
  id: string
  administrators?: string[]
  church: Church
  firstName: string
  lastName: string
  profileImage: string
  collectionId: string
  collectionName: string
}

export const transformAuthorResponse = (response: any): Author => {
  const author: Author = {
    ...response,
    collectionId: response['@collectionId'],
    collectionName: response['@collectionName']
  }

  if (response['@expand']) {

    if (response['@expand'].church) {
      author.church = { ...response['@expand'].church }
    }

  }


  if (author.profileImage)
    author.profileImage = getBucketUrl(author, author.profileImage)

  return author
}

export const transformAuthorResponses = (responses: any[]) => responses.map(response => transformAuthorResponse(response))
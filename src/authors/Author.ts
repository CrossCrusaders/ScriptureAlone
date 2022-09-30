import { Church } from "../church/Church";
import { getStorageBucketItemUrl } from "../core/services/BucketStorageService";

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

  author.profileImage = getStorageBucketItemUrl(author.collectionId, author.id, author.profileImage)

  return author
}

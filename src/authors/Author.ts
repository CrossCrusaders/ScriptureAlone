import { Church } from "../church/Church";
import { getAttachmentUrl } from "../core/services/AttachmentPocketBase";

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

  //Tyler, you may want to look at this.
  //@ts-expect-error
  author.profileImage = getAttachmentUrl(author, "author")

  return author
}

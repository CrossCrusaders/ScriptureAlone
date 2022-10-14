import PocketBaseClient from "../../api/PocketBaseClient"
import { getDayOfTheYear } from "../../core/services/TimeService"
import { transformAuthorResponse, transformAuthorResponses } from "../Author"

export const searchAuthors = async (page: number = 1, perPage: number = 8, searchParams?: any) => {
  const sermons = await PocketBaseClient.records.getList('authors', page, perPage, { sort: '-created', ...searchParams })
  return transformAuthorResponses(sermons.items)
}

export const getFeaturedAuthors = async (count: number = 6) => {

  // TEMP solution until we can get count from pocketbase
  const totalDbCount = 40
  const totalPageCount = totalDbCount / count
  const doty = getDayOfTheYear()
  const selectedPage = (totalDbCount % doty) + 1
  // --

  const response = await PocketBaseClient.records.getList('authors', selectedPage, count, { sort: '-created', filter: "profileImage!=null" })
  return transformAuthorResponses(response.items)
}

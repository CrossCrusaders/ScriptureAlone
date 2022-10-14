import PocketBaseClient from "../../api/PocketBaseClient"
import { transformAuthorResponse, transformAuthorResponses } from "../Author"

export const searchAuthors = async (page: number = 1, perPage: number = 8, searchParams?: any) => {
  const sermons = await PocketBaseClient.records.getList('authors', page, perPage, { sort: '-created', ...searchParams })
  return transformAuthorResponses(sermons.items)
}

export const getFeaturedAuthors = async (count: number = 6) => {
  const response = await PocketBaseClient.records.getList('authors', 1, count, { sort: '-created', filter: "profileImage!=null" })
  return transformAuthorResponses(response.items)
}

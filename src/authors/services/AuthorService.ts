import PocketBaseClient from "../../api/PocketBaseClient"
import { getDayOfTheYear } from "../../core/services/TimeService"
import { transformAuthorResponse, transformAuthorResponses } from "../Author"

export const searchAuthors = async (query?: string, page: number = 1, perPage: number = 8, searchParams?: any) => {
  const params = {
    sort: '-created',
    ...searchParams
  }
  if (query) {
    const searchTokens = query.trim().split(' ')
    searchTokens.forEach((token, index) => {
      params.filter += `${(index > 0) ? '||' : ''}(firstName~'${token}'||lastName~'${token}')`
    })
  }
  const sermons = await PocketBaseClient.records.getList('authors', page, perPage, params)
  return transformAuthorResponses(sermons.items)
}

export const getFeaturedAuthors = async (count: number = 6) => {

  // TEMP solution until we can get count from pocketbase
  const totalDbCount = 40
  const totalPageCount = Math.floor(totalDbCount / count)
  const doty = getDayOfTheYear()
  const selectedPage = (doty % totalDbCount) + 1
  // --

  const response = await PocketBaseClient.records.getList('authors', selectedPage, count, { sort: '-created', filter: "profileImage!=null" })
  return transformAuthorResponses(response.items)
}

export const getAuthor = async (authorId: string) => {
  const response = await PocketBaseClient.records.getOne('authors', authorId, { expand: 'church' })
  return transformAuthorResponse(response)
}

export const getAuthorByChurch = async (churchId: string) => {

}
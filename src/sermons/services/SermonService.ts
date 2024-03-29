import PocketBaseClient from '../../api/PocketBaseClient'
import { transformCategoryResponse, transformCategoryResponses, transformSermonResponse, transformSermonResponses } from '../Sermon'

export const getFeaturedSermon = async () => {
  const response = await PocketBaseClient.records.getOne('sermons', '', { sort: '-created' })
  return transformSermonResponse(response)
}

export const getSermon = async (id: string) => {
  const response = await PocketBaseClient.records.getOne('sermons', id, { expand: 'categories,author,author.church' })
  return transformSermonResponse(response)
}

export const getSermonsByAuthor = async (authorId: string, page: number = 1, perPage: number = 8) => {
  const sermons = await PocketBaseClient.records.getList('sermons', page, perPage, { sort: '-created', expand: 'categories,author', filter: `author='${authorId}'` })
  return transformSermonResponses(sermons.items)
}

// Sermon Categories -- TODO: Probably need to abstract to separate file

export const getSermonCategories = async () => {
  const categories = await PocketBaseClient.records.getList('sermonCategories')
  return transformCategoryResponses(categories.items)
}


export const getSermonCategoryByKey = async (key: string) => {
  const category = await PocketBaseClient.records.getOne('sermonCategories', '', { filter: `key='${key}'` })
  return transformCategoryResponse(category.items[0])
}

export const searchSermonCategories = async (query?: string, page: number = 1, perPage: number = 8, searchParams?: any) => {
  const params = {
    sort: '-created',
    ...searchParams
  }
  if (query) {
    const searchTokens = query.trim().split(' ')
    searchTokens.forEach((token, index) => {
      params.filter += `${(index > 0) ? '||' : ''}(label~'${token}'||key~'${token}')`
    })
  }
  const categories = await PocketBaseClient.records.getList('sermonCategories', page, perPage, params)
  return transformCategoryResponses(categories.items)
}

export const getUserFavoriteSermons = async (userId: string, page: number = 1, perPage: number = 8) => {
  const results = await PocketBaseClient.records.getList('userFavoriteSermons', page, perPage, { filter: `user='${userId}'`, expand: 'sermon,sermon.categories,sermon.author' })
  const { items, ...pagination } = results

  return {
    items: items.map(item => transformSermonResponse(item['@expand'].sermon)),
    ...pagination
  }
}
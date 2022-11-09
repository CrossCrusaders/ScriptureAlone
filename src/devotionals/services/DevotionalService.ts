import { A11yMethods } from 'swiper/types/modules/a11y'
import PocketBaseClient from '../../api/PocketBaseClient'
import { transformDevotionalResponse, transformDevotionalResponses } from '../Devotional'
import { DevotionalSearch } from '../DevotionalSearch'

export const getFeaturedDevotional = async () => {
  const response = await PocketBaseClient.records.getOne('devotionals', '', { sort: '-created' })
  return transformDevotionalResponse(response)
}

export const getDevotional = async (id: string) => {
  const response = await PocketBaseClient.records.getOne('devotionals', id, { expand: 'categories,sections,author,author.church' })
  return transformDevotionalResponse(response)
}

export const getDevotionalCategories = async () => {
  const categories = await PocketBaseClient.records.getList('devotionalCategories')
  return categories
}

export const getUserFavoriteDevotionals = async (userId: string, page: number = 1, perPage: number = 8) => {
  const results = await PocketBaseClient.records.getList('userFavoriteDevotionals', page, perPage, { filter: `user='${userId}'`, expand: 'devotional,devotional.categories,devotional.author' })
  const { items, ...pagination } = results
  return {
    items: items.map(item => transformDevotionalResponse(item['@expand'].devotional)),
    ...pagination
  } as DevotionalSearch
}
import PocketBaseClient from '../../api/PocketBaseClient'
import { transformCategoryResponses, transformSermonResponse, transformSermonResponses } from '../Sermon'

export const getRecentSermons = async (offset: number, count: number) => {
  const sermonsResponse = await PocketBaseClient.records.getList('sermons', offset, count, { sort: '-created', expand: 'categories,author' })
  const sermons = transformSermonResponses(sermonsResponse.items)
  return sermons
}

export const getFeaturedSermon = async () => {
  const response = await PocketBaseClient.records.getOne('sermons', '', { sort: '-created' })
  return transformSermonResponse(response)
}

export const getSermon = async (id: string) => {
  const response = await PocketBaseClient.records.getOne('sermons', id, { expand: 'categories,author,author.church' })
  return transformSermonResponse(response)
}

export const getSermonCategories = async () => {
  const categories = await PocketBaseClient.records.getList('sermonCategories')
  return transformCategoryResponses(categories.items)
}

export const searchSermons = async (page: number = 1, perPage: number = 8, searchParams?: any) => {
  const sermons = await PocketBaseClient.records.getList('sermons', page, perPage, { sort: '-created', expand: 'categories,author', ...searchParams })
  return transformSermonResponses(sermons.items)
}
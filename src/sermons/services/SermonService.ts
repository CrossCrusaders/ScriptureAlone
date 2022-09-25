import PocketBaseClient from '../../services/PocketBaseClient'
import { transformSermonResponses } from '../Sermon'

export const getRecentSermons = async (offset: number, count: number) => {
  const sermonsResponse = await PocketBaseClient.records.getList('sermons', offset, count, { sort: '-created', expand: 'categories,author' })
  const sermons = transformSermonResponses(sermonsResponse.items)
  return sermons
}

export const getFeaturedSermon = async () => {
  const sermon = await PocketBaseClient.records.getOne('sermons', '', { sort: '-created' })
  return sermon
}

export const getSermon = async (id: string) => {
  const sermon = await PocketBaseClient.records.getOne('sermons', id)
  return sermon
}

export const getSermonCategories = async () => {
  const categories = await PocketBaseClient.records.getList('sermonCategories')
  return categories
}


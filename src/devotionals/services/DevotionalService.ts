import PocketBaseClient from '../../api/PocketBaseClient'
import { transformDevotionalResponse, transformDevotionalResponses } from '../Devotional'

export const getRecentDevotionals = async (offset: number, count: number) => {
  const devotionalsResponse = await PocketBaseClient.records.getList('devotionals', offset, count, { sort: '-created', expand: 'categories,author' })
  const devotionals = transformDevotionalResponses(devotionalsResponse.items)
  console.log(devotionals)
  return devotionals
}

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


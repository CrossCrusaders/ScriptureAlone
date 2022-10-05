import PocketBaseClient from '../../api/PocketBaseClient'
import { transformDevotionalResponse, transformDevotionalResponses } from '../Devotional'

export const getRecentDevotionals = async (offset: number, count: number) => {
  const devotionalsResponse = await PocketBaseClient.records.getList('devotionals', offset, count, { sort: '-created', expand: 'categories,author' })
  const devotionals = transformDevotionalResponses(devotionalsResponse.items)
  return devotionals
}

export const getFeaturedDevotional = async () => {
  const response = await PocketBaseClient.records.getOne('devotionals', '', { sort: '-created' })
  return transformDevotionalResponse(response)
}

export const getDevotional = async (id: string) => {
  const response = await PocketBaseClient.records.getOne('devotionals', id, { expand: 'categories,sections,author,author.church,coverImage,accordionText' })
  return transformDevotionalResponse(response)
}

export const getDevotionalCategories = async () => {
  const categories = await PocketBaseClient.records.getList('devotionalCategories')
  return categories
}

export const getDevotionalsInCategories = async (category:string) => {
  console.log(category)
  const devotionalsInCategories = await PocketBaseClient.records.getFullList('devotionals', 200, { filter: `categories ~ "${category}"` })
  console.log(devotionalsInCategories)
}
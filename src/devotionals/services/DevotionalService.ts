import { A11yMethods } from 'swiper/types/modules/a11y'
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

export const searchDevotionals = async (searchTerm: string, type: number, pageNum?: number, pageSize?: number) => {
  var response: any;
  if (type == 0) {
    const devotionalsInSearch = await PocketBaseClient.records.getList('devotionals', pageNum, pageSize, { filter: `categories.label ~ "${searchTerm}"`, expand: 'categories,sections,author,author.church' })
    response = transformDevotionalResponses(devotionalsInSearch.items)
  }
  else if (type == 1) {
    const devotionalsInSearch = await PocketBaseClient.records.getList('devotionals', pageNum, pageSize, { filter: `title ~ "${searchTerm}" && categories.label !~ "${searchTerm}"`, expand: 'categories,sections,author,author.church' })
    response = transformDevotionalResponses(devotionalsInSearch.items)
  }
  else if (type == 2) {
    const devotionalsInSearch = await PocketBaseClient.records.getList('devotionals', pageNum, pageSize, { filter: `description ~ "${searchTerm}" && title !~ "${searchTerm}" && categories.label !~ "${searchTerm}"`, expand: 'categories,sections,author,author.church' })
    response = transformDevotionalResponses(devotionalsInSearch.items)
  }
  else if (type == 3) {
    const devotionalsInSearch = await PocketBaseClient.records.getList('devotionals', pageNum, pageSize, { filter: `author.firstName ~ "${searchTerm}" && description !~ "${searchTerm}" && title !~ "${searchTerm}" && categories.label !~ "${searchTerm}"`, expand: 'categories,sections,author,author.church' })
    response = transformDevotionalResponses(devotionalsInSearch.items)
  }
  return response;
}
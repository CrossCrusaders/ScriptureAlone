import { A11yMethods } from 'swiper/types/modules/a11y'
import PocketBaseClient from '../../api/PocketBaseClient'
import { transformDevotionalResponse, transformDevotionalResponses } from '../Devotional'
import { searchAuthors } from '../../authors/services/AuthorService'
import { DevotionalSearch } from '../DevotionalSearch'

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
  const response = await PocketBaseClient.records.getOne('devotionals', id, { expand: 'categories,sections,author,author.church' })
  return transformDevotionalResponse(response)
}

export const getDevotionalCategories = async () => {
  const categories = await PocketBaseClient.records.getList('devotionalCategories')
  return categories
}


export const searchDevotionals = async (query: string | null, page: number = 1, perPage: number = 8, searchParams?: any): Promise<DevotionalSearch> => {
  const params = { sort: '-devotionalDate,-created', expand: 'categories,author,sections', ...searchParams }
  if (query) {
    const tokens = query.trim().split(' ')
    const filter = tokens.reduce((str, currentToken, index) => {
      if (index)
        str += '||'
      str += `(categories.label~"${currentToken}"||title~"${currentToken}"||description~"${currentToken}"||author.firstName~"${currentToken}"||author.lastName~"${currentToken}")`
      return str
    }, '')
    params.filter = filter
  }
  const devotionals: any = await PocketBaseClient.records.getList('devotionals', page, perPage, params)
  devotionals.items = transformDevotionalResponses(devotionals.items) as any
  return devotionals as DevotionalSearch
}

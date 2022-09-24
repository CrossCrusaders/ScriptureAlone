import PocketBaseClient from '../../services/PocketBaseClient'

export const getRecentSermons = async (offset: number, count: number) => {
  const sermons = await PocketBaseClient.records.getList('sermons', offset, count, { sort: '-created', expand: 'categories' })
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
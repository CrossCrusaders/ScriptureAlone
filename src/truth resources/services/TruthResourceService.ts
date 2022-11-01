import PocketBaseClient from '../../api/PocketBaseClient'
import { transformTruthResourceResponse, transformTruthResourceResponses } from '../TruthResource'

export const getRecentTruthResources = async (offset: number, count: number) => {
    const devotionalsResponse = await PocketBaseClient.records.getList('truthres', offset, count, { sort: '-created', expand: 'author' })
    const devotionals = transformTruthResourceResponses(devotionalsResponse.items)
    return devotionals
}
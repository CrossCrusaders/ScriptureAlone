import PocketBaseClient from '../../api/PocketBaseClient'
import { transformTruthResourceResponse } from '../TruthResource'

export const getTruthResource = async (id: string) => {
    const response = await PocketBaseClient.records.getOne('truthResources', id, { expand: 'title,description,author,author.church' })
    return transformTruthResourceResponse(response)
  }
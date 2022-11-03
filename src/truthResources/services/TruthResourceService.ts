import PocketBaseClient from '../../api/PocketBaseClient'
import { transformTruthResourceResponse, transformTruthResourceResponses } from '../TruthResource'

export const getRecentTruthResources = async (offset: number, count: number, isSeries: boolean) => {
    if(isSeries){
        const devotionalsResponse = await PocketBaseClient.records.getList('truthResources', offset, count, { sort: '-created', expand: 'author', filter: 'isSeries = true' })
        const devotionals = transformTruthResourceResponses(devotionalsResponse.items)
        return devotionals
    }
    else{
        const devotionalsResponse = await PocketBaseClient.records.getList('truthResources', offset, count, { sort: '-created', expand: 'author', filter: 'isSeries = false' })
        const devotionals = transformTruthResourceResponses(devotionalsResponse.items)
        return devotionals
    }
}
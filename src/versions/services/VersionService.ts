import { Version } from './../Version';
import PocketBaseClient from '../../api/PocketBaseClient'
import { transformVersionResponse } from '../Version'

export const getVersion = async (versionNumber: string) => {
    const response = await PocketBaseClient.records.getList('versions', 1, 1, { filter: `version=${versionNumber}` })
    return transformVersionResponse(response.items[0])
}
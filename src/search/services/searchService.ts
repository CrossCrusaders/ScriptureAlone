import PocketBaseClient from "../../api/PocketBaseClient"
import { Record } from '../Record'
import { getBucketUrl } from '../../api/BucketStorageService'
import { transformAuthorResponse } from '../../authors/Author'

export async function getSearch(collection: string, query: string | null, page: number, perPage: number, queryParams?: any){
  const params = { sort: '-created', expand: 'categories,author', ...queryParams }

  if (query) {
    const tokens = query.trim().split(' ')
    const filter = tokens.reduce((str, currentToken, index) => {
      if (index)
        str += '||'
        str += `(categories.label~"${currentToken}"||title~"${currentToken}"||description~"${currentToken}")`
        return str
      }, '')
    
    params.filter = filter
  }
  const records: any = await PocketBaseClient.records.getList(collection, page, perPage, params)
  records.items = await transformRecordResponses(records.items, collection) as any
  return records;
}

export const transformRecordResponse = (response: any, collection: string): Record => {
  const record: Record = {
    ...response,
    collectionId: response['@collectionId'],
    collectionName: response['@collectionName'],
  }
  if (response['@expand']) {
    const { categories, author } = response['@expand']
  
    if (categories) {
      record.categories = [...categories]
    }
  
    if (author) {
      record.author = transformAuthorResponse({ ...author })
    }
  }
  
  if (record.audioFile && record.collectionId && record.id) {
    record.audioFile = getBucketUrl(record, record.audioFile)
  }
  
  if (record.coverImage) {
    record.coverImage = getBucketUrl(record, record.coverImage)
  }
  
  if (record.recordDate)
    record.recordDate = new Date((record.recordDate as any).replace(' ', 'T'))
  
  if (record.updated)
    record.updated = new Date((record.updated as any).replace(' ', 'T'))
  
  if (record.created)
    record.created = new Date((record.created as any).replace(' ', 'T'))
  
  return record;
}
  
export const transformRecordResponses = (responses: any[], collection: string) =>
  responses.map(r => transformRecordResponse(r, collection))
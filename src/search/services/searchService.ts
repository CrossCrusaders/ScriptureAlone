import PocketBaseClient from "../../api/PocketBaseClient"
import { Record } from '../Record'
import { getBucketUrl } from '../../api/BucketStorageService'
import { transformAuthorResponse } from '../../authors/Author'
import { AuthorSearch } from "../../authors/AuthorSearch"
import { Author, transformAuthorResponses } from "../../authors/Author"

export async function getSearch(collection: string, query: string | undefined, page: number, perPage: number, queryParams?: any){
  const params = { sort: `-${collection.slice(0, collection.length - 1)}Date`, expand: 'categories,author', ...queryParams }

  if (query != "" && query) {
    var authors = await getSearchAuthors(query)
    if(params.filters == undefined){
      params.filter = ""
    }
    else{
      params.filters = params.filters + " || "
    }
    authors.items.forEach((author, index) => {
      params.filter += `author.id = "${author.id}" || `;
    })

    const tokens = query.trim().split(' ')
    const filter = tokens.reduce((str, currentToken, index) => {
      if (index)
        str += '||'
        str += `(categories.label~"${currentToken}"||title~"${currentToken}"||description~"${currentToken}")`
        return str
      }, '')
    
    params.filter = params.filter + filter;
  }
  const records: any = await PocketBaseClient.records.getList(collection, page, perPage, params)
  records.items = await transformRecordResponses(records.items, collection) as any
  return records;
}

export async function getSearchAuthors(query?: string, page: number = 1, perPage: number = 8, searchParams?: any){
  const params = {
    sort: '-created',
    ...searchParams
  }
  if (query != "" && query) {
    const searchTokens = query.trim().split(' ')
    searchTokens.forEach((token, index) => {
      params.filter += `${(index > 0) ? '||' : ''}(firstName~'${token}'||lastName~'${token}')`
    })
  }

  const response = await PocketBaseClient.records.getList('authors', page, perPage, params)

  const authors = transformAuthorResponses(response.items)

  var name = "";
  var returnAuthors:Author[] = [];
  authors.forEach((author) => {
    name = `${author.firstName} ${author.lastName}`
    if(name.includes(query || "")){
      returnAuthors.push(author);
    }
  });

  return {
    ...response,
    items: returnAuthors,
  } as AuthorSearch
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
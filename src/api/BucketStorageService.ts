import PocketBaseClient from './PocketBaseClient'

export const getBucketUrl = (record: any, fileName: string | undefined, queryParams: any = {}) => {
  return PocketBaseClient.records.getFileUrl(record, fileName || "", queryParams)
}
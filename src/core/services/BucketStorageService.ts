import PocketBaseClient from '../../api/PocketBaseClient'

export const getBucketUrl = (record: any, fileName: string, queryParams: any = {}) => {
  return PocketBaseClient.records.getFileUrl(record, fileName, queryParams)
}
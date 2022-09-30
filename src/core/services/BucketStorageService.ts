import Config from './ConfigService'

export const getStorageBucketUrl = () => {
  return Config.bucketStorageBaseUrl
}

export const getStorageBucketItemUrl = (collectionId: string, recordId: string, fileName: string) => {
  return `${Config.bucketStorageBaseUrl}/${collectionId}/${recordId}/${fileName}`
}
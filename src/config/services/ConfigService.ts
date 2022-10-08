const bucketStorageBaseUrl = import.meta.env.VITE_BUCKET_STORAGE_BASE_URL
const pocketBaseApiUrl = import.meta.env.VITE_POCKETBASE_URL
const bibleApiUrl = import.meta.env.VITE_BIBLE_API_URL
const environment = import.meta.env.VITE_ENVIRONMENT

const Config = {
  bucketStorageBaseUrl,
  pocketBaseApiUrl,
  bibleApiUrl,
  environment
}

export default Config
const bucketStorageBaseUrl = import.meta.env.VITE_BUCKET_STORAGE_BASE_URL
const pocketBaseApiUrl = import.meta.env.VITE_POCKETBASE_URL
const bibleApiUrl = import.meta.env.VITE_BIBLE_API_URL
const websters1828Dictionary = import.meta.env.VITE_WEBSTERS_1828_DICTIONARY
const bibleAudioUrl = import.meta.env.VITE_BIBLE_AUDIO_URL
const environment = import.meta.env.VITE_ENVIRONMENT

const Config = {
  bucketStorageBaseUrl,
  pocketBaseApiUrl,
  bibleApiUrl,
  websters1828Dictionary,
  bibleAudioUrl,
  environment
}

export default Config

import PocketBase from 'pocketbase'

export const pocketBaseApiUrl = import.meta.env.VITE_POCKETBASE_URL

const PocketBaseClient = new PocketBase(pocketBaseApiUrl)

export default PocketBaseClient
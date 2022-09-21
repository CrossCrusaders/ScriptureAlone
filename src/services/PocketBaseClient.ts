
import PocketBase from 'pocketbase'

// TODO: use an environment configuration
const PocketBaseClient = new PocketBase(import.meta.env.VITE_POCKETBASE_URL)

export default PocketBaseClient
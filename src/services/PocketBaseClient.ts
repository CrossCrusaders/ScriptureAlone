
import PocketBase from 'pocketbase'

// TODO: use an environment configuration
const PocketBaseClient = new PocketBase('http://127.0.0.1:8090')

export default PocketBaseClient
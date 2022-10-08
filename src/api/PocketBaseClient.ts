
import PocketBase from 'pocketbase'
import Config from '../config/services/ConfigService'

const PocketBaseClient = new PocketBase(Config.pocketBaseApiUrl)

export default PocketBaseClient

import PocketBase from 'pocketbase'
import Config from '../core/services/ConfigService'

const PocketBaseClient = new PocketBase(Config.pocketBaseApiUrl)

export default PocketBaseClient
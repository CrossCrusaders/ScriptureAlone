import { Pagination } from '../core/Pagination'
import { Sermon } from './Sermon'

export interface SermonSearch extends Pagination {
  items: Sermon[]
}
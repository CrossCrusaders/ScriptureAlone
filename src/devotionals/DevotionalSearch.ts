import { Pagination } from '../core/Pagination'
import { Devotional } from './Devotional'


export interface DevotionalSearch extends Pagination {
  items: Devotional[]
}
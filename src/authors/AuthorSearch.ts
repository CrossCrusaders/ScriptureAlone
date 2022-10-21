import { Pagination } from '../core/Pagination'
import { Author } from './Author'


export interface AuthorSearch extends Pagination {
  items: Author[]
}
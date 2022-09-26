import { Address } from '../core/Address'

export interface Church extends Address {
  id: string
  name: string
  email: string
  phone: string
}
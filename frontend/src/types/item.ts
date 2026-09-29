// export interface Item {
//   id: number
//   name: string
//   price: number
//   quantity: number
// }

import type { Product } from './product'

export interface Item extends Product {
  quantity: number
}

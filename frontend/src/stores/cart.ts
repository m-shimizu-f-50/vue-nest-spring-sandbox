import type { Item } from '@/types/item'
import type { Product } from '@/types/product'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // state
  const items = ref<Item[]>([])

  // getter
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }) // 合計金額
  const totalQuantity = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  }) // 合計の個数

  // action
  function addItem(product: Product) {
    const target = items.value.find((item) => item.id === product.id)
    if (target) {
      target.quantity += 1
    } else {
      items.value.push({
        ...product,
        quantity: 1,
      })
    }
  } // 追加
  function changeQuantity(id: number, quantity: number) {
    const target = items.value.find((item) => item.id === id)
    if (!target) return
    target.quantity = quantity
  } // 数量の変更
  function removeItem(id: number) {
    const index = items.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  } // 削除
  function clear() {
    items.value = []
  } // 空にする

  return { items, totalPrice, totalQuantity, addItem, changeQuantity, removeItem, clear }
})

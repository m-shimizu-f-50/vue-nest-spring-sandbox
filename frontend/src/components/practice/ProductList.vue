<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/product'

const { addItem } = useCartStore()

const products: Product[] = [
  { id: 1, name: 'チョコ', price: 300 },
  { id: 2, name: 'じゃがりこ', price: 100 },
]
</script>

<template>
  <ul class="list">
    <li v-for="product in products" :key="product.id" class="item-row">
      <span class="name">{{ product.name }}</span>
      <span class="price">{{ product.price }}円</span>
      <button @click="addItem(product)">カートに追加</button>
    </li>
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.name {
  font-weight: 600;
}

.price {
  margin-right: auto; /* ボタンを右端に寄せる */
}
</style>

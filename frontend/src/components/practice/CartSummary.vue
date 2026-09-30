<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import QuantityInput from './QuantityInput.vue'

const cart = useCartStore()
const { items, totalPrice, totalQuantity } = storeToRefs(cart)
const { changeQuantity, removeItem, clear } = cart
</script>

<template>
  <div>
    <ul class="list">
      <li v-for="item in items" :key="item.id" class="item-row">
        <div>
          <span class="name">{{ item.name }}</span>
          <span class="price">（{{ item.price }}円）</span>
        </div>
        <div class="controls">
          <label>
            数量
            <QuantityInput
              :model-value="item.quantity"
              @update:model-value="(quantity) => changeQuantity(item.id, quantity)"
            />
          </label>
          <button @click="changeQuantity(item.id, item.quantity + 1)">+1</button>
          <button
            @click="changeQuantity(item.id, item.quantity - 1)"
            :disabled="item.quantity === 0"
          >
            -1
          </button>
          <button @click="removeItem(item.id)">削除</button>
        </div>
      </li>
    </ul>

    <div class="summary">
      <p>合計金額：{{ totalPrice }}円</p>
      <p>合計個数：{{ totalQuantity }}個</p>
      <button @click="clear">空にする</button>
    </div>
  </div>
</template>

<style scoped>
.list {
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
}

.item-row {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.name {
  font-weight: 600;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  margin-top: 1rem;
  font-size: 1.1rem;
}

.summary button {
  margin-left: auto; /* 「空にする」を右端に寄せる */
}
</style>

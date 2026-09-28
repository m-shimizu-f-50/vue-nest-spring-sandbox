<script setup lang="ts">
import type { Item } from '@/types/item'
import QuantityInput from './QuantityInput.vue'

interface Props {
  item: Item
  showPrice?: boolean // デフォルトは true
}

const { item, showPrice = true } = defineProps<Props>()

const emit = defineEmits<{
  changeQuantity: [id: number, quantity: number]
  remove: [id: number]
}>()

const increment = (id: number, quantity: number) => {
  emit('changeQuantity', id, quantity + 1)
}
const decrement = (id: number, quantity: number) => {
  if (quantity === 0) return
  emit('changeQuantity', id, quantity - 1)
}
const remove = (id: number) => {
  emit('remove', id)
}

// QuantityInput からの update:modelValue を、親への changeQuantity に中継する
// （props の item.quantity は自分で書き換えない）
const handleChangeQuantity = (quantity: number) => {
  emit('changeQuantity', item.id, quantity)
}
</script>

<template>
  <div class="item-row">
    <span class="name">{{ item.name }}</span>
    <span v-if="showPrice" class="price">（{{ item.price }}円）</span>
    <div class="controls">
      <label>
        数量
        <QuantityInput :model-value="item.quantity" @update:model-value="handleChangeQuantity" />
      </label>
      <button @click="increment(item.id, item.quantity)">+1</button>
      <button @click="decrement(item.id, item.quantity)">-1</button>
      <button @click="remove(item.id)">削除</button>
    </div>
  </div>
</template>

<style scoped>
.name {
  font-weight: 600;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
</style>

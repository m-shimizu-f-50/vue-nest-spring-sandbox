<script setup lang="ts">
import ItemRow from '@/components/practice/ItemRow.vue'
import type { Item } from '@/types/item'
import { computed, ref } from 'vue'

// ---- 1. props と emit：商品リスト ----
const items = ref<Item[]>([
  { id: 1, name: 'チョコ', price: 300, quantity: 2 },
  { id: 2, name: 'じゃがりこ', price: 100, quantity: 5 },
])

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const changeQuantity = (id: number, quantity: number) => {
  const target = items.value.find((item) => item.id === id)
  if (!target) return
  target.quantity = quantity
}
const removeItem = (id: number) => {
  const index = items.value.findIndex((item) => item.id === id)
  if (index !== -1) {
    items.value.splice(index, 1)
  }
}

// ---- 2. props のデフォルト値 ----
// 画面で書き換えないので ref にしない。1 の items とは別のデータにして、共有を避ける
const sampleItems: Item[] = [
  { id: 1, name: 'ルマンド', price: 300, quantity: 2 },
  { id: 2, name: 'カントリーマアム', price: 100, quantity: 5 },
]
</script>

<template>
  <main class="practice">
    <h1>props / emit の練習</h1>

    <section>
      <h2>1. props と emit：商品リスト</h2>
      <p class="note">
        データ（<code>items</code>）を持つのは親だけ。子（<code>ItemRow</code>）は
        <code>changeQuantity</code> / <code>remove</code> を emit
        して頼み、親が書き換える。数量の入力欄は <code>defineModel</code> で作った
        <code>QuantityInput</code>。
      </p>
      <ul class="list">
        <li v-for="item in items" :key="item.id">
          <ItemRow :item="item" @remove="removeItem" @change-quantity="changeQuantity" />
        </li>
      </ul>
      <p class="total">合計：{{ total }}円</p>
    </section>

    <section>
      <h2>2. props のデフォルト値</h2>
      <p class="note">
        <code>:show-price="false"</code> を渡しているので価格が隠れる（1
        は渡していないのでデフォルトの <code>true</code>）。親が emit
        を受け取っていないので、ボタンを押しても何も起きない。
      </p>
      <ul class="list">
        <li v-for="item in sampleItems" :key="item.id">
          <ItemRow :item="item" :show-price="false" />
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.practice {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

section {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.note {
  font-size: 0.9rem;
  opacity: 0.8;
}

.list {
  margin-top: 0.5rem;
  padding-left: 1.25rem;
}

.list li + li {
  margin-top: 0.75rem;
}

.total {
  margin-top: 1rem;
  font-size: 1.25rem;
}
</style>

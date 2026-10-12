<script setup lang="ts">
import { useApplicationStore } from '@/stores/application'
import { storeToRefs } from 'pinia'

const store = useApplicationStore()
const { payment } = storeToRefs(store)
</script>

<template>
  <section class="module">
    <h2>支払方法</h2>
    <div class="field">
      <select id="payment-method" v-model="payment.method">
        <option :value="null">未選択</option>
        <option value="credit">クレジットカード</option>
        <option value="bank">銀行振込</option>
      </select>
    </div>
  </section>
</template>

<style scoped>
.module {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.module h2 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  font-weight: bold;
}

.field {
  display: grid;
  grid-template-columns: 6rem 1fr;
  align-items: center;
  gap: 0.75rem;
}

.field select,
.field input {
  max-width: 20rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
  font: inherit;
}
</style>

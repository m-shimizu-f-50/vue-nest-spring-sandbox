<script setup lang="ts">
import type { PaymentMethod } from '@/types/application'
import { useField } from 'vee-validate'

// select は選んだ時点で値が変わり、そこで検証が走るので handleBlur は不要
const { value: method, errorMessage: methodError } = useField<PaymentMethod | null>(
  'payment.method',
)
</script>

<template>
  <section class="module">
    <h2>支払方法</h2>
    <div class="field">
      <label for="payment-method">支払方法</label>
      <select id="payment-method" v-model="method">
        <option :value="null">未選択</option>
        <option value="credit">クレジットカード</option>
        <option value="bank">銀行振込</option>
      </select>
    </div>
    <span class="error" v-if="methodError">{{ methodError }}</span>
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
.error {
  margin: -0.25rem 0 0 6.75rem; /* ラベル列（6rem）+ gap の分だけ下げ、入力欄の真下に揃える */
  color: #d33;
  font-size: 0.85rem;
}
</style>

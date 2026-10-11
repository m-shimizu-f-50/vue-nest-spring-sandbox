<script setup lang="ts">
// モジュールは store を見て表示し、store に書くだけ。自分では値を持たない
import { useApplicationStore } from '@/stores/application'
import { storeToRefs } from 'pinia'

const store = useApplicationStore()
const { applicant } = storeToRefs(store)
</script>

<template>
  <section class="module">
    <h2>申込者情報</h2>
    <div class="field">
      <label for="name">氏名</label>
      <input id="name" type="text" v-model="applicant.name" />
    </div>
    <div class="field">
      <label for="phone">電話番号</label>
      <input id="phone" type="tel" v-model="applicant.phone" />
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

/* ラベルを左、入力欄を右に並べる。ラベル列の幅を揃える */
.field {
  display: grid;
  grid-template-columns: 6rem 1fr;
  align-items: center;
  gap: 0.75rem;
}

.field input {
  max-width: 20rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
  font: inherit;
}

.field input:focus {
  outline: 2px solid hsla(160, 100%, 37%, 1);
  outline-offset: -1px;
}
</style>

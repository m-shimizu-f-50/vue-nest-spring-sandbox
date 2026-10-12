<script setup lang="ts">
import { useField } from 'vee-validate'

const {
  value: name,
  errorMessage: nameError,
  handleBlur: nameBlur,
} = useField<string>('applicant.name')
const {
  value: phone,
  errorMessage: phoneError,
  handleBlur: phoneBlur,
} = useField<string>('applicant.phone')
</script>

<template>
  <section class="module">
    <h2>申込者情報</h2>
    <div class="field">
      <label for="name">氏名</label>
      <input id="name" type="text" v-model="name" @blur="nameBlur($event, true)" />
    </div>
    <span class="error" v-if="nameError">{{ nameError }}</span>
    <div class="field">
      <label for="phone">電話番号</label>
      <input id="phone" type="tel" v-model="phone" @blur="phoneBlur($event, true)" />
    </div>
    <span class="error" v-if="phoneError">{{ phoneError }}</span>
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
.error {
  margin: -0.25rem 0 0 6.75rem; /* ラベル列（6rem）+ gap の分だけ下げ、入力欄の真下に揃える */
  color: #d33;
  font-size: 0.85rem;
}
</style>

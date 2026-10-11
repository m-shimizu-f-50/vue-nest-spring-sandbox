<script setup lang="ts">
import { useApplicationStore } from '@/stores/application'
import { storeToRefs } from 'pinia'

const store = useApplicationStore()
const { modules, currentModule } = storeToRefs(store)
</script>

<template>
  <ol class="status-bar">
    <li
      v-for="module in modules"
      :key="module.id"
      :class="{ 'is-current': module.id === currentModule?.id }"
    >
      {{ module.label }}
    </li>
  </ol>
</template>

<style scoped>
.status-bar {
  --accent: hsla(160, 100%, 37%, 1);
  --dot-size: 0.875rem;
  --row-gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 1rem;
  border: 1px solid var(--color-border); /* モジュールと同じ枠で、1つの部品だと分かるようにする */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: var(--row-gap);
}

.status-bar li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  opacity: 0.6;
}

/* 丸（番号は付けない） */
.status-bar li::before {
  content: '';
  flex-shrink: 0;
  width: var(--dot-size);
  height: var(--dot-size);
  border: 2px solid var(--color-border);
  border-radius: 50%;
  background-color: var(--color-background);
  position: relative;
  z-index: 1; /* 縦線より手前に出す */
}

/* 丸同士をつなぐ縦線（最後の行には付けない） */
.status-bar li:not(:last-child)::after {
  content: '';
  position: absolute;
  left: calc(var(--dot-size) / 2 - 1px);
  top: 50%;
  width: 2px;
  height: calc(100% + var(--row-gap)); /* 次の行の丸の中心まで伸ばす */
  background-color: var(--color-border);
}

.status-bar li.is-current {
  font-weight: bold;
  color: var(--accent);
  opacity: 1;
}

.status-bar li.is-current::before {
  border-color: var(--accent);
  background-color: var(--accent);
}
</style>

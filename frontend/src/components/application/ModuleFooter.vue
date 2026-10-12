<script setup lang="ts">
defineEmits<{
  (e: 'proceed'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <footer class="module-footer">
    <button type="button" class="cancel" @click="$emit('cancel')">キャンセル</button>
    <button type="button" class="proceed" @click="$emit('proceed')">手続きを行う</button>
  </footer>
</template>

<style scoped>
.module-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background-soft); /* モジュールと見分けがつくよう、地の色を変える */
}

button {
  padding: 0.4rem 1rem;
  border-radius: 4px;
  font: inherit;
  cursor: pointer;
}

.cancel {
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
}

.proceed {
  min-width: 8rem;
  border: 1px solid hsla(160, 100%, 37%, 1);
  background-color: hsla(160, 100%, 37%, 1);
  color: #fff;
}
</style>

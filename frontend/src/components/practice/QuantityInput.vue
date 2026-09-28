<script setup lang="ts">
// v-model の正体は「modelValue の props」と「update:modelValue の emit」
const quantity = defineModel<number>({ required: true })
</script>

<template>
  <input type="number" v-model="quantity" min="0" class="quantity-input" />
</template>

<style scoped>
.quantity-input {
  width: 4rem;
}
</style>

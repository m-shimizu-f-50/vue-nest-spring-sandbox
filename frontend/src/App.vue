<script setup lang="ts">
// ナビに並べるリンク。to にはパスではなくルートの name を使う（パスを変えてもここは直さなくてよい）
const links = [
  { name: 'home', label: 'ホーム' },
  { name: 'ref-reactive', label: 'ref / reactive' },
  { name: 'computed-watch', label: 'computed / watch' },
  { name: 'props-emit', label: 'props / emit' },
  { name: 'pinia', label: 'Pinia' },
]
</script>

<template>
  <header class="app-header">
    <nav>
      <RouterLink v-for="link in links" :key="link.name" :to="{ name: link.name }">
        {{ link.label }}
      </RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
.app-header {
  position: sticky; /* スクロールしても上に残る */
  top: 0;
  z-index: 10;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.75rem 0;
}

nav a {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

/* 今いるページのリンク。RouterLink が自動で付けてくれる class */
nav a.router-link-exact-active {
  color: var(--color-background);
  background-color: hsla(160, 100%, 37%, 1);
}
</style>

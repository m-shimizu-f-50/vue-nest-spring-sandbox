<script setup lang="ts">
import ApplicantModule from '@/components/application/ApplicantModule.vue'
import StatusBar from '@/components/application/StatusBar.vue'

// シェル（大皿）は並べるだけ。値も進捗も持たない（すべて store にある）
</script>

<template>
  <div class="application-shell">
    <aside class="status-area">
      <StatusBar />
    </aside>

    <main class="module-area">
      <ApplicantModule />
    </main>
  </div>
</template>

<style scoped>
.application-shell {
  display: grid;
  grid-template-columns: 180px 1fr; /* 左：ステータスバー／右：モジュール */
  gap: 1.5rem;
  padding: 1.5rem 0;
}

.status-area {
  position: sticky; /* モジュールが縦に伸びても、ステータスバーは見えたまま */
  top: 4rem;
  align-self: start;
}

.module-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

<script setup lang="ts">
import CartSummary from '@/components/practice/CartSummary.vue'
import ProductList from '@/components/practice/ProductList.vue'
</script>

<template>
  <main class="practice">
    <h1>Pinia の練習</h1>
    <p class="note">
      このページは <code>ProductList</code> と <code>CartSummary</code> を並べているだけで、props
      を何も渡していない。2つのコンポーネントは、それぞれ <code>useCartStore()</code>
      を呼んで同じカートを見ている。ページを移動して戻ってきても、カートの中身は残る。
    </p>

    <div class="columns">
      <section>
        <h2>商品一覧</h2>
        <p class="note">「カートに追加」で store の action <code>addItem</code> を呼ぶ。</p>
        <ProductList />
      </section>

      <section>
        <h2>カートの中身</h2>
        <p class="note">
          state と getter は <code>storeToRefs</code> で、action は store から直接取り出す。
        </p>
        <CartSummary />
      </section>
    </div>
  </main>
</template>

<style scoped>
.practice {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.note {
  font-size: 0.9rem;
  opacity: 0.8;
}

.columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

/* 画面が広いときは、商品一覧とカートを横に並べる */
@media (min-width: 768px) {
  .columns {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

section {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}
</style>

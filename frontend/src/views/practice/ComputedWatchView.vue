<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'

interface Item {
  id: number
  name: string
  price: number
  quantity: number
}

interface KeywordChange {
  id: number // v-for の key 用
  oldValue: string
  newValue: string
}

// ---- 1. computed：買い物かご ----
const items = ref<Item[]>([
  { id: 1, name: 'チョコ', price: 300, quantity: 2 },
  { id: 2, name: 'じゃがりこ', price: 100, quantity: 5 },
])

const total = computed(() => {
  console.log('computed版')
  return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})
const totalWithTax = computed(() => Math.floor(total.value * 1.1))

// ---- 2. 関数と computed の比較 ----
const counter = ref(0)

const calcTotal = () => {
  console.log('関数版')
  return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
const increment = () => counter.value++

// ---- 3. watch：検索キーワードの履歴 ----
const keyword = ref('')
const keywordHistory = ref<KeywordChange[]>([])

watch(
  keyword,
  (newValue, oldValue) => {
    console.log(`「${oldValue}」→「${newValue}」で検索`)
    keywordHistory.value.push({
      id: keywordHistory.value.length + 1,
      oldValue: oldValue ?? '', // immediate: true の初回は oldValue が undefined
      newValue,
    })
  },
  { immediate: true },
)

// ---- 4. watchEffect：キーワードとカテゴリ ----
const categories = ['すべて', 'お菓子', '飲み物'] // 書き換えないので ref にしない
const category = ref('すべて')
const searchLogs = ref<string[]>([])

watchEffect(() => {
  // keyword と category を読んでいるので、どちらが変わっても再実行される
  searchLogs.value.push(`検索：${keyword.value}（カテゴリ：${category.value}）`)
  console.log(searchLogs.value)
})
</script>

<template>
  <main class="practice">
    <h1>computed / watch の練習</h1>

    <section>
      <h2>1. computed：買い物かご</h2>
      <p class="note">
        <code>computed</code>
        は依存（<code>items</code>）が変わったときだけ再計算し、それ以外はキャッシュを返す。
      </p>
      <ul class="list">
        <li v-for="item in items" :key="item.id">
          <span>{{ item.name }}（{{ item.price }}円）</span>
          <label>
            数量
            <input type="number" v-model="item.quantity" class="quantity" />
          </label>
        </li>
      </ul>
      <p>合計：{{ total }}円</p>
      <p>税込み：{{ totalWithTax }}円</p>
    </section>

    <section>
      <h2>2. 関数と computed の比較</h2>
      <p class="note">
        console を開いて確かめる。<strong>+1</strong>
        を押すと「関数版」だけ、<strong>数量</strong>を変えると両方のログが出る。
      </p>
      <p>合計（computed 版）：{{ total }}円</p>
      <p>合計（関数版）：{{ calcTotal() }}円</p>
      <p class="value">{{ counter }}</p>
      <button @click="increment">+1</button>
    </section>

    <section>
      <h2>3. watch：検索キーワードの履歴</h2>
      <p class="note">
        監視対象を指定し、古い値も受け取れる。<code>immediate: true</code>
        なので、ページを開いた直後にも1件記録される。
      </p>
      <label>
        キーワード
        <input type="text" v-model="keyword" />
      </label>
      <ul class="list">
        <li v-for="history in keywordHistory" :key="history.id">
          「{{ history.oldValue }}」→「{{ history.newValue }}」
        </li>
      </ul>
    </section>

    <section>
      <h2>4. watchEffect：キーワードとカテゴリ</h2>
      <p class="note">
        中で読んだ値（<code>keyword</code> と
        <code>category</code
        >）を自動で監視する。最初に必ず1回実行され、古い値は受け取れない。キーワードは 3
        の入力欄を使う。
      </p>
      <label>
        カテゴリ
        <select v-model="category">
          <option v-for="option in categories" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
      <ul class="list">
        <li v-for="(log, index) in searchLogs" :key="index">{{ log }}</li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.practice {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

section {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.note {
  font-size: 0.9rem;
  opacity: 0.8;
}

.value {
  font-size: 2rem;
}

label {
  display: block;
  margin-top: 0.5rem;
}

.list {
  margin-top: 0.5rem;
  padding-left: 1.25rem;
}

.list li + li {
  margin-top: 0.25rem;
}

.quantity {
  width: 4rem;
  margin-left: 0.5rem;
}
</style>

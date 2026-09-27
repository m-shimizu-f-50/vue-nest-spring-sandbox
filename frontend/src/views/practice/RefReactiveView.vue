<script setup lang="ts">
import { reactive, ref } from 'vue'

interface User {
  name: string
  age: number
}

// ---- 1. ref：カウンター ----
const count = ref(0)

const increment = () => {
  count.value++
}
const decrement = () => {
  count.value--
}
const reset = () => {
  count.value = 0
}

// ---- 2. reactive：入力と表示 ----
const userInfo = reactive<User>({
  name: '',
  age: 0,
})

// ---- 3. 分割代入で壊れる（わざと） ----
const { name, age } = userInfo

// ---- 4. ref：丸ごと差し替え ----
const currentUser = ref<User>({
  name: '',
  age: 0,
})
const sampleUser: User = {
  name: 'まさと',
  age: 31,
}

const replaceUser = () => {
  currentUser.value = { ...sampleUser }
}
</script>

<template>
  <main class="practice">
    <h1>ref / reactive の練習</h1>

    <section>
      <h2>1. ref：カウンター</h2>
      <p class="note">
        <code>ref</code> は script では <code>.value</code> で読み書きし、template では
        <code>.value</code> を付けない。
      </p>
      <p class="value">{{ count }}</p>
      <button @click="increment">+1</button>
      <button @click="decrement">-1</button>
      <button @click="reset">リセット</button>
    </section>

    <section>
      <h2>2. reactive：入力と表示</h2>
      <p class="note">
        <code>reactive</code> は
        <code>.value</code> なしで、普通のオブジェクトのように書き換えられる。
      </p>
      <label>
        名前
        <input type="text" v-model="userInfo.name" />
      </label>
      <label>
        年齢
        <input type="number" v-model="userInfo.age" />
      </label>
      <p>名前：{{ userInfo.name }} ／ 年齢：{{ userInfo.age }}</p>
    </section>

    <section>
      <h2>3. 分割代入で壊れる（わざと）</h2>
      <p class="note">
        2 の <code>userInfo</code> を分割代入した値。2
        の入力欄に打ち込んでも、<strong>ここは変わらない</strong>のが正しい動き。
      </p>
      <p>名前：{{ name }} ／ 年齢：{{ age }}</p>
    </section>

    <section>
      <h2>4. ref：丸ごと差し替え</h2>
      <p class="note">
        <code>ref</code> は
        <code>.value</code> に新しいオブジェクトを代入すると、丸ごと差し替えられる。
      </p>

      <button @click="replaceUser">サンプルデータを入れる</button>
      <p>名前：{{ currentUser.name }} ／ 年齢：{{ currentUser.age }}</p>
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

button + button {
  margin-left: 0.5rem;
}
</style>

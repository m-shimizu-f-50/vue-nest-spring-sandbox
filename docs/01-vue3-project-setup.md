# Vue 3 プロジェクトの構成と起動の流れ

Phase 1 / ステップ1（2026-09-27）

create-vue で作ったプロジェクトを題材に、**Vue 3 アプリが起動して画面が出るまで**と、**Router / Pinia の基本形**をまとめる。

---

## 用語集

### ツール

- **Vite**: 開発サーバーとビルドを担うツール。webpack の後継的な位置づけで、Vue の作者が作った。Vue でも React でも使われる
- **create-vue**: Vue 公式の雛形ツール（`npm create vue@latest`）。中身は Vite で、Router・Pinia・ESLint などの設定まで済ませた状態で作ってくれる
- **Linter**: コードの誤りや、よくない書き方を指摘するツール（ESLint、Oxlint）
- **Formatter**: インデントや改行などの見た目を自動で整えるツール（Prettier）
- **Oxlint**: Rust 製の高速な Linter。create-vue では ESLint と併用され、Oxlint で見られるルールは ESLint 側で無効にして役割を分けている
- **Vitest**: Vite と設定を共有できる単体テストツール。API は Jest とほぼ同じ（`describe` / `it` / `expect`）
- **E2E テスト**: End-to-End テスト。実際のブラウザを動かし、利用者と同じ操作で画面全体を確認するテスト（Playwright、Cypress など）
- **RC**: Release Candidate。正式リリース直前の候補版。安定版ではない
- **Vue DevTools**: ブラウザでコンポーネントの状態や Pinia の store の中身を確認できる開発者向けツール

### Vue の基本

- **SFC**: Single File Component。`.vue` ファイル1つに `<script>`・`<template>`・`<style>` をまとめて書く形式
- **エントリーポイント**: アプリが最初に読み込まれる入口のファイル。Vite では `index.html`
- **インスタンス**: コンポーネントの定義（設計図）から作られた実体。同じコンポーネントを3回使えば、インスタンスは3つできる
- **マウント**: コンポーネントを実際の DOM に描画すること。`app.mount('#app')` はアプリ全体を `#app` に描画する
- **リアクティブ（リアクティビティ）**: 値の変化を Vue が自動で追跡し、その値を使っているコンポーネントを再レンダリングする仕組み。`ref` / `reactive` で包んだ値だけが対象になる
- **props**: 親コンポーネントから子コンポーネントに渡す値。React の props と同じ
- **コンパイラマクロ**: import せずに使える、ビルド時に Vue のコンパイラが別のコードに変換する特別な関数（`defineProps`、`defineEmits` など）
- **scoped CSS**: `<style scoped>` と書くと、その CSS がそのコンポーネントの中だけに効く。CSS Modules を自動でかけているイメージ
- **プラグイン**: `app.use()` でアプリ全体に機能を追加する仕組み。Router や Pinia はプラグインとして登録する。React で Provider で囲むことに相当する
- **Composable**: `useXxx` という名前の、ロジックを再利用するための関数。React のカスタムフックに相当する

### Router

- **SPA**: Single Page Application。ページ全体を読み込み直さずに、JavaScript で画面を切り替えるアプリ
- **History API（`createWebHistory`）**: ブラウザの機能を使い、`/about` のような普通の URL で画面を切り替える方式。`#/about` のようにハッシュを使う方式もある（`createWebHashHistory`）
- **ナビゲーションガード**: 画面遷移の前後に割り込む処理。例：ログインしていなければログイン画面へ飛ばす
- **遅延読み込み（Lazy Loading）**: その画面を開いたときに初めて JS ファイルを読み込むこと。`() => import('...')` と書く
- **コード分割（Code Splitting）**: ビルド結果を複数の JS ファイル（チャンク）に分けること。遅延読み込みを書くと、その画面の分が別ファイルになる
- **ハッシュ付きファイル名**: `About.a1b2c3.js` のように、中身から計算した識別子を付けたファイル名。中身が変わると名前も変わるので、ブラウザのキャッシュが古いまま残る問題を防げる

### Pinia

- **store**: アプリ全体で共有する状態と、それを操作する処理をまとめたもの
- **state**: store が持つデータ本体。setup store では `ref`
- **getter**: state から計算して得られる値。setup store では `computed`
- **action**: state を変更する処理。setup store では普通の関数
- **setup store**: `defineStore('id', () => { ... })` のように関数で書く Pinia の書き方。中身はコンポーネントの `<script setup>` とほぼ同じになる
- **mutations**: Vuex で state を変更するときに必ず通す必要があった仕組み。Pinia では廃止され、action から直接変更する

---

## 1. プロジェクトの作り方

```bash
npm create vue@latest frontend
cd frontend
npm install
npm run dev   # http://localhost:5173
```

### create-vue とは

Vue 公式の雛形ツール。中身は Vite だが、Router・Pinia・ESLint などの**組み込みまで済ませた状態**で作ってくれる。

| コマンド                                      | 中身                            | React で言うと                                  |
| --------------------------------------------- | ------------------------------- | ----------------------------------------------- |
| `npm create vite@latest -- --template vue-ts` | Vue + TS だけの最小構成         | `npm create vite -- --template react-ts`        |
| `npm create vue@latest`                       | Router・Pinia などの設定まで済み | `create-next-app` に近い立ち位置                |

### 選択した構成と理由

| 項目                                  | 選択 | 理由                                                                  |
| ------------------------------------- | ---- | --------------------------------------------------------------------- |
| TypeScript                            | Yes  | 現場の前提                                                            |
| JSX                                   | No   | Vue は `<template>` で書く SFC が標準。React の癖で JSX に逃げないため |
| Router                                | Yes  | 業務アプリは必ず複数画面になる                                        |
| Pinia                                 | Yes  | Vue 公式の状態管理（Vuex の後継）                                     |
| Vitest                                | No   | 参画先は Jest。後から差し替えると設定が残って混乱する                 |
| E2E                                   | No   | 学習範囲外                                                            |
| ESLint / Prettier                     | Yes  | 現場でもほぼ確実に使う。Oxlint（Rust 製の高速 Linter）も併用で入った   |
| 実験的機能（Oxfmt / Vue 3.6 RC / tsgo） | 選ばない | 学習は現場に近い安定版で                                              |
| サンプルコードを省く                    | No   | 公式のお手本として読むため。不要なものは必要になったら消す            |

> **Jest について**：Vite の Vue プロジェクトに Jest を入れるには、`.vue` や TS を Jest が読める形に変換する設定（`@vue/vue3-jest`、`ts-jest`）が必要。ステップ8で組む。

---

## 2. 起動の流れ

```
index.html  →  src/main.ts  →  App.vue  →  <RouterView /> に各画面
```

### index.html — 入口は HTML

```html
<div id="app"></div>
<script type="module" src="/src/main.ts"></script>
```

Vite では `index.html` がエントリーポイント（プロジェクトのルートに置く）。**React + Vite と同じ構造**（React では `<div id="root">` と `main.tsx`）。

### src/main.ts — アプリを組み立てる

```ts
const app = createApp(App) // ルートコンポーネントからアプリを作る
app.use(createPinia())     // プラグインとして Pinia を登録
app.use(router)            // プラグインとして Router を登録
app.mount('#app')          // #app に描画する
```

| Vue                              | React                            |
| -------------------------------- | -------------------------------- |
| `createApp(App).mount('#app')`   | `createRoot(el).render(<App />)` |
| `app.use(createPinia())`         | `<Provider store={store}>` で囲む |
| `app.use(router)`                | `<BrowserRouter>` で囲む          |

- **React は Provider でツリーを入れ子に囲む。Vue は `app.use()` でアプリ本体にプラグインを登録する** → Provider の入れ子地獄が起きない
- **Pinia を Router より先に `use` する**のが一般的。ナビゲーションガード（画面遷移の前に割り込む処理）の中で store を使うことがあるため

---

## 3. SFC（Single File Component）

`.vue` ファイルは3つのブロックでできている。

```vue
<script setup lang="ts">
// ロジック
</script>

<template>
  <!-- 見た目 -->
</template>

<style scoped>
/* このコンポーネントだけに効く CSS */
</style>
```

### `<script setup>`

- import したものやトップレベルで宣言した変数・関数が、**そのまま template で使える**。`return` も `export default` も不要
- **実行されるのは、コンポーネントのインスタンスが作られるたびに1回だけ**

| 場面                                  | script setup は再実行される？ |
| ------------------------------------- | ---------------------------- |
| 値が変わって template が描画し直される | **されない**                  |
| `v-if` で消して、また表示した          | される（新しいインスタンス）  |
| 別の画面へ移動して、戻ってきた          | される                        |
| `v-for` で3つ並べた                   | 3回（1個につき1回）           |

**React との最大の違い**：React の関数コンポーネントは再レンダリングのたびに**関数ごと再実行**される。Vue は script を再実行せず、**`ref` / `reactive` で包んだ値の変化を追跡して、その値を使っているコンポーネントの template だけを実行し直す**（詳しくは [02-vue3-ref-reactive.md](./02-vue3-ref-reactive.md) の「再レンダリングの仕組み」）。

```vue
<script setup lang="ts">
let count = 0                        // ただの変数 → Vue は変化に気づけない
const increment = () => { count++ }
</script>

<template>
  <button @click="increment">{{ count }}</button> <!-- 0 のまま -->
</template>
```

→ これを動かすには `ref` が必要（ステップ2）。
→ リアクティブな値に依存する計算は1回きりでは困るので `computed` を使う（ステップ3）。

### `<style scoped>`

CSS がそのコンポーネント内だけに効く。CSS Modules を自動でかけているイメージ。

### `defineProps`（HelloWorld.vue より）

```ts
defineProps<{
  msg: string
}>()
```

- props の型を TS のジェネリクスで宣言する
- **import 不要**。コンパイラマクロ（ビルド時に Vue のコンパイラが変換する特別な関数）だから
- template では `props.` を付けずに `{{ msg }}` で参照できる

---

## 4. Vue Router（src/router/index.ts）

```ts
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },                                  // 普通に import
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') }, // 遅延読み込み
  ],
})
```

| Vue Router                        | React Router                       |
| --------------------------------- | ---------------------------------- |
| `createWebHistory`                | `createBrowserRouter`              |
| `routes` 配列                      | `<Route path element>`             |
| `name: 'home'` → `router.push({ name: 'home' })` | 相当するものなし        |
| `() => import(...)`               | `React.lazy(() => import(...))`    |
| `<RouterLink to="/">`             | `<Link to="/">`                    |
| `<RouterView />`                  | `<Outlet />`                       |

### 遅延読み込みの使い分け

|                    | 普通に import                  | 遅延読み込み                      |
| ------------------ | ------------------------------ | --------------------------------- |
| 最初の読み込み      | 重くなる（まとめて1ファイル）   | 軽くなる                          |
| その画面を開いたとき | すぐに表示                     | 初回だけ、ファイルの取得を待つ    |

- 判断基準：**最初に、確実に使う画面だけ普通に import する**（ログイン画面、Layout、404 など）
- **業務システムでは全画面を遅延読み込みにすることも多い**（画面数が多い、入口が一つではない、書き方を揃えたい）
- **Next.js はページ単位の分割を自動でやる**が、Vue Router では `() => import()` と書くかどうかで開発者が決める
- 実務のハマりどころ：デプロイ直後、古いタブで画面を移動すると、古いファイル（`About.a1b2c3.js` のようなハッシュ付き）が消えていてエラーになる → `router.onError` で再読み込みする対策を見かける

### `views/` と `components/`

Router に直接つなぐ**画面**は `views/`、画面の**部品**は `components/`。Next.js の `app/` と `components/` の分け方に近い。

---

## 5. Pinia（src/stores/counter.ts）

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)                                // state
  const doubleCount = computed(() => count.value * 2) // getter
  function increment() { count.value++ }              // action
  return { count, doubleCount, increment }
})
```

**setup store（関数形式）は、中身がコンポーネントの `<script setup>` とほぼ同じ書き方**になる。

| Vuex                    | Pinia（Options 形式）        | Pinia（setup 形式）  |
| ----------------------- | ---------------------------- | -------------------- |
| `state`                 | `state: () => ({ count: 0 })` | `ref(0)`             |
| `getters`               | `getters: { ... }`           | `computed(...)`      |
| `mutations` + `actions` | `actions: { ... }`           | 普通の `function`     |

- **Pinia には mutations が無い**
- `'counter'` は store の ID（DevTools の表示などに使われる）
- **`return` し忘れた値は外から見えない**（private 扱い）← よくあるハマりどころ
- `useXxxStore` という名前は、Composable（React のカスタムフック相当）の命名規則に合わせたもの
- 感覚としては Zustand に近い

---

## 自分の言葉で

### 口頭で説明するなら

<!-- 自分の言葉で埋める -->

### 一度やったはずなのに忘れていたこと

<!-- 自分の言葉で埋める -->

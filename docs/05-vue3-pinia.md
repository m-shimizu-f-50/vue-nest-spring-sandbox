# Pinia（store）とナビゲーション

Phase 1 / ステップ5（2026-09-29）

親子関係のないコンポーネントで状態を共有する Pinia の store の作り方・使い方と、store がコンポーネントより長生きする理由をまとめる。あわせて、練習ページを行き来するためのナビゲーションバー（`RouterLink`）も扱う。
練習コード：`frontend/src/stores/cart.ts`、`frontend/src/views/practice/PiniaView.vue`（URL：`/pinia`）、`frontend/src/components/practice/ProductList.vue`、`CartSummary.vue`、`frontend/src/App.vue`（ナビ）

---

## 用語集

### 考え方

- **store**: アプリ全体で共有する状態と、それを操作する処理をまとめたもの。コンポーネントの木の外に置かれる
- **props のバケツリレー（prop drilling）**: 遠くのコンポーネントに値を届けるために、途中のコンポーネントが使わない props を受け取って渡し続けること
- **マウント / アンマウント**: コンポーネントのインスタンスが作られて画面に描画されること／破棄されて画面から消えること。ページを移動すると、前のページのコンポーネントはアンマウントされる
- **永続化**: 再読み込みやブラウザを閉じても値が残るように、どこかに保存しておくこと
- **構造的型付け**: TypeScript の型の考え方。名前ではなく「必要な項目がそろっているか」で判断する。`Item` は `Product` の項目を全部持つので、`Product` を受け取る関数に渡せてしまう

### Pinia

- **Pinia**: Vue 公式の状態管理ライブラリ。Vuex の後継
- **`defineStore`**: store を定義する関数。第1引数は store の ID（アプリ全体で一意）
- **setup store**: `defineStore('id', () => { ... })` と関数で書く書き方。中身はコンポーネントの `<script setup>` とほぼ同じ
- **options store**: `defineStore('id', { state, getters, actions })` とオブジェクトで書く書き方。Vuex に近く、Vuex からの移行でよく使われる
- **state / getter / action**: store が持つデータ（`ref`）／データから計算した値（`computed`）／データを変更する処理（関数）
- **`storeToRefs`**: store から state と getter を、`ref` として取り出す関数。分割代入してもリアクティブさが保たれる
- **`pinia-plugin-persistedstate`**: store の中身を localStorage などに自動で保存・復元してくれる、定番のプラグイン

### Vue Router / ブラウザ

- **`RouterLink`**: ページを移動するリンク。React Router の `<Link>` に相当。`app.use(router)` で全体に登録されるので import 不要
- **`router-link-active` / `router-link-exact-active`**: `RouterLink` が、今の URL に応じて自動で付ける class
- **localStorage / sessionStorage**: ブラウザにデータを保存する仕組み。localStorage はブラウザを閉じても残り、sessionStorage はタブを閉じると消える

### テンプレート

- **`:disabled`**: ボタンを押せなくする属性を、条件で切り替える
- **`v-else`**: `v-if` の条件が `false` のときに表示する要素。React の三項演算子 `cond ? <A /> : <B />` に相当
- **`$event`**: template のイベントハンドラの中で、イベントの値を参照するための Vue の特別な変数

---

## 1. なぜ store が要るのか

```
App
├── Header
│   └── CartBadge      ← カートの件数を表示したい
└── RouterView
    └── ShopView
        ├── ProductList ← 「カートに追加」したい
        └── CartSummary ← カートの中身と合計を表示したい
```

`CartBadge` と `ProductList` は親子ではない。props / emit で繋ぐと、共通の親（`App`）がデータを持ち、途中のコンポーネントを経由して渡し続けることになる（バケツリレー）。

**store は、コンポーネントの木の外にデータを置いて、どこからでも直接読み書きできるようにする仕組み。**

| | React | Vue |
|---|---|---|
| 小〜中規模 | Context、Zustand | **Pinia** |
| 大規模・歴史のあるもの | Redux | Vuex（Vue 2 時代。今は Pinia が公式） |

Pinia の setup store は Zustand に近い感覚。

## 2. setup store の書き方

```ts
export const useCartStore = defineStore('cart', () => {
  // state
  const items = ref<Item[]>([])

  // getter
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  // action
  function addItem(product: Product) {
    const target = items.value.find((item) => item.id === product.id)
    if (target) {
      target.quantity += 1                         // store の中なので直接書き換える
    } else {
      items.value.push({ ...product, quantity: 1 }) // コピーしてから入れる
    }
  }

  return { items, totalPrice, addItem }
})
```

| Pinia（setup store） | 中身 | Vuex で言うと |
|---|---|---|
| `ref` / `reactive` | state | `state` |
| `computed` | getter | `getters` |
| 普通の関数 | action | `mutations` + `actions`（**Pinia には mutations がない**） |

- 中身はステップ2〜4の知識（`ref`、`computed`、関数）の組み合わせ。ステップ4で親のコンポーネントにあった処理が、store に引っ越した形
- **`return` し忘れたものは外から見えない**
- 名前は `useXxxStore`（Composable の命名規則）
- `addItem` で `{ ...product, quantity: 1 }` とコピーしているのは、商品一覧のオブジェクトをそのまま入れると、カートの数量を変えたときに**商品一覧のデータまで変わる**から（ステップ2の「オブジェクトの共有」）

### 現場で見かける options store

```ts
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: { doubleCount: (state) => state.count * 2 },
  actions: { increment() { this.count++ } },
})
```

Vuex からの移行ではこちらがよく使われる。両方読めるようにしておく。

## 3. コンポーネントから使う

```ts
const cart = useCartStore()                                   // ① まず呼んで store を受け取る
const { items, totalPrice, totalQuantity } = storeToRefs(cart) // ② state と getter
const { changeQuantity, removeItem, clear } = cart             // ③ action はそのまま
```

- store は `reactive` のようなオブジェクトなので、`cart.items` のように **`.value` は不要**
- **どのコンポーネントで `useCartStore()` を呼んでも、同じ store が返ってくる**（アプリ全体で1つ）

| 取り出したいもの | 使うもの | 理由 |
|---|---|---|
| state、getter | **`storeToRefs(cart)`** | リアクティブな値。そのまま分割代入すると繋がりが切れる |
| action | **`cart` から直接** | ただの関数。リアクティブである必要がない |

### よくあるエラー

| エラー | 原因 |
|---|---|
| `Cannot find name 'cart'` | `useCartStore` を import しただけで、`const cart = useCartStore()` と**呼び出していない** |
| `Property 'changeQuantity' does not exist` | **`storeToRefs` から action を取り出そうとしている**。`storeToRefs` が返すのは state と getter だけ |

### storeToRefs を使わずに分割代入すると（未確認・予想）

`const { items, totalPrice, totalQuantity } = cart` と書いた場合の予想。**画面ではまだ確かめていない。**

| 取り出したもの | 中身 | 追加・数量変更 | 「空にする」 |
|---|---|---|---|
| `totalPrice` / `totalQuantity` | 数値のコピー | 更新されない | 更新されない |
| `items` | **store の配列への参照** | **更新される**（同じ配列の中身が変わるため） | **更新されない**（store は新しい配列に差し替わるが、こちらは古い配列を持ったまま） |

**一部だけ動くので、しばらく気づけない**のが一番危ない。「空にする」や、API のデータで差し替えたときだけ表示が古いまま残る、という再現条件の分かりにくいバグになる。
→ **state と getter は、中身が何であっても `storeToRefs` で取り出す**と決めておく。

## 4. state はどこから書き換えるか

Pinia は、コンポーネントから state を直接書き換えることも許している（Vuex の mutations のような制限がない）。それでも、**書き換えは action を通す**のが原則。

```vue
<!-- ✕ v-model が store の state を直接書き換える。@change の action は同じ値を代入し直すだけ -->
<input v-model="item.quantity" @change="changeQuantity(item.id, item.quantity)" />

<!-- ○ 値を渡すのと、変更を受け取って action を呼ぶのを分ける -->
<QuantityInput
  :model-value="item.quantity"
  @update:model-value="(quantity) => changeQuantity(item.id, quantity)"
/>
```

- ✕ の書き方だと、将来 action にルール（「0 になったら取り除く」など）を足しても、**入力欄からの変更はそのルールを通らない**
- **ESLint も見つけてくれない**（`vue/no-mutating-props` は props が対象で、store の state は対象外）
- ルールを action にまとめておけば、ボタンからでも入力欄からでも同じルールが効く。「-1 で 0 未満にしない」も、action の中で守るとどこから呼ばれても安全

**フロントエンドは業務ロジックを持たない**（CLAUDE.md の方針）。store が持つのは画面の状態と API から取ってきたデータ。在庫や割引のような業務のルールはバックエンドの役割。

### イベントの引数と関数の引数の数が合わないとき

`QuantityInput` の `update:modelValue` は `(value)` の1つだけ、store の `changeQuantity` は `(id, quantity)` の2つ。関数名だけ書くと `changeQuantity(3)` と呼ばれて、数量が `id` として扱われる。

`v-for` の中では、template の中で関数を書いて `id` を足す。

```vue
@update:model-value="(quantity) => changeQuantity(item.id, quantity)"
@update:model-value="changeQuantity(item.id, $event)"   <!-- 同じ意味 -->
```

ステップ4の `ItemRow` では `item` が props として script から使えたので、script に `handleChangeQuantity` を作れた。`v-for` で全件を表示するコンポーネントでは、`item` は template の中にしかない。

## 5. store はなぜページを移動しても消えないのか

```
/props-emit から /pinia に移動
  ↓
PropsEmitView のインスタンスが破棄（アンマウント）→ script setup で作った items も消える
  ↓
/props-emit に戻る
  ↓
PropsEmitView が新しく作られる（マウント）→ script setup が再実行 → items は初期値から作り直し
```

| | データのありか | ページを移動すると | 再読み込みすると |
|---|---|---|---|
| ステップ4の `items` | コンポーネントの**インスタンスの中** | 消えて、戻ったら初期値 | 消える |
| ステップ5の `items` | **Pinia の中**（コンポーネントの外） | **残る** | 消える |

- store は、最初に `useCartStore()` が呼ばれたときに1回だけ作られ、`main.ts` の `app.use(createPinia())` で登録した Pinia の中に置かれる。コンポーネントは store を借りて見ているだけ
- **ページの移動は「再レンダリング」ではなく「破棄と作り直し」。** 再レンダリングは同じインスタンスが template を実行し直すこと（→ [02](./02-vue3-ref-reactive.md)）
- 再読み込みすると JavaScript のアプリ全体が起動し直すので、`createPinia()` からやり直しになり、store も空になる

### 永続化したいとき

| 方法 | 内容 |
|---|---|
| 自分で書く | store の中で `watch` を使い、変わるたびに localStorage に保存。起動時に読み込んで初期値にする |
| プラグイン | `pinia-plugin-persistedstate`。`defineStore` にオプションを足すだけで保存と復元をしてくれる |

- **見られて困るものは保存しない。** localStorage は開発者ツールから誰でも中身を見られる（トークンや個人情報は NG）
- **正しいデータはどこにあるか。** 業務システムのカートなら、正しいデータはサーバー（DB）にある。localStorage は入力途中の状態を戻す補助
- タブを閉じたら忘れてよいものは `sessionStorage`

## 6. 型：商品とカートの行を分ける

```ts
// src/types/product.ts：お店に並んでいる商品（数量はない）
export interface Product { id: number; name: string; price: number }

// src/types/item.ts：カートの中の行（何個入れたか）
export interface Item { id: number; name: string; price: number; quantity: number }
// interface Item extends Product { quantity: number } とも書ける
```

- 商品一覧を `Item[]` にすると、使われない `quantity: 2` が入り、「2個カートに入っている？」と読み間違える
- **`Item` を `Product` を受け取る関数に渡しても型エラーにならない**（構造的型付け。必要な項目がそろっているため）。型を `Product[]` にすれば、`quantity` を書いた時点で TS がエラーを出してくれる
- **型を正しく付けると、間違ったデータを書けなくなる**のが型の一番の役目

## 7. ナビゲーションバー（RouterLink）

```vue
<script setup lang="ts">
const links = [
  { name: 'home', label: 'ホーム' },
  { name: 'pinia', label: 'Pinia' },
]
</script>

<template>
  <nav>
    <RouterLink v-for="link in links" :key="link.name" :to="{ name: link.name }">
      {{ link.label }}
    </RouterLink>
  </nav>
  <RouterView />
</template>
```

- **`to` にはパスではなくルートの `name` を渡す。** URL を変えても、ナビは直さなくて済む（ルートの `name` を一意にしたのはこのため）
- `:to` の `:` を忘れると、`"{ name: link.name }"` という文字列が渡る
- リンクの一覧は画面で書き換えないので `ref` にしない。`v-for` で並べれば、ページを増やすときは配列に1行足すだけ

### 今いるページの強調

`RouterLink` が、今の URL に応じて class を自動で付ける。CSS でその class に色を付けるだけでよい。

| class | 付く条件 |
|---|---|
| `router-link-active` | 今の URL がリンク先**から始まる**とき |
| `router-link-exact-active` | 今の URL がリンク先と**完全に一致**するとき |

ホーム（`/`）に `router-link-active` を使うと、どのページも `/` から始まるので**常に強調される**。`exact` を使う。

### create-vue のサンプル CSS の落とし穴

`src/assets/main.css` に、画面幅 1024px 以上で `#app` を**左右2列のグリッド**にするサンプル用のスタイルがあった。ナビを足すとナビとページが左右に並び、それまでも練習ページは広い画面で**左半分にしか表示されていなかった**。削除した。

## 8. レイアウトの CSS

| やりたいこと | CSS |
|---|---|
| 画面が広いときだけ横に並べる | `display: grid` ＋ `@media (min-width: 768px) { grid-template-columns: 1fr 1fr }` |
| 横一列に並べて間隔をあける | `display: flex; gap: 0.5rem` |
| 1つだけ右端に寄せる | 寄せたい要素（またはその手前の要素）に `margin-left: auto` / `margin-right: auto` |
| スクロールしても上に残す | `position: sticky; top: 0` |

---

## 自分の言葉で

### 口頭で説明するなら

<!-- 自分の言葉で埋める -->

### 一度やったはずなのに忘れていたこと

<!-- 自分の言葉で埋める -->

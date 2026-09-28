# props / emit / defineModel

Phase 1 / ステップ4（2026-09-28）

親子コンポーネントの間で値をやり取りする仕組み（`defineProps` / `defineEmits` / `defineModel`）と、単方向データフローをまとめる。
練習コード：`frontend/src/views/practice/PropsEmitView.vue`（URL：`/props-emit`）、`frontend/src/components/practice/ItemRow.vue`、`QuantityInput.vue`

---

## 用語集

### 考え方

- **props**: 親から子に渡す値。React の props と同じ
- **emit**: 子から親に「何かが起きた」と知らせること。イベントを**発行する**と言う
- **単方向データフロー**: データは親から子へ（props）、変更の依頼は子から親へ（emit）という一方通行のルール。React と同じ
- **宣言と実行**: `defineProps` / `defineEmits` は「受け取る値・発行するイベントを定義する」**宣言**。`emit(...)` は実際に発行する**実行**
- **フォールスルー属性**: props や emits として宣言されていない属性・イベントリスナーが、子のルート要素にそのまま付けられる Vue の仕組み
- **制御コンポーネント**: 値を自分で持たず、外から渡された値を表示し、変更を外に通知する入力部品。React の `value` + `onChange` の形

### Vue

- **`defineProps`**: props を宣言するコンパイラマクロ。型は `defineProps<Props>()` とジェネリクスで渡す
- **`withDefaults`**: Vue 3.4 以前の、props にデフォルト値を付ける書き方
- **リアクティブな props の分割代入**: `const { a, b = 1 } = defineProps<Props>()` と分割しても、リアクティブさが保たれる（Vue 3.5 から）
- **`defineEmits`**: 発行するイベントを宣言するコンパイラマクロ。戻り値が発行用の `emit` 関数
- **`$emit`**: 宣言なしで template から呼べる、Vue 組み込みの発行関数。Options API では `this.$emit`
- **`defineModel`**: 子コンポーネントで `v-model` を受け取るマクロ（Vue 3.4 から）。裏で `modelValue` の props と `update:modelValue` の emit を作る
- **書き込みできる computed**: `computed({ get, set })` と、読むときと書くときの処理を別々に書く `computed`
- **`v-if`**: 条件が `true` のときだけ要素を表示する。React の `{cond && <X />}` に相当
- **`vue/no-mutating-props`**: props の書き換えを検出する ESLint のルール
- **`vue/multi-word-component-names`**: コンポーネント名を2単語以上にさせる ESLint のルール。HTML の標準タグと名前がぶつからないようにするため

### TypeScript / JavaScript

- **`noUncheckedIndexedAccess`**: `配列[番号]` で取り出した値を、常に `undefined` かもしれない扱いにする TS の設定。このプロジェクトでは有効
- **型の絞り込み（narrowing）**: `if (!x) return` のようなチェックのあとで、TS が `x` の型から `undefined` などを外してくれること
- **早期リターン**: 条件に合わないときに、関数の最初で `return` して抜ける書き方
- **オプショナルチェーン（`?.`）**: 左側が `null` / `undefined` なら、そこで止めて `undefined` を返す。**代入の左辺には書けない**
- **名前付きエクスポート / デフォルトエクスポート**: `export interface Item`（名前付き、import は `{ Item }`）と `export default`（1ファイル1つ、import 側で名前を自由に付けられる）
- **`import type`**: 型だけを import する書き方。ビルド後の JS から消える

---

## 1. React との一番の違い：子から親への伝え方

| | React | Vue |
|---|---|---|
| 親 → 子 | props | props（同じ） |
| **子 → 親** | 親がコールバック関数を props で渡し、子が**呼ぶ**（`onRemove(id)`） | 子が**イベントを発行**し、親が `@` で受け取る（`emit('remove', id)` → `@remove="..."`） |
| 親が受け取らなかったら | `onRemove` が `undefined` で、呼んだ瞬間にエラー（`?.()` で防ぐ必要がある） | **何も起きない。エラーも出ない**（練習2で確認） |

Vue の emit は「誰かいたら聞いてね」と声をかけるだけ。

**実務の注意**：親で `@chnage-quantity` とタイプミスしたり、子のイベント名を変えて親を直し忘れたりしても、**エラーが出ずに何も起きないだけ**のことがある。「ボタンを押しても何も起きない」ときは、まず親の `@` と子の `defineEmits` の名前が一致しているかを確かめる。

## 2. defineProps

```ts
interface Props {
  item: Item            // 必須
  showPrice?: boolean   // 省略可能
}

// Vue 3.5 から：分割代入 + デフォルト値
const { item, showPrice = true } = defineProps<Props>()
```

**現場で見かける古い書き方**（3.4 以前。今も動く）：

```ts
const props = withDefaults(defineProps<Props>(), { showPrice: true })
// props.item, props.showPrice で使う
```

### 親からの渡し方

| 書き方 | 渡される値 |
|---|---|
| `:show-price="false"` | 真偽値の `false` |
| `show-price="false"` | **文字列の `"false"`**（truthy なので価格が表示されてしまう） |
| 書かない | デフォルト値（`true`） |

- script では camelCase（`showPrice`）、親の template では **kebab-case（`show-price`）**が慣習
- **`:` を付けると `"..."` の中は JS の式**。付けないと文字列

### 分割代入した props を watch するとき

```ts
watch(() => showPrice, ...)   // ○ ゲッター関数で包む
watch(showPrice, ...)          // ✕ その時点の値を渡してしまう
```

ステップ3の「`reactive` のプロパティはゲッターで包む」と同じ理由。

## 3. defineEmits

```ts
// Vue 3.3 から：名前付きタプル
const emit = defineEmits<{
  changeQuantity: [id: number, quantity: number]
  remove: [id: number]
}>()

emit('changeQuantity', 1, 3)   // 引数の型と数がチェックされる
```

**現場で見かける古い書き方**：

```ts
const emit = defineEmits<{
  (e: 'changeQuantity', id: number, quantity: number): void
  (e: 'remove', id: number): void
}>()
```

- script では camelCase で `emit('changeQuantity')`、親の template では **`@change-quantity`**
- 親で `@change-quantity="handleChangeQuantity"` と関数名だけ書けば、**引数は Vue が自動で渡す**
- 受け取る関数の名前は **`handle` + イベント名**（React の `handleClick` と同じ慣習）。イベント名と同じ名前にすると、検索で両方が引っかかる

### 宣言（defineEmits）と実行（emit / $emit）

| | Options API | `<script setup>` |
|---|---|---|
| props の宣言 | `props: { item: Object }` | `defineProps<...>()` |
| emit の宣言 | `emits: ['remove']` | `defineEmits<...>()` |
| script での発行 | `this.$emit('remove', id)` | `emit('remove', id)` |
| template での発行 | `$emit('remove', id)` | `$emit('remove', id)` も使える |

**宣言なしで `$emit` だけ使うと困ること**：

- イベント名のタイプミスや引数の型の間違いを検出できない
- どんなイベントを出すコンポーネントか、template を全部読まないと分からない
- 親のリスナーが**フォールスルー属性**として子のルート要素に付き、`@click` のような標準の名前だと二重に実行されることがある

## 4. 単方向データフロー：役割分担

| | 子（ItemRow） | 親（PropsEmitView） |
|---|---|---|
| データ | 持たない（props で受け取るだけ） | **`items` を持つ** |
| +1 / -1 | 新しい数量を**計算して** `changeQuantity` を emit | 受け取って、該当する商品の数量を書き換える |
| 削除 | `remove` を emit | 受け取って、配列から取り除く |

- 親の関数は、**受け取るイベントに1対1で対応させる**（親にも子にも `increment` を作ると、誰が計算するのか曖昧になる）
- 子は props を**使うことはできる**。関数の引数でわざわざ受け取らなくても、`item.id` を直接使える

### props は書き換えない：気づきにくい落とし穴

| 子の中で | TypeScript | ESLint |
|---|---|---|
| `props.item = 別のもの`（props そのもの） | エラー（読み取り専用） | エラー |
| **`props.item.quantity++`（props の中身）** | **何も言わない** | **エラー**（`vue/no-mutating-props`） |

※ 手元で確かめた結果（TypeScript と ESLint）。

props の**中身**は書き換えられてしまい、実行時にも画面上は動いてしまう（同じオブジェクトを親と共有しているため、親のデータも変わる）。**ESLint がなければ気づけない。**

「動くのになぜダメか」：データを変えている場所が親と子に散らばり、「この値はどこで変わった？」を追えなくなるから。

## 5. defineModel：コンポーネントに v-model を付ける

### v-model の正体

```vue
<QuantityInput v-model="count" />

<!-- ↓ Vue が裏でこう展開している -->
<QuantityInput
  :model-value="count"
  @update:model-value="(v) => (count = v)"
/>
```

**コンポーネントの `v-model` は「props + emit」の省略形。** 単方向データフローは守られたまま。

### 子の側（QuantityInput.vue）

```vue
<script setup lang="ts">
const quantity = defineModel<number>({ required: true })
</script>

<template>
  <input type="number" v-model="quantity" min="0" />
</template>
```

- `quantity.value` を読む → 親から渡された値（props）
- `quantity.value` に代入する → 親に `update:modelValue` を emit（**子の中の値が変わるのではなく、親に頼むだけ**）

**古い書き方**（3.3 以前）：`defineProps<{ modelValue: number }>()` と `defineEmits<{ 'update:modelValue': [value: number] }>()` を自分で書く。

### props を v-model につなぎたいとき（ItemRow の中）

```vue
<!-- ✕ props の中身を書き換えることになる -->
<QuantityInput v-model="item.quantity" />
```

展開すると `@update:model-value="(v) => (item.quantity = v)"` になり、**props の中身への代入**になる。受け取った値は、自分で書き換えずに**親への emit に中継する**。

**方法A：展開した形で書く**（練習ではこちらを採用）

```vue
<QuantityInput :model-value="item.quantity" @update:model-value="handleChangeQuantity" />
```

```ts
const handleChangeQuantity = (quantity: number) => {
  emit('changeQuantity', item.id, quantity)
}
```

**方法B：書き込みできる computed を v-model につなぐ**（現場でよく見る定番の形）

```ts
const quantity = computed({
  get: () => item.quantity,
  set: (value) => emit('changeQuantity', item.id, value),
})
```

```vue
<QuantityInput v-model="quantity" />
```

`computed(() => ...)` は読み取り専用だが、`{ get, set }` を渡すと書き込みもできる。

### なぜ大事か

VeeValidate では「ラベル＋入力欄＋エラーメッセージ」をまとめた部品を作る。そこで `v-model` を受け取る書き方が必要になる。

## 6. 配列の操作と型

### 探す：find と findIndex

```ts
// ○ find：要素そのものを探す → if で絞り込める
const target = items.value.find((item) => item.id === id)
if (!target) return
target.quantity = quantity          // target は Item 型に絞り込まれている

// ✕ findIndex + [index]：チェックしたもの（index）と使うもの（items.value[index]）が別
const index = items.value.findIndex((item) => item.id === id)
if (index !== -1) {
  items.value[index].quantity = quantity   // noUncheckedIndexedAccess で Item | undefined のまま
  items.value[index]?.quantity = quantity  // TS2779：代入の左辺に ?. は書けない
}
```

- **チェックしたものと使うものが同じ変数**だと、TS が型を絞り込める
- `items.value[index]!.quantity` の `!` は、`as` と同じく型チェックを黙らせるだけなので避ける
- `noUncheckedIndexedAccess` があるので、`<ItemRow :item="items[0]" />` も型エラーになる（`Item | undefined` を必須の `Item` に渡せない）

### 取り除く：filter と splice

```ts
// filter：条件に合うものだけの新しい配列を作る（元の配列は変わらない）
items.value = items.value.filter((item) => item.id !== id)

// findIndex + splice：元の配列から直接取り除く
const index = items.value.findIndex((item) => item.id === id)
if (index !== -1) items.value.splice(index, 1)
```

| | `filter` | `findIndex` + `splice` |
|---|---|---|
| 元の配列 | 変わらない（新しい配列を代入し直す） | 直接変わる |
| 注意点 | ― | **`-1` のチェック必須**。`splice(-1, 1)` は最後の要素を消す |
| 向いている場面 | 条件に合うものをまとめて消す | `reactive` の配列など、代入し直せないとき |

- Vue ではどちらでも画面が更新される（`items` は `ref` なので、代入も中身の変更も検知できる）
- `delete arr[1]` は位置を空（`empty`）にするだけで、長さが変わらない。配列には使わない

## 7. 型の置き場所

親と子の両方で使う型は `src/types/` に分けて、**名前付きエクスポート**にする。

```ts
// src/types/item.ts
export interface Item { id: number; name: string; price: number; quantity: number }

// 使う側
import type { Item } from '@/types/item'
```

`export default` にしないのは、1ファイルに1つしか持てず、import 側で好きな名前を付けられて（`import type Product from ...`）名前が揃わなくなるから。

## 8. ハマりどころ

| ハマりどころ | 対処 |
|---|---|
| `a++` を emit に渡すと、+1 される前の値が渡る | `a++` は「今の値を返してから +1」。計算結果だけ渡すなら `a + 1` |
| `a += 1` で引数の変数まで書き換えている | 変数を変える必要はない。`a + 1` |
| `-1` と `+1` の両方に「0 なら return」を入れて、0 から戻れなくなる | 境界の値（0、空、1件）で実際に操作して確かめる。型チェックでも ESLint でも見つからない |
| 数量がマイナスになる | 子で emit しない／ボタンを `:disabled` にする／親で弾く。押せないボタンは最初から押せない見た目にする方が親切 |
| ボタンを `<label>` で囲むと、文字をクリックしたときに最初のボタンが押される | `<label>` は入力欄の名前を表すタグ。ボタンをまとめるなら `<div>` |
| 入力欄の横の「数量:」がただの文字 | `<label>` で入力欄ごと囲むと結び付く（子コンポーネントの中の `<input>` でも、画面上の HTML で中にあれば結び付く） |
| 定義と呼び出しで揃ってタイプミス（`handleChnageQuantity`） | 動いてしまうので、どのチェックでも見つからない。直すときはエディタの「名前の変更」（F2）を使う |
| 入力欄を空にすると `''` が、キーボードなら `-5` も入る | `min="0"` は矢印ボタンしか制限しない。入力値の検証は VeeValidate の役割 |
| コンポーネント名が1単語（`Item.vue`） | ESLint の `vue/multi-word-component-names` でエラー。`ItemRow` のように2単語以上 |
| 名前と価格の `<span>` を入れ子にすると、Prettier が `>` を次の行に送る | Prettier がインライン要素の空白を変えないようにしているため。横に並べれば普通の形になる |

## 9. 未確認のこと

練習の途中で予想として出したが、まだ画面で確かめていないこと。

- **`<QuantityInput v-model="item.quantity" />` と書いたときの ESLint の結果**：`vue/no-mutating-props` でエラーになると予想
- **練習2（親が emit を受け取っていない行）の入力欄に数字を打ち込んだとき**：入力欄には打ち込んだ数字が表示されるが、データは変わらず、**画面とデータが食い違う**と予想。そのあと「+1」を押すとどうなるか

---

## 自分の言葉で

### 口頭で説明するなら

<!-- 自分の言葉で埋める -->

### 一度やったはずなのに忘れていたこと

<!-- 自分の言葉で埋める -->

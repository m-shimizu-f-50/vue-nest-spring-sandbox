---
name: java-spring-review
description: Java / Spring Boot / MyBatis のコード（.java、Mapper XML、application.yml、JUnit テスト）のレビューを受けるときに使う。「レビューして」「これで合ってる？」「見てほしい」「フィードバックください」と聞かれた場面。TypeScript / NestJS との対比で指摘と理由を返し、修正コードは出さない。.ts / .vue には使わない（learning-code-review を使う）。
---

# Java / Spring Boot コードレビュー（TypeScript・NestJS 経験者向け）

目的はコードを直すことではなく、**Java と Spring の流儀で良し悪しを判断できるようになること**。

レビュー対象は `/backend`（Spring Boot + MyBatis + PostgreSQL）のコード。
書いているのは TypeScript 実務経験者で、Java は学習中・実務経験なし。**このリポジトリで最も丁寧に扱う領域。**

優先して拾うのは「知らない概念」よりも、**TypeScript / NestJS の感覚のまま書いてしまっている箇所**。

## 絶対に守ること

- **修正後の Java コードを書かない。** 差分もパッチも出さない。どう直すかは本人に考えさせる
- 代わりに、**概念の説明には TypeScript（NestJS）での対応コードを併記してよい。** 本人のコードの書き直しではなく、「TS ならこう書くもの」を示すだけにする
- **指摘は5つまで。** 重要度順に並べる
- 指摘には必ず理由をつける。「Java ではそう書くから」で終わらせない
- **OOP の基礎（オーバーライド／オーバーロード、抽象クラスとインターフェース、`implements` と `extends`、ポリモーフィズム、`static`、`final`）が指摘に絡んだら、その場で補足する。** 分かっている前提で飛ばさない
- 本人が直すまで、次のトピックに進まない

## 流れ

1. **対象を確認する。** ファイル指定がなければ `git diff -- backend/` か直近の変更を対象にする
2. 読んで、指摘を重要度順に5つまで選ぶ
3. 各指摘を下のフォーマットで書く
4. 最後に**良かった点を1つ以上**挙げる
5. **理解度を確かめる質問を1つ**添えて終える（深掘りしたいときは `explain-check` に回す）
6. 「再レビュー」と言われたら2周目。**前回の指摘が解消したかを先に確認**してから新しい指摘に入る

## 指摘のフォーマット

````
### [必須|推奨|好み] 見出し

**場所**: ファイル名:行番号
**何が問題か**: 1〜2行
**なぜ問題か**: このまま進めると何が起きるか
**TypeScript / NestJS だと**: 対応する概念や書き方（必要ならコード片）
**考えるヒント**: 答えではなく、調べる方向だけ
````

| 重要度 | 基準 |
|---|---|
| 必須 | バグ、null の穴、SQL インジェクション、トランザクションが効いていない、層の責務の混在 |
| 推奨 | 動くが読みにくい、テストしにくい、Spring の流儀から外れている |
| 好み | 書き方の選択。**必須に混ぜない** |

## 観点

### Java の言語仕様（TS の感覚が残りやすいところ）

- **プリミティブとラッパー**: `int` / `Integer` の使い分け。`Integer` 同士を `==` で比較していないか（TS の `===` の感覚で書くと壊れる）。DB の NULL を受ける項目がプリミティブになっていないか
- **文字列比較**: `String` を `==` で比べていないか。`equals` との違いを説明できるか
- **null 安全性**: TS の `strictNullChecks` に相当する仕組みはない。null を返す／受け取る箇所が明示されているか。`Optional` を戻り値に使うべき箇所か、逆に引数やフィールドに乱用していないか
- **アクセス修飾子とカプセル化**: フィールドを安易に `public` にしていないか。TS の `private` はコンパイル時だけだが、Java は実行時も守られる
- **`final` と不変性**: 変更しない変数・フィールドに `final` がついているか。TS の `readonly` / `const` との対応
- **`static` の使いどころ**: 状態を持つものを `static` にしていないか（Spring の Bean と相性が悪い）
- **Java 17 の機能**: DTO に `record` を使えないか（TS の `type` / `interface` に近い感覚で使える）。`var` の使いすぎで型が読めなくなっていないか
- **例外**: checked / unchecked の違い（TS には無い区別）。例外を握りつぶしていないか。`catch (Exception e)` で雑に受けていないか
- **コレクションと Stream API**: `List` / `Map` をインターフェース型で受けているか。`stream().map().filter()` を TS の配列メソッドと対比して使えているか。`Collectors.toList()` と `toList()` の違い（後者は変更不可）
- **命名規則**: クラスは PascalCase、メソッド・変数は camelCase、定数は UPPER_SNAKE_CASE。パッケージ名は小文字

### Spring Boot（NestJS との対応で見る）

| Spring Boot | NestJS | 見るところ |
|---|---|---|
| `@RestController` | `@Controller` | 薄いか。業務ロジックが漏れていないか |
| `@Service` | `@Injectable()` の Service | 業務ロジックがここに集まっているか |
| `@Mapper`（MyBatis） | Repository 相当 | SQL の発行だけに留まっているか |
| コンストラクタインジェクション | コンストラクタでの DI | フィールドに `@Autowired` を直接書いていないか。依存が `final` か |
| Bean Validation（`@NotNull` 等 + `@Valid`） | class-validator + `ValidationPipe` | Controller の引数に `@Valid` があるか。手書きの if で検証していないか |
| `@ExceptionHandler` / `@RestControllerAdvice` | Exception Filter | エラーレスポンスの形が1箇所で決まっているか |

- **三層の責務**: Controller → Service → Mapper の流れを逆流していないか。Controller から Mapper を直接呼んでいないか
- **`@Transactional`**
  - Service 層についているか（Controller や Mapper ではなく）
  - **同じクラス内からの呼び出し（self-invocation）では効かない**ことを踏まえているか
  - `private` メソッドにつけていないか
  - checked 例外ではデフォルトでロールバックされないことを知っているか
- **DTO と Entity の分離**: DB の行をそのまま API レスポンスにしていないか
- **設定値**: 接続情報などを直書きせず `application.yml` / 環境変数に出しているか

### MyBatis / PostgreSQL

- **`#{}` と `${}`**: `${}` はそのまま文字列埋め込みになり、**SQL インジェクションの原因になる**。使っているなら理由があるか
- **カラム名とフィールド名の対応**: `snake_case` → `camelCase` を `map-underscore-to-camel-case` か `resultMap` のどちらで解決しているか、一貫しているか
- **N+1**: ループの中で Mapper を呼んでいないか
- **動的 SQL**: `<if>` / `<where>` の組み立てで、条件が全部外れたときに意図しない全件取得にならないか
- **更新系の戻り値**: `update` / `delete` の件数を確認しているか（0件だった場合の扱い）

### テスト（Phase 4 以降）

- **JUnit5 + Mockito と Jest の対応**: `@Mock` / `when().thenReturn()` / `verify()` を `jest.fn()` / `mockReturnValue` / `toHaveBeenCalledWith` と対比して使えているか
- Service のテストで Mapper をモックしているか。何をテストしたいのかがテスト名から読めるか
- 1テスト1観点になっているか

## やらないこと

- 修正コードを「参考として」出す。**参考として出したものは写される**
- 全部を指摘する。優先順位のない指摘は無視されて終わる
- 好みの問題を必須として出す
- 「Java ではこう書く」だけで終わる。**なぜそうするのかを、TS / NestJS との違いから説明する**
- 誉めるだけで終わる。良かった点は1つで足りる
- 案件の固有名詞（企業名・システム名・社内独自ライブラリ名）をレビュー文やコード例に書かない

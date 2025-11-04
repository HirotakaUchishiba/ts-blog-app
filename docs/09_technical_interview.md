# 09. 技術面談シミュレーション（ジュニアエンジニア向け）

## 1. 面談の目的

TypeScriptとReact Router未経験のジュニアエンジニアが、本技術課題を通じて学習した内容について技術面談を実施します。実装したコードを参照しながら、理解度、学習プロセス、課題解決能力を評価します。

---

## 2. 評価観点

### 2.1. プロジェクト全体の理解
- アーキテクチャとファイル構造の理解
- 各ファイルの役割の説明能力
- SSRとCSRの違いの理解

### 2.2. TypeScriptの理解
- 基本的な型定義の理解
- Promise/async/awaitの理解
- 型安全性の意識

### 2.3. React Routerの理解
- loaderとactionの役割と使い分け
- SSRフレームワークとしての利用方法
- ルーティングの仕組み

### 2.4. 実装スキル
- エラーハンドリングの実装
- コードの可読性・保守性
- テストコードの理解

### 2.5. 学習プロセスと課題解決能力
- AIツールの活用方法
- 問題解決のアプローチ
- ドキュメント読解能力

---

## 3. 面談質問リスト

### 【セクション1】プロジェクト全体像の確認（10分）

#### Q1. このプロジェクトの概要を説明してください

**期待される回答:**
- React Router v7をSSRフレームワークとして利用したブログアプリ
- TypeScriptで実装
- loaderとactionを利用したデータ取得・操作の実装
- インメモリデータストアを使用

**評価ポイント:**
- ✅ プロジェクトの目的を簡潔に説明できる
- ✅ 使用技術スタックを列挙できる
- ⚠️ 説明が曖昧な場合は深掘り質問

---

#### Q2. プロジェクトのディレクトリ構造を説明してください。特に`app/routes/`と`app/data/`の違いは？

**期待される回答:**
- `app/routes/`: 各ページ（ルート）のUIコンポーネントとloader/action
- `app/data/`: データ層（サーバー専用モジュール）
- `.server.ts`の意味：クライアントバンドルに含まれないサーバー専用コード

**評価ポイント:**
- ✅ ディレクトリ構造の意図を理解している
- ✅ サーバー/クライアントの分離を理解している
- ⚠️ 理解が浅い場合はコードを見せて説明を求める

**深掘り質問（必要に応じて）:**
- 「なぜ`posts.server.ts`は`.server.ts`という拡張子なのか？」
- 「クライアント側で`posts.server.ts`をインポートするとどうなるか？」

---

#### Q3. SSRとCSRの違いを説明してください。このプロジェクトはどちらですか？

**期待される回答:**
- **SSR（Server-Side Rendering）**: サーバー側でHTMLを生成して返す。初期表示が速い、SEOに有利
- **CSR（Client-Side Rendering）**: ブラウザ側でJavaScriptを実行してHTMLを生成。インタラクティブ
- このプロジェクトは**SSR**（`react-router.config.ts`の`ssr: true`で設定）

**評価ポイント:**
- ✅ SSR/CSRの概念を理解している
- ✅ 設定ファイルで判定できる
- ⚠️ 理解が不十分な場合は`react-router.config.ts`を見せて説明を求める

**深掘り質問:**
- 「SSRとCSR、それぞれのメリット・デメリットは？」
- 「このプロジェクトでSSRを選択した理由は？」

---

### 【セクション2】TypeScriptの理解（15分）

#### Q4. `app/data/posts.server.ts`を見てください。`Post`型の定義と、なぜ`Promise<Post[]>`という型を返す関数にしているか説明してください。

**参照コード:**
```typescript
export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export async function getPosts(): Promise<Post[]> {
  return posts.slice().sort(...).map(clonePost);
}
```

**期待される回答:**
- `Post`型：記事データの構造を定義した型
- `async function`は自動的に`Promise`を返す
- `Promise<Post[]>`は「将来的に`Post[]`型の配列を返す約束」を表す型
- 非同期処理を扱うため（将来的にDB接続などに変更する可能性も考慮）

**評価ポイント:**
- ✅ 型定義の目的を理解している
- ✅ Promise/async/awaitの基本理解がある
- ⚠️ 理解が浅い場合は具体例を出して説明を求める

**深掘り質問:**
- 「`async function`と`Promise`の関係は？」
- 「`getPosts()`を呼び出すとき、`await`が必要な理由は？」

---

#### Q5. `getPosts()`関数で、なぜ`slice()`と`clonePost()`の両方を使っているのですか？

**参照コード:**
```typescript
export async function getPosts(): Promise<Post[]> {
  return posts
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map(clonePost);
}

const clonePost = (post: Post): Post => ({
  ...post,
  createdAt: new Date(post.createdAt),
});
```

**期待される回答:**
- `slice()`: 配列を浅くコピー（配列レベルでのコピー）
- `clonePost()`: オブジェクトを深くコピー（オブジェクトレベルでのコピー）
- `slice()`だけでは配列内のオブジェクトが共有されてしまう
- `clonePost()`で各要素もクローンすることで、呼び出し側が結果を変更しても元のデータに影響しない

**評価ポイント:**
- ✅ 浅いコピーと深いコピーの違いを理解している
- ✅ イミュータブル（不変性）の重要性を理解している
- ⚠️ 理解が浅い場合は具体例で説明を求める

**深掘り質問:**
- 「もし`clonePost()`を使わなかったら、どのような問題が起きるか？」

---

#### Q6. `app/routes/posts.new.tsx`の`action`関数を見てください。`getString`というヘルパー関数がありますが、なぜこのような関数を作ったのですか？

**参照コード:**
```typescript
const getString = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = getString(formData.get("title"));
  const content = getString(formData.get("content"));
  // ...
}
```

**期待される回答:**
- `FormData.get()`は`FormDataEntryValue | null`を返す（`string | File | null`）
- `getString`で型を絞り込み（`string`型であることを保証）
- 同時に`.trim()`で前後の空白を除去（バリデーションのため）

**評価ポイント:**
- ✅ TypeScriptの型絞り込みを理解している
- ✅ 型安全性を意識した実装ができている
- ⚠️ 理解が浅い場合は型の説明を求める

**深掘り質問:**
- 「`FormDataEntryValue`という型を知っていますか？」
- 「型アサーション（`as string`）を使わなかった理由は？」

---

### 【セクション3】React Routerの理解（20分）

#### Q7. `loader`と`action`の違いを説明してください。このプロジェクトではどのように使い分けていますか？

**期待される回答:**
- **`loader`**: ページ表示前にデータを取得する（GET相当）
  - `_index.tsx`: 記事一覧を取得
  - `posts.$postId.tsx`: 特定記事を取得
- **`action`**: フォーム送信などでデータを操作する（POST/DELETE相当）
  - `posts.new.tsx`: 記事を作成
  - `posts.$postId.tsx`: 記事を削除

**評価ポイント:**
- ✅ loader/actionの基本的な役割を理解している
- ✅ RESTfulな設計思想を理解している
- ⚠️ 理解が浅い場合は各ファイルを見せて説明を求める

**深掘り質問:**
- 「なぜ`loader`と`action`を分けるのか？1つの関数で両方処理できないか？」
- 「`loader`はいつ実行されるか？クライアント側でも実行されるか？」

---

#### Q8. `app/routes/posts.$postId.tsx`の`loader`を見てください。エラーハンドリングはどのように実装していますか？

**参照コード:**
```typescript
export async function loader({ params }: Route.LoaderArgs): Promise<LoaderData> {
  const postId = params.postId;
  if (!postId) {
    throw new Response("記事IDが指定されていません。", { status: 400 });
  }

  const post = await getPost(postId);
  if (!post) {
    throw new Response("記事が見つかりません。", { status: 404 });
  }

  return { post: { ...post, createdAt: post.createdAt.toISOString() } };
}
```

**期待される回答:**
- `postId`が未指定の場合: 400エラー（Bad Request）
- 記事が見つからない場合: 404エラー（Not Found）
- `throw new Response()`でHTTPレスポンスとしてエラーを返す
- `ErrorBoundary`でエラーをキャッチして表示

**評価ポイント:**
- ✅ エラーハンドリングの実装を理解している
- ✅ HTTPステータスコードの使い分けを理解している
- ⚠️ 理解が浅い場合は`ErrorBoundary`の実装も確認

**深掘り質問:**
- 「なぜ`throw new Response()`を使うのか？通常の`Error`ではダメなのか？」
- 「`ErrorBoundary`と`loader`のエラーハンドリングの関係は？」

---

#### Q9. `app/routes/posts.new.tsx`の`action`関数を見てください。バリデーションはどのように実装していますか？

**参照コード:**
```typescript
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = getString(formData.get("title"));
  const content = getString(formData.get("content"));

  const errors: NonNullable<ActionData["errors"]> = {};
  if (!title) errors.title = "タイトルを入力してください。";
  if (!content) errors.content = "本文を入力してください。";

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors, fields: { title, content } }, { status: 400 });
  }

  await createPost({ title, content });
  return redirect("/");
}
```

**期待される回答:**
- フォームデータから`title`と`content`を取得
- 空文字列チェックでバリデーション
- エラーがある場合は400ステータスでエラー情報を返す
- 成功時は記事を作成してリダイレクト

**評価ポイント:**
- ✅ バリデーション処理の実装を理解している
- ✅ エラー時にフォームデータを保持する実装を理解している
- ⚠️ 理解が浅い場合は`useActionData`の使い方も確認

**深掘り質問:**
- 「なぜ`Response.json()`を使うのか？」
- 「エラー時に`fields`も返している理由は？」

---

#### Q10. React RouterをSSRフレームワークとして利用するとはどういうことですか？

**期待される回答:**
- React Routerは単なるルーティングライブラリではなく、フルスタックフレームワークとして利用
- サーバー側で`loader`が実行され、HTMLが生成される
- クライアント側でハイドレーション（既存HTMLにReactを接続）が行われる
- `react-router.config.ts`の`ssr: true`で設定

**評価ポイント:**
- ✅ SSRフレームワークとしてのReact Routerを理解している
- ✅ サーバー/クライアントの処理の流れを理解している
- ⚠️ 理解が浅い場合は処理フローを図で説明してもらう

**深掘り質問:**
- 「`loader`はサーバー側とクライアント側、どちらで実行されるか？」
- 「SSRとSPA（Single Page Application）の違いは？」

---

### 【セクション4】実装の詳細確認（10分）

#### Q11. `app/routes/posts.$postId.tsx`の`action`関数を見てください。なぜ`request.method !== "POST"`というチェックをしているのですか？

**参照コード:**
```typescript
export async function action({ params, request }: Route.ActionArgs) {
  // ...
  if (request.method !== "POST") {
    throw new Response("許可されていないメソッドです。", { status: 405 });
  }
  // ...
}
```

**期待される回答:**
- セキュリティのため：想定外のHTTPメソッドでのアクセスを防ぐ
- RESTful APIの原則に従う：POSTメソッドのみを許可
- 405ステータス（Method Not Allowed）でエラーを返す

**評価ポイント:**
- ✅ セキュリティ意識がある
- ✅ HTTPメソッドの適切な使い分けを理解している
- ⚠️ 理解が浅い場合はセキュリティ観点で説明を求める

---

#### Q12. テストコードを実装していますが、`loader`と`action`をテストする際、通常の関数テストと何が違いますか？

**参照コード:**
```typescript
// テスト例
const loaderArgs = {
  params: { postId: post.id },
  request: new Request("http://localhost/"),
  context: {},
  unstable_pattern: "",
} as unknown as Route.LoaderArgs;

const result = await loader(loaderArgs);
```

**期待される回答:**
- `Route.LoaderArgs`/`Route.ActionArgs`という特定の型が必要
- `Request`オブジェクトを直接作成する必要がある
- `FormData`を`body`として設定する（actionの場合）
- `Response`オブジェクトがthrowされる場合の検証方法が異なる

**評価ポイント:**
- ✅ テストコードの特徴を理解している
- ✅ Web標準API（Fetch API）に基づいていることを理解している
- ⚠️ 理解が浅い場合はテストコードを見せて説明を求める

**深掘り質問:**
- 「なぜ`as unknown as Route.LoaderArgs`という型アサーションが必要か？」
- 「`unstable_pattern`プロパティは何のためか？」

---

### 【セクション5】学習プロセスと課題解決能力（10分）

#### Q13. このプロジェクトを実装する過程で、最も難しかった点は何ですか？どのように解決しましたか？

**期待される回答例:**
- SSRの処理フローが理解できなかった → AIに質問して図解してもらった
- `loader`/`action`の型定義がわからなかった → 公式ドキュメントを参照、AIに質問
- テストコードの書き方がわからなかった → テスト仕様書を作成してから実装

**評価ポイント:**
- ✅ 困難を認識し、解決策を試みた
- ✅ 学習プロセスを説明できる
- ✅ AIツールやドキュメントを適切に活用できている

**深掘り質問:**
- 「AIにどのような質問をしましたか？具体的なプロンプトを教えてください」
- 「公式ドキュメントで最も参考になったページは？」

---

#### Q14. `docs/05_ai_usage_log.md`を見ると、AIを活用して学習していますね。AIの使い方について説明してください。

**期待される回答:**
- 概念の理解：インメモリデータモジュール、SSR/CSRの違いなど
- コードの解説：実装したコードの処理フローを説明してもらった
- テスト仕様書の作成：テストケースを網羅的に定義してもらった
- 疑問の解消：型定義、エラーハンドリングなど

**評価ポイント:**
- ✅ AIを適切に活用している（単なるコード生成ではなく、理解を深めるために利用）
- ✅ 人間が最終的にチェックしている（コードの品質責任は人間が持っている）
- ⚠️ AIに依存しすぎている場合は注意

**深掘り質問:**
- 「AIが間違った回答をした場合、どう判断しますか？」
- 「今後、AIを使わずに実装できるようになりますか？」

---

#### Q15. このプロジェクトをさらに改善するとしたら、どのような点を改善しますか？

**期待される回答例:**
- データ永続化（データベースへの接続）
- 認証・認可機能の追加
- ページネーションの実装
- 画像アップロード機能
- エラーログの実装
- パフォーマンス最適化（キャッシュなど）

**評価ポイント:**
- ✅ プロジェクトの限界を認識している
- ✅ 改善点を具体的に挙げられる
- ✅ 本番環境を意識した視点がある

---

## 4. 評価シート

### 評価項目

| 評価項目 | 評価（5段階） | コメント |
|---------|------------|---------|
| **プロジェクト全体の理解** | | |
| - アーキテクチャの理解 | ⭐⭐⭐⭐⭐ | |
| - ファイル構造の理解 | ⭐⭐⭐⭐⭐ | |
| - SSR/CSRの理解 | ⭐⭐⭐⭐⭐ | |
| **TypeScriptの理解** | | |
| - 基本的な型定義 | ⭐⭐⭐⭐⭐ | |
| - Promise/async/await | ⭐⭐⭐⭐⭐ | |
| - 型安全性の意識 | ⭐⭐⭐⭐⭐ | |
| **React Routerの理解** | | |
| - loader/actionの違い | ⭐⭐⭐⭐⭐ | |
| - SSRフレームワークとしての利用 | ⭐⭐⭐⭐⭐ | |
| - ルーティングの仕組み | ⭐⭐⭐⭐⭐ | |
| **実装スキル** | | |
| - エラーハンドリング | ⭐⭐⭐⭐⭐ | |
| - コードの可読性 | ⭐⭐⭐⭐⭐ | |
| - テストコードの理解 | ⭐⭐⭐⭐⭐ | |
| **学習プロセス** | | |
| - AIツールの活用 | ⭐⭐⭐⭐⭐ | |
| - 問題解決能力 | ⭐⭐⭐⭐⭐ | |
| - ドキュメント読解 | ⭐⭐⭐⭐⭐ | |

### 総合評価

- **優秀（90-100点）**: 全項目で高い理解度を示し、追加の質問にも的確に回答できる
- **良好（70-89点）**: 基本的な理解はあるが、一部深掘りが必要
- **要改善（50-69点）**: 基本的な概念は理解しているが、実装の詳細が不十分
- **要学習（0-49点）**: 基本的な理解が不足している

### フィードバック項目

1. **強み**
   - [記入欄]

2. **改善点**
   - [記入欄]

3. **今後の学習推奨事項**
   - [記入欄]

---

## 5. 追加確認事項（必要に応じて）

### コードレビュー形式の質問

実際のコードを見せながら、「この部分はどういう意図で実装しましたか？」と質問する形式も有効です。

#### 例：`app/routes/posts.$postId.tsx`の`loader`関数

```typescript
export async function loader({ params }: Route.LoaderArgs): Promise<LoaderData> {
  const postId = params.postId;
  if (!postId) {
    throw new Response("記事IDが指定されていません。", { status: 400 });
  }
  // ...
}
```

**質問**: 「なぜ`params.postId`を別変数に代入していますか？直接`params.postId`を使わない理由は？」

**期待される回答:**
- TypeScriptの型安全性のため（`params.postId`が`undefined`の可能性があるため）
- 可読性の向上（変数名を短くできる）

---

## 6. 面談の流れ（推奨）

1. **導入（5分）**
   - 自己紹介、プロジェクト概要の確認
   - リラックスできる雰囲気作り

2. **セクション1-4（55分）**
   - 上記の質問を順番に実施
   - 回答が不明確な場合は深掘り質問
   - コードを見せながら説明してもらう

3. **セクション5（10分）**
   - 学習プロセス、課題解決能力を確認

4. **総括（5分）**
   - 質問の機会を提供
   - 次のステップの説明

**合計: 約75分**

---

## 7. 面談後のフォローアップ

- 評価シートを共有
- 具体的なフィードバックを提供
- 学習リソースの推奨（必要に応じて）
- 次の課題やプロジェクトの提案

---

## 補足：面談官の心構え

- **評価の目的**: 知識の有無を確認するだけでなく、学習意欲や問題解決能力も評価する
- **質問の仕方**: 威圧的ではなく、対話形式で進める
- **フィードバック**: 否定的な評価だけでなく、強みも伝える
- **成長の機会**: 理解が浅い点は、今後の学習ポイントとして伝える


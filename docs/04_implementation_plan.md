# 04. 実装計画書 (Implementation Plan)

## 1. 概要

このドキュメントは「シンプルブログアプリ」を実装するための段階的な作業計画書です。`01_requirements.md` と `02_directory_structure.md` を前提に、React Router フレームワークモードで `loader` / `action` を備えた機能を構築します。

## 2. 実装ステップ

### Step 0: 共通基盤の整備

#### A. `app/data/posts.server.ts`

- インメモリで記事を管理するサーバー専用モジュールを作成する。
- `Post` 型（`id`, `title`, `content`, `createdAt`）を定義。
- モジュールスコープに `let posts: Post[] = []` を保持。
- 以下の `async` 関数をエクスポート。
  - `getPosts(): Promise<Post[]>` — 作成日時降順で並べたコピーを返す。
  - `getPost(id: string): Promise<Post | undefined>`
  - `createPost({ title, content }): Promise<Post>`
  - `deletePost(id: string): Promise<void>`
- `.server.ts` として定義し、クライアントコードから参照しない。

#### B. `app/root.tsx`

- `<html>` `<head>` `<body>` を定義し、全ページ共通のレイアウトを実装する。
- `Outlet`, `ScrollRestoration`, `Scripts`, `LiveReload` を配置。
- `<title>ブログアプリ</title>` や `<meta charSet="utf-8" />` を設定。
- 必要に応じて `ErrorBoundary` / `CatchBoundary` を実装する。

---

### Step 1: ルートモジュールの実装

`app/routes/` 以下にページごとの `loader` / `action` と UI を実装する。

#### A. `app/routes/_index.tsx`

- ルート `/` の記事一覧ページを構築する。
- `loader` で `getPosts()` を呼び出し、`json()`（`@react-router/node`）でレスポンスを返す。
- `useLoaderData<typeof loader>()` で記事一覧を描画。
- `/posts/new` へのリンクと、各記事タイトルから `/posts/${post.id}` へ遷移するリンクを配置。

#### B. `app/routes/posts.new.tsx`

- `/posts/new` の新規投稿ページを実装する。
- `action` で `request.formData()` から `title` と `content` を取得。
- バリデーション後に `createPost()` を呼び出し、`redirect('/')` を返す。
- `<Form method="post">` でフォームを構築し、一覧へ戻るリンクを設置。

#### C. `app/routes/posts.$postId.tsx`

- `/posts/:postId` の詳細／削除ページを実装する。
- `loader` で `params.postId` を取得し、`getPost()` を呼び出して `json()` で返す。
- 記事が存在しない場合は `throw new Response("記事が見つかりません", { status: 404 })` を実行。
- `action` で `deletePost()` を呼び出し、`redirect('/')` を返す。
- 削除フォームには `<Form method="post">` と `_method="delete"` を付与する、または `request.method` を分岐して `DELETE` を扱う。
- 一覧ページへ戻るリンクを設置。

---

### Step 2: 追加改善（任意）

- `/posts` 直下のアクセスに対するリダイレクトルートを用意する。
- 共通のナビゲーションやスタイルを追加する場合は `app/components/` を作成。
- ルートごとに `ErrorBoundary` / `CatchBoundary` を定義し、エラー時の UX を向上させる。

---

### Step 3: 動作検証・品質チェック

1. `npm run dev` で開発サーバーを起動し、記事の作成・表示・削除が期待通り動作するか確認する。
2. `npm run build` → `npm run start` で本番ビルドを検証する。
3. `npm run lint` と `npm run typecheck` を実行し、静的解析エラーがないことを確認する。
4. コード構造や命名、フォームバリデーションなどが「クリーンな実装」を意識できているかレビューする。

---

### Step 4: AI 利用ログの更新

- `docs/05_ai_usage_log.md` に Codex または Claude Code をどのように活用したか記録する。
- AI から得た提案をどのように検証・採用したか、人が品質を担保した観点を合わせて記述する。

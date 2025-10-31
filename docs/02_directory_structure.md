# 02. ディレクトリ構成

## 1. 概要

このドキュメントは、React Router 公式フレームワークモード（SSR）で構築する本プロジェクトのディレクトリ構成と、主要ファイルの役割を定義します。

## 2. ルートディレクトリ構成

```text
/my-blog-app
├── /docs/                        # [A] プロジェクトドキュメント
├── package.json                  # プロジェクト定義と依存ライブラリ
├── tsconfig.json                 # TypeScript 設定
├── vite.config.ts                # Vite 設定（React Router CLI が生成）
│
├── /public/                      # 静的アセット
│   └── favicon.ico
│
└── /app/                         # [B] React Router アプリケーションソース
    ├── entry.client.tsx          # [C] クライアント側エントリー
    ├── entry.server.tsx          # [D] サーバー側エントリー
    ├── root.tsx                  # [E] HTML シェルと共通 UI
    │
    ├── /data/                    # [F] サーバーサイドデータロジック
    │   └── posts.server.ts
    │
    └── /routes/                  # [G] ルートモジュール群
        ├── _index.tsx            # ルート `/` 一覧ページ
        └── /posts/
            ├── new.tsx           # `/posts/new` 新規投稿フォーム
            └── $postId.tsx       # `/posts/:postId` 詳細・削除ページ
```

## 3. 各ディレクトリ・ファイルの役割

### [A] `/docs/`

- プロジェクトの仕様・計画・作業ログをまとめるドキュメントフォルダ。
- `01_requirements.md` から `05_ai_usage_log.md` までを格納。

### [B] `/app/`

- React Router のフレームワークコードを配置するトップレベルディレクトリ。
- ルーティング、データローダー、HTML シェルをすべて包含する。

### [C] `app/entry.client.tsx`

- ブラウザでのハイドレーション処理を担うエントリーポイント。
- `hydrateRoot` を用いて `root.tsx` が生成したマークアップを再接続する。

### [D] `app/entry.server.tsx`

- Node.js サーバーでの SSR を担当するエントリーポイント。
- React Router が提供する `renderToReadableStream` を利用してレスポンスを生成する。

### [E] `app/root.tsx`

- `<html>`, `<head>`, `<body>` を定義し、`<Outlet />` や `<ScrollRestoration />` など共通要素を配置する。
- エラーバウンダリやフォールバック UI を実装する場所でもある。

### [F] `/app/data/posts.server.ts`

- インメモリで記事データを扱うサーバー専用モジュール。
- `getPosts`, `getPost`, `createPost`, `deletePost` などの関数をエクスポートし、`loader` / `action` から利用する。

### [G] `/app/routes/`

- URL ごとの UI・`loader`・`action` を定義するモジュール群。
- `_index.tsx` はトップページの記事一覧を担当。
- `posts.new.tsx` は新規投稿フォームと投稿処理を担当。
- `posts.$postId.tsx` は記事詳細と削除処理を担当し、404 応答を適切に返す。

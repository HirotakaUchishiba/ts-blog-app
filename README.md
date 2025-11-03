# TypeScript Blog App

React Router v7をSSRフレームワークとして利用した、シンプルなブログアプリケーションです。`loader`および`action`機能を使用したデータ取得とデータ操作の実装例を含んでいます。

## 📋 プロジェクト概要

このプロジェクトは、React Router v7の`loader`と`action`機能を学習・実証するための技術課題として作成されました。TypeScriptで書かれており、サーバーサイドレンダリング（SSR）に対応しています。

### 主な機能

- **記事一覧表示** (`/`) - 全記事のタイトル一覧を表示
- **記事詳細表示** (`/posts/:id`) - 特定記事のタイトルと本文を表示
- **記事作成** (`/posts/new`) - 新しい記事を作成
- **記事削除** - 記事詳細ページから記事を削除

## 🛠️ 技術スタック

- **フレームワーク**: React Router v7.9.2（SSRフレームワークモード）
- **言語**: TypeScript 5.9.2
- **UI ライブラリ**: React 19.1.1
- **スタイリング**: Tailwind CSS 4.1.13
- **ビルドツール**: Vite 7.1.7
- **テスト**: Vitest 2.0.0
- **データストア**: インメモリ（サーバー再起動でリセット）

## 🚀 セットアップ

### 前提条件

- Node.js 20以上
- npm（またはpnpm、yarn）

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

開発サーバーは `http://localhost:5173` で起動します。

### ビルド

本番用ビルドを作成:

```bash
npm run build
```

ビルド成果物は `build/` ディレクトリに出力されます。

### 本番サーバーの起動

```bash
npm start
```

ビルド後に本番サーバーを起動します（デフォルトポート: 3000）。

## 🧪 テスト

### テストの実行

```bash
npm test
```

### テストUIの起動

```bash
npm run test:ui
```

### カバレッジレポートの生成

```bash
npm run test:coverage
```

## 📁 プロジェクト構造

```
ts-blog-app/
├── app/
│   ├── data/
│   │   └── posts.server.ts      # インメモリデータストア
│   ├── routes/
│   │   ├── _index.tsx            # 記事一覧ページ（loader実装）
│   │   ├── _index.test.tsx       # 記事一覧のテスト
│   │   ├── posts.$postId.tsx     # 記事詳細ページ（loader + action実装）
│   │   ├── posts.$postId.test.tsx # 記事詳細のテスト
│   │   ├── posts.new.tsx         # 記事作成ページ（action実装）
│   │   └── posts.new.test.tsx    # 記事作成のテスト
│   ├── root.tsx                  # ルートコンポーネント
│   └── app.css                   # グローバルスタイル
├── build/                        # ビルド成果物（gitignore対象）
├── docs/                         # プロジェクトドキュメント
├── public/                       # 静的ファイル
├── react-router.config.ts        # React Router設定
├── tsconfig.json                 # TypeScript設定
├── vite.config.ts                # Vite設定
├── vitest.config.ts              # Vitest設定
└── Dockerfile                    # Docker設定
```

## 🔑 実装されている主要機能

### Loader（データ取得）

- **記事一覧取得** (`_index.tsx`): 全記事を取得し、作成日時の降順でソート
- **記事詳細取得** (`posts.$postId.tsx`): IDに基づいて特定の記事を取得。記事が見つからない場合は404エラーを返す

### Action（データ操作）

- **記事作成** (`posts.new.tsx`): フォームからタイトルと本文を受け取り、新規記事を作成。バリデーションを含む
- **記事削除** (`posts.$postId.tsx`): 記事IDに基づいて記事を削除し、一覧ページへリダイレクト

### エラーハンドリング

- **ErrorBoundary**: 記事が見つからない場合などのエラーを適切にハンドリング

## 💾 データモデル

```typescript
type Post = {
  id: string;           // UUID形式の一意な識別子
  title: string;        // 記事のタイトル
  content: string;      // 記事の本文
  createdAt: Date;      // 作成日時
};
```

**注意**: データはインメモリで管理されています。サーバーを再起動すると、すべてのデータが失われます。

## 🐳 Docker デプロイメント

### Dockerイメージのビルド

```bash
docker build -t ts-blog-app .
```

### コンテナの起動

```bash
docker run -p 3000:3000 ts-blog-app
```

アプリケーションは `http://localhost:3000` でアクセス可能です。

### デプロイ先

以下のプラットフォームでデプロイ可能です：

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

## 📝 利用可能なスクリプト

| スクリプト | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動（HMR有効） |
| `npm run build` | 本番用ビルドを作成 |
| `npm start` | 本番サーバーを起動 |
| `npm test` | テストを実行 |
| `npm run test:ui` | テストUIを起動 |
| `npm run test:coverage` | カバレッジレポートを生成 |
| `npm run typecheck` | 型チェックを実行 |

## 📚 関連ドキュメント

詳細な要件定義や実装計画は `docs/` ディレクトリを参照してください：

- `01_requirements.md` - アプリケーション要件定義書
- `02_directory_structure.md` - ディレクトリ構造の説明
- `03_setup_guide.md` - セットアップガイド
- `04_implementation_plan.md` - 実装計画
- `08_test_specification.md` - テスト仕様

## ⚠️ 注意事項

1. **データ永続化**: このアプリケーションはインメモリデータストアを使用しています。サーバーを再起動すると、すべてのデータが失われます。本番環境では適切なデータベースを使用してください。

2. **エラーハンドリング**: 基本的なエラーハンドリングは実装されていますが、本番環境ではより詳細なエラー処理が必要です。

3. **認証・認可**: このアプリケーションには認証・認可機能は実装されていません。

## 🔗 関連リンク

- [React Router ドキュメント](https://reactrouter.com/)
- [React Router フレームワークモード](https://reactrouter.com/start/framework/installation)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/)
- [Vitest ドキュメント](https://vitest.dev/)

## 📄 ライセンス

このプロジェクトは技術課題として作成されたものです。

---

Built with ❤️ using React Router v7

# 03. 環境構築ガイド (Setup Guide)

## 1. 概要

このガイドは、React Router 公式フレームワークモード（SSR）を用いてブログアプリの開発環境を構築する手順を示します。

## 2. 前提条件

- Node.js v18 以上
- npm（Node.js に付属）
- Git 等のバージョン管理ツール（任意）

## 3. 構築ステップ

### Step 1: プロジェクトの初期化

React Router CLI で SSR 対応の TypeScript プロジェクトを生成する。

```bash
# まだプロジェクトが無い場合、任意の親ディレクトリで実行
npm create react-router@latest my-blog-app -- --typescript

# プロンプト例
# ✔ Which template would you like to use? › Remix (recommended)
# ✔ Server runtime? › Node
# ✔ JavaScript or TypeScript? › TypeScript

cd my-blog-app
```

### Step 2: 依存関係のセットアップ

CLI が必要な依存（React Router, @react-router/dev, React, Vite, TypeScript など）を自動的に追加する。生成後に最新の状態へ更新。

```bash
npm install
npm run lint         # 任意：Lint の確認
npm run typecheck    # 任意：型チェック
```

追加のライブラリが必要になった場合は、適宜 `npm install` する。

### Step 3: プロジェクト構成の確認

生成直後のディレクトリ構成は次の通り。

```text
ts-blog-app/
├── app/
│   ├── app.css
│   ├── root.tsx
│   ├── routes.ts
│   ├── routes/
│   │   └── home.tsx
│   └── welcome/
│       ├── logo-dark.svg
│       ├── logo-light.svg
│       └── welcome.tsx
├── public/
├── package.json
├── react-router.config.ts
├── tsconfig.json
└── vite.config.ts
```

`app/routes.ts` でルーティング定義を行い、`app/routes/` 以下にページごとのモジュールを追加していく。

### Step 4: 開発サーバーの起動

```bash
npm run dev
```

`http://localhost:5173` で SSR 対応の開発サーバーが起動する。`loader` や `action` を変更するとホットリロードされる。

### Step 5: 本番ビルドとプレビュー

```bash
npm run build
npm run start
```

`npm run start` はビルド済み成果物を Node.js サーバーで起動し、本番動作を確認できる。

## 4. 次のステップ

ここまででフレームワークの土台が整う。`04_implementation_plan.md` に従って `loader` / `action` を実装し、ブログ機能を構築する。

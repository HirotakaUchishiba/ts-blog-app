# 07. 実装分析ドキュメント
このドキュメントは、特定スコープの実装を振り返るためのテンプレートです。

---

## 0. スコープ概要

| 項目 | 内容（例） |
| --- | --- |
| スコープ名 | React Router ブログ用ルート構成の刷新 |
| 実施期間 | 2025-11-2 |
| 目的 | loader/action を備えたブログページ群を実装し、要件を満たす土台を構築する |
| 成果物 | `app/routes.ts`, `app/routes/_index.tsx`, `app/routes/posts.new.tsx`, `app/routes/posts.$postId.tsx` など |

> 他スコープでは、目的と主要成果物を差し替えて使用してください。

---

## 0-2. スコープ概要（テストコード実装）

| 項目 | 内容 |
| --- | --- |
| スコープ名 | loader/action のテストコード実装 |
| 実施期間 | テスト仕様書作成後 |
| 目的 | テスト仕様書に基づいて loader/action 関数のテストコードを実装し、正常系・異常系の動作を検証する |
| 成果物 | `app/routes/_index.test.tsx`, `app/routes/posts.$postId.test.tsx`, `app/routes/posts.new.test.tsx`, `vitest.config.ts`, `app/data/posts.server.ts`（テスト用ヘルパー関数追加） |

---

## 1. 作業シーケンス

| ステップ | 内容 | 今回のサンプル |
| --- | --- | --- |
| 1. 準備 | 関係資料・過去のエラー分析を読み、リスクや注意点を整理 | `docs/06_error_analysis.md` を確認し、import/型のミスを再認識した |
| 2. 土台整備 | ルート定義・ディレクトリ構成を先に整える | `app/routes.ts` を刷新し、不要な `home.tsx` を削除 |
| 3. 機能実装 | ページ（loader/action）と UI を実装 | `_index.tsx`, `posts.new.tsx`, `posts.$postId.tsx` を追加し実装 |
| 4. 共通部の調整 | 共通レイアウト・ナビを最新構成に合わせる | `app/root.tsx` にヘッダーナビリンクを追加 |
| 5. 検証 | 型チェックや動作確認を行い不具合を修正 | `npm run typecheck` でエラーを修正しながら進行 |
| 6. 差分確認 | 変更箇所の一覧を確認し意図しない差分がないか整理 | `git status -sb` で最終差分を確認 |

> 他スコープでも行ったステップをこの表に追記し、実作業の流れを可視化してください。

---

## 1-2. 作業シーケンス（テストコード実装）

| ステップ | 内容 | 今回のサンプル |
| --- | --- | --- |
| 1. 準備 | テスト仕様書を確認し、テスト対象とテストケースを整理 | `docs/08_test_specification.md` を確認し、テストケースと実装方針を把握 |
| 2. テスト環境整備 | テストフレームワークと設定ファイルを準備 | Vitestとテスト関連依存関係をインストール、`vitest.config.ts` を作成 |
| 3. テスト用ヘルパーの追加 | テストデータ管理のためのヘルパー関数を追加 | `app/data/posts.server.ts` に `clearAllPosts()` 関数を追加 |
| 4. テストファイルの作成 | 各ルートファイルに対応するテストファイルを作成 | `_index.test.tsx`, `posts.$postId.test.tsx`, `posts.new.test.tsx` を作成 |
| 5. 型エラーの修正 | TypeScriptの型チェックエラーを修正 | `unstable_pattern` プロパティの追加と型アサーション（`as unknown as`）の使用 |
| 6. テスト実行と検証 | テストを実行し、すべてのテストケースがパスすることを確認 | `npm test -- --run` で全14テストケースがパスすることを確認 |

---

## 2. ファイル操作ログ

### 2.1 追加
- `app/routes/_index.tsx` : 記事一覧の loader/UI を実装（インメモリデータの表示）
- `app/routes/posts.new.tsx` : 新規投稿フォームと action を実装（作成→リダイレクト）
- `app/routes/posts.$postId.tsx` : 詳細表示と削除 action を実装（404 ハンドリング込み）

### 2.2 削除
- `app/routes/home.tsx` : テンプレートの歓迎ページが不要になったため削除

### 2.3 編集
- `app/routes.ts` : 新しいルートをマッピング
- `app/root.tsx` : 共通ヘッダーをブログ用のリンクに更新
- 各ルートモジュール : 正しい import・型注釈で loader/action/UI を統合

> 追加・削除・変更の意図をこの形式で残すと、別スコープでも差分の理由が追いやすくなります。

---

## 2-2. ファイル操作ログ（テストコード実装）

### 2.1 追加
- `app/routes/_index.test.tsx` : 記事一覧ページのloaderテスト（正常系2ケース）
- `app/routes/posts.$postId.test.tsx` : 記事詳細ページのloader/actionテスト（正常系1ケース、異常系5ケース）
- `app/routes/posts.new.test.tsx` : 記事新規作成ページのactionテスト（正常系2ケース、異常系4ケース）
- `vitest.config.ts` : Vitest設定ファイル（TypeScriptパス解決の設定）

### 2.2 削除
- なし

### 2.3 編集
- `app/data/posts.server.ts` : テスト用ヘルパー関数 `clearAllPosts()` を追加
- `package.json` : テストスクリプト（`test`, `test:ui`, `test:coverage`）を追加

---

## 3. 実行コマンドと目的

| コマンド | タイミング | 目的 | 結果・学び |
| --- | --- | --- | --- |
| `npm run typecheck` | 各ルート実装後 | `react-router typegen` + TypeScript チェックで import/型エラーを即時発見 | 誤った import 先を早期に修正、最終的に成功 |
| `git status -sb` | 実装完了後 | 差分確認と不要ファイルの検出 | 変更が想定どおりであることを確認 |

> 他スコープでも、実行したコマンドと目的をこの表に追記してください。

---

## 3-2. 実行コマンドと目的（テストコード実装）

| コマンド | タイミング | 目的 | 結果・学び |
| --- | --- | --- | --- |
| `npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom` | テスト実装開始時 | テストフレームワークとテストライブラリをインストール | VitestがViteプロジェクトと統合しやすい |
| `npm run typecheck` | テストファイル作成後 | 型エラーを検出 | `unstable_pattern` プロパティが必要であることを発見 |
| `npm test -- --run` | テストコード実装後 | 全テストケースが正常にパスすることを確認 | 全14テストケースが成功し、仕様書の要件を満たしていることを確認 |

---

## 4. 参照した情報源

| 参照先 | 利用目的 |
| --- | --- |
| `docs/06_error_analysis.md` | 過去のエラー原因と再発防止策を確認 |
| `.react-router/types/app/routes/+types/*.ts` | 自動生成される `LoaderArgs`, `ActionArgs` を確認して型の誤りを防止 |
| `app/data/posts.server.ts` | CRUD 関数の仕様を確認し、loader/action の戻り値へ反映 |

> 今後参照した資料・仕様はここに追記し、再利用しやすくしてください。

---

## 4-2. 参照した情報源（テストコード実装）

| 参照先 | 利用目的 |
| --- | --- |
| `docs/08_test_specification.md` | テストケース仕様と実装ガイドラインを確認 |
| `.react-router/types/app/routes/+types/*.ts` | `Route.LoaderArgs` と `Route.ActionArgs` の型定義を確認し、モックオブジェクトを作成 |
| `app/routes/_index.tsx`, `app/routes/posts.$postId.tsx`, `app/routes/posts.new.tsx` | 実装されているloader/actionの動作を確認し、テストケースを実装 |

---

## 5. 完了判定チェックリスト

1. ルート構成が意図したページ群に更新されている。  
2. `loader` / `action` が実装され、必要なデータフローが成立している。  
3. `npm run typecheck` などの検証コマンドが成功している。  
4. 手動確認で主要シナリオ（例: 一覧→新規→詳細→削除）が動作する。  
5. `git status -sb` で不要な差分がない。  

> スコープ完了時はチェックし、満たしていない項目があればタスクを追加してください。

---

## 5-2. 完了判定チェックリスト（テストコード実装）

1. テスト仕様書に記載されたすべてのテストケースが実装されている。  
2. 全テストケースが正常にパスしている（全14テストケース）。  
3. TypeScriptの型チェックが通っている（`npm run typecheck`）。  
4. テスト用ヘルパー関数（`clearAllPosts()`）が適切に実装されている。  
5. テストファイルが適切な場所に配置されている（各ルートファイルと同一ディレクトリ）。  

---

## 6. 学び／次への活用

- import 先や型名の勘違いを防ぐには、小まめな `typecheck` が有効。  
- `Response.json` での型指定は `satisfies` を使うと扱いやすく、ジェネリクスの過剰利用を避けられる。  
- 同様のテンプレートをスコープごとに使うことで、実装プロセスの透明性と再現性を高められる。

> 他スコープでも、得られた学びや再利用したい知見をここに追記してください。

---

## 6-2. 学び／次への活用（テストコード実装）

- **loader/action特有のテストコードの書き方**: `Route.LoaderArgs` / `Route.ActionArgs` 型を使ったモックオブジェクトの作成、`Request` オブジェクトの直接作成、`FormData` の扱いなど、通常の関数テストとは異なるアプローチが必要。
- **型アサーションの必要性**: React Router v7の型定義では `unstable_pattern` プロパティが必須だが、テストでは使用しないため、`as unknown as` で型アサーションを使用する必要がある。
- **Responseオブジェクトの検証**: loader/actionでは `Response` オブジェクトをthrowするため、`await expect(...).rejects.toThrow(Response)` を使用し、さらに `catch` ブロックで `error.status` や `error.text()` を検証する必要がある。
- **リダイレクトの検証**: `redirect()` は `Response` オブジェクトを返すため、`response.status` が300-399の範囲であることと `response.headers.get("Location")` を確認する必要がある。
- **統合テストとしてのデータストアの扱い**: データレイヤー（`posts.server.ts`）をモック化せず、実際のインメモリデータを使用して統合テストとして実装することで、より実用的なテストが可能。
- **テストデータの管理**: `beforeEach` で `clearAllPosts()` を呼び出すことで、テスト間の独立性を保証できる。
- loader/actionのテストは、Web標準のAPI（Fetch API）に基づいているため、通常の関数テストとは異なるアプローチが必要になることを理解した。


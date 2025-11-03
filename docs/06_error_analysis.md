# 06. エラー分析レポート

## 1. 発生したエラー一覧

| 発生箇所 | エラー内容 | 原因 |
| --- | --- | --- |
| `app/routes/_index.tsx:1` | `Module '"@react-router/node"' has no exported member 'json'.` | `json` の import 元を誤って `@react-router/node` にしていた |
| `app/routes/posts.$postId.tsx:2` | `Module '"@react-router/node"' has no exported member 'json' / 'redirect'.` | 同上、`json` / `redirect` の import 先が誤っていた |
| `app/routes/posts.new.tsx:2` | `Module '"@react-router/node"' has no exported member 'redirect'.` | 同上、`redirect` の import 先が誤っていた |
| `app/routes/home.tsx:1` | `Cannot find module './+types/home'` | ルート構成変更後も `home.tsx` を残していたため、型生成対象から外れて参照不能になった |
| `app/routes/posts.$postId.tsx:6` | `Namespace '...Route' has no exported member 'Loader'.` | 生成された型に `Loader` は存在せず、`LoaderArgs` などを使うべきだった |
| `app/routes/posts.$postId.tsx:6` | `Binding element 'params' implicitly has an 'any' type.` | 上記の型指定ミスにより引数に型が付与されていなかった |
| `app/routes/posts.$postId.tsx:10` / `posts.new.tsx:6` | `Namespace '...Route' has no exported member 'ActionFunction'.` | 生成された型に `ActionFunction` は存在せず、`ActionArgs` などの型を参照すべきだった |
| `vitest.config.ts:7` | `TypeError: reactRouter is not a function` | Vitest設定ファイルで`reactRouter`プラグインをインポートしていたが、テスト環境では不要で、関数として正しく動作しない |
| `app/routes/_index.test.tsx:26` など | `Property 'unstable_pattern' is missing in type '{ params: {}; request: Request; context: {}; }' but required in type 'CreateServerLoaderArgs<...>'.` | React Router v7の型定義では`unstable_pattern`プロパティが必須だが、テストコードでは設定していなかった |
| `app/routes/_index.test.tsx:26` など | `Types of property 'unstable_pattern' are incompatible. Type 'undefined' is not comparable to type 'string'.` | `unstable_pattern`を`undefined`に設定していたが、型定義では`string`型が要求されていた |

## 2. エラーを見逃した要因

1. **型チェックの遅延**  
   ルートファイルをまとめて作成した後に型チェックを実行せず、`typecheck` でのフィードバックを遅らせたため、誤った import や型指定をそのままにしてしまった。

2. **API 仕様の思い込み**  
   Remix の記憶から `@react-router/node` に `json` / `redirect` があると勘違いし、公式テンプレートで推奨される `react-router` からの import を確認しなかった。

3. **型生成の理解不足**  
   `react-router typegen` の出力を確認せず、存在しない `Route.Loader` や `Route.ActionFunction` を参照するコードを書いてしまった。

4. **不要ファイルの残置**  
   ルート構成を刷新した後でも旧ルート (`home.tsx`) を残したままにし、型定義ファイルとの不整合を招いた。

5. **Vitest設定ファイルの設定ミス**  
   開発用の`vite.config.ts`を参考に`vitest.config.ts`を作成したが、テスト環境ではReact Routerのプラグインは不要であることを認識していなかった。

6. **Route.LoaderArgs/Route.ActionArgs型の理解不足**  
   テストコードでモックオブジェクトを作成する際、React Router v7の型定義で必須とされている`unstable_pattern`プロパティの存在や型要件を把握していなかった。

## 3. 再発防止策

1. **小まめな型チェック実行**  
   ファイル追加やルート変更直後に `npm run typecheck` を必ず実行し、小さい差分のうちにエラーを検出する習慣を付ける。

2. **公式ドキュメントの参照**  
   React Router フレームワークのサンプルやドキュメントで `json` / `redirect` の import 元や型の書き方を事前に確認する。

3. **型生成物の確認**  
   `.react-router/types` ディレクトリを適宜開いて、使用可能な型名 (`LoaderArgs`, `ActionArgs` など) を把握し、コード記述時の齟齬を防ぐ。

4. **不要リソースの整理**  
   ルート構成を変更した際は旧ルートファイルや関連コードを早めに削除・整理し、生成された型との不整合をなくす。

5. **チェックリスト化**  
   ルートを新設する際の確認項目（import 元、型参照、型チェック実行など）を簡易チェックリストとしてまとめ、同じミスを繰り返さないようにする。

6. **テスト環境設定の理解**  
   テスト環境では開発環境とは異なる設定が必要になる場合があることを認識し、Vitest設定ファイルでは必要な設定のみを含めるようにする。

7. **型アサーションの適切な使用**  
   テストコードでモックオブジェクトを作成する際、型定義で必須とされているプロパティを適切に設定し、必要に応じて`as unknown as`を使った型アサーションを使用する。

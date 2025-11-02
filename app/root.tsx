import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const meta: Route.MetaFunction = () => [
  { title: "シンプルブログ" },
  {
    name: "description",
    content: "React Router の loader/action を利用したシンプルなブログアプリ",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-50 text-slate-900">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            シンプルブログ
          </Link>
          <Link
            to="/"
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            記事一覧
          </Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-4 text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Simple Blog.
        </div>
      </footer>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "エラーが発生しました";
  let details = "予期しないエラーが発生しました。";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "ページが見つかりません";
      details = "お探しのページは存在しないか、既に削除された可能性があります。";
    } else {
      details = error.statusText || details;
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="mx-auto mt-12 w-full max-w-3xl rounded-lg border border-red-100 bg-red-50 p-8 text-red-900">
      <h1 className="text-2xl font-semibold">{message}</h1>
      <p className="mt-4 leading-relaxed">{details}</p>
      {stack && (
        <pre className="mt-6 w-full overflow-x-auto rounded bg-white p-4 text-sm text-slate-900">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

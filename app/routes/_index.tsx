import { Link, useLoaderData } from "react-router";

import { getPosts } from "../data/posts.server";
import type { Route } from "./+types/_index";

type LoaderData = {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
  }>;
};

export async function loader({}: Route.LoaderArgs): Promise<LoaderData> {
  const posts = await getPosts();
  return {
    posts: posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    })),
  };
}

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">記事一覧</h1>
        <p className="mt-2 text-sm text-slate-600">
          React Router の loader を利用してインメモリの記事を取得しています。
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">
          まだ投稿がありません。
          <Link to="/posts/new" className="underline">
            最初の投稿を作成しましょう。
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300"
            >
              <Link
                to={`/posts/${post.id}`}
                className="text-lg font-medium text-slate-900 hover:underline"
              >
                {post.title}
              </Link>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(post.createdAt).toLocaleString("ja-JP")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

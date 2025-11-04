import { Form, Link, useLoaderData, useNavigation } from "react-router";
import { redirect } from "react-router";

import { deletePost, getPost } from "../data/posts.server";
import type { Route } from "./+types/posts.$postId";

type LoaderData = {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  };
};

export async function loader({ params }: Route.LoaderArgs): Promise<LoaderData> {
  const postId = params.postId;
  if (!postId) {
    throw new Response("記事IDが指定されていません。", { status: 400 });
  }

  const post = await getPost(postId);
  if (!post) {
    throw new Response("記事が見つかりません。", { status: 404 });
  }

  return {
    post: {
      ...post,
      createdAt: post.createdAt.toISOString(),
    },
  };
}

export async function action({ params, request }: Route.ActionArgs) {
  const postId = params.postId;
  if (!postId) {
    throw new Response("記事IDが指定されていません。", { status: 400 });
  }

  if (request.method !== "POST") {
    throw new Response("許可されていないメソッドです。", { status: 405 });
  }

  await deletePost(postId);
  return redirect("/");
}

export default function PostDetail() {
  const { post } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="text-sm text-slate-500">
          {new Date(post.createdAt).toLocaleString("ja-JP")}
        </p>
      </header>
      <div className="prose max-w-none whitespace-pre-wrap text-slate-800">
        {post.content}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <Link
          to="/"
          className="text-sm font-medium text-slate-600 hover:underline"
        >
          記事一覧へ戻る
        </Link>
        <Form method="post">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isSubmitting ? "削除中..." : "この記事を削除する"}
          </button>
        </Form>
      </div>
    </article>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (error instanceof Response) {
    return (
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold">記事を表示できません</h1>
        <p className="text-slate-600">{error.statusText || error.status}</p>
        <Link to="/" className="text-sm text-slate-600 hover:underline">
          記事一覧へ戻る
        </Link>
      </section>
    );
  }

  throw error;
}

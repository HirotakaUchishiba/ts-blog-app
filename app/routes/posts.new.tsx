import { Form, Link, useActionData, useNavigation } from "react-router";
import { redirect } from "react-router";

import { createPost } from "../data/posts.server";
import type { Route } from "./+types/posts.new";

type ActionData = {
  errors?: {
    title?: string;
    content?: string;
  };
  fields?: {
    title: string;
    content: string;
  };
};

const getString = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = getString(formData.get("title"));
  const content = getString(formData.get("content"));

  const errors: NonNullable<ActionData["errors"]> = {};
  if (!title) errors.title = "タイトルを入力してください。";
  if (!content) errors.content = "本文を入力してください。";

  if (Object.keys(errors).length > 0) {
    return Response.json(
      {
        errors,
        fields: { title, content },
      } satisfies ActionData,
      { status: 400 },
    );
  }

  await createPost({ title, content });
  return redirect("/");
}

export default function NewPost() {
  const result = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const field = (name: "title" | "content") => result?.fields?.[name] ?? "";
  const error = (name: "title" | "content") => result?.errors?.[name];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">新規投稿</h1>
        <p className="mt-1 text-sm text-slate-600">
          フォームを送信すると loader/action を通じて記事が保存されます。
        </p>
      </header>

      <Form method="post" className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="title">
            タイトル
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={field("title")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            aria-invalid={error("title") ? true : undefined}
            aria-describedby={error("title") ? "title-error" : undefined}
          />
          {error("title") && (
            <p id="title-error" className="mt-1 text-sm text-red-600">
              {error("title")}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="content">
            本文
          </label>
          <textarea
            id="content"
            name="content"
            required
            defaultValue={field("content")}
            className="mt-1 h-48 w-full rounded-md border border-slate-300 px-3 py-2"
            aria-invalid={error("content") ? true : undefined}
            aria-describedby={error("content") ? "content-error" : undefined}
          />
          {error("content") && (
            <p id="content-error" className="mt-1 text-sm text-red-600">
              {error("content")}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "投稿中..." : "投稿する"}
          </button>
          <Link to="/" className="text-sm text-slate-600 hover:underline">
            キャンセル
          </Link>
        </div>
      </Form>
    </div>
  );
}

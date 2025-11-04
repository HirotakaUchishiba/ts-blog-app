import { describe, it, expect, beforeEach } from "vitest";
import { loader, action } from "./posts.$postId";
import { createPost, clearAllPosts, getPost } from "../data/posts.server";
import { redirect } from "react-router";
import type { Route } from "./+types/posts.$postId";

describe("posts.$postId loader", () => {
  beforeEach(async () => {
    // テストデータをクリア
    await clearAllPosts();
  });

  it("正常系 - 記事が存在する場合", async () => {
    // テストデータをセットアップ
    const post = await createPost({
      title: "テスト記事",
      content: "テスト本文",
    });

    // loaderを実行
    const loaderArgs = {
      params: { postId: post.id },
      request: new Request("http://localhost/"),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.LoaderArgs;

    const result = await loader(loaderArgs);

    // 検証
    expect(result).toHaveProperty("post");
    expect(result.post.id).toBe(post.id);
    expect(result.post.title).toBe("テスト記事");
    expect(result.post.content).toBe("テスト本文");
    expect(typeof result.post.createdAt).toBe("string");
    expect(() => new Date(result.post.createdAt)).not.toThrow();
    expect(new Date(result.post.createdAt).toISOString()).toBe(
      result.post.createdAt,
    );
  });

  it("異常系 - 記事IDが未指定の場合", async () => {
    // loaderを実行（postIdがundefined）
    const loaderArgs = {
      params: {},
      request: new Request("http://localhost/"),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.LoaderArgs;

    // エラーがthrowされることを期待
    await expect(loader(loaderArgs)).rejects.toThrow(Response);

    try {
      await loader(loaderArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      if (error instanceof Response) {
        expect(error.status).toBe(400);
        const text = await error.text();
        expect(text).toContain("記事IDが指定されていません。");
      }
    }
  });

  it("異常系 - 記事が存在しない場合", async () => {
    // 存在しないIDでloaderを実行
    const loaderArgs = {
      params: { postId: "non-existent-id" },
      request: new Request("http://localhost/"),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.LoaderArgs;

    // エラーがthrowされることを期待
    await expect(loader(loaderArgs)).rejects.toThrow(Response);

    try {
      await loader(loaderArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      if (error instanceof Response) {
        expect(error.status).toBe(404);
        const text = await error.text();
        expect(text).toContain("記事が見つかりません。");
      }
    }
  });
});

describe("posts.$postId action", () => {
  beforeEach(async () => {
    // テストデータをクリア
    await clearAllPosts();
  });

  it("正常系 - 記事の削除が成功する場合", async () => {
    // テストデータをセットアップ
    const post = await createPost({
      title: "削除対象の記事",
      content: "削除される本文",
    });

    // actionを実行
    const actionArgs = {
      params: { postId: post.id },
      request: new Request("http://localhost/", { method: "POST" }),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.ActionArgs;

    const result = await action(actionArgs);

    // リダイレクトレスポンスを検証
    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.status).toBeLessThan(400);
    expect(response.headers.get("Location")).toBe("/");

    // データストアから該当記事が削除されていることを確認
    const deletedPost = await getPost(post.id);
    expect(deletedPost).toBeUndefined();
  });

  it("異常系 - 記事IDが未指定の場合", async () => {
    // actionを実行（postIdがundefined）
    const actionArgs = {
      params: {},
      request: new Request("http://localhost/", { method: "POST" }),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.ActionArgs;

    // エラーがthrowされることを期待
    await expect(action(actionArgs)).rejects.toThrow(Response);

    try {
      await action(actionArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      if (error instanceof Response) {
        expect(error.status).toBe(400);
        const text = await error.text();
        expect(text).toContain("記事IDが指定されていません。");
      }
    }
  });

  it("異常系 - 許可されていないHTTPメソッドの場合", async () => {
    // テストデータをセットアップ
    const post = await createPost({
      title: "テスト記事",
      content: "テスト本文",
    });

    // GETメソッドでactionを実行
    const actionArgs = {
      params: { postId: post.id },
      request: new Request("http://localhost/", { method: "GET" }),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.ActionArgs;

    // エラーがthrowされることを期待
    await expect(action(actionArgs)).rejects.toThrow(Response);

    try {
      await action(actionArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      if (error instanceof Response) {
        expect(error.status).toBe(405);
        const text = await error.text();
        expect(text).toContain("許可されていないメソッドです。");
      }
    }
  });
});


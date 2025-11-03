import { describe, it, expect, beforeEach } from "vitest";
import { action } from "./posts.new";
import { clearAllPosts, getPosts } from "../data/posts.server";
import type { Route } from "./+types/posts.new";

describe("posts.new action", () => {
  beforeEach(async () => {
    // テストデータをクリア
    await clearAllPosts();
  });

  it("正常系 - 記事の作成が成功する場合", async () => {
    // FormDataを作成
    const formData = new FormData();
    formData.append("title", "新規記事");
    formData.append("content", "新規記事の本文");

    // actionを実行
    const actionArgs = {
      params: {},
      request: new Request("http://localhost/", {
        method: "POST",
        body: formData,
      }),
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

    // データストアに新しい記事が追加されていることを確認
    const posts = await getPosts();
    expect(posts.length).toBe(1);
    expect(posts[0].title).toBe("新規記事");
    expect(posts[0].content).toBe("新規記事の本文");
  });

  it("異常系 - タイトルが未入力の場合", async () => {
    // FormDataを作成（titleが空）
    const formData = new FormData();
    formData.append("title", "");
    formData.append("content", "本文のみ");

    // actionを実行
    const actionArgs = {
      params: {},
      request: new Request("http://localhost/", {
        method: "POST",
        body: formData,
      }),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.ActionArgs;

    const result = await action(actionArgs);

    // エラーレスポンスを検証
    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty("errors");
    expect(json.errors).toHaveProperty("title");
    expect(json.errors.title).toBe("タイトルを入力してください。");
    expect(json).toHaveProperty("fields");
    expect(json.fields.title).toBe("");
    expect(json.fields.content).toBe("本文のみ");

    // データストアに記事が追加されていないことを確認
    const posts = await getPosts();
    expect(posts.length).toBe(0);
  });

  it("異常系 - 本文が未入力の場合", async () => {
    // FormDataを作成（contentが空）
    const formData = new FormData();
    formData.append("title", "タイトルのみ");
    formData.append("content", "");

    // actionを実行
    const actionArgs = {
      params: {},
      request: new Request("http://localhost/", {
        method: "POST",
        body: formData,
      }),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.ActionArgs;

    const result = await action(actionArgs);

    // エラーレスポンスを検証
    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty("errors");
    expect(json.errors).toHaveProperty("content");
    expect(json.errors.content).toBe("本文を入力してください。");
    expect(json).toHaveProperty("fields");
    expect(json.fields.title).toBe("タイトルのみ");
    expect(json.fields.content).toBe("");

    // データストアに記事が追加されていないことを確認
    const posts = await getPosts();
    expect(posts.length).toBe(0);
  });

  it("異常系 - タイトルと本文の両方が未入力の場合", async () => {
    // FormDataを作成（両方とも空）
    const formData = new FormData();
    formData.append("title", "");
    formData.append("content", "");

    // actionを実行
    const actionArgs = {
      params: {},
      request: new Request("http://localhost/", {
        method: "POST",
        body: formData,
      }),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.ActionArgs;

    const result = await action(actionArgs);

    // エラーレスポンスを検証
    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty("errors");
    expect(json.errors).toHaveProperty("title");
    expect(json.errors).toHaveProperty("content");
    expect(json.errors.title).toBe("タイトルを入力してください。");
    expect(json.errors.content).toBe("本文を入力してください。");
    expect(json).toHaveProperty("fields");
    expect(json.fields.title).toBe("");
    expect(json.fields.content).toBe("");

    // データストアに記事が追加されていないことを確認
    const posts = await getPosts();
    expect(posts.length).toBe(0);
  });

  it("正常系 - タイトルと本文の前後の空白がトリムされる場合", async () => {
    // FormDataを作成（前後に空白を含む）
    const formData = new FormData();
    formData.append("title", "  トリムされるタイトル  ");
    formData.append("content", "  トリムされる本文  ");

    // actionを実行
    const actionArgs = {
      params: {},
      request: new Request("http://localhost/", {
        method: "POST",
        body: formData,
      }),
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

    // データストアに追加された記事の前後の空白がトリムされていることを確認
    const posts = await getPosts();
    expect(posts.length).toBe(1);
    expect(posts[0].title).toBe("トリムされるタイトル");
    expect(posts[0].content).toBe("トリムされる本文");
  });

  it("異常系 - タイトルが空白のみの場合", async () => {
    // FormDataを作成（タイトルが空白のみ）
    const formData = new FormData();
    formData.append("title", "   ");
    formData.append("content", "有効な本文");

    // actionを実行
    const actionArgs = {
      params: {},
      request: new Request("http://localhost/", {
        method: "POST",
        body: formData,
      }),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.ActionArgs;

    const result = await action(actionArgs);

    // エラーレスポンスを検証
    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty("errors");
    expect(json.errors).toHaveProperty("title");
    expect(json.errors.title).toBe("タイトルを入力してください。");

    // データストアに記事が追加されていないことを確認
    const posts = await getPosts();
    expect(posts.length).toBe(0);
  });
});


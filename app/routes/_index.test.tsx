import { describe, it, expect, beforeEach } from "vitest";
import { loader } from "./_index";
import { createPost, clearAllPosts } from "../data/posts.server";
import type { Route } from "./+types/_index";

describe("_index loader", () => {
  beforeEach(async () => {
    // テストデータをクリア
    await clearAllPosts();
  });

  it("正常系 - 記事が存在する場合", async () => {
    // テストデータをセットアップ
    const post1 = await createPost({
      title: "テスト記事1",
      content: "テスト本文1",
    });
    // 少し待機して作成日時をずらす
    await new Promise((resolve) => setTimeout(resolve, 10));
    const post2 = await createPost({
      title: "テスト記事2",
      content: "テスト本文2",
    });

    // loaderを実行
    const loaderArgs = {
      params: {},
      request: new Request("http://localhost/"),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.LoaderArgs;

    const result = await loader(loaderArgs);

    // 検証
    expect(result).toHaveProperty("posts");
    expect(Array.isArray(result.posts)).toBe(true);
    expect(result.posts.length).toBe(2);

    // 作成日時降順でソートされているか確認（post2が先に来るはず）
    const firstPost = result.posts[0];
    const secondPost = result.posts[1];
    expect(firstPost.id).toBe(post2.id);
    expect(secondPost.id).toBe(post1.id);
    expect(new Date(firstPost.createdAt).getTime()).toBeGreaterThanOrEqual(
      new Date(secondPost.createdAt).getTime(),
    );

    // 各記事のcreatedAtがISO 8601形式の文字列であることを確認
    result.posts.forEach((post) => {
      expect(typeof post.createdAt).toBe("string");
      expect(() => new Date(post.createdAt)).not.toThrow();
      expect(new Date(post.createdAt).toISOString()).toBe(post.createdAt);
    });
  });

  it("正常系 - 記事が存在しない場合", async () => {
    // loaderを実行（beforeEachで既にクリアされている）
    const loaderArgs = {
      params: {},
      request: new Request("http://localhost/"),
      context: {},
      unstable_pattern: "",
    } as unknown as Route.LoaderArgs;

    const result = await loader(loaderArgs);

    // 検証
    expect(result).toHaveProperty("posts");
    expect(Array.isArray(result.posts)).toBe(true);
    expect(result.posts.length).toBe(0);
  });
});


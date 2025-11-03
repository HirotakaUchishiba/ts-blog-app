import { randomUUID } from "node:crypto";

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

let posts: Post[] = [];

const clonePost = (post: Post): Post => ({
  ...post,
  createdAt: new Date(post.createdAt),
});

export async function getPosts(): Promise<Post[]> {
  return posts
    .slice()
    .sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )
    .map(clonePost);
}

export async function getPost(id: string): Promise<Post | undefined> {
  const post = posts.find((item) => item.id === id);
  return post ? clonePost(post) : undefined;
}

export async function createPost(input: {
  title: string;
  content: string;
}): Promise<Post> {
  const now = new Date();
  const newPost: Post = {
    id: randomUUID(),
    title: input.title,
    content: input.content,
    createdAt: now,
  };
  posts = [newPost, ...posts];
  return clonePost(newPost);
}

export async function deletePost(id: string): Promise<void> {
  posts = posts.filter((post) => post.id !== id);
}

// テスト用: すべての記事を削除する
export async function clearAllPosts(): Promise<void> {
  posts = [];
}

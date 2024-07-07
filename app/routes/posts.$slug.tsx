import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant"

export const loader = async({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.slug, "No slug provided")

  const post = await getPost(params.slug)
  invariant(post, `Post not found: ${params.slug}`)

  return json({ post: await post })
};

export default function PostSlug() {
  const { post } = useLoaderData<typeof loader>();
  return  (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        Some Post: {post.title}
      </h1>
    </main>
  );
}

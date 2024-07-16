import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deletePost } from "~/models/post.server";

export const action = async ({ params }: ActionFunctionArgs) => {
  const targetPostSlug = params.slug;
  invariant(typeof targetPostSlug === "string", "slug must be a string");

  await deletePost(targetPostSlug);
  return redirect("/posts/admin");
};

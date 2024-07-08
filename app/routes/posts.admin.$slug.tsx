import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getPost, updatePost } from "~/models/post.server";
import invariant from "tiny-invariant";

export const loader = async({
  params
}: LoaderFunctionArgs) => {
  invariant(params.slug, "No slug provided");

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json({ post });
}

export const action = async ({
  request, params
}: ActionFunctionArgs) => {
  const targetPostSlug = params.slug;
  invariant(
    typeof targetPostSlug === "string",
    "slug must be a string"
  );

  const formData = await request.formData();

  const title = formData.get("title");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "title is required",
    markdown: markdown ? null : "markdown is required",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors) {
    return json(errors);
  }

  invariant(
    typeof title === "string",
    "title must be a string"
  );
  invariant(
    typeof markdown === "string",
    "title must be a string"
  );

  // TODO: remove me
  await new Promise((res) => setTimeout(res, 5000));
  await updatePost(targetPostSlug, { title, markdown})

  return redirect("/posts/admin");
}

const inputClassName = "w-full rounded border border-gray-500 px-2 py-1 text-lg"

export default function PostAdminSlug() {
  const errors = useActionData<typeof action>();
  const navigation = useNavigation();
  const isUpdating = Boolean(
    navigation.state === 'submitting'
  )

  const { post } = useLoaderData<typeof loader>();

  return (
    <Form method="patch">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            defaultValue={post.title}
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:
          {errors?.markdown ? (
            <em className="text-red-600">
              {errors.markdown}
            </em>
          ) : null }
        </label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          defaultValue={post.markdown}
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Post"}
        </button>
      </p>
    </Form>
  );
}

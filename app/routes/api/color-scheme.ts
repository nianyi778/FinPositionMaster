import { parseWithZod } from "@conform-to/zod";
import { data } from "react-router";
import { ColorSchemeSchema } from "~/lib/color-scheme/components";
import { serializeColorScheme } from "~/lib/color-scheme/server";
import type { Route } from "./+types/color-scheme";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.clone().formData();
  const submission = parseWithZod(formData, { schema: ColorSchemeSchema });

  if (submission.status !== "success") {
    throw data("Invalid color scheme", { status: 400 });
  }

  const { colorScheme } = submission.value;
  return data(
    { colorScheme },
    {
      headers: {
        "Set-Cookie": await serializeColorScheme(colorScheme),
      },
    },
  );
}

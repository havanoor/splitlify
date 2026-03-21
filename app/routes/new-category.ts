import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { postData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;

  if (!user) {
    throw redirect("/login");
  }
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const headers = new Headers();

  if (typeof data.type_of_category === "string") {
    data.type_of_category = data.type_of_category.toUpperCase();
  }

  const response = await postData(
    "category/add",
    { ...data, user_id: user.user_id },
    user.token,
    refreshToken,
    headers,
    user
  );

  return json(
    {
      ok: "Suceess",
    },
    { headers }
  );
}

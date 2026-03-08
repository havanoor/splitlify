import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/react";
import { getData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;
  const headers = new Headers();

  if (!user) {
    throw redirect("/login");
  }

  const data = await getData(
    `category/get_user_categories?user_id=${user.user_id}`,
    user.token,
    refreshToken,
    headers,
    user
  );
  return json(data, { headers });
}

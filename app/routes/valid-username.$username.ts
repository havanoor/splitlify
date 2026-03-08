import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/react";
import { getDataWithParams } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;

  if (!user) {
    throw redirect("/login");
  }
  const headers = new Headers();
  const data = await getDataWithParams(
    "auth/validUsername",
    {
      username: params.username,
    },
    user?.token,
    refreshToken,
    headers,
    user
  );
  return json(data, { headers });
}

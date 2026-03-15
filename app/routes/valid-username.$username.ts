import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { getDataWithParams } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function loader({ params, request }: LoaderFunctionArgs) {
  // This endpoint is intentionally public — it is used on both the
  // Register page (unauthenticated) and the Add Book dialog (authenticated).
  // Do NOT add an auth guard here; that would redirect unauthenticated
  // users away from the register form every time they type a username.
  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;
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

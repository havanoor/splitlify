import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { getData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { user, refreshToken } = await getSession(request);
  const headers = new Headers();
  const data = await getData(
    `payments/${params.bookId}`,
    user?.token,
    refreshToken,
    headers,
    user
  );
  return json(data, { headers });
}

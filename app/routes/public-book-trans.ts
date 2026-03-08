import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const bookId = url.searchParams.get("book_id");

  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;
  const headers = new Headers();

  if (!user) {
    throw redirect("/login");
  }
  const data = await getData(
    `book/?book_id=${bookId}`,
    user?.token,
    refreshToken,
    headers,
    user
  );

  return json(data[0], { headers });
}

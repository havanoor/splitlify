import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const bookId = url.searchParams.get("book_id");

  //   const transactions = await getData(
  //     `book/get_book_transactions/${bookId}/?offset=${offset}&limit=5`
  //   );

  const data = await getData(`book/?book_id=${bookId}`);

  return json(data[0]);
}

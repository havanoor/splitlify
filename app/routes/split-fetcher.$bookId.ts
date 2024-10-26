import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import getData from "~/lib/ApiRequests";

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await getData(`payments/${params.bookId}`);
  return json(data);
}

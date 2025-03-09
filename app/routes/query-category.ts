import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { getData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getSession(request);

  const data = await getData(
    `category/get_user_categories?user_id=${user.user_id}`
  );
  return json(data);
}

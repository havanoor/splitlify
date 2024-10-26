import { json } from "@remix-run/react";
import getData from "~/lib/ApiRequests";

export async function loader() {
  const data = await getData(`category/get_user_categories?user_id=8`);
  return json(data);
}

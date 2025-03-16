import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { getDataWithParams } from "~/lib/ApiRequests";

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await getDataWithParams("auth/validUsername", {
    username: params.username,
  });
  return json(data);
}

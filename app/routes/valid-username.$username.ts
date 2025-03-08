import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { getData, getDataWithParams } from "~/lib/ApiRequests";

export async function loader({ params }: LoaderFunctionArgs) {
  console.log("params==============================", params);
  const data = await getDataWithParams("auth/validUsername", {
    username: params.username,
  });
  return json(data);
}

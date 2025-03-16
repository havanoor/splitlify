import { ActionFunctionArgs, json } from "@remix-run/node";
import { postData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function action({ request }: ActionFunctionArgs) {
  const user = await getSession(request);
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await postData("category/add", { ...data, user_id: user.user_id });
  return json({
    ok: "Suceess",
  });
}

import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { UsernameForm } from "components/UsernameForm";
import { User } from "lucide-react";
import { getValidatedFormData } from "remix-hook-form";
import { z } from "zod";
import { getSession } from "~/lib/helperFunctions";
import { UsernameSchema } from "~/schemas";
import { cookie, update_username } from "./login/login";

const resolver = zodResolver(UsernameSchema);

export async function action({ request }: ActionFunctionArgs) {
  let session = await getSession(request);
  const formData = await request.formData();
  const { receivedValues, errors, data } = await getValidatedFormData<
    z.infer<typeof UsernameSchema>
  >(formData, resolver);

  if (errors) {
    return json({ errors, receivedValues });
  }

  const { username } = data;

  const respone = await update_username(username, session.user_id);

  return redirect("/books", {
    headers: {
      "Set-Cookie": await cookie.serialize({
        username: username,
        token: session.token,
        user_id: session.user_id,
      }),
    },
  });
}

export default function Login() {
  return <UsernameForm />;
}

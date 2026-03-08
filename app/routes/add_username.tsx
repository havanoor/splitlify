import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { UsernameForm } from "components/UsernameForm";
import { getValidatedFormData } from "remix-hook-form";
import { z } from "zod";
import { getSession } from "~/lib/helperFunctions";
import { UsernameSchema } from "~/schemas";
import { update_username } from "./login/login";
import { cookie } from "~/lib/cookies";

const resolver = zodResolver(UsernameSchema);

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;

  if (!user) {
    // If there's no user in the session, redirect to login or handle as unauthorized
    // For now, let's assume we redirect to login if the user is not found
    return redirect("/login");
  }

  const formData = await request.formData();
  const { receivedValues, errors, data } = await getValidatedFormData<
    z.infer<typeof UsernameSchema>
  >(formData, resolver);

  if (errors) {
    return json({ errors, receivedValues });
  }

  const { username } = data;
  const headers = new Headers();

  const respone = await update_username(
    username,
    user.user_id,
    user.token,
    refreshToken,
    headers,
    user
  );

  headers.append(
    "Set-Cookie",
    await cookie.serialize({
      ...user,
      username: username,
    })
  );

  return redirect("/books", {
    headers: headers,
  });
}

export default function Login() {
  return <UsernameForm />;
}

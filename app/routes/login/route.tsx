import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { LoginForm } from "components/LoginForm";
import { cookie, login } from "./login";
import { generateAuthUrl } from "~/lib/googleLogin";
import { useLoaderData } from "@remix-run/react";
import { LoginSchema } from "~/schemas";
import { getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export async function loader({ request }: LoaderFunctionArgs) {
  // Put "register" in the state so we know where the user is
  // coming from when they are sent back to us from Google.
  return json({ googleAuthUrl: generateAuthUrl("sign-in") });
}

const resolver = zodResolver(LoginSchema);

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { receivedValues, errors, data } = await getValidatedFormData<
    z.infer<typeof LoginSchema>
  >(formData, resolver);

  if (errors) {
    return json({ errors, receivedValues });
  }

  const { username, password } = data;
  const userData = await login({ username: username, password: password });

  return redirect("/books", {
    headers: {
      "Set-Cookie": await cookie.serialize({
        username: userData.user.username,
        token: userData.access_token,
        user_id: userData.user.id,
      }),
    },
  });
}

export default function Login() {
  const { googleAuthUrl } = useLoaderData<typeof loader>();

  return <LoginForm url={googleAuthUrl} />;
}

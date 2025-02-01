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

export async function loader({ request }: LoaderFunctionArgs) {
  // Put "register" in the state so we know where the user is
  // coming from when they are sent back to us from Google.
  return json({ googleAuthUrl: generateAuthUrl("sign-in") });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const data = await login({ username: username, password: password });

  return redirect("/books", {
    headers: {
      "Set-Cookie": await cookie.serialize({
        username: data.user.username,
        token: data.access_token,
        user_id: data.user.id,
      }),
    },
  });
}

export default function Login() {
  const { googleAuthUrl } = useLoaderData<typeof loader>();

  return <LoginForm url={googleAuthUrl} />;
}

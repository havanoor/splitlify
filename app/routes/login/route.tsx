import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { LoginForm } from "components/LoginForm";
import { cookie, login } from "./login";

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
  return <LoginForm />;
}

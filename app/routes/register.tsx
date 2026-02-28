import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { RegisterForm } from "components/RegisterForm";
import { getValidatedFormData } from "remix-hook-form";
import { z } from "zod";
import { generateAuthUrl } from "~/lib/googleLogin";
import { SignUpSchema } from "~/schemas";
import { register } from "./login/login";
import { cookie } from "~/lib/cookies";

export async function loader({ request }: LoaderFunctionArgs) {
  // Put "register" in the state so we know where the user is
  // coming from when they are sent back to us from Google.
  return json({ googleAuthUrl: generateAuthUrl("sign-in") });
}

const resolver = zodResolver(SignUpSchema);

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { receivedValues, errors, data } = await getValidatedFormData<
    z.infer<typeof SignUpSchema>
  >(formData, resolver);

  if (errors) {
    return json({ errors, receivedValues });
  }
  const { userName, password, confirmPassword, firstName, lastName, email } =
    data;

  const userData = {
    userName,
    password,
    confirmPassword,
    firstName,
    lastName,
    email,
  };

  const registerData = await register(userData);

  return redirect("/books", {
    headers: {
      "Set-Cookie": await cookie.serialize({
        username: registerData.user.username,
        token: registerData.access_token,
        user_id: registerData.user.id,
      }),
    },
  });
}

export default function Register() {
  const { googleAuthUrl } = useLoaderData<typeof loader>();

  return <RegisterForm url={googleAuthUrl} />;
}

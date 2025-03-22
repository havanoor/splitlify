import {
  createSession,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { postData } from "~/lib/ApiRequests";
import { getTokenFromCode } from "~/lib/googleLogin";
import { cookie } from "./login/login";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!state || !code) {
    // Throw an error or redirect back to the register page
    return redirect("/sign-in");
  }

  const idToken = await getTokenFromCode(code);

  //   Replace with your database code
  const user = await postData(`auth/google`, {
    id_token: String(idToken.idToken),
  });

  if (user.user) {
    if (user.user.username != null) {
      return redirect("/books", {
        headers: {
          "Set-Cookie": await cookie.serialize({
            username: user.user.username,
            token: user.access_token,
            user_id: user.user.id,
          }),
        },
      });
    } else {
      return redirect("/add_username", {
        headers: {
          "Set-Cookie": await cookie.serialize({
            token: user.access_token,
            user_id: user.user.id,
          }),
        },
      });
    }
  } else if (user.Error) {
    return redirect("/login?error=existing_credentials");
  }
}

import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { postData } from "~/lib/ApiRequests";
import { getTokenFromCode } from "~/lib/googleLogin";
import { cookie, refreshCookie } from "~/lib/cookies";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!state || !code) {
    // Throw an error or redirect back to the register page
    return redirect("/sign-in");
  }

  const idToken = await getTokenFromCode(code);

  const user = await postData(`auth/google`, {
    id_token: String(idToken.idToken),
  });

  if (user.user) {
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      await cookie.serialize({
        username: user.user.username,
        token: user.access_token,
        user_id: user.user.id,
      })
    );
    headers.append(
      "Set-Cookie",
      await refreshCookie.serialize(user.refresh_token)
    );

    if (user.user.username != null) {
      return redirect("/books", {
        headers: headers,
      });
    } else {
      return redirect("/add_username", {
        headers: headers,
      });
    }
  } else if (user.Error) {
    return redirect("/login?error=existing_credentials");
  }
}

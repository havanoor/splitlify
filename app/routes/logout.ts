import { redirect } from "@remix-run/react";
import { cookie } from "./login/login";

export async function action() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await cookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
}

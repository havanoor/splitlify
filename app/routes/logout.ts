import { redirect } from "@remix-run/node";
import { cookie, refreshCookie } from "~/lib/cookies";

export async function action() {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    await cookie.serialize("", { maxAge: 0 })
  );
  headers.append(
    "Set-Cookie",
    await refreshCookie.serialize("", { maxAge: 0 })
  );

  return redirect("/login", {
    headers,
  });
}

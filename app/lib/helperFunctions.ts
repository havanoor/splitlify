import { cookie, refreshCookie } from "~/lib/cookies";

export async function getSession(request: Request) {
  let cookieString = request.headers.get("Cookie");
  let user = await cookie.parse(cookieString);
  let refreshToken = await refreshCookie.parse(cookieString);

  // Robustly validate the shape of the user cookie 
  if (!user || !user.token || !user.user_id) {
    return null;
  }

  return { user, refreshToken };
}

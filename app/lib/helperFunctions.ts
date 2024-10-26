import { cookie } from "~/routes/login/login";

export async function getSession(request: Request) {
  let cookieString = request.headers.get("Cookie");
  let user_id = await cookie.parse(cookieString);

  return user_id;
}

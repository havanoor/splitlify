import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await getSession(request);
  // console.log(user);
  if (!user) {
    return json({ user_id: null, username: null });
  }
  return json(user);
}

import "./tailwind.css";
import NavBar from "../components/Navbar";
import { getSession } from "./lib/helperFunctions";

export function Layout({ children }: { children: React.ReactNode }) {
  const { username } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NavBar username={username} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

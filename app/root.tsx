import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  let user_id = await getSession(request);

  return { user_id };
}

import "./tailwind.css";
import NavBar from "../components/Navbar";
import { cookie } from "./routes/login/login";
import { getSession } from "./lib/helperFunctions";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user_id } = useLoaderData<typeof loader>();
  console.log(user_id);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NavBar username={user_id.username} />
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

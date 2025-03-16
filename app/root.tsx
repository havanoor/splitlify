import {
  isRouteErrorResponse,
  json,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunction,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import NavBar from "../components/Navbar";
import { getSession } from "./lib/helperFunctions";
import { ArrowLeft, Home } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await getSession(request);
  if (!user) {
    return json({ user_id: null, username: null });
  }
  return json(user);
}

export const shouldRevalidate: ShouldRevalidateFunction = (args) => {
  console.log({ args });

  if (
    args.formAction &&
    ["/login", "/signup", "logout"].includes(args.formAction)
  ) {
    return true;
  }

  if (args.currentParams.bookId === args.nextParams.bookId) {
    return false;
  }

  return args.defaultShouldRevalidate;
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { username } = useLoaderData<typeof loader>() || { username: "Guest" };
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
        <Toaster richColors />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen  px-4">
          <div className="text-center max-w-md">
            <h1 className="text-9xl font-bold text-gray-900 animate-pulse">
              404
            </h1>

            <h2 className="mt-8 text-2xl font-semibold text-gray-800">
              Page not found
            </h2>
            <p className="mt-4 text-gray-600">
              Oops! The page you're looking for seems to have wandered off into
              the digital wilderness.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Home size={18} />
                <span>Go Home</span>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={18} />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

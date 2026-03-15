import { createCookie } from "@remix-run/node";

if (!process.env.COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET environment variable is required but not set.");
}

const cookieSecrets = [process.env.COOKIE_SECRET];

export let cookie = createCookie("__session", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: cookieSecrets,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
});

export let refreshCookie = createCookie("__refresh_token", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: cookieSecrets,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
});

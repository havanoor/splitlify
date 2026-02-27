import { createCookie } from "@remix-run/node";

export let cookie = createCookie("__session", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["abcd1234"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
});

export let refreshCookie = createCookie("__refresh_token", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["abcd1234"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
});

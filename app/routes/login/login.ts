import { createCookie, redirect } from "@remix-run/node";
import { z } from "zod";
import { LoginSchema } from "~/schemas";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }
  const { username, password } = validatedFields.data;

  return await loginUsingCredentials(username, password);
};

const loginUsingCredentials = async (username: string, password: string) => {
  try {
    const response = await signIn("credentials", username, password);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return { error: "Invalid Credentials Provided" };
    }

    throw error;
  }

  return;
};

const signIn = async (method: string, username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${process.env.BACKEND_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  }).then((data) => {
    if (data.ok) {
      return data.json();
    } else {
      throw new Error("Invalid Credentials");
    }
  });

  if (response) {
    return response;
  }

  return null;
};

export let cookie = createCookie("__session", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secrets: ["abcd1234"],
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
});

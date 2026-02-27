import { createCookie } from "@remix-run/node";
import { z } from "zod";
import { postData } from "~/lib/ApiRequests";
import { LoginSchema, SignUpSchema } from "~/schemas";
import { cookie, refreshCookie } from "~/lib/cookies";

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

// Cookies moved to ~/lib/cookies

export const register = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { firstName, lastName, email, password, userName } =
    validatedFields.data;

  const data = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    auth_method: "Credentials",
    hashed_password: password,
    username: userName,
    is_registered: "true",
  };
  const response = await fetch(
    `${process.env.BACKEND_URL}/auth/users/new_user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  ).then((data) => data.json());

  return await loginUsingCredentials(userName, password);
};

export const update_username = async (
  username: string,
  user_id: number | string,
  token?: string,
  refreshToken?: string,
  headers?: Headers,
  user?: any
) => {
  const data = {
    username: username,
    id: user_id,
  };

  const response = await postData(
    "auth/users/update_username/",
    data,
    token,
    refreshToken,
    headers,
    user
  );

  return response.data;
};

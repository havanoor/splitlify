import { cookie, refreshCookie } from "./cookies";

const refreshPromiseMap = new Map<string, Promise<any>>();

export const refreshAccessToken = async (refreshToken: string) => {
  if (refreshPromiseMap.has(refreshToken)) {
    return refreshPromiseMap.get(refreshToken);
  }

  const promise = (async () => {
    try {

      const response = await fetch(`${process.env.BACKEND_URL}/auth/refreshToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "refresh_token": refreshToken }),
      });

      if (!response.ok) {
        throw new Error("REFRESH_FAILED");
      }

      const data = await response.json();
      return data;
    } finally {
      refreshPromiseMap.delete(refreshToken);
    }
  })();

  refreshPromiseMap.set(refreshToken, promise);
  return promise;
};

async function callApi(
  method: string,
  url: string,
  data?: any,
  token?: string,
  refreshToken?: string,
  headers?: Headers,
  user?: any // The session user object { username, user_id, ... }
): Promise<any> {
  const fetchOptions: any = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    fetchOptions.headers["Authorization"] = `Bearer ${token}`;
  }

  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  const response = await fetch(process.env.BACKEND_URL + "/" + url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log("Error data:", errorData);
    const isTokenExpired = (JSON.stringify(errorData?.error) || "").toLowerCase().includes("token expired");

    console.log("Token expired:", isTokenExpired);


    if (response.status === 401 && isTokenExpired && refreshToken && headers && user) {
      try {
        const newData = await refreshAccessToken(refreshToken);
        if (newData && newData.access_token) {
          // Update the headers with new cookies
          headers.append(
            "Set-Cookie",
            await cookie.serialize({
              ...user,
              token: newData.access_token,
            })
          );
          if (newData.refresh_token) {
            headers.append(
              "Set-Cookie",
              await refreshCookie.serialize(newData.refresh_token)
            );
          }

          // Retry the request with the new token
          return callApi(method, url, data, newData.access_token, newData.refresh_token || refreshToken, headers, user);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Fall through to throw the original error or a generic one
      }
    }

    console.log(`${method} error data:`, { status: response.status, errorData });
    throw { status: response.status, ...errorData };
  }

  return await response.json();
}

export const getData = async (
  url: string,
  token?: string,
  refreshToken?: string,
  headers?: Headers,
  user?: any
) => {
  return callApi("GET", url, undefined, token, refreshToken, headers, user);
};

export const getDataWithParams = async (
  url: string,
  params: any,
  token?: string,
  refreshToken?: string,
  headers?: Headers,
  user?: any
) => {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return callApi("GET", fullUrl, undefined, token, refreshToken, headers, user);
};

export const deleteData = async (
  url: string,
  token?: string,
  refreshToken?: string,
  headers?: Headers,
  user?: any
) => {
  return callApi("DELETE", url, undefined, token, refreshToken, headers, user);
};

export const postData = async (
  url: string,
  data: any,
  token?: string,
  refreshToken?: string,
  headers?: Headers,
  user?: any
) => {
  return callApi("POST", url, data, token, refreshToken, headers, user);
};

export const patchData = async (
  url: string,
  data: any,
  token?: string,
  refreshToken?: string,
  headers?: Headers,
  user?: any
) => {
  return callApi("PATCH", url, data, token, refreshToken, headers, user);
};

export const putData = async (
  url: string,
  data: any,
  token?: string,
  refreshToken?: string,
  headers?: Headers,
  user?: any
) => {
  return callApi("PUT", url, data, token, refreshToken, headers, user);
};

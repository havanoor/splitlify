const authToken = "your-auth-token";

export const getData = async (url: string) => {
  try {
    const response = await fetch(process.env.BACKEND_URL + "/" + url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GET error:", error);
    throw error;
  }
};

export const getDataWithParams = async (url: string, params: any) => {
  try {
    const response = await fetch(
      process.env.BACKEND_URL +
        "/" +
        url +
        "?" +
        new URLSearchParams(params).toString,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GET error:", error);
    throw error;
  }
};

export const deleteData = async (url: string) => {
  try {
    const response = await fetch(process.env.BACKEND_URL + "/" + url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GET error:", error);
    throw error;
  }
};

export const postData = async (url: string, data: any) => {
  try {
    console.log("data", data);
    const response = await fetch(process.env.BACKEND_URL + "/" + url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("POST error:", error);
    throw error;
  }
};

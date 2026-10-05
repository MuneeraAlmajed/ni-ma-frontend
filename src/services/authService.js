import { registerToken } from "../lib/helpers/jwt-helpers";
import { currentUser } from "./userService";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

const signUp = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    if (data.token) {
      registerToken(data.token);

      return await currentUser();
    }

    throw new Error("Invalid response from server");
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
};

const signIn = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    if (data.token) {
      registerToken(data.token);

      return await currentUser();
    }

    throw new Error("Invalid response from server");
  } catch (err) {
    throw new Error(err.message, { cause: err });
  }
};

export {
  signUp,
  signIn,
};
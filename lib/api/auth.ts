import { apiClient } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/errors";
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
} from "@/lib/api/types";

export type { RegisterInput, RegisterResponse };

export async function register(
  input: RegisterInput,
): Promise<RegisterResponse> {
  const { data, error, response } = await apiClient.POST("/register", {
    body: input,
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

export type LoginResult = {
  data: LoginResponse;
  setCookieHeaders: string[];
};

export async function login(input: LoginInput): Promise<LoginResult> {
  const { data, error, response } = await apiClient.POST("/login", {
    body: input,
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return {
    data,
    setCookieHeaders: response.headers.getSetCookie(),
  };
}

import { requireSessionCookieHeader } from "@/lib/session";

import { apiClient } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { GetUserResponse, StatusOKResponse } from "@/lib/api/types";

export async function getUserById(userId: number): Promise<GetUserResponse> {
  const { data, error, response } = await apiClient.GET("/users/{user_id}", {
    params: {
      path: { user_id: userId },
    },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

export async function deleteAccount(): Promise<StatusOKResponse> {
  const cookieHeader = await requireSessionCookieHeader();
  console.log("cookieHeader", cookieHeader);
  const { data, error, response } = await apiClient.DELETE("/user", {
    headers: { Cookie: cookieHeader },
  });

  if (error) {
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return data;
}

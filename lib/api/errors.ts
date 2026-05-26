import type { ErrorResponse } from "./types";

export function getApiErrorMessage(error: ErrorResponse, status: number) {
  return error.error ?? `API Error: ${status}`;
}

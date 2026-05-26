import createClient from "openapi-fetch";

import type { paths } from "./schema";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export const apiClient = createClient<paths>({ baseUrl: BASE_URL });

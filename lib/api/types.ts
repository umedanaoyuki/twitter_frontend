import type { components } from "./schema";

export type RegisterInput = components["schemas"]["controllers.RegisterInput"];
export type RegisterResponse =
  components["schemas"]["controllers.RegisterResponse"];
export type ErrorResponse = components["schemas"]["controllers.ErrorResponse"];
export type LoginInput = components["schemas"]["controllers.LoginInput"];
export type LoginResponse = components["schemas"]["controllers.LoginResponse"];
export type CreateTweetInput =
  components["schemas"]["controllers.CreateTweetInput"];
export type CreateTweetResponse =
  components["schemas"]["controllers.CreateTweetResponse"];
export type CreateImageTweetResponse =
  components["schemas"]["controllers.CreateImageTweetResponse"];
export type PresignImageTweetInput =
  components["schemas"]["controllers.PresignImageTweetInput"];
export type PresignImageTweetResponse =
  components["schemas"]["controllers.PresignImageTweetResponse"];
export type CompleteImageTweetInput =
  components["schemas"]["controllers.CompleteImageTweetInput"];
// バックエンドの DELETE /tweets/{id} は controllers.StatusOKResponse を返す
export type DeleteTweetResponse =
  components["schemas"]["controllers.StatusOKResponse"];
export type GetUserTweetsResponse =
  components["schemas"]["controllers.GetUserTweetsResponse"];
export type GetTweetResponse =
  components["schemas"]["controllers.GetTweetResponse"];
export type GetCurrentUserTweetsResponse =
  components["schemas"]["controllers.GetCurrentUserTweetsResponse"];
export type GetAllTweetsResponse =
  components["schemas"]["controllers.GetAllTweetsResponse"];
export type GetUserResponse =
  components["schemas"]["controllers.GetUserResponse"];
export type StatusOKResponse =
  components["schemas"]["controllers.StatusOKResponse"];
export type SwaggerUserDetail =
  components["schemas"]["controllers.SwaggerUserDetail"];
export type ApiTweet = components["schemas"]["controllers.SwaggerTweet"] & {
  image_url?: string;
};

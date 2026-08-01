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
// バックエンドの POST/DELETE /tweets/{id}/retweet は controllers.StatusOKResponse を返す
export type RetweetResponse =
  components["schemas"]["controllers.StatusOKResponse"];
export type GetUserRetweetsResponse =
  components["schemas"]["controllers.GetUserRetweetsResponse"];
// バックエンドの POST/DELETE /tweets/{id}/bookmark は controllers.StatusOKResponse を返す
export type BookmarkResponse =
  components["schemas"]["controllers.StatusOKResponse"];
export type ApiBookmark = components["schemas"]["controllers.SwaggerBookmark"];
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
export type MessageResponse =
  components["schemas"]["controllers.MessageResponse"];
export type SwaggerUserProfile =
  components["schemas"]["controllers.SwaggerUserProfile"];
export type UserProfileResponse =
  components["schemas"]["controllers.UserProfileResponse"];
export type CreateUserProfileBody =
  components["schemas"]["controllers.CreateUserProfileBody"];
export type UpdateUserProfileBody =
  components["schemas"]["controllers.UpdateUserProfileBody"];
export type PresignProfileImageInput =
  components["schemas"]["controllers.PresignProfileImageInput"];
export type PresignProfileImageResponse =
  components["schemas"]["controllers.PresignProfileImageResponse"];
export type CompleteProfileImageInput =
  components["schemas"]["controllers.CompleteProfileImageInput"];
export type SwaggerUserDetail =
  components["schemas"]["controllers.SwaggerUserDetail"];
export type ApiTweet = components["schemas"]["controllers.SwaggerTweet"] & {
  image_url?: string;
};
export type CreateCommentInput =
  components["schemas"]["controllers.CreateCommentBody"];
export type CreateCommentResponse =
  components["schemas"]["controllers.CreateCommentResponse"];
export type GetCommentsResponse =
  components["schemas"]["controllers.GetCommentsResponse"];
export type ApiComment = components["schemas"]["controllers.SwaggerComment"];

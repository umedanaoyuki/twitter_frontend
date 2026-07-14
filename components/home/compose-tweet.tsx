"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AiOutlinePicture } from "react-icons/ai";

import { RxCross1 } from "react-icons/rx";
import { postTweetAction, presignTweetImageAction } from "@/app/home/action";
import { ToastMessage } from "@/components/utils/toast-message";
import {
  ALLOWED_IMAGE_TYPES,
  getTweetLength,
  MAX_TWEET_LENGTH,
  validateTweetImage,
} from "@/lib/validation/tweet";
import { cn } from "@/lib/utils";
import Image from "next/image";

function ComposeTweet() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const contentLength = getTweetLength(content);
  const hasText = content.trim().length > 0;
  const hasImage = selectedImage !== null;
  const imageError = selectedImage ? validateTweetImage(selectedImage) : null;
  const canSubmit =
    !isPending &&
    !imageError &&
    ((hasText && !hasImage && contentLength <= MAX_TWEET_LENGTH) ||
      (hasImage && !hasText));

  function clearImage() {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateTweetImage(file);
    if (error) {
      toast.error(error);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setContent("");
  }

  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    if (event.target.value.trim()) {
      clearImage();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("content", content);

        if (selectedImage) {
          const presignResult = await presignTweetImageAction(
            selectedImage.type,
            selectedImage.size,
          );
          if ("error" in presignResult) {
            toast.error(presignResult.error);
            return;
          }

          const uploadResponse = await fetch(presignResult.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": selectedImage.type },
            body: selectedImage,
          });
          if (!uploadResponse.ok) {
            toast.error("画像のアップロードに失敗しました");
            return;
          }

          formData.set("imageKey", presignResult.key);
        }

        const result = await postTweetAction(formData);
        if (!result) return;

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success(<ToastMessage message={result.message} />);
        setContent("");
        clearImage();
        formRef.current?.reset();
        router.refresh();
      } catch (error) {
        console.error("投稿処理でエラーが発生しました", error);
        toast.error("投稿に失敗しました");
      }
    });
  }

  return (
    <section
      aria-label="ポストを作成"
      className="border-b border-[#2f3336] px-4 py-3"
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div
            className="size-10 shrink-0 rounded-full bg-[#536471]"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <label htmlFor="compose-input" className="sr-only">
              いまどうしてる？
            </label>
            <textarea
              id="compose-input"
              name="content"
              rows={2}
              value={content}
              onChange={handleContentChange}
              placeholder="いまどうしてる？"
              disabled={hasImage || isPending}
              className="w-full resize-none bg-transparent text-xl text-[#e7e9ea] placeholder:text-[#71767b] focus:outline-none disabled:opacity-50"
            />

            {imagePreviewUrl && selectedImage && (
              <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#2f3336]">
                <Image
                  src={imagePreviewUrl}
                  alt="投稿予定の画像"
                  width={560}
                  height={315}
                  unoptimized
                  className="max-h-80 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  disabled={isPending}
                  aria-label="画像を削除"
                  className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-[#0f1419]/80 text-white transition-colors hover:bg-[#272b30]"
                >
                  <RxCross1 className="size-[20px]" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="mt-3 flex items-center justify-between border-t border-[#2f3336] pt-3">
              <div className="flex items-center gap-1 text-[#1d9bf0]">
                <button
                  type="button"
                  aria-label="画像を追加"
                  disabled={hasText || isPending}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full p-2 transition-colors hover:bg-[#1d9bf0]/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <AiOutlinePicture className="size-[20px]" />
                </button>
                {hasText && (
                  <span
                    className={cn(
                      "text-[13px] tabular-nums",
                      contentLength > MAX_TWEET_LENGTH
                        ? "text-[#f4212e]"
                        : "text-[#71767b]",
                    )}
                  >
                    {MAX_TWEET_LENGTH - contentLength}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  "rounded-full bg-[#1d9bf0] px-4 py-1.5 text-[15px] font-bold text-white transition-opacity",
                  !canSubmit && "opacity-50",
                )}
              >
                {isPending ? "投稿中..." : "ポストする"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export { ComposeTweet };

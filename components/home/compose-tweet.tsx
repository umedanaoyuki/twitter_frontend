"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { postTweetAction } from "@/app/home/action";
import { ToastMessage } from "@/components/utils/toast-message";
import {
  ALLOWED_IMAGE_TYPES,
  getTweetLength,
  MAX_TWEET_LENGTH,
} from "@/lib/validation/tweet";
import { cn } from "@/lib/utils";

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
  const canSubmit =
    !isPending &&
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

    clearImage();
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
    if (!formRef.current || !canSubmit) return;

    const formData = new FormData(formRef.current);
    startTransition(async () => {
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
    });
  }

  return (
    <section aria-label="ポストを作成" className="border-b border-[#2f3336] px-4 py-3">
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
                  <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
                    <path d="M10.59 12 4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z" />
                  </svg>
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
                  <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
                    <path d="M8.75 3h-5.5A2.25 2.25 0 0 0 1 5.25v13.5A2.25 2.25 0 0 0 3.25 21h17.5A2.25 2.25 0 0 0 23 18.75V8.75A2.25 2.25 0 0 0 20.75 6.5h-7.836a1.25 1.25 0 0 1-.87-.354l-1.88-1.88A1.25 1.25 0 0 0 9.774 4H8.75zm-5.5 1.5h5.5a.75.75 0 0 1 .53.22l1.88 1.88c.14.14.33.22.53.22h7.836c.414 0 .75.336.75.75v10c0 .414-.336.75-.75.75H3.25a.75.75 0 0 1-.75-.75V5.25c0-.414.336-.75.75-.75z" />
                  </svg>
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

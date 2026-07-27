"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AiOutlineCamera } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

import {
  presignProfileImageAction,
  saveProfileAction,
} from "@/app/profile/action";
import { ToastMessage } from "@/components/utils/toast-message";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProfileFormValues } from "@/lib/types/profile";
import {
  MAX_PROFILE_BIO_LENGTH,
  MAX_PROFILE_LOCATION_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
  hasProfileErrors,
  validateProfile,
} from "@/lib/validation/profile";
import { ALLOWED_IMAGE_TYPES, validateImageFile } from "@/lib/validation/image";
import { cn } from "@/lib/utils";

type EditProfileDialogProps = {
  exists: boolean;
  initialValues: ProfileFormValues;
};

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  multiline?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
};

function EditField({
  id,
  label,
  value,
  onChange,
  maxLength,
  multiline,
  error,
  disabled,
  placeholder,
}: FieldProps) {
  const count = [...value].length;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "rounded-md border bg-black px-3 py-2 transition-colors focus-within:border-[#1d9bf0]",
          error ? "border-[#f4212e]" : "border-[#333639]",
        )}
      >
        <div className="flex items-baseline justify-between">
          <label htmlFor={id} className="text-[13px] text-[#71767b]">
            {label}
          </label>
          {maxLength ? (
            <span className="text-[13px] text-[#71767b] tabular-nums">
              {count} / {maxLength}
            </span>
          ) : null}
        </div>
        {multiline ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            rows={3}
            className="mt-1 w-full resize-none bg-transparent text-[15px] text-[#e7e9ea] placeholder:text-[#71767b] focus:outline-none disabled:opacity-50"
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className="mt-1 w-full bg-transparent text-[15px] text-[#e7e9ea] placeholder:text-[#71767b] focus:outline-none disabled:opacity-50"
          />
        )}
      </div>
      {error ? (
        <p className="px-1 text-[13px] text-[#f4212e]">{error}</p>
      ) : null}
    </div>
  );
}

function EditProfileDialog({ exists, initialValues }: EditProfileDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const errors = validateProfile(values);
  const canSubmit = !isPending && !hasProfileErrors(errors);
  // 新しく選んだ画像を優先し、なければ保存済みの画像を表示する
  const displayedImageUrl = imagePreviewUrl ?? values.imageUrl.trim();

  function update(field: keyof ProfileFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function clearSelectedImage() {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleOpenChange(next: boolean) {
    // 開くたびに初期値へ戻す（編集をキャンセルした場合も破棄）
    if (next) {
      setValues(initialValues);
    }
    clearSelectedImage();
    setOpen(next);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
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
  }

  /** 選択中の画像を取り消す。保存済み画像がある場合は削除（image_urlを空に）する。 */
  function handleRemoveImage() {
    if (selectedImage) {
      clearSelectedImage();
      return;
    }
    update("imageUrl", "");
  }

  function handleSubmit() {
    if (!canSubmit) return;

    startTransition(async () => {
      try {
        let imageKey: string | null = null;

        if (selectedImage) {
          const presignResult = await presignProfileImageAction(
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

          imageKey = presignResult.key;
        }

        const result = await saveProfileAction(values, exists, imageKey);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success(<ToastMessage message={result.message} />);
        clearSelectedImage();
        setOpen(false);
        router.refresh();
      } catch (error) {
        console.error("プロフィールの保存でエラーが発生しました", error);
        toast.error("プロフィールの保存に失敗しました");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-full border border-[#536471] px-4 py-1.5 text-[15px] font-bold text-[#e7e9ea] transition-colors hover:bg-[#181818]"
        >
          プロフィールを編集
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="gap-0 rounded-2xl border border-[#2f3336] bg-black p-0 text-[#e7e9ea] sm:max-w-[600px]"
      >
        <DialogHeader className="sticky top-0 z-10 flex flex-row items-center gap-6 bg-black/90 px-4 py-3 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="flex size-9 items-center justify-center rounded-full text-[#e7e9ea] transition-colors hover:bg-[#181818] disabled:opacity-50"
            aria-label="閉じる"
          >
            ✕
          </button>
          <DialogTitle className="flex-1 text-left text-xl font-bold text-[#e7e9ea]">
            プロフィールを編集
          </DialogTitle>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "rounded-full bg-[#eff3f4] px-4 py-1.5 text-[15px] font-bold text-[#0f1419] transition-opacity hover:bg-[#d7dbdc]",
              !canSubmit && "opacity-50",
            )}
          >
            {isPending ? "保存中..." : "保存"}
          </button>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-4 pt-2 pb-6">
          {/* プロフィール画像 */}
          <div className="flex items-center gap-4">
            <div className="relative size-[100px] shrink-0">
              <div className="size-full overflow-hidden rounded-full border-4 border-black bg-[#333639]">
                {displayedImageUrl ? (
                  <Image
                    src={displayedImageUrl}
                    alt="プロフィール画像"
                    width={100}
                    height={100}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                aria-label="プロフィール画像を変更"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-[#0f1419]/40 text-white transition-colors hover:bg-[#0f1419]/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <AiOutlineCamera className="size-[22px]" />
              </button>
              {displayedImageUrl ? (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isPending}
                  aria-label={
                    selectedImage
                      ? "選択した画像を取り消す"
                      : "プロフィール画像を削除"
                  }
                  className="absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full border border-[#2f3336] bg-[#0f1419] text-white transition-colors hover:bg-[#272b30] disabled:opacity-50"
                >
                  <RxCross1 className="size-[14px]" />
                </button>
              ) : null}
            </div>

            <p className="text-[13px] text-[#71767b]">
              JPEG / PNG、5MBまで
              {selectedImage ? (
                <span className="mt-1 block text-[#1d9bf0]">
                  保存すると新しい画像に更新されます
                </span>
              ) : null}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            className="hidden"
            onChange={handleImageChange}
          />

          <EditField
            id="profile-name"
            label="名前"
            value={values.name}
            onChange={(v) => update("name", v)}
            maxLength={MAX_PROFILE_NAME_LENGTH}
            error={errors.name}
            disabled={isPending}
            placeholder="名前"
          />
          <EditField
            id="profile-bio"
            label="自己紹介"
            value={values.bio}
            onChange={(v) => update("bio", v)}
            maxLength={MAX_PROFILE_BIO_LENGTH}
            multiline
            error={errors.bio}
            disabled={isPending}
            placeholder="自己紹介"
          />
          <EditField
            id="profile-location"
            label="場所"
            value={values.location}
            onChange={(v) => update("location", v)}
            maxLength={MAX_PROFILE_LOCATION_LENGTH}
            error={errors.location}
            disabled={isPending}
            placeholder="場所"
          />
          {errors.imageUrl ? (
            <p className="px-1 text-[13px] text-[#f4212e]">{errors.imageUrl}</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { EditProfileDialog };

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveProfileAction } from "@/app/profile/action";
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
          <label
            htmlFor={id}
            className="text-[13px] text-[#71767b]"
          >
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
      {error ? <p className="px-1 text-[13px] text-[#f4212e]">{error}</p> : null}
    </div>
  );
}

function EditProfileDialog({ exists, initialValues }: EditProfileDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [isPending, startTransition] = useTransition();

  const errors = validateProfile(values);
  const canSubmit = !isPending && !hasProfileErrors(errors);

  function update(field: keyof ProfileFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleOpenChange(next: boolean) {
    // 開くたびに初期値へ戻す（編集をキャンセルした場合も破棄）
    if (next) {
      setValues(initialValues);
    }
    setOpen(next);
  }

  function handleSubmit() {
    if (!canSubmit) return;

    startTransition(async () => {
      const result = await saveProfileAction(values, exists);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(<ToastMessage message={result.message} />);
      setOpen(false);
      router.refresh();
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
          <EditField
            id="profile-image-url"
            label="アバター画像URL"
            value={values.imageUrl}
            onChange={(v) => update("imageUrl", v)}
            error={errors.imageUrl}
            disabled={isPending}
            placeholder="https://example.com/avatar.png"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { EditProfileDialog };

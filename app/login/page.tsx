"use client";

import { LandingPage } from "@/components/home/landing-page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { loginFormSchema, LoginFormValues } from "@/lib/validation/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { loginAction } from "./action";
import { toast } from "sonner";
import { ToastMessage } from "@/components/utils/toast-message";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginAction(values);
      if (!result) return;
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(<ToastMessage message={result.message} />);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/setting");
    });
  });
  return (
    <div>
      <main>
        <LandingPage />
        <Dialog defaultOpen={true}>
          <DialogContent
            className="flex h-[70%] flex-col p-8 lg:h-[50%]"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <form
              onSubmit={onSubmit}
              noValidate
              className="mt-6 flex w-full flex-1 flex-col gap-6 sm:gap-10"
            >
              <DialogHeader>
                <DialogTitle>ログイン</DialogTitle>
                <DialogDescription>
                  メールアドレスとパスワードを入力してください。
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="gap-6 sm:gap-10">
                <Field data-invalid={errors.email ? true : undefined}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="メールアドレス"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  <FieldError errors={[errors.email]} />
                </Field>
                <Field data-invalid={errors.password ? true : undefined}>
                  <PasswordInput
                    id="password"
                    placeholder="パスワード(例: Password1!)"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <FieldError errors={[errors.password]} />
                  <FieldDescription>
                    半角英数字と記号(!?-_)のみ。大文字・小文字・数字・記号をそれぞれ1文字以上含めてください。
                  </FieldDescription>
                </Field>
              </FieldGroup>
              <DialogFooter className="mt-auto w-full flex-col sm:flex-col">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || !isValid}
                >
                  {isPending ? "ログイン中..." : "ログイン"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

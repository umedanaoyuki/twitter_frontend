"use client";

import { registerAction, type RegisterState } from "@/app/signup/actions";
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
import { ToastMessage } from "@/components/utils/toast-message";
import {
  signupFormSchema,
  type SignupFormValues,
} from "@/lib/validation/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Signup() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!state) return;
    if ("error" in state) {
      toast.error(state.error);
      return;
    }
    if ("success" in state) {
      toast.success(<ToastMessage message={state.message} />);
    }
  }, [state]);

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);
    startTransition(() => {
      formAction(formData);
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
                <DialogTitle>アカウントを作成</DialogTitle>
                <DialogDescription>
                  メールアドレスとパスワードを入力して登録してください。
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
                  disabled={pending || !isValid}
                >
                  {pending ? "登録中..." : "登録する"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

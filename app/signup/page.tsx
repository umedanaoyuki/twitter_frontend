"use client";

import { registerAction, type RegisterState } from "@/app/signup/actions";
import { LandingPage } from "@/components/home/landing-page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputWithCharCount } from "@/components/ui/input-with-char-count";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function Signup() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    null,
  );

  useEffect(() => {
    if (!state) return;
    if (state.error) {
      toast.error(state.error);
      return;
    }
    if (state.success) {
      toast.success(state.message ?? "登録が完了しました");
    }
  }, [state]);

  return (
    <div>
      <main>
        <LandingPage />
        <Dialog defaultOpen={true}>
          <DialogContent className="flex h-[50%] flex-col p-8">
            <form
              action={formAction}
              noValidate
              className="flex w-full flex-1 flex-col mt-6 gap-6 sm:gap-10"
            >
              <DialogHeader>
                <DialogTitle>アカウントを作成</DialogTitle>
              </DialogHeader>
              <FieldGroup className="gap-6 sm:gap-10">
                <Field>
                  <InputWithCharCount
                    id="name"
                    name="name"
                    maxLength={50}
                    placeholder="名前（英字/50文字以内）"
                  />
                </Field>
                <Field>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="メールアドレス"
                  />
                </Field>
                <Field>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="パスワード（8〜15文字）"
                  />
                </Field>
              </FieldGroup>
              <DialogFooter className="mt-auto w-full flex-col sm:flex-col">
                <Button type="submit" className="w-full" disabled={pending}>
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

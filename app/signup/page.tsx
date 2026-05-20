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
import { useActionState } from "react";

export default function Signup() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    null,
  );

  return (
    <div>
      <main>
        <LandingPage />
        <Dialog defaultOpen={true}>
          <DialogContent className="flex h-[50%] flex-col p-8">
            <form
              action={formAction}
              className="flex w-full flex-1 flex-col gap-6"
            >
              <DialogHeader>
                <DialogTitle>アカウントを作成</DialogTitle>
              </DialogHeader>
              <FieldGroup>
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
                    required
                  />
                </Field>
                <Field>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="パスワード（8〜15文字）"
                    required
                  />
                </Field>
              </FieldGroup>
              {state?.error ? (
                <p className="text-sm text-red-500">{state.error}</p>
              ) : null}
              {state?.success ? (
                <p className="text-sm text-green-600">{state.message}</p>
              ) : null}
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

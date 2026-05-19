"use client";

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

export default function Signup() {
  return (
    <div>
      <main>
        <LandingPage />
        <Dialog defaultOpen={true}>
          <form>
            <DialogContent className="sm:max-w-sm p-8">
              <DialogHeader className="mt-8">
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
                  <Input id="email" name="email" placeholder="メールアドレス" />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button type="submit" className="w-full">
                  登録する
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </main>
    </div>
  );
}

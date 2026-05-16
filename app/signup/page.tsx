"use client";

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
        <div>
          <div>
            <div>
              <span>すべての話題が、ここに。</span>
            </div>
            <div>
              <span>今すぐ参加しましょう。</span>
            </div>
            <div>
              <a href="/signup">
                <div>
                  <div>
                    <span>アカウントを作成</span>
                  </div>
                </div>
              </a>
              <div>
                アカウントを登録することにより、利用規約とプライバシーポリシー（Cookieの使用を含む）に同意したとみなされます。
              </div>
              <div>
                <div>
                  <span>アカウントをお持ちの場合</span>
                </div>
                <a href="/login">
                  <span>ログイン</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>画像</div>
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

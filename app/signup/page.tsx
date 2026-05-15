import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">Name</Label>
                  <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                </Field>
                <Field>
                  <Label htmlFor="username-1">Username</Label>
                  <Input
                    id="username-1"
                    name="username"
                    defaultValue="@peduarte"
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </main>
    </div>
  );
}

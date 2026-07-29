"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IoLogOutOutline } from "react-icons/io5";

import { logoutAction } from "@/app/home/action";
import { ToastMessage } from "@/components/utils/toast-message";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  label: string;
};

function LogoutButton({ label }: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      const result = await logoutAction();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(<ToastMessage message={result.message} />);
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleLogout}
      className={cn(
        "group flex w-fit items-center gap-5 rounded-full px-4 py-3 text-xl text-[#e7e9ea] transition-colors hover:bg-[#181818]",
        isPending && "opacity-60",
      )}
    >
      <IoLogOutOutline
        className="size-[26px] shrink-0 text-[#e7e9ea]"
        aria-hidden
      />
      {label}
    </button>
  );
}

export { LogoutButton };

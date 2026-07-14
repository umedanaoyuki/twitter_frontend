import { X_PATH } from "@/components/home/x-logo-mark";
import { cn } from "@/lib/utils";

type XHeroLogoProps = {
  className?: string;
  tiny?: boolean;
};

function XHeroLogo({ className, tiny = false }: XHeroLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden",
        tiny ? "mb-4 max-w-[140px] self-center" : "min-h-[45vh] flex-1",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "h-auto w-full",
          tiny ? "max-w-[140px]" : "max-w-[308px]",
        )}
        aria-hidden
      >
        <path d={X_PATH} fill="#ffffff" />
        <path
          d={X_PATH}
          stroke="#2f3336"
          strokeWidth={tiny ? 0.4 : 0.2}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export { XHeroLogo };

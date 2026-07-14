import { cn } from "@/lib/utils";

const X_PATH =
  "M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z";

type XLogoMarkProps = {
  className?: string;
};

function XLogoMark({ className }: XLogoMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-[26px] fill-current", className)}
    >
      <path d={X_PATH} />
    </svg>
  );
}

export { XLogoMark, X_PATH };

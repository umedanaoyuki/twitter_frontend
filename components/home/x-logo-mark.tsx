import { cn } from "@/lib/utils";

const X_PATH =
  "M285.38 207.711L462.954 1.5H420.874L266.687 180.55L143.538 1.5H1.50003L187.726 272.256L1.50003 488.5H43.5818L206.408 299.417L336.462 488.5H478.5L285.37 207.711H285.38ZM227.743 274.641L208.875 247.68L58.7444 33.147H123.379L244.536 206.282L263.405 233.243L420.894 458.292H356.259L227.743 274.652V274.641Z";

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

export { XLogoMark };

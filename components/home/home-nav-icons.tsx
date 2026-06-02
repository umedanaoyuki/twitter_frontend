import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[26px]", className)}>
      <path
        fill="currentColor"
        d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0-7L4 8v12h16V8l-8-6zm6 16H6V9.333L12 4.333l6 5V18z"
      />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[26px]", className)}>
      <path
        fill="currentColor"
        d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904l4.154 4.154 1.06-1.06-4.154-4.154A6.456 6.456 0 0 0 16.75 10.25c0-3.59-2.91-6.5-6.5-6.5zm-5 6.5a5 5 0 1 1 10 0 5 5 0 0 1-10 0z"
      />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[26px]", className)}>
      <path
        fill="currentColor"
        d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051H2.866l-.134 1.704 3.012.233.028.285H5.88l.081 1.019h12.077l.081-1.019h1.148l.028-.285 3.011-.233-.133-1.704h-2.131c-.5-4.03-3.93-7.051-8.002-7.051zM3.678 11.77l-.006.075-.692 8.787c-.058.733.48 1.368 1.214 1.368h16.612c.734 0 1.272-.635 1.214-1.368l-.692-8.787-.006-.075H3.678zm5.318 12.48a2.873 2.873 0 0 0 5.996 0H8.996z"
      />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[26px]", className)}>
      <path
        fill="currentColor"
        d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l6.52 4.348 1.48-1.002 1.48 1.002 6.52-4.348V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 4.463-6.818 4.545L3.498 9.463V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5V9.463z"
      />
    </svg>
  );
}

function BookmarkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[26px]", className)}>
      <path
        fill="currentColor"
        d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 3.5c-.276 0-.5.22-.5.5v14.86l7-5.04 7 5.04V4c0-.28-.224-.5-.5-.5h-11z"
      />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[26px]", className)}>
      <path
        fill="currentColor"
        d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.687 14.002 13 12 13s-3.317.687-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-7.258C6.9 11.08 9.413 10 12 10s5.1 1.08 5.863 1.742C18.778 12.758 20 14.527 20 17v1h-1.998v-1c0-1.768-1.02-3.13-2.24-4.098C15.147 11.64 13.6 11 12 11s-3.147.64-3.76 1.902C7.02 13.87 6 15.232 6 17v1H4v-1c0-2.473 1.222-4.242 2.137-5.258zM12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
      />
    </svg>
  );
}

function MoreIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[26px]", className)}>
      <path
        fill="currentColor"
        d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm9-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"
      />
    </svg>
  );
}

export { BellIcon, BookmarkIcon, HomeIcon, MailIcon, MoreIcon, SearchIcon, UserIcon };

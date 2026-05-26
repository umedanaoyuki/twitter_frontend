"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, InformationCircleIcon, Alert02Icon, MultiplicationSignCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons"

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)"

function useIsDesktop() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
      mediaQuery.addEventListener("change", onStoreChange)
      return () => mediaQuery.removeEventListener("change", onStoreChange)
    },
    () => window.matchMedia(DESKTOP_MEDIA_QUERY).matches,
    () => false,
  )
}

const MOBILE_TOAST_OFFSET = {
  top: "max(1rem, env(safe-area-inset-top, 0px))",
} as const

const Toaster = ({
  position: positionProp,
  offset,
  mobileOffset,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const isDesktop = useIsDesktop()
  const position =
    positionProp ?? (isDesktop ? "bottom-right" : "top-center")

  return (
    <Sonner
      key={position}
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      offset={isDesktop ? offset : MOBILE_TOAST_OFFSET}
      mobileOffset={mobileOffset ?? MOBILE_TOAST_OFFSET}
      icons={{
        success: (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" />
        ),
        info: (
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4" />
        ),
        warning: (
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4" />
        ),
        error: (
          <HugeiconsIcon icon={MultiplicationSignCircleIcon} strokeWidth={2} className="size-4" />
        ),
        loading: (
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
      position={position}
    />
  )
}

export { Toaster }

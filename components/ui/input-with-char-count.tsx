"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputWithCharCountProps = React.ComponentProps<"input"> & {
  maxLength?: number;
};

function InputWithCharCount({
  className,
  maxLength = 50,
  value: valueProp,
  defaultValue,
  onChange,
  ...props
}: InputWithCharCountProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    () => (defaultValue?.toString() ?? ""),
  );
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp.toString() : uncontrolledValue;
  const length = value.length;
  const showCount = length > 0;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  }

  return (
    <div className="relative">
      {showCount && (
        <span
          className="pointer-events-none absolute top-2 right-3 text-xs text-muted-foreground tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {length}/{maxLength}
        </span>
      )}
      <Input
        className={cn(showCount && "pr-14", className)}
        maxLength={maxLength}
        {...(isControlled ? { value: valueProp } : { defaultValue })}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}

export { InputWithCharCount };

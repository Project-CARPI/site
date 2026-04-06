import { forwardRef, ReactElement } from "react";

import * as Select from "@radix-ui/react-select";
import { MdOutlineCheck } from "react-icons/md";

import { cn } from "@/lib/classnames";

type DropdownProps = {
  selectedValue: string | number | null;
  options: { value: string | number; label: string }[];
  onChange: (value: string | number) => void;
  disabled?: boolean;
  className?: string;
  trigger?: ReactElement;
};

export default function Dropdown({
  selectedValue,
  options,
  onChange,
  disabled,
  className,
  trigger,
}: DropdownProps) {
  return (
    <Select.Root value={selectedValue?.toString()} onValueChange={onChange}>
      {trigger ? (
        <Select.Trigger asChild disabled={disabled} className="inline-flex">
          {trigger}
        </Select.Trigger>
      ) : (
        <Select.Trigger
          className={cn(
            "text-darkblue inline-flex items-center rounded-2xl text-start hover:cursor-pointer focus:outline-none",
            "bg-carpipink/15 hover:bg-carpipink/25 active:bg-carpipink/40 px-3 py-1",
            "focus-visible:rounded-full focus-visible:outline-2",
            "focus-visible:outline-foreground focus-visible:outline-offset-2",
            disabled &&
              "bg-foreground/20 text-foreground hover:bg-foreground/20 active:bg-foreground/20 cursor-not-allowed opacity-50 hover:cursor-not-allowed",
            className,
          )}
          aria-label="Custom select"
          disabled={disabled}
        >
          <span className="flex-1 truncate text-wrap pr-2">
            <Select.Value placeholder="placeholder" />
          </span>
        </Select.Trigger>
      )}

      <Select.Portal>
        <Select.Content className="bg-carpipink z-50 max-h-60 overflow-auto rounded-2xl border border-darkblue shadow-lg ">
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <DropdownItem key={option.value.toString()} value={option.value}>
                {option.label}
              </DropdownItem>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

type DropdownItemProps = {
  value: string | number;
  children: React.ReactNode;
};

const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ children, value }, ref) => {
    return (
      <Select.Item
        ref={ref}
        value={value.toString()}
        className={cn(
          "relative flex h-7.5 select-none items-center rounded-xl px-6 leading-none",
          "data-highlighted:bg-darkblue data-highlighted:text-carpipink",
          "focus-visible:bg-darkblue focus-visible:text-carpipink focus-visible:outline-none",
        )}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-2 inline-flex w-4 items-center justify-center">
          <MdOutlineCheck />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);
DropdownItem.displayName = "DropdownItem";

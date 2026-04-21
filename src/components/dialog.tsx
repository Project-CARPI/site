import React, { useState, useCallback } from "react";

import * as RadixDialog from "@radix-ui/react-dialog";

import { cn } from "@/lib/classnames";

type DialogProps = {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function Dialog({
  title,
  description,
  children,
  trigger,
  disabled = false,
  open: controlledOpen,
  onOpenChange,
}: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // use controlled state if provided, otherwise local state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <RadixDialog.Root open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <RadixDialog.Trigger
          asChild
          disabled={disabled}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          aria-disabled={disabled}
        >
          {trigger}
        </RadixDialog.Trigger>
      )}

      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={cn(
            "dialog-overlay fixed inset-0 z-100 bg-darkblue/50 transition-opacity",
          )}
        />
        <RadixDialog.Content asChild>
          <div
            className={cn(
              "dialog-content fixed inset-0 z-100 m-auto flex flex-col overflow-hidden",
              "bg-carpipink rounded-3xl p-6 shadow-md focus:outline-none border border-darkblue",
              "h-fit w-3/4 md:w-fit md:max-w-lg md:min-w-sm",
            )}
          >
            <RadixDialog.Title asChild>
              <div className="flex flex-col items-center gap-4">
                <p className="text-lg font-bold">{title}</p>
              </div>
            </RadixDialog.Title>

            <RadixDialog.Description asChild>
              <div className="mt-2 w-full text-center">{description}</div>
            </RadixDialog.Description>

            {children}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

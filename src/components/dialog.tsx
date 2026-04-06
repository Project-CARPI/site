import React, { useState, useCallback, useEffect } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import { cn } from "@/lib/classnames";

type DialogProps = {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  onConfirm: () => boolean | Promise<boolean>;
  trigger?: React.ReactNode;
  disabled?: boolean;
  autoClose?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function ConfirmationDialog({
  title,
  description,
  children,
  onConfirm,
  trigger,
  disabled = false,
  autoClose = false,
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

  const handleClose = useCallback(() => {
    handleOpenChange(false);
    return true;
  }, [handleOpenChange]);

  const handleConfirm = useCallback(async () => {
    // If autoClose is enabled, we optimistically close
    // the dialog before calling onConfirm
    if (autoClose) {
      handleOpenChange(false);
      onConfirm();
      return true;
    }

    const success = await onConfirm();
    if (success) {
      handleOpenChange(false);
    }
    return success;
  }, [autoClose, onConfirm, handleOpenChange]);

  useEffect(() => {
    // If the dialog is not open, then don't add the keydown listener
    if (!open) return;

    // Add keydown listener for Enter and Escape keys to trigger confirm or cancel
    // actions.
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events coming from text inputs or editable elements
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName;
      const isTextInput =
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isTextInput) {
        return;
      }

      if (e.key === "Escape") handleClose();
      else if (e.key === "Enter") handleConfirm();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, handleConfirm, open]);

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <Dialog.Trigger
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
        </Dialog.Trigger>
      )}

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "dialog-overlay fixed inset-0 z-40 bg-gray-700/40 transition-opacity",
          )}
        />
        <Dialog.Content asChild>
          <div
            className={cn(
              "dialog-content fixed inset-0 z-40 m-auto flex flex-col overflow-hidden",
              "bg-panel rounded-3xl p-6 shadow-md focus:outline-none",
              "h-fit w-3/4 md:w-fit md:max-w-3xl",
            )}
          >
            <Dialog.Title asChild>
              <div className="flex flex-col items-center gap-4">
                <p className="text-lg font-bold">{title}</p>
              </div>
            </Dialog.Title>

            <Dialog.Description asChild>
              <div className="mt-2 w-full text-center">{description}</div>
            </Dialog.Description>

            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

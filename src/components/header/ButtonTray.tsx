import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  BiExport,
  BiImport,
  BiReset,
  BiDotsVerticalRounded,
} from "react-icons/bi";

import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import { useInputOutput } from "@/core/workspace/utils/io/useInputOutput";
import { cn } from "@/lib/classnames";

interface HeaderButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  tooltip: string;
}

function HeaderButton({ onClick, children, tooltip }: HeaderButtonProps) {
  return (
    <div className="relative group flex flex-col items-center">
      <button
        onClick={onClick}
        className={cn(
          "p-3 rounded-full w-fit aspect-square flex items-center justify-center hover:cursor-pointer",
          "bg-darkblue/20 hover:bg-darkblue hover:text-carpipink transition-colors",
        )}
      >
        {children}
      </button>

      {/* Tooltip Container */}
      <div className="absolute -bottom-8 hidden group-hover:flex flex-col items-center">
        <div className="w-2 h-2 bg-darkblue rotate-45"></div>
        <div className="bg-darkblue text-carpipink text-xs py-1 px-2 -mt-1 rounded-full whitespace-nowrap">
          {tooltip}
        </div>
      </div>
    </div>
  );
}

export default function ButtonTray() {
  const [isOpen, setIsOpen] = useState(false);

  const { resetWorkspace } = useCourseWorkspace();
  const { exportPlan, importPlan } = useInputOutput();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importPlan(file);
    }
    e.target.value = "";
  };

  const buttonList = (
    <>
      <HeaderButton onClick={resetWorkspace} tooltip="Reset Workspace">
        <BiReset className="w-5 h-5" />
      </HeaderButton>
      <HeaderButton onClick={exportPlan} tooltip="Export Plan">
        <BiExport className="w-5 h-5" />
      </HeaderButton>
      <HeaderButton onClick={handleImportClick} tooltip="Import Plan">
        <BiImport className="w-5 h-5" />
      </HeaderButton>
    </>
  );

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      <div className="absolute right-5 top-0 h-full flex items-center z-50">
        <div className="hidden md:flex gap-2">{buttonList}</div>
        <div className="md:hidden relative flex flex-col items-center justify-center">
          <HeaderButton
            onClick={() => setIsOpen(!isOpen)}
            tooltip="More Options"
          >
            <BiDotsVerticalRounded className="w-5 h-5" />
          </HeaderButton>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute top-full mt-2 flex flex-col gap-2 p-2 rounded-full shadow-xl z-50",
                  "bg-carpipink border-darkblue/10 border",
                )}
              >
                {buttonList}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  BiExport,
  BiImport,
  BiReset,
  BiDotsVerticalRounded,
} from "react-icons/bi";

function HeaderButton({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="p-3 bg-darkblue/20 rounded-full w-fit aspect-square flex items-center justify-center hover:bg-darkblue hover:text-carpipink transition-colors"
    >
      {children}
    </button>
  );
}

export default function ButtonTray() {
  const [isOpen, setIsOpen] = useState(false);

  const buttonList = (
    <>
      <HeaderButton>
        <BiReset className="w-5 h-5" />
      </HeaderButton>
      <HeaderButton>
        <BiExport className="w-5 h-5" />
      </HeaderButton>
      <HeaderButton>
        <BiImport className="w-5 h-5" />
      </HeaderButton>
    </>
  );

  return (
    <div className="absolute right-5 top-0 h-full flex items-center z-50">
      {/* Desktop View: Show all buttons horizontally */}
      <div className="hidden md:flex gap-2">{buttonList}</div>

      {/* Mobile View: Toggle Button + Dropdown */}
      <div className="md:hidden relative flex flex-col items-center justify-center">
        <HeaderButton onClick={() => setIsOpen(!isOpen)}>
          <BiDotsVerticalRounded className="w-5 h-5" />
        </HeaderButton>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 flex flex-col gap-2 bg-carpipink p-2 rounded-full shadow-xl z-50 border border-darkblue/10"
            >
              {buttonList}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

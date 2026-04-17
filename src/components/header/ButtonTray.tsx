import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  BiExport,
  BiImport,
  BiReset,
  BiDotsVerticalRounded,
} from "react-icons/bi";

import Button from "@/components/Button";
import { useCourseWorkspace } from "@/core/workspace/useCourseWorkspace";
import {
  SaveFile,
  SaveFileSchema,
} from "@/core/workspace/utils/io/inputOutput";
import { useInputOutput } from "@/core/workspace/utils/io/useInputOutput";
import { cn } from "@/lib/classnames";

export default function ButtonTray() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<
    "reset" | "import" | "error" | null
  >(null);
  const [pendingFileData, setPendingFileData] = useState<SaveFile | null>(null);

  const { resetWorkspace } = useCourseWorkspace();
  const { exportPlan, importPlan } = useInputOutput();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const result = SaveFileSchema.safeParse(json);

        if (!result.success) {
          console.error("File validation failed:", result.error);
          setActiveDialog("error");
          return;
        }

        setPendingFileData(result.data);
        setActiveDialog("import");
      } catch {
        console.error("Failed to read or parse file.");
        setActiveDialog("error");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset input
  };

  const confirmReset = () => {
    resetWorkspace();
    setActiveDialog(null);
    return true;
  };

  const confirmImport = () => {
    if (pendingFileData) {
      importPlan(pendingFileData);
    }
    setPendingFileData(null);
    setActiveDialog(null);
    return true;
  };

  const buttonList = (
    <>
      <Button onClick={resetWorkspace} tooltip="Reset Workspace">
        <BiReset className="w-5 h-5" />
      </Button>
      <Button onClick={exportPlan} tooltip="Export Plan">
        <BiExport className="w-5 h-5" />
      </Button>
      <Button onClick={handleImportClick} tooltip="Import Plan">
        <BiImport className="w-5 h-5" />
      </Button>
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
          <Button onClick={() => setIsOpen(!isOpen)} tooltip="More Options">
            <BiDotsVerticalRounded className="w-5 h-5" />
          </Button>

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

      <Dialog
        title="Resetting Workspace"
        open={activeDialog === "reset"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        description="Are you sure you want to reset your entire workspace? This will delete all semesters and courses."
      >
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={() => setActiveDialog(null)}
            className="px-4 py-2 bg-darkblue/20 hover:text-carpipink rounded-xl hover:bg-darkblue hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={confirmReset}
            className="px-4 py-2 bg-rosewood text-carpipink rounded-xl hover:cursor-pointer hover:bg-[color-mix(in_oklab,var(--color-rosewood)_90%,black_10%)]"
          >
            Confirm Reset
          </button>
        </div>
      </Dialog>

      {/* IMPORT DIALOG */}
      <Dialog
        title="Importing New Plan!"
        open={activeDialog === "import"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        description="Importing will overwrite your current plan. This action cannot be undone."
      >
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={() => setActiveDialog(null)}
            className="px-4 py-2 bg-darkblue/20 hover:text-carpipink rounded-xl hover:bg-darkblue hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={confirmImport}
            className="px-4 py-2 bg-slategray text-carpipink rounded-xl hover:cursor-pointer hover:bg-[color-mix(in_oklab,var(--color-slategray)_90%,black_10%)]"
          >
            Overwrite & Import
          </button>
        </div>
      </Dialog>

      {/* ERROR DIALOG */}
      <Dialog
        title="Error Importing File"
        open={activeDialog === "error"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        description="There was an error importing your file. Please make sure it is a valid CARPI file and try again."
      >
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={() => setActiveDialog(null)}
            className="px-4 py-2 bg-darkblue/20 hover:text-carpipink rounded-xl hover:bg-darkblue hover:cursor-pointer"
          >
            Close
          </button>
        </div>
      </Dialog>
    </>
  );
}

import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  BiExport,
  BiImport,
  BiReset,
  BiDotsVerticalRounded,
  BiLogoDiscordAlt,
  BiLogoGithub,
} from "react-icons/bi";

import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
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

  const handleResetClick = () => {
    setActiveDialog("reset");
    setIsOpen(false);
  };

  const handleExportClick = () => {
    exportPlan();
    setIsOpen(false);
  };

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

  const openExternalLinkAndClose = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleDiscordClick = () => {
    openExternalLinkAndClose("https://discord.com/invite/xRBvFHgcYT");
  };

  const handleGithubClick = () => {
    openExternalLinkAndClose("https://github.com/Project-CARPI");
  };

  const mainButtons = (
    <>
      <Button onClick={handleResetClick} tooltip="Reset Workspace">
        <BiReset className="w-5 h-5" />
      </Button>
      <Button onClick={handleExportClick} tooltip="Export Plan">
        <BiExport className="w-5 h-5" />
      </Button>
      <Button onClick={handleImportClick} tooltip="Import Plan">
        <BiImport className="w-5 h-5" />
      </Button>
    </>
  );

  const socialButtons = (
    <>
      <Button
        onClick={handleDiscordClick}
        tooltip="Join our Discord"
        customStyles="hover:bg-[#5865f2] hover:text-[#e0e3ff] hover:p-1.5 p-3 transition-all duration-300"
      >
        <BiLogoDiscordAlt className="group-hover:w-8 group-hover:h-8 w-5 h-5 transition-all duration-300" />
      </Button>

      <Button
        onClick={handleGithubClick}
        tooltip="View on GitHub"
        customStyles="hover:bg-[#8534F3] hover:text-[#e0e3ff] hover:p-1.5 p-3 transition-all duration-300"
      >
        <BiLogoGithub className="group-hover:w-8 group-hover:h-8 w-5 h-5 transition-all duration-300" />
      </Button>
    </>
  );

  const mobileRadialButtons = [
    {
      id: "export",
      component: (
        <Button
          onClick={handleExportClick}
          tooltip="Export Plan"
          customStyles="bg-darkblue text-carpipink"
        >
          <BiExport className="w-5 h-5" />
        </Button>
      ),
    },
    {
      id: "discord",
      component: (
        <Button
          onClick={handleDiscordClick}
          tooltip="Join our Discord"
          customStyles="bg-[#5865f2] text-[#e0e3ff] p-1.5"
        >
          <BiLogoDiscordAlt className="w-8 h-8" />
        </Button>
      ),
    },
    {
      id: "import",
      component: (
        <Button
          onClick={handleImportClick}
          tooltip="Import Plan"
          customStyles="bg-darkblue text-carpipink"
        >
          <BiImport className="w-5 h-5" />
        </Button>
      ),
    },
    {
      id: "github",
      component: (
        <Button
          onClick={handleGithubClick}
          tooltip="View on GitHub"
          customStyles="bg-[#8534F3] text-[#e0e3ff] p-1.5"
        >
          <BiLogoGithub className="w-8 h-8" />
        </Button>
      ),
    },
    {
      id: "reset",
      component: (
        <Button
          onClick={handleResetClick}
          tooltip="Reset Workspace"
          customStyles="bg-darkblue text-carpipink"
        >
          <BiReset className="w-5 h-5" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      <div className="absolute right-4 md:right-0 top-0 h-full flex items-center z-50">
        {/* DESKTOP */}
        <div className="hidden md:flex gap-2">
          {mainButtons}
          <div className="w-0.5 bg-darkblue/10 rounded-full my-2 mx-1" />
          {socialButtons}
        </div>

        {/* MOBILE */}
        <div className="md:hidden relative flex items-center justify-center">
          <AnimatePresence>
            {isOpen &&
              mobileRadialButtons.map((btn, index) => {
                // Number of pixels the buttons push outwards
                const RADIUS = index % 2 === 0 ? 60 : 105;
                const START_ANGLE = 80;
                const END_ANGLE = 190;

                // Calculate the specific angle for this button
                const angleDeg =
                  START_ANGLE +
                  index *
                    ((END_ANGLE - START_ANGLE) /
                      (mobileRadialButtons.length - 1));
                const angleRad = angleDeg * (Math.PI / 180);

                // Convert angle & radius into X and Y coordinate offsets
                const x = RADIUS * Math.cos(angleRad);
                const y = RADIUS * Math.sin(angleRad);

                return (
                  <motion.div
                    key={btn.id}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, x, y, scale: 1 }}
                    exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: index * 0.04,
                    }}
                    className="absolute z-40"
                  >
                    {btn.component}
                  </motion.div>
                );
              })}
          </AnimatePresence>

          <motion.div
            animate={{
              scale: isOpen ? 0.8 : 1,
              rotate: isOpen ? 90 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-50 bg-carpipink rounded-full"
          >
            <Button
              onClick={() => setIsOpen(!isOpen)}
              tooltip="More Options"
              customStyles={cn(
                isOpen
                  ? "bg-darkblue text-carpipink transition-colors duration-300"
                  : "",
              )}
            >
              <BiDotsVerticalRounded className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* RESET DIALOG */}
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

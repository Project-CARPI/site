import { motion } from "framer-motion";

export default function ErrorBanner({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      layout
      className="text-darkblue text-sm bg-rosewood/20 rounded-2xl p-4 text-center"
    >
      {children}
    </motion.div>
  );
}

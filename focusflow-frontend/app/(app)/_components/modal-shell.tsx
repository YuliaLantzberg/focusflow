import { COLORS, SIZES, STYLES } from "@/app/lib/styles";
import CloseXBtn from "./buttons/close-x-btn";

type ModalShellProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export default function ModalShell({ children, onClose }: ModalShellProps) {
  return (
    <>
      <div
        id="modal-overlay"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div
        id="modal-content"
        className={`fixed inset-0 z-50 ${STYLES.flexCenter}`}
      >
        <div
          className={`relative w-full max-w-2xl mx-4 ${SIZES.radiusLarge} border ${COLORS.border} bg-slate-900/95 shadow-2xl flex flex-col min-h-[60vh]`}
        >
          <CloseXBtn onClose={onClose} />

          {children}
        </div>
      </div>
    </>
  );
}

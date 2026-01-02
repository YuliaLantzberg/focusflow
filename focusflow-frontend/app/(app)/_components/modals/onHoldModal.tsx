import { PageTitle } from "../../_components/page-title";
import ModalShell from "../../_components/modal-shell";
import { COLORS, STYLES } from "@/app/lib/styles";
import Btn from "../buttons/btn";

type onHoldProps = {
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function OnHoldModal({ onCancel, onConfirm, onClose }: onHoldProps) {
  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-xl space-y-6">
          <div className="py-6">
            <PageTitle>{`This project is on hold`}</PageTitle>
            <p
              className={`text-2xl ${STYLES.flexCenter} m-30 ${COLORS.textHighlight}`}
            >
              Resume project to continue?
            </p>

            <div className={`${STYLES.flexCenterCenter} flex-row gap-10`}>
              <Btn
                data={true}
                onClick={onConfirm}
                label="Confirm"
                bgColor={COLORS.BtnBgColor.primary}
              />
              <Btn
                data={false}
                onClick={onCancel}
                label="Cancel"
                bgColor={COLORS.BtnBgColor.danger}
              />
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

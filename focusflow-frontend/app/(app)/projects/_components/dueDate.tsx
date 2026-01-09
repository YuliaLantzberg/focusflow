import { getDuedateStatusColor } from "@/app/lib/statusColor";
import { calcDueDateConstraint } from "../[projectId]/lib/helper";

type DueDateProps = {
  targetDate: string | null;
};

export default function DueDate({ targetDate }: DueDateProps) {
  if (!targetDate) return;
  const { status, daysNum } = calcDueDateConstraint(new Date(targetDate));
  let msg = "";
  if (daysNum === null) return;
  if (daysNum < 0) msg = `Overdue by ${Math.abs(daysNum)} days`;
  else if (daysNum === 0) msg = `Due today`;
  else msg = `Due in ${daysNum} days`;
  return <p className={getDuedateStatusColor(status)}>{msg}</p>;
}

import Button from "./Button";

export default function BtnFilter({ isActive, ...props }) {
  return <Button variant="filter" isActive={isActive} size="sm" {...props} />;
}

import { cn } from "@/lib/utils";
import { LoaderCircle, LucideProps } from "lucide-react";

type Props = {
  label?: string;
} & LucideProps;

export default function Loader({
  label,
  className,
  ...props
}: Props) {
  return (
    <>
      <LoaderCircle className={cn("animate-spin", className)} {...props} />
      {label && label}
    </>
  );
}

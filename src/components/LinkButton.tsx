import { Button, ButtonProps } from "./ui/button";
import Link from "next/link";

export default function LinkButton({
  href,
  children,
  ...props
}: ButtonProps & {
  href: string;
}) {
  return (
    <Button asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

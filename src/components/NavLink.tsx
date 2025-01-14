"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export default function NavLink({
  children,
  className,
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium",
        pathname === href ? "text-primary " : "",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

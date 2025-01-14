import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToggleTheme } from "./ToggleTheme";
import { Calendar, CalendarCheck, CalendarRange, Menu } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NavLink from "./NavLink";
import { auth } from "@clerk/nextjs/server";

export default async function Header() {
  const { userId } = await auth();

  return (
    <header className="border-b">
      <div className="container flex-between">
        <Link href={userId ? "/events" : "/"} className="flex-center gap-2">
          <CalendarRange />
          <h1 className="text-2xl font-bold">Calendor</h1>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="sm:hidden" asChild>
            <Button variant="secondary">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <NavLink href="/events" className="text-base">
                <Calendar className="!size-5" />
                Events
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink href="/schedule" className="text-base">
                <CalendarCheck className="!size-5" />
                Schedules
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ToggleTheme label="Theme" />
            </DropdownMenuItem>
            <SignedIn>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserButton />
              </DropdownMenuItem>
            </SignedIn>
            <SignedOut>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-inherit">
                <Button className="w-full" asChild>
                  <SignInButton />
                </Button>
              </DropdownMenuItem>
            </SignedOut>
          </DropdownMenuContent>
        </DropdownMenu>
        <nav className="hidden sm:flex-center gap-4">
          <NavLink href="/events" className="hover:underline">
            Events
          </NavLink>
          <NavLink href="/schedule" className="hover:underline">
            Schedule
          </NavLink>
          <ToggleTheme />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button variant="secondary" asChild>
              <SignInButton />
            </Button>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}

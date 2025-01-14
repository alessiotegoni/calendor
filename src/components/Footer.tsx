import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex-between flex-col md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Calendor. All rights reserved.
        </p>
        <nav className="mt-4 flex space-x-4 md:mt-0">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:underline"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:underline"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}

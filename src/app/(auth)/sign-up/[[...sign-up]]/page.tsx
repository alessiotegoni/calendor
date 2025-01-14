import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Calendor account",
};

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) redirect("/");

  return (
    <main>
      <div className="container space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start scheduling with Calendor today!
          </p>
        </div>
        <div className="flex-center">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                footerActionLink: "text-primary hover:text-primary/90",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}

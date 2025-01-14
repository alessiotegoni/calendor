import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Calendor account",
};

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) redirect("/");

  return (
    <main>
      <div className="container">
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back! Please enter your details.
          </p>
        </div>
        <div className="flex-center mt-6">
          <SignIn
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

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) redirect("/events");

  return (
    <main className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-32">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent sm:min-h-20">
          Simplify Your Scheduling
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Effortlessly create, manage, and book events with Calendor. Your time,
          your way.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-2">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <Link href="/sign-in">Get Started</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
            asChild
          >
            <Link href="/demo">See Demo</Link>
          </Button>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why Choose Calendor?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Calendar className="h-12 w-12 text-primary" />}
            title="Easy Scheduling"
            description="Create and manage events with just a few clicks. Our intuitive interface makes scheduling a breeze."
          />
          <FeatureCard
            icon={<Clock className="h-12 w-12 text-primary" />}
            title="Time Zone Smart"
            description="Automatically adjust event times for attendees in different time zones. No more confusion!"
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-primary" />}
            title="Team Collaboration"
            description="Seamlessly work with your team. Share calendars, delegate tasks, and stay in sync."
          />
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            number={1}
            title="Create Your Event"
            description="Set up your event with custom details, duration, and availability."
          />
          <StepCard
            number={2}
            title="Share Your Link"
            description="Send your unique booking link to attendees or embed it on your website."
          />
          <StepCard
            number={3}
            title="Get Booked"
            description="Attendees choose a time, and it's automatically added to your calendar."
          />
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl p-12 my-16 text-center shadow-lg">
        <h2 className="text-4xl font-bold mb-6">
          Ready to streamline your scheduling?
        </h2>
        <p className="text-xl mb-10 opacity-90">
          Join thousands of satisfied users and take control of your time today.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-primary hover:bg-white/90"
          asChild
        >
          <Link href="/sign-in">Start Free Trial</Link>
        </Button>
      </section>

      <section className="py-16">
        <h2 className="text-4xl font-bold text-center mb-16">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TestimonialCard
            quote="Calendor has revolutionized how I manage my time. It's intuitive, powerful, and saves me hours every week."
            author="Sarah J., Freelance Designer"
          />
          <TestimonialCard
            quote="As a team leader, Calendor has made coordinating meetings and projects so much easier. It's a game-changer!"
            author="Michael T., Project Manager"
          />
        </div>
      </section>
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="mb-6">{icon}</div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
          {number}
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
}

function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CheckCircle className="h-10 w-10 text-primary mb-6" />
      </CardHeader>
      <CardContent>
        <CardDescription className="text-lg font-semibold mb-6 text-dark dark:text-white">
        &apos;{quote}&apos;
        </CardDescription>
      </CardContent>
      <CardFooter className="text-muted-foreground">- {author}</CardFooter>
    </Card>
  );
}

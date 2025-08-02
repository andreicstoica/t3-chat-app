"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Sparkles, MessageCircle, Image as ImageIcon } from "lucide-react";
import logo from "~/../public/logo.png";

export function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Header Section */}
      <div className="mb-12 space-y-6 text-center">
        <div className="mb-8 flex items-center justify-center">
          <Image
            src={logo}
            alt="Daily Tarot Logo"
            width={80}
            height={80}
            className="mr-4"
          />
          <h1 className="font-display mystical-text text-4xl font-bold tracking-tight sm:text-6xl">
            Daily Tarot
          </h1>
        </div>
        <p className="text-muted-foreground font-body mx-auto max-w-2xl text-xl leading-relaxed">
          Your personal AI companion for tarot reading insights and reflection.
          Discover deeper meanings in your daily draws.
        </p>
      </div>

      {/* Features Section */}
      <div className="mb-12 grid gap-6 sm:grid-cols-3">
        <Card className="tarot-border hover:mystical-glow group transition-all duration-300">
          <CardContent className="space-y-4 p-6">
            <MessageCircle className="text-primary mx-auto h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
            <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              Chat Guidance
            </div>
            <h3 className="font-display text-lg font-semibold">
              AI Chat Guidance
            </h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Get personalized interpretations and insights from our AI tarot
              reader
            </p>
          </CardContent>
        </Card>

        <Card className="tarot-border hover:mystical-glow group transition-all duration-300">
          <CardContent className="space-y-4 p-6">
            <ImageIcon className="text-primary mx-auto h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
            <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              Image Analysis
            </div>
            <h3 className="font-display text-lg font-semibold">
              Card Image Analysis
            </h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Upload photos of your tarot spreads for detailed analysis
            </p>
          </CardContent>
        </Card>

        <Card className="tarot-border hover:mystical-glow group transition-all duration-300">
          <CardContent className="space-y-4 p-6">
            <Sparkles className="text-primary mx-auto h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
            <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              Daily Reflection
            </div>
            <h3 className="font-display text-lg font-semibold">
              Daily Reflection
            </h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Build a practice of mindful reflection with your tarot journey
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="space-y-6 text-center">
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/signup">
            <Button
              size="lg"
              className="golden-glow font-display w-full transition-all duration-300 hover:scale-105 sm:w-auto"
            >
              Begin Your Journey
            </Button>
          </Link>
          <Link href="/signin">
            <Button
              variant="outline"
              size="lg"
              className="hover:mystical-glow font-display w-full transition-all duration-300 sm:w-auto"
            >
              Sign In
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground font-body text-sm italic">
          ✨ Start your mystical tarot journey today - free to get started ✨
        </p>
      </div>
    </div>
  );
}

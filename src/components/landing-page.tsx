"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import logo from "~/../public/logo.png";

// Animated SVG Component
function AnimatedSVG({
  src,
  width,
  height,
  className,
  delay = 0,
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
  delay?: number;
}) {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    fetch(src)
      .then((response) => response.text())
      .then((content) => {
        setSvgContent(content);
      })
      .catch(console.error);
  }, [src]);

  if (!svgContent) return null;

  return (
    <div
      className={`svg-container ${className}`}
      style={{ animationDelay: `${delay}s` }}
      dangerouslySetInnerHTML={{
        __html: svgContent.replace(
          /<svg[^>]*>/,
          `<svg width="${width}" height="${height}" class="svg-draw-in" style="animation-delay: ${delay}s">`,
        ),
      }}
    />
  );
}

export function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Animated SVG Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Cards SVG - Left Side */}
        <div
          className={`absolute top-1/4 -left-20 transition-all duration-[3000ms] ease-out ${
            mounted ? "scale-60 opacity-30" : "scale-20 opacity-10"
          }`}
        >
          <AnimatedSVG
            src="/home-svg/cards.svg"
            width={400}
            height={400}
            className="rotate-12 transform"
            delay={0.5}
          />
        </div>

        {/* Sun SVG - Right Side */}
        <div
          className={`absolute top-1/3 -right-32 transition-all duration-[3000ms] ease-out ${
            mounted ? "scale-100 opacity-25" : "scale-95 opacity-10"
          }`}
        >
          <AnimatedSVG
            src="/home-svg/sun.svg"
            width={500}
            height={500}
            className="rotate-6 transform"
            delay={1}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl space-y-8 text-center">
        {/* Logo and Title */}
        <div
          className={`transition-all duration-1000 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-6 flex items-center justify-center">
            <Image
              src={logo}
              alt="Daily Tarot Logo"
              width={50}
              height={50}
              className="mr-3 md:mr-4 md:h-[60px] md:w-[60px]"
            />
            <h1 className="font-display from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
              Daily Tarot
            </h1>
          </div>
        </div>

        {/* Main Description */}
        <div
          className={`transition-all duration-1000 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-muted-foreground font-body mb-2 text-lg leading-relaxed sm:text-xl md:text-2xl">
            Your personal AI companion for tarot reading insights and
            reflection.
          </p>
          <p className="text-muted-foreground/80 font-body text-base leading-relaxed sm:text-lg">
            Discover deeper meanings in your daily draws with intelligent
            guidance.
          </p>
        </div>

        {/* Call to Action */}
        <div
          className={`transition-all duration-1000 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="mb-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                className="font-display from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 w-full bg-gradient-to-r px-6 py-3 text-base shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto md:px-8 md:text-lg"
              >
                Begin Your Journey
              </Button>
            </Link>
            <Link href="/signin">
              <Button
                variant="outline"
                size="lg"
                className="font-display border-primary/30 text-primary hover:bg-primary/10 w-full px-6 py-3 text-base transition-all duration-300 hover:scale-105 sm:w-auto md:px-8 md:text-lg"
              >
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground/70 font-body text-sm italic">
            ✨ Start your mystical journey today - free to begin ✨
          </p>
        </div>
      </div>
    </div>
  );
}

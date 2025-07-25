"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Sparkles, MessageCircle, Image as ImageIcon } from "lucide-react";
import logo from "~/../public/logo.png";

export function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Mystical background elements */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 blur-2xl animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-4xl space-y-12 text-center relative z-10">
                {/* Hero Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-center gap-4">
                        <div className="golden-glow squircle p-3 shimmer">
                            <Image src={logo} alt="Daily Tarot Logo" width={60} height={60} className="breathe" />
                        </div>
                        <h1 className="text-4xl font-display font-bold tracking-tight sm:text-6xl mystical-text">
                            Daily Tarot
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
                        Your personal AI companion for tarot reading insights and reflection.
                        Discover deeper meanings in your daily draws.
                    </p>
                </div>

                {/* Features Section */}
                <div className="grid gap-6 sm:grid-cols-3">
                    <Card className="tarot-border hover:mystical-glow transition-all duration-300 group">
                        <CardContent className="p-6 space-y-4">
                            <MessageCircle className="h-10 w-10 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="font-display font-semibold text-lg">AI Chat Guidance</h3>
                            <p className="text-sm text-muted-foreground font-body leading-relaxed">
                                Get personalized interpretations and insights from our AI tarot reader
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="tarot-border hover:mystical-glow transition-all duration-300 group">
                        <CardContent className="p-6 space-y-4">
                            <ImageIcon className="h-10 w-10 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="font-display font-semibold text-lg">Card Image Analysis</h3>
                            <p className="text-sm text-muted-foreground font-body leading-relaxed">
                                Upload photos of your tarot spreads for detailed analysis
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="tarot-border hover:mystical-glow transition-all duration-300 group">
                        <CardContent className="p-6 space-y-4">
                            <Sparkles className="h-10 w-10 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="font-display font-semibold text-lg">Daily Reflection</h3>
                            <p className="text-sm text-muted-foreground font-body leading-relaxed">
                                Build a practice of mindful reflection with your tarot journey
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Call to Action */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="w-full sm:w-auto golden-glow hover:scale-105 transition-all duration-300 font-display">
                                Begin Your Journey
                            </Button>
                        </Link>
                        <Link href="/signin">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto hover:mystical-glow transition-all duration-300 font-display">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                    <p className="text-sm text-muted-foreground font-body italic">
                        ✨ Start your mystical tarot journey today - free to get started ✨
                    </p>
                </div>
            </div>
        </div>
    );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Sparkles, MessageCircle, Image as ImageIcon } from "lucide-react";
import logo from "~/../public/logo.png";

export function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-6">
            <div className="w-full max-w-4xl space-y-12 text-center">
                {/* Hero Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3">
                        <Image src={logo} alt="Daily Tarot Logo" width={60} height={60} />
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            Daily Tarot
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Your personal AI companion for tarot reading insights and reflection.
                        Discover deeper meanings in your daily draws.
                    </p>
                </div>

                {/* Features Section */}
                <div className="grid gap-6 sm:grid-cols-3">
                    <Card className="border-muted">
                        <CardContent className="p-6 space-y-3">
                            <MessageCircle className="h-8 w-8 text-primary mx-auto" />
                            <h3 className="font-semibold">AI Chat Guidance</h3>
                            <p className="text-sm text-muted-foreground">
                                Get personalized interpretations and insights from our AI tarot reader
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-muted">
                        <CardContent className="p-6 space-y-3">
                            <ImageIcon className="h-8 w-8 text-primary mx-auto" />
                            <h3 className="font-semibold">Card Image Analysis</h3>
                            <p className="text-sm text-muted-foreground">
                                Upload photos of your tarot spreads for detailed analysis
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-muted">
                        <CardContent className="p-6 space-y-3">
                            <Sparkles className="h-8 w-8 text-primary mx-auto" />
                            <h3 className="font-semibold">Daily Reflection</h3>
                            <p className="text-sm text-muted-foreground">
                                Build a practice of mindful reflection with your tarot journey
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Call to Action */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signin">
                            <Button size="lg" className="w-full sm:w-auto">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                Create Account
                            </Button>
                        </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Start your tarot journey today - it's free to get started
                    </p>
                </div>
            </div>
        </div>
    );
}
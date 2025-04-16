import CloseTabNotice from '@/components/app/CloseTabNotice/CloseTabNotice';
import LandingStepper from '@/components/app/LandingStepper/LandingStepper';
import Video from '@/components/app/Video/Video';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { validateRequest } from '@/lib/auth';
import { ArrowRight, Github, Sparkles, MessageCircle, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default async function Home() {
  const { user } = await validateRequest();
  return (
    <>
      <CloseTabNotice />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-linear-to-b from-background to-muted/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-6 text-center">
              <Badge className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Link
                  href="https://cloud-jblc9ujpj-hack-club-bot.vercel.app/0kooha-2024-12-22-23-23-29.mp4"
                  target="_blank"
                  className="flex items-center"
                >
                  <Sparkles className="mr-1 w-4 h-4" /> 
                  Now you can add team members! <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Badge>
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
                  User feedback for developers
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                  Save time and build better products with headless but streamlined feedback
                  collection that transforms how you understand your users.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="group">
                      Dashboard
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button size="lg" className="group">
                      Get started
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                )}
                <Link href="https://github.com/SrIzan10/echospace" target="_blank">
                  <Button variant="outline" size="lg" className="flex">
                    <Github className="w-4 h-4 mr-2" />
                    Open source!
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Abstract Decoration */}
          <div className="absolute -bottom-48 left-0 right-0 h-96 bg-linear-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-50" />
        </section>

        {/* Features Cards */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
              <Badge variant="outline" className="px-3 py-1">Why choose us?</Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Features designed for developers
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-[700px]">
                Everything you need to collect, analyze and act on user feedback
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl">Seamless Collection</h3>
                  <p className="text-muted-foreground">
                    Simple API integration lets you collect feedback without disrupting user experience
                  </p>
                </CardContent>
              </Card>
              
              <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl">Powerful Analytics</h3>
                  <p className="text-muted-foreground">
                    Turn feedback into actionable insights with our intuitive analysis tools
                  </p>
                </CardContent>
              </Card>
              
              <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl">GitHub Integration</h3>
                  <p className="text-muted-foreground">
                    Automatically create issues from feedback to streamline your development workflow
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
              <Badge className="px-3 py-1">How it works</Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Three simple steps to better products
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <LandingStepper
                steps={[
                  {
                    title: 'Create a project',
                    description:
                      'Create a project and invite your team members to start collecting feedback',
                    html: (
                      <Video
                        src="https://cloud-flt5r19p6-hack-club-bot.vercel.app/0kooha-2024-12-15-21-37-18.mp4"
                        autoPlay
                        muted
                        className="w-full bg-gray-200 dark:bg-gray-800 rounded-lg shadow-xl"
                      />
                    ),
                  },
                  {
                    title: 'Collect feedback',
                    description:
                      'Make a query to the API and create your own UI to collect user feedback',
                    html: (
                      <div className="rounded-lg shadow-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://cloud-81pelcjv5-hack-club-bot.vercel.app/0carbon_3_.png"
                          alt="Code example"
                          className="w-full rounded-lg"
                        />
                      </div>
                    ),
                  },
                  {
                    title: 'Improve your product',
                    description:
                      'Use the tools provided to analyze feedback and improve your product!',
                    html: (
                      <Card className="w-full h-64 flex items-center justify-center shadow-xl">
                        <CardContent>
                          <div className="flex flex-col items-center gap-4">
                            <Github className="h-10 w-10 text-primary" />
                            <p className="text-center">
                              The new GitHub integration will help you out with creating issues to
                              improve your project. It is as simple as installing an app and selecting a
                              repo!
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center bg-linear-to-r from-primary/5 to-secondary/5 p-8 rounded-xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to get started?</h2>
              <p className="text-muted-foreground md:text-lg max-w-[600px]">
                Join developers who are building better products with user feedback
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="group">
                      Go to dashboard
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button size="lg" className="group">
                      Get started for free
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
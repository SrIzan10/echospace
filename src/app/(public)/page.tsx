import CloseTabNotice from '@/components/app/CloseTabNotice/CloseTabNotice';
import LandingStepper from '@/components/app/LandingStepper/LandingStepper';
import Video from '@/components/app/Video/Video';
import { Button } from '@/components/ui/button';
import { validateRequest } from '@/lib/auth';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default async function Home() {
  const { user } = await validateRequest();
  return (
    <>
      <CloseTabNotice />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Link
                href="https://cloud-jblc9ujpj-hack-club-bot.vercel.app/0kooha-2024-12-22-23-23-29.mp4"
                target="_blank"
              >
                <div className="flex items-center rounded-lg px-3 py-1 text-sm bg-mantle">
                  Now you can add team members! <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Link>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  User feedback for developers
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Save time and build better products with headless but streamlined feedback
                  collection
                </p>
              </div>
              <div className="flex gap-5">
                {user ? (
                  <Link href="/dashboard">
                    <Button>Dashboard</Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button>Get started</Button>
                  </Link>
                )}
                <Link href="https://github.com/SrIzan10/echospace" target="_blank">
                  <Button variant="secondary" className="flex">
                    <Github className="w-4 h-4 mr-2" />
                    Open source!
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-mantle" id="features">
          <div className="container px-4 md:px-6">
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
                        className="w-full bg-gray-200 dark:bg-gray-800 rounded-lg"
                      />
                    ),
                  },
                  {
                    title: 'Collect feedback',
                    description:
                      'Make a query to the API and create your own UI to collect user feedback',
                    html: (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src="https://cloud-81pelcjv5-hack-club-bot.vercel.app/0carbon_3_.png"
                        alt="Code example"
                        className="w-full rounded-lg"
                      />
                    ),
                  },
                  {
                    title: 'Improve your product',
                    description:
                      'Use the tools provided to analyze feedback and improve your product!',
                    html: (
                      <div className="w-full h-64">
                        <p className="flex justify-center items-center text-center">
                          The new github integration will help you out with creating issues to
                          improve your project. It is as simple as installing an app and selecting a
                          repo!
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

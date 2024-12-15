'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormState } from 'react-dom';
import { createSchema, createSchemaType } from '@/lib/forms/zod';
import { create } from '@/lib/forms/actions';
import React from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/app/SubmitButton/SubmitButton';

// TODO: move form to the new universal form component
export default function ProfileForm() {
  const router = useRouter();
  const form = useForm<createSchemaType>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: '',
      description: '',
      github: '',
    },
  });

  const [formState, formAction] = useFormState(create, null);
  React.useEffect(() => {
    if (formState && formState.id) {
      router.push(`/project/${formState.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-md w-full p-4">
      <Form {...form}>
        <form
          action={formAction}
          onSubmit={form.handleSubmit((data) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
              formData.append(key, value);
            });
            formAction(formData);
          })}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project name</FormLabel>
                <FormControl>
                  <Input placeholder="Echospace" {...field} />
                </FormControl>
                <FormDescription>How the project is called.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="A developer-centric user feedback platform." {...field} />
                </FormControl>
                <FormDescription>Describe the project a bit.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Github</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/SrIzan10/echospace" {...field} />
                </FormControl>
                <FormDescription>Your Github repository link. Will come in handy for some integrations!</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton buttonText='Submit' className='w-full' />
        </form>
      </Form>
    </div>
    </div>
  );
}

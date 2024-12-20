// props to claude for helping out with typescript tomfoolery
// copyleft srizan tho
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Path, PathValue, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import type { UniversalFormProps } from './types';
import {
  customDataSchema,
  githubSettingsSchema,
  githubTestIssueSchema,
  projectSettingsSchema,
  ratelimitChangeSchema,
} from './zod';
import SubmitButton from '../SubmitButton/SubmitButton';
import { useActionState } from 'react';
import React from 'react';
import { toast } from 'sonner';
import { createSchema } from '@/lib/forms/zod';

export const schemaDb = [
  { name: 'projectSettings', zod: projectSettingsSchema },
  { name: 'ratelimitChange', zod: ratelimitChangeSchema },
  { name: 'customData', zod: customDataSchema },
  { name: 'create', zod: createSchema },
  { name: 'githubSettings', zod: githubSettingsSchema },
  { name: 'githubTestIssue', zod: githubTestIssueSchema },
] as const;

export function UniversalForm<T extends z.ZodType>({
  fields,
  schemaName,
  action,
  onActionComplete,
  defaultValues,
  submitText = 'Submit',
  submitClassname,
}: UniversalFormProps<T>) {
  const [state, formAction] = useActionState(action, null);
  const schema = schemaDb.find((s) => s.name === schemaName)?.zod;

  if (!schema) {
    throw new Error(`Schema "${schemaName}" not found`);
  }

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: (defaultValues || {}) as z.infer<T>,
  });

  // pretend nothing is happening on here
  React.useEffect(() => {
    // @ts-ignore
    if (state && !state.success) {
      // @ts-ignore
      toast.error(state.error);
    }
    if (state) {
      onActionComplete?.(state);
    }
  }, [state]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-2">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as Path<z.infer<T>>}
            defaultValue={field.value as PathValue<z.infer<T>, Path<z.infer<T>>>}
            render={({ field: formField }) => (
              <FormItem>
                {field.type !== 'hidden' && <FormLabel>{field.label}</FormLabel>}
                <FormControl>
                  <Input
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <SubmitButton buttonText={submitText} className={submitClassname} />
      </form>
    </Form>
  );
}

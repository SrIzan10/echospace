'use server';

import { openai } from '@/lib/ai';
import { validateRequest } from '@/lib/auth';
import { z } from 'zod';

const fillSchema = z.object({
  title: z.string(),
  message: z.string(),
});

export default async function fill(message: string) {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: 'You must be logged in to fill with AI' };
  }
  if (message === '') {
    return { success: false, error: 'Message cannot be empty' };
  }

  const aiResponse = await openai.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      {
        role: 'system',
        content:
          'You are an assistant that converts messages into professional Github issues. Return JSON with {title, message}. Keep responses clear and concise.',
      },
      {
        role: 'user',
        content: message,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const aiMsg = aiResponse.choices[0].message.content!;
  const zod = fillSchema.safeParse(JSON.parse(aiMsg));
  if (!zod.success) {
    return {
      success: false,
      error: `Couldn't parse AI response, got: ${aiMsg}, error: ${zod.error.errors[0].message}`,
    };
  }

  return { success: true, message: zod.data.message, title: zod.data.title };
}

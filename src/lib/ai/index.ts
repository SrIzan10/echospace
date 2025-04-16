import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    "HTTP-Referer": "https://echospace.dev",
    "X-Title": "Echospace",
  },
});
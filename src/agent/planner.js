import { client } from '../services/openai.js';

export async function runPlanner(input) {
  const res = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a productivity assistant.',
      },
      {
        role: 'user',
        content: input,
      },
    ],
  });

  return res.choices[0].message.content;
}

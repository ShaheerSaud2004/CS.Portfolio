// Requires: npm i openai dotenv
// Simple sanity check to verify the OPENAI_API_KEY from .env is working.
import 'dotenv/config';
import OpenAI from 'openai';

async function main() {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello' }
      ],
      max_tokens: 5
    });
    console.log('OpenAI response:', completion.choices[0].message.content.trim());
  } catch (err) {
    console.error('Error communicating with OpenAI API:', err.message);
  }
}

main(); 
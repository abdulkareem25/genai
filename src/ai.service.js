import { ChatMistralAI } from '@langchain/mistralai';
import { createAgent, HumanMessage, tool } from 'langchain';
import readline from 'readline/promises';
import * as z from 'zod';
import { sendEmail } from './mail.service.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatMistralAI({
  model: 'mistral-small-latest'
});

const sendEmails = tool(
  sendEmail,
  {
    name: 'sendEmail',
    description: 'Send an email to a specified recipient with a subject and HTML content.',
    schema: z.object({
      to: z.string().email(),
      subject: z.string(),
      html: z.string()
    })
  }
);

const agent = createAgent({
  model,
  tools: [sendEmails]
});


async function main() {

  const messages = [];

  while (true) {
    const userInput = await rl.question('You: ');

    if (userInput.toLowerCase() === 'exit') {
      console.log('Exiting...');
      process.exit(1);
      break;
    }

    messages.push(`Human: ${new HumanMessage(userInput).content}`);

    console.log('Current messages:', messages);

    console.log('last message content:', messages[messages.length - 1]);

    const response = await agent.invoke({
      messages
    });

    console.log('Raw response:', response);

    messages.push(`AI: ${response.messages[response.messages.length - 1].content}`);

    console.log('Assistant:', response.messages[response.messages.length - 1].content);
  }

  rl.close();
};

export default main;
import 'dotenv/config';
import express from 'express';
import main from './ai.service.js';

const app = express();

const mainFunction = async () => {
  try {
    await main();
  } catch (error) {
    console.error('Error in main function:', error);
  }
};

mainFunction();

export default app;
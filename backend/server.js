import express from 'express';
import { OpenAI } from "@langchain/openai";
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

//Add receipe API

app.listen(4000, () => {
  console.log('Backend server running on http://localhost:4000');
});

import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

// Langchain libraries
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Initialize OpenAI chat model
const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

// Memory + Conversation setup
const memory = new BufferMemory();
const conversation = new ConversationChain({
  llm: chatModel,
  memory: memory,
});

// Recipe prompt template
const recipePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a world-class chef. List the recipe for {input} and its price in bullet points. Keep it concise and conversational."],
  ["user", "{input}"],
]);

// Ingredient extraction prompt
const ingredientPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Extract only the ingredient list (with quantities) from this recipe. Respond in bullet point format."],
  ["user", "{getRecipe}"],
]);

const outputParser = new StringOutputParser();
const ingredientChain = ingredientPrompt.pipe(chatModel).pipe(outputParser);

// Extract ingredients from formatted response
const extractIngredients = (response) => {
  return response
    .split('\n')
    .filter(line => line.startsWith('-'))
    .map(line => line.slice(2).trim());
};

// Fetch price for a list of ingredients
const fetchPrices = async (ingredients) => {
  const requests = ingredients.map((item) => {
    const options = {
      method: 'GET',
      url: 'https://grocery-api2.p.rapidapi.com/amazon',
      params: { query: item },
      headers: {
        'x-rapidapi-key': process.env.PRICE_API_KEY,
        'x-rapidapi-host': 'grocery-api2.p.rapidapi.com',
      },
    };
    return axios.request(options).then(res => ({ item, data: res.data })).catch(() => ({ item, data: null }));
  });

  return Promise.all(requests);
};

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Aislo chatbot backend server!');
});

// Main recipe + pricing endpoint
app.post('/api/data', async (req, res) => {
  try {
    const formattedPrompt = await recipePrompt.format({ input: req.body.input });
    const recipeResponse = await conversation.call({ input: formattedPrompt });

    const ingredientText = await ingredientChain.invoke({ getRecipe: recipeResponse.response });
    const ingredients = extractIngredients(ingredientText);

    const priceResults = await fetchPrices(ingredients);

    res.json({
      message: recipeResponse.response,
      ingredients,
      prices: priceResults,
    });
  } catch (error) {
    console.error("Error in /api/data:", error);
    res.status(500).json({ message: "Error fetching recipe and prices." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

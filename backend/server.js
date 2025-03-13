import express, { response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

//Langchain libraries
import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser} from "@langchain/core/output_parsers";
const outputParser = new StringOutputParser();

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


//-----------Langchain implementation-----------//
const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
})

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a world class food recipe documentation writer.\n You list the reciepe for {input}(food) in bullet point format. You constraints are you give any additional details about the recipe such as instructions and only list out recipe"],
  //optional prompt: \n After the list for the {input}(food), you write a brief note to highlight the key points of the recipe or any additional information you think is important."
  ["user", "{input}"],
]);

const chain = prompt.pipe(chatModel).pipe(outputParser);

// const response = await chain.invoke({
//   input: "Best Chocolate Chip Cookies",
// });


const getRecipe = async (userInput)=> {
  console.log("Fetching data...")
  const response = await chain.invoke({
    input: userInput,
  });
  return response;
}

app.get('/', (req, res) => {
  res.send('Welcome to the Aislo chatbot backend server!');
})
// app.post('/api/data', (req, res) => {
//   const inputData = req.body.input;
//   const responseMessage = `Server received: ${inputData}`;
//   res.json({ message: responseMessage });
// });

app.post('/api/data', async (req, res) => {
  try {
    const responseMessage = await getRecipe(req.body.input);
    res.json({ message: responseMessage });
  } catch(error){
    console.error("Error fetching recipe: ", error);
    res.status(500).json({message: "Error fetching recipe"})
  }

});

app.listen(4000, () => {
  console.log('Backend server running on http://localhost:4000');
});

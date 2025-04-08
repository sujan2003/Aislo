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

//Getting the recipe using langchain prompting 
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a world class food chef.\n You list the reciepe for {input}(food) and its price in bullet point format. \n You can have nice converstation with the user. \n You have to be very concise and not use a lot of words."],
  ["user", "{input}"],
]);

//Extracting list of the ingredients to put it into an array
const promptForParsingOutRecipe = ChatPromptTemplate.fromMessages([
  ["system", "You will take out only the ingredients from the {getRecipe}, so I can put it into a list"],
  ["user", "{getRecipe}"]
]);

//chaining these promts with outputParser for better response format
const chain = prompt.pipe(chatModel).pipe(outputParser);

const chainForList = promptForParsingOutRecipe.pipe(chatModel).pipe(outputParser)

//Invoke(activate) the model to get the recipe
const getRecipe = async (userInput)=> {
  console.log("Fetching data...")
  const response = await chain.invoke({
    input: userInput,
  });
  return response;
}

//Invoke(active) the model to get the recipe in array(list)
const getRecipeInList = async(lis) => {
  const response = await chainForList.invoke({
    getRecipe: lis,
  })
  return response;
}

//Turning a plain string of recipe ingredients into an array
const extractIngredients = (response) => {
  // Split the string into lines
  const lines = response.split('\n');
  
  // Filter out the heading and empty lines
  const ingredients = lines
    .filter(line => line.startsWith('-')) // Keep only lines that start with '-'
    .map(line => line.slice(2).trim()); // Remove the '- ' and trim whitespace

  return ingredients;
};

//makes requests for each ingredients to get the price 
async function fetchPriceData(ingredientsList) {
  try {
    // Make parallel requests for all ingredients
    const responses = await Promise.all(
      ingredientsList.map((ingredient) =>
        axios.get('https://grocery-api2.p.rapidapi.com/amazon', {
          params: { query: ingredient },
          headers: {
            'x-rapidapi-key': process.env.PRICE_API_KEY,
            'x-rapidapi-host': 'grocery-api2.p.rapidapi.com'
          }
        })
      )
    );

    // Extract relevant data
    const priceData = responses
      .map((response) => response.data)
      .flat() // If API returns arrays inside responses, flatten them

    // Sort by price (assuming each item has a `price` property)
    const sortedPriceData = priceData.sort((a, b) => a.price - b.price);

    // Return the cheapest item
    return sortedPriceData.length > 0 ? sortedPriceData[0] : null;
  } catch (error) {
    console.error("Error fetching price data:", error);
    throw error;
  }
}

//Default endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Aislo chatbot backend server!');
})

//Set up endpoint for communicating with the frontend
app.post('/api/data', async (req, res) => {
  try {
    const responseMessage = await getRecipe(req.body.input);

    const testResponseM = await getRecipeInList(responseMessage);
    // console.log(testResponseM);

    const ingredientsList = extractIngredients(testResponseM);
    // console.log(ingredientsList);

    const priceData = await fetchPriceData(ingredientsList);
    console.log(priceData)


    res.json({ message: responseMessage });
  } catch(error){
    console.error("Error fetching recipe: ", error);
    res.status(500).json({message: "Error fetching recipe"})
  }

});

app.listen(4000, () => {
  console.log('Backend server running on http://localhost:4000');
});

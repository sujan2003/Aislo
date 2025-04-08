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
  ["system", "You are a world class food chef.\n You list the reciepe for {input}(food) and its price in bullet point format. \n You can have nice converstation with the user. \n You have to be very concise and not use a lot of words."],
  ["user", "{input}"],
]);

const promptForParsingOutRecipe = ChatPromptTemplate.fromMessages([
  ["system", "You will take out only the ingredients from the {getRecipe}, so I can put it into a list"],
  ["user", "{getRecipe}"]
]);

const chain = prompt.pipe(chatModel).pipe(outputParser);

const chainForList = promptForParsingOutRecipe.pipe(chatModel).pipe(outputParser)

const getRecipe = async (userInput)=> {
  console.log("Fetching data...")
  const response = await chain.invoke({
    input: userInput,
  });
  return response;
}
const getRecipeInList = async(lis) => {
  const response = await chainForList.invoke({
    getRecipe: lis,
  })
  return response;
}

//Price api implementation


async function fetchData() {
  const options = {
    method: 'GET',
    url: 'https://grocery-api2.p.rapidapi.com/amazon',
    params: {query: '- 1 ½ cups graham cracker crumbs'},
    headers: {
      'x-rapidapi-key': process.env.PRICE_API_KEY,
      'x-rapidapi-host': 'grocery-api2.p.rapidapi.com'
    }
  };
  try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}


  // const requests = items.map((element) => {
  //   const options = {
  //     method: 'GET',
  //     url: 'https://grocery-api2.p.rapidapi.com/amazon',
  //     params: { query: element },
  //     headers: {
  //       'x-rapidapi-key': process.env.PRICE_API_KEY,
  //       'x-rapidapi-host': 'grocery-api2.p.rapidapi.com'
  //     }
  //   };
  //   return axios.request(options);
  // });

  // try {
  //   const responses = await Promise.all(requests);
  //   console.log(response.length)
  //   responses.forEach(response => {
  //     console.log(response.data);
  //   });
  // } catch (error) {
  //   console.error(error);
  // }
}
// console.log(fetchData());


app.get('/', (req, res) => {
  res.send('Welcome to the Aislo chatbot backend server!');
})

app.post('/api/data', async (req, res) => {
  try {
    const responseMessage = await getRecipe(req.body.input);
    const testResponseM = await getRecipeInList(responseMessage);
    console.log(testResponseM);
    const extractIngredients = (response) => {
      // Split the string into lines
      const lines = response.split('\n');
      
      // Filter out the heading and empty lines
      const ingredients = lines
        .filter(line => line.startsWith('-')) // Keep only lines that start with '-'
        .map(line => line.slice(2).trim()); // Remove the '- ' and trim whitespace
    
      return ingredients;
    };
    
    const ingredientsList = extractIngredients(testResponseM);
    console.log(ingredientsList);


    res.json({ message: responseMessage });
  } catch(error){
    console.error("Error fetching recipe: ", error);
    res.status(500).json({message: "Error fetching recipe"})
  }

});

app.listen(4000, () => {
  console.log('Backend server running on http://localhost:4000');
});

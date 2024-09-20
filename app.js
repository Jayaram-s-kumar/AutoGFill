const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

const cors = require('cors');

app.use(bodyParser.json());
app.use(cors())
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("listening on port 3000")
})
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);



const details= `Jayaram S Kumar is a B. Tech student majoring in Computer Science at the
 College of Engineering and Management Punnapra. His CGPA is 6.5, and he has no backlogs.
  Jayaram's college register number is PRP20CS036, and his admission number is 20042CSPRP.
   His DWMS ID is KM01545831. He resides at Das bhavan, T.B Road, Kayamkulam, which is 
   also his permanent address, located in Alappuzha city with the pincode 690502. 
   This area falls under the Kayamkulam Panchayath/Municipality/Corporation. 
   Jayaram can be contacted at his mobile and WhatsApp number 7907144673,
    or via email at kumarjayaram545@gmail.com. His father, Sankar Kumar,
     and mother, Shyamala, can be reached at 9633994286. Jayaram's 
     college is situated in the city of Alappuzha.`


app.get('/',(req,res)=>{
  res.status(200).json({"message":"Autogfill server alive"})
})


app.post('/getans', async(req, res) => {
  const questArray = req.body;
  //await JSON.stringify(questArray)
  console.log('Received data:', questArray);
  const ansArray =await run(questArray)

  if (Array.isArray(questArray) && questArray.length > 0) {
    res.status(200).json({
      message: "Data received successfully",
      ans:ansArray
    });
  } else {
    res.status(400).json({ message: "Invalid data format. Expected non-empty array." });
  }
});

async function run(arr) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Stringify the arrays properly
  // const detailsString = JSON.stringify(details, null, 2);
  const arrString = JSON.stringify(arr, null, 2);

  const prompt = `Based on these details given:
${details}
Read the questions in the below array 
${arrString}

And give me an answers array (not object array) in this format: ["ans1","ans2","ans3"....] If you can't
find an ans for a question from the given details just give the ans as "unknown"`;

  console.log("Prompt:", prompt);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log("Response:", text);
  return text;
}

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



const details= [
  {"Name":"Jayaram s kumar"},
  {"mobile number":"7907144673"},
  {"whatusp number":"7907144673"},
  {"email":"kumarjayaram545@gmail.com"},
  {"Name of Panchayath/Municipality/Corporation":"kayamkulam"},
  {"Name of college":"College of Engineering and Management Punnapra"},
  {"Address":"Das bhavan, T.B Road, Kayamkulam"},
  {"City":"Alappuzha"},
  {"Pincode":"690502"},
  {"Fathers name":"Sankar kumar"},
  {"Mothers name":"Shyamala"},
  {"Parent's contact number":"9633994286"},
  {"Student's contact number":"7907144673"},
  {"Degree ":"B. Tech"},
  {"Branch":"Computer Science"},
  {"CGPA":"6.5"},
  {"If i have any backlogs?":"no"},
  {"DWMS id":"KM01545831"},
  {"College or University register number":"PRP20CS036"},
  {"College or University admission number":"20042CSPRP"},
  {"First name":"Jayaram"},
  {"Middle name":"S"},
  {"Last name":"Kumar"},
  {"Permenant address":"Das bhavan, T.B Road, Kayamkulam"},
  {"Residentail address":"Das bhavan, T.B Road, Kayamkulam"},

  
]



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
  const detailsString = JSON.stringify(details, null, 2);
  const arrString = JSON.stringify(arr, null, 2);

  const prompt = `Based on these details given:
${detailsString}
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
// run();
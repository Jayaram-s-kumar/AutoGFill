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

const details = [
  { "Email *": "example@example.com" },
  { "Name of the Institution *": "XYZ College of Engineering" },
  { "Name of the concerned faculty *": "Prof. Anil Sharma" },
  { "Email Id (faculty) *": "anil.sharma@xyzcollege.edu" },
  { "Phone No (faculty) *": "+91 98765 43210" },
  { "Name of Participant 1 *": "Aarti Sharma" },
  { "Participant 1- Current Course which you are pursuing (eg: B.Tech, B.Com) *": "B.Tech" },
  { "Participant 1 - Gender *": "Female" },
  { "Participant 1 - Contact Number *": "+91 99887 65432" },
  { "Participant 1 - Email-id *": "aarti.sharma@xyzcollege.edu" },
  { "Name of Participant 2 *": "Ravi Patel" },
  { "Participant 2- Current Course which you are pursuing (eg: B.Tech, B.Com) *": "B.Com" },
  { "Participant 2- Gender *": "Male" },
  { "Participant 2- Contact Number *": "+91 99988 77665" },
  { "Participant 2- Email-id *": "ravi.patel@xyzcollege.edu" },
  { "Zone (Please choose a zone based on the location of your institution) *": "North Zone" }
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

  const prompt = `Based on these details:
${detailsString}

Read the questions in this array:
${arrString}

And give me an answers array (not object array) in this format: [ans1,ans2,ans3....]`;

  console.log("Prompt:", prompt);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log("Response:", text);
  return text;
}
// run();
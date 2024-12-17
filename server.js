const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const upload = multer({ dest: 'uploads/' });

let extractedText = ""; // Store PDF content globally for querying

app.use(express.json());
app.use(express.static('public'));

// Upload PDF Route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    extractedText = data.text; // Save the extracted text for querying
    console.log("Extracted Text: ", extractedText); // Debug log
    res.json({ success: true, message: "PDF processed and stored successfully." });
    fs.unlinkSync(filePath); // Clean up uploaded PDF file
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Query Route: General query processing
app.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    console.log("Received query:", query); // Log the received query

    // Check if the query is related to Google Generative AI
    if (query.toLowerCase().includes('generate')) {
      const response = await generateContent(query);
      res.json({
        success: true,
        answer: response.data.choices[0].text, // Return the generated content
      });
    } 
    // Check if the query is related to the extracted PDF content
    else if (extractedText && query.trim().length > 0) {
      const answer = searchPDFContent(query);
      res.json({
        success: true,
        answer: answer || "No relevant information found in the PDF.",
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid query. Please ask about content generation or PDF content.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Function to generate content using Google Generative AI
async function generateContent(query) {
  try {
    const response = await axios.post(
      'https://generativeai.googleapis.com/v1/models/gemini-1.5-flash:predict', // Correct endpoint for Gemini model
      {
        prompt: query,
        temperature: 0.7,
        max_output_tokens: 150,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`, // Use your API key
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error(`Error generating content: ${error.message}`);
  }
}

// Function to search for query in the extracted PDF content
function searchPDFContent(query) {
  const lowerQuery = query.toLowerCase().trim(); // Normalize the query by converting to lowercase and trimming
  const lowerText = extractedText.toLowerCase().trim(); // Normalize the extracted text

  // Handle common question phrases and remove them (like "What is", "Who is")
  const questionWords = ["what is", "who is", "where is", "how is", "define"];
  let searchQuery = lowerQuery;

  // Remove question word prefix from the query if it starts with one of the common question words
  questionWords.forEach(word => {
    if (lowerQuery.startsWith(word)) {
      searchQuery = lowerQuery.replace(word, "").trim(); // Remove the question word part
    }
  });

  // Search for partial matches using regular expression for better flexibility
  const regex = new RegExp(searchQuery, 'i'); // Case-insensitive search
  const match = lowerText.match(regex);

  if (match) {
    // Extract a larger snippet from the PDF content (adjust the snippet range)
    const index = match.index;
    const snippetStart = Math.max(0, index - 100);  // Start 100 characters before the query
    const snippetEnd = Math.min(extractedText.length, index + match[0].length + 100); // End 100 characters after the query
    return extractedText.substring(snippetStart, snippetEnd);
  }

  return null;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

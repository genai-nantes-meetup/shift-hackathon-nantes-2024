const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3003; // Change the port to 3000

// Set up the views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(express.json());

// Define the API endpoint URL
const apiUrl = 'http://localhost:5700/generate_response';

// Render the index page
app.get('/', (req, res) => {
  res.render('index');
});

// Handle the form submission
app.post('/generate', async (req, res) => {
  try {
    const text = req.body.text;

    // Send a POST request to the FastAPI endpoint
    const response = await axios.post(apiUrl, { text });

    // Extract the generated image and prompt from the response
    const image = response.data.image;
    const prompt = response.data.prompt;

    // Render the result page with the generated image and prompt
    res.render('result', { image, prompt });
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    res.status(500).send('An error occurred');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

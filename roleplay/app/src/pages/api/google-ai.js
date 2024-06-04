// pages/api/google-ai.js

import axios from 'axios';

export default async function handler(req, res) {
  const data = req.body;

  try {
      const response = await axios.post('https://roleplaygeneration-lslehgspwq-ew.a.run.app/generate_response', { data });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Error generating response:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}

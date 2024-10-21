const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());


const port = 5000;

// Multer setup to store uploaded files
const upload = multer({ dest: 'uploads/' });

// POST route to handle image upload and call Gemini API
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imagePath = path.join(__dirname, req.file.path);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await axios.post('https://api.gemini.com/v1/image-caption', {
      image: base64Image,
    }, {
      headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` },
    });

    // Clean up the uploaded file
    fs.unlinkSync(imagePath);

    res.status(200).json({ caption: response.data.caption });
  } catch (error) {
    console.error('Error generating caption:', error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

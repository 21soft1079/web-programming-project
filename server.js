const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}


app.get('/memberships', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'memberships.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading memberships:', error);
    res.status(500).json({ error: 'Failed to load memberships' });
  }
});

app.post('/submit', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'submissions.json');
    let submissions = [];

    if (fs.existsSync(filePath)) {
      submissions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    submissions.push(req.body);
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));
    
    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).send('Error saving data');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
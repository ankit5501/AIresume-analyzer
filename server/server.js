// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ======== Storage Setup ========
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ======== Resume Upload & ATS Scoring ========
app.post('/api/upload', upload.single('resume'), async (req, res) => {
  const jobTitle = req.body.jobTitle;

  if (!req.file || !jobTitle) {
    return res.status(400).json({ message: 'Missing file or job title' });
  }

  try {
    const filePath = path.join(uploadDir, req.file.filename);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const resumeText = data.text;

    // Keyword matching
    const jobKeywords = jobTitle.toLowerCase().split(/\s+/);
    const matchedKeywords = [];
    const missingKeywords = [];

    jobKeywords.forEach((keyword) => {
      if (resumeText.toLowerCase().includes(keyword)) {
        matchedKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    });

    // ATS scoring
    const totalSections = 5;
    let sectionsMatched = 0;

    if (resumeText.includes('Education')) sectionsMatched++;
    if (resumeText.includes('Experience') || resumeText.includes('Projects'))
      sectionsMatched++;
    if (resumeText.includes('Skills')) sectionsMatched++;
    if (resumeText.includes('Intern')) sectionsMatched++;
    if (resumeText.includes('Contact') || resumeText.includes('Email'))
      sectionsMatched++;

    const keywordScore = (matchedKeywords.length / jobKeywords.length) * 100;
    const structureScore = (sectionsMatched / totalSections) * 100;
    const atsScore = Math.round((keywordScore + structureScore) / 2);

    // ======== Suggestions ========
    const suggestions = [];
    if (missingKeywords.length > 0) {
      suggestions.push(
        `Add these missing keywords to match the job role: ${missingKeywords.join(
          ', '
        )}.`
      );
    }
    if (structureScore < 100) {
      suggestions.push(
        'Ensure your resume has all main sections: Education, Experience/Projects, Skills, Internships, and Contact Information.'
      );
    }
    if (atsScore < 70) {
      suggestions.push(
        'Consider using simpler formatting and clear headings to improve ATS readability.'
      );
    }
    if (suggestions.length === 0) {
      suggestions.push('Your resume is well-structured and matches the job keywords.');
    }

    res.json({
      message: 'Resume analyzed successfully',
      filename: req.file.originalname,
      extractedText: resumeText,
      matchedKeywords,
      missingKeywords,
      matchPercentage: Math.round(keywordScore),
      atsScore,
      suggestions,
    });

    // Clean up
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to process resume PDF' });
  }
});

// ======== Feedback Feature ========
let feedbackList = [];

app.post('/api/feedback', (req, res) => {
  const { name, feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ message: 'Feedback is required' });
  }

  feedbackList.push({
    name: name || 'Anonymous',
    feedback,
    date: new Date(),
  });

  res.json({ message: 'Thank you for your feedback!' });
});

app.get('/api/feedback', (req, res) => {
  res.json(feedbackList);
});

// ======== Start Server ========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

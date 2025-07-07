require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai')
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors());

app.use(express.json()); // ✅ This is what’s missing!
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Storage config
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// API route
// const pdfParse = require('pdf-parse');

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

    // Keyword Matching
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

    const matchPercentage = Math.round((matchedKeywords.length / jobKeywords.length) * 100);

    // ATS Score
    let score = 0;
    const totalSections = 5;
    let sectionsMatched = 0;

    if (resumeText.includes('Education')) sectionsMatched++;
    if (resumeText.includes('Experience') || resumeText.includes('Projects')) sectionsMatched++;
    if (resumeText.includes('Skills')) sectionsMatched++;
    if (resumeText.includes('Intern')) sectionsMatched++;
    if (resumeText.includes('Contact') || resumeText.includes('Email')) sectionsMatched++;

    const keywordScore = (matchedKeywords.length / jobKeywords.length) * 100;
    const structureScore = (sectionsMatched / totalSections) * 100;
    score = Math.round((keywordScore + structureScore) / 2);

    // Send Response
    res.json({
      message: 'File uploaded and parsed',
      filename: req.file.originalname,
      extractedText: resumeText,
      matchedKeywords,
      missingKeywords,
      matchPercentage,
      atsScore: score,
       aiAdvice :`
🧠 Resume Improvement Tips:
1. Use clear section headings like "Experience", "Education", "Skills", and "Projects".
2. Optimize your resume with keywords from the job description — e.g. "${missingKeywords.slice(0, 3).join(', ')}".
3. Keep resume concise (1–2 pages max), use professional fonts like Roboto or Calibri.
4. Add metrics to achievements — "Increased traffic by 30%" is better than "Worked on SEO".
5. Include a summary/profile section tailored to "${jobTitle}".
6. Use reverse-chronological order and bullet points for clarity.
7. Double-check for grammar, spelling, and consistency (dates, tenses, punctuation).
`,
    });


  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ message: 'Failed to process resume PDF' });
  }
});


// START server
app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});

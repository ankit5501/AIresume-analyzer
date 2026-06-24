# Resume Analyzer

## Overview

Resume Analyzer is an AI-powered web application that helps job seekers optimize their resumes by analyzing content, identifying strengths and weaknesses, and providing actionable suggestions. The platform compares resumes against job descriptions, calculates compatibility scores, and highlights areas for improvement to increase the chances of passing Applicant Tracking Systems (ATS).

## Features

* Upload resumes in PDF or DOCX format
* Extract and analyze resume content
* ATS compatibility scoring
* Job description matching
* Skill gap analysis
* Keyword optimization suggestions
* Resume section evaluation
* Detailed feedback and recommendations
* User-friendly dashboard
* Responsive design for desktop and mobile devices

## Tech Stack

### Frontend

* React.js / Next.js
* Tailwind CSS
* TypeScript
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI & Analysis

* OpenAI API / Gemini API
* Natural Language Processing (NLP)

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

### Install Dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd server
npm install
```

### Configure Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_api_key
JWT_SECRET=your_secret_key
```

### Run the Application

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

The application will be available at:

```text
Frontend: http://localhost:3000
Backend: http://localhost:5000
```

## How It Works

1. User uploads a resume.
2. The system extracts text from the document.
3. AI analyzes the resume structure, skills, experience, and keywords.
4. The resume is compared against a selected job description.
5. A compatibility score is generated.
6. Detailed recommendations are provided to improve the resume.

## Project Structure

```text
resume-analyzer/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── package.json
│
├── .env
├── README.md
└── package.json
```

## Future Enhancements

* AI-generated resume rewriting
* Cover letter generation
* Interview preparation assistant
* Resume templates
* Multi-language support
* LinkedIn profile analysis



For questions, suggestions, or contributions, please open an issue or contact the maintainer.

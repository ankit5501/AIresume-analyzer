import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4ade80', '#f87171']; // green, red

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    if (!file || !jobTitle) {
      setError('Please provide both job title and resume PDF');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobTitle', jobTitle);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setResult(res.data);
    } catch (err) {
      setError('Upload or analysis failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-3xl border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">📄 AI Resume Analyzer</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Job Title (e.g. Frontend Developer)"
            value={jobTitle}
            onChange={handleJobTitleChange}
            className="w-full border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded shadow-sm"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
          >
            Upload & Analyze
          </button>
        </form>

        {error && (
          <div className="text-red-600 mt-4 bg-red-100 p-3 rounded text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6 text-sm text-gray-800">
            <div>
              <strong>📎 Uploaded:</strong> {result.filename}
            </div>

            <div>
              <strong>📌 Match Percentage:</strong> {result.matchPercentage}%
            </div>

            {/* Pie Chart for ATS Score */}
            {result.atsScore !== undefined && (
              <div>
                <h3 className="font-semibold text-lg mb-2">📊 ATS Score Overview</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Matched', value: result.atsScore },
                          { name: 'Unmatched', value: 100 - result.atsScore },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        label
                      >
                        <Cell fill={COLORS[0]} />
                        <Cell fill={COLORS[1]} />
                      </Pie>
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-600 mt-2">
                    Your resume matches {result.atsScore}% of the job criteria.
                  </p>
                </div>
              </div>
            )}

            {/* Matched Keywords */}
            {Array.isArray(result.matchedKeywords) && (
              <div>
                <h3 className="font-semibold">✔️ Matched Keywords</h3>
                <p className="text-green-600">
                  {result.matchedKeywords.length > 0
                    ? result.matchedKeywords.join(', ')
                    : 'No keywords matched'}
                </p>
              </div>
            )}

            {/* Missing Keywords */}
            {Array.isArray(result.missingKeywords) && (
              <div>
                <h3 className="font-semibold">❌ Missing Keywords</h3>
                <p className="text-red-600">
                  {result.missingKeywords.length > 0
                    ? result.missingKeywords.join(', ')
                    : 'No missing keywords 🎉'}
                </p>
              </div>
            )}

            {/* Mock AI Advice */}
            {result.aiAdvice && (
              <div className="mt-6 bg-gray-100 p-4 border-l-4 border-blue-400 rounded">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">🧠 Resume Tips</h3>
                <pre className="whitespace-pre-wrap text-sm">{result.aiAdvice}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;

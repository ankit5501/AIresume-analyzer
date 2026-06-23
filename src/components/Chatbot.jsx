import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/chat", { prompt });
      setResponse(res.data.reply);
    } catch (err) {
      setResponse("⚠️ Error connecting to chatbot.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">🤖 Resume Advisor Chatbot</h2>
      <textarea
        className="w-full p-2 border rounded mb-2"
        rows="4"
        placeholder="Ask me how to improve your resume..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
      {response && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm whitespace-pre-wrap">
          <strong>AI says:</strong><br />{response}
        </div>
      )}
    </div>
  );
};

export default Chatbot;

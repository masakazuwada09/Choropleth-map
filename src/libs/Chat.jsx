import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiKey = 'sk-fobISfK8fE2fbhcrAqrIaKc_koKJs_QKTrrFBZxSLZT3BlbkFJaSXLG4QFe5QcdDJ_GiiA3ORr5u5-WhcC5y6OcDRnMA'; // Add your OpenAI API key here
    const prompt = input;

    try {
      const result = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',  // Example model
          prompt: prompt,
          max_tokens: 100,           // Adjust based on your use case
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

    setResponse(result.data.choices[0].text.trim());
    } catch (error) {
      console.error('Error calling OpenAI API', error);
    }
  };

  return (
    <div className=" flex flex-col ml-[70px] p-4 ">
      <form onSubmit={handleSubmit} className="mb-4">
        <label className="block mb-2">
          Enter your question:
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="border rounded p-2 w-full"
          />
        </label>
        <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
          Ask AI
        </button>
      </form>
      {response && (
        <div className="response bg-gray-100 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">AI Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Chat;

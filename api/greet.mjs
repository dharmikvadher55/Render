import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = "AIzaSyDEDNIwl3aMAT5l_Q-_SOWlFUyNY-d1UBE"; // Ensure API key is set in environment variables

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { message, sessionId, history } = req.body;

      if (!message || typeof message !== 'string' || !sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ error: 'Message and sessionId are required and must be strings' });
      }

      // Ensure history is an array
      const chatHistory = Array.isArray(history) ? history : [];

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ];

      const instructions = `Imagine you're a helpful but impatient older brother...`;

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 80,
          responseMimeType: "text/plain",
        },
        systemInstruction: instructions,
        safetySettings,
      });

      // Create a new chat instance
      const chat = await model.startChat({ history: chatHistory });

      // Send message and get response
      const result = await chat.sendMessage(message);
      const responseText = await result.response.text();

      return res.status(200).json({ response: responseText });

    } catch (error) {
      console.error('Error in handler:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

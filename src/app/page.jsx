"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef(null);
  const handleFinish = useCallback((message) => {
    setStreamingMessage("");
    setLoading(false);
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
  }, []);
  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    const initializeChat = async () => {
      const systemMessage = {
        role: "system",
        content: `You are the official BIOMACHINE assistant. Your task is to conduct a short 5-question interview and then provide personalized recommendations.

Communication order:
1. Greet the client and introduce yourself as BIOMACHINE assistant.

2. Ask these 5 questions sequentially (one at a time):
   1) 'What is your name and how old are you?'
   2) 'What is your main goal? (e.g.: energy, sleep, sports, focus, immunity)'
   3) 'Do you have any health issues or contraindications?'
   4) 'Describe your lifestyle (work, physical activity, stress)'
   5) 'Are you currently taking any vitamins or supplements?'

3. After receiving the answer to the last question, provide recommendations STRICTLY in the following format:

Thank you for your answers! Based on the information provided, I have prepared personalized recommendations:

📋 Personal Recommendations:

1️⃣ [Supplement Name]
━━━━━━━━━━━━━━━
🎯 Benefits:
• [point 1]
• [point 2]
• [point 3]

💊 Dosage: [dosage]

💡 Tip: [usage tip]

[next supplement in the same format]

4. After providing recommendations, ask: "Do you have any questions about the recommended supplements?"

Important rules:
- Strictly follow the recommendation format with emojis and separators
- Only recommend supplements from the official BIOMACHINE catalog
- Consider age, goals, and contraindications when making recommendations
- Communicate in a friendly and professional manner`,
      };

      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [systemMessage],
          stream: true,
        }),
      });
      handleStreamResponse(response);
    };

    initializeChat();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are the official VitaGoal assistant. Your task is to conduct a short 5-question interview and then provide personalized recommendations.

Communication order:
1. Greet the client and introduce yourself as VitaGoal assistant.

2. Ask these 5 questions sequentially (one at a time):
   1) 'What is your name and how old are you?'
   2) 'What is your main goal? (e.g.: energy, sleep, sports, focus, immunity)'
   3) 'Do you have any health issues or contraindications?'
   4) 'Describe your lifestyle (work, physical activity, stress)'
   5) 'Are you currently taking any vitamins or supplements?'

3. After receiving the answer to the last question, provide recommendations STRICTLY in the following format:

Thank you for your answers! Based on the information provided, I have prepared personalized recommendations:

📋 Personal Recommendations:

1️⃣ [Supplement Name]
━━━━━━━━━━━━━━━
🎯 Benefits:
• [point 1]
• [point 2]
• [point 3]

💊 Dosage: [dosage]

💡 Tip: [usage tip]

[next supplement in the same format]

4. After providing recommendations, ask: "Do you have any questions about the recommended supplements?"

Important rules:
- Strictly follow the recommendation format with emojis and separators
- Only recommend supplements from the official VitaGoal catalog
- Consider age, goals, and contraindications when making recommendations
- Communicate in a friendly and professional manner`,
            },
            ...messages,
            userMessage,
          ],
          stream: true,
        }),
      });
      handleStreamResponse(response);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen bg-gray-50"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 8px 16px at 50% 50%, rgba(220, 38, 38, 0.03) 0%, transparent 100%),
          radial-gradient(ellipse 8px 16px at 80% 20%, rgba(220, 38, 38, 0.03) 0%, transparent 100%),
          radial-gradient(ellipse 12px 24px at 20% 70%, rgba(220, 38, 38, 0.02) 0%, transparent 100%),
          radial-gradient(ellipse 10px 20px at 65% 85%, rgba(220, 38, 38, 0.03) 0%, transparent 100%),
          linear-gradient(60deg, rgba(229, 231, 235, 0.2) 1px, transparent 0),
          linear-gradient(-60deg, rgba(229, 231, 235, 0.2) 1px, transparent 0)
        `,
        backgroundSize:
          "100px 100px, 120px 120px, 140px 140px, 160px 160px, 60px 60px, 60px 60px",
        backgroundPosition: "0 0, 50px 50px, -30px 30px, 70px -40px, 0 0, 0 0",
      }}
    >
      <div className="flex flex-col h-full">
        <div className="bg-white/90 backdrop-blur-sm shadow-sm p-4 border-b border-gray-200">
          <div className="max-w-3xl mx-auto flex items-center justify-center">
            <h1 className="text-2xl font-bold font-inter">
              <span className="text-gray-800">BIO</span>
              <span className="text-red-700">MACHINE</span>
            </h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg shadow-sm backdrop-blur-sm ${
                    message.role === "user"
                      ? "bg-gray-700/95 text-white"
                      : "bg-white/95 text-gray-800"
                  }`}
                >
                  <p className="text-sm font-inter whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-white/95 shadow-sm backdrop-blur-sm">
                  <p className="text-sm font-inter text-gray-800 whitespace-pre-wrap">
                    {streamingMessage}
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t border-gray-200 p-4 bg-white/90 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Enter your message..."
                className="flex-1 p-2 border border-gray-300 rounded-md 
             bg-white/80 text-gray-800
             font-inter text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500
             backdrop-blur-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className={`px-4 py-2 rounded-md font-inter text-sm 
              ${
                loading || !inputMessage.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-800"
              } text-white transition-colors duration-200`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
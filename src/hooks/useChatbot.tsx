// route for chatbot
import { useState, useEffect } from "react";
import axios from "axios";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("messages");
    setMessages(JSON.parse(stored ?? "[]"));
  }, []);

  const sendMessage = async (message: string) => {
    const newMessages: Message[] = [
      ...messages,
      { text: message, sender: "user" },
    ];
    // add the user message
    setMessages(newMessages);
    setLoading(true);
    // add a ... bot message
    setMessages([...newMessages, { text: "...", sender: "bot" }]);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an accounting professor that only responds to accounting questions, and you use a chill, informal tone. Respond as a professor would.",
            },
            { role: "user", content: message },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const botMessage = response.data.choices[0].message.content;
      // replace the ... with real bot message
      setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
      localStorage.setItem(
        "messages",
        JSON.stringify([...newMessages, { text: botMessage, sender: "bot" }])
      );
    } catch (error) {
      console.error("error in request", error);
    } finally {
      setLoading(false);
    }
  };
  return { messages, sendMessage, loading };
};

export default useChatbot;

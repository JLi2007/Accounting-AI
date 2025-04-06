import { useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { TbBusinessplan } from "react-icons/tb";
import useChatbot from "../hooks/OpenAI";
import Markdown from "react-markdown"; //use to format messages properly such as /n
import useChatScroll from "../hooks/chatScroll";

interface Props {
  className: string;
}

export default function Chatbot({ className }: Props) {
  const { messages, sendMessage } = useChatbot();
  const [input, setInput] = useState<string>("");
  const ref = useChatScroll(messages);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col h-full bg-white">
        <h2 className="p-2 mt-1 font-semibold text-sm text-center bg-blue-100 flex text-blue-800 justify-center items-center gap-2">
          <TbBusinessplan size={20} /> accounting chatbot{" "}
          <TbBusinessplan size={20} />
        </h2>
        <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              <Markdown>{msg.text}</Markdown>
            </div>
          ))}
        </div>
        <div className="flex items-center p-4 bg-gray-50">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg focus:outline-none"
            placeholder="message"
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button onClick={handleSend} className="p-2 cursor-pointer">
            <LuSendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

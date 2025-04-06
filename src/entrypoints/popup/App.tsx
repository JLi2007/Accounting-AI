import { useState } from "react";
import Chatbot from "@/components/Chatbot";
import account from "../../assets/account.png";

function App() {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);

  return (
    <div className="relative font-open">
      {showInfo && (
        <div className="absolute z-10 top-0 left-0 w-[90%] h-[90%] bg-white text-black p-4 overflow-auto rounded shadow-lg m-4">
          <h2 className="text-xl font-bold mb-2">How This Works</h2>
          <ul className="list-disc pl-5 space-y-1 text-left">
            <li>Click "Analyze Page" to scan and extract key data.</li>
            <li>Data is processed using AI (via OpenAI).</li>
            <li>
              Results may be inserted back into the page or shown in the UI.
            </li>
            <li>Optional: connect with Google Sheets for saving/output.</li>
          </ul>
          <button
            onClick={() => setShowInfo(false)}
            className="mt-4 underline text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
      {showChatbot && (
        <div className="absolute z-10 top-0 left-0 w-[97.5%] h-[97.5%] bg-white text-black px-1 overflow-auto rounded shadow-lg m-1">
          <button
            onClick={() => setShowChatbot(false)}
            className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Close
          </button>
          <Chatbot className="h-[94vh]"/>
        </div>
      )}

      <div className="relative bg-[#242424] text-white min-w-[100px] min-h-[100px] w-[500px] h-[600px] text-center">
        <div className="flex p-4 justify-center flex-col">
          <h1 className="font-bold text-xl">Accounting AI Extension</h1>
          <h2 className="font-bold text-base mt-1">Powered by OpenAI</h2>
        </div>
        <div className="p-4 flex flex-col items-center justify-center">
          <button className="bg-slate-500 p-4 my-5 w-50 cursor-pointer hover:bg-slate-500/90 transition delay-200 duration-100 ease-in-out rounded-sm">
            Analyze Page
          </button>
          <button
            className="bg-slate-500 p-4 my-5 w-50 cursor-pointer hover:bg-slate-500/90 transition delay-200 duration-100 ease-in-out rounded-sm"
            onClick={() => setShowChatbot(true)}
          >
            Accounting Chatbot
          </button>
        </div>
        <div className="w-full justify-center flex items-center h-1/3">
          <img src={account} alt="logo" className="w-[80%]"/>
        </div>
        <div className="absolute bottom-3 w-full flex justify-center">
          <button
            className="bg-slate-500/30 px-5 p-1 cursor-pointer hover:bg-slate-500/20 transition delay-200 duration-100 ease-in-out underline rounded-sm"
            onClick={() => setShowInfo(true)}
          >
            how does this work?
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

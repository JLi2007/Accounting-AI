import { useState } from "react";
import Chatbot from "@/components/Chatbot";
import { DropdownComponent } from "@/components/Dropdown";
import { getAuthToken } from "./google/api";
import {
  createSheet,
  getGoogleProfile,
  getDriveFolders,
  getDriveSheets,
} from "./google/drive_functions";
import { readAllSheetsData, openAIProcessingAllSheets } from "./google/sheets_functions";
import { IoIosReturnLeft, IoMdLink } from "react-icons/io";
import { SiGooglesheets } from "react-icons/si";
import account from "../../assets/account.png";
import sheets from "../../assets/sheets.png";

function App() {
  // pages state
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [showAnalyze, setShowAnalyze] = useState<boolean>(false);
  const [showCreateSheet, setShowCreateSheet] = useState<boolean>(false);
  const [showSelectSheet, setShowSelectSheet] = useState<boolean>(false);
  const [showAnalyzeSheet, setShowAnalyzeSheet] = useState<boolean>(false);

  // auth state
  const [isAuthToken, setIsAuthToken] = useState<boolean>(false);
  const [firstSignin, setfirstSignin] = useState<boolean>(true);

  // info state
  const [sheetName, setSheetName] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<any>();
  const [selectedFolderID, setSelectedFolderID] = useState<any>();
  const [selectedSheet, setSelectedSheet] = useState<any>();
  const [selectedSheetID, setSelectedSheetID] = useState<any>();
  const [folderData, setFolderData] = useState<any>();
  const [sheetData, setSheetData] = useState<any>();

  async function initAnalyzePage() {
    console.log("[BROWSER] analyzing page");
    browser.runtime.sendMessage({ action: "analyzingPage" });

    // reset token on first signin --> remove in the future?
    if (firstSignin) {
      localStorage.removeItem("authToken");
      setfirstSignin(false);
    }
    console.log("initial token:", localStorage.getItem("authToken"));

    // check if user has already signed in
    let token = localStorage.getItem("authToken");

    if (token === null) {
      try {
        token = await getAuthToken();
        localStorage.setItem("authToken", token);
        setIsAuthToken(true);
      } catch (err) {
        console.warn("User cancelled auth:", err);
        setIsAuthToken(false);
        return;
      }
    }
    setIsAuthToken(true);

    // fetch from google userinfo
    const googleFetch = await getGoogleProfile();
    // set profile picture
    document.getElementById("pfp")?.setAttribute("src", googleFetch.picture);

    // fetches drive folders
    const folders = await getDriveFolders(googleFetch.email.toString());
    console.log("folders fetched, should be an array ", folders);
    setFolderData(folders);
    // fetches drive sheets
    fetchDriveSheets();
  }

  async function fetchDriveSheets() {
    const sheets = await getDriveSheets();
    console.log("sheets from drive", sheets);
    setSheetData(sheets);
  }

  return (
    <div className="relative font-open">
      {showInfo && (
        <div className="absolute z-30 top-0 left-0 w-[97.5%] h-[97.5%] bg-white text-black p-4 overflow-auto rounded shadow-lg m-1.5">
          <h2 className="text-xl font-bold mb-2">How Accounting AI Works</h2>
          <ul className="p-1 space-y-3 pt-5 text-left text-sm">
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
        <div className="absolute z-30 top-0 left-0 w-[97.5%] h-[97.5%] bg-stone-800/50 backdrop-blur-lg text-black px-1 overflow-auto rounded shadow-lg m-1">
          <button
            onClick={() => setShowChatbot(false)}
            className="underline text-blue-600 hover:text-blue-800 cursor-pointer flex flex-row absolute top-2.5"
          >
            <IoIosReturnLeft size={20} /> Back
          </button>
          <Chatbot className="h-full w-full" />
        </div>
      )}

      {showAnalyze && (
        <div
          className={`absolute z-30 top-0 left-0 w-[97.5%] h-[97.5%] bg-[#242424CC] backdrop-blur-lg  text-white px-1 overflow-auto rounded shadow-lg m-1 ${
            showCreateSheet ? "blur-sm pointer-events-none" : "backdrop-blur-lg"
          }`}
        >
          <button
            onClick={() => {
              setShowAnalyze(false);
              setShowCreateSheet(false);
            }}
            className="underline text-blue-600 hover:text-blue-800 cursor-pointer flex flex-row absolute top-2.5"
          >
            <IoIosReturnLeft size={20} /> Back
          </button>
          {isAuthToken === false && (
            <button
              onClick={initAnalyzePage}
              className="absolute top-2.5 right-1 p-1"
            >
              Sign in with Google
            </button>
          )}
          <img id="pfp" className="absolute top-1 right-2 w-9" />
          <div className="w-full h-full flex flex-col items-center justify-center">
            <button
              className={`p-5 w-[60%] border border-white my-2 ${
                !isAuthToken || folderData === null
                  ? "!cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                setShowCreateSheet(true);
              }}
            >
              CREATE spreadsheet
            </button>
            <button
              className={`p-5 w-[60%] border border-white my-2 ${
                !isAuthToken || folderData === null
                  ? "!cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                setShowSelectSheet(true);
              }}
            >
              SELECT spreadsheet
            </button>
            <button
              className={`p-5 w-[60%] border border-white my-2 ${
                !isAuthToken || folderData === null
                  ? "!cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
              onClick={async() => {
                setShowAnalyzeSheet(true);
                await openAIProcessingAllSheets(selectedSheetID);
                setShowAnalyzeSheet(false);
              }}
            >
              ANALYZE sheet
            </button>
            <div className="my-3" id="status"></div>
            <div className="flex flex-row items-center justify-center">
              <IoMdLink className="mr-1" />{" "}
              {selectedSheet
                ? "selected sheet: " + `${selectedSheet}`
                : "no selected sheet"}
            </div>
          </div>
        </div>
      )}

      {showCreateSheet && (
        <div className="absolute z-40 backdrop-blur-2xl w-[75%] h-[50%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg">
          <div className="flex items-center w-full flex-col justify-center h-full text-emerald-100">
            <input
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              className="w-[75%] bg-emerald-400/50 m-1 mt-5 p-2 placeholder:text-emerald-100 rounded-sm focus:outline-none focus:ring-0 focus:border-none"
              placeholder="sheet name"
            />
            <div className="my-3">
              <DropdownComponent
                type="folder"
                data={folderData}
                onSelectItem={setSelectedFolder}
                onSelectItemID={setSelectedFolderID}
              />
            </div>
            <div className="flex flex-row items-center justify-center my-3">
              <SiGooglesheets className="mr-1" /> selected folder:{" "}
              {selectedFolder}
            </div>
            <button
              onClick={() => {
                createSheet(sheetName, selectedFolderID, selectedFolder);
                setTimeout(() => setShowCreateSheet(false), 1000);
                fetchDriveSheets(); // re-fetch the sheets including the new sheet
              }}
              className="p-2 px-4 bg-emerald-400/60 my-3 rounded-sm hover:bg-emerald-400/80 transition ease-in-out duration-300"
            >
              create
            </button>
            <button
              className="absolute justify-center items-center top-1 left-1 p-1 w-10 aspect-square text-white text-xl rounded-full hover:bg-stone-400/15 transition ease-in-out delay-150 duration-500"
              onClick={() => setShowCreateSheet(false)}
            >
              x
            </button>
          </div>
        </div>
      )}

      {showSelectSheet && (
        <div className="absolute z-40 backdrop-blur-2xl w-[75%] h-[50%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg">
          <div className="flex items-center w-full flex-col justify-center h-full text-emerald-100">
            <div className="my-3">
              <DropdownComponent
                type="sheet"
                data={sheetData}
                onSelectItem={setSelectedSheet}
                onSelectItemID={setSelectedSheetID}
              />
            </div>
            <div className="flex flex-row items-center justify-center my-3">
              <IoMdLink className="mr-1" /> selected sheet: {selectedSheet}
            </div>
            <button
              onClick={() => {
                setTimeout(() => setShowSelectSheet(false), 500);
              }}
              className="p-2 px-4 bg-emerald-400/60 my-3 rounded-sm hover:bg-emerald-400/80 transition ease-in-out duration-300"
            >
              select
            </button>
            <button
              className="absolute justify-center items-center top-1 left-1 p-1 w-10 aspect-square text-white text-xl rounded-full hover:bg-stone-400/15 transition ease-in-out delay-150 duration-500"
              onClick={() => setShowSelectSheet(false)}
            >
              x
            </button>
          </div>
        </div>
      )}

      {showAnalyzeSheet && (
        <div className="absolute z-40 backdrop-blur-2xl w-[75%] h-[50%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg">
          <div className="flex items-center w-full flex-col justify-center h-full text-emerald-100">
            {/* loading bar */}
            <div className="flex justify-center items-center">
              <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-[#242424] text-white min-w-[100px] min-h-[100px] w-[500px] h-[600px] text-center">
        <div className="absolute right-[-100px] z-10 w-100 rounded-full blur-sm">
          <img
            className="w-full h-full object-contain"
            src={sheets}
            alt="google sheets"
          />
        </div>
        <div className="absolute z-20 inset-0">
          <div className="flex p-4 justify-center flex-col">
            <h1 className="font-bold text-2xl">Accounting AI Extension</h1>
            <h2 className="font-bold text-base mt-1">Powered by OpenAI</h2>
          </div>
          <div className="p-4 flex flex-col items-center justify-center">
            <button
              className="bg-slate-500/80 p-4 my-5 w-50 cursor-pointer hover:bg-slate-500/90 transition delay-200 duration-100 ease-in-out rounded-sm drop-shadow-[0_5px_5px_rgba(15,157,88,0.5)]"
              onClick={() => {
                initAnalyzePage();
                setShowAnalyze(true);
              }}
            >
              Analyze Page
            </button>
            <button
              className="bg-slate-500/80 p-4 my-5 w-50 cursor-pointer hover:bg-slate-500/90 transition delay-200 duration-100 ease-in-out rounded-sm drop-shadow-[0_5px_5px_rgba(15,157,88,0.5)]"
              onClick={() => setShowChatbot(true)}
            >
              Accounting Chatbot
            </button>
          </div>
          <div className="w-full justify-center flex items-center h-1/3">
            <img src={account} alt="logo" className="w-[80%]" />
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
    </div>
  );
}

export default App;

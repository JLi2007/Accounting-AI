export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  
  browser.runtime.onMessage.addListener(async (message: any) => {
    if (message.action === "analyzingPage") {
      console.log('[background] page analyze called')

      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("[background] querying tabs")
        const url = tabs[0].url!;
        const allowed = /https:\/\/(docs\.google\.com\/spreadsheets|drive\.google\.com)/.test(url);
        if (!allowed) {
          console.log('not on correct scope (drive, sheets)');
          // localStorage.setItem("scope", "correct");
        }
        else{
          console.log('on correct scope');
          // localStorage.setItem("scope", "incorrect");
        }
      });
    }
  });
  return true;
});

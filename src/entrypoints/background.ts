export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  
  browser.runtime.onMessage.addListener(async (message: any) => {
    if (message.action === "getToken") {
      console.log('[background] get token called')
    }

    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url!;
      const allowed = /https:\/\/(docs\.google\.com\/spreadsheets|drive\.google\.com)/.test(url);
      if (!allowed) {
        console.log('not on correct scope (drive, sheets)')
      }
      else{
        console.log('on correct scope')
      }
    });
  });
});

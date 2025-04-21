export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  
  browser.runtime.onMessage.addListener(async (message: any) => {
    if (message.action === "getToken") {
      console.log('get token???')
    }
  });
});

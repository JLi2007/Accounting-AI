export default defineContentScript({
  matches: ['*://docs.google.com/spreadsheets/*'],
  main() {
    console.log('Hello content from Google Sheets.');
  },
});
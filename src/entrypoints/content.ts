export default defineContentScript({
  matches: ['*://docs.google.com/spreadsheets/*'],
  main() {
    // console.log('On Google Sheets --> should have functionality');
  },
});
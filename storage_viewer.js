//alert(window.localStorage.getItem('se:fkey'));
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  alert(JSON.stringify(msg));

   if (msg.action == 'SendIt') {
      alert(window.localStorage.getItem('se:fkey'));
   }
});

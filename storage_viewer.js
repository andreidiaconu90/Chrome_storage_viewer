//alert(window.localStorage.getItem('se:fkey'));
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
   if (msg.action == 'SendIt') {
      alert(window.localStorage.getItem('se:fkey'));
   }
});

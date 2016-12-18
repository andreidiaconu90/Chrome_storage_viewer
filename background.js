// chrome.browserAction.onClicked.addListener(function(tab) {
// chrome.tabs.executeScript(null, {file: "storage_viewer.js"});
// });
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.storage.local.get(['localStorageKeys','sessionStorageKeys'], function(result) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
       chrome.tabs.sendMessage(tabs[0].id, result, function(response) {});
    });
  });
      // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      //    chrome.tabs.sendMessage(tabs[0].id, {action: "SendIt"}, function(response) {});
      // });

});

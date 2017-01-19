chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.local.get(['keysToTrack', 'extensionState'], function(result) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, result, function(response) {});
        });
    });
});
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  chrome.storage.local.set({
      "extensionState": ""
  });
});

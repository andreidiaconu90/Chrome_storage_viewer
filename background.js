chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.local.get(['localStorageKeys', 'sessionStorageKeys', 'extensionState'], function(result) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, result, function(response) {});
        });
    });
});

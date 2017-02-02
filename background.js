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
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.storage.local.set({
        "extensionState": ""
    });
});

chrome.runtime.onInstalled.addListener(function(object) {
    if (object.reason === "install") {
        chrome.tabs.create({
            'url': 'chrome://extensions/?options=' + chrome.runtime.id
        });
    }
    if (object.reason === "update") {
        //check if stored keys have type set. If not set it to "ALL"
        var keysToSave = [];
        chrome.storage.local.get(['keysToTrack', 'extensionState'], function(result) {
            result.keysToTrack.forEach(function(key) {
                console.log(key._type);
                if (key._type === undefined) {
                    var newKey = {
                        "_key": key._key,
                        "_isJson": key._isJson,
                        "_value": key._value,
                        "_type": "4"
                    }
                    keysToSave.push(newKey);
                }else
                {
                  keysToSave.push(key);
                }
            });
            chrome.storage.local.set({
                'keysToTrack': keysToSave,
            });
        });
    }
});

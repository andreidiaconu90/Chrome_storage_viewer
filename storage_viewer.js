chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    var htmlRows = "";
    if (msg.extensionState === "open") {
        chrome.storage.local.set({
            "extensionState": ""
        });
        $("#extensionOverlay").remove();
        return false;
    }
    $.each(msg.keysToTrack, function(index, key) {
        if (key._isJson === true) {
            var path = key._value;
            var value = JSON.parse(localStorage.getItem(key._key));
            var jsonValue = Object.byString(value, key._value);
            var result = path + " : " + jsonValue;

            var keyHtml = "<p>" + key._value + "</p>";
            var valueHtml = jsonValue;
            var htmlRow = "<tr><td style='padding: 0 20px 0 5px;'>" + keyHtml + "</td><td style='padding: 0 20px 0 5px;'>" + valueHtml + "</td></tr>";
          htmlRows += htmlRow;
        } else {

        }
    });

    var html = '<div id="extensionOverlay"' +
        ' style="position: fixed;' +
        'top: 0;' +
        'right:0;' +
        'line-height: 2;' +
        'color:white;' +
        'text-align: center;' +
        'font-size: 15px;' +
        'font-family: sans-serif;' +
        'font-weight: bold;' +
        'background: rgba(54, 25, 25, .5);"><table><tr><th style="padding: 0 20px 0 5px;">Key</th><th style="padding: 0 20px 0 5px;">Value</th></tr>' + htmlRows + '</table></div>';
    chrome.storage.local.set({
        'extensionState': "open",
    });
    $($.parseHTML(html)).appendTo('body');
});

Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

const EXTENSION_OVERLAY_HTML = '<div id="extensionOverlay"' +
    ' style="position: fixed;' +
    'top: 10px;' +
    'right:5px;' +
    'color:white;' +
    'font-size: 12px;' +
    'font-family: sans-serif;' +
    'font-weight: bold;' +
    'border-radius:10px;' +
    'background: rgba(54, 25, 25, .5);"></div>'
const NO_OPTIONS_CONFIGURED = '<p style="padding: 8px 5px 0 5px;">No options defined.<br/>Right click on the extension icon and click Options</p>'

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    displayOverlay(msg, sender, sendResponse);
});
document.addEventListener("click", function(event) {
    var element = event.target;
    if (element.id == "Refresh") {
        chrome.storage.local.get(['keysToTrack', 'extensionState'], function(result) {
            var isRefresh = true;
            var isSuccess = displayOverlay(result, undefined, 'isRefresh');

            if (isSuccess) {
                // Update status to let user know options were refrehed.
              showMessage("refresh");
            }
        });
    } else if (element.id === "copyToClipboard") {
        copyToClipboard(element);
        showMessage("copy");
    }
});

function displayOverlay(msg, sender, sendResponse) {
    var extensionOverlay = EXTENSION_OVERLAY_HTML;

    if (sender && msg.extensionState === "open") {
        chrome.storage.local.set({
            "extensionState": ""
        });
        $("#extensionOverlay").remove();
        return false;
    } else {
        $("#extensionOverlay").remove();
    }
    $($.parseHTML(extensionOverlay)).appendTo('body');
    var htmlRows = generateHtmlRows(msg.keysToTrack);

    if (msg.keysToTrack === undefined && htmlRows === "") {
        var noOptionsConfigured = NO_OPTIONS_CONFIGURED;
        $($.parseHTML(noOptionsConfigured)).appendTo('#extensionOverlay');
    } else {
        var refreshButtonUrl = chrome.extension.getURL('Refresh-20.png');
        var table = '<table style="margin-top:7px;margin-bottom:7px:"><tr style="border-bottom:1pt solid white;">' +
            '<th style="padding:3px 10px 0 10px">Key</th>' +
            '<th style="padding:3px 5px 0 10px">Value</th>' +
            '<th style="padding-right:8px"><div style="width:20px;height:20px;display:block;background:url(' + refreshButtonUrl + ');float: right;cursor:pointer;"id="Refresh"></div></th>' +
            '</tr>' + htmlRows +
            '</table><i id="refreshMessage" style="display=none;"></i>'+
            '<i id="copyMessage" style="display=none;"></i>';

        $($.parseHTML(table)).appendTo('#extensionOverlay');
    }
    chrome.storage.local.set({
        'extensionState': "open",
    });
    return true;
}
Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
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
function showMessage(trigger){
  var element = "";
  var message = "";
  if(trigger === "refresh")
  {
    element = document.getElementById('refreshMessage');
    message = "Data has been refreshed!";
  }
  else if(trigger === "copy"){
    element = document.getElementById('copyMessage');
    message = "Copied!";
  }
  element.textContent = message;
  element.style.display = "block";
  element.style.padding = "5px 20px 5px 5px";
  setTimeout(function() {
      element.textContent = '';
      element.style.display = "none";
      element.style.padding = "0";
  }, 1000);
}

function generateHtmlRows(keysToTrack) {
    var htmlRows = "";
    var copyButtonUrl = chrome.extension.getURL('Copy-15.png');
    $.each(keysToTrack, function(index, key) {
        if (key._isJson === true) {
            var jsonValue = "";
            var path = key._value;
            var value = JSON.parse(localStorage.getItem(key._key));
            if (value !== null) {
                jsonValue = Object.byString(value, key._value);
            } else {
                jsonValue = "parent is undefined";
            }
            var keyHtml = "<p style='margin:0'>" + key._value + "</p>";
            var valueHtml = jsonValue;
            var htmlRow = "<tr><td style='padding:3px 10px 0 10px'>" + keyHtml + "</td><td class='valueCell'style='padding:3px 5px 0 10px'>"+
                                "<input type='text' style='background:none;border:none;width: 100%' value='" + valueHtml + "'readonly/>"+
                              "</td>"+
                              "<td style='padding:0 10px 0 10px'><div id='copyToClipboard' style='width:15px;height:15px;display:block;background:url("+copyButtonUrl+");cursor:pointer;'></div></td></tr>";
            htmlRows += htmlRow;
        } else {
            var keyHtml = "<p  style='margin:0'>" + key._key + "</p>";
            var valueHtml =  localStorage.getItem(key._key);
            var htmlRow = "<tr><td style='padding:3px 10px 0 10px'>" + keyHtml + "</td><td class='valueCell'style='padding:3px 5px 0 10px'>"+
                                  "<input type='text' style='background:none;border:none;width: 100%' value='" + valueHtml + "'readonly/>"+
                               "</td>"+
                               "<td style='padding:0 10px 0 10px'><div id='copyToClipboard' style='width:15px;height:15px;display:block;background:url("+copyButtonUrl+");cursor:pointer;padding:0 5px 0 10px'></div></tr>";
            htmlRows += htmlRow;
        }
    });
    return htmlRows;
}

function copyToClipboard(e) {
    $(e).parent().parent().find('.valueCell').find("input").select();
    document.execCommand('copy');
    $(e).parent().parent().find('.valueCell').find("input").blur();
}

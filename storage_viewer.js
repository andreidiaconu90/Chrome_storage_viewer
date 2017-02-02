const EXTENSION_OVERLAY_HTML = '<div id="extensionOverlay"' +
    'style="position: fixed !important;' +
    'top: 10px !important;' +
    'right:5px !important;' +
    'color:white !important;' +
    'font-size: 12px !important;' +
    'font-family: sans-serif !important;' +
    'font-weight: bold !important;' +
    'border-radius:10px !important;' +
    'font-family:Helvetica !important;' +
    'background: rgba(54, 25, 25, .5) !important;z-index: 888888888888  !important;"></div>';
const NO_OPTIONS_CONFIGURED = '<p style="padding: 8px 5px 0 5px;!important">No options defined.<br/>Right click on the extension icon and click Options</p>'
const OVERLAY_TABLE_STYLE = "margin-top:7px !important;margin-bottom:7px !important";
const OVERLAY_TABLE_ROW_STYLE = "border-bottom:1pt solid white !important";
const OVERLAY_TABLE_HEADER_STYLE = "padding:3px 10px 0 10px !important";
const OVERLAY_REFRESH_BUTTON_STYLE = "width:20px !important;height:20px !important;display:block !important;float: right !important;cursor:pointer !important;";
const OVERLAY_COPY_BUTTON_STYLE = "width:15px;height:15px;display:block;cursor:pointer;";
const VALUE_INPUT_STYLE = "background:none;border:none;width: 100%;color:white !important;font-family:Helvetica !important;";
var selectedType = {
    None: "0",
    LocalStorage: "1",
    SessionStorage: "2",
    Cookie: "3",
    All: "4"
};


chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    displayOverlay(msg, sender, sendResponse);
});

document.addEventListener("keypress", function(event) {
    var key = event.which || event.keyCode;
    var element = event.target;
    if (element.className === "inputValue" && key === 13) {
        saveUpdatedValue(element);
    }
});

document.addEventListener("click", function(event) {
    var element = event.target;
    if (element.id == "Refresh") {
        chrome.storage.local.get(['keysToTrack', 'extensionState'], function(result) {
            var isRefresh = true;
            var isSuccess = displayOverlay(result, undefined, 'isRefresh');

            if (isSuccess) {
                showMessage("refresh");
            }
        });
    } else if (element.className === "copyToClipboard") {
        copyToClipboard(element);
        showMessage("copy");
    } else if (element.className === "removeKey") {
        removeKey(element);
    } else if (element.className === "editValue") {
        editValue(element);
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
    injectBalloons();
    var htmlRows = generateHtmlRows(msg.keysToTrack);

    if ((msg.keysToTrack === undefined || msg.keysToTrack.length === 0) && htmlRows === "") {
        var noOptionsConfigured = NO_OPTIONS_CONFIGURED;
        $($.parseHTML(noOptionsConfigured)).appendTo('#extensionOverlay');
    } else {
        var refreshButtonUrl = chrome.extension.getURL('Refresh-20.png');
        var table = '<table style="' + OVERLAY_TABLE_STYLE + '"><tr style="' + OVERLAY_TABLE_ROW_STYLE + '">' +
            '<th></th>' +
            '<th style="' + OVERLAY_TABLE_HEADER_STYLE + '">Key</th>' +
            '<th style="' + OVERLAY_TABLE_HEADER_STYLE + '">Value</th>' +
            '<th></th>' +
            '<th style="padding-right:8px !important"><div style="' + OVERLAY_REFRESH_BUTTON_STYLE + ';background:url(' + refreshButtonUrl + ');"id="Refresh"></div></th>' +
            '</tr>' + htmlRows +
            '</table><i id="refreshMessage" style="display=none;"></i>' +
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

function showMessage(trigger) {
    var element = "";
    var message = "";
    if (trigger === "refresh") {
        element = document.getElementById('refreshMessage');
        message = "Data has been refreshed!";
    } else if (trigger === "copy") {
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
    $.each(keysToTrack, function(index, key) {
        if (key._isJson === true) {
            var jsonValue = "";
            var value = getItemFromStorage(key);
            var path = key._value;
            if (value) {
                jsonValue = Object.byString(JSON.parse(value), key._value);
            } else {
                jsonValue = "parent is undefined";
            }
            var keyHtml = "<p class='key' style='margin:0'>" + key._value + "</p>";
            htmlRows += generateHtml(keyHtml, jsonValue, false, key._type);
        } else {
            var keyHtml = "<p class='key' style='margin:0'>" + key._key + "</p>";
            var valueHtml = getItemFromStorage(key);
            if (key._type === selectedType.Cookie || key._type === selectedType.All) {
                htmlRows += generateHtml(keyHtml, valueHtml, false, key._type);
            } else {
                htmlRows += generateHtml(keyHtml, valueHtml, true, key._type);
            }
        }
    });
    return htmlRows;
}

function getItemFromStorage(key) {
    var value = "";
    if (key._type === selectedType.LocalStorage) {
        value = localStorage.getItem(key._key);
    }
    if (key._type === selectedType.SessionStorage) {
        value = sessionStorage.getItem(key._key);

    }
    if (key._type === selectedType.Cookie) {
        var regex = new RegExp("(?:(?:^|.*;\\s*)" + key._key + "\\s*\\=\\s*([^;]*).*$)|^.*$");
        value = document.cookie.replace(regex, "$1");
    }
    if (key._type === selectedType.All) { //if All is selected look in all storage locations and return the first key to match
        if (localStorage.getItem(key._key) !== null) {
            value = localStorage.getItem(key._key);
        } else if (sessionStorage.getItem(key._key) !== null) {
            value = sessionStorage.getItem(key._key);
        } else {
            var regex = new RegExp("(?:(?:^|.*;\\s*)" + key._key + "\\s*\\=\\s*([^;]*).*$)|^.*$");
            value = document.cookie.replace(regex, "$1");
        }
    }
    return value;
}

function generateHtml(keyHtml, valueHtml, showDelete, keyLocation) {
    var copyButtonUrl = chrome.extension.getURL('Copy-15.png');
    var deleteButtonUrl = chrome.extension.getURL('Delete-15.png');
    var editButtonUrl = chrome.extension.getURL('Edit-15.png');
    var html = " " +
        "<td style='" + OVERLAY_TABLE_HEADER_STYLE + "'>" + keyHtml + "</td><td class='valueCell'style='padding:3px 5px 0 10px'>" +
        "<input type='text'class='inputValue' style='" + VALUE_INPUT_STYLE + "'; value='" + valueHtml + "'readonly />" +
        "</td>" +
        "<td style='padding:0 10px 0 10px'>" +
        "<div class='editValue' style='" + OVERLAY_COPY_BUTTON_STYLE + "background:url(" + editButtonUrl + ")'></div>" +
        "</td>" +
        "<td style='padding:0 10px 0 10px'>" +
        "<div class='copyToClipboard' style='" + OVERLAY_COPY_BUTTON_STYLE + "background:url(" + copyButtonUrl + ")'></div>" +
        "</td>" +
        "<td style='display:none'><p class='keyLocation'>" + keyLocation + "</p></td>";

    if (showDelete) {
        var button = "<td style='padding:0 10px 0 10px'>" +
            "<div class='removeKey' style='" + OVERLAY_COPY_BUTTON_STYLE + "background:url(" + deleteButtonUrl + ")'></div>" +
            "</td>";
        html = button + html;
    } else {
        var button = "<td>&nbsp;</td>"
        html = button + html;
    }
    html = "<tr>" + html + "<tr>";
    return html;
}

function removeKey(e) {
    var keyToRemove = $(e).parent().parent().find("p:not(.keyLocation)").text();
    var keyLocation = $(e).parent().parent().find("p.keyLocation").text();
    if (keyLocation == selectedType.LocalStorage) {
        localStorage.removeItem(keyToRemove);
    }
    if (keyLocation == selectedType.SessionStorage) {
        sessionStorage.removeItem(keyToRemove);
    }
    $("#Refresh").click();
}

function copyToClipboard(e) {
    $(e).parent().parent().find('.valueCell').find("input").select();
    document.execCommand('copy');
    $(e).parent().parent().find('.valueCell').find("input").blur();
}

function editValue(e) {
    var editedInput = $(e).parent().parent().find('input[readonly]');
    $(editedInput).removeAttr('style').attr("readonly", false).css('color', 'black');
    $(editedInput).after('<p class="storage_viewer_tooltip" style="font-size:10px">Press Enter to save changes');
    $(editedInput).focus().select();
}

function saveUpdatedValue(e) {
    var editedInput = $(e).parent().parent().find('input[class="inputValue"]');
    var newValue = $(editedInput).val();
    var editedKey = $(e).parent().parent().find('p.key').text();
    var keylocation = $(e).parent().parent().find('p.keyLocation').text();
    if (keylocation === selectedType.LocalStorage) {
        localStorage.setItem(editedKey, newValue);
    }
    if (keylocation === selectedType.SessionStorage) {
        sessionStorage.setItem(editedKey, newValue);
    }
    if (keylocation === selectedType.Cookie) {
        document.cookie = editedKey + "=" + newValue;
    }
    if (keylocation === selectedType.All) {
        if (localStorage.getItem(editedKey) !== null) {
            localStorage.setItem(editedKey, newValue);
        } else if (sessionStorage.getItem(editedKey) !== null) {
            sessionStorage.setItem(editedKey, newValue);
        } else {
            var regex = new RegExp("(?:(?:^|.*;\\s*)" + editedKey + "\\s*\\=\\s*([^;]*).*$)|^.*$");
            value = document.cookie.replace(regex, "$1");
            if (value !== null) {
                document.cookie = editedKey + "=" + newValue;
            }
        }
    }
    $(editedInput).attr('style', VALUE_INPUT_STYLE);
    $(editedInput).parent().find('.storage_viewer_tooltip').remove();
    $('#Refresh').click();
}

function injectBalloons() {
    var path = chrome.extension.getURL('balloon.min.css');
    $('head').append($('<link>')
        .attr("rel", "stylesheet")
        .attr("type", "text/css")
        .attr("href", path));
}
//do not remove as it caould be useful in the future
// function refreshSavedOptionsAndRefreshOverlay(keyToRemove, keyLocation) {
//     var savedKeys = [];
//     var keysToRemove = [];
//     chrome.storage.local.get('keysToTrack', function(result) {
//         savedKeys = result.keysToTrack;
//         $.each(result.keysToTrack, function(index, key) {
//             if (key._key === keyToRemove && key._type === keyLocation) {
//                 keysToRemove.push(index);
//             }
//         });
//         $.each(keysToRemove, function(index, key) {
//             savedKeys.splice(key, 1);
//         });
//         chrome.storage.local.set({
//             'keysToTrack': savedKeys,
//         }, function() {
//             var result = {
//                 extensionState: "open",
//                 keysToTrack: savedKeys
//             }
//             displayOverlay(result, undefined, 'isRefresh');
//         });
//
//     });
//
// }

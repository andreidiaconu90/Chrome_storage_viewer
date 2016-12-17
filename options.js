// Saves options to chrome.storage
function save_options() {
    var localStorageKeys = [];
    var sessionStorageKeys = [];
    document.getElementById('localStorage').querySelectorAll('*[id^="localStorage_Key"]').forEach(function(element) {
        localStorageKeys.push(element.value);
    });
    document.getElementById('sessionStorage').querySelectorAll('*[id^="sessionStorage_Key"]').forEach(function(element) {
        sessionStorageKeys.push(element.value);
    });
    chrome.storage.local.set({
        'localStorageKeys': localStorageKeys,
        'sessionStorageKeys': sessionStorageKeys
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.local.get('localStorageKeys', function(result) {
        $.each(result.localStorageKeys, function(index, value) {
            var inputFields = $('#localStorage').find("input");
            $.each(inputFields, function(index, input) {
                if ($(input).val() == "") {
                    $(input).val(value);
                    //skip iteration
                    return false;
                }
            });
        });
    });
}

function show_saved_options() {
    var stuff = "";
    chrome.storage.local.get(null, function(items) {
        for (key in items) {
            console.log(key);
        }
    });
}



function clear_options() {
    chrome.storage.local.clear();
    $("input").val("");
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('clear').addEventListener('click',
    clear_options);
document.getElementById('show').addEventListener('click',
    restore_options);

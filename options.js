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
    chrome.storage.local.get(['localStorageKeys', 'sessionStorageKeys'], function(result) {
        fillStorageKeyInputs(result.localStorageKeys, "localStorage");
        fillStorageKeyInputs(result.sessionStorageKeys, "sessionStorage");
    });
}

function fillStorageKeyInputs(storageKeys, tableToFill) {
    $.each(storageKeys, function(index, value) {
        var inputFields = $('#' + tableToFill).find("input");
        $.each(inputFields, function(index, input) {
            if ($(input).val() == "") {
                $(input).val(value);
                //skip iteration
                return false;
            }
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

function changeHandler(e) {
    if (e.target.checked) {
        $(e.target).parent().parent().find('input[id^="localStorage_ValuePath"]').parent().show();
    } else {
        $(e.target).parent().parent().find('input[id^="localStorage_ValuePath"]').parent().hide();
    }
}


function clear_options() {
    chrome.storage.local.clear();
    $("input").val("");
}

function showValuePathHeader(){
  if($("input[id^='localStorage_ValuePath']")){
    
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('clear').addEventListener('click',
    clear_options);
document.getElementById('show').addEventListener('click',
    restore_options);
document.addEventListener('DOMContentLoaded', function() {
    var checkboxes = document.querySelectorAll('.isJson');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', changeHandler);
    }
});
document.addEventListener('DOMContentLoaded',showValuePathHeader);

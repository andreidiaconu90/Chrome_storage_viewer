// Saves options to chrome.storage
function save_options() {
    var localStorageKeys = [];
    var sessionStorageKeys = [];
    var keysToTrack = [];
    document.getElementById('keysForm').querySelectorAll('.keysToSave').forEach(function(row) {
        if ($(row).find('.key').val()) {
            var object = {};
            object = {
                _key: $(row).find('.key').val(),
                _isJson: $(row).find('.isJson').is(":checked"),
                _value: $(row).find('.value').val()
            };
            keysToTrack.push(object);
        }
    });
    chrome.storage.local.set({
        'keysToTrack': keysToTrack,
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved';
        setTimeout(function() {
            status.textContent = '';
        }, 1000);
    });
}

function restore_options() {
    chrome.storage.local.get(['keysToTrack'], function(result) {
        populateOptionsTable(result.keysToTrack, "keysForm");
    });
}

function populateOptionsTable(storageKeys, tableToFill) {
    var emptyRow = $("#keysForm").find(".keysToSave").eq(0).clone();
    $(emptyRow).find("input").val("");
    $(emptyRow).find("input[type='checkbox']").prop("checked", false);
    $("#keysForm > tr").slice(1).remove();

    $.each(storageKeys, function(index, option) {
        var optionRow = $(emptyRow).clone();
        $(optionRow).find('input.key').val(option._key);
        $(optionRow).find('input.isJson').prop("checked", option._isJson).on("change", changeHandler);
        $(optionRow).find('input.value').val(option._value);
        $(optionRow).show();
        $("#keysForm").find("tr:last").after(optionRow);
    });
    $.each($("input.isJson:checked"), function(index, checkbox) {
        $(checkbox).closest("tr").find("input.value").show();
    })
}

function changeHandler(e) {
    if (e.target.checked) {
        $(e.target).parent().parent().find('input[class^="value"]').show();
    } else {
        $(e.target).parent().parent().find('input[class^="value"]').hide();
    }
}

function showHideHelp() {

    if ($("#helpTable").hasClass("hidden")) {
        $("#helpTable").show();
        $("#helpTable").removeClass("hidden");
        $("#helpTable").addClass("visible");
        return;
    }
    if ($("#helpTable").hasClass("visible")) {
        $("#helpTable").hide();
        $("#helpTable").removeClass("visible");
        $("#helpTable").addClass("hidden");
        return;
    }
}

function addRow() {
    var row = $("#keysForm").find(".keysToSave").eq(0).clone();
    $(row).find("input").val("");
    $(row).find("input[type='checkbox']").prop("checked", false).on("change", changeHandler);
    $(row).show();
    $("#keysForm").find("tr.keysToSave:last").after(row);
}

function clear_options() {
    chrome.storage.local.clear();
    $("input").val("");
    $(".isJson").prop("checked", false);
    $(".value").hide();
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('clear').addEventListener('click', clear_options);
document.getElementById('restore').addEventListener('click', restore_options);
document.addEventListener('DOMContentLoaded', showValuePathHeader);
document.getElementById('showHideHelp').addEventListener('click', showHideHelp);
document.getElementById('addRow').addEventListener('click', addRow);
document.addEventListener('DOMContentLoaded', function() {
    var checkboxes = document.querySelectorAll('.isJson');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', changeHandler);
    }
});

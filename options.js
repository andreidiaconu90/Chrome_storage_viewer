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
                _value: $(row).find('.value').val(),
                _type: $(row).find("select").find(":selected").val()
            };
            keysToTrack.push(object);
        }
    });
    chrome.storage.local.set({
        'keysToTrack': keysToTrack,
    }, function() {
        $("#saveMessage").show();
        setTimeout(function() {
          $("#saveMessage").hide();
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
        $(optionRow).find('div.deleteOption').on("click",delete_option);
        $(optionRow).find('input.value').val(option._value);
        $(optionRow).find('select').val(option._type);
        $(optionRow).show();
        $("#keysForm").find("tr:last").after(optionRow);
    });
    $.each($("input.isJson:checked"), function(index, checkbox) {
        $(checkbox).closest("tr").find("input.value").show();
    });
    if(storageKeys !== undefined){
      $.each($("#keysForm").find("tr.keysToSave > td > input.key"),function(index,input){
        if($(input).val()===''){
          $(input).parent().parent().hide();
        }
      });
    }
    showHideHeader();
}

function changeHandler(e) {
    if (e.target.checked) {
        $(e.target).parent().parent().find('input[class^="value"]').show();
        $('.valuePathHeader').css("visibility","visible");
    } else {
        $(e.target).parent().parent().find('input[class^="value"]').hide();
        $(e.target).parent().parent().find('input[class^="value"]').val("");
        if($('input[class^="value"]:visible').length === 0)
        {
          $('.valuePathHeader').css("visibility","hidden");
        }
    }
}

function addRow() {
    var row = $("#keysForm").find(".keysToSave").eq(0).clone();
    $(row).find("input").val("");
    $(row).find("input[type='checkbox']").prop("checked", false).on("change", changeHandler);
    $(row).find('div.deleteOption').on("click",delete_option);
    $(row).show();
    $("#keysForm").find("tr.keysToSave:last").after(row);
    showHideHeader();
}

function showHideHeader(){
  if($("#keysForm tbody").find("tr:visible").length > 0){
    $(".headerRow").show();
    if($("#keysForm tbody").find("tr:visible").find("input.value:visible").length > 0)
    {
      $(".valuePathHeader").css("visibility","visible");
    }
  }else{
    $(".headerRow").hide();
  }
}
function clear_options(e) {
    if (e.target.id === "clear") {
        $("#confirmDiv").show();
    } else if (e.target.id === "cancelDelete") {
        $("#confirmDiv").fadeOut(100);
    } else if (e.target.id === "confirmDelete") {
        chrome.storage.local.clear();
        debugger;
        $("input").val("");
        $(".isJson").prop("checked", false);
        $(".value").hide();
        $("#confirmDiv").hide();
        $(".keysToSave").hide().not(":first").remove();
        showHideHeader();
        showReminder();
    }
}

function delete_option(e){
  $(e.target).parent().parent().remove();
  showHideHeader();
  showReminder();
}

function showReminder(){
  $("#saveReminder").show();
  setTimeout(function() {
      $("#saveReminder").hide()
  }, 3000);
}
function tabSwitch(e) {
    // Declare all variables
    var tabName = "";
  if(e.target.id === "HelpTab")
  {
    tabName = "Help";
  }
  if(e.target.id === "OptionsTab")
  {
    tabName = "Options";
  }
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    var activeElement = document.querySelector(".active");
    if(activeElement){
    activeElement.classList.remove("active");
    }
    e.currentTarget.className += " active";
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('clear').addEventListener('click', clear_options);
document.getElementById('confirmDelete').addEventListener('click', clear_options);
document.getElementById('cancelDelete').addEventListener('click', clear_options);
document.getElementById('addRow').addEventListener('click', addRow);
document.getElementById('OptionsTab').addEventListener('click', tabSwitch);
document.getElementById('HelpTab').addEventListener('click', tabSwitch);
document.getElementById('OptionsTab').click();
document.addEventListener('DOMContentLoaded', function() {
    var checkboxes = document.querySelectorAll('.isJson');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', changeHandler);
    }
});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  displayOverlay(msg, sender, sendResponse);
});
document.addEventListener( "click", function(event){
	    var element = event.target;
    if(element.id == "Refresh"){
      chrome.storage.local.get(['keysToTrack', 'extensionState'], function(result) {
        displayOverlay(result);
      });
    }
} );


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


function displayOverlay (msg, sender, sendResponse){
  var htmlRows = "";
    if (sender && msg.extensionState === "open") {
      chrome.storage.local.set({
          "extensionState": ""
      });
      $("#extensionOverlay").remove();
      return false;
  }else{
    //remove overlay then reopen
      $("#extensionOverlay").remove();
  }
  $.each(msg.keysToTrack, function(index, key) {
      if (key._isJson === true) {
          var path = key._value;
          var value = JSON.parse(localStorage.getItem(key._key));
          var jsonValue = Object.byString(value, key._value);
          var result = path + " : " + jsonValue;

          var keyHtml = "<p>" + key._value + "</p>";
          var valueHtml = "<p>" + jsonValue + "</p>";
          var htmlRow = "<tr><td style='padding: 0 20px 0 5px;'>" + keyHtml + "</td><td style='padding: 0 20px 0 5px;'>" + valueHtml + "</td></tr>";
        htmlRows += htmlRow;
      } else {
    var keyHtml = "<p>" + key._key + "</p>";
    var valueHtml =  "<p>" + localStorage.getItem(key._key) + "</p>"
    var htmlRow = "<tr><td style='padding: 0 20px 0 5px;'>" + keyHtml + "</td><td style='padding: 0 20px 0 5px;'>" + valueHtml + "</td></tr>";
    htmlRows += htmlRow;
      }
  });

  var refreshButtonUrl = chrome.extension.getURL('Refresh-20.png');
  var html = '<div id="extensionOverlay"' +
      ' style="position: fixed;' +
      'top: 10px;' +
      'right:0;' +
      'color:white;' +
      'font-size: 12px;' +
      'font-family: sans-serif;' +
      'font-weight: bold;' +
      'border-radius:10px;' +
      'background: rgba(54, 25, 25, .5);"><table><tr style="border-bottom:1pt solid white;">'+
'<th style="padding: 5px 20px 0 5px;">Key</th><th style="padding: 5px 20px 0 5px;">Value<div style="width:20px;height:20px;display:block;background:url('+ refreshButtonUrl +');float: right;cursor:pointer;"id="Refresh"></div></th></tr>' + htmlRows + '</table></div>';
  chrome.storage.local.set({
      'extensionState': "open",
  });
  $($.parseHTML(html)).appendTo('body');
}

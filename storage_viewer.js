//alert(window.localStorage.getItem('se:fkey'));
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
            //alert(JSON.stringify(msg));
            //foreach key in localStoragekeys create a table with first td name of key, second td value of key
            //append the new html to the div below and inject it in the body
            if(msg.extensionState === "open"){
              chrome.storage.local.set({
                "extensionState":""
              });
              $("#extensionOverlay").remove();
              return false;
            }
            var keysToSearch = [];
            var localStoredKeys = [];
            var returnedKeys = {};
            for (i = 0; i < localStorage.length; i++)   {
                localStoredKeys.push(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
            }
            $.each(msg.localStorageKeys, function(index, key) {
                if (key != "") {
                    keysToSearch.push(key);
                }
              });
                $.each(msg.sessionStorageKeys, function(index, key) {
                    if (key != "") {
                        keysToSearch.push(key);
                    }
                });
                var sessionState = localStorage.getItem("sessionState");
                var parsedSessionState = JSON.parse(sessionState);
                returnedKeys["sessionId"] = parsedSessionState["SessionId"];
                //add dynamic options in below $.each

                $.each(keysToSearch, function(index, key) {
                  returnedKeys[key] = localStorage.getItem(key);
                  // var indexOfKey = jQuery.inArray(key, msg.localStorageKeys);
                  // if(indexOfKey !== -1){
                  //   var keyValue = returnedKeys[index]
                  // }
                    // if (jQuery.inArray(key, msg.localStorageKeys) !== -1) {
                    //   returnedKeys[key] = key;
                    // }
                })
                // var html = '<div id="footerAndrei"' +
                //     ' style="position: fixed;' +
                //     'top: 0;width: 20%;' +
                //     'background: #0070FF;' +
                //     'line-height: 2;' +
                //     'text-align: center;' +
                //     'font-size: 15px;' +
                //     'font-family: sans-serif;' +
                //     'font-weight: bold;' +
                //     'text-shadow: 0 1px 0 #84BAFF;' +
                //     'box-shadow: 0 0 15px #00214B}">' + JSON.stringify(returnedKeys) + '</div>';
                var htmlRows = [];
                $.each(returnedKeys,function(index,key){
                    var keyHtml="<p>" + index.replace(/\"/g, "") +"</p>";
                    var valueHtml = "<p>" + key.replace(/\"/g, "") +"</p>";
                    htmlRows.push("<tr><td style='padding: 0 20px 0 5px;'>"+keyHtml+"</td><td style='padding: 0 20px 0 5px;'>"+valueHtml+"</td></tr>");
                });

                var html = '<div id="extensionOverlay"' +
                    ' style="position: fixed;' +
                    'top: 0;' +
                    'right:0;'+
                    'line-height: 2;' +
                    'color:white;'+
                    'text-align: center;' +
                    'font-size: 15px;' +
                    'font-family: sans-serif;' +
                    'font-weight: bold;' +
                    'background: rgba(54, 25, 25, .5);"><table><tr><th style="padding: 0 20px 0 5px;">Key</th><th style="padding: 0 20px 0 5px;">Value</th></tr>'+ htmlRows +'</table></div>';
                    chrome.storage.local.set({
                        'extensionState': "open",
                    });
                $($.parseHTML(html)).appendTo('body');
                // if (msg.action == 'SendIt') {
                //     alert(window.localStorage.getItem('se:fkey'));
                // }
            });

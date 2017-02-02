# Chrome storage viewer
This is a extension for chrome which displays desired local/session storage values in the browser window
Storage viewer is an extension meant for web programmers whose applications store data in local storage. This applications allows you to define keys you want to track and display them in a nice and unobtrusive way over the page you are building. Does your application store JSON strings as the value of a key? No problem, as you can define the path(Object[0].Child[1].SomeProperty) to the item you want to track and then you can see the 'SomeProperty' value.

Find this extension in Chrome Web Store: https://goo.gl/gF7IUE

# Usage Example
Key = StorageKeyName
IsJson = checked
Value = Parent[0].Child[1].SomeProperty
Type = Session storage
After you save, this option will return the 'SomeProperty' value of the second Child' of the first 'Parent' inside the value of the 'StorageKeyName' key from the Session storage.

# Storage Type

Local storage search for the key in Local Storage
Session storage search for the key in Session Storage
Cookie data search for the key in Cookies
All search for the key all above storage locations and return the first matching key
Specifying the Storage type will enable you to keep track of multiple keys with the same name but in different storages

# Edit a value

Clicking on the Edit button(pencil icon) will make the 'Value' field editable and it will enable you to edit the value of a key(in storage). After you finish typing the new value you must hit Enter to save the new value.

# Delete a key

Clicking on the Delete button (trash icon) will remove the corresponding key from storage. Currently deleting a key is only available for keys whose values are not extracted from a JSON object and are located in either Local Storage or Session Storage

# Copy a value

Clicking on the Copy button (file icon) will copy the corresponding value inside the clipboard.

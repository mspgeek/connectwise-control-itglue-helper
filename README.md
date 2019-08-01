# connectwise-control-itglue-helper

Build
```
> npm run build
```

Run in development   
Note: uses [CORS Anywhere](https://github.com/k-grube/cors-anywhere) in development mode to proxy requests  

```
> npm run start
```


### todo

- add pagination
- add error handling
- add intermediate state during loading


## control injected variables

When running as an extension helper, `window.external` contains several useful properties and functions:

```javascript
helperText
sessionID
sessionTitle
sessionType
participantName
```
```javascript
void addNote(string text)
void sendChatMessage(string text)
void sendText(string text)
void sendFiles()
void sendFolder()
void receiveFiles()
void receiveFolder()
void sendSystemKeyCode()
void runTool(string itemPath, bool sharedOrPersonalToolbox, bool shouldRunElevated)
void sendCredentials(string domain, string userName, string password)
void showMessageBox(string message, string title)
string getSettingValue(string key)
void setSettingValue(string key, string value)
```

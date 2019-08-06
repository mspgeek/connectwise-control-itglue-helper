# connectwise-control-itglue-helper

#### Install

- Download latest release
- Extract zip to `C:\Program Files (x86)\ScreenConnect\App_Extensions`
- Enable extension in web console

#### Prerequisites
- On-prem (?). 
- Currently **unable** to support SSO.  
- May or may not work without 2FA/MFA enabled (if you don't have it enabled, you should turn it on.)

#### Install Build Prerequisites
```
> npm install
```

#### Build
```
> npm run build
```

#### Run in development   
Note: uses [CORS Anywhere](https://github.com/k-grube/cors-anywhere) in development mode to proxy requests  

```
> npm run start
```

### Control Helper Notes

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

Size of the helper when pinned
 - 250px by however tall the window is (usually around 800px on standard screen)
 
Size of the helper when moused over:
 - 650px by 350px



### TODOs

- make organization detail search useful
- add pagination and/or internal scroll bars
- add error handling for pretty much everything
- add bindings from intermediate states during loading where applicable
- ~~change login form to use 'subdomain' instead of full domain~~
- ~~log out on 401 error (see redux middleware)~~
- ~~fix SearchSelect timeout to prevent duplicate searches running~~
- add remember me

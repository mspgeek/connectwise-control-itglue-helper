# connectwise-control-itglue-helper

Build
```
> npm run build
```

Run in development

```
> npm run start
```


ITGlue's helper browser is detected as IE7, so all the javascript must work on IE7.  I can't find an IE7 box, so I'm testing with IE8.   You cannot include any node modules with webpack, as they probably use get/set accessors, which cannot be polyfilled on IE8.

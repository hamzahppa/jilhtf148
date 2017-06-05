# jilhtf148
Kurir Mangan (KURMA)

# Plugins
- cordova plugin crosswalk webview
`cordova plugin add cordova-plugin-crosswalk-webview`
crosswalk to improve performance

- cordova plugin geolocation
`cordova plugin add cordova-plugin-geolocation`
IMPORTANT! use to access location and set direction

- cordova plugin firebase
`cordova plugin add cordova-plugin-firebase`
IMPORTANT! use to receive and send push notification

- cordova plugin inappbrowser
`cordova plugin add cordova-plugin-inappbrowser`
use to navigate to external link

- telerik plugin native page transitions
`cordova plugin add https://github.com/Telerik-Verified-Plugins/NativePageTransitions`
tweak performance with native transitions

# Libs
- telerik native page transitions
`bower install shprink/ionic-native-transitions`
then add the lib to `index.html`
`<script src="./PathToBowerLib/dist/ionic-native-transitions.min.js"></script>`
I don't know why do this when already installed the plugin. But there's no other work this plugin will work if I don't do this.

- ngCordova
`bower install ngCordova`

- ngstorage
`bower install ngstorage`
it's ngstorage (with small s!!) and not ngStorage (with capital S!!)

# version
## 1.0.0
* view pesanan
* view process
* view history and cancel
* pick order

## 1.1.0
* fix bug on first open showing alert
* save device token to server
* fix bug data not load when opening apps (order, process, done)
* improve performance
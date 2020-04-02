//@ui5-bundle sap/ndc/library-h2-preload.js
/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine('sap/ndc/library',['sap/m/library','sap/ui/core/library'],function(l,a){"use strict";sap.ui.getCore().initLibrary({name:"sap.ndc",dependencies:["sap.ui.core","sap.m"],types:[],interfaces:[],controls:["sap.ndc.BarcodeScannerButton"],elements:[],noLibraryCSS:true,version:"1.74.0"});return sap.ndc;});
sap.ui.require.preload({
	"sap/ndc/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.ndc","type":"library","embeds":[],"applicationVersion":{"version":"1.74.0"},"title":"SAPUI5 library with controls with native device capabilities.","description":"SAPUI5 library with controls with native device capabilities.","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.74","libs":{"sap.ui.core":{"minVersion":"1.74.0"},"sap.m":{"minVersion":"1.74.0"}}},"library":{"i18n":"messagebundle.properties","css":false,"content":{"controls":["sap.ndc.BarcodeScannerButton"],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/ndc/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ndc/BarcodeScanDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Input.js","sap/m/Text.js","sap/ui/core/Fragment.js"],
"sap/ndc/BarcodeScanner.js":["sap/base/Log.js"],
"sap/ndc/BarcodeScannerButton.js":["sap/ndc/BarcodeScanner.js","sap/ndc/BarcodeScannerButtonRenderer.js","sap/ndc/library.js","sap/ui/core/Control.js","sap/ui/thirdparty/jquery.js"],
"sap/ndc/library.js":["sap/m/library.js","sap/ui/core/library.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map
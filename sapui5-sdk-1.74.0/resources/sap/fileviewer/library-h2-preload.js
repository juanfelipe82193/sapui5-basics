//@ui5-bundle sap/fileviewer/library-h2-preload.js
/*!
 * ${copyright}
 */
sap.ui.predefine('sap/fileviewer/library',['jquery.sap.global','sap/ui/core/library'],function(q,l){"use strict";sap.ui.getCore().initLibrary({name:"sap.fileviewer",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:["sap.fileviewer.FileViewer"],elements:[],noLibraryCSS:false,version:"1.74.0"});return sap.fileviewer;});
sap.ui.require.preload({
	"sap/fileviewer/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.fileviewer","type":"library","embeds":[],"applicationVersion":{"version":"1.74.0"},"title":"UI5 library: sap.fileviewer","description":"UI5 library: sap.fileviewer","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_plus","sap_hcb"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.74","libs":{"sap.ui.core":{"minVersion":"1.74.0"}}},"library":{"i18n":false,"content":{"controls":["sap.fileviewer.FileViewer"],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/fileviewer/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/fileviewer/FileViewer.js":["jquery.sap.global.js","sap/fileviewer/FileViewerModuleLoader.js","sap/fileviewer/library.js","sap/ui/core/Control.js","sap/ui/model/resource/ResourceModel.js"],
"sap/fileviewer/FileViewerModuleLoader.js":["sap/fileviewer/viewer/build/pdf.js","sap/fileviewer/viewer/build/pdf.worker.js","sap/fileviewer/viewer/sap-fpt/pdf2text/pdf2text.js","sap/fileviewer/viewer/sap-fpt/suv/suv.js","sap/fileviewer/viewer/sap-fpt/util/removeoperlaps.js","sap/fileviewer/viewer/sap-fpt/viewer/pdfhighlighter.js","sap/fileviewer/viewer/web/compatibility.js","sap/fileviewer/viewer/web/l10n.js","sap/fileviewer/viewer/web/pdf_viewer.js"],
"sap/fileviewer/library.js":["jquery.sap.global.js","sap/ui/core/library.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map
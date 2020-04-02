//@ui5-bundle sap/zen/dsh/library-h2-preload.js
/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
sap.ui.predefine('sap/zen/dsh/library',["sap/ui/core/Core","sap/ui/core/library","sap/ui/layout/library","sap/ui/table/library","sap/m/library","sap/zen/commons/library","sap/zen/crosstab/library"],function(){sap.ui.getCore().initLibrary({name:"sap.zen.dsh",dependencies:["sap.ui.core","sap.ui.table","sap.ui.layout","sap.m","sap.zen.commons","sap.zen.crosstab"],types:[],interfaces:[],controls:["sap.zen.dsh.AnalyticGrid","sap.zen.dsh.Dsh"],elements:[],noLibraryCSS:true,version:"1.74.0"});return sap.zen.dsh;});
sap.ui.require.preload({
	"sap/zen/dsh/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.zen.dsh","type":"library","embeds":["fioriwrapper"],"applicationVersion":{"version":"1.74.0"},"title":"Design Studio Runtime Library.","description":"Design Studio Runtime Library.  Intended only to be used within S/4 HANA Fiori applications.","ach":"BI-RA-AD-EA","resources":"resources.json","offline":true,"openSourceComponents":[{"name":"underscore","packagedWithMySelf":true,"version":"0.0.0"},{"name":"xlsx","packagedWithMySelf":true,"version":"0.0.0"},{"name":"jszip","packagedWithMySelf":true,"version":"0.0.0"}]},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.74","libs":{"sap.ui.core":{"minVersion":"1.74.0"},"sap.ui.table":{"minVersion":"1.74.0"},"sap.ui.layout":{"minVersion":"1.74.0"},"sap.m":{"minVersion":"1.74.0"},"sap.viz":{"minVersion":"1.74.0","lazy":true},"sap.zen.commons":{"minVersion":"1.74.0"},"sap.zen.crosstab":{"minVersion":"1.74.0"}}},"library":{"i18n":false,"css":false,"content":{"controls":["sap.zen.dsh.AnalyticGrid","sap.zen.dsh.Dsh"],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/zen/dsh/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/zen/dsh/AnalyticGrid.js":["sap/ui/core/Control.js","sap/ui/thirdparty/URI.js","sap/zen/dsh/library.js"],
"sap/zen/dsh/AnalyticGridRenderer.js":["sap/zen/dsh/DshRenderer.js"],
"sap/zen/dsh/Dsh.js":["sap/ui/core/Control.js","sap/zen/dsh/library.js"],
"sap/zen/dsh/fioriwrapper/Component.js":["sap/ui/core/UIComponent.js"],
"sap/zen/dsh/library.js":["sap/m/library.js","sap/ui/core/Core.js","sap/ui/core/library.js","sap/ui/layout/library.js","sap/ui/table/library.js","sap/zen/commons/library.js","sap/zen/crosstab/library.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map
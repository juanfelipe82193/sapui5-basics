//@ui5-bundle sap/ca/scfld/md/library-h2-preload.js
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright
        2009-2014 SAP SE. All rights reserved
    
 */
sap.ui.predefine('sap/ca/scfld/md/library',["sap/ui/core/Core","sap/ui/core/library","sap/m/library","sap/ca/ui/library"],function(){sap.ui.getCore().initLibrary({name:"sap.ca.scfld.md",dependencies:["sap.ui.core","sap.m","sap.ca.ui"],types:[],interfaces:[],controls:[],elements:[],noLibraryCSS:true,version:"1.74.0"});return sap.ca.scfld.md;});
sap.ui.require.preload({
	"sap/ca/scfld/md/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.ca.scfld.md","type":"library","embeds":[],"applicationVersion":{"version":"1.74.0"},"title":"SAP UI library: Scaffolding for Master Detail applications","description":"SAP UI library: Scaffolding for Master Detail applications","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.74","libs":{"sap.ui.core":{"minVersion":"1.74.0"},"sap.m":{"minVersion":"1.74.0"},"sap.ca.ui":{"minVersion":"1.74.0"}}},"library":{"i18n":false,"css":false,"content":{"controls":[],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/ca/scfld/md/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ca/scfld/md/ComponentBase.js":["sap/ca/scfld/md/ConfigurationBase.js","sap/m/routing/RouteMatchedHandler.js","sap/ui/core/UIComponent.js","sap/ui/core/routing/History.js","sap/ui/core/routing/Router.js"],
"sap/ca/scfld/md/ConfigurationBase.js":["sap/ca/scfld/md/ApplicationFacade.js","sap/ca/scfld/md/app/Application.js","sap/ca/scfld/md/app/ApplicationImplementation.js","sap/ca/scfld/md/app/ConnectionManager.js"],
"sap/ca/scfld/md/app/Application.js":["sap/ca/scfld/md/ApplicationFacade.js","sap/ca/scfld/md/app/ApplicationImplementation.js","sap/m/MessageToast.js"],
"sap/ca/scfld/md/app/ApplicationImplementation.js":["sap/ca/scfld/md/app/ConnectionManager.js","sap/ca/scfld/md/app/DetailHeaderFooterHelper.js","sap/ca/scfld/md/app/FullScreenHeaderFooterHelper.js","sap/ca/scfld/md/app/MasterHeaderFooterHelper.js"],
"sap/ca/scfld/md/app/BarOverflow.js":["sap/ca/scfld/md/app/BarOverflowLayoutData.js","sap/ui/base/Object.js","sap/ui/core/ResizeHandler.js"],
"sap/ca/scfld/md/app/BarOverflowLayoutData.js":["sap/ui/core/LayoutData.js"],
"sap/ca/scfld/md/app/ButtonListHelper.js":["sap/ca/scfld/md/app/BarOverflow.js","sap/ca/scfld/md/app/BarOverflowLayoutData.js","sap/ca/ui/dialog/Dialog.js","sap/m/ButtonType.js"],
"sap/ca/scfld/md/app/CommonHeaderFooterHelper.js":["sap/ca/scfld/md/app/BarOverflow.js","sap/ca/scfld/md/app/BarOverflowLayoutData.js","sap/ca/scfld/md/app/ButtonListHelper.js","sap/ushell/services/AppConfiguration.js","sap/ushell/ui/footerbar/AddBookmarkButton.js","sap/ushell/ui/footerbar/JamDiscussButton.js","sap/ushell/ui/footerbar/JamShareButton.js"],
"sap/ca/scfld/md/app/ConnectionManager.js":["sap/ca/ui/message/message.js","sap/ca/ui/utils/busydialog.js","sap/ui/model/odata/ODataUtils.js"],
"sap/ca/scfld/md/app/DetailHeaderFooterHelper.js":["sap/ca/scfld/md/app/CommonHeaderFooterHelper.js"],
"sap/ca/scfld/md/app/FullScreenHeaderFooterHelper.js":["sap/ca/scfld/md/app/ButtonListHelper.js","sap/ca/scfld/md/app/CommonHeaderFooterHelper.js","sap/ushell/ui/footerbar/AddBookmarkButton.js","sap/ushell/ui/footerbar/JamDiscussButton.js","sap/ushell/ui/footerbar/JamShareButton.js"],
"sap/ca/scfld/md/controller/BaseDetailController.js":["sap/ca/scfld/md/app/CommonHeaderFooterHelper.js","sap/ui/core/mvc/Controller.js"],
"sap/ca/scfld/md/controller/BaseFullscreenController.js":["sap/ca/scfld/md/app/Application.js","sap/ca/scfld/md/app/CommonHeaderFooterHelper.js","sap/ca/scfld/md/app/FullScreenHeaderFooterHelper.js","sap/ui/core/mvc/Controller.js"],
"sap/ca/scfld/md/controller/BaseMasterController.js":["sap/ca/scfld/md/app/CommonHeaderFooterHelper.js","sap/ui/core/mvc/Controller.js"],
"sap/ca/scfld/md/controller/ScfldMasterController.js":["sap/ca/scfld/md/app/CommonHeaderFooterHelper.js","sap/ui/core/mvc/Controller.js"],
"sap/ca/scfld/md/library.js":["sap/ca/ui/library.js","sap/m/library.js","sap/ui/core/Core.js","sap/ui/core/library.js"],
"sap/ca/scfld/md/view/App.view.xml":["sap/ca/scfld/md/view/App.controller.js","sap/m/App.js","sap/ui/core/mvc/XMLView.js"],
"sap/ca/scfld/md/view/MainSplitContainer.view.xml":["sap/ca/scfld/md/view/MainSplitContainer.controller.js","sap/m/SplitApp.js","sap/ui/core/mvc/XMLView.js"],
"sap/ca/scfld/md/view/empty.controller.js":["sap/ca/scfld/md/controller/BaseDetailController.js","sap/ca/ui/images/images.js"],
"sap/ca/scfld/md/view/empty.view.xml":["sap/ca/scfld/md/view/empty.controller.js","sap/m/Image.js","sap/m/Page.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map
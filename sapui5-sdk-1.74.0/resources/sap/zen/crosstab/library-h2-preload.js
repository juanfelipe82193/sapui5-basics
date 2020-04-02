//@ui5-bundle sap/zen/crosstab/library-h2-preload.js
/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
sap.ui.predefine('sap/zen/crosstab/library',["sap/ui/core/Core","sap/ui/core/library"],function(){sap.ui.getCore().initLibrary({name:"sap.zen.crosstab",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:["sap.zen.crosstab.Crosstab","sap.zen.crosstab.DataCell","sap.zen.crosstab.HeaderCell"],elements:[],version:"1.74.0"});return sap.zen.crosstab;});
sap.ui.require.preload({
	"sap/zen/crosstab/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.zen.crosstab","type":"library","embeds":[],"applicationVersion":{"version":"1.74.0"},"title":"Design Studio Crosstab library.","description":"Design Studio Crosstab library.  NOT INTENDED FOR STANDALONE USAGE.","ach":"BI-RA-AD-EA","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_hcb","sap_belize_hcw","sap_belize_plus","sap_bluecrystal","sap_fiori_3","sap_fiori_3_dark","sap_fiori_3_hcb","sap_fiori_3_hcw","sap_hcb"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.74","libs":{"sap.ui.core":{"minVersion":"1.74.0"}}},"library":{"i18n":false,"content":{"controls":["sap.zen.crosstab.Crosstab","sap.zen.crosstab.DataCell","sap.zen.crosstab.HeaderCell"],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/zen/crosstab/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/zen/crosstab/BaseArea.js":["sap/zen/crosstab/rendering/DataModel.js","sap/zen/crosstab/rendering/RenderEngine.js","sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/CellStyleHandler.js":["sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/ColumnHeaderArea.js":["sap/zen/crosstab/BaseArea.js","sap/zen/crosstab/rendering/RenderingConstants.js"],
"sap/zen/crosstab/Crosstab.js":["sap/ui/core/Control.js","sap/zen/crosstab/CellStyleHandler.js","sap/zen/crosstab/ColumnHeaderArea.js","sap/zen/crosstab/CrosstabCellApi.js","sap/zen/crosstab/CrosstabContextMenu.js","sap/zen/crosstab/CrosstabHeaderInfo.js","sap/zen/crosstab/CrosstabTestProxy.js","sap/zen/crosstab/DataArea.js","sap/zen/crosstab/DimensionHeaderArea.js","sap/zen/crosstab/EventHandler.js","sap/zen/crosstab/PropertyBag.js","sap/zen/crosstab/RowHeaderArea.js","sap/zen/crosstab/SelectionHandler.js","sap/zen/crosstab/dragdrop/DragDropHandler.js","sap/zen/crosstab/library.js","sap/zen/crosstab/paging/PageManager.js","sap/zen/crosstab/rendering/RenderEngine.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/CrosstabContextMenu.js":["sap/zen/crosstab/rendering/RenderingConstants.js"],
"sap/zen/crosstab/CrosstabRenderer.js":["sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/CrosstabTestProxy.js":["sap/zen/crosstab/ColResizer.js"],
"sap/zen/crosstab/DataArea.js":["sap/zen/crosstab/BaseArea.js","sap/zen/crosstab/rendering/RenderingConstants.js"],
"sap/zen/crosstab/DataCell.js":["sap/ui/core/Control.js","sap/zen/crosstab/CellStyleHandler.js","sap/zen/crosstab/library.js","sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/DataCellRenderer.js":["sap/zen/crosstab/IDataCell.js","sap/zen/crosstab/rendering/RenderingConstants.js"],
"sap/zen/crosstab/DimensionHeaderArea.js":["sap/zen/crosstab/BaseArea.js","sap/zen/crosstab/rendering/RenderingConstants.js"],
"sap/zen/crosstab/EventHandler.js":["sap/zen/crosstab/ColResizer.js","sap/zen/crosstab/HeaderResizer.js","sap/zen/crosstab/SelectionHandler.js","sap/zen/crosstab/TouchHandler.js","sap/zen/crosstab/keyboard/CrosstabKeyboardNavHandler.js","sap/zen/crosstab/rendering/CrossRequestManager.js","sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/HeaderCell.js":["sap/ui/core/Control.js","sap/zen/crosstab/CellStyleHandler.js","sap/zen/crosstab/library.js","sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/HeaderCellRenderer.js":["sap/zen/crosstab/IHeaderCell.js","sap/zen/crosstab/TextConstants.js","sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/PropertyBag.js":["sap/zen/crosstab/rendering/RenderingConstants.js"],
"sap/zen/crosstab/RowHeaderArea.js":["sap/zen/crosstab/BaseArea.js","sap/zen/crosstab/rendering/RenderingConstants.js"],
"sap/zen/crosstab/SelectionHandler.js":["sap/zen/crosstab/TouchHandler.js","sap/zen/crosstab/keyboard/CrosstabKeyboardNavHandler.js","sap/zen/crosstab/rendering/CrossRequestManager.js","sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/TouchHandler.js":["sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/datahandler/JsonDataHandler.js":["sap/zen/crosstab/CrosstabCellApi.js","sap/zen/crosstab/TextConstants.js","sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/dragdrop/DragDropHandler.js":["sap/zen/crosstab/TextConstants.js","sap/zen/crosstab/dragdrop/DragDropAreaRenderer.js","sap/zen/crosstab/dragdrop/DragDropHoverManager.js","sap/zen/crosstab/dragdrop/DragDropUtils.js","sap/zen/crosstab/dragdrop/MemberDragDropHandler.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/dragdrop/DragDropUtils.js":["sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/dragdrop/MemberDragDropHandler.js":["sap/zen/crosstab/TextConstants.js","sap/zen/crosstab/dragdrop/DragDropAreaRenderer.js","sap/zen/crosstab/dragdrop/DragDropHoverManager.js","sap/zen/crosstab/dragdrop/DragDropUtils.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/keyboard/CrosstabKeyboardNavHandler.js":["sap/zen/crosstab/rendering/RenderingConstants.js"],
"sap/zen/crosstab/library.js":["sap/ui/core/Core.js","sap/ui/core/library.js"],
"sap/zen/crosstab/paging/CellMerger.js":["sap/zen/crosstab/paging/PagingConstants.js"],
"sap/zen/crosstab/paging/Page.js":["sap/zen/crosstab/paging/PagingConstants.js","sap/zen/crosstab/rendering/RenderingConstants.js"],
"sap/zen/crosstab/paging/PageManager.js":["sap/zen/crosstab/datahandler/JsonDataHandler.js","sap/zen/crosstab/paging/CellMerger.js","sap/zen/crosstab/paging/Page.js","sap/zen/crosstab/paging/PagingConstants.js","sap/zen/crosstab/paging/RequestHandler.js"],
"sap/zen/crosstab/paging/RequestHandler.js":["sap/zen/crosstab/paging/RequestStack.js"],
"sap/zen/crosstab/rendering/CrossRequestManager.js":["sap/zen/crosstab/rendering/HeaderScrollManager.js","sap/zen/crosstab/rendering/PixelScrollManager.js","sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/rendering/ScrollManager.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/rendering/RenderEngine.js":["sap/zen/crosstab/rendering/CrossRequestManager.js","sap/zen/crosstab/rendering/DomElementProvider.js","sap/zen/crosstab/rendering/RenderingConstants.js","sap/zen/crosstab/rendering/ScrollManager.js","sap/zen/crosstab/rendering/ScrollbarRenderer.js","sap/zen/crosstab/utils/Measuring.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/rendering/ScrollManager.js":["sap/ui/core/OpenState.js","sap/ui/core/Popup.js","sap/zen/crosstab/TextConstants.js","sap/zen/crosstab/utils/Measuring.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/rendering/ScrollbarRenderer.js":["sap/zen/crosstab/utils/Measuring.js","sap/zen/crosstab/utils/Utils.js"],
"sap/zen/crosstab/utils/Measuring.js":["sap/zen/crosstab/rendering/RenderingConstants.js"],
"sap/zen/crosstab/utils/Utils.js":["sap/zen/crosstab/rendering/RenderingConstants.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map
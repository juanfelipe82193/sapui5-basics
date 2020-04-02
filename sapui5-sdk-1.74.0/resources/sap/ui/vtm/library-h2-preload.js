//@ui5-bundle sap/ui/vtm/library-h2-preload.js
/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.predefine('sap/ui/vtm/library',["jquery.sap.global",'sap/ui/base/DataType',"./ArrayUtilities","./MatrixComponent","./MatrixUtilities","./TreeItemUtilities","./HashUtilities","./DescriptorUtilities","./InternalColumns","./ColumnType","./PredefinedView","./TextColor","./SelectionMode","./InternalColumnDescriptor","./ChildCollectionType","./TreeItemType","./ColumnTemplates","./ViewableLoadStatus"],function(q,S,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.vtm",dependencies:["sap.ui.core","sap.ui.table","sap.m","sap.ui.vk"],interfaces:["sap.ui.vtm.interfaces.IDisplayStateCalculationExtension","sap.ui.vtm.interfaces.IInitialViewExtension","sap.ui.vtm.interfaces.IDownloadProgressExtension","sap.ui.vtm.interfaces.ILoadProgressExtension","sap.ui.vtm.interfaces.IMessageStatusCalculationExtension","sap.ui.vtm.interfaces.IMessageStatusIconClickExtension","sap.ui.vtm.interfaces.IMessageStatusHeaderIconClickExtension","sap.ui.vtm.interfaces.ISelectionLinkingExtension","sap.ui.vtm.interfaces.ISceneNodeHoverHighlightExtension","sap.ui.vtm.interfaces.ISceneNodeHoverTooltipExtension","sap.ui.vtm.interfaces.IViewLinkingExtension","sap.ui.vtm.interfaces.IViewportSelectionLinkingExtension","sap.ui.vtm.interfaces.IVisibilityIconClickExtension","sap.ui.vtm.interfaces.IVisibilityHeaderIconClickExtension"],types:["sap.ui.vtm.Matrix"],controls:["sap.ui.vtm.Panel","sap.ui.vtm.Tree","sap.ui.vtm.Text","sap.ui.vtm.Viewport","sap.ui.vtm.MessagesPopover","sap.ui.vtm.Progress","sap.ui.vtm.ProgressDialog","sap.ui.vtm.SelectColumnsDialog"],elements:["sap.ui.vtm.Vtm","sap.ui.vtm.Column","sap.ui.vtm.Lookup","sap.ui.vtm.ViewableLoadInfo","sap.ui.vtm.Viewable","sap.ui.vtm.Scene","sap.ui.vtm.SceneNode","sap.ui.vtm.Extension","sap.ui.vtm.DisplayGroup","sap.ui.vtm.TreeCollections","sap.ui.vtm.extensions.MessageStatusCalculationExtension","sap.ui.vtm.extensions.MessageStatusIconClickExtension","sap.ui.vtm.extensions.ViewportSelectionLinkingExtension","sap.ui.vtm.extensions.SelectionLinkingExtension","sap.ui.vtm.extensions.VisibilityIconClickExtension","sap.ui.vtm.extensions.DisplayStateCalculationExtension","sap.ui.vtm.extensions.ViewLinkingExtension","sap.ui.vtm.extensions.InitialViewExtension","sap.ui.vtm.extensions.LoadProgressExtension","sap.ui.vtm.extensions.SceneNodeHoverHighlightExtension","sap.ui.vtm.extensions.SceneNodeHoverTooltipExtension"],noLibraryCSS:false,version:"1.74.0"});
sap.ui.vtm.createVtm=function(I,s){return new sap.ui.vtm.Vtm(I,q.extend(s,{addDefaultExtensions:true}));};
var r;
sap.ui.vtm.getResourceBundle=function(){if(!r){r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.vtm.i18n");}return r;};
sap.ui.vtm.createMeasureId=function(s,t){return(typeof s==="string")?s+"#"+t:s.getMetadata().getName()+"#"+t+" "+s.getId();};
sap.ui.vtm.measure=function(s,t,u){var v=sap.ui.vtm.createMeasureId(s,t);q.sap.measure.start(v,"",["sap.ui.vtm"]);try{u();}finally{q.sap.measure.end(v);}return v;};
sap.ui.vtm.Matrix=S.createType("sap.ui.vtm.Matrix",{isValid:function(v){return sap.ui.vtm.Matrix.getBaseType().isValid(v)&&v.length===13;}},S.getType("float[]"));return sap.ui.vtm;});
sap.ui.require.preload({
	"sap/ui/vtm/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.ui.vtm","type":"library","embeds":[],"applicationVersion":{"version":"1.74.0"},"title":"SAPUI5 Visual Tree Mapper.","description":"SAPUI5 Visual Tree Mapper.","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_hcb","sap_belize_plus","sap_bluecrystal","sap_hcb"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.74","libs":{"sap.ui.core":{"minVersion":"1.74.0"},"sap.ui.unified":{"minVersion":"1.74.0","lazy":true},"sap.m":{"minVersion":"1.74.0","lazy":true},"sap.ui.layout":{"minVersion":"1.74.0","lazy":true}}},"library":{"i18n":false,"content":{"controls":["sap.ui.vtm.Panel","sap.ui.vtm.Tree","sap.ui.vtm.Text","sap.ui.vtm.Viewport","sap.ui.vtm.MessagesPopover","sap.ui.vtm.Progress","sap.ui.vtm.ProgressDialog","sap.ui.vtm.SelectColumnsDialog"],"elements":["sap.ui.vtm.Vtm","sap.ui.vtm.Column","sap.ui.vtm.Lookup","sap.ui.vtm.ViewableLoadInfo","sap.ui.vtm.Viewable","sap.ui.vtm.Scene","sap.ui.vtm.SceneNode","sap.ui.vtm.Extension","sap.ui.vtm.DisplayGroup","sap.ui.vtm.TreeCollections","sap.ui.vtm.extensions.MessageStatusCalculationExtension","sap.ui.vtm.extensions.MessageStatusIconClickExtension","sap.ui.vtm.extensions.ViewportSelectionLinkingExtension","sap.ui.vtm.extensions.SelectionLinkingExtension","sap.ui.vtm.extensions.VisibilityIconClickExtension","sap.ui.vtm.extensions.DisplayStateCalculationExtension","sap.ui.vtm.extensions.ViewLinkingExtension","sap.ui.vtm.extensions.InitialViewExtension","sap.ui.vtm.extensions.LoadProgressExtension","sap.ui.vtm.extensions.SceneNodeHoverHighlightExtension","sap.ui.vtm.extensions.SceneNodeHoverTooltipExtension"],"types":["sap.ui.vtm.Matrix"],"interfaces":["sap.ui.vtm.interfaces.IDisplayStateCalculationExtension","sap.ui.vtm.interfaces.IInitialViewExtension","sap.ui.vtm.interfaces.IDownloadProgressExtension","sap.ui.vtm.interfaces.ILoadProgressExtension","sap.ui.vtm.interfaces.IMessageStatusCalculationExtension","sap.ui.vtm.interfaces.IMessageStatusIconClickExtension","sap.ui.vtm.interfaces.IMessageStatusHeaderIconClickExtension","sap.ui.vtm.interfaces.ISelectionLinkingExtension","sap.ui.vtm.interfaces.ISceneNodeHoverHighlightExtension","sap.ui.vtm.interfaces.ISceneNodeHoverTooltipExtension","sap.ui.vtm.interfaces.IViewLinkingExtension","sap.ui.vtm.interfaces.IViewportSelectionLinkingExtension","sap.ui.vtm.interfaces.IVisibilityIconClickExtension","sap.ui.vtm.interfaces.IVisibilityHeaderIconClickExtension"]}}}}'
},"sap/ui/vtm/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ui/vtm/ArrayUtilities.js":["jquery.sap.global.js"],
"sap/ui/vtm/CheckEye.js":["jquery.sap.global.js","sap/ui/core/Icon.js","sap/ui/core/IconRenderer.js","sap/ui/vtm/library.js"],
"sap/ui/vtm/Column.js":["jquery.sap.global.js","sap/ui/commons/Label.js","sap/ui/core/Element.js"],
"sap/ui/vtm/ColumnTemplates.js":["jquery.sap.global.js"],
"sap/ui/vtm/DescriptorUtilities.js":["jquery.sap.global.js"],
"sap/ui/vtm/DisplayGroup.js":["jquery.sap.global.js","sap/ui/core/Element.js"],
"sap/ui/vtm/Extension.js":["jquery.sap.global.js","sap/ui/core/Element.js"],
"sap/ui/vtm/HashUtilities.js":["jquery.sap.global.js"],
"sap/ui/vtm/InternalColumns.js":["jquery.sap.global.js","sap/ui/vtm/ColumnType.js","sap/ui/vtm/InternalColumnDescriptor.js"],
"sap/ui/vtm/Lookup.js":["jquery.sap.global.js","sap/ui/core/Element.js","sap/ui/vtm/ArrayUtilities.js"],
"sap/ui/vtm/MatrixUtilities.js":["jquery.sap.global.js"],
"sap/ui/vtm/MessagesPopover.js":["jquery.sap.global.js","sap/m/List.js","sap/m/Popover.js","sap/m/PopoverRenderer.js","sap/ui/vtm/library.js"],
"sap/ui/vtm/Panel.js":["jquery.sap.global.js","sap/m/VBox.js","sap/ui/commons/Panel.js","sap/ui/core/Control.js","sap/ui/core/Title.js","sap/ui/layout/Splitter.js","sap/ui/vtm/Tree.js","sap/ui/vtm/Viewport.js"],
"sap/ui/vtm/Progress.js":["jquery.sap.global.js","sap/m/ProgressIndicator.js","sap/m/Text.js","sap/ui/core/Control.js"],
"sap/ui/vtm/ProgressDialog.js":["jquery.sap.global.js","sap/m/Dialog.js","sap/ui/core/Control.js","sap/ui/vtm/Progress.js","sap/ui/vtm/library.js"],
"sap/ui/vtm/Scene.js":["jquery.sap.global.js","sap/ui/core/Element.js","sap/ui/vk/NodeHierarchy.js","sap/ui/vk/Scene.js","sap/ui/vk/dvl/GraphicsCore.js","sap/ui/vtm/ArrayUtilities.js","sap/ui/vtm/SceneNode.js","sap/ui/vtm/ViewableLoadInfo.js"],
"sap/ui/vtm/SceneNode.js":["jquery.sap.global.js","sap/ui/core/Element.js","sap/ui/vk/NodeProxy.js","sap/ui/vtm/ArrayUtilities.js","sap/ui/vtm/MatrixUtilities.js"],
"sap/ui/vtm/SelectColumnsDialog.js":["jquery.sap.global.js","sap/m/TableSelectDialog.js","sap/ui/core/Control.js","sap/ui/vtm/ColumnType.js","sap/ui/vtm/InternalColumns.js","sap/ui/vtm/Progress.js","sap/ui/vtm/library.js"],
"sap/ui/vtm/Text.js":["jquery.sap.global.js","sap/m/Text.js","sap/m/TextRenderer.js","sap/ui/vtm/TextColor.js"],
"sap/ui/vtm/Tree.js":["jquery.sap.global.js","sap/ui/commons/TextView.js","sap/ui/core/Control.js","sap/ui/core/Icon.js","sap/ui/core/IconPool.js","sap/ui/layout/HorizontalLayout.js","sap/ui/model/json/JSONModel.js","sap/ui/table/TreeTable.js","sap/ui/vtm/ArrayUtilities.js","sap/ui/vtm/CheckEye.js","sap/ui/vtm/Column.js","sap/ui/vtm/ColumnType.js","sap/ui/vtm/InternalColumnDescriptor.js","sap/ui/vtm/InternalColumns.js","sap/ui/vtm/Lookup.js","sap/ui/vtm/MatrixUtilities.js","sap/ui/vtm/SelectionMode.js","sap/ui/vtm/Text.js","sap/ui/vtm/TreeItemUtilities.js","sap/ui/vtm/library.js"],
"sap/ui/vtm/TreeCollections.js":["jquery.sap.global.js","sap/ui/core/Element.js","sap/ui/vtm/ArrayUtilities.js"],
"sap/ui/vtm/TreeItemUtilities.js":["jquery.sap.global.js","sap/ui/core/Message.js","sap/ui/vtm/ArrayUtilities.js"],
"sap/ui/vtm/Viewable.js":["jquery.sap.global.js","sap/ui/core/Element.js","sap/ui/vk/ContentResource.js"],
"sap/ui/vtm/ViewableLoadInfo.js":["jquery.sap.global.js","sap/ui/core/Element.js"],
"sap/ui/vtm/Viewport.js":["jquery.sap.global.js","sap/m/OverflowToolbar.js","sap/ui/core/Control.js","sap/ui/vk/FlexibleControl.js","sap/ui/vk/FlexibleControlLayoutData.js","sap/ui/vk/dvl/Viewport.js","sap/ui/vtm/ViewportHandler.js"],
"sap/ui/vtm/ViewportHandler.js":["jquery.sap.global.js","sap/ui/vk/ViewportHandler.js"],
"sap/ui/vtm/Vtm.js":["jquery.sap.global.js","sap/m/Toolbar.js","sap/ui/core/Element.js","sap/ui/vtm/ArrayUtilities.js","sap/ui/vtm/Panel.js","sap/ui/vtm/Scene.js","sap/ui/vtm/Viewable.js"],
"sap/ui/vtm/extensions/DisplayStateCalculationExtension.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/vtm/Extension.js"],
"sap/ui/vtm/extensions/InitialViewExtension.js":["jquery.sap.global.js","sap/ui/vtm/Extension.js"],
"sap/ui/vtm/extensions/LoadProgressExtension.js":["jquery.sap.global.js","sap/ui/vtm/Extension.js"],
"sap/ui/vtm/extensions/MessageStatusCalculationExtension.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/vtm/Extension.js"],
"sap/ui/vtm/extensions/MessageStatusIconClickExtension.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/vtm/Extension.js"],
"sap/ui/vtm/extensions/SceneNodeHoverHighlightExtension.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/vtm/Extension.js"],
"sap/ui/vtm/extensions/SceneNodeHoverTooltipExtension.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/vtm/Extension.js","sap/ui/vtm/ViewportHandler.js"],
"sap/ui/vtm/extensions/SelectionLinkingExtension.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/vtm/Extension.js"],
"sap/ui/vtm/extensions/ViewLinkingExtension.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/vtm/Extension.js"],
"sap/ui/vtm/extensions/ViewportSelectionLinkingExtension.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/vtm/Extension.js"],
"sap/ui/vtm/extensions/VisibilityIconClickExtension.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/vtm/Extension.js"],
"sap/ui/vtm/library.js":["jquery.sap.global.js","sap/ui/base/DataType.js","sap/ui/vtm/ArrayUtilities.js","sap/ui/vtm/ChildCollectionType.js","sap/ui/vtm/ColumnTemplates.js","sap/ui/vtm/ColumnType.js","sap/ui/vtm/DescriptorUtilities.js","sap/ui/vtm/HashUtilities.js","sap/ui/vtm/InternalColumnDescriptor.js","sap/ui/vtm/InternalColumns.js","sap/ui/vtm/MatrixComponent.js","sap/ui/vtm/MatrixUtilities.js","sap/ui/vtm/PredefinedView.js","sap/ui/vtm/SelectionMode.js","sap/ui/vtm/TextColor.js","sap/ui/vtm/TreeItemType.js","sap/ui/vtm/TreeItemUtilities.js","sap/ui/vtm/ViewableLoadStatus.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map
/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global",'sap/ui/base/DataType',"./ArrayUtilities","./MatrixComponent","./MatrixUtilities","./TreeItemUtilities","./HashUtilities","./DescriptorUtilities","./InternalColumns","./ColumnType","./PredefinedView","./TextColor","./SelectionMode","./InternalColumnDescriptor","./ChildCollectionType","./TreeItemType","./ColumnTemplates","./ViewableLoadStatus"],function(q,S,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.vtm",dependencies:["sap.ui.core","sap.ui.table","sap.m","sap.ui.vk"],interfaces:["sap.ui.vtm.interfaces.IDisplayStateCalculationExtension","sap.ui.vtm.interfaces.IInitialViewExtension","sap.ui.vtm.interfaces.IDownloadProgressExtension","sap.ui.vtm.interfaces.ILoadProgressExtension","sap.ui.vtm.interfaces.IMessageStatusCalculationExtension","sap.ui.vtm.interfaces.IMessageStatusIconClickExtension","sap.ui.vtm.interfaces.IMessageStatusHeaderIconClickExtension","sap.ui.vtm.interfaces.ISelectionLinkingExtension","sap.ui.vtm.interfaces.ISceneNodeHoverHighlightExtension","sap.ui.vtm.interfaces.ISceneNodeHoverTooltipExtension","sap.ui.vtm.interfaces.IViewLinkingExtension","sap.ui.vtm.interfaces.IViewportSelectionLinkingExtension","sap.ui.vtm.interfaces.IVisibilityIconClickExtension","sap.ui.vtm.interfaces.IVisibilityHeaderIconClickExtension"],types:["sap.ui.vtm.Matrix"],controls:["sap.ui.vtm.Panel","sap.ui.vtm.Tree","sap.ui.vtm.Text","sap.ui.vtm.Viewport","sap.ui.vtm.MessagesPopover","sap.ui.vtm.Progress","sap.ui.vtm.ProgressDialog","sap.ui.vtm.SelectColumnsDialog"],elements:["sap.ui.vtm.Vtm","sap.ui.vtm.Column","sap.ui.vtm.Lookup","sap.ui.vtm.ViewableLoadInfo","sap.ui.vtm.Viewable","sap.ui.vtm.Scene","sap.ui.vtm.SceneNode","sap.ui.vtm.Extension","sap.ui.vtm.DisplayGroup","sap.ui.vtm.TreeCollections","sap.ui.vtm.extensions.MessageStatusCalculationExtension","sap.ui.vtm.extensions.MessageStatusIconClickExtension","sap.ui.vtm.extensions.ViewportSelectionLinkingExtension","sap.ui.vtm.extensions.SelectionLinkingExtension","sap.ui.vtm.extensions.VisibilityIconClickExtension","sap.ui.vtm.extensions.DisplayStateCalculationExtension","sap.ui.vtm.extensions.ViewLinkingExtension","sap.ui.vtm.extensions.InitialViewExtension","sap.ui.vtm.extensions.LoadProgressExtension","sap.ui.vtm.extensions.SceneNodeHoverHighlightExtension","sap.ui.vtm.extensions.SceneNodeHoverTooltipExtension"],noLibraryCSS:false,version:"1.74.0"});sap.ui.vtm.createVtm=function(I,s){return new sap.ui.vtm.Vtm(I,q.extend(s,{addDefaultExtensions:true}));};var r;sap.ui.vtm.getResourceBundle=function(){if(!r){r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.vtm.i18n");}return r;};sap.ui.vtm.createMeasureId=function(s,t){return(typeof s==="string")?s+"#"+t:s.getMetadata().getName()+"#"+t+" "+s.getId();};sap.ui.vtm.measure=function(s,t,u){var v=sap.ui.vtm.createMeasureId(s,t);q.sap.measure.start(v,"",["sap.ui.vtm"]);try{u();}finally{q.sap.measure.end(v);}return v;};sap.ui.vtm.Matrix=S.createType("sap.ui.vtm.Matrix",{isValid:function(v){return sap.ui.vtm.Matrix.getBaseType().isValid(v)&&v.length===13;}},S.getType("float[]"));return sap.ui.vtm;});

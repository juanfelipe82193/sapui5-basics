/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/util/ObjectPath","./ContentConnector","./Scene","./ViewStateManagerBase","./Core"],function(O,C,S,V,v){"use strict";var a=V.extend("sap.ui.vk.ViewStateManager",{metadata:{}});var b=a.getMetadata().getParent().getClass().prototype;a.prototype.init=function(){if(b.init){b.init.call(this);}this._implementation=null;};a.prototype.exit=function(){this._destroyImplementation();if(b.exit){b.exit.call(this);}};a.prototype._destroyImplementation=function(){if(this._implementation){this._implementation.destroy();this._implementation=null;}return this;};a.prototype.getImplementation=function(){return this._implementation;};a.prototype._setContent=function(c){var s=null;if(c&&c instanceof S){s=c;}this._setScene(s);};a.prototype._onAfterUpdateContentConnector=function(){this._setContent(this._contentConnector.getContent());};a.prototype._onBeforeClearContentConnector=function(){this._setScene(null);};a.prototype._handleContentReplaced=function(e){this._setContent(e.getParameter("newContent"));};a.prototype._setScene=function(s){if(s&&s instanceof S){var c=s.getMetadata().getName(),i=this._implementation&&this._implementation.getMetadata().getName(),r=c==="sap.ui.vk.dvl.Scene"&&i==="sap.ui.vk.dvl.ViewStateManager"||c==="sap.ui.vk.threejs.Scene"&&i==="sap.ui.vk.threejs.ViewStateManager";if(!r){this._destroyImplementation();var n;if(c==="sap.ui.vk.dvl.Scene"){n="sap.ui.vk.dvl.ViewStateManager";}else if(c==="sap.ui.vk.threejs.Scene"){n="sap.ui.vk.threejs.ViewStateManager";}if(n){var t=this;var d=O.get(n);this._implementation=new d({shouldTrackVisibilityChanges:this.getShouldTrackVisibilityChanges(),recursiveSelection:this.getRecursiveSelection(),contentConnector:this.getContentConnector(),viewManager:this.getViewManager(),visibilityChanged:function(h){t.fireVisibilityChanged({visible:h.getParameter("visible"),hidden:h.getParameter("hidden")});},selectionChanged:function(h){t.fireSelectionChanged({selected:h.getParameter("selected"),unselected:h.getParameter("unselected")});},outliningChanged:function(h){t.fireOutliningChanged({outlined:h.getParameter("outlined"),unoutlined:h.getParameter("unoutlined")});},opacityChanged:function(h){t.fireOpacityChanged({changed:h.getParameter("changed"),opacity:h.getParameter("opacity")});},tintColorChanged:function(h){t.fireTintColorChanged({changed:h.getParameter("changed"),tintColor:h.getParameter("tintColor"),tintColorABGR:h.getParameter("tintColorABGR")});},nodeHierarchyReplaced:function(h){t.fireNodeHierarchyReplaced({oldNodeHierarchy:h.getParameter("oldNodeHierarchy"),newNodeHierarchy:h.getParameter("newNodeHierarchy")});},viewStateApplied:function(h){t.fireViewStateApplied({view:h.getParameter("view")});},transformationChanged:function(h){t.fireTransformationChanged(h.getParameters());},highlightColorChanged:function(h){t.fireHighlightColorChanged(h.getParameters());}});var e=sap.ui.getCore().byId(this.getViewManager());if(e){var g=sap.ui.getCore().byId(e.getAnimationPlayer());if(g){g.setViewStateManager(this._implementation);}}}}}else{this._destroyImplementation();}return this;};a.prototype.getNodeHierarchy=function(){return this._implementation&&this._implementation.getNodeHierarchy();};a.prototype.getVisibilityChanges=function(){return this._implementation&&this._implementation.getVisibilityChanges();};a.prototype.getVisibilityComplete=function(){return this._implementation&&this._implementation.getVisibilityComplete();};a.prototype.getVisibilityState=function(n){return this._implementation&&this._implementation.getVisibilityState(n);};a.prototype.setVisibilityState=function(n,c,r){if(this._implementation){this._implementation.setVisibilityState(n,c,r);}return this;};a.prototype.resetVisibility=function(){return this._implementation&&this._implementation.resetVisibility();};a.prototype.enumerateSelection=function(c){if(this._implementation){this._implementation.enumerateSelection(c);}return this;};a.prototype.enumerateOutlinedNodes=function(c){if(this._implementation&&this._implementation.enumerateOutlinedNodes){this._implementation.enumerateOutlinedNodes(c);}return this;};a.prototype.setShowSelectionBoundingBox=function(c){if(this._implementation){this._implementation.setShowSelectionBoundingBox(c);}};a.prototype.getShowSelectionBoundingBox=function(){if(this._implementation){return this._implementation.getShowSelectionBoundingBox();}};a.prototype.getSelectionState=function(n){return this._implementation&&this._implementation.getSelectionState(n);};a.prototype.setSelectionState=function(n,s,r){if(this._implementation){this._implementation.setSelectionState(n,s,r);}return this;};a.prototype.setSelectionStates=function(s,u,r){if(this._implementation){this._implementation.setSelectionStates(s,u,r);}return this;};a.prototype.getOutliningState=function(n){if(this._implementation&&this._implementation.getOutliningState){return this._implementation.getOutliningState(n);}else{return false;}};a.prototype.setOutliningStates=function(o,u,r){if(this._implementation&&this._implementation.setOutliningStates){this._implementation.setOutliningStates(o,u,r);}return this;};a.prototype.setJoints=function(j){if(this._implementation&&this._implementation.setJoints){this._implementation.setJoints(j);}return this;};a.prototype.getOpacity=function(n){return this._implementation&&this._implementation.getOpacity(n);};a.prototype.setOpacity=function(n,o,r){if(this._implementation){this._implementation.setOpacity(n,o,r);}return this;};a.prototype.getTintColor=function(n,i){return this._implementation&&this._implementation.getTintColor(n,i);};a.prototype.setTintColor=function(n,t,r){if(this._implementation){this._implementation.setTintColor(n,t,r);}return this;};a.prototype.setHighlightColor=function(c){if(this._implementation&&this._implementation.setHighlightColor){this._implementation.setHighlightColor(c);}return this;};a.prototype.getHighlightColor=function(i){if(this._implementation&&this._implementation.getHighlightColor){return this._implementation.getHighlightColor(i);}};a.prototype.setOutlineColor=function(c){if(this._implementation&&this._implementation.setOutlineColor){this._implementation.setOutlineColor(c);}return this;};a.prototype.getOutlineColor=function(i){if(this._implementation&&this._implementation.getOutlineColor){return this._implementation.getOutlineColor(i);}else{return null;}};a.prototype.setOutlineWidth=function(w){if(this._implementation&&this._implementation.setOutlineWidth){this._implementation.setOutlineWidth(w);}return this;};a.prototype.getOutlineWidth=function(){if(this._implementation&&this._implementation.getOutlineWidth){return this._implementation.getOutlineWidth();}else{return 0.0;}};a.prototype.setRecursiveOutlining=function(p){this.setProperty("recursiveOutlining",p,true);if(this._implementation&&this._implementation.setRecursiveOutlining){this._implementation.setRecursiveOutlining(p);}return this;};a.prototype.setRecursiveSelection=function(p){this.setProperty("recursiveSelection",p,true);if(this._implementation){this._implementation.setRecursiveSelection(p);}return this;};a.prototype.setHighlightDisplayState=function(s){if(this._implementation&&this._implementation.setHighlightDisplayState){this._implementation.setHighlightDisplayState(s);}return this;};var f=a.getMetadata().getName();var m={init:function(){this._viewStateManager=null;v.attachEvent(f+"-created",this._handleViewStateManagerCreated,this).attachEvent(f+"-destroying",this._handleViewStateManagerDestroying,this);},exit:function(){this.setViewStateManager(null);v.detachEvent(f+"-destroying",this._handleViewStateManagerDestroying,this).detachEvent(f+"-created",this._handleViewStateManagerCreated,this);},setViewStateManager:function(c){this.setAssociation("viewStateManager",c,true);this._updateViewStateManager();return this;},_updateViewStateManager:function(){var n=this.getViewStateManager(),c=n&&sap.ui.getCore().byId(n)||null;if(this._viewStateManager!==c){this._clearViewStateManager();if(c){if(this._handleNodeHierarchyReplaced){c.attachNodeHierarchyReplaced(this._handleNodeHierarchyReplaced,this);}if(this._handleVisibilityChanged){c.attachVisibilityChanged(this._handleVisibilityChanged,this);}if(this._handleSelectionChanged){c.attachSelectionChanged(this._handleSelectionChanged,this);}if(this._handleOutliningChanged){c.attachOutliningChanged(this._handleOutliningChanged,this);}if(this._handleOutlineColorChanged){c.attachOutlineColorChanged(this._handleOutlineColorChanged,this);}if(this._handleOutlineWidthChanged){c.attachOutlineWidthChanged(this._handleOutlineWidthChanged,this);}if(this._handleOpacityChanged){c.attachOpacityChanged(this._handleOpacityChanged,this);}if(this._handleHighlightColorChanged){c.attachHighlightColorChanged(this._handleHighlightColorChanged,this);}if(this._handleTintColorChanged){c.attachTintColorChanged(this._handleTintColorChanged,this);}if(this._handleTransformationChanged){c.attachTransformationChanged(this._handleTransformationChanged,this);}if(this._handleViewStateApplied){c.attachViewStateApplied(this._handleViewStateApplied,this);}this._viewStateManager=c;if(this._onAfterUpdateViewStateManager){this._onAfterUpdateViewStateManager();}}}return this;},_clearViewStateManager:function(){if(this._viewStateManager){if(this._onBeforeClearViewStateManager){this._onBeforeClearViewStateManager();}if(this._handleTransformationChanged){this._viewStateManager.detachTransformationChanged(this._handleTransformationChanged,this);}if(this._handleTintColorChanged){this._viewStateManager.detachTintColorChanged(this._handleTintColorChanged,this);}if(this._handleHighlightColorChanged){this._viewStateManager.detachHighlightColorChanged(this._handleHighlightColorChanged,this);}if(this._handleSelectionChanged){this._viewStateManager.detachSelectionChanged(this._handleSelectionChanged,this);}if(this._handleOutliningChanged){this._viewStateManager.detachOutliningChanged(this._handleOutliningChanged,this);}if(this._handleOutlineColorChanged){this._viewStateManager.detachOutlineColorChanged(this._handleOutlineColorChanged,this);}if(this._handleOutlineWidthChanged){this._viewStateManager.detachOutlineWidthChanged(this._handleOutlineWidthChanged,this);}if(this._handleVisibilityChanged){this._viewStateManager.detachVisibilityChanged(this._handleVisibilityChanged,this);}if(this._handleNodeHierarchyReplaced){this._viewStateManager.detachNodeHierarchyReplaced(this._handleNodeHierarchyReplaced,this);}if(this._handleViewStateApplied){this._viewStateManager.detachViewStateApplied(this._handleViewStateApplied,this);}this._viewStateManager=null;}return this;},_handleViewStateManagerCreated:function(e){if(this.getViewStateManager()===e.getParameter("object").getId()){this._updateViewStateManager();}},_handleViewStateManagerDestroying:function(e){if(this.getViewStateManager()===e.getParameter("object").getId()){this._clearViewStateManager();}}};a.injectMethodsIntoClass=function(c){var p=c.prototype,i=p.init,e=p.exit;p.init=function(){if(i){i.call(this);}m.init.call(this);};p.exit=function(){m.exit.call(this);if(e){e.call(this);}};p.setViewStateManager=m.setViewStateManager;p._updateViewStateManager=m._updateViewStateManager;p._clearViewStateManager=m._clearViewStateManager;p._handleViewStateManagerCreated=m._handleViewStateManagerCreated;p._handleViewStateManagerDestroying=m._handleViewStateManagerDestroying;};v.registerClass(a);C.injectMethodsIntoClass(a);return a;});

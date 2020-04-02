/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./Tool","./TooltipToolHandler","./TooltipToolGizmo"],function(T,a,b){"use strict";var c=T.extend("sap.ui.vk.tools.TooltipTool",{metadata:{events:{hover:{parameters:{x:"int",y:"int",nodeRef:"any"}}}},constructor:function(i,s){if(c._instance){return c._instance;}T.apply(this,arguments);this._viewport=null;this._handler=new a(this);c._instance=this;}});c.prototype.init=function(){if(T.prototype.init){T.prototype.init.call(this);}this.setFootprint(["sap.ui.vk.threejs.Viewport"]);this.setAggregation("gizmo",new b());};c.prototype.setActive=function(v,d,g){T.prototype.setActive.call(this,v,d,g);if(this._viewport){if(v){this._gizmo=this.getGizmo();if(this._gizmo){this._gizmo.show(this._viewport,this);}this._addLocoHandler();}else{this._removeLocoHandler();if(this._gizmo){this._gizmo.hide();this._gizmo=null;}}}return this;};c.prototype.setTitle=function(t){if(this._gizmo){this._gizmo.setTitle(t);}return this;};c.prototype.queueCommand=function(d){if(this._addLocoHandler()){if(this.isViewportType("sap.ui.vk.threejs.Viewport")){d();}}return this;};return c;});

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/ui/core/Control","./EntityCustomActionRenderer"],function(l,C,E){"use strict";var a=l.EntityCSSSize;var b=C.extend("sap.landvisz.internal.EntityCustomAction",{metadata:{library:"sap.landvisz",properties:{customAction:{type:"string",group:"Data",defaultValue:null},renderingSize:{type:"sap.landvisz.EntityCSSSize",group:"Dimension",defaultValue:a.Regular}},events:{select:{}}}});b.prototype.init=function(){this.initializationDone=false;this.lastButton=false;};b.prototype.exit=function(){this.customAction&&this.customAction.destroy();};b.prototype.initControls=function(){var c=this.getId();};b.prototype.select=function(e){this.fireSelect();};b.prototype.onclick=function(e){this.fireSelect();};return b;});

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/ui/core/Control","sap/ui/commons/Image","sap/ui/commons/Label","./SingleDataContainerRenderer"],function(l,C,I,L,S){"use strict";var a=C.extend("sap.landvisz.internal.SingleDataContainer",{metadata:{library:"sap.landvisz",properties:{header:{type:"string",group:"Data",defaultValue:null},renderingSize:{type:"string",group:"Dimension",defaultValue:null}},aggregations:{properties:{type:"sap.ui.core.Control",multiple:true,singularName:"property"}},events:{closed:{}}}});a.prototype.init=function(){this.initializationDone=false;this.isModelOpen=false;};a.prototype.exit=function(){};a.prototype.initControls=function(){var n=this.getId();if(!this.headerLabel)this.headerLabel=new L(n+"-CLVHeaderLabel");if(!this.closeIcon)this.closeIcon=new I(n+"-CLVSMVClose");};a.prototype.isOpen=function(){return this.isModelOpen;};a.prototype.onclick=function(e){if(e.target.id=="closeVM"){jQuery(e.currentTarget).hide("slow");this.isModelOpen=false;this.fireClosed();}else{e.stopImmediatePropagation();}};return a;});

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/ui/core/Control","sap/ui/commons/TextView","./LongTextFieldRenderer"],function(l,C,T,L){"use strict";var a=C.extend("sap.landvisz.LongTextField",{metadata:{library:"sap.landvisz",properties:{text:{type:"string",group:"Data",defaultValue:null},renderingSize:{type:"sap.landvisz.EntityCSSSize",group:"Dimension",defaultValue:null}}}});a.prototype.init=function(){};a.prototype.exit=function(){this.oLinearRowFieldLabel&&this.oLinearRowFieldLabel.destroy();};a.prototype.initControls=function(){var n=this.getId();if(!this.oLongText)this.oLongText=new T(n+"-CLVConValue");};return a;});

/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";var C=C.extend("sap.ui.mdc.Control",{metadata:{library:"sap.ui.mdc",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%",invalidate:true},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%",invalidate:true},delegate:{type:"object",group:"Data"},personalization:{type:"any",multiple:false}}},renderer:C.renderer});C.prototype.setDelegate=function(d){this.oDelegatePromise=new Promise(function(r,a){sap.ui.require([d.name],function(D){this.DELEGATE=D;r(D);}.bind(this),function(){a("Module not found control is not ready to use");});}.bind(this));return this.setProperty("delegate",d,true);};C.prototype.exit=function(){};return C;});

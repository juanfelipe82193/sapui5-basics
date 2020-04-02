/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"],function(C){"use strict";var E=C.extend("sap.ui.mdc.Element",{metadata:{library:"sap.ui.mdc",properties:{delegate:{type:"object",group:"Data"}}},renderer:C.renderer});E.prototype.setDelegate=function(d){if(this.oDelegatePromise){throw new Error("setDelegate function can only be called once");}this.oDelegatePromise=new Promise(function(r,a){sap.ui.require([d.name],function(D){this.DELEGATE=D;r();}.bind(this),function(){a("Module '"+d.name+"' not found control is not ready to use");});}.bind(this));return this.setProperty("delegate",d,true);};E.prototype.exit=function(){};return E;});

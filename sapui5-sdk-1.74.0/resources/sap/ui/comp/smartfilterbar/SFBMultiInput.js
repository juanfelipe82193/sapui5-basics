/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/m/MultiInput","sap/m/MultiInputRenderer"],function(M,a){"use strict";var S=M.extend("sap.ui.comp.smartfilterbar.SFBMultiInput",{metadata:{library:"sap.ui.comp"},renderer:a});S.prototype.onBeforeRendering=function(){M.prototype.onBeforeRendering.apply(this,arguments);if(this.getValue()){this._validateCurrentText(true);}};return S;});

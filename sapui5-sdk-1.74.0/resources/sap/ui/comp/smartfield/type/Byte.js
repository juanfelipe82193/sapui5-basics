/*
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/model/odata/type/Byte"],function(B){"use strict";var a=B.extend("sap.ui.comp.smartfield.type.Byte",{constructor:function(f,c){B.apply(this,arguments);this.oFieldControl=null;}});a.prototype.parseValue=function(v,s){var r=B.prototype.parseValue.apply(this,arguments);if(typeof this.oFieldControl==="function"){this.oFieldControl(v,s);}return r;};a.prototype.destroy=function(){B.prototype.destroy.apply(this,arguments);this.oFieldControl=null;};a.prototype.getName=function(){return"sap.ui.comp.smartfield.type.Byte";};return a;});

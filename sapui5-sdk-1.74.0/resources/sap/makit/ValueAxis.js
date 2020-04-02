/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["./library","./Axis"],function(m,A){"use strict";var V=A.extend("sap.makit.ValueAxis",{metadata:{deprecated:true,library:"sap.makit",properties:{min:{type:"string",group:"Misc",defaultValue:null},max:{type:"string",group:"Misc",defaultValue:null}}}});V.prototype.init=function(){this.setShowGrid(true);this.setShowPrimaryLine(false);};return V;});

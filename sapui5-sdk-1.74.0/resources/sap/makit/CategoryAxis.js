/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["./library","./Axis"],function(m,A){"use strict";var S=m.SortOrder;var C=A.extend("sap.makit.CategoryAxis",{metadata:{deprecated:true,library:"sap.makit",properties:{sortOrder:{type:"sap.makit.SortOrder",group:"Misc",defaultValue:S.None},displayLastLabel:{type:"boolean",group:"Misc",defaultValue:false},displayAll:{type:"boolean",group:"Misc",defaultValue:true}}}});C.prototype.init=function(){this.setShowGrid(false);this.setShowPrimaryLine(true);};return C;});

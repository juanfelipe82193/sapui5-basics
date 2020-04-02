/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata"],function(M){"use strict";var V=M.extend("sap.fe.macros.ValueHelp",{name:"ValueHelp",namespace:"sap.fe.macros",fragment:"sap.fe.macros.ValueHelp",metadata:{stereotype:"xmlmacro",properties:{idPrefix:{type:"string",defaultValue:"VH"},entitySet:{type:"sap.ui.model.Context",required:true,$kind:"EntitySet"},property:{type:"sap.ui.model.Context",required:true,$kind:"Property"},conditionModel:{type:"string",defaultValue:""}},events:{}}});return V;});

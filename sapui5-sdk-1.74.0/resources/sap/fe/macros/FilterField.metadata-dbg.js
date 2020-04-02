/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata"],function(M){"use strict";var F=M.extend("sap.fe.macros.FilterField",{name:"FilterField",namespace:"sap.fe.macros",fragment:"sap.fe.macros.FilterField",metadata:{stereotype:"xmlmacro",designtime:"sap/fe/macros/FilterField.designtime",properties:{idPrefix:{type:"string",defaultValue:"FF"},vhIdPrefix:{type:"string",defaultValue:"FFVH"},entitySet:{type:"sap.ui.model.Context",required:true,$kind:"EntitySet"},property:{type:"sap.ui.model.Context",required:true,$kind:"Property"},_valueList:{type:"sap.ui.model.Context",required:false}},events:{}}});return F;});

/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/mdc/library','sap/ui/mdc/field/InParameter'],function(l,I){"use strict";var O=l.OutParameterMode;var a=I.extend("sap.ui.mdc.field.OutParameter",{metadata:{library:"sap.ui.mdc",properties:{fixedValue:{type:"any",defaultValue:null},mode:{type:"sap.ui.mdc.OutParameterMode",defaultValue:O.Always}},defaultProperty:"value"}});return a;});

/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/base/DataType'],function(D){"use strict";var I={replace:function(n){var t=D.getType("sap.ui.core.ID");if(!t.isValid(n)){n=n.replace(/[^A-Za-z0-9_.:]+/g,"_");if(!t.isValid(n)){n="A_"+n;}}return n;}};return I;},true);

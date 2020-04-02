/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define(['sap/ui/core/Control'], function(oControl) {
	"use strict";

	var Column = oControl.extend("composites.Column", {
		metadata : {
			properties : {
				label : "string",
				path : "string",
				asLink : {
					type : "boolean",
					defaultValue : false
				},
				key : "string"
			}
		}
	});

	return Column;

}, /* bExport= */true);

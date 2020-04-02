/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define(['sap/ui/core/Control'], function(oControl) {
	"use strict";

	var Action = oControl.extend("composites.Action", {
		metadata : {
			properties : {
				text : "string"
			},
			events: {
				call: {
					parameters: {
					}
				}
			}
		}
	});

	return Action;

}, /* bExport= */true);

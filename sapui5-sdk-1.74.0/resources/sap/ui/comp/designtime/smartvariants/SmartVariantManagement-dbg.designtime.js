/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides the Design Time Metadata for the sap.ui.comp.smartvariants.SmartVariantManagement control.
sap.ui.define([], function() {
	"use strict";
	return {
		actions: "not-adaptable",
		aggregations: {
			personalizableControls: {
				propagateMetadata : function () {
					return {
						actions: "not-adaptable"
					};
				}
			}
		},
		annotations: {},
		properties: {
			persistencyKey: {
				ignore: true
			},
			entitySet: {
				ignore: true
			}
		},
		customData: {}
	};
});
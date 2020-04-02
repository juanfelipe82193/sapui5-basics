/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides the Design Time Metadata for the sap.m.Table control
sap.ui.define([], function() {
	"use strict";

	return {
		name: "{name}",
		description: "{description}",
		aggregations: {
			// Disable RTA for columns aggregation for now
			columns: {
				ignore: true
			}
		}
	};

});
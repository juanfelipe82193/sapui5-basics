/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides the Design Time Metadata for the ...
sap.ui.define([], function() {
	"use strict";

	return {
		tool: {
			start: function(oPanel) {
				oPanel.setEnablePersonalization(false);

			},
			stop: function(oPanel) {
				oPanel.setEnablePersonalization(true);
			}
		}
	};

});
/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides the Design Time Metadata for the sap.ui.mdc.field.FieldInfo
sap.ui.define([], function() {
	"use strict";

	return {
		aggregations: {
			contentHandler: {
				ignore: true
			}
		},
		tool: {
			start: function(oFieldInfo) {
				if (oFieldInfo.getContentHandler()) {
					oFieldInfo.getContentHandler().setEnablePersonalization(false);
				}
			},
			stop: function(oFieldInfo) {
				if (oFieldInfo.getContentHandler()) {
					oFieldInfo.getContentHandler().setEnablePersonalization(true);
				}
			}
		}
	};

});
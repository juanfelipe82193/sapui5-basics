/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides function sap.ui.vk.getResourceBundle.
sap.ui.define([
	"sap/ui/core/Core",
	"sap/base/util/ObjectPath"
], function(
	core,
	ObjectPath
) {
	"use strict";

	var getResourceBundle = function() {
		var resourceBundle = core.getLibraryResourceBundle("sap.ui.vk.i18n");
		// Cannot use vkLibrary as it leads to a circular dependency.
		ObjectPath.get("sap.ui.vk").getResourceBundle = function() {
			return resourceBundle;
		};
		return resourceBundle;
	};

	return getResourceBundle;

}, /* bExport= */ true);

/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

/**
 * Initialization Code and shared classes of library sap.ui.generic.template.
 */
sap.ui.define(['sap/ui/core/library', 'sap/ui/comp/library', 'sap/ui/generic/app/library'],
	function() {
	"use strict";

	/**
	 * SAPUI5 library that provides functionality used by Smart Template Applications.
	 *
	 *
	 *
	 * @namespace
	 * @name sap.ui.generic.template
	 * @author SAP SE
	 * @version 1.74.0
	 * @private
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ui.generic.template",
		version: "1.74.0",
		dependencies : ["sap.ui.core", "sap.ui.comp", "sap.ui.generic.app"],
		types: [],
		interfaces: [],
		controls: [],
		elements: [],
		noLibraryCSS: true
	});

	return sap.ui.generic.template;

}, /* bExport= */ true);
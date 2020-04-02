/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

/**
 * Initialization Code and shared classes of library sap.ndc.
 */
sap.ui.define(['sap/m/library', 'sap/ui/core/library'],
	function(library2, library1) {
	"use strict";


	/**
	 * SAPUI5 library with controls with native device capabilities.
	 *
	 * @namespace
	 * @name sap.ndc
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ndc",
		dependencies : ["sap.ui.core","sap.m"],
		types: [],
		interfaces: [],
		controls: [
			"sap.ndc.BarcodeScannerButton"
		],
		elements: [],
		noLibraryCSS: true,
		version: "1.74.0"
	});

	return sap.ndc;

});
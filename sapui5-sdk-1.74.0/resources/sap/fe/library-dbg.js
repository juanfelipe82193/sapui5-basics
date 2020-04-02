/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 * @namespace reserved for Fiori Elements
 * @name sap.fe
 * @private
 * @experimental
 */

/**
 * Initialization Code and shared classes of library sap.fe
 */
sap.ui.define(
	["sap/fe/core/coreLibrary", "sap/fe/templates/templateLibrary"],
	function(coreLibrary, templateLibrary) {
		"use strict";

		/**
		 * Fiori Elements Library
		 *
		 * @namespace
		 * @name sap.fe
		 * @private
		 * @experimental
		 */

		// library dependencies
		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "sap.fe",
			dependencies: ["sap.ui.core"],
			types: ["sap.fe.templates.VariantManagement", "sap.fe.templates.ObjectPage.SectionLayout"],
			interfaces: [],
			controls: [],
			elements: [],
			version: "1.74.0",
			noLibraryCSS: true
		});

		coreLibrary.init();
		templateLibrary.init();
		return sap.fe;
	},
	/* bExport= */ false
);

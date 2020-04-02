/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright
        2009-2014 SAP SE. All rights reserved
    
 */

/**
 * Initialization Code and shared classes of library sap.ca.scfld.md.
 */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/library", // library dependency
	"sap/m/library", // library dependency
	"sap/ca/ui/library" // library dependency
], function() {

	/**
	 * SAP UI library: Scaffolding for Master Detail applications
	 *
	 * @namespace
	 * @name sap.ca.scfld.md
	 * @public
	 */


	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ca.scfld.md",
		dependencies : ["sap.ui.core","sap.m","sap.ca.ui"],
		types: [],
		interfaces: [],
		controls: [],
		elements: [],
		noLibraryCSS: true,
		version: "1.74.0"
	});

	return sap.ca.scfld.md;

});

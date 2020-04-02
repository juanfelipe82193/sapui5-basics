/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 */

/**
 * Initialization Code and shared classes of library sap.apf.
 */
sap.ui.define([
	"sap/ui/core/Core",
	// library dependencies
	"sap/ui/core/library",
	"sap/suite/ui/commons/library",
	"sap/m/library",
	"sap/ui/layout/library",
	"sap/ushell/library",
	"sap/viz/library",
	"sap/ui/comp/library",
	"sap/ui/export/library",
	"sap/ui/table/library"
], function() {

	/**
	 * Analysis Path Framework
	 *
	 * @namespace
	 * @name sap.apf
	 * @public
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.apf",
		dependencies : [
			"sap.ui.core",
			"sap.suite.ui.commons",
			"sap.m","sap.ui.layout",
			"sap.ushell",
			"sap.viz",
			"sap.ui.comp",
			"sap.ui.export",
			"sap.ui.table"
		],
		types: [],
		interfaces: [],
		controls: [],
		elements: [],
		noLibraryCSS: true,
		version: "1.74.0"
	});

	return sap.apf;

});

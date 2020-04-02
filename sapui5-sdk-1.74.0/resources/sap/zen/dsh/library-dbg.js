/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */

/**
 * Initialization Code and shared classes of library sap.zen.dsh.
 */
sap.ui.define([
	"sap/ui/core/Core", // sap.ui.getCore()
	"sap/ui/core/library", // library dependency
	"sap/ui/layout/library", // library dependency
	"sap/ui/table/library", // library dependency
	"sap/m/library", // library dependency
	"sap/zen/commons/library", // library dependency
	"sap/zen/crosstab/library" // library dependency
], function() {

	/**
	 * Design Studio Runtime Library.  Intended only to be used within S/4 HANA Fiori applications.
	 *
	 * @namespace
	 * @name sap.zen.dsh
	 * @public
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.zen.dsh",
		dependencies : ["sap.ui.core","sap.ui.table","sap.ui.layout","sap.m","sap.zen.commons","sap.zen.crosstab"],
		types: [],
		interfaces: [],
		controls: [
			"sap.zen.dsh.AnalyticGrid",
			"sap.zen.dsh.Dsh"
		],
		elements: [],
		noLibraryCSS: true,
		version: "1.74.0"
	});

	return sap.zen.dsh;

});

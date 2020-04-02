/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */

/**
 * Initialization Code and shared classes of library sap.zen.crosstab.
 */
sap.ui.define([
	"sap/ui/core/Core", // sap.ui.getCore()
	"sap/ui/core/library" // library dependency
], function() {

	/**
	 * Design Studio Crosstab library.  NOT INTENDED FOR STANDALONE USAGE.
	 *
	 * @namespace
	 * @name sap.zen.crosstab
	 * @public
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.zen.crosstab",
		dependencies : ["sap.ui.core"],
		types: [],
		interfaces: [],
		controls: [
			"sap.zen.crosstab.Crosstab",
			"sap.zen.crosstab.DataCell",
			"sap.zen.crosstab.HeaderCell"
		],
		elements: [],
		version: "1.74.0"
	});

	return sap.zen.crosstab;
});

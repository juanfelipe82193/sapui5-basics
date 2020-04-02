/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/**
 * Initialization Code and shared classes of library sap.ui.export.
 */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/library'
], function(jQuery, library1) {
	"use strict";

	/**
	 * UI5 library: sap.ui.export - document export utilities
	 *
	 * @namespace
	 * @name sap.ui.export
	 * @author SAP SE
	 * @version 1.74.0
	 * @public
	 */

	sap.ui.getCore().initLibrary({
		name: "sap.ui.export",
		dependencies: [
			"sap.ui.core"
		],
		types: [
			"sap.ui.export.EdmType"
		],
		interfaces: [],
		controls: [],
		elements: [],
		version: "1.74.0"
	});


	/**
	 * EDM data types for document export.
	 *
	 * @enum {string}
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 * @public
	 * @since 1.50.0
	 */
	sap.ui.export.EdmType = {

		/**
		 * Property of type bignumber.
		 *
		 * @public
		 */
		BigNumber : "BigNumber",

		/**
		 * Property of type boolean.
		 *
		 * @public
		 */
		Boolean : "Boolean",

		/**
		 * Property of type Currency
		 *
		 * @public
		 */
		Currency : "Currency",

		/**
		 * Property of type Date.
		 *
		 * @public
		 */
		Date : "Date",

		/**
		 * Property of type DateTime.
		 *
		 * @public
		 */
		DateTime : "DateTime",

		/**
		 * Property of type Enumeration.
		 *
		 * @public
		 */
		Enumeration : "Enumeration",

		/**
		 * Property of type Number.
		 *
		 * @public
		 */
		Number : "Number",

		/**
		 * Property of type string.
		 *
		 * @public
		 */
		String : "String",

		/**
		 * Property of type Time.
		 *
		 * @public
		 */
		Time : "Time"
	};


	// Register shims for non UI5 modules as these seem to have conflict with requirejs (if it is loaded before these modules)
	// Hence disable AMD loader for these modules to enable content retrieval via global names. (Enable using Browserify modules with RequireJS)
	jQuery.sap.registerModuleShims({
		'sap/ui/export/js/XLSXBuilder': {
			amd: true,
			exports: 'XLSXBuilder'
		},
		'sap/ui/export/js/XLSXExportUtils': {
			amd: true,
			exports: 'XLSXExportUtils'
		}
	});

	return sap.ui.export;

});

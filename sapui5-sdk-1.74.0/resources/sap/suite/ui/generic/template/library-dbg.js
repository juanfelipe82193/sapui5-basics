/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

/**
 * @namespace reserved for Smart Templates
 * @name sap.suite.ui.generic.template
 * @public
 */

/**
 * Initialization Code and shared classes of library sap.suite.ui.generic.template.
 */
sap.ui.define(['sap/ui/core/library'
], function(library1) {
	"use strict";

	/**
	 * Library with generic Suite UI templates.
	 *
	 * @namespace
	 * @name sap.suite.ui.generic.template
	 * @public
	 */

	// library dependencies
	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name: "sap.suite.ui.generic.template",
		dependencies: [
			"sap.ui.core"
		],
		designtime: "sap/suite/ui/generic/template/designtime/library.designtime",
		types: [],
		interfaces: [],
		controls: [],
		elements: [],
		version: "1.74.0",
		extensions: {
			//Configuration used for rule loading of Support Assistant
			"sap.ui.support": {
				publicRules: true,
				internalRules: false,
				diagnosticPlugins: [
					"sap/suite/ui/generic/template/support/DiagnosticsTool/DiagnosticsTool"
				]
			},
			flChangeHandlers: {
				"sap.m.Button": {
					"addToolbarActionButton": "sap/suite/ui/generic/template/changeHandler/AddToolbarActionButton",
					"addHeaderActionButton": "sap/suite/ui/generic/template/changeHandler/AddHeaderActionButton",
					"addFooterActionButton": "sap/suite/ui/generic/template/changeHandler/AddFooterActionButton"
				},
				"sap.m.OverflowToolbar": {
					"addToolbarActionButton": "sap/suite/ui/generic/template/changeHandler/AddToolbarActionButton",
					"addFooterActionButton": "sap/suite/ui/generic/template/changeHandler/AddFooterActionButton"
				},
				"sap.uxap.ObjectPageHeader": {
					"addHeaderActionButton": "sap/suite/ui/generic/template/changeHandler/AddHeaderActionButton"
				},
				"sap.uxap.ObjectPageHeaderActionButton": {
					"addHeaderActionButton": "sap/suite/ui/generic/template/changeHandler/AddHeaderActionButton"
				},
				"sap.uxap.ObjectPageDynamicHeaderTitle": {
					"addHeaderActionButton": "sap/suite/ui/generic/template/changeHandler/AddHeaderActionButton"
				}
			}
		}
	});

	return sap.suite.ui.generic.template;

}, /* bExport= */false);

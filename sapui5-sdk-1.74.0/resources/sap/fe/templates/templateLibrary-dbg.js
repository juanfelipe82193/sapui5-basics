/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 * @namespace reserved for Fiori Elements
 * @name sap.fe.templates
 * @private
 * @experimental
 */

/**
 * Initialization Code and shared classes of library sap.fe.templates
 */
sap.ui.define(
	[],
	function() {
		"use strict";

		/**
		 * Fiori Elements Templates Library
		 *
		 * @namespace
		 * @name sap.fe.templates
		 * @private
		 * @experimental
		 */

		// library dependencies
		// delegate further initialization of this library to the Core
		// sap.ui.getCore().initLibrary({
		// 	name: "sap.fe.templates",
		// 	dependencies: ["sap.ui.core"],
		// 	types: ["sap.fe.templates.VariantManagement"],
		// 	interfaces: [],
		// 	controls: [],
		// 	elements: [],
		// 	version: "1.74.0"
		// });

		var templateLibrary = {
			init: function() {
				if (!sap.fe.templates) {
					sap.fe.templates = {};
				}
				sap.fe.templates.VariantManagement = {
					/**
					 * No variant management at all.
					 * @public
					 */
					None: "None",

					/**
					 * One variant configuration for the whole page.
					 * @public
					 */
					Page: "Page",

					/**
					 * Variant management on control level.
					 * @public
					 */
					Control: "Control"
				};
				if (!sap.fe.templates.ObjectPage) {
					sap.fe.templates.ObjectPage = {};
				}
				sap.fe.templates.ObjectPage.SectionLayout = {
					/**
					 * All sections are shown in one page
					 * @public
					 */
					Page: "Page",

					/**
					 * All top-level sections are shown in an own tab
					 * @public
					 */
					Tabs: "Tabs"
				};
			}
		};

		return templateLibrary;
	},
	/* bExport= */ false
);

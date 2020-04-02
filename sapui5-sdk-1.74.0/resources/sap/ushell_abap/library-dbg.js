/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */

sap.ui.define([
	"sap/ui/core/library",
	"sap/m/library"
],
	function(coreLib, mLib) {
	"use strict";

	/**
	 * SAP library: sap.ushell_abap
	 * provides base functions for the Fiori Launchpad running under SAP NetWeaver
	 *
	 * @namespace
	 * @name sap.ushell_abap
	 * @author SAP SE
	 * @version 1.74.0
	 * @private
	 * @sap-restricted
	 *
	 */
	sap.ui.getCore().initLibrary({
		name:"sap.ushell_abap",
		version:"1.74.0",
		dependencies:["sap.ui.core","sap.m"],
		noLibraryCSS: true,
		extensions: {
			"sap.ui.support": {
				diagnosticPlugins: [
					"sap/ushell_abap/support/plugins/app-infra/AppInfraOnSapNetWeaverSupportPlugin"
				]
			}
		}
	});

	return sap.ushell_abap;

}, /* bExport= */ true);
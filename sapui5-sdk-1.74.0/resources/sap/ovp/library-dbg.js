/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/**
 * Initialization Code and shared classes of library sap.ovp (1.74.0)
 */
sap.ui.define([
	"sap/ui/core/library", // library dependency
	"sap/ui/layout/library", // library dependency
	"sap/ui/generic/app/library", // library dependency
	"sap/m/library", // library dependency
	"sap/f/library", // library dependency
	"sap/ui/comp/library", // library dependency
	"sap/ui/rta/library",
	"sap/suite/ui/microchart/library"
	], // library dependency
	function() {
	'use strict';
	sap.ui.getCore().initLibrary({
		name : "sap.ovp",
		dependencies: ["sap.ui.core","sap.ui.layout","sap.ui.generic.app",
			"sap.m", "sap.f", "sap.ui.comp", "sap.ui.rta","sap.suite.ui.microchart"],
		types: [],
		interfaces: [],
		controls: [],
		elements: [],
		version: "1.74.0",
		extensions: {
			flChangeHandlers: {
				"sap.ovp.ui.EasyScanLayout" : "sap/ovp/flexibility/EasyScanLayout",
				"sap.ovp.ui.DashboardLayout" : "sap/ovp/flexibility/DashboardLayout"
			},
        "sap.ui.support": {
            diagnosticPlugins: [
                "sap/ovp/support/DiagnosticsTool/DiagnosticsTool"
            ]
        }
		}
	});

	/**
	 * SAP library: sap.ovp
	 *
	 * @namespace
	 * @alias sap.ovp
	 * @public
	 */
	var thisLibrary = sap.ovp;
	return thisLibrary;

});
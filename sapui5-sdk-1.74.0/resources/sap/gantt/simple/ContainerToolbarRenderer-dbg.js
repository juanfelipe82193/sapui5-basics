/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(["sap/ui/core/Renderer", "sap/m/OverflowToolbarRenderer"], function (Renderer, OverflowToolbarRenderer) {
	"use strict";

	/**
	 * Gantt Chart Container Toolbar renderer.
	 * @namespace
	 */
	var ToolbarRenderer = Renderer.extend(OverflowToolbarRenderer);

	return ToolbarRenderer;
}, /* bExport= */ true);

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
], function(
) {
	"use strict";

	/**
	 * DrawerToolbar renderer.
	 * @namespace
	 */
	var DrawerToolbarRenderer = {};

	/**
	 * Renders the DrawerToolbar's HTML, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oDrawerToolbar An object representation of the control that should be rendered
	 */
	DrawerToolbarRenderer.render = function(oRM, oDrawerToolbar) {
		oRM.write("<div ");

		oRM.writeControlData(oDrawerToolbar);

		oRM.addClass("drawerToolbar");

		if (!oDrawerToolbar.getExpanded()) {
			oRM.addClass("drawerToolbarCollapsed");
		} else {
			oRM.addClass("drawerToolbarExpanded");
		}

		oRM.writeClasses();

		oRM.write(">");

		oRM.renderControl(oDrawerToolbar._container);

		oRM.write("</div>");
	};

	return DrawerToolbarRenderer;

}, /* bExport= */ true);

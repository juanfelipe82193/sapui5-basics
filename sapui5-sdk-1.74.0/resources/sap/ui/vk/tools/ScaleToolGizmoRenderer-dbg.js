/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
], function() {
	"use strict";

	/**
	 * MoveToolGizmoRenderer renderer.
	 * @namespace
	 */
	var MoveToolGizmoRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control} control
	 *            the control to be rendered
	 */
	MoveToolGizmoRenderer.render = function(rm, control) {
		rm.write("<div");
		rm.writeControlData(control);
		rm.addClass("sapUiVkTransformationToolEdit");
		rm.writeClasses();
		rm.write(">");
		rm.renderControl(control._editingForm);
		rm.write("</div>");
	};

	return MoveToolGizmoRenderer;

}, /* bExport= */ true);

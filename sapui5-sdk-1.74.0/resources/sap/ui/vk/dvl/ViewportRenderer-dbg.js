/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
], function() {
	"use strict";

	/**
	 * Viewport renderer.
	 * @namespace
	 */
	var ViewportRenderer = {};

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
	ViewportRenderer.render = function(rm, control) {

		rm.write("<div");
		rm.writeControlData(control);
		rm.addClass("sapVizKitViewport");
		rm.writeClasses();
		rm.writeAttribute("tabindex", 0);
		rm.writeAttribute("aria-label", "Image");

		var addStyle = false;
		var width = control.getWidth();
		if (width) {
			rm.addStyle("width", width);
			addStyle = true;
		}
		var height = control.getHeight();
		if (height) {
			rm.addStyle("height", height);
			addStyle = true;
		}
		if (addStyle) {
			rm.writeStyles();
		}

		rm.write(">");

		var i, l;

		// Render gizmos of active tools
        var oTools = control.getTools();
		for (i = 0, l = oTools.length; i < l; i++) { // loop over all oTools
            var _tool =  sap.ui.getCore().byId(oTools[i]); // get control for associated control
            var _gizmo = _tool.getGizmoForContainer(control);
            if (_gizmo && _gizmo.render === undefined) {
               rm.renderControl(_gizmo);
            }
        }

		var aContent = control.getContent();
		for (i = 0, l = aContent.length; i < l; i++) {
			rm.renderControl(aContent[i]);
		}

		rm.write("</div>");

	};

	return ViewportRenderer;

}, /* bExport= */ true);

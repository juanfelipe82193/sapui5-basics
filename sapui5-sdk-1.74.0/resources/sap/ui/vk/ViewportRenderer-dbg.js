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
	 * @since 1.32.0
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
		if (control._implementation) {
			rm.writeAttribute("tabindex", -1);
		} else {
			rm.writeAttribute("tabindex", 0);
		}
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
		if (control._implementation) {
			rm.renderControl(control._implementation);
		} else if (control.getContent()) {
			var aContent = control.getContent();
			for (var i = 0, l = aContent.length; i < l; i++) {
				rm.renderControl(aContent[i]);
			}
		}
		rm.write("</div>");
	};

	return ViewportRenderer;

}, /* bExport= */ true);

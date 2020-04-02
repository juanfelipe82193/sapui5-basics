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

	ViewportRenderer.render = function(rm, control) {
		rm.write("<div");
		rm.writeControlData(control);
		rm.addClass("sapVizKitViewport");
		rm.writeClasses();
		rm.writeAttribute("tabindex", 0);
		rm.writeAttribute("aria-label", "Image");
		rm.addStyle("width", control.getWidth());
		rm.addStyle("height", control.getHeight());
		rm.writeStyles();
		rm.write(">");

		var i, l;

		// Render gizmos of active tools
		var oTools = control.getTools();
		for (i = 0, l = oTools.length; i < l; i++) { // loop over all oTools
			var _tool =  sap.ui.getCore().byId(oTools[i]); // get control for associated control
			var _gizmo = _tool.getGizmoForContainer(control);
			if (_gizmo && _gizmo.hasDomElement()) {
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

}, /* bExport = */ true);

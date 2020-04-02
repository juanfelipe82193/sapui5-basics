/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([], function() {
	"use strict";
	/**
	 * @class SmartMicroChart renderer.
	 * @static
	 * @version 1.74.0
	 * @since 1.38.0
	 */
	var SmartMicroChartRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	SmartMicroChartRenderer.render = function(oRm, oControl) {
		if (oControl._bIsInitialized) {
			oRm.write("<div");
			oRm.writeControlData(oControl);

			if (oControl.getIsResponsive()) {
				oRm.addClass("sapSuiteUiSmartMicroChartResponsive");
			}

			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oControl.getAggregation("_chart"));
			oRm.write("</div>");
		}
	};

	return SmartMicroChartRenderer;

}, /* bExport= */true);

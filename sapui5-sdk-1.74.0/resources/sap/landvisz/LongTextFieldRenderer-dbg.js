/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/landvisz/library"
], function(landviszLibrary) {
	"use strict";

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	/**
	 * LongTextRenderer renderer.
	 * @namespace
	 */
	var LongTextFieldRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	LongTextFieldRenderer.render = function(oRm, oControl){
		 // write the HTML into the render manager

		// write the HTML into the render manager
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");

		if (!this.initializationDone) {
			oControl.initControls();
			oControl.initializationDone = true;

			// write the HTML into the render manager
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapLandviszLongTextSizeCommon");
			if (oControl.getRenderingSize() == EntityCSSSize.RegularSmall)
			oRm.addClass("sapLandviszLongTextRegularSmallSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Regular)
				oRm.addClass("sapLandviszLongTextRegularSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Medium)
				oRm.addClass("sapLandviszLongTextMediumSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Large)
				oRm.addClass("sapLandviszLongTextLargeSize");

			oRm.writeClasses();
			oRm.write(">"); // span element
			var rfText = oControl.getText();
			oControl.oLongText.setWrapping(true);
			oControl.oLongText.setText(rfText);
			oRm.renderControl(oControl.oLongText);
			oRm.write("</div>");
		}
	};

	return LongTextFieldRenderer;

}, /* bExport = */ true);
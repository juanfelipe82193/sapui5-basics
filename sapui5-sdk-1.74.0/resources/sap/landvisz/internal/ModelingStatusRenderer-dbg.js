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

	// shortcut for sap.landvisz.ModelingStatus
	var ModelingStatus = landviszLibrary.ModelingStatus;

	/**
	 * ModelingStatusRenderer renderer.
	 * @namespace
	 */
	var ModelingStatusRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRm the RenderManager that can be used for writing to the render
	 *            output buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ModelingStatusRenderer.render = function(oRm, oControl) {
		// write the HTML into the render manager
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");

		if (!this.initializationDone) {
			oControl.initControls();
			oRm.write("<div");
			oRm.writeControlData(oControl);
			if (oControl.entityMaximized != true) {
				if (oControl.renderSize == EntityCSSSize.Small) {
					oControl._imgFolderPath = "16x16/";
					oRm.addClass("sapLandviszStatusSectionSmallSize");
				} else if(oControl.renderSize == EntityCSSSize.RegularSmall || oControl.renderSize == EntityCSSSize.Regular
				|| oControl.renderSize == EntityCSSSize.Medium || oControl.renderSize == EntityCSSSize.Large ){
					oControl._imgFolderPath = "24x24/";
					oRm.addClass("sapLandviszStatusSectionAllSize");
				}

			} else if (oControl.entityMaximized == true) {
				oControl._imgFolderPath = "24x24/";
				oRm.addClass("sapLandviszStatusSectionAllSize");
			}

			// write the HTML into the render manager

			oRm.writeClasses();

			if (oControl.getStatus() == ModelingStatus.ERROR
					|| oControl.getStatus() == ModelingStatus.WARNING)
				oRm.addStyle("border","1px solid #999999");
			oRm.writeStyles();
				oRm.writeAttributeEscaped("title",oControl.getStatusTooltip());
			oRm.write(">");
			//oControl.statusImage.setTooltip(oControl.getStatusTooltip());
			if(oControl.initializationDone == false){
			oControl.statusImage.attachPress(function(oEvent) {
			oControl.fireEvent("statusSelected");
			});
			}

			this._assignIconSrc(oRm, oControl);

			if (oControl.getStatus() == ModelingStatus.ERROR
					|| oControl.getStatus() == ModelingStatus.WARNING)
				oRm.renderControl(oControl.statusImage);
			if (oControl.getStateIconSrc() && "" != oControl.getStateIconSrc()) {
				oControl.stateImage.setSrc(oControl.getStateIconSrc());
				oControl.stateImage.setTooltip(oControl.getStateIconTooltip());
				oControl.stateImage.addStyleClass("stateIconClass");
				oRm.renderControl(oControl.stateImage);

			}
			oControl.initializationDone = true;
			oRm.write("</div>");
		}

	};

	ModelingStatusRenderer._assignIconSrc = function(oRm,
			oControl) {
		if (oControl.getStatus() == ModelingStatus.ERROR)
			oControl.statusImage.setSrc(oControl._imgResourcePath
					+ oControl._imgFolderPath + "error.png");
		else if (oControl.getStatus() == ModelingStatus.WARNING)
			oControl.statusImage.setSrc(oControl._imgResourcePath
					+ oControl._imgFolderPath + "warning.png");
		else if (oControl.getStatus() == ModelingStatus.WARNING)
			oControl.statusImage.setSrc(oControl._imgResourcePath
					+ oControl._imgFolderPath + "success.png");

	};

	return ModelingStatusRenderer;

}, /* bExport = */ true);

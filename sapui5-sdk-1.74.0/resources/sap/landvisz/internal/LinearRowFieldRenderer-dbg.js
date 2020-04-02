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
	 * LinearRowField renderer.
	 * @namespace
	 */
	var LinearRowFieldRenderer = {};

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
	LinearRowFieldRenderer.render = function(oRm, oControl) {
		// write the HTML into the render manager
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.landvisz");

		if (!this.initializationDone) {
			oControl.initControls();
			oControl.initializationDone = true;

			// write the HTML into the render manager
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapLandviszLinearRowFieldSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Small)
				oRm.addClass("sapLandviszLinearRowFieldSmallSize");
			if (oControl.getRenderingSize() == EntityCSSSize.RegularSmall)
				oRm.addClass("sapLandviszLinearRowFieldRegularSmallSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Regular)
				oRm.addClass("sapLandviszLinearRowFieldRegularSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Medium)
				oRm.addClass("sapLandviszLinearRowFieldMediumSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Large)
				oRm.addClass("sapLandviszLinearRowFieldLargeSize");

			oRm.addClass("sapLandviszLinearRowField");
			oRm.writeClasses();
			oRm.write(">"); // span element
			var rfLabel = oControl.getLabel();
			var rfText = oControl.getValue();
			var hasLabel = false;
			var hasValue = false;
			var rightIcon;
			if (oControl.getIconType()) {
				this._assignIconSrc(oRm, oControl);
				oControl.iconType.setTooltip(oControl.getIconTitle());
				oRm.renderControl(oControl.iconType);
			}
			if (rfLabel && "" != rfLabel) {

				if (!rfText || "" == rfText) {
					rightIcon = oControl.getRightIconSrc();
					if (rightIcon && "" != (typeof rightIcon === "string" ? rightIcon.trim() : rightIcon != null ? String(rightIcon).trim() : "")){
					oControl.oLinearRowFieldLabel
								.addStyleClass("sapLandviszLinearRowFieldDataCommon");
						oControl.oLinearRowFieldLabel
								.addStyleClass("fullDataLabelwithRightIcon");
					}
					else
					{
					oControl.oLinearRowFieldLabel
								.addStyleClass("sapLandviszLinearRowFieldDataCommon");
						oControl.oLinearRowFieldLabel
								.addStyleClass("fullDataLabel");
					}
					hasValue = false;

				} else {
					oControl.oLinearRowFieldLabel.addStyleClass("sapLandviszLinearRowFieldDataCommon");
					oControl.oLinearRowFieldLabel.addStyleClass("dataLabel");
					}
					hasValue = true;

				oControl.oLinearRowFieldLabel.setText(rfLabel);
				oControl.oLinearRowFieldLabel.setTooltip(rfLabel);
				oRm.renderControl(oControl.oLinearRowFieldLabel);
			}
			if (rfText && "" != rfText) {
				if (!rfLabel || "" == rfLabel) {

					rightIcon = oControl.getRightIconSrc();
					if (rightIcon && "" != (typeof rightIcon === "string" ? rightIcon.trim() : rightIcon != null ? String(rightIcon).trim() : "")){
						oControl.oLinearRowFieldValue
								.addStyleClass("sapLandviszLinearRowFieldDataCommon");
						oControl.oLinearRowFieldValue
								.addStyleClass("fullDataValuewithRightIcon");
					}
					else{
						oControl.oLinearRowFieldValue
								.addStyleClass("sapLandviszLinearRowFieldDataCommon");
						oControl.oLinearRowFieldValue
								.addStyleClass("fullDataValue");

					hasLabel = false;
				}
				}

				else {
					oControl.oLinearRowFieldValue.addStyleClass("sapLandviszLinearRowFieldDataCommon");
					oControl.oLinearRowFieldValue.addStyleClass("dataValue");
					hasLabel = true;
				}

				if (hasLabel == true && hasValue == true) {
					oControl.seperatorLbl.addStyleClass("dataSeperator");
					oControl.seperatorLbl.setText(":");
					oRm.renderControl(oControl.seperatorLbl);
				}
				oControl.oLinearRowFieldValue.setWrapping(false);
				oControl.oLinearRowFieldValue.setTooltip(oControl.getTooltip());
				oControl.oLinearRowFieldValue.setText(rfText);
				if (oControl.getInvalidName() == true)
					oControl.oLinearRowFieldValue
							.addStyleClass("sapLandviszWarningBG");
				oRm.renderControl(oControl.oLinearRowFieldValue);
			}

			rightIcon = oControl.getRightIconSrc();
			if (rightIcon && "" != (typeof rightIcon === "string" ? rightIcon.trim() : rightIcon != null ? String(rightIcon).trim() : "")) {
				var iconsrc = oControl.getRightIconSrc();
				oControl.rightIcon.setSrc(iconsrc);
				oControl.rightIcon.setTooltip(oControl.getRightIconTooltip());
				oControl.rightIcon.addStyleClass("sapLandviszRightIcon");
				oRm.renderControl(oControl.rightIcon);
			}
			oRm.write("</div>");
		}

	};

	LinearRowFieldRenderer._assignIconSrc = function(oRm,
			oControl) {
		if (oControl.getIconType() == "p")
			oControl.iconType.setSrc(
					sap.ui.resource("sap.landvisz",
							"themes/base/img/landscapeobjects/" + "24x24"
									+ "/Product_enable.png")).addStyleClass("img");
		else if (oControl.getIconType() == "pv")
			oControl.iconType.setSrc(
					sap.ui.resource("sap.landvisz",
							"themes/base/img/landscapeobjects/" + "24x24"
									+ "/ProductVersion_enable.png")).addStyleClass(
					"img");
		if (oControl.getIconType() == "pi")
			oControl.iconType.setSrc(
					sap.ui.resource("sap.landvisz",
							"themes/base/img/landscapeobjects/" + "24x24"
									+ "/ProductInstance_enable.png"))
					.addStyleClass("img");
		if (oControl.getIconType() == "ps")
			oControl.iconType.setSrc(
					sap.ui.resource("sap.landvisz",
							"themes/base/img/landscapeobjects/" + "24x24"
									+ "/ProductSystem_enable.png")).addStyleClass(
					"img");
		if (oControl.getIconType() == "scv")
			oControl.iconType.setSrc(
					sap.ui.resource("sap.landvisz",
							"themes/base/img/landscapeobjects/" + "24x24"
									+ "/SoftwareComponentVersion_enable.png"))
					.addStyleClass("img");
		if (oControl.getIconType() == "ts")
			oControl.iconType.setSrc(
					sap.ui.resource("sap.landvisz",
							"themes/base/img/landscapeobjects/" + "24x24"
									+ "/TechnicalSystem_enable.png"))
					.addStyleClass("img");

		if (oControl.getIconType() == "MOB")
			oControl.iconType.setSrc(
					sap.ui.resource("sap.landvisz",
							"themes/base/img/landscapeobjects/" + "24x24"
									+ "/Solution.png")).addStyleClass("img");

	};

	return LinearRowFieldRenderer;

}, /* bExport = */ true);

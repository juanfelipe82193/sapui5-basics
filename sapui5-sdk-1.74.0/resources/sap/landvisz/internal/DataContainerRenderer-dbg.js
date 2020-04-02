/*!
 *  SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/landvisz/library",
	"sap/landvisz/internal/LinearRowField"
], function(landviszLibrary, LinearRowField) {
	"use strict";

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	// shortcut for sap.landvisz.LandscapeObject
	var LandscapeObject = landviszLibrary.LandscapeObject;

	/**
	 * DataContainer renderer.
	 * @namespace
	 */
	var DataContainerRenderer = {};

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
	DataContainerRenderer.render = function(oRm, oControl) {

		if (!this.initializationDone) {
			oControl.initControls();
			oControl.initializationDone = true;

			// write the HTML into the render manager

			oRm.write("<div tabIndex='0' ");
			oRm.writeControlData(oControl);
				oRm.addClass("sapLandviszDataContainerSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Small)
				oRm.addClass("sapLandviszDataContainerSmallSize");
			if (oControl.getRenderingSize() == EntityCSSSize.RegularSmall)
				oRm.addClass("sapLandviszDataContainerRegularSmallSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Regular)
				oRm.addClass("sapLandviszDataContainerRegularSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Medium)
				oRm.addClass("sapLandviszDataContainerMediumSize");
			if (oControl.getRenderingSize() == EntityCSSSize.Large)
				oRm.addClass("sapLandviszDataContainerLargeSize");
			if (oControl.getSelected()){
			if(oControl.getType() == LandscapeObject.TechnicalSystem)
			oRm.addClass("sapLandviszSelectedTechnicalSystem");
			else if(oControl.getType() == LandscapeObject.ProductSystem)
			oRm.addClass("sapLandviszSelectedProductSystem");
			else if(oControl.getType() == LandscapeObject.SapComponent)
			oRm.addClass("sapLandviszSelectedSapComponent");
			oRm.writeClasses();
			}
				//oRm.addClass("sapLandviszSelected");
			else
				oRm.addClass("sapLandviszUnselected");

			if (oControl.width && oControl.width != '')
				oRm.addStyle("width", oControl.width);
	//		if (oControl.visible == false)
	//			oRm.addStyle("visibility","hidden");
	//		else
	//			oRm.addStyle("visibility","visible");
	//oRm.addStyle("display","none");
			oRm.writeStyles();
			oRm.writeClasses();
			oRm.writeAttributeEscaped("title", oControl.getHeader());
			oRm.write(">"); // span element
			oRm.writeEscaped(oControl.getHeader());

			oRm.write("</div>");

	//._renderDataContainer(oRm, oControl);


		}

	};



	DataContainerRenderer._renderDataContainerProperties = function(
			oRm, oControl) {

		var continerId = oControl.getId();
		var oProperties = oControl.getValues();
		var rowField;
		if (oProperties.length) {

			for ( var i = 0; i < oProperties.length; i++) {

				rowField = new LinearRowField(continerId + i
						+ oControl.getHeader() + "-CLVDatacontainerRowField");
				rowField.setLabel(oProperties[i].label);
				rowField.setValue(oProperties[i].value);
				rowField.placeAt("CLVEntityHLayout");
			}
		}

		else {

			rowField = new LinearRowField(continerId
					+ oControl.getHeader() + "-CLVDatacontainerRowField");
			rowField.setLabel(oProperties.label);
			rowField.setValue(oProperties.value);
			rowField.placeAt("CLVEntityHLayout");
		}

	};

	return DataContainerRenderer;

}, /* bExport = */ true);

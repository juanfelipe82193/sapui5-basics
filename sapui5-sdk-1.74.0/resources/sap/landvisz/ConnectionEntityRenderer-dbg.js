/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/landvisz/library",
	"sap/landvisz/internal/LinearRowField"
], function(landviszLibrary, LinearRowField) {
	"use strict";

	// shortcut for sap.landvisz.ConnectionType
	var ConnectionType = landviszLibrary.ConnectionType;

	// shortcut for sap.landvisz.DependencyType
	var DependencyType = landviszLibrary.DependencyType;

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	// shortcut for sap.landvisz.ViewType
	var ViewType = landviszLibrary.ViewType;

	/**
	 * ConnectionEntity renderer.
	 * @namespace
	 */
	var ConnectionEntityRenderer = {};

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
	ConnectionEntityRenderer.render = function(oRm, oControl) {
		// write the HTML into the render manager

		if (!this.initializationDone) {

			oControl.initControls();
			oControl.initializationDone = true;
			oRm.write("<div");
			oRm.writeControlData(oControl);

			if (oControl.viewType == DependencyType.NETWORK_VIEW)
				oRm.addClass("sapLandviszConnection_entity_container");
			else if (oControl.viewType == DependencyType.BOX_VIEW)
				oRm.addClass("sapLandviszConnectionBox");
			else if (oControl.viewType == ViewType.SOLUTION_VIEW)
				oRm.addClass("sapLandviszSolutionBox");
			oRm.writeClasses();
			if (this.left != 0)
				oRm.addStyle("left",oControl.left + "px");
			if (this.top != 0)
				oRm.addStyle("top",oControl.top + "px");
			if (oControl.width != 0)
				oRm.addStyle("width", oControl.width + "px");
			if (oControl.height != 0)
				oRm.addStyle("height",oControl.height + "px");
			oRm.addStyle("position", "absolute");
			oRm.writeStyles();
			oRm.write(" >");

			oRm.write("<div");
			oRm.writeAttributeEscaped("id", oControl.getId() + "connectionRow");
			oRm.addClass("connectionEntity");
			if (oControl.getType() == ConnectionType.ProductSystem)
				oRm.addClass("productSystem");
			if (oControl.getType() == ConnectionType.TechnicalSystem)
				oRm.addClass("technicalSystem");
			if (oControl.getType() == ConnectionType.MobileSolution && oControl.viewType != ViewType.SOLUTION_VIEW)
				oRm.addClass("mobileSolution");
			oRm.writeClasses();

			if (this.left != 0)
				oRm.addStyle("left", oControl.innerLeft + "px");
			if (this.top != 0)
				oRm.addStyle("top", oControl.innerTop + "px");
			if (oControl.width != 0)
				oRm.addStyle("width",oControl.innerWidth + "px");
			if (oControl.height != 0)
				oRm.addStyle("height", oControl.innerHeight + "px");
			oRm.addStyle("position","absolute");
			var connectionData = oControl.getConnectionData();
			if(connectionData.length > 1)
			oRm.addStyle("overflow", "auto");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("<div");
			oRm.writeAttributeEscaped("id", oControl.getId()
							+ "connectionRowField");
			oRm.addClass("boxRowDisplay");

			if(connectionData.length <= 1) {
				oRm.addStyle("width", "100%");
			}
			oRm.writeStyles();
			oRm.addClass("sapLandviszConnectionRowField");
			oRm.writeClasses();
			oRm.write(">");

			//var connectionData = oControl.getConnectionData();
			if (oControl.viewType == ViewType.SOLUTION_VIEW) {

				for ( var i = 0; i < connectionData.length; i++) {

					if (connectionData.length > 1) {
						connectionData[i]
								.setRenderingSize(EntityCSSSize.Medium);
						connectionData[i]
								.addStyleClass("sapLandviszConnectionDataNotopMargin");
						oRm.renderControl(connectionData[i]);

					} else {
						oControl.connectionImage.setSrc(
								sap.ui.resource("sap.landvisz",
										"themes/base/img/landscapeobjects/"
												+ "48x48" + "/Solution.png"))
								.addStyleClass("solutionImage");
						oControl.connectionImage.setTooltip(oControl
								.getDependencyTooltip());

						oRm.renderControl(oControl.connectionImage);

						oControl.connectionLabel.setText(connectionData[i]
								.getLabel());
						oControl.connectionLabel.setTooltip(connectionData[i]
								.getTooltip());
						oControl.connectionLabel.addStyleClass("solutionRow");
						oRm.renderControl(oControl.connectionLabel);
					}
				}

			} else {

				var connectionData = oControl.getConnectionData();
				if (connectionData.length > 0) {
					for ( var i = 0; i < connectionData.length; i++) {
						if(oControl.getSize() == EntityCSSSize.Small)
							connectionData[i]
						.setRenderingSize(EntityCSSSize.Small);
						else
						connectionData[i]
								.setRenderingSize(EntityCSSSize.Medium);
						connectionData[i]
								.addStyleClass("sapLandviszConnectionDataNotopMargin");
						oRm.renderControl(connectionData[i]);

					}

				}

				var row;

				if (connectionData.length > 0) {
					oControl.oVLayoutToolPopup.removeAllContent();
					oControl.oVLayoutToolPopup.addStyleClass("sapLandviszConnectionToolPopup");
					for ( var i = 0; i < connectionData.length; i++) {

						if(oControl.getSize() == EntityCSSSize.Small)
							connectionData[i]
						.setRenderingSize(EntityCSSSize.Small);
						else
						connectionData[i]
								.setRenderingSize(EntityCSSSize.Medium);
						row = new LinearRowField();
						row.addStyleClass("overlayRow");
						row.setLabel(connectionData[i].getLabel());
						row.setValue(connectionData[i].getValue());
						row.setRenderingSize(connectionData[i].getRenderingSize());
						row.setIconType(connectionData[i].getIconType());
						row.setIconTitle(connectionData[i].getIconTitle());
						row.setLinkSource(connectionData[i].getLinkSource());
						row.setRightIconSrc(connectionData[i].getRightIconSrc());
						oControl.oVLayoutToolPopup.addContent(row);
					}
				}
			}
			oRm.write("</div>");
			oRm.write("</div>");
			oRm.write("</div>");

			var backup = oControl.oVLayoutCallout.getContent();
			for ( var i = 0; i < backup.length; i++) {
				oControl.addAggregation("connectionData", backup[i], false);
			}
		}
	};

	return ConnectionEntityRenderer;

}, /* bExport = */ true);

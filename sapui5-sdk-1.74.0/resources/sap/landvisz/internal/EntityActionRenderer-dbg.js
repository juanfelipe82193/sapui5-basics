/*!
 *  SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */

sap.ui.define([
	"sap/landvisz/library"
], function(landviszLibrary) {
	"use strict";

	// shortcut for sap.landvisz.EntityCSSSize
	var EntityCSSSize = landviszLibrary.EntityCSSSize;

	/**
	 * EntityAction renderer.
	 * @namespace
	 */
	var EntityActionRenderer = {};

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
	EntityActionRenderer.render = function(oRm, oControl) {

		if (!this.initializationDone) {
			oControl.initControls();
			oControl.initializationDone = true;
			oRm.write("<div tabIndex='0' ");
			oRm.writeControlData(oControl);
			var renderSize = oControl.getRenderingSize();
			if (oControl.entityMaximized != true) {
				if (renderSize == EntityCSSSize.Small
						|| renderSize == EntityCSSSize.RegularSmall
						|| renderSize == EntityCSSSize.Regular
						|| renderSize == EntityCSSSize.Medium) {
					oRm.addClass("sapLandviszIcon_buttonSmall");
				} else
					oRm.addClass("sapLandviszIcon_button");
			} else if (oControl.entityMaximized == true) {
				oRm.addClass("sapLandviszIcon_button");
				oControl.entityActionIcon.setWidth("16px");
				oControl.entityActionIcon.setHeight("16px");
			}

			oRm.writeClasses();
			oRm.write(">");
			oControl.setTooltip(oControl.getActionTooltip());
			oControl.entityActionIcon.setSrc(oControl.getIconSrc());
			oControl.entityActionIcon.setTooltip(oControl.getActionTooltip());
			oRm.renderControl(oControl.entityActionIcon);
			oRm.write("</div>");
		}

	};

	return EntityActionRenderer;

}, /* bExport = */ true);

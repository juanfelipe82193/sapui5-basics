/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define([], function() {
	"use strict";

	/**
	 * EntityCustomAction renderer.
	 * @namespace
	 */
	var EntityCustomActionRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	EntityCustomActionRenderer.render = function(oRm, oControl){
		 // write the HTML into the render manager
		if (!this.initializationDone) {
			oControl.initControls();
			oControl.initializationDone = true;
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapLandviszAction");
			oRm.writeClasses();
			oRm.write("id=\"");
			oRm.write(oControl.getId()+"Action");
			oRm.write("\" title =\"");
			oRm.writeEscaped(oControl.getCustomAction());
			oRm.write("\">");
			oRm.writeEscaped(oControl.getCustomAction());
			oRm.write("</div>");
		}
	};

	return EntityCustomActionRenderer;

}, /* bExport = */ true);

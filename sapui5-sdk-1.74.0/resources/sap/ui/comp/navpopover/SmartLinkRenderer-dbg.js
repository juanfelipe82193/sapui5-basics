/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides control sap.ui.comp.navpopover.SmartLink.
sap.ui.define([
	'sap/ui/core/Renderer', 'sap/m/LinkRenderer', "sap/base/security/encodeXML"
], function(Renderer, LinkRenderer, encodeXML) {
	"use strict";

	var SmartLinkRenderer = Renderer.extend(LinkRenderer);

	SmartLinkRenderer.render = function(oRm, oControl) {
		var bRenderLink = true;

		if (oControl.getIgnoreLinkRendering()) {
			var oReplaceControl = oControl._getInnerControl();
			if (oReplaceControl) {
				oRm.write("<div");
				oRm.writeControlData(oControl);
				oRm.writeClasses();
				oRm.write(">");

				oRm.renderControl(oReplaceControl);

				oRm.write("</div>");

				bRenderLink = false;
			}
		}

		if (bRenderLink) {
			LinkRenderer.render.apply(this, arguments);
		}
	};

	SmartLinkRenderer.writeText = function(oRm, oControl) {
		if (!oControl.getUom()) {
			oRm.writeEscaped(oControl.getText());
			return;
		}
		oRm.write("<span>" + encodeXML(oControl.getText()) + "</span><span style='display:inline-block;min-width:2.5em;width:3.0em;text-align:start'>" + encodeXML(oControl.getUom()) + "</span>");
	};

	return SmartLinkRenderer;

}, /* bExport= */true);
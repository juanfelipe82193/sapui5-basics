/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(["sap/ui/core/Renderer", "sap/m/PanelRenderer"], function (Renderer, PanelRenderer) {
	"use strict";

	/**
	 * TAccountPanel renderer.
	 */
	var TAccountItemPanelRenderer = Renderer.extend(PanelRenderer),
		oBindedControl;

	TAccountItemPanelRenderer.renderContent = function (oRm, oControl) {
		oBindedControl = oControl;
		PanelRenderer.renderContent.apply(this, [oRm, oControl]);
	};


	TAccountItemPanelRenderer.renderChildren = function (oRm, aChildren) {
		var sId = oBindedControl && oBindedControl.getId();
		if (oBindedControl) {
			var oTable = oBindedControl.getTable();
			if (oTable) {
				oRm.write("<div id=\"" + sId + "-table\" class=\"sapSuiteUiCommonsAccountPanelTable\">");
				oRm.renderControl(oTable);
				oRm.write("</div>");
			}
		}

		oRm.write("<div id=\"" + sId + "-datacontent\" class=\"sapSuiteUiCommonsAccountPanelContent\">");
		aChildren.forEach(oRm.renderControl);
		oRm.write("</div>");

		var sOverlayVisible = oBindedControl && oBindedControl.getShowOverlay() ? "sapSuiteUiCommonsAccountPanelOverlayVisible" : "";
		oRm.write("<div id=\"" + sId + "-overlay\" class=\"sapSuiteUiCommonsAccountPanelOverlay " + sOverlayVisible + " \">");
		oRm.write("</div>");

	};

	return TAccountItemPanelRenderer;
}, /* bExport= */ true);

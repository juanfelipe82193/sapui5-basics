/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([], function () {
	"use strict";

	/**
	 * Gantt Chart Container renderer.
	 *
	 * @namespace
	 */
	var GanttChartContainerRenderer = {};

	GanttChartContainerRenderer.render = function (oRm, oContainer) {
		oRm.write("<div");
		oRm.writeControlData(oContainer);
		oRm.addClass("sapGanttContainer");
		oRm.writeClasses();
		oRm.addStyle("width", oContainer.getWidth());
		oRm.addStyle("height", oContainer.getHeight());
		oRm.writeStyles();
		oRm.write(">");

		this.renderSvgDefs(oRm, oContainer);

		this.renderToolbar(oRm, oContainer);

		this.renderGanttCharts(oRm, oContainer);

		oRm.write("</div>");
	};

	GanttChartContainerRenderer.renderSvgDefs = function (oRm, oContainer) {
		var oSvgDefs = oContainer.getSvgDefs();
		if (oSvgDefs) {
			oRm.write("<svg");
			oRm.writeAttribute("id", oContainer.getId() + "-svg-psdef");
			oRm.writeAttribute("aria-hidden", "true");
			oRm.writeAttribute("tabindex", -1);
			oRm.writeAttribute("focusable", false);
			oRm.addClass("sapGanttInvisiblePaintServer");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write(oSvgDefs.getDefString());
			oRm.write("</svg>");
		}
	};

	GanttChartContainerRenderer.renderToolbar = function (oRm, oContainer) {
		var oToolbar = oContainer.getToolbar();
		if (oToolbar) {
			oRm.write("<div");
			oRm.addClass("sapGanttContainerTbl");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oToolbar);
			oRm.write("</div>");
		}
	};

	GanttChartContainerRenderer.renderGanttCharts = function (oRm, oContainer) {
		oRm.write("<div");
		oRm.addClass("sapGanttContainerCnt");
		oRm.writeClasses();
		oRm.write(">");
		oRm.renderControl(oContainer._oSplitter);
		oRm.write("</div>");
	};

	return GanttChartContainerRenderer;

}, /* bExport= */ true);

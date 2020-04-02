/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/library"
],function (library) {
	"use strict";

	var GanttChartWithTableRenderer = {};

	GanttChartWithTableRenderer.render = function (oRm, oControl) {
		// determine whether to delta update DOMs
		this.renderSplitter(oRm, oControl);
	};

	GanttChartWithTableRenderer.renderSplitter = function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addStyle("width", oControl.getWidth());
		oRm.addStyle("height", oControl.getHeight());
		oRm.writeStyles();
		oRm.addClass("sapGanttChartWithSingleTable");
		if (oControl.getDisplayType() === library.simple.GanttChartWithTableDisplayType.Chart) {
			oRm.addClass("sapGanttChartWithTableShowOnlyChart");
		}
		oRm.writeClasses();
		oRm.write(">");

		var oSplitter = oControl.getAggregation("_splitter");
		oSplitter.getContentAreas()[0].getLayoutData().setSize(oControl.getSelectionPanelSize());

		oRm.renderControl(oSplitter);

		oRm.write("</div>");
	};

	return GanttChartWithTableRenderer;

}, /* bExport= */ true);

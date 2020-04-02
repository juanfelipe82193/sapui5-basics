/*!
 * SAP APF Analysis Path Framework 
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @class stepContainer
 * @name stepContainer
 * @memberOf sap.apf.ui.reuse.view
 * @description Creates ChartContainer and add it into the layout 
 * @returns {stepContainerLayout}
 */
sap.ui.define([
	"sap/suite/ui/commons/ChartContainer",
	"sap/suite/ui/commons/ChartContainerToolbarPlaceholder",
	"sap/m/OverflowToolbar",
	"sap/ui/layout/VerticalLayout"
], function(ChartContainer, ChartContainerToolbarPlaceholder, OverflowToolbar, VerticalLayout) {
	"use strict";

	return sap.ui.jsview("sap.apf.ui.reuse.view.stepContainer", {
		/**
		 * @this {sap.apf.ui.reuse.view.stepContainer}
		 *
		 */
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.stepContainer";
		},
		createContent : function(oController) {
			if (sap.ui.Device.system.desktop) {
				oController.getView().addStyleClass("sapUiSizeCompact");
			}
			var chartContainer = new ChartContainer({
				id : oController.createId("idChartContainer"),
				showFullScreen : true
			}).addStyleClass("chartContainer ChartArea");
			var toolbar = new OverflowToolbar({
				id : oController.createId("idChartContainerToolbar")
			});
			toolbar.addContent(new ChartContainerToolbarPlaceholder());
			chartContainer.setToolbar(toolbar);
			this.stepLayout = new VerticalLayout({
				id : oController.createId("idStepLayout"),
				content : [ chartContainer ],
				width : "100%"
			});
			this.stepLayout.setBusy(true);
			return this.stepLayout;
		}
	});
});

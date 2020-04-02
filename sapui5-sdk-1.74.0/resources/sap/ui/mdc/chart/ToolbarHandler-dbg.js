/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/mdc/library', '../ActionToolbar', 'sap/m/Title', 'sap/m/OverflowToolbarButton', 'sap/m/OverflowToolbarToggleButton', "sap/ui/mdc/chart/ChartTypeButton", 'sap/ui/mdc/chart/ChartSettings'
], function(MDCLib, ActionToolbar, Title, OverflowButton, OverflowToggleButton, ChartTypeButton, ChartSettings) {
	"use strict";
	/**
	 * Toolbar helper class for sap.ui.mdc.Chart.
	 *
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.60
	 * @alias sap.ui.mdc.chart.ToolbarHandler
	 */
	var MDCRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
	var ToolbarHandler = {
		/**
		 *
		 * Creates a new toolbar for the mdc.Chart based on actions
		 */
		createToolbar: function(oChart, aUserActions) {
			if (!oChart.getAggregation("_toolbar")) {
				var oToolbar = new ActionToolbar(oChart.getId() + "--toolbar", {
					design: "Transparent",
					begin: [
						new Title(oChart.getId() + "-title", {
							text: oChart.getHeader()
						})
					],
					actions: aUserActions
				});
				oChart.setAggregation("_toolbar", oToolbar);

				this.updateToolbar(oChart);
			}
		},
		/**
		 *
		 * Updates the mdc.Chart toolbar content
		 */
		updateToolbar: function(oChart) {
			var oToolbar = oChart.getAggregation("_toolbar");
			if (!oToolbar) {
				return;
			}
			oToolbar.destroyEnd();

			if (!oChart.getIgnoreToolbarActions().length || oChart.getIgnoreToolbarActions().indexOf(MDCLib.ChartToolbarActionType.ZoomInOut) < 0) {
				oToolbar.addEnd(new OverflowButton({
					tooltip: MDCRb.getText("chart.TOOLBAR_ZOOM_IN"),
					icon: "sap-icon://zoom-in",
					enabled: "{= ${$mdcChart>/_chart/getZoomInfo/enabled} && ${$mdcChart>/_chart/getZoomInfo/currentZoomLevel} < 1}",
					press: function() {
						var oInnerChart = oChart.getAggregation("_chart");
						oInnerChart.zoom({ direction: "in" });
						oChart._oManagedObjectModel.checkUpdate();
					}
				}));
				oToolbar.addEnd(new OverflowButton({
					tooltip: MDCRb.getText("chart.TOOLBAR_ZOOM_OUT"),
					icon: "sap-icon://zoom-out",
					enabled: "{= ${$mdcChart>/_chart/getZoomInfo/enabled} && ${$mdcChart>/_chart/getZoomInfo/currentZoomLevel} > 0}",
					press: function() {
						var oInnerChart = oChart.getAggregation("_chart");
						oInnerChart.zoom({ direction: "out" });
						oChart._oManagedObjectModel.checkUpdate();
					}
				}));
			}

			if (!oChart.getIgnoreToolbarActions().length || oChart.getIgnoreToolbarActions().indexOf(MDCLib.ChartToolbarActionType.DrillDownUp) < 0) {
				oChart._oDrillDownBtn = new OverflowButton(oChart.getId() + "-drillDown", {
					icon: "sap-icon://drill-down",
					text: "View By",
					tooltip: "View By",
					press: [
						oChart._showDrillDown, oChart
					]
				});
				oToolbar.addEnd(oChart._oDrillDownBtn);
			}

			if (!oChart.getIgnoreToolbarActions().length || oChart.getIgnoreToolbarActions().indexOf(MDCLib.ChartToolbarActionType.Legend) < 0) {
				oToolbar.addEnd(new OverflowToggleButton({
					type: "Transparent",
					text: MDCRb.getText("chart.LEGENDBTN_TEXT"),
					tooltip: MDCRb.getText("chart.LEGENDBTN_TOOLTIP"),
					icon: "sap-icon://legend",
					pressed: "{$mdcChart>/legendVisible}"
				}));
			}
			if (!oChart.getIgnoreToolbarActions().length || oChart.getIgnoreToolbarActions().indexOf(MDCLib.ChartToolbarActionType.P13nOfVisibility) < 0) {
				oToolbar.addEnd(new OverflowButton(oChart.getId() + "-chart_settings", {
					icon: "sap-icon://action-settings",//TODO the right icon for P13n chart dialog
					tooltip: MDCRb.getText('chart.PERSONALIZATION_DIALOG_TITLE'),
					press: function(oEvent) {
						var oSource = oEvent.getSource();
						oChart._getPropertyData().then(function(aProperties) {
							ChartSettings.showPanel(oChart, "Chart", oSource, aProperties);
						});
					}
				}));
			}
			if (!oChart.getIgnoreToolbarActions().length || oChart.getIgnoreToolbarActions().indexOf(MDCLib.ChartToolbarActionType.P13nOfSort) < 0) {
				oToolbar.addEnd(new OverflowButton(oChart.getId() + "-sort_settings", {
					icon: "sap-icon://sort",
					tooltip: MDCRb.getText('sort.PERSONALIZATION_DIALOG_TITLE'),
					press: function(oEvent) {
						var oSource = oEvent.getSource();
						oChart._getPropertyData().then(function(aProperties) {
							ChartSettings.showPanel(oChart, "Sort", oSource, aProperties);
						});
					}
				}));
			}
			if (!oChart.getIgnoreToolbarActions().length || oChart.getIgnoreToolbarActions().indexOf(MDCLib.ChartToolbarActionType.P13nOfChartType) < 0) {
				oToolbar.addEnd(new ChartTypeButton(oChart));
			}
		}
	};
	return ToolbarHandler;
});

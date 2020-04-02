sap.ui.define([ "sap/ui/test/Opa5", "./tAPFIntegrationTestsPO", "./tAPFScenarioCommonPO" ], function(Opa5, apfIntegrationTestsPO, apfScenarioCommonPO) {
	"use strict";
	Opa5.createPageObjects({
		tChartToolbarPO : {
			baseClass : apfScenarioCommonPO,
			actions : {
				iClickToolbarMenu : function(tooltip) {
					return this.waitFor({
						viewName : "stepToolbar",
						controlType : "sap.ca.ui.charts.ChartToolBar",
						check : function(chartToolbar) {
							return chartToolbar.length > 0 ? true : false;
						},
						success : function(chartToolbar) {
							var menuItems = chartToolbar[0].getToolBar().getContentRight();
							for( var item in menuItems) {
								if (menuItems[item].getTooltip !== undefined && menuItems[item].getTooltip() !== null) {
									if (menuItems[item].getTooltip().trim() === tooltip) {
										menuItems[item].firePress();
										sap.ui.getCore().applyChanges();
									}
								}
							}
						}
					});
				},
				onToggleLegend : function(visibleState) {
					return this.waitFor({
						viewName : "stepToolbar",
						controlType : "sap.ca.ui.charts.ChartToolBar",
						check : function(chartToolbar) {
							return chartToolbar.length > 0 ? true : false;
						},
						success : function(chartToolbar) {
							chartToolbar[0].getCharts()[0].setVizProperties({
								legend : {
									visible : visibleState
								},
								sizeLegend : {
									visible : visibleState
								}
							});
							sap.ui.getCore().applyChanges();
						}
					});
				},
				iSetFullScreen : function(fullScreenMode) {
					return this.waitFor({
						viewName : "stepToolbar",
						controlType : "sap.ca.ui.charts.ChartToolBar",
						check : function(chartToolbar) {
							return chartToolbar.length > 0 ? true : false;
						},
						success : function(chartToolbar) {
							chartToolbar[0].setFullScreen(fullScreenMode);
							sap.ui.getCore().applyChanges();
						}
					});
				}
			},
			assertions : {
				iShouldSeeLegend : function(bIsLegendVisible) {
					return this.waitFor({
						viewName : "stepToolbar",
						controlType : "sap.ca.ui.charts.ChartToolBar",
						check : function(chartToolbar) {
							var legendVizProperties = chartToolbar[0].getCharts()[0].getVizProperties()["legendGroup"];
							return (bIsLegendVisible === legendVizProperties.visible) ? true : false;
						},
						success : function() {
							var sVisibility = bIsLegendVisible ? "Visible" : "Invisible";
							ok(true, "Legend is " + sVisibility);
						}
					});
				},
				isFullScreen : function(mode) {
					return this.waitFor({
						viewName : "stepToolbar",
						controlType : "sap.ca.ui.charts.ChartToolBar",
						check : function(chartToolbar) {
							return chartToolbar.length > 0 ? true : false;
						},
						success : function(chartToolbar) {
							var status = (chartToolbar[0].getFullScreen() === mode) ? "Full Screen" : "Normal Screen";
							ok(true, "Screen is in " + status + "mode");
						}
					});
				},
				iShouldSeeTheTableRepresentation : function() {
					return this.waitFor({
						viewName : "stepToolbar",
						controlType : "sap.ca.ui.charts.ChartToolBar",
						check : function(chartToolbar) {
							var chart = chartToolbar[0].getCharts()[0];
							return this.myGlobalVariable.oJQuery(chart.getDomRef()).find(".sapMList").length > 0 ? true : false;
						},
						success : function() {
							ok(true, "Main chart representation is switched to alternate representation - table");
						}
					});
				},
				iShouldSeeTheTableThumbnail : function() {
					return this.waitFor({
						viewName : "analysisPath",
						check : function() {
							return (this.myGlobalVariable.oJQuery(".thumbnailTableImage").length > 0) ? true : false;
						},
						success : function() {
							ok(true, "The Analysis Path Step contains table image in the thumbnail");
						}
					});
				},
				iIgnoreExistingPath : function() {
					this.iClickonObjectHeader();
					this.iClickOnToolbarItem(0);
				}
			}
		}
	});
});
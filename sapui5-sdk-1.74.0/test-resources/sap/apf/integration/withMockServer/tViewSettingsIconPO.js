sap.ui.define([ "sap/ui/test/Opa5", "./tAPFIntegrationTestsPO", "./tAPFScenarioCommonPO" ], function(Opa5, apfIntegrationTestsPO, apfScenarioCommonPO) {
	"use strict";
	Opa5.createPageObjects({
		viewSettingsIconPO : {
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
				iStoreFirstRecordInTable : function() {
					return this.waitFor({
						viewName : "stepToolbar",
						controlType : "sap.ca.ui.charts.ChartToolBar",
						check : function(chartToolbar) {
							return chartToolbar.length > 0 ? true : false;
						},
						success : function(chartToolbar) {
							var table = chartToolbar[0].getCharts()[0].getContent()[0].getContent()[1].getContent()[0];
							sap.ui.test.Opa.getContext().tableData = table.getModel().getData().tableData[0].CustomerName;
						}
					});
				},
				iSelectSortOrderAndDimension : function(sSortName, sValue) {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.StandardListItem",
						check : function(aListItems) {
							return aListItems.length > 0 ? true : false;
						},
						success : function(aListItems) {
							for( var k = 0; k < aListItems.length; k++) {
								if (aListItems[k].getTitle() === sSortName || aListItems[k].getTitle() === sValue) {
									this.myGlobalVariable.oJQuery(aListItems[k]).trigger("tap");
									sap.ui.getCore().applyChanges();
								}
							}
						},
						errorMessage : "Did not find items in View settings Dialog"
					});
				},
				iClickonOk : function() {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.Dialog",
						check : function(aDialog) {
							return aDialog.length > 0 ? true : false;
						},
						success : function(aDialog) {
							aDialog[0].getBeginButton().firePress();
							sap.ui.getCore().applyChanges();
						},
						errorMessage : "Did not click on Ok Button of View Settings Dialog"
					});
				}
			},
			assertions : {
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
				iShouldSeeViewSettingsDialog : function() {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.Dialog",
						check : function(aDialog) {
							return aDialog.length > 0 ? true : false;
						},
						success : function() {
							ok(true, "View Settings Dialog is opened on UI");
						}
					});
				},
				iShouldSeeTheChartDataSorted : function() {
					return this.waitFor({
						viewName : "stepToolbar",
						controlType : "sap.ca.ui.charts.ChartToolBar",
						check : function(chartToolbar) {
							return chartToolbar.length > 0 ? true : false;
						},
						success : function(chartToolbar) {
							var tr = this.myGlobalVariable.oJQuery("table").find("tbody:eq(0) tr");
							var bIsSorted = ((this.myGlobalVariable.oJQuery(tr[0]).find("td:eq(1)").text()).charAt(0) !== (sap.ui.test.Opa.getContext().tableData).charAt(0)) ? true : false ;
							ok(bIsSorted, "Table Representation is sorted as per sort order and property selected in View Settings Dialog");
						}
					});
				}
			}
		}
	});
});
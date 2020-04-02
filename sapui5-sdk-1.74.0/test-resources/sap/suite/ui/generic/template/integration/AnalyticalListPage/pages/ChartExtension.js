/*global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/PropertyStrictEquals"
], function(Opa5, Common, AggregationLengthEquals, AggregationFilled, Properties, PropertyStrictEquals) {

	"use strict";

	Opa5.createPageObjects({
		onTheChart: {
			baseClass: Common,
			actions: {
				iAddDimensionFromP13nDialog: function(sText) {
					var bSuccess = false, oCheckBox;
					return this.waitFor({
						controlType:"sap.m.CheckBox",
						searchOpenDialogs: true,
						check: function(aCheckBox) {
							//i starts from 1 since first checkbox is different
							for(var i=1; i<aCheckBox.length; i++) {
								if(aCheckBox[i].getParent().getCells()[0].getText()===sText) {
									aCheckBox[i].setSelected(!aCheckBox[i].getSelected());
									oCheckBox = aCheckBox[i];
									bSuccess = true;
								}
							}
							return bSuccess;
						},
						success: function() {
							oCheckBox.fireSelect({selected : oCheckBox.getSelected()});
							QUnit.ok(true, "Selected "+sText+" in Chart p13n dialog");
						},
						errorMessage: "Failed to select chart in p13n dialog"
					});
				},
				iDrillDownChart: function(sDrillDownBy) {
					var oItem, indexChanged=-1, bSuccess = false;
					return this.waitFor({
						controlType: "sap.m.ResponsivePopover",
						check: function(aResponsivePopover) {
							//return the list in items
							var items = aResponsivePopover[0].getContent()[1].getItems();
							for(var i=0; i<items.length; i++){
								if(items[i].getTitle() === sDrillDownBy){
									oItem = items[i];
									bSuccess = true;
								}
							}
							return bSuccess;
						},
						success: function() {
							var oList = oItem.getParent();
							oList.fireSelectionChange({
								listItem: oItem
							});
							QUnit.ok(true, "Drilldown by "+sDrillDownBy+" performed");
						},
						errorMessage: "Drilldown by "+sDrillDownBy+" could not be performed"
					});
				},
				iSelectChart: function(fieldName, value) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartchart.SmartChart",
						check: function(charts) {
							for(var i = 0; i < charts.length; i++) {
								var vizFrame = charts[i].getChart()._getVizFrame(), innerData = {};
								if (vizFrame) {
									innerData[fieldName] = value;
									var data = {data: innerData}
									var result = vizFrame.vizSelection([data], {clearSelection: true});
									if (result) {
										return true;
									}
								}
							}
							return false;
						},
						success: function() {
							QUnit.ok("chart selection has been done");
						},
						errorMessage: "The chart selection cannot be applied"
					});
				}
			},

			assertions: {
				/**
				* This function checks for visible dimension in smartchart
				* @param {string} sDrillDownBy This is the name of the dimension, e.g. "CostCenter"
				* @param {boolean} bVisible When true, looks for the presence of the dimension and when false looks for its absence
				*/
				iShouldSeeChartDrilledDown: function(sDrillDownBy, bVisible) {
					return this.waitFor({
						id: "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--chart",
						check: function(oSmartChart) {
							var bSuccess = false;
							var aVisibleDimensions = oSmartChart.getChart().getVisibleDimensions();
							for(var i=0; i<aVisibleDimensions.length; i++) {
								if(aVisibleDimensions[i]===sDrillDownBy){
									bSuccess = bVisible ? true : false;
									return bSuccess;
								}
							}
							bSuccess = bVisible ? false : true;
							return bSuccess;
						},
						success: function() {
							if(bVisible) {
								QUnit.ok(true, "Dimension has drilled down by "+sDrillDownBy);
							}
							else {
								QUnit.ok(true, "Dimension has not drilled down by "+sDrillDownBy);								
							}
						},
						errorMessage: "Chart has failed to drill down by "+sDrillDownBy
					});
				},
				iCheckChartBreadCrumbs: function(nDrillDownCount) {
					return this.waitFor({
						id: "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--chart-drillBreadcrumbs",
						check: function(oBreadCrumb) {
							var bSuccess = false;
							if(oBreadCrumb){
								var links = oBreadCrumb.getLinks();
								for(var i=0; i<links.length; i++){
									QUnit.ok(true, "Found the link "+links[i].getText());
								}
								QUnit.ok(true, "Currently on "+oBreadCrumb.getCurrentLocationText());
								if(links.length === nDrillDownCount) {
									bSuccess = true;
								}
							}
							return bSuccess;
						},
						success: function() {
							QUnit.ok(true, "Chart has drilled down with breadcrumbs");
						},
						errorMessage: "Chart has not drilled down with breadcrumbs"
					});
				},
				
				// To Check if the button with filter:"chart" given in the manifest comes with expected button text.
				checkChartActionButton: function(buttonName) {
					return this.waitFor({
						controlType: "sap.m.Button",
						timeout: 30,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: buttonName
						}),
						success: function(oButton1) {
							QUnit.ok(true, "The chart action button " + buttonName + " is present in the app");
						},
						errorMessage: "The chart action button " + buttonName + " is NOT present in the app"
					});
				}

			}
		}
	});
});

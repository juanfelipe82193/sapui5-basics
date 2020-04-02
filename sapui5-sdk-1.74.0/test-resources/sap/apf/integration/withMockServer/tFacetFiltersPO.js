sap.ui.define([ "sap/ui/test/Opa5", "./tAPFIntegrationTestsPO", "./tAPFScenarioCommonPO" ], function(Opa5, apfIntegrationTestsPO, apfScenarioCommonPO) {
	"use strict";
	Opa5.createPageObjects({
		facetFilterPO : {
			baseClass : apfScenarioCommonPO,
			actions : {
				iClickOnFilterMenu : function(sFilterId) {
					return this.waitFor({
						viewName : "layout",
						controlType : "sap.m.FacetFilter",
						check : function(oFacetFilter) {
							return (oFacetFilter[0].getLists().length > 0) ? true : false;
						},
						success : function() {
							this.myGlobalVariable.oJQuery(".sapMBtn span:contains(" + sFilterId + ")").trigger('tap');
							sap.ui.getCore().applyChanges();
						}
					});
				},
				iChangeValueFromFacetFilterList : function(sFilterType) {
					return this.waitFor({
						viewName : "layout",
						controlType : "sap.m.FacetFilter",
						check : function(oFacetFilter) {
							return (oFacetFilter[0].getLists().length > 0) ? true : false;
						},
						success : function(oFacetFilter) {
							var oFacetFilterList;
							if (sFilterType === "From_date") {
								oFacetFilterList = oFacetFilter[0].getLists()[0];
							} else if (sFilterType === "To_date") {
								oFacetFilterList = oFacetFilter[0].getLists()[1];
							} else if (sFilterType === "Company_code") {
								oFacetFilterList = oFacetFilter[0].getLists()[2];
							} else {
								oFacetFilterList = oFacetFilter[0].getLists()[3];
							}
							oFacetFilterList.removeSelectedKeys();
							oFacetFilterList.setSelectedItem(oFacetFilterList.getItems()[1]);
						}
					});
				},
				iClickonOk : function() {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.Button",
						check : function(oButton) {
							return (oButton.length > 0) ? true : false;
						},
						success : function(oButton) {
							oButton[0].firePress();
							sap.ui.getCore().applyChanges();
						},
						errorMessage : "Did not click on Ok Button of facet filter list"
					});
				}
			},
			assertions : {
				iShouldSeeSelFacetFilterListsValuesFromCompanyCode : function() {
					return this.waitFor({
						viewName : "layout",
						controlType : "sap.m.FacetFilter",
						success : function(oFacetFilter) {
							sap.ui.test.Opa.getContext().selectedCompanyCodeCount = oFacetFilter[0].getLists()[2].getSelectedItems().length;
							sap.ui.test.Opa.getContext().selectedCompanyCodeKey = oFacetFilter[0].getLists()[2].getSelectedItems()[0].getKey();
							strictEqual(oFacetFilter[0].getLists()[2].getSelectedItems().length, 1, "One Company Code is Selected from the list");
						}
					});
				},
				iShouldSeeTheLineItemsWithFacetfilterCompanyCodes : function() {
					return this.waitFor({
						viewName : "stepContainer",
						controlType : "sap.m.Table",
						check : function(oTable) {
							var oChart = oTable[0];
							var companyCodes = oChart.getModel().getData().tableData.reduce(function(previous, current) {
								if (previous.indexOf(current.CompanyCode) === -1) {
									previous.push(current.CompanyCode);
								}
								return previous;
							}, []);
							strictEqual(companyCodes[0], sap.ui.test.Opa.getContext().selectedCompanyCodeKey, "Representation is filtered with select company code values");
							return (companyCodes.length === sap.ui.test.Opa.getContext().selectedCompanyCodeCount) ? true : false;
						},
						success : function() {
							ok(true, "Data in chart is filtered as per values selected in the Company code facet filter");
						},
						errorMessage : "Data in chart is not filtered as per values selected in the Company code facet filter"
					});
				},
				iShouldSeeChartWithFacetfilterTimeFrame : function(sFilterType) {
					return this.waitFor({
						viewName : "stepContainer",
						controlType : "sap.viz.ui5.controls.VizFrame",
						success : function(lineChart) {
							var oChart = lineChart[0];
							if (sFilterType) {
								if (sFilterType === "From_date") {
									strictEqual(oChart.getModel().getData().data[0].YearMonth, "201311", "Chart loaded with selected From Date of Facet Filter");
								} else if (sFilterType === "To_date") {
									strictEqual(oChart.getModel().getData().data[oChart.getModel().getData().data.length - 1].YearMonth, "201311", "Chart loaded with selected To Date of Facet Filter");
								}
							}
						}
					});
				}
			}
		}
	});
});
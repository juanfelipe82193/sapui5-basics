sap.ui.define([ "sap/ui/test/Opa5", "./tAPFIntegrationTestsPO", "./tAPFScenarioCommonPO" ], function(Opa5, apfIntegrationTestsPO, apfScenarioCommonPO) {
	"use strict";
	function getDialogByTitle(sTitle, aDialog) {
		var bIsPresent = false;
		aDialog.forEach(function(oDialog){
			bIsPresent = (oDialog.getTitle() === sTitle) ? true : false;
		});
		return bIsPresent;
	}
	Opa5.createPageObjects({
		footerFilterPO : {
			baseClass : apfScenarioCommonPO,
			actions : {
				iClickOnReportingCurrencyButton : function() {
					return this.waitFor({
						viewName : "layout",
						controlType : "sap.m.Bar",
						check : function(oFooterBar) {
							return (oFooterBar[0].getContentRight()[0].getContent().length > 0) ? true : false;
						},
						success : function(oFooterBar) {
							oFooterBar[0].getContentRight()[0].getContent()[0].firePress();
							sap.ui.getCore().applyChanges();
						}
					});
				},
				iSelectReportingCurrencyFromDialog : function() {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.Dialog",
						check : function(aDialog) {
							return getDialogByTitle("Reporting Currency", aDialog);
						},
						success : function() {
							this.myGlobalVariable.oJQuery(this.myGlobalVariable.oJQuery(".sapMListModeSingleSelectMaster .sapMLIB")[1]).tap();
							sap.ui.getCore().applyChanges();
						}
					});
				},
				iClickOnExchangeRateButton : function() {
					return this.waitFor({
						viewName : "layout",
						controlType : "sap.m.Bar",
						check : function(oFooterBar) {
							return (this.myGlobalVariable.oJQuery(oFooterBar[0].getContentRight()[1].getDomRef()).length > 0) ? true : false;
						},
						success : function(oFooterBar) {
							oFooterBar[0].getContentRight()[1].firePress();
							sap.ui.getCore().applyChanges();
							this.myGlobalVariable.oJQuery(this.myGlobalVariable.oJQuery(".sapMPopover .sapMBtn")[0]).trigger("tap");
							sap.ui.getCore().applyChanges();
						}
					});
				}
			},
			assertions : {
				iShouldSeeReportingCurrencyDialog : function() {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.Dialog",
						check : function(aDialog) {
							return getDialogByTitle("Reporting Currency", aDialog);
							
						},
						success : function() {
							ok(true, "Currency Select Dialog Opened on UI");
						}
					});
				},
				iShouldSeeChangeInChart : function() {
					return this.waitFor({
						controlType : "sap.viz.ui5.controls.VizFrame",
						check : function(chart) {
							return (chart[0].getDataset().getMeasures()[0].getName() === "Revenue (EUR)") ? true : false;
						},
						success : function(chart) {
							equal(chart[0].getDataset().getMeasures()[0].getName(), "Revenue (EUR)", "Chart loaded is in currency EUR");
						}
					});
				},
				iShouldSeeExchangeRateDialog : function() {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.Dialog",
						check : function(aDialog) {
							return getDialogByTitle("Exchange Rate Settings", aDialog);
						},
						success : function() {
							ok(true, "Exchange Rate Settings Dialog opened on UI");
						}
					});
				},
				iShouldSeeValuesInExchangeRateDialog : function() {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.Dialog",
						check : function(aDialog) {
							return getDialogByTitle("Exchange Rate Settings", aDialog);
						},
						success : function(oDialog) {
							var sExchangeRateType = oDialog[0].getContent()[0].getContent()[0].getContent()[1].getSelectedItem();
							var sExchangeRateDate = oDialog[0].getContent()[0].getContent()[1].getContent()[1].getSelectedItem();
							strictEqual(sExchangeRateType.getText(), "M - Standard translation at average rate", "M - Standard translation at average rate is selected Exchange Rate Type");
							strictEqual(sExchangeRateDate.getText(), "Dynamic Date", "Dynamic date is selected Date Type");
						}
					});
				},
				iClickOnOkButton : function() {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.Dialog",
						check : function(aDialog) {
							return getDialogByTitle("Exchange Rate Settings", aDialog);
						},
						success : function(oDialog) {
							oDialog[0].getBeginButton().firePress();
							sap.ui.getCore().applyChanges();
						},
						errorMessage : "Did not click on Ok Button of Exchange Rate Settings Dialog"
					});
				}
			}
		}
	});
});
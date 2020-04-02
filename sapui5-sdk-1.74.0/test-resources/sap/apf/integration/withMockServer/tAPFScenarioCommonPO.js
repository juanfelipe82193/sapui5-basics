sap.ui.define([ "sap/ui/test/Opa5", "./tAPFIntegrationTestsPO" ], function(Opa5, apfIntegrationTestsPO) {
	"use strict";
	function _getAnalysisPathToolbarButtons(index) {
		var sButtonName;
		switch (index) {
			case 0:
				sButtonName = "New";
				break;
			case 1:
				sButtonName = "Open";
				break;
			case 2:
				sButtonName = "Save";
				break;
			case 3:
				sButtonName = "Save As";
				break;
			case 4:
				sButtonName = "Delete";
				break;
			case 5:
				sButtonName = "Print";
				break;
		}
		return sButtonName;
	}
	var apfScenarioCommonPO = apfIntegrationTestsPO.extend("apf.tAPFScenarioCommonPO", {
		//Action
		iOpenAnExistingSavedPath : function() {
			this.iOpenAnAnalysisPath();
			this.iAssertAnalysisPathWithSteps(3);
		},
		iPressOnAddStepButton : function() {
			return this.waitFor({
				viewName : "carousel",
				check : function() {
					var jQuery = this.myGlobalVariable.oJQuery;
					return (jQuery(".addStepBtnHolder button").length) !== 0 ? true : false;
				},
				success : function() {
					var jQuery = this.myGlobalVariable.oJQuery;
					jQuery(".addStepBtnHolder button").trigger("tap");
					sap.ui.getCore().applyChanges();
				},
				errorMessage : "Did not find the Add Anaysis Step button"
			});
		},
		iSelectAStepFromStepGallery : function(sCategoryTitle, sStepTitle, sRepTitle) {
			return this.iSelectAnItemFromSelectDialog("title", sCategoryTitle).and.iSelectAnItemFromSelectDialog("title", sStepTitle).and.iSelectAnItemFromSelectDialog("title", sRepTitle);
		},
		iSelectAnItemFromSelectDialog : function(sName, sValue) {
			return this.waitFor({
				searchOpenDialogs : true,
				controlType : "sap.m.StandardListItem",
				matchers : [ new sap.ui.test.matchers.PropertyStrictEquals({
					name : sName,
					value : sValue
				}) ],
				success : function(aListItems) {
					aListItems[0].firePress();
					sap.ui.getCore().applyChanges();
					ok(true, "I selected " + sValue + " from the list");
				}
			});
		},
		iAddAnAnalysisStep : function(iCatTitle, iStepTitle, iRepTitle) {
			return this.iPressOnAddStepButton().and.iSelectAStepFromStepGallery(iCatTitle, iStepTitle, iRepTitle);
		},
		iSelectAnAnalysisStep : function(step) {
			return this.waitFor({
				viewName : "analysisPath",
				check : function() {
					var jQuery = this.myGlobalVariable.oJQuery;
					return (jQuery(".DnD-removeIconWrapper").length) !== 0 ? true : false;
				},
				success : function() {
					var opaIframeWindow = sap.ui.test.Opa5.getWindow(); // Get iFrame window.
					var oEvt = opaIframeWindow.document.createEvent("MouseEvents");//Event created for Draggable Carousel HTML control
					oEvt.initMouseEvent("click", true, true, opaIframeWindow, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					var oSelectStep = opaIframeWindow.document.getElementsByClassName("sapAPFSelectedStep")[step];
					oSelectStep.dispatchEvent(oEvt);
					sap.ui.getCore().applyChanges();
				},
				errorMessage : "Did not find the selected step"
			});
		},
		iStoreTheSelectedChartAndTitle : function() {
			return this.waitFor({
				viewName : "stepToolbar",
				controlType : "sap.ca.ui.charts.ChartToolBar",
				check : function(chartToolbar) {
					return chartToolbar[0].getCharts()[0];
				},
				success : function(chartToolbar) {
					sap.ui.test.Opa.getContext().selectedChartType = chartToolbar[0].getCharts()[0].getVizType();
					sap.ui.test.Opa.getContext().selectedChartTitle = chartToolbar[0].getCharts()[0].getVizProperties().title.text;
				},
				errorMessage : "Did not find the Chart"
			});
		},
		iOpenAnAnalysisPath : function() {
			return this.iClickonObjectHeader().and.iClickOnToolbarItem(1).and.iSelectAnItemFromSelectDialog("title", "Revenue and Receivables  By Customer").and.iSelectAnItemFromSelectDialog("title", "Revenue and Receivables By Customer");
		},
		iClickonObjectHeader : function() {
			return this.waitFor({
				viewName : "analysisPath",
				controlType : "sap.m.ObjectHeader",
				success : function(header) {
					var jQuery = this.myGlobalVariable.oJQuery;
					jQuery(header[0].getDomRef()).find(".sapMOHTitleArrow .sapUiIcon").trigger("click");
					sap.ui.getCore().applyChanges();
					ok(true, "Clicked on Analysis Path toolbar");
				}
			});
		},
		iClickOnToolbarItem : function(index) {
			return this.waitFor({
				viewName : "layout",
				check : function() {
					var jQuery = this.myGlobalVariable.oJQuery; // Get jQuery of iFrame.
					var liLength = jQuery(".sapMPopover").find("li").length;
					return (liLength === 6) ? true : false;
				},
				success : function() {
					var jQuery = this.myGlobalVariable.oJQuery;
					jQuery(".sapMPopover li:eq(" + index + ")").trigger("tap");
					sap.ui.getCore().applyChanges();
					ok(true, "Clicked on " + _getAnalysisPathToolbarButtons(index) + " button from Analysis Path toolbar");
				}
			});
		},
		iCleanUpExistingPath : function() {
			this.iClickonObjectHeader();
			this.iClickOnToolbarItem(0);
			this.iClickonNoSave();
		},
		iClickonNoSave : function() {
			return this.waitFor({
				searchOpenDialogs : true,
				controlType : "sap.m.Dialog",
				check : function(oDialog) {
					return (oDialog[0].getButtons().length > 0) ? true : false;
				},
				success : function(oDialog) {
					oDialog[0].getEndButton().firePress();
					sap.ui.getCore().applyChanges();
				},
				errorMessage : "Did not click on No Button of Save Dialog"
			});
		},
		//Assertions
		iShouldSeeSelectedChart : function(chartType) {
			return this.waitFor({
				viewName : "stepToolbar",
				controlType : "sap.ca.ui.charts.ChartToolBar",
				check : function(chartToolbar) {
					return chartToolbar[0].getCharts()[0];
				},
				success : function(chartToolbar) {
					strictEqual(chartToolbar[0].getCharts()[0].getVizType(), chartType, chartType + " is active chart in the Chart container");
					ok(chartToolbar[0].getCharts()[0].getVizProperties(), "Viz Properties Exists");
				},
				errorMessage : "Did not find the Chart"
			});
		},
		iAssertAnalysisPathWithSteps : function(steps) {
			return this.waitFor({
				viewName : "analysisPath",
				check : function() {
					var jQuery = this.myGlobalVariable.oJQuery;
					return (jQuery(".DnD-removeIconWrapper").length === steps) ? true : false;
				},
				success : function() {
					ok(true, "An Analysis step is added to Analysis Path");
				},
				errorMessage : "Did not find the steps"
			});
		}
	});
	return apfScenarioCommonPO;
});

sap.ui.define([ "sap/ui/test/Opa5", "./tAPFIntegrationTestsPO", "./tAPFScenarioCommonPO" ], function(Opa5, apfIntegrationTestsPO, apfScenarioCommonPO) {
	"use strict";
	function findElementByTitle(title, jQuery) {
		var done = false, itemTitle;
		jQuery.each(jQuery('.sapMLIB'), function(name, element) {
			if (!done && element.getAttribute("title") === title) {
				done = true;
				itemTitle = title;
			}
		});
		return {
			isItemFound : done,
			listItemTitle : itemTitle
		};
	}
	Opa5.createPageObjects({
		analysisPathPO : {
			baseClass : apfScenarioCommonPO,
			actions : {
				iDeleteAnAnalysisStep : function(step) {
					return this.waitFor({
						viewName : "analysisPath",
						check : function() {
							return this.myGlobalVariable.oJQuery(".DnD-removeIconWrapper").length > 0 ? true : false;
						},
						success : function() {
							var opaIframeWindow = sap.ui.test.Opa5.getWindow(); // Get iFrame window.
							var oEvt = opaIframeWindow.document.createEvent("MouseEvents");//Event for Draggable Carousel which is a html control
							oEvt.initMouseEvent("mousedown", true, true, opaIframeWindow, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
							var oRemoveIcon = opaIframeWindow.document.getElementsByClassName("DnD-removeIconWrapper")[step];
							oRemoveIcon.dispatchEvent(oEvt);
							sap.ui.getCore().applyChanges();
						},
						errorMessage : "Did not find the step which has to be deleted"
					});
				}
			},
			assertions : {
				iShouldSeeStepGalleryWithCategories : function() {
					var self = this;
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.StandardListItem",
						check : function() {
							self.oResult = findElementByTitle("Time", this.myGlobalVariable.oJQuery);
							return self.oResult.isItemFound;
						},
						success : function(aListItems) {
							ok(aListItems.length, "List of Categories are present in the step gallery");
							strictEqual(self.oResult.listItemTitle, "Time", "Category Time present in list of categories in step gallery");
						},
						errorMessage : "Did not find the Category in list of categories inside Step Gallery"
					});
				},
				iShouldSeeStepGalleryWithSteps : function() {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.StandardListItem",
						check : function() {
							self.oResult = findElementByTitle("Revenue and Receivables over Time", this.myGlobalVariable.oJQuery);
							return self.oResult.isItemFound;
						},
						success : function(aListItems) {
							ok(aListItems.length, "Step list is present in the step gallery");
							strictEqual(self.oResult.listItemTitle, "Revenue and Receivables over Time", "Step Revenue and Receivables over Time present in list of steps in step gallery");
						},
						errorMessage : "Did not find the Step in list of steps inside Step Gallery"
					});
				},
				iShouldSeeStepGalleryWithRepresentations : function() {
					return this.waitFor({
						searchOpenDialogs : true,
						controlType : "sap.m.StandardListItem",
						check : function() {
							self.oResult = findElementByTitle("Line Chart", this.myGlobalVariable.oJQuery);
							return self.oResult.isItemFound;
						},
						success : function(aListItems) {
							ok(aListItems.length, "Representation list is present in the step gallery");
							strictEqual(self.oResult.listItemTitle, "Line Chart", "Line Chart representation present in list of representations in step gallery");
						},
						errorMessage : "Did not find the Representation in list of representations inside Step Gallery"
					});
				},
				iAssertAnalysisPathIsEmpty : function() {
					return this.waitFor({
						viewName : "analysisPath",
						check : function() {
							return this.myGlobalVariable.oJQuery(".DnD-removeIconWrapper").length === 0 ? true : false;
						},
						success : function() {
							ok(true, "The Analysis Path is Empty");
						}
					});
				},
				iAssertDeletionOfAnalysisStepAndTitle : function() {
					return this.waitFor({
						viewName : "stepToolbar",
						controlType : "sap.ca.ui.charts.ChartToolBar",
						check : function(chartToolbar) {
							return chartToolbar[0].getCharts()[0];
						},
						success : function(chartToolbar) {
							var currentChart = chartToolbar[0].getCharts()[0].getVizType();
							var chartTitle = chartToolbar[0].getCharts()[0].getVizProperties().title.text;
							if (sap.ui.test.Opa.getContext().selectedChartType !== currentChart && sap.ui.test.Opa.getContext().selectedChartTitle !== chartTitle) {
								ok(true, "The Selected Chart and its title is deleted");
							} else {
								ok(false, "The Selected Chart and its title is not deleted");
							}
						},
						errorMessage : "Did not find the Chart"
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

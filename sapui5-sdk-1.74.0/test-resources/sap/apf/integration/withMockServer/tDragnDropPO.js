sap.ui.define([ "sap/ui/test/Opa5", "./tAPFIntegrationTestsPO", "./tAPFScenarioCommonPO" ], function(Opa5, apfIntegrationTestsPO, apfScenarioCommonPO) {
	"use strict";
	Opa5.createPageObjects({
		dragnDropPO : {
			baseClass : apfScenarioCommonPO,
			actions : {
				iSwapTheSteps : function(movebtnType) {
					return this.waitFor({
						viewName : "layout",
						controlType : "sap.m.Bar",
						check : function(footerBar) {
							var btnPress = footerBar[0].getContentLeft()[movebtnType];
							var jQuery = this.myGlobalVariable.oJQuery;
							if (jQuery(btnPress.getDomRef()).length > 0) {
								return true;
							}
							return false;
						},
						success : function(footerBar) {
							var btnPress = footerBar[0].getContentLeft()[movebtnType];
							btnPress.firePress();
							sap.ui.getCore().applyChanges();
						}
					});
				},
				iMakeStepActive : function(activeStepNum) {
					return this.waitFor({
						viewName : "analysisPath",
						check : function() {
							var jQuery = this.myGlobalVariable.oJQuery;
							if (jQuery(jQuery(".DnD-block")[activeStepNum]).length > 0) {
								return true;
							}
							return false;
						},
						success : function() {
							var jQuery = this.myGlobalVariable.oJQuery;
							var e = jQuery.Event("keydown");
							e.which = 13;
							jQuery(jQuery(".DnD-block")[activeStepNum]).trigger(e);
						}
					});
				}
			},
			assertions : {
				iShouldSeeTheStepsSwapped : function() {
					return this.waitFor({
						viewName : "analysisPath",
						check : function() {
							var jQuery = this.myGlobalVariable.oJQuery;
							var stepBlock = jQuery(".DnD-block")[2];
							var stepIndex = jQuery(stepBlock).position().top;
							if (stepIndex === 0) {
								return true;
							}
							return false;
						},
						success : function() {
							ok(true, "Second Step is swapped to first position and vice versa");
						}
					});
				},
				iShouldSeeActiveChart : function(chartType) {
					return this.waitFor({
						viewName : "stepToolbar",
						controlType : "sap.ca.ui.charts.ChartToolBar",
						check : function(chartToolbar) {
							var chart = chartToolbar[0].getCharts()[0];
							if (chart.getVizType() === chartType) {
								return true;
							}
							return false;
						},
						success : function(chartToolbar) {
							var chart = chartToolbar[0].getCharts()[0];
							var message = chartType + " is active chart in the Chart container";
							equal(chart.getVizType(), chartType, message);
							ok(chart.getVizProperties(), "Viz Properties Exists");
						}
					});
				}
			}
		}
	});
});
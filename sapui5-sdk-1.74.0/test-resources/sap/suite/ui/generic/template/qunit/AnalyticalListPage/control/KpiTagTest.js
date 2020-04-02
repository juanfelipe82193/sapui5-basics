/*
* tests for the sap.suite.ui.generic.template.AnalyticalListPage.control.KpiTag
*/
sap.ui.define(
	[ "sap/suite/ui/generic/template/AnalyticalListPage/control/SmartKpiTag",
	"sap/suite/ui/generic/template/AnalyticalListPage/util/KpiUtil" ], function(SmartKpiTag, KpiUtil) {
		"use strict";
		var myObject = new SmartKpiTag();
		KpiUtil.oKpiList = {
						"kpi":
							{ 
								"12": {
									"analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::ActualMarginRelative2" : {"bProcessed":true},
									"analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::TargetMargin2" : {"bProcessed":true}
								},
								"45": {
									"analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::TargetMargin" : {"bProcessed":true}
								},
								"AlpKpiGroup": {
									"analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::ActualCosts" : {"bProcessed":true},
									"analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::ActualMarginRelative" : {"bProcessed":false},
									"analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::ActualMarginRelative3" : {"bProcessed":true},
									"analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::ActualMarginRelative4" : {"bProcessed":true},
									"analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::ActualMarginRelative5" : {"bProcessed":true}
								}
							}
						}

		/**
		* Test cases to be passed into _getNameFromHeuristic().
		* Single words are passed routed to _getNameFromSinleWordHeuristic() and multiple words cases into _getNameFromMultiWordHeuristic().
		*/
		QUnit.test("Test _getNameFromHeuristic for various inputs", function( assert ) {
			assert.equal(myObject._getNameFromHeuristic("a"), "A");
			assert.equal(myObject._getNameFromHeuristic("A"), "A");
			assert.equal(myObject._getNameFromHeuristic("TM"), "TM");
			assert.equal(myObject._getNameFromHeuristic("tm"), "TM");
			assert.equal(myObject._getNameFromHeuristic("Tm"), "TM");
			assert.equal(myObject._getNameFromHeuristic("tM"), "TM");
			assert.equal(myObject._getNameFromHeuristic("Act"),"ACT");
			assert.equal(myObject._getNameFromHeuristic("Target"),"TAR");
			assert.equal(myObject._getNameFromHeuristic("margin"), "MAR");
			assert.equal(myObject._getNameFromHeuristic("ACTUAL"),"ACT");
			assert.equal(myObject._getNameFromHeuristic("Cost Center"), "CC");
			assert.equal(myObject._getNameFromHeuristic("Analytical List Page"), "ALP");
			assert.equal(myObject._getNameFromHeuristic("ANALYTICAL LIST PAGE"), "ALP");
			assert.equal(myObject._getNameFromHeuristic("u15"), "U15");
			assert.equal(myObject._getNameFromHeuristic("615"), "615");
		});

		QUnit.test("Test getKpiList", function( assert ) {
			var oList = KpiUtil.getKpiList("kpi","AlpKpiGroup","analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::ActualMarginRelative");
			assert.deepEqual(oList, KpiUtil.oKpiList["kpi"]["AlpKpiGroup"]["AlpKpiGroup","analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::ActualMarginRelative"]);
		});

		QUnit.test("Test updateKpiList", function( assert ) {
			var oKpi = {
				getModelName : function() { return "kpi"},
				getGroupId : function() { return "AlpKpiGroup"},
				getId : function() {return "analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::ActualMarginRelative"}
			}
			KpiUtil.updateKpiList(oKpi, true);
			assert.equal(KpiUtil.oKpiList["kpi"]["AlpKpiGroup"]["AlpKpiGroup","analytics2::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--template::KPITag::kpi::ActualMarginRelative"].bProcessed, true);
		});
	}
);

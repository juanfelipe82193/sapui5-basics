/**
 * 
 */
sap.ui.define([ "sap/ui/test/Opa5", "./tAPFIntegrationTestsPO", "./tAPFScenarioCommonPO" ], function(Opa5, apfIntegrationTestsPO, apfScenarioCommonPO) {
	"use strict";
	Opa5.createPageObjects({
		analysisPathToolBarPO : {
			baseClass : apfScenarioCommonPO,
			actions : {},
			assertions : {
				iCleanUpExistingPath : function() {
					this.iClickonObjectHeader();
					this.iClickOnToolbarItem(0);
				}
			}
		}
	});
});
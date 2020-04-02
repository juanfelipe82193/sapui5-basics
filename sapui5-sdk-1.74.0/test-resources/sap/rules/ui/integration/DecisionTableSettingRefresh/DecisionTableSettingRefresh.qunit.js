QUnit.config.autostart = false;
sap.ui.require(
	["sap/ui/test/opaQunit",
	 "sap/ui/test/Opa5",
	 "test/sap/rules/ui/TestUtils",
	 "test/sap/rules/ui/integration/pages/DecisionTable",
	 "test/sap/rules/ui/integration/pages/DecisionTableSetting"],
	function(opaTest, Opa5, Utils) {
		"use strict";
		Utils.startRequestRecorder({
			filePath: "./data/", 
			fileName: "DecisionTableSettingRefreshResult",
			mode:"play"
		});
		
		var sRuleId = "863cb696e153469d8e985b01e895c751",
			version = "000000000000000000",
			sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";

		var sViewName = "DecisionTableSettingRefresh";
		var sDecisionTableViewName = "DecisionTableSettingRefresh";
		 var oModel = Utils.createRuleOdataModel();
		this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
		var applyButtonText = this.oBundle.getText("applyChangesBtn"); 
		var cancelBtn		= this.oBundle.getText("cancelBtn"); 
		
		
		Opa5.extendConfig({
			viewNamespace: "DecisionTableSettingRefresh.view.",
			// we only have one view
			viewName: "DecisionTableSettingRefresh"
		});
		


/*
	Refresh
2.	Update Rule (+ Trigger Refresh)
a.	Open DT settings (rule with result that was updated)
b.	Check Refresh Button is enabled
c.	Click Refresh
d.	Click on “cancel” in refresh confirmation dialog, check dialog was closed and Refresh is still enabled.
e.	Click Refresh
f.	Check data in refresh confirmation dialog
g.	Click on “ok” in message box, check MB was closed 
h.	Check Refresh is disabled
i.	Exec apply and check dt table was updated:
	i.	Result columns
	ii.	Result name & id on rule header
*/	

		opaTest("New Rule scenario: Check 'Refresh' button  ", function(Given, When, Then) {
			Given.iStartMyUIComponent({
				componentConfig: { name: "DecisionTableSettingRefresh" }
			});
			//Open Settings
			When.onDecisionTablePage
				.iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", sViewName, sRulePath).and
				.iClickTheSettingButton("and When: click the setting button", "sap.m.Toolbar", sDecisionTableViewName);
			
			//Refresh and Cancel
			When.onTheSettingsPage.iClickTheButtonByIcon("and When: click the refresh button", "sap.m.Button", sViewName,"sap-icon://synchronize").and
			.iPressTheWarningButton("and When: I press the cancel button", cancelBtn, "__mbox-btn-0",sViewName);
			//Refresh and OK
			When.onTheSettingsPage.iClickTheButtonByIcon("and When: click the refresh button", "sap.m.Button", sViewName,"sap-icon://synchronize").and
			.iPressTheWarningButton("and When: I press the ok button", "OK", "__mbox-btn-1",sViewName);
			// Re-record with a new rule Id and create HAR files for all test cases
			/*When.onTheSettingsPage.iWaitForButtonDisabled("Then: Check, Refresh button disabled", "sap.m.Button", sViewName,"sap-icon://synchronize");
			When.onTheSettingsPage.iPressTheButton("and When: I press the apply button", applyButtonText, sViewName);
            When.onDecisionTablePage.iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", sViewName, sRulePath);
			Then.onDecisionTablePage.iCheckNumOfColumns("Then: Check num of columns", "myDecisionTable", 3, sRulePath, sViewName);
            Then.onDecisionTablePage.iCheckHeaderContent("Then: Check content of column 1 header", "DiscountValidity", 1, sViewName);
            Then.onDecisionTablePage.iCheckNumOfColumns("Then: Check num of columns", "myDecisionTable", 3, sRulePath, sViewName);
            Then.onDecisionTablePage.iCheckHeaderContent("Then: Check content of column 2 header", "DiscountPercentage", 2, sViewName);*/
		});

        var params = {
			model: oModel,
			ruleId: sRuleId
	     };
	    
		var ruleInEditMode = Utils.openRuleForEdit(params);
		ruleInEditMode.then(function() {
			QUnit.start();
		});
        QUnit.done(function() {
			Utils.cancelRuleDraft(params);
			Utils.stopRequestRecorder();
                    
        });		
	 }
);
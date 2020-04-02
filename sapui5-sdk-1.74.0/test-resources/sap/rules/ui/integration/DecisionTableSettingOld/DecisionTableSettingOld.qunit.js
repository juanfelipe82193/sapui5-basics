QUnit.config.autostart = false;
sap.ui.require(
	["sap/ui/test/opaQunit",
	 "sap/ui/test/Opa5",
	 "test/sap/rules/ui/TestUtils",
	 "test/sap/rules/ui/integration/pages/DecisionTable",
	 "test/sap/rules/ui/integration/pages/DecisionTableSettingOld"],
	function(opaTest, Opa5, Utils) {
		"use strict";
		Utils.startRequestRecorder({
			filePath: "./data/", 
			fileName: "DecisionTableSettingOld"
		});
		
		var sRuleId = "FA163EF52EB01EE6B1EF5FBC86597B2D";
		var	version = "000001";
		var	sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";
		var sViewName = "DecisionTableSettingOld";
		var sDecisionTableViewName = "DecisionTableSettingOld";
		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
		var applyButtonText = oBundle.getText("applyChangesBtn"); 
		
		Utils.setServiceURLs("/sap/opu/odata/SAP/RULE_SRV/","/sap/opu/odata/SAP/VOCABULARY_SRV/");
		
		var oModel = Utils.createRuleOdataModel();

		Opa5.extendConfig({
			viewNamespace: "DecisionTableSettingOld.view.",
			// we only have one view
			viewName: "DecisionTableSettingOld"
		});

		opaTest("Open test application and setting control", function(Given, When, Then) {
			// Arrangements
			// Act 
			Given.iStartMyUIComponent({
				componentConfig: { name: "DecisionTableSettingOld" }
			});

			//Actions
			When.onDecisionTablePage
				.iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", sViewName, sRulePath).and
				.iClickTheSettingButton("and When: click the setting button", "sap.m.Toolbar", sDecisionTableViewName);
			Then.onTheSettingsPage
				.theRemoveButtonInvisible("Then: the remove column is invisible", "sap.ui.layout.HorizontalLayout", 0, 0, sViewName);
			Then.onTheSettingsPage.iTestLayoutContent("Then: Layout contains all controls", sViewName);
			Then.onTheSettingsPage.iCheckHitPolicySelection("Then: Checking HitPolicy selection is EQ to model", sViewName);
			Then.onTheSettingsPage.iCheckFixedOperatorData("Then: Checking Fixed Operator generation is EQ to model", sViewName);
		});

		opaTest("Add new column and data", function(Given, When, Then) {
			//Actions
			When.onTheSettingsPage.iClickTheAddRemoveButton("When: Add new column to setting table", "sap.ui.layout.HorizontalLayout", 0, 1, sViewName);
            Then.onTheSettingsPage.iCheckSettingNoBusy("Then: Check setting is no busy", sViewName).and
            .iCheckNumOfCols("And Then: Checking number of cols == 2", "sap.m.Table", 2, sViewName, sRulePath);
            
            When.onTheSettingsPage
			.iAddColumnData("When: column data updated", "sap.m.Table", 1, "Flight Number of the BOOKING", "starts with", sViewName);
			Then.onTheSettingsPage.iCheckColumnData("Then: Check column data", "sap.m.Table", 1, "Flight Number of the BOOKING", "starts with", sViewName);
		});
		
		opaTest("Add addtional new column and data", function(Given, When, Then) {
			//Actions
			When.onTheSettingsPage.iClickTheAddRemoveButton("When: Add addtional new column to setting table", "sap.ui.layout.HorizontalLayout", 1, 1, sViewName);
            Then.onTheSettingsPage.iCheckSettingNoBusy("Then: Check setting is no busy", sViewName).and
            .iCheckNumOfCols("And Then: Checking number of cols == 3", "sap.m.Table", 3, sViewName, sRulePath);

			When.onTheSettingsPage
				.iAddColumnData("When: column data updated", "sap.m.Table", 2, "Sales office of the BOOKING", "", sViewName);
			Then.onTheSettingsPage.iCheckColumnData("Then: Check column data", "sap.m.Table", 2, "Sales office of the BOOKING", "", sViewName);
		});
		
		opaTest("Update column data", function(Given, When, Then) {
			//Actions
			When.onTheSettingsPage
				.iAddColumnData("When: column data updated", "sap.m.Table", 2, "", "", sViewName);
				
			Then.onTheSettingsPage.iCheckColumnData("Then: Check column data", "sap.m.Table", 2, "", "", sViewName);
	
			When.onTheSettingsPage
				.iAddColumnData("When: column data updated", "sap.m.Table", 1, "Date of the Flight", "is after", sViewName);
				
			Then.onTheSettingsPage.iCheckColumnData("Then: Check column data", "sap.m.Table", 1, "Date of the Flight", "is after", sViewName);
		});
		
		opaTest("Remove columns data", function(Given, When, Then) {
                                                //Actions
            When.onTheSettingsPage.iClickTheAddRemoveButton("When: Remove column from setting table", "sap.ui.layout.HorizontalLayout", 2, 0, sViewName);
            
            Then.onTheSettingsPage.iCheckSettingNoBusy("Then: Check setting is no busy", sViewName).and
            .iCheckNumOfCols("And Then: Checking number of cols == 2", "sap.m.Table", 2, sViewName, sRulePath);
        }); 
        
        
		opaTest("Check that columns are updated after apply", function(Given, When, Then) {
                                               
            When.onTheSettingsPage.
				iPressTheButton("and When: I press the apply button", applyButtonText, sViewName);
				
			When.onDecisionTablePage.
				iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", sViewName, sRulePath);
            
            Then.onDecisionTablePage.
				iCheckHeaderContent("Then: Check content of column 0 header", "AGENCYNUM of the BOOKING starts with", 0, sViewName).and.
				iCheckHeaderContent("Then: Check content of column 1 header", "Date of the Flight is after", 1, sViewName);
        }); 
        
        var params = {
			model: oModel,
			ruleId: sRuleId
	     };
	    
		var ruleInEditMode = Utils.openRuleForEdit(params);
		ruleInEditMode.then(function() {
			QUnit.start();
		});

	//	QUnit.start();

        QUnit.done(function() {
			Utils.cancelRuleDraft(params);
			Utils.stopRequestRecorder();
                    
        });		
	 }
);

//	iAddColumnData: function (controlType, rowIndex,expressionStr, fixOperatorStr, successMessage){
sap.ui.require([
				"sap/ui/test/Opa5",
				"sap/ui/test/opaQunit",
				"sap/ui/test/actions/Press",
				"sap/ui/test/actions/EnterText",
				"test/sap/rules/ui/TestUtils",
                "sap/rules/ui/integration/pages/Performance",
                "sap/rules/ui/integration/pages/DecisionTable",
                "sap/rules/ui/integration/pages/RuleBuilder"
			], function (Opa5,
						 opaTest,
						 Press,
						 EnterText,
						 Utils) {
			    QUnit.module("DecisionTableRows OPA test");
			    // set defaults
			    //var APP_PATH = "sap/rules/ui/integration/app/decisionTableRowsApp";
			    var sRulePath = "/Rules('005056912EC51ED695F7BEA932D2FCD4')";
			    Opa5.extendConfig({
			        viewNamespace: "DecisionTablePerformance.view.",
			        // we only have one view
			        viewName: "DecisionTablePerformance",
                    pollingInterval: 0.5
			    });
			    var sViewName = "DecisionTablePerformance";

			    opaTest("Should measure reading RuleBuilder data and openning setting", function (Given, When, Then) {
                    
			        // Act
			        Given.iStartMyUIComponent({
			            componentConfig: { name: "DecisionTablePerformance" }
			        });

			        //Actions
			        When.onThePerformanceTestPage.iCanSeeTheRuleBuilderWithData("and When: RuleBuilder has completed read data", "myRuleBuilder", sViewName, sRulePath, "650_2_2", 10);
                    Then.onThePerformanceTestPage.iCheckNumOfRowsForPerformance("Then: DT have 650 row", "myRuleBuilder", "650", sRulePath, sViewName, true);
                    //Then.onThePerformanceTestPage.iCheckDTNoBusy("Then: DT isn't Busy", sViewName, false, true);
			        When.onThePerformanceTestPage.iClickTheSettingButton("and When: click the setting button", "sap.m.Toolbar", sViewName, true);

			        // Assertions
			        Then.onThePerformanceTestPage.iCheckSettingNoBusy("Then: ", sViewName, true);
			    });
			    opaTest("Should measure insert column", function (Given, When, Then) {

			        //Actions
			        When.onThePerformanceTestPage.iClickTheAddRemoveButton("When: Add new column to setting table", "sap.ui.layout.HorizontalLayout", 1, 1, sViewName, true);
			        Then.onThePerformanceTestPage.iCheckSettingNoBusy("and Then: Setting isn't Busy", sViewName, false, true);
			        // Assertions
			        Then.onThePerformanceTestPage.iCheckNumOfCols("Then: DT have 3 columns", "sap.m.Table", "3", sViewName, sRulePath, true);
			    });
			    opaTest("Should measure delete column", function (Given, When, Then) {

			        //Actions
			        When.onThePerformanceTestPage.iClickTheAddRemoveButton("When: Add delete column to setting table", "sap.ui.layout.HorizontalLayout", 2, 0, sViewName, true);

			        //Assertions
			        Then.onThePerformanceTestPage.iCheckNumOfCols("Then: DT have 2 columns", "sap.m.Table", "2", sViewName, sRulePath, false, false);
			        Then.onThePerformanceTestPage.iCheckSettingNoBusy("and Then: Setting isn't Busy", sViewName);
			    });
			    opaTest("Should measure close setting", function (Given, When, Then) {

			        //Actions
			        When.onThePerformanceTestPage.iPressTheButtonForPerformance("When: click on the apply button", "Apply", sViewName);
			        
			        //Then.onThePerformanceTestPage.iCheckSettingNoBusy("and Then: Setting isn't Busy", sViewName).and.
			        Then.onThePerformanceTestPage.iCheckDTNoBusyWithoutPerformance("and When: I check DT isn't busy", sViewName);

			        When.onThePerformanceTestPage.iClickTheAddLinkForPerformance("Then: I click on the + button", sViewName).and.
                    iClickAddLineFromMenuForPerformance("and When: click the insert first option", true);
			        //Assertions
			        //Then.onTheSettingsPage.iCheckNumOfCols("Then: DT have 2 row", "sap.m.Table", "3", sViewName, sRulePath, true);
			    });
			    opaTest("Should measure add row", function (Given, When, Then) {

			        //Actions
			        
			        Then.onThePerformanceTestPage.iCheckDTNoBusy("Then: DT isn't Busy", sViewName, true);
			        Then.onThePerformanceTestPage.iCheckNumOfRowsForPerformance("Then: DT have 651 row", "myRuleBuilder", "651", sRulePath, sViewName);
			    });
			    opaTest("Should measure delete row", function (Given, When, Then) {


			        //Actions
			        When.onDecisionTablePage.iClickTheCheckBox("When: Click the first check box", sViewName, 0);
			        When.onThePerformanceTestPage.iClickTheDeleteLink("and When: click the delete button", sViewName);
			        Then.onThePerformanceTestPage.iCheckDTNoBusy("and Then: Setting isn't Busy", sViewName, false).and.
			        iCheckNumOfRowsForPerformance("Then: DT have 650 row", "myRuleBuilder", "650", sRulePath, sViewName).and.
			        fnFinishTestAndShowResults("and Then: show the test results", sViewName, true);
			    });

			    QUnit.start();
			    
			    QUnit.done(function() {
                    Utils.stopRequestRecorder();
                });
			});
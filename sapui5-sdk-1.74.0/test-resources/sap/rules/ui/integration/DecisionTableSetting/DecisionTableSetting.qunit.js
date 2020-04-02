QUnit.config.autostart = false;
sap.ui.require(
	["sap/ui/test/opaQunit",
		"sap/ui/test/Opa5",
		"test/sap/rules/ui/TestUtils",
		"test/sap/rules/ui/integration/pages/DecisionTable",
		"test/sap/rules/ui/integration/pages/DecisionTableSetting"
	],
	function(opaTest, Opa5, Utils, onDecisionTablePage, onTheSettingsPage) {
		"use strict";
		Utils.startRequestRecorder({
			mode: "play", //"record", play
			filePath: "./data/",
			fileName: "DecisionTableSetting"
		});

		var sRuleId = "875bdc8acc5c4d5cacd2155e3b3ad256", //"005056A7004E1EE6AFA3E4918F7BFB7A",
			version = "000000000000000000",
			sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";

		var sViewName = "DecisionTableSetting";
		var sDecisionTableViewName = "DecisionTableSetting";
		var oModel = Utils.createRuleOdataModel();
		this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
		var applyButtonText = this.oBundle.getText("applyChangesBtn");
		var cancelBtn = this.oBundle.getText("cancelBtn");

		Opa5.extendConfig({
			viewNamespace: "DecisionTableSetting.view.",
			// we only have one view
			viewName: "DecisionTableSetting"
		});

		/*
		1.	Load a new rule.   
		2.	Open settings
		3.	Check the existence of a default column 
		4.	Add column,  fill it with expression and fixed operator
		5.	Press apply 
		6.	Check the following:
			a.	Table contains two condition- columns with expected values 
			b.	Table contains result columns 
			c.	Table contains one row
		*/
		opaTest("New Rule Settings scenario: Check the existence of a default column , result columns and a default row ", function(Given, When, Then) {

			Given.iStartMyUIComponent({
				componentConfig: {
					name: "DecisionTableSetting"
				}
			});

			//Open Settings
			When.onDecisionTablePage
				.iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", sViewName, sRulePath).and
				.iClickTheSettingButton("and When: click the setting button", "sap.m.Toolbar", sDecisionTableViewName);

			Then.onTheSettingsPage.iTestLayoutContent("Then: Layout contains all controls", sViewName).and
				.iCheckHitPolicySelection("Then: Checking HitPolicy selection is EQ to model", sViewName).and
				.iCheckFixedOperatorData("Then: Checking Fixed Operator generation is EQ to model", sViewName).and
				.iSeeTable("Then: Checking Column table", 0).and
				.iSeeTable("Then: Checking predefined table", 1).and
				.iSeeMessageStrip("Selecting Access as Hidden will set the value of all the rows to the default value.").and
				.iSeeMessageStrip("Selecting Access as Editable will set the values of the new rows to the default value.");

			//Add column,  fill it with expression and fixed operator, Press apply
			When.onTheSettingsPage
				.iClickTheAddRemoveButton("When: Add addtional new column to setting table", "sap.ui.layout.HorizontalLayout",1, 1, sViewName).and
				.iAddColumnData("When: column data updated", "sap.m.Table", 1, "ItemNumber of the Item", null, sViewName);
			
			//table would have two conditions and one results - 3columns in total
			Then.onTheSettingsPage
				.iCheckNumOfCols("check num of columns", "sap.m.Table", 3, sViewName, sRulePath);
			
			//Set Result logic
			When.onTheSettingsPage
				.iPressOnResultInput().and
				.iPressOkButtonInResultWarningDialog().and
                .iCanSeeSelectDialog().and
				.iSearchResultInValueHelp("Book");
            Then.onTheSettingsPage.iCanSeeItemInList("Book");
            When.onTheSettingsPage.iSelectResultInValueHelp("Book");
            Then.onTheSettingsPage.iCheckResultDialogCloesd();
			Then.onTheSettingsPage
				.iCanSeeResultInput("Book");
				
			//Press Apply
			When.onTheSettingsPage
				.iPressTheButton("and When: I press the apply button", applyButtonText, sViewName);
			
			//Wait for dt data
			When.onDecisionTablePage
				.iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", sViewName, sRulePath);

			//Check: Table contains one condition and one row
			Then.onDecisionTablePage
				.iCheckHeaderContent("Then: Check content of column 0 header", "ItemNumber of the Item", 0, sViewName).and
				.iCheckHeaderContent("Then: Check content of column 1 header", "ItemNumber of the Item", 1, sViewName).and
				.iCheckNumOfColumns("Then: Check num of columns", "myDecisionTable", 5, sRulePath, sViewName).and
				.iCheckNumOfRows("Then: Check num of rows", "myDecisionTable", 1, sRulePath, sViewName);
		});

		/*
		7.	Open settings
		8.	Change in Hit Policy
		9.	Add column between previous columns + fill column
		10.	Update third column - commented bec all attributes are already added
		11.	Update, Remove first column - commented bec the delete functionality is buggy
		12.	Press Apply
		13.	Check the following:
		a.	Table contains 2 columns (in the right order), one new with expected values and one updated with expected values
		14.	Open settings
		15.	Check hit policy
		*/
		opaTest("Update Rule Settings scenario: Check multiple CRUD operations  ", function(Given, When, Then) {
			//Open Settings
			When.onDecisionTablePage
				.iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", sViewName, sRulePath).and
				.iClickTheSettingButton("and When: click the setting button", "sap.m.Toolbar", sDecisionTableViewName);
			
			When.onTheSettingsPage
				//Change in Hit Policy
				.iSetHitPolicy("Then: Change in Hit Policy to All Match", "AM").and
				//Add column between previous columns + fill column
				.iClickTheAddRemoveButton("When: Add addtional new column to setting table", "sap.ui.layout.HorizontalLayout", 1, 1, sViewName).and
				//Update third column
				.iAddColumnData("When: column data updated", "sap.m.Table", 1, "ItemName of the Item", "", sViewName).and
				//Remove first column
				.iClickTheAddRemoveButton("When: Remove 1st column from setting table", "sap.ui.layout.HorizontalLayout", 1, 0, sViewName).and
				//Press Apply
				.iPressTheButton("and When: I press the apply button", applyButtonText, sViewName);

			//Check: Table contains 2 columns (in the right order)
			When.onDecisionTablePage
				.iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", sViewName, sRulePath);

			Then.onDecisionTablePage
				.iCheckHeaderContent("Then: Check content of column 0 header", "ItemName of the Item", 0, sViewName).and
				.iCheckHeaderContent("Then: Check content of column 1 header", "ItemNumber of the Item", 1, sViewName);            
			//Check: Hit policy changed
			
			When.onDecisionTablePage
				.iClickTheSettingButton("and When: click the setting button", "sap.m.Toolbar", sDecisionTableViewName);
				
			Then.onTheSettingsPage
				.iCheckHitPolicySelection("Then: Checking HitPolicy selection is EQ to model", sViewName);
			
			//close dialog by cancel
			When.onTheSettingsPage.iPressTheButton("and When: I press the cancel button", cancelBtn, sViewName);
		});

		/*
		 	We start with three columns
		17.	Add new columns
		18.	Press "Cancel"
		19.	Check that only two columns exist in the table
		*/
		opaTest("New Rule scenario: Check 'Cancel' button  ", function(Given, When, Then) {
			//Open Settings
			When.onDecisionTablePage
				.iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", sViewName, sRulePath).and
				.iClickTheSettingButton("and When: click the setting button", "sap.m.Toolbar", sDecisionTableViewName);

			//Add new columns
			When.onTheSettingsPage
				.iClickTheAddRemoveButton("When: Add addtional new column to setting table", "sap.ui.layout.HorizontalLayout",1, 1, sViewName).and
				.iClickTheAddRemoveButton("When: Add addtional new column to setting table", "sap.ui.layout.HorizontalLayout", 1, 1, sViewName).and
				.iClickTheAddRemoveButton("When: Add addtional new column to setting table", "sap.ui.layout.HorizontalLayout", 1, 1, sViewName).and
				.iPressTheButton("and When: I press the cancel button", cancelBtn, sViewName);

			//Check: No column was added
			Then.onDecisionTablePage.iCheckNumOfColumns("Then: Check num of columns", "myDecisionTable", 5, sRulePath, sViewName);
		});

		opaTest("Update Rule scenario: Check Change Result  ", function(Given, When, Then) {
			//Open Settings
			When.onDecisionTablePage
				.iClickTheSettingButton("and When: click the setting button", "sap.m.Toolbar", sDecisionTableViewName);

			Then.onTheSettingsPage.iCanSeeResultInput("Book");

			//Check Result
			When.onTheSettingsPage
				.iPressOnResultInput().and
				.iPressOkButtonInResultWarningDialog().and
                .iCanSeeSelectDialog();
				//3 objects without blank entry
			Then.onTheSettingsPage
				.iCheckNumberOfItemsInResultValueHelp(3);
			
			When.onTheSettingsPage
				.iSelectResultInValueHelp("Discount");
            Then.onTheSettingsPage.iCheckResultDialogCloesd();
			Then.onTheSettingsPage
				.iCanSeeResultInput("Discount");

			//press apply
			When.onTheSettingsPage
				.iPressTheButton("and When: I press the apply button", applyButtonText, sViewName);
            When.onDecisionTablePage
				.iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", sViewName, sRulePath);
			//Check: columns were added
			Then.onDecisionTablePage
				.iCheckNumOfColumns("Then: Check num of columns", "myDecisionTable", 3, sRulePath, sViewName);
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

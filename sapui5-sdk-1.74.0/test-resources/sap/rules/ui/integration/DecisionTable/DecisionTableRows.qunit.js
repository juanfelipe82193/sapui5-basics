QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"test/sap/rules/ui/TestUtils",
	"sap/rules/ui/integration/pages/DecisionTable"
], function (Opa5, opaTest, Press, EnterText, Utils) {
	"use strict";
	QUnit.module("DecisionTableRows OPA test");
	// set defaults

	var sRuleId = "eb9ecb2133cc4ec9b7ed8f636f0f62cc",
		version = "000000000000000000",
		sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";

	Opa5.extendConfig({
		viewNamespace: "DecisionTableRows.view.",
		// we only have one view
		viewName: "DecisionTableRows"
	});
	/*
	 1.	Copy Row – Insert Before
	 a.	Select row
	 b.	Click copy
	 c.	Select different row 
	 d.	Click insert before
	 e.	Check rows
			
	 2.	Copy Row – Insert After
	 a.	Select row
	 b.	Click copy
	 c.	Select different row 
	 d.	Click insert after
	 e.	Check rows
			
	 3.	Copy Row – Paste
	 a.	Select row
	 b.	Click copy
	 c.	Select different row 
	 d.	Click paste
	 e.	Check rows
			
	 4.	Cut Row – Insert Before
	 a.	Select row
	 b.	Click cut
	 c.	Select different row 
	 d.	Click insert before
	 e.	Check rows
			
	 5.	Cut Row – Insert After
	 a.	Select row
	 b.	Click cut
	 c.	Select different row 
	 d.	Click insert after
	 e.	Check rows
			
	 6.	Cut Row – Paste
	 a.	Select row
	 b.	Click cut
	 c.	Select different row 
	 d.	Click paste
	 e.	Check rows
			
	 7.	Buttons enabled/disabled
	 a.	Select 1 row
	 b.	Check the copy/cut buttons are enabled
	 c.	Select another row
	 d.	Check the copy/cut buttons are disabled
			
	 */
	opaTest("Line Actions", function (Given, When, Then) {
		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
		var oCopyButtonText = oBundle.getText("copyRow");
		var oCutButtonText = oBundle.getText("cutRow");
		var oPasteButtonText = oBundle.getText("pasteRow");

		// Act
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "DecisionTableRows"
			}
		});

		//Actions
		//               0,1,2,3,4,5
		// Initial rows: 1,2,3,4,5,6

		// COPY - PASTE
		When.onDecisionTablePage.iCanSeeDTWithData("COPY - PASTE When: dt has completed read data", "myDecisionTable", "DecisionTableRows",
				sRulePath).and
			.iClickTheCheckBox("COPY - PASTE When: Click the last check box", "DecisionTableRows", 0).and
			.iClickLinkByText("COPY - PASTE and When: click the copy button", "DecisionTableRows", oCopyButtonText).and
			.iClickTheCheckBox("COPY - PASTE When: Click the last check box", "DecisionTableRows", 2).and
			.iClickLinkByText("COPY - PASTE and When: click the paste button", "DecisionTableRows", oPasteButtonText).and
			.iClickPasteTypeFromMenu("COPY - PASTE and When: click the paste menu button", 0).and
			.iCanSeeDTWithData("COPY - PASTE When: dt has completed read data", "myDecisionTable", "DecisionTableRows", sRulePath);
		//			   0,1,2,3,4,5,6,7
		// Assertions: 1,2,1,4,5,6
		Then.onDecisionTablePage.iCanSeeTheValueByIndex("COPY - PASTE Check value in copied row", 2, 1, "'jhfgf'" /*"='Pride and Prejudice'"*/ );

		// COPY - INSERT BEFORE
		When.onDecisionTablePage.iCanSeeDTWithData("COPY - INSERT BEFORE When: dt has completed read data", "myDecisionTable",
				"DecisionTableRows", sRulePath).and
			.iClickTheCheckBox("COPY - INSERT BEFORE When: Click the last check box", "DecisionTableRows", 1).and
			.iClickLinkByText("COPY - INSERT BEFORE and When: click the copy button", "DecisionTableRows", oCopyButtonText).and
			.iClickTheCheckBox("COPY - INSERT BEFORE When: Click the last check box", "DecisionTableRows", 2).and
			.iClickLinkByText("COPY - INSERT BEFORE and When: click the paste button", "DecisionTableRows", oPasteButtonText).and
			.iClickPasteTypeFromMenu("COPY - INSERT BEFORE and When: click the insert after button", 1).and
			.iCanSeeDTWithData("COPY - INSERT BEFORE When: dt has completed read data", "myDecisionTable", "DecisionTableRows", sRulePath);
		//			   0,1,2,3,4,5,6
		// Assertions: 1,2,1,4,5,2,6
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 4 rows", "myDecisionTable", 4, sRulePath, "DecisionTableRows");
		Then.onDecisionTablePage.iCanSeeTheValueByIndex("COPY - INSERT BEFORE Check value in copied row", 2, 1, "'asd'" /*"='Harry Potter'"*/ );
		//Then.onDecisionTablePage.iCanSeeTheValue("Check value in copied row", 6, 0, "2", "DecisionTableRows");

		// COPY - INSERT AFTER
		When.onDecisionTablePage.iCanSeeDTWithData("COPY - INSERT AFTER When: dt has completed read data", "myDecisionTable",
				"DecisionTableRows", sRulePath).and
			.iClickTheCheckBox("COPY - INSERT AFTER When: Click the last check box", "DecisionTableRows", 1).and
			.iClickLinkByText("COPY - INSERT AFTER and When: click the copy button", "DecisionTableRows", oCopyButtonText).and
			.iClickTheCheckBox("COPY - INSERT AFTER When: Click the last check box", "DecisionTableRows", 3).and
			.iClickLinkByText("COPY - INSERT AFTER and When: click the paste button", "DecisionTableRows", oPasteButtonText).and
			.iClickPasteTypeFromMenu("COPY - INSERT AFTER and When: click the insert after button", 2).and
			.iCanSeeDTWithData("COPY - INSERT AFTER When: dt has completed read data", "myDecisionTable", "DecisionTableRows", sRulePath);
		//			   0,1,2,3,4,5,6,7
		// Assertions: 1,2,1,4,5,2,2,6
		Then.onDecisionTablePage.iCanSeeTheValueByIndex("COPY - INSERT AFTER Check value in copied row", 4, 1, "'asd'" /* "='Harry Potter'"*/ );

		// CUT - INSERT BEFORE
		When.onDecisionTablePage.iCanSeeDTWithData("CUT - INSERT BEFORE When: dt has completed read data", "myDecisionTable",
				"DecisionTableRows", sRulePath).and
			.iClickTheCheckBox("CUT - INSERT BEFORE When: Click the last check box", "DecisionTableRows", 0).and
			.iClickLinkByText("CUT - INSERT BEFORE and When: click the copy button", "DecisionTableRows", oCutButtonText).and
			.iClickTheCheckBox("CUT - INSERT BEFORE When: Click the last check box", "DecisionTableRows", 3).and
			.iClickLinkByText("CUT - INSERT BEFORE and When: click the paste button", "DecisionTableRows", oPasteButtonText).and
			.iClickPasteTypeFromMenu("CUT - INSERT BEFORE and When: click the insert after button", 1).and
			.iCanSeeDTWithData("CUT - INSERT BEFORE When: dt has completed read data", "myDecisionTable", "DecisionTableRows", sRulePath);
		//			   0,1,2,3,4,5,6,7
		// Assertions: 2,1,4,5,2,1,2,6
		Then.onDecisionTablePage.iCanSeeTheValueByIndex("CUT - INSERT BEFORE Check value in copied row", 4, 1, "'asd'" /*"='Harry Potter'"*/ );

		// CUT - INSERT AFTER
		When.onDecisionTablePage.iCanSeeDTWithData("CUT - INSERT AFTER When: dt has completed read data", "myDecisionTable",
				"DecisionTableRows", sRulePath).and
			.iClickTheCheckBox("CUT - INSERT AFTER When: Click the last check box", "DecisionTableRows", 0).and
			.iClickLinkByText("CUT - INSERT AFTER and When: click the copy button", "DecisionTableRows", oCutButtonText).and
			.iClickTheCheckBox("CUT - INSERT AFTER When: Click the last check box", "DecisionTableRows", 2).and
			.iClickLinkByText("CUT - INSERT AFTER and When: click the paste button", "DecisionTableRows", oPasteButtonText).and
			.iClickPasteTypeFromMenu("CUT - INSERT AFTER and When: click the insert after button", 2).and
			.iCanSeeDTWithData("CUT - INSERT AFTER When: dt has completed read data", "myDecisionTable", "DecisionTableRows", sRulePath);
		//			   0,1,2,3,4,5,6,7
		// Assertions: 1,4,2,5,2,1,2,6
		Then.onDecisionTablePage.iCanSeeTheValueByIndex("CUT - INSERT AFTER Check value in copied row", 3, 1, "'jhfgf'" /*"='Pride and Prejudice'"*/ );

		// CUT - PASTE
		When.onDecisionTablePage.iCanSeeDTWithData("CUT - PASTE When: dt has completed read data", "myDecisionTable", "DecisionTableRows",
				sRulePath).and
			.iClickTheCheckBox("CUT - PASTE When: Click the last check box", "DecisionTableRows", 0).and
			.iClickLinkByText("CUT - PASTE and When: click the copy button", "DecisionTableRows", oCutButtonText).and
			.iClickTheCheckBox("CUT - PASTE When: Click the last check box", "DecisionTableRows", 1).and
			.iClickLinkByText("CUT - PASTE and When: click the paste button", "DecisionTableRows", oPasteButtonText).and
			.iClickPasteTypeFromMenu("CUT - PASTE and When: click the paste menu button", 0).and
			.iCanSeeDTWithData("CUT - PASTE When: dt has completed read data", "myDecisionTable", "DecisionTableRows", sRulePath);
		//			   0,1,2,3,4,5,6,7
		// Assertions: 1,2,5,2,1,2,6
		Then.onDecisionTablePage.iCanSeeTheValueByIndex("CUT - PASTE Check value in copied row", 1, 1, "'asd'" /*"='Harry Potter'"*/ );

		When.onDecisionTablePage.iCanSeeDTWithData("CUT - PASTE When: dt has completed read data", "myDecisionTable", "DecisionTableRows",
			sRulePath);
		When.onDecisionTablePage.iClickTheCheckBox("When: Select the first check box", "DecisionTableRows", false).and
			.iClickTheDeleteLink("and When: click the delete Button", "DecisionTableRows");

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 3 rows", "myDecisionTable", 3, sRulePath, "DecisionTableRows");
	});

	opaTest("Should insert first row", function (Given, When, Then) {

		//Actions
		When.onDecisionTablePage.iCanSeeDTWithData("When: dt has completed read data", "myDecisionTable", "DecisionTableRows", sRulePath).and
			.iClickTheAddLink("and When: click the plus button", "DecisionTableRows").and
			.iClickAddLineFromMenu("and When: click the insert first option", true);

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 1 row", "myDecisionTable", 1, sRulePath, "DecisionTableRows");
	});
	opaTest("Should insert first row again", function (Given, When, Then) {

		//Actions
		When.onDecisionTablePage.iClickTheAddLink("When: click the plus button", "DecisionTableRows").and
			.iClickAddLineFromMenu("and When: click the insert first option", true);

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 2 row", "myDecisionTable", 2, sRulePath, "DecisionTableRows");
	});
	opaTest("Should insert first row again", function (Given, When, Then) {

		//Actions
		When.onDecisionTablePage.iClickTheAddLink("When: click the plus button", "DecisionTableRows").and
			.iClickAddLineFromMenu("and When: click the insert first option", true);

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 3 rows", "myDecisionTable", 3, sRulePath, "DecisionTableRows");
	});
	opaTest("Should insert last row", function (Given, When, Then) {
		//Actions
		When.onDecisionTablePage.iClickTheCheckBox("When: Click the last check box", "DecisionTableRows", 2).and
		When.onDecisionTablePage.iClickTheAddLink("When: click the plus button", "DecisionTableRows").and
			.iClickAddLineFromMenu("and When: click the insert first option", false);

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 4 rows", "myDecisionTable", 4, sRulePath, "DecisionTableRows");
	});
	opaTest("Should insert second row", function (Given, When, Then) {

		//Actions
		When.onDecisionTablePage.iClickTheCheckBox("When: Click the first check box", "DecisionTableRows", 0).and
		When.onDecisionTablePage.iClickTheAddLink("When: click the plus button", "DecisionTableRows").and
			.iClickAddLineFromMenu("and When: click the insert first option", false);

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 5 rows", "myDecisionTable", 5, sRulePath, "DecisionTableRows");
	});
	opaTest("Should delete first row", function (Given, When, Then) {

		//Actions
		When.onDecisionTablePage.iClickTheCheckBox("When: Select the first check box", "DecisionTableRows", 0).and
			.iClickTheDeleteLink("and When: click the delete Button", "DecisionTableRows");

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 4 rows", "myDecisionTable", 4, sRulePath, "DecisionTableRows");
	});
	opaTest("Should delete last row", function (Given, When, Then) {

		//Actions
		When.onDecisionTablePage.iClickTheCheckBox("When: Select the last check box", "DecisionTableRows", 3).and
			.iClickTheDeleteLink("and When: click the delete Button", "DecisionTableRows");

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 3 rows", "myDecisionTable", 3, sRulePath, "DecisionTableRows");
	});
	opaTest("Negative test: Shouldn't click the Delete button", function (Given, When, Then) {

		//Actions
		When.onDecisionTablePage.iClickTheDeleteLink("When: click the delete button", "DecisionTableRows");

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 3 rows", "myDecisionTable", 3, sRulePath, "DecisionTableRows");
	});
	opaTest("Should delete all rows (3)", function (Given, When, Then) {

		//Actions
		When.onDecisionTablePage.iClickTheCheckBox("When: Select the last check box", "DecisionTableRows", false).and
			.iClickTheDeleteLink("and When: click the delete button", "DecisionTableRows");

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 3 rows", "myDecisionTable", 3, sRulePath, "DecisionTableRows");
	});
	opaTest("Negative test: Shouldn't click the insert after option", function (Given, When, Then) {

		//Actions
		When.onDecisionTablePage.iClickTheAddLink("When: click the plus button", "DecisionTableRows").and
			.iClickAddLineFromMenu("and When: click the insert after option", false);

		// Assertions
		Then.onDecisionTablePage.iCheckNumOfRows("Then: DT have 3 rows", "myDecisionTable", 3, sRulePath, "DecisionTableRows");
	});

	QUnit.start();

	QUnit.done(function () {
		Utils.stopRequestRecorder();
	});
});
sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";


		QUnit.module("Table Toolbar Buttons in Object Page");

		opaTest("The 'Delete' button in Object Page Tables is initially not visible", function(Given, When, Then) {

			Given.iStartTheObjectPage();

			Then.onTheObjectPage
				.theObjectPageTableIsRendered()
				.and
				.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(false, false, ["Delete"]);
		});

		opaTest("The 'Delete' button in Object Page Tables is visible and disabled after pressing 'Edit' 'Paste' button enabled", function(Given, When, Then) {

			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iClickTheButtonHavingLabel("Sales Order Items");

			Then.onTheObjectPage
				.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(true, false, ["Delete"])
				.and
				.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(true, true, ["Paste"]);
		});
		
		opaTest("The 'Paste' button in Object Page Tables is visible and Info dialog seen when pressed", function(Given, When, Then) {

			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::pasteEntries");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Information")
				.and
				.iShouldSeeTheDialogWithContent("To paste in this browser, use the keyboard shortcut Ctrl+V (for Windows) or Cmd+V (for Mac).");
		});

		opaTest("The 'Delete' button in Object Page Tables is enabled after selecting an item", function(Given, When, Then) {

			When.onTheGenericObjectPage
				.iClickTheDialogButtonWithLabel("OK")
				.and
				.iSelectListItemsByLineNo([1], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");

			Then.onTheObjectPage
				.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(true, true, ["Delete"]);
		});

		opaTest("The 'Delete' button in Object Page Tables is not visible after pressing 'Cancel'", function(Given, When, Then) {

			When.onTheGenericObjectPage
				.iCancelTheDraft(true);

			Then.onTheObjectPage
				.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(false, false, ["Delete"]);
		});

		opaTest("The 'Delete' button in Object Page Tables is visible and disabled after pressing 'Edit' again", function(Given, When, Then) {

			When.onTheGenericObjectPage
				.iClickTheEditButton();

			Then.onTheObjectPage
				.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(true, false, ["Delete"]);
		});

		opaTest("The SmartmultiInput field is rendered on the Object page table", function (Given, When, Then) {
			
			When.onTheGenericObjectPage
				.iCancelTheDraft(true);
			Then.onTheObjectPage
				.iSeeSmartMultiInputFieldIsRenderedOnTheTable("Category");
		});

		opaTest("Tear down the application", function (Given, When, Then) {
			Then.iTeardownMyApp();
			expect(0);
		});
		
	
		
		QUnit.module("Table Variants in Object Page");

		opaTest("#1: Starting the app, loading data", function (Given, When, Then) {
			//Given.iStartTheListReportWithChange();			// starting with demokit.html
			Given.iStartTheListReportInFlpSandboxWithChange();	// starting with flpSandbox.html with UI Changes

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iLookAtTheScreen();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});
		
		opaTest("#2: Navigate to ObjectPage", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Sales Order Items");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000")
				.and
				.theObjectPageTableFieldHasTheCorrectValue("to_Item", {
					Line   : 0,
					Field  : "SalesOrderItem",
					Value : "100"
				});
		});

		/* do not create a new variant but work on an existing one */
		opaTest("#3: Sort the item list", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheOverflowToolbarButton("Settings")
				.and
				.iClickTheButtonHavingLabel("Sort")
				.and
				.iChoosetheItemInComboBox("Item Position")
				.and
				.iClickTheButtonHavingLabel("OK");
			
			Then.onTheGenericObjectPage
				.iShouldSeeTheControlWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-modified");
		});
		
		opaTest("#4: Save the variant", function (Given, When, Then) {
			When.onTheGenericObjectPage
				//.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-trigger")
				.iClickOnSmartVariantViewSelection("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-trigger")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-saveas")
				.and
				.iSetTheInputFieldWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-name", "Sorted")
				.and
				.iClickTheButtonOnTheDialog("Save");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");  // dummy
		});
		
		opaTest("#5: External navigation to EPM Manage Products ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLink("HT-1010");

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.iShouldSeeTheControlWithCompleteId("epmprodman::sap.suite.ui.generic.template.ListReport.view.ListReport::SEPMRA_C_PD_Product--listReport-header");
		});
		
		opaTest("#6: Navigate back to Sales Order Object Page", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");  // dummy
			/*
			  At this point the saved variant should be visible and should be checked by the OPA test.
			  Currently the standard variant is selected after coming back from the external navigation
			 */
			
		});
		
		opaTest("Tear down the application", function (Given, When, Then) {
			Then.iTeardownMyApp();
			expect(0);
		});
		
	}
);

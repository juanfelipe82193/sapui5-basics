sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Arrangement",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Util",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Action",
	"test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Assertion"
], function (Opa5, opaTest, Arrangement, TestUtil, Action, Assertion) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	// ----------------------------------------------------------------
	// Check if the application is running normaly
	// ----------------------------------------------------------------
	opaTest("When I start the 'appUnderTestTable' app, the table should appear and contain some columns", function (Given, When, Then) {
		//insert application
		Given.iStartMyAppInAFrame('test-resources/sap/ui/mdc/qunit/p13n/OpaTests/appUnderTestTable/TableOpaApp.html');
		Given.enableAndDeleteLrepLocalStorage();
		When.iLookAtTheScreen();

		//check icons
		Then.iShouldSeeButtonWithIcon(Arrangement.P13nDialog.Settings.Icon);
		Then.iShouldSeeButtonWithIcon(Arrangement.P13nDialog.Sort.Icon);

		//check initially visible columns
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.mdc.table.Column", [
			"name", "foundingYear", "modifiedBy", "createdAt"
		]);

		Then.theVariantManagementIsDirty(false);
	});

	opaTest("When I press on 'Add/Remove Columns' button, the table-specific-dialog opens", function (Given, When, Then) {
		When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Icon);

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeDialogTitle(Arrangement.P13nDialog.Titles.columns);

		Then.iShouldSeeP13nItem("Name", 0, true);
		Then.iShouldSeeP13nItem("Year", 1, true);
		Then.iShouldSeeP13nItem("Modified By", 2, true);
		Then.iShouldSeeP13nItem("Created at", 3, true);
		Then.iShouldSeeP13nItem("artistUUID", 4, false);
		Then.iShouldSeeP13nItem("Breakout Year", 5, false);
		Then.iShouldSeeP13nItem("ChangedAt", 6, false);
		Then.iShouldSeeP13nItem("City", 7, false);
		Then.iShouldSeeP13nItem("Country", 8, false);
		Then.iShouldSeeP13nItem("CreatedBy", 9, false, false);
		Then.iShouldSeeP13nItem("Region", 10, false);
	});

	opaTest("When I close the 'Add/Remove Columns' button, the table has not been changed", function (Given, When, Then) {
		if (sap.ui.Device.system.phone) {
			When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Back);
		} else {
			Given.closeAllPopovers();
		}

		//close p13n dialog
		Then.thePersonalizationDialogShouldBeClosed();

		//check initially visible columns
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.mdc.table.Column", [
			"name", "foundingYear", "modifiedBy", "createdAt"
		]);

		//check dirty flag
		Then.theVariantManagementIsDirty(false);
	});

	opaTest("When I press on 'Define Sort Properties' button, sort dialog should open", function (Given, When, Then) {
		When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Sort.Icon);

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeDialogTitle(Arrangement.P13nDialog.Titles.sort);

		checkDefaultVariantSortDialog(Then);
	});

	opaTest("When I close the 'Define Sort Properties' button, the table has not been changed", function (Given, When, Then) {
		if (sap.ui.Device.system.phone) {
			When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Sort.Back);
		} else {
			Given.closeAllPopovers();
		}

		//close p13n dialog
		Then.thePersonalizationDialogShouldBeClosed();

		//check initially visible columns
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.mdc.table.Column", [
			"name", "foundingYear", "modifiedBy", "createdAt"
		]);

		//check dirty flag
		Then.theVariantManagementIsDirty(false);
	});

	// ----------------------------------------------------------------
	// Variant Management tests + set default variant
	// ----------------------------------------------------------------

	opaTest("When I select 2 additional row and also remove 1 and save a new Variant the personalization should change", function (Given, When, Then) {
		When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Icon);
		Then.thePersonalizationDialogOpens();

		When.iSelectColumn("Breakout Year", Arrangement.P13nDialog.Titles.columns);
		When.iSelectColumn("City", Arrangement.P13nDialog.Titles.columns);
		When.iSelectColumn("Year", Arrangement.P13nDialog.Titles.columns);

		checkTestVariantColumnsDialog(Then);

		if (sap.ui.Device.system.phone) {
			When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Back);
		} else {
			Given.closeAllPopovers();
		}

		//close p13n dialog
		Then.thePersonalizationDialogShouldBeClosed();

		Then.iShouldSeeVisibleColumnsInOrderInTable(
			"sap.ui.mdc.Table",
			"sap.ui.mdc.table.Column", [
			"name", "modifiedBy", "createdAt", "breakupYear", "cityOfOrigin_city"
		]);

		Then.iShouldSeeSelectedVariant("Standard");
		When.iSaveVariantAs("Standard", "TestVariant");
		Then.iShouldSeeSelectedVariant("TestVariant");

		//select a default variant
		When.iSelectDefaultVariant("TestVariant");
		Then.iShouldSeeSelectedVariant("TestVariant");

		//shut down app frame for next test
		Then.iTeardownMyAppFrame();
	});

	// ----------------------------------------------------------------
	// Select a default variant and restart the app (mock preprocessing)
	// ----------------------------------------------------------------
	opaTest("When I select the default variant and restart the application, it should load the default variant", function(Given, When, Then){
		//simulate restart
		Given.iStartMyAppInAFrame('test-resources/sap/ui/mdc/qunit/p13n/OpaTests/appUnderTestTable/TableOpaApp.html');

		//check if the correct variant is selected
		Then.iShouldSeeSelectedVariant("TestVariant");

		//check if the correct columns are there from default variant "TestVariant"
		Then.iShouldSeeVisibleColumnsInOrderInTable(
			"sap.ui.mdc.Table",
			"sap.ui.mdc.table.Column", [
			"name", "modifiedBy", "createdAt", "breakupYear", "cityOfOrigin_city"
		]);
	});

	opaTest("When I switch the variant back to 'Standard' I should see the default personalization again", function (Given, When, Then) {
		When.iSelectVariant("Standard");

		When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Icon);
		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeP13nItem("Name", 0, true);
		Then.iShouldSeeP13nItem("Founding Year", 1, true);
		Then.iShouldSeeP13nItem("Modified By", 2, true);
		Then.iShouldSeeP13nItem("Created at", 3, true);
		Then.iShouldSeeP13nItem("artistUUID", 4, false);
		Then.iShouldSeeP13nItem("Breakout Year", 5, false);
		Then.iShouldSeeP13nItem("ChangedAt", 6, false);
		Then.iShouldSeeP13nItem("City", 7, false);
		Then.iShouldSeeP13nItem("Country", 8, false);
		Then.iShouldSeeP13nItem("CreatedBy", 9, false);
		Then.iShouldSeeP13nItem("Region", 10, false);

		if (sap.ui.Device.system.phone) {
			When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Back);
		} else {
			Given.closeAllPopovers();
		}

		//close p13n dialog
		Then.thePersonalizationDialogShouldBeClosed();

		Then.iShouldSeeVisibleColumnsInOrderInTable(
			"sap.ui.mdc.Table",
			"sap.ui.mdc.table.Column", [
			"name", "foundingYear", "modifiedBy", "createdAt"
		]);
	});

	// ----------------------------------------------------------------
	// Methods
	// ----------------------------------------------------------------

	function checkDefaultVariantSortDialog(Then) {
		Then.iShouldSeeP13nItem("artistUUID", 0, false);
		Then.iShouldSeeP13nItem("Breakout Year", 1, false);
		Then.iShouldSeeP13nItem("ChangedAt", 2, false);
		Then.iShouldSeeP13nItem("ChangedBy", 3, false);
		Then.iShouldSeeP13nItem("City", 4, false);
		Then.iShouldSeeP13nItem("Country", 5, false);
		Then.iShouldSeeP13nItem("CreatedAt", 6, false);
		Then.iShouldSeeP13nItem("CreatedBy", 7, false);
		Then.iShouldSeeP13nItem("Founding Year", 8, false);
		Then.iShouldSeeP13nItem("Name", 9, false);
		Then.iShouldSeeP13nItem("Region", 10, false);
	}

	function checkTestVariantColumnsDialog(Then) {
		Then.iShouldSeeP13nItem("Name", 0, true);
		Then.iShouldSeeP13nItem("Year", 1, false);
		Then.iShouldSeeP13nItem("Modified By", 2, true);
		Then.iShouldSeeP13nItem("Created at", 3, true);
		Then.iShouldSeeP13nItem("artistUUID", 4, false);
		Then.iShouldSeeP13nItem("Breakout Year", 5, true);
		Then.iShouldSeeP13nItem("ChangedAt", 6, false);
		Then.iShouldSeeP13nItem("City", 7, true);
		Then.iShouldSeeP13nItem("Country", 8, false);
		Then.iShouldSeeP13nItem("CreatedBy", 9, false);
		Then.iShouldSeeP13nItem("Region", 10, false);
	}
});

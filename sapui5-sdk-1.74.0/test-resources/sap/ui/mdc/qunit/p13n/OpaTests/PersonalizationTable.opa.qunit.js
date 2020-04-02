sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Arrangement',
	'test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Util',
	'test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Action',
	'test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Assertion',
	'sap/ui/Device'
], function (Opa5, opaTest, Arrangement, TestUtil, Action, Assertion, Device) {
	'use strict';

	if (window.blanket) {
		//window.blanket.options("sap-ui-cover-only", "sap/ui/mdc");
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	Opa5.extendConfig({
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view.",
		autoWait: true
	});

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
		sap.ui.Device.system.phone ? When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Back) : Given.closeAllPopovers();

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

	});

	opaTest("When I close the 'Define Sort Properties' button, the table has not been changed", function (Given, When, Then) {
		sap.ui.Device.system.phone ? When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Sort.Back) : Given.closeAllPopovers();

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
	// Define a new sorter
	// ----------------------------------------------------------------
	opaTest("When I press on the Checkbox to sort for Country, the table should be changed", function (Given, When, Then) {
		When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Sort.Icon);

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeDialogTitle(Arrangement.P13nDialog.Titles.sort);
		When.iSelectColumn("Country", Arrangement.P13nDialog.Titles.sort);

		Then.iShouldSeeP13nItem("artistUUID", 0, false);
		Then.iShouldSeeP13nItem("Breakout Year", 1, false);
		Then.iShouldSeeP13nItem("ChangedAt", 2, false);
		Then.iShouldSeeP13nItem("ChangedBy", 3, false);
		Then.iShouldSeeP13nItem("City", 4, false);
		Then.iShouldSeeP13nItem("Country", 5, true);
		Then.iShouldSeeP13nItem("CreatedAt", 6, false);
		Then.iShouldSeeP13nItem("CreatedBy", 7, false);
		Then.iShouldSeeP13nItem("Founding Year", 8, false);
		Then.iShouldSeeP13nItem("Name", 9, false);
		Then.iShouldSeeP13nItem("Region", 10, false);
	});

	opaTest("When I close the 'Selected Columns' button, the table has been changed", function (Given, When, Then) {
		sap.ui.Device.system.phone ? When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Sort.Back) : Given.closeAllPopovers();

		//close p13n dialog
		Then.thePersonalizationDialogShouldBeClosed();

		//check initially visible columns
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.mdc.table.Column", [
			"name", "foundingYear", "modifiedBy", "createdAt"
		]);

		//check dirty flag
		Then.theVariantManagementIsDirty(true);
	});

	// ----------------------------------------------------------------
	// Move a Column to the top
	// ----------------------------------------------------------------
	opaTest("When I select the 'Country' column and move it to the top, the table should be changed", function (Given, When, Then) {

		When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Icon);
		Then.thePersonalizationDialogOpens();

		When.iSelectColumn("Country", Arrangement.P13nDialog.Titles.columns);

		When.iPressButtonWithText("Reorder");
		When.iClickOnTableItem("Country").and.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.MoveToTop);

		Then.iShouldSeeP13nItem("Country", 0);
		Then.iShouldSeeP13nItem("Name", 1);
		Then.iShouldSeeP13nItem("Year", 2);
		Then.iShouldSeeP13nItem("Modified By", 3);
		Then.iShouldSeeP13nItem("Created at", 4);
	});

	// ----------------------------------------------------------------
	// Select two columns
	// ----------------------------------------------------------------
	opaTest("When I select two additional columns and move them one up, the table should be changed", function (Given, When, Then) {
		sap.ui.Device.system.phone ? When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Sort.Back) : Given.closeAllPopovers();
		When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Icon);
		Then.thePersonalizationDialogOpens();

		When.iSelectColumn("Breakout Year", Arrangement.P13nDialog.Titles.columns);
		When.iSelectColumn("Region", Arrangement.P13nDialog.Titles.columns);

		When.iPressButtonWithText("Reorder");
		When.iClickOnTableItem("Breakout Year").and.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.MoveToTop);
		When.iClickOnTableItem("Region").and.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.MoveToTop);

		Then.iShouldSeeP13nItem("Region", 0);
		Then.iShouldSeeP13nItem("Breakout Year", 1);
		Then.iShouldSeeP13nItem("Country", 2);
		Then.iShouldSeeP13nItem("Name", 3);
		Then.iShouldSeeP13nItem("Year", 4);
		Then.iShouldSeeP13nItem("Modified By", 5);
		Then.iShouldSeeP13nItem("Created at", 6);

	});

	// ----------------------------------------------------------------
	// Close the dialog
	// ----------------------------------------------------------------
	opaTest("Close the dialog", function (Given, When, Then) {
		sap.ui.Device.system.phone ? When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Back) : Given.closeAllPopovers();

		//close p13n dialog
		Then.thePersonalizationDialogShouldBeClosed();
	});

	// ----------------------------------------------------------------
	// Reopen the dialog to see if it the items have been rearranged
	// ----------------------------------------------------------------
	opaTest("Reopen the dialog to see if it the items have been rearranged", function (Give, When, Then) {
		//Reopen the dialog
		When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Icon);
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeDialogTitle(Arrangement.P13nDialog.Titles.columns);

		Then.iShouldSeeP13nItem("Region", 0, true);
		Then.iShouldSeeP13nItem("Breakout Year", 1, true);
		Then.iShouldSeeP13nItem("Country", 2, true);
		Then.iShouldSeeP13nItem("Name", 3, true);
		Then.iShouldSeeP13nItem("Year", 4, true);
		Then.iShouldSeeP13nItem("Modified By", 5, true);
		Then.iShouldSeeP13nItem("Created at", 6, true);
		Then.iShouldSeeP13nItem("artistUUID", 7, false);
		Then.iShouldSeeP13nItem("ChangedAt", 8, false);
		Then.iShouldSeeP13nItem("City", 9, false);
		Then.iShouldSeeP13nItem("CreatedBy", 10, false);

	});

	// ----------------------------------------------------------------
	// Check the 'Reorder' / 'Select' functionality
	// ----------------------------------------------------------------
	opaTest("check 'Reorder' mode", function (Given, When, Then) {
		//Reorder table items
		When.iPressButtonWithText("Reorder");
		Then.iShouldSeeP13nItem("Region", 0);
		Then.iShouldSeeP13nItem("Breakout Year", 1);
		Then.iShouldSeeP13nItem("Country", 2);
		Then.iShouldSeeP13nItem("Name", 3);
		Then.iShouldSeeP13nItem("Year", 4);
		Then.iShouldSeeP13nItem("Modified By", 5);
		Then.iShouldSeeP13nItem("Created at", 6);
	});

	opaTest("check 'Select' mode", function (Given, When, Then) {
		//Select table items
		When.iPressButtonWithText("Select");
		Then.iShouldSeeP13nItem("Region", 0, true);
		Then.iShouldSeeP13nItem("Breakout Year", 1, true);
		Then.iShouldSeeP13nItem("Country", 2, true);
		Then.iShouldSeeP13nItem("Name", 3, true);
		Then.iShouldSeeP13nItem("Year", 4, true);
		Then.iShouldSeeP13nItem("Modified By", 5, true);
		Then.iShouldSeeP13nItem("Created at", 6, true);
		Then.iShouldSeeP13nItem("artistUUID", 7, false);
		Then.iShouldSeeP13nItem("ChangedAt", 8, false);
		Then.iShouldSeeP13nItem("City", 9, false);
		Then.iShouldSeeP13nItem("CreatedBy", 10, false);
	});

	opaTest("check column header sort functionality: all previous sorters are deleted", function (Given, When, Then) {
		//close popover
		sap.ui.Device.system.phone ? When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Sort.Back) : Given.closeAllPopovers();

		When.iClickOnColumn("Year");
		When.iSortCurrentOpenColumnContextMenu();

		When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Sort.Icon);

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeP13nItem("Founding Year", 0, true);
		Then.iShouldSeeP13nItem("artistUUID", 1, false);
		Then.iShouldSeeP13nItem("Breakout Year", 2, false);
		Then.iShouldSeeP13nItem("ChangedAt", 3, false);
		Then.iShouldSeeP13nItem("ChangedBy", 4, false);
		Then.iShouldSeeP13nItem("City", 5, false);
		Then.iShouldSeeP13nItem("Country", 6, false);
		Then.iShouldSeeP13nItem("CreatedAt", 7, false);
		Then.iShouldSeeP13nItem("CreatedBy", 8, false);
		Then.iShouldSeeP13nItem("Name", 9, false);
		Then.iShouldSeeP13nItem("Region", 10, false);
	});

	opaTest("sort another column via context menu: only new column should be sorted", function (Given, When, Then) {
		//close popover
		sap.ui.Device.system.phone ? When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Sort.Back) : Given.closeAllPopovers();

		When.iClickOnColumn("Name");
		When.iSortCurrentOpenColumnContextMenu();

		When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Sort.Icon);

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeP13nItem("Name", 0, true);
		Then.iShouldSeeP13nItem("artistUUID", 1, false);
		Then.iShouldSeeP13nItem("Breakout Year", 2, false);
		Then.iShouldSeeP13nItem("ChangedAt", 3, false);
		Then.iShouldSeeP13nItem("ChangedBy", 4, false);
		Then.iShouldSeeP13nItem("City", 5, false);
		Then.iShouldSeeP13nItem("Country", 6, false);
		Then.iShouldSeeP13nItem("CreatedAt", 7, false);
		Then.iShouldSeeP13nItem("CreatedBy", 8, false);
		Then.iShouldSeeP13nItem("Founding Year", 9, false);
		Then.iShouldSeeP13nItem("Region", 10, false);

		Then.iTeardownMyAppFrame();
	});
});

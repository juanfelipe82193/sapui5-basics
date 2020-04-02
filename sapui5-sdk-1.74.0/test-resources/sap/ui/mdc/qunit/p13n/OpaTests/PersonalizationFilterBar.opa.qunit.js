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

	var aFilterItems = [
		{p13nItem: "artistUUID", selected: false},
		{p13nItem: "Breakout Year", selected: false},
		{p13nItem: "ChangedAt", selected: false},
		{p13nItem: "ChangedBy", selected: false},
		{p13nItem: "City", selected: false},
		{p13nItem: "Country", selected: false},
		{p13nItem: "CreatedAt", selected: false},
		{p13nItem: "CreatedBy", selected: false},
		{p13nItem: "Founding Year", selected: false},
		{p13nItem: "Name", selected: false},
		{p13nItem: "Region", selected: false}
	];

	opaTest("When I start the 'appUnderTestTable' app, the FilterBar should appear and contain no FilterField", function (Given, When, Then) {
		//insert application
		Given.iStartMyAppInAFrame('test-resources/sap/ui/mdc/qunit/p13n/OpaTests/appUnderTestTable/TableOpaApp.html');
		Given.enableAndDeleteLrepLocalStorage();
		When.iLookAtTheScreen();

		//check buttons
		Then.iShouldSeeButtonWithText("Adapt Filters");//TODO
		Then.iShouldSeeButtonWithText("Go");//TODO

		//check initially visible FilterFields
		Then.iShouldSeeVisibleFiltersInOrderInFilterBar([]);

		Then.theVariantManagementIsDirty(false);
	});

	opaTest("When I press on 'Adapt Filters' button, the 'Adapt Filters' popover opens", function (Given, When, Then) {
		When.iPressButtonWithText("Adapt Filters");//TODO

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeDialogTitle(Arrangement.P13nDialog.Titles.adaptFilter);

		Then.iShouldSeeP13nItems(aFilterItems);
	});

	opaTest("When I close the 'Adapt Filters' button, the FilterBar has not been changed", function (Given, When, Then) {
		sap.ui.Device.system.phone ? When.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.Back) : Given.closeAllPopovers();

		//close p13n dialog
		Then.thePersonalizationDialogShouldBeClosed();

		//check initially visible FilterFields
		Then.iShouldSeeVisibleFiltersInOrderInFilterBar([]);

		//check dirty flag
		Then.theVariantManagementIsDirty(false);
	});


	// ----------------------------------------------------------------
	// Define new FilterFields
	// ----------------------------------------------------------------
	opaTest("When I press on 'Adapt Filters' button, I change the FilterField selection", function (Given, When, Then) {
		When.iPressButtonWithText("Adapt Filters");//TODO
		Then.thePersonalizationDialogOpens();

		// --> FilterBar needs to handle multiple clicks without crashing
		When.iPressButtonWithText("Adapt Filters");

		When.iSelectColumn("Country", Arrangement.P13nDialog.Titles.adaptFilter);
		When.iSelectColumn("City", Arrangement.P13nDialog.Titles.adaptFilter);

		Then.iShouldSeeVisibleFiltersInOrderInFilterBar(["City", "Country"]);

		aFilterItems[4].selected = true;
		aFilterItems[5].selected = true;

		Then.iShouldSeeP13nItems(aFilterItems);

		//check dirty flag
		Then.theVariantManagementIsDirty(true);
	});

	// ----------------------------------------------------------------
	// Move a FilterField to the top
	// ----------------------------------------------------------------
	opaTest("When I select the 'Country' column and move it to the top, the table should be changed", function (Given, When, Then) {
		When.iPressButtonWithText("Reorder");
		When.iClickOnTableItem("Country").and.iPressOnButtonWithIcon(Arrangement.P13nDialog.Settings.MoveToTop);

		var aCurrentFilterItems = [
			aFilterItems[5],
			aFilterItems[4]
		];

		aCurrentFilterItems[0].selected = false;
		aCurrentFilterItems[1].selected = false;

		Then.iShouldSeeP13nItems(aCurrentFilterItems);
	});
});

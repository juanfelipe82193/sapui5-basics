/* global QUnit */

sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Util',
	'./Arrangement',
	'./Action',
	'./Assertion',
	'sap/ui/Device'
], function (
	Opa5,
	opaTest,
	Util,
	Arrangement,
	Action,
	Assertion,
	Device
) {
	"use strict";

	Opa5.extendConfig({
		autoWait:true,
		asyncPolling: true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	if (Device.browser.msie || Device.browser.edge) {
		Opa5.extendConfig({
			executionDelay: 50
		});
	}

	QUnit.module("Generic");

	opaTest("When I open the Settings dialog, I want to navigate to FilterPanel", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();

		//Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
	});

	opaTest("When clicking the ComboBox on the FilterPanel, I want a list of all filterable properties", function(Given, When, Then) {
		//Actions
		When.iClickOnComboBox("Category");

		//Assertions
		Then.iShouldSeeComboBoxItems([
			"Category",
			"Currency Code",
			"Date",
			"Name",
			"Price",
			"Product ID",
			"Status"
		]);
	});

	opaTest("When clicking the Select control on the FilterPanel, I want a list of all possible operations", function(Given, When, Then) {
		//Actions
		When.iClickOnSelect("Contains");

		//Assertions
		Then.iShouldSeeSelectListItems([
			"contains",
			"equal to",
			"between",
			"starts with",
			"ends with",
			"less than",
			"less than or equal to",
			"greater than",
			"greater than or equal to",
			"empty"
		]);
	});

	opaTest("When changing from 'Category' to 'Date', the Select should have different items", function(Given, When, Then) {
		//Actions
		When.iClickOnSelect("Contains"); //close
		When.iChangeComboboxSelection("Category","Date");
		When.iClickOnSelect("EQ");

		//Assertions
		Then.iShouldSeeSelectListItems([
			"equal to",
			"between",
			"before",
			"before or on",
			"after",
			"on or after"
		]);
	});

	opaTest("When changing from 'Date' to 'Supplier Name', the Select should have different items (maxlength: 1)", function(Given, When, Then) {
		//Actions
		When.iClickOnSelect("EQ");
		When.iChangeComboboxSelection("Date","Supplier Name");
		When.iClickOnSelect("EQ");

		//Assertions
		Then.iShouldSeeSelectListItems([
			"equal to",
			"between",
			"less than",
			"less than or equal to",
			"greater than",
			"greater than or equal to",
			"empty"
		]);
	});

	opaTest("When switching from a 'Date' property to 'Boolean' the warning state should resolve upon changing the key", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iChangeTheFilterField("Depth").and.iChangeTheCondition("equal to");
		When.iEnterTextInInput("Value", "Test");
		When.iChangeTheFilterField("My Boolean", false, 0, true);

		//Warning should disappear after the selection has been changed
		Then.iCheckSelectValueState(1,"Warning");
		When.iChangeSelectSelection(1, "Yes");
		Then.iCheckSelectValueState(1, "None");
		When.iPressDeleteRowButton(0);

		//dialog needs to be closed for follow-up tests
		When.iPressOkButton();
	});

	QUnit.module("String");

	opaTest("When adding a Filter for 'Category' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("equal to");
		When.iEnterTextInInput("Value", "Accessory");
		When.iPressOkButton();

		//Assertions
		Then.thePersonalizationDialogShouldBeClosed();

		/* CodeEditor ID's
		*
		* SmartTable personalization controller data: 'applicationUnderTestFiltering---IDView--dataTableController'
		* SmartTable _getPersonalizationData result : 'applicationUnderTestFiltering---IDView--dataTable'
		* SmartChart personalization controller data: 'applicationUnderTestFiltering---IDView--currentSmartChartFilterDataController'
		* SmartChart _getPersonalizationData result : 'applicationUnderTestFiltering---IDView--currentSmartChartFilterData'
		*
		*/

		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "EQ",
					"oValue1": "Accessory",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Category' using 'contains' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("contains");
		When.iEnterTextInInput("Value", "Ac");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'Contains' (contains)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "Contains",
					"oValue1": "Ac",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Category' using 'starts with' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("starts with");
		When.iEnterTextInInput("Value", "Ac");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'StartsWith' (starts with)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "StartsWith",
					"oValue1": "Ac",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Category' using 'ends with' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("ends with");

		When.iEnterTextInInput("Value", "ry");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EndsWith' (ends with)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "EndsWith",
					"oValue1": "ry",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Category' using 'less than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("less than");
		When.iEnterTextInInput("Value", "a");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LT' (less than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "LT",
					"oValue1": "a",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Category' using 'less than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("less than or equal to");
		When.iEnterTextInInput("Value", "a");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LE' (less than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "LE",
					"oValue1": "a",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Category' using 'greater than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("greater than");
		When.iEnterTextInInput("Value", "A");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GT' (greater than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "GT",
					"oValue1": "A",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Category' using 'greater than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("greater than or equal to");
		When.iEnterTextInInput("Value", "A");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (greater than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "GE",
					"oValue1": "A",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Category' using 'empty' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("empty");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		// "Category" field is annotated as "nullable=false"
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category nullable' using 'empty' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category nullable").and.iChangeTheCondition("empty");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		// "Category nullable" field is not annotated as "nullable=false"
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "CategoryNullable",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				},
				{
					"sPath": "CategoryNullable",
					"sOperator": "EQ",
					"oValue1": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("between");
		When.iEnterTextInInput("from", "A");
		When.iEnterTextInInput("to", "a");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "BT",
					"oValue1": "A",
					"oValue2": "a",
					"_bMultiFilter": false
				}
			]
		);

	});

	QUnit.module("Date");

	opaTest("When adding a Filter for 'Date' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("equal to");
		When.iEnterTextInDatePicker("Value", "May 14, 2019");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "EQ",
					"oValue1": "2019-05-14T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Date' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("between");
		When.iEnterTextInDatePicker("from", "May 14, 2019");
		When.iEnterTextInDatePicker("to", "May 15, 2019");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "BT",
					"oValue1": "2019-05-14T00:00:00.000Z",
					"oValue2": "2019-05-15T00:00:00.000Z",
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("Entering only a 'from' value for the 'between' operator should cause a warning", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("between");
		When.iEnterTextInDatePicker("from", "May 14, 2019");
		When.iEnterTextInDatePicker("to", "");
		When.iPressOkButton();

		//Assertions
		Then.iShouldSeeWarning();

		//Actions - cleanup for next tests
		When.iPressOnIgnoreButton();
	});

	opaTest("Entering only a 'to' value for the 'between' operator should cause a warning", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("between");
		When.iEnterTextInDatePicker("from", "");
		When.iEnterTextInDatePicker("to", "May 14, 2019");
		When.iPressOkButton();

		//Assertions
		Then.iShouldSeeWarning();

		//Actions - cleanup for next tests
		When.iPressOnIgnoreButton();
	});

	opaTest("When adding a Filter for 'Date' using 'before' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("before");

		When.iEnterTextInDatePicker("Value", "May 17, 2019");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LT' (before)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "LT",
					"oValue1": "2019-05-17T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Date' using 'after' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("after");
		When.iEnterTextInDatePicker("Value", "May 17, 2018");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GT' (after)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "GT",
					"oValue1": "2018-05-17T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Date' using 'before or on' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("before or on");
		When.iEnterTextInDatePicker("Value", "May 13, 2019");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LE' (before or on)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "LE",
					"oValue1": "2019-05-13T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Date' using 'on or after' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("on or after");
		When.iEnterTextInDatePicker("Value", "May 13, 2019");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (on or after)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "GE",
					"oValue1": "2019-05-13T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	QUnit.module("Decimal");

	opaTest("When adding a Filter for 'Price' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Price").and.iChangeTheCondition("equal to");
		When.iPressDeleteRowButton(1);
		When.iEnterTextInInput("Value", "123.456");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (on or after)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "EQ",
					"oValue1": "123.456",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Price' using 'less than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Price").and.iChangeTheCondition("less than");
		When.iEnterTextInInput("Value", "1");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LT' (less than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "LT",
					"oValue1": "1",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Price' using 'less than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Price").and.iChangeTheCondition("less than or equal to");
		When.iEnterTextInInput("Value", "1");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LE' (less than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "LE",
					"oValue1": "1",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Price' using 'greater than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Price").and.iChangeTheCondition("greater than");
		When.iEnterTextInInput("Value", "1");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GT' (greater than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "GT",
					"oValue1": "1",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Price' using 'greater than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Price").and.iChangeTheCondition("greater than or equal to");
		When.iEnterTextInInput("Value", "1");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (greater than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "GE",
					"oValue1": "1",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Price' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Price").and.iChangeTheCondition("between");
		When.iEnterTextInInput("from", "1");
		When.iEnterTextInInput("to", "5000");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Price",
					"sOperator": "BT",
					"oValue1": "1",
					"oValue2": "5000",
					"_bMultiFilter": false
				}
			]
		);
	});

	QUnit.module("Double");

	opaTest("When adding a Filter for 'Number' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("equal to");
		When.iPressDeleteRowButton(1);
		When.iEnterTextInInput("Value", "123.456");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (on or after)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "EQ",
					"oValue1": 123.456,
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Number' using 'less than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("less than");
		When.iEnterTextInInput("Value", "1");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LT' (less than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "LT",
					"oValue1": 1,
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Number' using 'less than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("less than or equal to");
		When.iEnterTextInInput("Value", "12");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LE' (less than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "LE",
					"oValue1": 12,
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Number' using 'greater than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("greater than");
		When.iEnterTextInInput("Value", "1.45");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GT' (greater than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "GT",
					"oValue1": 1.45,
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Number' using 'greater than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("greater than or equal to");
		When.iEnterTextInInput("Value", "1.5");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (greater than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "GE",
					"oValue1": 1.5,
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Number' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("between");
		When.iEnterTextInInput("from", "1");
		When.iEnterTextInInput("to", "5000");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "BT",
					"oValue1": 1,
					"oValue2": 5000,
					"_bMultiFilter": false
				}
			]
		);
	});

	QUnit.module("String Exclude");

	opaTest("When adding a exclude Filter for 'Category' using 'empty' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Clean all possible include operations
		When.iExpandTheExcludePanel();
		When.iChangeTheFilterField("Category", true).and.iChangeTheCondition("empty", true);
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "Category",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			]
		);
	});

	opaTest("When adding a exclude Filter for 'Category' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iExpandTheExcludePanel().and.iCollapseTheIncludePanel();
		When.iChangeTheFilterField("Category", true).and.iChangeTheCondition("equal to", true);
		When.iEnterTextInInput("Value", "1");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "Category",
							"sOperator": "NE",
							"oValue1": "1",
							"oValue2": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			]
		);
	});

	opaTest("When adding a exclude Filter for 'Category nullable' using 'empty' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category nullable", true).and.iChangeTheCondition("empty", true);
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "CategoryNullable",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						},
						{
							"sPath": "CategoryNullable",
							"sOperator": "NE",
							"oValue1": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			]
		);
	});

	QUnit.module("Empty for Dates");

	["Date", "Date Time Offset"].forEach(function (sField) {
		opaTest(sField + " nullable - include and exclude operations", function(Given, When, Then) {
			var sFieldId = sField.split(" ").join("") + "Nullable";

			//Arrangements
			Given.iEnsureMyFilteringApplicationHasStarted();

			//Actions
			When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
			When.iChangeTheFilterField(sField + " nullable").and.iChangeTheCondition("empty");
			When.iExpandTheExcludePanel();
			When.iChangeTheFilterField(sField + " nullable", true).and.iChangeTheCondition("empty", true);
			When.iPressOkButton();

			//Assertions
			//-------------- operation: 'EQ' (empty)-------------------
			Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
				[
					{
						"aFilters": [
							{
								"sPath": sFieldId,
								"sOperator": "NE",
								"oValue1": null,
								"_bMultiFilter": false
							}
						],
						"bAnd": true,
						"_bMultiFilter": true
					},
					{
						"sPath": sFieldId,
						"sOperator": "EQ",
						"oValue1": null,
						"_bMultiFilter": false
					}
				]
			);
		});

		opaTest(sField + " - no empty operation should be available", function(Given, When, Then) {
			//Arrangements
			Given.iEnsureMyFilteringApplicationHasStarted();

			//Actions
			When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
			When.iChangeTheFilterField(sField);
			When.iExpandTheExcludePanel();
			When.iChangeTheFilterField(sField, true);

			//Assertions
			Then.iShouldSeeNoEmptyOperation();
			Then.iShouldSeeNoEmptyOperation(true);

			//Actions - cleanup for the next test
			When.iPressOkButton();
		});
	});

	opaTest("StringDate nullable - include and exclude operations", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("String date nullable", false, 0, true).and.iChangeTheCondition("empty");
		When.iExpandTheExcludePanel();
		// return;
		When.iChangeTheFilterField("String date nullable", true, 0, true).and.iChangeTheCondition("empty", true);
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "StringDateNullable",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						},
						{
							"sPath": "StringDateNullable",
							"sOperator": "NE",
							"oValue1": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				},
				{
					"sPath": "StringDateNullable",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				},
				{
					"sPath": "StringDateNullable",
					"sOperator": "EQ",
					"oValue1": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("StringDate - include and exclude operations", function(Given, When, Then) {
		//Arrangements
		Given.iEnsureMyFilteringApplicationHasStarted();

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("String date", false, 0, true).and.iChangeTheCondition("empty");
		When.iExpandTheExcludePanel();
		// return;
		When.iChangeTheFilterField("String date", true, 0, true).and.iChangeTheCondition("empty", true);
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "StringDate",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				},
				{
					"sPath": "StringDate",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				}
			]
		);

	});

	QUnit.module("Exclude operations");

	opaTest("String exclude operations", function(Given, When, Then) {
		// Arrangements
		var aConditions = [
				{operation: "contains", input1: "A"},
				{operation: "equal to", input1: "B"},
				{operation: "between", input1: "C", input2: "D"},
				{operation: "starts with", input1: "E"},
				{operation: "ends with", input1: "F"},
				{operation: "less than", input1: "G"},
				{operation: "less than or equal to", input1: "H"},
				{operation: "greater than", input1: "I"},
				{operation: "greater than or equal to", input1: "J"}
			],
			iCondition = 0;

		Given.iEnsureMyFilteringApplicationHasStarted();

		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iExpandTheExcludePanel();

		When.iChangeTheFilterField("Category", true, 0, true);

		aConditions.forEach(function (oCondition) {
			When.iChangeTheCondition(oCondition.operation, true, iCondition)
				.and.iEnterTextInConditionField(
			true,
					iCondition,
					oCondition.input1,
					(oCondition.input2 ? oCondition.input2 : undefined)
				);

			When.iPressTheFilterAddButton(true);
			iCondition++;
		});

		When.iPressOkButton();

		// Assertions
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "Category",
							"sOperator": "NotContains",
							"oValue1": "A",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "NE",
							"oValue1": "B",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "NB",
							"oValue1": "C",
							"oValue2": "D",
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "NotStartsWith",
							"oValue1": "E",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "NotEndsWith",
							"oValue1": "F",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "GE",
							"oValue1": "G",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "GT",
							"oValue1": "H",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "LE",
							"oValue1": "I",
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Category",
							"sOperator": "LT",
							"oValue1": "J",
							"oValue2": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			]
		);

	});

	opaTest("Number exclude operations", function(Given, When, Then) {
		// Arrangements
		var aConditions = [
				{operation: "equal to", input1: "1"},
				{operation: "between", input1: "2", input2: "3"},
				{operation: "less than", input1: "4"},
				{operation: "less than or equal to", input1: "5"},
				{operation: "greater than", input1: "6"},
				{operation: "greater than or equal to", input1: "7"}
			],
			iCondition = 0;

		Given.iEnsureMyFilteringApplicationHasStarted();

		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iExpandTheExcludePanel();

		When.iChangeTheFilterField("Number", true, 0, true);

		aConditions.forEach(function (oCondition) {
			When.iChangeTheCondition(oCondition.operation, true, iCondition)
				.and.iEnterTextInConditionField(
				true,
				iCondition,
				oCondition.input1,
				(oCondition.input2 ? oCondition.input2 : undefined)
			);

			When.iPressTheFilterAddButton(true);
			iCondition++;
		});

		When.iPressOkButton();

		// Assertions
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "Number",
							"sOperator": "NE",
							"oValue1": 1,
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Number",
							"sOperator": "NB",
							"oValue1": 2,
							"oValue2": 3,
							"_bMultiFilter": false
						},
						{
							"sPath": "Number",
							"sOperator": "GE",
							"oValue1": 4,
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Number",
							"sOperator": "GT",
							"oValue1": 5,
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Number",
							"sOperator": "LE",
							"oValue1": 6,
							"oValue2": null,
							"_bMultiFilter": false
						},
						{
							"sPath": "Number",
							"sOperator": "LT",
							"oValue1": 7,
							"oValue2": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				}
			]
		);

	});

	opaTest("Other exclude operations by type", function(Given, When, Then) {
		Given.iEnsureMyFilteringApplicationHasStarted();

		// Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iExpandTheExcludePanel();

		// Date
		When.iChangeTheFilterField("Date", true, 0, true);

		//Assertions
		Then.iShouldSeeConditionOperations([
			"equal to",
			"between",
			"before",
			"before or on",
			"after",
			"on or after"
		], 1);

		// Date Time Offset
		When.iChangeTheFilterField("Date Time Offset", true, 0, true);

		//Assertions
		Then.iShouldSeeConditionOperations([
			"equal to",
			"between",
			"before",
			"before or on",
			"after",
			"on or after"
		], 1);

		// Height
		When.iChangeTheFilterField("Height", true, 0, true);

		//Assertions
		Then.iShouldSeeConditionOperations([
			"equal to",
			"between",
			"less than",
			"less than or equal to",
			"greater than",
			"greater than or equal to"
		], 1);

		// My Boolean
		When.iChangeTheFilterField("My Boolean", true, 0, true);

		//Assertions
		Then.iShouldSeeConditionOperations([
			"equal to"
		], 1);

		// String date
		When.iChangeTheFilterField("String date", true, 0, true);

		//Assertions
		Then.iShouldSeeConditionOperations([
			"equal to",
			"between",
			"less than",
			"less than or equal to",
			"greater than",
			"greater than or equal to",
			"empty"
		], 1);

		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});

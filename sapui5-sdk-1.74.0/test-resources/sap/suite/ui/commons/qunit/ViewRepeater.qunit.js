/*global QUnit */
sap.ui.define([
    "sap/ui/qunit/QUnitUtils",
    "sap/ui/qunit/utils/createAndAppendDiv",
    "sap/ui/model/json/JSONModel",
    "sap/ui/commons/layout/MatrixLayout",
    "sap/ui/commons/layout/MatrixLayoutRow",
    "sap/ui/commons/Label",
    "sap/ui/commons/layout/MatrixLayoutCell",
    "sap/suite/ui/commons/ViewRepeater",
    "sap/suite/ui/commons/RepeaterViewConfiguration",
    "sap/ui/commons/layout/VerticalLayout",
    "sap/ui/commons/RowRepeaterFilter",
    "sap/ui/model/Filter",
    "sap/ui/commons/RowRepeaterSorter",
    "sap/ui/model/Sorter",
    "sap/ui/thirdparty/jquery"
], function(
    QUnitUtils,
	createAndAppendDiv,
	JSONModel,
	MatrixLayout,
	MatrixLayoutRow,
	Label,
	MatrixLayoutCell,
	ViewRepeater,
	RepeaterViewConfiguration,
	VerticalLayout,
	RowRepeaterFilter,
	Filter,
	RowRepeaterSorter,
	Sorter,
	jQuery
) {
    "use strict";
	createAndAppendDiv("uiArea1");


	var dataObject = { data : [
		{lastName: "Platte"},
		{lastName: "Dwyer"},
		{lastName: "Wallace"},
		{lastName: "Wang"}
	]};

	// create JSON model
	var oModel = new JSONModel();
	oModel.setData(dataObject);
	sap.ui.getCore().setModel(oModel);

	//create the first view
	var oRowTemplate1 = new MatrixLayout("theMatrix1");
	oRowTemplate1.addStyleClass("matrix");
	oRowTemplate1.setWidths(["50px","40px","110px"]);

	var  matrixRow, matrixCell, control;
	// main row
	matrixRow = new MatrixLayoutRow();
	control = new Label();
	control.bindProperty("text","lastName");
	matrixCell = new MatrixLayoutCell();
	matrixCell.addContent(control);
	matrixRow.addCell(matrixCell);
	oRowTemplate1.addRow(matrixRow);

	var oViewRepeaterRendered = new ViewRepeater("VRR", {height:"100px"});
	oViewRepeaterRendered.addView(new RepeaterViewConfiguration("viewRendered0", {
		responsive: true,
		itemHeight: 40,
		itemMinWidth: 250,
		numberOfTiles: 2,
		path: "/data",
		template: oRowTemplate1
	}));

	var vl = new VerticalLayout();
	vl.addContent(oViewRepeaterRendered);
	vl.setWidth("500px");
	vl.placeAt("uiArea1");

	QUnit.module("General Tests - sap.suite.ui.commons.ViewRepeater", {
		beforeEach: function() {
			this.oViewRepeater = new ViewRepeater("VR");
		},

		afterEach: function() {
			this.oViewRepeater.destroy();
		}
	});

	QUnit.test("ViewRepeater initial set up", function(assert) {
		assert.ok(this.oViewRepeater._oSegBtn, "Tab panel was created");
		assert.ok(this.oViewRepeater._oSearchField, "Search Field was created");
	});

	QUnit.test("setDefaultViewIndex", function(assert) {
		this.oViewRepeater.addView(new RepeaterViewConfiguration("view0"));
		this.oViewRepeater.addView(new RepeaterViewConfiguration("view1"));

		this.oViewRepeater.setDefaultViewIndex(1);
		assert.equal(this.oViewRepeater._oSegBtn.getSelectedButton(), "VR-view1-triggerBtn", "The second view is selected");
	});

	QUnit.test("addView", function(assert) {
		this.oViewRepeater.addView(new RepeaterViewConfiguration("view0"));

		assert.equal(this.oViewRepeater._oSegBtn.getButtons().length, 1, "Only one view");
		assert.equal(this.oViewRepeater._oSegBtn.getButtons()[0].getId(), "VR-view0-triggerBtn", "The id of the first view is correct");
	});

	QUnit.test("selectView", function(assert) {
		this.oViewRepeater.addView(new RepeaterViewConfiguration("view0", {
			responsive: true,
			itemMinWidth: 210,
			numberOfTiles: 12
		}));

		this.oViewRepeater.selectView(0);

		assert.equal(this.oViewRepeater.getResponsive(), true, "responsive property was set from the view");
		assert.equal(this.oViewRepeater.getItemMinWidth(), 210, "itemMinWidth property was set from the view");
		assert.equal(this.oViewRepeater.getNumberOfRows(), 12, "numberOfTiles property was set from the view");

		this.oViewRepeater.selectView(1);

		assert.equal(this.oViewRepeater.getResponsive(), true, "not existing view didn't change responsive property");
		assert.equal(this.oViewRepeater.getItemMinWidth(), 210, "not existing view didn't change itemMinWidth property");
		assert.equal(this.oViewRepeater.getNumberOfRows(), 12, "not existing view didn't change numberOfRows property");

		var notExistingViewConfiguration = new RepeaterViewConfiguration("view1", {
			responsive: false,
			itemMinWidth: 0,
			numberOfTiles: 0
		});
		this.oViewRepeater.selectView(notExistingViewConfiguration);

		assert.equal(this.oViewRepeater.getResponsive(), true, "not existing view didn't change responsive property");
		assert.equal(this.oViewRepeater.getItemMinWidth(), 210, "not existing view didn't change itemMinWidth property");
		assert.equal(this.oViewRepeater.getNumberOfRows(), 12, "not existing view didn't change numberOfRows property");
	});

	QUnit.test("_applyFilter", function(assert) {
		this.oViewRepeater.addFilter(new RowRepeaterFilter("second_filter", {filters:[new Filter("country","EQ", "DE")]}));

		this.oViewRepeater._applyFilter("second_filter", {filter: function(aFilters) {
			assert.equal(aFilters.length, 1, "One filter applied");
			assert.equal(aFilters[0].sPath, "country", "Correct filter was applied");
		}});
	});

	QUnit.test("_applySorter", function(assert) {
		this.oViewRepeater.addSorter(new RowRepeaterSorter("third_sorter", {sorter:new Sorter("country", true)}));

		this.oViewRepeater._applySorter("third_sorter", {sort: function(oSorter) {
			assert.equal(oSorter.sPath, "country", "Correct sorter was applied");
		}});
	});

	QUnit.module("Tests for rendered control - sap.suite.ui.commons.ViewRepeater");

	QUnit.test("_computeWidths", function(assert) {
		oViewRepeaterRendered._computeWidths(true);

		assert.equal(oViewRepeaterRendered._itemsPerRow, 2, "Correct number of items per row");
	});

	QUnit.test("startPagingAnimation", function(assert) {
		var done = assert.async();
		oViewRepeaterRendered.iPreviousPage = 1;
		oViewRepeaterRendered.setCurrentPage(2);

		oViewRepeaterRendered.startPagingAnimation();

		setTimeout(function() {
			assert.equal(jQuery(document.getElementById("VRR-page_1")).text(), "", "The first page is not displayed");
			assert.equal(jQuery(document.getElementById("VRR-page_2")).text(), "WallaceWang", "The second page data is displayed");
			done();
		}, 1500);

	});
});
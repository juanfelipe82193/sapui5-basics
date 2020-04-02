/* global QUnit */
sap.ui.define([
	"sap/ui/mdc/p13n/Util", "sap/ui/mdc/Table", "sap/ui/mdc/Chart", "sap/ui/model/json/JSONModel", "sap/base/util/merge"
], function (Util, Table, Chart, JSONModel, merge) {
	"use strict";
	var oBaseStateTable = {
		items: [
			{
				id: "IDName",
				name: "name",
				label: "Name",
				selected: true,
				position: 0
			},
			{
				id: "IDYear",
				name: "year",
				label: "Year",
				selected: true,
				position: 1
			},
			{
				id: undefined,
				name: "country",
				label: "Country",
				selected: false,
				position: 2
			},
			{
				id: undefined,
				name: "de",
				label: "DE",
				selected: false,
				position: 3
			}
		]
	};

	QUnit.module("p13n/Util API 'processResult' tests for Table (Selection)", {
		beforeEach: function () {
			//mock data --> usually the settings class provides this
			Util.sP13nType = "Columns";
			Util.oJSONModel = new JSONModel();
			Util.oControl = new Table();
			Util.oState = merge({}, oBaseStateTable);

		},
		afterEach: function () {
			Util.oState = merge({}, oBaseStateTable);
		}
	});
	//----------------------- Table ------------------------------
	QUnit.test("addColumn", function (assert) {
		//adding (selecting) a Column should result in one Change

		var done = assert.async();
		Util.oJSONModel.setData({
			items: [
				{
					id: "IDName",
					name: "name",
					label: "Name",
					selected: true,
					position: 0
				},
				{
					id: "IDYear",
					name: "year",
					label: "Year",
					selected: true,
					position: 1
				},
				{
					id: undefined,
					name: "country",
					label: "Country",
					selected: true,//set 'Country' to visible
					position: 2
				},
				{
					id: undefined,
					name: "de",
					label: "DE",
					selected: false,
					position: 3
				}
			]
		});


		Util.fnHandleChange = function (aChanges) {
			//add
			assert.strictEqual(aChanges.length, 1, "Correct amount of changes has been created");
			assert.strictEqual(aChanges[0].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.changeType, "addColumn", "Correct change type has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.name, "country", "Correct property has been added");
			done();
		};

		Util._registerChangeEvent();

	});


	QUnit.test("removeColumn", function (assert) {
		//removing (deselecting) a Column should result in one Change

		var done = assert.async();
		Util.oJSONModel.setData({
			items: [
				{
					id: "IDName",
					name: "name",
					label: "Name",
					selected: true,
					position: 0
				},
				{
					id: "IDYear",
					name: "year",
					label: "Year",
					selected: false,//set 'year' to invisible
					position: 1
				},
				{
					id: undefined,
					name: "country",
					label: "Country",
					selected: false,
					position: 2
				},
				{
					id: undefined,
					name: "de",
					label: "DE",
					selected: false,
					position: 3
				}
			]
		});

		Util.fnHandleChange = function (aChanges) {
			//remove
			assert.strictEqual(aChanges.length, 1, "Correct amount of changes has been created");
			assert.strictEqual(aChanges[0].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.changeType, "removeColumn", "Correct change type has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.name, "year", "Correct property has been removed");
			done();
		};

		Util._registerChangeEvent();
	});


	QUnit.test("move column", function (assert) {
		//moving a Column should result in two Changes: remove + add

		var done = assert.async();
		Util.oJSONModel.setData({
			items: [
				{
					id: "IDYear",
					name: "year",//swapped with name
					label: "Year",
					selected: true,
					position: 0
				},
				{
					id: "IDName",
					name: "name",
					label: "Name",
					selected: true,
					position: 1
				},
				{
					id: undefined,
					name: "country",
					label: "Country",
					selected: false,
					position: 2
				},
				{
					id: undefined,
					name: "de",
					label: "DE",
					selected: false,
					position: 3
				}
			]
		});

		Util.fnHandleChange = function (aChanges) {
			assert.strictEqual(aChanges.length, 1, "Correct amount of changes has been created");
			//moveColumn
			assert.strictEqual(aChanges[0].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.changeType, "moveColumn", "Correct change type has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.index, 0, "Correct property has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.name, "year", "Correct property has been set");

			done();
		};

		Util._registerChangeEvent();
	});

	var oBaseStateChart = {
		items: [
			{
				id: "IDName",
				name: "name",
				label: "Name",
				selected: true,
				position: 0,
				role: "dimension"
			},
			{
				id: "IDYear",
				name: "year",
				label: "Year",
				selected: true,
				position: 1,
				role: "dimension"
			},
			{
				id: undefined,
				name: "country",
				label: "Country",
				selected: false,
				position: 2,
				role: "measure"
			},
			{
				id: undefined,
				name: "de",
				label: "DE",
				selected: false,
				position: 3,
				role: "measure"
			}
		]
	};

	QUnit.module("p13n/Util API 'processResult' tests for Chart (Selection)", {
		beforeEach: function () {
			//mock data --> usually the settings class provides this
			Util.sP13nType = "Chart";
			Util.oJSONModel = new JSONModel();
			Util.oControl = new Chart();
			Util.oState = merge({}, oBaseStateChart);

		},
		afterEach: function () {
			Util.oState = merge({}, oBaseStateChart);
		}
	});

	QUnit.test("addChartItem", function (assert) {
		//adding (selecting) a ChartItem should result in one Change

		var done = assert.async();
		Util.oJSONModel.setData({
			items: [
				{
					id: "IDName",
					name: "name",
					label: "Name",
					selected: true,
					position: 0,
					role: "dimension"
				},
				{
					id: "IDYear",
					name: "year",
					label: "Year",
					selected: true,
					position: 1,
					role: "dimension"
				},
				{
					id: undefined,
					name: "country",
					label: "Country",
					selected: true,//set visible
					position: 2,
					role: "measure"
				},
				{
					id: undefined,
					name: "de",
					label: "DE",
					selected: false,
					position: 3,
					role: "measure"
				}
			]
		});

		Util.fnHandleChange = function (aChanges) {
			assert.strictEqual(aChanges.length, 1, "Correct amount of changes has been created");
			//add
			assert.strictEqual(aChanges[0].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.changeType, "addItem", "Correct change type has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.name, "country", "Correct property has been removed");
			done();
		};

		Util._registerChangeEvent();
	});

	QUnit.test("removeChartItem", function (assert) {
		//removing (deselecting) a ChartItem should result in one Change

		var done = assert.async();
		Util.oJSONModel.setData({
			items: [
				{
					id: "IDName",
					name: "name",
					label: "Name",
					selected: true,
					position: 0,
					role: "dimension"
				},
				{
					id: "IDYear",
					name: "year",
					label: "Year",
					selected: false,//set to invisible
					position: 1,
					role: "dimension"
				},
				{
					id: undefined,
					name: "country",
					label: "Country",
					selected: false,
					position: 2,
					role: "measure"
				},
				{
					id: undefined,
					name: "de",
					label: "DE",
					selected: false,
					position: 3,
					role: "measure"
				}
			]
		});

		Util.fnHandleChange = function (aChanges) {
			assert.strictEqual(aChanges.length, 1, "Correct amount of changes has been created");
			//remove
			assert.strictEqual(aChanges[0].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.changeType, "removeItem", "Correct change type has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.name, "year", "Correct property has been removed");
			done();
		};

		Util._registerChangeEvent();
	});

	QUnit.test("move item", function (assert) {
		//moving a ChartItem should result in two Changes: remove + add

		var done = assert.async();
		Util.oJSONModel.setData({
			items: [
				{
					id: "IDYear",
					name: "year",
					label: "Year",
					selected: true,
					position: 0,
					role: "dimension"
				},
				{
					id: "IDName",
					name: "name",
					label: "Name",
					selected: true,
					position: 1,
					role: "dimension"
				},
				{
					id: undefined,
					name: "country",
					label: "Country",
					selected: false,
					position: 2,
					role: "measure"
				},
				{
					id: undefined,
					name: "de",
					label: "DE",
					selected: false,
					position: 3,
					role: "measure"
				}
			]
		});

		Util.fnHandleChange = function (aChanges) {
			assert.strictEqual(aChanges.length, 1, "Correct amount of changes has been created");
			//moveItem
			assert.strictEqual(aChanges[0].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.changeType, "moveItem", "Correct change type has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.index, 0, "Correct property has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.name, "year", "Correct property has been set");
			done();
		};

		Util._registerChangeEvent();
	});


	QUnit.test("changeRole", function (assert) {
		//changing (change Select) the role of an existing chartItem should result in two changes: remove old sorter + add new sorter

		var done = assert.async();
		Util.oJSONModel.setData({
			items: [
				{
					id: "IDName",
					name: "name",
					label: "Name",
					selected: true,
					position: 0,
					role: "series"//change role
				},
				{
					id: "IDYear",
					name: "year",
					label: "Year",
					selected: true,
					position: 1,
					role: "dimension"
				},
				{
					id: undefined,
					name: "country",
					label: "Country",
					selected: false,
					position: 2,
					role: "measure"
				},
				{
					id: undefined,
					name: "de",
					label: "DE",
					selected: false,
					position: 3,
					role: "measure"
				}
			]
		});

		Util.fnHandleChange = function (aChanges) {
			assert.strictEqual(aChanges.length, 2, "Correct amount of changes has been created");
			//remove
			assert.strictEqual(aChanges[0].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.changeType, "removeItem", "Correct change type has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.name, "name", "Correct property has been removed");
			assert.strictEqual(aChanges[0].changeSpecificData.content.role, "dimension", "Correct role has been removed");

			//add
			assert.strictEqual(aChanges[1].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[1].changeSpecificData.changeType, "addItem", "Correct change type has been set");
			assert.strictEqual(aChanges[1].changeSpecificData.content.name, "name", "Correct property has been added");
			assert.strictEqual(aChanges[1].changeSpecificData.content.role, "series", "Correct role has been added");
			done();
		};

		Util._registerChangeEvent();

	});

	var oBaseStateSorting = {
		items: [
			{
				name: "name",
				label: "Name",
				selected: true,
				position: 0,
				sortOrder: ""
			},
			{
				name: "year",
				label: "Year",
				selected: true,
				position: 1,
				sortOrder: ""
			},
			{
				name: "country",
				label: "Country",
				selected: false,
				position: 2,
				sortOrder: ""
			},
			{
				name: "de",
				label: "DE",
				selected: false,
				position: 3,
				sortOrder: ""
			}
		]
	};

	//----------------------- Sorting ------------------------------
	QUnit.module("p13n/Util API 'processResult' tests for Sorting", {
		beforeEach: function () {
			//mock data --> usually the settings class provides this
			Util.sP13nType = "Sort";
			Util.oJSONModel = new JSONModel();
			Util.oControl = new Table();
			Util.oState = merge({}, oBaseStateSorting);

		},
		afterEach: function () {
			Util.oState = merge({}, oBaseStateSorting);
		}
	});

	QUnit.test("addSort", function (assert) {
		//adding (selecting) a Sorter --> one change

		var done = assert.async();
		Util.oJSONModel.setData({
			items: [
				{
					name: "name",
					label: "Name",
					selected: true,
					position: 0,
					sortOrder: ""
				},
				{
					name: "year",
					label: "Year",
					selected: true,
					position: 1,
					sortOrder: ""
				},
				{
					name: "country",
					label: "Country",
					selected: true,//set 'country' to visible
					position: 2,
					sortOrder: ""
				},
				{
					name: "de",
					label: "DE",
					selected: false,
					position: 3,
					sortOrder: ""
				}
			]
		});


		Util.fnHandleChange = function (aChanges) {
			//add
			assert.strictEqual(aChanges.length, 1, "Correct amount of changes has been created");
			assert.strictEqual(aChanges[0].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.changeType, "addSort", "Correct change type has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.name, "country", "Correct property has been added");
			done();
		};

		Util._registerChangeEvent();

	});


	QUnit.test("removeSort", function (assert) {
		//removing (deselecting) a Sorter --> once change

		var done = assert.async();
		Util.oJSONModel.setData({
			items: [
				{
					name: "name",
					label: "Name",
					selected: true,
					position: 0,
					sortOrder: ""
				},
				{
					name: "year",
					label: "Year",
					selected: false,//set 'Year' to invisible
					position: 1,
					sortOrder: ""
				},
				{
					name: "country",
					label: "Country",
					selected: false,
					position: 2,
					sortOrder: ""
				},
				{
					name: "de",
					label: "DE",
					selected: false,
					position: 3,
					sortOrder: ""
				}
			]
		});


		Util.fnHandleChange = function (aChanges) {
			//add
			assert.strictEqual(aChanges.length, 1, "Correct amount of changes has been created");
			assert.strictEqual(aChanges[0].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.changeType, "removeSort", "Correct change type has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.name, "year", "Correct property has been removed");
			done();
		};

		Util._registerChangeEvent();

	});

	QUnit.test("moveSort", function (assert) {
		//move Sorter --> one change (moveSort)

		var done = assert.async();
		Util.oJSONModel.setData({
			items: [
				{
					name: "year",
					label: "Year",
					selected: true,
					position: 0, //change position with 'Name'
					sortOrder: ""
				},
				{
					name: "name",
					label: "Name",
					selected: true,
					position: 1,
					sortOrder: ""
				},
				{
					name: "country",
					label: "Country",
					selected: false,
					position: 2,
					sortOrder: ""
				},
				{
					name: "de",
					label: "DE",
					selected: false,
					position: 3,
					sortOrder: ""
				}
			]
		});


		Util.fnHandleChange = function (aChanges) {
			//add
			assert.strictEqual(aChanges.length, 1, "Correct amount of changes has been created");
			assert.strictEqual(aChanges[0].selectorElement.sId, this.oControl.sId, "the correct selectorElement has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.changeType, "moveSort", "Correct change type has been set");
			assert.strictEqual(aChanges[0].changeSpecificData.content.name, "year", "Correct property has been removed");
			done();
		};

		Util._registerChangeEvent();

	});

	QUnit.module("p13n/Util API tests", {
		beforeEach: function () {
		},
		afterEach: function () {
			Util.oState = {};
		}
	});

	QUnit.test("showP13nColumns", function (assert) {
		var done = assert.async();
		var oControl = new Table();
		Util.oState = merge({}, oBaseStateTable);
		Util.oJSONModel = new JSONModel();
		Util.oJSONModel.setData(merge({}, oBaseStateTable));

		//trigger callback passed into showP13nXX above --> usually this gets triggered through events from BasePanel
		Util.showP13nColumns(oControl, oControl, oBaseStateTable, function () {
			//2) callback after changes have been applied
			assert.equal(Util.sP13nType, "Columns");
			oControl.destroy(); //panel needs to be destroyed manually in tests
			done();
		}).then(function (oSelectionPanel) {
			//1) callback from _showDialog --> execute _registerChangeEvent as mock for fireChange
			Util._registerChangeEvent();
		});

	});

	QUnit.test("check amount of columns ( + internal model limit)", function (assert) {
		var done = assert.async();
		var oControl = new Table();
		var oManyColumns = {};
		oManyColumns.items = [];
		var iDummyColumns = 250;
		for (var i = 0; i < iDummyColumns; i++) {
			oManyColumns.items.push({
				name: "column" + i,
				label: "Column Nr." + i,
				position: i
			});
		}

		//trigger callback passed into showP13nXX above --> usually this gets triggered through events from BasePanel
		Util.showP13nColumns(oControl, oControl, oManyColumns, function () {}).then(function (oPanel) {
			//1) callback from _showDialog --> check items on Panel
			assert.equal(oPanel._oMTable.getItems().length, iDummyColumns, "correct amount of items on panel");
			oControl.destroy();
			done();
		});

	});

	QUnit.test("showP13nChart", function (assert) {
		var done = assert.async();
		var oControl = new Chart();
		Util.oState = merge({}, oBaseStateChart);
		Util.oJSONModel = new JSONModel();
		Util.oJSONModel.setData(merge({}, oBaseStateChart));

		//trigger callback passed into showP13nXX above --> usually this gets triggered through events from BasePanel
		Util.showP13nChart(oControl, oControl, oBaseStateTable, function () {
			//2) callback after changes have been applied
			assert.equal(Util.sP13nType, "Chart");
			oControl.destroy(); //panel needs to be destroyed manually in tests
			done();
		}).then(function (oChartPanel) {
			//1) callback from _showDialog --> execute _registerChangeEvent as mock for fireChange
			Util._registerChangeEvent();
		});
	});

	QUnit.test("showP13nSort", function (assert) {
		var done = assert.async();
		var oControl = new Table();
		Util.oState = merge({}, oBaseStateSorting);
		Util.oJSONModel = new JSONModel();
		Util.oJSONModel.setData(merge({}, oBaseStateSorting));

		//trigger callback passed into showP13nXX above --> usually this gets triggered through events from BasePanel
		Util.showP13nSort(oControl, oControl, oBaseStateTable, function () {
			//2) callback after changes have been applied
			assert.equal(Util.sP13nType, "Sort");
			oControl.destroy(); //panel needs to be destroyed manually in tests
			done();
		}).then(function (oSortPanel) {
			//1) callback from _showDialog --> execute _registerChangeEvent as mock for fireChange
			Util._registerChangeEvent();
		});
	});
});

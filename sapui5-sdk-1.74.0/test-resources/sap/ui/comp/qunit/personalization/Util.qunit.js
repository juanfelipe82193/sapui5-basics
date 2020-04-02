/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	'sap/ui/comp/library',
	'sap/ui/comp/personalization/Util',
	'sap/ui/comp/personalization/ChartWrapper',
	'sap/ui/comp/personalization/ColumnWrapper',
	'sap/chart/library',
	'sap/chart/data/Dimension',
	'sap/chart/data/Measure',
	'sap/chart/Chart',
	'sap/ui/table/Table',
	'sap/ui/table/Column',
	'sap/m/Label',
	'sap/ui/model/json/JSONModel',
	'sap/m/Table',
	'sap/m/Column',
	'sap/m/ColumnListItem',
	'sap/ui/core/CustomData',
	'sap/ui/table/AnalyticalTable',
	'sap/ui/core/Control'

], function(compLibrary, Util, ChartWrapper, ColumnWrapper, chartLibrary, Dimension, Measure, Chart, UiTable, UiColumn, Label, JSONModel,
		MTable, MColumn, ColumnListItem, CustomData, AnalyticalTable, Control) {
	'use strict';

	if (window.blanket) {
		//window.blanket.options("sap-ui-cover-only", "sap/ui/comp");
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	var createTable = function(sTableType, oData) {
		oData = oData || {
			items: [
				{
					"date": "2/5/1982",
					"number": 103,
					"city": "McDermotttown",
					"country": "Svalbard and Jan Mayen",
					"name": "Mary"
				}
			],
			columns: [
				{
					id: "name",
					text: "Name",
					path: "name",
					aggregationRole: "dimension"
				}, {
					id: "country",
					text: "Country",
					path: "country"
				}, {
					id: "number",
					text: "Number",
					path: "number",
					aggregationRole: "measure"
				}, {
					id: "city",
					text: "City",
					path: "city",
					aggregationRole: "dimension"
				}, {
					id: "date",
					text: "Date",
					path: "date",
					aggregationRole: "measure"
				}
			]
		};
		var oTable = null;
		if (sTableType === "UITable") {
			oTable = new UiTable('testUITable', {
				columns: oData.columns.map(function(oModelColumn) {
					return new UiColumn(oModelColumn.id, {
						label: new Label({
							text: oModelColumn.text
						}),
						template: new Label({
							text: {
								path: oModelColumn.path
							}
						})
					});
				})
			});
			oTable.setModel(new JSONModel());
			oTable.bindRows("/items");
		} else if (sTableType === "MTable") {
			oTable = new MTable("testMTable", {
				columns: oData.columns.map(function(oModelColumn) {
					return new MColumn(oModelColumn.id, {
						header: new Label({
							text: oModelColumn.text
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: oModelColumn.path
							}
						})
					});
				})
			});
			oTable.setModel(new JSONModel());
			oTable.bindAggregation("items", "/items", new ColumnListItem({
				cells: oData.columns.map(function(oModelColumn) {
					return new Label({
						text: oModelColumn.text
					});
				})
			}));
		} else if (sTableType === "Chart") {
			var oChart = new Chart("testChart", {
				width: '100%',
				isAnalytical: true,
				uiConfig: {
					applicationSet: 'fiori'
				},
				chartType: chartLibrary.ChartType.Column,
				selectionMode: chartLibrary.SelectionMode.Single,
				visibleDimensions: [
					"name", "city"
				],
				visibleMeasures: [
					"number", "date"
				],
				dimensions: oData.columns.filter(function(oModelColumn) {
					return oModelColumn.aggregationRole === "dimension";
				}).map(function(oModelColumn) {
					var oColumn = new Dimension({
						label: oModelColumn.text,
						name: oModelColumn.path
					});
					oColumn.data("p13nData", {
						columnKey: oModelColumn.path
					});
					return oColumn;
				}),
				measures: oData.columns.filter(function(oModelColumn) {
					return oModelColumn.aggregationRole === "measure";
				}).map(function(oModelColumn) {
					var oColumn = new Measure({
						label: oModelColumn.text,
						name: oModelColumn.path
					});
					oColumn.data("p13nData", {
						columnKey: oModelColumn.path
					});
					return oColumn;
				})
			});
			var aNotDimeasure = oData.columns.filter(function(oModelColumn) {
				return oModelColumn.aggregationRole !== "dimension" && oModelColumn.aggregationRole !== "measure";
			}).map(function(oModelColumn) {
				return {
					columnKey: oModelColumn.path,
					leadingProperty: oModelColumn.path,
					sortProperty: true,
					filterProperty: true,
					label: oModelColumn.text,
					tooltip: oModelColumn.text
				};
			});
			oChart.setModel(new JSONModel());
			oTable = ChartWrapper.createChartWrapper(oChart, aNotDimeasure, [
				"name", "country", "number", "city", "date"
			]);
		}
		return oTable;
	};

	QUnit.module("API", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("isSortable", function(assert) {
		// system under test

		// arrange
		var oColumn1 = new UiColumn({
			sortProperty: "name"
		});
		var oColumn2 = new UiColumn({
			sortProperty: ""
		});
		oColumn2.data("p13nData", {
			columnKey: "name",
			sortProperty: "name"
		});
		var oColumn3 = new UiColumn({
			sortProperty: "name"
		});
		oColumn3.data("p13nData", {
			columnKey: "name",
			sortProperty: ""
		});
		var oMColumn1 = new MColumn();
		var oMColumn2 = new MColumn();
		oMColumn2.data("p13nData", {
			columnKey: "name",
			sortProperty: "name"
		});
		var oMColumn3 = new MColumn();
		oMColumn3.data("p13nData", {
			columnKey: "name",
			sortProperty: undefined
		});
		var oMColumn4 = new MColumn();
		oMColumn4.data("p13nData", {
			columnKey: "name"
		});
		var oCColumn5 = new ColumnWrapper();
		oCColumn5.data("p13nData", {
			columnKey: "name",
			sortProperty: "name"
		});
		var oCColumn6 = new ColumnWrapper();
		oCColumn6.data("p13nData", {
			columnKey: "name",
			sortProperty: ""
		});

		// act

		// assertions
		assert.ok(Util.isSortable(oColumn1), "only via property");
		assert.ok(!Util.isSortable(oColumn2), "via p13nData and Property");
		assert.ok(Util.isSortable(oColumn3), "via p13nData and Property");
		assert.ok(!Util.isSortable(oMColumn1));
		assert.ok(Util.isSortable(oMColumn2));
		assert.ok(!Util.isSortable(oMColumn3));
		assert.ok(!Util.isSortable(oMColumn4));
		assert.ok(Util.isSortable(oCColumn5));
		assert.ok(!Util.isSortable(oCColumn6));

		// cleanup
		oColumn1.destroy();
		oColumn2.destroy();
		oColumn3.destroy();
		oMColumn1.destroy();
		oMColumn2.destroy();
		oMColumn3.destroy();
		oMColumn4.destroy();
		oCColumn5.destroy();
		oCColumn6.destroy();
	});

	QUnit.test("isFilterable", function(assert) {
		// system under test

		// arrange
		var oColumn = new UiColumn({
			filterProperty: "name"
		});
		var oMColumn1 = new MColumn();
		var oMColumn2 = new MColumn();
		oMColumn2.data("p13nData", {
			columnKey: "name",
			filterProperty: "name"
		});
		var oCColumn3 = new ColumnWrapper();
		var oCColumn4 = new ColumnWrapper();
		oCColumn4.data("p13nData", {
			columnKey: "name",
			filterProperty: "name"
		});

		// act

		// assertions
		assert.ok(Util.isFilterable(oColumn));
		assert.ok(!Util.isFilterable(oMColumn1));
		assert.ok(Util.isFilterable(oMColumn2));
		assert.ok(!Util.isFilterable(oCColumn3));
		assert.ok(Util.isFilterable(oCColumn4));

		// cleanup
		oColumn.destroy();
		oMColumn1.destroy();
		oMColumn2.destroy();
		oCColumn3.destroy();
		oCColumn4.destroy();
	});

	QUnit.test("isFilterable (via p13nData and Property) - false", function(assert) {
		// system under test
		var oColumn = new UiColumn({
			filterProperty: "",
			label: new Label({
				text: "test"
			})
		});
		// arrange
		oColumn.data("p13nData", {
			columnKey: "key1",
			filterProperty: "foo"
		});
		// assertions
		assert.strictEqual(Util.isFilterable(oColumn), false);
		// cleanup
		oColumn.destroy();
	});
	QUnit.test("isFilterable (via p13nData and Property) - true", function(assert) {
		// system under test
		var oColumn = new UiColumn({
			filterProperty: "name",
			label: new Label({
				text: "name"
			})
		});
		oColumn.data("p13nData", {
			columnKey: "key1",
			filterProperty: ""
		});
		// assertions
		assert.strictEqual(Util.isFilterable(oColumn), true);
		// cleanup
		oColumn.destroy();
	});
	QUnit.test("isFilterable (via p13nData) - false", function(assert) {
		// system under test
		var oColumn = new MColumn({
			header: new Label({
				text: "test"
			})
		});
		// arrange
		oColumn.data("p13nData", {
			columnKey: "key1",
			filterProperty: undefined
		});
		// assertions
		assert.strictEqual(Util.isFilterable(oColumn), false);
		// cleanup
		oColumn.destroy();
	});
	QUnit.test("isFilterable (via p13nData) - not defined attribute", function(assert) {
		// system under test
		var oColumn = new MColumn({
			header: new Label({
				text: "test"
			})
		});
		// arrange
		oColumn.data("p13nData", {
			columnKey: "key1"
		});
		// assertions
		assert.strictEqual(Util.isFilterable(oColumn), false);
		// cleanup
		oColumn.destroy();
	});

	QUnit.test("getColumnKey - columnKey exists", function(assert) {
		// system under test
		var oColumn = new UiColumn({
			label: new Label({
				text: "name"
			})
		});
		oColumn.data("p13nData", {
			columnKey: "key1"
		});

		// assertions
		assert.strictEqual(Util.getColumnKey(oColumn), "key1");

		// cleanup
		oColumn.destroy();
	});

	QUnit.test("getColumnKey - columnKey does not exist", function(assert) {
		// system under test
		var oColumn = new UiColumn("columnId", {
			label: new Label({
				text: "name"
			})
		});

		// assertions
		assert.strictEqual(Util.getColumnKey(oColumn), "columnId");

		// cleanup
		oColumn.destroy();
	});

	QUnit.test("getColumnKey - columnKey does not exist II", function(assert) {
		// system under test
		var oColumn = new UiColumn("columnId", {
			label: new Label({
				text: "name"
			})
		});
		oColumn.data("p13nData", {
			filter: "filter"
		});
		// assertions
		assert.strictEqual(Util.getColumnKey(oColumn), "columnId");

		// cleanup
		oColumn.destroy();
	});

	QUnit.test("getArrayElementByKey", function(assert) {
		// system under test

		// assertions
		assert.strictEqual(Util.getArrayElementByKey("", "", []), null);
		assert.strictEqual(Util.getArrayElementByKey(), null);
		assert.strictEqual(Util.getArrayElementByKey("", "", null), null);
		assert.deepEqual(Util.getArrayElementByKey("first", "a", [
			{
				first: "a",
				second: false,
				third: 1
			}, {
				first: "b",
				second: true,
				third: 1
			}
		]), {
			first: "a",
			second: false,
			third: 1
		});
		assert.deepEqual(Util.getArrayElementByKey("dummy", "a", [
			{
				first: "a",
				second: false,
				third: 1
			}
		]), null);
		assert.deepEqual(Util.getArrayElementByKey("dummy", undefined, [
			{
				first: "a",
				second: false,
				third: 1
			}
		]), null);
		assert.deepEqual(Util.getArrayElementByKey("dummy", "a", [
			{
				first: "a",
				second: false,
				third: 1
			}
		]), null);
		assert.deepEqual(Util.getArrayElementByKey("second", true, [
			{
				first: "a",
				second: true,
				third: 1
			}
		]), {
			first: "a",
			second: true,
			third: 1
		});
		assert.deepEqual(Util.getArrayElementByKey("second", true, [
			{
				first: "a",
				second: false,
				third: 1
			}
		]), null);

		// cleanup
	});
	QUnit.test("sort", function(assert) {
		// system under test

		// assertions
		var aArray = [
			{
				columnKey: "a",
				index: 2
			}, {
				columnKey: "b",
				index: 3
			}
		];
		var aResult = Util.sort("columnKey", aArray);
		assert.deepEqual(aResult, aArray);
		assert.deepEqual(aResult, [
			{
				columnKey: "a",
				index: 2
			}, {
				columnKey: "b",
				index: 3
			}
		]);

		aArray = [
			{
				columnKey: "b",
				index: 3
			}, {
				columnKey: "a",
				index: 2
			}
		];
		aResult = Util.sort("columnKey", aArray);
		assert.notEqual(aResult, aArray);
		assert.deepEqual(aResult, [
			{
				columnKey: "a",
				index: 2
			}, {
				columnKey: "b",
				index: 3
			}
		]);

		// cleanup
		aArray = null;
	});
	QUnit.test("_getCustomData", function(assert) {
		// system under test
		var oColumn = new UiColumn({
			label: new Label({
				text: "name"
			})
		});
		// Workaround: call oColumn.data(); failed because expression "{" ... "}" is recognized as binding information in BindingParser.simpleParser
		var oDataObject = new CustomData({
			key: "p13nData"
		});
		oDataObject.setValue('\{"columnKey":"name"}');
		oColumn.addAggregation("customData", oDataObject, true);
		// End of Workaround

		// arrange
		var oCustomData = Util._getCustomData(oColumn);

		// assertions
		assert.deepEqual(oCustomData.columnKey, "name");

		// cleanup
		oDataObject.destroy();
		oColumn.destroy();
		oCustomData = null;
	});

	QUnit.test("getUnionOfAttribute: 1. positive", function(assert) {
		// system under test

		// arrange
		var aUnion = Util.getUnionOfAttribute({
			sort: {
				set: [
					"a", "b"
				]
			},
			filter: {
				set: [
					"b", "c"
				]
			},
			group: {
				set: [
					"a", "b", "c"
				]
			}
		}, "set");

		// assertions
		assert.deepEqual(aUnion, [
			"a", "b", "c"
		]);
	});

	QUnit.test("getUnionOfAttribute: 2. positive", function(assert) {
		// system under test

		// arrange
		var aUnion = Util.getUnionOfAttribute({
			sort: {
				set: [
					"b", "a"
				]
			},
			filter: {
				set: [
					"c", "b"
				]
			},
			group: {
				set: [
					"d"
				]
			}
		}, "set");

		// assertions
		assert.deepEqual(aUnion, [
			"b", "a", "c", "d"
		]);

		// cleanup
	});

	QUnit.test("getUnionOfAttribute: 1. negative", function(assert) {
		// system under test

		// arrange
		var aUnion = Util.getUnionOfAttribute({
			sort: {
				set: []
			},
			filter: {
				set: [
					"a"
				]
			},
			group: {
				dummy: [
					"d"
				]
			}
		}, "set");

		// assertions
		assert.deepEqual(aUnion, [
			"a"
		]);

		// cleanup
	});

	QUnit.test("createArrayFromString", function(assert) {
		// system under test

		// arrange

		// assertions
		assert.deepEqual(Util.createArrayFromString(",a,b ,c, d ,e   ,"), [
			"a", "b", "c", "d", "e"
		]);
		assert.deepEqual(Util.createArrayFromString(""), []);
		assert.deepEqual(Util.createArrayFromString("a"), [
			"a"
		]);
		assert.deepEqual(Util.createArrayFromString("a;b"), [
			"a;b"
		]);
		assert.deepEqual(Util.createArrayFromString(null), []);
		// cleanup
	});

	QUnit.test("getUnionOfColumnKeys", function(assert) {
		// assert
		assert.deepEqual(Util.getUnionOfColumnKeys({
			columns: {
				columnsItems: [
					{
						columnKey: "a"
					}
				]
			},
			sort: {
				sortItems: [
					{
						columnKey: "a"
					}, {
						columnKey: "b"
					}
				]
			}
		}), [
			"a", "b"
		]);
		assert.deepEqual(Util.getUnionOfColumnKeys({
			columns: {
				columnsItems: []
			},
			sort: {
				sortItems: [
					{
						columnKey: "a"
					}, {
						columnKey: "b"
					}
				]
			},
			filter: {
				filterItems: [
					{
						columnKey: "a"
					}, {
						columnKey: "c"
					}, {
						columnKey: "a"
					}
				]
			}
		}), [
			"a", "b", "c"
		]);

		// cleanup
	});

	QUnit.test("createChartWrapper", function(assert) {
		// system under test

		// arrange

		// act
		var oTable = createTable("Chart");
		var oChart = oTable.getChartObject();

		// assertions
		assert.ok(true);

		// cleanup
		oTable.destroy();
		oChart.destroy();
	});

	QUnit.test("sortItemsByText", function(assert) {
		// system under test

		// arrange
		var aItems = [
			{
				columnKey: "name",
				text: "BCD"
			}, {
				columnKey: "city",
				text: "ABC"
			}
		];

		// act
		Util.sortItemsByText(aItems, "text");

		// assertions
		assert.deepEqual(aItems, [
			{
				columnKey: "city",
				text: "ABC"
			}, {
				columnKey: "name",
				text: "BCD"
			}
		]);

		// cleanup
	});

	QUnit.test("removeEmptyProperty", function(assert) {
		// system under test

		// arrange
		var oObject = {
			one: null,
			two: [],
			three: undefined,
			four: 3
		};

		// act
		Util.removeEmptyProperty(oObject);

		// assertions
		assert.deepEqual(oObject, {
			two: [],
			four: 3
		});

		// cleanup
	});

	QUnit.test("semanticEqual", function(assert) {
		// system under test

		// arrange
		var oItemA = {
			one: null,
			two: 2,
			three: undefined,
			four: true,
			five: "5",
			six: "Sun May 01 2016"
		};

		var oItemB = {
			five: "5",
			three: undefined,
			six: "Sun May 01 2016",
			two: 2,
			one: null,
			four: true
		};

		// act

		// assertions
		assert.ok(!Util.semanticEqual(null, null));
		assert.ok(!Util.semanticEqual(oItemA, null));
		assert.ok(!Util.semanticEqual(null, oItemB));
		assert.ok(Util.semanticEqual(oItemA, oItemB));

		// cleanup
	});

	QUnit.test("hasChangedType", function(assert) {
		// system under test

		// arrange

		// act

		// assertions
		assert.ok(Util.hasChangedType({
			one: compLibrary.personalization.ChangeType.ModelChanged,
			two: compLibrary.personalization.ChangeType.Unchanged
		}));
		assert.ok(!Util.hasChangedType({
			one: compLibrary.personalization.ChangeType.Unchanged,
			two: compLibrary.personalization.ChangeType.Unchanged
		}));

		// cleanup
	});

	QUnit.test("isNamespaceChanged", function(assert) {
		// system under test

		// arrange

		// act

		// assertions
		assert.ok(Util.isNamespaceChanged({
			one: compLibrary.personalization.ChangeType.ModelChanged,
			two: compLibrary.personalization.ChangeType.Unchanged
		}, "one"));
		assert.ok(!Util.isNamespaceChanged({
			one: compLibrary.personalization.ChangeType.Unchanged,
			two: compLibrary.personalization.ChangeType.Unchanged
		}, "two"));

		// cleanup
	});

	QUnit.test("getIndexByKey", function(assert) {
		// system under test

		// arrange

		// act

		// assertions
		assert.equal(Util.getIndexByKey("columnKey", "name", [
			{
				columnKey: "name",
				operation: "BT",
				value1: "true",
				value2: "false"
			}, {
				columnKey: "city",
				operation: "BT",
				value1: "true",
				value2: "false"
			}
		]), 0);

		// cleanup
	});

	QUnit.test("getTableType", function(assert) {
		// system under test

		// arrange

		// act

		// assertions
		assert.equal(Util.getTableType(), null);
		assert.equal(Util.getTableType(new Control()), null);
		assert.equal(Util.getTableType(new UiTable()), compLibrary.personalization.TableType.Table);
		assert.equal(Util.getTableType(new AnalyticalTable()), compLibrary.personalization.TableType.AnalyticalTable);
		assert.equal(Util.getTableType(new MTable()), compLibrary.personalization.TableType.ResponsiveTable);
		assert.equal(Util.getTableType(new ChartWrapper()), compLibrary.personalization.TableType.ChartWrapper);

		// cleanup
	});

	QUnit.test("getTableBaseType", function(assert) {
		// system under test

		// arrange

		// act

		// assertions
		assert.equal(Util.getTableBaseType(), null);
		assert.equal(Util.getTableBaseType(new Control()), null);
		assert.equal(Util.getTableBaseType(new UiTable()), compLibrary.personalization.TableType.Table);
		assert.equal(Util.getTableBaseType(new AnalyticalTable()), compLibrary.personalization.TableType.Table);
		assert.equal(Util.getTableBaseType(new MTable()), compLibrary.personalization.TableType.ResponsiveTable);
		assert.equal(Util.getTableBaseType(new ChartWrapper()), compLibrary.personalization.TableType.ChartWrapper);

		// cleanup
	});

	QUnit.start();

});

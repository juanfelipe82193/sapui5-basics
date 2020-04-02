/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.require([
	'sap/ui/comp/personalization/Controller',
	'sap/ui/comp/personalization/BaseController',
	'sap/ui/comp/personalization/ColumnsController',
	'sap/m/library',
	'sap/m/Column',
	'sap/ui/model/json/JSONModel',
	'sap/ui/table/Table',
	'sap/ui/table/Column',
	'sap/ui/core/CustomData',
	'sap/m/Label',
	'sap/ui/table/AnalyticalTable',
	'sap/ui/table/AnalyticalColumn',
	"sap/ui/qunit/QUnitUtils"

], function(
	Controller,
	BaseController,
	ColumnsController,
	mLibrary,
	MColumn,
	JSONModel,
	Table,
	UiColumn,
	CustomData,
	Label,
	AnalyticalTable,
	AnalyticalColumn,
	QUnitUtils
) {
	'use strict';

	QUnit.module("sap.ui.comp.personalization.ColumnsController: default", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});
	QUnit.test("constructor", function(assert) {
		var oColumnsController = new ColumnsController();
		assert.strictEqual(oColumnsController.getType(), mLibrary.P13nPanelType.columns);
		assert.strictEqual(oColumnsController.getModel(), undefined);
		assert.deepEqual(oColumnsController.getIgnoreColumnKeys(), []);
		assert.deepEqual(oColumnsController.getAdditionalIgnoreColumnKeys(), []);
		assert.strictEqual(oColumnsController.getColumnHelper(), null);
		assert.deepEqual(oColumnsController.getColumnKeys(), []);
		oColumnsController.destroy();
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: determineMissingColumnKeys", {
		beforeEach: function() {
			this.oJson = {
				columns: {
					columnsItems: [
						{
							columnKey: "A",
							visible: false
						}, {
							columnKey: "B",
							width: "200px"
						}, {
							columnKey: "D",
							total: true
						}
					]
				},
				sort: {
					sortItems: [
						{
							columnKey: "B",
							operation: "acsending"
						}, {
							columnKey: "C"
						}
					]
				}
			};
			this.oStub = sinon.stub(BaseController.prototype, "getColumnMap");
		},
		afterEach: function() {
			this.oColumnsController.destroy();
			this.oStub.restore();
		}
	});
	QUnit.test("default", function(assert) {
		// Soll:    [A, B, D] - [] (oJson - oIgnoreData)
		// Ist:     [B, C]         (ColumnKey2ColumnMap)
		// Missing: [A, D]
		this.oStub.returns({
			B: new MColumn(),
			C: new MColumn()
		});
		this.oColumnsController = new ColumnsController();
		this.oColumnsController.initializeInternalModel(new JSONModel());

		// act and assert
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys({}), {
			columns: {
				columnsItems: []
			}
		});
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(null), {
			columns: {
				columnsItems: []
			}
		});
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(), {
			columns: {
				columnsItems: []
			}
		});
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(this.oJson), {
			columns: {
				columnsItems: [
					{
						columnKey: "A"
					}, {
						columnKey: "D"
					}
				]
			}
		});
	});
	QUnit.test("with 'ignoreColumnKeys'", function(assert) {
		// Soll:    [A, B, D] - [B] (oJson - oIgnoreData)
		// Ist:     [B, C]          (ColumnKey2ColumnMap)
		// Missing: [A, D]
		this.oStub.returns({
			B: new MColumn(),
			C: new MColumn()
		});
		this.oColumnsController = new ColumnsController({
			ignoreColumnKeys: [
				"B"
			]
		});
		this.oColumnsController.initializeInternalModel(new JSONModel());
		this.oColumnsController.calculateIgnoreData();

		// act and assert
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(this.oJson), {
			columns: {
				columnsItems: [
					{
						columnKey: "A"
					}, {
						columnKey: "D"
					}
				]
			}
		});
	});
	QUnit.test("with 'ignoreColumnKeys'", function(assert) {
		// Soll:    [A, B, D] - [A] (oJson - oIgnoreData)
		// Ist:     [B, C]          (ColumnKey2ColumnMap)
		// Missing: [D]
		this.oStub.returns({
			B: new MColumn(),
			C: new MColumn()
		});
		this.oColumnsController = new ColumnsController({
			ignoreColumnKeys: [
				"A"
			]
		});
		this.oColumnsController.initializeInternalModel(new JSONModel());
		this.oColumnsController.calculateIgnoreData();

		// act and assert
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(this.oJson), {
			columns: {
				columnsItems: [
					{
						columnKey: "D"
					}
				]
			}
		});
	});
	QUnit.test("with 'ignoreColumnKeys' and 'additionalIgnoreColumnKeys'", function(assert) {
		// Soll:    [A, B, D] - [A, B] (oJson - oIgnoreData)
		// Ist:     [B, C]             (ColumnKey2ColumnMap)
		// Missing: [D]
		this.oStub.returns({
			B: new MColumn(),
			C: new MColumn()
		});
		this.oColumnsController = new ColumnsController({
			ignoreColumnKeys: [
				"A"
			],
			additionalIgnoreColumnKeys: [
				"B"
			]
		});
		this.oColumnsController.initializeInternalModel(new JSONModel());
		this.oColumnsController.calculateIgnoreData();

		// act and assert
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(this.oJson), {
			columns: {
				columnsItems: [
					{
						columnKey: "D"
					}
				]
			}
		});
	});
	QUnit.test("with 'ignoreColumnKeys' and 'additionalIgnoreColumnKeys'", function(assert) {
		// Soll:    [A, B, D] - [A, B] (oJson - oIgnoreData)
		// Ist:     [B, C, D]             (ColumnKey2ColumnMap)
		// Missing: []
		this.oStub.returns({
			B: new MColumn(),
			C: new MColumn(),
			D: new MColumn()
		});
		this.oColumnsController = new ColumnsController({
			ignoreColumnKeys: [
				"A"
			],
			additionalIgnoreColumnKeys: [
				"B"
			]
		});
		this.oColumnsController.initializeInternalModel(new JSONModel());
		this.oColumnsController.calculateIgnoreData();

		// act and assert
		assert.deepEqual(this.oColumnsController.determineMissingColumnKeys(this.oJson), {
			columns: {
				columnsItems: []
			}
		});
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: _requestMissingColumnsWithoutIgnore", {

		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	QUnit.test("with UITable and ignoreColumnKey", function(assert) {
		var fTest01 = function(assert, oColumnsController, oController) {
			var fnFireRequestColumnsSpy = sinon.spy(oController, "fireRequestColumns");

			// assert before act
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"].length, 1);
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][0].columnKey, "a");
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][0].index, 0);

			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"].length, 1);
			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"][0].columnKey, "a");
			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"][0].index, 0);

			// act
			oController._extendModelStructure(oController._requestMissingColumnsWithoutIgnore({
				columns: {
					columnsItems: [
						{
							columnKey: "c"
						}, {
							columnKey: "i"
						}
					]
				}
			}));

			// assert
			assert.ok(fnFireRequestColumnsSpy.calledOnce);
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"].length, 2);
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][0].columnKey, "a");
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][0].index, 0);
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][1].columnKey, "c");
			assert.equal(oColumnsController.getControlDataBase()["columns"]["columnsItems"][1].index, 2);

			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"].length, 1);
			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"][0].columnKey, "a");
			assert.equal(oColumnsController.getControlData()["columns"]["columnsItems"][0].index, 0);
		};
		this.oController = new Controller({
			table: this.oTable = new Table({
				columns: [
					new UiColumn({
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "row1"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					})
				]
			}),
			columnKeys: [
				"a", "i", "c"
			],
			setting: {
				sort: {
					visible: false
				},
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"i"
					]
				},
				group: {
					visible: false
				},
				filter: {
					visible: false
				}
			},
			requestColumns: function(oEvent) {
				// assert
				assert.deepEqual(oEvent.getParameter("columnKeys"), [
					"c"
				]);
				this.oController.addColumns({
					c: new UiColumn({
						label: new Label({
							text: "C"
						}),
						template: new Label({
							text: "row3"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'c'
							}
						})
					})
				});
			}.bind(this)
		});
		fTest01(assert, this.oController._oSettingCurrent.columns.controller, this.oController);
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: getUnionData", {
		beforeEach: function() {
			this.oController = new ColumnsController();
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});

	QUnit.test("tests", function(assert) {
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: []
			}
		}, {
			columns: {
				columnsItems: []
			}
		}), {
			columns: {
				columnsItems: []
			}
		});
		//				assert.deepEqual(this.oController.getUnionData(
		//						{columns: {columnsItems: [{columnKey: "name", index: 0}]}},
		//						{columns: {columnsItems: []}}),
		//						{columns: {columnsItems: []}});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			sort: {
				sortItems: [
					{
						columnKey: "name",
						operation: "Ascending"
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "country",
						index: 1
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "country",
						index: 1
					}, {
						columnKey: "name",
						index: 0
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}, {
						columnKey: "country",
						index: 1
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}, {
						columnKey: "country",
						index: 1
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}, {
						columnKey: "country",
						index: 1
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 1
					}, {
						columnKey: "country",
						index: 1
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						width: ""
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0,
						width: ""
					}
				]
			}
		});
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0,
						width: ""
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						width: "100px"
					}
				]
			}
		}), {
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0,
						width: "100px"
					}
				]
			}
		});
		// update controlDataBase from controlData: controlDataBase and controlData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, {
			columns: {
				fixedColumnCount: 1,
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}), {
			columns: {
				fixedColumnCount: 1,
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}
				]
			}
		}, "'fixedColumnCount' is set via direct manipulation on the table");
		// controlDataInitial and variantData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				fixedColumnCount: 1,
				columnsItems: [
					{
						columnKey: "name",
						index: 0
					}, {
						columnKey: "price",
						visible: true
					}
				]
			}
		}, {
			columns: {
				columnsItems: [
					{
						columnKey: "price",
						visible: true
					}
				]
			}
		}), {
			columns: {
				fixedColumnCount: 1,
				columnsItems: [
					{
						columnKey: "price",
						visible: true
					}, {
						columnKey: "name",
						index: 0
					}
				]
			}
		}, "'old' variant without 'fixedColumnCount'");
		//				 controlDataInitial and variantData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: []
			}
		}, {
			columns: {
				fixedColumnCount: 1,
				columnsItems: []
			}
		}), {
			columns: {
				fixedColumnCount: 1,
				columnsItems: []
			}
		}, "'new' variant with 'fixedColumnCount'");
		// controlDataInitial and variantData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				fixedColumnCount: 1,
				columnsItems: []
			}
		}, {
			columns: {
				fixedColumnCount: 2,
				columnsItems: []
			}
		}), {
			columns: {
				fixedColumnCount: 2,
				columnsItems: []
			}
		}, "'new' variant with 'fixedColumnCount'");
		// controlDataInitial and variantData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				fixedColumnCount: undefined,
				columnsItems: []
			}
		}, {
			columns: {
				columnsItems: []
			}
		}), {
			columns: {
				columnsItems: []
			}
		});
		// controlDataInitial and variantData
		assert.deepEqual(this.oController.getUnionData({
			columns: {
				columnsItems: []
			}
		}, {
			columns: {
				fixedColumnCount: undefined,
				columnsItems: []
			}
		}), {
			columns: {
				columnsItems: []
			}
		});
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: fixConflictWithIgnore", {
		beforeEach: function() {
			this.oController = new ColumnsController();
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});
	QUnit.test("tests without move", function(assert) {
		var oJsonIgnore = {
			columns: {
				columnsItems: [
					{
						columnKey: "i"
					}
				]
			}
		};
		var oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "b",
						index: 1
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "b",
						index: 1
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i"
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i"
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: undefined
					}, {
						columnKey: "i",
						index: 0
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "i",
						index: 0
					}, {
						columnKey: "a",
						index: undefined
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 0
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}
				]
			}
		});
	});

	QUnit.test("tests with move", function(assert) {
		var oJsonIgnore = {
			columns: {
				columnsItems: [
					{
						columnKey: "i"
					}, {
						columnKey: "j"
					}
				]
			}
		};
		var oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "i",
						index: 0
					}, {
						columnKey: "a",
						index: 0
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "j",
						index: 1
					}, {
						columnKey: "a",
						index: 0
					}, {
						columnKey: "b",
						index: 1
					}, {
						columnKey: "i",
						index: 0
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}, {
						columnKey: "b",
						index: 2
					}, {
						columnKey: "j",
						index: 3
					}
				]
			}
		});

		oJson = {
			columns: {
				columnsItems: [
					{
						columnKey: "j",
						index: 1
					}, {
						columnKey: "a",
						index: 0
					}, {
						columnKey: "b",
						index: undefined
					}, {
						columnKey: "i",
						index: 0
					}
				]
			}
		};
		this.oController.fixConflictWithIgnore(oJson, oJsonIgnore);
		assert.deepEqual(oJson, {
			columns: {
				columnsItems: [
					{
						columnKey: "a",
						index: 0
					}, {
						columnKey: "i",
						index: 1
					}, {
						columnKey: "j",
						index: 2
					}, {
						columnKey: "b",
						index: undefined
					}
				]
			}
		});
	});

	QUnit.module("sap.ui.comp.personalization.ColumnsController: resize column width of AnalyticalTable", {
		beforeEach: function() {
			this.oColumnsController = new ColumnsController();
			this.oController = new Controller({
				table: this.oTable = new AnalyticalTable({
					columns: [
						new AnalyticalColumn({
							label: new Label({
								text: "A"
							}),
							template: new Label({
								text: "row1"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'a'
								}
							})
						}), new AnalyticalColumn({
							label: new Label({
								text: "B"
							}),
							template: new Label({
								text: "row2"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'b'
								}
							})
						}), new AnalyticalColumn({
							visible: false,
							label: new Label({
								text: "I"
							}),
							template: new Label({
								text: "row3"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'i'
								}
							})
						})
					]
				}),
				columnKeys: [
					"a", "b", "i", "ii"
				],
				setting: {
					columns: {
						visible: true,
						ignoreColumnKeys: [
							"i", "ii"
						]
					},
					sort: {
						visible: false
					},
					group: {
						visible: false
					},
					filter: {
						visible: false
					}
				}
			});

			this.oTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("before dialog is opened", function(assert) {

		var iWidthNew = "50";
		var sWidthNew = "" + iWidthNew + "px";

		this.oController.attachAfterP13nModelDataChange(function(oEvent) {
			// assert
			assert.strictEqual(oEvent.getParameter("runtimeDeltaDataChangeType").columns, "TableChanged");

			assert.strictEqual(oEvent.getParameter("runtimeDeltaData").columns.columnsItems.length, 1);
			assert.strictEqual(oEvent.getParameter("runtimeDeltaData").columns.columnsItems[0].columnKey, "a");
			assert.strictEqual(oEvent.getParameter("runtimeDeltaData").columns.columnsItems[0].width, sWidthNew);
		});

		this.oTable.fireColumnResize({
			column: this.oTable.getColumns()[0],
			width: sWidthNew
		});
	});
	QUnit.test("after dialog is opened", function(assert) {
		var done = assert.async();
		// 1. open and close dialog
		this.oController.openDialog();
		this.oController.attachDialogAfterOpen(function() {
			QUnitUtils.triggerTouchEvent("tap", this.oController._oDialog.getButtons()[0].getFocusDomRef(), {
				srcControl: this.oController._oDialog
			});
		}.bind(this));

		// 2. resize column width twice
		this.oController.attachDialogAfterClose(function() {
			// act
			var oControlDataReduce = {
				columns: {
					columnsItems: [
						{columnKey: "a", index: 0, visible: true, width: "50px", total: false},
						{columnKey: "b", index: 1, visible: true, width: "", total: false}
					],
					fixedColumnCount: 0
				}
			};

			var oControlDataCompare = {
				columns: {
						columnsItems:[
							{columnKey: "a", index: 0, visible: true, width: "", total: false},
							{columnKey: "b", index: 1, visible: true, width: "", total: false}
						]
					},
					fixedColumnCount: 1
			};

			var oData = this.oColumnsController.getChangeData(oControlDataReduce, oControlDataCompare);
			assert.ok(oData);

			done();
		}.bind(this));
	});

	QUnit.module("test API for property 'stableColumnKeys'", {
		beforeEach:function(){
			this.oColumnsController = new ColumnsController();
			this.oP13nData = {
				columns: {
					columnsItems: [
						{
							columnKey: "A",
							visible: true,
							index: 0,
							width: "30em"
						},
						{
							columnKey: "B",
							visible: true,
							index: 1,
							width: "30em"
						},
						{
							columnKey: "C",
							visible: true,
							index: 2,
							width: "30em"
						},
						{
							columnKey: "D",
							visible: false,
							index: 3,
							width: "30em"
						},
						{
							columnKey: "E",
							visible: false,
							index: 4,
							width: "30em"
						}
					]
				}
			};

		},
		afterEach:function(){
			this.oColumnsController.destroy();
		}
	});

	QUnit.test("getUnionData - column [0] is disabled from ColumnsPanel via stableColumnKeys", function(assert){

		var oJsonModel = new JSONModel({
			controlData: this.oP13nData,
			controlDataInitial: this.oP13nData,
			transientData: {
				columns: {
					columnsItems: [
						{
							columnKey: "B",
							visible: true,
							index: 0,
							width: "30em"
						},
						{
							columnKey: "C",
							visible: true,
							index: 1,
							width: "30em"
						},
						{
							columnKey: "D",
							visible: false,
							index: 2,
							width: "30em"
						},
						{
							columnKey: "E",
							visible: false,
							index: 3,
							width: "30em"
						}
					]
				}
			}
		});

		this.oColumnsController.setStableColumnKeys(["A"]);
		this.oColumnsController.setModel(oJsonModel,"$sapuicomppersonalizationBaseController");
		assert.equal(this.oColumnsController.getTransientData().columns.columnsItems.length, 4, "stable column keys have not been included in transient data");
		var oUnionData = this.oColumnsController.getUnionData(this.oP13nData, this.oColumnsController.getTransientData());
		assert.equal(oUnionData.columns.columnsItems.length, 5, "Missing column has been added in union");
		assert.deepEqual(oUnionData.columns.columnsItems[0],{columnKey: "A", visible: true, index: 0, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[1],{columnKey: "B", visible: true, index: 1, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[2],{columnKey: "C", visible: true, index: 2, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[3],{columnKey: "D", visible: false, index: 3, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[4],{columnKey: "E", visible: false, index: 4, width: "30em"}, "union of column item is correct");

	});

	QUnit.test("getUnionData - column [0] and [1] are disabled from ColumnsPanel via stableColumnKeys", function(assert){

		var oJsonModel = new JSONModel({
			controlData: this.oP13nData,
			controlDataInitial: this.oP13nData,
			transientData: {
				columns: {
					columnsItems: [
						{
							columnKey: "D",
							visible: true, //toggle D to visible
							index: 0, //swapped  C and D
							width: "30em"
						},
						{
							columnKey: "C",
							visible: false, //toggle C to invisible
							index: 1,
							width: "30em"
						},
						{
							columnKey: "E",
							visible: false,
							index: 2,
							width: "30em"
						}
					]
				}
			}
		});

		this.oColumnsController.setStableColumnKeys(["A", "B"]);
		this.oColumnsController.setModel(oJsonModel,"$sapuicomppersonalizationBaseController");
		assert.equal(this.oColumnsController.getTransientData().columns.columnsItems.length, 3, "stable column keys have not been included in transient data");
		var oUnionData = this.oColumnsController.getUnionData(this.oP13nData, this.oColumnsController.getTransientData());
		assert.equal(oUnionData.columns.columnsItems.length, 5, "Missing column has been added in union");
		assert.deepEqual(oUnionData.columns.columnsItems[0],{columnKey: "A", visible: true, index: 0, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[1],{columnKey: "B", visible: true, index: 1, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[2],{columnKey: "C", visible: false, index: 3, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[3],{columnKey: "D", visible: true, index: 2, width: "30em"}, "union of column item is correct");
		assert.deepEqual(oUnionData.columns.columnsItems[4],{columnKey: "E", visible: false, index: 4, width: "30em"}, "union of column item is correct");

	});

	QUnit.start();

});

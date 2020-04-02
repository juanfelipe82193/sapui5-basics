/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/comp/personalization/ColumnHelper",
	"sap/m/Column",
	"sap/ui/table/Column",
	"sap/m/Label",
	"sap/ui/core/CustomData"

], function (ColumnHelper, MColumn, UiColumn, Label, CustomData) {
	"use strict";

	QUnit.module("API");

	QUnit.test("constructor", function (assert) {
		var oColumn1, oColumn2;
		var oColumnHelper = new ColumnHelper();

		// arrange

		// act
		oColumnHelper.addColumnMap({
			"columnKeyA": oColumn1 = new MColumn(),
			"columnKeyB": oColumn2 = new MColumn()
		});

		// assertions
		assert.strictEqual(Object.keys(oColumnHelper._oColumnKey2ColumnMap).length, 2);
		assert.strictEqual(Object.keys(oColumnHelper._oColumnKeyIsMonkeyPatched).length, 2);

		// cleanup
		oColumnHelper.destroy();
		oColumn1.destroy();
		oColumn2.destroy();
	});

	QUnit.test("destructor", function (assert) {
		// system under test
		var oColumnHelper = new ColumnHelper();

		// arrange
		var oColumnA = new MColumn();
		var oColumnB = new MColumn();
		var oColumnMap = {
			"columnKeyA": oColumnA,
			"columnKeyB": oColumnB
		};
		oColumnHelper.addColumnMap(oColumnMap);

		// act
		oColumnHelper.destroy();

		// assertions
		assert.ok(!oColumnHelper._oColumnKey2ColumnMap);
		assert.ok(!oColumnHelper._oColumnKeyIsMonkeyPatched);
		assert.ok(!oColumnHelper._oStoredColumnMapForColumnKeys);
		assert.ok(oColumnA);
		assert.ok(oColumnB);

		// cleanup
		oColumnA.destroy();
		oColumnB.destroy();
	});

	QUnit.module("addColumns", {
		beforeEach: function () {
			this.oColumnHelper = new ColumnHelper();
			this.oSpy = sinon.spy(this.oColumnHelper, "addColumns");
		},
		afterEach: function () {
			this.oColumnHelper.destroy();
			this.oSpy.restore();
		}
	});
	QUnit.test("empty", function (assert) {
		// act and assert
		this.oColumnHelper.addColumns([]);
		assert.strictEqual(this.oSpy.exceptions[0], undefined);
		assert.deepEqual(this.oColumnHelper.getColumnMap(), {});

		// act and assert
		this.oColumnHelper.addColumns(null);
		assert.strictEqual(this.oSpy.exceptions[1], undefined);
		assert.deepEqual(this.oColumnHelper.getColumnMap(), {});
	});
	QUnit.test("all columns support 'columnKey' and has equal columnKey", function (assert) {
		var oColumn1, oColumn2;
		// act and assert
		try {
			this.oColumnHelper.addColumns([
				oColumn1 = new UiColumn("columnId1", {
					label: new Label({
						text: "Col1"
					}),
					customData: new CustomData({
						key: "p13nData", value: { columnKey: 'columnX' }
					})
				}), oColumn2 = new UiColumn("columnId2", {
					label: new Label({
						text: "Col2"
					}),
					customData: new CustomData({
						key: "p13nData", value: { columnKey: 'columnX' }
					})
				})]);
		} catch (oError) {
			// Do nothing
		}
		assert.ok(this.oSpy.exceptions[0]);
		oColumn1.destroy();
		oColumn2.destroy();
	});

	QUnit.module("_checkConsistencyOfColumns", {
		beforeEach: function () {
			this.oColumnHelper = new ColumnHelper();
			this.oSpy = sinon.spy(this.oColumnHelper, "_checkConsistencyOfColumns");
		},
		afterEach: function () {
			this.oColumnHelper.destroy();
			this.oSpy.restore();
		}
	});
	QUnit.test("empty", function (assert) {
		// act and assert
		this.oColumnHelper._checkConsistencyOfColumns({});
		assert.strictEqual(this.oSpy.exceptions[0], undefined);

		// act and assert
		this.oColumnHelper._checkConsistencyOfColumns(null);
		assert.strictEqual(this.oSpy.exceptions[1], undefined);
	});

	QUnit.test("all columns support 'columnKey'", function (assert) {
		var oColumn1, oColumn2;
		// act
		this.oColumnHelper._checkConsistencyOfColumns({
			column1: oColumn1 = new UiColumn("columnId1", {
				label: new Label({
					text: "Col1"
				}),
				customData: new CustomData({
					key: "p13nData", value: { columnKey: 'column1' }
				})
			}),
			column2: oColumn2 = new UiColumn("columnId2", {
				label: new Label({
					text: "Col2"
				}),
				customData: new CustomData({
					key: "p13nData", value: { columnKey: 'column2' }
				})
			})
		});
		// assert
		assert.strictEqual(this.oSpy.exceptions[0], undefined);
		// cleanup
		oColumn1.destroy();
		oColumn2.destroy();
	});

	QUnit.test("all columns do not support 'columnKey'", function (assert) {
		var oColumn1, oColumn2;
		// act
		this.oColumnHelper._checkConsistencyOfColumns({
			columnId1: oColumn1 = new UiColumn("columnId1", {
				label: new Label({
					text: "Col1"
				})
			}),
			columnId2: oColumn2 = new UiColumn("columnId2", {
				label: new Label({
					text: "Col2"
				})
			})
		});
		// assert
		assert.strictEqual(this.oSpy.exceptions[0], undefined);
		// cleanup
		oColumn1.destroy();
		oColumn2.destroy();
	});

	QUnit.test("mixed situation I", function (assert) {
		var oColumn1, oColumn2;
		// act
		try {
			this.oColumnHelper._checkConsistencyOfColumns({
				columnId1: oColumn1 = new UiColumn("columnId1", {
					label: new Label({
						text: "Col1"
					}),
					customData: new CustomData({
						key: "p13nData", value: { columnKey: 'column1' }
					})
				}),
				columnId2: oColumn2 = new UiColumn("columnId2", {
					label: new Label({
						text: "Col2"
					})
				})
			});
		} catch (oError) {
			//Do nothing
		}
		// assert
		assert.ok(this.oSpy.exceptions[0]);
		// cleanup
		oColumn1.destroy();
		oColumn2.destroy();
	});

	QUnit.test("mixed situation II", function (assert) {
		var oColumn1, oColumn2;
		// act
		try {
			this.oColumnHelper._checkConsistencyOfColumns({
				columnId1: oColumn1 = new UiColumn("columnId1", {
					label: new Label({
						text: "Col1"
					})
				}),
				columnId2: oColumn2 = new UiColumn("columnId2", {
					label: new Label({
						text: "Col2"
					}),
					customData: new CustomData({
						key: "p13nData", value: { columnKey: 'column2' }
					})
				})
			});
		} catch (oError) {
			//Do nothing
		}
		// assert
		assert.ok(this.oSpy.exceptions[0]);
		// cleanup
		oColumn1.destroy();
		oColumn2.destroy();
	});

	QUnit.test("not mixed situation with one columnKey equal to id", function (assert) {
		var oColumn1 = new UiColumn("column1", {
			label: new Label({
				text: "Col1"
			}),
			customData: new CustomData({
				key: "p13nData", value: { columnKey: 'column1' }
			})
		});
		var oColumn2 = new UiColumn("__column2", {
			label: new Label({
				text: "Col2"
			}),
			customData: new CustomData({
				key: "p13nData", value: { columnKey: 'column2' }
			})
		});
		// act and assert
		this.oColumnHelper._checkConsistencyOfColumns({
			column1: oColumn1,
			column2: oColumn2
		});
		assert.strictEqual(this.oSpy.exceptions[0], undefined);


		// act and assert
		this.oColumnHelper._checkConsistencyOfColumns({
			column2: oColumn2,
			column1: oColumn1
		});
		assert.strictEqual(this.oSpy.exceptions[1], undefined);

		// cleanup
		oColumn1.destroy();
		oColumn2.destroy();
	});

	QUnit.test("not mixed situation with columnKey equal to id", function (assert) {
		var oColumn1, oColumn2;
		// act
		this.oColumnHelper._checkConsistencyOfColumns({
			column1: oColumn1 = new UiColumn("column1", {
				label: new Label({
					text: "Col1"
				}),
				customData: new CustomData({
					key: "p13nData", value: { columnKey: 'column1' }
				})
			}),
			column2: oColumn2 = new UiColumn("column2", {
				label: new Label({
					text: "Col2"
				}),
				customData: new CustomData({
					key: "p13nData", value: { columnKey: 'column2' }
				})
			})
		});
		// assert
		assert.strictEqual(this.oSpy.exceptions[0], undefined);
		// cleanup
		oColumn1.destroy();
		oColumn2.destroy();
	});

	QUnit.start();

});
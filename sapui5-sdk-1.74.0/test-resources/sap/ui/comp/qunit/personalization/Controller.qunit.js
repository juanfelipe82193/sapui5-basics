/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.require([
	'sap/ui/comp/library',
	'sap/ui/comp/personalization/Controller',
	'sap/ui/table/library',
	'sap/ui/table/Table',
	'sap/ui/table/Column',
	'sap/m/Table',
	'sap/m/Column',
	'sap/m/Label',
	'sap/ui/core/CustomData',
	"sap/ui/qunit/QUnitUtils",
	'sap/ui/table/Table'

], function(
	compLibrary,
	Controller,
	tableLibrary,
	UiTable,
	UiColumn,
	MTable,
	MColumn,
	Label,
	CustomData,
	QUnitUtils,
	Table
) {
	'use strict';

	var fnConstructor01 = function(assert, oController) {
		// ColumnKeys: []
		// Table:      []
		// Ignore:     [] + []

		// assert
		assert.ok(oController.getTable());
		assert.ok(oController.getSetting());

		assert.strictEqual(Object.keys(oController._getControllers()).length, 2);
		assert.ok(oController._getControllers()["columns"]);
		assert.ok(oController._getControllers()["sort"]);

		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "ignoreData", "controlData", "alreadyKnownRuntimeData", "alreadyKnownPersistentData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		[
			"persistentDataChangeType", "persistentDeltaDataChangeType"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName)["columns"], compLibrary.personalization.ChangeType.Unchanged);
			assert.equal(oController._getInternalModelData(sDataName)["sort"], compLibrary.personalization.ChangeType.Unchanged);
		});

		assert.equal(oController._getVariantData(), undefined);
	};

	// --------------------------- TESTS -------------------------------------------------
	QUnit.module("sap.ui.comp.personalization.Controller: constructor", {
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("with empty UITable; Show table", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable(),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		this.oTable.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		fnConstructor01(assert, this.oController);
	});
	QUnit.test("with empty MTable", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new MTable(),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		fnConstructor01(assert, this.oController);
	});

	var fnConstructor02 = function(assert, oController) {
		// ColumnKeys: []
		// Table:      [a, b]
		// Ignore:     [] + []

		// assert
		assert.ok(oController.getTable());
		assert.ok(oController.getSetting());

		assert.strictEqual(Object.keys(oController._getControllers()).length, 2);
		assert.ok(oController._getControllers()["columns"]);
		assert.ok(oController._getControllers()["sort"]);

		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData", "alreadyKnownPersistentData", "controlData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		[
			"ignoreData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});
		assert.equal(oController._getVariantData(), undefined);
	};

	QUnit.test("with UITable and setting", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'a',
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
					}), new UiColumn({
						sortProperty: 'b',
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
					})
				]
			}),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		fnConstructor02(assert, this.oController);
	});
	QUnit.test("with MTable and setting; Show table", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						header: new Label({
							text: "A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a',
								sortProperty: 'a'
							}
						})
					}), new MColumn({
						header: new Label({
							text: "B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b',
								sortProperty: 'b'
							}
						})
					})
				]
			}),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		this.oTable.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		fnConstructor02(assert, this.oController);
	});
	QUnit.test("with setting and UITable; Show table", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'a',
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
					}), new UiColumn({
						sortProperty: 'b',
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
					})
				]
			})
		});

		this.oTable.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		fnConstructor02(assert, this.oController);
	});
	QUnit.test("with setting and MTable", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						header: new Label({
							text: "A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a',
								sortProperty: 'a'
							}
						})
					}), new MColumn({
						header: new Label({
							text: "B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b',
								sortProperty: 'b'
							}
						})
					})
				]
			})
		});

		fnConstructor02(assert, this.oController);
	});

	QUnit.test("with 'setting' of ignore invisible column and UITable", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"b"
					]
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						visible: true,
						sortProperty: 'a',
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
					}), new UiColumn({
						visible: false,
						sortProperty: 'b',
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
					})
				]
			})
		});

		fnConstructor03(assert, this.oController);
	});
	QUnit.test("with 'setting' of ignore invisible column and MTable; Show table", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"b"
					]
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						visible: true,
						header: new Label({
							text: "A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a',
								sortProperty: 'a'
							}
						})
					}), new MColumn({
						visible: false,
						header: new Label({
							text: "B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b',
								sortProperty: 'b'
							}
						})
					})
				]
			})
		});

		this.oTable.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		fnConstructor03(assert, this.oController);
	});
	var fnConstructor03 = function(assert, oController) {
		// ColumnKeys:      []
		// Table:           [a, b]
		//
		// Ignore Columns:  [b] + []
		// Ignore Sort:     [] + []

		// assert
		//				assert.strictEqual(oController.getTable().$().find(".sapUiTableCol").length, 1, "1 visible column");
		assert.ok(oController.getTable());
		assert.ok(oController.getSetting());

		assert.strictEqual(Object.keys(oController._getControllers()).length, 2);
		assert.ok(oController._getControllers()["columns"]);
		assert.ok(oController._getControllers()["sort"]);

		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData", "alreadyKnownPersistentData", "controlData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		assert.ok(oController._getIgnoreData());
		assert.strictEqual(Object.keys(oController._getIgnoreData()).length, 2, "columns and sort");
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"].length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"][0].columnKey, "b");
		assert.strictEqual(oController._getIgnoreData()["sort"]["sortItems"].length, 0);

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};
	QUnit.test("with 'setting', 'columnKeys' and UITable; Show table", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			columnKeys: [
				"a", "b"
			],
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'b',
						sorted: true,
						sortOrder: tableLibrary.SortOrder.Ascending,
						label: new Label({
							text: "B"
						}),
						template: new Label({
							text: "column B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					}), new UiColumn({
						sortProperty: 'a',
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "column A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					})
				]
			})
		});

		this.oTable.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		fnConstructor04(assert, this.oController);
	});
	var fnConstructor04 = function(assert, oController) {
		// ColumnKeys: [a, b]
		// Table:      [b, a]
		// Ignore:     [] + []
		// Result of Table: [a, b]

		// assert
		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData", "alreadyKnownPersistentData", "controlData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].columnKey, "a");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].index, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].columnKey, "b");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].index, 1);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 1);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"][0].columnKey, "b");
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);
		});

		[
			"ignoreData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};

	QUnit.test("with 'setting', 'columnKeys' and UITable: 'columnKeys' - 2 lazy columns", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: true
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			columnKeys: [
				"pre", "a", "b", "post"
			],
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'a',
						sorted: true,
						sortOrder: tableLibrary.SortOrder.Ascending,
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "column A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new UiColumn({
						sortProperty: 'b',
						sorted: true,
						sortOrder: tableLibrary.SortOrder.Ascending,
						label: new Label({
							text: "B"
						}),
						template: new Label({
							text: "column B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			})
		});

		fnConstructor05(assert, this.oController);
	});
	var fnConstructor05 = function(assert, oController) {
		// ColumnKeys: [pre, a, b, post]
		// ColumnMap:  [a, b]

		// assert
		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData", "alreadyKnownPersistentData", "controlData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2, "Fill only existing columns first");
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 2, "Fill only existing sort first");

			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].columnKey, "a");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].columnKey, "b");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].index, 1);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].index, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"][0].columnKey, "a");
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"][1].columnKey, "b");
		});

		[
			"ignoreData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 2, "columns and sort");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["sort"]["sortItems"].length, 0);
		});

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};
	QUnit.test("UITable: 'columnKeys' - 2 lazy and 1 ignore columns", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"post"
					]
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			columnKeys: [
				"pre", "a", "b", "post"
			],
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "column A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new UiColumn({
						label: new Label({
							text: "B"
						}),
						template: new Label({
							text: "column B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			})
		});

		this.oTable.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		fnConstructor06(assert, this.oController);
	});
	QUnit.test("MTable: 'columnKeys' - 2 lazy and 1 ignore columns", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"post"
					]
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			columnKeys: [
				"pre", "a", "b", "post"
			],
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						visible: true,
						header: new Label({
							text: "A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new MColumn({
						visible: true,
						header: new Label({
							text: "B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			})
		});

		fnConstructor06(assert, this.oController);
	});
	var fnConstructor06 = function(assert, oController) {
		// ColumnKeys:     [pre, a, b, post]
		// Table:          [a, b]
		//
		// Ignore Columns: [post]
		// Ignore Sort:    []

		// assert
		var aDataNames = Object.keys(oController._getInternalModel().getData());
		assert.strictEqual(Object.keys(aDataNames).length, 12);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData", "alreadyKnownPersistentData", "controlData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 1, "columns");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getControlDataInitial()["columns"]["columnsItems"][0].columnKey, "a");
			assert.strictEqual(oController._getControlDataInitial()["columns"]["columnsItems"][1].columnKey, "b");
			assert.strictEqual(oController._getControlDataInitial()["columns"]["columnsItems"][0].index, 1);
			assert.strictEqual(oController._getControlDataInitial()["columns"]["columnsItems"][1].index, 2);
		});

		assert.ok(oController._getIgnoreData());
		assert.strictEqual(Object.keys(oController._getIgnoreData()).length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"].length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"][0].columnKey, "post");

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};

	QUnit.module("sap.ui.comp.personalization.Controller: constructor", {
		afterEach: function() {
			this.oTable.destroy();
		}
	});
	QUnit.test("UITable: setting with ignore visible", function(assert) {
		var bExceptionRaised = false;
		try {
			var oController = new Controller({
				setting: {
					columns: {
						visible: true,
						ignoreColumnKeys: [
							"b"
						]
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					},
					group: {
						visible: false
					}
				},
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							visible: true,
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
						}), new UiColumn({
							visible: true,
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
						})
					]
				})
			});
			oController.destroy();
		} catch (oError) {
			bExceptionRaised = true;
		}
		assert.ok(bExceptionRaised);
	});
	QUnit.test("MTable: setting with ignore visible)", function(assert) {
		var bExceptionRaised = false;
		try {
			var oController = new Controller({
				setting: {
					columns: {
						visible: true,
						ignoreColumnKeys: [
							"b"
						]
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					},
					group: {
						visible: false
					}
				},
				table: this.oTable = new MTable({
					columns: [
						new MColumn({
							visible: true,
							header: new Label({
								text: "A"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'a'
								}
							})
						}), new MColumn({
							visible: true,
							header: new Label({
								text: "B"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'b'
								}
							})
						})
					]
				})
			});
			oController.destroy();
		} catch (oError) {
			bExceptionRaised = true;
		}
		assert.ok(bExceptionRaised);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: addToSettingIgnoreColumnKeys", {
		beforeEach: function() {
			this.oTable = null;
			this.oController = null;
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("UITable: de-activate a visible column", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "column A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new UiColumn({
						label: new Label({
							text: "B"
						}),
						template: new Label({
							text: "column B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			}),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		this.oTable.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		//				assert.strictEqual(this.oTable.$().find("thead").find("th").find("span").length, 2, "2 visible columns");

		fnTest04(assert, this.oController);
	});
	QUnit.test("MTable: de-activate a visible column", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						header: new Label({
							text: "A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new MColumn({
						header: new Label({
							text: "B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			}),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});

		//				assert.strictEqual(this.oTable.$().find("thead").find("th").find("span").length, 2, "2 visible columns");

		fnTest04(assert, this.oController);

		//				assert.strictEqual(this.oTable.$().find("thead").find("th").find("span").length, 1, "1 visible column");
	});
	var fnTest04 = function(assert, oController) {

		var fnfireAfterP13nModelDataChangeSpy = sinon.spy(oController, "fireAfterP13nModelDataChange");

		// act
		oController.addToSettingIgnoreColumnKeys([
			"a"
		]);

		// ColumnKeys: []
		// Table:      [^a, ^b]
		// Ignore:     [] + [a]

		// assert
		assert.ok(fnfireAfterP13nModelDataChangeSpy.calledOnce);

		assert.strictEqual(Object.keys(oController._getControllers()).length, 1);
		assert.ok(oController._getControllers()["columns"]);

		[
			"controlDataInitial", "controlDataBase"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 1, "columns");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].columnKey, "a");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].columnKey, "b");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].index, 0);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].index, 1);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].visible, true);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].visible, true);
		});

		assert.ok(oController._getAlreadyKnownRuntimeData());
		assert.strictEqual(Object.keys(oController._getAlreadyKnownRuntimeData()).length, 1, "columns");
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][0].columnKey, "a");
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][1].columnKey, "b");
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][0].index, 0);
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][1].index, 1);
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][0].visible, false);
		assert.strictEqual(oController._getAlreadyKnownRuntimeData()["columns"]["columnsItems"][1].visible, true);

		assert.strictEqual(Object.keys(oController._getIgnoreData()).length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"].length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"][0].columnKey, "a");

		assert.strictEqual(Object.keys(oController._getControlData()).length, 1);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].columnKey, "a");
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].columnKey, "b");
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].index, 0);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].index, 1);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].visible, false);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].visible, true);

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};

	QUnit.test("UITable: de-activate a column; ignore column", function(assert) {
		this.oController = new Controller({
			setting: {
				columns: {
					visible: true,
					ignoreColumnKeys: [
						"post"
					]
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			},
			columnKeys: [
				"pre", "a", "b", "post"
			],
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						label: new Label({
							text: "A"
						}),
						template: new Label({
							text: "column A"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new UiColumn({
						label: new Label({
							text: "B"
						}),
						template: new Label({
							text: "column B"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			})
		});

		this.oTable.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		fnTest06(assert, this.oController);
	});
	var fnTest06 = function(assert, oController) {
		// ColumnKeys: [pre, a, b, post]
		// Table:      [a, b]
		//
		// Ignore:     [post] + [a]

		var fnfireAfterP13nModelDataChangeSpy = sinon.spy(oController, "fireAfterP13nModelDataChange");

		// act
		oController.addToSettingIgnoreColumnKeys([
			"a"
		]);

		// assert
		assert.ok(fnfireAfterP13nModelDataChangeSpy.calledOnce);

		[
			"controlDataInitial", "controlDataBase", "alreadyKnownRuntimeData"
		].forEach(function(sDataName) {
			assert.ok(oController._getInternalModelData(sDataName));
			assert.strictEqual(Object.keys(oController._getInternalModelData(sDataName)).length, 1, "columns");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].columnKey, "a");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].columnKey, "b");
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][0].index, 1);
			assert.strictEqual(oController._getInternalModelData(sDataName)["columns"]["columnsItems"][1].index, 2);
		});

		assert.strictEqual(Object.keys(oController._getIgnoreData()).length, 1);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"][0].columnKey, "post");
		assert.strictEqual(oController._getIgnoreData()["columns"]["columnsItems"][1].columnKey, "a");

		assert.strictEqual(Object.keys(oController._getControlData()).length, 1);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].columnKey, "a");
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].columnKey, "b");
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].index, 1);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].index, 2);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][0].visible, false);
		assert.strictEqual(oController._getControlData()["columns"]["columnsItems"][1].visible, true);

		[
			"controlDataReduce", "transientData", "beforeOpenData", "variantDataInitial"
		].forEach(function(sDataName) {
			assert.equal(oController._getInternalModelData(sDataName), undefined);
		});

		assert.equal(oController._getVariantData(), undefined);
	};

	QUnit.module("sap.ui.comp.personalization.Controller: _createSettingCurrent", {
		beforeEach: function() {
			this.oTable = null;
			this.oController = null;
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("MTable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new MTable(),
			setting: {
				sort: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"columns", "filter", "group"
		]);
	});
	QUnit.test("MTable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new MTable(),
			setting: {
				group: {
					visible: true
				},
				sort: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"columns", "filter", "group"
		]);
	});
	QUnit.test("MTable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new MTable(),
			setting: {
				custom: {
					visible: true,
					controller: {}
				},
				columns: {
					visible: false
				},
				group: {
					visible: true
				},
				filter: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"sort", "group", "custom"
		]);
	});
	QUnit.test("UITable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new UiTable(),
			setting: {
				sort: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"columns", "filter", "group"
		]);
	});
	QUnit.test("UITable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new UiTable(),
			setting: {
				group: {
					visible: true
				},
				sort: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"columns", "filter", "group"
		]);
	});
	QUnit.test("UITable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new UiTable(),
			setting: {
				custom: {
					visible: true,
					controller: {}
				},
				columns: {
					visible: false
				},
				group: {
					visible: true
				},
				filter: {
					visible: false
				}
			}
		});
		// assert
		assert.deepEqual(Object.keys(this.oController._getControllers()), [
			"sort", "group", "custom"
		]);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: text and tooltip", {
		beforeEach: function() {
			this.oTable = null;
			this.oController = null;
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("UITable", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'a',
						label: new Label({
							text: "A"
						}),
						tooltip: 'tA',
						template: new Label({
							text: "row1"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a'
							}
						})
					}), new UiColumn({
						sortProperty: 'b',
						label: new Label({
							text: "B"
						}),
						tooltip: 'tB',
						template: new Label({
							text: "row2"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b'
							}
						})
					})
				]
			}),
			setting: {
				sort: {
					visible: true
				},
				columns: {
					visible: true
				},
				group: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});
		fnTest05(assert, this.oController);
	});
	QUnit.test("MTable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						header: new Label({
							text: "A",
							tooltip: "tA"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a',
								sortProperty: 'a'
							}
						})
					}), new MColumn({
						header: new Label({
							text: "B",
							tooltip: "tB"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b',
								sortProperty: 'b'
							}
						})
					})
				]
			}),
			setting: {
				sort: {
					visible: true
				},
				columns: {
					visible: true
				},
				group: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});
		fnTest05(assert, this.oController);
	});
	var fnTest05 = function(assert, oController) {
		// Columns + Sort
		// ColumnKeys: []
		// Table:      [a, b]
		// Ignore:     [] + []
		var done = assert.async();
		oController.attachDialogAfterOpen(function() {
			// assert
			assert.strictEqual(Object.keys(oController._getControllers()).length, 2);
			assert.strictEqual(oController._getTransientData()["columns"]["columnsItems"].length, 2);
			assert.strictEqual(oController._getTransientData()["columns"]["columnsItems"][0].tooltip, 'tA');
			assert.strictEqual(oController._getTransientData()["columns"]["columnsItems"][1].tooltip, 'tB');

			assert.strictEqual(oController._getTransientData()["sort"]["sortItems"].length, 2);
			assert.strictEqual(oController._getTransientData()["sort"]["sortItems"][0].tooltip, 'tA');
			assert.strictEqual(oController._getTransientData()["sort"]["sortItems"][1].tooltip, 'tB');

			done();
		});
		// act
		oController.openDialog();
	};

	QUnit.module("sap.ui.comp.personalization.Controller: initial sorting", {
		beforeEach: function() {
			this.oTable = null;
			this.oController = null;
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("UITable", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						sortProperty: 'a',
						sorted: true,
						sortOrder: tableLibrary.SortOrder.Ascending,
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
					}), new UiColumn({
						sortProperty: 'b',
						sorted: true,
						sortOrder: tableLibrary.SortOrder.Ascending,
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
					})
				]
			}),
			setting: {
				sort: {
					visible: true
				},
				columns: {
					visible: true
				},
				group: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// assert
		assert.strictEqual(Object.keys(this.oController._getControlDataInitial()).length, 2);
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"][0].columnKey, "a");
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"][1].columnKey, "b");
		assert.strictEqual(this.oController._getControlDataInitial()["sort"]["sortItems"].length, 2);
		assert.strictEqual(this.oController._getControlDataInitial()["sort"]["sortItems"][0].columnKey, "a");
		assert.strictEqual(this.oController._getControlDataInitial()["sort"]["sortItems"][1].columnKey, "b");
	});
	QUnit.test("MTable", function(assert) {
		// act
		this.oController = new Controller({
			table: this.oTable = new MTable({
				columns: [
					new MColumn({
						header: new Label({
							text: "A",
							tooltip: "tA"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'a',
								sortProperty: 'a'
							}
						})
					}), new MColumn({
						header: new Label({
							text: "B",
							tooltip: "tB"
						}),
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'b',
								sortProperty: 'b'
							}
						})
					})
				]
			}),
			setting: {
				sort: {
					visible: true
				},
				columns: {
					visible: true
				},
				group: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// assert
		assert.strictEqual(Object.keys(this.oController._getControlDataInitial()).length, 2);
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"].length, 2);
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"][0].columnKey, "a");
		assert.strictEqual(this.oController._getControlDataInitial()["columns"]["columnsItems"][1].columnKey, "b");
		assert.strictEqual(this.oController._getControlDataInitial()["sort"]["sortItems"].length, 0);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: _fireChangeEvent", {
		beforeEach: function() {
			this.oController = new Controller({
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							sortProperty: 'a',
							sorted: true,
							sortOrder: tableLibrary.SortOrder.Ascending,
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
						}), new UiColumn({
							sortProperty: 'b',
							sorted: true,
							sortOrder: tableLibrary.SortOrder.Ascending,
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
						})
					]
				}),
				setting: {
					sort: {
						visible: true
					},
					columns: {
						visible: true
					},
					group: {
						visible: false
					},
					filter: {
						visible: false
					}
				}
			});
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("with UITable: open dialog and press 'OK'", function(assert) {
		var that = this;
		var done = assert.async();
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");
		this.oController.attachDialogAfterOpen(function() {
			that.oController._oDialog.attachAfterClose(function() {
				// assert
				assert.equal(fnFireAfterP13nModelDataChangeSpy.callCount, 0);
				done();
			});
			// act: press 'OK'
			QUnitUtils.triggerTouchEvent("tap", that.oController._oDialog.getButtons()[0].getFocusDomRef(), {
				srcControl: that.oController._oDialog
			});
		});
		// act: open dialog
		this.oController.openDialog();
	});
	QUnit.test("with UITable: make change then open dialog and press 'OK'", function(assert) {
		// act: make change
		this.oController.setDataSuiteFormatSnapshot({
			"Visualizations": [
				{
					"Type": "LineItem",
					"Content": [
						{
							"Value": "a"
						}
					]
				}
			]
		});

		var that = this;
		var done = assert.async();
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");
		this.oController.attachDialogAfterOpen(function() {
			that.oController._oDialog.attachAfterClose(function() {
				// assert
				assert.equal(fnFireAfterP13nModelDataChangeSpy.callCount, 0);
				done();
			});
			// act: press 'OK'
			QUnitUtils.triggerTouchEvent("tap", that.oController._oDialog.getButtons()[0].getFocusDomRef(), {
				srcControl: that.oController._oDialog
			});
		});

		// act: open dialog
		this.oController.openDialog();
	});

	QUnit.module("sap.ui.comp.personalization.Controller: _determineResetType in 'VariantManagement' mode", {
		beforeEach: function() {
			this.oController = new Controller({
				resetToInitialTableState: false,
				columnKeys: [
					"a", "b"
				],
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							label: new Label({
								text: "A"
							}),
							template: new Label({
								text: "column A"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'a'
								}
							})
						}), new UiColumn({
							label: new Label({
								text: "B"
							}),
							template: new Label({
								text: "column B"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'b'
								}
							})
						})
					]
				}),
				setting: {
					columns: {
						visible: true
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					},
					group: {
						visible: false
					}
				}
			});
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("UITable: setDataSuiteFormatSnapshot", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: make change
		this.oController.setDataSuiteFormatSnapshot({
			"Visualizations": [
				{
					"Type": "LineItem",
					"Content": [
						{
							"Value": "a"
						}
					]
				}
			]
		});
		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization();

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization(compLibrary.personalization.ResetType.ResetFull);

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization(compLibrary.personalization.ResetType.ResetPartial);

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});

	QUnit.test("UITable: setPersonalizationData", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.setPersonalizationData({
			columns: {
				columnsItems: [
					{
						columnKey: "b",
						index: 0
					}
				]
			}
		});

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetPartial);
	});
	QUnit.test("UITable: setPersonalizationDataAsDataSuiteFormat", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: make change
		this.oController.setPersonalizationDataAsDataSuiteFormat({
			"Visualizations": [
				{
					"Type": "LineItem",
					"Content": [
						{
							"Value": "a"
						}
					]
				}
			]
		});
		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetPartial);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: _determineResetType in implicit 'VariantManagement' mode", {
		beforeEach: function() {
			this.oController = new Controller({
				resetToInitialTableState: true,
				columnKeys: [
					"a", "b"
				],
				table: this.oTable = new UiTable({
					columns: [
						new UiColumn({
							label: new Label({
								text: "A"
							}),
							template: new Label({
								text: "column A"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'a'
								}
							})
						}), new UiColumn({
							label: new Label({
								text: "B"
							}),
							template: new Label({
								text: "column B"
							}),
							customData: new CustomData({
								key: "p13nData",
								value: {
									columnKey: 'b'
								}
							})
						})
					]
				}),
				setting: {
					columns: {
						visible: true
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					},
					group: {
						visible: false
					}
				}
			});
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("UITable: setDataSuiteFormatSnapshot", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: make change
		this.oController.setDataSuiteFormatSnapshot({
			"Visualizations": [
				{
					"Type": "LineItem",
					"Content": [
						{
							"Value": "a"
						}
					]
				}
			]
		});
		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization();

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization(compLibrary.personalization.ResetType.ResetFull);

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set standard variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.resetPersonalization(compLibrary.personalization.ResetType.ResetPartial);

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.notCalled);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});

	QUnit.test("UITable: set variant", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: set variant and make change
		this.oController.setPersonalizationData({
			columns: {
				columnsItems: [
					{
						columnKey: "b",
						index: 0
					}
				]
			}
		});

		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});
	QUnit.test("UITable: set setPersonalizationDataAsDataSuiteFormat", function(assert) {
		// prepare
		var fnFireAfterP13nModelDataChangeSpy = sinon.spy(this.oController, "fireAfterP13nModelDataChange");

		// act: make change
		this.oController.setPersonalizationDataAsDataSuiteFormat({
			"Visualizations": [
				{
					"Type": "LineItem",
					"Content": [
						{
							"Value": "a"
						}
					]
				}
			]
		});
		// assert
		assert.ok(fnFireAfterP13nModelDataChangeSpy.calledOnce);
		assert.equal(this.oController._determineResetType(), compLibrary.personalization.ResetType.ResetFull);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: _getOrderedColumnKeys", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});
	QUnit.test("test 01", function(assert) {
		assert.ok(Controller._getOrderedColumnKeys({
			a: new UiColumn({
				label: new Label({
					text: "A"
				})
			}),
			b: new UiColumn({
				label: new Label({
					text: "B"
				})
			}),
			c: new UiColumn({
				label: new Label({
					text: "C"
				})
			})
		}, [
			"d"
		]), []);
		assert.ok(Controller._getOrderedColumnKeys({
			a: new UiColumn({
				label: new Label({
					text: "A"
				})
			}),
			b: new UiColumn({
				label: new Label({
					text: "B"
				})
			}),
			c: new UiColumn({
				label: new Label({
					text: "C"
				})
			})
		}, [
			"c", "a", "b"
		]), [
			"c", "a", "b"
		]);
		assert.ok(Controller._getOrderedColumnKeys({
			a: new UiColumn({
				label: new Label({
					text: "A"
				})
			}),
			b: new UiColumn({
				label: new Label({
					text: "B"
				})
			}),
			c: new UiColumn({
				label: new Label({
					text: "C"
				})
			})
		}, [
			"c", "a", "d", "b"
		]), [
			"c", "a", "b"
		]);
		assert.ok(Controller._getOrderedColumnKeys({
			a: new UiColumn({
				label: new Label({
					text: "A"
				})
			}),
			b: new UiColumn({
				label: new Label({
					text: "B"
				})
			}),
			c: new UiColumn({
				label: new Label({
					text: "C"
				})
			})
		}, [
			"c", "d"
		]), [
			"c"
		]);
	});

	QUnit.module("sap.ui.comp.personalization.Controller: checkConsistency", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});
	QUnit.test("BCP 0020751295 0000634662 2018 - Test01", function(assert) {
		var oController = new sap.ui.comp.personalization.Controller({
			columnKeys: [
				"b", "a", "c"
			],
			table: new sap.ui.table.Table()
		});
		assert.deepEqual(oController.getColumnKeys(), ["b", "a", "c"]);
		oController.destroy();
	});
	QUnit.test("BCP 0020751295 0000634662 2018 - Test02", function(assert) {
		var oController = new sap.ui.comp.personalization.Controller({
			columnKeys: [
				"b", "a", "a"
			],
			table: new sap.ui.table.Table()
		});
		assert.deepEqual(oController.getColumnKeys(), ["b", "a"]);
		oController.destroy();
	});
	QUnit.test("Check the internal model size limit and amount of created columns", function(assert) {
		var done = assert.async();
		var iDummyAmount = 284;
		var aDummyColumnKeys = [];
		var aDummyColumns = [];
		for (var i = 0; i < iDummyAmount; i++) {
			aDummyColumnKeys.push("column" + i);
			aDummyColumns.push(
				new UiColumn({
					label: new Label({
						text: "Column Nr." + i
					}),
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "Col" + i,
							text:"Column Nr." + i
						}
					})
				})
			);
		}
		var oController = new Controller({
			table: this.oTable = new UiTable({
				columns: aDummyColumns
			}),
			setting: {
				columns: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				},
				group: {
					visible: false
				}
			}
		});
		var oInnerModel = oController._getInternalModel();

		assert.equal(oInnerModel.iSizeLimit, 10000, "The size limit of the inner model is set to 10000");

		oController.openDialog();

		oController.attachDialogAfterOpen(function(){
			assert.equal(this.getColumnKeys().length, iDummyAmount, "The correct amount of columnKeys has been passed to the perso controller");
			var oPanel = this._oDialog.getPanels()[0];
			assert.equal(oPanel.getItems().length, iDummyAmount, "The correct amount of items has been created on the ColumnsPanel");
			var iTableItems = oPanel.getAggregation("content")[1].getAggregation("content")[0].getItems().length;
			var iVisibleItems = oPanel.getAggregation("content")[1].getAggregation("content")[0].getVisibleItems().length;
			assert.equal(iTableItems, iDummyAmount, "Correct amount of Table Items in the dialog");
			assert.equal(iVisibleItems, iDummyAmount, "Correct amount of Visible Table Items in the dialog");
			done();
		});

	});

	QUnit.start();
});

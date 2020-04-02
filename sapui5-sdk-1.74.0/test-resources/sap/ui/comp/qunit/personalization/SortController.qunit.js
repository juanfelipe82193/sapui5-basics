/* global QUnit*/
QUnit.config.autostart = false;

sap.ui.require([
	'sap/ui/base/EventProvider',
	'sap/ui/comp/personalization/SortController',
	'sap/ui/comp/personalization/Controller',
	'sap/ui/table/library',
	'sap/ui/table/Table',
	'sap/ui/table/Column',
	'sap/m/Label',
	'sap/ui/model/json/JSONModel',
	'sap/m/Table',
	'sap/m/Column',
	'sap/ui/core/CustomData',
	'sap/m/ColumnListItem'

], function(EventProvider, SortController, Controller, tableLibrary, UiTable, UiColumn, Label, JSONModel, MTable, MColumn, CustomData, ColumnListItem) {
	'use strict';

	var oEmpty = {
		sort: {
			sortItems: []
		}
	};
	var oA = {
		sort: {
			sortItems: [
				{
					columnKey: "name",
					operation: "Ascending"
				}
			]
		}
	};
	var oAx = {
		sort: {
			sortItems: [
				{
					columnKey: "name",
					operation: "Descending"
				}
			]
		}
	};
	var oB = {
		sort: {
			sortItems: [
				{
					columnKey: "country",
					operation: "Ascending"
				}
			]
		}
	};
	var oAB = {
		sort: {
			sortItems: [
				{
					columnKey: "name",
					operation: "Ascending"
				}, {
					columnKey: "country",
					operation: "Ascending"
				}
			]
		}
	};
	var oAxB = {
		sort: {
			sortItems: [
				{
					columnKey: "name",
					operation: "Descending"
				}, {
					columnKey: "country",
					operation: "Ascending"
				}
			]
		}
	};
	var oBA = {
		sort: {
			sortItems: [
				{
					columnKey: "country",
					operation: "Ascending"
				}, {
					columnKey: "name",
					operation: "Ascending"
				}
			]
		}
	};

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
					path: "name"
				}, {
					id: "country",
					text: "Country",
					path: "country"
				}, {
					id: "city",
					text: "City",
					path: "city"
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
		}
		return oTable;
	};

	QUnit.module("API", {
		beforeEach: function() {
			this.oTable = createTable("UITable");
			this.oSortController = new SortController({
				table: this.oTable
			});
		},
		afterEach: function() {
			this.oTable.destroy();
			this.oSortController.destroy();
		}
	});

	QUnit.test("destroy", function(assert) {
		// act
		this.oSortController.destroy();

		// assertions
		assert.deepEqual(EventProvider.getEventList(this.oTable), {});
	});

	QUnit.test("SortController: getChangeData", function(assert) {
		// asserts
		assert.deepEqual(this.oSortController.getChangeData(oEmpty, oA), oEmpty, "delete: [] XOR A = []");
		assert.deepEqual(this.oSortController.getChangeData({}, oA), oEmpty, "{} XOR A = []");
		assert.deepEqual(this.oSortController.getChangeData(oA, oEmpty), oA, "A XOR [] = A");
		assert.deepEqual(this.oSortController.getChangeData(oA, oA), null, "no change: A XOR A = null");
		assert.deepEqual(this.oSortController.getChangeData(oA, {
			sort: {}
		}), oA, "change: A XOR {sort} = A");
		assert.deepEqual(this.oSortController.getChangeData(oA, {}), oA, "change: A XOR {} = A");
		assert.deepEqual(this.oSortController.getChangeData(oA, null), oA, "change: A XOR null = A");
		assert.deepEqual(this.oSortController.getChangeData(oA, oB), oA, "change: A XOR B = A");
		assert.deepEqual(this.oSortController.getChangeData(oA, oAx), oA, "change: A XOR A' = A");
		assert.deepEqual(this.oSortController.getChangeData(oA, oAB), oA, "change: A XOR (A, B) = A");
		assert.deepEqual(this.oSortController.getChangeData(oA, {
			sort: {
				sortItems: []
			}
		}), oA, "change: A XOR [] = A");
		assert.deepEqual(this.oSortController.getChangeData(oAx, oA), oAx, "change: A' XOR A = A'");
		assert.deepEqual(this.oSortController.getChangeData(oAB, oAB), null, "no change: (A, B) XOR (A, B) = null");
		assert.deepEqual(this.oSortController.getChangeData(oAB, oBA), oAB, "change: (A, B) XOR (B, A) = (A, B)");

	});

	QUnit.test("SortController: getUnionData", function(assert) {
		// asserts
		assert.deepEqual(this.oSortController.getUnionData(oA, oA), oA, "no change: A UNION A = A");
		assert.deepEqual(this.oSortController.getUnionData(oA, null), oA, "no change: A UNION null = A");
		assert.deepEqual(this.oSortController.getUnionData(oA, {}), oA, "no change: A UNION {} = A");
		assert.deepEqual(this.oSortController.getUnionData(oEmpty, null), oEmpty, ":no change [] UNION null = []");
		assert.deepEqual(this.oSortController.getUnionData(oA, {
			sort: {}
		}), oA, "no change: A UNION {sort} = A");

		assert.deepEqual(this.oSortController.getUnionData(oA, oAx), oAx, "change: A UNION A' = A'");
		assert.deepEqual(this.oSortController.getUnionData(oA, oB), oB, "change: A UNION B = B");
		assert.deepEqual(this.oSortController.getUnionData(oA, oAB), oAB, "change: A UNION (A, B) = (A, B)");
		assert.deepEqual(this.oSortController.getUnionData(oAB, oAB), oAB, "change: (A, B) UNION (A, B) = (A, B)");
		assert.deepEqual(this.oSortController.getUnionData(oAB, oBA), oBA, "change: (A, B) UNION (B, A) = (B, A)");
		assert.deepEqual(this.oSortController.getUnionData(oA, oEmpty), oEmpty, "change: A UNION [] = []");
		assert.deepEqual(this.oSortController.getUnionData(oEmpty, oA), oA, "change: [] UNION A = A");
		assert.deepEqual(this.oSortController.getUnionData({}, oA), oA, "change: {} UNION A = A");
		assert.deepEqual(this.oSortController.getUnionData(oA, oAxB), oAxB, "change: A UNION (A', B) = (A', B)");
	});

	QUnit.module("API", {
		beforeEach: function() {
			this.oSortController = new SortController();
		},
		afterEach: function() {
			this.oSortController.destroy();
		}
	});
	QUnit.test("getChangeType", function(assert) {
		assert.ok(this.oSortController.getChangeType(oEmpty, oA));
		assert.ok(this.oSortController.getChangeType(oEmpty, null));
	});

	QUnit.module("sap.ui.comp.personalization.SortController: getPanel", {
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	var fTest01 = function(assert, oSortController) {
		assert.ok(oSortController.getPanel());
	};

	QUnit.test("with UITable containing sortable columns", function(assert) {
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
		fTest01(assert, this.oController._oSettingCurrent.sort.controller);
	});

	QUnit.test("with MTable containing sortable columns", function(assert) {
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
		fTest01(assert, this.oController._oSettingCurrent.sort.controller);
	});

	var fTest02 = function(assert, oSortController) {
		assert.ok(!oSortController.getPanel());
	};

	QUnit.test("with UITable not containing sortable columns", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable({
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
					}), new UiColumn({
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
		fTest02(assert, this.oController._oSettingCurrent.sort.controller);
	});
	QUnit.test("with MTable not containing sortable columns", function(assert) {
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
				sort: {
					visible: true
				},
				columns: {
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
		fTest02(assert, this.oController._oSettingCurrent.sort.controller);
	});

	QUnit.module("sap.ui.comp.personalization.SortController: syncJson2Table", {
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	var fTest03 = function(assert, oSortController, oTable) {
		// assert
		assert.equal(oTable.getColumns()[0].getSorted(), false);

		// act
		oSortController.syncJson2Table({
			sort: {
				sortItems: [
					{
						columnKey: "a",
						operation: tableLibrary.SortOrder.Ascending
					}
				]
			}
		});

		// assert
		assert.equal(oTable.getColumns()[0].getSorted(), true);
	};

	QUnit.test("with UITable not containing sorted columns", function(assert) {
		this.oController = new Controller({
			table: this.oTable = new UiTable({
				columns: [
					new UiColumn({
						label: new Label({
							text: "A"
						}),
						sortProperty: 'a',
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
						label: new Label({
							text: "B"
						}),
						sortProperty: 'b',
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
		fTest03(assert, this.oController._oSettingCurrent.sort.controller, this.oTable);
	});

	QUnit.module("sap.ui.comp.personalization.SortController: _updateInternalModel", {
		beforeEach: function() {
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
					sort: {
						visible: true
					},
					columns: {
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
			this.oSortController = this.oController._oSettingCurrent.sort.controller;
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});
	QUnit.test("test01", function(assert) {
		// assert
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"].length, 0);
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"].length, 0);

		// act
		this.oSortController._updateInternalModel("a", tableLibrary.SortOrder.Ascending, false);

		// assert
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"].length, 1);
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"].length, 1);
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		// act
		this.oSortController._updateInternalModel("a", tableLibrary.SortOrder.Descending, false);

		// assert
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"].length, 1);
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Descending);

		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"].length, 1);
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Descending);

		// act
		this.oSortController._updateInternalModel("b", tableLibrary.SortOrder.Ascending, false);

		// assert
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"].length, 1);
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][0].columnKey, "b");
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"].length, 1);
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][0].columnKey, "b");
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		// act
		this.oSortController._updateInternalModel("a", tableLibrary.SortOrder.Ascending, true);

		// assert
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"].length, 2);
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][0].columnKey, "b");
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][1].columnKey, "a");
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][1].operation, tableLibrary.SortOrder.Ascending);

		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"].length, 2);
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][0].columnKey, "b");
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][1].columnKey, "a");
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][1].operation, tableLibrary.SortOrder.Ascending);

		// act
		this.oSortController._updateInternalModel("a", tableLibrary.SortOrder.Descending, false);

		// assert
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"].length, 1);
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(this.oSortController.getControlDataBase()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Descending);

		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"].length, 1);
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(this.oSortController.getControlData()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Descending);
	});

	QUnit.module("sap.ui.comp.personalization.SortController: handleIgnore", {
		afterEach: function() {
			this.oTable.destroy();
			this.oController.destroy();
		}
	});

	var fTest04 = function(assert, oSortController, oController) {
		// Simulate user interaction
		oSortController._updateInternalModel("a", tableLibrary.SortOrder.Ascending, false);

		// assert
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"].length, 1, "sorting of user interaction");
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		assert.equal(oSortController.getControlData()["sort"]["sortItems"].length, 1, "sorting of user interaction");
		assert.equal(oSortController.getControlData()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(oSortController.getControlData()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		// act
		oController.addToSettingIgnoreColumnKeys([
			"a"
		]);

		// assert
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"].length, 1, "sorting of user interaction");
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		assert.equal(oSortController.getControlData()["sort"]["sortItems"].length, 0, "column ignored");

		// act
		oController.addToSettingIgnoreColumnKeys([]);

		// assert
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"].length, 1, "sorting of user interaction");
		assert.equal(oSortController.getControlData()["sort"]["sortItems"].length, 1, "sorting of user interaction");
	};

	QUnit.test("with UITable not containing initially sorted column", function(assert) {
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
				sort: {
					visible: true
				},
				columns: {
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
		fTest04(assert, this.oController._oSettingCurrent.sort.controller, this.oController);
	});
	QUnit.test("with MTable not containing initially sorted column", function(assert) {
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
				sort: {
					visible: true
				},
				columns: {
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
		fTest04(assert, this.oController._oSettingCurrent.sort.controller, this.oController);
	});

	var fTest05 = function(assert, oSortController, oController) {
		// assert
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"].length, 1, "initial sorting");
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		assert.equal(oSortController.getControlData()["sort"]["sortItems"].length, 1, "initial sorting");
		assert.equal(oSortController.getControlData()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(oSortController.getControlData()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		// act
		oController.addToSettingIgnoreColumnKeys([
			"a"
		]);

		// assert
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"].length, 1, "initial sorting");
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		assert.equal(oSortController.getControlData()["sort"]["sortItems"].length, 0, "column ignored");

		// act
		oController.addToSettingIgnoreColumnKeys([]);

		// assert
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"].length, 1, "initial sorting");
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(oSortController.getControlDataBase()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);

		assert.equal(oSortController.getControlData()["sort"]["sortItems"].length, 1, "initial sorting");
		assert.equal(oSortController.getControlData()["sort"]["sortItems"][0].columnKey, "a");
		assert.equal(oSortController.getControlData()["sort"]["sortItems"][0].operation, tableLibrary.SortOrder.Ascending);
	};

	QUnit.test("with UITable containing initially sorted column", function(assert) {
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
		fTest05(assert, this.oController._oSettingCurrent.sort.controller, this.oController);
	});

	QUnit.start();

});
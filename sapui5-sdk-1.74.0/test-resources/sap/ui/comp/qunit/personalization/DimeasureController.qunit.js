/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.require([
	'sap/ui/comp/personalization/Controller', 'sap/ui/comp/personalization/DimeasureController', 'sap/ui/comp/odata/ChartMetadata', 'sap/chart/data/Dimension', 'sap/chart/data/Measure', 'sap/chart/Chart', 'sap/ui/core/CustomData', 'sap/ui/model/json/JSONModel', 'sap/ui/comp/personalization/ChartWrapper'

], function(Controller, DimeasureController, ChartMetadata, Dimension, Measure, Chart, CustomData, JSONModel, ChartWrapper) {
	'use strict';

	if (window.blanket) {
		//window.blanket.options("sap-ui-cover-only", "sap/ui/comp");
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	var oEmpty = {
		dimeasure: {
			dimeasureItems: []
		}
	};
	var oA = {
		dimeasure: {
			chartTypeKey: "columns",
			dimeasureItems: [
				{
					columnKey: "name",
					index: 0,
					visible: true,
					role: "dimension"
				}
			]
		}
	};

	QUnit.module("Properties", {
		beforeEach: function() {
			this.oDimeasureController = new DimeasureController();
		},
		afterEach: function() {
			this.oDimeasureController.destroy();
		}
	});

	QUnit.test("Shall be instantiable to check that DimeasureController exist", function(assert) {
		assert.ok(this.oDimeasureController);
	});

	QUnit.test("_isSemanticEqual", function(assert) {
		// assert
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "A"
					}, {
						columnKey: "B"
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "A"
					}
				]
			}
		}));
		assert.ok(this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "A",
						index: 1
					}, {
						columnKey: "B",
						index: 0
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "B",
						index: 0
					}, {
						columnKey: "A",
						index: 1
					}
				]
			}
		}));
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "A",
						index: 0
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "A"
					}
				]
			}
		}));
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				chartTypeKey: "a",
				dimeasureItems: []
			}
		}, {
			dimeasure: {
				dimeasureItems: []
			}
		}));
		assert.ok(this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				chartTypeKey: "a",
				dimeasureItems: []
			}
		}, {
			dimeasure: {
				dimeasureItems: [],
				chartTypeKey: "a"
			}
		}));
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				chartTypeKey: "a",
				dimeasureItems: [
					{
						columnKey: "name",
						index: 0,
						visible: true,
						role: "dimension"
					}, {
						columnKey: "city",
						index: 0,
						visible: false,
						role: "dimension"
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "name",
						index: 0,
						visible: false,
						role: "dimension"
					}, {
						columnKey: "city",
						index: 0,
						visible: true,
						role: "dimension"
					}
				],
				chartTypeKey: "a"
			}
		}));
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				chartTypeKey: "a",
				dimeasureItems: [
					{
						columnKey: "name",
						index: 0,
						visible: true,
						role: "dimension"
					}, {
						columnKey: "city",
						index: 1,
						visible: true,
						role: "dimension"
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "name",
						index: 1,
						visible: true,
						role: "dimension"
					}, {
						columnKey: "city",
						index: 0,
						visible: true,
						role: "dimension"
					}
				],
				chartTypeKey: "a"
			}
		}));
		assert.ok(!this.oDimeasureController._isSemanticEqual({
			dimeasure: {
				chartTypeKey: "a",
				dimeasureItems: [
					{
						columnKey: "name",
						index: 0,
						visible: true,
						role: "dimension"
					}, {
						columnKey: "city",
						index: 0,
						visible: true,
						role: "dimension"
					}
				]
			}
		}, {
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "name",
						index: 1,
						visible: true,
						role: "dimension"
					}
				],
				chartTypeKey: "a"
			}
		}));
	});

	QUnit.test("_isDimMeasureItemEqual", function(assert) {
		// assert
		assert.ok(this.oDimeasureController._isDimMeasureItemEqual(null, null));
		assert.ok(!this.oDimeasureController._isDimMeasureItemEqual({
			columnKey: "name",
			index: 0,
			visible: true,
			role: "dimension"
		}, null));
		assert.ok(!this.oDimeasureController._isDimMeasureItemEqual(null, {
			columnKey: "name",
			index: 0,
			visible: true,
			role: "dimension"
		}));
		assert.ok(this.oDimeasureController._isDimMeasureItemEqual({
			columnKey: "name",
			index: 0,
			visible: true,
			role: "dimension"
		}, {
			columnKey: "name",
			index: 0,
			visible: true,
			role: "dimension"
		}));
		assert.ok(this.oDimeasureController._isDimMeasureItemEqual({
			columnKey: "name",
			index: -1,
			visible: false,
			role: "dimension"
		}, null));
		assert.ok(this.oDimeasureController._isDimMeasureItemEqual(null, {
			columnKey: "name",
			index: -1,
			visible: false,
			role: "dimension"
		}));
	});
	QUnit.test("getChangeType", function(assert) {
		assert.ok(this.oDimeasureController.getChangeType(oEmpty, oA));
	});

	QUnit.module("chart type", {
		beforeEach: function() {
			this.oChart = new Chart({
				width: '100%',
				isAnalytical: true,
				uiConfig: {
					applicationSet: 'fiori'
				},
				chartType: sap.chart.ChartType.Column,
				selectionMode: sap.chart.SelectionMode.Single,
				visibleDimensions: [
					"name", "city"
				],
				visibleMeasures: [
					"number", "date"
				],
				dimensions: [
					new Dimension({
						label: "Name",
						name: "name",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'name'
							}
						})
					}), new Dimension({
						label: "City",
						name: "city",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'city'
							}
						})
					})
				],
				measures: [
					new Measure({
						label: "Number",
						name: "number",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'number'
							}
						})
					}), new Measure({
						label: "Date",
						name: "date",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'date'
							}
						})
					})
				]
			});

			this.oDimeasureController = new DimeasureController({
				table: this.oTable = ChartWrapper.createChartWrapper(this.oChart, [
					{
						columnKey: "country",
						leadingProperty: "country",
						sortProperty: true,
						filterProperty: true,
						label: "Country",
						tooltip: "Country"
					}
				], [
					"name", "country", "number", "city", "date"
				])
			});
			this.oDimeasureController.initializeInternalModel(new JSONModel());
		},
		afterEach: function() {
			this.oDimeasureController.destroy();
			this.oTable.destroy();
			this.oChart.destroy();
		}
	});
	QUnit.test("setChartType", function(assert) {
		this.oChart.setChartType("newChartType");
		assert.equal(this.oDimeasureController.getControlData().dimeasure.chartTypeKey, "newChartType");
	});

	QUnit.module("getPanel", {
		beforeEach: function() {
			this.oChart = new Chart({
				width: '100%',
				isAnalytical: true,
				uiConfig: {
					applicationSet: 'fiori'
				},
				chartType: sap.chart.ChartType.Column,
				selectionMode: sap.chart.SelectionMode.Single,
				visibleDimensions: [
					"name", "city"
				],
				visibleMeasures: [
					"number", "date"
				],
				dimensions: [
					new Dimension({
						label: "Name",
						name: "name",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'name'
							}
						})
					}), new Dimension({
						label: "City",
						name: "city",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'city'
							}
						})
					})
				],
				measures: [
					new Measure({
						label: "Number",
						name: "number",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'number'
							}
						})
					}), new Measure({
						label: "Date",
						name: "date",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'date'
							}
						})
					})
				]
			});
			this.oController = new Controller({
				table: this.oTable = ChartWrapper.createChartWrapper(this.oChart, [
					{
						columnKey: "country",
						leadingProperty: "country",
						sortProperty: true,
						filterProperty: true,
						label: "Country",
						tooltip: "Country"
					}
				], [
					"name", "country", "number", "city", "date"
				]),
				setting: {
					dimeasure: {
						visible: true
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					}
				}
			});
			// Fill 'ControlDataReduce' as the panel is bound again this internal model
			this.oController._prepareDialogUi();
			this.oDimeasureController = this.oController._oSettingCurrent.dimeasure.controller;
		},
		afterEach: function() {
			this.oDimeasureController.destroy();
			this.oController.destroy();
			this.oTable.destroy();
			this.oChart.destroy();
		}
	});

	QUnit.test("getPanel - without filterable columns", function(assert) {
		// act
		var done = assert.async();
		var oPromise = this.oDimeasureController.getPanel();
		oPromise.then(function(oPanel) {
			// assert
			assert.ok(oPanel);
			// act: propagate internal model to the panel
			oPanel.beforeNavigationTo();
			// assert
			assert.equal(oPanel.getItems().length, 4);
			assert.equal(oPanel.getDimMeasureItems().length, 4);

			done();
		});
	});

	QUnit.test("syncJson2Table - filter is set to first column", function(assert) {
		// act
		this.oDimeasureController.syncJson2Table({
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "name",
						index: 0
					}, {
						columnKey: "city",
						index: 2
					}, {
						columnKey: "number",
						index: 1
					}, {
						columnKey: "date",
						index: 3
					}
				]
			}
		});
		this.oDimeasureController.syncJson2Table({
			dimeasure: {
				dimeasureItems: [
					{
						columnKey: "name",
						index: 2
					}, {
						columnKey: "city",
						index: 0
					}, {
						columnKey: "number",
						index: 3
					}, {
						columnKey: "date",
						index: 1
					}
				]
			}
		});

		// assert
		assert.ok(this.oTable.getColumns()[0]);
	});
	QUnit.module("DrilledDown and DrilledUp", {
		beforeEach: function() {
			this.oChart = new Chart({
				width: '100%',
				isAnalytical: true,
				uiConfig: {
					applicationSet: 'fiori'
				},
				chartType: sap.chart.ChartType.Column,
				selectionMode: sap.chart.SelectionMode.Single,
				visibleDimensions: [
					"name", "city"
				],
				visibleMeasures: [
					"number", "date"
				],
				dimensions: [
					new Dimension({
						label: "Name",
						name: "name",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'name'
							}
						})
					}), new Dimension({
						label: "City",
						name: "city",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'city'
							}
						})
					})
				],
				measures: [
					new Measure({
						label: "Number",
						name: "number",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'number'
							}
						})
					}), new Measure({
						label: "Date",
						name: "date",
						customData: new CustomData({
							key: "p13nData",
							value: {
								columnKey: 'date'
							}
						})
					})
				]
			});

			this.oController = new Controller({
				table: this.oTable = ChartWrapper.createChartWrapper(this.oChart, [
					{
						columnKey: "country",
						leadingProperty: "country",
						sortProperty: true,
						filterProperty: true,
						label: "Country",
						tooltip: "Country"
					}
				], [
					"name", "country", "number", "city", "date"
				]),
				setting: {
					dimeasure: {
						visible: true
					},
					sort: {
						visible: false
					},
					filter: {
						visible: false
					}
				}
			});
			this.oDimeasureController = this.oController._oSettingCurrent.dimeasure.controller;
		},
		afterEach: function() {
			this.oDimeasureController.destroy();
			this.oController.destroy();
			this.oTable.destroy();
			this.oChart.destroy();
		}
	});
	QUnit.test("_addVisibleDimensions", function(assert) {
		// assert
		assert.equal(this.oDimeasureController.getControlDataBase().dimeasure.dimeasureItems.length, 4);
		assert.deepEqual(this.oDimeasureController.getControlDataBase().dimeasure.dimeasureItems, [
			{
				columnKey: "name",
				index: 0,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "number",
				index: 2,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}, {
				columnKey: "city",
				index: 3,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "date",
				index: 4,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}
		]);

		// act
		this.oDimeasureController._addVisibleDimensions([
			"city", "name"
		]);

		// assert
		assert.equal(this.oDimeasureController.getControlDataBase().dimeasure.dimeasureItems.length, 4);
		assert.deepEqual(this.oDimeasureController.getControlDataBase().dimeasure.dimeasureItems, [
			{
				columnKey: "city",
				index: 0,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "name",
				index: 1,
				visible: true,
				role: "category",
				aggregationRole: "Dimension"
			}, {
				columnKey: "number",
				index: 2,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}, {
				columnKey: "date",
				index: 3,
				visible: true,
				role: "axis1",
				aggregationRole: "Measure"
			}
		]);
	});
	QUnit.test("_onDrilledDown", function(assert) {
		var fnFireBeforePotentialTableChangeSpy = sinon.spy(this.oController, "fireBeforePotentialTableChange");
		var fnFireAfterPotentialTableChangeSpy = sinon.spy(this.oController, "fireAfterPotentialTableChange");
		var oEventStub = sinon.stub();
		oEventStub.getParameter = sinon.stub().withArgs("dimensions").returns([]);

		// act
		this.oDimeasureController._onDrilledDown(oEventStub);

		// assert
		assert.strictEqual(fnFireBeforePotentialTableChangeSpy.callCount, 1);
		assert.strictEqual(fnFireAfterPotentialTableChangeSpy.callCount, 1);
	});
	QUnit.test("_onDrilledUp", function(assert) {
		var fnFireBeforePotentialTableChangeSpy = sinon.spy(this.oController, "fireBeforePotentialTableChange");
		var fnFireAfterPotentialTableChangeSpy = sinon.spy(this.oController, "fireAfterPotentialTableChange");
		var oEventStub = sinon.stub();
		oEventStub.getParameter = sinon.stub().withArgs("dimensions").returns([]);

		// act
		this.oDimeasureController._onDrilledUp(oEventStub);

		// assert
		assert.strictEqual(fnFireBeforePotentialTableChangeSpy.callCount, 1);
		assert.strictEqual(fnFireAfterPotentialTableChangeSpy.callCount, 1);
	});

	QUnit.module("getDataSuiteFormatSnapshot", {
		afterEach: function() {
			this.oChart.destroy();
			this.oController.destroy();
		}
	});
	QUnit.test("not visible", function(assert) {
		// arrange
		this.oChart = new Chart({
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: "line",
			selectionMode: sap.chart.SelectionMode.Single,
			visibleDimensions: [],
			visibleMeasures: [],
			dimensions: [
				new Dimension({
					label: "dimension1",
					name: "a",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "a"
						}
					})
				}), new Dimension({
					label: "dimension2",
					name: "b",
					role: "series",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "b"
						}
					})
				})
			],
			measures: [
				new Measure({
					label: "measure1",
					name: "c",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "c"
						}
					})
				})
			]
		});
		this.oController = new Controller({
			table: ChartWrapper.createChartWrapper(this.oChart, [], [
				"a", "b", "c"
			]),
			setting: {
				dimeasure: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// act
		var oDataSuiteFormat = {};
		this.oController._oSettingCurrent.dimeasure.controller.getDataSuiteFormatSnapshot(oDataSuiteFormat);
		assert.deepEqual(oDataSuiteFormat, {});
	});
	QUnit.test("Visualizations: visible measure", function(assert) {
		// arrange
		this.oChart = new Chart({
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: "column",
			selectionMode: sap.chart.SelectionMode.Single,
			visibleDimensions: [],
			visibleMeasures: [
				"c"
			],
			dimensions: [],
			measures: [
				new Measure({
					label: "measure1",
					name: "c",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "c"
						}
					})
				})
			]
		});
		this.oController = new Controller({
			table: ChartWrapper.createChartWrapper(this.oChart, [], [
				"a", "b", "c"
			]),
			setting: {
				dimeasure: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// act
		var oDataSuiteFormat = {};
		this.oController._oSettingCurrent.dimeasure.controller.getDataSuiteFormatSnapshot(oDataSuiteFormat);
		// assert
		assert.deepEqual(oDataSuiteFormat, {
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [],
						DimensionAttributes: [],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		});
	});
	QUnit.test("Visualizations: visible measure and dimension", function(assert) {
		// arrange
		this.oChart = new Chart({
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: "column",
			selectionMode: sap.chart.SelectionMode.Single,
			visibleDimensions: [
				"b"
			],
			visibleMeasures: [
				"c"
			],
			dimensions: [
				new Dimension({
					label: "dimension1",
					name: "b",
					role: "series",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "b"
						}
					})
				})
			],
			measures: [
				new Measure({
					label: "measure1",
					name: "c",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "c"
						}
					})
				})
			]
		});
		this.oController = new Controller({
			table: ChartWrapper.createChartWrapper(this.oChart, [], [
				"a", "b", "c"
			]),
			setting: {
				dimeasure: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// act
		var oDataSuiteFormat = {};
		this.oController._oSettingCurrent.dimeasure.controller.getDataSuiteFormatSnapshot(oDataSuiteFormat);
		// assert
		assert.deepEqual(oDataSuiteFormat, {
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [
							"b"
						],
						DimensionAttributes: [
							{
								Dimension: "b",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
							}
						],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		});
	});
	QUnit.test("Visualizations: visible measure and dimension", function(assert) {
		// arrange
		this.oChart = new Chart({
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: sap.chart.ChartType.Column,
			selectionMode: sap.chart.SelectionMode.Single,
			visibleDimensions: [
				"b", "a"
			],
			visibleMeasures: [
				"c"
			],
			dimensions: [
				new Dimension({
					label: "dimension1",
					name: "b",
					role: "series",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "b"
						}
					})
				}), new Dimension({
					label: "dimension1",
					name: "a",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "a"
						}
					})
				})
			],
			measures: [
				new Measure({
					label: "measure1",
					name: "c",
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: "c"
						}
					})
				})
			]
		});
		this.oController = new Controller({
			table: ChartWrapper.createChartWrapper(this.oChart, [], [
				"b", "a", "c"
			]),
			setting: {
				dimeasure: {
					visible: true
				},
				sort: {
					visible: false
				},
				filter: {
					visible: false
				}
			}
		});

		// act
		var oDataSuiteFormat = {};
		this.oController._oSettingCurrent.dimeasure.controller.getDataSuiteFormatSnapshot(oDataSuiteFormat);
		// assert
		assert.deepEqual(oDataSuiteFormat, {
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [
							"b", "a"
						],
						DimensionAttributes: [
							{
								Dimension: "b",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
							}, {
								Dimension: "a",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
							}
						],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		});
	});

	QUnit.module("getDataSuiteFormat2Json: empty and not existing", {
		beforeEach: function() {
			this.oDimeasureController = new DimeasureController();
			this.oDimeasureController.initializeInternalModel(new JSONModel());
		},
		afterEach: function() {
			this.oDimeasureController.destroy();
		}
	});
	QUnit.test("empty", function(assert) {
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({}), {
			dimeasure: {
				dimeasureItems: []
			}
		});
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [],
						DimensionAttributes: [],
						Measures: [],
						MeasureAttributes: []
					}
				}
			]
		}), {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: []
			}
		});
	});
	QUnit.test("not existing column", function(assert) {
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [
							"DummyD"
						],
						DimensionAttributes: [],
						Measures: [
							"DummyM"
						],
						MeasureAttributes: []
					}
				}
			]
		}), {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						columnKey: "DummyD",
						index: 0,
						visible: true,
						aggregationRole: sap.ui.comp.personalization.AggregationRole.Dimension
					}, {
						columnKey: "DummyM",
						index: 1,
						visible: true,
						aggregationRole: sap.ui.comp.personalization.AggregationRole.Measure
					}
				]
			}
		});
	});
	QUnit.test("existing visible measure(s) and dimension(s)", function(assert) {
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [],
						DimensionAttributes: [],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		}), {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						columnKey: "c",
						index: 0,
						visible: true,
						role: "axis1",
						aggregationRole: sap.ui.comp.personalization.AggregationRole.Measure
					}
				]
			}
		});
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [
							"b"
						],
						DimensionAttributes: [
							{
								Dimension: "b",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
							}
						],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		}), {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						columnKey: "b",
						index: 0,
						visible: true,
						role: "series",
						aggregationRole: sap.ui.comp.personalization.AggregationRole.Dimension
					}, {
						columnKey: "c",
						index: 1,
						visible: true,
						role: "axis1",
						aggregationRole: sap.ui.comp.personalization.AggregationRole.Measure
					}
				]
			}
		});
		assert.deepEqual(this.oDimeasureController.getDataSuiteFormat2Json({
			Visualizations: [
				{
					Type: "Chart",
					Content: {
						ChartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
						Dimensions: [
							"b", "a"
						],
						DimensionAttributes: [
							{
								Dimension: "b",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
							}, {
								Dimension: "a",
								Role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
							}
						],
						Measures: [
							"c"
						],
						MeasureAttributes: [
							{
								Measure: "c",
								Role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
							}
						]
					}
				}
			]
		}), {
			dimeasure: {
				chartTypeKey: "column",
				dimeasureItems: [
					{
						columnKey: "b",
						index: 0,
						visible: true,
						role: "series",
						aggregationRole: sap.ui.comp.personalization.AggregationRole.Dimension
					}, {
						columnKey: "a",
						index: 1,
						visible: true,
						role: "category",
						aggregationRole: sap.ui.comp.personalization.AggregationRole.Dimension
					}, {
						columnKey: "c",
						index: 2,
						visible: true,
						role: "axis1",
						aggregationRole: sap.ui.comp.personalization.AggregationRole.Measure
					}
				]
			}
		});
	});

	QUnit.start();

});
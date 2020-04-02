/**
 * tests for the sap.suite.ui.generic.template.designtime.virtualProperties.ChartType.js
 */

sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/js/AnnotationHelper",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ChartType"
	],
	function(sinon, ChangeHandlerUtils, AnnotationHelper, DesigntimeUtils, ChartType) {
		"use strict";

		var CHARTTYPE_DONUT = "com.sap.vocabularies.UI.v1.ChartType/Donut",
			CHARTTYPE_AREA = "com.sap.vocabularies.UI.v1.ChartType/Area",
			CHARTTYPE_BULLET = "com.sap.vocabularies.UI.v1.ChartType/Bullet",
			MEASURE_ROLE_TYPE = "com.sap.vocabularies.UI.v1.ChartMeasureRoleType",
			MEASURE_ATTRIBUTE_TYPE = "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType";

		QUnit.dump.maxDepth = 20;

		/***************************************************/
		QUnit.module("The function getChartTypeValues");

		QUnit.test("getChartTypeValues", function() {
			// Arrange
			var oExpectedValue = {
				Area: {
					displayName: "Smart Area Micro Chart"
				},
				Donut: {
					displayName: "Smart Radial Micro Chart"
				},
				Bullet: {
					displayName: "Smart Bullet Micro Chart"
				}
			};

			// Act
			var oActualValue = ChartType.getChartTypeValues();

			// Assert
			assert.deepEqual(oActualValue, oExpectedValue , "returns expected values");
		});

		/***************************************************/
		QUnit.module("The function getChartType");

		QUnit.test("getChartType", function() {
			// Arrange
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn");

			// Act
			var sChartType = ChartType.getChartType(this.oColumn);

			// Assert
			assert.equal(sChartType, undefined , "returns undefined in case of a column which is no chart");

			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("getChartType", function() {
			// Arrange
			var oChart = {
				chartID: "myChart",
				entityType: {
					myChart: {
						ChartType: {
							EnumMember: CHARTTYPE_AREA
						}
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var sChartType = ChartType.getChartType(this.oColumn);

			// Assert
			assert.equal(sChartType, "Area" , "returns the chart type Area correctly");

			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("getChartType", function() {
			// Arrange
			var oChart = {
				chartID: "myChart",
				entityType: {
					myChart: {
						ChartType: {
							EnumMember: CHARTTYPE_BULLET
						}
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var sChartType = ChartType.getChartType(this.oColumn);

			// Assert
			assert.equal(sChartType, "Bullet" , "returns the chart type Bullet correctly");

			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("getChartType", function() {
			// Arrange
			var oChart = {
				chartID: "myChart",
				entityType: {
					myChart: {
						ChartType: {
							EnumMember: CHARTTYPE_DONUT
						}
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var sChartType = ChartType.getChartType(this.oColumn);

			// Assert
			assert.equal(sChartType, "Donut" , "returns the chart type Donut correctly");

			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("getChartType", function() {
			// Arrange
			var oChart = {
				chartID: "myChart",
				entityType: {
					myChart: {
						ChartType: {
							EnumMember: "AnyOther"
						}
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);


			// Act
			var sChartType = ChartType.getChartType(this.oColumn);

			// Assert
			assert.equal(sChartType, undefined , "returns undefined in case of an invalid chart type");

			this.oGetChartFromColumnStub.restore();
		});

		/***************************************************/
		QUnit.module("The function setChartType", {

			beforeEach: function() {
				this.oGetComponentStub = sinon.stub(ChangeHandlerUtils, "getComponent");
				this.oGetEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getEntityType").returns("ns.MyEntityType");
				this.oCreateP13NColumnKeyStub = sinon.stub(AnnotationHelper, "createP13NColumnKey").returns("myColumnKey");
				this.oColumn = {
					chartID: "com.sap.vocabularies.UI.v1.Chart",
					data: function() {
						return {
							columnKey: "currentKey"
						};
					}
				};
				this.oChange = {};
			},
			afterEach: function() {
				this.oGetComponentStub.restore();
				this.oGetEntityTypeStub.restore();
				this.oCreateP13NColumnKeyStub.restore();
			}
		});

		QUnit.test("setChartType", function() {
			// Arrange
			var sNewChartType = "Area",
				sOldChartType = "Area";
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(sOldChartType);

			var oOldChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: undefined
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oOldChart);

			// Act
			var aCustomChanges = ChartType.setChartType(this.oColumn, sNewChartType, this.oChange);

			// Assert
			assert.deepEqual(aCustomChanges, [] , "returns no change if old chart type = new chart type");
			assert.notOk(this.oChange.refreshPropertiesPane, "no refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			this.oGetChartTypeStub.restore();
			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("setChartType", function() {
			// Arrange
			var sNewChartType = "",
				sOldChartType = "Area";
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(sOldChartType);

			var oOldChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: undefined
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oOldChart);

			// Act
			var aCustomChanges = ChartType.setChartType(this.oColumn, sNewChartType, this.oChange);

			// Assert
			assert.deepEqual(aCustomChanges, [] , "returns no change if new chart type is empty");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetChartTypeStub.restore();
			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("setChartType", function() {
			// Arrange
			var sNewChartType = "Donut",
				sOldChartType = "Area";
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(sOldChartType);

			var oOldChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						Title: "Old Title",
						Description: "Old description",
						ChartType: {EnumMember: CHARTTYPE_AREA},
						Dimensions: [{
							PropertyPath: "Volume"
						}],
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure:  {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role:  {
								EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
							}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oOldChart);

			// Act
			var aCustomChanges = ChartType.setChartType(this.oColumn, sNewChartType, this.oChange);

			// Assert
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								Description: "Old description",
								ChartType: {EnumMember: CHARTTYPE_DONUT},
								Measures: [{
									PropertyPath: "Product"
								}],
								MeasureAttributes: [{
									Measure: {PropertyPath: "Product"},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE  + "/Axis1"
									}
								}]
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								Title: "Old Title",
								Description: "Old description",
								ChartType: {EnumMember: CHARTTYPE_AREA},
								Dimensions: [{
									PropertyPath: "Volume"
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								MeasureAttributes: [{
									Measure: {PropertyPath: "Product"},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
								}]
							}
						}
					}
				}
			}];
			assert.deepEqual(aCustomChanges, aExpectedChanges, "returns the right change when switching from Area to Donut");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetChartTypeStub.restore();
			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("setChartType", function() {
			// Arrange
			var sNewChartType = "Donut",
				sOldChartType = "";
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(sOldChartType);

			var oOldChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: undefined
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oOldChart);

			// Act
			var aCustomChanges = ChartType.setChartType(this.oColumn, sNewChartType, this.oChange);

			// Assert
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: undefined
				}
			}];
			assert.deepEqual(aCustomChanges, aExpectedChanges, "returns the right change when switching to Area, chart was undefined before");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetChartTypeStub.restore();
			this.oGetChartFromColumnStub.restore();
		});


		QUnit.test("setChartType", function() {
			// Arrange
			var sNewChartType = "Bullet",
				sOldChartType = "Area";
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(sOldChartType);

			var oOldChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart#BulletChartQualifierC",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart#BulletChartQualifierC": {
						Title: "Old Title",
						Description: "Old description",
						ChartType: {EnumMember: CHARTTYPE_AREA},
						Dimensions: [{
							PropertyPath: "Volume"
						}],
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oOldChart);

			// Act
			var aCustomChanges = ChartType.setChartType(this.oColumn, sNewChartType, this.oChange);

			// Assert
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart#BulletChartQualifierC": {
								Description: "Old description",
								ChartType: {EnumMember: CHARTTYPE_BULLET},
								Measures: [{
									PropertyPath: "Product"
								}],
								MeasureAttributes: [{
									Measure: {PropertyPath: "Product"},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
								}]
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart#BulletChartQualifierC": {
								Title: "Old Title",
								Description: "Old description",
								ChartType: {EnumMember: CHARTTYPE_AREA},
								Dimensions: [{
									PropertyPath: "Volume"
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								MeasureAttributes: [{
									Measure: {PropertyPath: "Product"},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
								}]
							}
						}
					}
				}
			}];
			assert.deepEqual(aCustomChanges, aExpectedChanges, "returns the right change when switching from Area to Bullet, chart with qualifier");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetChartTypeStub.restore();
			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("setChartType", function() {
			// Arrange
			var sNewChartType = "Bullet",
				sOldChartType = "Donut";
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(sOldChartType);

			var oOldChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						Title: "Old Title",
						Description: "Old description",
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oOldChart);

			// Act
			var aCustomChanges = ChartType.setChartType(this.oColumn, sNewChartType, this.oChange);

			// Assert
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								Description: "Old description",
								ChartType: {EnumMember: CHARTTYPE_BULLET},
								Measures: [{
									PropertyPath: "Product"
								}],
								MeasureAttributes: [{
									Measure: {PropertyPath: "Product"},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
								}]
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								Title: "Old Title",
								Description: "Old description",
								ChartType: {EnumMember: CHARTTYPE_DONUT},
								Measures: [{
									PropertyPath: "Product"
								}],
								MeasureAttributes: [{
									Measure: {PropertyPath: "Product"},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
								}]
							}
						}
					}
				}
			}];
			assert.deepEqual(aCustomChanges, aExpectedChanges, "returns the right change when switching from Donut to Bullet");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetChartTypeStub.restore();
			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("setChartType", function() {
			// Arrange
			var sNewChartType = "Area",
				sOldChartType = "Bullet";
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(sOldChartType);

			var oOldChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						Title: "Old Title",
						Description: "Old description",
						ChartType: {EnumMember: CHARTTYPE_BULLET},
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oOldChart);

			// Act
			var aCustomChanges = ChartType.setChartType(this.oColumn, sNewChartType, this.oChange);

			// Assert
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								Description: "Old description",
								ChartType: {EnumMember: CHARTTYPE_AREA},
								Dimensions: undefined,
								Measures: [{
									PropertyPath: "Product"
								}],
								MeasureAttributes: [{
									Measure: {PropertyPath: "Product"},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
								}]
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								Title: "Old Title",
								Description: "Old description",
								ChartType: {EnumMember: CHARTTYPE_BULLET},
								Measures: [{
									PropertyPath: "Product"
								}],
								MeasureAttributes: [{
									Measure: {PropertyPath: "Product"},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
								}]
							}
						}
					}
				}
			}];
			assert.deepEqual(aCustomChanges, aExpectedChanges, "returns the right change when switching from Bullet to Area");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetChartTypeStub.restore();
			this.oGetChartFromColumnStub.restore();
		});

	});

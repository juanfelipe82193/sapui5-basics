/**
 * tests for the sap.suite.ui.generic.template.designtime.virtualProperties.ChartMeasures.js
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/js/AnnotationHelper",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ChartMeasures"
	],
	function(sinon, ChangeHandlerUtils, AnnotationHelper, DesigntimeUtils, ChartMeasures) {
		"use strict";

		var CHARTTYPE_DONUT = "com.sap.vocabularies.UI.v1.ChartType/Donut",
			CHARTTYPE_AREA = "com.sap.vocabularies.UI.v1.ChartType/Area",
			CHARTTYPE_BULLET = "com.sap.vocabularies.UI.v1.ChartType/Bullet",
			DATAPOINT = "com.sap.vocabularies.UI.v1.DataPoint",
			MEASURE_ROLE_TYPE = "com.sap.vocabularies.UI.v1.ChartMeasureRoleType",
			MEASURE_ATTRIBUTE_TYPE = "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType";

		QUnit.dump.maxDepth = 20;

		/***************************************************/
		QUnit.module("The function getMeasureDefinition");

		QUnit.test("getMeasureDefinition", function() {
			// Arrange
			var oColumn = {};

			// Act
			var oActualValue = ChartMeasures.getMeasureDefinition(oColumn);

			// Assert
			var oExpectedValue = {
				Measure: {
					displayName: "Measure",
					type: "Edm.PropertyPath",
					nullable: false,
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart"
				},
				Role: {
					displayName: "Role",
					type: "EnumType",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					possibleValues: {
						Axis1: {
							displayName: "Axis 1"
						},
						Axis2: {
							displayName: "Axis 2"
						},
						Axis3: {
							displayName: "Axis 3"
						}
					}
				},
				DataPointAnnotationPath: {
					displayName: "Data Point Reference",
					type: "Edm.AnnotationPath",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					refersTo: {
						annotation: "DataPoint",
						namespace: "com.sap.vocabularies.UI.v1"
					}
				}
			};
			assert.deepEqual(oActualValue, oExpectedValue , "returns MeasureAttribute values only if no chart exists yet");
		});

		QUnit.test("getMeasureDefinition", function() {
			// Arrange
			var oColumn = {};
			var oChart = {
				chartID: "myChart",
				entityType: {
					myChart: {
						ChartType: {
							EnumMember: "anyOther"
						}
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);

			// Act
			var oActualValue = ChartMeasures.getMeasureDefinition(oColumn);

			// Assert
			var oExpectedValue = {
				Measure: {
					displayName: "Measure",
					type: "Edm.PropertyPath",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					nullable: false
				},
				Role: {
					displayName: "Role",
					type: "EnumType",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					possibleValues: {
						Axis1: {
							displayName: "Axis 1"
						},
						Axis2: {
							displayName: "Axis 2"
						},
						Axis3: {
							displayName: "Axis 3"
						}
					}
				},
				DataPointAnnotationPath: {
					displayName: "Data Point Reference",
					type: "Edm.AnnotationPath",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					refersTo: {
						annotation: "DataPoint",
						namespace: "com.sap.vocabularies.UI.v1"
					}
				}
			};
			assert.deepEqual(oActualValue, oExpectedValue , "returns MeasureAttribute values only if the chart type fits");

			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("getMeasureDefinition for area chart", function() {
			// Arrange
			var oColumn = {};
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
			this.oGetChartFromParentStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var oActualValue = ChartMeasures.getMeasureDefinition(oColumn);

			// Assert
			var oExpectedValue = {
				Measure: {
					displayName: "Measure",
					type: "Edm.PropertyPath",
					nullable: false,
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart"
				},
				Role: {
					displayName: "Role",
					type: "EnumType",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					nullable: false,
					possibleValues: {
						Axis1: {
							displayName: "Axis 1"
						},
						Axis2: {
							displayName: "Axis 2"
						},
						Axis3: {
							displayName: "Axis 3"
						}
					}
				},
				DataPointAnnotationPath: {
					displayName: "Data Point Reference",
					type: "Edm.AnnotationPath",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					refersTo: {
						annotation: "DataPoint",
						namespace: "com.sap.vocabularies.UI.v1"
					}
				},
				DataPoint : {
					displayName: "Data Point Properties",
					type: "ComplexType",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataPoint",
					whiteList: {
						properties: [
							"Value",
							"TargetValue",
							"CriticalityCalculation"
						],
						mandatory: [
							"Value",
							"TargetValue"
						],
						CriticalityCalculation: {
							properties: [
								"ImprovementDirection",
								"DeviationRangeLowValue",
								"DeviationRangeHighValue",
								"ToleranceRangeLowValue",
								"ToleranceRangeHighValue"
							],
							expressionTypes: {
								"DeviationRangeLowValue": ["Path"],
								"DeviationRangeHighValue": ["Path"],
								"ToleranceRangeLowValue": ["Path"],
								"ToleranceRangeHighValue": ["Path"]
							}
						},
						expressionTypes: {
							Value: ["Path"],
							TargetValue: ["Path", "String", "Int", "Decimal"]
						}
					}
				}
			};
			assert.deepEqual(oActualValue, oExpectedValue , "returns measure attributes plus datapoint for area chart");

			this.oGetChartFromParentStub.restore();
		});

		QUnit.test("getMeasureDefinition for bullet chart", function() {
			// Arrange
			var oColumn = {};
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
			this.oGetChartFromParentStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var oActualValue = ChartMeasures.getMeasureDefinition(oColumn);

			// Assert
			var oExpectedValue = {
				Measure: {
					displayName: "Measure",
					nullable: false,
					type: "Edm.PropertyPath",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart"
				},
				Role: {
					displayName: "Role",
					type: "EnumType",
					nullable: true,
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					possibleValues: {
						Axis1: {
							displayName: "Axis 1"
						},
						Axis2: {
							displayName: "Axis 2"
						},
						Axis3: {
							displayName: "Axis 3"
						}
					}
				},
				DataPointAnnotationPath: {
					displayName: "Data Point Reference",
					type: "Edm.AnnotationPath",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					refersTo: {
						annotation: "DataPoint",
						namespace: "com.sap.vocabularies.UI.v1"
					}
				},
				DataPoint : {
					displayName: "Data Point Properties",
					type: "ComplexType",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataPoint",
					whiteList: {
						properties: [
							"Value",
							"TargetValue",
							"ForecastValue",
							"MinimumValue",
							"MaximumValue",
							"Criticality",
							"CriticalityCalculation"
						],
						mandatory: [
							"Value"
						],
						CriticalityCalculation: {
							properties: [
								"ImprovementDirection",
								"DeviationRangeLowValue",
								"DeviationRangeHighValue",
								"ToleranceRangeLowValue",
								"ToleranceRangeHighValue"
							],
							expressionTypes: {
								"DeviationRangeLowValue": ["Path"],
								"DeviationRangeHighValue": ["Path"],
								"ToleranceRangeLowValue": ["Path"],
								"ToleranceRangeHighValue": ["Path"]
							}
						},
						expressionTypes: {
							Criticality: ["Path"],
							Value: ["Path"],
							"ForecastValue": [
								"Path",
								"String",
								"Int",
								"Decimal"
							],
							"TargetValue": [
								"Path",
								"String",
								"Int",
								"Decimal"
							]
						}
					}
				}
			};
			assert.deepEqual(oActualValue, oExpectedValue , "returns measure attributes plus datapoint for a bullet chart");

			this.oGetChartFromParentStub.restore();
		});

		QUnit.test("getMeasureDefinition for area chart", function() {
			// Arrange
			var oColumn = {};
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
			this.oGetChartFromParentStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var oActualValue = ChartMeasures.getMeasureDefinition(oColumn);

			// Assert
			var oExpectedValue = {
				Measure: {
					displayName: "Measure",
					type: "Edm.PropertyPath",
					nullable: false,
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart"
				},
				Role: {
					displayName: "Role",
					type: "EnumType",
					nullable: false,
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					possibleValues: {
						Axis1: {
							displayName: "Axis 1"
						},
						Axis2: {
							displayName: "Axis 2"
						},
						Axis3: {
							displayName: "Axis 3"
						}
					}
				},
				DataPointAnnotationPath: {
					displayName: "Data Point Reference",
					type: "Edm.AnnotationPath",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					refersTo: {
						annotation: "DataPoint",
						namespace: "com.sap.vocabularies.UI.v1"
					}
				},
				DataPoint : {
					displayName: "Data Point Properties",
					type: "ComplexType",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataPoint",
					whiteList: {
						properties: [
							"Value",
							"TargetValue",
							"CriticalityCalculation"
						],
						mandatory: [
							"Value",
							"TargetValue"
						],
						CriticalityCalculation: {
							properties: [
								"ImprovementDirection",
								"DeviationRangeLowValue",
								"DeviationRangeHighValue",
								"ToleranceRangeLowValue",
								"ToleranceRangeHighValue"
							],
							expressionTypes: {
								"DeviationRangeLowValue": ["Path"],
								"DeviationRangeHighValue": ["Path"],
								"ToleranceRangeLowValue": ["Path"],
								"ToleranceRangeHighValue": ["Path"]
							}
						},
						expressionTypes: {
							Value: ["Path"],
							TargetValue: ["Path", "String", "Int", "Decimal"]
						}
					}
				}
			};
			assert.deepEqual(oActualValue, oExpectedValue , "returns measure attributes plus datapoint for an area chart");

			this.oGetChartFromParentStub.restore();
		});

		QUnit.test("getMeasureDefinition", function() {
			// Arrange
			var oColumn = {};
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
			this.oGetChartFromParentStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var oActualValue = ChartMeasures.getMeasureDefinition(oColumn);

			// Assert
			var oExpectedValue = {
				Measure: {
					displayName: "Measure",
					type: "Edm.PropertyPath",
					nullable: false,
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart"
				},
				Role: {
					displayName: "Role",
					type: "EnumType",
					nullable: true,
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					possibleValues: {
						Axis1: {
							displayName: "Axis 1"
						},
						Axis2: {
							displayName: "Axis 2"
						},
						Axis3: {
							displayName: "Axis 3"
						}
					}
				},
				DataPointAnnotationPath: {
					displayName: "Data Point Reference",
					type: "Edm.AnnotationPath",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					refersTo: {
						annotation: "DataPoint",
						namespace: "com.sap.vocabularies.UI.v1"
					}
				},
				DataPoint : {
					displayName: "Data Point Properties",
					type: "ComplexType",
					annotation: "DataPoint",
					namespace: "com.sap.vocabularies.UI.v1",
					whiteList: {
						properties: [
							"Value",
							"TargetValue",
							"Criticality",
							"CriticalityCalculation"
						],
						mandatory: [
							"Value"
						],
						CriticalityCalculation: {
							properties: [
								"ImprovementDirection",
								"DeviationRangeLowValue",
								"DeviationRangeHighValue",
								"ToleranceRangeLowValue",
								"ToleranceRangeHighValue"
							],
							expressionTypes: {
								"DeviationRangeLowValue": ["Path"],
								"DeviationRangeHighValue": ["Path"],
								"ToleranceRangeLowValue": ["Path"],
								"ToleranceRangeHighValue": ["Path"]
							}
						},
						expressionTypes: {
							Criticality: ["Path"],
							Value: ["Path"],
							TargetValue: ["Path", "String", "Int", "Decimal"]
						}
					}
				}
			};
			assert.deepEqual(oActualValue, oExpectedValue , "returns measure attributes plus datapoint for an donut chart");

			this.oGetChartFromParentStub.restore();
		});

		/***************************************************/
		QUnit.module("The function setMeasures", {
			beforeEach: function() {
				ChartMeasures._setPostponedRetemplating(false);
				this.oDataEntityTypeStub = {
					namespace: "ns",
					name: "MyEntityType"
				};
				this.oChange = {};
				this.oGetODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(this.oDataEntityTypeStub);
				this.oGetEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getEntityType").returns("MyEntityType");
			},
			afterEach: function() {
				this.oGetODataEntityTypeStub.restore();
				this.oGetEntityTypeStub.restore();
			}
		});

		QUnit.test("noRefreshOnChange gets overwritten when setMeasures was called with it being true and delayRefresh being true.", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: {PropertyPath: "Product"}
			}];
			this.oChange.delayRefresh = true;
			this.oChange.noRefreshOnChange = true;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}, {
							PropertyPath: "Sales"
						}],
						MeasureAttributes: []
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);

			// Assert
			assert.notOk(this.oChange.noRefreshOnChange, "A re-templating will be triggered because of delayRefresh.");
			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("noRefreshOnChange does not get overwritten when setMeasures was called with it being true and delayRefresh being false.", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: {PropertyPath: "Product"}
			}];
			this.oChange.noRefreshOnChange = true;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}, {
							PropertyPath: "Sales"
						}],
						MeasureAttributes: []
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);

			// Assert
			assert.ok(this.oChange.noRefreshOnChange, "No refresh on change, because if oChange.noRefreshOnChange is true when setMeasures was called, it shall not be overwritten.");
			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("Adds a new measure without re-templating", function () {
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{Measure: { PropertyPath: "" }}];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: { EnumMember: CHARTTYPE_DONUT },
						Measures: []
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: ""
									},
									Measure: {
										PropertyPath: ""
									},
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: {
										EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
									}
								}],
								Measures: [{ PropertyPath: "" }],
								ChartType: { EnumMember: CHARTTYPE_DONUT }
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								Measures: [],
								ChartType: { EnumMember: CHARTTYPE_DONUT }
							}
						}
					}
				}
			}];

			// Assert
			assert.ok(this.oChange.noRefreshOnChange, "There won't be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "No MeasureAttributes available, setting axis to default.");
			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("Adds a new measure and automatically sets the axis to Axis2 when Axis1 and Axis3 are already in use", function () {
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: { PropertyPath: "Currency" },
				Role: { EnumMember: "Axis1" }
			}, {
				Measure: { PropertyPath: "Product" },
				Role: { EnumMember: "Axis3" }
			}, {
				Measure: { PropertyPath: "" }
			}];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: { EnumMember: CHARTTYPE_DONUT },
						Measures: [{
							PropertyPath: "Currency"
						},	{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: { PropertyPath: "Currency" },
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis1" },
							DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Currency" }
						}, {
							Measure: { PropertyPath: "Product" },
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis3" },
							DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Product" }
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
					changeType: "annotationTermChange",
					content: {
						newValue: {
							"ns.MyEntityType": {
								"com.sap.vocabularies.UI.v1.DataPoint#Currency": {
									CriticalityCalculation: {
										ImprovementDirection: {
											EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
										},
										RecordType: "com.sap.vocabularies.UI.v1.CriticalityCalculationType"
									},
									RecordType: "com.sap.vocabularies.UI.v1.DataPointType",
									Value: {
										Path: "Currency"
									}
								}
							}
						},
						oldValue: undefined
					}
				}, {
					changeType: "annotationTermChange",
					content: {
						newValue: {
							"ns.MyEntityType": {
								"com.sap.vocabularies.UI.v1.DataPoint#Product": {
									CriticalityCalculation: {
										ImprovementDirection: {
											"EnumMember": "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
										},
										RecordType: "com.sap.vocabularies.UI.v1.CriticalityCalculationType"
									},
									RecordType: "com.sap.vocabularies.UI.v1.DataPointType",
									Value: {
										Path: "Product"
									}
								}
							}
						},
						oldValue: undefined
					}
				}, {
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Currency" },
									Measure: { PropertyPath: "Currency" },
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: { EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1" }
								}, {
									DataPoint: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Product" },
									Measure: { PropertyPath: "Product" },
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: { EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3" }
								}, {
									DataPoint: { AnnotationPath: "" },
									Measure: { PropertyPath: "" },
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: { EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2" }
								}],
								Measures: [
									{ PropertyPath: "Currency" },
									{ PropertyPath: "Product" },
									{ PropertyPath: "" }
								],
								ChartType: { EnumMember: CHARTTYPE_DONUT }
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Currency" },
									Measure: { PropertyPath: "Currency" },
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis1" }
								}, {
									DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Product" },
									Measure: { PropertyPath: "Product" },
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis3" }
								}],
								Measures: [{
									PropertyPath: "Currency"
								}, {
									PropertyPath: "Product"
								}],
								ChartType: { EnumMember: CHARTTYPE_DONUT }
							}
						}
					}
				}
			}];

			// Assert
			assert.ok(this.oChange.noRefreshOnChange, "There won't be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "The axis of the new measure has been set to the last possible axis.");
			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("Adds a new measure and sets axis to default since all available axis are in use", function () {
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: { PropertyPath: "Currency" },
				Role: { EnumMember: "Axis1" }
			}, {
				Measure: { PropertyPath: "Product" },
				Role: { EnumMember: "Axis2" }
			}, {
				Measure: { PropertyPath: "TargetPrice" },
				Role: { EnumMember: "Axis3" }
			}, {
				Measure: { PropertyPath: "" }
			}];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: { EnumMember: CHARTTYPE_DONUT },
						Measures: [{
							PropertyPath: "Currency"
						}, {
							PropertyPath: "Product"
						}, {
							PropertyPath: "TargetPrice"
						}],
						MeasureAttributes: [{
							Measure: { PropertyPath: "Currency" },
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis1" },
							DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Currency" }
						}, {
							Measure: { PropertyPath: "Product" },
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis2" },
							DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Product" }
						}, {
							Measure: { PropertyPath: "TargetPrice" },
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis3" },
							DataPoint: { AnnotationPath: "@" + DATAPOINT + "#TargetPrice" }
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Currency"},
									Measure: { PropertyPath: "Currency"	},
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: { EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1" }
								}, {
									DataPoint: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Product" },
									Measure: { PropertyPath: "Product" },
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: { EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2" }
								}, {
									DataPoint: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#TargetPrice" },
									Measure: { PropertyPath: "TargetPrice" },
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: { EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3"	}
								}, {
									DataPoint: { AnnotationPath: "" },
									Measure: { PropertyPath: "" },
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: { EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3" }
								}],
								Measures: [
									{ PropertyPath: "Currency" },
									{ PropertyPath: "Product" },
									{ PropertyPath: "TargetPrice" },
									{ PropertyPath: "" }
								],
								ChartType: { EnumMember: CHARTTYPE_DONUT }
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Currency" },
									Measure: { PropertyPath: "Currency" },
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis1" }
								}, {
									DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Product" },
									Measure: { PropertyPath: "Product" },
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis2" }
								}, {
									DataPoint: { AnnotationPath: "@" + DATAPOINT + "#TargetPrice" },
									Measure: { PropertyPath: "TargetPrice" },
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis3" }
								}],
								Measures: [{
									PropertyPath: "Currency"
								}, {
									PropertyPath: "Product"
								}, {
									PropertyPath: "TargetPrice"
								}],
								ChartType: { EnumMember: CHARTTYPE_DONUT }
							}
						}
					}
				}
			}];

			// Assert
			assert.ok(this.oChange.noRefreshOnChange, "There won't be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "The axis of the new measure has been set to the default axis, since all of them are already in use.");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Adds a new measure and sets axis depending on the previous axis", function () {
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: { PropertyPath: "Currency" },
				Role: { EnumMember: "Axis3" }
			}, {
				Measure: { PropertyPath: "" }
			}
			];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: { EnumMember: CHARTTYPE_DONUT },
						Measures: [{ PropertyPath: "Currency" }],
						MeasureAttributes: [{
							Measure: { PropertyPath: "Currency" },
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis3" },
							DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Currency" }
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");


			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Currency" },
									Measure: { PropertyPath: "Currency" },
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis3" }
								}, {
									DataPoint: { AnnotationPath: "" },
									Measure: { PropertyPath: "" },
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis1" }
								}],
								Measures: [
									{ PropertyPath: "Currency" },
									{ PropertyPath: "" }
								],
								ChartType: { EnumMember: CHARTTYPE_DONUT }
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: { AnnotationPath: "@" + DATAPOINT + "#Currency" },
									Measure: { PropertyPath: "Currency" },
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis3" }
								}],
								Measures: [{ PropertyPath: "Currency" }],
								ChartType: { EnumMember: CHARTTYPE_DONUT }
							}
						}
					}
				}
			}];

			// Assert
			assert.ok(this.oChange.noRefreshOnChange, "There won't be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "The axis of the new measure has been set depending on the previous measure axis.");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Adds a new measure without re-templating", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: { PropertyPath: "" }
			}];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: { EnumMember: CHARTTYPE_DONUT },
						Measures: [{ PropertyPath: "TargetPrice" }],
						MeasureAttributes: [{
							Measure: { PropertyPath: "TargetPrice" },
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis1" },
							DataPoint: { AnnotationPath: "@" + DATAPOINT + "#TargetPrice" }
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: { "AnnotationPath": "" },
									Measure: { "PropertyPath": "" },
									RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Role: { "EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2" }
								}],
								Measures: [{ PropertyPath: "" }],
								ChartType: { EnumMember: CHARTTYPE_DONUT }
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: { AnnotationPath: "@" + DATAPOINT + "#TargetPrice" },
									Measure: { PropertyPath: "TargetPrice" },
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: { EnumMember: MEASURE_ROLE_TYPE + "/Axis1" }
								}],
								Measures: [{ PropertyPath: "TargetPrice" }],
								ChartType: { EnumMember: CHARTTYPE_DONUT }
							}
						}
					}
				}
			}];

			// Assert
			assert.ok(this.oChange.noRefreshOnChange, "There won't be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "adds a new measure");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Adds a new measure when an empty object is handed over without re-templating", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [
				{},
				{
					Measure: {PropertyPath: "Product"},
					Role: {EnumMember: "Axis1"},
					DataPointAnnotationPath: {AnnotationPath: "@" + DATAPOINT + "#Product2"}
				}
			];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"},
							DataPoint: {AnnotationPath: "@" + DATAPOINT + "#Product"}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product2"
									},
									Measure: {
										PropertyPath: "Product"
									},
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE
								}, {
									DataPoint: {
										AnnotationPath: ""
									},
									Measure: {
										PropertyPath: ""
									},
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis2"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE
								}],
								Measures: [{
									PropertyPath: "Product"
								}, {
									PropertyPath: ""
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product"
									},
									Measure: {
										PropertyPath: "Product"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					}
				}
			}];

			// Assert
			assert.ok(this.oChange.noRefreshOnChange, "There will be no refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "creates a new measure if one empty new measure is passed");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Deletes measure with empty mandatory fields without re-templating", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: ""
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: ""},
							RecordType: MEASURE_ATTRIBUTE_TYPE
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [],
								Measures: [],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									Measure: {
										PropertyPath: ""
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE
								}],
								Measures: [{
									PropertyPath: ""
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					}
				}
			}];

			// Assert
			assert.ok(this.oChange.noRefreshOnChange, "There will be no refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "deletes one measure that has its mandatory fields empty.");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Deletes measure and keeps an empty measure, postpone re-templating", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: {PropertyPath: ""}
			}];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}, {
							PropertyPath: ""
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"},
							DataPoint: {AnnotationPath: "@" + DATAPOINT + "#Product"}
						}, {
							Measure: {PropertyPath: ""},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis2"}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									Measure: {PropertyPath: ""},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									DataPoint: {AnnotationPath: ""},
									Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis3"}
								}],
								Measures: [{
									PropertyPath: ""
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {AnnotationPath: "@" + DATAPOINT + "#Product"},
									Measure: {PropertyPath: "Product"},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
								}, {
									Measure: {PropertyPath: ""},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis2"}
								}],
								Measures: [{
									PropertyPath: "Product"
								}, {
									PropertyPath: ""
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					}
				}
			}];

			// Assert
			assert.ok(this.oChange.noRefreshOnChange, "There will be no refresh on this change.");
			assert.ok(ChartMeasures._getPostponedRetemplating, "The re-templating will be postponed.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "Deletes one measure with another measure having its mandatory fields empty remaining.");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Deletes empty measure and sets noRefreshOnChange false because there is a postponed re-templating", function() {
			// Arrange
			ChartMeasures._setPostponedRetemplating(true);
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: ""
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: ""},
							RecordType: MEASURE_ATTRIBUTE_TYPE
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [],
								Measures: [],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									Measure: {
										PropertyPath: ""
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE
								}],
								Measures: [{
									PropertyPath: ""
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					}
				}
			}];

			// Assert
			assert.notOk(this.oChange.noRefreshOnChange, "There will be a refresh on this change.");
			assert.notOk(ChartMeasures._getPostponedRetemplating(), "The postponed re-templating will be applied, therefore bPostponedRetemplating is set to false.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "Deletes one measure that has its mandatory fields empty.");

			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Deletes measure without any other measures remaining, re-templating required", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"},
							DataPoint: {AnnotationPath: "@" + DATAPOINT + "#Product"}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [],
								Measures: [],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product"
									},
									Measure: {
										PropertyPath: "Product"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					}
				}
			}];

			// Assert
			assert.notOk(this.oChange.noRefreshOnChange, "There will be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "deletes all existing measures if no new measures are passed");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Deletes measure with one other measure remaining, re-templating required", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: {PropertyPath: "Product"},
				Role: {EnumMember: "Axis1"},
				DataPointAnnotationPath: {AnnotationPath: "@" + DATAPOINT + "#Product2"}
			}];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}, {
							PropertyPath: "Sales"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"},
							DataPoint: {AnnotationPath: "@" + DATAPOINT + "#Product"}
						}, {
							Measure: {PropertyPath: "Sales"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis2"},
							DataPoint: {AnnotationPath: "@" + DATAPOINT + "#Sales"}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product2"
									},
									Measure: {
										PropertyPath: "Product"
									},
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product"
									},
									Measure: {
										PropertyPath: "Product"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								}, {
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Sales"
									},
									Measure: {
										PropertyPath: "Sales"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis2"
									}
								}],
								Measures: [{
									PropertyPath: "Product"
								}, {
									PropertyPath: "Sales"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					}
				}
			}];

			// Assert
			assert.notOk(this.oChange.noRefreshOnChange, "There will be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "deletes one existing measure if only one new measure is passed");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Updates one entry and inserts a second one, no change of datapoint, re-templating required", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: {PropertyPath: "Product"},
				Role: {EnumMember: "Axis1"},
				DataPointAnnotationPath: {AnnotationPath: "@" + DATAPOINT + "#Product2"}
			},{
				Measure: {PropertyPath: "Sales"},
				Role: {EnumMember: "Axis2"},
				DataPointAnnotationPath: {AnnotationPath: "@" + DATAPOINT + "#Sales"}
			}];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"},
							DataPoint: {AnnotationPath: "@" + DATAPOINT + "#Product"}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product2"
									},
									Measure: {
										PropertyPath: "Product"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								},{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Sales"
									},
									Measure: {
										PropertyPath: "Sales"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis2"
									}
								}],
								Measures: [{
									PropertyPath: "Product"
								}, {
									PropertyPath: "Sales"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product"
									},
									Measure: {
										PropertyPath: "Product"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					}
				}
			}];

			// Assert
			assert.notOk(this.oChange.noRefreshOnChange, "There will be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "updates one entry and inserts a second one, no change of datapoint");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Updates the DataPoint without adding or deleting any measures, re-templating required", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: {PropertyPath: "Product"},
				Role: {EnumMember: "Axis1"},
				DataPointAnnotationPath: {AnnotationPath: "@" + DATAPOINT + "#Product2"},
				DataPoint: {
					Criticality: {
						Path: "SalesValueAddedTax",
						EdmType: "Edm.Byte"
					},
					Description: {String: "Bullet Micro Chart"},
					Value: {Path: "Product"}
				}
			}];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"},
							DataPoint: {AnnotationPath: "@" + DATAPOINT + "#Product"}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");
			this.oGetComponentStub = sinon.stub(ChangeHandlerUtils, "getComponent");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product2"
									},
									Measure: {
										PropertyPath: "Product"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product"
									},
									Measure: {
										PropertyPath: "Product"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					}
				}
			}];

			// Assert
			assert.notOk(this.oChange.noRefreshOnChange, "There will be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "updates one entry and inserts a second one, no change of datapoint");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
			this.oGetComponentStub.restore();
		});

		QUnit.test("Updates the DataPoint but no other data, re-tempalting postponed ", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"},
							DataPoint: {},
							DataPointAnnotationPath: {AnnotationPath: "@" + DATAPOINT + "#Product2"}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			var aNewMeasures = [{
				Measure: {PropertyPath: "Product"},
				Role: {EnumMember: "Axis1"},
				DataPoint: {
					Criticality: {
						Path: "SalesValueAddedTax",
						EdmType: "Edm.Byte"
					},
					Description: {String: "Bullet Micro Chart"},
					Value: {Path: "Product"}
				},
				DataPointAnnotationPath: {AnnotationPath: "@" + DATAPOINT + "#Product2"}
			}];
			this.oChange.noRefreshOnChange = false;

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				"changeType": "annotationTermChange",
				"content": {
					"newValue": {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								"ChartType": {
								"EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Donut"
								},
								"MeasureAttributes": [{
									"DataPoint": {
										"AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Product2"
									},
									"Measure": {
										"PropertyPath": "Product"
									},
									"RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									"Role": {
										"EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
									}
								}],
								"Measures": [{
									"PropertyPath": "Product"
								}]
							}
						}
					},
					"oldValue": {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								"ChartType": {
									"EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Donut"
								},
								"MeasureAttributes": [{
									"DataPoint": {},
									"DataPointAnnotationPath": {
										"AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Product2"
									},
									"Measure": {
										"PropertyPath": "Product"
									},
									"Role": {
										"EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
									}
								}],
								"Measures": [{
									"PropertyPath": "Product"
								}]
							}
						}
					}
				}
			}];

			// Assert
			assert.notOk(this.oChange.noRefreshOnChange, "There will be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "returns the same amount of Measures and MeasureAttributes but actualizes the DataPoint");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Fills the DataPoint while the Measure is still empty, re-tempalting postponed ", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: ""
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: ""},
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"},
							DataPoint: {},
							DataPointAnnotationPath: {}
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");

			var aNewMeasures = [{
				DataPoint: {},
				DataPointAnnotationPath: {AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Product"},
				Measure: {PropertyPath: ""},
				Role: {EnumMember: "Axis1"}
			}];
			this.oChange.noRefreshOnChange = true;

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				"changeType": "annotationTermChange",
				"content": {
					"newValue": {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								"ChartType": {
									"EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Donut"
								},
								"MeasureAttributes": [{
									"DataPoint": {
										"AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Product"
									},
									"Measure": {
										"PropertyPath": ""
									},
									"RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									"Role": {
										"EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
									}
								}],
								"Measures": [{
									"PropertyPath": ""
								}]
							}
						}
					},
					"oldValue": {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								"ChartType": {
									"EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Donut"
								},
								"MeasureAttributes": [{
										"DataPoint": {},
										"DataPointAnnotationPath": {},
										"Measure": {
										"PropertyPath": ""
									},
									"Role": {
										"EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
									}
								}],
								"Measures": [{
									"PropertyPath": ""
								}]
							}
						}
					}
				}
			}];

			// Assert
			assert.ok(this.oChange.noRefreshOnChange, "There will be no refresh on this change.");
			assert.ok(ChartMeasures._getPostponedRetemplating(), "A re-templating will be postponed.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "returns the same amount of Measures and MeasureAttributes but actualizes the DataPoint");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
		});

		QUnit.test("Fills all mandatory properties of an empty measure, re-templating required", function() {
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: {PropertyPath: "Product"},
				Role: {EnumMember: "Axis1"},
				DataPointAnnotationPath: {AnnotationPath: "@" + DATAPOINT + "#Product2"},
				DataPoint: {
					Criticality: {
						Path: "SalesValueAddedTax",
						EdmType: "Edm.Byte"
					},
					Description: {String: "Bullet Micro Chart"},
					Value: {Path: "Product"}
				}
			}];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: ""
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: ""},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"},
							DataPoint: {AnnotationPath: ""}
						}]
					}
				}
			};
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.DataPoint#Product2": {
								Criticality: {
									EdmType: "Edm.Byte",
									Path: "SalesValueAddedTax"
								},
								CriticalityCalculation: {
									ImprovementDirection: {
										EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
									},
									RecordType: "com.sap.vocabularies.UI.v1.CriticalityCalculationType"
								},
								Description: {String: "Bullet Micro Chart"},
								RecordType: "com.sap.vocabularies.UI.v1.DataPointType",
								Value: {Path: "Product"}
							}
						}
					},
					oldValue: undefined
				}
			},{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product2"
									},
									Measure: {
										PropertyPath: "Product"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: ""
									},
									Measure: {
										PropertyPath: ""
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								}],
								Measures: [{
									PropertyPath: ""
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					}
				}
			}];
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oGetComponentStub = sinon.stub(ChangeHandlerUtils, "getComponent");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);

			//Assert
			assert.notOk(this.oChange.noRefreshOnChange, "There will be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "returns the same amount of Measures and MeasureAttributes but actualizes the DataPoint");

			this.oGetChartFromColumnStub.restore();
			this.oGetComponentStub.restore();
		});

		QUnit.test("Returns an empty array if no chart exists, re-templating required", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var oChart = {};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);

			var aNewMeasures = [{
				Measure: {PropertyPath: "Product"},
				Role: {EnumMember: "Axis1"},
				DataPoint: {
					Criticality: {
						Path: "SalesValueAddedTax",
						EdmType: "Edm.Byte"
					},
					Description: {String: "Bullet Micro Chart"},
					Value: {Path: "Product"}
				},
				DataPointAnnotationPath: {AnnotationPath: "@" + DATAPOINT + "#Product2"}
			}];
			this.oChange.noRefreshOnChange = false;

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [];

			// Assert
			assert.notOk(this.oChange.noRefreshOnChange, "There will be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "returns an empty array if no chart exists");

			this.oGetChartFromColumnStub.restore();
		});

		QUnit.test("Implicitly derives the qualifier for a new DataPoint if the annotation path is empty, re-templating required", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var aNewMeasures = [{
				Measure: {PropertyPath: "Product"},
				Role:  {EnumMember: "Axis1"},
				DataPointAnnotationPath:  {AnnotationPath: undefined},
				DataPoint: {
					Criticality: {
						Path: "SalesValueAddedTax",
						EdmType: "Edm.Byte"
					},
					Description: {String: "Bullet Micro Chart"},
					Value: {Path: "Product"}
				}
			}];
			this.oChange.noRefreshOnChange = false;
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"},
							DataPoint: undefined
						}]
					}
				}
			};
			this.oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oChart);
			this.oModifyDataPointStub = sinon.stub(DesigntimeUtils, "modifyDataPointForChart");
			this.oGetComponentStub = sinon.stub(ChangeHandlerUtils, "getComponent");

			// Act
			var aCustomChanges = ChartMeasures.setMeasures(oColumn, aNewMeasures, this.oChange);
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: {
										AnnotationPath: "@" + DATAPOINT + "#Product"
									},
									Measure: {
										PropertyPath: "Product"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					},
					oldValue: {
						"ns.MyEntityType": {
							"com.sap.vocabularies.UI.v1.Chart": {
								MeasureAttributes: [{
									DataPoint: undefined,
									Measure: {
										PropertyPath: "Product"
									},
									RecordType: MEASURE_ATTRIBUTE_TYPE,
									Role: {
										EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
									}
								}],
								Measures: [{
									PropertyPath: "Product"
								}],
								ChartType: {EnumMember: CHARTTYPE_DONUT}
							}
						}
					}
				}
			}];
			// Assert
			assert.notOk(this.oChange.noRefreshOnChange, "There will be a refresh on this change.");
			assert.deepEqual(aCustomChanges, aExpectedChanges, "implicitly derives the qualifier for a new DataPoint if the annotation path is empty");

			// Cleanup
			this.oGetChartFromColumnStub.restore();
			this.oModifyDataPointStub.restore();
			this.oGetComponentStub.restore();
		});

		/***************************************************/
		QUnit.module("The fuction getChartFromConnectedField", {
			beforeEach: function() {
				this.oElement = {
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					Target: {
						AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#Tech2"
					}
				};
				this.oDataEntityType = {
					"com.sap.vocabularies.UI.v1.FieldGroup#Tech2": {
						Data: [
							{},
							{
								Target: {
									AnnotationPath: "to_ProductSalesPrice/@com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart"
								}
							}
							]
					}
				};
				this.oEntityType = {
					"com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart": {
						ChartType: {},
						Description: {},
						Dimensions: {},
						MeasureAttributes: {},
						Measures: {},
						RecordType: "com.sap.vocabularies.UI.v1.ChartDefinitionType",
						Title: {}
					}
				};
				this.oGetLineItemRecordForColumnStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(this.oElement);
				this.ogetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath");
				this.ogetEntityTypeFromAnnotationPathStub.onCall(0).returns(this.oDataEntityType);
				this.ogetEntityTypeFromAnnotationPathStub.onCall(1).returns(this.oEntityType);

			},
			afterEach: function() {
				this.oGetLineItemRecordForColumnStub.restore();
				this.ogetEntityTypeFromAnnotationPathStub.restore();
				this.oElement = null;
			}
		});

		QUnit.test("getChartFromConnectedField", function() {
			// Arrange
			var iIndex,
				oChartFromParent;

			// Act
			oChartFromParent = ChartMeasures.getChartFromConnectedField(this.oElement, iIndex);

			// Assert
			assert.equal(oChartFromParent, undefined , "returns undefined in case of a column which is no chart");
		});

		QUnit.test("getChartFromConnectedField", function() {
			// Arrange
			var iIndex = 1,
				oChartFromParent,
				oExpectedChartFromParent = {
					chartID: "com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart",
					entityType: {
						"com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart": {
							ChartType: {},
							Description: {},
							Dimensions: {},
							MeasureAttributes: {},
							Measures: {},
							RecordType: "com.sap.vocabularies.UI.v1.ChartDefinitionType",
							Title: {}
						}
					}
				};

			// Act
			oChartFromParent = ChartMeasures.getChartFromConnectedField(this.oElement, iIndex);

			// Assert
			assert.deepEqual(oChartFromParent, oExpectedChartFromParent , "returns chartId and entityType of the corresponding chart");
		});

		/***************************************************/
		QUnit.module("The function getMeasures");

		QUnit.test("getMeasures", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {
							EnumMember: {EnumMember: CHARTTYPE_DONUT}
						}
					}
				}
			};
			this.oGetChartFromParentStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);
			// Act
			var aExistingMeasures = ChartMeasures.getMeasures(oColumn);

			// Assert
			assert.deepEqual(aExistingMeasures, [], "returns an empty array if there are no measures");

			this.oGetChartFromParentStub.restore();
		});

		QUnit.test("getMeasures", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}]
					},
					"com.sap.vocabularies.UI.v1.DataPoint#Product": {}
				}
			};
			this.oGetChartFromParentStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var aExistingMeasures = ChartMeasures.getMeasures(oColumn);

			// Assert
			var aExpectedMeasures = [{
				Measure: {
					PropertyPath: "Product"
				}
			}
			];
			assert.deepEqual(aExistingMeasures, aExpectedMeasures, "returns the measure only, if there are no attributes defined yet");

			this.oGetChartFromParentStub.restore();
		});

		QUnit.test("getMeasures", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
						}]
					},
					"com.sap.vocabularies.UI.v1.DataPoint#Product": {}
				}
			};
			this.oGetChartFromParentStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var aExistingMeasures = ChartMeasures.getMeasures(oColumn);

			// Assert
			var aExpectedMeasures = [{
				Measure: {PropertyPath: "Product"},
				Role: {EnumMember: "Axis1"},
				DataPointAnnotationPath: {AnnotationPath: undefined},
				DataPoint: {}
			}];
			assert.deepEqual(aExistingMeasures, aExpectedMeasures, "returns measure and measure attribute without datapoint");

			this.oGetChartFromParentStub.restore();
		});

		QUnit.test("getMeasures", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}, {
							PropertyPath: "Weight"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis1"}
						},
							{
								Measure: {PropertyPath: "Weight"},
								Role: {EnumMember: MEASURE_ROLE_TYPE + "/Axis2"}
							}]
					},
					"com.sap.vocabularies.UI.v1.DataPoint#Product": {}
				}
			};
			this.oGetChartFromParentStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var aExistingMeasures = ChartMeasures.getMeasures(oColumn);

			// Assert
			var aExpectedMeasures = [{
				Measure: {PropertyPath: "Product"},
				Role: {EnumMember: "Axis1"},
				DataPointAnnotationPath: {AnnotationPath: undefined},
				DataPoint: {}
			}, {
				Measure: {PropertyPath: "Weight"},
				Role: {EnumMember: "Axis2"},
				DataPointAnnotationPath: {AnnotationPath: undefined},
				DataPoint: {}
			}];
			assert.deepEqual(aExistingMeasures, aExpectedMeasures, "returns multiple measures and measure attributes");

			this.oGetChartFromParentStub.restore();
		});

		QUnit.test("getMeasures", function() {
			// Arrange
			var oColumn = {};
			oColumn.sId = "";
			var oChart = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: {
					"com.sap.vocabularies.UI.v1.Chart": {
						ChartType: {EnumMember: CHARTTYPE_DONUT},
						Measures: [{
							PropertyPath: "Product"
						}],
						MeasureAttributes: [{
							Measure: {PropertyPath: "Product"},
							RecordType: MEASURE_ATTRIBUTE_TYPE,
							Role: {
								EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
							},
							DataPoint: {
								AnnotationPath: "@" + DATAPOINT + "#Product"
							}
						}]
					},
					"com.sap.vocabularies.UI.v1.DataPoint#Product": {
						Criticality: {
							Path: "ProductValueAddedTax",
							EdmType: "Edm.Byte"
						},
						Description: {String: "Bullet Micro Chart"}
					}
				}
			};
			this.oGetChartFromParentStub = sinon.stub(DesigntimeUtils, "getChartFromParent").returns(oChart);

			// Act
			var aExistingMeasures = ChartMeasures.getMeasures(oColumn);

			// Assert
			var aExpectedMeasures = [{
				Measure: {PropertyPath: "Product"},
				Role: {EnumMember: "Axis1"},
				DataPointAnnotationPath: {AnnotationPath: "@" + DATAPOINT + "#Product"},
				DataPoint: {
					Criticality: {
						Path: "ProductValueAddedTax",
						EdmType: "Edm.Byte"
					},
					Description: {String: "Bullet Micro Chart"}
				}
			}
			];
			assert.deepEqual(aExistingMeasures, aExpectedMeasures, "returns measure and measure attribute with datapoint");

			this.oGetChartFromParentStub.restore();
		});


	});

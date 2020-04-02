/**
 * tests for the sap.suite.ui.generic.template.designtime.virtualProperties.ConnectedFieldData.js
 */

sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ColumnType",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ConnectedFieldData",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ChartMeasures",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/base/util/isEmptyObject"
	],
	function(sinon, AnnotationChangeUtils, ColumnType, ChangeHandlerUtils, ConnectedFieldData, ChartMeasures, DesigntimeUtils, isEmptyObject) {
		"use strict";

		var ITEMTYPE_DATAFIELD = "DataField",
			ITEMTYPE_DATAFIELDFORACTION = "DataFieldForAction",
			ITEMTYPE_INTENTBASEDNAV = "DataFieldForIntentBasedNavigation",
			ITEMTYPE_NAVIGATION_PATH = "DataFieldWithNavigationPath",
			ITEMTYPE_CONTACT = "DataFieldForAnnotationContact",
			ITEMTYPE_CHART = "DataFieldForAnnotationChartWithDimensions",
			ITEMTYPE_RATING = "DataFieldForAnnotationRating",
			ITEMTYPE_PROGRESS = "DataFieldForAnnotationProgress",

			UI_DATAFIELD = "com.sap.vocabularies.UI.v1.DataField",
			UI_DATAPOINT = "com.sap.vocabularies.UI.v1.DataPoint",
			UI_CHART = "com.sap.vocabularies.UI.v1.Chart",
			UI_CONTACT = "com.sap.vocabularies.Communication.v1.Contact",
			UI_DATAFIELDWITHNAVPATH = "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath",
			UI_DATAFIELDFORANNOTATION = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			UI_DATAFIELDFORACTION = "com.sap.vocabularies.UI.v1.DataFieldForAction",
			UI_FORINTENTBASEDNAV = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";

		QUnit.dump.maxDepth = 20;

		/***************************************************/
		QUnit.module("The function getFieldGroupOfConnectedField");
		QUnit.test("getFieldGroupOfConnectedField", function(){
			// Arrange
			var oColumn


			this.oGetRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns({
				Value: {
					Path: undefined
				},
				RecordType: UI_DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath : "@com.sap.vocabularies.UI.v1.FieldGroup#My_Target"
				}
			});
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.FieldGroup#My_Target": {
					Data: []
				}
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);


			// Act
			var oFieldGroup = ConnectedFieldData.getFieldGroupOfConnectedField(oColumn);

			// Assert
			assert.equal(oFieldGroup.hasOwnProperty("data"), true , "returns Field group data if it is available");

			this.oGetRecordStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
		});

		QUnit.test("getFieldGroupOfConnectedField", function(){
			// Arrange
			var oColumn;

			this.oGetRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns({
				Value: {
					Path: undefined
				},
				RecordType: UI_DATAFIELDFORANNOTATION
			});
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.FieldGroup#My_Target": {
					Data: []
				}
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);


			// Act
			var oFieldGroup = ConnectedFieldData.getFieldGroupOfConnectedField(oColumn);

			// Assert
			assert.equal(oFieldGroup, undefined , "returns no data if it is not available");

			this.oGetRecordStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
		});

		/***************************************************/
		QUnit.module("The function fixQualifierForNewItem");
		QUnit.test("fixQualifierForNewItem", function(){
			// Arrange
			var oColumn,
				oChange = {
					metadataPath: "vData/children/1/vItemType"
				};
			var oEntitySet = {
				"com.sap.vocabularies.UI.v1.FieldGroup#myFieldGroup3": {
					Data: []
				}
			}
			;
			this.getODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(oEntitySet);
			this.fixQualifierForAnnotationPathStub = sinon.stub(DesigntimeUtils, "fixQualifierForAnnotationPath").returns("com.sap.vocabularies.UI.v1.Chart#FE");

			// Act
			var sFullTerm = ConnectedFieldData.fixQualifierForNewItem(oColumn, UI_CHART, oChange, "FE");

			// Assert
			assert.equal(sFullTerm, "com.sap.vocabularies.UI.v1.Chart#FE" , "returns full term for a chart");
			assert.equal(this.getODataEntityTypeStub.calledWith(oColumn), true, "The method getODataEntityType has been called with the correct parameter.");
			assert.equal(this.fixQualifierForAnnotationPathStub.callCount, 1, "The method fixQualifierForAnnotationPath has been called for correct time");
			assert.equal(this.fixQualifierForAnnotationPathStub.calledWith(oEntitySet["com.sap.vocabularies.UI.v1.FieldGroup#myFieldGroup3"].Data, UI_CHART, "FE", 1), true, "The method fixQualifierForAnnotationPath has been called with the correct parameters.");

			this.getODataEntityTypeStub.restore();
			this.fixQualifierForAnnotationPathStub.restore();
		});
		QUnit.test("fixQualifierForNewItem", function () {
			// Arrange
			var oColumn,
				oChange = {
					metadataPath: "vData/children/1/vItemType"
				};
			var oEntitySet = {
				"com.sap.vocabularies.UI.v1.FieldGroup#myFieldGroup": {
					Data: []
				},
				"com.sap.vocabularies.UI.v1.FieldGroup#myFieldGroup2": {
					Data: [
						{
							"Target": {
								"AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#FE"
							}
						}
					]
				}
			}

			this.getODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(oEntitySet);
			this.fixQualifierForAnnotationPathStub = sinon.stub(DesigntimeUtils, "fixQualifierForAnnotationPath").returns("com.sap.vocabularies.UI.v1.DataPoint#FE1");

			// Act
			var sFullTerm = ConnectedFieldData.fixQualifierForNewItem(oColumn, UI_DATAPOINT, oChange, "FE");

			// Assert
			assert.equal(sFullTerm, "com.sap.vocabularies.UI.v1.DataPoint#FE1", "returns correct qualifier");
			assert.equal(this.fixQualifierForAnnotationPathStub.callCount, 2, "The method fixQualifierForAnnotationPath has been called for correct times");
			assert.equal(this.getODataEntityTypeStub.calledWith(oColumn), true, "The method getODataEntityType has been called with the correct parameter.");
			assert.equal(this.fixQualifierForAnnotationPathStub.calledWith(oEntitySet["com.sap.vocabularies.UI.v1.FieldGroup#myFieldGroup"].Data, UI_DATAPOINT, "FE", 1), true, "The method fixQualifierForAnnotationPath has been called with the correct parameters.");
			assert.equal(this.fixQualifierForAnnotationPathStub.calledWith(oEntitySet["com.sap.vocabularies.UI.v1.FieldGroup#myFieldGroup2"].Data, UI_DATAPOINT, "FE", 2), true, "The method fixQualifierForAnnotationPath has been called with the correct parameters.");

			this.getODataEntityTypeStub.restore();
			this.fixQualifierForAnnotationPathStub.restore();
		});

		/***************************************************/
		QUnit.module("The function createNewDataPointForItem");
		QUnit.test("createNewDataPointForItem", function(){
			// Arrange
			var oColumn;

			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData, "getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							Value: {
								Path: "My_Path"
							},
							RecordType: UI_DATAFIELD
						}
					]
				}
			});

			// Act
			var oNewDataPoint = ConnectedFieldData.createNewDataPointForItem(oColumn, "Progress", "100", 0);

			// Assert
			assert.equal(oNewDataPoint.hasOwnProperty("Value"), true , "returns correct Datapoint for progress");

			this.getFieldGroupOfConnectedFieldStub.restore();
		});
		QUnit.test("createNewDataPointForItem", function(){
			// Arrange
			var oColumn;

			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData, "getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							Value: {
								Path: "My_Path"
							},
							RecordType: UI_FORINTENTBASEDNAV
						}
					]
				}
			});

			// Act
			var oNewDataPoint = ConnectedFieldData.createNewDataPointForItem(oColumn, "Rating", "100", 0);

			// Assert
			assert.equal(oNewDataPoint.hasOwnProperty("Value"), true , "returns correct Data point for Rating");

			this.getFieldGroupOfConnectedFieldStub.restore();
		});
		QUnit.test("createNewDataPointForItem", function(){
			// Arrange
			var oColumn;

			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData, "getFieldGroupOfConnectedField").returns({
				data: {
					Data: []
				}
			});

			// Act
			var oNewDataPoint = ConnectedFieldData.createNewDataPointForItem(oColumn, "Rating", "100", 0);

			// Assert
			assert.equal(oNewDataPoint.hasOwnProperty("Value"), false , "returns correct Data point for other item type");

			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		/***************************************************/
		QUnit.module("The function getItemType", {

			beforeEach: function() {
				this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData,"getFieldGroupOfConnectedField").returns({data: {
						Data: [
							{
								RecordType: "com.sap.vocabularies.UI.v1.DataField"
							},
							{
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction"
							},
							{
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
							},
							{
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath"
							},
							{
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#FE"
								}
							},
							{
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#FE0"
								}
							},
							{
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
								Target: {
									AnnotationPath: "@com.sap.vocabularies.Communication.v1.Contact#Supplier"
								}
							},
							{
								RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
								Target: {
									AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart#SpecificationWeightBulletChart"
								}
							}

						]
					}});
				this.oDataEntityTypeStub = {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.DataPoint#FE": {
						Visualization: {
							EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
						}
					},
					"com.sap.vocabularies.UI.v1.DataPoint#FE0": {
						Visualization: {
							EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						}
					}
				};
				this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);
			},
			afterEach: function() {
				this.getFieldGroupOfConnectedFieldStub.restore();
				this.oGetEntityTypeFromAnnotationPathStub.restore();
			}
		});
		QUnit.test("getItemType", function() {
			// Arrange
			var oElement = {};


			// Act
			var sItemType = ConnectedFieldData.getItemType(oElement,0);

			// Assert
			assert.equal(sItemType, ITEMTYPE_DATAFIELD , "returns DataField correctly");

		});

		QUnit.test("getItemType", function() {
			// Arrange
			var oElement = {};


			// Act
			var sItemType = ConnectedFieldData.getItemType(oElement,1);

			// Assert
			assert.equal(sItemType, ITEMTYPE_DATAFIELDFORACTION , "returns DataField for actions correctly");

		});

		QUnit.test("getItemType", function() {
			// Arrange
			var oElement = {};


			// Act
			var sItemType = ConnectedFieldData.getItemType(oElement,2);

			// Assert
			assert.equal(sItemType, ITEMTYPE_INTENTBASEDNAV , "returns DataFieldForIntentBasedNavigation correctly");

		});

		QUnit.test("getItemType", function() {
			// Arrange
			var oElement = {};


			// Act
			var sItemType = ConnectedFieldData.getItemType(oElement,3);

			// Assert
			assert.equal(sItemType, ITEMTYPE_NAVIGATION_PATH , "returns DataFieldWithNavigationPath correctly");

		});

		QUnit.test("getItemType", function() {
			// Arrange
			var oElement = {};



			// Act
			var sItemType = ConnectedFieldData.getItemType(oElement,5);

			// Assert
			assert.equal(sItemType, ITEMTYPE_PROGRESS , "returns DataFieldForAnnotationProgress correctly");

		});

		QUnit.test("getItemType", function() {
			// Arrange
			var oElement = {};

			// Act
			var sItemType = ConnectedFieldData.getItemType(oElement,4);

			// Assert
			assert.equal(sItemType, ITEMTYPE_RATING , "returns DataFieldForAnnotationRating correctly");

		});

		QUnit.test("getItemType", function() {
			// Arrange
			var oElement = {};

			// Act
			var sItemType = ConnectedFieldData.getItemType(oElement,6);

			// Assert
			assert.equal(sItemType, ITEMTYPE_CONTACT , "returns DataFieldForAnnotationContact correctly");

		});

		QUnit.test("getItemType", function() {
			// Arrange
			var oElement = {};

			// Act
			var sItemType = ConnectedFieldData.getItemType(oElement,7);

			// Assert
			assert.equal(sItemType, ITEMTYPE_CHART , "returns DataFieldForAnnotationChart correctly");

		});

		/***************************************************/
		QUnit.module("The function getPossibleValues");

		QUnit.test("getPossibleValues", function() {
			// Arrange
			var oElement = {};

			// Act
			var oActualValue = ConnectedFieldData.getPossibleValues(oElement);

			// Assert
			var oExpectedValue = {
				vItemType: {
					displayName: "Field Type",
					virtual: true,
					type: "EnumType",
					whiteList: {
						properties: ["vItemType"]
					},
					possibleValues: {
						DataField: {
							displayName: "Data Field"
						},
						DataFieldForAction: {
							displayName: "DataField For Action"
						},
						DataFieldForIntentBasedNavigation: {
							displayName: "Data Field For Intent Based Navigation"
						},
						DataFieldWithNavigationPath: {
							displayName: "Data Field With Navigation Path"
						},
						DataFieldForAnnotationContact: {
							displayName: "Contact"
						},
						DataFieldForAnnotationRating: {
							displayName: "Rating Indicator"
						},
						DataFieldForAnnotationProgress: {
							displayName: "Progress Indicator"
						},
						DataFieldForAnnotationChartWithDimensions: {
							displayName: "Chart"
						}
					}
				},
				vChartType: {
					displayName: "Chart Type",
					virtual: true,
					type: "EnumType",
					whiteList: {
						properties: ["vChartType"]
					},
					possibleValues: {
						Area: {
							displayName: "Smart Area Micro Chart"
						},
						Bullet: {
							displayName: "Smart Bullet Micro Chart"
						},
						Donut: {
							displayName: "Smart Radial Micro Chart"
						}
					}
				},
				DataField: {
					displayName: "Data Field",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataField",
					type: "ComplexType",
					whiteList: {
						properties: [
							"vItemType",
							"Value",
							"Label",
							"Criticality",
							"CriticalityRepresentation"
						],
						mandatory: ["vItemType", "Value"],
						expressionTypes: {
							Value: ["Path"],
							Criticality: ["Path"]
						}
					}
				},
				DataFieldForAction: {
					displayName: "Data Field For Action",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataFieldForAction",
					type: "ComplexType",
					whiteList: {
						properties: [
							"vItemType",
							"Action",
							"Label",
							"Criticality",
							"InvocationGrouping"
						],
						mandatory: ["vItemType", "Action"],
						expressionTypes: {
							Criticality: ["Path"]
						}
					}
				},
				DataFieldForIntentBasedNavigation: {
					displayName: "Data Field For Intent Based Navigation",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataFieldForIntentBasedNavigation",
					type: "ComplexType",
					whiteList: {
						properties: ["vItemType", "SemanticObject", "Action", "RequiresContext", "Label"],
						mandatory: ["vItemType", "SemanticObject", "RequiresContext"]
					}

				},

				DataFieldWithNavigationPath: {
					displayName: "Data Field With Navigation Path",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataFieldWithNavigationPath",
					type: "ComplexType",
					whiteList: {
						properties: ["vItemType", "Target", "Value", "Label"],
						mandatory: ["vItemType", "Target", "Value"]
					}
				},
				DataFieldForAnnotationContact: {
					displayName: "Data Field For Annotation",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataFieldForAnnotation",
					type: "ComplexType",
					whiteList: {
						properties: ["vItemType", "Target", "Label"],
						mandatory: ["Target"]
					},
					refersTo: [{
						annotation: "Contact",
						referredBy: "Target"
					}]
				},
				Contact: {
					namespace: "com.sap.vocabularies.Communication.v1",
					annotation: "Contact",
					type: "ComplexType",
					whiteList: {
						properties: [
							"fn", "n", "tel", "email", "photo", "title", "org", "role"
						],
						expressionTypes: {
							fn: ["Path"],
							photo: ["Path"],
							title: ["Path"],
							org: ["Path"],
							role: ["Path"]
						}
					},
					appliesTo: ["vItemType"]
				},
				DataFieldForAnnotationRating: {
					displayName: "Data Field For Annotation",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataFieldForAnnotation",
					type: "ComplexType",
					whiteList: {
						properties: ["vItemType", "Target", "Label"],
						mandatory: ["Target"]
					},
					refersTo: {
						annotation: "DataPoint",
						namespace: "com.sap.vocabularies.UI.v1"
					}
				},
				DataPointRating: {
					displayName: "Data Point",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataPoint",
					type: "ComplexType",
					whiteList: {
						properties: ["Value", "TargetValue"],
						mandatory: ["Value"],
						expressionTypes: {
							Value: ["Path"],
							TargetValue: ["Path", "String", "Int", "Decimal"]
						}
					}
				},
				DataFieldForAnnotationProgress: {
					displayName: "Data Field For Annotation",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataFieldForAnnotation",
					type: "ComplexType",
					whiteList: {
						properties: ["vItemType", "Target", "Label", "Criticality", "DataPointProgress"],
						mandatory: ["Target"]
					},
					refersTo: {
						annotation: "DataPoint",
						namespace: "com.sap.vocabularies.UI.v1"
					}
				},
				DataPointProgress: {
					displayName: "Data Point",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataPoint",
					target: ["EntityType"],
					type: "ComplexType",
					whiteList: {
						properties: ["Value", "TargetValue"],
						mandatory: ["Value"],
						expressionTypes: {
							Value: ["Path"],
							TargetValue: ["Path", "String", "Int", "Decimal"]
						}
					}
				},
				DataFieldForAnnotationChartWithDimensions: {
					displayName: "Data Field For Annotation",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataFieldForAnnotation",
					type: "ComplexType",
					whiteList: {
						properties: ["vItemType", "Target", "Label", "ChartWithDimensions"],
						mandatory: ["Target"]
					},
					refersTo: {
						annotation: "DataPoint",
						namespace: "com.sap.vocabularies.UI.v1"
					}
				},
				ChartWithDimensions: {
					displayName: "Chart",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					type: "ComplexType",
					whiteList: {
						properties: [
							"Description",
							"vDimensions",
							"vMeasures" //virtual property
						],
						mandatory: ["vMeasures"]
					}
				},
				DataFieldForAnnotationChartNoDimensions: {
					displayName: "Data Field For Annotation",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "DataFieldForAnnotation",
					type: "ComplexType",
					whiteList: {
						properties: ["vItemType", "Target", "Label", "ChartNoDimensions"],
						mandatory: ["Target"]
					},
					refersTo: {
						annotation: "DataPoint",
						namespace: "com.sap.vocabularies.UI.v1"
					}
				},
				ChartNoDimensions: {
					displayName: "Chart",
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Chart",
					target: ["EntityType"],
					type: "ComplexType",
					whiteList: {
						properties: [
							"Description",
							"vMeasures" //virtual property
						],
						mandatory: ["vMeasures"]
					}
				},
				vDimensions: {
					displayName: "Dimensions",
					virtual: true,
					type: "Collection",
					nullable: false,
					visible: false,
					multiple: true,
					possibleValues: {},
					whiteList: {
						properties: [
							"Dimensions"
						]

					}
				},
				vMeasures: {
					displayName: "Measures and Attributes",
					virtual: true,
					type: "Collection",
					nullable: false,
					visible: false,
					multiple: true,
					possibleValues: {
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
							nullable: false
						},
						DataPoint: {
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
								mandatory: ["Value"],
								expressionTypes: {
									Value: ["Path"],
									TargetValue: ["Path", "String", "Int", "Decimal"],
									ForecastValue: ["Path", "String", "Int", "Decimal"],
									Criticality: ["Path"]
								},
								CriticalityCalculation: {
									properties: [
										"ImprovementDirection",
										"DeviationRangeLowValue",
										"DeviationRangeHighValue",
										"ToleranceRangeLowValue",
										"ToleranceRangeHighValue"
									]
								}
							}
						},
						DataPointDonut: {
							displayName: "Data Point Properties",
							type: "ComplexType",
							namespace: "com.sap.vocabularies.UI.v1",
							annotation: "DataPoint",
							whiteList: {
								properties: ["Value", "TargetValue", "Criticality", "CriticalityCalculation"],
								mandatory: ["Value"],
								expressionTypes: {
									Value: ["Path"],
									TargetValue: ["Path", "String", "Int", "Decimal"],
									Criticality: ["Path"]
								},
								CriticalityCalculation: {
									properties: [
										"ImprovementDirection",
										"DeviationRangeLowValue",
										"DeviationRangeHighValue",
										"ToleranceRangeLowValue",
										"ToleranceRangeHighValue"
									]
								}
							}
						},
						DataPointArea: {
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
								mandatory: ["Value", "TargetValue"],
								expressionTypes: {
									Value: ["Path"],
									TargetValue: ["Path", "String", "Int", "Decimal"]
								},
								CriticalityCalculation: {
									properties: [
										"ImprovementDirection",
										"DeviationRangeLowValue",
										"DeviationRangeHighValue",
										"ToleranceRangeLowValue",
										"ToleranceRangeHighValue"
									]
								}
							}
						}
					},
					whiteList: {
						properties: [
							"DataPoint", "DataPointAnnnotationPath", "Measure", "Role"
						],
						mandatory: ["Measure"]

					}
				}

			};
			assert.deepEqual(oActualValue, oExpectedValue , "returns virtual data");

		});


		/***************************************************/
		QUnit.module("The function setData", {
		});

		QUnit.test("setData", function() {
			// Arrange
			var oColumn = {},
				aNewData = [],
				oChange ={
					metadataPath: "vData/children/0",
					propertyContent: {}
				};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData,"getFieldGroupOfConnectedField").returns({data: {
				}});


			// Act
			var aChangeContent = ConnectedFieldData.setData(oColumn, aNewData, oChange);

			// Assert
			assert.equal(isEmptyObject(aChangeContent), true, "returns empty array of changes if no item is available");
			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		QUnit.test("setData for a new item", function() {
			// Arrange
			var oColumn = {},
				aNewData = [],
				oChange ={
					metadataPath: "vData/children/0",
					propertyContent: {}
				};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData,"getFieldGroupOfConnectedField").returns({data: {
					Data: []
				}});


			// Act
			var aChangeContent = ConnectedFieldData.setData(oColumn, aNewData, oChange);

			// Assert
			assert.equal(isEmptyObject(aChangeContent), false, "does not returns empty array of changes if at least one item is available");
			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		QUnit.test("setData ", function() {
			// Arrange
			var oColumn = {},
				aNewData = [],
				oChange ={
					metadataPath: "vData/children/0",
					propertyContent: {
						propertyValue: "-1"
					}
				};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData,"getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							RecordType: "com.sap.vocabularies.UI.v1.DataField"
						}
					]
				},
				target: "My_Target",
				fieldGroup: "My_FieldGroup"
			});


			// Act
			var aChangeContent = ConnectedFieldData.setData(oColumn, aNewData, oChange);

			// Assert
			assert.equal(aChangeContent[0].content.newValue.My_Target.My_FieldGroup.Data.length < aChangeContent[0].content.oldValue.My_Target.My_FieldGroup.Data.length , true, "delete data from field group");
			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		QUnit.test("setData ", function() {
			// Arrange
			var oColumn = {},
				aNewData = [],
				oChange ={
					metadataPath: "vData/children/0",
					propertyContent: {
						propertyValue: undefined,
						propertyName: "vData"
					}
				};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData,"getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							RecordType: "com.sap.vocabularies.UI.v1.DataField"
						}
					]
				},
				target: "My_Target",
				fieldGroup: "My_FieldGroup"
			});


			// Act
			var aChangeContent = ConnectedFieldData.setData(oColumn, aNewData, oChange);

			// Assert
			assert.equal(aChangeContent[0].content.newValue.My_Target.My_FieldGroup.Data.length > aChangeContent[0].content.oldValue.My_Target.My_FieldGroup.Data.length , true, "insert data into the field group");
			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		QUnit.test("setData ", function() {
			// Arrange
			var oColumn = {},
				aNewData = [],
				oChange ={
					metadataPath: "vData/children/0",
					propertyContent: {
						propertyValue: undefined,
						rootProperty: "vData",
						propertyName: "Target"
					}
				};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData,"getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							RecordType: "com.sap.vocabularies.UI.v1.DataField"
						}
					]
				},
				target: "My_Target",
				fieldGroup: "My_FieldGroup"
			});


			// Act
			var aChangeContent = ConnectedFieldData.setData(oColumn, aNewData, oChange);

			// Assert
			assert.equal(aChangeContent.length, 1, "updates only data for an item which has an existing target");
			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		QUnit.test("setData ", function() {
			// Arrange
			var oColumn = {},
				aNewData = [{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Target: {
						AnnotationPath:"MyAnnotationPath"
					}
				}],
				oChange ={
					metadataPath: "vData/children/0",
					propertyContent: {
						propertyValue: "(New)",
						rootProperty: "vData",
						propertyName: "Target",
						valueTargetElement: null,
						refersTo:[],
						propertyType: "AnnotationPath"
					}
				};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData,"getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							RecordType: "com.sap.vocabularies.UI.v1.DataField",
							Target: {
								AnnotationPath:"MyAnnotationPath"
							}
						}
					]
				},
				target: "My_Target",
				fieldGroup: "My_FieldGroup"
			});
			this.fixQualifierForNewItemStub = sinon.stub(ConnectedFieldData,"fixQualifierForNewItem").returns("MYSTerm");
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.DataPoint#FE": {
					TargetValue: {Decimal: "4"},
					Value: {Path: "to_StockAvailability/StockAvailability", EdmType: "Edm.Byte"},
					Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Rating"}
				}
			};

			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);


			// Act
			var aChangeContent = ConnectedFieldData.setData(oColumn, aNewData, oChange);

			// Assert
			assert.equal(aChangeContent.length , 2, "updates both data and annotation for an item which does not have an existing target");
			this.getFieldGroupOfConnectedFieldStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
			this.fixQualifierForNewItemStub.restore();
		});

		/***************************************************/
		QUnit.module("The function getData", {

		});

		QUnit.test("getData", function() {
			// Arrange
			var oElement = {};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData,"getFieldGroupOfConnectedField");


			// Act
			var aItem = ConnectedFieldData.getData(oElement);

			// Assert
			assert.equal(isEmptyObject(aItem), true, "returns an empty array of items for no field group");
			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		QUnit.test("getData", function() {
			// Arrange
			var oElement = {};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData, "getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							RecordType: UI_DATAFIELD
						}
					]
				}
			});


			// Act
			var aItem = ConnectedFieldData.getData(oElement);

			// Assert
			assert.equal(isEmptyObject(aItem), false, "returns array of items");
			assert.equal(aItem[0].vItemType.EnumMember === ITEMTYPE_DATAFIELD, true, "has correct item types for DataField");
			assert.equal(aItem[0].hasOwnProperty("DataField"), true, "has correct item data for DataField");

			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		QUnit.test("getData", function() {
			// Arrange
			var oElement = {};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData, "getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							RecordType: UI_DATAFIELDFORACTION
						}
					]
				}
			});


			// Act
			var aItem = ConnectedFieldData.getData(oElement);

			// Assert
			assert.equal(isEmptyObject(aItem), false, "returns array of items");
			assert.equal(aItem[0].vItemType.EnumMember === ITEMTYPE_DATAFIELDFORACTION, true, "has correct item types for DataFieldForAction");
			assert.equal(aItem[0].hasOwnProperty("DataFieldForAction"), true, "has correct item data for DataFieldForAction");

			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		QUnit.test("getData", function() {
			// Arrange
			var oElement = {};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData, "getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							RecordType: UI_FORINTENTBASEDNAV
						}
					]
				}
			});


			// Act
			var aItem = ConnectedFieldData.getData(oElement);

			// Assert
			assert.equal(isEmptyObject(aItem), false, "returns array of items");
			assert.equal(aItem[0].vItemType.EnumMember === ITEMTYPE_INTENTBASEDNAV, true, "has correct item types for DataFieldForIntentBasedNavigation");
			assert.equal(aItem[0].hasOwnProperty("DataFieldForIntentBasedNavigation"), true, "has correct item data for DataFieldForIntentBasedNavigation");

			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		QUnit.test("getData", function() {
			// Arrange
			var oElement = {};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData, "getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							RecordType: UI_DATAFIELDWITHNAVPATH
						}
					]
				}
			});


			// Act
			var aItem = ConnectedFieldData.getData(oElement);

			// Assert
			assert.equal(isEmptyObject(aItem), false, "returns array of items");
			assert.equal(aItem[0].vItemType.EnumMember === ITEMTYPE_NAVIGATION_PATH, true, "has correct item types for DataFieldWithNavigationPath");
			assert.equal(aItem[0].hasOwnProperty("DataFieldWithNavigationPath"), true, "has correct item data for DataFieldWithNavigationPath");

			this.getFieldGroupOfConnectedFieldStub.restore();
		});

		QUnit.test("getData", function() {
			// Arrange
			var oElement = {};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData, "getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#FE"
							},
							RecordType: UI_DATAFIELDFORANNOTATION
						}
					]
				}
			});

			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.DataPoint#FE": {
					TargetValue: {Decimal: "4"},
					Value: {Path: "to_StockAvailability/StockAvailability", EdmType: "Edm.Byte"},
					Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Rating"}
				}
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);


			// Act
			var aItem = ConnectedFieldData.getData(oElement);

			// Assert
			assert.equal(isEmptyObject(aItem), false, "returns array of items");
			assert.equal(aItem[0].vItemType.EnumMember === ITEMTYPE_RATING, true, "has correct item types for DataFieldForAnnotationRating");
			assert.equal(aItem[0].hasOwnProperty("DataFieldForAnnotationRating"), true, "has correct item data for DataFieldForAnnotationRating");
			assert.equal(aItem[0].hasOwnProperty("DataPointRating"), true, "has correct item data for DataPointRating");

			this.getFieldGroupOfConnectedFieldStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
		});

		QUnit.test("getData", function() {
			// Arrange
			var oElement = {};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData, "getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#FE"
							},
							RecordType: UI_DATAFIELDFORANNOTATION
						}
					]
				}
			});

			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.DataPoint#FE": {
					Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"}
				}
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);


			// Act
			var aItem = ConnectedFieldData.getData(oElement);

			// Assert
			assert.equal(isEmptyObject(aItem), false, "returns array of items");
			assert.equal(aItem[0].vItemType.EnumMember === ITEMTYPE_PROGRESS, true, "has correct item types for DataFieldForAnnotationProgress");
			assert.equal(aItem[0].hasOwnProperty("DataFieldForAnnotationProgress"), true, "has correct item data for DataFieldForAnnotationProgress");
			assert.equal(aItem[0].hasOwnProperty("DataPointProgress"), true, "has correct item data for DataPointProgress");

			this.getFieldGroupOfConnectedFieldStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
		});

		QUnit.test("getData", function() {
			// Arrange
			var oElement = {};
			this.getFieldGroupOfConnectedFieldStub = sinon.stub(ConnectedFieldData, "getFieldGroupOfConnectedField").returns({
				data: {
					Data: [
						{
							Target: {
								AnnotationPath: "@@com.sap.vocabularies.Communication.v1.Contact"
							},
							RecordType: UI_DATAFIELDFORANNOTATION
						}
					]
				}
			});

			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.Communication.v1.Contact": {
					RecordType: "com.sap.vocabularies.Communication.v1.ContactType"
				}
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);


			// Act
			var aItem = ConnectedFieldData.getData(oElement);

			// Assert
			assert.equal(isEmptyObject(aItem), false, "returns array of items");
			assert.equal(aItem[0].vItemType.EnumMember === ITEMTYPE_CONTACT, true, "has correct item types for DataFieldForAnnotationContact");
			assert.equal(aItem[0].hasOwnProperty("DataFieldForAnnotationContact"), true, "has correct item data for DataFieldForAnnotationContact");
			assert.equal(aItem[0].hasOwnProperty("Contact"), true, "has correct item data for Contact");

			this.getFieldGroupOfConnectedFieldStub.restore();
		});

	});

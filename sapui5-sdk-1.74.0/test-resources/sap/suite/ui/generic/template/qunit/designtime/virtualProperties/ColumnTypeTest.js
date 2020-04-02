/**
 * tests for the sap.suite.ui.generic.template.designtime.virtualProperties.ColumnType.js
 */

sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/js/AnnotationHelper",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ColumnType",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils"
	],
	function(sinon, ChangeHandlerUtils, AnnotationHelper, ColumnType, DesigntimeUtils) {
		"use strict";

		var INTENTBASEDNAV = "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation",
			FORINTENTBASEDNAV = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
			DATAFIELDWITHURL = "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
			DATAFIELD = "com.sap.vocabularies.UI.v1.DataField",
			DATAFIELDFORACTION = "com.sap.vocabularies.UI.v1.DataFieldForAction",
			DATAFIELDFORANNOTATION = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			DATAFIELDWITHNAVPATH = "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath",
			DATAPOINT = "com.sap.vocabularies.UI.v1.DataPoint",
			FIELDGROUP = "com.sap.vocabularies.UI.v1.FieldGroup",
			LOW_IMPORTANCE = "com.sap.vocabularies.UI.v1.ImportanceType/Low",
			HIGH_IMPORTANCE = "com.sap.vocabularies.UI.v1.ImportanceType/High";

		var	COLUMNTYPE_DATAFIELD = "DataField",
			COLUMNTYPE_CHART = "Chart",
			COLUMNTYPE_RATING = "RatingIndicator",
			COLUMNTYPE_PROGRESS = "ProgressIndicator",
			COLUMNTYPE_CONTACT = "Contact",
			COLUMNTYPE_CONNECTEDFIELDS = "ConnectedFields",
			COLUMNTYPE_INTENTBASEDNAV = "DataFieldWithIntentBasedNavigation",
			COLUMNTYPE_FORINTENTBASEDNAV = "DataFieldForIntentBasedNavigation",
			COLUMNTYPE_DATAFIELDWITHNAVPATH = "DataFieldWithNavigationPath",
			COLUMNTYPE_DATAFIELDFORACTION = "DataFieldForAction",
			COLUMNTYPE_DATAFIELDWITHURL = "DataFieldWithUrl",
			COLUMNTYPE_TOOLBARBUTTON = "ToolbarButton";

		QUnit.dump.maxDepth = 20;

		/***************************************************/
		QUnit.module("The function createNewDataPointForColumn");

		QUnit.test("createNewDataPointForColumn", function() {
			// Arrange
			var sQualifier = "First",
				sTargetValue = "25",
				oColumn;

			this.oGetRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn");

			// Act
			var oActualDataPoint = ColumnType.createNewDataPointForColumn(oColumn, sQualifier, sTargetValue);

			// Assert
			var oExpectedDataPoint = {
				TargetValue: {String: sTargetValue},
				Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/First"},
				RecordType: DATAPOINT + "Type",
				Title: {String: sQualifier}
			};
			assert.deepEqual(oActualDataPoint, oExpectedDataPoint , "returns DataPoint without Value if no record could be indentified");

			this.oGetRecordStub.restore();
		});

		QUnit.test("createNewDataPointForColumn", function() {
			// Arrange
			var sQualifier = "First",
				sTargetValue = "25",
				oColumn;

			this.oGetRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns({
				Value: {
					Path: undefined
				},
				RecordType: DATAFIELD
			});

			// Act
			var oActualDataPoint = ColumnType.createNewDataPointForColumn(oColumn, sQualifier, sTargetValue);

			// Assert
			var oExpectedDataPoint = {
				TargetValue: {String: sTargetValue},
				Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/First"},
				RecordType: DATAPOINT + "Type",
				Title: {String: sQualifier}
			};
			assert.deepEqual(oActualDataPoint, oExpectedDataPoint , "returns DataPoint without Value if no path is given");

			this.oGetRecordStub.restore();
		});

		QUnit.test("createNewDataPointForColumn", function() {
			// Arrange
			var sQualifier = "First",
				sTargetValue = "25",
				oColumn;

			this.oGetRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns({
				Value: {
					Path: "myTarget"
				},
				RecordType: DATAFIELD
			});

			// Act
			var oActualDataPoint = ColumnType.createNewDataPointForColumn(oColumn, sQualifier, sTargetValue);

			// Assert
			var oExpectedDataPoint = {
				TargetValue: {String: sTargetValue},
				Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/First"},
				RecordType: DATAPOINT + "Type",
				Title: {String: sQualifier},
				Value: {Path: "myTarget"}
			};
			assert.deepEqual(oActualDataPoint, oExpectedDataPoint , "returns DataPoint with Value for DataField");

			this.oGetRecordStub.restore();
		});

		QUnit.test("createNewDataPointForColumn", function() {
			// Arrange
			var sQualifier = "First",
				sTargetValue = "25",
				oColumn;

			this.oGetRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns({
				Value: {
					Path: "myTarget"
				},
				RecordType: DATAFIELDWITHURL
			});

			// Act
			var oActualDataPoint = ColumnType.createNewDataPointForColumn(oColumn, sQualifier, sTargetValue);

			// Assert
			var oExpectedDataPoint = {
				TargetValue: {String: sTargetValue},
				Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/First"},
				RecordType: DATAPOINT + "Type",
				Title: {String: sQualifier},
				Value: {Path: "myTarget"}
			};
			assert.deepEqual(oActualDataPoint, oExpectedDataPoint , "returns DataPoint with Value for DataFieldWithUrl");

			this.oGetRecordStub.restore();
		});

		QUnit.test("createNewDataPointForColumn", function() {
			// Arrange
			var sQualifier = "First",
				sTargetValue = "25",
				oColumn;

			this.oGetRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns({
				Value: {
					Path: "myTarget"
				},
				RecordType: INTENTBASEDNAV
			});

			// Act
			var oActualDataPoint = ColumnType.createNewDataPointForColumn(oColumn, sQualifier, sTargetValue);

			// Assert
			var oExpectedDataPoint = {
				TargetValue: {String: sTargetValue},
				Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/First"},
				RecordType: DATAPOINT + "Type",
				Title: {String: sQualifier},
				Value: {Path: "myTarget"}
			};
			assert.deepEqual(oActualDataPoint, oExpectedDataPoint , "returns DataPoint with Value for DataFieldWithIntentBasedNavigation");

			this.oGetRecordStub.restore();
		});

		QUnit.test("createNewDataPointForColumn", function() {
			// Arrange
			var sQualifier = "First",
				sTargetValue = "25",
				oColumn;

			this.oGetRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns({
				Value: {
					Path: "myTarget"
				},
				RecordType: "invalid"
			});

			// Act
			var oActualDataPoint = ColumnType.createNewDataPointForColumn(oColumn, sQualifier, sTargetValue);

			// Assert
			var oExpectedDataPoint = {
				TargetValue: {String: sTargetValue},
				Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/First"},
				RecordType: DATAPOINT + "Type",
				Title: {String: sQualifier}
			};
			assert.deepEqual(oActualDataPoint, oExpectedDataPoint , "returns DataPoint without Value for invalid record type");

			this.oGetRecordStub.restore();
		});

		/***************************************************/
		QUnit.module("The function createNewColumn");

		QUnit.test("createNewColumn", function() {
			// Arrange
			var sRecordType = DATAFIELD,
				oOldRecord;

			// Act
			var oActualColumn = ColumnType.createNewColumn(sRecordType, oOldRecord);

			// Assert
			var oExpectedColumn = {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELD,
				Value: { Path: "" }
			};
			assert.deepEqual(oActualColumn, oExpectedColumn, "returns DataField column, without properties");
		});

		QUnit.test("createNewColumn", function() {
			// Arrange
			var sRecordType = DATAFIELD,
				oOldRecord = {
					Label: { String: "Field1" }
				};

			// Act
			var oActualColumn = ColumnType.createNewColumn(sRecordType, oOldRecord);

			// Assert
			var oExpectedColumn = {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELD,
				Label: { String: "Field1" },
				Value: { Path: "" }
			};
			assert.deepEqual(oActualColumn, oExpectedColumn, "returns DataField column, Label taken over");
		});

		QUnit.test("createNewColumn", function() {
			// Arrange
			var sRecordType = DATAFIELDFORANNOTATION,
				oOldRecord = {
					Label: { String: "Field1" }
				};

			// Act
			var oActualColumn = ColumnType.createNewColumn(sRecordType, oOldRecord);

			// Assert
			var oExpectedColumn = {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDFORANNOTATION,
				Label: { String: "Field1" },
				Target: { AnnotationPath: "" }
			};
			assert.deepEqual(oActualColumn, oExpectedColumn, "returns DataField column, Label taken over");
		});

		QUnit.test("createNewColumn", function() {
			// Arrange
			var sRecordType = DATAFIELD,
				oOldRecord = {
					Label: { String: "Field1" },
					Value: {Path: "myTarget"}
				};

			// Act
			var oActualColumn = ColumnType.createNewColumn(sRecordType, oOldRecord);

			// Assert
			var oExpectedColumn = {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELD,
				Label: { String: "Field1" },
				Value: { Path: "myTarget" }
			};
			assert.deepEqual(oActualColumn, oExpectedColumn, "returns DataField column, Label and Value taken over");
		});

		QUnit.test("createNewColumn", function() {
			// Arrange
			var sRecordType = DATAFIELD,
				oOldRecord = {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": LOW_IMPORTANCE
					},
					Inline: {Bool: "true"},
					Determining: {Bool: "false"},
					Action: {String: "myAction"},
					InvocationGrouping: {}
				};

			// Act
			var oActualColumn = ColumnType.createNewColumn(sRecordType, oOldRecord);

			// Assert
			var oExpectedColumn = {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: LOW_IMPORTANCE
				},
				RecordType: DATAFIELD,
				Value: { Path: "" }
			};
			assert.deepEqual(oActualColumn, oExpectedColumn, "returns DataField column, only Importance taken over from action");
		});

		QUnit.test("createNewColumn", function() {
			// Arrange
			var sRecordType = INTENTBASEDNAV,
				oOldRecord = {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": LOW_IMPORTANCE
					},
					Inline: {Bool: "true"},
					Determining: {Bool: "false"},
					Action: {String: "myAction"},
					InvocationGrouping: {}
				};

			// Act
			var oActualColumn = ColumnType.createNewColumn(sRecordType, oOldRecord);

			// Assert
			var oExpectedColumn = {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: LOW_IMPORTANCE
				},
				RecordType: INTENTBASEDNAV,
				Action: {String: "myAction"},
				SemanticObject:{String: ""},
				Value: {Path: ""},
			};
			assert.deepEqual(oActualColumn, oExpectedColumn, "takes over the action while switching to IBN");
		});

		QUnit.test("createNewColumn", function() {
			// Arrange
			var sRecordType = DATAFIELDFORACTION,
				oOldRecord = {
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: LOW_IMPORTANCE
					},
					Action: {String: "myAction"},
					Value: { Path: "" },
					SemanticObject:{String: ""}
				};

			// Act
			var oActualColumn = ColumnType.createNewColumn(sRecordType, oOldRecord);

			// Assert
			var oExpectedColumn = {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": LOW_IMPORTANCE
				},
				RecordType: DATAFIELDFORACTION,
				Inline: {Bool: "true"},
				Determining: {Bool: "false"},
				Action: {String: "myAction"}
			};
			assert.deepEqual(oActualColumn, oExpectedColumn, "takes over the action while switching to DataFieldForAction");
		});

		QUnit.test("createNewColumn: IBN", function() {
			// Arrange
			var sRecordType = INTENTBASEDNAV,
				oOldRecord = {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": LOW_IMPORTANCE
					},
					Inline: {Bool: "true"},
					Determining: {Bool: "false"},
					Action: {String: "myAction"},
					InvocationGrouping: {}
				};

			// Act
			var oActualColumn = ColumnType.createNewColumn(sRecordType, oOldRecord);

			// Assert
			var oExpectedColumn = {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: LOW_IMPORTANCE
				},
				RecordType: INTENTBASEDNAV,
				Action: {String: "myAction"},
				SemanticObject:{String: ""},
				Value: {Path: ""}
			};
			assert.deepEqual(oActualColumn, oExpectedColumn, "takes over the action while switching to IBN button");
		});

		/***************************************************/
		QUnit.module("The function getColumnTypeValues");

		QUnit.test("getColumnTypeValues", function() {
			// Arrange
			var oExpectedValue = {
				Chart: {
					displayName: "Chart"
				},
				ConnectedFields: {
					displayName: "Connected Fields"
				},
				Contact: {
					displayName: "Contact"
				},
				DataField: {
					displayName: "Data Field"
				},
				DataFieldForAction: {
					displayName: "Inline Action"
				},
				DataFieldForIntentBasedNavigation: {
					displayName: "Navigation Button"
				},
				DataFieldWithIntentBasedNavigation: {
					displayName: "Navigation Field"
				},
				DataFieldWithNavigationPath: {
					"displayName": "Data Field with Nav Path"
				},
				DataFieldWithUrl: {
					"displayName": "Data Field with URL"
				},
				ProgressIndicator: {
					"displayName": "Progress Indicator"
				},
				RatingIndicator: {
					"displayName": "Rating Indicator"
				}
			};

			// Act
			var oActualValue = ColumnType.getColumnTypeValues();

			// Assert
			assert.deepEqual(oActualValue, oExpectedValue , "returns expected values");

		});

		/***************************************************/
		QUnit.module("The function getColumnType", {

			beforeEach: function() {
				this.oDataEntityTypeStub = {
					namespace: "ns",
					name: "MyEntityType",
					"com.sap.vocabularies.UI.v1.DataPoint#Rating": {
						Visualization: {
							EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
						}
					},
					"com.sap.vocabularies.UI.v1.DataPoint#Progress": {
						Visualization: {
							EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						}
					},
					"com.sap.vocabularies.UI.v1.DataPoint#AverageRating": {
						Visualization: {
							EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
						}
					}
				};
				this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);
			},
			afterEach: function() {
				this.oGetEntityTypeFromAnnotationPathStub.restore();
			}
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELD
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_DATAFIELD , "returns DataField correctly");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDWITHURL
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_DATAFIELDWITHURL , "returns DataFieldWithUrl correctly");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: INTENTBASEDNAV
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);  //each

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_INTENTBASEDNAV , "returns DataFieldWithIBN correctly");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: FORINTENTBASEDNAV,
				Inline: true,
				Determining: false
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_FORINTENTBASEDNAV , "returns DataFieldForIBN correctly");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDWITHNAVPATH
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);  //each

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_DATAFIELDWITHNAVPATH , "returns DataFieldWithNavigationPath correctly");

			this.oGetLineItemRecordStub.restore();
		});


		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Rating"
				}
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);  //each

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_RATING , "returns RatingIndicator correctly");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Progress"
				}
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);  //each

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_PROGRESS , "returns ProgressIndicator correctly");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn =  {
				getModel: function() {
					return {
						getMetaModel: function() {
							return {
								getODataEntityType: function() {
									return {
										namespace: "ns",
										name: "MyEntityType",
										"MyEntityType": {
											"com.sap.vocabularies.UI.v1.DataPoint#Progress": {
												Visualization: {
													EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
												}
											}
										}
									};
								}
							};
						}
					};
				}
			};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath: "to_CollaborativeReview/@" + DATAPOINT + "#Progress"
				}
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);  //each

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_PROGRESS , "returns ProgressIndicator correctly");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn =  {
				getModel: function() {
					return {
						getMetaModel: function() {
							return {
								getODataEntityType: function() {
									return {
										namespace: "ns",
										name: "MyEntityType",
										"MyEntityType": {
											"com.sap.vocabularies.UI.v1.DataPoint#AverageRating": {
												Visualization: {
													EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
												}
											}
										}
									};
								}
							};
						}
					};
				}
			};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath: "to_CollaborativeReview/@" + DATAPOINT + "#AverageRating"
				}
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);  //each

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_RATING , "returns RatingIndicator correctly for qualifier <> RATING");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart#SpecificationWeightBulletChart"
				}
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);  //each

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_CHART , "returns Chart correctly");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath: "@com.sap.vocabularies.Communication.v1.Contact#Supplier"
				}
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);  //each

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_CONTACT , "returns Contact correctly");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORACTION,
				Inline: true,
				Determining: true
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);  //each

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_TOOLBARBUTTON , "returns ToolbarButton correctly");

			this.oGetLineItemRecordStub.restore();
		});

		QUnit.test("getColumnType", function() {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORACTION,
				Inline: true
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);  //each

			// Act
			var sActualColumnType = ColumnType.getColumnType(oColumn);

			// Assert
			assert.equal(sActualColumnType, COLUMNTYPE_DATAFIELDFORACTION , "returns DataFieldForAction correctly");

			this.oGetLineItemRecordStub.restore();
		});

		/***************************************************/
		QUnit.module("The function setColumnType", {
			beforeEach: function() {
				this.oColumn = {};
				this.oSetP13nDataStub = sinon.stub(DesigntimeUtils, "_setP13nData");
				this.oGetEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getEntityType").returns("MyEntityType");
				this.aLineItemStub = [{
					Value: {Path: "Column1Property"}
				}, {
					Value: {Path: "Column2Property"}
				}];
				this.oGetLineItemsStub = sinon.stub(ChangeHandlerUtils, "getLineItems").returns(this.aLineItemStub);
				this.oChange = {};
			},
			afterEach: function() {
				this.oGetEntityTypeStub.restore();
				this.oGetLineItemsStub.restore();
				this.oSetP13nDataStub.restore();
			}
		});

		QUnit.test("setColumnType: old = new", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_DATAFIELDFORACTION, this.oChange);

			// Assert
			assert.equal(aChangeContent, undefined , "returns empty array if the column type remains the same");
			assert.notOk(this.oChange.refreshPropertiesPane, "no refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("setColumnType from DataFieldForAction to Datafield", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELD,
				Value: { Path: "Column1Property" }
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(0);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_DATAFIELD, this.oChange);

			// Assert
			var oOldValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": this.aLineItemStub
				}
			};
			assert.deepEqual(aChangeContent[0].content.oldValue, oOldValue , "returns right old content after a switch from Action to Datafield at position 0");

			var oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							RecordType: DATAFIELD,
							Value: {Path: "Column1Property"},
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}, {
							Value: {Path: "Column2Property"}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewValue , "returns right new content after a switch from Action to Datafield at position 0");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
		});

		QUnit.test("setColumnType from DataField to DataFieldForAction", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELD);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDFORACTION
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(0);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_DATAFIELDFORACTION, this.oChange);

			// Assert
			var oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Action: {
								String: ""
							},
							Determining: {
								Bool: "false"
							},
							Inline: {
								Bool: "true"
							},
							RecordType: DATAFIELDFORACTION,
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}, {
							Value: {Path: "Column2Property"}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewValue , "returns right new content after a switch from DataField to DataFieldForAction at position 0");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
		});

		QUnit.test("setColumnType from DataField to DataFieldWithIntentBasedNavigation ", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELD);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: INTENTBASEDNAV
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(0);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_INTENTBASEDNAV, this.oChange);

			// Assert
			var oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Action: { String: "" },
							RecordType: INTENTBASEDNAV,
							SemanticObject: { String: "" },
							Value: {Path: "Column1Property"},
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}, {
							Value: {Path: "Column2Property"}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewValue , "returns right new content after a switch from DataField to DataFieldWithIntentBasedNavigation at position 0");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
		});

		QUnit.test("setColumnType from DataField to DataFieldForIntentBasedNavigation", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELD);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: INTENTBASEDNAV
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(0);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_FORINTENTBASEDNAV, this.oChange);

			// Assert
			var oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Action: { String: "" },
							RecordType: FORINTENTBASEDNAV,
							Inline: { Bool: "true" },
							Determining: { Bool: "false" },
							SemanticObject: { String: "" },
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}, {
							Value: {Path: "Column2Property"}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewValue , "returns right new content after a switch from DataField to DataFieldForIntentBasedNavigation at position 0");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
		});

		QUnit.test("setColumnType from DataField to DataFieldWithNavigationPath", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELD);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDWITHNAVPATH
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(0);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_DATAFIELDWITHNAVPATH, this.oChange);

			// Assert
			var oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							RecordType: DATAFIELDWITHNAVPATH,
							Target: {
								NavigationPropertyPath: ""
							},
							Value: {
								Path: "Column1Property"
							},
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}, {
							Value: {Path: "Column2Property"}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewValue , "returns right new content after a switch from DataField to DataFieldWithNavigationPath at position 0");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
		});

		QUnit.test("setColumnType from DataFieldForAction to DatafieldWithUrl", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDWITHURL,
				Value: { Path: "Column2Property" }
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(1);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_DATAFIELDWITHURL, this.oChange);

			var oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Value: {Path: "Column1Property"}
						}, {
							RecordType: DATAFIELDWITHURL,
							Url: { String: "" },
							Value: {Path: "Column2Property"},
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewValue , "returns right new content after a switch from Action to DatafieldWithUrl at position 1");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
		});

		QUnit.test("setColumnType from DataFieldForAction to Chart", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDFORANNOTATION,
				Value: { Path: "Column2Property" }
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(1);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_CHART, this.oChange);

			// Assert
			var oNewRecord = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Value: {Path: "Column1Property"}
						}, {
							RecordType: DATAFIELDFORANNOTATION,
							Target: {
								"AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#FE"
							},
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}
					]
				}
			};
			var oNewChart = {
				"MyEntityType": {
					"com.sap.vocabularies.UI.v1.Chart#FE": {
						"ChartType": {
							"EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Area"
						},
						"MeasureAttributes": [
							{
								"Measure": {
									"PropertyPath": ""
								},
								"RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
								"Role": {
									"EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
								}
							}
						],
						"Measures": [
							{
								"PropertyPath": ""
							}
						],
						"RecordType": "com.sap.vocabularies.UI.v1.ChartDefinitionType"
					}
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewChart , "returns right new content after a switch from action to chart at position 1");
			assert.deepEqual(aChangeContent[1].content.newValue, oNewRecord , "returns right new content after a switch from action to chart at position 1");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
		});

		QUnit.test("setColumnType from DataFieldForAction to Contact", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDFORANNOTATION,
				Value: { Path: "Column2Property" }
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(1);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_CONTACT, this.oChange);

			// Assert
			var oNewRecord = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Value: {Path: "Column1Property"}
						}, {
							RecordType: DATAFIELDFORANNOTATION,
							Target: {
								"AnnotationPath": "@com.sap.vocabularies.Communication.v1.Contact#FE"
							},
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							},
							Label: {
								String: "New Contact"
							}
						}
					]
				}
			};
			var oNewContact = {
				MyEntityType: {
					"com.sap.vocabularies.Communication.v1.Contact#FE": {
						RecordType: "com.sap.vocabularies.Communication.v1.ContactType"
					}
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewContact , "returns right new content after a switch from action to contact at position 1");
			assert.deepEqual(aChangeContent[1].content.newValue, oNewRecord , "returns right new content after a switch from action to contact at position 1");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
		});

		QUnit.test("setColumnType to Rating, no Datapoint yet", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDFORANNOTATION,
				Value: { Path: "Column2Property" }
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(1);
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType"
			};
			this.oGetODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(this.oDataEntityTypeStub);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_RATING, this.oChange);

			// Assert
			var oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Value: {Path: "Column1Property"}
						},{
							RecordType: DATAFIELDFORANNOTATION,
							Target: {"AnnotationPath": "@" + DATAPOINT + "#FE"},
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[1].content.newValue, oNewValue , "returns right new LineItem after a switch from action to rating, no previous datapoint");

			oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.DataPoint#FE": {
						TargetValue: {String: "4"},
						Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Rating"},
						RecordType: DATAPOINT + "Type",
						Title: {String: "Rating"}
					}
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewValue , "returns right new Datapoint after a switch from action to rating, no previous datapoint");
			assert.deepEqual(aChangeContent[0].content.oldValue, undefined , "returns undefined for old value of datapoint after a switch from action to rating, no previous datapoint");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
			this.oGetODataEntityTypeStub.restore();
		});

		QUnit.test("setColumnType to Rating, Datapoint exists", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDFORANNOTATION,
				Value: { Path: "Column2Property" }
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(1);
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.DataPoint#FE": {
					Visualization: {
						EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
					}
				}
			};
			this.oGetODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(this.oDataEntityTypeStub);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_RATING, this.oChange);

			// Assert
			var oNewColumn = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Value: {Path: "Column1Property"}
						}, {
							RecordType: DATAFIELDFORANNOTATION,
							Target: {"AnnotationPath": "@" + DATAPOINT + "#FE"},
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[1].content.newValue, oNewColumn , "returns right new LineItem after a switch from action to rating, datapoint exists");
			var oNewRatingIndicator = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.DataPoint#FE": {
						RecordType: "com.sap.vocabularies.UI.v1.DataPointType",
						TargetValue: {String: "4"},
						Title: {String: "Rating"},
						Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Rating"}
					}
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewRatingIndicator , "returns new data point for new rating indicator");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
			this.oGetODataEntityTypeStub.restore();
		});

		QUnit.test("setColumnType to Progress, no Datapoint yet", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDFORANNOTATION,
				Value: { Path: "Column2Property" }
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(1);
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType"
			};
			this.oGetODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(this.oDataEntityTypeStub);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_PROGRESS, this.oChange);

			// Assert
			var oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Value: {Path: "Column1Property"}
						}, {
							RecordType: DATAFIELDFORANNOTATION,
							Target: {"AnnotationPath": "@" + DATAPOINT + "#FE"},
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[1].content.newValue, oNewValue , "returns right new LineItem after a switch from action to progress, no previous datapoint");

			oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.DataPoint#FE": {
						TargetValue: {String: "100"},
						Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"},
						RecordType: DATAPOINT + "Type",
						Title: {String: "Progress"}
					}
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewValue , "returns right new Datapoint after a switch from action to progress, no previous datapoint");
			assert.deepEqual(aChangeContent[0].content.oldValue, undefined , "returns undefined for old value of datapoint after a switch from action to progress, no previous datapoint");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
			this.oGetODataEntityTypeStub.restore();
		});

		QUnit.test("setColumnType to Progress, Datapoint exists", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDFORANNOTATION,
				Value: { Path: "Column2Property" }
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(1);
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.DataPoint#FE": {
					Visualization: {
						EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
					}
				}
			};
			this.oGetODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(this.oDataEntityTypeStub);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_PROGRESS, this.oChange);

			// Assert
			var oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Value: {Path: "Column1Property"}
						}, {
							RecordType: DATAFIELDFORANNOTATION,
							Target: {"AnnotationPath": "@" + DATAPOINT + "#FE"},
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[1].content.newValue, oNewValue , "returns right new LineItem after a switch from action to progress, datapoint exists");
			var oNewProgressIndicator = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.DataPoint#FE": {
						RecordType: "com.sap.vocabularies.UI.v1.DataPointType",
						TargetValue: {String: "100"},
						Title: {String: "Progress"},
						Visualization: {EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"}
					}
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewProgressIndicator , "returns the new progress indicator");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
			this.oGetODataEntityTypeStub.restore();
		});

		QUnit.test("setColumnType to Connected Fields", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);
			var oNewColumnStub =  {
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: HIGH_IMPORTANCE
				},
				RecordType: DATAFIELDFORANNOTATION,
				Target: { AnnotationPath: "@" + FIELDGROUP + "#FE" }
			};
			this.oCreateNewColumStub = sinon.stub(DesigntimeUtils, "createNewColumn").returns(oNewColumnStub);
			this.oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(1);
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.DataPoint#FE": {
					Visualization: {
						EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
					}
				}
			};
			this.oGetODataEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getODataEntityType").returns(this.oDataEntityTypeStub);

			// Act
			var aChangeContent = ColumnType.setColumnType(this.oColumn, COLUMNTYPE_CONNECTEDFIELDS, this.oChange);

			// Assert
			var oNewValue = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.LineItem": [
						{
							Value: {Path: "Column1Property"}
						}, {
							RecordType: DATAFIELDFORANNOTATION,
							Target: { AnnotationPath: "@" + FIELDGROUP + "#FE" },
							"com.sap.vocabularies.UI.v1.Importance": {
								EnumMember: HIGH_IMPORTANCE
							}
						}
					]
				}
			};
			assert.deepEqual(aChangeContent[1].content.newValue, oNewValue , "returns right new LineItem after a switch from action to progress, datapoint exists");
			var oNewFieldGroup = {
				MyEntityType: {
					"com.sap.vocabularies.UI.v1.FieldGroup#FE": {
						"Data": [{
							"Value": {
								"Path": "Column2Property"
							},
							"RecordType": "com.sap.vocabularies.UI.v1.DataField"
						}],
						"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
					}
				}
			};
			assert.deepEqual(aChangeContent[0].content.newValue, oNewFieldGroup , "returns the new field group");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			this.oGetColumnTypeStub.restore();
			this.oGetLineItemRecordIndexStub.restore();
			this.oCreateNewColumStub.restore();
			this.oGetODataEntityTypeStub.restore();
		});
	});

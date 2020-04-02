/**
 * tests for the sap.suite.ui.generic.template.designtime.Column.designtime.js
 */

sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/js/AnnotationHelper",
		"sap/base/util/isEmptyObject",
		"sap/m/Column"
	],
	function (sinon, ChangeHandlerUtils, DesigntimeUtils, AnnotationHelper, isEmptyObject) {
		"use strict";

		var CHARTTYPE_DONUT = "com.sap.vocabularies.UI.v1.ChartType/Donut",
			MEASURE_ROLE_TYPE = "com.sap.vocabularies.UI.v1.ChartMeasureRoleType",
			MEASURE_ATTRIBUTE_TYPE = "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
			DATAFIELD = "com.sap.vocabularies.UI.v1.DataField",
			DATAFIELDFORANNOTATION = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			DATAPOINT = "com.sap.vocabularies.UI.v1.DataPoint";

		QUnit.dump.maxDepth = 20;

		/***************************************************/
		QUnit.module("The function ignoreAllProperties", {
			beforeEach: function () {
				this.allProperties = {};
				this.oManagedObjectStub = {
					getMetadata: function () {
						return {
							getAllProperties: function () {
								return this.allProperties;
							}.bind(this)
						};
					}.bind(this)
				};
			}
		});

		QUnit.test("ignoreAllProperties", function () {
			// Act
			var oProperties = DesigntimeUtils.ignoreAllProperties(this.oManagedObjectStub);

			// Assert
			assert.ok(isEmptyObject(oProperties), "reacts properly on empty property list");
		});

		QUnit.test("ignoreAllProperties", function () {
			// Arrange
			this.allProperties = {
				firstProperty: {
					someAttribute: "someValue"
				}
			};

			// Act
			var oProperties = DesigntimeUtils.ignoreAllProperties(this.oManagedObjectStub);

			// Assert
			assert.deepEqual(oProperties, {
				firstProperty: {
					ignore: true
				}
			}, "sets ignore for a single property");
		});

		QUnit.test("ignoreAllProperties", function () {
			// Arrange
			this.allProperties = {
				firstProperty: {
					someAttribute: "someValue"
				},
				secondProperty: {
					someAttribute: "someValue"
				}
			};

			// Act
			var oProperties = DesigntimeUtils.ignoreAllProperties(this.oManagedObjectStub);

			// Assert
			var oExpected = {
				firstProperty: {
					ignore: true
				},
				secondProperty: {
					ignore: true
				}
			};
			assert.deepEqual(oProperties, oExpected, "sets ignore for a single property");
		});

		/********************************************************************************/
		QUnit.module("The function getButtonProperties", {
			beforeEach: function () {
				this.allProperties = {
					firstProperty: {
						ignore: true
					}
				};
				this.oIgnoreAllPropertiesStub = sinon.stub(DesigntimeUtils, "ignoreAllProperties").returns(this.allProperties);
			},
			afterEach: function () {
				this.oIgnoreAllPropertiesStub.restore();
			}
		});

		QUnit.test("getButtonProperties", function () {
			// Arrange
			var oElement = {};

			// Act
			var oProperties = DesigntimeUtils.getButtonProperties(oElement);

			// Assert
			var oExpected = {
				firstProperty: {
					ignore: true
				},
				visible: {
					ignore: false
				}
			};
			assert.deepEqual(oProperties, oExpected, "Properties are active as expected");
		});

		/********************************************************************************/
		QUnit.module("The function getTableProperties", {
			beforeEach: function () {
				this.allProperties = {
					firstProperty: {
						ignore: true
					}
				};
				this.oIgnoreAllPropertiesStub = sinon.stub(DesigntimeUtils, "ignoreAllProperties").returns(this.allProperties);
			},
			afterEach: function () {
				this.oIgnoreAllPropertiesStub.restore();
			}
		});

		QUnit.test("getTableProperties", function () {
			// Arrange
			var oElement = {};

			// Act
			var oProperties = DesigntimeUtils.getTableProperties(oElement);

			// Assert
			var oExpected = {
				firstProperty: {
					ignore: true
				},
				mode: {
					ignore: false
				},
				sticky: {
					ignore: false
				}
			};
			assert.deepEqual(oProperties, oExpected, "Properties are active as expected");
		});
		/***************************************************/
		QUnit.module("The function modifyDataPointForChart");

		QUnit.test("modifyDataPointForChart is called without annotationPath", function () {
			// Arrange
			var aCustomChanges = [],
				oMeasure = {
					Measure: {
						PropertyPath: "Product"
					},
					Role: {
						EnumMember: MEASURE_ROLE_TYPE + "/Axis1"
					}
				},
				oDataEntityTypeStub = {
					namespace: "ns",
					name: "MyEntityType",
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
						ChartType: {
							EnumMember: CHARTTYPE_DONUT
						}
					},
					"com.sap.vocabularies.UI.v1.DataPoint#Product": {
						TargetValue: {
							Path: "Height",
							EdmType: "Edm.Decimal"
						},
						Title: {
							String: "Weight"
						},
						Value: {
							Path: "Weight",
							EdmType: "Edm.Decimal"
						}
					}
				};

			// Act
			DesigntimeUtils.modifyDataPointForChart("MyEntityType", oDataEntityTypeStub, oMeasure, aCustomChanges);

			// Assert
			var aExpected = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						MyEntityType: {
							"com.sap.vocabularies.UI.v1.DataPoint#Product": {
								TargetValue: {
									EdmType: "Edm.Decimal",
									Path: "Height"
								},
								Title: {
									String: "Weight"
								},
								Value: {
									EdmType: "Edm.Decimal",
									Path: "Weight"
								}
							}
						}
					},
					oldValue: {
						MyEntityType: {
							"com.sap.vocabularies.UI.v1.DataPoint#Product": {
								TargetValue: {
									EdmType: "Edm.Decimal",
									Path: "Height"
								},
								Title: {
									String: "Weight"
								},
								Value: {
									EdmType: "Edm.Decimal",
									Path: "Weight"
								}
							}
						}
					}
				}
			}];
			assert.deepEqual(aCustomChanges, aExpected, "returns old = new");
		});

		QUnit.test("modifyDataPointForChart is called without annotationPath and without property path", function () {
			// Arrange
			var aCustomChanges = [],
				oMeasure = {},
				oDataEntityTypeStub = {
					namespace: "ns",
					name: "MyEntityType",
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
						ChartType: {
							EnumMember: CHARTTYPE_DONUT
						}
					},
					"com.sap.vocabularies.UI.v1.DataPoint#Product": {
						TargetValue: {
							Path: "Height",
							EdmType: "Edm.Decimal"
						},
						Title: {
							String: "Weight"
						},
						Value: {
							Path: "Weight",
							EdmType: "Edm.Decimal"
						}
					}
				};

			// Act
			DesigntimeUtils.modifyDataPointForChart("MyEntityType", oDataEntityTypeStub, oMeasure, aCustomChanges);

			// Assert
			assert.deepEqual(aCustomChanges, [], "No DataPoint created, as Measure is empty.");
		});

		QUnit.test("modifyDataPointForChart is called without annotationPath and without property path, datapoint exists", function () {
			// Arrange
			var aCustomChanges = [],
				oMeasure = {},
				oDataEntityTypeStub = {
					namespace: "ns",
					name: "MyEntityType",
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
						ChartType: {
							EnumMember: CHARTTYPE_DONUT
						}
					},
					"com.sap.vocabularies.UI.v1.DataPoint#Chart0": {
						TargetValue: {
							Path: "Height",
							EdmType: "Edm.Decimal"
						},
						Title: {
							String: "Weight"
						},
						Value: {
							Path: "Weight",
							EdmType: "Edm.Decimal"
						}
					}
				};

			// Act
			DesigntimeUtils.modifyDataPointForChart("MyEntityType", oDataEntityTypeStub, oMeasure, aCustomChanges);

			// Assert
			assert.deepEqual(aCustomChanges, [], "No DataPoint created, as Measure is empty.");
		});

		QUnit.test("modifyDataPointForChart is called with annotation path", function () {
			// Arrange
			var aCustomChanges = [],
				oMeasure = {
					Measure: {
						PropertyPath: "Product"
					},
					Role: {
						EnumMember: "Axis1"
					},
					DataPointAnnotationPath: {
						AnnotationPath: "@" + DATAPOINT + "#Product"
					},
					DataPoint: {
						Criticality: {
							Path: "ProductValueAddedTax",
							EdmType: "Edm.Byte"
						},
						Description: {
							String: "Bullet Micro Chart"
						}
					}
				},
				oDataEntityTypeStub = {
					namespace: "ns",
					name: "MyEntityType",
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
						ChartType: {
							EnumMember: CHARTTYPE_DONUT
						}
					},
					"com.sap.vocabularies.UI.v1.DataPoint#Product": {
						TargetValue: {
							Path: "Height",
							EdmType: "Edm.Decimal"
						},
						Title: {
							String: "Weight"
						}
					}
				};

			// Act
			DesigntimeUtils.modifyDataPointForChart("MyEntityType", oDataEntityTypeStub, oMeasure, aCustomChanges);

			// Assert
			var aExpectedChanges = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						MyEntityType: {
							"com.sap.vocabularies.UI.v1.DataPoint#Product": {
								Criticality: {
									EdmType: "Edm.Byte",
									Path: "ProductValueAddedTax"
								},
								Description: {
									String: "Bullet Micro Chart"
								},
								Value: {
									Path: "Product"
								},
								TargetValue: {
									Path: "Height",
									EdmType: "Edm.Decimal"
								},
								Title: {
									String: "Weight"
								}
							}
						}
					},
					oldValue: {
						MyEntityType: {
							"com.sap.vocabularies.UI.v1.DataPoint#Product": {
								TargetValue: {
									Path: "Height",
									EdmType: "Edm.Decimal"
								},
								Title: {
									String: "Weight"
								}
							}
						}
					}
				}
			}];
			assert.deepEqual(aCustomChanges, aExpectedChanges, "returns actualized DataPoint, Value.Path filled from Measure");
		});

		/***************************************************/
		QUnit.module("The function getChartFromColumn");

		QUnit.test("getChartFromColumn", function () {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELD
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType"
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);

			// Act
			var oChart = DesigntimeUtils.getChartFromColumn(oColumn);

			// Assert
			assert.equal(oChart, undefined, "returns undefined in case of a column of record type <> DataFieldForAnnotation");

			this.oGetLineItemRecordStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
		});

		QUnit.test("getChartFromColumn", function () {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType"
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);

			// Act
			var oChart = DesigntimeUtils.getChartFromColumn(oColumn);

			// Assert
			assert.equal(oChart, undefined, "returns undefined if record type = DataFieldForAnnotation, but no annotation path exists");

			this.oGetLineItemRecordStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
		});

		QUnit.test("getChartFromColumn", function () {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart#SpecificationWeightBulletChart"
				}
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath");

			// Act
			var oChart = DesigntimeUtils.getChartFromColumn(oColumn);

			// Assert
			assert.equal(oChart, undefined, "returns undefined if record type = DataFieldForAnnotation, but no chart annotation exists");

			this.oGetLineItemRecordStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
		});

		QUnit.test("getChartFromColumn", function () {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart#SpecificationWeightBulletChart"
				}
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.Chart#SpecificationWeightBulletChart": {
					test: "me"
				}
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);

			// Act
			var oChart = DesigntimeUtils.getChartFromColumn(oColumn);

			// Assert
			var oExpected = {
				chartID: "com.sap.vocabularies.UI.v1.Chart#SpecificationWeightBulletChart",
				entityType: this.oDataEntityTypeStub
			};
			assert.deepEqual(oChart, oExpected, "returns the chart for a column that refers to it");

			this.oGetLineItemRecordStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
		});

		QUnit.test("getChartFromColumn", function () {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart"
				}
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.Chart": {
					test: "me"
				}
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);

			// Act
			var oChart = DesigntimeUtils.getChartFromColumn(oColumn);

			// Assert
			var oExpected = {
				chartID: "com.sap.vocabularies.UI.v1.Chart",
				entityType: this.oDataEntityTypeStub
			};
			assert.deepEqual(oChart, oExpected, "returns the chart if there is no qualifier");

			this.oGetLineItemRecordStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
		});

		QUnit.test("getChartFromColumn", function () {
			// Arrange
			var oColumn = {};
			var oRecord = {
				RecordType: DATAFIELDFORANNOTATION,
				Target: {
					AnnotationPath: "to_ProductSalesRevenue/@UI.Chart#GrossSalesRevenueBulletChart"
				}
			};
			this.oGetLineItemRecordStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordForColumn").returns(oRecord);
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "ProductSalesRevenueType",
				"com.sap.vocabularies.UI.v1.Chart#GrossSalesRevenueBulletChart": {
					test: "me"
				}
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);

			// Act
			var oChart = DesigntimeUtils.getChartFromColumn(oColumn);

			// Assert
			var oExpected = {
				chartID: "com.sap.vocabularies.UI.v1.Chart#GrossSalesRevenueBulletChart",
				entityType: this.oDataEntityTypeStub
			};
			assert.deepEqual(oChart, oExpected, "returns the chart for a column via navigation property");

			this.oGetLineItemRecordStub.restore();
			this.oGetEntityTypeFromAnnotationPathStub.restore();
		});

		/***************************************************/
		QUnit.module("The function getChartFromFacet");

		QUnit.test("getChartFromFacet", function () {
			// Arrange
			var oFacet = {};
			this.oTemplatingInfo = {
				value: "@com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart"
			};
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart": {
					test: "me"
				}
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);
			this.oGetTemplatingInfoStub = sinon.stub(ChangeHandlerUtils, "getTemplatingInfo").returns(this.oTemplatingInfo);
			// Act
			var oChart = DesigntimeUtils.getChartFromFacet(oFacet);

			// Assert
			var oExpected = {
				chartID: "com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart",
				entityType: this.oDataEntityTypeStub
			};
			assert.deepEqual(oChart, oExpected, "returns the chart for a facet that refers to it");

			this.oGetEntityTypeFromAnnotationPathStub.restore();
			this.oGetTemplatingInfoStub.restore();
		});

		QUnit.test("getChartFromFacet", function () {
			// Arrange
			var oFacet = {};
			this.oTemplatingInfo = {
				value: "to_ProductSalesPrice/@com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart"
			};
			this.oDataEntityTypeStub = {
				namespace: "ns",
				name: "MyEntityType",
				"com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart": {
					test: "me"
				}
			};
			this.oGetEntityTypeFromAnnotationPathStub = sinon.stub(ChangeHandlerUtils, "getEntityTypeFromAnnotationPath").returns(this.oDataEntityTypeStub);
			this.oGetTemplatingInfoStub = sinon.stub(ChangeHandlerUtils, "getTemplatingInfo").returns(this.oTemplatingInfo);

			// Act
			var oChart = DesigntimeUtils.getChartFromFacet(oFacet);

			// Assert
			var oExpected = {
				chartID: "com.sap.vocabularies.UI.v1.Chart#SalesPriceAreaChart",
				entityType: this.oDataEntityTypeStub
			};
			assert.deepEqual(oChart, oExpected, "returns the chart for a facet that refers to it");

			this.oGetEntityTypeFromAnnotationPathStub.restore();
			this.oGetTemplatingInfoStub.restore();
		});

		/***************************************************/
		QUnit.module("The function getChartFromParent");

		QUnit.test("getChartFromParent case 1", function () {
			//Arrange
			var oElement = {
				getMetadata: function () {
					return {
						getElementName: function () {
							return "sap.m.Column";
						}
					}
				}
			};
			var oColumn = {
				chartID: "com.sap.vocabularies.UI.v1.Chart#SpecificationWeightBulletChart"
			};
			var oGetChartFromColumnStub = sinon.stub(DesigntimeUtils, "getChartFromColumn").returns(oColumn);

			//Act
			DesigntimeUtils.getChartFromParent(oElement);

			//Assert
			assert.equal(oGetChartFromColumnStub.calledOnce, true, "getChartFromParent is called with getChartFromColumn");
			oGetChartFromColumnStub.restore();
		});

		QUnit.test("getChartFromParent case 2", function () {
			//Arrange
			var oElement = {
				getMetadata: function () {
					return {
						getElementName: function () {
							return "sap.m.VBox";
						}
					}
				}
			};
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
			var oGetChartFromFacetStub = sinon.stub(DesigntimeUtils, "getChartFromFacet").returns(oChart);

			//Act
			DesigntimeUtils.getChartFromParent(oElement);

			//Assert
			assert.equal(oGetChartFromFacetStub.calledOnce, true, "getChartFromParent is called with getChartFromFacet");
			oGetChartFromFacetStub.restore();
		});

		QUnit.test("getChartFromParent case 3", function () {
			//Arrange
			var oElement = {};

			//Act
			var oExpected = DesigntimeUtils.getChartFromParent(oElement);

			//Assert
			assert.equal(undefined, oExpected, "getChartFromParent is called but returns nothing");
		});

		/***************************************************/
		QUnit.module("The function _setP13nData", {
			beforeEach: function () {
				this.oColumn = {
					data: function () {
						return {
							columnKey: "currentKey"
						};
					}
				};
				this.oDataSpy = sinon.spy(this.oColumn, "data");
				this.oCreateP13NColumnKeyStub = sinon.stub(AnnotationHelper, "createP13NColumnKey").returns("myColumnKey");
			},
			afterEach: function () {
				this.oCreateP13NColumnKeyStub.restore();
			}
		});

		QUnit.test("_setP13nData", function () {
			// Arrange
			var oNewColumnData = {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "to nowhere"
				}
			};

			// Act
			DesigntimeUtils._setP13nData(this.oColumn, oNewColumnData);

			// Assert
			var oExpected = {
				columnKey: "myColumnKey",
				leadingProperty: "to nowhere"
			};
			assert.strictEqual(this.oDataSpy.callCount, 2, "data function has been called twice.");
			assert.deepEqual(this.oDataSpy.getCall(1).args[0], "p13nData", "data function has been called for the right custom data.");
			assert.deepEqual(this.oDataSpy.getCall(1).args[1], oExpected, "data content is right for DataField.");
		});

		QUnit.test("_setP13nData", function () {
			// Arrange
			var oNewColumnData = {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				Value: {
					Path: "to nowhere"
				}
			};

			// Act
			DesigntimeUtils._setP13nData(this.oColumn, oNewColumnData);

			// Assert
			var oExpected = {
				columnKey: "to nowhere",
				leadingProperty: "to nowhere"
			};
			assert.strictEqual(this.oDataSpy.callCount, 2, "data function has been called twice.");
			assert.deepEqual(this.oDataSpy.getCall(1).args[0], "p13nData", "data function has been called for the right custom data.");
			assert.deepEqual(this.oDataSpy.getCall(1).args[1], oExpected, "data content is right for DataFieldWithUrl.");
		});

		QUnit.test("_setP13nData", function () {
			// Arrange
			var oNewColumnData = {
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {}
			};

			// Act
			DesigntimeUtils._setP13nData(this.oColumn, oNewColumnData);

			// Assert
			var oExpected = {
				columnKey: "myColumnKey", //as stubbed
				leadingProperty: ""
			};
			assert.strictEqual(this.oDataSpy.callCount, 2, "data function has been called twice.");
			assert.deepEqual(this.oDataSpy.getCall(1).args[0], "p13nData", "data function has been called for the right custom data.");
			assert.deepEqual(this.oDataSpy.getCall(1).args[1], oExpected, "data content is right for DataField without Value.Path");
		});

		QUnit.test("_setP13nData", function () {
			// Arrange
			var oNewColumnData = {
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				Value: {}
			};

			// Act
			DesigntimeUtils._setP13nData(this.oColumn, oNewColumnData);

			// Assert
			var oExpected = {
				columnKey: "",
				leadingProperty: ""
			};
			assert.strictEqual(this.oDataSpy.callCount, 2, "data function has been called twice.");
			assert.deepEqual(this.oDataSpy.getCall(1).args[0], "p13nData", "data function has been called for the right custom data.");
			assert.deepEqual(this.oDataSpy.getCall(1).args[1], oExpected, "data content is right for DataField without Value.Path");
		});

		/***************************************************/
		QUnit.module("The function addSettingsHandler", {
			beforeEach: function () {
				this.mPropertyBag = {};
				this.oTargetButton = {
					sId: "Button ID"
				};
				this.aAction = [{
					sId: "Project::sap.suite.ui.generic.template.ObjectP…t--action::ActionSEPMRA_C_PD_ProductActivation"
				}, {
					sId: "Project::sap.suite.ui.generic.template.ObjectP…t--action::ActionSEPMRA_C_PD_ProductCreate_review_post"
				}];
				this.sChangeHandler = "addHeaderAndFooterActionButton";
				this.sFunctionImport = "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/FunctionImport_1"
				var oAppComponentForControl = {
					getModel: function () {
						return {
							getMetaModel: function () {
								return {
									getODataEntityContainer: function () {
										return {
											"functionImport": [{
												"name": "SEPMRA_C_PD_ProductActivation",
												"entitySet": "SEPMRA_C_PD_Product"
											}, {
												"name": "SEPMRA_C_PD_ProductCopy",
												"entitySet": "SEPMRA_C_PD_Product"
											}],
											"name": "SEPMRA_PROD_MAN_Entities",
											"namespace": "SEPMRA_PROD_MAN",
											property: [
												"newAction"
											]
										};
									}
								};
							}
						};
					}
				};
				this.oGetAppComponentForControlStub = sinon.stub(sap.ui.fl.Utils, "getAppComponentForControl").returns(oAppComponentForControl);
				var oCustomDataObject = {
					Action: "SEPMRA_C_PD_ProductActivation",
					InvocationGrouping: "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet",
					Label: "Activate",
					Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
					"sap-ui-custom-settings": {
						"sap.build": "#patternX"
					}
				};
				this.oGetCustomDataObject = sinon.stub(ChangeHandlerUtils, "getCustomDataObject").returns(oCustomDataObject);
				this.oConfirmEvent = {};

				var that = this;
				this.oDialogStub = sinon.stub(sap.ui, "xmlfragment").returns({
					attachConfirm: function (fnFunction) {
						fnFunction(that.oConfirmEvent);
					},
					attachSearch: function (fnFunction) {
						fnFunction(that.oSearchEvent);
					},
					open: function () {
						return
					},
					addStyleClass: function () {
						return
					},
					setModel: function () {
						return
					},
					getBinding: function () {
						return {
							filter: function () {}
						}
					}
				});
				this.oSearchEvent = {
					getParameter: function () {
						return "FunctionImport 1"
					},
					getSource: function () {
						return {
							getBinding: function () {
								return {
									filter: function () {
										return;
									}
								}
							}
						};
					}
				};
			},
			afterEach: function () {
				this.oGetAppComponentForControlStub.restore();
				this.oGetCustomDataObject.restore();
				this.oDialogStub.restore();
			}
		});

		QUnit.test("addSettingsHandler", function () {
			// Arrange
			var oExpectedResult = [{
				selectorControl: this.oTargetButton,
				changeSpecificData: {
					changeType: this.sChangeHandler,
					content: {
						newFunctionImport: this.sFunctionImport
					}
				}
			}];
			this.oConfirmEvent = {
				getParameter: function () {
					return [{
						getObject: function () {
							return {
								name: "FunctionImport_1"
							};
						}
					}];
				},
				getSource: function () {
					return {
						getBinding: function () {
							return {
								filter: function () {
									return;
								}
							}
						}
					}
				}
			};
			// Act
			var oActualPromise = DesigntimeUtils.addSettingsHandler(this.oTargetButton, this.mPropertyBag, this.aAction, this.sChangeHandler);

			// Assert
			return oActualPromise.then(function (oResult) {
				assert.deepEqual(oResult, oExpectedResult, "Testing addSettingsHandler function: Promise resolved");
			});

		});

		/***************************************************/
		QUnit.module("The function createNewChart");

		QUnit.test("createNewChart: DataPoint with Qualifier", function () {
			// Arrange
			var sQualifier = "MyQualifier",
				oExpected = {
					"ChartType": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Area"
					},
					"Measures": [{
						"PropertyPath": ""
					}],
					"MeasureAttributes": [{
						"Measure": {
							"PropertyPath": ""
						},
						"Role": {
							"EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
					}],
					"RecordType": "com.sap.vocabularies.UI.v1.ChartDefinitionType"
				};

			// Act
			var oResult = DesigntimeUtils.createNewChart(sQualifier);

			// Assert
			assert.deepEqual(oResult, oExpected, "A correct chart was created");
		});

		QUnit.test("createNewChart: DataPoint without Qualifier", function () {
			// Arrange
			var oExpected = {
				"ChartType": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ChartType/Area"
				},
				"Measures": [{
					"PropertyPath": ""
				}],
				"MeasureAttributes": [{
					"Measure": {
						"PropertyPath": ""
					},
					"Role": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
				}],
				"RecordType": "com.sap.vocabularies.UI.v1.ChartDefinitionType"
			};

			// Act
			var oResult = DesigntimeUtils.createNewChart();

			// Assert
			assert.deepEqual(oResult, oExpected, "A correct chart was created");
		});

		/***************************************************/
		QUnit.module("The function createNewDataPointForChart");

		QUnit.test("createNewDataPointForChart", function () {
			// Arrange
			var oExpected = {
				"CriticalityCalculation": {
					"ImprovementDirection": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.CriticalityCalculationType"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataPointType"
			};

			// Act
			var oResult = DesigntimeUtils.createNewDataPointForChart();

			// Assert
			assert.deepEqual(oResult, oExpected, "The correct DataPoint was created");
		});

		/***************************************************/
		QUnit.module("The function fixQualifierForAnnotationPath", {
			beforeEach: function () {
				this.sTerm = "Term";
				this.aAnnotations;
				this.sBasicQualifier;
				this.iCurrentIndex;
			},
			afterEach: function () {}
		});

		QUnit.test("fixQualifierForAnnotationPath", function () {

			// Act
			var sTermWithQualifier = DesigntimeUtils.fixQualifierForAnnotationPath(this.aAnnotations, this.sTerm, this.BasicQualifier, this.iCurrentIndex);

			// Assert
			assert.equal(sTermWithQualifier, this.sTerm, "returns the basic term if no basic qualifier is given");

		});

		QUnit.test("fixQualifierForAnnotationPath", function () {
			// Arrange
			this.sBasicQualifier = "Rating";

			// Act
			var sTermWithQualifier = DesigntimeUtils.fixQualifierForAnnotationPath(this.aAnnotations, this.sTerm, this.sBasicQualifier, this.iCurrentIndex);

			// Assert
			assert.equal(sTermWithQualifier, "Term#Rating",
				"returns the right term with qualifier if a basic qualifier is specified and no annotation records exist");
		});

		QUnit.test("fixQualifierForAnnotationPath", function () {
			// Arrange
			this.sBasicQualifier = "Rating";
			this.iCurrentIndex = 1;
			this.aAnnotations = [{
				Value: "path"
			}, {
				Value: "ownIndex"
			}];

			// Act
			var sTermWithQualifier = DesigntimeUtils.fixQualifierForAnnotationPath(this.aAnnotations, this.sTerm, this.sBasicQualifier, this.iCurrentIndex);

			// Assert
			assert.equal(sTermWithQualifier, "Term#Rating", "returns the right qualifier if a basic qualifier is " +
				"specified and the term is not used by other annotation record");
		});

		QUnit.test("fixQualifierForAnnotationPath", function () {
			// Arrange
			this.sBasicQualifier = "Rating";
			this.aAnnotations = [{
				Target: {
					AnnotationPath: "@Term#Rating"
				}
			}, {
				Value: "ownIndex"
			}];
			this.iCurrentIndex = 1;

			// Act
			var sTermWithQualifier = DesigntimeUtils.fixQualifierForAnnotationPath(this.aAnnotations, this.sTerm, this.sBasicQualifier, this.iCurrentIndex);

			// Assert
			assert.equal(sTermWithQualifier, "Term#Rating1", "returns a new qualifier if the basic one is already in use");
		});

		QUnit.test("fixQualifierForAnnotationPath", function () {
			// Arrange
			this.sBasicQualifier = "Rating";
			this.aAnnotations = [{
				Target: {
					AnnotationPath: "@Term#Rating"
				}
			}, {
				Value: "ownIndex"
			}, {
				Target: {
					AnnotationPath: "@Term#Rating1"
				}
			}];
			this.iCurrentIndex = 1;

			// Act
			var sTermWithQualifier = DesigntimeUtils.fixQualifierForAnnotationPath(this.aAnnotations, this.sTerm, this.sBasicQualifier, this.iCurrentIndex);

			// Assert
			assert.equal(sTermWithQualifier, "Term#Rating2", "returns a new qualifier if the basic one is already in use");
		});

		QUnit.test("fixQualifierForAnnotationPath", function () {
			// Arrange
			this.sBasicQualifier = "Rating";
			this.aAnnotations = [{
				Value: "otherIndex"
			}, {
				Target: {
					AnnotationPath: "@Term#Rating"
				}
			}];
			this.iCurrentIndex = 1;

			// Act
			var sTermWithQualifier = DesigntimeUtils.fixQualifierForAnnotationPath(this.aAnnotations, this.sTerm, this.sBasicQualifier, this.iCurrentIndex);

			// Assert
			assert.equal(sTermWithQualifier, "Term#Rating", "returns the old qualifier if the own record exclusively targets the annotation");
		});

		QUnit.test("fixQualifierForAnnotationPath", function () {
			// Arrange
			this.aAnnotations = [{
				Target: {
					AnnotationPath: "@Term"
				}
			}, {
				Value: "ownIndex"
			}];
			this.iCurrentIndex = 1;

			// Act
			var sTermWithQualifier = DesigntimeUtils.fixQualifierForAnnotationPath(this.aAnnotations, this.sTerm, this.sBasicQualifier, this.iCurrentIndex);

			// Assert
			assert.equal(sTermWithQualifier, "Term#1", "returns a new qualifier if no basic qualifier is provided, but" +
				" the term is already used by another annotation record");

		});

		QUnit.test("fixQualifierForAnnotationPath", function () {
			// Arrange
			this.aAnnotations = [{
				Target: {
					AnnotationPath: "@Term#1"
				}
			}, {
				Value: "ownIndex"
			}, {
				Target: {
					AnnotationPath: "@Term"
				}
			}];
			this.iCurrentIndex = 1;
			// Act
			var sTermWithQualifier = DesigntimeUtils.fixQualifierForAnnotationPath(this.aAnnotations, this.sTerm, this.sBasicQualifier, this.iCurrentIndex);

			// Assert
			assert.equal(sTermWithQualifier, "Term#2", "returns a new qualifier if no basic qualifier is provided, but" +
				" the term is already used by another annotation record");

		});

		QUnit.test("getItemsForSmartFilterCustomPopUp", function () {
			// Arrange
			var oControl = {
				getParent: function () {
					return {
						sId: "parentIdpart1-parentIdpart2"
					}
				},
				getContent: function () {
					return [{
						getContent: function () {
							return [{
								sId: ""
							}, {
								sId: "parentIdpart1-parentIdpart2-Product1"
							}]
						}
					}];
				}
			};
			var getPropertiesForCustomPopUpStub = sinon.stub(ChangeHandlerUtils, "getPropertiesForCustomPopUp").returns(
				[{
					"sap:label": "Product",
					"name": "Product1",
					"sap:quickinfo": "Product2"
				}, {
					"sap:label": "Price",
					"name": "Price1"
				}, {
					"name": "Pricexx"
				}]);
			var expectedResult = [{
				label: "Product (Product1)",
				tooltip: "Product2",
				id: "Product1",
				changeSpecificData: {
					changeOnRelevantContainer: true,
					changeType: "addFilterItem",
					content: {
						"sap:label": "Product",
						"name": "Product1",
						"sap:quickinfo": "Product2"
					}
				}
			}, {
				label: "Price (Price1)",
				tooltip: "Price",
				id: "customId0",
				changeSpecificData: {
					changeOnRelevantContainer: true,
					changeType: "addFilterItem",
					content: {
						"sap:label": "Price",
						"name": "Price1"
					}
				}
			}, {
				label: "Pricexx",
				tooltip: undefined,
				id: "customId1",
				changeSpecificData: {
					changeOnRelevantContainer: true,
					changeType: "addFilterItem",
					content: {
						"name": "Pricexx"
					}
				}
			}];
			// Act
			var result = DesigntimeUtils.getItemsForSmartFilterCustomPopUp(oControl);

			// Assert
			assert.deepEqual(result, expectedResult, "formats and returns the correct data");

			//clean
			getPropertiesForCustomPopUpStub.restore();
		});

	});

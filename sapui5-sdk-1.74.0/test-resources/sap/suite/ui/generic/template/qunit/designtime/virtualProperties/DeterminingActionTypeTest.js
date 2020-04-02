/**
 * tests for the sap.suite.ui.generic.template.designtime.virtualProperties.DeterminingActionType.js
 */

sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/js/AnnotationHelper",
		"sap/suite/ui/generic/template/designtime/virtualProperties/DeterminingActionType",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils"
	],
	function(sinon, ChangeHandlerUtils, AnnotationHelper, DeterminingActionType, DesigntimeUtils) {
		"use strict";

		QUnit.dump.maxDepth = 20;

		/***************************************************/
		QUnit.module("The function getActionTypeValues");

		QUnit.test("getActionTypeValues", function() {
			// Arrange
			var oExpectedValue = {
				DataFieldForAction: {
					displayName: "DataField For Action"
				},
				DataFieldForIntentBasedNavigation: {
					displayName: "DataField For IBN"
				}
			};

			// Act
			var oActualValue = DeterminingActionType.getActionTypeValues();

			// Assert
			assert.deepEqual(oActualValue, oExpectedValue , "returns expected values");
		});

		QUnit.module("The function related to DeterminingActionType", {
			beforeEach: function() {
				this.DETERMINING_FOR_ACTION = "DataFieldForAction";
				this.DETERMINING_FOR_IBN = "DataFieldForIntentBasedNavigation";
				var oEntityType = {
					"com.sap.vocabularies.UI.v1.Identification": [
						{
							Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
							Determining: {Bool: "true"},
							InvocationGrouping: {EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"},
							Label: {String: "COPY"},
							RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
							"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
						}
					]
				};
				this.oElement = {
					getMetadata: function() {
						return {
							getElementName: function() {
								return "sap.m.Button";
							},
							getAllProperties: function() {
								return {};
							}
						};
					},
					getId: function() {
						return "action::STTA_PROD_MAN.STTA_PROD_MAN_Entities::STTA_C_MP_ProductCopy::Determining";
					},
					getModel: function() {
						return {
							getMetaModel: function() {
								return {
									getODataEntityType: function() {
										return oEntityType;
									}
								};
							}
						};
					},
					data: function() {
						return {
							"sap.ui.dt": {
								"annotation": {
								}
							}
						};
					}
				};
				this.oTempInfo = {
					annotation: "com.sap.vocabularies.UI.v1.Identification",
					annotationContext: {
						Action: { String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy" },
						Determining: { Bool: "true" },
						InvocationGrouping: { EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"},
						Label: { String: "COPY" },
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						"com.sap.vocabularies.UI.v1.Importance": { EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
					},
					path: "/dataServices/schema/0/entityType/17/com.sap.vocabularies.UI.v1.Identification/0",
					target: "STTA_PROD_MAN.STTA_C_MP_ProductType",
					value: { String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy" }
				};
				var that = this;
				this.oGetTempInfoStub = sinon.stub(ChangeHandlerUtils, "getTemplatingInfo").returns(that.oTempInfo);
				this.oChange = {};
			},
			afterEach: function() {
				this.oGetTempInfoStub.restore();
			}
		});

		QUnit.test("getDeterminingActionType case 1", function() {
			// Arrange
			var sExpectedDeterminingActionType = this.DETERMINING_FOR_ACTION;

			// Act
			var sActualDeterminingActionType = DeterminingActionType.get(this.oElement);

			// Assert
			assert.equal(sActualDeterminingActionType, sExpectedDeterminingActionType, "DatafieldForAction is returned");
		});

		QUnit.test("getDeterminingActionType case 2", function() {
			// Arrange
			var sExpectedDeterminingActionType = this.DETERMINING_FOR_IBN;
			this.oTempInfo.annotationContext = {
				Action: { String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy" },
				Determining: { Bool: "true" },
				Label: { String: "COPY" },
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
				SemanticObject: ""
			};
			// Act
			var sActualDeterminingActionType = DeterminingActionType.get(this.oElement);
			 // Assert
			assert.equal(sActualDeterminingActionType, sExpectedDeterminingActionType, "DatafieldForIBN is returned");
		});

		QUnit.test("getDeterminingActionType case 3", function() {
			// Arrange
			this.oTempInfo.annotationContext = {
				Action: { String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy" },
				Determining: { Bool: "true" },
				Label: { String: "COPY" },
				RecordType: "",
				SemanticObject: ""
			};
			// Act
			var sActualDeterminingActionType = DeterminingActionType.get(this.oElement);

			// Assert
			assert.equal(sActualDeterminingActionType, undefined, "DatafieldForIBN is returned");
		});

		/**** setDeterminingActionType *****************************************************************************/

		QUnit.test("setDeterminingActionType case 1 DatafieldForAction", function() {
			// Arrange
			var oGetStub = sinon.stub(DeterminingActionType.get, "getDeterminingActionType").returns(this.DETERMINING_FOR_ACTION);
			var sNewActionElementType = this.DETERMINING_FOR_IBN;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			var aExpectedChange = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"STTA_PROD_MAN.STTA_C_MP_ProductType": {
							"com.sap.vocabularies.UI.v1.Identification": [
								{
									"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"},
									RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
									Determining: {Bool: "true"},
									Label: {String: "COPY"},
									SemanticObject: {String: ""},
									Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"}
								}
							]
						}
					},
					oldValue: {
						"STTA_PROD_MAN.STTA_C_MP_ProductType": {
							"com.sap.vocabularies.UI.v1.Identification": [
								{
									Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
									Determining: {Bool: "true"},
									InvocationGrouping: {EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"},
									Label: {String: "COPY"},
									RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
									"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
								}
							]
						}
					}
				}
			}];
			this.oTempInfo.annotationContext = {
				Action: { String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy" },
				Determining: { Bool: "true" },
				InvocationGrouping: { EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"},
				Label: { String: "COPY" },
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				"com.sap.vocabularies.UI.v1.Importance": { EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
			};

			//Act
			var aActualChange = DeterminingActionType.set(this.oElement, sNewActionElementType, this.oChange);

			// Assert
			assert.deepEqual(aActualChange, aExpectedChange, "Annotation changes to DFForIBN is correct");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetStub.restore();
		});

		QUnit.test("setDeterminingActionType case 2 DatafieldForIntentBasedNavigation", function() {
			// Arrange
			var oGetStub = sinon.stub(DeterminingActionType.get, "getDeterminingActionType").returns(this.DETERMINING_FOR_IBN);
			var sNewActionElementType = this.DETERMINING_FOR_ACTION;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			var aExpectedChange = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"STTA_PROD_MAN.STTA_C_MP_ProductType": {
							"com.sap.vocabularies.UI.v1.Identification": [
								{
									"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"},
									RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
									Determining: {Bool: "true"},
									InvocationGrouping: {EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"},
									Label: {String: "COPY"},
									Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"}
								}
							]
						}
					},
					oldValue: {
						"STTA_PROD_MAN.STTA_C_MP_ProductType": {
							"com.sap.vocabularies.UI.v1.Identification": [
								{
									Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
									Determining: {Bool: "true"},
									Label: {String: "COPY"},
									RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
									SemanticObject: {String: ""},
									"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
								}
							]
						}
					}
				}
			}];
			var oEntityType = {
				"com.sap.vocabularies.UI.v1.Identification": [
					{
						Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
						Determining: {Bool: "true"},
						Label: {String: "COPY"},
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: {String: ""},
						"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
					}
				]
			};
			this.oElement.getModel = function() {
				return {
					getMetaModel: function() {
						return {
							getODataEntityType: function() {
								return oEntityType;
							}
						};
					}
				};
			};
			this.oTempInfo.annotationContext = {
				Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
				Determining: {Bool: "true"},
				Label: {String: "COPY"},
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
				SemanticObject: {String: ""},
				"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
			};

			// Act
			var aActualChange = DeterminingActionType.set(this.oElement, sNewActionElementType, this.oChange);

			// Assert
			assert.deepEqual(aActualChange, aExpectedChange, "Annotation changes to DFForAction is correct");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetStub.restore();
		});

		QUnit.test("setDeterminingActionType case 3 Annotation with empty object", function() {
			// Arrange
			var oGetStub = sinon.stub(DeterminingActionType.get, "getDeterminingActionType").returns(this.DETERMINING_FOR_IBN);
			var sNewActionElementType = this.DETERMINING_FOR_ACTION;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
			var aExpectedChange = [{
				changeType: "annotationTermChange",
				content: {
					newValue: {
						"STTA_PROD_MAN.STTA_C_MP_ProductType": {
							"com.sap.vocabularies.UI.v1.Identification": [
								{
									"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"},
									RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
									Determining: {Bool: "true"},
									Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
									InvocationGrouping: {EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"}
								}
							]
						}
					},
					oldValue: {
						"STTA_PROD_MAN.STTA_C_MP_ProductType": {
							"com.sap.vocabularies.UI.v1.Identification": [
								{
									Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
									Determining: {Bool: "true"},
									Label: {String: "COPY"},
									RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
									SemanticObject: {String: ""},
									"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
								}
							]
						}
					}
				}
			}];
			var oEntityType = {
				"com.sap.vocabularies.UI.v1.Identification": [
					{
						Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
						Determining: {Bool: "true"},
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: {String: ""},
						"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
					}
				]
			};
			this.oElement.getModel = function() {
				return {
					getMetaModel: function() {
						return {
							getODataEntityType: function() {
								return oEntityType;
							}
						};
					}
				};
			};
			this.oTempInfo.annotationContext = {
				Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
				Determining: {Bool: "true"},
				Label: {},
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
				SemanticObject: {String: ""},
				"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
			};

			//Act
			var aActualChange = DeterminingActionType.set(this.oElement, sNewActionElementType, this.oChange);
			var sActualChange = JSON.stringify(aActualChange[0].content.newValue);
			var sExpectedChange = JSON.stringify(aExpectedChange[0].content.newValue);

			//Assert
			assert.equal(sActualChange, sExpectedChange, "New Annotation with no empty property is generated");
			assert.ok(this.oChange.refreshPropertiesPane, "refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetStub.restore();
		});

		QUnit.test("setDeterminingActionType case 4 invalid index case", function() {
			// Arrange
			var oGetStub = sinon.stub(DeterminingActionType.get, "getDeterminingActionType").returns(this.DETERMINING_FOR_IBN);
			var sNewActionElementType = this.DETERMINING_FOR_ACTION;
			var iAnnotationIndexStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(-1);
			var oEntityType = {
				"com.sap.vocabularies.UI.v1.Identification": [
					{
						Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
						Determining: {Bool: "true"},
						Label: {String: "COPY"},
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: {String: ""},
						"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
					}
				]
			};
			this.oElement.getModel = function() {
				return {
					getMetaModel: function() {
						return {
							getODataEntityType: function() {
								return oEntityType;
							}
						};
					}
				};
			};
			this.oTempInfo.annotationContext = {
				Action: {String: "STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopy"},
				Determining: {Bool: "true"},
				Label: {String: "COPY"},
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
				SemanticObject: {String: ""},
				"com.sap.vocabularies.UI.v1.Importance": {EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"}
			};
			//Assert
			assert.throws(function() { DeterminingActionType.set(this.oElement, sNewActionElementType, this.oChange) },"invalid index for old determining action");
			assert.notOk(this.oChange.refreshPropertiesPane, "no refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			iAnnotationIndexStub.restore();
			oGetStub.restore();
		});

		QUnit.test("setDeterminingActionType case 5", function() {
			// Arrange
			var oGetStub = sinon.stub(DeterminingActionType.get, "getDeterminingActionType").returns(this.DETERMINING_FOR_ACTION);
			var sNewActionElementType = this.DETERMINING_FOR_ACTION;

			// Act
			var aActualChange = DeterminingActionType.set(this.oElement, sNewActionElementType, this.oChange);

			//Assert
			assert.deepEqual(aActualChange, undefined, "Annotation change is not generated when no change");
			assert.notOk(this.oChange.refreshPropertiesPane, "no refresh of properties pane will be triggered");
			assert.ok(this.oChange.noRefreshOnChange, "no retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			oGetStub.restore();
		});

		QUnit.test("setDeterminingActionType case 6", function() {
			// Arrange
			var oGetStub = sinon.stub(DeterminingActionType.get, "getDeterminingActionType").returns(this.DETERMINING_FOR_IBN);

			// Act
			var aActualChange = DeterminingActionType.set(this.oElement);

			// Assert
			assert.deepEqual(aActualChange, undefined, "Annotation change is not generated when sNewActionElementType is not passed");
			assert.notOk(this.oChange.refreshPropertiesPane, "no refresh of properties pane will be triggered");
			assert.notOk(this.oChange.noRefreshOnChange, "retemplating will be triggered");
			assert.notOk(this.oChange.delayRefresh, "delayRefresh was reset");

			// Cleanup
			oGetStub.restore();
		});

	});

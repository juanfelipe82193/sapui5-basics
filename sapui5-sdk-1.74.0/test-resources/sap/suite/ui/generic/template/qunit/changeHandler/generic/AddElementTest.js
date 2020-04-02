/**
 * tests for the sap.suite.ui.generic.template.changeHandler.generic.RevealElement
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/changeHandler/generic/AddElement",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/lib/testableHelper"
],
function(sinon, AddElement, ChangeHandlerUtils, AnnotationChangeHandler, testableHelper) {
	"use strict";

	QUnit.module("AddElement Test Module", {

		beforeEach: function() {
			this.oContent = {};
			this.oChange = {
				getContent: function() {
					return this.oContent;
				}.bind(this)
			};
			this.oSpecificChangeInfo = {
				bindingPath: "newColumn",
				index: 1,
				parentId: "tableId",
				custom: {
					annotation: "com.sap.vocabularies.UI.v1.LineItem",
					fnGetAnnotationIndex: function() {
						return 2;
					},
					oAnnotationTermToBeAdded: {
						EdmType: undefined,
						RecordType: "com.sap.vocabularies.UI.v1.DataField",
						Value: {
							Path: "newColumn"
						},
						"com.sap.vocabularies.UI.v1.Importance": {
							EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
						}
					}
				}
			};
			this.oPropertyBag = {
				modifier: {
					bySelector: function() {
						return {
							getCustomData: function() {
								return [{
									getKey: function() {
										return "p13nData";
									},
									getValue: function() {
										return {
											leadingProperty: "Column3Property"
										};
									}
								}];
							},
							data: function() {
								return {
									leadingProperty: "Column3Property"
								};
							},
							getId: function() {
								return "tableId";
							},
							getParent: function() {
								return {
									getEntitySet: function() {
										return "SEPMRA_C_PD_Product";
									},
									getId: function() {
										return "parentId";
									}
								};
							},
							getEntityType: function() {
								return {
									entityType: "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType"
								};
							}
						};
					},
					getSelector: function() {
						return {
							id: "elementId",
							idIsLocal: false
						};
					}
				}
			};

			var oMetaModel = {
				getODataEntitySet: function() {
					return {
						entityType: "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType"
					};
				},
				getODataEntityType: function() {
					return {
						"com.sap.vocabularies.UI.v1.LineItem": [{
							Value: {
								Path: "Column1Property"
							}
						}, {
							Value: {
								Path: "Column2Property"
							}
						}],
						"com.sap.vocabularies.UI.v1.SelectionFields": [
							{
							PropertyPath: "Column1Property"
							}, {
							PropertyPath: "Column2Property"
							}
						],
						property: [
							"newColumn"
						]
					};
				}
			};

			this.oGetMetaModelStub = sinon.stub(ChangeHandlerUtils, "getMetaModel").returns(oMetaModel);
			this.oCreateAnnotationTermChangeStub = sinon.stub(AnnotationChangeHandler, "createCustomAnnotationTermChange").returns(this.oContent);
			this.oCreateCustomChangesStub = sinon.stub(AnnotationChangeHandler, "createCustomChanges");
		},
		afterEach: function() {
			this.oContent = null;
			this.oChange = null;
			this.oSpecificChangeInfo = null;
			this.oPropertyBag = null;

			this.oGetMetaModelStub.restore();
			this.oCreateAnnotationTermChangeStub.restore();
			this.oCreateCustomChangesStub.restore();
		}
	});

	QUnit.test("AddElement test case 1", function(assert) {

		//Arrange
		var aLineItemOld = [{
			Value: {
				Path: "Column1Property"
				}
			}, {
			Value: {
				Path: "Column2Property"
			}
		}];

		var aLineItem = [{
			Value: {
				Path: "Column1Property"
				}
			}, {
			Value: {
				Path: "Column2Property"
				}
			}, {
			EdmType: undefined,
			RecordType: "com.sap.vocabularies.UI.v1.DataField",
			Value: {
				Path: "newColumn"
				},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
				}
			}];

		//Act
		AddElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

		var aParameters = this.oCreateAnnotationTermChangeStub.firstCall.args;

		//Assert
		assert.deepEqual(aParameters[0].entityType, "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType", "sEntityType parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[1], aLineItem, "aLineItem parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[2], aLineItemOld, "aLineItemOld parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[3], "com.sap.vocabularies.UI.v1.LineItem",	"LINEITEM parameter of createCustomAnnotationTermChange is correct.");

		assert.equal(this.oCreateAnnotationTermChangeStub.calledOnce, true, "createCustomAnnotationTermChange has been called.");
		assert.equal(this.oCreateCustomChangesStub.calledOnce, true, "createCustomChanges has been called.");
	});

	QUnit.test("AddElement test case 2", function(assert) {

		//Arrange
		this.oSpecificChangeInfo = {
				bindingPath: "newColumn",
				index: 1,
				parentId: "tableId",
				custom: {
					annotation: "com.sap.vocabularies.UI.v1.LineItem",
					oAnnotationTermToBeAdded: {
						EdmType: undefined,
						RecordType: "com.sap.vocabularies.UI.v1.DataField",
						Value: {
							Path: "newColumn"
						},
						"com.sap.vocabularies.UI.v1.Importance": {
							EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
						}
					}
				}
			};
		//Act
		AddElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
		
		//Assert
		assert.equal(this.oCreateAnnotationTermChangeStub.calledOnce, true, "createCustomAnnotationTermChange has been called.");
		assert.equal(this.oCreateCustomChangesStub.calledOnce, true, "createCustomChanges has been called.");
	});

	QUnit.test("AddElement test case 3", function(assert) {

		//Arrange
		this.oSpecificChangeInfo = {
				bindingPath: "newColumn",
				index: 1,
				parentId: "tableId",
				custom: {
					annotation: "com.sap.vocabularies.UI.v1.LineItem",
					oAnnotationTermToBeAdded: {
						EdmType: undefined,
						RecordType: "com.sap.vocabularies.UI.v1.DataField",
						Value: {
							Path: "newColumn"
						},
						"com.sap.vocabularies.UI.v1.Importance": {
							EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
						}
					}
				}
			};
		//Act
		AddElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

		//Assert
		assert.equal(this.oCreateAnnotationTermChangeStub.calledOnce, true, "createCustomAnnotationTermChange has been called.");
		assert.equal(this.oCreateCustomChangesStub.calledOnce, true, "createCustomChanges has been called.");
	});

	QUnit.test("AddElement test templating data function", function(assert) {

		//Arrange
		this.oPropertyBag = {
				modifier: {
					bySelector: function() {
						return {
							getCustomData: function() {
								return [{
									getKey: function() {
										return "sap-ui-custom-settings";
									},
									getValue: function() {
										return {
											"sap.ui.dt": {
												annotation: '{"target":"SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType","annotation":"com.sap.vocabularies.UI.v1.SelectionFields","value":"Column3Property"}'
											}
										};
									}
								}];
							},
							data: function(oSapUiCustomSettings) {
								return {
										"sap.ui.dt": {
											annotation: '{"target":"SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType","annotation":"com.sap.vocabularies.UI.v1.SelectionFields","value":"Column3Property"}'
										}
								};
							},
							sParentAggregationName: "content",
							getParent: function() {
								return {
									getParent: function() {
										return {
											getEntitySet: function() {
												return "SEPMRA_C_PD_Product";
											}
										};
									},
									getId: function() {
										return "parentId";
									},
									getAggregation: function() {
										return [{
											getId: function() {
												return "elementId";
											}
										}];
									}
								};
							},
							getId: function() {
								return "parentId";
							}
						};
					},
					getSelector: function() {
						return {
							"id": "elementId",
							"idIsLocal": false
						};
					}
				}
			};

		this.oSpecificChangeInfo = {
				bindingPath: "newColumn",
				index: 1,
				parentId: "tableId",
				custom: {
					annotation: "com.sap.vocabularies.UI.v1.SelectionFields",
					fnGetAnnotationIndex: function() {
						return 2;
					},
					fnGetRelevantElement: function(oRevealedElement) {
						return oRevealedElement;
					},
					oAnnotationTermToBeAdded: {
						PropertyPath: "Column3Property"
					}
				}
		};
		//Act
		AddElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

		//Assert
		assert.equal(this.oCreateAnnotationTermChangeStub.calledOnce, true, "createCustomAnnotationTermChange has been called.");
		assert.equal(this.oCreateCustomChangesStub.calledOnce, true, "createCustomChanges has been called.");
	});

	QUnit.test("jQuery extend", function(assert) {

		//Arrange
		this.oCreateCustomChangesStub.returns({ testValue: "ok" });

		//Act
		AddElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

		//Assert
		assert.deepEqual(this.oChange.getContent().testValue, "ok", "oChange.getContent has been extended with mChanges.");
	});

	QUnit.module("AddElement: applyChange method");

	QUnit.test("Testing applyChange method", function(assert) {
		//Arrange
		testableHelper.startTest();
		var oStubForPrivate = testableHelper.getStaticStub();
		var ofnAddElementStub = sinon.stub(oStubForPrivate, "fnAddElement");
		var fnTemplatingInfo = function() {
			// add templating info
		};
		var oControlsToBeAdded = {
			oControl: {
				sId: "sGroupElementId",
				type: "GroupElement",
				insertFunction: "insertGroupElement",
				fnTemplatingInfo: fnTemplatingInfo,
				oChild: {
					oControl: {
						sId: "sSmartFieldId",
						type: "SmartField",
						mSettings: {
							value: "{oSpecificChangeInfo.bindingPath}"
						},
						insertFunction: "insertElement"
					}
				}
			}
		};
		var oChange = {
			getContent: function() {
				return {
					customChanges: [{
						oParentSelector: {
							id: "elementId",
							idIsLocal: false
						}
					}]
				};
			},
			getDefinition: function() {
				return {
				};
			}
		};
		var oParentSelector = oChange.getContent().customChanges[0].oParentSelector;

		var oPropertyBag = {
			modifier: {
				bySelector: function() {
					return {
						insertGroupElement: function () {
						},
						insertElement: function() {
						}
					};
				}
			}
		};

		var oBySelectorSpy = sinon.spy(oPropertyBag.modifier, "bySelector");

		//Act
		AddElement.applyChange(oChange, null, oPropertyBag, oControlsToBeAdded);

		//Assert
		assert.equal(oBySelectorSpy.calledWith(oChange.getContent().customChanges[0].oParentSelector), true, "bySelector has been called with the correct parameter.");
		assert.equal(JSON.stringify(ofnAddElementStub.getCall(0).args), JSON.stringify([oControlsToBeAdded, oPropertyBag.modifier.bySelector(oParentSelector)]), "fnAddElement has been called with the correct parameters.");

		//Cleanup
		ofnAddElementStub.restore();
		oBySelectorSpy.restore();
		testableHelper.endTest();
	});

	QUnit.module("AddElement: fnAddElement method", {
		beforeEach: function() {
			// Arrange
			testableHelper.startTest();
			this.oStubForPrivate = testableHelper.getStaticStub();

			this.fnTemplatingInfo = function() {
				// add templating info
			};
			this.oControlsToBeAdded = {
				oControl: {
					sId: "sGroupElement2",
					type: "GroupElement",
					insertFunction: "insertGroupElement",
					fnTemplatingInfo: this.fnTemplatingInfo,
					oChild: {
						oControl: {
							sId: "sSmartField2",
							type: "SmartField",
							mSettings: {
								value: "{oSpecificChangeInfo.bindingPath}"
							},
							insertFunction: "insertElement"
						}
					}
				}
			};
			this.ofnCreateElementStub = sinon.stub(this.oStubForPrivate, "fnCreateElement").returns({
				insertElement: function() {
				},
				getId: function() {
					return "sGroupElement2";
				}
			});
		},
		afterEach: function() {
			this.ofnCreateElementStub.restore();
			testableHelper.endTest();
		}
	});

	QUnit.test("fnAddElement: GroupElement example", function(assert) {
		// Act
		var oElement = this.oStubForPrivate.fnAddElement(this.oControlsToBeAdded);

		// Assert
		assert.deepEqual(oElement.getId(), "sGroupElement2", "Correct element is returned");
		assert.equal(this.ofnCreateElementStub.calledWith(this.oControlsToBeAdded.oControl), true, "fnCreateElement function has been called with the correct parameter.");
	});

	QUnit.test("fnAddElement: GroupElement example passing oRootElement", function(assert) {
		// Arrange
		var oRootElement = {
			insertGroupElement: function() {
				oRootElement.groupElements = [
					"sGroupElement2"
					]
			},
			getGroupElements: function() {
				return oRootElement.groupElements;
			}
		};

		// Act
		var oElement = this.oStubForPrivate.fnAddElement(this.oControlsToBeAdded, oRootElement);

		// Assert
		assert.deepEqual(oElement.getGroupElements()[0], "sGroupElement2", "Correct element is returned");
		assert.equal(this.ofnCreateElementStub.calledWith(this.oControlsToBeAdded.oControl), true, "fnCreateElement function has been called with the correct parameter.");
	});

	QUnit.module("AddElement: fnCreateElement method", {
		beforeEach: function() {
			// Arrange
			testableHelper.startTest();
			this.oStubForPrivate = testableHelper.getStaticStub();
			this.fnTemplatingInfo = function(oElement) {
				var oCustomData = new sap.ui.core.CustomData({"key": "sap-ui-custom-settings", "value": "oTemplData"});
				oElement.addCustomData(oCustomData);
			};
			this.oControlsToBeAdded = {
				oControl: {
					sId: "sGroupElement3",
					type: "GroupElement",
					iTargetIndex: 1,
					insertFunction: "insertGroupElement",
					oChild: {
						oControl: {
							sId: "sSmartField3",
							type: "SmartField",
							mSettings: {
								value: "{oSpecificChangeInfo.bindingPath}"
							},
							fnTemplatingInfo: this.fnTemplatingInfo,
							insertFunction: "insertElement"
						}
					}
				}
			};
		},
		afterEach: function() {
			// Cleanup
			testableHelper.endTest();
		}
	});

	QUnit.test("fnCreateElement: GroupElement example", function(assert) {
		// Act
		var oElement = this.oStubForPrivate.fnCreateElement(this.oControlsToBeAdded.oControl.oChild.oControl);

		// Assert
		assert.deepEqual(oElement.getId(), "sSmartField3", "Correct SmartField is created");
		assert.deepEqual(oElement.mBindingInfos.value.parts[0].path, "oSpecificChangeInfo.bindingPath", "Element is created with correct mSettings");
		assert.deepEqual(oElement.data("sap-ui-custom-settings"), "oTemplData", "Element is created with correct templating info");
	});

	QUnit.test("fnCreateElement: GroupElement example", function(assert) {
		// Act
		var oElement = this.oStubForPrivate.fnCreateElement(this.oControlsToBeAdded.oControl);

		// Assert
		assert.deepEqual(oElement.getId(), "sGroupElement3", "Correct GroupElement is created");
	});
});

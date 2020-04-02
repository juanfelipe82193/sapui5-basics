/**
 * tests for the sap.suite.ui.generic.template.changeHandler.AddTableColumn
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/AddTableColumn",
	"sap/suite/ui/generic/template/changeHandler/generic/AddElement",
	"sap/suite/ui/generic/template/lib/testableHelper"
],
function(sinon, ChangeHandlerUtils, AddTableColumn, AddElement, testableHelper) {
	"use strict";

	QUnit.module("AddTableColumn revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = AddTableColumn.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for AddTableColumn action");
	});

	QUnit.module("AddTableColumn applyChange Test Module");

	QUnit.test("ApplyChange", function(assert) {

		//Arrange
		var oChange = {
			getContent: function() {
				return {
					customChanges: [{
						oParentSelector: {
							"id": "elementId",
							"idIsLocal": false
						}
					}]
				};
			},
			getDefinition: function() {
				return {
				};
			}
		};

		var oPropertyBag = {
			modifier: {
				bySelector: function() {
					return "oElement";
				}
			}
		};

		var oApplyChangeStub = sinon.stub(AddElement, "applyChange");
		var oBySelectorSpy = sinon.spy(oPropertyBag.modifier, "bySelector");

		//Act
		AddTableColumn.applyChange(oChange, null, oPropertyBag);

		//Assert
		assert.equal(oBySelectorSpy.calledWith(oChange.getContent().customChanges[0].oParentSelector), true, "bySelector has been called with the correct parameter.");
		assert.equal(oApplyChangeStub.calledWith(oChange, "oElement", oPropertyBag), true, "The function applyChange has been called with the correct parameters.");
		oApplyChangeStub.restore();
		oBySelectorSpy.restore();
	});

	QUnit.module("AddTableColumn Test Module", {

		beforeEach: function() {
			this.oContent = {};
			this.oChange = {
				getContent: function() {
					return this.oContent;
				}.bind(this)
			};
			this.oSpecificChangeInfo = {
				bindingPath: "newColumn"
			};
			this.oPropertyBag = {
				modifier: {
					bySelector: function() {
						return {
							getId: function() {
								return "tableId";
							},
							getParent: function() {
								return {
									getEntitySet: function() {
										return "SEPMRA_C_PD_Product";
									}
								};
							},
							getEntityType: function() {
								return {
									entityType: "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType"
								};
							}
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
						property: [
							"newColumn"
						]
					};
				}
			};

			this.oGetMetaModelStub = sinon.stub(ChangeHandlerUtils, "getMetaModel").returns(oMetaModel);
		},
		afterEach: function() {
			this.oContent = null;
			this.oChange = null;
			this.oSpecificChangeInfo = null;
			this.oPropertyBag = null;

			this.oGetMetaModelStub.restore();
		}
	});

	QUnit.test("AddTableColumn completeContentChange Test", function(assert) {

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
			EdmType: undefined,
			RecordType: "com.sap.vocabularies.UI.v1.DataField",
			Value: {
				Path: "newColumn"
				},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
				}
			}, {
			Value: {
				Path: "Column1Property"
				}
			}, {
			Value: {
				Path: "Column2Property"
			}
		}];
		
		var oCompleteChangeContentSpy = sinon.stub(AddElement, "completeChangeContent");
		
		//Act
		AddTableColumn.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
		//Assert
		assert.equal(oCompleteChangeContentSpy.calledOnce, true, "Add Table Column completeChangeContent is called");
		oCompleteChangeContentSpy.restore();
});

	QUnit.test("AddTableColumn getAnnotationIndex test", function(assert) {

		testableHelper.startTest();
		var oStubForPrivate = testableHelper.getStaticStub();
		//Arrange
		var oOwningElement = {
				getAggregation: function(sStr) {
					return [{
						Value: {
							Path: "Column1Property"
						}
					},{
						Value: {
							Path: "Column2Property"
						}
					}]
				}
		};
		var aAnnotations = [{
			Value: {
				Path: "Column1Property"
				}
			}, {
			Value: {
				Path: "Column2Property"
			}
		}];
		var iExpectedAnnotationIndex = 2;
		var oGetLineItemRecordIndexStub = sinon.stub(ChangeHandlerUtils, "getLineItemRecordIndex").returns(2);
		//Act
		var iAnnotationIndex = oStubForPrivate.AddTableColumn_getAnnotationIndex(oOwningElement, aAnnotations);
		//Assert
		assert.deepEqual(iAnnotationIndex, iExpectedAnnotationIndex, "getAnnotationIndex returns correct annotation index")
		assert.deepEqual(oGetLineItemRecordIndexStub.calledOnce, true, "getLineItemRecordIndex has been called once.");
		testableHelper.endTest();
	});
});

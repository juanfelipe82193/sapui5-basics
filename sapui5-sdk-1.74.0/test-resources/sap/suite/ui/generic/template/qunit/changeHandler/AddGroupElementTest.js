/**
 * tests for the sap.suite.ui.generic.template.changeHandler.AddGroupElement
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/changeHandler/AddGroupElement",
	"sap/suite/ui/generic/template/changeHandler/generic/AddElement",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/base/util/isEmptyObject"
],
function(sinon, AddGroupElement, AddElement, Utils, AnnotationChangeUtils, isEmptyObject) {
	"use strict";

	QUnit.module("AddGroupElement revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = AddGroupElement.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for AddGroupElement action");
	});

	QUnit.module("AddGroupElement Test Module: Test the entire flow", {
		beforeEach: function() {
			this.oChange = {
				getContent: function() {
					return {
						customChanges: [{
							bindingPath: "Field1Property"
						}]
					};
				},
				getDefinition: function() {
					return {
					};
				}
			};
			this.oPropertyBag = {
				modifier: {
					bySelector: function() {
						return {
							getId: function() {
								return "sGroupElementId";
							}
						};
					},
					getSelector: function() {
						return "oElement";
					},
					appComponent: "component"
				}
			};

			this.oSpecificChangeInfo = {
				parentId: "Id",
				bindingPath: "Field1Property",
				index: 1
			};
			this.sBindingPath = this.oSpecificChangeInfo.bindingPath;
			this.oNewField = {
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "Field1Property"
				},
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
				}
			};
			this.fnTemplatingInfo = {};
			this.fnTemplatingInfo[this.sBindingPath] =  function(oElement) {
				var oTemplData = {
					"sap.ui.dt": {
						annotation: {
							annotation: "com.sap.vocabularies.UI.v1.Identification",
							annotationContext: "oNewField",
							path: "sAnnotation" + "/Data/" + this.oSpecificChangeInfo.index,
							target: "entityNameSpace" + "." + "entityName",
							value: this.oSpecificChangeInfo.bindingPath
						}
					}
				};
				var oCustomData = new sap.ui.core.CustomData({"key": "sap-ui-custom-settings", "value": oTemplData});
				oElement.addCustomData(oCustomData);
			};

			this.oControlsToBeAdded = {
				Field1Property: {
					oControl: {
						sId: "sRootControlIdStableIdPartFromFacet::StableIdPartFromDataField::GroupElement",
						type: "GroupElement",
						insertFunction: "insertGroupElement",
						iTargetIndex: 1,
						fnTemplatingInfo: this.fnTemplatingInfo["Field1Property"],
						oChild: {
							oControl: {
								sId: "sRootControlIdStableIdPartFromFacet::StableIdPartFromDataField::SmartField",
								type: "SmartField",
								mSettings: {
									value: "{" + this.oSpecificChangeInfo.bindingPath + "}"
								},
								insertFunction: "insertElement"
							}
						}
					}
				}
			};

			this.oMetaModel = {
				getODataEntitySet: function() {
					return {
						entityType: "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType"
					};
				},
				getODataEntityType: function() {
					return {
						"com.sap.vocabularies.UI.v1.Identification": [{
							Value: {
								Path: "Field1Property"
							}
						}, {
							Value: {
								Path: "Field2Property"
							}
						}],
						property: [{
								name: "Field1Property",
								type: "Edm.String"
							}
						],
						namespace: "entityNameSpace",
						name: "entityName"
					};
				}
			};

			this.oTemplData = {
				target: "SEPMRA_C_PD_ProductType",
				value: "#com.sap.vocabularies.UI.v1.Identification",
				annotationContext: "context"
			};
			this.oRootControlId = {
				getRootControl: function() {
					return {
						getId: function() {
							return "sRootControlId";
						}
					};
				}
			};

			this.oBySelectorSpy = sinon.spy(this.oPropertyBag.modifier, "bySelector");
			this.oGetMetaModelStub = sinon.stub(Utils, "getMetaModel").returns(this.oMetaModel);
			this.oTemplatingInfoStub = sinon.stub(Utils, "getTemplatingInfo").returns(this.oTemplData);
			this.oRootControlIdStub = sinon.stub(Utils, "getComponent").returns(this.oRootControlId);
			this.oGetStableIdPartFromFacetStub = sinon.stub(sap.suite.ui.generic.template.js.AnnotationHelper, "getStableIdPartFromFacet").returns("StableIdPartFromFacet");
			this.oGetStableIdPartFromDataFieldStub = sinon.stub(sap.suite.ui.generic.template.js.AnnotationHelper, "getStableIdPartFromDataField").returns("StableIdPartFromDataField");
		},

		afterEach: function() {
			this.oChange = null;
			this.oPropertyBag = null;
			this.oSpecificChangeInfo = null;
			this.sBindingPath = null;
			this.oNewField = null;
			this.fnTemplatingInfo = null;
			this.oControlsToBeAdded = null;
			this.oMetaModel = null;
			this.oTemplData = null;
			this.oRootControlId = null;
			this.oBySelectorSpy.restore();
			this.oGetMetaModelStub.restore();
			this.oTemplatingInfoStub.restore();
			this.oRootControlIdStub.restore();
			this.oGetStableIdPartFromFacetStub.restore();
			this.oGetStableIdPartFromDataFieldStub.restore();
		}
	});

	QUnit.test("Testing the entire flow", function (assert) {
		// Arange
		this.oApplyChangeStub = sinon.stub(AddElement, "applyChange");

		// Act
		AddGroupElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
		AddGroupElement.applyChange(this.oChange, null, this.oPropertyBag);

		// Assert
		assert.equal(this.oBySelectorSpy.calledWith(this.oSpecificChangeInfo.parentId, this.oPropertyBag.appComponent), true, "bySelector has been called with the correct parameter.");
		assert.equal(this.oApplyChangeStub.calledOnce, true, "The function applyChange is called once");
		assert.equal(isEmptyObject(AddGroupElement.getControlsToBeAdded()), true, "oControlsToBeAdded object is empty");

		// Cleanup
		this.oApplyChangeStub.restore();
	});

	QUnit.test("jQuery extend", function(assert) {
		//Arrange
		this.oContent = {};
		this.oChange = {
			getContent: function() {
				return this.oContent;
			}.bind(this)
		};
		this.oCreateCustomChangesStub = sinon.stub(AnnotationChangeUtils, "createCustomChanges").returns({testValue: "ok"});

		//Act
		AddGroupElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

		//Assert
		assert.deepEqual(this.oChange.getContent(), {testValue: "ok", "noRefreshOnChange": true}, "oChange.getContent has been extended with mChanges");

		//Cleanup
		this.oCreateCustomChangesStub.restore();
		this.oContent = null;
	});
});

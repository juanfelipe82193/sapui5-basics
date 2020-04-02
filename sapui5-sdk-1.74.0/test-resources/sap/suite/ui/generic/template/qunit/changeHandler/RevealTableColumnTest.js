/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RevealTableColumn
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/changeHandler/RevealTableColumn",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/generic/RevealElement"
],
function(sinon, RevealTableColumn, ChangeHandlerUtils, RevealElement) {
	"use strict";

	QUnit.module("RevealTableColumn applyChange Test Module");

	QUnit.test("ApplyChange test", function(assert) {
		//Arrange
		var oChange, oControl,  oPropertyBag;
		var oApplyChangeSpy = sinon.stub(RevealElement, "applyChange");

		//Act
		RevealTableColumn.applyChange(oChange, oControl, oPropertyBag);

		//Assert
		assert.equal(oApplyChangeSpy.calledWith(oChange, oControl, oPropertyBag), true, "Generic RevealElement applyChange has been called with the correct parameters.");
		assert.equal(oApplyChangeSpy.calledOnce, true, "Generic RevealElement applyChange has been called once");
	});

	QUnit.module("RevealTableColumn revertChange Test Module");

	QUnit.test("RevealTableColumn", function(assert) {
		var fnRevertChange = RevealTableColumn.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RevealTableColumn action");
	});

	QUnit.module("RevealTableColumn Test Module", {

		beforeEach: function() {
			this.oSpecificChangeInfo = {
				revealedElementId: "elementId"
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
 							getModel: function() {
								return {
									getMetaModel: function() {
										return {
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
									}
								};
							},
							getParent: function() {
								return {
									getParent: function() {
										return {
											getEntitySet: function() {
												return "SEPMRA_C_PD_Product";
											}
										};
									},
									getAggregation: function() {
										return [{
											getId: function() {
												return "elementId";
											}
										}];
									}
								};
							}
						};
					}
				}
			};
			
			var oModelStub = {
					getMetaModel: function() {
						return oMetaModel;
					}
				};
			var oComponent = {
					getEntitySet: function() {
						return "EntitySet";
					}
			};
			
			this.oComponentStub = sinon.stub(ChangeHandlerUtils, "getComponent").returns(oComponent);
			this.oGetModelStub = sinon.stub(ChangeHandlerUtils, "getModel").returns(oModelStub);
			this.oGetMetaModelStub = sinon.stub(ChangeHandlerUtils, "getMetaModel").returns(oMetaModel);
		},
		afterEach: function() {
			this.oContent = null;
			this.oChange = null;
			this.oSpecificChangeInfo = null;
			this.oPropertyBag = null;

			this.oComponentStub.restore();
			this.oGetModelStub.restore();
			this.oGetMetaModelStub.restore();
		}
	});

	QUnit.test("RevealTableColumn test", function(assert) {

		//Arrange
		var oCompleteChangeContentSpy = sinon.stub(RevealElement, "completeChangeContent");
		//Act
		RevealTableColumn.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
		var oExpectedRevealedAnnotationTerm = {
			revealedElementId: "elementId",
			custom: {
				annotation : "com.sap.vocabularies.UI.v1.LineItem",
				fnGetAnnotationIndex: ChangeHandlerUtils.getLineItemRecordIndex,
				oRevealedAnnotationTerm: {
					Value: {
						Path :"Column3Property" 
					},
					RecordType: "com.sap.vocabularies.UI.v1.DataField"
				}
			}
		}
		//Assert
		assert.deepEqual(this.oSpecificChangeInfo, oExpectedRevealedAnnotationTerm , "oSpecificChangeInfo custom data is made correctly");
		assert.equal(oCompleteChangeContentSpy.calledOnce, true, "Reveal Table Column completeChangeContent is called with correct parameters.");
		assert.equal(oCompleteChangeContentSpy.calledWith(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag), true, "Reveal Table Column completeChangeContent is called with correct parameters.");
	});
});

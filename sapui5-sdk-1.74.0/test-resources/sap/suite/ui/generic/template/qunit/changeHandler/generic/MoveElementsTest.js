/**
 * tests for the sap.suite.ui.generic.template.changeHandler.generic.MoveElements
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/changeHandler/generic/MoveElements",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/ui/fl/changeHandler/MoveControls"
],
function(sinon, MoveElements, ChangeHandlerUtils, AnnotationChangeHandler, MoveControls) {
	"use strict";

	QUnit.module("MoveElements applyChange Test Module");

	QUnit.test("ApplyChange", function(assert) {

		//Arrange
		var oChange = {};
		var oControl = {};
		var oPropertyBag = {};

		var oApplyChangeStub = sinon.stub(MoveControls, "applyChange");

		//Act
		MoveElements.applyChange(oChange, oControl, oPropertyBag);

		//Assert
		assert.equal(oApplyChangeStub.calledWith(oChange, oControl, oPropertyBag), true, "The function applyChange has been called with the correct parameters.");
	});

	QUnit.module("MoveElements Test Module", {

		beforeEach: function() {
			this.isRevert = ChangeHandlerUtils.isRevert;
			this.oContent = {};
			this.oChange = {
				getContent: function() {
					return this.oContent;
				}.bind(this)
			};
			this.oSpecificChangeInfo = {
				source: {
					id: "sourceId",
					aggregation: "content"
				},
				movedElements: [{
					sourceIndex: 2,
					targetIndex: 0
				}],
				custom: {
					annotation: "com.sap.vocabularies.UI.v1.AnnotationTerm",
					fnGetAnnotationIndex: function(oElement, aAnnotations) {
						for (var iIndex = 0; iIndex < aAnnotations.length; iIndex++) {
							if (aAnnotations[iIndex].Value && aAnnotations[iIndex].Value.Path === oElement.data()) {
								return iIndex;
							}
						}
					},
					fnGetRelevantElement: function(oElement) {
						return oElement;
					}
				}
			};

			this.oPropertyBagForOP = {
					modifier: {
						bySelector: function() {
							return {
								getParent: function() {
									return {
										getEntitySet: function() {
											return "EntitySet";
										},
										getId: function(){
											return "id";
										},
										getEntitySet() {
											return "EntitySet";
										},
										getModel() {
											return {
												getMetaModel() {
													return {
														getODataEntitySet() {
															var obj = {entityType: "EntityType"};
															return obj;
														}
													}
												}
											}
										}
									};
								},
								getId: function() {
									return "STTA_MP::Sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable";
								},
							getAggregation: function() {
								// for non-reveal: this already returns the order on the UI after the move (2, 0, 1)!
								// for reveal: this returns the order on the UI before the move
								if (!ChangeHandlerUtils.isReveal) {
									return [{
										getCustomData: function() {},
										data: function() {
											return "Path_2";
										}
									}, {
										getCustomData: function() {},
										data: function() {
											return "Path_0";
										}
									}, {
										getCustomData: function() {},
										data: function() {
											return "Path_1";
										}
									}];
								} else {
									return [{
										getCustomData: function() {},
										data: function() {
											return "Path_0";
										},
										getId: function() {
											return "id--delete"
										}
									}, {
										getCustomData: function() {},
										data: function() {
											return "Path_1";
										},
										getId: function() {
											return "id--edit"
										}
									}, {
										getCustomData: function() {},
										data: function() {
											return "Path_2";
										},
										getId: function() {
											return "id--relatedApps"
										}
									}];
								}
							}
						};
					}
				}
			};

			this.oPropertyBagForLR = {
					modifier: {
						bySelector: function() {
							return {
								getParent: function() {
									return {
										getEntitySet: function() {
											return "EntitySet";
										},
										getId: function(){
											return "id";
										},
										getEntitySet() {
											return "EntitySet";
										},
										getModel() {
											return {
												getMetaModel() {
													return {
														getODataEntitySet() {
															var obj = {entityType: "EntityType"};
															return obj;
														}
													}
												}
											}
										}
									};
								},
								getId: function() {
									return "STTA_MP::Sap.suite.ui.generic.template.ListReport.view.Details::STTA_C_MP_Product--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable";
								},
							getAggregation: function() {
								// for non-reveal: this already returns the order on the UI after the move (2, 0, 1)!
								// for reveal: this returns the order on the UI before the move
								if (!ChangeHandlerUtils.isReveal) {
									return [{
										getCustomData: function() {},
										data: function() {
											return "Path_2";
										}
									}, {
										getCustomData: function() {},
										data: function() {
											return "Path_0";
										}
									}, {
										getCustomData: function() {},
										data: function() {
											return "Path_1";
										}
									}];
								} else {
									return [{
										getCustomData: function() {},
										data: function() {
											return "Path_0";
										},
										getId: function() {
											return "id--delete"
										}
									}, {
										getCustomData: function() {},
										data: function() {
											return "Path_1";
										},
										getId: function() {
											return "id--edit"
										}
									}, {
										getCustomData: function() {},
										data: function() {
											return "Path_2";
										},
										getId: function() {
											return "id--relatedApps"
										}
									}];
								}
							}
						};
					}
				}
			};

			var oMetaModel = {
				getODataEntitySet: function() {
					return {
						entityType: "EntityType"
					};
				},
				getODataEntityType: function() {
					return {
						"com.sap.vocabularies.UI.v1.AnnotationTerm": [{
							Value: {
								Path: "Path_0"
							}
						}, {
							Value: {
								Path: "Path_1"
							}
						}, {
							Value: {
								Path: "Path_2"
							},
							"com.sap.vocabularies.UI.v1.Importance": {
								"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
							}
						}]
					};
				}
			};

			var oComponent = {
					getRootControl: function() {
						return {
							getId: function() {
								return "id";
							}
						};
					}
			}
			this.oGetMetaModelStub = sinon.stub(ChangeHandlerUtils, "getMetaModel").returns(oMetaModel);
			this.oGetEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getEntityType").returns("EntityType");
			this.oGetRootControlIdStub = sinon.stub(ChangeHandlerUtils, "getComponent").returns(oComponent);
			this.oCompleteChangeContentStub = sinon.stub(MoveControls, "completeChangeContent");
			this.oCreateAnnotationTermChangeStub = sinon.stub(AnnotationChangeHandler, "createCustomAnnotationTermChange").returns(this.oContent);
			this.oCreateCustomChangesStub = sinon.stub(AnnotationChangeHandler, "createCustomChanges");
		},
		afterEach: function() {
			this.oContent = null;
			this.oChange = null;
			this.oSpecificChangeInfo = null;
			this.oPropertyBag = null;

			this.oGetMetaModelStub.restore();
			this.oGetEntityTypeStub.restore();
			this.oGetRootControlIdStub.restore();
			this.oCompleteChangeContentStub.restore();
			this.oCreateAnnotationTermChangeStub.restore();
			this.oCreateCustomChangesStub.restore();
		}
	});

	QUnit.test("MoveElements test for LR", function(assert) {

		ChangeHandlerUtils.isRevert = false;

		//Arrange
		var aAnnotationOld = [{
			Value: {
				Path: "Path_0"
			}
		}, {
			Value: {
				Path: "Path_1"
			}
		}, {
			Value: {
				Path: "Path_2"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		}];

		var aAnnotation = [{
			Value: {
				Path: "Path_2"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		}, {
			Value: {
				Path: "Path_0"
			}
		}, {
			Value: {
				Path: "Path_1"
			}
		}];
		//aAnnotation = sinon.stub(this.oSpecificChangeInfo.custom, "fnMoveElementIndex").callsFake( aAnnotation );
		//Act
		MoveElements.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBagForLR);
		//MoveElements.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
		var aParameters = this.oCreateAnnotationTermChangeStub.firstCall.args;
		//Assert
		assert.deepEqual(aParameters[0], "EntityType", "sEntityType parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[1], aAnnotation, "aAnnotation parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[2], aAnnotationOld, "aAnnotationOld parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[3], "com.sap.vocabularies.UI.v1.AnnotationTerm",	"Annotation parameter of createCustomAnnotationTermChange is correct.");

		assert.equal(this.oCreateAnnotationTermChangeStub.calledOnce, true, "createCustomAnnotationTermChange has been called.");
		assert.equal(this.oCreateCustomChangesStub.calledOnce, true, "createCustomChanges has been called.");
	});

	QUnit.test("MoveElements test for OP", function(assert) {

		ChangeHandlerUtils.isRevert = false;

		//Arrange
		var aAnnotationOld = [{
			Value: {
				Path: "Path_0"
			}
		}, {
			Value: {
				Path: "Path_1"
			}
		}, {
			Value: {
				Path: "Path_2"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		}];

		var aAnnotation = [{
			Value: {
				Path: "Path_2"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		}, {
			Value: {
				Path: "Path_0"
			}
		}, {
			Value: {
				Path: "Path_1"
			}
		}];
		//aAnnotation = sinon.stub(this.oSpecificChangeInfo.custom, "fnMoveElementIndex").callsFake( aAnnotation );
		//Act
		MoveElements.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBagForOP);
		var aParameters = this.oCreateAnnotationTermChangeStub.firstCall.args;
		//Assert
		assert.deepEqual(aParameters[0], "EntityType", "sEntityType parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[1], aAnnotation, "aAnnotation parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[2], aAnnotationOld, "aAnnotationOld parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[3], "com.sap.vocabularies.UI.v1.AnnotationTerm",	"Annotation parameter of createCustomAnnotationTermChange is correct.");

		assert.equal(this.oCreateAnnotationTermChangeStub.calledOnce, true, "createCustomAnnotationTermChange has been called.");
		assert.equal(this.oCreateCustomChangesStub.calledOnce, true, "createCustomChanges has been called.");
	});

	QUnit.test("MoveElements test for reveal", function(assert) {

		ChangeHandlerUtils.isRevert = false;
		ChangeHandlerUtils.isReveal = true;

		//Arrange
		var aAnnotationOld = [{
			Value: {
				Path: "Path_0"
			}
		}, {
			Value: {
				Path: "Path_1"
			}
		}, {
			Value: {
				Path: "Path_2"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		}];

		var aAnnotation = [{
			Value: {
				Path: "Path_2"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		}, {
			Value: {
				Path: "Path_0"
			}
		}, {
			Value: {
				Path: "Path_1"
			}
		}];

		//Act
		MoveElements.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBagForLR);
		var aParameters = this.oCreateAnnotationTermChangeStub.firstCall.args;
		//Assert
		assert.deepEqual(aParameters[0], "EntityType", "sEntityType parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[1], aAnnotation, "aAnnotation parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[2], aAnnotationOld, "aAnnotationOld parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[3], "com.sap.vocabularies.UI.v1.AnnotationTerm",	"Annotation parameter of createCustomAnnotationTermChange is correct.");
	});

	QUnit.test("jQuery extend", function(assert) {
		//Arrange
		ChangeHandlerUtils.isRevert = false;
		this.oCreateCustomChangesStub.returns({ testValue: "ok" });

		//Act
		MoveElements.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBagForLR);

		//Assert
		assert.deepEqual(this.oChange.getContent().testValue, "ok", "oChange.getContent has been extended with mChanges.");
	});
});

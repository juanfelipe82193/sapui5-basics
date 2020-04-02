/**
 * tests for the sap.suite.ui.generic.template.changeHandler.generic.RevealElement
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/changeHandler/generic/RevealElement",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/ui/fl/changeHandler/UnhideControl"
],
function(sinon, RevealElement, ChangeHandlerUtils, AnnotationChangeHandler, UnhideControl) {
	"use strict";

	QUnit.module("RevealElement applyChange Test Module");

	QUnit.test("ApplyChange test", function(assert) {
		//Arrange
		var oChange = {
			getContent: function() {
				return {
					customChanges: [{
						oSelector: {
							"id": "elementId",
							"idIsLocal": false
						}
					}]
				};
			}
		};

		var oPropertyBag = {
			modifier: {
				bySelector: function() {
					return "oRevealedElement";
				}
			}
		}; 

		var oApplyChangeSpy = sinon.stub(UnhideControl, "applyChange");
		var oBySelectorSpy = sinon.spy(oPropertyBag.modifier, "bySelector");
		
		//Act
		RevealElement.applyChange(oChange, null, oPropertyBag);

		//Assert
		assert.equal(oBySelectorSpy.calledWith(oChange.getContent().customChanges[0].oSelector), true, "bySelector has been called with the correct parameter.");
		assert.equal(oApplyChangeSpy.calledWith(oChange, "oRevealedElement", oPropertyBag), true, "applyChange has been called with the correct parameters.");
	});

	QUnit.module("RevealElement Test Module", {

		beforeEach: function() {
			this.oContent = {};
			this.oChange = {
				getContent: function() {
					return this.oContent;
				}.bind(this)
			};
			this.oSpecificChangeInfo = {
				revealedElementId: "elementId",
				custom: {
					annotation: "com.sap.vocabularies.UI.v1.LineItem",
					fnGetAnnotationIndex: function() {
						return 2;
					},
					oRevealedAnnotationTerm: {
						Value: {
							Path: "Column3Property"
						},
						RecordType: "com.sap.vocabularies.UI.v1.DataField",
						EdmType: undefined
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
							sParentAggregationName: "columns",
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
					},
					getSelector: function() {
						return {
							"id": "elementId",
							"idISLocal": false
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
			this.oCompleteChangeContentStub = sinon.stub(UnhideControl, "completeChangeContent");
			this.oCreateAnnotationTermChangeStub = sinon.stub(AnnotationChangeHandler, "createCustomAnnotationTermChange").returns(this.oContent);
			this.oCreateCustomChangesStub = sinon.stub(AnnotationChangeHandler, "createCustomChanges");
		},
		afterEach: function() {
			this.oContent = null;
			this.oChange = null;
			this.oSpecificChangeInfo = null;
			this.oPropertyBag = null;

			this.oComponentStub.restore();
			this.oGetModelStub.restore();
			this.oGetMetaModelStub.restore();
			this.oCompleteChangeContentStub.restore();
			this.oCreateAnnotationTermChangeStub.restore();
			this.oCreateCustomChangesStub.restore();
		}
	});

	QUnit.test("RevealElement test case 2", function(assert) {

		//Arrange
		var aLineItemOld = [{
				Value: {
					Path: "Column1Property"
				}
			}, {
				Value: {
					Path: "Column2Property"
				}
			}
		];

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
					Path: "Column3Property"
				}
			}
		];
		//Act
		RevealElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

		var aParameters = this.oCreateAnnotationTermChangeStub.firstCall.args;

		//Assert
		assert.deepEqual(aParameters[0], "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType", "sEntityType parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[1], aLineItem, "aLineItem parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[2], aLineItemOld, "aLineItemOld parameter of createCustomAnnotationTermChange is correct.");
		assert.deepEqual(aParameters[3], "com.sap.vocabularies.UI.v1.LineItem",	"LINEITEM parameter of createCustomAnnotationTermChange is correct.");

		assert.equal(this.oCreateAnnotationTermChangeStub.calledOnce, true, "createCustomAnnotationTermChange has been called.");
		assert.equal(this.oCreateCustomChangesStub.calledOnce, true, "createCustomChanges has been called.");
	});

	QUnit.test("RevealElement test case 2", function(assert) {

		//Arrange
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
							sParentAggregationName: "columns",
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
															Path: "Column1Property1"
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
										},
										{
											getId: function() {
												return "elementId_1"
											}
										}];
									}
								};
							}
						};
					},
					getSelector: function() {
						return {
							"id": "elementId",
							"idIsLocal": false
						}
					}
				}
			};
		//Act
		RevealElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
		
		//Assert
		assert.equal(this.oCreateAnnotationTermChangeStub.calledOnce, true, "createCustomAnnotationTermChange has been called.");
		assert.equal(this.oCreateCustomChangesStub.calledOnce, true, "createCustomChanges has been called.");
	});
	
	QUnit.test("RevealElement test templating data function", function(assert) {

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
					},
					getSelector: function() {
						return {
							"id": "elementId",
							"idIsLocal": false
						}
					}
				}
			};
		
		this.oSpecificChangeInfo = {
				revealedElementId: "elementId",
				custom: {
					fnGetAnnotationIndex: function() {
						return 2;
					},
					fnGetRelevantElement: function(oRevealedElement) {
						return oRevealedElement;
					},
					oRevealedAnnotationTerm: {
						PropertyPath: "Column3Property"
					}
				}
		};
		//Act
		RevealElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
		
		//Assert
		assert.equal(this.oCreateAnnotationTermChangeStub.calledOnce, true, "createCustomAnnotationTermChange has been called.");
		assert.equal(this.oCreateCustomChangesStub.calledOnce, true, "createCustomChanges has been called.");
	});
	
	QUnit.test("oContent elementId", function(assert) {
		//Act
		RevealElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

		//elementId
		assert.deepEqual(this.oContent.revealedElementId, "elementId", "elementId has been set.");
	});

	QUnit.test("jQuery extend", function(assert) {
		//Arrange
		this.oCreateCustomChangesStub.returns({ testValue: "ok" });

		//Act
		RevealElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

		//Assert
		assert.deepEqual(this.oChange.getContent().testValue, "ok", "oChange.getContent has been extended with mChanges.");
	});
});

/**
 * tests for the sap.suite.ui.generic.template.changeHandler.generic.RemoveElement
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/generic/RemoveElement",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
		"sap/ui/fl/changeHandler/HideControl"
	],
	function (sinon, RemoveElement, ChangeHandlerUtils, AnnotationChangeHandler, HideControl) {
		"use strict";

		QUnit.module("RemoveElement applyChange Test Module");

		QUnit.test("ApplyChange", function (assert) {

			//Arrange
			var oChange = {
				getContent: function () {
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
					bySelector: function () {
						return "oElement";
					}
				}
			};

			var oApplyChangeStub = sinon.stub(HideControl, "applyChange");
			var oBySelectorSpy = sinon.spy(oPropertyBag.modifier, "bySelector");

			//Act
			RemoveElement.applyChange(oChange, null, oPropertyBag);

			//Assert
			assert.equal(oBySelectorSpy.calledWith(oChange.getContent().customChanges[0].oSelector), true,
				"bySelector has been called with the correct parameter.");
			assert.equal(oApplyChangeStub.calledWith(oChange, "oElement", oPropertyBag), true,
				"The function applyChange has been called with the correct parameters.");

			// Cleanup
			oApplyChangeStub.restore();
			oBySelectorSpy.restore();
		});

		QUnit.test("Do not call ApplyChange if Element is undefined", function (assert) {

			//Arrange
			var oChange = {
				getContent: function () {
					return {
						customChanges: [{
							"oSelector": {
								"id": "elementId",
								"idIsLocal": false
							}
						}]
					};
				}
			};

			var oPropertyBag = {
				modifier: {
					bySelector: function () {
						return undefined;
					}
				}
			};

			var oApplyChangeStub = sinon.stub(HideControl, "applyChange");
			var oBySelectorSpy = sinon.spy(oPropertyBag.modifier, "bySelector");

			//Act
			RemoveElement.applyChange(oChange, null, oPropertyBag);

			//Assert
			assert.equal(oBySelectorSpy.calledWith(oChange.getContent().customChanges[0].oSelector), true,
				"bySelector has been called with the correct parameter.");
			assert.equal(oApplyChangeStub.called, false, "The function applyChange has not been called.");

			// Cleanup
			oApplyChangeStub.restore();
			oBySelectorSpy.restore();
		});

		QUnit.module("RemoveElement Test Module", {

			beforeEach: function () {
				this.oContent = {};
				this.oChange = {
					getContent: function () {
						return this.oContent;
					}.bind(this)
				};
				this.oSpecificChangeInfo = {
					removedElement: {
						id: "elementId"
					},
					custom: {
						annotation: "com.sap.vocabularies.UI.v1.AnnotationTerm",
						fnGetAnnotationIndex: function (oRemovedElement) {
							return 0;
						},
						fnGetRelevantElement: function (oRemovedElement) {
							return oRemovedElement;
						}
					}
				};
				this.oPropertyBag = {
					modifier: {
						bySelector: function () {
							return {
								getId: function () {
									return "elementId";
								},
								getParent: function () {
									return {
										getParent: function () {
											return {
												getEntitySet: function () {
													return "EntitySet";
												}
											};
										}
									};
								},
								getCustomData: function () {},
								data: function () {}
							};
						},
						getSelector: function () {
							return {
								"id": "ObjectPage",
								"idIsLocal": false
							};
						}
					}
				};

				var oMetaModel = {
					getODataEntitySet: function () {
						return {
							entityType: "EntityType"
						};
					},
					getODataEntityType: function () {
						return {
							"com.sap.vocabularies.UI.v1.AnnotationTerm": [{
								Value: {
									Path: "Path_1"
								}
							}, {
								Value: {
									Path: "Path_2"
								}
							}]
						};
					}
				};

				this.oGetMetaModelStub = sinon.stub(ChangeHandlerUtils, "getMetaModel").returns(oMetaModel);
				this.oGetEntityTypeStub = sinon.stub(ChangeHandlerUtils, "getEntityType").returns("EntityType");
				this.oCompleteChangeContentStub = sinon.stub(HideControl, "completeChangeContent");
				this.oCreateAnnotationTermChangeStub = sinon.stub(AnnotationChangeHandler, "createCustomAnnotationTermChange").returns(this.oContent);
				this.oCreateCustomChangesStub = sinon.stub(AnnotationChangeHandler, "createCustomChanges").returns({});
			},
			afterEach: function () {
				this.oContent = null;
				this.oChange = null;
				this.oSpecificChangeInfo = null;
				this.oPropertyBag = null;

				this.oGetMetaModelStub.restore();
				this.oGetEntityTypeStub.restore();
				this.oCompleteChangeContentStub.restore();
				this.oCreateAnnotationTermChangeStub.restore();
				this.oCreateCustomChangesStub.restore();
			}
		});

		QUnit.test("RemoveElement test", function (assert) {

			//Arrange
			var aAnnotationOld = [{
				Value: {
					Path: "Path_1"
				}
			}, {
				Value: {
					Path: "Path_2"
				}
			}];

			var aAnnotation = [{
				Value: {
					Path: "Path_2"
				}
			}];

			//Act
			RemoveElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
			var aParameters = this.oCreateAnnotationTermChangeStub.firstCall.args;

			//Assert
			assert.deepEqual(aParameters[0], "EntityType", "sEntityType parameter of createCustomAnnotationTermChange is correct.");
			assert.deepEqual(aParameters[1], aAnnotation, "aAnnotation parameter of createCustomAnnotationTermChange is correct.");
			assert.deepEqual(aParameters[2], aAnnotationOld, "aAnnotationOld parameter of createCustomAnnotationTermChange is correct.");
			assert.deepEqual(aParameters[3], "com.sap.vocabularies.UI.v1.AnnotationTerm",
				"Annotation parameter of createCustomAnnotationTermChange is correct.");

			assert.equal(this.oCreateAnnotationTermChangeStub.calledOnce, true, "createCustomAnnotationTermChange has been called.");
			assert.equal(this.oCreateCustomChangesStub.calledOnce, true, "createCustomChanges has been called.");
		});

		QUnit.test("oContent elementId", function (assert) {

			//Act
			RemoveElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

			//Assert
			assert.deepEqual(this.oContent.removedElementId, "elementId", "elementId has been set.");
		});

		QUnit.test("jQuery extend", function (assert) {

			//Arrange
			this.oCreateCustomChangesStub.returns({
				testValue: "ok"
			});

			//Act
			RemoveElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

			//Assert
			assert.deepEqual(this.oChange.getContent().testValue, "ok", "oChange.getContent has been extended with mChanges.");
		});
		QUnit.test("fnGetElementSelector is called", function (assert) {

			//Arrange
			this.oSpecificChangeInfo.custom.fnGetElementSelector = function () {
				return {
					"id": "ObjectPage",
					"idIsLocal": false
				};
			};
			var fnGetElementSelectorSpy = sinon.spy(this.oSpecificChangeInfo.custom, "fnGetElementSelector");
			//Act
			RemoveElement.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);

			//Assert
			assert.equal(fnGetElementSelectorSpy.calledOnce, true, "fnGetElementSelector has been called.");
			//clean
			fnGetElementSelectorSpy.restore();
		});
	});
/**
 * tests for the sap.suite.ui.generic.template.lib.CommonUtils
 */
sap.ui.define([ "testUtils/sinonEnhanced", "sap/m/Table", "sap/ui/model/Context", "sap/ui/model/json/JSONModel",
                 "sap/suite/ui/generic/template/lib/testableHelper",
             		"sap/suite/ui/generic/template/lib/CommonUtils" ], function(sinon, Table, Context, JSONModel, testableHelper, CommonUtils) {
	"use strict";

	var sandbox;
	var sRequestedModelId;
	var sRequestedTextId;
	var sPath;
	var sGlobFunctionName;
	var oEntityType = {
			entityType: "testEntityType",
			"com.sap.vocabularies.UI.v1.Identification": [],
			"com.sap.vocabularies.UI.v1.LineItem": []
	};
	var oEntitySet = {
		name: "STTA_C_MP_Product",
		entityType: oEntityType
	};
	var mPrivateModelData = {
		generic: {
			listCommons : {
				breakoutActionsEnabled: {}
			},
			controlProperties: {}
		}
	};
	var oPrivateModel = new JSONModel(mPrivateModelData);
	var oModelObject = {};
	var oMetaModelObject = {};
	var oManifestActions = {};
	var aPages = [];
	var oController = {
		getOwnerComponent : function() {
			return {
				getModel : function(sId) {
					sRequestedModelId = sId;
					return {
						getResourceBundle : function() {
							return {
								getText : function(sId) {
									sRequestedTextId = sId;
								}
							};
						},
						getMetaModel : function() {
							return {
								getODataEntitySet: function(sEntitySet) {
									return oEntitySet;
								},
								getODataEntityType: function(sEntityType) {
									return oEntityType;
								},
								getODataFunctionImport: function(sFunctionName, bBool) {
									return sGlobFunctionName;
								},
								getObject: function(sPath) {
									return oMetaModelObject;
								}
							};
						},
						getObject: function(sPath) {
							return oModelObject;
						}
					};
				},
				getComponentContainer: function(){
					return {
						getElementBinding: function(){
							return {
								getPath: function(){
									return sPath;
								}
							};
						}
					};
				},
				getEntitySet: function() {
					return oEntitySet.name;
				},
				getAppComponent: function() {
					return {
						getInternalManifest: function() {
							return oManifestActions;
						},
						getManifestEntry: function(sEntry) {
							return oManifestActions[sEntry];
						},
						getConfig: function() {
							return {
									pages: aPages
							};
						}
					};
				},
				getTemplateName: function() {
					return "sap.suite.ui.generic.template.ListReport.view.ListReport";
				},
				getForwardNavigationProperty: function() {
					return false;
				}
			};
		},
		getInnerAppState: Function.prototype,
		getView: function() {
			return {
				getModel: function(sModelName) {
					return oPrivateModel;
				}
			};
		},
		byId: function(sId) {
		},
		getMetadata: function () {
			return {
				getName: function() {
					return "sap.suite.ui.generic.template.ListReport.view.ListReport";
				}
			};
		}
	};

	var oNavigationContext;
	var sNavigationProperty;
	var bReplace;
	var oServices = {
			oNavigationController: {
				navigateToContext: function(oContext, sNavProp, bHistoryReplace){
					oNavigationContext = oContext;
					sNavigationProperty = sNavProp;
					bReplace = bHistoryReplace;
				}
			},
			oDraftController: {
				isActiveEntity: function(){ return true; }
			},
			oApplication: {
				getBusyHelper: function() {
					return {
						isBusy: function() {
							return false;
						},
						setBusy: Function.prototype
					};
				},
				performAfterSideEffectExecution: function(fnFunction){
					fnFunction();
				},
				getForwardNavigationProperty: function(iViewLevel){
					return "";
				}
			}
	};
	var bIsDraftEnabled;
	var oComponentUtils = {
		isDraftEnabled: function(){ return bIsDraftEnabled; },
		getViewLevel: function(){ return 0; },
		navigateAccordingToContext: function(oContext, iDisplayMode, iReplaceMode){
			if (iReplaceMode === 0){
				oNavigationContext = oContext;
			}
		}
	};

	var oCommonUtils;
	var oStubForPrivate;

	module("lib.CommonUtils", {
		setup : function() {
			oStubForPrivate = testableHelper.startTest();
			bIsDraftEnabled = true; // default
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
			sandbox = sinon.sandbox.create();
		},
		teardown : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	test("Dummy", function() {
		ok(true, "Test - Always Good!");
	});

	QUnit.test("Function semanticObjectLinkNavigation with adaptNavigationParameterExtension", function(assert) {
		var oNavigationHandler = {};
		var sSelectionVariant = "";
		var sSelectionVariantPrepared;
		var oEventParameters = {
			semanticObject: "SemanticTestObject2",
			semanticAttributesOfSemanticObjects: {
				"": {
					"Currency": "EUR",
					"Price": "120",
					"ParameterToBeDeleted": "4711"
				},
				SemanticTestObject: {
					"Currency": "EUR",
					"Price": "120",
					"ParameterToBeDeleted": "4711"
				},
				SemanticTestObject2: {
					"Currency": "EUR",
					"Price": "120",
					"ParameterToBeDeleted": "4711",
					"SemanticTestObjectNull": null,
					"SemanticTestObjectUndefined": undefined,
					"SemanticTestObject0": 0,
					"SemanticTestObjectNumber4711": 4711,
					"SemanticTestObjectString4711": "4711"
				}
			},
			semanticAttributes: {
				"Currency": "EUR",
				"Price": "120",
				"ParameterToBeDeleted": "4711"
			}
		};
		var mSelectionVariantPreparedExpectedResult = {
			SelectOptions: {
				"Currency": [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
				"Price": [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}]
			},
			Parameters: {
				"SemanticTestObjectNull": "",
				"SemanticTestObjectUndefined": "",
				"SemanticTestObject0": "0",
				"SemanticTestObjectNumber4711": "4711",
				"SemanticTestObjectString4711": "4711"
			}
		};
		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			toJSONString: function() {
				return JSON.stringify(this);
			},
			addParameter: function(sName, sValue) {
				this.Parameters[sName] = sValue;
			},
			removeParameter: function(sName) {
				delete this.Parameters[sName];
			},
			getParameterNames: function() {
				return Object.keys(this.Parameters);
			},
			getParameter: function(sName) {
				return this.Parameters[sName];
			},
			getSelectOption: function(sProperty) {
				return this.SelectOptions[sProperty];
			},
			getSelectOptionsPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			},
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};
		var oObjectInfo = {
			semanticObject : oEventParameters.semanticObject,
			action: ""
		};
		var oNavigationExtensionStub = sandbox.stub(oController, "adaptNavigationParameterExtension", function(oSelectionVariant, oObjectInfo) {
			oSelectionVariant.removeParameter("ParameterToBeDeleted");
		});
		sandbox.stub(oStubForPrivate, "getNavigationHandler", function() {
			return oNavigationHandler;
		});
		function isEmpty(myObject) {
			for(var key in myObject) {
				if (myObject.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		};
		sandbox.stub(oNavigationHandler, "mixAttributesAndSelectionVariant", function(semanticAttributesOfSemanticObjects, sSelectionVariant) {
			if (isEmpty(semanticAttributesOfSemanticObjects)) {
				return oSelectionVariant;
			}
			else {
				assert.ok(Object.keys(semanticAttributesOfSemanticObjects).indexOf("ParameterToBeDeleted") < 0, "Parameter was deleted from semanticAttributesOfSemanticObjects");
				assert.ok(Object.keys(sSelectionVariant).indexOf("ParameterToBeDeleted") < 0,  "Parameter was deleted from sSelectionVariant");
				return oSelectionVariant;
			}
		});
		sandbox.stub(oNavigationHandler, "processBeforeSmartLinkPopoverOpens", function(eventParameters, selectionVariantPrepared) {
			sSelectionVariantPrepared = selectionVariantPrepared;
		});

		oCommonUtils.semanticObjectLinkNavigation(oEventParameters, sSelectionVariant, oController);

		assert.ok(oNavigationExtensionStub.calledWith(oSelectionVariant, oObjectInfo), "Navigation extension called with the SelectionVariant and the ObjectInfo");
		assert.ok(!oSelectionVariant.Parameters.ParameterToBeDeleted, "Property ParameterToBeDeleted was removed from Parameters");
		assert.ok(oSelectionVariant.SelectOptions.Currency, "Property Currency is still available in SelectOptions");
		assert.ok(oSelectionVariant.SelectOptions.Price, "Property Price is still available in SelectOptions");
		assert.ok(!oEventParameters.semanticAttributesOfSemanticObjects[oEventParameters.semanticObject].ParameterToBeDeleted, "Property ParameterToBeDeleted is removed from oEventParameters");
		assert.deepEqual(JSON.parse(sSelectionVariantPrepared), mSelectionVariantPreparedExpectedResult, "SelectionVariant contains expected parameters");
	});

	QUnit.test("Function formatDraftLockText", function(assert) {
		oCommonUtils.formatDraftLockText(true, true, "User");
		assert.strictEqual(sRequestedModelId, "i18n", "only i18n Modell should be retrieved");
		assert.strictEqual(sRequestedTextId, "LOCKED_OBJECT", "Text LOCKED_OBJECT should be retrieved");

		oCommonUtils.formatDraftLockText(true, true);
		assert.strictEqual(sRequestedTextId, "UNSAVED_CHANGES", "Text UNSAVED_CHANGES should be retrieved");

		oCommonUtils.formatDraftLockText(false, true);
		assert.strictEqual(sRequestedTextId, "DRAFT_OBJECT", "Text DRAFT_OBJECT should be retrieved");

		var sText = oCommonUtils.formatDraftLockText(true, false);
		assert.strictEqual(sText, "", "Text should be empty");
	});

	QUnit.test("navigatefromlistitem", function(assert){
		var oContext = { };

		oCommonUtils.navigateFromListItem(oContext);
		assert.equal(oNavigationContext, oContext, "Navigate to context as given");
	});

	QUnit.test("navigateExternal", function(assert) {
		var sNavParameters = "json string";
		var oNavigationHandler = {};
		sinon.stub(oStubForPrivate, "getNavigationHandler", function() {
			return oNavigationHandler;
		});
		var oNavigateStub = sinon.stub(oNavigationHandler, "navigate");
		var oMixAttributesStub = sinon.stub(oNavigationHandler, "mixAttributesAndSelectionVariant", function() {
			return {
				toJSONString: function() {
					return sNavParameters;
				}
			}
		});

		var oNavigationExtensionStub = sinon.stub(oController, "adaptNavigationParameterExtension", function(oSelectionVariant, oObjectInfo) {
			return;
		});

		var oOutbound = {
			semanticObject: "Semantic Object",
			action: "action",
			parameters: {
				a: "a",
				b: "b"
			}
		};

		oCommonUtils.navigateExternal(oOutbound, {});

		assert.ok(oMixAttributesStub.calledWith(oOutbound.parameters),
		"Mix attributes called with map containing navigation parameters");
		assert.ok(oNavigateStub.calledWith(oOutbound.semanticObject, oOutbound.action, sNavParameters, null),
		"NavigationHanlder was called with semantic object, action and navigation parameters");

		var oInnerAppState = {
				a: "a"
		};
		var oState = {
				getCurrentAppState: function() {
					return oInnerAppState;
				}
		};
		oCommonUtils.navigateExternal(oOutbound, oState);
		assert.ok(oNavigateStub.calledWith(oOutbound.semanticObject, oOutbound.action, sNavParameters, null),
		"... and with inner app state if provided by state");
	});

	QUnit.test("navigateToContext", function(assert) {
		testableHelper.observeConstructor(Context, Function.prototype, true);
		var oContext = new Context();
		var oNavigationData = {
				navigationProperty: "to_Item"
		};
		oCommonUtils.navigateToContext(oContext);
		assert.equal(oNavigationContext, oContext, "");
		assert.equal(sNavigationProperty, undefined, "");
		oCommonUtils.navigateToContext(oContext, oNavigationData);
		assert.equal(oNavigationContext, oContext, "");
		assert.equal(sNavigationProperty, "to_Item", "");
	});

	module("lib.CommonUtils.securedExecution", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			bIsDraftEnabled = true; // default
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("Draft case - Promise from App resolved", function(assert) {

		var bSpyCalled = false;
		var oAppResult = {};
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				resolve(oAppResult);
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function(oResult) {
				assert.ok(true, "...that is resolved");
				assert.equal(oResult,oAppResult,"...to the result provided by the app");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Draft case - Promise from App rejected", function(assert) {

		var bSpyCalled = false;
		var oAppResult = {};
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				reject(oAppResult);
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.notOk(true, "...that is resolved");
				done();
			}, function(oResult) {
				assert.ok(true, "...that is rejected");
				assert.equal(oResult,oAppResult,"...to the result provided by the app");
				done();
			});
		});
	});

	QUnit.test("Draft case - no Promise from App", function(assert) {

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Non-Draft case without changes - Promise from App resolved", function(assert) {
		bIsDraftEnabled = false;
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return {
						hasPendingChanges: function() {
							return false;
						}
					};
				}
			};
		});

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				resolve();
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);

			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Non-Draft case with changes - user confirms - no Promise from App provided", function(assert) {
		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		var oDialogFragment = {
				getModel: function() {
					return {
						setProperty: Function.prototype
					};
				},
				open: Function.prototype,
				close: Function.prototype
		};

		sandbox.stub(oServices.oApplication, "getDialogFragmentForView", function(oView, sName, oController) {
			sandbox.stub(oDialogFragment, "open", function() {
				oController.onDataLossOK();
			});
			return oDialogFragment;
		});
		sandbox.stub(oComponentUtils, "fire");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);

			assert.ok(oDialogFragment.open.called, "Popup was opened");
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Non-Draft case with changes, but no dataloss check requestes - Promise from App resolved",
			function(assert) {
		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		sandbox.stub(oServices.oApplication, "getDialogFragmentForView");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				resolve();
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed",
				"dataloss" : {
					"popup": false
				}
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks
		// are done
		setTimeout(function() {

			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				assert.notOk(oServices.oApplication.getDialogFragmentForView.called, "Dataloss Popup shown");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Non-Draft case with changes - user cancels", function(assert) {
		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		var oDialogFragment = {
				getModel: function() {
					return {
						setProperty: Function.prototype
					};
				},
				open: Function.prototype,
				close: Function.prototype
		};

		sandbox.stub(oServices.oApplication, "getDialogFragmentForView", function(oView, sName, oController) {
			sandbox.stub(oDialogFragment, "open", function() {
				oController.onDataLossCancel();
			});
			return oDialogFragment;
		});
		sandbox.stub(oComponentUtils, "fire");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);

			assert.ok(oDialogFragment.open.called, "Popup was opened");
			assert.notOk(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.notOk(true, "...that is resolved");
				done();
			}, function() {
				assert.ok(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Busy Indicator checked", function(assert) {
		sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
			return {
				isBusy: function() {
					return true;
				},
				setBusy: Function.prototype
			};
		});

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);

			assert.notOk(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.notOk(true, "...that is resolved");
				done();
			}, function() {
				assert.ok(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("No Busy Indicator check requested", function(assert) {
		sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
			return {
				isBusy: function() {
					return true;
				},
				setBusy: Function.prototype
			};
		});

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed",
				"busy": {
					"check": false
				}
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);

			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit
	.test(
			"Busy Indicator set (immediately) and restored (after Promise is settled) - Non-Draft case with changes - user confirms - Promise from App rejected",
			function(assert) {
				var oBusyHelper = {};
				sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
					return oBusyHelper;
				});
				var bBusyPromiseResolved = false;
				sandbox.stub(oBusyHelper, "isBusy", function() {
					return false;
				});
				sandbox.stub(oBusyHelper, "setBusy", function(oPromise) {
					oPromise.then(Function.prototype, function() {
						bBusyPromiseResolved = true;
					});
				});

				bIsDraftEnabled = false;
				var oModel = {
						hasPendingChanges: Function.prototype,
						resetChanges: Function.prototype
				};
				sandbox.stub(oController, "getView", function() {
					return {
						getModel: function() {
							return oModel;
						},
						setBindingContext: Function.prototype
					};
				});
				sandbox.stub(oModel, "hasPendingChanges", function() {
					return true;
				});
				sandbox.stub(oModel, "resetChanges");

				var oDialogFragment = {
						getModel: function() {
							return {
								setProperty: Function.prototype
							};
						},
						open: Function.prototype,
						close: Function.prototype
				};

				sandbox.stub(oServices.oApplication, "getDialogFragmentForView",
						function(oView, sName, oController) {
					sandbox.stub(oDialogFragment, "open", function() {
						oController.onDataLossOK();
					});
					return oDialogFragment;
				});
				sandbox.stub(oComponentUtils, "fire");

				var bSpyCalled = false;
				var fnFunction = function() {
					bSpyCalled = true;
					return new Promise(function(resolve, reject) {
						reject();
					});
				};
				var mParameters = {
						"sActionLabel": "Action Name that was executed"
				};


				var done = assert.async(); // provides a done function to signal the test framework, that all
				// checks are done
				setTimeout(function() {

					var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
					assert.ok(oBusyHelper.setBusy.called, "Set busy was called");
					assert.notOk(bBusyPromiseResolved, "Busy Promise resolved");
					assert.ok(oDialogFragment.open.called, "Popup was opened");
					assert.ok(bSpyCalled, "Spy was called");
					assert.ok(oResult instanceof Promise, "returned a promise");
					oResult.then(function() {
						assert.notOk(true, "...that is resolved");
						done();
					}, function() {
						assert.ok(true, "...that is rejected");
						assert.ok(bBusyPromiseResolved, "Busy Promise resolved");
						done();
					});
				});
			});

	QUnit.test("No setting of Busy Indicator requested", function(assert) {
		var oBusyHelper = {};
		sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
			return oBusyHelper;
		});
		var bBusyPromiseResolved = false;
		sandbox.stub(oBusyHelper, "isBusy", function() {
			return false;
		});
		sandbox.stub(oBusyHelper, "setBusy");

		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		var oDialogFragment = {
				getModel: function() {
					return {
						setProperty: Function.prototype
					};
				},
				open: Function.prototype,
				close: Function.prototype
		};

		sandbox.stub(oServices.oApplication, "getDialogFragmentForView", function(oView, sName, oController) {
			sandbox.stub(oDialogFragment, "open", function() {
				oController.onDataLossOK();
			});
			return oDialogFragment;
		});
		sandbox.stub(oComponentUtils, "fire");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				reject();
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed",
				"busy": {
					"set": false
				}
		};

		oCommonUtils.securedExecution(fnFunction, mParameters);
		assert.notOk(oBusyHelper.setBusy.called, "Set busy was called");
	});

	//---------  breakout action enabled? ---- applicable-path, action-for ... -----------------------------------------------
	module("lib.CommonUtils.fillEnabledMapForBreakoutActions", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection undefined, applicablePath undefined, one selected", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
		                                        "id" : "VisibilityActionExt"
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, [], oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection undefined, applicablePath undefined, none selected", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
		                                        "id" : "VisibilityActionExt"
//		                                        "requiresSelection" : true,
//		                                        "applicablePath" : "IsActiveEntity"
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		var aContexts = [];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection false, applicablePath undefined, one selected", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
		                                        "id" : "VisibilityActionExt",
		                                        "requiresSelection" : false
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, [], oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection false, applicablePath undefined, none selected", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
		                                        "id" : "VisibilityActionExt",
		                                        "requiresSelection" : false
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		var aContexts = [];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath undefined, one selected", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
		                                        "id" : "VisibilityActionExt",
		                                        "requiresSelection" : true
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, [{}], oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath undefined, none selected", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
		                                        "id" : "VisibilityActionExt",
		                                        "requiresSelection" : true
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		var aContexts = [];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), false, "Breakout action should not be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath not set, one selected", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
		                                        "id" : "VisibilityActionExt",
		                                        "requiresSelection" : true,
		                                        "applicablePath" : ""
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		var oContext = {
			getPath: function() {
				return "Test";
			}
		};
		var aContexts = [oContext];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath not set, none selected", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
		                                        "id" : "VisibilityActionExt",
		                                        "requiresSelection" : true,
		                                        "applicablePath" : ""
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		var aContexts = [];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), false, "Breakout action should not be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath true", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
		                                        "id" : "VisibilityActionExt",
		                                        "requiresSelection" : true,
		                                        "applicablePath" : "IsActiveEntity"
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		oModelObject = {
			"IsActiveEntity" : true
		};
		var oContext = {
			getPath: function() {
				return "Test";
			}
		};
		var aContexts = [oContext];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath false", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
		                                        "id" : "VisibilityActionExt",
		                                        "requiresSelection" : true,
		                                        "applicablePath" : "IsActiveEntity"
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		oModelObject = {
			"IsActiveEntity" : false
		};
		var oContext = {
			getPath: function() {
				return "Test";
			}
		};
		var aContexts = [oContext];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), false, "Breakout action should not be enabled");
	});
	//---------  action enabled? ---- applicable-path, action-for ... -----------------------------------------------
	module("lib.CommonUtils.getBreakoutActionsFromManifest", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});
	QUnit.test("getBreakoutActionsFromManifest - No Breakouts defined", function(assert) {
		oManifestActions = {
			"sap.ui5": {
			}
		};
		var oBreakoutActions = oCommonUtils.getBreakoutActions(oController.getOwnerComponent().getModel());
		assert.strictEqual(oBreakoutActions, undefined, "Breakout action should return undefined");
	});
	QUnit.test("getBreakoutActionsFromManifest - Incomplete Breakouts defined", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
				}
			}
		};
		var oBreakoutActions = oCommonUtils.getBreakoutActions(oController.getOwnerComponent().getModel());
		assert.strictEqual(oBreakoutActions, undefined, "Breakout action should be undefined");
	});
	QUnit.test("getBreakoutActionsFromManifest - Incomplete Breakouts defined", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
					}
				}
			}
		};
		var oBreakoutActions = oCommonUtils.getBreakoutActions(oController.getOwnerComponent().getModel());
		assert.strictEqual(oBreakoutActions, undefined, "Breakout action should be undefined");
	});
	QUnit.test("getBreakoutActionsFromManifest - Incomplete Breakouts defined", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
						}
					}
				}
			}
		};
		var oBreakoutActions = oCommonUtils.getBreakoutActions(oController.getOwnerComponent().getModel());
		assert.strictEqual(oBreakoutActions, undefined, "Breakout action should be undefined");
	});
	QUnit.test("getBreakoutActionsFromManifest - Complete Breakout defined", function(assert) {
		oManifestActions = {
			"sap.ui5": {
				"extends": {
					"extensions": {
						"sap.ui.controllerExtensions": {
							"sap.suite.ui.generic.template.ListReport.view.ListReport": {
								"controllerName": "STTA_MP.ext.controller.ListReportExtension",
								"sap.ui.generic.app": {
									"STTA_C_MP_Product": {
										"EntitySet": "STTA_C_MP_Product",
										"Actions" : {
											"VisibilityActionExt" : {
												"id" : "VisibilityActionExt"
											},
										}
									}
								}
							}
						}
					}
				}
			}
		};
		var oBreakoutActions = oCommonUtils.getBreakoutActions(oController.getOwnerComponent().getModel());
		assert.strictEqual(oBreakoutActions.VisibilityActionExt.id, "VisibilityActionExt", "Breakout action should not be a breakout object");
	});

	module("lib.CommonUtils ObjectPage Self-Linking", {
		setup : function() {
			oStubForPrivate = testableHelper.startTest();
			bIsDraftEnabled = true; // default
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
			sandbox = sinon.sandbox.create();
			oEntitySet = {
					entityType:"CDN_C_STTA_SO_WD_20_CDS.CDN_C_STTA_SO_WD_20Type",
					name: "CDN_C_STTA_SO_WD_20"
			};
			oEntityType = {
					extensions : "",
					key: {
						propertyRef: [{name: "SalesOrder"},{name: "DraftUUID"},{name: "IsActiveEntity"}]
					},
					name: "CDN_C_STTA_SO_WD_20Type",
					namespace: "CDN_C_STTA_SO_WD_20_CDS",
					property: [{name: "DraftUUID", type: "Edm.Guid"},{name: "SalesOrder", type: "Edm.String"},{name: "IsActiveEntity", type: "Edm.Boolean"}],
			};
		},
		teardown : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("Function getNavigationKeyProperties MainObjectPage", function(assert) {
		var sTargetEntitySet = "CDN_C_STTA_SO_WD_20"
		var oPages = {
				component : {name: "sap.suite.ui.generic.template.ListReport"},
				entitySet: "CDN_C_STTA_SO_WD_20",
				pages: [{component: "sap.suite.ui.generic.template.ObjectPage",entitySet: "CDN_C_STTA_SO_WD_20", navigationProperty: undefined}]
		};
		oController.getOwnerComponent().getAppComponent().getConfig().pages[0] = oPages;
		var aKeysExpected = [{name: "SalesOrder", type: "Edm.String"},{name: "DraftUUID", type: "Edm.Guid"},{name: "IsActiveEntity", type: "Edm.Boolean"}];

		var aKeys = oCommonUtils.getNavigationKeyProperties(sTargetEntitySet);

		assert.strictEqual(aKeys[0].entitySet, "CDN_C_STTA_SO_WD_20", "EntitySet is correct determined");
		assert.strictEqual(aKeys[0].navigationProperty, undefined, "NavigationProperty is correct determined, it is 'undefined'!");
		for (var i = 0, ilength = aKeys[0].aKeys.length; i < ilength; i++ ) {
			if (aKeys[0].aKeys[i].name === aKeysExpected[i].name) {
				assert.ok(true, "Key.name " + aKeys[0].aKeys[i].name + " and expectedKey.name " + aKeysExpected[i].name + " are equal");
			} else {
				assert.ok(false,  "Key.name " + aKeys[0].aKeys[i].name + " and expectedKey.name " + aKeysExpected[i].name + " are NOT equal");
			}
			if (aKeys[0].aKeys[i].type === aKeysExpected[i].type) {
				assert.ok(true, "Key.type " + aKeys[0].aKeys[i].type + " and expectedKey.type " + aKeysExpected[i].type + " are equal");
			} else {
				assert.ok(false,  "Key.type " + aKeys[0].aKeys[i].type + " and expectedKey.type " + aKeysExpected[i].type + " are NOT equal");
			}
		}
	});

	QUnit.test("Function mergeNavigationKeyPropertiesWithValues MainObjectPage", function(assert) {
		var sTargetEntitySet = "CDN_C_STTA_SO_WD_20"
		var oPages = {
				component : {name: "sap.suite.ui.generic.template.ListReport"},
				entitySet: "CDN_C_STTA_SO_WD_20",
				pages: [{component: "sap.suite.ui.generic.template.ObjectPage",entitySet: "CDN_C_STTA_SO_WD_20", navigationProperty: undefined}]
		};
		oController.getOwnerComponent().getAppComponent().getConfig().pages[0] = oPages;
		var aKeys = oCommonUtils.getNavigationKeyProperties(sTargetEntitySet);
		var oResponse = {DraftAdministrativeData: null, DraftUUID: "00000000-0000-0000-0000-000000000000", HasActiveEntity: false, HasDraftEntity: false, IsActiveEntity: true,
										SalesOrder: "500000207", SalesOrder3:"0500000120"};
		var sExpectedRoute = "/CDN_C_STTA_SO_WD_20(SalesOrder='500000207',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";

		var sRoute = oCommonUtils.mergeNavigationKeyPropertiesWithValues(aKeys, oResponse);

		assert.strictEqual(sRoute, sExpectedRoute, "NavigationPath is correct determined");
	});

});

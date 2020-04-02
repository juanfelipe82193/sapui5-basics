/**
 * tests for the sap.suite.ui.generic.template.lib.CommonEventHandlers
 */

sap.ui.define(
		["sap/ui/comp/smarttable/SmartTable", "sap/m/Table", "sap/ui/table/AnalyticalTable", "sap/m/MessageBox", "sap/ui/base/Event", "sap/ui/model/json/JSONModel",
		 "testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/CommonEventHandlers", "sap/ui/model/Context",
		 "sap/ui/model/odata/v2/ODataModel", "sap/suite/ui/generic/template/lib/testableHelper", "sap/suite/ui/generic/template/js/AnnotationHelper", "sap/ui/generic/app/navigation/service/SelectionVariant", "sap/base/util/extend"],
		 function(SmartTable, MTable, ATable, MessageBox, Event, JSONModel, sinon, CommonEventHandlers, Context, ODataModel, testableHelper, AnnotationHelper, SelectionVariant, extend) {
			"use strict";

			// sut
			var oCommonEventHandlers;

			// variables for spies
			var oNavigateFromListItemArguments;
			var bCRUDManagerCallActionCalled;
			var oNavigationHandlerNavigateArguments;
			var oNavigationHandlerMixAttributesArguments;
			var sNavigationParameters;
			var oNavigationHandler = {
					navigate: function() {
						oNavigationHandlerNavigateArguments = arguments;
					},
					mixAttributesAndSelectionVariant: function() {
						oNavigationHandlerMixAttributesArguments = arguments;
						return {
							toJSONString: function(){
								return sNavigationParameters;
							},
							getParameterNames: function(){return [];}
						};
					}
			};
			var oGetManifestEntryArguments;
			var oCommonUtilsGetTextArguments;

			// configuration of stubs
			var oOutbound; // outbound defined in manifest
			var sCrossNavigationOutbound; // Outbound defined in Manifest
			var aSelectedContexts = []; // selected context
			var oHeaderBindingContext = {getObject: Function.prototype}; // header context for object page
			var mModels;
			// preperation for all tests the same
			var oController = {
					getMetadata: function () {
						return {
							getName :  function () { return ""; }
						};
					},
					getOwnerComponent: function() {
						return {
							getAppComponent: function() {
								return {
									getManifestEntry: function() {
										oGetManifestEntryArguments = arguments;
										var oOutbounds = {};
										oOutbounds[sCrossNavigationOutbound] = oOutbound;
										return {
											crossNavigation: {
												outbounds: oOutbounds
											}
										};
									}
								};
							},
							getModel: function(sName){
								var oModel = mModels[sName];
								if (!oModel){
									oModel = new JSONModel();
									 mModels[sName] = oModel;
								}
								return oModel;
							}
						};
					},
					getView: function() {
						return {
								getBindingContext: function() {
									return oHeaderBindingContext;
								},
								getModel: function() {
									return {
										hasPendingChanges: function() {
											return false;
										},
										getMetaModel: function() {
											return {
												getODataEntitySet: function() {
													return {entityType:"ProductType"};
												},
												getODataEntityType: function() {
													return {
														"com.sap.vocabularies.UI.v1.HeaderInfo": {
															Title: {
																Value: {
																	Path: "SalesOrderItem"
																}
															}
														},
														key: {
															propertyRef: ""
														}
													};
												},
												getODataFunctionImport: function() {
													return {
														"sap:applicable-path":"Multimsg_ac"
													};
												}
											};
										},
										getObject: function(sPath) {
											var aObject = [
															{ Multimsg_ac: true, SalesOrder: "500000126", SalesOrderItem: "10" },
															{ Multimsg_ac: false, SalesOrder: "500000126", SalesOrderItem: "20" }
														];
											var sItem = sPath.slice(sPath.indexOf("'") + 1 , sPath.lastIndexOf("'"));
											for (var key in aObject) {
												if (aObject[key].SalesOrderItem === sItem) {
													return aObject[key];
												}
											}
										}
									};
								},
								getId: function() {
									return "";
								}
						};
					},
					adaptNavigationParameterExtension: Function.prototype
			};

			// the smart table will have a sap.m.Table or a sap.ui.table.AnalyticalTable
			var oMTable = sinon.createStubInstance(MTable);
			oMTable.getMetadata.returns({
				getName: function () {
					return "sap.m.Table";
				}
			});

			var oATable = sinon.createStubInstance(ATable);
			oATable.getMetadata.returns({
				getName: function () {
					return "sap.ui.table.AnalyticalTable";
				}
			});
			oATable.getColumns.returns([]);
			oATable.getGroupedColumns.returns([]);

			var oSmartTable = sinon.createStubInstance(SmartTable);
			oSmartTable.getMetadata.returns({
				getName: function () {
					return "sap.ui.comp.smarttable.SmartTable";
				}
			});
			oSmartTable.data = function (sName) {
				if (sName) {
					return this.mTest.mCustomData[sName];
				}
				return this.mTest.mCustomData;
			};
			oSmartTable.getModel = function () {
				return {
					getMetaModel: function () {
						return {
							getODataEntitySet: function (sEntitySet) {
								return {
									entityType: "entityType"
								};
							},
							getODataEntityType: function () {
								return { };
							},
							getODataProperty: function (oEntityType, sProperty) {
								return oSmartTable.mTest.mMetadata[sProperty] || "";
							}
						};
					},
					getResourceBundle: function () {
						return {
							getText: function (sKey) {
								return (sKey === "YES") ? "Yes" : (sKey === "NO") ? "No" : null;
							}
						};
					}
				};
			};
			oSmartTable.getTable.returns(oMTable); // table of type sap.m.Table or sap.ui.AnalyticalTable
			oSmartTable.getCustomData.returns([]);
			oSmartTable.getEntitySet.returns("entityset");
			oSmartTable.mTest = {
				mMetadata: { },
				mCustomData: {
					dateFormatSettings: '{"UTC":true,"style":"medium"}' //or: '{"style":"medium"}'
				}
			};

			var oTemplateUtils = {
					oCommonUtils: {
						getDialogFragment: function (sName, oFragmentController, sModel, fnOnFragmentCreated) {
							var oFragment = sap.ui.xmlfragment(oController.getView().getId(), sName, oFragmentController);
							var oModel;
							if (sModel) {
								oModel = new JSONModel();
								oFragment.setModel(oModel, sModel);
							}
							return oFragment;
						},
						isSmartTable: function(oControl){
							return oControl === oSmartTable;
						},
						isSmartChart: function(oControl){
							return false;
						},
						isAnalyticalTable: function(oControl){
							return oControl === oATable;
						},
						isMTable: function(oControl){
							return oControl instanceof MTable;
						},
						getSelectedContexts: function(oControl) {
							return aSelectedContexts;
						},
						getNavigationHandler: function() {
							return oNavigationHandler;
						},
						getElementCustomData : function (){
							return {
								Action : "Test_Action",
								SemanticObject : "Test_Semantic_Object"
							};
						},
						getContentDensityClass: Function.prototype
					},
					oComponentUtils: {
						getViewLevel: function(){
							return 1;
						},
						isDraftEnabled: function () {
							return false;
						}
					},
					oServices: {
						oApplication: {
							getBusyHelper: function() {
								return {
									isBusy: function() {
										return false;
									}
								};
							},
							getNavigationProperty: function(sProperty){
								return null;
							},
							performAfterSideEffectExecution : function(fnFunction){
								fnFunction();
							}
						},
						oDraftController: {
							getDraftContext: function() {
								return {
									isDraftEnabled: function () {
										return false;
									}
								}; }
						}
					}
			};

			var sandbox;
			var oStubForPrivate;

			module("lib.CommonEventHandlers", {
				setup: function() {
					oStubForPrivate = testableHelper.startTest();
					sandbox = sinon.sandbox.create();
					mModels = Object.create(null);
					sandbox.stub(MessageBox, "error", function() {
						var Log = sap.ui.require("sap/base/Log");
						Log.debug("sap.m.MessageBox.error called... (replaced for test with Sinon Stub)");
					});

					oTemplateUtils.oCommonUtils.getText = function(sKey) {
						oCommonUtilsGetTextArguments = arguments;
					};
					oTemplateUtils.oCommonUtils.getOwnerControl = function(oSourceControl) {
						var oCurrentControl = oSourceControl;
						while (oCurrentControl) {
							// Test for sap.m.Table
							if (oCurrentControl instanceof MTable) {
								return oCurrentControl;
							}
							// Get parent control until sap.m.Table is found
							if (oCurrentControl.getParent){
								oCurrentControl = oCurrentControl.getParent();
							} else {
								oSmartTable.getTable().getMode = function() {
									return "MultiSelect";
								};
								oSmartTable.getTable().getSelectionMode = function() {
									return "MultiToggle";
								};

								return oSmartTable;
							}
						}
						return oSmartTable;
					};
					oTemplateUtils.oCommonUtils.getTableBindingInfo = Function.prototype;
					oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft = function(resolve) {
						resolve();
					};
					oTemplateUtils.oCommonUtils.navigateFromListItem = function() {
						oNavigateFromListItemArguments = arguments;
					};
					oTemplateUtils.oServices.oNavigationController = {};
					oTemplateUtils.oServices.oCRUDManager = {
						callAction: function() {
							bCRUDManagerCallActionCalled = true;

							return {
								then : Function.prototype
							};
						}
					};

					oCommonEventHandlers = new CommonEventHandlers(oController, oTemplateUtils.oComponentUtils,
							oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);

				},
				teardown: function() {
//					oMessageBoxStub.restore();
					sandbox.restore();
					testableHelper.endTest();
				}
			});

			QUnit.test("Dummy", function() {
				ok(true, "Test - Always Good!");
			});

			QUnit.test("Function onCallActionFromToolBar", function(assert) {
						var oEvent = sinon.createStubInstance(Event);

						oEvent.getSource.returns({
							getParent: function() {
								return {
									getParent: function() {
										return {
											getTable: Function.prototype
										};
									}
								};
							},
							data: function() {
								return { Action: "Entities/ProductTypeMultimsg", Label:"Transient Message" };
							}
						});

						/* ACTIONS THAT CALL FUNCTION IMPORT (UI.DataFieldForAction) */
						// NO ITEM SELECTED: supported
						bCRUDManagerCallActionCalled = false;
						aSelectedContexts = [];
						var oState = {};
						oCommonEventHandlers.onCallActionFromToolBar(oEvent, oState);

						assert.strictEqual(bCRUDManagerCallActionCalled, true, "NO ITEM SELECTED: supported; check that processing is allowed");

						// ONE ITEM SELECTED: supported
						bCRUDManagerCallActionCalled = false;
						aSelectedContexts.push({ getPath: function() { return "/ProductType(SalesOrderItem = '10')"; }, sPath:"/ProductType()", getProperty: function() { return "10"; }});
						var oState = {};
						oCommonEventHandlers.onCallActionFromToolBar(oEvent, oState);

						assert.strictEqual(bCRUDManagerCallActionCalled, true, "ONE ITEM SELECTED: supported; check that processing is allowed");

						// MULTIPLE ITEMS SELECTED: supported
						bCRUDManagerCallActionCalled = false;
						aSelectedContexts.push({ getPath: function() { return "/ProductType(SalesOrderItem = '20')"; }, sPath:"/ProductType()", getProperty: function() { return "20"; }});
						oCommonEventHandlers.onCallActionFromToolBar(oEvent, oState);

						assert.strictEqual(bCRUDManagerCallActionCalled, true, "MULTIPLE ITEMS SELECTED: function import actions on multiple instances --> not supported; check that processing is not allowed");

						/* ACTIONS THAT PERFORM NAVIGATION (UI.DataFieldForIntentBasedNavigation) */
						// NO ITEM SELECTED: supported
						oNavigationHandlerNavigateArguments = undefined;
						aSelectedContexts = [];
						oState = {};
						oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);

						assert.ok(oNavigationHandlerNavigateArguments, "NO ITEM SELECTED: supported; check that processing is allowed");

						// ONE ITEM SELECTED: supported
						oNavigationHandlerNavigateArguments = undefined;
						var oContext = new Context();
						oContext.oModel = new ODataModel("abc", {});
						oContext.sPath = "abc";
						aSelectedContexts.push(oContext);
						oState = {};
						oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);

						assert.ok(oNavigationHandlerNavigateArguments, "ONE ITEM SELECTED: supported; check that processing is allowed");

						// MULTIPLE ITEMS SELECTED: navigation to multiple instances --> currently not supported
						oNavigationHandlerNavigateArguments = undefined;
						aSelectedContexts.push(oContext);
						oState = {};
						oState.aMultiContextActions = null;
						oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);

						assert.equal(oNavigationHandlerNavigateArguments, undefined, "MULTIPLE ITEMS SELECTED: navigation to multiple instances --> not supported; check that processing is not allowed");
					});

			 QUnit.test("Function fnMergeContextObjects - Parameters should not be added to SelectOptions in case of Parameterized EntitySet", function (assert) {
				 var oEvent = sinon.createStubInstance(Event);
				 oEvent.getSource.returns({
					 getParent: function () {
						 return {
							 getParent: function () {
								 return {
									 getTable: Function.prototype
								 };
							 }
						 };
					 },
					 data: function () {
						 return true;
					 }
				 });
				 var aParameters = [{ PropertyName: "P_ExchangeRateType", PropertyValue: "M" }, { PropertyName: "P_DisplayCurrency", PropertyValue: "USD" }];
				 var oSmartFilterbarVariant = {
					 Parameters: aParameters
				 };
				 var oState = {
					 oSmartFilterbar: {
						 getUiState: function () {
							 return {
								 getSelectionVariant: function () {
									 return oSmartFilterbarVariant;
								 }
							 };
						 }
					 }
				 };
				 var aMultipleContexts = [{
					 getObject: function () {
						 var obj = {
							 ABOPVariantName: "X",
							 ABOPVariantUUID: "Y",
							 P_ExchangeRateType: "M",
							 P_DisplayCurrency: "USD"
						 }
						 return obj;
					 }
				 },
				 {
					 getObject: function () {
						 var obj = {
							 ABOPVariantName: "A",
							 ABOPVariantUUID: "B",
							 P_ExchangeRateType: "M",
							 P_DisplayCurrency: "USD"
						 }
						 return obj;
					 }
				 }];
				 var getSelectedContextsStub = sinon.stub(oTemplateUtils.oCommonUtils, "getSelectedContexts");
				 getSelectedContextsStub.returns(aMultipleContexts);
				 var processDataLossConfirmationIfNonDraftStub = sinon.stub(oTemplateUtils.oCommonUtils, "processDataLossConfirmationIfNonDraft", function (fnHandleMultiContextIBN) {
					 fnHandleMultiContextIBN();
				 });
				 oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);
				 processDataLossConfirmationIfNonDraftStub.restore();
				 getSelectedContextsStub.restore();
				 var oSelectionVariant = new SelectionVariant(oNavigationHandlerNavigateArguments[2]);
				 assert.equal(oSelectionVariant.getSelectOptionsPropertyNames().length, 2, "Selection Options does not contain input parameters");
			 });

			QUnit.test("onListNavigate (chevron) -> Navigation to object page", function(assert) {
				// configure stubs
				aSelectedContexts = [];
				// prepare input
				var oContext = {};
				var oEventSource = {
						getParent: function() {
							return oMTable;
						},
						getBindingContext: function() {
							return oContext;
						},
						getId: Function.prototype,
						data: Function.prototype
				};
				// initialize spies
				oNavigateFromListItemArguments = undefined;
				// execute
				var oState = {};
				sandbox.stub(oTemplateUtils.oComponentUtils, "setPaginatorInfo");
				oCommonEventHandlers.onListNavigate(oEventSource, oState);
				// check
				assert.equal(oNavigateFromListItemArguments.length, 1,
				"onListNavigate (chevron) -> navigate called with one parameter");
				assert.equal(oNavigateFromListItemArguments[0], oContext, "parameter is the given context");
			});

			QUnit.test("onListNavigate (Intent) (generic checks)", function(assert) {
				// configure stubs
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				// prepare input
				var oEventSource = {
						data: function() {
							return sCrossNavigationOutbound;
						},
						getBindingContext: function() {
							return {
								getObject: Function.prototype
							};
						},
						getId: Function.prototype
				};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oGetManifestEntryArguments = undefined;
				// execute
				var oState = {};
				oCommonEventHandlers.onListNavigate(oEventSource, oState);
				// check
				assert.equal(oNavigationHandlerNavigateArguments.length, 5,
				"onListNavigate -> navigation handler called with five parameters");

				assert.equal(oGetManifestEntryArguments.length, 1, "Get Manifest Entry called with one parameter");
				assert.equal(oGetManifestEntryArguments[0], "sap.app", "to read the manifest entry for sap.app");

				assert.equal(oNavigationHandlerNavigateArguments[0], oOutbound.semanticObject,
				"First parameter: semantic object defined in manifest");
				assert.equal(oNavigationHandlerNavigateArguments[1], oOutbound.action,
				"Second parameter: Action defined in manifest");

				assert.equal(typeof oNavigationHandlerNavigateArguments[4], "function",
				"Fifth parameter: A function to handle errors");
				// oNavigationHandlerNavigateArguments[4] && oNavigationHandlerNavigateArguments[4](oError);
				// assert.equal(false, true, "tbd: check function to handle errors ");
			});

			QUnit.test("onListNavigate (Intent) (ListReport specific)", function(assert) {
				// configure stubs
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				sNavigationParameters = "test";
				// prepare input
				var oContextObject = {
						lineAttribute: "lineXYZ"
				};
				var sTableVariantId = "TableVariantID_4711";
				var oEventSource = {
						data: function() {
							return sCrossNavigationOutbound;
						},
						getBindingContext: function() {
							return {
								getObject: function() {
									return oContextObject;
								}
							};
						},
						getParent: function() {
							return {
								getParent: function() {
									return {
										getCurrentVariantId: function() {
											return sTableVariantId;
										}
									};
								}
							};
						},
						getId: Function.prototype
				};
				var sSelectionVariant = "test";
				var oSmartFilterBar = {
						getUiState: function() {
							return {
								getSelectionVariant: function() {
									return sSelectionVariant;
								}
							}
						}
				};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oNavigationHandlerMixAttributesArguments = undefined;
				// execute
				var oState = {};
				oState.oSmartFilterbar = oSmartFilterBar;
				oCommonEventHandlers.onListNavigate(oEventSource, oState);
				// check
				assert.equal(oNavigationHandlerMixAttributesArguments.length, 2, "MixAttributes called with 2 parameters");
				assert.deepEqual(oNavigationHandlerMixAttributesArguments[0], oContextObject,
				"First parameter is equal to the context object");
				assert.equal(oNavigationHandlerMixAttributesArguments[1], sSelectionVariant,
				"Second is the selection variant");
				assert.equal(oNavigationHandlerNavigateArguments[2], sNavigationParameters,
				"Third parameter: Parameters for the target app - currently filled according to 'Gießkanne'");
				assert.equal(oNavigationHandlerNavigateArguments[3], null,
				"Forth parameter has a null object");
			});

			QUnit.test("onListNavigate (Intent) (ObjectPage specific)", function(assert) {
				// configure stubs
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				sandbox.stub(oHeaderBindingContext, "getObject", function(){return Object.freeze({headerAttribute: "headerABC"});}); // make sure, header context is not changed by sut!
				sNavigationParameters = "test";
				// prepare input
				var oContextObject = Object.freeze({lineAttribute: "lineXYZ"}); // make sure, context is not changed by sut!
				var sTableVariantId = "TableVariantID_4711";
				var oEventSource = {
						data: function() {
							return sCrossNavigationOutbound;
						},
						getBindingContext: function() {
							return {
								getObject: function() {
									return oContextObject;
								}
							};
						},
						getParent: function() {
							return {
								getParent: function() {
									return {
										getTable: Function.prototype
									};
								}
							};
						},
						getId: Function.prototype
				};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oNavigationHandlerMixAttributesArguments = undefined;
				// execute
				var oState = {};
				oCommonEventHandlers.onListNavigate(oEventSource, oState);
				// check
				assert.equal(oNavigationHandlerNavigateArguments[2], sNavigationParameters,
						"Third parameter: Parameters for the target app");
				assert.deepEqual(oNavigationHandlerNavigateArguments[3], null, "Forth parameter has to be a null object");
				assert.equal(oNavigationHandlerMixAttributesArguments.length, 2, "MixAttributes called with two parameters");
				var oMixedContextObject = {};
				extend(oMixedContextObject, oContextObject);
				extend(oMixedContextObject, oHeaderBindingContext.getObject());
				assert.deepEqual(oNavigationHandlerMixAttributesArguments[0], oMixedContextObject,
				"First parameter: Context Object with properties of both, header and line");
				assert.equal(oNavigationHandlerMixAttributesArguments[1], undefined, "Second parameter undefined");
			});

			QUnit.test("addEntry (Intent)", function(assert) {
				// configure stubs
				aSelectedContexts = [];
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				sNavigationParameters = undefined;
				// prepare input
				var oEventSource = {
						getParent: function() {
							return {
								getParent: function() {
									return {
										getTable: Function.prototype
									};
								}
							};
						},
						getBindingContext: Function.prototype,
						data: function() {
							return sCrossNavigationOutbound;
						}
				};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				// execute
				var result = oCommonEventHandlers.addEntry(oEventSource);
				// check
				assert.ok(result instanceof Promise, "AddEntry has to return a promise");
				var done = assert.async();
				setTimeout(function() {
					result.then(function() {
						assert.ok("the promise should be resolved");
						done();
					}, function() {
						assert.notOk("the promise should be resolved but was rejected");
						done();
					});
				});
				assert.equal(oNavigationHandlerNavigateArguments[2], undefined,
				"Third parameter: Parameters for the target app - undefined");
				assert.deepEqual(oNavigationHandlerNavigateArguments[3], null, "Forth parameter has to be a null object");
			});

			QUnit.test("Build Selection Variant for Navigation", function(assert){
				// prepare parameters
				// prio of values:
				// 1. manifest (if not {})
				// 2. LineContext
				// 2b. actually, an empty value should be denoted as {value: {}} in outbound section of manifest
				// 3. PageContext
				// 4. FilterBar
				// 5. manifest (only if {})
				var oOutbound = {parameters: {a: "manifest", b:{}, b1:{value:{}}, c:{}, d:{}, e: {}, e1: {value: {}}}};
				var oLineContext = {getObject: function(){return {a:"LineContext", b:"LineContext", b1:"LineContext"};}};
				var oPageContext = {getObject: function(){return {b:"PageContext", b1:"PageContext", c:"PageContext"};}};

				// Set up selectionVariant for FilterBAr
				var aRanges = [{
					High: null,
					Low: "SelectionVariant",
					Option: "EQ",
					Sign: "I"
				}];
				var sFilterBarSelectionVariant = JSON.stringify({
					SelectionVariantID: "",
					SelectOptions: [{
						PropertyName: "c",
						Ranges: aRanges
					},{
						PropertyName: "d",
						Ranges: aRanges
					}]
				});


				sandbox.stub(oNavigationHandler, "mixAttributesAndSelectionVariant", function() {
					return {
						getParameterNames: function() {
							return ["c", "d"];
						},
						toJSONString: Function.prototype
					};
				});

				// execution
				var oResult = oStubForPrivate.fnBuildSelectionVariantForNavigation(oOutbound, oLineContext, oPageContext, sFilterBarSelectionVariant);
				// check
				assert.ok(oNavigationHandler.mixAttributesAndSelectionVariant.calledTwice, "Mix Attributes called twice");
				assert.ok(oNavigationHandler.mixAttributesAndSelectionVariant.getCall(0).calledWith({},sFilterBarSelectionVariant), "First with empty object");

				var oExpectedInputForMixAttributes = {a:"manifest", b:"LineContext", b1:"LineContext", c:"PageContext", e: {}, e1:{}};
				assert.ok(oNavigationHandler.mixAttributesAndSelectionVariant.getCall(1).calledWith(oExpectedInputForMixAttributes, sFilterBarSelectionVariant),
						"Second call with object containing all properties with higer prio or not existent in Selection Variant");
			});

			QUnit.test("Evaluate Outbound Parameters", function(assert){
				// prepare parameters
				var oOutbound1 = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": "create"
						}
					}
				};
				var oOutbound1Multi = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": "create",
							"b"   : "bValue",
							"c"   : {}
						}
					}
				};
				var oOutbound2 = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": {
								"value": "create"
							}
						}
					}
				};
				var oOutbound2Multi = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": {
								"value": "create"
							},
							"b": {
								"value": "bValue"
							},
							"c": {}
						}
					}
				};
				var oOutbound3 = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": {
								"value": {
									"value": "create",
									"format": "plain"
								}
							}
						}
					}
				};
				var oOutbound3Multi = {
					"Name": {
						"semanticObject": "Product",
						"action": "manage",
						"parameters": {
							"mode": {
								"value": {
									"value": "create",
									"format": "plain"
								}
							},
							"b": {
								"value": {
									"value": "bValue",
									"format": "plain"
								}
							},
							"c": {
								"value": {
									"value": {},
									"format": "plain"
								}
							}
						}
					}
				};

				var oExpected = {};
				oExpected.mode = "create";

				// execution
				var oResult1 = oStubForPrivate.fnEvaluateParameters(oOutbound1.Name.parameters);
				var oResult2 = oStubForPrivate.fnEvaluateParameters(oOutbound2.Name.parameters);
				var oResult3 = oStubForPrivate.fnEvaluateParameters(oOutbound3.Name.parameters);

				assert.deepEqual(oResult1, oExpected, "Simple Parameter Result correct");
				assert.deepEqual(oResult2, oExpected, "Object Parameter Result correct");
				assert.deepEqual(oResult3, oExpected, "Value Parameter Result correct");

				var oExpectedMulti = {};
				oExpectedMulti.mode = "create";
				oExpectedMulti.b = "bValue";
				oExpectedMulti.c = {};

				// execution
				var oResult1Multi = oStubForPrivate.fnEvaluateParameters(oOutbound1Multi.Name.parameters);
				var oResult2Multi = oStubForPrivate.fnEvaluateParameters(oOutbound2Multi.Name.parameters);
				var oResult3Multi = oStubForPrivate.fnEvaluateParameters(oOutbound3Multi.Name.parameters);

				assert.deepEqual(oResult1Multi, oExpectedMulti, "Simple Multi Parameter Result correct");
				assert.deepEqual(oResult2Multi, oExpectedMulti, "Object Multi Parameter Result correct");
				assert.deepEqual(oResult3Multi, oExpectedMulti, "Value Multi Parameter Result correct");
			});

			module("lib.CommonEventHandlers.fnNavigateIntent", {
				setup: function() {
					oStubForPrivate = testableHelper.startTest();
					sandbox = sinon.sandbox.create();

					oCommonEventHandlers = new CommonEventHandlers(oController, oTemplateUtils.oComponentUtils,
							oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);
				},
				teardown: function() {
					sandbox.restore();
					testableHelper.endTest();
				}
			});

			QUnit.test("Function fnNavigateIntent", function(assert) {
				var oTemplateUtils = {
						oCommonUtils: {
							getSelectedContexts: function(oControl) {
								return aSelectedContexts;
							}
						}
				};
				var sSelectionVariant = "test";
				var oSmartFilterBar = {
						getUiState: function() {
							return {
								getSelectionVariant: function() {
									return sSelectionVariant;
								}
							}
						}
				};
				var oSmartControl = {};
				var oOutbound = {
						semanticObject: "Semantic Object",
						action: "action",
						parameters: {
							a: "a",
							b: "b"
						}
					};
				var oObjectInfo = {
						semanticObject : "Semantic Object",
						action: "action"
				};
				var oSelectionVariant = {
						toJSONString: function() {},
						_mSelectOptions: {
							Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
							Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}]
						}
				};
				sandbox.stub(oStubForPrivate, "fnBuildSelectionVariantForNavigation", function() {
					return oSelectionVariant;
				});
				var oNavigationExtensionStub = sandbox.stub(oController, "adaptNavigationParameterExtension", function(oSelectionVariant, oObjectInfo) {
					delete oSelectionVariant._mSelectOptions.Price;
				});
				sandbox.stub(oNavigationHandler, "navigate", function() {});
				var oContext = oTemplateUtils.oCommonUtils.getSelectedContexts();
				oStubForPrivate.fnNavigateIntent(oOutbound, oContext, oSmartFilterBar, oSmartControl);

				assert.ok(oNavigationExtensionStub.calledWith(oSelectionVariant, oObjectInfo),
				"Navigation extension called with the SelectionVariant and the ObjectInfo");
				assert.ok(!oSelectionVariant._mSelectOptions.Price,
				"Property Price was removed from SelectionOptions");
				assert.ok(oSelectionVariant._mSelectOptions.Currency,
				"Property Currency is still available in SelectionOptions");
			});


			 module("lib.CommonEventHandlers.fnHideTitleArea", {
				 setup: function() {
					 oStubForPrivate = testableHelper.startTest();
					 sandbox = sinon.sandbox.create();

					 oCommonEventHandlers = new CommonEventHandlers(oController, oTemplateUtils.oComponentUtils,
						 oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);
				 },
				 teardown: function() {
					 sandbox.restore();
					 testableHelper.endTest();
				 }
			 });

			 QUnit.test("Function fnHideTitleArea", function(assert) {
				 var aAllControls = [];

				 //********Test 1
				 //ownTitleArea
				 var oOwnTitleAreaIcon = new sap.ui.core.Icon("icon");
				 oOwnTitleAreaIcon.setSrc("picABC");
				 aAllControls.push(oOwnTitleAreaIcon);

				 var oOwnTitleAreaTitle = new sap.m.Text("title");
				 oOwnTitleAreaTitle.setText("titleABC");
				 aAllControls.push(oOwnTitleAreaTitle);

				 var oOwnTitleAreaDescription = new sap.m.Text("description");
				 oOwnTitleAreaDescription.setText("descriptionABC");
				 aAllControls.push(oOwnTitleAreaDescription);

				 //contactTitleArea
				 var aContactTitleArea = [];
				 aContactTitleArea[0] = {
					 Label : { String : "Label: Contact 1"},
					 RecordType : "com.sap.vocabularies.UI.v1.ReferenceFacet",
					 Target : { AnnotationPath : "@com.sap.vocabularies.Communication.v1.Contact#WeightUnitContact1"}
				 };

				 var oContactTitleAreaIcon = new sap.ui.core.Icon("com.sap.vocabularies.Communication.v1.Contact::WeightUnitContact1::contactTitleAreaIcon");
				 oContactTitleAreaIcon.setSrc("picABC");
				 aAllControls.push(oContactTitleAreaIcon);

				 var oContactTitleAreaTitle = new sap.m.Text("com.sap.vocabularies.Communication.v1.Contact::WeightUnitContact1::contactTitleAreaTitle");
				 oContactTitleAreaTitle.setText("titleABC");
				 aAllControls.push(oContactTitleAreaTitle);

				 var oContactTitleAreaDescription = new sap.m.Text("com.sap.vocabularies.Communication.v1.Contact::WeightUnitContact1::contactTitleAreaDescription");
				 oContactTitleAreaDescription.setText("descriptionABC");
				 aAllControls.push(oContactTitleAreaDescription);

				 var oContactTitleArea =  new sap.ui.layout.HorizontalLayout("com.sap.vocabularies.Communication.v1.Contact::WeightUnitContact1::contactTitleArea");
				 aAllControls.push(oContactTitleArea);

				 var oSmLiContent = sinon.createStubInstance(sap.ui.core.mvc.XMLView);
				 oSmLiContent.byId = function(sId) {
					 var oFoundControl;
					 for (var j = 0; j < aAllControls.length; j++) {
						 var oControl = aAllControls[j];
						 if (sId === oControl.getId()){
							 oFoundControl = oControl;
							 break;
						 }
					 }
					 return oFoundControl;
				 };
				 var oContactTitleAreaStub = sandbox.stub(oContactTitleArea, "setVisible");
				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");

				 //********Test 2
				 oContactTitleAreaStub.reset();
				 oOwnTitleAreaIcon.setSrc("XXXXXpicABC");

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.notCalled, "TitleArea are NOT identical due to OwnTitleAreaIcon - visible is not set");
				 oOwnTitleAreaIcon.setSrc("picABC");

				 //********Test 3
				 oContactTitleAreaStub.reset();
				 oContactTitleAreaTitle.setText("XXXXXXtitleABC");

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.notCalled, "TitleArea are NOT identical due to ContactTitleAreaTitle - visible is not set");
				 oContactTitleAreaTitle.setText("titleABC");

				 //********Test 4
				 oContactTitleAreaStub.reset();
				 oContactTitleAreaDescription.setText("XXXXXXdescriptionABC");

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.notCalled, "TitleArea are NOT identical due to ContactTitleAreaDescription - visible is not set");
				 oContactTitleAreaDescription.setText("descriptionABC");

				 //********Test 5
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 //aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.notCalled, "TitleArea are NOT identical due to OwnTitleAreaIcon empty - visible is not set");

				 //only hide the title area in case of filled fields - issue with timing of the hide check, therefore only checking if filled
				 /*
				 //********Test 6
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 //aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 //aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");

				 //********Test 7
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 oOwnTitleAreaIcon.setSrc("");
				 aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 //aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");
				 oOwnTitleAreaIcon.setSrc("picABC");

				 //********Test 8
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 //aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 aAllControls.push(oContactTitleAreaIcon);
				 oContactTitleAreaIcon.setSrc("");
				 aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");
				 oContactTitleAreaIcon.setSrc("picABC");

				 //********Test 9
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 oOwnTitleAreaDescription.setText("");
				 aAllControls.push(oOwnTitleAreaDescription);
				 aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 //aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");
				 oOwnTitleAreaDescription.setText("descriptionABC");

				 //********Test 10
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 //aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");

				 //********Test 11
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 aAllControls.push(oContactTitleAreaIcon);
				 //aAllControls.push(oContactTitleAreaTitle);
				 aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");

				 //********Test 12
				 oContactTitleAreaStub.reset();
				 var aAllControls = [];
				 aAllControls.push(oOwnTitleAreaIcon);
				 aAllControls.push(oOwnTitleAreaTitle);
				 aAllControls.push(oOwnTitleAreaDescription);
				 aAllControls.push(oContactTitleAreaIcon);
				 aAllControls.push(oContactTitleAreaTitle);
				 //aAllControls.push(oContactTitleAreaDescription);
				 aAllControls.push(oContactTitleArea);

				 oStubForPrivate.fnHideTitleArea(oSmLiContent, aContactTitleArea);

				 assert.ok(oContactTitleAreaStub.calledOnce, "TitleArea identical - visible set on false");*/
			 });

				module("lib.CommonEventHandlers.onDataFieldWithNavigationPath", {
					setup: function() {
						sandbox = sinon.sandbox.create();
						oStubForPrivate = testableHelper.startTest();
					},
					teardown: function() {
						testableHelper.endTest();
						sandbox.restore();
					}
				});

				QUnit.test("onDataFieldWithNavigationPath", function(assert){
					//prepare data
					var oEvent = sinon.createStubInstance(Event);
					var oContext = {
							getPath: function() {
								return "/CDN_C_STTA_SO_WD_20(SalesOrder='500000001',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";
							}
					};
					oEvent.getSource = function() {
						return {
							getCustomData: function() {
									return [{
											getProperty: function(sPropertyName) {
												if (sPropertyName === "key") {
													return "Target";
												}
												return "to_nav";
											}
									}];
							},
							getBindingContext: function() {
								return oContext;
							},
							data: Function.prototype
						}
					};
					var oController = {}, oCommonUtils = {}, oComponentUtils = {}, oServices = {}, oModel = {}, oNavigationController = {}, oMetaModel = {}, oApplication = {};
					var sPath = "/CDN_C_STTA_SO_WD_20(SalesOrder='500000001',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)" + "/" + "to_nav";
					var oNavigationKeyProperties = [{
							aKeys: [
							        {name: "SalesOrder", type: "Edm.String"},
							        {name: "DraftUUID", type: "Edm.Guid"},
							        {name: "IsActiveEntity", type: "Edm.Boolean"}
							        ],
							entitySet: "CDN_C_STTA_SO_WD_20",
							navigationProperty: undefined
					}];
					var sODataEntitySet = {
							entityType: "CDN_C_STTA_SO_WD_20_CDS.CDN_C_STTA_SO_WD_20Type",
							name: "CDN_C_STTA_SO_WD_20"
					};
					var sODataEntityType = {
							name: "CDN_C_STTA_SO_WD_20Type",
							namespace: "CDN_C_STTA_SO_WD_20_CDS",
							key: {
								propertyRef: [
								      {name: "SalesOrder", type: "Edm.String"},
							        {name: "DraftUUID", type: "Edm.Guid"},
							        {name: "IsActiveEntity", type: "Edm.Boolean"}
							  ]
							},
							navigationProperty: [
							        {name: "to_SO"},
							        {name: "to_nav"}
							]
					};
					var oODataEntityContainer = {
							entitySet: []
					};
					oODataEntityContainer.entitySet[0] = sODataEntitySet;
					var sEntitySet = "CDN_C_STTA_SO_WD_20";
					var oAssociationEnd = {type: "CDN_C_STTA_SO_WD_20_CDS.CDN_C_STTA_SO_WD_20Type"};
					var mParameters;
					//sandbox stubs
					sandbox.stub(oMetaModel, "getODataEntitySet", function() {
						return sODataEntitySet;
					});

					sandbox.stub(oMetaModel, "getODataEntityType", function() {
						return sODataEntityType;
					});

					sandbox.stub(oMetaModel, "getODataAssociationEnd", function() {
						return oAssociationEnd;
					});

					sandbox.stub(oMetaModel, "getODataEntityContainer", function() {
						return oODataEntityContainer;
					});

					sandbox.stub(oModel, "getMetaModel", function() {
						return oMetaModel;
					});

					sandbox.stub(oModel, "read", function(sPath, mParameters) {
						mParameters.success({});
					});

					sandbox.stub(oController, "getOwnerComponent", function() {
						return {
							getModel: function() {
								return oModel;
							},
							getEntitySet: function() {
								return sEntitySet;
							},
							getAppComponent: function() {
								return {
									getConfig: function() {
										return {
											settings : {

											}
										};
									}
								};
							}
						};
					});

					sandbox.stub(oCommonUtils, "getNavigationKeyProperties", function() {
						return oNavigationKeyProperties;
					});

					sandbox.stub(oCommonUtils, "mergeNavigationKeyPropertiesWithValues", function() {
						return "NavigationPath!";
					});

					sandbox.stub(oComponentUtils, "isDraftEnabled", function() {
						return true;
					});

					sandbox.stub(oComponentUtils, "getBusyHelper", function() {
						return {
							setBusy: function() {
								return;
							}
						};
					});

					sandbox.stub(oApplication, "setStoredTargetLayoutToFullscreen", function() {
						return;
					});

					sandbox.stub(oApplication, "invalidatePaginatorInfo", function() {
						return;
					});
					oServices.oApplication = oApplication;

					sandbox.stub(oNavigationController, "navigateToContext", function() {
						return;
					});
					oServices.oNavigationController = oNavigationController;

					//execute code to test
					var oCommonEventHandlers = new CommonEventHandlers(oController, oComponentUtils,
							oServices, oCommonUtils);
					oCommonEventHandlers.onDataFieldWithNavigationPath(oEvent);

					//Tests
					assert.ok(oModel.read.calledOnce, "Model read called (once!)");
					assert.ok(oModel.read.calledWith(sPath), "Model.read was called with sPath");
					assert.ok(oModel.getMetaModel.calledOnce, "Model getMetaModel called (once!)");

					assert.ok(oCommonUtils.getNavigationKeyProperties.calledOnce, "getNavigationKeyProperties read called (once!)");
					assert.ok(oCommonUtils.getNavigationKeyProperties.calledWith(sEntitySet), "getNavigationKeyProperties was called with " + sEntitySet);
					assert.ok(oCommonUtils.mergeNavigationKeyPropertiesWithValues.calledOnce, "mergeNavigationKeyPropertiesWithValues called (once!)");
					assert.ok(oCommonUtils.mergeNavigationKeyPropertiesWithValues.calledWith(oNavigationKeyProperties), "mergeNavigationKeyPropertiesWithValues was called with oNavigationKeyProperties");

					assert.ok(oMetaModel.getODataEntitySet.calledOnce, "MetaModel getODataEntitySet called (once!)");
					assert.ok(oMetaModel.getODataEntitySet.calledWith(sEntitySet), "getODataEntitySet was called with " + sEntitySet);
					assert.ok(oMetaModel.getODataEntityType.calledTwice, "MetaModel getODataEntityType called (twice!)");
					assert.ok(oMetaModel.getODataEntityType.calledWith(oAssociationEnd.type), "getODataEntityType was called with " + oAssociationEnd.type);
					assert.ok(oMetaModel.getODataEntityType.calledWith(sODataEntitySet.entityType), "getODataEntityType was called with " + sODataEntitySet.entityType);
					assert.ok(oMetaModel.getODataAssociationEnd.calledOnce, "MetaModel getODataAssociationEnd called (once!)");
					assert.ok(oMetaModel.getODataAssociationEnd.calledWith(sODataEntityType, "to_nav"), "getODataAssociationEnd was called with " + sEntitySet + " and " + "NavigationProperty 'to_nav'");
					assert.ok(oMetaModel.getODataEntityContainer.calledOnce, "MetaModel getODataEntityContainer called (once!)");

					assert.ok(oComponentUtils.isDraftEnabled.calledOnce, "oComponentUtils isDraftEnabled called (once!)");
					assert.ok(oComponentUtils.isDraftEnabled.returned(true), "oComponentUtils isDraftEnabled returns true");

					assert.ok(oNavigationController.navigateToContext.calledOnce, "oNavigationController navigateToContext called (once!)");
					assert.ok(oNavigationController.navigateToContext.calledWith("NavigationPath!"), "oNavigationController navigateToContext was called with 'NavigationPath!'");
				});


			module("lib.CommonEventHandlers.fnGetSelectedItemContextForDeleteMessage", {
				setup: function() {
					oStubForPrivate = testableHelper.startTest();
					sandbox = sinon.sandbox.create();

					oCommonEventHandlers = new CommonEventHandlers(oController, oTemplateUtils.oComponentUtils,
							oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);
				},
				teardown: function() {
					sandbox.restore();
					testableHelper.endTest();
				}
			});

			QUnit.test("Function fnGetSelectedItemContextForDeleteMessage", function(assert) {
				var oSelectedItem = {
					getPath: function() {
						return "/dummyContextPath";
					},
					getModel: function() {
						return {
							"oData": {
								"dummyContextPath": {
									"dummyPropertyPath": "dummyValue"
								}
							}
						};
					}
				};
				var aCustomData = [{
					getKey: function() {
						return "headerInfo";
					},
					getValue: function() {
						return {
							"headerTitle": "Dummy Title",
							"isHeaderTitlePath": false,
							"headerSubTitle": "Dummy SubTitle",
							"isHeaderSubTitlePath": false
						};
					}
				}];

				var getTextStub = sandbox.stub(oTemplateUtils.oCommonUtils, "getText", function() {
					return;
				});

				oSmartTable.getCustomData.returns(aCustomData);
				var fnGetSelectedItemContextForDeleteMessageStub = oStubForPrivate.fnGetSelectedItemContextForDeleteMessage(oSmartTable, oSelectedItem);

				assert.ok(getTextStub.calledWith("DELETE_WITH_OBJECTINFO", [" ", "Dummy Title", "Dummy SubTitle"]), "getText called with correct arguments");
			});

		});


/*globals window, sinon*/
sap.ui.define("sap/apf/utils/tNavigationHandler", [
	"sap/apf/utils/navigationHandler",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/testhelper/ushellHelper",
	"sap/apf/core/utils/filter",
	"sap/apf/utils/filter",
	"sap/ui/core/routing/HashChanger",
	"sap/apf/core/messageObject",
	"sap/ui/model/Filter"
], function(NavigationHandler, DoubleMessageHandler, ushellHelper, CoreFilter, UtilsFilter, HashChanger, MessageObject, Ui5Filter){
	'use strict';
	function commonSetup(testEnv, navigationTargets, navigationTargetsAssignedToActiveStep, buildComplexCummulativeFilter, FilterReduction, getCumulativeFilterFunction) {
		testEnv.messageHandler = new DoubleMessageHandler().doubleCheckAndMessaging().spyPutMessage();
		testEnv.callCountCumulativeFilter = 0;
		testEnv.xAppStateIdInUrlHash = "";
		var inject = {
			instances : {
				messageHandler : testEnv.messageHandler,
				component : { type : "Component" },
				startFilterHandler : {
					getStartFilters : function() {
						return jQuery.Deferred().resolve();
					},
					deserialize : function() {
						testEnv.deserializeStartFilterHandlerCalled = true;
					}
				},
				serializationMediator : {
					serialize : function(isTransient) {
						testEnv.serializeOnMediatorIsTransient = isTransient;
						return jQuery.Deferred().resolve({
							path : {
								path :'path'
							},
							smartFilterBar : {
								sfb :'sfb'
							},
							filterIdHandler : {
								fih : 'fih'
							},
							startFilterHandler : {
								sfh : 'sfh'
							},
							dirtyState : false,
							pathName : 'APF Path'
						});
					},
					deserialize : function() {
						testEnv.deserializeOnMediatorCalled = true;
						return jQuery.Deferred().resolve();
					}
				}
			},
			functions : {
				getAllParameterEntitySetKeyProperties : function(callback){
					callback(['pA']);
				},
				isFilterReductionActive : function() {
					return testEnv.isFilterReductionActive;
				},
				getNavigationTargets : function() {
					return navigationTargets;
				},
				getActiveStep : function() {
					return {
						getAssignedNavigationTargets : function() {
							return navigationTargetsAssignedToActiveStep;
						}
					};
				},
				getCumulativeFilterUpToActiveStep : function() {
					
					if (getCumulativeFilterFunction) {
						return jQuery.Deferred().resolve(getCumulativeFilterFunction());
					}
					var leftFilterPart, rightFilterPart;
					testEnv.callCountCumulativeFilter++;
					if (buildComplexCummulativeFilter) {
						leftFilterPart = new CoreFilter(testEnv.messageHandler).addOr('A', 'eq', '1').addOr('A', 'eq', '2').addOr('A', 'eq', '1');
						rightFilterPart = new CoreFilter(testEnv.messageHandler).addOr('A', 'eq', '1').addOr('A', 'eq', '2').addOr('A', 'eq', '42');
						testEnv.cumulativeFilter = new CoreFilter(testEnv.messageHandler).addAnd(leftFilterPart).addAnd(rightFilterPart);
					} else {
						testEnv.cumulativeFilter = new CoreFilter(testEnv.messageHandler, "SAPClient", "EQ", "888");
						testEnv.cumulativeFilter.addAnd(new CoreFilter(testEnv.messageHandler, "Country", "EQ", "BRA"));
					}

					return jQuery.Deferred().resolve(testEnv.cumulativeFilter);
				},
				deserialize : function() {
					testEnv.deserializeCalled = true;
				},
				deserializeFilterIds : function() {
					testEnv.deserializeFilterIdsCalled = true;
				},
				setDirtyState : function() {
					testEnv.setDirtyStateCalled = true;
				},
				setPathName : function() {
					testEnv.setPathNameCalled = true;
				},
				createRequest : function(sRequestConfigurationId) {
					testEnv.createRequestCalled = true;
					testEnv.sRequestConfigurationId = sRequestConfigurationId;
					return {
						sendGetInBatch : function(oFilter, fnCallback, oRequestOptions) {
							testEnv.sendGetInBatchCalled = true;
							if (testEnv.letMappingRequestFail) {
								fnCallback(new MessageObject({
									code : "5001"
								}));
								return;
							}
							var oResponse = {
								data : [ {
									targetProperty1 : "A",
									targetProperty2 : "B"
								}, {
									targetProperty1 : "C",
									targetProperty2 : "D"
								} ]
							};
							fnCallback(oResponse);
						}
					};
				},
				getXappStateId : function() {
					return testEnv.xAppStateIdInUrlHash;
				}
			}
		};
		if (FilterReduction) {
			inject.constructors = {
					FilterReduction : FilterReduction
			};
		}
		testEnv.navigationHandler = new NavigationHandler(inject);
	}
	QUnit.module("Customizing", {
		beforeEach : function(assert) {
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				isStepSpecific : false
			}, {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial",
				isStepSpecific : true
			} ];
			var config = {
				functions : {
					getSemanticObjectLinkIntents : function(semanticObject) {
						if (semanticObject === "DaysSalesOutstanding") {
							return [ {
								intent : "DaysSalesOutstanding-analyzeDSO~fupps",
								text : "analyzeDSOTEXT"
							} ];
						} else if (semanticObject === "Materials") {
							return [ {
								intent : "Materials-analyzeMaterial?aParameter=2",
								text : "analyzeMaterialTEXT"
							}, {
								intent : "Materials-countMaterial~H",
								text : "countMaterialTEXT"
							} ];
						}
					}
				}
			};
			ushellHelper.setup(config);
		},
		afterEach : function() {
			ushellHelper.teardown();
		}
	});
	QUnit.test("WHEN getNavigationTargets without existing assignment of navigation targets to step", function(assert) {
		assert.expect(1);
		
		commonSetup(this, this.defaultTargets);
		var expectedNavigationTargets = {
			global : [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				text : "analyzeDSOTEXT"
				}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				text : "analyzeMaterialTEXT"
				} ],
			stepSpecific : []
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN only global targets are returned. List of step specific targets is empty.");
		});
	});
	QUnit.test("WHEN getNavigationTargets without existing assignment of navigation targets to step AND useDynamicalParameters is active", function(assert) {
		assert.expect(2);
		var FilterReductionStub = function() {
			
			this.reduceFilter = function(messageHandler, filter) {
				assert.ok(true, "filter reduction has been called");
				return filter;
			};
		};
		commonSetup(this, this.defaultTargets, false, false, FilterReductionStub);
		
		this.defaultTargets[0].useDynamicParameters = true;
		this.defaultTargets[1].useDynamicParameters = true;
		this.defaultTargets[2].useDynamicParameters = true;
	
		var expectedNavigationTargets = {
			global : [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				text : "analyzeDSOTEXT",
				"useDynamicParameters": true,
				"parameters": [
					{
						"key": "SAPClient",
						"value": "888"
					},
					{
						"key": "Country",
						"value": "BRA"
					}
			]}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				text : "analyzeMaterialTEXT",
				"useDynamicParameters": true,
				"parameters": [
					{
						"key": "SAPClient",
						"value": "888"
					},
					{
						"key": "Country",
						"value": "BRA"
					}]
			} ],
			stepSpecific : []
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN only global targets are returned. List of step specific targets is empty.");
		});
	});
	QUnit.test("WHEN getNavigationTargets is called twice with changed cumulative filter up to current step AND dynamic parameters are active", function(assert) {
		assert.expect(4);
		var that = this;
		this.called = 0;
		var filterCreator = function() {

				that.called++;
				if (that.called == 1) {
					return new CoreFilter(that.messageHandler, "A", "EQ", "1");
				}
				return new CoreFilter(that.messageHandler, "B", "EQ", "2");
		};
		commonSetup(this, this.defaultTargets, false, false, undefined, filterCreator);
		this.defaultTargets[0].useDynamicParameters = true;
		this.defaultTargets[1].useDynamicParameters = true;
		var expectedParametersOnFirstCall =	[ { "key": "A", "value": "1" }];
		var expectedParametersOnSecondCall =	[ { "key": "B", "value": "2" }];
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			
			assert.deepEqual(navTargets.global[0].parameters, expectedParametersOnFirstCall, "THEN parameters as expected.");
			assert.deepEqual(navTargets.global[1].parameters, expectedParametersOnFirstCall, "THEN parameters as expected.");
			 
			that.navigationHandler.getNavigationTargets().done(function(navTargets) {
				assert.deepEqual(navTargets.global[0].parameters, expectedParametersOnSecondCall, "THEN parameters as expected.");
				assert.deepEqual(navTargets.global[1].parameters, expectedParametersOnSecondCall, "THEN parameters as expected.");
			});
		});
	});
	QUnit.test("WHEN getNavigationTargets without existing assignment of navigation targets to step AND empty filter is returned - so no parameters", function(assert) {
		assert.expect(1);
		
		commonSetup(this, this.defaultTargets);
		var expectedNavigationTargets = {
			global : [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				text : "analyzeDSOTEXT"}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				text : "analyzeMaterialTEXT"
			} ],
			stepSpecific : []
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN only global targets are returned. List of step specific targets is empty.");
		});
	});
	QUnit.test("WHEN getNavigationTargets without existing assignment of navigation targets to step AND filter reduction fails", function(assert) {
		assert.expect(2);
		var FilterReductionStub = function() {
			
			this.reduceFilter = function(messageHandler, filter) {
				assert.ok(true, "filter reduction has been called");
				return null;
			};
		};
		commonSetup(this, this.defaultTargets, false, false, FilterReductionStub);
		this.defaultTargets[0].useDynamicParameters = true;
		this.defaultTargets[1].useDynamicParameters = true;
		var expectedNavigationTargets = {
			global : [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				text : "analyzeDSOTEXT",
				 "useDynamicParameters": true,
				 "parameters": [
					{
						"key": "SAPClient",
						"value": "888"
					},
					{
						"key": "Country",
						"value": "BRA"
					}]
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				text : "analyzeMaterialTEXT",
				"useDynamicParameters": true,
				"parameters": [
					{
						"key": "SAPClient",
						"value": "888"
					},
					{
						"key": "Country",
						"value": "BRA"
					}]
			} ],
			stepSpecific : []
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN only global targets are returned. List of step specific targets is empty.");
		});
	});
	QUnit.test("WHEN getNavigationTargets with assignment of navigation targets to step AND use dynamic parameters active", function(assert) {
		
		commonSetup(this, this.defaultTargets, [ {
			id : 'nav-MM2',
			type : 'navigationTarget',
			useDynamicParameters : true
		} ]);
		this.defaultTargets[0].useDynamicParameters = true;
		this.defaultTargets[1].useDynamicParameters = true;
		this.defaultTargets[2].useDynamicParameters = true;
		
		var expectedNavigationTargets = {
			global : [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				text : "analyzeDSOTEXT",
				"useDynamicParameters": true,
				"parameters": [
					{
						"key": "SAPClient",
						"value": "888"
					},
					{
						"key": "Country",
						"value": "BRA"
					}
				]
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				text : "analyzeMaterialTEXT",
				 "useDynamicParameters": true,
				 "parameters": [
					{
						"key": "SAPClient",
						"value": "888"
					},
					{
						"key": "Country",
						"value": "BRA"
					}
				]
			} ],
			stepSpecific : [ {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial",
				text : "countMaterialTEXT",
				"useDynamicParameters": true,
				"parameters": [
					{
						"key": "SAPClient",
						"value": "888"
					},
					{
						"key": "Country",
						"value": "BRA"
					}
				]
			} ]
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN targets are returned in their respective category. Either global or step specific.");
		});
	});
	QUnit.module("Navigation Handler Customizing reading texts with missing intent", {
		beforeEach : function(assert) {
			var that = this;
			that.callCounterGetSemanticObjectLinks = 0;
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				isStepSpecific : false
			}, {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial"
			} ];
			commonSetup(this, this.defaultTargets);
			var config = {
				functions : {
					getSemanticObjectLinkIntents : function(semanticObject) {
						if (semanticObject === "DaysSalesOutstanding") {
							that.callCounterGetSemanticObjectLinks++;
							return [ {
								intent : "DaysSalesOutstanding-analyzeDSO~fupps",
								text : "analyzeDSOTEXT"
							} ];
						} else if (semanticObject === "Materials") {
							return [ {
								intent : "Materials-analyzeMaterial?aParameter=2",
								text : "analyzeMaterialTEXT"
							} ];
						}
					}
				}
			};
			ushellHelper.setup(config);
		},
		afterEach : function() {
			ushellHelper.teardown();
		}
	});
	QUnit.test("WHEN getNavigationTargets is called", function(assert) {
		var that = this;
		var expectedNavigationTargets = {
			"global" : [ {
				"action" : "analyzeDSO",
				"id" : "nav-SD",
				"semanticObject" : "DaysSalesOutstanding",
				"text" : "analyzeDSOTEXT"
			}, {
				"action" : "analyzeMaterial",
				"id" : "nav-MM1",
				"semanticObject" : "Materials",
				"text" : "analyzeMaterialTEXT"
			} ],
			"stepSpecific" : []
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN navigation targets with text expected");
		});
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN on SECOND CALL navigation targets with text expected");
			assert.equal(that.callCounterGetSemanticObjectLinks, 1, "THEN results are buffered");
		});
	});
	QUnit.module("Navigation with mandatory parameters", {
		beforeEach : function(assert) {
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				parameters: [ {key: 'mandatoryParameter', value: 'AB'},
											{key: 'optionalParameter', value: 'CD'} ]
			}, {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				parameters: [{key: 'optionalParameter', value: 'CD'}]
			} ];
			var config = {
				functions : {
					getSemanticObjectLinkIntents : function(semanticObject, action, parameters) {
						if (semanticObject === "DaysSalesOutstanding" && action === "analyzeDSO" && parameters.mandatoryParameter) {
							return [ {
								intent : "DaysSalesOutstanding-analyzeDSO~fupps",
								text : "analyzeDSOTEXT"
							} ];
						} 
						return [ ];
					}
				}
			};
			ushellHelper.setup(config);
		},
		afterEach : function() {
			ushellHelper.teardown();
		}
	});
	QUnit.test("WHEN getNavigationTargets for navigation targets with mandatory parameters is called", function(assert) {
		var done = assert.async();
		commonSetup(this, this.defaultTargets);
		var expectedNavigationTargets = {
			global : [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				text : "analyzeDSOTEXT",
				parameters: [ {key: 'mandatoryParameter', value: 'AB'},
											{key: 'optionalParameter', value: 'CD'} ]
			} ],
			stepSpecific : []
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN only targets with specified mandatory parameters are returned.");
			done();
		});
	});
	QUnit.test("WHEN getNavigationTargets for navigation targets with mandatory parameters is called AND use dynamic parameters is active", function(assert) {
		var done = assert.async();
		commonSetup(this, this.defaultTargets);
		this.defaultTargets[0].useDynamicParameters = true;
		var expectedNavigationTargets = {
			global : [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				text : "analyzeDSOTEXT",
				 "useDynamicParameters": true,
				parameters: [ {key: 'mandatoryParameter', value: 'AB'},
											{key: 'optionalParameter', value: 'CD'},
											{key: 'SAPClient', value: '888'},
											{key: 'Country', value: 'BRA'}]
			} ],
			stepSpecific : []
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN only targets with specified mandatory parameters are returned.");
			done();
		});
	});
	
	QUnit.module('Outbound navigation', {
		beforeEach : function(assert) {
			var that = this;
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				parameters: [{
					key : "key",
					value : "value"
				},{
					key : "key2",
					value : "value2"
				}]
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial"
			}, {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial"
			} ];
			commonSetup(this, this.defaultTargets);
			ushellHelper.setup();
			that.resultGetHash = "";
			this.hashChangerStub = sinon.stub(HashChanger, "getInstance", function(){
				return {
					getHash : function() {
						return that.resultGetHash;
					},
					replaceHash : function() {
						that.replaceHashCalled = true;
						return;
					}
				};
			});
		},
		afterEach : function() {
			ushellHelper.teardown();
			this.hashChangerStub.restore();
		}
	});
	
	QUnit.test("WHEN navigateToApp is called", function(assert) {
		this.navigationHandler.navigateToApp('nav-SD');
		var expectedTarget = {
			"action" : "analyzeDSO",
			"semanticObject" : "DaysSalesOutstanding"
		};
		
		var expectedParams = {
			key : "value",
			key2 : "value2"
		};
		
		assert.deepEqual(ushellHelper.getExternalNavigationConfiguration().target, expectedTarget, "THEN navigation parameter target as expected");
		assert.deepEqual(ushellHelper.getExternalNavigationConfiguration().params, expectedParams, "THEN navigation parameter params as expected");	
		assert.equal(ushellHelper.getExternalNavigationConfiguration().appStateKey, "AppStateKey1972", "THEN appStateKey as expected");
		assert.ok(!this.createRequestCalled, "No request for filter mapping was created");
		assert.ok(!this.sendGetInBatchCalled, "No request for filter mapping was executed");
		var expectedCumulatedFilter = new Ui5Filter({
			filters : [ new Ui5Filter({
				path : "SAPClient",
				operator : "EQ",
				value1 : "888"
			}), new Ui5Filter({
				path : "Country",
				operator : "EQ",
				value1 : "BRA"
			}) ],
			and : true
		});
		assert.deepEqual(ushellHelper.spys.setData.sapApfCumulativeFilter, expectedCumulatedFilter, "THEN the expected cumulated filter is passed to the navigation target");
		assert.equal(ushellHelper.getExternalComponent().type, 'Component', "THEN component has been second parameter of call 'toExternal'");
	});
	QUnit.test("WHEN navigateToApp is called AND use dynamic paramters is active", function(assert) {
		this.navigationHandler.navigateToApp('nav-SD');
		this.defaultTargets[0].useDynamicParameters = true;
		var expectedTarget = {
			"action" : "analyzeDSO",
			"semanticObject" : "DaysSalesOutstanding"
		};
		
		var expectedParams = {
			key : "value",
			key2 : "value2"
		};
		
		assert.deepEqual(ushellHelper.getExternalNavigationConfiguration().target, expectedTarget, "THEN navigation parameter target as expected");
		assert.deepEqual(ushellHelper.getExternalNavigationConfiguration().params, expectedParams, "THEN navigation parameter params as expected");	
		assert.equal(ushellHelper.getExternalNavigationConfiguration().appStateKey, "AppStateKey1972", "THEN appStateKey as expected");
		assert.ok(!this.createRequestCalled, "No request for filter mapping was created");
		assert.ok(!this.sendGetInBatchCalled, "No request for filter mapping was executed");
		var expectedCumulatedFilter = new Ui5Filter({
			filters : [ new Ui5Filter({
				path : "SAPClient",
				operator : "EQ",
				value1 : "888"
			}), new Ui5Filter({
				path : "Country",
				operator : "EQ",
				value1 : "BRA"
			}) ],
			and : true
		});
		assert.deepEqual(ushellHelper.spys.setData.sapApfCumulativeFilter, expectedCumulatedFilter, "THEN the expected cumulated filter is passed to the navigation target");
		assert.equal(ushellHelper.getExternalComponent().type, 'Component', "THEN component has been second parameter of call 'toExternal'");
	});
	QUnit.test("WHEN navigate to App without configured parameters", function(assert) {

		this.navigationHandler.navigateToApp('nav-MM1');
		
		var expectedTarget = {
				semanticObject : "Materials",
				action : "analyzeMaterial"
		};
		
		assert.deepEqual(ushellHelper.getExternalNavigationConfiguration().target, expectedTarget, "THEN navigation parameter target as expected");
		assert.deepEqual(ushellHelper.getExternalNavigationConfiguration().params, undefined, "THEN navigation parameter params is filled with single values from cumulative filter up to active step");	
	});
	QUnit.test("WHEN navigate to App without configured parameters AND use dynamic parameters is active", function(assert) {
		this.defaultTargets[1].useDynamicParameters = true;
		this.navigationHandler.navigateToApp('nav-MM1');
		var expectedParams = { 'SAPClient': "888", 'Country': "BRA"};
		var expectedTarget = {
				semanticObject : "Materials",
				action : "analyzeMaterial"
		};
		
		assert.deepEqual(ushellHelper.getExternalNavigationConfiguration().target, expectedTarget, "THEN navigation parameter target as expected");
		assert.deepEqual(ushellHelper.getExternalNavigationConfiguration().params, expectedParams, "THEN navigation parameter params is filled with single values from cumulative filter up to active step");	
	});
	QUnit.test("Navigate calls serialization mediator with indicator for navigation set to 'true'", function(assert) {
		var expectedApfState = {
			path : {
				path :'path'
			},
			smartFilterBar : {
				sfb :'sfb'
			},
			filterIdHandler : {
				fih : 'fih'
			},
			startFilterHandler : {
				sfh : 'sfh'
			},
			dirtyState : false,
			pathName : 'APF Path'
		};
		this.navigationHandler.navigateToApp('nav-SD');
		assert.equal(this.serializeOnMediatorIsTransient, true, 'Serialization called with transient indicator set correctly');
		assert.deepEqual(ushellHelper.spys.setData.sapApfState, expectedApfState, 'Correct APF State from serialization mediator');
	});
	QUnit.test("Navigate calls getCumulativeFilterUpToActiveStep twice", function(assert) {
		this.navigationHandler.navigateToApp('nav-SD');
		assert.equal(this.callCountCumulativeFilter, 1, 'Navigation calls getCumulativeFilterUpToActiveStep()');
	});
	QUnit.test("Push cummulative filter to app state", function(assert) {
		var sapApfCumulativeFilter;
		this.navigationHandler.navigateToApp('nav-SD');
		sapApfCumulativeFilter = UtilsFilter.createFilterFromSapUi5FilterJSON(this.messageHandler, ushellHelper.spys.setData.sapApfCumulativeFilter).getInternalFilter();
		assert.ok(this.cumulativeFilter.isEqual(sapApfCumulativeFilter), "Correct SAPUI5 cumulative filter passed to app state");
		assert.equal(ushellHelper.spys.isSaved, true, 'App state saved');
	});
	QUnit.test("Check navigation mode: backward", function(assert) {
		this.resultGetHash = "gugge=musik&sap-xapp-state=ABc123456&james=last&sap-iapp-state=123456ABcd&hugo=steak";
		var result = this.navigationHandler.checkMode();
		result.done(function(mode) {
			assert.deepEqual(mode, {
				navigationMode : "backward"
			}, "Backward navigation detected");
			assert.ok(this.deserializeOnMediatorCalled, 'APF state deserialization called in backward mode');
		}.bind(this));
	});
	QUnit.test("Check navigation mode: forward", function(assert) {
		assert.expect(1);
		this.resultGetHash = "gugge=musik&james=last&hugo=steak";
		var result = this.navigationHandler.checkMode();
		result.done(function(mode) {
			assert.deepEqual(mode, {
				navigationMode : "forward"
			}, "Forward navigation detected");
		});
	});
	QUnit.test("Check navigation mode: forward with xapp-state", function(assert) {
		assert.expect(1);
		this.xAppStateIdInUrlHash = '0123456789';
		var result = this.navigationHandler.checkMode();
		result.done(function(mode) {
			assert.deepEqual(mode, {
				navigationMode : "forward",
				sapApfCumulativeFilter : "UI5 filter expression"
			}, "Forward navigation with xapp state detected");
		});
	});
	QUnit.test("checkMode() removes sap-iapp-state in hash", function(assert) {
		this.navigationHandler.checkMode();
		assert.ok(this.replaceHashCalled, "sap-iapp-state successfully removed in hash");
	});
	QUnit.module('Outbound navigation with error handling in filter simplification', {
		beforeEach : function(assert) {
			var that = this;
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial"
			}, {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial"
			} ];
			var FilterReductionThatFails =	function() {
				this.reduceFilter = function() {
					return null;
				};
				this.isContradicted = function() {
					return true;
				};
			};
			commonSetup(this, this.defaultTargets, false, false, FilterReductionThatFails);
			ushellHelper.setup();
			that.resultGetHash = "";
			this.hashChangerSave = HashChanger;
			HashChanger = {
				getInstance : function() {
					return {
						getHash : function() {
							return that.resultGetHash;
						},
						replaceHash : function() {
							that.replaceHashCalled = true;
							return;
						}
					};
				}
			};
		},
		afterEach : function() {
			ushellHelper.teardown();
			HashChanger = this.hashChangerSave;
		}
	});
	QUnit.test("WHEN filter reduction active AND filter cannot be reduced", function(assert){
	
		this.isFilterReductionActive = true;
		this.navigationHandler.navigateToApp('nav-SD');
		assert.equal(this.messageHandler.spyResults.putMessage.code, "5235", "THEN technical message as expected");
	});
	QUnit.module("Navigation with filter mapping", {
		beforeEach : function(assert) {
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				filterMapping : {
					requestForMappedFilter : "RequestForFilterMapping1",
					target : [ "targetProperty1", "targetProperty2" ]
				}
			} ];
			commonSetup(this, this.defaultTargets);
			ushellHelper.setup();
		},
		afterEach : function() {
			ushellHelper.teardown();
			HashChanger = this.hashChangerSave;
		}
	});
	QUnit.test("Request for filter mapping fails", function(assert) {
		this.letMappingRequestFail = true;
		this.navigationHandler.navigateToApp('nav-SD');
		assert.ok(this.createRequestCalled, "THEN the request for filter mapping is created");
		assert.equal(this.sRequestConfigurationId, "RequestForFilterMapping1", 'THEN the request for filter mapping is created with the right configuration Id');
		assert.ok(this.sendGetInBatchCalled, "THEN the request for filter mapping is executed");
		assert.equal(this.messageHandler.spyResults.putMessage.getCode(), "5001", "THEN the error from the failed request for filter mapping is logged");
		assert.ok(!ushellHelper.spys.setData && !ushellHelper.spys.isSaved, "THEN the navigation is not further processed");
	});
	QUnit.test("Request for filter mapping succeeds", function(assert) {
		var filter = new Ui5Filter({
			filters : [	new Ui5Filter({
				filters : [	new Ui5Filter({
					path : "targetProperty1",
					operator : "EQ",
					value1 : "A"
				}),	new Ui5Filter({
					path : "targetProperty2",
					operator : "EQ",
					value1 : "B"
				}) ],
				and : true
			}),	new Ui5Filter({
				filters : [	new Ui5Filter({
					path : "targetProperty1",
					operator : "EQ",
					value1 : "C"
				}),	new Ui5Filter({
					path : "targetProperty2",
					operator : "EQ",
					value1 : "D"
				}) ],
				and : true
			}) ],
			and : false
		});
		filter.bAnd = false;
		var expectedCumulatedFilter =	new Ui5Filter({
			filters : [	new Ui5Filter({
				path : "SAPClient",
				operator : "EQ",
				value1 : "888"
			}), new Ui5Filter({
				path : "Country",
				operator : "EQ",
				value1 : "BRA"
			}), filter ],
			and : true
		});
		this.navigationHandler.navigateToApp('nav-SD'); //CUT
		assert.ok(this.createRequestCalled, "THEN the request for filter mapping is created");
		assert.equal(this.sRequestConfigurationId, "RequestForFilterMapping1", 'THEN the request for filter mapping is created with the right configuration Id');
		assert.ok(this.sendGetInBatchCalled, "THEN the request for filter mapping is executed");
		assert.ok(ushellHelper.spys.setData && ushellHelper.spys.isSaved, "THEN the navigation is further processed");
		assert.deepEqual(ushellHelper.spys.setData.sapApfCumulativeFilter, expectedCumulatedFilter, "THEN the expected cumulated filter including the filter mapping is passed to the navigation target");
	});
	
	QUnit.module('Filter simplification', {
		beforeEach : function(assert) {
			var that = this;
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial"
			}, {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial"
			} ];
			var buildComplexCummulativeFilter = true;
			commonSetup(this, this.defaultTargets, undefined, buildComplexCummulativeFilter);
			ushellHelper.setup();
			that.resultGetHash = "";
			this.hashChangerSave = HashChanger;
			HashChanger = {
				getInstance : function() {
					return {
						getHash : function() {
							return that.resultGetHash;
						},
						replaceHash : function() {
							that.replaceHashCalled = true;
							return;
						}
					};
				}
			};
			sinon.stub(jQuery.sap, 'uid', function () {
				return 'someId';
			});
		},
		afterEach : function() {
			ushellHelper.teardown();
			HashChanger = this.hashChangerSave;
			jQuery.sap.uid.restore();
		}
	});
	QUnit.test("WHEN navigateToApp is called", function(assert) {

		this.isFilterReductionActive = false;
		this.navigationHandler.navigateToApp('nav-SD');
		var filterA = new Ui5Filter({
			and: false,
			filters: [
				 new Ui5Filter({
					operator: "EQ",
			path: "A",
			value1: "1"
		}),
		new Ui5Filter({
			operator: "EQ",
			path: "A",
			value1: "2"
		}),
		new Ui5Filter({
			operator: "EQ",
			path: "A",
			value1: "1"
				})
			]
		});
		filterA.bAnd = false;
		var filterB = new Ui5Filter({
			and: false,
			filters: [
				 new Ui5Filter({
						operator: "EQ",
					path: "A",
					value1: "1"
				 }),
				 new Ui5Filter({
					operator: "EQ",
					path: "A",
					value1: "2"
				 }),
				 new Ui5Filter({
					operator: "EQ",
					path: "A",
					value1: "42"
				})
			]
		});
		filterB.bAnd = false;
		var expectedCumulatedFilterWithoutFilterReduction = 
			new Ui5Filter({
					and: true,
					filters: [filterA, filterB]
			});
		var expectedSelectionVariant = 	
		{
			"Parameters": [],
			"SelectOptions": [
				{
					"PropertyName": "A",
					"Ranges": [
						{
							"Low": "1",
							"Option": "EQ",
							"Sign": "I"
						},
						{
							"Low": "2",
							"Option": "EQ",
							"Sign": "I"
						}
					]
				}
			],
			"SelectionVariantID": "someId"
		};
		assert.deepEqual(ushellHelper.spys.setData.sapApfCumulativeFilter, expectedCumulatedFilterWithoutFilterReduction, "THEN the expected cumulated filter is passed to the navigation target");
		assert.deepEqual(ushellHelper.spys.setData.selectionVariant, expectedSelectionVariant, "THEN selectionVariant is passed to the navigation target");

		this.isFilterReductionActive = true;
		this.navigationHandler.navigateToApp('nav-SD');

		var expectedCumulatedFilterWithFilterReduction = new Ui5Filter({
			and: false,
			filters: [
				new Ui5Filter({
					operator: "EQ",
					path: "A",
					value1: "1"
				}),
				new Ui5Filter({
					operator: "EQ",
					path: "A",
					value1: "2"
				})
			]
		});
		expectedCumulatedFilterWithFilterReduction.bAnd = false;
		var expectedSelectionVariant = {
			SelectionVariantID: 'someId',
			Parameters: [],
			SelectOptions: [{
				PropertyName: 'A',
				Ranges: [{
					Low: '1',
					Sign: 'I',
					Option: 'EQ'
				},{
					Low: '2',
					Sign: 'I',
					Option: 'EQ'
				}]
			}]
		};
		assert.deepEqual(ushellHelper.spys.setData.sapApfCumulativeFilter, expectedCumulatedFilterWithFilterReduction, "THEN the simplified / reduced expected cumulated filter is passed to the navigation target");
		assert.deepEqual(ushellHelper.spys.setData.selectionVariant, expectedSelectionVariant, "THEN the simplified / reduced selectionVariant is passed to the navigation target");

	});
	QUnit.module("Generate selection variant", {
		beforeEach: function (){
			commonSetup(this, undefined, undefined, false);
			sinon.stub(jQuery.sap, 'uid', function () {
				return 'someId';
			});
		},
		afterEach: function () {
			jQuery.sap.uid.restore();
		}
	});
	QUnit.test("SelectionVariant if filterreduction is turned off", function (assert) {
		this.isFilterReductionActive = false;
		var filter = new CoreFilter(this.messageHandler, 'A', 'le', '5');
		filter.addAnd(new CoreFilter(this.messageHandler, 'A', 'eq', '1'));
		
		var expect = {
			SelectionVariantID: 'someId',
			Parameters: [],
			SelectOptions: [{
				PropertyName: 'A',
				Ranges: [{
					Low: '1',
					Option: 'EQ',
					Sign: 'I'
				}]
			}]
		};
		var promise = this.navigationHandler.generateSelectionVariant(filter);
		promise.done(function(selectionVariant){
			assert.deepEqual(selectionVariant, expect, 'selectionVariant with simplified filter returned');
		});
	});
	QUnit.test("SelectionVariant if filterreduction is turned on", function (assert) {
		this.isFilterReductionActive = true;
		var filter = new CoreFilter(this.messageHandler, 'A', 'eq', '1');
		var expect = {
				SelectionVariantID: 'someId',
				Parameters: [],
				SelectOptions: [{
					PropertyName: 'A',
					Ranges: [{
						Low: '1',
						Option: 'EQ',
						Sign: 'I'
					}]
				}]
		};
		var promise = this.navigationHandler.generateSelectionVariant(filter);
		promise.done(function(selectionVariant){
			assert.deepEqual(selectionVariant, expect, 'selectionVariant returned');
		});
	});
	QUnit.test("SelectionVariant if filterreduction is turned on and empty filter is given", function (assert) {
		this.isFilterReductionActive = true;
		var filter = new CoreFilter(this.messageHandler);
		var expect = {
				SelectionVariantID: 'someId'
		};
		var promise = this.navigationHandler.generateSelectionVariant(filter);
		promise.done(function(selectionVariant){
			assert.deepEqual(selectionVariant, expect, 'selectionVariant with empty selectOptions is returned');
		});
	});
	QUnit.test("SelectionVariant if filterreduction is turned off and not well-formed filter is given", function (assert) {
		this.isFilterReductionActive = false;
		var filter = new CoreFilter(this.messageHandler);
		var leftFilter = new CoreFilter(this.messageHandler).addAnd("A", "LE", 1);
		var rightFilter = new CoreFilter(this.messageHandler).addOr("A", "EQ", 2).addOr("A","EQ",3);
		filter.addAnd(leftFilter).addAnd(rightFilter);
		var expect = {
			"SelectionVariantID": "someId",
			"Text": "Filter could not be converted to a selectionVariant"
		};
		var promise = this.navigationHandler.generateSelectionVariant(filter);
		promise.done(function(selectionVariant){
			assert.deepEqual(selectionVariant, expect, 'selectionVariant with empty selectOptions is returned');
		});
	});
	
	QUnit.module("No navigation service available", {
		beforeEach : function(assert) {
			var defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial"
			} ];
			commonSetup(this, defaultTargets);
		}
	});
	
	QUnit.test("WHEN no ushell service is available AND getNavigationTargets is called", function(assert){
		var done = assert.async();
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, { global : [], stepSpecific : [] }, "THEN no navigation targets are returned");
			assert.equal(this.messageHandler.spyResults.putMessage.code, "5074", "THEN technical error is logged");
			done();
		}.bind(this));
	});
	QUnit.test("WHEN no ushell service is available AND getNavigationTargets is called twice", function(assert){
		var done = assert.async();
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.equal(this.messageHandler.spyResults.putMessage.code, "5074", "THEN technical error is logged first time");
			this.navigationHandler.getNavigationTargets().done(function(navTargets) {
				assert.deepEqual(navTargets, { global : [], stepSpecific : [] }, "THEN no navigation targets are returned");
				assert.equal(this.messageHandler.spyResults.putMessage.code, "5074", "THEN technical error is not logged again");
				done();
			}.bind(this));
		}.bind(this));
	});
});
/*
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */
(function() {
	'use strict';

	jQuery.sap.declare("sap.apf.integration.withServer.tPathPersistenceOData");
	jQuery.sap.require('sap.apf.testhelper.authTestHelper');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.testhelper.config.configurationForIntegrationTesting');
	jQuery.sap.require('sap.apf.internal.server.userData');
	jQuery.sap.require('sap.apf.api');
	jQuery.sap.require('sap.apf.utils.utils');

	QUnit.module('Path serialization/deserialization via SerializationMediator', {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			this.messageObjects = [];
			this.fnOdataWrapper = sap.apf.core.odataRequestWrapper;
			sap.apf.core.odataRequestWrapper = function(oInject, oRequest, fnSuccess, fnError, oBatchHandler) {
				var datajs = oInject.instances.datajs;
				function success(data, response) {
					try {

						var oMessage = sap.apf.core.utils.checkForTimeout(response);
						var oError = {};

						if (oMessage) {
							oError.messageObject = oMessage;
							fnError(oError);
						} else {
							fnSuccess(data, response);
						}
					} catch (err) {
					}
				}
				function error(oError) {
					try {
						var oMessage = sap.apf.core.utils.checkForTimeout(oError);

						if (oMessage) {
							oError.messageObject = oMessage;
						}
						fnError(oError);
					} catch (err) {
					}
				}

				var oMetadata = oRequest.serviceMetadata;
				datajs.request(oRequest, success, error, oBatchHandler, undefined, oMetadata);
			};
			var MessageHandler = function() {
				var idRegistry;
				var messageCallback;
				var dummyFunction = function() {};
				this.activateOnErrorHandling =  dummyFunction;
				this.loadConfig = function(aMessages, bResetRegistry) {
					if (idRegistry === undefined || bResetRegistry) {
						idRegistry = new sap.apf.utils.Hashtable(this);
					}
					for(var i = 0; i < aMessages.length; i++) {
						idRegistry.setItem(aMessages[i].code, aMessages[i]);
					}
				};
				this.setLifeTimePhaseStartup =  dummyFunction;
				this.setMessageCallback = function(callback) {
					messageCallback = callback;
				};
				this.setTextResourceHandler = dummyFunction;
				this.setLifeTimePhaseStartup = dummyFunction;
				this.setLifeTimePhaseRunning = dummyFunction;
				this.setLifeTimePhaseShutdown = dummyFunction;
				this.isOwnException = dummyFunction;
				this.setCallbackForTriggeringFatal = dummyFunction;
				this.fatalErrorOccurredAtStartup = function() { return false; };
				this.createMessageObject = function(oConfig) {
					return new sap.apf.core.MessageObject(oConfig);
				};
				this.check = function(condition) {
					if (!condition) {
						throw new Error("error");
					}
				};
				this.putMessage = function(messageObject) {
					that.messageObjects.push(messageObject);
					var code = messageObject.getCode();
					var severity = idRegistry.getItem(code).severity;
					messageCallback(messageObject);
					if (severity === "fatal") {
						throw new Error(code);
					}
				};
			};
			var component = {
					getComponentData : function() {
						return {
							startupParameters : {}
						};
					},
					getMetadata : function() {
						return {
							getComponentName : function() {
								return "testPathPersistenceOdata";
							}
						};
					}
			};
			function UiInstance () {
				this.handleStartup = function() {
					return sap.apf.utils.createPromise();
				};
				this.createApplicationLayout = function() {
					
				};
			} 
			function Probe(dependencies) {
				that.coreApi = dependencies.coreApi;
				that.serializationMediator = dependencies.serializationMediator;
				that.startFilterHandler = dependencies.startFilterHandler;
				that.messageHandler = dependencies.messageHandler;
			}
			this.api = new sap.apf.Api(component, {
				constructors : { MessageHandler : MessageHandler,
					UiInstance : UiInstance 
				},
				probe : Probe
			});
			this.fnOriginalAjax = jQuery.ajax;
			this.messageHandler.setMessageCallback(function(){});
			sap.apf.testhelper.replacePathsInAplicationConfiguration(this.fnOriginalAjax);
			var sUrl = sap.apf.testhelper.determineTestResourcePath() + "/integration/withServer/integrationTestingApplicationConfiguration.json";
			this.coreApi.loadApplicationConfig(sUrl);
			
			
			
			this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
				var oFilter = this.defineFilter({
					'SAPClient' : '777'
				});
				this.sapClientFilterId = this.api.addPathFilter(oFilter);
				this.api.setCallbackAfterApfStartup(function() {
					done();
				});
				this.api.startApf();
			}.bind(this));
		},
		defineFilter : function(filters) {
			var oFilter = this.coreApi.createFilter();
			var oExpression;
			var property;
			for(property in filters) {
				oExpression = {
						name : property,
						operator : sap.apf.core.constants.FilterOperators.EQ,
						value : filters[property]
				};
				oFilter.getTopAnd().addExpression(oExpression);
			}
			return oFilter;
		},
		createThreeSteps : function() {
			var deferred = jQuery.Deferred();
			function resolvePromiseOnLastStepUpdate(oStep) {
				if (oStep === this.oStep3) {
					deferred.resolve();
				}
			}
			function addStep3(oStep) {
				if (oStep === this.oStep2) {
					this.oStep3 = this.coreApi.createStep("stepTemplate1", resolvePromiseOnLastStepUpdate.bind(this));
				}
			}
			function addStep2() {
				this.oStep2 = this.coreApi.createStep("stepTemplate1", addStep3.bind(this));
			}
			this.oStep1 = this.coreApi.createStep("stepTemplate1", addStep2.bind(this));
			return deferred.promise();
		},
		selectionOnSecondStep : function() {
			var deferred = jQuery.Deferred();
			var aSteps = this.coreApi.getSteps();
			var lastStepIndice = aSteps.length - 1;
			var lastStep = aSteps[lastStepIndice];
			var oStepToChangeSelection = aSteps[1];
			var oRepresentation = oStepToChangeSelection.getSelectedRepresentation();
			oRepresentation.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002);
			this.coreApi.updatePath(function(oStep) {
				if (oStep === lastStep) {
					deferred.resolve();
				}
			});
			return deferred.promise();
		},
		afterEach : function() {
			jQuery.ajax = this.fnOriginalAjax;
			sap.apf.core.odataRequestWrapper = this.fnOdataWrapper;
			this.serializationMediator.readPaths(callbackRead.bind(this));
			function callbackDeletePath(oResponse, oEntityMetadata, oMessageObject) {
				if (oMessageObject !== undefined) {
					throw new Error("no error during path deletion");
				}
			}
			function callbackRead(oResponse) {
				for( var i in oResponse.paths) {
					this.coreApi.deletePath(oResponse.paths[i].AnalysisPath, callbackDeletePath);
				}
			}
		}
	});
	QUnit.test('Save an empty path', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var sPathId;
		var that = this;
		this.startFilterHandler.getStartFilters().done(function() {
			that.serializationMediator.savePath("myEmptyPath", callbackSave);
		});
		function callbackSave(oResponse) {
			sPathId = oResponse.AnalysisPath;
			that.coreApi.resetPath();
			that.serializationMediator.openPath(sPathId, callbackOpen);
		}
		function callbackOpen(oResponse, oEntityTypeMetadata, oMessageObject) {
			assert.equal(oMessageObject, undefined, "THEN no error occurred");
			assert.equal(that.coreApi.getSteps().length, 0, "Empty path expected");
			assert.deepEqual(that.coreApi.getActiveStep(), undefined, "No active step exists");
			done();
		}
	});
	QUnit.test("Path with 3 steps, selection on second step and filter set", function(assert) {
		assert.expect(6);
		var done = assert.async();
		var that = this;
		var oSapClientFilter = this.defineFilter({
			'SAPClient' : '777'
		});
		var myFilter = this.defineFilter({
			'myFilterProperty' : 'default'
		});
		this.api.updatePathFilter(this.sapClientFilterId, oSapClientFilter);
		var myFilterId = this.api.addPathFilter(myFilter);
		this.startFilterHandler.getStartFilters().done(function() {
			that.createThreeSteps().done(function() {
				that.coreApi.setActiveStep(that.oStep2);
				that.selectionOnSecondStep().done(function() {
					var sPathId;
					var aExptectedPath = [ that.oStep1.serialize(), that.oStep2.serialize(), that.oStep3.serialize() ];
					that.serializationMediator.savePath("myNewPath", callbackSave);
					function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
						assert.deepEqual(oEntityTypeMetadata.type, "entityTypeMetadata", "Correct type of metadata");
						assert.deepEqual(oMessageObject, undefined, "Message object expected undefined");
						sPathId = oResponse.AnalysisPath;
						that.api.updatePathFilter(myFilterId, that.defineFilter({
							'myFilterProperty' : 'changed'
						}));
						that.serializationMediator.openPath(sPathId, callbackOpen);
					}
					function callbackOpen(oResponse, oEntityTypeMetadata, oMessageObject) {
						that.coreApi.updatePath(function() {
						});
						var aSerializedPath = [ that.coreApi.getSteps()[0].serialize(), that.coreApi.getSteps()[1].serialize(), that.coreApi.getSteps()[2].serialize() ];
						assert.deepEqual(aSerializedPath, aExptectedPath, "Steps in opened path equal with steps of saved path");
						assert.deepEqual(that.coreApi.getActiveStep(), that.oStep2, "Second step is active");
						assert.notEqual(that.coreApi.getActiveStep(), that.oStep2, "Different instances");
						assert.equal(that.api.getPathFilter(myFilterId).getInternalFilter().toUrlParam(), "(myFilterProperty%20eq%20%27default%27)", "Changed filter in PathContextHandler successfully restored");
						done();
					}
				});
			});
		});
	});
	QUnit.test("Modification of stored path", function(assert) {
		assert.expect(3);
		var done = assert.async();
		var that = this;
		var sPathId;
		this.startFilterHandler.getStartFilters().done(function() {
			that.createThreeSteps().done(function() {
				that.serializationMediator.savePath("myNewPath", callbackSave);
				function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
					assert.deepEqual(oMessageObject, undefined, "Expected undefined oMessageObject");
					if (oResponse.AnalysisPath) {
						sPathId = oResponse.AnalysisPath;
						that.coreApi.removeStep(that.oStep2, function(oStep) {
							if (oStep === that.oStep3) {
								that.serializationMediator.savePath(sPathId, "myNewPathModified", callbackModify);
							}
						});
					}
				}
				function callbackModify(oResponse) {
					that.serializationMediator.readPaths(callbackRead);
				}
				function callbackRead(oResponse) {
					for( var path in oResponse.paths) {
						if (oResponse.paths[path].AnalysisPath === sPathId) {
							assert.equal(oResponse.paths[path].StructuredAnalysisPath.steps.length, 2, 'Modified path has two steps');
							assert.equal(oResponse.paths[path].AnalysisPathName, "myNewPathModified", 'Modified name expected');
							done();
						}
					}
				}
			});
		});
	});
	QUnit.test("Deletion of stored path", function(assert) {
		assert.expect(1);
		var done = assert.async();
		var that = this;
		var calledFirstTime = true;
		var s2ndPathId, nSaveCounter = 1;
		var bPathFound = false;
		this.startFilterHandler.getStartFilters().done(function() {
			that.createThreeSteps().done(function() {
				that.serializationMediator.savePath("myFirstPath", callbackSave);
				that.serializationMediator.savePath("mySecondPath", callbackSave);
				that.serializationMediator.savePath("myThirdPath", callbackSave);
				function callbackSave(oResponse) {
					switch (nSaveCounter) {
					case 2:
						s2ndPathId = oResponse.AnalysisPath;
						break;
					case 3:
						that.serializationMediator.deletePath(s2ndPathId, callbackDelete);
						break;
					}
					nSaveCounter++;
				}
				function callbackDelete() {
					that.serializationMediator.readPaths(callbackRead);
				}
				function callbackRead(aPaths) {
					for( var i in aPaths) {
						if (aPaths[i].AnalysisPath === s2ndPathId) {
							bPathFound = true;
						}
					}
					assert.ok(!bPathFound, "Path not found as expected");
					if (calledFirstTime) {
						done();
						calledFirstTime = false;
					}
				}
			});
		});
	});
	QUnit.test("Save path with analytical config id in start parameter", function(assert) {
		assert.expect(2);
		var done = assert.async();
		var that = this;
		function setConfigIdToParameter(configId) {
			that.coreApi.getStartParameterFacade = function() {
				return {
					getAnalyticalConfigurationId : function() {
						return { configurationId : configId };
					},
					getSapClient : function() {
						return undefined;
					}
				};
			};
		}
		var sPathIdOfConfig1;
		var sPathIdOfConfig2;
		var pathWithConfig1Included = false;
		var pathWithConfig2Included = false;
		setConfigIdToParameter("configId1");
		this.startFilterHandler.getStartFilters().done(function() {
			function callbackFirstSave(oResponse) {
				sPathIdOfConfig1 = oResponse.AnalysisPath;
				that.coreApi.resetPath();
				setConfigIdToParameter("configId2");
				that.serializationMediator.savePath("myPathWithConfig2", callbackSecondSave);
			}
			function callbackSecondSave(oResponse) {
				sPathIdOfConfig2 = oResponse.AnalysisPath;
				that.coreApi.resetPath();
				that.serializationMediator.readPaths(callbackRead);
			}
			function callbackRead(oResponse, oEntityTypeMetadata, oMessageObject) {
				var paths = oResponse.paths;
				paths.forEach(function(path) {
					if (path.AnalysisPath === sPathIdOfConfig1) {
						pathWithConfig1Included = true;
					}
					if (path.AnalysisPath === sPathIdOfConfig2) {
						pathWithConfig2Included = true;
					}
				});
				assert.ok(!pathWithConfig1Included, "Path with config id 1 not included");
				assert.ok(pathWithConfig2Included, "Path with config id 2 included");
				done();
			}
			that.serializationMediator.savePath("myPathWithConfig1", callbackFirstSave);
		});
	});
	QUnit.test("Check server response of all persistence functions ", function(assert) {
		assert.expect(28);
		var done = assert.async();
		var pathId;
		var that = this;
		this.startFilterHandler.getStartFilters().done(function() {
			that.createThreeSteps().done(function() {
				that.serializationMediator.savePath("myCreatePath", callbackSave);
				function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
					assert.ok(oResponse !== undefined, "CREATE: Contains data");
					assert.ok(oResponse.AnalysisPath !== undefined, "CREATE: Contains analysis path ID");
					assert.ok(oMessageObject === undefined, "CREATE: Contains no oMessageObject");
					assert.ok(oEntityTypeMetadata !== undefined, "CREATE: Metadata exists");
					assert.ok(oEntityTypeMetadata.getEntityTypeMetadata !== undefined, "CREATE: Entity type metadata exists");
					assert.ok(oEntityTypeMetadata.getPropertyMetadata !== undefined, "CREATE: Property metadata exists");
					pathId = oResponse.AnalysisPath;
					that.serializationMediator.savePath(pathId, "myModifyPath", callbackModify);
				}
				function callbackModify(oResponse, oEntityTypeMetadata, oMessageObject) {
					assert.ok(oResponse.AnalysisPath, "MODIFY: Contains no data");
					assert.equal(oResponse.status, "successful", "correct status");
					assert.ok(oMessageObject === undefined, "MODIFY: Contains no oMessageObject");
					assert.ok(oEntityTypeMetadata !== undefined, "MODIFY: Metadata exists");
					assert.ok(oEntityTypeMetadata.getEntityTypeMetadata !== undefined, "MODIFY: Entity type metadata exists");
					assert.ok(oEntityTypeMetadata.getPropertyMetadata !== undefined, "MODIFY: Property metadata exists");
					that.serializationMediator.readPaths(callbackRead);
				}
				function callbackRead(oResponse, oEntityTypeMetadata, oMessageObject) {
					assert.ok(oResponse !== undefined, "READ: Contains data");
					assert.ok(oResponse.paths instanceof Array, "READ: data result is array");
					assert.ok(oMessageObject === undefined, "READ: Contains no oMessageObject");
					assert.ok(oEntityTypeMetadata !== undefined, "READ: Metadata exists");
					assert.ok(oEntityTypeMetadata.getEntityTypeMetadata !== undefined, "READ: Entity type metadata exists");
					assert.ok(oEntityTypeMetadata.getPropertyMetadata !== undefined, "READ: Property metadata exists");
					that.serializationMediator.openPath(pathId, callbackOpen);
				}
				function callbackOpen(oResponse, oEntityTypeMetadata, oMessageObject) {
					assert.ok(oResponse !== undefined, "OPEN: Contains data");
					assert.ok(oMessageObject === undefined, "OPEN: Contains no oMessageObject");
					assert.ok(oEntityTypeMetadata !== undefined, "OPEN: Metadata exists");
					assert.ok(oEntityTypeMetadata.getEntityTypeMetadata !== undefined, "OPEN: Entity type metadata exists");
					assert.ok(oEntityTypeMetadata.getPropertyMetadata !== undefined, "OPEN: Property metadata exists");
					that.serializationMediator.deletePath(pathId, callbackDelete);
				}
				function callbackDelete(oResponse, oEntityTypeMetadata, oMessageObject) {
					assert.equal(oResponse.status, "successful", "DELETE: correct status");
					assert.ok(oMessageObject === undefined, "DELETE: Contains no oMessageObject");
					assert.ok(oEntityTypeMetadata !== undefined, "DELETE: Metadata exists");
					assert.ok(oEntityTypeMetadata.getEntityTypeMetadata !== undefined, "DELETE: Entity type metadata exists");
					assert.ok(oEntityTypeMetadata.getPropertyMetadata !== undefined, "DELETE: Property metadata exists");
					done();
				}
			});
		});
	});
	QUnit.test("Open path with invalid ID", function(assert) {
		var done = assert.async();
		var that = this;
		var messageCounter = 0;
		this.messageHandler.setMessageCallback(assertMessageCode5208);
		function assertMessageCode5208(oMessageObject) {
			var messageCode;
			messageCode = oMessageObject.getCode();
			if (messageCounter === 0) {
				messageCounter++;
				assert.deepEqual(messageCode, "5208", "Invalid ID detected and message thrown");
			} else {
				assert.deepEqual(messageCode, "5210", "Invalid ID detected and message thrown");
				done();
			}
		}
		this.startFilterHandler.getStartFilters().done(function() {
			that.serializationMediator.openPath("myInvalidPathID", function(){});
		});
	});
	QUnit.test("Modification with invalid ID", function(assert) {
		var that = this;
		var done = assert.async();
		this.startFilterHandler.getStartFilters().done(function() {
			that.serializationMediator.savePath("myInvalidPathID", "myNewPath", callbackModify);
			function callbackModify(oResponse, oMetadata, oMessageObject) {
				var messageCode;
				if (oMessageObject) {
					messageCode = oMessageObject.getCode();
				}
				assert.deepEqual(messageCode, "5208", "Invalid ID detected and message thrown");
				done();
			}
		});
	});
	QUnit.test("Deletion with invalid ID", function(assert) {
		var that = this;
		var done = assert.async();
		this.startFilterHandler.getStartFilters().done(function() {
			that.serializationMediator.deletePath("myInvalidPathID", callbackDelete);
			function callbackDelete(oResponse, oMetadata, oMessageObject) {
				var messageCode;
				if (oMessageObject) {
					messageCode = oMessageObject.getCode();
				}
				assert.deepEqual(messageCode, "5208", "Invalid ID detected and message thrown");
				done();
			}
		});
	});
	QUnit.test("Number of steps reached", function(assert) {
		var that = this;
		var done = assert.async();
		var nConstNumberOfSteps = 32;
		var i;
		function createStepCallback() {
		}
		for(i = 0; i < (nConstNumberOfSteps + 1); i++) {
			this.coreApi.createStep("stepTemplate1", createStepCallback);
		}
		this.startFilterHandler.getStartFilters().done(function() {
			that.serializationMediator.savePath("myLongPath", callbackSave);
			function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
				var sCode;
				assert.ok(oMessageObject, "Error detected");
				if (oMessageObject) {
					sCode = oMessageObject.getCode();
				}
				assert.equal(sCode, "5204", "Correct error code received from callback");

				done();
			}
		});
	});
	QUnit.test("Save and open path with umlaut in name", function(assert) {
		var sPathId;
		var that = this;
		var done = assert.async();

		this.startFilterHandler.getStartFilters().done(function() {
			that.serializationMediator.savePath("myÜmlautPath", callbackSave);
			function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
				sPathId = oResponse.AnalysisPath;
				that.serializationMediator.openPath(sPathId, callbackOpen);
			}
			function callbackOpen(oResponse, oEntityTypeMetadata, oMessageObject) {
				assert.equal(that.coreApi.getPathName(), "myÜmlautPath", "saved path with umlaut name correct opened");
				done();
			}
		});
	});
	QUnit.test("Maximum lenght of path name exceeded (101 characters)", function(assert) {
		var that = this;
		var done = assert.async();
		var sTooLongName = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ma";
		this.startFilterHandler.getStartFilters().done(function() {
			that.serializationMediator.savePath(sTooLongName, callbackSave);
			function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
				assert.ok(oMessageObject, "Message Object thrown");
				done();
			}
		});
	});
}());
////TODO: EG: Test is too expensive to let it run repeatedly due to creation of 256 paths. Test should be run if necessary (e.g. changes on HANA or migration to NW Gateway)
//asyncTest("Maximum number of paths reached", function() {
//expect(2);

//function formatNumber(number) { //format to three-digit number since HANA preview sorts incorrectly
//var tmp = number + '';
//while (tmp.length < 3)
//tmp = '0' + tmp;
//return tmp;
//}

//var i = 0;
//var nConstNumberOfPaths = 256;
//var formattedNumber = formatNumber(0);

//this.serializationMediator.savePath("myPath Number " + formattedNumber, callbackSave.bind(this));

//function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
//i++;
//if (i <= nConstNumberOfPaths) {
//formattedNumber = formatNumber(i);
//this.serializationMediator.savePath("myPath Number " + formattedNumber, callbackSave.bind(this));
//return;
//}
//var sCode;
//ok(oMessageObject, "Error detected");
//if (oMessageObject) {
//sCode = oMessageObject.getCode();
//}
//equal(sCode, "5205", "Correct error code received");
//start();
//}
//});
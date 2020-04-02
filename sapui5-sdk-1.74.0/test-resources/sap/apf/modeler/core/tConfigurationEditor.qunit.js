/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery,  sinon*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require("sap.apf.modeler.core.configurationEditor");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.modeler.core.step");
jQuery.sap.require("sap.apf.modeler.core.hierarchicalStep");
jQuery.sap.require("sap.apf.modeler.core.representation");
jQuery.sap.require("sap.apf.modeler.core.elementContainer");
jQuery.sap.require("sap.apf.modeler.core.configurationObjects");
jQuery.sap.require("sap.apf.modeler.core.smartFilterBar");
jQuery.sap.require("sap.apf.modeler.core.facetFilter");
jQuery.sap.require("sap.apf.modeler.core.navigationTarget");
jQuery.sap.require("sap.apf.modeler.core.registryWrapper");
jQuery.sap.require("sap.apf.core.configurationFactory");
jQuery.sap.require("sap.apf.core.metadataFacade");
jQuery.sap.require("sap.apf.core.metadataProperty");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.core.entityTypeMetadata");
jQuery.sap.require("sap.apf.core.metadata");
(function() {
	'use strict';
	function ODataProxyStub() {
		var serverGeneratedId = 0;
		this.assertData = function() {
			//this function will be overwritten in test
			return undefined;
		};
		this.create = function(type, applicationData, callback) {
			this.assertData(type, applicationData, callback);
			serverGeneratedId++;
			callback({
				AnalyticalConfiguration : "idGeneratedByServer-" + serverGeneratedId
			}, {}, undefined);
		};
		this.update = function(type, applicationData, callback, inputParameters) {
			this.assertData(type, applicationData, callback, inputParameters);
			serverGeneratedId++;
			callback(applicationData.AnalyticalConfiguration, {}, undefined);
		};
		this.readEntity = function(entitySetName, callback, inputParameters, selectList) {
			this.assertData(entitySetName, callback, inputParameters, selectList);
		};
	}
	function ConfigurationHandlerStub() {
		this.getApplicationId = function() {
			return "ApplicationId";
		};
		this.getConfiguration = function(id) {
			//only return config if method is called with correct parameter of type string
			if (typeof id === "string") {
				return {
					AnalyticalConfigurationName : "ConfigurationName"
				};
			}
		};
		this.updateConfigurationName = function() {
		};
		this.replaceConfigurationId = function(tempId, serverGeneratedId) {
			return undefined;
		};
	}
	QUnit.module("M: ConfigurationEditor", {
		beforeEach : function(assert) {
			var that = this;
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.odataProxy = new ODataProxyStub();
			this.configurationHandler = new ConfigurationHandlerStub();
			var textKeyCounter = 0;

			var metadataFactoryDouble = new function() {
				this.getMetadata = function(service) {
					if (service === "myInvalidService") {
						that.messageHandler.putMessage("messageObject");
						return jQuery.Deferred().reject();
					}
					return jQuery.Deferred().resolve({
						getAllEntitySetsExceptParameterEntitySets : function() {
							return [ "entitySet1", "entitySet2" ];
						},
						getAllPropertiesOfEntitySet : function(entitySet) {
							if (entitySet === "myInvalidEntitySet") {
								return [];
							}
							return [ "property1", "property2" ];
						},
						getEntitySetByEntityType : function(entityType) {
							if (entityType === "entityType1") {
								return "entitySet1";
							} else if (entityType === "entityType2") {
								return "entitySet2";
							}
							return "";
						},
						getAllProperties : function() {
							return [ "property1", "property2", "property3", "property4" ];
						},
						getFilterableProperties : function(entitySet) {
							switch (entitySet) {
								case "entitySet1":
									return [ "property1", "property2" ];
								case "entitySet2":
									return [ "property2", "property3", "property4" ];
								default:
									break;
							}
						},
						getFilterablePropertiesAndParameters : function() {
							return [ "property1", "property3", "property4", "parameter5" ];
						},
						getHierarchicalEntitySets : function() {
							return [ "hierarchicalEntitySet" ];
						},
						getHierarchicalPropertiesOfEntitySet : function() {
							return [ "hierarchicalProperty" ];
						},
						getNonHierarchicalPropertiesOfEntitySet : function() {
							return [ "nonHierarchicalProperty" ];
						},
						getHierarchyAnnotationsForProperty : function(entitySet, property) {
							if (entitySet === "hierarchicalEntitySet" && property === "hierarchyProperty") {
								return {
									hierarchyNodeFor : "hierarchyNodeID"
								};
							}
							return "messageObject";
						}
					});
				};

				this.getEntitySets = function(service) {
					var deferred = jQuery.Deferred();
					setTimeout(function() {
						if (service === "myInvalidService") {
							deferred.resolve([]);
						} else {
							deferred.resolve([ "entitySet1", "entitySet2" ]);
						}
					}, 1);
					return deferred.promise();
				};
				this.getEntityTypes = function(service) {
					var deferred = jQuery.Deferred();
					setTimeout(function() {
						deferred.resolve([ "entityType1", "entityType2" ]);
					}, 1);
					return deferred.promise();
				};
				this.getAllEntitySetsExceptParameterEntitySets = function(service) {
					var deferred = jQuery.Deferred();
					this.getMetadata(service).done(function(metadata){
						deferred.resolve(metadata.getAllEntitySetsExceptParameterEntitySets(service));
					}).fail(function(){
						deferred.resolve([]);
					});
					return deferred.promise();
				};
			};
			var ConfigurationFactory = function(inject) {
				sap.apf.core.ConfigurationFactory.call(this, inject);
				var loadConfig = this.loadConfig;

				this.loadConfig = function(config, loadInDesignTime) {
					assert.ok(loadInDesignTime, "THEN flag has been set");
					loadConfig(config, loadInDesignTime);
				};
			};
			this.inject = {
				instances : {
					messageHandler : this.messageHandler,
					persistenceProxy : this.odataProxy,
					configurationHandler : this.configurationHandler,
					textPool : {
						getPersistentKey : function() {
							return "persistentTextKey-" + ++textKeyCounter;
						},
						get : function(id) {
							return {
								TextElement : id,
								TextElementDescription : id + "Description"
							};
						}
					},
					metadataFactory : metadataFactoryDouble
				},
				constructors : {
					//					metadataFactory: metadataFactoryDouble, //normally more needed for metadata factory
					Hashtable : sap.apf.utils.Hashtable,
					Step : sap.apf.modeler.core.Step,
					HierarchicalStep : sap.apf.modeler.core.HierarchicalStep,
					SmartFilterBar : sap.apf.modeler.core.SmartFilterBar,
					FacetFilter : sap.apf.modeler.core.FacetFilter,
					NavigationTarget : sap.apf.modeler.core.NavigationTarget,
					ElementContainer : sap.apf.modeler.core.ElementContainer,
					Representation : sap.apf.modeler.core.Representation,
					ConfigurationObjects : sap.apf.modeler.core.ConfigurationObjects,
					ConfigurationFactory : ConfigurationFactory,
					RegistryProbe : function(registry) {
						this.getItem = function(id) {
							return registry.getItem(id) || "";
						};
						this.getCategories = function() {
							return [];
						};
						this.getSteps = function() {
							return [];
						};
						this.getFacetFilters = function() {
							return [];
						};
						this.getNavigationTargets = function() {
							return [];
						};
					}
				}
			};
			this.configurationEditor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
			this.category1 = {
				labelKey : "localTextReference1"
			};
			this.category2 = {
				labelKey : "localTextReference2"
			};
			this.category3 = {
				labelKey : "localTextReference3"
			};
		}
	});
	QUnit.test("Get all non hierarchical properties of entitySet", function(assert) {
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.getNonHierarchicalPropertiesOfEntitySet("path/to/service/serviceName1", "hierarchicalEntitySet").done(function(result) {
			assert.deepEqual(result, [ "nonHierarchicalProperty" ], "All non hierarchical properties of entitySet returned");
		});
	});
	QUnit.test("Get all non hierarchical properties of entitySet with invalid service", function(assert) {
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.getNonHierarchicalPropertiesOfEntitySet("myInvalidService").done(function(result) {
			assert.deepEqual(result, [], "Invalid service returns empty array");
		});
	});
	QUnit.test("Register service and get all services", function(assert) {
		assert.expect(8);
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.registerServiceAsPromise("path/to/service/serviceName1").done(function(result) {
			assert.ok(result, "First service registered");
		});
		editor.registerServiceAsPromise("path/to/service/serviceName2").done(function(result) {
			assert.ok(result, "Second service registered");
		});
		editor.registerServiceAsPromise("path/to/service/serviceName2").done(function(result) {
			assert.ok(result, "Second service registered twice");
		});
		assert.deepEqual(editor.getAllServices(), [ "path/to/service/serviceName1", "path/to/service/serviceName2" ], "Services registered");
		assert.equal(editor.getAllServices().length, 2, "Duplicates not registered");
		editor.registerServiceAsPromise("myInvalidService").done(function(result) {
			assert.ok(!result, "Service not registerd");
		});
		assert.equal(this.messageHandler.spyResults.putMessage, "messageObject", "Put message due to invalid service");
		assert.equal(editor.getAllServices().length, 2, "Invalid service not registered");
	});
	QUnit.test("Register invalid service", function(assert) {
		assert.expect(2);
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.registerServiceAsPromise("myInvalidService").done(function(result) {
			assert.ok(!result, "Service not registerd");
		});
		assert.equal(this.messageHandler.spyResults.putMessage, "messageObject", "Put message due to invalid service");
	});
	QUnit.test("Get all entity sets of service except parameter entity sets", function(assert) {
		assert.expect(3);
		var done = assert.async();
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.getAllEntitySetsExceptParameterEntitySets("path/to/service/serviceName1").done(function(entityTypes) {
			assert.deepEqual(entityTypes, [ "entitySet1", "entitySet2" ], "Not registered services returns entitySets of service");
			editor.registerServiceAsPromise("path/to/service/serviceName1").done(function(result) {
				editor.getAllEntitySetsExceptParameterEntitySets("path/to/service/serviceName1").done(function(entityTypes) {
					assert.deepEqual(entityTypes, [ "entitySet1", "entitySet2" ], "All entity sets of service retrieved");
					editor.getAllEntitySetsExceptParameterEntitySets("myInvalidService").done(function(entityTypes) {
						assert.deepEqual(entityTypes, [], "Invalid service returns empty array");
						done();
					});
				});
			});
		});
	});
	QUnit.test("Get all entity sets of service", function(assert) {
		assert.expect(3);
		var done = assert.async();
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.getAllEntitySetsOfServiceAsPromise("path/to/service/serviceName1").done(function(entitySets) {
			assert.deepEqual(entitySets, ["entitySet1", "entitySet2"], "Not registered services returns sets of services");
			editor.registerServiceAsPromise("path/to/service/serviceName1");
			editor.getAllEntitySetsOfServiceAsPromise("path/to/service/serviceName1").done(function(entitySets) {
				assert.deepEqual(entitySets, [ "entitySet1", "entitySet2" ], "All entity sets of service retrieved");
				editor.getAllEntitySetsOfServiceAsPromise("myInvalidService").done(function(entitySets) {
					assert.deepEqual(entitySets, [], "Invalid service returns empty array");
					done();
				});
			});
		});
	});
	QUnit.test("Get all hierarchical entity sets of service", function(assert) {
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.getAllHierarchicalEntitySetsOfServiceAsPromise("path/to/service/serviceName1").done(function(result) {
			assert.deepEqual(result, [ "hierarchicalEntitySet" ], "All entity sets of service retrieved");
		});
		editor.getAllHierarchicalEntitySetsOfServiceAsPromise("myInvalidService").done(function(result) {
			assert.deepEqual(result, [], "Invalid service returns empty array");
		});
	});
	QUnit.test("Check if entity sets is available for service", function(assert) {
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.checkIfHierarchicalEntitySetIsAvailableAsPromise("path/to/service/serviceName1").done(function(result) {
			assert.strictEqual(result, true, "Service has hierarchical entity set");
		});
		editor.checkIfHierarchicalEntitySetIsAvailableAsPromise("myInvalidService").done(function(result) {
			assert.strictEqual(result, false, "Service has no hierarchical entity set");
		});
	});
	QUnit.test("Get all hierarchical propeties of entitySet", function(assert) {
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.getHierarchicalPropertiesOfEntitySetAsPromise("path/to/service/serviceName1", "hierarchicalEntitySet").done(function(result) {
			assert.deepEqual(result, [ "hierarchicalProperty" ], "All hierarchical properties of entitySet returned");
		});
		editor.getHierarchicalPropertiesOfEntitySetAsPromise("myInvalidService").done(function(result) {
			assert.deepEqual(result, [], "Invalid service returns empty array");
		});
	});
	QUnit.test("Get hierarchical node id for hierarchy property of entity set", function(assert) {
		assert.expect(4);
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.getHierarchyNodeIdAsPromise("path/to/service/serviceName1", "hierarchicalEntitySet", "hierarchyProperty").done(function(result) {
			assert.strictEqual(result, "hierarchyNodeID", "HierarchyNodeId returned");
		});
		editor.getHierarchyNodeIdAsPromise("myInvalidService", "hierarchicalEntitySet", "hierarchyProperty").done(function(result) {
			assert.strictEqual(result, null, "No NodeId found");
		});
		editor.getHierarchyNodeIdAsPromise("path/to/service/serviceName1", "normalEntitySet", "hierarchyProperty").done(function(result) {
			assert.strictEqual(result, null, "No NodeId found");
		});
		editor.getHierarchyNodeIdAsPromise("path/to/service/serviceName1", "hierarchicalEntitySet", "normalProperty").done(function(result) {
			assert.strictEqual(result, null, "No NodeId found");
		});
	});
	QUnit.test("Get all entity sets of service with given properties", function(assert) {
		assert.expect(6);
		var done = assert.async();
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise("path/to/service/serviceName1").done(function(allEntitySets) {
			assert.deepEqual(allEntitySets, [ "entitySet1", "entitySet2" ], "All entity sets of service retrieved for not given set of properties");
			editor.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise("path/to/service/serviceName1", []).done(function(allEntitySets) {
				assert.deepEqual(allEntitySets, [ "entitySet1", "entitySet2" ], "All entity sets of service retrieved for empty set of properties");
				editor.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise("myInvalidService").done(function(allEntitySets) {
					assert.deepEqual(allEntitySets, [], "Invalid service returns empty array");
					editor.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise("path/to/service/serviceName1", [ "property1", "property2" ]).done(function(allEntitySets) {
						assert.deepEqual(allEntitySets, [ "entitySet1" ], "Right set of entity sets returned");
						editor.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise("path/to/service/serviceName1", [ "property2" ]).done(function(allEntitySets) {
							assert.deepEqual(allEntitySets, [ "entitySet1", "entitySet2" ], "Right set of entity sets returned");
							editor.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise("path/to/service/serviceName1", [ "property3" ]).done(function(allEntitySets) {
								assert.deepEqual(allEntitySets, [ "entitySet2" ], "Right set of entity sets returned");
								done();
							});
						});
					});
				});
			});
		});
	});
	QUnit.test("Get all properties of entity set", function(assert) {
		assert.expect(4);
		var done = assert.async();
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.getAllPropertiesOfEntitySetAsPromise("path/to/service/serviceName1", "EntitySet").done(function(allEntitySets) {
			assert.deepEqual(allEntitySets, [ "property1", "property2" ], "Not registered services returns array of properties");
			editor.registerServiceAsPromise("path/to/service/serviceName1");
			editor.getAllPropertiesOfEntitySetAsPromise("path/to/service/serviceName1", "EntitySet").done(function(allProperties) {
				assert.deepEqual(allProperties, [ "property1", "property2" ], "All properties of entity set retrieved");
				editor.getAllPropertiesOfEntitySetAsPromise("myInvalidService", "EntitySet").done(function(allProperties) {
					assert.deepEqual(allProperties, [], "Invalid service returns empty array");
					editor.getAllPropertiesOfEntitySetAsPromise("path/to/service/serviceName1", "myInvalidEntitySet").done(function(allProperties) {
						assert.deepEqual(allProperties, [], "Invalid entitySet returns empty array");
						done();
					});
				});
			});
		});
	});
	QUnit.test("Get all known properties of registered services", function(assert) {
		assert.expect(1);
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.registerServiceAsPromise("path/to/service/serviceName1");
		editor.registerServiceAsPromise("path/to/service/serviceName2"); // No effect to test result because getAllProperties doubled. But indicator that duplicates are removed
		editor.getAllKnownPropertiesAsPromise().done(function(allKnownProperties) {
			assert.deepEqual(allKnownProperties, [ "property1", "property2", "property3", "property4" ], "All known properties retrieved");
		});
	});
	QUnit.test("Get all filterable properties and/or parameters of registered services", function(assert) {
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.registerServiceAsPromise("path/to/service/serviceName1");
		editor.getFilterablePropertiesAndParametersAsPromise().done(function(filterablePropertiesAndParameters) {
			assert.deepEqual(filterablePropertiesAndParameters, [ "property1", "property3", "property4", "parameter5" ], "Correct properties retrieved");
		});
	});
	QUnit.test("Get all filterable properties resolved even when no service is available", function(assert) {
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		editor.getFilterablePropertiesAndParametersAsPromise().done(function(filterablePropertiesAndParameters) {
			assert.deepEqual(filterablePropertiesAndParameters, [], "Promise resolved with empty array");
		});
	});
	QUnit.test("WHEN new ConfigurationEditor on tmp Id THEN isSaved===false", function(assert) {
		var editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		assert.equal(editor.isSaved(), false, "isSaved on tmp Id");
	});
	QUnit.test("WHEN new ConfigurationEditor with argument of type object and new configuration ID THEN save calls create on ODataProxy", function(assert) {
		this.inject.instances.persistenceProxy.update = function(assert) {
		};
		this.inject.instances.persistenceProxy.create = function(type, config, callback) {
			testCallback(type, config, callback);
		};
		var editor = new sap.apf.modeler.core.ConfigurationEditor({
			id : "GUID",
			creationDate : '01.04.1970',
			lastChangeDate : '02.04.1970',
			content : {
				steps : [],
				requests : [],
				bindings : [],
				representationTypes : [],
				categories : [],
				navigationTargets : [],
				smartFilterBar : {
					id : 'SmartFilterBar-1',
					type : 'smartFilterBar'
				}
			}
		}, this.inject);
		editor.save(testCallback);
		function testCallback(type, config, callbackCreate) {
			var expectedConfig = {
					AnalyticalConfiguration : "GUID",
					AnalyticalConfigurationName : 'ConfigurationName',
					Application : 'ApplicationId',
					SerializedAnalyticalConfiguration : "{\"analyticalConfigurationName\":\"ConfigurationName\",\"applicationTitle\":{\"type\":\"label\",\"kind\":\"text\",\"key\":\"persistentTextKey-1\"},\"steps\":[],\"requests\":[],\"bindings\":[],\"representationTypes\":[],\"categories\":[],\"navigationTargets\":[],\"smartFilterBar\":{\"id\":\"SmartFilterBar-1\",\"type\":\"smartFilterBar\"}}",
					CreatedByUser : "",
					CreationUTCDateTime : "01.04.1970",
					LastChangeUTCDateTime : "02.04.1970",
					LastChangedByUser : ""
			};
			assert.equal(type, "configuration", 'Correct type');
			assert.deepEqual(config, expectedConfig, 'ID, creation and change date set externally');
		}
	});
	QUnit.test("WHEN new ConfigurationEditor with argument of type object and configuration ID exist THEN save calls update on ODataProxy", function(assert) {
		this.inject.instances.persistenceProxy.create = function() {
		};
		this.inject.instances.persistenceProxy.update = function(type, config, callback, parameters) {
			testCallback(type, config, callback, parameters);
		};
		var editor = new sap.apf.modeler.core.ConfigurationEditor({
			id : "GUID",
			creationDate : '01.04.1970',
			lastChangeDate : '02.04.1970',
			updateExisting : true,
			content : {
				steps : [],
				requests : [],
				bindings : [],
				representationTypes : [],
				categories : [],
				navigationTargets : [],
				smartFilterBar : {
					id : 'SmartFilterBar-1',
					type : 'smartFilterBar'
				}
			}
		}, this.inject);
		editor.save(testCallback);
		function testCallback(type, config, callbackCreate, parameters) {
			var expectedConfig = {
					AnalyticalConfiguration : "GUID",
					AnalyticalConfigurationName : 'ConfigurationName',
					Application : 'ApplicationId',
					SerializedAnalyticalConfiguration : "{\"analyticalConfigurationName\":\"ConfigurationName\",\"applicationTitle\":{\"type\":\"label\",\"kind\":\"text\",\"key\":\"persistentTextKey-1\"},\"steps\":[],\"requests\":[],\"bindings\":[],\"representationTypes\":[],\"categories\":[],\"navigationTargets\":[],\"smartFilterBar\":{\"id\":\"SmartFilterBar-1\",\"type\":\"smartFilterBar\"}}",
					CreatedByUser : "",
					CreationUTCDateTime : "01.04.1970",
					LastChangeUTCDateTime : "02.04.1970",
					LastChangedByUser : ""
			};
			assert.equal(type, "configuration", 'Correct type');
			assert.deepEqual(config, expectedConfig, 'ID, creation and change date set externally');
			assert.deepEqual(parameters, [ {
				name : "AnalyticalConfiguration",
				value : 'GUID'
			} ], "Parameter for update set correctly");
		}
	});
	QUnit.test("WHEN new ConfigurationEditor with argument of type object and temp configuration ID THEN  save calls create on ODataProxy", function(assert) {
		this.inject.instances.persistenceProxy.update = function() {
		};
		this.inject.instances.persistenceProxy.create = function(type, config, callback) {
			testCallback(type, config, callback);
		};
		var editor = new sap.apf.modeler.core.ConfigurationEditor({
			id : "apf1972-tempId",
			content : {
				steps : [],
				requests : [],
				bindings : [],
				representationTypes : [],
				categories : [],
				navigationTargets : [],
				smartFilterBar : {
					id : 'SmartFilterBar-1',
					type : 'smartFilterBar'
				}
			}
		}, this.inject);
		editor.save(testCallback);
		function testCallback(type, config, callbackCreate) {
			var expectedConfig = {
					AnalyticalConfiguration : "",
					AnalyticalConfigurationName : 'ConfigurationName',
					Application : 'ApplicationId',
					SerializedAnalyticalConfiguration : "{\"analyticalConfigurationName\":\"ConfigurationName\",\"applicationTitle\":{\"type\":\"label\",\"kind\":\"text\",\"key\":\"persistentTextKey-1\"},\"steps\":[],\"requests\":[],\"bindings\":[],\"representationTypes\":[],\"categories\":[],\"navigationTargets\":[],\"smartFilterBar\":{\"id\":\"SmartFilterBar-1\",\"type\":\"smartFilterBar\"}}",
					CreatedByUser : "",
					CreationUTCDateTime : null,
					LastChangeUTCDateTime : null,
					LastChangedByUser : ""
			};
			assert.equal(type, "configuration", 'Correct type');
			assert.deepEqual(config, expectedConfig, 'OdataProxy create called with correct configuration object');
		}
	});
	QUnit.test("WHEN new ConfigurationEditor with argument of type object THEN content is mapped to design time", function(assert) {
		this.inject.constructors.RegistryProbe = sap.apf.modeler.core.RegistryWrapper;
		var editor = new sap.apf.modeler.core.ConfigurationEditor({
			id : "GUID",
			creationDate : '01.04.1970',
			lastChangeDate : '02.04.1970',
			content : {
				applicationTitle : {
					"type" : "label",
					"kind" : "text",
					"key" : "applicationTitleTestKey"
				},
				steps : [],
				requests : [],
				bindings : [],
				representationTypes : [],
				categories : [ {
					"type" : "category",
					"id" : "ImportTest",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "ImportTestKey"
					}
				} ],
				facetFilters : [],
				navigationTargets : []
			}
		}, this.inject);
		assert.equal(editor.getCategories()[0].getId(), 'ImportTest', 'Category loaded and mapped to design time');
	});
	QUnit.test("WHEN new ConfigurationEditor GUID Id THEN isSaved===true", function(assert) {
		var editor = new sap.apf.modeler.core.ConfigurationEditor("GUID", this.inject);
		assert.equal(editor.isSaved(), true, "isSaved on GUID");
	});
	QUnit.test("WHEN new ConfigurationEditor GUID Id AND setIsUnsaved THEN isSaved===false", function(assert) {
		var editor = new sap.apf.modeler.core.ConfigurationEditor("GUID", this.inject);
		editor.setIsUnsaved();
		assert.equal(editor.isSaved(), false, "setIsUnsaved");
	});
	QUnit.test("WHEN setCategory called twice THEN returned Ids differ", function(assert) {
		var id1 = this.configurationEditor.setCategory(this.category1);
		var id2 = this.configurationEditor.setCategory(this.category1);
		assert.notEqual(id1, id2, "Different Ids returned");
	});
	QUnit.test("Set and get application title text key", function(assert) {
		var applicationNameTextKey = "textKey";
		this.configurationEditor.setApplicationTitle(applicationNameTextKey);
		assert.equal(this.configurationEditor.getApplicationTitle(), applicationNameTextKey, "Set and get application title are equal");
	});
	QUnit.test("Set and get category", function(assert) {
		var id = this.configurationEditor.setCategory(this.category1);
		assert.equal(this.configurationEditor.getCategory(id).labelKey, this.category1.labelKey, "Get after set delivers the same value");
		assert.equal(this.configurationEditor.getCategory("NotExistingID"), undefined, "Returns 'undefined' for a not existing ID");
	});
	QUnit.test("Set category without optional name, afterwards set name", function(assert) {
		var category = {
			labelKey : "localTextReference1"
		};
		var id = this.configurationEditor.setCategory();
		assert.ok(this.configurationEditor.getCategory(id), "Category created without name and received");
		assert.equal(this.configurationEditor.getCategory(id).labelKey, undefined, "Category has no label key");
		this.configurationEditor.setCategory(category, id);
		assert.equal(this.configurationEditor.getCategory(id).labelKey, "localTextReference1", "Category has label key");
	});
	QUnit.test("WHEN Set and get category THEN correct id is contained in category object", function(assert) {
		var id = this.configurationEditor.setCategory(this.category1);
		assert.equal(this.configurationEditor.getCategory(id).getId(), id, "id in object is ===");
	});
	QUnit.test("Update for unknown ID results in error", function(assert) {
		this.configurationEditor.setCategory(this.category1, "UnknownID");
		assert.equal(this.messageHandler.spyResults.putMessage.code, 11006, "The identifier was detected as unknown");
	});
	QUnit.test("Set and update category", function(assert) {
		var id = this.configurationEditor.setCategory(this.category1);
		assert.equal(this.configurationEditor.getCategory(id).labelKey, this.category1.labelKey, "Get after set delivers the same value");
		this.configurationEditor.setCategory(this.category2, id);
		assert.equal(this.configurationEditor.getCategory(id).labelKey, this.category2.labelKey, "Get after update delivers the updated value");
	});
	QUnit.test("Move categories before and toEnd and up and down", function(assert) {
		var id1 = this.configurationEditor.setCategory(this.category1);
		var id2 = this.configurationEditor.setCategory(this.category2);
		var id3 = this.configurationEditor.setCategory(this.category3);
		var categories = this.configurationEditor.getCategories();
		assert.equal(categories[0].getId(), id1, "First category expected");
		assert.equal(categories[1].getId(), id2, "Second category expected");
		assert.equal(categories[2].getId(), id3, "Third category expected");
		this.configurationEditor.moveCategoryBefore(id1, id3);
		categories = this.configurationEditor.getCategories();
		assert.equal(categories[0].getId(), id3, "Third category expected");
		assert.equal(categories[1].getId(), id1, "First category expected");
		assert.equal(categories[2].getId(), id2, "Second category expected");
		this.configurationEditor.moveCategoryToEnd(id3);
		categories = this.configurationEditor.getCategories();
		assert.equal(categories[0].getId(), id1, "First category expected");
		assert.equal(categories[1].getId(), id2, "Second category expected");
		assert.equal(categories[2].getId(), id3, "Third category expected");
		this.configurationEditor.moveCategoryUpOrDown(id3, -1);
		categories = this.configurationEditor.getCategories();
		assert.equal(categories[0].getId(), id1, "First category expected");
		assert.equal(categories[1].getId(), id3, "Third category expected");
		assert.equal(categories[2].getId(), id2, "Second category expected");
	});
	QUnit.test("Copy category", function(assert) {
		var categoryId = this.configurationEditor.setCategory(this.category1);
		var list = this.configurationEditor.getCategories();
		assert.equal(list.length, 1, "non-empty");
		var newId = this.configurationEditor.copyCategory(categoryId);
		list = this.configurationEditor.getCategories();
		assert.equal(list.length, 2, "entry added by copy");
		var newCategory = this.configurationEditor.getCategory(newId);
		assert.ok(newCategory, "entry can be retrieved by new Id");
		delete newCategory.getId;
		assert.deepEqual(newCategory, this.category1, "new category has the right value");
	});
	QUnit.test("Move facet filters before and to end and up and down", function(assert) {
		this.configurationEditor.setFilterOption({facetFilter : true});
		var id1 = this.configurationEditor.createFacetFilter();
		var id2 = this.configurationEditor.createFacetFilter();
		var id3 = this.configurationEditor.createFacetFilter();
		var facetFilters = this.configurationEditor.getFacetFilters();
		assert.equal(facetFilters[0].getId(), id1, "First facetFilter expected");
		assert.equal(facetFilters[1].getId(), id2, "Second facetFilter expected");
		assert.equal(facetFilters[2].getId(), id3, "Third facetFilter expected");
		this.configurationEditor.moveFacetFilterBefore(id1, id3);
		facetFilters = this.configurationEditor.getFacetFilters();
		assert.equal(facetFilters[0].getId(), id3, "Third facetFilter expected");
		assert.equal(facetFilters[1].getId(), id1, "First facetFilter expected");
		assert.equal(facetFilters[2].getId(), id2, "Second facetFilter expected");
		this.configurationEditor.moveFacetFilterToEnd(id3);
		facetFilters = this.configurationEditor.getFacetFilters();
		assert.equal(facetFilters[0].getId(), id1, "First facetFilter expected");
		assert.equal(facetFilters[1].getId(), id2, "Second facetFilter expected");
		assert.equal(facetFilters[2].getId(), id3, "Third facetFilter expected");
		this.configurationEditor.moveFacetFilterUpOrDown(id3, -1);
		facetFilters = this.configurationEditor.getFacetFilters();
		assert.equal(facetFilters[0].getId(), id1, "First facetFilter expected");
		assert.equal(facetFilters[1].getId(), id3, "Third facetFilter expected");
		assert.equal(facetFilters[2].getId(), id2, "Second facetFilter expected");
	});
	QUnit.test("Move navigation targets before and to end and up and down", function(assert) {
		var id1 = this.configurationEditor.createNavigationTarget();
		var id2 = this.configurationEditor.createNavigationTarget();
		var id3 = this.configurationEditor.createNavigationTarget();
		var navigationTargets = this.configurationEditor.getNavigationTargets();
		assert.equal(navigationTargets[0].getId(), id1, "First navigationTarget expected");
		assert.equal(navigationTargets[1].getId(), id2, "Second navigationTarget expected");
		assert.equal(navigationTargets[2].getId(), id3, "Third navigationTarget expected");
		this.configurationEditor.moveNavigationTargetBefore(id1, id3);
		navigationTargets = this.configurationEditor.getNavigationTargets();
		assert.equal(navigationTargets[0].getId(), id3, "Third navigationTarget expected");
		assert.equal(navigationTargets[1].getId(), id1, "First navigationTarget expected");
		assert.equal(navigationTargets[2].getId(), id2, "Second navigationTarget expected");
		this.configurationEditor.moveNavigationTargetToEnd(id3);
		navigationTargets = this.configurationEditor.getNavigationTargets();
		assert.equal(navigationTargets[0].getId(), id1, "First navigationTarget expected");
		assert.equal(navigationTargets[1].getId(), id2, "Second navigationTarget expected");
		assert.equal(navigationTargets[2].getId(), id3, "Third navigationTarget expected");
		this.configurationEditor.moveNavigationTargetUpOrDown(id3, -1);
		navigationTargets = this.configurationEditor.getNavigationTargets();
		assert.equal(navigationTargets[0].getId(), id1, "First navigationTarget expected");
		assert.equal(navigationTargets[1].getId(), id3, "Third navigationTarget expected");
		assert.equal(navigationTargets[2].getId(), id2, "Second navigationTarget expected");
	});
	QUnit.test("Move category step assignments up and down", function(assert) {
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		var stepId2 = this.configurationEditor.createStep(categoryId1);
		var stepId3 = this.configurationEditor.createStep(categoryId1);
		var categoryId2 = this.configurationEditor.setCategory(this.category2);
		this.configurationEditor.addCategoryStepAssignment(categoryId2, stepId1);
		this.configurationEditor.addCategoryStepAssignment(categoryId2, stepId3);
		var stepId4 = this.configurationEditor.createStep(categoryId2);
		var stepsCat1 = this.configurationEditor.getCategoryStepAssignments(categoryId1);
		assert.equal(stepsCat1[0], stepId1, "First category: First step expected");
		assert.equal(stepsCat1[1], stepId2, "First category: Second step expected");
		assert.equal(stepsCat1[2], stepId3, "First category: Third step expected");
		var stepsCat2 = this.configurationEditor.getCategoryStepAssignments(categoryId2);
		assert.equal(stepsCat2[0], stepId1, "Second category: First step expected");
		assert.equal(stepsCat2[1], stepId3, "Second category: Third step expected");
		assert.equal(stepsCat2[2], stepId4, "Second category: Fourth step expected");
		this.configurationEditor.moveCategoryStepAssignmentBefore(categoryId1, stepId1, stepId3);
		stepsCat1 = this.configurationEditor.getCategoryStepAssignments(categoryId1);
		assert.equal(stepsCat1[0], stepId3, "First category: Third step expected");
		assert.equal(stepsCat1[1], stepId1, "First category: First step expected");
		assert.equal(stepsCat1[2], stepId2, "First category: Second step expected");
		stepsCat2 = this.configurationEditor.getCategoryStepAssignments(categoryId2);
		assert.equal(stepsCat2[0], stepId1, "Second category: First step expected");
		assert.equal(stepsCat2[1], stepId3, "Second category: Third step expected");
		assert.equal(stepsCat2[2], stepId4, "Second category: Fourth step expected");
		this.configurationEditor.moveCategoryStepAssignmentToEnd(categoryId2, stepId1);
		stepsCat1 = this.configurationEditor.getCategoryStepAssignments(categoryId1);
		assert.equal(stepsCat1[0], stepId3, "First category: Third step expected");
		assert.equal(stepsCat1[1], stepId1, "First category: First step expected");
		assert.equal(stepsCat1[2], stepId2, "First category: Second step expected");
		stepsCat2 = this.configurationEditor.getCategoryStepAssignments(categoryId2);
		assert.equal(stepsCat2[0], stepId3, "Second category: Third step expected");
		assert.equal(stepsCat2[1], stepId4, "Second category: Fourth step expected");
		assert.equal(stepsCat2[2], stepId1, "Second category: First step expected");
		this.configurationEditor.moveCategoryStepAssignmentUpOrDown(categoryId1, stepId3, 2);
		this.configurationEditor.moveCategoryStepAssignmentUpOrDown(categoryId2, stepId1, -2);
		stepsCat1 = this.configurationEditor.getCategoryStepAssignments(categoryId1);
		assert.equal(stepsCat1[0], stepId1, "First category: First step expected");
		assert.equal(stepsCat1[1], stepId2, "First category: Second step expected");
		assert.equal(stepsCat1[2], stepId3, "First category: Third step expected");
		stepsCat2 = this.configurationEditor.getCategoryStepAssignments(categoryId2);
		assert.equal(stepsCat2[0], stepId1, "Second category: First step expected");
		assert.equal(stepsCat2[1], stepId3, "Second category: Third step expected");
		assert.equal(stepsCat2[2], stepId4, "Second category: Fourth step expected");
	});
	QUnit.test("Copy category with assigned steps", function(assert) {
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var categoryId2 = this.configurationEditor.setCategory(this.category2);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		this.configurationEditor.addCategoryStepAssignment(categoryId2, stepId1);
		var stepId2 = this.configurationEditor.createStep(categoryId2);
		var steps = this.configurationEditor.getSteps();
		assert.equal(steps.length, 2, "expected number of steps before copy");
		assert.deepEqual(this.configurationEditor.getCategoryStepAssignments(categoryId1), [ stepId1 ], "Category 1 is assigned to step 1");
		assert.deepEqual(this.configurationEditor.getCategoryStepAssignments(categoryId2), [ stepId1, stepId2 ], "Category 2 is assigned to step 1 and 2");
		var newCategoryId = this.configurationEditor.copyCategory(categoryId1);
		steps = this.configurationEditor.getSteps();
		var lastStep = steps[steps.length - 1], lastStepId = lastStep.getId();
		assert.equal(steps.length, 3, "WHEN copyCategory 1 THEN One step added by copy of category 1 with assigned step");
		assert.ok(lastStepId !== stepId1 && lastStepId !== stepId2, "WHEN copyCategory 1 THEN last step is the new step from the copy operation");
		assert.equal(this.configurationEditor.getCategoryStepAssignments(categoryId1).length, 1, "WHEN coypCategory 1 THEN category 1 has the right number of steps assigned");
		assert.equal(this.configurationEditor.getCategoryStepAssignments(categoryId2).length, 2, "WHEN coypCategory 1 THEN category 2 has the right number of steps assigned");
		assert.equal(this.configurationEditor.getCategoryStepAssignments(newCategoryId).length, 1, "WHEN coypCategory 1 THEN new category has the right number of steps assigned");
		assert.ok(this.configurationEditor.getCategoryStepAssignments(categoryId1).indexOf(lastStepId) === -1, "WHEN coypCategory 1 THEN the new step is only assigned to the new category");
		assert.ok(this.configurationEditor.getCategoryStepAssignments(categoryId2).indexOf(lastStepId) === -1, "WHEN coypCategory 1 THEN the new step is only assigned to the new category");
		assert.ok(this.configurationEditor.getCategoryStepAssignments(newCategoryId).indexOf(lastStepId) > -1, "WHEN coypCategory 1 THEN the new step is only assigned to the new category");
	});
	QUnit.test("Is saved", function(assert) {
		assert.ok(!this.configurationEditor.isSaved(), "A new configuration that does not exist on the DB is unsaved");
	});
	QUnit.test("Serialize with two categories", function(assert) {
		var expectedSerializableConfiguration = {
			analyticalConfigurationName : "ConfigurationName",
			applicationTitle : {
				"key" : "persistentTextKey-1",
				"kind" : "text",
				"type" : "label"
			},
			steps : [],
			requests : [],
			bindings : [],
			representationTypes : [],
			categories : [ {
				type : "category",
				id : "Category-1",
				description : "localTextReference1Description",
				label : {
					type : "label",
					kind : "text",
					key : "persistentTextKey-2"
				},
				steps : []
			}, {
				type : "category",
				description : "localTextReference2Description",
				id : "Category-2",
				label : {
					type : "label",
					kind : "text",
					key : "persistentTextKey-3"
				},
				steps : []
			} ],
			navigationTargets : [],
			smartFilterBar : {
				entitySet : undefined,
				id : "SmartFilterBar-1",
				service : undefined,
				type : "smartFilterBar"
			}
		};
		this.configurationEditor.setCategory(this.category1);
		this.configurationEditor.setCategory(this.category2);
		assert.deepEqual(this.configurationEditor.serialize(), expectedSerializableConfiguration, "Delivers the expected result");
	});
	QUnit.test("Save empty configuration", function(assert) {
		assert.expect(6);
		var that = this;
		this.odataProxy.assertData = function(type, data, callback) {
			var expectedData = {
				AnalyticalConfiguration : "",
				AnalyticalConfigurationName : "ConfigurationName",
				Application : "ApplicationId",
				CreatedByUser : "",
				CreationUTCDateTime : null,
				LastChangeUTCDateTime : null,
				LastChangedByUser : "",
				SerializedAnalyticalConfiguration : JSON.stringify({
					analyticalConfigurationName : "ConfigurationName",
					applicationTitle : {
						type : 'label',
						kind : 'text',
						key : 'persistentTextKey-1'
					},
					steps : [],
					requests : [],
					bindings : [],
					representationTypes : [],
					categories : [],
					navigationTargets : [],
					smartFilterBar : {
						entityType : undefined,
						id : "SmartFilterBar-1",
						service : undefined,
						type : "smartFilterBar"
					}
				})
			};
			assert.equal(type, "configuration", "First parameter when calling odataProxy.create() is 'type'");
			assert.deepEqual(data, expectedData, "Second parameter when calling odataProxy.create() is expected data object");
			assert.equal(typeof callback, "function", "Third parameter when calling odataProxy.create() is a 'callback function'");
		};
		function callback(response, metadata, messageObject) {
			assert.equal(response, "idGeneratedByServer-1", "Id for saved configuration returned");
			assert.ok(that.configurationEditor.isSaved(), "isSaved() returns true after saving");
		}
		assert.ok(!this.configurationEditor.isSaved(), "isSaved() returns false before saving");
		this.configurationEditor.save(callback);
	});
	QUnit.test("Save configuration with one category", function(assert) {
		assert.expect(4);
		var that = this;
		this.odataProxy.assertData = function(type, data, callback) {
			var expectedData = {
				AnalyticalConfiguration : "",
				AnalyticalConfigurationName : "ConfigurationName",
				Application : "ApplicationId",
				CreatedByUser : "",
				CreationUTCDateTime : null,
				LastChangeUTCDateTime : null,
				LastChangedByUser : "",
				SerializedAnalyticalConfiguration : JSON.stringify({
					analyticalConfigurationName : "ConfigurationName",
					applicationTitle : {
						type : 'label',
						kind : 'text',
						key : 'persistentTextKey-1'
					},
					steps : [],
					requests : [],
					bindings : [],
					representationTypes : [],
					categories : [ {
						type : "category",
						description : "localTextReference1Description",
						id : "Category-1",
						label : {
							type : "label",
							kind : "text",
							key : "persistentTextKey-2"
						},
						steps : []
					} ],
					navigationTargets : [],
					smartFilterBar : {
						entityType : undefined,
						id : "SmartFilterBar-1",
						service : undefined,
						type : "smartFilterBar"
					}
				})
			};
			assert.deepEqual(data, expectedData, "Correct data supplied to OdataProxy");
		};
		function callbackSave(response, metadata, messageObject) {
			assert.equal(response, "idGeneratedByServer-1", "Id for saved configuration returned");
			assert.ok(that.configurationEditor.isSaved(), "isSaved() returns true after saving");
		}
		this.configurationEditor.setCategory(this.category1);
		assert.ok(!this.configurationEditor.isSaved(), "isSaved() returns false before saving");
		this.configurationEditor.save(callbackSave);
	});
	QUnit.test("Save and update configuration with one category", function(assert) {
		assert.expect(8);
		var that = this;
		//overwrite method replaceConfigurationId on configuration handler to check if this method is called correctly
		this.configurationHandler.replaceConfigurationId = function(tempId, serverGeneratedId) {
			assert.equal(tempId, "apf1972-tempId", "First parameter when calling configurationHandler.replaceConfigurationId() is temporary id");
			assert.equal(serverGeneratedId, "idGeneratedByServer-1", "Second parameter when calling configurationHandler.replaceConfigurationId() is server generated id");
		};
		function callbackFirstSave(response, metadata, messageObject) {
			that.odataProxy.assertData = function(type, data, callback, inputParameters) {
				assert.equal(type, "configuration", "First parameter when calling odataProxy.update() is 'type'");
				assert.equal(data.AnalyticalConfiguration, "idGeneratedByServer-1", "Second parameter when calling odataProxy.update() is the id, which is successfully replaced with server generated id");
				assert.equal(typeof callback, "function", "Third parameter when calling odataProxy.update() is a 'callback function'");
				assert.deepEqual(inputParameters, [ {
					name : "AnalyticalConfiguration",
					value : "idGeneratedByServer-1"
				} ], "Fourth parameter when calling odataProxy.update() is an array of input parameters'");
			};
			function callbackSecondSave(response, metadata, messageObject) {
				assert.equal(response, "idGeneratedByServer-1", "Same id returned when saving a configuration twice");
				assert.ok(that.configurationEditor.isSaved(), "isSaved() returns true after second save");
			}
			that.configurationEditor.save(callbackSecondSave);
		}
		this.configurationEditor.setCategory(this.category1);
		this.configurationEditor.save(callbackFirstSave);
	});
	QUnit.test("WHEN 2 categories set THEN getCategories() returns them", function(assert) {
		var id1 = this.configurationEditor.setCategory(this.category1);
		var id2 = this.configurationEditor.setCategory(this.category2);
		var list = this.configurationEditor.getCategories();
		assert.equal(list.length, 2, "2 categories");
		assert.ok(list[0].getId() === id1 || list[0].getId() === id2, "must be contained, but no order assumption");
		assert.ok(list[1].getId() === id1 || list[1].getId() === id2, "must be contained, but no order assumption");
		assert.notEqual(list[0].getId(), list[1].getId(), "two different members");
	});
	QUnit.test("GIVEN 2 categories with one step WHEN removeCategory THEN category and its steps are deleted", function(assert) {
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var categoryId2 = this.configurationEditor.setCategory(this.category2);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		this.configurationEditor.createStep(categoryId2);
		this.configurationEditor.removeCategory(categoryId1);
		assert.equal(this.configurationEditor.getCategories().length, 1, "getCategories() returns only one category after remove operation");
		assert.equal(this.configurationEditor.getCategory(categoryId1), undefined, "First category removed");
		assert.equal(this.configurationEditor.getSteps().length, 1, "getSteps returns only one step");
		assert.equal(this.configurationEditor.getStep(stepId1), undefined, "Assigned step removed when corresponding category is deleted");
		this.configurationEditor.removeCategory(categoryId2);
		assert.equal(this.configurationEditor.getCategories().length, 0, "Second category successfully removed");
		assert.equal(this.configurationEditor.getSteps().length, 0, "All created steps removed");
	});
	QUnit.test("Remove category only deletes steps which are assigned to ONE category", function(assert) {
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var categoryId2 = this.configurationEditor.setCategory(this.category2);
		var stepId = this.configurationEditor.createStep(categoryId1);
		this.configurationEditor.addCategoryStepAssignment(categoryId2, stepId);
		this.configurationEditor.removeCategory(categoryId1);
		assert.ok(this.configurationEditor.getStep(stepId) !== undefined, "Step still exists");
		this.configurationEditor.removeCategory(categoryId2);
		assert.ok(this.configurationEditor.getStep(stepId) === undefined, "Step deleted");
	});
	QUnit.test("Get all steps not assigned to this category", function(assert) {
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		var stepId2 = this.configurationEditor.createStep(categoryId1);
		var stepId3 = this.configurationEditor.createStep(categoryId1);
		var categoryId2 = this.configurationEditor.setCategory(this.category2);
		this.configurationEditor.addCategoryStepAssignment(categoryId2, stepId2);
		this.configurationEditor.addCategoryStepAssignment(categoryId2, stepId3);
		var categoryId3 = this.configurationEditor.setCategory(this.category3);
		assert.deepEqual(this.configurationEditor.getStepsNotAssignedToCategory(categoryId1), [], "Category 1 has no unassigned steps");
		assert.deepEqual(this.configurationEditor.getStepsNotAssignedToCategory(categoryId2), [ stepId1 ], "Category 2 has one unassigned step");
		assert.deepEqual(this.configurationEditor.getStepsNotAssignedToCategory(categoryId3), [ stepId1, stepId2, stepId3 ], "Category 3 has three unassigned steps");
	});
	QUnit.test("WHEN creating a configurationEditor with temporary key convention THEN isSaved === false", function(assert) {
		var configEditor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.inject);
		assert.equal(configEditor.isSaved(), false);
	});
	QUnit.test("WHEN creating a configurationEditor with a guid id THEN isSaved === true", function(assert) {
		var configEditor = new sap.apf.modeler.core.ConfigurationEditor("guid", this.inject);
		assert.equal(configEditor.isSaved(), true);
	});
	QUnit.test('New config editor has default filter option SmartFilterBar', function(assert) {
		assert.deepEqual(this.configurationEditor.getFilterOption(), {smartFilterBar : true} , 'Default filter option for new config editor is SmartFilterBar');
	});
	QUnit.test('Change filter option from SmartFilterBar to FacetFilter', function(assert) {
		this.configurationEditor.getSmartFilterBar().setService("anyService");
		this.configurationEditor.setFilterOption({facetFilter : true});
		assert.deepEqual(this.configurationEditor.getFilterOption(), {facetFilter : true} , 'New filter option set');
		assert.strictEqual(this.configurationEditor.getSmartFilterBar(), null, 'No instance for SmartFilterBar returned if other filter option is set');
		
		this.configurationEditor.setFilterOption({smartFilterBar : true});
		assert.strictEqual(this.configurationEditor.getSmartFilterBar().getService(), undefined, 'New empty instance after switch');
	});
	QUnit.test('Change filter option from SmartFilterBar to none', function(assert) {
		this.configurationEditor.setFilterOption({none : true});
		assert.deepEqual(this.configurationEditor.getFilterOption(), {none: true} , 'New filter option set');
		assert.strictEqual(this.configurationEditor.getSmartFilterBar(), null, 'No instance for SmartFilterBar returned if other filter option is set');
	});
	QUnit.test('Change filter option from FacetFilter to SmartFilterBar', function(assert) {
		this.configurationEditor.setFilterOption({facetFilter : true});
		this.configurationEditor.createFacetFilter();
		this.configurationEditor.setFilterOption({smartFilterBar : true});
		assert.deepEqual(this.configurationEditor.getFilterOption(), {smartFilterBar : true} , 'New filter option set');
		assert.strictEqual(this.configurationEditor.getFacetFilters().length, 0, 'Existing facet filter removed');
	});
	QUnit.test('Change filter option from FacetFilter to none', function(assert) {
		this.configurationEditor.setFilterOption({facetFilter : true});
		this.configurationEditor.createFacetFilter();
		this.configurationEditor.setFilterOption({none : true});
		assert.deepEqual(this.configurationEditor.getFilterOption(), {none : true} , 'New filter option set');
		assert.strictEqual(this.configurationEditor.getFacetFilters().length, 0, 'Existing facet filter removed');
	});
	QUnit.test('Change filter option from none to FacetFilter', function(assert) {
		this.configurationEditor.setFilterOption({none : true});
		this.configurationEditor.setFilterOption({facetFilter : true});
		assert.deepEqual(this.configurationEditor.getFilterOption(), {facetFilter : true} , 'New filter option set');
	});
	QUnit.test('Change filter option from none to SmartFilterBar', function(assert) {
		this.configurationEditor.setFilterOption({none : true});
		this.configurationEditor.setFilterOption({smartFilterBar : true});
		assert.deepEqual(this.configurationEditor.getFilterOption(), {smartFilterBar : true} , 'New filter option set');
		});
	QUnit.test('Internal filter option state cannot be manipulated', function(assert) {
		var firstFlush = this.configurationEditor.getFilterOption();
		var secondFlush = this.configurationEditor.getFilterOption();
		assert.deepEqual(firstFlush, secondFlush, 'Without change same state information is returned');
		assert.notEqual(firstFlush, secondFlush, 'Each get returns new instance representing internal state');
	});
	QUnit.test("Create and remove smartFilterBar", function(assert) {
		var smartFilterBarCreate = this.configurationEditor.getSmartFilterBar();
		assert.equal(smartFilterBarCreate.getId(), "SmartFilterBar-1", "For the moment there is only one SFB possible");
		var smartFilterBarGet = this.configurationEditor.getSmartFilterBar();
		assert.equal(smartFilterBarCreate, smartFilterBarGet, "Same instance returned with get and create");
		this.configurationEditor.setFilterOption({none : true});
		assert.equal(this.configurationEditor.getSmartFilterBar(), null, "SmartFilterBar removed");
	});
	QUnit.test("Create facet filter whithout proper filter option", function(assert) {
		var facetFilterId = this.configurationEditor.createFacetFilter();
		assert.strictEqual(facetFilterId, null, "Facet filter cannot be created with default filter option 'smartFilterBar'");
	});
	QUnit.test("Create facet filter with ID whithout proper filter option", function(assert) {
		var facetFilterId = this.configurationEditor.createFacetFilterWithId('dummyId');
		assert.strictEqual(facetFilterId, null, "Facet filter cannot be created with default filter option 'smartFilterBar'");
	});
	QUnit.test("Create and remove facet filter", function(assert) {
		this.configurationEditor.setFilterOption({facetFilter : true});
		var facetFilterId = this.configurationEditor.createFacetFilter();
		var list = this.configurationEditor.getFacetFilters();
		assert.equal(list.length, 1, "Facet filter created");
		assert.equal(list[0].getId(), facetFilterId, 'Correct facet filter id returned');
		assert.equal(list[0].getId().indexOf('FacetFilter'), 0, 'Correct id format');
		this.configurationEditor.removeFacetFilter(facetFilterId);
		assert.equal(this.configurationEditor.getFacetFilters().length, 0, "Facet filter removed");
	});
	QUnit.test("Create and copy facet filter", function(assert) {
		this.configurationEditor.setFilterOption({facetFilter : true});
		var facetFilterId = this.configurationEditor.createFacetFilter();
		var list = this.configurationEditor.getFacetFilters();
		assert.equal(list.length, 1, "non-empty");
		var newId = this.configurationEditor.copyFacetFilter(facetFilterId);
		list = this.configurationEditor.getFacetFilters();
		assert.equal(list.length, 2, "entry added by copy");
		assert.ok(this.configurationEditor.getFacetFilter(newId), "entry can be retrieved by new Id");
	});
	QUnit.test("Create and remove navigation target", function(assert) {
		var navigationTargetId = this.configurationEditor.createNavigationTarget(); //CUT
		var list = this.configurationEditor.getNavigationTargets(); //CUT
		assert.equal(list.length, 1, "Navigation target created");
		assert.equal(list[0].getId(), navigationTargetId, 'Correct navigation target id returned');
		assert.equal(list[0].getId().indexOf('NavigationTarget'), 0, 'Correct id format');
		this.configurationEditor.removeNavigationTarget(navigationTargetId); //CUT
		assert.equal(this.configurationEditor.getNavigationTargets().length, 0, "Navigation target removed");
	});
	QUnit.test("Create and copy navigation target", function(assert) {
		var navigationTargetId = this.configurationEditor.createNavigationTarget();
		var list = this.configurationEditor.getNavigationTargets();
		assert.equal(list.length, 1, "non-empty");
		var newId = this.configurationEditor.copyNavigationTarget(navigationTargetId);
		list = this.configurationEditor.getNavigationTargets();
		assert.equal(list.length, 2, "entry added by copy");
		assert.ok(this.configurationEditor.getNavigationTarget(newId), "entry can be retrieved by new Id");
	});
	QUnit.test("Define global or step specific navigation targets", function(assert) {
		var navigationTarget = this.configurationEditor.getNavigationTarget(this.configurationEditor.createNavigationTarget());
		assert.equal(navigationTarget.isGlobal(), true, "Default is global navigation target");
		assert.equal(navigationTarget.isStepSpecific(), false, "Default is a not step specific navigation target");
		navigationTarget.setStepSpecific();
		assert.equal(navigationTarget.isGlobal(), false, "WHEN setStepSpecific THEN isGlobal navigation target is false");
		assert.equal(navigationTarget.isStepSpecific(), true, "WHEN setStepSpecific THEN isStepSpecific navigation target is true");
		navigationTarget.setGlobal();
		assert.equal(navigationTarget.isGlobal(), true, "WHEN setGlobal THEN isGlobal navigation target is true");
		assert.equal(navigationTarget.isStepSpecific(), false, "WHEN setGlobal THEN isStepSpecific navigation target is false");
	});
	QUnit.test("WHEN getAssignableStepsForNavigationTarget", function(assert) {
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		var stepId2 = this.configurationEditor.createStep(categoryId1);
		var navTargetId1 = this.configurationEditor.createNavigationTarget();
		var navTargetId2 = this.configurationEditor.createNavigationTarget();
		this.configurationEditor.getStep(stepId1).addNavigationTarget(navTargetId1);
		var assignableSteps = this.configurationEditor.getAssignableStepsForNavigationTarget(navTargetId1); //CUT
		assert.equal(assignableSteps.length, 1, "THEN the right number of assignable steps is returned");
		assert.ok(assignableSteps.indexOf(stepId1) === -1, "THEN the right stepIds are returned");
		assert.ok(assignableSteps.indexOf(stepId2) > -1, "THEN the right stepIds are returned");
		assignableSteps = this.configurationEditor.getAssignableStepsForNavigationTarget(navTargetId2); //CUT
		assert.equal(assignableSteps.length, 2, "THEN the right number of assignable steps is returned");
		assert.ok(assignableSteps.indexOf(stepId1) > -1, "THEN the right stepIds are returned");
		assert.ok(assignableSteps.indexOf(stepId2) > -1, "THEN the right stepIds are returned");
	});
	QUnit.test("WHEN getStepsAssignedToNavigationTarget", function(assert) {
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		var stepId2 = this.configurationEditor.createStep(categoryId1);
		var navTargetId1 = this.configurationEditor.createNavigationTarget();
		var navTargetId2 = this.configurationEditor.createNavigationTarget();
		this.configurationEditor.getStep(stepId1).addNavigationTarget(navTargetId1);
		var assignableSteps = this.configurationEditor.getStepsAssignedToNavigationTarget(navTargetId1); //CUT
		assert.equal(assignableSteps.length, 1, "THEN the right number of assigned steps is returned");
		assert.ok(assignableSteps.indexOf(stepId1) > -1, "THEN the right stepIds are returned");
		assert.ok(assignableSteps.indexOf(stepId2) === -1, "THEN the right stepIds are returned");
		assignableSteps = this.configurationEditor.getStepsAssignedToNavigationTarget(navTargetId2); //CUT
		assert.equal(assignableSteps.length, 0, "THEN the right number of assigned steps is returned");
	});
	QUnit.test("WHEN navigation target, that is assigned to a step is removed", function(assert){
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		var navTargetId1 = this.configurationEditor.createNavigationTarget();
		var navTarget1 = this.configurationEditor.getNavigationTarget(navTargetId1);
		navTarget1.setStepSpecific();
		this.configurationEditor.getStep(stepId1).addNavigationTarget(navTargetId1);
		var navTargetsAssigned = this.configurationEditor.getStep(stepId1).getNavigationTargets();
		assert.strictEqual(navTargetsAssigned.length, 1, "THEN 1 navigation target assigned");
		this.configurationEditor.removeNavigationTarget(navTargetId1); //CUT
		navTargetsAssigned = this.configurationEditor.getStep(stepId1).getNavigationTargets();
		assert.strictEqual(navTargetsAssigned.length, 0, "THEN 0 navigation target assigned");
	});
	QUnit.test("WHEN navigation target, that is assigned to a step is removed (AND step has several nav targets assigned)", function(assert){
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		var navTargetId1 = this.configurationEditor.createNavigationTarget();
		var navTarget1 = this.configurationEditor.getNavigationTarget(navTargetId1);
		navTarget1.setStepSpecific();
		this.configurationEditor.getStep(stepId1).addNavigationTarget(navTargetId1);
		var navTargetId2 = this.configurationEditor.createNavigationTarget();
		var navTarget2 = this.configurationEditor.getNavigationTarget(navTargetId2);
		navTarget2.setStepSpecific();
		this.configurationEditor.getStep(stepId1).addNavigationTarget(navTargetId2);
		var navTargetsAssigned = this.configurationEditor.getStep(stepId1).getNavigationTargets();
		assert.strictEqual(navTargetsAssigned.length, 2, "THEN 2 navigation targets assigned");
		this.configurationEditor.removeNavigationTarget(navTargetId1); //CUT
		navTargetsAssigned = this.configurationEditor.getStep(stepId1).getNavigationTargets();
		assert.strictEqual(navTargetsAssigned.length, 1, "THEN 1 navigation target assigned");
		assert.strictEqual(navTargetsAssigned[0], navTargetId2, "THEN second navigation target remains assigned");
	});
	QUnit.test("WHEN navigation target, that is assigned to severals steps is removed", function(assert){
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		var stepId2 = this.configurationEditor.createStep(categoryId1);
		var navTargetId1 = this.configurationEditor.createNavigationTarget();
		var navTarget1 = this.configurationEditor.getNavigationTarget(navTargetId1);
		navTarget1.setStepSpecific();
		this.configurationEditor.getStep(stepId1).addNavigationTarget(navTargetId1);
		this.configurationEditor.getStep(stepId2).addNavigationTarget(navTargetId1);
		var navTargetsAssigned = this.configurationEditor.getStep(stepId1).getNavigationTargets();
		assert.strictEqual(navTargetsAssigned.length, 1, "THEN 1 navigation target assigned to step 1");
		var navTargetsAssigned = this.configurationEditor.getStep(stepId2).getNavigationTargets();
		assert.strictEqual(navTargetsAssigned.length, 1, "THEN 1 navigation target assigned to step 2");
		this.configurationEditor.removeNavigationTarget(navTargetId1); //CUT
		navTargetsAssigned = this.configurationEditor.getStep(stepId1).getNavigationTargets();
		assert.strictEqual(navTargetsAssigned.length, 0, "THEN 0 navigation targets assigned to step 1");
		navTargetsAssigned = this.configurationEditor.getStep(stepId2).getNavigationTargets();
		assert.strictEqual(navTargetsAssigned.length, 0, "THEN 0 navigation targets assigned to step 2");
	});
	QUnit.test("WHEN navigation target, that is assigned to severals steps is copied", function(assert){
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		var stepId2 = this.configurationEditor.createStep(categoryId1);
		var navTargetId1 = this.configurationEditor.createNavigationTarget();
		var navTarget1 = this.configurationEditor.getNavigationTarget(navTargetId1);
		navTarget1.setStepSpecific();
		this.configurationEditor.getStep(stepId1).addNavigationTarget(navTargetId1);
		this.configurationEditor.getStep(stepId2).addNavigationTarget(navTargetId1);
		// action
		var newId = this.configurationEditor.copyNavigationTarget(navTargetId1);

		var navTargetsAssigned = this.configurationEditor.getStep(stepId1).getNavigationTargets();
		assert.strictEqual(navTargetsAssigned.length, 2, "THEN 2 navigation targets assigned to step 1");
		assert.deepEqual(navTargetsAssigned, [ navTargetId1, newId], "THEN list of assigned navigation targets as expected");
		navTargetsAssigned = this.configurationEditor.getStep(stepId2).getNavigationTargets();
		assert.strictEqual(navTargetsAssigned.length, 2, "THEN 2 navigation targets assigned to step 2");
		assert.deepEqual(navTargetsAssigned, [ navTargetId1, newId],  "THEN list of assigned navigation targets as expected");
	});
	QUnit.test("Add, get and remove category step assignments", function(assert) {
		// Create and Get
		var isOK = this.configurationEditor.addCategoryStepAssignment("categoryId1", "step1"); //CUT
		assert.ok(!isOK, "category step assignments cannot be created for not existing categories or steps");
		var steps = this.configurationEditor.getCategoryStepAssignments("category1"); //CUT
		assert.ok(!steps, "no step assignments are remembered for a not existing categoryId");
		var category1 = {
			labelKey : "localTextReference1"
		};
		this.configurationEditor.createCategoryWithId(category1, "categoryId1");
		isOK = this.configurationEditor.addCategoryStepAssignment("categoryId1", "step1"); //CUT
		assert.ok(!isOK, "category step assignments cannot be created for not existing categories or steps");
		steps = this.configurationEditor.getCategoryStepAssignments("category1"); //CUT
		assert.ok(!steps, "no step assignments are remembered for a not existing stepId");
		var stepId1 = this.configurationEditor.createStep("categoryId1");
		steps = this.configurationEditor.getCategoryStepAssignments("categoryId1"); //CUT
		assert.equal(steps.length, 1, "the right number of step assignments is remembered for existing categoryIds and stepIds");
		var stepId2 = this.configurationEditor.createStep("categoryId1");
		steps = this.configurationEditor.getCategoryStepAssignments("categoryId1"); //CUT
		assert.equal(steps.length, 2, "the right number of step assignments is remembered for existing categoryIds and stepIds");
		var category2 = {
			labelKey : "localTextReference2"
		};
		this.configurationEditor.createCategoryWithId(category2, "categoryId2");
		isOK = this.configurationEditor.addCategoryStepAssignment("categoryId2", stepId2); //CUT
		assert.ok(isOK, "category step assignments can be created, if categories and steps are existing");
		steps = this.configurationEditor.getCategoryStepAssignments("categoryId2"); //CUT
		assert.equal(steps.length, 1, "the right number of step assignments is remembered for existing categoryIds and stepIds");
		// Remove
		isOK = this.configurationEditor.removeCategoryStepAssignment("categoryId2", stepId1); //CUT
		assert.ok(!isOK, "not existing category step assignments cannot be removed");
		isOK = this.configurationEditor.removeCategoryStepAssignment("categoryId3", stepId1); //CUT
		assert.ok(!isOK, "not existing category step assignments cannot be removed");
		steps = this.configurationEditor.getCategoryStepAssignments("categoryId1"); //CUT
		assert.equal(steps.length, 2, "the right number of step assignments is returned after remove");
		steps = this.configurationEditor.getCategoryStepAssignments("categoryId2"); //CUT
		assert.equal(steps.length, 1, "the right number of step assignments is returned after remove");
		isOK = this.configurationEditor.removeCategoryStepAssignment("categoryId1", stepId2); //CUT
		assert.ok(isOK, "existing category step assignments can be removed");
		isOK = this.configurationEditor.removeCategoryStepAssignment("categoryId2", stepId2); //CUT
		assert.ok(isOK, "existing category step assignments can be removed");
		steps = this.configurationEditor.getCategoryStepAssignments("categoryId1"); //CUT
		assert.equal(steps.length, 1, "the right number of step assignments is returned after remove");
		steps = this.configurationEditor.getCategoryStepAssignments("categoryId2"); //CUT
		assert.equal(steps.length, 0, "the right number of step assignments is returned after remove");
		isOK = this.configurationEditor.removeCategoryStepAssignment("categoryId1"); //CUT
		assert.ok(isOK, "existing category step assignments can be removed");
		isOK = this.configurationEditor.removeCategoryStepAssignment("categoryId2"); //CUT
		assert.ok(!isOK, "not existing category step assignments cannot be removed");
		steps = this.configurationEditor.getCategoryStepAssignments("categoryId1"); //CUT
		assert.equal(steps.length, 0, "the right number of step assignments is returned after remove");
		steps = this.configurationEditor.getCategoryStepAssignments("categoryId2"); //CUT
		assert.equal(steps.length, 0, "the right number of step assignments is returned after remove");
	});
	QUnit.test("GIVEN configurationEditor WHEN creating a step THEN step is managed", function(assert) {
		var category1 = {
			labelKey : "localTextReference1"
		};
		var categoryId1 = this.configurationEditor.createCategoryWithId(category1, "categoryId1");
		var stepId = this.configurationEditor.createStep(categoryId1);
		var list = this.configurationEditor.getSteps();
		assert.equal(list.length, 1, "non-empty");
		assert.equal(list[0].getId(), stepId, 'Same id');
		assert.equal(list[0].getId().indexOf('Step'), 0, 'Format ok');
	});
	QUnit.test("Create a hierarchical step, getSteps, getStep, removeCategoryStepAssignment", function(assert) {
		var category1 = {
			labelKey : "localTextReference1"
		};
		var categoryId1 = this.configurationEditor.createCategoryWithId(category1, "categoryId1");
		var hStepId = this.configurationEditor.createHierarchicalStep(categoryId1);
		var list = this.configurationEditor.getSteps();
		assert.equal(list.length, 1, "non-empty");
		assert.equal(list[0].getId(), hStepId, 'Same id');
		assert.equal(list[0].getId().indexOf('Step'), 0, 'Format ok');
		var hStep = this.configurationEditor.getStep(hStepId);
		assert.strictEqual(hStep.getType(), "hierarchicalStep", "Correct step type returned");
		this.configurationEditor.removeCategoryStepAssignment(categoryId1, hStep.getId());
		assert.equal(this.configurationEditor.getSteps().length, 0, "Hierarchical step removed");
	});
	QUnit.test("Create a hierarchical step with Id, getSteps, getStep, removeCategoryStepAssignment", function(assert) {
		var category1 = {
			labelKey : "localTextReference1"
		};
		var categoryId1 = this.configurationEditor.createCategoryWithId(category1, "categoryId1");
		var hStepId = this.configurationEditor.createHierarchicalStepWithId("StepId-1");
		this.configurationEditor.addCategoryStepAssignment(categoryId1, hStepId);
		var list = this.configurationEditor.getSteps();
		assert.equal(list.length, 1, "non-empty");
		assert.equal(list[0].getId(), hStepId, 'Same id');
		assert.equal(list[0].getId().indexOf('Step'), 0, 'Format ok');
		var hStep = this.configurationEditor.getStep(hStepId);
		assert.strictEqual(hStep.getType(), "hierarchicalStep", "Correct step type returned");
		this.configurationEditor.removeCategoryStepAssignment(categoryId1, hStep.getId());
		assert.equal(this.configurationEditor.getSteps().length, 0, "Hierarchical step removed");
	});
	QUnit.test("GIVEN configurationEditor THEN createStep, getStep, removeCategoryStepAssignment work", function(assert) {
		var category1 = {
			labelKey : "localTextReference1"
		};
		var categoryId1 = this.configurationEditor.createCategoryWithId(category1, "categoryId1");
		var stepId = this.configurationEditor.createStep(categoryId1);
		var step = this.configurationEditor.getStep(stepId);
		assert.ok(step instanceof sap.apf.modeler.core.Step, "Step created");
		assert.deepEqual(step, this.configurationEditor.getSteps()[0], 'Same step instance returned when accessiong step via getSteps() and getStep(<id>)');
		this.configurationEditor.removeCategoryStepAssignment(categoryId1, step.getId());
		assert.equal(this.configurationEditor.getSteps().length, 0, "Step removed");
	});
	QUnit.test("GIVEN configurationEditor THEN createStep, removeCategoryStepAssignment(categoryId, stepId) does not remove the step if it is assigned to two categories", function(assert) {
		var category1 = {
			labelKey : "localTextReference1"
		};
		var categoryId1 = this.configurationEditor.createCategoryWithId(category1, "categoryId1");
		var category2 = {
			labelKey : "localTextReference2"
		};
		var categoryId2 = this.configurationEditor.createCategoryWithId(category2, "categoryId2");
		var stepId = this.configurationEditor.createStep(categoryId1);
		var step = this.configurationEditor.getStep(stepId);
		assert.ok(step instanceof sap.apf.modeler.core.Step, "Step created");
		assert.ok(this.configurationEditor.addCategoryStepAssignment(categoryId2, stepId), "Step assigned to second category");
		this.configurationEditor.removeCategoryStepAssignment(categoryId1, step.getId());
		assert.equal(this.configurationEditor.getSteps().length, 1, "No step removed");
	});
	QUnit.test("GIVEN configurationEditor THEN createStep, removeCategoryStepAssignment(categoryId) does not remove the step if it is assigned to two categories", function(assert) {
		var category1 = {
			labelKey : "localTextReference1"
		};
		var categoryId1 = this.configurationEditor.createCategoryWithId(category1, "categoryId1");
		var category2 = {
			labelKey : "localTextReference2"
		};
		var categoryId2 = this.configurationEditor.createCategoryWithId(category2, "categoryId2");
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		var step1 = this.configurationEditor.getStep(stepId1);
		assert.ok(step1 instanceof sap.apf.modeler.core.Step, "Step 1 created and assigned to first category");
		assert.ok(this.configurationEditor.addCategoryStepAssignment(categoryId2, stepId1), "Step 1 assigned as well to second category");
		var stepId2 = this.configurationEditor.createStep(categoryId1);
		var step2 = this.configurationEditor.getStep(stepId2);
		assert.ok(step2 instanceof sap.apf.modeler.core.Step, "Step 2 created and assigned to first category");
		assert.equal(this.configurationEditor.getCategoryStepAssignments(categoryId1).length, 2, "Two category step assignments for first category");
		assert.equal(this.configurationEditor.getCategoryStepAssignments(categoryId2).length, 1, "One category step assignment for second category");
		this.configurationEditor.removeCategoryStepAssignment(categoryId1);
		assert.equal(this.configurationEditor.getCategoryStepAssignments(categoryId1).length, 0, "All category step assignments for first category removed");
		assert.equal(this.configurationEditor.getSteps().length, 1, "One step removed");
		assert.equal(this.configurationEditor.getSteps()[0].getId(), stepId1, "First step was not removed");
	});
	QUnit.test("GIVEN configurationEditor WHEN step is assigned to two categories then getCategoriesForStep returns the right categories", function(assert) {
		var category1 = {
			labelKey : "localTextReference1"
		};
		var categoryId1 = this.configurationEditor.createCategoryWithId(category1, "categoryId1");
		var category2 = {
			labelKey : "localTextReference2"
		};
		var categoryId2 = this.configurationEditor.createCategoryWithId(category2, "categoryId2");
		var stepId = this.configurationEditor.createStep(categoryId1);
		var step = this.configurationEditor.getStep(stepId);
		assert.ok(step instanceof sap.apf.modeler.core.Step, "Step created");
		assert.ok(this.configurationEditor.addCategoryStepAssignment(categoryId2, stepId), "Step assigned to second category");
		assert.deepEqual(this.configurationEditor.getCategoriesForStep(stepId), [ categoryId1, categoryId2 ], "getCategoriesForStep returns the right categories");
	});
	QUnit.test("GIVEN configurationEditor THEN copyStep works", function(assert) {
		var category1 = {
			labelKey : "localTextReference1"
		};
		var categoryId1 = this.configurationEditor.createCategoryWithId(category1, "categoryId1");
		var stepId = this.configurationEditor.createStep(categoryId1);
		var list = this.configurationEditor.getSteps();
		assert.equal(list.length, 1, "non-empty");
		var newId = this.configurationEditor.copyStep(stepId);
		list = this.configurationEditor.getSteps();
		assert.equal(list.length, 2, "entry added by copy");
		assert.ok(this.configurationEditor.getStep(newId), "entry can be retrieved by new Id");
	});
	QUnit.test("WHEN createCategoryWithId THEN returned id === given id and accessible via getCategories", function(assert) {
		var category1 = {
			labelKey : "localTextReference1"
		};
		var catId = this.configurationEditor.createCategoryWithId(category1, "alien-id");
		assert.equal(catId, "alien-id", "id===");
		assert.equal(this.configurationEditor.getCategories()[0].getId(), "alien-id", "access ok");
	});
	QUnit.test("WHEN createStepWithId THEN returned id === given id and accessible via getSteps", function(assert) {
		var stepId = this.configurationEditor.createStepWithId("alien-id");
		assert.equal(stepId, "alien-id", "id===");
		assert.equal(this.configurationEditor.getSteps()[0].getId(), "alien-id", "access ok");
	});
	QUnit.test("Instantiation of configuration editor with server ID calls read on odataProxy", function(assert) {
		assert.expect(3);
		this.odataProxy.assertData = function(entitySetName, callback, inputParameters, selectList) {
			assert.equal(entitySetName, "configuration", "Reads right entitySet");
			assert.equal(inputParameters[0].name, "AnalyticalConfiguration", "Reads with with parameter AnalyicalConfiguration");
			assert.equal(inputParameters[0].value, "ServerGuid-1711", "Reads analytical configuration with right server ID");
		};
		this.configurationEditorWithServerID = new sap.apf.modeler.core.ConfigurationEditor("ServerGuid-1711", this.inject);
	});
	QUnit.test("Copy configuration with default filter option 'smartFilterBar'", function(assert) {
		var copiedEditor, copiedSmartFilterBar;
		var smartFilterBar = this.configurationEditor.getSmartFilterBar();
		smartFilterBar.setService("dummyService");
		smartFilterBar.setEntitySet("dummyEntitySet");
		copiedEditor = this.configurationEditor.copy("apf1972-newId");
		copiedSmartFilterBar = copiedEditor.getSmartFilterBar();
		assert.deepEqual(copiedEditor.getFilterOption(), {smartFilterBar : true}, "Filter option set correctly in copied editor");
		assert.equal(copiedSmartFilterBar.getService(), "dummyService", "Copied SmartFilterBar has correct service");
		assert.equal(copiedSmartFilterBar.getEntitySet(), "dummyEntitySet", "Copied SmartFilterBar has correct entity set");
	});
	QUnit.test("Copy configuration with default filter option 'smartFilterBar' and unconverted entity type", function(assert) {
		var copiedEditor, copiedSmartFilterBar;
		var smartFilterBar = this.configurationEditor.getSmartFilterBar();
		smartFilterBar.setService("dummyService");
		smartFilterBar.setEntitySet("dummyEntityType", true);
		copiedEditor = this.configurationEditor.copy("apf1972-newId");
		copiedSmartFilterBar = copiedEditor.getSmartFilterBar();
		assert.deepEqual(copiedEditor.getFilterOption(), {smartFilterBar : true}, "Filter option set correctly in copied editor");
		assert.equal(copiedSmartFilterBar.getService(), "dummyService", "Copied SmartFilterBar has correct service");
		assert.equal(copiedSmartFilterBar.getEntitySet(), "dummyEntityType", "Copied SmartFilterBar has correct entity set, that could not be converted");
		assert.equal(copiedSmartFilterBar.isEntityTypeConverted(), false, "Copied SmartFilterBar entity type could not be converted and this information is also copied");
	});
	QUnit.test("Copy configuration with filter option 'facetFilter'", function(assert) {
		var copiedCategories, copyResult;
		var categoryId1 = this.configurationEditor.setCategory(this.category1);
		var categoryId2 = this.configurationEditor.setCategory(this.category2);
		var stepId1 = this.configurationEditor.createStep(categoryId1);
		this.configurationEditor.setFilterOption({facetFilter : true});
		this.configurationEditor.setApplicationTitle("key12345");
		this.configurationEditor.addCategoryStepAssignment(categoryId2, stepId1);
		this.configurationEditor.createStep(categoryId1);
		this.configurationEditor.registerServiceAsPromise("path/to/service/serviceName1");
		this.configurationEditor.registerServiceAsPromise("path/to/service/serviceName2");
		this.configurationEditor.createFacetFilter();
		this.configurationEditor.createFacetFilter();
		this.configurationEditor.createNavigationTarget();
		this.configurationEditor.createNavigationTarget();
		copyResult = this.configurationEditor.copy("apf1972-newId");
		assert.equal(copyResult.getApplicationTitle(), "key12345", "Application title contained in copy result");
		assert.ok(!copyResult.isSaved(), "Copy result is not saved directly after copy");
		assert.deepEqual(copyResult.getAllServices(), [ "path/to/service/serviceName1", "path/to/service/serviceName2" ], "Right services registered on copy result");
		assert.equal(copyResult.getSteps().length, 2, "Right number of steps on copy result");
		assert.equal(copyResult.getFacetFilters().length, 2, "Right number of facetFilters on copy result");
		assert.equal(copyResult.getNavigationTargets().length, 2, "Right number of navigationTargets on copy result");
		copiedCategories = copyResult.getCategories();
		assert.equal(copyResult.getCategoryStepAssignments(copiedCategories[0].getId()).length, 2, "Right number of category step assignments for first category on copy result");
		assert.equal(copiedCategories[0].labelKey, 'localTextReference1', "Correct label assigned");
		assert.equal(copyResult.getCategoryStepAssignments(copiedCategories[1].getId()).length, 1, "Right number of category step assignments for second category on copy result");
		assert.equal(copiedCategories[1].labelKey, 'localTextReference2', "Correct label assigned");
		assert.deepEqual(copyResult.getFilterOption(), {facetFilter : true}, "Filter option set correctly in copied editor");
	});
	QUnit.test("Simulate filter option change from 'smartFilterBar' without config", function(assert) {
		assert.equal(this.configurationEditor.isDataLostByFilterOptionChange(), false, 'Not data loss when switching away from empty Smart Filter Bar');
	});
	QUnit.test("Simulate filter option change 'smartFilterBar' with instance but without configuration set", function(assert) {
		this.configurationEditor.getSmartFilterBar();
		assert.equal(this.configurationEditor.isDataLostByFilterOptionChange(), false, 'Not data loss when switching away from empty Smart Filter Bar');
	});
	QUnit.test("Simulate filter option change 'smartFilterBar' with service set", function(assert) {
		var smartFilterBar = this.configurationEditor.getSmartFilterBar();
		smartFilterBar.setService('dummyService');
		assert.equal(this.configurationEditor.isDataLostByFilterOptionChange(), true, 'Data loss when switching away from configured Smart Filter Bar');
	});
	QUnit.test("Simulate filter option change 'smartFilterBar' with entity set", function(assert) {
		var smartFilterBar = this.configurationEditor.getSmartFilterBar();
		smartFilterBar.setEntitySet('dummyEntitySet');
		assert.equal(this.configurationEditor.isDataLostByFilterOptionChange(), true, 'Data loss when switching away from configured Smart Filter Bar');
	});
	QUnit.test("Simulate filter option change 'facetFilter' without config", function(assert) {
		this.configurationEditor.setFilterOption({facetFilter : true});
		assert.equal(this.configurationEditor.isDataLostByFilterOptionChange(), false, 'Not data loss when switching away');
	});
	QUnit.test("Simulate filter option change 'facetFilter' with one facet filter", function(assert) {
		this.configurationEditor.setFilterOption({facetFilter : true});
		this.configurationEditor.createFacetFilter();
		assert.equal(this.configurationEditor.isDataLostByFilterOptionChange(), true, 'Potential data loss when facet filter instance exist');
	});
	QUnit.test("GIVEN configurationEditor THEN copy does not fetch data from the server", function(assert) {
		var odataProxyWasCalled;
		this.odataProxy.assertData = function(entitySetName, callback, inputParameters, selectList) {
			odataProxyWasCalled = true;
		};
		odataProxyWasCalled = false;
		this.configurationEditor.copy("ServerId");
		assert.ok(!odataProxyWasCalled, "WHEN copy to ServerId THEN no data is fetched from the server");
		odataProxyWasCalled = false;
		this.configurationEditor.copy("apf1972-newId");
		assert.ok(!odataProxyWasCalled, "WHEN copy to internal id THEN no data is fetched from the server as well");
	});
	QUnit.test("WHEN new ConfigurationEditor with argument of type object and temp configuration ID THEN  save calls create on ODataProxy", function(assert) {
		var that = this;
		this.inject.instances.persistenceProxy.update = function() {
		};
		this.inject.instances.persistenceProxy.create = function(type, config, callback) {
			testCallback(type, config, callback);
		};
		var smartFilterBar = {
				id : 'SmartFilterBar-1',
				type : 'smartFilterBar',
				service : "myInvalidService",
				entityType : "notKnown"
			};
		
		var editor = new sap.apf.modeler.core.ConfigurationEditor({
			id : "apf1972-tempId",
			content : {
				steps : [],
				requests : [],
				bindings : [],
				representationTypes : [],
				categories : [],
				navigationTargets : [],
				smartFilterBar : smartFilterBar
			}
		}, this.inject);
		editor.save(testCallback);
		function testCallback(type, config, callbackCreate) {
			
			assert.equal(type, "configuration", 'Correct type');
			var conf = JSON.parse(config.SerializedAnalyticalConfiguration);
			assert.deepEqual(conf.smartFilterBar, smartFilterBar, 'OdataProxy create called with unchanged smartfilterbar configuration');
			var errors = that.messageHandler.spyResults.putMessage;
			assert.equal(errors[errors.length - 1].code, "11524", "THEN technical error was logged");
		}
	});
	QUnit.module("M: ElementContainer", {
		beforeEach : function() {
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					ElementContainer : sap.apf.modeler.core.ElementContainer
				}
			};
		}
	});
	QUnit.test("GIVEN ElementContainer with name WHEN createElement THEN created element has getId() and id begins with container name", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("xyz", undefined, this.inject);
		var element = container.createElement();
		assert.equal(element.getId().indexOf("xyz-"), 0);
	});
	QUnit.test("GIVEN ElementContainer without constructor WHEN createElement THEN empty element created, has getId()", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("xyz", undefined, this.inject);
		var element = container.createElement();
		var item = container.getElement(element.getId());
		assert.equal(element.getId().indexOf("xyz-"), 0);
		assert.ok(element instanceof Object);
		assert.deepEqual(element, item);
		assert.equal(element.getId(), item.getId());
		container.removeElement(item.getId());
		assert.equal(container.getElements().length, 0);
	});
	QUnit.test("GIVEN ElementContainer without constructor WHEN createElement with obj THEN obj gets merged in", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("xyz", undefined, this.inject);
		var element = container.createElement({
			x : 1,
			y : 2
		});
		var item = container.getElement(element.getId());
		assert.ok(element instanceof Object);
		assert.equal(item.x, 1);
		assert.equal(item.y, 2);
		assert.equal(element.getId(), item.getId());
	});
	QUnit.test("GIVEN ElementContainer with constructor XX WHEN createElement THEN instance of type XX exists", function(assert) {
		function XX() {
			this.xyz = 123;
		}
		var container = new sap.apf.modeler.core.ElementContainer("xyz", XX, this.inject);
		var element = container.createElement();
		var item = container.getElement(element.getId());
		assert.ok(element instanceof XX);
		assert.deepEqual(element, item);
		assert.equal(element.getId(), item.getId());
		assert.equal(element.xyz, 123);
		container.removeElement(item.getId());
		assert.equal(container.getElements().length, 0);
	});
	QUnit.test("GIVEN ElementContainer with constructor XX WHEN createElement with specified different constructor ", function(assert) {
		function XX() {
			this.xyz = 123;
		}
		function YY() {
			this.xyz = 321;
		}
		var container = new sap.apf.modeler.core.ElementContainer("xyz", XX, this.inject);
		var element = container.createElement(undefined, YY);
		var item = container.getElement(element.getId());
		assert.ok(element instanceof YY);
		assert.deepEqual(element, item);
		assert.equal(element.getId(), item.getId());
		assert.equal(element.xyz, 321);
		container.removeElement(item.getId());
		assert.equal(container.getElements().length, 0);
	});
	QUnit.test("GIVEN ElementContainer without constructor WHEN createElement with obj THEN obj gets merged in", function(assert) {
		function XX() {
			this.xyz = 123;
		}
		var container = new sap.apf.modeler.core.ElementContainer("xyz", XX, this.inject);
		var element = container.createElement({
			x : 1,
			y : 2
		});
		var item = container.getElement(element.getId());
		assert.ok(element instanceof Object);
		assert.equal(item.x, 1);
		assert.equal(item.y, 2);
		assert.equal(element.xyz, 123);
		assert.equal(element.getId(), item.getId());
	});
	QUnit.test("GIVEN ElementContainer WHEN createElement THEN updateElement update getId()", function(assert) {
		function XX() {
			this.abc = 0;
		}
		var container = new sap.apf.modeler.core.ElementContainer("xyz", XX, this.inject);
		var element = container.createElement({
			x : 1,
			y : 2
		});
		container.updateElement(element.getId(), {
			zzz : 4711
		});
		var item = container.getElement(element.getId());
		assert.equal(item.x, undefined);
		assert.equal(item.zzz, 4711);
		assert.equal(element.getId(), item.getId());
	});
	QUnit.test("GIVEN ElementContainer WHEN setElement THEN new getId()", function(assert) {
		function XX() {
			//noinspection JSUnusedGlobalSymbols
			this.abc = 0;
		}
		var container = new sap.apf.modeler.core.ElementContainer("xyz", XX, this.inject);
		var id1 = container.setElement({
			x : 1
		});
		var id2 = container.setElement({
			x : 2
		});
		assert.notEqual(id1, id2, "new elementId");
	});
	QUnit.test("GIVEN ElementContainer without ctor WHEN setElement THEN new getId()", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("xyz", undefined, this.inject);
		var id1 = container.setElement({
			x : 1
		});
		var id2 = container.setElement({
			x : 2
		});
		assert.notEqual(id1, id2, "new elementId");
	});
	QUnit.test("WHEN setElement with non-existing id THEN error case and undefined id returned", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("xyz", undefined, this.inject);
		var id1 = container.setElement({
			x : 1
		}, "illegal");
		assert.equal(id1, undefined, "error");
		assert.equal(this.messageHandler.spyResults.putMessage.code, 11006, "The identifier was detected as unknown");
		assert.equal(container.getElements().length, 0, "empty container");
	});
	QUnit.test("WHEN setElement with existing id THEN getId well-defined", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("xyz", undefined, this.inject);
		var id1 = container.setElement({
			x : 1
		});
		var id2 = container.setElement({
			x : 2
		}, id1);
		assert.equal(id1, id2, "stable id");
		assert.equal(id1, container.getElement(id1).getId(), "stable id");
		assert.equal(container.getElement(id1).x, 2, "updated");
		assert.equal(container.getElements().length, 1, "1 element");
	});
	QUnit.test("WHEN updateElement with existing id THEN getId well-defined", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("xyz", undefined, this.inject);
		var id1 = container.setElement({
			x : 1
		});
		var id2 = container.updateElement(id1, {
			x : 2
		});
		assert.equal(id1, id2, "stable id");
		assert.equal(id1, container.getElement(id1).getId(), "stable id");
		assert.equal(container.getElement(id1).x, 2, "updated");
		assert.equal(container.getElements().length, 1, "1 element");
	});
	QUnit.test("WHEN dataFromCopy is supplied in the constructor THEN internal state of new instance is adapted", function(assert) {
		var dataFromCopy = {
			elements : new sap.apf.utils.Hashtable(this.messageHandler),
			elementCounter : 0
		};
		var key = "abc-xyz-1", obj = {
			value : "10"
		};
		dataFromCopy.elements.setItem(key, obj);
		dataFromCopy.elementCounter = 1;
		var container = new sap.apf.modeler.core.ElementContainer("abc-xyz", undefined, this.inject, dataFromCopy);
		assert.equal(container.getElement(key), obj, "right object returned");
		assert.equal(container.setElement({
			x : 1
		}), "abc-xyz-2", "Right ID for new object was returned");
	});
	QUnit.test("GIVEN element container WHEN copy THEN elements are copied to new container", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("abc-xyz", undefined, this.inject), newContainer, obj1 = {
			x : 1,
			copy : function() {
				return {
					y : 1
				};
			}
		}, obj2 = {
			x : 2
		}, key1, key2, obj1Copied, obj2Copied, key1 = container.setElement(obj1);
		key2 = container.setElement(obj2);
		newContainer = container.copy();
		obj1Copied = newContainer.getElement(key1);
		obj2Copied = newContainer.getElement(key2);
		assert.ok(obj1Copied, "Entry for key1 exists in copy");
		assert.ok(obj2Copied, "Entry for key2 exists in copy");
		assert.notDeepEqual(obj1, obj1Copied, "New instance returned from copy for key1");
		assert.notDeepEqual(obj2, obj2Copied, "New instance returned from copy for key2");
		assert.equal(obj1Copied.y, "1", "Object returned by object specific copy function returned for object 1");
		assert.equal(obj2Copied.x, "2", "Right object returned by copy function for object 2");
	});
	QUnit.test("GIVEN element container", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("abc-xyz", undefined, this.inject);
		var obj1 = {
			x : 1
		};
		var id = container.createElementWithProposedId(obj1, "10").getId();
		assert.equal(id, "10", "WHEN createElementWithProposedId and anused id THEN proposed Id as expected");
		id = container.createElementWithProposedId(obj1, "10").getId();
		assert.equal(id, "abc-xyz-1", "WHEN createElementWithProposedId and already used id THEN proposed Id as expected");
		id = container.createElementWithProposedId(obj1, "abc-xyz-11").getId();
		assert.equal(id, "abc-xyz-11", "WHEN createElementWithProposedId and not used id THEN proposed Id as expected");
		id = container.createElementWithProposedId(obj1, "abc-xyz-11").getId();
		assert.equal(id, "abc-xyz-12", "WHEN createElementWithProposedId and already used id THEN proposed Id as expected");
		id = container.createElementWithProposedId(obj1, "abc-xyz-21").getId();
		assert.equal(id, "abc-xyz-21", "WHEN createElementWithProposedId and unused id THEN proposed Id as expected");
		id = container.createElement(obj1).getId();
		assert.equal(id, "abc-xyz-22", "WHEN createElement THEN Id counter as expected");
	});
	QUnit.test("CreateElementWithProposedIdwith specified constructor ", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("abc-xyz", undefined, this.inject);
		var obj1 = {
			x : 1
		};
		var constructor = function() {
			this.y = 2;
		};
		var id = container.createElementWithProposedId(obj1, "abc-xyz-21", constructor).getId();
		assert.equal(id, "abc-xyz-21", "Specified id returned");
		var element = container.getElement(id);
		assert.ok(element instanceof constructor, "Specified Constructor is used");
	});
	QUnit.test("CreateElementWithProposedId, already used id and specified constructor ", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("abc-xyz", undefined, this.inject);
		var obj1 = {
			x : 1
		};
		var constructor = function() {
			this.y = 2;
		};
		var id = container.createElementWithProposedId(obj1, "abc-xyz-21").getId();
		assert.equal(id, "abc-xyz-21", "WHEN createElementWithProposedId and unused id THEN proposed Id as expected");
		id = container.createElementWithProposedId(obj1, "abc-xyz-21", constructor).getId();
		assert.equal(id, "abc-xyz-22", "New Id returned");
		var element = container.getElement(id);
		assert.ok(element instanceof constructor, "Specified Constructor is used");
	});
	QUnit.test("GIVEN element container", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("abc-xyz", undefined, this.inject), obj1 = {
			x : 1
		}, obj2 = {
			copy : function(newid) {
				return {
					y : 3,
					newid : newid
				};
			}
		};
		var id1 = container.setElement(obj1);
		var id2 = container.setElement(obj2);
		assert.equal(id1, "abc-xyz-1", "WHEN setElement THEN element gets the right Id");
		assert.equal(id2, "abc-xyz-2", "WHEN setElement THEN element gets the right Id");
		var copyId1 = container.copyElement(id1);
		var copyId2 = container.copyElement(id2);
		var copyObj1 = container.getElement(copyId1);
		var copyObj2 = container.getElement(copyId2);
		assert.equal(copyId1, "abc-xyz-3", "WHEN elementCopy THEN copy has a new Id");
		assert.equal(copyId2, "abc-xyz-4", "WHEN elementCopy THEN copy has a new Id");
		assert.equal(copyId1, copyObj1.getId(), "WHEN getId THEN copy returns the right Id");
		assert.equal(copyId2, copyObj2.getId(), "WHEN getId THEN copy returns the right Id");
		delete copyObj1.getId;
		assert.notEqual(copyObj1, obj1, "WHEN elementCopy THEN copy is a new object");
		assert.deepEqual(copyObj1, obj1, "WHEN elementCopy THEN resulting object is as expected");
		delete copyObj2.getId;
		assert.deepEqual(copyObj2, {
			y : 3,
			newid : copyId2
		}, "WHEN elementCopy for element with copy function THEN resulting object is as expected");
	});
	QUnit.test("Move elements in container with the operation MoveBefore", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("abc-xyz", undefined, this.inject);
		var firstElement = {
			x : 1
		};
		var secondElement = {
			x : 2
		};
		var thirdElement = {
			x : 3
		};
		var id1 = container.setElement(firstElement);
		var id2 = container.setElement(secondElement);
		var id3 = container.setElement(thirdElement);
		var list = container.getElements();
		assert.equal(list[0].x, 1, "First Element expected");
		assert.equal(list[1].x, 2, "Second Element expected");
		assert.equal(list[2].x, 3, "Third Element expected");
		var position = container.moveBefore(id1, id3);
		assert.equal(position, 0, "First position expected");
		list = container.getElements();
		assert.equal(list[0].x, 3, "Now third Element expected");
		assert.equal(list[1].x, 1, "Now first Element expected");
		assert.equal(list[2].x, 2, "Now second Element expected");
		container.moveBefore(id2, id3);
		list = container.getElements();
		assert.equal(list[0].x, 1, "Now first Element expected");
		assert.equal(list[1].x, 3, "Now third Element expected");
		assert.equal(list[2].x, 2, "Now second Element expected");
	});
	QUnit.test("Move up or down elements in container", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("abc-xyz", undefined, this.inject);
		var firstElement = {
			x : 1
		};
		var secondElement = {
			x : 2
		};
		var thirdElement = {
			x : 3
		};
		var id1 = container.setElement(firstElement);
		container.setElement(secondElement);
		container.setElement(thirdElement);
		var position = container.moveUpOrDown(id1, 2);
		assert.equal(position, 3, "Last position expected");
		var list = container.getElements();
		assert.equal(list[0].x, 2, "Second Element expected");
		assert.equal(list[1].x, 3, "Third Element expected");
		assert.equal(list[2].x, 1, "First Element expected");
		var position = container.moveUpOrDown(id1, -1);
		list = container.getElements();
		assert.equal(list[0].x, 2, "Second Element expected");
		assert.equal(list[1].x, 1, "First Element expected");
		assert.equal(list[2].x, 3, "Third Element expected");
	});
	QUnit.test("Move elements in container with the operation MoveLast", function(assert) {
		var container = new sap.apf.modeler.core.ElementContainer("abc-xyz", undefined, this.inject);
		var firstElement = {
			x : 1
		};
		var secondElement = {
			x : 2
		};
		var thirdElement = {
			x : 3
		};
		var id1 = container.setElement(firstElement);
		container.setElement(secondElement);
		container.setElement(thirdElement);
		container.moveToEnd(id1);
		var list = container.getElements();
		assert.equal(list[0].x, 2, "Now second Element expected");
		assert.equal(list[1].x, 3, "Now third Element expected");
		assert.equal(list[2].x, 1, "Now first Element expected");
	});
}());

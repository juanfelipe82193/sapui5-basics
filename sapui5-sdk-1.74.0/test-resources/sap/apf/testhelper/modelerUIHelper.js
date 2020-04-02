/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
/* global sap */

sap.ui.define([
	'sap/ui/core/mvc/View',
	'sap/apf/testhelper/mockServer/wrapper',
	'sap/apf/modeler/core/instance',
	'sap/apf/core/instance',
	'sap/apf/core/metadataFactory',
	'sap/apf/core/constants',
	'sap/apf/modeler/ui/utils/constants',
	'sap/apf/utils/startParameter',
	'sap/apf/utils/utils',
	'sap/apf/testhelper/modelerHelper',
	'sap/apf/testhelper/helper',
	'sap/apf/testhelper/doubles/messageHandler', // not used here, but required by many modules importing this one.
	'sap/apf/testhelper/authTestHelper', // not used here, but required by many modules importing this one.
	'sap/apf/testhelper/config/sampleConfiguration', // not used here, but required by many modules importing this one.
	'sap/apf/ui/representations/columnChart',
	'sap/apf/ui/representations/barChart',
	'sap/apf/ui/representations/pieChart',
	'sap/apf/ui/representations/bubbleChart',
	'sap/apf/ui/representations/table'
], function(mvcView,
			mockServerWrapper, ModelerCoreInstance, CoreInstance, MetadataFactory,
			coreConstants, modelerConstants, startParameter, apfUtils,
			modelerHelper, testHelper, messageHandler, authTestHelper, sampleConfiguration,
			ColumnChart, BarChart, PieChart, BubbleChart, Table){
	"use strict";

	/*BEGIN_COMPATIBILITY*/
	MetadataFactory = MetadataFactory || sap.apf.core.MetadataFactory;
	/*END_COMPATIBILITY*/
	// .create

	var oModelerInstanceDeferred = new jQuery.Deferred();//Deferred object to be resolved with the modeler instance
	var module = {
		getInstance : function() {
			var that = this;
			this.modelerServicePath = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
			this.appA = {
				ApplicationName : "apf1972-appA",
				SemanticObject : "semObjA"
			};
			this.newConfigId = "newConfig0";
			this.MetadataFactory = function(oInject) {
				var oMetadataFactory = new MetadataFactory(oInject);
				var fnOriginalGetMetadata = oMetadataFactory.getMetadata;
				oMetadataFactory.getMetadata = function(service) {
					if (service === that.modelerServicePath) {
						return fnOriginalGetMetadata(service); //mockserver
					}
					var oMetadataDeferred = jQuery.Deferred();
					oMetadataDeferred.reject();
					return oMetadataDeferred;
				};
				return oMetadataFactory;
			};
			mockServerWrapper.activateModeler();
			modelerHelper.createApplicationHandler(this, function(appHandler) {
				//register the UI callback for message handling after having modeler core api
				var oMessageHandlerView = sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.messageHandler",
					type : "XML",
					viewData : that.modelerCore
				});
				var fnCallbackMessageHandling = oMessageHandlerView.getController().showMessage;
				that.modelerCore.setCallbackForMessageHandling(fnCallbackMessageHandling.bind(oMessageHandlerView.getController()));
				that.applicationHandler = appHandler;
				var configurationObjectForUnsavedConfig = {
					AnalyticalConfigurationName : "test config A"
				};
				var configurationObjectForSavedConfig = {
					AnalyticalConfigurationName : "test config B"
				};
				var configurationObjectForSavedConfig2 = {
					AnalyticalConfigurationName : "test config C"
				};
				var categoryObjForUnsavedConfig = {
					labelKey : "test category A"
				};
				var categoryObjForUnsavedConfig2 = {
					labelKey : "test category B"
				};
				that.serviceList = [ "testService1", "testService2", "testService3", "testService4", "testService5", "testService6", "hierarchicalService1", "hierarchicalService2" ];
				that.serviceData = {
					"testService1" : {
						"entitySet1" : [ "property1", "property2", "property3", "property4", "property1Text", "property3Text" ],
						"entitySet2" : [ "property5", "property6", "property7" ],
						"entitySet3" : [ "property1", "property2", "property3", "property8" ],
						"entitySet4" : [ "property1", "property2", "property6", "property8" ],
						"entitySet5" : [ "property3", "property9" ],
						"entitySet11" : [ "property1", "property9" ],
						"entitySet6" : [ "property1", "property2", "property3", "property9" ],
						"entitySet7" : [ "property1", "property2", "property3", "property10", "property11" ],
						"entitySet13" : [ "property2", "property4", "property11" ]
					},
					"testService2" : {
						"entitySet8" : [ "property9", "property10", "property11" ]
					},
					"testService3" : {
						"entitySet9" : [ "property1", "property2", "property8" ]
					},
					"testService4" : {
						"entitySet10" : [ "property1", "property3", "property13" ],
						"entitySet12" : [ "property5", "property6", "property7" ],
						"entitySet4" : [ "property1", "property2", "property6", "property8" ],
						"entitySet5" : [ "property3", "property9" ]
					},
					"testService5" : {
						"entitySet2" : [ "property5", "property6", "property7" ],
						"entitySet3" : [ "property1", "property2", "property3", "property8" ],
						"entitySet4" : [ "property1", "property2", "property6", "property8" ]
					},
					"testService6" : {
						"entitySet1" : [ "property1", "property2", "property3", "property4", "property1Text", "property3Text" ],
						"entitySet9" : [ "property1", "property2", "property8" ],
						"entitySet10" : [ "property1", "property3", "property13" ]
					},
					"hierarchicalService1" : {
						"hierarchicalEntitySet1" : [ "hierarchicalproperty1", "hierarchicalproperty2", "nonHierarchicalproperty1", "nonHierarchicalproperty2" ],
						"hierarchicalEntitySet2" : [ "hierarchicalproperty3", "nonHierarchicalproperty3", "nonHierarchicalproperty4" ]
					},
					"hierarchicalService2" : {},
					"hierarchicalService3" : {
						"hierarchicalEntitySet3" : [ "hierarchicalproperty4", "nonHierarchicalproperty4" ],
						"hierarchicalEntitySet4" : [ "hierarchicalproperty5", "nonHierarchicalproperty5" ]
					}
				};
				that.serviceDataEntitySets = {
					"testService1" : [ "entitySet1", "entitySet2" ],
					"testService2" : [ "entitySet3" ],
					"testService3" : [ "entitySet2" ],
					"hierarchicalService1" : [ "hierarchicalEntitySet1", "hierarchicalEntitySet2" ],
					"hierarchicalService2" : []
				};
				//create and save an application
				that.applicationHandler.setAndSave(that.appA, function(id, metadata, messageObject) {
					that.applicationCreatedForTest = id;
					//get configurationHandler
					that.modelerCore.getConfigurationHandler(id, function(configurationHandler, messageObject) {
						that.configurationHandler = configurationHandler;
						that.textPool = configurationHandler.getTextPool();
						that.tempUnsavedConfigId = that.configurationHandler.setConfiguration(configurationObjectForUnsavedConfig);
						that.tempSavedConfigId = that.configurationHandler.setConfiguration(configurationObjectForSavedConfig);
						that.tempSavedConfigId2 = that.configurationHandler.setConfiguration(configurationObjectForSavedConfig2);
						//get ConfigurationEditor
						that.configurationHandler.loadConfiguration(that.tempUnsavedConfigId, function(configurationEditor) {
							that.configurationEditorForUnsavedConfig = configurationEditor;
							that.stubConfigEditorMethods();
							that.createFacetFilters();
							that.categoryIdUnsaved = that.configurationEditorForUnsavedConfig.setCategory(categoryObjForUnsavedConfig);
							that.categoryIdUnsaved2 = that.configurationEditorForUnsavedConfig.setCategory(categoryObjForUnsavedConfig2);
							that.createNavTargets();
							that.createSteps();
							that.createHierarchicalStep();
							that.createRepresentations();
						});
					});
				});
			});
			this.stubConfigEditorMethods = function() {
				that = this;
				//Returns a promise which resolves with list of entity sets given a service
				this.configurationEditorForUnsavedConfig.getAllEntitySetsOfServiceAsPromise = function(serviceRoot) {
					var oDeferred = jQuery.Deferred();
					var entitySets = [];
					var aServices = Object.keys(that.serviceData);
					aServices.forEach(function(service) {
						if (service === serviceRoot) {
							entitySets = Object.keys(that.serviceData[service]);
						}
					});
					/*setTimeout(function() {
						oDeferred.resolve(entitySets);
					}, 3);*/
					oDeferred.resolve(entitySets);
					return oDeferred.promise();
				};
				//Returns a promise which resolves with list of entity types given a service
				this.configurationEditorForUnsavedConfig.getAllEntitySetsExceptParameterEntitySets = function(serviceRoot) {
					var oDeferred = jQuery.Deferred();
					var entitySets = [];
					var aServices = Object.keys(that.serviceDataEntitySets);
					aServices.forEach(function(service) {
						if (service === serviceRoot) {
							entitySets = that.serviceDataEntitySets[service];
						}
					});
					oDeferred.resolve(entitySets);
					return oDeferred.promise();
				};
				this.configurationEditorForUnsavedConfig.getAllServices = function() {
					return that.serviceList;
				};
				//Returns a promise which resolves with all the properties of an entity given service and entity set
				this.configurationEditorForUnsavedConfig.getAllPropertiesOfEntitySetAsPromise = function(serviceRoot, entitySet) {
					var oDeferred = jQuery.Deferred();
					var allProperties = [];
					var aServices = Object.keys(that.serviceData);
					aServices.forEach(function(service) {
						if (service === serviceRoot) {
							var entitySets = Object.keys(that.serviceData[service]);
							entitySets.forEach(function(entity) {
								if (entity === entitySet) {
									allProperties = that.serviceData[service][entity];
								}
							});
						}
					});
					oDeferred.resolve(allProperties);
					return oDeferred.promise();
				};
				this.configurationEditorForUnsavedConfig.getHierarchyNodeIdAsPromise = function(serviceRoot, entitySet, hierarchicalProperty) {
					var oDeferred = jQuery.Deferred();
					var allProperties = [], sHierarchicalProperty;
					var aServices = Object.keys(that.serviceData);
					aServices.forEach(function(service) {
						if (service === serviceRoot) {
							var entitySets = Object.keys(that.serviceData[service]);
							entitySets.forEach(function(entity) {
								if (entity === entitySet) {
									allProperties = that.serviceData[service][entity];
									allProperties.forEach(function(sProperty) {
										if (sProperty.indexOf("non") === -1 && sProperty === hierarchicalProperty) {
											sHierarchicalProperty = sProperty;
										}
									});
								}
							});
						}
					});
					oDeferred.resolve(sHierarchicalProperty);
					return oDeferred.promise();
				};
				this.configurationEditorForUnsavedConfig.getEntityTypeMetadataAsPromise = function(sServiceRoot, entityType) {
					var metadata, oDeferred = jQuery.Deferred();
					oDeferred.resolve({
						meta : "data",
						getPropertyMetadata : function(sPropertyName) {
							if (sPropertyName === "property1" || sPropertyName === "property3") {
								metadata = {
									"aggregation-role" : "dimension",
									"dataType" : {
										"maxLength" : "10",
										"type" : "Edm.String"
									},
									"label" : "Dimension" + sPropertyName, // the label should be differnt for all the properties
									"name" : "Dimension",
									"text" : sPropertyName + "Text"
								};
								return metadata;
							}
							if (sPropertyName === "property1Text") {
								metadata = {
									"aggregation-role" : "dimension",
									"dataType" : {
										"maxLength" : "10",
										"type" : "Edm.String"
									},
									"label" : "Dimension" + sPropertyName, // the label should be differnt for all the properties
									"name" : "Dimension"
								};
								return metadata;
							}
							if (sPropertyName === "property4") {
								metadata = {
									"aggregation-role" : "measure",
									"dataType" : {
										"maxLength" : "10",
										"type" : "Edm.String"
									},
									"name" : "Measure" + sPropertyName
								};
								return metadata;
							}
						}
					});
					return oDeferred.promise();
				};
				this.configurationEditorForUnsavedConfig.getRepresentationTypes = function() {
					return [ {
						"type" : "representationType",
						"id" : "ColumnChart",
						"constructor" : "sap.apf.ui.representations.columnChart",
						"picture" : "sap-icon://bar-chart",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "ColumnChart"
						},
						"metadata" : {
							"dimensions" : {
								"supportedKinds" : [ {
									"kind" : coreConstants.representationMetadata.kind.XAXIS,
									"defaultCount" : 1,
									"max" : "*",
									"min" : "0"
								}, {
									"kind" : coreConstants.representationMetadata.kind.LEGEND,
									"defaultCount" : 0,
									"max" : "*",
									"min" : "0"
								} ]
							},
							"measures" : {
								"supportedKinds" : [ {
									"kind" : coreConstants.representationMetadata.kind.YAXIS,
									"defaultCount" : 1,
									"max" : "*",
									"min" : "1"
								} ]
							}
						}
					}, {
						"type" : "representationType",
						"id" : "BarChart",
						"constructor" : "sap.apf.ui.representations.barChart",
						"picture" : "sap-icon://horizontal-bar-chart",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "BarChart"
						},
						"metadata" : {
							"dimensions" : {
								"supportedKinds" : [ {
									"kind" : coreConstants.representationMetadata.kind.XAXIS,
									"defaultCount" : 1,
									"max" : "*",
									"min" : "0"
								}, {
									"kind" : coreConstants.representationMetadata.kind.LEGEND,
									"defaultCount" : 0,
									"max" : "*",
									"min" : "0"
								} ]
							},
							"measures" : {
								"supportedKinds" : [ {
									"kind" : coreConstants.representationMetadata.kind.YAXIS,
									"defaultCount" : 1,
									"max" : "*",
									"min" : "1"
								} ]
							}
						}
					}, {
						"type" : "representationType",
						"id" : "BubbleChart",
						"constructor" : "sap.apf.ui.representations.bubbleChart",
						"picture" : "sap-icon://bubble-chart",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "BubbleChart"
						},
						"metadata" : {
							"dimensions" : {
								"supportedKinds" : [ {
									"kind" : coreConstants.representationMetadata.kind.REGIONCOLOR,
									"defaultCount" : 0,
									"max" : "*",
									"min" : "0"
								}, {
									"kind" : coreConstants.representationMetadata.kind.REGIONSHAPE,
									"defaultCount" : 0,
									"max" : "*",
									"min" : "0"
								} ]
							},
							"measures" : {
								"supportedKinds" : [ {
									"kind" : coreConstants.representationMetadata.kind.XAXIS,
									"defaultCount" : 1,
									"max" : "1",
									"min" : "1"
								}, {
									"kind" : coreConstants.representationMetadata.kind.YAXIS,
									"defaultCount" : 1,
									"max" : "1",
									"min" : "1"
								}, {
									"kind" : coreConstants.representationMetadata.kind.BUBBLEWIDTH,
									"defaultCount" : 1,
									"max" : "1",
									"min" : "1"
								} ]
							}
						}
					}, {
						"type" : "representationType",
						"id" : "PieChart",
						"constructor" : "sap.apf.ui.representations.pieChart",
						"picture" : "sap-icon://pie-chart",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "PieChart"
						},
						"metadata" : {
							"dimensions" : {
								"supportedKinds" : [ {
									"kind" : coreConstants.representationMetadata.kind.SECTORCOLOR,
									"defaultCount" : 1,
									"max" : "*",
									"min" : "0"
								} ]
							},
							"measures" : {
								"supportedKinds" : [ {
									"kind" : coreConstants.representationMetadata.kind.SECTORSIZE,
									"defaultCount" : 1,
									"max" : "1",
									"min" : "1"
								} ]
							}
						}
					}, {
						"type" : "representationType",
						"id" : "TableRepresentation",
						"constructor" : "sap.apf.ui.representations.table",
						"picture" : "sap-icon://table-chart",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "TableRepresentation"
						},
						"metadata" : {
							"properties" : {
								"supportedKinds" : [ {
									"kind" : coreConstants.representationMetadata.kind.COLUMN,
									"defaultCount" : 1,
									"max" : "*",
									"min" : "1"
								} ]
							}
						}
					} ];
				};
				//Returns a promise which resolves with all entity sets of service that have the given set of properties as filterable properties.- Used for filtermapping in step
				this.configurationEditorForUnsavedConfig.getAllEntitySetsOfServiceWithGivenPropertiesAsPromise = function(serviceRoot, properties) {
					var oDeferred = jQuery.Deferred();
					var entitySets = [];
					var counter;
					var length = properties.length;
					var allEntitySets = [];
					var aServices = Object.keys(that.serviceData);
					if (length === 0) {
						that.configurationEditorForUnsavedConfig.getAllEntitySetsOfServiceAsPromise(serviceRoot).done(function(aEntity) {
							entitySets = aEntity;
						});
						oDeferred.resolve(entitySets);
					}
					aServices.forEach(function(service) {
						var allProperties;
						if (service === serviceRoot) {
							that.configurationEditorForUnsavedConfig.getAllEntitySetsOfServiceAsPromise(serviceRoot).done(function(aEntity) {
								entitySets = aEntity;
							});
							entitySets.forEach(function(entitySet) {
								counter = 0;
								that.configurationEditorForUnsavedConfig.getAllPropertiesOfEntitySetAsPromise(serviceRoot, entitySet).done(function(aProp) {
									allProperties = aProp;
								});
								allProperties.forEach(function(propertyForEntity) {
									properties.forEach(function(property) {
										if (propertyForEntity === property) {
											counter++;
										}
									});
								});
								if (counter === length) {
									allEntitySets.push(entitySet);
								}
							});
						}
					});
					oDeferred.resolve(allEntitySets);
					return oDeferred.promise();
				};
				this.configurationEditorForUnsavedConfig.registerServiceAsPromise = function(serviceRoot) {
					var oDeferred = jQuery.Deferred(), bRegistered;
					that.serviceList.forEach(function(service) {
						if (serviceRoot === service) {
							bRegistered = true;
						}
					});
					oDeferred.resolve(bRegistered);
					return oDeferred.promise();
				};
				this.configurationEditorForUnsavedConfig.getFilterablePropertiesAndParametersAsPromise = function() {
					var oDeferred = jQuery.Deferred();
					var aAllKnownProperties = [ "property1", "property2", "property3", "property4" ];
					oDeferred.resolve(aAllKnownProperties);
					return oDeferred.promise();
				};
				this.configurationHandler.loadConfiguration(that.tempSavedConfigId, function(configurationEditor) {
					that.configurationEditorForSavedConfig = configurationEditor;
					that.configurationEditorForSavedConfig.setFilterOption({
						smartFilterBar : true
					});
				});
				this.configurationHandler.loadConfiguration(that.tempSavedConfigId2, function(configurationEditor) {
					that.configurationEditorForSavedConfig2 = configurationEditor;
				});
				this.configurationEditorForSavedConfig.save(function(id, metadata, messageObject) {
					if (messageObject === undefined) {
						that.configIdSaved = id;
						that.configurationEditorForSavedConfig2.save(function(id2, metadata, messageObject) {
							if (messageObject === undefined) {
								that.configIdSaved2 = id2;
								oModelerInstanceDeferred.resolve(that);//Deferred object is resolved with the modeler instance once the modeler callbacks are complete
							}
						});
					}
				});
				this.configurationEditorForUnsavedConfig.getAllHierarchicalEntitySetsOfServiceAsPromise = function(serviceRoot) {
					var oDeferred = jQuery.Deferred();
					var entitySets = [];
					var aServices = Object.keys(that.serviceData);
					aServices.forEach(function(service) {
						if (service === serviceRoot) {
							entitySets = Object.keys(that.serviceData[service]);
						}
					});
					oDeferred.resolve(entitySets);
					return oDeferred.promise();
				};
				this.configurationEditorForUnsavedConfig.getHierarchicalPropertiesOfEntitySetAsPromise = function(serviceRoot, entitySet) {
					var oDeferred = jQuery.Deferred();
					var allProperties = [], allHierarchicalProperties = [];
					var aServices = Object.keys(that.serviceData);
					aServices.forEach(function(service) {
						if (service === serviceRoot) {
							var entitySets = Object.keys(that.serviceData[service]);
							entitySets.forEach(function(entity) {
								if (entity === entitySet) {
									allProperties = that.serviceData[service][entity];
									allProperties.forEach(function(sProperty) {
										if (sProperty.indexOf("non") === -1) {
											allHierarchicalProperties.push(sProperty);
										}
									});
								}
							});
						}
					});
					setTimeout(function() {
						oDeferred.resolve(allHierarchicalProperties);
					}, 1);
					return oDeferred.promise();
				};
				this.configurationEditorForUnsavedConfig.getNonHierarchicalPropertiesOfEntitySet = function(serviceRoot, entitySet) {
					var oDeferred = jQuery.Deferred();
					var allProperties = [], allNonHierarchicalProperties = [];
					var aServices = Object.keys(that.serviceData);
					aServices.forEach(function(service) {
						if (service === serviceRoot) {
							var entitySets = Object.keys(that.serviceData[service]);
							entitySets.forEach(function(entity) {
								if (entity === entitySet) {
									allProperties = that.serviceData[service][entity];
									allProperties.forEach(function(sProperty) {
										if (sProperty.indexOf("non") !== -1) {
											allNonHierarchicalProperties.push(sProperty);
										}
									});
								}
							});
						}
					});
					oDeferred.resolve(allNonHierarchicalProperties);
					return oDeferred.promise();
				};
				this.configurationHandler.getTextPool().setTextAsPromise = function(sTitle) {
					return apfUtils.createPromise(sTitle);
				};
				this.configurationHandler.getTextPool().get = function(key) {
					return {
						TextElementDescription : key
					};
				};
				this.configurationHandler.getTextPool().getTextsByTypeAndLength = function(sTextElementType, nMaxLength) {
					return [ {
						TextElement : "12345678",
						TextElementDescription : "TIME"
					}, {
						TextElement : "87654321",
						TextElementDescription : "CUSTOMER"
					} ];
				};
			};
			this.configListViewInstance = function() {
				var getController = function() {
					return {
						"updateSelectedNode" : function(configInfo) {
							//update text on tree node
						},
						"updateConfigTree" : function() {
							//change category for a step
						},
						"updateTree" : function() {
							//prepares tree model
						},
						"updateTitleAndBreadCrumb" : function() {
							//updates title and bread crumb
						},
						"getNavigationTargetName" : function(id) {
							//gets the text for a given nav target id
						},
						"setNavigationTargetName" : function() {
							//sets the text for a given nav target id
						}
					};
				};
				return getController;
			};
			this.updateSelectedNode = function(configInfo) {
				//update text on tree node
			};
			this.updateConfigTree = function() {
				//change category for a step
			};
			this.updateTree = function() {
				//prepares tree model
			};
			this.updateTitleAndBreadCrumb = function() {
				//updates title and bread crumb
			};
			this.getNavigationTargetName = function() {
				var navTargetTextDeferred = new jQuery.Deferred();
				navTargetTextDeferred.resolve("text");
				var navTargetTextPromise = navTargetTextDeferred.promise();
				return navTargetTextPromise;
			};
			this.setNavigationTargetName = function() {
			};
			this.removeAllSelectProperties = function(step) {
				var selectProp = step.getSelectProperties();
				selectProp.forEach(function(property) {
					step.removeSelectProperty(property);
				});
			};
			this.removeFilterProperties = function(step) {
				var filterProp = step.getFilterProperties();
				filterProp.forEach(function(property) {
					step.removeFilterProperty(property);
				});
			};
			this.removeFilterMappingTargetProperties = function(step) {
				var filterMappingSelectProp = step.getFilterMappingTargetProperties();
				filterMappingSelectProp.forEach(function(property) {
					step.removeFilterMappingTargetProperty(property);
				});
			};
			this.setPropertiesForHierarchicalStep = function() {
				this.firstHierarchicalStep.setTitleId("Hierarchical Step");
				this.firstHierarchicalStep.setLongTitleId("Hierarchical Step long title");
				this.firstHierarchicalStep.setService("hierarchicalService1");
				this.firstHierarchicalStep.setEntitySet("hierarchicalEntitySet1");
				this.firstHierarchicalStep.setHierarchyProperty("hierarchicalproperty1");
				this.removeAllSelectProperties(this.firstHierarchicalStep);
				this.firstHierarchicalStep.addSelectProperty("nonHierarchicalproperty1");
				this.firstHierarchicalStep.addSelectProperty("nonHierarchicalproperty2");
				this.hierarchicalStepWithFilter.setTitleId("Hierarchical Step With required property");
				this.hierarchicalStepWithFilter.setLongTitleId("Hierarchical Step long title With required property");
				this.hierarchicalStepWithFilter.setService("hierarchicalService1");
				this.hierarchicalStepWithFilter.setEntitySet("hierarchicalEntitySet1");
				this.hierarchicalStepWithFilter.setHierarchyProperty("hierarchicalproperty1");
				this.removeAllSelectProperties(this.hierarchicalStepWithFilter);
				this.hierarchicalStepWithFilter.addSelectProperty("nonHierarchicalproperty1");
				this.hierarchicalStepWithFilter.addSelectProperty("nonHierarchicalproperty2");
				this.removeFilterProperties(this.hierarchicalStepWithFilter);
				this.hierarchicalStepWithFilter.addFilterProperty("hierarchicalproperty1");
				this.hierarchicalStepWithFilterForNotAvailable.setTitleId("Hierarchical Step With not available property");
				this.hierarchicalStepWithFilterForNotAvailable.setLongTitleId("Hierarchical Step With not available property");
				this.hierarchicalStepWithFilterForNotAvailable.setService("hierarchicalService1");
				this.hierarchicalStepWithFilterForNotAvailable.setService("hierarchicalService1");
				this.hierarchicalStepWithFilterForNotAvailable.setEntitySet("hierarchicalEntitySet1");
				this.hierarchicalStepWithFilterForNotAvailable.setHierarchyProperty("hierarchicalproperty1");
				this.removeAllSelectProperties(this.hierarchicalStepWithFilterForNotAvailable);
				this.hierarchicalStepWithFilterForNotAvailable.addSelectProperty("nonHierarchicalproperty1");
				this.hierarchicalStepWithFilterForNotAvailable.addSelectProperty("nonHierarchicalproperty2");
				this.removeFilterProperties(this.hierarchicalStepWithFilterForNotAvailable);
				this.hierarchicalStepWithFilterForNotAvailable.addFilterProperty("hierarchicalproperty1");
			};
			this.setPropertiesForUnsavedStepWithoutFilterMapping = function() {
				//First unsaved step - without filter mapping
				this.unsavedStepWithoutFilterMapping.setTitleId("step A");
				this.unsavedStepWithoutFilterMapping.setLongTitleId("step A long title");
				this.unsavedStepWithoutFilterMapping.setService("testService1");
				this.unsavedStepWithoutFilterMapping.setEntitySet("entitySet1");
				this.removeAllSelectProperties(this.unsavedStepWithoutFilterMapping);
				this.unsavedStepWithoutFilterMapping.addSelectProperty("property1");
				this.unsavedStepWithoutFilterMapping.addSelectProperty("property3");
				this.unsavedStepWithoutFilterMapping.setTopNValue(100);
				this.unsavedStepWithoutFilterMapping.setTopNSortProperties([ {
					property : "property3",
					ascending : true
				} ]);
				this.removeFilterProperties(this.unsavedStepWithoutFilterMapping);
				this.unsavedStepWithoutFilterMapping.addFilterProperty("property3");
				this.unsavedStepWithoutFilterMapping.setRightUpperCornerTextKey("Right top corner");
				this.unsavedStepWithoutFilterMapping.setLeftLowerCornerTextKey("Left bottom corner");
				this.unsavedStepWithoutFilterMapping.setRightLowerCornerTextKey("Right bottom corner");
			};
			this.setPropertiesForUnsavedStepWithFilterMapping = function() {
				//Second unsaved step - with filter mapping
				this.unsavedStepWithFilterMapping.setTitleId("step B");
				this.unsavedStepWithFilterMapping.setService("testService1");
				this.unsavedStepWithFilterMapping.setEntitySet("entitySet1");
				this.removeAllSelectProperties(this.unsavedStepWithFilterMapping);
				this.unsavedStepWithFilterMapping.addSelectProperty("property1");
				this.unsavedStepWithFilterMapping.addSelectProperty("property3");
				this.unsavedStepWithFilterMapping.addSelectProperty("property4");
				this.unsavedStepWithFilterMapping.addSelectProperty("property1Text");
				this.removeFilterProperties(this.unsavedStepWithFilterMapping);
				this.unsavedStepWithFilterMapping.addFilterProperty("property1");
				this.unsavedStepWithFilterMapping.setFilterMappingService("testService4");
				this.unsavedStepWithFilterMapping.setFilterMappingEntitySet("entitySet10");
				this.removeFilterMappingTargetProperties(this.unsavedStepWithFilterMapping);
				this.unsavedStepWithFilterMapping.addFilterMappingTargetProperty("property1");
				this.unsavedStepWithFilterMapping.setFilterMappingKeepSource(true);
				this.unsavedStepWithFilterMapping.addNavigationTarget(this.secondNavigationTargetId);
			};
			this.createSteps = function() {
				this.stepIdUnsavedWithoutFilterMapping = this.configurationEditorForUnsavedConfig.createStep(this.categoryIdUnsaved);
				this.unsavedStepWithoutFilterMapping = this.configurationEditorForUnsavedConfig.getStep(this.stepIdUnsavedWithoutFilterMapping);
				this.setPropertiesForUnsavedStepWithoutFilterMapping();
				this.stepIdUnsavedWithFilterMapping = this.configurationEditorForUnsavedConfig.createStep(this.categoryIdUnsaved);
				this.unsavedStepWithFilterMapping = this.configurationEditorForUnsavedConfig.getStep(this.stepIdUnsavedWithFilterMapping);
				this.setPropertiesForUnsavedStepWithFilterMapping();
				this.configurationEditorForUnsavedConfig.addCategoryStepAssignment(this.categoryIdUnsaved2, this.stepIdUnsavedWithFilterMapping);
			};
			this.createRepresentations = function() {
				this.firstRepresentationIdUnsaved = this.unsavedStepWithoutFilterMapping.createRepresentation().getId();
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setRepresentationType("ColumnChart");
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addDimension("property1");// default label
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addDimension("property2", "dimension2"); // manual label
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setDimensionKind("property2", coreConstants.representationMetadata.kind.XAXIS);
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setDimensionTextLabelKey("property2", "dimension2"); //set the label for the dimension
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addDimension("property3");//default label
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setDimensionKind("property3", coreConstants.representationMetadata.kind.LEGEND);
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].addMeasure("property4");
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setMeasureKind("property4", coreConstants.representationMetadata.kind.YAXIS);
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setLeftUpperCornerTextKey("Left top corner from rep");
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setRightUpperCornerTextKey("Right top corner from rep");
				this.unsavedStepWithoutFilterMapping.getRepresentations()[0].setLeftLowerCornerTextKey("Left bottom corner from rep");
				this.secondRepresentationIdUnsaved = this.unsavedStepWithoutFilterMapping.createRepresentation().getId();
				this.unsavedStepWithoutFilterMapping.getRepresentations()[1].setRepresentationType("PieChart");
				this.unsavedStepWithoutFilterMapping.getRepresentations()[1].addDimension("property2");//default label
				this.unsavedStepWithoutFilterMapping.getRepresentations()[1].setLabelDisplayOption("property2", "keyAndText");
				this.thirdRepresentationIdUnsaved = this.unsavedStepWithoutFilterMapping.createRepresentation().getId();
				this.unsavedStepWithoutFilterMapping.getRepresentations()[2].setRepresentationType("TableRepresentation");
				this.unsavedStepWithoutFilterMapping.getRepresentations()[2].addProperty("property1");
				this.sixthRepresentationIdUnsaved = this.unsavedStepWithoutFilterMapping.createRepresentation().getId(); //to test compatibility of table representation for old configuration
				this.unsavedStepWithoutFilterMapping.getRepresentations()[3].setRepresentationType("TableRepresentation");
				this.unsavedStepWithoutFilterMapping.getRepresentations()[3].addProperty("property2");
				this.unsavedStepWithoutFilterMapping.getRepresentations()[3].addProperty("property4");
				this.unsavedStepWithoutFilterMapping.getRepresentations()[3].addOrderbySpec("property4", "ascending");
				this.forthRepresentationIdUnsaved = this.unsavedStepWithFilterMapping.createRepresentation().getId();
				this.unsavedStepWithFilterMapping.getRepresentations()[0].setRepresentationType("BarChart");
				this.unsavedStepWithFilterMapping.getRepresentations()[0].addDimension("property1");
				this.unsavedStepWithFilterMapping.getRepresentations()[0].addMeasure("property4");
				this.unsavedStepWithFilterMapping.getRepresentations()[0].addOrderbySpec("property4", "ascending");
				this.fifthRepresentationIdUnsaved = this.unsavedStepWithFilterMapping.createRepresentation().getId();
				this.unsavedStepWithFilterMapping.getRepresentations()[1].setRepresentationType("BubbleChart");
				this.firstHierarchicalRepresentation = this.firstHierarchicalStep.createRepresentation().getId();
				this.firstHierarchicalStep.getRepresentations()[0].setRepresentationType("TreeTableRepresentation");
				this.firstHierarchicalStep.getRepresentations()[0].addProperty("property2", "hierarchical property");
				this.firstHierarchicalStep.getRepresentations()[0].setHierarchyPropertyLabelDisplayOption("text");
				this.secondHierarchicalRepresentation = this.firstHierarchicalStep.createRepresentation().getId();
				this.firstHierarchicalStep.getRepresentations()[1].setRepresentationType("TreeTableRepresentation");
				this.firstHierarchicalStep.getRepresentations()[1].addProperty("property2", "hierarchical property");
				this.thirdHierarchicalRepresentation = this.firstHierarchicalStep.createRepresentation().getId();
				this.firstHierarchicalStep.getRepresentations()[2].setRepresentationType("TreeTableRepresentation");
				this.firstHierarchicalStep.getRepresentations()[2].addProperty("property3", "hierarchical property");
				this.firstHierarchicalStep.getRepresentations()[2].setHierarchyPropertyLabelDisplayOption("key");
			};
			this.createHierarchicalStep = function() {
				this.firstHierarchicalStepId = this.configurationEditorForUnsavedConfig.createHierarchicalStep(this.categoryIdUnsaved);
				this.firstHierarchicalStep = this.configurationEditorForUnsavedConfig.getStep(this.firstHierarchicalStepId);
				this.hierarchicalStepWithFilterId = this.configurationEditorForUnsavedConfig.createHierarchicalStep(this.categoryIdUnsaved);
				this.hierarchicalStepWithFilter = this.configurationEditorForUnsavedConfig.getStep(this.hierarchicalStepWithFilterId);
				this.hierarchicalStepWithFilterForNotAvailableId = this.configurationEditorForUnsavedConfig.createHierarchicalStep(this.categoryIdUnsaved);
				this.hierarchicalStepWithFilterForNotAvailable = this.configurationEditorForUnsavedConfig.getStep(this.hierarchicalStepWithFilterForNotAvailableId);
				this.setPropertiesForHierarchicalStep();
			};
			this.createNavTargets = function() {
				this.firstNavigationTargetId = this.configurationEditorForUnsavedConfig.createNavigationTarget(); //Global navigation target
				this.firstNavigationtarget = this.configurationEditorForUnsavedConfig.getNavigationTarget(this.firstNavigationTargetId);
				this.firstNavigationtarget.setSemanticObject("FioriApplication");
				this.firstNavigationtarget.setAction("executeAPFConfiguration");
				this.firstNavigationtarget.setGlobal();
				this.firstNavigationtarget.setFilterMappingService("testService1");
				this.firstNavigationtarget.setFilterMappingEntitySet("entitySet1");
				this.firstNavigationtarget.addFilterMappingTargetProperty("property1");
				this.firstNavigationtarget.addFilterMappingTargetProperty("property3");
				this.secondNavigationTargetId = this.configurationEditorForUnsavedConfig.createNavigationTarget(); //Assigned to step with filter mapping
				this.secondNavigationtarget = this.configurationEditorForUnsavedConfig.getNavigationTarget(this.secondNavigationTargetId);
				this.secondNavigationtarget.setSemanticObject("UserInputSemanticObject");
				this.secondNavigationtarget.setAction("UserAction");
				this.secondNavigationtarget.setStepSpecific();
				this.thirdNavigationTargetId = this.configurationEditorForUnsavedConfig.createNavigationTarget(); //Unassigned to any of the steps
				this.thirdNavigationtarget = this.configurationEditorForUnsavedConfig.getNavigationTarget(this.thirdNavigationTargetId);
				this.thirdNavigationtarget.setSemanticObject("UserInputSemanticObject1");
				this.thirdNavigationtarget.setAction("UserAction1");
				this.thirdNavigationtarget.setStepSpecific();
				this.fourthNavigationTargetId = this.configurationEditorForUnsavedConfig.createNavigationTarget(); //Unassigned to any of the steps
				this.fourthNavigationtarget = this.configurationEditorForUnsavedConfig.getNavigationTarget(this.fourthNavigationTargetId);
				this.fourthNavigationtarget.setSemanticObject("UserInputSemanticObject1");
				this.fourthNavigationtarget.setAction("UserAction1");
				this.fourthNavigationtarget.addNavigationParameter("key1", "value1");
				this.fourthNavigationtarget.addNavigationParameter("key2", "value2");
				this.fourthNavigationtarget.setStepSpecific();
			};
			this.createFacetFilters = function() {
				this.configurationEditorForUnsavedConfig.setFilterOption({
					facetFilter : true
				});
				this.facetFilterIdUnsaved = this.configurationEditorForUnsavedConfig.createFacetFilter();
				this.facetFilterUnsaved = this.configurationEditorForUnsavedConfig.getFacetFilter(this.facetFilterIdUnsaved);
				this.facetFilterIdUnsaved2 = this.configurationEditorForUnsavedConfig.createFacetFilter();
				this.facetFilterUnsaved2 = this.configurationEditorForUnsavedConfig.getFacetFilter(this.facetFilterIdUnsaved2);
				this.facetFilterUnsaved.setLabelKey("label1");
				this.facetFilterUnsaved.setMultiSelection(true);
				this.facetFilterUnsaved.setVisible(true);
				this.facetFilterUnsaved.setProperty("property2");
				this.facetFilterUnsaved.setAlias("property3");
				this.facetFilterUnsaved.setPreselectionDefaults([ "1000", "2000" ]);
				this.facetFilterUnsaved.setServiceOfValueHelp("testService1");
				this.facetFilterUnsaved.setEntitySetOfValueHelp("entitySet1");
				this.facetFilterUnsaved.addSelectPropertyOfValueHelp("property1");
				this.facetFilterUnsaved.addSelectPropertyOfValueHelp("property3");
				this.facetFilterUnsaved.setUseSameRequestForValueHelpAndFilterResolution(true);
				this.facetFilterUnsaved2.setLabelKey("label1");
				this.facetFilterUnsaved2.setProperty("property2");
				this.facetFilterUnsaved2.setVisible(true);
			};
			this.deleteObjects = function() {
				this.configurationEditorForUnsavedConfig.removeFacetFilter(this.facetFilterUnsaved);
				this.configurationEditorForUnsavedConfig.removeFacetFilter(this.facetFilterUnsaved2);
				this.configurationEditorForUnsavedConfig.removeNavigationTarget(this.firstNavigationTargetId);
				this.configurationEditorForUnsavedConfig.removeNavigationTarget(this.secondNavigationTargetId);
				this.configurationEditorForUnsavedConfig.getStep(this.stepIdUnsavedWithoutFilterMapping).removeRepresentation(this.firstRepresentationIdUnsaved);
				this.configurationEditorForUnsavedConfig.getStep(this.stepIdUnsavedWithoutFilterMapping).removeRepresentation(this.secondRepresentationIdUnsaved);
				this.configurationEditorForUnsavedConfig.getStep(this.stepIdUnsavedWithoutFilterMapping).removeRepresentation(this.thirdRepresentationIdUnsaved);
				this.configurationEditorForUnsavedConfig.getStep(this.stepIdUnsavedWithFilterMapping).removeRepresentation(this.forthRepresentationIdUnsaved);
				this.configurationEditorForUnsavedConfig.getStep(this.stepIdUnsavedWithFilterMapping).removeRepresentation(this.fifthRepresentationIdUnsaved);
				this.configurationEditorForUnsavedConfig.removeCategoryStepAssignment(this.categoryIdUnsaved, this.stepIdUnsavedWithoutFilterMapping);
				this.configurationEditorForUnsavedConfig.removeCategoryStepAssignment(this.categoryIdUnsaved, this.stepIdUnsavedWithFilterMapping);
				this.configurationEditorForUnsavedConfig.removeCategoryStepAssignment(this.categoryIdUnsaved2, this.stepIdUnsavedWithFilterMapping);
			};
			this.reset = function() {
				that.deleteObjects();
				that.createNavTargets();
				that.createSteps();
				that.createRepresentations();
				that.createFacetFilters();
			};
		},
		getModelerInstance: function(fnCallback) {
			oModelerInstanceDeferred.then(function(modelerInstance) {//Once the modeler callbacks are done callback to q unit setup to start the tests
				fnCallback(modelerInstance);
			});
		},
		destroyModelerInstance : function() {
			mockServerWrapper.deactivate();
		}
	};//module

	module.getInstance();

	/*BEGIN_COMPATIBILITY*/
	sap.apf.testhelper.modelerUIHelper = module;
	/*END_COMPATIBILITY*/
	return module;
}, true /* global_export*/);
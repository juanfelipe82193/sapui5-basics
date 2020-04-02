/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery */

sap.ui.define( [
	'sap/ui/core/util/MockServer',
	'sap/apf/utils/utils',
	'sap/apf/utils/parseTextPropertyFile'
], function(UI5MockServer, ApfUtils) {
	'use strict';

	jQuery.sap.require("jquery.sap.storage");

	var Storage = jQuery.sap.storage;
	return creator;

	/**
	 * Creates a module with factory methods for creating mockServer instances.
	 * @param {string} base it is the relative path from the origin (location) to the location of sap/apf/demokit.
	 */
	function creator(base) {
		var mockServers = [];
		var localStorage = Storage(Storage.Type.session);
		var self = {
			setupConstants: function (_base) {
				this.constants = {
					LOCAL_STORAGE_CONFIGURATION: "ApfConfiguration",
					LOCAL_STORAGE_TEXTS: "ApfTexts",
					CONFIGURATION_ENTITYSET: "AnalyticalConfigurationQueryResults",
					TEXTS_ENTITYSET: "TextElementQueryResults",
					// runtime service
					RUNTIME_DATA_PATH: _base + "model/apf/",
					RUNTIME_SERVICE_URL: "/sap/hba/r/apf/core/odata/apf.xsodata/",
					RUNTIME_SERVICE_METADATA: _base + "model/apf/AnalysisPath.xml",
					PATH_ENTITYSET: "AnalysisPathQueryResults",
					// modeler service CRUD
					MODELER_DATA_PATH: _base + "model/apf/",
					CONFIGURATION_SERVICE: "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata/",
					CONFIGURATION_SERVICE_METADATA: _base + "model/apf/AnalyticalConfiguration.xml",
				// data services
					DEMOKIT_SERVICE_URL: "/tmp/demokit/demokit.xsodata/",
					DEMOKIT_METADATA: _base + "model/data/Demokit.xml",
					DEMOKIT_DATA_PATH: _base + "model/data/",
					DEMOKIT_HIERARCHY_SERVICE_URL: "/tmp/demokit/hierarchy.xsodata/",
					DEMOKIT_HIERARCHY_METADATA: _base + "model/data/hierarchyMetadata.xml",
					HIERARCHY_SERVICE_SPEC: {
						levelProperty: "Customer_Level",
						hierarchyNode: "Customer_NodeID",
						parentNode: "Customer_ParentID",
						measureName: "Revenue"
					}
				};
			},
			teardownMockserver: function () {
				mockServers.forEach(function (_mockserver) {
					_mockserver.stop();
					_mockserver.destroy();
				});
			},
			_getStorage: function(){
				return localStorage;
			},
			getConfigurationId: function (name) {
				var id;
				var index = name.indexOf(self.constants.LOCAL_STORAGE_CONFIGURATION);
				if (index !== -1) {
					id = name.slice(index + self.constants.LOCAL_STORAGE_CONFIGURATION.length);
				}
				return id;
			},
			getAllConfigurationIdsInStorage: function () {
				var ids = [];
				Object.keys(sessionStorage).forEach(function (name) {
					var id = self.getConfigurationId(name);
					if (id) {
						ids.push(id);
					}
				});
				return ids;
			},
			getConfigurationFromLocalStorage: function (configId) {
				return localStorage.get(self.constants.LOCAL_STORAGE_CONFIGURATION + configId);
			},
			idIsContained: function (entitySet, id) {
				return entitySet.reduce(function (accumulator, oConfiguration) {
					return accumulator || oConfiguration.AnalyticalConfiguration === id;
				}, false);
			},
			importTextsFromFile : function(filePath, modelerService, optionalCallback) {
				optionalCallback = optionalCallback || function() {};

				jQuery.ajax({
					url: filePath,
					method: "GET",
					dataType: "text"
				}).done(function (data){
					var textFileInformation = sap.apf.utils.parseTextPropertyFile(data, {
							instances : {
								messageHandler : function() {}
							}
					});
					var entitySet = [];
					textFileInformation.TextElements.forEach(function (item) {
						entitySet.push(item);
					});
					modelerService.setEntitySetData( self.constants.TEXTS_ENTITYSET, entitySet);
					optionalCallback(entitySet);
				}).fail(function (jqXHR, textStatus, errorThrown) {
					var errorText = "while importing \"" + filePath + "\" jQuery.ajax fails with " + textStatus + ",  " + errorThrown;
					jQuery.sap.log.error( errorThrown);
					optionalCallback({ errorText: errorText, filePath: filePath });
				});
			},
			/**
			 * Mocks the analytical data service.
			 * Provisions simple aggregation which the mock server does not support.
			 *
			 * @returns {sap.ui.core.util.MockServer} serviceMockServer
			 */
			mockDemokitService: function () {
				//Demokit Service
				var serviceMockServer = new sap.ui.core.util.MockServer({
					rootUri: self.constants.DEMOKIT_SERVICE_URL
				});
				serviceMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.GET, self._postProcessDemokitData);
				serviceMockServer.simulate(self.constants.DEMOKIT_METADATA, self.constants.DEMOKIT_DATA_PATH);
				serviceMockServer.start();
				mockServers.push(serviceMockServer);
				return serviceMockServer;
			},
			/**
			 * Configurations (BLOB) are fetched from session storage which itself loaded initially from static resources.
			 */
			_loadAnalyticalConfiguration: function(requestObject) { // not required when initially all configurations are load into mockServer!
				// Get the configuration from session storage and set it in oConfigRow.
				function replaceSerializedConfiguration(oConfigRow) {
					//determine configurationID
					var configId = oConfigRow.AnalyticalConfiguration;
					oConfigRow.SerializedAnalyticalConfiguration = self.getConfigurationFromLocalStorage(configId);
					oConfigRow.AnalyticalConfigurationName = JSON.parse(oConfigRow.SerializedAnalyticalConfiguration).analyticalConfigurationName;
				}
				var oConfigRow = requestObject.mParameters.oEntry;
				if (oConfigRow) {//only 1 configuration requested
					if(oConfigRow.SerializedAnalyticalConfiguration && oConfigRow.AnalyticalConfigurationName) {
						replaceSerializedConfiguration(oConfigRow);
					}
				} else if (jQuery.isArray(requestObject.mParameters.oFilteredData.results)) {
					/** The GET entitySet is never used to read the property SerializedAnalyticalConfiguration, thus a replacement is not strictly required.
					 * Accordingly, it is required that file AnalyticalConfigurationQueryResults.json is consistent (GUIDs, names).
					 */
					var oEntitySet = requestObject.mParameters.oFilteredData.results;
					oEntitySet.forEach(function (oConfigRow) {
						replaceSerializedConfiguration(oConfigRow);
					});
				}
			},
			/**
			 * Loading configurations from session storage, overriding existing ones, also overriding static resources.
			 * Load configurations loaded from static resources to mockServer.
			 * Load each one also into session storage unless it is already contained in session storage.
			 * By construction the static JSON resources shall be already loaded.
			 * Thus, they can be directly loaded into the MockServer. The previous entitySet in the MockServer is completely overwritten.
			 */
			_initialLoadConfigurationsToMockServer: function (mockServer, configurationList) {
				function iterateMemberValues(_object, _fun){
					for (var member in _object){
						if (_object.hasOwnProperty(member)){
							_fun(_object[member]);
						}
					}
				}
				var resultSet = [];
				// order is important: first copy from session storage, then static resources
				self.getAllConfigurationIdsInStorage().forEach(function (id) {
					var raw = self.getConfigurationFromLocalStorage(id);
					var oConfiguration = JSON.parse(raw);
					copyToMockServer(oConfiguration);
				});
				iterateMemberValues(configurationList, copyToMockServer);
				iterateMemberValues(configurationList, copyToSessionStorage);
				mockServer.setEntitySetData("AnalyticalConfigurationQueryResults", resultSet);

				function copyToSessionStorage(oConfiguration) {
					var configId = oConfiguration.configHeader.AnalyticalConfiguration;
					if (!self.getConfigurationFromLocalStorage(configId)) {
						var raw = JSON.stringify(oConfiguration);
						localStorage.put(self.constants.LOCAL_STORAGE_CONFIGURATION + configId, raw);
					}
				}

				function copyToMockServer(oConfiguration) {
					var id = oConfiguration.configHeader.AnalyticalConfiguration;
					if (self.idIsContained(resultSet, id)) {
						return;
					}
					var raw = JSON.stringify(oConfiguration);
					var row = {
						AnalyticalConfiguration: id,
						Application: oConfiguration.configHeader.Application,
						AnalyticalConfigurationName: oConfiguration.configHeader.AnalyticalConfigurationName,
						SerializedAnalyticalConfiguration: raw,
						CreationUTCDateTime: "/Date(1478533989544)/",
						LastChangeUTCDateTime: "/Date(1478533989544)/",
						CreatedByUser: "demokit engine",
						LastChangedByUser: null
					};
					resultSet.push(row);
				}
			},
			// generates GUID and change dates when necessary
			savePath: function(requestObject) {
				var sBody = requestObject.mParameters.oXhr.requestBody;
				var oBody = JSON.parse(sBody);
				if (!oBody.AnalysisPath) {
					oBody.AnalysisPath = sap.apf.utils.createPseudoGuid();
				}
				if (!oBody.CreationUTCDateTime) {
					oBody.CreationUTCDateTime = "/Date(" + new Date().getTime() + ")/";
				}
				if (!oBody.LastChangeUTCDateTime) {
					oBody.LastChangeUTCDateTime = "/Date(" + new Date().getTime() + ")/";
				}
				requestObject.mParameters.oXhr.requestBody = JSON.stringify(oBody);
			},

			/** MockServer instance for the APF runtime service (CRUD on path, read-only on configuration)
			 *
			 * @param configurationList
			 * @returns {sap.ui.core.util.MockServer} mockRuntimeServer
			 */
			mockRuntimeService: function (configurationList) {
				var mockRuntimeServer = new UI5MockServer({
					rootUri: self.constants.RUNTIME_SERVICE_URL
				});
				mockRuntimeServer.attachBefore(sap.ui.core.util.MockServer.HTTPMETHOD.PUT, self.savePath, self.constants.PATH_ENTITYSET);
				mockRuntimeServer.attachBefore(sap.ui.core.util.MockServer.HTTPMETHOD.POST, self.savePath, self.constants.PATH_ENTITYSET);
				mockRuntimeServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.GET, self._loadAnalyticalConfiguration, self.constants.CONFIGURATION_ENTITYSET);
				mockRuntimeServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.GET, self.loadTexts, self.constants.TEXTS_ENTITYSET);
				mockRuntimeServer.simulate(self.constants.RUNTIME_SERVICE_METADATA, self.constants.RUNTIME_DATA_PATH);
				mockServers.push(mockRuntimeServer);
				mockRuntimeServer.start();

				self._initialLoadConfigurationsToMockServer(mockRuntimeServer, configurationList);

				return mockRuntimeServer;
			},
			/**
			 * Mocks the service for configuration content (configurations and texts).
			 * It supports initial loading of configurations from a parameterizable list of files,
			 * and it supports creating new configurations.
			 * Every configuration must be in the MockServer so that a GET entry operation will find them.
			 * Execution relies on the fact that all configurations are in the Browser session storage.
			 * Configurations in session storage will be initially merged into the entitySetData of the MockServer.
			 *
			 * @param configurationList
			 * @returns {sap.ui.core.util.MockServer} configurationMockServer
			 */
			mockConfigurationService: function (configurationList) {
				var configurationMockServer = new UI5MockServer({
					rootUri: self.constants.CONFIGURATION_SERVICE
				});
				configurationMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.GET, self._loadAnalyticalConfiguration, self.constants.CONFIGURATION_ENTITYSET);
				configurationMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.PUT, self.saveAnalyticalConfiguration.bind(null, "PUT"), self.constants.CONFIGURATION_ENTITYSET); //new configuration
				configurationMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.POST, self.saveAnalyticalConfiguration.bind(null, "POST"), self.constants.CONFIGURATION_ENTITYSET); // Update configuration
				configurationMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.POST, self.saveText, self.constants.TEXTS_ENTITYSET); // New text in modeler
				configurationMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.PUT, self.saveText, self.constants.TEXTS_ENTITYSET); // New text while import
				configurationMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.GET, self.loadTexts, self.constants.TEXTS_ENTITYSET);
				configurationMockServer.simulate(self.constants.CONFIGURATION_SERVICE_METADATA, self.constants.MODELER_DATA_PATH);
				mockServers.push(configurationMockServer);
				configurationMockServer.start();

				self._initialLoadConfigurationsToMockServer(configurationMockServer, configurationList);

				return configurationMockServer;
			},
			saveAnalyticalConfiguration : function(method, requestObject) {
				var raw = requestObject.mParameters.oEntity.SerializedAnalyticalConfiguration;
				var oConfiguration;
				var configId = requestObject.mParameters.oEntity.AnalyticalConfiguration; // "" when POST
				if (method === "POST") {
					configId = sap.apf.utils.createPseudoGuid();
					requestObject.mParameters.oEntity.AnalyticalConfiguration = configId;
					oConfiguration = JSON.parse(raw);
					oConfiguration.configHeader.AnalyticalConfiguration = configId;
					raw = JSON.stringify(oConfiguration);
					requestObject.mParameters.oEntity.SerializedAnalyticalConfiguration = raw;
				}
				localStorage.put(self.constants.LOCAL_STORAGE_CONFIGURATION + configId, raw);
			},
			/** Adds a new text element to the text pool (BLOB) in the session storage */
			saveText: function(requestObject) {
				requestObject.mParameters.oEntity = requestObject.mParameters.oEntity || {};
				if (!sap.apf.utils.isValidGuid(requestObject.mParameters.oEntity.TextElement)){
					requestObject.mParameters.oEntity.TextElement = sap.apf.utils.createPseudoGuid();
				}
				var texts = localStorage.get(self.constants.LOCAL_STORAGE_TEXTS);
				if (!texts) {
					texts = [];
				} else {
					texts = JSON.parse(texts);
				}
				texts.push({
					TextElement: requestObject.mParameters.oEntity.TextElement,
					TextElementDescription: requestObject.mParameters.oEntity.TextElementDescription,
					MaximumLength: requestObject.mParameters.oEntity.MaximumLength,
					TextElementType: requestObject.mParameters.oEntity.TextElementType
				});
				localStorage.put(self.constants.LOCAL_STORAGE_TEXTS, JSON.stringify(texts));
			},
			/** load texts from session storage */
			loadTexts: function(requestObject) {
				var texts = localStorage.get(self.constants.LOCAL_STORAGE_TEXTS);
				if (texts) {
					requestObject.mParameters.oFilteredData = requestObject.mParameters.oFilteredData || {};
					requestObject.mParameters.oFilteredData.results = requestObject.mParameters.oFilteredData.results || [];
					texts = JSON.parse(texts);
					texts.forEach(function (text) {
						requestObject.mParameters.oFilteredData.results.push(text);
					});
				}
			},

			/**
			 * Mocking hierarchical OData services, which is not supported by the mockServer.
			 * @returns {sap.ui.core.util.MockServer} hierarchyServiceMockServer
			 */
			mockHierarchyService: function () {
				var hierarchyData = jQuery.sap.sjax({
					url: self.constants.DEMOKIT_DATA_PATH + "RevenueHryQueryResults.json",
					dataType: "json"
				}).data;
				var hierarchyServiceMockServer = new sap.ui.core.util.MockServer({
					rootUri: self.constants.DEMOKIT_HIERARCHY_SERVICE_URL
				});
				hierarchyServiceMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.GET, responseProcessing);
				hierarchyServiceMockServer.simulate(self.constants.DEMOKIT_HIERARCHY_METADATA, self.constants.DEMOKIT_DATA_PATH);
				hierarchyServiceMockServer.start();
				mockServers.push(hierarchyServiceMockServer);

				return hierarchyServiceMockServer;

				function responseProcessing(response) {
					var resultValuesInFilter;
					var data = response.getParameters().oFilteredData;
					var url = response.getParameters().oXhr.url;
					// P_Currency=%27USD%27
					var beginCurrency = url.indexOf("P_Currency") + 14;
					var endCurrency = url.indexOf("%27", beginCurrency);
					var currency = url.slice(beginCurrency, endCurrency);
					var resultData = filterData(JSON.parse(JSON.stringify(hierarchyData)), "Currency", [currency], true); // Copy array
					// Country filter
					resultData = filterData(resultData, "Country", getFilterValuesForProperty(url, "Country"), true);
					// Customer
					resultData = filterData(resultData, "Customer", getFilterValuesForProperty(url, "Customer"), true);
					// store resultvalues, which are all values once the tree is totally expanded
					resultValuesInFilter = resultData;
					// filter hierarchy node
					var hierarchyNodes = getFilterValuesForProperty(url, "Customer_NodeID");
					if (hierarchyNodes.length > 0) {
						resultData = filterHierarchyNodes(resultData, hierarchyNodes);
					}
					// Customer_ParentID%20eq%20%27Customer%3a%20CG05%27
					var beginParent = url.indexOf("Customer_ParentID%20eq") + 28;
					if (beginParent >= 28) {
						var endParent = url.indexOf("%27", beginParent);
						var parent = url.slice(beginParent, endParent);
						resultData = filterData(resultData, "Customer_ParentID", [decode(parent)], false);
					}
					// level
					if (url.indexOf("Customer_Level%20eq%200") > -1) {
						resultData = getTopLevel(resultData);
					}
					calculateRevenue(resultData, resultValuesInFilter);
					generateMetadata(resultData);
					resultData = removeEmptyResults(resultData);
					removeNotSelectedProperties(resultData, url);

					var parsedUrl = self._parseUrl(url);
					data.results = self._sortData(
						self._aggregateData(resultData),
						parsedUrl.parameters.$orderby
					);
				}

				function removeEmptyResults(data) {
					var resultValues = [];
					data.forEach(function (dataPoint) {
						if (dataPoint.Revenue === undefined || dataPoint.Revenue > 0) {
							resultValues.push(dataPoint);
						}
					});
					return resultValues;
				}

				function getTopLevel(data) {
					var resultData = [];
					var nodeIDs = [];
					data.forEach(function (datapoint) {
						nodeIDs.push(datapoint.Customer_NodeID);
					});
					data.forEach(function (datapoint) {
						if (nodeIDs.indexOf(datapoint.Customer_ParentID) === -1) {
							resultData.push(datapoint);
						}
					});
					return resultData;
				}

				function filterHierarchyNodes(data, hierarchyNodes) {
					var resultData = [];
					var nodeAdded = false;
					var nodeIds = [];
					hierarchyNodes.forEach(function (hierarchyNode) {
						nodeIds.push(decode(hierarchyNode));
					});
					// add filtered nodes themselves
					data.forEach(function (dataPoint) {
						if (nodeIds.indexOf(dataPoint.Customer_NodeID) > -1) {
							resultData.push(dataPoint);
							nodeAdded = true;
						}
					});

					// find children
					function findChildren(dataPoint) {
						if (nodeIds.indexOf(dataPoint.Customer_ParentID) > -1 && nodeIds.indexOf(dataPoint.Customer_NodeID) === -1) {
							resultData.push(dataPoint);
							nodeIds.push(dataPoint.Customer_NodeID);
							nodeAdded = true;
						}
					}

					while (nodeAdded) {
						nodeAdded = false;
						data.forEach(findChildren);
					}
					return resultData;
				}

				function removeNotSelectedProperties(data, url) {
					url = decode(url);
					var beginSelect = url.indexOf("$select");
					if (beginSelect > -1 && data.length > 0) {
						var endSelect = url.indexOf("$", beginSelect + 1);
						Object.keys(data[0]).forEach(function (key) {
							if (key !== "__metadata") {
								var beginKeyAnd = url.indexOf(key + "&", beginSelect);
								var beginKeyColon = url.indexOf(key + ",", beginSelect);
								var beginKey = beginKeyAnd === -1 ? beginKeyColon : beginKeyAnd;
								if (beginKey < 0 || (endSelect > -1 && beginKey > endSelect)) {
									data.forEach(function (dataPoint) {
										delete dataPoint[key];
									});
								}
							}
						});
					}
				}

				function getFilterValuesForProperty(url, property) {
					var andCounter = 0;
					var propertyValues = [];
					propertyValues[andCounter] = [];
					var beginPropertyValue = url.indexOf(property + "%20eq%20%27") + property.length + 11;
					while (beginPropertyValue >= property.length + 11) {
						if (nextAnd && nextAnd > -1 && nextAnd < beginPropertyValue) {
							andCounter++;
							propertyValues[andCounter] = [];
						}
						var endPropertyValue = url.indexOf("%27", beginPropertyValue);
						propertyValues[andCounter].push(url.slice(beginPropertyValue, endPropertyValue));
						// next value
						var nextAnd = url.indexOf("%20and%20", endPropertyValue);
						beginPropertyValue = url.indexOf(property + "%20eq%20%27", endPropertyValue) + property.length + 11;
					}
					if (andCounter > 0) {
						var currentResultArray = propertyValues[0];
						var resultArray = [];
						propertyValues.forEach(function (item) {
							currentResultArray.forEach(function (currentResultValue) {
								if (item.indexOf(currentResultValue) >= 0) {
									resultArray.push(currentResultValue);
								}
							});
							currentResultArray = resultArray;
						});
						return resultArray;
					}
					return propertyValues[andCounter];
				}

				function calculateRevenue(resultData, resultValuesInFilter) {
					resultData.forEach(function (resultDataPoint) {
						if (resultDataPoint.Revenue === null) {
							resultDataPoint.Revenue = getRevenueOfChildren(resultDataPoint, resultValuesInFilter);
						}
					});
				}

				function getRevenueOfChildren(parent, resultValuesInFilter) {
					var parentId = parent.Customer_NodeID;
					var revenue = 0;
					resultValuesInFilter.forEach(function (resultValue) {
						if (resultValue.Customer_ParentID === parentId) {
							if (resultValue.Revenue === null) {
								revenue += getRevenueOfChildren(resultValue, resultValuesInFilter);
							} else {
								revenue += resultValue.Revenue;
							}
						}
					});
					return revenue;
				}

				function decode(string) {
					return string.replace(new RegExp("%3a", "g"), ":").replace(new RegExp("%20", "g"), " ").replace(new RegExp("%2c", "g"), ",");
				}

				function filterData(data, property, aValues, bExceptNull) {
					if (aValues.length === 0) {
						return data;
					}
					var responseData = [];
					data.forEach(function (datapoint) {
						if ((datapoint[property] === null && bExceptNull) || aValues.indexOf(datapoint[property]) >= 0) {
							responseData.push(datapoint);
						}
					});
					return responseData;
				}

				function generateMetadata(data) {
					data.forEach(function (datapoint) {
						datapoint.__metadata = {
							"id": "/tmp/demokit/hierarchy.xsodata/RevenueHryQueryResults('" + datapoint.GenID + "')",
							"type": "tmp.demokit.demokit.RevenueHryQueryResultsType",
							"uri": "/tmp/demokit/hierarchy.xsodata/RevenueHryQueryResults('" + datapoint.GenID + "')"
						};
					});
				}
			},
			/**
			 * Hook to be attached after GETting data from the standard Mockserver.
			 * Apply aggregation and (if necessary) proper pagination
			 * @param {sap.ui.base.Event} oEvent An Event providing a parameter oXhr containing information about the request (url & data). Parameters of the Event will be mutated!
			 */
			_postProcessDemokitData: function(oEvent) {
				var oXhr = oEvent.getParameter("oXhr");
				var oFilteredData = oEvent.getParameter("oFilteredData");
				if (oXhr && oFilteredData) {
					var parsedUrl = self._parseUrl(oXhr.url);
					var containsPagination = parsedUrl.couldParse && (parsedUrl.parameters.$top !== undefined || parsedUrl.parameters.$skip !== undefined);

					if (containsPagination) {
						var urlParamsWithoutPagination = jQuery.extend({}, parsedUrl.parameters);
						delete urlParamsWithoutPagination.$top;
						delete urlParamsWithoutPagination.$skip;

						var urlWithoutPagination = self._generateUrlString(parsedUrl.path, urlParamsWithoutPagination);

						// start a new request without pagination (incl. aggregation)
						var responseWithoutPagination = jQuery.sap.sjax({
							url: urlWithoutPagination,
							dataType: "json"
						}).data.d;

						// now apply pagination _after_ aggregation
						var $skip = parsedUrl.parameters.$skip || 0;
						var $top = parsedUrl.parameters.$top;

						var results;
						if ($top) {
							results = responseWithoutPagination.results.slice($skip, Number($skip) + Number($top));
						} else {
							results = responseWithoutPagination.results.slice($skip);
						}

						// reply with the paginated data
						oFilteredData.results = results;
						// set the inline count to the number of items before pagination but after aggregation
						oFilteredData.__count = responseWithoutPagination.__count;
					} else {
						oFilteredData.results = self._attachGUIDs(
							self._sortData(
								self._aggregateData(
									oFilteredData.results || []
								),
								parsedUrl.parameters.$orderby
							)
						);
						oFilteredData.__count = oFilteredData.results.length;
					}
				}
			},
			/**
			 * Aggregate the results returned from the Mockserver. To be called within the _postProcessDemokitData-Hook
			 * @param {Object[]} results Results-Array, part of oFilteredData of the oEvent passed to the hook
			 * @returns {Object[]} Array containing aggregated entries to replace the original results-array in oFilteredData
			 */
			_aggregateData: function(results) {
				var measuresInService = [ "Revenue", "ShippingCosts", "Discount", "NumberOfOrders" ];
				var resultArray = [];

				if (results.length > 0) {
					var hashTable = {};
					var properties = Object.getOwnPropertyNames(results[0]);
					var dimensions = [];
					var measures = [];
					properties.forEach(function(property) {
						if (property !== "__metadata") {
							if (measuresInService.indexOf(property) > -1) {
								measures.push(property);
							} else {
								dimensions.push(property);
							}
						}
					});
					if (measures.length > 0) {
						results.forEach(function(result) {
							var hash = "";
							var nullValue = false;
							dimensions.forEach(function(dimension) {
								if(result[dimension] === null){
									nullValue = true;
								}
								hash = hash + result[dimension];
							});
							if (nullValue){
								return;
							}
							if (!hashTable[hash]) {
								hashTable[hash] = jQuery.extend(true, {}, result);
								// ensure measures are Number
								measures.forEach(function(measure) {
									hashTable[hash][measure] = Number(result[measure]);
								});
							} else {
								measures.forEach(function(measure) {
									hashTable[hash][measure] = Number(hashTable[hash][measure]) + Number(result[measure]);
								});
							}
						});
						resultArray = jQuery.map(hashTable, function(value) {
							return value;
						});
						if (resultArray.length > 0) {
							return resultArray;
						}
					} else if (dimensions.length === 1 || dimensions.length === 2) { //selection validation request or value help request; remove duplicates
						var resultValues = [];
						results.forEach(function(result) {
							if (jQuery.inArray(result[dimensions[0]], resultValues) === -1) {
								resultValues.push(result[dimensions[0]]);
								resultArray.push(result);
							}
						});
						if (resultArray.length > 0) {
							return resultArray;
						}
					}
				}
				return results;
			},
			/**
			 * Sorts the result-array of the oFilteredData of the _postProcessDemokitData-hook. Necessary, as aggregateData requires resorting the entries
			 * @param {Object[]} aggregatedData The results-array generated by _aggregateData
			 * @param {string} $orderby Value of the $orderby-parameter passed to the mockserver
			 * @returns {Object[]} The sorted results array to replace oFilteredData.results of oEvent of the _postProcessDemokitData-hook
			 */
			_sortData: function(aggregatedData, $orderby) {
				var sortOptions = self._parseOrderBy($orderby);

				// Skip sorting if not requested
				if (sortOptions.length === 0) {
					return aggregatedData;
				}

				var sortedData = aggregatedData.slice().sort(function(rowA, rowB) {
					// Find first sortOption without equality of attribute-values (Array.prototype.find not supported by IE)
					var sortOption = sortOptions.filter(function(oSortOption) {
						return rowA[oSortOption.attr] !== rowB[oSortOption.attr];
					})[0];
					// No such sortOption -> Rows are equal
					if (!sortOption) {
						return 0;
					}
					// Otherwise -> Order by the sortOption
					if (rowA[sortOption.attr] > rowB[sortOption.attr]) {
						return sortOption.direction;
					}
					return -sortOption.direction;
				});

				return sortedData;
			},
			/**
			 * Parse OData's $orderby-parameter
			 * @param {*} orderby OData $orderby-URL-parameter
			 * @returns {Object[]} The parsed orderby-object
			 */
			_parseOrderBy: function(orderby) {
				if (typeof orderby !== "string" || orderby.trim() === "") {
					return [];
				}
				var aOrderBy = orderby.split(",").map(function(sItem) {
					var aItem = sItem.trim().split("%20");
					if (aItem[1] && aItem[1].toLowerCase().trim() === "desc") {
						return { attr: aItem[0].trim(), direction: -1 };
					}
					return { attr: aItem[0].trim(), direction: 1 };
				});
				return aOrderBy;
			},
			/**
			 * Parse an URL into an object
			 * @param {string} urlString The URL
			 * @returns {Object} An object representing the URL: { couldParse: true, path: "http(s)://domain/path" parameters: { key: value, ... } }
			 */
			_parseUrl: function(urlString) {
				if (typeof urlString !== "string") {
					return { couldParse: false };
				}
				var questionMarkSeparated = urlString.split("?");

				// The URL should have the form http(s)://domain/path?parameters
				if (questionMarkSeparated.length < 1 || questionMarkSeparated.length > 2) {
					return { couldParse: false };
				} else if (questionMarkSeparated.length == 1) {
					// No parameters present
					return { couldParse: true, path: questionMarkSeparated[0], parameters: {}};
				}

				var params = {};
				questionMarkSeparated[1].split("&").map(function(paramString) {
					var parts = paramString.split("=");
					var lhs = parts[0];
					var rhs = parts[1];
					return {lhs: lhs, rhs: rhs};
				}).forEach(function(param) {
					params[param.lhs] = param.rhs;
				});

				return { couldParse: true, path: questionMarkSeparated[0], parameters: params };
			},
			/**
			 * Generate a URL from path and an object of parameters
			 * @param {string} path Path to the resource, e.g. "https://domain/path"
			 * @param {Object} params An object of URL-parameters in {key: value, ...}-Form
			 */
			_generateUrlString: function(path, params) {
				var paramString = Object.keys(params)
					.map(function(key) {
						return key + "=" + params[key];
					})
					.join("&");

				return path + "?" + paramString;
			},
			/**
			 * Attach temporary GUIDs to a result set to be returned from a service
			 * Smartcharts need metadata to be correct, and the demo-data by the mockserver does not provide GUIDs -- add them!
			 * @param {Object[]} aggregatedData The results-array generated by of the service
			 * @returns {Object[]} The results array containing correct metadata
			 */
			_attachGUIDs: function(results) {
				return results.map(function(dataPoint) {
					if (dataPoint.__metadata) {
						var guid = "('" + sap.apf.utils.createPseudoGuid() + "')";
						var newDataPoint = jQuery.extend(true /*deep copy*/, {}, dataPoint);

						newDataPoint.__metadata.uri = dataPoint.__metadata.uri.replace("('undefined')", guid);
						newDataPoint.__metadata.id = dataPoint.__metadata.id.replace("('undefined')", guid);

						return newDataPoint;
					}
					return dataPoint;
				});
			}
		};

		self.setupConstants(base);
		return self;
	}
});

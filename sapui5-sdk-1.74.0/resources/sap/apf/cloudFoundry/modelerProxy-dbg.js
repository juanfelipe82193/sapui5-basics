/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/apf/utils/proxyTextHandlerForLocalTexts',
	'sap/apf/cloudFoundry/utils'
],function(ProxyTextHandlerForLocalTexts, cloudFoundryUtils) {
	'use strict';

	/**
	 * Simplified interface for accessing the APF CloudFoundry Persistence in the APF Modeler.
	 * This proxy implements the REST requests to APF CloudFoundry Persistence for reading, creating, updating
	 * and deleting the analytical configurations and applications in the APF Modeler.
	 * It is activated, when function isUsingCloudFoundryProxy is injected into the component
	 * and the function returns true.
	 *
	 * @constructor
	 * @name sap.apf.cloudFoundry.ModelerProxy
	 * @since SAP UI5 1.54.0.
	 *
	 * @param {string} serviceConfiguration - not needed for this proxy, it is there because of the common interface for all proxies (oData needs this).
	 * Service configuration is part of the injected manifest in form of the data source definitions
	 * @param {object} inject - Injection of instances and constructor functions
	 * @param {object} inject.instances - Instances
	 * @param {sap.apf.core.MessageHandler} inject.instances.messageHandler - MessageHandler instance
	 * @param {sap.apf.modeler.core.Instance} inject.instances.coreApi - Core API instance
	 * @param {object} inject.instances.ajaxHandler - CloudFoundry ajaxHandler
	 * @param {sap.apf.cloudFoundry.proxyTextHandlerForLocalTexts} inject.instances.proxyTextHandlerForLocalTexts - proxyTextHandlerForLocalTexts instance
	 * @param {object} inject.manifests - contains manifests
	 * @param {object} inject.manifests.manifest the manifest of the component with data source information of the rest end points
	 * @returns {{ ModelerProxy : sap.apf.cloudFoundry.ModelerProxy }} ModelerProxy
	 */
	function ModelerProxy(serviceConfiguration, inject){
		var messageHandler = inject.instances.messageHandler;
		var manifest = inject.manifests.manifest;
		var dataSources = manifest["sap.app"].dataSources;
		var applicationsUri = dataSources && dataSources["apf.designTime.customer.applications"] &&
			dataSources["apf.designTime.customer.applications"].uri;
		var analyticalConfigurationsUri = dataSources && dataSources["apf.designTime.customer.analyticalConfigurations"] &&
			dataSources["apf.designTime.customer.analyticalConfigurations"].uri;
		var applicationAndAnalyticalConfigurationUri = dataSources && dataSources["apf.designTime.customer.applicationAndAnalyticalConfiguration"] &&
			dataSources["apf.designTime.customer.applicationAndAnalyticalConfiguration"].uri;
		var textFileAndAnalyticalConfigurationsUri = dataSources && dataSources["apf.designTime.textFileAndAnalyticalConfigurations"] &&
			dataSources["apf.designTime.textFileAndAnalyticalConfigurations"].uri;
		var textFilesUri = dataSources && dataSources["apf.designTime.textFiles"] &&
			dataSources["apf.designTime.textFiles"].uri;
		var vendorImportToCustomerLayerUri = dataSources && dataSources["apf.designTime.vendor.importToCustomerLayer"] &&
			dataSources["apf.designTime.vendor.importToCustomerLayer"].uri;
		var vendorAnalyticalConfigurationsUri = dataSources && dataSources["apf.designTime.vendor.analyticalConfigurations"] &&
			dataSources["apf.designTime.vendor.analyticalConfigurations"].uri;
		var proxyTextHandlerForLocalTexts = inject.instances.proxyTextHandlerForLocalTexts;

		var resolveUri = cloudFoundryUtils.resolveUri.bind(this, inject.instances.coreApi);

		function getMetadata() {
			return {};
		}

		function addConfigHeaderToSerializedConfiguration(appData){
			var configuration =  JSON.parse(appData.SerializedAnalyticalConfiguration);
			delete appData.SerializedAnalyticalConfiguration;
			configuration.configHeader = appData;
			appData.SerializedAnalyticalConfiguration = JSON.stringify(configuration);
			return appData;
		}
		/**
		 * REST post operation for specific type (application or configuration or texts) async
		 * @param {string} entitySetName value from sap.apf.core.constants.entitySets
		 * @param {object} data object with properties of object, that shall be posted
		 * @param {function} callback function of form fn(result, metadata, messageObject)
		 */
		this.create = function(entitySetName, data, callback){
			if (entitySetName === 'application') {
				createApplication(data, callback);
			} else if (entitySetName === 'configuration' && data.CreationUTCDateTime && data.LastChangeUTCDateTime){ // necessary due to already existing lrep behaviour
				//check, that this configuration was not already created under another application / manually

				data = addConfigHeaderToSerializedConfiguration(data);
				var configurationId = data.AnalyticalConfiguration;
				ajax({
					type : "HEAD",
					url: resolveUri(analyticalConfigurationsUri + "/" + configurationId),
					success : function() {
						var messageObject = messageHandler.createMessageObject({ code : "5238", aParams : [ configurationId ]});
						callback(undefined, undefined, messageObject);
					},
					error: function(jqXHR, textStatus, errorThrown, oMessage) {
						if (jqXHR.status === 404) {
							importConfiguration(data, function(metadata, messageObject) {
								callback(data, metadata, messageObject);
							});
						} else {
							var messageObject = buildErrorMessageFromXhr(jqXHR, oMessage, messageHandler);
							callback(undefined, undefined, messageObject);
						}
					}
				});
			} else if (entitySetName === 'configuration') {
				data = addConfigHeaderToSerializedConfiguration(data);
				createConfiguration(data, callback);
			} else if (entitySetName === 'texts') {
				createText(data, callback);
			} else {
				messageHandler.check(false, 'The create operation on entity set ' + entitySetName + ' is currently not supported by the modeler proxy.');
			}
		};
		function createApplication(applicationData, callback){
			var requestBody = {
				applicationName : applicationData.ApplicationName,
				textFile : {
					inDevelopmentLanguage : ""
				}
			};
			var type = "POST";
			var uri = resolveUri(applicationsUri);
			if (applicationData.Application) {
				type = "PUT";
				uri = uri + '/' + applicationData.Application;
			}
			ajax({
				type: type,
				url : uri,
				data: JSON.stringify(requestBody),
				dataType : "json",
				success : function(oData, sStatus, oJqXHR) {

					if (type === 'POST' && oData && !jQuery.isEmptyObject(oData)) {
						var response = {
							ApplicationName: applicationData.ApplicationName,
							Application: oData.application
						};
						callback(response, getMetadata(), undefined);
					} else if (type === 'PUT') {
						var response = {
								ApplicationName: applicationData.ApplicationName,
								Application: applicationData.Application
							};
							callback(response, getMetadata(), undefined);
					} else {
						var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5227", [], undefined, messageHandler);
						callback(undefined, getMetadata(), oMessageObject);
					}
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5227", [], originalMessageObject, messageHandler);
					callback(undefined, getMetadata(), oMessageObject);
				},
				async : true
			});
		}
		function createConfiguration(configurationData, callback){
			var applicationId = configurationData.Application;
			var requestBody = {
				analyticalConfigurationName: configurationData.AnalyticalConfigurationName,
				application: applicationId,
				serializedAnalyticalConfiguration: configurationData.SerializedAnalyticalConfiguration,
				textFile : {
					inDevelopmentLanguage : proxyTextHandlerForLocalTexts.createTextFileOfApplication(applicationId)
				}
			};

			ajax({
				type: "POST",
				url : resolveUri(analyticalConfigurationsUri),
				data: JSON.stringify(requestBody),
				dataType : "json",
				success : function(oData, sStatus, oJqXHR) {
					if (oData && !jQuery.isEmptyObject(oData)) {
						var response = {
							AnalyticalConfiguration : oData.analyticalConfiguration,
							AnalyticalConfigurationName : requestBody.analyticalConfigurationName
						};
						callback(response, getMetadata(), undefined);
					} else {
						var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5226", [applicationId], undefined, messageHandler);
						callback(undefined, getMetadata(), oMessageObject);
					}
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5226", [applicationId], originalMessageObject, messageHandler);
					callback(undefined, getMetadata(), oMessageObject);
				},
				async : true
			});
		}
		function createText(data, callback) {
			var textElementId = proxyTextHandlerForLocalTexts.addText(data);
			data.TextElement = textElementId;
			callback(data, getMetadata());
		}

		/**
		 * REST get operation for specific type (application or configuration) asynchronously
		 * @param {string} entitySetName value from sap.apf.core.constants.entitySets
		 * @param {function} callback function of form fn(result, metadata, messageObject)
		 * @param {object[]|undefined} [inputParameters] - not used - only required for general proxy
		 * @param {string[]|undefined} [selectList] holds all properties, that shall be in the select list - not used
		 * due to hard coded select parameters for the end points
		 * @param {sap.apf.core.utils.Filter} [filter] additional filter expressions
		 */
		this.readCollection = function(entitySetName, callback, inputParameters, selectList, filter) {
			if (entitySetName === 'application') {
				readApplicationList(callback);
			} else if (entitySetName === 'configuration'){
				readConfigurationList(callback, filter);
			} else if (entitySetName === 'texts'){
				callback([], undefined); // we copy the textfiles automatically on the server
			} else {
				messageHandler.check(false, 'The read collection operation on entity set ' + entitySetName + ' is currently not supported by the modeler proxy.');
			}
		};
		function readApplicationList(callback){
			var uriForReadingApplication = resolveUri(applicationsUri + "?$select=Application,ApplicationName");
			ajax({
				type: "GET",
				url : uriForReadingApplication,
				success : function(oData, sStatus, oJqXHR) {
					if (oData && !jQuery.isEmptyObject(oData)) {
						var applications = [];
						if (oData.applications !== null) {
							oData.applications.forEach(function(singleApplication){
								applications.push({
									Application : singleApplication.application,
									ApplicationName : singleApplication.applicationName,
									SemanticObject : ""
								});
							});
						}
						callback(applications, getMetadata(), undefined);
					} else {
						var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5229", [], undefined, messageHandler);
						callback(undefined, getMetadata(), oMessageObject);
					}
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5229", [], originalMessageObject, messageHandler);
					callback(undefined, getMetadata(), oMessageObject);
				},
				async : true
			});
		}
		function readConfigurationList(callback, filter){
			var aTerms = filter.getFilterTermsForProperty('Application');
			var application = aTerms[0].getValue();
			var uriForReadingConfiguration = resolveUri(textFileAndAnalyticalConfigurationsUri + "?$select=AnalyticalConfiguration,AnalyticalConfigurationName,SerializedAnalyticalConfiguration&$filter=" + filter.toUrlParam());
			ajax({
				type: "GET",
				url : uriForReadingConfiguration,
				success : function(oData, sStatus, oJqXHR) {
					if (oData && !jQuery.isEmptyObject(oData)) {
						var configurations = [];
						if (oData.analyticalConfigurations !== null) {
							oData.analyticalConfigurations.forEach(function(responseObject){
								configurations.push({
									AnalyticalConfiguration : responseObject.analyticalConfiguration,
									Application : application,
									AnalyticalConfigurationName : responseObject.analyticalConfigurationName,
									SerializedAnalyticalConfiguration : responseObject.serializedAnalyticalConfiguration
								});
							});
						}

						proxyTextHandlerForLocalTexts.initApplicationTexts(application, oData.textFile.inDevelopmentLanguage);
						callback(configurations, getMetadata(), undefined);
					} else {
						var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5223", [application], undefined, messageHandler);
						callback(undefined, getMetadata(), oMessageObject);
					}
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5223", [application], originalMessageObject, messageHandler);
					callback(undefined, getMetadata(), oMessageObject);
				},
				async : true
			});
		}

		/**
		 * REST get operation for specific single entity (configuration only)
		 * @param {string} entitySetName value from sap.apf.core.constants.entitySets
		 * @param {function} callback function of form fn(entityData, metadata, messageObject)
		 * @param {{value : string}[]} inputParameters - first element shall be analyticalConfigurationId (entitySetName === 'configuration')
		 * @param {string[]} [selectList] - unused parameter, it is nevertheless necessary due to already existing api of LREP-Proxy
		 * @param {string} applicationId guid of the Application
		 */
		this.readEntity = function(entitySetName, callback, inputParameters, selectList,  applicationId) {
			if (entitySetName === 'configuration') {
				var analyticalConfigurationId = inputParameters[0].value;
				if (selectList && selectList.length === 2 && jQuery.inArray("CreationUTCDateTime", selectList) > -1 &&
						jQuery.inArray("LastChangeUTCDateTime", selectList) > -1) {
					readAnalyticalConfigurationForExport(analyticalConfigurationId, applicationId, callback);
				} else {
					readSingleConfiguration(analyticalConfigurationId, applicationId, callback);
				}
			} else {
				messageHandler.check(false, 'The read single entity operation on entity set ' + entitySetName + ' is currently not supported by the modeler proxy.');
			}
		};
		function readAnalyticalConfigurationForExport(analyticalConfigurationId, applicationId, callback) {
			var uri = resolveUri(analyticalConfigurationsUri + "/" + analyticalConfigurationId
			+ "?$select=Application,CreationUtcDateTime,LastChangeUtcDateTime,ServiceInstance");
			ajax({
				type: "GET",
				url : uri,
				success : function(oData, sStatus, oJqXHR) {
					if (oData && !jQuery.isEmptyObject(oData)) {
						var response = {
							CreationUTCDateTime : oData.analyticalConfiguration.creationUtcDateTime,
							LastChangeUTCDateTime : oData.analyticalConfiguration.lastChangeUtcDateTime
						};
						callback(response, getMetadata());
					} else {
						var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5221", [applicationId, analyticalConfigurationId], undefined, messageHandler);
						callback(undefined, getMetadata(), oMessageObject);
					}
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5221", [applicationId, analyticalConfigurationId], originalMessageObject, messageHandler);
					callback(undefined, getMetadata(), oMessageObject);
				},
				async : true
			});
		}
		function readSingleConfiguration(analyticalConfigurationId, applicationId, callback) {
			var uriForReadingSingleConfiguration = resolveUri(analyticalConfigurationsUri + "/" + analyticalConfigurationId
				+ "?$select=AnalyticalConfigurationName,SerializedAnalyticalConfiguration");

			ajax({
				type: "GET",
				url : uriForReadingSingleConfiguration,
				success : function(oData, sStatus, oJqXHR) {
					if (oData && !jQuery.isEmptyObject(oData)) {
						var response = {
							Application : applicationId,
							SerializedAnalyticalConfiguration : oData.analyticalConfiguration.serializedAnalyticalConfiguration,
							AnalyticalConfiguration : analyticalConfigurationId
						};
						callback(response, getMetadata(), undefined);
					} else {
						var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5221", [applicationId, analyticalConfigurationId], undefined, messageHandler);
						callback(undefined, getMetadata(), oMessageObject);
					}
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5221", [applicationId, analyticalConfigurationId], originalMessageObject, messageHandler);
					callback(undefined, getMetadata(), oMessageObject);
				},
				async : true
			});
		}

		/**
		 * REST put operation for specific type (application or configuration)
		 * @param {string} entitySetName value from sap.apf.core.constants.entitySets
		 * @param {object} data object with properties of object, that shall be posted
		 * @param {function} callback function of form fn( metadata, messageObject)
		 * @param {object[]} [inputParameters] - first element shall be applicationId (in case of entitySetName === 'application')
		 */
		this.update = function(entitySetName, data, callback, inputParameters) {
			if (entitySetName === 'application') {
				var applicationId = inputParameters[0].value; // in case this doesn't work see function addInputParametersToUrl(inputParameters) in odataProxy.js:32
				updateApplication(data, applicationId, callback);
			} else if (entitySetName === 'configuration' && data.CreationUTCDateTime && data.LastChangeUTCDateTime){ // necessary due to already existing lrep behaviour
				data = addConfigHeaderToSerializedConfiguration(data);
				importConfiguration(data, callback);
			} else if (entitySetName === 'configuration'){
				data = addConfigHeaderToSerializedConfiguration(data);
				updateConfiguration(data, callback);
			} else {
				messageHandler.check(false, 'The update operation on entity set ' + entitySetName + ' is currently not supported by the modeler proxy.');
			}
		};
		function updateApplication(applicationData, applicationId, callback){
			var requestBody = {
				applicationName : applicationData.ApplicationName
			};
			var uriForUpdateApplication = resolveUri(applicationsUri + '/' + applicationId);
			ajax({
				type: "PUT",
				url : uriForUpdateApplication,
				data: JSON.stringify(requestBody),
				dataType : "json",
				success : function(oData, sStatus, oJqXHR) {
					callback(getMetadata(), undefined);
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5228", [applicationId], originalMessageObject, messageHandler);
					callback(getMetadata(), oMessageObject);
				},
				async : true
			});
		}
		function updateConfiguration(data, callback){
			var analyticalConfiguration = JSON.parse(data.SerializedAnalyticalConfiguration);
			var analyticalConfigurationId = data.AnalyticalConfiguration;
			var uriForUpdateConfiguration = resolveUri(analyticalConfigurationsUri + '/' + analyticalConfigurationId);
			var applicationId = data.Application;
			analyticalConfiguration.configHeader = {
					Application : applicationId,
					//ApplicationName : result.response.ApplicationName,
					AnalyticalConfiguration : analyticalConfigurationId,
					AnalyticalConfigurationName : data.AnalyticalConfigurationName,
					//UI5Version : ,
					CreationUTCDateTime : data.CreationUTCDateTime,
					LastChangeUTCDateTime : data.LastChangeUTCDateTime
			};
			var requestBody = {
				analyticalConfigurationName : data.AnalyticalConfigurationName,
				serializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration),
				textFile : {
					inDevelopmentLanguage : proxyTextHandlerForLocalTexts.createTextFileOfApplication(applicationId)
				}
			};
			ajax({
				type: "PUT",
				url : uriForUpdateConfiguration,
				data: JSON.stringify(requestBody),
				dataType : "json",
				success : function(oData, sStatus, oJqXHR) {
					callback(getMetadata(), undefined);
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5233", [applicationId, analyticalConfigurationId], originalMessageObject, messageHandler);
					callback(getMetadata(), oMessageObject);
				},
				async : true
			});
		}
		function importConfiguration(applicationData, callback){
			var analyticalConfiguration = JSON.parse(applicationData.SerializedAnalyticalConfiguration);
			var analyticalConfigurationId = analyticalConfiguration.configHeader.AnalyticalConfiguration;
			var uriForUpdateConfiguration = resolveUri(applicationAndAnalyticalConfigurationUri + '/' + analyticalConfigurationId);
			var applicationId = applicationData.Application;
			var requestBody = {
				analyticalConfigurationName : applicationData.AnalyticalConfigurationName,
				application: applicationId,
				serializedAnalyticalConfiguration : applicationData.SerializedAnalyticalConfiguration
			};
			ajax({
				type: "PUT",
				url : uriForUpdateConfiguration,
				data: JSON.stringify(requestBody),
				dataType : "json",
				success : function(oData, sStatus, oJqXHR) {
					callback(getMetadata(), undefined);
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5233", [applicationId, analyticalConfigurationId], originalMessageObject, messageHandler);
					callback(getMetadata(), oMessageObject);
				},
				async : true
			});
		}

		/**
		 * REST delete operation for specific type (application or configuration)
		 * @param {string} entitySetName value from sap.apf.core.constants.entitySets
		 * @param {object[]} [inputParameters] - first element shall be applicationId (in case of entitySetName === 'application') or analyticalConfigurationId (entitySetName === 'configuration')
		 * @param {function} callback function of form fn(metadata, messageObject)
		 * @param {sap.apf.core.utils.Filter} [filter]
		 * @param {string | undefined} application guid has only to be filled in case of entitySetName === 'configuration'
		 */
		this.remove = function(entitySetName, inputParameters, callback, filter, application, layer){
			if (entitySetName === 'application') {
				var applicationId = inputParameters[0].value;
				deleteApplication(applicationId, callback);
			} else if (entitySetName === 'configuration'){
				var analyticalConfigurationId = inputParameters[0].value;
				deleteConfiguration(analyticalConfigurationId, application, callback);
			} else {
				messageHandler.check(false, 'The delete operation on entity set ' + entitySetName + ' is currently not supported by the modeler proxy.');
			}
		};
		function deleteApplication(applicationId, callback){
			var uriForDeleteApplication = resolveUri(applicationsUri + '/' + applicationId);
			ajax({
				type: "DELETE",
				url : uriForDeleteApplication,
				success : function(oData, sStatus, oJqXHR) {
					callback(getMetadata(), undefined);
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5237", [applicationId], originalMessageObject, messageHandler);
					callback(getMetadata(), oMessageObject);
				},
				async : true
			});
		}
		function deleteConfiguration(analyticalConfigurationId, applicationId, callback){
			var uriForDeleteAnalyticalConfiguration = resolveUri(analyticalConfigurationsUri + '/' + analyticalConfigurationId);
			ajax({
				type: "DELETE",
				url : uriForDeleteAnalyticalConfiguration,
				success : function(oData, sStatus, oJqXHR) {
					callback(getMetadata(), undefined);
				},
				error : function(oJqXHR, sStatus, sError, originalMessageObject) {
					var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5225", [applicationId, analyticalConfigurationId], originalMessageObject, messageHandler);
					callback(getMetadata(), oMessageObject);
				},
				async : true
			});
		}

		/**
		 * multiple change operations in batch on entity set 'texts'
		 * @param {object[]} requestConfigurations with properties entitySetName, filter, selectList, inputParameters, method, application and data (used for create)
		 * @param {function} callback with parameters undefined or messageObject in case of Error
		 * @param {string} applicationId guid associated with the texts to be deleted
		 */
		this.doChangeOperationsInBatch = function(requestConfigurations, callback, applicationId, isTextPoolCleanup){
			requestConfigurations.forEach(function (requestConfiguration) {
				if(requestConfiguration.entitySetName !== 'texts'){
					messageHandler.check(false, 'The create/update/delete operation in batch on entity set ' + requestConfiguration.entitySetName + ' is not supported by the modeler proxy.');
				}
				requestConfiguration.application = applicationId;
			});
			this._readConfigurationListAndTextFile(applicationId).then(function (serverResponse) {
				var propertyFileStringInDevLanguage = serverResponse.textFile.inDevelopmentLanguage;
				this._initText(applicationId, propertyFileStringInDevLanguage);
				this._applyChangesOnTextFile(requestConfigurations);
				var textFile = this._createTextFileOfApplication(applicationId);
				this._updateRemoteTextFile(applicationId, 'DEV', textFile, isTextPoolCleanup).then(function () {
					callback(undefined);
				}, function (messageObject) {
					callback(messageObject);
				});
			}.bind(this), function (messageObject) { // reject case
				callback(messageObject);
			});
		};
		/**
		 * Async get request to read the configuration list and text file.
		 * This method is used in doChangeOperationsInBatch to locally initialize the text file for text pool cleanup.
		 * @private
		 * @param {string} applicationId - id of the application where the text file is connected to
		 * @returns { Promise<{analyticalConfigurations: {analyticalConfiguration: object, analyticalConfigurationName: string, serializedAnalyticalConfiguration: string}[], textFile: {inDevelopmentLanguage : string}}> } - contains the response from the server
		 */
		this._readConfigurationListAndTextFile = function(applicationId){
			var strDelimiter = "'";
			var promise = new Promise(function(resolve, reject) {
				var uriForReadAnalyticalConfigurationListAndTextFile = resolveUri(textFileAndAnalyticalConfigurationsUri
					+ '?$select=AnalyticalConfiguration,AnalyticalConfigurationName,SerializedAnalyticalConfiguration'
					+ '&$filter=(Application%20eq%20' + strDelimiter + applicationId + strDelimiter + ')');
				ajax({
					type: "GET",
					url : uriForReadAnalyticalConfigurationListAndTextFile,
					success : function(oData, sStatus, oJqXHR) {
						var analyticalConfigurations = [];
						if (oData.analyticalConfigurations !== null) {
							oData.analyticalConfigurations.forEach(function (singleAnalyticalConfiguration) {
								analyticalConfigurations.push({
									analyticalConfiguration: singleAnalyticalConfiguration.analyticalConfiguration,
									analyticalConfigurationName: singleAnalyticalConfiguration.analyticalConfigurationName,
									serializedAnalyticalConfiguration: singleAnalyticalConfiguration.serializedAnalyticalConfiguration
								});
							});
						}
						var response = {
							analyticalConfigurations : analyticalConfigurations,
							textFile : {
								inDevelopmentLanguage : oData.textFile.inDevelopmentLanguage
							}
						};
						resolve(response);
					},
					error : function(oJqXHR, sStatus, sError, originalMessageObject) {
						var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5222", [applicationId], originalMessageObject, messageHandler);
						reject(oMessageObject);
					},
					async : true
				});
			});
			return promise;
		};
		/**
		 * local wrapper for initApplicationTexts of proxyTextHandlerForLocalTexts
		 * @param {string} applicationId - guid of application for text file
		 * @param {string} propertyFileString - text file content
		 * @private
		 */
		this._initText = function(applicationId, propertyFileString) {
			proxyTextHandlerForLocalTexts.initApplicationTexts(applicationId, propertyFileString);
		};
		/**
		 * Dispatcher method that loops over requestConfigurations and matches its members either _createOrUpdateLocalText (in case of method = 'POST' OR 'PUT')
		 * or _deleteLocalText (in case of method = 'DELETE').
		 * Only 'texts' is supported as entitySetName.
		 * @param {{entitySetName: string, inputParameters: {value: string}[], method: string, application: string, data: object }[]} requestConfigurations - data contains data for create/update
		 * @private
		 */
		this._applyChangesOnTextFile = function(requestConfigurations) {
			requestConfigurations.forEach(function (singleRequestConfiguration) {
				if (singleRequestConfiguration.entitySetName === 'texts'){
					switch (singleRequestConfiguration.method) {
						case "POST":
							var textElementToCreate = singleRequestConfiguration.data;
							this._createOrUpdateLocalText(textElementToCreate);
							break;
						case "PUT":
							var textElementToUpdate = singleRequestConfiguration.data;
							this._createOrUpdateLocalText(textElementToUpdate);
							break;
						case "DELETE":
							var applicationId = singleRequestConfiguration.application;
							var textElementId = singleRequestConfiguration.inputParameters[0].value;
							this._deleteLocalText(applicationId, textElementId);
							break;
						default:
							messageHandler.check(false, 'The method ' + singleRequestConfiguration.method + ' is not supported during text processing in batch mode by the modeler proxy.');
							break;
					}
				} else {
					messageHandler.check(false, 'The create/update/delete operation on entity set ' + singleRequestConfiguration.entitySetName + ' is not supported by the modeler proxy.');
				}
			}.bind(this));
		};
		this._createTextFileOfApplication = function(applicationId){
			return proxyTextHandlerForLocalTexts.createTextFileOfApplication(applicationId);
		};
		/**
		 * local wrapper for addText of proxyTextHandlerForLocalTexts
		 * @param {{ TextElement : string|undefined, TextElementDescription: string, Language: string, TextElementType: string, MaximumLength: number, Application: string, TranslationHint: string }} text
		 * @private
		 */
		this._createOrUpdateLocalText = function(text){
			proxyTextHandlerForLocalTexts.addText(text);
		};
		/**
		 * local wrapper for removeText of proxyTextHandlerForLocalTexts
		 * @param {string} applicationId - guid of application for text file
		 * @param {string} textElementId - guid of text element that shall be deleted
		 * @private
		 */
		this._deleteLocalText = function(applicationId, textElementId){
			var data = {
				application: applicationId,
				inputParameters: [{value: textElementId}]
			};
			proxyTextHandlerForLocalTexts.removeText(data);
		};
		this._updateRemoteTextFile = function(applicationId, textFileLanguage, textFile, isTextPoolCleanup) {
			var promise = new Promise(function(resolve, reject){
				var uriForUpdateTextPropertyFile;
				if(isTextPoolCleanup === true) {
					// Called when executing textpool cleanup
					uriForUpdateTextPropertyFile = resolveUri(textFilesUri + '/' + applicationId);
				} else {
					// Called when executing import from file system
					uriForUpdateTextPropertyFile = resolveUri(textFilesUri + '/' + applicationId + '/' + textFileLanguage);
				}
				var data = {
					serializedTextFile: textFile
				};
				ajax({
					type: "PUT",
					data: JSON.stringify(data),
					url : uriForUpdateTextPropertyFile,
					success : function(oData, sStatus, oJqXHR) {
						resolve();
					},
					error : function(oJqXHR, sStatus, sError, originalMessageObject) {
						var oMessageObject = cloudFoundryUtils.buildErrorMessage(oJqXHR, "5230", [applicationId], originalMessageObject, messageHandler);
						reject(oMessageObject);
					},
					async : true
				});
			});
			return promise;
		};
		/**
		 * wrapper for readCollection (this is needed because legacy coding calls this method) - asynchronous
		 * @param {{entitySetName: String, filter: object, selectList: object, inputParameters: object, method: object}[]} requestConfigurations
		 * @param {function} callback with parameters {object[]} data and {object} messageObject
		 */
		this.readCollectionsInBatch = function(requestConfigurations, callback) {
			var request = requestConfigurations[0];
			messageHandler.check(request.entitySetName === 'configuration', "wrong usage, only 'configuration' is allowed");
			var aTerms = request.filter.getFilterTermsForProperty('Application');
			var applicationId = aTerms[0].getValue();

			function createCallbackForReadCollection() {
				function callbackFromProcessRequest(data, metadata, messageObject) {
					if (messageObject) {
						callback(undefined, messageObject);
					} else {
						var result = [];
						result.push(data);
						result.push(proxyTextHandlerForLocalTexts.getTextElements(applicationId));
						callback(result);
					}
				}
				return callbackFromProcessRequest;
			}
			this.readCollection(request.entitySetName, createCallbackForReadCollection(), request.inputParameters, request.selectList, request.filter);
		};

		//IMPORT VENDOR CONTENT
		function buildErrorMessageFromXhr(jqXHR, previousMessage, messageHandler) {
			var technicalMessage = messageHandler.createMessageObject({code : "5214", aParameters : [jqXHR.status, jqXHR.statusText]});
			if (previousMessage) {
				technicalMessage.setPrevious(previousMessage);
			}
			return technicalMessage;
		}
		/**
		 * import content from vendor layer
		 * @param {string} applicationId application id of application in vendor content
		 * @param {string} configurationId configuration id of configuration in vendor content, that shall be copied
		 * @param {function} callbackConfirmOverwrite will be used as decision, when configuration already exists in customer layer. This function is called with two functions as parameters:
		 * callbackConfirmOverwrite(callbackOverwrite, callbackCreateNew). The function callbackConfirmOverwrite must call one of these two functions.
		 * @param {function} callbackImport is returned, when import has finished.
		 * @param {function} registerApplicationCreatedOnServer applicationHandler has to be informed, that a new application in customer layer
		 * has been created
		 */
		this.importVendorContent = function(applicationId, configurationId, callbackConfirmOverwrite, callbackImport, registerApplicationCreatedOnServer) {
			this.readAllConfigurationsFromVendorLayer().done(function(vendorConfigurations){
				importVendorConfiguration(applicationId, configurationId, callbackConfirmOverwrite, callbackImport, registerApplicationCreatedOnServer, vendorConfigurations);
			}).fail(function(messageObject){
				callbackImport(undefined, undefined, messageObject);
			});
		};
		function importVendorConfiguration(applicationId, configurationId, callbackConfirmOverwrite, callbackImport, registerApplicationCreatedOnServer, allVendorConfigurations){
			var i;
			var applicationText, configurationText;
			var key = applicationId + "." + configurationId;
			for (i = 0; i < allVendorConfigurations.length; i++) {
				if (allVendorConfigurations[i].value === key) {
					configurationText = allVendorConfigurations[i].configurationText;
					applicationText = allVendorConfigurations[i].applicationText;
					break;
				}
			}

			ajax({
				type : "HEAD",
				url: resolveUri(analyticalConfigurationsUri + "/" + configurationId),
				success : function() {
					callbackConfirmOverwrite(callbackOverwrite, callbackCreateNew, configurationText);
				},
				error: function(jqXHR, textStatus, errorThrown, oMessage) {
					if (jqXHR.status === 404) {
						importConfigurationFromVendorLayer(configurationId, registerApplicationAndSendCallback);
					} else {
						var messageObject = buildErrorMessageFromXhr(jqXHR, oMessage, messageHandler);
						callbackImport(undefined, undefined, messageObject);
					}
				}
			});
			function registerApplicationAndSendCallback(configId, metadata, messageObject) {
				if (!messageObject) {
						registerApplicationCreatedOnServer(applicationId, applicationText);
				}
				callbackImport(configId, metadata, messageObject);
			}
			function callbackOverwrite() {
				importConfigurationFromVendorLayer(configurationId, callbackImport);
			}
			function callbackCreateNew(newConfigurationName) {
				var url = resolveUri(vendorAnalyticalConfigurationsUri + "/" + configurationId
							+ "?$select=SerializedAnalyticalConfiguration");
				ajax({
					type : "GET",
					url : url,
					success : function(data) {
						copyConfigurationToCustomerLayer(applicationId, newConfigurationName, data.serializedAnalyticalConfiguration, callbackImport);
					},
					error : function(jqXHR, textStatus, errorThrown, oMessage) {
						var messageObject = buildErrorMessageFromXhr(jqXHR, oMessage, messageHandler);
						callbackImport(undefined, undefined, messageObject);
					}
				});
			}
		}
		function copyConfigurationToCustomerLayer(applicationId, configurationName, serializedAnalyticalConfiguration, callbackImport) {
			var url = resolveUri(analyticalConfigurationsUri);
			var data = {
					analyticalConfigurationName : configurationName,
					application : applicationId,
					serializedAnalyticalConfiguration : serializedAnalyticalConfiguration
			};
			ajax({
				type : "POST",
				url : url,
				dataType : "json",
				data : JSON.stringify(data),
				success : function(data) {
					 callbackImport(data.analyticalConfiguration);
				},
				error : function(jqXHR, textStatus, errorThrown, oMessage) {
					var messageObject = buildErrorMessageFromXhr(jqXHR, oMessage, messageHandler);
					callbackImport(undefined, undefined, messageObject);
				}
			});
		}
		function importConfigurationFromVendorLayer(configurationId, callbackImport) {
			ajax({
				type :"PUT",
				url : resolveUri(vendorImportToCustomerLayerUri + "/" + configurationId),
				contentType: 'application/x-www-form-urlencoded', //NEEDED for put without data
				success : function() {
					callbackImport(configurationId);
				},
				error: function(jqXHR, textStatus, errorThrown, oMessage) {
					var messageObject = buildErrorMessageFromXhr(jqXHR, oMessage, messageHandler);
					callbackImport(undefined, undefined, messageObject);
				}
			});
		}
		var vendorContentList;
		/**
		 * reads all configuration files from vendor layer
		 * @returns {promise} the promise will resolve with an array of objects as { applicationText: title, configurationText: title, value: appId.configId}
		 */
		this.readAllConfigurationsFromVendorLayer = function() {
			var deferred = jQuery.Deferred();

			if (vendorContentList) {
				deferred.resolve(vendorContentList);
			} else {
				ajax({
					url : resolveUri(vendorAnalyticalConfigurationsUri + "?$select=Application,ApplicationName,AnalyticalConfiguration,AnalyticalConfigurationName"),
					success : function(result) {
						var configurations = [];
						if (result !== null) {
							result.forEach(function(data){
								configurations.push({
									configurationText : data.analyticalConfigurationName,
									applicationText : data.applicationName,
									value : data.application + '.' + data.analyticalConfiguration });
							});	
						}
						vendorContentList = configurations;
						deferred.resolve(configurations);
					},
					error : function (jqXHR, textStatus, errorThrown, oMessage) {
						var technicalMessage = buildErrorMessageFromXhr(jqXHR, oMessage, messageHandler);
						var messageObject = messageHandler.createMessageObject({code : '5231'});
						messageObject.setPrevious(technicalMessage);
						deferred.reject(messageObject);
					}
				});
			}
			return deferred.promise();
		};
		/**
		 * @see sap.apf.core.ajax
		 */
		function ajax(oSettings) {
			return inject.instances.ajaxHandler.send(oSettings);
		}
	}
	var module = {
		ModelerProxy: ModelerProxy
	};
	return module;
}, true);
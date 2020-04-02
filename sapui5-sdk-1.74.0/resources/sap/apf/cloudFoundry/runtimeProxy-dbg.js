/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
/*global sap, jQuery */

sap.ui.define([
	'sap/apf/cloudFoundry/utils'
], function(Utils) {
	'use strict';

	/**
	 * @class This proxy implements the REST requests for reading the analytical configuration and texts at runtime.
	 * @name sap.apf.cloudFoundry.RuntimeProxy
	 * @since SAP UI5 1.54.0.
	 * @param {object} serviceConfiguration this is not needed for this proxy because service configuration
	 * is part of the injected manifest
	 * @param {object} inject
	 * @param {object} inject.instances
	 * @param {sap.apf.core.MessageHandler} inject.instances.messageHandler
	 * @param {sap.apf.core.Instance} inject.instances.coreApi
	 * @param {object} inject.manifests
	 * @param {object} inject.manifests.manifest the manifest of the component with data source information of the rest end points
	 */
	function RuntimeProxy(serviceConfiguration, inject) {
		var messageHandler = inject.instances.messageHandler;
		var coreApi = inject.instances.coreApi;
		var manifest = inject.manifests.manifest;
		var dataSources = manifest["sap.app"].dataSources;
		var language = sap.ui.getCore().getConfiguration().getLanguage();
		var defaultHeaders = {
				"Content-Type": "application/json; charset=utf-8",
				"Accept-Language": language
			};
		var configurationAndTextFilesUri = dataSources && dataSources["apf.runtime.analyticalConfigurationAndTextFiles"]
									&& dataSources["apf.runtime.analyticalConfigurationAndTextFiles"].uri;
		if (!configurationAndTextFilesUri) {
			messageHandler.putMessage(messageHandler.createMessageObject({
				code: "5236",
				aParameters: ["apf.runtime.analyticalConfigurationAndTextFiles"]
			}));
		}

		var resolveUri = Utils.resolveUri.bind(this, inject.instances.coreApi);

		function getMetadata() {
			return {};
		}

		/**
		 * odata get operation for specific single entity (configuration) in asynchronous mode.
		 * Only the reading of a single configuration is supported.
		 * @param {string} entitySet value from sap.apf.core.constants.entitySets
		 * @param {function} callback function of form fn(entityData, metadata, messageObject)
		 * @param {object[]} [inputParameters]
		 */
		this.readEntity = function(entitySet, callback, inputParameters) {
			messageHandler.check(entitySet === 'configuration');
			var configurationId = inputParameters[0].value;

			var that = this;
			this.textFiles = undefined;
			var url = resolveUri(configurationAndTextFilesUri + "/" + configurationId);
			coreApi.ajax({
				url: url,
				success: function(result /*, textStatus, xhr*/) {
					var configFile = JSON.parse(result.analyticalConfiguration.serializedAnalyticalConfiguration);
					var applicationId = configFile.configHeader && configFile.configHeader.Application;
					var data = {
						SerializedAnalyticalConfiguration: result.analyticalConfiguration.serializedAnalyticalConfiguration,
						AnalyticalConfiguration: configurationId,
						Application: applicationId,
						AnalyticalConfigurationName: result.analyticalConfiguration.analyticalConfigurationName
					};
					that.textFiles = result.textFiles;
					callback(data, getMetadata());
				},
				error: function(jqXHR, textStatus, errorThrown, oMessage) {
					var message = messageHandler.createMessageObject({code: "5057", aParameters: [url]});
					if (oMessage) {
						message.setPrevious(oMessage);
					}
					callback(undefined, getMetadata(), message);
				},
				headers : defaultHeaders
			});
		};
		/**
		 * odata get operation for specific type (application or configuration) asynchronously
		 * @param {string} entitySetName value from sap.apf.core.constants.entitySets
		 * @param {function} callback function of form fn(result, metadata, messageObject)
		 * @param {object[]|undefined} [inputParameters]
		 * @param {string[]|undefined} [selectList] holds all properties, that shall be in the select list
		 * @param {sap.apf.core.utils.Filter} [filter] additional filter expressions
		 */
		this.readCollection = function(entitySetName, callback, inputParameters, selectList, filter) {
			messageHandler.check(entitySetName === "texts");
			var aTerms = filter.getFilterTermsForProperty('Application');
			var applicationId = aTerms[0].getValue();
			if (!this.textFiles) {
				callback(undefined, getMetadata(), messageHandler.createMessageObject({
					code: "5222",
					aParameters: [applicationId]
				}));
				return;
			}
			var result = Utils.mergeReceivedTexts(this.textFiles, messageHandler);
			callback(result.texts, getMetadata(), result.messageObject);
		};
	}
	sap.apf.cloudFoundry.RuntimeProxy = RuntimeProxy;
	return RuntimeProxy;
}, true /* export to global, remove when all usages use define*/);
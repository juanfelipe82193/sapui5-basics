/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/apf/cloudFoundry/utils'
], function(Utils) {
	'use strict';

	/**
	 * @class The class implements the REST interface on client side for creation, reading and update of analysis paths
	 * on the SAP CloudFoundry Platform. It assumes, that analytical configuration id is included in URL (available via component data).
	 * @name sap.apf.cloudFoundry.AnalysisPathProxy
	 * @since SAP UI5 1.54.0.
	 * @param {object} inject inject structure
	 * @param {sap.apf.core.MessageHandler} inject.instances.messagehandler message handler
	 * @param {sap.apf.core.Instance} inject.instances.coreApi core api
	 * @param {sap.apf.cloudFoundry.AjaxHandler} inject.instances.ajaxHandler handles the ajax call
	 * @param {object} inject.manifests.manifest manifest of the component
	 */
	var AnalysisPathProxy = function(inject) {
		var messageHandler = inject.instances.messageHandler;
		var coreApi = inject.instances.coreApi;
		var manifest = inject.manifests.manifest;
		var dataSources = manifest["sap.app"].dataSources;
		var analysisPathsUri = dataSources && dataSources["apf.runtime.analysisPaths"] && dataSources["apf.runtime.analysisPaths"].uri;
		var defaultHeaders = {
			"Content-Type": "application/json; charset=utf-8"
		};

		var resolveUri = Utils.resolveUri.bind(this, inject.instances.coreApi);

		/**
		 * @description Gets the stored path from server and deserializes it in the runtime environment. As a result, the current path is replaced
		 * by the path, that has been loaded from the server.
		 * @param {String} analysisPathId GUID to identify the path
		 * @param {function} callback(oResponse, oEntityMetadata, oMessageObject)
		 */
		this.openPath = function(analysisPathId, callback) {
			var url = resolveUri(analysisPathsUri + "/" + analysisPathId + "?$select=AnalysisPathName,SerializedAnalysisPath");
			ajax({
				method : "GET",
				url : url,
				dataType : "json",
				success : function(result /*, textStatus, xhr*/) {
					var data = {
							AnalysisPathName : result.analysisPath.analysisPathName,
							SerializedAnalysisPath : JSON.parse(result.analysisPath.serializedAnalysisPath)
					};
					callback({ path : data, status : "successful" }, getMetadata());
				},
				error : function(jqXHR, textStatus, errorThrown, oMessage) {
					var fatalMessage = buildErrorMessage(jqXHR, "5252", [ analysisPathId ], oMessage, messageHandler);
					messageHandler.putMessage(fatalMessage);//same handling in persistence
				},
				headers : defaultHeaders
			});
		};
		/**
		 * @description stores a new analysis path on server
		 * @param {string} analysisPathName Name of the path.
		 * @param {function} callback(response, entityMetadata, messageObject)
		 * @param {object} serializableApfState Object containing serialized internal state
		 */
		this.createPath = function(analysisPathName, callback, serializableApfState) {
			var analyticalConfigurationId = getAnalyticalConfigurationId();
			if (analyticalConfigurationId === undefined) {
				callback({status : "failed"}, undefined, messageHandler.createMessageObject({ code : 5075}));
				return;
			}
			var structuredAnalysisPath = createStructuredAnalysisPath(serializableApfState);
			var data = {
					analysisPathName : analysisPathName,
					analyticalConfiguration : analyticalConfigurationId,
					structuredAnalysisPath : JSON.stringify(structuredAnalysisPath),
					serializedAnalysisPath : JSON.stringify(serializableApfState)
			};
			ajax({
				method : "POST",
				url : resolveUri(analysisPathsUri),
				data : JSON.stringify(data),
				dataType : "json",
				success : function(result /*, textStatus, xhr*/) {
					callback({ AnalysisPath : result.analysisPath, status : "successful" }, getMetadata());
				},
				error : function(jqXHR, textStatus, errorThrown, oMessage) {
					var message = buildTechnicalErrorMessageFromXhr(jqXHR, oMessage, messageHandler);
					callback({status : "failed"}, undefined, message);
				},
				headers : defaultHeaders
			});
		};
		/**
		 * @description Overwrites the already existing path with same analysis path id
		 * @param {String} analysisPathId GUID to identify the path
		 * @param {String} analysisPathName name of the path
		 * @param {function} callback(oResponse, oEntitiyMetadata, oMessageObject)
		 * @param {object} serializableApfState Object containing serialized internal stated
		 */
		this.modifyPath = function(analysisPathId, analysisPathName, callback, serializableApfState) {
			var structuredAnalysisPath = createStructuredAnalysisPath(serializableApfState);
			var data = {
					analysisPathName : analysisPathName,
					structuredAnalysisPath : JSON.stringify(structuredAnalysisPath),
					serializedAnalysisPath : JSON.stringify(serializableApfState)
			};
			ajax({
				method : "PUT",
				url : resolveUri(analysisPathsUri + "/" + analysisPathId),
				data : JSON.stringify(data),
				dataType : "json",
				success : function(/* result, textStatus, xhr*/) {
					callback({ AnalysisPath : analysisPathId, status : "successful" }, getMetadata());
				},
				error : function(jqXHR, textStatus, errorThrown, oMessage) {
					var message = buildTechnicalErrorMessageFromXhr(jqXHR, oMessage, messageHandler);
					callback({status : "failed"}, undefined, message);
				},
				headers : defaultHeaders
			});
		};
		/**
		 * @description Deletes a path
		 * @param {String} analysisPathId GUID to identify the path
		 * @param {function} callback(response, entityMetadata, messageObject)
		 */
		this.deletePath = function(analysisPathId, callback) {
			ajax({
				method : "DELETE",
				url : resolveUri(analysisPathsUri + "/" + analysisPathId),
				success : function(/* result, textStatus, xhr*/) {
					callback({status : "successful" }, getMetadata());
				},
				error : function(jqXHR, textStatus, errorThrown, oMessage) {
					var message = buildTechnicalErrorMessageFromXhr(jqXHR, oMessage, messageHandler);
					callback({status : "failed"}, undefined, message);
				}
			});
		};
		/**
		 * @description Reads all stored paths from server
		 * @param {function} callback This callback function is called after function readPaths has been executed.
		 * Signature is callback(response, entityMetadata, messageObject).
		 */
		this.readPaths = function(callback) {
			function transformResponseToApiFormat (result) {
				var paths = [];
				if (result.analysisPaths !== null) {
					result.analysisPaths.forEach(function(path){
						paths.push({
							AnalysisPath : path.analysisPath,
							AnalysisPathName : path.analysisPathName,
							LastChangeUTCDateTime : path.lastChangeUtcDateTime,
							StructuredAnalysisPath : JSON.parse(path.structuredAnalysisPath)
						});
					});
				}
				return paths;
			}

			var analyticalConfigurationId = getAnalyticalConfigurationId();
			if (analyticalConfigurationId === undefined) {
				callback({status : "failed"}, undefined, messageHandler.createMessageObject({ code : 5075}));
				return;
			}
			var url = resolveUri(analysisPathsUri + "?$select=AnalysisPath,AnalysisPathName,LastChangeUtcDateTime,StructuredAnalysisPath&$filter=(AnalyticalConfiguration%20eq%20'"
				+ analyticalConfigurationId + "')");
			ajax({
				url : url,
				dataType : "json",
				success : function(result /*, textStatus, xhr*/) {
					var paths = transformResponseToApiFormat(result);
					callback({ paths : paths, status : "successful" }, getMetadata());
				},
				error : function(jqXHR, textStatus, errorThrown, oMessage) {
					var message = buildTechnicalErrorMessageFromXhr(jqXHR, oMessage, messageHandler);
					callback({status : "failed"}, undefined, message);
				},
				headers : defaultHeaders
			});
		};

		function getMetadata() {
			return undefined;
		}

		function buildErrorMessage(jqXHR, messageCode, parameters, previousMessage, messageHandler) {//TODO replace with utils function if available
			var message = messageHandler.createMessageObject({code : messageCode, aParameters : parameters});
			var technicalMessage = buildTechnicalErrorMessageFromXhr(jqXHR, previousMessage, messageHandler);
			message.setPrevious(technicalMessage);
			return message;
		}
		function buildTechnicalErrorMessageFromXhr(jqXHR, previousMessage, messageHandler) {
			var technicalMessage = messageHandler.createMessageObject({code : "5214", aParameters : [jqXHR.status, jqXHR.statusText]});
			if (previousMessage) {
				technicalMessage.setPrevious(previousMessage);
			}
			return technicalMessage;
		}
		function getAnalyticalConfigurationId() {
			var config = coreApi.getStartParameterFacade().getAnalyticalConfigurationId();
			return config && config.configurationId;
		}
		function createStructuredAnalysisPath(serializablePath) {
			var structuredSteps = [];
			var steps = serializablePath.path.steps;

			steps.forEach(function(step) {
				structuredSteps.push({
					stepId : step.stepId,
					selectedRepresentationId : step.binding.selectedRepresentationId
				});
			});
			return {
					steps : structuredSteps,
					indexOfActiveStep : serializablePath.path.indicesOfActiveSteps[0]
			};
		}
		function ajax(ajaxSettings) {
			inject.instances.ajaxHandler.send(ajaxSettings);
		}
	};
	/* BEGIN_COMPATIBILITY */
	sap.apf = sap.apf || {};
	sap.apf.cloudFoundry = sap.apf.cloudFoundry || {};
	sap.apf.cloudFoundry.AnalysisPathProxy = AnalysisPathProxy;
	/* END_COMPATIBILITY */
	return AnalysisPathProxy;

}, true);
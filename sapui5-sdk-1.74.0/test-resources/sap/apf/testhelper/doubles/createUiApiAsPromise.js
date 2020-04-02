/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP SE. All rights reserved
 */
/*global sap, jQuery, sinon,  OData */
sap.ui.define([
	'sap/apf/testhelper/doubles/component',
	'sap/apf/testhelper/doubles/ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch',
	'sap/apf/testhelper/doubles/navigationHandler',
	'/sap/apf/api',
	'sap/apf/testhelper/helper'
], function(
	Component,
	AjaxWithAdjustedResourcePathsAndApplicationConfigurationPatch,
	_NavigationHandler,
	_ApfApi,
	_Helper
) {
'use strict';

	/**
	 * @description Create component and remember the apis
	 * @param {string} compId unique id of the component
	 * @param {string} applicationConfigPath path of the application configuration
	 * @param {object} inject  injected constructors and functions for the API
	 */
	function createUiApiAsPromise(compId, applicationConfigPath, inject) {
		var uiApi = {};
		var oComponent;
		var deferred = jQuery.Deferred();
		var path = applicationConfigPath || "/apf-test/test-resources/sap/apf/testhelper/config/applicationConfiguration.json";
		var componentData = {};
		function resolvePromiseWithUiApi() {
			var dependenciesFromProbe = oComponent.getProbe();

			uiApi.oComponent = oComponent;
			uiApi.oApi = oComponent.getApi();
			uiApi.oUiApi = dependenciesFromProbe.uiApi;
			uiApi.oCoreApi = dependenciesFromProbe.coreApi;
			uiApi.oSerializationMediator = dependenciesFromProbe.serializationMediator;
			uiApi.oFilterIdHandler = dependenciesFromProbe.filterIdHandler;
			uiApi.oStartFilterHandler = dependenciesFromProbe.startFilterHandler;
			deferred.resolve(uiApi);
		}
		componentData.startupParameters = jQuery.sap.getUriParameters().mParams;
		inject = inject || {};
		inject.functions = inject.functions || {};
		inject.functions.ajax = inject.functions.ajax || AjaxWithAdjustedResourcePathsAndApplicationConfigurationPatch;
		var afterStartupCallback;
		if (!inject.afterStartupCallback) {
			afterStartupCallback = function(){
				return resolvePromiseWithUiApi();
			};
		} else {
			afterStartupCallback = function(){
				inject.afterStartupCallback();
				return resolvePromiseWithUiApi();
			};
		}
		oComponent = Component.create(uiApi, compId, inject, path, componentData, inject.beforeStartupCallback, afterStartupCallback);
		return deferred.promise();
	}

	return createUiApiAsPromise;
}, true /*GLOBAL_EXPORT*/);
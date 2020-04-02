/* global sap */

sap.ui.define([
	'sap/apf/testhelper/doubles/UiInstance',
	'sap/apf/testhelper/doubles/component',
	'sap/apf/testhelper/doubles/ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch'
], function(UiInstance, ComponentDouble, ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch) {
	'use strict';

	/**
	 * @description Creates a component. See configuration object for the various options.
	 * @param {object} contextToBeEnriched the component, api, component container will be added as properties to this object. So test has access to
	 * public methods of the api and the public methods of the component.
     * @param {object} configuration parametrizes the component creation.
	 * @param {string} [configuration.componentId] unique id of the component
	 * @param {boolean} [configuration.stubAjaxForResourcePaths] required when loading application configuration on various servers
	 * @param {boolean} [configuration.doubleUiInstance] when true, the ui instance is replaced by its double
	 * @param {boolean} [configuration.noLoadingOfApplicationConfig] when true, then the application config is not loaded
	 * @param {string} [configuration.path] path of the application configuration. No path is loaded, when empty string is supplied. 
	 *            If nothing is provided, then default application configuration is loaded (Except that noLoadingOfApplicationConfig is set to true).
	 * @param {object} [configuration.inject] injected constructors, probes and functions for the API
	 * @param {object} [configuration.componentData]
	 */
	 function createComponentAsPromise(contextToBeEnriched, configuration) {
		var deferred = jQuery.Deferred();
		var id = configuration.componentId || "CompUI";
		var applicationConfigurationPath = determinePathOfApplicationConfiguration(configuration);

		var apiInject = configuration.inject || {};
		if (configuration.doubleUiInstance) {
			apiInject.constructors = apiInject.constructors || {};
			apiInject.constructors.UiInstance = apiInject.constructors.UiInstance || UiInstance;
		}
		if (configuration.stubAjaxForResourcePaths) {
			apiInject.functions = apiInject.functions || {};
			apiInject.functions.ajax = ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch;
		}
		if (!configuration.onAfterStartApfCallback) {
			configuration.onAfterStartApfCallback = function() {
				deferred.resolve();
			};
		} else {
			configuration.onAfterStartApfCallback = function() {
				
				configuration.onAfterStartApfCallback();
				deferred.resolve();
			};
		}
		contextToBeEnriched.oComponent = ComponentDouble.create(contextToBeEnriched, id, apiInject, applicationConfigurationPath, configuration.componentData, configuration.onBeforeStartApfCallback,
				configuration.onAfterStartApfCallback);
		contextToBeEnriched.oApi = contextToBeEnriched.oComponent.getApi();
		return deferred.promise();
	}


	function determinePathOfApplicationConfiguration(configuration) {

		if (configuration.noLoadingOfApplicationConfig) {
			return "";
		} else if (configuration.path === undefined) {
			var path = "/apf-test/test-resources/sap/apf/testhelper/config/applicationConfiguration.json";
			var sHref = jQuery(location).attr('href');
			sHref = sHref.replace(location.protocol + "//" + location.host, "");
			sHref = sHref.slice(0, sHref.indexOf("test-resources"));
			path = path.replace(/\/apf-test\//g, sHref);
			return path;
		} 
		return configuration.path;
	}
	/*BEGIN_COMPATIBILITY*/
	sap.apf.testhelper.doubles.createComponentAsPromise = createComponentAsPromise;
	/*END_COMPATIBILITY*/

	return createComponentAsPromise;
}, true /*GLOBAL_EXPORT*/);
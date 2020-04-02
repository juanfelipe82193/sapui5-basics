/*global sap, jQuery, sinon, OData */
sap.ui.define([], function() {
	'use strict';

	var saveContainer; // cannot be used in concurrent tests !!!
		/**
		 * save all constructor functions, that are overwritten
		 */
		function saveConstructors() {
			saveContainer = {};
			var o = saveContainer;
			o.fnAjax = sap.apf.core.ajax;
			o.fnMetadata = sap.apf.core.Metadata;
			o.fnSessionHandler = sap.apf.core.SessionHandler;
			o.fnRequest = sap.apf.core.Request;
			o.fnResourcePathHandler = sap.apf.core.ResourcePathHandler;
			o.fnUiInstance = sap.apf.ui.Instance;
			o.fnStartParameter = sap.apf.utils.StartParameter;
			o.fnStartFilterHandler = sap.apf.utils.StartFilterHandler;
			o.fnMessageCallbackForStartup = sap.apf.messageCallbackForStartup;
		}
		/**
		 * restore the constructor functions. This must be called in every tear down, whenever constructors have been overwritten in test setup
		 */
		function restoreConstructors() {
			var o = saveContainer;
			sap.apf.core.SessionHandler = o.fnSessionHandler;
			sap.apf.core.Request = o.fnRequest;
			sap.apf.core.ResourcePathHandler = o.fnResourcePathHandler;
			sap.apf.core.Metadata = o.fnMetadata;
			sap.apf.core.ajax = o.fnAjax;
			sap.apf.ui.Instance = o.fnUiInstance;
			sap.apf.utils.StartParameter = o.fnStartParameter;
			sap.apf.utils.StartFilterHandler = o.fnStartFilterHandler;
			sap.apf.messageCallbackForStartup = o.fnMessageCallbackForStartup;
			saveContainer = undefined;
		}

	sap.apf.integration.withDoubles.helper = sap.apf.integration.withDoubles.helper || {};
	sap.apf.integration.withDoubles.helper.restoreConstructors = restoreConstructors;
	sap.apf.integration.withDoubles.helper.saveConstructors = saveConstructors;
	return {
		saveConstructors: saveConstructors,
		restoreConstructors: restoreConstructors
	};
}, true /*GLOBAL_EXPORT*/);

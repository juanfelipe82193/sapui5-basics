/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(function() {
	'use strict';
	/**
	 * @public
	 * @experimental The complete interface is subject to ongoing work and not yet stable (as of Version 1.24.0).
	 * @class The interface proxy passed to a representation which provides access to required APF methods. This constructor is used by apf.api.
	 * It can be also used to build unit tests that need an interface proxy between APF and representations.
	 * @name sap.apf.ui.representations.RepresentationInterfaceProxy
	 * @param {sap.apf.core.Instance} oCoreApi
	 * @param {sap.apf.ui.Instance} oUiApi
	 */
	var RepresentationInterfaceProxy = function(oCoreApi, oUiApi) {
		this.type = 'RepresentationInterfaceProxy';
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#putMessage
		 * @description see {@link sap.apf.Api#putMessage}
		 */
		this.putMessage = function(oMessage) {
			return oCoreApi.putMessage(oMessage);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#createMessageObject
		 * @description see {@link sap.apf.Api#createMessageObject}
		 */
		this.createMessageObject = function(oConfig) {
			return oCoreApi.createMessageObject(oConfig);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#getActiveStep
		 * @description see {@link sap.apf.Api#getActiveStep}
		 */
		this.getActiveStep = function() {
			return oCoreApi.getActiveStep();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#setActiveStep
		 * @description see {@link sap.apf.Api#setActiveStep}
		 */
		this.setActiveStep = function(oStep) {
			return oCoreApi.setActiveStep(oStep);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#getTextNotHtmlEncoded
		 * @description see {@link sap.apf.Api#getTextNotHtmlEncoded}
		 */
		this.getTextNotHtmlEncoded = function(oLabel, aParameters) {
			return oCoreApi.getTextNotHtmlEncoded(oLabel, aParameters);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#getExits
		 * @description get exits registered on oInject
		 */
		this.getExits = function() {
			return oUiApi.getCustomFormatExit();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1. Instead use the method {@link sap.apf.ui.representations.RepresentationInterfaceProxy#selectionChanged}.
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#updatePath
		 * @description see {@link sap.apf.Api#updatePath}
		 */
		this.updatePath = function(fnStepProcessedCallback) {
			return oCoreApi.updatePath(fnStepProcessedCallback);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#createFilter
		 * @description see {@link sap.apf.Api#createFilter}
		 */
		this.createFilter = function() {
			return oCoreApi.createFilter();
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#selectionChanged
		 * @description see {@link sap.apf.Api#selectionChanged}
		 */
		this.selectionChanged = function(bRefreshAllSteps) {
			return oUiApi.selectionChanged(bRefreshAllSteps);
		};
		/**
		 * @private
		 * @deprecated since Version 1.23.1.
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#getEventCallback
		 * @description see {@link sap.apf.Api#getEventCallback}
		 */
		this.getEventCallback = function(sEventType) {
			return oUiApi.getEventCallback(sEventType);
		};
		/**
		 * @public
		 * @function
		 * @name sap.apf.ui.representations.RepresentationInterfaceProxy#getUiApi
		 * @description returns the oUiAPi
		 */
		this.getUiApi = function() {
			return oUiApi;
		};
	}; // InterfaceProxy

	return RepresentationInterfaceProxy;
}, /* GLOBAL_EXPORT */ true);
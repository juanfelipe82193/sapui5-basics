/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2018 SAP AG. All rights reserved
 */
sap.ui.define([], function() {
	"use strict";

	var IfUiInstance = function(oInject) {

		/**
		 *@description Getter for Analysis Path
		 *@see sap.apf.ui.reuse.view.messageHandler
		 *@returns {oNotificationView }
		 */
		this.getAnalysisPath = function() {
			throw new Error("getAnalysisPath not implemented");
		};

		/**
		 *@description Getter for Notification Bar
		 *@see sap.apf.ui.reuse.view.messageHandler
		 *@returns {oNotificationView }
		 */
		this.getNotificationBar = function() {
			throw new Error("getNotificationBar not implemented");
		};

		/**
		 *@description Creates a step container to hold representation
		 *@see sap.apf.ui.reuse.view.stepContainer
		 *@returns {stepContainer}
		 */
		this.getStepContainer = function() {
			throw new Error("getStepContainer not implemented");
		};
		/**
		 *@memberOf sap.apf.Api#addMasterFooterContent
		 *@description Calls the updatePath with proper callback for UI.
		 * 				It also refreshes the steps either from the active step or
		 * 				all the steps depending on the boolean value passed.
		 *@param {boolean}
		 */
		this.selectionChanged = function(bRefreshAllSteps) {
			throw new Error("selectionChanged not implemented");
		};

		this.createApplicationLayout = function() {
			throw new Error("createApplicationLayout not implemented");
		};

		/**
		 *@memberOf sap.apf.ui
		 *@description Creates a main application layout with the header and main
		 *              view
		 *@return layout view
		 */
		this.getLayoutView = function() {
			throw new Error("getLayoutView not implemented");
		};

		/**
		 *@memberOf sap.apf.ui
		 *@description adds content to detail footer
		 *@param oControl
		 *            {object} Any valid UI5 control
		 */
		this.addDetailFooterContent = function(oControl) {
			throw new Error("addDetailFooterContent not implemented");
		};
		/**
		 *@memberOf sap.apf.ui
		 *@description adds content to master footer
		 *@param oControl
		 *            {object} Any valid UI5 control
		 */
		this.addMasterFooterContentRight = function(oControl) {
			throw new Error("addMasterFooterContentRight not implemented");
		};
		/**
		 *@memberOf sap.apf.ui
		 *@description registers callback for event callback.
		 *@param fn callback
		 */
		this.setEventCallback = function(sEventType, fnCallback) {
			throw new Error("setEventCallback not implemented");
		};
		/**
		 *@memberOf sap.apf.ui
		 *@returns the registered callback for event callback.
		 */
		this.getEventCallback = function(sEventType) {
			throw new Error("getEventCallback not implemented");
		};
		/**
		 * @private
		 * @function
		 * @name sap.apf.ui#initializeContextHandling
		 * @memberOf sap.apf.ui
		 * @description initializes the context handling by instantiating an initializing the facet filter handler.
		 */
		this.initializeContextHandling = function () {
			throw new Error("initializeContextHandling not implemented");
		};
		/**
		 * @private
		 * @experimental Refactoring trigerred by the Mozilla bug
		 * @name sap.apf.ui#drawFacetFilter
		 * @member of sap.apf.ui
		 * @param {Object} subHeaderInstance - Pass the sub header instance to add the facet filter view item
		 * @description draws facet filter on layout subHeader.
		 */
		this.drawFacetFilter = function (subHeaderInstance) {
			throw new Error("drawFacetFilter not implemented");
		};

		/**
		 * @private
		 * @function
		 * @name sap.apf.ui#contextChanged
		 * @param {boolean} bResetPath - True when new path is triggered.
		 * @memberOf sap.apf.ui
		 * @description Event to be called when the path context is changed/updated.
		 * Notifies facetfilterhandler and application of context change.
		 */
		this.contextChanged = function (bResetPath) {
			throw new Error("contextChanged not implemented");
		};

		/**
		 * @private
		 * @function
		 * @name sap.apf.ui#getFormattedFilters
		 * @param {string} sProperty - Property name of filter.
		 * @memberOf sap.apf.ui
		 * @description Currently used by printHelper to get formatted filter values.
		 * @returns {Array} when property is available as a facet filter.
		 * 		Array will be of the form : [{
		 * 			name: "sPropertyText",
		 * 			operator: "EQ",
		 * 			value: "sKey - sText",
		 * 			formatted: true
		 * 		}]
		 * null when property is not available as a facet filter.
		 * */
		this.getFormattedFilters = function (sProperty) {
			throw new Error("getFormattedFilters not implemented");
		};

		this.handleStartup = function() {
			throw new Error("handleStartup not implemented");
		};
	};

	return IfUiInstance;
}, true /* global_export */);
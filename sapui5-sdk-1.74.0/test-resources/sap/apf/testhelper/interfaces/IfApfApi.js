/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap */
jQuery.sap.declare("sap.apf.testhelper.interfaces.IfApfApi");
sap.apf.testhelper.interfaces.IfApfApi = function() {
	'use strict';
	this.type = "IfApi";
	this.getStartParameterFacade = function() {
		throw new Error("getStartParameterFacade not implemented");
	};
	/**
	 * @description A message is passed to the message handler for
	 *              further processing. This can be one of the following message type defined in sap.apf.constants.messageServerity
	 * @param {sap.apf.core.MessageObject} oMessageObject The message object shall be created by method {sap.apf.createMessageObject}.
	 * @returns undefined
	 */
	this.putMessage = function(oMessage) {
		throw new Error("putMessage not implemented");
	};
	/**
	 * @description Creates a message object. The message processing is started with sap.apf.putMessage, which expects as
	 * argument a message object of type {sap.apf.core.MessageObject}. So first create the message object and afterwards call sap.apf.putMessage
	 * with the message object as argument.
	 * @param {object} oConfig Configuration object for the message object.
	 * @param {object} oConfig.code  
	 *            The message is classified by its code. The code identifies an entry in the message configuration.
	 * @param {object} [oConfig.aParameters]
	 *            Additional parameters for the message. The parameters are filled into the message text, when the message
	 *            will be processed by the text resource handler. 
	 * @param {object} [oConfig.oCallingObject]
	 *            Reference of the calling object. This can be used later to
	 *            visualize on the user interface, where the message occurred. 
	 * @returns {sap.apf.core.MessageObject}
	 */
	this.createMessageObject = function(oConfig) {
		throw new Error("createMessageObject not implemented");
	};
	/**
	 * @description The handling of the window.onerror by the message handler is
	 *              either switched on or off. Per default the handling is deactivated.
	 * @param {boolean} bHandling
	 * @returns undefined
	 */
	this.activateOnErrorHandling = function(bHandling) {
		throw new Error("activateOnErrorHandling not implemented");
	};
	/**
	 * @description Returns a copy of APF fatal log messages. The last message put is on first position in array. 
	 * @returns {string[]}
	 */
	this.getLogMessages = function() {
		throw new Error("getLogMessages not implemented");
	};
	/**
	 * @description Creates a step object from the configuration object and adds it to the path.
	 * @param {string} sStepId Step id as defined in the analytical content configuration.
	 * @param {function} fnStepProcessedCallback Callback function for path update. The first argument of the callback function is the step instance. The second argument is a flag, that indicates, whether there was an update or not.
	 * @param {string} [sRepresentationId] Parameter that allows definition of the representation id that shall 
	 * initially be selected. If omitted, the first configured representation will be selected.
	 * @return {sap.apf.core.Step}
	 */
	this.createStep = function(sStepId, fnStepProcessedCallback, sRepresentationId) {
		throw new Error("createStep not implemented");
	};
	/**
	 * @description Returns active step in analysis path. 
	 * @returns {sap.apf.core.Step}
	 */
	this.getActiveStep = function() {
		throw new Error("getActiveStep not implemented");
	};
	/**
	 * @description Returns category objects of all loaded category configuration objects.
	 * @returns {object[]} Object with configuration information about a category.
	 */
	this.getCategories = function() {
		throw new Error("getCategories not implemented");
	};
	/**
	 * @description Gets the ordered sequence of all steps in analysis path.
	 * Each step is a reference to the object in the path. 
	 * Each step shall always be identified by the reference to its step object, 
	 * e.g. in methods like removeStep, moveStepToPosition, setActiveStep, etc.
	 * @returns {sap.apf.core.Step[]} 
	 */
	this.getSteps = function() {
		throw new Error("getSteps not implemented");
	};
	/**
	 * @description Returns step templates based on all steps configured in the analytical content configuration. A step template contains static information and convenience functions. 
	 * @returns {object[]} 
	 */
	this.getStepTemplates = function() {
		throw new Error("getStepTemplates not implemented");
	};
	this.getFacetFilterConfigurations = function() {
		throw new Error("getFacetFilterConfigurations not implemented");
	};
	/**
	 * @description Retrieves the encoded text
	 * @param {object} oLabel || {string} Label object or text key
	 * @param {string[]} aParameters Array with parameters to replace place holders in text.
	 * @returns {string}
	 */
	this.getTextHtmlEncoded = function(oLabel, aParameters) {
		throw new Error("getTextHtmlEncoded not implemented");
	};
	/**
	 * @description Retrieves the not encoded text
	 * @param {object} oLabel || {string} Label object or text key
	 * @param {string[]} aParameters Array with parameters to replace place holders in text.
	 * @returns {string}
	 */
	this.getTextNotHtmlEncoded = function(oLabel, aParameters) {
		throw new Error("getTextNotHtmlEncoded not implemented");
	};
	/**
	 * @description Loads a new  application configuration in JSON format. 
	 * @param {string} sFilePath The absolute path of application configuration file. Host and port will be added in front of this path.
	 */
	this.loadApplicationConfig = function(sFilePath) {
		throw new Error("loadApplicationConfig not implemented");
	};
	/**
	 * @description This function returns those properties of the application configuration file that are not internally used.
	 * @returns {object}
	 */
	this.getApplicationConfigProperties = function() {
		throw new Error("getApplicationConfigProperties not implemented");
	};
	/**
	 * @description Moves a step in the analysis path to the specified target position. 
	 * @param {sap.apf.core.Step} oStep The step object to be moved
	 * @param {number} nPosition The target position. Must be a valid position in the path, between zero and length-1.
	 * @param {function} fnStepProcessedCallback Callback for update of steps. The first argument of the callback function is the step instance. The second argument is a flag, that indicates, whether there was an update or not.
	 * @returns undefined 
	 */
	this.moveStepToPosition = function(oStep, nPosition, fnStepProcessedCallback) {
		throw new Error("moveStepToPosition not implemented");
	};
	/** 
	 * @description Removes a step from the analysis path. 
	 * @param {sap.apf.core.Step} oStep The step object to be removed. The reference must be an object contained in the path. Otherwise, a message will be put. 
	 * @param {function} fnStepProcessedCallback Callback for update of steps. The first argument of the callback function is the step instance. The second argument is a flag, that indicates, whether there was an update or not.
	 * @returns undefined
	 */
	this.removeStep = function(oStep, fnStepProcessedCallback) {
		throw new Error("removeStep not implemented");
	};
	/**
	 * @description Removes all steps from the path and removes active step.
	 * @returns undefined 
	 */
	this.resetPath = function() {
		throw new Error("resetPath not implemented");
	};
	/**
	 * @description Sets handed over step as the active one.
	 * @param {sap.apf.core.Step} oStep the step to be set as active
	 * @returns undefined 
	 */
	this.setActiveStep = function(oStep) {
		throw new Error("setActiveStep not implemented");
	};
	/**
	 * @description Checks whether a step is active or not.
	 * @param {sap.apf.core.Step} oStep Step reference
	 * @returns {boolean} 
	 */
	this.stepIsActive = function(oStep) {
		throw new Error("stepIsActive not implemented");
	};
	/**
	 * @description The steps in the path will be updated. First it is detected,  whether a representation of a step 
	 * has changed its selection. If yes, then all subsequent steps will get a (cumulated) selection for retrieving data. 
	 * If a step has a different cumulated selection for retrieving data, then
	 * an OData request is executed for the particular step and the representation receives latest data.
	 * @param {function} fnStepProcessedCallback Callback function is executed for every step in the path.
	 * The first argument of the callback function is the step instance. The second argument is a flag, that indicates, whether there was an update or not.
	 * @returns undefined 
	 */
	this.updatePath = function(fnStepProcessedCallback) {
		throw new Error("updatePath not implemented");
	};
	/**
	 * @description Returns the location of the APF library on the server.
	 * @returns {string} 
	 */
	this.getApfLocation = function() {
		throw new Error("getApfLocation not implemented");
	};
	/**
	 * @description Creates a filter.
	 * @returns {sap.apf.utils.Filter}
	 */
	this.createFilter = function() {
		throw new Error("createFilter not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#addPathFilter
	 * @param {sap.apf.utils.Filter} filter 
	 * @description  Adds a context fragment for a path context.
	 * Creates a unique fragment and a corresponding identifier. 
	 * Subsequent changes need to be done by the update method providing the identifier.
	 * @returns  {number} ID to be provided for later updates of the same fragment.
	 */
	this.addPathFilter = function(filter) {
		throw new Error("addPathFilter not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#updatePathFilter
	 * @param {number|string} id Identifier of the context fragment as it was returned by addPathFilter method.
	 * @param {sap.apf.utils.Filter} filter 
	 * @description Updates a context fragment for the given identifier by fully replacing the existing one.
	 * @returns {string} id for update
	 */
	this.updatePathFilter = function(id, filter) {
		throw new Error("updatePathFilter not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#getPathFilter
	 * @param {number|string} Identifier of the context fragment as it was returned by addPathFilter method.
	 * @description Gets a context fragment for the given identifier by fully replacing the existing one.
	 * @returns {sap.apf.utils.Filter} filter for id
	 */
	this.getPathFilter = function(id) {
		throw new Error("getPathFilter not implemented");
	};
	/**
	 * @description Creates an object for performing an OData Request with HTTP GET method.
	 * @param {string}  sRequestId Identifies a request configuration, which is contained in the analytical content configuration.
	 * @returns {sap.apf.core.ReadRequest}
	 */
	this.createReadRequest = function(sRequestId) {
		throw new Error("createReadRequest not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#createReadRequestByRequiredFilter
	 * @description Creates an object for performing an OData Request with HTTP GET method.
	 * @param {object}  oConfiguration Request configuration
	 * @returns {sap.apf.core.ReadRequestByRequiredFilter}
	 */
	this.createReadRequestByRequiredFilter = function(oConfiguration) {
		throw new Error("createReadRequestByRequiredFilter not implemented");
	};
	/**
	 * @description Reads all stored paths from server. Result is returned as sorted list in descending order. Order criteria is the last changed date of a saved path.
	 * @param {function} fnCallback The first argument of the callback function is the server response as JS object. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred. 
	 * @returns undefined
	 */
	this.readPaths = function(fnCallback) {
		throw new Error("readPaths not implemented");
	};
	/**
	 * @description Saves or modifies the current path on server side under the provided name. 
	 * @param {string} [sPathId] Path with id to be modified.
	 * @param {string} sName Name of the path to be saved
	 * @param {function} fnCallback The first argument of the callback function is the server response as JS object. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
	 * @returns undefined
	 */
	this.savePath = function(sPathId, sName, fnCallback) {
		throw new Error("savePath not implemented");
	};
	/**
	 * @description Opens a path, that has been stored on server side and replaces the current path.
	 * @param {string} sPathId Identifies the analysis path to be opened
	 * @param {function} fnCallback The first argument of the callback function is the server response as JS object. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
	 * @param {number} [nActiveStep] Sets the active step.
	 * @returns undefined
	 */
	this.openPath = function(sPathId, fnCallback, nActiveStep) {
		throw new Error("openPath not implemented");
	};
	/**
	 * @description Deletes the path with the given ID on server
	 * @param {string} sPathId Identifies the analysis path to be deleted
	 * @param {function} fnCallback The first argument of the callback function is the server response as JS object. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
	 * @returns undefined
	 */
	this.deletePath = function(sPathId, fnCallback) {
		throw new Error("deletePath not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#selectionChanged
	 * @description A step index is passed to the function
	 *              to refresh subsequent step on filter change.
	 * @param {number} nIndex (zero based) of the step where selection has changed
	 * @returns undefined
	 */
	this.selectionChanged = function(nIndex) {
		throw new Error("selectionChanged not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#createApplicationLayout
	 * @description Creates the APF application layout
	 * @returns {sap.m.App}
	 */
	this.createApplicationLayout = function() {
		throw new Error("createApplicationLayout not implemented");
	};
	/**
	 * @private
	 * @function
	 * @name sap.apf.Api#startAPF
	 * @description Triggers the start-up of APF content creation and calls back APFContentCreated
	 * @returns {sap.m.App} - the APF content
	 */
	this.startApf = function() {
		throw new Error("startApf not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#addMasterFooterContent
	 * @description Adds control to master footer 
	 * @param {object} oControl any valid UI5 control
	 */
	this.addMasterFooterContent = function(oControl) {
		throw new Error("addMasterFooterContent not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#addFacetFilter
	 * @description Injects the application facet filter component into APF layout placeholder
	 * @returns undefined
	 */
	this.addFacetFilter = function(facetFilter) {
		throw new Error("addFacetFilter not implemented");
	};
	/**
	 * @description Register the function callback to be executed on the given event type. 
	 * 				fnCallback will be executed under a context and will be passed with arguments depending on the event type.
	 * @param {sap.apf.core.constants.eventType} sEventType is the type of event for registering the fnCallback for that particular event type
	 * 					printTriggered - Registers a callback for initial page print, this callback returns
	 * 									 2d array 
	 * 					contextChanged : Registers a callback for context change, which will set the context of the application  
	 * @param {function} fnCallback that will be executed depending on the event type.
	 * @returns true or false based on success or failure of registering the listener.
	 */
	this.setEventCallback = function(sEventType, fnCallback) {
		throw new Error("setEventCallback not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#customFormat
	 * @description Register the function callback to be added to the exit object.
	 * @param {function} fnCallback that will be added to the exit object.
	 */
	this.customFormat = function(fnCallback) {
		oUiApi.doCustomFormat(fnCallback);
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#setCallbackBeforeApfStartup
	 * @description Register the function callback to be executed before APF start-up.
	 * 				Callback is called with 'this' set to the Component instance
	 * @param {function} fnCallback that will be executed before APF start-up.
	 */
	this.setCallbackBeforeApfStartup = function(fnCallback) {
		throw new Error("setCallbackBeforeApfStartup not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#getPropertyValuesOfExternalContext
	 * @see sap.apf.utils.ExternalContext#getCombinedContext
	 */
	this.getPropertyValuesOfExternalContext = function() {
		throw new Error("getPropertyValuesOfExternalContext not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#setCallbackAfterApfStartup
	 * @description Register the function callback to be executed after APF start-up and content has been created.
	 * 				Callback is called with 'this' set to the Component instance
	 * @param {function} fnCallback that will be executed after APF start-up and content has been created.
	 */
	this.setCallbackAfterApfStartup = function(fnCallback) {
		throw new Error("setCallbackAfterApfStartup not implemented");
	};
	/**
	 * @private
	 * @deprecated
	 * @function
	 * @name sap.apf.Api#getEventCallback
	 * @param {sap.apf.core.constants.eventType} sEventType is the type of event for registering the fnCallback for that particular event type
	 * @returns the callback registered for the particular event type.
	 */
	this.getEventCallback = function(sEventType) {
		throw new Error("getEventCallback not implemented");
	};
	this.destroy = function() {
		throw new Error("destroy not implemented");
	};
	/**
	 * @description true, when no fatal error occurred during startup phase. Startup phase includes the initialization + startupApf 
	 * @function
	 * @public
	 * @name sap.apf.Api#startupSucceeded
	 * @returns {boolean} success of startup
	 */
	this.startupSucceeded = function() {
		throw new Error("startupSucceeded not implemented");
	};
};

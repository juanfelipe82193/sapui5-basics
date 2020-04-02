/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.testhelper.interfaces.IfCoreApi");
/**
 * @class IfCoreApi template for the core component
 * @name sap.apf.testhelper.interfaces.IfCoreApi
 * @description Use internally as baseclass for doubles
 */
sap.apf.testhelper.interfaces.IfCoreApi = function() {
	"use strict";
	this.getStartParameterFacade = function() {
		throw new Error("getStartParameterFacade not implemented");
	};
	/**
	 * @public
	 * @description Returns metadata object that represents metadata corresponding to the service document.
	 * @param {string} sAbsolutePathToServiceDocument Absolute path to the service document.
	 * @returns {sap.apf.core.Metadata}
	 */
	this.getMetadata = function(sAbsolutePathToServiceDocument) {
		throw new Error("getMetadata not implemented");
	};
	/**
	 * @see sap.apf.core.MetadataFactory#getMetadataFacade
	 */
	this.getMetadataFacade = function() {
		throw new Error("getMetadataFacade not implemented");
	};
	this.getMessageHandler = function() {
		throw new Error("getMessageHandler not implemented");
	};
	/**
	 * @description Returns metadata object that represents metadata corresponding to the service document and an entity type that belongs to the service.
	 * @param {string} sAbsolutePathToServiceDocument Absolute path to the service document.
	 * @param {string} sEntityType Entity type
	 * @returns {sap.apf.core.EntityTypeMetadata}
	 */
	this.getEntityTypeMetadata = function(sAbsolutePathToServiceDocument, sEntityType) {
		throw new Error("getEntityTypeMetadata not implemented");
	};
	/**
	 * @description A message is passed to the message handler for further processing.
	 *              This can be one of the following message type defined in sap.apf.constants.messageServerity
	 * @param {sap.apf.core.MessageObject} oMessage The message object shall be created by method {sap.apf.createMessageObject}.
	 * @returns {undefined}
	 */
	this.putMessage = function(oMessage) {
		throw new Error("putMessage not implemented");
	};
	this.getPathFilterInformation = function(oMessage) {
		throw new Error("getPathFilterInformation not implemented");
	};
	/**
	 * @description Test whether condition is violated and puts a corresponding message.
	 * @param {boolean} bExpression Boolean expression, that is evaluated.
	 * @param {string} sMessage A text, that is included in the message text.
	 * @param {string} sCode Error code 5100 is default, 5101 for warning. Other codes can be used, if the default message text is not specific enough.
	 * @returns {undefined}
	 */
	this.check = function(bExpression, sMessage, sCode) {
		throw new Error("check not implemented");
	};
	/**
	 * @description Creates a message object. The message processing is started with sap.apf.putMessage, which expects as
	 * argument a message object of type {sap.apf.core.MessageObject}. So first create the message object and afterwards call sap.apf.putMessage
	 * with the message object as argument.
	 * @param {object} oConfig Configuration object for the message object.
	 * @param {object} oConfig.code The message is classified by its code. The code identifies an entry in the message configuration.
	 * @param {object} oConfig.aParameters Additional parameters for the message. The parameters are filled into the message text, when the message
	 *                 will be processed by the text resource handler.
	 * @param {object} oConfig.oCallingObject Reference of the calling object. This can be used later to visualize
	 *                 on the user interface, where the message occurred.
	 * @returns {sap.apf.core.MessageObject}
	 */
	this.createMessageObject = function(oConfig) {
		throw new Error("createMessageObject not implemented");
	};
	/**
	 * @description The handling of the window.onerror by the message handler is either switched on or off. Per default the handling is deactivated.
	 * @param {boolean} bOnOff Switches error handling on/off.
	 * @returns {undefined}
	 */
	this.activateOnErrorHandling = function(bOnOff) {
		throw new Error("activateOnErrorHandling not implemented");
	};
	/**
	 * @description Sets a callback function, so that a message can be further processed.
	 * @param {function} fnCallback The callback function will be called with the messageObject of type {sap.apf.core.MessageObject}.
	 * @returns {undefined}
	 */
	this.setCallbackForMessageHandling = function(fnCallback) {
		throw new Error("setCallbackForMessageHandling not implemented");
	};
	/**
	 * @description Returns a copy of APF fatal log messages. The last message put is on first position in array.
	 * @returns {string[]}
	 */
	this.getLogMessages = function() {
		throw new Error("getLogMessages not implemented");
	};
	/**
	 * @description Loads a new  application configuration in JSON format.
	 * @param {string} sFilePath The absolute path of application configuration file. Host and port will be added in front of this path.
	 */
	this.loadApplicationConfig = function(sFilePath) {
		throw new Error("loadApplicationConfig not implemented");
	};
	/**
	 * @see sap.apf.core.TextResourceHandler#loadTextElements
	 */
	this.loadTextElements = function(textElements) {
		throw new Error("not implemented");
	};
	/**
	 * @description This function returns those properties of the application configuration file that are not internally used.
	 * @returns {object}
	 */
	this.getApplicationConfigProperties = function() {
		throw new Error("getApplicationConfigProperties not implemented");
	};
	/**
	 * @description This function returns the path of a specified resource.
	 * @param {string} sResourceIdentifier type sap.apf.core.constants.resourceLocation.
	 * @returns {string} resource path
	 */
	this.getResourceLocation = function(sResourceIdentifier) {
		throw new Error("getResourceLocation not implemented");
	};
	/**
	 * @description This function returns the configuration for the persistence (of the path).
	 * @returns {object} persistence configuration object
	 */
	this.getPersistenceConfiguration = function() {
		throw new Error("getPersistenceConfiguration not implemented");
	};
	/**
	 * @memberOf sap.apf.core
	 * @description Wraps a jQuery (jQuery.ajax) request in order to handle a server time-out.
	 * @param {object} oSettings Configuration of the jQuery.ajax request.
	 * @returns {object} jqXHR
	 */
	this.ajax = function(oSettings) {
		throw new Error("ajax not implemented");
	};
	/**
	 * @memberOf sap.apf.core
	 * @description Wraps a OData request in order to handle a server time-out. It uses a POST $batch operation wrapping the GET.
	 * @param {object} oRequest An Object that represents the HTTP request to be sent.
	 * @param {function} fnSuccess A callback function called after the response was successfully received and parsed.
	 * @param {function} fnError A callback function that is executed if the request fails.
	 * @param {object} oBatchHandler A handler object for the request data.
	 */
	this.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
		throw new Error("odataRequest not implemented");
	};
	// ConfigurationFactory API
	/**
	 * @description Returns category objects of all loaded category configuration objects.
	 * @returns {object[]} Object with configuration information about a category.
	 */
	this.getCategories = function() {
		throw new Error("getCategories not implemented");
	};
	/**
	 * @description Returns true, if configuration object exists.
	 * @param {string} sId Id of the configuration.
	 * @returns {boolean}
	 */
	this.existsConfiguration = function(sId) {
		throw new Error("existsConfiguration not implemented");
	};
	/**
	 * @description Returns new step templates created from all step configuration objects, containing static information only.
	 *              Note that a step config object is used to create an object of type stepTempate as well as a runtime object of type step.
	 * @returns Array of object
	 */
	this.getStepTemplates = function() {
		throw new Error("getStepTemplates not implemented");
	};
	/**
	 * @see sap.apf.core.ConfigurationFactory#getNavigationTargets
	 */
	this.getNavigationTargets = function() {
		throw new Error("getNavigationTargets not implemented");
	};
	
	this.getSmartFilterBarAsPromise = function() {
		throw new Error("getSmartFilterBar not implemented");
	};
	this.registerSmartFilterBarInstance = function() {
		throw new Error("registerSmartFilterBarInstance not implemented");
	};
	this.getSmartFilterBarConfigurationAsPromise = function() {
		throw new Error("getSmartFilterBarConfiguration not implemented");
	};
	this.getFacetFilterConfigurations = function() {
		throw new Error("getFacetFilterConfigurations not implemented");
	};
	this.getSmartFilterBarPersistenceKey = function() {
		throw new Error("getSmartFilterBarPersistenceKey not implemented");
	};
	this.getSmartFilterbarDefaultFilterValues = function() {
		throw new Error("getSmartFilterbarDefaultFilterValues not implemented");
	};
	this.getReducedCombinedContext = function() {
		throw new Error("getReducedCombinedContext not implemented");
	};
	/**
	 * @description Creates a step object from the configuration object and adds it to the path.
	 * @param {string} sStepId Step id as defined in the analytical configuration.
	 * @param {function} fnStepProcessedCallback Callback function for path update. The first argument of the callback function is the step instance.
	 *                   The second argument is a flag, that indicates, whether there was an update or not.
	 * @param {string} sRepresentationId Parameter, that allows definition of the representation id that shall initially be selected.
	 *                                     If omitted the first configured representation will be selected.
	 * @returns {sap.apf.core.Step} oStep Created step.
	 */
	this.createStep = function(sStepId, fnStepProcessedCallback, sRepresentationId) {
		throw new Error("createStep not implemented");
	};
	// Path API
	/**
	 * @description Gets the ordered sequence of all steps in analysis path. Each step is a reference to the object in the path.
	 *              Each step shall always be identified by the reference to its step object, e.g. in methods like removeStep,
	 *              moveStepToPosition, setActiveStep, etc.
	 * @returns {sap.apf.core.Step[]}
	 */
	this.getSteps = function() {
		throw new Error("getSteps not implemented");
	};
	/**
	 * @description Moves a step in the analysis path to the specified target position.
	 * @param {oStep} oStep The step object to be moved.
	 * @param {nPosition} nPosition The target position. Must be a valid position in the path, between zero and length-1.
	 * @param {function} fnStepProcessedCallback Callback for update of steps.
	 */
	this.moveStepToPosition = function(oStep, nPosition, fnStepProcessedCallback) {
		throw new Error("moveStepToPosition not implemented");
	};
	/**
	 * @description The steps in the path will be updated. First it is detected,  whether a representation (chart) of a step
	 *              has changed its selection. If yes, then all subsequent steps will get  a new (cumulated) selection for retrieving data.
	 *              If a step has a new cumulated selection for retrieving data, then an OData request is executed for the particular step
	 *              and the representation receives new data.
	 * @param {function} fnStepProcessedCallback is a callback function. This callback function is executed for every step in the path.
	 *                   The first argument of the callback function is the step instance. The second argument is a flag, that indicates,
	 *                   whether there was an update or not.
	 * @param {boole} bContextChanged indicates, that the context has been changed
	 */
	this.updatePath = function(fnStepProcessedCallback, bContextChanged) {
		throw new Error("updatePath not implemented");
	};
	/**
	 * @description Removes a step from the analysis path.
	 * @param {sap.apf.core.Step} oStep The step object to be removed. The reference must be an object contained in the path. Otherwise, a message will be put.
	 * @param {function} fnStepProcessedCallback Callback for update of steps. The first argument of the callback function is the step instance. The second argument is a flag, that indicates, whether there was an update or not.
	 * @returns {undefined}
	 */
	this.removeStep = function(oStep, fnStepProcessedCallback) {
		throw new Error("removeStep not implemented");
	};
	/**
	 * @description Removes all steps from the path and removes active step.
	 * @returns {undefined}
	 */
	this.resetPath = function() {
		throw new Error("resetPath not implemented");
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
	 * @description Returns the path as serializable object containing the steps, and the indices of the active steps.
	 * @returns {object} Serializable path in the following format: { path : { steps: [serializableSteps],  indicesOfActiveStep:[num] }, context:serializableFilter}.
	 */
	this.serialize = function() {
		throw new Error("serialize not implemented");
	};
	/**
	 * @see sap.apf.core.SessionHandler#isApfStateAvailable
	 */
	this.isApfStateAvailable = function() {
		throw new Error("isApfStateAvailable not implemented");
	};
	/**
	 * @description Serializes current APF state and stores it transiently
	 */
	this.storeApfState = function() {
		throw new Error("storeApfState not implemented");
	};
	/**
	 * @description Restores APF state from transient state
	 */
	this.restoreApfState = function() {
		throw new Error("restoreApfState not implemented");
	};
	/**
	 * @description Restores a path with the information given in a serializable path object.
	 * @param {object} oSerializablePath Serializable path in the following format: { path : { steps: [serializableSteps],  indicesOfActiveStep:[num] }, context:serializableFilter}.
	 * @returns {undefined}
	 */
	this.deserialize = function(oSerializedAnalysisPath) {
		throw new Error("deserialize not implemented");
	};
	// Text Resource Handler API
	/**
	 * @description Retrieves the not encoded text.
	 * @param {object} oLabel || {string} Label object or text key.
	 * @param {string[]} aParameters Array with parameters to replace place holders in text.
	 * @returns {string}
	 */
	this.getTextNotHtmlEncoded = function(oLabel, aParameters) {
		throw new Error("getTextNotHtmlEncoded not implemented");
	};
	/**
	 * @description Retrieves the encoded text.
	 * @param {object} oLabel || {string} Label object or text key.
	 * @param {string[]} aParameters Array with parameters to replace place holders in text.
	 * @returns {string}
	 */
	this.getTextHtmlEncoded = function(oLabel, aParameters) {
		throw new Error("getTextHtmlEncoded not implemented");
	};
	/**
	 * returns true, if this is the text key for the initial text. Initial text means empty string.
	 */
	this.isInitialTextKey = function(textKey) {
		throw new Error("isInitialTextKey not implemented");
	};
	/**
	 * @description Returns a message text for message handling.
	 * @param {string} sCode message code
	 * @param {[]} aParameters Parameters for placeholder replacement in the message bundle.
	 * @returns {string}
	 */
	this.getMessageText = function(sCode, aParameters) {
		throw new Error("getMessageText not implemented");
	};
	/**
	 * @description Returns the XSRF token as string.
	 * @returns {String}
	 */
	this.getXsrfToken = function(sServiceRootPath) {
		throw new Error("getXsrfToken not implemented");
	};
	/**
	 * @description Sets dirty information
	 */
    this.setDirtyState = function(state) {
        throw new Error("setDirtyState not implemented");
    };
    /**
     * @description Returns is dirty information
     */
    this.isDirty = function() {
        throw new Error("isDirty not implemented");
    };
    /**
     * @description Sets path path name
     */
    this.setPathName = function(name) {
        throw new Error("setPathName not implemented");
    };	
    /**
     * @description Returns last set path name
     */
    this.getPathName = function() {
        throw new Error("getPathName not implemented");
    };      
	/**
	 * @description Returns cumulative filter provided by StartFilterHandler
	 */
	this.getCumulativeFilter = function() {
		throw new Error("getCumulativeFilter not implemented");
	};
	/**
	 * @description Checks the server response for timeout via status code.
	 * @param {object} oServerResponse Server response from Ajax or OData request.
	 * @returns {undefined}
	 */
	this.checkForTimeout = function(oServerResponse) {
		throw new Error("checkForTimeout not implemented");
	};
	/**
	 * @see sap.apf#createReadRequest
	 * @description Creates an object for performing an Odata Request get operation.
	 * @param {string} sRequestConfigurationId Identifies a request configuration, which is contained in the analytical content configuration.
	 * @returns {sap.apf.core.ReadRequest}
	 */
	this.createReadRequest = function(sRequestConfigurationId) {
		throw new Error("createReadRequest not implemented");
	};
	/**
	 * @see sap.apf#createReadRequestByRequiredFilter
	 * @description Creates an object for performing an Odata Request get operation.
	 * @param {object} oRequestConfiguration Request configuration object
	 * @returns {sap.apf.core.ReadRequestByRequiredFilter}
	 */
	this.createReadRequestByRequiredFilter = function(oRequestConfiguration) {
		throw new Error("createReadRequestByRequiredFilter not implemented");
	};
	/**
	 * @description Returns the instance of the UriGenrator. For internal core using only.
	 */
	this.getUriGenerator = function() {
		throw new Error("getUriGenerator not implemented");
	};
	/**
	 * @description Loads all message from the  configuration. This method is called from the resource path handler.
	 * @param {object[]} aMessages Array with message configuration objects.
	 * @param {boolean} bResetRegistry  Flag to reset registry.
	 * @returns {undefined}
	 */
	this.loadMessageConfiguration = function(aMessages, bResetRegistry) {
		throw new Error("loadMessageConfiguration not implemented");
	};
	/**
	 * @description Loads all properties of the input configuration object, which can also include custom error texts.
	 * @param {object} oConfig configuration object
	 * @returns {undefined}
	 */
	this.loadAnalyticalConfiguration = function(oConfig) {
		throw new Error("loadAnalyticalConfiguration not implemented");
	};
	/**
	 * @description Saves or modifies the current path on server side under the provided name.
	 * @param {string} sPathId Path with id to be modified.
	 * @param {string} sName Name of the path to be saved
	 * @param {function} fnCallback The first argument of the callback function is the server response as JS object. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
	 * @returns {undefined}
	 */
	this.savePath = function(sPathId, sName, fnCallback) {
		throw new Error("savePath not implemented");
	};
	/**
	 * @description Reads all stored paths from server. Result is returned as sorted list in descending order. Order criteria is the last changed date of a saved path.
	 * @param {function} fnCallback The first argument of the callback function is the server response as JS object. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
	 * @returns {undefined}
	 */
	this.readPaths = function(fnCallback) {
		throw new Error("readPaths not implemented");
	};
	/**
	 * @description Opens a path, that has been stored on server side and replaces the current path.
	 * @param {string} sPathId Identifies the analysis path to be opened
	 * @param {function} fnCallback The first argument of the callback function is the server response as JS object. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
	 * @param {number} nActiveStep Sets the active step.
	 * @returns {undefined}
	 */
	this.openPath = function(sPathId, fnCallback, nActiveStep) {
		throw new Error("openPath not implemented");
	};
	/**
	 * @description Deletes the path with the given ID on server
	 * @param {string} sPathId Identifies the analysis path to be deleted
	 * @param {function} fnCallback The first argument of the callback function is the server response as JS object. The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is undefined or {sap.apf.core.MessageObject} if a message occurred.
	 * @returns {undefined}
	 */
	this.deletePath = function(sPathId, fnCallback) {
		throw new Error("deletePath not implemented");
	};
	/**
	 * @description Used to create a representation instance.
	 * @param {function} RepresentationConstructor Representation constructor.
	 * @parameter {object} oConfig Configuration of the representation.
	 * @returns {object} Instance of the representation.
	 */
	this.createRepresentation = function(RepresentationConstructor, oConfig) {
		throw new Error("createRepresentation not implemented");
	};
	/**
	 * @see sap.apf#createFilter for api definition
	 * @see sap.apf.utils.Filter
	 */
	this.createFilter = function() {
		throw new Error("createFilter not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#getActiveStep
	 * @description Returns active step, currently selected step, of analysis path.
	 * @returns {sap.apf.core.Step}
	 */
	this.getActiveStep = function() {
		throw new Error("getActiveStepnot implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.core#getCumulativeFilterUpToActiveStep
	 * @description returns the cumulative filter up to the active step (included) and the context
	 * @returns {sap.apf.core.utils.Filter} cumulativeFilter
	 */
	this.getCumulativeFilterUpToActiveStep = function() {
		throw new Error("getCumulativeFilterUpToActiveStep not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.Api#setActiveStep
	 * @description Sets handed over step as the active one.
	 * @param {sap.apf.core.Step} oStep The step to be set as active
	 * @returns undefined
	 */
	this.setActiveStep = function(oStep) {
		throw new Error("setActiveStep not implemented");
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.core.Instance#createFirstStep
	 * @description Method to be used for creating and adding a step in the path. It will add a first step for an empty path or a further step.
	 */
	this.createFirstStep = function(sStepId, sRepId) {
		throw new Error("not implemented");
	};
	/**
	* @private
	* @function
	* @name sap.apf.core.Instance#getFunctionCreateRequest
	* @description Returns function createRequest from sap.apf.core.ConfigurationFactory
	*/
	this.getFunctionCreateRequest = function() {
		throw new Error("getFunctionCreateRequest not implemented");
	};
	this.getAnnotationsForService = function(serviceRoot) {
		throw new Error("getAnnotationsForService not implemented");
	};
	this.destroy = function() {
		throw new Error("destroy not implemented");
	};
	/**
	 * @see sap.apf.core.TextResourceHandler#registerTextWithKey
	 */
	this.registerTextWithKey = function(key, text) {
		throw new Error("registerTextWithKey not implemented");
	};
	/**
	 * @see sap.apf.core.Path#checkAddStep
	 */
	this.checkAddStep = function(sId){
		throw new Error("checkAddStep not implemented");
	};
	/**
	 * @see sap.apf.core.ConfigurationFactory#getConfigurationById
	 */
	this.getConfigurationObjectById = function(sId) {
		throw new Error("getConfigurationObjectById not implemented");
	};
	/**
	 * returns an exit function by name, if defined
	 * @param {string} name the name of the exit function
	 * @returns {function|undefined} an exit function by the given name or the value undefined.
	 */
	this.getGenericExit = function(name) {
		throw new Error("getGenericExit not implemented");
	};
	/**
	 * returns the Component that runs the Application, if defined
	 * @returns {sap.apf.base.Component|undefined} The Component (or the value undefined)
	 */
	this.getComponent = function() {
		throw new Error("getComponent not implemented");
	};
};

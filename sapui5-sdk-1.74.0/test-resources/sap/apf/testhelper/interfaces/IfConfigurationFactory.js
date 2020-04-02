/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.testhelper.interfaces.IfConfigurationFactory");
/**
 * @class This class loads the configuration object, registers its properties and provides getters to receive references or copies of them.
 * @param  oInject.messageHandler 
 * @param  oInject.coreApi
 */
sap.apf.testhelper.interfaces.IfConfigurationFactory = function(oInject) {
	/**
	 * @description Creates and returns a new thumbnail object.
	 * @param oThumbnailConfig
	 * @return Object
	 */
	this.createThumbnail = function(oThumbnailConfig) {
		throw new Error("not implemented");
	};
	/**
	 * @param oLabelConfig
	 * @return New Object of type Label
	 */
	this.createLabel = function(oLabelConfig) {
		throw new Error("not implemented");
	};
	// Public Func
	/**
	 * @description Loads all properties of the input configuration object, which can also include custom error texts.
	 * @param oConfiguration configuration object
	 * @returns undefined
	 */
	this.loadConfig = function(oConfiguration) {
		throw new Error("not implemented");
	};
	/**
	 * @description Returns a reference of a configuration object. Not a copy.
	 * @param sId
	 * @returns Object
	 */
	this.getConfigurationById = function(sId) {
		throw new Error("not implemented");
	};
	/**
	 * @description Returns true, if configuration object exists.
	 * @param sId
	 * @returns {boolean}
	 */
	this.existsConfiguration = function(sId) {
		throw new Error("not implemented");
	};
	/**
	 * @description Returns service documents
	 * @returns {Array}
	 */
	this.getServiceDocuments = function() {
		throw new Error("not implemented");
	};
	/**
	 * @description Returns new step templates created from all step configuration objects, containing static information only. Note that a step config object is used to create an object of type stepTempate as well as a runtime object of type step.
	 * @returns Array of Object
	 */
	this.getStepTemplates = function() {
		throw new Error("not implemented");
	};
	this.getSmartFilterBarConfiguration = function() {
		throw new Error("not implemented");
	};
	this.getFacetFilterConfigurations = function() {
		throw new Error("not implemented");
	};
	/**
	 * @description Returns new category objects of all loaded category configuration objects.
	 * @returns Array
	 */
	this.getCategories = function() {
		throw new Error("not implemented");
	};
	/**
	 * @description Returns the configuration header
	 * @returns {object}
	 */
	this.getConfigHeader = function() {
		throw new Error('"getConfigHeader" is not implemented');
	};	
	/**
	 * @description Creates and returns a new step object from its specified configuration object.
	 * @param sStepId Identifies the configuration object. If the step id is not known an error will be thrown.
	 * @returns Object
	 */
	this.createStep = function(sStepId) {
		throw new Error("not implemented");
	};
	/**
	 * @description Creates and returns a new binding object, by the identified configuration object.
	 * @param sBindingId Identifies the configuration object. If the id is not known an error will be thrown.
	 * @param oTitle Short title, type label.
	 * @param oLongTitle Long title, type label.
	 * @returns {Object}
	 */
	this.createBinding = function(sBindingId, oTitle, oLongTitle) {
		throw new Error("not implemented");
	};
	/**
	 * @description Creates and returns a new request object.
	 * @param {String} - sRequstId request id If the step id is not known an error will be thrown.
	 * @returns {Object}
	 */
	this.createRequest = function(sRequstId) {
		throw new Error("not implemented");
	};
	/**
	 * @see sap.apf.core.ConfigurationFactory#getNavigationTargets
	 */
	this.getNavigationTargets = function() {
		throw new Error("getNavigationTargets not implemented");
	};
};

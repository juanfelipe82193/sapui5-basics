/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.testhelper.interfaces.IfResourcePathHandler');

/**
 * @class Holds all paths for the message configuration, the message text bundles, other ui texts for apf, and for extensions. 
 * Furthermore it  holds the information about persistence configuration.
 * @returns {sap.apf.core.ResourcePathHandler}
 */
sap.apf.testhelper.interfaces.IfResourcePathHandler = function() {


	/**
	 * @public
	 * @description Loads a new  application configuration in JSON format. 
	 * @param {string} sFilePath The absolute path of application configuration file. Host and port will be added in front of this path. 
	 */
	this.loadConfigFromFilePath = function(sFilePath) {
		throw new Error("not implemented");
	};

	/**
	 * @public
	 * @description This function returns the path of a specified resource. 
	 * @param {string} sResourceIdentifier type sap.apf.core.constants.resourceLocation.*
	 * @returns {string} Resource path
	 */
	this.getResourceLocation = function(sResourceIdentifier) {
		throw new Error("not implemented");
	};
	/**
	 * @public
	 * @description This function returns the configuration for the persistence (of the path).
	 * @returns {object} persistence configuration object
	 */
	this.getPersistenceConfiguration = function() {
		throw new Error("not implemented");
	};
	/**
	 * @public
	 * @description This function returns the properties of the configuration file, which are not used internally.
	 * @returns {object} Copy of properties in configuration
	 */
	this.getConfigurationProperties = function() {
		throw new Error("not implemented");
	};

};

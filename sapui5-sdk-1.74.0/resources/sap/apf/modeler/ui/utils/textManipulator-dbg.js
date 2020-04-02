/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(function(){
	'use strict';
	/**
	 * @class textManipulator
	 * @memberOf sap.apf.modeler.ui.utils
	 * @name textManipulator
	 * @description Helps in adding and removing prefix on the properties
	 */
	var textManipulator = {};
	/**
	* @function
	* @name sap.apf.modeler.ui.utils.textManipulator#addPrefixText
	* @description Adds "Not Available: " as the prefix to the properties
	* @param accepts an array of properties
	* @param {String} accepts text which has to be prefixed
	* */
	textManipulator.addPrefixText = function(aProperties, oTextReader) {
		var aPropertiesWithPrefix = [];
		if (aProperties) {
			aPropertiesWithPrefix = aProperties.map(function(sProperty) {
				return oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE) + ": " + sProperty;
			});
		}
		return aPropertiesWithPrefix;
	};
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.textManipulator#removePrefixText
	* @description Removes "Not Available" as the prefix to the properties
	* @param accepts the property whose prefix has to be removed
	* @param {String} accepts a text which has to be removed
	* */
	textManipulator.removePrefixText = function(sProperty, text) {
		var property = sProperty.replace(text, "");
		return property.replace(": ", "");
	};
	return textManipulator;
}, true /*GLOBAL_EXPORT*/);

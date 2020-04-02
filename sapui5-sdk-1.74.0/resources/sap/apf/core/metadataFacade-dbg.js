/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

sap.ui.define([
     'sap/apf/utils/utils',
     'sap/apf/core/metadataProperty'
],	function(utilsUtils, MetadataProperty) {
	'use strict';
	/** 
	 * @class Provides convenience functions for accessing metadata 
	 * @param {Object} oInject - Injection of constructors and instances
	 * @param {function} oInject.constructors.MetadataProperty
	 * @param {sap.apf.core.MessageHandler} oInject.instances.messageHandler
	 * @param {sap.apf.core.MetadataFactory} oInject.instances.metadataFactory
	 * @param {String} sAbsolutePathToServiceDocument Absolute Path to service document
	 * @returns {sap.apf.core.MetadataProperty}
	 */
	var MetadataFacade = function(oInject, sAbsolutePathToServiceDocument) {
		/**
		 * @description Contains 'metadataFacade'
		 * @returns {String}
		 */
		this.type = "metadataFacade";
		var metadataProperty = oInject.constructors.MetadataProperty;
		var messageHandler = oInject.instances.messageHandler;
		var metadataFactory = oInject.instances.metadataFactory;
		var propertyNames;
		var parameterNames;
		var properties = {};
		/**
		 * @description Returns all property names
		 * @param {Function} callback - callback function providing array of properties as strings
		 */
		this.getAllProperties = function(callback) {
			var metadataServiceDocuments;
			var countServiceDocuments;
			var countMetadataResolved = 0;
			var i;
			var propertyNamesBuffer = [];
			if (propertyNames) {
				callback(propertyNames);
			} else {
				metadataServiceDocuments = getServiceDocuments();
				countServiceDocuments = metadataServiceDocuments.length;
				for(i = 0; i < countServiceDocuments; i++) {
					metadataFactory.getMetadata(metadataServiceDocuments[i]).done(accumulatePropertyNames);
				}
			}
			function accumulatePropertyNames(metadata) {
				countMetadataResolved++;
				propertyNamesBuffer = propertyNamesBuffer.concat(metadata.getAllProperties());
				if (countServiceDocuments == countMetadataResolved) {
					propertyNames = utilsUtils.eliminateDuplicatesInArray(messageHandler, propertyNamesBuffer);
					callback(propertyNames);
				}
			}
		};
		/**
		 * @description Returns all properties which are paramenter key properties
		 * @param {Function} callback - callback function providing array of properties which are parameter entity set key properties as strings
		 */
		this.getAllParameterEntitySetKeyProperties = function(callback) {
			//TODO Additionally most of the code is redundant - General logic for promise resolvement to be extracted in this constructor function if possible
			var metadataServiceDocuments;
			var countServiceDocuments;
			var countMetadataResolved = 0;
			var i;
			var parameterNamesBuffer = [];
			if (parameterNames) {
				callback(parameterNames);
			} else {
				metadataServiceDocuments = getServiceDocuments();
				countServiceDocuments = metadataServiceDocuments.length;
				for(i = 0; i < countServiceDocuments; i++) {
					metadataFactory.getMetadata(metadataServiceDocuments[i]).done(accumulateParameterNames);
				}
			}
			function accumulateParameterNames(metadata) {
				countMetadataResolved++;
				parameterNamesBuffer = parameterNamesBuffer.concat(metadata.getParameterEntitySetKeyPropertiesForService());
				if (countServiceDocuments == countMetadataResolved) {
					parameterNames = sap.apf.utils.eliminateDuplicatesInArray(messageHandler, parameterNamesBuffer);
					callback(parameterNames);
				}
			}
		};
		/**
		 * @param {string} serviceRoot
		 * @param {string} entitySet
		 * @param {string} property
		 * returns {jQuery.Deferred<sap.apf.core.MetadataProperty}
		 */
		this.getPropertyMetadataByEntitySet = function(serviceRoot, entitySet, propertyName) {
			var deferred = jQuery.Deferred();
			metadataFactory.getMetadata(serviceRoot).done(function(metadata){
				var prop = metadata.getPropertyMetadata(entitySet, propertyName);
				deferred.resolve(new MetadataProperty.constructor(prop));
			});
			return deferred.promise();
		};
		/**
		 * @description Returns a object of type {sap.apf.core.MetadataProperty} for
		 *              accessing attributes of a metadata property
		 * @param {String} sName - property name
		 * @param {Function} callback - callback function providing {sap.apf.core.MetadataProperty} object
		 */
		this.getProperty = function(propertyName) {
			var metadataServiceDocuments;
			var propertyAttributes;
			var countServiceDocuments;
			var deferred = jQuery.Deferred();
			if (properties[propertyName]) {
				deferred.resolve(properties[propertyName]);
			} else {
				metadataServiceDocuments = getServiceDocuments();
				countServiceDocuments = metadataServiceDocuments.length;
				for( var i = 0; i < countServiceDocuments; i++) {
					metadataFactory.getMetadata(metadataServiceDocuments[i]).done(function(metadata) {
						propertyAttributes = metadata.getAttributes(propertyName);
						if (propertyAttributes.name) {
							if (metadata.getParameterEntitySetKeyPropertiesForService().indexOf(propertyName) > -1) {
								propertyAttributes.isParameterEntitySetKeyProperty = true;
							}
							if (metadata.getAllKeys().indexOf(propertyName) > -1) {
								propertyAttributes.isKey = true;
							}
							for( var name in propertyAttributes) {
								if (name === "dataType") {
									for( var dataTypeName in propertyAttributes.dataType) {
										propertyAttributes[dataTypeName] = propertyAttributes.dataType[dataTypeName];
									}
								}
							}
							properties[propertyName] = new MetadataProperty.constructor(propertyAttributes);
							deferred.resolve(properties[propertyName]);
						}
					});
				}
			}
			return deferred.promise();
		};
		function getServiceDocuments() {
			if (typeof sAbsolutePathToServiceDocument === "string") {
				return [ sAbsolutePathToServiceDocument ];
			}
			return metadataFactory.getServiceDocuments();
		}
	};
	/*BEGIN_COMPATIBILITY*/
	sap.apf.core.MetadataFacade = MetadataFacade;
	/*END_COMPATIBILITY*/
	return  MetadataFacade;
},true /*GLOBAL_EXPORT*/);
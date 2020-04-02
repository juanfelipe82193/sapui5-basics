/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/ui/model/FilterOperator"
], function(FilterOperator){
	'use strict';
	/**
	 * Constants of the core
	 * @class sap.apf.core.constants
	 */
	var constants = {};
	/**
	 * The constants shall be returned from a representation with method getFilterMethodTypes.
	 * @class filterMethodTypes
	 * @memberOf sap.apf.core.constants
	 */
	constants.filterMethodTypes = {
		/**
		 * @public
		 * @description selectionAsArray
		 */
		selectionAsArray : 'saa',
		/**
		 * @public
		 * @description filter
		 */
		filter : 'f'
	};
	/**
	 * @class Enumeration for filter operators, that are supported in odata $filter part. See{@link sap.ui.model.FilterOperator}
	 */
	constants.FilterOperators = FilterOperator;
	constants.BooleFilterOperators = {
		AND : "and",
		OR : "or",
		NOT : "not"
	};
	/**
	 * @constant sap.apf.core.constants.aSelectOpt operators for filter terms.
	 * @description All allowed constants, that can be used in filter terms.
	 *              These constants correspond to the terms, that can be handled by
	 *              the OData protocol.
	 */
	constants.aSelectOpt = [
		constants.FilterOperators.EQ,
		constants.FilterOperators.NE,
		constants.FilterOperators.GT,
		constants.FilterOperators.LT,
		constants.FilterOperators.GE,
		constants.FilterOperators.LE,
		constants.FilterOperators.BT,
		constants.FilterOperators.StartsWith,
		constants.FilterOperators.Contains,
		constants.FilterOperators.EndsWith
	];
	/**
	 * @class Constants for the resource location
	 * @descriptions Properties in the configuration file for the resource locations
	 */
	constants.resourceLocation = {
		/**
		 * @public
		 * @description webAppMessageConfiguration
		 */
		applicationMessageDefinitionLocation : "applicationMessageDefinitionLocation",
		/**
		 * @public
		 * @description webAppMessageTextBundle
		 */
		applicationMessageTextBundle : "applicationMessageTextBundle",
		/**
		 * @public
		 * @description apfUiTextBundle
		 */
		apfUiTextBundle : "apfUiTextBundle",
		/**
		 * @public
		 * @description webAppTextBundle
		 */
		applicationUiTextBundle : "applicationUiTextBundle",
		/**
		 * @public
		 * @description analyticalConfigurationLocation
		 */
		analyticalConfigurationLocation : "analyticalConfigurationLocation"
	};
	/**
	 * @namespace Constants for the message handling.
	 */
	constants.message = {};
	/**
	 * @class Message severity constants
	 * @description Constants for the severity of a message object.
	 * @memberOf sap.apf.core.constants.message.code
	 */
	constants.message.severity = {
		/**
		 * @public
		 * @description fatal
		 */
		fatal : "fatal",
		/**
		 * @public
		 * @description warning
		 */
		warning : "warning",
		/**
		 * @public
		 * @description error
		 */
		error : "error",
		/**
		 * @public
		 * @description technical error
		 */
		technError : "technError",
		/**
		 * @public
		 * @description information
		 */
		information : "information",
		/**
		 * @public
		 * @description success
		 */
		success : "success"
	};
	/**
	 * @description message codes
	 */
	constants.message.code = {
		suppressFurtherException : "APFapf1972",
		errorCheck : "5100",
		errorCheckWarning : "5101",
		errorCheckConfiguration : "5102",
		errorCheckConfigurationWarning : "5103",
		// messages, that exist without configuration, because they might be used, before message configuration is loaded
		errorUnknown : "9000",
		errorExitTriggered : "9001",
		errorInMessageDefinition : "9003"
	};
	/**
	 * @class Event callback constants
	 * @description Constants for the events triggered from apf
	 * @memberOf sap.apf.core.constants
	 */
	constants.eventTypes = {
		/**
		 * @public
		 * @description fired when the sap.apf.setContext is invoked.
		 *            Callback function on this event will be executed under the context of API instance.
		 *                The arguments can be an {object} or empty based on opening a path scenario and triggering a new path respectively.
		 *                The {object} passed on opening a path is described below :
		 *              {
		*              	id - filterId,
		*              	type - filterType,
		*              	expressions - filterTopAnd expressions,
		*              	terms - filterOr expressions
		*              }
		 */
		contextChanged : "contextChanged",
		printTriggered : "printTriggered",
		format : "format"
	};
	/**
	 * @class Configuration object types
	 * @description Object types supported by configuration factory
	 * @memberOf sap.apf.core.constants
	 */
	constants.configurationObjectTypes = {
		facetFilter : "facetFilter",
		smartFilterBar : "smartFilterBar"
	};
	constants.existsEmptyFacetFilterArray = '__existsEmptyFacetFilterArray__';
	/**
	 * @description Names for the services used internally to determine applications, configurations and text elements
	 */
	constants.entitySets = {
		application : 'ApplicationQueryResults',
		configuration : 'AnalyticalConfigurationQueryResults',
		texts : 'TextElementQueryResults',
		logicalSystem : "SAPClientQuery",
		analysisPath : "AnalysisPathQueryResults",
		smartBusiness : "EVALUATIONS" //TODO Delete constant once SBHandler is deleted
	};
	/**
	 * @description Default service root for modeler persistence services
	 * This serviceRoot is used only for the modeler, the runtime has a different root. The
	 * reason is: user roles with different authorizations, change configuration or read only.
	 */
	constants.modelerPersistenceServiceRoot = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
	/**
	 * @description Development language of property text files
	 *
	 */
	constants.developmentLanguage = "";
	/**
	 * initial key for empty text
	 */
	constants.textKeyForInitialText = "00000000000000000000000000000000";
	/**
	 * @description Representation metadata supported types names and label display options
	 *
	 */
	constants.representationMetadata = {
		kind : {
			XAXIS : "xAxis",
			XAXIS2 : "xAxis2",
			YAXIS : "yAxis",
			YAXIS2 : "yAxis2",
			BUBBLEWIDTH : "bubbleWidth",
			SECTORSIZE : "sectorSize",
			LEGEND : "legend",
			SECTORCOLOR : "sectorColor",
			REGIONCOLOR : "regionColor",
			REGIONSHAPE : "regionShape",
			COLUMN : "column",
			HIERARCHIALCOLUMN : "hierarchicalColumn"
		},
		labelDisplayOptions : {
			KEY : "key",
			TEXT : "text",
			KEY_AND_TEXT : "keyAndText"
		},
		measureDisplayOptions : {
			BAR : "bar",
			LINE : "line"
		}
	};
	/**
	 * @description feedItem id for vizFrame charts
	 *
	 */
	constants.vizFrame = {
		feedItemTypes : {
			CATEGORYAXIS : "categoryAxis",
			CATEGORYAXIS2 : "categoryAxis2",
			COLOR : "color",
			VALUEAXIS : "valueAxis",
			VALUEAXIS2 : "valueAxis2",
			BUBBLEWIDTH : "bubbleWidth",
			SIZE : "size",
			SHAPE : "shape",
			TIMEAXIS : "timeAxis"
		}
	};
	/**
	 * @class
	 * @description Defaults for the application configuration.
	 * @memberOf sap.apf.core.constants
	 */
	constants.applicationConfiguration = {
		/**
		 * @public
		 * @description path of default application configuration file.
		 */
		applicationConfigPath : "config/applicationConfiguration.json"
	};
	return constants;
}, true /*GLOBAL_EXPORT*/);

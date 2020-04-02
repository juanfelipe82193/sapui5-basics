/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	'sap/apf/modeler/ui/utils/nullObjectChecker',
	'sap/apf/modeler/ui/utils/textManipulator'
], function(nullObjectChecker, textManipulator) {
	'use strict';
	/**
	* @class staticValuesBuilder
	* @memberOf sap.apf.modeler.ui.utils
	* @name staticValuesBuilder
	* @description builds static model data
	*/
	function StaticValuesBuilder(oTextReader, oOptionsValueModelBuilder) {
		this.oTextReader = oTextReader;
		this.oOptionsValueModelBuilder = oOptionsValueModelBuilder;
	}
	StaticValuesBuilder.prototype.constructor = StaticValuesBuilder;
	/**
	* @function
	* @name sap.apf.modeler.ui.utils.staticValuesBuilder#getNavTargetTypeData
	* @returns a model with navigation target types
	* */
	StaticValuesBuilder.prototype.getNavTargetTypeData = function() {
		var aNavTargetTypes = [ this.oTextReader("globalNavTargets"), this.oTextReader("stepSpecific") ];
		return this.oOptionsValueModelBuilder.convert(aNavTargetTypes, aNavTargetTypes.length);
	};
	/**
	* @function
	* @name sap.apf.modeler.ui.utils.staticValuesBuilder#getSortDirections
	* @returns a model with sort directions 
	* */
	StaticValuesBuilder.prototype.getSortDirections = function() {
		var aSortDirections = [ {
			key : "true",
			name : this.oTextReader("ascending")
		}, {
			key : "false",
			name : this.oTextReader("descending")
		} ];
		return this.oOptionsValueModelBuilder.prepareModel(aSortDirections, aSortDirections.length);
	};

	/*BEGIN_COMPATIBILITY*/
	sap.apf.modeler.ui.utils.StaticValuesBuilder = StaticValuesBuilder;
	/*END_COMPATIBILITY*/
	return StaticValuesBuilder;
}, true /* GLOBAL_EXPORT*/ );
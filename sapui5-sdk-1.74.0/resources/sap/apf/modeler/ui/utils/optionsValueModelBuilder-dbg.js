/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/modeler/ui/utils/nullObjectChecker"
], function(nullObjectChecker){
	'use strict';
	var DEFAULT_MODEL_LIMIT = 500;
	/**
	 * A module of static methods
	 * @class optionsValueModelBuilder
	 * @memberOf sap.apf.modeler.ui.utils
	 * @name optionsValueModelBuilder
	 * @description helps creating models for UI controls
	 */
	var optionsValueModelBuilder = {};
	/**
	* @private
	* @function
	* @name sap.apf.modeler.ui.utils.optionsValueModelBuilder#prepareModel
	* @returns Returns a JSON model based on values and size limit received. If no size limit was passed it is defaulted to 500
	* */
	optionsValueModelBuilder.prepareModel = function(objArr, limitOfModel) {
		var oModel;
		if (!nullObjectChecker.checkIsNotNullOrUndefined(limitOfModel)) {
			limitOfModel = DEFAULT_MODEL_LIMIT;
		}
		oModel = new sap.ui.model.json.JSONModel();
		oModel.setSizeLimit(limitOfModel);
		oModel.setData({
			Objects : objArr
		});
		return oModel;
	};
	/**
	 *
	 * @private
	 * @function
	 * @name sap.apf.modeler.ui.utils.optionsValueModelBuilder#convert
	 * @returns {sap.ui.model.json.JSONModel|undefined} Creates a JSON model. If no size limit was passed it is defaulted.
	 * The model contains objects of type: {{key:String, name: String}}
	 */
	optionsValueModelBuilder.convert = function(arrValues, limitOfModel) {
		var objArr = [], obj;
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(arrValues)) {
			return undefined;
		}
		arrValues.forEach(function(value) {
			if (!nullObjectChecker.checkIsNotNullOrUndefined(value)) {
				return;
			}
			obj = {};
			obj.key = value instanceof Object ? value.key : value;
			obj.name = value instanceof Object ? value.name : value;
			objArr.push(obj);
		});
		return optionsValueModelBuilder.prepareModel(objArr, limitOfModel);
	};
	return optionsValueModelBuilder;
}, true /* GLOBAL_EXPORT */);
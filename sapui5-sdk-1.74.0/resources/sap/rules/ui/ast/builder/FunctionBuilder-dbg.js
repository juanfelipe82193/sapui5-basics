sap.ui.define(["sap/rules/ui/ast/provider/FunctionProvider",
	"sap/rules/ui/ast/constants/Constants"
], function (FunctionProvider, Constants) {
	'use strict';

	// TODO : Combine function and operator provider logic and refactor
	var oInstance;

	var FunctionBuilder = function () {
		this._oFunctionProviderInstance = FunctionProvider.getInstance();
	};

	FunctionBuilder.prototype.construct = function (aFunctions) {
		var oFunctionJson;
		var oFunction;
		this._oFunctionProviderInstance.reset();
		for (var lIterator = 0; lIterator < aFunctions.length; lIterator++) {
			oFunctionJson = aFunctions[lIterator];
			oFunction = this._oFunctionProviderInstance.createFunction(oFunctionJson[Constants.NAME], oFunctionJson[Constants.LABEL],
				oFunctionJson[Constants.CATEGORY], oFunctionJson[Constants.NUMBEROFARGUMENTS], oFunctionJson[Constants.NUMBEROFMANDATORYARGUMENTS],
				oFunctionJson[Constants.ARGUMENTMETADATA],
				oFunctionJson[Constants.DEFAULT_DATAOBJECT_RETURN_TYPE], oFunctionJson[Constants.DEFAULT_BUSINESSDATA_RETURN_TYPE], oFunctionJson[
					Constants.PROBABLE_BUSINESSDATA_TYPE_LIST],oFunctionJson[Constants.PROBABLE_DATAOBJECT_TYPE_LIST],
					oFunctionJson[Constants.CONTEXT]);

			// catrgorize Function
			// TODO: combine all this and move this to provider js file
			this._oFunctionProviderInstance.addFunctionToNameMap(oFunction);
			this._oFunctionProviderInstance.addFunctionToLabelMap(oFunction);
			this._oFunctionProviderInstance.addFunctionToBusinessDataTypeMap(oFunction);
			this._oFunctionProviderInstance.addFunctionToDataObjectTypeMap(oFunction);
			this._oFunctionProviderInstance.addFunctionToCategoryMap(oFunction);

		}
	};
	return {
		getInstance: function () {
			if (!oInstance) {
				oInstance = new FunctionBuilder();
				oInstance.constructor = null;
			}
			return oInstance;
		}
	}

}, true);
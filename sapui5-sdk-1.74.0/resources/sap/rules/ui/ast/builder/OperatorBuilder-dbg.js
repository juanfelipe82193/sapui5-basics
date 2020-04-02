sap.ui.define(["sap/rules/ui/ast/provider/OperatorProvider",
		"sap/rules/ui/ast/constants/Constants"
	],
	function (OperatorProvider, Constants) {
		'use strict';

		var oInstance;

		var OperatorBuilder = function () {
			this._oOperatorProviderInstance = OperatorProvider.getInstance();
		};

		OperatorBuilder.prototype.construct = function (aOperators) {
			var oOperatorJson;
			var oOperator;
			this._oOperatorProviderInstance.reset();
			for (var oIterator = 0; oIterator < aOperators.length; oIterator++) {
				oOperatorJson = aOperators[oIterator];
				oOperator = this._oOperatorProviderInstance.createOperator(oOperatorJson[Constants.NAME],
					oOperatorJson[Constants.NUMBEROFARGUMENTS], oOperatorJson[Constants.RETURNVALUE_BUSINESSDATA_TYPE_COLLECTION],
					oOperatorJson[Constants.RETURNVALUE_DATAOBJECT_TYPE_COLLECTION],
					oOperatorJson[Constants.LABEL], oOperatorJson[Constants.CATEGORY], oOperatorJson[Constants.SUPPORTED_FUNCTIONS]);
				// catrgorize operator
				this._oOperatorProviderInstance.addOperatorToNameMap(oOperator);
				this._oOperatorProviderInstance.addOperatorToLabelMap(oOperator);
				this._oOperatorProviderInstance.addOperatorToBusinessDataTypeMap(oOperator);
				this._oOperatorProviderInstance.addOperatorToDataObjectTypeMap(oOperator);
				this._oOperatorProviderInstance.addOperatorToCategoryMap(oOperator);
			}
		};

		return {
			getInstance: function () {
				if (!oInstance) {
					oInstance = new OperatorBuilder();
					oInstance.constructor = null;
				}
				return oInstance;
			}

		};

	}, true);
sap.ui.define(["sap/rules/ui/ast/model/Base",
	"sap/rules/ui/ast/constants/Constants"
], function (Base, Constants) {
	'use strict';

	// Allowed Databject types
	// S - Struture
	// T - Table
	// E - Element

	// BusinessDataTypes Supported
	// B - Boolean
	// D - Date and TimeStamp
	// T - Time
	// N - Number
	// S - String
	// TS - TimeSpan

	// Args Sample Structure

	// T - TABLE,
	// S - String
	// C - ColumnName
	/*{
	    "args": [
	      {
	        "doType": "T"
	      },
	      {
	        "businessDataType": "S"
	      },
	      {
	        "doType": "C"
	      }
	    ]
	  }*/

	// Function Defintion
	var Function = function () {
		Base.apply(this, arguments);
		this._args = [];
		this._noOfMandatoryArgs = [];
		this._sDefaultReturnDataObjectType = Constants.Table;
		this._sDefaultReturnBusinessDataType = undefined;
		this._context = "";
		this._aProbableBusinessDataTypeList = [];
		this._aProbableDataObjectTypeList = [];
		this._context = "";

	};

	Function.prototype = new Base();
	Function.prototype.constructor = Base;

	Function.prototype.setContext = function (context) {
		this._context = context;
		return this;
	};

	Function.prototype.getContext = function () {
		if (this._context) {
			return this._context;
		} else {
			return "";
		}

	}

	Function.prototype.setArgumentsMetadata = function (args) {
		if (!(args instanceof Array)) {
			// TODO : throw exception
		}
		this._args = args;
		return this;
	};

	Function.prototype.getArgumentsMetadata = function () {
		return this._args;
	};

	Function.prototype.setNoOfMandatoryArgs = function (noOfMandatoryArgs) {
		this._noOfMandatoryArgs = noOfMandatoryArgs;
		return this;
	};

	Function.prototype.getNoOfMandatoryArgs = function () {
		return this._noOfMandatoryArgs;
	};

	Function.prototype.setDefaultReturnDataObjectType = function (sDefaultReturnDataObjectType) {
		if (sDefaultReturnDataObjectType) {
			this._sDefaultReturnDataObjectType = sDefaultReturnDataObjectType;
		}
		return this;
	};

	Function.prototype.getDefaultReturnDataObjectType = function () {
		return this._sDefaultReturnDataObjectType;
	};

	Function.prototype.setDefaultReturnBusinessDataType = function (sDefaultReturnBusinessDataType) {
		this._sDefaultReturnBusinessDataType = sDefaultReturnBusinessDataType;
		return this;
	};

	Function.prototype.getDefaultReturnBusinessDataType = function () {
		return this._sDefaultReturnBusinessDataType;
	};

	Function.prototype.getProbableBusinessDataTypeList = function () {
		return this._aProbableBusinessDataTypeList;
	};

	Function.prototype.setProbableBusinessDataTypeList = function (aProbableBusinessDataTypeList) {
		this._aProbableBusinessDataTypeList = aProbableBusinessDataTypeList;
		return this;
	};

	Function.prototype.getProbableDataObjectTypeList = function () {
		return this._aProbableDataObjectTypeList;
	};

	Function.prototype.setProbableDataObjectTypeList = function (aProbableDataObjectTypeList) {
		this._aProbableDataObjectTypeList = aProbableDataObjectTypeList;
		return this;
	};

	return Function;

});
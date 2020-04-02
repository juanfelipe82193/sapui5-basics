sap.ui.define(["sap/rules/ui/ast/model/Function",
	"sap/rules/ui/ast/constants/Constants"
], function (Function, Constants) {
	'use strict';

	var oInstance;

	var FunctionProvider = function () {
		this._oFunctionsBusinessDataTypeMap = {};
		this._oFunctionsDataObjectTypeMap = {};
		this._oFunctionsCategoryMap = {};
		this._oFunctionsNameMap = {};
		this._oFunctionsLabelMap = {};
	};

	FunctionProvider.prototype.reset = function () {
		this._oFunctionsBusinessDataTypeMap = {};
		this._oFunctionsDataObjectTypeMap = {};
		this._oFunctionsCategoryMap = {};
		this._oFunctionsNameMap = {};
		this._oFunctionsLabelMap = {};
	};

	FunctionProvider.prototype.getAllFunctions = function () {
		//IE does not support Object.values()
		var that = this;
		var values = Object.keys(that._oFunctionsNameMap).map(function (e) {
			return that._oFunctionsNameMap[e]
		});
		return values;
		//return Object.values(this._oFunctionsNameMap);
	};

	FunctionProvider.prototype.getFunctionByName = function (name) {
		return this._oFunctionsNameMap[name];
	};

	FunctionProvider.prototype.addFunctionToNameMap = function (oFunction) {
		var name = oFunction.getName();
		// TODO : Find duplicates and handle accordingly
		this._oFunctionsNameMap[name] = oFunction;
	};

	FunctionProvider.prototype.getFunctionByLabel = function (label) {
		return this._oFunctionsLabelMap[label];
	};

	FunctionProvider.prototype.addFunctionToLabelMap = function (oFunction) {
		var label = oFunction.getLabel();
		// TODO : Find duplicates and handle accordingly
		if (label)
			this._oFunctionsLabelMap[label] = oFunction;
	};

	FunctionProvider.prototype.getAllFunctionsByBusinessDataType = function (type) {
		return this._oFunctionsBusinessDataTypeMap[type];
	};

	FunctionProvider.prototype.getAllFunctionsByDataObjectType = function (type) {
		return this._oFunctionsDataObjectTypeMap[type];
	};

	FunctionProvider.prototype.getAllFunctionsByCategory = function (type) {
		return this._oFunctionsCategoryMap[type];
	};

	FunctionProvider.prototype.getAllFunctionsGivenCategoryAndDataObjectType = function (sCategory, sDataObjectType) {

		sCategory = sCategory.toUpperCase();
		var aFunctions = [];
		var aFunctionsByCategory = this.getAllFunctionsByCategory(sCategory);
		var oFunction;

		for (var lOuterIndex = 0; lOuterIndex < aFunctionsByCategory.length; lOuterIndex++) {
			oFunction = aFunctionsByCategory[lOuterIndex];
			var aProbablDataObjectTypeList = oFunction.getProbableDataObjectTypeList();
			if (aProbablDataObjectTypeList) {
				for (var lInnerIndex = 0; lInnerIndex < aProbablDataObjectTypeList.length; lInnerIndex++) {
					if (aProbablDataObjectTypeList[lInnerIndex] == sDataObjectType) {
						aFunctions.push(oFunction);
					}
				}
			}
		}

		return aFunctions;

	};

	FunctionProvider.prototype.getAllFunctionsGivenDataObjectAndBusinessDataType = function (sDataObjectType, sBusinessDataType) {
		var aFunctions = [];
		var aBusinessDataTypeFunctions = this.getAllFunctionsByBusinessDataType(sBusinessDataType);
		aBusinessDataTypeFunctions = aBusinessDataTypeFunctions ? aBusinessDataTypeFunctions : [];
		var oFunction;
		for (var lOuterIndex = 0; lOuterIndex < aBusinessDataTypeFunctions.length; lOuterIndex++) {
			oFunction = aBusinessDataTypeFunctions[lOuterIndex];
			var aDataObjectTypeList = oFunction.getProbableDataObjectTypeList();
			for (var lInnerIndex = 0; lInnerIndex < aDataObjectTypeList.length; lInnerIndex++) {
				if (aDataObjectTypeList[lInnerIndex] == sDataObjectType) {
					aFunctions.push(oFunction);
					break;
				}
			}
		}
		return aFunctions;
	};

	FunctionProvider.prototype.getAllFunctionsGivenCategoryAndDataObjectAndBusinessDataType = function (sCategory, sDataObjectType,
		sBusinessDataType) {
		var aFunctions = [];
		var aCategoryDataObjectTypeFunctions = this.getAllFunctionsGivenCategoryAndDataObjectType(sCategory, sDataObjectType);
		aCategoryDataObjectTypeFunctions = aCategoryDataObjectTypeFunctions ? aCategoryDataObjectTypeFunctions : [];
		var oFunction;
		for (var lOuterIndex = 0; lOuterIndex < aCategoryDataObjectTypeFunctions.length; lOuterIndex++) {
			oFunction = aCategoryDataObjectTypeFunctions[lOuterIndex];
			var aBusinessDataTypeList = oFunction.getProbableBusinessDataTypeList();
			for (var lInnerIndex = 0; lInnerIndex < aBusinessDataTypeList.length; lInnerIndex++) {
				if (aBusinessDataTypeList[lInnerIndex] == sBusinessDataType) {
					aFunctions.push(oFunction);
					break;
				}
			}
		}
		return aFunctions;
	};

	FunctionProvider.prototype.createFunction = function (name, label, category, noofArgs, noOfMandatoryArgs, argsMetadata,
		defaultReturnDataObjectType, defaultReturnBusinessDataType, aProbableBusinessDataTypeList,
		aProbableDataObjectTypeList, context) {
		return new Function().setName(name).setLabel(label).setCategory(category).setNumberOfArguments(noofArgs)
			.setNoOfMandatoryArgs(noOfMandatoryArgs).setArgumentsMetadata(argsMetadata).setDefaultReturnDataObjectType(
				defaultReturnDataObjectType)
			.setDefaultReturnBusinessDataType(defaultReturnBusinessDataType).setProbableBusinessDataTypeList(
				aProbableBusinessDataTypeList).setProbableDataObjectTypeList(aProbableDataObjectTypeList)
			.setContext(context);
	};

	FunctionProvider.prototype.addFunctionToBusinessDataTypeMap = function (oFunction) {
		// Add Function to BusinessDataType map
		var oFunctionArgsMetadata = oFunction.getArgumentsMetadata();
		var type;

		if (oFunctionArgsMetadata) {
			var aPropableBusinessDataTypeList = oFunction.getProbableBusinessDataTypeList();
			for (var lIterator = 0; lIterator < aPropableBusinessDataTypeList.length; lIterator++) {
				type = aPropableBusinessDataTypeList[lIterator];
				if (!this._oFunctionsBusinessDataTypeMap[type]) {
					this._oFunctionsBusinessDataTypeMap[type] = [];
				}
				// TODO : check for duplicates
				this._oFunctionsBusinessDataTypeMap[type].push(oFunction);
			}
		} else {
			type = oFunction.getDefaultReturnBusinessDataType();
			if (!this._oFunctionsBusinessDataTypeMap[type]) {
				this._oFunctionsBusinessDataTypeMap[type] = [];
			}
			// TODO : check for duplicates
			this._oFunctionsBusinessDataTypeMap[type].push(oFunction);
		}

	};

	FunctionProvider.prototype.addFunctionToDataObjectTypeMap = function (oFunction) {

		var oFunctionArgsMetadata = oFunction.getArgumentsMetadata();
		var type;
		// Add Function to DataObjectType map
		if (oFunctionArgsMetadata) {
			var aProbablDataObjectTypeList = oFunction.getProbableDataObjectTypeList();
			for (var lIterator = 0; lIterator < aProbablDataObjectTypeList.length; lIterator++) {
				type = aProbablDataObjectTypeList[lIterator];
				if (!this._oFunctionsDataObjectTypeMap[type]) {
					this._oFunctionsDataObjectTypeMap[type] = [];
				}
				// TODO : check for duplicates
				this._oFunctionsDataObjectTypeMap[type].push(oFunction);
			}
		} else {
			type = oFunction.getDefaultReturnDataObjectType();
			if (!this._oFunctionsDataObjectTypeMap[type]) {
				this._oFunctionsDataObjectTypeMap[type] = [];
			}
			// TODO : check for duplicates
			this._oFunctionsDataObjectTypeMap[type].push(oFunction);
		}
	};

	FunctionProvider.prototype.addFunctionToCategoryMap = function (oFunction) {
		// Add Function to Category map
		var functionCategory = oFunction.getCategory();
		if (!this._oFunctionsCategoryMap[functionCategory]) {
			this._oFunctionsCategoryMap[functionCategory] = [];
		}
		// TODO : check for duplicates

		this._oFunctionsCategoryMap[functionCategory].push(oFunction);

	};

	FunctionProvider.prototype.includes = function (parent, str) {
		var returnValue = false;

		if (parent.indexOf(str) !== -1) {
			returnValue = true;
		}

		return returnValue;
	};

	return {
		getInstance: function () {
			if (!oInstance) {
				oInstance = new FunctionProvider();
				oInstance.constructor = null;
			}
			return oInstance;
		}
	};

}, true);

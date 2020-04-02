sap.ui.define(["sap/rules/ui/ast/model/Operator"], function (Operator) {
	'use strict';

	var instance;

	var OperatorProvider = function () {
		this._operatorsBusinessDataTypeMap = {};
		this._operatorsDataObjectTypeMap = {};
		this._operatorsCategoryMap = {};
		this._operatorsNameMap = {};
		this._operatorsLabelMap = {};
	};

	OperatorProvider.prototype.reset = function () {
		this._operatorsBusinessDataTypeMap = {};
		this._operatorsDataObjectTypeMap = {};
		this._operatorsCategoryMap = {};
		this._operatorsNameMap = {};
		this._operatorsLabelMap = {};
	};

	OperatorProvider.prototype.getAllOperators = function () {
		return Object.values(this._operatorsNameMap);
	};

	OperatorProvider.prototype.getOperatorByName = function (name) {
		return this._operatorsNameMap[name];
	};

	OperatorProvider.prototype.addOperatorToNameMap = function (operator) {
		var name = operator.getName();
		// TODO : Find duplicates and handle accordingly
		this._operatorsNameMap[name] = operator;
	};

	OperatorProvider.prototype.getOperatorByLabel = function (label) {
		return this._operatorsLabelMap[label];
	};

	OperatorProvider.prototype.addOperatorToLabelMap = function (operator) {
		var label = operator.getLabel();
		// TODO : Find duplicates and handle accordingly
		if (label)
			this._operatorsLabelMap[label] = operator;
	};

	OperatorProvider.prototype.getAllOperatorsByBusinessDataType = function (type) {
		return this._operatorsBusinessDataTypeMap[type];
	};

	OperatorProvider.prototype.getAllOperatorsByDataObjectType = function (type) {
		return this._operatorsDataObjectTypeMap[type];
	};

	OperatorProvider.prototype.getAllOperatorsByCategory = function (type) {
		return this._operatorsCategoryMap[type];
	};

	OperatorProvider.prototype.createOperator = function (name, noofArgs, returnValueBusinessDataTypeCollectionValues,
		returnValueDataObjectTypeCollectionValues, label, category, aSupportedFunctions) {
		return new Operator().setName(name).setLabel(label).setNumberOfArguments(noofArgs)
			.setReturnValueBussinessDataTypeCollection(returnValueBusinessDataTypeCollectionValues)
			.setReturnValueDataObjectTypeCollection(returnValueDataObjectTypeCollectionValues).setCategory(category).setSupportedFunctions(
				aSupportedFunctions);
	};

	OperatorProvider.prototype.addOperatorToBusinessDataTypeMap = function (operator) {
		// Add Operator to BusinessDataType map
		var operatorBussinessDataTypeCollectionMap = operator.getReturnValueBussinessDataTypeCollection();
		for (var type in operatorBussinessDataTypeCollectionMap) {
			if (!this._operatorsBusinessDataTypeMap[type]) {
				this._operatorsBusinessDataTypeMap[type] = [];
			}
			// TODO : check for duplicates

			this._operatorsBusinessDataTypeMap[type].push(operator);
		}

	};

	OperatorProvider.prototype.addOperatorToDataObjectTypeMap = function (operator) {
		// Add Operator to DataObjectType map
		var operatorDataObjectTypeCollectionMap = operator.getReturnValueDataObjectTypeCollection();
		for (var type in operatorDataObjectTypeCollectionMap) {
			if (!this._operatorsDataObjectTypeMap[type]) {
				this._operatorsDataObjectTypeMap[type] = [];
			}
			// TODO : check for duplicates

			this._operatorsDataObjectTypeMap[type].push(operator);
		}
	};

	OperatorProvider.prototype.addOperatorToCategoryMap = function (operator) {
		// Add Operator to Category map
		var operatorCategory = operator.getCategory();
		if (!this._operatorsCategoryMap[operatorCategory]) {
			this._operatorsCategoryMap[operatorCategory] = [];
		}
		// TODO : check for duplicates

		this._operatorsCategoryMap[operatorCategory].push(operator);

	};

	return {
		getInstance: function () {
			if (!instance) {
				instance = new OperatorProvider();
				instance.constructor = null;
			}
			return instance;
		}
	};

}, true);
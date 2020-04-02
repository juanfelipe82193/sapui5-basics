sap.ui.define(["sap/rules/ui/ast/autoComplete/node/BaseNode",
	"sap/rules/ui/ast/constants/Constants"
], function (BaseNode, Constants) {
	"use strict";

	var OperatorNode = function () {
		BaseNode.apply(this, arguments);
		this._probableBusinessDataReturnTypeList = [];
		this._probableDataObjectReturnTypeList = [];
		this._operatorMetaData = {};
	};

	OperatorNode.prototype = new BaseNode();
	OperatorNode.prototype.constructor = BaseNode;

	OperatorNode.prototype.getProbableBusinessDataReturnTypeList = function () {
		return this._probableBusinessDataReturnTypeList;
	};

	OperatorNode.prototype.setProbableBusinessDataReturnTypeList = function (probableBusinessDataReturnTypeList) {
		this._probableBusinessDataReturnTypeList = probableBusinessDataReturnTypeList;
		return this;
	};

	OperatorNode.prototype.getProbableDataObjectReturnTypeList = function () {
		return this._probableDataObjectReturnTypeList;
	};

	OperatorNode.prototype.setProbableDataObjectReturnTypeList = function (probableDataObjectReturnTypeList) {
		this._probableDataObjectReturnTypeList = probableDataObjectReturnTypeList;
		return this;
	};

	OperatorNode.prototype.getOperatorMetadata = function () {
		return this._operatorMetaData;
	};

	OperatorNode.prototype.setOperatorMetadata = function (operatorMetaData) {
		this._operatorMetaData = operatorMetaData;
		return this;
	};

	OperatorNode.prototype.getNodeType = function () {
		return Constants.OPERATORNODE;
	};

	return OperatorNode;

}, true);
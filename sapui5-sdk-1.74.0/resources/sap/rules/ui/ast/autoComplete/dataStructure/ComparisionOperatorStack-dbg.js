sap.ui.define(["sap/rules/ui/ast/autoComplete/dataStructure/BaseStack",
		"sap/rules/ui/ast/constants/Constants",
		"sap/rules/ui/ast/autoComplete/node/TermNode",
		"sap/rules/ui/ast/autoComplete/dataStructure/Stack",
		"sap/rules/ui/ast/provider/OperatorProvider"
	],
	function (BaseStack, Constants, TermNode, Stack, OperatorProvider) {
		"use strict";

		var ComparisionOperatorStack = function () {
			BaseStack.apply(this, arguments);
			this._name = "";
			this._sLeftOperandBusinessDataType = null;
			var node = new sap.rules.ui.ast.autoComplete.dataStructure.Stack(this.getTermPrefixId());
			node.setContextComparision(true);
			node.setPrevious(this);
			this._top = node;
			this._size += 1;
		};

		ComparisionOperatorStack.prototype = new BaseStack();
		ComparisionOperatorStack.prototype.constructor = BaseStack;

		ComparisionOperatorStack.prototype.push = function (oToken) {
			var type = oToken.getTokenType();
			if (type === Constants.AND || type === Constants.OR || type === Constants.COMPARISION_OPERATOR) {
				return this._calculateTopNode(type);
			}
			if ("push" in this._top) {
				return this._top.push(oToken);
			}
			switch (type) {
			case Constants.WS:
				return {
					bTokenPushed: true
				};
			default:
				if ("push" in this._top) {
					return this._top.push(oToken);
				} else {
					return {
						bTokenPushed: false
					}
				}

			}
		};

		ComparisionOperatorStack.prototype.getName = function () {
			return this._name;
		};

		ComparisionOperatorStack.prototype.setName = function (name) {
			this._name = name;
			this._metadata = OperatorProvider.getInstance().getOperatorByName(name)
			return this;
		};

		ComparisionOperatorStack.prototype.getOperatorMetadata = function () {
			return this._metadata;
		};

		ComparisionOperatorStack.prototype.setLeftOperandBusinessDataType = function (sLeftOperandBusinessDataType) {
			this._sLeftOperandBusinessDataType = sLeftOperandBusinessDataType;
			if (this._top && "setComparisionLeftOperandType" in this._top) {
				this._top.setComparisionLeftOperandType(sLeftOperandBusinessDataType);
			}
		};

		ComparisionOperatorStack.prototype.getProbableBusinessDataReturnTypeList = function () {
			return this.getOperatorMetadata().getReturnValueBussinessDataTypeCollection()[this._sLeftOperandBusinessDataType] ? Object.keys(this.getOperatorMetadata()
				.getReturnValueBussinessDataTypeCollection()[this._sLeftOperandBusinessDataType]) : [];
		};

		ComparisionOperatorStack.prototype.getProbableDataObjectReturnTypeList = function () {
			// TODO: Pass dataobject type to comparision stack
			return this.getOperatorMetadata().getReturnValueDataObjectTypeCollection()["E"] ? Object.keys(this.getOperatorMetadata().getReturnValueDataObjectTypeCollection()[
				"E"]) : [];
		};

		ComparisionOperatorStack.prototype._calculateTopNode = function (name) {
			this._top = this._getNodeRecursively(this.getTop());
			if (this._metadata === undefined) {
				this._metadata = OperatorProvider.getInstance().getOperatorByName(name)
			}
			return {
				bTokenPushed: true,
				bComparisionOperatorClosed: true,
				oMetadata: this._metadata
			};
		};

		return ComparisionOperatorStack;
	}, true);

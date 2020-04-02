sap.ui.define([
	"sap/rules/ui/ast/autoComplete/node/TermNode",
	"sap/rules/ui/ast/constants/Constants",
	"sap/rules/ui/ast/autoComplete/dataStructure/BaseStack",
	"sap/rules/ui/ast/provider/FunctionProvider",
	"sap/rules/ui/ast/provider/OperatorProvider",
	"sap/rules/ui/ast/autoComplete/dataStructure/FunctionalStack",
	"sap/rules/ui/ast/autoComplete/dataStructure/ArrayAndRangeStack",
	"sap/rules/ui/ast/autoComplete/node/OperatorNode",
	"sap/rules/ui/ast/autoComplete/dataStructure/ComparisionOperatorStack"
],
function (TermNode, Constants, BaseStack, FunctionProvider, OperatorProvider, FunctionalStack, ArrayAndRangeStack, OperatorNode,
	ComparisionOperatorStack) {
	"use strict";

	var Stack = function () {
		BaseStack.apply(this, arguments);
		this._probableBusinessDataReturnTypeList = [];
		this._probableDataObjectReturnTypeList = [];
		this._isContextComparision = false;
		this._comparisionLeftOperandBusinessType = null;
	};

	Stack.prototype = new BaseStack();
	Stack.prototype.constructor = BaseStack;

	Stack.prototype.push = function (oToken) {
		var type = oToken.getTokenType();
		var oResult;
		var node;
		if (this.getTop() && "push" in this.getTop()) {
			oResult = this.getTop().push(oToken);
			if (oResult && oResult.bTokenPushed == true || (oResult && "errorCode" in oResult)) {
				if (oResult.bFunctionClosed == true) {
					return this._handleFunctionClosed();
				} else if (oResult.bArrayAndRangeClosed == true) {
					return this._handleArrayAndRangeClosed();
				} else if (oResult.bComparisionOperatorClosed) {
					return this._handleComparisionOperatorClosed(oResult, oToken);
				}
				return oResult;
			}
		}
		switch (type) {
			case Constants.AND:
			case Constants.OR:
				var oTopNode = this._getNodeRecursively(this._top);
				if (oTopNode && "getBusinessDataType" in oTopNode && oTopNode.getBusinessDataType() == Constants.BOOLEANBUSINESSDATATYPE) {
					this.empty();
					return {
						bTokenPushed: true
					};
				}
				return {
					bTokenPushed: false
				};
		case Constants.RIGHTPARENTHESIS:
			return this._handleRightParenthesisToken(oToken);
		case Constants.LEFTPARENTHESIS:
			return this._handleLeftParenthesisToken(oToken);
		case Constants.STRINGBUSINESSDATATYPE:
		case Constants.DATEBUSINESSDATATYPE:
		case Constants.BOOLEANBUSINESSDATATYPE:
		case Constants.TIMEBUSINESSDATATYPE:
		case Constants.QUANTITYBUSINESSDATATYPE:
		case Constants.NUMBERBUSINESSDATATYPE:
		case Constants.GEOBUSINESSDATATYPE:
		case Constants.UTC_TIMESTAMP:
		case Constants.TERM:
			return this._handleTermAndLiteralToken(oToken);
		case Constants.OPERATOR:
			return this._handleOpertorToken(oToken);
		case Constants.RANGE_OPERATOR:
		case Constants.ARRAY_OPERATOR:
			var sOperatorName = oToken.getText();
			var oOperator = OperatorProvider.getInstance().getOperatorByName(sOperatorName.toUpperCase());
			node = new ArrayAndRangeStack(this.getTermPrefixId());
			node.setOperator(oOperator);
			node.setPrevious(this._top);
			this._top = node;
			this._size += 1;
			return {
				bTokenPushed: true
			};
		case Constants.COMPARISION_OPERATOR:
			return this._createComparisionStack(oToken.getText());
		case Constants.FUNCTION:
			var sFunctionName = oToken.getText();
			var oFunction = FunctionProvider.getInstance().getFunctionByName(sFunctionName.toUpperCase());
			node = new FunctionalStack(this.getTermPrefixId());
			node.setFunction(oFunction);
			node.setPrevious(this._top);
			this._top = node;
			this._size += 1;
			return {
				bTokenPushed: true
			};

		case Constants.COMMA:
			return {
				bTokenPushed: false,
				error: "invalid character comma"
			};
		case Constants.WS:
			return {
				bTokenPushed: true
			};
		default:
			return {
				bTokenPushed: false,
				error: "unidentified  token"
			};
		}
	};

	Stack.prototype._createComparisionStack = function (sOperatorName) {
		var oTopNode = this._getNodeRecursively(this._top);

		if (oTopNode && "getBusinessDataType" in oTopNode && oTopNode.getBusinessDataType()) {
			if ((sOperatorName === '=' || sOperatorName === '!=') && (oTopNode.getBusinessDataType() === Constants.BOOLEANBUSINESSDATATYPE)) {
				this.empty();
				return {
					bTokenPushed: true
				};
			}
			var node;
			node = new ComparisionOperatorStack(this.getTermPrefixId());
			node.setName(sOperatorName);
			node.setLeftOperandBusinessDataType(oTopNode.getBusinessDataType());
			node.setPrevious(this._top);
			this._top = node;
			this._size += 1;
			return {
				bTokenPushed: true
			};
		} else {
			return {
				bTokenPushed: false,
				errorCode: 5,
					error: "Could not Determine BussinessDataType of Left Operarnd for ComparisionOperator : " + sOperatorName
			};
		}
	};

	Stack.prototype._doesStackContainsFunctions = function (node) {
		var prev = node;
		while ("getTop" in node && node.getTop()) {
			if (node instanceof FunctionalStack) {
				return true;
			}
			prev = node;
			node = node.getTop();
		}
		return false;
	};

	Stack.prototype.getProbableBusinessDataReturnTypeList = function () {
		return this._probableBusinessDataReturnTypeList;
	};

	Stack.prototype.setProbableBusinessDataReturnTypeList = function (probableBusinessDataReturnTypeList) {
		this._probableBusinessDataReturnTypeList = probableBusinessDataReturnTypeList;
		return this;
	};

	Stack.prototype.getProbableDataObjectReturnTypeList = function () {
		return this._probableDataObjectReturnTypeList;
	};

	Stack.prototype.setProbableDataObjectReturnTypeList = function (probableDataObjectReturnTypeList) {
		this._probableDataObjectReturnTypeList = probableDataObjectReturnTypeList;
		return this;
	};

	Stack.prototype.isContextComparision = function () {
		return this._isContextComparision;
	};

	Stack.prototype.setContextComparision = function (isContextComparision) {
		this._isContextComparision = isContextComparision;
	};

	Stack.prototype.setComparisionLeftOperandType = function (comparisionLeftOperandBusinessType) {
		this._comparisionLeftOperandBusinessType = comparisionLeftOperandBusinessType;
	};

	Stack.prototype.getComparisionLeftOperandBusinessType = function () {
		return this._comparisionLeftOperandBusinessType;
	};

	Stack.prototype._handleTermAndLiteralToken = function (oToken) {
		var node = this._nodeManager.getNode(oToken, this.getTermPrefixId());
		var cNode;
		var cText;
		var isError = false;
		var errorObject = {
			bTokenPushed: false,
			errorCode: 1 // TODO : handle error codes
		};
		if (this.getSize() == 0) {
			node.setPrevious(this._top);
			this._top = node;
			this._size += 1;
			return {
				bTokenPushed: true
			};
		} else if (this.getTop() && "getNodeType" in this.getTop() && this.getTop().getNodeType() == Constants.OPERATORNODE && this._top.getPrevious() &&
			("getBusinessDataType" in this._top.getPrevious() || (this._getNodeRecursively(this._top.getPrevious()) && "getBusinessDataType" in
				this._getNodeRecursively(this._top.getPrevious())))) {
			// Caluculated Node
			// TODO : Semantic validation before calculating node
			cNode = new TermNode();
			var operatorNode = this._getNodeRecursively(this._top);
			var operator = operatorNode.getOperatorMetadata();
			// TODO : uninary operator handling
			var preTermNode = this._getNodeRecursively(this._top.getPrevious());
			var prevTermNodeBuisnessDataType = preTermNode ? preTermNode.getBusinessDataType() : "";
			if (preTermNode && "getDataObjectType" in preTermNode)
				var prevTermNodeDataObjectType = preTermNode.getDataObjectType();

			cText = preTermNode.getName() + " " + operatorNode.getName() + " " +
				node.getName();

			// Determine businessDataType and dataobjectType of calculated Node
			cNode.setName(cText).setLabel(cText);

			if (prevTermNodeDataObjectType) {
				var returnDataObjectType = operator.getReturnValueDataObjectTypeCollection()[prevTermNodeDataObjectType][node.getDataObjectType()];
				if (returnDataObjectType) {
					cNode.setDataObjectType(returnDataObjectType);
				} else {
					errorObject["expectedDataObjectTypeList"] = Object.keys(operator.getReturnValueDataObjectTypeCollection()[
						prevTermNodeDataObjectType]);
					isError = true;
				}
			}
			if (prevTermNodeBuisnessDataType) {
				var returnBusinessDataType = operator.getReturnValueBussinessDataTypeCollection()[prevTermNodeBuisnessDataType][node.getBusinessDataType()];
				if (returnBusinessDataType) {
					cNode.setBusinessDataType(returnBusinessDataType);
				} else {
					errorObject["expectedBusinessDataTypeList"] = Object.keys(operator.getReturnValueBussinessDataTypeCollection()[
						prevTermNodeBuisnessDataType]);
					isError = true;
				}
			}

			if (isError) {
				return errorObject;
			}

			this.pop();
			this.pop();
			cNode.setPrevious(this._top);
			this._top = cNode;
			this._size += 1;
			// Pop twice

			return {
				bTokenPushed: true
			};
		} else if (this.getTop() && this.getTop() instanceof OperatorNode &&
			(this.getTop().getName() == Constants.MINUS || this.getTop().getName() == Constants.LOGICAL_NOT)) {
			// TODO : check which datatype should be supported for Minus and logical Not 
			cNode = new TermNode();
			cText = this.getTop().getName() + " " + node.getName();
			cNode.setName(cText).setLabel(cText);

			if (this.getTop().getName() == Constants.MINUS && (node instanceof TermNode &&
					!(node.getBusinessDataType() == Constants.NUMBERBUSINESSDATATYPE)) || !(oToken.getTokenType() == Constants.NUMBERBUSINESSDATATYPE)) {
				errorObject["expectedBusinessDataTypeList"] = [Constants.NUMBERBUSINESSDATATYPE];
				isError = true;
			} else if (this.getTop().getName() == Constants.LOGICAL_NOT && (node instanceof TermNode &&
					!(node.getBusinessDataType() == Constants.BOOLEANBUSINESSDATATYPE) || !(oToken.getTokenType() == Constants.BOOLEANBUSINESSDATATYPE)
				)) {
				errorObject["expectedBusinessDataTypeList"] = [Constants.BOOLEANBUSINESSDATATYPE];
				isError = true;
			}

			if (isError) {
				return errorObject;
			} else if (this.getTop().getName() == Constants.MINUS) {
				cNode.setBusinessDataType(Constants.NUMBERBUSINESSDATATYPE);
				cNode.setDataObjectType(Constants.Element);
			} else if (this.getTop().getName() == Constants.LOGICAL_NOT) {
				cNode.setBusinessDataType(Constants.BOOLEANBUSINESSDATATYPE);
				cNode.setDataObjectType(Constants.Element);
			}
			this.pop();
			cNode.setPrevious(this._top);
			this._top = cNode;
			this._size += 1;

			return {
				bTokenPushed: true
			};

		} else {
			return {
				bTokenPushed: false,
				error: "Token should be prefixed with operator"
			};
		}
	};

	Stack.prototype._handleOpertorToken = function (oToken) {
		var node = this._nodeManager.getNode(oToken);
		var topNode = this._getNodeRecursively(this._top);
		if (topNode) {
			var previousNode = this._getNodeRecursively(this._top);
			var previousDataObjectType;
			var previousNodeBusinessType;
			if (previousNode && "getBusinessDataType" in previousNode)
				previousNodeBusinessType = previousNode.getBusinessDataType();
			if (previousNode && "getDataObjectType" in previousNode) {
				previousDataObjectType = previousNode.getDataObjectType();
			}

			var operator = node.getOperatorMetadata();

			if (previousDataObjectType && operator.getReturnValueDataObjectTypeCollection() && operator.getReturnValueDataObjectTypeCollection()[
					previousDataObjectType]) {
				node.setProbableDataObjectReturnTypeList(
					Object.keys(operator.getReturnValueDataObjectTypeCollection()[previousDataObjectType]));
			} else if (previousDataObjectType) {
				return {
					bTokenPushed: false,
					errorCode: 3,
					error: "Left operand DataObject type : " + previousDataObjectType + " is not matching given operator DataObject"
				};
			}
			// DeterMine Probable BusinessDataReturnTypeList
			if (previousNodeBusinessType && operator.getReturnValueBussinessDataTypeCollection() && operator.getReturnValueBussinessDataTypeCollection() &&
				operator.getReturnValueBussinessDataTypeCollection()[
					previousNodeBusinessType]) {
				node.setProbableBusinessDataReturnTypeList(
					Object.keys(operator.getReturnValueBussinessDataTypeCollection()[previousNodeBusinessType]));
			} else if (previousNodeBusinessType) {
				return {
					bTokenPushed: false,
					errorCode: 4,
					error: "Left operand businessDatatype : " + previousNodeBusinessType + " is not matching given operator businessDataType"
				};
			}

			node.setPrevious(this._top);
			this._top = node;
			this._size += 1;
			return {
				bTokenPushed: true
			};
		} else if (!(topNode instanceof TermNode) && (oToken.getText() == Constants.MINUS || oToken.getText() == Constants.LOGICAL_NOT)) {
			node.setPrevious(this._top);
			if (oToken.getText() == Constants.MINUS) {
				node.setProbableBusinessDataReturnTypeList([Constants.NUMBERBUSINESSDATATYPE]);
			} else {
				node.setProbableBusinessDataReturnTypeList([Constants.BOOLEANBUSINESSDATATYPE]);
			}
			node.setProbableDataObjectReturnTypeList([Constants.Element]);
			this._top = node;
			this._size += 1;
			return {
				bTokenPushed: true
			};
		} else {
			return {
				bTokenPushed: false,
				error: "Operator should be preceded with term/Expression"
			};
		}
	};

	Stack.prototype._handleLeftParenthesisToken = function (oToken) {
		if (this.getHasOpenParenthesis() === false) {
			this.setHasOpenParenthesis(true);
			var node = new sap.rules.ui.ast.autoComplete.dataStructure.Stack(this.getTermPrefixId());
			if (this._top) {
				node.setPrevious(this._top);
			} else {
				node.setPrevious(this);
			}

			node.setProbableDataObjectReturnTypeList(this.getProbableDataObjectReturnTypeList());
			node.setProbableBusinessDataReturnTypeList(this.getProbableBusinessDataReturnTypeList());

			this._top = node;
			this._size += 1;
			return {
				bTokenPushed: true
			};
		}

		return {
			bTokenPushed: false
		};
	};

		Stack.prototype._closeComparisionStack = function (oTop) {
			var oComparisionStack = this._getComparisionStack(oTop);
			var topNode = this._getNodeRecursively(oComparisionStack.getTop());
			var cNode = new TermNode();
			var operator = oComparisionStack.getOperatorMetadata();
			var prevNode = this._getNodeRecursively(oComparisionStack.getPrevious());

			var prevTermNodeBuisnessDataType = prevNode.getBusinessDataType();
			if (prevNode && "getDataObjectType" in prevNode)
				var prevTermNodeDataObjectType = prevNode.getDataObjectType();

			var cText = prevNode.getName() + " " + operator.getName() + " " +
				topNode.getName();

			// Determine businessDataType and dataobjectType of calculated Node
			cNode.setName(cText).setLabel(cText);

			var errorObject = {
				bTokenPushed: false,
				errorCode: 1 // TODO : handle error codes
			};

			var isError = false;

			if (prevTermNodeDataObjectType) {
				var expectedDataObjectType = operator.getReturnValueDataObjectTypeCollection()[prevTermNodeDataObjectType][topNode.getDataObjectType()];
				if (expectedDataObjectType) {
					cNode.setDataObjectType(expectedDataObjectType);
				} else {
					errorObject["expectedDataObjectTypeList"] = Object.keys(operator.getReturnValueDataObjectTypeCollection()[
						prevTermNodeDataObjectType]);
					isError = true;
				}
			}
			if (prevTermNodeBuisnessDataType) {
				var expectedbusinessDataType = operator.getReturnValueBussinessDataTypeCollection()[prevTermNodeBuisnessDataType][topNode.getBusinessDataType()];
				if (expectedbusinessDataType) {
					cNode.setBusinessDataType(expectedbusinessDataType);
				} else {
					errorObject["expectedBusinessDataTypeList"] = Object.keys(operator.getReturnValueBussinessDataTypeCollection()[
						prevTermNodeBuisnessDataType]);
					isError = true;
				}
			}
			if (isError) {
				return errorObject;
			}

			cNode.setPrevious(null);
			this._top = cNode;
			this._size = 1;

			return {
				bTokenPushed: true
			};
		};

		Stack.prototype._handleRightParenthesisToken = function (oToken) {
			var topNode
			if (this.getHasOpenParenthesis() == true) {
				topNode = this._getNodeRecursively(this._top);
				this.setHasOpenParenthesis(false);

				// TODO : handle unary operators
				if (this.getSize() > 0 && this._top.getPrevious() && "getNodeType" in this._top.getPrevious() && this._top.getPrevious().getNodeType() ==
					Constants.OPERATORNODE) {
					return this._calculateTopNode();
				} else if (this._doesStackContainsComparisionOperator(this.getTop())) {
					return this._closeComparisionStack(this.getTop());
				} else {
					this._top = topNode;
				}
				return {
					bTokenPushed: true
				}
			}
			return {
				bTokenPushed: false,
				error: "Extra right parenthesis"
			};
		};

	Stack.prototype._handleFunctionClosed = function () {
		return this._calculateTopNode();

	};

	Stack.prototype._handleArrayAndRangeClosed = function () {
		var cNode = new TermNode();
		// TODO : Add the array operator text
		cNode.setName("Array and range Operator").setLabel("Array and range Operator");
		cNode.setBusinessDataType(Constants.BOOLEANBUSINESSDATATYPE);
		cNode.setDataObjectType(Constants.Element);
		cNode.setPrevious(null);
		this._top = cNode;
		this.size = 1;

		return {
			bTokenPushed: true
		}
	};

	Stack.prototype._handleComparisionOperatorClosed = function (oResult, oToken) {
		var rightOperandNode = this._getNodeRecursively(this._top);
		var operator = oResult.oMetadata;
		var leftOPerandNode = this._top.getPrevious();

		var errorObject = {
			bTokenPushed: false,
			errorCode: 1 // TODO : handle error codes
		};

		var cNode = new TermNode();
		var cText = rightOperandNode.getName() + " " + operator.getName() + " " +
			leftOPerandNode.getName();
			var sBusinessDataType = operator.getReturnValueBussinessDataTypeCollection()[leftOPerandNode.getBusinessDataType()][rightOperandNode
				.getBusinessDataType()
			];
		if (sBusinessDataType) {
			cNode.setBusinessDataType(Constants.BOOLEANBUSINESSDATATYPE);
			cNode.setDataObjectType(Constants.Element);
			cNode.setPrevious(null);
			cNode.setName(cText).setLabel(cText);
			this._top = cNode;
			this._size = 1;
				if (oToken && oToken.getTokenType() == Constants.AND || oToken.getTokenType() == Constants.OR) {
					this.empty();
					return {
						bTokenPushed: true
					};
				}
			return this._createComparisionStack(oToken.getText());
		}

		return errorObject;

	};

		Stack.prototype._doesStackContainsComparisionOperator = function (node) {
			if (node && node instanceof ComparisionOperatorStack) {
				return true;
			}
			while (node && "getTop" in node) {
				node = node.getTop();
				if (node instanceof ComparisionOperatorStack) {
					return true;
				}
			}
			return false;
		};

		Stack.prototype._getComparisionStack = function (node) {
			if (node && node instanceof ComparisionOperatorStack) {
				return node;
			}
			while (node && "getTop" in node) {
				node = node.getTop();
				if (node instanceof ComparisionOperatorStack) {
					return node;
				}
			}
			return node;
		};

	Stack.prototype._calculateTopNode = function () {
		var topNode = this._getNodeRecursively(this._top);
		var cNode = new TermNode();
		var operatorNode = this._top.getPrevious();
		var cText;
		var prevNode;

		// Existis with Functions support
		if (operatorNode && "getOperator" in operatorNode && operatorNode.getOperator() && "getSupportedFunctions" in operatorNode.getOperator() &&
			operatorNode.getOperator().getSupportedFunctions()) {
			var aSupportedFunctions = operatorNode.getOperator().getSupportedFunctions();
			prevNode = this._getNodeRecursively(operatorNode.getPrevious());
			var bIsSupportedFunction = false;
			for (var lIterator = 0; lIterator < aSupportedFunctions.length; lIterator++) {
				if (aSupportedFunctions[lIterator].name.toLocaleUpperCase() == topNode.getName()) {
					cText = prevNode.getName() + " " + operatorNode.getOperator().getName() + " " + topNode.getName();
					cNode.setName(cText).setLabel(cText);
					if (aSupportedFunctions[lIterator].dataObjectTypeList && aSupportedFunctions[lIterator].dataObjectTypeList[0]) {
						cNode.setDataObjectType(aSupportedFunctions[lIterator].dataObjectTypeList[0]);
					}
					cNode.setBusinessDataType(aSupportedFunctions[lIterator].businessDataType);
					bIsSupportedFunction = true;
				}
			}
			if (!bIsSupportedFunction) {
				return {
					bTokenPushed: false,
					errorCode: 6 // TODO : handle error codes
				}
			}

		} else if (operatorNode) {
			var operator = operatorNode.getOperatorMetadata();
			prevNode = this._getNodeRecursively(operatorNode.getPrevious());
			var prevTermNodeBuisnessDataType = prevNode.getBusinessDataType();
			if (prevNode && "getDataObjectType" in prevNode)
				var prevTermNodeDataObjectType = prevNode.getDataObjectType();

			cText = prevNode.getName() + " " + operator.getName() + " " +
				topNode.getName();

			// Determine businessDataType and dataobjectType of calculated Node
			cNode.setName(cText).setLabel(cText);

			var errorObject = {
				bTokenPushed: false,
				errorCode: 1 // TODO : handle error codes
			};

			var isError = false;

			if (prevTermNodeDataObjectType && topNode.getDataObjectType()) {
				var expectedDataObjectType = operator.getReturnValueDataObjectTypeCollection()[prevTermNodeDataObjectType][topNode.getDataObjectType()];
				if (expectedDataObjectType) {
					cNode.setDataObjectType(expectedDataObjectType);
				} else {
					errorObject["expectedDataObjectTypeList"] = Object.keys(operator.getReturnValueDataObjectTypeCollection()[
						prevTermNodeDataObjectType]);
					isError = true;
				}
			}
			if (prevTermNodeBuisnessDataType && topNode.getBusinessDataType()) {
				var expectedbusinessDataType = operator.getReturnValueBussinessDataTypeCollection()[prevTermNodeBuisnessDataType][topNode.getBusinessDataType()];
				if (expectedbusinessDataType) {
					cNode.setBusinessDataType(expectedbusinessDataType);
				} else {
					errorObject["expectedBusinessDataTypeList"] = Object.keys(operator.getReturnValueBussinessDataTypeCollection()[
						prevTermNodeBuisnessDataType]);
					isError = true;
				}
			}
			if (isError) {
				return errorObject;
			}
		} else {
			cNode.setName(topNode.getName()).setLabel(topNode.getLabel());
			cNode.setBusinessDataType(topNode.getBusinessDataType());
			cNode.setDataObjectType(topNode.getDataObjectType());
		}

		cNode.setPrevious(null);
		this._top = cNode;
		this._size = 1;

		return {
			bTokenPushed: true
		}
	}

	return Stack;
}, true);

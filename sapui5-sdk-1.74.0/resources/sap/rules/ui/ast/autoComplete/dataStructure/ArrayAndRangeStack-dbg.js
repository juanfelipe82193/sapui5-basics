sap.ui.define(["sap/rules/ui/ast/constants/Constants",
		"sap/rules/ui/ast/autoComplete/dataStructure/BaseStack",
		"sap/rules/ui/ast/autoComplete/dataStructure/Stack"
	],
	function (Constants, BaseStack, Stack) {
		"use strict";

		var ArrayAndRangeStack = function () {
			BaseStack.apply(this, arguments);
			this._oOperator = null;
		};

		ArrayAndRangeStack.prototype = new BaseStack();
		ArrayAndRangeStack.prototype.constructor = BaseStack;

		ArrayAndRangeStack.prototype.push = function (oToken) {
			var type = oToken.getTokenType();
			var oResult;
			if (this.getTop() && "push" in this.getTop()) {
				oResult = this.getTop().push(oToken);
				if (oResult && oResult.bTokenPushed == true || "errorCode" in oResult) {
					return oResult;
				}
			}
			switch (type) {
			case Constants.LEFTSQUAREPARENTHESIS:
			case Constants.LEFTPARENTHESIS:
				return this._handleLeftParenthesis(oToken);
			case Constants.RIGHTSQUAREPARENTHESIS:
			case Constants.RIGHTPARENTHESIS:
				return this._handleRightParenthesis(oToken);

			case Constants.COMMA:
			case Constants.RANGE_DOTS:
				var node = new sap.rules.ui.ast.autoComplete.dataStructure.Stack(this.getTermPrefixId());
				node.setPrevious(this._top);
				this._top = node;
				this._size += 1;
				return {
					bTokenPushed: true
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

		ArrayAndRangeStack.prototype._handleLeftParenthesis = function (oToken) {
			if (this.getHasOpenParenthesis() === false) {
				this.setHasOpenParenthesis(true);
				var node = new sap.rules.ui.ast.autoComplete.dataStructure.Stack(this.getTermPrefixId());
				node.setPrevious(this._top);
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

		ArrayAndRangeStack.prototype._handleRightParenthesis = function () {
			if (this.getHasOpenParenthesis() == true) {
				this.setHasOpenParenthesis(false);
				return {
					bTokenPushed: true,
					bArrayAndRangeClosed: true
				};
			}
			return {
				bTokenPushed: false,
				error: "Extra right sqaure bracket parenthesis"
			};

		};

		ArrayAndRangeStack.prototype.getOperator = function () {
			return this._oOperator;
		};

		ArrayAndRangeStack.prototype.setOperator = function (oOperator) {
			this._oOperator = oOperator;
			return this;
		};

		return ArrayAndRangeStack;
	}, true);
sap.ui.define(["sap/rules/ui/ast/autoComplete/node/NodeManager",], function (NodeManager) {
	"use strict";

	var BaseStack = function (sTermPrefixId) {
		this._nodeManager = new NodeManager();
		this._top = null;
		this._size = 0;
		this._previous = null;
		this._hasOpenLeftParenthesis = false;
		this.sTermPrefixId = sTermPrefixId;
	};

	BaseStack.prototype.pop = function () {
		var temp = this._top;
		this._top = this._top.getPrevious();
		this._size -= 1;
		return temp;
	};

	BaseStack.prototype.getTop = function () {
		return this._top;
	};

	BaseStack.prototype.getSize = function () {
		return this._size;
	};

	BaseStack.prototype.empty = function () {
		this._top = null;
		this._hasOpenLeftParenthesis = false;
		this._size = 0;
	};

	BaseStack.prototype.getPrevious = function () {
		return this._previous;
	};

	BaseStack.prototype.setPrevious = function (previous) {
		this._previous = previous;
		return this;
	};

	BaseStack.prototype.getHasOpenParenthesis = function () {
		return this._hasOpenLeftParenthesis;
	};

	BaseStack.prototype.setHasOpenParenthesis = function (hasOneOpenLeftParenthesis) {
		this._hasOpenLeftParenthesis = hasOneOpenLeftParenthesis;
		return this;
	};

	BaseStack.prototype.peek = function (lIndex) {
		var peekIndex = this.getSize() - lIndex - 1;
		var node = this.getTop();
		if (peekIndex < 0) {
			return;
		}
		while (peekIndex > 0 && node) {
			node = node.getPrevious();
			peekIndex--;
		}

		return node;

	};

	BaseStack.prototype._getNodeRecursively = function (node) {
		while (node && "getTop" in node) {
			node = node.getTop();
		}
		return node;
	};
	
	BaseStack.prototype._getTopStackRecursively = function (node) {
			var prev = node;
			while ("getTop" in node && node.getTop()) {
				prev = node;
				node = node.getTop();
			}
			return prev;
		};

    BaseStack.prototype._getTopStackRecursively = function (node) {
        var prev = node;
        while ("getTop" in node && node.getTop()) {
            prev = node;
            node = node.getTop();
        }
        return prev;
    };

	BaseStack.prototype.setTermPrefixId = function (prefixId) {
		this.sTermPrefixId = prefixId;
	};

	BaseStack.prototype.getTermPrefixId = function(){
		return this.sTermPrefixId;
	}



	return BaseStack;
}, true);
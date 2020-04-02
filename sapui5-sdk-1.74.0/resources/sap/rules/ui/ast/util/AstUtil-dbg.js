sap.ui.define(function () {
	"use strict";

	function AstUtil() {};
	AstUtil.prototype.HashSet = function () {
		var set = {};
		this.add = function (key) {
			set[key] = true;
		};
		this.remove = function (key) {
			delete set[key];
		};
		this.clear = function () {
			set = {};
		};
		this.contains = function (key) {
			return set.hasOwnProperty(key);
		};
	};

    AstUtil.prototype._getCamelCaseOperatorName = function (sOperator) {
        var operators = {
            "+": "Add",
            "-": "Subtract",
            "*": "Multiply",
            "/": "Divide",
            "=": "IsEqual",
            "!=": "IsNotEqual",
            ">": "IsGreater",
            ">=": "IsGreaterEqual",
            "<": "IsLess",
            "<=": "IsLessEqual",
            "IN": "In",
            "NOTIN": "NotIn",
            "EXISTSIN": "ExistsIn",
            "NOTEXISTSIN": "NotExistsIn",
            "MATCHES": "ContainsPattern",
            "NOTMATCHES": "NotContainsPattern",
            "CONTAINS": "ContainsString",
            "NOTCONTAINS": "NotContainsString",
            "STARTSWITH": "StartsWith",
            "NOTSTARTSWITH": "NotStartsWith",
            "ENDSWITH": "EndsWith",
            "NOTENDSWITH": "NotEndsWith",
            "ISWITHIN": "IsWithin",
            "ISNOTWITHIN": "IsNotWithin",
            "ISINNEXT": "IsInNext",
            "ISNOTINNEXT": "IsNotInNext",
            "ISINLAST": "IsInLast",
            "ISNOTINLAST": "IsNotInLast"
        };
        return operators[sOperator] ? operators[sOperator] : sOperator;
    };

    AstUtil.prototype._getCapitalOperatorName = function (sOperator) {
        var operators = {
            "Add": "+",
            "Subtract": "-",
            "Multiply": "*",
            "Divide": "/",
            "IsEqual": "=",
            "IsNotEqual": "!=",
            "IsGreater": ">",
            "IsGreaterEqual": ">=",
            "IsLess": "<",
            "IsLessEqual": "<=",
            "In": "IN",
            "NotIn": "NOTIN",
            "ExistsIn": "EXISTSIN",
            "NotExistsIn": "NOTEXISTSIN",
            "ContainsPattern": "MATCHES",
            "NotContainsPattern": "NOTMATCHES",
            "ContainsString": "CONTAINS",
            "NotContainsString": "NOTCONTAINS",
            "StartsWith": "STARTSWITH",
            "NotStartsWith": "NOTSTARTSWITH",
            "EndsWith": "ENDSWITH",
            "NotEndsWith": "NOTENDSWITH",
            "IsWithin": "ISWITHIN",
            "IsNotWithin": "ISNOTWITHIN",
            "IsInNext": "ISINNEXT",
            "IsNotInNext": "ISNOTINNEXT",
            "IsInLast": "ISINLAST",
            "IsNotInLast": "ISNOTINLAST",
        };
        return operators[sOperator] ? operators[sOperator] : sOperator;
    };

	return AstUtil;
}, true);
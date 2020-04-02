/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

/************************************************************************
 ******************************* Constants ******************************
 ************************************************************************/

sap.ui.define(function() {
	"use strict";

	// Using brackets notations instead of dot notations because key string can have spaces

	var Constants = {};

	// Arithmetic Constants
	Constants["+"] = "add";
	Constants["-"] = "subtract";
	Constants["*"] = "multiply";
	Constants["/"] = "divide";

	//Collection Constants
	Constants["exists in"] = "existsIn";
	Constants["does not exists in"] = "doesNotExistsIn";
	Constants["not exists in"] = "doesNotExistsIn";
	Constants["is between"] = "isBetween";
	Constants["between"] = "isBetween";
	Constants["not between"] = "isNotBetween";
	Constants["is not between"] = "isNotBetween";

	// Comparision Constants

	Constants["is equal"] = "isEqual";
	Constants["="] = "isEqual";
	Constants["is not equal"] = "isNotEqual";
	Constants["!="] = "isNotEqual";
	Constants["is greater than"] = "isGreater";
	Constants[">"] = "isGreater";
	Constants["is equal or greater than"] = "isGreaterEqual";
	Constants[">="] = "isGreaterEqual";
	Constants["is less than"] = "isLess";
	Constants["<"] = "isLess";
	Constants["is equal or less than"] = "isLessEqual";
	Constants["<="] = "isLessEqual";

	// Date and Time Constants
	Constants["is before"] = "isBefore";
	Constants["is after"] = "isAfter";
	Constants["is not before"] = "isNotBefore";
	Constants["is not After"] = "isNotAfter";
	Constants["is in the last"] = "isInTheLast";
	Constants["in the last"] = "isInTheLast";
	Constants["is in the next"] = "isInTheNext";
	Constants["in the next"] = "isInTheNext";
	Constants["is not in the last"] = "isNotInTheLast";
	Constants["not in the last"] = "isNotInTheLast";
	Constants["is not after today"] = "isNotAfterToday";
	Constants["not after today"] = "isNotAfterToday";

	// Logical Constants
	Constants["or"] = "or";
	Constants["and"] = "and";
	Constants["any"] = "or";
	Constants["all"] = "all";

	// String Constants
	Constants["contains"] = "contains";
	Constants["does not contain"] = "notContains";
	Constants["not contains"] = "notContains";
	Constants["like"] = "isLike";
	Constants["not like"] = "isNotLike";
	Constants["starts"] = "isStartsWith";
	Constants["not starts"] = "isNotStartsWith";
	Constants["ends"] = "isEndsWith";
	Constants["not ends"] = "isNotEndsWith";

	// Statements type
	Constants.MODEL = "Model";
	Constants.BOOLEAN_EQUALITY_OPERATOR = "BooleanEqualityOperator";
	Constants.SIMPLE_STATEMENT = "SimpleStatement";
	Constants.COMPLEX_STATEMENT = "ComplexStatement";
	Constants.STATEMENT_OPERATOR = "StatementOperator";
	Constants.RESULTS = "results";
	Constants.STATEMENTS_ARRAY = "statementsArray";
	Constants.SELECTIONS_ARRAY = "selectionsArray";
	Constants.SIMPLE_SELECTION = "SimpleSelection";
	Constants.ORIGINALVALUE = "getOriginalValue";
	Constants.COMPOUND_SELECTION = "CompoundSelection";
	Constants.ARITHMETICOPERATOR = "ArithmeticOperator";
	Constants.SELECTION_CLAUSE = "SelectionClause";
	Constants.VALUES_ARRAY = "valuesArray";

	// SelectionClause
	Constants.LEFT_SELECTION_CLAUSE = "getLeftSelectionClause";
	Constants.SELECTION_OPERATOR = "getSelectionOperator";
	Constants.RIGHT_SELECTION_CLAUSE = "getRightSelectionClause";

	// Token Types
	Constants.FUNCTION = "F";
	Constants.OBJECT = "O";
	Constants.LITERAL = "L";

	// DataObject Types
	Constants.ELEMENT = "E";
	Constants.STRUCTURE = "S";
	Constants.TABLE = "T";

	// BusinessData Types
	Constants.BOOLEAN = "B";
	Constants.STRING = "S";
	Constants.NUMBER = "N";
	Constants.DATE = "D";
	Constants.TRUE = true;
	Constants.FALSE = false;
	Constants.TIMESTAMP = "TS";
	Constants.TIME = "T";
	// Brackets
	Constants.LEFT_SMALL_BRACKET = "(";
	Constants.RIGHT_SMALL_BRACKET = ")";

	Constants.CHILDREN = "Children";
	return Constants;
}, true);

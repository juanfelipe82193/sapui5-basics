sap.ui.define(function () {
	"use strict";
	var Constants = {};
	Constants.DOT = ".";
	Constants.ASSOCIATION = "association";
	Constants.ELEMENT = "Element";

	// Token Type Constants
	Constants.LITERAL = 'L';
	Constants.OPERATOR = 'O';
	Constants.TERM = 'ID';
	Constants.WS = 'A';
	Constants.UNDEFINED = 'U';
	Constants.LEFTPARENTHESIS = "LP";
	Constants.RIGHTPARENTHESIS = "RP";
	Constants.LEFTSQUAREPARENTHESIS = "LSP";
	Constants.RIGHTSQUAREPARENTHESIS = "RSP";
	Constants.FUNCTION = "F";
	Constants.OPERATIONS = "OP";
	Constants.RANGE_DOTS = "..";
	Constants.FUNCTIONALOPERATOR = "FO";
	Constants.COMMA = ",";
	Constants.RANGE_OPERATOR = "RO";
	Constants.ARRAY_OPERATOR = "AO";
	Constants.PLACEHOLDER_OPERATOR = "M";
	Constants.PLACEHOLDER_ID = "M";
	Constants.UTC_TIMESTAMP = "U";

	// Miscelleneous
	Constants.LEFTPARENTHESISTEXT = "(";
	Constants.RIGHTPARENTHESISTEXT = ")";
	Constants.LEFTSQUAREPARENTHESISTEXT = "[";
	Constants.RIGHTSQUAREPARENTHESISTEXT = "]";
	Constants.RANGETEXT = "..";
	Constants.COMMATEXT = ",";
	Constants.SINGLE_QUOTE = "'";

	// Node Type Constatns
	Constants.OPERATORNODE = "OPERATORNODE";
	Constants.TERMNODE = "TERMNODE";
	Constants.LITERALNODE = "LITERALNODE";
	Constants.FUNCTIONNODE = "FUNCTIONNODE";
	Constants.RANGENODE = "RANGENODE";
	Constants.LEFTPARENTHESISNODE = "LPNODE";
	Constants.RIGHTPARENTHESISNODE = "RPNODE";

	// BusinessDataType constants
	Constants.NUMBERBUSINESSDATATYPE = "N";
	Constants.STRINGBUSINESSDATATYPE = "S";
	Constants.BOOLEANBUSINESSDATATYPE = "B";
	Constants.QUANTITYBUSINESSDATATYPE = "Q";
	Constants.TIMEBUSINESSDATATYPE = "T";
	Constants.DATEBUSINESSDATATYPE = "D";
	Constants.GEOBUSINESSDATATYPE = "G";

	// DataObjectType constants
	Constants.Element = "E";
	Constants.Structure = "S";
	Constants.Table = "T";
	Constants.ATTRIBUTEDOTYPE = "AT";
	Constants.ASSOCIATIONDOTYPE = "AO";

	// Datatype constants
	Constants.NUMBER = "number";
	Constants.STRING = "string";
	Constants.BOOLEAN = "boolean";

	// Operator/Function Metadata
	Constants.CATEGORY = "category";
	Constants.LABEL = "label";
	Constants.NAME = "name";
	Constants.NUMBEROFARGUMENTS = "noOfArgs";
	Constants.NUMBEROFMANDATORYARGUMENTS = "noOfMandatoryArgs";
	Constants.RETURNVALUE_BUSINESSDATA_TYPE_COLLECTION = "returnValueBusinessDataTypeCollection";
	Constants.RETURNVALUE_DATAOBJECT_TYPE_COLLECTION = "returnValueDataObjectTypeCollection";
	Constants.ARGUMENTMETADATA = "argsMetadata";
	Constants.DETERMINESRETURNDATAOBJECTTYPE = "determinesReturnDataObjectType";
	Constants.YES = "Y";
	Constants.RETURNVALUE_DATAOBJECT_TYPE_LIST = "returnDataObjectTypeList";
	Constants.RETURNVALUE_BUSINESSDATA_TYPE_LIST = "businessDataTypeList";
	Constants.DEFAULT_DATAOBJECT_RETURN_TYPE = "defaultDataObjectReturnType";
	Constants.DEFAULT_BUSINESSDATA_RETURN_TYPE = "defaultBusinessDataReturnType";
	Constants.SUPPORTED_FUNCTIONS = "supportedFunctions";
	Constants.CONTEXT = "context";
	Constants.PROBABLE_BUSINESSDATA_TYPE_LIST = "probableBusinessDataTypeList";
	Constants.PROBABLE_DATAOBJECT_TYPE_LIST = "probableDataObjectTypeList";

	// TOKEN constants

	//DataObjectType constants
	Constants["Element"] = "E";
	Constants["Structure"] = "S";
	Constants["Table"] = "T";

	// Operator constants
	Constants.MINUS = "-";
	Constants.ADD = "+";
	Constants.MULT = "*";
	Constants.DIV = "/";
	Constants.GREATER_THAN = ">";
	Constants.LESS_THAN = "<";
	Constants.EQUAL = "=";
	Constants.GREATER_THAN_EQUAL = ">=";
	Constants.LESS_THAN_EQUAL = "<=";
	Constants.NOT_EQUAL = "!=";
	Constants.LOGICAL_NOT = "!";
	Constants.AND = "AND";
	Constants.OR = "OR";
	Constants.COMPARISION_OPERATOR = "CO";
	// Operator grouping constants
	Constants.LOGICAL = "logical";
	Constants.ARITHMETIC = "arithmetic";
	Constants.COMPARISION = "comparision";
	Constants.FUNCTIONAL = "functional";
	Constants.ARRAY = "array";
	Constants.RANGE = "range";
	Constants.ADVANCED = "advanced";
	Constants.WINDOW = "window";
	Constants.WINDOWANDADVANCED = "windowandadvanced";
	Constants.SELECTION = "selection";
	Constants.AGGREGATE = "aggregate";
	Constants.DOOPERATIONS = "operations";

	//Function Constants
	Constants.AVG = "AVG";
	Constants.SUM = "SUM";
	Constants.COUNT = "COUNT";
	Constants.COUNTDISTINCT = "COUNTDISTINCT";
	Constants.DISTINCT = "DISTINCT";
	Constants.MIN = "MIN";
	Constants.MAX = "MAX";
	Constants.FILTER = "FILTER";
	Constants.TOP = "TOP";
	Constants.BOTTOM = "BOTTOM";
	Constants.SELECT = "SELECT";
	Constants.SORTASC = "SORTASC";
	Constants.SORTDESC = "SORTDESC";
	Constants.NOSORT = "NOSORT";
	Constants.FIRST = "FIRST";

	//Operations
	Constants.EXECUTE = "EXECUTE";
	Constants.UPDATE = "UPDATE";
	Constants.APPEND = "APPEND";

	//Rule Constant
	Constants.RULE = "Rule";

	//Span Attributes
	Constants.TOKEN_TYPE = "tokenType";
	Constants.REFERENCE = "reference";
	Constants.JSON = "json";

	return Constants;
}, true);

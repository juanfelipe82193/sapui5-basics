sap.ui.define(["sap/rules/ui/ast/parser/bundlelibrary",
	"sap/rules/ui/ast/constants/Constants",
	"sap/rules/ui/ast/provider/TermsProvider"
], function (astBundleLibrary, Constants, TermsProvider) {
	'use strict';

	// L - Literal Value
	// ID - Valid Term
	// LP - Left Parenthesis
	// RP - Right Parenthesis
	// AO - Arithmetic operator

	var astLibInstance = astBundleLibrary.getInstance();
	var Token = function (type, text, startIndex, endIndex, id, reference, json) {
		this._type = type;
		this.text = text;
		this.startIndex = startIndex;
		this.endIndex = endIndex;
		this.id = id;
		this.reference = reference;
		var tokenTypeObject = this._getTokenTypeObject(type);
		this.cssClass = tokenTypeObject.cssClass;
		this.tokenType = tokenTypeObject.tokenType;
		this.json = json;
		if ("dataObjectType" in tokenTypeObject) {
			this.dataObjectType = tokenTypeObject.dataObjectType;
		}
		if (this.tokenType === "ID") {
			this.reference = this.text;
		}
	};

	// TODO : only numeric operations is handled, take care of other operations
	Token.prototype._getTokenTypeObject = function (type) {
		switch (type) {
		case astLibInstance.IDPLexer.ID:
			var sText = this.text;
			sText = sText.replace(".", "");
			sText = sText.replace(/\//g, ".");
			sText = sText.replace(".", "");
			var oTerm = TermsProvider.getInstance().getTermByTermId(sText);
			var data = {
				tokenType: Constants.TERM,
				cssClass: "sapAstObjectClass"
			};
			if (oTerm && oTerm._dataObjectType) {
				data.dataObjectType = oTerm._dataObjectType
			}
			return data;
		case astLibInstance.IDPLexer.NUMERIC_LITERAL:
			return {
				tokenType: Constants.NUMBERBUSINESSDATATYPE,
				cssClass: "sapAstLiteralClass"
			};
		case astLibInstance.IDPLexer.NUMERIC_LITERAL_UNIT:
			return {
				tokenType: Constants.QUANTITYBUSINESSDATATYPE,
				cssClass: "sapAstLiteralClass"
			};
		case astLibInstance.IDPLexer.PARTIALTIME:
		case astLibInstance.IDPLexer.FULLTIME:
		case astLibInstance.IDPLexer.DATETIME:
			return {
				tokenType: Constants.TIMEBUSINESSDATATYPE,
				cssClass: "sapAstLiteralClass"
			};
		case astLibInstance.IDPLexer.BOOL:
			return {
				tokenType: Constants.BOOLEANBUSINESSDATATYPE,
				cssClass: "sapAstLiteralClass"
			};
		case astLibInstance.IDPLexer.GEOJSON_POINT:
		case astLibInstance.IDPLexer.GEOJSON_POLYGON:
			return {
				tokenType: Constants.GEOBUSINESSDATATYPE,
				cssClass: "sapAstLiteralClass"
			};

		case astLibInstance.IDPLexer.FULLDATE:
			return {
				tokenType: Constants.DATEBUSINESSDATATYPE,
				cssClass: "sapAstLiteralClass"
			};
		case astLibInstance.IDPLexer.STRING:
			return {
				tokenType: Constants.STRINGBUSINESSDATATYPE,
				cssClass: "sapAstLiteralClass"
			}
		case astLibInstance.IDPLexer.AND:
			return {
				tokenType: Constants.AND,
				cssClass: "sapAstFunctionClass"
			};
		case astLibInstance.IDPLexer.OR:
			return {
				tokenType: Constants.OR,
				cssClass: "sapAstFunctionClass"
			};
		case astLibInstance.IDPLexer.LOGICAL_NOT:
		case astLibInstance.IDPLexer.LESS_THAN:
		case astLibInstance.IDPLexer.GREATER_THAN:
		case astLibInstance.IDPLexer.LESS_THAN_EQUAL:
		case astLibInstance.IDPLexer.GREATER_THAN_EQUAL:
		case astLibInstance.IDPLexer.NOT_EQUAL:
		case astLibInstance.IDPLexer.EQUAL:
			return {
				tokenType: Constants.COMPARISION_OPERATOR,
				cssClass: "sapAstFunctionClass"
			}
		case astLibInstance.IDPLexer.MULT:
		case astLibInstance.IDPLexer.DIV:
		case astLibInstance.IDPLexer.ADD:
		case astLibInstance.IDPLexer.MINUS:
		case astLibInstance.IDPLexer.FUNCTIONAL_OPERATOR:
			return {
				tokenType: Constants.OPERATOR,
				cssClass: "sapAstFunctionClass"
			};
		case astLibInstance.IDPLexer.WS:
			return {
				tokenType: Constants.WS,
				cssClass: "sapAstAuxilaryNodeClass"
			};
		case astLibInstance.IDPLexer.LROUNDB:
			return {
				tokenType: Constants.LEFTPARENTHESIS,
				cssClass: "sapAstParenthesisClass"
			};
		case astLibInstance.IDPLexer.LSQUAREB:
			return {
				tokenType: Constants.LEFTSQUAREPARENTHESIS,
				cssClass: "sapAstParenthesisClass"
			};
		case astLibInstance.IDPLexer.RROUNDB:
			return {
				tokenType: Constants.RIGHTPARENTHESIS,
				cssClass: "sapAstParenthesisClass"
			};
		case astLibInstance.IDPLexer.RSQUAREB:
			return {
				tokenType: Constants.RIGHTSQUAREPARENTHESIS,
				cssClass: "sapAstParenthesisClass"
			};
		case astLibInstance.IDPLexer.RANGE_DOTS:
			return {
				tokenType: Constants.RANGE_DOTS,
				cssClass: "sapAstRangeClass"
			};
		case astLibInstance.IDPLexer.COMMA:
			return {
				tokenType: Constants.COMMA
			};
		case astLibInstance.IDPLexer.ADVANCED_FUNCTION_NAME:
		case astLibInstance.IDPLexer.WINDOW_FUNCTION_NAME:
		case astLibInstance.IDPLexer.FUNCTION_NAME:
		case astLibInstance.IDPLexer.OPERATION_FUNCTION_NAME:
		case astLibInstance.IDPLexer.DATE_TIME_FUNCTION_NAME:
			return {
				tokenType: Constants.FUNCTION,
				cssClass: "sapAstFunctionClass"
			};
		case astLibInstance.IDPLexer.RANGE_OPERATOR:
			return {
				tokenType: Constants.RANGE_OPERATOR,
				cssClass: "sapAstFunctionClass"
			};
		case astLibInstance.IDPLexer.ARRAY_OPERATOR:
			return {
				tokenType: Constants.ARRAY_OPERATOR,
				cssClass: "sapAstFunctionClass"
			};
		case astLibInstance.IDPLexer.PLACEHOLDER_OPERATOR:
			return {
				tokenType: Constants.PLACEHOLDER_OPERATOR,
				cssClass: "sapAstPlaceHolderOperatorClass"
			};
		case astLibInstance.IDPLexer.PLACEHOLDER_ID:
			return {
				tokenType: Constants.PLACEHOLDER_ID,
				cssClass: "sapAstPlaceHolderIdClass"
			};

			// TODO : Variable has to be identified as token and add "sapAstFunctionClass"
		default:
			return {
				tokenType: "U"
			};
		}
	};

	Token.prototype.getText = function () {
		return this.text;
	};

	Token.prototype.getTokenType = function () {
		return this.tokenType;
	};

	Token.prototype.getId = function () {
		return this.id;
	};

	Token.prototype.getReference = function () {
		return this.reference;
	};

	return Token;
});
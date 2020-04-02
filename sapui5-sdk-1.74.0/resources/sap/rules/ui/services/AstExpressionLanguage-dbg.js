/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

// Provides element sap.rules.ui.services.AstExpressionLanguage
sap.ui.define(['jquery.sap.global',
	"sap/ui/core/Element",
	"sap/rules/ui/library",
	"sap/rules/ui/ast/parser/bundlelibrary",
	"sap/rules/ui/ast/model/Token",
	"sap/rules/ui/parser/infrastructure/util/utilsBase",
	"sap/rules/ui/ast/autoComplete/AutoComplete",
	'sap/rules/ui/ast/builder/TermsBuilder',
	"sap/rules/ui/ast/provider/TermsProvider",
	'sap/rules/ui/ast/builder/OperatorBuilder',
	'sap/rules/ui/ast/builder/FunctionBuilder',
	"sap/rules/ui/ast/constants/Constants",
	"sap/ui/core/LocaleData",
	"sap/ui/core/format/DateFormat"
], function (jQuery, Element, library, astBundleLibrary, Token,
	utilsBase, AutoComplete, TermsBuilder, TermsProvider, OperatorBuilder, FunctionBuilder, Constants, LocaleData, DateFormat) {

	"use strict";
	/**
	 * Constructor for a new AstExpressionLanguage element.
	 *
	 * @class
	 * Provides the AstExpressionLanguage service functionality, such as expression validations, expression parsing, auto-complete suggestions, retrieving expression metadata and tokens, and performing runtime services (fetching data objects, outputs, etc).
	 * @extends  Element
	 *
	 * @author SAP SE
	 * @version 1.58.1
	 *
	 * @constructor
	 * @public
	 * @alias sap.rules.ui.services.AstExpressionLanguage
	 * @ui5-metamodel This element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var annotations = [];

	var AstExpressionLanguage = Element.extend("sap.rules.ui.services.AstExpressionLanguage", {
		metadata: {
			library: "sap.rule.ui",
			properties: {
				/**
				 * Path to a Vocabulary object in the model data, which is used for the definition of relative context bindings inside the Ast Expression Language control (mandatory).
				 * Example: "/Vocabularies(Id='0050569181751ED683EFEEC6AA2B73C5')"
				 */
				bindingContextPath: {
					type: "string",
					group: "Misc"
				}

			},
			publicMethods: ["setData", "getData", "getSuggesstions"],
			events: {
				"dataChange": {}
			}
		}

	});

	AstExpressionLanguage.prototype.init = function () {
		this._astBunldeInstance = astBundleLibrary.getInstance();
		this._idpCustomVisitor = new this._astBunldeInstance.IDPCustomVisitor();
		this._antlr4 = this._astBunldeInstance.antlr4;
		this._astUtil = this._astBunldeInstance.ASTUtil;
		this._termsBuilder = this._astBunldeInstance.TermsBuilder;
		this._termsProvider = this._astBunldeInstance.TermsProvider;
		this._infraUtils = new sap.rules.ui.parser.infrastructure.util.utilsBase.lib.utilsBaseLib();
		this._autoComplete = new AutoComplete();
		this.attachModelContextChange(this._setDataFromModel.bind(this));
		this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
	};

	/*
	 * @private
	 * @return
	 */
	AstExpressionLanguage.prototype._isDataExist = function () {
		if (!this._oData) {
			return false;
		}
		return true;
	};

	AstExpressionLanguage.prototype.getExpressionLanguageVersion = function () {
		return "2.0.0";
	};

	/**
	 * Returns all results names in the vocabulary
	 * 
	 * @private
	 * @return {Array} [oResultsNames]
	 */
	AstExpressionLanguage.prototype.getResults = function () {
		if (!this._isDataExist()) {
			return null;
		}
		var results = [];
		var outputs = this._oData.DataObjects;
		for (var dataObj = 0; dataObj < outputs.length; dataObj++) {
			var label = outputs[dataObj].Label ? outputs[dataObj].Label : outputs[dataObj].Name;
			results.push({
				id: outputs[dataObj].Id,
				name: outputs[dataObj].Name,
				label: label,
				description: outputs[dataObj].Description
			});
		}
		return results;
	};

	/**
	 * Returns the information of a given result
	 * @param {string}   [sResult] the result
	 * @private
	 * @return {object}  [oResultInfo] ....
	 **/
	AstExpressionLanguage.prototype.getResultInfo = function (sResult) {
		if (!this._isDataExist()) {
			return null;
		}
		var oResultInfo = {
			requiredParams: []
		};
		var oDataObjects = this._oData.DataObjects;
		for (var object in oDataObjects) {
			if (oDataObjects[object].Name === sResult) {
				var oAttributes = oDataObjects[object].Attributes;
				for (var attribute in oAttributes) {
					oResultInfo.requiredParams.push({
						name: oAttributes[attribute].Name,
						paramId: oAttributes[attribute].Id,
						businessDataType: oAttributes[attribute].BusinessDataType
					});
				}
			}
		}
		return oResultInfo;
	};

	AstExpressionLanguage.prototype._setDataFromModel = function () {
		if (this.hasModel() && this.getBindingContextPath()) {
			this.getModel().read(this.getBindingContextPath(), {
				urlParameters: {
					"$expand": "DataObjects/Associations,DataObjects/Attributes,ValueSources,Rules"
				},
				success: this.setData.bind(this)
			});
		}
		// TODO : handle error cases
	};

	AstExpressionLanguage.prototype.setData = function (oData) {
		this._oData = this._CopyAndRemoveOdataTags(oData);
		TermsBuilder.getInstance().construct(this._oData);
		this._astBunldeInstance.TermsBuilder.TermsBuilder.construct(this._oData);
		var operatorAndFunctionsData = this._getOpertorAndFunctionsMetdata();
		OperatorBuilder.getInstance().construct(operatorAndFunctionsData.operators);
		FunctionBuilder.getInstance().construct(operatorAndFunctionsData.functions);
		this.fireDataChange({
			data: oData
		});
	};

	AstExpressionLanguage.prototype.getData = function () {
		return this._oData;
	};

	AstExpressionLanguage.prototype._removeOdataTags = function (obj) {
		for (var prop in obj) {
			if (obj[prop] && typeof obj[prop] === 'object') {
				if (Array.isArray(obj[prop].results)) {
					obj[prop] = obj[prop].results;
				}
				this._removeOdataTags(obj[prop]);
			}
		}
	};

	AstExpressionLanguage.prototype._CopyAndRemoveOdataTags = function (data) {
		var convertedData = {};
		if (data) {
			convertedData = JSON.parse(JSON.stringify(data));
			this._removeOdataTags(convertedData);
		}
		return convertedData;
	};

	AstExpressionLanguage.prototype._getOpertorAndFunctionsMetdata = function () {
		return {
			"operators": [{
				"name": "+",
				"label": this.oBundle.getText("add"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "N",
						"S": "S"
					},
					"A": {
						"A": "A",
						"S": "S"
					},
					"S": {
						"S": "S",
						"N": "S",
						"D": "S",
						"T": "S",
						"U": "S",
						"Q": "S",
						"A": "S"
					},
					"T": {
						"S": "S",
						"Q": "T"
					},
					"U": {
						"S": "S",
						"Q": "U"
					},
					"D": {
						"S": "S",
						"Q": "D"
					},
					"Q": {
						"Q": "Q",
						"S": "S",
						"D": "D",
						"T": "T",
						"U": "U"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "arithmetic"
			}, {
				"name": "-",
				"label": this.oBundle.getText("subtract"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "N"
					},
					"Q": {
						"Q": "Q"
					},
					"A": {
						"A": "A"
					},
					"D": {
						"S": "S",
						"Q": "D",
						"D": "Q",
						"U": "Q",
						"T": "Q"
					},
					"U": {
						"S": "S",
						"Q": "U",
						"U": "Q",
						"D": "Q",
						"T": "Q"
					},
					"T": {
						"S": "S",
						"Q": "T",
						"T": "Q",
						"D": "Q",
						"U": "Q"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "arithmetic"
			}, {
				"name": "/",
				"label": this.oBundle.getText("divide"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "N"
					},
					"Q": {
						"N": "Q"
					},
					"A": {
						"N": "A"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "arithmetic"
			}, {
				"name": "*",
				"label": this.oBundle.getText("multiply"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "N",
						"A": "A",
						"Q": "Q"
					},
					"Q": {
						"N": "Q"
					},
					"A": {
						"N": "A"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "arithmetic"
			}, {
				"name": "=",
				"label": this.oBundle.getText("is_equal"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "B"
					},
					"B": {
						"B": "B"
					},
					"D": {
						"D": "B",
						"T": "B",
						"U": "B"
					},
					"T": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"U": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					},
					"G": {
						"G": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "comparison"
			}, {
				"name": "!=",
				"label": this.oBundle.getText("is_not_equal"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "B"
					},
					"B": {
						"B": "B"
					},
					"D": {
						"D": "B",
						"T": "B",
						"U": "B"
					},
					"T": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"U": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					},
					"G": {
						"G": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "comparison"
			}, {
				"name": ">",
				"label": this.oBundle.getText("is_greater_than"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "B"
					},
					"D": {
						"D": "B",
						"T": "B",
						"U": "B"
					},
					"T": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"U": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "comparison"
			}, {
				"name": ">=",
				"label": this.oBundle.getText("is_equal_or_greater_than"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "B"
					},
					"D": {
						"D": "B",
						"T": "B",
						"U": "B"
					},
					"T": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"U": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "comparison"
			}, {
				"name": "<",
				"label": this.oBundle.getText("is_less_than"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "B"
					},
					"D": {
						"D": "B",
						"T": "B",
						"U": "B"
					},
					"T": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"U": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "comparison"
			}, {
				"name": "<=",
				"label": this.oBundle.getText("is_equal_or_less_than"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "B"
					},
					"D": {
						"D": "B",
						"T": "B",
						"U": "B"
					},
					"T": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"U": {
						"T": "B",
						"U": "B",
						"D": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "comparison"
			}, {
				"name": "IN",
				"label": this.oBundle.getText("in"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "B"
					},
					"B": {
						"B": "B"
					},
					"D": {
						"D": "B"
					},
					"T": {
						"T": "B",
						"U": "B"
					},
					"U": {
						"T": "B",
						"U": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					},
					"G": {
						"G": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "range"
			}, {
				"name": "NOTIN",
				"label": this.oBundle.getText("not_in"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "B"
					},
					"B": {
						"B": "B"
					},
					"D": {
						"D": "B"
					},
					"T": {
						"T": "B",
						"U": "B"
					},
					"U": {
						"T": "B",
						"U": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					},
					"G": {
						"G": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "range"
			}, {
				"name": "EXISTSIN",
				"label": this.oBundle.getText("exists_in"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "B"
					},
					"B": {
						"B": "B"
					},
					"D": {
						"D": "B"
					},
					"T": {
						"T": "B",
						"U": "B"
					},
					"U": {
						"T": "B",
						"U": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E",
						"T": "E"
					}
				},
				"category": "array",
				"supportedFunctions": [{
					"name": "SELECT",
					"dataObjectTypeList": ["E"],
					"businessDataType": "B"
				}]
			}, {
				"name": "NOTEXISTSIN",
				"label": this.oBundle.getText("does_not_exists_in"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"N": {
						"N": "B"
					},
					"B": {
						"B": "B"
					},
					"D": {
						"D": "B"
					},
					"T": {
						"T": "B",
						"U": "B"
					},
					"U": {
						"T": "B",
						"U": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "array",
				"supportedFunctions": [{
					"name": "SELECT",
					"dataObjectTypeList": ["E"],
					"businessDataType": "B"
				}]
			}, {
				"name": "MATCHES",
				"label": this.oBundle.getText("matches"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"S": {
						"S": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "functional"
			}, {
				"name": "NOTMATCHES",
				"label": this.oBundle.getText("does_not_matches"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"S": {
						"S": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "functional"
			}, {
				"name": "CONTAINS",
				"label": this.oBundle.getText("contains_string"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"S": {
						"S": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "functional"
			}, {
				"name": "NOTCONTAINS",
				"label": this.oBundle.getText("does_not_contains_string"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"S": {
						"S": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "functional"
			}, {
				"name": "STARTSWITH",
				"label": this.oBundle.getText("starts_with"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"S": {
						"S": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "functional"
			}, {
				"name": "NOTSTARTSWITH",
				"label": this.oBundle.getText("does_not_starts_with"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"S": {
						"S": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "functional"
			}, {
				"name": "ENDSWITH",
				"label": this.oBundle.getText("ends_with"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"S": {
						"S": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "functional"
			}, {
				"name": "NOTENDSWITH",
				"label": this.oBundle.getText("does_not_ends_with"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"S": {
						"S": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "functional"
			}, {
				"name": "NOT",
				"label": this.oBundle.getText("not"),
				"noOfArgs": 1,
				"returnValueBusinessDataTypeCollection": {
					"D": {
						"D": "B"
					},
					"T": {
						"T": "B"
					},
					"U": {
						"T": "B"
					},
					"N": {
						"N": "B"
					},
					"B": {
						"B": "B"
					},
					"S": {
						"S": "B"
					},
					"Q": {
						"Q": "B"
					},
					"A": {
						"A": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "logical"
			}, {
				"name": "AND",
				"label": this.oBundle.getText("and"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"B": {
						"B": "B"
					},
					"D": {
						"Q": "B"
					},
					"T": {
						"Q": "B"
					},
					"U": {
						"Q": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "logical"
			}, {
				"name": "OR",
				"label": this.oBundle.getText("or"),
				"noOfArgs": 2,
				"returnValueBusinessDataTypeCollection": {
					"B": {
						"B": "B"
					},
					"D": {
						"Q": "B"
					},
					"T": {
						"Q": "B"
					},
					"U": {
						"Q": "B"
					}
				},
				"returnValueDataObjectTypeCollection": {
					"E": {
						"E": "E"
					}
				},
				"category": "logical"
			}],
			"functions": [{
				"name": "AVG",
				"label": this.oBundle.getText("average"),
				"category": "aggregate",
				"noOfArgs": "*",
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T"]
				}, {
					"sequence": 2,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": [
						"Q",
						"N",
						"A"
					],
					"determinesReturnDataObjectType": "Y"
				}],
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": [
					"E",
					"T"
				]
			}, {
				"name": "SUM",
				"label": this.oBundle.getText("sum"),
				"category": "aggregate",
				"noOfArgs": "*",
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T"]
				}, {
					"sequence": 2,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": [
						"Q",
						"N",
						"A"
					],
					"determinesReturnDataObjectType": "Y"
				}],
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N", "Q", "A"],
				"probableDataObjectTypeList": [
					"E",
					"T"
				]
			}, {
				"name": "COUNT",
				"label": this.oBundle.getText("count"),
				"category": "aggregate",
				"noOfArgs": "*",
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T"],
					"determinesReturnDataObjectType": "Y"

				}],
				"noOfMandatoryArgs": "1",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": [
					"E",
					"T"
				],
				"defaultDataObjectReturnType": "E",
				"defaultBusinessDataReturnType": "N"

			}, {
				"name": "COUNTDISTINCT",
				"label": this.oBundle.getText("count_distinct"),
				"category": "aggregate",
				"noOfArgs": "2",
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T"]
				}, {
					"sequence": 2,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": [
						"N"
					],
					"determinesReturnDataObjectType": "Y"
				}],
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": [
					"E"
				]
			}, {
				"name": "DISTINCT",
				"label": this.oBundle.getText("distinct"),
				"category": "aggregate",
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"]
				}, {
					"sequence": 2,
					"dataObjectTypeList": ["E"]
				}],
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": [
					"T"
				]
			}, {
				"name": "MIN",
				"label": this.oBundle.getText("minimum"),
				"category": "aggregate",
				"noOfArgs": "*",
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"]
				}, {
					"sequence": 2,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": [
						"N",
						"A",
						"Q",
						"D",
						"T",
						"U",
						"S"
					],
					"determinesReturnDataObjectType": "Y"
				}],
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N", "A", "Q", "D", "T", "U", "S"],
				"probableDataObjectTypeList": [
					"E",
					"T"
				]
			}, {
				"name": "MAX",
				"label": this.oBundle.getText("maximum"),
				"category": "aggregate",
				"noOfArgs": "*",
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"]
				}, {
					"sequence": 2,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": [
						"N",
						"A",
						"Q",
						"D",
						"T",
						"U",
						"S"
					],
					"determinesReturnDataObjectType": "Y"
				}],
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N", "A", "Q", "D", "T", "U", "S"],
				"probableDataObjectTypeList": [
					"E",
					"T"
				]
			}, {
				"name": "ISWITHIN",
				"label": this.oBundle.getText("is_with_in"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["G"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"G": {
							"G": "B"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "advanced",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["B"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ISNOTWITHIN",
				"label": this.oBundle.getText("is_not_with_in"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["G"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"G": {
							"G": "B"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"noOfMandatoryArgs": "2",
				"category": "advanced",
				"probableBusinessDataTypeList": ["B"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "FILTER",
				"label": this.oBundle.getText("where_label"),
				"category": "aggregate",
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T"]
				}],
				"noOfMandatoryArgs": "1",
				"probableBusinessDataTypeList": [],
				"probableDataObjectTypeList": [
					"T"
				]
			}, {
				"name": "TOP",
				"label": this.oBundle.getText("top"),
				"category": "selection",
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T"]
				}, {
					"sequence": 2,
					"dataObjectTypeList": ["E"]
				}],
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": [],
				"probableDataObjectTypeList": [
					"T"
				]
			}, {
				"name": "BOTTOM",
				"label": this.oBundle.getText("bottom"),
				"category": "selection",
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T"]
				}, {
					"sequence": 2,
					"dataObjectTypeList": ["E"]
				}],
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": [],
				"probableDataObjectTypeList": [
					"T"
				]
			}, {
				"name": "SELECT",
				"label": this.oBundle.getText("select"),
				"category": "selection",
				"noOfArgs": "*",
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T"]
				}],
				"noOfMandatoryArgs": "1",
				"probableBusinessDataTypeList": [],
				"probableDataObjectTypeList": [
					"T"
				]
			},{
                "name": "FIRST",
                "label": this.oBundle.getText("first"),
                "category": "selection",
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["T"]
                }],
                "noOfMandatoryArgs": "1",
                "probableBusinessDataTypeList": [],
                "probableDataObjectTypeList": ["T"]
            }, {
				"name": "SORTASC",
				"label": this.oBundle.getText("sort_ascending_label"),
				"category": "selection",
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T"]
				}, {
					"sequence": 2,
					"dataObjectTypeList": ["E"]
				}],
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": [],
				"probableDataObjectTypeList": [
					"T"
				]
			}, {
				"name": "SORTDESC",
				"label": this.oBundle.getText("sort_descending_label"),
				"category": "selection",
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T"]
				}, {
					"sequence": 2,
					"dataObjectTypeList": ["E"]
				}],
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": [],
				"probableDataObjectTypeList": [
					"T"
				]
			}, {
				"name": "ISINNEXT",
				"label": this.oBundle.getText("is_in_next"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "T", "U"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"Q": "B"
						},
						"T": {
							"Q": "B"
						},
						"U": {
							"Q": "B"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"noOfMandatoryArgs": "2",
				"category": "time_duration",
				"probableBusinessDataTypeList": ["B"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ISNOTINNEXT",
				"label": this.oBundle.getText("is_not_in_next"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "T", "U"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"Q": "B"
						},
						"T": {
							"Q": "B"
						},
						"U": {
							"Q": "B"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"noOfMandatoryArgs": "2",
				"category": "time_duration",
				"probableBusinessDataTypeList": ["B"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ISINLAST",
				"label": this.oBundle.getText("is_in_last"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "T", "U"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"Q": "B"
						},
						"T": {
							"Q": "B"
						},
						"U": {
							"Q": "B"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"noOfMandatoryArgs": "2",
				"category": "time_duration",
				"probableBusinessDataTypeList": ["B"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ISNOTINLAST",
				"label": this.oBundle.getText("is_not_in_last"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "T", "U"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"Q": "B"
						},
						"T": {
							"Q": "B"
						},
						"U": {
							"Q": "B"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"noOfMandatoryArgs": "2",
				"category": "time_duration",
				"probableBusinessDataTypeList": ["B"],
				"probableDataObjectTypeList": ["E"]
			}, {
                "name": "CONCAT",
                "label": this.oBundle.getText("concatenate"),
                "noOfArgs": "*" ,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["N", "A", "Q", "D", "T", "U", "S", "B", "G"]
                }, {
                    "sequence": 2,
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "S": {
                            "S": "S",
                            "N": "S",
                            "A": "S",
                            "Q": "S",
                            "D": "S",
                            "T": "S",
                            "U": "S",
                            "B": "S",
                            "G": "S"
                        },
                        "N": {
                            "S": "S",
                            "N": "S",
                            "A": "S",
                            "Q": "S",
                            "D": "S",
                            "T": "S",
                            "U": "S",
                            "B": "S",
                            "G": "S"
                        },
                        "A": {
                            "S": "S",
                            "N": "S",
                            "A": "S",
                            "Q": "S",
                            "D": "S",
                            "T": "S",
                            "U": "S",
                            "B": "S",
                            "G": "S"
                        },
                        "Q": {
                            "S": "S",
                            "N": "S",
                            "A": "S",
                            "Q": "S",
                            "D": "S",
                            "T": "S",
                            "U": "S",
                            "B": "S",
                            "G": "S"
                        },
                        "D": {
                            "S": "S",
                            "N": "S",
                            "A": "S",
                            "Q": "S",
                            "D": "S",
                            "T": "S",
                            "U": "S",
                            "B": "S",
                            "G": "S"
                        },
                        "T": {
                            "S": "S",
                            "N": "S",
                            "A": "S",
                            "Q": "S",
                            "D": "S",
                            "T": "S",
                            "U": "S",
                            "B": "S",
                            "G": "S"
                        },
                        "U": {
                            "S": "S",
                            "N": "S",
                            "A": "S",
                            "Q": "S",
                            "D": "S",
                            "T": "S",
                            "U": "S",
                            "B": "S",
                            "G": "S"
                        },
                        "B": {
                            "S": "S",
                            "N": "S",
                            "A": "S",
                            "Q": "S",
                            "D": "S",
                            "T": "S",
                            "U": "S",
                            "B": "S",
                            "G": "S"
                        },
                        "G": {
                            "S": "S",
                            "N": "S",
                            "A": "S",
                            "Q": "S",
                            "D": "S",
                            "T": "S",
                            "U": "S",
                            "B": "S",
                            "G": "S"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }

                }],
                "noOfMandatoryArgs": "2",
                "category": "advanced",
                "probableBusinessDataTypeList": ["S"],
                "probableDataObjectTypeList": ["E"]
            }, {
				"name": "ROUND",
				"label": this.oBundle.getText("round"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["S"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"N": {
							"N": "N"
						},
						"Q": {
							"N": "Q"
						},
						"A": {
							"N": "A"
						},
						"S": {
							"S": "S"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"noOfMandatoryArgs": "2",
				"category": "advanced",
				"probableBusinessDataTypeList": ["Q", "N", "A", "S"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "POWER",
				"label": this.oBundle.getText("power"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["N"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"N": {
							"N": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"noOfMandatoryArgs": "2",
				"category": "advanced",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "SIN",
				"label": this.oBundle.getText("sin"),
				"noOfArgs": 1,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["S"],
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"N": {
							"N": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"noOfMandatoryArgs": "1",
				"category": "advanced",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "COS",
				"label": this.oBundle.getText("cos"),
				"noOfArgs": 1,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["S"],
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"N": {
							"N": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"noOfMandatoryArgs": "1",
				"category": "advanced",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			},{
                "name": "ISNULL",
                "label": this.oBundle.getText("is_null"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["N","A","Q","D","T","U","S","B","G"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "N": {
                            "N": "B"
                        },
                        "S": {
                            "S": "B"
                        },
                        "A": {
                            "A": "B"
                        },
                        "Q": {
                            "Q": "B"
                        },
                        "D": {
                            "D": "B"
                        },
                        "T": {
                            "T": "B"
                        },
                        "U": {
                            "U": "B"
                        },
                        "B": {
                            "B": "B"
                        },
                        "G": {
                            "G": "B"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }

                }],
                "noOfMandatoryArgs": "1",
                "category": "advanced",
                "probableBusinessDataTypeList": ["B"],
                "probableDataObjectTypeList": ["E"]
            },{
                "name": "ISNOTNULL",
                "label": this.oBundle.getText("is_not_null"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["N","A","Q","D","T","U","S","B","G"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "N": {
                            "N": "B"
                        },
                        "S": {
                            "S": "B"
                        },
                        "A": {
                            "A": "B"
                        },
                        "Q": {
                            "Q": "B"
                        },
                        "D": {
                            "D": "B"
                        },
                        "T": {
                            "T": "B"
                        },
                        "U": {
                            "U": "B"
                        },
                        "B": {
                            "B": "B"
                        },
                        "G": {
                            "G": "B"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }

                }],
                "noOfMandatoryArgs": "1",
                "category": "advanced",
                "probableBusinessDataTypeList": ["B"],
                "probableDataObjectTypeList": ["E"]
            },{
                "name": "ISINITIAL",
                "label": this.oBundle.getText("is_initial"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["N","A","Q","D","T","U","S","B","G"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "N": {
                            "N": "B"
                        },
                        "S": {
                            "S": "B"
                        },
                        "A": {
                            "A": "B"
                        },
                        "Q": {
                            "Q": "B"
                        },
                        "D": {
                            "D": "B"
                        },
                        "T": {
                            "T": "B"
                        },
                        "U": {
                            "U": "B"
                        },
                        "B": {
                            "B": "B"
                        },
                        "G": {
                            "G": "B"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }

                }],
                "noOfMandatoryArgs": "1",
                "category": "advanced",
                "probableBusinessDataTypeList": ["B"],
                "probableDataObjectTypeList": ["E"]
            },{
                "name": "ISNOTINITIAL",
                "label": this.oBundle.getText("is_not_initial"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["N","A","Q","D","T","U","S","B","G"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "N": {
                            "N": "B"
                        },
                        "S": {
                            "S": "B"
                        },
                        "A": {
                            "A": "B"
                        },
                        "Q": {
                            "Q": "B"
                        },
                        "D": {
                            "D": "B"
                        },
                        "T": {
                            "T": "B"
                        },
                        "U": {
                            "U": "B"
                        },
                        "B": {
                            "B": "B"
                        },
                        "G": {
                            "G": "B"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }

                }],
                "noOfMandatoryArgs": "1",
                "category": "advanced",
                "probableBusinessDataTypeList": ["B"],
                "probableDataObjectTypeList": ["E"]
            },{
				"name": "TODAY",
				"label": this.oBundle.getText("today"),
				"noOfArgs": 0,
				"defaultBusinessDataReturnType": "D",
				"defaultDataObjectReturnType": "E",
				"noOfMandatoryArgs": "0",
				"category": "time_duration",
				"probableBusinessDataTypeList": ["D"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "YESTERDAY",
				"label": this.oBundle.getText("yesterday"),
				"noOfArgs": 0,
				"defaultBusinessDataReturnType": "D",
				"defaultDataObjectReturnType": "E",
				"noOfMandatoryArgs": "0",
				"category": "time_duration",
				"probableBusinessDataTypeList": ["D"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "TOMORROW",
				"label": this.oBundle.getText("tomorrow"),
				"noOfArgs": 0,
				"noOfMandatoryArgs": "0",
				"defaultBusinessDataReturnType": "D",
				"defaultDataObjectReturnType": "E",
				"category": "time_duration",
				"probableBusinessDataTypeList": ["D"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "UPDATE",
				"label": this.oBundle.getText("UPDATELABEL"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T", "E"],
					"businessDataTypeList": ["S", "N", "T", "U", "B", "Q", "G", "D"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"S": {
							"S": {}
						},
						"N": {
							"N": {}
						},
						"T": {
							"T": {}
						},
						"U": {
							"U": {}
						},
						"D": {
							"D": {}
						},
						"B": {
							"B": {}
						},
						"G": {
							"G": {}
						}
					},
					"referenceDataObjectTypeCollection": {
						"T": {
							"T": {}
						},
						"E": {
							"E": {}
						}
					}

				}],
				"probableBusinessDataTypeList": [],
				"probableDataObjectTypeList": [],
				"context": "result",
				"noOfMandatoryArgs": "2",
				"category": "operations"
			}, {
				"name": "APPEND",
				"label": this.oBundle.getText("APPENDLABEL"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["T", "E"],
					"businessDataTypeList": ["S", "N", "T", "U", "B", "Q", "G", "D"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"S": {
							"S": {}
						},
						"N": {
							"N": {}
						},
						"T": {
							"T": {}
						},
						"U": {
							"U": {}
						},
						"D": {
							"D": {}
						},
						"B": {
							"B": {}
						},
						"G": {
							"G": {}
						}
					},
					"referenceDataObjectTypeCollection": {
						"T": {
							"T": {}
						}
					}

				}],
				"probableBusinessDataTypeList": [],
				"probableDataObjectTypeList": [],
				"context": "result",
				"noOfMandatoryArgs": "2",
				"category": "operations"
			}, {
				"name": "ADDSECONDS",
				"label": this.oBundle.getText("add_seconds"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ADDMINUTES",
				"label": this.oBundle.getText("add_minutes"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ADDHOURS",
				"label": this.oBundle.getText("add_hours"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ADDDAYS",
				"label": this.oBundle.getText("add_days"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ADDWEEKS",
				"label": this.oBundle.getText("add_weeks"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ADDMONTHS",
				"label": this.oBundle.getText("add_months"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ADDQUARTERS",
				"label": this.oBundle.getText("add_quarters"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "ADDYEARS",
				"label": this.oBundle.getText("add_years"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "SUBTRACTSECONDS",
				"label": this.oBundle.getText("subtract_seconds"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "SUBTRACTMINUTES",
				"label": this.oBundle.getText("subtract_minutes"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "SUBTRACTHOURS",
				"label": this.oBundle.getText("subtract_hours"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "SUBTRACTDAYS",
				"label": this.oBundle.getText("subtract_days"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "SUBTRACTWEEKS",
				"label": this.oBundle.getText("subtract_weeks"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "SUBTRACTMONTHS",
				"label": this.oBundle.getText("subtract_months"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "SUBTRACTQUARTERS",
				"label": this.oBundle.getText("subtract_quarters"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "SUBTRACTYEARS",
				"label": this.oBundle.getText("subtract_years"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"N": "D"
						},
						"U": {
							"N": "U"
						},
						"T": {
							"N": "T"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["D", "U", "T"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "SECONDSBETWEEN",
				"label": this.oBundle.getText("seconds_between"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"D": "N"
						},
						"T": {
							"T": "N"
						},
						"U": {
							"U": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "MINUTESBETWEEN",
				"label": this.oBundle.getText("minutes_between"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"D": "N"
						},
						"T": {
							"T": "N"
						},
						"U": {
							"U": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "HOURSBETWEEN",
				"label": this.oBundle.getText("hours_between"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"D": "N"
						},
						"T": {
							"T": "N"
						},
						"U": {
							"U": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "DAYSBETWEEN",
				"label": this.oBundle.getText("days_between"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"D": "N"
						},
						"T": {
							"T": "N"
						},
						"U": {
							"U": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "WEEKSBETWEEN",
				"label": this.oBundle.getText("weeks_between"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"D": "N"
						},
						"T": {
							"T": "N"
						},
						"U": {
							"U": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "MONTHSBETWEEN",
				"label": this.oBundle.getText("months_between"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"D": "N"
						},
						"T": {
							"T": "N"
						},
						"U": {
							"U": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "QUARTERSBETWEEN",
				"label": this.oBundle.getText("quarters_between"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"D": "N"
						},
						"T": {
							"T": "N"
						},
						"U": {
							"U": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			}, {
				"name": "YEARSBETWEEN",
				"label": this.oBundle.getText("years_between"),
				"noOfArgs": 2,
				"argsMetadata": [{
					"sequence": 1,
					"dataObjectTypeList": ["E"],
					"businessDataTypeList": ["D", "U", "T"]
				}, {
					"sequence": 2,
					"referenceIndex": 1,
					"referenceBusinessDataTypeCollection": {
						"D": {
							"D": "N"
						},
						"T": {
							"T": "N"
						},
						"U": {
							"U": "N"
						}
					},
					"referenceDataObjectTypeCollection": {
						"E": {
							"E": "E"
						}
					}

				}],
				"category": "time_duration",
				"noOfMandatoryArgs": "2",
				"probableBusinessDataTypeList": ["N"],
				"probableDataObjectTypeList": ["E"]
			}, {
                "name": "SECOND",
                "label": this.oBundle.getText("second"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["U", "T"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "T": {
                            "T": "N"
                        },
                        "U": {
                            "U": "N"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }
                }],
                "category": "time_duration",
                "noOfMandatoryArgs": "1",
                "probableBusinessDataTypeList": ["N"],
                "probableDataObjectTypeList": ["E"]
            }, {
                "name": "MINUTE",
                "label": this.oBundle.getText("minute"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["U", "T"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "T": {
                            "T": "N"
                        },
                        "U": {
                            "U": "N"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }
                }],
                "category": "time_duration",
                "noOfMandatoryArgs": "1",
                "probableBusinessDataTypeList": ["N"],
                "probableDataObjectTypeList": ["E"]
            }, {
                "name": "HOUR",
                "label": this.oBundle.getText("hour"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["U", "T"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "T": {
                            "T": "N"
                        },
                        "U": {
                            "U": "N"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }
                }],
                "category": "time_duration",
                "noOfMandatoryArgs": "1",
                "probableBusinessDataTypeList": ["N"],
                "probableDataObjectTypeList": ["E"]
            }, {
                "name": "DAYOFWEEK",
                "label": this.oBundle.getText("day_of_week"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["D", "U", "T"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "D": {
                            "D": "N"
                        },
                        "T": {
                            "T": "N"
                        },
                        "U": {
                            "U": "N"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }
                }],
                "category": "time_duration",
                "noOfMandatoryArgs": "1",
                "probableBusinessDataTypeList": ["N"],
                "probableDataObjectTypeList": ["E"]
            }, {
                "name": "DAYOFMONTH",
                "label": this.oBundle.getText("day_Of_month"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["D", "U", "T"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "D": {
                            "D": "N"
                        },
                        "T": {
                            "T": "N"
                        },
                        "U": {
                            "U": "N"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }
                }],
                "category": "time_duration",
                "noOfMandatoryArgs": "1",
                "probableBusinessDataTypeList": ["N"],
                "probableDataObjectTypeList": ["E"]
            }, {
                "name": "DAYOFYEAR",
                "label": this.oBundle.getText("day_Of_year"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["D", "U", "T"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "D": {
                            "D": "N"
                        },
                        "T": {
                            "T": "N"
                        },
                        "U": {
                            "U": "N"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }
                }],
                "category": "time_duration",
                "noOfMandatoryArgs": "1",
                "probableBusinessDataTypeList": ["N"],
                "probableDataObjectTypeList": ["E"]
            }, {
                "name": "MONTH",
                "label": this.oBundle.getText("month"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["D", "U", "T"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "D": {
                            "D": "N"
                        },
                        "T": {
                            "T": "N"
                        },
                        "U": {
                            "U": "N"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }
                }],
                "category": "time_duration",
                "noOfMandatoryArgs": "1",
                "probableBusinessDataTypeList": ["N"],
                "probableDataObjectTypeList": ["E"]
            }, {
                "name": "YEAR",
                "label": this.oBundle.getText("year"),
                "noOfArgs": 1,
                "argsMetadata": [{
                    "sequence": 1,
                    "dataObjectTypeList": ["E"],
                    "businessDataTypeList": ["D", "U", "T"],
                    "referenceIndex": 1,
                    "referenceBusinessDataTypeCollection": {
                        "D": {
                            "D": "N"
                        },
                        "T": {
                            "T": "N"
                        },
                        "U": {
                            "U": "N"
                        }
                    },
                    "referenceDataObjectTypeCollection": {
                        "E": {
                            "E": "E"
                        }
                    }
                }],
                "category": "time_duration",
                "noOfMandatoryArgs": "1",
                "probableBusinessDataTypeList": ["N"],
                "probableDataObjectTypeList": ["E"]
            }]
		};
	};

	AstExpressionLanguage.prototype.getTokensForGivenStringInput = function (inputString, ruleType) {
		var parser = this._getParser(inputString);
		// TODO : based on ruleType call parser rule
		try {
			var tree = parser.rules();
			if (annotations.length === 0) {
				this._idpCustomVisitor.visitRules(tree);
			} else {
				this._idpCustomVisitor.createErrorNode(annotations[0].expr);
				annotations.length = 0;
			}
		} catch (e) {
			console.log(e);
		}
		return parser._input.tokens;
	};

	AstExpressionLanguage.prototype.getAstNodesString = function (inputString, ruleType) {
		var parser = this._getParser(inputString);
		this._astUtil.clearNodes();
		// TODO : based on ruleType call parser rule
		try {
			var tree = parser.rules();
			if (annotations.length === 0) {
				this._idpCustomVisitor.visitRules(tree);
			} else {
				this._idpCustomVisitor.createErrorNode(annotations[0].expr);
				annotations.length = 0;
			}

		} catch (e) {
			console.log(e);
		}
		return this._astUtil.toASTObject();
	};

	AstExpressionLanguage.prototype._getLocaleData = function () {
		var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
		return LocaleData.getInstance(oLocale);
	};

	AstExpressionLanguage.prototype._getDateFormatter = function () {
		var oLocaleData = this._getLocaleData();
		var datePattern = oLocaleData.getDatePattern('medium');
		var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: datePattern
		});
		return dateFormatter;
	};

	AstExpressionLanguage.prototype._getDateTimeFormatter = function () {
		var oLocaleData = this._getLocaleData();
		var datePattern = oLocaleData.getDatePattern('medium');
		var timePattern = oLocaleData.getTimePattern('medium');
		var dateTimeFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern: datePattern + " " + timePattern
		});
		return dateTimeFormatter;
	};

	AstExpressionLanguage.prototype.getRelStringForGivenAstString = function (astNodes) {
		var relString = this._astUtil.toRELString(astNodes);
		this._astUtil.clearNodes();
		return relString;

	};

	AstExpressionLanguage.prototype.convertTokensToUiModel = function (tokensStream, jsonData, shortString) {
		var tokensModel = [];
		var top = -1;
		var stack = [];
		var startPosition = 0;
		var stopPosition = 0;
		var isFunction = false;
		var tokenType;
		var tokenText = "";
		var val = 0;
		var startPositionSet = false;
		var aFunction = [Constants.AVG, Constants.SUM, Constants.COUNT, Constants.COUNTDISTINCT, Constants.DISTINCT,
			Constants.MIN, Constants.MAX, Constants.FILTER, Constants.TOP, Constants.BOTTOM, Constants.SELECT, Constants.FIRST, Constants.SORTASC, Constants.SORTDESC
		];

		for (var index = 0; index < tokensStream.length; index++) {
			var token = tokensStream[index];
			if (this.includes(aFunction, token.text.toUpperCase())) {
				isFunction = true;
			}
			if (token.text === '(' && index > 0 && this.includes(aFunction, tokensStream[index - 1].text.toUpperCase()) && !startPositionSet) {
				startPosition = index - 1;
				startPositionSet = true;
				tokenType = tokensStream[index - 1].type;
			}

			//Stack logic to get the start and Stop position of the Aggregate function and make it as one token.
			if (isFunction && jsonData && jsonData[val]) {
				if (this.includes(aFunction, token.text.toUpperCase()) || ((token.text === '(' || token.text === '[') && index > 0)) {
					stack.push(token.text)
					top++;
					continue;
				}
				if ((token.text === ')' || token.text === ']') && this.includes(aFunction, stack[top - 1].toUpperCase())) {
					stack.pop();
					stack.pop();
					top -= 2;
				} else if (token.text === ')' || token.text === ']') {
					stack.pop();
					top -= 1;
				}
				if (top == -1) {
					stopPosition = index;
					token.type = tokenType;
					for (var i = startPosition; i <= stopPosition; i++) {
						tokenText += tokensStream[i].text;
					}
					jsonData[val]["expandedText"] = tokenText;
					token.text = jsonData[val].functionLabel;
					var newtoken = new Token(token.type, token.text, token.start, token.stop, this._createUUID(), token.reference, token.json);
					if (newtoken.tokenType === "ID") {
						newtoken.reference = newtoken.text;
					}
					newtoken.json = jsonData[val];
					val++;
					tokensModel.push(newtoken);
					isFunction = false;
					startPosition = 0;
					stopPosition = 0;
					tokenType = 0;
					tokenText = "";
					startPositionSet = false;
				}
			} else {
				if (token.type === this._astBunldeInstance.IDPLexer.EOF)
					continue;
				var newtoken = new Token(token.type, token.text, token.start, token.stop, this._createUUID(), token.reference);
				if (newtoken.tokenType === "ID") {
					newtoken.reference = newtoken.text;
				}
				if (newtoken.tokenType === "D") {
					newtoken.reference = newtoken.text;
					newtoken.text = "'" + this._getDateFormatter().format(new Date(newtoken.reference.replace(/\'/g, "")), true) + "'";
				}
				if (newtoken.tokenType === "T") {
					newtoken.reference = newtoken.text;
					newtoken.text = "'" + this._getDateTimeFormatter().format(new Date(newtoken.reference.replace(/\'/g, "")), true) + "'";
				}
				tokensModel.push(newtoken);
			}

		}
		return tokensModel;
	};

	AstExpressionLanguage.prototype.includes = function (parent, str) {
		var returnValue = false;

		if (parent.indexOf(str) !== -1) {
			returnValue = true;
		}

		return returnValue;
	};

	AstExpressionLanguage.prototype.convertTokensToUiModelForAutoSuggestion = function (tokensStream) {
		var tokensModel = [];
		for (var index = 0; index < tokensStream.length; index++) {
			var token = tokensStream[index];
			if (token.type === this._astBunldeInstance.IDPLexer.EOF)
				continue;
            var type = token.type ? token.type : token._type;
            var newtoken = new Token(type, token.text, token.start, token.stop, this._createUUID(), token.reference, token.json);
			if (newtoken.tokenType === "ID") {
				newtoken.reference = newtoken.text;
				var term = this._termsProvider.TermsProvider.getTermByTermId(newtoken.reference.split("/")[1]);
				if (term && (term._isDataObjectElement || term.isResultDataObjectElement)) {
					var doId = term._termId;
					var attribute = TermsProvider.getInstance()._getAllAttrsAndAssocsForDataObject(doId)[0];
					newtoken.bussinessDataType = attribute._bussinessDataType;
					newtoken.hasValueSource = attribute._hasValueSource;
					newtoken.dataObjectType = attribute._dataObjectType;
					if (term._isDataObjectElement) {
						newtoken._isDataObjectElement = true;
					} else {
						newtoken.isResultDataObjectElement = true;
					}
				}
			} else if (newtoken.tokenType === "D") {
					newtoken.reference = newtoken.text;
					newtoken.text = "'" + this._getDateFormatter().format(new Date(newtoken.reference.replace(/\'/g, "")), true) + "'";
				}
			  else if (newtoken.tokenType === "T") {
					newtoken.reference = newtoken.text;
					newtoken.text = "'" + this._getDateTimeFormatter().format(new Date(newtoken.reference.replace(/\'/g, "")), true) + "'";
				}
			  tokensModel.push(newtoken);
			}
		return tokensModel;
	};

	AstExpressionLanguage.prototype.convertTokensToRelString = function (aTokens) {
		var relString = "";
		for (var index = 0; index < aTokens.length; index++) {
			relString += aTokens[index].getText();
		}
		return relString;
	};

	AstExpressionLanguage.prototype._createUUID = function () {
		return this._infraUtils.createUUID();
	};

	AstExpressionLanguage.prototype._getAutoSuggestionCandidates = function (aTokens) {
		// Convert tokens to rel string
		var length = 0;
		if (aTokens && aTokens.length > 0) {
			length = aTokens.length + 2;
		}
		var parser = this._getParser(this.convertTokensToRelString(aTokens));
		var core = new this._astBunldeInstance.CodeCompletionCore(parser);

		return core.collectSuggestions(length);
	};

	AstExpressionLanguage.prototype._getParser = function (sInputString) {
		this._idpCustomVisitor.resetSequenceNumber();
		var charStream = new this._antlr4.InputStream(sInputString);
		var lexer = new this._astBunldeInstance.IDPLexer(charStream);
		var tokens = new this._antlr4.CommonTokenStream(lexer);
		var parser = new this._astBunldeInstance.IDPParser(tokens);
		var listener = new this._astBunldeInstance.ASTErrorListener(annotations);
		parser.removeErrorListeners();
		parser.addErrorListener(listener);
		return parser;
	}

	AstExpressionLanguage.prototype.getSuggesstions = function (aTokens, suggestionContext) {
		var candidates = this._getAutoSuggestionCandidates(aTokens);
		return this._autoComplete.getSuggestions(aTokens, candidates, suggestionContext, this._oData);
	}

	return AstExpressionLanguage;

}, true);

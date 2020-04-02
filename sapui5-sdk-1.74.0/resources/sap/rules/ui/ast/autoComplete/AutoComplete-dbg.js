sap.ui.define(["sap/rules/ui/ast/autoComplete/dataStructure/Stack",
		"sap/rules/ui/ast/provider/TermsProvider",
		"sap/rules/ui/ast/provider/OperatorProvider",
		"sap/rules/ui/ast/provider/FunctionProvider",
		"sap/rules/ui/ast/parser/bundlelibrary",
		"sap/rules/ui/ast/constants/Constants",
		"sap/rules/ui/ast/autoComplete/node/TermNode",
		"sap/rules/ui/ast/autoComplete/dataStructure/ComparisionOperatorStack",
		"sap/rules/ui/ast/autoComplete/dataStructure/FunctionalStack",
		"sap/rules/ui/ast/autoComplete/node/OperatorNode",
		"sap/rules/ui/ast/autoComplete/dataStructure/ArrayAndRangeStack"
	],
	function (Stack, TermsProvider, OperatorProvider, FunctionProvider, astBundleLibrary, Constants, TermNode, ComparisionOperatorStack,
		FunctionalStack, OperatorNode, ArrayAndRangeStack) {
		'use strict';

		var astLibInstance = astBundleLibrary.getInstance();

		var AutoComplete = function () {
			this._autoCompleteStack = new Stack();
			this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
		};

		AutoComplete.prototype._getAutoSuggestionSkeleton = function () {
			var oAutoCompleteJson = {
				"autoComplete": {
					"categories": {},
					"showLiteral": false

				}
			};
			this._aValueSources = {}
			return oAutoCompleteJson;
		};

		/* if the requested text is a rule, 
		    returns the result data object id else returns the data object id itself*/
		AutoComplete.prototype._getResultDOIdForTheGivenText = function (sText) {
			var resultDataObjectId = sText;
			for (var rule in this._aRules) {
				if (this._aRules[rule].Id === sText) {
					resultDataObjectId = this._aRules[rule].ResultDataObjectId;
					return resultDataObjectId;
				}
			}
			return resultDataObjectId;
		};

		AutoComplete.prototype.getSuggestions = function (aTokens, aExpectedTokensCandidates, suggestionContext, oData) {
			var oAutoCompleteJson = this._getAutoSuggestionSkeleton();
			var oResult;
			var topNode;
			var oTopStack;
			var bIsLastTokenEndingWithDot = suggestionContext.AttributeContext;
			var bAssociationContext = suggestionContext.AssociationContext;
			var bIsOperationsContext = suggestionContext.OperationsContext;
			this._aValueSources = oData.ValueSources;
			this._aDataObjects = oData.DataObjects;
			this._aRules = oData.Rules;

			this._autoCompleteStack.empty();

			if (aExpectedTokensCandidates && aExpectedTokensCandidates.length > 0) {
				if (aTokens && aTokens.length > 0) {
					// Special Handling for token ending with .
					var sText = aTokens[aTokens.length - 1].getText();
					if (bIsLastTokenEndingWithDot || bAssociationContext) {
						sText = sText.replace(".", "");
						sText = sText.replace(/\//g, ".");
						sText = sText.replace(".", "");
					}
					oResult = this._pushTokensToAutoCompleteStack(aTokens);
					topNode = this._getTopNodeOfAutomCompleteStack();
					oTopStack = this._getTopStackofAutoCompleteStack();

					oAutoCompleteJson["autoComplete"]["categories"]["terms"] = [];
					var terms = [];
					var expectedBusinessDataTypeList;
					var lIterator
					if ((bIsLastTokenEndingWithDot || bAssociationContext) && oResult && oResult.errorCode == 1) {
						expectedBusinessDataTypeList = oResult.expectedBusinessDataTypeList;
						if (oTopStack && "getTermPrefixId" in oTopStack && oTopStack.getTermPrefixId()) {
							sText = oTopStack.getTermPrefixId() + Constants.DOT + sText;
						}
						if (bIsLastTokenEndingWithDot) {
							for (lIterator = 0; lIterator < expectedBusinessDataTypeList.length; lIterator++) {
								terms = terms.concat(TermsProvider.getInstance()._getAllAttributesByPrefixIdAndBusinessType(sText, expectedBusinessDataTypeList[
									lIterator]));
							}
						}

                        terms = terms.concat(TermsProvider.getInstance().getAssociationsGivenPrefixId(sText));
						oAutoCompleteJson["autoComplete"]["categories"]["terms"] = this._transformTermsToUiModel(terms);
						return oAutoCompleteJson;
					}
					if (oResult) {
						return oAutoCompleteJson;
					} else if (bIsLastTokenEndingWithDot || bAssociationContext) {
						if (oTopStack && "getTermPrefixId" in oTopStack && oTopStack.getTermPrefixId()) {
							sText = oTopStack.getTermPrefixId() + Constants.DOT + sText;
						}
						var dataObjectId = this._getResultDOIdForTheGivenText(sText);

						// Uncomment if there is no type casting
						/*if (oTopStack && "getProbableBusinessDataReturnTypeList" in oTopStack && oTopStack.getProbableBusinessDataReturnTypeList() &&
							oTopStack.getProbableBusinessDataReturnTypeList().length > 0) {
							expectedBusinessDataTypeList = oTopStack.getProbableBusinessDataReturnTypeList();
							for (lIterator = 0; lIterator < expectedBusinessDataTypeList.length; lIterator++) {
								terms = terms.concat(TermsProvider.getInstance()._getAllAttributesByPrefixIdAndBusinessType(sText, expectedBusinessDataTypeList[
									lIterator]));
							}
						}*/

						if (bIsLastTokenEndingWithDot) {
							terms = terms.concat(TermsProvider.getInstance()._getAttributesGivenPrefixId(dataObjectId));
						}

						terms = terms.concat(TermsProvider.getInstance().getAssociationsGivenPrefixId(dataObjectId));
						oAutoCompleteJson["autoComplete"]["categories"]["terms"] = this._transformTermsToUiModel(terms);
						return oAutoCompleteJson;
					} else {
						// TODO : Handle Exception
					}
				}

				for (var lIndex = 0; lIndex < aExpectedTokensCandidates.length; lIndex++) {
					this._updateAutoCompleteJsonBasedOnTokenCandidate(aExpectedTokensCandidates[lIndex], oAutoCompleteJson, topNode, oTopStack,
						bIsOperationsContext, bIsLastTokenEndingWithDot);
				}

			}

			return oAutoCompleteJson;
		};

		AutoComplete.prototype._getTopNodeOfAutomCompleteStack = function () {
			var node;
			if (this._autoCompleteStack.getSize() > 0) {
				node = this._getNodeRecursively(this._autoCompleteStack.getTop());
			}

			return node;
		}

		AutoComplete.prototype._getTopStackofAutoCompleteStack = function () {
			var oTopStack;
			if (this._autoCompleteStack.getSize() > 0) {
				oTopStack = this._getTopStackRecursively(this._autoCompleteStack.getTop());
			}

			return oTopStack;

		};

		AutoComplete.prototype._updateAutoCompleteJsonBasedOnTokenCandidate = function (candidate, oAutoCompleteJson, topNode, oTopStack,
			bIsOperationsContext, bIsLastTokenEndingWithDot) {
			var lastFunctionalStack = this._getLastFunctionStack();
			var firstArgument;
			if (lastFunctionalStack) {
				firstArgument = this._getNodeRecursively(lastFunctionalStack.peek(0));
			}
			var lastFunctionalStackSize;
			var oFunction;

			var categories = oAutoCompleteJson["autoComplete"]["categories"];
			switch (candidate) {
			case astLibInstance.IDPLexer.LROUNDB:
				if (bIsOperationsContext && !lastFunctionalStack) {
					break;
				}
				this._constructMiscellaneousTokens(oAutoCompleteJson, Constants.LEFTPARENTHESISTEXT, this.oBundle.getText("LEFTPARENTHESISLABEL"));
				break;
			case astLibInstance.IDPLexer.LSQUAREB:
				this._constructMiscellaneousTokens(oAutoCompleteJson, Constants.LEFTSQUAREPARENTHESISTEXT, this.oBundle.getText(
					"LEFTSQUAREPARENTHESISLABEL"));
				break;
			case astLibInstance.IDPLexer.RROUNDB:
				if (lastFunctionalStack && !this._hasAnyOfStackContainsLeftParenthesis()) {
					lastFunctionalStackSize = lastFunctionalStack.getSize();
					oFunction = lastFunctionalStack.getFunction();
					if (oFunction && lastFunctionalStackSize < oFunction.getNoOfMandatoryArgs()) {
						break;
					}
				}
				this._constructMiscellaneousTokens(oAutoCompleteJson, Constants.RIGHTPARENTHESISTEXT, this.oBundle.getText("RIGHTPARENTHESISLABEL"));
				break;
			case astLibInstance.IDPLexer.RSQUAREB:
				this._constructMiscellaneousTokens(oAutoCompleteJson, Constants.RIGHTSQUAREPARENTHESISTEXT, this.oBundle.getText(
					"RIGHTSQUAREPARENTHESISLABEL"));
				break;
			case astLibInstance.IDPLexer.COMMA:
				if (lastFunctionalStack && !this._hasAnyOfStackContainsGivenStackType(ArrayAndRangeStack)) {
					lastFunctionalStackSize = lastFunctionalStack.getSize();
					oFunction = lastFunctionalStack.getFunction();
					if (oFunction && oFunction.getNumberOfArguments() != "*" && lastFunctionalStackSize >= oFunction.getNumberOfArguments()) {
						break;
					}
				}
				this._constructMiscellaneousTokens(oAutoCompleteJson, Constants.COMMATEXT, this.oBundle.getText("COMMALABEL"));
				break;
			case astLibInstance.IDPLexer.RANGE_DOTS:
				this._constructMiscellaneousTokens(oAutoCompleteJson, Constants.RANGETEXT, this.oBundle.getText("RANGELABEL"));
				break;
			case astLibInstance.IDPLexer.ARRAY_OPERATOR:
				this._constructFunctionalArrayAndRangeOperatorsAutoComplete(oAutoCompleteJson, Constants.ARRAY, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.RANGE_OPERATOR:
				this._constructFunctionalArrayAndRangeOperatorsAutoComplete(oAutoCompleteJson, Constants.RANGE, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.WINDOW_FUNCTION_NAME:
			case astLibInstance.IDPLexer.ADVANCED_FUNCTION_NAME:
			case astLibInstance.IDPLexer.FUNCTION_NAME:
			case astLibInstance.IDPLexer.DATE_TIME_FUNCTION_NAME:
				this._constructFunctionsAutocomplete(oAutoCompleteJson, topNode, oTopStack, bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.AND:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.LOGICAL, Constants.AND, topNode, oTopStack, bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.OR:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.LOGICAL, Constants.OR, topNode, oTopStack, bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.ID:
				if (bIsOperationsContext && lastFunctionalStack && lastFunctionalStack.getFunction().getCategory() == "operations" &&
					lastFunctionalStack.getSize() < 1) {
					break;
				}
				if (bIsOperationsContext && !lastFunctionalStack) {
					break;
				}
				if (categories["terms"] == undefined) {
					categories["terms"] = [];
				}
				if (topNode && "getTermPrefixId" in topNode && topNode.getTermPrefixId() && topNode.getTermPrefixId() != "") {
					categories["terms"] = this._transformTermsToUiModel(TermsProvider.getInstance()._getAllAttrsAndAssocsForDataObject(topNode.getTermPrefixId()));
				} else if (oTopStack && "getTermPrefixId" in oTopStack && oTopStack.getTermPrefixId() && oTopStack.getTermPrefixId() != "") {
					categories["terms"] = this._transformTermsToUiModel(TermsProvider.getInstance()._getAllAttrsAndAssocsForDataObject(oTopStack.getTermPrefixId()));
				} else if (bIsOperationsContext && lastFunctionalStack && lastFunctionalStack.getFunction().getCategory() == "operations" &&
					lastFunctionalStack.getSize() >= 1 && lastFunctionalStack.getFunction()._name === Constants.APPEND) {
					var termsOfTableType = [];
					var termsProviderInstance = TermsProvider.getInstance();
					var firstArgument = false;
					var secondArgument = false;
					if (lastFunctionalStack.getSize() === 1) {
						firstArgument = true;
					} else {
						secondArgument = true;
					}
					//Handle terms -> read only dataobjects of type table
					var allTerms = termsProviderInstance._getAllDataObjects();
					for (var term in allTerms) {
						var currentTerm = allTerms[term];
						if (firstArgument && currentTerm.getDataObjectType() === Constants.Table) {
							termsOfTableType.push(currentTerm);
						} else if (secondArgument && (currentTerm.getDataObjectType() === Constants.Table || currentTerm.getDataObjectType() === Constants.Structure)) {
							termsOfTableType.push(currentTerm);
						}
					}
					categories["terms"] = this._transformTermsToUiModel(termsOfTableType);
					//Handle vocabulary rules returning data object of type table only for source
					if (secondArgument) {
						var vocabularyRulesOfTypeTable = [];
						var allVocabularyRules = termsProviderInstance._getAllVocabularyRules();
						for (var rule in allVocabularyRules) {
							var currentVRule = allVocabularyRules[rule];
							var resultDOId = currentVRule.ResultDataObjectId;
							var resultDO = termsProviderInstance.getTermByTermId(resultDOId)
							if (resultDO && (resultDO.getDataObjectType() === Constants.Table || resultDO.getDataObjectType() === Constants.Structure)) {
								vocabularyRulesOfTypeTable.push(currentVRule);
							}
						}
						var transformedVocabRules = this._transformTermsToUiModel(vocabularyRulesOfTypeTable);
						for (var rule in transformedVocabRules) {
							categories["terms"].push(transformedVocabRules[rule]);
						}
					}
				} else {
					categories["terms"] = this._transformTermsToUiModel(TermsProvider.getInstance()._getAllDataObjects());
					var vocabularyRules = TermsProvider.getInstance()._getAllVocabularyRules();
					if (vocabularyRules.length > 0) {
						var transformedVocabRules = this._transformTermsToUiModel(vocabularyRules);
						for (var rule in transformedVocabRules) {
							categories["terms"].push(transformedVocabRules[rule]);
						}
					}
				}

				break;
			case astLibInstance.IDPLexer.NUMERIC_LITERAL_UNIT:
			case astLibInstance.IDPLexer.BOOL:
			case astLibInstance.IDPLexer.NUMERIC_LITERAL:
			case astLibInstance.IDPLexer.STRING:
			case astLibInstance.IDPLexer.PARTIALTIME:
			case astLibInstance.IDPLexer.FULLTIME:
			case astLibInstance.IDPLexer.DATETIME:
			case astLibInstance.IDPLexer.GEOJSON_POINT:
			case astLibInstance.IDPLexer.GEOJSON_POLYGON:
				if (bIsOperationsContext && lastFunctionalStack && lastFunctionalStack.getFunction().getCategory() == "operations" &&
					(lastFunctionalStack.getSize() <= 1 || firstArgument && "getDataObjectType" in firstArgument && firstArgument.getDataObjectType() ==
						"T")) {
					break;
				}
				if (bIsOperationsContext && !lastFunctionalStack) {
					break;
				}
				oAutoCompleteJson.autoComplete.showLiteral = true;
				var businessDataTypeList = "";
				var id;
				if (oTopStack && "getPrevious" in oTopStack && oTopStack.getPrevious() instanceof ComparisionOperatorStack) {
					var oComparisionStack = oTopStack.getPrevious();
					businessDataTypeList = OperatorProvider.getInstance().getOperatorByName(oComparisionStack.getName()).getReturnValueBussinessDataTypeCollection();
					if (oComparisionStack.getPrevious() && "getId" in oComparisionStack.getPrevious()) {
						id = oComparisionStack.getPrevious().getId();
					}
				}

				if (topNode && "getProbableBusinessDataReturnTypeList" in topNode) {
					businessDataTypeList = topNode.getProbableBusinessDataReturnTypeList();
					if (topNode.getPrevious()) {
						var oPrevious = this._getNodeRecursively(topNode.getPrevious());
						if (oPrevious instanceof TermNode && oPrevious.getId()) {
							id = oPrevious.getId();
						}
					}
				}
				oAutoCompleteJson.businessDataTypeList = businessDataTypeList;
				if (id === undefined) {
					id = oTopStack && oTopStack._previous ? oTopStack._previous._id : undefined;
				}
				if (id) {
					var oTerm = TermsProvider.getInstance().getTermByTermId(id);
					if (oTerm.getIsDataObjectElement()) {
						// Terms will save term for element in the form id.id ( DO ID.Attr Id) which are the same
						id = id + "." + id;
						oTerm = TermsProvider.getInstance().getTermByTermId(id);
					}
					if (oTerm && oTerm.getHasValueSource()) {
						var oValueHelp = {};
						var oValueSource;
						oValueHelp.vocabularyId = oTerm.getVocaId();
						var aIds = oTerm.getTermId().split(".");
						var sDoId = aIds[aIds.length - 2];
						var sAttributeId = aIds[aIds.length - 1];
						oValueHelp.dataObjectId = sDoId;
						oValueHelp.attributeId = sAttributeId;
						oValueHelp.attributeName = oTerm._label;
						oValueHelp.attributeDataType = oTerm._bussinessDataType;
						for (var lIndex = 0; lIndex < this._aValueSources.length; lIndex++) {
							oValueSource = this._aValueSources[lIndex];
							if (oValueSource.AttributeId == sAttributeId) {
								oValueHelp.sourceType = oValueSource.SourceType;
								break;
							}
						}
						oAutoCompleteJson.autoComplete.valuehelp = oValueHelp;
					}
				}
				break;
			case astLibInstance.IDPLexer.FUNCTIONAL_OPERATOR:
				this._constructFunctionalArrayAndRangeOperatorsAutoComplete(oAutoCompleteJson, Constants.FUNCTIONAL, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.LESS_THAN:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.COMPARISION, Constants.LESS_THAN, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.GREATER_THAN:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.COMPARISION, Constants.GREATER_THAN, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.LESS_THAN_EQUAL:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.COMPARISION, Constants.LESS_THAN_EQUAL, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.GREATER_THAN_EQUAL:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.COMPARISION, Constants.GREATER_THAN_EQUAL, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.NOT_EQUAL:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.COMPARISION, Constants.NOT_EQUAL, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.EQUAL:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.COMPARISION, Constants.EQUAL, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.MULT:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.ARITHMETIC, Constants.MULT, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.LOGICAL_NOT:
				break;
			case astLibInstance.IDPLexer.DIV:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.ARITHMETIC, Constants.DIV, topNode, oTopStack, bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.ADD:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.ARITHMETIC, Constants.ADD, topNode, oTopStack, bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.MINUS:
				this._constructOperatorsAutocomplete(oAutoCompleteJson, Constants.ARITHMETIC, Constants.MINUS, topNode, oTopStack,
					bIsOperationsContext);
				break;
			case astLibInstance.IDPLexer.OPERATION_FUNCTION_NAME:
				if (bIsOperationsContext) {
					this._constructOperationsAutocomplete(oAutoCompleteJson, topNode, oTopStack);
				}
				break;

			default:
				break;
			}

		};

		AutoComplete.prototype._constructMiscellaneousTokens = function (oAutoCompleteJson, sName, sLabel) {
			var operators = null;
			var categories = oAutoCompleteJson["autoComplete"]["categories"];
			if (categories["operators"] == undefined) {
				categories["operators"] = {};
			}
			operators = categories["operators"]
			if (operators["miscellaneous"] == undefined) {
				operators["miscellaneous"] = [];
			}
			operators["miscellaneous"].push({
				name: sName,
				label: sLabel
			});
		};

		AutoComplete.prototype._pushTokensToAutoCompleteStack = function (aTokens) {
			var oResult;
			for (var lIndex = 0; lIndex < aTokens.length; lIndex++) {
				oResult = this._autoCompleteStack.push(aTokens[lIndex]);
				if (oResult && oResult.bTokenPushed == false) {
					return oResult;
				}
			}
		};

		AutoComplete.prototype._getNodeRecursively = function (node) {
			while (node && "getTop" in node && node.getTop()) {
				node = node.getTop();
			}
			return node;
		};

		AutoComplete.prototype._getTopStackRecursively = function (node) {
			var prev = node;
			while (node && "getTop" in node) {
				prev = node;
				node = node.getTop();
			}
			return prev;
		};

		AutoComplete.prototype._hasAnyOfStackContainsLeftParenthesis = function () {
			var node = this._autoCompleteStack;
			while (node && "getTop" in node && node.getTop()) {
				if (node && !(node instanceof FunctionalStack) && !(node instanceof ArrayAndRangeStack) && node.getHasOpenParenthesis()) {
					return true;
				}
				node = node.getTop();
			}
			return false;
		};

		AutoComplete.prototype._hasAnyOfStackContainsGivenStackType = function (stackName) {
			var node = this._autoCompleteStack;
			while (node && "getTop" in node && node.getTop()) {
				if (node instanceof stackName) {
					return true;
				}
				node = node.getTop();
			}
			return false;
		};

		AutoComplete.prototype._constructFunctionalArrayAndRangeOperatorsAutoComplete = function (oAutoCompleteJson, category, topNode,
			oTopStack, bIsOperationsContext) {
			var aOperators = OperatorProvider.getInstance().getAllOperatorsByCategory(category);
			for (var lIndex = 0; lIndex < aOperators.length; lIndex++) {
				this._constructOperatorsAutocomplete(oAutoCompleteJson, category, aOperators[lIndex].getName(), topNode, oTopStack,
					bIsOperationsContext);
			}
		};

		AutoComplete.prototype._constructOperatorsAutocomplete = function (oAutoCompleteJson, category, operatorName, topNode, oTopStack,
			bIsOperationsContext) {
			var lastFunctionalStack = this._getLastFunctionStack();
			var firstArgument;
			if (lastFunctionalStack) {
				firstArgument = this._getNodeRecursively(lastFunctionalStack.peek(0));
			}
			if (bIsOperationsContext && lastFunctionalStack && lastFunctionalStack.getFunction().getCategory() == "operations" &&
				(lastFunctionalStack.getSize() <= 1 || firstArgument && "getDataObjectType" in firstArgument && firstArgument.getDataObjectType() ==
					"T")) {
				return;
			}
			if (bIsOperationsContext && !lastFunctionalStack) {
				return;
			}
			var isBusinessAndDataObjectTypeAvailable = false;
			var operator;
			var categories = oAutoCompleteJson["autoComplete"]["categories"];
			var operators = null;
			var sBusienssDataType = null;
			var sDataObjectType = null;
			var bOperatorPushed = false;

			if (categories["operators"] == undefined) {
				categories["operators"] = {};
			}
			operators = categories["operators"];
			if (operators[category] == undefined) {
				operators[category] = [];
			}

			operator = OperatorProvider.getInstance().getOperatorByName(operatorName);

			if (category === Constants.LOGICAL || category === Constants.COMPARISION) {
				if (oTopStack && oTopStack instanceof Stack && "isContextComparision" in oTopStack && oTopStack.isContextComparision() &&
					topNode && topNode.getBusinessDataType() == oTopStack.getComparisionLeftOperandBusinessType()
				) {
					operators[category].push(this._transformOperatorsToUiModel(operator));
					bOperatorPushed = true;

				}
				/*else if (category === Constants.LOGICAL && topNode && topNode.getBusinessDataType() == Constants.BOOLEANBUSINESSDATATYPE) {
					operators[category].push(this._transformOperatorsToUiModel(operator));
					bOperatorPushed = true;

				}*/
			}
			if (topNode && !bOperatorPushed) {
				if ("getProbableBusinessDataReturnTypeList" in topNode &&
					topNode.getProbableBusinessDataReturnTypeList() &&
					topNode.getProbableBusinessDataReturnTypeList().length > 0) {
					isBusinessAndDataObjectTypeAvailable = true;
					var probableBusinessDataReturnTypeList = topNode.getProbableBusinessDataReturnTypeList();
					for (var index = 0; index < probableBusinessDataReturnTypeList.length; index++) {
						var sbbusienssDataType = probableBusinessDataReturnTypeList[length];
						if (sbbusienssDataType == Constants.NUMBERBUSINESSDATATYPE) {
							isBusinessAndDataObjectTypeAvailable = false;
						}
					}
				}
				if ("getBusinessDataType" in topNode) {
					sBusienssDataType = topNode.getBusinessDataType();
					sDataObjectType = topNode.getDataObjectType();
					isBusinessAndDataObjectTypeAvailable = true;
				}
			}

			if (!isBusinessAndDataObjectTypeAvailable && !bOperatorPushed) {
				operators[category].push(this._transformOperatorsToUiModel(operator));
			}
			if (sBusienssDataType && sDataObjectType && operator && operator.getReturnValueBussinessDataTypeCollection()[sBusienssDataType] &&
				operator.getReturnValueDataObjectTypeCollection()[sDataObjectType] && !bOperatorPushed) {
				operators[category].push(this._transformOperatorsToUiModel(operator));
			}

		};

		AutoComplete.prototype._constructFunctionsAutocomplete = function (oAutoCompleteJson, oTopNode, oTopStack, bIsResultContext,
			sFunctionCategory) {
			var oCategories = oAutoCompleteJson["autoComplete"]["categories"];
			var aBusienssDataTypeList = [];
			var aDataObjectTypeList = [];
			var oFunction;
			var lIndex, lBusinessDataListIterator, lDataObjectListIterator;
			if (oCategories["functions"] == undefined) {
				oCategories["functions"] = {};
			}
			var aAllFunctions = [];
			var aAllFunctions = FunctionProvider.getInstance().getAllFunctions(sFunctionCategory);

			var lastFunctionalStack = this._getLastFunctionStack();

			if (lastFunctionalStack) {
				var lastFunctionalStackSize = lastFunctionalStack.getSize();
				var argumentsMetadata = lastFunctionalStack.getFunction().getArgumentsMetadata();

				if (argumentsMetadata == undefined || argumentsMetadata.length == 0) {
					return;
				}
				var arg;
                if (lastFunctionalStack.getFunction().getNumberOfArguments() === "*" && lastFunctionalStackSize >= argumentsMetadata.length) {
                    // last functional Stack Category
                    arg = argumentsMetadata[argumentsMetadata.length - 1];
                } else {
                    // last functional Stack Category
                    arg = argumentsMetadata[lastFunctionalStackSize - 1];
                }

				if (oTopStack.getSize() != 0) {
					this._categorizeFunctionsWhenPreviousNodeIsOperator(oTopNode, aAllFunctions, oTopStack, oCategories, bIsResultContext);
				} else if (arg) {
					// First Argument
					if (lastFunctionalStackSize == 0 || !("referenceIndex" in arg)) {

						if ("businessDataTypeList" in arg) {
							aBusienssDataTypeList = arg.businessDataTypeList;
							aDataObjectTypeList = arg.dataObjectTypeList;
							for (lIndex = 0; lIndex < aAllFunctions.length; lIndex++) {
								oFunction = aAllFunctions[lIndex];
								this._categorizeFunctionGivenBusinessDataTypeAndDataObjectList(oFunction, aBusienssDataTypeList, aDataObjectTypeList, oCategories,
									bIsResultContext);
							}
						} else {
							// No businessDatatype found, get all the functions with matching category and dataobject type
							aDataObjectTypeList = arg.businessDataTypeList;
							this._categorizeFunctionGivenDataObjectList(oFunction, aDataObjectTypeList, oCategories,
								bIsResultContext);
						}
					} else if ("referenceIndex" in arg && arg.referenceIndex != -1) {
						//remaining  arguments with reference index
						var referenceArgumentNode = this._getNodeRecursively(lastFunctionalStack.peek(arg.referenceIndex - 1));
						if (referenceArgumentNode && !("getBusinessDataType" in referenceArgumentNode)) {
                            aBusienssDataTypeList = referenceArgumentNode.getProbableBusinessDataReturnTypeList();
                        } else {
                            var referenceArgumentNodeBusinessDataType = referenceArgumentNode.getBusinessDataType();
                            aBusienssDataTypeList = arg["referenceBusinessDataTypeCollection"][referenceArgumentNodeBusinessDataType] ? Object.keys(arg[
                                "referenceBusinessDataTypeCollection"][referenceArgumentNodeBusinessDataType]) : [];
                        }
                        
                        if (referenceArgumentNode && !("getDataObjectType" in referenceArgumentNode)) {
                            aDataObjectTypeList = referenceArgumentNode.getProbableDataObjectReturnTypeList();
                        } else {
                            var referenceArgumentNodeDataObjectDataType = referenceArgumentNode.getDataObjectType();
                            aDataObjectTypeList = arg["referenceDataObjectTypeCollection"][referenceArgumentNodeDataObjectDataType] ? Object.keys(arg[
							"referenceDataObjectTypeCollection"][referenceArgumentNodeDataObjectDataType]) : [];
                        }
						for (lIndex = 0; lIndex < aAllFunctions.length; lIndex++) {
							oFunction = aAllFunctions[lIndex];
							if (aBusienssDataTypeList == undefined || aBusienssDataTypeList.length == 0) {
                                this._categorizeFunctionGivenDataObjectList(oFunction, aDataObjectTypeList, oCategories,
                                    bIsResultContext);
                            } else {
                                this._categorizeFunctionGivenBusinessDataTypeAndDataObjectList(oFunction, aBusienssDataTypeList, aDataObjectTypeList, oCategories,
                                        bIsResultContext);
                            }
						}	
					} else {
						// TODO : handle this case
					}
				} else {
					for (lIndex = 0; lIndex < aAllFunctions.length; lIndex++) {
						oFunction = aAllFunctions[lIndex];
						this._categorizeFunctions(oFunction, oCategories["functions"], bIsResultContext);
					}
				}
			} else if (oTopNode && oTopNode.getPrevious()) {
				this._categorizeFunctionsWhenPreviousNodeIsOperator(oTopNode, aAllFunctions, oTopStack, oCategories, bIsResultContext);
			} else {
				for (lIndex = 0; lIndex < aAllFunctions.length; lIndex++) {
					oFunction = aAllFunctions[lIndex];
					this._categorizeFunctions(oFunction, oCategories["functions"], bIsResultContext);
				}
			}
		};

		AutoComplete.prototype._categorizeFunctionGivenBusinessDataTypeAndDataObjectList = function (oFunction, aBusienssDataTypeList,
			aDataObjectTypeList, oCategories, bIsResultContext) {
			for (var lBusinessDataListIterator = 0; lBusinessDataListIterator < aBusienssDataTypeList.length; lBusinessDataListIterator++) {
				if ("getProbableBusinessDataTypeList" in oFunction && oFunction.getProbableBusinessDataTypeList() && oFunction.getProbableBusinessDataTypeList()
					.indexOf(
						aBusienssDataTypeList[lBusinessDataListIterator]) !== -1) {
					for (var lDataObjectListIterator = 0; lDataObjectListIterator < aDataObjectTypeList.length; lDataObjectListIterator++) {
						if ("getProbableDataObjectTypeList" in oFunction && oFunction.getProbableDataObjectTypeList() && oFunction.getProbableDataObjectTypeList()
							.indexOf(
								aDataObjectTypeList[lDataObjectListIterator]) !== -1) {
							this._categorizeFunctions(oFunction, oCategories["functions"], bIsResultContext);
						}
					}
				}
			}
		};

		AutoComplete.prototype._getLastFunctionStack = function () {

			var oFunctionalStack;
			var node = this._autoCompleteStack;
			var prev = node;

			while (node && "getTop" in node && node.getTop()) {
				if (node instanceof FunctionalStack) {
					oFunctionalStack = node;
				}
				node = node.getTop();
			}

			if (node && node instanceof FunctionalStack) {
				oFunctionalStack = node;
			}

			return oFunctionalStack;

		};

		AutoComplete.prototype._constructOperationsAutocomplete = function (oAutoCompleteJson, oTopNode, oTopStack) {
			if (!oTopNode) {
				var operations = null;
				var categories = oAutoCompleteJson["autoComplete"]["categories"];
				if (categories["operations"] == undefined) {
					categories["operations"] = [];
				}
				operations = categories["operations"];

				operations.push({
					name: Constants.UPDATE,
					label: this.oBundle.getText("UPDATELABEL")
				});
				operations.push({
					name: Constants.APPEND,
					label: this.oBundle.getText("APPENDLABEL")
				});
			}
			var aAllFunctions = operations;
			if (oTopNode && oTopNode.getPrevious()) {
				var oPreviousNode = oTopNode.getPrevious();
				oPreviousNode = this._getNodeRecursively(oPreviousNode);
				var aBusienssDataTypeList = [];
			}

		};

		AutoComplete.prototype._checkPreviousOperatorHasSupportedFunctions = function (oTopStack) {
			if (oTopStack && "getOperator" in oTopStack) {
				var oOperator = oTopStack.getOperator();
				if (oOperator && "getSupportedFunctions" in oOperator && oOperator.getSupportedFunctions()) {
					return true
				}
			}
			return false;

		}

		AutoComplete.prototype._checkOperatorCompatitbilityWithFunction = function (oFunction, oTopStack) {
			if (oTopStack && "getOperator" in oTopStack) {
				var oOperator = oTopStack.getOperator();
				if (oOperator && "getSupportedFunctions" in oOperator && oOperator.getSupportedFunctions()) {
					var aSupportedFunctions = oOperator.getSupportedFunctions()
					for (var lIterator = 0; lIterator < aSupportedFunctions.length; lIterator++) {
						if (aSupportedFunctions[lIterator].name.toUpperCase() === oFunction.getName()) {
							return true;
						}
					}
				}
			}

			return false;
		};

		AutoComplete.prototype._categorizeFunctions = function (oFunction, oAutoCompleteFunctionJson, bIsResultContext) {
			var lastFunctionalStack = this._getLastFunctionStack();

			//Final Blacklisting of Functions checks
			if (lastFunctionalStack && lastFunctionalStack.getFunction().getCategory() == "operations" && lastFunctionalStack.getSize() <= 1) {
				return;
			}
			if (bIsResultContext && !(oFunction.getContext().toUpperCase() == "RESULT") && !(lastFunctionalStack)) {
				return;
			}
			var category = oFunction.getCategory();
			var oTransformedFunction = {};
			if (oAutoCompleteFunctionJson[category] == undefined) {
				oAutoCompleteFunctionJson[category] = [];
			}

			oTransformedFunction.name = oFunction.getName();
			oTransformedFunction.label = oFunction.getLabel();
			oTransformedFunction.noOfMandatoryArgs = oFunction.getNoOfMandatoryArgs();

			var aFunctions = oAutoCompleteFunctionJson[category];
			// Check if function already pushed to avoid duplicates
			for (var lIterator = 0; lIterator < aFunctions.length; lIterator++) {
				var sFunctioName = aFunctions[lIterator].name;
				if (oTransformedFunction.name.toUpperCase() == sFunctioName.toUpperCase()) {
					return;
				}
			}

			oAutoCompleteFunctionJson[category].push(oTransformedFunction);

		};

		AutoComplete.prototype._transformTermsToUiModel = function (terms) {
			var transFormedTerms = [];
			var term;
			var uiTermObj;
			var name;
			var id;
			var length;
			for (var lIndex = 0; lIndex < terms.length; lIndex++) {
				term = terms[lIndex];
				uiTermObj = {};
				name = term.getTermName();
				if (name) {
					length = name.split(".").length;
					if (length > 0) {
						name = name.split(".")[length - 1];
					}
				}
				uiTermObj.name = name;
				id = term.getTermId();
				if (id) {
					id = term.getTermId();
					length = id.split(".").length;
					if (length > 0) {
						id = id.split(".")[length - 1];
					}
				}
				uiTermObj.isParentEntity = term._bussinessDataType === null ? true : false;

				if (term.ResultDataObjectId) {
					uiTermObj.ResultDataObjectId = term.ResultDataObjectId;
					uiTermObj.isParentEntity = true;
				}
				uiTermObj.id = id;
				uiTermObj.label = term.getLabel();
				uiTermObj.type = term.getDataObjectType();
				transFormedTerms.push(uiTermObj);
			}

			return transFormedTerms;
		};

		AutoComplete.prototype._transformOperatorsToUiModel = function (operator) {
			var transFormedOperators = {}
			transFormedOperators.name = operator.getName();
			transFormedOperators.label = operator.getLabel()

			return transFormedOperators;
		};

		AutoComplete.prototype._getCandidateName = function (oCandidate) {
			for (var oTokenName in astLibInstance.IDPLexer) {
				if (astLibInstance.IDPLexer[oTokenName] == oCandidate) {
					return oTokenName;
				}
			}
		};

		AutoComplete.prototype._catgorizeAggregate = function (aBusienssDataTypeList, oFunction, aDataObjectTypeList, oCategories,
			bIsResultContext) {
			for (var lBusinessDataListIterator = 0; lBusinessDataListIterator < aBusienssDataTypeList.length; lBusinessDataListIterator++) {
				if (this._checkBusinessDataTypeCompatibilityWithFunctionArgs(oFunction, aBusienssDataTypeList[lBusinessDataListIterator])) {
					for (var lDataObjectListIterator = 0; lDataObjectListIterator < aDataObjectTypeList.length; lDataObjectListIterator++) {
						if (this._checkDataObjectCompatibilityWithFunctionArgs(oFunction, aDataObjectTypeList[lDataObjectListIterator])) {
							this._categorizeFunctions(oFunction, oCategories["functions"], bIsResultContext);
						}
					}
				}
			}
		};

		AutoComplete.prototype._categorizeFunctionGivenDataObjectList = function (oFunction, aDataObjectTypeList, oCategories, bIsResultContext) {
			for (var lDataObjectListIterator = 0; lDataObjectListIterator < aDataObjectTypeList.length; lDataObjectListIterator++) {
				if ("getProbableDataObjectTypeList" in oFunction && oFunction.getProbableDataObjectTypeList() && oFunction.getProbableDataObjectTypeList()
					.indexOf(
						aDataObjectTypeList[lDataObjectListIterator]) !== -1) {
					this._categorizeFunctions(oFunction, oCategories["functions"], bIsResultContext);
				}
			}
		}

		AutoComplete.prototype._categorizeFunctionsWhenPreviousNodeIsOperator = function (oTopNode, aAllFunctions, oTopStack, oCategories,
			bIsResultContext) {
			var aBusienssDataTypeList = [];
			var aDataObjectTypeList = [];
			var oPreviousNode = this._getNodeRecursively(oTopNode.getPrevious());
			var oFunction;
			var lastFunctionalStack = this._getLastFunctionStack();

			if (oPreviousNode) {
			    if (oTopNode && "getProbableBusinessDataReturnTypeList" in oTopNode) {
                    aBusienssDataTypeList = oTopNode.getProbableBusinessDataReturnTypeList();
                } else if ("getBusinessDataType" in oPreviousNode) {
                    aBusienssDataTypeList.push(oPreviousNode.getBusinessDataType());
                }

                if (aBusienssDataTypeList === undefined || aBusienssDataTypeList === null || aBusienssDataTypeList.length == 0) {
                    if ("getBusinessDataType" in oPreviousNode) {
                        aBusienssDataTypeList = [];
                        aBusienssDataTypeList.push(oPreviousNode.getBusinessDataType());
                    }
                }

                if (oTopNode && "getProbableDataObjectReturnTypeList" in oTopNode) {
                    aDataObjectTypeList = oTopNode.getProbableDataObjectReturnTypeList();

                } else if ("getDataObjectType" in oPreviousNode) {
                    aDataObjectTypeList.push(oPreviousNode.getDataObjectType());
                }

                if (aDataObjectTypeList === undefined || aDataObjectTypeList === null || aDataObjectTypeList.length == 0) {
                    if ("getDataObjectType" in oPreviousNode) {
                        aDataObjectTypeList = [];
                        aDataObjectTypeList.push(oPreviousNode.getDataObjectType());
                    }
                }
				if (aBusienssDataTypeList.length > 0 || aDataObjectTypeList.length > 0) {
					for (var lIndex = 0; lIndex < aAllFunctions.length; lIndex++) {
						oFunction = aAllFunctions[lIndex];
						if (this._checkPreviousOperatorHasSupportedFunctions(oTopStack)) {
							if (this._checkOperatorCompatitbilityWithFunction(oFunction, oTopStack)) {
								this._categorizeFunctions(oFunction, oCategories["functions"], bIsResultContext);
							}
							// Blacklisting functions
						} else if (aBusienssDataTypeList == undefined || aBusienssDataTypeList.length == 0) {
							this._categorizeFunctionGivenDataObjectList(oFunction, aDataObjectTypeList, oCategories,
								bIsResultContext);
						} else if ((oFunction.getCategory().toUpperCase() == "SELECTION" || oFunction.getCategory().toUpperCase() == "AGGREGATE") && !(
								lastFunctionalStack && lastFunctionalStack.getFunction().getCategory() ==
								"operations" && lastFunctionalStack.getSize() != 2)) {
							this._categorizeFunctions(oFunction, oCategories["functions"], bIsResultContext);
						} else {
							this._categorizeFunctionGivenBusinessDataTypeAndDataObjectList(oFunction, aBusienssDataTypeList, aDataObjectTypeList, oCategories,
								bIsResultContext);
						}
					}
				} else {
					for (var lIndex = 0; lIndex < aAllFunctions.length; lIndex++) {
						oFunction = aAllFunctions[lIndex];
						this._categorizeFunctions(oFunction, oCategories["functions"], bIsResultContext);
					}
				}
			}

		};

		return AutoComplete;

	});

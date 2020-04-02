sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"./library",
	"sap/ui/core/Control",
	"sap/m/ResponsivePopover",
	"sap/m/List",
	"sap/ui/model/json/JSONModel",
	"sap/m/ListMode",
	"sap/m/PlacementType",
	"sap/m/StandardListItem",
	"sap/ui/core/CustomData",
	"sap/ui/model/Sorter",
	"sap/rules/ui/parser/infrastructure/util/utilsBase",
	"sap/rules/ui/services/AstExpressionLanguage",
	"sap/rules/ui/ExpressionAdvanced",
	"sap/rules/ui/AutoCompleteSuggestionContent",
	"sap/rules/ui/ExpressionBase",
	"sap/rules/ui/ast/constants/Constants",
	"sap/rules/ui/ast/util/AggregateFunctionDialog",
	"sap/rules/ui/ast/util/SelectFunctionDialog",
	"sap/rules/ui/ast/provider/TermsProvider",
	"sap/rules/ui/ast/parser/bundlelibrary",
	"sap/ui/core/LocaleData"
], function (jQuery, library, Control, ResponsivePopover, List, JSONModel, ListMode, PlacementType, StandardListItem, CustomData, Sorter,
	infraUtils, AstExpressionLanguage, ExpressionAdvanced, AutoCompleteSuggestionContent, ExpressionBase, Constants, AggregateFunctionDialog,
	SelectFunctionDialog, TermsProvider, astBundleLibrary, LocaleData) {
	"use strict";

	var AstExpressionBasic = ExpressionBase.extend("sap.rules.ui.AstExpressionBasic", {
		metadata: {
			properties: {
				library: "sap.rules.ui",
				value: {
					type: "string",
					defaultValue: ""
				},
				dataObjectInfo: {
					type: "string",
					bindable: "bindable",
					defaultValue: ""
				},
				resultDataObjectId: {
					type: "string",
					defaultValue: ""
				},
				conditionContext: {
					type: "boolean",
					defaultValue: false
				},
				operationsContext: {
					type: "boolean",
					defaultValue: false
				},
				jsonData: {
					type: "array",
					bindable: "bindable",
					defaultValue: []
				},
				//property for the vocabulary in Aggregate Function
				enableAggregateFunctionVocabulary: {
					type: "boolean",
					defaultValue: false
				},
				//property for the where in Aggregate Function
				enableAggregateFunctionWhereClause: {
					type: "boolean",
					defaultValue: false
				},

				isAttributeContext: {
					type: "boolean",
					defaultValue: false
				},
				countFunctionSelected: {
					type: "boolean",
					defaultValue: false
				},
				placeholder: {
					type: "string",
					defaultValue: ""
				},
				//property to allow the Association Context
				isAssociationContext: {
					type: "boolean",
					defaultValue: false
				}
			},
			aggregations: {

			},
			events: {

				/**
				 * This event is fired when the text in the input field has changed and the focus leaves the input field or the enter key is pressed.
				 */
				"change": {},

				/**
				 * This event is fired when the value of the input is changed - e.g. at each keypress
				 */
				"liveChange": {}
			}
		},

		init: function () {
			this.infraUtils = new sap.rules.ui.parser.infrastructure.util.utilsBase.lib.utilsBaseLib();
			this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
			this.aggregateFunctionCallBack = jQuery.proxy(this._updateAggregateFunction, this);
			this.functionCallBack = jQuery.proxy(this._updateSelectFunction, this);
			this._reference = jQuery.proxy(this.callback, this);
			this._isDialogOpenedCallbackReference = jQuery.proxy(this.isDialogOpenedCallback, this);
			this._uiModel = [];
			this._cursorPostion = 0;
			this._selectedSpans = null;
			this._hasTextContent = false;
			this._createPopver();
			this._attributeContext = false;
			this._bCtrlSpacePressed = false; // To identify if Ctrl+space has been pressed
			this.bShiftPressed = false; //To identify Shift key is pressed or not
			this.shiftKey = ""; //By default setting it to empty string
			this.isDialogOpen = false;
			this._focusedOut = false;
			this._jsonArray = [];
			this.functionClicked = false;
			this.isAutoSuggestionRequired = true;
			this.isDotRequired = true; //For adding dot when its a relative path
			this.aggregateFunctionDialog = AggregateFunctionDialog.getInstance();
			this.selectFunctionDialog = SelectFunctionDialog.getInstance();
			this.astLibInstance = astBundleLibrary.getInstance();
			this.bTypingFlow = false; //Flag to know ctrl+space or typing
			this.bEditInBetween = false; //Flag to know if cursor is in between
			this.nIndexOfToken = 0; //For keeping note of span position while editing in between
			this.tempRelString = ""; //For constructing rel string till cursor position while editing in between
			this.filterText = "";
			this.filterTextLength = 0; // For finding cursor position inside the current span
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribeOnce("sap.ui.rules","_onHiddenSelected",this._hiddenAccessModeSelected,this);
		},

		onBeforeRendering: function () {
			this._enableAggregateFunctionVocabulary = this.getEnableAggregateFunctionVocabulary();
			this._enableAggregateFunctionWhereClause = this.getEnableAggregateFunctionWhereClause();
			this.isCountFunctionSelected = this.getCountFunctionSelected();
		},

		callback: function (oEvent, oContext) {
			this._setTextOnCursorPosition(oEvent);
		},

		isDialogOpenedCallback: function (isOpen) {
			this.isDialogOpen = isOpen;
			if (!isOpen) {
				this.functionClicked = false;
			}
		},
		// O - Object, L - literal, F - function, A - Auxilary Node -temporary

		/*Here, we read the ast nodes saved and convert it into an id based string 
		 *and set the value to the expressionbasic
		 * -Called either during first load and after every _fireChange call
		 */
		onAfterRendering: function () {
			this.referenceId = "";
			this.isAutoSuggestionRequired = true;
			this.dotInOperationsContext = false;
			this._oAstExpressionLanguage = sap.ui.getCore().byId(this.getAstExpressionLanguage());
			this._input = this.$("input");
			this._validateControl();
			this._input[0].contentEditable = this.getEditable();
			this._input[0].classList.add("sapAstExpressionInput");
			if (!this.getEditable()) {
				this._input[0].classList.add("sapAstExpressionInputNotEditable");
			} else {
				this._input[0].classList.remove("sapAstExpressionInputNotEditable");
			}

			if (this.aCustomStyleClasses && this.aCustomStyleClasses.length > 0) {
				this._input[0].classList.add(this.aCustomStyleClasses[0]);
			}

			if (this.getJsonData()) {
				this._jsonArray = this.getJsonData();
			}

			if (this.getValue() && this.getValue().trim()) {
				var markerString = this.markerString ? this.markerString.trim() : "";
				if (markerString === this.getValue()) {
					this.setValue("");
				}
				this._uiModel = this._convertInputToUiModel(this.getValue());
				this._uiModelToSpan(this._uiModel);
				this._selectedSpans = [];
				this._selectedSpans.push(this._input.children()[this._input.children().length - 1]);
				//On Rendering the Select or Aggregate function we should add a space at the end. 
				//We should not add space at end if last token in undefined token for free flow
				// and if the last span ends with dot
				if (!this.bTypingFlow && this._selectedSpans[0] && !this._selectedSpans[0].textContent.endsWith(Constants.DOT) && this._selectedSpans[
						0].getAttribute(Constants.TOKEN_TYPE) !== Constants.WS && this._selectedSpans[0].getAttribute(Constants.TOKEN_TYPE) !==
					Constants.UNDEFINED && !this.dotInOperationsContext && !(this._enableAggregateFunctionVocabulary && this.isCountFunctionSelected &&
						this._jsonArray.length === 0)) {
					this._createSpaceSpanItem();
				}
				this.bTypingFlow = false;
				if (!this.dataObjectInfo) {
					this.dataObjectInfo = this.getDataObjectInfo() + this.relString;
				}
				this._hasTextContent = true;
			} else {
				this.relString = "";
				this._uiModel = [];
				this._uiModelToSpan(this._uiModel);
				this.dataObjectInfo = "";
			}
			//In DT when opening cells, the cursorPosition= 1. Setting it to text length
			this._cursorPostion = this._getCaretPosition();
			this._setCurrentCursorPosition(this._cursorPostion);
			this._setUpEventHandlers();

		},

		/* we get input text as 1 + ./id/id. 
		 * We convert this to tokens and pass it on to convert to uiModel
		 */
		_convertInputToUiModel: function (inputText) {
			if (inputText) {
				this.astNodesString = this._oAstExpressionLanguage.getAstNodesString(inputText);
				this.relString = this._oAstExpressionLanguage.getRelStringForGivenAstString(this.astNodesString).relString;
				this._tokens = this._oAstExpressionLanguage.getTokensForGivenStringInput(inputText);
				//tostring is used for the nested Select where each where clause is send to the toString and get the json Array.
				try {
					this.astresponseNodes = JSON.parse(this.astNodesString);
				} catch (e) {
					jQuery.sap.log.error("Error in parsing string to JSON: " + e.message);
				}
				if (this.astresponseNodes && this.astresponseNodes[0] && (this.astresponseNodes[0].Function || (this.astresponseNodes[0].Type &&
						this.astresponseNodes[0].Type !== "I"))) {
					this.displayString = this._oAstExpressionLanguage._astBunldeInstance.ASTUtil.toAstExpressionString(astNodes);
					this._jsonArray = this.displayString.JSON;
				}
				return this._oAstExpressionLanguage.convertTokensToUiModel(this._tokens, this._jsonArray);
			}
			return [];

		},

		/* tokens would have text as Customer.Name. For processing, we will need id based expressions
		 * Hence, we go through every token and construct an id based string. 
		 * Example: tokens are 1, space, Customer.Name, space, =, 'abc'
		 * Expression returned by this function will be "1 ./id/id = 'abc'"
		 */
		_generateIDStringFromUIModel: function () {
			var idString = "";
			for (var token in this._uiModel) {
				if (this._uiModel[token].reference !== null) {
					if (this._uiModel[token].text.length > 0) {
						idString = idString + this._uiModel[token].reference;
					}
				} else {
					idString = idString + this._uiModel[token].text;
				}
			}
			return idString;
		},

		/* UImodel already has all the required tokens. 
		 * We generate id based rel string such as "1 ./id/id = 'abc'"
		 * If it is in an attribute context, we let the autocomplete util know by setting the property to true
		 * This utility now returns the relevant autosuggestions for the passed uimodel and attribute context
		 */
		_getSuggestionsForTheGivenInput: function (inputText) {
			var _attributeContext = this._attributeContext;
			var _operationsContext = false;
			var _addDotToSuggestions = false;
			var _associationContext = this.getIsAssociationContext();
			//For Where Clause in FunctionDialog.
			if (this.getDataObjectInfo() && !this.functionClicked && !this.bEditInBetween) {
				inputText = this.dataObjectInfo;

			}
			//Getting header context for condition decision table cell
			if (this.getHeaderInfo() && this.getHeaderInfo().headerValue) {
				inputText = this.getHeaderInfo().headerValue + " " + inputText;
			}
			//Support for value help on the result section
			if (this.getAttributeInfo() && inputText === "") {
				inputText = this.getAttributeInfo() + " " + Constants.EQUAL + " ";
			}
			if (!this._oAstExpressionLanguage) {
				this._oAstExpressionLanguage = sap.ui.getCore().byId(this.getAstExpressionLanguage());
			}
			if (this.getDataObjectInfo() && this.getIsAttributeContext()) {
				_attributeContext = this.getIsAttributeContext();
				//Replace the . in the inputText as the attribute is combined with dataObject.
				inputText = inputText.replace(/\./g, "");
			}
			if (this.isCountFunctionSelected) {
				_attributeContext = false;
				_associationContext = true;
			}

			/* enable operations only when:
			1. Only when no default result is set
			2. Only in the result section
			3. Only in the beginning of the expression 
			4. Only for text rule*/
			if (this.getOperationsContext() && !this._enableAggregateFunctionVocabulary) {
				_operationsContext = true;
			}
			// !this.getResultDataObjectId()  && inputText !== "" && !this.getConditionContext()
			if (this.getOperationsContext() && inputText !== "") {
				if (this.dotInOperationsContext && this._selectedSpans[0] && this._selectedSpans[0].textContent.endsWith(Constants.DOT)) {
					_attributeContext = true;
				} else if (this._isFirstTokenAnOperation() && this._selectedSpans[0].textContent === " " + Constants.DOT) {
                    _attributeContext = true;
                    inputText = inputText.trim();
                } else if (!_attributeContext) {
					_attributeContext = false;
					_addDotToSuggestions = this._addDotToMiscellaneousSuggestions();
				}
			}

			var tokens = this._oAstExpressionLanguage.getTokensForGivenStringInput(inputText);
			var uiModel = this._oAstExpressionLanguage.convertTokensToUiModelForAutoSuggestion(tokens);
			var suggestionContext = {};
			suggestionContext.AttributeContext = _attributeContext;
			suggestionContext.OperationsContext = _operationsContext;
			suggestionContext.AssociationContext = _associationContext;
			var suggestions = this._oAstExpressionLanguage.getSuggesstions(uiModel, suggestionContext);
			if (_addDotToSuggestions) {
				var dotObj = {
					name: Constants.DOT,
					label: this.oBundle.getText("DOTLABEL")
				};
				suggestions.autoComplete.categories.operators = suggestions.autoComplete.categories.operators ? suggestions.autoComplete.categories
					.operators : {};
				var operatorslist = suggestions.autoComplete.categories.operators;
				if (!("miscellaneous" in operatorslist)) {
					operatorslist.miscellaneous = [];
				}
				operatorslist.miscellaneous.push(dotObj);

			}
			//Moving businessDatype inside autoComplete to cause less impact - need to be changed at the end
			suggestions.autoComplete.businessDataTypeList = suggestions.businessDataTypeList;
			return suggestions;
		},

		//Reads the text till cursor position , filters and returns suggestion list
		_getSuggestionsForEditedInput: function (bFilter) {
			this.tempRelString = this._cursorPostion === 0 ? "" : this._calculateStringAndIndexOfNewToken();
			if (this._enableAggregateFunctionWhereClause) {
                this.tempRelString = this.getDataObjectInfo() + this.tempRelString;
            }
            var tokens = this._oAstExpressionLanguage.getTokensForGivenStringInput(this.tempRelString);
            var autoSuggestionInput = this._getStringForFilterAndTempRelString(tokens);
			this._suggestionsList = this._getSuggestionsForTheGivenInput(autoSuggestionInput.tempRelString);
			if (bFilter) {
				var sTextForfilter = autoSuggestionInput.filterText;
                var aFilteredSuggestions = this._filterSuggestionList(sTextForfilter);
                if (aFilteredSuggestions.hasSuggestions) {
                    this._suggestionsList = aFilteredSuggestions;
                }
			}
			if (!bFilter && autoSuggestionInput.filterText) {
				var termId = this._getTermIdForTheGivenText(autoSuggestionInput.filterText);
				var referenceFilterString = autoSuggestionInput.tempRelString + termId;
				this._suggestionsList = this._getSuggestionsForTheGivenInput(referenceFilterString);
			}
		},

		_addDotToMiscellaneousSuggestions: function () {
			if (this._uiModel && this._uiModel[0] && "getText" in this._uiModel[0] && (this._uiModel[0].getText().toUpperCase() === Constants.UPDATE)) {
				var uiModelLength = this._uiModel.length;
				var lastToken = this._uiModel[uiModelLength - 1];
				if (this.bEditInBetween && this.nIndexOfToken) {
					lastToken = this._uiModel[this.nIndexOfToken];
				}
				var lastTermDOType = lastToken.dataObjectType;
				var lastTerm = lastToken.getReference();
				var lastTermSplitArray = lastTerm ? lastTerm.split("/") : [];
				if (!lastTerm) {
					return false;
				}
				if (lastTermDOType === Constants.ASSOCIATIONDOTYPE) {
					return true;
				} else if (lastTermSplitArray && lastTermSplitArray.length > 2) {
					return false;
				} else {
					lastTerm = lastTermSplitArray[1];
					lastTerm = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider.getTermByTermId(lastTerm);
					if (lastTerm && lastTerm._isDataObjectElement) {
						return false;
					} else {
						return true;
					}
				}
			}
			return false;
		},

		_constructExpandedRelString: function (jsonData) {
			var attribute = "";
			if (jsonData.function === Constants.AVG || jsonData.function === Constants.SUM || jsonData.function === Constants.MIN || jsonData.function ===
				Constants.MAX) {
				attribute = this._hasAssociationId(jsonData.vocabulary, jsonData.function) ? this._returnAttributeBasedOnCardinality(jsonData.vocabulary) :
					this._fetchAttributes(
						jsonData.vocabulary);
				return jsonData.function+"(" + this.getTable(jsonData) + "," + attribute + this.getGroupByAttributes(jsonData.groupBy) + ")";
			} else if (jsonData.function === Constants.COUNTDISTINCT || jsonData.function === Constants.DISTINCT) {
				attribute = this._hasAssociationId(jsonData.vocabulary, jsonData.function) ? this._returnAttributeBasedOnCardinality(jsonData.vocabulary) :
					this._fetchAttributes(
						jsonData.vocabulary);
				return jsonData.function+"(" + this.getTable(jsonData) + "," + attribute + ")";
			} else if (jsonData.function === Constants.COUNT) {
				return jsonData.function+"(" + this.getTable(jsonData) + this.getGroupByAttributes(jsonData.groupBy) + ")";
			} else if (jsonData.function === Constants.TOP || jsonData.function === Constants.BOTTOM || jsonData.function === Constants.SELECT || jsonData.function === Constants.FIRST) {
				return this._constructExpandedRelStringForSelect(jsonData);
			}
		},

		_getAttributesSelectQuery: function (jsonData) {
			var str = ",";
			var sAttributes = "";
			if (jsonData && !jQuery.isEmptyObject(jsonData.attributes)) {
				for (var key in jsonData.attributes) {
					sAttributes += str + key;
				}
			}
			return sAttributes;
		},

		_constructSelectQuery: function (jsonData) {
			var dataObjectInfo = "";
			if (jsonData.doVocabId) {
				dataObjectInfo = jsonData.doVocabId;
			} else {
				dataObjectInfo = jsonData.dataObject;
			}
			if (this._getAttributesSelectQuery(jsonData)) {
				return Constants.SELECT + "(" + this._constructSortQuery(jsonData) + this._getAttributesSelectQuery(jsonData) + ")";
			} else if (jsonData.filter) {
				return Constants.FILTER + "(" + dataObjectInfo + "," + jsonData.filter + ")"
			} else {
				return dataObjectInfo;
			}
		},

		_constructSortQuery: function (jsonData) {
			var query = "";
			var dataObjectInfo = "";
			if (jsonData.doVocabId) {
				dataObjectInfo = jsonData.doVocabId;
			} else {
				dataObjectInfo = jsonData.dataObject;
			}
			if (!jsonData.filter) {
				query = dataObjectInfo;
			} else {
				query = Constants.FILTER + "(" + dataObjectInfo + "," + jsonData.filter + ")";
			}
			if (!jQuery.isEmptyObject(jsonData.attributes)) {
				for (var key in jsonData.attributes) {
					if (jsonData.attributes[key] !== Constants.NOSORT) {
						query = jsonData.attributes[key] + "(" + query + "," + key + ")";
					}
				}
			}
			return query;
		},

		_constructExpandedRelStringForSelect: function (jsonData) {
			if (jsonData.function === Constants.TOP || jsonData.function === Constants.BOTTOM) {
				return jsonData.function+"(" + this._constructSelectQuery(jsonData) + "," + jsonData.count + ")";
			} else if (jsonData.function === Constants.SELECT) {
				return this._constructSelectQuery(jsonData);
			} else if (jsonData.function === Constants.FIRST) {
                return jsonData.function + "(" + this._constructSelectQuery(jsonData) + ")";
            }
		},

		getTable: function (jsonData) {
			var dataObjetcInfo = jsonData.dataObject;
			if (this._hasAssociationId(jsonData.vocabulary, jsonData.function)) {
				dataObjetcInfo = this._returnDataObjectBasedOnCardinality(jsonData.vocabulary);
			}
			if (!jsonData.filter && (typeof jsonData.vocabulary === "object" || jsonData.vocabulary instanceof Object)) {
				return this._constructExpandedRelStringForSelect(jsonData.vocabulary);
			} else if (jsonData.filter && (typeof jsonData.vocabulary === "object" || jsonData.vocabulary instanceof Object)) {
				return Constants.FILTER + "(" + this._constructExpandedRelStringForSelect(jsonData.vocabulary) + "," + jsonData.filter + ")";
			} else if (!jsonData.filter) {
				return dataObjetcInfo;
			} else {
				return Constants.FILTER + "(" + dataObjetcInfo + "," + jsonData.filter + ")";
			}
		},

		_hasAssociationId: function (vocabId, functionSelected) {
			var vocabularyId = "";
			if ((typeof vocabId === "object" || vocabId instanceof Object)) {
				if (vocabId && vocabId.attributes) {
					for (var key in vocabId.attributes) {
						vocabularyId = vocabId.doVocabId + key.replace(Constants.DOT, "");
						break;
					}
				}
			} else {
				vocabularyId = vocabId;
			}
			if (vocabularyId) {
				var splitArray = vocabularyId.split("/");
				var vocabulary = splitArray[1];
				if (functionSelected === Constants.COUNT && splitArray.length > 2) {
					for (var iterator = 2; iterator < splitArray.length; iterator++) {
						vocabulary += Constants.DOT + splitArray[iterator];
					}
				} else if (splitArray.length > 3) {
					for (var iterator = 2; iterator < splitArray.length - 1; iterator++) {
						vocabulary += Constants.DOT + splitArray[iterator];
					}
				}
				if (this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider.getTermByTermId(vocabulary) && this._oAstExpressionLanguage
					._astBunldeInstance.TermsProvider.TermsProvider.getTermByTermId(vocabulary)._dataObjectType ===
					"AO") {
					return true;
				}
			}
			return false;
		},

		_returnAttributeBasedOnCardinality: function (vocabId) {
			var vocabularyId = "";
			if ((typeof vocabId === "object" || vocabId instanceof Object)) {
				if (vocabId && vocabId.attributes) {
					for (var key in vocabId.attributes) {
						vocabularyId = vocabId.doVocabId + key.replace(Constants.DOT, "");
						break;
					}
				}
			} else {
				vocabularyId = vocabId;
			}
			if (vocabularyId) {
				var aSplitArray = vocabularyId.split("/");
				var str = aSplitArray[1];
				var index = 0;
				var term;
				var association = "";
				if (aSplitArray.length > 2) {
					for (var iterator = 2; iterator < aSplitArray.length; iterator++) {
						str += Constants.DOT + aSplitArray[iterator];
						term = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider.getTermByTermId(str);
						if (term && term._dataObjectType === "AO" && term._cardinality === "1..n") {
							index = iterator;
						}
					}
					if (index > 0) {
						for (var iterator = index + 1; iterator < aSplitArray.length; iterator++) {
							association += "/" + aSplitArray[iterator];
						}
					}
					if (index === 0) {
						for (var iterator = 2; iterator < aSplitArray.length; iterator++) {
							association += "/" + aSplitArray[iterator];
						}
					}
				}
				if (association) {
					return Constants.DOT + association;
				} else {
					return "./" + aSplitArray[aSplitArray.length - 1];
				}
			}
		},

		_returnDataObjectBasedOnCardinality: function (vocabId) {
			var vocabularyId = "";
			if ((typeof vocabId === "object" || vocabId instanceof Object)) {
				if (vocabId && vocabId.attributes) {
					for (var key in vocabId.attributes) {
						vocabularyId = vocabId.doVocabId + key.replace(Constants.DOT, "");
						break;
					}
				}
			} else {
				vocabularyId = vocabId;
			}
			if (vocabularyId) {
				var aSplitArray = vocabularyId.split("/");
				var str = aSplitArray[1];
				var index = 0;
				var term;
				var association = "";
				if (aSplitArray.length > 2) {
					for (var iterator = 2; iterator < aSplitArray.length; iterator++) {
						str += Constants.DOT + aSplitArray[iterator];
						term = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider.getTermByTermId(str);
						if (term && term._dataObjectType === "AO" && term._cardinality === "1..n") {
							index = iterator;
						}
					}
					if (index > 0) {
						for (var iterator = 1; iterator <= index; iterator++) {
							association += "/" + aSplitArray[iterator];
						}
					}
				}
				if (association) {
					return association;
				} else {
					return "/" + aSplitArray[1];
				}
			}
		},

		getGroupByAttributes: function (groupBy) {
			var str = ",";
			var groupByString = "";
			if (groupBy && groupBy.length > 0) {
				for (var i = 0; i < groupBy.length; i++) {
					groupByString += (str + groupBy[i]);
				}
			}
			return groupByString;
		},

		_fetchAttributes: function (vocabulary) {
			if (typeof vocabulary === "string" || vocabulary instanceof String) {
				var splitIdArray = vocabulary.split("/");
				var str = "";
				if (splitIdArray.length > 3) {
					for (var i = 2; i < splitIdArray.length; i++) {
						str += "/" + splitIdArray[i];
					}
					return Constants.DOT + str;
				} else {
					return "./" + splitIdArray[2];
				}
			} else if (Object.keys(vocabulary.attributes).length === 1) {
				for (var key in vocabulary.attributes) {
					return key;
				}
			} else {
				//throw error;
			}
		},

		/*
		 * id will be generated for every span item
		 */
		_createUUID: function () {
			return this.infraUtils.createUUID();
		},

		/* we need to deal with ids only. 
		 * The span would have the text ./id/id
		 * In this function, we pass the reference id to get the string and add to UI
		 *  Now, this text will have Customer.Name and update the span item's text and reference information
		 *  Add relevant information and create a span item in the UI
		 */
		_createSpanItem: function (oItem) {
			var parentId = this.getId();
			this.ruleWithElementDO = false;
			if (oItem.tokenType === Constants.TERM) {
				this.termsProvider = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider;
				var termId = oItem.reference.split("/")[1];
				var term = this.termsProvider.getTermByTermId(termId);
				if (term && term.Type === "Rule" && term.ResultDataObjectId !== "" && term.ResultDataObjectId !== undefined) {
					var elementTerm = this.termsProvider.getTermByTermId(term.ResultDataObjectId);
					if (elementTerm && elementTerm.getIsDataObjectElement()) {
						term = elementTerm;
						this.ruleWithElementDO = true;
					}

				}
				//Set Dataobject name for element DO abd for rule with ElementDO
				if (term && oItem && (term._isDataObjectElement || oItem.dataObjectType === "ruleWithElementDO")) {
					termId = "/" + termId;
				} else {
					termId = oItem.reference;
				}
				var objectFromReference = this.termsProvider.getTermNameFromASTNodeReference(termId);

				if (objectFromReference) {
					if ("dataObjectType" in oItem && oItem.dataObjectType != Constants.Element && !this.isCountFunctionSelected && !this.ruleWithElementDO) {
						oItem.text = objectFromReference;
						if (this._addDotToReferenceText(oItem)) {
							oItem.text = objectFromReference + Constants.DOT;
						}
					} else if ((oItem.resultDataObjectId !== "" && oItem.resultDataObjectId !== undefined && !this.ruleWithElementDO) || (oItem.tokenType ===
							Constants.TERM && oItem.dataObjectType != Constants.Element && !this.ruleWithElementDO && !this.isCountFunctionSelected)) {
						oItem.text = objectFromReference;
						if (this._addDotToReferenceText(oItem)) {
							oItem.text = objectFromReference + Constants.DOT;
						}
					} else {
						oItem.text = objectFromReference;
					}
				}
			}

			if (oItem.tokenType === Constants.FUNCTION && oItem.json) {
				this.termsProvider = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider;
				var objectFromReference = this.termsProvider.getTermNameFromASTNodeReference(oItem.json.dataObject);
				oItem.text = oItem.text.replace(oItem.json.dataObject, objectFromReference)
			}
			//During typing oItem.text will have date/timestamp in UTC format instead of locale format
			if (oItem.tokenType === Constants.DATEBUSINESSDATATYPE || oItem.tokenType === Constants.TIMEBUSINESSDATATYPE) {
				var formatter = this._getDateTimeFormatter(oItem.tokenType);
				oItem.text = "'" + formatter.format(new Date(oItem.text.replace(/\'/g, ""))) + "'";
			}

			// TODO: debug and change later. check if this handling is necessary
			// handling cases where two spaces
			// commenting it as it not allowing to add spaces
			// if (oItem.text === "  ") {
			// 	oItem.text = " ";
			// }
			var itemId = oItem.id.replace("/", "");
			var oNewItemSpan = jQuery('<span>', {
				id: parentId + "-" + itemId,
				class: oItem.cssClass,
				reference: oItem.reference,
				resultDataObjectId: oItem.resultDataObjectId,
				json: JSON.stringify(oItem.json),
				tokenType: oItem.tokenType
			})["text"](oItem.text);

			return oNewItemSpan;
		},

		//Returns date or time stamp formatter based on business data type
		_getDateTimeFormatter: function (tokenType) {
			var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
			var oLocaleData = LocaleData.getInstance(oLocale);
			if (tokenType === Constants.DATEBUSINESSDATATYPE) {
				var datePattern = oLocaleData.getDatePattern('medium');
				var dateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: datePattern
				});
				return dateFormatter;
			} else if (tokenType === Constants.TIMEBUSINESSDATATYPE) {
				var datePattern = oLocaleData.getDatePattern('medium');
				var timePattern = oLocaleData.getTimePattern('medium');
				var dateTimeFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: datePattern + " " + timePattern
				});
				return dateTimeFormatter;
			}
		},

		_isFirstTokenAnOperation: function () {
			if (this._uiModel && this._uiModel.length > 0 && "getText" in this._uiModel[0] && (this._uiModel[0].getText().toUpperCase() ===
				Constants.UPDATE || this._uiModel[0].getText().toUpperCase() === Constants.APPEND) && this._uiModel[0].getTokenType() === Constants.FUNCTION) {
				return true;
			}
			return false;
		},

		_addDotToReferenceText: function (oItem) {
			if (this._uiModel && this.nIndexOfToken && this._uiModel[this.nIndexOfToken] && this._uiModel[this.nIndexOfToken].startIndex !== oItem.startIndex) {
                return false;
            }
			var bOperationDot = this._isFirstTokenAnOperation() && this.dotInOperationsContext;
			if (bOperationDot || (!bOperationDot && this._attributeContext) || (!bOperationDot && oItem.dataObjectType === "AO") ||
				(!this._isFirstTokenAnOperation() && (oItem.dataObjectType === "S" || oItem.dataObjectType === "T"))) {
				this._attributeContext = true;
				return true;
			}
			return false;
		},

		/*
		 * Here, for every entry in the UIModel, we create a span item and add to UI
		 */
		_uiModelToSpan: function (uiModel) {
			var sText = "";
			var sHtml = "";
			for (var i = 0; i < uiModel.length; i++) {
				sHtml += this._createSpanItem(uiModel[i])[0].outerHTML;
			}
			this._input.html(sHtml);
			return sText;
		},

		_closeAutoSuggestionPopup: function () {
			if (this._oAutoSuggestionPopUp)
				this._oAutoSuggestionPopUp.close();
		},

		/*
		 * Event handlers defined for the user actions such as backspace, ctrl space, space, dot,
		 * focusout, click
		 */
		_setUpEventHandlers: function () {
			var that = this,
				$this = jQuery(this._input),
				keyCodes = [16, 17, 18, 93, 13, 9, 35, 36, 45, 34, 33, 40, 37, 38, 39, 27, 44, 145, 19, 112, 113, 114, 115, 116, 117, 118,
					119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135
				]; //Non printable keys refer https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode

			if (!this._focusedOut) {
				that._setCurrentCursorPosition(that._cursorPostion);
			}
			this._input.on('keydown', function (event) {
				//Handling for Arrow Up and Arrow Down to navigate to Autosuggest popup
				if (event.keyCode === 8 || event.keyCode == 46) { // BackSpace Keyup event handling 
					that._selectedSpans = that._getSelectedSpans();
					that._handleBackSpaceAndDeleteKey(event);
				} else if (event.keyCode === 40 || event.keyCode === 38) {
					that._handleArrowNavigation(event);
				} else if (event.key === "Control") {
					that.ctrlPressed = true;
				} else if (that.ctrlPressed && (event.keyCode === 32 || event.key === " ")) {
					that._initializeCursorSpan();
					that.ctrlPressed = false;
					that._bCtrlSpacePressed = true;
					//For where Clause
					if (!that.dataObjectInfo) {
						that.dataObjectInfo = that.getDataObjectInfo();
					}
					if (!that.relString) {
						that.relString = "";
					}
				} else if (event.key === "Shift") {
					that.bShiftPressed = true;
				} else if (that.bShiftPressed && keyCodes.indexOf(event.keyCode) === -1) {
					//Saving the printable key pressed with shift
					that.shiftKey = event.key;
					that.bShiftPressed = false;
				} else if (event.key === "Tab" || event.keyCode === 27) { 
					that._closeAutoSuggestionPopup();
				} else if (keyCodes.indexOf(event.keyCode) !== -1 && event.keyCode !== 35 && event.keyCode !== 36 && event.keyCode !== 37 &&
					event.keyCode !== 39) { //Keys in order: End, Home, Arrow Left, Arrow Right
					event.preventDefault();
				}
			});

			this._input.on("click", function (event) {
				that.ctrlPressed = false;
				that.forceFireChange = false;
				that._initializeCursorSpan();
				var json;
				if (!that.getEditable()) {
					return;
				}
				if (that._selectedSpans && that._selectedSpans[0] && that._selectedSpans[0].getAttribute(Constants.JSON)) {
					that.functionClicked = true;
					var _suggestionsList = that._getSuggestionsForTheGivenInput(that._contextForPerviousSpans(that._selectedSpans));
					that.isDialogOpen = true;
					try {
						json = JSON.parse(that._selectedSpans[0].getAttribute(Constants.JSON));
						if (json.function === Constants.TOP || json.function === Constants.BOTTOM || json.function === Constants.SELECT || json.function === Constants.FIRST) {
							that.selectFunctionDialog._createSelectFunctionDialog(_suggestionsList.autoComplete.categories.functions, that.functionCallBack,
								that._oAstExpressionLanguage, that._isDialogOpenedCallbackReference, json);
						} else {
							json.selectExpression = typeof json.vocabulary === "object" || json.vocabulary instanceof Object ? that._constructExpandedRelStringForSelect(
								json.vocabulary) : "";
							that.aggregateFunctionDialog._createAggregationFunctionDialog(_suggestionsList.autoComplete.categories.functions, that.aggregateFunctionCallBack,
								that._oAstExpressionLanguage, that._isDialogOpenedCallbackReference, json);
						}
					} catch (e) {
						jQuery.sap.log.error("Error in parsing string to JSON: " + e.message);
					}
				}

				that._closeAutoSuggestionPopup();
			});

			this._input.on('keyup', function (event) {
				var context = jQuery(this);
				var bPrintable = false;

				if (event.keyCode == 8 || event.keyCode == 46) {
					that._updateUiModel();
					that._calculateStringAndIndexOfNewToken();
				}

				that._initializeCursorSpan();
				//For where Clause
				if (!that.dataObjectInfo) {
					that.dataObjectInfo = that.getDataObjectInfo();
				}

				//After space keyup, this is needed, else it continues
				// till _handleKeyUpEvent and closes the autosuggestion
				if (event.key === "Control" || event.keyCode === 35 || event.keyCode === 36 || event.keyCode === 37 || event.keyCode === 39) {
					return;
				}

				//When pressed in between text
				if (that.bEditInBetween) {
					that.bTypingFlow = !that._bCtrlSpacePressed;
					that._getSuggestionsForEditedInput(true);
				}

				if (that._bCtrlSpacePressed) {
					//When at end of input text
					if (!that.bEditInBetween) {
						that._suggestionsList = that._getSuggestionsForTheGivenInput(that.relString);
						var lastSpan = that._input.children()[that._input.children().length - 1];
						if (lastSpan) {
							that._selectedSpans = [];
							that._selectedSpans.push(lastSpan);
						}
					}
					if ((that._selectedSpans[0] && that._selectedSpans[0].getAttribute(Constants.TOKEN_TYPE) === Constants.UNDEFINED && that._selectedSpans[
							0].textContent.startsWith(Constants.SINGLE_QUOTE)) || (that._selectedSpans[0].className === "sapAstLiteralClass")) {
						that._suggestionsList.autoComplete.showLiteral = true;
						that._suggestionsList.autoComplete.literalInput = that._selectedSpans[0].textContent;
						// text replace of date and time -> same text when displayed saves as string, hence we show the reference value for user to change
						if (that._selectedSpans[0] && that._selectedSpans[0].getAttribute("reference")) {
							that._suggestionsList.autoComplete.literalInput = that._selectedSpans[0].getAttribute("reference");
						}
					}
					that._showAutoSuggestion(that._suggestionsList);
					that._bCtrlSpacePressed = false;
					return;
				}

				var lastText = context.data('before');
				var currentText = this.textContent;
				if (currentText && event.key !== " ") {
					currentText = currentText.trim();
				}
				if (lastText) {
					lastText = lastText.trim();
				}

				if (currentText !== lastText) {
					that.bTypingFlow = true;
					//needed when shift and some key has been keyed up at same time
					if (((event.keyCode !== 8 && event.keyCode !== 46) && keyCodes.indexOf(event.keyCode) === -1) || (event.key === "Shift" && that
							.shiftKey !== "")) {
						var key = event.key === "Shift" ? that.shiftKey : event.key;
						that._updateUIModelForFreeFlow(key);
						// Increment the token value when the user types space in freeflow only when not in literal or auxilary span
                        if (key === " " && ((that._selectedSpans[0].className !== "sapAstLiteralClass" && that._selectedSpans[0].className !==
                            "sapAstAuxilaryNodeClass") || (that._selectedSpans[0].className === "sapAstLiteralClass" && !(that.filterTextLength < that._selectedSpans[
                                0].textContent.length)))) {
							that.nIndexOfToken += 1;
							that._setCaretPosition({
						       spanIndex: that.nIndexOfToken ,
						       position: 0
					        });
						}
						bPrintable = true;
						that.shiftKey = "";
					}
					that._handleKeyUpEvent(currentText, event, bPrintable);
					context.data('before', currentText);
					that._bCtrlSpacePressed = false;
				}

			});

			this._input.on('focusout', function (event) {
				//Note: input considers opening suggestion pop up also as focusout event
				that._focusedOut = true;
				if (!that.isDialogOpen && !that._oAutoSuggestionPopUp.isOpen()) {
					that._validateControl();
				}
				//Closes autosuggest whenever we focus out of input as well as popup
				that._handlePopupFocusOut(event);
			});

			this._input.on('focus', function (event) {
				that._focusedOut = false;
				var element = jQuery(this);
				element.data('before', element.context.textContent);
			});
		},

		_handleBackSpaceAndDeleteKey: function (event) {
			var isDeleteKey = false;
			var that = this;
			if (event.keyCode == 46) {
				isDeleteKey = true;
			}
			//Attribute/Association level backspace
			that._calculateStringAndIndexOfNewToken();

			if (isDeleteKey && that.bEditInBetween && that._selectedSpans && "className" in that._selectedSpans[0] && (that._selectedSpans[0].className ==
				"sapAstAuxilaryNodeClass" && this._getFullTextContentLength() === this._cursorPostion)) {
				var tempSelectedSpan = that._getSelectedSpanGivenIndex(this.nIndexOfToken + 1);
				if (tempSelectedSpan && tempSelectedSpan[0] && tempSelectedSpan[0].className === "sapAstObjectClass") {
					that._selectedSpans = tempSelectedSpan;
					that._setCaretPosition({
						spanIndex: that.nIndexOfToken + 1,
						position: 0
					});
					that._calculateStringAndIndexOfNewToken();
				}
			}

			if (that._selectedSpans[0].className === "sapAstObjectClass") {
				var spanText = that._selectedSpans[0].textContent;
				var refArray = that._selectedSpans[0].getAttribute(Constants.REFERENCE).split("/");
				var reference = ""; //Calculate reference by remving last id
				var text = ""; //Calculate text by removing last attr/assoc
				var dotArray = spanText.split(Constants.DOT);
				var previousText = "";
				var referenceId = "";
				if ((that.filterTextLength > 0 && !isDeleteKey) || isDeleteKey) {
					for (var i = 1; i < refArray.length; i++) {
						previousText = text;
						text += dotArray[i - 1] + Constants.DOT;
						that._attributeContext = true;
						if (that.filterText.indexOf(text) >= 0 && (!(that.filterText == text) || (isDeleteKey && that.filterText == text))) { // check the filterText has text Calculated so far
                            reference += "/" + refArray[i];
							continue;
						} else {
							break;
						}
					}

					var termsProvider = TermsProvider.getInstance();
                    referenceId = reference.replace(/\//, "");
                    referenceId = referenceId.replace(/\//g, ".");
                    var term = termsProvider.getTermByTermId(referenceId);
                    if (term && term._dataObjectType === "AO" && that._enableAggregateFunctionWhereClause && !that.getIsAttributeContext()) {
                        reference = Constants.DOT + reference;
                        this.isDotRequired = false;
                    }
                    var cursorPostion = that._cursorPostion > 0 ? previousText.length : that._cursorPostion - that._selectedSpans[0].textContent.length -
						previousText.length;
					that._selectedSpans[0].textContent = previousText;
					that._setCaretPosition({
						spanIndex: that.nIndexOfToken,
						position: cursorPostion
					});
					that._selectedSpans[0].setAttribute(Constants.REFERENCE, reference);
					event.preventDefault();
					if (reference === "") {
						that._removeSpans();
						that.nIndexOfToken = that.nIndexOfToken > 0 ? that.nIndexOfToken - 1 : 0;
						that._selectedSpans = that._getSelectedSpanGivenIndex(this.nIndexOfToken);
						var nPosition = that._selectedSpans ? that._selectedSpans[0].textContent.length : 0;
                        that._setCaretPosition({
                            spanIndex: that.nIndexOfToken,
                            position: nPosition
                        });
					}
				}
			} else if (that._selectedSpans[0] && that.filterTextLength !== 0 && ((that._selectedSpans[0].className ===
					"sapAstFunctionClass" && that._selectedSpans[0].getAttribute(Constants.JSON)) || (that._selectedSpans[0].className ===
					"sapAstLiteralClass" && that._selectedSpans[0].textContent.startsWith("'") && that.bEditInBetween && that.filterTextLength ===
					that._selectedSpans[0].textContent.length))) {
				//Remove aggregate/select/string literals as a span
				that._removeSpans();
				that.nIndexOfToken = that.nIndexOfToken > 0 ? that.nIndexOfToken - 1 : 0;
				that._setCaretPosition({
						spanIndex: that.nIndexOfToken,
						position: that._cursorPostion
				});
				event.preventDefault();
			} else if (that._selectedSpans[0] && that._selectedSpans[0].getAttribute("class") === "sapAstLiteralClass" && (that._selectedSpans[
								0].getAttribute("tokentype") === "D" || that._selectedSpans[0].getAttribute("tokentype") === "T" || that._selectedSpans[0].getAttribute(
								"tokentype") === "U")) {
						that._removeSpans();
						that.nIndexOfToken = that.nIndexOfToken > 0 ? that.nIndexOfToken - 1 : 0;
						that._setCaretPosition({
							spanIndex: that.nIndexOfToken,
							position: that._cursorPostion
						});
			}
			that._updateUiModel();
		},

		/*Closes autosuggest whenever we focus out of input as well as popup based on related target
		 If related target is pointing to anything other than panel, list item or link, it closes the
		 autopopup
		 _fireChange is called only on focus out of ast control and suggestion popup also
		 */
		_handlePopupFocusOut: function (event) {
			var currentTarget = event.currentTarget.id;
			var relatedTarget = event.relatedTarget ? event.relatedTarget.id : null;
			var relatedTargetControl = sap.ui.getCore().byId(relatedTarget);
			var controlId = relatedTargetControl && relatedTargetControl.getParent() ? relatedTargetControl.getParent().getId() : "";
			if (relatedTarget && currentTarget !== relatedTarget) {
				if (!relatedTarget.startsWith("__item") && !relatedTarget.startsWith("__panel") && !relatedTarget.startsWith(
						"__link") && !relatedTarget.startsWith("__input") && !relatedTarget.startsWith("__popover") && !relatedTarget.startsWith(
						"content")) {
					this._closeAutoSuggestionPopup();
					this._fireChange(this.textContent);
				} else if (relatedTarget.startsWith("__item") && (controlId === "idPredefinedTable") || controlId.startsWith("__table")) {
					this._closeAutoSuggestionPopup();
					this._fireChange(this.textContent);
				}
			}
		},

		//Initialise span and cursor position
		_initializeCursorSpan: function () {
			this._selectedSpans = this._getSelectedSpans();
			this._cursorPostion = this._getCaretPosition();
			if (this._cursorPostion === 0) {
				this.filterTextLength = 0;
			}
			if (this._cursorPostion < this._input.text().length) {
				this.bEditInBetween = true;
				this._calculateStringAndIndexOfNewToken();
			} else {
				this.bEditInBetween = false;
				this.filterTextLength = this._selectedSpans[0].textContent.length;
				this.nIndexOfToken = this._input.children().length - 1;
			}
		},

		//Handling for Arrow Up and Arrow Down to navigate to Autosuggest popup
		_handleArrowNavigation: function (event) {
			event.preventDefault();
			this._bPopUpFocused = true;
			var oSuggestContent = this._oAutoSuggestionPopUp.getContent()[0];
			var firstItem = oSuggestContent.getAggregation("mainLayout").getItems()[0];
			//focus on first item
			$(firstItem).focus();
		},

		//Handles key up event
		//TODO: rename it appropriately
		_handleKeyUpEvent: function (currentText, event, bPrintable) {
			var that = this;
			var autoSuggestionInput;
			var tokens = this._oAstExpressionLanguage.getTokensForGivenStringInput(this._uiModeltoString());
			if (!this.bEditInBetween) {
				autoSuggestionInput = this._getStringForFilterAndTempRelString(tokens);
				if (event.keyCode === 8 || event.keyCode === 46) {
					this.dataObjectInfo = this.getDataObjectInfo() + autoSuggestionInput.tempRelString;
				}
			}
			//For aggreagate and select the prev tokens expands the dataobject info
			if (this._jsonArray.length > 0) {
				tokens = this._convertInputToUiModel(this.relString);
			}
			this._uiModel = that._oAstExpressionLanguage.convertTokensToUiModelForAutoSuggestion(tokens);
			this._uiModelToSpan(this._uiModel);
			this._uiModeltoString();
			this._getSelectedSpanFromIndex();

			if (!this._bCtrlSpacePressed && bPrintable && this.getDataObjectInfo() && tokens[tokens.length - 2].type !== this.astLibInstance.IDPParser
				.ALL_STRING) {
				this.dataObjectInfo = this.getDataObjectInfo() + autoSuggestionInput.tempRelString;
			}

			var cursorPosition = this.filterTextLength;
			if (this.bEditInBetween) {
				if (event.keyCode === 8 || event.keyCode === 46) {
					cursorPosition = this._cursorPostion === 0 && this.nIndexOfToken === 0 && this.filterTextLength > 0 ? 0 : this.filterTextLength;
				} else if (!this._uiModel[this.nIndexOfToken].text.endsWith(event.key) && (this._selectedSpans[0].className !==
						"sapAstLiteralClass") && (this._selectedSpans[0].className !== "")) {
					this.nIndexOfToken += 1;
					cursorPosition = 1;
				} else if (event.key === "'") {
					cursorPosition = 1; // Cursor should be within ''
				}
				this._getSelectedSpanFromIndex();

                if (event.key !== "'" && this._selectedSpans[0] && "className" in this._selectedSpans[0] && this._selectedSpans[0].className ===
                    "sapAstLiteralClass") {
                    cursorPosition = this.filterTextLength;
                }
			} else {
				this.nIndexOfToken = this._input.children().length - 1;
				cursorPosition = this._cursorPostion;
			}

			this._setCaretPosition({
				spanIndex: this.nIndexOfToken,
				position: cursorPosition,
				keyCode: event.keyCode
			});

			if (currentText !== "" && event.key !== 'Backspace') {
				var bExpanded = event.key !== " ";
				if (!this.bEditInBetween) {
					this._selectedSpans = [];
					this._selectedSpans.push(this._input.children()[this._input.children().length - 1]);
					this._suggestionsList = this._getSuggestionsForTheGivenInput(autoSuggestionInput.tempRelString);
					var sTextForfilter = autoSuggestionInput.filterText;
                    var aFilteredSuggestions = this._filterSuggestionList(sTextForfilter);
                    if (aFilteredSuggestions.hasSuggestions) {
                        this._suggestionsList = aFilteredSuggestions;
                    }
                    if (!aFilteredSuggestions.hasSuggestions && autoSuggestionInput.filterText) {
						var termId = this._getTermIdForTheGivenText(autoSuggestionInput.filterText);
						if (termId){
							var referenceFilterString = autoSuggestionInput.tempRelString + termId;
						    this._suggestionsList = this._getSuggestionsForTheGivenInput(referenceFilterString);
						} else {
							this._suggestionsList = aFilteredSuggestions;
						}
					}
					if (!(event.keyCode === 8 || event.keyCode === 46)) {
						this._showAutoSuggestion(this._suggestionsList, bExpanded);
					}
				}
				if (this._selectedSpans[0] && this._selectedSpans[0].className !== "" && this._selectedSpans[0].className !== "sapAstLiteralClass" || (this._selectedSpans[0] && this._selectedSpans[0].getAttribute(Constants.TOKEN_TYPE) ===
						Constants.UNDEFINED && !that._selectedSpans[
							0].textContent.startsWith(Constants.SINGLE_QUOTE))) {
					this._showAutoSuggestion(this._suggestionsList, bExpanded);
				}
			} else {
				this._closeAutoSuggestionPopup();
			}
		},
		
		// for a given text, we find out if it is a label or a name and return the corresponding id if matched
		_getTermIdForTheGivenText: function(sText) {
			var termsProvider = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider;
			var termByLabel = termsProvider.getTermByTermLabel(sText);
			var termId = "";
			if (termByLabel){
				termId = "/" + termByLabel._termId;
			} else {
				var termByName = termsProvider.getTermByTermName(sText);
				termId = termByName ? "/" + termByName._termId : "";
            }
            return termId;
		},

		/*
		 * oPosition.spanIndex :  Index of the span in input
		 * oPosition.position: Location of the cursor inside the span
		 * oPosition.keyCode: the key pressed
		 *
		 * The method either takes number or object as argument
		 * If number, the object is calculated based on input's children
		 * The spanindex and position are used for creating range and setting cursor position
		 * */
		_setCaretPosition: function (oPosition) {
			var oSelection = window.getSelection(),
				$input = this.$("input"),
				oContent, oRange, oItem, oFirstChild, iPosition = 0;

			var fnFindSpan = function (iPosition) {
				var aChildren = $input.children(),
					span, sSpanText, iLength = 0;

				for (var i = 0; i < aChildren.length; i++) {
					span = aChildren[i];
					sSpanText = span.innerText || "";
					if (iLength + sSpanText.length > iPosition) {
						return {
							spanIndex: i,
							position: iLength + sSpanText.length - iPosition
						};
					}
					iLength += sSpanText.length;
				}

				return {
					spanIndex: Math.max(i - 1, 0),
					position: 100 /*End of span is checked afterwards */
				};
			};

			if (typeof oPosition === "number") {
				oPosition = fnFindSpan(oPosition);
			}

			oItem = oPosition && oPosition.span;

			if (oPosition) {
				// find span we are setting caret to
				oContent = $input[0];
				if (!oItem) {
					oItem = oContent && oContent.children && oContent.children.length > oPosition.spanIndex ?
						oContent.childNodes[oPosition.spanIndex] : null;
				}

				if (oItem) {
					oRange = document.createRange();
					// check if item is text itself or text's node
					oFirstChild = oItem.firstChild ? oItem.firstChild : oItem;
					if (this.bEditInBetween && this.bTypingFlow) {
						if (oPosition.spanIndex === 0 && oPosition.position === 0 /*&& oPosition.keyCode === 8 || oPosition.keyCode === 46*/ ) {
							iPosition = 0;
						} else if (oFirstChild && oFirstChild.length) {
							iPosition = Math.min(oFirstChild.length, oPosition.position);
						}
					} else if (oFirstChild && oFirstChild.length) {
						iPosition = Math.min(oFirstChild.length, oPosition.position);
					}
				}

				// Safe check if position is not number
				if (!(typeof iPosition === "number") || (oFirstChild && oFirstChild.length && iPosition > oFirstChild.length) || iPosition < 0) {
					iPosition = 0;
				}

				if (oFirstChild){
                    oRange.setStart(oFirstChild, iPosition);
                    oRange.collapse(true);
                    oSelection.removeAllRanges();
                    oSelection.addRange(oRange);
                }
			}
		},

		//Returns the rel string and text to be filtered based on tokens
		_getStringForFilterAndTempRelString: function (tokens) {
			var suggestionString = "";
			var incorrectInput = "";
			var token;
			var type;
			var prevType;
			var prevToken;
			for (var index in tokens) {
				token = tokens[index];
				prevToken = tokens[index - 1];
				type = token.type ? token.type : token._type;
				prevType = prevToken ? (prevToken.type ? prevToken.type : prevToken._type) : null;
				if (type === this.astLibInstance.IDPParser.EOF || type === this.astLibInstance.IDPParser.DOT) {
					continue;
				} else if (type === this.astLibInstance.IDPParser.ALL_STRING || (prevType && prevType === this.astLibInstance.IDPParser.ALL_STRING)) {
					incorrectInput += token.text;
				} else {
					suggestionString += token.text;
				}
			}
			return {
				tempRelString: suggestionString,
				filterText: incorrectInput
			};
		},

		_isEmptySpace: function (sChar) {
			return sChar === String.fromCharCode(160) || sChar === " ";
		},

		_bRequiredFilteredSuggestion: function (sText) {
			return !(this._isEmptySpace(sText) || sText === "" || this._selectedSpans[0].className === "sapAstLiteralClass");
		},

		//Updates UI model for typed content
		_updateUIModelForFreeFlow: function (sChar) {
			var that = this;
			var span = this._selectedSpans[0];

			if (this._uiModel.length === 0) {
				var item = {
					id: that._createUUID(),
					tokenType: Constants.UNDEFINED,
					text: sChar
				};
				var newSpanItem = this._createSpanItem(item);
				this._uiModel.push(item);
				this._uiModelToSpan(this._uiModel);
			} else if (span.className === "sapAstObjectClass") {
				if (sChar === Constants.DOT && this.getOperationsContext()) {
					this.dotInOperationsContext = true;
					this._attributeContext = true;
				} else {
					var reference = span.getAttribute(Constants.REFERENCE);
					if (span.textContent.startsWith(sChar)) {
						span.setAttribute(Constants.REFERENCE, sChar + " " + reference);
						this._cursorPosition += 1; //For added space
					} else if (span.textContent.endsWith(sChar)) {
						span.setAttribute(Constants.REFERENCE, reference + sChar);
					}
				}
            } else if (sChar === Constants.SINGLE_QUOTE && this.bEditInBetween) {
                span.textContent = span.textContent.replace(Constants.SINGLE_QUOTE, Constants.SINGLE_QUOTE + Constants.SINGLE_QUOTE);
            } else if (this.bEditInBetween && span.nextSibling && span.nextSibling.className && span.nextSibling.className ===
                "sapAstFunctionClass" && ((span.className !== "sapAstLiteralClass" && span.className !== "sapAstAuxilaryNodeClass") ||
                (sChar !== " " && span.className === "sapAstAuxilaryNodeClass" && span.textContent.endsWith(event.key)))) {
                span.textContent += " ";
            }

			this._updateUiModel();
		},

		// Gets autosuggestion list based on user input
		//TODO: refactor to remove instead of copy - modularise for all categories
		_filterSuggestionList: function (sText) {
			var bPushed = false;
			var aFilteredSuggestions = {
				autoComplete: {
					categories: {
						functions: {},
						operators: {},
						terms: []
					},
					showLiteral: this._suggestionsList.autoComplete.showLiteral,
					businessDataTypeList: this._suggestionsList.autoComplete.businessDataTypeList
				},
				businessDataTypeList: this._suggestionsList.autoComplete.businessDataTypeList
			};
			var oSuggestions = this._suggestionsList.autoComplete.categories;

			var fnCheckMatchesAndAdd = function (aSuggestions) {
				var aData = [];
				var sLabelLowered, sTextLowered, sNameLowered;
				for (var i = 0; i < aSuggestions.length; i++) {
					sLabelLowered = (aSuggestions[i].label).toLowerCase();
					sNameLowered = (aSuggestions[i].name).toLowerCase();
					sTextLowered = sText.toLowerCase();
					if (((" " + sLabelLowered).indexOf(" " + sTextLowered) !== -1) || ((" " + sNameLowered).indexOf(" " + sTextLowered) !== -1)) {
						aData.push(aSuggestions[i]);
						bPushed = true;
					}
				}

				return aData;
			};

            var createFilteredList = function () {
                if (oSuggestions.terms) { //Vocabulary
                    aFilteredSuggestions.autoComplete.categories.terms = fnCheckMatchesAndAdd(oSuggestions.terms);
                }

                if (oSuggestions.operations) {
                    aFilteredSuggestions.autoComplete.categories.operations = fnCheckMatchesAndAdd(oSuggestions.operations);
                }

                if (oSuggestions.functions) { //Functions
                    var advancedFunctions = oSuggestions.functions.advanced;
                    if (advancedFunctions && advancedFunctions.length > 0) {
                        var aList = fnCheckMatchesAndAdd(advancedFunctions);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.functions.advanced = aList;
                        }
                    }
                    var aggregateFunctions = oSuggestions.functions.aggregate;
                    if (aggregateFunctions && aggregateFunctions.length > 0) {
                        var aList = fnCheckMatchesAndAdd(aggregateFunctions);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.functions.aggregate = aList;
                        }
                    }
                    var selectionFunctions = oSuggestions.functions.selection;
                    if (selectionFunctions && selectionFunctions.length > 0) {
                        var aList = fnCheckMatchesAndAdd(selectionFunctions);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.functions.selection = aList;
                        }
                    }
                    var windowFunctions = oSuggestions.functions.window;
                    if (windowFunctions && windowFunctions.length > 0) {
                        var aList = fnCheckMatchesAndAdd(windowFunctions);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.functions.window = aList;
                        }
                    }
                    var timeDateFunctions = oSuggestions.functions.time_duration;
                    if (timeDateFunctions && timeDateFunctions.length > 0) {
                        var aList = fnCheckMatchesAndAdd(timeDateFunctions);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.functions.time_duration = aList;
                        }
                    }
                }

                if (oSuggestions.operators) { // For operators
                    var arithmeticOperators = oSuggestions.operators.arithmetic;
                    if (arithmeticOperators && arithmeticOperators.length > 0) {
                        var aList = fnCheckMatchesAndAdd(arithmeticOperators);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.operators.arithmetic = aList;
                        }
                    }
                    var comparisonOperators = oSuggestions.operators.comparision;
                    if (comparisonOperators && comparisonOperators.length > 0) {
                        var aList = fnCheckMatchesAndAdd(comparisonOperators);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.operators.comparision = aList;
                        }
                    }
                    var logicalOperators = oSuggestions.operators.logical;
                    if (logicalOperators && logicalOperators.length > 0) {
                        var aList = fnCheckMatchesAndAdd(logicalOperators);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.operators.logical = aList;
                        }
                    }
                    var arrayOperators = oSuggestions.operators.array;
                    if (arrayOperators && arrayOperators.length > 0) {
                        var aList = fnCheckMatchesAndAdd(arrayOperators);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.operators.array = aList;
                        }
                    }
                    var rangeOperators = oSuggestions.operators.range;
                    if (rangeOperators && rangeOperators.length > 0) {
                        var aList = fnCheckMatchesAndAdd(rangeOperators);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.operators.range = aList;
                        }
                    }
                    var miscellaneousOperators = oSuggestions.operators.miscellaneous;
                    if (miscellaneousOperators && miscellaneousOperators.length > 0) {
                        var aList = fnCheckMatchesAndAdd(miscellaneousOperators);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.operators.miscellaneous = aList;
                        }
                    }
                    var functionalOperators = oSuggestions.operators.functional;
                    if (functionalOperators && functionalOperators.length > 0) {
                        var aList = fnCheckMatchesAndAdd(functionalOperators);
                        if (aList && aList.length > 0) {
                            aFilteredSuggestions.autoComplete.categories.operators.functional = aList;
                        }
                    }
                }
            };

            if (oSuggestions) {
                createFilteredList();
            }

            //For terms like Interaction, when user types in, grammar parses it as function token
            //Hence no suggestions are available. We take the last token in relstring and get suggestion till
            // string before that
            if (!bPushed) {
                var tokens;
                if (this.bEditInBetween) {
                    tokens = this._oAstExpressionLanguage.getTokensForGivenStringInput(this.tempRelString)
                } else {
                    tokens = this._oAstExpressionLanguage.getTokensForGivenStringInput(this.relString);
                }
                var startIndex = tokens.length - 2;
                sText = tokens[startIndex].text;
                tokens = tokens.slice(0, startIndex);
                var filterString = this._getStringForFilterAndTempRelString(tokens);
                oSuggestions = this._getSuggestionsForTheGivenInput(filterString.tempRelString).autoComplete.categories;

                createFilteredList();
            }

            aFilteredSuggestions.hasSuggestions = bPushed;

			return aFilteredSuggestions;

		},

		////////////////////////////////////////////////////////////////////////////Jay's new changes end////////////////////////////////////////////////////////////////////////

		_fireChange: function (textContent) {
			if (this.isDialogOpen && !this.forceFireChange) {
				return;
			}
			var astNodesString = "";
			if (!this.relString && textContent) {
				this.relString = textContent;
			}
			if (!this.relString) {
				this.relString = "";
			}

			//applies to DT
			if (this.markerString) {
				this.markerRelString = this.markerString + this.relString;
				astNodesString = this._oAstExpressionLanguage.getAstNodesString(this.markerRelString);
			} else {
				astNodesString = this._oAstExpressionLanguage.getAstNodesString(this.relString);
			}
			this.astresponseNodes = JSON.parse(astNodesString);
			if (this.astresponseNodes.length >= 0 && this.getValue().replace(/\s/g, "") !== this.relString
				.replace(/\s/g, "")) {
				this.setValue(this.relString);
				this.setJsonData(this._jsonArray);
				this.fireChange({
					newValue: this.relString,
					astNodes: this.astresponseNodes,
					displayText: this._input[0].textContent.trim()
				});
			}
		},

		_contextForPerviousSpans: function (selectedSpan) {
			var context = "";
			var json;
			var children = this.getDomRef("input").children;
			for (var iterator = 0; iterator < children.length; iterator++) {
				var childSpan = $("#" + children[iterator].id);
				if (children[iterator].id !== selectedSpan[0].id) {
					if (childSpan[0].getAttribute(Constants.JSON)) {
						try {
							json = JSON.parse(childSpan[0].getAttribute(Constants.JSON));
							if (json.expandedText) {
								context += json.expandedText;
							}
						} catch (e) {
							jQuery.sap.log.error("Error in parsing string to JSON: " + e.message);
						}
					} else if (childSpan[0].getAttribute(Constants.REFERENCE)) {
						context += childSpan[0].getAttribute(Constants.REFERENCE);
					} else {
						context += childSpan[0].textContent
					}
				} else {
					context += "";
					break;
				}
			}
			return context;

		},

		//Updates json for select link span after click and apply
		_updateSelectFunction: function (oEvent) {
			this.isDialogOpen = false;
			this._selectedSpans[0].setAttribute(Constants.JSON, JSON.stringify(oEvent.getSource().mProperties.jsonData));
			this._selectedSpans[0].textContent = oEvent.getSource().mProperties.value;
			this._updateUiModel();
			this._uiModel = this._convertInputToUiModel(this.relString);
			this._input.empty();
			this._uiModelToSpan(this._uiModel);
			this._setCurrentCursorPosition(this._cursorPostion);
		},

		//Updates json for aggregate link span after click and apply
		_updateAggregateFunction: function (oEvent) {
			this.isDialogOpen = false;
			this._selectedSpans[0].setAttribute(Constants.JSON, JSON.stringify(oEvent.getSource().mProperties.jsonData));
			this._selectedSpans[0].textContent = oEvent.getSource().mProperties.value;
			this._updateUiModel();
			this._uiModel = this._convertInputToUiModel(this.relString);
			this._input.empty();
			this._uiModelToSpan(this._uiModel);
			this._setCurrentCursorPosition(this._cursorPostion);
		},

		_getNewSpaceSpan: function () {
			var item = {};
			// Create span with space and update model
			item.id = this._createUUID();
			item.text = " ";
			item.tokenType = Constants.WS;
			item.cssClass = "sapAstAuxilaryNodeClass";
			return this._createSpanItem(item);
		},

		_createSpaceSpanItem: function () {
			var newSpan = this._getNewSpaceSpan();
			var selectedSpan = this._selectedSpans[0] ? this._selectedSpans[0].id : "";
			var spanId = "#" + selectedSpan;
			$(newSpan[0]).insertAfter(spanId);
			this._updateUiModel();
			this._cursorPostion += newSpan[0].textContent.length;
			this._selectedSpans = $(newSpan);
			this._uiModel = this._convertInputToUiModel(this.relString);
			this._hasTextContent = true;
			this.nIndexOfToken += 1;
		},

		/*
		 * this utility creates a span item for space, opens autosuggestions automatically
		 * and then sets the cursor position to fit it the text picked from autosuggestions
		 */
		_addSpace: function () {
			this._createSpaceSpanItem();
			if (this.bEditInBetween) {
				this._getSuggestionsForEditedInput(false);
			} else {
				this._suggestionsList = this._getSuggestionsForTheGivenInput(this.relString);
			}
			this._setCaretPosition({
				spanIndex: this.nIndexOfToken,
				position: this._selectedSpans[0].textContent.length
			});
			this._showAutoSuggestion(this._suggestionsList);
		},

		/*
		 * this functions handles backspace and removes spans
		 */
		_removeSpans: function () {
			var atLeastOneSpanRemoved = false;

			if (this._uiModel.length === 0 || this._input.children().length === 0) {
				return atLeastOneSpanRemoved;
			}
			this._prevNodeofRemovedNode = null;

			for (var i = 0; i < this._selectedSpans.length; i++) {
				this._prevNodeofRemovedNode = $("#" + this._selectedSpans[i].id).prev()[0];
				if (this._selectedSpans[i] instanceof HTMLSpanElement) {
				    if (this._selectedSpans[i].textContent) {
				        this._cursorPostion -= this._selectedSpans[i].textContent.length;
				    }
					$(this._selectedSpans[i]).remove();

					atLeastOneSpanRemoved = true;
				}
				if ("getAttribute" in this._selectedSpans[i] && this._selectedSpans[i].getAttribute("class") === "sapAstObjectClass") {
					this._attributeContext = false;
				}
			}
			if (this.getDomRef("input") && this.getDomRef("input").textContent && !this.getDomRef("input").textContent.length > 0) {
				this._hasTextContent = false;
			}

			return atLeastOneSpanRemoved;
		},

		/*
		 * we get the autosuggestions from autocomplete util.
		 * this utility helps to display the autosuggestion popup
		 */
		_showAutoSuggestion: function (suggestionContent, bExpand) {
			var span = jQuery(this._selectedSpans);
			var xPos = 0;
			if (this._cursorPostion !== 0) {
				if (span && span[0] instanceof HTMLPreElement) {
					xPos = 12;
				} else {
					if ("position" in span && span.position()) {
						xPos = parseInt(span.position().left, 10);
					}
					xPos += parseInt(span.width(), 10);
				}
			}
			var yPos = 3;
			xPos += 10; //For clear view of cursor pos during typing (temporary fix)
			var that = this;
			if (this._oAutoSuggestionPopUp && !this._oAutoSuggestionPopUp.isOpen()) {
				this._oAutoSuggestionPopUp.destroyContent();
				this._oAutoSuggestionPopUp.addContent(new sap.rules.ui.AutoCompleteSuggestionContent({
					content: suggestionContent.autoComplete,
					reference: that._reference,
					enableAggregateFunctionVocabulary: that._enableAggregateFunctionVocabulary,
					enableAggregateFunctionWhereClause: that._enableAggregateFunctionWhereClause,
					dialogOpenedCallbackReference: that._isDialogOpenedCallbackReference,
					vocabularyInfo: that._oAstExpressionLanguage,
					expand: bExpand
				}));
				this._oAutoSuggestionPopUp.setOffsetX(xPos);
				this._oAutoSuggestionPopUp.setOffsetY(yPos);
				this._oAutoSuggestionPopUp.openBy(this.getDomRef("input"));
			} else {
				this._oAutoSuggestionPopUp.destroyContent();
				this._oAutoSuggestionPopUp.addContent(new sap.rules.ui.AutoCompleteSuggestionContent({
					content: suggestionContent.autoComplete,
					reference: that._reference,
					enableAggregateFunctionVocabulary: that._enableAggregateFunctionVocabulary,
					enableAggregateFunctionWhereClause: that._enableAggregateFunctionWhereClause,
					dialogOpenedCallbackReference: that._isDialogOpenedCallbackReference,
					vocabularyInfo: that._oAstExpressionLanguage,
					expand: bExpand
				}));
				this._oAutoSuggestionPopUp.setOffsetX(xPos);
				this._oAutoSuggestionPopUp.setOffsetY(yPos);
			}
			if (!this._oAutoSuggestionPopUp.isOpen()) {
				this._oAutoSuggestionPopUp.setOffsetX(xPos);
				this._oAutoSuggestionPopUp.setOffsetY(yPos);
				this._oAutoSuggestionPopUp.openBy(this.getDomRef("input"));
			}
		},

		_isLastTokenSpaceItem: function () {
			var isLastTokenSpace = true;
			var oLastItem = [];
			//Typing in between cases - read until the nIndexOfToken of UIModel 
			if (this.bEditInBetween && this.tempRelString != "" && this.nIndexOfToken >= 0) {
				oLastItem = this._uiModel[this.nIndexOfToken];
				/*if you are typing in between and if it is an attribute context,
				 last token will be Dataobject.Hence, returning true will not add space */
				if (this._attributeContext || (this._selectedSpans[0].textContent !== this.filterText)) {
                    return true;
                }
			} else if (this._uiModel && this._uiModel.length > 0) { // Typing at the end -> read from UI model's end
				oLastItem = this._uiModel[this._uiModel.length - 1];
			}
			/* Typing at the end -> read from UI model's end 
			 whitespace and undefined - do not add whitespace */
			if (oLastItem && (oLastItem.tokenType === Constants.WS || oLastItem.tokenType === Constants.UNDEFINED)) {
				return true;
			}
			// If Term add space - except if it is an attribute /association 
			if (oLastItem && oLastItem.tokenType !== Constants.WS && oLastItem.dataObjectType && oLastItem.dataObjectType !== "S" && oLastItem.dataObjectType !==
				"T" && oLastItem.dataObjectType !== "AO" && (oLastItem.tokenType === Constants.TERM && !oLastItem.getText().endsWith(Constants.DOT))
			) {
				isLastTokenSpace = false;
			} else if (oLastItem && oLastItem.tokenType !== Constants.WS && oLastItem.tokenType !== Constants.TERM && oLastItem.reference ===
				undefined) { //If previous token is a function 
				isLastTokenSpace = false;
			} else if (oLastItem && oLastItem.tokenType !== Constants.WS && this._uiModel[0] && "getText" in this._uiModel[0] && (this._uiModel[
					0].getText().toUpperCase() === Constants.UPDATE || this._uiModel[0].getText().toUpperCase() === Constants.APPEND) && !this._attributeContext) { // last token has update add space 
				isLastTokenSpace = false;
			} else if (oLastItem && (oLastItem.tokenType === "D" || oLastItem.tokenType === "T") && this._uiModel[0] && "getText" in this._uiModel[
					0]) { // After choosing Date/Time, add space 
				isLastTokenSpace = false;
			} else if (oLastItem && oLastItem.tokenType === "ID" && !oLastItem.dataObjectType) {
				var elemWithRule = oLastItem.getReference() ? oLastItem.getReference().split("/")[1] : "";
				if (TermsProvider.getInstance().getTermByTermId(elemWithRule).isResultDataObjectElement) {
					isLastTokenSpace = false;
				}
			}

			return isLastTokenSpace;
		},

		_addItemToEmptyInput: function (oEvent, newSpan, spanId, item) {
			if (item.resultDataObjectId && item.resultDataObjectId !== "" && item.tokenType === Constants.TERM) {
				this.ruleContext = true;
			}
			newSpan = this._createSpanItem(item);
			this._uiModel.push(item);
			this._uiModeltoString();
			this._uiModel = this._convertInputToUiModel(this.relString);
			this._cursorPostion = item.text.length;
			this._uiModelToSpan(this._uiModel);
			this._selectedSpans = newSpan;
			if (this.getIsAttributeContext() && !this.isAssociation &&
				!item.json && this._oAutoSuggestionPopUp && this._oAutoSuggestionPopUp.isOpen) {
				this.isAutoSuggestionRequired = false;
				this._oAutoSuggestionPopUp.close();
			}
		},

		_addAtBeginningForInBetween: function (newSpan, spanId, spaceSpan, item) {
			//Cursor Position set to the beginning of an existing text.
			$(newSpan[0]).insertBefore(spanId);
			this._cursorPostion = item.text.length;
			this._selectedSpans = $(newSpan);
			$(spaceSpan[0]).insertBefore(spanId);
			item.bAddSpaceAutoMatically = false;
			if (!item.text.endsWith(Constants.DOT)) {
				this._cursorPostion += 1; //For space
				this._selectedSpans = $(spaceSpan);
				this.nIndexOfToken += 1; //If space is added, the index of the new span will increase
			}
		},

		_handleUndefinedForInBetween: function (currentSpan, item, prevSpan, nextSpan, spaceSpan, spanId) {
			if (currentSpan.textContent.startsWith(Constants.SINGLE_QUOTE)) {
				//Add fixed value to typed content
				this._selectedSpans[0].textContent += item.text;
				this._cursorPostion += item.text.length;
			} else { //Replace the span text if not fixed value, and remove prev undefined tokens
				var existingTextLength = this._selectedSpans[0].textContent.length;
				this._selectedSpans[0].textContent = item.text;
				this._cursorPostion += item.text.length - existingTextLength;
				this._replacePreviousUndefinedTokens();
				//If Product.I has been typed, uiModel will contain 2 tokens instead of 1 - Product and I (undefined)
				//After replacing I with attribute/association text, _convertInputToUiModel  will make them one term,
				// hence index must be decremented
				if (prevSpan && prevSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.TERM && prevSpan.textContent.endsWith(Constants.DOT)) {
					this.nIndexOfToken -= 1;
				}
			}
			if (nextSpan && nextSpan.getAttribute(Constants.TOKEN_TYPE) !== Constants.WS) {
				$(spaceSpan[0]).insertAfter(spanId);
				item.bAddSpaceAutoMatically = false;
			}
			if (item.reference) {
				this._selectedSpans[0].setAttribute(Constants.REFERENCE, item.reference);
			}
			if (item.json) {
				this._selectedSpans[0].setAttribute(Constants.JSON, JSON.stringify(item.json));
			}
		},

		_addInBetweenTermsForInBetween: function (currentSpan, newSpan, spanId, item, spaceSpan) {
			//If item is of attribute/association we should add DO.Attr/DO.Assoc
			//  var filteredTerm = currentSpan.textContent.substring(0, this.filterTextLength);
			if (this.filterText.indexOf(Constants.DOT) > -1) {
				this._appendItemText(this.filterText,currentSpan,item);
			} else if (this.getOperationsContext() && this.bEditInBetween && currentSpan.getAttribute("tokentype") === "ID" && currentSpan.textContent.endsWith(Constants.DOT)) {
				this._appendItemText(currentSpan.textContent,currentSpan,item);
			} else {
				this._selectedSpans[0].textContent = item.text;
				this._selectedSpans[0].setAttribute("reference", item.reference);
			}
			this._cursorPostion = this._cursorPostion - this.filterText.length + this._selectedSpans[0].textContent.length;
		},
		
		_appendItemText: function (currentText, currentSpan, item) {
			    var dotArray = currentText.split(Constants.DOT);
				var referenceArray = currentSpan.getAttribute("reference").split("/");
				var reference = "";
				var newSpanText = "";
				for (var i = 0; i < dotArray.length - 1; i++) {
					newSpanText += dotArray[i] + Constants.DOT;
					reference += "/" + referenceArray[i + 1];
				}
				if (referenceArray[0] === Constants.DOT) {
                    reference = Constants.DOT + reference;
                }
				//Handle the relative path for in between Span.
				item.reference = item.reference.replace(".", "");
				this._selectedSpans[0].textContent = newSpanText + item.text;
				this._selectedSpans[0].setAttribute("reference", reference + item.reference);
		},

		_addItemInBetween: function (newSpan, currentSpan, spanId, item, bReplaceFunctionWithTerm) {
			var prevSpan = currentSpan.previousSibling;
			var nextSpan = currentSpan.nextSibling;
			newSpan = this._createSpanItem(item);
			var spaceSpan = this._getNewSpaceSpan();
			//  var selectedSpan = $(spanId);
			//Adding at the beginning
			if (this._cursorPostion === 0 && this.nIndexOfToken === 0 && !prevSpan) {
				this._addAtBeginningForInBetween(newSpan, spanId, spaceSpan, item);
			} //For undefined tokens in between
			else if (currentSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.UNDEFINED) {
				//Handle the error use case.    
				this._handleUndefinedForInBetween(currentSpan, item, prevSpan, nextSpan, spaceSpan, spanId);
			} else if (item.json) {
				//For select or aggregate terms
				$(newSpan[0]).insertAfter(spanId);
				this._selectedSpans = newSpan;
				this._cursorPostion += newSpan[0].textContent.length;
				this.nIndexOfToken += 1;
				if (nextSpan.getAttribute(Constants.TOKEN_TYPE) !== Constants.WS) {
					$(spaceSpan[0]).insertAfter(spanId);
					item.bAddSpaceAutoMatically = false;
					this.nIndexOfToken += 1; //If space is added, the index of the new span will increase
				}
			}
			//if cursor is in between term or function span instead of start or end of the span
			else if ((currentSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.TERM && !(currentSpan.textContent.endsWith(Constants.DOT) &&
                    this.filterText === currentSpan.textContent)) ||
                (currentSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.FUNCTION && currentSpan.textContent.length === 1)) {
                if (this.getOperationsContext() && this._attributeContext && newSpan[0].textContent === Constants.DOT) {
                	this._selectedSpans[0].textContent += item.text;
                	this.isAutoSuggestionRequired = true;
					this.dotInOperationsContext = true;
					// Increment one additional position for "."
					this._cursorPostion = this._cursorPostion + 1;
                } else {
                	this._addInBetweenTermsForInBetween(currentSpan, newSpan, spanId, item, spaceSpan);
                }
			} //if cursor is after dot of a term
			else if (currentSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.TERM && currentSpan.textContent.endsWith(Constants.DOT)) {
				this._selectedSpans[0].textContent += item.text;
				if (item.text === Constants.DOT && this._attributeContext) {
					this.isAutoSuggestionRequired = true;
					this.dotInOperationsContext = true;
					// Increment one additional position for "."
					this._cursorPostion = this._cursorPostion + 1;
				} else {
					if (item.reference) {
						var reference = currentSpan.getAttribute(Constants.REFERENCE) ? currentSpan.getAttribute(Constants.REFERENCE) +
							item.reference : item.reference;
						this._selectedSpans[0].setAttribute(Constants.REFERENCE, reference);
					}
					if (item.json) {
						this._selectedSpans[0].setAttribute(Constants.JSON, JSON.stringify(item.json));
					}
				}
				this._cursorPostion += item.text.length;
			} else if (currentSpan.className === "sapAstLiteralClass") {
				var existingTextLength = this.filterTextLength;
				if (this._selectedSpans[0].getAttribute(Constants.TOKEN_TYPE) == Constants.DATEBUSINESSDATATYPE || this._selectedSpans[0].getAttribute(
								Constants.TOKEN_TYPE) === Constants.TIMEBUSINESSDATATYPE) {
							this._selectedSpans[0].setAttribute(Constants.REFERENCE, item.text);
				}
				this._selectedSpans[0].textContent = item.text;
				this._cursorPostion += item.text.length - existingTextLength;
				if (nextSpan && nextSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.WS) {
					item.bAddSpaceAutoMatically = false;
				}
            } //When user types characters parsable by grammar but choose a different term or function
            //from autosuggestions
            else if (bReplaceFunctionWithTerm) {
                var existingTextLength = this._selectedSpans[0].textContent.length;
                this._selectedSpans[0].textContent = item.text;
                this._cursorPostion += item.text.length - existingTextLength;
                //If Product.I has been typed, uiModel will contain 2 tokens instead of 1 - Product and I (undefined)
                //After replacing I with attribute/association text, _convertInputToUiModel  will make them one term,
                // hence index must be decremented
                if (prevSpan && prevSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.TERM && prevSpan.textContent.endsWith(Constants.DOT)) {
                    this.nIndexOfToken -= 1;
                }
                if (item.reference) {
                    this._selectedSpans[0].setAttribute(Constants.REFERENCE, item.reference);
                }
			} else {
				$(newSpan[0]).insertAfter(spanId);
				if (currentSpan.getAttribute(Constants.TOKEN_TYPE) !== Constants.WS) {
					$(spaceSpan[0]).insertAfter(spanId);
					this._cursorPostion += 1;
					this.nIndexOfToken += 1;
				}

				this._selectedSpans = $(newSpan);
				this._cursorPostion += newSpan[0].textContent.length;
				if (!this._isLastTokenSpaceItem()) {
					this._addSpace();
				} else {
					//New span is inserted after currentSpan, hence index of span will increase by 1
					this.nIndexOfToken += 1;
				}
				if (nextSpan && nextSpan.getAttribute(Constants.TOKEN_TYPE) !== Constants.WS) {
					spaceSpan = this._getNewSpaceSpan();
					$(spaceSpan[0]).insertAfter($("#" + this._selectedSpans[0].id));
					item.bAddSpaceAutoMatically = false;
				}
			}

			// TODO : try to incorporate in between above if else logic
			//For functions that add ( automatically
			if (item.text.endsWith(" (")) {
				this.nIndexOfToken += 2;
			}
			this._updateUiModel();
			this._uiModel = this._convertInputToUiModel(this.relString);
			this._uiModelToSpan(this._uiModel);
			this._getSelectedSpanFromIndex();
			this._getSuggestionsForEditedInput(false);
		},

		_addItemsToTheEnd: function (newSpan, currentSpan, spanId, item, bReplaceFunctionWithTerm) {
			//TODO: List all scenarios which will come to this else flow
			if (currentSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.UNDEFINED) {
				if (currentSpan.textContent.startsWith(Constants.SINGLE_QUOTE)) { //Add fixed value to typed content
					this._selectedSpans[0].textContent += item.text;
					this._cursorPostion += item.text.length;
				} else { //Replace the span text if not fixed value, and remove prev undefined tokens
					var existingTextLength = this._selectedSpans[0].textContent.length;
					this._selectedSpans[0].textContent = item.text;
					this._cursorPostion += item.text.length - existingTextLength;
					if (item.tokenType === Constants.TERM) {
						this._cursorPostion += 1; // Increment for DOT
					}
					this._replacePreviousUndefinedTokens();
				}
				if (item.reference) {
					this._selectedSpans[0].setAttribute(Constants.REFERENCE, item.reference);
				}
				//TODO:Check use case when it comes here.

				if (item.json) {
					this._selectedSpans[0].setAttribute(Constants.JSON, JSON.stringify(item.json));
				}
			} else if (item.json || currentSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.WS) {
				//Whitespace handling.
				//Aggregate and Select Handling.
				newSpan = this._createSpanItem(item);
				$(newSpan[0]).insertAfter(spanId);
				this._selectedSpans = newSpan;
				this._cursorPostion += newSpan[0].textContent.length;
            } else if (bReplaceFunctionWithTerm) {
                //When user types characters parsable by grammar but choose a different term or function
                //from autosuggestions
                var existingTextLength = this._selectedSpans[0].textContent.length;
                this._selectedSpans[0].textContent = item.text;
                this._cursorPostion += item.text.length - existingTextLength;
                if (item.tokenType === Constants.TERM) {
                    this._cursorPostion += 1; // Increment for DOT
                }
                if (item.reference) {
                    this._selectedSpans[0].setAttribute(Constants.REFERENCE, item.reference);
                }
			} else {
				this._selectedSpans[0].textContent += item.text;
				//Handling of the update operation.
				if (item.text === Constants.DOT && this._attributeContext) {
					this.isAutoSuggestionRequired = true;
					this.dotInOperationsContext = true;
					// Increment one additional position for "."
					this._cursorPostion = this._cursorPostion + 1;
				} else {
					//Handling for the Attributes and Associations.
					if (item.reference) {
						var reference = this._selectedSpans[0].getAttribute(Constants.REFERENCE) ? this._selectedSpans[0].getAttribute(Constants.REFERENCE) +
							item.reference :
							item.reference;
						this._selectedSpans[0].setAttribute(Constants.REFERENCE, reference);
					}
					//TODO:Check use case when it comes here.
					if (item.json) {
						this._selectedSpans[0].setAttribute(Constants.JSON, JSON.stringify(item.json));
					}
					this._cursorPostion += item.text.length;

				}
			}

			this._updateUiModel();
			this._uiModel = this._convertInputToUiModel(this.relString);
			this._uiModelToSpan(this._uiModel);
			this._hasTextContent = true;
			if (this.getIsAttributeContext() && !this.isAssociation &&
				!item.json && this._oAutoSuggestionPopUp && this._oAutoSuggestionPopUp.isOpen()) {
				this.isAutoSuggestionRequired = false;
				this._oAutoSuggestionPopUp.close();
			}
		},

		// Checks if current span is a function and matches the selected item
        _bReplaceFunctionWithSelectedItem: function (currentSpan, item) {
            if (currentSpan && currentSpan.className === "sapAstFunctionClass") {
                var name = item.text.toLowerCase();
                var label = item.label ? item.label.toLowerCase() : "";
                var spanText = currentSpan.textContent.toLowerCase();
                return (name.startsWith(spanText) || label.indexOf(spanText) > -1);
            }
            return false;
        },

        //reset the cursor position to handle the space re rendering.
        _resetCursorForRerendering: function () {
            var length = 0;
            if (this.bEditInBetween) {
                length = this._getFullTextContentLength();
                if (length !== this._cursorPostion && this._cursorPostion !== 0) {
                    this._cursorPostion = length;
                }
            }
        },
        
        _getFullTextContentLength: function () {
            var length = 0;
            for (var i = 0; i <= this.nIndexOfToken; i++) {
                    length += this._getSelectedSpanGivenIndex(i)[0].textContent.length;
                }
            return length;    
        },
		/*
		 * the text selected from autosuggestions, more dialog , 
		 * value help and text entered in fixed value will all have to be set in the 
		 * UI. This function sets the value in the expression basic and 
		 * updates cursor position accordingly
		 */
		_setTextOnCursorPosition: function (oEvent) {
			this.dotInOperationsContext = false;
			this.bTypingFlow = false;
			var newSpan;
			this._resetCursorForRerendering();
            var currentSpan = this._selectedSpans ? this._selectedSpans[0] : {};
            var spanId = "#" + currentSpan.id;
            var sPrevId = (currentSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.WS || this._uiModel.length === 0) ? "" : currentSpan.id;
            var item = this._getItemFromSuggestionModel(oEvent, sPrevId);
            this.ruleContext = false;
            this.forceFireChange = false;

            var bReplaceFunctionWithTerm = this._bReplaceFunctionWithSelectedItem(currentSpan, item);
			/*making sure that we add space before setting the chosen text ( from the dropdown) ex: 1 + 2 > 3 AND
			When user chooses AND from the list, we see if there is a space after 3 if not, we add a space and then add "AND" */
			if (!this._selectedSpans[0].textContent.endsWith(".") && !bReplaceFunctionWithTerm && !this._isLastTokenSpaceItem() && oEvent.getSource().mProperties && oEvent.getSource().mProperties.label && oEvent.getSource().mProperties
				.label !== Constants.DOT && this._cursorPostion > 0) {
				this._createSpaceSpanItem();
                //Assignig newly created space as current span
                currentSpan = this._selectedSpans[0];
                spanId = "#" + currentSpan.id;
			}

			// TODO: remove and test fixed value and valuehelp / date/time without focus out
			if (oEvent && oEvent.getSource() && oEvent.getSource().mProperties.forceFireChange) {
				this.forceFireChange = true;
			}

			if (this._uiModel.length === 0) {
				//Adding tokens to empty input
				this._addItemToEmptyInput(oEvent, newSpan, spanId, item);
			} else if (currentSpan && this.bEditInBetween) {
				//Adding tokens in between flow
                this._addItemInBetween(newSpan, currentSpan, spanId, item, bReplaceFunctionWithTerm);
			} else if (currentSpan) {
				// Adding tokens at end flow
                this._addItemsToTheEnd(newSpan, currentSpan, spanId, item, bReplaceFunctionWithTerm);
				if (this.isAssociation) {
	                this._cursorPostion += 1;
	            }
			} else {
				console.error("could not find the user selected span - currentSpan");
			}

			if (this._bPopUpFocused) { //Bringing back focus to input from autosuggest pop up
				this._input.focus();
				this._bPopUpFocused = false;
			}
			if (!this.bEditInBetween) {
				this.nIndexOfToken = this._input.children().length - 1;
				this._selectedSpans = [];
				this._selectedSpans.push(this._input.children()[this._input.children().length - 1]);
			}
			this._setCaretPosition({
				spanIndex: this.nIndexOfToken,
				position: this._selectedSpans[0] ? this._selectedSpans[0].textContent.length : this._cursorPostion
			});
			
			if (this.isAutoSuggestionRequired) {
			    if ((item.bAddSpaceAutoMatically && !this._isLastTokenSpaceItem()) && !(this.bEditInBetween && this._uiModel[this.nIndexOfToken +
                    1].tokenType === Constants.WS)) {
                this._addSpace();
            } else {
              //If space is already available after tokens for edit in between, we juct move the cursor position after space. 
                if (this.bEditInBetween && !this._isLastTokenSpaceItem()) {
                    this._setCaretPosition({
                        spanIndex: this.nIndexOfToken + 1,
                        position: 1
                    });
                } else if (!this.bEditInBetween) {
                    this._suggestionsList = this._getSuggestionsForTheGivenInput(this.relString);
                }
                this._showAutoSuggestion(this._suggestionsList);
            }
			}
		},

		/* On typing DO/Rule having spaces in label, this method will replace
			previously typed space and undefined tokens
		 */
		_replacePreviousUndefinedTokens: function () {
			var currentSpan = this._selectedSpans[0];
			var prevSpan = currentSpan.previousSibling;
			var aRemoveSpan;
			while (prevSpan && prevSpan.previousSibling) {
				if ((prevSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.WS && prevSpan.previousSibling.getAttribute(Constants.TOKEN_TYPE) ===
						Constants.UNDEFINED) || prevSpan.getAttribute(
						Constants.TOKEN_TYPE) === Constants.UNDEFINED) {
					aRemoveSpan = prevSpan;
					prevSpan = prevSpan.previousSibling;
					aRemoveSpan.remove();
					this.nIndexOfToken -= 1;
				} else {
					break;
				}
			}
			if (prevSpan && !prevSpan.previousSibling && prevSpan.getAttribute(Constants.TOKEN_TYPE) === Constants.UNDEFINED) {
				prevSpan.remove();
				this.nIndexOfToken -= 1;
			}
		},

		/*
		 * We need to create uuid for every token
		 * add reference to the token in case of an ID
		 * add property class, type, text
		 */
		_getItemFromSuggestionModel: function (oEvent, previousId) {
			this._attributeContext = false;
			this.isAssociation = false;
			var item = {};
			var oSource = oEvent.getSource();
			item.id = this._createUUID();
			if (oSource && oSource.getBindingContext()) {
				var oBindingContextObject = oSource.getBindingContext().getObject();
				item.dataObjectType = oBindingContextObject.type;
				// Rule containing Element context
				if (oBindingContextObject.ResultDataObjectId) {
					item.resultDataObjectId = oBindingContextObject.ResultDataObjectId

					if (oBindingContextObject.displayType && oBindingContextObject.displayType === "Rule" || item.resultDataObjectId) {
						// check if the result is of type element
						var termsProviderInstance = this._oAstExpressionLanguage._astBunldeInstance.TermsProvider.TermsProvider;
						var resultTerm = termsProviderInstance.getTermByTermId(oBindingContextObject.ResultDataObjectId);
						if (resultTerm && resultTerm.getIsDataObjectElement()) {
							this.ruleWithElementDO = true;
							item.dataObjectType = "ruleWithElementDO";
							item.cssClass = "sapAstObjectClass";
							item.tokenType = Constants.TERM;
							item.text = (oBindingContextObject.label !== null && oBindingContextObject.label !== "") ? oBindingContextObject.label :
								oBindingContextObject.name;

							item.bAddDotAutomatically = false;
							item.bAddSpaceAutoMatically = true;
							item.id = oBindingContextObject.id ? "/" + oBindingContextObject.id : "";
							item.reference = oBindingContextObject.id ? "/" + oBindingContextObject.id : "";
						} else {
							var item = this._createObjectSpanItem(item, previousId, oBindingContextObject);
						}
					}
				} else if (oBindingContextObject.type === Constants.Element) {
					item.tokenType = Constants.TERM;
					item.cssClass = "sapAstObjectClass";
					item.id = "";
					item.text = (oBindingContextObject.label !== null && oBindingContextObject.label !== "") ? oBindingContextObject.label :
						oBindingContextObject.name;
					//Add the ./ to Attributes if it has a relative path
					if (this.getDataObjectInfo() && this.isDotRequired) {
						item.reference = oBindingContextObject.id ? "./" + oBindingContextObject.id : "";
					} else {
						this.isDotRequired = true;
						item.reference = oBindingContextObject.id ? "/" + oBindingContextObject.id : "";
					}
					item.bAddDotAutomatically = false;
					item.bAddSpaceAutoMatically = true;
					if (previousId && previousId.indexOf("-") > 0) {
						previousId = previousId.substring(previousId.indexOf("-") + 1)
					}
					item.id = previousId !== '' ? previousId + Constants.DOT + oBindingContextObject.id : oBindingContextObject.id;
					var termsProvider = TermsProvider.getInstance();
					var term = termsProvider.getTermByTermId(item.id);
					//Setting reference to DO.attribute for element
					if (term && term._isDataObjectElement) {
						item._isDataObjectElement = true;
					}
				} else if ("type" in oBindingContextObject) {
					var item = this._createObjectSpanItem(item, previousId, oBindingContextObject);
				} else {
					item.text = oBindingContextObject.name;
					if (oBindingContextObject && "noOfMandatoryArgs" in oBindingContextObject) {
						if (oBindingContextObject.noOfMandatoryArgs === "0") {
							item.text += " ( )";
						} else {
							item.text += " (";
						}
					}
					item.bAddDotAutomatically = false;
					item.bAddSpaceAutoMatically = true;
				}
			} else if (oEvent.getParameter("tokens")) {
				var oValueHelpObject = oEvent.getParameter("tokens")[0].data("row");;
				item.text = oValueHelpObject.Value;
				item.bAddDotAutomatically = false;
				item.bAddSpaceAutoMatically = true;
				item.cssClass = "sapAstLiteralClass";
			} else if (oEvent.getSource().mProperties.jsonData) {
				item.text = oEvent.getSource().mProperties.value;
				item.json = oEvent.getSource().mProperties.jsonData;
				item.bAddDotAutomatically = false;
				item.bAddSpaceAutoMatically = true;
			} else {
				item.text = oEvent.getSource().mProperties.value.trim();
				item.bAddDotAutomatically = false;
				item.bAddSpaceAutoMatically = true;
			}
			//dataObject info is used for whereClause context and the attribute Context for select.
			if (this.getDataObjectInfo() && !this.bEditInBetween) {
				if (item.json) {
					this.dataObjectInfo += this._constructExpandedRelString(item.json);
				} else if(this.getIsAttributeContext()) {
                    this.dataObjectInfo += item.reference ? item.reference.replace(".","") : item.text;
                } else {
					this.dataObjectInfo += item.reference ? item.reference : item.text;
				}
				//Space should not be added only when it is an association
				if ((item.dataObjectType && item.dataObjectType !== "AO") || !item.dataObjectType) {
					this.dataObjectInfo += " ";
				}
			}
			if (oEvent.getSource().mProperties.label === Constants.DOT) {
				item.bAddDotAutomatically = false;
				item.bAddSpaceAutoMatically = false;
				this._attributeContext = true;
			}
			return item;
		},

		_createObjectSpanItem: function (item, previousId, oBindingContextObject) {
			item.tokenType = Constants.TERM;
			item.cssClass = "sapAstObjectClass";
			item.id = "";
			item.text = (oBindingContextObject.label !== null && oBindingContextObject.label !== "") ? oBindingContextObject.label :
				oBindingContextObject.name;
			if (oBindingContextObject.type !== Constants.ASSOCIATIONDOTYPE) {
				item.reference = oBindingContextObject.id ? "/" + oBindingContextObject.id : "";
				if (previousId && previousId.indexOf("-") > 0) {
					previousId = previousId.substring(previousId.indexOf("-") + 1)
				}
				item.id = previousId !== '' ? previousId + Constants.DOT + oBindingContextObject.id : oBindingContextObject.id;

			} else {
				this.isAssociation = true;
				//Add the ./ to Associations if it has a relative path
				if (this.getDataObjectInfo() && this.isDotRequired) {
					item.reference = oBindingContextObject.id ? "./" + oBindingContextObject.id : "";
					this.isDotRequired = false;
				} else {
					item.reference = oBindingContextObject.id ? "/" + oBindingContextObject.id : "";
				}
				item.id += oBindingContextObject.id;
			}
			//If in where condition we have an Association we donot require a dot for Attribute.
			if (this.getDataObjectInfo()) {
				this.isDotRequired = false;
			}
			this._attributeContext = true;
			item.bAddDotAutomatically = true;
			item.bAddSpaceAutoMatically = false;
			if (this._uiModel && this._uiModel.length > 0 && this._uiModel[0] && "getText" in this._uiModel[0] && (this._uiModel[0].getText().toUpperCase() ===
				Constants.UPDATE || this._uiModel[0].getText().toUpperCase() === Constants.APPEND) && this.getOperationsContext() &&
				!this.getConditionContext()) {
				this._attributeContext = false;
				item.bAddDotAutomatically = false;
				item.bAddSpaceAutoMatically = false;
				this.isDotRequired = false;
			}
			return item;
		},

		/*
		 * popover control for autosuggestions
		 */
		_createPopver: function () {
			var that = this;
			if (!this._oAutoSuggestionPopUp) {
				this._oAutoSuggestionPopUp = new ResponsivePopover({
					content: new sap.rules.ui.AutoCompleteSuggestionContent(),
					showArrow: false,
					placement: PlacementType.Vertical,
					horizontalScrolling: true,
					showHeader: false,
					contentWidth: "400px",
					initialFocus: that, //To keep focus on input even after popup is opened
					afterOpen: function () { //Needed to set cursor for text rule
                        var position;
                        if (that.bEditInBetween) {
                            position = that.filterTextLength;
                        } else {
                            position = that._selectedSpans[0].textContent.length;
                        }
                        var caretPosition = that._cursorPostion === 0 ? 0 : position;
                        that._setCaretPosition({
                            spanIndex: that.nIndexOfToken,
                            position: caretPosition
                        });
					}
				});
			}
		},

		//Gets caret position
		_getCaretPosition: function (oItem, iStart) {
			var oRange, oSelectedObj, aChildNodes,
				iAncestorCount = 0;
			var fnCheckCurrent = function (oNode) {
				return (oItem && oNode === oItem) ||
					(!oItem && (oNode === oSelectedObj.anchorNode || oNode === oSelectedObj.anchorNode.parentNode));
			};

			var fnProcessNode = function (oNode) {
				var oChild;
				if (fnCheckCurrent(oNode)) {
					return false;
				}
				// we check whether the node is text node itself or it is another span
				// when pasting input span can contains another spans
				// <span>text<span>another text</span></span>
				if (oNode.nodeType === 3 /*text node*/ ) {
					iAncestorCount += oNode.textContent.length;
				} else {
					for (var i = 0; i < oNode.childNodes.length; i++) {
						oChild = oNode.childNodes[i];
						if (fnCheckCurrent(oChild)) {
							return false;
						}

						iAncestorCount += oChild.textContent.length;
					}
				}

				return true;
			};

			try {
				if (window.getSelection && window.getSelection().getRangeAt) {
					oRange = window.getSelection().getRangeAt(0);
					oSelectedObj = window.getSelection();
					aChildNodes = this._input[0].childNodes;
					// iterate through all child nodes (NOT CHILDREN)
					// if it is text itself add it if it is span (or more nested spans) iterate through them too
					// till we find selected object - may be span or text
					for (var i = 0; i < aChildNodes.length; i++) {
						if (!fnProcessNode(aChildNodes[i])) {
							break;
						}
					}
					return (iStart || oRange.startOffset) + iAncestorCount;
				}
			} catch (e) {
				return this._cursorPostion;
			}

			return 0;
		},

		/*
		 * gets the selected span information
		 */
		_getSelectedSpans: function () {
			var oSelObj = window.getSelection();
			var collection = new Array(); // Collection of Elements
			if ("getRangeAt" in oSelObj) {
				var rangeObject = oSelObj.getRangeAt(0);
				if (rangeObject.startContainer == rangeObject.endContainer) {
					collection.push(rangeObject.startContainer.parentNode);
				} else {
					var firstElement = $(rangeObject.startContainer.parentNode); // First Element
					var lastElement = $(rangeObject.endContainer.parentNode); // Last Element
					collection.push(firstElement); // Add First Element to Collection
					$(rangeObject.startContainer.parentNode).nextAll().each(function () { // Traverse all siblings
						var siblingID = $(this).attr('id'); // Get Sibling ID
						if (siblingID != $(lastElement).attr('id')) { // If Sib is not LastElement
							collection.push($(this)); // Add Sibling to Collection
						} else { // Else, if Sib is LastElement
							collection.push(lastElement); // Add Last Element to Collection
							return false; // Break Loop
						}
					});
				}
			} else {
				collection.push(oSelObj.anchorNode.parentNode);
			}
			return collection;
		},

		_createRange: function (node, chars, range) {
			if (!range) {
				range = document.createRange();
				range.selectNode(node);
				range.setStart(node, 0);
			}

			if (chars.count === 0) {
				range.setEnd(node, chars.count);
			} else if (node && chars.count > 0) {
				if (node.nodeType === Node.TEXT_NODE) {
					if (node.textContent != undefined && node.textContent.length < chars.count) {
						chars.count -= node.textContent.length;
					} else {
						range.setEnd(node, chars.count);
						chars.count = 0;
					}
				} else {
					for (var lp = 0; lp < node.childNodes.length; lp++) {
						range = this._createRange(node.childNodes[lp], chars, range);
						if (chars.count === 0) {
							break;
						}
					}
				}
			}
			return range;
		},

		/*
		 * once the text is added and new cursor position is set,
		 * we need to set the current cursor position
		 */
		_setCurrentCursorPosition: function (chars) {
			if (chars >= 0) {
				var selection = window.getSelection();
				var range = this._createRange(
					$("#" + this.getDomRef("input").id)[0], {
						count: chars
					});
				if (range) {
					range.collapse(false);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}
		},

		/*
		 * every time we push in a new token to the uimodel, the data has to be updated
		 * so that the string generated is always in sync
		 */
		_updateUiModel: function () {
			var that = this;
			if (this.getDomRef("input")) {
				var children = this.getDomRef("input").children;
				that._uiModel = [];
				for (var iterator = 0; iterator < children.length; iterator++) {
					var reference = children[iterator].getAttribute(Constants.TOKEN_TYPE) !== Constants.GEOBUSINESSDATATYPE ? children[iterator].getAttribute(
						Constants.REFERENCE) : undefined;
					var json = children[iterator].getAttribute(Constants.JSON);
					var item = {
						"id": children[iterator].id,
						"cssClass": children[iterator].className,
						"reference": reference,
						"tokenType": children[iterator].getAttribute(Constants.TOKEN_TYPE),
						"text": children[iterator].textContent
					};
					if (json) {
						try {
							item.json = JSON.parse(json);
						} catch (e) {
							jQuery.sap.log.error("Error in parsing string to JSON: " + e.message);
						}
					}
					this._uiModel.push(item);
				}
				that._uiModeltoString();
			}

		},

		/*
		 * here, we loop through the uiModel and update the relstring
		 */
		_uiModeltoString: function () {
			var that = this;
			that.relString = "";
			that._jsonArray = [];
			this._uiModel.forEach(function (item, index) {
				if (item.reference) {
					that.relString += item.reference;
				} else if (item.json) {
					that.relString += that._constructExpandedRelString(item.json);
					that._jsonArray.push(item.json);
				} else {
					that.relString += item.text;
				}
			});
			return that.relString;
		},

		/*
		 * Returns the index of the span in which cursor position is currently while editing in between
		 * and temporary rel string till previous span
		 */
		_calculateStringAndIndexOfNewToken: function () {
			var that = this;
			var tempRelString = "";
			var text = "";
			if (this.getDomRef("input")) {
				var children = this.getDomRef("input").children;
				var spanId = this._selectedSpans ? this._selectedSpans[0].id : "";
				for (var iterator = 0; iterator < children.length; iterator++) {
					var reference = children[iterator].getAttribute(Constants.TOKEN_TYPE) !== Constants.GEOBUSINESSDATATYPE ? children[iterator].getAttribute(
						Constants.REFERENCE) : undefined;
					var json = children[iterator].getAttribute(Constants.JSON);

					if (json) {
						try {
							json = JSON.parse(json);
						} catch (e) {
							jQuery.sap.log.error("Error in parsing string to JSON: " + e.message);
						}
					}
					if (children[iterator].id === spanId) {
						this.nIndexOfToken = iterator;
						var fullText = text + children[iterator].textContent;
						var spanText = children[iterator].textContent;
						var lengthOfText = fullText.length - this._cursorPostion;
						this.filterTextLength = lengthOfText >= 0 ? spanText.length - lengthOfText : spanText.length;
						var filterText = this.filterTextLength < 0 ? spanText : spanText.slice(0, this.filterTextLength);
						this.filterText = filterText;
						if (reference) {
							tempRelString += this._constructReferenceForFilter(filterText, reference, lengthOfText);
						} else if (json) {
							tempRelString += that._constructExpandedRelString(json);
						} else {
							tempRelString += filterText;
						}

						break;
					}

					text += children[iterator].textContent;
					if (reference) {
						tempRelString += reference;
					} else if (json) {
						tempRelString += that._constructExpandedRelString(json);
					} else {
						tempRelString += children[iterator].textContent;
					}
				}
			}
			return tempRelString;
		},

		//Constructs reference of the span for filter text
		_constructReferenceForFilter: function (filterText, reference, lengthOfText) {
			var dotArray = filterText.split(".");
			var referenceArray = reference.split("/");
			var ref = "";
			if ((lengthOfText <= 0 && dotArray.length === 0) || (this._enableAggregateFunctionWhereClause && reference && lengthOfText <= 0)) {
				return reference;
			}
			if (dotArray.length > 1) {
				if (lengthOfText <= 0) {
					if (this.bTypingFlow) {
						return reference + dotArray[dotArray.length - 1];
					} else {
						return reference;
					}
				}
				for (var i = 1; i < dotArray.length; i++) {
					ref += "/" + referenceArray[i];
				}
				ref += dotArray[dotArray.length - 1];
				this._attributeContext = true;
			} else {
				ref = filterText;
                this._attributeContext = false;
			}
			return ref;
		},

		// getting selected span from index
		_getSelectedSpanFromIndex: function () {
			if (this.getDomRef("input")) {
				var children = this.getDomRef("input").children;
				this._selectedSpans = $(children[this.nIndexOfToken]);
			}
		},

		// getting selected span from given index
		_getSelectedSpanGivenIndex: function (iIndex) {
			if (this.getDomRef("input")) {
				var children = this.getDomRef("input").children;
				if (children[iIndex]) {
					return $(children[iIndex]);
				} else {
					return null;
				}
			}
		},

		_isChildOf: function (node, parentId) {
			while (node !== null) {
				if (node.id === parentId) {
					return true;
				}
				node = node.parentNode;
			}

			return false;
		},

		/*
		 * gets the current cursor position
		 */
		_getCurrentCursorPosition: function () {
			var parentId = this.getDomRef("input").id;
			var selection = window.getSelection(),
				charCount = -1,
				node;

			if (selection.focusNode) {
				if (this._isChildOf(selection.focusNode, parentId)) {
					node = selection.focusNode;
					charCount = selection.focusOffset;

					while (node) {
						if (node.id === parentId) {
							break;
						}

						if (node.previousSibling) {
							node = node.previousSibling;
							charCount += node.textContent.length;
						} else {
							node = node.parentNode;
							if (node === null) {
								break
							}
						}
					}
				}
			}

			return charCount;
		},
		
		// when access mode is changed to hidden, change the astexpression basic to error state
		_hiddenAccessModeSelected: function (oEvent, oData, hiddenAstCtrl) {
			if (this._input && this._input[0].id === hiddenAstCtrl.expId) {
				this._input[0].classList.add("sapAstExpressionInputError");
				this._input[0].title = this.oBundle.getText("PredefinedResultsValueStateText");
				this.expId = hiddenAstCtrl.expId
			}
		},

		_validateControl: function () {
			var valueState = this.getValueState();
			var valueStateText = this.getValueStateText();
			if ((this.astresponseNodes && this.astresponseNodes.length === 1 && this.astresponseNodes[0].Type === "I") && this.astresponseNodes[
					0]
				.Value !== "" || (this.astresponseNodes && valueState === "Error")) {
				this._input[0].classList.add("sapAstExpressionInputError");
				if (valueStateText) {
					this._input[0].title = valueStateText;
				} else {
					this._input[0].title = this.oBundle.getText("invalidExpression");
				}
			} else if (this.oBundle.getText("PredefinedResultsValueStateText") === valueStateText) {
				this._input[0].classList.add("sapAstExpressionInputError");
				if (valueStateText) {
					this._input[0].title = valueStateText;
				} else {
					this._input[0].title = this.oBundle.getText("invalidExpression");
				}
			} else if (this._input[0].classList.contains("sapAstExpressionInputError") && this._input[0].textContent === "") {
				/* 1.handles case when multiple attributes are changed to hidden and entered value for a hidden attr is deleted
				   2.handles case when hidden is chosen and user simply focuses out without expression
				*/
				this._input[0].classList.add("sapAstExpressionInputError");
				this._input[0].title = this.oBundle.getText("PredefinedResultsValueStateText");
				this.expId = "";
			} else if (this._input[0].id === this.expId && this._input[0].textContent !== "") {
				// when a hidden attribute is chosen 
				this._input[0].classList.add("sapAstExpressionInputError");
				this._input[0].title = this.oBundle.getText("PredefinedResultsValueStateText");
				this.expId = "";
			}  else {
				// When you have an error and have rectified it or if hidden was chosen and value is entered, we remove the css
				if (this._input[0].classList.contains("sapAstExpressionInputError")) {
					this._input[0].classList.remove("sapAstExpressionInputError");
				}
			}
				
 	    }
	});

	return AstExpressionBasic;
},
/* bExport= */
true);

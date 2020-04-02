sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"./library",
	"sap/ui/core/Control",
	"sap/m/List",
	"sap/ui/model/json/JSONModel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionVocabularyPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionFixedValuePanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionMathematicalOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionComparisionOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionLogicalOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionAggregateFunctionPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionArrayOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionRangeOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionMiscellaneousOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionFunctionalOperatorPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionAdvancedFunctionPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionTimeAndDurationFunctionPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionSelectFunctionPanel",
	"sap/rules/ui/ast/autoCompleteContent/AutoSuggestionOperationsPanel",

], function (jQuery, library, Control, List, JSONModel, AutoSuggestionVocabularyPanel, AutoSuggestionFixedValuePanel,
	AutoSuggestionMathematicalOperatorPanel,
	AutoSuggestionComparisionOperatorPanel, AutoSuggestionLogicalOperatorPanel, AutoSuggestionAggregateFunctionPanel,
	AutoSuggestionArrayOperatorPanel, AutoSuggestionRangeOperatorPanel, AutoSuggestionMiscellaneousOperatorPanel,
	AutoSuggestionFunctionalOperatorPanel, AutoSuggestionAdvancedFunctionPanel, AutoSuggestionTimeAndDurationFunctionPanel,
	AutoSuggestionSelectFunctionPanel, AutoSuggestionOperationsPanel) {
	"use strict";

	var AutoCompleteSuggestionContent = Control.extend("sap.rules.ui.AutoCompleteSuggestionContent", {
		metadata: {
			library: "sap.rules.ui",
			properties: {
				reference: {
					type: "object",
					defaultValue: null,
				},
				dialogOpenedCallbackReference: {
					type: "object",
					defaultValue: null,
				},
				content: {
					type: "object",
					defaultValue: null
				},
				vocabularyInfo: {
					type: "object",
					defaultValue: null
				},
				enableAggregateFunctionVocabulary: {
					type: "boolean",
					defaultValue: false
				},
				enableAggregateFunctionWhereClause: {
					type: "boolean",
					defaultValue: false
				},
                expand: {
                    type: "boolean",
                    defaultValue: false
                }
			},
			aggregations: {
				mainLayout: {
					type: "sap.m.List",
					multiple: false
				}
			},
			events: {}
		},

		init: function () {
			this.infraUtils = new sap.rules.ui.parser.infrastructure.util.utilsBase.lib.utilsBaseLib();
			this.initializeVariables();
			this.needCreateLayout = true;
		},
		onBeforeRendering: function () {
			this._reference = this.getReference();
			this._enableAggregateFunctionVocabulary = this.getEnableAggregateFunctionVocabulary();
			this._enableAggregateFunctionWhereClause = this.getEnableAggregateFunctionWhereClause();
			this._dialogOpenedCallbackReference = this.getDialogOpenedCallbackReference();
			if (this.needCreateLayout) {
				var layout = this._createLayout();
				this.setAggregation("mainLayout", layout, true);
				this.needCreateLayout = false;
				this._getAutoSuggestionList();
			}
		},

		initializeVariables: function () {},

		_createLayout: function () {
			return new sap.m.List();
		},

		_getAutoSuggestionList: function () {
			var that = this;
			this.autoSuggestions = this.getContent();
			this.businessDataTypeList = this.autoSuggestions.businessDataTypeList;
			if (this.autoSuggestions && this.autoSuggestions.categories) {
				if (this.autoSuggestions.categories.terms) {
					this.VocabularyTerms = this.autoSuggestions.categories.terms;
				} 
				if (this.autoSuggestions.categories.operations) {
					this.Operations = this.autoSuggestions.categories.operations;
				}
			}

			this.suggestionContext = this.autoSuggestions.suggestionContext; //this._getResponseVocabularyData().autoComplete.suggestionContext;
			
			//Operations section - applicable only for text rule 
			if (this.Operations && this.Operations.length > 0 ) {
				var operationsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionOperationsPanel({
					reference: that._reference,
					data: that.Operations
				});
				this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
					content: operationsPanel
				}));
			}
				
			// Vocabulary Section
			if (this.VocabularyTerms && this.VocabularyTerms.length > 0) {
				this.VocabularyTerms = this._handleMissingLabels(this.VocabularyTerms);
				var vocabularyPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionVocabularyPanel({
					reference: that._reference,
					dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
					data: that.VocabularyTerms,
					context: that.suggestionContext
				});
				this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
					content: vocabularyPanel
				}));
			}
			
			// Rules Section
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.vocabularyRules) {
				this.rules = this.autoSuggestions.categories.vocabularyRules;
			}

			// Fixed Value Section
			if (this.autoSuggestions.showLiteral && !this._enableAggregateFunctionVocabulary) {
				var fixedValuePanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionFixedValuePanel({
					reference: that._reference,
					vocabularyInfo: that.getVocabularyInfo(),
					dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
					data: this.autoSuggestions,
                    inputValue: this.autoSuggestions.literalInput
				});
				this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
					content: fixedValuePanel
				}));

			}

			// Operators Section
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.operators && !this._enableAggregateFunctionVocabulary) {
				this.VocabularyOperators = this.autoSuggestions.categories.operators;
				//Arithmetic Operators
				if (this.VocabularyOperators.arithmetic && this.VocabularyOperators.arithmetic.length > 0) {
					var mathematicalOperatorsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionMathematicalOperatorPanel({
						reference: that._reference,
						data: this.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: mathematicalOperatorsPanel
					}));
				}
				// comparision operators
				if (this.VocabularyOperators.comparision && this.VocabularyOperators.comparision.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var comparisonOperatorsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionComparisionOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: comparisonOperatorsPanel
					}));
				}
				// logical operators
				if (this.VocabularyOperators.logical && this.VocabularyOperators.logical.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var logicalOperatorsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionLogicalOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: logicalOperatorsPanel
					}));
				}
				// array operators
				if (this.VocabularyOperators.array && this.VocabularyOperators.array.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var arrayOperatorsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionArrayOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: arrayOperatorsPanel
					}));
				}
				// range operators
				if (this.VocabularyOperators.range && this.VocabularyOperators.range.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var rangeOperatorsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionRangeOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: rangeOperatorsPanel
					}));
				}

				// functional operators
				if (this.VocabularyOperators.functional && this.VocabularyOperators.functional.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var functionalOperatorsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionFunctionalOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: functionalOperatorsPanel
					}));
				}

			}
			// Advanced Functions
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.functions && !this._enableAggregateFunctionVocabulary) {
				this.fuctions = this.autoSuggestions.categories.functions;
				if (this.fuctions.advanced) {
					var AdvancedFunctionsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionAdvancedFunctionPanel({
						reference: that._reference,
						data: that.fuctions.advanced,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: AdvancedFunctionsPanel
					}));
				}
			}

			// Time And Duration Functions
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.functions && !this._enableAggregateFunctionVocabulary) {
				this.fuctions = this.autoSuggestions.categories.functions;
				if (this.fuctions.time_duration) {
					var TimeAndDurationFunctionsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionTimeAndDurationFunctionPanel({
						reference: that._reference,
						data: that.fuctions.time_duration,
						dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: TimeAndDurationFunctionsPanel
					}));
				}
			}

			// Miscellaneous Operators
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.operators && !this._enableAggregateFunctionVocabulary) {
				this.VocabularyOperators = this.autoSuggestions.categories.operators;
				if (this.VocabularyOperators.miscellaneous && this.VocabularyOperators.miscellaneous.length > 0 && !this._enableAggregateFunctionVocabulary) {
					var miscellaneousOperatorsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionMiscellaneousOperatorPanel({
						reference: that._reference,
						data: that.VocabularyOperators,
                        expand: this.getExpand()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: miscellaneousOperatorsPanel
					}));
				}
			}
			// Select functions
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.functions) {
				this.fuctions = this.autoSuggestions.categories.functions;
				if (this.fuctions.selection) {
					var SelectFunctionsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionSelectFunctionPanel({
						reference: that._reference,
						dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
						data: that.fuctions,
						astExpressionLanguage: that.getVocabularyInfo()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: SelectFunctionsPanel,
					}));
				}
			}
			// Aggregate Functions
			if (this.autoSuggestions && this.autoSuggestions.categories && this.autoSuggestions.categories.functions && !this._enableAggregateFunctionVocabulary &&
				!this._enableAggregateFunctionWhereClause) {
				this.fuctions = this.autoSuggestions.categories.functions;
				if (this.fuctions.aggregate) {
					var AggregateFunctionsPanel = new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionAggregateFunctionPanel({
						reference: that._reference,
						dialogOpenedCallbackReference: that._dialogOpenedCallbackReference,
						data: that.fuctions,
						astExpressionLanguage: that.getVocabularyInfo()
					});
					this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({
						content: AggregateFunctionsPanel,
					}));
				}
			}

		},

		_handleMissingLabels: function (data) {
			for (var entry in data) {
				if (!data[entry].label) {
					data[entry].label = data[entry].name;
				}
			}
			return data;
		},

		_containsRequestedBusinessDataTypeInTheList: function (searchType) {
			for (var entry in this.businessDataTypeList) {
				if (this.businessDataTypeList[entry] === searchType) {
					return true;
				}
			}
			return false;
		}

	});

	return AutoCompleteSuggestionContent;

}, /* bExport= */ true);
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/Control","sap/m/List","sap/ui/model/json/JSONModel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionVocabularyPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionFixedValuePanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionMathematicalOperatorPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionComparisionOperatorPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionLogicalOperatorPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionAggregateFunctionPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionArrayOperatorPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionRangeOperatorPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionMiscellaneousOperatorPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionFunctionalOperatorPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionAdvancedFunctionPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionTimeAndDurationFunctionPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionSelectFunctionPanel","sap/rules/ui/ast/autoCompleteContent/AutoSuggestionOperationsPanel",],function(q,l,C,L,J,A,a,b,c,d,e,f,g,h,i,j,k,m,n){"use strict";var o=C.extend("sap.rules.ui.AutoCompleteSuggestionContent",{metadata:{library:"sap.rules.ui",properties:{reference:{type:"object",defaultValue:null,},dialogOpenedCallbackReference:{type:"object",defaultValue:null,},content:{type:"object",defaultValue:null},vocabularyInfo:{type:"object",defaultValue:null},enableAggregateFunctionVocabulary:{type:"boolean",defaultValue:false},enableAggregateFunctionWhereClause:{type:"boolean",defaultValue:false},expand:{type:"boolean",defaultValue:false}},aggregations:{mainLayout:{type:"sap.m.List",multiple:false}},events:{}},init:function(){this.infraUtils=new sap.rules.ui.parser.infrastructure.util.utilsBase.lib.utilsBaseLib();this.initializeVariables();this.needCreateLayout=true;},onBeforeRendering:function(){this._reference=this.getReference();this._enableAggregateFunctionVocabulary=this.getEnableAggregateFunctionVocabulary();this._enableAggregateFunctionWhereClause=this.getEnableAggregateFunctionWhereClause();this._dialogOpenedCallbackReference=this.getDialogOpenedCallbackReference();if(this.needCreateLayout){var p=this._createLayout();this.setAggregation("mainLayout",p,true);this.needCreateLayout=false;this._getAutoSuggestionList();}},initializeVariables:function(){},_createLayout:function(){return new sap.m.List();},_getAutoSuggestionList:function(){var t=this;this.autoSuggestions=this.getContent();this.businessDataTypeList=this.autoSuggestions.businessDataTypeList;if(this.autoSuggestions&&this.autoSuggestions.categories){if(this.autoSuggestions.categories.terms){this.VocabularyTerms=this.autoSuggestions.categories.terms;}if(this.autoSuggestions.categories.operations){this.Operations=this.autoSuggestions.categories.operations;}}this.suggestionContext=this.autoSuggestions.suggestionContext;if(this.Operations&&this.Operations.length>0){var p=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionOperationsPanel({reference:t._reference,data:t.Operations});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:p}));}if(this.VocabularyTerms&&this.VocabularyTerms.length>0){this.VocabularyTerms=this._handleMissingLabels(this.VocabularyTerms);var v=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionVocabularyPanel({reference:t._reference,dialogOpenedCallbackReference:t._dialogOpenedCallbackReference,data:t.VocabularyTerms,context:t.suggestionContext});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:v}));}if(this.autoSuggestions&&this.autoSuggestions.categories&&this.autoSuggestions.categories.vocabularyRules){this.rules=this.autoSuggestions.categories.vocabularyRules;}if(this.autoSuggestions.showLiteral&&!this._enableAggregateFunctionVocabulary){var r=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionFixedValuePanel({reference:t._reference,vocabularyInfo:t.getVocabularyInfo(),dialogOpenedCallbackReference:t._dialogOpenedCallbackReference,data:this.autoSuggestions,inputValue:this.autoSuggestions.literalInput});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:r}));}if(this.autoSuggestions&&this.autoSuggestions.categories&&this.autoSuggestions.categories.operators&&!this._enableAggregateFunctionVocabulary){this.VocabularyOperators=this.autoSuggestions.categories.operators;if(this.VocabularyOperators.arithmetic&&this.VocabularyOperators.arithmetic.length>0){var s=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionMathematicalOperatorPanel({reference:t._reference,data:this.VocabularyOperators,expand:this.getExpand()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:s}));}if(this.VocabularyOperators.comparision&&this.VocabularyOperators.comparision.length>0&&!this._enableAggregateFunctionVocabulary){var u=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionComparisionOperatorPanel({reference:t._reference,data:t.VocabularyOperators,expand:this.getExpand()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:u}));}if(this.VocabularyOperators.logical&&this.VocabularyOperators.logical.length>0&&!this._enableAggregateFunctionVocabulary){var w=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionLogicalOperatorPanel({reference:t._reference,data:t.VocabularyOperators,expand:this.getExpand()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:w}));}if(this.VocabularyOperators.array&&this.VocabularyOperators.array.length>0&&!this._enableAggregateFunctionVocabulary){var x=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionArrayOperatorPanel({reference:t._reference,data:t.VocabularyOperators,expand:this.getExpand()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:x}));}if(this.VocabularyOperators.range&&this.VocabularyOperators.range.length>0&&!this._enableAggregateFunctionVocabulary){var y=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionRangeOperatorPanel({reference:t._reference,data:t.VocabularyOperators,expand:this.getExpand()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:y}));}if(this.VocabularyOperators.functional&&this.VocabularyOperators.functional.length>0&&!this._enableAggregateFunctionVocabulary){var z=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionFunctionalOperatorPanel({reference:t._reference,data:t.VocabularyOperators,expand:this.getExpand()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:z}));}}if(this.autoSuggestions&&this.autoSuggestions.categories&&this.autoSuggestions.categories.functions&&!this._enableAggregateFunctionVocabulary){this.fuctions=this.autoSuggestions.categories.functions;if(this.fuctions.advanced){var B=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionAdvancedFunctionPanel({reference:t._reference,data:t.fuctions.advanced,expand:this.getExpand()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:B}));}}if(this.autoSuggestions&&this.autoSuggestions.categories&&this.autoSuggestions.categories.functions&&!this._enableAggregateFunctionVocabulary){this.fuctions=this.autoSuggestions.categories.functions;if(this.fuctions.time_duration){var T=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionTimeAndDurationFunctionPanel({reference:t._reference,data:t.fuctions.time_duration,dialogOpenedCallbackReference:t._dialogOpenedCallbackReference,expand:this.getExpand()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:T}));}}if(this.autoSuggestions&&this.autoSuggestions.categories&&this.autoSuggestions.categories.operators&&!this._enableAggregateFunctionVocabulary){this.VocabularyOperators=this.autoSuggestions.categories.operators;if(this.VocabularyOperators.miscellaneous&&this.VocabularyOperators.miscellaneous.length>0&&!this._enableAggregateFunctionVocabulary){var D=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionMiscellaneousOperatorPanel({reference:t._reference,data:t.VocabularyOperators,expand:this.getExpand()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:D}));}}if(this.autoSuggestions&&this.autoSuggestions.categories&&this.autoSuggestions.categories.functions){this.fuctions=this.autoSuggestions.categories.functions;if(this.fuctions.selection){var S=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionSelectFunctionPanel({reference:t._reference,dialogOpenedCallbackReference:t._dialogOpenedCallbackReference,data:t.fuctions,astExpressionLanguage:t.getVocabularyInfo()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:S,}));}}if(this.autoSuggestions&&this.autoSuggestions.categories&&this.autoSuggestions.categories.functions&&!this._enableAggregateFunctionVocabulary&&!this._enableAggregateFunctionWhereClause){this.fuctions=this.autoSuggestions.categories.functions;if(this.fuctions.aggregate){var E=new sap.rules.ui.ast.autoCompleteContent.AutoSuggestionAggregateFunctionPanel({reference:t._reference,dialogOpenedCallbackReference:t._dialogOpenedCallbackReference,data:t.fuctions,astExpressionLanguage:t.getVocabularyInfo()});this.getAggregation("mainLayout").addItem(new sap.m.CustomListItem({content:E,}));}}},_handleMissingLabels:function(p){for(var r in p){if(!p[r].label){p[r].label=p[r].name;}}return p;},_containsRequestedBusinessDataTypeInTheList:function(s){for(var p in this.businessDataTypeList){if(this.businessDataTypeList[p]===s){return true;}}return false;}});return o;},true);

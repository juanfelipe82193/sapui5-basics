// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchHelper','sap/ushell/renderers/fiori2/search/suggestions/SinaBaseSuggestionProvider','sap/ushell/renderers/fiori2/search/suggestions/SuggestionType','sap/ushell/renderers/fiori2/search/suggestions/SinaObjectSuggestionFormatter','sap/ushell/renderers/fiori2/search/SearchConfiguration'],function(S,a,b,c,d){"use strict";jQuery.sap.declare('sap.ushell.renderers.fiori2.search.suggestions.SinaSuggestionProvider');var m=sap.ushell.renderers.fiori2.search.suggestions.SinaSuggestionProvider=function(){this.init.apply(this,arguments);};m.prototype=jQuery.extend(new a(),{suggestionLimit:jQuery.device.is.phone?5:7,suggestionStartingCharacters:d.getInstance().suggestionStartingCharacters,init:function(p){a.prototype.init.apply(this,arguments);this.dataSourceDeferred=null;this.suggestionQuery=this.sinaNext.createSuggestionQuery();this.sinaObjectSuggestionFormatter=new c(this);},abortSuggestions:function(){this.suggestionQuery.abort();},getSuggestions:function(f){var t=this;this.suggestions=[];this.firstObjectDataSuggestion=true;this.numberSuggestionsByType={};for(var i=0;i<b.types.length;++i){var s=b.types[i];this.numberSuggestionsByType[s]=0;}var e=f.searchTerm;if(this.suggestionTypes.length===1&&this.suggestionTypes.indexOf(b.SearchTermData)>=0&&e.length<this.suggestionStartingCharacters){return jQuery.when(this.suggestions);}if(this.suggestionTypes.length===1&&this.suggestionTypes.indexOf(b.Object)>=0&&e.length<this.suggestionStartingCharacters){return jQuery.when(this.suggestions);}if(this.suggestionTypes.length===1&&this.suggestionTypes.indexOf(b.DataSource)>=0&&t.model.getDataSource()!==t.model.sinaNext.allDataSource){return jQuery.when(this.suggestions);}t.createAllAndAppDsSuggestions();if(!t.model.config.searchBusinessObjects){return jQuery.when(this.suggestions);}if(t.model.getDataSource()===t.model.appDataSource){return jQuery.when(this.suggestions);}t.prepareSuggestionQuery(f);return t.suggestionQuery.getResultSetAsync().then(function(r){var g=r.items;t.formatSinaSuggestions(g);return t.suggestions;});},createAllAndAppDsSuggestions:function(){if(this.suggestionTypes.indexOf(b.DataSource)<0){return;}if(this.model.getDataSource()!==this.model.allDataSource){return;}var e=[];e.unshift(this.model.appDataSource);e.unshift(this.model.allDataSource);var s=this.model.getProperty('/uiFilter/searchTerm');var f=s.replace(/\*/g,'');var t=new S.Tester(f);for(var i=0;i<e.length;++i){var g=e[i];if(g.id===this.model.getDataSource().id){continue;}var T=t.test(g.label);if(T.bMatch===true){if(this.isSuggestionLimitReached(b.DataSource)){return;}var h={};h.label='<i>'+sap.ushell.resources.i18n.getText("searchInPlaceholder",[""])+'</i> '+T.sHighlightedText;h.dataSource=g;h.position=b.properties.DataSource.position;h.type=this.sinaNext.SuggestionType.DataSource;h.calculationMode=this.sinaNext.SuggestionCalculationMode.Data;h.uiSuggestionType=b.DataSource;h.uiSuggestionType=b.DataSource;this.addSuggestion(h);}}},isSuggestionLimitReached:function(s){var l=this.suggestionHandler.getSuggestionLimit(s);var n=this.numberSuggestionsByType[s];if(n>=l){return true;}return false;},preFormatSuggestions:function(s){for(var i=0;i<s.length;++i){var e=s[i];e.uiSuggestionType=this.getSuggestionType(e);e.position=b.properties[e.uiSuggestionType].position;this.assembleKey(e);if(e.childSuggestions){this.preFormatSuggestions(e.childSuggestions);}}},assembleKey:function(s){switch(s.uiSuggestionType){case b.DataSource:s.key=b.DataSource+s.dataSource.id;break;case b.SearchTermData:s.key=b.SearchTermData+s.searchTerm;if(s.dataSource){s.key+=s.dataSource.id;}break;case b.SearchTermHistory:s.key=b.SearchTermData+s.searchTerm;if(s.dataSource){s.key+=s.dataSource.id;}break;case b.Object:s.key=b.Object+s.object.title;break;}},formatSinaSuggestions:function(s){this.preFormatSuggestions(s);for(var i=0;i<s.length;++i){var e=s[i];if(this.isSuggestionLimitReached(e.uiSuggestionType)){continue;}switch(e.uiSuggestionType){case b.DataSource:if(this.model.getDataSource()!==this.model.allDataSource){continue;}this.addSuggestion(e);break;case b.SearchTermData:this.formatSearchTermDataSuggestion(e);break;case b.SearchTermHistory:this.addSuggestion(e);break;case b.Object:this.sinaObjectSuggestionFormatter.format(this,e);break;default:break;}}return this.suggestions;},addSuggestion:function(s){this.suggestions.push(s);this.numberSuggestionsByType[s.uiSuggestionType]+=1;},formatSearchTermDataSuggestion:function(s){if(this.model.getDataSource()===this.model.allDataSource){if(this.firstObjectDataSuggestion){this.firstObjectDataSuggestion=false;if(s.childSuggestions.length>0){s.label=this.assembleSearchInSuggestionLabel(s);s.grouped=true;this.addSuggestion(s);this.addChildSuggestions(s);}else{this.addSuggestion(s);}}else{this.addSuggestion(s);}}else{this.addSuggestion(s);}},addChildSuggestions:function(s){for(var i=0;i<Math.min(2,s.childSuggestions.length);++i){if(this.isSuggestionLimitReached(b.SearchTermData)){return;}var e=s.childSuggestions[i];e.label=this.assembleSearchInSuggestionLabel(e);e.grouped=true;this.addSuggestion(e);}},assembleSearchInSuggestionLabel:function(s){return sap.ushell.resources.i18n.getText("resultsIn",['<span>'+s.label+'</span>',s.filter.dataSource.labelPlural]);},getSuggestionType:function(s){switch(s.type){case this.sinaNext.SuggestionType.SearchTerm:if(s.calculationMode===this.sinaNext.SuggestionCalculationMode.History){return b.SearchTermHistory;}return b.SearchTermData;case this.sinaNext.SuggestionType.SearchTermAndDataSource:if(s.calculationMode===this.sinaNext.SuggestionCalculationMode.History){return b.SearchTermHistory;}return b.SearchTermData;case this.sinaNext.SuggestionType.DataSource:return b.DataSource;case this.sinaNext.SuggestionType.Object:return b.Object;}}});return m;});

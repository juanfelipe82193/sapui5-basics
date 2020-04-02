/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/Control","sap/ui/core/ResizeHandler","sap/ui/core/format/DateFormat","sap/ui/model/ClientListBinding","sap/ui/model/FilterType","sap/suite/ui/commons/TimelineNavigator","sap/suite/ui/commons/util/DateUtils","sap/suite/ui/commons/util/ManagedObjectRegister","sap/ui/model/json/JSONModel","sap/ui/model/Sorter","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/base/ManagedObject","sap/suite/ui/commons/TimelineItem","sap/suite/ui/commons/TimelineRenderManager","sap/ui/core/delegate/ScrollEnablement","sap/ui/base/Object","sap/base/assert","sap/base/Log","./TimelineRenderer"],function(q,l,C,R,D,c,F,T,d,M,J,S,e,f,g,h,j,m,B,n,L,o){"use strict";var p=l.TimelineScrollingFadeout,r=l.TimelineAlignment,s=l.TimelineGroupType,t=l.TimelineFilterType,u=l.TimelineAxisOrientation;var v=C.extend("sap.suite.ui.commons.Timeline",{metadata:{library:"sap.suite.ui.commons",properties:{alignment:{type:"sap.suite.ui.commons.TimelineAlignment",group:"Misc",defaultValue:"Right"},axisOrientation:{type:"sap.suite.ui.commons.TimelineAxisOrientation",group:"Misc",defaultValue:"Vertical"},data:{type:"object",group:"Misc",defaultValue:null,deprecated:true},enableAllInFilterItem:{type:"boolean",group:"Behavior",defaultValue:true,deprecated:true},enableBackendFilter:{type:"boolean",group:"Misc",defaultValue:true,deprecated:true},enableBusyIndicator:{type:"boolean",group:"Misc",defaultValue:true},enableDoubleSided:{type:"boolean",group:"Misc",defaultValue:false},enableModelFilter:{type:"boolean",group:"Misc",defaultValue:true},enableScroll:{type:"boolean",group:"Misc",defaultValue:true},enableSocial:{type:"boolean",group:"Misc",defaultValue:false},filterTitle:{type:"string",group:"Misc",defaultValue:null},forceGrowing:{type:"boolean",group:"Misc",defaultValue:false},group:{type:"boolean",group:"Misc",defaultValue:false,deprecated:true},groupBy:{type:"string",group:"Misc",defaultValue:null},groupByType:{type:"sap.suite.ui.commons.TimelineGroupType",group:"Misc",defaultValue:"None"},growing:{type:"boolean",group:"Misc",defaultValue:true,deprecated:true},growingThreshold:{type:"int",group:"Misc",defaultValue:5},height:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:''},lazyLoading:{type:"boolean",group:"Dimension",defaultValue:false},noDataText:{type:"string",group:"Misc",defaultValue:null},scrollingFadeout:{type:"sap.suite.ui.commons.TimelineScrollingFadeout",group:"Misc",defaultValue:"None"},showFilterBar:{type:"boolean",group:"Misc",defaultValue:true,deprecated:true},showHeaderBar:{type:"boolean",group:"Misc",defaultValue:true},showIcons:{type:"boolean",group:"Misc",defaultValue:true},showItemFilter:{type:"boolean",group:"Misc",defaultValue:true},showSearch:{type:"boolean",group:"Misc",defaultValue:true},showSort:{type:"boolean",group:"Misc",defaultValue:true},showSuggestion:{type:"boolean",group:"Behavior",defaultValue:true,deprecated:true},showTimeFilter:{type:"boolean",group:"Misc",defaultValue:true},sort:{type:"boolean",group:"Misc",defaultValue:true},dateTimePath:{type:"string",group:"Misc",defaultValue:""},sortOldestFirst:{type:"boolean",group:"Misc",defaultValue:false},textHeight:{type:"string",group:"Misc",defaultValue:''},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'}},defaultAggregation:"content",aggregations:{content:{type:"sap.suite.ui.commons.TimelineItem",multiple:true,singularName:"content"},customFilter:{type:"sap.ui.core.Control",multiple:false},filterList:{type:"sap.suite.ui.commons.TimelineFilterListItem",multiple:true,singularName:"filterList"},suggestionItems:{type:"sap.m.StandardListItem",multiple:true,singularName:"suggestionItem",deprecated:true}},events:{addPost:{deprecated:true,parameters:{value:{type:"string"}}},customMessageClosed:{},filterOpen:{},filterSelectionChange:{parameters:{type:{type:"sap.suite.ui.commons.TimelineFilterType"},searchTerm:{type:"string"},selectedItem:{type:"string"},selectedItems:{type:"object"},timeKeys:{type:"object"},clear:{type:"boolean"}}},grow:{},itemFiltering:{parameters:{item:{type:"sap.suite.ui.commons.TimelineItem"},reasons:{type:"object"},dataKeys:{type:"object"},timeKeys:{type:"object"},searchTerm:{type:"string"}}},select:{parameters:{selectedItem:{type:"sap.suite.ui.commons.TimelineItem"},userAction:{type:"boolean"}}},suggest:{deprecated:true,parameters:{suggestValue:{type:"string"}}},suggestionItemSelected:{deprecated:true,parameters:{selectedItem:{type:"sap.ui.core.Item"}}}},designTime:true}});function w(a,b){var _;Object.defineProperty(a,b,{get:function(){return typeof _==="function"?_():_;},set:function(i){_=i;}});}var x=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons"),y=Object.freeze({ASCENDING:"ASCENDING",DESCENDING:"DESCENDING"}),z=Object.freeze({UP:"UP",DOWN:"DOWN",NONE:"NONE"}),A={Year:D.getDateInstance({pattern:"yyyy"}),Quarter:D.getDateInstance({pattern:"QQQQ yyyy"}),Month:D.getDateInstance({format:"yyyyMMMM"}),Week:D.getDateInstance({pattern:"w"}),Day:D.getDateInstance({style:"long"}),MonthDay:D.getDateInstance({style:"medium"})};function E(a,b){var i;n(Array.isArray(a),"aArray must be an array.");if(typeof a.findIndex==="function"){return a.findIndex(b);}for(i=0;i<a.length;i++){if(b(a[i],i,a)){return i;}}return-1;}v.prototype.init=function(){this._objects=new M();this.reset();w(this,"_endDate");w(this,"_startDate");this._initControls();this.setBusyIndicatorDelay(0);};v.prototype.resetTimeLimits=function(){this._maxDate=null;this._minDate=null;};v.prototype.setCustomModelFilter=function(a,b){var i=this.getBinding("content");if(i){var k=i.aFilters||[];var G=E(k,function(b){return b._customTimelineId===a;});if(G!==-1){k.splice(G,1);}if(b!==null){b._customTimelineId=a;k.push(b);}i.filter(k,F.Control);}};v.prototype.setCustomGrouping=function(G){var b=this.getBindingInfo("content");this._fnCustomGroupBy=G;if(b){this._bindGroupingAndSorting(b);this.updateAggregation("content");}};v.prototype.setCurrentTimeFilter=function(a){this._startDate=a.from;this._endDate=a.to;this._rangeFilterType=a.type;};v.prototype.setCurrentSearch=function(a){this._objects.getSearchField().setValue(a);};v.prototype.setCurrentFilter=function(a){var b=this,H=function(V){for(var i=0;i<a.length;i++){if(a[i]===V){return true;}}return false;};if(!a){return;}if(!Array.isArray(a)){a=[a];}if(this._aFilterList.length===0){this._setFilterList();}b._currentFilterKeys=[];this._aFilterList.forEach(function(i){var k=i.key;if(H(k)){b._currentFilterKeys.push({key:k,text:i.text?i.text:i.key});}});};v.prototype.getGroups=function(){return this._useBinding()?this.getContent().filter(function(i){return i._isGroupHeader;}):this._aGroups;};v.prototype.exit=function(){this._objects.destroyAll();if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();this.oItemNavigation=null;}if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this.oResizeListener){R.deregister(this.oResizeListener);this.oResizeListener=null;}};v.prototype.adjustUI=function(){this._performUiChanges(true);};v.prototype.setModelFilterMessage=function(a,b){if(a===t.Data){this._dataMessage=b;}if(a===t.Time){this._rangeMessage=b;}};v.prototype.setCustomFilterMessage=function(a){this._customFilterMessage=a;};v.prototype.setModelFilter=function(a){switch(a.type){case t.Data:this._dataFilter=a.filter;break;case t.Time:this._rangeDataFilter=a.filter;break;case t.Search:this._searchFilter=a.filter;break;default:}if(a.refresh!==false){this.recreateFilter();}};v.prototype.getAggregation=function(a){switch(a){case"headerBar":return this.getHeaderBar();case"searchField":return this._objects.getSearchField();case"sortIcon":return this._objects.getSortIcon();case"filterIcon":return this._objects.getFilterIcon();default:return C.prototype.getAggregation.apply(this,arguments);}};v.prototype._formatGroupBy=function(a,b){if(this._fnCustomGroupBy){return this._fnCustomGroupBy(a);}var k=a,i=a;if(a instanceof Date){switch(b){case s.Year:k=a.getFullYear();i=A.Year.format(a);break;case s.Quarter:k=a.getFullYear()+"/"+Math.floor(a.getMonth()/4);i=A.Quarter.format(a);break;case s.Month:k=a.getFullYear()+"/"+a.getMonth();i=A.Month.format(a);break;case s.Week:var G=new Date(a),H=new Date(a),I=a.getFullYear(),K=A.Week.format(a),N=a.getDate()-a.getDay(),O=N+6,P=new Date(G.setDate(N)),Q=new Date(H.setDate(O));k=I+"/"+K;i=A.MonthDay.format(P)+" \u2013 "+A.MonthDay.format(Q);break;case s.Day:k=a.getFullYear()+"/"+a.getMonth()+"/"+a.getDate();i=A.Day.format(a);break;default:}}return{key:k,title:i,date:a};};v.prototype._fnDateDiff=function(a,b,i){var k,Y,G,H,I=0;b=b||this._minDate;i=i||this._maxDate;switch(a){case s.Year:I=i.getFullYear()-b.getFullYear();break;case s.Month:k=(i.getFullYear()-b.getFullYear())*12;k+=i.getMonth()-b.getMonth();I=k<=0?0:k;break;case s.Quarter:Y=(i.getFullYear()-b.getFullYear())*4;G=Math.floor(b.getMonth()/3);H=Math.floor(i.getMonth()/3);I=Y+(H-G);break;case s.Day:var K=24*60*60*1000;I=Math.round(Math.abs((b.getTime()-i.getTime())/(K)));break;default:}return I;};v.prototype._fnAddDate=function(V,a){var N,b,i,k=function(H,I,K){this.setHours(H);this.setMinutes(I);this.setSeconds(K);},G=function(H,b,i){if(a===z.UP){k.call(i,23,59,59);return new Date(Math.min.apply(null,[this._maxDate,i]));}if(a===z.DOWN){k.call(b,0,0,0);return new Date(Math.max.apply(null,[this._minDate,b]));}return H;};switch(this._rangeFilterType){case s.Year:N=new Date(new Date(this._minDate).setFullYear(this._minDate.getFullYear()+V));b=new Date(N.getFullYear(),0,1);i=new Date(N.getFullYear(),11,31);break;case s.Month:N=new Date(new Date(this._minDate).setMonth(this._minDate.getMonth()+V));b=new Date(N.getFullYear(),N.getMonth(),1);i=new Date(N.getFullYear(),N.getMonth()+1,0);break;case s.Quarter:N=new Date(new Date(this._minDate).setMonth(this._minDate.getMonth()+(V*3)));var Q=N.getMonth()%3;b=new Date(N.getFullYear(),N.getMonth()-Q,1);i=new Date(N.getFullYear(),N.getMonth()+(2-Q)+1,0);break;case s.Day:N=b=i=new Date(new Date(this._minDate).setDate(this._minDate.getDate()+V));break;default:}return G.call(this,N,b,i);};v.prototype._calculateRangeTypeFilter=function(){var a=this._fnDateDiff(s.Day);if(a>500){return s.Year;}else if(a>200){return s.Quarter;}else if(a>62){return s.Month;}return s.Day;};v.prototype._setRangeFilter=function(){var a=this._fnDateDiff(this._rangeFilterType);this._objects.getTimeRangeSlider().setMin(0);this._objects.getTimeRangeSlider().setMax(a);this._objects.getTimeRangeSlider().setRange([0,a]);this._objects.getTimeRangeSlider().invalidate();};v.prototype._sortClick=function(){var b,P;this._sortOrder=this._sortOrder===y.ASCENDING?y.DESCENDING:y.ASCENDING;this._objects.getSortIcon().setIcon(this._sortOrder===y.ASCENDING?"sap-icon://arrow-bottom":"sap-icon://arrow-top");if(this._useModelFilter()){b=this.getBinding("content");P=this._findDateTimeBindingPath();b.sort(this._getDefaultSorter(P,this._sortOrder===y.ASCENDING));}else{this.invalidate();}};v.prototype._sort=function(a,b){var i=b||this._sortOrder;a.sort(function(k,G){var H=k.getDateTime(),I=G.getDateTime(),K=(i===y.ASCENDING)?-1:1;return H<I?1*K:-1*K;});return a;};v.prototype._loadMore=function(){var b,a,i=function(){var k=this._displayShowMore()?this.getGrowingThreshold():this._calculateItemCountToLoad(this.$());this._iItemCount+=k;this._iItemCount=Math.min(this._getMaxItemsCount(),this._iItemCount);}.bind(this);this._lastScrollPosition.more=this._isVertical()?this._$content.get(0).scrollTop:this._$content.get(0).scrollLeft;this._setBusy(true);this.fireGrow();if(this._useBinding()){if(this._isMaxed()){this._setBusy(false);return;}i();b=this.getBindingInfo("content");b.startIndex=0;if(!this._loadAllData()){b.length=this._iItemCount;}a=this.getBinding("content").getContexts(0,b.length);if(a&&a.dataRequested){return;}this.updateAggregation("content");}else{i();this.invalidate();}this.oItemNavigation.refocusOnNextUpdate();};v.prototype.recreateFilter=function(b){var a=this.getBinding("content"),i=this,k=[],G=[];if(a){if(!b){k=a.aFilters||[];}if(this._dataFilter){G.push(this._dataFilter);}if(this._rangeDataFilter){G.push(this._rangeDataFilter);}if(this._searchFilter){G.push(this._searchFilter);}if(this._filter&&!b){var H=E(k,function(I){return I===i._filter;});if(H!==-1){k.splice(H,1);}}if(G.length>0){this._filter=new e(G,true);k.push(this._filter);}a.filter(k,F.Control);}else{this.invalidate();}};v.prototype._getRangeMessage=function(){var a=this._rangeMessage;if(!a){var b=this._formatGroupBy(this._startDate,this._rangeFilterType).title,i=this._formatGroupBy(this._endDate,this._rangeFilterType).title;a=x.getText("TIMELINE_RANGE_SELECTION")+" (";a+=b+" - "+i+")";}return a;};v.prototype._getFilterMessage=function(){var a="",b=null;if(this._dataMessage){a=this._dataMessage;}else if(this._currentFilterKeys.length>0){a=this._currentFilterKeys.map(function(i){return i.text?i.text:i.key;}).join(", ");a=this._getFilterTitle()+" ("+a+")";}if(this._rangeDataFilter||this._rangeMessage||(this._startDate&&this._endDate)){a=a?a+", ":"";a+=this._getRangeMessage();}if(this._customFilterMessage){a=a?a+", "+this._customFilterMessage:this._customFilterMessage;}if(a){b=x.getText("TIMELINE_FILTER_INFO_BY",a);}return b;};v.prototype.refreshContent=function(){var b=this.getBinding("content"),a=this.getBindingInfo("content"),G=this.getGrowingThreshold();this._setBusy(true);if(b&&a){b.getContexts(0,G);a.length=G;b.attachEventOnce("dataReceived",q.proxy(function(){this.updateAggregation("content");},this));}else{this.updateAggregation("content");}};v.prototype.updateContent=function(){this._setBusy(false);this.updateAggregation("content");this.invalidate();};v.prototype.destroyContent=function(){var $=this.$("line"),a=this.$().find(".sapSuiteUiCommonsTimelineItemGetMoreButton");if($.get(0)){$.remove();}if(a.get(0)){a.remove();}this.destroyAggregation("content");return this;};v.prototype._search=function(a){var b=this,i,k,G,U,H=[];this._searchValue=a;if(this._useModelFilter()){i=this._fireSelectionChange({searchTerm:this._searchValue,type:t.Search});if(i){this._searchFilter=null;if(this._searchValue){k=this._findBindingPaths("text");G=this._findBindingPaths("title");U=this._findBindingPaths("userName");if(k.length>0){H.push(k);}if(G.length>0){H.push(G);}if(U.length>0){H.push(U);}if(H.length>0){this._searchFilter=new e(H.map(function(I){return new e(I.map(function(K){return new e(K,f.Contains,b._searchValue);}),false);}));}}this.recreateFilter();}}else{this.invalidate();}};v.prototype._filterData=function(b){var a,P;this._dataMessage="";if(this._useModelFilter()){this._dataFilter=null;a=this._fireSelectionChange({selectedItem:this._currentFilterKeys[0]?this._currentFilterKeys[0].key:"",selectedItems:this._currentFilterKeys,type:t.Data});if(a){if(this._currentFilterKeys.length>0){P=this._findBindingPath("filterValue");if(P){this._dataFilter=new e(this._currentFilterKeys.map(function(i){return new e(P,f.EQ,i.key);}),false);}}}this._rangeDataFilter=null;if(b){a=this._fireSelectionChange({type:t.Time,timeKeys:{from:this._startDate,to:this._endDate}});if(a){P=this._findDateTimeBindingPath();if(P){this._rangeDataFilter=new e({path:P,operator:f.BT,value1:this._startDate,value2:this._endDate});}}}this._setBusy(true);this.recreateFilter();}else{this.invalidate();}};v.prototype._filterRangeData=function(){var b,P;this._rangeMessage="";if(this._useModelFilter()){b=this._fireSelectionChange({from:this._startDate,to:this._endDate,type:t.Time});if(b){P=this._findDateTimeBindingPath();this._rangeDataFilter=null;if(P){this._rangeDataFilter=new e({path:P,operator:f.BT,value1:this._startDate,value2:this._endDate});}this._setBusy(true);this.recreateFilter();}}else{this.invalidate();}};v.prototype.applySettings=function(a,b){g.prototype.applySettings.apply(this,[a,b]);this._settingsApplied=true;if(this._bindOptions){this.bindAggregation("content",this._bindOptions);this._bindOptions=null;}};v.prototype._setFilterList=function(){var k=false,G,I,K,H={},N,O;this._aFilterList=[];if(this._useModelFilter()){this._aFilterList=this.getFilterList().map(function(a){return{key:a.getProperty("key"),text:a.getProperty("text")};});if(this._aFilterList.length===0){O=this._findBindingData("filterValue");N=this.getBinding("content");if(O&&N){G=N.getDistinctValues(O.path);if(Array.isArray(G)){this._aFilterList=G.map(function(a){return{key:a,text:O.formatter?O.formatter(a):a};});this._aFilterList=this._aFilterList.filter(function(a){return a.key;});}k=true;}}}else{I=this.getContent();k=true;for(var i=0;i<I.length;i++){K=I[i].getFilterValue();if(!K){continue;}if(!(K in H)){H[K]=1;this._aFilterList.push({key:K,text:K});}}}if(k){this._aFilterList.sort(function(a,b){if(a.text.toLowerCase){return a.text.toLowerCase().localeCompare(b.text.toLowerCase());}else{return a.text>b.text;}});}};v.prototype._clearFilter=function(){var a=function(){var G,H=this._objects.getTimeRangeSlider();this._startDate=null;this._endDate=null;this._rangeMessage=null;H.setRange([H.getMin(),H.getMax()]);if(this._useModelFilter()){G=this._fireSelectionChange({clear:true,timeKeys:{from:null,to:null},type:t.Range});}return G;}.bind(this),b=function(){var G;this._currentFilterKeys=[];if(this._useModelFilter()){G=this._fireSelectionChange({clear:true,selectedItems:[],selectedItem:"",type:t.Data});}return G;}.bind(this);var i=b(),k=a();this._customFilterMessage="";if(i||k){if(i){this._dataFilter=null;}if(k){this._rangeDataFilter=null;}this.recreateFilter(true);}else{this.invalidate();}this._objects.destroyObject("FilterContent");this._setupFilterDialog();};v.prototype._getTimeFilterData=function(){var a=this,I,b,k,G,H=function(i,Q){return N(i,a[Q]).then(function(U){if(U){if(!a._objects.getTimeFilterSelect().getEnabled()){a._objects.getTimeFilterSelect().setEnabled(true);}var V=d.parseDate(U);if(V instanceof Date){a[Q]=V;}}}).catch(function(){a._objects.getTimeFilterSelect().setEnabled(false);});},K=function(i){var Q,U,V,W,X,Y="sap_suite_ui_commons_Timeline";Q=this.getBinding("content").getModel();if(!Q){return Promise.reject();}U=this._findDateTimeBindingPath();if(!U){return;}V=new S(U,i);W=this.getBinding("content");if(!W){return Promise.reject();}if(Q.submitBatch){X={$$groupId:Y};}var Z=Q.bindList(W.getPath(),W.getContext(),V,undefined,X);Z.initialize();var $=Z.getContexts(0,1);if(B.isA(Z,"sap.ui.model.json.JSONListBinding")&&$.length===0){return Promise.reject();}else if($.length>0){return Promise.resolve(d.parseDate($[0].getProperty(U)));}else if(B.isA(Z,"sap.ui.model.odata.v4.ODataListBinding")){a._setBusy(true);return new Promise(function(_,a1){Q.submitBatch(Y).then(function(){a._setBusy(false);P(Z,U,_,a1);});});}else if(Z&&Z.attachDataReceived){a._setBusy(true);return new Promise(function(_,a1){Z.attachDataReceived(function(){a._setBusy(false);P(Z,U,_,a1);});});}return Promise.reject();}.bind(this),N=function(i,G){if(G){return Promise.resolve(G);}return K(i==="max");},O=function(){I=this.getContent();if(I.length>0){this._minDate=I[0].getDateTime();this._maxDate=I[0].getDateTime();for(var i=1;i<I.length;i++){G=I[i].getDateTime();if(G<this._minDate){this._minDate=G;}if(G>this._maxDate){this._maxDate=G;}}}},P=function(i,Q,U,V){var W=i.getContexts(0,1);if(W.length>0){U(d.parseDate(W[0].getProperty(Q)));}else{V();}};return new Promise(function(i,Q){if(!a._maxDate||!a._minDate){if(a._useModelFilter()){b=H("min","_minDate",b);k=H("max","_maxDate",k);Promise.all([b,k]).then(function(){i();}).catch(function(){Q();});}else{O.call(a);i();}}else{i();}});};v.prototype._openFilterDialog=function(){var a=this.getCustomFilter();if(a){if(typeof a.openBy==="function"){a.openBy(this._objects.getFilterIcon());}else if(typeof a.open==="function"){a.open();}else{L.error("CustomFilter is expected to have an openBy or open function. The provided instance doesn't have either.");}this.fireFilterOpen();return;}this._filterState={data:false,range:false};this._objects.getFilterContent().open();this._objects.getTimestampFilterPicker().resizeDialog(this._objects);this.fireFilterOpen();};v.prototype._createGroupHeader=function(a,b){var i=this.getId()+"-timelinegroupheader-"+this._groupId,k=a.key,G=new h(i,{text:"GroupHeader",dateTime:a.date,userName:k,title:a.title,icon:"sap-icon://arrow-down"});G._isGroupHeader=true;if(b){G.setParent(this,"content");this._aGroups.push(G);}else{this.addAggregation("content",G,false);}this._groupId++;return G;};v.prototype._getDefaultSorter=function(P,a){var b=this;if(P){return new S(P,!a,function(i){var V=i.getProperty(P),k=d.parseDate(V);return k instanceof Date?b._formatGroupBy(k,b.getGroupByType()):{date:k};});}};v.prototype._findBindingInfoFromTemplate=function(P,a){if(!a){var b=this.getBindingInfo("content");if(b){a=b.template;}}if(a){var i=a.getBindingInfo(P);if(i&&i.parts&&i.parts[0]){return i;}}return null;};v.prototype._findBindingPaths=function(P,a){var i=this._findBindingInfoFromTemplate(P,a);if(i&&i.parts){return i.parts.map(function(I){return I.path;});}return[];};v.prototype._findDateTimeBindingPath=function(b){var a=this.getDateTimePath();if(a){return a;}var i=this._findBindingInfoFromTemplate("dateTime",b);if(i){return i.parts[0].path;}return null;};v.prototype._findBindingPath=function(P,a){var i=this._findBindingInfoFromTemplate(P,a);if(i){return i.parts[0].path;}return null;};v.prototype._findBindingData=function(P,a){var i=this._findBindingInfoFromTemplate(P,a);if(i){return{path:i.parts[0].path,formatter:i.formatter};}return null;};v.prototype._bindGroupingAndSorting=function(b){if(!this._isGrouped()&&this.getSort()){var a=this._findDateTimeBindingPath(b.template);if(a){b.sorter=this._getDefaultSorter(a,this.getSortOldestFirst());}}b.groupHeaderFactory=null;if(this._isGrouped()){b.sorter=this._getDefaultSorter(this.getGroupBy(),this.getSortOldestFirst());b.groupHeaderFactory=q.proxy(this._createGroupHeader,this);}};v.prototype.updateBindingContext=function(){this.reset();return g.prototype.updateBindingContext.apply(this,arguments);};v.prototype.bindAggregation=function(N,O){if(N==="content"){if(!this._settingsApplied){this._bindOptions=O;return null;}this._bindGroupingAndSorting(O);if(this._lazyLoading()){this._iItemCount=this._calculateItemCountToLoad(q(window));if(!this._loadAllData(true)){O.length=this._iItemCount;}}else if(this._displayShowMore()&&!this._loadAllData(O.template||O.factory)){this._iItemCount=this.getGrowingThreshold();O.length=this._iItemCount;}this._oOptions=O;}return g.prototype.bindAggregation.apply(this,[N,O]);};v.prototype._calculateItemCountToLoad=function($){var i=u.Vertical===this.getAxisOrientation(),a=i?$.height():$.width(),b=this.getEnableDoubleSided(),k=b?0.6:1,G=i?1200:2000,I=i?120:280,H=(13*k),K;if(!a){a=G;}K=(a/(I*k))*1.5;return Math.floor(Math.max(K,H));};v.prototype.onBeforeRendering=function(){var G=this.getGrowingThreshold(),a;this._bRtlMode=sap.ui.getCore().getConfiguration().getRTL();this._objects.getSortIcon().setIcon(this._sortOrder===y.ASCENDING?"sap-icon://arrow-bottom":"sap-icon://arrow-top");this._aGroups=[];this._bRendered=false;a=this.getContent();if(!this._iItemCount&&!this._useBinding()&&this._lazyLoading()){this._iItemCount=this._calculateItemCountToLoad(q(window));}if(!this._iItemCount){if(G!==0){this._iItemCount=G;}}if(!this._iItemCount||!this._useGrowing()){this._iItemCount=a.filter(function(i){return!i._isGroupHeader;}).length;}this._setOutput(a);};v.prototype.addContentGroup=function(a){};v.prototype._performScroll=function(a){var b=this,i=this._isVertical()?this._$content.get(0).scrollTop+a:this._$content.get(0).scrollLeft+a;i=Math.max(i,0);if(this._isVertical()){this._$content.get(0).scrollTop=i;}else{this._$content.get(0).scrollLeft=i;}if(this._manualScrolling){setTimeout(b._performScroll.bind(b,a),50);}};v.prototype._moveScrollBar=function(U){if(this._lastScrollPosition.more||this._lastScrollPosition.backup){if(U){this._lastScrollPosition.more=this._lastScrollPosition.backup;}if(this._isVertical()){this._oScroller.scrollTo(0,this._lastScrollPosition.more);}else{this._oScroller.scrollTo(this._lastScrollPosition.more,0);}if(!U){this._lastScrollPosition.backup=this._lastScrollPosition.more;}this._lastScrollPosition.more=0;}};v.prototype.onAfterRendering=function(){var $=this.$();if(this._isVertical()){this._$content=this.$("content");this._$scroll=this.$("scroll");}else{this._$content=this.$("contentH");this._$scroll=this.$("scrollH");}this.setBusy(false);if(!this._oScroller){this._oScroller=new m(this,this._$scroll.attr('id'),{});}this._oScroller._$Container=this._$scroll.parent();this._oScroller.setVertical(this._isVertical());this._oScroller.setHorizontal(!this._isVertical());this._startItemNavigation();this._scrollersSet=false;this._scrollMoreEvent=true;this._lastStateDblSided=null;this._showCustomMessage();this._setupScrollEvent();this._performUiChanges();this._moveScrollBar();this._bRendered=true;$.css("opacity",1);};v.prototype._clientFilter=function(I){var a=[],b,k,G,H,K,N,O,P,U,Q;function V(W){return W.key===b.getProperty("filterValue");}for(var i=0;i<I.length;i++){b=I[i];k=false;G={};if(this._currentFilterKeys.length>0){H=E(this._currentFilterKeys,V);if(H===-1){k=true;G[t.Data]=1;}}if(this._startDate&&this._endDate){K=b.getDateTime();if(K<this._startDate||K>this._endDate){k=true;G[t.Time]=1;}}if(this._searchValue){N=this._searchValue.toLowerCase();O=b.getProperty("text")||"";P=b.getProperty("title")||"";U=b.getProperty("userName")||"";if(!((O.toLowerCase().indexOf(N)!==-1)||(P.toLowerCase().indexOf(N)!==-1)||(U.toLowerCase().indexOf(N)!==-1))){k=true;G[t.Search]=1;}}Q=!this.fireEvent("itemFiltering",{item:b,reasons:G,dataKeys:this._currentFilterKeys,timeKeys:{from:this._startDate,to:this._endDate},searchTerm:this._searchValue},true);if(Q){k=!k;}if(!k){a.push(b);}}return a;};v.prototype._setOutput=function(I){var a;var b=function(){var V=0,W=[],i=0;if(this._iItemCount!==a.length){for(;i<a.length;i++){if(!a[i]._isGroupHeader){V++;}if(V>this._iItemCount){break;}W.push(a[i]);}a=W;}},G=function(){var V=[],W,X,Y={key:""};for(var i=0;i<a.length;i++){W=a[i];X=this._formatGroupBy(W.getDateTime(),this.getGroupByType());if(X.key!=Y.key){V.push(this._createGroupHeader(X,true));Y=X;}V.push(W);}return V;},H=function(){var V;if(!this._maxDate&&!this._minDate){if(this.getSort()||this._isGrouped()){for(var i=0;i<I.length;i++){V=I[i];if(!V._isGroupHeader){this._sortOrder===y.ASCENDING?this._minDate=V.getDateTime():this._maxDate=V.getDateTime();break;}}}}},K,N,O,P;H.call(this);if((!this._useBinding()||!this._useModelFilter())&&this.getSort()){I=this._sort(I);}a=this._useModelFilter()?I:this._clientFilter(I);a=a.filter(function(U){return!U._isGroupHeader;});this._showMore=this.getForceGrowing();if(!this._showMore&&this._displayShowMore()){this._showMore=a.length>this._iItemCount;if(!this._showMore&&this._useModelFilter()){this._showMore=a.length===this._iItemCount&&this._iItemCount<this._getMaxItemsCount();}}a=a.filter(function(U){return U.getVisible();});b.call(this);this._outputItem=[];if(this._isGrouped()){if(!this._useBinding()){I=G.call(this);}var Q=I.filter(function(V){return V._isGroupHeader;});this._groupCount=Q.length;for(var i=0;i<Q.length;i++){K=Q[i];O=K.getUserName();P=true;K._groupID=O;for(var k=0;k<a.length;k++){var U=a[k];N=this._formatGroupBy(U.getDateTime(),this.getGroupByType());if(N.key==O&&!U._isGroupHeader){if(P){this._outputItem.push(K);P=false;}U._groupID=O;this._outputItem.push(U);}}}}else{this._outputItem=q.extend(true,[],a);}};v.prototype._getMaxItemsCount=function(){var b=this.getBinding("content"),a,i,k;if(b){k=b.getLength()||0;a=this.getModel();i=a&&a.iSizeLimit;return Math.min(k,i||k);}return this.getContent().length;};v.prototype._showCustomMessage=function(){var b=!!this._customMessage,$=this._objects.getMessageStrip().$();this._objects.getMessageStrip().setVisible(b);this._objects.getMessageStrip().setText(this._customMessage);if(b){$.show();}else{$.hide();}};v.prototype._performExpandCollapse=function(G,b){var a=this,$,i=this.$(),k=b?"slideDown":"slideUp",H=250;i.find('li[groupid="'+G+'"][nodeType="GroupHeaderBar"]').each(function(I,K){var N=q(K);if(!b){N.addClass("sapSuiteUiCommonsTimelineItemGroupCollapsedBar");}else{N.removeClass("sapSuiteUiCommonsTimelineItemGroupCollapsedBar");}});$=i.find('li[groupid="'+G+'"][nodeType!="GroupHeader"][nodeType!="GroupHeaderBar"]');return new Promise(function(I,K){if(a._noAnimation){if(b){$.show();}else{$.hide();}I();}else{if(a._isVertical()){$[k](H);}else{$.animate({width:'toggle'},350);}$.promise().done(function(){I();});}});};v.prototype._itemRendered=function(){if(this._bRendered){this.adjustUI();}};v.prototype._startItemNavigation=function(a){var i=this._getItemsForNavigation(),$=this.$("content").get(0)||this.$("contentH").get(0),G=function(b,O){return O.filter(function(I){return I.getFocusDomRef()===b;});};if(!this.oItemNavigation){this.oItemNavigation=new T($,i.items,false,i.rows);this.oItemNavigation.setPageSize(10);this.oItemNavigation.attachEvent("AfterFocus",function(a){var b=this.oItemNavigation.getItemDomRefs()[a.getParameter("index")],k=G(b,this._outputItem);if(k[0]){this.fireSelect({selectedItem:k[0],userAction:a.mParameters.event&&a.mParameters.event.type==="mousedown"});}},this);this.oItemNavigation.attachEvent("Enter",function(a){var b=G(a.getParameter("domRef"),this._outputItem);if(b[0]){this.fireSelect({selectedItem:b[0],userAction:true});}},this);this.addDelegate(this.oItemNavigation);}else{this.oItemNavigation.updateReferences($,i.items,i.rows);}if(i.columns){this.oItemNavigation.setColumns(i.columns,false);}};v.prototype._getItemsForNavigation=function(){var I={},a,b,k,G,H;if(this._renderDblSided){if(this._isVertical()){I.items=this._outputItem;I.rows=[];G=[];I.items.forEach(function(i){var $=i.$(),K=$.hasClass("sapSuiteUiCommonsTimelineItemWrapperVLeft")||$.hasClass("sapSuiteUiCommonsTimelineItemOdd");if(K&&G.length===1){G.push(null);}else if(!K&&G.length===0){G.push(null);}if(G.length>1){I.rows.push(G);G=[];}G.push(i);});if(G.length>0){I.rows.push(G);}}else{b=[];k=[];this._outputItem.forEach(function(i){if(i._placementLine==="top"){b.push(i);}else{while(k.length+1<b.length){k.push(null);}k.push(i);}});I.items=this._outputItem;I.rows=[b,k];}}else{I.items=this._outputItem;}I.items=I.items.map(function(i){return i.getFocusDomRef();});if(I.rows){H=0;I.rows=I.rows.map(function(i){if(i.length>H){H=i.length;}return i.map(function(K){return K===null?null:K.getFocusDomRef();});});I.rows.forEach(function(i){while(i.length<H){i.push(null);}});}if(this._showMore){a=this._objects.getMoreButton().getFocusDomRef();I.items.push(a);if(I.rows){if(this._isVertical()){if(I.rows.length>0){I.rows.push(I.rows[0].map(function(V,i,K){if(i===K.length-1){return a;}else{return null;}}));}else{I.rows.push([a]);}}else{I.rows.forEach(function(K,i,N){if(i===N.length-1){K.push(a);}else{K.push(null);}});}}}return I;};v.prototype.setShowItemFilter=function(b){this.setProperty("showItemFilter",b,true);if(this._objects.isObjectInitialized("FilterContent")){this._setupFilterFirstPage(this._objects.getFilterContent());}this._objects.getFilterIcon().setVisible(b||this.getShowTimeFilter());return this;};v.prototype.setShowTimeFilter=function(b){this.setProperty("showTimeFilter",b,true);if(this._objects.isObjectInitialized("FilterContent")){this._setupFilterFirstPage(this._objects.getFilterContent());}this._objects.getFilterIcon().setVisible(b||this.getShowItemFilter());return this;};v.prototype._getFilterTitle=function(){var V=this.getFilterTitle();if(!V){V=x.getText("TIMELINE_FILTER_ITEMS");}return V;};v.prototype.getNoDataText=function(){var a=this.getProperty("noDataText");if(!a){a=x.getText('TIMELINE_NO_DATA');}return a;};v.prototype.setSortOldestFirst=function(O){this._sortOrder=O?y.ASCENDING:y.DESCENDING;this._objects.getSortIcon().setIcon(this._sortOrder===y.ASCENDING?"sap-icon://arrow-bottom":"sap-icon://arrow-top");this.setProperty("sortOldestFirst",O);return this;};v.prototype.setGrowingThreshold=function(a){this.setProperty("growingThreshold",a,true);this._iItemCount=a;return this;};v.prototype.setShowHeaderBar=function(a){this.setProperty("showHeaderBar",a,true);this._objects.getHeaderBar().setVisible(a);return this;};v.prototype.setSort=function(b){this.setProperty("sort",b);this._objects.getSortIcon().setVisible(b&&this.getShowSort());return this;};v.prototype.setAxisOrientation=function(a){this.setProperty("axisOrientation",a);if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}return this;};v.prototype.setEnableDoubleSided=function(a){this.setProperty("enableDoubleSided",a);this._renderDblSided=a;return this;};v.prototype.getCurrentFilter=function(){return this._currentFilterKeys.map(function(i){return{key:i.key,text:i.text||i.key};});};v.prototype.reset=function(){this._iItemCount=0;this._aFilterList=[];this._collapsedGroups={};this._renderDblSided=null;this._groupId=0;this._lastScrollPosition={x:0,y:0,more:0};this._sortOrder=this.getSortOldestFirst()?y.ASCENDING:y.DESCENDING;this._scrollersSet=false;this._currentFilterKeys=[];this._bRendered=false;this._noAnimation=true;};v.prototype.setShowFilterBar=function(a){this.setProperty("showFilterBar",a,true);this.setShowHeaderBar(a);return this;};v.prototype.setShowSearch=function(a){this.setProperty("showSearch",a,true);this._objects.getSearchField().setVisible(!!a);return this;};v.prototype.setShowSort=function(b){this.setProperty("showSort",b,true);this._objects.getSortIcon().setVisible(this.getSort()&&b);return this;};v.prototype.setCustomMessage=function(a){this._customMessage=a;this._showCustomMessage();return this;};v.prototype.getHeaderBar=function(){return this._objects.getHeaderBar();};v.prototype.getMessageStrip=function(){return this._objects.getMessageStrip();};v.prototype.setContent=function(a){this.removeAllContent();var b=0;for(var i=0;i<a.length;i++){var I=a[i];if(I instanceof h){if(this._isGrouped()){var G=this._formatGroupBy(I.getDateTime(),this.getGroupByType());if(G.key!==b.key){this._createGroupHeader(G);b=G;}}this.addContent(I);}}this._iItemCount=0;return this;};v.prototype.setData=function(a){var I="sapsuiteuicommonsTimelineInternalModel",i=new J(),P,b,k=function(H,K){var N=new h({dateTime:K.getProperty("dateTime"),icon:K.getProperty("icon"),userName:K.getProperty("userName"),title:K.getProperty("title"),text:K.getProperty("text"),filterValue:K.getProperty("filterValue")});if(K.getProperty("content")){N.setEmbeddedControl(K.getProperty("content"));}return N;},G=function(P,H){var K=P;if(H){K=H+">"+P;}return K;};if(typeof a==="undefined"){return this;}P=G("/",I);i.setData(a);this.setModel(i,I);this.setProperty("data",a,true);b={path:P,sorter:this._getDefaultSorter('dateTime',this.getSortOldestFirst()),factory:q.proxy(k,this)};if(this._isGrouped()){b.groupHeaderFactory=q.proxy(this._getGroupHeader,this);}this.bindAggregation("content",b);return this;};v.prototype.getSuspendSocialFeature=function(){return this._suspenseSocial;};v.prototype.setSuspendSocialFeature=function(b){this._suspenseSocial=b;if(!this.getEnableSocial()){return;}var I=this.getContent();for(var i=0;i<I.length;i++){I[i]._objects.getReplyLink().setEnabled(!b);}this.invalidate();return this;};v.prototype.updateFilterList=function(){this.updateAggregation("filterList");this._setFilterList();};v.prototype.setGroupByType=function(a){var b=this.getBindingInfo("content");this.setProperty("groupByType",a);if(b){this._bindGroupingAndSorting(b);this.updateAggregation("content");}return this;};v.prototype.getGroup=function(){return this.getGroupByType()!=="None";};v.prototype.setGroup=function(G){if(G&&this.getGroupByType()===s.None){this.setGroupByType(s.Year);}if(!G){this.setGroupByType(s.None);}return this;};v.prototype.setGrowing=function(G){if(!G){this.setGrowingThreshold(0);}return this;};v.prototype.getGrowing=function(G){return this.getGrowingThreshold()!==0;};v.prototype.setEnableBackendFilter=function(b){this.setProperty("enableModelFilter",b);return this;};v.prototype.getEnableBackendFilter=function(){return this.getProperty("enableModelFilter");};v.prototype._isGrouped=function(){return(this.getGroupByType()!==s.None||this._fnCustomGroupBy)&&(this.getGroupBy()!=="");};v.prototype._lazyLoading=function(){return this.getEnableScroll()&&this.getLazyLoading();};v.prototype._loadAllData=function(a){return!this._useModelFilter(a);};v.prototype._isVertical=function(){return u.Vertical===this.getAxisOrientation();};v.prototype._displayShowMore=function(){return this.getForceGrowing()||(this.getGrowingThreshold()!==0&&!this._lazyLoading());};v.prototype._useGrowing=function(){return this.getForceGrowing()||this.getGrowingThreshold()!==0||this._lazyLoading();};v.prototype._isMaxed=function(){return this._iItemCount>=this._getMaxItemsCount();};v.prototype._useModelFilter=function(a){return this.getEnableModelFilter()&&(a||this._useTemplateBinding()||this._useFactoryBinding());};v.prototype._scrollingFadeout=function(a){return this.getScrollingFadeout()!==p.None&&this.getEnableScroll();};v.prototype._setBusy=function(b){if(this.getEnableBusyIndicator()){this.setBusy(b);}};v.prototype._fireSelectionChange=function(P){return this.fireEvent("filterSelectionChange",P,true);};v.prototype._isLeftAlignment=function(){return this.getAlignment()===r.Left||this.getAlignment()===r.Top;};v.prototype._useBinding=function(b){return this.getBindingInfo("content")!=null;};v.prototype._useTemplateBinding=function(){var a=this.getBindingInfo("content");return a&&a.template!=null;};v.prototype._useFactoryBinding=function(){var a=this.getBindingInfo("content");return a&&a.factory!=null;};v.prototype._useAutomaticHeight=function(){return this.getTextHeight().toLowerCase()==="automatic"&&!this._isVertical();};v.prototype._getItemsCount=function(){return this._outputItem?this._outputItem.length:0;};j.extendTimeline(v);return v;});

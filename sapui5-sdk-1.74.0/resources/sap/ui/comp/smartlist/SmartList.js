/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/comp/library','sap/m/library','sap/m/VBox','sap/m/FlexItemData','sap/m/List','sap/m/Tree','sap/m/Title','sap/m/Toolbar','sap/m/OverflowToolbar','sap/m/ToolbarSpacer','sap/m/OverflowToolbarButton','sap/ui/comp/odata/ODataModelUtil','sap/ui/comp/util/FullScreenUtil','sap/ui/core/format/NumberFormat',"sap/base/util/deepEqual"],function(l,M,V,F,L,T,a,b,O,c,d,e,f,N,g){"use strict";var h=M.ToolbarDesign;var S=V.extend("sap.ui.comp.smartlist.SmartList",{metadata:{library:"sap.ui.comp",properties:{entitySet:{type:"string",group:"Misc",defaultValue:null},selectFields:{type:"string",group:"Misc",defaultValue:null},expandFields:{type:"string",group:"Misc",defaultValue:null},showRowCount:{type:"boolean",group:"Misc",defaultValue:true},header:{type:"string",group:"Misc",defaultValue:null},enableAutoBinding:{type:"boolean",group:"Misc",defaultValue:false},listBindingPath:{type:"string",group:"Misc",defaultValue:null},listType:{type:"sap.ui.comp.smartlist.ListType",group:"Misc",defaultValue:null},showFullScreenButton:{type:"boolean",group:"Misc",defaultValue:false}},associations:{smartFilter:{type:"sap.ui.core.Control"}},aggregations:{listItemTemplate:{type:"sap.m.ListItemBase",multiple:false}},events:{initialise:{},beforeRebindList:{},dataReceived:{}}},renderer:{apiVersion:2},constructor:function(){V.apply(this,arguments);this.addStyleClass("sapUiCompSmartList");this._createToolbar();this._createList();this.attachModelContextChange(this._initialiseMetadata,this);}});S.prototype._sAggregation="items";S.prototype.setHeader=function(t){this.setProperty("header",t,true);this._refreshHeaderText();return this;};S.prototype.setShowRowCount=function(s){this.setProperty("showRowCount",s,true);this._refreshHeaderText();return this;};S.prototype.setShowFullScreenButton=function(s){this.setProperty("showFullScreenButton",s,true);if(this._oFullScreenButton){this._oFullScreenButton.setVisible(this.getShowFullScreenButton());}return this;};S.prototype.setEntitySet=function(E){this.setProperty("entitySet",E);this._initialiseMetadata();return this;};S.prototype._refreshHeaderText=function(){if(!this._headerText){return;}var t=this.getHeader();var i=!!t;this._headerText.setVisible(i);if(i&&this.getShowRowCount()){var r=parseInt(this._getRowCount());if(!this._oNumberFormatter){this._oNumberFormatter=N.getFloatInstance();}var v=this._oNumberFormatter.format(r);t+=" ("+v+")";}this._headerText.setText(t);};S.prototype._addFullScreenButton=function(){if(this._oFullScreenButton){this._oToolbar.removeContent(this._oFullScreenButton);}if(this.getShowFullScreenButton()){if(!this._oFullScreenButton){this._oFullScreenButton=new d(this.getId()+"-btnFullScreen",{press:function(){this._toggleFullScreen(!this.bFullScreen);}.bind(this)});}this._toggleFullScreen(this.bFullScreen,true);this._oToolbar.addContent(this._oFullScreenButton);}};S.prototype._createToolbar=function(){var C,i,t;if(!this._oToolbar){C=this.getItems();i=C?C.length:0;while(i--){t=C[i];if(t instanceof b){break;}t=null;}if(t){this._oToolbar=t;}else{this._oToolbar=new O(this.getId()+"-toolbar",{design:h.Transparent});this.insertItem(this._oToolbar,0);}if(!this._oToolbar.getLayoutData()){this._oToolbar.setLayoutData(new F({shrinkFactor:0}));}}};S.prototype._toggleFullScreen=function(v,i){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp"),t;if(!this._oFullScreenButton||(v===this.bFullScreen&&!i)){return;}this.bFullScreen=v;f.toggleFullScreen(this,this.bFullScreen,this._oFullScreenButton,this._toggleFullScreen);t=this.bFullScreen?r.getText("CHART_MINIMIZEBTN_TOOLTIP"):r.getText("CHART_MAXIMIZEBTN_TOOLTIP");this._oFullScreenButton.setTooltip(t);this._oFullScreenButton.setText(t);this._oFullScreenButton.setIcon(this.bFullScreen?"sap-icon://exit-full-screen":"sap-icon://full-screen");};S.prototype._createToolbarContent=function(){if(!this._oToolbar){this._createToolbar();}this._addHeaderToToolbar();this._addSpacerToToolbar();this._addFullScreenButton();this._oToolbar.addStyleClass("sapMTBHeader-CTX");};S.prototype._addHeaderToToolbar=function(){if(this._headerText){this._oToolbar.removeContent(this._headerText);}if(!this._headerText){this._headerText=new a(this.getId()+"-header");this._headerText.addStyleClass("sapMH4Style");this._headerText.addStyleClass("sapUiCompSmartTableHeader");}this._refreshHeaderText();this._oToolbar.insertContent(this._headerText,0);};S.prototype._addSpacerToToolbar=function(){var j=false,I=this._oToolbar.getContent(),i,k;if(I){k=I.length;i=0;for(i;i<k;i++){if(I[i]instanceof c){j=true;break;}}}if(!j){this._oToolbar.addContent(new c(this.getId()+"-toolbarSpacer"));}};S.prototype._getRowCount=function(){var r=this._getRowBinding();if(!r){return 0;}var R=0;if(r.getTotalSize){R=r.getTotalSize();}else{R=r.getLength();}if(R<0||R==="0"){R=0;}return R;};S.prototype._getRowBinding=function(){if(this._oList){return this._oList.getBinding(this._sAggregation);}};S.prototype._initialiseMetadata=function(){if(!this.bIsInitialised){e.handleModelInit(this,this._onMetadataInitialised);}};S.prototype._onMetadataInitialised=function(){this._bMetaModelLoadAttached=false;if(!this.bIsInitialised){this.detachModelContextChange(this._initialiseMetadata,this);this.bIsInitialised=true;this._listenToSmartFilter();this._createToolbarContent();this._createContent();this.fireInitialise();this._checkAndTriggerBinding();}};S.prototype._checkAndTriggerBinding=function(){if(!this._bAutoBindingTriggered){this._bAutoBindingTriggered=true;if(this.getEnableAutoBinding()){if(this._oSmartFilter){this._oSmartFilter.search();}else{this._reBindList();}}}};S.prototype._listenToSmartFilter=function(){var s=null;s=this.getSmartFilter();if(typeof s==="string"){this._oSmartFilter=sap.ui.getCore().byId(s);}else{this._oSmartFilter=s;}if(this._oSmartFilter){this._oSmartFilter.attachSearch(this._reBindList,this);this._oSmartFilter.attachFilterChange(this._filterChangeEvent,this);this._oSmartFilter.attachCancel(this._cancelEvent,this);this._setNoDataText(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_DATA"));}};S.prototype._filterChangeEvent=function(){if(this._isListBound()&&this._oSmartFilter&&!this._oSmartFilter.getLiveMode()){this._showOverlay(true);}};S.prototype._cancelEvent=function(){if(this._oSmartFilter&&!this._oSmartFilter.getLiveMode()){this._showOverlay(false);}};S.prototype._showOverlay=function(s){};S.prototype.rebindList=function(i){this._reBindList(null,i);};S.prototype._reBindList=function(E,i){var o,s,j,k,m,p={},B={preventListBind:false};if(this._oSmartFilter){j=this._oSmartFilter.getFilters();p=this._oSmartFilter.getParameters()||{};}k=j;if(!m){m=[];}p["select"]=this.getSelectFields();p["expand"]=this.getExpandFields();p["useBatchRequests"]=true;B.filters=k;B.sorter=m;B.parameters=p;B.length=undefined;B.startIndex=undefined;this.fireBeforeRebindList({bindingParams:B});if(!B.preventListBind){m=B.sorter;k=B.filters;p=B.parameters;s=this.getListBindingPath()||("/"+this.getEntitySet());this._bDataLoadPending=true;this._bIgnoreChange=false;if(!i){o=this._oList.getBinding(this._sAggregation);if(o&&o.mParameters){i=!(g(p,o.mParameters,true)&&g(p.custom,o.mParameters.custom)&&!B.length&&!B.startIndex&&s===o.getPath());}}if(!o||!this._bIsListBound||i){this._oList.bindItems({path:s,filters:k,sorter:m,parameters:p,length:B.length,startIndex:B.startIndex,template:this._oTemplate,events:{dataRequested:function(){this._bIgnoreChange=true;}.bind(this),dataReceived:function(E){this._bIgnoreChange=false;this._onDataLoadComplete(E,true);this.fireDataReceived(E);}.bind(this),change:function(E){if(this._bIgnoreChange){return;}var r,n=false;r=(E&&E.getParameter)?E.getParameter("reason"):undefined;if(!r||r==="filter"||r==="context"){n=true;}if(r==="change"||n){this._onDataLoadComplete(E,n);}}.bind(this)}});this._bIsListBound=true;}else{o.sort(m);o.filter(k,"Application");}this._showOverlay(false);}};S.prototype._onDataLoadComplete=function(E,i){if(this._bDataLoadPending||i){this._bDataLoadPending=false;if(!this._bNoDataUpdated&&!this._getRowCount()){this._bNoDataUpdated=true;this._setNoDataText();}this._refreshHeaderText();}};S.prototype._isListBound=function(){if(this._bIsListBound){return true;}if(this._oList){return this._oList.isBound(this._sAggregation);}return false;};S.prototype._setNoDataText=function(o){if(this._oList){if(!o){o=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_RESULTS");}this._oList.setNoDataText(o);}};S.prototype._createContent=function(){if(!this._oTemplate){this._oTemplate=this.getListItemTemplate();}};S.prototype._createList=function(){var C=this.getItems(),i=C?C.length:0,o,I;while(i--){o=C[i];if(o instanceof L||o instanceof T){break;}o=null;}if(o){this._oList=o;if(o instanceof T){this._isTree=true;}else{this._isList=true;}this._oTemplate=(o.getItems()&&o.getItems().length>0)?o.getItems()[0]:this.getListItemTemplate();o.removeAllItems();}else{I=this.getId()+"-ui5list";if(this.getListType()==="Tree"){this._oList=new T(I);this._isTree=true;}else{this._oList=new L(I,{growing:true,growingScrollToLoad:true});this._isList=true;}this.insertItem(this._oList,2);}if(!this._oList.getLayoutData()){this._oList.setLayoutData(new F({growFactor:1,baseSize:"auto"}));}this._oList.addAriaLabelledBy(this.getId()+"-header");};S.prototype.getList=function(){return this._oList;};S.prototype.isInitialised=function(){return!!this.bIsInitialised;};S.prototype.exit=function(){if(this._oSmartFilter){this._oSmartFilter.detachSearch(this._reBindList,this);this._oSmartFilter.detachFilterChange(this._filterChangeEvent,this);this._oSmartFilter.detachCancel(this._cancelEvent,this);this._oSmartFilter=null;}f.cleanUpFullScreen(this);if(!this._bIsListBound&&this._oTemplate){this._oTemplate.destroy();}this._oTemplate=null;this._oToolbar=null;this._headerText=null;this._oFullScreenButton=null;this._oNumberFormatter=null;this._oList=null;};return S;});

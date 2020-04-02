/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Dialog','./library','sap/ui/core/EnabledPropagator','./DialogRenderer','sap/ui/core/library','sap/ui/Device','./Bar','./Button','./Title','sap/m/OverflowToolbarLayoutData','sap/ui/base/ManagedObjectObserver',"sap/ui/thirdparty/jquery","sap/base/Log","sap/base/util/isEmptyObject"],function(D,l,E,a,c,b,B,d,T,O,M,q,L,e){"use strict";var f=l.OverflowToolbarPriority;var g=l.ListType;var P=l.P13nPanelType;var h=l.ListMode;var j=c.MessageType;var k=l.ButtonType;var N;var m;var n=D.extend("sap.m.P13nDialog",{metadata:{library:"sap.m",properties:{initialVisiblePanelType:{type:"string",group:"Misc",defaultValue:null},showReset:{type:"boolean",group:"Appearance",defaultValue:false},showResetEnabled:{type:"boolean",group:"Appearance",defaultValue:false},validationExecutor:{type:"object",group:"Misc",defaultValue:null}},aggregations:{panels:{type:"sap.m.P13nPanel",multiple:true,singularName:"panel",bindable:"bindable"}},events:{ok:{},cancel:{},reset:{}}},renderer:function(r,C){a.render.apply(this,arguments);var i=C._getVisiblePanelID();var p=C.getVisiblePanel();if(i&&p){r.write("<div");r.writeAttribute("id",i);r.write(">");r.renderControl(p);r.write("</div>");}}});E.apply(n.prototype,[true]);n.prototype.init=function(o){this.addStyleClass("sapMP13nDialog");D.prototype.init.apply(this,arguments);this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._mValidationListener={};this._createDialog();this._mVisibleNavigationItems={};this._bNavigationControlsPromiseResolved=false;this._oNavigationControlsPromise=this._requestRequiredNavigationControls();this._oObserver=new M(_.bind(this));this._oObserver.observe(this,{properties:["showReset","showResetEnabled"],aggregations:["panels"]});};n.prototype.setShowResetEnabled=function(i){return this.setProperty("showResetEnabled",i,true);};n.prototype._createDialog=function(){if(b.system.phone){var t=this;this.setStretch(true);this.setVerticalScrolling(false);this.setHorizontalScrolling(false);this.setCustomHeader(new B(this.getId()+"-phoneHeader",{contentLeft:new d(this.getId()+"-backToList",{visible:false,type:k.Back,press:function(){t._backToList();}}),contentMiddle:new T(this.getId()+"-phoneTitle",{text:this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS"),level:"H2"})}));this.addButton(this._createOKButton());this.addButton(this._createCancelButton());this.addButton(this._createResetButton());}else{this.setHorizontalScrolling(false);this.setContentWidth("65rem");this.setContentHeight("40rem");this.setDraggable(true);this.setResizable(true);this.setTitle(this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS"));this.addButton(this._createOKButton());this.addButton(this._createCancelButton());this.addButton(this._createResetButton());}};n.prototype._showValidationDialog=function(C,F,v){var w=[];var i=[];this._prepareMessages(F,v,w,i);var t=this;return new Promise(function(r){sap.ui.require(["sap/m/MessageBox"],function(o){var s="";if(i.length){i.forEach(function(p,I,u){s=(u.length>1?"• ":"")+p.messageText+"\n"+s;});o.show(s,{icon:o.Icon.ERROR,title:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_TITLE_ERROR"),actions:[o.Action.CLOSE],styleClass:t.$().closest(".sapUiSizeCompact").length?"sapUiSizeCompact":""});}else if(w.length){w.forEach(function(p,I,u){s=(u.length>1?"• ":"")+p.messageText+"\n"+s;});s=s+sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_MESSAGE_QUESTION");o.show(s,{icon:o.Icon.WARNING,title:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_TITLE"),actions:[sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_FIX"),o.Action.IGNORE],onClose:function(A){if(A===o.Action.IGNORE){C();}},styleClass:t.$().closest(".sapUiSizeCompact").length?"sapUiSizeCompact":""});}r();});});};n.prototype._prepareMessages=function(F,v,w,o){if(!F.length&&!v.length){return;}F.forEach(function(p){switch(p){case P.filter:v.push({messageType:j.Warning,messageText:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_MESSAGE")});break;case P.columns:v.push({messageType:j.Warning,messageText:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VISIBLE_ITEMS_THRESHOLD_MESSAGE")});break;default:L.error("Panel type '"+p+"' is not supported jet.");}});var u=v.filter(function(p,I,r){for(var i=++I;i<r.length;i++){if(p.messageText===r[i].messageText){return false;}}return true;});u.forEach(function(i){if(i.messageType===j.Warning){w.push(i);}else if(i.messageType===j.Error){o.push(i);}});};n.prototype._mapPanelToNavigationItem=function(p){if(!p){return null;}return b.system.phone?new m(p.getId()+"-navItem",{type:g.Navigation,title:p.getTitle()}):new m(p.getId()+"-navItem",{text:p.getTitle()});};n.prototype._switchPanel=function(o){var p=this._getPanelByNavigationItem(o);this.setVerticalScrolling(p.getVerticalScrolling());if(b.system.phone){var i=this._getNavigationControl();if(i){i.setVisible(false);p.beforeNavigationTo();p.setVisible(true);this.getCustomHeader().getContentMiddle()[0].setText(p.getTitle());this.getCustomHeader().getContentLeft()[0].setVisible(true);}}else{this.getPanels().forEach(function(r){if(r===p){r.beforeNavigationTo();r.setVisible(true);}else{r.setVisible(false);}},this);}this.invalidate();this.rerender();};n.prototype._backToList=function(){var o=this._getNavigationControl();if(o){o.setVisible(true);var p=this.getVisiblePanel();p.setVisible(false);this._updateDialogTitle();this.getCustomHeader().getContentLeft()[0].setVisible(false);}};n.prototype.getVisiblePanel=function(){var p=null;this.getPanels().some(function(o){if(o.getVisible()){p=o;return true;}});return p;};n.prototype._getVisiblePanelID=function(){var p=this.getVisiblePanel();if(p){return this.getId()+"-panel_"+p.getId();}return null;};n.prototype._getPanelByNavigationItem=function(o){for(var i=0,p=this.getPanels(),r=p.length;i<r;i++){if(this._getNavigationItemByPanel(p[i])===o){return p[i];}}return null;};n.prototype._getNavigationItemByPanel=function(p){return p?p.data("sapMP13nDialogNavigationItem"):null;};n.prototype.onAfterRendering=function(){D.prototype.onAfterRendering.apply(this,arguments);var C=q(this.getFocusDomRef()).find(".sapMDialogScrollCont");var i=this._getVisiblePanelID();if(i&&C){var p=q(document.getElementById(i));p.appendTo(q(C));}};n.prototype._updateDialogTitle=function(){var p=this.getVisiblePanel();var t=this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS");if(!this._isNavigationControlExpected()&&p){switch(p.getType()){case P.filter:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_FILTER");break;case P.sort:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_SORT");break;case P.group:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_GROUP");break;case P.columns:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_COLUMNS");break;case P.dimeasure:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_DIMEASURE");break;default:t=p.getTitleLarge()||this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS");}}if(b.system.phone){this.getCustomHeader().getContentMiddle()[0].setText(t);}else{this.setTitle(t);}};n.prototype._registerValidationListener=function(p,C){if(this.getPanels().indexOf(p)&&C&&this._mValidationListener[p.getType()]===undefined){this._mValidationListener[p.getType()]=C;}};n.prototype._callValidationExecutor=function(){var v=this.getValidationExecutor();if(v&&!e(this._mValidationListener)){var t=this;v(this._getPayloadOfPanels()).then(function(V){var r=t._distributeValidationResult(V);for(var s in t._mValidationListener){var C=t._mValidationListener[s];C(r[s]||[]);}});}};n.prototype._distributeValidationResult=function(r){var o={};r.forEach(function(R){R.panelTypes.forEach(function(t){if(o[t]===undefined){o[t]=[];}o[t].push({columnKey:R.columnKey,messageType:R.messageType,messageText:R.messageText});});});return o;};n.prototype._createOKButton=function(){var t=this;return new d(this.getId()+"-ok",{type:k.Emphasized,text:this._oResourceBundle.getText("P13NDIALOG_OK"),layoutData:new O({priority:f.NeverOverflow}),press:function(){t.setBusy(true);var p=t._getPayloadOfPanels();var F=function(){t.setBusy(false);t.fireOk({payload:p});};var i=[];var C=function(){t.getPanels().forEach(function(o){if(i.indexOf(o.getType())>-1){o.onAfterNavigationFrom();}});F();};t.getPanels().forEach(function(o){if(!o.onBeforeNavigationFrom()){i.push(o.getType());}});var v=[];var V=t.getValidationExecutor();if(V){V(p).then(function(v){if(i.length||v.length){t.setBusy(false);t._showValidationDialog(C,i,v);}else{F();}});}else{if(i.length||v.length){t.setBusy(false);t._showValidationDialog(C,i,v);}else{F();}}}});};n.prototype._createCancelButton=function(){var t=this;return new d(this.getId()+"-cancel",{text:this._oResourceBundle.getText("P13NDIALOG_CANCEL"),layoutData:new O({priority:f.NeverOverflow}),press:function(){t.fireCancel();}});};n.prototype._createResetButton=function(){var t=this;return new d(this.getId()+"-reset",{text:this._oResourceBundle.getText("P13NDIALOG_RESET"),layoutData:new O({priority:f.NeverOverflow}),visible:this.getShowReset(),enabled:this.getShowResetEnabled(),press:function(){sap.ui.getCore().byId(t.getId()+"-ok").focus();t.setShowResetEnabled(false);var p={};t.getPanels().forEach(function(o){p[o.getType()]=o.getResetPayload();});t.fireReset({payload:p});}});};n.prototype._getPayloadOfPanels=function(){var p={};this.getPanels().forEach(function(o){p[o.getType()]=o.getOkPayload();});return p;};n.prototype.exit=function(){D.prototype.exit.apply(this,arguments);this._oObserver.disconnect();this._oObserver=undefined;this._mValidationListener={};this._mVisibleNavigationItems={};this._oNavigationControlsPromise=null;};n.prototype._isInstanceOf=function(o,s){var C=sap.ui.require(s);return o&&typeof C==='function'&&(o instanceof C);};function _(C){if(this._isInstanceOf(C.object,"sap/m/P13nDialog")){var i;switch(C.name){case"panels":var p=C.child?[C.child]:C.children;p.forEach(function(o){switch(C.mutation){case"insert":this._mVisibleNavigationItems[o.sId]=o.getVisible();o.setVisible(false);o.beforeNavigationTo();this._oObserver.observe(o,{properties:["title"]});o.setValidationExecutor(q.proxy(this._callValidationExecutor,this));o.setValidationListener(q.proxy(this._registerValidationListener,this));break;case"remove":delete this._mVisibleNavigationItems[o.sId];this._oObserver.unobserve(o);o.setValidationExecutor();o.setValidationListener();break;default:L.error("Mutation '"+C.mutation+"' is not supported jet.");}},this);if(this._bNavigationControlsPromiseResolved){this._updateDialog();}else{this._oNavigationControlsPromise.then(function(){this._updateDialog();}.bind(this));}break;case"showReset":i=this.getButtons();if(i.length>1){i[2].setVisible(C.current);}break;case"showResetEnabled":i=this.getButtons();if(i.length>1){i[2].setEnabled(C.current);i[2].invalidate();}break;default:L.error("The property or aggregation '"+C.name+"' has not been registered.");}}else if(this._isInstanceOf(C.object,"sap/m/P13nPanel")){if(C.name==="title"){var I=this._getNavigationItemByPanel(C.object);if(I){if(b.system.phone){I.setTitle(C.current);}else{I.setText(C.current);}}}}}n.prototype._isNavigationControlExpected=function(){return this._getCountOfVisibleNavigationItems()>1;};n.prototype._getCountOfVisibleNavigationItems=function(){var C=0;for(var i in this._mVisibleNavigationItems){C=this._mVisibleNavigationItems[i]?C+1:C;}return C;};n.prototype._isNavigationControlExists=function(){return b.system.phone?this.getContent().length>0:(!!this.getSubHeader()&&this.getSubHeader().getContentLeft().length>0);};n.prototype._getNavigationControl=function(){if(!this._isNavigationControlExists()){this._createNavigationControl();}return b.system.phone?this.getContent()[0]:this.getSubHeader().getContentLeft()[0];};n.prototype._setVisibleOfNavigationControl=function(v){if(!this._isNavigationControlExists()){return;}return b.system.phone?this.getContent()[0].setVisible(v):this.getSubHeader().setVisible(v);};n.prototype._createNavigationControl=function(){if(b.system.phone){this.addContent(new N(this.getId()+"-navigationItems",{mode:h.None,itemPress:function(o){this._switchPanel(o.getParameter("listItem"));}.bind(this)}));}else{this.setSubHeader(new B(this.getId()+"-navigationBar",{contentLeft:new N(this.getId()+"-navigationItems",{width:'100%',selectionChange:function(o){this._switchPanel(o.getParameter("item"));}.bind(this)})}));}return this._getNavigationControl();};n.prototype._updateDialog=function(){var o=this._getNavigationControl();o.destroyItems();var i=this._determineInitialVisiblePanel();this.getPanels().forEach(function(p){var r=this._mapPanelToNavigationItem(p);p.data("sapMP13nDialogNavigationItem",r);o.addItem(r);var v=b.system.phone?this._mVisibleNavigationItems[p.sId]&&this._getCountOfVisibleNavigationItems()===1:this._mVisibleNavigationItems[p.sId]&&i===p.sId;p.setVisible(v);if(v){if(!b.system.phone){this.setVerticalScrolling(p.getVerticalScrolling());}}r.setVisible(this._mVisibleNavigationItems[p.sId]);if(v&&o.setSelectedItem){o.setSelectedItem(r);}}.bind(this));this._updateDialogTitle();this._setVisibleOfNavigationControl(this._isNavigationControlExpected());};n.prototype._determineInitialVisiblePanel=function(){if(this.getInitialVisiblePanelType()){for(var i=0;i<this.getPanels().length;i++){if(this.getPanels()[i].getType()==this.getInitialVisiblePanelType()){return this.getPanels()[i].sId;}}}var I;this.getPanels().some(function(p){if(this._mVisibleNavigationItems[p.sId]){I=p.sId;return true;}}.bind(this));return I;};n.prototype._requestRequiredNavigationControls=function(){var s=b.system.phone?"sap/m/List":"sap/m/SegmentedButton";var i=b.system.phone?"sap/m/StandardListItem":"sap/m/SegmentedButtonItem";N=sap.ui.require(s);m=sap.ui.require(i);if(N&&m){this._bNavigationControlsPromiseResolved=true;return Promise.resolve();}if(!this._oNavigationControlsPromise){this._oNavigationControlsPromise=new Promise(function(r){sap.ui.require([s,i],function(o,p){N=o;m=p;this._bNavigationControlsPromiseResolved=true;return r();}.bind(this));}.bind(this));}return this._oNavigationControlsPromise;};return n;});

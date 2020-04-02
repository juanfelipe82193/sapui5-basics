// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/UIComponent","sap/ushell/ui/shell/ToolAreaItem","./FlpMeasure","sap/ushell/Config","sap/ushell/EventHub","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/ui/Device","sap/ui/model/json/JSONModel","sap/ushell/components/SharedComponentUtils","sap/ushell/services/AppConfiguration","sap/ushell/services/AppType","sap/ushell/resources","sap/base/util/UriParameters","sap/ui/thirdparty/jquery","sap/base/Log","sap/base/util/ObjectPath","sap/ui/core/library","sap/ushell/ui/shell/ShellHeadItem","sap/m/NotificationListItem","./RendererExtensions"],function(U,T,f,C,e,A,D,J,s,a,b,r,c,q,L,O,d,S,N){"use strict";var V=d.mvc.ViewType;var R=U.extend("sap.ushell.renderers.fiori2.Renderer",{metadata:{version:"1.74.0",dependencies:{version:"1.74.0",libs:["sap.ui.core","sap.m"],components:[]},routing:{config:{path:"sap.ushell.components",async:true,controlId:"viewPortContainer",clearAggregation:false,controlAggregation:"pages"},routes:[{name:"appfinder-legacy",pattern:"Shell-home&/appFinder/:menu:/:filter:"},{name:"home",pattern:["Shell-home?:hashParameters:","Shell-home&/:innerHash*:","Shell-home"],target:C.last("/core/spaces/enabled")?"pages":"home"},{name:"appfinder",pattern:["Shell-appfinder?:hashParameters:&/:innerHash*:","Shell-appfinder?:hashParameters*:","Shell-appfinder&/:innerHash*:","Shell-appfinder"],target:"appfinder"},{name:"openFLPPage",pattern:["Launchpad-openFLPPage?:hashParameters:","Launchpad-openFLPPage"],target:C.last("/core/spaces/enabled")?"pages":"home"}],targets:{home:{name:"homepage",type:"Component",title:r.i18n.getText("homeBtn_tooltip"),id:"Shell-home-component",options:{manifest:false,asyncHints:{preloadBundles:C.last("/core/home/featuredGroup/enable")?["sap/fiori/flp-controls.js","sap/ushell/components/homepage/cards-preload.js"]:["sap/fiori/flp-controls.js"]},componentData:{config:{enablePersonalization:true,enableHomePageSettings:false}}}},appfinder:{name:"appfinder",type:"Component",id:"Shell-appfinder-component",options:{manifest:false,asyncHints:{preloadBundles:["sap/fiori/flp-controls.js"]},componentData:{config:{enablePersonalization:true,enableHomePageSettings:false}}}},pages:{name:"pages",type:"Component",id:"pages-component",componentData:{},options:{asyncHints:{preloadBundles:["sap/fiori/flp-controls.js"]}}}}}},init:function(){U.prototype.init.apply(this,arguments);var t=this,o=this.getRouter();var p=function(){e.emit("trackHashChange","Shell-home");if(a.getCurrentApplication()){sap.ushell.Container.getService("ShellNavigation").setIsInitialNavigation(false);}var h=r.i18n.getText("homeBtn_tooltip");A.switchViewState("home",false,"Shell-home");t.setCurrentCoreView("home");a.setCurrentApplication(null);A.getShellUIService().setTitle(h);A.getShellUIService().setHierarchy();A.getShellUIService().setRelatedApps();A.getAppMeta().setAppIcons();s.initializeAccessKeys();};o.getRoute("home").attachMatched(p);o.getRoute("openFLPPage").attachMatched(p);o.getRoute("appfinder-legacy").attachMatched(function(E){o.navTo("appfinder",{},true);});o.getRoute("appfinder").attachMatched(function(E){e.emit("trackHashChange","Shell-appFinder");var h=sap.ui.getCore().getComponent(t.createId("Shell-appfinder-component")),i=E.getParameter("arguments");if(sap.ushell.Container.getRenderer("fiori2")){A.getShellUIService().setBackNavigation();sap.ushell.Container.getRenderer("fiori2").setCurrentCoreView("appFinder");}a.setCurrentApplication(null);var j=h.getRouter();h.getRootControl().loaded().then(function(){j.parse(i["innerHash*"]||"");});A.switchViewState("app",false,"Shell-appfinder");A.getAppMeta().setAppIcons();s.initializeAccessKeys();});var g=new J(D);g.setDefaultBindingMode("OneWay");this.setModel(g,"device");this.setModel(r.i18nModel,"i18n");}});R.prototype.createContent=function(){var p=new c(window.location.href).get("appState")||new c(window.location.href).get("sap-ushell-config"),w,v=this.getComponentData()||{},o={applications:{"Shell-home":{}},rootIntent:"Shell-home"},g;w=(p==="headerless-opt")?"headerless":p;if(w){if(!v.config){v.config={};}v.config.appState=w;v.config.appStateOrig=p;v.config.inHeaderLessOpt=(p==="headerless-opt");}if(v.config){if(v.config.rootIntent===undefined){v.config.migrationConfig=true;}v.config=q.extend(true,o,v.config);q.extend(v.config.applications["Shell-home"],C.last("/core/home"),C.last("/core/catalog"));if(v.config.appState==="headerless"||v.config.appState==="merged"||v.config.appState==="blank"){v.config.enablePersonalization=false;C.emit("/core/shell/enablePersonalization",false);}else{v.config.enablePersonalization=C.last("/core/shell/enablePersonalization");}if(!v.config.enablePersonalization){v.config.moveEditHomePageActionToShellHeader=false;v.config.moveAppFinderActionToShellHeader=false;}}f.start(0,"Creating Shell",0);if(v.config&&v.config.customViews){Object.keys(v.config.customViews).forEach(function(i){var g=v.config.customViews[i];sap.ui.view(i,{type:g.viewType,viewName:g.viewName,viewData:g.componentData});});}var h=C.createModel("/core/shell/model",J);v.shellModel=h;g=sap.ui.view("mainShell",{type:V.JS,viewName:"sap.ushell.renderers.fiori2.Shell",height:"100%",viewData:v});g.setModel(h);this._oShellView=g;this.oShellModel=A.getElementsModel();g.loaded().then(function(g){sap.ushell.renderers.fiori2.utils.init(g.getController());this.shellCtrl=g.oController;}.bind(this));return g;};R.prototype.createExtendedShellState=function(g,h){return A.shellElements().createExtendedShellState(g,h);};R.prototype.applyExtendedShellState=function(g,h){this.oShellModel.applyExtendedShellState(g,h);};R.prototype.showLeftPaneContent=function(i,g,h){if(g){A.shellElements().addShellModelForApplications("paneContent",typeof i==="string"?[i]:i);}else{this.oShellModel.addLeftPaneContent(typeof i==="string"?[i]:i,false,h);}};R.prototype.showHeaderItem=function(i,g,h){if(g){A.shellElements().addShellModelForApplications("headItems",typeof i==="string"?[i]:i);}else{this.oShellModel.addHeaderItem(typeof i==="string"?[i]:i,false,h);}};R.prototype.showRightFloatingContainerItem=function(i,g,h){if(g){A.shellElements().addShellModelForApplications("RightFloatingContainerItems",typeof i==="string"?[i]:i);}else{this.oShellModel.addRightFloatingContainerItem(typeof i==="string"?[i]:i,false,h);}};R.prototype.showRightFloatingContainer=function(g){A.shellElements().setShellModelForApplications("showRightFloatingContainer",g);};R.prototype.showToolAreaItem=function(i,g,h){this.oShellModel.addToolAreaItem(i,true,g,h);};R.prototype.showActionButton=function(i,g,h){var B=[],j=[],o;if(typeof i==="string"){i=[i];}B=i.filter(function(I){o=sap.ui.getCore().byId(I);return o instanceof sap.m.Button&&!(o instanceof sap.ushell.ui.launchpad.ActionItem);});j=i.filter(function(I){o=sap.ui.getCore().byId(I);return o instanceof sap.ushell.ui.launchpad.ActionItem;});if(B.length){this.convertButtonsToActions(B,g,h);}if(j.length){if(g){A.shellElements().addShellModelForApplications("actions",i);}else{this.oShellModel.addActionButton(i,false,h);}}};R.prototype.showFloatingActionButton=function(i,g,h){if(g){A.shellElements().addShellModelForApplications("floatingActions",typeof i==="string"?[i]:i);}else{this.oShellModel.addFloatingActionButton(typeof i==="string"?[i]:i,false,h);}};R.prototype.showHeaderEndItem=function(i,g,h){if(g){A.shellElements().addShellModelForApplications("headEndItems",typeof i==="string"?[i]:i);}else{this.oShellModel.addHeaderEndItem(typeof i==="string"?[i]:i,false,h);}};R.prototype.setHeaderVisibility=function(v,g,h){if(g){A.shellElements().setShellModelForApplications("headerVisible",v);}else{this.oShellModel.setHeaderVisibility(v,false,h);}};R.prototype.showSubHeader=function(i,g,h){if(g){A.shellElements().addShellModelForApplications("subHeader",typeof i==="string"?[i]:i);}else{this.oShellModel.addSubHeader(typeof i==="string"?[i]:i,false,h);}};R.prototype.showSignOutItem=function(g,h){if(g){A.shellElements().addShellModelForApplications("actions",["logoutBtn"],false);}else{this.oShellModel.showSignOutButton(g,h);}};R.prototype.showSettingsItem=function(g,h){this.oShellModel.showSettingsButton(g,h);};R.prototype.setFooter=function(F){this.shellCtrl.setFooter(F);};R.prototype.setShellFooter=function(p){var o=new q.Deferred(),t=this,g,h,i=p.controlType,j=p.oControlProperties;if(j&&j.id&&sap.ui.getCore().byId(j.id)){h=sap.ui.getCore().byId(j.id);if(h){if(this.lastFooterId){this.removeFooter();}this.lastFooterId=oInnerControl.getId();this.shellCtrl.setFooter(h);o.resolve(h);}}if(i){g=i.replace(/\./g,"/");sap.ui.require([g],function(k){h=new k(j);if(t.lastFooterId){t.removeFooter();}t.lastFooterId=h.getId();t.shellCtrl.setFooter(h);o.resolve(h);});}else{L.warning("You must specify control type in order to create it");}return o.promise();};R.prototype.setFooterControl=function(g,o){var h=g.replace(/\./g,"/"),i=sap.ui.require(h),j,k,l=false;if(i){l=true;}else if(!O.get(g||"")){q.sap.require(g);}k=function(o){if(g){if(l){return new i(o);}var m=O.get(g||"");return new m(o);}L.warning("You must specify control type in order to create it");};j=this.createItem(o,undefined,k);if(this.lastFooterId){this.removeFooter();}this.lastFooterId=j.getId();this.shellCtrl.setFooter(j);return j;};R.prototype.hideHeaderItem=function(i,g,h){if(typeof i==="string"){this.oShellModel.removeHeaderItem([i],g,h);}else{this.oShellModel.removeHeaderItem(i,g,h);}};R.prototype.removeToolAreaItem=function(i,g,h){if(typeof i==="string"){i=[i];}this.oShellModel.removeToolAreaItem(i,g,h);};R.prototype.removeRightFloatingContainerItem=function(i,g,h){if(typeof i==="string"){this.oShellModel.removeRightFloatingContainerItem([i],g,h);}else{this.oShellModel.removeRightFloatingContainerItem(i,g,h);}};R.prototype.hideActionButton=function(i,g,h){if(typeof i==="string"){this.oShellModel.removeActionButton([i],g,h);}else{this.oShellModel.removeActionButton(i,g,h);}};R.prototype.hideLeftPaneContent=function(i,g,h){if(typeof i==="string"){this.oShellModel.removeLeftPaneContent([i],g,h);}else{this.oShellModel.removeLeftPaneContent(i,g,h);}};R.prototype.hideFloatingActionButton=function(i,g,h){if(typeof i==="string"){this.oShellModel.removeFloatingActionButton([i],g,h);}else{this.oShellModel.removeFloatingActionButton(i,g,h);}};R.prototype.hideHeaderEndItem=function(i,g,h){if(typeof i==="string"){this.oShellModel.removeHeaderEndItem([i],g,h);}else{this.oShellModel.removeHeaderEndItem(i,g,h);}};R.prototype.hideSubHeader=function(i,g,h){if(typeof i==="string"){this.oShellModel.removeSubHeader([i],g,h);}else{this.oShellModel.removeSubHeader(i,g,h);}};R.prototype.removeFooter=function(){this.shellCtrl.removeFooter();if(this.lastFooterId){var F=sap.ui.getCore().byId(this.lastFooterId);if(F){F.destroy();}this.lastFooterId=undefined;}};R.prototype.getCurrentViewportState=function(){return this.shellCtrl.getCurrentViewportState();};R.prototype.addShellSubHeader=function(p){var o=new q.Deferred(),t=this,g,h,i=p.controlType,j=p.oControlProperties,I=p.bIsVisible,k=p.bCurrentState,l=p.aStates;if(j&&j.id&&sap.ui.getCore().byId(j.id)){h=sap.ui.getCore().byId(j.id);if(h){if(I){this.showSubHeader(h.getId(),k,l);}o.resolve(h);}}if(i){g=i.replace(/\./g,"/");sap.ui.require([g],function(m){h=new m(j);if(I){t.showSubHeader(h.getId(),k,l);t.oShellModel.addElementToManagedQueue(h);}o.resolve(h);});}else{L.warning("You must specify control type in order to create it");}return o.promise();};R.prototype.addSubHeader=function(g,o,i,h,j){var k=g.replace(/\./g,"/"),l=sap.ui.require(k),m,p,t=false;if(l){t=true;}else if(!O.get(g||"")){q.sap.require(g);}p=function(o){if(g){if(t){return new l(o);}var u=O.get(g||"");return new u(o);}L.warning("You must specify control type in order to create it");};m=this.createItem(o,h,p);if(i){this.showSubHeader(m.getId(),h,j);}return m;};R.prototype.addUserAction=function(p){var o=new q.Deferred(),t=this,g,h,i=p.controlType,j=p.oControlProperties,I=p.bIsVisible,k=p.bCurrentState,m=k?A.shellElements().getStateModelToUpdate():this.oShellModel.getModelToUpdate(),l=p.aStates,u;if(j){h=sap.ui.getCore().byId(j.id);}if(h){o.resolve(h);}if(i){if(i==="sap.m.Button"){i="sap.ushell.ui.launchpad.ActionItem";}g=i.replace(/\./g,"/");sap.ui.require([g],function(v){var w;if(k){w=A.shellElements().getStateModelToUpdate();A.shellElements().setStateModelToUpdate(m);}else{w=t.oShellModel.getModelToUpdate();t.oShellModel.setModelToUpdate(m,true);}h=h||new v(j);if(!h.getActionType){h=new v(j);}if(I){t.showActionButton(h.getId(),k,l);t.oShellModel.addElementToManagedQueue(h);}if(k){A.shellElements().setStateModelToUpdate(w);}else{t.oShellModel.setModelToUpdate(w,false);}o.resolve(h);});}else{u="You must specify control type in order to create it";L.warning(u);o.reject(u);}return o.promise();};R.prototype.addActionButton=function(g,o,i,h,j){var k,l,m,p,t=false;if(g==="sap.m.Button"){g="sap.ushell.ui.launchpad.ActionItem";}k=g.replace(/\./g,"/");l=sap.ui.require(k);if(l){t=true;}else if(!O.get(g||"")){q.sap.require(g);}p=function(o){if(g){if(t){return new l(o);}var u=O.get(g||"");return new u(o);}L.warning("You must specify control type in order to create it");};m=this.createItem(o,h,p);if(i){this.showActionButton(m.getId(),h,j);}return m;};R.prototype.addFloatingButton=function(p){var o=new q.Deferred(),t=this,g,h,i=p.controlType,j=p.oControlProperties,I=p.bIsVisible,k=p.bCurrentState,l=p.aStates;if(j&&j.id&&sap.ui.getCore().byId(j.id)){h=sap.ui.getCore().byId(j.id);if(h){if(I){t.showFloatingActionButton(oItem.getId(),k,l);t.oShellModel.addElementToManagedQueue(h);}o.resolve(h);}}if(i){g=i.replace(/\./g,"/");}else{g="sap/m/Button";}sap.ui.require([g],function(m){h=new m(j);if(I){this.showFloatingActionButton(oItem.getId(),k,l);}o.resolve(h);});return o.promise();};R.prototype.addFloatingActionButton=function(g,o,i,h,j){var k,l,m,p,t=false;if(!g){g="sap.m.Button";}k=g.replace(/\./g,"/");l=sap.ui.require(k);if(l){t=true;}else if(!O.get(g||"")){q.sap.require(g);}p=function(o){if(g){if(t){return new l(o);}var u=O.get(g||"");return new u(o);}L.warning("You must specify control type in order to create it");};m=this.createItem(o,h,p);if(i){this.showFloatingActionButton(m.getId(),h,j);}return m;};R.prototype.addSidePaneContent=function(p){var o=new q.Deferred(),t=this,g,h,i=p.controlType,j=p.oControlProperties,I=p.bIsVisible,k=p.bCurrentState,l=p.aStates;if(j&&j.id&&sap.ui.getCore().byId(j.id)){h=sap.ui.getCore().byId(j.id);if(h){o.resolve(h);}}if(i){g=i.replace(/\./g,"/");sap.ui.require([g],function(m){h=new m(j);if(I){t.oShellModel.addElementToManagedQueue(h);t.showLeftPaneContent(oItem.getId(),k,l);}o.resolve(h);});}else{L.warning("You must specify control type in order to create it");}return o.promise();};R.prototype.addLeftPaneContent=function(g,o,i,h,j){var k=g.replace(/\./g,"/"),l=sap.ui.require(k),m,p,t;if(l){t=true;}else if(!O.get(g||"")){q.sap.require(g);}p=function(o){if(g){if(t){return new l(o);}var u=O.get(g||"");return new u(o);}L.warning("You must specify control type in order to create it");};m=this.createItem(o,h,p);if(i){this.showLeftPaneContent(m.getId(),h,j);}return m;};R.prototype.addHeaderItem=function(g,o,i,h,j){if(typeof(arguments[0])==="object"&&typeof(arguments[1])==="boolean"){o=arguments[0];i=arguments[1];h=arguments[2];j=arguments[3];}else{L.warning("sap.ushell.renderers.fiori2.Renderer: The parameter 'controlType' of the function 'addHeaderItem' is deprecated. Usage will be ignored!");}var p=o;p.showSeparator=false;var k=function(o){return new S(o);},I=this.createItem(p,h,k);if(i){this.showHeaderItem(I.getId(),h,j);}return I;};R.prototype.addRightFloatingContainerItem=function(o,i,g,h){var j=function(o){return new N(o);},I=this.createItem(o,g,j);if(i){this.showRightFloatingContainerItem(I.getId(),g,h);}return I;};R.prototype.addToolAreaItem=function(o,i,g,h){o.visible=!!i;var j=function(p){return new T(p);},I=this.createItem(o,g,j);this.oShellModel.addToolAreaItem(I.getId(),!!i,g,h);return I;};R.prototype.addHeaderEndItem=function(g,o,i,h,j){var p=o;p.showSeparator=false;var k=function(o){return new S(o);},I=this.createItem(p,h,k);if(i){this.showHeaderEndItem(I.getId(),h,j);}return I;};R.prototype.getModelConfiguration=function(){return this.shellCtrl.getModelConfiguration();};R.prototype.addEndUserFeedbackCustomUI=function(o,g){this.shellCtrl.addEndUserFeedbackCustomUI(o,g);};R.prototype.addUserPreferencesEntry=function(g){return this.shellCtrl.addUserPreferencesEntry(g);};R.prototype.setHeaderTitle=function(t){this.shellCtrl.setHeaderTitle(t);};R.prototype.setLeftPaneVisibility=function(l,v){this.oShellModel.setLeftPaneVisibility(v,false,[l]);};R.prototype.showToolArea=function(l,v){this.oShellModel.showShellItem("/toolAreaVisible",l,v);};R.prototype.setHeaderHiding=function(h){return this.oShellModel.setHeaderHiding(h);};R.prototype.setFloatingContainerContent=function(o,g,h){this.shellCtrl.setFloatingContainerContent("floatingContainerContent",[o.getId()],g,h);};R.prototype.setFloatingContainerVisibility=function(v){this.shellCtrl.setFloatingContainerVisibility(v);};R.prototype.getFloatingContainerState=function(){return this.shellCtrl.getFloatingContainerState();};R.prototype.getFloatingContainerVisiblity=function(){return this.shellCtrl.getFloatingContainerVisibility();};R.prototype.getRightFloatingContainerVisibility=function(){return this.shellCtrl.getRightFloatingContainerVisibility();};R.prototype.setFloatingContainerDragSelector=function(E){this.shellCtrl.setFloatingContainerDragSelector(E);};R.prototype.makeEndUserFeedbackAnonymousByDefault=function(E){this.shellCtrl.makeEndUserFeedbackAnonymousByDefault(E);};R.prototype.showEndUserFeedbackLegalAgreement=function(g){this.shellCtrl.showEndUserFeedbackLegalAgreement(g);};R.prototype.LaunchpadState={App:"app",Home:"home"};R.prototype.createTriggers=function(t,g,h){this.oShellModel.createTriggers(t,g,h);};R.prototype.convertButtonsToActions=function(i,g,h){var p={},B,t=this;i.forEach(function(I){B=sap.ui.getCore().byId(I);p.id=B.getId();p.text=B.getText();p.icon=B.getIcon();p.tooltip=B.getTooltip();p.enabled=B.getEnabled();p.visible=B.getVisible();if(B.mEventRegistry&&B.mEventRegistry.press){p.press=B.mEventRegistry.press[0].fFunction;}B.destroy();t.addActionButton("sap.ushell.ui.launchpad.ActionItem",p,p.visible,g,h);});};R.prototype.createItem=function(o,g,h){var i;if(o&&o.id){i=sap.ui.getCore().byId(o.id);}if(!i){i=h(o);if(g){this.oShellModel.addElementToManagedQueue(i);}}return i;};R.prototype.addEntryInShellStates=function(g,h,i,j,o){this.oShellModel.addEntryInShellStates(g,h,i,j,o);};R.prototype.removeCustomItems=function(g,i,h,j){if(typeof i==="string"){this.oShellModel.removeCustomItems(g,[i],h,j);}else{this.oShellModel.removeCustomItems(g,i,h,j);}};R.prototype.addCustomItems=function(g,i,h,j){if(typeof i==="string"){this.oShellModel.addCustomItems(g,[i],h,j);}else{this.oShellModel.addCustomItems(g,i,h,j);}};R.prototype.addRightViewPort=function(v){this.shellCtrl.getViewPortContainer().addRightViewPort(v,false);};R.prototype.addLeftViewPort=function(v){this.shellCtrl.getViewPortContainer().addLeftViewPort(v,false);};R.prototype.getShellController=function(){return this.shellCtrl;};R.prototype.getViewPortContainerCurrentState=function(){return this.shellCtrl.getViewPortContainer().getCurrentState();};R.prototype.ViewPortContainerNavTo=function(g,t,h){return this.shellCtrl.getViewPortContainer().navTo(g,t,h);};function n(){}R.prototype.switchViewPortStateByControl=n;R.prototype.ViewPortContainerAttachAfterSwitchStateAnimationFinished=n;R.prototype.setMeAreaSelected=function(g){this.shellCtrl.setMeAreaSelected(g);};R.prototype.getMeAreaSelected=function(){return this.shellCtrl.getMeAreaSelected();};R.prototype.setNotificationsSelected=function(g){this.shellCtrl.setNotificationsSelected(g);};R.prototype.getNotificationsSelected=function(){return this.shellCtrl.getNotificationsSelected();};R.prototype.addShellDanglingControl=function(o){this.shellCtrl.getView().addDanglingControl(o);};R.prototype.getShellConfig=function(){return(this.shellCtrl.getView().getViewData()?this.shellCtrl.getView().getViewData().config||{}:{});};R.prototype.getEndUserFeedbackConfiguration=function(){return this.shellCtrl.oEndUserFeedbackConfiguration;};R.prototype.reorderUserPrefEntries=function(g){return this.shellCtrl._reorderUserPrefEntries(g);};R.prototype.addUserProfilingEntry=function(g){this.shellCtrl.addUserProfilingEntry(g);};R.prototype.logRecentActivity=function(o){if(!o.appType){o.appType=b.APP;}if(!o.appId){o.appId=o.url;}return this.shellCtrl._logRecentActivity(o);};R.prototype.setCurrentCoreView=function(g){this.currentCoreView=g;};R.prototype.getCurrentCoreView=function(){return this.currentCoreView;};return R;});

// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources","sap/ushell/Config","sap/m/Dialog","sap/m/Button","sap/m/Text","sap/ui/model/json/JSONModel","sap/m/VBox","sap/ui/core/library","sap/ushell/ui/launchpad/LoadingDialog","sap/ui/thirdparty/jquery","sap/ui/util/Storage","sap/base/Log"],function(r,C,D,B,T,J,V,c,L,q,S,a){"use strict";var b=c.ValueState;var d=function(A){var t=this;this.init=function(o){this.config=o;this.oModel=new J();sap.ushell.Container.registerLogout(this.logout);this.putTimestampInStorage(this._getCurrentDate());this.putContinueWorkingVisibilityInStorage(null);this.registerCommHandlers();this.attachUserEvents();if(o.sessionTimeoutIntervalInMinutes>0){this.initSessionTimeout();}if(o.sessionTimeoutTileStopRefreshIntervalInMinutes>0){this.initTileRequestTimeout();}};this.initSessionTimeout=function(){q.sap.measure.start("SessionTimeoutInit","Inititialize Session Timeout","FLP_SHELL");if(this.config.enableAutomaticSignout===undefined){this.config.enableAutomaticSignout=false;}if(this.config.sessionTimeoutReminderInMinutes===undefined){this.config.sessionTimeoutReminderInMinutes=0;}this.oModel.setProperty("/SessionRemainingTimeInSeconds",this.config.sessionTimeoutReminderInMinutes*60);this.counter=0;this.oKeepAliveDialog=undefined;this.notifyServer();this.notifyUserInactivity();q.sap.measure.end("SessionTimeoutInit");};this.registerCommHandlers=function(){A.registerShellCommunicationHandler({"sap.ushell.sessionHandler":{oRequestCalls:{"logout":{isActiveOnly:false,distributionType:["URL"]},"extendSessionEvent":{isActiveOnly:false,distributionType:["all"]}},oServiceCalls:{"notifyUserActive":{executeServiceCallFn:function(){t.userActivityHandler();return new q.Deferred().resolve().promise();}}}}});};this._getTimeSinceLastActionInMinutes=function(){var e=this._getCurrentDate()-new Date(this.getTimestampFromStorage());var f=e/(1000*60);return f;};this.notifyUserInactivity=function(){var e=this._getTimeSinceLastActionInMinutes();var f=this.config.sessionTimeoutIntervalInMinutes-this.config.sessionTimeoutReminderInMinutes;if(e<f){setTimeout(this.notifyUserInactivity.bind(this),(f-e)*60*1000);}else if(this.config.sessionTimeoutReminderInMinutes>0){this.putContinueWorkingVisibilityInStorage(null);this.detachUserEvents();this.handleSessionRemainingTime(this.config.sessionTimeoutReminderInMinutes*60,true);this.oContinueWorkingDialog=this.createContinueWorkingDialog();this.oContinueWorkingDialog.open();}else{this.handleSessionOver();}};this.handleSessionOver=function(){clearTimeout(this.notifyServerTimer);sap.ui.getCore().getEventBus().publish("launchpad","sessionTimeout");if(this.config.enableAutomaticSignout===true){this.logout();}else{this.createSessionExpiredDialog().open();}};this.notifyServer=function(){var e=this._getCurrentDate()-new Date(this.getTimestampFromStorage()),f=e/(1000*60);if(f<=this.config.sessionTimeoutIntervalInMinutes){sap.ushell.Container.sessionKeepAlive();A.postMessageToIframeApp("sap.ushell.sessionHandler","extendSessionEvent",{});}else{}this.notifyServerTimer=setTimeout(this.notifyServer.bind(this),this.config.sessionTimeoutIntervalInMinutes*60*1000);};this.handleSessionRemainingTime=function(R){var s=this.getContinueWorkingVisibilityFromStorage();var e=this._getTimeSinceLastActionInMinutes();if(e<this.config.sessionTimeoutIntervalInMinutes-this.config.sessionTimeoutReminderInMinutes){s=false;}if(s!==undefined&&s===false&&this.oContinueWorkingDialog&&this.oContinueWorkingDialog.isOpen()){this.continueWorkingButtonPressHandler();}if(R===0){if(this.oSessionKeepAliveDialog){this.oSessionKeepAliveDialog.close();}this.handleSessionOver();}else{R=R-1;this.oModel.setProperty("/SessionRemainingTimeInSeconds",R);this.remainingTimer=setTimeout(t.handleSessionRemainingTime.bind(t,R,false),1000);}};this.initTileRequestTimeout=function(){q.sap.measure.start("SessionTileStopRequestInit","Initialize tile request timeout","FLP_SHELL");this.checkStopBackendRequestRemainingTime();this.bBackendRequestsActive=true;q.sap.measure.end("SessionTileStopRequestInit");};this.checkStopBackendRequestRemainingTime=function(){var s=this._getCurrentDate()-new Date(this.getTimestampFromStorage()),e=s/(1000*60),R=this.config.sessionTimeoutTileStopRefreshIntervalInMinutes,f=(R-e)*60*1000;if(e<R){setTimeout(this.checkStopBackendRequestRemainingTime.bind(this),f);}else if(R>0){this._setConnectionActive(false);}};this._setConnectionActive=function(e){if(e){setTimeout(this.checkStopBackendRequestRemainingTime.bind(this),0);}if(this.bBackendRequestsActive===e){return;}sap.ui.getCore().getEventBus().publish("launchpad","setConnectionToServer",{"active":e});if(!C.last("/core/spaces/enabled")){if(e){this._setTilesVisibleOnHomepage();}else{this._setTilesInvisibleOnHomepage();}}this.bBackendRequestsActive=e;};this._setTilesVisibleOnHomepage=function(){sap.ui.require(["sap/ushell/utils"],function(u){u.handleTilesVisibility();});};this._setTilesInvisibleOnHomepage=function(){return new Promise(function(e,f){return sap.ushell.Container.getServiceAsync("LaunchPage").then(function(g){g.getGroups().then(function(G){var E=sap.ui.getCore().getEventBus();G.forEach(function(o){g.getGroupTiles(o).forEach(function(h){g.setTileVisible(h,false);});});E.publish("launchpad","visibleTilesChanged",[]);e();});});});};this.getLocalStorage=function(){if(this.oLocalStorage===undefined){var s=new S(this.config&&this.config.sessionType||S.Type.local);if(this._isLocalStorageSupported(s)){this.oLocalStorage=s;}else{this.oLocalStorage=false;}}return this.oLocalStorage;};this._isLocalStorageSupported=function(s){var i;try{i=s.isSupported();}catch(e){i=false;}if(!i){a.warning("SessionHandler failed to instantiate the local storage handler. Might be disabled by the browser!");}return i;};this.createContinueWorkingDialog=function(){this.oMessageVBox=new V();this.oSessionKeepAliveLabel=new T({text:{parts:["/SessionRemainingTimeInSeconds"],formatter:function(s){var i=s>60,e,f,m;e=i?r.i18n.getText("sessionTimeoutMessage_units_minutes"):r.i18n.getText("sessionTimeoutMessage_units_seconds");f=i?Math.ceil(s/60):s;if(t.config.enableAutomaticSignout){m=r.i18n.getText("sessionTimeoutMessage_kioskMode_main",[f,e]);}else{m=r.i18n.getText("sessionTimeoutMessage_main",[f,e]);}return m;}}});this.oMessageVBox.addItem(this.oSessionKeepAliveLabel);if(this.config.enableAutomaticSignout===false){this.oLostDataReminder=new T({text:r.i18n.getText("sessionTimeoutMessage_unsavedData")});this.oMessageVBox.addItem(this.oLostDataReminder);}this.oSessionKeepAliveLabel.setModel(this.oModel);this.oSessionKeepAliveDialog=new D("sapUshellKeepAliveDialog",{title:r.i18n.getText("sessionTimeoutMessage_title"),type:"Message",state:b.Warning,content:this.oMessageVBox,beginButton:this.getContinueWorkingButton(),afterClose:function(){this.oSessionKeepAliveDialog.destroy();}.bind(this)});if(this.config.enableAutomaticSignout===true){this.oSignOutButton=new B({text:r.i18n.getText("logoutBtn_title"),tooltip:r.i18n.getText("logoutBtn_tooltip"),press:this.logout.bind(this)});this.oSessionKeepAliveDialog.setEndButton(this.oSignOutButton);}return this.oSessionKeepAliveDialog;};this.getContinueWorkingButton=function(){return new B({text:r.i18n.getText("sessionTimeoutMessage_continue_button_title"),press:t.continueWorkingButtonPressHandler.bind(t)});};this.continueWorkingButtonPressHandler=function(){if(this.oSessionKeepAliveDialog){this.oSessionKeepAliveDialog.close();}clearTimeout(this.remainingTimer);this.putTimestampInStorage(this._getCurrentDate());this.notifyUserInactivity();this.attachUserEvents();this.putContinueWorkingVisibilityInStorage(false);A.postMessageToIframeApp("sap.ushell.sessionHandler","extendSessionEvent",{});};this.createSessionExpiredDialog=function(){this.oSessionExpiredDialog=new D("sapUshellSessioTimedOutDialog",{title:r.i18n.getText("sessionExpiredMessage_title"),type:"Message",state:b.Warning,content:new T({text:r.i18n.getText("sessionExpiredMessage_main")}),beginButton:this.getReloadButton(),afterClose:function(){this.oSessionExpiredDialog.destroy();}.bind(this)});return this.oSessionExpiredDialog;};this.getReloadButton=function(){return new B({text:r.i18n.getText("sessionExpiredMessage_reloadPage_button_title"),press:function(){t.oSessionExpiredDialog.close();location.reload();}});};this.attachUserEvents=function(){q(document).on("mousedown.sessionTimeout mousemove.sessionTimeout",this.userActivityHandler.bind(this));q(document).on("keyup.sessionTimeout",this.userActivityHandler.bind(this));q(document).on("touchstart.sessionTimeout",this.userActivityHandler.bind(this));sap.ushell.Container.getService("AppLifeCycle").attachAppLoaded({},this.userActivityHandler,this);};this.detachUserEvents=function(){q(document).off("mousedown.sessionTimeout mousemove.sessionTimeout");q(document).off("keydown.sessionTimeout");q(document).off("touchstart.sessionTimeout");sap.ushell.Container.getService("AppLifeCycle").detachAppLoaded(this.userActivityHandler,this);};this.putTimestampInStorage=function(e){q.sap.measure.average("SessionTimeoutPutLocalStorage","Put timestamp in local storage Average","FLP_SHELL");var l=this.getLocalStorage();if(l){l.put("lastActivityTime",e);if(this.bBackendRequestsActive===false){this._setConnectionActive(true);}}q.sap.measure.end("SessionTimeoutPutLocalStorage");};this.putContinueWorkingVisibilityInStorage=function(v){var l=this.getLocalStorage();if(l){l.put("showContinueWorkingDialog",v);}};this.getContinueWorkingVisibilityFromStorage=function(){var l=this.getLocalStorage();if(l){return l.get("showContinueWorkingDialog");}return null;};this.getTimestampFromStorage=function(){var l=this.getLocalStorage();if(l){return l.get("lastActivityTime");}return null;};this.userActivityHandler=function(){if(this.oUserActivityTimer!==undefined){return;}this.oUserActivityTimer=setTimeout(function(){t.putTimestampInStorage(t._getCurrentDate());t.oUserActivityTimer=undefined;},1000);};this._getCurrentDate=function(){return new Date();};this.logout=function(){var l=new L({text:""});A.postMessageToIframeApp("sap.ushell.sessionHandler","logout",{},true).then(function(){t.detachUserEvents();clearTimeout(t.oUserActivityTimer);clearTimeout(t.remainingTimer);clearTimeout(t.notifyServerTimer);l.openLoadingScreen();l.showAppInfo(r.i18n.getText("beforeLogoutMsg"),null);sap.ushell.Container.setDirtyFlag(false);sap.ushell.Container.defaultLogout();});};};return d;},true);

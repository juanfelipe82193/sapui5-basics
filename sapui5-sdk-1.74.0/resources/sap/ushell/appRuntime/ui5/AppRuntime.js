// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/util/LoaderExtensions","sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI","sap/ushell/appRuntime/ui5/AppCommunicationMgr","sap/ushell/appRuntime/ui5/AppRuntimeService","sap/ui/thirdparty/URI","sap/ushell/appRuntime/ui5/SessionHandlerAgent","sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent","sap/ushell/appRuntime/ui5/services/ShellUIService","sap/ushell/ui5service/UserStatus","sap/ushell/appRuntime/ui5/services/AppConfiguration","sap/ui/core/Popup","sap/ui/thirdparty/jquery","sap/base/util/isEmptyObject","sap/base/Log","sap/ui/core/ComponentContainer","sap/ushell/appRuntime/ui5/renderers/fiori2/RendererExtensions"],function(L,A,a,b,U,S,c,d,e,f,P,q,i,g,C){"use strict";var p=new U().search(true),o,s,D="sap/ushell/appRuntime/ui5/AppRuntimeDefaultConfiguration.json",E=false;function h(){this.main=function(){var t=this;a.init();Promise.all([t.getPageConfig(),c.getURLParameters(t._getURI())]).then(function(v){var u=v[1],k=u["sap-ui-app-id"];t.setModulePaths();t.init();Promise.all([t.initServicesContainer(),t.getAppInfo(k)]).then(function(v){var l=v[1];S.init();t.createApplication(k,u,l).then(function(r){t.renderApplication(r);});});});};this._getURI=function(){return new U().query(true);};this.init=function(){A.registerCommHandlers({"sap.ushell.appRuntime":{oInboundActions:{"hashChange":{executeServiceCallFn:function(k){var H=k.oMessageData.body.sHash;if(H&&H.length>0){window.hasher.replaceHash(H);}return new q.Deferred().resolve().promise();}},"setDirtyFlag":{executeServiceCallFn:function(k){var I=k.oMessageData.body.bIsDirty;if(I!==sap.ushell.Container.getDirtyFlag()){sap.ushell.Container.setDirtyFlag(I);}return new q.Deferred().resolve().promise();}},"themeChange":{executeServiceCallFn:function(k){var l=k.oMessageData.body.currentThemeId;sap.ushell.Container.getUser().setTheme(l);return new q.Deferred().resolve().promise();}},"buttonClick":{executeServiceCallFn:function(k){sap.ushell.renderers.fiori2.Renderer.handleHeaderButtonClick(k.oMessageData.body.buttonId);return new q.Deferred().resolve().promise();}},"uiDensityChange":{executeServiceCallFn:function(k){var l=k.oMessageData.body.isTouch;q("body").toggleClass("sapUiSizeCompact",(l==="0")).toggleClass("sapUiSizeCozy",(l==="1"));return new q.Deferred().resolve().promise();}}}}});};this.getPageConfig=function(){var m,k;return new Promise(function(r){L.loadResource(D,{async:true}).then(function(l){m=q("meta[name='sap.ushellConfig.ui5appruntime']")[0];k=JSON.parse(m.content);window["sap-ushell-config"]=q.extend(true,{},l,k);r();});});};this.setModulePaths=function(){if(window["sap-ushell-config"].modulePaths){var k=Object.keys(window["sap-ushell-config"].modulePaths);for(var l in k){(function(){var m={};m[k[l].replace(/\./g,"/")]=window["sap-ushell-config"].modulePaths[k[l]];sap.ui.loader.config({paths:m});}());}}};this.initServicesContainer=function(){return new Promise(function(r){sap.ui.require(["sap/ushell/appRuntime/ui5/services/Container"],function(k){k.bootstrap("apprt",{apprt:"sap.ushell.appRuntime.ui5.services.adapters"}).then(function(){r();});});});};this._getURIParams=function(){return p;};this.getAppInfo=function(k){var l=window["sap-ushell-config"].ui5appruntime.config.appIndex.data,m=window["sap-ushell-config"].ui5appruntime.config.appIndex.module,t=this;return new Promise(function(r){if(l&&!i(l)){c.getAppInfo(m,t.createApplication.bind(t),t.renderApplication.bind(t));r(l);}else{sap.ui.require([m.replace(/\./g,"/")],function(n){c.init(n,t.createApplication.bind(t),t.renderApplication.bind(t));n.getAppInfo(k).then(function(u){r(u);});});}});};this.setApplicationParameters=function(k,u){var l,m,n,r=new q.Deferred();function t(v,I){var w="";if(v&&v.length>0){w=(v.startsWith("?")?"":"?")+v;}if(I&&I.length>0){w+=(w.length>0?"&":"?")+I;}return w;}if(u.hasOwnProperty("sap-startup-params")){l=(new U("?"+u["sap-startup-params"])).query(true);if(l.hasOwnProperty("sap-intent-param")){m=l["sap-intent-param"];delete l["sap-intent-param"];}n=(new U("?")).query(l).toString();if(m){b.sendMessageToOuterShell("sap.ushell.services.CrossApplicationNavigation.getAppStateData",{"sAppStateKey":m}).then(function(M){k.url+=t(n,M);r.resolve();},function(v){k.url+=t(n);r.resolve();});}else{k.url+=t(n);r.resolve();}}else{r.resolve();}return r.promise();};this.setHashChangedCallback=function(){function t(n){if(n&&typeof n==="string"&&n.length>0){b.sendMessageToOuterShell("sap.ushell.appRuntime.hashChange",{"newHash":n});}}window.hasher.changed.add(t.bind(this),this);};this.createApplication=function(k,u,l){var t=this,m=function(n){b.sendMessageToOuterShell("sap.ushell.services.ShellUIService.showShellUIBlocker",{"bShow":n.getParameters().visible});};return new Promise(function(r){o=new C({id:k+"-content",width:"100%",height:"100%"});var n="0";if(p.hasOwnProperty("sap-touch")){n=p["sap-touch"];if(n!=="0"&&n!=="1"){n="0";}}q("body").toggleClass("sapUiSizeCompact",(n==="0")).toggleClass("sapUiSizeCozy",(n==="1"));if(!s){sap.ushell.renderers.fiori2.utils.init();s=sap.ushell.Container.getService("ShellNavigation");s.init(function(){});s.registerNavigationFilter(function(){if(sap.ushell.Container.getDirtyFlag()){return s.NavigationFilterStatus.Abandon;}return s.NavigationFilterStatus.Continue;});}c.setComponent(o);new d({scopeObject:o,scopeType:"component"});new e({scopeObject:o,scopeType:"component"});if(P.attachBlockLayerStateChange){P.attachBlockLayerStateChange(m);}t.setApplicationParameters(l,u).done(function(){t.setHashChangedCallback();sap.ushell.Container.getServiceAsync("Ui5ComponentLoader").then(function(v){v.createComponent({ui5ComponentName:k,applicationDependencies:l,url:l.url},"todo-replaceDummyShellHash",false).then(function(R){t.overrideSendAsEmailFn();r(R);});});});});};this.overrideSendAsEmailFn=function(){if(E===true){return;}E=true;var t;if(sap.m&&sap.m.URLHelper&&sap.m.URLHelper.triggerEmail){t=sap.m.URLHelper.triggerEmail;sap.m.URLHelper.triggerEmail=function(T,k,B,l,m){if((k&&k.includes(document.URL))||(B&&B.includes(document.URL))){sap.ushell.Container.getFLPUrl(true).then(function(u){if(B&&B.includes(document.URL)){B=B.replace(document.URL,u);}if(k&&k.includes(document.URL)){k=k.replace(document.URL,u);}t.call(sap.m.URLHelper,T,k,B,l,m);},function(n){g.error("Could not retrieve FLP URL",n,"sap.ushell.appRuntime.ui5.appRuntime");});}else{t.call(sap.m.URLHelper,T,k,B,l,m);}};}};this.renderApplication=function(r){o.setComponent(r.componentHandle.getInstance()).placeAt("content");};}var j=new h();j.main();return j;});

//@ui5-bundle sap/zen/dsh/library-preload.js
/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
sap.ui.predefine('sap/zen/dsh/library',["sap/ui/core/Core","sap/ui/core/library","sap/ui/layout/library","sap/ui/table/library","sap/m/library","sap/zen/commons/library","sap/zen/crosstab/library"],function(){sap.ui.getCore().initLibrary({name:"sap.zen.dsh",dependencies:["sap.ui.core","sap.ui.table","sap.ui.layout","sap.m","sap.zen.commons","sap.zen.crosstab"],types:[],interfaces:[],controls:["sap.zen.dsh.AnalyticGrid","sap.zen.dsh.Dsh"],elements:[],noLibraryCSS:true,version:"1.74.0"});return sap.zen.dsh;});
sap.ui.require.preload({
	"sap/zen/dsh/fioriwrapper/manifest.json":'{"_version":"1.1.0","sap.app":{"_version":"1.1.0","id":"sap.zen.dsh.fioriwrapper","type":"application","ach":"BI-RA-AD","dataSources":{"RSAO_ODATA_SRV":{"uri":"/sap/opu/odata/sap/RSAO_ODATA_SRV","settings":{"localUri":"./model/metadata.xml"}}},"applicationVersion":{"version":"1.43.0-SNAPSHOT"}},"sap.ui":{"_version":"1.1.0","technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":false},"supportedThemes":["sap_hcb","sap_bluecrystal","sap_belize"]},"sap.ui5":{"_version":"1.1.0","services":{"ShellUIService":{"factoryName":"sap.ushell.ui5service.ShellUIService"}},"dependencies":{"minUI5Version":"1.38.1-SNAPSHOT","libs":{"sap.m":{},"sap.ui.generic.app":{},"sap.zen.commons":{},"sap.zen.crosstab":{},"sap.viz":{},"sap.zen.dsh":{}},"components":{}},"config":{"fullWidth":true},"routing":{"config":{},"routes":[]},"contentDensities":{"compact":true,"cozy":true}}}',
	"sap/zen/dsh/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.zen.dsh","type":"library","embeds":["fioriwrapper"],"applicationVersion":{"version":"1.74.0"},"title":"Design Studio Runtime Library.","description":"Design Studio Runtime Library.  Intended only to be used within S/4 HANA Fiori applications.","ach":"BI-RA-AD-EA","resources":"resources.json","offline":true,"openSourceComponents":[{"name":"underscore","packagedWithMySelf":true,"version":"0.0.0"},{"name":"xlsx","packagedWithMySelf":true,"version":"0.0.0"},{"name":"jszip","packagedWithMySelf":true,"version":"0.0.0"}]},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.74","libs":{"sap.ui.core":{"minVersion":"1.74.0"},"sap.ui.table":{"minVersion":"1.74.0"},"sap.ui.layout":{"minVersion":"1.74.0"},"sap.m":{"minVersion":"1.74.0"},"sap.viz":{"minVersion":"1.74.0","lazy":true},"sap.zen.commons":{"minVersion":"1.74.0"},"sap.zen.crosstab":{"minVersion":"1.74.0"}}},"library":{"i18n":false,"css":false,"content":{"controls":["sap.zen.dsh.AnalyticGrid","sap.zen.dsh.Dsh"],"elements":[],"types":[],"interfaces":[]}}}}',
	"sap/zen/dsh/AnalyticGridRenderer.js":function(){
/* the subsequent text seems not to contain a copyright or license statement */
jQuery.sap.declare("sap.zen.dsh.AnalyticGridRenderer");jQuery.sap.require("sap.zen.dsh.DshRenderer");sap.zen.dsh.AnalyticGridRenderer=sap.zen.dsh.DshRenderer;
},
	"sap/zen/dsh/DshRenderer.js":function(){jQuery.sap.declare("sap.zen.dsh.DshRenderer");sap.zen.dsh.DshRenderer={};
sap.zen.dsh.DshRenderer.render=function(r,c){r.write("<div");r.writeControlData(c);r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());r.addClass("sapZenDshDsh");r.addClass("sapUiBody");r.writeStyles();r.writeClasses();r.write(">");r.write("<div id=\""+c.getId()+"sapbi_snippet_ROOT\" ");r.writeAttribute("class","sapbi_snippet_ROOT");r.addClass("sapUiBody");r.write("style=\"");r.write("width:100%;");r.write("height:100%;");r.write("\">");r.write("</div>");r.write("</div>");};
},
	"sap/zen/dsh/fioriwrapper/Component.js":function(){jQuery.sap.require("sap.ui.core.UIComponent");jQuery.sap.declare("sap.zen.dsh.fioriwrapper.Component");
sap.ui.core.UIComponent.extend("sap.zen.dsh.fioriwrapper.Component",{metadata:{"manifest":"json"}});
sap.zen.dsh.fioriwrapper.Component.prototype.createContent=function(){jQuery.sap.require("sap.zen.dsh.Dsh");jQuery.sap.require("sap.ui.generic.app.navigation.service.NavigationHandler");sap.zen.dsh.scriptLoaded=true;var a="";var c=this.getMetadata().getConfig();var m={};var r;var n={};var t;function b(M,v,V){if(Array.isArray(M)){for(var f in M){v[M[f]]=V;}}else{v[M]=V;}}if(c){if(c.semanticObjectMappings){m=c.semanticObjectMappings;r={};for(var k in m){if(m.hasOwnProperty(k)){b(m[k],r,k);}}}if(c.appName){a=c.appName;}if(c.systemAlias){t=c.systemAlias;}}if(this.getComponentData().startupParameters){if(this.getComponentData().startupParameters.appName)a=this.getComponentData().startupParameters.appName;if(this.getComponentData().startupParameters["sap-system"]){t=this.getComponentData().startupParameters["sap-system"];}}var d=new sap.zen.dsh.Dsh({id:"dsh"+a,height:"100%",width:"100%",deployment:"bw",dshAppName:a,repoPath:c.repoPath||"",semanticMappings:m,appComponent:this,systemAlias:t,deferCreation:true});if(this.getComponentData().startupParameters){for(var p in this.getComponentData().startupParameters){if(this.getComponentData().startupParameters.hasOwnProperty(p)&&p!=="newBW"){var e=this.getComponentData().startupParameters[p][0];d.addParameter(p,e);if(m&&m.hasOwnProperty(p)){b(m[p],n,e);}else{n[p]=e;}}}}var N=new sap.ui.generic.app.navigation.service.NavigationHandler(this);var P=N.parseNavigation();P.always(function(s){d.initializeAppStateData.call(d,s,n);if(c.navigationSourceObjects){d.addParameter("NAV_SOURCES",JSON.stringify(c.navigationSourceObjects));}if(r){d.addParameter("NAV_SEMANTIC_MAPPINGS",JSON.stringify(r));}d.createPage();});return d;}
},
/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
	"sap/zen/dsh/AnalyticGrid.js":'/*!\n * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.\n */\njQuery.sap.declare("sap.zen.dsh.AnalyticGrid");jQuery.sap.require("sap.zen.dsh.library");jQuery.sap.require("sap.ui.core.Control");\nsap.ui.core.Control.extend("sap.zen.dsh.AnalyticGrid",{metadata:{library:"sap.zen.dsh",properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},selection:{type:"object",group:"Data",defaultValue:null},queryName:{type:"string",group:"Data",defaultValue:null},systemAlias:{type:"string",group:"Data",defaultValue:null},state:{type:"string",group:"Data",defaultValue:null}},events:{stateChange:{parameters:{state:{type:"string"}}},selectionChange:{parameters:{selection:{type:"object"}}}}}});\nif(require&&!require.config){sap.ui.loader.config({noConflict:true});}$.sap.require("sap.ui.thirdparty.URI");window.DSH_deployment=true;var sapbi_ajaxHandler=sapbi_ajaxHandler||{};window.sapbi_page=window.sapbi_page||{};sapbi_page.getParameter=sapbi_page.getParameter||function(){return"";};var sapbi_MIMES_PIXEL=sapbi_MIMES_PIXEL||"";if(!window.sap){window.sap={};}if(!sap.zen){sap.zen={};}sap.zen.doReplaceDots=true;\nsap.zen.dsh.AnalyticGrid.prototype.init=function(){this.parameters={};this.dshBaseUrl=URI(sap.ui.resource("sap.zen.dsh","rt/")).absoluteTo(window.location.pathname).toString();sapbi_page.staticMimeUrlPrefix=this.dshBaseUrl;this.repositoryUrl=URI(sap.ui.resource("sap.zen.dsh","applications/")).absoluteTo(window.location.pathname).toString();};\nsap.zen.dsh.AnalyticGrid.prototype._initializeInternal=function(){if(this.initialized){this.page.forceFullNonDeltaRender();return;}this.initialized=true;this._addParameter("XQUERY",this.getQueryName());jQuery.sap.require("sap.zen.dsh.rt.all");if(jQuery.sap.debug()==="true"){jQuery.sap.require("sap.zen.dsh.rt.zen_rt_firefly.js.jszip");jQuery.sap.require("sap.zen.dsh.rt.zen_rt_firefly.js.xlsx");}if(this.getState()){this._initializeInnerAppState(this.getState());}else{this._initializeSelectionVariant(this.getSelection());}var t=this;setTimeout(function(){t._createPage();},0);};\nsap.zen.dsh.AnalyticGrid.prototype._createPage=function(){sap.zen.dsh.scriptLoaded=true;var t=this;var c=sap.ui.getCore().getConfiguration();var l=c.getLocale().getSAPLogonLanguage();if(!l){l=window.navigator.userLanguage||window.navigator.language;}var a="";if(document.cookie){var m=/(?:sap-usercontext=)*sap-client=(\\d{3})/.exec(document.cookie);if(m&&m[1]){a=m[1];}}var u=sap.firefly.XHashMapOfStringByString.create();for(var k in this.parameters){u.put(k,this.parameters[k]);}var d=new sap.zen.DesignStudio();d.setHost(document.location.hostname);d.setPort(document.location.port);d.setProtocol(document.location.protocol.split(":")[0]);d.setClient(a);d.setLanguage(l);if(this.repositoryUrl){d.setRepositoryUrl(this.repositoryUrl);}d.setApplicationPath(this.repositoryUrl+"0ANALYTIC_GRID");d.setApplicationName("0ANALYTIC_GRID");d.setUrlParameter(u);d.setSdkLoaderPath("");d.setHanaMode(true);d.setDshControlId(t.getId());d.setStaticMimesRootPath(this.dshBaseUrl);d.setSystemAlias(this.getSystemAlias());d.setNewBW(true);this.page=d.createPage();window[t.getId()+"Buddha"]=this.page;sapbi_page=sapbi_page||{};sapbi_page.staticMimeUrlPrefix=this.dshBaseUrl;sapbi_page.getParameter=function(){return"";};sapbi_MIMES_PIXEL="";};\nsap.zen.dsh.AnalyticGrid.prototype.onAfterRendering=function(){this._initializeInternal();};\nsap.zen.dsh.AnalyticGrid.prototype._logoff=function(){if(!this.loggedOff){this.loggedOff=true;this._executeScript("APPLICATION.logoff();");}};\nsap.zen.dsh.AnalyticGrid.prototype.exit=function(){this._logoff();var r=sap.ui.getCore().byId(this.sId+"ROOT_absolutelayout");if(r){r.destroy();}};\nsap.zen.dsh.AnalyticGrid.prototype._addParameter=function(n,v){this.parameters[n]=v;};\nsap.zen.dsh.AnalyticGrid.prototype._executeScript=function(s){this.page.getWindow().increaseLock();this.page&&this.page.exec&&this.page.exec(s);};\nsap.zen.dsh.AnalyticGrid.prototype.setSelection=function(s){this.setProperty("selection",s,true);if(this.initialized){var n=this._buildNavParamObject(s);this.page.navigationParamObject=JSON.stringify(n);this._executeScript("GLOBAL_SCRIPT_ACTIONS.ApplyNavigationParameters();");}return this;};\nsap.zen.dsh.AnalyticGrid.prototype.fireSelectionChange=function(p){this.setProperty("selection",p.selection,true);return this.fireEvent("selectionChange",p);};\nsap.zen.dsh.AnalyticGrid.prototype._buildNavParamObject=function(s){function a(O,v,V){if(!v.hasOwnProperty(O)){v[O]=V;}}var n={};if(s){var p=s.Parameters;var S=s.SelectOptions;if(p){for(var b=0;b<p.length;b++){var P=p[b];n[P.PropertyName]=P.PropertyValue;}}if(S){for(var i=0;i<S.length;++i){var o=S[i];var r=o.Ranges;var f=[];for(var j=0;j<r.length;++j){var c;var R=r[j];if(["EQ","BT","GE","LE","GT","LT"].indexOf(R.Option)==-1){continue;}if(R.Sign==="I"&&R.Option==="EQ"){c=R.Low;}else{c={exclude:R.Sign==="E"||undefined,operation:R.Option,from:R.Low,to:R.High};}f.push(c);}if(f.length>0){a(o.PropertyName,n,f);}}}}return n;};\nsap.zen.dsh.AnalyticGrid.prototype._initializeSelectionVariant=function(s){var n=this._buildNavParamObject(s);if(!jQuery.isEmptyObject(n)){this._addParameter("NAV_PARAMS",JSON.stringify(n));}};\nsap.zen.dsh.AnalyticGrid.prototype._initializeInnerAppState=function(s){if(s){this._addParameter("NAV_INITIAL_STATE",s);}};\nsap.zen.dsh.AnalyticGrid.prototype.setState=function(s){this.setProperty("state",s,true);if(this.initialized){this.page.getWindow().getContext("BookmarkInternal").applyApplicationState(s,true);this.page.forceFullNonDeltaRender();}return this;};\nsap.zen.dsh.AnalyticGrid.prototype.fireStateChange=function(p){this.setProperty("state",p.state,true);return this.fireEvent("stateChange",p);}\n',
	"sap/zen/dsh/Dsh.js":function(){jQuery.sap.declare("sap.zen.dsh.Dsh");jQuery.sap.require("sap.zen.dsh.library");jQuery.sap.require("sap.ui.core.Control");
sap.ui.core.Control.extend("sap.zen.dsh.Dsh",{metadata:{library:"sap.zen.dsh",properties:{dshAppName:{type:"string",group:"Misc",defaultValue:'0ANALYSIS'},repoPath:{type:"string",group:"Misc",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},deployment:{type:"string",group:"Misc",defaultValue:'bw'},protocol:{type:"string",group:"Misc",defaultValue:null},client:{type:"string",group:"Misc",defaultValue:null},language:{type:"string",group:"Misc",defaultValue:null},semanticMappings:{type:"object",group:"Misc",defaultValue:null},appComponent:{type:"object",group:"Misc",defaultValue:null},deferCreation:{type:"boolean",group:"Misc",defaultValue:false},systemAlias:{type:"string",group:"Misc",defaultValue:null}}}});
sap.ui.getCore().loadLibrary("sap.viz");if(require&&!require.config){sap.ui.loader.config({noConflict:true});}sap.ui.define("sap/zen/dsh/Dsh",["sap/ui/thirdparty/URI","sap/zen/dsh/rt/all"],function(U){window.DSH_deployment=true;var s=s||{};window.sapbi_page=window.sapbi_page||{};sapbi_page.getParameter=sapbi_page.getParameter||function(){return"";};var a=a||"";sapbi_page.staticMimeUrlPrefix=sap.ui.resource("sap.zen.dsh","rt/");if(!window.sap){window.sap={};}if(!sap.zen){sap.zen={};}sap.zen.doReplaceDots=true;
sap.zen.dsh.Dsh.prototype.init=function(){this.initial=true;this.rendered=false;this.parameters={};this.dshBaseUrl=U(sap.ui.resource("sap.zen.dsh","rt/")).absoluteTo(window.location.pathname).toString();this.dshBaseAppUrlBW="/sap/bw/Mime";};
sap.zen.dsh.Dsh.prototype.createPage=function(){this.doIt();};
sap.zen.dsh.Dsh.prototype.doInit=function(){if(this.getDshAppName()==="0ANALYSIS"||this.getDshAppName()==="0ANALYTIC_GRID"){this.setRepoPath(U(sap.ui.resource("sap.zen.dsh","applications/")).absoluteTo(window.location.pathname).toString());}if(this.getRepoPath()!==""){this.repositoryUrl=this.getRepoPath();}if(!this.initial){return;}this.initial=false;if(jQuery.sap.debug()==="true"){jQuery.sap.require("sap.zen.dsh.rt.zen_rt_firefly.js.jszip");jQuery.sap.require("sap.zen.dsh.rt.zen_rt_firefly.js.xlsx");}var t=this;if(!this.getDeferCreation()){setTimeout(function(){t.doIt();},0);}};
sap.zen.dsh.Dsh.prototype.doIt=function(){this.doInit();sap.zen.dsh.scriptLoaded=true;var t=this;{var l=t.getLanguage();if(!l){var c=sap.ui.getCore().getConfiguration();l=c.getLocale().getSAPLogonLanguage();if(!l){l=window.navigator.userLanguage||window.navigator.language;}}var b=t.getClient();if(!b&&document.cookie){var m=/(?:sap-usercontext=)*sap-client=(\d{3})/.exec(document.cookie);if(m&&m[1]){b=m[1];}}var d=t.getDeployment();if(!d||d.length===0){d="bw";}var e=t.getDshAppName();var f=this.getStartupParameters();if(f){for(var g in f){if(this.isDshParameter(g)){if(!this.doesParameterExist(g)){this.addParameter(g,f[g][0]);}}}}var u=sap.firefly.XHashMapOfStringByString.create();for(var k in this.parameters){u.put(k,this.parameters[k]);}var h=new sap.zen.DesignStudio();h.setHost(document.location.hostname);h.setPort(document.location.port);h.setProtocol(document.location.protocol.split(":")[0]);h.setClient(b);h.setLanguage(l);if(this.repositoryUrl){h.setRepositoryUrl(this.repositoryUrl);}h.setApplicationPath(this.dshBaseAppUrlBW);h.setApplicationName(e);h.setUrlParameter(u);h.setSdkLoaderPath("");h.setHanaMode(true);h.setDshControlId(t.getId());h.setStaticMimesRootPath(this.dshBaseUrl);h.setSystemAlias(this.getSystemAlias());if(d==="bw2"||d==="bw"){h.setNewBW(true);}h.setRightToLeft(sap.ui.getCore().getConfiguration().getRTL());this._page=h.createPage();if(this.rendered){this._page.handleAfterRenderingOfRootControl();}window[this._page.getPageIdForScripting()]=this._page;sapbi_page=sapbi_page||{};sapbi_page.staticMimeUrlPrefix=this.dshBaseUrl;sapbi_page.getParameter=function(){return"";};a="";if(this.getAppComponent()){sapbi_page.appComponent=this.getAppComponent();}var i=this._page.getApplicationPropertiesComponent().getCustomCSSName();if(i){var j=document.createElement('link');j.setAttribute("type","text/css");j.setAttribute("rel","stylesheet");j.setAttribute("href",U(this._page.getRelativePathToApp()+i).normalize().toString());document.getElementsByTagName("head")[0].appendChild(j);}}};
sap.zen.dsh.Dsh.prototype.onAfterRendering=function(){this.doInit();if(this._page){this._page.handleAfterRenderingOfRootControl();}this.rendered=true;};
sap.zen.dsh.Dsh.prototype.logoff=function(){if(this._page&&!this.loggedOff){this.loggedOff=true;window.buddhaHasSendLock++;this._page.exec("APPLICATION.logoff();");}};
sap.zen.dsh.Dsh.prototype.exit=function(){this.logoff();var r=sap.ui.getCore().byId(this.sId+"ROOT_absolutelayout");if(r){r.destroy();}var v=sap.ui.getCore().byId(this.sId+"VARIABLEDIALOG_MESSAGE_messageview1");if(v){v.destroy();}};
sap.zen.dsh.Dsh.prototype.addParameter=function(n,v){this.parameters[n]=v;};
sap.zen.dsh.Dsh.prototype.doesParameterExist=function(n){if(this.parameters[n]){return true;}return false;};
sap.zen.dsh.Dsh.prototype.getStartupParameters=function(){if(this.getAppComponent()){if(this.getAppComponent().getComponentData()){return this.getAppComponent().getComponentData().startupParameters;}}return null;};
sap.zen.dsh.Dsh.prototype.isDshParameter=function(n){if(n==="XTITLE"||n==="XQUERY"||n==="XDISPLAY"||n==="XCHART_TYPE"||n==="XPROMPT"||n==="XVISIBLEPROMPTS"||n==="XDATALIMIT_ROWS"||n==="XDATALIMIT_COLS"||n=="XEXCEL_VERSION"){return true;}return false;};
sap.zen.dsh.Dsh.prototype.executeScript=function(b){this.page.exec(b);};
sap.zen.dsh.Dsh.prototype.getDataSource=function(n){return this.page.getDataSource(n);};
sap.zen.dsh.Dsh.prototype.getComponent=function(n){return this.page.getComponent(n);};
sap.zen.dsh.Dsh.prototype.getPage=function(){return this.page;};
sap.zen.dsh.Dsh.prototype.getMapping=function(n){if(this.getSemanticMappings()&&this.getSemanticMappings()[n]){return this.getSemanticMappings()[n];}return n;};
sap.zen.dsh.Dsh.prototype.initializeAppStateData=function(S,n){function b(m,v,V){if(Array.isArray(m)){for(var h in m){if(!v.hasOwnProperty(m[h])){v[m[h]]=V;}}}else{if(!v.hasOwnProperty(m)){v[m]=V;}}}n=n||{};for(var i=0;i<Object.keys(n).length;++i){var l=Object.keys(n)[i];if(this.isDshParameter(l)){delete n[l];}}if(S&&S.customData&&S.customData.bookmarkedAppState){this.addParameter("NAV_INITIAL_STATE",S.customData.bookmarkedAppState);}if(S&&S.selectionVariant){var o=S.selectionVariant;if(typeof o!=="object"&&typeof S.oSelectionVariant==="object"&&S.oSelectionVariant.toJSONObject){o=S.oSelectionVariant.toJSONObject();}var p=o.Parameters;var c=o.SelectOptions;if(p){for(var d=0;d<p.length;d++){var P=p[d];if(this.isDshParameter(P.PropertyName)){continue;}n[P.PropertyName]=P.PropertyValue;}}if(c){for(var i=0;i<c.length;++i){var e=c[i];if(this.isDshParameter(e.PropertyName)){continue;}var r=e.Ranges;var f=[];for(var j=0;j<r.length;++j){var g;var R=r[j];if(["EQ","BT","GE","LE","GT","LT"].indexOf(R.Option)==-1){continue;}if(R.Sign==="I"&&R.Option==="EQ"){g=R.Low;}else{g={exclude:R.Sign==="E"||undefined,operation:R.Option,from:R.Low,to:R.High};}f.push(g);}if(f.length>0){b(this.getMapping(e.PropertyName),n,f);}}}}if(!jQuery.isEmptyObject(n)){this.addParameter("NAV_PARAMS",JSON.stringify(n));}};
sap.zen.dsh.Dsh.prototype.initializeAppState=function(S,n){if(S){var o={};if(S.getData&&typeof S.getData==="function"){o=S.getData();}this.initializeAppStateData(o,n);}};
return sap.zen.dsh.Dsh;});
}
},"sap/zen/dsh/library-preload"
);
//# sourceMappingURL=library-preload.js.map
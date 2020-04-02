/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/core/ComponentContainer","sap/ui/core/routing/HashChanger","sap/ui/core/routing/History","sap/ui/core/library","sap/suite/ui/generic/template/lib/ProcessObserver","sap/suite/ui/generic/template/lib/routingHelper","sap/suite/ui/generic/template/lib/TemplateComponent","sap/suite/ui/generic/template/lib/testableHelper","sap/ui/fl/ControlPersonalizationAPI","sap/base/Log","sap/base/util/merge","sap/base/util/extend","sap/base/util/isEmptyObject","sap/base/util/UriParameters"],function(B,C,H,a,c,P,r,T,t,b,L,m,d,f,U){"use strict";var g=c.routing.HistoryDirection;var h=a.getInstance();var o=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("CrossApplicationNavigation");function k(R){var e=R.substring(R.length-5,R.length);if(e==="query"){return R.substring(0,R.length-5);}return R;}function n(e){if(e.indexOf("/")===0){return e;}return"/"+e;}function A(e){var D="";var R="";var j=Object.keys(e).sort();j.forEach(function(v){var V=e[v];if(Array.isArray(V)){var w=V.sort();for(var i=0;i<w.length;i++){var x=w[i];R=R+D+v+"="+x;D="&";}}else{R=R+D+v+"="+V;D="&";}});return R;}function l(e,i){e=e||"";var D=(e.charAt(e.length-1)==="/")?"?":"/?";return e+(i?D+i:"");}function p(e,i){var j=A(i);return l(e,j);}function q(i,R,j){var v=i.mRoutingTree[R.name];var w=R.template;var E=R.entitySet;var V=v.level;var O=-1;if(i.oFlexibleColumnLayoutHandler){O=V<3?V:0;}var x=O<0?i.oNavigationObserver:i.aNavigationObservers[O];var y=new P();var z=O<0?i.oHeaderLoadingObserver:i.aHeaderLoadingObservers[O];z.addObserver(y);var D={};var S={appComponent:i.oAppComponent,isLeaf:!R.pages||!R.pages.length,entitySet:E,navigationProperty:R.navigationProperty,componentData:{registryEntry:{oAppComponent:i.oAppComponent,componentCreateResolve:j,route:R.name,routeConfig:R,viewLevel:v.level,routingSpec:R.routingSpec,oNavigationObserver:x,oHeaderLoadingObserver:y,preprocessorsData:D}}};if(R.component.settings){d(S,R.component.settings);}var F;i.oAppComponent.runAsOwner(function(){try{var G=sap.ui.core.Component.create({name:w,settings:S,handleValidation:true,manifest:true});var I;F=new C({propagateModel:true,width:"100%",height:"100%",settings:S});I=G.then(function(J){F.setComponent(J);var v=i.mRoutingTree[R.name];v.componentId=J.getId();return F;});F.loaded=function(){return I;};}catch(e){throw new Error("Component "+w+" could not be loaded");}});return F;}function s(e,v){t.testable(q,"fnCreateComponentInstance");var w=!o||o.isInitialNavigation();var M={};var x={iHashChangeCount:0,backTarget:0,aCurrentKeys:[],componentsDisplayed:Object.create(null)};var y=[];var z=Promise.resolve();function G(){var i=v.oRouter,j=i.getTargets()._mTargets,e2=[];Object.keys(j).forEach(function(f2){var g2=j[f2],h2=g2._oOptions,i2=i.getRoute(h2.viewName),j2=i2&&i2._oConfig;if(j2&&(!j2.navigation||!j2.navigation.display)){e2.push({oConfig:j2});}});return e2;}t.testable(G,"fnGetAllPages");function D(i){var j=i||G();if(!Array.isArray(j)){j=[j];}j.forEach(function(e2){e2.oComponentContainer=q(e,e2.oConfig,function(){});});return j;}t.testable(D,"fnCreatePages");function E(){var i=v.oRouter.getViews();i.getView({viewName:"root"});return e.mRouteToTemplateComponentPromise.root;}function F(){return v.oAppComponent.getManifestEntry("sap.app").title;}function I(i,j,e2){var f2=i&&e.componentRegistry[i];var g2=f2&&f2.methods.getUrlParameterInfo;return g2?f2.viewRegistered.then(function(){var h2=j&&n(j);return g2(h2,x.componentsDisplayed[f2.route]===1).then(function(i2){d(e2,i2);});}):Promise.resolve();}function J(i,j,e2){var f2=e.mRoutingTree[i];return I(f2.componentId,e2,j);}function S(i,j){var e2;if(!i&&j instanceof T){var f2=j&&e.componentRegistry[j.getId()];var g2=f2&&f2.methods.getTitle;e2=g2&&g2();}else if(!i&&j&&j.title){e2=j.title;}e2=e2||F();e.oShellServicePromise.then(function(h2){h2.setTitle(e2);}).catch(function(){L.warning("No ShellService available");});}function K(i){var j=[e.oPagesDataLoadedObserver.getProcessFinished(true)];var e2=null;var f2=x.iHashChangeCount;delete W.componentsDisplayed;var g2=-1;for(var h2 in e.componentRegistry){var i2=e.componentRegistry[h2];var j2=i2.oControllerUtils&&i2.oControllerUtils.oServices.oTemplateCapabilities.oMessageButtonHelper;var k2=x.componentsDisplayed[i2.route]===1;var l2=i2.utils.getTemplatePrivateModel();l2.setProperty("/generic/isActive",k2);if(k2){j.push(i2.oViewRenderedPromise);if(i2.viewLevel>g2){g2=i2.viewLevel;e2=i2.oComponent;}}else{i2.utils.suspendBinding();}if(j2){j2.setEnabled(k2);}}var m2=e.oFlexibleColumnLayoutHandler&&e.oFlexibleColumnLayoutHandler.isAppTitlePrefered();S(m2,i||e2);Promise.all(j).then(function(){if(f2===x.iHashChangeCount&&f(M)){e.oAppComponent.firePageDataLoaded();}});}var O=K.bind(null,null);function Q(i,j){var e2=[];for(var f2=i;f2.level>=j;f2=e.mRoutingTree[f2.parentRoute]){e2.push(f2);}return e2.reverse();}function R(j,e2,f2){if(j.level===0){return null;}var g2=f2?j.pattern:j.contextPath;if(!g2){return null;}if(g2.indexOf("/")!==0){g2="/"+g2;}for(var i=1;i<=j.level;i++){g2=g2.replace("{keys"+i+"}",e2[i]);}return g2;}var V;var W;var X;t.testable(function(i){W=i;y.push(x);x={backTarget:0,componentsDisplayed:Object.create(null)};},"setCurrentIdentity");function Y(){return W;}function Z(j,e2){if(Array.isArray(j)&&j.length<2){j=j[0];}if(Array.isArray(e2)&&e2.length<2){e2=e2[0];}if(Array.isArray(j)){if(Array.isArray(e2)){if(j.length===e2.length){j=j.sort();e2=e2.sort();return j.every(function(f2,i){return f2===e2[i];});}return false;}return false;}return e2===j;}function $(i){if(!W||W.treeNode!==i.treeNode){return false;}for(var j=i.treeNode;j.level>0;j=e.mRoutingTree[j.parentRoute]){if(!j.noKey&&i.keys[j.level]!==W.keys[j.level]){return false;}}if(f(i.appStates)!==f(W.appStates)){return false;}if(f(i.appStates)){return true;}var e2=d(Object.create(null),i.appStates,W.appStates);for(var f2 in e2){if(!Z(i.appStates[f2],W.appStates[f2])){return false;}}return true;}function _(i,j,e2){var f2=Object.create(null);for(var g2=i;g2.level>0;g2=e.mRoutingTree[g2.parentRoute]){if(!g2.noKey){f2["keys"+g2.level]=j[g2.level];}}var h2=!f(e2);var i2=i.sRouteName+(h2?"query":"");if(h2){f2["query"]=e2;}return{route:i2,parameters:f2};}function a1(i){var j=_(V.identity.treeNode,V.identity.keys,V.identity.appStates);v.oRouter.navTo(j.route,j.parameters,i);}function b1(i){if(!i||!V.identity){return;}var j=function(f2,g2,h2){h2=g2?g2.getId():h2;var i2=e.componentRegistry[h2];(i2.methods.presetDisplayMode||Function.prototype)(i,f2);};for(var e2=V.identity.treeNode;e2;e2=e2.parentRoute&&e.mRoutingTree[e2.parentRoute]){if(e2.componentId){j(x.componentsDisplayed[e2.sRouteName]===1,null,e2.componentId);}else{e.mRouteToTemplateComponentPromise[e2.sRouteName].then(j.bind(null,false));}if(e2.fCLLevel===0||e2.fCLLevel===3){break;}}}function c1(i){var j;if(i){if(V||(W&&W.preset)){V={identity:i.identity,followUpNeeded:true};b1(i.displayMode);return;}if(i.identity&&$(i.identity)){return;}j=i.mode;V=i;b1(i.displayMode);delete V.displayMode;}else{j=1;}V.followUpNeeded=j<0;e.oBusyHelper.setBusyReason("HashChange",true);V.displayMode=0;if(j<0){window.history.go(j);}else{a1(j===1);}}function d1(i,j){i.text=((i.headerTitle!==j)&&j)||"";if(X&&X.linkInfos.length>i.level){X.adjustNavigationHierarchy();}}function e1(i,j){var e2=Object.create(null);var f2=R(i,W.keys);if(e.oFlexibleColumnLayoutHandler){e.oFlexibleColumnLayoutHandler.adaptBreadCrumbUrlParameters(e2,i);}var g2={treeNode:i};var h2=I(i.componentId,f2,e2).then(function(){var i2=_(i,W.keys,e2);g2.fullLink=v.oRouter.getURL(i2.route,i2.parameters);});j.push(h2);g2.navigate=function(i2){e.oBusyHelper.setBusy(h2.then(function(){var j2={treeNode:i,keys:W.keys.slice(0,i.level+1),appStates:e2};p1(j2,false,i2);}));};g2.adaptBreadCrumbLink=function(i2){h2.then(function(){var n2=v.oHashChanger.hrefForAppSpecificHash?v.oHashChanger.hrefForAppSpecificHash(g2.fullLink):"#/"+g2.fullLink;i2.setHref(n2);});var j2=function(){d1(i,i2.getText());};if(!g2.bLinkAttached){g2.bLinkAttached=true;var k2=i2.getBindingInfo("text")||{};k2.events={change:j2};}var l2=i2.getElementBinding();var m2=l2&&l2.getPath();if(m2===f2){j2();}else{i2.bindElement({path:f2,canonicalRequest:!e.bCreateRequestsCanonical});}};return g2;}function f1(i,j){var e2={title:j.treeNode.headerTitle||"",icon:j.treeNode.titleIconUrl||"",subtitle:j.treeNode.text,intent:i+j.fullLink};return e2;}function g1(){var j=[];var e2=[];var f2=e.oFlexibleColumnLayoutHandler&&e.oFlexibleColumnLayoutHandler.hasNavigationMenuSelfLink(W);for(var g2=f2?W.treeNode:e.mRoutingTree[W.treeNode.parentRoute];g2;g2=e.mRoutingTree[g2.parentRoute]){var h2=e1(g2,e2);j[g2.level]=h2;}var i2=Promise.all(e2);var j2=location.hash;var k2=j2.indexOf("?");var l2=(k2!==-1&&k2<j2.indexOf("&"))?"?":"&";var m2=j2.split(l2)[0]+"&/";var n2=function(){e.oShellServicePromise.then(function(o2){o2.setHierarchy([]);i2.then(function(){var p2=[];for(var i=j.length-1;i>=0;i--){p2.push(f1(m2,j[i]));}o2.setHierarchy(p2);});}).catch(function(){L.warning("No ShellService available");});};X={linkInfos:j,adjustNavigationHierarchy:n2};n2();}function h1(){return X.linkInfos;}function i1(i){var j=W;if(V&&V.identity&&!V.followUpNeeded){W=V.identity;}else{W=Object.create(null);var e2=i.getParameter("config");var f2=k(e2.name);W.treeNode=e.mRoutingTree[f2];var g2=i.getParameter("arguments");W.appStates=g2["?query"]||Object.create(null);W.keys=[""];for(var h2=W.treeNode;h2.level>0;h2=e.mRoutingTree[h2.parentRoute]){W.keys[h2.level]=h2.noKey?"":g2["keys"+h2.level];}}W.previousIdentity=j;W.componentsDisplayed=Object.create(null);W.componentsDisplayed[W.treeNode.sRouteName]=1;g1();}function j1(i,j){var e2={identity:{treeNode:W.treeNode,keys:W.keys,appStates:d(Object.create(null),W.appStates)},mode:1};if(Array.isArray(j)&&j.length<2){j=j[0];}if(j){e2.identity.appStates[i]=j;}else{delete e2.identity.appStates[i];}c1(e2);}var k1;function l1(i,j,e2,f2){if(!i){E1(j);return;}var g2=q1(null,i,true,true);e.oBusyHelper.setBusy(g2.then(function(h2){h2.appStates=Object.create(null);var i2;if(h2.treeNode.fCLLevel===0||h2.treeNode.fCLLevel===3){var j2=R(h2.treeNode,h2.keys);i2=I(h2.treeNode.componentId,j2,h2.appStates);}else{i2=e.oFlexibleColumnLayoutHandler.getAppStatesPromiseForNavigation(W,h2);}if(!j&&f2&&f2.bIsCreate&&f2.bIsDraft&&!f2.bIsDraftModified){k1={index:y.length,path:i.getPath(),identity:h2,displayMode:u1()};}return i2.then(function(){p1(h2,j,e2);});}));}function m1(j){if(!k1||k1.path!==j.getPath()){return null;}var e2;var f2=function(l2,i){return l2!==e2.identity.keys[i];};for(var i=k1.index+1;i<y.length;i++){e2=y[i];if(e2.identity.treeNode.level<k1.identity.treeNode.level||k1.identity.keys.some(f2)){return null;}}var g2=0;for(var h2=x;h2.iHashChangeCount!==k1.index;h2=y[h2.backTarget]){if(h2.iHashChangeCount<k1.index){return null;}g2--;}var i2=y[k1.index].identity;var j2={treeNode:i2.treeNode,keys:i2.keys,appStates:Object.create(null)};var k2=c1.bind(null,{identity:j2,mode:g2,displayMode:k1.displayMode});if(i2.treeNode.fCLLevel===0||i2.treeNode.fCLLevel===3){d(j2.appStates,i2.appStates);return Promise.resolve(k2);}return e.oFlexibleColumnLayoutHandler.getSpecialDraftCancelPromise(W,i2,j2.appStates).then(function(){return k2;});}function n1(i,e2){var f2=r.determineNavigationPath(i);var g2={keys:["",f2.key],appStates:Object.create(null)};var h2=p1.bind(null,g2,true,e2);if(W.treeNode.level===1){g2.treeNode=W.treeNode;d(g2.appStates,W.appStates);return Promise.resolve(h2);}var i2=Q(W.treeNode,2);var j2=i2.map(function(j){if(j.noKey){return Promise.resolve(true);}if(!j.isDraft){return Promise.resolve(W.keys[j.level]);}var l2=R(j,W.keys);var m2=e.oApplicationProxy.getSiblingPromise(l2);return m2.then(function(i){f2=r.determineNavigationPath(i,j.navigationProperty);return f2.key;},Function.prototype);});var k2=Promise.all(j2);return k2.then(function(l2){var m2=e.mEntityTree[f2.entitySet];for(var j=0;l2[j];j++){m2=i2[j];g2.keys.push(m2.noKey?"":l2[j]);}g2.treeNode=m2;if(m2===W.treeNode){d(g2.appStates,W.appStates);return h2;}var n2=e.oFlexibleColumnLayoutHandler.getAppStatesPromiseForColumnClose(m2,g2.appStates);return n2.then(function(){return h2;});});}function o1(i,j){if((i&&i.treeNode)!==j.treeNode){return Promise.resolve(false);}if(e.oFlexibleColumnLayoutHandler&&!e.oFlexibleColumnLayoutHandler.areIdentitiesLayoutEquivalent(i,j)){return Promise.resolve(false);}var e2=true;var f2=i.treeNode.sRouteName;for(var g2=i.treeNode;g2.level>0;g2=e.mRoutingTree[g2.parentRoute]){var h2=g2.noKey||i.keys[g2.level]===j.keys[g2.level];if(!h2&&g2.noOData){return Promise.resolve(false);}e2=e2&&h2;if(g2.noOData){f2=g2.parentRoute;}}if(e2){return Promise.resolve(true);}var i2=e.mRoutingTree[f2];var j2=i.keys.slice(0,i2.level+1);var k2=j.keys.slice(0,i2.level+1);var l2=R(i2,j2);var m2=R(i2,k2);return e.oApplicationProxy.areTwoKnownPathesIdentical(l2,m2,i2.level===1);}function p1(i,j,e2){var f2=y[x.backTarget];var g2=-1;if(i.treeNode.level===0||(e.oFlexibleColumnLayoutHandler&&i.treeNode.fCLLevel===0)){for(;f2.backTarget>0&&f2.identity.treeNode.level>i.treeNode.level;g2--){f2=y[f2.backTarget];}}var h2=o1(f2&&f2.identity,i);var i2=h2.then(function(j2){var k2=j2?g2:(0+!!j);var l2={identity:i,mode:k2,displayMode:e2};c1(l2);});e.oBusyHelper.setBusy(i2);return i2;}function q1(i,j,e2,f2){if(!j){return f2?Promise.resolve({treeNode:e.mRoutingTree["root"],keys:[""]}):Promise.reject();}i=i||W.treeNode;var g2=r.determineNavigationPath(j);var h2=(i.level&&i.entitySet===g2.entitySet)?i:i.children.indexOf(g2.entitySet)>=0&&e.mEntityTree[g2.entitySet];if(h2){var i2=W.keys.slice(0,h2.level);i2.push(g2.key);return Promise.resolve({treeNode:h2,keys:i2});}if(e2){var j2=e.oAppComponent.getModel();var k2=j2.getMetaModel();var l2=k2.getODataEntitySet(g2.entitySet);var m2=k2.getODataEntityType(l2.entityType);var n2;var o2=i.children.some(function(q2){var r2=e.mEntityTree[q2];n2=r2.navigationProperty;if(!n2){return false;}var s2=k2.getODataAssociationEnd(m2,n2);return!!s2&&s2.multiplicity.endsWith("1");});if(o2){return new Promise(function(q2,r2){j2.createBindingContext(n2,j,null,function(s2){var t2=s2&&q1(i,s2,false);if(t2){t2.then(q2,r2);}else{r2();}});});}}if(f2&&i.level>0){var p2=e.mRoutingTree[i.parentRoute];return q1(p2,j,e2,true);}return Promise.reject();}function r1(i,j,e2){if(i.fCLLevel===0||i.fCLLevel===3){var f2=e2&&R(i,e2);return I(i.componentId,f2,j);}return e.oFlexibleColumnLayoutHandler[(i.level>W.treeNode.level)?"getAppStatesPromiseForColumnOpen":"getAppStatesPromiseForColumnClose"](i,j,e2);}function s1(i){var j=q1(e.mRoutingTree["root"],i,false,true);e.oBusyHelper.setBusy(j.then(function(e2){e2.appStates=Object.create(null);var f2;if(e2.treeNode===W.treeNode){Object.assign(e2.appStates,W.appStates);f2={identity:e2,mode:1,displayMode:1};c1(f2);return null;}var g2=r1(e2.treeNode,e2.appStates);return g2.then(p1.bind(null,e2,true,1));}));}function t1(i){var j;var e2=0;for(j=x;j.backTarget>0&&(!j.identity||j.identity.treeNode.level>i);e2++){j=y[j.backTarget];}if(!w&&(e2===0||j.identity.treeNode.level>i)){window.history.go(-e2-1);return;}var f2=-e2||1;var g2=V1(i);var h2={treeNode:g2,keys:W.keys.slice(0,g2.level+1),appStates:Object.create(null)};var i2=r1(h2.treeNode,h2.appStates).then(function(){if(f2<0&&(h2.treeNode.fCLLevel===1||h2.treeNode.fCLLevel===2)&&j.identity.treeNode===h2.treeNode){for(;j.backTarget>0&&!e.oFlexibleColumnLayoutHandler.areIdentitiesLayoutEquivalent(j.identity,h2);f2--){j=y[j.backTarget];if(j.identity.treeNode!==h2.treeNode){break;}}}var j2={identity:h2,mode:f2,displayMode:h2.treeNode.isDraft?6:1};c1(j2);});e.oBusyHelper.setBusy(i2);}function u1(){var i=e.componentRegistry[W.treeNode.componentId];var j=i.utils.getTemplatePrivateModel();var e2=j.getProperty("/objectPage/displayMode")||0;return e2;}function v1(i,j,e2,f2,g2){var h2=W.keys.slice(0,i.level);h2.push(j?e2:"");var i2=Object.create(null);var j2=r1(i,i2,h2);e.oBusyHelper.setBusy(j2.then(function(){var k2={treeNode:i,keys:h2,appStates:i2};p1(k2,f2,g2);}));}function w1(e2,f2,g2,h2,i2){var j2;var k2=true;for(var i=0;i<e2.children.length&&!j2;i++){var l2=e2.children[i];var m2=e.mEntityTree[l2];if(m2[e2.level?"navigationProperty":"sRouteName"]===f2){j2=m2.sRouteName;k2=!m2.noKey;}}var n2=!j2&&g2&&e2.embeddedComponents[g2];if(n2){for(var j=0;j<n2.pages.length&&!j2;j++){var o2=n2.pages[j];if(o2.navigationProperty===f2){j2=e2.sRouteName+"/"+g2+"/"+f2;k2=!(o2.routingSpec&&o2.routingSpec.noKey);}}}if(j2){var p2=e.mRoutingTree[j2];v1(p2,k2,h2,i2,u1());}}function x1(i,j,e2,f2){var g2=q1(i,j,true,false);e.oBusyHelper.setBusy(g2.then(function(h2){var i2=f2?f2>0:!!e.oFlexibleColumnLayoutHandler&&!e.oFlexibleColumnLayoutHandler.isNewHistoryEntryRequired(i);h2.appStates=Object.create(null);var j2=r1(h2.treeNode,h2.appStates,h2.keys);return j2.then(p1.bind(null,h2,i2,e2));}));}function y1(){return!!V;}function z1(i){L.info("Navigate back");if(x.backTarget&&n(h.getPreviousHash()||"")!==n(x.hash)){e.oBusyHelper.setBusyReason("HashChange",true);}x.LeaveByBack=!x.forwardingInfo;if(x.LeaveByBack){x.backSteps=i;}window.history.go(-i);}function A1(j,e2,f2,g2){var h2=e.oAppComponent.getObjectPageHeaderType()==="Dynamic"&&e.oAppComponent.getObjectPageVariantManagement()==="VendorLayer";var i2;var j2=new U(window.location.href);if(j2.mParams["sap-ui-layer"]){var k2=j2.mParams["sap-ui-layer"];for(var i=0;i<k2.length;i++){if(k2[i].toUpperCase()==="VENDOR"){i2=true;break;}}}j=n(j||"");L.info("Navigate to hash: "+j);if(j===x.hash){L.info("Navigation suppressed since hash is the current hash");return;}x.targetHash=j;if(x.backTarget&&n(h.getPreviousHash()||"")===j){z1(1);return;}if(x.oEvent){var l2=x.oEvent.getParameter("config").viewLevel;}if(h2&&i2){if(!g2){if(!e.oFlexibleColumnLayoutHandler){b.clearVariantParameterInURL();}else{if(l2>=f2){if(f2===1){b.clearVariantParameterInURL();}else if(f2===2){var m2;for(var n2 in e.componentRegistry){if(e.componentRegistry[n2].viewLevel===2){m2=e.componentRegistry[n2];break;}}var o2=m2.oController.byId("template::ObjectPage::ObjectPageVariant");b.clearVariantParameterInURL(o2);}}}}}e.oBusyHelper.setBusyReason("HashChange",true);x.LeaveByReplace=e2;if(e2){v.oHashChanger.replaceHash(j);}else{v.oHashChanger.setHash(j);}}function B1(i,j,e2,f2,g2,h2){var i2=j.then(function(j2){i=l(i,j2);if(g2){x.backwardingInfo={count:g2.count,index:g2.index,targetHash:n(i)};z1(g2.count);}else{A1(i,f2,e2,h2);}return i;});e.oBusyHelper.setBusy(i2);return i2;}function C1(i,j){var e2,f2,g2,h2,i2,j2;e2=0;f2=x.iHashChangeCount;g2=null;for(h2=x;h2.oEvent;e2++){i2=h2.oEvent.getParameter("config");j2=i2?i2.viewLevel:-1;if(j2===0||(i&&n(h2.hash).indexOf(j)!==0)){g2={count:e2,index:f2,routeName:i2?i2.name:undefined};break;}if(h2.backTarget===0){if(i){g2={count:e2+1,index:f2,routeName:undefined};}break;}f2=h2.backTarget;h2=y[f2];}return g2;}function D1(i,j,e2){if(e2===0){return C1();}var f2=y[x.backTarget];return f2&&f2.hash&&n(f2.hash.split("?")[0])===n(j)&&{count:1,index:x.backTarget};}function E1(i){if(W.treeNode.level===0){return;}var j={treeNode:e.mRoutingTree["root"],keys:[""],appStates:Object.create(null)};var e2=e.oFlexibleColumnLayoutHandler?e.oFlexibleColumnLayoutHandler.getAppStatesPromiseForColumnClose(j.treeNode,j.appStates):J("root",j.appStates);e2.then(p1.bind(null,j,i));e.oBusyHelper.setBusy(e2);}function F1(i){var j=e.mEntityTree[i.entitySet].sRouteName;var e2=e.mRouteToTemplateComponentPromise[j];return[e2];}function G1(j,e2){var f2=x.componentsDisplayed;var g2=function(i2){var j2=e.componentRegistry[i2.getId()];(j2.methods.presetDisplayMode||Function.prototype)(e2,f2[j2.route]===1);};for(var i=0;i<j.length;i++){var h2=j[i];h2.then(g2);}}function H1(i){var j=i&&e.mEntityTree[i.entitySet];var e2=j?j.level:1;return e2;}function I1(j,e2){var f2=e.oApplicationProxy.getHierarchySectionsFromCurrentHash();var g2=j;for(var i=e2-2;i>=0;i--){g2=f2[i]+"/"+g2;}return"/"+g2;}function J1(i,j,e2,f2,g2){var h2={};var i2=e.oFlexibleColumnLayoutHandler&&e.oFlexibleColumnLayoutHandler.getFCLAppStatesPromise(i,h2);var j2=J(i,h2,j);var k2=(i2?Promise.all([i2,j2]):j2).then(A.bind(null,h2));var l2=D1(f2,j,e2);var m2=B1(j,k2,e2,f2,l2,g2);e.oBusyHelper.setBusy(m2);return m2;}function K1(j,e2,f2,g2,h2,i2){var j2;var k2,l2,m2;var n2=[];if(typeof j==="string"){j2=j;var o2=n(j2);if(o2==="/"){k2=0;}else{m2=o2.split("/");k2=m2.length-1;}switch(k2){case 0:l2="root";break;case 1:l2=m2[1].split("(")[0];break;default:l2="";var p2="";for(var i=0;i<k2;i++){var q2=m2[i+1];var r2=q2.indexOf("(");if(r2>0){q2=q2.substring(0,r2);}l2=l2+p2+q2;p2="/";}l2=l2.replace("---","/");}}else{var s2=r.determineNavigationPath(j,e2);k2=H1(s2);j2=s2.path;n2=F1(s2);l2=e.mEntityTree[s2.entitySet].sRouteName;}if(e2){j2=I1(j2,k2);}G1(n2,g2||0);if(h2){j2=p(j2,h2);A1(j2,f2,k2,i2);return Promise.resolve(j2);}else{return J1(l2,j2,k2,f2,i2);}}function L1(i,j,e2,f2,g2){return K1(i,j,e2,f2,undefined,g2);}function M1(i,j){x.componentsDisplayed[i]=j;var e2=e.mRoutingTree[i];var f2=e2.componentId;if(f2){var g2=e.componentRegistry[f2];var h2=g2.utils.getTemplatePrivateModel();h2.setProperty("/generic/isActive",j===1);}}function N1(i){var j,e2,f2,g2,h2,i2=null,j2,k2;if(i){j=i.entitySet;e2=i.text;i2=i.icon;k2=i.description;}if(j){j2=e.oAppComponent.getModel().getMetaModel();if(j2){f2=j2.getODataEntitySet(j);g2=j2.getODataEntityType(f2.entityType);h2=g2["com.sap.vocabularies.UI.v1.HeaderInfo"];}if(h2&&h2.TypeImageUrl&&h2.TypeImageUrl.String){i2=h2.TypeImageUrl.String;}}e.oTemplatePrivateGlobalModel.setProperty("/generic/messagePage",{text:e2,icon:i2,description:k2});if(e.oFlexibleColumnLayoutHandler){e.oFlexibleColumnLayoutHandler.displayMessagePage(i,x.componentsDisplayed);}else{var l2=v.oRouter.getTargets();l2.display("messagePage");for(var m2 in x.componentsDisplayed){M1(m2,5);}}K(i);}function O1(){if(!f(M)){var j=null;for(var i=0;!j;i++){j=M[i];}M={};N1(j);}}function P1(i){if(v.oTemplateContract.oFlexibleColumnLayoutHandler){i.viewLevel=i.viewLevel||0;M[i.viewLevel]=i;var j=Promise.all([z,v.oTemplateContract.oPagesDataLoadedObserver.getProcessFinished(true)]);j.then(O1);j.then(e.oBusyHelper.setBusyReason.bind(null,"HashChange",false));return;}N1(i);e.oBusyHelper.setBusyReason("HashChange",false);}function Q1(){var i=[];var j=W.componentsDisplayed||x.componentsDisplayed;for(var e2 in e.componentRegistry){var f2=e.componentRegistry[e2];if(j[f2.route]===1){i.push(e2);}}return i;}function R1(){var i=[];for(var j in e.componentRegistry){i.push(j);}return i;}function S1(i){return W.keys.slice(0,i+1);}function T1(j){var e2="";var f2=x.hash;var g2=f2.split("/");var h2="";for(var i=0;i<=j;i++){e2=e2+h2+g2[i];h2="/";}return e2;}function U1(){return x;}function V1(i){var j=W.treeNode;for(;j.level>i;){j=e.mRoutingTree[j.parentRoute];}return j;}function W1(i,j,e2){var f2=e2.getId();var g2=e.componentRegistry[f2];var h2=g2.route;var i2=j.componentsDisplayed[h2];var j2=i2===1;x.componentsDisplayed[h2]=1;var k2=e2.onActivate(i,j2)||Promise.resolve();return Promise.all([k2,g2.viewRegistered]).then(function(){g2.aKeys=S1(g2.viewLevel);});}function X1(i,j,e2){return W1(i,j,e2).then(O);}function Y1(i,j,e2){var f2={};if(j||e2){var g2=i.level;for(var h2=0;h2<g2;h2++){f2[h2]=e.oPaginatorInfo[h2];}}e.oPaginatorInfo=f2;}function Z1(i){return e.oApplicationProxy.getAlternativeContextPromise(i);}function $1(i){i1(i);W.preset=true;if(e.oFlexibleColumnLayoutHandler){e.oFlexibleColumnLayoutHandler.handleBeforeRouteMatched(W);}}function _1(j){if(V&&V.followUpNeeded&&V.identity&&!$(V.identity)){c1();return;}e.oBusyHelper.setBusyReason("HashChange",false);var e2=W.treeNode.level;var f2=n(v.oHashChanger.getHash()||"");L.info("Route matched with hash "+f2);var g2;if(x.backwardingInfo){g2=x;g2.identity=W.previousIdentity;delete W.previousIdentity;y.push(g2);var h2=g2.iHashChangeCount+1;x={iHashChangeCount:h2,forwardingInfo:{bIsProgrammatic:true,bIsBack:true,iHashChangeCount:h2,targetHash:g2.backwardingInfo.targetHash,componentsDisplayed:g2.componentsDisplayed},backTarget:y[g2.backwardingInfo.index].backTarget,componentsDisplayed:Object.create(null)};}if(x.forwardingInfo&&x.forwardingInfo.targetHash&&x.forwardingInfo.targetHash!==f2){x.hash=f2;var i2=x.forwardingInfo.targetHash;delete x.forwardingInfo.targetHash;A1(i2,true);return;}var j2=false;for(var i=0;i<e.aStateChangers.length;i++){var k2=e.aStateChangers[i];if(k2.isStateChange(W.appStates)){j2=true;}}if(j2){V=null;x.hash=f2;return;}e.oTemplatePrivateGlobalModel.setProperty("/generic/routeLevel",e2);var l2=x.forwardingInfo;delete x.forwardingInfo;if(!l2){l2={componentsDisplayed:x.componentsDisplayed};var m2=x.iHashChangeCount;l2.iHashChangeCount=m2+1;var n2=h.getDirection();if(V){l2.bIsProgrammatic=!!V.identity;l2.bIsBack=V.mode<0;if(l2.bIsBack){x.backSteps=0-V.mode;}l2.bIsForward=!l2.bIsBack&&(n2===g.Forwards);x.LeaveByReplace=V.mode===1;}else{l2.bIsProgrammatic=(f2===x.targetHash);l2.bIsBack=!!(x.LeaveByBack||(!l2.bIsProgrammatic&&(n2===g.Backwards)));l2.bIsForward=!l2.bIsBack&&(n2===g.Forwards);x.LeaveByReplace=l2.bIsProgrammatic&&x.LeaveByReplace;}x.LeaveByBack=l2.bIsBack;g2=x;g2.identity=W.previousIdentity;delete W.previousIdentity;y.push(g2);x={iHashChangeCount:l2.iHashChangeCount,componentsDisplayed:Object.create(null)};if(g2.LeaveByReplace){x.backTarget=g2.backTarget;}else if(l2.bIsBack){var o2=g2.backTarget;for(var p2=g2.backSteps||1;p2>0;p2--){o2=y[o2].backTarget;}x.backTarget=o2;}else{x.backTarget=m2;}}V=null;x.oEvent=j;x.hash=f2;var q2=function(s2){var t2=j.getParameter("arguments");if(s2){var u2=t2["?query"];x.forwardingInfo=l2;K1(s2.context,null,true,s2.iDisplayMode,u2||{});return;}Y1(W.treeNode,l2.bIsProgrammatic,l2.bIsBack);if(e.oFlexibleColumnLayoutHandler){z=e.oFlexibleColumnLayoutHandler.handleRouteMatched(l2);}else{if(e2===0||l2.bIsBack||!l2.bIsProgrammatic){e.oApplicationProxy.setEditableNDC(false);}var v2=e.mRouteToTemplateComponentPromise[W.treeNode.sRouteName];z=v2.then(function(w2){return X1(R(W.treeNode,W.keys),l2,w2);});}e.oBusyHelper.setBusy(z);};if(l2.bIsBack){var r2=R(V1(1),W.keys);e.oBusyHelper.setBusy(Z1(r2).then(q2));}else{q2();}}function a2(i){if(W&&W.preset){delete W.preset;}else{i1(i);}i=m({},i);var j=e.oStatePreserversAvailablePromise.then(_1.bind(null,i),e.oBusyHelper.setBusyReason.bind(null,"HashChange",false));e.oBusyHelper.setBusy(j);c2();}function b2(){W={appStates:Object.create(null),keys:[]};P1({title:e.getText("ST_ERROR"),text:e.getText("ST_GENERIC_UNKNOWN_NAVIGATION_TARGET"),description:""});}function c2(){var i,j,e2,f2,g2,h2,i2;var j2=W.treeNode;var k2=j2.parentRoute;while(k2){i=e.mRoutingTree;j=i[k2];e2=j.componentId;f2=e.componentRegistry[e2];if(!f2){return;}h2=f2.utils.getTemplatePrivateModel();i2="/"+j2.entitySet+"({keys"+j2.level+"})";g2=d2(j2,i2,W.keys);h2.setProperty("/generic/currentActiveChildContext",g2);j2=j;k2=j2.parentRoute;}}function d2(j,e2,f2){if(j.level===0){return null;}if(e2.indexOf("/")!==0){e2="/"+e2;}for(var i=1;i<=j.level;i++){e2=e2.replace("{keys"+i+"}",f2[i]);}return e2;}if(e.sRoutingType==="f"){v.oRouter.attachBeforeRouteMatched($1);}v.oRouter.attachRouteMatched(a2);v.oRouter.attachBypassed(b2);v.concatPathAndAppStates=p;v.navigate=A1;v.navigateBack=z1.bind(null,1);v.activateOneComponent=W1;v.afterActivation=O;v.addUrlParameterInfoForRoute=J;v.getApplicableStateForComponentAddedPromise=I;v.setVisibilityOfRoute=M1;v.getActiveComponents=Q1;v.getAllComponents=R1;v.getRootComponentPromise=E;v.getActivationInfo=U1;v.getCurrentKeys=S1;v.getCurrentHash=T1;v.getAppTitle=F;v.navigateByExchangingQueryParam=j1;v.navigateToSubContext=l1;v.getSwitchToSiblingPromise=n1;v.getSpecialDraftCancelPromise=m1;v.getCurrentIdentity=Y;v.navigateToIdentity=p1;v.navigateAfterActivation=s1;v.navigateUpAfterDeletion=t1;v.navigateToChild=w1;v.navigateFromNodeAccordingToContext=x1;v.isNavigating=y1;v.getLinksToUpperLayers=h1;v.setTextForTreeNode=d1;v.determinePathForKeys=R;v.createComponentInstance=q;return{navigateToRoot:E1,navigateToContext:L1,navigateToMessagePage:P1,navigateBack:z1.bind(null,1)};}function u(e,i){var j={oAppComponent:i.oAppComponent,oRouter:i.oAppComponent.getRouter(),oTemplateContract:i,oHashChanger:H.getInstance(),mRouteToComponentResolve:{}};i.oNavigationControllerProxy=j;var F=new Promise(function(R){j.fnInitializationResolve=R;});i.oBusyHelper.setBusy(F);d(e,s(i,j));d(j,e);j.oRouter._oViews._getViewWithGlobalId=function(v){v.viewName=v.name||v.viewName;for(var w in i.componentRegistry){if(i.componentRegistry[w].route===v.viewName){return i.componentRegistry[w].oComponent.getComponentContainer();}}var R=j.oRouter.getRoute(v.viewName);var x;if(R&&R._oConfig){x=q(i,R._oConfig,j.mRouteToComponentResolve[v.viewName]);}else{x=sap.ui.view({viewName:v.viewName,type:v.type,height:"100%"});}if(v.viewName==="root"){i.rootContainer=x;}return x.loaded();};r.startupRouter(j);}var N=B.extend("sap.suite.ui.generic.template.lib.NavigationController",{metadata:{library:"sap.suite.ui.generic.template"},constructor:function(e){B.apply(this,arguments);t.testableStatic(u,"NavigationController")(this,e);}});N._sChanges="Changes";return N;});

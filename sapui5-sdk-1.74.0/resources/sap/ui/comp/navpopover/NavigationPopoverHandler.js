/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/ui/comp/library','sap/ui/base/ManagedObject','./SemanticObjectController','sap/ui/model/json/JSONModel','sap/ui/model/BindingMode','sap/ui/core/Control','./Factory','./NavigationPopover','./Util','sap/m/VBox','./LinkData','sap/m/MessageBox','sap/ui/comp/personalization/Controller','sap/ui/comp/personalization/Util','./NavigationContainer','./ContactDetailsController','./Log','sap/ui/core/InvisibleText','sap/ui/core/CustomData','sap/base/Log','sap/base/util/isPlainObject','sap/ui/core/Component'],function(q,C,M,S,J,B,a,F,N,U,V,L,b,c,P,d,e,f,I,g,h,i,j){"use strict";var k=M.extend("sap.ui.comp.navpopover.NavigationPopoverHandler",{metadata:{library:"sap.ui.comp",properties:{semanticObject:{type:"string",defaultValue:null},additionalSemanticObjects:{type:"string[]",defaultValue:[]},semanticObjectController:{type:"any",defaultValue:null},fieldName:{type:"string",defaultValue:null},semanticObjectLabel:{type:"string",defaultValue:null},mapFieldToSemanticObject:{type:"boolean",defaultValue:true},contactAnnotationPath:{type:"string",defaultValue:undefined},enableAvailableActionsPersonalization:{type:"boolean",defaultValue:true}},associations:{control:{type:"sap.ui.core.Control",multiple:false}},events:{beforePopoverOpens:{parameters:{semanticObject:{type:"string"},semanticAttributes:{type:"object"},semanticAttributesOfSemanticObjects:{type:"object"},setSemanticAttributes:{type:"function"},setAppStateKey:{type:"function"},originalId:{type:"string"},open:{type:"function"}}},navigationTargetsObtained:{parameters:{mainNavigation:{type:"sap.ui.comp.navpopover.LinkData"},actions:{type:"sap.ui.comp.navpopover.LinkData[]"},ownNavigation:{type:"sap.ui.comp.navpopover.LinkData"},popoverForms:{type:"sap.ui.layout.form.SimpleForm[]"},semanticObject:{type:"string"},semanticAttributes:{type:"object"},originalId:{type:"string"},show:{type:"function"}}},innerNavigate:{parameters:{text:{type:"string"},href:{type:"string"},semanticObject:{type:"string"},semanticAttributes:{type:"object"},originalId:{type:"string"}}}}}});k.prototype.init=function(){this._oPopover=null;this._oContactDetailsController=new e();var m=new J({semanticObject:undefined,semanticAttributes:undefined,appStateKey:undefined,mainNavigationId:undefined,navigationTarget:{mainNavigation:undefined,enableAvailableActionsPersonalization:undefined,extraContent:undefined},availableActions:[]});m.setDefaultBindingMode(B.TwoWay);m.setSizeLimit(1000);this.setModel(m,"$sapuicompNavigationPopoverHandler");this._oLog=h.getLevel()>=h.Level.INFO?new f():undefined;};k.prototype.applySettings=function(s){M.prototype.applySettings.apply(this,arguments);this._setSemanticAttributes(this._calculateSemanticAttributes(null));};k.prototype.openPopover=function(D){var t=this;return this._getPopover().then(function(p){var l=p.getDirectLink();if(l){t._fireInnerNavigate({text:l.getText(),href:l.getHref()});window.location.href=l.getHref();t._destroyPopover();return;}p.show(D);});};k.prototype.getSemanticObjectValue=function(){var s=this._getSemanticAttributes();if(s){return s[this.getSemanticObject()][this.getSemanticObject()];}return undefined;};k.prototype.getNavigationPopoverStableId=function(){var o=sap.ui.getCore().byId(this.getControl());if(!o){h.error("NavigationPopoverHandler: Stable ID could not be determined because the control is undefined");return undefined;}var A=this._getComponent(o);if(!A){h.error("NavigationPopoverHandler: Stable ID could not be determined because the app component is not defined for control '"+o.getId()+"'");return undefined;}var s=this.getModel("$sapuicompNavigationPopoverHandler").getProperty("/semanticObject");if(!s){h.error("NavigationPopoverHandler: Stable ID could not be determined because no default semantic object is defined");return undefined;}var l=[s].concat(this.getAdditionalSemanticObjects());U.sortArrayAlphabetical(l);var m=l.join("--");return A.createId("sapuicompnavpopoverNavigationPopover---"+m);};k.prototype.updateBindingContext=function(){var o=this.getBindingContext("$sapuicompNavigationPopoverHandler");a.prototype.updateBindingContext.apply(this,arguments);var l=this.getBindingContext("$sapuicompNavigationPopoverHandler");if(l&&l!==o){this._setSemanticAttributes(this._calculateSemanticAttributes(null));this._destroyPopover();}};k.prototype.setSemanticObject=function(s){this._destroyPopover();this.setProperty("semanticObject",s);this.getModel("$sapuicompNavigationPopoverHandler").setProperty("/semanticObject",s);this._setSemanticAttributes(this._calculateSemanticAttributes(null));return this;};k.prototype._setSemanticAttributes=function(s){this.getModel("$sapuicompNavigationPopoverHandler").setProperty("/semanticAttributes",s);};k.prototype._getSemanticAttributes=function(){return this.getModel("$sapuicompNavigationPopoverHandler").getProperty("/semanticAttributes");};k.prototype.setEnableAvailableActionsPersonalization=function(E){this.setProperty("enableAvailableActionsPersonalization",E);this.getModel("$sapuicompNavigationPopoverHandler").setProperty("/navigationTarget/enableAvailableActionsPersonalization",E);return this;};k.prototype.setFieldName=function(s){this.setProperty("fieldName",s);this._setSemanticAttributes(this._calculateSemanticAttributes(null));return this;};k.prototype.setControl=function(o){this.setAssociation("control",o);this.setModel(o.getModel());this._destroyPopover();this._updateSemanticObjectController();this._setSemanticAttributes(this._calculateSemanticAttributes(null));return this;};k.prototype.setMapFieldToSemanticObject=function(m){this.setProperty("mapFieldToSemanticObject",m);this._setSemanticAttributes(this._calculateSemanticAttributes(null));return this;};k.prototype.setSemanticObjectController=function(s){this._updateSemanticObjectController(s);this._setSemanticAttributes(this._calculateSemanticAttributes(null));return this;};k.prototype.exit=function(){this._oContactDetailsController.destroy();this._destroyPopover();if(this.getSemanticObjectController()){this.getSemanticObjectController().unregisterControl(this);}if(this.getModel("$sapuicompNavigationPopoverHandler")){this.getModel("$sapuicompNavigationPopoverHandler").destroy();}};k.prototype._initModel=function(){var t=this;var s;var l=this.getSemanticObject();var A=this.getAdditionalSemanticObjects();var m=U.getContactAnnotationPath(this,this.getSemanticObjectController());var o=sap.ui.getCore().byId(this.getControl());if(!o){h.error("sap.ui.comp.navpopover.NavigationPopoverHandler: No control provided, popover cannot be attached.");}var n=o&&o.getBindingContext()?o.getBindingContext().getPath():null;if(!n){h.warning("sap.ui.comp.navpopover.NavigationPopoverHandler: Binding Context is null. Please be aware that without binding context no semantic attributes can be calculated. Without semantic attributes no URL parameters can be created.");}var O=this.getModel();var p=this._getComponent(o);var r=o&&o.getId();var u,v,w;if(this._oLog){this._oLog.reset();}return sap.ui.getCore().loadLibrary('sap.ui.fl',{async:true}).then(function(){return U.retrieveSemanticObjectMapping(t.getFieldName(),O,n);}).then(function(x){t._setSemanticAttributes(t._calculateSemanticAttributes(x,t._oLog));s=t._getSemanticAttributes();return t._fireBeforePopoverOpens(s,l,r,t._oLog);}).then(function(R){s=R.semanticAttributes;t._setSemanticAttributes(s);v=t.getSemanticObjectValue();u=(o&&o._getTextOfDom&&o._getTextOfDom())||t.getSemanticObjectValue();t.getModel("$sapuicompNavigationPopoverHandler").setProperty("/appStateKey",R.appStateKey);return U.retrieveNavigationTargets(l,A,R.appStateKey,p,s,u,t.getFieldName(),O,n,t._oLog);}).then(function(T){w=T;t._oContactDetailsController.setModel(O);return t._oContactDetailsController.getBindingPath4ContactAnnotation(n,m,v);}).then(function(x){var y=t._oContactDetailsController.getContactDetailsContainers(x);return t._fireNavigationTargetsObtained(u,l,s,r,y,w,t._oLog);}).then(function(R){var x=t.getModel("$sapuicompNavigationPopoverHandler");x.setProperty("/mainNavigationId",R.mainNavigationId);x.setProperty("/navigationTarget/mainNavigation",R.mainNavigation);x.setProperty("/navigationTarget/extraContent",R.extraContent);x.setProperty("/availableActions",t._updateVisibilityOfAvailableActions(L.convert2Json(R.availableActions)));x.setProperty("/navigationTarget/enableAvailableActionsPersonalization",t._getEnableAvailableActionsPersonalization(x.getProperty("/availableActions")));if(h.getLevel()>=h.Level.TRACE){h.info("sap.ui.comp.NavigationPopoverHandler: calculation of semantic attributes\n---------------------------------------------\nBelow you can see detailed information regarding semantic attributes which have been calculated for one or more semantic objects defined in a SmartLink control. Semantic attributes are used to create the URL parameters. Additionally you can see all links containing the URL parameters.\n"+t._getLogFormattedText());}});};k.prototype._initPopover=function(){var t=this;return this._initModel().then(function(){var m=t.getModel("$sapuicompNavigationPopoverHandler");var p=t._createPopover();p.setModel(m,"$sapuicompNavigationPopoverHandler");var o=sap.ui.getCore().byId(t.getControl());if(o){o.addDependent(p);}return p;});};k.prototype._initNavigationContainer=function(){var t=this;return this._initModel().then(function(){var m=t.getModel("$sapuicompNavigationPopoverHandler");var n=t._createNavigationContainer();n.setModel(m,"$sapuicompNavigationPopoverHandler");var o=sap.ui.getCore().byId(t.getControl());if(o){o.addDependent(n);}return n;});};k.prototype._getPopover=function(){if(!this._oPopover){return this._initPopover();}else{return Promise.resolve(this._oPopover);}};k.prototype._getNavigationContainer=function(){return this._initNavigationContainer().then(function(n){return n;});};k.prototype._destroyPopover=function(){if(this._oPopover){this._oPopover.destroy();this._oPopover=null;}};k.prototype._createPopover=function(){if(this._oPopover){return this._oPopover;}var n=this._createNavigationContainer();var o=new I({text:"{$sapuicompNavigationPopoverHandler>/mainNavigationId}"});this._oPopover=new N({customData:new g({key:"useExternalContent"}),content:[n,o],ariaLabelledBy:o,semanticObjectName:"{$sapuicompNavigationPopoverHandler>/semanticObject}",semanticAttributes:"{$sapuicompNavigationPopoverHandler>/semanticAttributes}",appStateKey:"{$sapuicompNavigationPopoverHandler>/appStateKey}",source:this.getControl(),beforeClose:function(){this.removeAllContent().forEach(function(l){l.destroy();});},afterClose:this._destroyPopover.bind(this)});return this._oPopover;};k.prototype._createNavigationContainer=function(){var s=this.getNavigationPopoverStableId();if(!s){h.error("NavigationPopoverHandler: Due to undefined stable ID the button of action personalization is set to disabled");}if(sap.ui.getCore().byId(s)){h.error("Duplicate ID '"+s+"'. The instance of NavigationContainer should be destroyed first in order to avoid duplicate creation of NavigationContainer with stable ID.");throw"Duplicate ID";}var m=this.getModel("$sapuicompNavigationPopoverHandler");return new d(s,{mainNavigationId:"{$sapuicompNavigationPopoverHandler>/mainNavigationId}",mainNavigation:m.getProperty("/navigationTarget/mainNavigation"),availableActions:{path:'$sapuicompNavigationPopoverHandler>/availableActions',templateShareable:false,template:new L({key:"{$sapuicompNavigationPopoverHandler>key}",href:"{$sapuicompNavigationPopoverHandler>href}",text:"{$sapuicompNavigationPopoverHandler>text}",target:"{$sapuicompNavigationPopoverHandler>target}",description:"{$sapuicompNavigationPopoverHandler>description}",visible:"{$sapuicompNavigationPopoverHandler>visible}"})},extraContent:m.getProperty("/navigationTarget/extraContent")?m.getProperty("/navigationTarget/extraContent").getId():undefined,component:this._getComponent(sap.ui.getCore().byId(this.getControl())),enableAvailableActionsPersonalization:"{$sapuicompNavigationPopoverHandler>/navigationTarget/enableAvailableActionsPersonalization}",beforePopoverOpen:function(){if(this._oPopover){this._oPopover.setModal(true);}}.bind(this),afterPopoverClose:function(){if(this._oPopover){this._oPopover.setModal(false);}}.bind(this),navigate:this._onNavigate.bind(this)});};k.prototype._fireBeforePopoverOpens=function(s,l,m,o){var t=this;return new Promise(function(r){var R={semanticAttributes:s,appStateKey:undefined};if(!t.hasListeners("beforePopoverOpens")){return r(R);}var E=function(s){var n=Object.keys(s).filter(function(p){return!q.isEmptyObject(s[p]);});return!!n.length;};t.fireBeforePopoverOpens({originalId:m,semanticObject:l,semanticAttributes:!q.isEmptyObject(s[l])?s[l]:null,semanticAttributesOfSemanticObjects:E(s)?s:null,setSemanticAttributes:function(s,n){n=n||l;R.semanticAttributes=R.semanticAttributes||{};if(o){o.updateSemanticObjectAttributes(n,R.semanticAttributes[n],s);}R.semanticAttributes[n]=s;},setAppStateKey:function(A){R.appStateKey=A;},open:function(){return r(R);}});});};k.prototype._fireNavigationTargetsObtained=function(m,s,o,l,n,p,r){var t=this;return new Promise(function(u){var R={mainNavigationId:m,mainNavigation:p.mainNavigation,availableActions:p.availableActions,ownNavigation:p.ownNavigation,extraContent:n.length?new V({items:n}):undefined};if(!t.hasListeners("navigationTargetsObtained")){return u(R);}t.fireNavigationTargetsObtained({mainNavigation:p.mainNavigation,actions:p.availableActions,ownNavigation:p.ownNavigation,popoverForms:n,semanticObject:s,semanticAttributes:o?o[s]:o,originalId:l,show:function(m,v,A,w){if(arguments.length>0&&!(typeof m==="string"||v instanceof L||Array.isArray(A))&&w===undefined){w=A;A=v;v=m;m=undefined;}if(m!==undefined&&m!==null){R.mainNavigationId=m;}if(v!==undefined){R.mainNavigation=v;if(r&&v){r.addIntent({text:v.getText(),intent:v.getHref()});}}if(A){A.forEach(function(x){if(x.getKey()===undefined){h.error("'key' attribute of 'availableAction' '"+x.getText()+"' is undefined. Links without 'key' can not be persisted.");h.warning("The 'visible' attribute of 'availableAction' '"+x.getText()+"' is set to 'true'");x.setVisible(true);}if(r&&x){r.addIntent({text:x.getText(),intent:x.getHref()});}});R.availableActions=A;}if(w){R.extraContent=w;}return u(R);}});});};k.prototype._onNavigate=function(E){var p=E.getParameters();this._fireInnerNavigate({text:p.text,href:p.href});};k.prototype._fireInnerNavigate=function(p){var o=sap.ui.getCore().byId(this.getControl());var s=this.getSemanticObject();var l=this._getSemanticAttributes();this.fireInnerNavigate({text:p.text,href:p.href,originalId:o?o.getId():undefined,semanticObject:s,semanticAttributes:l?l[s]:l});};k.prototype._getComponent=function(o){if(!o){return null;}var p=o.getParent();while(p){if(p instanceof j){if(p&&p.getAppComponent){p=p.getAppComponent();}return p;}p=p.getParent();}return j.get(j.getOwnerIdFor(o));};k.prototype.getAppComponent=function(){return this._getComponent(sap.ui.getCore().byId(this.getControl()));};k.prototype._getBindingContextObject=function(){var o=sap.ui.getCore().byId(this.getControl());var l=this.getBindingContext()||(o&&o.getBindingContext());return l?l.getObject(l.getPath()):null;};k.prototype._getLogFormattedText=function(){return this._oLog?this._oLog.getFormattedText():"No logging data available";};k.prototype._calculateSemanticAttributes=function(s,l){var o=this._getBindingContextObject();var m=this.getFieldName();var t=this;var n=["",this.getSemanticObject()].concat(this.getAdditionalSemanticObjects());var r={};n.forEach(function(p){r[p]={};var u=t._getMappingRules(p,s,o);for(var A in o){var v=null,T=null;if(l&&p){v={transformations:[]};l.addSemanticObjectAttribute(p,A,v);}if(o[A]===undefined||o[A]===null){if(v){v.transformations.push({value:o[A],description:"\u2139 Undefined and null values have been removed in NavigationPopoverHandler."});}continue;}if(i(o[A])){if(v){v.transformations.push({value:o[A],description:"\u2139 Plain objects has been removed in NavigationPopoverHandler."});}continue;}var w=u[A];if(v&&A!==w){T=s?{value:undefined,description:"\u2139 The attribute "+A+" has been renamed to "+w+" in NavigationPopoverHandler.",reason:"\ud83d\udd34 A com.sap.vocabularies.Common.v1.SemanticObjectMapping annotation is defined for semantic object "+p+" with source attribute "+A+" and target attribute "+w+". You can modify the annotation if the mapping result is not what you expected."}:{value:undefined,description:"\u2139 The attribute "+A+" has been renamed to "+w+" in NavigationPopoverHandler.",reason:"\ud83d\udd34 The property mapFieldToSemanticObject is set to true. Attribute "+A+" is mapped to "+w+". (semantic object is "+t.getSemanticObject()+", field name is "+t.getFieldName()+"). If this is not what you expected, you can set the property to false or define a com.sap.vocabularies.Common.v1.SemanticObjectMapping annotation."};}var x=o[A];if(r[p][w]){if(o[m]){if(w===u[t.getFieldName()]){x=o[m];}else{h.error("The attribute "+A+" can not be renamed to the attribute "+w+" due to a clash situation. This can lead to wrong navigation later on.");}}}r[p][w]=x;if(v){v.transformations.push({value:o[A],description:"\u2139 The attribute "+A+" with the value "+o[A]+" is taken from the binding context in NavigationPopoverHandler."});if(T){v.transformations.push(T);l.addSemanticObjectAttribute(p,w,{transformations:[{value:x,description:"\u2139 The attribute "+w+" with the value "+x+" has been added due to a mapping rule regarding the attribute "+A+" in NavigationPopoverHandler."}]});}}}});return r;};k.prototype._getMappingRules=function(s,o,l){var m=this.getMapFieldToSemanticObject();if(this.getSemanticObjectController()&&this.getSemanticObjectController().getMapFieldToSemanticObject()!==undefined){m=this.getSemanticObjectController().getMapFieldToSemanticObject();}var A;var n={};if(o){for(A in o[s]){if(typeof o[s][A]==="string"){n[A]=o[s][A];}}}else if(m){if(this.getSemanticObjectController()){var p=this.getSemanticObjectController().getFieldSemanticObjectMap();for(A in p){n[A]=p[A];}}if(this.getFieldName()&&this.getSemanticObject()){n[this.getFieldName()]=this.getSemanticObject();}}for(A in l){if(!n.hasOwnProperty(A)){n[A]=A;}}return n;};k.prototype._updateSemanticObjectController=function(o){var l=this.getProperty("semanticObjectController");var m=sap.ui.getCore().byId(this.getControl());o=o||this.getSemanticObjectController()||this._getSemanticObjectControllerOfControl(m);if(o&&m&&o.isControlRegistered(m)){o.unregisterControl(this);}if(o!==l&&l){l.unregisterControl(this);}this.setProperty("semanticObjectController",o);if(o&&!o.isControlRegistered(m)){o.registerControl(this);}};k.prototype._getSemanticObjectControllerOfControl=function(o){if(!o){return undefined;}var s;var p=o.getParent();while(p){if(p.getSemanticObjectController){s=p.getSemanticObjectController();if(s){this.setSemanticObjectController(s);break;}}p=p.getParent();}return s;};k.prototype._updateVisibilityOfAvailableActions=function(m){if(!this._getEnableAvailableActionsPersonalization(m)){return m;}var l=U.getStorableAvailableActions(m);var H=l.some(function(o){return!!o.isSuperiorAction;});l.forEach(function(o){if(m.length>10){o.visible=false;}if(H){o.visible=false;}if(o.isSuperiorAction){o.visible=true;}});return m;};k.prototype._getEnableAvailableActionsPersonalization=function(m){var l=U.getStorableAvailableActions(m);if(l.length===0){return false;}var E=this.getEnableAvailableActionsPersonalization();if(this.getSemanticObjectController()&&this.getSemanticObjectController().getEnableAvailableActionsPersonalization()&&this.getSemanticObjectController().getEnableAvailableActionsPersonalization()[this.getFieldName()]!==undefined){E=this.getSemanticObjectController().getEnableAvailableActionsPersonalization()[this.getFieldName()];}return E;};return k;});

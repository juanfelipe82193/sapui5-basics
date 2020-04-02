/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/base/util/deepExtend"],function(U,A,d){"use strict";var R={};var r,g;var F="com.sap.vocabularies.UI.v1.Facets";var a="com.sap.vocabularies.UI.v1.FieldGroup";var I="com.sap.vocabularies.UI.v1.Identification";R.applyChange=function(c,C,p){var f=p.modifier.getParent(g);p.modifier.removeAggregation(f,"formContainers",g);};R.revertChange=function(c,C,p){};R.completeChangeContent=function(c,s,p){r=s.removedElement.id;g=p.modifier.bySelector(r,p.appComponent);var e=U.getODataEntitySet(U.getComponent(g)).entityType;var f=A.getExistingAnnotationsOfEntityType(g,F);var o=JSON.parse(JSON.stringify(f));var G=(r.split("--")[1]);G=G.substring(0,G.lastIndexOf("::"));if(G.indexOf(a)===0||G.indexOf(I)===0){G="@"+G.replace("::","#");}else{G=G.replace("::","/@").replace("::","#");}var b=U.getSmartFormGroupInfo(G,f);if(b&&b.oGroup&&b.aForm){b.aForm.splice(b.aForm.indexOf(b.oGroup),1);var t=A.createCustomAnnotationTermChange(e,f,o,F);var C=A.createCustomChanges(t);d(c.getContent(),C);}};return R;},true);

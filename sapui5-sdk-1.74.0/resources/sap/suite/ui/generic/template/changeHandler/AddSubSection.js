/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/base/util/deepExtend"],function(U,A,d){"use strict";var a={};a.applyChange=function(c,C,p){};a.revertChange=function(c,C,p){};a.completeChangeContent=function(c,s,p){var o=s.parentId||s.selector.id;var r=p.modifier.bySelector(o,p.appComponent);var m=U.getMetaModel(s,p);var e="";var E={};var b=[];var f=[];var g="";var t=U.getTemplatingInfo(r);if(t&&t.target&&t.annotation){e=t.target;E=m.getODataEntityType(e);g=t.annotation;b=E[g];}f=JSON.parse(JSON.stringify(b));var F=U.fnAddSubSection(r,b,s.index);var h={};h[F]={"Data":[{"Label":{"String":"New Field"},"Value":{"Path":""},"RecordType":"com.sap.vocabularies.UI.v1.DataField"}],"RecordType":"com.sap.vocabularies.UI.v1.FieldGroupType"};var C={customChanges:[]};var i=A.createCustomAnnotationTermChange(e,b,f,g);var j=A.createCustomAnnotationTermChange(e,h[F],{},F);C.customChanges.push(i);C.customChanges.push(j);d(c.getContent(),C);};return a;},true);

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/generic/AddElement"],function(U,A){"use strict";var S="com.sap.vocabularies.UI.v1.SelectionFields";var c=function(C,s,p){var o=s.parentId||s.selector.id;var O=p.modifier.bySelector(o,p.appComponent);var m=U.getMetaModel(s,p);var e=U.getEntityType(O);var E=m.getODataEntityType(e);var b=E[S];var d=b.some(function(f){return f.PropertyPath==s.addElementInfo.name;});return d;};var a={};a.applyChange=function(C,o,p){};a.revertChange=function(C,o,p){};a.completeChangeContent=function(C,s,p){if(!c(C,s,p)){s.custom={};var n={PropertyPath:s.addElementInfo.name};s.custom.annotation=S;s.custom.index=s.index;s.custom.oAnnotationTermToBeAdded=n;s.custom.fnGetAnnotationIndex=U.getRecordIndexForSelectionFieldFromAnnotation;A.completeChangeContent(C,s,p);}};return a;},true);

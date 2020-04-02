/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/generic/RemoveElement"],function(U,R){"use strict";var a={};var I;var L="com.sap.vocabularies.UI.v1.LineItem";function A(t){var s=t.getParent();var u=s.getUiState();var p=u.getPresentationVariant();var v=p.Visualizations[0];v.Content.splice(I-1,1);u.setPresentationVariant(p);s.setUiState(u);}function f(t){if(t.isA("sap.m.Table")){A(t);U.fnAdaptTableStructures(t);}else{A(t);var c=t.getColumns();for(var i=0;i<c.length;i++){if(!c[i].getVisible()){c[i].destroy();}}}}a.applyChange=function(c,C,p){var r=c.getContent().customChanges[0].removedElementId;var o=p.modifier.bySelector(r,p.appComponent);var t=o.getParent();f(t);};a.revertChange=function(c,C,p){};a.completeChangeContent=function(c,s,p){var r=s.removedElement.id;var o=p.modifier.bySelector(r,p.appComponent);I=U.getLineItemRecordIndex(o);s.custom={};s.custom.annotation=L;s.custom.fnGetAnnotationIndex=U.getLineItemRecordIndex;R.completeChangeContent(c,s,p);};return a;},true);

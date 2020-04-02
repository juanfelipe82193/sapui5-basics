/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/m/changeHandler/MoveTableColumns","sap/suite/ui/generic/template/changeHandler/generic/MoveElements"],function(U,A,M,a){"use strict";var b={};var L="com.sap.vocabularies.UI.v1.LineItem";function f(t,s,T){var S=t.getParent();var u=S.getUiState();var p=u.getPresentationVariant();if(t.isA("sap.m.Table")){var C=t.getColumns()[T];t.removeColumn(C);t.insertColumn(C,s);}var v=p.Visualizations[0];v.Content.splice(T,0,v.Content.splice(s,1)[0]);u.setPresentationVariant(p);S.setUiState(u);}function c(t,s,T){if(t.isA("sap.m.Table")){f(t,s,T);U.fnAdaptTableStructures(t);}else{f(t,s,T);}}b.applyChange=function(C,o,p){var t=C.getDependentControl("source",p);var s=C.getContent().movedElements[0].sourceIndex;var T=C.getContent().movedElements[0].targetIndex;c(t,s,T);};b.revertChange=function(C,o,p){};b.completeChangeContent=function(C,s,p){s.custom={};s.custom.annotation=L;s.custom.fnGetAnnotationIndex=U.getLineItemRecordIndex;s.custom.MoveConcreteElement=M;a.completeChangeContent(C,s,p);};return b;},true);

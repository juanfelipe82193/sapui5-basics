/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/suite/ui/generic/template/changeHandler/generic/MoveElements","sap/base/util/isEmptyObject"],function(U,A,M,i){"use strict";var a={},F="com.sap.vocabularies.UI.v1.Facets";a.applyChange=function(c,C,p){if(!i(c.getContent().movedElements)){M.applyChange(c,C,p);}};a.revertChange=function(c,C,p){};a.completeChangeContent=function(c,s,p){s.custom={};s.custom.annotation=F;s.custom.fnPerformCustomMove=U.fnMoveSubSection;M.completeChangeContent(c,s,p);};return a;},true);

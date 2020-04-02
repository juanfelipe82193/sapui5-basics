/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/generic/MoveElements","sap/base/util/isEmptyObject"],function(U,M,i){"use strict";var a={},H="com.sap.vocabularies.UI.v1.HeaderFacets";a.applyChange=function(c,C,p){if(!i(c.getContent().movedElements)){M.applyChange(c,C,p);}};a.revertChange=function(c,C,p){};a.completeChangeContent=function(c,s,p){s.custom={};s.custom.annotation=H;s.custom.fnGetAnnotationIndex=U.getHeaderFacetIndex;M.completeChangeContent(c,s,p);};return a;},true);

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/generic/RemoveElement","sap/ui/fl/changeHandler/HideControl"],function(U,R,H){"use strict";var a={};a.applyChange=function(c,C,p){var s=c.getContent().customChanges[0].oSelector;var e=p.modifier.bySelector(s).getParent();if(e){e.destroy();}};a.revertChange=function(c,C,p){};a.completeChangeContent=function(c,s,p){s.custom={};s.custom.fnGetRelevantElement=U.getSmartFilterBarControlConfiguration;s.custom.fnGetAnnotationIndex=U.getRecordIndexForSelectionField;s.custom.fnGetElementSelector=U.getRemoveElementSelector;R.completeChangeContent(c,s,p);};return a;},true);

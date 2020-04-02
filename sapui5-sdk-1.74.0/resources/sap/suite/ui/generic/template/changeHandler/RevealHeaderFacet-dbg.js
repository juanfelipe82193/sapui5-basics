/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/generic/RevealElement",
	"sap/ui/fl/changeHandler/UnhideControl"
], function(
	Utils,
	RevealElement,
	UnhideControl
) {
	"use strict";

	/**
	 * Change handler for revealing a header facet.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RevealHeaderFacet
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var RevealHeaderFacet = {};
	var sRevealedElement = "";

	var HEADERFACETS = "com.sap.vocabularies.UI.v1.HeaderFacets";

	var fnCreateRevealedAnnotationTerm = function(oChange, oSpecificChangeInfo, mPropertyBag) {
		var oElement = mPropertyBag.modifier.bySelector(sRevealedElement, mPropertyBag.appComponent);
		var oTemplInfo = Utils.getTemplatingInfo(oElement);
		var oHeaderFacet = oTemplInfo.annotationContext;
		return oHeaderFacet;
		};

	RevealHeaderFacet.applyChange = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var oElement = mPropertyBag.modifier.bySelector(sRevealedElement, mPropertyBag.appComponent);
		UnhideControl.applyChange(oChange, oElement, mPropertyBag);
	};

	RevealHeaderFacet.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	RevealHeaderFacet.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		sRevealedElement = oSpecificChangeInfo.revealedElementId;
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = HEADERFACETS;
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getHeaderFacetIndex;
		oSpecificChangeInfo.custom.oRevealedAnnotationTerm = JSON.parse(JSON.stringify(fnCreateRevealedAnnotationTerm(oChange, oSpecificChangeInfo, mPropertyBag)));
		RevealElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return RevealHeaderFacet;
},
/* bExport= */true);

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/generic/RemoveElement"
], function(
	Utils,
	RemoveElement
) {
	"use strict";

	/**
	 * Change handler for removing a header facet.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RemoveHeaderFacet **
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var RemoveHeaderFacet = {};
	var FACETS = "com.sap.vocabularies.UI.v1.HeaderFacets";

	RemoveHeaderFacet.applyChange = function (oChange, oControl, mPropertyBag) {
		RemoveElement.applyChange(oChange, oControl, mPropertyBag);
	};

	RemoveHeaderFacet.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	RemoveHeaderFacet.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = FACETS;
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getHeaderFacetIndex;
		RemoveElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return RemoveHeaderFacet;
},
/* bExport= */true);

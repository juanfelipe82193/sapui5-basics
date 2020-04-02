/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/changeHandler/generic/MoveElements",
		"sap/base/util/isEmptyObject"
	], function (
	Utils,
	MoveElements,
	isEmptyObject
	) {
		"use strict";

		/**
		 * Change handler for moving a header facet.
		 *
		 * @alias sap.suite.ui.generic.template.changeHandler.MoveHeaderFacet
		 * @author SAP SE
		 * @version 1.74.0
		 * @experimental
		 */
		var MoveHeaderFacet = {},
			HEADERFACETS = "com.sap.vocabularies.UI.v1.HeaderFacets";

		MoveHeaderFacet.applyChange = function (oChange, oControl, mPropertyBag) {
			if (!isEmptyObject(oChange.getContent().movedElements)) {
				MoveElements.applyChange(oChange, oControl, mPropertyBag);
			}
		};

		MoveHeaderFacet.revertChange = function (oChange, oControl, mPropertyBag) {
			//write revert change logic
		};

		MoveHeaderFacet.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
			oSpecificChangeInfo.custom = {};
			oSpecificChangeInfo.custom.annotation = HEADERFACETS;
			oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getHeaderFacetIndex;
			MoveElements.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
		};

		return MoveHeaderFacet;
	},
	/* bExport= */true);

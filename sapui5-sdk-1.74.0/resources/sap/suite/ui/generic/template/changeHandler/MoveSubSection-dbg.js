/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
		"sap/suite/ui/generic/template/changeHandler/generic/MoveElements",
		"sap/base/util/isEmptyObject"
	], function (
	Utils,
	AnnotationChangeUtils,
	MoveElements,
	isEmptyObject
	) {
		"use strict";

		/**
		 * Change handler for moving a subsection.
		 *
		 * @alias sap.suite.ui.generic.template.changeHandler.MoveSubSection
		 * @author SAP SE
		 * @version 1.74.0
		 * @experimental
		 */
		var MoveSubSection = {},
			FACETS = "com.sap.vocabularies.UI.v1.Facets";

		MoveSubSection.applyChange = function (oChange, oControl, mPropertyBag) {
			if (!isEmptyObject(oChange.getContent().movedElements)) {
				MoveElements.applyChange(oChange, oControl, mPropertyBag);
			}
		};

		MoveSubSection.revertChange = function (oChange, oControl, mPropertyBag) {
			//write revert change logic
		};

		MoveSubSection.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
			oSpecificChangeInfo.custom = {};
			oSpecificChangeInfo.custom.annotation = FACETS;
			oSpecificChangeInfo.custom.fnPerformCustomMove = Utils.fnMoveSubSection;
			MoveElements.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
		};

		return MoveSubSection;
	},
	/* bExport= */true);

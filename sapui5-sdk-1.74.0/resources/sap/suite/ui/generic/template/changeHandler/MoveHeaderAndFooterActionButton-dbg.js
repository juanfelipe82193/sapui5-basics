/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/ui/fl/changeHandler/MoveControls",
	"sap/suite/ui/generic/template/changeHandler/generic/MoveElements"
], function(
	Utils,
	AnnotationChangeUtils,
	MoveControls,
	MoveElements
) {
	"use strict";
	/**
	 * Change handler for moving object page header or footer action button.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.MoveHeaderAndFooterActionButton
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var MoveHeaderAndFooterActionButton = {};

	var IDENTIFICATION = "com.sap.vocabularies.UI.v1.Identification";

	MoveHeaderAndFooterActionButton.applyChange = function (oChange, oControl, mPropertyBag) {
		MoveControls.applyChange(oChange, oControl, mPropertyBag);
	};

	MoveHeaderAndFooterActionButton.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	MoveHeaderAndFooterActionButton.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = IDENTIFICATION;
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getIndexFromInstanceMetadataPath;
		oSpecificChangeInfo.custom.MoveConcreteElement = MoveControls;
		MoveElements.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return MoveHeaderAndFooterActionButton;
},
/* bExport= */true);

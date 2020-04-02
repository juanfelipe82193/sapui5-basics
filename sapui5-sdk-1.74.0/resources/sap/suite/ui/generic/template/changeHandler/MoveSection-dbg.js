/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/uxap/changeHandler/MoveObjectPageSection",
	"sap/suite/ui/generic/template/changeHandler/generic/MoveElements"
], function(
	Utils,
	AnnotationChangeUtils,
	MoveSections,
	MoveElements
) {
	"use strict";

	/**
	 * Change handler for moving a field group.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.MoveGroup
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var MoveSection = {};
	var FACETS = "com.sap.vocabularies.UI.v1.Facets";

	MoveSection.applyChange = function (oChange, oControl, mPropertyBag) {
	};

	MoveSection.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	MoveSection.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = FACETS;
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getIndexFromInstanceMetadataPath;
		oSpecificChangeInfo.custom.MoveConcreteElement = MoveSections;
		MoveElements.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return MoveSection;
},
/* bExport= */true);

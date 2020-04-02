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
	 * Change handler for removing a object page header or footer button.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RemoveHeaderAndFooterActionButton
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var RemoveHeaderAndFooterActionButton = {};

	var IDENTIFICAITON = "com.sap.vocabularies.UI.v1.Identification";

	RemoveHeaderAndFooterActionButton.applyChange = function (oChange, oControl, mPropertyBag) {
		RemoveElement.applyChange(oChange, oControl, mPropertyBag);
	};

	RemoveHeaderAndFooterActionButton.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	RemoveHeaderAndFooterActionButton.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = IDENTIFICAITON;
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getIndexFromInstanceMetadataPath;
		RemoveElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return RemoveHeaderAndFooterActionButton;
},
/* bExport= */true);

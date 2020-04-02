/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/util/IFrame"
], function(
) {
	"use strict";

	/**
	 * Create an IFrame control and set its properties
	 *
	 * @param {sap.ui.fl.Change} oChange Change object with instructions to be applied on the control map
	 * @param {object} mPropertyBag Map of properties
	 * @param {object} mPropertyBag.modifier Modifier for the controls
	 * @ui5-restricted sap.ui.fl
	 */
	return function (oChange, mPropertyBag, sIFrameId) {
		var oModifier = mPropertyBag.modifier;
		var oChangeDefinition = oChange.getDefinition();
		var oView = mPropertyBag.view;
		var oComponent = mPropertyBag.appComponent;
		var mIFrameSettings = {};
		["url", "width", "height"].forEach(function (sIFrameProperty) {
			mIFrameSettings[sIFrameProperty] = oChangeDefinition.content[sIFrameProperty];
		});
		var oIFrame = oModifier.createControl("sap.ui.fl.util.IFrame", oComponent, oView, sIFrameId, mIFrameSettings, false);
		return oIFrame;
	};
});

/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define(['sap/ui/core/Renderer', 'sap/ui/core/IconPool'],
		function(Renderer, IconPool) {
	"use strict";

	//initialize the Icon Pool
	IconPool.insertFontFaceStyle();

	var FieldBaseRenderer = Renderer.extend("sap.ui.mdc.field.FieldBaseRenderer");

	FieldBaseRenderer.render = function(oRm, oField) {
		var aContent = oField._getContent();
		var sWidth = oField.getWidth();

		oRm.write("<div");
		oRm.writeControlData(oField);
		oRm.addClass("sapUiMdcBaseField");
		if (aContent.length > 1) {
			oRm.addClass("sapUiMdcBaseFieldMoreFields");
		}

		if (sWidth) {
			oRm.addStyle("width", sWidth);
		}
		oRm.writeStyles();
		oRm.writeClasses();
		oRm.write(">");

		for (var i = 0; i < aContent.length; i++) {
			var oContent = aContent[i];
			oRm.renderControl(oContent);
		}

		oRm.write("</div>");

	};


	return FieldBaseRenderer;

}, /* bExport= */ true);
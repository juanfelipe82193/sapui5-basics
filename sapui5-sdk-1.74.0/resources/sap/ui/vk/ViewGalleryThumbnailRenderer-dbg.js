/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([ "./library", "sap/ui/Device" ],
	function(library, Device) {
	"use strict";

	/**
	 * ViewGalleryThumbnail renderer.
	 * @namespace
	 */
	var ViewGalleryThumbnailRenderer = {
	};

	ViewGalleryThumbnailRenderer.render = function(oRM, oItem) {
		oRM.write("<div ");
		oRM.writeControlData(oItem);
		oRM.addStyle("height", oItem.getThumbnailHeight());
		oRM.addStyle("width", oItem.getThumbnailWidth());
		oRM.addStyle("background-image", "url(" + oItem.getSource() + ")");
		oRM.writeStyles();
		oRM.addClass("sapVizKitViewGalleryThumbnail");
		oRM.writeClasses();
		var toolTip = oItem.getTooltip();
		if (toolTip) {
			oRM.attr("title", toolTip);
		}
		oRM.write(">");

		var index = oItem._getIndex() + 1;
		if (index > 0) {
			oRM.write("<div class='sapVizKitViewGalleryStepNumberText'>");
			oRM.writeEscaped(index.toString());
			oRM.write("</div>");
		}

		oRM.write("</div>");
	};

	return ViewGalleryThumbnailRenderer;

}, /* bExport= */ true);

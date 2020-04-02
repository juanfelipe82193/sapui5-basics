sap.ui.define([
		"sap/ui/Device"
	],
	function(Device) {
		"use strict";

		var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");

		/**
		 * @class ImageEditorContainer renderer
		 * @static
		 */
		var ImageEditorContainerRenderer = {};


		ImageEditorContainerRenderer.render = function(oRm, oControl) {
			oRm.write("<div");
			oRm.addClass("sapSuiteUiCommonsImageEditorContainer");
			oRm.writeControlData(oControl);
			oRm.writeAttribute("tabindex", "0");
			oRm.writeAttribute("aria-label", oResourceBundle.getText("IMGEDITOR_ACCESSIBILITY_LABEL"));
			oRm.writeClasses();
			oRm.write(">");

			this.renderSvgFilters(oRm, oControl);
			this.renderHeaderToolbar(oRm, oControl);
			this.renderMobileHeaderToolbar(oRm, oControl);

			oRm.write("<div");
			// render custom flex instead of sap.m.FlexBox, because ImageEditor can't be aggregation of multiple controls
			oRm.addClass("sapSuiteUiCommonsImageEditorContainerContent");
			oRm.writeClasses();
			oRm.write(">");

			this.renderOptionsPanel(oRm, oControl);
			this.renderImageEditor(oRm, oControl);
			oRm.write("</div>");

			this.renderMobileZoomToolbar(oRm, oControl);
			this.renderMobileFooterToolbar(oRm, oControl);

			oRm.write("</div>");
		};

		ImageEditorContainerRenderer.renderSvgFilters = function(oRm, oControl) {
			oRm.write("<svg width='0' height='0' style='position: absolute;'>");
			oRm.write("<defs>");

			this.renderOriginalThumbnail(oRm, oControl);

			this.renderSepiaFilter(oRm, oControl);
			this.renderGrayscaleFilter(oRm, oControl);
			this.renderSaturateFilter(oRm, oControl);
			this.renderInvertFilter(oRm, oControl);
			this.renderBrightnessFilter(oRm, oControl);
			this.renderContrastFilter(oRm, oControl);
			this.renderHueRotateFilter(oRm, oControl);

			oRm.write("</defs>");
			oRm.write("</svg>");
		};

		ImageEditorContainerRenderer.renderOriginalThumbnail = function(oRm, oControl) {
			var oImageEditor = oControl.getImageEditor();

			if (!oImageEditor || !oImageEditor._oCanvas) {
				return;
			}

			oRm.write("<image xmlns:xlink='http://www.w3.org/1999/xlink'");
			oRm.writeAttribute("id", oControl.getId() + "-origThumbnail");
			oRm.writeAttribute("preserveAspectRatio", "xMidYMid slice"); // supposedly equivalent of object-fit: cover
			oRm.writeAttribute("viewBox", "0 0 " + oControl._oThumbnailCanvas.width + " " + oControl._oThumbnailCanvas.height); // viewbox is needed for preserveAspectRatio to work correctly)
			oRm.writeAttribute("href", oImageEditor._oCanvas.toDataURL());
			oRm.writeAttribute("width", "100%");
			oRm.writeAttribute("height", "100%");
			oRm.write("/>");
		};

		ImageEditorContainerRenderer.renderSepiaFilter = function(oRm, oControl) {
			oRm.write("<filter id='" + oControl.getId() + "-sepia'>");
			oRm.write("<feColorMatrix type='matrix' values='0.393 0.769 0.189 0 0  0.349 0.686 0.168 0 0  0.272 0.534 0.131 0 0  0 0 0 1 0'/>");
			oRm.write("</filter>");
		};

		ImageEditorContainerRenderer.renderGrayscaleFilter = function(oRm, oControl) {
			oRm.write("<filter id='" + oControl.getId() + "-grayscale'>");
			oRm.write("<feColorMatrix type='matrix' values='0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0 0 0 0 1 0'/>");
			oRm.write("</filter>");
		};

		ImageEditorContainerRenderer.renderSaturateFilter = function(oRm, oControl) {
			oRm.write(" <filter id='" + oControl.getId() + "-saturate'>");
			oRm.write("<feColorMatrix type='saturate' values='3'/>");
			oRm.write("</filter>");
		};

		ImageEditorContainerRenderer.renderInvertFilter = function(oRm, oControl) {
			oRm.write("<filter id='" + oControl.getId() + "-invert'>");
			oRm.write("<feComponentTransfer><feFuncR type='table' tableValues='1 0'/><feFuncG type='table' tableValues='1 0'/><feFuncB type='table' tableValues='1 0'/></feComponentTransfer>");
			oRm.write("</filter>");
		};

		ImageEditorContainerRenderer.renderBrightnessFilter = function(oRm, oControl) {
			oRm.write("<filter id='" + oControl.getId() + "-brightness'>");
			oRm.write("<feComponentTransfer><feFuncR type='linear' slope='3'/><feFuncG type='linear' slope='3'/><feFuncB type='linear' slope='3'/></feComponentTransfer>");
			oRm.write("</filter>");
		};

		ImageEditorContainerRenderer.renderContrastFilter = function(oRm, oControl) {
			oRm.write("<filter id='" + oControl.getId() + "-contrast'>");
			oRm.write("<feComponentTransfer>");
			oRm.write("<feFuncR type='linear' slope='3' intercept='-0.3'/>");
			oRm.write("<feFuncG type='linear' slope='3' intercept='-0.3'/>");
			oRm.write("<feFuncB type='linear' slope='3' intercept='-0.3'/>");
			oRm.write("</feComponentTransfer>");
			oRm.write("</filter>");
		};

		ImageEditorContainerRenderer.renderHueRotateFilter = function(oRm, oControl) {
			oRm.write("<filter id='" + oControl.getId() + "-hueRotate'>");
			oRm.write("<feColorMatrix type='hueRotate' values='90' />");
			oRm.write("</filter>");
		};

		ImageEditorContainerRenderer.renderHeaderToolbar = function(oRm, oControl) {
			if (!Device.system.phone && !oControl._isSmallSize()) {
				var oHeaderToolbar = oControl._getHeaderToolbar();
				oRm.renderControl(oHeaderToolbar);
			}
		};

		ImageEditorContainerRenderer.renderMobileHeaderToolbar = function(oRm, oControl) {
			if (Device.system.phone || oControl._isSmallSize()) {
				var oHeaderToolbar = oControl._getMobileHeaderToolbar();
				oRm.renderControl(oHeaderToolbar);
			}
		};
		ImageEditorContainerRenderer.renderMobileZoomToolbar = function(oRm, oControl) {
			var oHeaderToolbar = oControl._getMobileZoomToolbar();
			oRm.renderControl(oHeaderToolbar);
		};

		ImageEditorContainerRenderer.renderMobileFooterToolbar = function(oRm, oControl) {
			var oHeaderToolbar = oControl._getMobileFooterToolbar();
			oRm.renderControl(oHeaderToolbar);
		};

		ImageEditorContainerRenderer.renderOptionsPanel = function(oRm, oControl) {
			var oOptionsPanel = oControl._getOptionsPanel();
			oRm.renderControl(oOptionsPanel);

			oControl._refreshGridListsItems();
		};

		ImageEditorContainerRenderer.renderImageEditor = function(oRm, oControl) {
			var oImageEditor = oControl.getImageEditor();

			oRm.write("<div");
			oRm.addClass("sapSuiteUiCommonsImageEditorContainerWrapper");
			oRm.writeClasses();
			oRm.write(">");

			if (oImageEditor) {
				oRm.renderControl(oImageEditor);
			}

			oRm.write("</div>");
		};

		return ImageEditorContainerRenderer;

	}, /* bExport= */ true);

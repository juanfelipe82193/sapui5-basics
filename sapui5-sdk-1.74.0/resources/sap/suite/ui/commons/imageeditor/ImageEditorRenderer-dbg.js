sap.ui.define([
		"sap/ui/Device"
	],
	function(Device) {
		"use strict";

		var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");

		/**
		 * @class ImageEditor renderer
		 * @static
		 */
		var ImageEditorRenderer = {};

		var HANDLER_CLASSES = {
			nw: {
				vertical: "sapSuiteUiCommonsImageEditorTop",
				horizontal: "sapSuiteUiCommonsImageEditorLeft",
				handlers: ["Horizontal", "Vertical"],
				types: ["Rectangle", "CustomShape"]
			},
			ne: {
				vertical: "sapSuiteUiCommonsImageEditorTop",
				horizontal: "sapSuiteUiCommonsImageEditorRight",
				handlers: ["Horizontal", "Vertical"],
				types: ["Rectangle", "CustomShape"]
			},
			sw: {
				vertical: "sapSuiteUiCommonsImageEditorBottom",
				horizontal: "sapSuiteUiCommonsImageEditorLeft",
				handlers: ["Horizontal", "Vertical"],
				types: ["Rectangle", "CustomShape"]
			},
			se: {
				vertical: "sapSuiteUiCommonsImageEditorBottom",
				horizontal: "sapSuiteUiCommonsImageEditorRight",
				handlers: ["Horizontal", "Vertical"],
				types: ["Rectangle", "CustomShape"]
			},
			n: {
				vertical: "sapSuiteUiCommonsImageEditorTop",
				horizontal: "sapSuiteUiCommonsImageEditorCenter",
				handlers: ["Horizontal"],
				types: ["Rectangle", "CustomShape", "Ellipse"]
			},
			s: {
				vertical: "sapSuiteUiCommonsImageEditorBottom",
				horizontal: "sapSuiteUiCommonsImageEditorCenter",
				handlers: ["Horizontal"],
				types: ["Rectangle", "CustomShape", "Ellipse"]
			},
			w: {
				vertical: "sapSuiteUiCommonsImageEditorMiddle",
				horizontal: "sapSuiteUiCommonsImageEditorLeft",
				handlers: ["Vertical"],
				types: ["Rectangle", "CustomShape", "Ellipse"]
			},
			e: {
				vertical: "sapSuiteUiCommonsImageEditorMiddle",
				horizontal: "sapSuiteUiCommonsImageEditorRight",
				handlers: ["Vertical"],
				types: ["Rectangle", "CustomShape", "Ellipse"]
			}
		};

		ImageEditorRenderer.render = function(oRm, oControl) {
			oRm.write("<div");
			oRm.addClass("sapSuiteUiCommonsImageEditor");
			oRm.addClass("sapSuiteUiCommonsImageEditorEmpty");
			oRm.addClass("sapSuiteUiCommonsImageEditorMode" + oControl.getMode());

			if (oControl.getCustomShapeLoaded()){
				oRm.addClass("sapSuiteUiCommonsImageEditorModeCropCustomShapeLoaded");
			}

			oRm.writeClasses();
			oRm.writeControlData(oControl);
			oRm.write(">");

			this.renderNoData(oRm, oControl);

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-canvasInnerContainer");
			oRm.writeAttribute("tabindex", "0");
			oRm.writeAttribute("role", "img");
			oRm.addClass("sapSuiteUiCommonsImageEditorCanvasInnerContainer");
			oRm.writeClasses();
			oRm.write(">");

			this.renderTransformHandlers(oRm);
			this.renderSvgOverlay(oRm, oControl);
			this.renderCropArea(oRm, oControl);
			// this.renderZones(oRm, oControl);

			oRm.write("</div>"); // close canvasInnerContainer
			oRm.write("</div>"); // close ImageEditor
		};

		ImageEditorRenderer.renderNoData = function(oRm, oControl) {
			oRm.write("<div");
			oRm.addClass("sapSuiteUiCommonsImageEditorNoData");
			oRm.writeClasses();
			oRm.writeAttribute("tabindex", "0");
			oRm.writeAttribute("aria-label", oResourceBundle.getText("IMGEDITOR_NO_IMAGE"));
			oRm.write(">");

				oRm.write("<div");
				oRm.addClass("sapSuiteUiCommonsImageEditorNoDataText");
				oRm.writeClasses();
				oRm.write(">");
				oRm.write(oResourceBundle.getText("IMGEDITOR_NO_IMAGE"));
				oRm.write("</div>");

			oRm.write("</div>");
		};

		ImageEditorRenderer.renderSvgOverlay = function(oRm, oControl) {
			oRm.write("<svg class='sapSuiteUiCommonsImageEditorCropOverlayContainer'>");
			// define mask for different crop shapes and overlay area
			oRm.write("<defs>");
			// rect crop area shape
			oRm.write("<rect id='" + oControl.getId() + "-overlayMaskRect'/>"); // box size is rendered after rendering
			// ellipse crop area shape
			oRm.write("<ellipse id='" + oControl.getId() + "-overlayMaskEllipse'/>"); // box size is rendered after rendering

			// color of the rendered custom shapes cannot be change throught css, has to be rendered once in black and once in white color
			// custom image area shape in black color for masking the area out
			oRm.write("<image xmlns:xlink='http://www.w3.org/1999/xlink' id='" + oControl.getId() + "-overlayMaskCustomBlack' preserveAspectRatio='none' x='0' y='0' width='100%' height='100%'");
			if (oControl._sBlackCustomShapeUrl) {
				oRm.writeAttribute("xlink:href", oControl._sBlackCustomShapeUrl);
			}
			oRm.write("/>");
			// // custom image area shape in black color for masking the area in
			oRm.write("<image xmlns:xlink='http://www.w3.org/1999/xlink' id='" + oControl.getId() + "-overlayMaskCustomWhite' preserveAspectRatio='none' x='0' y='0' width='100%' height='100%'");
			if (oControl._sWhiteCustomShapeUrl) {
				oRm.writeAttribute("xlink:href", oControl._sWhiteCustomShapeUrl);
			}
			oRm.write("/>");

			// mask that keeps the black overlay on the whole image but the crop area part
			oRm.write("<mask");
			oRm.writeAttribute("id", oControl.getId() + "-darkOverlayMask");
			oRm.write(">");
			oRm.write("<rect"); // x,y properties doesn't work in some browsers as css value
			oRm.writeAttribute("fill", "white");
			oRm.writeAttribute("x", "0");
			oRm.writeAttribute("y", "0");
			oRm.writeAttribute("width", "100%");
			oRm.writeAttribute("height", "100%");
			oRm.write("/>");
			// use hiding classes on <use> element instead of on its original so that they are correctly applied in FF https://stackoverflow.com/a/48368084
			oRm.write("<use fill='black' href='#" + oControl.getId() + "-overlayMaskRect" + "' class='sapSuiteUiCommonsImageEditorCropItemRectangle'/>");
			oRm.write("<use fill='black' href='#" + oControl.getId() + "-overlayMaskEllipse" + "' class='sapSuiteUiCommonsImageEditorCropItemEllipse'/>");
			oRm.write("<use href='#" + oControl.getId() + "-overlayMaskCustomBlack" + "' class='sapSuiteUiCommonsImageEditorCropItemCustomShape'/>");
			oRm.write("</mask>");

			// mask that keeps the white overlay only on the crop area part
			oRm.write("<mask");
			oRm.writeAttribute("id", oControl.getId() + "-lightOverlayClip");
			oRm.write(">");
			oRm.write("<use fill='white' href='#" + oControl.getId() + "-overlayMaskRect" + "' class='sapSuiteUiCommonsImageEditorCropItemRectangle'/>");
			oRm.write("<use fill='white' href='#" + oControl.getId() + "-overlayMaskEllipse" + "' class='sapSuiteUiCommonsImageEditorCropItemEllipse'/>");
			oRm.write("<use href='#" + oControl.getId() + "-overlayMaskCustomWhite" + "' class='sapSuiteUiCommonsImageEditorCropItemCustomShape'/>");
			oRm.write("</mask>");
			oRm.write("</defs>");

			// dark overlay
			oRm.write("<rect");
			oRm.writeAttribute("mask", "url(#" + oControl.getId() + "-darkOverlayMask)");
			oRm.writeAttribute("x", "0");
			oRm.writeAttribute("y", "0");
			oRm.writeAttribute("width", "100%");
			oRm.writeAttribute("height", "100%");
			oRm.addClass("sapSuiteUiCommonsImageEditorCropOverlayBlack");
			oRm.writeClasses();
			oRm.write("/>");

			// light overlay
			oRm.write("<rect");
			oRm.writeAttribute("mask", "url(#" + oControl.getId() + "-lightOverlayClip)");
			oRm.writeAttribute("fill", "white");
			oRm.writeAttribute("x", "0");
			oRm.writeAttribute("y", "0");
			oRm.writeAttribute("width", "100%");
			oRm.writeAttribute("height", "100%");
			oRm.addClass("sapSuiteUiCommonsImageEditorCropOverlayWhite");
			oRm.writeClasses();
			oRm.write("/>");

			oRm.write("</svg>");
		};

		ImageEditorRenderer.renderCropArea = function(oRm, oControl) {
			oRm.write("<div class='sapSuiteUiCommonsImageEditorCropInnerRectangle'>");

			oRm.write("<svg class='sapSuiteUiCommonsImageEditorCropSvg'>");
			oRm.write("<defs>");
			// chrome has some weird problem with redrawing some svg masks
			// objectBoundingBox has to be used so the mask is correctly redrawn on resize
			oRm.write("<mask id='" + oControl.getId() + "-thirdsMask" + "' maskContentUnits='objectBoundingBox'>");
			oRm.write("<rect class='sapSuiteUiCommonsImageEditorCropItemRectangle' fill='white' width='1' height='1' />");
			oRm.write("<ellipse class='sapSuiteUiCommonsImageEditorCropItemEllipse' fill='white' cx='0.5' cy='0.5' rx='0.5' ry='0.5' />");
			oRm.write("</mask>");

			// border shadows
			this.renderShadowFilter(oRm, oControl.getId() + "-bottomShadow", 0, 2);
			this.renderShadowFilter(oRm, oControl.getId() + "-topShadow", 0, -2);
			this.renderShadowFilter(oRm, oControl.getId() + "-rightShadow", 2, 0);
			this.renderShadowFilter(oRm, oControl.getId() + "-leftShadow", -2, 0);

			oRm.write("</defs>");

			// elipse crop area border
			oRm.write("<ellipse class='sapSuiteUiCommonsImageEditorCropItemEllipse' fill='transparent' stroke-width='1' stroke='white' cx='50%' cy='50%' rx='50%' ry='50%' />");

			// rectangle crop area borders
			this.renderRectBorders(oRm, oControl);
			// lines showing the thirds
			this.renderThirdLines(oRm, oControl);

			oRm.write("</svg>");

			this.renderCropAreaDragHandler(oRm, oControl);
			this.renderCropAreaResizeHandlers(oRm);

			oRm.write("</div>");
		};

		ImageEditorRenderer.renderZones = function(oRm, oControl) {
			oRm.write("<div class='sapSuiteUiCommonsImageEditorZones'>");

			oControl.getZones().forEach(function(oZone) {
				this.renderZone(oRm, oControl, oZone);
			}, this);
			oRm.write("</div>");
		};

		ImageEditorRenderer.renderZone = function(oRm, oControl, oZone) {
			oRm.write("<div");
			oRm.writeElementData(oZone);
			oRm.addClass("sapSuiteUiCommonsImageEditorZone");

			if (oZone.getEditable()) {
				oRm.addClass("sapSuiteUiCommonsImageEditorZoneEditable");
			}

			if (oZone.getHighlighted()) {
				oRm.addClass("sapSuiteUiCommonsImageEditorZoneHighlighted");
			}

			// box size not rendered here because it is done in onAfterRendering

			oRm.writeStyles();
			oRm.writeClasses();
			oRm.write(">");

			// inner zone takes in account padding of the parent
			oRm.write("<div class='sapSuiteUiCommonsImageEditorZoneInner'>");
			if (!oZone.getEditable() && !oZone.getHighlighted()) {
				oRm.write("<div class='sapSuiteUiCommonsImageEditorZoneInnerColoring'></div>");
			}

			if (oZone.getHighlighted()) {
				oRm.write("<div class='sapSuiteUiCommonsImageEditorZoneLabel'>");
				// text has to be written inside span, i think for ellipsis overflow to work correctly in flex?
				oRm.write("<span>");
				oRm.writeEscaped(oZone.getLabel());
				oRm.write("</span>");
				oRm.write("</div>");
			}

			if (oZone.getEditable()) {
				// svg double colored border
				this.renderBWBorder(oRm);
			}
			oRm.write("</div>");

			// handlers are outside of the inner zone, ignoring the parent padding
			if (oZone.getEditable()) {
				this.renderZoneResizeHandlers(oRm);
			}

			oRm.write("</div>");
		};

		ImageEditorRenderer.renderBWBorder = function(oRm) {
			oRm.write("<svg class='sapSuiteUiCommonsImageEditorZoneEditBorder' x='0' y='0' width='100%' height='100%'>");
			this.renderStrokeRect(oRm, "black", 5, 5, 5, 0.5);
			this.renderStrokeRect(oRm, "white", 5, 5, 0, 0.5);
			oRm.write("</svg>");
		};

		ImageEditorRenderer.renderStrokeRect = function(oRm, sColor, iDashArrayFilled, iDashArraySpace, fOffset, fDuration) {
			oRm.write("<rect x='0' y='0' width='100%' height='100%' fill='none'");
			oRm.writeAttribute("stroke", sColor);
			oRm.writeAttribute("stroke-dasharray", iDashArrayFilled + "," + iDashArraySpace);
			oRm.write(">");
			oRm.write("<animate attributeName='stroke-dashoffset' repeatCount='indefinite'");
			oRm.writeAttribute("from", fOffset);
			oRm.writeAttribute("to", fOffset + iDashArrayFilled + iDashArraySpace);
			oRm.writeAttribute("dur", fDuration);
			oRm.write("></animate>");
			oRm.write("</rect>");
		};

		ImageEditorRenderer.renderShadowFilter = function(oRm, sId, iDx, iDy) {
			oRm.write("<filter");
			oRm.writeAttribute("id", sId);
			oRm.writeAttribute("x", "0");
			oRm.writeAttribute("y", "0");
			oRm.writeAttribute("width", "100%");
			oRm.writeAttribute("height", "100%");
			oRm.writeAttribute("filterUnits", "userSpaceOnUse");
			oRm.write(">");
			oRm.write("<feGaussianBlur");
			oRm.writeAttribute("in", "SourceAlpha");
			oRm.writeAttribute("stdDeviation", "2");
			oRm.writeAttribute("result", "blur");
			oRm.write("/>");
			oRm.write("<feOffset");
			oRm.writeAttribute("in", "blur");
			oRm.writeAttribute("result", "offOut");
			oRm.writeAttribute("x", iDx);
			oRm.writeAttribute("y", iDy);
			oRm.write("/>");
			oRm.write("<feBlend");
			oRm.writeAttribute("in", "SourceGraphic");
			oRm.writeAttribute("in2", "offOut");
			oRm.writeAttribute("mode", "normal");
			oRm.write("/>");
			oRm.write("</filter>");
		};

		ImageEditorRenderer.renderRectBorders = function(oRm, oControl) {
			oRm.write("<g class='sapSuiteUiCommonsImageEditorCropItemRectangle sapSuiteUiCommonsImageEditorCropItemCustomShape'>");
			this.renderCropLine(oRm, oControl, "bottomShadow", 0, 0, 100, 0);
			this.renderCropLine(oRm, oControl, "leftShadow", 100, 0, 100, 100);
			this.renderCropLine(oRm, oControl, "topShadow", 100, 100, 0, 100);
			this.renderCropLine(oRm, oControl, "rightShadow", 0, 100, 0, 0);
			oRm.write("</g>");
		};

		ImageEditorRenderer.renderThirdLines = function(oRm, oControl) {
			oRm.write("<g mask='url(#" + oControl.getId() + "-thirdsMask)' class='sapSuiteUiCommonsImageEditorCropThirds'>");
			this.renderCropLine(oRm, oControl, "rightShadow", 100 / 3, 0, 100 / 3, 100);
			this.renderCropLine(oRm, oControl, "rightShadow", 100 * 2 / 3, 0, 100 * 2 / 3, 100);
			this.renderCropLine(oRm, oControl, "bottomShadow", 0, 100 / 3, 100, 100 / 3);
			this.renderCropLine(oRm, oControl, "bottomShadow", 0, 100 * 2 / 3, 100, 100 * 2 / 3);
			oRm.write("</g>");
		};

		ImageEditorRenderer.renderCropLine = function(oRm, oControl, sFilter, fX1, fY1, fX2, fY2) {
			oRm.write("<line class='sapSuiteUiCommonsImageEditorCropLine'");

			// filter causes straight lines to disappear in ie/edge
			if (!Device.browser.msie && !Device.browser.edge) {
				oRm.writeAttribute("filter", "url(#" + oControl.getId() + "-" + sFilter + ")");
			}

			oRm.writeAttribute("x1", fX1 + "%");
			oRm.writeAttribute("y1", fY1 + "%");
			oRm.writeAttribute("x2", fX2 + "%");
			oRm.writeAttribute("y2", fY2 + "%");
			oRm.write("/>");
		};

		ImageEditorRenderer.renderTransformHandlers = function(oRm) {
			oRm.write("<div class='sapSuiteUiCommonsImageEditorTransformHandlers'>");
			Object.keys(HANDLER_CLASSES).forEach(function(sKey) {
				this.renderTransformHandler(oRm, sKey);
			}, this);
			oRm.write("</div>");
		};

		ImageEditorRenderer.renderTransformHandler = function(oRm, sDirection) {
			var oHandlerClasses = HANDLER_CLASSES[sDirection],
				aClasses;

			oRm.write("<div");

			aClasses = this.getCommonHandlerClasses(sDirection);
			aClasses.push("sapSuiteUiCommonsImageEditorHandlerContainer");

			aClasses.forEach(function(sClass) {
				oRm.addClass(sClass);
			});

			oRm.writeClasses();
			oRm.write(">");

			oHandlerClasses.handlers.forEach(function(sHandler) {
				this.renderDiv(oRm, ["sapSuiteUiCommonsImageEditorHandler", "sapSuiteUiCommonsImageEditorHandler" + sHandler]);
			}, this);

			oRm.write("</div>");
		};

		ImageEditorRenderer.renderCropAreaDragHandler = function(oRm, oControl) {
			var oIcon = oControl._getCropAreaDragIcon();

			oRm.write("<div");
			oRm.addClass("sapSuiteUiCommonsImageEditorDragHandlerContainer");
			oRm.writeClasses();
			oRm.write(">");

			oRm.renderControl(oIcon);

			oRm.write("</div>");
		};

		ImageEditorRenderer.renderCropAreaResizeHandlers = function(oRm) {
			Object.keys(HANDLER_CLASSES).forEach(function(sKey) {
				this.renderCropAreaResizeHandler(oRm, sKey);
			}, this);
		};

		ImageEditorRenderer.renderCropAreaResizeHandler = function(oRm, sDirection) {
			var oHandlerClasses = HANDLER_CLASSES[sDirection],
				aClasses;

			oRm.write("<div");

			aClasses = this.getCommonHandlerClasses(sDirection);
			aClasses.push("sapSuiteUiCommonsImageEditorHandlerContainer");
			oHandlerClasses.types.forEach(function(sType) {
				aClasses.push("sapSuiteUiCommonsImageEditorCropItem" + sType);
			});

			aClasses.forEach(function(sClass) {
				oRm.addClass(sClass);
			});

			oRm.writeClasses();
			oRm.write(">");

			oHandlerClasses.handlers.forEach(function(sHandler) {
				this.renderDiv(oRm, ["sapSuiteUiCommonsImageEditorHandler", "sapSuiteUiCommonsImageEditorHandler" + sHandler]);
			}, this);

			oRm.write("</div>");
		};

		ImageEditorRenderer.renderDiv = function(oRm, aClasses) {
			oRm.write("<div");

			aClasses.forEach(function(sClass) {
				oRm.addClass(sClass);
			});

			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");
		};

		ImageEditorRenderer.renderZoneResizeHandlers = function(oRm) {
			Object.keys(HANDLER_CLASSES).forEach(function(sKey) {
				this.renderZoneResizeHandler(oRm, sKey);
			}, this);
		};

		ImageEditorRenderer.renderZoneResizeHandler = function(oRm, sDirection) {
			var aClasses = this.getCommonHandlerClasses(sDirection);
			aClasses.push("sapSuiteUiCommonsImageEditorZoneResizeHandler");

			this.renderDiv(oRm, aClasses);
		};

		ImageEditorRenderer.getCommonHandlerClasses = function(sDirection) {
			var oHandlerClasses = HANDLER_CLASSES[sDirection];

			return ["ui-resizable-handle", "ui-resizable-" + sDirection,
				oHandlerClasses.vertical, oHandlerClasses.horizontal];
		};

		return ImageEditorRenderer;

	}, /* bExport= */ true);

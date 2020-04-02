/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides a class for the redlining ellipse elements.
sap.ui.define([
	"jquery.sap.global",
	"./RedlineElement",
	"./Redline"
], function(
	jQuery,
	RedlineElement,
	Redline
) {
	"use strict";

	/**
	 * Redline element control for ellipse.
	 *
	 * @class Provides a control for creating ellipse redline elements.
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.vk.RedlineElement
	 * @alias sap.ui.vk.RedlineElementEllipse
	 * @since 1.40.0
	 */

	var RedlineElementEllipse = RedlineElement.extend("sap.ui.vk.RedlineElementEllipse", {
		metadata: {
			library: "sap.ui.vk",
			properties: {
				radiusX: {
					type: "float",
					defaultValue: 0.0001
				},
				radiusY: {
					type: "float",
					defaultValue: 0.0001
				},
				fillColor: {
					type: "sap.ui.core.CSSColor",
					defaultValue: "rgba(0, 0, 0, 0)"
				}
			}
		}
	});

	/**
	 * Changes the current radiusX and radiusY of the ellipse redline element with the values passed as parameters.
	 * @param {number} offsetX The value in pixels that will be set as radiusX for the ellipse.
	 * @param {number} offsetY The value in pixels that will be set as radiusY for the ellipse.
	 * @returns {sap.ui.vk.RedlineElementEllipse} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementEllipse.prototype.edit = function(offsetX, offsetY) {
		var parent = this.getParent(),
			translated = parent._toVirtualSpace(offsetX, offsetY),
			radiusX = translated.x - this.getOriginX(),
			radiusY = translated.y - this.getOriginY();

		this.setRadiusX(radiusX > 0 ? radiusX : -radiusX);
		this.setRadiusY(radiusY > 0 ? radiusY : -radiusY);
		return this;
	};

	/**
	 * Changes the current radiusX and radiusY of the ellipse redline element by a factor which gets passed as parameter.
	 * @param {number} zoomBy The factor to be applied to the current radiusX and radiusY.
	 * @returns {sap.ui.vk.RedlineElementEllipse} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementEllipse.prototype.applyZoom = function(zoomBy) {
		this.setProperty("radiusX", this.getRadiusX() * zoomBy, true);
		this.setProperty("radiusY", this.getRadiusY() * zoomBy, true);
		return this;
	};

	RedlineElementEllipse.prototype.setRadiusX = function(radiusX) {
		this.setProperty("radiusX", radiusX, true);
		var domRef = this.getDomRef();
		if (domRef) {
			domRef.setAttribute("rx", this.getParent()._toPixelSpace(radiusX));
		}
	};

	RedlineElementEllipse.prototype.setRadiusY = function(radiusY) {
		this.setProperty("radiusY", radiusY, true);
		var domRef = this.getDomRef();
		if (domRef) {
			domRef.setAttribute("ry", this.getParent()._toPixelSpace(radiusY));
		}
	};

	RedlineElementEllipse.prototype.renderElement = function(renderManager, halo) {

		var parent = this.getParent();

		renderManager.write("<ellipse");
		renderManager.writeElementData(this);
		var origin = parent._toPixelSpace(this.getOriginX(), this.getOriginY());
		renderManager.writeAttribute("cx", origin.x);
		renderManager.writeAttribute("cy", origin.y);
		renderManager.writeAttribute("rx", parent._toPixelSpace(this.getRadiusX()));
		renderManager.writeAttribute("ry", parent._toPixelSpace(this.getRadiusY()));
		renderManager.writeAttribute("fill", this.getFillColor());
		renderManager.writeAttribute("stroke", this.getStrokeColor());
		renderManager.writeAttribute("stroke-width", this.getStrokeWidth());
		if (this.getStrokeDashArray().length > 0) {
			renderManager.writeAttribute("stroke-dasharray", this.getStrokeDashArray().toString());
		}
		renderManager.writeAttribute("opacity", this.getOpacity());
		if (halo) {
			renderManager.writeAttribute("filter", "url(#halo)");
		}
		renderManager.write("></ellipse>");

	};

	/**
	 * Exports all the relevant data contained in the ellipse redline element to a JSON object.
	 * @returns {object} Data that can be serialized and later used to restore the ellipse redline element.
	 * @public
	 */
	RedlineElementEllipse.prototype.exportJSON = function() {

		return jQuery.extend(true, RedlineElement.prototype.exportJSON.call(this), {
			type: Redline.ElementType.Ellipse,
			version: 1,
			radiusX: this.getRadiusX(),
			radiusY: this.getRadiusY(),
			fillColor: this.getFillColor()
		});
	};

	/**
	 * Imports data from a JSON object into the ellipse redline element.
	 * @param {object} json Relevant data used to restore the ellipse redline element.
	 * @returns {sap.ui.vk.RedlineElementEllipse} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementEllipse.prototype.importJSON = function(json) {
		if (json.type === Redline.ElementType.Ellipse) {
			if (json.version === 1) {

				RedlineElement.prototype.importJSON.call(this, json);

				if (json.hasOwnProperty("radiusX")) {
					this.setRadiusX(json.radiusX);
				}

				if (json.hasOwnProperty("radiusY")) {
					this.setRadiusY(json.radiusY);
				}

				if (json.hasOwnProperty("fillColor")) {
					this.setFillColor(json.fillColor);
				}

			} else {
				// TO DO error version number
				jQuery.sap.log.error("wrong version number");
			}
		} else {
			jQuery.sap.log.error("Redlining JSON import: Wrong element type");
		}

		return this;
	};

	/**
	 * Exports all the relevant data contained in the ellipse redline element to an SVG ellipse element.
	 * @returns {object} SVG ellipse element that can be used to restore the ellipse redline element.
	 * @public
	 */
	RedlineElementEllipse.prototype.exportSVG = function() {
		var element = document.createElementNS(Redline.svgNamespace, "ellipse");

		element.setAttribute("x", this.getOriginX());
		element.setAttribute("y", this.getOriginY());
		element.setAttribute("rx", this.getRadiusX());
		element.setAttribute("ry", this.getRadiusY());
		element.setAttribute("fill", this.getFillColor());
		element.setAttribute("stroke", this.getStrokeColor());
		element.setAttribute("stroke-width", this.getStrokeWidth());
		if (this.getStrokeDashArray().length > 0) {
			element.setAttribute("stroke-dasharray", this.getStrokeDashArray().toString());
		}
		if (this.getOpacity() < 1) {
			element.setAttribute("opacity", this.getOpacity());
		}
		element.setAttribute("data-sap-element-id", this.getElementId());
		element.setAttribute("data-sap-halo", this.getHalo());

		return element;
	};

	/**
	 * Imports data from an SVG ellipse element into the ellipse redline element.
	 * @param {object} svg SVG ellipse element used to restore the ellipse redline element.
	 * @returns {sap.ui.vk.RedlineElementEllipse} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementEllipse.prototype.importSVG = function(svg) {
		if (svg.tagName === "ellipse") {
			RedlineElement.prototype.importSVG.call(this, svg);

			if (svg.getAttribute("rx")) {
				this.setRadiusX(parseFloat(svg.getAttribute("rx")));
			}

			if (svg.getAttribute("ry")) {
				this.setRadiusY(parseFloat(svg.getAttribute("ry")));
			}

			if (svg.getAttribute("fill")) {
				this.setFillColor(svg.getAttribute("fill"));
			}
		} else {
			jQuery.sap.log("Redlining SVG import: Wrong element type");
		}

		return this;
	};

	return RedlineElementEllipse;
});

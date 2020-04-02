/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides a class for the redlining line elements.
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
	 * Redline element control for line.
	 *
	 * @class Provides a control for creating line redline elements.
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.vk.RedlineElement
	 * @alias sap.ui.vk.RedlineElementLine
	 * @since 1.40.0
	 */

	var RedlineElementLine = RedlineElement.extend("sap.ui.vk.RedlineElementLine", {
		metadata: {
			library: "sap.ui.vk",
			properties: {
				deltaX: {
					type: "float",
					defaultValue: 0
				},
				deltaY: {
					type: "float",
					defaultValue: 0
				}
			}
		}
	});

	/**
	 * Changes the current deltaX and deltaY of the line redline element with the values passed as parameters.
	 * @param {number} offsetX The value in pixels that will be set as deltaX for the line.
	 * @param {number} offsetY The value in pixels that will be set as deltaY for the line.
	 * @returns {sap.ui.vk.RedlineElementLine} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementLine.prototype.edit = function(offsetX, offsetY) {
		var parent = this.getParent(),
			translated = parent._toVirtualSpace(offsetX, offsetY);

		this.setDeltaX(translated.x - this.getOriginX());
		this.setDeltaY(translated.y - this.getOriginY());
		return this;
	};

	/**
	 * Changes the current deltaX and deltaY of the line redline element by a factor which gets passed as parameter.
	 * @param {number} zoomBy The factor to be applied to the current deltaX and deltaY.
	 * @returns {sap.ui.vk.RedlineElementLine} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementLine.prototype.applyZoom = function(zoomBy) {
		this.setProperty("deltaX", this.getDeltaX() * zoomBy);
		this.setProperty("deltaY", this.getDeltaY() * zoomBy);
		return this;
	};

	RedlineElementLine.prototype.getP2 = function(value) {
		return this.getParent()._toPixelSpace(this.getOriginX() + this.getDeltaX(), this.getOriginY() + this.getDeltaY());
	};

	RedlineElementLine.prototype.setDeltaX = function(value) {
		this.setProperty("deltaX", value);
		var domRef = this.getDomRef();
		if (domRef) {
			domRef.setAttribute("x2", this.getP2().x);
		}
	};

	RedlineElementLine.prototype.setDeltaY = function(value) {
		this.setProperty("deltaY", value);
		var domRef = this.getDomRef();
		if (domRef) {
			domRef.setAttribute("y2", this.getP2().y);
		}
	};

	RedlineElementLine.prototype.renderElement = function(renderManager, halo) {
		var p1 = this.getParent()._toPixelSpace(this.getOriginX(), this.getOriginY());
		var p2 = this.getP2();
		renderManager.write("<line");
		renderManager.writeElementData(this);
		renderManager.writeAttribute("x1", p1.x);
		renderManager.writeAttribute("y1", p1.y);
		renderManager.writeAttribute("x2", p2.x);
		renderManager.writeAttribute("y2", p2.y);
		renderManager.writeAttribute("stroke", this.getStrokeColor());
		renderManager.writeAttribute("stroke-width", this.getStrokeWidth());
		if (this.getStrokeDashArray().length > 0) {
			renderManager.writeAttribute("stroke-dasharray", this.getStrokeDashArray().toString());
		}
		renderManager.writeAttribute("opacity", this.getOpacity());
		if (halo) {
			renderManager.writeAttribute("filter", "url(#halo)");
		}
		renderManager.write("></line>");
	};

	/**
	 * Exports all the relevant data contained in the line redline element to a JSON object.
	 * @returns {object} Data that can be serialized and later used to restore the line redline element.
	 * @public
	 */
	RedlineElementLine.prototype.exportJSON = function() {
		return jQuery.extend(true, RedlineElement.prototype.exportJSON.call(this), {
			type: Redline.ElementType.Line,
			version: 1,
			deltaX: this.getDeltaX(),
			deltaY: this.getDeltaY()
		});
	};

	/**
	 * Imports data from a JSON object into the line redline element.
	 * @param {object} json Relevant data used to restore the line redline element.
	 * @returns {sap.ui.vk.RedlineElementLine} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementLine.prototype.importJSON = function(json) {
		if (json.type === Redline.ElementType.Line) {
			if (json.version === 1) {
				RedlineElement.prototype.importJSON.call(this, json);

				if (json.hasOwnProperty("deltaX")) {
					this.setDeltaX(json.deltaX);
				}

				if (json.hasOwnProperty("deltaY")) {
					this.setDeltaY(json.deltaY);
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
	 * Exports all the relevant data contained in the line redline element to an SVG line element.
	 * @returns {object} SVG line element that can be used to restore the line redline element.
	 * @public
	 */
	RedlineElementLine.prototype.exportSVG = function() {
		var element = document.createElementNS(Redline.svgNamespace, "line");

		element.setAttribute("x1", this.getOriginX());
		element.setAttribute("y1", this.getOriginY());
		element.setAttribute("x2", this.getOriginX() + this.getDeltaX());
		element.setAttribute("y2", this.getOriginY() + this.getDeltaY());
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
	 * Imports data from an SVG line element into the line redline element.
	 * @param {object} svg SVG line element used to restore the line redline element.
	 * @returns {sap.ui.vk.RedlineElementLine} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementLine.prototype.importSVG = function(svg) {
		if (svg.tagName === "line") {
			RedlineElement.prototype.importSVG.call(this, svg);

			if (svg.getAttribute("x1")) {
				this.setOriginX(parseFloat(svg.getAttribute("x1")));
			}

			if (svg.getAttribute("y1")) {
				this.setOriginY(parseFloat(svg.getAttribute("y1")));
			}

			if (svg.getAttribute("x2")) {
				this.setDeltaX(parseFloat(svg.getAttribute("x2")) - this.getOriginX());
			}

			if (svg.getAttribute("y2")) {
				this.setDeltaY(parseFloat(svg.getAttribute("y2")) - this.getOriginY());
			}
		} else {
			jQuery.sap.log("Redlining SVG import: Wrong element type");
		}

		return this;
	};

	return RedlineElementLine;
});

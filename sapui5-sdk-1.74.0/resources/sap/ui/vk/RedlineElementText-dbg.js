/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides a class for the redlining text elements.
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
	 * Redline element control for text.
	 *
	 * @class Provides a control for creating text redline elements.
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.vk.RedlineElement
	 * @alias sap.ui.vk.RedlineElementText
	 * @since 1.40.0
	 */

	var RedlineElementText = RedlineElement.extend("sap.ui.vk.RedlineElementText", {
		metadata: {
			library: "sap.ui.vk",
			properties: {
				text: {
					type: "string",
					defaultValue: "Text"
				},
				font: {
					type: "string",
					defaultValue: ""
				},
				fontSize: {
					type: "float",
					defaultValue: 32
				},
				fillColor: {
					type: "sap.ui.core.CSSColor",
					defaultValue: "rgba(0,0,0,0)"
				}
			}
		}
	});

	/**
	 * Changes the current originX and originY of the text redline element with the values passed as parameters.
	 * @param {number} posX The value in pixels that will be set as originX for the text.
	 * @param {number} posY The value in pixels that will be set as originY for the text.
	 * @returns {sap.ui.vk.RedlineElementText} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementText.prototype.edit = function(posX, posY) {
		var parent = this.getParent(),
			pos = parent._toVirtualSpace(posX, posY);

		this.setOriginX(pos.x);
		this.setOriginY(pos.y);
		return this;
	};

	/**
	 * Changes the current font size of the text redline element by a factor which gets passed as parameter.
	 * @param {number} zoomBy The factor to be applied to the current font size.
	 * @returns {sap.ui.vk.RedlineElementText} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementText.prototype.applyZoom = function(zoomBy) {
		this.setFontSize(this.getFontSize() * zoomBy);
		return this;
	};

	RedlineElementText.prototype.renderElement = function(renderManager, halo) {
		var pos = this.getParent()._toPixelSpace(this.getOriginX(), this.getOriginY());
		renderManager.write("<text");
		renderManager.writeElementData(this);
		renderManager.writeAttribute("x", pos.x);
		renderManager.writeAttribute("y", pos.y);
		if (this.getFont()) {
			renderManager.writeAttribute("font-family", this.getFont());
		}
		renderManager.writeAttribute("font-size", this.getFontSize());
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
		renderManager.write(">");
		renderManager.write(this.getText());
		renderManager.write("</text>");
	};

	/**
	 * Exports all the relevant data contained in the text redline element to a JSON object.
	 * @returns {object} Data that can be serialized and later used to restore the text redline element.
	 * @public
	 */
	RedlineElementText.prototype.exportJSON = function() {
		return jQuery.extend(true, RedlineElement.prototype.exportJSON.call(this), {
			type: Redline.ElementType.Text,
			version: 1,
			text: this.getText(),
			font: this.getFont(),
			fontSize: this.getFontSize(),
			fillColor: this.getFillColor()
		});
	};

	/**
	 * Imports data from a JSON object into the text redline element.
	 * @param {object} json Relevant data used to restore the text redline element.
	 * @returns {sap.ui.vk.RedlineElementText} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementText.prototype.importJSON = function(json) {
		if (json.type === Redline.ElementType.Text) {
			if (json.version === 1) {
				RedlineElement.prototype.importJSON.call(this, json);

				if (json.hasOwnProperty("text")) {
					this.setText(json.text);
				}

				if (json.hasOwnProperty("font")) {
					this.setFont(json.font);
				}

				if (json.hasOwnProperty("fontSize")) {
					this.setFontSize(json.fontSize);
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
	 * Exports all the relevant data contained in the text redline element to an SVG text element.
	 * @returns {object} SVG text element that can be used to restore the text redline element.
	 * @public
	 */
	RedlineElementText.prototype.exportSVG = function() {
		var element = document.createElementNS(Redline.svgNamespace, "text");

		element.setAttribute("x", this.getOriginX());
		element.setAttribute("y", this.getOriginY());
		if (this.getFont()) {
			element.setAttribute("font-family", this.getFont());
		}
		element.setAttribute("font-size", this.getFontSize());
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
		element.textContent = this.getText();

		return element;
	};

	/**
	 * Imports data from an SVG text element into the text redline element.
	 * @param {object} element SVG text element used to restore the text redline element.
	 * @returns {sap.ui.vk.RedlineElementText} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElementText.prototype.importSVG = function(element) {
		if (element.tagName === "text") {
			RedlineElement.prototype.importSVG.call(this, element);

			if (element.getAttribute("x")) {
				this.setOriginX(parseFloat(element.getAttribute("x")));
			}

			if (element.getAttribute("y")) {
				this.setOriginY(parseFloat(element.getAttribute("y")));
			}

			if (element.getAttribute("text")) {
				this.setText(element.getAttribute("text"));
			}

			if (element.getAttribute("font-family")) {
				this.setFont(element.getAttribute("font-family"));
			}

			if (element.getAttribute("font-size")) {
				this.setFontSize(parseFloat(element.getAttribute("font-size")));
			}

			if (element.getAttribute("fill")) {
				this.setFillColor(element.getAttribute("fill"));
			}
		} else {
			jQuery.sap.log("Redlining SVG import: Wrong element type");
		}

		return this;
	};

	return RedlineElementText;
});

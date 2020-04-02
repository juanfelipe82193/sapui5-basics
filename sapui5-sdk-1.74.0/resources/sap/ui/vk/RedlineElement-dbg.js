/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides a class for the redlining elements.
sap.ui.define([
	"sap/ui/core/Element"
], function(
	Element
) {
	"use strict";
		/**
		 * Base class for redline elements such as {sap.ui.vk.RedlineElementRectangle}, {sap.ui.vk.RedlineElementEllipse}, {sap.ui.vk.RedlineElementFreehand}, {sap.ui.vk.RedlineElementText}.
		 *
		 * @class Provides a base class for redline elements.
		 *
		 * @public
		 * @author SAP SE
		 * @version 1.74.0
		 * @extends sap.ui.core.Element
		 * @alias sap.ui.vk.RedlineElement
		 * @since 1.40.0
		 */

	var RedlineElement = Element.extend("sap.ui.vk.RedlineElement", {
		metadata: {
			library: "sap.ui.vk",
			properties: {
				elementId: {
					type: "string"
				},
				originX: {
					type: "float",
					defaultValue: 0
				},
				originY: {
					type: "float",
					defaultValue: 0
				},
				opacity: {
					type: "float",
					defaultValue: 1
				},
				strokeWidth: {
					type: "float",
					defaultValue: 2
				},
				strokeColor: {
					type: "sap.ui.core.CSSColor",
					defaultValue: "#e6600d"
				},
				strokeDashArray: {
					type: "float[]",
					defaultValue: []
				},
				halo: {
					type: "boolean",
					defaultValue: false
				}
			}
		}
	});

	RedlineElement.prototype.init = function() {
		var guid = function() {
			var s4 = function() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			};
			return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
		};

		this.setElementId(guid());
	};

	RedlineElement.prototype.applyZoom = function() {

	};

	/**
	 * This method is called by the RenderManager. The current method is empty because this is a base class
	 * and the classes extending this class have their own implementations of the <code>render</code> method.
	 * @param {sap.ui.core.RenderManager} renderManager Instance of RenderManager.
	 * @public
	 */
	RedlineElement.prototype.render = function(renderManager) {
		this.renderElement(renderManager, this.getHalo());
	};

	/**
	 * This method is called by the RenderManager. The current method is empty because this is a base class
	 * and the classes extending this class have their own implementations of the <code>render</code> method.
	 * @param {sap.ui.core.RenderManager} renderManager Instance of RenderManager.
	 * @param {boolean} halo If set to true then halo effect is rendered, otherwise this will do normal object rendering
	 * @protected
	 */
	RedlineElement.prototype.renderElement = function(renderManager, halo) {

	};

	/**
	 * Exports all the relevant data contained in the redline element to a JSON-like object.
	 * @returns {object} JSON Relevant data that can be serialized and later used to restore the redline element.
	 * @public
	 */
	RedlineElement.prototype.exportJSON = function() {
		var json = {
			originX: this.getOriginX(),
			originY: this.getOriginY(),
			opacity: this.getOpacity(),
			strokeColor: this.getStrokeColor(),
			strokeWidth: this.getStrokeWidth(),
			elementId: this.getElementId(),
			halo: this.getHalo()
		};
		if (this.getStrokeDashArray().length > 0) {
			json["strokeDashArray"] = this.getStrokeDashArray();
		}
		return json;
	};

	/**
	 * Imports data from a JSON-like object into the redline element.
	 * @param {object} json Relevant data that can be used to restore the redline element.
	 * @returns {sap.ui.vk.RedlineElement} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElement.prototype.importJSON = function(json) {

		if (json.hasOwnProperty("originX")) {
			this.setOriginX(json.originX);
		}

		if (json.hasOwnProperty("originY")) {
			this.setOriginY(json.originY);
		}

		if (json.hasOwnProperty("opacity")) {
			this.setOpacity(json.opacity);
		}

		if (json.hasOwnProperty("strokeColor")) {
			this.setStrokeColor(json.strokeColor);
		}

		if (json.hasOwnProperty("strokeWidth")) {
			this.setStrokeWidth(json.strokeWidth);
		}

		if (json.hasOwnProperty("strokeDashArray")) {
			this.setStrokeDashArray(json.strokeDashArray);
		}

		if (json.hasOwnProperty("elementId")){
			this.setElementId(json.elementId);
		}

		if (json.hasOwnProperty("halo")) {
			this.setHalo(json.halo);
		}

		return this;
	};

	/**
	 * Exports all the relevant data contained in the redline element to an SVG shape element.
	 * @returns {object} SVG shape element that can be used to restore the redline element.
	 * @public
	 */
	RedlineElement.prototype.exportSVG = function() {
		return null;
	};

	/**
	 * Imports data from an SVG shape element into the redline element.
	 * @param {object} svg SVG shape element that can be used to restore the redline element.
	 * @returns {sap.ui.vk.RedlineElement} <code>this</code> to allow method chaining.
	 * @public
	 */
	RedlineElement.prototype.importSVG = function(svg) {

		if (svg.getAttribute("x")) {
			this.setOriginX(parseFloat(svg.getAttribute("x")));
		}

		if (svg.getAttribute("y")) {
			this.setOriginY(parseFloat(svg.getAttribute("y")));
		}

		if (svg.getAttribute("opacity")) {
			this.setOpacity(parseFloat(svg.getAttribute("opacity")));
		}

		if (svg.getAttribute("stroke")) {
			this.setStrokeColor(svg.getAttribute("stroke"));
		}

		if (svg.getAttribute("stroke-width")) {
			this.setStrokeWidth(parseFloat(svg.getAttribute("stroke-width")));
		}

		if (svg.getAttribute("stroke-dasharray")) {
			this.setStrokeDashArray(svg.getAttribute("stroke-dasharray").split(",").map(parseFloat));
		}

		if (svg.getAttribute("data-sap-element-id")){
			this.setElementId(svg.getAttribute("data-sap-element-id"));
		}

		this.setHalo(svg.getAttribute("data-sap-halo") === "true");

		return this;
	};

	return RedlineElement;
});

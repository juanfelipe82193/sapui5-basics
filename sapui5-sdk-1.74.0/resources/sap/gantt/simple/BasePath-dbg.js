/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseShape", "./RenderUtils"
], function (BaseShape, RenderUtils) {
	"use strict";

	/**
	 * Creates and initializes a new BasePath class.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * BasePath is the generic element to define a shape. All the basic shapes can be created by BasePath
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BasePath
	 */
	var BasePath = BaseShape.extend("sap.gantt.simple.BasePath", /** @lends sap.gantt.simple.BasePath.prototype */ {
		metadata: {
			properties: {
				/**
				 * The d property provides a path definition to be drawn.
				 */
				d: {type: "string"}
			}
		}
	});

	var mAttributes = ["d", "fill", "stroke-dasharray", "transform", "style"];

	/**
	 * Renders the <path> DOM element by RenderManager
	 *
	 * @param {sap.ui.core.RenderManager} oRm A shared RenderManager for GanttChart control
	 * @param {sap.gantt.simple.BasePath} oElement Path to be rendered
	 * @public
	 */
	BasePath.prototype.renderElement = function(oRm, oElement) {
		oRm.write("<path");
		this.writeElementData(oRm);
		oRm.writeClasses(this);
		RenderUtils.renderAttributes(oRm, oElement, mAttributes);
		oRm.writeAttribute("shape-rendering", "crispedges");
		oRm.write(">");
		RenderUtils.renderTooltip(oRm, oElement);
		oRm.write("</path>");

		RenderUtils.renderElementTitle(oRm, oElement);
	};

	return BasePath;
}, true);

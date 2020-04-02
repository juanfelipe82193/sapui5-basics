/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseShape", "./AggregationUtils", "./RenderUtils"
], function (BaseShape, AggregationUtils, RenderUtils) {
	"use strict";

	/**
	 * Creates and initializes a new Group class.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Group shape class using SVG tag 'g'. It is a shape container. Any other shapes can be aggregated under a group.
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseGroup
	 */
	var BaseGroup = BaseShape.extend("sap.gantt.simple.BaseGroup", /** @lends sap.gantt.simple.BaseGroup.prototype */{
		metadata: {
			aggregations: {
				/**
				 * The shapes of the group
				 */
				shapes: {type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "shape"}
			}
		}
	});

	var mAttributes = ["filter", "opacity", "transform"];

	/**
	 * Renders the container with RenderManager recursively
	 *
	 * @param {sap.ui.core.RenderManager} oRm A shared RenderManager for GanttChart control
	 * @param {sap.gantt.simple.BaseGroup} oGroup Group to be rendered
	 * @protected
	 */
	BaseGroup.prototype.renderElement = function(oRm, oGroup) {
		oRm.write("<g");
		this.writeElementData(oRm);
		oRm.writeClasses(this);

		RenderUtils.renderAttributes(oRm, oGroup, mAttributes);

		oRm.write(">");

		RenderUtils.renderTooltip(oRm, oGroup);

		this.renderChildElements(oRm, oGroup);

		oRm.write("</g>");

		// this is a must have for expand shapes
		BaseShape.prototype.renderElement.apply(this, arguments);
	};

	/**
	 * Render oGroup's all non lazy aggregations with RenderManager, ignore lazy aggregations, all the non lazy aggregation hould not have it's own sap-ui-id,
	 * and have the same rowYCenter with it's parent.
	 *
	 * @param {sap.ui.core.RenderManager} oRm A shared RenderManager for GanttChart control
	 * @param {sap.gantt.simple.BaseGroup} oGroup Group to be rendered
	 * @private
	 */
	BaseGroup.prototype.renderChildElements = function(oRm, oGroup) {
		this._eachChildOfGroup(oGroup, function(oChild){
			if (oChild.renderElement) {
				// all non lazy aggregation defined in Group should not have it's own sap-ui-id
				// set childElement to true to supress when write element data
				oChild.setProperty("childElement", true, true);

				// non lazy aggregation has the same rowYCenter with it's parent
				oChild.setProperty("rowYCenter", oGroup.getRowYCenter(), true);
				oChild._iBaseRowHeight = oGroup._iBaseRowHeight;
				oChild.renderElement(oRm, oChild);
			}
		});
	};

	BaseGroup.prototype._eachChildOfGroup = function(oGroup, fnCallback) {
		AggregationUtils.eachNonLazyAggregation(oGroup, fnCallback);
	};

	return BaseGroup;
}, true);

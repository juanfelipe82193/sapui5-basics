/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./BaseShape"
], function (BaseShape) {
	"use strict";

	var PROPAGATED_PROPERTIES = ["rowYCenter", "shapeUid", "selected"];

	/**
	 * Creates and initializes a new <code>BaseConditionalShape</code> class for a simple Gantt chart.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A conditional shape renders one of the {@link sap.gantt.simple.BaseShape} shapes assigned to it using the <code>activeShape</code> property. This allows you
	 * to switch between shapes based on properties from data binding.
	 *
	 * @extends sap.gantt.simple.BaseShape
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 * @since 1.64
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseConditionalShape
	 */
	var BaseConditionalShape = BaseShape.extend("sap.gantt.simple.BaseConditionalShape", {
		metadata: {
			properties: {
				/**
				 * Defines which shape from the <code>shapes</code> aggregation is visible. If you specify a negative value
				 * or a value that is greater than the number of shapes defined, no shape will be rendered.
				 */
				activeShape: {type: "int", defaultValue: 0},

				/**
				 * Specifies whether or not the system takes this shape into account at the bird's eye zoom level.
				 * <br>We suggest that you set this property to <code>true</code> only for shapes that really need to be considered when in the bird's eye view.
				 *
				 * This property is overwritten by property <code>countInBirdEye</code> of the <code>activeShape</code> shape from the <code>shapes</code> aggregation.
				 * <br>For setting this property, use the setter method of the active shape. The getter method returns the property value of the active shape.
				 */
				countInBirdEye: {type: "boolean", defaultValue: false}
			},
			aggregations: {
				/**
				 * A list of base shapes to switch between. Only one of these shapes will be rendered based on the <code>activeShape</code> property.
				 */
				shapes: {type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "shape", sapGanttLazy: true}
			}
		}
	});

	/**
	 * @protected
	 */
	BaseConditionalShape.prototype.renderElement = function (oRm, oElement) {
		var oActiveShape = oElement._getActiveShapeElement();
		if (oActiveShape) {
			oActiveShape._iBaseRowHeight = oElement._iBaseRowHeight;
			oActiveShape.renderElement(oRm, oActiveShape);
		}
	};

	/**
	 * @protected
	 */
	BaseConditionalShape.prototype.setProperty = function (sPropertyName, oValue, bSuppressInvalidate) {
		BaseShape.prototype.setProperty.apply(this, arguments);
		if (PROPAGATED_PROPERTIES.indexOf(sPropertyName) >= 0) {
			this.getShapes().forEach(function (oShape) {
				oShape.setProperty(sPropertyName, oValue, bSuppressInvalidate);
			});
		}
		if (sPropertyName === "shapeId") {
			this.getShapes().forEach(function (oShape) {
				var sShapeId = oShape.getShapeId();
				if (!sShapeId) {
					oShape.setProperty(sPropertyName, oValue, bSuppressInvalidate);
				}
			});
		}
	};

	BaseConditionalShape.prototype.getShapeId = function () {
		var oActiveShape = this._getActiveShapeElement(),
			sShapeId;

		if (oActiveShape) {
			sShapeId = oActiveShape.getShapeId();
		}

		if (!sShapeId) {
			sShapeId = this.getProperty("shapeId");
		}

		return sShapeId;
	};

	/**
	 * Returns the value of the <code>CountInBirdEye</code> property for the active shape.
	 *
	 * @returns {boolean}
	 * @public
	 */
	BaseConditionalShape.prototype.getCountInBirdEye = function () {
		var oActiveShape = this._getActiveShapeElement();
		if (oActiveShape) {
			return oActiveShape.getCountInBirdEye();
		}

		return false;
	};

	BaseConditionalShape.prototype._getActiveShapeElement = function () {
		var iActiveShape = this.getActiveShape(),
			aShapes = this.getShapes();
		if (iActiveShape >= 0 && iActiveShape < aShapes.length) {
			return aShapes[iActiveShape];
		}

		return undefined;
	};

	return BaseConditionalShape;
});

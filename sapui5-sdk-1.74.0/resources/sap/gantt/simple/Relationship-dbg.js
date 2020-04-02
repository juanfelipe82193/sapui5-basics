/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/Core",
	"sap/ui/core/IconPool",
	"./GanttUtils",
	"./RenderUtils",
	"./BasePath"
],
function (
	Device,
	Core,
	IconPool,
	GanttUtils,
	RenderUtils,
	BasePath
) {
	"use strict";

	var ARROW_SIZE = 6, /* arrow size */
		LINE_LENGTH = 20, /* Line length when one shape is invisible */
		PROMPTER_ICON_SIZE = 15, /* Icon size when one shape is invisible */
		RELATION_TYPE = { "FinishToFinish": 0, "FinishToStart": 1, "StartToFinish": 2, "StartToStart": 3 };

	/**
	 * Creates and initializes a Relationship class
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables users to visualize the relationship between visiable objects.
	 *
	 * @extends sap.gantt.simple.BasePath
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.Relationship
	 */
	var Relationship = BasePath.extend("sap.gantt.simple.Relationship", /** @lends sap.gantt.simple.Relationship.prototype */ {
		metadata: {
			properties: {
				/**
				 * Defines the <code>Relationship</code> type.
				 */
				type: { type: "sap.gantt.simple.RelationshipType", group: "Appearance" },

				/**
				 * predecessor of the <code>Relationship</code>
				 *
				 * This property specify where the relationship starts, <code>Relationship</code> lookup the shape instance based on the property value
				 */
				predecessor: { type: "string", group: "Data" },

				/**
				 * successor of the <code>Relationship</code>
				 *
				 * This property specify where the relationship ends, <code>Relationship</code> lookup the shape instance by the property value.
				 */
				successor: { type: "string", group: "Data" },

				/**
				 * Defines the stroke color when <code>Relationship</code> is selected
				 */
				selectedStroke: { type: "sap.gantt.ValueSVGPaintServer", defaultValue: "#FF0000" },

				/**
				 * Defines the stroke width when <code>Relationship</code> is selected
				 */
				selectedStrokeWidth: { type: "sap.gantt.SVGLength", defaultValue: 2 }
			}
		}
	});

	Relationship.prototype.applySettings = function (mSettings) {
		mSettings = mSettings || {};
		mSettings.stroke = mSettings.stroke || "#000000"; // @sapUiBase
		mSettings.strokeWidth = mSettings.strokeWidth || 1;
		BasePath.prototype.applySettings.apply(this, arguments);
	};

	Relationship.prototype.renderElement = function (oRm, oElement, sGanttId) {
		// do not render relationship if visible false
		if (!oElement.getVisible()) {
			return;
		}
		var mRelatedShapes = this.getRelatedInRowShapes(sGanttId);
		if (mRelatedShapes.predecessor == null && mRelatedShapes.successor == null) { return; }
		var vType = this.getProcessedType();
		var mAnchors = this.getRlsAnchors(vType, mRelatedShapes);

		var fnCheckAnchors = function(oAnchor) {
			return jQuery.isNumeric(oAnchor.x) && jQuery.isNumeric(oAnchor.y);
		};

		if (!fnCheckAnchors(mAnchors.predecessor) || !fnCheckAnchors(mAnchors.successor)) {
			return;
		}

		var nRowHeight = this.getBaseRowHeight(sGanttId);

		this.calcLinePathD(mAnchors, nRowHeight, vType);

		this.renderRelationship(oRm, mAnchors);
	};

	Relationship.prototype.getRlsAnchors = function (vType, mRelatedShapes) {
		var oPredecessor, oSuccessor, oPrompter;

		var mAnchors = this.getShapeAnchors(mRelatedShapes);
		if (mRelatedShapes.predecessor && mRelatedShapes.successor) {
			// both predecessor and successor shapes are available and visible
			if (vType == RELATION_TYPE.FinishToFinish) {
				oPredecessor = mAnchors.predecessor.tail;
				oSuccessor = mAnchors.successor.tail;
			} else if (vType == RELATION_TYPE.FinishToStart) {
				oPredecessor = mAnchors.predecessor.tail;
				oSuccessor = mAnchors.successor.head;
			} else if (vType == RELATION_TYPE.StartToFinish) {
				oPredecessor = mAnchors.predecessor.head;
				oSuccessor = mAnchors.successor.tail;
			} else if (vType == RELATION_TYPE.StartToStart) {
				oPredecessor = mAnchors.predecessor.head;
				oSuccessor = mAnchors.successor.head;
			}
		} else if (mRelatedShapes.predecessor && !mRelatedShapes.successor) {
			// predecessor shape is visible but successor is missing
			if (vType == RELATION_TYPE.FinishToFinish || vType == RELATION_TYPE.FinishToStart) {
				oPredecessor = mAnchors.predecessor.tail;
				oSuccessor = {
					x: oPredecessor.x + LINE_LENGTH,
					y: oPredecessor.y
				};
				oPrompter = {
					x: oSuccessor.x,
					y: oSuccessor.y + PROMPTER_ICON_SIZE / 2
				};
			} else if (vType == RELATION_TYPE.StartToFinish || vType == RELATION_TYPE.StartToStart) {
				oPredecessor = mAnchors.predecessor.head;
				oSuccessor = {
					x: oPredecessor.x - LINE_LENGTH,
					y: oPredecessor.y
				};
				oPrompter = {
					x: oSuccessor.x - PROMPTER_ICON_SIZE,
					y: oSuccessor.y + PROMPTER_ICON_SIZE / 2
				};
			}
		} else if (!mRelatedShapes.predecessor && mRelatedShapes.successor) {
			if (vType == RELATION_TYPE.FinishToFinish || vType == RELATION_TYPE.StartToFinish) {
				oSuccessor = mAnchors.successor.tail;
				oPredecessor = {
					x: oSuccessor.x + LINE_LENGTH,
					y: oSuccessor.y
				};
				oPrompter = {
					x: oPredecessor.x,
					y: oPredecessor.y + PROMPTER_ICON_SIZE / 2
				};
			} else if (vType == RELATION_TYPE.FinishToStart || vType == RELATION_TYPE.StartToStart) {
				oSuccessor = mAnchors.successor.head;
				oPredecessor = {
					x: oSuccessor.x - LINE_LENGTH,
					y: oSuccessor.y
				};
				oPrompter = {
					x: oPredecessor.x - PROMPTER_ICON_SIZE,
					y: oPredecessor.y + PROMPTER_ICON_SIZE / 2
				};
			}
		}
		return {
			predecessor: oPredecessor,
			successor: oSuccessor,
			prompter: oPrompter
		};
	};

	Relationship.prototype.calcLinePathD = function (mAnchors, nRowHeight, vType) {
		var x1 = mAnchors.predecessor.x, y1 = mAnchors.predecessor.y;
		var x2 = mAnchors.successor.x, y2 = mAnchors.successor.y;
		var fnCalculate, mArguments = [x1, y1, x2, y2];

		if (y1 == y2) { // predecessor and succesor are on the same row
			fnCalculate = this.calcIRlsPathD;
		} else if (y1 != y2) { // not on the same row
			if (vType == RELATION_TYPE.FinishToFinish) {
				fnCalculate = this.calcURlsPathD; mArguments.push(false);
			} else if (vType == RELATION_TYPE.FinishToStart) {
				if (x1 <= x2) {
					fnCalculate = this.calcLRlsPathD;
				} else if (x1 > x2) {
					fnCalculate = this.calcSRlsPathD; mArguments.push(nRowHeight);
				}
			} else if (vType == RELATION_TYPE.StartToFinish) {
				if (x1 < x2) {
					fnCalculate = this.calcSRlsPathD; mArguments.push(nRowHeight);
				} else if (x1 >= x2) {
					fnCalculate = this.calcLRlsPathD;
				}
			} else if (vType == RELATION_TYPE.StartToStart) {
				fnCalculate = this.calcURlsPathD; mArguments.push(true);
			}
		}

		// special calculate for L relationship
		if (fnCalculate == this.calcLRlsPathD) {
			mArguments[2] = (x1 < x2) ? x2 + mAnchors.successor.dx : x2 - mAnchors.successor.dx;
			mArguments[3] = (y1 < y2) ? y2 - mAnchors.successor.dy : y2 + mAnchors.successor.dy;
		}

		this.setProperty("d", fnCalculate.apply(this, mArguments), true);
	};

	/**
	 * +----------------------------+
	 * |   +-------------------->   |
	 * +----------------------------+
	 *
	 * @param {float} x1 start point of x-axis
	 * @param {float} y1 start point on y-axis
	 * @param {float} x2 end point of x-axis
	 * @param {float} y2 end point on y-axis
	 *
	 * @returns {string} concat <path> d to show I (straight line) style path
	 */
	Relationship.prototype.calcIRlsPathD = function (x1, y1, x2, y2) {
		return this.getLinePathD([[x1, y1], [x2, y2]]);
	};

	/**
	 * +----------------------------+
	 * |   +--------------------+   |
	 * |                        |   |
	 * |                        v   |
	 * +----------------------------+
	 * @param {float} x1 start point of x-axis
	 * @param {float} y1 start point on y-axis
	 * @param {float} x2 end point of x-axis
	 * @param {float} y2 end point on y-axis
	 *
	 * @returns {string} concat <path> d to show L style path
	 */
	Relationship.prototype.calcLRlsPathD = function (x1, y1, x2, y2) {
		return this.getLinePathD([[x1, y1], [x2, y1], [x2, y2]]);
	};

	/**
	 * +----------------------------+
	 * |   +--------------------+   |
	 * |                        |   |
	 * |              <---------+   |
	 * +----------------------------+
	 *
	 * @param {float} x1 start point of x-axis
	 * @param {float} y1 start point on y-axis
	 * @param {float} x2 end point of x-axis
	 * @param {float} y2 end point on y-axis
	 * @param {bool} bYFlip whether to flip the U style
	 *
	 * @returns {string} concat <path> d to show U style relationship
	 */
	Relationship.prototype.calcURlsPathD = function (x1, y1, x2, y2, bYFlip) {
		var x3 = (x1 < x2) ? x2 + 2 * ARROW_SIZE : x1 + 2 * ARROW_SIZE;
		var x4 = (x1 < x2) ? x1 - 2 * ARROW_SIZE : x2 - 2 * ARROW_SIZE;
		var x5 = (!bYFlip) ? x3 : x4;
		return this.getLinePathD([[x1, y1], [x5, y1], [x5, y2], [x2, y2]]);
	};

	/**
	 * +----------------------------+
	 * |                    +---+   |
	 * |                        |   |
	 * |   +--------------------+   |
	 * |   |                        |
	 * |   +--->                    |
	 * +----------------------------+
	 *
	 * @param {float} x1 start point of x-axis
	 * @param {float} y1 start point on y-axis
	 * @param {float} x2 end point of x-axis
	 * @param {float} y2 end point on y-axis
	 * @param {int} nRowHeight default row height
	 *
	 * @returns {string} concat <path> d to show S relationship
	 */
	Relationship.prototype.calcSRlsPathD = function (x1, y1, x2, y2, nRowHeight) {
		var x3 = (x1 < x2) ? x1 - ARROW_SIZE * 2 : x1 + ARROW_SIZE * 2;
		var y3 = (y1 < y2) ? y1 + nRowHeight / 2 : y1 - nRowHeight / 2;
		var x4 = (x1 < x2) ? x2 + ARROW_SIZE * 2 : x2 - ARROW_SIZE * 2;
		return this.getLinePathD([[x1, y1], [x3, y1], [x3, y3], [x4, y3], [x4, y2], [x2, y2]]);
	};

	Relationship.prototype.getArrowPathD = function (sPath) {
		var fnToNum = function (v) { return Number(v); };
		var aPoints = sPath.match(/-?\d+(\.\d+)?/g).map(fnToNum);
		var x1 = aPoints[aPoints.length / 2 - 2];
		var y1 = aPoints[aPoints.length / 2 - 1];
		var x2 = aPoints[aPoints.length / 2 + 0];
		var y2 = aPoints[aPoints.length / 2 + 1];
		var aResult = [[x2, y2]];
		if (x1 == x2) {
			if (y1 > y2) {        // up arrow
				aResult.push([x2 + ARROW_SIZE / 2, y2 + ARROW_SIZE]);
				aResult.push([x2 - ARROW_SIZE / 2, y2 + ARROW_SIZE]);
			} else if (y1 < y2) { // down arrow
				aResult.push([x2 - ARROW_SIZE / 2, y2 - ARROW_SIZE]);
				aResult.push([x2 + ARROW_SIZE / 2, y2 - ARROW_SIZE]);
			}
		} else if (x1 != x2) {
			if (x1 > x2) {        // left arrow
				aResult.push([x2 + ARROW_SIZE, y2 - ARROW_SIZE / 2]);
				aResult.push([x2 + ARROW_SIZE, y2 + ARROW_SIZE / 2]);
			} else if (x1 < x2) { // right arrow
				aResult.push([x2 - ARROW_SIZE, y2 + ARROW_SIZE / 2]);
				aResult.push([x2 - ARROW_SIZE, y2 - ARROW_SIZE / 2]);
			}
		}
		return d3.svg.line().interpolate("linear-closed")(aResult);
	};

	Relationship.prototype.getShapeAnchors = function (mRelatedShapes) {
		var mAnchors = { predecessor: null, successor: null };
		Object.keys(mRelatedShapes).forEach(function (sKey) {
			var oShape = mRelatedShapes[sKey];
			if (oShape == null) { return; }
			if (oShape.getShapeAnchors) {
				mAnchors[sKey] = oShape.getShapeAnchors();
			} else {
				var oBBox = oShape.getDomRef().getBBox();
				mAnchors[sKey] = {
					head: {
						x: oBBox.x,
						y: oBBox.y + oBBox.height / 2,
						dx: 0,
						dy: oBBox.height / 2
					},
					tail: {
						x: oBBox.x + oBBox.width,
						y: oBBox.y + oBBox.height / 2,
						dx: 0,
						dy: oBBox.height / 2
					}
				};
			}
		});
		return mAnchors;
	};

	Relationship.prototype.renderRelationship = function (oRm, mAnchors) {
		oRm.write("<g");
		this.writeElementData(oRm);
		RenderUtils.renderAttributes(oRm, this, ["style"]);
		oRm.write(">");
		RenderUtils.renderTooltip(oRm, this);
		oRm.write("<path");
		oRm.writeAttribute("d", this.getD());
		oRm.write("/>");
		oRm.write("<path");
		oRm.writeAttribute("d", this.getArrowPathD(this.getD()));
		oRm.write("/>");
		if (mAnchors.prompter) {
			oRm.write("<text");
			oRm.writeAttribute("x", mAnchors.prompter.x);
			oRm.writeAttribute("y", mAnchors.prompter.y);
			oRm.writeAttribute("font-size", PROMPTER_ICON_SIZE);
			oRm.writeAttribute("font-family", "SAP-icons");
			oRm.writeAttribute("text-anchor", (Core.getConfiguration().getRTL() && !Device.browser.msie && !Device.browser.edge) ? "end" : "start");
			oRm.writeAttribute("stroke-width", 0);
			oRm.write(">");
			oRm.write(IconPool.getIconInfo("chain-link").content);
			oRm.write("</text>");
		}
		oRm.write("</g>");
	};

	Relationship.prototype.getStyle = function () {
		return this.getInlineStyle({
			"fill": this.getStroke(),
			"stroke": this.getStroke(),
			"stroke-width": this.getStrokeWidth(),
			"stroke-dasharray": this.getStrokeDasharray(),
			"opacity": this.getStrokeOpacity()
		});
	};

	Relationship.prototype.getLinePathD = function (aPoints) {
		aPoints = aPoints.concat(aPoints.slice(1, -1).reverse());
		return d3.svg.line().interpolate("linear-closed")(aPoints);
	};

	Relationship.prototype.getSelectedStyle = function () {
		return this.getInlineStyle({
			"fill": this.getSelectedStroke(),
			"stroke": this.getSelectedStroke(),
			"stroke-width": this.getSelectedStrokeWidth(),
			"stroke-dasharray": this.getStrokeDasharray(),
			"pointer-events": "none"
		});
	};

	/**
	 * FIXME: evaluate if it's really needed
	 *
	 * @param {string} sGanttId GanttChart id
	 */
	Relationship.prototype.getBaseRowHeight = function (sGanttId) {
		return Core.byId(sGanttId).getTable()._getDefaultRowHeight();
	};

	Relationship.prototype.getProcessedType = function () {
		var sType = this.getProperty("type");
		var isRTL = Core.getConfiguration().getRTL();
		return isRTL ? 3 - RELATION_TYPE[sType] : RELATION_TYPE[sType];
	};

	/**
	 * Gets the predecessor and successor objects.
	 * @param {object} oGntSvg The chart dom element.
	 * @returns {object} An object which includes the predecessor and successor objects.
	 * {
	 *     predecessor: oShape1,
	 *     successor: oShape2
	 * }
	 * @private
	 */
	Relationship.prototype.getRelatedInRowShapes = function (sGanttId) {
		var mRelatedShapes = { predecessor: null, successor: null };

		Object.keys(mRelatedShapes).forEach(function (sPropertyName) {
			mRelatedShapes[sPropertyName] = GanttUtils.shapeElementById(this.getProperty(sPropertyName), sGanttId + "-svg");
		}, this);

		return mRelatedShapes;
	};

	return Relationship;
}, true);

/*global QUnit */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/Device"
], function (Core, GanttRowSettings, BaseRectangle, Relationship, utils, Device) {
	"use strict";

	QUnit.module("Relationship", {
		beforeEach: function () {
			this.sD = undefined;
			this.oRls = new Relationship();
		}
	});

	QUnit.test("getLinePathD", function (assert) {
		this.sD = this.oRls.getLinePathD([[5, 5], [35, 35]]);
		assert.equal(this.sD, "M5,5L35,35Z", "Line path is '" + this.sD + "'");
	});

	QUnit.test("calcIRlsPathD", function (assert) {
		this.sD = this.oRls.calcIRlsPathD(5, 5, 35, 5);
		assert.equal(this.sD, "M5,5L35,5Z", "Line path is '" + this.sD + "'");
	});

	QUnit.test("calcLRlsPathD", function (assert) {
		this.sD = this.oRls.calcLRlsPathD(5, 5, 35, 35);
		assert.equal(this.sD, "M5,5L35,5L35,35L35,5Z", "Line path is '" + this.sD + "'");
	});

	QUnit.test("calcURlsPathD", function (assert) {
		this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35);
		assert.equal(this.sD, "M5,5L47,5L47,35L35,35L47,35L47,5Z", "Line path is '" + this.sD + "'");
	});

	QUnit.test("calcSRlsPathD", function (assert) {
		this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 10);
		assert.equal(this.sD, "M5,5L-7,5L-7,10L47,10L47,35L35,35L47,35L47,10L-7,10L-7,5Z", "Line path is '" + this.sD + "'");
	});

	QUnit.test("getArrowPathD", function (assert) {
		this.sD = this.oRls.getArrowPathD("M5,5L35,5Z");
		assert.equal(this.sD, "M35,5L29,8L29,2Z", "right arrow");

		this.sD = this.oRls.getArrowPathD("M35,5L5,5Z");
		assert.equal(this.sD, "M5,5L11,2L11,8Z", "left arrow");

		this.sD = this.oRls.getArrowPathD("M5,5L35,5L35,35L35,5Z");
		assert.equal(this.sD, "M35,35L32,29L38,29Z", "down arrow");

		this.sD = this.oRls.getArrowPathD("M5,35L35,35L35,5L35,35Z");
		assert.equal(this.sD, "M35,5L38,11L32,11Z", "up arrow");
	});

	QUnit.module("Relationship", {
		beforeEach: function () {
			utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true
					})
				]
			}));
		},
		afterEach: function () {
			utils.destroyGantt();
		},
		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 1000);
		}
	});

	QUnit.test("getRelatedInRowShapes", function (assert) {
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				predecessor: "0",
				successor: "1"
			});
			var oChart = window.oGanttChart;
			var oShapes = oRls.getRelatedInRowShapes(oChart.getId());
			assert.equal(oShapes.predecessor.getShapeId(), "0", "Shape instance is found");
			assert.equal(oShapes.successor.getShapeId(), "1", "Shape instance is found");
			done();
		});
	});

	QUnit.test("getRlsAnchors", function (assert) {
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				predecessor: "0",
				successor: "1"
			});
			var oChart = window.oGanttChart;
			var oShapes = oRls.getRelatedInRowShapes(oChart.getId()), oAnchors;
			var aRelationType = ["FinishToFinish", "FinishToStart", "StartToFinish", "StartToStart"];
			aRelationType.forEach(function (sType, iType) {
				oRls.setProperty("type", sType);
				oAnchors = oRls.getRlsAnchors(iType, oShapes);
				assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
				oAnchors = oRls.getRlsAnchors(iType, { "predecessor": oShapes.predecessor, "successor": null });
				assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
				oAnchors = oRls.getRlsAnchors(iType, { "predecessor": null, "successor": oShapes.successor });
				assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
			});
			done();
		});
	});

	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		var clr = result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;

		if (clr) {
			return "rgb(" + clr.r + ", " + clr.g + ", " + clr.b + ")";
		}

		return hex;
	}

	QUnit.test("renderElement", function (assert) {
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				type: "FinishToStart",
				shapeId: "rls-1",
				selectable: true,
				predecessor: "0",
				successor: "1",
				stroke: "#ff0000",
				strokeOpacity: 0.8,
				strokeWidth: 4,
				strokeDasharray: "1 4"
			});
			var oChart = window.oGanttChart;
			var oGntSvg = jQuery.sap.domById(oChart.getId() + "-svg");
			var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);


			var oRm = Core.createRenderManager();
			oRls.renderElement(oRm, oRls, oChart.getId());
			oRm.flush(oRlsCnt);
			if (!Device.browser.msie) {

				var $path = oRls.$();

				assert.equal(true, $path.css("stroke-width") === "4px" || $path.css("stroke-width") === "4", "stroke width");
				assert.equal(hexToRgb($path.css("stroke")), "rgb(255, 0, 0)", "stroke color");
				assert.equal($path.css("opacity"), "0.8", "stroke opacity");

				var sArray = $path[0].style["stroke-dasharray"],
					bCondition = sArray === "1, 4" || sArray === "1px, 4px" || sArray === "1,4" || sArray === "1px,4px";

				assert.equal(bCondition, true, "stroke dasharray");

				assert.ok(jQuery(oRlsCnt).find("[data-sap-gantt-shape-id='rls-1']").get(0) != null, "Relationship dom element is found");
			} else {
				assert.ok(true);
			}
			oRm.destroy();
			done();
		});
	});

	QUnit.test("visibility", function (assert) {
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				type: "FinishToStart",
				shapeId: "rls-1",
				selectable: true,
				predecessor: "0",
				successor: "1",
				stroke: "#ff0000",
				strokeOpacity: 0.8,
				strokeWidth: 4,
				strokeDasharray: "1 4",
				visible: false
			});
			var oChart = window.oGanttChart;
			var oGntSvg = jQuery.sap.domById(oChart.getId() + "-svg");
			var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);

			var oRm = Core.createRenderManager();
			oRls.renderElement(oRm, oRls, oChart.getId());
			oRm.flush(oRlsCnt);
			if (!Device.browser.msie) {
				var $path = oRls.$();
				assert.equal($path.length, 0);
			} else {
				assert.ok(true);
			}
			oRm.destroy();
			done();
		});
	});
});

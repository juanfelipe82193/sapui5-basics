/*global QUnit */
sap.ui.define([
	"sap/gantt/simple/BaseConditionalShape",
	"./GanttQUnitUtils",
	"sap/gantt/simple/BaseRectangle"
], function (BaseConditionalShape, GanttUtils, BaseRectangle) {
	"use strict";

	QUnit.module("Conditional Shape", {
		beforeEach: function () {
			this.oShape = new BaseConditionalShape({
				shapes: [
					new BaseRectangle({
						id: "r1",
						shapeId: "r1",
						x: 0,
						y: 0,
						rx: 10,
						ry: 10
					}),
					new BaseRectangle({
						id: "r2",
						shapeId: "r2",
						x: 0,
						y: 0,
						rx: 10,
						ry: 10
					})
				]
			});
			this.oGantt = GanttUtils.createSimpleGantt(this.oShape, "20180101000000", "20180102000000");
			this.oGantt.placeAt("content");
		},
		afterEach: function () {
			this.oShape = null;
			this.oGantt.destroy();
			this.oGantt = null;
		}
	});

	QUnit.test("Active shape selects correct value", function (assert) {
		var oGantt = this.oGantt;
		assert.expect(2);
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
			assert.equal($element.attr("data-sap-gantt-shape-id"), "r1", "First shape should be selected by default.");
			var oShape = sap.ui.getCore().byId($element.attr("id")).getParent();
			oShape.setActiveShape(1);
			sap.ui.getCore().applyChanges();
			$element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
			assert.equal($element.attr("data-sap-gantt-shape-id"), "r2", "Second shape should be selected by default.");
		});
	});

	QUnit.test("Active shape out of bounds doesn't render any shape", function (assert) {
		var oGantt = this.oGantt;
		assert.expect(2);
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
			var oShape = sap.ui.getCore().byId($element.attr("id")).getParent();
			oShape.setActiveShape(-1);
			sap.ui.getCore().applyChanges();
			$element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
			assert.equal($element.length, 0, "No shape should be rendered.");
			oShape.setActiveShape(2);
			sap.ui.getCore().applyChanges();
			$element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
			assert.equal($element.length, 0, "No shape should be rendered.");
		});
	});

	QUnit.test("countInBirdEye property", function (assert) {
		var oGantt = this.oGantt;
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
			var oConShape = sap.ui.getCore().byId($element.attr("id")).getParent();
			var aShapes = oConShape.getShapes();
			oConShape.setActiveShape(-1);
			assert.equal(oConShape.getCountInBirdEye(), false);

			oConShape.setActiveShape(0);
			assert.equal(oConShape.getCountInBirdEye(), false);
			aShapes[0].setCountInBirdEye(true);
			assert.equal(aShapes[0].getCountInBirdEye(), true);
			assert.equal(oConShape.getCountInBirdEye(), true);
			oConShape.setActiveShape(1);
			assert.equal(oConShape.getCountInBirdEye(), false);
		});
	});

	QUnit.module("Stand Alone");

	QUnit.test("Important properties get propagated", function (assert) {
		var oInnerShape = new BaseRectangle();
		var oShape = new BaseConditionalShape({
			shapes: oInnerShape
		});
		oShape.setRowYCenter(5);
		oShape.setSelected(true);
		oShape.setProperty("shapeUid", "test");
		assert.equal(oInnerShape.getRowYCenter(), 5, "rowYCenter should be propagated.");
		assert.equal(oInnerShape.getSelected(), true, "selected should be propagated.");
		assert.equal(oInnerShape.getShapeUid(), "test", "shapeUid should be propagated.");
		oShape.destroy();
	});

	QUnit.test("ShapeId is propagated only if not set", function (assert) {
		var oInnerShapeWith = new BaseRectangle({
				shapeId: "inner"
			}),
			oInnerShapeWithout = new BaseRectangle(),
			oShape = new BaseConditionalShape({
				shapes: [oInnerShapeWith, oInnerShapeWithout]
			});
		oShape.setShapeId("test");
		assert.equal(oInnerShapeWith.getShapeId(), "inner", "Shape with defined rowId should keep the row ID.");
		assert.equal(oInnerShapeWithout.getShapeId(), "test", "Shape without defined rowId should get propagated ID.");
		oShape.destroy();
	});
});

/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/GanttDragDropExtension",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils"
], function (GanttDragDropExtension, BaseRectangle, GanttRowSettings, qutils, utils) {
	"use strict";

	var fnCreateShapeBindingSettings = function() {
		return new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					draggable: true,
					selectable: true,
					resizable: true
				})
			]
		});
	};

	QUnit.test("default values", function (assert) {
		var dragDropExt = new GanttDragDropExtension({});
		assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Default oMouseDownTarget is null");
		assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "Default oLastDraggedShape is null");
		assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Default mDragPoint.shapeX is undefined");
		assert.strictEqual(dragDropExt.$ghost, null, "Default $ghost is null");
	});

	QUnit.module("Functions - GanttDragDropExtension", {
		beforeEach: function(assert){
			utils.createGantt(true, fnCreateShapeBindingSettings());
			window.oGanttChart.placeAt("qunit-fixture");
			this.oGanttChart = window.oGanttChart;
		},
		getSvgOffset: function() {
			var popoverExt = window.oGanttChart._getPopoverExtension(),
				$svgCtn = jQuery(popoverExt.getDomRefs().gantt),
				$vsb = jQuery(window.oGanttChart.getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar)),
				svgOffset = $svgCtn.offset(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top,
				iSvgRight = iSvgLeft + $svgCtn.width() - $vsb.width();

			return {left: iSvgLeft, top: iSvgTop, right: iSvgRight};
		},
		getDoms: function() {

			return {
				draggedShape: jQuery("rect[data-sap-gantt-shape-id=0]").get(0),
				header: jQuery(".sapGanttChartHeader").get(0),
				ghost: jQuery.sap.byId("sapGanttDragGhostWrapper")
			};
		},
		createEventParam: function(x, y) {
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.pageX = x;
			oEventParams.clientX = x;
			oEventParams.pageY = y;
			oEventParams.clientY = y;
			return oEventParams;
		},
		mousedown: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousedown", oShape, oEventParams);
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousemove", oShape, oEventParams);
		},
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		},
		afterEach: function(assert) {
			utils.destroyGantt();
		}
	});

	QUnit.test("Drag In Free Direction", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oHeader = this.getDoms().header;
			var fnGetGhostTime = sinon.spy(dragDropExt, "_getGhostTime");

			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Before mousedown: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "Before mousedown: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Before mousedown: mDragPoint.shapeX is undefined");

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);

			assert.ok(dragDropExt.oMouseDownTarget != null, "After mousedown: oMouseDownTarget is not null");

			var sShapUid = "PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]";
			assert.strictEqual(dragDropExt.oLastDraggedShapeData.shapeUid, sShapUid, "After mousedown: The last dragged shape uid is '" + sShapUid + "'");
			assert.strictEqual(jQuery(dragDropExt.oMouseDownTarget).data("sapGanttShapeId"), 0, "After mousedown: The loMouseDownTarget shape id is '0'");
			assert.ok(dragDropExt.mDragPoint.shapeX > 0, "After mousedown: mDragPoint.shapeX > 0");

			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			this.mouseup(oHeader, iSvgLeft + 16, iPageY);
			assert.equal(fnGetGhostTime.callCount, 0, "Before mouseup, drag not ended, no shapeDrop event fired");

			oDragShapeDom = this.getDoms().draggedShape;
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iSvgTop - 30);
			this.mouseup(oHeader, iSvgLeft + 20, iSvgTop - 30);
			assert.equal(fnGetGhostTime.callCount, 1, "Drop to invalide area, no shapeDrop event fired");
			oDragShapeDom = this.getDoms().draggedShape;
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY);

			assert.equal(fnGetGhostTime.callCount, 1, "Before mouseup, drag not ended, no shapeDrop event fired");

			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
			assert.equal(fnGetGhostTime.callCount, 2, "After mouseup, drag ended, fire shapeDrop event");
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mouseup: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mouseup: mDragPoint.shapeX is undefined");
			// set shape undraggable
			var oDraggedShape = dragDropExt.getShapeElementByTarget(oDragShapeDom);
			assert.ok(oDraggedShape !== null, "Dragged shape is not null");
			oDraggedShape.setDraggable(false);
			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			return new Promise(function (fnResolve) {
				setTimeout(function(){
					assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mousedown on a undraggable shape: oMouseDownTarget is null");
					assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mousedown on a undraggable shape: oLastDraggedShapeData is null");
					assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mousedown on a undraggable shape: mDragPoint.shapeX is undefined");
					fnResolve();
				}, 1500);
			});
		}.bind(this));

	});

	QUnit.test("Drag In Horizontal Direction", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var fnGetGhostTime = sinon.spy(dragDropExt, "_getGhostTime");
			this.oGanttChart.setDragOrientation(sap.gantt.DragOrientation.Horizontal);

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY + 100);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY + 200);
			var iTop = dragDropExt.$ghost.position().top;
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY + 300);
			var iCurrentTop = dragDropExt.$ghost.position().top;
			assert.equal(iTop, iCurrentTop, "When drag in horizontal direction, axis-y will not change");
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY + 400);
			iCurrentTop = dragDropExt.$ghost.position().top;
			assert.equal(iTop, iCurrentTop, "When drag in horizontal direction, axis-y will not change");
			assert.equal(fnGetGhostTime.callCount, 1, "Before mouseup, drag not ended, no shapeDrop event fired");

			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
			assert.equal(fnGetGhostTime.callCount, 2, "After mouseup, drag ended, fire shapeDrop event");
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mouseup: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mouseup: mDragPoint.shapeX is undefined");
		}.bind(this));

	});

	QUnit.test("Drag In Vertical Direction", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var fnGetGhostTime = sinon.spy(dragDropExt, "_getGhostTime");
			this.oGanttChart.setDragOrientation(sap.gantt.DragOrientation.Vertical);

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY + 100);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY + 200);
			var iLeft = dragDropExt.$ghost.position().left;
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY + 300);
			var iCurrentLeft = dragDropExt.$ghost.position().left;
			assert.equal(iLeft, iCurrentLeft, "When drag in vertical direction, axis-x will not change");

			this.mousemove(oDragShapeDom, iSvgLeft + 175, iPageY + 300);
			iCurrentLeft = dragDropExt.$ghost.position().left;

			assert.equal(iLeft, iCurrentLeft, "When drag in vertical direction, axis-x will not change");
			assert.equal(fnGetGhostTime.callCount, 1, "Before mouseup, drag not ended, no shapeDrop event fired");

			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
			assert.equal(fnGetGhostTime.callCount, 2, "After mouseup, drag ended, fire shapeDrop event");
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mouseup: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mouseup: mDragPoint.shapeX is undefined");
		}.bind(this));

	});

	QUnit.test("isEventTargetDraggable", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.target = oDragShapeDom;
			oEventParams.ctrlKey = false;
			assert.strictEqual(dragDropExt.isEventTargetDraggable(oEventParams), false, "The unselected shape is not draggable without ctrl key in MultiWithKeyboard mode");
			oEventParams.ctrlKey = true;
			assert.strictEqual(dragDropExt.isEventTargetDraggable(oEventParams), false, "The unselected shape is not draggable with ctrl key in MultiWithKeyboard mode");
		}.bind(this));
	});

	QUnit.test("isValidDropZone", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oEvent = {};
			var oDragShapeDom = this.getDoms().draggedShape;
			var oHeader = this.getDoms().header;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			oEvent.target = oDragShapeDom;
			assert.strictEqual(dragDropExt.isValidDropZone(oEvent), true, "valid drop area");
			oEvent.target = oHeader;
			assert.strictEqual(dragDropExt.isValidDropZone(oEvent), false, "invalid drop area");
		}.bind(this));
	});

});

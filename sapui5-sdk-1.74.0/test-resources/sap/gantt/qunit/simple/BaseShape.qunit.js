/*global QUnit, sinon */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/BaseShape",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils"
], function(Core, BaseShape, qutils, utils) {
	"use strict";

	QUnit.module("BaseShape", {
		assertFalseDefaultValue: function(assert, oShape, sProp) {
			assert.equal(oShape.getProperty(sProp), false, "default value: " + sProp + " in BaseShape is false");
		}
	});

	QUnit.test("Property - default values", function(assert) {
		var oShape = new BaseShape();
		this.assertFalseDefaultValue(assert, oShape, "expandable");
		this.assertFalseDefaultValue(assert, oShape, "selectable");
		this.assertFalseDefaultValue(assert, oShape, "draggable");
		this.assertFalseDefaultValue(assert, oShape, "selected");
		this.assertFalseDefaultValue(assert, oShape, "resizable");
		this.assertFalseDefaultValue(assert, oShape, "hoverable");
	});

	QUnit.test("BaseShape enabled CustomStyleClassSupport", function(assert){
		var oShape = new BaseShape();
		assert.ok(oShape.hasStyleClass != null, "has hasStyleClass");
		assert.ok(oShape.toggleStyleClass != null, "has toggleStyleClass");
		assert.ok(oShape.removeStyleClass != null, "has removeStyleClass");
	});

	QUnit.test("Property - setShapeUid is disabled", function(assert){
		var oShape = new BaseShape();
		var fnError = sinon.spy(jQuery.sap.log, "error");
		assert.equal(fnError.callCount, 0, "Error was not logged so far");
		oShape.setShapeUid("fakeUid");
		assert.equal(fnError.args[0][0], "The control manages the shapeUid generation. The method \"setShapeUid\" cannot be used programmatically!", "setShapeUid error logged");
		assert.ok(fnError.calledOnce, "call shapeUid gets assert error");

		oShape.setProperty("shapeUid", "UID");
		assert.equal(oShape.getProperty("shapeUid"), "UID", "getShapeUid is enabled");
		assert.equal(fnError.callCount, 1, "No error logged when calling setProperty");
		fnError.restore();
	});

	QUnit.test("Property - getTransform", function(assert) {
		var oShape = new BaseShape({
			xBias: 1, yBias: 2
		});
		assert.equal(oShape.getTransform(), "translate(1 2)", "getTransform concat correctly");
	});

	QUnit.test("Property - setTransform", function(assert) {
		var sTransformValue = "translate(10,20)";
		var oShape = new BaseShape({transform: sTransformValue});
		assert.equal(oShape.getTransform(), sTransformValue, "getTransform() is correct");
		assert.equal(oShape.getXBias(), 10, "xBias was set to 10");
		assert.equal(oShape.getYBias(), 20, "yBias was set to 20");
	});

	QUnit.test("Rendering - renderElement", function(assert){
		var oShape = new BaseShape();
		var oRm = Core.createRenderManager();
		oShape.renderElement(oRm, oShape);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		oRm.destroy();
		assert.ok(jQuery('#qunit-fixture').is(':empty'), "do nothing when rendering base shape");
	});

	QUnit.module("Interaction - BaseShape", {
		beforeEach: function(){
			this.sut = utils.createGantt(true);
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		},
		getFirstShape: function(){
			var oFirstShape = this.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			return oFirstShape;
		},

		delayedAssert: function(fnAssertion) {
			setTimeout(function(){
				fnAssertion();
			}, 2000);
		}
	});

	QUnit.test("Interaction - onclick", function(assert) {
		var done1 = assert.async(),
			done2 = assert.async();

		this.delayedAssert(function() {
			var oFirstShape = this.getFirstShape();
			assert.ok(oFirstShape != null, "Shape instance is found");
			assert.equal(oFirstShape.getSelectable(), false, "Shape selectable is false");
			assert.ok(oFirstShape.getDomRef() != null, "First shape dom is visible");

			var oClickSpy = sinon.spy(oFirstShape, "onclick");
			var oHandleShapePress = sinon.spy(this.sut, "handleShapePress");
			qutils.triggerEvent("click", oFirstShape.getId());

			assert.ok(oClickSpy.calledOnce, "user had clicked on the first shape");
			assert.ok(oHandleShapePress.notCalled, "_setShapeSelected doesn't get called");

			oFirstShape.setSelectable(true);
			this.sut.setDisableShapeDoubleClickEvent(true);
			qutils.triggerEvent("click", oFirstShape.getId());
			assert.ok(oHandleShapePress.calledOnce, "event is called immediately");

			this.sut.setDisableShapeDoubleClickEvent(false);
			this.sut.attachEventOnce("shapePress", function () {
				assert.ok(true, "event is called with delay");
				done2();
			});
			qutils.triggerEvent("click", oFirstShape.getId());

			oClickSpy.restore();
			oHandleShapePress.restore();
			done1();
		}.bind(this));
	});

	QUnit.test("Onclick - test prevent selection", function(assert) {
		var done = assert.async();

		this.delayedAssert(function() {
			var oFirstShape = this.getFirstShape();

			// Click event is called immediately when double click is disabled
			this.sut.setDisableShapeDoubleClickEvent(true);
			oFirstShape.setSelectable(true);

			qutils.triggerEvent("click", oFirstShape.getId());
			assert.ok(oFirstShape.getSelected(), "shape is selected");

			oFirstShape.setSelected(false);
			assert.notOk(oFirstShape.getSelected(), "shape is not selected");

			this.sut.attachEventOnce("shapePress", function (oEvent) {
				oEvent.preventDefault();
			});
			qutils.triggerEvent("click", oFirstShape.getId());
			assert.notOk(oFirstShape.getSelected(), "shape is not selected");

			done();
		}.bind(this));
	});

	QUnit.test("Interaction - dblclick", function(assert) {
		var done = assert.async();

		this.delayedAssert(function() {
			var oFirstShape = this.getFirstShape();

			var oClickSpy = sinon.spy(oFirstShape, "onclick");
			var oDblClickSpy = sinon.spy(oFirstShape, "ondblclick");
			qutils.triggerEvent("dblclick", oFirstShape.getId());

			assert.ok(oClickSpy.notCalled, "dblclick won't call onclick");
			assert.ok(oDblClickSpy.calledOnce, "ondblclick calls once");

			this.sut.attachEventOnce("shapeDoubleClick", function () {
				assert.ok(true, "event is called");
			});
			qutils.triggerEvent("dblclick", oFirstShape.getId());

			this.sut.setDisableShapeDoubleClickEvent(true);
			this.sut.attachEventOnce("shapeDoubleClick", function () {
				assert.ok(false, "event should be disabled");
			});
			qutils.triggerEvent("dblclick", oFirstShape.getId());

			oClickSpy.restore();
			oDblClickSpy.restore();
			done();
		}.bind(this));
	});

	QUnit.test("Interaction - oncontextmenu", function(assert) {
		var done = assert.async();
		this.delayedAssert(function(){
			var oFirstShape = this.getFirstShape(),
				oGantt = window.oGanttChart;

			var oRightClickSpy = sinon.spy(oFirstShape, "oncontextmenu");
			sinon.stub(oFirstShape, "getGanttChartBase").returns(oGantt);

			oGantt.attachShapeContextMenu(function(oEvent){
				assert.equal(oEvent.getSource().getId(), oGantt.getId(), "shape context menu event fired with correct gantt");
				assert.equal(oFirstShape.getId(), oEvent.getParameter("shape").getId());
			});

			qutils.triggerEvent("contextmenu", oFirstShape.getId());

			assert.ok(oRightClickSpy.calledOnce, "oncontext menu is called when right click on the shape");
			oFirstShape.getGanttChartBase.restore();
			oRightClickSpy.restore();
			done();
		}.bind(this));
	});

});

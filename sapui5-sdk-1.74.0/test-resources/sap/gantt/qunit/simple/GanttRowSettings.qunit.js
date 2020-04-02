/*global QUnit, sinon */

sap.ui.define([
	"sap/gantt/simple/GanttRowSettings", "sap/gantt/simple/BaseShape"
], function(GanttRowSettings, BaseShape) {
	"use strict";

	QUnit.module("GanttRowSettings", {
		beforeEach: function() {
			this.oFirstShape = new BaseShape({
				shapeId: "shape-01",
				scheme: "main"
			});
			this.oSecondShape = new BaseShape({
				shapeId: "shape-02",
				scheme: "main"
			});
			this.sut = new GanttRowSettings({
				rowId: "row-01",
				shapes1: [this.oFirstShape, this.oSecondShape]
			});

			this.stub = sinon.stub(this.sut, "getBindingModelName");
			this.stub.returns("test");

			this.stub2 = sinon.stub(this.sut, "getShapeBindingContextPath");
			this.stub2.returns("binding-path");
		},
		afterEach: function(){
			this.sut.destroy();
			this.stub.restore();
			this.stub2.restore();
			this.sut = null;
		}
	});

	QUnit.test("shall return null if no rowId set", function(assert){
		var oRowSetting = new GanttRowSettings();
		assert.equal(oRowSetting.getRowUid(), null, "return null when no rowId specified");
	});

	QUnit.test("test - getRowUid", function(assert){
		var sExpectedUid = "PATH:row-01|SCHEME:main[0]";
		assert.equal(this.sut.getRowUid("main"), sExpectedUid);
	});

	QUnit.test("shall return correct shapeUid", function(assert){
		var sShape1Uid = "PATH:row-01|SCHEME:main[0]|DATA:binding-path[shape-01]";
		assert.equal(this.sut.getShapeUid(this.oFirstShape), sShape1Uid, "first shape uid is correct");

		var sShape2Uid = "PATH:row-01|SCHEME:main[0]|DATA:binding-path[shape-02]";
		assert.equal(this.sut.getShapeUid(this.oSecondShape), sShape2Uid, "the second shape uid is also correct");
	});

	QUnit.test("shall return no expandable shapes", function(assert){
		var aExpandableShapes = this.sut.getAllExpandableShapes();
		assert.equal(aExpandableShapes.length, 0, "no shape marked as expandable");
	});

	QUnit.test("shall return 2 expandable shapes", function(assert){
		this.oFirstShape.setExpandable(true);
		this.oFirstShape.setExpandable(true);

		var aExpandableShapes = this.sut.getAllExpandableShapes();
		assert.equal(aExpandableShapes.length, 2, "2 expandable shapes found");
	});

	QUnit.test("rowId update shall surpress invalidating", function(assert){
		var fnSpySetProperty = sinon.spy(this.sut, "setProperty");

		this.sut.setRowId("row-01-new");
		assert.ok(fnSpySetProperty.calledOnce, "setProperty only called once");
	});
});

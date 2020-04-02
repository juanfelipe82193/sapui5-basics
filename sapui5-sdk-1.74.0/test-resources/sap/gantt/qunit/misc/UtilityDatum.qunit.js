/*global QUnit */
sap.ui.define([
	"sap/gantt/misc/Utility",
	"sap/ui/qunit/QUnitUtils"
], function (Utility, qutils) {
	"use strict";

	var oGanttChart = sap.ui.jsfragment("sap.gantt.qunit.GanttChart", this);
	oGanttChart.getModel("test").loadData("../data/hierarchy_order_complex.json", null, false/**bAsync*/);
	sap.ui.getCore().applyChanges();

	qutils.delayTestStart(1000);

	var fnScrollGanttToBottom = function () {
		var oVsb = oGanttChart.getTTVsbDom();
		jQuery(oVsb).scrollTop(oVsb.scrollHeight);
	};

	var fnScrollGanttToTop = function () {
		var oVsb = oGanttChart.getTTVsbDom();
		jQuery(oVsb).scrollTop(0);
	};

	QUnit.module("utility getDatum module", {
		beforeEach: function () {
			fnScrollGanttToTop();
		}
	});

	QUnit.test("test getShapeDatumById", function (assert) {
		// 3 is the first shape id on second row
		var aDatum = Utility.getShapeDatumById("3", oGanttChart.getId());
		var oExpected = {
			id: 3,
			__id__: 3,
			status: 1,
			type: 1,
			startTime: "20140929000000",
			endTime: "20140931000000",
			uid: "PATH:0001|SCHEME:sap_main[0]|DATA:activity[3]"
		};

		assert.strictEqual(aDatum.length, 1, "shape with id: 3 only bind to 1 single element");
		assert.propEqual(aDatum[0], oExpected, "datum on shape 3 is correct");

		aDatum = Utility.getShapeDatumById("rls006", oGanttChart.getId());
		assert.strictEqual(aDatum.length, 1, "shape with rls006 bind to 1 single line");
		// here only assert several critical property name
		assert.strictEqual(aDatum[0].fromDataId, "0000", "rls006 binded fromeDataId is correct");
		assert.strictEqual(aDatum[0].toDataId, "00011", "rls006 binded toDataId is correct");
	});

	QUnit.test("Invisible: test getShapeDatumById", function (assert) {
		// 34 is the first shape id on last row, which is invisible
		var sShapeId = "34";
		var aDatum = Utility.getShapeDatumById(sShapeId, oGanttChart.getId());

		assert.strictEqual(aDatum.length, 0, "shape with id: 34 not visible");

		// relationship rls005 is also not visible but will be drawn
		sShapeId = "rls005";
		aDatum = Utility.getShapeDatumById(sShapeId, oGanttChart.getId());
		assert.strictEqual(aDatum.length, 1, "relationship with id: rls005 datum is binded");
		assert.ok(aDatum[0] !== undefined, "relationship with id: rls005 is not undefined");
	});

	QUnit.test("test getRowDatumByEventTarget", function (assert) {
		var target = jQuery("[data-sap-gantt-shape-id='3']").get(0);
		var oDatum = Utility.getRowDatumByEventTarget(target);

		assert.ok(oDatum.objectInfoRef !== undefined, "objectInfoRef in row datum is presented");
		assert.ok(oDatum.shapeData !== undefined, "shapeData in row datum is presented");
	});

	QUnit.test("test getRowDatumByShapeUid", function (assert) {
		var sShapeUid = "PATH:0001|SCHEME:sap_main[0]|DATA:activity[3]";
		var oDatum = Utility.getRowDatumByShapeUid(sShapeUid, oGanttChart.getId());

		assert.ok(oDatum, "row datum had found");
		assert.ok(oDatum.objectInfoRef === undefined, "objectInfoRef in row datum should not presented");
		assert.ok(oDatum.shapeData === undefined, "shapeData in row datum should not presented");

		sShapeUid = "PATH:DUMMY|SCHEME:DUMMY[0]|DATA:relationship[rls006]";
		oDatum = Utility.getRowDatumByShapeUid(sShapeUid, oGanttChart.getId());
		assert.strictEqual(oDatum, null, "relationship has no row concept");
	});

	QUnit.test("test getShapeDatumByShapeUid", function (assert) {
		var sShapeUid = "PATH:0001|SCHEME:sap_main[0]|DATA:activity[3]";
		var oDatum = Utility.getShapeDatumByShapeUid(sShapeUid, oGanttChart.getId());

		assert.ok(oDatum, "shape datum had found");
		assert.ok(oDatum.uid === sShapeUid, "shape datum is matched");
	});

	QUnit.test("test getRowDatumById", function (assert) {
		// first two rows
		var aRowId = ["0000", "0001"];
		var aDatum = Utility.getRowDatumById(aRowId, oGanttChart.getId());

		assert.strictEqual(aDatum.length, 2, "found 2 row datum");
		assert.ok(aDatum[0].objectInfoRef !== undefined, "objectInfoRef in row datum is presented");
		assert.ok(aDatum[0].shapeData !== undefined, "shapeData in row datum is presented");
		assert.strictEqual(aDatum[0].shapeData.length, 2, "first row: 0000 has 2 shapeData");
	});

	QUnit.test("test getRowDatumRefById", function (assert) {
		// first two rows
		var aRowId = ["0000", "0001"];
		var aDatum = Utility.getRowDatumRefById(aRowId, oGanttChart.getId());

		assert.strictEqual(aDatum.length, 2, "found 2 row datum");
		assert.strictEqual(aDatum[0].id, "0000", "first shape id is 0000");
		assert.strictEqual(aDatum[0].shapeData, undefined, "no shapeData in datum");
	});

	QUnit.test("Invisible: test getRowDatumById", function (assert) {
		// row 0008 and 0009 are not visible after gantt chart initialized
		var aRowId = ["0008", "0009"];
		var aDatum = Utility.getRowDatumById(aRowId, oGanttChart.getId());

		assert.strictEqual(aDatum.length, 0, "found 0 row datum");

		fnScrollGanttToBottom();
		var done = assert.async();
		// give gantt chart 400 million seconds chance to draw visible shapes
		setTimeout(function () {
			aDatum = Utility.getRowDatumById(aRowId, oGanttChart.getId());
			assert.strictEqual(aDatum.length, 2, "found 2 row datum when visible");
			done();
			fnScrollGanttToTop();
		}, 400);
	});

});

/*global QUnit,sinon */
sap.ui.define([
	"sap/gantt/misc/ShapeSelectionModel",
	"sap/ui/qunit/QUnitUtils"
], function (ShapeSelectionModel, qutils) {
	"use strict";

	var oGanttChart = sap.ui.jsfragment("sap.gantt.qunit.misc.GanttChart", this);

	var sURLPrefix = sap.ui.require.toUrl("sap/gantt/qunit");
	oGanttChart.getModel("test").loadData(sURLPrefix + "/data/hierarchy_order_complex.json", null, false/**bAsync*/);

	// here I have to put the gantt into content, because qunit-fixture prevent all events
	jQuery("#content").css({
		height: "300px"
	});
	oGanttChart.placeAt("content");
	sap.ui.getCore().applyChanges();

	qutils.delayTestStart(1000);

	var fnMimicClickEvent = function (oDom, mOption) {
		mOption = mOption || {};
		var mEventOptions = jQuery.extend({
			button: 0
		}, mOption);
		qutils.triggerEvent("mousedown", oDom, mEventOptions);
		qutils.triggerEvent("mouseup", oDom, mEventOptions);
	};

	var fnSelectedRowLength = function () {
		return oGanttChart._getSelectionHandler().getSelectedIndices().length;
	};

	var stub;
	QUnit.module("shape selection module", {
		beforeEach: function () {
			stub = sinon.stub(oGanttChart, "_getSvgCoodinateByDiv");
			stub.returned({
				x: 0,
				y: 0,
				svgHeight: '300',
				svgId: oGanttChart.getId() + "-svg"
			});
			this.oSelection = new ShapeSelectionModel({
				selectionMode: oGanttChart.getSelectionMode(),
				ganttChart: oGanttChart
			});
			oGanttChart._oShapeSelection = this.oSelection;
		},
		afterEach: function () {
			oGanttChart.deselectShapes();
			oGanttChart.deselectRelationships();
			oGanttChart.deselectRows();
			// set back to default selection mode
			this.oSelection.setSelectionMode(oGanttChart.getSelectionMode());
			oGanttChart.invalidate();
			if (stub) {
				stub.restore();
			}
		}
	});

	QUnit.test("default selection mode", function (assert) {
		var oSelection = new ShapeSelectionModel();
		assert.equal(oSelection.getSelectionMode(), sap.gantt.SelectionMode.MultiWithKeyboard, "default mode is MuiltiWithKeyboard");

		oSelection.setSelectionMode(sap.gantt.SelectionMode.Single);
		assert.equal(oSelection.getSelectionMode(), "Single", "selection mode is set to Single");
	});

	QUnit.test("basic selection", function (assert) {
		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.ok(aSelectedShapes.length === 0, "no shape selection after gantt loaded");
		var aSelectedRls = this.oSelection.getSelectedRelationships();
		assert.ok(aSelectedRls.length === 0, "no relationship selected after gantt loaded");
	});

	QUnit.test("shape selection without ctrl key", function (assert) {
		this.oSelection.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboard);
		var g3 = jQuery("g[data-sap-gantt-shape-id='3']").get(0),
			g4 = jQuery("g[data-sap-gantt-shape-id='4']").get(0);

		fnMimicClickEvent(g3);
		fnMimicClickEvent(g4);

		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 1, "only 1 shape get selected without ctrl key");
	});

	QUnit.test("shape selection with ctrl key", function (assert) {
		this.oSelection.setSelectionMode(sap.gantt.SelectionMode.Single);
		var g3 = jQuery("g[data-sap-gantt-shape-id='3']").get(0),
			g4 = jQuery("g[data-sap-gantt-shape-id='4']").get(0);

		fnMimicClickEvent(g3, { ctrlKey: true });
		fnMimicClickEvent(g4, { ctrlKey: true });

		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 1, "only 1 shape selected even ctrlKey is enable in 'Single' selection mode");
	});

	QUnit.test("multi shape selection with ctrl key", function (assert) {
		this.oSelection.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboard);
		var g3 = jQuery("g[data-sap-gantt-shape-id='3']").get(0),
			g4 = jQuery("g[data-sap-gantt-shape-id='4']").get(0),
			g5 = jQuery("g[data-sap-gantt-shape-id='5']").get(0);

		fnMimicClickEvent(g3, { ctrlKey: true });
		fnMimicClickEvent(g4, { ctrlKey: true });
		fnMimicClickEvent(g5, { ctrlKey: true });

		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 3, "3 shapes are selected on multi selection");
	});

	QUnit.test("multi shape selection with command key on Mac", function (assert) {
		this.oSelection.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboard);
		var g3 = jQuery("g[data-sap-gantt-shape-id='3']").get(0),
			g4 = jQuery("g[data-sap-gantt-shape-id='4']").get(0),
			g5 = jQuery("g[data-sap-gantt-shape-id='5']").get(0);

		var osName = sap.ui.Device.os.name;
		sap.ui.Device.os.name = sap.ui.Device.os.OS.MACINTOSH;
		fnMimicClickEvent(g3, { ctrlKey: false, metaKey: true });
		fnMimicClickEvent(g4, { ctrlKey: false, metaKey: true });
		fnMimicClickEvent(g5, { ctrlKey: false, metaKey: true });

		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 3, "3 shapes are selected on multi selection");
		sap.ui.Device.os.name = osName;
	});

	QUnit.test("Multi Selection Mode without ctrl key", function (assert) {
		oGanttChart.setSelectionMode(sap.gantt.SelectionMode.Multiple);
		var g3 = jQuery("g[data-sap-gantt-shape-id='3']").get(0),
			g4 = jQuery("g[data-sap-gantt-shape-id='4']").get(0);

		fnMimicClickEvent(g3);
		fnMimicClickEvent(g4);

		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 2, "2 shapes are selected on multi selection without ctrl");
	});

	QUnit.test("disable shape selection with 'None' selection mode", function (assert) {
		this.oSelection.setSelectionMode(sap.gantt.SelectionMode.None);
		var g3 = jQuery("g[data-sap-gantt-shape-id='3']").get(0);

		fnMimicClickEvent(g3);

		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 0, "no shape should be selected in None mode");
	});

	QUnit.test("relationship MultiWithKeyboard without ctrlKey", function (assert) {
		this.oSelection.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboard);
		var rls1 = jQuery("[data-sap-gantt-shape-id='rls001']").get(0),
			rls2 = jQuery("[data-sap-gantt-shape-id='rls002']").get(0);

		fnMimicClickEvent(rls1, { ctrlKey: false });
		fnMimicClickEvent(rls2, { ctrlKey: false });

		var aSelectedRls = this.oSelection.getSelectedRelationships();
		assert.strictEqual(aSelectedRls.length, 1, "1 relationship shape get selected");
	});

	QUnit.test("relationship selection in multi mode with ctrlKey", function (assert) {
		var rls1 = jQuery("[data-sap-gantt-shape-id='rls001']").get(0),
			rls2 = jQuery("[data-sap-gantt-shape-id='rls002']").get(0);

		fnMimicClickEvent(rls1, { ctrlKey: true });
		fnMimicClickEvent(rls2, { ctrlKey: true });

		var aSelectedRls = this.oSelection.getSelectedRelationships();
		assert.strictEqual(aSelectedRls.length, 2, "2 relationship shape get selected with ctrlKey");
	});

	QUnit.test("relationship Multiple without ctrlKey", function (assert) {
		this.oSelection.setSelectionMode(sap.gantt.SelectionMode.Multiple);
		var rls1 = jQuery("[data-sap-gantt-shape-id='rls001']").get(0),
			rls2 = jQuery("[data-sap-gantt-shape-id='rls002']").get(0);

		fnMimicClickEvent(rls1);
		fnMimicClickEvent(rls2);

		var aSelectedRls = this.oSelection.getSelectedRelationships();
		assert.strictEqual(aSelectedRls.length, 2, "2 relationship shape get selected");
	});

	QUnit.test("test clearAll shapes", function (assert) {
		var bResult = this.oSelection.clearShapeSelection();
		assert.ok(!bResult, "clearShapeSelection return false if no shape selected before");
		var g3 = jQuery("g[data-sap-gantt-shape-id='3']").get(0);
		fnMimicClickEvent(g3);
		bResult = this.oSelection.clearShapeSelection();
		assert.ok(bResult, "clearShapeSelection return true if shape selection changed");

		bResult = this.oSelection.clearRelationshipSelection();
		assert.ok(!bResult, "clearRelationshipSelection return false if no relationship selected before");
		var rls1 = jQuery("[data-sap-gantt-shape-id='rls001']").get(0);
		fnMimicClickEvent(rls1);
		bResult = this.oSelection.clearRelationshipSelection();
		assert.ok(bResult, "clearRelationshipSelection return true if shape selection changed");
	});

	QUnit.test("test isShapeSelected", function (assert) {
		var sShapeUid = "PATH:0001|SCHEME:sap_main[0]|DATA:activity[3]";
		var bSelected = this.oSelection.isShapeSelected(sShapeUid);
		assert.ok(!bSelected, "Shape is not selected");

		var g3 = jQuery("g[data-sap-gantt-shape-id='3']").get(0);
		fnMimicClickEvent(g3);
		bSelected = this.oSelection.isShapeSelected(sShapeUid);
		assert.ok(bSelected, "Shape is selected");
	});

	QUnit.test("test isRelationshipSelected", function (assert) {
		var rlsUid = "PATH:DUMMY|SCHEME:DUMMY[0]|DATA:relationship[rls001]";
		var bSelected = this.oSelection.isRelationshipSelected(rlsUid);
		assert.ok(!bSelected, "Relationship is not selected");

		var rls1 = jQuery("[data-sap-gantt-shape-id='rls001']").get(0);
		fnMimicClickEvent(rls1);
		bSelected = this.oSelection.isRelationshipSelected(rlsUid);
		assert.ok(bSelected, "Relationship is selected");
	});

	QUnit.test("test de/selectByShapeData", function (assert) {
		var g3ShapeData = d3.select("g[data-sap-gantt-shape-id='3']").datum();
		this.oSelection.selectByShapeData(g3ShapeData);

		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 1, "only 1 shape get selected");

		var sShapeUid = "PATH:0001|SCHEME:sap_main[0]|DATA:activity[3]";
		this.oSelection.deselectShape(sShapeUid);

		aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 0, "no shape get selected");
	});

	QUnit.test("test get*DatumByShapeUid", function (assert) {
		var sShapeUid = "PATH:0001|SCHEME:sap_main[0]|DATA:activity[3]",
			sRowUid = "PATH:0001|SCHEME:sap_main[0]";
		assert.strictEqual(this.oSelection.getRowDatumByShapeUid(sShapeUid).uid,
			sRowUid, "row datum selected");
		assert.strictEqual(this.oSelection.getShapeDatumByShapeUid(sShapeUid).uid,
			sShapeUid, "shape datum selected");
	});

	QUnit.test("test selectShapeByUid", function (assert) {
		var g3ShapeData = d3.select("g[data-sap-gantt-shape-id='3']").datum();
		this.oSelection.selectShapeByUid([g3ShapeData.uid]);
		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 1, "only 1 shape get selected");
	});

	QUnit.test("test select/deselect relationship", function (assert) {
		var rls1Datum = d3.select("[data-sap-gantt-shape-id='rls001']").datum();
		this.oSelection.selectRelationship(rls1Datum);

		var aSelectedRls = this.oSelection.getSelectedRelationships();
		assert.strictEqual(aSelectedRls.length, 1, "1 relationship shape get selected");

		this.oSelection.deselectRelationship(rls1Datum.uid);
		aSelectedRls = this.oSelection.getSelectedRelationships();
		assert.strictEqual(aSelectedRls.length, 0, "0 relationship shape get selected");
	});

	QUnit.test("ShapeSelectionModel selectionMode changes", function (assert) {
		assert.strictEqual(this.oSelection.getSelectionMode(), oGanttChart.getSelectionMode(), "selectionModel is equal");

		oGanttChart.setSelectionMode(sap.gantt.SelectionMode.Multiple);
		assert.strictEqual(this.oSelection.getSelectionMode(), sap.gantt.SelectionMode.Multiple, "selectionModel is set to 'Multiple''");
	});

	QUnit.test("test selectShapes", function (assert) {
		var g3 = jQuery("g[data-sap-gantt-shape-id='3']").get(0);

		fnMimicClickEvent(g3, { ctrlKey: true });

		oGanttChart.selectShapes([], true);

		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 0, "exclusive deselect shapes");
	});

	QUnit.test("de/select shapes in invisible rows", function (assert) {
		var aShapeId = [34, 35, 36];
		oGanttChart.selectShapes(aShapeId);

		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 3, "3 invisible shapes get selected");

		oGanttChart.deselectShapes([34]);
		aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 2, "35, 36 shapes are still selected");

		oGanttChart.deselectShapes(aShapeId);
		aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 0, "no shape is selected after deselect");
	});

	/**==============================================================================*
	 * Test Module for GanttChart row selections.
	 * Including visible and none visible rows
	 **==============================================================================*/
	QUnit.module("row selection module", {
		beforeEach: function () {
			this.oSelection = oGanttChart._oShapeSelection;
		},
		afterEach: function () {
			oGanttChart.deselectRows();
			oGanttChart.invalidate();
		}
	});

	QUnit.test("test de/selectRows", function (assert) {
		// select the first three row with row id
		var oReturn = oGanttChart.selectRows(["0000", "0001", "0002"]);
		assert.strictEqual(oReturn, oGanttChart, "selectRows return gantt itself");

		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 0, "selectRows doesn't select any shapes");

		oReturn = oGanttChart.deselectRows(["0002"]);
		assert.strictEqual(oReturn, oGanttChart, "deselectRows return gantt itself");
		assert.strictEqual(fnSelectedRowLength(), 2, "2 rows still selected");

		oGanttChart.deselectRows(null);
		assert.strictEqual(fnSelectedRowLength(), 0, "0 rows still selected");

		oGanttChart.selectRows(["0000"]);
		oGanttChart.deselectRows([]);
		assert.strictEqual(fnSelectedRowLength(), 0, "0 rows still selected after passing empty []");

		oGanttChart.selectRows(["0001"]);
		oGanttChart.deselectRows();
		assert.strictEqual(fnSelectedRowLength(), 0, "0 rows still selected after passing undefined");
	});

	QUnit.test("selectRows exclusive", function (assert) {

		oGanttChart.selectRows(["0000", "0001", "0002"]);
		assert.strictEqual(fnSelectedRowLength(), 3, "3 rows selected");

		oGanttChart.selectRows(["0004"], true/**bExclusive*/);
		assert.strictEqual(fnSelectedRowLength(), 1, "1 rows selected after exclusive");
	});

	QUnit.test("selectRowsAndShapes with exclusive false", function (assert) {
		// GIVEN

		// WHEN
		oGanttChart.selectRowsAndShapes(["0000", "0001"]);

		// ASSERTION
		assert.strictEqual(fnSelectedRowLength(), 2, "2 rows selected");
		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 5, "5 shapes were selected for row 1 and row 2");
	});

	QUnit.test("selectRowsAndShapes with exclusive true", function (assert) {
		// GIVEN

		// WHEN
		oGanttChart.selectRowsAndShapes(["0000"]);
		oGanttChart.selectRowsAndShapes(["0001"], true/**bExclusive*/);

		// ASSERTION
		assert.strictEqual(fnSelectedRowLength(), 1, "1 row is selected, which is the second row");
		var aSelectedShapes = this.oSelection.getSelectedShapeDatum();
		assert.strictEqual(aSelectedShapes.length, 3, "3 shapes on the second row are still selected");

		var oResult = oGanttChart.selectRowsAndShapes([]);
		assert.strictEqual(fnSelectedRowLength(), 0, "0 row selected");
		assert.ok(oResult === oGanttChart, "selectRowsAndShapes return correct Gantt Instance");
	});

	QUnit.test("select rows in invisible areas", function (assert) {
		// row id: 0006 is not visible when height set to 300px
		oGanttChart.selectRows(["0006"]);
		assert.strictEqual(fnSelectedRowLength(), 1, "1 invisible rows selected");

		oGanttChart.selectRows(["0007"]);
		assert.strictEqual(fnSelectedRowLength(), 2, "2 invisible rows selected, 0006 and 0007");

		oGanttChart.deselectRows(["0006", "0007"]);
		assert.strictEqual(fnSelectedRowLength(), 0, "0006 and 0007 row is deselected");
	});

	QUnit.test("select rows mixed in/visible", function (assert) {
		// 0001 is in visible area, 0007 not
		oGanttChart.selectRows(["0001", "0007"]);
		assert.strictEqual(fnSelectedRowLength(), 2, "1 invisible rows selected");

		oGanttChart.deselectRows(["0007"]);
		assert.strictEqual(fnSelectedRowLength(), 1, "0001 row is still selected");
	});

});

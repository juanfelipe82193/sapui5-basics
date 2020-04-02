/*global QUnit,sinon */

sap.ui.define([
	"sap/gantt/library",
	"sap/gantt/axistime/FullScreenStrategy",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/axistime/StepwiseZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/misc/Format",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Table",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/simple/BaseCalendar",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseText",
	"./GanttQUnitUtils"
],
function(
	library,
	FullScreenStrategy,
	ProportionZoomStrategy,
	StepwiseZoomStrategy,
	TimeHorizon,
	Format,
	TreeTable,
	Table,
	GanttChartWithTable,
	BaseCalendar,
	BaseRectangle,
	BaseText,
	GanttUtils
) {
	"use strict";

	var GanttChartWithTableDisplayType = library.simple.GanttChartWithTableDisplayType,
		VisibleHorizonUpdateType = library.simple.VisibleHorizonUpdateType;

	QUnit.module("basic", {
		beforeEach: function() {
			this.sut = new GanttChartWithTable();
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("default properties", function(assert){
		assert.equal(this.sut.getWidth(), "100%", "default width");

		assert.equal(this.sut.getHeight(), "100%", "default height");
		assert.equal(this.sut.getSelectionPanelSize(), "30%", "default selectionPanelSize");
		assert.equal(this.sut.getShapeSelectionMode(), "MultiWithKeyboard", "default shapeSelectionMode");
		assert.equal(this.sut.getShapeSelectionSettings(), null, "default selection settings");

		["getEnableCursorLine", "getEnableNowLine", "getEnableVerticalLine", "getEnableAdhocLine"].forEach(function(sName){
			assert.ok(this[sName](), "default " + sName);
		}.bind(this.sut));

		assert.ok(this.sut.getAdhocLineLayer(), "Top", "default adhocLineLayer");
		assert.ok(this.sut.getDragOrientation(), "Free", "default dragOrientation");

		assert.ok(this.sut.getGhostAlignment(), "None", "default ghostAlignment");

		assert.ok(!this.sut.getShowShapeTimeOnDrag(), "default showShapeTimeOnDrag");
	});

	QUnit.test("default aggregation", function(assert){
		assert.equal(this.sut.getTable(), null, "default table");
		assert.equal(this.sut.getAdhocLines().length, 0, "default adhocLines");
		assert.equal(this.sut.getSvgDefs(), null, "default svgDefs");
		assert.equal(this.sut.getCalendarDef(), null, "default calendarDef");

		// a primary shape scheme is provided
		var aSchemes = this.sut.getShapeSchemes();
		assert.equal(aSchemes.length, 1, "1 default shape schemes");
		assert.ok(aSchemes[0].getPrimary(), "default scheme is primary");

		var oAxisStrategy = this.sut.getAxisTimeStrategy();
		assert.ok(oAxisStrategy != null, "axis zoom strategy has default values");
		assert.ok(oAxisStrategy.isA("sap.gantt.axistime.ProportionZoomStrategy"), "is a ProportionZoomStrategy");

		var oLocale = this.sut.getLocale();
		assert.ok(oLocale != null, "locale has default value");
		assert.ok(oLocale.isA("sap.gantt.config.Locale"), "isA config.Locale");

		assert.equal(oLocale.getTimeZone(), "CET", "timezone cloned");
		assert.equal(oLocale.getUtcdiff(), "000000", "utcdiff cloned");
		assert.equal(oLocale.getUtcsign(), "+", "utcsign cloned");
		assert.ok(true, "locale is cloned from sap.gantt.config.DEFAULT_LOCALE_CET");
	});

	QUnit.test("internal methods/properties availbility", function(assert){

		assert.ok(this.sut.getPrimaryShapeScheme() != null, "has primary scheme");
		assert.ok(this.sut.getInnerGantt() != null, "has inner gantt");
		var oSyncedControl = this.sut.getSyncedControl();
		assert.ok(oSyncedControl != null, "has synced control");
		assert.ok(oSyncedControl.isA("sap.gantt.simple.GanttSyncedControl"), "isA oSyncedControl");

		assert.ok(this.sut.getAxisTime() != null, "getAxisTime is available");

		assert.ok(this.sut.getSelection() != null, "getSelection is available");
	});

	QUnit.test("GanttExtension", function(assert){
		assert.ok(this.sut._bExtensionsInitialized === false, "Gantt Extension is not initialized");
		assert.equal(this.sut._aExtensions, undefined, "no extension is initialized");
	});

	QUnit.module("gantt with table", {
		beforeEach: function() {
			this.sut = new GanttChartWithTable({
				table: new TreeTable()
			});
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("getTable", function(assert){
		assert.ok(this.sut.getTable()._bVariableRowHeightEnabled, "enable variable row heights");

		var oSplitter = this.sut._oSplitter,
			oFirstCA = oSplitter.getContentAreas()[0],
			oSecondCA = oSplitter.getContentAreas()[1];
		assert.ok(oFirstCA != null, "first content is not null");
		assert.ok(oFirstCA.isA("sap.gantt.control.AssociateContainer"), "first content is AssociateContainer");
		assert.ok(oFirstCA.getEnableRootDiv(), "table is enabled enableRootDiv");

		assert.ok(oSecondCA != null, "second content is not null");
		assert.ok(oSecondCA.isA("sap.gantt.simple.GanttSyncedControl"), "second content is also GanttSyncedControl");
	});

	QUnit.test("setTable", function(assert){
		var setTableSpy = sinon.spy(this.sut, "setTable");
		var oSyncedControl = this.sut.getSyncedControl();
		var syncWithSpy = sinon.spy(oSyncedControl, "syncWith");

		var oNewTable = new Table();
		this.sut.setTable(oNewTable);
		assert.ok(setTableSpy.calledOnce, "setTable is called once");

		assert.ok(syncWithSpy.calledOnce, "syncWith called only once");
		assert.ok(syncWithSpy.calledOn(oSyncedControl), "called on oSyncedControl");
		assert.ok(syncWithSpy.calledWithExactly(oNewTable), "called on oSyncedControl");
	});

	QUnit.test("selection model", function(assert){
		var oSelection = this.sut.getSelection();
		assert.equal(this.sut.getShapeSelectionMode(), oSelection.getSelectionMode(), "initial value is correct");
		this.sut.setShapeSelectionMode("Single");
		assert.equal(oSelection.getSelectionMode(), "Single", "oSelection mode also updated");
	});

	QUnit.test("shape selection", function(assert){
		assert.expect(3);
		var oNow = new Date(),
			oEnd = new Date(oNow.getTime() + 24 * 3600000),
			oRect = new BaseRectangle({
				selected: false,
				selectable: true,
				draggable: false,
				time: oNow,
				endTime: oEnd
			}),
			sFakeShapeUid = "PATH:0|abcde|SCHEME:ac_main[0]";
		sinon.stub(oRect, "getShapeUid").returns(sFakeShapeUid);
		var mParam = {
			shape: oRect,
			ctrlOrMeta: false
		};

		var oSelection = this.sut.getSelection();
		this.sut.attachEventOnce("shapeSelectionChange", function(oEvent){
			assert.deepEqual(oEvent.getParameter("shapeUids"), [sFakeShapeUid]);

			assert.deepEqual(oSelection.allUid(), [sFakeShapeUid]);
			assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid), {
				draggable: false,
				time: oNow,
				endTime: oEnd,
				shapeUid: sFakeShapeUid
			});
		});

		this.sut.handleShapePress(mParam);
	});

	QUnit.module("axisTimeStrategy binding", {
		beforeEach: function () {
			this.gantt = GanttUtils.createGantt(true);

			// calculate new visible horizon dates
			var oTotalHorizon = this.gantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewVisibleStart = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewVisibleEnd = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewVisibleStart.setDate(dNewVisibleStart.getDate() + 14);
			dNewVisibleEnd.setDate(-12);

			// add data to the model
			var oModel = this.gantt.getModel();
			oModel.setProperty("/totalHorizonStartTime", oTotalHorizon.getStartTime());
			oModel.setProperty("/totalHorizonEndTime", oTotalHorizon.getEndTime());
			oModel.setProperty("/visibleHorizonStartTime", Format.dateToAbapTimestamp(dNewVisibleStart));
			oModel.setProperty("/visibleHorizonEndTime", Format.dateToAbapTimestamp(dNewVisibleEnd));
		},
		afterEach: function () {
			GanttUtils.destroyGantt();
		}
	});

	QUnit.test("FullScreenStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new FullScreenStrategy({
			totalHorizon: new TimeHorizon({ // same as visible horizon
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			})
		}));

		this.gantt.placeAt("qunit-fixture");

		return GanttUtils.waitForGanttRendered(this.gantt).then(function () {
			assert.ok(true, "No problems should happen during rendering.");
		});
	});

	QUnit.test("ProportionZoomStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			})
		}));

		this.gantt.placeAt("qunit-fixture");

		return GanttUtils.waitForGanttRendered(this.gantt).then(function () {
			assert.ok(true, "No problems should happen during rendering.");
		});
	});

	QUnit.test("StepwiseZoomStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			})
		}));

		this.gantt.placeAt("qunit-fixture");

		return GanttUtils.waitForGanttRendered(this.gantt).then(function () {
			assert.ok(true, "No problems should happen during rendering.");
		});
	});

	QUnit.module("selectionPanelSize", {
		beforeEach: function() {
			this.gantt = GanttUtils.createGantt();
			this.gantt.setSelectionPanelSize("30%");
			this.gantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			GanttUtils.destroyGantt(this.gantt);
		}
	});

	QUnit.test("Splitter resize changes selectionPanelSize", function (assert) {
		var oGantt = this.gantt;
		assert.expect(2);

		return GanttUtils.waitForGanttRendered(oGantt).then(function () {
			var iExpectedTableWidth = oGantt.$().width() * 0.3;
			var iTableWidth = oGantt.$().find("#table").width();
			assert.ok(
					(iTableWidth > (iExpectedTableWidth - 10)) && (iTableWidth < (iExpectedTableWidth + 10)),
					"Table on load should have " + iExpectedTableWidth + "px (+-10px) because selection panel size is set to 30% and Gantt width is " + oGantt.$().width() + "px."
			);
			oGantt._oSplitter.getContentAreas()[0].getLayoutData().setSize("50px");
			oGantt._oSplitter.triggerResize(true);
			assert.equal(oGantt.getSelectionPanelSize(), "50px", "selectionPanelSize should be unchanged.");
		});
	});

	QUnit.test("Test resize of gantt doesn't change selectionPanelSize", function (assert) {
		var oGantt = this.gantt;
		assert.expect(2);

		return new Promise(function (resolve) {
			function onResize() {
				assert.equal(oGantt.getSelectionPanelSize(), "30%", "selectionPanelSize should be unchanged.");
				resolve();
			}

			GanttUtils.waitForGanttRendered(oGantt).then(function () {
				var iExpectedTableWidth = oGantt.$().width() * 0.3;
				var iTableWidth = oGantt.$().find("#table").width();
				assert.ok(
						(iTableWidth > (iExpectedTableWidth - 10)) && (iTableWidth < (iExpectedTableWidth + 10)),
						"Table on load should have " + iExpectedTableWidth + "px (+-10px) because selection panel size is set to 30% and Gantt width is " + oGantt.$().width() + "px."
				);
				oGantt._oSplitter.attachEventOnce("resize", onResize);
				oGantt.$().width(100);
			});
		});
	});

	QUnit.test("Test displayTypes", function (assert) {
		return GanttUtils.waitForGanttRendered(this.gantt).then(function () {
			var aSplitterContentAreas = this.gantt._oSplitter.getContentAreas(),
					oTableAreaLayoutData = aSplitterContentAreas[0].getLayoutData(),
					oChartAreaLayoutData = aSplitterContentAreas[1].getLayoutData();

			assert.equal(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
			assert.equal(oTableAreaLayoutData.getSize(), "30%", "Default table size is 30%");
			assert.equal(oChartAreaLayoutData.getSize(), "auto", "Default chart layout size is auto");

			// Set displayType to Chart
			this.gantt.setDisplayType(GanttChartWithTableDisplayType.Chart);
			sap.ui.getCore().applyChanges();
			assert.equal(oTableAreaLayoutData.getSize(), "1px");
			assert.equal(oChartAreaLayoutData.getSize(), "auto");

			// Set displayType to Table
			this.gantt.setDisplayType(GanttChartWithTableDisplayType.Table);
			sap.ui.getCore().applyChanges();
			assert.equal(oTableAreaLayoutData.getSize(), "auto");
			assert.equal(oChartAreaLayoutData.getSize(), "19px"); // 19px is the vertical scrollbar which remains

			// Test selectionPanelSize change (splitter area resize)
			this.gantt.setDisplayType(GanttChartWithTableDisplayType.Both);
			this.gantt.setSelectionPanelSize("200px");
			sap.ui.getCore().applyChanges();
			assert.equal(oTableAreaLayoutData.getSize(), "200px");

			// Test change to Chart and back to Both, table and chart should have same size as before change displayType
			this.gantt.setDisplayType(GanttChartWithTableDisplayType.Chart);
			sap.ui.getCore().applyChanges();
			assert.equal(oTableAreaLayoutData.getSize(), "1px");
			assert.equal(oChartAreaLayoutData.getSize(), "auto");

			this.gantt.setDisplayType(GanttChartWithTableDisplayType.Both);
			sap.ui.getCore().applyChanges();
			assert.equal(oTableAreaLayoutData.getSize(), "200px");
			assert.equal(oChartAreaLayoutData.getSize(), "auto");
		}.bind(this));
	});

	QUnit.test("Test isShapeVisible", function(assert){
		var oGanttChartWithTable = this.gantt,
			oShape0 = new BaseRectangle(),
			oShape1 = new BaseText(),
			oShapeCalendar = new BaseCalendar();

		assert.expect(6);

		assert.ok(oGanttChartWithTable.isShapeVisible(oShape0));
		oShape0.setVisible(false);
		assert.notOk(oGanttChartWithTable.isShapeVisible(oShape0));

		assert.ok(oGanttChartWithTable.isShapeVisible(oShape1));
		oShape1.setVisible(false);
		assert.notOk(oGanttChartWithTable.isShapeVisible(oShape1));

		assert.ok(oGanttChartWithTable.isShapeVisible(oShapeCalendar));
		oShapeCalendar.setVisible(false);
		assert.ok(oGanttChartWithTable.isShapeVisible(oShapeCalendar));
	});

	QUnit.module("visibleHorizonUpdate event", {
		beforeEach: function () {
			this.gantt = GanttUtils.createGantt();
			this.gantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("HorizontalScroll fired", function (assert) {
		var fnDone = assert.async();
		var oOriginalHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon().clone();
		GanttUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function () {
				this.gantt.attachEventOnce("visibleHorizonUpdate", function (oEvent) {
					assert.equal(oEvent.getParameter("type"), VisibleHorizonUpdateType.HorizontalScroll, "HorizontalScroll event should have happened.");
					assert.ok(oOriginalHorizon.equals(oEvent.getParameter("lastVisibleHorizon")), "HorizontalScroll event should have happened.");
					assert.ok(this.gantt.getAxisTimeStrategy().getVisibleHorizon().equals(oEvent.getParameter("currentVisibleHorizon")), "Current VisibleHorizon should be correct.");
					assert.notOk(oEvent.getParameter("lastVisibleHorizon").equals(oEvent.getParameter("currentVisibleHorizon")), "Visible horizon should have changed.");
					fnDone();
				}, this);
				this.gantt.$("hsb").scrollLeft(0);
			}.bind(this), 100); // need to wait because Table updates its rows async (50ms)
		}.bind(this));
	});

	QUnit.test("InitialRender fired", function (assert) {
		var fnDone = assert.async();
		var oOriginalHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon().clone();
		this.gantt.attachVisibleHorizonUpdate(function (oEvent) {
				assert.equal(oEvent.getParameter("type"), VisibleHorizonUpdateType.InitialRender, "InitialRender event should have happened.");
				assert.ok(oOriginalHorizon.equals(oEvent.getParameter("lastVisibleHorizon")), "HorizontalScroll event should have happened.");
				assert.ok(oEvent.getParameter("lastVisibleHorizon").equals(oEvent.getParameter("currentVisibleHorizon")), "Visible horizon should have changed.");
				fnDone();
		});
	});

	QUnit.test("TotalHorizonUpdated fired", function (assert) {
		var fnDone = assert.async();
		this.gantt.attachVisibleHorizonUpdate(function (oEvent) {
			if (oEvent.getParameter("type") === VisibleHorizonUpdateType.TotalHorizonUpdated) {
				assert.ok(true, "Correct event should get fired");
				fnDone();
			}
		});
		this.gantt.getAxisTimeStrategy().setTotalHorizon(this.gantt.getAxisTimeStrategy().getVisibleHorizon().clone());
	});
});

/*global QUnit */

sap.ui.define([
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/simple/BaseRectangle",
	"sap/ui/layout/SplitterLayoutData",
	"./GanttQUnitUtils",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Column",
	"sap/m/Panel",
	"sap/ui/model/json/JSONModel"
],
function(
	ContainerToolbar,
	GanttChartWithTable,
	GanttChartContainer,
	GanttRowSettings,
	ProportionZoomStrategy,
	TimeHorizon,
	BaseChevron,
	BaseRectangle,
	SplitterLayoutData,
	GanttUtils,
	TreeTable,
	Column,
	Panel,
	JSONModel
) {
	"use strict";

	var oGanttChartContainer = new GanttChartContainer("container", {
		toolbar: new ContainerToolbar({
			showBirdEyeButton: true,
			content: [
				new sap.m.Text({
					text: "This is gantt toolbar--"
				})
			]
		}),
		ganttCharts: [
			new GanttChartWithTable({
				table: new TreeTable({
					columns: [
						new Column({label: "Name", template: "name"}),
						new Column({label: "Description", template: "description"})
					],
					selectionMode: sap.ui.table.SelectionMode.Single,
					enableColumnReordering: true,
					expandFirstLevel: true,
					visibleRowCountMode: "Auto",
					minAutoRowCount: 3,
					rowSettingsTemplate: new GanttRowSettings({
						rowId: "{Shape1ID}",
						shapes1: new BaseChevron({
							shapeId: "{Chevron1ID}",
							time: "{Chevron1StartDate}",
							endTime: "{Chevron1EndDate}",
							title: "{Chevron1Desc}",
							fill: "#0092D1",
							countInBirdEye: true
						}),
						shapes2: new BaseRectangle({
							shapeId: "{Rectangle1ID}",
							time: "{Rectangle1StartDate}",
							endTime: "{Rectangle1EndDate}",
							title: "{Rectangle1Desc}",
							fill: "#0092D1",
							countInBirdEye: false
						})
					})
				}).bindRows("/root"),
				axisTimeStrategy: new ProportionZoomStrategy({
					totalHorizon: new TimeHorizon({
						startTime: "20140628000000",
						endTime: "20170101000000"
					}),
					visibleHorizon: new TimeHorizon({
						startTime: "20150101000000",
						endTime: "20150315000000"
					})
				})
			}),
			new GanttChartWithTable({
				table: new TreeTable({
					columns: [
						new Column({label: "Name", template: "name"}),
						new Column({label: "Description", template: "description"})
					],
					selectionMode: sap.ui.table.SelectionMode.Single,
					enableColumnReordering: true,
					expandFirstLevel: true,
					visibleRowCountMode: "Auto",
					minAutoRowCount: 3,
					rowSettingsTemplate: new GanttRowSettings({
						rowId: "{Shape2ID}",
						shapes1: new BaseChevron({
							shapeId: "{Chevron2ID}",
							time: "{Chevron2StartDate}",
							endTime: "{Chevron2EndDate}",
							title: "{Chevron2Desc}",
							fill: "#0092D1",
							countInBirdEye: true
						})
					})
				}).bindRows("/root"),
				axisTimeStrategy: new ProportionZoomStrategy({
					totalHorizon: new TimeHorizon({
						startTime: "20140628000000",
						endTime: "20170101000000"
					}),
					visibleHorizon: new TimeHorizon({
						startTime: "20150101000000",
						endTime: "20150315000000"
					})
				})
			})
		]
	});

	var oPanel = new Panel({
		height: "500px",
		content: [oGanttChartContainer]
	}).placeAt("content");

	var oData = {
		root : {
			name: "root",
			description: "root description",
			0: {
				name: "item1",
				description: "item1 description",
				Shape1ID: "0",
				Chevron1ID: "0-0",
				Chevron1StartDate: new Date(2015, 4, 20),
				Chevron1EndDate: new Date(2015, 5, 21),
				Chevron1Desc: "Test Chevron 1",
				Rectangle1ID: "0-1",
				Rectangle1StartDate: new Date(2015, 2, 20),
				Rectangle1EndDate: new Date(2015, 3, 21),
				Rectangle1Desc: "Test Rectangle 1",
				Shape2ID: "1",
				Chevron2ID: "1-0",
				Chevron2StartDate: new Date(2015, 6, 20),
				Chevron2EndDate: new Date(2015, 7, 21),
				Chevron2Desc: "Test Chevron 2"
			}
		}
	};

	var oModel = new JSONModel();
	oModel.setData(oData);
	oPanel.setModel(oModel);

	QUnit.module("Test Zoom Sync.", {
		beforeEach: function () {
			this.oGanttChartContainer = oGanttChartContainer;
			this.oToolbar = this.oGanttChartContainer.getToolbar();
			this.aGanttCharts = this.oGanttChartContainer.getGanttCharts();
			this.oGantt1 = this.aGanttCharts[0];
			this.oGantt2 = this.aGanttCharts[1];

			this.assertGanttChartsVisibleHorizon = function(assert){
				var oAxisTimeStrategy1 =  this.oGantt1.getAxisTimeStrategy();
				var oAxisTimeStrategy2 =  this.oGantt2.getAxisTimeStrategy();

				var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();
				var oVisibleHorizon2 = oAxisTimeStrategy2.getVisibleHorizon();
				this.assertVisibleHorizon(assert, oVisibleHorizon1, oVisibleHorizon2);
			};

			this.assertVisibleHorizon = function(assert, oVisibleHorizon1, oVisibleHorizon2){
				assert.strictEqual(oVisibleHorizon1.getStartTime(), oVisibleHorizon2.getStartTime(), "Expect: " + oVisibleHorizon2.getStartTime() + "; Result:" + oVisibleHorizon1.getStartTime());
				assert.strictEqual(oVisibleHorizon1.getEndTime(), oVisibleHorizon2.getEndTime(), "Expect: " + oVisibleHorizon2.getEndTime() + "; Result:" + oVisibleHorizon1.getEndTime());
			};
		},
		afterEach: function () {
			this.oGanttChartContainer = undefined;
			this.oToolbar = undefined;
			this.aGanttCharts =  undefined;
			this.oGantt1 = undefined;
			this.oGantt2 =  undefined;
		},
		delayedAssert: function(fnAssertion, iMillisecond) {
			setTimeout(function(){
				fnAssertion();
			}, iMillisecond !== undefined ? iMillisecond : 500);
		}
	});

	QUnit.test("Test initial visibleHorizonSync." , function (assert) {
		var done = assert.async();
		this.delayedAssert(function() {
			this.assertGanttChartsVisibleHorizon(assert);
			done();
		}.bind(this));
	});

	QUnit.test("Test time scroll sync." , function (assert) {
		var done = assert.async();
		var oHSB1 = this.oGantt1._getScrollExtension().getGanttHsb();
		oHSB1.scrollLeft = 1000;

		this.delayedAssert(function() {
			this.assertGanttChartsVisibleHorizon(assert);
			done();
		}.bind(this));
	});

	QUnit.test("Test bird eye." , function (assert) {
		var done = assert.async();
		this.oToolbar._oBirdEyeButton.firePress();

		this.delayedAssert(function() {
			var oAxisTimeStrategy1 =  this.oGantt1.getAxisTimeStrategy();
			var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();

			assert.strictEqual(oVisibleHorizon1.getStartTime().substr(0,8), "20150519");
			assert.strictEqual(oVisibleHorizon1.getEndTime().substr(0,8), "20150821");
			this.assertGanttChartsVisibleHorizon(assert);
			done();
		}.bind(this));
	});

	QUnit.test("Test kept visible horizon when resize container" , function (assert) {
		var done = assert.async();

		var oAxisTimeStrategy1 =  this.oGantt1.getAxisTimeStrategy();

		var oOldVisibleHorizon = oAxisTimeStrategy1.getVisibleHorizon();

		oPanel.setHeight("800px");
		this.delayedAssert(function() {
			var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();

			this.assertVisibleHorizon(assert, oVisibleHorizon1, oOldVisibleHorizon);
			this.assertGanttChartsVisibleHorizon(assert);
			done();
		}.bind(this), 1000);
	});

	QUnit.test("Test kept zoom rate when resize column" , function (assert) {
		var done = assert.async();

		var oAxisTimeStrategy1 =  this.oGantt1.getAxisTimeStrategy();
		var oAxisTimeStrategy2 =  this.oGantt2.getAxisTimeStrategy();

		var oOldVisibleHorizon = oAxisTimeStrategy1.getVisibleHorizon();
		var fOldZoomRate = oAxisTimeStrategy1.getAxisTime().getZoomRate();

		this.oGantt1.getTable().getColumns()[1].setWidth("150px");
		this.oGantt2.getTable().getColumns()[1].setWidth("150px");
		this.delayedAssert(function() {
			var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();
			var oVisibleHorizon2 = oAxisTimeStrategy2.getVisibleHorizon();
			var fCurrentZoomRate = oAxisTimeStrategy1.getAxisTime().getZoomRate();

			assert.strictEqual(fOldZoomRate, fCurrentZoomRate);
			assert.strictEqual(oVisibleHorizon1.getStartTime(), oOldVisibleHorizon.getStartTime());
			assert.strictEqual(oVisibleHorizon2.getStartTime(), oOldVisibleHorizon.getStartTime());
			done();
		}, 1000);
	});

	QUnit.test("Test zoom control sync." , function (assert) {
		var oZoomOutButton = this.oToolbar._oZoomOutButton;
		var oZoomSlider = this.oToolbar._oZoomSlider;
		var oZoomInButton = this.oToolbar._oZoomInButton;

		oZoomInButton.firePress();
		this.assertGanttChartsVisibleHorizon(assert);

		oZoomSlider.setValue(3);
		this.assertGanttChartsVisibleHorizon(assert);

		oZoomOutButton.firePress();
		this.assertGanttChartsVisibleHorizon(assert);
	});

	QUnit.test("Test enableNowLine." , function (assert) {
		this.oGanttChartContainer.setEnableNowLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[0];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableNowLine(), false);
		assert.strictEqual(this.oGantt2.getEnableNowLine(), false);
	});

	QUnit.test("Test enableCursorLine." , function (assert) {
		this.oGanttChartContainer.setEnableCursorLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[1];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableCursorLine(), false);
		assert.strictEqual(this.oGantt2.getEnableCursorLine(), false);
	});

	QUnit.test("Test enableVerticalLine." , function (assert) {
		this.oGanttChartContainer.setEnableVerticalLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[2];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableVerticalLine(), false);
		assert.strictEqual(this.oGantt2.getEnableVerticalLine(), false);
	});

	QUnit.test("Test enableAdhocLine." , function (assert) {
		this.oGanttChartContainer.setEnableAdhocLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[3];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableAdhocLine(), false);
		assert.strictEqual(this.oGantt2.getEnableAdhocLine(), false);
	});

	QUnit.test("Test enableTimeScrollSync property" , function (assert) {
		this.oGanttChartContainer.setEnableTimeScrollSync(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[4];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);
	});

	QUnit.module("Shared Properties Sync", {
		beforeEach: function() {
			this.oContainer = new GanttChartContainer({
				ganttCharts: [
					new GanttChartWithTable("gantt1", {
						table: new sap.ui.table.Table({
							rowSettingsTemplate: new sap.gantt.simple.GanttRowSettings()
						})
					}),
					new GanttChartWithTable("gantt2",{
						table: new sap.ui.table.Table({
							rowSettingsTemplate: new sap.gantt.simple.GanttRowSettings()
						})
					})
				]
			});
		},
		afterEach: function(){
			this.oContainer.destroy();
		},

		assertGanttPropertyEquals: function(assert, sProperty, bValue) {
			this.oContainer.getGanttCharts().forEach(function(oGantt) {
				var sMsg = "property: " + sProperty + "is set correctly on Gantt: " + oGantt.getId();
				assert.strictEqual(oGantt.getProperty(sProperty), bValue, sMsg);
			});
		}
	});

	QUnit.test("Test shared property values is set on child Gantt Chart", function(assert) {
		var fnTestCase = function(sProperty, bValue) {
			this.oContainer["set" + jQuery.sap.charToUpperCase(sProperty)](bValue);
			this.assertGanttPropertyEquals(assert, sProperty, bValue);
		}.bind(this);

		var sProperty = "enableCursorLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableNowLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableAdhocLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableVerticalLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);
	});

	QUnit.test("Gantt chart shared property dominated by container", function(assert) {
		var oLastRemovedGantt = this.oContainer.removeGanttChart(1);

		assert.ok(oLastRemovedGantt.getEnableCursorLine(), "the enableCursorLine is true by default");
		this.oContainer.setEnableCursorLine(false);

		this.oContainer.addGanttChart(oLastRemovedGantt);
		assert.notOk(oLastRemovedGantt.getEnableCursorLine(), "now enableCursorLine is false because property value on container changed");
	});

	QUnit.module("gantt chart layout on empty Container", {
		beforeEach: function(){
			this.sut = new GanttChartContainer({
				layoutOrientation: "Vertical"
			});
		},
		afterEach: function(){
			this.sut.destroy();
		}
	});
	QUnit.test("The container has correct default value on property", function(assert){
		var sOrientation = this.sut.getLayoutOrientation();
		assert.strictEqual(sOrientation, sap.ui.core.Orientation.Vertical, "Default splitter orientation is Vertical");
		assert.strictEqual(sOrientation, this.sut._oSplitter.getOrientation(), "Inner splitter has the same value");
	});

	QUnit.test("layoutOrientation value synced between splitter", function(assert){
		this.sut.setLayoutOrientation("Horizontal");
		assert.strictEqual(this.sut.getLayoutOrientation(), "Horizontal", "property value changed");
		assert.strictEqual(this.sut._oSplitter.getOrientation(), "Horizontal", "splitter property value changed");
	});

	QUnit.module("gantt chart layout data", {
		beforeEach: function(){
			this.sut = new GanttChartContainer({
				ganttCharts: [
					new GanttChartWithTable({
						layoutData: new SplitterLayoutData({size: "60%", minSize: 500})
					}),
					new GanttChartWithTable()
				]
			});
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("layoutData cloned to splitter content", function(assert){
		var aContents = this.sut._oSplitter.getContentAreas();

		assert.ok(aContents.length === this.sut.getGanttCharts().length, "contents length equals");
		assert.ok(aContents[0].isA("sap.gantt.control.AssociateContainer"), "contentArea aggregation has AssociateContainer type");

		// first gantt chart layout data cloned to splitter first content
		assert.strictEqual(aContents[0].getLayoutData().getSize(), "60%", "size propogated to splitter content");
		assert.strictEqual(aContents[0].getLayoutData().getMinSize(), 500, "size propogated to splitter content");

		assert.strictEqual(aContents[1].getLayoutData().getSize(), "auto", "a default LayoutData is initialized by default");

		assert.ok(this.sut.getGanttCharts()[0].isA("sap.gantt.simple.GanttChartWithTable"), "ganttCharts aggregation stay still");
	});

	QUnit.test("layoutData changed on GanttChartWithTable", function(assert){
		var aContents = this.sut._oSplitter.getContentAreas();

		// Action: update size only
		this.sut.getGanttCharts()[0].getLayoutData().setSize("800px");
		assert.strictEqual(aContents[0].getLayoutData().getSize(), "60%", "update the size won't propogated to container");

		// replace the layoutData
		this.sut.getGanttCharts()[0].setLayoutData(new SplitterLayoutData({size: "800px"}));
		assert.strictEqual(aContents[0].getLayoutData().getSize(), "800px", "size updated on splitter as well");
	});

	QUnit.module("Single gantt");

	QUnit.test("selectionPanelSize should work in chart container as well", function (assert) {
		assert.expect(1);
		var oGantt = GanttUtils.createGantt();
		oGantt.setSelectionPanelSize("50px");
		var oContainer = new GanttChartContainer({
			ganttCharts: [oGantt]
		});
		oContainer.placeAt("content");
		oGantt.invalidate(); // otherwise, GanttChart is not invalidated in time and apply changes doesn't rerender it
		sap.ui.getCore().applyChanges();
		return GanttUtils.waitForGanttRendered(oGantt).then(function () {
			assert.equal(oGantt.getSelectionPanelSize(), "50px", "Selection panel size should be 50px.");
			oContainer.destroy();
		});
	});
});

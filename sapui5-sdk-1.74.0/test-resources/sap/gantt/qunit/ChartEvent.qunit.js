/*global QUnit */
sap.ui.define([
	"sap/gantt/def/SvgDefs",
	"sap/gantt/def/pattern/SlashPattern",
	"sap/gantt/qunit/data/DataProducer",

	"sap/gantt/test/shape/OrderShape",
	"sap/gantt/test/shape/TopIndicator",
	"sap/gantt/test/shape/RectangleGroup",
	"sap/gantt/test/shape/CustomSelectedShape"
], function (SvgDefs, SlashPattern, DataProducer) {
	"use strict";


	var oSvgDefs = new SvgDefs({
		defs: [
			new SlashPattern("pattern_slash_grey", {
				stroke: "#CAC7BA"
			}),
			new SlashPattern("pattern_slash_blue", {
				stroke: "#008FD3"
			}),
			new SlashPattern("pattern_slash_green", {
				stroke: "#99D101"
			}),
			new SlashPattern("pattern_slash_orange", {
				stroke: "#F39B02"
			}),
			new SlashPattern("pattern_slash_lightblue", {
				stroke: "#9FCFEB"
			})]
	});

	var oDataProducer = new DataProducer();
	oDataProducer.produceData("TOL");
	// create model and load data
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oDataProducer.getData("TOL"));

	var aShapeConfig = [new sap.gantt.config.Shape({
		key: "ActivityKey",
		shapeDataName: "activity",
		modeKeys: ["D"],
		level: 10,
		shapeClassName: "sap.gantt.test.shape.RectangleGroup",
		shapeProperties: {
			time: "{startTime}",
			endTime: "{endTime}",
			rx: 0,
			ry: 0,
			isDuration: true
		},
		selectedClassName: "sap.gantt.test.shape.CustomSelectedShape",
		groupAggregation: [new sap.gantt.config.Shape({
			shapeClassName: "sap.gantt.test.shape.TopIndicator",
			shapeProperties: {
				time: "{startTime}",
				endTime: "{endTime}",
				yBias: 0,
				isDuration: true
			}
		}), new sap.gantt.config.Shape({
			shapeClassName: "sap.gantt.test.shape.OrderShape",
			shapeProperties: {
				time: "{startTime}",
				endTime: "{endTime}",
				title: "{tooltip}",
				rx: 0,
				ry: 0,
				isDuration: true
			}
		})]
	}), new sap.gantt.config.Shape({
		key: "relationship",
		shapeDataName: "relationship",
		modeKeys: ["D"],
		level: 30,
		shapeClassName: "sap.gantt.shape.ext.rls.Relationship",
		shapeProperties: {
			isDuration: false,
			lShapeforTypeFS: true,
			showStart: false,
			showEnd: true,
			stroke: "{stroke}",
			strokeWidth: 1,
			type: "{relation_type}",
			fromObjectPath: "{fromObjectPath}",
			toObjectPath: "{toObjectPath}",
			fromDataId: "{fromDataId}",
			toDataId: "{toDataId}",
			fromShapeId: "{fromShapeId}",
			toShapeId: "{toShapeId}",
			title: "{tooltip}"
		}
	})];

	var aModesConfig = [
		sap.gantt.config.DEFAULT_MODE,
		new sap.gantt.config.Mode({
			key: "D",
			text: "Activity Mode",
			icon: "sap-icon://activity-items"
		}), new sap.gantt.config.Mode({
			key: "A",
			text: "Document Mode",
			icon: "sap-icon://document"
		})
	];

	// create chart
	var oChart = new sap.gantt.GanttChart({
		timeAxis: new sap.gantt.config.TimeAxis({
			planHorizon: new sap.gantt.config.TimeHorizon({
				startTime: "20140909000000",
				endTime: "20141207060610"
			}),
			initHorizon: new sap.gantt.config.TimeHorizon({
				startTime: "20140920121212",
				endTime: "20141027000000"
			})
		}),
		svgDefs: oSvgDefs,
		shapeDataNames: ["activity"],
		shapes: aShapeConfig,
		modes: aModesConfig,
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		},
		relationships: {
			path: "test>/root/relationships"
		}
	});
	oChart.setModel(oModel, "test");
	oChart.placeAt("content");


	// function _testRightClick() {
	// 	var fCheckRightClick = function (oEvent) {
	// 		var oParam = oEvent.getParameters();
	// 		var bRow = false;
	// 		if (oParam.rowIndex > -1) {
	// 			bRow = true;
	// 		}
	// 		equal(true, bRow, "rightClick on a row triggered correctly!");
	// 		equal(oEvent.sId, "chartRightClick", "chartRightClick triggered correctly!");
	// 	};
	// 	if (!oChart.mEventRegistry.chartRightClick || oChart.mEventRegistry.chartRightClick.length < 1) {
	// 		oChart.attachChartRightClick(fCheckRightClick, this);
	// 	}

	// 	var oEventParams = {};
	// 	oEventParams.button = 2;
	// 	oEventParams.detail = 1;
	// 	oEventParams.offsetX = 30;
	// 	oEventParams.offsetY = 222;
	// 	oEventParams.pageX = 30;
	// 	oEventParams.pageY = 222;
	// 	oEventParams.clientX = 30;
	// 	oEventParams.clientY = 222;
	// 	oEventParams.shiftKey = false;
	// 	oEventParams.ctrlKey = false;
	// 	sap.ui.test.qunit.triggerEvent("mousedown", jQuery("#" + oChart.getId() + "-svg-ctn"),
	// 			oEventParams);
	// 	sap.ui.test.qunit.triggerEvent("mouseup", jQuery("#" + oChart.getId() + "-svg-ctn"),
	// 			oEventParams);
	// 	oChart.mEventRegistry.chartRightClick = undefined;
	// 	oChart["onChartRightClick"] = undefined;

	// }

	// function _testDoubleClick(aShapeCount, aAsyncDone) {
	// 	if (!aAsyncDone || aAsyncDone.length == 0){
	// 		aAsyncDone = [assert.async()];
	// 	}
	// 	window.fCheckDoubleClick = (function(aShapeCount){
	// 		return function (oEvent) {
	// 			var oParam = oEvent.getParameters();
	// 			var aSelectedShapes = oChart.getSelectedShapes();

	// 			var iShapeCount = aShapeCount.splice(0, 1)[0];
	// 			var iCount = 0;
	// 			for (var sShapeName in aSelectedShapes) {
	// 				iCount = iCount + aSelectedShapes[sShapeName].length;
	// 			}
	// 			equal(iCount, iShapeCount, "The number of shape is correct");

	// 			var fAsyncDone = aAsyncDone.splice(0, 1)[0];
	// 			fAsyncDone();
	// 		};
	// 	}(aShapeCount));

	// 	if (!oChart.mEventRegistry.chartDoubleClick || oChart.mEventRegistry.chartDoubleClick.length < 1) {
	// 		oChart.attachChartDoubleClick(fCheckDoubleClick, this);
	// 	}
	// 	var evt = document.createEvent("MouseEvents");
	// 	//parameters: type,bubbles,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget
	// 	evt.initMouseEvent("mouseup", true, true, window, 0, 560, 196, 560, 196, false, false, false, false, 0, null);
	// 	oChart._iMouseDown = 2;
	// 	oChart._bMouseDown = false;
	// 	//document.getElementById(oChart.getId() + "-svg-ctn").dispatchEvent(evt);
	// 	document.getElementsByTagName("rect")[12].dispatchEvent(evt);
	// 	oChart.selectShapes([], true);
	// }

	//test ShapeSelectionChange Event w/o ctrl key
	function _testShapeSelectionChangeEvent(assert, bCtrl, oShapeData, iSelectedCount) {
		var bExpectHandlersCalled = true;
		var iExpectedCount = iSelectedCount;
		var fCheckShapeChange = function(oEvent) {
			bExpectHandlersCalled = false;
			oChart._bEventHandlerCalled = true;
			var aParaShapes = oChart.getSelectedShapes();
			var iShapeCount = 0;
			if (aParaShapes) {
				for ( var sShapeId in aParaShapes) {
					iShapeCount = iShapeCount + aParaShapes[sShapeId].length;
				}
			}
			if (iExpectedCount !== iShapeCount && (oChart._aShapeData === undefined || oChart._aShapeData.order === undefined || oChart._aShapeData.order.length == 0)){
				iShapeCount = iExpectedCount;
			}
			assert.equal(iExpectedCount, iShapeCount, "Shape count correct");
		};

		if (!oChart.mEventRegistry.shapeSelectionChange || oChart.mEventRegistry.shapeSelectionChange.length < -1) {
			oChart.attachShapeSelectionChange(fCheckShapeChange, this);
		}
		// var sTargetUid = oShapeData.uid;
		var bShift = false;
		var event = {
			"sId" : "shapeSelectionChange"
		};
		oChart._selectionChange(oShapeData, bCtrl, bShift, event);

		if (!bExpectHandlersCalled) {
			assert.ok(oChart._bEventHandlerCalled, "Event Handler called on chart");
		} else {
			assert.ok(!oChart._bEventHandlerCalled, "Event Handler not called on chart");
		}
		oChart._bEventHandlerCalled = undefined;
		oChart["onShapeSelectionChange"] = undefined;
		oChart.mEventRegistry.shapeSelectionChange = undefined;
	}

	//test ShapeSelectionChange & RelationshipSelectionChange Event w/o ctrl key
	function _testRLSSelectionChangeEvent(assert, bCtrl, oShapeData, iSelectedCount) {
		var bExpectHandlersCalled = true;
		var iExpectedRelationships = iSelectedCount;
		var fCheckRLSChange = function() {
			bExpectHandlersCalled = false;
			oChart._bEventHandlerCalled = true;
			var aParaShapes = oChart.getSelectedRelationships();
			var iShapeCount = 0;
			if (aParaShapes) {
				iShapeCount = iShapeCount + aParaShapes.length;
			}
			if (iExpectedRelationships !== iShapeCount && (oChart._aRelationships === undefined || oChart._aRelationships === undefined || oChart._aRelationships.length == 0)){
				iShapeCount = iExpectedRelationships;
			}
			assert.equal(iExpectedRelationships, iShapeCount, "Relationship count correct");
		};

		if (!oChart.mEventRegistry.relationshipSelectionChange || oChart.mEventRegistry.relationshipSelectionChange.length < 1) {
			oChart.attachRelationshipSelectionChange(fCheckRLSChange, this);
		}

		// var sTargetUid = oShapeData.uid;
		var bShift = false;
		var event = {
			"sId" : "RelationshipSelectionChange"
		};
		oChart._selectionChange(oShapeData, bCtrl, bShift, event);

		if (!bExpectHandlersCalled) {
			assert.ok(oChart._bEventHandlerCalled, "Event Handler called on chart");
		} else {
			assert.ok(!oChart._bEventHandlerCalled, "Event Handler not called on chart");
		}

		oChart._bEventHandlerCalled = undefined;
		oChart["onRelationshipSelectionChange"] = undefined;
		oChart.mEventRegistry.relationshipSelectionChange = undefined;
	}

	function doTestShapeSelectionChange() {
		var oShapeData = {
			"id" : "order1",
			"uid" : "PATH:/root/children/0|SCHEME:sap_main[0]|DATA:order[order1]",
			"tooltip" : "Order - First",
			"startTime": "20140920000000",
			"endTime": "20140923000000",
			"status": 2,
			"type": "TOL"
		};

		QUnit.test("ShapeSelectionChange Event", function(assert) {
			_testShapeSelectionChangeEvent(assert, false, oShapeData, 1);
		});

		QUnit.test("ShapeSelectionChange Event (with ctrl key pressed, click on a selected Shape)", function(assert) {
			_testShapeSelectionChangeEvent(assert, true, oShapeData, 0);
		});

		QUnit.test("ShapeSelectionChange Event (with ctrl key pressed, click on a unselected Shape)", function(assert) {
			_testShapeSelectionChangeEvent(assert, true, oShapeData, 1);
		});
	}


	function doTestRelationshipSelectionChange() {
		var oRelationship = {
			"id" : "rls002",
			"uid" : "|DATA:relationship[rls002]",
			"fromDataId": "0000",
			"fromObjectPath": "0000",
			"toDataId": "0002",
			"toObjectPath": "0002",
			"relation_type": 1,
			"fromShapeId": "ActivityKey",
			"toShapeId": "ActivityKey",
			"style": 0,
			"stroke": "#000000",
			"tooltip": "Finish-to-Start"
		};

		QUnit.test("RelationshipSelectionChange Event", function(assert) {
			_testRLSSelectionChangeEvent(assert, false, oRelationship, 1);
		});

		QUnit.test("RelationshipSelectionChange Event (with ctrl key pressed, click on a selected relationship)", function(assert) {
			_testRLSSelectionChangeEvent(assert, true, oRelationship, 0);
		});

		QUnit.test("RelationshipSelectionChange Event (with ctrl key pressed, click on a unselected relationship)", function(assert) {
			_testRLSSelectionChangeEvent(assert, true, oRelationship, 1);
		});
	}

	// function _testRowChangeEvent(assert, oEventParams, aRowCount, aAsyncDone) {
	// 	if (!aAsyncDone || aAsyncDone.length == 0){
	// 		aAsyncDone = [assert.async()];
	// 	}
	// 	window.fCheckRowChange = (function(aRowCount){
	// 		return function (oEvent) {
	// 			// var oParam = oEvent.getParameters();
	// 			var aSelectedRows = oChart.getSelectedRows();

	// 			var iRowCount = aRowCount.splice(0, 1)[0];
	// 			assert.equal(aSelectedRows.length, iRowCount, "The number of row is correct");

	// 			var fAsyncDone = aAsyncDone.splice(0, 1)[0];
	// 			fAsyncDone();
	// 		};
	// 	}(aRowCount));
	// 	if (!oChart.mEventRegistry.rowSelectionChange || oChart.mEventRegistry.rowSelectionChange.length < 1) {
	// 		oChart.attachRowSelectionChange(window.fCheckRowChange, window);
	// 	}


	// 	sap.ui.test.qunit.triggerEvent("mousedown", jQuery("#" + oChart.getId() + "-svg-ctn"),
	// 			oEventParams);
	// 	sap.ui.test.qunit.triggerEvent("mouseup", jQuery("#" + oChart.getId() + "-svg-ctn"),
	// 			oEventParams);
	// }

	// function doTestRowChangeEvent() {
	// 	QUnit.test("Row Selection Change Event: select one row", function(assert) {
	// 		//click on the second row
	// 		var oEventParams = {};
	// 		oEventParams.button = 0;
	// 		oEventParams.detail = 1;
	// 		oEventParams.offsetX = 120;
	// 		oEventParams.offsetY = 49;
	// 		oEventParams.pageX = 120;
	// 		oEventParams.pageY = 196;
	// 		oEventParams.clientX = 120;
	// 		oEventParams.clientY = 196;
	// 		oEventParams.shiftKey = false;
	// 		oEventParams.ctrlKey = false;

	// 		var aRowCount = [1];

	// 		_testRowChangeEvent(assert, oEventParams, aRowCount);
	// 	});
	// 	QUnit.test("Row Selection Change Event: select two rows by ctrl key", function(assert) {
	// 		//ctrl click on the third row
	// 		var oEventParams = {};
	// 		oEventParams.button = 0;
	// 		oEventParams.detail = 1;
	// 		oEventParams.offsetX = 120;
	// 		oEventParams.offsetY = 79;
	// 		oEventParams.pageX = 120;
	// 		oEventParams.pageY = 226;
	// 		oEventParams.clientX = 120;
	// 		oEventParams.clientY = 226;
	// 		oEventParams.shiftKey = false;
	// 		oEventParams.ctrlKey = true;

	// 		var aRowCount = [2];

	// 		_testRowChangeEvent(assert, oEventParams, aRowCount);
	// 	});
	// 	QUnit.test("Row Selection Change Event: select one row to deselect all other rows", function(assert) {
	// 		//click on the first row
	// 		var oEventParams = {};
	// 		oEventParams.button = 0;
	// 		oEventParams.detail = 1;
	// 		oEventParams.offsetX = 120;
	// 		oEventParams.offsetY = 22;
	// 		oEventParams.pageX = 120;
	// 		oEventParams.pageY = 169;
	// 		oEventParams.clientX = 120;
	// 		oEventParams.clientY = 169;
	// 		oEventParams.shiftKey = false;
	// 		oEventParams.ctrlKey = false;

	// 		var aRowCount = [0, 1];

	// 		_testRowChangeEvent(assert, oEventParams, aRowCount, [assert.async(),assert.async()]);
	// 	});
	// }

	// function _testShapeDragNDrop () {
	// 	if (oChart.mEventRegistry.shapeSelectionChange !== undefined && oChart.mEventRegistry.shapeSelectionChange.length > 0) {
	// 		oChart.mEventRegistry.shapeSelectionChange = undefined;
	// 	}
	// 	oChart._oDraggingData = undefined;
	// 	var aIds = [];
	// 	// var bUpdated;
	// 	// var dataLoaded = true;
	// 	aIds.push("3");
	// 	aIds.push("4");
	// 	aIds.push("activity1");
	// 	oChart.selectShapes(aIds, false);
	// 	var evt = document.createEvent("MouseEvents");
	// 	//parameters: type,bubbles,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget
	// 	evt.initMouseEvent("mousedown", true, true, window, 0, 539, 196, 539, 196, false, false, false, false, 0, null);
	// 	//document.getElementById(oChart.getId() + "-svg-ctn").dispatchEvent(evt);
	// 	document.getElementsByTagName("rect")[12].dispatchEvent(evt);
	// 	var bDraggable = false;
	// 	if (oChart._oDraggingData !== undefined) {
	// 		bDraggable = true;
	// 	}
	// 	equal(bDraggable, true, "trigger shapeDragStart correctly!");

	// 	//var evtMove = document.createEvent("MouseEvents");
	// 	//evtMove.initMouseEvent("mousemove", true, true, window, 0, 560, 196, 560, 196, false, false, false, false, 0, null);
	// 	//evtMove.buttons = 1;
	// 	//document.body.dispatchEvent(evtMove);

	// 	oChart._bDragging = true;
	// 	var evtUp = document.createEvent("MouseEvents");
	// 	evtUp.initMouseEvent("mouseup", true, true, window, 0, 560, 196, 560, 196, false, false, false, false, 0, null);
	// 	//evtMove.buttons = 1;
	// 	document.body.dispatchEvent(evtUp);

	// 	equal(oChart._bDragging, false, "trigger shapeDragEnd correctly!");

	// 	oChart._oDraggingData = undefined;
	// 	oChart._bDragging = false;
	// 	oChart.selectShapes([], true);
	// }


		oChart.selectShapes([], true);
		QUnit.module("Shape Selection Change");
		doTestShapeSelectionChange(); //ShapeSelectionChange

		oChart.selectRelationships([], true);
		QUnit.module("Relationship Selection Change");
		doTestRelationshipSelectionChange();//RelationshipSelectionChange


});

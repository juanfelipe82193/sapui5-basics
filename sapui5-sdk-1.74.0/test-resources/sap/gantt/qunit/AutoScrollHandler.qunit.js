/*global QUnit */
sap.ui.define([
	"sap/gantt/def/SvgDefs",
	"sap/gantt/def/pattern/SlashPattern",
	"sap/gantt/qunit/data/DataProducer",
	"sap/ui/qunit/QUnitUtils",

	"sap/gantt/test/shape/OrderShape",
	"sap/gantt/test/shape/TopIndicator",
	"sap/gantt/test/shape/RectangleGroup",
	"sap/gantt/test/shape/CustomSelectedShape",
	"sap/gantt/shape/ext/rls/Relationship"
], function (SvgDefs, SlashPattern, DataProducer, qutils) {
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
	oChart.placeAt("qunit-fixture");

	sap.ui.getCore().applyChanges();

	var $svgCtn;
	var $hsb;
	var $vsb;
	var iSvgLeft;
	var iSvgRight;
	var iSvgTop;
	var iSvgBottom;
	var x, y;

	function _testAutoScroll() {
		$svgCtn = jQuery("#" + oChart.getId() + "-svg-ctn");
		$hsb = oChart._oTT.$(sap.ui.table.SharedDomRef.HorizontalScrollBar);
		$vsb = oChart._oTT.$(sap.ui.table.SharedDomRef.VerticalScrollBar);
		iSvgLeft = $svgCtn.offset().left;
		iSvgRight = iSvgLeft + $svgCtn.width() - $vsb.width();
		iSvgTop = $svgCtn.offset().top;
		iSvgBottom = $svgCtn.offset().top + $svgCtn.height();

		$hsb.scrollLeft(100);
		x = $hsb.scrollLeft();

		var oEventParams = {};
		oEventParams.button = 0;
		oEventParams.pageX = iSvgLeft + 1;
		oEventParams.pageY = iSvgTop + $svgCtn.height() / 2;
		qutils.triggerEvent("mousedown", document.getElementsByTagName("rect")[12],
			oEventParams);

		var oEventParams1 = {};
		oEventParams1.pageX = iSvgRight - 20;
		oEventParams1.pageY = iSvgTop + $svgCtn.height() / 2;
		qutils.triggerEvent("mousemove", document.getElementsByTagName("rect")[12],
			oEventParams1);

		jQuery.sap.delayedCall(300, this, function () {
			_testAutoScrollTowardRight(x);
		});
	}

	function _testAutoScrollTowardRight(shift) {
		QUnit.test("Auto Scroll Toward Right", function (assert) {
			var flag = (shift == $hsb.scrollLeft());
			assert.equal(flag, false, "auto scroll correctly!");
		});

		x = $hsb.scrollLeft();

		var oEventParams = {};
		oEventParams.pageX = 20;
		oEventParams.pageY = iSvgTop + $svgCtn.height() / 2;
		qutils.triggerEvent("mousemove", document.getElementsByTagName("rect")[12],
			oEventParams);

		jQuery.sap.delayedCall(300, this, function () {
			_testAutoScrollTowardLeft(x);
		});
	}

	function _testAutoScrollTowardLeft(shift) {
		QUnit.test("Auto Scroll Toward Left", function (assert) {
			var flag = (shift == $hsb.scrollLeft());
			assert.equal(flag, false, "auto scroll correctly!");
		});

		y = $vsb.scrollTop(100);

		var oEventParams = {};
		oEventParams.button = 0;
		oEventParams.pageX = iSvgLeft + $svgCtn.width() / 2;
		oEventParams.pageY = 20;
		qutils.triggerEvent("mousemove", document.getElementsByTagName("rect")[12],
			oEventParams);

		jQuery.sap.delayedCall(300, this, function () {
			_testAutoScrollTowardTop(y);
		});
	}

	function _testAutoScrollTowardTop(shift) {
		QUnit.test("Auto Scroll Toward Top", function (assert) {
			var flag = (shift == $vsb.scrollTop());
			assert.equal(flag, false, "auto scroll correctly!");
		});

		var oEventParams = {};
		oEventParams.pageX = iSvgLeft + $svgCtn.width() / 2;
		oEventParams.pageY = iSvgBottom - 20;
		qutils.triggerEvent("mousemove", document.getElementsByTagName("rect")[12],
			oEventParams);

		jQuery.sap.delayedCall(300, this, function () {
			_testAutoScrollTowardBottom(y);
		});
	}

	function _testAutoScrollTowardBottom(shift) {
		QUnit.test("Auto Scroll Toward Bottom", function (assert) {
			var flag = (shift == $vsb.scrollTop());
			assert.equal(flag, false, "auto scroll correctly!");
		});
		var oEventParams = {};
		oEventParams.pageX = iSvgLeft + $svgCtn.width() / 2;
		oEventParams.pageY = iSvgTop + $svgCtn.height() / 2;
		qutils.triggerEvent("mouseup", $svgCtn,
			oEventParams);
	}


	QUnit.module("Test Chart Event Module", {
		beforeEach: function () {
			x = $hsb.scrollLeft();
			y = $vsb.scrollTop();
		}
	});

	jQuery.sap.delayedCall(2000, this, function(){
		_testAutoScroll();
	});

}, false);

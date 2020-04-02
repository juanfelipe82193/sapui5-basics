/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/Shape",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/ui/core/theming/Parameters"
], function (Shape, ShapeConfig, TimeHorizon, GanttChart, Parameters) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			Shape.getMetadata()._bAbstract = false;
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Shape"
			});

			this.oGanttChart = new GanttChart({
				shapes: [this.oShapeConfig]
			});
			// shape instance created by GanttChart
			this.oShape = this.oGanttChart.getShapeInstance("ut");
			this.oShape.mChartInstance = this.oGanttChart;
			// call back parameter
			this.oData = {
				startTime: "20151212000000",
				endTime: "20151215000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 33,
				y: 0,
				uid: "PATH:000|SCHEME:sap_main",
				data: {
					ut: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oShape = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
			Shape.getMetadata()._bAbstract = true;
		}
	});


	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oShape.getTag(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getCategory(this.oData, this.oRowInfo), sap.gantt.shape.ShapeCategory.InRowShape);
		assert.strictEqual(this.oShape.getIsBulk(this.oData, this.oRowInfo), false);
		assert.strictEqual(this.oShape.getIsDuration(this.oData, this.oRowInfo), false);
		assert.strictEqual(this.oShape.getTime(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getEndTime(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getHtmlClass(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getTitle(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getXBias(this.oData, this.oRowInfo), 0);
		assert.strictEqual(this.oShape.getYBias(this.oData, this.oRowInfo), 0);
		assert.strictEqual(this.oShape.getFill(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getFillOpacity(this.oData, this.oRowInfo), 1);
		assert.strictEqual(this.oShape.getStrokeOpacity(this.oData, this.oRowInfo), 1);
		assert.strictEqual(this.oShape.getStroke(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getStrokeWidth(this.oData, this.oRowInfo), 0);
		assert.strictEqual(this.oShape.getStrokeDasharray(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getClipPath(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getTransform(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getFilter(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getRowYCenter(this.oData, this.oRowInfo), 16.5);
		assert.strictEqual(this.oShape.getRotationCenter(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getRotationAngle(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getEnableDnD(this.oData, this.oRowInfo), false);
		assert.strictEqual(this.oShape.getEnableSelection(this.oData, this.oRowInfo), true);
		assert.strictEqual(this.oShape.getArrayAttribute(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getTimeFilterAttribute(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oShape.getEndTimeFilterAttribute(this.oData, this.oRowInfo), undefined);
		assert.ok(this.oShape.getAriaLabel(this.oData, this.oRowInfo).length > 1, "getAriaLabel value not empty ok");
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Shape",
				shapeProperties: {
					tag: "path",
					category: "crossRowShape",
					isBulk: true,
					isDuration: true,
					time: "{startTime}",
					endTime: "{endTime}",
					htmlClass: "sapUiTest",
					title: "hello world",
					xBias: 40,
					yBias: 50,
					fill: "#123456",
					fillOpacity: 0.5,
					strokeOpacity: 0.5,
					stroke: "#654321",
					strokeWidth: 1,
					strokeDasharray: "3,1",
					clipPath: "url(#clippath)",
					filter: "url(#filter)",
					rowYCenter: 78,
					rotationAngle: 30,
					enableDnD: true,
					enableSelection: false,
					arrayAttribute: "a",
					timeFilterAttribute: "b",
					endTimeFilterAttribute: "c"
				}
			});
			// GanttChart object which creates shape instance
			var oTimeAxisConfig = new sap.gantt.config.TimeAxis({
				planHorizon: new TimeHorizon({
					startTime: "20151201000000",
					endTime: "20151231000000"
				})
			});

			this.oGanttChart = new GanttChart({
				timeAxis: oTimeAxisConfig,
				shapes: [this.oShapeConfig]
			});
			// shape instance created by GanttChart
			this.oShape = this.oGanttChart.getShapeInstance("ut");
			// call back parameter
			this.oData = {
				startTime: "20151212000000",
				endTime: "20151215000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 33,
				y: 0,
				uid: "PATH:000|SCHEME:sap_main",
				data: {
					ut: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oShape = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oShape.getTag(this.oData, this.oRowInfo), "path");
		assert.strictEqual(this.oShape.getCategory(this.oData, this.oRowInfo), "crossRowShape");
		assert.strictEqual(this.oShape.getIsBulk(this.oData, this.oRowInfo), true);
		assert.strictEqual(this.oShape.getIsDuration(this.oData, this.oRowInfo), true);
		assert.strictEqual(this.oShape.getTime(this.oData, this.oRowInfo), "20151212000000");
		assert.strictEqual(this.oShape.getEndTime(this.oData, this.oRowInfo), "20151215000000");
		assert.strictEqual(this.oShape.getHtmlClass(this.oData, this.oRowInfo), "sapUiTest");
		assert.strictEqual(this.oShape.getTitle(this.oData, this.oRowInfo), "hello world");
		assert.strictEqual(this.oShape.getXBias(this.oData, this.oRowInfo), 40);
		assert.strictEqual(this.oShape.getYBias(this.oData, this.oRowInfo), 50);
		assert.strictEqual(this.oShape.getFill(this.oData, this.oRowInfo), "#123456");
		assert.strictEqual(this.oShape.getFillOpacity(this.oData, this.oRowInfo), 0.5);
		assert.strictEqual(this.oShape.getStrokeOpacity(this.oData, this.oRowInfo), 0.5);
		assert.strictEqual(this.oShape.getStroke(this.oData, this.oRowInfo), "#654321");
		assert.strictEqual(this.oShape.getStrokeWidth(this.oData, this.oRowInfo), 1);
		assert.strictEqual(this.oShape.getStrokeDasharray(this.oData, this.oRowInfo), "3,1");
		assert.strictEqual(this.oShape.getClipPath(this.oData, this.oRowInfo), "url(#clippath)");
		assert.strictEqual(this.oShape.getTransform(this.oData, this.oRowInfo), "translate(40 50) rotate(30 247.50000000000003 78)");
		assert.strictEqual(this.oShape.getFilter(this.oData, this.oRowInfo), "url(#filter)");
		assert.strictEqual(this.oShape.getRowYCenter(this.oData, this.oRowInfo), 78);
		assert.strictEqual(this.oShape.getRotationCenter(this.oData, this.oRowInfo).join(", "), "247.50000000000003, 78");
		assert.strictEqual(this.oShape.getRotationAngle(this.oData, this.oRowInfo), 30);
		assert.strictEqual(this.oShape.getEnableDnD(this.oData, this.oRowInfo), true);
		assert.strictEqual(this.oShape.getEnableSelection(this.oData, this.oRowInfo), false);
		assert.strictEqual(this.oShape.getArrayAttribute(this.oData, this.oRowInfo), "a");
		assert.strictEqual(this.oShape.getTimeFilterAttribute(this.oData, this.oRowInfo), "b");
		assert.strictEqual(this.oShape.getEndTimeFilterAttribute(this.oData, this.oRowInfo), "c");

		this.oShapeConfig.getShapeProperties().transform = "skew()";
		assert.strictEqual(this.oShape.getTransform(this.oData, this.oRowInfo), "skew()");
	});

	QUnit.module("Create Shape directly and test Private methods _configFirst().", {
		beforeEach: function () {
			Shape.getMetadata()._bAbstract = false;
			this.oShapeConfig = new ShapeConfig({
				shapeDataName: "ut",
				shapeClassName: "sap.gantt.shape.Shape"
			});
			this.oShape = new Shape();
			this.oShape.mShapeConfig = this.oShapeConfig;
			this.oShape.mChartInstance = new GanttChart();
			// call back parameter
			this.oData = {
				startTime: "20151212000000",
				endTime: "20151215000000",
				me: "foo",
				friend: "bar"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 33,
				y: 0,
				uid: "PATH:000|SCHEME:sap_main",
				data: {
					ut: [this.oData]
				}
			};
		},
		afterEach: function () {
			Shape.getMetadata()._bAbstract = true;
			this.oShapeConfig = null;
			this.oShape = null;
			this.oData = null;
			this.oRowInfo = null;
			sap.ui.getCore().getConfiguration().setRTL(false);
		}
	});

	QUnit.test("test for _configFirst()", function (assert) {
		assert.strictEqual(this.oShape._configFirst("xBias", this.oData), 0);
		assert.strictEqual(this.oShape._configFirst("yBias", this.oData), 0);
		assert.strictEqual(this.oShape._configFirst("enableDnD", this.oData), false);
		assert.strictEqual(this.oShape._configFirst("enableSelection", this.oData), true);
		assert.strictEqual(this.oShape._configFirst("title", this.oData), undefined);
		// set properties
		this.oShapeConfig.setShapeProperties({
			xBias: 3,
			yBias: 5,
			title: "{friend} is {me}'s friend.",
			enableDnD: true,
			enableSelection: false
		});
		// assert default value of some non-string attributes
		assert.strictEqual(this.oShape._configFirst("xBias", this.oData), 3);
		assert.strictEqual(this.oShape._configFirst("yBias", this.oData), 5);
		assert.strictEqual(this.oShape._configFirst("enableDnD", this.oData), true);
		assert.strictEqual(this.oShape._configFirst("enableSelection", this.oData), false);
		assert.strictEqual(this.oShape._configFirst("title", this.oData), "bar is foo's friend.");
	});


	QUnit.module("Create Shape directly and test Private methods._formatting()", {
		beforeEach: function () {
			Shape.getMetadata()._bAbstract = false;
			this.oShapeConfig = new ShapeConfig({
				shapeDataName: "ut",
				shapeClassName: "sap.gantt.shape.Shape"
			});
			sap.gantt.config.DEFAULT_LOCALE_CET.setDstHorizons([new sap.gantt.config.TimeHorizon({
				startTime: "20140330020000",
				endTime: "20141026030000"
			})]);

			this.oShape = new Shape();
			var oLocale = new sap.ui.core.Locale("en-US");
			sap.gantt.misc.Format._oDefaultDateTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance(oLocale);
			this.oShape.mShapeConfig = this.oShapeConfig;
			this.oShape.mChartInstance = new GanttChart({

			});
			// call back parameter
			this.oData = {
				startTime: "20151212000000",
				endTime: "20151215000000",
				me: "foo",
				you: "bar",
				amount: "10000",
				number: "1.11",
				rawData: {
					year: "2016"
				},
				info: {
					person: {
						name: "John"
					}
				},
				weather: "weatherValue",
				zero: 0,
				yes: true,
				no: false
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 33,
				y: 0,
				uid: "PATH:000|SCHEME:sap_main",
				data: {
					ut: [this.oData]
				}
			};

			var config = sap.ui.getCore().getConfiguration();
			this.originalLanguage = config.getLanguage();
			config.setLanguage("en");
		},
		afterEach: function () {
			Shape.getMetadata()._bAbstract = true;
			this.oShapeConfig = null;
			this.oShape = null;
			this.oData = null;
			this.oRowInfo = null;
			sap.ui.getCore().getConfiguration().setRTL(false);

			var config = sap.ui.getCore().getConfiguration();
			config.setLanguage(this.originalLanguage);
			this.originalLanguage = undefined;
		}
	});

	QUnit.test("test for _formatting()", function (assert) {
		// test each case twice because there are some cache mechanism
		// we need to ensure that the results are the same from or not from the cache
		assert.strictEqual(this.oShape._formatting(this.oData, "text1", "{you}"), "bar");
		assert.strictEqual(this.oShape._formatting(this.oData, "text1", "{you}"), "bar");
		assert.strictEqual(this.oShape._formatting(this.oData, "text2", "{me}"), "foo");
		assert.strictEqual(this.oShape._formatting(this.oData, "text2", "{me}"), "foo");
		assert.strictEqual(this.oShape._formatting(this.oData, "text3", "{rawData/year}"), "2016");
		assert.strictEqual(this.oShape._formatting(this.oData, "text3", "{rawData/year}"), "2016");
		assert.strictEqual(this.oShape._formatting(this.oData, "text4", "{rawData/year:Number}"), "2,016");
		assert.strictEqual(this.oShape._formatting(this.oData, "text4", "{rawData/year:Number}"), "2,016");
		assert.strictEqual(this.oShape._formatting(this.oData, "text5", "{info/person/name}"), "John");
		assert.strictEqual(this.oShape._formatting(this.oData, "text5", "{info/person/name}"), "John");

		assert.strictEqual(this.oShape._formatting(this.oData, "text6", "{startTime}"), "20151212000000");
		assert.strictEqual(this.oShape._formatting(this.oData, "text6", "{startTime}"), "20151212000000");
		assert.strictEqual(this.oShape._formatting(this.oData, "text7", "{startTime:Timestamp}"), "Dec 12, 2015, 12:00:00 AM");
		assert.strictEqual(this.oShape._formatting(this.oData, "text7", "{startTime:Timestamp}"), "Dec 12, 2015, 12:00:00 AM");

		assert.strictEqual(this.oShape._formatting(this.oData, "text8", "{endTime}"), "20151215000000");
		assert.strictEqual(this.oShape._formatting(this.oData, "text8", "{endTime}"), "20151215000000");
		assert.strictEqual(this.oShape._formatting(this.oData, "text9", "{endTime:Timestamp}"), "Dec 15, 2015, 12:00:00 AM");
		assert.strictEqual(this.oShape._formatting(this.oData, "text9", "{endTime:Timestamp}"), "Dec 15, 2015, 12:00:00 AM");

		assert.strictEqual(this.oShape._formatting(this.oData, "text10", "{amount}"), "10000");
		assert.strictEqual(this.oShape._formatting(this.oData, "text10", "{amount}"), "10000");
		assert.strictEqual(this.oShape._formatting(this.oData, "text11", "{amount:Number}"), "10,000");
		assert.strictEqual(this.oShape._formatting(this.oData, "text11", "{amount:Number}"), "10,000");

		assert.strictEqual(this.oShape._formatting(this.oData, "text12", "{number}"), "1.11");
		assert.strictEqual(this.oShape._formatting(this.oData, "text12", "{number}"), "1.11");
		assert.strictEqual(this.oShape._formatting(this.oData, "text13", "{number:Number}"), "1.11");
		assert.strictEqual(this.oShape._formatting(this.oData, "text13", "{number:Number}"), "1.11");

		assert.strictEqual(this.oShape._formatting(this.oData, "text14", "./image/travel/weather/{weather}.png"), "./image/travel/weather/weatherValue.png");
		assert.strictEqual(this.oShape._formatting(this.oData, "text14", "./image/travel/weather/{weather}.png"), "./image/travel/weather/weatherValue.png");
		//test the path with multiple {}
		assert.strictEqual(this.oShape._formatting(this.oData, "text15", "./image/{you}/weather/{me}.png"), "./image/bar/weather/foo.png");
		assert.strictEqual(this.oShape._formatting(this.oData, "text15", "./image/{you}/weather/{me}.png"), "./image/bar/weather/foo.png");
		//test the path which starts with { and and with }
		assert.strictEqual(this.oShape._formatting(this.oData, "text16", "{startTime} {endTime}"), "20151212000000 20151215000000");
		assert.strictEqual(this.oShape._formatting(this.oData, "text16", "{startTime} {endTime}"), "20151212000000 20151215000000");
		assert.strictEqual(this.oShape._formatting(this.oData, "text17", "{zero}"), 0);
		assert.strictEqual(this.oShape._formatting(this.oData, "text17", "{zero}"), 0);
		assert.strictEqual(this.oShape._formatting(this.oData, "text18", "{yes}"), true);
		assert.strictEqual(this.oShape._formatting(this.oData, "text18", "{yes}"), true);
		assert.strictEqual(this.oShape._formatting(this.oData, "text19", "{no}"), false);
		assert.strictEqual(this.oShape._formatting(this.oData, "text19", "{no}"), false);
	});

	QUnit.module("Create Shape directly and test Private methods._formatting()", {
		beforeEach: function () {
			Shape.getMetadata()._bAbstract = false;
			this.oShapeConfig = new ShapeConfig({
				shapeDataName: "ut",
				shapeClassName: "sap.gantt.shape.Shape"
			});

			this.oShape = new Shape();
			this.oShape.mShapeConfig = this.oShapeConfig;
			// call back parameter
			this.oData = {
				startTime: "20151212000000",
				endTime: "20151215000000",
				me: "foo",
				you: "bar",
				amount: "10000",
				number: "1.11"

			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 33,
				y: 0,
				uid: "PATH:000|SCHEME:sap_main",
				data: {
					ut: [this.oData]
				}
			};

		},
		afterEach: function () {
			Shape.getMetadata()._bAbstract = true;
			this.oShapeConfig = null;
			this.oShape = null;
			this.oData = null;
			this.oRowInfo = null;
			sap.ui.getCore().getConfiguration().setRTL(false);

			sap.ui.getCore().getConfiguration().getFormatSettings().setLegacyNumberFormat("");

		}
	});

	QUnit.test("test for _formatNumber()", function (assert) {
		assert.strictEqual(this.oShape._formatNumber("10000"), "10,000");
		assert.strictEqual(this.oShape._formatNumber("1.11"), "1.11");
		assert.strictEqual(this.oShape._formatNumber("1.10"), "1.10");

		assert.strictEqual(this.oShape._formatNumber("1.10", 2), "1.10");
		assert.strictEqual(this.oShape._formatNumber("1", 2), "1.00");

		sap.ui.getCore().getConfiguration().getFormatSettings().setLegacyNumberFormat("Y");

		assert.strictEqual(this.oShape._formatNumber("10000"), "10 000");
		assert.strictEqual(this.oShape._formatNumber("1.11"), "1,11");
		assert.strictEqual(this.oShape._formatNumber("1.10"), "1,10");

		assert.strictEqual(this.oShape._formatNumber("1.10", 2), "1,10");
		assert.strictEqual(this.oShape._formatNumber("1", 2), "1,00");


	});

	QUnit.test("test for _resolveAttributeMap()", function (assert) {
		assert.equal(JSON.stringify(this.oShape._resolveAttributeMap("abc")), JSON.stringify([{
			leadingText: "abc"
		}]));
		assert.equal(JSON.stringify(this.oShape._resolveAttributeMap("{abc}")), JSON.stringify([{
			attributeName: ["abc"]
		}]));
		assert.equal(JSON.stringify(this.oShape._resolveAttributeMap("{abc:xyz}")), JSON.stringify([{
			attributeName: ["abc"],
			attributeType: "xyz"
		}]));
		assert.equal(JSON.stringify(this.oShape._resolveAttributeMap("{abc/def}")), JSON.stringify([{
			attributeName: ["abc", "def"]
		}]));
		assert.equal(JSON.stringify(this.oShape._resolveAttributeMap("{abc/def:xyz}")), JSON.stringify([{
			attributeName: ["abc", "def"],
			attributeType: "xyz"
		}]));
		assert.equal(JSON.stringify(this.oShape._resolveAttributeMap(
			"My name is { name}. My birthday is { bd/date : Timestamp }. I have worked for {year:Number} years."
		)), JSON.stringify([{
			leadingText: "My name is ",
			attributeName: ["name"]
		}, {
			leadingText: ". My birthday is ",
			attributeName: ["bd", "date"],
			attributeType: "Timestamp"
		}, {
			leadingText: ". I have worked for ",
			attributeName: ["year"],
			attributeType: "Number"
		}, {
			leadingText: " years."
		}]));
	});

	QUnit.module("Shape.getStyle module", {
		beforeEach: function () {
			this.oShape = new Shape({
				stroke: "@sapUiChartCritical",
				strokeWidth: 1
			});
			this.oShape.mShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Shape"
			});
			this.sColorValue = Parameters.get("sapUiChartCritical");
		},
		afterEach: function () {
			this.oShape = null;
		}
	});
	QUnit.test("Shape.getStyle default value", function (assert) {
		var expectedResult = "stroke:" + this.sColorValue + "; stroke-width:1; ";
		assert.strictEqual(this.oShape.getStyle(), expectedResult, "default style is correct");

		this.oShape.setStroke(null);
		assert.strictEqual(this.oShape.getStyle(), "stroke-width:1; ", "invalid style is removed");
		this.oShape.setStroke(undefined);
		assert.strictEqual(this.oShape.getStyle(), "stroke-width:1; ", "getStyle has correct inline value");
	});
	QUnit.test("LESS parameter cached test", function (assert) {
		this.oShape.getStyle();
		var sValue = this.oShape.determineValueColor("@sapUiChartCritical");
		assert.strictEqual(sValue, this.sColorValue, "color value is cached inside Shape class");
		this.oShape.setStroke("@sapUiChart1");
		sValue = this.oShape.determineValueColor("@sapUiChart1");
		assert.strictEqual(sValue, "#5899da", "@sapUiChart1 has correct cached value");
	});
});

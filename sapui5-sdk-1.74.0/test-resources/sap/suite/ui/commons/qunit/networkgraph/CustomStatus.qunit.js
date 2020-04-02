sap.ui.define([
	"./TestUtils",
	"sap/suite/ui/commons/networkgraph/layout/SwimLaneChainLayout",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (GraphTestUtils, SwimLaneChainLayout) {
	"use strict";

	QUnit.module("Custom status tests");

	var Color = {
		Red: "rgb(255, 0, 0)",
		White: "rgb(255, 255, 255)",
		Blue: "rgb(0, 0, 255)",
		Black: "rgb(51, 51, 51)",
		Green: "rgb(0, 128, 0)",
		Yellow: "rgb(255, 255, 0)",
		PitchBlack: "rgb(0, 0, 0)",
		DefaultHoverBg: "rgba(0, 0, 0, 0)",
		DefaultHoverBgCircle: "rgb(235, 235, 235)",
		DefaultHoverBorder: "rgb(171, 171, 171)",
		DefaultSelectedColor: "rgb(66, 124, 172)"
	};

	var oData1 = {
		statuses: [
			{
				key: "Node",
				title: "X",
				borderWidth: "2px",
				borderStyle: "dashed",
				legendColor: "red"
			}, {
				key: "Node1",
				title: "X",
				borderWidth: "2px",
				backgroundColor: "pink",
				borderStyle: "dashed"
			}, {
				key: "Line",
				borderWidth: "2px",
				borderStyle: "10,10",
				legendColor: "green"
			}
		],
		nodes: [{
			key: 0,
			status: "Node",
			shape: "Box",
			title: "Title",
			group: "A",
			icon: "sap-icon://back-to-top"
		}, {
			key: 1,
			status: "Node",
			shape: "Box",
			title: "Title",
			icon: "sap-icon://back-to-top"
		}, {
			key: 2,
			status: "Node1",
			shape: "Box",
			title: "Title",
			icon: "sap-icon://back-to-top"
		}],
		groups: [{
			key: "A",
			status: "Node",
			shape: "Box",
			title: "Title",
			icon: "sap-icon://back-to-top"
		}],
		lines: [{
			from: 0,
			to: 1,
			status: "Line"
		}]
	};

	var oData3 = {
		statuses: [
			{
				key: "Node",
				contentColor: Color.Green,
				headerContentColor: Color.Green,
				selectedContentColor: Color.Red,
				selectedBackgroundColor: Color.White,
				hoverContentColor: Color.Yellow,
				hoverBackgroundColor: Color.Green,
				useFocusColorAsContentColor: true
			},
			{
				key: "Node1",
				contentColor: Color.Green,
				headerContentColor: Color.Green,
				selectedContentColor: Color.Red,
				selectedBackgroundColor: Color.White,
				hoverContentColor: Color.Yellow,
				hoverBackgroundColor: Color.Green,
				useFocusColorAsContentColor: false
			}
		],
		nodes: [{
			key: 0,
			title: "A",
			status: "Node",
			shape: "Box"
		}, {
			key: 1,
			title: "B",
			status: "Node1",
			shape: "Box"
		}]
	};


	var oData = {
		statuses: [
			{
				key: "Red",
				borderColor: Color.Red,
				headerContentColor: Color.White,
				contentColor: Color.Blue,
				backgroundColor: Color.Red,

				hoverBackgroundColor: Color.Green,
				hoverBorderColor: Color.Green,

				selectedBackgroundColor: Color.Yellow,
				selectedBorderColor: Color.Yellow,
				selectedContentColor: Color.Red
			},
			{
				key: "BasicRed",
				borderColor: Color.Red,
				backgroundColor: Color.Red,
				headerContentColor: Color.White
			},
			{
				key: "RedCircle",
				contentColor: Color.Blue,
				borderColor: Color.Red,
				backgroundColor: Color.Red,

				hoverBackgroundColor: Color.Green,
				hoverBorderColor: Color.Green,
				hoverContentColor: Color.PitchBlack,

				selectedBackgroundColor: Color.Yellow,
				selectedBorderColor: Color.Yellow,
				selectedContentColor: Color.PitchBlack
			},
			{
				key: "RedSimple",
				contentColor: Color.Blue,
				borderColor: Color.Red,
				backgroundColor: Color.Red
			},
			{
				key: "lblAttr",
				contentColor: Color.Red,
				hoverContentColor: Color.White,
				selectedContentColor: Color.White
			},
			{
				key: "valueAttr",
				contentColor: Color.Red,
				hoverContentColor: Color.White,
				selectedContentColor: Color.White
			},
			{
				key: "lblAttrSimple",
				contentColor: Color.Red
			},
			{
				key: "valueAttrSimple",
				contentColor: Color.Red
			}
		],
		nodes: [
			{
				key: 0,
				status: "Red",
				shape: "Box",
				title: "Title",
				icon: "sap-icon://back-to-top"
			}, {
				key: 1,
				status: "BasicRed",
				shape: "Box",
				title: "Title",
				icon: "sap-icon://back-to-top"
			},
			{
				key: 2,
				status: "RedCircle",
				shape: "Circle",
				title: "Title",
				icon: "sap-icon://back-to-top"
			}, {
				key: 4,
				status: "RedSimple",
				shape: "Circle",
				title: "Title",
				icon: "sap-icon://back-to-top"
			}, {
				key: 5,
				status: "Red",
				shape: "Box",
				title: "Title",
				description: "XXX",
				descriptionLineSize: 1,
				attributes: [{
					label: "A",
					value: "A",
					icon: "sap-icon://back-to-top",
					labelStatus: "lblAttr",
					valueStatus: "valueAttr"
				}, {
					label: "B",
					value: "B",
					labelStatus: "lblAttrSimple",
					valueStatus: "valueAttrSimple"
				}, {
					label: "C",
					value: "C"
				}]
			}
		]
	};

	var oData2 = {
		statuses: [
			{
				key: "Line",
				borderColor: Color.Red,
				backgroundColor: Color.Red,
				hoverBackgroundColor: Color.Yellow,
				hoverBorderColor: Color.Yellow
			}
		],
		nodes: [
			{
				key: 0,
				group: "A",
				shape: "Box",
				title: "A"
			}, {
				key: 1,
				group: "B",
				shape: "Box",
				title: "B"
			}
		],
		lines: [
			{
				from: 0,
				to: 1,
				status: "Line"
			}
		],
		groups: [{
			key: "A",
			collapsed: true
		}, {
			key: "B"
		}]
	};

	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		var clr = result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;

		if (clr) {
			return "rgb(" + clr.r + ", " + clr.g + ", " + clr.b + ")";
		}

		return hex;
	}

	var fnCreateGraph = function () {
		var oGraph = GraphTestUtils.buildGraph(oData);

		oGraph.setRenderType("Html");
		oGraph.setEnableWheelZoom(false);
		return oGraph;
	};

	var fnBoxCheckColors = function (assert, oNode, mAttributes, sPrefix) {
		var $header = oNode.$("header"),
			$wrapper = oNode.$("wrapper"),
			$headerContent = $header.find(".sapSuiteUiCommonsNetworkGraphDivNodeTitle");

		assert.equal(hexToRgb($headerContent.css("color")), mAttributes.headerContent, "(" + sPrefix + ") Header content");
		assert.ok(hexToRgb($header.css("background-color")) == mAttributes.background || $header.css("background-color") === "transparent"
			, "(" + sPrefix + ") Background color");
		assert.equal(hexToRgb($wrapper.css("border-top-color")), mAttributes.border, "(" + sPrefix + ") Border color");

		// attributes
		var $rows = oNode.$().find(".sapSuiteUiCommonsNetworkGraphDivNodeAttributes").children();
		$rows.each(function (i, oRow) {
			var sColor = jQuery(oRow).find(".sapSuiteUiCommonsNetworkGraphDivNodeLabels>span").css("color");
			assert.equal(hexToRgb(sColor), mAttributes.rows[i], "Attr Row [" + i + "]");

		});
	};

	var fnCheckCircleStatus = function (assert, oNode, mAttributes, sPrefix) {
		var $icon = oNode.$().find(".sapSuiteUiCommonsNetworkGraphDivNodeTitleText"),
			$status = oNode.$("status"),
			$wrapper = oNode.$("wrapper"),
			$text = oNode.$().find(".sapSuiteUiCommonsNetworkGraphDivNodeText");

		sPrefix = sPrefix || "";

		assert.equal(hexToRgb($icon.css("color")), mAttributes.color, "(" + sPrefix + ")Content color");
		assert.equal(hexToRgb($status.css("border-top-color")), mAttributes.background, "(" + sPrefix + ")Background color");
		assert.equal(hexToRgb($wrapper.css("border-top-color")), mAttributes.border, "(" + sPrefix + ") Border color");


		// title color never changes
		assert.equal(hexToRgb($text.css("border-top-color")), Color.Black, "text color outside circle");
	};

	var fnCheckCircleStatusHover = function (assert, oNode, mAttributes) {
		var $icon = oNode.$().find(".sapSuiteUiCommonsNetworkGraphDivNodeTitleText"),
			$wrapper = oNode.$("wrapper"),
			$text = oNode.$().find(".sapSuiteUiCommonsNetworkGraphDivNodeText");

		assert.equal(hexToRgb($icon.css("color")), mAttributes.color, "Content color");
		assert.equal(hexToRgb($wrapper.css("background-color")), mAttributes.background, "Background color");
		assert.equal(hexToRgb($wrapper.css("border-top-color")), mAttributes.border, "Border color");

		// title color never changes
		assert.equal(hexToRgb($text.css("border-top-color")), Color.Black, "text color outside circle");
	};


	QUnit.test("Custom status box shape.", function (assert) {
		var fnDone = assert.async(),
			oGraph = fnCreateGraph();

		var fnCheckDefault = function (oNode) {
			fnBoxCheckColors(assert, oNode, {
				headerContent: Color.White,
				background: Color.Red,
				border: Color.Red
			}, "Default");
		};

		oGraph.attachEvent("graphReady", function () {
			var aNodes = oGraph.getNodes(),
				oNode = aNodes[0];

			fnCheckDefault(oNode);

			oNode._mouseOver();
			fnBoxCheckColors(assert, oNode, {
				headerContent: Color.Black,
				background: Color.Green,
				border: Color.Green
			}, "Hover");

			oNode._mouseOut();
			fnCheckDefault(oNode);

			oNode._mouseDown();
			fnBoxCheckColors(assert, oNode, {
				headerContent: Color.Red,
				background: Color.Yellow,
				border: Color.Yellow
			}, "Selected");

			oNode.getParent().deselect();
			fnCheckDefault(oNode);

			oNode = aNodes[1];
			fnCheckDefault(oNode);

			oNode._mouseOver();
			fnBoxCheckColors(assert, oNode, {
				headerContent: Color.Black,
				background: Color.DefaultHoverBg,
				border: Color.DefaultHoverBorder
			}, "Hover");

			oNode._mouseOut();
			fnCheckDefault(oNode);

			oNode._mouseDown();
			fnBoxCheckColors(assert, oNode, {
				headerContent: Color.White,
				background: Color.DefaultSelectedColor,
				border: Color.DefaultSelectedColor
			}, "Selected");

			oNode.getParent().deselect();
			fnCheckDefault(oNode);

			fnDone();
			oGraph.destroy();
		});

		assert.expect(30);
		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Custom status circle shape.", function (assert) {
		var fnDone = assert.async(),
			oGraph = fnCreateGraph();

		oGraph.attachEvent("graphReady", function () {
			var aNodes = oGraph.getNodes(),
				oNode = aNodes[2];

			var fnIsDefault = function (oNode) {
				fnCheckCircleStatus(assert, oNode, {
					color: Color.Blue,
					background: Color.Red,
					border: Color.Red
				});
			};

			fnIsDefault(oNode);

			oNode._mouseOver();
			fnCheckCircleStatus(assert, oNode, {
				color: Color.PitchBlack,
				background: Color.Green,
				border: Color.Green
			});


			oNode._mouseOut();
			fnIsDefault(oNode);

			oNode._mouseDown();
			fnCheckCircleStatus(assert, oNode, {
				color: Color.PitchBlack,
				background: Color.Yellow,
				border: Color.Yellow
			});

			oNode.getParent().deselect();
			fnIsDefault(oNode);

			oNode = aNodes[3];
			fnIsDefault(oNode);

			oNode._mouseOver();
			fnCheckCircleStatusHover(assert, oNode, {
				color: Color.Black,
				background: Color.DefaultHoverBgCircle,
				border: Color.DefaultHoverBorder
			});

			oNode._mouseOut();
			fnIsDefault(oNode);

			oNode._mouseDown();
			fnCheckCircleStatusHover(assert, oNode, {
				color: Color.White,
				background: Color.DefaultSelectedColor,
				border: Color.DefaultSelectedColor
			});

			oNode.getParent().deselect();
			fnIsDefault(oNode);

			fnDone();
			oGraph.destroy();
		});

		assert.expect(40);
		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Custom status box with attributes.", function (assert) {
		var fnDone = assert.async(),
			oGraph = fnCreateGraph();

		oGraph.attachEvent("graphReady", function () {
			var aNodes = oGraph.getNodes(),
				oNode = aNodes[4];

			var fnDefaultCheck = function (oNode) {
				fnBoxCheckColors(assert, oNode, {
					headerContent: Color.White,
					background: Color.Red,
					border: Color.Red,
					contentColor: Color.Blue,
					rows: [Color.Red, Color.Red, Color.Blue]
				});
			};

			fnDone();
			fnDefaultCheck(oNode);

			oNode._mouseOver();
			fnBoxCheckColors(assert, oNode, {
				headerContent: Color.Black,
				background: Color.Green,
				border: Color.Green,
				contentColor: Color.Black,
				rows: [Color.White, Color.Black, Color.Black]
			});

			oNode._mouseOut();
			fnDefaultCheck(oNode);

			oNode._mouseDown();
			fnBoxCheckColors(assert, oNode, {
				headerContent: Color.Red,
				background: Color.Yellow,
				border: Color.Yellow,
				contentColor: Color.Red,
				rows: [Color.White, Color.Red, Color.Red]
			});

			oGraph.deselect();
			fnDefaultCheck(oNode);
			oGraph.destroy();
		});

		assert.expect(30);
		oGraph.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("Selected nodes with custom status.", function (assert) {
		var fnDone = assert.async(),
			oGraph = fnCreateGraph();

		var aNodes = oGraph.getNodes();

		aNodes[2].setSelected(true);
		aNodes[4].setSelected(true);


		oGraph.attachEvent("graphReady", function () {
			var oNode = aNodes[4];

			fnBoxCheckColors(assert, oNode, {
				headerContent: Color.Red,
				background: Color.Yellow,
				border: Color.Yellow,
				rows: [Color.White, Color.White, Color.Red]
			}, "Selected-Default");

			oNode.setSelected(false);
			fnBoxCheckColors(assert, oNode, {
				headerContent: Color.White,
				background: Color.Red,
				border: Color.Red,
				rows: [Color.Red, Color.Red, Color.Blue]
			}, "Default");


			oNode = aNodes[2];
			fnCheckCircleStatus(assert, oNode, {
				color: Color.PitchBlack,
				background: Color.Yellow,
				border: Color.Yellow
			}, "Selected-Default");

			oNode.setSelected(false);
			fnCheckCircleStatus(assert, oNode, {
				color: Color.Blue,
				background: Color.Red,
				border: Color.Red
			}, "Selected-Default");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		assert.expect(20);
	});


	QUnit.test("Custom status - borders.", function (assert) {
		var fnDone = assert.async();
		var oGraph = GraphTestUtils.buildGraph(oData1);
		oGraph.setRenderType("Html");

		oGraph.attachEvent("graphReady", function () {
			var oNode = this.getNodes()[0];
			oNode.$("wrapper").css("border-width");

			assert.equal(oNode.$("wrapper").css("border-top-width"), "2px", "Border width is 2px");
			assert.equal(oNode.$("wrapper").css("border-top-style"), "dashed", "Border style is dashed");

			var oLine = this.getLines()[0];
			assert.equal(oLine.$("path").css("stroke-width"), "2px", "Stroke width is 2px");

			var sArray = oLine.$("path")[0].style["stroke-dasharray"],
				bCondition = sArray === "10, 10" || sArray === "10px, 10px" || sArray === "10,10" || sArray === "10px,10px";

			assert.equal(bCondition, true, "Border stroke array width is 10,10");

			var oGroup = this.getGroups()[0];
			assert.equal(oGroup.$().css("border-top-width"), "2px", "Border width is 2px");
			assert.equal(oNode.$("wrapper").css("border-top-style"), "dashed", "Border style is dashed");

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		assert.expect(6);
	});

	QUnit.test("Line's custom status in swim lane.", function (assert) {
		var fnDone = assert.async();
		var oGraph = GraphTestUtils.buildGraph(oData2);
		oGraph.setLayoutAlgorithm(new SwimLaneChainLayout());
		oGraph.setRenderType("Html");

		var fnCheckLine = function (oLine, sColor) {
			var $line = oLine.$(),
				$arrow = oLine.$("arrow"),
				$nipple = jQuery($line.find(".sapSuiteUiCommonsNetworkLineNipple")[0]);

			assert.equal(hexToRgb(oLine.$("path").css("stroke")), sColor, "Stroke");

			assert.equal(hexToRgb($arrow.css("stroke")), sColor, "Arrow stroke");
			assert.equal(hexToRgb($arrow.css("fill")), sColor, "Arrow bg");

			assert.equal(hexToRgb($nipple.css("fill")), sColor, "Nipple bg");
		};

		oGraph.attachEvent("graphReady", function () {
			var oLine = this.getLines()[0];
			fnCheckLine(oLine, Color.Red);

			oLine._mouseOver();
			fnCheckLine(oLine, Color.Yellow);

			oLine.setSelected(true);
			fnCheckLine(oLine, Color.DefaultSelectedColor);

			oGraph.destroy();
			fnDone();
		});

		oGraph.placeAt("content");
		assert.expect(12);
	});

	QUnit.test("Custom status legend color.", function (assert) {
		var fnDone = assert.async();
		var oGraph = GraphTestUtils.buildGraph(oData1);

		oGraph.placeAt("content");

		oGraph.attachEvent("graphReady", function () {
			var $items = oGraph.$().find(".sapSuiteUiCommonsNetworkGraphLegendColorLine");

			assert.equal(hexToRgb(jQuery($items[0]).css("background-color")), "rgb(255, 0, 0)", "Arrow stroke");
			assert.equal(hexToRgb(jQuery($items[1]).css("background-color")), "rgb(255, 192, 203)", "Arrow stroke");
			assert.equal(hexToRgb(jQuery($items[2]).css("background-color")), "rgb(0, 128, 0)", "Arrow stroke");

			oGraph.destroy();
			fnDone();
		});
	});

	QUnit.test("Custom status focus color.", function (assert) {
		var fnDone = assert.async();
		var oGraph = GraphTestUtils.buildGraph(oData3);

		oGraph.placeAt("content");

		oGraph.attachEvent("graphReady", function () {
			var oNode = oGraph.getNodes()[0],
				oNode1 = oGraph.getNodes()[1];

			var $focus = oNode.$("focus");

			oNode._mouseDown();
			assert.equal(hexToRgb($focus.css("border-left-color")), Color.Red, "focus 1");

			oNode._mouseDown();
			// same as hover (specialcase)
			assert.equal(hexToRgb($focus.css("border-left-color")), Color.Yellow, "focus 1");

			oNode.$("wrapper").mouseout();
			assert.equal(hexToRgb($focus.css("border-left-color")), Color.Green, "focus 1");

			oNode._mouseOver();
			assert.equal(hexToRgb($focus.css("border-left-color")), Color.Yellow, "focus 1");

			$focus = oNode1.$("focus");

			oNode1._mouseDown();
			assert.equal(hexToRgb($focus.css("border-left-color")), Color.White, "focus 2");

			oNode1._mouseDown();
			// same as hover (specialcase)
			assert.equal(hexToRgb($focus.css("border-left-color")), Color.PitchBlack, "focus 2");

			oNode1.$("wrapper").mouseout();
			assert.equal(hexToRgb($focus.css("border-left-color")), Color.PitchBlack, "focus 2");

			oNode1._mouseOver();
			assert.equal(hexToRgb($focus.css("border-left-color")), Color.PitchBlack, "focus 2");

			oGraph.destroy();
			fnDone();
		});

	});
});

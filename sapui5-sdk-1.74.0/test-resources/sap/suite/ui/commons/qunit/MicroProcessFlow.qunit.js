sap.ui.define([
	"sap/suite/ui/commons/MicroProcessFlow",
	"sap/suite/ui/commons/MicroProcessFlowItem",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/microchart/RadialMicroChart",
	'sap/ui/core/ValueState'
], function (MicroProcessFlow, MicroProcessFlowItem, createAndAppendDiv, RadialMicroChart, ValueState) {

	var styleElement = document.createElement("style");
	styleElement.textContent =
		"html, body {" +
		"       height: 100%;" +
		"}";
	document.head.appendChild(styleElement);
	createAndAppendDiv("qunit");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%;");

	QUnit.module("Micro Process Flow", {
	});

	QUnit.test("Micro process flow is rendered", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(4, oMicroProcessFlow.$("scrolling").children().length, "Correct number of children rendered");
		assert.equal(3, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemSeparator").length, "Correct number of separators rendered");
		oMicroProcessFlow.destroy();

	});

	QUnit.test("Micro process flow separator", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				showSeparator: false
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(0, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemSeparator:visible").length, "Correct number of separators rendered");
		oMicroProcessFlow.destroy();

	});

	QUnit.test("Micro process intermediary", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				showIntermediary: true
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemIntermediary").length, "Correct number of intermediary");
		oMicroProcessFlow.destroy();
	});


	QUnit.test("Micro process custom intermediary", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				showIntermediary: true,
				intermediary: [
					new sap.ui.core.Icon({
						src: "sap-icon://account"
					})
				]
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemIntermediary span").length, "Correct number of custom intermediary");
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process state property", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				state: ValueState.Information
			}), new MicroProcessFlowItem({
				state: ValueState.Good
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(ValueState.Information, oMicroProcessFlow.getContent()[0].getState(), "Information state mapped");
		assert.equal(ValueState.Good, oMicroProcessFlow.getContent()[1].getState(), "Good state mapped");

		oMicroProcessFlow.getContent()[0].setState(ValueState.Good);
		oMicroProcessFlow.getContent()[1].setState(ValueState.Information);

		sap.ui.getCore().applyChanges();

		assert.equal(ValueState.Good, oMicroProcessFlow.getContent()[0].getState(), "Good state mapped");
		assert.equal(ValueState.Information, oMicroProcessFlow.getContent()[1].getState(), "Information state mapped");

		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process step width", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				stepWidth: "300px"
			}), new MicroProcessFlowItem({
				stepWidth: "100%"
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		var iMaxHeight = oMicroProcessFlow._getMaxHeight();

		assert.equal(300, oMicroProcessFlow.getContent()[0].$().find(".sapSuiteUiCommonsMicroProcessFlowItemSeparatorWrapper").width(), "Correct fix width");
		assert.equal(oMicroProcessFlow.getContent()[1].$("separator").width(), iMaxHeight, "Correct percentage width");
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process custom control", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				customControl: new sap.suite.ui.microchart.RadialMicroChart("graphCustomItem", {
					size: "M",
					percentage: "45"
				})
			}), new MicroProcessFlowItem()
			]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();
		assert.equal(1, oMicroProcessFlow.$().find("#graphCustomItem").length, "Custom item");
		oMicroProcessFlow.destroy();

	});

	QUnit.test("Micro process press", function (assert) {
		var oEvent = {
			preventDefault: function() {},
			stopPropagation: function() {}
		};
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				press: function () {
					assert.ok("pressed");
				}
			})
			]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		oMicroProcessFlow.getContent()[0]._click(oEvent);
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process accessibility", function (assert) {
		var TITLE = "testtitle";
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				title: TITLE,
				customControl: new RadialMicroChart("graphCustomItem", {
					size: "M",
					percentage: "45"
				})
			}), new MicroProcessFlowItem({
				title: TITLE
			})
			]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		oMicroProcessFlow.getContent().forEach(function (oItem) {
			var sItem = oItem.$("item").attr("aria-label") || "",
				sItemContent = oItem.$("itemContent").attr("aria-label") || "",
				bTitle = sItem.indexOf(TITLE) !== -1 || sItemContent.indexOf(TITLE) !== -1;

			assert.equal(true, bTitle, "Title match");
		});
		oMicroProcessFlow.destroy();
	});

});

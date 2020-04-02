/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/library",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/HeaderCell",
	"sap/suite/ui/commons/HeaderCellItem",
	"sap/suite/ui/commons/NumericContent",
	"sap/m/MessageToast",
	"sap/m/Label",
	"sap/suite/ui/commons/HeaderContainer",
	"sap/m/library",
	"sap/m/FlexBox",
	"sap/ui/thirdparty/jquery",
	"sap/ui/util/Mobile"
], function(
	QUnitUtils,
	createAndAppendDiv,
	commonsLibrary,
	JSONModel,
	HeaderCell,
	HeaderCellItem,
	NumericContent,
	MessageToast,
	Label,
	HeaderContainer,
	mobileLibrary,
	FlexBox,
	jQuery,
	Mobile
) {
	"use strict";

	// shortcut for sap.m.BackgroundDesign
	var BackgroundDesign = mobileLibrary.BackgroundDesign;

	// shortcut for sap.suite.ui.commons.HeaderContainerView
	var HeaderContainerView = commonsLibrary.HeaderContainerView;

	// shortcut for sap.suite.ui.commons.DeviationIndicator
	var DeviationIndicator = commonsLibrary.DeviationIndicator;

	// shortcut for sap.suite.ui.commons.InfoTileValueColor
	var InfoTileValueColor = commonsLibrary.InfoTileValueColor;

	createAndAppendDiv("qunit-fixture-0");


	Mobile.init();

	var oConfHCData = {
		scrollStep: 200,
		scrollTime: 500,
		items: [
			{
				cells: [
					{
						side: "north",
						type: "numeric",
						value: 125,
						scale: "M",
						size: "M",
						valueColor: InfoTileValueColor.Error,
						indicator: DeviationIndicator.Up,
						isFormatterValue: false,
						truncateValueTo: 4,
						cellHeight: "85%"
					}, {
						side: "south",
						type: "text",
						value: "USD, Current",
						cellHeight: "15%"
					}
				]
			}, {
				cells: [
					{
						side: "north",
						type: "numeric",
						value: 1115,
						scale: "M",
						unit: "USD",
						size: "M",
						valueColor: InfoTileValueColor.Critical,
						indicator: DeviationIndicator.Up,
						isFormatterValue: false,
						truncateValueTo: 4,
						cellHeight: "85%"
					}, {
						side: "south",
						type: "text",
						value: "USD, Current",
						cellHeight: "15%"
					}
				]
			}
		]
	};

	var oConfModel = new JSONModel();
	oConfModel.setData(oConfHCData);
	sap.ui.getCore().setModel(oConfModel);

	var fnHeaderCellFactory = function(sId, oContext) {
		var aCell = oContext.getProperty("cells");
		var oHCell = new HeaderCell();
		var oHCI = null;
		var fnCallback = function(oEvent) {
			MessageToast.show("NumericContent is pressed.");
		};
		for (var i = 0; i < aCell.length; i++) {
			if (aCell[i].type === "numeric") {
				oHCI = new HeaderCellItem();
				var oNVC = new NumericContent({
					value: "{" + oContext.sPath + "/cells/" + i + "/value}",
					scale: "{" + oContext.sPath + "/cells/" + i + "/scale}",
					indicator: "{" + oContext.sPath + "/cells/" + i + "/indicator}",
					size: "{" + oContext.sPath + "/cells/" + i + "/size}",
					formatterValue: "{" + oContext.sPath + "/cells/" + i + "/isFormatterValue}",
					truncateValueTo: "{" + oContext.sPath + "/cells/" + i + "/truncateValueTo}",
					state: "Loaded",
					valueColor: "{" + oContext.sPath + "/cells/" + i + "/valueColor}",
					press: fnCallback
				});
				oHCI.setContent(oNVC);
			} else if (aCell[i].type === "text") {
				oHCI = new HeaderCellItem();
				var oText = new Label({ text: "{" + oContext.sPath + "/cells/" + i + "/value}" });
				oHCI.setContent(oText);
			}
			oHCell.setAggregation(aCell[i].side, oHCI);
			oHCI.setHeight(oContext.getProperty(oContext.sPath + "/cells/" + i + "/cellHeight"));
		}
		return oHCell;
	};

	var oHC = new HeaderContainer("hc", {
		scrollStep: "{/scrollStep}",
		scrollTime: "{/scrollTime}",
		items: {
			path: "/items",
			factory: fnHeaderCellFactory
		}
	});

	oHC.placeAt("qunit-fixture-0");
	sap.ui.getCore().applyChanges();

	var oHCv = new HeaderContainer("hc-v", {
		scrollStep: "{/scrollStep}",
		scrollTime: "{/scrollTime}",
		items: {
			path: "/items",
			factory: fnHeaderCellFactory
		},
		view: HeaderContainerView.Vertical
	});

	oHCv.placeAt("qunit-fixture-0");
	sap.ui.getCore().applyChanges();

	QUnit.module("Rendering test - sap.suite.ui.commons.HeaderContainer");
	QUnit.test("Header Container rendered.", function(assert) {
		assert.ok(window.document.getElementById("hc"), "HeaderContainer was rendered successfully");
		assert.ok(window.document.getElementById("hc-v"), "Vertical HeaderContainer was rendered successfully");
		assert.ok(window.document.getElementById("hc-scroll-area"), "HeaderContainer scroll area was rendered successfully");
	});

	QUnit.test("Header Container background design property.", function(assert) {
		var $ScrollArea = window.document.getElementById("hc-scroll-area");
		var sCssClass = $ScrollArea.className;
		assert.ok(sCssClass.indexOf("sapSuiteHdrCntrBGTransparent") >= 0, "Default background design class 'sapSuiteHdrCntrBGTransparent' is present");
	});

	QUnit.module("Functional tests - sap.suite.ui.commons.HeaderContainer");
	QUnit.test("Test the number of created items", function(assert) {
		assert.equal(oHC.getItems().length, 2, "2 Items initially created");
	});

	QUnit.test("Test the background design property", function(assert) {
		//arrange
		var oBackgroundDesignDefault = oHC.getBackgroundDesign();
		//act
		oHC.setBackgroundDesign(BackgroundDesign.Solid);
		oHC.rerender();
		var oBackgroundDesignNew = oHC.getBackgroundDesign();
		var sCssClassNew = window.document.getElementById("hc-scroll-area").className;
		//assert
		assert.equal(oBackgroundDesignDefault, BackgroundDesign.Transparent, "The default value is 'sapSuiteHdrCntrBGTransparent'");
		assert.equal(oBackgroundDesignNew, BackgroundDesign.Solid, "The new value is 'sapSuiteHdrCntrBGSolid'");
		assert.ok(sCssClassNew.indexOf("sapSuiteHdrCntrBGSolid") >= 0, "Background design was set to Solid. CssClass 'sapSuiteHdrCntrBGSolid' is present");
	});

	QUnit.test("Test adding items", function(assert) {
		var done = assert.async();
		setTimeout(function() {
			assert.equal(jQuery(document.getElementById("hc-scrl-next-button")).is(":visible"), false, "Next button has not appeared");
			var oNVConfM = new NumericContent({
				value: "12.3",
				scale: "MM",
				valueColor: InfoTileValueColor.Good,
				indicator: DeviationIndicator.Up,
				size: "M",
				formatterValue: false,
				truncateValueTo: 4
			});
			var oHcNumeric = new HeaderCell({
				north: new HeaderCellItem({
					content: oNVConfM
				}),
				south: new HeaderCellItem({
					content: new Label({ text: "USD, Current" })
				})
			});
			oHC.insertItem(oHcNumeric);

			for (var i = 0; i < 9; i++) {
				var oNVConfM = new NumericContent({
					value: "5555",
					scale: "MM",
					valueColor: InfoTileValueColor.Good,
					indicator: DeviationIndicator.Up,
					size: "M",
					formatterValue: false,
					truncateValueTo: 4
				});
				var oHcNumeric = new HeaderCell({
					north: new HeaderCellItem({
						content: oNVConfM
					}),
					south: new HeaderCellItem({
						content: new Label({ text: "USD, Current" })
					})
				});
				oHC.addItem(oHcNumeric);
			}
			assert.equal(oHC.getItems().length, 12, "10 Items added to the Header Container");
			assert.notEqual(jQuery(document.getElementById("hc-scrl-next-button")).is(":visible"), true, "Next button has appeared");
			done();
		}, 1000);
	});

	QUnit.test("Test aggregations", function(assert) {
		assert.equal(oHC.getAggregation("items", undefined).length, 12, "The function should return 12 items");
		var aItems = oHC.getAggregation("items", undefined);
		assert.equal(oHC.indexOfAggregation("items", aItems[0]), 0, "index of the first item in items aggregation should be 0");
		oHC.removeAggregation("items", aItems[0], true);
		assert.equal(oHC.getAggregation("items", undefined).length, 11, "There should be 11 items now");
		oHC.addAggregation("items", aItems[0], true);
		assert.equal(oHC.getAggregation("items", undefined).length, 12, "There should be 12 items now");
		oHC.removeAggregation("items", aItems[0], true);
		oHC.insertAggregation("items", aItems[0], 1, true);
		assert.equal(oHC.getAggregation("items", undefined).length, 12, "There should be 12 kpis now");
		assert.equal(oHC.indexOfAggregation("items", aItems[0]), 1, "The inserted item should be on second position now");
		assert.equal(oHC._callMethodInManagedObject("indexOfAggregation", "items", aItems[0]), 1, "The inserted kpi should be on second position now");
		oHC.removeAllAggregation("items", true);
		assert.equal(oHC.getAggregation("items", undefined), undefined, "All items should be removed");
	});

	QUnit.module("Shifting items", {
		beforeEach: function() {
			var oFirstFlexBox = new FlexBox({
				height: "120px",
				width: "3000px"
			});
			this.oFirstHeaderCell = new HeaderCell({
				north: new HeaderCellItem({
					content: oFirstFlexBox
				})
			});
			var oSecondFlexBox = new FlexBox({
				height: "120px",
				width: "3000px"
			});
			this.oSecondHeaderCell = new HeaderCell({
				north: new HeaderCellItem({
					content: oSecondFlexBox
				})
			});
			oHC.addItem(this.oFirstHeaderCell);
			oHC.addItem(this.oSecondHeaderCell);
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oHC.removeItem(this.oFirstHeaderCell);
			oHC.removeItem(this.oSecondHeaderCell);
		}
	});

	QUnit.test("Test shifting items to left", function(assert) {
		var done = assert.async();
		assert.equal(jQuery(document.getElementById("hc-scrl-prev-button")).css("display"), "none", "The items was shifted to left");
		oHC._scroll(200, 500);
		setTimeout(function() {
			assert.notEqual(jQuery(document.getElementById("hc-scrl-prev-button")).css("display"), "none", "The items was shifted to left");
			done();
		}, 1000);
	});

	QUnit.test("Test shifting items to right", function(assert) {
		var done = assert.async();
		oHC._scroll(-200, 500);
		setTimeout(function() {
			assert.notEqual(jQuery(document.getElementById("hc-scrl-next-button")).css("display"), "none", "The items was shifted to right");
			done();
		}, 1000);
	});

	QUnit.module("Keyboard navigation focus issues", {
		beforeEach: function() {
			this.oHeaderContainer = new HeaderContainer("headerContainer", {
				items: [
					new HeaderCell(),
					new HeaderCell(),
					new HeaderCell()
				]
			});
			this.oHeaderContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oHeaderContainer.destroy();
			this.oHeaderContainer = null;
		}
	});

	QUnit.test("The item navigation includes all the items of header container", function(assert) {
		assert.equal(this.oHeaderContainer._oItemNavigation.getItemDomRefs().length, this.oHeaderContainer.getItems().length, "Correct item received focus.");
	});

	QUnit.test("Surrogate div with tab index which is used to catch shift tab focus is rendered ", function(assert) {
		assert.equal(this.oHeaderContainer.$("after").attr("tabindex"), "0", "Correct item received focus.");
	});

	QUnit.test("_restoreLastFocused method sets the focus on the item that was saved as focused before", function(assert) {
		//Arrange
		this.oHeaderContainer._oItemNavigation.setFocusedIndex(1);
		//Act
		this.oHeaderContainer._restoreLastFocused();
		//Assert
		assert.deepEqual(this.oHeaderContainer._oItemNavigation.getItemDomRefs()[1], document.activeElement, "Correct item received focus.");
	});

	QUnit.test("When focusing from outside (through shift + tab) on the surrogate div element, the focus is set on the previous focused element of the itemnavigation", function(assert) {
		//Arrange
		this.oHeaderContainer._oItemNavigation.setFocusedIndex(0);
		var oEvt = {
			preventDefault: function() {},
			target: this.oHeaderContainer.$("after").get(0)
		};
		//Act
		this.oHeaderContainer.onfocusin(oEvt);
		//Assert
		assert.ok(this.oHeaderContainer._oItemNavigation.getItemDomRefs().eq(0).is(":focus"), "Focus from outside was moved to the right last focused item");
	});

	QUnit.test("Test tab button click event", function(assert) {
		//Arrange
		this.oHeaderContainer._oItemNavigation.getItemDomRefs().eq(0).focus();
		var oEvt = {
			preventDefault: function() {},
			target: this.oHeaderContainer._oItemNavigation.getItemDomRefs()[0]
		};
		//Act
		this.oHeaderContainer.onsaptabnext(oEvt);
		//Assert
		assert.deepEqual(document.activeElement, this.oHeaderContainer.$("after").get(0), "Focus leaves away from the ScrollContainer");
		assert.equal(this.oHeaderContainer._oItemNavigation.getFocusedIndex(), 0, "The focused item index is still correct after the focus leaves away from the ScrollContainer");
	});

	QUnit.test("Test shift Tab button click event", function(assert) {
		//Arrange
		this.oHeaderContainer._oItemNavigation.getItemDomRefs().eq(0).focus();
		var oEvt = {
			preventDefault: function() {},
			target: this.oHeaderContainer._oItemNavigation.getItemDomRefs()[0]
		};
		//Act
		this.oHeaderContainer.onsaptabprevious(oEvt);
		//Assert
		assert.notOk(this.oHeaderContainer.getDomRef() !== document.activeElement && this.oHeaderContainer.getDomRef().contains(document.activeElement), "Focus leaves away from the ScrollContainer");
		assert.equal(this.oHeaderContainer._oItemNavigation.getFocusedIndex(), 0, "The focused item index is still correct after the focus leaves away from the ScrollContainer");
	});

	QUnit.test("Focus is set to next item after right button on element of itemnavigation is clicked", function(assert) {
		//Arrange
		this.oHeaderContainer._oItemNavigation.getItemDomRefs().eq(0).focus();
		var oEvt = {
			preventDefault: function() {},
			stopPropagation: function() {},
			target: this.oHeaderContainer._oItemNavigation.getItemDomRefs()[0]
		};
		//Act
		this.oHeaderContainer._oItemNavigation.onsapnext(oEvt);
		//Assert
		assert.deepEqual(document.activeElement, this.oHeaderContainer._oItemNavigation.getItemDomRefs()[1], "Focus is set to the next item");
		assert.equal(this.oHeaderContainer._oItemNavigation.getFocusedIndex(), 1, "Focused index of itemnavigation is updated");
	});

	QUnit.test("Focus is set to previous item after left button on element of itemnavigation is clicked", function(assert) {
		//Arrange
		this.oHeaderContainer._oItemNavigation.getItemDomRefs().eq(1).focus();
		var oEvt = {
			preventDefault: function() {},
			stopPropagation: function() {},
			target: this.oHeaderContainer._oItemNavigation.getItemDomRefs()[1]
		};
		//Act
		this.oHeaderContainer._oItemNavigation.onsapprevious(oEvt);
		//Assert
		assert.deepEqual(document.activeElement, this.oHeaderContainer._oItemNavigation.getItemDomRefs()[0], "Focus is set to the previous item");
		assert.equal(this.oHeaderContainer._oItemNavigation.getFocusedIndex(), 0, "Focused index of itemnavigation is updated");
	});
});
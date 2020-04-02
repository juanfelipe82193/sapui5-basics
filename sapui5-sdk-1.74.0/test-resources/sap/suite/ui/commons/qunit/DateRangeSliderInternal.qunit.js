/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/DateRangeSliderInternal",
	"sap/ui/core/format/DateFormat",
	"sap/suite/ui/commons/util/DateUtils",
	"sap/ui/core/Locale",
	"sap/ui/thirdparty/jquery"
], function(
	QUnitUtils,
	createAndAppendDiv,
	DateRangeSliderInternal,
	DateFormat,
	DateUtils,
	Locale,
	jQuery
) {
	"use strict";
	createAndAppendDiv("uiArea1");
	createAndAppendDiv("uiArea2");
	createAndAppendDiv("uiArea3");
	createAndAppendDiv("uiArea4");
	createAndAppendDiv("uiArea5");
	createAndAppendDiv("uiArea6");
	createAndAppendDiv("uiArea7");
	createAndAppendDiv("uiArea8");
	createAndAppendDiv("uiArea9");
	createAndAppendDiv("uiArea10");


	var sModuleSuffix = " - sap.suite.ui.commons.DateRangeSliderInternal";

	var sDrsId = "testSliderRendering";

	var oDrs = new DateRangeSliderInternal(sDrsId);
	oDrs.placeAt("uiArea1");

	/******************************************************************/
	QUnit.module("Rendering Tests" + sModuleSuffix);

	QUnit.test("TestRenderedOK", function(assert) {

		assert.notEqual(sDrsId ? window.document.getElementById(sDrsId) : null, null, "DateRangeSlider outer HTML Element should be rendered.");
		assert.notEqual(sDrsId + "-bar" ? window.document.getElementById(sDrsId + "-bar") : null, null, "DateRangeSlider inner slider control should be rendered.");
		assert.notEqual(sDrsId + "-grip" ? window.document.getElementById(sDrsId + "-grip") : null, null, "DateRangeSlider inner slider control grip should be rendered.");
		assert.notEqual(sDrsId + "-grip2" ? window.document.getElementById(sDrsId + "-grip2") : null, null, "DateRangeSlider inner slider control grip2 should be rendered.");
		assert.notEqual(sDrsId + "-bubble" ? window.document.getElementById(sDrsId + "-bubble") : null, null, "DateRangeSlider left bubble should be rendered.");
		assert.notEqual(sDrsId + "-bubble2" ? window.document.getElementById(sDrsId + "-bubble2") : null, null, "DateRangeSlider right bubble should be rendered.");
		assert.notEqual(sDrsId + "-bubbleTxt" ? window.document.getElementById(sDrsId + "-bubbleTxt") : null, null, "DateRangeSlider left bubble text should be rendered.");
		assert.notEqual(sDrsId + "-bubbleTxt2" ? window.document.getElementById(sDrsId + "-bubbleTxt2") : null, null, "DateRangeSlider right bubble text should be rendered.");
	});

	/******************************************************************/
	var sTxtBefore = null, sTxtAftEvt = "Event caught", iClicks = 0;
	var dValueDate = null, dValue2Date = null;

	function handleChange(oEvent) {

		sTxtBefore = sTxtAftEvt;
		dValueDate = oEvent.getParameter("value");
		dValue2Date = oEvent.getParameter("value2");
	}

	function handleLiveChange(oEvent) {

		iClicks++;
	}

	var sDrsEvtId = "testSliderEvent";
	var oDrsEvt = new DateRangeSliderInternal(sDrsEvtId);
	oDrsEvt.attachChange(handleChange);
	oDrsEvt.attachLiveChange(handleLiveChange);
	oDrsEvt.placeAt("uiArea2");

	QUnit.module("Change/Live Change event tests" + sModuleSuffix, {
		beforeEach: function() {
			//oGrip = sDrsEvtId + "-grip" ? window.document.getElementById(sDrsEvtId + "-grip") : null;
			//oGrip2 = sDrsEvtId + "-grip2" ? window.document.getElementById(sDrsEvtId + "-grip2") : null;
		},
		afterEach: function() {

			sTxtBefore = null;
			dValueDate = null;
			dValue2Date = null;
			iClicks = 0;
		}
	});

	QUnit.test("TestChangeEventOnLeftGrip", function(assert) {

		jQuery("#" + sDrsEvtId).focus();
		qutils.triggerMouseEvent(sDrsEvtId + "-grip", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip", "ARROW_RIGHT");
		assert.equal(sTxtBefore, sTxtAftEvt, "Change event should modify text after moving left grip");
		assert.ok(dValueDate instanceof Date, "Event should have start date as Date Object");
		assert.ok(dValue2Date instanceof Date, "Event should have end date as Date Object");
	});

	QUnit.test("TestChangeEventOnRightGrip", function(assert) {

		jQuery("#" + sDrsEvtId).focus();
		qutils.triggerMouseEvent(sDrsEvtId + "-grip2", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip2", "ARROW_LEFT");
		assert.equal(sTxtBefore, sTxtAftEvt, "Change event should modify text after moving right grip");
	});

	QUnit.test("TestLiveChangeEventOnLeftGrip", function(assert) {

		jQuery("#" + sDrsEvtId).focus();
		qutils.triggerMouseEvent(sDrsEvtId + "-grip", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip", "ARROW_RIGHT");
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip", "ARROW_RIGHT");
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip", "ARROW_RIGHT");
		assert.equal(iClicks, 3, "3 Live Change events should increment var clicks 3 times after moving left grip");
	});

	QUnit.test("TestLiveChangeEventOnRightGrip", function(assert) {

		jQuery("#" + sDrsEvtId).focus();
		qutils.triggerMouseEvent(sDrsEvtId + "-grip2", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip2", "ARROW_LEFT");
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip2", "ARROW_LEFT");
		assert.equal(iClicks, 2, "2 Live Change events should increment var clicks 2 times after moving left grip");
	});

	QUnit.test("TestChangeEventOnLeftGripChangingDatesCorrectly", function(assert) {

		var dValueDate1 = oDrsEvt.getDateRange().valueDate;
		var dExpectedEndDate = new Date(dValueDate1.getTime());
		dExpectedEndDate.setDate(dExpectedEndDate.getDate() + 2);

		jQuery("#" + sDrsEvtId).focus();
		qutils.triggerMouseEvent(sDrsEvtId + "-grip", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip", "ARROW_RIGHT");
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip", "ARROW_RIGHT");
		var dValueDate2 = oDrsEvt.getDateRange().valueDate;
		assert.equal(dValueDate2.getTime(), dExpectedEndDate.getTime(), "Start Date moved 2 days ahead");
		qutils.triggerMouseEvent(sDrsEvtId + "-grip", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip", "ARROW_LEFT");
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip", "ARROW_LEFT");
		dValueDate2 = oDrsEvt.getDateRange().valueDate;
		assert.equal(dValueDate2.getTime(), dValueDate1.getTime(), "Start Date moved 2 days back");
	});

	QUnit.test("TestChangeEventOnRightGripChangingDatesCorrectly", function(assert) {

		var dValue2Date1 = oDrsEvt.getDateRange().value2Date;
		var dExpectedEndDate = new Date(dValue2Date1.getTime());
		dExpectedEndDate.setDate(dExpectedEndDate.getDate() - 2);

		jQuery("#" + sDrsEvtId).focus();
		qutils.triggerMouseEvent(sDrsEvtId + "-grip2", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip2", "ARROW_LEFT");
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip2", "ARROW_LEFT");

		var dValue2Date2 = oDrsEvt.getDateRange().value2Date;
		assert.equal(dValue2Date2.getTime(), (dExpectedEndDate.getTime()), "End Date moved 2 days back");
		qutils.triggerMouseEvent(sDrsEvtId + "-grip2", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip2", "ARROW_RIGHT");
		qutils.triggerKeyboardEvent(sDrsEvtId + "-grip2", "ARROW_RIGHT");
		dValue2Date2 = oDrsEvt.getDateRange().value2Date;
		assert.equal(dValue2Date2.getTime(), dValue2Date1.getTime(), "End Date moved 2 days ahead");
	});

	/******************************************************************/
	var sDrsBubId = "testDrsBubble";
	var oDrsBub = new DateRangeSliderInternal(sDrsBubId);
	oDrsBub.placeAt("uiArea3");

	QUnit.module("DateRangeSlider Bubble tests" + sModuleSuffix, {
		beforeEach: function() {

		},
		afterEach: function() {

		}
	});

	QUnit.test("TestBubbleShowHide", function(assert) {

		oDrsBub.setShowBubbles(false);
		oDrsBub.rerender();
		assert.equal(sDrsBubId + "-bubble" ? window.document.getElementById(sDrsBubId + "-bubble") : null, null, "DateRangeSlider left bubble should not be rendered.");
		assert.equal(sDrsBubId + "-bubble2" ? window.document.getElementById(sDrsBubId + "-bubble2") : null, null, "DateRangeSlider right bubble should not be rendered.");
		assert.equal(sDrsBubId + "-bubbleTxt" ? window.document.getElementById(sDrsBubId + "-bubbleTxt") : null, null, "DateRangeSlider left bubble text should not be rendered.");
		assert.equal(sDrsBubId + "-bubbleTxt2" ? window.document.getElementById(sDrsBubId + "-bubbleTxt2") : null, null, "DateRangeSlider right bubble text should not be rendered.");

		oDrsBub.setShowBubbles(true);
		oDrsBub.rerender();
		assert.notEqual(sDrsBubId + "-bubble" ? window.document.getElementById(sDrsBubId + "-bubble") : null, null, "DateRangeSlider left bubble should be rendered.");
		assert.notEqual(sDrsBubId + "-bubble2" ? window.document.getElementById(sDrsBubId + "-bubble2") : null, null, "DateRangeSlider right bubble should be rendered.");
		assert.notEqual(sDrsBubId + "-bubbleTxt" ? window.document.getElementById(sDrsBubId + "-bubbleTxt") : null, null, "DateRangeSlider left bubble text should be rendered.");
		assert.notEqual(sDrsBubId + "-bubbleTxt2" ? window.document.getElementById(sDrsBubId + "-bubbleTxt2") : null, null, "DateRangeSlider right bubble text should be rendered.");
	});

	QUnit.test("TestBubblesShowCorrectDatesOnInit", function(assert) {

		var oDateRange = oDrsBub.getDateRange();
		var dValueDate = oDateRange.valueDate;
		var dValue2Date = oDateRange.value2Date;

		var sValueDateLbl = formatDate(dValueDate);
		var sValueDateBubTxt = oDrsBub._oBubble.getText();

		var sValue2DateLbl = formatDate(dValue2Date);
		var sValue2DateBubTxt = oDrsBub._oBubble2.getText();

		assert.equal(sValueDateBubTxt, sValueDateLbl, "Value date label and api value should be same.");
		assert.equal(sValue2DateBubTxt, sValue2DateLbl, "Value2 date label and api value should be same.");
	});

	QUnit.test("TestLeftBubbleShowsCorrectDateOnLeftGripMove", function(assert) {

		var sDateBubTxtBefore = oDrsBub._oBubble.getText();
		jQuery("#" + sDrsBubId).focus();
		qutils.triggerMouseEvent(sDrsBubId + "-grip", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsBubId + "-grip", "ARROW_RIGHT");
		var dDateAfter = oDrsBub.getDateRange().valueDate;
		var sDateBubTxtAfter = oDrsBub._oBubble.getText();
		assert.notEqual(sDateBubTxtAfter, sDateBubTxtBefore, "Start dates label before and after left grip move should not be same.");
		assert.equal(sDateBubTxtAfter, formatDate(dDateAfter), "Start dates label and api value after left grip move should be same.");
	});

	QUnit.test("TestRightBubbleShowsCorrectDateOnRightGripMove", function(assert) {

		var sDateBubTxtBefore = oDrsBub._oBubble2.getText();
		jQuery("#" + sDrsBubId).focus();
		qutils.triggerMouseEvent(sDrsBubId + "-grip2", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsBubId + "-grip2", "ARROW_LEFT");
		var dDateAfter = oDrsBub.getDateRange().value2Date;
		var sDateBubTxtAfter = oDrsBub._oBubble2.getText();

		assert.notEqual(sDateBubTxtAfter, sDateBubTxtBefore, "End dates label before and after right grip move should not be same.");
		assert.equal(sDateBubTxtAfter, formatDate(dDateAfter), "End dates label and api value after right grip move should be same.");
	});

	QUnit.test("TestLeftGripPositionWithMouseMove", function(assert) {

		var sDateBubTxtBefore = oDrsBub._oBubble.getText();
		jQuery("#" + sDrsBubId).focus();
		var oLeftBubble = sDrsBubId + "-bubble" ? window.document.getElementById(sDrsBubId + "-bubble") : null;
		var oLeftGrip = sDrsBubId + "-grip" ? window.document.getElementById(sDrsBubId + "-grip") : null;
		var iGripLeftpx = parseInt(oLeftGrip.style.left, 10);
		var iBubbleLeftpx = parseInt(oLeftBubble.style.left, 10);
		var iLeftDiff = iGripLeftpx - iBubbleLeftpx;

		qutils.triggerMouseEvent(sDrsBubId + "-grip", "mousedown", 1, 1, 100, 100);
		qutils.triggerMouseEvent(sDrsBubId, "mousemove", 1, 1, 105, 100);
		qutils.triggerMouseEvent(sDrsBubId, "mousemove", 1, 1, 110, 100);
		qutils.triggerMouseEvent(sDrsBubId + "-grip", "mouseup", 1, 1);

		var sDateBubTxtAfter = oDrsBub._oBubble.getText();
		assert.notEqual(sDateBubTxtAfter, sDateBubTxtBefore, "End dates label before and after left grip move should not be same.");

		var iGripLeftpxAfter = parseInt(oLeftGrip.style.left, 10);
		var iBubbleLeftpxAfter = parseInt(oLeftBubble.style.left, 10);
		var iLeftDiffAfter = iGripLeftpx - iBubbleLeftpx;

		assert.notEqual(iGripLeftpxAfter, iGripLeftpx, "Grip left position should not be the same");
		assert.notEqual(iBubbleLeftpxAfter, iBubbleLeftpx, "Bubble left position should not be the same");
		assert.equal(iLeftDiffAfter, iLeftDiff, "The distance between left grip and left bubble should be the same.");
	});

	QUnit.test("TestRightGripPositionWithMouseMove", function(assert) {

		var sDateBub2TxtBefore = oDrsBub._oBubble2.getText();
		jQuery("#" + sDrsBubId).focus();
		var oRightBubble = sDrsBubId + "-bubble2" ? window.document.getElementById(sDrsBubId + "-bubble2") : null;
		var oRightGrip = sDrsBubId + "-grip2" ? window.document.getElementById(sDrsBubId + "-grip2") : null;
		var iGripRightpx = parseInt(oRightGrip.style.left, 10);
		var iBubbleRightpx = parseInt(oRightBubble.style.left, 10);
		var iRightDiff = iGripRightpx - iBubbleRightpx;

		qutils.triggerMouseEvent(sDrsBubId + "-grip2", "mousedown", 1, 1, 100, 100);
		qutils.triggerMouseEvent(sDrsBubId, "mousemove", 1, 1, 95, 100);
		qutils.triggerMouseEvent(sDrsBubId, "mousemove", 1, 1, 90, 100);
		qutils.triggerMouseEvent(sDrsBubId + "-grip2", "mouseup", 1, 1);

		var sDateBub2TxtAfter = oDrsBub._oBubble2.getText();
		assert.notEqual(sDateBub2TxtAfter, sDateBub2TxtBefore, "End dates label before and after right grip move should not be same.");

		var iGripRightpxAfter = parseInt(oRightGrip.style.left, 10);
		var iBubbleRightpxAfter = parseInt(oRightBubble.style.left, 10);
		var iRightDiffAfter = iGripRightpx - iBubbleRightpx;

		assert.notEqual(iGripRightpxAfter, iGripRightpx, "Grip2 left position should not be the same");
		assert.notEqual(iBubbleRightpxAfter, iBubbleRightpx, "Bubble2 left position should not be the same");
		assert.equal(iRightDiffAfter, iRightDiff, "The distance between right grip and right bubble should be the same.");
	});

	QUnit.test("TestResizeWindow", function(assert) {

		oDrsBub.onresize();

		assert.ok(true, "Resize triggered successfully");
	});

	/******************************************************************/
	var sDrsCodeCoverageTestsId = "drsCodeCoverageTests";
	var oDrsCodeCoverageTests = new DateRangeSliderInternal(sDrsCodeCoverageTestsId);
	oDrsCodeCoverageTests.setTooltip("DateRangeSlider test tooltip for rendering");
	oDrsCodeCoverageTests.setStepLabels(true);
	oDrsCodeCoverageTests.setEditable(false);
	oDrsCodeCoverageTests.placeAt("uiArea4");

	QUnit.module("Code coverage tests" + sModuleSuffix, {
		beforeEach: function() {

		},
		afterEach: function() {

		}
	});

	QUnit.test("SettingVerticalAndHeight", function(assert) {

		var sHeight = oDrsCodeCoverageTests.getHeight();
		var bVertical = oDrsCodeCoverageTests.getVertical();
		oDrsCodeCoverageTests.setVertical(true);
		oDrsCodeCoverageTests.setHeight("200px");
		assert.ok(sHeight === oDrsCodeCoverageTests.getHeight(), "Height is not updated");
		assert.ok(bVertical === oDrsCodeCoverageTests.getVertical(), "Vertical is not updated");
	});

	QUnit.test("EnableDisableSlider", function(assert) {

		assert.ok(oDrsCodeCoverageTests.getEnabled(), "DateRangeSlider is enabled by default");
		oDrsCodeCoverageTests.setEnabled(false);
		oDrsCodeCoverageTests.setEditable(true);
		oDrsCodeCoverageTests.rerender();
		assert.ok(!oDrsCodeCoverageTests.getEnabled(), "DateRangeSlider is disabled");

		var dValue2DateBefore = oDrsCodeCoverageTests.getDateRange().value2Date;
		jQuery("#" + sDrsCodeCoverageTestsId).focus();
		qutils.triggerMouseEvent(sDrsCodeCoverageTestsId + "-grip2", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsCodeCoverageTestsId + "-grip2", "ARROW_LEFT");
		qutils.triggerKeyboardEvent(sDrsCodeCoverageTestsId + "-grip2", "ARROW_LEFT");
		var dValue2DateAfter = oDrsCodeCoverageTests.getDateRange().value2Date;
		assert.equal(dValue2DateAfter.getTime(), dValue2DateBefore.getTime(), "Value2 Date should not have changed since control is disabled");
	});

	QUnit.test("SettingInvisible", function(assert) {

		assert.ok(oDrsCodeCoverageTests.getVisible(), "DateRangeSlider is visible by default");
		oDrsCodeCoverageTests.setVisible(false);
		oDrsCodeCoverageTests.rerender();
		assert.ok(!oDrsCodeCoverageTests.getVisible(), "DateRangeSlider is invisible");
		assert.equal(sDrsCodeCoverageTestsId + "-grip" ? window.document.getElementById(sDrsCodeCoverageTestsId + "-grip") : null, null, "DateRangeSlider left grip should not be rendered.");
	});

	/******************************************************************/
	var sTestLabelsAndTextId = "testLabelsAndText";
	var oDrsLabelsAndTextTests = new DateRangeSliderInternal(sTestLabelsAndTextId);
	oDrsLabelsAndTextTests.setStepLabels(false);

	oDrsLabelsAndTextTests.placeAt("uiArea5");

	QUnit.module("DateRangeSlider Label Tests" + sModuleSuffix, {
		beforeEach: function() {

		},
		afterEach: function() {

		}
	});

	QUnit.test("TestLabelsNotDisplayed", function(assert) {

		var oText = null;
		for (var i = 0; i < 12; i++) {
			oText = sTestLabelsAndTextId + "-text" + i ? window.document.getElementById(sTestLabelsAndTextId + "-text" + i) : null;
			assert.equal(jQuery(oText).text(), "", "Rail label should not be displayed.");
		}
	});

	QUnit.test("TestDefaultLabelsDisplayed", function(assert) {

		oDrsLabelsAndTextTests.setStepLabels(true);
		oDrsLabelsAndTextTests.rerender();

		var oText = null;
		for (var i = 0; i <= 12; i++) {
			oText = sTestLabelsAndTextId + "-text" + i ? window.document.getElementById(sTestLabelsAndTextId + "-text" + i) : null;
			assert.notEqual(jQuery(oText).text(), "", "Default rail label should be displayed");
		}
	});

	QUnit.test("TestUpdatedDefaultLabelsDisplayed", function(assert) {

		var dExpectedMinDate = new Date(2013, 0, 1, 0, 0, 0, 0);
		var dExpectedMaxDate = new Date(2013, 0, 12, 0, 0, 0, 0);

		oDrsLabelsAndTextTests.setMinDate(dExpectedMinDate);
		oDrsLabelsAndTextTests.setMaxDate(dExpectedMaxDate);

		oDrsLabelsAndTextTests.rerender();

		var oText = sTestLabelsAndTextId + "-text" + 0 ? window.document.getElementById(sTestLabelsAndTextId + "-text" + 0) : null;
		var oFormatter = DateFormat.getDateInstance({
			style: "medium"
		});
		var sFormattedMinDate = oFormatter.format(dExpectedMinDate);

		assert.equal(jQuery(oText).text(), sFormattedMinDate, "Specific rail label should be displayed.");
	});

	QUnit.test("TestSpecificLabelsDisplayed", function(assert) {

		oDrsLabelsAndTextTests.setLabels(["Small", "Medium", "Large"]);
		oDrsLabelsAndTextTests.rerender();

		var oText = sTestLabelsAndTextId + "-text" + 0 ? window.document.getElementById(sTestLabelsAndTextId + "-text" + 0) : null;
		assert.equal(jQuery(oText).text(), "Small", "Rail label Small should be displayed.");
		oText = sTestLabelsAndTextId + "-text" + 1 ? window.document.getElementById(sTestLabelsAndTextId + "-text" + 1) : null;
		assert.equal(jQuery(oText).text(), "Medium", "Rail label Medium should be displayed.");
		oText = sTestLabelsAndTextId + "-text" + 2 ? window.document.getElementById(sTestLabelsAndTextId + "-text" + 2) : null;
		assert.equal(jQuery(oText).text(), "Large", "Rail label Large should be displayed");
	});

	QUnit.test("TestDefaultLabelsDisplayedWhenLabelsEmpty", function(assert) {

		oDrsLabelsAndTextTests.setLabels([]);
		oDrsLabelsAndTextTests.rerender();

		var oText = null;
		for (var i = 0; i <= 12; i++) {
			oText = sTestLabelsAndTextId + "-text" + i ? window.document.getElementById(sTestLabelsAndTextId + "-text" + i) : null;
			assert.notEqual(jQuery(oText).text(), "", "Default rail label should be displayed.");
		}
	});

	QUnit.test("TestDefaultLablesWithTotalUnitsDisplayed", function(assert) {

		oDrsLabelsAndTextTests.setStepLabels(true);
		oDrsLabelsAndTextTests.setTotalUnits(3);
		oDrsLabelsAndTextTests.rerender();

		var oText = sTestLabelsAndTextId + "-text" + 4 ? window.document.getElementById(sTestLabelsAndTextId + "-text" + 4) : null;
		assert.equal(oText, null, "Too many labels displayed.");
	});

	QUnit.test("TestDefaultLablesWithTotalUnitsDisplayed", function(assert) {

		oDrsLabelsAndTextTests.setStepLabels(true);
		oDrsLabelsAndTextTests.setTotalUnits(3);
		oDrsLabelsAndTextTests.rerender();

		var oText = sTestLabelsAndTextId + "-text" + 4 ? window.document.getElementById(sTestLabelsAndTextId + "-text" + 4) : null;
		assert.equal(oText, null, "Too many labels displayed.");
	});

	/******************************************************************/
	var sTestMinMaxDateId = "testMinMaxDate";
	var oDrsMinMaxDateTests = new DateRangeSliderInternal(sTestMinMaxDateId);
	oDrsMinMaxDateTests.placeAt("uiArea6");

	QUnit.module("DateRangeSlider Min And Max Dates Tests" + sModuleSuffix, {
		beforeEach: function() {

		},
		afterEach: function() {

		}
	});

	QUnit.test("TestSetAndGetMaxDate", function(assert) {

		var iValue2Old = oDrsMinMaxDateTests.getValue2();
		var dMaxOld = oDrsMinMaxDateTests.getMaxDate();
		var dMaxNew = new Date(dMaxOld.getTime());
		dMaxNew.setFullYear(dMaxOld.getFullYear() + 1);
		oDrsMinMaxDateTests.setMaxDate(dMaxNew);
		assert.deepEqual(dMaxNew, oDrsMinMaxDateTests.getMaxDate(), "Max date moved one year ahead.");
		assert.equal(iValue2Old, oDrsMinMaxDateTests.getValue2(), "Position of grip2 did not change.");
		var dMaxNewer = new Date(dMaxOld.getTime());
		dMaxNewer.setMonth(dMaxNewer.getMonth() - 3);
		oDrsMinMaxDateTests.setMaxDate(dMaxNewer);
		assert.notEqual(iValue2Old, oDrsMinMaxDateTests.getValue2(), "Position of grip2 did change.");
		assert.equal(oDrsMinMaxDateTests.getMax(), oDrsMinMaxDateTests.getValue2(), "Value2 changed to max.");

		//change the granularity to month

		var dMaxDateMonth = oDrsMinMaxDateTests.getMaxDate();
		DateUtils.resetDateToEndOfMonth(dMaxDateMonth);
		oDrsMinMaxDateTests.setMonthGranularity();
		assert.deepEqual(dMaxDateMonth, oDrsMinMaxDateTests.getMaxDate(), "Max date changed to end of the month.");
		dMaxDateMonth.setDate(dMaxDateMonth.getDate() + 12);
		dMaxDateMonth.setMonth(dMaxDateMonth.getMonth() + 2);
		oDrsMinMaxDateTests.setMaxDate(dMaxDateMonth);
		DateUtils.resetDateToEndOfMonth(dMaxDateMonth);
		assert.deepEqual(dMaxDateMonth, oDrsMinMaxDateTests.getMaxDate(), "Max date changed to end of the month of the supplied date.");

	});

	QUnit.test("TestSetAndGetMinDate", function(assert) {

		//change the granularity to Day

		oDrsMinMaxDateTests.setDayGranularity();

		var iValueOld = oDrsMinMaxDateTests.getValue();
		var dMinOld = oDrsMinMaxDateTests.getMinDate();
		var dMinNew = new Date(dMinOld.getTime());
		dMinNew.setFullYear(dMinOld.getFullYear() - 1);
		oDrsMinMaxDateTests.setMinDate(dMinNew);
		assert.deepEqual(dMinNew, oDrsMinMaxDateTests.getMinDate(), "Min date moved one year back.");
		assert.notEqual(iValueOld, oDrsMinMaxDateTests.getValue(), "Position of grip did change.");
		var dMinNewer = new Date(dMinOld.getTime());
		dMinNewer.setMonth(dMinNewer.getMonth() + 3);
		oDrsMinMaxDateTests.setMinDate(dMinNewer);
		assert.equal(iValueOld, oDrsMinMaxDateTests.getValue(), "Position of grip did not change.");
		assert.equal(oDrsMinMaxDateTests.getMin(), oDrsMinMaxDateTests.getValue(), "Value changed to min.");

		//change the granularity to Month

		var dMinDateMonth = oDrsMinMaxDateTests.getMinDate();
		DateUtils.resetDateToStartOfMonth(dMinDateMonth);
		oDrsMinMaxDateTests.setMonthGranularity();
		assert.deepEqual(dMinDateMonth, oDrsMinMaxDateTests.getMinDate(), "Min date changed to start of the month.");
		dMinDateMonth.setDate(dMinDateMonth.getDate() - 12);
		dMinDateMonth.setMonth(dMinDateMonth.getMonth() - 2);
		oDrsMinMaxDateTests.setMinDate(dMinDateMonth);
		DateUtils.resetDateToStartOfMonth(dMinDateMonth);
		assert.deepEqual(dMinDateMonth, oDrsMinMaxDateTests.getMinDate(), "Min date changed to start of the month of the supplied date.");
	});

	/******************************************************************/

	var sTestValueValue2DateId = "testValueValue2Date";
	var oDrsValueValue2DateTests = new DateRangeSliderInternal(sTestValueValue2DateId);
	oDrsValueValue2DateTests.placeAt("uiArea7");

	QUnit.module("DateRangeSlider value And value2 Dates Tests" + sModuleSuffix, {
		beforeEach: function() {

		},
		afterEach: function() {

		}
	});

	QUnit.test("TestSetAndGetValueDate", function(assert) {

		var iValueOld = oDrsValueValue2DateTests.getValue();
		var iValueNew = iValueOld + 10;
		var dValueOld = oDrsValueValue2DateTests.getValueDate();
		var dValueNew = new Date(dValueOld.getTime());
		dValueNew.setDate(dValueOld.getDate() + 10);
		oDrsValueValue2DateTests.setValueDate(dValueNew);

		assert.deepEqual(oDrsValueValue2DateTests.getValueDate(), dValueNew, "value date moved 10 days after.");
		assert.equal(oDrsValueValue2DateTests.getValue(), iValueNew, "value increased by 10 units.");

		//change the granularity to Month

		oDrsValueValue2DateTests.setMonthGranularity();
		var iValueMonth = oDrsValueValue2DateTests.getValue();
		var dValueDateMonth = oDrsValueValue2DateTests.getValueDate();
		dValueDateMonth.setDate(dValueDateMonth.getDate() + 10);
		dValueDateMonth.setMonth(dValueDateMonth.getMonth() + 1);
		oDrsValueValue2DateTests.setValueDate(dValueDateMonth);
		DateUtils.resetDateToStartOfMonth(dValueDateMonth);
		assert.deepEqual(dValueDateMonth, oDrsValueValue2DateTests.getValueDate(), "Value date changed to start of the month of the supplied date.");
		assert.equal(iValueMonth + 1, oDrsValueValue2DateTests.getValue(), "Value increased by 1 unit.");
	});

	QUnit.test("TestSetAndGetValue2Date", function(assert) {

		//change the granularity to Day

		oDrsValueValue2DateTests.setDayGranularity();

		var iValue2Old = oDrsValueValue2DateTests.getValue2();
		var iValue2New = iValue2Old - 10;

		var dValue2Old = oDrsValueValue2DateTests.getValue2Date();

		var dValue2New = new Date(dValue2Old.getTime());
		dValue2New.setDate(dValue2Old.getDate() - 10);
		oDrsValueValue2DateTests.setValue2Date(dValue2New);

		DateUtils.resetDateToEndOfDay(dValue2New);
		assert.deepEqual(oDrsValueValue2DateTests.getValue2Date(), dValue2New, "value2 date moved 10 days before.");
		assert.equal(oDrsValueValue2DateTests.getValue2(), iValue2New, "value2 reduced by 10 units.");

		//change the granularity to Month

		oDrsValueValue2DateTests.setMonthGranularity();
		var iValue2Month = oDrsValueValue2DateTests.getValue2();
		var dValue2DateMonth = oDrsValueValue2DateTests.getValue2Date();
		dValue2DateMonth.setDate(dValue2DateMonth.getDate() - 10);
		dValue2DateMonth.setMonth(dValue2DateMonth.getMonth() - 1);
		oDrsValueValue2DateTests.setValue2Date(dValue2DateMonth);
		DateUtils.resetDateToEndOfMonth(dValue2DateMonth);
		assert.deepEqual(dValue2DateMonth, oDrsValueValue2DateTests.getValue2Date(), "Value2 date changed to end of the month of the supplied date.");
		assert.equal(iValue2Month - 1, oDrsValueValue2DateTests.getValue2(), "Value2 decreased by 1 unit.");
	});

	QUnit.test("TestSetValueDateToSameValue2Date", function(assert) {

		//change the granularity to Day

		oDrsValueValue2DateTests.setDayGranularity();
		var dValueDateNew = new Date(oDrsValueValue2DateTests.getValue2Date());
		DateUtils.resetDateToStartOfDay(dValueDateNew);

		oDrsValueValue2DateTests.setValueDate(dValueDateNew);

		assert.deepEqual(oDrsValueValue2DateTests.getValueDate(), dValueDateNew, "value date moved to the same date as value2 date.");
	});

	/******************************************************************/

	var sTestPropertiesId = "testProperties";
	var oDrsPropertiesTests = new DateRangeSliderInternal(sTestPropertiesId);

	QUnit.module("Property Tests" + sModuleSuffix, {
		beforeEach: function() {

		},
		afterEach: function() {

		}
	});

	QUnit.test("TestIntegerValueSmallStepWidth", function(assert) {

		var fSmallStepWidth = 1.5;
		var iExpectedSmallStepWidth = Math.round(fSmallStepWidth);

		oDrsPropertiesTests.setSmallStepWidth(fSmallStepWidth);

		assert.equal(oDrsPropertiesTests.getSmallStepWidth(), iExpectedSmallStepWidth, "Unexpected smallStepWidth.");
	});

	/******************************************************************/

	var sTestGranularityId = "testGranularity";
	var oDrsGranularityTests = new DateRangeSliderInternal(sTestGranularityId, {
		stepLabels: true
	});
	oDrsGranularityTests.placeAt("uiArea8");

	QUnit.module("DateRangeSlider Granularity Tests" + sModuleSuffix, {
		beforeEach: function() {

		},
		afterEach: function() {

		}
	});

	QUnit.test("TestMonthGranularity", function(assert) {

		var dMinDate = oDrsGranularityTests.getMinDate();
		var dValueDate = oDrsGranularityTests.getValueDate();
		var dValue2Date = oDrsGranularityTests.getValue2Date();
		var dMaxDate = oDrsGranularityTests.getMaxDate();

		oDrsGranularityTests.setMonthGranularity();

		DateUtils.resetDateToStartOfMonth(dMinDate);
		DateUtils.resetDateToStartOfMonth(dValueDate);
		DateUtils.resetDateToEndOfMonth(dValue2Date);
		DateUtils.resetDateToEndOfMonth(dMaxDate);

		assert.deepEqual(oDrsGranularityTests.getMinDate(), dMinDate, "min date moved to start of the month.");
		assert.deepEqual(oDrsGranularityTests.getValueDate(), dValueDate, "value date moved to start of the month.");

		assert.deepEqual(oDrsGranularityTests.getValue2Date(), dValue2Date, "value2 date moved to end of the current month.");
		assert.deepEqual(oDrsGranularityTests.getMaxDate(), dMaxDate, "max date moved to end of the current month.");

		// move grip to right by 2 units
		jQuery("#" + sTestGranularityId).focus();
		qutils.triggerMouseEvent(sTestGranularityId + "-grip", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sTestGranularityId + "-grip", "ARROW_RIGHT");
		qutils.triggerKeyboardEvent(sTestGranularityId + "-grip", "ARROW_RIGHT");

		dValueDate.setMonth(dValueDate.getMonth() + 2);
		assert.deepEqual(oDrsGranularityTests.getValueDate(), dValueDate, "value date moved to 2 months forward.");

		// move grip2 to left by 2 units
		qutils.triggerMouseEvent(sTestGranularityId + "-grip2", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sTestGranularityId + "-grip2", "ARROW_LEFT");
		qutils.triggerKeyboardEvent(sTestGranularityId + "-grip2", "ARROW_LEFT");

		DateUtils.resetDateToStartOfMonth(dValue2Date);
		dValue2Date.setMonth(dValue2Date.getMonth() - 2);
		DateUtils.resetDateToEndOfMonth(dValue2Date);
		assert.deepEqual(oDrsGranularityTests.getValue2Date(), dValue2Date, "value2 date moved to 2 months backwards.");

	});

	QUnit.test("TestDayGranularity", function(assert) {

		var dMinDate = oDrsGranularityTests.getMinDate();
		var dValueDate = oDrsGranularityTests.getValueDate();
		var dValue2Date = oDrsGranularityTests.getValue2Date();
		var dMaxDate = oDrsGranularityTests.getMaxDate();

		oDrsGranularityTests.setDayGranularity();

		assert.deepEqual(oDrsGranularityTests.getMinDate(), dMinDate, "min date should remain same.");
		assert.deepEqual(oDrsGranularityTests.getValueDate(), dValueDate, "value date should remain same.");

		assert.deepEqual(oDrsGranularityTests.getValue2Date(), dValue2Date, "value2 date should remain same.");
		assert.deepEqual(oDrsGranularityTests.getMaxDate(), dMaxDate, "max date should remain same.");

		// move grip to right by 2 units
		jQuery("#" + sTestGranularityId).focus();
		qutils.triggerMouseEvent(sTestGranularityId + "-grip", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sTestGranularityId + "-grip", "ARROW_RIGHT");
		qutils.triggerKeyboardEvent(sTestGranularityId + "-grip", "ARROW_RIGHT");

		dValueDate.setDate(dValueDate.getDate() + 2);
		assert.deepEqual(oDrsGranularityTests.getValueDate(), dValueDate, "value date moved to 2 days forward.");

		// move grip2 to left by 2 units
		qutils.triggerMouseEvent(sTestGranularityId + "-grip2", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sTestGranularityId + "-grip2", "ARROW_LEFT");
		qutils.triggerKeyboardEvent(sTestGranularityId + "-grip2", "ARROW_LEFT");

		dValue2Date.setDate(dValue2Date.getDate() - 2);
		assert.deepEqual(oDrsGranularityTests.getValue2Date(), dValue2Date, "value2 date moved to 2 days backwards.");
	});

	/*******************************************************************************************************************/
	var sTestSetDateFormatId = "testSetDateFormat";
	var oDrsSetDateFormatTests = new DateRangeSliderInternal(sTestSetDateFormatId, {
		stepLabels: true
	});

	oDrsSetDateFormatTests.placeAt("uiArea9");

	QUnit.module("Test setDateFormat API" + sModuleSuffix, {
		beforeEach: function() {
		}
	});

	QUnit.test("TestDateFormatIsNotSetInitially", function(assert) {

		assert.equal(oDrsSetDateFormatTests.getDateFormat(), null, "Date format of the control should not be set initially.");
	});

	QUnit.test("TestDateFormatIsSetCorrectly", function(assert) {

		var oLocale = new Locale("de");
		oDrsSetDateFormatTests.setDateFormat(DateFormat.getDateInstance(oLocale));
		assert.notEqual(oDrsSetDateFormatTests.getDateFormat(), null, "Date format of the control should be set to supplied date format.");
		oDrsSetDateFormatTests.setDateFormat(null);
		assert.equal(oDrsSetDateFormatTests.getDateFormat(), null, "Date format of the control should not be set if null is passed.");
		oDrsSetDateFormatTests.setDateFormat(DateFormat.getDateInstance(oLocale));
		assert.notEqual(oDrsSetDateFormatTests.getDateFormat(), null, "Date format of the control should be set to supplied date format.");
		oDrsSetDateFormatTests.setDateFormat(new Boolean(true));
		assert.equal(oDrsSetDateFormatTests.getDateFormat(), null, "Date format of the control should not be set if invalid obj is passed.");
	});

	QUnit.test("TestDateFormatSetToPattern", function(assert) {

		var oDateFormat = DateFormat.getDateInstance({
			pattern: "YYYY-MM-dd"
		});
		var sExpectedPattern = "YYYY-MM-dd";

		oDrsSetDateFormatTests.setDateFormat(oDateFormat);
		var oUpdatedDateFomat = oDrsSetDateFormatTests.getDateFormat();
		assert.equal(oUpdatedDateFomat.oFormatOptions.pattern, sExpectedPattern, "Date format of the control should be set to YYYY-MM-dd.");

	});

	QUnit.test("TestDateFormatSetToStyle", function(assert) {

		var oDateFormat = DateFormat.getDateInstance({
			style: "short"
		});
		var sExpectedStyle = "short";

		oDrsSetDateFormatTests.setDateFormat(oDateFormat);
		var oUpdatedDateFomat = oDrsSetDateFormatTests.getDateFormat();
		assert.equal(oUpdatedDateFomat.oFormatOptions.style, sExpectedStyle, "Date format of the control should be set to Style short.");

	});

	/*******************************************************************************************************************/

	var sDrsPinGripGrip2Id = "testPinGripPinGrip2";
	var oDrsPinGripGrip2Slider = new DateRangeSliderInternal(sDrsPinGripGrip2Id);
	oDrsPinGripGrip2Slider.placeAt("uiArea10");

	QUnit.module("Test pinGrip/pinGrip2 Properties" + sModuleSuffix, {
		beforeEach: function() {

		},
		afterEach: function() {

		}
	});

	QUnit.test("TestPinGripAndPinGrip2AreFalseInitially", function(assert) {

		assert.equal(oDrsPinGripGrip2Slider.getPinGrip(), false, "PinGrip property is set to false initially.");
		assert.equal(oDrsPinGripGrip2Slider.getPinGrip2(), false, "PinGrip2 property is set to false initially.");
	});

	QUnit.test("TestPinGripAndPinGrip2AreSettingCorrectly", function(assert) {

		oDrsPinGripGrip2Slider.setPinGrip(true);
		oDrsPinGripGrip2Slider.setPinGrip2(true);
		assert.equal(oDrsPinGripGrip2Slider.getPinGrip(), true, "PinGrip property is set to true.");
		assert.equal(oDrsPinGripGrip2Slider.getPinGrip2(), true, "PinGrip2 property is set to true.");

		oDrsPinGripGrip2Slider.setPinGrip(false);
		oDrsPinGripGrip2Slider.setPinGrip2(false);
		assert.equal(oDrsPinGripGrip2Slider.getPinGrip(), false, "PinGrip property is set again to false.");
		assert.equal(oDrsPinGripGrip2Slider.getPinGrip2(), false, "PinGrip2 property is set again to false.");
	});

	QUnit.test("TestPinGripStopMove", function(assert) {
		var iValue = oDrsPinGripGrip2Slider.getValue();
		oDrsPinGripGrip2Slider.setPinGrip(true);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-grip", "mousedown", 1, 1, 0, 0);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id, "mousemove", 1, 1, 5, 0);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-grip", "mouseup", 1, 1);
		assert.equal(oDrsPinGripGrip2Slider.getValue(), iValue, "PinGrip is true and grip is not moved.");
	});

	QUnit.test("TestPinGripMoveAgain", function(assert) {
		var iValue = oDrsPinGripGrip2Slider.getValue();
		oDrsPinGripGrip2Slider.setPinGrip(false);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-grip", "mousedown", 1, 1, 0, 0);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id, "mousemove", 1, 1, 5, 0);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-grip", "mouseup", 1, 1);
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), iValue, "PinGrip is false and grip is moved.");
	});

	QUnit.test("TestPinGrip2StopMove", function(assert) {
		var iValue2 = oDrsPinGripGrip2Slider.getValue2();
		oDrsPinGripGrip2Slider.setValue2(iValue2 - 10);
		iValue2 = oDrsPinGripGrip2Slider.getValue2();

		oDrsPinGripGrip2Slider.setPinGrip2(true);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-grip2", "mousedown", 1, 1, 0, 0);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id, "mousemove", 1, 1, 5, 0);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-grip2", "mouseup", 1, 1);
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), iValue2, "PinGrip2 is true and grip2 is not moved.");
	});

	QUnit.test("TestPinGrip2MoveAgain", function(assert) {
		var iValue2 = oDrsPinGripGrip2Slider.getValue2();

		oDrsPinGripGrip2Slider.setPinGrip2(false);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-grip2", "mousedown", 1, 1, 355, 0);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id, "mousemove", 1, 1, 360, 0);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-grip2", "mouseup", 1, 1);
		assert.notEqual(oDrsPinGripGrip2Slider.getValue2(), iValue2, "PinGrip2 is false and grip2 is moved.");
	});

	QUnit.test("TestKeyboardPinGrip", function(assert) {

		oDrsPinGripGrip2Slider.setPinGrip(true);

		oDrsPinGripGrip2Slider.setValue(100);
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "HOME");

		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value not changed after keyboard home on pinGrip.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "END");
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value not changed after keyboard end on pinGrip.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "ARROW_RIGHT");
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value not changed after keyboard right Arrow on pinGrip.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "ARROW_LEFT");
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value not changed after keyboard left Arrow on pinGrip.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "ARROW_UP");
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value not changed after keyboard up Arrow on pinGrip.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "ARROW_DOWN");
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value not changed after keyboard down Arrow on pinGrip.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "NUMPAD_PLUS");
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value not changed after keyboard '+' on pinGrip.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "NUMPAD_MINUS");
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value not changed after keyboard '-' on pinGrip.");

	});

	QUnit.test("TestKeyboardPinGrip2", function(assert) {

		oDrsPinGripGrip2Slider.setPinGrip2(true);

		oDrsPinGripGrip2Slider.setValue2(200);
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "HOME");
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 not changed after keyboard home on pinGrip2.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "END");
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 not changed after keyboard end on pinGrip2.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "ARROW_RIGHT");
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 not changed after keyboard right Arrow on pinGrip2.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "ARROW_LEFT");
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 not changed after keyboard left Arrow on pinGrip2.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "ARROW_UP");
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 not changed after keyboard up Arrow on pinGrip2.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "ARROW_DOWN");
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 not changed after keyboard down Arrow on pinGrip2.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "NUMPAD_PLUS");
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 not changed after keyboard '+' on pinGrip2.");

		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id, "NUMPAD_MINUS");
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 not changed after keyboard '-' on pinGrip2.");
	});

	QUnit.test("TestKeyboardUnPinGrip2", function(assert) {

		oDrsPinGripGrip2Slider.setPinGrip2(false);
		oDrsPinGripGrip2Slider.setMin(0);
		oDrsPinGripGrip2Slider.setMax(365);
		oDrsPinGripGrip2Slider.setValue(0);
		oDrsPinGripGrip2Slider.setValue2(200);

		jQuery("#" + sDrsPinGripGrip2Id + "-grip2").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip2", "HOME");
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 0, "Value2 is 0 after keyboard home action on pinGrip2.");

		oDrsPinGripGrip2Slider.setValue2(300);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip2").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip2", "END");
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 365, "Value2 is 365 after keyboard end action on pinGrip2.");

		oDrsPinGripGrip2Slider.setValue2(300);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip2").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip2", "ARROW_RIGHT");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 300, "Value changed after keyboard right Arrow when un-pinGrip.");

		oDrsPinGripGrip2Slider.setValue2(300);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip2").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip2", "ARROW_LEFT");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 300, "Value changed after keyboard left Arrow when un-pinGrip.");

		oDrsPinGripGrip2Slider.setValue2(300);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip2").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip2", "ARROW_UP");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 300, "Value changed after keyboard up Arrow when un-pinGrip.");

		oDrsPinGripGrip2Slider.setValue2(300);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip2").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip2", "ARROW_DOWN");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 300, "Value changed after keyboard down Arrow when un-pinGrip.");

		oDrsPinGripGrip2Slider.setValue2(300);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip2").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip2", "NUMPAD_PLUS");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 300, "Value changed after keyboard '+' when un-pinGrip.");

		oDrsPinGripGrip2Slider.setValue2(300);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip2").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip2", "NUMPAD_MINUS");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 300, "Value changed after keyboard '-' when un-pinGrip.");

	});

	QUnit.test("TestKeyboardUnPinGrip", function(assert) {

		oDrsPinGripGrip2Slider.setPinGrip(false);
		oDrsPinGripGrip2Slider.setMin(0);
		oDrsPinGripGrip2Slider.setMax(365);
		oDrsPinGripGrip2Slider.setValue(100);
		oDrsPinGripGrip2Slider.setValue2(365);

		jQuery("#" + sDrsPinGripGrip2Id + "-grip").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip", "HOME");
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 0, "Value is 0 after keyboard home action on Grip.");

		jQuery("#" + sDrsPinGripGrip2Id + "-grip").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip", "END");
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 365, "Value is 365 after keyboard end action on Grip.");

		oDrsPinGripGrip2Slider.setValue(100);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip", "ARROW_RIGHT");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value changed after keyboard right Arrow when un-pinGrip.");

		oDrsPinGripGrip2Slider.setValue(100);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip", "ARROW_LEFT");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value changed after keyboard left Arrow when un-pinGrip.");

		oDrsPinGripGrip2Slider.setValue(100);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip", "ARROW_UP");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value changed after keyboard up Arrow when un-pinGrip.");

		oDrsPinGripGrip2Slider.setValue(100);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip", "ARROW_DOWN");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value changed after keyboard down Arrow when un-pinGrip.");

		oDrsPinGripGrip2Slider.setValue(100);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip", "NUMPAD_PLUS");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value changed after keyboard '+' when un-pinGrip.");

		oDrsPinGripGrip2Slider.setValue(100);
		jQuery("#" + sDrsPinGripGrip2Id + "-grip").focus();
		qutils.triggerKeyboardEvent(sDrsPinGripGrip2Id + "-grip", "NUMPAD_MINUS");
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value changed after keyboard '-' when un-pinGrip.");
	});

	QUnit.test("TestOnClickNotMoveAfterPinGrip", function(assert) {
		oDrsPinGripGrip2Slider.setValue(100);
		jQuery("#" + sDrsPinGripGrip2Id).focus();
		oDrsPinGripGrip2Slider.setPinGrip(true);

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id, "click", 117, 1);
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value after click on control not changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-bar", "click", 55, 2);
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value after click on bar not changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-left", "click", 1, 1);
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value after click on left end not changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-right", "click", 505, 2);
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value after click on right end not changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-tick6", "click", 1, 2);
		assert.equal(oDrsPinGripGrip2Slider.getValue(), 100, "Value after click on tick6 not changed.");

	});

	QUnit.test("TestOnClickNotMoveAfterPinGrip2", function(assert) {
		jQuery("#" + sDrsPinGripGrip2Id).focus();
		oDrsPinGripGrip2Slider.setPinGrip2(true);

		var fValueChange = -1;
		oDrsPinGripGrip2Slider.attachChange(function(oEvent) {
			fValueChange = oEvent.getParameter("value2");
		});
		oDrsPinGripGrip2Slider.setValue2(200);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id, "click", 117, 1);
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 after click on control not changed.");
		assert.equal(fValueChange, -1, "Change event value2 after click on control not changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-bar", "click", 55, 2);
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 after click on bar not changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-left", "click", 1, 1);
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 after click on left end not changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-right", "click", 505, 2);
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 after click on right end not changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-tick6", "click", 1, 2);
		assert.equal(oDrsPinGripGrip2Slider.getValue2(), 200, "Value2 after click on tick6 not changed.");

		oDrsPinGripGrip2Slider.detachChange();
	});

	QUnit.test("TestOnClickMoveAfterUnPinGrip", function(assert) {
		jQuery("#" + sDrsPinGripGrip2Id).focus();
		oDrsPinGripGrip2Slider.setPinGrip(false);

		var fValueChange = -1;
		oDrsPinGripGrip2Slider.attachChange(function(oEvent) {
			fValueChange = oEvent.getParameter("value");
		});
		oDrsPinGripGrip2Slider.setValue(100);
		qutils.triggerMouseEvent(sDrsPinGripGrip2Id, "click", 117, 1);
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value after click on control changed.");
		assert.notEqual(fValueChange, -1, "Change event value after click on control changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-bar", "click", 55, 2);
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value after click on bar changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-left", "click", 1, 1);
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value after click on left end changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-right", "click", 505, 2);
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value after click on right end changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-tick6", "click", 1, 2);
		assert.notEqual(oDrsPinGripGrip2Slider.getValue(), 100, "Value after click on tick6 changed.");

		oDrsPinGripGrip2Slider.detachChange();
	});

	QUnit.test("TestOnClickMoveAfterUnPinGrip2", function(assert) {
		jQuery("#" + sDrsPinGripGrip2Id).focus();
		oDrsPinGripGrip2Slider.setPinGrip2(false);

		var fValueChange = -1;
		oDrsPinGripGrip2Slider.attachChange(function(oEvent) {
			fValueChange = oEvent.getParameter("value2");
		});
		oDrsPinGripGrip2Slider.setValue(0);
		oDrsPinGripGrip2Slider.setValue2(250);

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id, "click", 300, 0);
		assert.notEqual(fValueChange, -1, "Change event value2 after click on control changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-right", "click", 260, 2);
		assert.notEqual(oDrsPinGripGrip2Slider.getValue2(), 250, "Value2 after click on right end changed.");

		qutils.triggerMouseEvent(sDrsPinGripGrip2Id + "-tick6", "click", 261, 2);
		assert.notEqual(oDrsPinGripGrip2Slider.getValue2(), 250, "Value2 after click on tick6 not changed.");

		oDrsPinGripGrip2Slider.detachChange();
	});

	/*******************************************************************************************/
	function formatDate(dDate) {

		var oFormatter = DateFormat.getDateInstance({
			style: "medium"
		});
		return oFormatter.format(dDate);
	}

	/*******************************************************************************************/
});
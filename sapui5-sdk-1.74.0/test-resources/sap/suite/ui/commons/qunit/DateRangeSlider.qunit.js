/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/DateRangeSlider",
	"sap/suite/ui/commons/util/DateUtils",
	"sap/ui/core/Locale",
	"sap/ui/core/format/DateFormat",
	"sap/ui/thirdparty/jquery"
], function(
	QUnitUtils,
	createAndAppendDiv,
	DateRangeSlider,
	DateUtils,
	Locale,
	DateFormat,
	jQuery
) {
	"use strict";
	createAndAppendDiv("qunit-fixture-1");
	createAndAppendDiv("qunit-fixture-2");
	createAndAppendDiv("qunit-fixture-3");
	createAndAppendDiv("qunit-fixture-4");
	createAndAppendDiv("qunit-fixture-5");
	createAndAppendDiv("qunit-fixture-6");
	createAndAppendDiv("qunit-fixture-7");


	var iIndex = 10;
	function next() {

		return iIndex++;
	}

	var sModuleSuffix = " - sap.suite.ui.commons.DateRangeSlider";

	var sDrsId = "dateRangeSliderId";

	var oDrs = new DateRangeSlider(sDrsId);
	oDrs.placeAt("qunit-fixture-1");

	/******************************************************************/
	QUnit.module("Rendering Tests" + sModuleSuffix);

	QUnit.test("TestRendering", function(assert) {

		assert.notEqual(sDrsId ? window.document.getElementById(sDrsId) : null, null, "DateRangeSlider outer HTML Element should be rendered.");
		assert.notEqual(sDrsId + "-dateRangeSliderInternal" ? window.document.getElementById(sDrsId + "-dateRangeSliderInternal") : null, null, "DateRangeSliderInternal outer HTML Element should be rendered.");
		assert.notEqual(sDrsId + "-dateRangeSliderInternal-bar" ? window.document.getElementById(sDrsId + "-dateRangeSliderInternal-bar") : null, null, "DateRangeSlider inner slider control should be rendered.");
		assert.notEqual(sDrsId + "-dateRangeSliderInternal-grip" ? window.document.getElementById(sDrsId + "-dateRangeSliderInternal-grip") : null, null, "DateRangeSlider inner slider control grip should be rendered.");
		assert.notEqual(sDrsId + "-dateRangeSliderInternal-grip2" ? window.document.getElementById(sDrsId + "-dateRangeSliderInternal-grip2") : null, null, "DateRangeSlider inner slider control grip2 should be rendered.");
		assert.notEqual(sDrsId + "-dateRangeSliderInternal-bubble" ? window.document.getElementById(sDrsId + "-dateRangeSliderInternal-bubble") : null, null, "DateRangeSlider left bubble should be rendered.");
		assert.notEqual(sDrsId + "-dateRangeSliderInternal-bubble2" ? window.document.getElementById(sDrsId + "-dateRangeSliderInternal-bubble2") : null, null, "DateRangeSlider right bubble should be rendered.");
		assert.notEqual(sDrsId + "-dateRangeSliderInternal-bubbleTxt" ? window.document.getElementById(sDrsId + "-dateRangeSliderInternal-bubbleTxt") : null, null, "DateRangeSlider left bubble text should be rendered.");
		assert.notEqual(sDrsId + "-dateRangeSliderInternal-bubbleTxt2" ? window.document.getElementById(sDrsId + "-dateRangeSliderInternal-bubbleTxt2") : null, null, "DateRangeSlider right bubble text should be rendered.");
	});

	/******************************************************************/

	var sDrsPropertiesId = sDrsId + next();
	var oDrsProperties = new DateRangeSlider(sDrsPropertiesId);
	oDrsProperties.placeAt("qunit-fixture-2");

	QUnit.module("Properties tests" + sModuleSuffix, {
		beforeEach : function() {

		},
		afterEach : function() {

		}
	});

	QUnit.test("TestProperties", function(assert) {

		assert.equal(oDrsProperties.getShowBubbles(), true, "ShowBubbles property is set to true by default.");
		assert.equal(oDrsProperties.getEnabled(), true, "Enabled property is set to true by default.");
		assert.equal(oDrsProperties.getEditable(), true, "Editable property is set to true by default.");
		assert.equal(oDrsProperties.getWidth(), "100%", "Width property is set to 100% by default.");
		assert.equal(oDrsProperties.getStepLabels(), false, "StepLabels property is set to false by default.");

		var aLabels = [ "1", "2", "3" ];

		oDrsProperties.setShowBubbles(false);
		oDrsProperties.setEnabled(false);
		oDrsProperties.setEditable(false);
		oDrsProperties.setWidth("75%");
		oDrsProperties.setStepLabels(true);
		oDrsProperties.setTotalUnits(15);
		oDrsProperties.setSmallStepWidth(5);
		oDrsProperties.setLabels(aLabels);

		assert.ok(!oDrsProperties.getShowBubbles(), "ShowBubbles property is set to false");
		assert.ok(!oDrsProperties._oDateRangeSliderInternal.getShowBubbles(), "oDrsProperties's DateRangeSliderInternal Object's ShowBubbles property is set to false");
		assert.ok(!oDrsProperties.getEnabled(), "Enabled property is set to false");
		assert.ok(!oDrsProperties._oDateRangeSliderInternal.getEnabled(), "oDrsProperties's DateRangeSliderInternal Object's ShowBubbles property is set to false");
		assert.ok(!oDrsProperties.getEditable(), "Editable property is set to false");
		assert.ok(!oDrsProperties._oDateRangeSliderInternal.getEditable(), "oDrsProperties's DateRangeSliderInternal Object's Editable property is set to false");
		assert.equal(oDrsProperties.getWidth(), "75%", "Width property is should have set to 75%.");
		assert.equal(oDrsProperties._oDateRangeSliderInternal.getWidth(), "75%", "oDrsProperties's DateRangeSliderInternal Object's Width property is should have set to 75%.");
		assert.equal(oDrsProperties.getStepLabels(), true, "StepLabels property is set to true.");
		assert.equal(oDrsProperties._oDateRangeSliderInternal.getStepLabels(), true, "oDrsProperties's DateRangeSliderInternal Object's StepLabels property is set to true.");
		assert.equal(oDrsProperties.getTotalUnits(), 15, "Total Units property is set to 15.");
		assert.equal(oDrsProperties._oDateRangeSliderInternal.getTotalUnits(), 15, "oDrsProperties's DateRangeSliderInternal Object's Total Units property is set to 15.");
		assert.equal(oDrsProperties.getSmallStepWidth(), 5, "Small Step Width property is set to 5.");
		assert.equal(oDrsProperties._oDateRangeSliderInternal.getSmallStepWidth(), 5, "oDrsProperties's DateRangeSliderInternal Object's Small Step Width property is set to 5.");
		assert.deepEqual(oDrsProperties.getLabels(), aLabels, "Labels property is should have set to supplied string array.");
		assert.deepEqual(oDrsProperties._oDateRangeSliderInternal.getLabels(), aLabels,
				"oDrsProperties's DateRangeSliderInternal Object's Labels property is should have set to supplied string array.");

	});

	QUnit.test("TestMinAndMax", function(assert) {

		var dMin = oDrsProperties.getMin();
		var dMax = oDrsProperties.getMax();

		assert.ok(dMin instanceof Date, "Min is instance of date.");
		assert.ok(dMax instanceof Date, "Max is instance of date.");

		oDrsProperties.setMin(null);
		oDrsProperties.setMax(null);

		assert.deepEqual(oDrsProperties.getMin(), dMin, "Min does not change to null.");
		assert.deepEqual(oDrsProperties.getMax(), dMax, "Max does not change to null.");

		oDrsProperties.setMin(new Boolean(false));
		oDrsProperties.setMax(new Boolean(false));

		assert.deepEqual(oDrsProperties.getMin(), dMin, "Min does not change to boolean.");
		assert.deepEqual(oDrsProperties.getMax(), dMax, "Max does not change to boolean.");

		var dNewMin = new Date(dMin);
		dNewMin.setMonth(dNewMin.getMonth() - 2);
		var dNewMax = new Date(dMax);
		dNewMax.setMonth(dNewMax.getMonth() + 2);
		oDrsProperties.setMin(dNewMin);
		oDrsProperties.setMax(dNewMax);

		assert.deepEqual(oDrsProperties.getMin(), dNewMin, "Min changed to new min date.");
		assert.deepEqual(oDrsProperties.getMax(), dNewMax, "Max changed to new max date.");

		var dNewMaxBeforeMin = new Date(oDrsProperties.getMin());
		dNewMaxBeforeMin.setMonth(dNewMaxBeforeMin.getMonth() - 2);
		oDrsProperties.setMax(dNewMaxBeforeMin);
		assert.deepEqual(oDrsProperties.getMax(), dNewMax, "Max does not change to date before min date.");

		var dNewMinAfterMax = new Date(oDrsProperties.getMax());
		dNewMinAfterMax.setMonth(dNewMinAfterMax.getMonth() + 2);
		oDrsProperties.setMin(dNewMinAfterMax);
		assert.deepEqual(oDrsProperties.getMin(), dNewMin, "Min does not change to date after max date.");
	});

	QUnit.test("TestValueAndValue2", function(assert) {

		var dMin = oDrsProperties.getMin();
		var dMax = oDrsProperties.getMax();
		var dValue = oDrsProperties.getValue();
		var dValue2 = oDrsProperties.getValue2();

		assert.ok(dValue instanceof Date, "value is instance of date.");
		assert.ok(dValue2 instanceof Date, "value2 is instance of date.");

		oDrsProperties.setValue(null);
		oDrsProperties.setValue2(null);

		assert.deepEqual(oDrsProperties.getValue(), dValue, "value does not change to null.");
		assert.deepEqual(oDrsProperties.getValue2(), dValue2, "value2 does not change to null.");

		oDrsProperties.setValue(new Boolean(false));
		oDrsProperties.setValue2(new Boolean(false));

		assert.deepEqual(oDrsProperties.getValue(), dValue, "value does not change to boolean.");
		assert.deepEqual(oDrsProperties.getValue2(), dValue2, "value2 does not change to boolean.");

		var dNewValue = new Date(dValue);
		dNewValue.setDate(dNewValue.getDate() + 10);
		var dNewValue2 = new Date(dValue2);
		dNewValue2.setDate(dNewValue2.getDate() - 10);
		oDrsProperties.setValue(dNewValue);
		oDrsProperties.setValue2(dNewValue2);

		DateUtils.resetDateToEndOfDay(dNewValue2);
		assert.deepEqual(oDrsProperties.getValue(), dNewValue, "value changed to new value date.");
		assert.deepEqual(oDrsProperties.getValue2(), dNewValue2, "value2 changed to new value2 date.");

		var dNewValueBeforeMin = new Date(dMin);
		dNewValueBeforeMin.setDate(dNewValueBeforeMin.getDate() - 10);
		oDrsProperties.setValue(dNewValueBeforeMin);
		assert.notEqual(oDrsProperties.getValue().getTime(), dNewValueBeforeMin.getTime(), "value does not change to date before min date.");

		var dNewValue2AfterMax = new Date(dMax);
		dNewValue2AfterMax.setDate(dNewValue2AfterMax.getDate() + 10);
		oDrsProperties.setValue2(dNewValue2AfterMax);
		assert.notEqual(oDrsProperties.getValue2().getTime(), dNewValue2AfterMax.getTime(), "value2 does not change to date after max date.");
	});

	QUnit.test("TestVisible", function(assert) {

		assert.equal(oDrsProperties.getVisible(), true, "Visible property is set to true by default.");
		oDrsProperties.setVisible(false);
		oDrsProperties.rerender();
		assert.ok(!oDrsProperties.getVisible(), "DateRangeSlider is invisible");
		assert.equal(sDrsPropertiesId + "-dateRangeSliderInternal-grip" ? window.document.getElementById(sDrsPropertiesId + "-dateRangeSliderInternal-grip") : null, null, "DateRangeSlider left grip should not be rendered.");
		assert.equal(sDrsPropertiesId + "-dateRangeSliderInternal-bar" ? window.document.getElementById(sDrsPropertiesId + "-dateRangeSliderInternal-bar") : null, null, "DateRangeSlider bar should not be rendered.");
	});

	/******************************************************************/

	var sTxtBfr = null, sTxtAftEvt = "Event caught", iClicks = 0;
	var dMinDate = null, dMaxDate = null;
	function handleChangeEvt(oEvent) {

		sTxtBfr = sTxtAftEvt;
		dMinDate = oEvent.getParameter("value");
		dMaxDate = oEvent.getParameter("value2");
	}

	function handleLiveChangeEvt(oEvent) {

		iClicks++;
	}

	var sDrsEvtId = sDrsId + next();
	var oDrsEvt = new DateRangeSlider(sDrsEvtId);
	oDrsEvt.attachChange(handleChangeEvt);
	oDrsEvt.attachLiveChange(handleLiveChangeEvt);
	oDrsEvt.placeAt("qunit-fixture-3");

	QUnit.module("Change/Live Change event tests" + sModuleSuffix, {
		beforeEach : function() {

		},
		afterEach : function() {

			sTxtBfr = null;
			iClicks = 0;
			dMinDate = null;
			dMaxDate = null;
		}
	});

	QUnit.test("TestChangeEventOnLeftGrip", function(assert) {

		jQuery("#" + sDrsEvtId).focus();
		qutils.triggerMouseEvent(sDrsEvtId + "-dateRangeSliderInternal-grip", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-dateRangeSliderInternal-grip", "ARROW_RIGHT");
		assert.equal(sTxtBfr, sTxtAftEvt, "Change event should modify text after moving left grip");
		assert.ok(dMinDate instanceof Date, "Event should have min date as Date Object");
		assert.ok(dMaxDate instanceof Date, "Event should have max date as Date Object");
	});

	QUnit.test("TestChangeEventOnRightGrip", function(assert) {

		jQuery("#" + sDrsEvtId).focus();
		qutils.triggerMouseEvent(sDrsEvtId + "-dateRangeSliderInternal-grip2", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-dateRangeSliderInternal-grip2", "ARROW_LEFT");
		assert.equal(sTxtBfr, sTxtAftEvt, "Change event should modify text after moving right grip");
		assert.ok(dMinDate instanceof Date, "Event should have min date as Date Object");
		assert.ok(dMaxDate instanceof Date, "Event should have max date as Date Object");
	});

	QUnit.test("TestLiveChangeEventOnLeftGrip", function(assert) {

		jQuery("#" + sDrsEvtId).focus();
		qutils.triggerMouseEvent(sDrsEvtId + "-dateRangeSliderInternal-grip", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-dateRangeSliderInternal-grip", "ARROW_RIGHT");
		qutils.triggerKeyboardEvent(sDrsEvtId + "-dateRangeSliderInternal-grip", "ARROW_RIGHT");
		qutils.triggerKeyboardEvent(sDrsEvtId + "-dateRangeSliderInternal-grip", "ARROW_RIGHT");
		assert.equal(iClicks, 3, "3 Live Change events should increment var clicks 3 times after moving left grip");
	});

	QUnit.test("TestLiveChangeEventOnRightGrip", function(assert) {

		jQuery("#" + sDrsEvtId).focus();
		qutils.triggerMouseEvent(sDrsEvtId + "-dateRangeSliderInternal-grip2", "mousedown", 1, 1);
		qutils.triggerKeyboardEvent(sDrsEvtId + "-dateRangeSliderInternal-grip2", "ARROW_LEFT");
		qutils.triggerKeyboardEvent(sDrsEvtId + "-dateRangeSliderInternal-grip2", "ARROW_LEFT");
		assert.equal(iClicks, 2, "2 Live Change events should increment var clicks 2 times after moving left grip");
	});

	/******************************************************************/

	var sDrsExitId = sDrsId + next();
	var oDrsExit = new DateRangeSlider(sDrsExitId);
	oDrsExit.placeAt("qunit-fixture-4");

	QUnit.module("Exit function tests" + sModuleSuffix, {
		beforeEach : function() {

		},
		afterEach : function() {

		}
	});

	QUnit.test("TestExit", function(assert) {

		assert.ok(!(oDrsExit === null), "oDrsExit Object is not null");
		assert.ok(!(oDrsExit._oDateRangeSliderInternal === null), "oDrsExit's DateRangeSliderInternal Object is not null");
		oDrsExit.destroy();
		assert.ok(!(oDrsExit === null), "oDrsExit Object is not null after destroy");
		assert.ok(oDrsExit._oDateRangeSliderInternal === null, "oDrsExit's DateRangeSliderInternal Object is null after destroy");
	});

	/******************************************************************/

	var sDrsGranularityId = sDrsId + next();
	var oDrsGranularitySlider = new DateRangeSlider(sDrsGranularityId);
	oDrsGranularitySlider.placeAt("qunit-fixture-5");

	QUnit.module("DateRangeSlider Granularity Tests" + sModuleSuffix, {
		beforeEach : function() {

		},
		afterEach : function() {

		}
	});

	QUnit.test("TestMonthGranularity", function(assert) {

		//var dMinDate = oDrsGranularitySlider.getMin();
		//var dMaxDate = oDrsGranularitySlider.getMax();

		//set the min date and max date in the same month with 6 days apart

		var iCurrentYear = new Date().getFullYear();
		var dNewMinDate = new Date(iCurrentYear + 1, 0, 2, 0, 0, 0, 0);
		var dNewMaxDate = new Date(iCurrentYear + 1, 0, 7, 0, 0, 0, 0);
		oDrsGranularitySlider.setMax(dNewMaxDate);
		oDrsGranularitySlider.setMin(dNewMinDate);
		oDrsGranularitySlider.setValue(dNewMinDate);
		oDrsGranularitySlider.setValue2(dNewMaxDate);

		oDrsGranularitySlider.setMonthGranularity();

		DateUtils.resetDateToStartOfDay(dNewMinDate);
		DateUtils.resetDateToEndOfDay(dNewMaxDate);

		assert.deepEqual(oDrsGranularitySlider.getMin(), dNewMinDate, "TestMonthGranularity same month: min date not changed.");
		assert.deepEqual(oDrsGranularitySlider.getMax(), dNewMaxDate, "TestMonthGranularity same month: max date not changed.");
		assert.deepEqual(oDrsGranularitySlider.getValue(), dNewMinDate, "TestMonthGranularity same month: value date not changed.");
		assert.deepEqual(oDrsGranularitySlider.getValue2(), dNewMaxDate, "TestMonthGranularity same month: value2 date not changed.");

		//test for min and max are valid with one year apart
		dNewMinDate = new Date(iCurrentYear + 1, 0, 1, 0, 0, 0, 0);
		dNewMaxDate = new Date(iCurrentYear + 2, 0, 1, 0, 0, 0, 0);
		var dNewValue = new Date(iCurrentYear + 1, 5, 5, 0, 0, 0, 0);
		var dNewValue2 = new Date(iCurrentYear + 1, 7, 8, 0, 0, 0, 0);
		oDrsGranularitySlider.setMax(dNewMaxDate);
		oDrsGranularitySlider.setMin(dNewMinDate);
		oDrsGranularitySlider.setValue2(dNewValue2);
		oDrsGranularitySlider.setValue(dNewValue);

		oDrsGranularitySlider.setMonthGranularity();

		DateUtils.resetDateToStartOfMonth(dNewMinDate);
		DateUtils.resetDateToEndOfMonth(dNewMaxDate);
		DateUtils.resetDateToStartOfMonth(dNewValue);
		DateUtils.resetDateToEndOfMonth(dNewValue2);

		assert.deepEqual(oDrsGranularitySlider.getMin(), dNewMinDate, "TestMonthGranularity one year apart: min date changed.");
		assert.deepEqual(oDrsGranularitySlider.getMax(), dNewMaxDate, "TestMonthGranularity one year apart: max date changed.");
		assert.deepEqual(oDrsGranularitySlider.getValue(), dNewValue, "TestMonthGranularity one year apart: value changed.");
		assert.deepEqual(oDrsGranularitySlider.getValue2(), dNewValue2, "TestMonthGranularity one year apart: value2 changed.");

		//test the boundary value one month apart
		dNewMinDate = new Date(iCurrentYear + 1, 0, 1, 0, 0, 0, 0);
		dNewMaxDate = new Date(iCurrentYear + 1, 1, 1, 0, 0, 0, 0);
		dNewValue = new Date(iCurrentYear + 1, 0, 5, 0, 0, 0, 0);
		dNewValue2 = new Date(iCurrentYear + 1, 0, 8, 0, 0, 0, 0);
		oDrsGranularitySlider.setMax(dNewMaxDate);
		oDrsGranularitySlider.setMin(dNewMinDate);
		oDrsGranularitySlider.setValue2(dNewValue2);
		oDrsGranularitySlider.setValue(dNewValue);

		oDrsGranularitySlider.setMonthGranularity();

		var dExpectedMinDate = new Date(dNewMinDate);
		var dExpectedMaxDate = new Date(dNewMaxDate);

		DateUtils.resetDateToStartOfMonth(dExpectedMinDate);
		DateUtils.resetDateToEndOfMonth(dExpectedMaxDate);

		assert.deepEqual(oDrsGranularitySlider.getMin(), dExpectedMinDate, "TestMonthGranularity one month apart: min date changed.");
		assert.deepEqual(oDrsGranularitySlider.getMax(), dExpectedMaxDate, "TestMonthGranularity one month apart: max date changed.");
		//the value and value2 is less than one month apart input will be ignored
		assert.deepEqual(oDrsGranularitySlider.getValue(), dExpectedMinDate, "TestMonthGranularity one month apart: value changed.");
		assert.deepEqual(oDrsGranularitySlider.getValue2(), dExpectedMaxDate, "TestMonthGranularity one month apart: value2 changed.");

	});

	QUnit.test("TestDayGranularity", function(assert) {

		var dMinDate = oDrsGranularitySlider.getMin();
		var dMaxDate = oDrsGranularitySlider.getMax();
		var dValueDate = oDrsGranularitySlider.getValue();
		var dValue2Date = oDrsGranularitySlider.getValue2();

		//set the Granularity from month to day
		oDrsGranularitySlider.setDayGranularity();

		assert.deepEqual(oDrsGranularitySlider.getMin(), dMinDate, "TestDayGranularity: min date not changed.");
		assert.deepEqual(oDrsGranularitySlider.getMax(), dMaxDate, "TestDayGranularity: max date not changed.");
		assert.deepEqual(oDrsGranularitySlider.getValue(), dValueDate, "TestDayGranularity: value date not changed.");
		assert.deepEqual(oDrsGranularitySlider.getValue2(), dValue2Date, "TestDayGranularity: value2 date not changed.");

		//test the boundary value one day apart
		var dNewMinDate = new Date(2013, 0, 1, 0, 0, 0, 0);
		var dNewMaxDate = new Date(2013, 0, 2, 0, 0, 0, 0);
		var dNewValue = new Date(2013, 0, 1, 0, 0, 0, 0);
		var dNewValue2 = new Date(2013, 0, 2, 0, 0, 0, 0);
		oDrsGranularitySlider.setMin(dNewMinDate);
		oDrsGranularitySlider.setMax(dNewMaxDate);
		oDrsGranularitySlider.setValue2(dNewValue2);
		oDrsGranularitySlider.setValue(dNewValue);

		oDrsGranularitySlider.setDayGranularity();

		DateUtils.resetDateToStartOfDay(dNewMinDate);
		DateUtils.resetDateToEndOfDay(dNewMaxDate);
		DateUtils.resetDateToStartOfDay(dNewValue);
		DateUtils.resetDateToEndOfDay(dNewValue2);

		assert.deepEqual(oDrsGranularitySlider.getMin(), dNewMinDate, "TestDayGranularity: min date changed.");
		assert.deepEqual(oDrsGranularitySlider.getMax(), dNewMaxDate, "TestDayGranularity: max date changed.");
		assert.deepEqual(oDrsGranularitySlider.getValue(), dNewValue, "TestDayGranularity: value changed.");
		assert.deepEqual(oDrsGranularitySlider.getValue2(), dNewValue2, "TestDayGranularity: value2 changed.");

	});

	/*******************************************************************************************************************/
	var sDrsSetDateFormatId = sDrsId + next();
	var oDrsSetDateFormatSlider = new DateRangeSlider(sDrsSetDateFormatId);
	oDrsSetDateFormatSlider.placeAt("qunit-fixture-6");

	QUnit.module("Test setDateFormat API" + sModuleSuffix, {
		beforeEach : function() {
		}
	});

	QUnit.test("TestDateFormatIsNotSetInitially", function(assert) {

		assert.equal(oDrsSetDateFormatSlider._oDateRangeSliderInternal.getDateFormat(), null, "Date format of the control should not be set initially.");
	});

	QUnit.test("TestDateFormatIsSetCorrectly", function(assert) {

		var oLocale = new Locale("de");
		oDrsSetDateFormatSlider.setDateFormat(DateFormat.getDateInstance(oLocale));
		assert.notEqual(oDrsSetDateFormatSlider._oDateRangeSliderInternal.getDateFormat(), null, "Date format of the control should be set to supplied date format.");
		oDrsSetDateFormatSlider.setDateFormat(null);
		assert.equal(oDrsSetDateFormatSlider._oDateRangeSliderInternal.getDateFormat(), null, "Date format of the control should not be set if null is passed.");
		oDrsSetDateFormatSlider.setDateFormat(DateFormat.getDateInstance(oLocale));
		assert.notEqual(oDrsSetDateFormatSlider._oDateRangeSliderInternal.getDateFormat(), null, "Date format of the control should be set to supplied date format.");
		oDrsSetDateFormatSlider.setDateFormat(new Boolean(true));
		assert.equal(oDrsSetDateFormatSlider._oDateRangeSliderInternal.getDateFormat(), null, "Date format of the control should not be set if invalid obj is passed.");
	});

	QUnit.test("TestSetDateFormatLabelBubbleToolTipChanges", function(assert) {

		oDrsSetDateFormatSlider.setStepLabels(true);
		//test the value set to YYYY-MM-dd for the bubble and Tool Tip
		var dNewMinDate = new Date(2013, 0, 1 );
		var dNewMaxDate = new Date(2013, 11, 31 );
		var dNewValue = new Date(2013, 2, 10);
		var dNewValue2 = new Date(2013, 3, 10);
		oDrsSetDateFormatSlider.setMin(dNewMinDate);
		oDrsSetDateFormatSlider.setMax(dNewMaxDate);
		oDrsSetDateFormatSlider.setValue2(dNewValue2);
		oDrsSetDateFormatSlider.setValue(dNewValue);
		var aOldLabels = Object.assign({}, oDrsSetDateFormatSlider.getLabels());

		var oDateFormat = DateFormat.getDateInstance({
			pattern : "YYYY-MM-dd"
		});
		oDrsSetDateFormatSlider.setDateFormat(oDateFormat);
		var sExpectedValue = "2013-03-10";
		//var sExpectedValue2 = "2013-04-10";

		var oInternalSlider = oDrsSetDateFormatSlider._oDateRangeSliderInternal;

		assert.equal(oInternalSlider._oBubble.getText(), sExpectedValue, "_bubble text Date format changed to 2013-03-10.");
//		assert.equal(oInternalSlider._oBubble2.getText(), sExpectedValue2, "_bubble2 text Date format changed to 2013-04-10.");

		assert.equal(oInternalSlider.oGrip.title, sExpectedValue, "grip Tool Tip Date format changed to 2013-03-10.");
//		assert.equal(oInternalSlider.oGrip2.title, sExpectedValue2, "grip2 Tool Tip Date format changed to 2013-04-10.");

		var aLabels = oInternalSlider.getLabels();
		for (var i = 0; i < aLabels.length; i++){
			assert.notEqual(aOldLabels[i], aLabels[i], "Label at " + i + " Date format changed from " + aOldLabels[i] + " to " + aLabels[i]);
		}
	});

	/*******************************************************************************************************************/

	var sDrsPinGripGrip2Id = sDrsId + next();

	var oDrsPinGripGrip2Slider = new DateRangeSlider(sDrsPinGripGrip2Id);
	oDrsPinGripGrip2Slider.placeAt("qunit-fixture-7");

	QUnit.module("Test pinGrip/pinGrip2 Properties" + sModuleSuffix, {
		beforeEach : function() {

		},
		afterEach : function() {

		}
	});


	QUnit.test("TestPinGripAndPinGrip2AreFalseInitially", function(assert) {

		assert.equal(oDrsPinGripGrip2Slider.getPinGrip(), false, "PinGrip property of DateRangeSlider is set to false initially.");
		assert.equal(oDrsPinGripGrip2Slider.getPinGrip2(), false, "PinGrip2 property of DateRangeSlider is set to false initially.");
		assert.equal(oDrsPinGripGrip2Slider._oDateRangeSliderInternal.getPinGrip(), false, "PinGrip property of DateRangeSliderInternal is set to false initially.");
		assert.equal(oDrsPinGripGrip2Slider._oDateRangeSliderInternal.getPinGrip2(), false, "PinGrip2 property of DateRangeSliderInternal is set to false initially.");
	});

	QUnit.test("TestPinGripAndPinGrip2AreSettingCorrectly", function(assert) {

		oDrsPinGripGrip2Slider.setPinGrip(true);
		oDrsPinGripGrip2Slider.setPinGrip2(true);
		assert.equal(oDrsPinGripGrip2Slider.getPinGrip(), true, "PinGrip property is set to true.");
		assert.equal(oDrsPinGripGrip2Slider.getPinGrip2(), true, "PinGrip2 property is set to true.");
		assert.equal(oDrsPinGripGrip2Slider._oDateRangeSliderInternal.getPinGrip(), true, "PinGrip property of DateRangeSliderInternal is set to true.");
		assert.equal(oDrsPinGripGrip2Slider._oDateRangeSliderInternal.getPinGrip2(), true, "PinGrip2 property of DateRangeSliderInternal is set to true.");

		oDrsPinGripGrip2Slider.setPinGrip(false);
		oDrsPinGripGrip2Slider.setPinGrip2(false);
		assert.equal(oDrsPinGripGrip2Slider.getPinGrip(), false, "PinGrip property is set again to false.");
		assert.equal(oDrsPinGripGrip2Slider.getPinGrip2(), false, "PinGrip2 property is set again to false.");
		assert.equal(oDrsPinGripGrip2Slider._oDateRangeSliderInternal.getPinGrip(), false, "PinGrip property of DateRangeSliderInternal is set again to false.");
		assert.equal(oDrsPinGripGrip2Slider._oDateRangeSliderInternal.getPinGrip2(), false, "PinGrip2 property of DateRangeSliderInternal is set again to false.");
	});


	/*******************************************************************************************************************/
});
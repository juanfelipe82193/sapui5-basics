/* global QUnit, sinon */

// only test what is not tested in FieldBase

/*eslint max-nested-callbacks: [2, 6]*/

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/mdc/FilterField",
	"sap/ui/mdc/condition/FilterOperatorUtil",
	"sap/ui/mdc/util/BaseType"
	], function (
		jQuery,
		qutils,
		FilterField,
		FilterOperatorUtil,
		BaseType
		) {
	"use strict";

	var oFilterField;
	var sId;
	var sValue;
	var bValid;
	var aChangedConditions;
	var iCount = 0;

	var _myChangeHandler = function(oEvent) {
		iCount++;
		sId = oEvent.oSource.getId();
		sValue = oEvent.getParameter("value");
		bValid = oEvent.getParameter("valid");
		aChangedConditions = oEvent.getParameter("conditions");
	};

	var sLiveId;
	var sLiveValue;
	var iLiveCount = 0;

	var _myLiveChangeHandler = function(oEvent) {
		iLiveCount++;
		sLiveId = oEvent.oSource.getId();
		sLiveValue = oEvent.getParameter("value");
	};

	QUnit.module("FilterField rendering", {
		beforeEach: function() {
			oFilterField = new FilterField("FF1");
		},
		afterEach: function() {
			oFilterField.destroy();
			oFilterField = undefined;
		}
	});

	QUnit.test("default rendering", function(assert) {

		oFilterField.placeAt("content");
		sap.ui.getCore().applyChanges();

		var fnDone = assert.async();
		sap.ui.require(["sap/m/MultiInput"], function (MultiInput) {
			setTimeout(function () {
				var aContent = oFilterField.getAggregation("_content");
				var oContent = aContent && aContent.length > 0 && aContent[0];
				assert.ok(oContent, "default content exist");
				assert.equal(oContent && oContent.getMetadata().getName(), "sap.m.MultiInput", "sap.m.MultiInput is default");
				assert.notOk(oContent && oContent.getShowValueHelp(), "no valueHelp");
				fnDone();
			}, 0);
		});

	});

	QUnit.module("Eventing", {
		beforeEach: function() {
			oFilterField = new FilterField("FF1", {
				dataType: "sap.ui.model.type.Integer",
				dataTypeConstraints: {maximum: 100},
				change: _myChangeHandler,
				liveChange: _myLiveChangeHandler
			}).placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			oFilterField.destroy();
			oFilterField = undefined;
			iCount = 0;
			sId = null;
			sValue = null;
			bValid = null;
			aChangedConditions = null;
			iLiveCount = 0;
			sLiveId = null;
			sLiveValue = null;
		}
	});

	QUnit.test("with internal content", function(assert) {

		var fnDone = assert.async();
		sap.ui.require(["sap/m/Input"], function (Input) {
			setTimeout(function() {
				sap.ui.getCore().applyChanges();
				var aContent = oFilterField.getAggregation("_content");
				var oContent = aContent && aContent.length > 0 && aContent[0];
				oContent.focus();
				jQuery(oContent.getFocusDomRef()).val("10");
				qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
				assert.equal(iCount, 1, "change event fired once");
				assert.equal(sId, "FF1", "change event fired on Field");
				assert.equal(sValue, 10, "change event value");
				assert.ok(bValid, "change event valid");
				assert.equal(aChangedConditions.length, 1, "Conditions of the change event");
				assert.equal(aChangedConditions[0].values[0], 10, "condition value");
				assert.equal(aChangedConditions[0].operator, "EQ", "condition operator");
				var aConditions = oFilterField.getConditions();
				assert.equal(aConditions.length, 1, "one condition in Codition model");
				assert.equal(aConditions[0].values[0], 10, "condition value");
				assert.equal(aConditions[0].operator, "EQ", "condition operator");
				var aTokens = oContent.getTokens ? oContent.getTokens() : [];
				assert.equal(aTokens.length, 1, "MultiInput has one Token");
				var oToken = aTokens[0];
				assert.equal(oToken && oToken.getText(), "=10", "Text on token set");

				//simulate liveChange by calling from internal control
				oContent.fireLiveChange({value: "2"});
				assert.equal(iLiveCount, 1, "liveChange event fired once");
				assert.equal(sLiveId, "FF1", "liveChange event fired on Field");
				assert.equal(sLiveValue, "2", "liveChange event value");

				jQuery(oContent.getFocusDomRef()).val("1000");
				qutils.triggerKeyboardEvent(oContent.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
				assert.equal(iCount, 2, "change event fired again");
				assert.notOk(bValid, "Value is not valid");
				assert.equal(sValue, "1000", "change event wrongValue");
				fnDone();
			}, 0);
		});

	});

	QUnit.module("API", {
		beforeEach: function() {
			oFilterField = new FilterField("FF1");
		},
		afterEach: function() {
			oFilterField.destroy();
			oFilterField = undefined;
		}
	});

	QUnit.test("_getOperators", function(assert) {

		sinon.spy(FilterOperatorUtil, "getOperatorsForType");

		var fnDone = assert.async();
		oFilterField._oDelegatePromise.then(function() {
			var aOperators = oFilterField._getOperators();
			assert.ok(aOperators.length > 0, "Operators returned");
			assert.ok(FilterOperatorUtil.getOperatorsForType.calledWith(BaseType.String), "Default operators for string used");

			FilterOperatorUtil.getOperatorsForType.resetHistory();
			oFilterField.setOperators(["EEQ"]);
			aOperators = oFilterField._getOperators();
			assert.equal(aOperators.length, 1, "one Operator returned");
			assert.equal(aOperators[0], "EEQ", "right Operator returned");
			assert.notOk(FilterOperatorUtil.getOperatorsForType.called, "Default operators not used");

			fnDone();
			FilterOperatorUtil.getOperatorsForType.restore();
		});

	});

});
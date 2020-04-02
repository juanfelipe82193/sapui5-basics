/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/*global QUnit */
/*eslint no-warning-comments: 0 */

sap.ui.define([
		"sap/ui/mdc/condition/ConditionModel",
		"sap/ui/mdc/condition/Condition",
		"sap/ui/model/json/JSONModel",
		"sap/ui/mdc/FilterField",
		"sap/ui/mdc/field/FieldBaseDelegate" // make sure delegate is loaded
		], function(ConditionModel, Condition, JSONModel, FilterField, FieldBaseDelegate) {
	"use strict";

	var oConditionModel;
	var sPath;
	var sReason;
	var iCount = 0;
	function handlePropertyChange(oEvent) {
		sPath = oEvent.getParameter("path");
		sReason = oEvent.getParameter("reason");
		iCount++;
	}

	//*********************************************************************************************
	QUnit.module("sap.ui.mdc.condition.ConditionModel", {
		beforeEach: function() {
			oConditionModel = new ConditionModel();
		},

		afterEach: function() {
			sPath = undefined;
			sReason = undefined;
			iCount = 0;
			if (oConditionModel) {
				oConditionModel.destroy();
				oConditionModel = undefined;
			}
		}
	});


	//*********************************************************************************************
	QUnit.test("ConditionModel new/destroy", function(assert) {
		var sData = JSON.stringify(oConditionModel.getData());
		assert.ok(sData === '{"conditions":{},"fieldPath":{}}', "Default Data exist");
	});

		QUnit.test("ConditionModel.createCondition", function(assert) {
		var oCondition = oConditionModel.createCondition("fieldPath1", "EQ", ["foo"]);
		assert.ok(oCondition.operator === "EQ", "condition.operator must be 'EQ'");
		assert.ok(oCondition.values.length === 1, "condition.values.length must be 1");
		assert.ok(oCondition.values[0] === "foo", "condition.value[0] must be 'foo'");

		oCondition = oConditionModel.createCondition("fieldPath1", "GT", [100]);
		assert.ok(oCondition.operator === "GT", "condition.operator must be 'GT'");
		assert.ok(oCondition.values.length === 1, "condition.values.length must be 1");
		assert.ok(oCondition.values[0] === 100, "condition.value[0] must be 100");

		oCondition = oConditionModel.createItemCondition("fieldPath3", "key", "description");
		assert.ok(oCondition.operator === "EEQ", "condition.operator must be 'EEQ'");
		assert.ok(oCondition.values.length === 2, "condition.values.length must be 2");
		assert.ok(oCondition.values[0] === "key", "condition.value[0] must be 'key'");
		assert.ok(oCondition.values[1] === "description", "condition.value[1] must be 'description'");
	});

	QUnit.test("ConditionModel.add/removeConditions", function(assert) {
		oConditionModel.attachPropertyChange(handlePropertyChange);

		oConditionModel.addCondition("fieldPath1", oConditionModel.createCondition("fieldPath1", "EQ", ["foo"]));
		assert.equal(sPath, "/conditions/fieldPath1", "PropertyChange event fired");
		assert.equal(sReason, "add", "PropertyChange event reason");
		assert.equal(iCount, 1, "PropertyChange event fired once");
		sPath = undefined; sReason = undefined; iCount = 0;
		oConditionModel.addCondition("field/Path2", oConditionModel.createCondition("field/Path2", "BT", [1, 100]));
		assert.equal(sPath, "/conditions/field_Path2", "PropertyChange event fired");
		assert.equal(sReason, "add", "PropertyChange event reason");
		assert.equal(iCount, 1, "PropertyChange event fired once");
		sPath = undefined; sReason = undefined; iCount = 0;
		oConditionModel.addCondition("fieldPath3", oConditionModel.createCondition("fieldPath3", "GT", [new Date()]));
		assert.equal(sPath, "/conditions/fieldPath3", "PropertyChange event fired");
		assert.equal(sReason, "add", "PropertyChange event reason");
		assert.equal(iCount, 1, "PropertyChange event fired once");
		sPath = undefined; sReason = undefined; iCount = 0;

		assert.equal(oConditionModel.getConditions().length, 3, "all 3 conditions expected");

		assert.equal(oConditionModel.getConditions("fieldPath1").length, 1, "one condition expected");
		assert.equal(oConditionModel.getConditions("field/Path2").length, 1, "one condition expected");
		assert.equal(oConditionModel.getConditions("fieldPath3").length, 1, "one condition expected");

		oConditionModel.addCondition("fieldPath3", oConditionModel.createCondition("fieldPath3", "LT", ["xxx"]));
		assert.equal(oConditionModel.getConditions("fieldPath3").length, 2, "two conditions expected");

		oConditionModel.addCondition("fieldPath3", oConditionModel.createCondition("fieldPath3", "LT", ["xxx"]));
		assert.equal(oConditionModel.getConditions("fieldPath3").length, 2, "still 2 conditions expected, last addCondition ignored because the condition already exist");

		oConditionModel.addCondition("fieldPath3", oConditionModel.createCondition("fieldPath3", "LT", ["xxx"]), true);
		assert.equal(oConditionModel.getConditions("fieldPath3").length, 3, "now 3 conditions expected");

		sPath = undefined; sReason = undefined; iCount = 0;
		oConditionModel.removeCondition("fieldPath1", 0);
		assert.equal(oConditionModel.getConditions("fieldPath1").length, 0, "no conditions expected");
		assert.equal(sPath, "/conditions/fieldPath1", "PropertyChange event fired");
		assert.equal(sReason, "remove", "PropertyChange event reason");
		assert.equal(iCount, 1, "PropertyChange event fired once");
		sPath = undefined; sReason = undefined; iCount = 0;

		oConditionModel.removeCondition("field/Path2", 0);
		assert.equal(oConditionModel.getConditions("field/Path2").length, 0, "no conditions expected");
		assert.equal(sPath, "/conditions/field_Path2", "PropertyChange event fired");
		assert.equal(sReason, "remove", "PropertyChange event reason");
		assert.equal(iCount, 1, "PropertyChange event fired once");
		sPath = undefined; sReason = undefined; iCount = 0;

		oConditionModel.removeCondition("fieldPath3", 0);
		var oCondition = oConditionModel.getConditions("fieldPath3")[0];
		oConditionModel.removeCondition("fieldPath3", oCondition);
		assert.equal(oConditionModel.getConditions("fieldPath3").length, 1, "one condition expected");

		oConditionModel.removeCondition("fieldPath3", 0);
		assert.equal(oConditionModel.getConditions("fieldPath3").length, 0, "no condition expected");
	});

	QUnit.test("ConditionModel.indexOf/exist", function(assert) {
		var c1 = oConditionModel.createCondition("fieldPath1", "EQ", ["foo"]);
		oConditionModel.addCondition("fieldPath1", c1);
		var c2 = oConditionModel.createCondition("fieldPath1", "EQ", ["foo2"]);
		oConditionModel.addCondition("fieldPath1", c2);
		var c3 = oConditionModel.createCondition("fieldPath2", "BT", [1, 100]);
		oConditionModel.addCondition("fieldPath2", c3);
		var c4 = oConditionModel.createCondition("fieldPath2", "BT", [2, 99]);
		oConditionModel.addCondition("fieldPath2", c4);
		var c5 = oConditionModel.createCondition("fieldPath3", "GT", [new Date()]);
		oConditionModel.addCondition("fieldPath3", c5);
		var c6 = oConditionModel.createCondition("fieldPath3", "GT", [new Date(2018, 7, 24)]);
		oConditionModel.addCondition("fieldPath3", c6);

		assert.equal(oConditionModel.indexOf("fieldPath1", c1), 0, "condition found");
		assert.equal(oConditionModel.indexOf("fieldPath1", c2), 1, "condition found");
		assert.equal(oConditionModel.indexOf("fieldPath2", c3), 0, "condition found");
		assert.equal(oConditionModel.indexOf("fieldPath2", c4), 1, "condition found");
		assert.equal(oConditionModel.indexOf("fieldPath3", c5), 0, "condition found");
		assert.equal(oConditionModel.indexOf("fieldPath3", c6), 1, "condition found");
		assert.ok(oConditionModel.exist(c2, "fieldPath1"), "condition should exist");

		oConditionModel.removeCondition("fieldPath2", 0);
		assert.equal(oConditionModel.indexOf("fieldPath2", c3), -1, "condition should not exist");
		assert.notOk(oConditionModel.exist(c3, "fieldPath2"), "condition should not exist");
	});

	QUnit.test("ConditionModel.clone", function(assert) {

		var oFF1 = new FilterField("FF1", {conditions: "{cm>/conditions/fieldPath1}"});
		oConditionModel.addFilterField(oFF1);
		oConditionModel.addCondition("fieldPath1", oConditionModel.createCondition("fieldPath1", "EQ", ["foo"]));
		oConditionModel.addCondition("fieldPath2", oConditionModel.createCondition("fieldPath2", "BT", [1, 100]));
		oConditionModel.addCondition("fieldPath3", oConditionModel.createCondition("fieldPath3", "GT", [new Date()]));

		assert.ok(oConditionModel.getConditions().length === 3, "all 3 conditions expected");

		var oClone = oConditionModel.clone("fieldPath1");
		assert.equal(oClone.getConditions().length, 1, "only one condition expected");
		assert.equal(oClone.getConditions("fieldPath1").length, 1, "only one condition expected for FieldPath");

		oClone = oConditionModel.clone();
		assert.equal(oClone.getConditions().length, 3, "all 3 conditions expected");
		assert.equal(oClone.getConditions("fieldPath1").length, 1, "only one condition expected for FieldPath");

		oClone.destroy();
		oFF1.destroy();

	});

	QUnit.test("ConditionModel.merge", function(assert) {

		var oFF1 = new FilterField("FF1", {conditions: "{cm>/conditions/fieldPath1}"});
		oConditionModel.addFilterField(oFF1);
		oConditionModel.addCondition("fieldPath1", oConditionModel.createCondition("fieldPath1", "EQ", ["foo"]));
		oConditionModel.addCondition("fieldPath2", oConditionModel.createCondition("fieldPath2", "BT", [1, 100]));
		oConditionModel.addCondition("fieldPath3", oConditionModel.createCondition("fieldPath3", "GT", [new Date()]));

		var oConditionModel2 = new ConditionModel();
		oConditionModel2.addCondition("fieldPath1", oConditionModel.createCondition("fieldPath1", "EQ", ["new"]));
		oConditionModel2.addCondition("fieldPath1", oConditionModel.createCondition("fieldPath1", "BT", ["new2", "news2"]));
		oConditionModel2.addCondition("fieldPath2", oConditionModel.createCondition("fieldPath2", "EQ", ["new3"]));

		// Remove existing newFieldPath conditions and merge the condition with name fieldPath1
		oConditionModel.merge("fieldPath1", oConditionModel2, "fieldPath1");
		assert.equal(oConditionModel.getConditions().length, 4, "4 conditions expected");
		assert.equal(oConditionModel.getConditions("fieldPath1").length, 2, "2 conditions expected");

		// Remove existing FieldPath1 conditions and merge the new from oConditionModel2
		oConditionModel.merge("fieldPath1", oConditionModel2);
		assert.equal(oConditionModel.getConditions().length, 5, "5 conditions expected");
		assert.equal(oConditionModel.getConditions("fieldPath1").length, 2, "2 conditions expected");

		oConditionModel2.destroy();
		oFF1.destroy();

	});

	QUnit.test("ConditionModel.removeEmptyConditions", function(assert) {

		var oFF1 = new FilterField("FF1", {conditions: "{cm>/conditions/fieldPath1}"});
		oConditionModel.addFilterField(oFF1);
		oConditionModel.addCondition("fieldPath1", oConditionModel.createCondition("fieldPath1", "EQ", ["foo"]));
		oConditionModel.addCondition("fieldPath2", oConditionModel.createCondition("fieldPath2", "BT", []));
		oConditionModel.addCondition("fieldPath3", oConditionModel.createCondition("fieldPath3", "GT", []));

		var aConditions = Condition._removeEmptyConditions(oConditionModel.getConditions());
		assert.equal(aConditions.length, 1, "1 condition expected");
		oFF1.destroy();

	});

	QUnit.test("ConditionModel.getFilters", function(assert) {
		var oCM = new ConditionModel();

		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "EQ", ["foo"]));
		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "BT", [1, 100]));
		oCM.addCondition("fieldPath2/bar", oCM.createCondition("fieldPath2/bar", "EQ", ["bar"]));

		var aFilters = oCM.getFilters();
		assert.strictEqual(aFilters.aFilters.length, 2, "two filters must be returned on top level");

		oCM.removeAllConditions();

		oCM.addCondition("fieldPath1*/foo", oCM.createCondition("fieldPath1*/foo", "EQ", ["foo"]));
		oCM.addCondition("fieldPath1*/foo", oCM.createCondition("fieldPath1*/foo", "BT", [1, 100]));
		oCM.addCondition("fieldPath2/foo", oCM.createCondition("fieldPath2/bar", "EQ", ["bar"]));

		aFilters = oCM.getFilters();
		assert.strictEqual(aFilters.aFilters.length, 2, "two filters must be returned on top level");
		var oFilter = aFilters.aFilters[0];
		if (oFilter.sPath !== "fieldPath1") {
			oFilter = aFilters.aFilters[1]; // as order could be different
		}
		assert.strictEqual(oFilter.sOperator, "Any", "two filters must be returned on top level");

		oCM.removeAllConditions();

		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "BT", ["A", "Z"]));
		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "NE", ["X"]));

		aFilters = oCM.getFilters();

		assert.strictEqual(aFilters.aFilters.length, 2, "2 filters must be returned on top level");
		assert.ok(aFilters.bAnd, "exclude filters must be connected via AND");

		oCM.removeAllConditions();

		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "BT", ["A", "Z"]));
		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "NE", ["X"]));
		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "NE", ["Y"]));

		aFilters = oCM.getFilters();

		assert.strictEqual(aFilters.aFilters.length, 3, "3 filters must be returned on top level (multiple NE filters)");

		oCM.removeAllConditions();

		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "BT", ["A", "Z"]));
		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "NE", ["X"]));
		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "NE", ["Y"]));
		oCM.addCondition("fieldPath2/bar", oCM.createCondition("fieldPath2/bar", "EQ", ["FOO"]));
		oCM.addCondition("fieldPath2/bar", oCM.createCondition("fieldPath2/bar", "EQ", ["BAR"]));

		aFilters = oCM.getFilters();

		assert.strictEqual(aFilters.aFilters.length, 2, "2 filters must be returned on top level");
		assert.strictEqual(aFilters.aFilters[0].aFilters.length, 3, "3 filters must be returned at nested level");
		assert.ok(aFilters.aFilters[0].bAnd, "exclude filters must be connected via AND");

		oCM.removeAllConditions();

		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "EQ", ["FOO"]));
		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "EQ", ["BAR"]));
		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "NE", ["X"]));
		oCM.addCondition("fieldPath1/foo", oCM.createCondition("fieldPath1/foo", "NE", ["Y"]));

		aFilters = oCM.getFilters();

		assert.ok(aFilters.bAnd, "exclude filters must be connected via AND");
		assert.notOk(aFilters.aFilters[0].bAnd, "multiple non-exclude filters on same path are unaffected by AND grouping");

		oCM.destroy();
	});

	QUnit.test("ConditionModel.valueState", function(assert) {
		var oCM = new ConditionModel();
		oCM.addCondition("fieldPath1", oCM.createCondition("fieldPath1", "EQ", ["foo"]));
		oCM.addCondition("fieldPath2", oCM.createCondition("fieldPath2", "BT", [1, 100]));
		oCM.addCondition("fieldPath2", oCM.createCondition("fieldPath2", "BT", [200, 300]));

		var oFF1 = new FilterField("FF1", { conditions: "{cm>/conditions/fieldPath1}", required: true });
		var oFF2 = new FilterField("FF2", { conditions: "{cm>/conditions/fieldPath2}", maxConditions: 2 });
		oCM.addFilterField(oFF1);
		oCM.addFilterField(oFF2);

		var bValid = oCM._checkRequiredConditions();
		assert.ok(bValid, "_checkRequiredConditions must be true");

		// bValid = oCM._checkMaxConditions();
		// assert.ok(bValid, "_checkMaxConditions must be true");

		oCM.removeCondition("fieldPath1", 0);
		bValid = oCM._checkRequiredConditions();
		assert.ok(!bValid, "_checkRequiredConditions must be false");

		oCM.addCondition("fieldPath2", oCM.createCondition("fieldPath2", "BT", [400, 500]));
		bValid = oCM._checkMaxConditions();
		assert.ok(!bValid, "_checkMaxConditions must be false");

		oCM.removeFilterField(oFF1);
		oCM.removeFilterField(oFF2);

		var aFields = Object.keys(oCM._mFieldPath);
		assert.ok(aFields.length == 0, "all attached FitlerFields must be removed");

		oCM.destroy();
		oFF2.destroy();
		oFF1.destroy();

	});

	QUnit.test("ConditionModel.serialize/parse", function(assert) {

		var oCM = new ConditionModel();

		oCM.addCondition("fieldPath1", oCM.createCondition("fieldPath1", "EQ", ["foo"]));
		oCM.addCondition("fieldPath2", oCM.createCondition("fieldPath2", "BT", [1, 100]));
		oCM.addCondition("fieldPath3", oCM.createCondition("fieldPath3", "GT", [new Date(Date.UTC(2017, 3, 25, 10, 30, 0, 0))]));

		var s = oCM.serialize();
		assert.strictEqual(s, '{\"conditions\":{\"fieldPath1\":[{\"operator\":\"EQ\",\"values\":[\"foo\"]}],\"fieldPath2\":[{\"operator\":\"BT\",\"values\":[1,100]}],\"fieldPath3\":[{\"operator\":\"GT\",\"values\":[\"2017-04-25T10:30:00.000Z\"]}]}}', "serialize returns the expected value");

		oCM.parse('{"conditions":{"fieldPath1":[{"operator":"EQ","values":["foo"]}],"fieldPath2":[{"operator":"BT","values":[1,100]}],"fieldPath3":[{"operator":"GT","values":["2017-04-25T10:30:00.000Z"]}]}}');
		assert.strictEqual(oCM.getConditions().length, 3, "after parse only 3 condition should exist");
		assert.strictEqual(oCM.getConditions()[0].values[0], "foo", "value of first condition is foo");
		assert.strictEqual(oCM.getConditions()[1].values[0], 1, "first value of second condition is 1");

		oCM.destroy();
	});

	QUnit.test("ConditionModel.filterField", function(assert) {

		var oFF1 = new FilterField("FF1", { conditions: "{cm>/conditions/fieldPath1}" });
		oConditionModel.addFilterField(oFF1);
		var oFF2 = new FilterField("FF2", { conditions: "{cm>/conditions/fieldPath2}" });
		oConditionModel.addFilterField(oFF2);

		oConditionModel.addCondition("fieldPath1", oConditionModel.createCondition("fieldPath1", "EQ", ["foo"]));
		oConditionModel.addCondition("fieldPath2", oConditionModel.createCondition("fieldPath2", "BT", [1, 100]));
		oConditionModel.addCondition("fieldPath3", oConditionModel.createCondition("fieldPath3", "GT", [new Date()]));

		assert.strictEqual(oConditionModel.getFilterField("does not exist"), undefined, "getFilterField should return undefined");
		assert.equal(oConditionModel.getFilterField("fieldPath1"), oFF1, "getFilterField should return expected filterField instance");
		assert.strictEqual(oConditionModel.getFilterFields().length, 2, "getFilterField should return 2 fields");

		oConditionModel.removeFilterField(oFF2);
		assert.strictEqual(oConditionModel.getFilterFields().length, 1, "getFilterField should return 1 field");

		oFF1.destroy();
		oFF2.destroy();

	});

	QUnit.test("ConditionModel.fieldMessages", function(assert) {

		var oFF1 = new FilterField("FF1", { conditions: "{cm>/conditions/fieldPath1}" });
		oConditionModel.addFilterField(oFF1);

		oConditionModel.addFieldPathMessage("fieldPath1", "my Message1");
		oConditionModel.addFieldPathMessage("fieldPath1", "my Message2");

		var oFieldPath = oConditionModel._getFieldPathProperty("fieldPath1");
		assert.strictEqual(oFieldPath.messages.length, 2, "conditionModel should contain 2 messages");

		oConditionModel.removeFieldPathMessage("fieldPath1", "my Message1");
		oConditionModel.removeFieldPathMessage("fieldPath1", "my Message2");
		assert.strictEqual(oFieldPath.messages.length, 0, "conditionModel should not contain messages");

		oFF1.destroy();

	});

	QUnit.test("ConditionModel.UIMessages", function(assert) {

		var oFF1 = new FilterField("FF1", { conditions: "{cm>/conditions/fieldPath1}" });
		oConditionModel.addFilterField(oFF1);

		oConditionModel.setUIMessage("fieldPath1", "my UIMessage");

		var oFieldPath = oConditionModel._getFieldPathProperty("fieldPath1");
		assert.strictEqual(oFieldPath.uiMessage, "my UIMessage", "conditionModel should have the expected UIMessage");

		oConditionModel.removeUIMessage("fieldPath1");
		assert.strictEqual(oFieldPath.uiMessage, undefined, "conditionModel should not contain UIMessages");

		oFF1.destroy();

	});

	var oConditionChangeBinding;
	var oConditionChangeBinding1;
	var oConditionChangeBinding2;
	var oConditionChangeBinding3;
	var oConditionChangeBinding4;
	var oConditionChange = {};
	function handleChange(oEvent) {
		if (!oConditionChange[oEvent.oSource.sPath]) {
			oConditionChange[oEvent.oSource.sPath] = {reason: "", count: 0};
		}
		oConditionChange[oEvent.oSource.sPath].reason = oEvent.getParameter("reason");
		oConditionChange[oEvent.oSource.sPath].count++;
	}

	QUnit.module("ConditionPropertyBinding", {
		beforeEach: function() {
			oConditionModel = new ConditionModel();
			oConditionModel.addCondition("fieldPath1", oConditionModel.createCondition("fieldPath1", "EEQ", ["key", "description"]));
			oConditionModel.addCondition("field/Path2", oConditionModel.createCondition("field/Path2", "EEQ", ["key1", "description1"]));
			oConditionChangeBinding = oConditionModel.bindProperty("/conditions", oConditionModel.getContext("/conditions"));
			oConditionChangeBinding.attachChange(handleChange);
			oConditionChangeBinding1 = oConditionModel.bindProperty("/conditions/fieldPath1", oConditionModel.getContext("/conditions/fieldPath1"));
			oConditionChangeBinding1.attachChange(handleChange);
			oConditionChangeBinding2 = oConditionModel.bindProperty("/conditions/fieldPath1", oConditionModel.getContext("/conditions/fieldPath1"));
			oConditionChangeBinding2.attachChange(handleChange);
			oConditionChangeBinding3 = oConditionModel.bindProperty("/conditions/field/Path2", oConditionModel.getContext("/conditions/field/Path2"));
			oConditionChangeBinding3.attachChange(handleChange);
			oConditionChangeBinding4 = oConditionModel.bindProperty("/conditions/field/Path2", oConditionModel.getContext("/conditions/field/Path2"));
			oConditionChangeBinding4.attachChange(handleChange);
		},

		afterEach: function() {
			sPath = undefined;
			sReason = undefined;
			iCount = 0;
			oConditionChange = {};
			if (oConditionModel) {
				oConditionModel.destroy();
				oConditionModel = undefined;
			}
		}
	});

	QUnit.test("ConditionModel Change event for new condition", function(assert) {
		var fnDone = assert.async();
		setTimeout(function () {
			oConditionChange = {};
			var aConditions = oConditionChangeBinding1.getExternalValue();
			aConditions.push(Condition.createItemCondition("X", "Y"));
			oConditionChangeBinding1.setExternalValue(aConditions);
			setTimeout(function () {
				assert.equal(oConditionChange["/conditions"] && oConditionChange["/conditions"].count, 1, "Change event for all conditions fired");
				assert.equal(oConditionChange["/conditions/fieldPath1"] && oConditionChange["/conditions/fieldPath1"].count, 1, "Change event for fieldPath1 fired once");
				assert.notOk(oConditionChange["/conditions/field_Path2"], "Change event for fieldPath2 not fired");

				oConditionChange = {};
				aConditions = oConditionChangeBinding3.getExternalValue();
				aConditions.push(Condition.createItemCondition("X", "Y"));
				oConditionChangeBinding3.setExternalValue(aConditions);
				setTimeout(function () {
					assert.equal(oConditionChange["/conditions"] && oConditionChange["/conditions"].count, 1, "Change event for all conditions fired");
					assert.notOk(oConditionChange["/conditions/fieldPath1"], "Change event for fieldPath1 not fired");
					assert.equal(oConditionChange["/conditions/field_Path2"] && oConditionChange["/conditions/field_Path2"].count, 1, "Change event for fieldPath2 fired once");
					fnDone();
				}, 0);
			}, 0);
		}, 0);
	});

	QUnit.test("ConditionModel Change event for changed condition", function(assert) {
		var fnDone = assert.async();
		setTimeout(function () {
			oConditionChange = {};
			var aConditions = oConditionChangeBinding1.getExternalValue();
			aConditions[0].values[0] = "A";
			oConditionChangeBinding1.setExternalValue(aConditions);
			setTimeout(function () {
				assert.equal(oConditionChange["/conditions"] && oConditionChange["/conditions"].count, 1, "Change event for all conditions fired");
				assert.equal(oConditionChange["/conditions/fieldPath1"] && oConditionChange["/conditions/fieldPath1"].count, 1, "Change event for fieldPath1 fired once");
				assert.notOk(oConditionChange["/conditions/fieldPath2"], "Change event for fieldPath2 not fired");
				fnDone();
			}, 0);
		}, 0);
	});

});

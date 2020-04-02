/*global QUnit */
sap.ui.define([
	"sap/gantt/misc/Utility",
	"sap/ui/model/Context",
	"sap/ui/model/Model",
	"sap/gantt/config/ObjectType"
], function (Utility, Context, Model) {
	"use strict";
	QUnit.module("Test sap.gantt.misc.Utility generateRowUid method", {
		beforeEach: function () {
			var config = sap.ui.getCore().getConfiguration();
			this.originalLanguage = config.getLanguage();
			config.setLanguage("en");
		},
		afterEach: function () {
			var config = sap.ui.getCore().getConfiguration();
			config.setLanguage(this.originalLanguage);
			this.originalLanguage = undefined;
		}
	});

	QUnit.test("test UID generation for row object", function (assert) {
		var rowDataArray = [{
			id: "0000",
			index: 0,
			rowSpan: 1,
			chartScheme: "ac_main",
			contextObj: new Context({ sPath: "/data/view/0/root/0" }),
			data: {
				id: "0000",
				plate: "Test001",
				selected: false,
				subType: "01",
				type: "01",
				uuid: "01_0"
			}
		}];
		rowDataArray[0].contextObj.sPath = "/data/view/0/root/0";

		var shapeDataArray = [{
			id: "0000",
			index: 0,
			rowSpan: 1,
			chartScheme: "ac_main",
			contextObj: new Context({ sPath: "/data/view/0/root/0" }),
			data: {
				id: "0000",
				plate: "Test001",
				selected: false,
				subType: "01",
				type: "01",
				uuid: "01_0",
				activity: [{
					endTime: "20140921000000",
					id: 1,
					startTime: "20140919000000",
					status: 2,
					tooltip: "Activity - First",
					type: 1
				}]
			}
		}];
		shapeDataArray[0].contextObj.sPath = "/data/view/0/root/0";

		var oObjectTypesMap = {
			"01": new sap.gantt.config.ObjectType({
				key: "01",
				description: "Truck",
				expandedChartSchemeKeys: [
					{ 0: "ulc_main" },
					{ 1: "ac_expand_overlap" }
				],
				mainChartSchemeKey: "ac_main"
			}),
			"02": new sap.gantt.config.ObjectType({
				key: "02",
				description: "Trailer",
				expandedChartSchemeKeys: [
					{ 0: "ulc_main" },
					{ 1: "ac_expand_overlap" }
				],
				mainChartSchemeKey: "ac_main"
			}),
			"04": new sap.gantt.config.ObjectType({
				description: "Driver",
				expandedChartSchemeKeys: [{
					0: "ac_expand_overlap"
				}],
				mainChartSchemeKey: "ac_main"
			}),
			"TOL": new sap.gantt.config.ObjectType({
				description: "Freight Order",
				expandedChartSchemeKeys: [
					{ 0: "ulc_main" },
					{ 1: "ac_expand_overlap" }
				],
				mainChartSchemeKey: "ac_main"
			}),
			"05": new sap.gantt.config.ObjectType({
				description: "Handling Resource",
				mainChartSchemeKey: "bc_hr"
			})
		};

		var aShapeDataNames = ["activity", "order", "bc", "ulc", "relationship", "phase", "task"];
		//case1: generate uid for row object
		Utility.generateRowUid(rowDataArray, oObjectTypesMap, aShapeDataNames);
		assert.strictEqual(rowDataArray[0].uid,
			"PATH:0000|SCHEME:ac_main[0]",
			"The generated row uid from method generateRowUid is equal with the expected row uid...");
		Utility.generateRowUid(shapeDataArray, oObjectTypesMap, aShapeDataNames);
		assert.strictEqual(shapeDataArray[0].data.activity[0].uid,
			"PATH:0000|SCHEME:ac_main[0]|DATA:activity[1]",
			"The generated shape uid from method generateRowUid is equal with the expected shape uid...");

		//case6: test assignDeep
		var oObj = Utility.assignDeep({ "a": "a" }, { "b": "b" });
		assert.strictEqual(oObj.a + oObj.b,
			"ab",
			"Test assignDeep function");
	});

	QUnit.test("getIdByUid test", function (assert) {
		var sId = "PATH:0000|SCHEME:ac_main[0]|DATA:activity[id-1479280129520-31]";
		var expected = "id-1479280129520-31";
		var result = Utility.getIdByUid(sId);
		assert.strictEqual(result, expected, "shape id is correct retrieve from shape UID");

		sId = "";
		result = Utility.getIdByUid(sId);
		assert.strictEqual(result, undefined, "shape id is undefined if empty");

		sId = "abcdefg";
		result = Utility.getIdByUid(sId);
		assert.strictEqual(result, undefined, "shape id is undefined if not matched");

		sId = "PATH:12345|SCHEME:ac_main[0]";
		expected = "12345";
		result = Utility.getIdByUid(sId, true/**bRow*/);
		assert.strictEqual(result, expected, "row id is correct retrieve from row UID");

		sId = "PATH:12345|abcde|SCHEME:ac_main[0]";
		expected = "abcde";
		result = Utility.getIdByUid(sId, true/**bRow*/);
		assert.strictEqual(result, expected, "row id is correct with parent/child id");

		sId = "PATH:347f3c0a41|SCHEME:ac_main[abcd]";
		result = Utility.getIdByUid(sId);
		assert.strictEqual(result, undefined, "row id is 347f3c0a41");
	});

	QUnit.test("getShapeDataNameByUid test", function (assert) {
		var sId = "PATH:0000|SCHEME:ac_main[0]|DATA:activity[id-1479280129520-31]";

		var result = Utility.getShapeDataNameByUid(sId);
		assert.strictEqual(result, "activity", "shape data name is activity");

		result = Utility.getShapeDataNameByUid();
		assert.strictEqual(result, undefined, "shape data name is undefined");

		sId = "";
		result = Utility.getShapeDataNameByUid(sId);
		assert.strictEqual(result, undefined, "shape data name is undefined");

		sId = null;
		result = Utility.getShapeDataNameByUid(sId);
		assert.strictEqual(result, undefined, "shape data name is undefined");

		sId = "PATH:12345|SCHEME:ac_main[0]";
		result = Utility.getShapeDataNameByUid(sId);
		assert.strictEqual(result, undefined, "shape data name is ac_main");

		sId = "PATH:0001|SCHEME:ac_main[0]|DATA:order[order2]";
		result = Utility.getShapeDataNameByUid(sId);
		assert.strictEqual(result, "order", "shape data name is order");

		sId = "PATH:0048|SCHEME:ac_main[0]|DATA:phase[id-1479290101128-613]";
		result = Utility.getShapeDataNameByUid(sId);
		assert.strictEqual(result, "phase", "shape data name is phase");

	});

	QUnit.test("getChartSchemeByShapeUid test", function (assert) {
		var sId = "PATH:0000|SCHEME:ac_main[0]|DATA:activity[id-1479280129520-31]";

		var result = Utility.getChartSchemeByShapeUid(sId);
		assert.strictEqual(result, "ac_main", "chart scheme is ac_main");

		sId = "PATH:0001|SCHEME:ac_main[0]|DATA:activity[9]";
		result = Utility.getChartSchemeByShapeUid(sId);
		assert.strictEqual(result, "ac_main", "chart scheme is ac_main");

		result = Utility.getChartSchemeByShapeUid();
		assert.strictEqual(result, "", "chart scheme is empty string if input is undefined");

		sId = "";
		result = Utility.getChartSchemeByShapeUid(sId);
		assert.strictEqual(result, "", "chart scheme is empty string if input is empty");

		sId = null;
		result = Utility.getChartSchemeByShapeUid(sId);
		assert.strictEqual(result, "", "chart scheme is empty string if input is null");

		sId = "PATH:12345|SCHEME:ac_main[0]";
		result = Utility.getChartSchemeByShapeUid(sId);
		assert.strictEqual(result, "ac_main", "chart scheme is ac_main");

		sId = "PATH:0001|SCHEME:ac_main[0]|DATA:order[order2]";
		result = Utility.getChartSchemeByShapeUid(sId);
		assert.strictEqual(result, "ac_main", "chart scheme is order");

		sId = "PATH:0000|SCHEME:[-1]";
		result = Utility.getChartSchemeByShapeUid(sId);
		assert.strictEqual(result, "", "chartScheme is empty");

		sId = "PATH:0000|SCHEME:ac_main[-1]";
		result = Utility.getChartSchemeByShapeUid(sId);
		assert.strictEqual(result, "ac_main", "chartScheme is ac_main");
	});

	QUnit.test("parse UID for relationship", function (assert) {
		var sId = "PATH:DUMMY|SCHEME:DUMMY[0]|DATA:relationship[rls007]";
		var result = Utility.parseUid(sId);
		assert.strictEqual(result.rowId, "DUMMY", "row id is DUMMY");
		assert.strictEqual(result.rowPath, "DUMMY", "row path is DUMMY as well");
		assert.strictEqual(result.chartScheme, "DUMMY", "chart scheme is DUMMY");
		assert.strictEqual(result.shapeDataName, "relationship", "shape data name is relationship");
		assert.strictEqual(result.shapeId, "rls007", "shapeId is rls007");

		sId = "PATH:12345|abcde|SCHEME:ac_main[0]";
		result = Utility.parseUid(sId);
		assert.strictEqual(result.rowPath, "12345|abcde", "row path is correct parsed");
		assert.strictEqual(result.rowId, "abcde", "shapeId is not order1");
		assert.strictEqual(result.rowUid, "PATH:12345|abcde|SCHEME:ac_main[0]", "row uid is correct");
		assert.strictEqual(result.shapeId, undefined, "shapeId is not defined");

		sId = "PATH:12345|abcde|xyz|SCHEME:ac_main[0]|DATA:order[order1]";
		result = Utility.parseUid(sId);
		assert.strictEqual(result.rowPath, "12345|abcde|xyz", "row path is correct parsed with multi levels");
		assert.strictEqual(result.rowId, "xyz", "row id is xyz");
		assert.strictEqual(result.rowUid, "PATH:12345|abcde|xyz|SCHEME:ac_main[0]", "row uid is correct");
		assert.strictEqual(result.shapeId, "order1", "shapeId is order1");
	});

	QUnit.module("Test sap.gantt.misc.Utility generateObjectPathToObjectMap method", {
		beforeEach: function () {
			this.dataSet = [
				{
					objectInfoRef: {
						chartScheme: "ac_main",
						id: "0000",
						uid: "PATH:0000|SCHEME:ac_main[0]"
					}
				},
				{
					objectInfoRef: {
						chartScheme: "ac_expand_overlap",
						id: "0000",
						uid: "PATH:0000|SCHEME:ac_expand_overlap[1]"
					}
				},
				{
					objectInfoRef: {
						chartScheme: "ac_expand_overlap",
						id: "0000",
						uid: "PATH:0000|SCHEME:ac_expand_overlap[2]"
					}
				}
			];
		}
	});

	QUnit.test("generateObjectPathToObjectMap", function (assert) {
		var map = {};
		Utility.generateObjectPathToObjectMap(this.dataSet, map, null);
		assert.strictEqual(map["0000-0"], this.dataSet[0].objectInfoRef, 'map["0000-0"] conforms with expected object');
		assert.strictEqual(map["0000-1"], this.dataSet[1].objectInfoRef, 'map["0000-1"] conforms with expected object');
		assert.strictEqual(map["0000-2"], this.dataSet[2].objectInfoRef, 'map["0000-2"] conforms with expected object');
	});

	QUnit.module("Test sap.gantt.misc.Utility safeCall method");

	QUnit.test("Starting object can be undefined", function (assert) {
		var sExpected = "defaultValue";
		var result = Utility.safeCall(undefined, ["fn"], sExpected);
		assert.strictEqual(result, sExpected, "safeCall should return defaultValue");
	});

	QUnit.test("Non-existing function in the chain", function (assert) {
		var sExpected = "defaultValue";
		var oObjects = {
			firstFunction: function () {
				return {};
			}
		};
		var result = Utility.safeCall(oObjects, ["firstFunction", "secondFunction"], sExpected);
		assert.strictEqual(result, sExpected, "safeCall should return defaultValue");
	});

	QUnit.test("Existing chain returns last call", function (assert) {
		var sExpected = "correctValue";
		var oObjects = {
			firstFunction: function () {
				return {
					secondFunction: function () {
						return sExpected;
					}
				};
			}
		};
		var result = Utility.safeCall(oObjects, ["firstFunction", "secondFunction"], "defaultValue");
		assert.strictEqual(result, sExpected, "safeCall should return last function call");
	});

	QUnit.test("Last call gets arguments", function (assert) {
		var aArgs = ["first", "second"];
		var oObjects = {
			fn: function (sFirst, sSecond) {
				assert.strictEqual(sFirst, aArgs[0], "First argument should have been passed");
				assert.strictEqual(sSecond, aArgs[1], "Second argument should have been passed");
			}
		};
		Utility.safeCall(oObjects, ["fn"], "defaultValue", aArgs);
	});
});

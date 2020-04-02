/*global QUnit,sinon*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiinput.WithoutBindingContext", [
	"sap/ui/comp/smartmultiinput/SmartMultiInput",
	"test-resources/sap/ui/comp/qunit/smartmultiinput/TestUtils",
	"sap/m/Token",
	"sap/ui/model/Filter",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (SmartMultiInput, TestUtils, Token, Filter, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("without binding context", {
		before: function () {
			this.oMockServer = TestUtils.createMockServer();
		},
		after: function () {
			this.oMockServer.destroy();
		},
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			TestUtils.createDataModel().then(function (oModel) {
				that.oModel = oModel;

				that.oSmartMultiInput = new SmartMultiInput({
					entitySet: "Categories",
					value: {
						path: "CategoryId"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);

				that.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();

				that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
					fnDone();
				});

			});
		},

		afterEach: function () {
			this.oModel.destroy();
			this.oSmartMultiInput.destroy();
		}
	});

	TestUtils.initCommonTests();

	QUnit.test("multi input is rendered correctly", function (assert) {
		var aTokens = this.oSmartMultiInput.getTokens();
		assert.equal(aTokens.length, 0, "number of tokens");

		assert.ok(this.oSmartMultiInput._oMultiInput.getShowValueHelp(), "value help button shown");
	});

	QUnit.test("_getNavigationPath", function (assert) {
		assert.equal(this.oSmartMultiInput._getNavigationPath(), "");
	});

	QUnit.test("non editable mode", function (assert) {
		var that = this,
			fnDone = assert.async(),
			sText = "test";

		this.oSmartMultiInput._oMultiInput.addToken(
			new Token({
				key: sText,
				text: sText
			})
		);
		sinon.spy(this.oSmartMultiInput._oFactory, "_createTokenizer");
		sinon.spy(this.oSmartMultiInput, "_initTokenizerCollapseMode");

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function (oEvent) {
			assert.ok(that.oSmartMultiInput._oFactory._createTokenizer.calledOnce, "_createTokenizer should be called once");
			assert.ok(that.oSmartMultiInput._oTokenizer, "tokenizer exists");
			assert.notOk(that.oSmartMultiInput._oTokenizer.getEditable(), "tokenizer is not editable");
			assert.ok(that.oSmartMultiInput._initTokenizerCollapseMode.calledOnce, "_initTokenizerCollapseMode was called once");

			// wait for tokenizer to render its items
			setTimeout(function () {
				assert.equal(that.oSmartMultiInput._oTokenizer.getTokens().length, 1, "tokenizer has correct number of tokens");
				assert.equal(that.oSmartMultiInput._oTokenizer.getTokens()[0].getText(), sText, "correct text");
				assert.equal(that.oSmartMultiInput._oTokenizer.getTokens()[0].getKey(), sText, "correct key");
				assert.notOk(that.oSmartMultiInput._oTokenizer.getBinding("tokens"), "tokenizer is not bound");
			}, 0);

			fnDone();
		});

		this.oSmartMultiInput.setEditable(false);
	});

	QUnit.test("token update", function (assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput.attachTokenUpdate(function () {
			assert.ok(true, "smartMultiInput tokenUpdate called on inner multiInput token update");
			fnDone();
		});

		this.oSmartMultiInput._oMultiInput.fireTokenUpdate({});
	});

	QUnit.test("getFilter", function (assert) {
		var sValue = "value";
		var oToken = new Token({text: sValue, key: sValue});
		var aTestFilters = [
			new Filter("CategoryId", "EQ", sValue)
		];
		var oTestFilter = new Filter(aTestFilters, false);


		this.oSmartMultiInput._oMultiInput.addToken(oToken);

		var oFilter = this.oSmartMultiInput.getFilter();

		assert.deepEqual(oFilter, oTestFilter, "correct filters should be returned");
	});

	QUnit.test("getRangeData", function(assert) {
		var sValue = "value";
		var mTestRangeData = {
			exclude: true, operation: "BT", value1: sValue, value2: "", keyField: "CategoryId"
		};
		var oToken = new Token({text: sValue, key: sValue});
		oToken.data("range", mTestRangeData);

		this.oSmartMultiInput._oMultiInput.addToken(oToken);

		var aRangeData = this.oSmartMultiInput.getRangeData();
		assert.ok(aRangeData.length === 1, "range data should have one value");
		assert.deepEqual(aRangeData[0], mTestRangeData, "correct range data should be returned");
	});

	QUnit.test("setRangeData", function(assert) {
		var aTexts = [
			"Value1",
			"Value2"
		];
		var mTestRangeData = {
			exclude: false, operation: "EQ", value1: aTexts[0], value2: "", keyField: "CategoryId"
		};
		var mTestRangeDataMultiple = [
			{exclude: false, operation: "EQ", value1: aTexts[0], value2: "", keyField: "CategoryId"},
			{exclude: false, operation: "EQ", value1: aTexts[1], value2: "", keyField: "CategoryId"}
		];
		// one value
		this.oSmartMultiInput.setRangeData(mTestRangeData);

		var aTokens = this.oSmartMultiInput.getTokens();
		assert.ok(aTokens.length === 1, "one token present in SmartMultiInput");
		assert.equal(aTokens[0].getText(), "=" + aTexts[0], "correct text on the token should be set");

		// multiple values
		this.oSmartMultiInput.setRangeData(mTestRangeDataMultiple);

		aTokens = this.oSmartMultiInput.getTokens();
		assert.ok(aTokens.length === 2, "multiple tokens present in SmartMultiInput");
		for (var i = 0; i < aTexts.length; i++) {
			assert.equal(aTokens[i].getText(), "=" + aTexts[i], "correct text on the token should be set");
		}
	});

	QUnit.module("without binding context 2", {
		before: function () {
			this.oMockServer = TestUtils.createMockServer();
		},
		after: function () {
			this.oMockServer.destroy();
		},
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			TestUtils.createDataModel().then(function (oModel) {
				that.oModel = oModel;

			fnDone();

			});
		},

		afterEach: function () {
			this.oModel.destroy();
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("supportRanges with value list annotion as well", function(assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput = new SmartMultiInput({
			entitySet: "Categories",
			value: {
				path: "CategoryId"
			},
			supportRanges: true
		});

		var oSpy = sinon.spy(this.oSmartMultiInput, "_createMultiInput");

		this.oSmartMultiInput.setModel(this.oModel);

		this.oSmartMultiInput.placeAt("content");
		sap.ui.getCore().applyChanges();

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
			assert.ok(oSpy.returnValues[0].params.valuehelp.supportRanges, "supportRanges in value help should be set");
			fnDone();
		});
	});

	QUnit.test("supportMultiSelect true", function(assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput = new SmartMultiInput({
			entitySet: "Categories",
			value: {
				path: "CategoryId"
			},
			supportMultiSelect: true
		});

		var oSpy = sinon.spy(this.oSmartMultiInput, "_createMultiInput");

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
			assert.ok(oSpy.returnValues[0].params.valuehelp.supportMultiSelect, "supportMultiSelect in value help should be set");
			fnDone();
		});

		this.oSmartMultiInput.setModel(this.oModel);

		this.oSmartMultiInput.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("supportMultiSelect false", function(assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput = new SmartMultiInput({
			entitySet: "Categories",
			value: {
				path: "CategoryId"
			},
			supportMultiSelect: false
		});

		var oSpy = sinon.spy(this.oSmartMultiInput, "_createMultiInput");

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
			assert.notOk(oSpy.returnValues[0].params.valuehelp.supportMultiSelect, "supportMultiSelect in value help should be set");
			fnDone();
		});

		this.oSmartMultiInput.setModel(this.oModel);

		this.oSmartMultiInput.placeAt("content");
		sap.ui.getCore().applyChanges();

	});
});

/*global QUnit,sinon*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiinput.WithBindingContext", [
	"sap/ui/comp/smartmultiinput/SmartMultiInput",
	"test-resources/sap/ui/comp/qunit/smartmultiinput/TestUtils",
	"sap/m/Token",
	"sap/ui/core/ValueState",
	"sap/ui/model/Filter",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (SmartMultiInput, TestUtils, Token, ValueState, Filter, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("binding context", {
		before: function () {

		},
		after: function () {

		},
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				that.oModel = oModel;
				that.oModel.setDeferredGroups([]);

				that.oSmartMultiInput = new SmartMultiInput({
					value: {
						path: "Categories/CategoryId"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);
				that.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});

				that.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();


				function onRequestCompleted(oEvent) {
					if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
						that.oModel.detachRequestCompleted(onRequestCompleted);
						fnDone();
					}
				}

				that.oModel.attachRequestCompleted(onRequestCompleted);

			});
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});

	TestUtils.initCommonTests();

	QUnit.test("smart multi input is rendered correctly", function (assert) {
		var mTestData = {
			tokens: [
				{
					key: "PR",
					text: "Projector (PR)"
				},
				{
					key: "LT",
					text: "Laptop (LT)"
				}
			]
		};

		var aTokens = this.oSmartMultiInput.getTokens();
		assert.equal(aTokens.length, 2, "number of tokens");

		for (var i = 0; i < mTestData.tokens.length; i++) {
			assert.equal(aTokens[i].getKey(), mTestData.tokens[i].key, "key is correct");
			assert.equal(aTokens[i].getText(), mTestData.tokens[i].text, "text is correct");
		}

		assert.ok(this.oSmartMultiInput._oMultiInput.getShowValueHelp(), "value help button shown");
	});


	// TODO tests for different Edm types
	QUnit.test("_validateValue", function (assert) {
		assert.ok(this.oSmartMultiInput._validateValue("PR"));
		assert.ok(this.oSmartMultiInput._validateValue("1234"));
		assert.notOk(this.oSmartMultiInput._validateValue(""));
		assert.notOk(this.oSmartMultiInput._validateValue("1234567890123456789012345"));
	});

	QUnit.test("_addToken", function (assert) {
		var that = this;
		var fnDone = assert.async();
		var sCategory = "NEW";

		var oRowData = {"ProductId": "TestProduct"};

		var mBeforeCreateData = {
			CategoryId: "NEW",
			ProductId: "TestProduct"
		};
		var mAfterCreateData = {
			CategoryId: "NEW",
			ProductId: "TestProduct",
			BeforeCreate: "wasCalled"
		};

		var mBeforeCreateParams = {
			headers: {
				test: "test"
			}
		};

		var mBeforeCreateTestParams = {
			"changeSetId": undefined,
			"groupId": "changes"
		};

		var oCreateSpy = sinon.spy(this.oModel, "createEntry");

		this.oSmartMultiInput.attachBeforeCreate(function (oEvent) {
			var oData = oEvent.getParameter("oData");
			assert.deepEqual(oData, mBeforeCreateData, "before create events provides correct oData");
			oData.BeforeCreate = "wasCalled";

			var mParameters = oEvent.getParameter("mParameters");
			assert.deepEqual(mParameters, mBeforeCreateTestParams, "before create events provides correct mParameters");

			for (var sParam in mBeforeCreateParams) {
				mParameters[sParam] = mBeforeCreateParams[sParam];
			}
		});

		function onRequestCompleted() {
			that.oModel.detachRequestCompleted(onRequestCompleted);

			assert.ok(oCreateSpy.calledOnce, "create method was called once");
			assert.equal(oCreateSpy.args[0][0], "Categories", "create was called with correct path");
			assert.deepEqual(oCreateSpy.args[0][1].properties, mAfterCreateData, "create was called with correct data");

			assert.equal(Object.keys(oCreateSpy.args[0][1]).length, 6
				, "create was called with correct number of parameters");

			for (var sParam in mBeforeCreateParams) {
				assert.equal(oCreateSpy.args[0][1][sParam], mBeforeCreateParams[sParam], sParam + " correct");
			}

			fnDone();
		}

		this.oModel.attachRequestCompleted(onRequestCompleted);


		var oToken = new Token({
			text: sCategory,
			key: sCategory
		});

		oToken.data("row", oRowData);

		this.oSmartMultiInput._addToken(oToken);
	});

	QUnit.skip("_addToken failed request", function (assert) {
		var that = this;
		var fnDone = assert.async();
		var sKey = "SS";
		var mRowData = {
			CategoryId: sKey
		};

		var oModel = this.oModel;
		sinon.stub(this.oSmartMultiInput, "_getEntityKeyProperties").returns({});

		oModel.attachRequestFailed(function () {
			assert.equal(that.oSmartMultiInput.getValueState(), ValueState.Error, "smi is in error state");
			assert.equal(that.oSmartMultiInput.getValueStateText(), "cannot add this entity", "correct error text");
			assert.equal(that.oSmartMultiInput._oMultiInput.getValue(), sKey, "multiInput value is set to the error key");
			fnDone();
		});

		var oToken = new Token({
			key: sKey
		});
		oToken.data("row", mRowData);

		this.oSmartMultiInput._addToken(oToken);
	});

	QUnit.test("beforeCreate prevent default", function (assert) {
		var mRowData = {
			data: "data",
			"__metadata": "not in the call"
		};

		var oCreateSpy = sinon.spy(this.oModel, "create");

		this.oSmartMultiInput.attachBeforeCreate(function (oEvent) {
			oEvent.preventDefault();
		});

		var oToken = new Token();
		oToken.data("row", mRowData);

		this.oSmartMultiInput._addToken(oToken);

		assert.notOk(oCreateSpy.called, "create not called");
	});

	QUnit.test("_removeToken", function (assert) {
		var that = this;
		var fnDone = assert.async();
		var mBeforeRemove = {
			groupId: 1,
			changeSetId: 2
		};
		var mBeforeRemoveTestParams = {
			"changeSetId": undefined,
			"groupId": "changes"
		};


		var oToken = this.oSmartMultiInput.getTokens()[0];

		var oRemoveSpy = sinon.spy(this.oModel, "remove");

		this.oSmartMultiInput.attachBeforeRemove(function (oEvent) {
			var mParameters = oEvent.getParameter("mParameters");
			assert.deepEqual(mParameters, mBeforeRemoveTestParams, "beforeRemove called with empty object");

			for (var sParam in mBeforeRemove) {
				mParameters[sParam] = mBeforeRemove[sParam];
			}
		});

		function onRequestCompleted() {
			that.oModel.detachRequestCompleted(onRequestCompleted);

			assert.ok(oRemoveSpy.calledOnce, "remove called once");
			assert.equal(oRemoveSpy.args[0][0], "",
				"remove called with correct path");

			assert.equal(Object.keys(oRemoveSpy.args[0][1]).length, Object.keys(mBeforeRemove).length + 2,
				"remove called with correct number of parameters");

			for (var sParam in mBeforeRemove) {
				assert.equal(oRemoveSpy.args[0][1][sParam], mBeforeRemove[sParam], sParam + " is correct");
			}

			fnDone();
		}

		this.oModel.attachRequestCompleted(onRequestCompleted);

		this.oSmartMultiInput._removeToken(oToken);
	});

	QUnit.skip("_removeToken failed request", function (assert) {
		var that = this;
		var fnDone = assert.async();

		this.oModel.attachRequestFailed(function () {
			assert.equal(that.oSmartMultiInput.getValueState(), ValueState.Error, "smi is in error state");
			assert.equal(that.oSmartMultiInput.getValueStateText(), "cannot delete this entity", "correct error text");
			fnDone();
		});

		var oToken = this.oSmartMultiInput.getTokens()[1];
		this.oSmartMultiInput._removeToken(oToken);
	});


	QUnit.test("beforeRemove prevent default", function (assert) {
		var oToken = this.oSmartMultiInput.getTokens()[0];

		var oRemoveSpy = sinon.spy(this.oModel, "remove");

		this.oSmartMultiInput.attachBeforeRemove(function (oEvent) {
			oEvent.preventDefault();
		});


		this.oSmartMultiInput._removeToken(oToken);

		assert.notOk(oRemoveSpy.called, "remove not called");
	});

	QUnit.test("_getNavigationPath", function (assert) {
		assert.equal(this.oSmartMultiInput._getNavigationPath(), "Categories");
	});

	QUnit.test("non editable mode", function (assert) {
		var that = this,
			fnDone = assert.async();

		sinon.spy(this.oSmartMultiInput._oFactory, "_createTokenizer");
		sinon.spy(this.oSmartMultiInput, "_initTokenizerCollapseMode");

		this.oSmartMultiInput.setEditable(false);


		this.oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
				assert.ok(that.oSmartMultiInput._oFactory._createTokenizer.calledOnce, "_createTokenizer should be called once");
				assert.ok(that.oSmartMultiInput._oTokenizer, "tokenizer exists");
				assert.notOk(that.oSmartMultiInput._oTokenizer.getEditable(), "tokenizer is not editable");
				assert.equal(that.oSmartMultiInput._oTokenizer.getTokens().length, 2, "tokenizer has correct number of tokens");
				assert.ok(that.oSmartMultiInput._oTokenizer.getBinding("tokens"), "tokenizer is bound");
				assert.ok(that.oSmartMultiInput._initTokenizerCollapseMode.calledOnce, "_initTokenizerCollapseMode was called once");

				fnDone();
			}
		});
	});

	QUnit.test("_getEntityKeyProperties", function (assert) {
		var mTextProperties = {
			CategoryId: "PR",
			ProductId: "1"
		};

		var oContext = this.oSmartMultiInput.getTokens()[0].getBindingContext();
		var mKeyProperties = this.oSmartMultiInput._getEntityKeyProperties(oContext);

		assert.deepEqual(mKeyProperties, mTextProperties, "correct key properties should be returned");
	});

	QUnit.test("getFilter", function(assert) {
		var aTestFilters = [
			new Filter("CategoryId", "EQ", "LT"),
			new Filter("CategoryId", "EQ", "PR")
			],
			oTestFilter = new Filter(aTestFilters, false);

		var oFilter = this.oSmartMultiInput.getFilter();

		assert.deepEqual(oFilter, oTestFilter, "correct filters should be returned");
	});

	QUnit.test("getRangeData", function(assert) {
		var aTestRangeData = [
			{exclude: false, operation: "EQ", value1: "PR", value2: "", keyField: "CategoryId"},
			{exclude: false, operation: "EQ", value1: "LT", value2: "", keyField: "CategoryId"}
		];

		var aRangeData = this.oSmartMultiInput.getRangeData();

		assert.deepEqual(aRangeData, aTestRangeData, "correct range data should be returned");
	});

	QUnit.test("token update", function (assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput.attachTokenUpdate(function () {
			assert.ok(true, "smartMultiInput tokenUpdate called on inner multiInput token update");
			fnDone();
		});

		this.oSmartMultiInput._oMultiInput.fireTokenUpdate({
			addedTokens: [],
			removedTokens: []
		});
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

	QUnit.test("supportMultiSelect true", function(assert) {
		var fnDone = assert.async();
		var that = this;

		that.oSmartMultiInput = new SmartMultiInput({
			value: {
				path: "Categories/CategoryId"
			},
			supportMultiSelect: true
		});

		that.oSmartMultiInput.setModel(that.oModel);
		that.oSmartMultiInput.bindElement({
			path: "/Products('1')"
		});

		that.oSmartMultiInput.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oSpy = sinon.spy(this.oSmartMultiInput, "_createMultiInput");

		that.oModel.attachRequestCompleted(onRequestCompleted);

		function onRequestCompleted(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
				that.oModel.detachRequestCompleted(onRequestCompleted);
				assert.ok(oSpy.returnValues[0].params.valuehelp.supportMultiSelect, "supportMultiSelect in value help should be set");
				fnDone();
			}
		}
	});

	QUnit.test("supportMultiSelect false", function(assert) {
		var fnDone = assert.async();
		var that = this;

		that.oSmartMultiInput = new SmartMultiInput({
			value: {
				path: "Categories/CategoryId"
			},
			supportMultiSelect: false
		});

		that.oSmartMultiInput.setModel(that.oModel);
		that.oSmartMultiInput.bindElement({
			path: "/Products('1')"
		});

		that.oSmartMultiInput.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oSpy = sinon.spy(this.oSmartMultiInput, "_createMultiInput");

		that.oModel.attachRequestCompleted(onRequestCompleted);

		function onRequestCompleted(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
				that.oModel.detachRequestCompleted(onRequestCompleted);
				assert.notOk(oSpy.returnValues[0].params.valuehelp.supportMultiSelect, "supportMultiSelect in value help should be set");
				fnDone();
			}
		}
	});
});

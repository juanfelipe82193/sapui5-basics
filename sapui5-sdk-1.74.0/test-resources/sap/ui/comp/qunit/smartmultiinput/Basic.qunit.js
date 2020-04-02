/*global QUnit,sinon*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiinput.Basic", [
	"sap/ui/comp/smartmultiinput/SmartMultiInput",
	"test-resources/sap/ui/comp/qunit/smartmultiinput/TestUtils",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/ui/model/Context",
	"sap/ui/core/ValueState",
	'sap/ui/model/BindingMode',
	"sap/m/Token",
	"sap/ui/comp/smartfilterbar/DisplayBehaviour",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (SmartMultiInput, TestUtils, ODataControlFactory, Context, ValueState, BindingMode, Token,DisplayBehaviour,
			 createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("basic", {
		before: function () {
		},
		after: function () {
		},
		beforeEach: function (assert) {
			this.oMockServer = TestUtils.createMockServer();
			this.oSmartMultiInput = new SmartMultiInput();
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oSmartMultiInput.destroy();
			if (typeof this.oModel !== "undefined" && this.oModel) {
				this.oModel.destroy();
				this.oModel = null;
			}
		}
	});

	QUnit.test("_getFormattedText", function (assert) {
		var that = this;
		var aBehaviours = [
			DisplayBehaviour.auto,
			DisplayBehaviour.descriptionAndId,
			DisplayBehaviour.descriptionOnly,
			DisplayBehaviour.idAndDescription,
			DisplayBehaviour.idOnly
		];
		var oText = {
			key: "PR",
			description: "Projector"
		};

		oText[DisplayBehaviour.auto] = "Projector (PR)";
		oText[DisplayBehaviour.descriptionAndId] = "Projector (PR)";
		oText[DisplayBehaviour.descriptionOnly] = "Projector";
		oText[DisplayBehaviour.idAndDescription] = "PR (Projector)";
		oText[DisplayBehaviour.idOnly] = "PR";

		that.oSmartMultiInput._oFactory = new ODataControlFactory();
		var oStub = sinon.stub(that.oSmartMultiInput._oFactory, "_getDisplayBehaviourConfiguration");

		aBehaviours.forEach(function (sBehaviour) {
			oStub.returns(sBehaviour);
			var sResult = that.oSmartMultiInput._getFormattedText(oText.key, oText.description);
			assert.equal(sResult, oText[sBehaviour], "text should be formatted correctly");
		});

	});

	QUnit.test("_getModel", function (assert) {
		var oModel = new sap.ui.model.json.JSONModel();

		assert.equal(this.oSmartMultiInput._getModel(), null, "_getModel should return null");

		this.oSmartMultiInput._oFactory = new ODataControlFactory(oModel);

		assert.equal(this.oSmartMultiInput._getModel(), oModel, "_getModel should return model object");
	});

	QUnit.test("creator function", function (assert) {
		assert.equal(this.oSmartMultiInput._oFactory, undefined, "_oFactory should be undefined");

		this.oSmartMultiInput._oFactory = new ODataControlFactory();

		var oEditableStub = sinon.stub(this.oSmartMultiInput, "getEditable").returns(true);
		var oComboBoxStub = sinon.stub(this.oSmartMultiInput, "_checkComboBox").returns(false);
		sinon.stub(this.oSmartMultiInput, "getEnabled").returns(true);
		sinon.stub(this.oSmartMultiInput, "getContextEditable").returns(true);

		this.oSmartMultiInput._init();
		assert.equal(this.oSmartMultiInput._oFactory._oSelector.getCreator(), "_createMultiInput");

		oComboBoxStub.returns(true);
		assert.equal(this.oSmartMultiInput._oFactory._oSelector.getCreator(), "_createMultiComboBox");

		this.oSmartMultiInput._init();
		oEditableStub.returns(false);
		assert.equal(this.oSmartMultiInput._oFactory._oSelector.getCreator(), "_createTokenizer");
	});

	QUnit.test("_init called with binding context", function (assert) {
		var that = this;
		var fnDone = assert.async();

		var oSpy = sinon.spy(this.oSmartMultiInput, "_init");

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.bindElement({
				path: "/Products('1')"
			});
			that.oSmartMultiInput.bindProperty("value", {
				path: "Categories/CategoryId"
			});

			that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
				assert.ok(oSpy.called, "_init was called");
				assert.ok(that.oSmartMultiInput._oFactory, "factory exists");
				fnDone();
			});

		});
	});

	QUnit.test("_init called when used as filter", function (assert) {
		var that = this;
		var fnDone = assert.async();

		var oSpy = sinon.spy(this.oSmartMultiInput, "_init");

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			that.oSmartMultiInput.setEntitySet("Categories");
			that.oSmartMultiInput.bindProperty("value", {
				path: "CategoryId"
			});
			that.oSmartMultiInput.setModel(that.oModel);

			that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
				assert.ok(oSpy.called, "_init was called");
				assert.ok(that.oSmartMultiInput, "factory exists");
				fnDone();
			});

		});
	});

	QUnit.test("_init called when used as filter different order of methods", function (assert) {
		var that = this;
		var fnDone = assert.async();

		var oSpy = sinon.spy(this.oSmartMultiInput, "_init");

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.bindProperty("value", {
				path: "CategoryId"
			});
			that.oSmartMultiInput.setEntitySet("Categories");

			that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
				assert.ok(oSpy.called, "_init was called");
				assert.ok(that.oSmartMultiInput, "factory exists");
				fnDone();
			});

		});
	});

	QUnit.test("_init called when used as filter different order of methods 2", function (assert) {
		var that = this;
		var fnDone = assert.async();

		var oSpy = sinon.spy(this.oSmartMultiInput, "_init");

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.setEntitySet("Categories");
			that.oSmartMultiInput.bindProperty("value", {
				path: "CategoryId"
			});

			that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
				assert.ok(oSpy.called, "_init was called");
				assert.ok(that.oSmartMultiInput, "factory exists");
				fnDone();
			});

		});
	});

	var aBindingModes = ["OneTime", "OneWay", "TwoWay"];

	aBindingModes.forEach(function (sBindingMode) {
		QUnit.test("_bindMultiInput calls " + sBindingMode, function (assert) {
			var sFunction = "_bindMultiInput" + sBindingMode,
				oSpy = sinon.stub(this.oSmartMultiInput, sFunction),
				oBinding = {
					getBindingMode: function () {
						return sBindingMode;
					}
				};

			sinon.stub(this.oSmartMultiInput, "getBinding").returns(oBinding);

			this.oSmartMultiInput._bindMultiInput();

			assert.ok(oSpy.calledOnce, sFunction + " should be called once");
		});

		QUnit.test("_bindMultiComboBox  calls " + sBindingMode, function (assert) {
			var sFunction = "_bindMultiComboBox" + sBindingMode,
				oSpy = sinon.stub(this.oSmartMultiInput, sFunction),
				oBinding = {
					getBindingMode: function () {
						return sBindingMode;
					}
				};

			sinon.stub(this.oSmartMultiInput, "getBinding").returns(oBinding);

			this.oSmartMultiInput._bindMultiComboBox();

			assert.ok(oSpy.calledOnce, sFunction + " should be called once");
		});
	});

	QUnit.test("_tokensFactory", function (assert) {
		var sKey = "testKey";
		var sDescription = "testDescription";
		var sFormatted = "testFormatted";
		var sPropertyName = "testProperty";
		var mKeyProperties = {
			key1: "val1",
			key2: "val2"
		};

		var sId = "testId";

		var oContext = new Context();

		this.oSmartMultiInput._oFactory = new ODataControlFactory();
		this.oSmartMultiInput._oType = {
			formatValue: function () {
				return sKey;
			}
		};

		sinon.stub(this.oSmartMultiInput, "_getPropertyName").returns(sPropertyName);
		sinon.stub(this.oSmartMultiInput, "_getDescriptionFieldName").returns(sDescription);
		sinon.stub(this.oSmartMultiInput, "_getFormattedText").returns(sFormatted);
		sinon.stub(oContext, "getProperty").withArgs(sPropertyName).returns(sKey).withArgs(sDescription).returns(sDescription);
		sinon.stub(this.oSmartMultiInput, "_getEntityKeyProperties").returns(mKeyProperties);

		var oToken = this.oSmartMultiInput._tokensFactory(sId, oContext);
		assert.equal(oToken.getText(), sFormatted, "correct text");
		assert.equal(oToken.getKey(), sKey, "correct key");
	});

	QUnit.test("_tokensFactory read mode", function (assert) {
		var sKey = "testKey";
		var sDescription = "testDescription";
		var sFormatted = "testFormatted";
		var sPropertyName = "testProperty";
		var mKeyProperties = {
			key1: "val1",
			key2: "val2"
		};

		var sId = "testId";

		var oContext = new Context();

		this.oSmartMultiInput._oFactory = new ODataControlFactory();
		this.oSmartMultiInput._oType = {
			formatValue: function () {
				return sKey;
			}
		};

		sinon.stub(this.oSmartMultiInput, "_isReadMode").returns(true);
		sinon.stub(this.oSmartMultiInput, "_getPropertyName").returns(sPropertyName);
		sinon.stub(this.oSmartMultiInput, "_getDescriptionFieldName").returns(sDescription);
		sinon.stub(this.oSmartMultiInput, "_getFormattedText").returns(sFormatted);
		sinon.stub(oContext, "getProperty").withArgs(sPropertyName).returns(sKey).withArgs(sDescription).returns(sDescription);
		sinon.stub(this.oSmartMultiInput, "_getEntityKeyProperties").returns(mKeyProperties);

		var oToken = this.oSmartMultiInput._tokensFactory(sId, oContext);
		assert.equal(oToken.getText(), sFormatted, "correct text");
		assert.equal(oToken.getKey(), sKey, "correct key");
	});


	var aFunctions = [
		"_getDescriptionFieldName", "_getPropertyName", "_getEntitySetName", "_getValueListAnnotation",
		"_getNavigationPath"
	];

	aFunctions.forEach(function (sFunction) {
		QUnit.test(sFunction, function (assert) {
			try {
				this.oSmartMultiInput[sFunction]();
			} catch (e) {
				assert.ok(true, "not initialized");
			}
		});
	});

	QUnit.test("_bindMultiInputOneTime", function (assert) {
		var that = this,
			fnDone = assert.async();

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			sinon.spy(that.oSmartMultiInput, "_bindMultiInputOneTime");
			sinon.spy(that.oModel, "read");

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.bindElement({
				path: "/Products('1')"
			});
			that.oSmartMultiInput.bindProperty("value", {
				path: "Categories/CategoryId",
				mode: BindingMode.OneTime
			});

			function asserts() {
				assert.ok(that.oSmartMultiInput._bindMultiInputOneTime.calledOnce, "_bindMultiInputOneTime should be called once");
				assert.ok(that.oModel.read.calledTwice, "model.read should be called twice");
				assert.equal(that.oModel.read.args[1][0], "Categories", "read called with correct entity set");
				assert.equal(that.oModel.read.args[1][1].context.getPath(), "/Products('1')", "read called with correct context");
				assert.equal(that.oSmartMultiInput.getTokens().length, 2, "smartmultiinput has correct number of tokens");

				assert.equal(that.oSmartMultiInput.getTokens()[0].getText(), "Projector (PR)", "token has correct text");
				that.oModel.setProperty("/Categories(CategoryId='PR',ProductId='1')/Description", "test");
				assert.equal(that.oSmartMultiInput.getTokens()[0].getText(), "Projector (PR)", "token isn't updated from model");

				var sText = "test";
				that.oModel.read.args[1][1].error({responseText: sText});
				assert.equal(that.oSmartMultiInput.getValueState(), ValueState.Error, "multi input is in error state");
				assert.equal(that.oSmartMultiInput.getValueStateText(), sText, "multi input has correct error text");

				fnDone();
			}


			that.oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories") {
					setTimeout(asserts, 0);
				}
			});

		});
	});

	QUnit.test("_bindMultiInputOneWay", function (assert) {
		var that = this,
			fnDone = assert.async();

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			sinon.spy(that.oSmartMultiInput, "_bindMultiInputOneWay");

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.bindElement({
				path: "/Products('1')"
			});
			that.oSmartMultiInput.bindProperty("value", {
				path: "Categories/CategoryId",
				mode: BindingMode.OneWay
			});

			that.oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
					assert.ok(that.oSmartMultiInput._bindMultiInputOneWay.calledOnce, "_bindMultiInputOneWay should be called once");
					assert.ok(that.oSmartMultiInput._oMultiInput.getBinding("tokens"), "tokens are bound");

					sinon.spy(that.oSmartMultiInput, "_addToken");
					that.oSmartMultiInput._oMultiInput.fireTokenUpdate({
						addedTokens: ["test"],
						removedTokens: []
					});
					assert.ok(that.oSmartMultiInput._addToken.notCalled, "token update is ignored");

					fnDone();
				}
			});

		});
	});

	QUnit.test("_bindMultiInputTwoWay", function (assert) {
		var that = this,
			fnDone = assert.async();

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			sinon.spy(that.oSmartMultiInput, "_bindMultiInputTwoWay");

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.bindElement({
				path: "/Products('1')"
			});
			that.oSmartMultiInput.bindProperty("value", {
				path: "Categories/CategoryId",
				mode: BindingMode.TwoWay
			});

			that.oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
					assert.ok(that.oSmartMultiInput._bindMultiInputTwoWay.calledOnce, "_bindMultiInputTwoWay should be called once");
					assert.ok(that.oSmartMultiInput._oMultiInput.getBinding("tokens"), "tokens are bound");


					sinon.stub(that.oSmartMultiInput, "_addToken");
					that.oSmartMultiInput._oMultiInput.fireTokenUpdate({
						addedTokens: ["test"],
						removedTokens: []
					});
					assert.ok(that.oSmartMultiInput._addToken.calledOnce, "token update is attached");

					fnDone();
				}
			});

		});
	});

	QUnit.test("_bindMultiComboBoxOneTime", function (assert) {
		var that = this,
			fnDone = assert.async();

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			sinon.spy(that.oSmartMultiInput, "_bindMultiComboBoxOneTime");
			sinon.spy(that.oModel, "read");

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.bindElement({
				path: "/Products('1')"
			});
			that.oSmartMultiInput.bindProperty("value", {
				path: "Categories/Description",
				mode: BindingMode.OneTime
			});

			that.oSmartMultiInput.placeAt("content");
			sap.ui.getCore().applyChanges(); // needs to be rendered for value help (select) to exist

			function asserts() {
				assert.ok(that.oSmartMultiInput._bindMultiComboBoxOneTime.calledOnce, "_bindMultiComboBoxOneTime should be called once");

				assert.equal(that.oModel.read.args[1][0], "Categories", "read called with correct entity set");
				assert.equal(that.oModel.read.args[1][1].context.getPath(), "/Products('1')", "read called with correct context");
				assert.equal(that.oSmartMultiInput.getTokens().length, 2, "smartmultiinput has correct number of tokens");

				assert.equal(that.oSmartMultiInput.getTokens()[0].getText(), "Projector", "token has correct text");
				that.oModel.setProperty("/Categories(CategoryId='PR',ProductId='1')/Description", "test");
				assert.equal(that.oSmartMultiInput.getTokens()[0].getText(), "Projector", "token isn't updated from model");

				var sText = "test";
				that.oModel.read.args[1][1].error({responseText: sText});
				assert.equal(that.oSmartMultiInput.getValueState(), ValueState.Error, "multi input is in error state");
				assert.equal(that.oSmartMultiInput.getValueStateText(), sText, "multi input has correct error text");

				fnDone();
			}

			that.oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/CategoriesVH/$count") {
					setTimeout(asserts, 0); // wait for propagation from the model
				}
			});

		});
	});

	QUnit.test("_bindMultiComboBoxOneWay", function (assert) {
		var that = this,
			fnDone = assert.async();

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			sinon.spy(that.oSmartMultiInput, "_bindMultiComboBoxOneWay");

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.bindElement({
				path: "/Products('1')"
			});
			that.oSmartMultiInput.bindProperty("value", {
				path: "Categories/Description",
				mode: BindingMode.OneWay
			});

			that.oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
					assert.ok(that.oSmartMultiInput._bindMultiComboBoxOneWay.calledOnce, "_bindMultiComboBoxOneWay should be called once");
					assert.ok(that.oSmartMultiInput._oMultiInput.getBinding("tokens"), "tokens are bound");

					sinon.spy(that.oSmartMultiInput, "_addToken");
					that.oSmartMultiInput._oMultiComboBox.fireSelectionChange({
						selected: true
					});
					assert.ok(that.oSmartMultiInput._addToken.notCalled, "selection change is ignored");

					fnDone();
				}
			});

		});
	});

	QUnit.test("_bindMultiComboBoxTwoWay", function (assert) {
		var that = this,
			fnDone = assert.async();

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			sinon.spy(that.oSmartMultiInput, "_bindMultiComboBoxTwoWay");

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.bindElement({
				path: "/Products('1')"
			});
			that.oSmartMultiInput.bindProperty("value", {
				path: "Categories/Description",
				mode: BindingMode.TwoWay
			});

			that.oSmartMultiInput.placeAt("content");
			sap.ui.getCore().applyChanges(); // needs to be rendered for items to exist

			function asserts() {
				assert.ok(that.oSmartMultiInput._bindMultiComboBoxTwoWay.calledOnce, "_bindMultiComboBoxTwoWay should be called once");
				assert.ok(that.oSmartMultiInput._oMultiInput.getBinding("tokens"), "tokens are bound");


				sinon.stub(that.oSmartMultiInput, "_createEntity");
				that.oSmartMultiInput._oMultiComboBox.fireSelectionChange({
					selected: true,
					changedItem: that.oSmartMultiInput._oMultiComboBox.getItems()[0]
				});
				assert.ok(that.oSmartMultiInput._createEntity.calledOnce, "selection change is attached");

				fnDone();
			}

			that.oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/CategoriesVH/$count") {
					setTimeout(asserts, 0); // wait for propagation from the model
				}
			});

		});
	});

	QUnit.test("_validateToken true with context", function (assert) {
		var sText = "test",
			sPropertyName = "testProperty",
			oArgs = {
				text: sText
			};

		this.oSmartMultiInput._oType = {
			parseValue: function () {
				return sText;
			}
		};
		sinon.stub(this.oSmartMultiInput, "_getPropertyName").returns(sPropertyName);
		sinon.stub(this.oSmartMultiInput, "_validateValue").returns(true);
		sinon.stub(this.oSmartMultiInput, "getBindingContext").returns(true);

		var oToken = this.oSmartMultiInput._validateToken(oArgs);

		assert.ok(oToken, "token created");
		assert.equal(oToken.getKey(), sText, "token has correct key");
		assert.equal(oToken.getText(), sText, "token has correct text");
	});

	QUnit.test("_validateToken true without context, with ranges", function (assert) {
		var sText = "test",
			sPropertyName = "testProperty",
			oArgs = {
				text: sText
			},
			mRangeData = {
				keyField: sPropertyName,
				operation: "EQ",
				exclude: false,
				value1: sText,
				value2: ""
		};

		this.oSmartMultiInput._oType = {
			parseValue: function () {
				return sText;
			}
		};
		sinon.stub(this.oSmartMultiInput, "_getPropertyName").returns(sPropertyName);
		sinon.stub(this.oSmartMultiInput, "_validateValue").returns(true);
		sinon.stub(this.oSmartMultiInput, "getBindingContext").returns(false);
		sinon.stub(this.oSmartMultiInput, "getSupportRanges").returns(true);

		var oToken = this.oSmartMultiInput._validateToken(oArgs);

		assert.ok(oToken, "token created");
		assert.equal(oToken.getKey(), sText, "token has correct key");
		assert.equal(oToken.getText(), "=" + sText, "token has correct text");
		assert.deepEqual(oToken.data("range"), mRangeData, "range data parameters are correct");
	});

	QUnit.test("_validateToken false", function (assert) {
		var sText = "test",
			oArgs = {
				text: sText
			};

		sinon.stub(this.oSmartMultiInput, "_validateValue").returns(false);

		var oToken = this.oSmartMultiInput._validateToken(oArgs);

		assert.notOk(oToken, "token not created");
	});

	QUnit.test("_validateValueOnChange empty", function (assert) {
		var sText = "";

		sinon.stub(this.oSmartMultiInput, "_validateMultiInput");
		sinon.stub(this.oSmartMultiInput, "setValueState");


		this.oSmartMultiInput._validateValueOnChange(sText);

		assert.ok(this.oSmartMultiInput._validateMultiInput.calledOnce, "_validateMultiInput should be called once");
		assert.ok(this.oSmartMultiInput.setValueState.calledOnce, "setValueState should be called once");
		assert.equal(this.oSmartMultiInput.setValueState.args[0], "None");
	});

	QUnit.test("_validateValueOnChange", function (assert) {
		var sText = "test";

		sinon.stub(this.oSmartMultiInput, "_validateValue");


		this.oSmartMultiInput._validateValueOnChange(sText);

		assert.ok(this.oSmartMultiInput._validateValue.calledOnce, "_validateValue should be called once");
		assert.equal(this.oSmartMultiInput._validateValue.args[0], sText);
	});

	QUnit.test("_addToken without row value", function(assert) {
		var sText = "testText",
			sPropertyName = "propertyName",
			oData = {};
		oData[sPropertyName] = sText;

		sinon.stub(this.oSmartMultiInput, "_getEntityKeyProperties").returns({});
		sinon.stub(this.oSmartMultiInput, "_getPropertyName").returns(sPropertyName);
		sinon.stub(this.oSmartMultiInput, "_createEntity");

		var oToken = new Token({
			text: sText,
			key: sText
		});

		this.oSmartMultiInput._addToken(oToken);

		assert.deepEqual(this.oSmartMultiInput._createEntity.args[0][0], oData, "createEntity called with correct properties");
	});

	QUnit.test("checkClientError display mode", function (assert) {
		var bClientError;

		sinon.stub(this.oSmartMultiInput, "getMode").returns("display");

		bClientError = this.oSmartMultiInput.checkClientError();

		assert.notOk(bClientError, "no error in display mode");
	});

	QUnit.test("checkClientError", function (assert) {
		var bClientError;

		sinon.stub(this.oSmartMultiInput, "getMode").returns("edit");
		sinon.stub(this.oSmartMultiInput, "_validateMultiInput").returns(false);

		bClientError = this.oSmartMultiInput.checkClientError();

		assert.ok(bClientError, "error found");
	});

	QUnit.test("_getDateFormatSettings", function (assert) {
		var oDateFormatSettings = {"UTC": true, "style": "long"};
		var sDateFormatSettings = '\{"UTC":true,"style":"long"\}';

		this.oSmartMultiInput.data("dateFormatSettings", oDateFormatSettings);
		var oReturnedSettings = this.oSmartMultiInput._getDateFormatSettings();
		assert.deepEqual(oReturnedSettings, oDateFormatSettings, "dateFormatSettings are correct");

		this.oSmartMultiInput.data("dateFormatSettings", sDateFormatSettings);
		oReturnedSettings = this.oSmartMultiInput._getDateFormatSettings();
		assert.deepEqual(oReturnedSettings, oDateFormatSettings, "dateFormatSettings are correct");
	});

	QUnit.test("_isTimeType", function (assert) {
		var aTimeEdmTypes = ["Edm.DateTime", "Edm.DateTimeOffset", "Edm.Time"];
		var aOtherEdmTypes = ["Edm.Binary", "Edm.Boolean", "Edm.Byte", "Edm.Decimal", "Edm.Double", "Edm.Int16"];

		this.oSmartMultiInput._oFactory = new ODataControlFactory();

		aTimeEdmTypes.forEach(function (sTimeEdmType) {
			this.oSmartMultiInput._oFactory._oMetaData = {
				property: {
					property: {
						type: sTimeEdmType
					}
				}
			};

			assert.ok(this.oSmartMultiInput._isEdmTimeType(), sTimeEdmType + " should be time type");
		}, this);

		aOtherEdmTypes.forEach(function (sEdmType) {
			this.oSmartMultiInput._oFactory._oMetaData = {
				property: {
					property: {
						type: sEdmType
					}
				}
			};

			assert.notOk(this.oSmartMultiInput._isEdmTimeType(), sEdmType + " should not be time type");
		}, this);
	});

	QUnit.test("support ranges with binding has no effect", function (assert) {
		var that = this;
		var fnDone = assert.async();

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.bindElement({
				path: "/Products('1')"
			});
			that.oSmartMultiInput.bindProperty("value", {
				path: "Categories/Price"
			});
			that.oSmartMultiInput.setSupportRanges(true);

			that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
				assert.notOk(that.oSmartMultiInput._oMultiInput.getShowValueHelp(), "value help should not be shown");
				fnDone();
			});

		});
	});

	QUnit.test("support ranges without binding has effect", function (assert) {
		var that = this;
		var fnDone = assert.async();

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			that.oSmartMultiInput.setModel(that.oModel);
			that.oSmartMultiInput.setEntitySet("Categories");
			that.oSmartMultiInput.bindProperty("value", {
				path: "Price"
			});
			that.oSmartMultiInput.setSupportRanges(true);

			that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
				assert.ok(that.oSmartMultiInput._oMultiInput.getShowValueHelp(), "value help should be shown");
				fnDone();
			});

		});
	});

	QUnit.test("parse and format value", function (assert) {
		var sParsedValue = "testParsed";
		var sFormattedValue = "testFormatted";
		var sValue = "value";
		var aTestValues = [sValue, "string"];
		this.oSmartMultiInput._oType = {
			parseValue: function() {},
			formatValue: function() {}
		};

		sinon.stub(this.oSmartMultiInput._oType, "parseValue").returns(sParsedValue);
		sinon.stub(this.oSmartMultiInput._oType, "formatValue").returns(sFormattedValue);

		this.oSmartMultiInput._parseValue("value");
		this.oSmartMultiInput._formatValue("value");

		assert.deepEqual(this.oSmartMultiInput._oType.parseValue.args[0], aTestValues, "_parseValue calls inner parseValue correctly");
		assert.deepEqual(this.oSmartMultiInput._oType.formatValue.args[0], aTestValues, "_formatValue calls inner formatValue correctly");
	});

	QUnit.test("_initTokenizerCollapseMode", function (assert) {
		var that = this;
		var fnDone = assert.async();

		this.oSmartMultiInput.setContextEditable(false);

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			that.oSmartMultiInput.setEntitySet("Categories");
			that.oSmartMultiInput.bindProperty("value", {
				path: "CategoryId"
			});
			that.oSmartMultiInput.setModel(that.oModel);

			that.oSmartMultiInput.placeAt("content");
			sap.ui.getCore().applyChanges();

			that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
				sinon.spy(that.oSmartMultiInput._oTokenizer, "_handleNMoreIndicatorPress");
				sinon.spy(that.oSmartMultiInput._oTokenizer, "_useCollapsedMode");

				that.oSmartMultiInput._initTokenizerCollapseMode();

				sap.ui.getCore().applyChanges();

				assert.equal(typeof that.oSmartMultiInput._oTokenizer._handleNMoreIndicatorPress.args[0][0], "function");
				assert.ok(that.oSmartMultiInput._oTokenizer._useCollapsedMode.args[0][0]);
				assert.equal(that.oSmartMultiInput._oTokenizer.getMaxWidth(), that.oSmartMultiInput.$().width() + "px",
					"tokenizer has maxWidth equal to width of the SmartMultiInput");
				fnDone();
			});

		});
	});

	QUnit.test("_handleNMoreIndicatorPress", function (assert) {
		var that = this;
		var fnDone = assert.async();

		this.oSmartMultiInput.setContextEditable(false);

		TestUtils.createDataModel().then(function (oModel) {
			that.oModel = oModel;

			that.oSmartMultiInput.setEntitySet("Categories");
			that.oSmartMultiInput.bindProperty("value", {
				path: "CategoryId"
			});
			that.oSmartMultiInput.setModel(that.oModel);

			that.oSmartMultiInput.placeAt("content");
			sap.ui.getCore().applyChanges();

			that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
				that.oSmartMultiInput._handleNMoreIndicatorPress();

				assert.ok(that.oSmartMultiInput.oReadTokenList.isA("sap.m.List"), "list of items is created");
				assert.ok(that.oSmartMultiInput.oReadTokenListPopover.isA("sap.m.Popover"), "popover with items is created");
				fnDone();
			});

		});
	});

	function injectTokenObjects(oSmartMultiInput) {
		var aTokenObjects = ["_oTokenizer", "_oMultiInput"];

		aTokenObjects.forEach(function(sTokenObject) {
			oSmartMultiInput[sTokenObject] = {
				getTokens: function() {}
			};
			sinon.spy(oSmartMultiInput[sTokenObject], "getTokens");
		});
	}

	QUnit.test("_getTokens in read mode", function (assert) {
		sinon.stub(this.oSmartMultiInput, "_isReadMode").returns(true);

		injectTokenObjects(this.oSmartMultiInput);

		this.oSmartMultiInput.getTokens();

		assert.ok(this.oSmartMultiInput._oTokenizer.getTokens.calledOnce, "tokenizer.getTokens was called");
		assert.notOk(this.oSmartMultiInput._oMultiInput.getTokens.called, "multiinput.getTokens was not called");
	});

	QUnit.test("_getTokens in edit mode", function (assert) {
		sinon.stub(this.oSmartMultiInput, "_isReadMode").returns(false);

		injectTokenObjects(this.oSmartMultiInput);

		this.oSmartMultiInput.getTokens();

		assert.ok(this.oSmartMultiInput._oMultiInput.getTokens.called, "multiinput.getTokens was called");
		assert.notOk(this.oSmartMultiInput._oTokenizer.getTokens.calledOnce, "tokenizer.getTokens was not called");
	});
});

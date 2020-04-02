/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/generic/app/util/ActionUtil",
	"sap/m/MessageBox"
], function(ActionUtil, MessageBox) {
	"use strict";

	QUnit.module("sap.ui.generic.app.util.ActionUtil", {

		beforeEach: function () {
			var that = this;

			//Mocks
			// FOR: ..._oMetaModel.getODataFunctionImport()
			this.fODataFunctionImport = function (sFunction) {
				return {
					"com.sap.vocabularies.Common.v1.IsActionCritical": null,
					"entitySet": "Dummy",
					"extensions": [],
					"httpMethod": "GET",
					"name": "",
					"parameter": [],
					"returnType": "",
					"sap:action-for": "",
					"sap:applicable-path": ""
				};
			};
			this.oContextObject = {};
			this.oEntitySet = {
				entitySet: "Dummy"
			};

			this.oEntityType = {
				key: {
					propertyRef: []
				}
			};
			//that._oMetaModel.getODataFunctionImport(sFunctionName)
			this.oView = {
				getModel: function () {
					return {
						getMetaModel: function () {
							return {
								getODataFunctionImport: that.fODataFunctionImport,
								getODataEntitySet: function () { return that.oEntitySet; },
								getODataEntityType: function () { return that.oEntityType; },
								getODataProperty: function () { return null; }
							};
						}
					};
				}
			};

			this.oTransactionController = {
				invokeAction: function (sFunctionImportPath, oContext, mParameters) {
					return Promise.resolve(mParameters);
				}
			};

			this.oController = {
				getComponent: function () { },
				getOwnerComponent: function () { return { getAppComponent: undefined};},
				getApplicationController: function () { }, //used in ActionUtil.js, but on in tests so far.
				getView: function () { return that.oView; },
				handleSuccess: function (oResponse) { },
				_getCompactModeStyleClass: function () { return null; }
			};

			this.oActionUtil = new ActionUtil();
			this.oActionUtil._getCompactModeStyleClass = function () { };
			this.oActionUtil.setController(this.oController);
			this.oActionUtil.setContexts([{
				getPath: function () { return "/dummyPath"; },
				getObject: function () { return that.oContextObject; }
			}]);
		},
		afterEach: function () {
			delete this.oActionUtil;
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(this.oActionUtil);
	});

	QUnit.test("test call function", function (assert) {
		var sCalledWithFunctionName;
		this.fODataFunctionImport = function (sFunctionName) {
			sCalledWithFunctionName = sFunctionName;
			return {};
		};
		sinon.stub(this.oActionUtil, "_prepareParameters");
		sinon.stub(this.oActionUtil, "_initiateCall");

		this.oActionUtil.call("test/dummy");
		assert.equal(sCalledWithFunctionName, "dummy", "oDataFunctionImport has to be called with 'dummy'");
		assert.ok(this.oActionUtil._prepareParameters.calledOnce, "_prepareParameters has to be called");
		assert.ok(this.oActionUtil._initiateCall.calledOnce, "_initiateCall has to be called");
	});

	QUnit.test("test call function with critical functions", function (assert) {

		this.fODataFunctionImport = function () {
			return {
				"com.sap.vocabularies.Common.v1.IsActionCritical": true,
				"entitySet": "Dummy",
				"extensions": [],
				"httpMethod": "GET",
				"name": "",
				"parameter": [],
				"returnType": "",
				"sap:action-for": "",
				"sap:applicable-path": ""
			};
		};
		sinon.stub(MessageBox, "confirm");

		this.oActionUtil.call("test/dummy");
		assert.ok(MessageBox.confirm.calledOnce, "MessageBox.confirm has to be called");

		MessageBox.confirm.restore();
	});

	// TODO think about a reasonable test
	/*
	QUnit.test("test call function with parameter preparation (keys only)", function(assert) {
		var done = assert.async();
		var that = this;
		var sCalledWithFunctionName;
		this.fODataFunctionImport = function () {
			return { parameter: [
				{ name: "Key1" },
				{ name: "Key2" }
			] }
		};

		this.oContextObject = {
			Key1: "Value1",
			Key2: "Value2"
		};

		this.oEntityType = {
			key: {
				propertyRef: [
					{ name: "Key1" },
					{ name: "Key2" },
				]
			}
		}

		var oExpectedParameters = { parameterData: {
			Key1: "Value1",
			Key2: "Value2"
			},
			additionalParameters: [],
		}

		this.oActionUtil.call("test/dummy").then(function(){
			assert.deepEqual(that.oActionUtil._oParameters, oExpectedParameters, "Parameters have to be correct");
			done();
		}, function(){
			assert.ok(false);
			done();
		});
	});

	QUnit.test("test call function with parameter preparation with additional parameters", function(assert) {
		var done = assert.async();
		var that = this;
		var sCalledWithFunctionName;
		this.fODataFunctionImport = function () {
			return { parameter: [
								 { name: "Key1" },
								 { name: "Key2" },
								 { name: "Optional1", type: "Edm.String"},
								 { name: "Optional2", type: "Edm.Boolean"},
								 { name: "Optional3", type: "Edm.Byte"}
								 ] }
			};

			this.oContextObject = {
								   Key1: "Value1",
								   Key2: "Value2"
			};

			this.oEntityType = {
								key: {
									propertyRef: [
												  { name: "Key1" },
													 { name: "Key2" },
													 ]
								}
						}

		sinon.stub(sap.m.Dialog.prototype, "open", function() {that.oActionUtil._call();});
		sinon.stub(this.oController, "handleSuccess");

		var oExpectedParameters = { parameterData: {
			Key1: "Value1",
			Key2: "Value2",
			Optional1 : undefined,
			Optional2 : undefined,
			Optional3 : undefined
			},
			additionalParameters: [
								   { name: "Optional1", type: "Edm.String"},
								   { name: "Optional2", type: "Edm.Boolean"},
								   { name: "Optional3", type: "Edm.Byte"}
								   ],
		}

		this.oActionUtil.call("test/dummy").then(function(){
			assert.ok(sap.m.Dialog.prototype.open.calledOnce, "Dialog open has to be called");
			assert.deepEqual(that.oActionUtil._oParameters, oExpectedParameters, "Parameters have to be correct");

			sap.m.Dialog.prototype.open.restore();
			done();
		}, function(){
			assert.ok(false);
			done();
		})

	});

	// TODO build reasonable test

	QUnit.test("test call function with parameter preparation - non key in context", function(assert) {
		var sCalledWithFunctionName;
		this.fODataFunctionImport = function () {
			return { parameter: [ { name: "Optional1", type: "Edm.String"} ] }
			};

			this.oEntityType = {
								key: {
									propertyRef: [{ name: "Key1" } ]
								}
						}

			this.oContextObject = {
								   Optional1: "Value1"
			};

		sinon.stub(this.oController, "handleSuccess");
		sinon.stub(this.oActionUtil, "_initiateCall");

		this.oActionUtil.call("test/dummy");

		var oExpectedParameters = { parameterData: {
			Optional1 : "Value1"
			},
			additionalParameters: [
								   { name: "Optional1", type: "Edm.String"}
								   ],
		}

		this.oActionUtil.call("test/dummy");
		assert.deepEqual(this.oActionUtil._oParameters, oExpectedParameters, "Parameters have to be correct");
	});
	*/

	QUnit.test("test call function with parameter preparation - keys not available error", function (assert) {
		var done = assert.async();
		this.fODataFunctionImport = function () {
			return { parameter: [{ name: "Key1" }] };
		};

		this.oEntityType = {
			key: {
				propertyRef: [{ name: "Key1" }]
			}
		};
		this.oContextObject = {};

		sinon.stub(this.oController, "handleSuccess");
		sinon.stub(this.oActionUtil, "_initiateCall");

		this.oActionUtil.call("test/dummy").then(function () {
			assert.ok(false);
			done();
		}, function () {
			assert.ok(true, "exception was thrown correctly");
			done();
		});
	});

	QUnit.test("test _getActionParameterData function", function (assert) {
		var oModelData = {
			Param1: "Data1",
			Param2Nullable: undefined,
			Param3NotNullable: undefined,
			Param4NotNullableBool: undefined,
			Param5: "Data5"
		};

		var oModel = { getObject: function () { return oModelData; } };

		var oParam3 = { name: "Param3NotNullable", nullable: "false" };

		this.oActionUtil._oFunctionImport = {
			parameter: [
				{ name: "Param1" },
				{ name: "Param2Nullable", nullable: "true" },
				oParam3,
				{ name: "Param4NotNullableBool", nullable: "false", type: "Edm.Boolean" },
				{ name: "Param5" }
			]
		};

		var oExpected = {
			preparedParameterData: {
				Param1: "Data1",
				Param4NotNullableBool: false,
				Param5: "Data5"
			},
			missingMandatoryParameters: [oParam3]
		};

		var oParamData = this.oActionUtil._getActionParameterData(oModel);
		assert.deepEqual(oParamData, oExpected, "The returned parameters have to be correct");

		oParam3.name = "ThisParameterIsMissing";
		var bException = false;
		try {
			this.oActionUtil._getActionParameterData(oModel);
		} catch (exception) {
			bException = true;
		}

		assert.ok(bException, "A missing parameter should throw an exception.");
	});

	QUnit.test("test _isActionCritical function", function (assert) {
		this.oActionUtil._oFunctionImport = {};
		var bIsCritical = this.oActionUtil._isActionCritical();
		assert.equal(bIsCritical, false, "Action is not critical (no annotation)");

		this.oActionUtil._oFunctionImport = { "com.sap.vocabularies.Common.v1.IsActionCritical": { Bool: "False" } };
		bIsCritical = this.oActionUtil._isActionCritical();
		assert.equal(bIsCritical, false, "Action is not critical (Annotation False)");

		this.oActionUtil._oFunctionImport = { "com.sap.vocabularies.Common.v1.IsActionCritical": { Bool: "" } };
		bIsCritical = this.oActionUtil._isActionCritical();
		assert.equal(bIsCritical, false, "Action is not critical (Annotation '')");

		this.oActionUtil._oFunctionImport = { "com.sap.vocabularies.Common.v1.IsActionCritical": { Bool: " " } };
		bIsCritical = this.oActionUtil._isActionCritical();
		assert.equal(bIsCritical, false, "Action is not critical (Annotation ' ')");

		this.oActionUtil._oFunctionImport = { "com.sap.vocabularies.Common.v1.IsActionCritical": { Bool: 0 } };
		bIsCritical = this.oActionUtil._isActionCritical();
		assert.equal(bIsCritical, false, "Action is not critical (Annotation 0)");

		this.oActionUtil._oFunctionImport = { "com.sap.vocabularies.Common.v1.IsActionCritical": {} };
		bIsCritical = this.oActionUtil._isActionCritical();
		assert.equal(bIsCritical, true, "Action is  critical (Annotation)");

		this.oActionUtil._oFunctionImport = { "com.sap.vocabularies.Common.v1.IsActionCritical": { Bool: "True" } };
		bIsCritical = this.oActionUtil._isActionCritical();
		assert.equal(bIsCritical, true, "Action is  critical (Annotation True)");

		this.oActionUtil._oFunctionImport = { "com.sap.vocabularies.Common.v1.IsActionCritical": { Bool: "X" } };
		bIsCritical = this.oActionUtil._isActionCritical();
		assert.equal(bIsCritical, true, "Action is  critical (Annotation X)");

		this.oActionUtil._oFunctionImport = { "com.sap.vocabularies.Common.v1.IsActionCritical": { Bool: 1 } };
		bIsCritical = this.oActionUtil._isActionCritical();
		assert.equal(bIsCritical, true, "Action is  critical (Annotation 1)");
	});
});
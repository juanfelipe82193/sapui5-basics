/* global QUnit, sinon*/

/*eslint max-nested-callbacks: [2, 5]*/

sap.ui.define([
	"sap/ui/mdc/library",
	"sap/ui/mdc/FilterBar",
	"sap/ui/mdc/FilterBarDelegate",
	"sap/ui/mdc/condition/ConditionModel",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/mdc/FilterField",
	"sap/m/MultiInput",
	'sap/ui/model/json/JSONModel',
	"sap/ui/mdc/p13n/AdaptFiltersPanel",
	"sap/ui/mdc/condition/FilterOperatorUtil"
], function (
	library,
	FilterBar,
	FilterBarDelegate,
	ConditionModel,
	Condition,
	FilterField,
	MultiInput,
	JSONModel,
	AdaptFiltersPanel,
	FilterOperatorUtil
) {
	"use strict";


	var oFilterBar;

	QUnit.module("FilterBar", {
		beforeEach: function () {
			oFilterBar = new FilterBar({
				delegate: { name: "test-resources/sap/ui/mdc/qunit/filterbar/UnitTestMetadataDelegate", payload: { modelName: undefined, collectionName: "test"}}
			});
		},
		afterEach: function () {
			oFilterBar.destroy();
			oFilterBar = undefined;
		}
	});


	QUnit.test("instanciable", function (assert) {
		assert.ok(oFilterBar);
	});

	QUnit.test("getConditionModelName ", function (assert) {
		assert.equal(oFilterBar.getConditionModelName(), FilterBar.CONDITION_MODEL_NAME);
	});

	QUnit.test("get GO button", function (assert) {
		var oButton = oFilterBar._btnSearch;
		assert.ok(oButton);
		assert.ok(oButton.getVisible());

		oFilterBar.setShowGoButton(false);
		assert.ok(!oButton.getVisible());

		oFilterBar.setShowGoButton(true);
		assert.ok(oButton.getVisible());

		oFilterBar.setLiveMode(true);
		assert.ok(!oButton.getVisible());
	});

	QUnit.test("get ADAPT button", function (assert) {
		var oButton = oFilterBar._btnAdapt;
		assert.ok(oButton);
		assert.ok(!oButton.getVisible());

		oFilterBar.setP13nMode(["Value"]);
		assert.ok(!oButton.getVisible());

		oFilterBar.setP13nMode(["Item"]);
		assert.ok(oButton.getVisible());

		oFilterBar.setP13nMode(["Item", "Value"]);
		assert.ok(oButton.getVisible());

		oFilterBar.setShowAdaptFiltersButton(false);
		assert.ok(!oButton.getVisible());
	});


	QUnit.test("check liveMode property", function (assert) {
		var oButton = oFilterBar._btnSearch;
		assert.ok(oButton);

		assert.ok(!oFilterBar.getLiveMode());
		assert.ok(oButton.getVisible());

		oFilterBar.setLiveMode(true);
		assert.ok(oFilterBar.getLiveMode());
		assert.ok(!oButton.getVisible());
	});

	QUnit.test("check p13nMode property", function (assert) {

		assert.ok(!oFilterBar.getP13nMode());
		assert.ok(!oFilterBar._getP13nModeItem());
		assert.ok(!oFilterBar._getP13nModeValue());

		oFilterBar.setP13nMode(["Item", "Value"]);
		assert.ok(oFilterBar.getP13nMode());
		assert.ok(oFilterBar._getP13nModeItem());
		assert.ok(oFilterBar._getP13nModeValue());

		oFilterBar.setP13nMode(["Item"]);
		assert.ok(oFilterBar._getP13nModeItem());
		assert.ok(!oFilterBar._getP13nModeValue());

		oFilterBar.setP13nMode(["Value"]);
		assert.ok(!oFilterBar._getP13nModeItem());
		assert.ok(oFilterBar._getP13nModeValue());
	});

	QUnit.test("add Filter", function (assert) {
		var oFilterField = new FilterField({ conditions: "{cm>/conditions/filter}" });

		assert.equal(oFilterBar.getFilterItems().length, 0);
		assert.equal(oFilterBar._getContent().getContent().length, 0);

		oFilterBar.addFilterItem(oFilterField);
		assert.equal(oFilterBar.getFilterItems().length, 1);
		assert.equal(oFilterBar._getContent().getContent().length, 1);

		oFilterField.destroy();
	});

	QUnit.test("remove Filter", function (assert) {
		var oFilterField = new FilterField();
		oFilterBar.addFilterItem(oFilterField);

		assert.equal(oFilterBar.getFilterItems().length, 1);
		assert.equal(oFilterBar._getContent().getContent().length, 1);

		oFilterBar.removeFilterItem(oFilterField);

		assert.equal(oFilterBar.getFilterItems().length, 0);
		assert.equal(oFilterBar._getContent().getContent().length, 0);

		oFilterField.destroy();

	});

	QUnit.test("check condition model", function (assert) {
		sinon.spy(oFilterBar, "_applyInitialFilterConditions");

		var oModel = oFilterBar.getModel("$filters");
		assert.ok(oModel);
		assert.ok(oModel.isA("sap.ui.mdc.condition.ConditionModel"));

		var done = assert.async();

		assert.ok(oFilterBar._oInitialFiltersAppliedPromise);
		oFilterBar._oInitialFiltersAppliedPromise.then(function () {

			assert.ok(!oFilterBar._applyInitialFilterConditions.called);
			done();
		});
	});

	QUnit.test("check condition model with prefilled conditions", function (assert) {

		var oFB = new FilterBar({
			delegate: {
				name: "test-resources/sap/ui/mdc/qunit/filterbar/UnitTestMetadataDelegate"
			},
			filterConditions: {
				"filter": [{
					operator: "EQ",
					values: ["test"]
				}]
			}
		});

		sinon.spy(oFB, "_applyInitialFilterConditions");

		var done = assert.async();

		assert.ok(oFB._oInitialFiltersAppliedPromise);
		oFB._oInitialFiltersAppliedPromise.then(function () {

			var oModel = oFilterBar.getModel("$filters");
			assert.ok(oModel);
			assert.ok(oModel.isA("sap.ui.mdc.condition.ConditionModel"));

			assert.ok(oFB._applyInitialFilterConditions.called);
			oFB.destroy();
			done();
		});
	});


	QUnit.test("check _handleConditionModelChange with liveMode=false", function (assert) {

		sinon.spy(oFilterBar, "fireSearch");
		sinon.stub(oFilterBar, "_getAssignedFilterNames").returns([]);
		sinon.stub(oFilterBar, "_handleCalculateDifferences");

		var done = assert.async();

		assert.ok(oFilterBar._oConditionChangeBinding);
		if (oFilterBar._oConditionChangeBinding) {
			oFilterBar._oConditionChangeBinding.detachChange(oFilterBar._handleConditionModelChange, oFilterBar);
			sinon.spy(oFilterBar, "_handleConditionModelChange");
			oFilterBar._oConditionChangeBinding.attachChange(oFilterBar._handleConditionModelChange, oFilterBar);
		}

		var fResolve, oPromise = new Promise(function (resolve) {
			fResolve = resolve;
		});

		oFilterBar.attachFiltersChanged(function (oEvent) {
			fResolve();
		});

		assert.ok(!oFilterBar._handleConditionModelChange.called);

		assert.ok(oFilterBar._oInitialFiltersAppliedPromise);
		oFilterBar._oInitialFiltersAppliedPromise.then(function () {

			var oCM = oFilterBar.getModel("$filters");
			oCM.addCondition("fieldPath1", Condition.createCondition("EQ", ["foo"]));

			oPromise.then(function () {
				assert.ok(oFilterBar._handleConditionModelChange.called);
				assert.ok(!oFilterBar.fireSearch.called);

				done();
			});
		});
	});

	QUnit.test("check _handleConditionModelChange  with liveMode=true", function (assert) {

		sinon.spy(oFilterBar, "fireSearch");
		sinon.stub(oFilterBar, "_getAssignedFilterNames").returns([]);
		sinon.stub(oFilterBar, "_handleCalculateDifferences");

		oFilterBar.setLiveMode(true);
		var done = assert.async();


		assert.ok(oFilterBar._oConditionChangeBinding);
		if (oFilterBar._oConditionChangeBinding) {
			oFilterBar._oConditionChangeBinding.detachChange(oFilterBar._handleConditionModelChange, oFilterBar);
			sinon.spy(oFilterBar, "_handleConditionModelChange");
			oFilterBar._oConditionChangeBinding.attachChange(oFilterBar._handleConditionModelChange, oFilterBar);
		}

		var fResolve, oPromise = new Promise(function (resolve) {
			fResolve = resolve;
		});

		oFilterBar.attachFiltersChanged(function (oEvent) {
			fResolve();
		});

		assert.ok(!oFilterBar._handleConditionModelChange.called);

		assert.ok(oFilterBar._oInitialFiltersAppliedPromise);
		oFilterBar._oInitialFiltersAppliedPromise.then(function () {
			var oCM = oFilterBar.getModel("$filters");
			oCM.addCondition("fieldPath1", Condition.createCondition("EQ", ["foo"]));

			oPromise.then(function () {
				assert.ok(oFilterBar._handleConditionModelChange.called);
				assert.ok(oFilterBar.fireSearch.called);

				done();
			});
		});

	});


	QUnit.test("check _getFilterField", function (assert) {
		var oFilterField = new FilterField({ conditions: "{cm>/conditions/filter}" });

		oFilterBar.addFilterItem(oFilterField);

		assert.deepEqual(oFilterBar._getFilterField("filter"), oFilterField);

		oFilterField.destroy();
	});


	QUnit.test("check getAssignedFiltersText", function (assert) {

		sap.ui.getCore().getConfiguration().setLanguage("EN");

		var sText, fResolve, oPromise = new Promise(function (resolve) {
			fResolve = resolve;
		});
		var done = assert.async();

		oFilterBar.attachFiltersChanged(function (oEvent) {
			fResolve();
		});

		sText = oFilterBar.getAssignedFiltersText();
		assert.equal(sText, "Not Filtered");

		assert.ok(!oFilterBar._handleConditionModelChange.called);

		assert.ok(oFilterBar._oInitialFiltersAppliedPromise);
		oFilterBar._oInitialFiltersAppliedPromise.then(function () {

			var oCM = oFilterBar.getModel("$filters");
			oCM.addCondition("fieldPath1", Condition.createCondition("EQ", ["foo"]));

			oPromise.then(function () {

				sText = oFilterBar.getAssignedFiltersText();
				assert.equal(sText, "Filtered By (1): fieldPath1");

				done();
			});
		});
	});

	QUnit.test("check fetchProperties", function (assert) {
		var done = assert.async();

		if (!oFilterBar._oMetadataPromise) {
			oFilterBar._oMetadataPromise = oFilterBar._retrieveMetadata();
		}
		assert.ok(oFilterBar._oMetadataPromise);
		oFilterBar._oMetadataPromise.then(function () {
			assert.ok(oFilterBar._oDelegate);
			sinon.stub(oFilterBar._oDelegate, "fetchProperties").returns(Promise.resolve([{}, {}]));


			oFilterBar._oDelegate.fetchProperties(oFilterBar).then(function (aProperties) {
				assert.ok(aProperties);
				assert.equal(aProperties.length, 2);

				oFilterBar._oDelegate.fetchProperties.restore();
				done();
			});
		});
	});

	QUnit.test("check delegate", function (assert) {

		var done = assert.async();

		sinon.spy(oFilterBar, "_loadProvider");

		assert.ok(!oFilterBar._loadProvider.called);

		if (!oFilterBar._oMetadataPromise) {
			oFilterBar._oMetadataPromise = oFilterBar._retrieveMetadata();
		}
		assert.ok(oFilterBar._oMetadataPromise);
		oFilterBar._oMetadataPromise.then(function () {
			assert.ok(oFilterBar._loadProvider.called);
			assert.ok(oFilterBar.getDelegate());
			assert.equal(oFilterBar.getDelegate().name, "test-resources/sap/ui/mdc/qunit/filterbar/UnitTestMetadataDelegate");
			done();
		});
	});



	QUnit.test("check _getNonHiddenPropertyByName ", function (assert) {
		var oProperty1 = {
			name: "key1",
			type: "Edm.String",
			visible: true
		};

		var oProperty2 = {
			name: "key2",
			hiddenFilter: true,
			visible: true
		};

		sinon.stub(oFilterBar, "getPropertyInfoSet").returns([oProperty1, oProperty2]);

		assert.ok(oFilterBar._getNonHiddenPropertyByName("key1"));
		assert.ok(!oFilterBar._getNonHiddenPropertyByName("key2"));

	});

	QUnit.test("check setBasicSearchField", function (assert) {

		var oBasicSearchField = new FilterField({ conditions: "{cm>/conditions/$search}" });
		oFilterBar.setBasicSearchField(oBasicSearchField);
		assert.equal(oFilterBar.getFilterItems().length, 0);
		assert.equal(oFilterBar._getContent().getContent().length, 1);

		oFilterBar.setBasicSearchField(null);
		assert.equal(oFilterBar.getFilterItems().length, 0);
		assert.equal(oFilterBar._getContent().getContent().length, 0);

		oBasicSearchField.destroy();
	});

	QUnit.test("check _getFilterItemLayout", function (assert) {
		var oFilterField = new FilterField();
		oFilterBar.addFilterItem(oFilterField);

		var oFilterItemLayout = oFilterBar._getFilterItemLayout(oFilterField);
		assert.ok(oFilterItemLayout);

		oFilterField.destroy();
	});


	QUnit.test("check _storeChanges", function (assert) {

		sinon.stub(sap.ui.fl.write.api.ControlPersonalizationWriteAPI, "add");
		sinon.stub(sap.ui.fl.apply.api.FlexRuntimeInfoAPI, "hasVariantManagement").returns(true);
		sinon.spy(oFilterBar, "_clearChanges");

		oFilterBar._storeChanges();
		assert.ok(!sap.ui.fl.write.api.ControlPersonalizationWriteAPI.add.called);
		assert.ok(oFilterBar._clearChanges.calledOnce);

		oFilterBar.setP13nMode(["Item"]);
		oFilterBar._storeChanges();
		assert.ok(!sap.ui.fl.write.api.ControlPersonalizationWriteAPI.add.called);
		assert.ok(oFilterBar._clearChanges.calledOnce);

		oFilterBar._aChanges.push({ changeType: "foo" });
		oFilterBar._storeChanges();
		assert.ok(sap.ui.fl.write.api.ControlPersonalizationWriteAPI.add.called);
		assert.ok(oFilterBar._clearChanges.calledTwice);

		sap.ui.fl.write.api.ControlPersonalizationWriteAPI.add.restore();
		sap.ui.fl.apply.api.FlexRuntimeInfoAPI.hasVariantManagement.restore();
	});

	QUnit.test("create single valued change", function (assert) {

		var oProperty = {
			name: "key",
			type: "Edm.String",
			visible: true
		};

		var done = assert.async();

		sinon.stub(oFilterBar, "_storeChanges");
		sinon.stub(oFilterBar, "getPropertyInfoSet").returns([oProperty]);

		oFilterBar.setP13nMode(["Value"]);

		if (!oFilterBar._oMetadataPromise) {
			oFilterBar._oMetadataPromise = oFilterBar._retrieveMetadata();
		}
		assert.ok(oFilterBar._oMetadataPromise);
		oFilterBar._oMetadataPromise.then(function () {

			assert.ok(oFilterBar._oDelegate);
			sinon.stub(oFilterBar._oDelegate, "fetchProperties").returns(Promise.resolve([oProperty]));

			var oPromise = oFilterBar._oDelegate.beforeAddFilterFlex(oProperty.name, oFilterBar);

			oPromise.then(function (oFilterField) {
				oFilterBar._getConditionModel().addCondition("key", Condition.createCondition("EQ", ["a"]));
				oFilterBar._getConditionModel().addCondition("key", Condition.createCondition("EQ", ["foo"]));

				setTimeout(function () { // required for condition model....
					assert.ok(oFilterBar._storeChanges.called);

					assert.ok(oFilterBar._aChanges);
					assert.equal(oFilterBar._aChanges.length, 2); // condition model does not know about filterExpression="Single"...

					oFilterBar._oDelegate.fetchProperties.restore();

					done();
				}, 0);
			});
		});
	});

	QUnit.test("create multi valued change", function (assert) {

		var oProperty = {
			name: "key",
			type: "Edm.String",
			filterExpression: "MultiValue",
			visible: true
		};

		var done = assert.async();

		sinon.stub(oFilterBar, "_storeChanges");
		sinon.stub(oFilterBar, "getPropertyInfoSet").returns([oProperty]);

		oFilterBar.setP13nMode(["Value"]);

		if (!oFilterBar._oMetadataPromise) {
			oFilterBar._oMetadataPromise = oFilterBar._retrieveMetadata();
		}
		assert.ok(oFilterBar._oMetadataPromise);
		oFilterBar._oMetadataPromise.then(function () {

			assert.ok(oFilterBar._oDelegate);
			sinon.stub(oFilterBar._oDelegate, "fetchProperties").returns(Promise.resolve([oProperty]));

			var oPromise = oFilterBar._oDelegate.beforeAddFilterFlex(oProperty.name, oFilterBar);

			oPromise.then(function (oFilterField) {

				oFilterBar._getConditionModel().addCondition("key", Condition.createCondition("EQ", ["a"]));
				oFilterBar._getConditionModel().addCondition("key", Condition.createCondition("EQ", ["foo"]));

				setTimeout(function () { // required for condition model....
					assert.ok(oFilterBar._storeChanges.called);

					assert.ok(oFilterBar._aChanges);
					assert.equal(oFilterBar._aChanges.length, 2);

					oFilterBar._oDelegate.fetchProperties.restore();

					done();
				}, 0);
			});
		});
	});

	QUnit.test("create multi valued change with 'filterConditions'", function (assert) {
		var oProperty = {
			name: "key",
			type: "Edm.String",
			filterExpression: "MultiValue",
			visible: true
		};

		var done = assert.async();

		var oCondition1 = Condition.createCondition("EQ", ["a"]);
		var oCondition2 = Condition.createCondition("EQ", ["foo"]);

		var oFB = new FilterBar({ filterConditions: { key: [oCondition1] }, p13nMode: ["Value"] });

		sinon.stub(oFB, "_storeChanges");
		sinon.stub(oFB, "getPropertyInfoSet").returns([oProperty]);

		oFB._oInitialFiltersAppliedPromise.then(function () {

			oFB._getConditionModel().addCondition("key", oCondition1);
			oFB._getConditionModel().addCondition("key", oCondition2);

			setTimeout(function () { // required for condition model....
				assert.ok(oFB._storeChanges.called);

				assert.ok(oFB._aChanges);
				assert.equal(oFB._aChanges.length, 1);
				assert.equal(oFB._aChanges[0].selectorElement, oFB);
				assert.equal(oFB._aChanges[0].changeSpecificData.changeType, "addCondition");
				assert.equal(oFB._aChanges[0].changeSpecificData.content.name, "key");
				assert.deepEqual(oFB._aChanges[0].changeSpecificData.content.condition, { operator: "EQ", values: ["foo"] });

				oFB.destroy();

				done();
			}, 0);
		});
	});


	QUnit.test("check filterItems observer", function (assert) {

		var oProperty1 = {
			name: "key1",
			label: "label 1",
			type: "Edm.String",
			constraints: { maxLength: 40 },
			visible: true,
			filterExpression: "SingleValue"
		};
		var oProperty2 = {
			name: "key2",
			label: "label 2",
			type: "Edm.String",
			constraints: { maxLength: 40 },
			visible: true,
			filterExpression: "SingleValue"
		};

		var aPromise = [];

		var done = assert.async();

		sinon.stub(oFilterBar, "getPropertyInfoSet").returns([oProperty1, oProperty2]);
		sinon.spy(oFilterBar, "_applyFilterItemInserted");
		sinon.spy(oFilterBar, "_applyFilterItemRemoved");

		if (!oFilterBar._oMetadataPromise) {
			oFilterBar._oMetadataPromise = oFilterBar._retrieveMetadata();
		}
		assert.ok(oFilterBar._oMetadataPromise);
		oFilterBar._oMetadataPromise.then(function () {
			assert.ok(oFilterBar._oDelegate);
			sinon.stub(oFilterBar._oDelegate, "fetchProperties").returns(Promise.resolve([oProperty1, oProperty2]));

			aPromise.push(oFilterBar._oDelegate.beforeAddFilterFlex(oProperty1.name, oFilterBar));
			aPromise.push(oFilterBar._oDelegate.beforeAddFilterFlex(oProperty2.name, oFilterBar));

			Promise.all(aPromise).then(function (aFilterFields) {

				oFilterBar.addFilterItem(aFilterFields[0]);
				oFilterBar.addFilterItem(aFilterFields[1]);

				oFilterBar.removeAggregation("filterItems", aFilterFields[0]);

				assert.ok(oFilterBar._applyFilterItemInserted.calledTwice);
				assert.ok(oFilterBar._applyFilterItemRemoved.calledOnce);

				oFilterBar._oDelegate.fetchProperties.restore();

				done();
			});
		});
	});


	QUnit.test("check _determineType", function (assert) {
		var oProperty1 = {
			name: "key1",
			type: "Edm.String",
			constraints: { maxLength: 40 },
			filterExpression: "SingleValue"
		};
		var oProperty2 = {
			name: "key2",
			type: "Edm.String",
			filterExpression: "SingleValue"
		};
		var oProperty3 = {
			name: "key3",
			label: "label",
			type: "Edm.String",
			filterExpression: "MultiValue"
		};

		var aPromise = [];
		var done = assert.async();

		sinon.stub(oFilterBar, "getPropertyInfoSet").returns([oProperty1, oProperty2, oProperty3]);

		if (!oFilterBar._oMetadataPromise) {
			oFilterBar._oMetadataPromise = oFilterBar._retrieveMetadata();
		}
		assert.ok(oFilterBar._oMetadataPromise);
		oFilterBar._oMetadataPromise.then(function () {
			assert.ok(oFilterBar._oDelegate);
			sinon.stub(oFilterBar._oDelegate, "fetchProperties").returns(Promise.resolve([oProperty1, oProperty2, oProperty3]));

			aPromise.push(oFilterBar._oDelegate.beforeAddFilterFlex(oProperty1.name, oFilterBar));
			aPromise.push(oFilterBar._oDelegate.beforeAddFilterFlex(oProperty2.name, oFilterBar));
			aPromise.push(oFilterBar._oDelegate.beforeAddFilterFlex(oProperty3.name, oFilterBar));

			Promise.all(aPromise).then(function (aFilterFields) {

				oFilterBar.addFilterItem(aFilterFields[2]);

				oFilterBar.removeAggregation("filterItems", aFilterFields[0]);
				var oObj = oFilterBar._determineType("key3");
				assert.ok(oObj);
				assert.ok(oObj.isA("sap.ui.mdc.FilterField"));

				oObj = oFilterBar._determineType("key1");
				assert.ok(oObj);

				oFilterBar._oDelegate.fetchProperties.restore();

				done();
			});
		});
	});

	QUnit.test("check applyConditionsAfterChangesApplied", function (assert) {

		var fResolve;
		var oPromise = new Promise(function (resolve) {
			fResolve = resolve;
		});
		sinon.stub(sap.ui.fl.apply.api.FlexRuntimeInfoAPI, "waitForChanges").returns(oPromise);

		assert.ok(!oFilterBar._isChangeApplying());
		oFilterBar.applyConditionsAfterChangesApplied();
		assert.ok(oFilterBar._isChangeApplying());

		oFilterBar.applyConditionsAfterChangesApplied();


		var done = assert.async();

		oFilterBar.waitForInitialFiltersApplied().then(function () {
			fResolve();
			oPromise.then(function () {
				sinon.spy(oFilterBar, "_createShadowModel");

				setTimeout(function () { // required for condition model....
					sap.ui.fl.apply.api.FlexRuntimeInfoAPI.waitForChanges.restore();
					assert.ok(oFilterBar._createShadowModel.calledOnce);
					done();
				}, 20);
			});
		});
	});

	QUnit.test("check properties based on filterItems", function (assert) {
		var oProperty1 = {
			name: "key1",
			type: "Edm.String",
			constraints: { maxLength: 40 },
			filterExpression: "SingleValue"
		};
		var oProperty2 = {
			name: "key3",
			label: "label",
			type: "Edm.String",
			filterExpression: "MultiValue"
		};

		var oDelegate = {
			fetchProperties: function () { return Promise.resolve([oProperty1, oProperty2]); }
		};

		var oMyModel = new JSONModel();

		sinon.stub(sap.ui.mdc.FilterBar.prototype, "_loadProvider").returns(Promise.resolve(oDelegate));
		var oFB = new FilterBar({
			delegate: {
				name: "test",
				payload: {
					modelName: "Model",
					collectionName: "Collection"
				}
			}
		});

		var done = assert.async();

		oFB.setModel(oMyModel, "Model");

		if (!oFB._oMetadataPromise) {
			oFB._oMetadataPromise = oFB._retrieveMetadata();
		}
		assert.ok(oFB._oMetadataAppliedPromise);
		oFB._oMetadataAppliedPromise.then(function () {
			var aPropeties = oFB.getPropertyInfoSet();
			assert.ok(aPropeties);
			assert.equal(aPropeties.length, 2);

			sap.ui.mdc.FilterBar.prototype._loadProvider.restore();
			oFB.destroy();
			done();
		});
	});

	QUnit.test("check getFilters", function (assert) {
		var mCondition = { "fieldPath1": [Condition.createCondition("EQ", ["foo"])] };

		oFilterBar.setConditions(mCondition);

		var oFilters = oFilterBar.getFilters();
		assert.ok(oFilters);
		assert.equal(oFilters.sOperator, "EQ");
		assert.equal(oFilters.oValue1, "foo");

	});

	QUnit.test("check getSearch", function (assert) {
		assert.strictEqual(oFilterBar.getSearch(), "", "No search text initially");

		oFilterBar.setConditions({"$search": [{values: ["foo"]}]}); // simulate typed in text on basic search

		assert.strictEqual(oFilterBar.getSearch(), "foo", "Search text returned from CM");

		oFilterBar.setConditions({"$search": []}); // simulate clear on basic search

		assert.strictEqual(oFilterBar.getSearch(), "", "No search text present in CM");
	});

	QUnit.test("check _suspend/_resume binding", function (assert) {
		var oProperty1 = {
			name: "key1",
			type: "Edm.String",
			constraints: { maxLength: 40 },
			filterExpression: "SingleValue"
		};
		var oProperty2 = {
			name: "key3",
			label: "label",
			type: "Edm.String",
			filterExpression: "MultiValue"
		};

		sinon.stub(oFilterBar, "getPropertyInfoSet").returns([oProperty1, oProperty2]);

		var aPromise = [];
		var done = assert.async();

		if (!oFilterBar._oMetadataPromise) {
			oFilterBar._oMetadataPromise = oFilterBar._retrieveMetadata();
		}
		assert.ok(oFilterBar._oMetadataPromise);
		oFilterBar._oMetadataPromise.then(function () {
			assert.ok(oFilterBar._oDelegate);
			sinon.stub(oFilterBar._oDelegate, "fetchProperties").returns(Promise.resolve([oProperty1, oProperty2]));

			aPromise.push(oFilterBar._oDelegate.beforeAddFilterFlex(oProperty1.name, oFilterBar));
			aPromise.push(oFilterBar._oDelegate.beforeAddFilterFlex(oProperty2.name, oFilterBar));

			Promise.all(aPromise).then(function (aFilterFields) {

				oFilterBar.addFilterItem(aFilterFields[0]);

				oFilterBar._suspendBinding(aFilterFields[0]);
				assert.ok(oFilterBar._aBindings);
				assert.equal(oFilterBar._aBindings.length, 1);

				var oBinding = aFilterFields[0].getBinding("conditions");
				assert.ok(oBinding);
				assert.ok(oBinding.bSuspended);

				oBinding = aFilterFields[1].getBinding("conditions");
				assert.ok(oBinding);
				assert.ok(!oBinding.bSuspended);


				oFilterBar._resumeBindings();
				assert.ok(!oFilterBar._aBindings);

				oBinding = aFilterFields[0].getBinding("conditions");
				assert.ok(oBinding);
				assert.ok(!oBinding.bSuspended);

				oFilterBar._oDelegate.fetchProperties.restore();

				done();
			});
		});
	});

	QUnit.test("prepare the AdaptFiltersDialog", function(assert){

		var done = assert.async();

		var oProperty1 = {
			name: "field1",
			label:"A",
			type: "Edm.String",
			constraints: { maxLength: 40 },
			filterExpression: "SingleValue"
		};
		var oProperty2 = {
			name: "field2",
			label: "B",
			type: "Edm.String",
			filterExpression: "MultiValue"
		};
		var oProperty3 = {
			name: "field3",
			label: "C",
			type: "Edm.String",
			filterExpression: "MultiValue"
		};

		if (!oFilterBar._oMetadataPromise) {
			oFilterBar._oMetadataPromise = oFilterBar._retrieveMetadata();
		}
		assert.ok(oFilterBar._oMetadataPromise);
		oFilterBar._oMetadataPromise.then(function () {
			sinon.stub(oFilterBar, "getPropertyInfoSet").returns([oProperty1, oProperty2, oProperty3]);
			sinon.stub(oFilterBar._oDelegate, "fetchProperties").returns(Promise.resolve([oProperty1, oProperty2, oProperty3]));

			oFilterBar.prepareAndShowDialog().then(function(oAdaptFiltersPanel){
				assert.ok(oAdaptFiltersPanel, "panel has been created");
				var aPanelItems = oAdaptFiltersPanel.getModel().getProperty("/items");
				assert.equal(aPanelItems.length, 3, "correct amount of p13n items has been created by FilterBar");
				assert.equal(aPanelItems[0].name, "field1", "correct field created in panel");
				assert.equal(aPanelItems[0].label, "A", "correct label for field created in panel");
				assert.equal(aPanelItems[1].name, "field2", "correct field created in panel");
				assert.equal(aPanelItems[1].label, "B", "correct label for field created in panel");
				assert.equal(aPanelItems[2].name, "field3", "correct field created in panel");
				assert.equal(aPanelItems[2].label, "C", "correct label for field created in panel");

				oFilterBar._oDelegate.fetchProperties.restore();

				done();
			});
		});
	});

	QUnit.test("check filter operators", function (assert) {

		var oProperty1 = {
			name: "key1",
			type: "sap.ui.model.odata.type.String",
			filterOperators: ["EQ", "StartsWith"],
			visible: true
		};
		var oProperty2 = {
			name: "key2",
			type: "sap.ui.model.odata.type.String",
			visible: true
		};

		var done = assert.async();

		sinon.stub(oFilterBar, "getPropertyInfoSet").returns([oProperty1, oProperty2]);

		if (!oFilterBar._oMetadataPromise) {
			oFilterBar._oMetadataPromise = oFilterBar._retrieveMetadata();
		}
		oFilterBar._oMetadataPromise.then(function () {
			var aPromises = [];

			assert.ok(oFilterBar._oDelegate);
			sinon.stub(oFilterBar._oDelegate, "fetchProperties").returns(Promise.resolve([oProperty1, oProperty2]));

			aPromises.push(oFilterBar._oDelegate.beforeAddFilterFlex(oProperty1.name, oFilterBar));
			aPromises.push(oFilterBar._oDelegate.beforeAddFilterFlex(oProperty2.name, oFilterBar));

			Promise.all(aPromises).then(function (aFilterFields) {

				assert.ok(aFilterFields[0]);
				var aOp1 = aFilterFields[0].getOperators();
				assert.ok(aOp1);
				assert.deepEqual(oProperty1.filterOperators, aOp1);
				assert.deepEqual(oProperty1.filterOperators, aFilterFields[0]._getOperators());

				assert.ok(aFilterFields[1]);
//				var aOp2 = aFilterFields[1].getOperators();
//				assert.ok(aOp2);
//				assert.deepEqual(aOp2, FilterOperatorUtil.getOperatorsForType("String"));

				oFilterBar._oDelegate.fetchProperties.restore();

				done();
			});
		});
	});
});

/*global QUnit */
sap.ui.define([
	"sap/ui/generic/app/navigation/service/PresentationVariant",
	"sap/ui/generic/app/navigation/service/NavError"
], function(PresentationVariant, NavError) {
	"use strict";

	/**
	 * tests for the sap.ui.generic.app.navigation.service.PresentationVariant class
	 */
	QUnit.module("nav.PresentationVariant", {
		beforeEach: function() {
			this._oPresentVar = new PresentationVariant();
		},
		afterEach: function() {
		}
	});

	QUnit.test("getID: identity with parameter at constructor", function(assert) {
		this._oPresentVar.setID("test-id_1234");

		assert.equal(this._oPresentVar.getID(), "test-id_1234", "reading back id needs to provide the same value as when constructed");
	});

	QUnit.test("get/setText: identity when reading/writing text", function(assert) {
		this._oPresentVar.setID("test-id_1234");

		this._oPresentVar.setText("myTextWhichShallBeUsedForQunitTesting");
		assert.equal(this._oPresentVar.getText(), "myTextWhichShallBeUsedForQunitTesting", "reading back text needs to provide the same value as when set");
	});

	QUnit.test("get/setContextUrl: identity when reading/writing", function(assert) {
		this._oPresentVar.setID("test-id_1234");

		this._oPresentVar.setContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters");
		assert.equal(this._oPresentVar.getContextUrl(), "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters", "reading back Parameter Context URL needs to provide the same value as when set");
	});

	QUnit.test("checking add/getProperties", function(assert) {
		this._oPresentVar.setID("test-id_1234");

		var mProps = {
			a: "A",
			b: "B",
			c: "C"
		};

		this._oPresentVar.setProperties(mProps);
		assert.deepEqual(this._oPresentVar.getProperties(), mProps);
	});

	QUnit.test("checking add/getTableVisualization", function(assert) {
		this._oPresentVar.setID("test-id_1234");

		var mProps = {
			t_a: "A",
			t_b: "B",
			t_c: "C"
		};

		this._oPresentVar.setTableVisualization(mProps);

		assert.deepEqual(this._oPresentVar.getTableVisualization(), mProps);
	});

	QUnit.test("checking add/getChartVisualization", function(assert) {
		this._oPresentVar.setID("test-id_1234");

		var mProps = {
			Type: "Chart",
			c_a: "A",
			c_b: "B",
			c_c: "C"
		};

		this._oPresentVar.setChartVisualization(mProps);

		assert.deepEqual(this._oPresentVar.getChartVisualization(), mProps);
	});

	QUnit.test("toJSONString/toJSONObject: Simple Serialization", function(assert) {

		var mProps = {
			Version: {
				Major: "1",
				Minor: "0",
				Patch: "0"
			},
			PresentationVariantID: "test-id_1234-toJSONString",
			ContextUrl: "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult",
			Text: "test text for toJSONString check",
			a: "A",
			b: "B",
			c: "C",
			Visualizations: [
				{
					t_a: "A",
					t_b: "B",
					t_c: "C"
				}, {
					Type: "Chart",
					c_a: "A",
					c_b: "B",
					c_c: "C"
				}
			]
		};

		this._oPresentVar.setID(mProps.PresentationVariantID);
		this._oPresentVar.setText(mProps.Text);
		this._oPresentVar.setContextUrl(mProps.ContextUrl);

		this._oPresentVar.setProperties({
			a: "A",
			b: "B",
			c: "C"
		});

		this._oPresentVar.setTableVisualization(mProps.Visualizations[0]);
		this._oPresentVar.setChartVisualization(mProps.Visualizations[1]);

		var sJson = this._oPresentVar.toJSONString();

		assert.deepEqual(sJson, JSON.stringify(mProps));

	});

	QUnit.test("parseFromString: Simple Deserialization", function(assert) {
		// expected:
		var mProps = {
			Version: {
				Major: "1",
				Minor: "0",
				Patch: "0"
			},
			PresentationVariantID: "test-id_1234-toJSONString",
			ContextUrl: "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult",
			Text: "test text for toJSONString check",
			a: "A",
			b: "B",
			c: "C",
			Visualizations: [
				{
					t_a: "A",
					t_b: "B",
					t_c: "C"
				}, {
					Type: "Chart",
					c_a: "A",
					c_b: "B",
					c_c: "C"
				}
			]
		};

		this._oPresentVar.setID(mProps.PresentationVariantID);
		this._oPresentVar.setText(mProps.Text);
		this._oPresentVar.setContextUrl(mProps.ContextUrl);

		this._oPresentVar.setProperties({
			a: "A",
			b: "B",
			c: "C"
		});

		this._oPresentVar.setTableVisualization(mProps.Visualizations[0]);
		this._oPresentVar.setChartVisualization(mProps.Visualizations[1]);

		var effectiveString = "{\"Version\":{\"Major\":\"1\",\"Minor\":\"0\",\"Patch\":\"0\"},\"PresentationVariantID\":\"test-id_1234-toJSONString\",\"ContextUrl\":\"/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult\",\"Text\":\"test text for toJSONString check\",\"a\":\"A\",\"b\":\"B\",\"c\":\"C\",\"Visualizations\":[{\"t_a\":\"A\",\"t_b\":\"B\",\"t_c\":\"C\"},{\"Type\":\"Chart\",\"c_a\":\"A\",\"c_b\":\"B\",\"c_c\":\"C\"}]}";
		var effective = new PresentationVariant(effectiveString);

		assert.deepEqual(effective.toJSONString(), this._oPresentVar.toJSONString(), "Deserialization result needs to be as expected");
	});
});
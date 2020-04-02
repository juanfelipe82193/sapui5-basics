/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfield/BindingUtil",
	"sap/ui/base/BindingParser"
], function(BindingUtil, BindingParser) {
	"use strict";

	QUnit.module("sap.ui.comp.smartfield.BindingUtil", {
		beforeEach: function() {
			this.oBindingUtil = new BindingUtil();
		},
		afterEach: function() {
			this.oBindingUtil.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oBindingUtil);
	});

	QUnit.test("toBinding - expression with model and path", function(assert) {
		var oResult = this.oBindingUtil.toBindingPath({
			parts : [{
				path : "Services/results"
			}],
			model : "json"
		});
		assert.equal(oResult, "json>Services/results");


		oResult = this.oBindingUtil.toBindingPath();
		assert.equal(!oResult, true);
	});

	QUnit.test("toBinding - expression with model and path", function(assert) {
		var oResult = this.oBindingUtil.toBindingPath({
			path : "Services/results",
			model : "json"
		});
		assert.equal(oResult, "json>Services/results");


		oResult = this.oBindingUtil.toBindingPath();
		assert.equal(!oResult, true);
	});

	QUnit.test("getBindingParts - expression with model and path", function(assert) {
		var aParts = [], oInfo = {
			length: 0
		};

		this.oBindingUtil.getBindingParts({
			parts : [{
				path : "Services/results",
				model: "json"
			}]
		}, aParts, oInfo);
		assert.equal(aParts[0], "json>Services/results");
		assert.equal(oInfo.length, 1);
	});

	QUnit.test("fromFormatter", function(assert) {
		var oResult, aTotal = [];

		 oResult = this.oBindingUtil.fromFormatter("model", {
			path: function() {
				return [ "p1", "p2" ];
			},
			formatter: function() {
				return "result";
			}
		}, aTotal);
		assert.equal(oResult.model, "model");
		assert.equal(oResult.parts.length, 2);
		assert.equal(oResult.formatter(), "result");
		assert.equal(aTotal.length, 2);

		 oResult = this.oBindingUtil.fromFormatter("model", {
				path: function() {
					return [];
				},
				formatter: function() {
					return "result";
				}
			}, aTotal);
			assert.equal(oResult.model, "model");
			assert.equal(oResult.path, "");
			assert.equal(!oResult.parts, true);
			assert.equal(oResult.formatter(), "result");
			assert.equal(aTotal.length, 2);
	});

	QUnit.test("ODataHelper.correctPath with simple key", function(assert) {
		var sEntity = this.oBindingUtil.correctPath("/Project(71)");
		assert.equal(sEntity, "Project");
	});

	QUnit.test("ODataHelper.correctPath without key", function(assert) {
		var sEntity = this.oBindingUtil.correctPath("/Project");
		assert.equal(sEntity, "Project");
	});

	QUnit.test("ODataHelper.correctPath with complex key", function(assert) {
		var sEntity = this.oBindingUtil.correctPath("/Project(id1='71' id2='abcd')");
		assert.equal(sEntity, "Project");
	});

	// BCP 1780059581
	QUnit.test("ODataHelper.correctPath with complex key", function(assert) {
		var sEntity = this.oBindingUtil.correctPath("/SEPMRA_C_SalesOrderTP(SalesOrder='',DraftUUID=guid'00505691-115b-1ee7-97f9-87693aee1acb',IsActiveEntity=false)/to_OverallStatus");
		assert.strictEqual(sEntity, "SEPMRA_C_SalesOrderTP");
	});

	QUnit.test("getNavigationProperties", function(assert) {
		var mResult, oParent = {
			getBindingContext : function() {
				return {
					sPath : "/Project(1)"
				};
			},
			getObjectBinding : function() {
				return { sPath : "Tasks" };
			}
		};

		mResult = this.oBindingUtil.getNavigationProperties(oParent);
		assert.equal(mResult.paths.length, 3);

		oParent = {
			getBindingContext : function() {
				return null;
			},
			getObjectBinding : function() {
				return { sPath : "Tasks" };
			}
		};
		mResult = this.oBindingUtil.getNavigationProperties(oParent);
		assert.equal(mResult.paths.length, 1);

		oParent = {
			getBindingContext : function() {
				return null;
			},
			getObjectBinding : function() {
				return null;
			}
		};
		mResult = this.oBindingUtil.getNavigationProperties(oParent);
		assert.equal(mResult.paths.length, 0);
	});

	QUnit.test("Check executeODataBindingExpression with stubbed complexParser to null", function(assert) {

		var oApplyFunction = {
				"Apply": {
					"Name": "odata.fillUriTemplate",
					"Parameters": [{"Type": "String", "Value": "#test?param={ID1}"},
					               {"Name": "ID1", "Type": "LabeledElement", "Value": {"Path": "hugo"}}]
				}
		};
		var oBindingContext = {
				getProperty : function(s, s1) { return "value"; },
				getPath : function() { return ""; },
				getModel: function() { return null; }
		};

		sinon.stub(BindingParser, "complexParser").returns(null);

		var sResult = this.oBindingUtil.executeODataBindingExpression(oApplyFunction, oBindingContext);
		assert.equal(sResult, "{=odata.fillUriTemplate('#test?param={ID1}',{'ID1':${hugo}})}");

		BindingParser.complexParser.restore();
	});


	QUnit.test("Check executeODataBindingExpression with Apply Function fillUriTemplate", function(assert) {

		var oApplyFunction = {
				"Apply": {
					"Name": "odata.fillUriTemplate",
					"Parameters": [{"Type": "String", "Value": "#test?param={ID1}"},
					               {"Name": "ID1", "Type": "LabeledElement", "Value": {"Path": "hugo"}}]
				}
		};
		var oBindingContext = {
				getProperty : function(s, s1) { return "value"; },
				getPath : function() { return ""; },
				getModel: function() { return null; }
		};

	    var sResult = this.oBindingUtil.executeODataBindingExpression(oApplyFunction, oBindingContext);
	    assert.equal(sResult, "#test?param=value");
	});

	QUnit.test("Check executeODataBindingExpression with Path expression", function(assert) {

		var oApplyFunction = {
				"Path": "Name"
		};
		var oBindingContext = {
				getProperty : function(s, s1) { return "www.sap.com"; },
				getPath : function() { return ""; },
				getModel: function() { return null; }
		};

	    var sResult = this.oBindingUtil.executeODataBindingExpression(oApplyFunction, oBindingContext);
	    assert.equal(sResult, "www.sap.com");
	});

	QUnit.test("Check executeODataBindingExpression with Apply Function concat", function(assert) {

		var oApplyFunction = {
				"Apply": {
					"Name": "odata.concat",
					"Parameters": [{"Type": "String", "Value": "Test ("},
					               {"Type": "Path", "Value": "hugo"},
					               {"Type": "String", "Value": ")"}]
				}
		};
		var oBindingContext = {
				getProperty : function(s, s1) { return "value"; },
				getPath : function() { return ""; },
				getModel: function() { return null; }
		};

	    var sResult = this.oBindingUtil.executeODataBindingExpression(oApplyFunction, oBindingContext);
	    assert.equal(sResult, "Test (value)");
	});

	QUnit.test("Shall be destructible", function(assert) {
		this.oBindingUtil.destroy();
		assert.ok(this.oBindingUtil);
		assert.equal(this.oBindingUtil._oModel, null);
	});

	QUnit.start();

});
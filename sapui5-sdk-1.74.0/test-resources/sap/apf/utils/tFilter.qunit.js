/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery, sinon */
sap.ui.define("sap/apf/utils/tFilter", [
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/utils/filter",
	"sap/apf/core/utils/filter",
	"sap/apf/core/constants",
	"sap/ui/model/FilterOperator"
], function(DoubleMessageHandler, UtilsFilter, Filter, constants, FilterOperator){
	'use strict';
	function commonSetupUtilsFilter(oContext) {
		var oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
		oContext.oMsgHandler = oMsgHandler;
		oContext.oFilter = new UtilsFilter(oMsgHandler);
		jQuery.extend(oContext, oContext.oFilter.getOperators());
	}
	function createFilterUtilsFilter(oContext) {
		var oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
		oContext.oMsgHandler = oMsgHandler;
		oContext.oFilter = new UtilsFilter(oMsgHandler);
		jQuery.extend(oContext, oContext.oFilter.getOperators());
		var oTopAndExpression1 = {
			name : "topAndExpression1",
			operator : oContext.EQ,
			value : "topAndExpression1Value"
		};
		var oTopAndExpression2 = {
			name : "topAndExpression2",
			operator : oContext.EQ,
			value : "topAndExpression2Value"
		};
		var oOrExpression = {
			id : "orExpression1",
			name : "orExpression",
			operator : oContext.EQ,
			value : "orExpressionValue"
		};
		var oAnd1Expression1 = {
			name : "and1Expression1",
			operator : oContext.EQ,
			value : "and1Expression1Value"
		};
		var oAnd1Expression2 = {
			name : "and1Expression2",
			operator : oContext.EQ,
			value : "and1Expression2Value"
		};
		var oAnd2Expression1 = {
			name : "and2Expression1",
			operator : oContext.EQ,
			value : "and2Expression1Value"
		};
		var oAnd2Expression2 = {
			name : "and2Expression2",
			operator : oContext.EQ,
			value : "and2Expression2Value"
		};
		oContext.oFilter.getTopAnd().addExpression(oTopAndExpression1).addExpression(oTopAndExpression2);
		oContext.oFilter.getTopAnd().addOr("orId1").addExpression(oOrExpression);
		oContext.oFilter.getById("orId1").addAnd("andId1").addExpression(oAnd1Expression1).addExpression(oAnd1Expression2);
		oContext.oFilter.getById("orId1").addAnd("andId2").addExpression(oAnd2Expression1).addExpression(oAnd2Expression2);
		return oContext.oFilter;
	}
	QUnit.module("Initialization", {
		beforeEach : function(assert) {
			commonSetupUtilsFilter(this);
		},
		afterEach : function(assert) {
			return undefined;
		}
	});
	QUnit.test("Filter object", function(assert) {
		assert.ok(this.oFilter.type === "filter", "Filter has type 'filter'");
		assert.ok(this.oFilter.getTopAnd(), "Filter is initialized with AND");
		assert.ok(this.oFilter.getTopAnd().type === "filterAnd", "AND has type 'filterAnd'");
		assert.ok(this.oFilter.getTopAnd().getAndTerms().length === 0, "AND has initial state");
	});
	QUnit.module("Function getOperators", {
		beforeEach : function(assert) {
			commonSetupUtilsFilter(this);
		}
	});
	QUnit.test("getOperators", function(assert) {
		var eq = this.oFilter.getOperators().EQ;
		assert.equal(eq, constants.FilterOperators.EQ, "correct operator returned");
		var oOperators = this.oFilter.getOperators();
		assert.equal(oOperators.LE, constants.FilterOperators.LE, "correct operator returned");
	});
	QUnit.module("Operations", {
		beforeEach : function(assert) {
			commonSetupUtilsFilter(this);
		}
	});
	QUnit.test("Add OR to AND", function(assert) {
		var oResultAddOr = this.oFilter.getTopAnd().addOr('id1');
		var aAndTerms = this.oFilter.getTopAnd().getAndTerms();
		assert.ok(aAndTerms.length === 1, "Added one OR to AND");
		assert.ok(aAndTerms[0].type === "filterOr", "Added OR has type 'filterOr'");
		assert.ok(aAndTerms[0].getOrTerms().length === 0, "OR has initial state");
		assert.ok(aAndTerms[0] === oResultAddOr, "Function addOr returns added OR object");
		this.oFilter.getTopAnd().addOr('id2');
		assert.ok(aAndTerms.length === 2, "Added second OR to AND");
	});
	QUnit.test("Add EXPRESSION to AND", function(assert) {
		var oExpression = {
			id : "expressionId",
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oResultAddExpression = this.oFilter.getTopAnd().addExpression(oExpression);
		var aAndTerms = this.oFilter.getTopAnd().getAndTerms();
		var oAndLevel = this.oFilter.getTopAnd();
		assert.ok(oAndLevel === oResultAddExpression, "'Function addExpression returns AND object");
		assert.ok(this.oFilter.getById("expressionId"), "Expression object added");
		assert.ok(aAndTerms[0] === this.oFilter.getById("expressionId"), "Expression object added into right place in structure");
	});
	QUnit.test("Method getInternalFilter for EXPRESSION on AND", function(assert) {
		var oExpression = {
			id : "expressionId",
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		this.oFilter.getTopAnd().addExpression(oExpression);
		var oInternalFilter = this.oFilter.getInternalFilter();
		var oCompareFilter = new Filter(this.oMsgHandler, "country", this.EQ, "country1");
		assert.ok(oInternalFilter.isEqual(oCompareFilter), "Function getInternalFilter returns expected filter");
	});
	QUnit.test("Add EXPRESSION to OR", function(assert) {
		var oExpression = {
			id : "expressionId",
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oResultAddExpression = this.oFilter.getTopAnd().addOr('orId').addExpression(oExpression);
		var aAndTerms = this.oFilter.getTopAnd().getAndTerms();
		var aOrTerms = aAndTerms[0].getOrTerms();
		var oOrLevel = aAndTerms[0];
		assert.ok(oOrLevel === oResultAddExpression, "Function addExpression returns OR object");
		assert.ok(this.oFilter.getById("expressionId"), "Expression object added");
		assert.ok(aOrTerms[0] === this.oFilter.getById("expressionId"), "Expression object added into right place in structure");
	});
	QUnit.test("Method getInternalFilter for EXPRESSION on OR", function(assert) {
		var oExpression = {
			id : "expressionId",
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		this.oFilter.getTopAnd().addOr('orId').addExpression(oExpression);
		var oInternalFilter = this.oFilter.getInternalFilter();
		var oCompareFilter = new Filter(this.oMsgHandler, "country", this.EQ, "country1");
		assert.ok(oInternalFilter.isEqual(oCompareFilter), "Function getInternalFilter returns expected filter");
	});
	QUnit.test("Method getInternalFilter for EXPRESSION StartsWith on OR", function(assert) {
		var oExpression = {
			id : "expressionId",
			name : "country",
			operator : this.StartsWith,
			value : "cou"
		};
		this.oFilter.getTopAnd().addOr('orId').addExpression(oExpression);
		var oInternalFilter = this.oFilter.getInternalFilter();
		var oCompareFilter = new Filter(this.oMsgHandler, "country", this.StartsWith, "cou");
		assert.ok(oInternalFilter.isEqual(oCompareFilter), "Function getInternalFilter returns expected filter");
	});
	QUnit.test("Method getInternalFilter for EXPRESSION Between on OR", function(assert) {
		var oExpression = {
			id : "expressionId",
			name : "country",
			operator : this.BT,
			value : "cou",
			high : "dou"
		};
		this.oFilter.getTopAnd().addOr('orId').addExpression(oExpression);
		var oInternalFilter = this.oFilter.getInternalFilter();
		var oCompareFilter = new Filter(this.oMsgHandler, "country", this.BT, "cou", "dou");
		assert.ok(oInternalFilter.isEqual(oCompareFilter), "Function getInternalFilter returns expected filter");
	});
	QUnit.test("Get object by id", function(assert) {
		var oExpression1 = {
			id : "expressionId1",
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExpression2 = {
			id : "expressionId2",
			name : "country",
			operator : this.EQ,
			value : "country2"
		};
		var oExpression3 = {
			id : "expressionId3",
			name : "country",
			operator : this.EQ,
			value : "country3"
		};
		var oAddedOr1 = this.oFilter.getTopAnd().addOr('orId1').addExpression(oExpression1);
		var oAddedOr2 = this.oFilter.getTopAnd().addOr('orId2');
		oAddedOr1.addExpression(oExpression2);
		this.oFilter.getTopAnd().addExpression(oExpression3);
		var oAddedExpression1 = oAddedOr1.getOrTerms()[0];
		var oAddedExpression2 = oAddedOr1.getOrTerms()[1];
		var oAddedExpression3 = this.oFilter.getTopAnd().getAndTerms()[2];
		assert.ok(this.oFilter.getById('orId1') === oAddedOr1, "Expected object returned for first or");
		assert.ok(this.oFilter.getById('orId2') === oAddedOr2, "Expected object returned for second or");
		assert.ok(this.oFilter.getById('expressionId1') === oAddedExpression1, "Expected object returned for first expression");
		assert.ok(this.oFilter.getById('expressionId2') === oAddedExpression2, "Expected object returned for second expression");
		assert.ok(this.oFilter.getById('expressionId3') === oAddedExpression3, "Expected object returned for third expression");
	});
	QUnit.test("Method getTopAnd", function(assert) {
		assert.equal(this.oFilter.getTopAnd(), this.oFilter.getById(UtilsFilter.topAndId), "Top 'AND' returned");
	});
	QUnit.test("Combined expressions of AND and OR", function(assert) {
		var oExpressionCountry = {
			id : "countryEqId",
			name : "country",
			operator : this.EQ,
			value : "BRA"
		};
		this.oFilter.getTopAnd().addExpression(oExpressionCountry);
		var oExpressionCustomer1 = {
			id : "customer1EqId",
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		};
		var oExpressionCustomer2 = {
			id : "customer2EqId",
			name : "customer",
			operator : this.EQ,
			value : "customer2"
		};
		var oOrLevelCustomer = this.oFilter.getTopAnd().addOr("customer1OrCustomer2Id").addExpression(oExpressionCustomer1);
		oOrLevelCustomer.addExpression(oExpressionCustomer2);
		var oInternalFilterCountry = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
		var oInternalFilterCustomer1 = new Filter(this.oMsgHandler, "customer", this.EQ, "customer1");
		var oInternalFilterCustomer2 = new Filter(this.oMsgHandler, "customer", this.EQ, "customer2");
		var oInternalFilterCustomer = new Filter(this.oMsgHandler, oInternalFilterCustomer1.addOr(oInternalFilterCustomer2));
		var oInternalFilter = new Filter(this.oMsgHandler, oInternalFilterCountry).addAnd(oInternalFilterCustomer);
		assert.ok(this.oFilter.getInternalFilter().isEqual(oInternalFilter), "Filter with one country and two customers built as expected");
	});
	QUnit.module("Duplicated id's", {
		beforeEach : function(assert) {
			commonSetupUtilsFilter(this);
		}
	});
	QUnit.test("OR", function(assert) {
		this.oFilter.getTopAnd().addOr('orId1');
		assert.throws(function() {
			this.oFilter.getTopAnd().addOr('orId1');
		}, "Error successfully thrown due to duplicated id's in OR");
	});
	QUnit.test("EXPRESSION", function(assert) {
		var oExpression1WithId1 = {
			id : "expressionId1",
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExpression2WithId1 = {
			id : "expressionId1",
			name : "country",
			operator : this.EQ,
			value : "country2"
		};
		var oExpression3WithId2 = {
			id : "expressionId2",
			name : "country",
			operator : this.EQ,
			value : "country3"
		};
		var oExpression4WithId2 = {
			id : "expressionId2",
			name : "country",
			operator : this.EQ,
			value : "country4"
		};
		this.oFilter.getTopAnd().addExpression(oExpression1WithId1);
		assert.throws(function() {
			this.oFilter.getTopAnd().addExpression(oExpression2WithId1);
		}, "Error successfully thrown due to duplicated expression id's in AND");
		assert.throws(function() {
			this.oFilter.getTopAnd().addOr('orId1').addExpression(oExpression2WithId1);
		}, "Error successfully thrown due to duplicated expression id's in AND and OR");
		var oOr2 = this.oFilter.getTopAnd().addOr('orId2').addExpression(oExpression3WithId2);
		assert.throws(function() {
			oOr2.addExpression(oExpression4WithId2);
		}, "Error successfully thrown due to duplicated expression id's in same OR,");
		assert.throws(function() {
			this.oFilter.getTopAnd().addOr('orId3').addExpression(oExpression4WithId2);
		}, "Error successfully thrown due to duplicated expression id's in different ORs");
	});
	QUnit.module("Update", {
		beforeEach : function(assert) {
			commonSetupUtilsFilter(this);
		}
	});
	QUnit.test("Update EXPRESSION", function(assert) {
		var oExpression1 = {
			id : "expressionId",
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExpression2 = {
			id : "expressionId",
			name : "country",
			operator : this.EQ,
			value : "country2"
		};
		var oExpressionResult = {
			id : "expressionIdResult",
			name : "country",
			operator : this.EQ,
			value : "country2"
		};
		this.oFilter.getTopAnd().addExpression(oExpression1);
		this.oFilter.getTopAnd().addExpression(oExpressionResult);
		this.oFilter.updateExpression("expressionId", oExpression2);
		assert.equal(this.oFilter.getById("expressionIdResult").getInternalFilter().toUrlParam(), this.oFilter.getById("expressionId").getInternalFilter().toUrlParam(), "Expression updated");
	});
	QUnit.test("Update EXPRESSION with high value", function(assert) {
		var oExpression1 = {
			id : "expressionId",
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExpression2 = {
			id : "expressionId",
			name : "country",
			operator : this.BT,
			value : "country2",
			high : "country3"
		};
		var oExpressionResult = {
			id : "expressionIdResult",
			name : "country",
			operator : this.BT,
			value : "country2",
			high : "country3"
		};
		this.oFilter.getTopAnd().addExpression(oExpression1);
		this.oFilter.getTopAnd().addExpression(oExpressionResult);
		this.oFilter.updateExpression("expressionId", oExpression2);
		assert.equal(this.oFilter.getById("expressionIdResult").getInternalFilter().toUrlParam(), this.oFilter.getById("expressionId").getInternalFilter().toUrlParam(), "Expression updated");
	});
	QUnit.test("Update EXPRESSION throws exception", function(assert) {
		var oExpression1 = {
			id : "expressionId",
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExpression2 = {
			id : "expressionId",
			name : "country",
			operator : this.EQ,
			value : "country2",
			high : "country3"
		};
		var oExpression3 = {
			id : "expressionId",
			name : "country",
			operator : this.BT,
			value : "country2",
			high : null
		};
		this.oFilter.getTopAnd().addExpression(oExpression1);
		assert.throws(function() {
			this.oFilter.updateExpression("expressionId", oExpression2);
		}, "throws error for high value without between");
		assert.throws(function() {
			this.oFilter.updateExpression("expressionId", oExpression3);
		}, "throws error for between with NULL as high value");
		assert.throws(function() {
			this.oFilter.updateExpression("expressionId", oExpression3);
		}, "throws error for between with undefined high value");
	});
	QUnit.test("Update value", function(assert) {
		var oExpression1 = {
			id : "expressionId1",
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExpressionResult = {
			id : "expressionIdResult",
			name : "country",
			operator : this.EQ,
			value : "country2"
		};
		this.oFilter.getTopAnd().addExpression(oExpression1);
		this.oFilter.getTopAnd().addExpression(oExpressionResult);
		this.oFilter.updateValue("expressionId1", 'country2');
		assert.equal(this.oFilter.getById("expressionId1").getInternalFilter().toUrlParam(), this.oFilter.getById("expressionIdResult").getInternalFilter().toUrlParam(), "Expression value updated");
	});
	QUnit.test("Update value high", function(assert) {
		var oExpression1 = {
			id : "expressionId1",
			name : "country",
			operator : this.BT,
			value : "country0",
			high : "country1"
		};
		var oExpressionResult1 = {
			id : "expressionIdResult1",
			name : "country",
			operator : this.BT,
			value : "country0",
			high : "country1"
		};
		var oExpressionResult2 = {
			id : "expressionIdResult2",
			name : "country",
			operator : this.BT,
			value : "country2",
			high : "country3"
		};
		this.oFilter.getTopAnd().addExpression(oExpression1);
		this.oFilter.getTopAnd().addExpression(oExpressionResult1);
		this.oFilter.getTopAnd().addExpression(oExpressionResult2);
		this.oFilter.updateValue("expressionId1", 'country0');
		assert.equal(this.oFilter.getById("expressionId1").getInternalFilter().toUrlParam(), this.oFilter.getById("expressionIdResult1").getInternalFilter().toUrlParam(), "Only expression low value updated");
		this.oFilter.updateValue("expressionId1", 'country2', 'country3');
		assert.equal(this.oFilter.getById("expressionId1").getInternalFilter().toUrlParam(), this.oFilter.getById("expressionIdResult2").getInternalFilter().toUrlParam(), "Expression low and high value updated");
	});
	QUnit.test("Update value throws exception", function(assert) {
		var oExpression1 = {
			id : "expressionId1",
			name : "country",
			operator : this.BT,
			value : "country0",
			high : "country1"
		};
		var oExpression2 = {
			id : "expressionId2",
			name : "country",
			operator : this.EQ,
			value : "country0",
			high : null
		};
		this.oFilter.getTopAnd().addExpression(oExpression1);
		this.oFilter.getTopAnd().addExpression(oExpression2);
		assert.throws(function() {
			this.oFilter.updateValue("expressionId1", 'country2', null);
		}, "throws error for update between expression with Null as high value");
		assert.throws(function() {
			this.oFilter.updateValue("expressionId2", 'country2', 'country3');
		}, "throws error for equal expression with high value");
	});
	QUnit.module("Access to filter expressions", {
		beforeEach : function(assert) {
			commonSetupUtilsFilter(this);
		}
	});
	QUnit.test("getExpressions for empty filters", function(assert) {
		var aExpressions = this.oFilter.getExpressions();
		assert.deepEqual(aExpressions, [], "Empty array returned for a not restricted filter");
		this.oFilter.getTopAnd().addOr('orId1');
		assert.deepEqual(aExpressions, [], "Empty array returned for a not restricted filter with empty orTerm");
		this.oFilter.getTopAnd().addOr('orId2');
		assert.deepEqual(aExpressions, [], "Empty array returned for a not restricted filter with two empty orTerms");
	});
	QUnit.test("getExpressions flat structure", function(assert) {
		var aExpressions = this.oFilter.getExpressions();
		var oExpression1 = {
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		this.oFilter.getTopAnd().addExpression(oExpression1);
		aExpressions = this.oFilter.getExpressions();
		assert.deepEqual(aExpressions, [ [ {
			name : "country",
			operator : this.EQ,
			value : "country1"
		} ] ], "Expression returned correctly");
		var oExpression2 = {
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		};
		this.oFilter.getTopAnd().addExpression(oExpression2);
		aExpressions = this.oFilter.getExpressions();
		assert.deepEqual(aExpressions, [ [ {
			name : "country",
			operator : this.EQ,
			value : "country1"
		} ], [ {
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		} ] ], "Two expression returned correctly");
		var oExpression3 = {
			name : "country",
			operator : this.EQ,
			value : "country2"
		};
		this.oFilter.getTopAnd().addExpression(oExpression3);
		aExpressions = this.oFilter.getExpressions();
		assert.deepEqual(aExpressions, [ [ {
			name : "country",
			operator : this.EQ,
			value : "country1"
		} ], [ {
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		} ], [ {
			name : "country",
			operator : this.EQ,
			value : "country2"
		} ] ], "Three expressions with two different names returned correctly");
	});
	QUnit.test("getExpressions with or term", function(assert) {
		var oExpression1 = {
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExpression2 = {
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		};
		var oExpression3 = {
			name : "customer",
			operator : this.EQ,
			value : "customer2"
		};
		this.oFilter.getTopAnd().addExpression(oExpression1);
		this.oFilter.getTopAnd().addOr('orId1').addExpression(oExpression2).addExpression(oExpression3);
		var aExpressions = this.oFilter.getExpressions();
		assert.deepEqual(aExpressions, [ [ {
			name : "country",
			operator : this.EQ,
			value : "country1"
		} ], [ {
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		}, {
			name : "customer",
			operator : this.EQ,
			value : "customer2"
		} ] ], "Expressions with or term returned correctly");
	});
	QUnit.module("Compound filter", {
		beforeEach : function(assert) {
			commonSetupUtilsFilter(this);
		}
	});
	QUnit.test("Create simple compound filter", function(assert) {
		var oExpression1 = {
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExpression2 = {
			name : "city",
			operator : this.EQ,
			value : "city1"
		};
		this.oFilter.getTopAnd().addOr("orId1").addAnd("andId1").addExpression(oExpression1).addExpression(oExpression2);
		var aExpressions = this.oFilter.getExpressions();
		var aExpectedExpressions = [ [ [ {
			name : "country",
			operator : this.EQ,
			value : "country1"
		}, {
			name : "city",
			operator : this.EQ,
			value : "city1"
		} ] ] ];
		assert.deepEqual(aExpressions, aExpectedExpressions, "getExpressions() returns correct compound filter");
		var oInternalFilterCountry = new Filter(this.oMsgHandler, "country", this.EQ, "country1");
		var oInternalFilterCity = new Filter(this.oMsgHandler, "city", this.EQ, "city1");
		var oExpectedInternalFilter = oInternalFilterCountry.addAnd(oInternalFilterCity);
		var oInternalFilter = this.oFilter.getInternalFilter();
		assert.ok(oInternalFilter.isEqual(oExpectedInternalFilter), "getInternalFilter() returns correct compound filter");
	});
	QUnit.test("Create complex compound filter", function(assert) {
		var oExprCompany = {
			name : "company",
			operator : this.EQ,
			value : "company1"
		};
		var oExprCustomer = {
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		};
		var oExprCountry1 = {
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExprCountry2 = {
			name : "country",
			operator : this.EQ,
			value : "country2"
		};
		var oExprCity1 = {
			name : "city",
			operator : this.EQ,
			value : "city1"
		};
		var oExprCity2 = {
			name : "city",
			operator : this.EQ,
			value : "city2"
		};
		this.oFilter.getTopAnd().addExpression(oExprCompany);
		this.oFilter.getTopAnd().addOr("orId1").addExpression(oExprCustomer);
		this.oFilter.getById("orId1").addAnd("andId1").addExpression(oExprCountry1).addExpression(oExprCity1);
		this.oFilter.getById("orId1").addAnd("andId2").addExpression(oExprCountry2).addExpression(oExprCity2);
		var aExpressions = this.oFilter.getExpressions();
		var aExpectedExpressions = [ [ {
			name : "company",
			operator : this.EQ,
			value : "company1"
		} ], [ {
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		}, [ {
			name : "country",
			operator : this.EQ,
			value : "country1"
		}, {
			name : "city",
			operator : this.EQ,
			value : "city1"
		} ], [ {
			name : "country",
			operator : this.EQ,
			value : "country2"
		}, {
			name : "city",
			operator : this.EQ,
			value : "city2"
		} ] ] ];
		assert.deepEqual(aExpressions, aExpectedExpressions, "getExpressions() returns correct compound filter");
		var oInternalFilterCompany = new Filter(this.oMsgHandler, "company", this.EQ, "company1");
		var oInternalFilterCustomer = new Filter(this.oMsgHandler, "customer", this.EQ, "customer1");
		var oInternalFilterCountry1 = new Filter(this.oMsgHandler, "country", this.EQ, "country1");
		var oInternalFilterCountry2 = new Filter(this.oMsgHandler, "country", this.EQ, "country2");
		var oInternalFilterCity1 = new Filter(this.oMsgHandler, "city", this.EQ, "city1");
		var oInternalFilterCity2 = new Filter(this.oMsgHandler, "city", this.EQ, "city2");
		var oCompoundInternalFilter1 = oInternalFilterCountry1.addAnd(oInternalFilterCity1);
		var oCompoundInternalFilter2 = oInternalFilterCountry2.addAnd(oInternalFilterCity2);
		oInternalFilterCustomer.addOr(oCompoundInternalFilter1);
		oInternalFilterCustomer.addOr(oCompoundInternalFilter2);
		oInternalFilterCompany.addAnd(oInternalFilterCustomer);
		var oExpectedInternalFilter = oInternalFilterCompany;
		var oInternalFilter = this.oFilter.getInternalFilter();
		assert.ok(oInternalFilter.isEqual(oExpectedInternalFilter), "getInternalFilter() returns correct compound filter");
	});
	QUnit.module("Serialization / deserialization", {
		beforeEach : function(assert) {
			createFilterUtilsFilter(this);
		}
	});
	QUnit.test("Serialize filter 1", function(assert) {
		var oSerialized = this.oFilter.serialize();
		var oExpected = {
			"id" : "filterTopAnd",
			"type" : "filterAnd",
			"expressions" : [ {
				"name" : "topAndExpression1",
				"operator" : "EQ",
				"value" : "topAndExpression1Value"
			}, {
				"name" : "topAndExpression2",
				"operator" : "EQ",
				"value" : "topAndExpression2Value"
			} ],
			"terms" : [ {
				"id" : "orId1",
				"type" : "filterOr",
				"expressions" : [ {
					"name" : "orExpression",
					"operator" : "EQ",
					"value" : "orExpressionValue"
				} ],
				"terms" : [ {
					"id" : "andId1",
					"type" : "filterAnd",
					"expressions" : [ {
						"name" : "and1Expression1",
						"operator" : "EQ",
						"value" : "and1Expression1Value"
					}, {
						"name" : "and1Expression2",
						"operator" : "EQ",
						"value" : "and1Expression2Value"
					} ],
					"terms" : []
				}, {
					"id" : "andId2",
					"type" : "filterAnd",
					"expressions" : [ {
						"name" : "and2Expression1",
						"operator" : "EQ",
						"value" : "and2Expression1Value"
					}, {
						"name" : "and2Expression2",
						"operator" : "EQ",
						"value" : "and2Expression2Value"
					} ],
					"terms" : []
				} ]
			} ]
		};
		assert.deepEqual(oSerialized, oExpected, "Filter serialized as expected.");
	});
	QUnit.test("Serialize filter 2", function(assert) {
		var oOrExpression = {
			id : "orExpression1",
			name : "orExpression",
			operator : this.StartsWith,
			value : "orExpressionValue"
		};
		this.oFilter.updateExpression("orExpression1", oOrExpression);
		var oSerialized = this.oFilter.serialize();
		var oExpected = {
			"id" : "filterTopAnd",
			"type" : "filterAnd",
			"expressions" : [ {
				"name" : "topAndExpression1",
				"operator" : "EQ",
				"value" : "topAndExpression1Value"
			}, {
				"name" : "topAndExpression2",
				"operator" : "EQ",
				"value" : "topAndExpression2Value"
			} ],
			"terms" : [ {
				"id" : "orId1",
				"type" : "filterOr",
				"expressions" : [ {
					"name" : "orExpression",
					"operator" : "StartsWith",
					"value" : "orExpressionValue"
				} ],
				"terms" : [ {
					"id" : "andId1",
					"type" : "filterAnd",
					"expressions" : [ {
						"name" : "and1Expression1",
						"operator" : "EQ",
						"value" : "and1Expression1Value"
					}, {
						"name" : "and1Expression2",
						"operator" : "EQ",
						"value" : "and1Expression2Value"
					} ],
					"terms" : []
				}, {
					"id" : "andId2",
					"type" : "filterAnd",
					"expressions" : [ {
						"name" : "and2Expression1",
						"operator" : "EQ",
						"value" : "and2Expression1Value"
					}, {
						"name" : "and2Expression2",
						"operator" : "EQ",
						"value" : "and2Expression2Value"
					} ],
					"terms" : []
				} ]
			} ]
		};
		assert.deepEqual(oSerialized, oExpected, "Filter serialized as expected.");
	});
	QUnit.test("Deserialize filter", function(assert) {
		var oSerializableFilter = this.oFilter.serialize();
		var oExpressions = this.oFilter.getExpressions();
		var oNewFilter = new UtilsFilter(this.oMsgHandler);
		var oDeserializedFilter = oNewFilter.deserialize(oSerializableFilter);
		var oExpressionsNew = oDeserializedFilter.getExpressions();
		assert.equal(oDeserializedFilter, oNewFilter, "Filter & Deserialized Filter have same storage");
		assert.deepEqual(oExpressions, oExpressionsNew, "Expressions equal after serialization/deserialization");
		assert.deepEqual(oDeserializedFilter.serialize(), oSerializableFilter, "Filter deserialized as expected");
	});
	QUnit.module("Build Intersections", {
		beforeEach : function(assert) {
			commonSetupUtilsFilter(this);
		}
	});
	QUnit.test("Basic checks for intersections", function(assert) {
		var oExprCompany = {
			name : "company",
			operator : this.EQ,
			value : "company1"
		};
		var oExprCustomer = {
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		};
		var oExprCountry1 = {
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExprCountry2 = {
			name : "country",
			operator : this.EQ,
			value : "country2"
		};
		var oExprCity1 = {
			name : "city",
			operator : this.EQ,
			value : "city1"
		};
		var oExprCity2 = {
			name : "city",
			operator : this.EQ,
			value : "city2"
		};
		this.oFilter.getTopAnd().addExpression(oExprCompany);
		this.oFilter.getTopAnd().addOr("orId1").addExpression(oExprCustomer);
		this.oFilter.getById("orId1").addAnd("andId1").addExpression(oExprCountry1).addExpression(oExprCity1);
		this.oFilter.getById("orId1").addAnd("andId2").addExpression(oExprCountry2).addExpression(oExprCity2);
		var oResultFilter = this.oFilter.intersectWith();
		assert.ok((oResultFilter !== this.oFilter), "The result filter for an intersection is a new object instance");
		var sResultFilterUrl = oResultFilter.getInternalFilter().toUrlParam();
		var sExpectedFilterUrl = this.oFilter.getInternalFilter().toUrlParam();
		assert.equal(sResultFilterUrl, sExpectedFilterUrl, "Intersection with no filters leads to a semantically identical object");
	});
	QUnit.test("Intersection has right and unique IDs", function(assert) {
		var oExprCompany = {
			name : "company",
			operator : this.EQ,
			value : "company1"
		};
		var oExprCustomer = {
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		};
		var oExprCountry1 = {
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExprCountry2 = {
			name : "country",
			operator : this.EQ,
			value : "country2"
		};
		var oExprCity1 = {
			name : "city",
			operator : this.EQ,
			value : "city1"
		};
		var oExprCity2 = {
			name : "city",
			operator : this.EQ,
			value : "city2"
		};
		this.oFilter.getTopAnd().addExpression(oExprCompany);
		this.oFilter.getTopAnd().addOr("orId1").addExpression(oExprCustomer);
		this.oFilter.getById("orId1").addAnd("andId1").addExpression(oExprCountry1).addExpression(oExprCity1);
		this.oFilter.getById("orId1").addAnd("andId2").addExpression(oExprCountry2).addExpression(oExprCity2);
		var oExprCompanyb = {
			name : "company",
			operator : this.EQ,
			value : "company1b"
		};
		var oExprCustomerb = {
			name : "customer",
			operator : this.EQ,
			value : "customer1b"
		};
		var oExprCountry1b = {
			name : "country",
			operator : this.EQ,
			value : "country1b"
		};
		var oExprCountry2b = {
			name : "country",
			operator : this.EQ,
			value : "country2b"
		};
		var oExprCity1b = {
			name : "city",
			operator : this.EQ,
			value : "city1b"
		};
		var oExprCity2b = {
			name : "city",
			operator : this.EQ,
			value : "city2b"
		};
		var oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
		var oSecondFilter = new UtilsFilter(oMsgHandler);
		oSecondFilter.getTopAnd().addExpression(oExprCompanyb);
		oSecondFilter.getTopAnd().addOr("orId1").addExpression(oExprCustomerb);
		oSecondFilter.getById("orId1").addAnd("andId1").addExpression(oExprCountry1b).addExpression(oExprCity1b);
		oSecondFilter.getById("orId1").addAnd("andId2").addExpression(oExprCountry2b).addExpression(oExprCity2b);
		var oResultFilter = this.oFilter.intersectWith(oSecondFilter);
		assert.ok(oResultFilter.getTopAnd().getId() === UtilsFilter.topAndId, "Result filter has the right ID for the topAnd expression");
		var aIds = {};
		var j = 0;
		getIdsDeep(assert, oResultFilter.getTopAnd(), aIds);
		assert.equal(j, 7, "Result filter has right number of unique(!) term IDs");
		function getIdsDeep(assert, oTerm, aIds) {
			j++;
			var id = oTerm.getId();
			var aTerms;
			var oTermItem;
			if (!aIds[id]) {
				aIds[id] = oTerm;
			} else {
				assert.ok(false, "Id " + id + " used only once in the result filter");
			}
			switch (oTerm.type) {
				case "filterAnd":
					aTerms = oTerm.getAndTerms();
					break;
				case "filterOr":
					aTerms = oTerm.getOrTerms();
					break;
				default:
					assert.ok(false, "Unknown term type");
			}
			var i;
			for(i = 0; i < aTerms.length; i++) {
				oTermItem = aTerms[i];
				if (!oTermItem.type) {
					continue;
				}
				getIdsDeep(assert, oTermItem, aIds);
			}
		}
	});
	QUnit.test("Intersection has right value", function(assert) {
		var oExprCompany = {
			name : "company",
			operator : this.EQ,
			value : "company1"
		};
		var oExprCustomer = {
			name : "customer",
			operator : this.EQ,
			value : "customer1"
		};
		var oExprCountry1 = {
			name : "country",
			operator : this.EQ,
			value : "country1"
		};
		var oExprCountry2 = {
			name : "country",
			operator : this.EQ,
			value : "country2"
		};
		var oExprCity1 = {
			name : "city",
			operator : this.EQ,
			value : "city1"
		};
		var oExprCity2 = {
			name : "city",
			operator : this.EQ,
			value : "city2"
		};
		this.oFilter.getTopAnd().addExpression(oExprCompany);
		this.oFilter.getTopAnd().addOr("orId1").addExpression(oExprCustomer);
		this.oFilter.getById("orId1").addAnd("andId1").addExpression(oExprCountry1).addExpression(oExprCity1);
		this.oFilter.getById("orId1").addAnd("andId2").addExpression(oExprCountry2).addExpression(oExprCity2);
		var oExprCompanyb = {
			name : "company",
			operator : this.EQ,
			value : "company1b"
		};
		var oExprCustomerb = {
			name : "customer",
			operator : this.EQ,
			value : "customer1b"
		};
		var oExprCountry1b = {
			name : "country",
			operator : this.EQ,
			value : "country1b"
		};
		var oExprCountry2b = {
			name : "country",
			operator : this.EQ,
			value : "country2b"
		};
		var oExprCity1b = {
			name : "city",
			operator : this.EQ,
			value : "city1b"
		};
		var oExprCity2b = {
			name : "city",
			operator : this.EQ,
			value : "city2b"
		};
		var oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
		var oSecondFilter = new UtilsFilter(oMsgHandler);
		oSecondFilter.getTopAnd().addExpression(oExprCompanyb);
		oSecondFilter.getTopAnd().addOr("orId1").addExpression(oExprCustomerb);
		oSecondFilter.getById("orId1").addAnd("andId1").addExpression(oExprCountry1b).addExpression(oExprCity1b);
		oSecondFilter.getById("orId1").addAnd("andId2").addExpression(oExprCountry2b).addExpression(oExprCity2b);
		var oExpectedFilter = new UtilsFilter(oMsgHandler);
		oExpectedFilter.getTopAnd().addExpression(oExprCompany);
		oExpectedFilter.getTopAnd().addExpression(oExprCompanyb);
		oExpectedFilter.getTopAnd().addOr("orId1").addExpression(oExprCustomer);
		oExpectedFilter.getById("orId1").addAnd("andId1").addExpression(oExprCountry1).addExpression(oExprCity1);
		oExpectedFilter.getById("orId1").addAnd("andId2").addExpression(oExprCountry2).addExpression(oExprCity2);
		oExpectedFilter.getTopAnd().addOr("orId1b").addExpression(oExprCustomerb);
		oExpectedFilter.getById("orId1b").addAnd("andId1b").addExpression(oExprCountry1b).addExpression(oExprCity1b);
		oExpectedFilter.getById("orId1b").addAnd("andId2b").addExpression(oExprCountry2b).addExpression(oExprCity2b);
		var oResultFilter = this.oFilter.intersectWith(oSecondFilter);
		var sResultFilterUrl = oResultFilter.getInternalFilter().toUrlParam();
		var sExpectedFilterUrl = oExpectedFilter.getInternalFilter().toUrlParam();
		assert.equal(sResultFilterUrl, sExpectedFilterUrl, "Call Type I - One filter object: Filter intersection has the expected structure");
		oResultFilter = new UtilsFilter(oMsgHandler);
		oResultFilter = oResultFilter.intersectWith(this.oFilter, oSecondFilter);
		sResultFilterUrl = oResultFilter.getInternalFilter().toUrlParam();
		sExpectedFilterUrl = oExpectedFilter.getInternalFilter().toUrlParam();
		assert.equal(sResultFilterUrl, sExpectedFilterUrl, "Call Type II - Several filter objects: Filter intersection has the expected structure");
		var aFilter = [];
		aFilter.push(this.oFilter);
		aFilter.push(oSecondFilter);
		oResultFilter = new UtilsFilter(oMsgHandler);
		oResultFilter = oResultFilter.intersectWith(aFilter);
		sResultFilterUrl = oResultFilter.getInternalFilter().toUrlParam();
		sExpectedFilterUrl = oExpectedFilter.getInternalFilter().toUrlParam();
		assert.equal(sResultFilterUrl, sExpectedFilterUrl, "Call Type III - Array of filter objects: Filter intersection has the expected structure");
	});
	QUnit.module("Selection variant for OpenIn", {
		beforeEach : function(assert) {
			this.oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test("WHEN createFilterFromSapUi5FilterJSON", function(assert) {
		var that = this;
		function createOriginalFilter() {
			var CostingAreaFilter1 = new Filter(that.oMsgHandler, "CoArea", FilterOperator.EQ, "1000");
			var CostCenterFilter1 = new Filter(that.oMsgHandler, "CostCenter", FilterOperator.EQ, "11000");
			var CostCenterCompoundFilter1 = CostCenterFilter1.addAnd(CostingAreaFilter1);
			var CostingAreaFilter2 = new Filter(that.oMsgHandler, "CoArea", FilterOperator.EQ, "2000");
			var CostCenterFilter2 = new Filter(that.oMsgHandler, "CostCenter", FilterOperator.EQ, "22000");
			var CostCenterCompoundFilter2 = CostingAreaFilter2.addAnd(CostCenterFilter2);
			var AllCostCenterCompoundFilter = new Filter(that.oMsgHandler, CostCenterCompoundFilter1).addOr(CostCenterCompoundFilter2);
			var CompanyCodeFilter = new Filter(that.oMsgHandler, "CompanyCode", FilterOperator.EQ, "1000");
			var YearFilter = new Filter(that.oMsgHandler, "Year", FilterOperator.EQ, 2014);
			var topFilter = new Filter(that.oMsgHandler, AllCostCenterCompoundFilter).addAnd(CompanyCodeFilter);
			topFilter = topFilter.addAnd(YearFilter);
			return topFilter;
		}
		var filter = createOriginalFilter();
		var jsonFormat = filter.mapToSapUI5FilterExpression();
		var filterFromTransformation = UtilsFilter.createFilterFromSapUi5FilterJSON(that.oMsgHandler, jsonFormat).getInternalFilter();
		assert.ok(filter.isEqual(filterFromTransformation), "THEN expected filter is created");
	});
});

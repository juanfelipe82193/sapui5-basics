/*
 * Copyright(c) 2015 SAP SE
 */
/*global QUnit, jQuery, sap, console, sap, sinon */

sap.ui.define("sap/apf/core/utils/tFilter", [
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/core/utils/filter",
	"sap/apf/core/utils/filterTerm",
	"sap/apf/core/constants",
	"sap/ui/model/Filter"
], function(DoubleMessageHandler, Filter, FilterTerm, constants, Ui5Filter){
	'use strict';
	function commonSetup(context) {
		var defineFilterOperators = function() {
			jQuery.extend(context, constants.FilterOperators);
		};
		context.oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
		defineFilterOperators();
		context.getCountryCityExpr = function() {
			var oFilter1 = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
			var oFilter2 = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
			var oFilter3 = new Filter(this.oMsgHandler, "country", this.EQ, "RUS");
			oFilter1.addAnd(new Filter(this.oMsgHandler, "city", this.EQ, "RIO"));
			oFilter2.addAnd(new Filter(this.oMsgHandler, "city", this.EQ, "BUE"));
			oFilter3.addAnd(new Filter(this.oMsgHandler, "city", this.EQ, "MOS"));
			var oFilter0 = new Filter(this.oMsgHandler, oFilter1);
			oFilter0.addOr(oFilter2);
			oFilter0.addOr(oFilter3);
			return oFilter0;
		};
		context.getCountryOrExpr = function() {
			var oFilter = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
			var oFilter2 = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
			var oFilter3 = new Filter(this.oMsgHandler, "country", this.EQ, "RUS");
			oFilter.addOr(oFilter2);
			oFilter.addOr(oFilter3);
			return oFilter;
		};
	}
	QUnit.module('Filter', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test("filter creation", function(assert) {
		var testObj = this;
		var oEmptyFilter = new Filter(this.oMsgHandler);
		var aTerms = oEmptyFilter.getFilterTerms();
		assert.deepEqual(aTerms, [], "no terms included yet");
		var aTermProperties = oEmptyFilter.getFilterTermsForProperty("country");
		assert.deepEqual(aTermProperties, [], "no properties yet");
		var oFilter = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
		assert.ok(oFilter, "Equals");
		aTerms = oFilter.getFilterTerms();
		assert.equal(aTerms.length, 1, "one term");
		oFilter = new Filter(this.oMsgHandler, "country", this.NE, "BRA");
		assert.ok(oFilter, "Not equals");
		oFilter = new Filter(this.oMsgHandler, "country", this.GT, "BRA");
		assert.ok(oFilter, "Greater than");
		oFilter = new Filter(this.oMsgHandler, "country", this.LT, "BRA");
		assert.ok(oFilter, "Lower than");
		oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		assert.ok(oFilter, "Lower equals");
		oFilter = new Filter(this.oMsgHandler, "country", this.GE, "BRA");
		assert.ok(oFilter, "Greater equals");
		oFilter = new Filter(this.oMsgHandler, "country", this.BT, "BRA", "RUS");
		assert.ok(oFilter, "Between");
		oFilter = new Filter(this.oMsgHandler, "country", this.StartsWith, "BR");
		assert.ok(oFilter, "StartsWith");
		oFilter = new Filter(this.oMsgHandler, "country", this.EndsWith, "RA");
		assert.ok(oFilter, "EndsWith");
		oFilter = new Filter(this.oMsgHandler, "country", this.Contains, "RA");
		assert.ok(oFilter, "Contains");
		// negative tests
		assert.throws(function() {
			oFilter = new testObj.Filter(testObj.oMsgHandler, "country", testObj.LE);
		}, Error, "missing argument  -> must throw error to pass");
		assert.throws(function() {
			oFilter = new testObj.Filter(testObj.oMsgHandler, undefined, testObj.LE);
		}, Error, "missing argument  -> must throw error to pass with inconsistent arguments");
	});
	QUnit.test("getProperties", function(assert) {
		var oFilter = this.getCountryCityExpr();
		var aProperty = oFilter.getProperties();
		assert.equal(aProperty.length, 2, "number of expected properties in the filter");
	});
	QUnit.test("filter creation with all supported operators", function(assert) {
		var oFilter;
		var i;
		for(i = 0; i < constants.aSelectOpt.length; i++) {
			oFilter = new Filter(this.oMsgHandler, "country", constants.aSelectOpt[i], "BRA");
			assert.ok(oFilter);
		}
	});
	QUnit.test("addOr/And", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
		var oFilter2 = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
		var oFilter3 = new Filter(this.oMsgHandler, "country", this.EQ, "RUS");
		oFilter.addOr(oFilter2);
		assert.throws(function() {
			oFilter.addAnd(oFilter3);
		}, Error, "may not add and to or  -> must throw error to pass");
	});
	QUnit.test('addOr supports arguments for between filter', function(assert) {
		var oEmptyFilter = new Filter(this.oMsgHandler);
		oEmptyFilter.addOr("property", this.BT, "lowerValue", "higherValue");
		assert.equal(oEmptyFilter.toUrlParam(), "((property%20ge%20%27lowerValue%27)%20and%20(property%20le%20%27higherValue%27))", '');
	});
	QUnit.test('addAnd supports arguments for between filter', function(assert) {
		var oEmptyFilter = new Filter(this.oMsgHandler);
		oEmptyFilter.addAnd("property", this.BT, "lowerValue", "higherValue");
		assert.equal(oEmptyFilter.toUrlParam(), "((property%20ge%20%27lowerValue%27)%20and%20(property%20le%20%27higherValue%27))", '');
	});
	QUnit.test("addOr/And wrong arguments", function(assert) {
		var testObj = this;
		var oFilter = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
		assert.throws(function() {
			oFilter.addAnd("Property", testObj.EQ);
		}, Error, "missing arguments");
		assert.throws(function() {
			oFilter.addOr("Property", testObj.EQ);
		}, Error, "missing arguments");
	});
	QUnit.test("addAnd - adding to empty filter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler);
		var oFilter2 = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
		var oFilterCompare = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
		oFilter.addAnd(oFilter2);
		assert.equal(oFilter.isEqual(oFilterCompare), true, "Adding to empty filter equals to the filter");
	});
	QUnit.test("addOr - adding to empty filter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler);
		var oFilter2 = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
		var oFilterCompare = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
		oFilter.addOr(oFilter2);
		assert.equal(oFilter.isEqual(oFilterCompare), true, "Adding as OR to empty filter equals to the filter");
	});
	QUnit.test('Method "toUrlParam()" - Contains, StartsWith, EndsWith', function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.StartsWith, "BR");
		var sParam = oFilter.toUrlParam();
		assert.equal(sParam, "startswith%28country%2c%27BR%27%29", "Correct encoded StartsWith");
		oFilter = new Filter(this.oMsgHandler, "country", this.EndsWith, "BR");
		sParam = oFilter.toUrlParam();
		assert.equal(sParam, "endswith%28country%2c%27BR%27%29", "Correct encoded EndsWith");
		oFilter = new Filter(this.oMsgHandler, "country", this.Contains, "BR");
		sParam = oFilter.toUrlParam();
		assert.equal(sParam, "substringof%28%27BR%27%2ccountry%29", "Correct encoded Contains");
	});
	QUnit.test('Method "toUrlParam()" - Between', function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.BT, "BRA", "RUS");
		var sParam = oFilter.toUrlParam();
		assert.equal(sParam, "((country%20ge%20%27BRA%27)%20and%20(country%20le%20%27RUS%27))", "Correct encoded between");
	});
	QUnit.test('Method "toUrlParam()" - simple disjunction', function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
		var oFilter2 = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
		var oFilter3 = new Filter(this.oMsgHandler, "country", this.LE, "RUS");
		var oFilter4 = new Filter(this.oMsgHandler, "country", this.StartsWith, "RU");
		oFilter.addOr(oFilter2);
		oFilter.addOr(oFilter3);
		oFilter.addOr(oFilter4);
		var sParam = oFilter.toUrlParam();
		assert.equal(sParam, "((country%20eq%20%27BRA%27)%20or%20(country%20eq%20%27ARG%27)%20or%20(country%20le%20%27RUS%27)%20or%20startswith%28country%2c%27RU%27%29)", 'Correctly encoded "or"-expression as string expected');
	});
	QUnit.test('Method "toUrlParam()" - simple conjunction', function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
		var oFilter2 = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
		var oFilter3 = new Filter(this.oMsgHandler, "country", this.LE, "RUS");
		oFilter.addAnd(oFilter2);
		oFilter.addAnd(oFilter3);
		var sParam = oFilter.toUrlParam();
		assert.equal(sParam, '((country%20eq%20%27BRA%27)%20and%20(country%20eq%20%27ARG%27)%20and%20(country%20le%20%27RUS%27))', 'Correctly encoded "and"-expression as string expected');
	});
	QUnit.test('Method "toUrlParam()" - simple disjunction with additional empty filter added after first term', function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
		var oFilter2 = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
		var oFilter3 = new Filter(this.oMsgHandler, "country", this.LE, "RUS");
		oFilter.addOr(new Filter(this.oMsgHandler));
		oFilter.addOr(oFilter2);
		oFilter.addOr(oFilter3);
		var sParam = oFilter.toUrlParam();
		assert.equal(sParam, "((country%20eq%20%27BRA%27)%20or%20(country%20eq%20%27ARG%27)%20or%20(country%20le%20%27RUS%27))", "Empty filter has no effect on encoded string");
	});
	QUnit.test('Method "toUrlParam()" - one expression with value type number literal', function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "property", this.EQ, 4711);
		var sParam = oFilter.toUrlParam();
		assert.equal(sParam, "(property%20eq%204711)", "String with no \" \" expected for property value");
	});
	QUnit.test('Method "toUrlParam()" - simple disjunction with value type number literal includede in middle term', function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "property", this.EQ, "BRA");
		var oFilter2 = new Filter(this.oMsgHandler, "property", this.EQ, 4711);
		var oFilter3 = new Filter(this.oMsgHandler, "property", this.LE, "RUS");
		oFilter.addOr(new Filter(this.oMsgHandler));
		oFilter.addOr(oFilter2);
		oFilter.addOr(oFilter3);
		var sParam = oFilter.toUrlParam();
		assert.equal(sParam, "((property%20eq%20%27BRA%27)%20or%20(property%20eq%204711)%20or%20(property%20le%20%27RUS%27))", "correct encoded string expected");
	});
	QUnit.test("Method 'toUrlParam' - empty filter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler);
		var sParam = oFilter.toUrlParam();
		assert.equal(sParam, "", "empty string expected");
	});
	QUnit.test("Method 'toUrlParam' - complex filter with empty subtree", function(assert) {
		var oFilter = new Filter(this.oMsgHandler);
		oFilter.addAnd(oFilter.copy());
		oFilter.addAnd(oFilter.copy().addAnd(oFilter.copy()));
		oFilter.addAnd(oFilter.copy().addAnd("propertyA","EQ", "1"));
		var sParam = oFilter.toUrlParam();
		assert.equal(sParam, "(((propertyA%20eq%20%271%27)))", "Filter contains only peropertyA and is valid");
	});

	QUnit.module('Filter.isConsistentWithFilter()', {
		beforeEach: function(assert) {
			commonSetup(this);
		},
		afterEach: function(assert) {
		}
	});
	QUnit.test("empty filter is neutral element wrt any filter property", function(assert) {
		var oFilter = new Filter(this.oMsgHandler);
		var isConsistent = oFilter.isConsistentWithFilter('X', "1");
		assert.equal(isConsistent, true, "X contained");
	});
	QUnit.test("isConsistentWithFilter() on LT", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LT, "BRA");
		var isConsistent = oFilter.isConsistentWithFilter('country', "BRA");
		assert.equal(isConsistent, false, "BRA not matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "BR1");
		assert.equal(isConsistent, true, "BR1 matched");
	});
	QUnit.test("isConsistentWithFilter() on type date", function(assert) {
		var oFirstDate = new Date('2011-11-10');
		var oFilter = new Filter(this.oMsgHandler, "dateProperty", this.GT, new Date('2011-11-11'));
		var isConsistent = oFilter.isConsistentWithFilter('dateProperty', new Date('2011-11-12'));
		assert.equal(isConsistent, true, "Date matched");
		oFilter = new Filter(this.oMsgHandler, "dateProperty", this.GE, new Date('2011-11-11'));
		isConsistent = oFilter.isConsistentWithFilter('dateProperty', new Date('2011-11-12'));
		assert.equal(isConsistent, true, "Date matched");
		isConsistent = oFilter.isConsistentWithFilter('dateProperty', oFirstDate);
		assert.equal(isConsistent, false, "Prior Date not matched");
		oFilter = new Filter(this.oMsgHandler, "dateProperty", this.EQ, new Date('2011-11-11'));
		isConsistent = oFilter.isConsistentWithFilter('dateProperty', new Date('2011-11-11'));
		assert.equal(isConsistent, true, "Same Date matched");
		oFilter = new Filter(this.oMsgHandler, "dateProperty", this.NE, new Date('2011-11-11'));
		isConsistent = oFilter.isConsistentWithFilter('dateProperty', new Date('2011-11-11'));
		assert.equal(isConsistent, false, "Same Date not matched");
		isConsistent = oFilter.isConsistentWithFilter('dateProperty', new Date('2012-11-11'));
		assert.equal(isConsistent, true, "Different Date matched");
		oFilter = new Filter(this.oMsgHandler, "dateProperty", this.LE, new Date('2011-11-11'));
		isConsistent = oFilter.isConsistentWithFilter('dateProperty', new Date('2012-11-11'));
		assert.equal(isConsistent, false, "Later Date not matched");
		oFilter = new Filter(this.oMsgHandler, "dateProperty", this.LT, new Date('2011-11-11'));
		isConsistent = oFilter.isConsistentWithFilter('dateProperty', new Date('2011-11-11'));
		assert.equal(isConsistent, false, "Same Date not matched");
		isConsistent = oFilter.isConsistentWithFilter('dateProperty', new Date('2012-11-11'));
		assert.equal(isConsistent, false, "Later Date not matched");
		oFilter = new Filter(this.oMsgHandler, "dateProperty", this.BT, new Date('2011-11-10'), new Date('2011-11-13'));
		isConsistent = oFilter.isConsistentWithFilter('dateProperty', new Date('2011-11-12'));
		assert.equal(isConsistent, true, "Date matched");
	});
	QUnit.test("boolean filter property", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "booleProperty", this.EQ, true);
		var isConsistent = oFilter.isConsistentWithFilter('booleProperty', false);
		assert.equal(isConsistent, false, "False not matched");
		isConsistent = oFilter.isConsistentWithFilter('booleProperty', true);
		assert.equal(isConsistent, true, "True matched");
		oFilter = new Filter(this.oMsgHandler, "booleProperty", this.NE, true);
		isConsistent = oFilter.isConsistentWithFilter('booleProperty', false);
		assert.equal(isConsistent, true, "False matched");
	});
	QUnit.test("StartsWith", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.StartsWith, "BR");
		var isConsistent = oFilter.isConsistentWithFilter('country', "BRA");
		assert.equal(isConsistent, true, "BRA  matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "BR");
		assert.equal(isConsistent, true, "Original value BR matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "1BR");
		assert.equal(isConsistent, false, "1BR not matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "B");
		assert.equal(isConsistent, false, "B not matched");
	});
	QUnit.test("EndsWith", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.EndsWith, "RA");
		var isConsistent = oFilter.isConsistentWithFilter('country', "BRA");
		assert.equal(isConsistent, true, "BRA  matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "RA");
		assert.equal(isConsistent, true, "Original value RA matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "BR1");
		assert.equal(isConsistent, false, "BR1 not matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "A");
		assert.equal(isConsistent, false, "A not matched");
	});
	QUnit.test("Contains", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.Contains, "RA");
		var isConsistent = oFilter.isConsistentWithFilter('country', "BRA");
		assert.equal(isConsistent, true, "BRA  matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "RA");
		assert.equal(isConsistent, true, "Original value RA matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "BR1");
		assert.equal(isConsistent, false, "BR1 not matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "A");
		assert.equal(isConsistent, false, "A not matched");
	});
	QUnit.test("BT", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.BT, "BRA", "RUS");
		var isConsistent = oFilter.isConsistentWithFilter('country', "BRA");
		assert.equal(isConsistent, true, "BRA matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "ABA");
		assert.equal(isConsistent, false, "ABA not matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "GER");
		assert.equal(isConsistent, true, "GER matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "RUS");
		assert.equal(isConsistent, true, "RUS matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "RUS1");
		assert.equal(isConsistent, false, "RUS1 not matched");
	});
	QUnit.test("GT", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.GT, "BRA");
		var isConsistent = oFilter.isConsistentWithFilter('country', "BRA");
		assert.equal(isConsistent, false, "BRA not matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "BRZ");
		assert.equal(isConsistent, true, "BR1 matched");
	});
	QUnit.test("NE", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.NE, "BRA");
		var isConsistent = oFilter.isConsistentWithFilter('country', "BRA");
		assert.equal(isConsistent, false, "BRA not matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "BRZ");
		assert.equal(isConsistent, true, "BR1 matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "BR1");
		assert.equal(isConsistent, true, "BR1 matched");
	});
	QUnit.test("EQ one property included or excluded", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
		var isConsistent = oFilter.isConsistentWithFilter('country', "BRA");
		assert.equal(isConsistent, true, "BRA matched");
		isConsistent = oFilter.isConsistentWithFilter('country', "RUS");
		assert.equal(isConsistent, false, "RUS not matched");
	});
	QUnit.test("Or(eq,eq), same properties, match both values", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "A", this.EQ, "1");
		var oFilter2 = new Filter(this.oMsgHandler, "A", this.EQ, "2");

		oFilter.addOr(oFilter2);

		assert.equal(oFilter.isConsistentWithFilter('A', "1"), true, "1 contained ");
		assert.equal(oFilter.isConsistentWithFilter('A', "2"), true, "2 contained ");
		assert.equal(oFilter.isConsistentWithFilter('A', "4711"), false, "4711 not contained ");
	});
	QUnit.test("Or(eq,eq), same properties, no match in both branches", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "A", this.EQ, "1");
		var oFilter2 = new Filter(this.oMsgHandler, "A", this.EQ, "2");

		oFilter.addOr(oFilter2);

		assert.equal(oFilter.isConsistentWithFilter('A', "4711"), false, "4711 not contained ");
	});
	QUnit.test("different property names", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "A", this.LE, "1");
		var oFilter2 = new Filter(this.oMsgHandler, "XXX", this.EQ, "777");
		var oFilter3 = new Filter(this.oMsgHandler, "B", this.GE, "1000");
		oFilter.addAnd(oFilter2).addAnd(oFilter3);

		assert.equal(oFilter.isConsistentWithFilter('A', "1"), true, "A=1 contained ");

		assert.equal(oFilter.isConsistentWithFilter('X', "x"), true, "contained since disjoint name");
		assert.equal(oFilter.isConsistentWithFilter('B', "1000"), true, "B=1000 contained ");
		assert.equal(oFilter.isConsistentWithFilter('B', "1001"), true, "B=1001 contained ");
		assert.equal(oFilter.isConsistentWithFilter('B', "10"), false, "B=10 not contained ");
	});
	QUnit.test("OR(A=_,_), left matches property and value match in left branch", function(assert) {
		var leftTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var rightTerm = new FilterTerm(this.oMsgHandler, 'X', this.EQ, '2');
		var oFilter = new Filter(this.oMsgHandler, leftTerm).addOr(rightTerm);
		this.leftTermSpy = sinon.stub(leftTerm, 'isConsistentWithFilter', function() {
			return true;
		});
		this.rightTermSpy = sinon.spy(rightTerm, 'isConsistentWithFilter');

		var isConsistent = oFilter.isConsistentWithFilter('A', "x");

		assert.strictEqual(isConsistent, true, 'filter isConsistentWithFilter 1');
		assert.strictEqual(this.leftTermSpy.callCount, 1, "call on left FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.rightTermSpy.callCount, 0, "call on right FilterTerm.isConsistentWithFilter()");
	});
	QUnit.test("OR(A=_,A=_), match in right branch only", function(assert) {
		var leftTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var rightTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '2');
		var oFilter = new Filter(this.oMsgHandler, leftTerm).addOr(rightTerm);
		this.leftTermSpy = sinon.stub(leftTerm, 'isConsistentWithFilter', function() {
			return false;
		});
		this.rightTermSpy = sinon.stub(rightTerm, 'isConsistentWithFilter', function() {
			return true;
		});

		var isConsistent = oFilter.isConsistentWithFilter('A', 'x');

		assert.strictEqual(isConsistent, true, 'filter isConsistentWithFilter 1');
		assert.strictEqual(this.leftTermSpy.callCount, 1, "call on left FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.rightTermSpy.callCount, 1, "call on right FilterTerm.isConsistentWithFilter()");
	});
	QUnit.test("OR(A=_,A=_), value matches in no branch", function(assert) {
		var leftTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var rightTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '2');
		var oFilter = new Filter(this.oMsgHandler, leftTerm).addOr(rightTerm);
		this.leftTermSpy = sinon.stub(leftTerm, 'isConsistentWithFilter', function() {
			return false;
		});
		this.rightTermSpy = sinon.stub(rightTerm, 'isConsistentWithFilter', function() {
			return false;
		});

		var isConsistent = oFilter.isConsistentWithFilter('A', 'x');

		assert.strictEqual(isConsistent, false, 'no match');
		assert.strictEqual(this.leftTermSpy.callCount, 1, "call on left FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.rightTermSpy.callCount, 1, "call on right FilterTerm.isConsistentWithFilter()");
	});
	QUnit.test("OR(A=_,B=_), property does not match left branch and does not match any value", function(assert) {
		var leftTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var rightTerm = new FilterTerm(this.oMsgHandler, 'B', this.EQ, '2');
		var oFilter = new Filter(this.oMsgHandler, leftTerm).addOr(rightTerm);
		this.leftTermSpy = sinon.stub(leftTerm, 'isConsistentWithFilter', function() {
			return false;
		});
		this.rightTermSpy = sinon.stub(rightTerm, 'isConsistentWithFilter', function() {
			return false;
		});

		var isConsistent = oFilter.isConsistentWithFilter('B', 'x');

		assert.strictEqual(isConsistent, false, 'no match');
		assert.strictEqual(this.leftTermSpy.callCount, 0, "call on left FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.rightTermSpy.callCount, 1, "call on right FilterTerm.isConsistentWithFilter()");
	});
	QUnit.test("OR(A=_,B=_), property does not match left branch but value matches right branch", function(assert) {
		var leftTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var rightTerm = new FilterTerm(this.oMsgHandler, 'B', this.EQ, '2');
		var oFilter = new Filter(this.oMsgHandler, leftTerm).addOr(rightTerm);
		this.leftTermSpy = sinon.stub(leftTerm, 'isConsistentWithFilter', function() {
			return true; //intended, must fail on property name
		});
		this.rightTermSpy = sinon.stub(rightTerm, 'isConsistentWithFilter', function() {
			return true;
		});

		var isConsistent = oFilter.isConsistentWithFilter('B', 'x');

		assert.strictEqual(isConsistent, true, 'the right branch is correct evaluated');
		assert.strictEqual(this.leftTermSpy.callCount, 0, "left branch not called");
		assert.strictEqual(this.rightTermSpy.callCount, 1, "right branch is called");
	});
	QUnit.test("OR(A=_,B=_), property does not match any branch", function(assert) {
		var leftTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var rightTerm = new FilterTerm(this.oMsgHandler, 'B', this.EQ, '2');
		var oFilter = new Filter(this.oMsgHandler, leftTerm).addOr(rightTerm);
		this.leftTermSpy = sinon.stub(leftTerm, 'isConsistentWithFilter', function() {
			return true; //intended, must fail on property name
		});
		this.rightTermSpy = sinon.stub(rightTerm, 'isConsistentWithFilter', function() {
			return true;
		});

		var isConsistent = oFilter.isConsistentWithFilter('X', 'x');

		assert.strictEqual(isConsistent, true, 'true since not constrained');
		assert.strictEqual(this.leftTermSpy.callCount, 0, "call on left FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.rightTermSpy.callCount, 0, "call on right FilterTerm.isConsistentWithFilter()");
	});
	QUnit.test("OR(A=1,A=2,C=x), test with A=4", function(assert) {
		var term1 = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var term2 = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '2');
		var term3 = new FilterTerm(this.oMsgHandler, 'C', this.EQ, 'x');
		var filter = new Filter(this.oMsgHandler, term1).addOr(term2).addOr(term3);
		this.term1Spy = sinon.stub(term1, 'isConsistentWithFilter', function() {
			return false;
		});
		this.term2Spy = sinon.stub(term2, 'isConsistentWithFilter', function() {
			return false;
		});
		this.term3Spy = sinon.stub(term3, 'isConsistentWithFilter', function() {
			return true;
		});

		var isConsistent = filter.isConsistentWithFilter('A', '4');

		assert.strictEqual(isConsistent, false, 'false matched A=4 ');
		assert.strictEqual(this.term1Spy.callCount, 1, "call on 1st FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.term2Spy.callCount, 1, "call on 2nd FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.term3Spy.callCount, 0, "3rd branch not called because property disjoint");
	});
	QUnit.test("Filter(FilterTerm), property is not constrained", function(assert) {
		var filterTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var oFilter = new Filter(this.oMsgHandler, filterTerm);
		this.leftTermSpy = sinon.spy(filterTerm, 'isConsistentWithFilter');

		var isConsistent = oFilter.isConsistentWithFilter('HUGO', 'x');

		assert.strictEqual(isConsistent, true, 'isConsistentWithFilter() === true because property is disjoint');
		assert.strictEqual(this.leftTermSpy.callCount, 1, "THEN call FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.leftTermSpy.getCall(0).returnValue, true, "THEN FilterTerm.isConsistentWithFilter() returns true");
	});
	QUnit.test("AND(_,_), match both branches", function(assert) {
		var leftTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var rightTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '2');
		var oFilter = new Filter(this.oMsgHandler, leftTerm).addAnd(rightTerm);
		this.leftTermSpy = sinon.stub(leftTerm, 'isConsistentWithFilter', function() {
			return true;
		});
		this.rightTermSpy = sinon.stub(rightTerm, 'isConsistentWithFilter', function() {
			return true;
		});

		var isConsistent = oFilter.isConsistentWithFilter('A', 'x');

		assert.strictEqual(isConsistent, true, 'isConsistentWithFilter === true since both branches are true');
		assert.strictEqual(this.leftTermSpy.callCount, 1, "call on left FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.rightTermSpy.callCount, 1, "call on right FilterTerm.isConsistentWithFilter()");
	});
	QUnit.test("AND(_,_), no match in left branch", function(assert) {
		var leftTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var rightTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '2');
		var oFilter = new Filter(this.oMsgHandler, leftTerm).addAnd(rightTerm);
		this.leftTermSpy = sinon.stub(leftTerm, 'isConsistentWithFilter', function() {
			return false;
		});
		this.rightTermSpy = sinon.stub(rightTerm, 'isConsistentWithFilter', function() {
			return true;
		});

		var isConsistent = oFilter.isConsistentWithFilter('A', 'x');

		assert.strictEqual(isConsistent, false, 'isConsistentWithFilter === false since one branch false');
		assert.strictEqual(this.leftTermSpy.callCount, 1, "call on left FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.rightTermSpy.callCount, 0, "no call on right FilterTerm.isConsistentWithFilter()");
	});
	QUnit.test("AND(_,_), no match in right branch", function(assert) {
		var leftTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var rightTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '2');
		var oFilter = new Filter(this.oMsgHandler, leftTerm).addAnd(rightTerm);
		this.leftTermSpy = sinon.stub(leftTerm, 'isConsistentWithFilter', function() {
			return true;
		});
		this.rightTermSpy = sinon.stub(rightTerm, 'isConsistentWithFilter', function() {
			return false;
		});

		var isConsistent = oFilter.isConsistentWithFilter('A', 'x');

		assert.strictEqual(isConsistent, false, 'isConsistentWithFilter === false since one branch false');
		assert.strictEqual(this.leftTermSpy.callCount, 1, "call on left FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.rightTermSpy.callCount, 1, "call on right FilterTerm.isConsistentWithFilter()");
	});
	QUnit.test("AND(_,_), no match on property name", function(assert) { // logically redundant to "AND(_,_), match both branches"
		var leftTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '1');
		var rightTerm = new FilterTerm(this.oMsgHandler, 'A', this.EQ, '2');
		var oFilter = new Filter(this.oMsgHandler, leftTerm).addAnd(rightTerm);
		this.leftTermSpy = sinon.spy(leftTerm, 'isConsistentWithFilter');
		this.rightTermSpy = sinon.spy(rightTerm, 'isConsistentWithFilter');

		var isConsistent = oFilter.isConsistentWithFilter('X', 'x');

		assert.strictEqual(isConsistent, true, 'isConsistentWithFilter === true since not constrained');
		assert.strictEqual(this.leftTermSpy.callCount, 1, "call on left FilterTerm.isConsistentWithFilter()");
		assert.strictEqual(this.rightTermSpy.callCount, 1, "call on right FilterTerm.isConsistentWithFilter()");
	});

	QUnit.module('Filter.equal()', {
		beforeEach : function(assert) {
			commonSetup(this);
		}
	});
	QUnit.test("equal of two filters", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter2 = new Filter(this.oMsgHandler, "SAPClient", this.EQ, "777");
		var oFilter3 = new Filter(this.oMsgHandler, "country", this.NE, "BRA");
		var oFilter4 = new Filter(this.oMsgHandler, "country", this.LE, "BRX");
		var bEqual = oFilter.isEqual(oFilter);
		assert.equal(bEqual, true, "filter equal");
		bEqual = oFilter.isEqual(undefined);
		assert.equal(bEqual, false, "filter not equal to undefined");
		bEqual = oFilter.isEqual(oFilter1);
		assert.equal(bEqual, true, "filter equal");
		bEqual = oFilter.isEqual(oFilter2);
		assert.equal(bEqual, false, "filter not equal");
		bEqual = oFilter.isEqual(oFilter3);
		assert.equal(bEqual, false, "filter not equal");
		bEqual = oFilter.isEqual(oFilter4);
		assert.equal(bEqual, false, "filter not equal");
	});
	QUnit.test("Equality on boolean values", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "booleanProperty", this.EQ, true);
		var oFilter1 = new Filter(this.oMsgHandler, "booleanProperty", this.EQ, true);
		var bEqual = oFilter.isEqual(oFilter1);
		assert.equal(bEqual, true, "filter are equal");
		oFilter = new Filter(this.oMsgHandler, "booleanProperty", this.EQ, true);
		oFilter1 = new Filter(this.oMsgHandler, "booleanProperty", this.EQ, false);
		bEqual = oFilter.isEqual(oFilter1);
		assert.equal(bEqual, false, "filter are not equal");
	});
	QUnit.test("Equality on date values", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "dateProperty", this.EQ, new Date('2011-11-11'));
		var oFilter1 = new Filter(this.oMsgHandler, "dateProperty", this.EQ, new Date('2011-11-11'));
		var bEqual = oFilter.isEqual(oFilter1);
		assert.equal(bEqual, true, "filter are equal");
		oFilter = new Filter(this.oMsgHandler, "dateProperty", this.EQ, new Date('2011-11-11'));
		oFilter1 = new Filter(this.oMsgHandler, "dateProperty", this.EQ, new Date('2011-11-12'));
		bEqual = oFilter.isEqual(oFilter1);
		assert.equal(bEqual, false, "filter are not equal");
	});
	QUnit.test("Equality of copied filters and addition of empty filter to one filter", function(assert) {
		var oFilter1 = new Filter(this.oMsgHandler, "Customer", this.EQ, "1001");
		oFilter1.addAnd("Customer", this.EQ, "1002");
		var oFilter2 = oFilter1.copy();
		oFilter2.addAnd(new Filter(this.oMsgHandler));
		assert.ok(oFilter1.isEqual(oFilter2), 'Cloned filter expected to be equal');
	});
	QUnit.test("Inequality of two different BT filter", function(assert) {
		var oFilter1 = new Filter(this.oMsgHandler, "Customer", this.BT, "1001", "1003");
		var oFilter2 = new Filter(this.oMsgHandler, "Customer", this.BT, "1001", "1005");
		assert.notOk(oFilter1.isEqual(oFilter2),"Two different BT filters are not equal");
	});
	QUnit.test("Equality of copied filter terms with BT", function(assert) {
		var oFilterTerm1 = new FilterTerm(this.oMsgHandler, "Customer", this.BT, "1001", "1003");
		var oFilterTerm2 = oFilterTerm1.copy();
		assert.equal(oFilterTerm1.toUrlParam(), oFilterTerm2.toUrlParam(), "Copied Filter is equal");
	});
	QUnit.test("commutative equal of two filters 1 - the order of terms shouln't matter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "country", this.LE, "GER");
		var oFilter2 = new Filter(this.oMsgHandler, "country", this.LE, "GER");
		var oFilter3 = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		oFilter.addOr(oFilter1);
		oFilter2.addOr(oFilter3);
		var bEqual = oFilter.isEqual(oFilter2);
		assert.equal(bEqual, true, "filter equal");
	});
	QUnit.test("commutative equal of two filters 2 - the order of filters shouln't matter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "city", this.LE, "RIO");
		var oFilter2 = new Filter(this.oMsgHandler, "country", this.LE, "GER");
		var oFilter3 = new Filter(this.oMsgHandler, "city", this.LE, "WDF");
		oFilter.addAnd(oFilter1);
		var oFilter4 = new Filter(this.oMsgHandler, oFilter);
		oFilter2.addAnd(oFilter3);
		oFilter4.addOr(oFilter2); // left side
		var oFilter_ = new Filter(this.oMsgHandler, "city", this.LE, "WDF");
		var oFilter1_ = new Filter(this.oMsgHandler, "country", this.LE, "GER");
		var oFilter2_ = new Filter(this.oMsgHandler, "city", this.LE, "RIO");
		var oFilter3_ = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		oFilter1_.addAnd(oFilter_);
		var oFilter4_ = new Filter(this.oMsgHandler, oFilter1_);
		oFilter3_.addAnd(oFilter2_);
		oFilter4_.addOr(oFilter3_); // right side
		var bEqual = oFilter4_.isEqual(oFilter4);
		assert.equal(bEqual, true, "filter equal");
	});
	QUnit.test("and/or on different levels", function(assert) {
		var oFilter1 = new Filter(this.oMsgHandler, "country", this.EQ, "BRA");
		var oFilter2 = new Filter(this.oMsgHandler, "country", this.EQ, "ARG");
		var oFilter3 = new Filter(this.oMsgHandler, "country", this.EQ, "RUS");
		var oFilterOr = new Filter(this.oMsgHandler, oFilter1).addOr(oFilter2);
		var oFilterAnd = new Filter(this.oMsgHandler, oFilter3).addAnd(oFilterOr);
		var oFilterAndCompare = new Filter(this.oMsgHandler, oFilter1).addAnd(oFilter2);
		var oFilterOrCompare = new Filter(this.oMsgHandler, oFilter3).addOr(oFilterAndCompare);
		assert.equal(oFilterAnd.isEqual(oFilterOrCompare), false, "and and or on different levels handled correct way");
		var oFilterOr2 = new Filter(this.oMsgHandler, oFilter2).addOr(oFilter1);
		var oFilterAnd2 = new Filter(this.oMsgHandler, oFilter3).addAnd(oFilterOr2);
		assert.equal(oFilterAnd.isEqual(oFilterAnd2), true, "commutative or handled correct way");
		var oFilterAndCompare2 = new Filter(this.oMsgHandler, oFilter2).addAnd(oFilter1);
		var oFilterOrCompare2 = new Filter(this.oMsgHandler, oFilter3).addOr(oFilterAndCompare2);
		assert.equal(oFilterOrCompare.isEqual(oFilterOrCompare2), true, "and and or on different levels handled correct way");
	});

	QUnit.module('Filter & EmptyFilter related to simplifyFilter', {
		beforeEach : function(assert) {
			jQuery.extend(this,	constants.FilterOperators);
			this.oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
			this.Filter = Filter;
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test( 'EmptyFilter', function(assert) {
		var filter = new Filter(this.oMsgHandler);
		assert.strictEqual( filter instanceof Filter, true, 'type');
		assert.strictEqual( filter.getFilterTerms().length, 0, 'getFilterTerms().length' );
		assert.strictEqual( filter.isEmpty(), true, 'isEmpty');
		assert.strictEqual( filter.isOr(), false, 'isOr');
		assert.strictEqual( filter.isFilterTerm(), false, 'isFilterTerm');
	});
	QUnit.test( 'Filter pointing to EmptyFilter', function(assert) {
		var emptyFilter = new Filter(this.oMsgHandler);
		var filter = new Filter(this.oMsgHandler);
		filter.addAnd(emptyFilter);
		assert.strictEqual( filter instanceof Filter, true, 'type');
		assert.strictEqual( filter.getFilterTerms().length, 0, 'getFilterTerms().length' );
		assert.strictEqual( filter.isEmpty(), true, 'isEmpty');
		assert.strictEqual( filter.isOr(), false, 'isOr');
		assert.strictEqual( filter.isFilterTerm(), false, 'isFilterTerm');
	});
	QUnit.test( 'AND(EmptyFilter, eq)', function(assert) {
		var emptyFilter = new Filter(this.oMsgHandler);
		var filter = new Filter(this.oMsgHandler);
		filter.addAnd(emptyFilter);
		var eq = new Filter(this.oMsgHandler, "A", this.EQ, 1);
		filter.addAnd(eq);
		assert.strictEqual( filter instanceof Filter, true, 'type');
		assert.strictEqual( filter.getFilterTerms().length, 1, 'getFilterTerms().length' );
		assert.strictEqual( filter.isEmpty(), false, 'isEmpty');
		assert.strictEqual( filter.isOr(), false, 'isOr');
		assert.strictEqual( filter.isFilterTerm(), false, 'isFilterTerm');
	});
	QUnit.test( 'Filter eq', function(assert) {
		var filter = new Filter(this.oMsgHandler, "A", this.EQ, 1);

		assert.strictEqual( filter instanceof Filter, true, 'type');
		assert.strictEqual( filter.getFilterTerms().length, 1, 'getFilterTerms().length' );
		assert.strictEqual( filter.isEmpty(), false, 'isEmpty');
		assert.strictEqual( filter.isOr(), false, 'isOr');
		assert.strictEqual( filter.isFilterTerm(), true, 'isFilterTerm');
	});
	QUnit.test('AND(eq, eq)', function(assert) {
		var filter = new Filter(this.oMsgHandler, "A", this.EQ, "1").addAnd("A", this.EQ, "2");

		assert.strictEqual( filter.getFilterTerms().length, 2, 'getFilterTerms().length' );
		assert.strictEqual( filter.isEmpty(), false, 'not isEmpty');
		assert.strictEqual( filter.isOr(), false, 'is And');
		assert.strictEqual( filter.isFilterTerm(), false, 'isFilterTerm()' );
	});
	QUnit.test( 'AND(EmptyFilter, EmptyFilter)', function(assert) {
		var filter = new Filter(this.oMsgHandler);
		var emptyFilter1 = new Filter(this.oMsgHandler);
		filter.addAnd(emptyFilter1);
		var emptyFilter2 = new Filter(this.oMsgHandler);
		filter.addAnd(emptyFilter2);
		assert.strictEqual( filter.isEmpty(), true, 'isEmpty');
		assert.strictEqual( filter.isOr(), false, 'isOr');
		assert.strictEqual( filter.isFilterTerm(), false, 'isFilterTerm');
	});

	QUnit.test( 'AND(EmptyFilter, EmptyFilter, EmptyFilter)', function(assert) {
		var filter = new Filter(this.oMsgHandler);
		var emptyFilter1 = new Filter(this.oMsgHandler);
		filter.addAnd(emptyFilter1);
		var emptyFilter2 = new Filter(this.oMsgHandler);
		filter.addAnd(emptyFilter2);
		var emptyFilter3 = new Filter(this.oMsgHandler);
		filter.addAnd(emptyFilter3);
		assert.strictEqual( filter.isEmpty(), true, 'isEmpty');
		assert.strictEqual( filter.isOr(), false, 'isOr');
		assert.strictEqual( filter.isFilterTerm(), false, 'isFilterTerm');
	});

	QUnit.test( 'AND(EmptyFilter, AND(EmptyFilter, EmptyFilter))', function(assert) {
		var filter = new Filter(this.oMsgHandler);
		var emptyFilter1 = new Filter(this.oMsgHandler);
		filter.addAnd(emptyFilter1);
		var andNode = new Filter(this.oMsgHandler);
		var emptyFilter2 = new Filter(this.oMsgHandler);
		andNode.addAnd(emptyFilter2);
		var emptyFilter3 = new Filter(this.oMsgHandler);
		andNode.addAnd(emptyFilter3);
		filter.addAnd(andNode);
		assert.strictEqual( filter.isEmpty(), true, 'isEmpty');
		assert.strictEqual( filter.isOr(), false, 'isOr');
		assert.strictEqual( filter.isFilterTerm(), false, 'isFilterTerm');
	});
	QUnit.test( 'AND(AND(EmptyFilter, EmptyFilter), EmptyFilter)', function(assert) {
		var filter = new Filter(this.oMsgHandler);
		var andNode = new Filter(this.oMsgHandler);
		var emptyFilter2 = new Filter(this.oMsgHandler);
		andNode.addAnd(emptyFilter2);
		var emptyFilter3 = new Filter(this.oMsgHandler);
		andNode.addAnd(emptyFilter3);
		filter.addAnd(andNode);
		var emptyFilter1 = new Filter(this.oMsgHandler);
		filter.addAnd(emptyFilter1);
		assert.strictEqual( filter.isEmpty(), true, 'isEmpty');
		assert.strictEqual( filter.isOr(), false, 'isOr');
		assert.strictEqual( filter.isFilterTerm(), false, 'isFilterTerm');
	});
	QUnit.test( 'Filter OR(eq, eq)', function(assert) {
		var filter = new Filter(this.oMsgHandler, 'A', this.EQ, "de");
		var sub = new Filter(this.oMsgHandler, 'A', this.EQ, "fr");
		filter.addOr(sub);
		assert.strictEqual( filter instanceof Filter, true, 'type');
		assert.strictEqual( filter.getFilterTerms().length, 2, 'getFilterTerms().length' );
		assert.strictEqual( filter.isEmpty(), false, 'isEmpty');
		assert.strictEqual( filter.isOr(), true, 'isOr');
		assert.strictEqual( filter.isFilterTerm(), false, 'isFilterTerm');
	});
	QUnit.test( 'Filter AND(OR(eq, eq)) which is a wrapper around OR, the subtree is in oLeftExpr', function(assert) {
		var filter = new Filter(this.oMsgHandler);
		var orNode = new Filter(this.oMsgHandler, 'A', this.EQ, "de");
		var sub = new Filter(this.oMsgHandler, 'A', this.EQ, "fr");
		orNode.addOr(sub);
		filter.addAnd(orNode);
		assert.strictEqual( filter instanceof Filter, true, 'type');
		assert.strictEqual( filter.getFilterTerms().length, 2, 'getFilterTerms().length' );
		assert.strictEqual( filter.isEmpty(), false, 'isEmpty');
		assert.strictEqual( filter.isOr(), true, 'isOr');
		assert.strictEqual( filter.isFilterTerm(), false, 'isFilterTerm');
	});

	QUnit.module('Remove terms by property', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test("Conjunction of two terms - remove term and compare with second filter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "city", this.LE, "RIO");
		var oFilter2 = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		oFilter.addAnd(oFilter1);
		var oFilterReduced = oFilter.removeTermsByProperty("city");
		var bEqual = oFilter2.isEqual(oFilterReduced);
		assert.equal(bEqual, true, "filter equal");
	});
	QUnit.test("One term with BT", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.BT, "ARG", "BRA");
		var oFilterReduced = oFilter.removeTermsByProperty("notExisting");
		assert.equal(oFilterReduced.isEqual(oFilter), true, "filter equal");
	});
	QUnit.test("One term with BT", function(assert) {
		var oFilter1 = new Filter(this.oMsgHandler, "country", this.BT, "ARG", "BRA");
		var oFilter2 = new Filter(this.oMsgHandler, "city", this.BT, "HAM", "MUNICH");
		oFilter1.addAnd(oFilter2);
		var oFilterReduced = oFilter1.removeTermsByProperty("city");
		var oFilterCompare = new Filter(this.oMsgHandler, "country", this.BT, "ARG", "BRA");
		assert.equal(oFilterReduced.isEqual(oFilterCompare), true, "filter equal");
	});
	QUnit.test("One term - removal returns empty filter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilterReduced = oFilter.removeTermsByProperty("country");
		assert.ok(oFilterReduced.isEmpty(), "filter empty");
	});
	QUnit.test("No term - removal returns empty", function(assert) {
		var oFilter = new Filter(this.oMsgHandler);
		var oFilterReduced = oFilter.removeTermsByProperty("country");
		assert.equal(oFilterReduced.isEqual(oFilter), true, "filter equal");
	});
	QUnit.test("Two terms, same property - removal returns empty filter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "country", this.LE, "GER");
		oFilter.addAnd(oFilter1);
		var oFilterReduced = oFilter.removeTermsByProperty("country");
		assert.ok(oFilterReduced.isEmpty(), "filter empty");
	});
	QUnit.test("Removal of non-existing property does not change filter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "country", this.LE, "GER");
		oFilter.addAnd(oFilter1);
		var oFilterReduced = oFilter.removeTermsByProperty("city");
		var bEqual = oFilter.isEqual(oFilterReduced);
		assert.equal(bEqual, true, "filter equal");
	});
	QUnit.test("Removal of several terms from a filter like constructed in the path update", function(assert) {
		var oStartFilter = new Filter(this.oMsgHandler, "GlobalProp1", this.EQ, 'value1');
		oStartFilter.addAnd(new Filter(this.oMsgHandler, "GlobalProp2", this.EQ, 'value2'));
		var oCummulativeFilter = new Filter(this.oMsgHandler, oStartFilter);
		var oFilterFromStep = new Filter(this.oMsgHandler);
		var i;
		for(i = 0; i < 3; i++) {
			oFilterFromStep.addOr(new Filter(this.oMsgHandler, "StepProp1", this.EQ, 'value' + i));
		}
		oCummulativeFilter.addAnd(oFilterFromStep);
		var reducedFilter = oCummulativeFilter.removeTermsByProperty("StepProp1");
		assert.ok(reducedFilter.isEqual(oStartFilter), "Reduction works");
	});
	QUnit.test("Compound is reduced to simple filter", function(assert) {
		var oFilterCountryCity = this.getCountryCityExpr();
		var oFilterCountry = this.getCountryOrExpr();
		var oFilterReduced = oFilterCountryCity.removeTermsByProperty("city");
		var bEqual = oFilterReduced.isEqual(oFilterCountry);
		assert.equal(bEqual, true, "filter equal");
	});
	QUnit.test("Compound - all properties removed returns empty filter", function(assert) {
		var oFilterCountryCity = this.getCountryCityExpr();
		var oFilterReduced = oFilterCountryCity.removeTermsByProperty([ "city", "country" ]);
		assert.ok(oFilterReduced.isEmpty(), "filter empty");
	});
	QUnit.test("Nested filter - two level", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, 'PropertyToExtract', this.EQ, '10');
		oFilter.addOr('p_param2', this.EQ, '4711');
		oFilter.addOr('PropertyOfNoInterestTwo', this.LT, '200');
		var oNextLevelFilter = new Filter(this.oMsgHandler, 'PropertyToExtract', this.EQ, '20');
		oNextLevelFilter.addOr('PropertyOfNoInterestOne', this.GT, '120');
		oNextLevelFilter.addOr('p_param2', this.EQ, '4712');
		var oCombinedFilter = new Filter(this.oMsgHandler, oFilter);
		oCombinedFilter.addAnd(oNextLevelFilter);
		var oReducedFilter = oCombinedFilter.removeTermsByProperty('p_param2');
		assert.equal(oReducedFilter.getFilterTermsForProperty('p_param2').length, 0, 'Term is not contained any longer');
		assert.equal(oReducedFilter.getFilterTerms().length, 4, 'Number of remaining terms is correct');
	});
	QUnit.test("Nested filter - compound filter (three level)", function(assert) {
		var oCompound = new Filter(this.oMsgHandler, 'prop1', this.EQ, 'val1');
		oCompound.addAnd('prop2', this.EQ, 'val2');
		oCompound.addAnd('prop3', this.EQ, 'val3');
		var oFilter = new Filter(this.oMsgHandler, oCompound);
		oFilter.addOr(oCompound);
		var oNextLevelFilter = new Filter(this.oMsgHandler, oCompound);
		oNextLevelFilter.addOr(oCompound);
		var oCombinedFilter = new Filter(this.oMsgHandler, oFilter);
		oCombinedFilter.addAnd(oNextLevelFilter);
		var oReducedFilter = oCombinedFilter.removeTermsByProperty('prop2');
		assert.equal(oReducedFilter.getFilterTermsForProperty('prop2').length, 0, 'Term is not contained any longer');
		assert.equal(oReducedFilter.getFilterTerms().length, 8, 'Number of remaining terms is correct');
	});
	QUnit.test("getFilterTermsForProperty - basic", function(assert) {
		var oFilter = new Filter(this.oMsgHandler);
		var aTerms = oFilter.getFilterTermsForProperty("country");
		assert.deepEqual(aTerms, [], "no terms expected");
	});
	QUnit.test("Several terms by providing an array containing terms to be removed", function(assert) {
		var oCompound = new Filter(this.oMsgHandler, 'prop1', this.EQ, 'val1');
		oCompound.addAnd('prop2', this.EQ, 'val2');
		oCompound.addAnd('prop3', this.EQ, 'val3');
		oCompound.addAnd('prop4', this.EQ, 'val4');
		oCompound.addAnd('prop5', this.EQ, 'val5');
		oCompound.addAnd('prop6', this.EQ, 'val6');
		var oFilter = new Filter(this.oMsgHandler, oCompound);
		oFilter.addOr(oCompound);
		var oNextLevelFilter = new Filter(this.oMsgHandler, oCompound);
		oNextLevelFilter.addOr(oCompound);
		var oCombinedFilter = new Filter(this.oMsgHandler, oFilter);
		oCombinedFilter.addAnd(oNextLevelFilter);
		var oReducedFilter = oCombinedFilter.removeTermsByProperty([ 'prop2', 'prop4', 'prop6' ]);
		assert.equal(oReducedFilter.getFilterTermsForProperty('prop2').length, 0, 'Term is not contained any longer');
		assert.equal(oReducedFilter.getFilterTermsForProperty('prop4').length, 0, 'Term is not contained any longer');
		assert.equal(oReducedFilter.getFilterTermsForProperty('prop6').length, 0, 'Term is not contained any longer');
		assert.equal(oReducedFilter.getFilterTermsForProperty('propNotContained').length, 0, 'Term is not contained any longer');
		assert.equal(oReducedFilter.getFilterTerms().length, 12, 'Number of remaining terms is correct');
	});
	QUnit.test("Single term", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "country", this.LE, "GER");
		oFilter.addAnd(oFilter1);
		var oFilterReduced = oFilter.removeTerms("country", this.LE, "BRA");
		var bEqual = oFilter1.isEqual(oFilterReduced);
		assert.equal(bEqual, true, "filter equal");
	});
	QUnit.test("Multiple properties removed", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "country", this.LE, "GER");
		oFilter.addAnd(oFilter1);
		var oFilterReduced = oFilter.removeTerms([ "city", "country" ], this.LE, "BRA");
		var bEqual = oFilter1.isEqual(oFilterReduced);
		assert.equal(bEqual, true, "filter equal");
	});
	QUnit.module('Reduction to property', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test("Filter reduction to not existing properties returns an initial filter object", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "city", this.EQ, "Berlin");
		var oFilter2 = new Filter(this.oMsgHandler, "street", this.EQ, "Kurfürstendamm");
		var oFilterExpected = new Filter(this.oMsgHandler);
		oFilter.addAnd(oFilter1).addAnd(oFilter2);
		var oFilterReduction = oFilter.restrictToProperties(["hugo"]);
		var bEqual = oFilterReduction.isEqual(oFilterExpected);
		assert.equal(bEqual, true, "Filters are semantically equal");
		assert.notEqual(oFilterReduction, oFilter, "New instance returned");
	});
	QUnit.test("Filter reduction to existing properties returns a new instance of the filter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "city", this.EQ, "Berlin");
		oFilter.addAnd(oFilter1);
		var oFilterReduction = oFilter.restrictToProperties(["country"]);
		assert.notEqual(oFilterReduction, oFilter, "New instance returned");
	});
	QUnit.test("Filter projected to one property parameter", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "city", this.EQ, "Berlin");
		var oFilter2 = new Filter(this.oMsgHandler, "street", this.EQ, "Kurfürstendamm");
		var oFilterExpected = oFilter.copy();
		oFilter.addAnd(oFilter1).addAnd(oFilter2);
		var oFilterReduction = oFilter.restrictToProperties(["country"]);
		var bEqual = oFilterReduction.isEqual(oFilterExpected);
		assert.equal(bEqual, true, "filter equal");
	});
	QUnit.test("Filter reduced to two several parameters", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "city", this.EQ, "Berlin");
		var oFilter2 = new Filter(this.oMsgHandler, "street", this.EQ, "Kurfürstendamm");
		oFilter.addAnd(oFilter1);
		var oFilterExpected = oFilter.copy();
		oFilter.addAnd(oFilter2);
		var oFilterReduction = oFilter.restrictToProperties(["country", "city"]);
		var bEqual = oFilterReduction.isEqual(oFilterExpected);
		assert.equal(bEqual, true, "filter equal");
	});
	QUnit.test("Filter reduced to an empty array of properties", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilter1 = new Filter(this.oMsgHandler, "city", this.EQ, "Berlin");
		var oFilter2 = new Filter(this.oMsgHandler, "street", this.EQ, "Kurfürstendamm");
		oFilter.addAnd(oFilter1);
		var oFilterExpected = new Filter(this.oMsgHandler);
		oFilter.addAnd(oFilter2);
		var oFilterReduction = oFilter.restrictToProperties([]);
		var bEqual = oFilterReduction.isEqual(oFilterExpected);
		assert.equal(bEqual, true, "filter equal");
	});
	QUnit.module('Copy', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test("copy of filters", function(assert) {
		var oFilter1 = new Filter(this.oMsgHandler, "country", this.LE, "BRA");
		var oFilterCopied = oFilter1.copy();
		var bEqual = oFilter1.isEqual(oFilterCopied);
		assert.equal(bEqual, true, "copied filter equal");
		oFilter1 = new Filter(this.oMsgHandler);
		oFilterCopied = oFilter1.copy();
		bEqual = oFilter1.isEqual(oFilterCopied);
		assert.equal(bEqual, true, "copied filter with initial values equal");
		oFilter1 = this.getCountryOrExpr();
		oFilterCopied = oFilter1.copy();
		bEqual = oFilter1.isEqual(oFilterCopied);
		assert.equal(bEqual, true, "copied filter with complex structure equal");
	});
	QUnit.module('Create selection expression from array', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test("create selection expression from array 1", function(assert) {
		var data = [ {
			'country' : "ARG",
			'city' : "BUE"
		}, {
			'country' : "BRA",
			'city' : "RIO"
		}, {
			'country' : "RUS",
			'city' : "MOS"
		}, {
			'country' : "USA",
			'city' : "ATL"
		} ];
		var oFilter = Filter.createFromArray(this.oMsgHandler, [ 'country', 'city' ], data, [ 0, 1, 2 ]);
		var oFilterCompare = this.getCountryCityExpr();
		var bEqual = oFilterCompare.isEqual(oFilter);
		assert.equal(bEqual, true, "filter created from array is equal to country city filter from helper");
	});
	QUnit.test("create selection expression from array 2", function(assert) {
		var data = [ {
			'country' : "USA",
			'city' : "ATL"
		}, {
			'country' : "ARG",
			'city' : "BUE"
		}, {
			'country' : "USA",
			'city' : "PAL"
		}, {
			'country' : "BRA",
			'city' : "RIO"
		}, {
			'country' : "RUS",
			'city' : "MOS"
		} ];
		var oFilter = Filter.createFromArray(this.oMsgHandler, [ 'country' ], data, [ 1, 3, 4 ]);
		var oFilterCompare = this.getCountryOrExpr();
		var bEqual = oFilterCompare.isEqual(oFilter);
		assert.equal(bEqual, true, "different constructed selections equal");
	});
	QUnit.test("create selection expression from  array 3", function(assert) {
		var data = [ {
			'country' : "ARG",
			'city' : "BUE"
		}, {
			'country' : "BRA",
			'city' : "RIO"
		}, {
			'country' : "RU1",
			'city' : "MOS"
		} ];
		// country was changed - no longer equal
		var oFilter = Filter.createFromArray(this.oMsgHandler, [ 'country' ], data, [ 0, 1, 2 ]);
		var oFilterCompare = this.getCountryOrExpr();
		var bEqual = oFilterCompare.isEqual(oFilter);
		assert.equal(bEqual, false, "constructed selections  with different data not equal");
	});
	QUnit.test("create selection expression from array 4", function(assert) {
		var data = [ {
			'country' : "ARG",
			'city' : "BUE"
		}, {
			'country' : "BRA",
			'city' : "RIO"
		}, {
			'country' : "RUS",
			'city' : "MO1"
		} ];
		// city was changed
		var oFilter = Filter.createFromArray(this.oMsgHandler, [ 'country', 'city' ], data, [ 0, 1, 2 ]);
		var oFilterCompare = this.getCountryCityExpr();
		var bEqual = oFilterCompare.isEqual(oFilter);
		assert.equal(bEqual, false, "constructed selections  with different data not equal");
	});
	QUnit.test("create selection expression from array superflous line in array", function(assert) {
		var data = [ {
			'country' : "ARG",
			'city' : "BUE"
		}, {
			'country' : "BRA",
			'city' : "RIO"
		}, {
			'country' : "RUS",
			'city' : "MO1"
		}, {
			'country' : "NotUsed",
			'city' : "MO1"
		} ];
		// city was changed
		var oFilter = Filter.createFromArray(this.oMsgHandler, [ 'country', 'city' ], data, [ 0, 1, 2 ]);
		var oFilterCompare = this.getCountryCityExpr();
		var bEqual = oFilterCompare.isEqual(oFilter);
		assert.equal(bEqual, false, "constructed selections  with different data not equal");
	});
	QUnit.test("create selection expression from array superflous line in indices", function(assert) {
		var data = [ {
			'country' : "ARG",
			'city' : "BUE"
		}, {
			'country' : "BRA",
			'city' : "RIO"
		}, {
			'country' : "RUS",
			'city' : "MO1"
		} ];
		// city was changed
		var oFilter = Filter.createFromArray(this.oMsgHandler, [ 'country', 'city' ], data, [ 0, 1, 2, 3, 5 ]);
		var oFilterCompare = this.getCountryCityExpr();
		var bEqual = oFilterCompare.isEqual(oFilter);
		assert.equal(bEqual, false, "constructed selections  with different data not equal");
	});
	QUnit.test("create selection expression from array - no indices", function(assert) {
		var data = [ {
			'country' : "ARG",
			'city' : "BUE"
		}, {
			'country' : "BRA",
			'city' : "RIO"
		}, {
			'country' : "RUS",
			'city' : "MO1"
		} ];
		// city was changed
		var oFilter = Filter.createFromArray(this.oMsgHandler, [ 'country', 'city' ], data, []);
		var oFilterCompare = new Filter(this.oMsgHandler);
		var bEqual = oFilterCompare.isEqual(oFilter);
		assert.equal(bEqual, true, "no indices result in empty filter");
	});
	QUnit.module('Retrieve terms by property', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test("First term twice from conjunction", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, 'PropertyToExtract', this.EQ, '10');
		oFilter.addOr('PropertyOfNoInterestOne', this.GT, '100');
		oFilter.addOr('PropertyOfNoInterestTwo', this.LT, '200');
		var oNextLevelFilter = new Filter(this.oMsgHandler, 'PropertyToExtract', this.EQ, '20');
		oNextLevelFilter.addOr('PropertyOfNoInterestOne', this.GT, '120');
		oNextLevelFilter.addOr('PropertyOfNoInterestTwo', this.LT, '220');
		var oCombinedFilter = new Filter(this.oMsgHandler, oFilter);
		oCombinedFilter.addAnd(oNextLevelFilter);
		var aTerms = oCombinedFilter.getFilterTermsForProperty('PropertyToExtract');
		assert.equal(aTerms.length, 2, 'Two filter terms matching the property name expected');
		assert.equal(aTerms[0].getValue(), '10', 'First term in result is fist term added in filter');
		assert.equal(aTerms[1].getValue(), '20', 'Second term in result is second term added in filter');
	});
	QUnit.test("Middle term twice from conjunction", function(assert) {
		var oFilter = new Filter(this.oMsgHandler, 'PropertyOfNoInterestTwo', this.EQ, '10');
		oFilter.addOr('PropertyToExtract', this.GT, '100');
		oFilter.addOr('PropertyOfNoInterestTwo', this.LT, '200');
		var oNextLevelFilter = new Filter(this.oMsgHandler, 'PropertyOfNoInterestTwo', this.EQ, '20');
		oNextLevelFilter.addOr('PropertyToExtract', this.GT, '120');
		oNextLevelFilter.addOr('PropertyOfNoInterestTwo', this.LT, '220');
		var oCombinedFilter = new Filter(this.oMsgHandler, oFilter);
		oCombinedFilter.addAnd(oNextLevelFilter);
		var aTerms = oCombinedFilter.getFilterTermsForProperty('PropertyToExtract');
		assert.equal(aTerms.length, 2, 'Two filter terms matching the property name expected');
		assert.equal(aTerms[0].getValue(), '100', 'First term in result is fist term added in filter');
		assert.equal(aTerms[1].getValue(), '120', 'Second term in result is second term added in filter');
	});
	QUnit.module('Create empty selection', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test("Basic test", function(assert) {
		var oFilter = Filter.createEmptyFilter(this.oMsgHandler, [ 'PropertyOfNoInterest' ]);
		var oFilterCompare = new Filter(this.oMsgHandler, 'PropertyOfNoInterest', this.EQ, '');
		oFilterCompare.addAnd(new Filter(this.oMsgHandler, 'PropertyOfNoInterest', this.NE, ''));
		assert.equal(oFilter.isEqual(oFilterCompare), true, "right conjunction created");
		assert.equal(oFilter.isConsistentWithFilter('PropertyOfNoInterest', ''), false, "nothing contained");
		assert.equal(oFilter.isConsistentWithFilter('PropertyOfNoInterestTwo', ''), true, "nothing contained");
	});
	QUnit.module('Overwrite a filter with properties of another filter', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test("Overwrite with initial filter", function(assert) {
		var oFilter1 = new Filter(this.oMsgHandler, "PropertyOfNoInterestOne", this.EQ, "value1");
		var oFilter2 = new Filter(this.oMsgHandler);
		var oOverwrittenFilter = oFilter1.overwriteWith(oFilter2);
		var oFilterCompare = new Filter(this.oMsgHandler, "PropertyOfNoInterestOne", this.EQ, "value1");
		assert.ok(oOverwrittenFilter.isEqual(oFilterCompare), "Nothing to be overwritten - result is the same filter");
	});
	QUnit.test("Overwrite with disjunctive filter", function(assert) {
		var oFilter1 = new Filter(this.oMsgHandler, "PropertyOfNoInterestOne", this.EQ, "value1");
		oFilter1.addAnd(new Filter(this.oMsgHandler, "PropertyOfNoInterestTwo", this.EQ, "value2"));
		var oFilter2 = new Filter(this.oMsgHandler, "PropertyOfNoInterestThree", this.EQ, "value3");
		var oFilterCompare = new Filter(this.oMsgHandler, oFilter1.copy()).addAnd(oFilter2);
		var oOverwrittenFilter = oFilter1.overwriteWith(oFilter2);
		assert.ok(oOverwrittenFilter.isEqual(oFilterCompare), "Filter merged correctly");
	});
	QUnit.test("Overwrite filter with same properties", function(assert) {
		var oFilter1 = new Filter(this.oMsgHandler, "PropertyOfNoInterestOne", this.EQ, "value1");
		oFilter1.addAnd(new Filter(this.oMsgHandler, "PropertyOfNoInterestTwo", this.EQ, "value2"));
		var oFilter2 = new Filter(this.oMsgHandler, "PropertyOfNoInterestOne", this.EQ, "value3");
		var oFilterCompare = new Filter(this.oMsgHandler, oFilter2.copy()).addAnd(new Filter(this.oMsgHandler, "PropertyOfNoInterestTwo", this.EQ, "value2"));
		var oOverwrittenFilter = oFilter1.overwriteWith(oFilter2);
		assert.ok(oOverwrittenFilter.isEqual(oFilterCompare), "Filter merged correctly");
	});
	QUnit.module('Transform into UI5 filter', {
		beforeEach : function() {
			this.oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
			this.Filter = Filter;
		}
	});
	QUnit.test("Complex filter", function(assert) {
		var CostingAreaFilter1 = new Filter(this.oMsgHandler, "CoArea", constants.FilterOperators.EQ, "1000");
		var CostCenterFilter1 = new Filter(this.oMsgHandler, "CostCenter", constants.FilterOperators.EQ, "11000");
		var CostCenterCompoundFilter1 = CostCenterFilter1.addAnd(CostingAreaFilter1);
		var CostingAreaFilter2 = new Filter(this.oMsgHandler, "CoArea", constants.FilterOperators.EQ, "2000");
		var CostCenterFilter2 = new Filter(this.oMsgHandler, "CostCenter", constants.FilterOperators.EQ, "22000");
		var CostCenterCompoundFilter2 = CostingAreaFilter2.addAnd(CostCenterFilter2);
		var AllCostCenterCompoundFilter = new Filter(this.oMsgHandler, CostCenterCompoundFilter1).addOr(CostCenterCompoundFilter2);
		var CompanyCodeFilter = new Filter(this.oMsgHandler, "CompanyCode", constants.FilterOperators.EQ, "1000");
		var YearFilter = new Filter(this.oMsgHandler, "Year", constants.FilterOperators.BT, 2014, 2015);
		var topFilter = new Filter(this.oMsgHandler, AllCostCenterCompoundFilter).addAnd(CompanyCodeFilter);
		topFilter = topFilter.addAnd(YearFilter);
		// example above in this format
		// Please don't remove below structure, as it visualizes the structure of the Filter
		//		var expected = {
		//			bAnd : true,
		//			aFilters : [ {
		//				bAnd : false,
		//				aFilters : [ {
		//					bAnd : true,
		//					aFilters : [ {
		//						sOperator : "EQ",
		//						sPath : "CostCenter",
		//						oValue1 : "11000"
		//					}, {
		//						sOperator : "EQ",
		//						sPath : "CoArea",
		//						oValue1 : "1000"
		//					} ]
		//				}, {
		//					bAnd : true,
		//					aFilters : [ {
		//						sOperator : "EQ",
		//						sPath : "CoArea",
		//						oValue1 : "2000"
		//					}, {
		//						sOperator : "EQ",
		//						sPath : "CostCenter",
		//						oValue1 : "22000"
		//					} ]
		//				} ]
		//			}, {
		//				sOperator : "EQ",
		//				sPath : "CompanyCode",
		//				oValue1 : "1000"
		//			}, {
		//				sOperator : "BT",
		//				sPath : "Year",
		//				oValue1 : 2014,
		//				oValue2: 2015
		//			} ]
		//		};
		var result = topFilter.mapToSapUI5FilterExpression();
		assert.ok(result instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.oValue1, undefined, "Value 1 is undefined");
		assert.strictEqual(result.oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.sPath, undefined, "Path is undefined");
		assert.strictEqual(result.sOperator, undefined, "Operator is undefined");
		assert.strictEqual(result.bAnd, true, "And is true");
		assert.strictEqual(result.aFilters.length, 3, "3 FilterObjects contained");

		assert.ok(result.aFilters[0] instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.aFilters[0].oValue1, undefined, "Value 1 is undefined");
		assert.strictEqual(result.aFilters[0].oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.aFilters[0].sPath, undefined, "Path is undefined");
		assert.strictEqual(result.aFilters[0].sOperator, undefined, "Operator is undefined");
		assert.strictEqual(result.aFilters[0].bAnd, false, "And is false");
		assert.strictEqual(result.aFilters[0].aFilters.length, 2, "2 FilterObjects contained");

		assert.ok(result.aFilters[0].aFilters[0] instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.aFilters[0].aFilters[0].oValue1, undefined, "Value 1 is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[0].oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[0].sPath, undefined, "Path is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[0].sOperator, undefined, "Operator is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[0].bAnd, true, "And is true");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters.length, 2, "2 FilterObjects contained");

		assert.ok(result.aFilters[0].aFilters[0].aFilters[0] instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[0].oValue1, "11000", "Value 1 is 11000");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[0].oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[0].sPath, "CostCenter", "Path is CostCenter");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[0].sOperator, "EQ", "Operator is equal");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[0].bAnd, undefined, "And is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[0].aFilters, undefined, "No FilterObjects contained");

		assert.ok(result.aFilters[0].aFilters[0].aFilters[1] instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[1].oValue1, "1000", "Value 1 is 1000");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[1].oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[1].sPath, "CoArea", "Path is CoArea");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[1].sOperator, "EQ", "Operator is equal");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[1].bAnd, undefined, "And is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[0].aFilters[1].aFilters, undefined, "No FilterObjects contained");

		assert.ok(result.aFilters[0].aFilters[1].aFilters[0] instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[0].oValue1, "2000", "Value 1 is 2000");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[0].oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[0].sPath, "CoArea", "Path is CoArea");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[0].sOperator, "EQ", "Operator is equal");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[0].bAnd, undefined, "And is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[0].aFilters, undefined, "No FilterObjects contained");

		assert.ok(result.aFilters[0].aFilters[1].aFilters[1] instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[1].oValue1, "22000", "Value 1 is 22000");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[1].oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[1].sPath, "CostCenter", "Path is CostCenter");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[1].sOperator, "EQ", "Operator is equal");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[1].bAnd, undefined, "And is undefined");
		assert.strictEqual(result.aFilters[0].aFilters[1].aFilters[1].aFilters, undefined, "No FilterObjects contained");

		assert.ok(result.aFilters[1] instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.aFilters[1].oValue1, "1000", "Value 1 is 1000");
		assert.strictEqual(result.aFilters[1].oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.aFilters[1].sPath, "CompanyCode", "Path is CompanyCode");
		assert.strictEqual(result.aFilters[1].sOperator, "EQ", "Operator is equal");
		assert.strictEqual(result.aFilters[1].bAnd, undefined, "And is undefined");
		assert.strictEqual(result.aFilters[1].aFilters, undefined, "No FilterObjects contained");

		assert.ok(result.aFilters[2] instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.aFilters[2].oValue1, 2014, "Value 1 is 2014");
		assert.strictEqual(result.aFilters[2].oValue2, 2015, "Value 2 is 2015");
		assert.strictEqual(result.aFilters[2].sPath, "Year", "Path is Year");
		assert.strictEqual(result.aFilters[2].sOperator, "BT", "Operator is between");
		assert.strictEqual(result.aFilters[2].bAnd, undefined, "And is undefined");
		assert.strictEqual(result.aFilters[2].aFilters, undefined, "No FilterObjects contained");
	});
	QUnit.test("Empty filter", function(assert) {
		var topFilter = new Filter(this.oMsgHandler);
		var result = topFilter.mapToSapUI5FilterExpression();

		assert.ok(result instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.oValue1, undefined, "Value 1 is undefined");
		assert.strictEqual(result.oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.sPath, undefined, "Path is undefined");
		assert.strictEqual(result.sOperator, undefined, "Operator is undefined");
		assert.strictEqual(result.bAnd, undefined, "And is undefined");
		assert.deepEqual(result.aFilters, [], "FilterArray is empty");
	});
	QUnit.test("Deep empty filter", function(assert) {
		var topFilter = new Filter(this.oMsgHandler);
		topFilter.addAnd(topFilter.copy());
		topFilter.addAnd(topFilter.copy());
		var result = topFilter.mapToSapUI5FilterExpression();

		assert.ok(result instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.oValue1, undefined, "Value 1 is undefined");
		assert.strictEqual(result.oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.sPath, undefined, "Path is undefined");
		assert.strictEqual(result.sOperator, undefined, "Operator is undefined");
		assert.deepEqual(result.aFilters, [], "FilterArray is empty");
	});
	QUnit.test("Simple filter term", function(assert) {
		var topFilter = new Filter(this.oMsgHandler, "A", "EQ", "1");
		var result = topFilter.mapToSapUI5FilterExpression();
		assert.ok(result instanceof Ui5Filter, "Correct instance returned");
		assert.strictEqual(result.oValue1, "1", "Value 1 is 1");
		assert.strictEqual(result.oValue2, undefined, "Value 2 is undefined");
		assert.strictEqual(result.sPath, "A", "Path is A");
		assert.strictEqual(result.sOperator, "EQ", "Operator is undefined");
		assert.strictEqual(result.bAnd, undefined, "And is undefined");
		assert.deepEqual(result.aFilters, undefined, "FilterArray is undefined");
	});
	QUnit.module('Transform back from UI5 filter', {
		beforeEach : function() {
			this.oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
			this.Filter = Filter;
		},
		assertTransformToInternalAndBackResultInOrigin : function(assert, originalUI5Filter) {
			var internalFilter = this.Filter.transformUI5FilterToInternal(this.oMsgHandler, originalUI5Filter);
			var backTransformedUI5Filter = internalFilter.mapToSapUI5FilterExpression();
			assert.deepEqual(backTransformedUI5Filter, originalUI5Filter, 'UI5 filter object transformed to internal filter and back to UI5 filter results in origin');
		},
		equalityTermA : new Ui5Filter({
			operator : "EQ",
			path : "PropertyOne",
			value1 : "ValueA"
		}),
		equalityTermB : new Ui5Filter({
			operator : "EQ",
			path : "PropertyOne",
			value1 : "ValueB"
		}),
		betweenTerm : new Ui5Filter({
			operator : "BT",
			path : "PropertyOne",
			value1 : "lowValue",
			value2 : "highValue"
		})
	});
	QUnit.test('Single term', function(assert) {
		this.assertTransformToInternalAndBackResultInOrigin(assert, this.betweenTerm);
	});
	QUnit.test('AND	on top level with two terms', function(assert) {
		this.assertTransformToInternalAndBackResultInOrigin(assert, new Ui5Filter({
			and : true,
			filters : [ this.equalityTermA, this.equalityTermB ]
		}));
	});
	QUnit.test('OR on top level with two terms', function(assert) {
		var filter =  new Ui5Filter({
			and : false,
			filters : [ this.equalityTermA, this.equalityTermB ]
		});
		filter.bAnd = false;
		this.assertTransformToInternalAndBackResultInOrigin(assert, filter);
	});
	QUnit.test('AND on top level, two ORs with two terms each on sublevel one', function(assert) {
		var filterA = new Ui5Filter({
			and : false,
			filters : [ this.equalityTermA, this.equalityTermB ]
		});
		filterA.bAnd = false;
		var filterB = new Ui5Filter({
			and : false,
			filters : [ this.equalityTermA, this.equalityTermB ]
		});
		filterB.bAnd = false;
		this.assertTransformToInternalAndBackResultInOrigin(assert, new Ui5Filter({
			and : true,
			filters : [ filterA , filterB]
		}));
	});
	QUnit.test('OR on top level, two ORs with two terms each on sublevel one', function(assert) {
		var filterA = new Ui5Filter({
			and : false,
			filters : [ this.equalityTermA, this.equalityTermB ]
		});
		filterA.bAnd = false;
		var filterB = new Ui5Filter({
			and : false,
			filters : [ this.equalityTermA, this.equalityTermB ]
		});
		filterB.bAnd = false;
		var topFilter = new Ui5Filter({
			and : false,
			filters : [filterA, filterB]
		});
		topFilter.bAnd = false;
		this.assertTransformToInternalAndBackResultInOrigin(assert, topFilter);
	});
	QUnit.test('AND on top level, two ORs with two logical AND terms', function(assert) {
		var filterA = new Ui5Filter({
			and : false,
			filters : [ new Ui5Filter({
				and: true,
				filters: [this.equalityTermA, this.equalityTermB]
			}), new Ui5Filter({
				and: true,
				filters: [this.equalityTermA, this.equalityTermB]
			})]
		});
		filterA.bAnd = false;
		this.assertTransformToInternalAndBackResultInOrigin(assert, new Ui5Filter({
			and : true,
			filters : [ filterA, filterA]
		}));
	});
	QUnit.test('AND on top level over asymetric subtrees', function(assert) {
		var filter = new Ui5Filter({
				and : false,
				filters : [ new Ui5Filter({
					and : true,
					filters : [ this.equalityTermA, this.equalityTermB ]
				}), new Ui5Filter({
					and : true,
					filters : [ this.betweenTerm, this.equalityTermB ]
				}), this.betweenTerm ]
			});
		filter.bAnd = false;
		this.assertTransformToInternalAndBackResultInOrigin(assert, new Ui5Filter({
			and : true,
			filters : [ this.betweenTerm, filter]
		}));
	});
	QUnit.module('Check for disjunction of single terms', {
		beforeEach : function() {
			this.oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
			this.Filter = Filter;
		}
	});
	QUnit.test('Filter contains conjunction with one disjunction over single terms', function(assert) {
		var orFilter = new Filter(this.oMsgHandler);
		orFilter.addOr('propertyOne', 'EQ', 'value1');
		orFilter.addOr('propertyOne', 'EQ', 'value2');

		var andFilter = new Filter(this.oMsgHandler);
		andFilter.addAnd(orFilter);
		assert.ok(andFilter.isDisjunctionOverEqualities(), 'Filter contains disjunction over single terms');
	});
	QUnit.test('Filter contains disjunction of single terms', function(assert) {
		var filter = new Filter(this.oMsgHandler);
		filter.addOr('propertyOne', 'EQ', 'value1');
		filter.addOr('propertyOne', 'EQ', 'value2');

		assert.ok(filter.isDisjunctionOverEqualities(), 'Filter contains disjunction over single terms');
	});
	QUnit.test('Filter contains conjunction on first level', function(assert) {
		var filter = new Filter(this.oMsgHandler);
		filter.addAnd('propertyOne', 'EQ', 'value2');
		filter.addAnd('propertyOne', 'EQ', 'value3');

		assert.ok(!filter.isDisjunctionOverEqualities(), 'Filter contains conjunction');
	});
	QUnit.test('Filter contains conjunction on second level', function(assert) {
		var filterAnd = new Filter(this.oMsgHandler); 
		filterAnd.addAnd('propertyOne', 'EQ', 'value1');
		filterAnd.addAnd('propertyOne', 'EQ', 'value2');
		
		var filter = new Filter(this.oMsgHandler); 
		filter.addOr('propertyOne', 'EQ', 'value3');
		filter.addOr(filterAnd);
		
		assert.ok(!filter.isDisjunctionOverEqualities(), 'Filter contains conjunction');
	});
	QUnit.test('Filter contains non-equality operator', function(assert) {
		var filter = new Filter(this.oMsgHandler); 
		filter.addOr('propertyOne', 'EQ', 'value1');
		filter.addOr('propertyOne', 'BT', 'value2', 'value3');
		
		assert.ok(!filter.isDisjunctionOverEqualities(), 'Filter contains non-equality operator');
	});
	QUnit.test('Filter contains different properties', function(assert) {
		var filter = new Filter(this.oMsgHandler); 
		filter.addOr('propertyOne', 'EQ', 'value1');
		filter.addOr('propertyTwo', 'EQ', 'value2');
		
		assert.ok(!filter.isDisjunctionOverEqualities(), 'Filter contains different properties');
	});

	/**
	 * Proof by structural induction
	 */
	QUnit.module('Filter.traverse() - contract with visitor', {
		beforeEach: function (/* assert */) {
			var context = this;
			jQuery.extend(this, constants.FilterOperators);
			this.messageHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
			this.createFilter = function (name, op, value) { 									// optional params
				return new Filter(context.messageHandler, name, op, value);
			};
			/**
			 * @constructor
			 */
			function EmptyVisitor() {
				this.processAnd = function(filter, aFilters) {
				};
				this.processOr = function(filter, aFilters) {
				};
				this.processTerm = function(term) {
				};
				this.processEmptyFilter = function() {
				};
				this.process = function(filter) {
				};
			}
			this.visitor = new EmptyVisitor();
			this.spyProcess = sinon.spy( this.visitor, 'process');
			this.spyProcessAnd = sinon.spy( this.visitor, 'processAnd');
			this.spyProcessOr = sinon.spy( this.visitor, 'processOr');
			this.spyProcessTerm = sinon.spy( this.visitor, 'processTerm');
			this.spyProcessEmptyFilter = sinon.spy( this.visitor, 'processEmptyFilter');
		}
	});
	QUnit.test('traverse empty filter - shall call visitor.processEmptyFilter()', function (assert) {
		var filter = this.createFilter();

		filter.traverse(this.visitor);

		assert.strictEqual(this.spyProcessAnd.callCount, 0, 'spyProcessAnd');
		assert.strictEqual(this.spyProcessOr.callCount, 0, 'spyProcessOr');
		assert.strictEqual(this.spyProcessTerm.callCount, 0, 'spyProcessTerm');
		assert.strictEqual(this.spyProcessEmptyFilter.callCount, 1, 'then processEmptyFilter called once');
		assert.strictEqual(this.spyProcess.callCount, 0, 'then process not called ');
	});
	QUnit.test('traverse Filter(empty filter) - shall call visitor.processEmptyFilter(). Traverse shall not pass indirection to visitor', function (assert) {
		var emptyFilter = this.createFilter();
		var filter = new Filter( this.messageHandler, emptyFilter);

		filter.traverse(this.visitor);

		assert.strictEqual(this.spyProcessAnd.callCount, 0, 'spyProcessAnd');
		assert.strictEqual(this.spyProcessOr.callCount, 0, 'spyProcessOr');
		assert.strictEqual(this.spyProcessTerm.callCount, 0, 'spyProcessTerm');
		assert.strictEqual(this.spyProcess.callCount, 0, 'spyProcess');
		assert.strictEqual(this.spyProcessEmptyFilter.callCount, 1, 'then processEmptyFilter called once');
	});
	QUnit.test('traverse A=1 filter', function (assert) {
		var filter = this.createFilter('A', this.EQ, '1');

		filter.traverse(this.visitor);

		assert.strictEqual(this.spyProcess.callCount, 0, 'spyProcess');
		assert.strictEqual(this.spyProcessAnd.callCount, 0, 'spyProcessAnd');
		assert.strictEqual(this.spyProcessOr.callCount, 0, 'spyProcessOr');
		assert.strictEqual(this.spyProcessTerm.callCount, 1, 'spyProcessTerm');
		assert.strictEqual(this.spyProcessTerm.getCall(0).args[0].getProperty(), 'A', 'term');
		assert.strictEqual(this.spyProcessTerm.getCall(0).args[0].getValue(), '1', 'value');
	});
	QUnit.test('traverse OR(A=1, A=2) filter', function (assert) {
		var filter = this.createFilter('A', this.EQ, '1').addOr(this.createFilter('A', this.EQ, '2'));

		filter.traverse(this.visitor);

		assert.strictEqual(this.spyProcess.callCount, 0, 'spyProcess');
		assert.strictEqual(this.spyProcessAnd.callCount, 0, 'spyProcessAnd');
		assert.strictEqual(this.spyProcessOr.callCount, 1, 'spyProcessOr');
		assert.strictEqual(this.spyProcessTerm.callCount, 0, 'spyProcessTerm');
		assert.strictEqual(this.spyProcessOr.getCall(0).args[0].getProperty(), 'A', 'term');
		assert.strictEqual(this.spyProcessOr.getCall(0).args[0].getValue(), '1', 'value');
		assert.strictEqual(this.spyProcessOr.getCall(0).args[1][0].getFilterTerms()[0].getValue(), '2', 'value');
	});
	QUnit.test('traverse AND(A=1, A=2) filter', function (assert) {
		var filter = this.createFilter('A', this.EQ, '1').addAnd(this.createFilter('A', this.EQ, '2'));

		filter.traverse(this.visitor);

		assert.strictEqual(this.spyProcess.callCount, 0, 'spyProcess');
		assert.strictEqual(this.spyProcessAnd.callCount, 1, 'spyProcessAnd');
		assert.strictEqual(this.spyProcessOr.callCount, 0, 'spyProcessOr');
		assert.strictEqual(this.spyProcessTerm.callCount, 0, 'spyProcessTerm');
		assert.strictEqual(this.spyProcessAnd.getCall(0).args[0].getProperty(), 'A', 'term');
		assert.strictEqual(this.spyProcessAnd.getCall(0).args[0].getValue(), '1', 'value');
		assert.strictEqual(this.spyProcessAnd.getCall(0).args[1][0].getFilterTerms()[0].getValue(), '2', 'value');
	});
	QUnit.module('Filter.mapToSelectOptions()', {
		beforeEach : function (assert){
			this.msgH = new DoubleMessageHandler().doubleCheckAndMessaging();
			this.getAllParameters = function (callback){
				callback(['pA', 'pB']);
			};
		}
	});
	QUnit.test('When filter is empty', function (assert){
		var filter = new Filter(this.msgH);
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, {}, 'Empty selectOptions are returned');
		});
	});
	QUnit.test('Simple equation', function(assert){
		var filter = new Filter(this.msgH, 'A', 'eq', '1');
		var expect = {
				Parameters: [],
				SelectOptions: [{
					PropertyName : 'A',
					Ranges : [{
						Sign : 'I',
						Option : 'EQ',
						Low : '1'
					}]
				}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions returned');
		});
	});
	QUnit.test('Simple range', function(assert){
		var filter = new Filter(this.msgH, 'A', 'bt', '1', '2');
		var expect = {
				Parameters: [],
				SelectOptions: [{
					PropertyName : 'A',
					Ranges : [{
						Sign : 'I',
						Option : 'BT',
						Low : '1',
						High: '2'
					}]
				}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions returned');
		});
	});
	QUnit.test('Range with high = 0', function(assert){
		var filter = new Filter(this.msgH, 'A', 'bt', '1', 0);
		var expect = {
				Parameters: [],
				SelectOptions: [{
					PropertyName : 'A',
					Ranges : [{
						Sign : 'I',
						Option : 'BT',
						Low : '1',
						High: 0
					}]
				}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions returned');
		});
	});
	QUnit.test('Range with high = undefined', function(assert){
		var filter = new Filter(this.msgH, 'A', 'bt', '1', undefined);
		var expect = {
				Parameters: [],
				SelectOptions: [{
					PropertyName : 'A',
					Ranges : [{
						Sign : 'I',
						Option : 'BT',
						Low : '1'
					}]
				}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions returned');
		});
	});
	QUnit.test('StartsWith converted to CP', function(assert){
		var filter = new Filter(this.msgH, 'A', 'StartsWith', '1');
		var expect = {
			Parameters: [],
			SelectOptions: [{
				PropertyName : 'A',
				Ranges : [{
					Sign : 'I',
					Option : 'CP',
					Low : '1*'
				}]
			}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions returned');
		});
	});
	QUnit.test('EndsWith converted to CP', function(assert){
		var filter = new Filter(this.msgH, 'A', 'EndsWith', '1');
		var expect = {
			Parameters: [],
			SelectOptions: [{
				PropertyName : 'A',
				Ranges : [{
					Sign : 'I',
					Option : 'CP',
					Low : '*1'
				}]
			}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions returned');
		});
	});
	QUnit.test('Contains converted to CP', function(assert){
		var filter = new Filter(this.msgH, 'A', 'Contains', '1');
		var expect = {
			Parameters: [],
			SelectOptions: [{
				PropertyName : 'A',
				Ranges : [{
					Sign : 'I',
					Option : 'CP',
					Low : '*1*'
				}]
			}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions returned');
		});
	});
	QUnit.test('Disjunction over equalities', function(assert){
		var filter = new Filter(this.msgH);
		filter.addOr('A','eq','1');
		filter.addOr('A','eq','2');
		var expect = {
				Parameters: [],
				SelectOptions: [{
					PropertyName : 'A',
					Ranges : [{
						Sign : 'I',
						Option : 'EQ',
						Low : '1'
					},{
						Sign : 'I',
						Option : 'EQ',
						Low : '2'
					}]
				}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions returned');
		});
	});
	QUnit.test('Conjunction with multiple properties', function(assert){
		var filter = new Filter(this.msgH);
		filter.addAnd('A','eq','1');
		filter.addAnd('B','eq','2');
		var expect = {
				Parameters: [],
				SelectOptions: [{
					PropertyName : 'A',
					Ranges : [{
						Sign : 'I',
						Option : 'EQ',
						Low : '1'
					}]
				},{
					PropertyName : 'B',
					Ranges : [{
						Sign : 'I',
						Option : 'EQ',
						Low : '2'
					}]
				}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions returned');
		});
	});
	QUnit.test('Conjunction over disjunctions', function(assert){
		var filter = new Filter(this.msgH);
		var filter1 = new Filter(this.msgH);
		var filter2 = new Filter(this.msgH);
		filter.addAnd(filter1).addAnd(filter2);
		filter1.addOr('A','eq','1');
		filter1.addOr('A','eq','2');
		filter2.addOr('B','eq','3');
		filter2.addOr('B','eq','4');
		var expect = {
				Parameters: [],
				SelectOptions: [{
					PropertyName : 'A',
					Ranges : [{
						Sign : 'I',
						Option : 'EQ',
						Low : '1'
					},{
						Sign : 'I',
						Option : 'EQ',
						Low : '2'
					}]
				},{
					PropertyName : 'B',
					Ranges : [{
						Sign : 'I',
						Option : 'EQ',
						Low : '3'
					},{
						Sign : 'I',
						Option : 'EQ',
						Low : '4'
					}]
				}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions returned');
		});
	});
	QUnit.test('Filter contains only one parameter', function(assert){
		var filter = new Filter(this.msgH, 'pA', 'eq', '1');
		var expect = {
				Parameters: [{
					PropertyName: 'pA',
					PropertyValue: '1'
				}],
				SelectOptions: []
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions with one Parameter returned');
		});
	});
	QUnit.test('Filter contains two parameters', function(assert){
		var filter = new Filter(this.msgH, 'pA', 'eq', '1');
		filter.addAnd('pB', 'eq', '2');
		var expect = {
				Parameters: [{
					PropertyName: 'pA',
					PropertyValue: '1'
				},{
					PropertyName: 'pB',
					PropertyValue: '2'
				}],
				SelectOptions: []
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions with two parameters returned');
		});
	});
	QUnit.test('Filter contains parameter and property', function(assert){
		var filter = new Filter(this.msgH);
		filter.addAnd('pA','eq','1');
		filter.addAnd('B','eq','2');
		var expect = {
				Parameters: [{
					PropertyName: 'pA',
					PropertyValue: '1'
				}],
				SelectOptions: [{
					PropertyName : 'B',
					Ranges : [{
						Sign : 'I',
						Option : 'EQ',
						Low : '2'
					}]
				}]
		};
		var promise = filter.mapToSelectOptions(this.getAllParameters);
		promise.done(function (selectOptions){
			assert.deepEqual(selectOptions, expect, 'Correct selectOptions with parameter and property returned');
		});
	});
	QUnit.module('getSingleValues', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test('Empty filter', function(assert){
		var filter = new Filter(this.oMsgHandler);
		assert.deepEqual(filter.getSingleValueTerms(), [], "THEN no single values");
	});
	QUnit.test('Filter with two single values', function(assert){
		var filter = new Filter(this.oMsgHandler, "property1", "EQ", "value1");
		filter.addAnd('property2', 'eq', '2');
		var expectedTerms = [ { 'property': "property1", 'value' : 'value1' }, { 'property' : 'property2', 'value' : '2'}];
		assert.deepEqual(filter.getSingleValueTerms(), expectedTerms, "THEN two single values");
	});
	QUnit.test('Complex filter with two single values', function(assert){
		var filter = new Filter(this.oMsgHandler, "property1", "EQ", "value1");
		filter.addAnd(this.getCountryCityExpr());
	
		filter.addAnd('property2', "EQ", '2');
		var expectedTerms = [ { 'property': "property1", 'value' : 'value1' }, { 'property' : 'property2', 'value' : '2'}];
		assert.deepEqual(filter.getSingleValueTerms(), expectedTerms, "THEN two single values");
	});
	QUnit.test('Complex Filter with no single values', function(assert){
		var filter = this.getCountryCityExpr();		
		assert.deepEqual(filter.getSingleValueTerms(), [], "THEN no single values");
	});
});
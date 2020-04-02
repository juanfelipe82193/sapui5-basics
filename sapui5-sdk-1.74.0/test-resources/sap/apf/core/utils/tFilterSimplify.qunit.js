/*
 * Copyright(c) 2015 SAP SE
 */
/*global QUnit, jQuery, sap, console, sap, sinon */

sap.ui.define("sap/apf/core/utils/tFilterSimplify", [
	"sap/apf/core/utils/filter",
	"sap/apf/core/utils/filterTerm",
	"sap/apf/core/constants",
	"sap/apf/core/utils/filterSimplify",
	"sap/apf/testhelper/doubles/messageHandler"
], function(Filter, FilterTerm, constants, filterSimplify, DoubleMessageHandler){
	'use strict';

	var CollectPropertiesAndValuesVisitor = filterSimplify.CollectPropertiesAndValuesVisitor;

	/**
	 * assumed to represent the empty filter, as observed on 23.09.2015.
	 * @param context
	 * @returns {sap.apf.utils.Filter}
	 */
	function createEmptyFilter(context) {
		return new Filter(context.messageHandler);
	}

	/**
	 * assumed to represent degenerated path filter representing AND over empty filter, as observed on 23.09.2015.
	 * @param context
	 * @returns {sap.apf.utils.Filter}
	 */
	function createFilterPointingToEmptyFilter(context) {
		var child = createEmptyFilter(context);
		return new Filter(context.messageHandler, child);
	}

	/**
	 * assumed to represent degenerated path filter representing 2 AND nodes over empty filter, as observed on 23.09.2015.
	 * @param context
	 * @returns {sap.apf.utils.Filter}
	 */
	function create2FilterChainPointingToEmptyFilter(context) {
		var child = createFilterPointingToEmptyFilter(context);
		return new Filter(context.messageHandler, child);
	}

	function eqA(context, value) {
		return new Filter(context.messageHandler, "A", context.EQ, value);
	}

	function eq(name, value, mh) {
		return new Filter(mh, name, constants.FilterOperators.EQ, value);
	}

	function wellFormedAorA(context) {
		return createEmptyFilter(context).
			addOr("A", context.EQ, 1).
			addOr('A', context.EQ, 2);
	}

	function nonWellFormedAorB(context) {
		return createEmptyFilter(context).
			addOr("A", context.EQ, 1).
			addOr('B', context.EQ, 2);
	}

	function assertIsEquationAequals1(result, assert) {
		assert.strictEqual(result.bAnd, undefined, 'filter node');
		assert.strictEqual(result.sOperator, 'EQ', 'equation');
		assert.strictEqual(result.sPath, 'A', 'property');
		assert.strictEqual(result.oValue1, '1', 'value');
	}

	/**
	 * @constructor
	 */
	function ToStringVisitor() {
		var visitor = this;
		this.processAnd = function(filter, aFilters) {
			var str = "AND(";
			str += this.process(filter);
			str += ',';
			str += this.processAndArray(aFilters);
			return str + ")";
		};
		this.processAndArray = function(aFilters) {
			var str = "";
			aFilters.forEach(function(filter, i, array) {
				str += visitor.process(filter);
				if (i < array.length - 1) {
					str += ",";
				}
			});
			return str;
		};
		this.processOr = function(filter, aFilters) {
			var str = "OR(";
			str += this.process(filter);
			str += ',';
			str += this.processOrArray(aFilters);
			return str + ")";
		};
		this.processOrArray = function(aFilters) {
			var str = "";
			aFilters.forEach(function(filter, i, array) {
				str += visitor.process(filter);
				if (i < array.length - 1) {
					str += ",";
				}
			});
			return str;
		};
		/**
		 * Terminal node filter term.
		 * @param term
		 */
		this.processTerm = function(term) {
			switch (term.getOp()) { // all:
				case constants.FilterOperators.EQ:
					return term.getProperty() + "=" + term.getValue();
				case constants.FilterOperators.BT:
					return term.getProperty() + " IN " + term.getValue() + ".." + term.getHighValue();
				default:
					if ( term.getHighValue() === undefined ) {
						return term.getOp() + "(" + term.getProperty() + ", " + term.getValue() + ")";
					}
					return term.getOp() + "(" + term.getProperty() + ", " + term.getValue() + "," + term.getHighValue() + ")";
			}
		};
		this.processEmptyFilter = function() {
			return "empty";
		};
		/**
		 * @param {sap.apf.core.utils.Filter} filter
		 */
		this.process = function(filter) {
			if ( !filter) {
				return "" + filter;
			}
			if ( filter instanceof FilterTerm ) {
				return this.processTerm( filter);
			}
			return filter.traverse(this);
		};
	}

	function filterToString(filter) {
		return new ToStringVisitor().process(filter);
	}
	function assertFilterOverSingleProperty(filter, property, nrOfFilterTerms, assert) {
		assert.strictEqual( filter.getProperties().length, 1, 'a single property expected');
		assert.strictEqual( filter.getProperties()[0], property, 'filter over <property> only' );
		assert.strictEqual( filter.getFilterTerms().length, nrOfFilterTerms, '#expected filter terms (recursively all)');
		if (!(filter.getProperties().length === 1 && filter.getProperties()[0] === property && filter.getFilterTerms().length === nrOfFilterTerms)) {
			assert.ok(false, 'filter dump:   ' + filterToString(filter));
		}
	}

	/**
	 * Create a canonical filter of one property "A" as equalities over the values.
	 * @param context
	 * @param valueList
	 * @returns {sap.apf.utils.Filter|sap.apf.core.utils.Filter|*}
	 */
	function createDisjunctionAEq(context, valueList) {
		var filter0 = new Filter(context.messageHandler, "A", context.EQ,
			valueList[0]);
		var rest = valueList.slice(1);
		var filter;
		rest.forEach(function (value) {
			filter = new Filter(context.messageHandler, "A", context.EQ, value);
			filter0.addOr(filter);
		});
		return filter0;
	}


	/**
	 * Question is if we have complete coverage of occurring tree structures. 
	 * Supposedly, every test with this.visitor is useless since the FilterPredicateS is not used in productive code.
	 */
	QUnit.module('Filter Traversal, complete testing tree structures occurring in APF', {
		beforeEach: function (/* assert */) {
			jQuery.extend(this, constants.FilterOperators);
			this.messageHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
		}
	});

	/**
	 * Test: identify disjunctive equalities on single property
	 */
	QUnit.test("CollectPropertiesAndValuesVisitor empty filter", function (assert) {
		var filter = createEmptyFilter(this);
		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();
		assert.ok(filter.traverse(collector) || true, 'CollectPropertiesAndValuesVisitor');
		assert.strictEqual(collector.getProperties().length, 0, '#properties');
		assert.strictEqual(collector.getValues().length, 0, 'length');
		assert.strictEqual(collector.isWellFormed(), true, 'isWellFormed');
	});
	QUnit.test("CollectPropertiesAndValuesVisitor A=1", function (assert) {
		var filter = createEmptyFilter(this).addOr('A', this.EQ, 1);
		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();
		assert.ok(filter.traverse(collector) || true, 'CollectPropertiesAndValuesVisitor');
		assert.strictEqual(collector.getProperties()[0], 'A', 'A');
		assert.strictEqual(collector.getValues().length, 1, 'length');
		assert.strictEqual(collector.isWellFormed(), true, 'isWellFormed');
	});
	QUnit.test("CollectPropertiesAndValuesVisitor A=1", function (assert) {
		var filter = createEmptyFilter(this).addOr('A', this.BT, 1, 5);
		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();

		assert.ok(filter.traverse(collector) || true, 'CollectPropertiesAndValuesVisitor');
		assert.strictEqual(collector.getProperties()[0], 'A', 'A');
		assert.strictEqual(collector.getValues().length, 0, 'length');
		assert.strictEqual(collector.isWellFormed(), false, 'not isWellFormed since op!==EQ');
	});

	QUnit.test("CollectPropertiesAndValuesVisitor OR(A,A)", function (assert) {
		var filter = createDisjunctionAEq(this, [11, 33]);
		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();
		assert.ok(filter.traverse(collector) || true, 'CollectPropertiesAndValuesVisitor');
		assert.strictEqual(collector.getProperties()[0], 'A', 'A');
		assert.strictEqual(collector.getProperties().length, 1, 'length');
		assert.strictEqual(collector.getValues().length, 2, 'length');
		assert.strictEqual(collector.getValues()[0], 11, 'value');
		assert.strictEqual(collector.getValues()[1], 33, 'value');
		assert.strictEqual(collector.isWellFormed(), true, 'isWellFormed');
	});
	QUnit.test("CollectPropertiesAndValuesVisitor OR(A,C,B) - isWellFormed", function (assert) {
		var filter = createEmptyFilter(this).
			addOr('A', this.EQ, 1).
			addOr('C', this.EQ, 11).
			addOr('B', this.EQ, 3);

		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();
		filter.traverse(collector);

		assert.strictEqual(collector.getProperties().length, 3, 'length');
		assert.strictEqual(collector.getProperties()[0], 'A', 'A');
		assert.strictEqual(collector.getProperties()[2], 'B', 'B');
		assert.strictEqual(collector.getValues().length, 3, 'length. Since not wellformed the values are useless anyway');
		assert.strictEqual(collector.isWellFormed(), false, 'not isWellFormed');
	});
	QUnit.test("CollectPropertiesAndValuesVisitor AND(A,A) - isWellFormed", function (assert) {
		var filter = createEmptyFilter(this).
			addAnd('A', this.EQ, 1).
			addAnd('A', this.EQ, 3);

		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();
		filter.traverse(collector);

		assert.strictEqual(collector.getValues().length, 2, 'length');
		assert.strictEqual(collector.getProperties().length, 1, 'length');
		assert.strictEqual(collector.getProperties()[0], 'A', 'A');
		assert.strictEqual(collector.getValues().length, 2, 'length');
		assert.strictEqual(collector.isWellFormed(), false, 'not isWellFormed since AND');
	});
	QUnit.test("CollectPropertiesAndValuesVisitor AND(A,B) - isWellFormed", function (assert) {
		var filter = createEmptyFilter(this).
			addAnd('A', this.EQ, 1).
			addAnd('B', this.EQ, 3);

		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();
		filter.traverse(collector);

		assert.strictEqual(collector.getValues().length, 2, 'length');
		assert.strictEqual(collector.getProperties().length, 2, 'length');
		assert.strictEqual(collector.getProperties()[0], 'A', 'A');
		assert.strictEqual(collector.getValues().length, 2, 'length');
		assert.strictEqual(collector.isWellFormed(), false, 'not isWellFormed since AND');
	});

	QUnit.test("CollectPropertiesAndValuesVisitor WHEN empty filter", function (assert) {
		var filter = createEmptyFilter(this);
		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();
		assert.ok(filter.traverse(collector) || true, 'CollectPropertiesAndValuesVisitor does not crash');
		assert.equal(collector.getValues().length, 0, 'THEN no values');
		assert.strictEqual(collector.isEmptyFilter(), true, 'THEN isEmptyFilter()');
	});

	QUnit.test("CollectPropertiesAndValuesVisitor WHEN Filter points to empty filter", function (assert) {
		var filter = createFilterPointingToEmptyFilter(this);
		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();
		assert.ok(filter.traverse(collector) || true, 'CollectPropertiesAndValuesVisitor does not crash');
		assert.equal(collector.getValues().length, 0, 'THEN no values');
		assert.strictEqual(collector.isEmptyFilter(), true, 'THEN isEmptyFilter()');
	});

	QUnit.test("CollectPropertiesAndValuesVisitor WHEN Filter chain points to empty filter", function (assert) {
		var filter = create2FilterChainPointingToEmptyFilter(this);
		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();
		assert.ok(filter.traverse(collector) || true, 'CollectPropertiesAndValuesVisitor does not crash');
		assert.equal(collector.getValues().length, 0, 'THEN no values');
		assert.strictEqual(collector.isEmptyFilter(), true, 'THEN isEmptyFilter()');
	});

	/**
	 * AND( AND(A=4711,A=2), emptyFilter). Note that a Filter always wraps a FilterTerm.
	 */
	QUnit.test("CollectPropertiesAndValuesVisitor WHEN AND equation and empty filter", function (assert) {
		var emptyFilter = createEmptyFilter(this);
		var equ1 = eqA(this, 4711);
		var equ2 = eqA(this, 2);
		var left = new Filter(this.messageHandler, equ1);
		left.addAnd(equ2);
		var top = new Filter(this.messageHandler, left);
		top.addAnd(emptyFilter);
		assert.strictEqual(top.isFilterTerm(), false, 'basics: is a filter, not a term.');
		var collector = new filterSimplify.CollectPropertiesAndValuesVisitor();
		assert.ok(top.traverse(collector) || true, 'CollectPropertiesAndValuesVisitor does not crash');
		assert.equal(collector.getValues().length, 2, 'THEN 2 values');
		assert.strictEqual(collector.isEmptyFilter(), false, 'THEN not isEmptyFilter()');
	});

	function createAndOrOrOverEqA(context) {
		var aValues1 = [1, 2, 4, 5, 6, 7, 8];
		var aValues2 = [2, 3, 4, 7, 9];
		var filter1 = createDisjunctionAEq(context, aValues1);
		var filter2 = createDisjunctionAEq(context, aValues2);
		var filter = new Filter(context.messageHandler, filter1);
		filter = filter.addAnd(filter2);
		return filter;
	}

	QUnit.test("CollectChildrenOfAndNodeVisitor WHEN input empty filter", function (assert) {
		var filter = createEmptyFilter(this);
		var collectFilterOfAnd = filter.traverse(new filterSimplify.CollectChildrenOfAndNodeVisitor());
		assert.strictEqual(collectFilterOfAnd, null, 'then return null');
	});

	QUnit.test("CollectChildrenOfAndNodeVisitor WHEN input OR", function (assert) {
		var filter = createDisjunctionAEq(this, [1, 2, 4, 5, 6, 7, 8]);
		var collectFilterOfAnd = filter.traverse(new filterSimplify.CollectChildrenOfAndNodeVisitor());
		assert.strictEqual(collectFilterOfAnd, null, 'then return null');
	});

	QUnit.test("CollectChildrenOfAndNodeVisitor WHEN AND(OR(..), OR(..))", function (assert) {
		var filter = createAndOrOrOverEqA(this);
		var collectFilterOfAnd = filter.traverse(new filterSimplify.CollectChildrenOfAndNodeVisitor());
		assert.strictEqual(collectFilterOfAnd.length, 2, 'then return an array of 2 children filter');
	});

	QUnit.test("CollectChildrenOfAndNodeVisitor of a filter which has 1 left expression (AND-filter) and 0 rest expression", function (assert) {
		var leftFilter = createAndOrOrOverEqA(this);
		var filter = new Filter(this.messageHandler, leftFilter);
		var collectFilterOfAnd = filter.traverse(new filterSimplify.CollectChildrenOfAndNodeVisitor());
		assert.strictEqual(collectFilterOfAnd.length, 2, 'then return an array of 2 children filter');
	});

	/**
	 * Objective of the overall algorithm: reduce to a Filter that has AND on
	 * top level (level 0) only and OR on each node on level 1. The leading
	 * branch(es) (subtrees) of the input Filter are received from external.
	 * They can be of any general filter structure. All trailing Filter are
	 * generated by APF. The have a regular structure: top node is an OR, all
	 * subnodes are FilterTerms with operator EQ. All equations under one OR
	 * have the same property (but different values). This is called a normal
	 * form.
	 *
	 * @see CollectPropertiesAndValuesVisitor#isWellFormed In other words: the
	 *	  resulting Filter shall be a conjunction of disjunctive normal forms.
	 *	  Hence, the algorithm shall remove all non-normal filters.
	 *	  Eliminating a filter can only be done when this filter is applied to
	 *	  the trailing filters. See the example below. Application of a filter
	 *	  happens on common properties only. This means: if filterA not is
	 *	  inNormalForm it shall be applied to all filterB where holds the have
	 *	  at least one property in common and isWellFormed (see below).
	 *	  Then, only after applying the filter to all related ones it can be
	 *	  removed from the overall Filter. Note there are gaps to be filled:
	 *	  1) a missing operation for removing a FilterTerm from a filter (in
	 *	  normal form). This is required when eliminating values from a
	 *	  FilterB when they are not contained in FilterA (FilterA.isConsistentWithFilter().
	 *	  2) a missing operation for removing a filter from a filter tree.
	 *	  This is required for a FilterA after being applied. However, for
	 *	  simplicity it is easier to completely rebuild the resulting filters
	 *	  in normal form. This shall be done.
	 *
	 * Development shall be test driven only. That is, each function shall be
	 * matched by a test. This shall comprise test coverage for different
	 * combinations of filters and filter structures. Note that it is assumed
	 * that there are sufficient tests for the Filter.isConsistentWithFilter method. If not,
	 * create those necessary for the current functionality.
	 * @see src/test/uilib/sap/apf/core/utils/tFilter.qunit.js
	 * @see src/main/uilib/sap/apf/core/utils/filter.js
	 * @see src/main/uilib/sap/apf/core/utils/filterTerm.js
	 */
	QUnit.module('GIVEN new sap.apf.core.utils.FilterReduction()', {
		beforeEach: function (/* assert */) {
			jQuery.extend(this, constants.FilterOperators);
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		}
	});

	/* The next test actually does not test a unit but demonstrates the core concept of the filter reduction.
	 * The context filter reduces the disjunction.
	 */
	QUnit.test("Basic POC of filter reduction by applying the context to a filter in normal form, using Filter.isConsistentWithFilter", function (assert) {
		var sbFilter = new Filter(this.messageHandler, "A", this.BT, 10, 20); // assumed received from external
		var internalFilter = createDisjunctionAEq(this, [9, 10, 11, 20, 22, 33]);
		var collector = new CollectPropertiesAndValuesVisitor();
		internalFilter.traverse(collector);
		var property = null;
		var tmpFiltered = [];
		if (collector.isWellFormed()) {
			property = collector.getProperties()[0];
			collector.getValues().forEach(function (value) {
				if (sbFilter.isConsistentWithFilter(property, value)) {
					tmpFiltered.push(value);
				}
			});
		}
		assert.ok(tmpFiltered.length === 3, 'length');
		assert.ok(tmpFiltered[0] === 10, '10');
		assert.ok(tmpFiltered[2] === 20, '20');
	});

	QUnit.test("intersection of two transforms [] []", function (assert) {
		var transform1 = {property: "A", values: []};
		var transform2 = {property: "A", values: []};
		var filterReduction = new filterSimplify.FilterReduction();
		var intersection1 = filterReduction.intersection(transform1, transform2);
		assert.strictEqual(intersection1.values.length, 0, 'then expected empty array');
	});

	QUnit.test("intersection of two transforms [] [...]", function (assert) {
		var transform1 = {property: "A", values: []};
		var transform2 = {property: "A", values: [1, 2, 3]};
		var filterReduction = new filterSimplify.FilterReduction();
		var intersection1 = filterReduction.intersection(transform1, transform2);
		var intersection4 = filterReduction.intersection(transform2, transform1);
		assert.strictEqual(intersection1.values.length, 0, 'then yields empty array');
		assert.strictEqual(intersection4.values.length, 0, 'then symmetric case yields empty array');
	});

	QUnit.test("intersection of two transforms with disjoint properties", function (assert) {
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var transform2 = {property: "B", values: [2, 3, 4, 7, 9]};
		var filterReduction = new filterSimplify.FilterReduction();
		var intersection1 = filterReduction.intersection(transform1, transform2);
		var intersection4 = filterReduction.intersection(transform2, transform1);
		assert.strictEqual(intersection1.values.length, 3, 'then ignores names and yields non-empty array');
		assert.strictEqual(intersection4.values.length, 3, 'then ignores names and yields non-empty array');
	});

	QUnit.test("intersection of two transforms in 4 variations", function (assert) {
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var transform2 = {property: "A", values: [2, 3, 4, 7, 9]};
		var transform3 = {property: "A", values: [10, 11]};
		var filterReduction = new filterSimplify.FilterReduction();
		var intersection1 = filterReduction.intersection(transform1, transform2);
		var intersection2 = filterReduction.intersection(transform1, transform3);
		var intersection3 = filterReduction.intersection(transform1, transform1);
		var intersection4 = filterReduction.intersection(transform2, transform1);
		assert.strictEqual(intersection1.values.length, 3, 'then return a transform with 3 values');
		assert.strictEqual(intersection4.values.length, 3, 'flipped arguments, then return a transform with 3 values');
		assert.strictEqual(intersection2.values.length, 0, 'then return a transform with 0 values');
		assert.strictEqual(intersection3.values.length, 7, 'then return a transform with 7 values');
	});

	QUnit.test("CollectChildrenOfAndNodeVisitor.process() input FilterTerm THEN returns array)", function (assert) {
		var filter = new Filter(this.messageHandler, "A", this.BT, 1, 5);
		var rightBranch = createFilterPointingToEmptyFilter(this);
		filter.addAnd(rightBranch);
		assert.strictEqual(filter.isFilterTerm(), false, 'isFilterTerm');

		var collector = new filterSimplify.CollectChildrenOfAndNodeVisitor();
		var aFilters = collector.process(filter);

		assert.strictEqual(aFilters instanceof Array, true, 'THEN returns an array, not a Filter or FilterTerm');
		assert.strictEqual(aFilters instanceof Filter, false, 'THEN not a Filter or FilterTerm');
	});

	QUnit.test("CollectChildrenOfAndNodeVisitor.process() AND(A BT 1..5, deep emptyFilter THEN returns array)", function (assert) {
		var filter = new Filter(this.messageHandler, "A", this.BT, 1, 5);
		assert.strictEqual(filter.isFilterTerm(), true, 'shall be true ');

		var collector = new filterSimplify.CollectChildrenOfAndNodeVisitor();
		var aFilters = collector.process(filter);

		assert.notStrictEqual( aFilters, undefined, 'not undefined');
		assert.notStrictEqual( aFilters, null, 'not null');
		assert.strictEqual(aFilters instanceof Array, true, 'THEN returns an array, not a Filter or FilterTerm');
		assert.strictEqual(aFilters instanceof Filter, false, 'THEN not a Filter or FilterTerm');
		assert.strictEqual(aFilters instanceof FilterTerm, false, 'THEN not a Filter or FilterTerm');
	});

	QUnit.test("filterSeparation() emptyFilter", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = createEmptyFilter(this);

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);

		assert.equal(separatedFilter.reducers.length, 0, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 0, 'disjunctions #');
	});

	QUnit.test("filterSeparation() deep emptyFilter", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = createFilterPointingToEmptyFilter(this);

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 0, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 0, 'disjunctions #');
	});

	QUnit.test("filterSeparation() AND(FilterTerm (A BT 1..5), deep emptyFilter)", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = createEmptyFilter(this).
			addAnd("A", this.BT, 1, 5).
			addAnd(createFilterPointingToEmptyFilter(this));

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 1, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 0, 'disjunctions #');
	});

	QUnit.test("filterSeparation() AND(FilterTerm A=1, deep emptyFilter)", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = createEmptyFilter(this).
			addAnd("A", this.EQ, 1).
			addAnd(createFilterPointingToEmptyFilter(this));

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 0, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 1, 'disjunctions #');
	});

	QUnit.test("filterSeparation() AND(emptyFilter, A=1)", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = createEmptyFilter(this).
			addAnd(createEmptyFilter(this)).
			addAnd("A", this.EQ, 1);

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 0, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 1, 'disjunctions #');
	});

	QUnit.test("filterSeparation() AND((A BT 1..5), A=1)", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = createEmptyFilter(this).
			addAnd("A", this.BT, 1, 5).
			addAnd('A', this.EQ, 1);

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 1, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 1, 'disjunctions #');
	});
	QUnit.test("filterSeparation() AND(OR(A,B), A=1)", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var or = createEmptyFilter(this).
			addOr("A", this.EQ, 1).
			addOr('B', this.EQ, 2);
		var filter = createEmptyFilter(this).
			addAnd(or).
			addAnd('A', this.EQ, 1);

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 1, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 1, 'disjunctions #');
	});
	QUnit.test("filterSeparation() AND(A=1, OR(A,B))", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var or = createEmptyFilter(this).
			addOr("A", this.EQ, 1).
			addOr('B', this.EQ, 2);
		var filter = createEmptyFilter(this).
			addAnd('A', this.EQ, 1).
			addAnd(or);

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 1, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 1, 'disjunctions #');
	});
	QUnit.test("filterSeparation() AND(OR(A=1,B=2), A=1, OR(A=1,B=2))", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var or = createEmptyFilter(this).
			addOr("A", this.EQ, 1).
			addOr('B', this.EQ, 2);
		var filter = createEmptyFilter(this).addAnd(or).
			addAnd('A', this.EQ, 1).
			addAnd(
			createEmptyFilter(this).
				addOr("A", this.EQ, 1).
				addOr('B', this.EQ, 2)
		);

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 2, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 1, 'disjunctions #');
	});
	QUnit.test("filterSeparation() AND(OR(A=1,B=2), A=1, OR(A=1,B=2), C=3) - alternating wellformed and non-wellformed", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var or = createEmptyFilter(this).
			addOr('A', this.EQ, 1).
			addOr('B', this.EQ, 2);
		var filter = createEmptyFilter(this).addAnd(or).
			addAnd('A', this.EQ, 1).
			addAnd(
			createEmptyFilter(this).
				addOr('A', this.EQ, 1).
				addOr('B', this.EQ, 2)
		).addAnd('C', this.EQ, 3);

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 2, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 2, 'disjunctions #');
	});
	QUnit.test("filterSeparation() AND(D=4, OR(A=1,B=2), A=1, OR(A=1,B=2), C=3) - alternating wellformed and non-wellformed", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var or = createEmptyFilter(this).
			addOr("A", this.EQ, 1).
			addOr('B', this.EQ, 2);
		var filter = createEmptyFilter(this).
			addAnd('D', this.EQ, 4).
			addAnd(or).
			addAnd('A', this.EQ, 1).
			addAnd(
			createEmptyFilter(this).
				addOr('A', this.EQ, 1).
				addOr('B', this.EQ, 2)
		).addAnd('C', this.EQ, 3);

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 2, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 3, 'disjunctions #');
	});
	QUnit.test("filterSeparation() AND((BT ...), AND(A=1,B=2))) - trailing AND tree", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = createEmptyFilter(this).
			addAnd('A', this.BT, 1,5). // non wellFormed
			addAnd(createEmptyFilter(this).
				addAnd('A', this.EQ, 1). // well-formed
				addAnd('B', this.EQ, 2)); // well-formed
		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 1, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 2, 'disjunctions #');
	});
	QUnit.test("filterSeparation() AND(nonWF, AND(wellF,wellF))) - trailing AND tree", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var trailing = createEmptyFilter(this).
			addAnd(wellFormedAorA(this)).
			addAnd(wellFormedAorA(this));
		var filter = createEmptyFilter(this).
			addAnd(nonWellFormedAorB(this)).
			addAnd(trailing);
		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 1, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 2, 'disjunctions #');
	});
	QUnit.test("filterSeparation() AND(nonWF, AND(wellF,nonWF))) - trailing AND tree", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var trailing = createEmptyFilter(this).
			addAnd(wellFormedAorA(this)).
			addAnd(nonWellFormedAorB(this));
		var filter = createEmptyFilter(this).
			addAnd(nonWellFormedAorB(this)).
			addAnd(trailing);
		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 2, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 1, 'disjunctions #');
	});
	QUnit.test("filterSeparation() AND(wellF, AND(wellF,nonWF))) - trailing AND tree", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var trailing = createEmptyFilter(this).
			addAnd(wellFormedAorA(this)).
			addAnd(nonWellFormedAorB(this));
		var filter = createEmptyFilter(this).
			addAnd(wellFormedAorA(this)).
			addAnd(trailing);
		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 1, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 2, 'disjunctions #');
	});
	QUnit.test("filterSeparation() AND(nonWF, AND(nonWF,wellF))) - trailing AND tree", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var trailing = createEmptyFilter(this).
			addAnd(nonWellFormedAorB(this)).
			addAnd(wellFormedAorA(this));
		var filter = createEmptyFilter(this).
			addAnd(nonWellFormedAorB(this)).
			addAnd(trailing);
		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 2, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 1, 'disjunctions #');
	});

	QUnit.test("filterSeparation a filter with a start filter, 1 well-formed disjunction, 1 filter term, 1 filter contains 1 term", function (assert) {
		var filterReduction = new filterSimplify.FilterReduction();
		var startFilter = createEmptyFilter(this).addOr("A", this.BT, 1, 5);
		var wellFormedFilter = createDisjunctionAEq(this, [1, 2, 3]);
		var filterTerm = new FilterTerm(this.messageHandler, "B", this.EQ, 1);
		var property = 'C';
		var obj = [];
		obj[property] = 1;

		var filterOneTerm = Filter.createFromArray(this.messageHandler, [property], [obj], [0]);

		var filter = startFilter.addAnd(wellFormedFilter);
		filter.addAnd(filterTerm);
		filter.addAnd(filterOneTerm);

		var separatedFilter = filterReduction.filterSeparation(filter, this.messageHandler);
		assert.equal(separatedFilter.reducers.length, 1, 'reducers#');
		assert.equal(separatedFilter.disjunctions.length, 3, 'disjunctions #');
	});

	QUnit.test('filterSeparation AND(AND(eq,empty), empty) - AND in left branch', function (assert) {
		var mh = this.messageHandler;
		var eqNode = eq('A', '1', mh);
		var andNode = createEmptyFilter(this).addAnd(eqNode).addAnd(createEmptyFilter(this));
		var filter = createEmptyFilter(this).addAnd(andNode).addAnd(createEmptyFilter(this));

		var filterReduction = new filterSimplify.FilterReduction();
		var separation = filterReduction.filterSeparation(filter, this.messageHandler);

		assert.strictEqual(separation.reducers.length, 0, 'reducers.length');
		assert.strictEqual(separation.disjunctions.length, 1, 'disjunctions.length');
		assert.strictEqual(separation.disjunctions[0].mapToSapUI5FilterExpression().sOperator, this.EQ, true, 'separation.disjunctions[0] equal to EQ-node');
		assert.strictEqual(separation.disjunctions[0].mapToSapUI5FilterExpression().sPath, 'A', true, 'separation.disjunctions[0] quality on A');
		assert.strictEqual(separation.disjunctions[0].mapToSapUI5FilterExpression().oValue1, '1', true, 'separation.disjunctions[0] equality equal 1');
	});
	QUnit.test('filterSeparation AND(AND(OR(eq, eq),empty), empty) - AND in left branch', function (assert) {
		var mh = this.messageHandler;
		var andNode = createEmptyFilter(this);
		var orNode = eq('A', '1', mh).addOr('A', this.EQ, '2');
		andNode.addAnd(orNode).addAnd(createEmptyFilter(this));
		var filter = createEmptyFilter(this).addAnd(andNode).addAnd(createEmptyFilter(this));

		var filterReduction = new filterSimplify.FilterReduction();
		var separation = filterReduction.filterSeparation(filter, this.messageHandler);

		assert.strictEqual(separation.reducers.length, 0, 'reducers.length');
		assert.strictEqual(separation.disjunctions.length, 1, 'disjunctions.length');
		assert.strictEqual(separation.disjunctions[0].isEqual(orNode), true, 'separation.disjunctions[0] equal to OR');
	});
	QUnit.test('filterSeparation AND(OR(A=1,A=2,A=1,A=4), OR(A=1,A=2,C=42)) - right branch is external context', function (assert) {
		var mh = this.messageHandler;
		var leftOr = eq('A', '1', mh).addOr('A', this.EQ, '2').addOr('A', this.EQ, '1').addOr('A', this.EQ, '4');
		var rightOr = eq('A', '1', mh).addOr('A', this.EQ, '2').addOr('C', this.EQ, '42');
		var filter = createEmptyFilter(this).addAnd(leftOr).addAnd(rightOr);

		var filterReduction = new filterSimplify.FilterReduction();
		var separated = filterReduction.filterSeparation(filter, this.messageHandler);
		var disjunctions = separated.disjunctions;
		var reducers = separated.reducers;

		assert.strictEqual(disjunctions.length, 1, '#disjunctions');
		assert.strictEqual(reducers.length, 1, '#reducers');
		assert.strictEqual(disjunctions[0].mapToSapUI5FilterExpression().aFilters.length, 4, '#childs left OR');
	});

	QUnit.test('FT(A=1) - FilterTerm directly intentionally is not processed', function (assert) {
		var mh = this.messageHandler;
		var filter = new FilterTerm(mh, 'A', this.EQ, '1');

		var filterReduction = new filterSimplify.FilterReduction();
		var separated = filterReduction.filterSeparation(filter, this.messageHandler);
		var disjunctions = separated.disjunctions;

		assert.strictEqual(disjunctions.length, 0, '#disjunctions');
	});

	QUnit.test('FT(A=1) - Filter(FilterTerm)', function (assert) {
		var mh = this.messageHandler;
		var term = new FilterTerm(mh, 'A', this.EQ, '1');
		var filter = new Filter(mh, term);

		var filterReduction = new filterSimplify.FilterReduction();
		var separated = filterReduction.filterSeparation(filter, this.messageHandler);
		var disjunctions = separated.disjunctions;

		assert.strictEqual(disjunctions.length, 1, '#disjunctions');
		assert.strictEqual(disjunctions[0] instanceof Filter, true, 'disjunctions[0] instanceof Filter');
		assert.strictEqual(disjunctions[0].isFilterTerm(), true, 'isFilterTerm');
		assert.strictEqual(disjunctions[0].getFilterTerms()[0].getProperty(), 'A', 'property A');
		assert.strictEqual(disjunctions[0].getFilterTerms()[0].getValue(), '1', 'value 1');
	});

	QUnit.test('filterSeparation Filter(AND(FT(A=1),Filter(FT(A=1)))) - indirection on top', function (assert) {
		var mh = this.messageHandler;
		var rightHandSide = createEmptyFilter(this).addAnd(eq('A', '1', mh)); // Filter(FilterTerm(A=1))
		var innerNode = eq('A', '1', mh).addAnd(rightHandSide);			   // AND(FT(A=1), Filter(FilterTerm(A=1)))
		var filter = createEmptyFilter(this).addAnd(innerNode); // ignore And, just adding into

		var filterReduction = new filterSimplify.FilterReduction();
		var separated = filterReduction.filterSeparation(filter, this.messageHandler);
		var disjunctions = separated.disjunctions;
		var reducers = separated.reducers;

		assert.strictEqual(disjunctions.length, 2, '#disjunctions');
		assert.strictEqual(reducers.length, 0, '#reducers');
		assert.strictEqual(disjunctions[0].mapToSapUI5FilterExpression().sPath, 'A', 'disjunctions[0] property A');
		assert.strictEqual(disjunctions[0].mapToSapUI5FilterExpression().oValue1, '1', 'value 1');
		assert.strictEqual(disjunctions[1].mapToSapUI5FilterExpression().sPath, 'A', 'disjunctions[1] property A');
		assert.strictEqual(disjunctions[1].mapToSapUI5FilterExpression().oValue1, '1', 'value 1');
	});

	QUnit.test("simplifyTransforms an array of 1 transform", function (assert) {
		var transform3 = {property: "A", values: [1, 2, 4, 10, 11]};
		var aTransform = [transform3];
		var filterReduction = new filterSimplify.FilterReduction();
		var reducedTransform = filterReduction.simplifyTransforms(aTransform);
		assert.strictEqual(reducedTransform.length, 1, 'then return one transform');
		assert.strictEqual(reducedTransform[0].values.length, transform3.values.length, 'then return a transform which has the same values with the input transform');
		assert.strictEqual(transform3, reducedTransform[0], 'then return an array of 1 transform, which is identity with the input transform');
	});

	QUnit.test("simplifyTransforms an array of 0 transform", function (assert) {
		var aTransform = [];
		var filterReduction = new filterSimplify.FilterReduction();
		var reducedTransform = filterReduction.simplifyTransforms(aTransform);
		assert.strictEqual(reducedTransform.length, 0, 'then return an array of 0 transform');
	});

	QUnit.test("simplifyTransforms an array of 2 transforms", function (assert) {
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var transform2 = {property: "A", values: [1, 2, 4, 11, 22]};
		var aTransform = [transform1, transform2];
		var filterReduction = new filterSimplify.FilterReduction();
		var reducedTransform = filterReduction.simplifyTransforms(aTransform);
		assert.strictEqual(reducedTransform.length, 1, 'then return an array of 1 transform');
		assert.strictEqual(reducedTransform[0].values.length, 3, 'then return [1, 2, 4] as the value of that transform');
		assert.strictEqual(reducedTransform[0].values[0], 1, 'then return unchanged positions of values');
	});

	QUnit.test("simplifyTransforms an array of 2 transforms, which have no common values", function (assert) {
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var transform2 = {property: "A", values: [11, 22]};
		var aTransform = [transform1, transform2];
		var filterReduction = new filterSimplify.FilterReduction();
		var reducedTransform = filterReduction.simplifyTransforms(aTransform);
		assert.strictEqual(reducedTransform.length, 1, 'then return 1 transform');
		assert.strictEqual(reducedTransform[0].property, transform1.property, 'then return an array of 1 transform which has 1 property');
		assert.strictEqual(reducedTransform[0].values.length, 0, 'then return an array of 1 transform which has 0 values');
	});

	QUnit.test("simplifyTransforms an array of 2 transforms, which have no common property ", function (assert) {
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var transform2 = {property: "B", values: [1, 2, 4, 11, 22]};
		var aTransform = [transform1, transform2];
		var filterReduction = new filterSimplify.FilterReduction();
		var reducedTransform = filterReduction.simplifyTransforms(aTransform);
		assert.strictEqual(reducedTransform.length, 2, 'then return an array of 2 transforms');
		assert.strictEqual(reducedTransform[0].values.length, transform1.values.length, 'then return 1st transform, identity with first input');
		assert.strictEqual(reducedTransform[1].values.length, transform2.values.length, 'then return 2nd transform, identity with second input');
	});

	QUnit.test("simplifyTransforms an array of 3 transforms, which have the same property", function (assert) {
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var transform2 = {property: "A", values: [2, 3, 4, 7, 9]};
		var transform3 = {property: "A", values: [1, 2, 4, 10, 11]};
		var aTransform = [transform1, transform2, transform3];
		var filterReduction = new filterSimplify.FilterReduction();
		var reducedTransform = filterReduction.simplifyTransforms(aTransform);
		assert.strictEqual(reducedTransform.length, 1, 'then return an array of 1 transform');
		assert.strictEqual(reducedTransform[0].values.length, 2, 'then return [2, 4] as the value of that transform');
	});

	QUnit.test("simplifyTransforms an array of 3 transforms, which have 2 different properties", function (assert) {
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var transform2 = {property: "B", values: [2, 3, 4, 7, 9]};
		var transform3 = {property: "A", values: [1, 2, 4, 10, 11]};
		var aTransform = [transform1, transform2, transform3];
		var filterReduction = new filterSimplify.FilterReduction();
		var reducedTransform = filterReduction.simplifyTransforms(aTransform);
		assert.strictEqual(reducedTransform.length, 2, 'then return an array of 2 transforms');
		assert.strictEqual(reducedTransform[0].values.length, 3, 'then return [1, 2, 4] as the values of 1st transform');
		assert.strictEqual(reducedTransform[1], transform2, 'then return 2nd transform, identity with 2nd input');
	});

	QUnit.test("transformFilter of array of 2 children OR-filters under AND", function (assert) {
		var aValues1 = [1, 2, 4, 5, 6, 7, 8];
		var aValues2 = [2, 3, 4, 7, 9];
		var filter1 = createDisjunctionAEq(this, aValues1);
		var filter2 = createDisjunctionAEq(this, aValues2);
		var aFilters = [filter1, filter2];
		var filterReduction = new filterSimplify.FilterReduction();
		var aTransform = filterReduction.transformFilter(aFilters);
		assert.strictEqual(aTransform.length, 2, 'then return an array of 2 transformed children');
		assert.strictEqual(aTransform[0].values.length, aValues1.length, 'then return values of 1st transform, identity with values of 1st filter');
		assert.strictEqual(aTransform[1].values.length, aValues2.length, 'then return values of 2nd transform, identity with values of 2nd filter');
	});

	QUnit.test("transformFilter of array of 1 child OR-filter under AND", function (assert) {
		var aValues1 = [1, 2, 4, 5, 6, 7, 8];
		var filter1 = createDisjunctionAEq(this, aValues1);
		var aFilters = [filter1];
		var filterReduction = new filterSimplify.FilterReduction();
		var aTransform = filterReduction.transformFilter(aFilters);
		assert.strictEqual(aTransform.length, 1, 'then return an array of 1 transformed child');
		assert.strictEqual(aTransform[0].values.length, aValues1.length, 'then return values of 1st transform, identity with values of 1st filter');
	});

	QUnit.test("transformFilter empty array", function (assert) {
		var aFilters = [];
		var filterReduction = new filterSimplify.FilterReduction();
		var aTransform = filterReduction.transformFilter(aFilters);
		assert.strictEqual(aTransform.length, 0, 'then return an empty array');
	});

	QUnit.test("transformFilter null", function (assert) {
		var aFilters = null;
		var filterReduction = new filterSimplify.FilterReduction();
		var aTransform = filterReduction.transformFilter(aFilters);
		assert.strictEqual(aTransform.length, 0, 'then return an empty array');
	});

	QUnit.test("applyStartFilter with startFilter, transformed is an array of 2 transforms", function (assert) {
		var startFilter = new Filter(this.messageHandler, "A", this.BT, 1, 5);
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var transform2 = {property: "B", values: [9, 10]};
		var aTransformed = [transform1, transform2];
		var filterReduction = new filterSimplify.FilterReduction();
		var aSimplifiedTransformed = filterReduction.applyStartFilter(startFilter, aTransformed);
		assert.strictEqual(aSimplifiedTransformed.length, 2, 'then return an array of 2 transforms');
		assert.strictEqual(aSimplifiedTransformed[0].values.length, 4, 'then return [1, 2 ,4 ,5] as values of 1st transform');
		assert.strictEqual(aSimplifiedTransformed[1], transform2, 'then return 2nd transform, identity with 2nd input');
	});

	QUnit.test("applyStartFilter with startFilter, transformed is an array of 1 transform, same property", function (assert) {
		var startFilter = new Filter(this.messageHandler, "A", this.BT, 1, 5);
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var aTransformed = [transform1];
		var filterReduction = new filterSimplify.FilterReduction();
		var aSimplifiedTransformed = filterReduction.applyStartFilter(startFilter, aTransformed);
		assert.strictEqual(aSimplifiedTransformed.length, 1, 'then return an array of 1 transform');
		assert.strictEqual(aSimplifiedTransformed[0].values.length, 4, 'then return [1, 2 ,4 ,5] as values of 1st transform');
	});

	QUnit.test("applyStartFilter with startFilter, transformed is an array of 1 transform, same property, no common value", function (assert) {
		var startFilter = new Filter(this.messageHandler, "A", this.BT, 10, 15);
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var aTransformed = [transform1];
		var filterReduction = new filterSimplify.FilterReduction();
		var aSimplifiedTransformed = filterReduction.applyStartFilter(startFilter, aTransformed);
		assert.ok(aSimplifiedTransformed.length === 1, 'then return an array of 1 transform');
		assert.strictEqual(aSimplifiedTransformed[0].property, "A", 'then return the common property');
		assert.strictEqual(aSimplifiedTransformed[0].values.length, 0, 'then return no values');
	});

	QUnit.test("applyStartFilter with startFilter, transformed is an array of 1 transform, no common property", function (assert) {
		var startFilter = new Filter(this.messageHandler, "A", this.BT, 10, 15);
		var transform1 = {property: "B", values: [1, 2, 4, 5, 6, 7, 8]};
		var aTransformed = [transform1];
		var filterReduction = new filterSimplify.FilterReduction();
		var aSimplifiedTransformed = filterReduction.applyStartFilter(startFilter, aTransformed);
		assert.ok(aSimplifiedTransformed.length === 1, 'then return an array of 1 transform');
		assert.strictEqual(aSimplifiedTransformed[0], transform1, 'then return the transform, identity with the input');
	});

	QUnit.test("simplifyInStartFilter with startFilter, transformed is an array of 2 transforms", function (assert) {
		var startFilter = new Filter(this.messageHandler, "A", this.BT, 1, 5);
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var transform2 = {property: "B", values: [9, 10]};
		var aTransformed = [transform1, transform2];
		var filterReduction = new filterSimplify.FilterReduction();
		var simplifiedStartFilter = filterReduction.simplifyInStartFilter(startFilter, aTransformed);
		assert.strictEqual(simplifiedStartFilter, undefined, 'then return undefined');
	});

	QUnit.test("simplifyInStartFilter with startFilter, transformed is an array of 1 transform, same property", function (assert) {
		var startFilter = new Filter(this.messageHandler, "A", this.BT, 1, 5);
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var aTransformed = [transform1];
		var filterReduction = new filterSimplify.FilterReduction();
		var simplifiedStartFilter = filterReduction.simplifyInStartFilter(startFilter, aTransformed);
		assert.strictEqual(simplifiedStartFilter, undefined, 'then return undefined');
	});

	QUnit.test("simplifyInStartFilter with startFilter, transformed is an array of 1 transform, same property, no common value", function (assert) {
		var startFilter = new Filter(this.messageHandler, "A", this.BT, 10, 15);
		var transform1 = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var aTransformed = [transform1];
		var filterReduction = new filterSimplify.FilterReduction();
		var simplifiedStartFilter = filterReduction.simplifyInStartFilter(startFilter, aTransformed);
		assert.strictEqual(simplifiedStartFilter, undefined, 'then return undefined');
	});

	QUnit.test("simplifyInStartFilter with startFilter, transformed is an array of 1 transform, no common property", function (assert) {
		var startFilter = new Filter(this.messageHandler, "A", this.BT, 10, 15);
		var transform1 = {property: "B", values: [1, 2, 4, 5, 6, 7, 8]};
		var aTransformed = [transform1];
		var filterReduction = new filterSimplify.FilterReduction();
		var simplifiedStartFilter = filterReduction.simplifyInStartFilter(startFilter, aTransformed);
		assert.strictEqual(simplifiedStartFilter.toUrlParam(), startFilter.toUrlParam(), 'then return a filter, identity with the start filter');
	});

	QUnit.test("rebuildDisjunction from a transform", function (assert) {
		var transform = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = filterReduction.rebuildDisjunction(this.messageHandler, transform);
		assert.strictEqual(filter.getProperties().length, 1, 'then return an OR-filter with 1 property');
		assert.strictEqual(filter.getFilterTerms().length, 7, 'then return an OR-filter with 7 terms');
	});

	QUnit.test("rebuildDisjunction from a transform without any value", function (assert) {
		var transform = {property: "A", values: []};
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = filterReduction.rebuildDisjunction(this.messageHandler, transform);
		assert.strictEqual(filter.getProperties().length, 0, 'then return an OR-filter with 0 property');
		assert.strictEqual(filter.getFilterTerms().length, 0, 'then return an OR-filter with 0 term');
	});

	QUnit.test("rebuildDisjunction from a transform", function (assert) {
		var transform = {property: "A", values: [1, 2, 4, 5, 6, 7, 8]};
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = filterReduction.rebuildDisjunction(this.messageHandler, transform);
		assert.strictEqual(filter.getProperties().length, 1, 'then return an OR-filter with 1 property');
		assert.strictEqual(filter.getFilterTerms().length, 7, 'then return an OR-filter with 7 terms');
	});

	QUnit.test("rebuildDisjunction from a transform without any value", function (assert) {
		var transform = {property: "A", values: []};
		var filterReduction = new filterSimplify.FilterReduction();
		var filter = filterReduction.rebuildDisjunction(this.messageHandler, transform);
		assert.strictEqual(filter.getProperties().length, 0, 'then return an OR-filter with 0 property');
		assert.strictEqual(filter.getFilterTerms().length, 0, 'then return an OR-filter with 0 term');
	});

	QUnit.test("containsContradiction, contradiction found", function (assert) {
		var transform = {property: "A", values: []};
		var aTransforms = [transform];
		var filterReduction = new filterSimplify.FilterReduction();
		var containsAContradiction = filterReduction.containsContradiction(this.messageHandler, aTransforms);
		assert.strictEqual(containsAContradiction, true, 'then contradiction found');
	});

	QUnit.test("containsContradiction, one contradiction found", function (assert) {
		var transform1 = {property: "A", values: [1, 2]};
		var transform2 = {property: "B", values: []};
		var aTransforms = [transform1, transform2];
		var filterReduction = new filterSimplify.FilterReduction();
		var containsAContradiction = filterReduction.containsContradiction(this.messageHandler, aTransforms);
		assert.strictEqual(containsAContradiction, true, 'then contradiction found');
	});

	QUnit.test("containsContradiction, two contradiction found", function (assert) {
		var transform1 = {property: "A", values: []};
		var transform2 = {property: "B", values: []};
		var aTransforms = [transform1, transform2];
		var filterReduction = new filterSimplify.FilterReduction();
		var containsAContradiction = filterReduction.containsContradiction(this.messageHandler, aTransforms);
		assert.strictEqual(containsAContradiction, true, 'then contradiction found');
	});

	QUnit.test("containsContradiction, no contradiction found", function (assert) {
		var transform1 = {property: "A", values: [1, 2]};
		var transform2 = {property: "B", values: [3, 4]};
		var aTransforms = [transform1, transform2];
		var filterReduction = new filterSimplify.FilterReduction();

		var containsAContradiction = filterReduction.containsContradiction(this.messageHandler, aTransforms);

		assert.strictEqual(containsAContradiction, false, 'then NO contradiction found');
	});

	QUnit.test("filterReduction with context A BT 1..5 AND AND(OR A=1,2,4,5,6,8): returns reduced OR and only 1 filter on 'A'", function (assert) {
		var oFilter = createEmptyFilter(this);
		var between = new Filter(this.messageHandler, "A", this.BT, 1, 5);
		var orNode = createDisjunctionAEq(this, [1, 4, 5, 6, 7, 8]);
		oFilter = oFilter.addAnd(between).addAnd(orNode);
		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, oFilter);

		assert.strictEqual(reducedFilter.isOr(), true, 'then is an OR node');
		assertFilterOverSingleProperty(reducedFilter, 'A', 3, assert);
	});
	QUnit.test("filterReduction with context A BT 1..5 AND AND(OR,OR): returns only 1 OR over 'A' (AND eliminated) and OR is reduced", function (assert) {
		var oFilter = createEmptyFilter(this);
		var between = new Filter(this.messageHandler, "A", this.BT, 1, 5);
		var aValues1 = [1, 2, 4, 5, 6, 7, 8];
		var aValues2 = [2, 3, 4, 7, 9];
		var filter1 = createDisjunctionAEq(this, aValues1);
		var filter2 = createDisjunctionAEq(this, aValues2);
		oFilter = oFilter.addAnd(between).addAnd(filter1).addAnd(filter2);
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, oFilter);

		assert.strictEqual(reducedFilter.isOr(), true, 'then is an OR node');
		assertFilterOverSingleProperty(reducedFilter, 'A', 2, assert);
	});

	QUnit.test("filterReduction without context, AND(OR,OR): returns only 1 OR over 'A' (AND eliminated) and OR is reduced", function (assert) {
		var aValues1 = [1, 2];
		var aValues2 = [2, 3];
		var filter1 = createDisjunctionAEq(this, aValues1);
		var filter2 = createDisjunctionAEq(this, aValues2);
		var pathFilter = createEmptyFilter(this).addAnd(filter1).addAnd(filter2);
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, pathFilter);

		assertFilterOverSingleProperty(reducedFilter, 'A', 1, assert);
		assert.notOk(filterReduction.isContradicted(), "No contradiction found");
	});

	QUnit.test("filterReduction with context but no common property AND(OR,OR)", function (assert) {
		var startFilter = new Filter(this.messageHandler, "B", this.BT, 1, 5);
		var aValues1 = [1, 2, 4, 5, 6, 7, 8];
		var aValues2 = [2, 3, 4, 7, 9];
		var filter1 = createDisjunctionAEq(this, aValues1);
		var filter2 = createDisjunctionAEq(this, aValues2);
		var oFilter = new Filter(this.messageHandler);
		oFilter.addAnd(startFilter).addAnd(filter1).addAnd(filter2);
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, oFilter);

		assert.strictEqual(reducedFilter.getFilterTerms().length, 4, 'then return start filter and 3 other filter terms');
		assert.strictEqual(reducedFilter.getFilterTerms()[0].toUrlParam(), startFilter.toUrlParam(), 'then return 1st filter, identity with the start filter');
	});

	QUnit.test("filterReduction, AND(OR, OR) which returns a contradiction w/o context", function (assert) {
		var aValues1 = [1, 2, 4];
		var aValues2 = [7, 9];
		var filter1 = createDisjunctionAEq(this, aValues1);
		var filter2 = createDisjunctionAEq(this, aValues2);
		var oFilter = new Filter(this.messageHandler, filter1);
		oFilter = oFilter.addAnd(filter2);
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, oFilter);

		assert.strictEqual(reducedFilter, oFilter, 'then return original filter');
		assert.ok(filterReduction.isContradicted(), "filterReduction found a contradiction");
	});

	QUnit.test("filterReduction contradiction when reduced by context", function (assert) {
		var startFilter = new Filter(this.messageHandler, "A", this.BT, 10, 15);
		var aValues1 = [1, 2, 4, 5, 6, 7, 8];
		var aValues2 = [2, 3, 4, 7, 9];
		var filter1 = createDisjunctionAEq(this, aValues1);
		var filter2 = createDisjunctionAEq(this, aValues2);
		var oFilter = new Filter(this.messageHandler);
		oFilter.addAnd(startFilter).addAnd(filter1).addAnd(filter2);
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, oFilter);

		assert.strictEqual(reducedFilter, oFilter, 'then return original filter');
		assert.ok(filterReduction.isContradicted(), "filterReduction found a contradiction");
	});

	QUnit.test('filterReduction EmptyFilter returns EmptyFilter', function (assert) {
		var filter = new Filter(this.messageHandler);

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assert.strictEqual(reducedFilter.isEqual(filter), true, 'both filter equal');
	});
	QUnit.test('filterReduction A=1 returns the same', function (assert) {
		var mh = this.messageHandler;
		var filter = eq('A', '1', mh);

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assert.strictEqual(reducedFilter.isEqual(filter), true, 'both filter equal');
	});
	QUnit.test('filterReduction OR(eq, eq) returns the same', function (assert) {
		var filter = new Filter(this.messageHandler, 'A', this.EQ, 1);
		filter.addOr(new Filter(this.messageHandler, 'B', this.EQ, 2));
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assert.strictEqual(reducedFilter.isEqual(filter), true, 'both filter equal');
	});
	QUnit.test('filterReduction OR(eq, empty) returns the same', function (assert) {
		var mh = this.messageHandler;
		var filter = eq('A', '1', mh).addOr(createEmptyFilter(this));
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assert.strictEqual(reducedFilter.isEqual(filter), true, 'both filter equal');
	});
	QUnit.test('filterReduction OR(empty, eq) returns the same', function (assert) {
		var mh = this.messageHandler;
		var filter = createEmptyFilter(this).addOr(createEmptyFilter(this)).addOr(eq('A', '1', mh));
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assert.strictEqual(reducedFilter.isEqual(filter), true, 'both filter equal');
	});
	QUnit.test('filterReduction OR(eq,eq,eq) - returns the same', function (assert) {
		var mh = this.messageHandler;
		var filter = eq('A', '1', mh).addOr(eq('A', '2', mh));
		filter.addOr('A', this.EQ, '1'); // different internal representation

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		var result = reducedFilter.mapToSapUI5FilterExpression();
		assert.strictEqual(!result.bAnd, true, 'OR node');
		assert.strictEqual(result.aFilters.length, 3, 'filter not reduced since top OR directly returned');
	});
	QUnit.test('filterReduction AND(A=1, A=1) returns A=1', function (assert) {
		var mh = this.messageHandler;
		var filter = createEmptyFilter(this).addAnd(eq('A', '1', mh)).addAnd(eq('A', '1', mh));
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assertIsEquationAequals1( reducedFilter.mapToSapUI5FilterExpression(), assert);
	});
	QUnit.test('filterReduction AND(A<7), AND(A<5),AND(A=1, A=6)) returns A=1', function (assert) {
		var mh = this.messageHandler;

		function lt(name, value){
			return new Filter(mh, name, constants.FilterOperators.LT, value);
		}

		var filterDisjunction = createEmptyFilter(this).addOr(eq('A','1',mh)).addOr(eq('A','6',mh));
		var filter = createEmptyFilter(this).addAnd(lt('A','7')).addAnd(lt('A','5')).addAnd(filterDisjunction);
		var filterReduction = new filterSimplify.FilterReduction();
		
		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assertIsEquationAequals1( reducedFilter.mapToSapUI5FilterExpression(), assert);
	});
	QUnit.test('filterReduction AND(A=1), AND(A=1, A=1)) returns A=1', function (assert) {
		var mh = this.messageHandler;
		var filter = createEmptyFilter(this).addAnd(eq('A', '1', mh)).addAnd(eq('A', '1', mh)).addAnd(eq('A', '1', mh));
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assertIsEquationAequals1( reducedFilter.mapToSapUI5FilterExpression(), assert);
	});
	QUnit.test('filterReduction AND(empty, AND(A=1), AND(A=1, A=1))) returns A=1', function (assert) {
		var mh = this.messageHandler;
		var filter = createEmptyFilter(this).addAnd(createEmptyFilter(this)).
			addAnd(eq('A', '1', mh)).addAnd(eq('A', '1', mh)).addAnd(eq('A', '1', mh));
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assertIsEquationAequals1( reducedFilter.mapToSapUI5FilterExpression(), assert);
	});
	QUnit.test('filterReduction AND(B=1, AND(A=1), AND(A=1, A=1))) returns B=1 & A=1', function (assert) {
		var mh = this.messageHandler;
		var filter = createEmptyFilter(this).addAnd(eq('B', '1', mh)).
			addAnd(eq('A', '1', mh)).addAnd(eq('A', '1', mh)).addAnd(eq('A', '1', mh));
		var filterReduction = new filterSimplify.FilterReduction();
		var expected = createEmptyFilter(this).addAnd(eq('B', '1', mh)).addAnd(eq('A', '1', mh));

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);
		var result = reducedFilter.mapToSapUI5FilterExpression();
		var expectedResult = expected.mapToSapUI5FilterExpression();
		assert.deepEqual(result, expectedResult, 'then B=1 & A=1');
	});

	QUnit.test('filterReduction AND(B=1, AND(A=1, A=1)) returns reduced B=1 && A=1', function (assert) {
		var mh = this.messageHandler;
		var path = createEmptyFilter(this).addAnd(eq('A', '1', mh)).addAnd(eq('A', '1', mh));
		var filter = createEmptyFilter(this).addAnd(eq('B', '1', mh)).addAnd(path);
		var filterReduction = new filterSimplify.FilterReduction();
		var expected = createEmptyFilter(this).addAnd(eq('B', '1', mh)).addAnd(eq('A', '1', mh));

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		var result = reducedFilter.mapToSapUI5FilterExpression();
		var expectedResult = expected.mapToSapUI5FilterExpression();
		assert.deepEqual(result, expectedResult, 'then equal filters');
	});
	QUnit.test('filterReduction AND(B=1, A=1) returns the same', function (assert) {
		var mh = this.messageHandler;
		var filter = createEmptyFilter(this).addAnd(eq('B', '1', mh)).addAnd(eq('A', '1', mh));
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		var result = reducedFilter.mapToSapUI5FilterExpression();
		var expectedResult = filter.mapToSapUI5FilterExpression();
		assert.deepEqual(result, expectedResult, 'then equal filters');
	});
	QUnit.test('filterReduction AND(A=1, A=2) returns the same since it produces a contradiction', function (assert) {
		var mh = this.messageHandler;
		var filter = createEmptyFilter(this).addAnd(eq('A', '1', mh)).addAnd(eq('A', '2', mh));
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assert.strictEqual(reducedFilter.isEqual(filter), true, 'then A=1');
		assert.ok(filterReduction.isContradicted(), "then a contradiction is found");
	});

	QUnit.test('filterReduction AND(empty, OR(eq, eq)) returns the OR', function (assert) {
		var mh = this.messageHandler;
		var orNode = eq('A', '1', mh).addOr( eq('A', '2', mh));
		var filter = createEmptyFilter(this).addAnd(createEmptyFilter(this)).addAnd(orNode);
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assert.strictEqual(reducedFilter.isEmpty(), false, 'isEmpty');
		assert.strictEqual(reducedFilter.isOr(), true, 'isOr');
		assert.strictEqual(reducedFilter.isEqual(orNode), true, 'reduced filter equal to OR');
	});
	QUnit.test('filterReduction AND(OR(eq, eq),empty) returns the same', function (assert) {
		var mh = this.messageHandler;
		var orNode = eq('A', '1', mh).addOr( eq('A', '2', mh));
		var filter = createEmptyFilter(this).addAnd(orNode).addAnd(createEmptyFilter(this));
		var filterReduction = new filterSimplify.FilterReduction();

		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assert.strictEqual(reducedFilter.isEmpty(), false, 'isEmpty');
		assert.strictEqual(reducedFilter.isOr(), true, 'isOr');
		assert.strictEqual(reducedFilter.isEqual(orNode), true, 'reduced filter equal to orNode since it is extracted by filterSeparation');
	});

	QUnit.test('applyStartFilter: reduce OR(A=1,A=2,A=1,A=4) by OR(A=1,A=2,C=42)', function (assert) {
		var mh = this.messageHandler;
		var disj = eq('A', '1', mh).addOr('A', this.EQ, '2').addOr('A', this.EQ, '1').addOr('A', this.EQ, '4');
		var reducer = eq('A', '1', mh).addOr('A', this.EQ, '2').addOr('C', this.EQ, '42');

		var filterReduction = new filterSimplify.FilterReduction();
		var transforms = filterReduction.transformFilter([disj]);
		var simplifiedTransforms = filterReduction.simplifyTransforms(transforms);
		var result = filterReduction.applyStartFilter(reducer, simplifiedTransforms);

		assert.strictEqual(result[0].values.length, 3, '#reduced, to OR(A=1,A=2,A=1)');
	});

	QUnit.test('filterReduction AND(AND(OR(eq, eq),empty), empty) - AND in left branch, returns the OR', function (assert) {
		var andNode = new Filter(this.messageHandler);
		var orNode = new Filter(this.messageHandler, 'A', this.EQ, "de")
			.addOr(new Filter(this.messageHandler, 'A', this.EQ, "fr"));
		andNode.addAnd(orNode).addAnd(new Filter(this.messageHandler));
		var filter = new Filter(this.messageHandler);
		filter.addAnd(andNode).addAnd(new Filter(this.messageHandler));

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assert.strictEqual(reducedFilter.isEmpty(), false, 'isEmpty');
		assert.strictEqual(reducedFilter.isOr(), true, 'isOr');
		assert.strictEqual(reducedFilter.isEqual(orNode), true, 'reduced filter equal to OR');
	});
	QUnit.test('filterReduction AND(empty, AND(OR(eq, eq),empty)) - AND spine is standard case in path, returns the OR', function (assert) {
		var andNode = new Filter(this.messageHandler);
		var orNode = new Filter(this.messageHandler, 'A', this.EQ, "de")
			.addOr(new Filter(this.messageHandler, 'A', this.EQ, "fr"));
		andNode.addAnd(orNode).addAnd(new Filter(this.messageHandler));
		var filter = new Filter(this.messageHandler);
		filter.addAnd(new Filter(this.messageHandler)).addAnd(andNode);

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		assert.strictEqual(reducedFilter.isEmpty(), false, 'isEmpty');
		assert.strictEqual(reducedFilter.isOr(), true, 'isOr');
		assert.strictEqual(reducedFilter.isEqual(orNode), true, 'reduced filter equal to OR');
	});

	QUnit.test('filterReduction AND(empty, OR(1,2,1)) - returns the OR', function (assert) {
		var mh = this.messageHandler;
		var or = eq('A', '1', mh).addOr(eq('A', '2', mh)).addOr(eq('A', '1', mh));
		var filter = new Filter(mh);
		filter.addAnd(createEmptyFilter(this)).addAnd(or);

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		var result = reducedFilter.mapToSapUI5FilterExpression();
		assert.strictEqual(!result.bAnd, true, 'OR node');
		assert.strictEqual(result.aFilters.length, 3, 'filter still contains redundant value which we do not eliminate (no need)');
		assert.strictEqual(result.aFilters[0].oValue1, '1', 'filters[0].value');
		assert.strictEqual(result.aFilters[1].oValue1, '2', 'filters[1].value');
	});
	QUnit.test('filterReduction AND(OR(1,2), OR(1,2,1)) - Returns and educes OR', function (assert) {
		var mh = this.messageHandler;
		var or1 = eq('A', '1', mh);
		or1.addOr(eq('A', '2', mh));
		var or = eq('A', '1', mh);
		or.addOr(eq('A', '2', mh));
		or.addOr(eq('A', '1', mh));
		var filter = new Filter(mh);
		filter.addAnd(or1).addAnd(or);

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(this.messageHandler, filter);

		var result = reducedFilter.mapToSapUI5FilterExpression();
		assert.strictEqual(!result.bAnd, true, 'OR node');
		assert.strictEqual(result.aFilters.length, 2, 'filter is reduced');
		assert.strictEqual(result.aFilters[0].oValue1, '1', 'filters[0].value');
		assert.strictEqual(result.aFilters[1].oValue1, '2', 'filters[1].value');
	});
	QUnit.test('filterReduction AND(OR(A=1,A=2),B=1), OR(A=1,A=2),C=42))', function (assert) {
		var mh = this.messageHandler;
		var leftOr = eq('A', '1', mh);
		leftOr.addOr('A', this.EQ, '2');
		leftOr.addOr('B', this.EQ, '1');
		var rightOr = eq('A', '1', mh);
		rightOr.addOr('A', this.EQ, '2');
		rightOr.addOr('C', this.EQ, '42');
		var filter = new Filter(this.messageHandler, leftOr);
		filter.addAnd(rightOr);

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(mh, filter);

		var result = reducedFilter.mapToSapUI5FilterExpression();
		assert.strictEqual(result.bAnd, true, 'AND node');
		assert.strictEqual(result.aFilters.length, 2, 'AND 2 branches');
		assert.strictEqual(result.aFilters[0].bAnd, false, 'OR node');
		assert.strictEqual(result.aFilters[0].aFilters.length, 3, 'left OR not reducible');
		assert.strictEqual(result.aFilters[1].bAnd, false, 'OR node');
		assert.strictEqual(result.aFilters[1].aFilters.length, 3, 'right OR not reducible');
	});
	QUnit.test('filterReduction AND(OR(A=1,A=2),A=1), OR(A=1,A=2),A=42)) ', function (assert) {
		var mh = this.messageHandler;
		var leftOr = eq('A', '1', mh);
		leftOr.addOr('A', this.EQ, '2');
		leftOr.addOr('A', this.EQ, '1');
		var rightOr = eq('A', '1', mh);
		rightOr.addOr('A', this.EQ, '2');
		rightOr.addOr('A', this.EQ, '42');
		var filter = new Filter(this.messageHandler, leftOr);
		filter.addAnd(rightOr);

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(mh, filter);

		var result = reducedFilter.mapToSapUI5FilterExpression();
		assert.strictEqual(result.bAnd, false, 'OR node');
		assert.strictEqual(result.aFilters.length, 2, 'reduced to 1 branch with 2 values');
		assert.strictEqual(result.aFilters[0].oValue1, '1', 'matching reduced double value');
		assert.strictEqual(result.aFilters[1].oValue1, '2', 'matched other value');
	});

	QUnit.test('filterReduction AND(OR(A=1,A=2,A=1,A=4), OR(A=1,A=2,C=42)) - right branch is external context', function (assert) {
		var mh = this.messageHandler;
		var leftOr = eq('A', '1', mh).addOr('A', this.EQ, '2').addOr('A', this.EQ, '1').addOr('A', this.EQ, '4');
		var rightOr = eq('A', '1', mh).addOr('A', this.EQ, '2').addOr('C', this.EQ, '42');
		var filter = createEmptyFilter(this).addAnd(leftOr).addAnd(rightOr);

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(mh, filter);

		var result = reducedFilter.mapToSapUI5FilterExpression();
		assert.strictEqual(result.bAnd, true, 'AND node');
		assert.strictEqual(result.aFilters.length, 2, 'AND 2 branches');
		assert.strictEqual(result.aFilters[0].sPath, 'C', 'the external filter is now in front. It is reduced to be non-overlapping with the former left OR');
		assert.strictEqual(result.aFilters[0].oValue1, '42', 'value of C');
		assert.strictEqual(result.aFilters[1].bAnd, false, 'OR node');
		assert.strictEqual(result.aFilters[1].aFilters.length, 3, 'former left OR is reduced by external context but still contains double value');
	});
	QUnit.test('filterReduction AND(OR(A=1,A=2,B=1), OR(A=1,A=2,C=42)) - right branch is external context', function (assert) {
		var mh = this.messageHandler;
		var leftOr = eq('A', '1', mh).addOr('A', this.EQ, '2').addOr('B', this.EQ, '1');
		var rightOr = eq('A', '1', mh).addOr('A', this.EQ, '2').addOr('C', this.EQ, '42');
		var filter = createEmptyFilter(this).addAnd(leftOr).addAnd(rightOr);

		var filterReduction = new filterSimplify.FilterReduction();
		var reducedFilter = filterReduction.reduceFilter(mh, filter);

		var result = reducedFilter.mapToSapUI5FilterExpression();
		assert.strictEqual(result.bAnd, true, 'AND node since not reduced');
		assert.strictEqual(result.aFilters.length, 2, 'AND 2 branches');
		assert.strictEqual(result.aFilters[0].bAnd, false, 'left OR');
		assert.strictEqual(result.aFilters[0].aFilters.length, 3, '3 children');
		assert.strictEqual(result.aFilters[1].bAnd, false, 'OR node');
		assert.strictEqual(result.aFilters[1].aFilters.length, 3, 'former left OR is reduced by double value');
	});

	QUnit.module('FilterReduction in sap.apf.core.utils.Filter.isConsistentWithFilter()', {
		beforeEach: function (/* assert */) {
			jQuery.extend(this, constants.FilterOperators);
			this.messageHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
		}
	});

	QUnit.test('isConsistentWithFilter A,4 in OR(A=1,A=2),C=42)', function (assert) {
		var mh = this.messageHandler;
		var reducer = eq('A', '1', mh).addOr('A', this.EQ, '2').addOr('C', this.EQ, '42');

		var result = reducer.isConsistentWithFilter('A', '4');

		assert.strictEqual(result, false, 'isConsistentWithFilter');
	});

	QUnit.test('isConsistentWithFilter A,4 in EQ(A=1)', function (assert) {
		var mh = this.messageHandler;
		var reducer = eq('A', '1', mh);

		var result = reducer.isConsistentWithFilter('A', '4');

		assert.strictEqual(result, false, 'isConsistentWithFilter');
	});

	QUnit.test('isConsistentWithFilter A,4 in OR(A=1, A=2)', function (assert) {
		var mh = this.messageHandler;
		var reducer = eq('A', '1', mh).addOr('A', this.EQ, '2');

		var result = reducer.isConsistentWithFilter('A', '4');

		assert.strictEqual(result, false, 'isConsistentWithFilter');
	});
	QUnit.test('isConsistentWithFilter A,4 in OR(A=1, C=42)', function (assert) {
		var mh = this.messageHandler;
		var reducer = eq('A', '1', mh).addOr('C', this.EQ, '42');

		var result = reducer.isConsistentWithFilter('A', '4');

		assert.strictEqual(result, false, 'isConsistentWithFilter');
	});
	QUnit.test('isConsistentWithFilter A,4 in OR(C=42,A=1)', function (assert) {
		var mh = this.messageHandler;
		var reducer = eq('C', '42', mh).addOr('A', this.EQ, '1');

		var result = reducer.isConsistentWithFilter('A', '4');

		assert.strictEqual(result, false, 'isConsistentWithFilter not since A is restricted');
	});
	QUnit.test('isConsistentWithFilter A,4 in OR(C=42,D=1)', function (assert) {
		var mh = this.messageHandler;
		var reducer = eq('C', '42', mh).addOr('D', this.EQ, '1');

		var result = reducer.isConsistentWithFilter('A', '1');

		assert.strictEqual(result, true, 'isConsistentWithFilter since no restriction');
	});

	/** Tests created after 1.32.3 Establishing complete coverage.
	 * Proof by structural induction
	 */
	QUnit.module('sap.apf.core.utils.Filter.isConsistentWithFilter()', {
		beforeEach: function (/* assert */) {
			var context = this;
			jQuery.extend(this, constants.FilterOperators);
			this.messageHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
			this.createFilter = function (name, op, value) { 									// optional params
				return new Filter(context.messageHandler, name, op, value);
			};
		}
	});
	QUnit.test('emptyFilter isConsistentWithFilter any value ', function (assert) {
		var result = this.createFilter().isConsistentWithFilter('A', '1');

		assert.strictEqual(result, true, 'empty filter is no restriction');
	});
	// Base, FilterTerm
	QUnit.test('A=1 isConsistentWithFilter A=1', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').isConsistentWithFilter('A', '1');

		assert.strictEqual(result, true, 'is contained');
	});
	QUnit.test('A=1 isConsistentWithFilter B=3', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').isConsistentWithFilter('B', '3');

		assert.strictEqual(result, true, 'is contained');
	});
	QUnit.test('A=1 isConsistentWithFilter  A=2', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').isConsistentWithFilter('A', '2');

		assert.strictEqual(result, false, 'is not contained');
	});
	QUnit.test('A=1 isConsistentWithFilter emptyFilter', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').isConsistentWithFilter(this.createFilter());

		assert.strictEqual(result, true, 'is contained');
	});

	// Base, Filter
	QUnit.test('OR(A=1) isConsistentWithFilter A=1', function (assert) {
		var result = this.createFilter().addOr(this.createFilter('A', this.EQ, '1')).isConsistentWithFilter('A', '1');

		assert.strictEqual(result, true, 'is contained');
	});
	QUnit.test('OR(A=1) isConsistentWithFilter B=3, different property', function (assert) {
		var result = this.createFilter().addOr(this.createFilter('A', this.EQ, '1')).isConsistentWithFilter('B', '3');

		assert.strictEqual(result, true, 'is contained since not constrained ');
	});
	QUnit.test('OR(A=1) isConsistentWithFilter  A=2, same property but different value', function (assert) {
		var result = this.createFilter().addOr(this.createFilter('A', this.EQ, '1')).isConsistentWithFilter('A', '2');

		assert.strictEqual(result, false, 'is not contained');
	});

	// OR cases FilterTerm vs Filter as subtree cover in base proof
	QUnit.test('OR(A=1,A=2) isConsistentWithFilter A=1, match in lhs', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addOr('A', this.EQ, '2').isConsistentWithFilter('A', '1');

		assert.strictEqual(result, true, 'is contained');
	});
	QUnit.test('OR(A=1,A=2) isConsistentWithFilter A=2, match in rightHandSide', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addOr('A', this.EQ, '2').isConsistentWithFilter('A', '2');

		assert.strictEqual(result, true, 'is contained');
	});
	QUnit.test('OR(A=1,A=2) isConsistentWithFilter B=3, no match', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addOr('A', this.EQ, '2').isConsistentWithFilter('B', '3');

		assert.strictEqual(result, true, 'is contained since not constrained ');
	});

	// AND
	QUnit.test('AND(A=1,A=1) isConsistentWithFilter A=1, match both branches', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('A', this.EQ, '1').isConsistentWithFilter('A', '1');

		assert.strictEqual(result, true, 'is contained');
	});
	QUnit.test('AND(A=1,A=1) isConsistentWithFilter B=1, no match', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('A', this.EQ, '1').isConsistentWithFilter('B', '1');

		assert.strictEqual(result, true, 'is contained since not constrained ');
	});
	QUnit.test('AND(A=1,B=1) isConsistentWithFilter B=1, lhs not relevant and rightHandSide matches', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('B', this.EQ, '1').isConsistentWithFilter('B', '1');

		assert.strictEqual(result, true, 'is contained since left is not constrained and right matches');
	});
	QUnit.test('AND(A=1,B=1) isConsistentWithFilter B=3, rightHandSide not matching', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('B', this.EQ, '1').isConsistentWithFilter('B', '3');

		assert.strictEqual(result, false, 'though left is not constrained, right does not matches');
	});
	QUnit.test('AND(B=1,A=1) isConsistentWithFilter B=1, rightHandSide not relevant and lhs matches', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('B', this.EQ, '1').isConsistentWithFilter('B', '1');

		assert.strictEqual(result, true, 'is contained since left is not constrained and right matches');
	});
	QUnit.test('AND(B=1,A=1) isConsistentWithFilter B=3, but lhs not matching', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('B', this.EQ, '1').isConsistentWithFilter('B', '3');

		assert.strictEqual(result, false, 'though rightHandSide is not constrained, lhs does not matche');
	});
	QUnit.test('AND(A=1,A=1) isConsistentWithFilter A=3, both relevant but not matching', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('A', this.EQ, '1').isConsistentWithFilter('A', '3');

		assert.strictEqual(result, false, 'is not contained');
	});
	QUnit.test('AND(A=1,A=3) isConsistentWithFilter A=3, both relevant but lhs not matching', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('A', this.EQ, '1').isConsistentWithFilter('A', '3');

		assert.strictEqual(result, false, 'is not contained');
	});
	QUnit.test('AND(A=3,A=2) isConsistentWithFilter A=3, both relevant but rightHandSide not matching', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('A', this.EQ, '1').isConsistentWithFilter('A', '3');

		assert.strictEqual(result, false, 'is not contained');
	});
	QUnit.test('AND(A=1,A=2) isConsistentWithFilter A=1, relevant but rightHandSide not matching', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('A', this.EQ, '2').isConsistentWithFilter('A', '1');

		assert.strictEqual(result, false, 'is not contained');
	});
	QUnit.test('AND(A=1,A=2) isConsistentWithFilter A=2, lhs not matching', function (assert) {
		var result = this.createFilter('A', this.EQ, '1').addAnd('A', this.EQ, '2').isConsistentWithFilter('A', '2');

		assert.strictEqual(result, false, 'is not contained');
	});


	//*****************************************************************************************************************
	/**
	 * These performance test have been commented out on purpose.
	 * They lead to false positives on Firefox on a slow build machine because FX produced a timeout (supposed infinite loop).
	 * However, we want to preserve them for later measurements when needed.
	 */
	//QUnit.module('Performance test',{
	//	beforeEach : function(/* assert */) {
	//		jQuery.extend(this,	constants.FilterOperators);
	//		this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
	//		sap.apf.core.utils.Filter = sap.apf.core.utils.Filter;
	//		}
	//});
	//
	//QUnit.test("create 10 random values", function(assert) {
	//	var aValues = createRandomValues(10);
	//	assert.strictEqual(aValues.length, 10, 'then return an array of random values');
	//	assert.ok(aValues[0] !== undefined, 'values are filled in');
	//});
	//
	//QUnit.test("create random filter of 3 disjuntions and 4 values each",
	//		function(assert) {
	//			var randomFilter = createRandomFilter(this, 3, 4);
	//			assert.strictEqual(randomFilter.getFilterTerms().length, 3 * 4,
	//					'then return a filter with 12 terms');
	//		});
	//
	//QUnit.test("performance 2 disjunction x 10 values each with start filter",	function(assert) {
	//	var filterSimplify = new filterSimplify.FilterReduction();
	//	var startFilter = new sap.apf.core.utils.Filter(this.messageHandler, "A", this.BT, 1, 10);
	//	var pathFilter = createRandomFilter(this, 2, 10);
	//	var oFilter = new sap.apf.core.utils.Filter(this.messageHandler);
	//
	//	oFilter.addAnd(startFilter);
	//	oFilter.addAnd(pathFilter);
	//
	//	var start = new Date().getTime();
	//	filterSimplify.filterReduction(this.messageHandler,	oFilter);
	//	var end = new Date().getTime();
	//	var time = end - start;
	//	assert.ok(true, 'execution time expected below 1 sec, ===: ' + time);
	//});
	//
	//QUnit.test("performance 2 disjunction x 100 values each with start filter",	function(assert) {
	//	var filterSimplify = new filterSimplify.FilterReduction();
	//	var startFilter = new sap.apf.core.utils.Filter(this.messageHandler, "A", this.BT, 1, 10);
	//	var pathFilter = createRandomFilter(this, 2, 100);
	//	var oFilter = new sap.apf.core.utils.Filter(this.messageHandler);
	//
	//	oFilter.addAnd(startFilter);
	//	oFilter.addAnd(pathFilter);
	//
	//	var start = new Date().getTime();
	//	filterSimplify.filterReduction(this.messageHandler,	oFilter);
	//	var end = new Date().getTime();
	//	var time = end - start;
	//	assert.ok(true, 'execution time expected below 1 sec, ===: ' + time);
	//});
	//
	//QUnit.test("performance 2 disjunction x 1000 values each with start filter",	function(assert) {
	//	var filterSimplify = new filterSimplify.FilterReduction();
	//	var startFilter = new sap.apf.core.utils.Filter(this.messageHandler, "A", this.BT, 1, 10);
	//	var pathFilter = createRandomFilter(this, 2, 1000);
	//	var oFilter = new sap.apf.core.utils.Filter(this.messageHandler);
	//
	//	oFilter.addAnd(startFilter);
	//	oFilter.addAnd(pathFilter);
	//
	//	var start = new Date().getTime();
	//	filterSimplify.filterReduction(this.messageHandler,	oFilter);
	//	var end = new Date().getTime();
	//	var time = end - start;
	//	assert.ok(true, 'execution time expected below 1 sec, ===: ' + time);
	//});
	//
	//QUnit.test("performance 2 disjunction x 5000 values each with start filter",	function(assert) {
	//	var filterSimplify = new filterSimplify.FilterReduction();
	//	var startFilter = new sap.apf.core.utils.Filter(this.messageHandler, "A", this.BT, 1, 10);
	//	var pathFilter = createRandomFilter(this, 2, 5000);
	//	var oFilter = new sap.apf.core.utils.Filter(this.messageHandler);
	//
	//	oFilter.addAnd(startFilter);
	//	oFilter.addAnd(pathFilter);
	//
	//	var start = new Date().getTime();
	//	filterSimplify.filterReduction(this.messageHandler,	oFilter);
	//	var end = new Date().getTime();
	//	var time = end - start;
	//	assert.ok(true, 'execution time expected below 1 sec, ===: ' + time);
	//});
	//
	//QUnit.test("performance 2 disjunction x 10000 values each with start filter",	function(assert) {
	//	var filterSimplify = new filterSimplify.FilterReduction();
	//	var startFilter = new sap.apf.core.utils.Filter(this.messageHandler, "A", this.BT, 1, 10);
	//	var pathFilter = createRandomFilter(this, 2, 10000);
	//	var oFilter = new sap.apf.core.utils.Filter(this.messageHandler);
	//
	//	oFilter.addAnd(startFilter);
	//	oFilter.addAnd(pathFilter);
	//
	//	var start = new Date().getTime();
	//	filterSimplify.filterReduction(this.messageHandler,	oFilter);
	//	var end = new Date().getTime();
	//	var time = end - start;
	//	assert.ok(true, 'execution time expected below 10 sec, ===: ' + time);
	//});
});
sap.ui.define("sap/apf/utils/tStartFilterPropagation", [
	"sap/apf/utils/startFilterHandler",
	"sap/apf/utils/startFilter",
	"sap/apf/utils/filter",
	"sap/apf/core/utils/filter",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/testhelper/concurrenceTester"
], function(StartFilterHandler, StartFilter, UtilsFilter, CoreFilter, DoubleMessageHandler, concurrenceTester){
	'use strict';
	
	// === Helpers ===
	
	function setupStartFilterHandler(StartFilterDouble) {
		var msgH = new DoubleMessageHandler().doubleCheckAndMessaging().spyPutMessage();
		var externalContextPromise = jQuery.Deferred().resolve(new CoreFilter(msgH));

		var facetFilterConfig = [{
			'type' : 'facetFilter',
			'id' : 'startFilterOne',
			'property' : 'PropertyOne'
		}, {
			'type' : 'facetFilter',
			'id' : 'startFilterTwo',
			'property' : 'PropertyTwo'
		}, {
			'type' : 'facetFilter',
			'id' : 'startFilterThree',
			'property' : 'PropertyThree'
		}];

		var inject = {
			functions : {
				getFacetFilterConfigurations : function() {
					return facetFilterConfig;
				},
				getReducedCombinedContext : function() {
					return externalContextPromise;
				},
				createRequest : function() {
					return {
						sendGetInBatch : function(filter, callback) {
						    callback({data : []});
						}
					};
				}
			},
			instances : {
				messageHandler : msgH,
				onBeforeApfStartupPromise: jQuery.Deferred().resolve()
			},
			constructors: {
				StartFilter : StartFilterDouble
			}
		};
		return new StartFilterHandler(inject);
	}

	
	/**
	 * Returns an object with:
	 *  - constructor: a constructor that creates a stubbed StartFilter
	 *  
	 *  - instances: a list of all created instances, in creation order
	 *  
	 *  - autoResponse(boolean): a toggle to configure whether calls to
	 *    getSelectedValues and setRestriction should trigger a change of the selected values
	 *  
	 *  - changeSelectedValues(instanceIndex, selectedValues): triggers a change of the selected values
	 *  
	 *  - resetStubs(): reconnect all stubs to reset call counters
	 */
	function managerOfStubbedStartFilters() {
		var selectedValuesStreams = [];
		var instances = [];
		var startFilterCount = 0;
		var autoResponse = true;

		function StartFilterStub() {
			StartFilter.apply(this, arguments);

			var nthInstance = startFilterCount++;
			selectedValuesStreams.push(promiseStream());
			instances.push(this);
			
			installStubs(this, nthInstance);
		}
		
		function installStubs(instance, instanceIndex) {
			sinon.stub(instance, "getSelectedValues", function() {
				if (autoResponse) {
					selectedValuesStreams[instanceIndex].rememberNext(['NewSelectedProperty']);
				}
				return selectedValuesStreams[instanceIndex].promise();
			});
			sinon.stub(instance, "setRestriction", function(restrictionFilter) {
				if (autoResponse) {
					selectedValuesStreams[instanceIndex].next(['SelectedPropertyDueToRestriction']);
				}
			});
		}
		
		function restoreStubs(instance, instanceIndex) {
			instance.getSelectedValues.restore();
			instance.setRestriction.restore();
		}
		
		function changeSelectedValues(instanceIndex, selectedValues) {
			selectedValuesStreams[instanceIndex].next(selectedValues);
		}
		
		return {
			changeSelectedValues: changeSelectedValues,
			instances: instances,
			constructor: StartFilterStub,
			autoResponse: function(activate) {
				autoResponse = activate;
			},
			resetStubs: function() {
				instances.forEach(restoreStubs);
				instances.forEach(installStubs);
			}
		};
	}
	
	/**
	 * Abstracts the logic used by the StartFilter(Handler) to replace resolved
	 * promises with new ones so that an event can be fired multiple times.
	 * - next: raises a new event.
	 * 
	 * - rememberNext: raises a new event and keeps the resolved promise so that
	 *   further listeners will get it directly after subscribing.
	 *   
	 * - promise: returns the last promise (resolved if rememberNext was called before)
	 */
	function promiseStream() {
		var deferred = jQuery.Deferred();
		var deferredForPromise = deferred;
		return {
			next: function(x) {
				var lastDeferred = deferred;
				deferred = jQuery.Deferred();
				deferredForPromise = deferred;
				lastDeferred.resolve(x, deferred);
			},
			rememberNext: function(x) {
				var lastDeferred = deferred;
				deferred = jQuery.Deferred();
				deferredForPromise = lastDeferred;
				lastDeferred.resolve(x, deferred);
			},
			promise: function() {
				return deferredForPromise.promise();
			}
		};
	}
	
	/**
	 * Workaround to trigger the initial request propagation of the
	 * StartFilterHandler passed.
	 */
	function triggerInitialization(startFilterHandler) {
		startFilterHandler.getCumulativeFilter();
	}
	
	function matchPropertiesInvolvedInFilter(expected) {
		return sinon.match(function(filter) {
			return JSON.stringify(expected) === JSON.stringify(filter.getProperties());
		});
	}

	/**
	 * Create a start filter to be injected a request handler.
	 */
	function setupStartFilter(sendGetRequest) {
		var messageHandler = new DoubleMessageHandler().doubleCheckAndMessaging().spyPutMessage();
		var externalContextPromise = jQuery.Deferred().resolve(new CoreFilter(messageHandler));

		var inject = {
			functions : {
				getReducedCombinedContext : function() {
					return externalContextPromise;
				},
				createRequest : function(id) {
					return {
						sendGetInBatch: function(filter, callback) {
							sendGetRequest(id, filter, callback);
						}
					};
				}
			},
			instances : {
				messageHandler : messageHandler
			}
		};
		var startFilter = new StartFilter(inject, {
			'type' : 'facetFilter',
			'id' : 'startFilterOne',
			'property' : 'PropertyOne',
			'valueHelpRequest' : 'VHRPropertyOne',
			'multiSelection' : 'false',
			'label' : {
				'type' : 'label',
				'kind' : 'text',
				'key' : 'PropertyOne'
			}
		});
		
		return {
			startFilter: startFilter,
			messageHandler: messageHandler
		};
	}
	
	// === Tests ===

	QUnit.module('Propagation');

	QUnit.test('When selection of first filter changed', function(assert) {
		assert.expect(6);
		
		// arrange
		var filterStubManager = managerOfStubbedStartFilters();
		var startFilterHandler = setupStartFilterHandler(filterStubManager.constructor);
		triggerInitialization(startFilterHandler);
		
		// reset call counters for stubbed methods
		filterStubManager.resetStubs();

		// act
		filterStubManager.changeSelectedValues(0, ['PropertyOneValue']);
		var cumulativeFilterPromise = startFilterHandler.getCumulativeFilter();

		// assert
		var firstFilter = filterStubManager.instances[0];
		var secondFilter = filterStubManager.instances[1];
		var thirdFilter = filterStubManager.instances[2];
		
		assert.equal(firstFilter.setRestriction.callCount, 0,
			"then setRestriction not called on 1st filter");

		assert.equal(secondFilter.setRestriction.callCount, 1,
			"then setRestriction called once on 2nd filter");
		assert.ok(secondFilter.setRestriction.calledWith(matchPropertiesInvolvedInFilter(["PropertyOne"])),
			"then 2nd filter is restricted by PropertyOne");

		assert.equal(thirdFilter.setRestriction.callCount, 1,
			"then setRestriction called once on 3rd filter");
		assert.ok(thirdFilter.setRestriction.calledWith(matchPropertiesInvolvedInFilter(["PropertyOne", "PropertyTwo"])),
			"then 3rd filter is restricted by PropertyOne and PropertyTwo");

		assert.equal(cumulativeFilterPromise.state(), "resolved", "then propagation succeeds and finishes");
	});

	QUnit.test('When selection of second filter changed', function(assert) {
		assert.expect(5);
		
		// arrange
		var filterStubManager = managerOfStubbedStartFilters();

		var startFilterHandler = setupStartFilterHandler(filterStubManager.constructor);
		triggerInitialization(startFilterHandler);
		
		// reset call counters for stubbed methods
		filterStubManager.resetStubs();
		
		// act
		filterStubManager.changeSelectedValues(1, ['PropertyTwoValue']);
		var cumulativeFilterPromise = startFilterHandler.getCumulativeFilter();
		
		// assert
		var firstFilter = filterStubManager.instances[0];
		var secondFilter = filterStubManager.instances[1];
		var thirdFilter = filterStubManager.instances[2];

		assert.equal(firstFilter.setRestriction.callCount, 0,
			"then setRestriction not called on 1st filter");
		
		assert.equal(secondFilter.setRestriction.callCount, 0,
			"then setRestriction not called on 2nd filter");

		assert.equal(thirdFilter.setRestriction.callCount, 1,
			"then setRestriction called once on 3rd filter");
		assert.ok(thirdFilter.setRestriction.calledWith(matchPropertiesInvolvedInFilter(["PropertyOne", "PropertyTwo"])),
			"then 3rd filter is restricted by PropertyOne and PropertyTwo");

		assert.equal(cumulativeFilterPromise.state(), "resolved", "then propagation succeeds and finishes");
	});

	QUnit.test('When selection of third filter changed', function(assert) {
		assert.expect(4);
		
		// arrange
		var filterStubManager = managerOfStubbedStartFilters();
		var startFilterHandler = setupStartFilterHandler(filterStubManager.constructor);
		triggerInitialization(startFilterHandler);
		
		// reset call counters for stubbed methods
		filterStubManager.resetStubs();

		// act
		filterStubManager.changeSelectedValues(2, ['PropertyThreeValue1']);
		var cumulativeFilterPromise = startFilterHandler.getCumulativeFilter();

		// assert
		var firstFilter = filterStubManager.instances[0];
		var secondFilter = filterStubManager.instances[1];
		var thirdFilter = filterStubManager.instances[2];

		assert.equal(firstFilter.setRestriction.callCount, 0,
			"then setRestriction not called on 1st filter");
		
		assert.equal(secondFilter.setRestriction.callCount, 0,
			"then setRestriction not called on 2nd filter");

		assert.equal(thirdFilter.setRestriction.callCount, 0,
			"then setRestriction not called on 3rd filter");

		assert.equal(cumulativeFilterPromise.state(), "resolved", "then propagation succeeds and finishes");
	});

	QUnit.test('When no consecutive selection changes are reported', function(assert) {
		assert.expect(5);
		
		// arrange
		var filterStubManager = managerOfStubbedStartFilters();
		var startFilterHandler = setupStartFilterHandler(filterStubManager.constructor);
		triggerInitialization(startFilterHandler);
		
		// reset call counters for stubbed methods
		filterStubManager.resetStubs();
		// do not respond to requests
		filterStubManager.autoResponse(false);

		// act
		filterStubManager.changeSelectedValues(0, ['PropertyOneValue1']);
		var cumulativeFilterPromise = startFilterHandler.getCumulativeFilter();

		// assert
		var firstFilter = filterStubManager.instances[0];
		var secondFilter = filterStubManager.instances[1];
		var thirdFilter = filterStubManager.instances[2];

		assert.equal(firstFilter.setRestriction.callCount, 0,
			"then setRestriction not called on 1st filter");
		
		assert.equal(secondFilter.setRestriction.callCount, 1,
			"then setRestriction called once on 2nd filter");
		assert.ok(secondFilter.setRestriction.calledWith(matchPropertiesInvolvedInFilter(["PropertyOne"])),
			"then 2nd filter is restricted by PropertyOne");

		assert.equal(thirdFilter.setRestriction.callCount, 0,
			"then setRestriction not called on 3rd filter");

		assert.equal(cumulativeFilterPromise.state(), "pending",
			"then propagation does not complete");
	});
	
	// Module: Test individual start filters
	
	concurrenceTester.testSeries('Individual start filters (propagation outcomes should not depend on race conditions)', function(assert) {
		assert.expect(1);

		var responseA = jQuery.Deferred();
		var responseB = jQuery.Deferred();

		var setup = setupStartFilter(handleGetRequest);

		var restrictionA = new UtilsFilter(setup.messageHandler);
		restrictionA.getTopAnd().addOr().addExpression({
			name : 'PropertyOne',
			operator : 'eq',
			value : 'ValA'
		});
		var restrictionB = new UtilsFilter(setup.messageHandler);
		restrictionB.getTopAnd().addOr().addExpression({
			name : 'PropertyOne',
			operator : 'eq',
			value : 'ValB'
		});
		
		return {
			// call these ones sequentially
			instructions: [
				function() { setup.startFilter.setRestriction(restrictionA.getInternalFilter()); },
				function() { setup.startFilter.setRestriction(restrictionB.getInternalFilter()); }
			],
			// callbacks are permuted and called before, between and after the instructions
			callbacks: [
				resolveResponseA,
				resolveResponseB
			],
			assert: function(assert) {
				setup.startFilter.getSelectedValues().done(function(selectedValues) {
					assert.deepEqual(selectedValues, ['ValB']);
				});
			}
		};

		// ===
		
		function handleGetRequest(id, filter, callback) {
			switch (id) {
			case "VHRPropertyOne":
				waitForResponse(filter, callback);
				break;
			default:
				throw new Error("unexpected request id");
			}
		}

		function waitForResponse(fltr, cb) {
			if (fltr && fltr.isEqual(restrictionA.getInternalFilter())) {
				responseA.done(cb);
			} else if (fltr && fltr.isEqual(restrictionB.getInternalFilter())) {
				responseB.done(cb);
			} else {
				throw new Error("unexpected filter");
			}
		}

		function resolveResponseA() {
			responseA.resolve({
				data: [{
					PropertyOne: 'ValA',
					Description: 'Value A'
				}]
			});
		}

		function resolveResponseB() {
			responseB.resolve({
				data: [{
					PropertyOne: 'ValB',
					Description: 'Value B'
				}]
			});
		}
	}, 2, 2);
});
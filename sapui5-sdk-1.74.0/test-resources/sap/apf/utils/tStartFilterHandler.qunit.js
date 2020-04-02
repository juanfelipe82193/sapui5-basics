sap.ui.define("sap/apf/utils/tStartFilterHandler", [
	"sap/apf/utils/startFilterHandler",
	"sap/apf/utils/startFilter",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/core/utils/filter",
	"sap/apf/utils/filter",
	"sap/apf/utils/utils"
], function(StartFilterHandler, StartFilter, DoubleMessageHandler, Filter, UtilsFilter, utils){
	'use strict';
	var useDefaultFacetFilterConfig = 'defaultFFC';
	var emptyPromise = { done : function(){} };
	function getStartFilterSpy(){
		var object = {};
		object.StartFilter = StartFilter;
		return sinon.spy(object, "StartFilter");
	}
	function commonSetup(testEnv, facetFilterConfig, externalContextPromise, StartFilterDouble, onBeforeApfStartupPromise) {
		testEnv.msgH = new DoubleMessageHandler().doubleCheckAndMessaging().spyPutMessage();
		if (!externalContextPromise) {
			externalContextPromise = jQuery.Deferred().resolve(new Filter(testEnv.msgH));
		}
		if (facetFilterConfig === useDefaultFacetFilterConfig) {
			facetFilterConfig = [ {
				'type' : 'facetFilter',
				'id' : 'startFilterOne',
				'property' : 'PropertyOne',
				'multiSelection' : true,
				'preselectionDefaults' : ['ValA']
			}, {
				'type' : 'facetFilter',
				'id' : 'startFilterTwo',
				'property' : 'PropertyTwo',
				'multiSelection' : true,
				'preselectionDefaults' : ['ValB']
			}, {
				'type' : 'facetFilter',
				'id' : 'startFilterThree',
				'property' : 'PropertyThree',
				'multiSelection' : true,
				'preselectionDefaults' : ['ValC']
			}, {
				'type' : 'facetFilter',
				'id' : 'startFilterFour',
				'property' : 'PropertyFour',
				'multiSelection' : true
			} ];
		}
		if(testEnv.useInvisibleFilter){
			facetFilterConfig[3].invisible = true;
		}
		testEnv.requestCounter = 0;
		testEnv.requestFilters = [];
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
							testEnv.requestFilters.push(filter);
							testEnv.requestCounter++;
							callback({data : []});
						}
					};
				}
			},
			instances : {
				messageHandler : testEnv.msgH,
				onBeforeApfStartupPromise: onBeforeApfStartupPromise || jQuery.Deferred().resolve()
			},
			constructors: {
				StartFilter : StartFilterDouble
			}
		};
		testEnv.startFilterHandler = new StartFilterHandler(inject);
	}
	QUnit.module('Start filter creation from configuration', {
		beforeEach : function() {
			this.facetFilterConfig = [ {
				'type' : 'facetFilter',
				'id' : 'startFilterOne',
				'property' : 'PropertyOne',
				'alias' : 'PropertyOneToUseOneUI',
				'valueHelpRequest' : 'VHRPropertyOne',
				'multiSelection' : 'false',
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyOne'
				}
			}, {
				'type' : 'facetFilter',
				'id' : 'startFilterTwo',
				'property' : 'PropertyTwo',
				'valueHelpRequest' : 'VHRPropertyTwo',
				'filterResolutionRequest' : 'FRRPropertyTwo',
				'multiSelection' : 'true',
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyTwo'
				}
			} ];
		}
	});
	QUnit.test('Get start filter instances', function(assert) {
		assert.expect(2);
		commonSetup(this, this.facetFilterConfig);
		var promiseStartFilter = this.startFilterHandler.getStartFilters();
		promiseStartFilter.done(function(startFilters) {
			assert.equal(startFilters.length, 2, 'Two start filter instances returned');
			assert.equal(startFilters[1].getPropertyName(), 'PropertyTwo', 'Correct property name returned');
		});
	});
	QUnit.test('Get cumulaltive filter after selected values from all start filters available', function(assert) {
		assert.expect(2);
		var cumulativeFilterPromise;
		var selectedValuesPromise = jQuery.Deferred();
		function StartFilterDouble() {
			StartFilter.apply(this, arguments);
			this.getSelectedValues = function() {
				return selectedValuesPromise.promise();
			};
		}
		commonSetup(this, this.facetFilterConfig, undefined, StartFilterDouble);
		cumulativeFilterPromise = this.startFilterHandler.getCumulativeFilter();
		assert.equal(cumulativeFilterPromise.state(), 'pending', 'Pending expected');
		selectedValuesPromise.resolve([ 'one', 'two' ], emptyPromise);
		cumulativeFilterPromise.done(function(cumulativeFilter) {
			assert.equal(cumulativeFilter.toUrlParam(), '(((PropertyOne%20eq%20%27one%27)%20or%20(PropertyOne%20eq%20%27two%27))%20and%20((PropertyTwo%20eq%20%27one%27)%20or%20(PropertyTwo%20eq%20%27two%27)))',
					'Two filters resolved with same values');
		});
	});
	QUnit.test('Promise for getCumulativeFilter() is resolved if no start filters are configured and no external context retrieved', function(assert) {
		assert.expect(1);
		commonSetup(this, []);
		this.startFilterHandler.getCumulativeFilter().done(function(cumulativeFilter) {
			assert.equal(cumulativeFilter.toUrlParam(), '', 'Promise resolved with empty filter');
		});
	});
	QUnit.test('Get cumulative filter when start filter returns null as selected values', function(assert) {
		assert.expect(1);
		var facetFilterConfig = [ {
			'type' : 'facetFilter',
			'id' : 'startFilterOne',
			'property' : 'PropertyOne',
			'multiSelection' : 'false',
			'label' : {
				'type' : 'label',
				'kind' : 'text',
				'key' : 'PropertyOne'
			}
		} ];
		commonSetup(this, facetFilterConfig);
		this.startFilterHandler.getCumulativeFilter().done(function(cumulativeFilter) {
			assert.ok(cumulativeFilter.isEmpty(), 'Promise resolved with empty filter');
		});
	});
	
	QUnit.module('External context for NON-CONFIGURED properties', {
		beforeEach : function() {
			var configurationFactoryAlwaysReturnsAnArrayForFacetFilterConfig = [];
			this.externalContextPromise = jQuery.Deferred();
			this.startFilterSpy = getStartFilterSpy();
			commonSetup(this, configurationFactoryAlwaysReturnsAnArrayForFacetFilterConfig, this.externalContextPromise, this.startFilterSpy);
		},
		afterEach : function() {
			this.startFilterSpy.restore();
		}
	});
	QUnit.test('External context containing non-equality filter', function(assert) {
		assert.expect(1);
		var filter = new Filter(this.msgH, 'NonConfiguredProperty', 'ge', '1000');
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '(NonConfiguredProperty%20ge%20%271000%27)', 'Non-equality filter is reflected in cumulative filter');
		});
	});
	QUnit.test('External context containing multiple equalities as disjunctions', function(assert) {
		assert.expect(1);
		var filterValue1 = new Filter(this.msgH, 'NonConfiguredProperty', 'eq', '1000');
		var filterValue2 = new Filter(this.msgH, 'NonConfiguredProperty', 'eq', '2000');
		var filterValue3 = new Filter(this.msgH, 'NonConfiguredProperty', 'eq', '3000');
		filterValue1.addOr(filterValue2);
		filterValue1.addOr(filterValue3);

		this.externalContextPromise.resolve(filterValue1);
		this.startFilterHandler.getCumulativeFilter().done(
				function(filter) {
					assert.equal(filter.toUrlParam(), '((NonConfiguredProperty%20eq%20%271000%27)%20or%20(NonConfiguredProperty%20eq%20%272000%27)%20or%20(NonConfiguredProperty%20eq%20%273000%27))',
					'Disjunction over conjunction reflected in cumulative filter');
				});
	});
	QUnit.test('External context containing equalities as disjunctions over conjunctions', function(assert) {
		assert.expect(1);
		var filterValue1 = new Filter(this.msgH, 'NonConfiguredProperty', 'eq', '1000');
		var filterValue2 = new Filter(this.msgH, 'NonConfiguredProperty', 'eq', '2000');
		var filterAnd = new Filter(this.msgH, 'NonConfiguredProperty', 'eq', '2000');
		var filterOr = new Filter(this.msgH);
		filterOr.addOr(filterValue1);
		filterOr.addOr(filterValue2);
		filterAnd.addAnd(filterOr);
		this.externalContextPromise.resolve(filterAnd);
		this.startFilterHandler.getCumulativeFilter().done(
				function(filter) {
					assert.equal(filter.toUrlParam(), '((NonConfiguredProperty%20eq%20%272000%27)%20and%20((NonConfiguredProperty%20eq%20%271000%27)%20or%20(NonConfiguredProperty%20eq%20%272000%27)))',
							'Disjunction over conjunction reflected in cumulative filter');
				});
	});
	QUnit.test('NON-CONFIGURED properties are not returned by getStartFilters()', function(assert) {
		assert.expect(1);
		var filter = new Filter(this.msgH, 'NonConfiguredProperty', 'eq', 'ValA');
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.equal(startFilters.length, 0, 'Property is implicitly set to invisible as it is not configured');
		});
	});
	QUnit.test('Start filter for each property created after external context containing equalities only resolved', function(assert) {
		assert.expect(2);
		var filter = new Filter(this.msgH, 'PropertyOne', 'eq', 'ValA');
		filter.addAnd('PropertyTwo', 'eq', 'ValB');
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.deepEqual(this.startFilterSpy.getCall(0).args[2], [ 'ValA' ], 'First created start filter received context as list');
			assert.deepEqual(this.startFilterSpy.getCall(1).args[2], [ 'ValB' ], 'Second created start filter received context as list');
		}.bind(this));
	});
	QUnit.test('Start filter for each property created after external context containing non-equalities only resolved', function(assert) {
		assert.expect(2);
		var filterPropOne = new Filter(this.msgH, 'PropertyOne', 'bt', 'ValA', 'ValB');
		var filterPropTwo = new Filter(this.msgH, 'PropertyTwo', 'bt', 'ValC', 'ValD');
		var filter = new Filter(this.msgH).addAnd(filterPropOne).addAnd(filterPropTwo);
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.equal(this.startFilterSpy.getCall(0).args[2].toUrlParam(), '((PropertyOne%20ge%20%27ValA%27)%20and%20(PropertyOne%20le%20%27ValB%27))', 'First created start filter received context as filter');
			assert.equal(this.startFilterSpy.getCall(1).args[2].toUrlParam(), '((PropertyTwo%20ge%20%27ValC%27)%20and%20(PropertyTwo%20le%20%27ValD%27))', 'Second created start filter received context as filter');
		}.bind(this));
	});
	QUnit.test('Start filter for each property created after external context containing equalities and non-equalities resolved', function(assert) {
		assert.expect(2);
		var filterBTone = new Filter(this.msgH, 'PropertyOne', 'bt', 'ValA', 'ValB');
		var filterBTtwo = new Filter(this.msgH, 'PropertyOne', 'bt', 'ValC', 'ValD');
		var filterBT = new Filter(this.msgH).addOr(filterBTone).addOr(filterBTtwo);
		var filterEQ = new Filter(this.msgH, 'PropertyTwo', 'eq', 'ValX');
		filterEQ.addOr('PropertyTwo', 'eq', 'ValY');
		var filter = new Filter(this.msgH).addAnd(filterBT).addAnd(filterEQ);
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters().done(
				function(startFilters) {
					assert.equal(this.startFilterSpy.getCall(0).args[2].toUrlParam(), '(((PropertyOne%20ge%20%27ValA%27)%20and%20(PropertyOne%20le%20%27ValB%27))%20or%20((PropertyOne%20ge%20%27ValC%27)%20and%20(PropertyOne%20le%20%27ValD%27)))',
							'First created start filter received context as filter');
					assert.deepEqual(this.startFilterSpy.getCall(1).args[2], [ 'ValX', 'ValY' ], 'Second created start filter received context as list');
				}.bind(this));
	});
	QUnit.module('External context for CONFIGURED startFilter with date values', {
		beforeEach : function() {
			this.metadataProperty = {
					getAttribute : function(){
						return "Edm.String";
					}
				};
			var facetFilterConfig = [ {
				'type' : 'facetFilter',
				'id' : 'startFilterOne',
				'property' : 'PropertyOne',
				'multiSelection' : true,
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyOne'
				},
				'metadataProperty': this.metadataProperty
			}];
			this.externalContextPromise = jQuery.Deferred();
			this.startFilterSpy = getStartFilterSpy();
			this.convertToInternalDateSpy = sinon.spy(utils, "convertDateListToInternalFormat");
			this.isDatePropertyStub = sinon.stub(utils, "isPropertyTypeWithDateSemantics", function(){
				return this.isDateProperty;
			}.bind(this));
			commonSetup(this, facetFilterConfig, this.externalContextPromise, this.startFilterSpy);
		},
		afterEach : function() {
			this.startFilterSpy.restore();
			this.convertToInternalDateSpy.restore();
			this.isDatePropertyStub.restore();
		}
	});
	QUnit.test("Property is annotated as date value", function(assert) {
		this.isDateProperty = true;
		var filter = new Filter(this.msgH, 'PropertyOne', 'eq', '2017-12-30');
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.deepEqual(this.isDatePropertyStub.getCall(0).args[0], this.metadataProperty, "isPropertyTypeWithDateSemantics is called with correct metadata");
			assert.deepEqual(this.convertToInternalDateSpy.getCall(0).args[0], ["2017-12-30"], "Values correctly handed over to convertToInternalDateSpy");
			assert.strictEqual(this.convertToInternalDateSpy.getCall(0).args[1], this.metadataProperty, "Metadata property correctly handed over to convertToInternalDateSpy");
			assert.deepEqual(this.startFilterSpy.getCall(0).args[2], ["20171230"], 'Created start filter received converted context as list');
		}.bind(this));
	});
	QUnit.test("Property is not annotated as date value", function(assert) {
		this.isDateProperty = false;
		var filter = new Filter(this.msgH, 'PropertyOne', 'eq', '2017-12-30');
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.deepEqual(this.isDatePropertyStub.getCall(0).args[0], this.metadataProperty, "isPropertyTypeWithDateSemantics is called with correct metadata");
			assert.deepEqual(this.convertToInternalDateSpy.callCount, 0, "ConvertToInternalDateSpy was not called");
			assert.deepEqual(this.startFilterSpy.getCall(0).args[2], ["2017-12-30"], 'Created start filter received unconverted context as list');
		}.bind(this));
	});
	QUnit.module('External context for CONFIGURED and NON-CONFIGURED properties', {
		beforeEach : function() {
			var facetFilterConfig = [ {
				'type' : 'facetFilter',
				'id' : 'startFilterOne',
				'property' : 'PropertyOne',
				'multiSelection' : true,
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyOne'
				}
			}, {
				'type' : 'facetFilter',
				'id' : 'startFilterTwo',
				'property' : 'PropertyTwo',
				'multiSelection' : true,
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyTwo'
				}
			} ];
			this.externalContextPromise = jQuery.Deferred();
			this.startFilterSpy = getStartFilterSpy();
			this.isDatePropertyStub = sinon.stub(utils, "isPropertyTypeWithDateSemantics", function(){
				return false;
			});
			commonSetup(this, facetFilterConfig, this.externalContextPromise, this.startFilterSpy);
		},
		afterEach : function() {
			this.startFilterSpy.restore();
			this.isDatePropertyStub.restore();
		}
	});
	QUnit.test('Resolved external context containing equalities only merged into start filter for configured and non-configured properties', function(assert) {
		assert.expect(2);
		var filter = new Filter(this.msgH, 'PropertyOne', 'eq', 'ValA');
		filter.addOr('PropertyOne', 'eq', 'ValB');
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.deepEqual(this.startFilterSpy.getCall(0).args[2], [ 'ValA', 'ValB' ], 'First created start filter received context as list');
			assert.equal(this.startFilterSpy.getCall(1).args[2], undefined, 'Second created start filter received no context');
		}.bind(this));
	});
	QUnit.test('Resolved external context containing non-equalities only merged into start filter for configured and non-configured properties', function(assert) {
		assert.expect(3);
		var filterBTone = new Filter(this.msgH, 'PropertyOne', 'bt', 'ValA', 'ValB');
		var filterBTtwo = new Filter(this.msgH, 'PropertyThree', 'bt', 'ValX', 'ValY');
		var filter = new Filter(this.msgH).addOr(filterBTone).addOr(filterBTtwo);
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.equal(this.startFilterSpy.getCall(0).args[2].toUrlParam(), '((PropertyOne%20ge%20%27ValA%27)%20and%20(PropertyOne%20le%20%27ValB%27))', 'First created start filter received context as filter');
			assert.equal(this.startFilterSpy.getCall(1).args[2], undefined, 'Second created start filter received no context');
			assert.equal(this.startFilterSpy.getCall(2).args[2].toUrlParam(), '((PropertyThree%20ge%20%27ValX%27)%20and%20(PropertyThree%20le%20%27ValY%27))', 'Third created start filter received context as filter');
		}.bind(this));
	});
	QUnit.test('Resolved external context containing equalities and non-equalities merged into start filter for configured and non-configured properties', function(assert) {
		assert.expect(3);
		var filterBTone = new Filter(this.msgH, 'PropertyOne', 'bt', 'ValA', 'ValB');
		var filterBTtwo = new Filter(this.msgH, 'PropertyOne', 'bt', 'ValC', 'ValD');
		var filterBT = new Filter(this.msgH).addOr(filterBTone).addOr(filterBTtwo);
		var filterEQ = new Filter(this.msgH, 'PropertyThree', 'eq', 'ValX');
		filterEQ.addOr('PropertyThree', 'eq', 'ValY');
		var filter = new Filter(this.msgH).addAnd(filterBT).addAnd(filterEQ);
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters().done(
				function(startFilters) {
					assert.equal(this.startFilterSpy.getCall(0).args[2].toUrlParam(), '(((PropertyOne%20ge%20%27ValA%27)%20and%20(PropertyOne%20le%20%27ValB%27))%20or%20((PropertyOne%20ge%20%27ValC%27)%20and%20(PropertyOne%20le%20%27ValD%27)))',
							'First created start filter received context as filter');
					assert.equal(this.startFilterSpy.getCall(1).args[2], undefined, 'Second created start filter received no context');
					assert.deepEqual(this.startFilterSpy.getCall(2).args[2], [ 'ValX', 'ValY' ], 'Third created start filter received context as list');
				}.bind(this));
	});
	QUnit.test('Implicitly invisible start filter not returned', function(assert) {
		var filterBetween = new Filter(this.msgH, 'PropertyOne', 'bt', 'ValA', 'ValB');
		this.externalContextPromise.resolve(filterBetween);
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.equal(startFilters.length, 1, 'Only one start filter expected although two are configured. The one for PropertyOne is implicitly set to invisible and therefore not returned');
		});
	});
	QUnit.test('Only configured properties are returned by getStartFilters()', function(assert) {
		assert.expect(1);
		var filter = new Filter(this.msgH, 'NonConfiguredProperty', 'eq', 'ValA');
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.equal(startFilters.length, 2, 'Only two start filters returned. Non-configured property from external context is implicitly set to invisible ');
		});
	});
	QUnit.test('Non-configured property passes multiple values from external context to cumulative filter', function(assert) {
		assert.expect(1);
		var configuredPropertyFilter;
		var nonConfiguredPropertyFilter;
		var conjunctionOfBothPropertiesFilter;
		configuredPropertyFilter = new Filter(this.msgH, 'PropertyOne', 'eq', 'ValA');
		configuredPropertyFilter.addOr('PropertyOne', 'eq', 'ValB');
		nonConfiguredPropertyFilter = new Filter(this.msgH, 'PropertyThree', 'eq', 'ValX');
		nonConfiguredPropertyFilter.addOr('PropertyThree', 'eq', 'ValY');
		conjunctionOfBothPropertiesFilter = new Filter(this.msgH);
		conjunctionOfBothPropertiesFilter
			.addAnd(configuredPropertyFilter)
			.addAnd(nonConfiguredPropertyFilter);

		this.externalContextPromise.resolve(conjunctionOfBothPropertiesFilter);	

		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '((((PropertyThree%20eq%20%27ValX%27)%20or%20(PropertyThree%20eq%20%27ValY%27))%20and%20((PropertyOne%20eq%20%27ValA%27)%20or%20(PropertyOne%20eq%20%27ValB%27))))', 'All external filter values are reflected in cumulative filter');
		});
	});
	
	QUnit.module('Application specific context for NON-CONFIGURED properties', {
		beforeEach : function() {
			var configurationFactoryAlwaysReturnsAnArrayForFacetFilterConfig = [];
			commonSetup(this, configurationFactoryAlwaysReturnsAnArrayForFacetFilterConfig);
		}
	});
	QUnit.test('Restriction by property filter with OR over equalities results in cumulative start filter', function(assert) {
		var filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addOr().addExpression({
			name : 'PropY',
			operator : 'eq',
			value : 'ValA'
		}).addExpression({
			name : 'PropY',
			operator : 'eq',
			value : 'ValB'
		}).addExpression({
			name : 'PropY',
			operator : 'eq',
			value : 'ValC'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '((PropY%20eq%20%27ValA%27)%20or%20(PropY%20eq%20%27ValB%27)%20or%20(PropY%20eq%20%27ValC%27))', 'Disjunction on equality terms in cumulative start filter');
		});
	});
	QUnit.test('Restriction by property filter with conjunction of LE and GE', function(assert) {
		var filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addExpression({
			name : 'PropY',
			operator : 'GE',
			value : 'XXX'
		}).addExpression({
			name : 'PropY',
			operator : 'LE',
			value : 'YYY'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '((PropY%20ge%20%27XXX%27)%20and%20(PropY%20le%20%27YYY%27))', 'Conjunction of GE and LE');
		});
	});
	QUnit.test('Update of restriction by property filter with conjunction of GE and LE', function(assert) {
		var initialFilter = new UtilsFilter(this.msgH);
		initialFilter.getTopAnd().addExpression({
			name : 'PropY',
			operator : 'GE',
			value : 'XXX'
		}).addExpression({
			name : 'PropY',
			operator : 'LE',
			value : 'YYY'
		});
		this.startFilterHandler.setRestrictionByProperty(initialFilter);

		var changedFilter = new UtilsFilter(this.msgH);
		changedFilter.getTopAnd().addExpression({
			name : 'PropY',
			operator : 'LE',
			value : 'ZZZ'
		}).addExpression({
			name : 'PropY',
			operator : 'GE',
			value : 'WWW'
		});
		this.startFilterHandler.setRestrictionByProperty(changedFilter);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '((PropY%20le%20%27ZZZ%27)%20and%20(PropY%20ge%20%27WWW%27))', 'Conjunction of LE and GE in cumulative filter');
		});
	});
	QUnit.test('Update of restriction reflected in cumulative filter', function(assert) {
		var filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addExpression({
			name : 'UnknownX',
			operator : 'eq',
			value : 'ValOne'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '(UnknownX%20eq%20%27ValOne%27)', 'First value reflected');
		});
		
		filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addExpression({
			name : 'UnknownX',
			operator : 'eq',
			value : 'ValTwo'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '(UnknownX%20eq%20%27ValTwo%27)', 'Second value reflected');
		});
		
		filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addExpression({
			name : 'UnknownX',
			operator : 'eq',
			value : 'ValThree'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '(UnknownX%20eq%20%27ValThree%27)', 'Third value reflected');
		});
	});
	QUnit.test('Set restriction for two different properties is reflected in cumulative filter', function(assert) {
		var filterA = new UtilsFilter(this.msgH);
		filterA.getTopAnd().addExpression({
			name : 'PropA',
			operator : 'eq',
			value : 'ValA'
		});
		
		var filterB = new UtilsFilter(this.msgH);
		filterB.getTopAnd().addExpression({
			name : 'PropB',
			operator : 'eq',
			value : 'ValB'
		});
		
		this.startFilterHandler.setRestrictionByProperty(filterA);
		this.startFilterHandler.setRestrictionByProperty(filterB);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '((PropB%20eq%20%27ValB%27)%20and%20(PropA%20eq%20%27ValA%27))', 'Cumulative filter contains both properties');
		});
	});
	QUnit.module('Application specific context for CONFIGURED properties');
	QUnit.test('Overwrite preselection defaults of VISIBLE start filter when restricting by property filter', function(assert) {
		assert.expect(2);
		var filter;
		commonSetup(this, [ {
			'type' : 'facetFilter',
			'id' : 'startFilterOne',
			'property' : 'PropertyOne',
			'multiSelection' : true,
			'preselectionDefaults' : [ 'ValA', 'ValB', 'ValC' ]
		}, {
			'type' : 'facetFilter',
			'id' : 'startFilterTwo',
			'property' : 'PropertyTwo',
			'multiSelection' : true,
			'preselectionDefaults' : [ 'ValX', 'ValY' ]
		} ]);
		filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addOr().addExpression({
			name : 'PropertyOne',
			operator : 'eq',
			value : 'ValC'
		}).addExpression({
			name : 'PropertyOne',
			operator : 'eq',
			value : 'ValD'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.getCumulativeFilter().done(
				function(filter) {
					assert.equal(filter.toUrlParam(), '((PropertyOne%20eq%20%27ValC%27)%20and%20((PropertyTwo%20eq%20%27ValX%27)%20or%20(PropertyTwo%20eq%20%27ValY%27)))',
							'Application specific restriction only applied on selectable values, i.e. resulting restriction is intersection of preselection and restriction values');
				});
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.equal(startFilters.length, 2, 'Update on property where start filter is configured does not create additional start filter');
		});
	});
	QUnit.test('Overwrite selection of INVISIBLE start filter when restricting by property filter', function(assert) {
		assert.expect(1);
		var filter;
		commonSetup(this, [ {
			'type' : 'facetFilter',
			'id' : 'startFilterOne',
			'invisible' : true,
			'property' : 'PropertyOne',
			'multiSelection' : true,
			'preselectionDefaults' : [ 'ValA', 'ValB', 'ValC' ]
		}, {
			'type' : 'facetFilter',
			'id' : 'startFilterTwo',
			'property' : 'PropertyTwo',
			'multiSelection' : true,
			'preselectionDefaults' : [ 'ValX', 'ValY' ]
		} ]);
		filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addOr().addExpression({
			name : 'PropertyOne',
			operator : 'eq',
			value : 'ValR'
		}).addExpression({
			name : 'PropertyOne',
			operator : 'eq',
			value : 'ValS'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.getCumulativeFilter().done(
				function(filter) {
					assert.equal(filter.toUrlParam(), '(((PropertyOne%20eq%20%27ValR%27)%20or%20(PropertyOne%20eq%20%27ValS%27))%20and%20((PropertyTwo%20eq%20%27ValX%27)%20or%20(PropertyTwo%20eq%20%27ValY%27)))',
							'Application specific restriction fully applied to invisible start filter');
				});
	});
	QUnit.test('Update context of configured startfilter whith GE and LE in filter results in error', function(assert) {
		assert.expect(2);
		var filter;
		commonSetup(this, [ {
			'type' : 'facetFilter',
			'id' : 'startFilterOne',
			'property' : 'PropertyOne',
			'multiSelection' : true,
			'preselectionDefaults' : [ 'ValA', 'ValB', 'ValC' ]
		}]);
		filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addOr().addExpression({
			name : 'PropertyOne',
			operator : 'GE',
			value : 'ValR'
		}).addExpression({
			name : 'PropertyOne',
			operator : 'LE',
			value : 'ValS'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		assert.equal(this.msgH.spyResults.putMessage.code, '5100', "Fatal Error is thrown");
		this.startFilterHandler.getCumulativeFilter().done(
				function(filter) {
					assert.equal(filter.toUrlParam(), '(((PropertyOne%20eq%20%27ValA%27)%20or%20(PropertyOne%20eq%20%27ValB%27)%20or%20(PropertyOne%20eq%20%27ValC%27)))',
					'Cumulative filter is not changed');
				});
	});
	QUnit.module('Application specific context for CONFIGURED and NON-CONFIGURED properties', {
		beforeEach : function() {
			var facetFilterConfig = [ {
				'type' : 'facetFilter',
				'id' : 'startFilterOne',
				'property' : 'PropertyOne',
				'multiSelection' : true,
				'preselectionDefaults' : [ 'ValA', 'ValB' ]
			}, {
				'type' : 'facetFilter',
				'id' : 'startFilterTwo',
				'property' : 'PropertyTwo',
				'multiSelection' : true,
				'preselectionDefaults' : [ 'ValX', 'ValY' ]
			} ];
			commonSetup(this, facetFilterConfig);
		}
	});
	QUnit.test('Non configured properties are at the beginning of the sequence', function(assert) {
		assert.expect(2);
		var filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addOr().addExpression({
			name : 'PropertyFromOuterSpace',
			operator : 'eq',
			value : 'ValS'
		}).addExpression({
			name : 'PropertyFromOuterSpace',
			operator : 'eq',
			value : 'ValR'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(),
			  '((((PropertyFromOuterSpace%20eq%20%27ValS%27)%20or%20(PropertyFromOuterSpace%20eq%20%27ValR%27))%20and%20((PropertyOne%20eq%20%27ValA%27)%20or%20(PropertyOne%20eq%20%27ValB%27)))%20and%20((PropertyTwo%20eq%20%27ValX%27)%20or%20(PropertyTwo%20eq%20%27ValY%27)))',
			  'Filter updated filter replaced Desired result reflecting correct logical expression for proper input');
		});
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.equal(startFilters.length, 2, 'Update on property without configuration creates no additional visible start filter');
		});
	});
	QUnit.test('Get value of previously set restriction for a property', function(assert) {
		var applicationSpecificContextFilter = new UtilsFilter(this.msgH);
		applicationSpecificContextFilter.getTopAnd().addExpression({
			name : 'PropertyFromOuterSpace',
			operator : 'eq',
			value : 'ValX'
		});
		this.startFilterHandler.setRestrictionByProperty(applicationSpecificContextFilter);
		assert.equal(this.startFilterHandler.getRestrictionByProperty('PropertyFromOuterSpace').getInternalFilter().toUrlParam(), '(PropertyFromOuterSpace%20eq%20%27ValX%27)', 'Application specific context filter returned');
	});
	QUnit.test('Set restriction for property twice - get value returns the latter', function(assert) {
		var applicationSpecificContextFilter = new UtilsFilter(this.msgH);
		applicationSpecificContextFilter.getTopAnd().addExpression({
			name : 'PropertyFromOuterSpace',
			operator : 'eq',
			value : 'ValX'
		});
		this.startFilterHandler.setRestrictionByProperty(applicationSpecificContextFilter);
		applicationSpecificContextFilter = new UtilsFilter(this.msgH);
		applicationSpecificContextFilter.getTopAnd().addExpression({
			name : 'PropertyFromOuterSpace',
			operator : 'eq',
			value : 'ValY'
		});
		this.startFilterHandler.setRestrictionByProperty(applicationSpecificContextFilter);
		assert.equal(this.startFilterHandler.getRestrictionByProperty('PropertyFromOuterSpace').getInternalFilter().toUrlParam(), '(PropertyFromOuterSpace%20eq%20%27ValY%27)', 'Application specific context filter that has been set as last one');
	});
	QUnit.test('Update of restriction reflected in cumulative filter', function(assert) {
		var filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addExpression({
			name : 'UnknownX',
			operator : 'eq',
			value : 'ValOne'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '(((UnknownX%20eq%20%27ValOne%27)%20and%20((PropertyOne%20eq%20%27ValA%27)%20or%20(PropertyOne%20eq%20%27ValB%27)))%20and%20((PropertyTwo%20eq%20%27ValX%27)%20or%20(PropertyTwo%20eq%20%27ValY%27)))', 'First value reflected');
		});
		
		filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addExpression({
			name : 'UnknownX',
			operator : 'eq',
			value : 'ValTwo'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '(((UnknownX%20eq%20%27ValTwo%27)%20and%20((PropertyOne%20eq%20%27ValA%27)%20or%20(PropertyOne%20eq%20%27ValB%27)))%20and%20((PropertyTwo%20eq%20%27ValX%27)%20or%20(PropertyTwo%20eq%20%27ValY%27)))', 'Second value reflected');
		});
	});
	QUnit.test('Get value of restriction if no restriction was set for a property', function(assert) {
		assert.equal(this.startFilterHandler.getRestrictionByProperty('PropertyFromOuterSpace').getInternalFilter().toUrlParam(), '', 'Empty filter returned');
	});
	QUnit.module('Applying application specific restrictions of minus-one-level-filters to subsequent configured start filters', {
		beforeEach : function() {
			var testEnv = this;
			var facetFilterConfig = [ {
				'type' : 'facetFilter',
				'id' : 'startFilterOne',
				'property' : 'PropertyOne',
				'valueHelpRequest' : 'VHRPropertyOne',
				'filterResolutionRequest' : 'FRRPropertyOne',
				'multiSelection' : 'false',
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyOne'
				}
			} ];
			this.spiesSetRestriction = [];
			function StartFilterDouble() {
				StartFilter.apply(this, arguments);
				testEnv.spiesSetRestriction.push(sinon.spy(this, 'setRestriction'));
			}
			commonSetup(this, facetFilterConfig, undefined, StartFilterDouble);
		}
	});
	QUnit.test('Restriction by one property', function(assert) {
		var filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addExpression({
			name : 'NonConfOne',
			operator : 'eq',
			value : 'ValS'
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		assert.equal(this.spiesSetRestriction[0].getCall(1).args[0].toUrlParam(), '(NonConfOne%20eq%20%27ValS%27)', 'setRestriction called on configured start filter');
	});
	QUnit.test('Restriction by two properties', function(assert) {
		var filterOne = new UtilsFilter(this.msgH);
		var filterTwo = new UtilsFilter(this.msgH);
		filterOne.getTopAnd().addExpression({
			name : 'NonConfOne',
			operator : 'eq',
			value : 'ValS'
		});
		filterTwo.getTopAnd().addExpression({
			name : 'NonConfTwo',
			operator : 'eq',
			value : 'ValR'
		});
		this.startFilterHandler.setRestrictionByProperty(filterOne);
		this.startFilterHandler.setRestrictionByProperty(filterTwo);
		assert.equal(this.spiesSetRestriction[0].getCall(1).args[0].toUrlParam(), '(NonConfOne%20eq%20%27ValS%27)', 'First update calls setRestriction');
		assert.equal(this.spiesSetRestriction[0].getCall(2).args[0].toUrlParam(), '((NonConfTwo%20eq%20%27ValR%27)%20and%20(NonConfOne%20eq%20%27ValS%27))', 'Second update calls setRestriction with cumulative filter');
	});
	QUnit.module('Applying application specific initial startup restrictions');
	QUnit.test('Restrictions for configured and non-configured properties', function(assert) {
		var onBeforeApfStartupPromise = jQuery.Deferred();
		var facetFilterConfig = [ {
			'type' : 'facetFilter',
			'id' : 'startFilterOne',
			'property' : 'PropertyOne',
			'valueHelpRequest' : 'VHRPropertyOne',
			'filterResolutionRequest' : 'FRRPropertyOne',
			'multiSelection' : 'false',
			'label' : {
				'type' : 'label',
				'kind' : 'text',
				'key' : 'PropertyOne'
			}
		} ];
		commonSetup(this, facetFilterConfig, undefined, undefined, onBeforeApfStartupPromise);
		var filterOne = new UtilsFilter(this.msgH);
		var filterTwo = new UtilsFilter(this.msgH);
		filterOne.getTopAnd().addExpression({
			name : 'PropertyOne',
			operator : 'eq',
			value : 'ValR' 
		});
		filterTwo.getTopAnd().addExpression({
			name : 'NonConfOne',
			operator : 'eq',
			value : 'ValS'
		});
		this.startFilterHandler.setRestrictionByProperty(filterOne);
		this.startFilterHandler.setRestrictionByProperty(filterTwo);
		onBeforeApfStartupPromise.resolve();
		assert.equal(this.requestCounter, 1, "Only one request sent");
		assert.equal(this.requestFilters[0].toUrlParam(), "(NonConfOne%20eq%20%27ValS%27)", "Correct filter sent with request");
	});
	QUnit.module('Applying external context for NON-CONFIGURED properties of minus-one-level-filters to subsequent configured start filters', {
		beforeEach : function() {
			var testEnv = this;
			var facetFilterConfig = [ {
				'type' : 'facetFilter',
				'id' : 'startFilterOne',
				'property' : 'PropertyOne',
				'valueHelpRequest' : 'VHRPropertyOne',
				'filterResolutionRequest' : 'FRRPropertyOne',
				'multiSelection' : 'false',
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyOne'
				}
			} ];
			this.spiesSetRestriction = [];
			function StartFilterDouble() {
				StartFilter.apply(this, arguments);
				testEnv.spiesSetRestriction.push(sinon.spy(this, 'setRestriction'));
			}
			this.externalContextPromise = jQuery.Deferred();
			commonSetup(this, facetFilterConfig, this.externalContextPromise, StartFilterDouble);
		}
	});
	QUnit.test('External context as list for one NON-CONFIGURED property', function(assert) {
		var filter = new Filter(this.msgH, 'NonConfOne', 'eq', 'ValA');
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters();
		assert.equal(this.spiesSetRestriction[0].getCall(0).args[0].toUrlParam(), '(NonConfOne%20eq%20%27ValA%27)', 'External context resolution calls setRestriction');
	});
	QUnit.test('External context as internal filter for one NON-CONFIGURED property', function(assert) {
		var filter = new Filter(this.msgH, 'NonConfOne', 'lt', '100');
		this.externalContextPromise.resolve(filter);
		this.startFilterHandler.getStartFilters();
		assert.equal(this.spiesSetRestriction[0].getCall(0).args[0].toUrlParam(), '(NonConfOne%20lt%20%27100%27)', 'External context resolution calls setRestriction');
	});
	QUnit.module('Serialization / Deserialization', {
		beforeEach : function() {
			var testEnv = this;
			var facetFilterConfig = [ {
				'type' : 'facetFilter',
				'id' : 'startFilterOne',
				'property' : 'PropertyOne',
				'multiSelection' : true,
				'preselectionDefaults' : [ 'ValA', 'ValB' ]
			}, {
				'type' : 'facetFilter',
				'id' : 'startFilterTwo',
				'property' : 'PropertyTwo',
				'multiSelection' : true,
				'preselectionDefaults' : [ 'ValX', 'ValY' ]
			} ];
			function StartFilterDouble() {
				StartFilter.apply(this, arguments);
				testEnv.serializeSpy = sinon.spy(this, 'serialize');
			}
			commonSetup(this, facetFilterConfig, undefined, StartFilterDouble);
		}
	});
	
	QUnit.test('Serialize for navigation', function (assert) {
		var isNavigation = true;
		var keepInitialStartFilterValues = false;
		this.startFilterHandler.getStartFilters().done(function(){
			this.startFilterHandler.serialize(isNavigation, keepInitialStartFilterValues).done(function(){
				assert.ok(this.serializeSpy.calledWith(isNavigation, keepInitialStartFilterValues), 'Navigation indicator is propagated to start filter instance');
			}.bind(this));
		}.bind(this));
	});
	QUnit.test('Serialize for "last good APF state"', function (assert) {
		var isNavigation = false;
		var keepInitialStartFilterValues = true;
		this.startFilterHandler.getStartFilters().done(function(){
			this.startFilterHandler.serialize(isNavigation, keepInitialStartFilterValues).done(function(){
				assert.ok(this.serializeSpy.calledWith(isNavigation, keepInitialStartFilterValues), 'Indicator for "last good APF state" is propagated to start filter instance');
			}.bind(this));
		}.bind(this));
	});
	QUnit.test('Set application specific restrictions, serialize, change restrictions and deserialize', function(assert) {
		var testEnv = this;
		var filterOne = new UtilsFilter(this.msgH);
		var filterTwo = new UtilsFilter(this.msgH);
		filterOne.getTopAnd().addExpression({
			name : 'NonConfOne',
			operator : 'eq',
			value : 'InitialValOne'
		});
		filterTwo.getTopAnd().addExpression({
			name : 'NonConfTwo',
			operator : 'eq',
			value : 'InitialValTwo'
		});
		this.startFilterHandler.setRestrictionByProperty(filterOne);
		this.startFilterHandler.setRestrictionByProperty(filterTwo);
		this.startFilterHandler
			.serialize()
			.done(function(serializedStartFilterHandler) {
					changeApplicationSpecificRestrictionsForSecondProperty();
					testEnv.startFilterHandler.deserialize(serializedStartFilterHandler).done(function(){
						assert.equal(testEnv.startFilterHandler.getRestrictionByProperty('NonConfTwo').getInternalFilter().toUrlParam(), '(NonConfTwo%20eq%20%27InitialValTwo%27)', 'String for initial filter value');
						testEnv.startFilterHandler.getCumulativeFilter().done(function(cumulativeFilter) {
							assert.equal(cumulativeFilter.toUrlParam(),
									'(((NonConfTwo%20eq%20%27InitialValTwo%27)%20and%20(NonConfOne%20eq%20%27InitialValOne%27)%20and%20((PropertyOne%20eq%20%27ValA%27)%20or%20(PropertyOne%20eq%20%27ValB%27)))%20and%20((PropertyTwo%20eq%20%27ValX%27)%20or%20(PropertyTwo%20eq%20%27ValY%27)))',
							'Selected values successfully deserialized');
						});
					});
				});
		function changeApplicationSpecificRestrictionsForSecondProperty() {
			var filterChanged = new UtilsFilter(testEnv.msgH);
			filterChanged.getTopAnd().addExpression({
				name : 'NonConfTwo',
				operator : 'eq',
				value : 'ChangedValTwo'
			});
			testEnv.startFilterHandler.setRestrictionByProperty(filterChanged);
		}
	});
	QUnit.test('Serialize, apply some changes on start filters and deserialize', function(assert) {
		var testEnv = this;
		var counter = 0;
		var countBeforeDeserialization;
		var filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addExpression({
			name : 'NonConfOne',
			operator : 'eq',
			value : 'ValExt'
		});
		
		this.startFilterHandler.getStartFilters().done(function (startFilters){
			startFilters[0].getSelectedValues().done(onGetSelectedValues);
		});
		this.startFilterHandler.setRestrictionByProperty(filter);
		this.startFilterHandler.serialize().done(
				function(serializedStartFilterHandler) {
					applyChangesToStartFilters();

					countBeforeDeserialization = counter;
					testEnv.startFilterHandler.deserialize(serializedStartFilterHandler).done(function(){
						assert.equal(counter, countBeforeDeserialization + 1, 'Propagation triggered after deserialization');
						
						testEnv.startFilterHandler.getCumulativeFilter().done(function(cumulativeFilter) {
							assert.equal(cumulativeFilter.toUrlParam(),
									'(((NonConfOne%20eq%20%27ValExt%27)%20and%20((PropertyOne%20eq%20%27ValA%27)%20or%20(PropertyOne%20eq%20%27ValB%27)))%20and%20((PropertyTwo%20eq%20%27ValX%27)%20or%20(PropertyTwo%20eq%20%27ValY%27)))',
							'Selected values successfully deserialized');
						});
					});
				});
		function applyChangesToStartFilters() {
			var filter = new UtilsFilter(testEnv.msgH);
			filter.getTopAnd().addExpression({
				name : 'NonConfOne',
				operator : 'eq',
				value : 'OtherValExt'
			});
			testEnv.startFilterHandler.setRestrictionByProperty(filter);
			testEnv.startFilterHandler.getStartFilters().done(function(startFilters) {
				startFilters[0].setSelectedValues([ 'ValB' ]);
				startFilters[1].setSelectedValues([ 'ValX' ]);
			});
		}
		function onGetSelectedValues (values, promise){
			counter++;
			promise.done(onGetSelectedValues);
		}
	});
	QUnit.test('No start filter instances and no restrictions set by application', function(assert) {
		assert.expect(1);
		var expectedSerializedStartFilterHandler = {
			"restrictionsSetByApplication" : {},
			"startFilters" : []
		};
		var startFilterHandler = new StartFilterHandler({
			instances : {
				messageHandler : this.msgH
			}
		});
		startFilterHandler.serialize().done(function(serializedStartFilterHandler) {
			assert.deepEqual(serializedStartFilterHandler, expectedSerializedStartFilterHandler, 'Basic structure of serialized start filter handler object returned');
		});
	});
	QUnit.test('Deserialize after adding an additional minus one level filter', function(assert) {
		assert.expect(1);
		var testEnv = this;
		var filter = new UtilsFilter(this.msgH);
		filter.getTopAnd().addExpression({
			name : 'NonConfOne',
			operator : 'eq',
			value : 'ValExt'
		});
		this.startFilterHandler.serialize().done(
				function(serializedStartFilterHandler) {
					testEnv.startFilterHandler.setRestrictionByProperty(filter);
					testEnv.startFilterHandler.deserialize(serializedStartFilterHandler).done(function(){
						testEnv.startFilterHandler.getCumulativeFilter().done(function(cumulativeFilter) {
							assert.equal(cumulativeFilter.toUrlParam(),
									'(((NonConfOne%20eq%20%27ValExt%27)%20and%20((PropertyOne%20eq%20%27ValA%27)%20or%20(PropertyOne%20eq%20%27ValB%27)))%20and%20((PropertyTwo%20eq%20%27ValX%27)%20or%20(PropertyTwo%20eq%20%27ValY%27)))',
							'StartFilterHandler successfully deserialized and additional minus one level filter is contained in cumulative filter');
						});
					});
				});
	});
	QUnit.test('No start filter instances and one restriction set by application', function(assert) {
		assert.expect(2);
		var initialFilter = new UtilsFilter(this.msgH);
		initialFilter.getTopAnd().addExpression({
			name : 'NonConfOne',
			operator : 'eq',
			value : 'ValExtInitial'
		});
		var updatedFilter = new UtilsFilter(this.msgH);
		updatedFilter.getTopAnd().addExpression({
			name : 'NonConfOne',
			operator : 'eq',
			value : 'ValExtUpdated'
		});
		var startFilterHandler = new StartFilterHandler({
			instances : {
				messageHandler : this.msgH, 
				onBeforeApfStartupPromise: jQuery.Deferred().resolve()
			}, 
			functions : {
				getReducedCombinedContext : function() {
					return jQuery.Deferred().resolve(new Filter(this.msgH));
				}.bind(this), 
				getFacetFilterConfigurations : function() {
					return [];
				}
			}
		});
		startFilterHandler.setRestrictionByProperty(initialFilter);
		startFilterHandler.serialize().done(function(serializedStartFilterHandler) {
			startFilterHandler.setRestrictionByProperty(updatedFilter);
			startFilterHandler.getCumulativeFilter().done(function(cumulativeFilter){
				assert.deepEqual(cumulativeFilter.toUrlParam(), "(NonConfOne%20eq%20%27ValExtUpdated%27)", "Initial restriction changed successfully");
				startFilterHandler.deserialize(serializedStartFilterHandler).done(function(){
					startFilterHandler.getCumulativeFilter().done(function(cumulativeFilter){
						assert.deepEqual(cumulativeFilter.toUrlParam(), "(NonConfOne%20eq%20%27ValExtInitial%27)", "Cumulative filter contains initially set restriction");
					});
				});
			});
		});
	});
	QUnit.module('Reset', {
		beforeEach : function() {
			var facetFilterConfig = [ {
				'type' : 'facetFilter',
				'id' : 'startFilterOne',
				'property' : 'PropertyOne',
				'multiSelection' : true,
				'preselectionDefaults' : [ 'ValA', 'ValB' ]
			} ];
			commonSetup(this, facetFilterConfig);
		},
		addAndUpdateApplicationSpecificRestrictions : function() {
			var filterPropTwoValX = new UtilsFilter(this.msgH);
			filterPropTwoValX.getTopAnd().addExpression({
				id : 'PropertyTwo',
				name : 'PropertyTwo',
				operator : 'eq',
				value : 'ValX'
			});
			this.startFilterHandler.setRestrictionByProperty(filterPropTwoValX);
			var filterPropTwoValY = new UtilsFilter(this.msgH);
			filterPropTwoValY.getTopAnd().addExpression({
				id : 'PropertyTwo',
				name : 'PropertyTwo',
				operator : 'eq',
				value : 'ValY'
			});
			this.startFilterHandler.setRestrictionByProperty(filterPropTwoValY);
		}
	});
	QUnit.test('Set application specific restrictions and reset all', function(assert) {
		assert.expect(2);
		this.addAndUpdateApplicationSpecificRestrictions();
		this.startFilterHandler.resetAll();
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '((PropertyTwo%20eq%20%27ValX%27)%20and%20((PropertyOne%20eq%20%27ValA%27)%20or%20(PropertyOne%20eq%20%27ValB%27)))', 'Reset reflected in cumulative filter');
		});
		assert.equal(this.startFilterHandler.getRestrictionByProperty('PropertyTwo').getInternalFilter().toUrlParam(), '(PropertyTwo%20eq%20%27ValX%27)', 'Reset to the value that has been used as property restriction the very first time');
	});
	QUnit.test('Reset twice, i.e.set application specific restrictions and reset, set different restriction and reset', function(assert) {
		var filterPropTwoValZ;
		var filterPropThreeValR;
		this.addAndUpdateApplicationSpecificRestrictions();
		this.startFilterHandler.resetAll();
		filterPropTwoValZ = new UtilsFilter(this.msgH);
		filterPropTwoValZ.getTopAnd().addExpression({
			id : 'PropertyTwo',
			name : 'PropertyTwo',
			operator : 'eq',
			value : 'ValZ'
		});
		this.startFilterHandler.setRestrictionByProperty(filterPropTwoValZ);
		filterPropThreeValR = new UtilsFilter(this.msgH);
		filterPropThreeValR.getTopAnd().addExpression({
			id : 'PropertyThree',
			name : 'PropertyThree',
			operator : 'eq',
			value : 'ValR'
		});
		this.startFilterHandler.setRestrictionByProperty(filterPropThreeValR);
		this.startFilterHandler.resetAll();
		assert.equal(this.startFilterHandler.getRestrictionByProperty('PropertyTwo').getInternalFilter().toUrlParam(), '(PropertyTwo%20eq%20%27ValX%27)', 'Reset to the value that has been used as property restriction the very first time');
		assert.equal(this.startFilterHandler.getRestrictionByProperty('PropertyThree').getInternalFilter().toUrlParam(), '(PropertyThree%20eq%20%27ValR%27)', 'Reset to the value that has been used as property restriction the very first time');
	});
	QUnit.test('Set application specific restrictions, change filter via provided reference and reset all', function(assert) {
		var filterPropTwo;
		filterPropTwo = new UtilsFilter(this.msgH);
		filterPropTwo.getTopAnd().addExpression({
			id : 'PropertyTwo',
			name : 'PropertyTwo',
			operator : 'eq',
			value : 'ValX'
		});
		this.startFilterHandler.setRestrictionByProperty(filterPropTwo);
		filterPropTwo.updateExpression('PropertyTwo', {
			id : 'PropertyTwo',
			name : 'PropertyTwo',
			operator : 'eq',
			value : 'ValY'
		});
		this.startFilterHandler.resetAll();
		assert.equal(this.startFilterHandler.getRestrictionByProperty('PropertyTwo').getInternalFilter().toUrlParam(), '(PropertyTwo%20eq%20%27ValX%27)', 'Changes on initially provided filter instance does not affect initially stored values');
	});
	QUnit.test('Set application specific restrictions and reset only visible start filters', function(assert) {
		assert.expect(2);
		this.addAndUpdateApplicationSpecificRestrictions();
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			startFilters[0].setSelectedValues([ 'ValA' ]);
		});
		this.startFilterHandler.resetVisibleStartFilters();
		this.startFilterHandler.getCumulativeFilter().done(function(filter) {
			assert.equal(filter.toUrlParam(), '((PropertyTwo%20eq%20%27ValY%27)%20and%20((PropertyOne%20eq%20%27ValA%27)%20or%20(PropertyOne%20eq%20%27ValB%27)))', 'Reset reflected in cumulative filter');
		});
		assert.equal(this.startFilterHandler.getRestrictionByProperty('PropertyTwo').getInternalFilter().toUrlParam(), '(PropertyTwo%20eq%20%27ValY%27)', 'Reset to the value that has been used as property restriction the very first time');
	});
	QUnit.module('Dependency handling during initialization', {
		beforeEach : function() {
			var testEnv = this;
			this.setRestrictionSpyValues = [];
			this.AsyncStartFilterDouble = function() {
				StartFilter.apply(this, arguments);
				this.setRestriction = function(filter){
					testEnv.setRestrictionSpyValues.push(filter.toUrlParam());
				};
				this.getSelectedValues = function(){
					var deferred = jQuery.Deferred();
					if(this.isResolvedWithTimeout) {
						setTimeout(function(){ deferred.resolve(this.resolveValue, emptyPromise); }.bind(this), 1);
					} else {
						deferred.resolve(this.resolveValue, emptyPromise);
					}
					return deferred.promise();
				};
				switch(testEnv.AsyncStartFilterDouble.instanceCount) {
				case 0:
					this.resolveValue = ['ValA'];
					this.isResolvedWithTimeout = true;
					testEnv.AsyncStartFilterDouble.instanceCount++;
					break;
				case 1:
					this.resolveValue = ['ValB'];
					this.isResolvedWithTimeout = true;
					testEnv.AsyncStartFilterDouble.instanceCount++;
					break;
				case 2:
					this.resolveValue = ['ValC'];
					this.isResolvedWithTimeout = true;
					testEnv.AsyncStartFilterDouble.instanceCount++;
					break;
				case 3:
					this.resolveValue = ['ValD'];
					this.isResolvedWithTimeout = true;
					testEnv.AsyncStartFilterDouble.instanceCount++;
					break;
				case 4:
					this.resolveValue = ['ValExt']; //Start filter for non-configured external context property instantiated at last during StartFilterDoubleHandler initialization
					this.isResolvedWithTimeout = false;
					testEnv.AsyncStartFilterDouble.instanceCount++;
					break;
				default:
					throw new Error('Number of AsyncStartFilterDouble constructor function calls was unexpectedly ' + ++testEnv.AsyncStartFilterDouble.instanceCount + ' times - expected is 5 times');
				}
			};
			this.AsyncStartFilterDouble.instanceCount = 0;
		}
	});
	QUnit.test('Get selected value promises resolved synchronously with preselection defaults', function (assert) {
		assert.expect(2);
		var externalContextPromise = jQuery.Deferred();
		var spiesSetRestriction = [];
		function StartFilterSpy() {
			StartFilter.apply(this, arguments);
			this.setRestriction = function(filter){
				spiesSetRestriction.push(filter.toUrlParam());
			};
		}
		commonSetup(this, useDefaultFacetFilterConfig, externalContextPromise, StartFilterSpy);
		externalContextPromise.resolve(new Filter(this.msgH, 'PropertyExt', 'EQ', 'ValExt'));

		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.equal(spiesSetRestriction[0], '(PropertyExt%20eq%20%27ValExt%27)', 'First start filter retrieves restriction from minus one level filter');
			assert.equal(spiesSetRestriction[1], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27))', 'Second start filter retrieves restriction from first'); 
		});
	});
	QUnit.test('Cumulative filter built on asynchronous subsequent resolvement of selections', function (assert) {
		assert.expect(1);
		var done = assert.async();
		var externalContextPromise = jQuery.Deferred();
		commonSetup(this, useDefaultFacetFilterConfig, externalContextPromise, this.AsyncStartFilterDouble);
		externalContextPromise.resolve(new Filter(this.msgH, 'PropertyExt', 'EQ', 'This value does not affect anything because of AsyncStartFilterDouble'));

		this.startFilterHandler.getCumulativeFilter().done(function(cumulativeFilter) {
			assert.equal(cumulativeFilter.toUrlParam(), '(((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27)%20and%20(PropertyTwo%20eq%20%27ValB%27)%20and%20(PropertyThree%20eq%20%27ValC%27))%20and%20(PropertyFour%20eq%20%27ValD%27))','Expected cumulative filter');
			done();
		});
	});
	QUnit.test('Asynchronously resolved selections propagated as restrictions to each subequent start filter', function (assert) {
		assert.expect(3);
		var done = assert.async();
		var externalContextPromise = jQuery.Deferred();
		commonSetup(this, useDefaultFacetFilterConfig, externalContextPromise, this.AsyncStartFilterDouble);
		externalContextPromise.resolve(new Filter(this.msgH, 'PropertyExt', 'EQ', 'This value does not affect anything because of AsynStartFilterDouble'));

		this.startFilterHandler.getStartFilters().done(function() {
			assert.equal(this.setRestrictionSpyValues[0], '(PropertyExt%20eq%20%27ValExt%27)', 'First start filter retrieves restriction from minus one level filter'); 
			assert.equal(this.setRestrictionSpyValues[1], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27))', 'Second start filter retrieves restriction from all predecesors');
			assert.equal(this.setRestrictionSpyValues[2], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27)%20and%20(PropertyTwo%20eq%20%27ValB%27))', 'Third start filter retrieves restriction from all predecesors');
			done();
		}.bind(this));
	});
	QUnit.module('Dependency handling after selection ', {
		beforeEach : function() {
			var testEnv = this;
			this.setRestrictionSpyValues = [];
			this.AsyncStartFilterDouble = function() {
				var instanceCount = testEnv.AsyncStartFilterDouble.instanceCount;
				StartFilter.apply(this, arguments);
				var selectedDeferred = jQuery.Deferred();
				this.setRestriction = function(filter){
					var promiseToBeResolved = selectedDeferred;
					selectedDeferred = jQuery.Deferred();
					var temp = [filter.toUrlParam()];
					if(testEnv.setRestrictionSpyValues[instanceCount]){
						jQuery.merge(temp, testEnv.setRestrictionSpyValues[instanceCount]);
					}
					testEnv.setRestrictionSpyValues[instanceCount] = temp;
					setTimeout(function(){ promiseToBeResolved.resolve(this.resolveValue, selectedDeferred); }.bind(this), 1);
				};
				this.setSelectedValues = function(values){
					var promiseToBeResolved = selectedDeferred;
					selectedDeferred = jQuery.Deferred();
					setTimeout(function(){ promiseToBeResolved.resolve(values, selectedDeferred); }, 1);
				};
				this.getSelectedValues = function(){
					return (jQuery.Deferred().resolve(this.resolveValue, selectedDeferred.promise()));
				};
				switch(testEnv.AsyncStartFilterDouble.instanceCount) {
				case 0:
					this.resolveValue = ['ValA'];
					this.isResolvedWithTimeout = true;
					testEnv.AsyncStartFilterDouble.instanceCount++;
					break;
				case 1:
					this.resolveValue = ['ValB'];
					this.isResolvedWithTimeout = true;
					testEnv.AsyncStartFilterDouble.instanceCount++;
					break;
				case 2:
					this.resolveValue = ['ValC'];
					this.isResolvedWithTimeout = true;
					testEnv.AsyncStartFilterDouble.instanceCount++;
					break;
				case 3:
					this.resolveValue = ['ValD'];
					this.isResolvedWithTimeout = true;
					testEnv.AsyncStartFilterDouble.instanceCount++;
					break;
				case 4:
					this.resolveValue = ['ValExt']; //Start filter for non-configured external context property instantiated at last during StartFilterDoubleHandler initialization
					this.isResolvedWithTimeout = false;
					testEnv.AsyncStartFilterDouble.instanceCount++;
					break;
				default:
					throw new Error('Number of AsyncStartFilterDouble constructor function calls was unexpectedly ' + ++testEnv.AsyncStartFilterDouble.instanceCount + ' times - expected is 4 times');
				}
			};
			this.AsyncStartFilterDouble.instanceCount = 0;
		}
	});
	QUnit.test('Restrictions during startup propagation do not change', function(assert) {
		var done = assert.async();
		var externalContextPromise = jQuery.Deferred();
		commonSetup(this, useDefaultFacetFilterConfig, externalContextPromise, this.AsyncStartFilterDouble);
		externalContextPromise.resolve(new Filter(this.msgH, 'PropertyExt', 'EQ', 'This value does not affect anything because of AsynStartFilterDouble'));
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.strictEqual(this.setRestrictionSpyValues[0][0], "(PropertyExt%20eq%20%27ValExt%27)", 'Restriction from first start filter instance is correctly called once');
			assert.strictEqual(this.setRestrictionSpyValues[1][0], this.setRestrictionSpyValues[1][1], 'Restriction from second start filter instance is unchanged');
			assert.strictEqual(this.setRestrictionSpyValues[2][0], this.setRestrictionSpyValues[2][1], 'Restriction from third start filter instance is unchanged');
			assert.strictEqual(this.setRestrictionSpyValues[3][0], this.setRestrictionSpyValues[3][1], 'Restriction from fourth start filter instance is unchanged');
			done();
		}.bind(this));
	});	
	QUnit.test('Selection change on 2nd start filter refreshes restrictions on 3rd and 4th', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var externalContextPromise = jQuery.Deferred();
		commonSetup(this, useDefaultFacetFilterConfig, externalContextPromise, this.AsyncStartFilterDouble);
		externalContextPromise.resolve(new Filter(this.msgH, 'PropertyExt', 'EQ', 'This value does not affect anything because of AsynStartFilterDouble'));
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			this.setRestrictionSpyValues = [];
			startFilters[3].getSelectedValues().done(function(values, promise) {
				startFilters[1].setSelectedValues([ 'ValSet1', 'ValSet2' ]);
				promise.done(function(values, promise) {
					assert.equal(Object.keys(this.setRestrictionSpyValues).length, 2, 'Set restrictions only called twice');
					assert.strictEqual(this.setRestrictionSpyValues[2][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27)%20and%20((PropertyTwo%20eq%20%27ValSet1%27)%20or%20(PropertyTwo%20eq%20%27ValSet2%27)))', 'Third start filter receives cumulative filter containing value set on predecessor');
					assert.strictEqual(this.setRestrictionSpyValues[3][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27)%20and%20((PropertyTwo%20eq%20%27ValSet1%27)%20or%20(PropertyTwo%20eq%20%27ValSet2%27))%20and%20(PropertyThree%20eq%20%27ValC%27))', 'Fourth start filter receives cumulative filter containing values from previous two');
					done();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});	
	QUnit.test('Selection change on 1st start filter refreshes restrictions of all following StartFilters (including invisible but configured ones)', function(assert) {
		assert.expect(4);
		var done = assert.async();
		var externalContextPromise = jQuery.Deferred();
		this.useInvisibleFilter = true;
		commonSetup(this, useDefaultFacetFilterConfig, externalContextPromise, this.AsyncStartFilterDouble);
		externalContextPromise.resolve(new Filter(this.msgH, 'PropertyExt', 'EQ', 'This value does not affect anything because of AsynStartFilterDouble'));
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			this.setRestrictionSpyValues = [];
			//getStartFilters only returns visible startFilters so startFilters[2] is actually the 4th(and last) configured startFilter as the third one is invisible
			startFilters[2].getSelectedValues().done(function(values, promise) {
				startFilters[0].setSelectedValues([ 'ValSet1']);
				promise.done(function(values, promise) {
					assert.equal(Object.keys(this.setRestrictionSpyValues).length, 3, 'Set restrictions called three times');
					assert.strictEqual(this.setRestrictionSpyValues[1][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValSet1%27))', 'Second start filter receives cumulative filter containing value set on predecessor');
					assert.strictEqual(this.setRestrictionSpyValues[2][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValSet1%27)%20and%20(PropertyTwo%20eq%20%27ValB%27))', 'Third [invisible] start filter receives cumulative filter containing value set on predecessor');
					assert.strictEqual(this.setRestrictionSpyValues[3][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValSet1%27)%20and%20(PropertyTwo%20eq%20%27ValB%27)%20and%20(PropertyThree%20eq%20%27ValC%27))', 'Fourth start filter receives cumulative filter containing values from previous two');
					done();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});	
	QUnit.test('resetVisibleStartFilters triggers restriction on dependend startfilters', function(assert) {
		assert.expect(5);
		var done = assert.async();
		var externalContextPromise = jQuery.Deferred();
		commonSetup(this, useDefaultFacetFilterConfig, externalContextPromise, this.AsyncStartFilterDouble);
		externalContextPromise.resolve(new Filter(this.msgH, 'PropertyExt', 'EQ', 'This value does not affect anything because of AsynStartFilterDouble'));
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			startFilters[3].getSelectedValues().done(function(values, promise) {
				this.setRestrictionSpyValues = [];
				this.startFilterHandler.resetVisibleStartFilters();
				promise.done(function(values, promise) {
					assert.equal(Object.keys(this.setRestrictionSpyValues).length, 4, 'Set restrictions called 4 times');
					assert.strictEqual(this.setRestrictionSpyValues[0][0], '(PropertyExt%20eq%20%27ValExt%27)', 'First start filter receives cumulative filter containing value set on predecessor');
					assert.strictEqual(this.setRestrictionSpyValues[1][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27))', 'Second start filter receives cumulative filter containing value set on predecessor');
					assert.strictEqual(this.setRestrictionSpyValues[2][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27)%20and%20(PropertyTwo%20eq%20%27ValB%27))', 'Third start filter receives cumulative filter containing value set on predecessor');
					assert.strictEqual(this.setRestrictionSpyValues[3][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27)%20and%20(PropertyTwo%20eq%20%27ValB%27)%20and%20(PropertyThree%20eq%20%27ValC%27))', 'Fourth start filter receives cumulative filter containing value set on predecessor');
					done();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});	
	QUnit.test('resetAll triggers restriction on dependend startfilters', function(assert) {
		assert.expect(5);
		var done = assert.async();
		var externalContextPromise = jQuery.Deferred();
		commonSetup(this, useDefaultFacetFilterConfig, externalContextPromise, this.AsyncStartFilterDouble);
		externalContextPromise.resolve(new Filter(this.msgH, 'PropertyExt', 'EQ', 'This value does not affect anything because of AsynStartFilterDouble'));
		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			startFilters[3].getSelectedValues().done(function(values, promise) {
				this.setRestrictionSpyValues = [];
				this.startFilterHandler.resetAll();
				promise.done(function(values, promise) {
					assert.equal(Object.keys(this.setRestrictionSpyValues).length, 4, 'Set restrictions called 4 times');
					assert.strictEqual(this.setRestrictionSpyValues[0][0], '(PropertyExt%20eq%20%27ValExt%27)', 'First start filter receives cumulative filter containing value set on predecessor');
					assert.strictEqual(this.setRestrictionSpyValues[1][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27))', 'Second start filter receives cumulative filter containing value set on predecessor');
					assert.strictEqual(this.setRestrictionSpyValues[2][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27)%20and%20(PropertyTwo%20eq%20%27ValB%27))', 'Third start filter receives cumulative filter containing value set on predecessor');
					assert.strictEqual(this.setRestrictionSpyValues[3][0], '((PropertyExt%20eq%20%27ValExt%27)%20and%20(PropertyOne%20eq%20%27ValA%27)%20and%20(PropertyTwo%20eq%20%27ValB%27)%20and%20(PropertyThree%20eq%20%27ValC%27))', 'Fourth start filter receives cumulative filter containing value set on predecessor');
					done();
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.module('Three StartFilter with null selection', {
		beforeEach : function() {
			this.facetFilterConfig = [ {
				'type' : 'facetFilter',
				'id' : 'startFilterOne',
				'property' : 'PropertyOne',
				'alias' : 'PropertyOneToUseOneUI',
				'valueHelpRequest' : 'VHRPropertyOne',
				'preselectionDefaults' : null,
				'multiSelection' : 'false',
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyOne'
				}
			}, {
				'type' : 'facetFilter',
				'id' : 'startFilterTwo',
				'property' : 'PropertyTwo',
				'valueHelpRequest' : 'VHRPropertyTwo',
				'preselectionDefaults' : null,
				'multiSelection' : 'true',
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyTwo'
				}
			},  {
				'type' : 'facetFilter',
				'id' : 'startFilterThree',
				'property' : 'PropertyThree',
				'valueHelpRequest' : 'VHRPropertyThree',
				'preselectionDefaults' : null,
				'multiSelection' : 'true',
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyTwo'
				}
			} ];
			commonSetup(this, this.facetFilterConfig);
		}
	});
	QUnit.test('No value help requests at startup', function(assert) {
		assert.expect(2);
		var promiseStartFilter = this.startFilterHandler.getStartFilters();
		promiseStartFilter.done(function(startFilters) {
			assert.equal(startFilters.length, 3, 'Three start filter instances returned');
			assert.equal(this.requestCounter, 0, 'No value help requests sent');
		}.bind(this));
	});
});
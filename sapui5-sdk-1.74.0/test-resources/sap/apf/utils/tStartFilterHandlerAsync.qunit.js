sap.ui.define("sap/apf/utils/tStartFilterHandlerAsync", [
	'sap/apf/utils/startFilterHandler',
	'sap/apf/utils/filter',
	'sap/apf/core/utils/filter',
	'sap/apf/testhelper/doubles/messageHandler'
], function(StartFilterHandler, UtilsFilter, CoreFilter, DoubleMessageHandler){
	'use strict';
	function commonSetup(testEnv, facetFilterConfig) {
		testEnv.msgH = new DoubleMessageHandler().doubleCheckAndMessaging();
		var onBeforeApfStartupPromise = jQuery.Deferred();
		var getReducedCombinedContextPromsie = jQuery.Deferred();
		var inject = {
			functions : {
				getFacetFilterConfigurations : function() {
					return facetFilterConfig;
				},
				getReducedCombinedContext : function() {
					return getReducedCombinedContextPromsie;
				},
				createRequest : function() {
					return {
						sendGetInBatch : function(dummy, callback) {
							setTimeout(function(){callback( { data : [] });}, 1);
						}
					};
				}
			},
			instances : {
				messageHandler : testEnv.msgH,
				onBeforeApfStartupPromise: onBeforeApfStartupPromise
			}
		};
		
		setTimeout(function(){
			getReducedCombinedContextPromsie.resolve(new CoreFilter(testEnv.msgH));
		},10);
		setTimeout(function(){
			if(typeof testEnv.onBeforeApfStartup === "function"){
				testEnv.onBeforeApfStartup();
			}
			onBeforeApfStartupPromise.resolve();
		},10);
		testEnv.startFilterHandler = new StartFilterHandler(inject);
	}
	QUnit.module('Startup with two configured filters', {
		beforeEach : function() {
			this.facetFilterConfig = [ {
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
			}, {
				'type' : 'facetFilter',
				'id' : 'startFilterTwo',
				'property' : 'PropertyTwo',
				'valueHelpRequest' : 'VHRPropertyTwo',
				'multiSelection' : 'true',
				'label' : {
					'type' : 'label',
					'kind' : 'text',
					'key' : 'PropertyTwo'
				}
			} ];
			commonSetup(this, this.facetFilterConfig);
		}, 
		addAppSpecificRestriction : function(name){
			var filter = new UtilsFilter(this.msgH);
			filter.getTopAnd().addExpression({
				name : 'Unknown' + name,
				operator : 'eq',
				value : 'Val' + name
			});

			this.startFilterHandler.setRestrictionByProperty(filter);
		}
	});
	QUnit.test('Three app specific restrictions', function(assert) {
		var done = assert.async();
		assert.expect(2);

		this.addAppSpecificRestriction('1');
		this.addAppSpecificRestriction('2');
		this.addAppSpecificRestriction('3');

		this.startFilterHandler.getStartFilters().done(function(startFilters) {
			assert.equal(startFilters.length, 2, 'Two start filter instances returned');
			setTimeout(function(){
				startFilters[0].getValues().done(function(values){
					assert.ok(true, 'List values from first start filter returned');
					done();
				});
			}, 1);
		});
	});
	QUnit.test('Set and get app specific restriction before initialization has finished', function(assert) {
		var filter;
		this.addAppSpecificRestriction('1');
		filter = this.startFilterHandler.getRestrictionByProperty('Unknown1').getInternalFilter();

		assert.equal(filter.toUrlParam(), '(Unknown1%20eq%20%27Val1%27)', 'Same filter returned');
	});
	QUnit.test('Set, initialize and get app specific restriction', function(assert) {
		var done = assert.async();
		var filter;
		this.addAppSpecificRestriction('1');
		filter = this.startFilterHandler.getRestrictionByProperty('Unknown1');
		this.startFilterHandler.getStartFilters().done(function(){
			var filterAfterInitialization = this.startFilterHandler.getRestrictionByProperty('Unknown1');
			assert.equal(filter, filterAfterInitialization, 'Same filter instance before/after initialization returned');
			assert.equal(filterAfterInitialization.getInternalFilter().toUrlParam(), '(Unknown1%20eq%20%27Val1%27)', 'Correct filter returned');
			this.addAppSpecificRestriction('2');
			done();
		}.bind(this));
	});
	QUnit.test('Set two restrictions before initialization is finished and get cumulative Filter', function(assert) {
		var done = assert.async();
		this.onBeforeApfStartup = function () {
			this.addAppSpecificRestriction('1');
			this.addAppSpecificRestriction('2');
		}.bind(this);
		this.startFilterHandler.getCumulativeFilter().done(function(filter){
			assert.equal(filter.toUrlParam(), '(((Unknown2%20eq%20%27Val2%27)%20and%20(Unknown1%20eq%20%27Val1%27)))', 'Correct filter with both restrictions returned');
			done();
		});
	});
});
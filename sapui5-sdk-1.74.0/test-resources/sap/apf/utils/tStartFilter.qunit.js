sap.ui.define("sap/apf/utils/tStartFilter", [
	"sap/apf/utils/startFilter",
	"sap/apf/core/utils/filter",
	"sap/apf/testhelper/doubles/messageHandler"
], function(StartFilter, Filter, DoubleMessageHandler){
	'use strict';
	var filterConfiguration = [ {
		'type' : 'facetFilter',
		'id' : 'startFilterOne',
		'property' : 'PropertyOne',
		'alias' : 'AliasForPropertyOne',
		'valueHelpRequest' : 'VHRPropertyOne',
		'preselectionDefaults' : [],
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
		'multiSelection' : true,
		'preselectionDefaults' : [ 'value1', 'value2', 'value3' ],
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertyTwo'
		}
	}, {
		'type' : 'facetFilter',
		'id' : 'startFilterThree',
		'property' : 'PropertyThree',
		'multiSelection' : 'false',
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertyThree'
		}
	}, {
		'type' : 'facetFilter',
		'id' : 'startFilterFour',
		'property' : 'PropertyFour',
		'filterResolutionRequest' : 'FRRPropertyFour',
		'multiSelection' : 'false',
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertyFour'
		}
	}, {
		'type' : 'facetFilter',
		'id' : 'startFilterFive',
		'property' : 'PropertyFive',
		'multiSelection' : false,
		'preselectionDefaults' : [ 'value1', 'value2', 'value3' ],
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertyFive'
		}
	}, {
		'type' : 'facetFilter',
		'id' : 'startFilterSix',
		'property' : 'PropertySix',
		'multiSelection' : true,
		'preselectionDefaults' : [ 'value1', 'value2', 'value3' ],
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertySix'
		}
	}, {
		'type' : 'facetFilter',
		'id' : 'startFilterSeven',
		'property' : 'PropertySeven',
		'multiSelection' : true,
		'preselectionDefaults' : [],
		'preselectionFunction' : function() {
			return [ 'funcVal1', 'funcVal2' ];
		},
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertySeven'
		}
	}, {
		'type' : 'facetFilter',
		'id' : 'startFilterEight',
		'property' : 'PropertyEight',
		'multiSelection' : true,
		'valueHelpRequest' : 'VHRPropertyEight',
		'preselectionDefaults' : [],
		'preselectionFunction' : function() {
			return [ 'funcVal1', 'valueA' ];
		},
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertyEight'
		}
	}, {
		'type' : 'facetFilter',
		'id' : 'startFilterNine',
		'property' : 'PropertyNine',
		'filterResolutionRequest' : 'FRRPropertyNine',
		'multiSelection' : true,
		'preselectionDefaults' : [ 'preValue1', 'preValue2' ],
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertyNine'
		}
	}, {
		'type' : 'facetFilter',
		'id' : 'startFilterTen',
		'property' : 'PropertyTen',
		'multiSelection' : true,
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertyTen'
		},
		'valueList' : [ 'listValue1', 'listValue2', 'listValue3']
	},{
		'type' : 'facetFilter',
		'id' : 'startFilterEleven',
		'property' : 'PropertyEleven',
		'preselectionDefaults' : null,
		'multiSelection' : 'true',
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertyEleven'
		}
	},{
		'type' : 'facetFilter',
		'id' : 'startFilterTwelve',
		'property' : 'PropertyTwelve',
		'preselectionDefaults' : null,
		'multiSelection' : 'false',
		'label' : {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertyTwelve'
		},
		metadataProperty : {
			type : "MetadataProperty"
		}
	} ];
	var filterConfigWithValueHelpRequest = filterConfiguration[0];
	var filterConfigWithValueHelpAndResolutionRequest = filterConfiguration[1];
	var filterConfigWithoutRequest = filterConfiguration[2];
	var filterConfigWithResolutionRequestOnly = filterConfiguration[3];
	var filterConfigSinglePreselectionOnly = filterConfiguration[4];
	var filterConfigMultiPreselectionOnly = filterConfiguration[5];
	var filterConfigPreselectionFunctionWithoutIntersection = filterConfiguration[6];
	var filterConfigPreselectionFunctionWithIntersection = filterConfiguration[7];
	var filterConfigPreselectionDefaultsFilterResolution = filterConfiguration[8];
	var filterConfigWithValueHelpDefaults = filterConfiguration[9];
	var filterConfigWithNoneOption = filterConfiguration[10];
	var filterConfigWithNoneOptionSingleSelection = filterConfiguration[11];
	function commonSetup(testEnv, deferCallback) {
		testEnv.msgH = new DoubleMessageHandler().doubleCheckAndMessaging();
		testEnv.callbacksSendGetInBatch = [];
		testEnv.requestType = null;
		function getPropertyMetadata(property) {
			return testEnv.metadata;
		}
		function sendGetInBatch(filter, callback, options) {
			var requestResponseData;
			if (testEnv.requestType === 'filterResolution' || filter && filter.stubControl === 'filterResolution') {
				requestResponseData = testEnv.requestResponseFilterResolution;
				testEnv.metadata = {
					label : 'metadataFilterResolutionRequest',
					filterable : false
				};
			} else {
				requestResponseData = testEnv.requestResponseValueHelp;
				testEnv.metadata = {
					label : 'metadataValueHelpRequest',
					filterable : false
				};
			}
			testEnv.callbackArgument = {
				data : requestResponseData,
				metadata : {
					getPropertyMetadata : testEnv.getPropertyMetadataSpy
				}
			};
			if (!deferCallback) {
				callback(testEnv.callbackArgument);
			} else {
				testEnv.callbacksSendGetInBatch.push(callback);
			}
		}
		function createRequest(requestID) {
			return {
				sendGetInBatch : testEnv.sendGetInBatchSpy
			};
		}
		testEnv.requestResponseValueHelp = [];
		testEnv.requestResponseFilterResolution = [];
		testEnv.createRequestSpy = sinon.spy(createRequest);
		testEnv.sendGetInBatchSpy = sinon.spy(sendGetInBatch);
		testEnv.getPropertyMetadataSpy = sinon.spy(getPropertyMetadata);
		testEnv.injectCreateRequestSpy = {
			instances : {
				messageHandler : testEnv.msgH
			},
			functions : {
				createRequest : testEnv.createRequestSpy
			}
		};
		testEnv.inject = {
				instances : {
					messageHandler : testEnv.msgH
				}
		};
	}
	function callSendGetInBatchCallbacks(testEnv, async) {
		testEnv.callbacksSendGetInBatch.forEach(function(callback){
			if(async){
				setTimeout(function(){callback(testEnv.callbackArgument);}, 1);
			}else{
				callback(testEnv.callbackArgument);
			}
		});
	}
	QUnit.module('Read Configuration', {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test('Get property name', function(assert) {
		var startFilter = new StartFilter(this.inject, filterConfigWithValueHelpAndResolutionRequest);
		assert.equal(startFilter.getPropertyName(), 'PropertyTwo', 'Correct property name returned');
	});
	QUnit.test('Get label', function(assert) {
		var startFilter = new StartFilter(this.inject, filterConfigWithValueHelpAndResolutionRequest);
		assert.deepEqual(startFilter.getLabel(), {
			'type' : 'label',
			'kind' : 'text',
			'key' : 'PropertyTwo'
		}, 'Correct label object returned');
	});
	QUnit.test('Get alias if defined', function(assert) {
		var startFilterOne = new StartFilter(this.inject, filterConfigWithValueHelpRequest);
		var startFilterTwo = new StartFilter(this.inject, filterConfigWithValueHelpAndResolutionRequest);
		assert.equal(startFilterOne.getAliasNameIfExistsElsePropertyName(), 'AliasForPropertyOne', 'Alias returned instead of property name');
		assert.equal(startFilterTwo.getAliasNameIfExistsElsePropertyName(), 'PropertyTwo', 'Property name returned since no alias defined');
	});
	QUnit.test('Get selection mode', function(assert) {
		var startFilterSingleSelection = new StartFilter(this.inject, filterConfigWithValueHelpRequest);
		var startFilterMultiSelection = new StartFilter(this.inject, filterConfigWithValueHelpAndResolutionRequest);
		assert.equal(startFilterSingleSelection.isMultiSelection(), false, 'Single selection returned');
		assert.equal(startFilterMultiSelection.isMultiSelection(), true, 'Multi selection returned');
	});
	QUnit.module('Invisibility', {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test('Instantiate filter marked as invisible', function(assert) {
		var visibleStartFilter = new StartFilter(this.inject, {});
		var invisibleStartFilter = new StartFilter(this.inject, {
			invisible : true
		});
		assert.equal(visibleStartFilter.isVisible(), true, 'Start filter is visible');
		assert.equal(invisibleStartFilter.isVisible(), false, 'Start filter is not visible');
	});
	QUnit.test('Instantiate filter that implicitely determines that it is invisible', function(assert) {
		var filter = {
			type : 'internalFilter'
		};
		var startFilter = new StartFilter(this.inject, {}, filter);
		assert.equal(startFilter.isVisible(), false, 'Start filter is not visible because it is instantiated with context as filter and no filter resolution request');
	});
	QUnit.module('Property metadata', {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test('IF propertyMetadata is set in the configuration', function(assert){
		var done = assert.async();
		var startFilter = new StartFilter(this.inject, filterConfiguration[11]);
		startFilter.getMetadata().done(function(metadata){
			assert.strictEqual(metadata.type, "MetadataProperty", "THEN metadata has been taken from configuration");
			done();
		});
	});
	QUnit.test('IF no propertyMetadata is set in the configuration', function(assert){
		var done = assert.async();
		var startFilter = new StartFilter(this.inject, filterConfiguration[10]);
		startFilter.getMetadata().done(function(metadata){
			assert.deepEqual(metadata, {}, "THEN no metadata available");
			done();
		});
	});
	QUnit.module('Get list values', {
		beforeEach : function() {
			commonSetup(this);
			this.startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest);
			this.filterForProperty = new Filter(this.msgH);
			this.filterForProperty.stubControl = 'filterResolution';
		}
	});
	QUnit.test('Request for correct ID created', function(assert) {
		this.startFilter.getValues();
		assert.ok(this.createRequestSpy.calledWith('VHRPropertyOne'), 'Request for correct id created');
	});
	QUnit.test('When preselection defaults are configured for single selection only', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigSinglePreselectionOnly, undefined);
		startFilter.getValues().done(function(result) {
			assert.deepEqual(result, [ {
				PropertyFive : 'value1'
			} ], 'Only first value from preselection default list returned');
		});
	});
	QUnit.test('When preselection defaults are configured for multi selection only', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigMultiPreselectionOnly, undefined);
		startFilter.getValues().done(function(result) {
			assert.deepEqual(result, [ {
				PropertySix : 'value1'
			}, {
				PropertySix : 'value2'
			}, {
				PropertySix : 'value3'
			} ], 'All values from preselection default list returned');
		});
	});
	QUnit.test('When external context is list and only filter resolution request configured', function(assert) {
		assert.expect(2);
		var testEnv = this;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithResolutionRequestOnly, [ 'valueX', 'valueY', 'valueZ' ]);
		startFilter.getValues().done(
				function(result) {
					assert.equal(testEnv.createRequestSpy.getCall(0).args[0], 'FRRPropertyFour', 'Filter resolution request for correct id created');
					assert.equal(testEnv.sendGetInBatchSpy.getCall(0).args[0].toUrlParam(), '((PropertyFour%20eq%20%27valueX%27)%20or%20(PropertyFour%20eq%20%27valueY%27)%20or%20(PropertyFour%20eq%20%27valueZ%27))',
							'Filter resolution sendGetInBatch is called with correct filter');
				});
	});
	QUnit.test('When external context is list, valueList is an empty array and only filter resolution request configured', function(assert) {
		assert.expect(2);
		var testEnv = this;
		var config = jQuery.extend(true, {}, filterConfigWithResolutionRequestOnly);
		config.valueList = []; 
		var startFilter = new StartFilter(this.injectCreateRequestSpy, config, [ 'valueX', 'valueY', 'valueZ' ]);
		startFilter.getValues().done(
				function(result) {
					assert.equal(testEnv.createRequestSpy.getCall(0).args[0], 'FRRPropertyFour', 'Filter resolution request for correct id created');
					assert.equal(testEnv.sendGetInBatchSpy.getCall(0).args[0].toUrlParam(), '((PropertyFour%20eq%20%27valueX%27)%20or%20(PropertyFour%20eq%20%27valueY%27)%20or%20(PropertyFour%20eq%20%27valueZ%27))',
							'Filter resolution sendGetInBatch is called with correct filter');
				});
	});
	QUnit.test('When external context is list and no request configured', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigWithoutRequest, [ 'valueX', 'valueY', 'valueZ' ]);
		startFilter.getValues().done(function(result) {
			assert.deepEqual(result, [ {
				PropertyThree : 'valueX'
			}, {
				PropertyThree : 'valueY'
			}, {
				PropertyThree : 'valueZ'
			} ], 'Only values from external context returned');
		});
	});
	QUnit.test('When no external context but configured value help', function(assert) {
		assert.expect(1);
		this.requestResponseValueHelp = [ {
			AliasForPropertyOne : 'valueA'
		}, {
			AliasForPropertyOne : 'valueB'
		}, {
			AliasForPropertyOne : 'valueC'
		} ];
		this.startFilter.getValues().done(function(result) {
			assert.deepEqual(result, [ {
				AliasForPropertyOne : 'valueA'
			}, {
				AliasForPropertyOne : 'valueB'
			}, {
				AliasForPropertyOne : 'valueC'
			} ], 'Only values from value help returned');
		});
	});
	QUnit.test('When no external context but valueList', function (assert){
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigWithValueHelpDefaults, undefined);
		startFilter.getValues().done(function(result){
			assert.deepEqual(result, [{
				PropertyTen : 'listValue1'
			},{
				PropertyTen : 'listValue2'
			},{
				PropertyTen : 'listValue3'
			}], 'Value help defaults returned');
		});
	});
	QUnit.test('When no intersection between external context as list and value help request', function(assert) {
		assert.expect(2);
		var testEnv = this;
		this.requestResponseValueHelp = [ {
			AliasForPropertyOne : 'valueA'
		}, {
			AliasForPropertyOne : 'valueB'
		}, {
			AliasForPropertyOne : 'valueC'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest, [ 'valueD', 'valueE', 'valueF' ]);
		startFilter.getValues().done(function(result) {
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(), 'sendGetInBatch is called with empty Filter');
			assert.deepEqual(result, [ {
				AliasForPropertyOne : 'valueD'
			}, {
				AliasForPropertyOne : 'valueE'
			}, {
				AliasForPropertyOne : 'valueF'
			}, {
				AliasForPropertyOne : 'valueA'
			}, {
				AliasForPropertyOne : 'valueB'
			}, {
				AliasForPropertyOne : 'valueC'
			} ], 'Union of external context and value help request returned');
		});
	});
	QUnit.test('When external context list intersects with value help request', function(assert) {
		assert.expect(2);
		var testEnv = this;
		this.requestResponseValueHelp = [ {
			AliasForPropertyOne : 'valueA'
		}, {
			AliasForPropertyOne : 'valueB'
		}, {
			AliasForPropertyOne : 'valueC'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest, [ 'valueA', 'valueC', 'valueD' ]);
		startFilter.getValues().done(function(result) {
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(), 'endGetInBatch is called with empty Filter');
			assert.deepEqual(result, [ {
				AliasForPropertyOne : 'valueD'
			}, {
				AliasForPropertyOne : 'valueA'
			}, {
				AliasForPropertyOne : 'valueB'
			}, {
				AliasForPropertyOne : 'valueC'
			} ], 'Merged values from external context and value help request returned');
		});
	});
	QUnit.test('When external context is filter expression and there is no filter resolution request defined', function(assert) {
		assert.expect(2);
		var testEnv = this;
		this.requestResponseFilterResolution = [ {
			PropertyFour : 'valueE'
		}, {
			PropertyFour : 'valueF'
		}, {
			PropertyFour : 'valueG'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithoutRequest, this.filterForProperty);
		startFilter.getValues().done(function(result) {
			assert.equal(testEnv.sendGetInBatchSpy.called, false, 'sendGetInBatch is not called');
			assert.equal(result, null, 'Null returned since there is no way to determine values');
		});
	});
	QUnit.test('When external context is filter expression and only filter resolution request is defined', function(assert) {
		assert.expect(2);
		var testEnv = this;
		this.requestResponseFilterResolution = [ {
			PropertyFour : 'valueE',
			Description : 'Value E'
		}, {
			PropertyFour : 'valueF',
			Description : 'Value F'
		}, {
			PropertyFour : 'valueG',
			Description : 'Value G'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithResolutionRequestOnly, this.filterForProperty);
		startFilter.getValues().done(function(result) {
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(),'sendGetInBatch is called with empty filter');
			assert.deepEqual(result, [ {
				PropertyFour : 'valueE',
				Description : 'Value E'
			}, {
				PropertyFour : 'valueF',
				Description : 'Value F'
			}, {
				PropertyFour : 'valueG',
				Description : 'Value G'
			} ], 'Values from filter resolution request returned');
		});
	});
	QUnit.test('When no intersection between result of external context as filter expression with filter resolution request and value help request', function(assert) {
		assert.expect(5);
		var testEnv = this;
		this.requestResponseValueHelp = [ {
			PropertyTwo : 'valueA',
			Description : 'Value A'
		}, {
			PropertyTwo : 'valueB',
			Description : 'Value B'
		}, {
			PropertyTwo : 'valueC',
			Description : 'Value C'
		} ];
		this.requestResponseFilterResolution = [ {
			PropertyTwo : 'valueD',
			Description : 'Value D'
		}, {
			PropertyTwo : 'valueE',
			Description : 'Value E'
		}, {
			PropertyTwo : 'valueF',
			Description : 'Value F'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest, this.filterForProperty);
		startFilter.getValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.getCall(0).args[0], 'VHRPropertyTwo', 'Value help request for correct id created');
			assert.equal(testEnv.createRequestSpy.getCall(1).args[0], 'FRRPropertyTwo', 'Filter resolution request for correct id created');
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(), 'Value help sendGetInBatch is called with empty Filter');
			assert.ok(testEnv.sendGetInBatchSpy.getCall(1).args[0].isEmpty(), 'Filter resolution sendGetInBatch is called with empty filter');
			assert.deepEqual(result, [ {
				PropertyTwo : 'valueD',
				Description : 'Value D'
			}, {
				PropertyTwo : 'valueE',
				Description : 'Value E'
			}, {
				PropertyTwo : 'valueF',
				Description : 'Value F'
			}, {
				PropertyTwo : 'valueA',
				Description : 'Value A'
			}, {
				PropertyTwo : 'valueB',
				Description : 'Value B'
			}, {
				PropertyTwo : 'valueC',
				Description : 'Value C'
			} ], 'Values from value help and filter resolution request returned');
		});
	});
	QUnit.test('When result of external context as filter expression with filter resolution request intersects with value help request', function(assert) {
		assert.expect(5);
		var testEnv = this;
		this.requestResponseValueHelp = [ {
			PropertyTwo : 'valueA'
		}, {
			PropertyTwo : 'valueB'
		}, {
			PropertyTwo : 'valueC'
		} ];
		this.requestResponseFilterResolution = [ {
			PropertyTwo : 'valueA'
		}, {
			PropertyTwo : 'valueE'
		}, {
			PropertyTwo : 'valueC'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest, this.filterForProperty);
		startFilter.getValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.getCall(0).args[0], 'VHRPropertyTwo', 'Value help request for correct id created');
			assert.equal(testEnv.createRequestSpy.getCall(1).args[0], 'FRRPropertyTwo', 'Filter resolution request for correct id created');
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(), 'Value help sendGetInBatch is called with empty Filter');
			assert.ok(testEnv.sendGetInBatchSpy.getCall(1).args[0].isEmpty(), 'Filter resolution sendGetInBatch is called with empty filter');
			assert.deepEqual(result, [ {
				PropertyTwo : 'valueE'
			}, {
				PropertyTwo : 'valueA'
			}, {
				PropertyTwo : 'valueB'
			}, {
				PropertyTwo : 'valueC'
			} ], 'Values from value help and filter resolution request returned');
		});
	});
	QUnit.test('When external context is filter expression and no value help request and no filter resolution request is defined', function(assert) {
		assert.expect(2);
		var testEnv = this;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithoutRequest, this.filterForProperty);
		startFilter.getValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.called, false, 'No request triggered');
			assert.ok(result === null, 'Null returned because values cannot be determined');
		});
	});
	QUnit.test('Without external context, value help request and filter resolution request are not defined', function(assert) {
		assert.expect(2);
		var testEnv = this;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithoutRequest, undefined);
		startFilter.getValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.called, false, 'No request triggered');
			assert.ok(result === null, 'Null returned because values cannot be determined');
		});
	});
	QUnit.test('Whithout external context and only filter resolution request is configured', function(assert) {
		assert.expect(2);
		var testEnv = this;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithResolutionRequestOnly, undefined);
		startFilter.getValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.called, false, 'No request triggered');
			assert.ok(result === null, 'Null returned because values cannot be determined');
		});
	});
	QUnit.test('When NO value help and preselection function', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigPreselectionFunctionWithoutIntersection, undefined);
		startFilter.getValues().done(function(result) {
			assert.deepEqual(result, [ {
				PropertySeven : 'funcVal1'
			}, {
				PropertySeven : 'funcVal2'
			} ], 'Only values from preselection function returned');
		});
	});
	QUnit.test('When value help and preselection function', function(assert) {
		assert.expect(1);
		this.requestResponseValueHelp = [ {
			PropertyEight : 'valueA'
		}, {
			PropertyEight : 'valueB'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigPreselectionFunctionWithIntersection, undefined);
		startFilter.getValues().done(function(result) {
			assert.deepEqual(result, [ {
				PropertyEight : 'funcVal1'
			}, {
				PropertyEight : 'valueA'
			}, {
				PropertyEight : 'valueB'
			} ], 'Values from preselection function contained at the beginning of the result list');
		});
	});
	QUnit.test('When filter resoltion request and preselection defaults', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigPreselectionDefaultsFilterResolution, undefined);
		startFilter.getValues().done(function(result) {
			assert.deepEqual(result, [ {
				PropertyNine : 'preValue1'
			}, {
				PropertyNine : 'preValue2'
			} ], 'Preselection defaults returned');
		});
	});
	QUnit.module('Get selected values', {
		beforeEach : function() {
			commonSetup(this);
			this.filterForProperty = new Filter(this.msgH);
			this.filterForProperty.stubControl = 'filterResolution';
		}
	});
	QUnit.test('When only preselection defaults as list are configured for single selection', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigSinglePreselectionOnly);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [ 'value1' ], 'First value of preselectionDefaults list returned');
		});
	});
	QUnit.test('When only preselection defaults as list are configured for multi selection', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigMultiPreselectionOnly);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [ 'value1', 'value2', 'value3' ], 'All values of preselectionDefaults list returned');
		});
	});
	QUnit.test('When preselection defaults configured and value help request is defined for multi selection', function(assert) {
		assert.expect(3);
		var testEnv = this;
		this.requestResponseValueHelp = [ {
			PropertyTwo : 'valueA'
		}, {
			PropertyTwo : 'value2'
		}, {
			PropertyTwo : 'valueC'
		}, {
			PropertyTwo : 'value1'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.getCall(0).args[0], 'VHRPropertyTwo', 'Value help request for correct id created');
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(), 'Value help sendGetInBatch is called with empty Filter');
			assert.deepEqual(result, [ 'value1', 'value2', 'value3'], 'Values from preselection which intersect with value help request returned');
		});
	});
	QUnit.test('When preselection defaults configured and value help request is defined for single selection', function(assert) {
		assert.expect(3);
		var testEnv = this;
		var filterConfig = jQuery.extend(true, {}, filterConfigWithValueHelpAndResolutionRequest);
		filterConfig.multiSelection = false;
		this.requestResponseValueHelp = [ {
			PropertyTwo : 'valueA'
		}, {
			PropertyTwo : 'value2'
		}, {
			PropertyTwo : 'valueC'
		}, {
			PropertyTwo : 'value1'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfig, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.getCall(0).args[0], 'VHRPropertyTwo', 'Value help request for correct id created');
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(), 'Value help sendGetInBatch is called with empty Filter');
			assert.deepEqual(result, [ 'value1' ], 'First value from preselection which intersect with value help request returned');
		});
	});
	QUnit.test('When external context is list, single selection and no request configured', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigWithoutRequest, [ 'valueA', 'valueB', 'valueC' ]);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [ 'valueA' ], 'First value of external context returned');
		});
	});
	QUnit.test('When external context is list, multi selection and no request configured', function(assert) {
		assert.expect(1);
		var filterConfigWithoutRequestMulti = jQuery.extend(true, {}, filterConfigWithoutRequest);
		filterConfigWithoutRequestMulti.multiSelection = true;
		var startFilter = new StartFilter(this.inject, filterConfigWithoutRequestMulti, [ 'valueA', 'valueB', 'valueC' ]);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [ 'valueA', 'valueB', 'valueC' ], 'External context returned');
		});
	});
	QUnit.test('When external context is filter expression and no request configured', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigWithoutRequest, this.filterForProperty);
		startFilter.getSelectedValues().done(function(result) {
			assert.strictEqual(result.type, 'internalFilter' , 'Context filter returned; only needed for invisible filters of minus-one-level');
		});
	});
	QUnit.test('When external context is filter expression and filter resolution request is defined for single selection', function(assert) {
		assert.expect(3);
		var testEnv = this;
		this.requestResponseFilterResolution = [ {
			PropertyFour : 'valueA'
		}, {
			PropertyFour : 'valueB'
		}, {
			PropertyFour : 'valueC'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithResolutionRequestOnly, this.filterForProperty);
		startFilter.getSelectedValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.getCall(0).args[0], 'FRRPropertyFour', 'Filter resolution request for correct id created');
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(), 'Filter resolution sendGetInBatch is called with empty Filter');
			assert.deepEqual(result, [ 'valueA' ], 'First value from filter resolution request returned');
		});
	});
	QUnit.test('When external context is filter expression and filter resolution request is defined for multi selection', function(assert) {
		assert.expect(3);
		var testEnv = this;
		var filterConfigWithResolutionRequestOnlyMulti = jQuery.extend(true, {}, filterConfigWithResolutionRequestOnly);
		filterConfigWithResolutionRequestOnlyMulti.multiSelection = true;
		this.requestResponseFilterResolution = [ {
			PropertyFour : 'valueA'
		}, {
			PropertyFour : 'valueB'
		}, {
			PropertyFour : 'valueC'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithResolutionRequestOnlyMulti, this.filterForProperty);
		startFilter.getSelectedValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.getCall(0).args[0], 'FRRPropertyFour', 'Filter resolution request for correct id created');
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(), 'Filter resolution sendGetInBatch is called with empty filter');
			assert.deepEqual(result, [ 'valueA', 'valueB', 'valueC' ], 'All values from filter resolution request returned');
		});
	});
	QUnit.test('When only value help request is defined for single selection', function(assert) {
		assert.expect(3);
		var testEnv = this;
		this.requestResponseValueHelp = [ {
			AliasForPropertyOne : 'valueX'
		}, {
			AliasForPropertyOne : 'valueY'
		}, {
			AliasForPropertyOne : 'valueZ'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.getCall(0).args[0], 'VHRPropertyOne', 'Value help request for correct id created');
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(), 'Value help sendGetInBatch is called with empty Filter');
			assert.deepEqual(result, [ 'valueX' ], 'First value from value help request returned');
		});
	});
	QUnit.test('When only value help request is defined for multi selection', function(assert) {
		assert.expect(3);
		var testEnv = this;
		var filterConfigWithValueHelpRequestMulti = jQuery.extend(true, {}, filterConfigWithValueHelpRequest);
		filterConfigWithValueHelpRequestMulti.multiSelection = true;
		this.requestResponseValueHelp = [ {
			AliasForPropertyOne : 'valueX'
		}, {
			AliasForPropertyOne : 'valueY'
		}, {
			AliasForPropertyOne : 'valueZ'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequestMulti, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.equal(testEnv.createRequestSpy.getCall(0).args[0], 'VHRPropertyOne', 'Value help request for correct id created');
			assert.ok(testEnv.sendGetInBatchSpy.getCall(0).args[0].isEmpty(), 'Value help sendGetInBatch is called with empty Filter');
			assert.deepEqual(result, [ 'valueX', 'valueY', 'valueZ' ], 'All values from value help request returned');
		});
	});
	QUnit.test('Without external context and only filter resolution request is configured', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithResolutionRequestOnly, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.equal(result, null, 'Null returned because values cannot be determined');
		});
	});
	QUnit.test('Without external context, value help request and filter resolution request are not defined', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithoutRequest, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.equal(result, null, 'Null returned because values cannot be determined');
		});
	});
	QUnit.test('When NO value help and preselection function', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigPreselectionFunctionWithoutIntersection, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [ 'funcVal1', 'funcVal2' ], 'Only values from preselection function returned');
		});
	});
	QUnit.test('When value help and preselection function', function(assert) {
		assert.expect(1);
		this.requestResponseValueHelp = [ {
			PropertyEight : 'valueA'
		}, {
			PropertyEight : 'valueB'
		} ];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigPreselectionFunctionWithIntersection, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [ 'funcVal1', 'valueA' ], 'Only intersection from preselection function and value help returend');
		});
	});
	QUnit.test('When filter resoltion request and preselection defaults', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigPreselectionDefaultsFilterResolution, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [ 'preValue1', 'preValue2' ], 'Preselection defaults returned');
		});
	});
	QUnit.test('When default filter option none', function(assert) {
		assert.expect(2);
		var startFilter = new StartFilter(this.inject, filterConfigWithNoneOption, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [], 'No selected values returned in multi selection');
		});
		startFilter = new StartFilter(this.inject, filterConfigWithNoneOptionSingleSelection, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [], 'No selected values returned in single selection');
		});
	});
	QUnit.test('When default filter option none and value help request', function(assert) {
		assert.expect(2);
		var config = jQuery.extend(true, {}, filterConfigWithNoneOption);
		config.valueHelpRequest = 'VHR';
		var startFilter = new StartFilter(this.inject, config, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [], 'No selected values returned in multi selection');
		});
		config.multiSelection = false;
		startFilter = new StartFilter(this.inject, config, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [], 'No selected values returned in single selection');
		});
	});
	QUnit.test('When default filter option none and filter resolution request', function(assert) {
		assert.expect(2);
		var config = jQuery.extend(true, {}, filterConfigWithNoneOption);
		config.filterResolutionRequest = 'FRR';
		var startFilter = new StartFilter(this.inject, config, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [], 'No selected values returned in multi selection');
		});
		config.multiSelection = false;
		startFilter = new StartFilter(this.inject, config, undefined);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, [], 'No selected values returned in single selection');
		});
	});
	QUnit.test('When default filter option none and filter resolution request with filter in context', function(assert) {
		var config = jQuery.extend(true, {}, filterConfigWithNoneOption);
		config.filterResolutionRequest = 'FRR';
		var filter = new Filter(this.msgH, 'PropertyEleven', 'eq', '1');
		filter.stubControl = "filterResolution";
		this.requestResponseFilterResolution = [ {
			PropertyEleven : '1'
		}];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, config, filter);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, ['1'], 'Resolved context value as selected value');
		});
	});
	QUnit.test('When default filter option none and context filter without filter resolution', function(assert) {
		var testEnv = this;
		assert.expect(2);
		var startFilter = new StartFilter(this.inject, filterConfigWithNoneOption, new Filter(this.msgH, 'PropertyOne', 'eq', '1'));
		startFilter.getSelectedValues().done(function(result) {
			assert.ok(result.isEqual(new Filter(testEnv.msgH, 'PropertyOne', 'eq', '1')), 'Context filter returned in multi selection');
		});
		startFilter = new StartFilter(this.inject, filterConfigWithNoneOptionSingleSelection, new Filter(this.msgH, 'PropertyOne', 'eq', '1'));
		startFilter.getSelectedValues().done(function(result) {
			assert.ok(result.isEqual(new Filter(testEnv.msgH, 'PropertyOne', 'eq', '1')), 'Context filter returned in single selection');
		});
	});
	QUnit.test('When default filter option none and context array', function(assert) {
		assert.expect(2);
		var startFilter = new StartFilter(this.inject, filterConfigWithNoneOption, ['value1', 'value2']);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, ['value1', 'value2'], 'Values from context returned in multi selection');
		});
		startFilter = new StartFilter(this.inject, filterConfigWithNoneOptionSingleSelection, ['value1', 'value2']);
		startFilter.getSelectedValues().done(function(result) {
			assert.deepEqual(result, ['value1'], 'First value from context returned in single selection');
		});
	});
	QUnit.test('When preselectionDefaults are partly restricted by dependent startfilter', function(assert){
		var testEnv = this;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest, undefined);
		var valueHelpBeforeRestriction =  [ {
					PropertyTwo : 'value2'
				}, {
					PropertyTwo : 'value3'
				} ];
		var valueHelpAfterRestriction = [ {
					PropertyTwo : 'value4'
				}, {
					PropertyTwo : 'value5'
				} ];
		testEnv.requestResponseValueHelp = valueHelpBeforeRestriction;
		startFilter.getSelectedValues().done(function(result, promise){
			assert.deepEqual(result, ['value1', 'value2', 'value3'], 'Initially selected values are correct');

			testEnv.requestResponseValueHelp = valueHelpAfterRestriction;
			startFilter.setRestriction(new Filter(testEnv.msgH, 'Test', 'eq', 'TestValue'));
			promise.done(function(result){
				assert.deepEqual(result, ['value1'], 'Selected values containing only preselection default that was not part of the value help');
			});
		});
	});
	QUnit.test('When all selected values are restricted by dependent startfilter with automatic selection option', function(assert){
		var testEnv = this;
		var config = jQuery.extend(true, {}, filterConfigWithValueHelpRequest);
		config.multiSelection = true;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, config, undefined);
		var valueHelpBeforeRestriction =  [ {
					AliasForPropertyOne : 'value1'
				},{
					AliasForPropertyOne : 'value2'
				}, {
					AliasForPropertyOne : 'value3'
				} ];
		var valueHelpAfterRestriction = [ {
					AliasForPropertyOne : 'value4'
				}, {
					AliasForPropertyOne : 'value5'
				} ];
		testEnv.requestResponseValueHelp = valueHelpBeforeRestriction;
		startFilter.getSelectedValues().done(function(result, promise){
			assert.deepEqual(result, ['value1', 'value2', 'value3'], 'Initially selected values are correct');

			testEnv.requestResponseValueHelp = valueHelpAfterRestriction;
			startFilter.setRestriction(new Filter(testEnv.msgH, 'Test', 'eq', 'TestValue'));
			promise.done(function(result){
				assert.deepEqual(result, ['value4', 'value5'], 'Selected values containing all list values returned');
			});
		});
	});
	QUnit.test('When all selected values are restricted by dependent startfilter with filter option none - multi selection', function(assert){
		var testEnv = this;
		var config = jQuery.extend(true, {}, filterConfigWithNoneOption);
		config.valueHelpRequest = 'VHR';
		var startFilter = new StartFilter(this.injectCreateRequestSpy, config, undefined);
		var valueHelpBeforeRestriction =  [ {
			PropertyEleven : 'value1'
		},{
			PropertyEleven : 'value2'
		}, {
			PropertyEleven : 'value3'
		} ];
		var valueHelpAfterRestriction = [ {
			PropertyEleven : 'value4'
		}, {
			PropertyEleven : 'value5'
		} ];
		testEnv.requestResponseValueHelp = valueHelpBeforeRestriction;
		startFilter.getSelectedValues().done(function(result, promise){
			assert.deepEqual(result, [], 'Initially selected values are correct');
			startFilter.setSelectedValues(['value1', 'value2', 'value3']);
			promise.done(function(result, promise){
				assert.deepEqual(result, ['value1', 'value2', 'value3'], 'Correct values selected');
				testEnv.requestResponseValueHelp = valueHelpAfterRestriction;
				startFilter.setRestriction(new Filter(testEnv.msgH, 'Test', 'eq', 'TestValue'));
				promise.done(function(result){
					assert.deepEqual(result, [], 'Restriction leads to no selected values');
				});
			});
		});
	});
	QUnit.test('When all selected values are restricted by dependent startfilter with filter option none - single selection', function(assert){
		var testEnv = this;
		var config = jQuery.extend(true, {}, filterConfigWithNoneOptionSingleSelection);
		config.valueHelpRequest = 'VHR';
		var startFilter = new StartFilter(this.injectCreateRequestSpy, config, undefined);
		var valueHelpBeforeRestriction =  [ {
			PropertyTwelve : 'value1'
		},{
			PropertyTwelve : 'value2'
		}, {
			PropertyTwelve : 'value3'
		} ];
		var valueHelpAfterRestriction = [ {
			PropertyTwelve : 'value4'
		}, {
			PropertyTwelve : 'value5'
		} ];
		testEnv.requestResponseValueHelp = valueHelpBeforeRestriction;
		startFilter.getSelectedValues().done(function(result, promise){
			assert.deepEqual(result, [], 'Initially selected values are correct');
			startFilter.setSelectedValues(['value1']);
			promise.done(function(result, promise){
				assert.deepEqual(result, ['value1'], 'Correct values selected');
				testEnv.requestResponseValueHelp = valueHelpAfterRestriction;
				startFilter.setRestriction(new Filter(testEnv.msgH, 'Test', 'eq', 'TestValue'));
				promise.done(function(result){
					assert.deepEqual(result, [], 'Restriction leads to no selected values');
				});
			});
		});
	});
	QUnit.module('Set selected values', {
		beforeEach : function() {
			var deferCallback = true;
			commonSetup(this, deferCallback);
		}
	});
	QUnit.test('Set no value as selected', function(assert) {
		var startFilter = new StartFilter(this.inject, filterConfigWithoutRequest, ['value1']);
		startFilter.getSelectedValues().done(function(selectedValues, promiseOnResolve) {
			startFilter.setSelectedValues([]);
			promiseOnResolve.done(function(selectedValues) {
				assert.deepEqual(selectedValues, [], 'Empty array returned');
			});
		});
	});
	QUnit.test('Set after mandatory initial call of getSelectedValues()', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest);
		this.requestResponseValueHelp = [ {
			PropertyTwo : 'value4' //does not have an effect on selected values
		}];
		startFilter.getSelectedValues().done(function(selectedValues, promise) {
			startFilter.setSelectedValues(['value2']);
			assert.deepEqual(selectedValues, ['value1', 'value2', 'value3'], 'Predefined values from configuration returned');
			promise.done(function(selectedValues) {
				assert.deepEqual(selectedValues, ['value2'], 'Externally set value returned');
				done();
			});
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.callbackArgument);}.bind(this), 1); 
	});
	QUnit.test('Set if there are no defaults and no values from any request', function(assert) {
		assert.expect(2);
		var startFilter = new StartFilter(this.inject, filterConfigWithoutRequest);
		startFilter.getSelectedValues().done(function(selectedValues, promiseOnResolve) {
			assert.deepEqual(selectedValues, null, 'Null since filter has no defaults and nothing is set');
			startFilter.setSelectedValues([ 'valueA', 'valueB' ]);
			promiseOnResolve.done(function(selectedValues) {
				assert.deepEqual(selectedValues, [], 'Empty array returned after set. Empty array is the internal marker that values have been set externally');
			});
		});
	});
	QUnit.test('Predefined values can only be restricted by set method', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigMultiPreselectionOnly);
		startFilter.getSelectedValues().done(function(selectedValues, promise) {
			startFilter.setSelectedValues([ 'value3', 'value4' ]);
			promise.done(function(selectedValues, promise) {
				assert.deepEqual(selectedValues, [ 'value3' ], 'Array with values contained in preselection that have been set before');
			});
		});
	});
	QUnit.test('Selected values cannot be manipulated using array reference', function(assert) {
		var startFilter = new StartFilter(this.inject, filterConfigMultiPreselectionOnly);
		var valuesToBeSet = [ 'value1', 'value2' ];
		var valuesReturnedByGet;
		startFilter.getSelectedValues().done(function(selectedValues, promise) {
			startFilter.setSelectedValues(valuesToBeSet);
			valuesToBeSet.push('valueC');
			promise.done(function(selectedValues, promise) {
				valuesReturnedByGet = selectedValues;
				assert.deepEqual(selectedValues, [ 'value1', 'value2' ], 'Returned array contains values having been set');
				valuesReturnedByGet.push('valueD');
				startFilter.getSelectedValues().done(function(selectedValues, promise) {
					promise.done(function(selectedValues, promise) {
						promise.done(function(selectedValues, promise) {
							assert.deepEqual(selectedValues, [ 'value1', 'value2' ], 'Returned array still contains values having been set');
						});
					});
				});
			});
		});
	});
	QUnit.test('Set filter as selected values returns empty array if start filter is visible', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.inject, filterConfigWithoutRequest);
		startFilter.setSelectedValues(new Filter(this.msgH));
		startFilter.getSelectedValues().done(function(selectedValues) {
			assert.deepEqual(selectedValues, [], 'Empty array expected');
		});
	});
	QUnit.test('Set filter value on a startFilter with value list ', function(assert) {
		assert.expect(2);
		var startFilter = new StartFilter(this.inject, filterConfigWithValueHelpDefaults);
		startFilter.getSelectedValues().done(function(initialySelectedValues) {
			assert.deepEqual(initialySelectedValues, ["listValue1", "listValue2", "listValue3"], 'List values selected');
			startFilter.setSelectedValues(["listValue1"]);
			startFilter.getSelectedValues().done(function(selectedValues) {
				assert.deepEqual(selectedValues, ["listValue1"], 'listValue1 expected');
			});
		});
	});
	QUnit.module('List values with external context and restrictions', {
		beforeEach : function() {
			var deferCallback = true;
			commonSetup(this, deferCallback);
		}
	});
	QUnit.test('Apply restriction on list values with external context values', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var valueHelp = {
			data : [ {
				AliasForPropertyOne : 'containedInValueHelp'
			}, {
				AliasForPropertyOne : 'otherValue'
			} ]
		};
		var restrictedValueHelp = {
			data : [ {
				AliasForPropertyOne : 'otherValue'
			} ]
		};

		var expectedListValuesBeforeRestriction = [ {
			AliasForPropertyOne : 'notContainedInValueHelp'
		}, {
			AliasForPropertyOne : 'containedInValueHelp'
		}, {
			AliasForPropertyOne : 'otherValue'
		} ];

		var expectedListValuesAfterRestriction = [ {
			AliasForPropertyOne : 'notContainedInValueHelp'
		},{
			AliasForPropertyOne : 'otherValue'
		} ];

		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest, [ 'containedInValueHelp', 'notContainedInValueHelp' ]);

		startFilter.getValues().done(function(values) {
			assert.deepEqual(values, expectedListValuesBeforeRestriction, 'Correct value help list returned');
			startFilter.setRestriction(new Filter(this.msgH, 'PropertyTest', 'eq', 'Test'));
			setTimeout(function() {this.callbacksSendGetInBatch[1](jQuery.extend(true, [], restrictedValueHelp));}.bind(this), 1); 
			startFilter.getValues().done(function(values){
				assert.deepEqual(values, expectedListValuesAfterRestriction, 'Correct value help list returned');
				startFilter.setRestriction(new Filter(this.msgH));
				setTimeout(function() {this.callbacksSendGetInBatch[2](jQuery.extend(true, [], valueHelp));}.bind(this), 1); 
				startFilter.getValues().done(function(values){
					assert.deepEqual(values, expectedListValuesBeforeRestriction, 'Correct value help list returned');
					done();
				});
			}.bind(this));
		}.bind(this));

		setTimeout(function() {this.callbacksSendGetInBatch[0](jQuery.extend(true, [], valueHelp));}.bind(this), 1); 
	});
	QUnit.test('Apply restriction on getSelectedValues with external context values', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var valueHelp = {
				data : [ {
					AliasForPropertyOne : 'containedInValueHelp'
				}, {
					AliasForPropertyOne : 'otherValue'
				} ]
		};
		var restrictedValueHelp = {
				data : [ {
					AliasForPropertyOne : 'otherValue'
				} ]
		};

		var expectedSelectedValuesBeforeRestriction = [	'containedInValueHelp' , 'notContainedInValueHelp' ];

		var expectedListValuesAfterRestriction = [ 'notContainedInValueHelp' ];
		var config = jQuery.extend(true, {}, filterConfigWithValueHelpRequest);
		config['multiSelection'] = true;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, config, [ 'containedInValueHelp', 'notContainedInValueHelp' ]);

		startFilter.getSelectedValues().done(function(values, promise) {
			assert.deepEqual(values, expectedSelectedValuesBeforeRestriction, 'Correct selected values returned');
			startFilter.setRestriction(new Filter(this.msgH, 'PropertyTest', 'eq', 'Test'));
			setTimeout(function() {this.callbacksSendGetInBatch[1](jQuery.extend(true, [], restrictedValueHelp));}.bind(this), 1); 
			promise.done(function(values, promise){
				assert.deepEqual(values, expectedListValuesAfterRestriction, 'Correct selected values returned');
				startFilter.setRestriction(new Filter(this.msgH));
				setTimeout(function() {this.callbacksSendGetInBatch[2](jQuery.extend(true, [], valueHelp));}.bind(this), 1); 
				promise.done(function(values, promise){
					assert.deepEqual(values, expectedListValuesAfterRestriction, 'Correct selected values returned');
					done();
				});
			}.bind(this));
		}.bind(this));

		setTimeout(function() {this.callbacksSendGetInBatch[0](jQuery.extend(true, [], valueHelp));}.bind(this), 1); 
	});
	QUnit.module('Requests with restrictions', {
		beforeEach : function() {
			var deferCallback = true;
			commonSetup(this, deferCallback);
		}
	});
	QUnit.test('Value help request', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest);
		var restriction = new Filter(this.msgH, 'RestrictiveProperty', 'eq', 'RestrictionValue');
		startFilter.setRestriction(restriction);
		startFilter.getValues().done(function(values) {
			assert.equal(this.sendGetInBatchSpy.getCall(0).args[0].toUrlParam(), '(RestrictiveProperty%20eq%20%27RestrictionValue%27)', 'sendGetInBatch is called with restriction');
			done();
		}.bind(this));
		callSendGetInBatchCallbacks(this, true);
	});
	QUnit.test('Copy of filter restriction used in Value help request', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest);
		var restriction = new Filter(this.msgH);
		startFilter.setRestriction(restriction);
		restriction.addAnd('RestrictiveProperty', 'eq', 'RestrictionValue');
		startFilter.getValues().done(function(values) {
			assert.equal(this.sendGetInBatchSpy.getCall(0).args[0].toUrlParam(), '', 'sendGetInBatch is called with copied restriction');
			done();
		}.bind(this));
		callSendGetInBatchCallbacks(this, true);
	});
	QUnit.test('Filter resolution request', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var filterForProperty = new Filter(this.msgH, 'PropertyFour', 'lt', '100');
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithResolutionRequestOnly, filterForProperty);
		var restrictiveFilter = new Filter(this.msgH, 'RestrictiveProperty', 'eq', 'RestrictionValue');
		startFilter.setRestriction(restrictiveFilter);
		startFilter.getSelectedValues().done(function(values) {
		    assert.equal(this.sendGetInBatchSpy.getCall(0).args[0].toUrlParam(), '((RestrictiveProperty%20eq%20%27RestrictionValue%27)%20and%20(PropertyFour%20lt%20%27100%27))', 'sendGetInBatch is called with merged filter from context and restriction');
		    done();
		}.bind(this));
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.callbackArgument);}.bind(this), 1); 
	});
	QUnit.test('When different restrictions are set subsequently promise only is resolved with last restriction', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var A = {data : [{
			PropertyTwo : 'valueA'
		}]};
		var B = {data : [{
			PropertyTwo : 'valueB'
		}]};
		var C = {data : [{
			PropertyTwo : 'valueC'
		}]};
		var D = {data : [{
			PropertyTwo : 'valueD'
		}]};
		var filterForProperty = new Filter(this.msgH);
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest, filterForProperty);
		startFilter.getSelectedValues().done(function(values) {
			assert.deepEqual(values, ['valueC'], 'Correct value from last request invocation being triggered by 2nd setRestriction() returned');
			done();
		});
		startFilter.setRestriction(new Filter(this.msgH, 'PropertyTest', 'eq', 'Test'));
		startFilter.setRestriction(new Filter(this.msgH, 'PropertyTest', 'eq', 'Test2'));

		// Filter resolution requests
		setTimeout(function() {this.callbacksSendGetInBatch[0](A);}.bind(this), 10);
		setTimeout(function() {this.callbacksSendGetInBatch[1](B);}.bind(this), 30);
		setTimeout(function() {
			this.callbacksSendGetInBatch[2](C);
			//Value help request to checkSelectedValues against value help (doesn't do anything as context values will be added to value help anyway)
			setTimeout(function() {this.callbacksSendGetInBatch[3](D);}.bind(this), 8);
		}.bind(this), 20);
	});
	QUnit.test('When different restrictions are set subsequently only promise for getValues from last restriction is resolved', function(assert) {
		assert.expect(2);
		var testEnv = this;
		var done = assert.async();
		var A = {data : [{
			PropertyFour : 'valueA'
		}]};
		var B = {data : [{
			PropertyFour : 'valueB'
		}]};
		var C = {data : [{
			PropertyFour : 'valueC'
		}]};
		var filterForProperty = new Filter(this.msgH);
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithResolutionRequestOnly, filterForProperty);

		startFilter.getValues().done(function(values) {
			assert.deepEqual(values, [{PropertyFour: 'valueB'}], 'Correct value from last request returned');

			startFilter.setRestriction(new Filter(testEnv.msgH, 'PropertyTest', 'eq', 'Test2'));
			setTimeout(function() {testEnv.callbacksSendGetInBatch[1](A);}, 1);
			setTimeout(function() {testEnv.callbacksSendGetInBatch[2](C);}, 16);

			startFilter.getValues().done(function(values){
				assert.deepEqual(values, [ {PropertyFour: 'valueC'}], 'Correct value from last request returned');
				done();
			});
		});
		startFilter.setRestriction(new Filter(this.msgH, 'PropertyTest', 'eq', 'Test'));

		setTimeout(function() {this.callbacksSendGetInBatch[0](B);}.bind(this), 1);
	});
	QUnit.test('When different restrictions are set subsequently only promise for getSelectedvalues from last restriction is resolved', function(assert) {
		assert.expect(2);
		var testEnv = this;
		var done = assert.async();
		var A = {data : [{
			PropertyFour : 'valueA'
		},{
			PropertyFour : 'valueB'
		},{
			PropertyFour : 'valueC'
		}]};
		var B = {data : [{
			PropertyFour : 'valueB'
		},{
			PropertyFour : 'valueC'
		}]};
		var C = {data : [{
			PropertyFour : 'valueC'
		}]};
		var config = jQuery.extend(true, {}, filterConfigWithResolutionRequestOnly);
		config.multiSelection = true;
		var filterForProperty = new Filter(this.msgH);
		var startFilter = new StartFilter(this.injectCreateRequestSpy, config, filterForProperty);

		startFilter.getSelectedValues().done(function(values, promise) {
			assert.deepEqual(values, ['valueB', 'valueC'], 'Correct value from last request returned');
			startFilter.setRestriction(new Filter(testEnv.msgH, 'PropertyTest', 'eq', 'Test2'));
			setTimeout(function() {testEnv.callbacksSendGetInBatch[0](A);}, 1);
			setTimeout(function() {testEnv.callbacksSendGetInBatch[2](C);}, 16);
			promise.done(function(values){
				assert.deepEqual(values, ['valueC'], 'Correct value from last request returned');
				done();
			});
		});

		startFilter.setRestriction(new Filter(this.msgH, 'PropertyTest', 'eq', 'Test'));
		setTimeout(function() {this.callbacksSendGetInBatch[1](B);}.bind(this), 1);
	});
	QUnit.test('Selected values set via setSelectedValues() are reduced by restricted response', function(assert) {
		var done = assert.async();
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest);
		this.requestResponseValueHelp = [ {
			AliasForPropertyOne : 'valueB'
		}, {
			AliasForPropertyOne : 'valueC'
		} ];
		startFilter.setSelectedValues([ 'valueA', 'valueB' ]);
		startFilter.getSelectedValues().done(function(values) {
			assert.deepEqual(values, [ 'valueB' ], 'Restricted selected values returned');
			done();
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.callbackArgument);}.bind(this), 1); 
	});
	QUnit.module('Serialization / Deserialization', {
		beforeEach : function() {
			var deferCallback = true;
			commonSetup(this, deferCallback);
		}
	});
	QUnit.test('Serialize', function(assert) {
		var isNavigation;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigMultiPreselectionOnly);
		startFilter.getSelectedValues().done(function() {
			startFilter.setSelectedValues([ 'value1', 'value2' ]);
			startFilter.serialize(isNavigation).done(function(serializedStartFilter) {
				assert.deepEqual(serializedStartFilter, {
					propertyName : 'PropertySix',
					selectedValues : [ 'value1', 'value2' ]
				}, 'Serialized StartFilter');
			});
		});
	});
	QUnit.test('Serialize including initial selection state for later reset', function(assert) {
		var isNavigation = true;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigMultiPreselectionOnly);
		startFilter.getSelectedValues().done(function() {
			startFilter.setSelectedValues([ 'value1', 'value2' ]);
			startFilter.serialize(isNavigation).done(function(serializedStartFilter) {
				assert.deepEqual(serializedStartFilter, {
					propertyName : 'PropertySix',
					selectedValues : [ 'value1', 'value2' ],
					initiallySelectedValues : ['value1', 'value2', 'value3']
				}, 'Serialized StartFilter including buffered selected values');
			});
		});
	});
	QUnit.test('Serialize when selected values are "null"', function(assert) {
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithoutRequest);
			startFilter.serialize().done(function(serializedStartFilter) {
				assert.deepEqual(serializedStartFilter, {
					propertyName : 'PropertyThree',
					selectedValues : null
				}, 'Start filter serialization for "null" supported');
			});
	});
	QUnit.test('Deserialize when selected values are "null"', function(assert) {
		var serializedStartFitler = {
				propertyName : 'PropertyThree',
				selectedValues : null
		};
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithoutRequest);
		startFilter.deserialize(serializedStartFitler);
		startFilter.getSelectedValues().done(function(selectedValues) {
			assert.deepEqual(selectedValues, null, 'getSelectedValues() returns "null" from deserialization');
		});
	});
	QUnit.test('Deserialize', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigMultiPreselectionOnly);
		startFilter.setSelectedValues([ 'value1' ]);
		startFilter.deserialize({
			selectedValues : [ 'value1', 'value2' ]
		});
		startFilter.getSelectedValues().done(function(selectedValues) {
			assert.deepEqual(selectedValues, [ 'value1', 'value2' ], 'getSelectedValues() returns values from deserialization');
		});
	});
	QUnit.test('Reset after deserialization including initially selected values', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigMultiPreselectionOnly);
		startFilter.deserialize({
			selectedValues : [ 'value1', 'value2' ],
			initiallySelectedValues : ['value1']
			//initiallySelectedValues : ['value3'] - TODO Check logic for this value
		});
		startFilter.reset();
		startFilter.getSelectedValues().done(function(selectedValues, promise) {
			assert.deepEqual(selectedValues, ['value1'], 'Values reset to state from deserialization');
//			assert.deepEqual(selectedValues, ['value3'], 'Values reset to state from deserialization');
		});
	});
	QUnit.test('Reset after serialization for "last good APF state"', function(assert) {
		assert.expect(1);
		var isNavigation = false;
		var keepInitialStartFilterValues = true;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigMultiPreselectionOnly);
		
		startFilter.setSelectedValues(['value1']);
		startFilter.serialize(isNavigation, keepInitialStartFilterValues).done(function() {
			startFilter.reset();
			startFilter.getSelectedValues().done(function(selectedValues, promise) {
				assert.deepEqual(selectedValues, ['value1', 'value2', 'value3'], 'Values reset to initial state');
			});
		});
	});
	QUnit.test('Deserialize with more selected values then getValues()', function(assert) {
		assert.expect(2);
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigMultiPreselectionOnly);
		startFilter.deserialize({
			selectedValues : [ 'value3', 'value4' ]
		});
		startFilter.getValues().done(function(values) {
			assert.deepEqual(values, [ {
				"PropertySix" : "value3"
			}, {
				"PropertySix" : "value4"
			} ], 'getValues() returns list values and additional selected value. Serialized selected values are handled as context');
		});
		startFilter.getSelectedValues().done(function(selectedValues) {
			assert.deepEqual(selectedValues, [ 'value3', 'value4' ], 'getSelectedValues() returns correct selected values. Serialized selected values are handled as context');
		});
	});
	QUnit.test('Set selected values, deserialize, set again and reset', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest);
		this.requestResponseValueHelp = [ {
			PropertyTwo : 'value4'
		}];
		startFilter.getSelectedValues().done(function(selectedValues) {
			assert.deepEqual(selectedValues, ['value1', 'value2', 'value3'], 'Predefined values from configuration');
			startFilter.setSelectedValues(['value2']);
			startFilter.deserialize({
				selectedValues : ['value1']
			});
			startFilter.setSelectedValues(['value4']);
			startFilter.reset();
			startFilter.getSelectedValues().done(function(selectedValues) {
					assert.deepEqual(selectedValues, ['value1'], 'Selected value from deserialization state returned and not from application launch state');
					done();
			});
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.callbackArgument);}.bind(this), 1); 
	});
	QUnit.test('Set selected values, serialize (save path) and reset', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest);
		startFilter.getSelectedValues().done(function(selectedValues) {
			startFilter.setSelectedValues(['value1', 'value2']);
			startFilter.serialize().done(function() {
				startFilter.reset();
				startFilter.getSelectedValues().done(function(selectedValues) {
					assert.deepEqual(selectedValues, ['value1', 'value2'], 'Values from saved path expected');
					done();
				});
			});
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.callbackArgument);}.bind(this), 1); 
	});
	QUnit.test('Deserialize from navigation, set selected values and reset', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var isNavigation = true;
		var requestResponse = { 
				data : [ {
					PropertyTwo: 'value1'
				}, 
				{
					PropertyTwo: 'value2'
				}, 
				{
					PropertyTwo: 'value3'
				}]
		};
		var serializedStartFilter = {
				propertyName : 'PropertyTwo',
				selectedValues : ['value2'],
				initiallySelectedValues : ['value3']
			}; 
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest);
		
		startFilter.getSelectedValues().done(function(selectedValues) {
			startFilter.deserialize(serializedStartFilter, isNavigation);
			assert.deepEqual(selectedValues, ['value1', 'value2', 'value3'], 'Selected values from deserialization state, e.g. open path');
			startFilter.setSelectedValues(['value1']);
			startFilter.getSelectedValues().done(function(selectedValues) {
				assert.deepEqual(selectedValues, ['value1'], 'Reset to selected values from reset buffer state');
				startFilter.reset();
				startFilter.getSelectedValues().done(function(selectedValues) {
					assert.deepEqual(selectedValues, ['value3'], 'Reset to selected values from reset buffer state');
					done();
				});
			});
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](requestResponse);}.bind(this), 1); 
	});
	QUnit.test('Set selected values, serialize (save path), set again and reset', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest);
		this.requestResponseValueHelp = [ {
			PropertyTwo : 'value4'
		}];
		startFilter.getSelectedValues().done(function(selectedValues) {
			startFilter.setSelectedValues(['value1', 'value2']);
			startFilter.serialize().done(function() {
				startFilter.setSelectedValues(['value4']);
				startFilter.reset();
				startFilter.getSelectedValues().done(function(selectedValues) {
					assert.deepEqual(selectedValues, ['value1', 'value2'], 'Values from saved path expected');
					done();
				});
			});
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.callbackArgument);}.bind(this), 1); 
	});
	QUnit.test('SelectedValues is internal filter', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var testEnv = this;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest);
		this.requestResponseValueHelp = [ {
			PropertyTwo : 'value1'
		}, {
			PropertyTwo : 'value2'
		}, {
			PropertyTwo : 'value3'
		} ];
		
		this.requestResponseFilterResolution = [ {
			PropertyTwo : 'value1'
		} ];
		var filter = new Filter(this.msgH, 'PropertyTwo', 'lt', 'value2');
		filter.stubControl = 'filterResolution';
		
		startFilter.deserialize({
			selectedValues : filter
		});
		startFilter.getSelectedValues().done(function(selectedValues) {
			assert.deepEqual(selectedValues, [ 'value1' ], 'Correct selected value returned');
			assert.equal(testEnv.sendGetInBatchSpy.getCall(0).args[0].toUrlParam(), '(PropertyTwo%20lt%20%27value2%27)', 'Filter resolution request is called with filter');
			done();
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.callbackArgument);}.bind(this), 1); 
		setTimeout(function() {this.callbacksSendGetInBatch[1](this.callbackArgument);}.bind(this), 1); 
	});
	QUnit.test('Call deserialize durinng determination of selected values', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpAndResolutionRequest);
		this.requestResponseValueHelp = [ {
			PropertyTwo : 'value1' 
		}, {
			PropertyTwo : 'value2'
		}, {
			PropertyTwo : 'value3'
		} ];
		
		startFilter.getSelectedValues().done(function(selectedValues) {
			startFilter.getSelectedValues().done(function(selectedValues) {
				assert.deepEqual(selectedValues, [ 'value1', 'value2'], 'Correct selected value from deserialization returned');
				done();
			});
		});
		
		startFilter.deserialize({
			selectedValues : [ 'value1', 'value2' ]
		});
		
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.callbackArgument);}.bind(this), 1); 
	});
	
	QUnit.module('Reset', {
		beforeEach : function() {
			var deferCallback = true;
			commonSetup(this, deferCallback);
		}
	});
	QUnit.test('Preselection defaults', function(assert) {
		assert.expect(1);
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigMultiPreselectionOnly);
		startFilter.getSelectedValues().done(function(selectedValues) {
			startFilter.setSelectedValues([ 'value2' ]);
			startFilter.setSelectedValues([ 'value1' ]);
			startFilter.reset();
			startFilter.getSelectedValues().done(function(selectedValues) {
				assert.deepEqual(selectedValues, [ 'value1', 'value2', 'value3' ], 'Initial values restored');
			});
		});
	});
	QUnit.test('For initial values the response of the very first value help or resolution request is used', function(assert) {
		assert.expect(1);
		var done = assert.async();
	    var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest);
		this.requestResponseValueHelp = [ {
			AliasForPropertyOne : 'value1'
		}, {
			AliasForPropertyOne : 'value2'
		}, {
			AliasForPropertyOne : 'value3'
		} ];
		startFilter.setSelectedValues([ 'value2' ]);
		startFilter.setSelectedValues([ 'value3' ]);
		startFilter.reset();
		startFilter.getSelectedValues().done(function(selectedValues) {
			assert.deepEqual(selectedValues, [ 'value1' ], 'Value that is determined by very fist derivation logic for selected values');
			done();
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.callbackArgument);}.bind(this), 1); 
	});
	QUnit.module('Buffering of requests', {
		beforeEach : function() {
			commonSetup(this, true);
			this.startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest);
			this.filterForProperty = new Filter(this.msgH);
			this.filterForProperty.stubControl = 'filterResolution';
			this.requestResponsePropertyOne4000 = { 
					data : [ {
						propertyOne: '4000'
					}]
			};
		}
	});
	QUnit.test('Buffering of sequential value help requests', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var testEnv = this;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest);
		startFilter.getValues().done(function(result) {
			startFilter.getValues().done(function(result){
				assert.equal(testEnv.callbacksSendGetInBatch.length, 1, 'No additional request fired');
				assert.deepEqual(result, [{propertyOne: '4000'}], 'Correct value returned');
				done();
			});
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.requestResponsePropertyOne4000);}.bind(this), 8);
	});
	QUnit.test('Buffering of parallel value help requests', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var testEnv = this;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest);
		startFilter.getValues().done(function(result) {
			assert.deepEqual(result, [{propertyOne: '4000'}], 'Correct value returned');
		});
		startFilter.getValues().done(function(result){
			assert.equal(testEnv.callbacksSendGetInBatch.length, 1, 'No additional request fired');
			assert.deepEqual(result, [{propertyOne: '4000'}], 'Correct value returned');
			done();
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.requestResponsePropertyOne4000);}.bind(this), 8);
	});
	QUnit.test('Buffering of sequential filter resolution requests', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var testEnv = this;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithResolutionRequestOnly, this.filterForProperty);
		startFilter.getValues().done(function(result) {
			startFilter.getValues().done(function(result){
				assert.equal(testEnv.callbacksSendGetInBatch.length, 1, 'No additional request fired');
				assert.deepEqual(result, [{propertyOne: '4000'}], 'Correct value returned');
				done();
			});
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.requestResponsePropertyOne4000);}.bind(this), 8);
	});
	QUnit.test('Buffering of parallel filter resolution requests', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var testEnv = this;
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithResolutionRequestOnly, this.filterForProperty);
		startFilter.getValues().done(function(result) {
			assert.deepEqual(result, [{propertyOne: '4000'}], 'Correct value returned');
		});
		startFilter.getValues().done(function(result){
			assert.equal(testEnv.callbacksSendGetInBatch.length, 1, 'No additional request fired');
			assert.deepEqual(result, [{propertyOne: '4000'}], 'Correct value returned');
			done();
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](this.requestResponsePropertyOne4000);}.bind(this), 8);
	});
	QUnit.test('Avoid call by reference in value help while buffering requests when prepending context', function (assert){
		var done = assert.async();
		var testEnv = this;
		this.requestResponseValueHelp = {
				data: [{
					AliasForPropertyOne: '1000'
				}, {
					AliasForPropertyOne: '2000'
				}]
		};
		var expect = [{
			AliasForPropertyOne: 'someValue'
		},{
			AliasForPropertyOne: '1000'
		}, {
			AliasForPropertyOne: '2000'
		}];
		var startFilter = new StartFilter(this.injectCreateRequestSpy, filterConfigWithValueHelpRequest, ['someValue', '1000', '2000']);
		startFilter.getValues().done(function (values, promise){
			var deferredSerialize = startFilter.serialize();
			deferredSerialize.done(function(serializedStartFilter){
				startFilter.deserialize(serializedStartFilter);
				startFilter.getValues().done(function(values){
					startFilter.setRestriction(new Filter(testEnv.msgH, 'A', 'eq' ,'1'));
					setTimeout(function() {testEnv.callbacksSendGetInBatch[1](testEnv.requestResponseValueHelp);}, 1);
					startFilter.getValues().done(function(values){
						assert.deepEqual(values, expect, 'Context is contained in the value list');
						done();
					});
				});
			});
		});
		setTimeout(function() {this.callbacksSendGetInBatch[0](jQuery.extend(true, {} , this.requestResponseValueHelp));}.bind(this), 1);
	});
	QUnit.module("Has value help request");
	QUnit.test("filterConfigWithValueHelpRequest", function (assert){
		commonSetup(this);
		var startFilter = new StartFilter(this.inject, filterConfigWithValueHelpRequest);
		assert.strictEqual(startFilter.hasValueHelpRequest(), true, "filterConfigWithValueHelpRequest has value help request");
	});
	QUnit.test("filterConfigWithoutRequest", function (assert){
		commonSetup(this);
		var startFilter = new StartFilter(this.inject, filterConfigWithoutRequest);
		assert.strictEqual(startFilter.hasValueHelpRequest(), false, "filterConfigWithoutRequest has no value help request");
	});
	QUnit.test("filterConfigWithValueHelpDefaults", function (assert){
		commonSetup(this);
		var startFilter = new StartFilter(this.inject, filterConfigWithValueHelpDefaults);
		assert.strictEqual(startFilter.hasValueHelpRequest(), false, "filterConfigWithValueHelpDefaults has no value help request");
	});
});

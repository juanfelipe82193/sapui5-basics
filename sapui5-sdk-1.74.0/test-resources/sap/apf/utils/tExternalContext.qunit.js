sap.ui.define("sap/apf/utils/tExternalContext", [
	"sap/apf/utils/externalContext",
	"sap/apf/core/messageHandler",
	"sap/apf/core/messageDefinition",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/core/constants",
	"sap/apf/core/utils/filter",
	"sap/apf/testhelper/ushellHelper"
], function(ExternalContext, MessageHandler, MessageDefinition, DoubleMessageHandler, constants, Filter, ushellHelper){
	'use strict';
	function commonSetup(testEnv, evaluationId, xAppState, smartBusinessConfig, messageHandler) {
		testEnv.messageHandler = messageHandler || new DoubleMessageHandler().doubleCheckAndMessaging().spyPutMessage();
		testEnv.inject = {
			instances: {
				startParameter : {
					getEvaluationId : function() {
						return evaluationId;
					},
					getXappStateId : function() {
						return xAppState;
					}
				},
				component : {
					compName : 'componentName'
				},
				messageHandler : testEnv.messageHandler
			},
			functions : {
				ajax : function(conf) { return jQuery.ajax(conf); },
				getConfigurationProperties : function() {
					var deferred = jQuery.Deferred();
					if (smartBusinessConfig) {
						deferred.resolve(smartBusinessConfig);
					}else{
						deferred.resolve({
							smartBusiness : {
								'runtime' : {
									'service' : 'sbService'
								}
							}
						});
					}
					return deferred;
				}
			}
		};
	}
	QUnit.module('SmartBusiness Evaluation', {
		beforeEach : function() {
			commonSetup(this, 'evaluationId4711');
			this.ajaxStub = sinon.stub(jQuery, 'ajax');
		},
		afterEach : function() {
			this.ajaxStub.restore();
		}
	});
	QUnit.test('SmartBusiness request URL', function(assert) {
		new ExternalContext(this.inject).getCombinedContext();
		assert.equal(this.ajaxStub.getCall(0).args[0].url, "sbService/EVALUATIONS('evaluationId4711')/FILTERS?$format=json", 'Ajax called with correct url');
	});
	QUnit.test('getCombinedContext() when no evaluation ID exists', function(assert) {
		assert.expect(2);
		this.inject.instances.startParameter.getEvaluationId = function() {
			return undefined;
		};
		var externalContext = new ExternalContext(this.inject);
		assert.ok(!this.ajaxStub.called, 'No request expected');
		externalContext.getCombinedContext().done(function(internalFilter) {
			assert.equal(internalFilter.toUrlParam(), '', 'Empty filter expected');
		});
	});
	QUnit.test('getCombinedContext() when response contains EQs only', function(assert) {
		assert.expect(1);
		this.ajaxStub.yieldsTo('success', {
			d : {
				results : [ {
					'NAME' : 'Property1',
					'VALUE_1' : 'Alexander Marcus',
					'OPERATOR' : 'EQ',
					'VALUE_2' : ''
				}, {
					'NAME' : 'Property1',
					'VALUE_1' : 'James Last',
					'OPERATOR' : 'EQ',
					'VALUE_2' : ''
				}, {
					'NAME' : 'Property1',
					'VALUE_1' : 'Herb Alpert',
					'OPERATOR' : 'EQ',
					'VALUE_2' : ''
				}, {
					'NAME' : 'Property2',
					'VALUE_1' : 'Karel Gott',
					'OPERATOR' : 'EQ',
					'VALUE_2' : ''
				} ]
			}
		});
		var expectedFilterTerms = '(((Property1%20eq%20%27Alexander%20Marcus%27)%20or%20(Property1%20eq%20%27James%20Last%27)%20or%20(Property1%20eq%20%27Herb%20Alpert%27))%20and%20(Property2%20eq%20%27Karel%20Gott%27))';
		var externalContext = new ExternalContext(this.inject);
		externalContext.getCombinedContext().done(function(internalFilter) {
			assert.equal(internalFilter.toUrlParam(), expectedFilterTerms, 'Correct internal filter returned');
		});
	});
	QUnit.test('getCombinedContext() when response contains EQs only on 1 propert', function(assert) {
		assert.expect(1);
		var that = this;
		this.ajaxStub.yieldsTo('success', {
			d : {
				results : [ {
					'NAME' : 'Property1',
					'VALUE_1' : 'Alexander Marcus',
					'OPERATOR' : 'EQ',
					'VALUE_2' : ''
				}, {
					'NAME' : 'Property1',
					'VALUE_1' : 'James Last',
					'OPERATOR' : 'EQ',
					'VALUE_2' : ''
				}, {
					'NAME' : 'Property1',
					'VALUE_1' : 'Herb Alpert',
					'OPERATOR' : 'EQ',
					'VALUE_2' : ''
				} ]
			}
		});
		var expectedFilterTerms = '(((Property1%20eq%20%27Alexander%20Marcus%27)%20or%20(Property1%20eq%20%27James%20Last%27)%20or%20(Property1%20eq%20%27Herb%20Alpert%27))%20and%20(Property1%20eq%20%27Song%20Sing%27))';
		var externalContext = new ExternalContext(this.inject);
		externalContext.getCombinedContext().done(function(internalFilter) {
			internalFilter.addAnd(new Filter(that.messageHandler, 'Property1', 'EQ', 'Song Sing'));
			assert.equal(internalFilter.toUrlParam(), expectedFilterTerms, 'Correct internal filter returned');
		});
	});
	QUnit.test('getCombinedContext() when response contains BTs only',function(assert) {
		assert.expect(1);
		this.ajaxStub.yieldsTo('success', {
			d : {
				results : [ {
					'NAME' : 'Property1',
					'VALUE_1' : '2000',
					'OPERATOR' : 'BT',
					'VALUE_2' : '5000'
				}, {
					'NAME' : 'Property1',
					'VALUE_1' : '6000',
					'OPERATOR' : 'BT',
					'VALUE_2' : '7000'
				}, {
					'NAME' : 'Property2',
					'VALUE_1' : '100',
					'OPERATOR' : 'BT',
					'VALUE_2' : '900'
				} ]
			}
		});
		var expectedFilterTerms = '((((Property1%20ge%20%272000%27)%20and%20(Property1%20le%20%275000%27))%20or%20((Property1%20ge%20%276000%27)%20and%20(Property1%20le%20%277000%27)))%20and%20((Property2%20ge%20%27100%27)%20and%20(Property2%20le%20%27900%27)))';
		var externalContext = new ExternalContext(this.inject);
		externalContext.getCombinedContext().done(function(internalFilter) {
			assert.equal(internalFilter.toUrlParam(), expectedFilterTerms, 'Correct internal filter returned');
		});
	});
	QUnit.test('getCombinedContext() when response contains BTs and EQs',function(assert) {
		assert.expect(1);
		this.ajaxStub.yieldsTo('success', {
			d : {
				results : [ {
					'NAME' : 'Property1',
					'VALUE_1' : '1000',
					'OPERATOR' : 'BT',
					'VALUE_2' : '9000'
				}, {
					'NAME' : 'Property2',
					'VALUE_1' : 'James Last',
					'OPERATOR' : 'EQ',
					'VALUE_2' : ''
				}, {
					'NAME' : 'Property2',
					'VALUE_1' : 'Herb Alpert',
					'OPERATOR' : 'EQ',
					'VALUE_2' : ''
				}, {
					'NAME' : 'Property1',
					'VALUE_1' : '100',
					'OPERATOR' : 'BT',
					'VALUE_2' : '500'
				} ]
			}
		});
		var expectedFilterTerms = '((((Property1%20ge%20%271000%27)%20and%20(Property1%20le%20%279000%27))%20or%20((Property1%20ge%20%27100%27)%20and%20(Property1%20le%20%27500%27)))%20and%20((Property2%20eq%20%27James%20Last%27)%20or%20(Property2%20eq%20%27Herb%20Alpert%27)))';
		var externalContext = new ExternalContext(this.inject);
		externalContext.getCombinedContext().done(function(internalFilter) {
			assert.equal(internalFilter.toUrlParam(), expectedFilterTerms, 'Correct internal filter returned');
		});
	});

	QUnit.module('Error Handling SmartBusiness Evaluation', {
		beforeEach : function() {
			this.messageHandler = new MessageHandler();
			this.messageHandler.activateOnErrorHandling(true);
			this.messageHandler.loadConfig(MessageDefinition, true);
			this.ajaxStub = sinon.stub(jQuery, 'ajax');
		},
		afterEach : function() {
			this.ajaxStub.restore();
		}
	});

	QUnit.test('WHEN Error response when reading external context', function(assert){

		commonSetup(this, 'evaluationId4711', undefined, undefined, this.messageHandler);
		var assertMessageWasPut5043 = function(messageObject) {
			assert.equal(messageObject.getPrevious().getCode(), "5043", "THEN fatal message 5043 was put");
			assert.deepEqual(messageObject.getPrevious().getParameters(), [ "evaluationId4711", "errorText"], "THEN the correct message parameters are supplied");
		};
		this.messageHandler.setMessageCallback(assertMessageWasPut5043);
		this.ajaxStub.yieldsTo('error', {}, "errorText");
		var externalContext = new ExternalContext(this.inject);
		assert.throws(function() {
			externalContext.getCombinedContext();
		}, Error, "throws fatal error");

	});

	QUnit.test('WHEN configuration of the smart business service is missing', function(assert){
		commonSetup(this, 'evaluationId4711', undefined, "nothing", this.messageHandler);

		var assertMessageWasPut5044 = function(messageObject) {
			assert.equal(messageObject.getPrevious().getCode(), "5044", "THEN fatal message 5043 was put");
			assert.deepEqual(messageObject.getPrevious().getParameters(), [ "evaluationId4711"], "THEN the correct message parameters are supplied");
		};
		this.messageHandler.setMessageCallback(assertMessageWasPut5044);
		var externalContext = new ExternalContext(this.inject);
		assert.throws(function() {
			externalContext.getCombinedContext();
		}, Error, "throws fatal error");
	});

	QUnit.module('x-app-state with sapApfCumulativeFilter', {
		beforeEach : function() {
			commonSetup(this, undefined, 'someXAppStateGuid');
			ushellHelper.setup();
			ushellHelper.setApfCumulativeFilter({
				bAnd : true,
				aFilters : [ {
					sOperator : 'EQ',
					sPath : 'PropertyOne',
					oValue1 : 'ValueA'
				}, {
					sOperator : 'EQ',
					sPath : 'PropertyTwo',
					oValue1 : 'ValueB'
				} ]
			});
		},
		afterEach : function() {
			ushellHelper.teardown();
		}
	});
	QUnit.test('getCombinedContext() from x-app-state "sapApfCumulativeFilter"-property', function(assert) {
		assert.expect(3);
		var expectedFilterTerms = '((PropertyOne%20eq%20%27ValueA%27)%20and%20(PropertyTwo%20eq%20%27ValueB%27))';
		var externalContext = new ExternalContext(this.inject);
		externalContext.getCombinedContext().done(function(internalFilter) {
			assert.equal(ushellHelper.spys.getAppState.key, 'someXAppStateGuid', 'UShell getAppState() called with correct x-app-state key');
			assert.deepEqual(ushellHelper.spys.getAppState.component, {
				compName : 'componentName'
			}, 'UShell getAppState() called with correct component instance');
			assert.equal(internalFilter.toUrlParam(), expectedFilterTerms, 'Correct internal filter returned');
		});
	});
	QUnit.test('getCombinedContext() returns empty filter if the two supported properties are undefined', function(assert) {
		assert.expect(1);
		ushellHelper.setApfCumulativeFilter(undefined);
		ushellHelper.setSelectionVariant(undefined);
		var externalContext = new ExternalContext(this.inject);
		externalContext.getCombinedContext().done(function(internalFilter) {
			assert.equal(internalFilter.toUrlParam(), "", 'Empty internal filter returned');
		});
	});
	QUnit.module('x-app-state with sapApfCumulativeFilter OR-Concatenated Terms on Top Level', {
		beforeEach : function() {
			commonSetup(this, undefined, 'someXAppStateGuid');
			ushellHelper.setup();
			ushellHelper.setApfCumulativeFilter({
				bAnd : false,
				aFilters : [ {
					sOperator : 'EQ',
					sPath : 'PropertyOne',
					oValue1 : 'ValueA'
				}, {
					sOperator : 'EQ',
					sPath : 'PropertyOne',
					oValue1 : 'ValueB'
				} ]
			});
		},
		afterEach : function() {
			ushellHelper.teardown();
		}
	});
	QUnit.test('getCombinedContext() from x-app-state "sapApfCumulativeFilter"-property with OR-concated filter', function(assert) {
		assert.expect(1);
		var that = this;
		var expectedFilterTerms = "(((PropertyOne%20eq%20%27ValueA%27)%20or%20(PropertyOne%20eq%20%27ValueB%27))%20and%20(PropertyOne%20eq%20%27ValueC%27))";
		var externalContext = new ExternalContext(this.inject);
		externalContext.getCombinedContext().done(function(internalFilter) {
			internalFilter.addAnd(new Filter(that.messageHandler, "PropertyOne", "EQ", "ValueC"));
			assert.equal(internalFilter.toUrlParam(), expectedFilterTerms, 'Correct internal filter returned');
		});
	});
	QUnit.module("Failure in resolving x-app-state", {
		beforeEach : function(assert) {
			this.messageHandler = new MessageHandler();
			this.messageHandler.activateOnErrorHandling(true);
			this.messageHandler.loadConfig(MessageDefinition, true);

			this.inject = {
					instances: {
						startParameter : {
							getEvaluationId : function() {
								return undefined;
							},
							getXappStateId : function() {
								return "someXAppStateGuid";
							}
						},
						component : {
							compName : 'componentName'
						},
						messageHandler : this.messageHandler
					},
					functions : {
						ajax : function(conf) { return jQuery.ajax(conf); },
						getConfigurationProperties : function() {
							return {
								smartBusiness : {
									'runtime' : {
										'service' : 'sbService'
									}
								}
							};
						}
					}
			};
			var getAppState = function() {
				var deferred = jQuery.Deferred();
				deferred.reject();
				return deferred.promise();	
			};
			ushellHelper.setup({ functions : { getAppState : getAppState }});
		},
		afterEach : function() {
			ushellHelper.teardown();
		}
	});
	QUnit.test("WHEN x-app-state is resolved and the promise is rejected", function(assert){
		var externalContext = new ExternalContext(this.inject);
		var assertFatalMessage5045 = function(messageObject) {
			assert.equal(messageObject.getPrevious().getCode(), "5045", "THEN correct message has been put");
			assert.equal(messageObject.getPrevious().getParameters()[0], "someXAppStateGuid", "THEN x-app-state-id has been supplied as parameter");
		};
		this.messageHandler.setMessageCallback(assertFatalMessage5045);
		assert.throws(function() {
			externalContext.getCombinedContext();
		}, Error, "throws fatal error");
	});
	QUnit.module('x-app-state with selectionVariant', {
		beforeEach : function() {
			commonSetup(this, undefined, 'someXAppStateGuid');
			ushellHelper.setup();
			ushellHelper.setSelectionVariant({
					Parameters: [{
						PropertyName: 'A',
						PropertyValue: '1'
					}],
					SelectOptions: [{
					PropertyName: 'B',
						Ranges: [{
							Sign: 'I',
							Option: 'EQ',
							Low: '1'
							}]
						},
					{
						PropertyName: 'B',
						Ranges: [{
							Sign: 'I',
							Option: 'BT',
							Low: '3',
							High: '4'
							}]
						}
				] });
			ushellHelper.setApfCumulativeFilter(undefined);
		},
		afterEach : function() {
			ushellHelper.teardown();
		}
	});
	QUnit.test('getCombinedContext() from x-app-state "sapApfCumulativeFilter"-property', function(assert) {
		assert.expect(3);
		var externalContext = new ExternalContext(this.inject);
		externalContext.getCombinedContext().done(function(internalFilter) {
			assert.strictEqual(internalFilter.isOr(), false, 'correct internal filter - is And Node');
			assert.strictEqual(internalFilter.getFilterTerms().length, 3, 'Correct internal filter - 3 FilterTerms');
			assert.strictEqual(internalFilter.getProperties().length, 2, 'Correct internal filter - 2 Property Names');
		});
	});
	QUnit.module('Selection Variant', {
		beforeEach : function () {
			this.messageHandler = new MessageHandler();
			this.messageHandler.activateOnErrorHandling(true);
			this.messageHandler.loadConfig(MessageDefinition, true);
			this.inject = {
					instances : {
						startParameter : {
							getEvaluationId : function() {
								return undefined;
							},
							getXappStateId : function() {
								return "xAppState99";
							}
						},
						component : {
							compName : 'componentName'
						},
						messageHandler : this.messageHandler
					},
					functions : {
						ajax : function(conf) { return jQuery.ajax(conf); }
					}
				};
			this.externalContext = new ExternalContext(this.inject);
			this.convertParameterObjectSpy = sinon.spy(this.externalContext, 'convertParameterObject');
			this.convertRangeSpy = sinon.spy(this.externalContext, 'convertRange');
			this.convertSelectOptionSpy = sinon.spy(this.externalContext, 'convertSelectOption');
			this.spyPutMessage = sinon.spy(this.messageHandler, 'putMessage');
		}
	});
	QUnit.test('convertSelectionVariantToFilter() - convert undefined', function (assert){
		var result = this.externalContext.convertSelectionVariantToFilter(undefined);

		assert.strictEqual(result.isEmpty(), true, 'Empty Filter');
	});
	QUnit.test('convertSelectionVariantToFilter() - convert top members', function (assert){
		var filter = {
			Parameters: [],
			SelectOptions: []
		};

		var result = this.externalContext.convertSelectionVariantToFilter(filter);

		assert.strictEqual(result.isEmpty(), true, 'Empty Filter');
	});
	QUnit.test('convertSelectionVariantToFilter() - convert invalid top members', function (assert){
		var filter = {
			Parameters: 1,
			SelectOptions: {}
		};

		var result = this.externalContext.convertSelectionVariantToFilter(filter);

		assert.strictEqual(result.isEmpty(), true, 'Empty Filter');
	});
	QUnit.test('convertSelectionVariantToFilter() - convert invalid Parameters - no property name - with valid SelectOptions', function (assert){
		var filter = {
			Parameters: [{
				PropertyName: undefined,
				PropertyValue: 2
			}],
			SelectOptions: [{
			PropertyName: 'A',
				Ranges: [{
					Sign: 'I',
					Option: 'EQ',
					Low: '1'
					}]
				},
			{
				PropertyName: 'B',
				Ranges: [{
					Sign: 'I',
					Option: 'EQ',
					Low: '42'
					}]
				}
		] };

		assert.throws(function(){
			this.externalContext.convertSelectionVariantToFilter(filter);
		});

		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5046, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99"], "THEN expected parameters");
	});
	QUnit.test('convertSelectionVariantToFilter() - convert invalid Parameters - no property value - with valid SelectOptions', function (assert){
		var filter = {
			Parameters: [{
				PropertyName: "propertyName"
			}],
			SelectOptions: [{
			PropertyName: 'A',
				Ranges: [{
					Sign: 'I',
					Option: 'EQ',
					Low: '1'
					}]
				},
			{
				PropertyName: 'B',
				Ranges: [{
					Sign: 'I',
					Option: 'EQ',
					Low: '42'
					}]
				}
		] };

		assert.throws(function(){
			this.externalContext.convertSelectionVariantToFilter(filter);
		});

		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5047, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", "propertyName"], "THEN expected parameters");
	});
	QUnit.test('convertSelectionVariantToFilter() - convert invalid SelectOptions with valid Parameters', function (assert){
		var filter = {
			Parameters: [{
				PropertyName: 'A',
				PropertyValue: '1'
			}],
			SelectOptions: [{
			PropertyName: 'A',
				Ranges: [{
					Sign: 'I',
					Option: 'EQ',
					Low: '1'
					}]
				},
			{
				PropertyName: 'B',
				Ranges: [{
					Sign: 'hugo',
					Option: 'EQ',
					Low: '42'
					}]
				}
		] };

		assert.throws(function() {
			this.externalContext.convertSelectionVariantToFilter(filter);
		});	
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5050, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", "B"], "THEN expected parameters");
	});
	QUnit.test('convertParameterObject() - convert one valid parameter object', function (assert){
		var parameterObject = {
			PropertyName: 'A',
			PropertyValue: '1'
		};

		var result = this.externalContext.convertParameterObject(parameterObject);

		assert.strictEqual(this.convertParameterObjectSpy.callCount, 1, 'convertParameterObject called once');
		assert.strictEqual(result.mapToSapUI5FilterExpression().sOperator, constants.FilterOperators.EQ, 'EQ');
		assert.strictEqual(result.mapToSapUI5FilterExpression().sPath, 'A', 'property name');
		assert.strictEqual(result.mapToSapUI5FilterExpression().oValue1, '1', 'value');
	});
	QUnit.test('convertSelectionVariantToFilter() - convert one valid parameter', function (assert){
		var filter = {
			Parameters: [{
				PropertyName: 'A',
				PropertyValue: '1'
			}],
			SelectOptions: []
		};

		this.externalContext.convertSelectionVariantToFilter(filter);

		assert.strictEqual(this.convertParameterObjectSpy.callCount, 1, 'convertParameterObject called once');
	});
	QUnit.test('convertSelectionVariantToFilter() - convert two valid parameters', function (assert){
		var filter = {
			Parameters: [{
				PropertyName: 'A',
				PropertyValue: '1'
			},{
				PropertyName: 'A',
				PropertyValue: '2'
			}],
			SelectOptions: []
		};

		var result = this.externalContext.convertSelectionVariantToFilter(filter);

		assert.strictEqual(this.convertParameterObjectSpy.callCount, 2, '# convertParameterObject called ');
		assert.strictEqual(result.mapToSapUI5FilterExpression().aFilters.length, 2, 'Two filters');
	});
	QUnit.test('convertRange() - invalid sign', function (assert){
		var range = {
				Sign: 'hugo',
				Option: 'EQ',
				Low: '1'
		};

		assert.throws(function() {
			this.externalContext.convertRange(range, 'A');
		});
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5050, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", 'A'], "THEN expected parameters");
	});
	QUnit.test('convertRange() - invalid range for BT by missing High value', function (assert){
		var range = {
				Sign: 'I',
				Option: 'BT',
				Low: '1'
		};

		assert.throws(function() {
			this.externalContext.convertRange(range, 'A');
		});
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5051, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", 'A'], "THEN expected parameters");
	});
	QUnit.test('convertRange() - invalid range for BT by High === null', function (assert){
		var range = {
				Sign: 'I',
				Option: 'BT',
				Low: '1',
				High: null
		};

		assert.throws(function() {
			this.externalContext.convertRange(range, 'A');
		});
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5051, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", 'A'], "THEN expected parameters");
	});
	QUnit.test('convertRange() - valid A=1', function (assert){
		var range = {
				Sign: 'I',
				Option: 'EQ',
				Low: '1'
		};

		var result = this.externalContext.convertRange(range, 'A');

		assert.strictEqual(result.mapToSapUI5FilterExpression().sOperator, constants.FilterOperators.EQ, 'EQ');
		assert.strictEqual(result.mapToSapUI5FilterExpression().sPath, 'A', 'property name');
		assert.strictEqual(result.mapToSapUI5FilterExpression().oValue1, '1', 'value');
	});
	QUnit.test('convertRange() - valid BT A=-1..0', function (assert){
		var range = {
				Sign: 'I',
				Option: 'BT',
				Low: -1,
				High: 0
		};

		var result = this.externalContext.convertRange(range, 'A');

		assert.strictEqual(result.mapToSapUI5FilterExpression().sOperator, constants.FilterOperators.BT, 'BT');
		assert.strictEqual(result.mapToSapUI5FilterExpression().sPath, 'A', 'property name');
		assert.strictEqual(result.mapToSapUI5FilterExpression().oValue1, -1, 'value');
		assert.strictEqual(result.mapToSapUI5FilterExpression().oValue2, 0, 'value');
	});
	QUnit.test('convertRange() - valid A CP *A', function (assert){
		var range = {
			Sign: 'I',
			Option: 'CP',
			Low: '*A'
		};

		var resultFilterTerm = this.externalContext.convertRange(range, 'A');

		assert.equal(resultFilterTerm.getOp(), "EndsWith", "THEN converted to EndsWith");
		assert.equal(resultFilterTerm.getValue(), "A", "THEN value as expected");
	});
	QUnit.test('convertRange() - invalid A CP *A*B*', function (assert){
		var range = {
			Sign: 'I',
			Option: 'CP',
			Low: '*A*B*'
		};

		assert.throws(function() {
			this.externalContext.convertRange(range, 'A');
		});
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5069, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", 'A'], "THEN expected parameters");
	});
	QUnit.test('convertRange() - valid A CP *A*', function (assert){
		var range = {
			Sign: 'I',
			Option: 'CP',
			Low: '*A*'
		};

		var resultFilterTerm = this.externalContext.convertRange(range, 'A');

		assert.equal(resultFilterTerm.getOp(), "Contains", "THEN converted to Contains");
		assert.equal(resultFilterTerm.getValue(), "A", "THEN value as expected");
	});
	QUnit.test('convertRange() - valid A CP A*', function (assert){
		var range = {
			Sign: 'I',
			Option: 'CP',
			Low: 'A*'
		};

		var resultFilterTerm = this.externalContext.convertRange(range, 'A');

		assert.equal(resultFilterTerm.getOp(), "StartsWith", "THEN converted to StartsWith");
		assert.equal(resultFilterTerm.getValue(), "A", "THEN value as expected");
	});
	QUnit.test('convertRange() - invalid A CP A+', function (assert){
		var range = {
			Sign: 'I',
			Option: 'CP',
			Low: 'A+'
		};

		assert.throws(function() {
			this.externalContext.convertRange(range, 'A');
		});
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5069, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", 'A'], "THEN expected parameters");
	});
	QUnit.test('convertRange() - invalid A CP A', function (assert){
		var range = {
			Sign: 'I',
			Option: 'CP',
			Low: 'A'
		};

		assert.throws(function() {
			this.externalContext.convertRange(range, 'A');
		});
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5069, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", 'A'], "THEN expected parameters");
	});
	QUnit.test('convertSelectOption() - invalid input missing propertyName', function (assert){
		var selectOption = {
				PropertyName: undefined,
				Ranges:[]
		};

		assert.throws(function() {
			this.externalContext.convertSelectOption(selectOption);
		});
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5048, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99"], "THEN expected parameters");
	});
	QUnit.test('convertSelectOption() - invalid input missing ranges', function (assert){
		var selectOption = {
				PropertyName: 'A',
				Ranges: undefined
		};

		assert.throws(function() {
			this.externalContext.convertSelectOption(selectOption);
		});
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5049, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", 'A'], "THEN expected parameters");
	});
	QUnit.test('convertSelectOption() - invalid input Ranges is not an array', function (assert){
		var selectOption = {
				PropertyName: 'A',
				Ranges: {}
		};

		assert.throws(function() {
			this.externalContext.convertSelectOption(selectOption);
		});
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5049, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", 'A'], "THEN expected parameters");
	});
	QUnit.test('convertSelectOption() - invalid input valid+invalid Range', function (assert){
		var selectOption = {
				PropertyName: 'A',
				Ranges:[{
					Sign: 'I',
					Option: 'EQ',
					Low: '1'
				},{
					Sign: 'hugo',
					Option: 'EQ',
					Low: '2'
				}]
		};

		assert.throws(function() {
			this.externalContext.convertSelectOption(selectOption);
		});
		var messageCode = this.spyPutMessage.args[0][0].getCode();
		assert.equal(messageCode, 5050, "THEN expected message code");
		var parameters = this.spyPutMessage.args[0][0].getParameters();
		assert.deepEqual(parameters, ["xAppState99", "A"], "THEN expected parameters");
	});
	QUnit.test('convertSelectOption() - empty Ranges Array', function (assert){
		var selectOption = {
				PropertyName: 'A',
				Ranges: []
		};

		var result = this.externalContext.convertSelectOption(selectOption);

		assert.strictEqual(result.isEmpty(), true, 'then empty filter');
	});
	QUnit.test('convertSelectOption() - Ranges Array with 1 Range', function (assert){
		var selectOption = {
				PropertyName: 'A',
				Ranges: [{
					Sign: 'I',
					Option: 'EQ',
					Low: '1'
				}]
		};

		this.externalContext.convertSelectOption(selectOption);

		assert.strictEqual(this.convertRangeSpy.callCount, 1, 'then convertRange called once');
	});
	QUnit.test('convertSelectOption() - Ranges Array with 2 RangeObjects', function (assert){
		var selectOption = {
				PropertyName: 'A',
				Ranges: [{
					Sign: 'I',
					Option: 'EQ',
					Low: '1'
				},{
					Sign: 'I',
					Option: 'EQ',
					Low: '2'
				}]
		};

		var result = this.externalContext.convertSelectOption(selectOption);

		assert.strictEqual(this.convertRangeSpy.callCount, 2, 'then convertRange called twice');
		assert.strictEqual(result.isOr(), true, 'is Or Node');
		assert.strictEqual(result.getFilterTerms().length, 2, '2 Equations');
	});
	QUnit.test('convertSelectionVariantToFilter() - 2 SelectOptions', function (assert){
		var selectOptions = [{
			PropertyName: 'A',
				Ranges: [{
					Sign: 'I',
					Option: 'EQ',
					Low: '1'
					}]
				},
			{
				PropertyName: 'B',
				Ranges: [{
					Sign: 'I',
					Option: 'EQ',
					Low: '42'
					}]
				}
		];
		var externalFilter = {
				SelectOptions: selectOptions
		};

		var result = this.externalContext.convertSelectionVariantToFilter(externalFilter);

		assert.strictEqual(this.convertSelectOptionSpy.callCount, 2, 'then convertSelectOptionSpy called twice');
		assert.strictEqual(result.isOr(), false, 'is And Node');
		assert.strictEqual(result.getFilterTerms().length, 2, '2 Equations');
		assert.strictEqual(result.getProperties().length, 2, '2 Property Names');
	});
});

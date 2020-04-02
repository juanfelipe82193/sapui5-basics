sap.ui.define([
               'sap/apf/core/readRequestByRequiredFilter'
               ], function(ReadRequestByRequiredFilter){
	'use strict';

jQuery.sap.declare("test.sap.apf.tReadRequestByRequiredFilterWithDouble");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfMessageHandler");
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filterTerm");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.configurationFactory");
jQuery.sap.require("sap.apf.core.readRequestByRequiredFilter");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.ui.representations.lineChart");
jQuery.sap.require("sap.apf.ui.representations.columnChart");
jQuery.sap.require("sap.apf.ui.representations.scatterPlotChart");
jQuery.sap.require("sap.apf.ui.representations.table");
jQuery.sap.require("sap.apf.ui.representations.stackedColumnChart");
jQuery.sap.require("sap.apf.ui.representations.pieChart");
jQuery.sap.require("sap.apf.ui.representations.percentageStackedColumnChart");
jQuery.sap.require('sap.apf.ui.representations.bubbleChart');

(function() {
	'use strict';

	QUnit.module('Read request with required filters and parameter entity set key properties', {
		beforeEach : function(assert) {
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = function(oInject, oConfig) {
				var entityType = oConfig.entityType;
				var oLastFilterUsed;
				this.type = oConfig.type;
				this.sendGetInBatch = function(oFilter, fnCallback) {
					oLastFilterUsed = oFilter;
					oInject.instances.coreApi.getMetadata(oConfig.service).done(function(oMetadata){
						var aTestData = sap.apf.testhelper.odata.getSampleServiceData(entityType).data;
						fnCallback({
							data : aTestData,
							metadata : oMetadata
						}, false);
					});
				};
				this.getLastFilterUsed = function() {
					return oLastFilterUsed;
				};
			};
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.oInject = {
				instances: {
					messageHandler : this.oMessageHandler,
					coreApi : new sap.apf.testhelper.doubles.CoreApi({
						instances : {
							messageHandler : this.oMessageHandler
						}
					}).doubleCumulativeFilter()
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.oInject.instances.coreApi.getMetadata = (function(oInject) {
				var oMetadata;
				return function(sService) {
					if (oMetadata) {
						return sap.apf.utils.createPromise(oMetadata);
					}
					oMetadata = new sap.apf.testhelper.doubles.Metadata(oInject, sService);
					oMetadata.addFilterRequiredAnnotations('EntityType1', [ "SAPClient" ]);
					oMetadata.addParameters('EntityType1', [ {
						'name' : 'CompanyCode',
						'nullable' : 'false',
						'dataType' : {
							'type' : 'Edm.String',
							'defaultValue' : null
						},
						'parameter' : 'mandatory'
					} ]);
					return sap.apf.utils.createPromise(oMetadata);
				};
			}(this.oInject));
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory(this.oInject);
			this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration());
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test("Basic send with a not required filter expression in the context", function(assert) {
		assert.expect(2);
		this.assertRequestIsOk = function(oDataResponse, oMetadata) {
			assert.ok(true, 'Callback was called');
		};
		var oRequestConfiguration = {
			type : "request",
			id : '4711',
			service : "dummy.xsodata",
			entityType : "EntityType1",
			selectProperties : []
		};
		var oContextFilter = new sap.apf.utils.Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'SAPClient', // Required filter
			operator : "eq",
			value : '777'
		}).addExpression({
			name : 'Customer', // Selection to be removed (not required and no parameter key property) although field of the entity type
			operator : "eq",
			value : '1001'
		});
		var oFilter = new sap.apf.utils.Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'CompanyCode', // parameter key property
			operator : "eq",
			value : "1000"
		});
		this.oInject.instances.coreApi.setCumulativeFilter(oContextFilter.getInternalFilter());
		var oRequest = this.oConfigurationFactory.createRequest(oRequestConfiguration);
		var oReadRequestByRequiredFilter = new ReadRequestByRequiredFilter(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequestByRequiredFilter.send(oFilter, this.assertRequestIsOk);
		assert.deepEqual(oRequest.getLastFilterUsed().getProperties(), [ "CompanyCode", "SAPClient" ], 'The request used only selections for mandatory fields from the context filter object. Irrelevant selections were eliminated');
	});
	QUnit.test("Basic send with a not required filter expression in the request filter", function(assert) {
		assert.expect(2);
		this.assertRequestIsOk = function(oDataResponse, oMetadata) {
			assert.ok(true, 'Callback was called');
		};
		var oRequestConfiguration = {
			type : "request",
			id : '4711',
			service : "dummy.xsodata",
			entityType : "EntityType1",
			selectProperties : []
		};
		var oContextFilter = new sap.apf.utils.Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'SAPClient', // Required filter
			operator : "eq",
			value : '777'
		});
		var oFilter = new sap.apf.utils.Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'CompanyCode', // parameter key property
			operator : "eq",
			value : "1000"
		}).addExpression({
			name : 'Customer', // Selection to be executed (although not required and no parameter key property)  
			operator : "eq",
			value : '1001'
		});
		this.oInject.instances.coreApi.setCumulativeFilter(oContextFilter.getInternalFilter());
		var oRequest = this.oConfigurationFactory.createRequest(oRequestConfiguration);
		var oReadRequestByRequiredFilter = new ReadRequestByRequiredFilter(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequestByRequiredFilter.send(oFilter, this.assertRequestIsOk);
		assert.deepEqual(oRequest.getLastFilterUsed().getProperties(), [ "CompanyCode", "Customer", "SAPClient" ], 'The request used alls selections from the request filter object');
	});
	QUnit.test("Basic send without filter", function(assert) {
		assert.expect(2);
		this.assertRequestIsOk = function(oDataResponse, oMetadata) {
			assert.ok(true, 'Callback was called');
		};
		var oRequestConfiguration = {
			type : "request",
			id : '4711',
			service : "dummy.xsodata",
			entityType : "EntityType1",
			selectProperties : []
		};
		var oContextFilter = new sap.apf.utils.Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'SAPClient', // Required filter
			operator : "eq",
			value : '777'
		});
		this.oInject.instances.coreApi.setCumulativeFilter(oContextFilter.getInternalFilter());
		var oRequest = this.oConfigurationFactory.createRequest(oRequestConfiguration);
		var oReadRequestByRequiredFilter = new ReadRequestByRequiredFilter(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequestByRequiredFilter.send(undefined, this.assertRequestIsOk);
		assert.deepEqual(oRequest.getLastFilterUsed().getProperties(), ["SAPClient"], 'The request used just the ContextFilter');
	});
	QUnit.test("Basic send without request ID", function(assert) {
		assert.expect(2);
		var oRequestConfiguration = {
			type : "request",
			service : "dummy.xsodata",
			entityType : "EntityType1",
			selectProperties : []
		};
		var oContextFilter = new sap.apf.utils.Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'SAPClient', // Required filter
			operator : "eq",
			value : '777'
		}).addExpression({
			name : 'Customer', // Selection to be removed (not required and no parameter key property) although field of the entity type
			operator : "eq",
			value : '1001'
		});
		var oFilter = new sap.apf.utils.Filter(this.oInject.instances.messageHandler).getTopAnd().addExpression({
			name : 'CompanyCode', // parameter key property
			operator : "eq",
			value : "1000"
		});
		this.oInject.instances.coreApi.setCumulativeFilter(oContextFilter.getInternalFilter());
		var oRequest = this.oConfigurationFactory.createRequest(oRequestConfiguration);
		assert.deepEqual(oRequest, undefined, 'The request is undefined as it does not have a request ID');
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5004", "Error Code 5004 expected");
	});
}());
});
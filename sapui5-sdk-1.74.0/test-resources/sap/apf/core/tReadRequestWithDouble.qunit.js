jQuery.sap.declare("test.sap.apf.tReadRequestWithDouble");

jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.coreApi");
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
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
jQuery.sap.require("sap.apf.core.readRequest");
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

	QUnit.module('Create Request and send', {
		beforeEach : function(assert) {
			this.fnMetadata = sap.apf.core.Metadata;
			sap.apf.core.Metadata = sap.apf.testhelper.doubles.Metadata;
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			var oResourcePathHandler, oConfigurationFactory;
			var oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oMessageHandler = oMessageHandler;
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : oMessageHandler
				}
			});

			this.oInject = {
				instances : {
					messageHandler : oMessageHandler,
					coreApi : this.oCoreApi
				},
				constructors: {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.oCoreApi.getResourceLocation = function(sId) {
				return oResourcePathHandler.getResourceLocation(sId);
			};
			this.oCoreApi.loadMessageConfiguration = function(aMessages) {
			};
			this.oCoreApi.loadAnalyticalConfiguration = function(oConfig) {
				oConfigurationFactory.loadAnalyticalConfiguration(oConfig);
			};
			this.oCoreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			this.oCoreApi.getMetadataFacade = function(serviceDoc) {
				return {
					serviceDocument : serviceDoc
				};
			};
			this.oFilter = new sap.apf.utils.Filter(oMessageHandler);
			this.oFilter = this.oFilter.getTopAnd().addExpression({
				name : 'SAPClient',
				operator : "eq",
				value : '777'
			});
			sap.apf.core.Metadata = sap.apf.testhelper.doubles.Metadata;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory(this.oInject);
			oConfigurationFactory = this.oConfigurationFactory;

			oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration());
		},
		afterEach : function(assert) {
			sap.apf.core.Metadata = this.fnMetadata;
			sap.apf.core.Request = this.fnRequest;
		}
	});

	QUnit.test("Basic send", function(assert) {
		this.assertRequestIsOk = function(oDataResponse, oMetadata) {
			assert.equal(oDataResponse.length, 10, "data as expected");
		};
		var oRequest = this.oConfigurationFactory.createRequest("requestTemplate1");
		var oRequestConfiguration = this.oConfigurationFactory.getConfigurationById("requestTemplate1");
		var oReadRequest = new sap.apf.core.ReadRequest(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequest.send(this.oFilter, this.assertRequestIsOk);
	});

	QUnit.test("Send without filter", function(assert) {
		this.assertRequestIsOk = function(oDataResponse, oMetadata) {
			assert.equal(oDataResponse.length, 11, "data as expected");
		};
		var oRequest = this.oConfigurationFactory.createRequest("requestTemplate1");
		var oRequestConfiguration = this.oConfigurationFactory.getConfigurationById("requestTemplate1");
		var oReadRequest = new sap.apf.core.ReadRequest(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequest.send(undefined, this.assertRequestIsOk);
	});

	QUnit.test("Get metadata by property", function(assert) {
		var oRequest = this.oConfigurationFactory.createRequest("requestTemplate1");
		var oRequestConfiguration = this.oConfigurationFactory.getConfigurationById("requestTemplate1");
		var oReadRequest = new sap.apf.core.ReadRequest(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		var oDummyMetadataFacade = oReadRequest.getMetadataFacade();
		assert.equal(oDummyMetadataFacade.serviceDocument, "dummy.xsodata", "getMetadataFacade() calls getMetadataFacade on oCoreApi properly");
	});

	QUnit.module('Request options handed over properly', {
		beforeEach : function(assert) {
			this.fnMetadata = sap.apf.core.Metadata;
			sap.apf.core.Metadata = sap.apf.testhelper.doubles.Metadata;
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = function(oInject, oConfig) {

				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {

					assert.deepEqual(oRequestOptions, {
						paging : {
							top : 20,
							skip : 10,
							inlineCount : true
						}
					}, "correct request options handed over");
				};
				return this;
			};
			var oResourcePathHandler, oConfigurationFactory;
			var oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oMessageHandler = oMessageHandler;
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : oMessageHandler
				}
			});

			this.oInject = {
				instances : {
					messageHandler : oMessageHandler,
					coreApi : this.oCoreApi
				}
			};
			this.oCoreApi.getResourceLocation = function(sId) {
				return oResourcePathHandler.getResourceLocation(sId);
			};
			this.oCoreApi.loadMessageConfiguration = function(aMessages) {
			};
			this.oCoreApi.loadAnalyticalConfiguration = function(oConfig) {
				oConfigurationFactory.loadAnalyticalConfiguration(oConfig);
			};
			this.oCoreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			this.oFilter = new sap.apf.utils.Filter(oMessageHandler);
			this.oFilter = this.oFilter.getTopAnd().addExpression({
				name : 'SAPClient',
				operator : "eq",
				value : '777'
			});
			sap.apf.core.Metadata = sap.apf.testhelper.doubles.Metadata;

			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory(this.oInject);
			oConfigurationFactory = this.oConfigurationFactory;

			oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration());
		},
		afterEach : function(assert) {
			sap.apf.core.Metadata = this.fnMetadata;
			sap.apf.core.Request = this.fnRequest;
		}
	});

	QUnit.test("Send with request options", function(assert) {
		var oRequestOptions = {
			paging : {
				top : 20,
				skip : 10,
				inlineCount : true
			}
		};
		var oRequest = this.oConfigurationFactory.createRequest("requestTemplate1");
		var oRequestConfiguration = this.oConfigurationFactory.getConfigurationById("requestTemplate1");
		var oReadRequest = new sap.apf.core.ReadRequest(this.oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
		oReadRequest.send(this.oFilter, function() {
		}, oRequestOptions);
	});
}());
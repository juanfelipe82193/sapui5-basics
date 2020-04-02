/*
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */

jQuery.sap.declare('sap.apf.withServer.tMetadataFactory');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.ajax');
jQuery.sap.require('sap.apf.core.sessionHandler');
jQuery.sap.require('sap.apf.core.odataRequest');
jQuery.sap.require('sap.apf.core.metadata');
jQuery.sap.require('sap.apf.testhelper.createDefaultAnnotationHandler');
(function() {
	'use strict';
	QUnit.module('Metadata', {
		beforeEach : function(assert) {
			var done = assert.async();
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			});
			this.oCoreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					},
					functions : {
						getSapSystem : function() {}
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.oCoreApi.getXsrfToken = function(sServiceRootPath) {
				return this.oAuthTestHelper.getXsrfToken();
			}.bind(this);
			this.oMetadataInject = {};
			this.oMetadataInject.instances = {};
			this.oMetadataInject.constructors = {};
			this.oMetadataInject.instances.coreApi = this.oCoreApi;
			this.oMetadataInject.instances.messageHandler = this.oMessageHandler;
			this.oMetadataInject.instances.annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			this.oMetadataInject.constructors.Hashtable = sap.apf.utils.Hashtable;
			this.oMetadataInject.constructors.EntityTypeMetadata = sap.apf.core.EntityTypeMetadata;
			this.oMetadataInject.constructors.Metadata = sap.apf.core.Metadata;
			this.oMetadataInject.functions = {
					getSapSystem : function() {}
			}
			this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
				this.oMetadataFactory = new sap.apf.core.MetadataFactory(this.oMetadataInject);
				done();
			}.bind(this));
		}
	});
	QUnit.test('Same metadata instance returned if retrieved twice for service root', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var firstRetrieval = this.oMetadataFactory.getMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata');
		firstRetrieval.done(function(metadataFirst) {
			var secondRetrieval = this.oMetadataFactory.getMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata');
			assert.equal(metadataFirst.type, 'metadata', 'Metadata instance expected');
			secondRetrieval.done(function(metadataSecond) {
				assert.equal(metadataFirst, metadataSecond, 'Same metadata instance expected');
				done();
			});
		}.bind(this));
	});
	QUnit.test('Same entity type metadata instance returned if retrieved twice for service root and entity type', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var firstRetrieval = this.oMetadataFactory.getEntityTypeMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata', 'WCADaysSalesOutstandingQuery');
		firstRetrieval.done(function(entityTypeMetadataFirst) {
			var secondRetrieval = this.oMetadataFactory.getEntityTypeMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata', 'WCADaysSalesOutstandingQuery');
			assert.equal(entityTypeMetadataFirst.type, 'entityTypeMetadata', 'Entity type metadata instance expected');
			secondRetrieval.done(function(entityTypeMetadataSecond) {
				assert.equal(entityTypeMetadataFirst, entityTypeMetadataSecond, 'Same entity type metadata instance expected');
				done();
			});
		}.bind(this));	
	});
}());
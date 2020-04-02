/* 
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */
(function() {
	'use strict';

	jQuery.sap.declare("sap.apf.integration.withServer.tSessionHandler");
	jQuery.sap.require('sap.ui.thirdparty.sinon');
	jQuery.sap.require('sap.apf.testhelper.authTestHelper');
	jQuery.sap.require('sap.apf.testhelper.authTestHelperAbap');
	jQuery.sap.require('sap.apf.testhelper.interfaces.IfCoreApi');
	jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
	jQuery.sap.require('sap.apf.internal.server.userData');
	jQuery.sap.require('sap.apf.core.sessionHandler');
	jQuery.sap.require('sap.apf.utils.utils');
	jQuery.sap.require('sap.apf.utils.filter');
	jQuery.sap.require('sap.apf.utils.hashtable');
	jQuery.sap.require('sap.apf.core.utils.uriGenerator');
	jQuery.sap.require('sap.apf.core.utils.filter');
	jQuery.sap.require('sap.apf.core.utils.filterTerm');
	jQuery.sap.require('sap.apf.core.ajax');
	jQuery.sap.require('sap.apf.core.odataRequest');
	jQuery.sap.require('sap.apf.core.messageObject');
	jQuery.sap.require('sap.apf.core.messageHandler');
	jQuery.sap.declare('sap.apf.core.utils.checkForTimeout');
	jQuery.sap.require('sap.apf.core.resourcePathHandler');

	if (!sap.apf.integration.withServer.tSessionHandler) {
		sap.apf.integration.withServer.tSessionHandler = {};
		sap.apf.integration.withServer.tSessionHandler.commonIsolatedSetup = function(oContext, assert) {
			var done = assert.async();
			oContext.oMessageHandler = new sap.apf.core.MessageHandler();
			var oMessageHandler = oContext.oMessageHandler;
			oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : oContext.oMessageHandler
				}
			});
			oContext.oCoreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			var oInject = {
					instances : {
						messageHandler : oMessageHandler,
						coreApi : oContext.oCoreApi
					}
			};
			if (jQuery.sap.getUriParameters().get("systemType") === "abap") {
				oContext.config = {
						serviceRoot : "/sap/opu/odata/sap/Z_ANALYSIS_PATH_SRV/",
						entitySet : "AnalysisPathQSet",
						systemType : "abap"
				};
				oContext.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelperAbap(done, function() {
					this.oSessionHandler = new sap.apf.core.SessionHandler(oInject);
					done();
				}.bind(oContext), oContext.config);
				oContext.expectedXSRFTokenLength = 24;
			} else {
				oContext.config = {
						serviceRoot : "/sap/hba/r/apf/core/odata/apf.xsodata/",
						entitySet : 'AnalysisPathQueryResults',
						systemType : "xs"
				};
				oContext.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
					this.oSessionHandler = new sap.apf.core.SessionHandler(oInject);
					QUnit.start();
				}.bind(oContext));
				oContext.expectedXSRFTokenLength = 32;
			}
		};
	}
	QUnit.module('Xsrf Token Test', {
		beforeEach : function(assert) {
			sap.apf.integration.withServer.tSessionHandler.commonIsolatedSetup(this, assert);
			sinon.spy(jQuery, "ajax");
		},
		afterEach : function() {
			jQuery.ajax.restore();
		}
	});
	QUnit.test('Create SessionHandler Instance for XSRF Token check', function(assert) {
		var done = assert.async();
		this.oSessionHandler.getXsrfToken(this.config.serviceRoot).done(function(sXsrfToken){
			var callCountAfterFirstGetXsrfToken = jQuery.ajax.callCount;
			assert.ok(typeof sXsrfToken === "string", 'XSRF token expected');
			assert.equal(sXsrfToken.length, this.expectedXSRFTokenLength, 'XSRF token of length ' + this.expectedXSRFTokenLength + ' expected');
			this.oSessionHandler.getXsrfToken(this.config.serviceRoot).done(function(sXsrfToken1){
				assert.equal(sXsrfToken, sXsrfToken1, 'Second call for XSRF token returns same token as on first call');
				assert.equal(jQuery.ajax.callCount, callCountAfterFirstGetXsrfToken, 'Second call for XSRF token returns token from hashtable and does not trigger another ajax request');
				done();
			});
		}.bind(this));
	});
}());
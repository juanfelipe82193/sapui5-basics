/*
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 *
 *global OData */
jQuery.sap.declare('sap.apf.withServer.gateway.tNavHandler');
jQuery.sap.require('sap.apf.utils.navigationHandler');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.withServer.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.createUiApiAsPromise');

(function() {
	'use strict';
	function navigationHandlerCommonSetup(context, defaultTargets) {
		var that = context;
		that.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
		var inject = {
			instances : {
				messageHandler : that.messageHandler
			},
			functions : {
				getNavigationTargets : function() {
					return defaultTargets;
				},
				getCumulativeFilterUpToActiveStep : function() {
					var filter = new sap.apf.core.utils.Filter(that.messageHandler, "SAPClient", "EQ", "888");
					return jQuery.Deferred().resolve(filter.addAnd(new sap.apf.core.utils.Filter(that.messageHandler, "Country", "EQ", "BRA")));
				},
				serialize : function() {
					context.serializeCalled = true;
					return {
						path : 'Alpha'
					};
				},
				serializeContext : function() {
					context.serializeContextCalled = true;
					return {
						context : 'Beta'
					};
				},
				deserialize : function() {
					context.deserializeCalled = true;
				},
				deserializeContext : function() {
					context.deserializeContextCalled = true;
				}
			}
		};
		that.navigationHandler = new sap.apf.utils.NavigationHandler(inject);
	}
	function addNavigationTarget(semanticObjects, counter, navTargets, component) {
		var navigationService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
		var deferred = jQuery.Deferred();

		if (counter > semanticObjects.length || counter > 100) {
			deferred.resolve(navTargets);
			return deferred.promise();
		}
		var semanticObject = semanticObjects[counter];
		navigationService.getLinks({semanticObject : semanticObject, ignoreFormFactor : true, ui5Component : component}).done(function(aIntents) {
			aIntents.forEach(function(intentDefinition) {
				var actionWithParameters = intentDefinition.intent.split("-");
				var action = actionWithParameters[1].split("?");
				action = action[0].split("~");
				navTargets.push({
					semanticObject : semanticObject.id,
					action : action[0],
					id : "xxx" + counter
				});
			});
			counter++;
			addNavigationTarget(semanticObjects, counter, navTargets, component).done(function() {
				deferred.resolve(navTargets);
			});
		});
		return deferred.promise();
	}
	function getAllAvailableSemanticObjects(messageHandler, authTestHelper, fnCallback, component) {
		function prepareNavigationTargetsConfiguration(oData, results) {
			var semanticObjects = oData.results;
			var navTargets = [];
			addNavigationTarget(semanticObjects, 0, navTargets).done(function() {
				fnCallback(navTargets, component);
			});
		}
		authTestHelper.getXsrfToken("/sap/opu/odata/UI2/INTEROP/SemanticObjects").done(function(sXsrfToken){
			var request = {
					requestUri : "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text",
					method : "GET",
					headers : {
						"x-csrf-token" : sXsrfToken
					}
			};
			OData.request(request, prepareNavigationTargetsConfiguration, function(){});
		});
	}
	QUnit.module("Ushell container", {
		beforeEach : function(assert) {
			var done = assert.async();
			this.config = {
					serviceRoot : "/sap/opu/odata/UI2/INTEROP/",
					entitySet : "SemanticObjects",
					systemType : "abap"
			};
			this.helper = new sap.apf.withServer.Helper(this.config);
			this.oAuthTestHelper = this.helper.createAuthTestHelper(done, function() {
				sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(uiApi){
					this.component = uiApi.component;
					done();
				}.bind(this));
			}.bind(this));
		}
	});
	QUnit.test("WHEN get all semantic objects", function(assert) {
		var done = assert.async();
		function returnSemanticObjects(oData, results) {
			var allAvailableSemanticObjects = oData.results;
			assert.ok(true, "could read all semantic objects");
			done();
			allAvailableSemanticObjects.forEach(function(semanticObject) {
				/* eslint-disable no-console */
				console.log(semanticObject.id + " - " + semanticObject.text);
				/* eslint-enable no-console */
			});
		}
		function returnErrors(oError) {
			assert.ok(false);
			done();
		}
		this.oAuthTestHelper.getXsrfToken("/sap/opu/odata/UI2/INTEROP/SemanticObjects").done(function(sXsrfToken){
			var request = {
				requestUri : "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text",
				method : "GET",
				headers : {
					"x-csrf-token" : sXsrfToken
				}
			};
			OData.request(request, returnSemanticObjects, returnErrors);
		});
	});
	QUnit.test("WHEN getNavigationTargets is called", function(assert) {
		var done = assert.async();
		var that = this;
		function handleNavigationTargets(navTargets) {
			navigationHandlerCommonSetup(that, navTargets);
			that.navigationHandler.getNavigationTargets().done(function(navTargets) {
				assert.ok(navTargets, "THEN navigation targets are fetched from ui2 service");
				done();
			}).fail(function() {
				assert.ok(false, "error occurred");
				done();
			});
		}
		getAllAvailableSemanticObjects(this.messageHandler, this.oAuthTestHelper, handleNavigationTargets, this.component);
	});
})();

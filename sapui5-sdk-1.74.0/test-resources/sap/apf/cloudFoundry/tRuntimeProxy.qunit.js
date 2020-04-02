sap.ui.define([
		'sap/apf/cloudFoundry/runtimeProxy',
		'sap/apf/core/utils/filter',
		'sap/apf/core/messageObject',
		'sap/apf/testhelper/config/samplePropertyFiles',
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	],
	function(RuntimeProxy, Filter, MessageObject, testConfig, sinon) {
		'use strict';

		/*BEGIN_COMPATIBILITY*/
		Filter = Filter || sap.apf.core.utils.Filter;
		/*END_COMPATIBILITY*/

		var getManifests = function() {
			var manifest = {
				"sap.app": {
					dataSources: {
						"apf.runtime.analyticalConfigurationAndTextFiles": {
							uri: "/sap/apf/runtime/v1/AnalyticalConfigurationAndTextFiles"
						}
					}
				}
			};
			return {manifest: manifest};
		};
		var getManifestsWithMissingEntry = function() {
			var manifest = {
				"sap.app": {
					dataSources: {
						"FiCaRoot": {
							uri: "/sap/FiCa"
						}
					}
				}
			};
			return {manifest: manifest};
		};
		var getManifestsWithoutDataSources = function() {
			var manifest = {
				"sap.app": {
					dataSources: {
						"FiCaRoot": {
							uri: "/sap/FiCa"
						}
					}
				}
			};
			return {manifest: manifest};
		};
		QUnit.module("Reading analytical configuration", {
			beforeEach: function() {
				this.savedLanguage = sap.ui.getCore().getConfiguration().getLanguage();
				sap.ui.getCore().getConfiguration().applySettings({
					language: 'de-DE'
				});
			},
			afterEach: function() {
				sap.ui.getCore().getConfiguration().applySettings({
					language: this.savedLanguage
				});
			}
		});
		QUnit.test("WHEN manifest with missing entry for data source is provided", function(assert) {
			assert.expect(2);
			var MessageHandler = function() {
				this.check = function(condition) {
					if (!condition) {
						throw "bad";
					} else {
						assert.ok(true, "no check violated");
					}
				};
				this.createMessageObject = function(config) {
					return new MessageObject(config);
				};
				this.putMessage = function(messageObject) {
					assert.strictEqual(messageObject.getCode(), "5236", "THEN message code as expected");
					assert.strictEqual(messageObject.getParameters()[0], "apf.runtime.analyticalConfigurationAndTextFiles", "THEN correct name of expected data source");
				};
			};

			var coreApi = {};
			var inject = {
				instances: {messageHandler: new MessageHandler(), coreApi: coreApi},
				manifests: getManifestsWithMissingEntry()
			};
			new RuntimeProxy({}, inject); //eslint-disable-line no-new
		});
		QUnit.test("WHEN manifest without data sources is provided", function(assert) {
			assert.expect(2);
			var MessageHandler = function() {
				this.check = function(condition) {
					if (!condition) {
						throw "bad";
					} else {
						assert.ok(true, "no check violated");
					}
				};
				this.createMessageObject = function(config) {
					return new MessageObject(config);
				};
				this.putMessage = function(messageObject) {
					assert.strictEqual(messageObject.getCode(), "5236", "THEN message code as expected");
					assert.strictEqual(messageObject.getParameters()[0], "apf.runtime.analyticalConfigurationAndTextFiles", "THEN correct name of expected data source");
				};
			};

			var coreApi = {};
			var inject = {
				instances: {messageHandler: new MessageHandler(), coreApi: coreApi},
				manifests: getManifestsWithoutDataSources()
			};
			new RuntimeProxy({}, inject); // eslint-disable-line no-new
		});
		QUnit.test("WHEN readEntity is called in success case", function(assert) {
			assert.expect(10);
			var done = assert.async();
			var MessageHandler = function() {
				this.check = function(condition) {
					if (!condition) {
						throw "bad";
					} else {
						assert.ok(true, "no check violated");
					}
				};
			};
			var serializedConf = JSON.stringify({
				configHeader: {Application: "12345"}
			});
			var configObject = {
				analyticalConfiguration: {
					serializedAnalyticalConfiguration: serializedConf,
					analyticalConfigurationName: "configForTesting"
				},
				textFiles: {inEnglish: "null"}
			};

			var resolveUriStub = sinon.stub();
			resolveUriStub.returnsArg(0);
			var coreApi = {
				ajax: function(settings) {
					var expectedHeaders = {
							"Content-Type": "application/json; charset=utf-8",
							"Accept-Language": "de-DE"
						};
					assert.strictEqual(settings.url, "/sap/apf/runtime/v1/AnalyticalConfigurationAndTextFiles/343EC63F05550175E10000000A445B6D");
					assert.deepEqual(settings.headers, expectedHeaders, "THEN headers are set");
					setTimeout(function() {
						settings.success(configObject, "OK");
					}, 1);
				},
				getComponent: function() {
					return {
						getManifestObject: function() {
							return {
								resolveUri: resolveUriStub
							}
						}
					}
				}
			};
			var inject = {
				instances: {messageHandler: new MessageHandler(), coreApi: coreApi},
				manifests: getManifests()
			};
			var configurationGuid = "343EC63F05550175E10000000A445B6D";
			var proxy = new RuntimeProxy({}, inject); // eslint-disable-line no-new
			var callback = function(data, metadata, messageObject) {
				assert.strictEqual(resolveUriStub.callCount, 1, "THEN the URI was resolved");
				assert.strictEqual(data.Application, "12345", "THEN application id was extracted and mapped");
				assert.strictEqual(data.AnalyticalConfigurationName, "configForTesting", "THEN configuration name was mapped");
				assert.deepEqual(data.SerializedAnalyticalConfiguration, serializedConf, "THEN configuration is returned as expected");
				assert.deepEqual(proxy.textFiles, {inEnglish: "null"}, "THEN text files are remembered");
				assert.strictEqual(messageObject, undefined, "THEN no error message");
				done();
			};
			assert.strictEqual(proxy.textFiles, undefined, "THEN no text files are preset");
			proxy.readEntity("configuration", callback, [{name: "AnalyticalConfiguration", value: configurationGuid}]);
		});
		QUnit.test("WHEN readEntity is called in error case", function(assert) {
			assert.expect(4);
			var done = assert.async();
			var MessageHandler = function() {
				this.check = function(condition) {
					if (!condition) {
						throw "bad";
					} else {
						assert.ok(true, "no check violated");
					}
				};
				this.createMessageObject = function(config) {
					return new MessageObject(config);
				};
			};
			var coreApi = {
				ajax: function(settings) {
					assert.strictEqual(settings.url, "/sap/apf/runtime/v1/AnalyticalConfigurationAndTextFiles/343EC63F05550175E10000000A445B6D");
					setTimeout(function() {
						settings.error(undefined, "notOk", {});
					}, 1);
				}
			};
			var inject = {
				instances: {messageHandler: new MessageHandler(), coreApi: coreApi},
				manifests: getManifests()
			};
			var configurationGuid = "343EC63F05550175E10000000A445B6D";
			var proxy = new RuntimeProxy({}, inject); // eslint-disable-line no-new
			var callback = function(data, metadata, error) {
				assert.strictEqual(error.getCode(), "5057", "THEN error code as expected");
				var expectedUrl = "/sap/apf/runtime/v1/AnalyticalConfigurationAndTextFiles/343EC63F05550175E10000000A445B6D";
				assert.deepEqual(error.getParameters(), [expectedUrl]);
				done();
			};
			proxy.readEntity("configuration", callback, [{name: "AnalyticalConfiguration", value: configurationGuid}]);
		});
		QUnit.test("WHEN readEntity is called in error case and error already returns message object", function(assert) {
			assert.expect(4);
			var done = assert.async();
			var MessageHandler = function() {
				this.check = function(condition) {
					if (!condition) {
						throw "bad";
					} else {
						assert.ok(true, "no check violated");
					}
				};
				this.createMessageObject = function(config) {
					return new MessageObject(config);
				};
			};
			var coreApi = {
				ajax: function(settings) {
					assert.strictEqual(settings.url, "/sap/apf/runtime/v1/AnalyticalConfigurationAndTextFiles/343EC63F05550175E10000000A445B6D");
					setTimeout(function() {
						settings.error(undefined, "notOk", {}, new MessageObject({code: "7777"}));
					}, 1);
				}
			};
			var inject = {
				instances: {messageHandler: new MessageHandler(), coreApi: coreApi},
				manifests: getManifests()
			};
			var configurationGuid = "343EC63F05550175E10000000A445B6D";
			var proxy = new RuntimeProxy({}, inject); // eslint-disable-line no-new
			var callback = function(data, metadata, error) {
				assert.strictEqual(error.getCode(), "5057", "THEN error code as expected");
				var previous = error.getPrevious();
				assert.strictEqual(previous.getCode(), "7777", "THEN error code as expected");
				done();
			};
			proxy.readEntity("configuration", callback, [{name: "AnalyticalConfiguration", value: configurationGuid}]);
		});

		QUnit.module("Read Texts", {
			beforeEach: function() {
				this.savedLanguage = sap.ui.getCore().getConfiguration().getLanguage();
				sap.ui.getCore().getConfiguration().applySettings({
					language: 'de-DE'
				});
				var MessageHandler = function() {
					this.check = function(condition) {
						if (!condition) {
							throw "bad";
						}
					};
					this.createMessageObject = function(config) {
						return new MessageObject(config);
					};
				};
				var coreApi = {};
				var messageHandler = new MessageHandler();
				var inject = {
					instances: {messageHandler: messageHandler, coreApi: coreApi},
					manifests: getManifests()
				};
				var applicationId = "343EC63F05550175E10000000A445B6D";
				this.textFiles = {
					inEnglish: testConfig.getPropertyFile("en", applicationId),
					inRequestedLanguage: testConfig.getPropertyFile("de", applicationId)
				};
				this.proxy = new RuntimeProxy({}, inject); // eslint-disable-line no-new
				this.messageHandler = messageHandler;
			},
			afterEach: function() {
				sap.ui.getCore().getConfiguration().applySettings({
					language: this.savedLanguage
				});
			},
			createFilter: function() {
				var filterApplication = new Filter(this.messageHandler, 'Application', 'eq', "343EC63F05550175E10000000A445B6D");
				var filter = new Filter(this.messageHandler, 'Language', 'eq', sap.apf.core.constants.developmentLanguage);
				filter.addAnd(filterApplication);
				return filter;
			}
		});
		QUnit.test("Read texts - WHEN readCollection is called in success case", function(assert) {
			assert.expect(6);
			var callback = function(data) {
				assert.strictEqual(data[0].TextElement, "14395631782976233920652753624875", "THEN first text element as expected");
				assert.strictEqual(data[0].TextElementDescription, "Kategorie 1.1.1", "THEN first text as expected");
				assert.strictEqual(data[1].TextElement, "14395631877028739882768245665019", "THEN 2nd text element as expected");
				assert.strictEqual(data[1].TextElementDescription, "Kategorie 1.1.2", "THEN 2nd text as expected");
				assert.strictEqual(data[2].TextElement, "14395631877028739882768245665031", "THEN 3rd text element as expected");
				assert.strictEqual(data[2].TextElementDescription, "En-Category 1.1.5", "THEN 3rd text as expected");
			};
			var filter = this.createFilter();
			this.proxy.textFiles = this.textFiles;
			this.proxy.readCollection("texts", callback, undefined, [], filter);
		});
		QUnit.test("Read texts - WHEN readCollection is called in error case", function(assert) {
			assert.expect(1);

			var callback = function(data, metadata, messageObject) {
				assert.strictEqual(messageObject.getCode(), "5222", "THEN error code as expected");
			};
			var filter = this.createFilter();
			this.proxy.textFiles = undefined;
			this.proxy.readCollection("texts", callback, undefined, [], filter);
		});
	});
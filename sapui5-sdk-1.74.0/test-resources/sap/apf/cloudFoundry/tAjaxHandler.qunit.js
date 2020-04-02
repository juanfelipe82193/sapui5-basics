sap.ui.define([
		'sap/apf/cloudFoundry/ajaxHandler',
		'sap/apf/core/messageObject'
	],
	function(AjaxHandler, MessageObject) {
		'use strict';

		var DefaultMessageHandler = function () {
			this.createMessageObject = function (config) {
				return new MessageObject(config);
			};
			this.isOwnException = function () {
			};
			this.putMessage = function (oMessageObject) {
			};
		};

		QUnit.module("Different REQUESTS on ajax", {
			beforeEach : function() {
				var that = this;
				var coreAjax = function(settings) {
					that.verifyAjaxSettings(settings);
				};
				var inject = {
						functions: { coreAjax : coreAjax },
						instances : { messageHandler : new DefaultMessageHandler() }
				};
				this.ajaxHandler = new AjaxHandler(inject);
			}
		});
		QUnit.test("WHEN first and second GET request", function (assert){
			assert.expect(11);
			var testContext = this;
			var callCount = 0;
			// assertions
			var xhrStub = {
					setRequestHeader : function(arg1, arg2) {
						assert.strictEqual(arg1, "x-csrf-token", "THEN xsrf token is set");
						assert.strictEqual(arg2, "Fetch", "THEN fetch directive as expected");
					}
			};
			var oXMLHttpRequestStub = {
					getResponseHeader : function(arg1) {
						assert.strictEqual(arg1, "x-csrf-token", "THEN xsrf token is retrieved from response header");
						return "tokenValueOfNoInterest";
					}
			};
			this.verifyAjaxSettings = function(settings) {
				if (callCount === 0) {
					assert.strictEqual(typeof settings.beforeSend, "function", "THEN before send function is set");
					settings.beforeSend(xhrStub);
					callCount++;
					settings.success("successData", "statusValue", oXMLHttpRequestStub);
				} else {
					assert.deepEqual(settings, expectedSecondAjaxSettings, "THEN second settings as expected");
					settings.success("successData2", "statusValue2", oXMLHttpRequestStub);
				}
			};
			// arrangement
			var ajaxSettingsFirstGET = {
					url : "/path",
					success : function(data, status, oXMLHttpRequest) {
						assert.strictEqual(data, "successData", "THEN data has been forwarded from core ajax");
						assert.strictEqual(status, "statusValue", "THEN status has been forwarded from core ajax");
						assert.strictEqual(oXMLHttpRequest, oXMLHttpRequestStub, "THEN xml http request has been forwarded from core ajax");
						testContext.ajaxHandler.send(ajaxSettingsSecondGET);
					},
					error: function() {}
			};
			var ajaxSettingsSecondGET = {
					url : "/path2",
					success : function(data, status, oXMLHttpRequest) {
						assert.strictEqual(data, "successData2", "THEN data has been forwarded from core ajax");
						assert.strictEqual(status, "statusValue2", "THEN status has been forwarded from core ajax");
						assert.strictEqual(oXMLHttpRequest, oXMLHttpRequestStub, "THEN xml http request has been forwarded from core ajax");
					},
					error: function() {}
			};
			var expectedSecondAjaxSettings = jQuery.extend(true, {}, ajaxSettingsSecondGET);
			// action
			this.ajaxHandler.send(ajaxSettingsFirstGET);
		});
		QUnit.test("WHEN first GET request with explicite GET type in settings", function (assert){
			// assertions
			assert.expect(7);
			var xhrStub = {
					setRequestHeader : function(arg1, arg2) {
						assert.strictEqual(arg1, "x-csrf-token", "THEN xsrf token is set");
						assert.strictEqual(arg2, "Fetch", "THEN fetch directive as expected");
					}
			};
			var oXMLHttpRequestStub = {
					getResponseHeader : function(arg1) {
						assert.strictEqual(arg1, "x-csrf-token", "THEN xsrf token is retrieved from response header");
						return "tokenValueOfNoInterest";
					}
			};
			this.verifyAjaxSettings = function(settings) {
				assert.strictEqual(typeof settings.beforeSend, "function", "THEN before send function is set");
				settings.beforeSend(xhrStub);
				settings.success("successData", "statusValue", oXMLHttpRequestStub);
			};

			var ajaxSettings = {
					type : "GET",
					url : "/path",
					success : function(data, status, oXMLHttpRequest) {
						assert.strictEqual(data, "successData", "THEN data has been forwarded from core ajax");
						assert.strictEqual(status, "statusValue", "THEN status has been forwarded from core ajax");
						assert.strictEqual(oXMLHttpRequest, oXMLHttpRequestStub, "THEN xml http request has been forwarded from core ajax");
					},
					error: function() {}
			};
			this.ajaxHandler.send(ajaxSettings);
		});
		QUnit.test("WHEN first HEAD request", function (assert){
			assert.expect(7);
			var xhrStub = {
					setRequestHeader : function(arg1, arg2) {
						assert.strictEqual(arg1, "x-csrf-token", "THEN xsrf token is set");
						assert.strictEqual(arg2, "Fetch", "THEN fetch directive as expected");
					}
			};
			var oXMLHttpRequestStub = {
					getResponseHeader : function(arg1) {
						assert.strictEqual(arg1, "x-csrf-token", "THEN xsrf token is retrieved from response header");
						return "tokenValueOfNoInterest";
					}
			};
			this.verifyAjaxSettings = function(settings) {
				assert.strictEqual(typeof settings.beforeSend, "function", "THEN before send function is set");
				settings.beforeSend(xhrStub);
				settings.success("successData", "statusValue", oXMLHttpRequestStub);
			};

			var ajaxSettings = {
					type : "HEAD",
					url : "/path",
					success : function(data, status, oXMLHttpRequest) {
						assert.strictEqual(data, "successData", "THEN data has been forwarded from core ajax");
						assert.strictEqual(status, "statusValue", "THEN status has been forwarded from core ajax");
						assert.strictEqual(oXMLHttpRequest, oXMLHttpRequestStub, "THEN xml http request has been forwarded from core ajax");
					},
					error: function() {}
			};
			this.ajaxHandler.send(ajaxSettings);
		});
		QUnit.test("WHEN PUT request AND success on fetching xsrf token in the initiaL GET", function (assert){
			assert.expect(10);
			var testContext = this;
			var xsrfToken = "12344565";
			var dataForPut = { content: "content"};
			this.verifyAjaxSettings = function(settings) {

				if (settings.url === "/pathForGET") {

					assert.ok(typeof settings.beforeSend === 'function', "THEN before send function is set");
					var xhr = {
						setRequestHeader : function(arg1, arg2) {
							assert.strictEqual(arg1, "x-csrf-token", "xsrf token is requested"); 
							assert.strictEqual(arg2, "Fetch", "with FETCH directive");
						}
					};
					//test, what the before send function does
					settings.beforeSend(xhr);
					var xmlHttpRequest = {
							getResponseHeader : function(arg1) {
								assert.strictEqual(arg1, "x-csrf-token", "THEN token is read");
								return xsrfToken;
							}
					};
					settings.success("successDataGET", "successStatusGET", xmlHttpRequest);
				} else if (settings.url === "/pathForPUT") {
					var expectedHeaders = {
						"Content-Type": "application/json;charset=utf-8",
						"X-CSRF-Token": "12344565"
					};
					assert.strictEqual(settings.type, "PUT", "THEN put operation");
					assert.deepEqual(settings.data, dataForPut, "THEN data not modified");
					assert.deepEqual(settings.headers, expectedHeaders, "THEN headers with token and content type are set");
					settings.success("successDataPUT", "successStatusPUT", { type : "xmlHttpRequest" });
				}
			};

			var ajaxSettingsForPUT = {
					type: "PUT",
					url : "/pathForPUT",
					success : function(data, status, oXMLHttpRequest) {
						assert.strictEqual(data, "successDataPUT", "THEN data has been forwarded from core ajax");
						assert.strictEqual(status, "successStatusPUT", "THEN status has been forwarded from core ajax");
						assert.deepEqual(oXMLHttpRequest, { type : "xmlHttpRequest" }, "THEN xml http request has been forwarded from core ajax");
					},
					data: dataForPut,
					error: function() {}
			};
			var ajaxSettingsForGET = {
					type : "GET",
					url : "/pathForGET",
					success : function() {
						testContext.ajaxHandler.send(ajaxSettingsForPUT);
					},
					error: function() {}
			};
			this.ajaxHandler.send(ajaxSettingsForGET);
		});
		QUnit.test("WHEN PUT request as METHOD AND success on fetching xsrf token in the initiaL GET", function (assert){
			assert.expect(10);
			var testContext = this;
			var xsrfToken = "12344565";
			var dataForPut = { content: "content"};
			this.verifyAjaxSettings = function(settings) {

				if (settings.url === "/pathForGET") {

					assert.ok(typeof settings.beforeSend === 'function', "THEN before send function is set");
					var xhr = {
						setRequestHeader : function(arg1, arg2) {
							assert.strictEqual(arg1, "x-csrf-token", "xsrf token is requested"); 
							assert.strictEqual(arg2, "Fetch", "with FETCH directive");
						}
					};
					//test, what the before send function does
					settings.beforeSend(xhr);
					var xmlHttpRequest = {
							getResponseHeader : function(arg1) {
								assert.strictEqual(arg1, "x-csrf-token", "THEN token is read");
								return xsrfToken;
							}
					};
					settings.success("successDataGET", "successStatusGET", xmlHttpRequest);
				} else if (settings.url === "/pathForPUT") {
					var expectedHeaders = {
						"Content-Type": "application/json;charset=utf-8",
						"X-CSRF-Token": "12344565"
					};
					assert.strictEqual(settings.method, "PUT", "THEN put operation");
					assert.deepEqual(settings.data, dataForPut, "THEN data not modified");
					assert.deepEqual(settings.headers, expectedHeaders, "THEN headers with token and content type are set");
					settings.success("successDataPUT", "successStatusPUT", { type : "xmlHttpRequest" });
				}
			};

			var ajaxSettingsForPUT = {
					method: "PUT",
					url : "/pathForPUT",
					success : function(data, status, oXMLHttpRequest) {
						assert.strictEqual(data, "successDataPUT", "THEN data has been forwarded from core ajax");
						assert.strictEqual(status, "successStatusPUT", "THEN status has been forwarded from core ajax");
						assert.deepEqual(oXMLHttpRequest, { type : "xmlHttpRequest" }, "THEN xml http request has been forwarded from core ajax");
					},
					data: dataForPut,
					error: function() {}
			};
			var ajaxSettingsForGET = {
					type : "GET",
					url : "/pathForGET",
					success : function() {
						testContext.ajaxHandler.send(ajaxSettingsForPUT);
					},
					error: function() {}
			};
			this.ajaxHandler.send(ajaxSettingsForGET);
		});
		QUnit.test("WHEN  error on fetching xsrf token AND subsequent PUT", function (assert){
			assert.expect(7);
			var dataForPut = { content: "content"};
			var coreAjax = function(settings) {

				if (settings.url === "/pathForGET") {
					settings.error({ type : "jqXHR"}, "textStatusValue", "errorThrownValue");
				} else if (settings.url === "/pathForPUT") {
					var expectedHeaders = {
						"Content-Type": "application/json;charset=utf-8",
						"X-CSRF-Token": ""
					};
					assert.strictEqual(settings.type, "PUT", "THEN put operation");
					assert.deepEqual(settings.data, dataForPut, "THEN data not modified");
					assert.deepEqual(settings.headers, expectedHeaders, "THEN headers with token and content type are set");
				}
			};
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
					assert.strictEqual(oMessageObject.getCode(), 5105, "THEN message code as expected");
				};
			};
			var inject = {
					functions: { coreAjax : coreAjax },
					instances : { messageHandler : new MessageHandler() }
			};
			var ajaxHandler = new AjaxHandler(inject);
			var ajaxSettingsForPUT = {
					type: "PUT",
					url : "/pathForPUT",
					success : function() {},
					data: dataForPut,
					error: function() {}
			};
			var ajaxSettingsForGET = {
					type : "GET",
					url : "/pathForGET",
					success : function() {
					},
					error: function(jqXHR, textStatus, errorThrown) {
						assert.deepEqual(jqXHR, { type : "jqXHR"}, "THE jqXHR has been forwarded from core ajax");
						assert.strictEqual(textStatus, "textStatusValue", "THEN text status has been forwarded from core ajax");
						assert.strictEqual(errorThrown, "errorThrownValue", "THEN error thrown has been forwarded from core ajax");
						ajaxHandler.send(ajaxSettingsForPUT);
					}
			};
			ajaxHandler.send(ajaxSettingsForGET);
		});
		QUnit.test("WHEN PUT request several times AND success on fetching xsrf token", function (assert){
			assert.expect(7);
			var testContext = this;
			var xsrfToken = "12344565";
			var dataForPut = { content: "content"};
			this.verifyAjaxSettings = function(settings) {

				if (settings.url === "/pathForGET") {
					assert.ok(typeof settings.beforeSend === 'function', "THEN before send function is set");
					var xhr = {
						setRequestHeader : function(arg1, arg2) {
							assert.strictEqual(arg1, "x-csrf-token", "xsrf token is requested"); 
							assert.strictEqual(arg2, "Fetch", "with FETCH directive");
						}
					};
					//test, what the before send function does
					settings.beforeSend(xhr);
					var xmlHttpRequest = {
							getResponseHeader : function(arg1) {
								assert.strictEqual(arg1, "x-csrf-token", "THEN token is read");
								return xsrfToken;
							}
					};
					settings.success("", "", xmlHttpRequest);
				} else if (settings.url === "/pathForPUT") {
					assert.strictEqual(settings.type, "PUT", "THEN put operation");
				}
			};

			var ajaxSettingsForGET = {
					type : "GET",
					url : "/pathForGET",
					success : function() {
						var ajaxSettings = {
								type: "PUT",
								url : "/pathForPUT",
								success : function() {},
								data: dataForPut,
								error: function() {}
						};
						for (var i = 0; i < 3; i++) {
							testContext.ajaxHandler.send(ajaxSettings);
						}
					}
			};
			this.ajaxHandler.send(ajaxSettingsForGET);
		});
		QUnit.test("WHEN POST request AND success on fetching xsrf token", function (assert){
			assert.expect(4);
			var xsrfToken = "12344565";
			var testContext = this;
			var dataForPost = { content: "content"};
			this.verifyAjaxSettings = function(settings) {

				if (settings.url === "/pathForGET") {
					var xmlHttpRequest = {
							getResponseHeader : function(arg1) {
								assert.strictEqual(arg1, "x-csrf-token", "THEN token is read");
								return xsrfToken;
							}
					};
					settings.success("", "", xmlHttpRequest);
				} else if (settings.url === "/pathForPOST") {
					var expectedHeaders = {
						"Content-Type": "application/json;charset=utf-8",
						"X-CSRF-Token": "12344565"
					};
					assert.strictEqual(settings.type, "POST", "THEN POST operation");
					assert.deepEqual(settings.data, dataForPost, "THEN data not modified");
					assert.deepEqual(settings.headers, expectedHeaders, "THEN headers with token and content type are set");
				}
			};

			var ajaxSettingsForPOST = {
					type: "POST",
					url : "/pathForPOST",
					success : function() {},
					data: dataForPost,
					error: function() {}
			};
			var ajaxSettingsForGET = {
					type : "GET",
					url : "/pathForGET",
					success : function() {
						testContext.ajaxHandler.send(ajaxSettingsForPOST);
					}
			};
			this.ajaxHandler.send(ajaxSettingsForGET);
		});
		QUnit.test("WHEN POST request as METHOD AND success on fetching xsrf token", function (assert){
			assert.expect(4);
			var xsrfToken = "12344565";
			var testContext = this;
			var dataForPost = { content: "content"};
			this.verifyAjaxSettings = function(settings) {

				if (settings.url === "/pathForGET") {
					var xmlHttpRequest = {
							getResponseHeader : function(arg1) {
								assert.strictEqual(arg1, "x-csrf-token", "THEN token is read");
								return xsrfToken;
							}
					};
					settings.success("", "", xmlHttpRequest);
				} else if (settings.url === "/pathForPOST") {
					var expectedHeaders = {
						"Content-Type": "application/json;charset=utf-8",
						"X-CSRF-Token": "12344565"
					};
					assert.strictEqual(settings.method, "POST", "THEN POST operation");
					assert.deepEqual(settings.data, dataForPost, "THEN data not modified");
					assert.deepEqual(settings.headers, expectedHeaders, "THEN headers with token and content type are set");
				}
			};

			var ajaxSettingsForPOST = {
					method: "POST",
					url : "/pathForPOST",
					success : function() {},
					data: dataForPost,
					error: function() {}
			};
			var ajaxSettingsForGET = {
					type : "GET",
					url : "/pathForGET",
					success : function() {
						testContext.ajaxHandler.send(ajaxSettingsForPOST);
					}
			};
			this.ajaxHandler.send(ajaxSettingsForGET);
		});
		QUnit.test("WHEN DELETE request AND success on fetching xsrf token", function (assert){
			assert.expect(3);
			var xsrfToken = "12344565";
			var testContext = this;
			this.verifyAjaxSettings = function(settings) {

				if (settings.url === "/pathForGET") {
					var xmlHttpRequest = {
							getResponseHeader : function(arg1) {
								assert.strictEqual(arg1, "x-csrf-token", "THEN token is read");
								return xsrfToken;
							}
					};
					settings.success("", "", xmlHttpRequest);
				} else if (settings.url === "/pathForDELETE") {
					var expectedHeaders = {
						"X-CSRF-Token": "12344565"
					};
					assert.strictEqual(settings.type, "DELETE", "THEN DELETE operation");
					assert.deepEqual(settings.headers, expectedHeaders, "THEN headers with token and content type are set");
				}
			};

			var ajaxSettingsForDELETE = {
					type: "DELETE",
					url : "/pathForDELETE",
					success : function() {},
					error: function() {}
			};
			var ajaxSettingsForGET = {
					type : "GET",
					url : "/pathForGET",
					success : function() {
						testContext.ajaxHandler.send(ajaxSettingsForDELETE);
					}
			};
			this.ajaxHandler.send(ajaxSettingsForGET);
		});
		QUnit.test("WHEN DELETE request AS method AND success on fetching xsrf token", function (assert){
			assert.expect(3);
			var xsrfToken = "12344565";
			var testContext = this;
			this.verifyAjaxSettings = function(settings) {

				if (settings.url === "/pathForGET") {
					var xmlHttpRequest = {
							getResponseHeader : function(arg1) {
								assert.strictEqual(arg1, "x-csrf-token", "THEN token is read");
								return xsrfToken;
							}
					};
					settings.success("", "", xmlHttpRequest);
				} else if (settings.url === "/pathForDELETE") {
					var expectedHeaders = {
						"X-CSRF-Token": "12344565"
					};
					assert.strictEqual(settings.method, "DELETE", "THEN DELETE operation");
					assert.deepEqual(settings.headers, expectedHeaders, "THEN headers with token and content type are set");
				}
			};

			var ajaxSettingsForDELETE = {
					method: "DELETE",
					url : "/pathForDELETE",
					success : function() {},
					error: function() {}
			};
			var ajaxSettingsForGET = {
					type : "GET",
					url : "/pathForGET",
					success : function() {
						testContext.ajaxHandler.send(ajaxSettingsForDELETE);
					}
			};
			this.ajaxHandler.send(ajaxSettingsForGET);
		});
		QUnit.test("WHEN PUT request AND success on fetching xsrf token AND preset content-type in headers", function (assert){
			assert.expect(7);
			var xsrfToken = "12344565";
			var testContext = this;
			var dataForPut = { content: "content"};
			this.verifyAjaxSettings = function(settings) {

				if (settings.url === "/pathForGET") {
					assert.ok(typeof settings.beforeSend === 'function', "THEN before send function is set");
					var xhr = {
						setRequestHeader : function(arg1, arg2) {
							assert.strictEqual(arg1, "x-csrf-token", "xsrf token is requested"); 
							assert.strictEqual(arg2, "Fetch", "with FETCH directive");
						}
					};
					//test, what the before send function does
					settings.beforeSend(xhr);
					var xmlHttpRequest = {
							getResponseHeader : function(arg1) {
								assert.strictEqual(arg1, "x-csrf-token", "THEN token is read");
								return xsrfToken;
							}
					};
					settings.success("", "", xmlHttpRequest);
				} else if (settings.url === "/pathForPUT") {
					var expectedHeaders = {
						"Content-Type": "application/xml",
						"X-CSRF-Token": "12344565"
					};
					assert.strictEqual(settings.type, "PUT", "THEN put operation");
					assert.deepEqual(settings.data, dataForPut, "THEN data not modified");
					assert.deepEqual(settings.headers, expectedHeaders, "THEN headers with token and ORIGINAL content type are set");
				}
			};

			var ajaxSettingsForPUT = {
					type: "PUT",
					url : "/pathForPUT",
					success : function() {},
					data: dataForPut,
					error: function() {},
					headers: {
						"Content-Type": "application/xml"
					}
			};
			var ajaxSettingsForGET = {
					type : "GET",
					url : "/pathForGET",
					success : function() {
						testContext.ajaxHandler.send(ajaxSettingsForPUT);
					}
			};
			this.ajaxHandler.send(ajaxSettingsForGET);
		});
	});
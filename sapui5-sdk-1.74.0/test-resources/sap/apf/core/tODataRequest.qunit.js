jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.messageHandler");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.ui.thirdparty.datajs");
(function() {
	'use strict';
	QUnit.module('ODataRequest', {
		beforeEach : function(assert) {
			if (OData && OData.request) {
				this.ODataRequest = OData.request;
			}
		},
		afterEach : function(assert) {
			if (this.ODataRequest) {
				OData.request = this.ODataRequest;
			}
		}
	});
	QUnit.test('Check if both callback functions (wrapped and handed over) are called', function(assert) {
		var bRequestSuccess = false;
		var bRequestError = false;
		var fnSuccess = function() {
			bRequestSuccess = true;
		};
		var fnError = function() {
			bRequestError = true;
		};
		var oRequest = {};
		var oInject = {
			instances : {
				datajs : {
					request : function(oRequest, fnSuccess, fnError, oBatchHandler) {
						fnSuccess();
					}
				}
			},
			functions : {
				getSapSystem : function() {
					return undefined;
				}
			}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, {});
		assert.ok(bRequestSuccess, "Success function was called");
		oInject = {
			instances : {
				datajs : {
					request : function(oRequest, fnSuccess, fnError, oBatchHandler) {
						fnError();
					}
				}
			},
			functions : {
				getSapSystem : function() {
					return undefined;
				}
			}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, {});
		assert.ok(bRequestError, "Error function was called");
	});
	QUnit.test('Timeout 303', function(assert) {
		var done = assert.async();
		this.server = sinon.fakeServer.create();
		this.server.respondWith([ 303, {
			"Content-Type" : "text/plain"
		}, '' ]);
		this.server.autoRespond = true;
		var fnSuccess = function() {
			return undefined;
		};
		var fnError = function(oError) {
			assert.equal(oError.messageObject.getCode(), 5021, 'PutMessage with code 5021 expected due to timeout');
			done();
		};
		var oRequest = {};
		var oInject = {
			instances: {
				datajs: OData
			},
			functions : {
				getSapSystem : function() {
					return undefined;
				}
			}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, {});
		this.server.restore();
	});
	QUnit.test('Timeout with redirect to login 200', function(assert) {
		var done = assert.async();
		this.server = sinon.fakeServer.create();
		this.server.respondWith([ 200, {
			"x-sap-login-page" : "url"
		}, '' ]);
		this.server.autoRespond = true;
		var fnSuccess = function() {
			return undefined;
		};
		var fnError = function(oError) {
			assert.equal(oError.messageObject.getCode(), 5021, 'PutMessage with code 5021 expected due to timeout');
			done();
		};
		var oRequest = {};
		var oInject = {
			instances: {
				datajs: OData
			},
			functions : {
				getSapSystem : function() {
					return undefined;
				}
			}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, undefined);
		this.server.restore();
	});
	QUnit.module("Sap-System");
    QUnit.test("WHEN sap-system is set - request for getting semantic objects", function(assert){
        var oInject = {
            instances : {
                datajs : {
                    request : function(oRequest) {
                        assert.equal(oRequest.requestUri, "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text", "THEN url does not contain origin");
                    }
                }
            },
            functions : {
                getSapSystem : function() {
                    return "myErp";
                }
            }
        };
        var oRequest = {
            requestUri : "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text",
            method : "GET",
            isSemanticObjectRequest: true,
            headers : {
                "x-csrf-token" : "token"
            }
        };
        sap.apf.core.odataRequestWrapper(oInject, oRequest);
    });
	QUnit.test("WHEN sap-system is set - with entity set, view parameter, query string and trailing slash", function(assert){
		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath;o=myErp/entitySet(viewParameter=2017)?queryParameter=true", "THEN trailing slash is removed and url contains the origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return "myErp";
					}
				}
			};
		var oRequest = {
				requestUri : "/servicePath/entitySet(viewParameter=2017)?queryParameter=true/",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});
	QUnit.test("WHEN sap-system is set - with entity set, view parameter, query string and no trailing slash", function(assert){
		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath;o=myErp/entitySet(viewParameter=2017)?queryParameter=true", "THEN url contains the origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return "myErp";
					}
				}
		};
		var oRequest = {
				requestUri : "/servicePath/entitySet(viewParameter=2017)?queryParameter=true",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});
	QUnit.test("WHEN sap-system is set - with entity set, view parameter, no query string and trailing slash", function(assert){
		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath;o=myErp/entitySet(viewParameter=2017)", "THEN trailing slash is removed and url contains the origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return "myErp";
					}
				}
		};
		var oRequest = {
				requestUri : "/servicePath/entitySet(viewParameter=2017)/",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});
	QUnit.test("WHEN sap-system is set - with entity set, view parameter, no query string and no trailing slash", function(assert){
		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath;o=myErp/entitySet(viewParameter=2017)", "THEN url contains the origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return "myErp";
					}
				}
		};
		var oRequest = {
				requestUri : "/servicePath/entitySet(viewParameter=2017)",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});	
	QUnit.test("WHEN sap-system is set - with entity set, no view parameter, no query string and no trailing slash", function(assert){
		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath;o=myErp/entitySet", "THEN url contains the origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return "myErp";
					}
				}
		};
		var oRequest = {
				requestUri : "/servicePath/entitySet",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});
	QUnit.test("WHEN sap-system is set - with entity set, no view parameter, query string and trailing slash", function(assert){
		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath;o=myErp/entitySet?queryParameter=true", "THEN trailing slash is removed and url contains the origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return "myErp";
					}
				}
		};
		var oRequest = {
				requestUri : "/servicePath/entitySet?queryParameter=true/",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});	
	QUnit.test("WHEN sap-system is set - with entity set, no view parameter, query string and no trailing slash", function(assert){
		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath;o=myErp/entitySet?queryParameter=true", "THEN url contains the origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return "myErp";
					}
				}
		};
		var oRequest = {
				requestUri : "/servicePath/entitySet?queryParameter=true",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});	
	QUnit.test("WHEN sap-system is set - with entity set, no view parameter, no query string and trailing slash", function(assert){
		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath;o=myErp/entitySet", "THEN trailing slash is removed and url contains the origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return "myErp";
					}
				}
		};
		var oRequest = {
				requestUri : "/servicePath/entitySet/",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});	
	QUnit.test("WHEN sap-system is set - with $batch and no trailing slash", function(assert){
		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath;o=myErp/$batch", "THEN url contains the origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return "myErp";
					}
				}
		};
		var oRequest = {
				requestUri : "/servicePath/$batch",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});
	QUnit.test("WHEN sap-system is set - with $batch and trailing slash", function(assert){
		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath;o=myErp/$batch", "THEN trailing slash is removed and url contains the origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return "myErp";
					}
				}
		};
		var oRequest = {
				requestUri : "/servicePath/$batch/",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});
	QUnit.test("WHEN sap-system is NOT set", function(assert){

		var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							assert.equal(oRequest.requestUri, "/servicePath/entitySet", "THEN url does not contain origin");
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return undefined;
					}
				}
			};
		var oRequest = {
				requestUri : "/servicePath/entitySet",
				method : "GET",
				headers : {
					"x-csrf-token" : "token"
				}
		};
		sap.apf.core.odataRequestWrapper(oInject, oRequest);
	});
}());

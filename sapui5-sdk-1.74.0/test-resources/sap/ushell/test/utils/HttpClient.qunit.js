// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/* global sap, QUnit, sinon, Promise */
/* eslint new-cap: off */

sap.ui.define([
    "sap/ushell/utils/HttpClient",
    "sap/ushell/utils/_HttpClient/factory",
    "sap/ushell/utils/_HttpClient/internals"
], function (HttpClient, fnHttpClientFactory, oHttpClientInternals) {
    "use strict";

    // MODULE: _HttpClient/internals
    QUnit.module("_HttpClient/internals");

    // -- isValidHttpMethod
    QUnit.test(".isValidHttpMethod", function (assert) {
        [
            {
                description: "'HEAD' is a valid HTTP method",
                input: {
                    sHttpMethod: "HEAD"
                },
                expected: true
            },
            {
                description: "'GET' is a valid HTTP method",
                input: {
                    sHttpMethod: "GET"
                },
                expected: true
            },
            {
                description: "'OPTIONS' is a valid HTTP method",
                input: {
                    sHttpMethod: "OPTIONS"
                },
                expected: true
            },
            {
                description: "'POST' is a valid HTTP method",
                input: {
                    sHttpMethod: "POST"
                },
                expected: true
            },
            {
                description: "'PUT' is a valid HTTP method",
                input: {
                    sHttpMethod: "PUT"
                },
                expected: true
            },
            {
                description: "'DELETE' is a valid HTTP method",
                input: {
                    sHttpMethod: "DELETE"
                },
                expected: true
            },
            {
                description: "'head' in lower case is NOT a valid HTTP method",
                input: {
                    sHttpMethod: "head"
                },
                isExpectedToThrow: true
            },
            {
                description: "'get' in lower case in lower case is NOT a valid HTTP method",
                input: {
                    sHttpMethod: "get"
                },
                isExpectedToThrow: true
            },
            {
                description: "'options' in lower case is NOT a valid HTTP method",
                input: {
                    sHttpMethod: "options"
                },
                isExpectedToThrow: true
            },
            {
                description: "'post' in lower case is NOT a valid HTTP method",
                input: {
                    sHttpMethod: "post"
                },
                isExpectedToThrow: true
            },
            {
                description: "'put' in lower case is NOT a valid HTTP method",
                input: {
                    sHttpMethod: "put"
                },
                isExpectedToThrow: true
            },
            {
                description: "'delete' in lower case is NOT a valid HTTP method",
                input: {
                    sHttpMethod: "delete"
                },
                isExpectedToThrow: true
            },
            {
                description: "Any arbitrary string other than 'HEAD', 'GET', 'OPTIONS', 'POST', 'PUT', and 'DELETE' is NOT a valid HTTP method",
                input: {
                    sHttpMethod: "slkhjrbfkwhjrf83o"
                },
                isExpectedToThrow: true
            }
        ].forEach(runAssertions);

        function runAssertions(oFixture) {
            var fnIsValidHttpMethod = oHttpClientInternals.isValidHttpMethod.bind(
                null,
                oFixture.input.sHttpMethod
            );

            if (oFixture.isExpectedToThrow) {
                assert.throws(fnIsValidHttpMethod, /IllegalArgumentError/, oFixture.description);
                return;
            }

            assert.equal(fnIsValidHttpMethod(), oFixture.expected, oFixture.description);
        }
    });

    // -- isSafeHttpMethod
    QUnit.test(".isSafeHttpMethod", function (assert) {
        [
            {
                description: "'HEAD' is a safe method",
                input: {
                    sRequestMethod: "HEAD"
                },
                expected: true
            },
            {
                description: "'GET' is a safe method",
                input: {
                    sRequestMethod: "GET"
                },
                expected: true
            },
            {
                description: "'OPTIONS' is a safe method",
                input: {
                    sRequestMethod: "OPTIONS"
                },
                expected: true
            },
            {
                description: "'POST' is an UNsafe method",
                input: {
                    sRequestMethod: "POST"
                },
                expected: false
            },
            {
                description: "'PUT' is an UNsafe method",
                input: {
                    sRequestMethod: "PUT"
                },
                expected: false
            },
            {
                description: "'DELETE' is an UNsafe method",
                input: {
                    sRequestMethod: "DELETE"
                },
                expected: false
            },
            {
                description: "'head' in lower case is NOT a safe method",
                input: {
                    sRequestMethod: "head"
                },
                isExpectedToThrow: true
            },
            {
                description: "'get' in lower case in lower case is NOT a safe method",
                input: {
                    sRequestMethod: "get"
                },
                isExpectedToThrow: true
            },
            {
                description: "'options' in lower case is NOT a safe method",
                input: {
                    sRequestMethod: "options"
                },
                isExpectedToThrow: true
            },
            {
                description: "'post' in lower case is NOT a safe method",
                input: {
                    sRequestMethod: "post"
                },
                isExpectedToThrow: true
            },
            {
                description: "'put' in lower case is NOT a safe method",
                input: {
                    sRequestMethod: "put"
                },
                isExpectedToThrow: true
            },
            {
                description: "'delete' in lower case is NOT a safe method",
                input: {
                    sRequestMethod: "delete"
                },
                isExpectedToThrow: true
            }
        ].forEach(runAssertions);

        function runAssertions(oFixture) {
            if (oFixture.isExpectedToThrow) {
                assert.throws(
                    function () {
                        oHttpClientInternals.
                            isSafeHttpMethod(oFixture.input.sRequestMethod);
                    },
                    /IllegalArgumentError/,
                    oFixture.description
                );

                return;
            }

            assert.equal(
                oHttpClientInternals.isSafeHttpMethod(oFixture.input.sRequestMethod),
                oFixture.expected,
                oFixture.description
            );
        }
    });

    // -- containsCSRFTokenHeaderEntry
    QUnit.test(".containsCSRFTokenHeaderEntry", function (assert) {
        [
            {
                description: "throws when expected `oHeaders` is null",
                input: {
                    oHeaders: null
                },
                isExpectedToThrow: true
            },
            {
                description: "throws when expected `oHeaders` is undefined",
                input: { /* oHeaders: undefined */ },
                isExpectedToThrow: true
            },
            {
                description: "returns true when `oHeaders` set contains an entry with key 'x-csrf-token' in lower case, having a non-empty string value",
                input: {
                    oHeaders: {
                        "x-csrf-token": "header-value"
                    }
                },
                expected: true
            },
            {
                description: "returns true when `oHeaders` set contains an entry with key 'x-csrf-token' in upper case, having a non-empty string value",
                input: {
                    oHeaders: {
                        "X-CSRF-TOKEN": "header-value"
                    }
                },
                expected: true
            },
            {
                description: "returns false when `oHeaders` set contains an entry with key 'x-csrf-token' in lower case, having an empty string value",
                input: {
                    oHeaders: {
                        "x-csrf-token": ""
                    }
                },
                expected: false
            },
            {
                description: "returns false when `oHeaders` set contains an entry with key 'X-CSRF-TOKEN' in upper case, having an empty string value",
                input: {
                    oHeaders: {
                        "X-CSRF-TOKEN": ""
                    }
                },
                expected: false
            },
            {
                description: "returns false when `oHeaders` set contains an entry with key 'x-csrf-token' in lower case, with value `null`",
                input: {
                    oHeaders: {
                        "x-csrf-token": null
                    }
                },
                expected: false
            },
            {
                description: "returns false when `oHeaders` set contains an entry with key 'x-csrf-token' in lower case, with value `undefined`",
                input: {
                    oHeaders: { /* "X-CSRF-TOKEN": undefined */ }
                },
                expected: false
            },
            {
                description: "returns false when `oHeaders` set contains an entry with key 'x-csrf-token' in lower case, with a number value",
                input: {
                    oHeaders: {
                        "x-csrf-token": 5646
                    }
                },
                expected: false
            },
            {
                description: "returns false when `oHeaders` set contains an entry with key 'x-csrf-token' in lower case, with an object value",
                input: {
                    oHeaders: {
                        "x-csrf-token": {}
                    }
                },
                expected: false
            }
        ].forEach(function (oFixture) {
            var fncontainsCSRFTokenHeaderEntry = oHttpClientInternals.containsCSRFTokenHeaderEntry;

            if (oFixture.isExpectedToThrow) {
                assert.throws(
                    fncontainsCSRFTokenHeaderEntry.bind(null, oFixture.input.oHeaders),
                    /TypeError/,
                    oFixture.description
                );

                return;
            }

            assert.equal(
                fncontainsCSRFTokenHeaderEntry(oFixture.input.oHeaders),
                oFixture.expected,
                oFixture.description
            );
        });
    });

    // -- summariseResponse
    QUnit.test(".summariseResponse", function (assert) {
        [
            {
                description: "throws when expected xhr instance is null",
                input: {
                    xhr: null
                },
                isExpectedToThrow: true
            },
            {
                description: "throws when expected xhr instance is undefined",
                input: { /* xhr: undefined */ },
                isExpectedToThrow: true
            },
            {
                description: "throws when expected xhr instance exists, but has invalid `getAllResponseHeaders` property of type 'string'",
                input: {
                    xhr: {
                        getAllResponseHeaders: ""
                    }
                },
                isExpectedToThrow: true
            },
            {
                description: "throws when expected xhr instance exists but has invalid `getAllResponseHeaders` property of type 'object'",
                input: {
                    xhr: {
                        getAllResponseHeaders: {}
                    }
                },
                isExpectedToThrow: true
            },
            {
                description: "throws when expected xhr instance exists but has invalid `getAllResponseHeaders` property of type 'null'",
                input: {
                    xhr: {
                        getAllResponseHeaders: null
                    }
                },
                isExpectedToThrow: true
            },
            {
                description: "throws when expected xhr instance exists but has invalid `getAllResponseHeaders` property of type 'undefined'",
                input: {
                    xhr: {}
                },
                isExpectedToThrow: true
            },
            {
                description: "returns an object that summarises the response when expected xhr instance is valid",
                input: {
                    xhr: {
                        status: "Normally a number, any value or type here should be copied in the summary",
                        statusText: "Normally a string, any value or type here should be copied in the summary",
                        responseText: "Normally a string, any value or type here should be copied in the summary",
                        getAllResponseHeaders: function () {
                            return "header-1: header-1-value\r\nheader-2: header-2-value";
                        }
                    }
                },
                expected: {
                    response: {
                        status: "Normally a number, any value or type here should be copied in the summary",
                        statusText: "Normally a string, any value or type here should be copied in the summary",
                        responseText: "Normally a string, any value or type here should be copied in the summary",
                        responseHeaders: [
                            { name: "header-1", value: "header-1-value" },
                            { name: "header-2", value: "header-2-value" }
                        ]
                    }
                }
            }
        ].forEach(function (oFixture) {
            var fnSummariseResponse = oHttpClientInternals.summariseResponse.bind(null, oFixture.input.xhr);

            if (oFixture.isExpectedToThrow) {
                assert.throws(fnSummariseResponse, /TypeError/, oFixture.description);

                return;
            }

            assert.deepEqual(
                fnSummariseResponse(),
                oFixture.expected.response,
                oFixture.description
            );
        });
    });

    // -- processResponse
    [
        {
            testDescription: "throws when expected `oXhr` instance is null",
            input: {
                oXhr: null
            },
            isExpectedToThrow: true
        },
        {
            testDescription: "throws when expected `oXhr` instance is undefined",
            input: { /* oXhr: undefined */ },
            isExpectedToThrow: true
        },
        {
            testDescription: "throws when expected `oXhr` instance exists, but has invalid `status` property of type 'string'",
            input: {
                oXhr: {
                    status: ""
                }
            },
            isExpectedToThrow: true
        },
        {
            testDescription: "throws when expected `oXhr` instance exists but has invalid `status` property of type 'object'",
            input: {
                oXhr: {
                    status: {}
                }
            },
            isExpectedToThrow: true
        },
        {
            testDescription: "throws when expected `oXhr` instance exists but has invalid `status` property of type 'null'",
            input: {
                oXhr: {
                    status: null
                }
            },
            isExpectedToThrow: true
        },
        {
            testDescription: "throws when expected `oXhr` instance exists but has invalid `status` property of type 'undefined'",
            input: {
                oXhr: {}
            },
            isExpectedToThrow: true
        },
        {
            testDescription: "returns a promise that is resolved when 200 <= oXhr.status < 300",
            input: {
                oXhr: {
                    status: 200,
                    getAllResponseHeaders: function () {
                        return "a-header:a-header-value";
                    }
                },
                fnOK: sinon.spy(),
                fnError: sinon.spy()
            },
            isExpectedOKResponseStatus: true,
            expected: {
                oResponse: {
                    status: 200,
                    statusText: undefined,
                    responseText: undefined,
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }
                    ]
                }
            }
        },
        {
            testDescription: "returns a promise that is rejected when oXhr.status < 200 and ooXhr.status > 299",
            input: {
                oXhr: {
                    status: 500,
                    getAllResponseHeaders: function () {
                        return "another-header:\tanother-header-value";
                    }
                },
                fnOK: sinon.spy(),
                fnError: sinon.spy()
            },
            isExpectedOKResponseStatus: false,
            expected: {
                oResponse: {
                    status: 500,
                    statusText: undefined,
                    responseText: undefined,
                    responseHeaders: [
                        {
                            name: "another-header",
                            value: "another-header-value"
                        }
                    ]
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test(".processResponse - " + oFixture.testDescription, function (assert) {
            var fnProcessResponse;

            fnProcessResponse = oHttpClientInternals.processResponse.bind(
                null,
                oFixture.input.oXhr,
                oFixture.input.fnOK,
                oFixture.input.fnError
            );

            if (oFixture.isExpectedToThrow) {
                assert.throws(
                    fnProcessResponse,
                    /IllegalArgumentError/,
                    "Throws IllegalArgumentError"
                );
                return;
            }

            fnProcessResponse();
            if (oFixture.isExpectedOKResponseStatus) {
                assert.ok(
                    oFixture.input.fnOK.calledOnce && !oFixture.input.fnError.calledOnce,
                    "`fnOK` was called once but `fnError` was never called"
                );
                assert.deepEqual(
                    oFixture.expected.oResponse,
                    oFixture.input.fnOK.args[0][0],
                    "`fnOK` was called with the expected response object"
                );
            } else {
                assert.ok(
                    !oFixture.input.fnOK.calledOnce && oFixture.input.fnError.calledOnce,
                    "`fnError` was called once but `fnOK` was never called"
                );
                assert.deepEqual(
                    oFixture.expected.oResponse,
                    oFixture.input.fnError.args[0][0],
                    "`fnError` was called with the expected response object"
                );
            }
        });
    });

    // -- getHttpRequestWrapper
    [
        {
            testDescription: "when called with 'post' as method name",
            input: {
                sMethodName: "post",
                fnHttpRequest: sinon.spy(),
                sBaseUrl: "/base/url/",
                oCommonConfig: {
                    common: "config"
                },
                // --
                sPath: "/path/to/resource",
                oSpecialConfig: {
                    special: "config"
                }
            },
            expected: {
                sMethodName: "post",
                sUrl: "/base/url/path/to/resource",
                oConfig: {
                    common: "config",
                    special: "config"
                }
            }
        },
        {
            testDescription: "when called with 'get' as method name",
            input: {
                sMethodName: "get",
                fnHttpRequest: sinon.spy(),
                sBaseUrl: "/base/url/",
                oCommonConfig: {
                    common: "config"
                },
                // --
                sPath: "/path/to/resource",
                oSpecialConfig: {
                    special: "config"
                }
            },
            expected: {
                sMethodName: "get",
                sUrl: "/base/url/path/to/resource",
                oConfig: {
                    common: "config",
                    special: "config"
                }
            }
        },
        {
            testDescription: "when called with 'put' as method name",
            input: {
                sMethodName: "put",
                fnHttpRequest: sinon.spy(),
                sBaseUrl: "/base/url/",
                oCommonConfig: {
                    common: "config"
                },
                // --
                sPath: "/path/to/resource",
                oSpecialConfig: {
                    special: "config"
                }
            },
            expected: {
                sMethodName: "put",
                sUrl: "/base/url/path/to/resource",
                oConfig: {
                    common: "config",
                    special: "config"
                }
            }
        },
        {
            testDescription: "when called with 'delete' as method name",
            input: {
                sMethodName: "delete",
                fnHttpRequest: sinon.spy(),
                sBaseUrl: "/base/url/",
                oCommonConfig: {
                    common: "config"
                },
                // --
                sPath: "/path/to/resource",
                oSpecialConfig: {
                    special: "config"
                }
            },
            expected: {
                sMethodName: "delete",
                sUrl: "/base/url/path/to/resource",
                oConfig: {
                    common: "config",
                    special: "config"
                }
            }
        },
        {
            testDescription: "when called with 'options' as method name",
            input: {
                sMethodName: "options",
                fnHttpRequest: sinon.spy(),
                sBaseUrl: "/base/url/",
                oCommonConfig: {
                    common: "config"
                },
                // --
                sPath: "/path/to/resource",
                oSpecialConfig: {
                    special: "config"
                }
            },
            expected: {
                sMethodName: "options",
                sUrl: "/base/url/path/to/resource",
                oConfig: {
                    common: "config",
                    special: "config"
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test(
            ".getHttpRequestWrapper - " + oFixture.testDescription,
            function (assert) {
                var fnRequestWrapper = oHttpClientInternals.getHttpRequestWrapper(
                    oFixture.input.sMethodName,
                    oFixture.input.fnHttpRequest,
                    oFixture.input.sBaseUrl,
                    oFixture.input.oCommonConfig
                );
                fnRequestWrapper(oFixture.input.sPath, oFixture.input.oSpecialConfig);

                assert.ok(
                    typeof fnRequestWrapper === "function",
                    "returns a function that can be used to make a post request to `sPath` with `oSpecialConfig`"
                );
                assert.ok(
                    oFixture.input.fnHttpRequest.calledOnce &&
                    oFixture.input.fnHttpRequest.calledWith(
                        oFixture.expected.sMethodName,
                        oFixture.expected.sUrl,
                        oFixture.expected.oConfig
                    ),
                    "the returned function calls the wrapped generic request function as expected"
                );
            }
        );
    });

    // -- _executeRequest & executeRequest
    [
        {
            testDescription: "when called with `sRequestMethod` given as 'head' in lower case, the underlying XMLHttpRequest is ultimately sent with 'HEAD' in upper case",
            input: {
                sRequestMethod: "head",
                sUrl: "base/url/path/to/head/resource"
            },
            expected: {
                requestUrl: "base/url/path/to/head/resource",
                requestMethod: "HEAD"
            }
        },
        {
            testDescription: "when called with `sRequestMethod` given as 'get' in lower case, the underlying XMLHttpRequest is ultimately sent with 'GET' in upper case",
            input: {
                sRequestMethod: "get",
                sUrl: "base/url/path/to/get/resource"
            },
            expected: {
                requestUrl: "base/url/path/to/get/resource",
                requestMethod: "GET"
            }
        },
        {
            testDescription: "when called with `sRequestMethod` given as 'options' in lower case, the underlying XMLHttpRequest is ultimately sent with 'OPTIONS' in upper case",
            input: {
                sRequestMethod: "options",
                sUrl: "base/url/path/to/options/resource"
            },
            expected: {
                requestUrl: "base/url/path/to/options/resource",
                requestMethod: "OPTIONS"
            }
        },
        {
            testDescription: "when called with `sRequestMethod` given as 'post' in lower case, the underlying XMLHttpRequest is ultimately sent with 'POST' in upper case",
            input: {
                sRequestMethod: "post",
                sUrl: "base/url/path/to/post/resource"
            },
            expected: {
                requestUrl: "base/url/path/to/post/resource",
                requestMethod: "POST"
            }
        },
        {
            testDescription: "when called with `sRequestMethod` given as 'put' in lower case, the underlying XMLHttpRequest is ultimately sent with 'PUT' in upper case",
            input: {
                sRequestMethod: "put",
                sUrl: "base/url/path/to/put/resource"
            },
            expected: {
                requestUrl: "base/url/path/to/put/resource",
                requestMethod: "PUT"
            }
        },
        {
            testDescription: "when called with `sRequestMethod` given as 'delete' in lower case, the underlying XMLHttpRequest is ultimately sent with 'DELETE' in upper case",
            input: {
                sRequestMethod: "delete",
                sUrl: "base/url/path/to/delete/resource"
            },
            expected: {
                requestUrl: "base/url/path/to/delete/resource",
                requestMethod: "DELETE"
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("._executeRequest - " + oFixture.testDescription, function (assert) {
            var oRequestPromise,
                oXhrStub,
                fnXhr,
                fnDone, fnRequest;

            // Arrange
            fnDone = assert.async();
            oXhrStub = sinon.useFakeXMLHttpRequest();
            oXhrStub.onCreate = function (oXhr) {
                oFixture.input.oXhr = oXhr;
            };

            fnXhr = XMLHttpRequest;

            fnRequest = oHttpClientInternals._executeRequest.bind(
                null,
                fnXhr,
                oFixture.input.sRequestMethod,
                oFixture.input.sUrl
            );
            // Act
            oRequestPromise = fnRequest();
            oFixture.input.oXhr.respond(200);

            // Assert
            oRequestPromise
                .then(function (oResponse) {
                    assert.strictEqual(
                        oFixture.input.oXhr.url,
                        oFixture.expected.requestUrl,
                        "Sends a request to the target URL" + oFixture.input.oXhr.url
                    );
                    assert.strictEqual(
                        oFixture.input.oXhr.method,
                        oFixture.expected.requestMethod,
                        "Sends a request using the '" + oFixture.expected.requestMethod + "' HTTP method"
                    );
                }, function () {
                    assert.notOk(true, "executeRequest unexpectedly rejected its promise");
                })
                .then(function () {
                    oXhrStub.restore();
                })
                .then(fnDone, fnDone);
        });
    });
    [
        {
            testDescription: "when a HEAD request is made with configured request data and headers",
            input: {
                sRequestMethod: "head",
                sUrl: "base/url/path/to/head/resource",
                oConfig: {
                    data: {
                        pro: "perty",
                        deeper: {
                            pro: "perty"
                        },
                        number: 1,
                        nothing: null
                    },
                    headers: {
                        "A-header": "a header value"
                    }
                }
            },
            expected: {
                requestUrl: "base/url/path/to/head/resource",
                requestBody: null,
                requestMethod: "HEAD",
                requestHeaders: {
                    "A-header": "a header value"
                }
            }
        },
        {
            testDescription: "when a GET request is made with configured request data and headers",
            input: {
                sRequestMethod: "get",
                sUrl: "base/url/path/to/get/resource",
                oConfig: {
                    data: {
                        pro: "perty",
                        deeper: {
                            pro: "perty"
                        },
                        number: 1,
                        nothing: null
                    },
                    headers: {
                        "A-header": "a header value"
                    }
                }
            },
            expected: {
                requestUrl: "base/url/path/to/get/resource",
                requestBody: null,
                requestMethod: "GET",
                requestHeaders: {
                    "A-header": "a header value"
                }
            }
        },
        {
            testDescription: "when an OPTIONS request is made with configured request data and headers",
            input: {
                sRequestMethod: "options",
                sUrl: "base/url/path/to/options/resource",
                oConfig: {
                    data: {
                        pro: "perty",
                        deeper: {
                            pro: "perty"
                        },
                        number: 1,
                        nothing: null
                    },
                    headers: {
                        "A-header": "a header value"
                    }
                }
            },
            expected: {
                requestUrl: "base/url/path/to/options/resource",
                requestBody: JSON.stringify({
                    pro: "perty",
                    deeper: {
                        pro: "perty"
                    },
                    number: 1,
                    nothing: null
                }),
                requestMethod: "OPTIONS",
                requestHeaders: {
                    "A-header": "a header value",
                    "Content-Type": "text/plain;charset=utf-8"
                }
            }
        },
        {
            testDescription: "when a POST request is made with configured request data and headers",
            input: {
                sRequestMethod: "post",
                sUrl: "base/url/path/to/post/resource",
                oConfig: {
                    data: {
                        pro: "perty",
                        deeper: {
                            pro: "perty"
                        },
                        number: 1,
                        nothing: null
                    },
                    headers: {
                        "A-header": "a header value"
                    }
                }
            },
            expected: {
                requestUrl: "base/url/path/to/post/resource",
                requestBody: JSON.stringify({
                    pro: "perty",
                    deeper: {
                        pro: "perty"
                    },
                    number: 1,
                    nothing: null
                }),
                requestMethod: "POST",
                requestHeaders: {
                    "A-header": "a header value",
                    "Content-Type": "text/plain;charset=utf-8"
                }
            }
        },
        {
            testDescription: "when a PUT request is made with configured request data and headers",
            input: {
                sRequestMethod: "put",
                sUrl: "base/url/path/to/put/resource",
                oConfig: {
                    data: {
                        pro: "perty",
                        deeper: {
                            pro: "perty"
                        },
                        number: 1,
                        nothing: null
                    },
                    headers: {
                        "A-header": "a header value"
                    }
                }
            },
            expected: {
                requestUrl: "base/url/path/to/put/resource",
                requestBody: JSON.stringify({
                    pro: "perty",
                    deeper: {
                        pro: "perty"
                    },
                    number: 1,
                    nothing: null
                }),
                requestMethod: "PUT",
                requestHeaders: {
                    "A-header": "a header value",
                    "Content-Type": "text/plain;charset=utf-8"
                }
            }
        },
        {
            testDescription: "when a DELETE request is made with configured request data and headers",
            input: {
                sRequestMethod: "delete",
                sUrl: "base/url/path/to/delete/resource",
                oConfig: {
                    data: {
                        pro: "perty",
                        deeper: {
                            pro: "perty"
                        },
                        number: 1,
                        nothing: null
                    },
                    headers: {
                        "A-header": "a header value"
                    }
                }
            },
            expected: {
                requestUrl: "base/url/path/to/delete/resource",
                requestBody: JSON.stringify({
                    pro: "perty",
                    deeper: {
                        pro: "perty"
                    },
                    number: 1,
                    nothing: null
                }),
                requestMethod: "DELETE",
                requestHeaders: {
                    "A-header": "a header value",
                    "Content-Type": "text/plain;charset=utf-8"
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("._executeRequest - " + oFixture.testDescription, function (assert) {
            var oRequestPromise,
                oXhrStub,
                fnXhr,
                fnDone,
                fnExecuteRequest;

            // Arrange
            fnDone = assert.async();
            oXhrStub = sinon.useFakeXMLHttpRequest();
            oXhrStub.onCreate = function (oXhr) {
                oFixture.input.oXhr = oXhr;
            };

            fnXhr = XMLHttpRequest;

            fnExecuteRequest = oHttpClientInternals._executeRequest.bind(
                null,
                fnXhr,
                oFixture.input.sRequestMethod,
                oFixture.input.sUrl,
                oFixture.input.oConfig
            );

            // Act
            oRequestPromise = fnExecuteRequest();
            oFixture.input.oXhr.respond(200, oFixture.responseHeaders, oFixture.requestBody);

            // Assert
            oRequestPromise
                .then(function (oResponse) {
                    assert.strictEqual(
                        oFixture.input.oXhr.url,
                        oFixture.expected.requestUrl,
                        "sends a request to the target URL"
                    );
                    assert.strictEqual(
                        oFixture.input.oXhr.method,
                        oFixture.expected.requestMethod,
                        "sends a request using the expected'" + oFixture.expected.requestMethod + "' HTTP method"
                    );
                    assert.deepEqual(
                        oFixture.input.oXhr.requestHeaders,
                        oFixture.expected.requestHeaders,
                        "sends a request with thecd flp  headers set correctly"
                    );
                    assert.strictEqual(
                        oFixture.input.oXhr.requestBody,
                        oFixture.expected.requestBody,
                        "sends the specified data in the body of the request"
                    );
                }, function () {
                    assert.notOk(true, "executeRequest unexpectedly rejected its promise");
                })
                .then(function () {
                    oXhrStub.restore();
                })
                .then(fnDone, fnDone);
        });
    });
    QUnit.test(".executeRequest has `XMLHttpRequest` request bound to it as first argument", function (assert) {
        assert.ok(
            oHttpClientInternals.executeRequest("get", "path/to/resource", { /* optional config */ }),
            "oHttpClientInternals.executeRequest(...) does not throw"
        );
    });

    // -- executeRequestWithCsrfToken
    [
        {
            testDescription: "safe HTTP method resolving & returning CSRF token",
            input: {
                requestMethod: "GET",
                config: {},
                csrfTokenByGet: null,
                csrfTokenByFetch: null,
                executeRequestResolves: [true],
                executeRequestResult: [{
                    status: 200,
                    statusText: "OK",
                    responseText: "data from backend",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }, {
                            name: "x-csrf-token",
                            value: "token from server"
                        }
                    ]
                }]
            },
            expected: {
                resolve: true,
                response: {
                    status: 200,
                    statusText: "OK",
                    responseText: "data from backend",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }, {
                            name: "x-csrf-token",
                            value: "token from server"
                        }
                    ]
                }
            }
        }, {
            testDescription: "safe HTTP method resolving & not returning CSRF token",
            input: {
                requestMethod: "GET",
                config: {},
                csrfTokenByGet: null,
                csrfTokenByFetch: null,
                executeRequestResolves: [true],
                executeRequestResult: [{
                    status: 200,
                    statusText: "OK",
                    responseText: "data from backend",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }
                    ]
                }]
            },
            expected: {
                resolve: true,
                response: {
                    status: 200,
                    statusText: "OK",
                    responseText: "data from backend",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }
                    ]
                }
            }
        }, {
            testDescription: "safe HTTP method rejecting",
            input: {
                requestMethod: "GET",
                config: {},
                csrfTokenByGet: null,
                csrfTokenByFetch: null,
                executeRequestResolves: [false],
                executeRequestResult: [{
                    status: 500,
                    statusText: "",
                    responseText: "Server Error",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }, {
                            name: "x-csrf-token",
                            value: "token from server"
                        }
                    ]
                }]
            },
            expected: {
                resolve: false,
                response: {
                    status: 500,
                    statusText: "",
                    responseText: "Server Error",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }, {
                            name: "x-csrf-token",
                            value: "token from server"
                        }
                    ]
                }
            }
        }, {
            testDescription: "unsafe HTTP method - resolving - with valid token",
            input: {
                requestMethod: "POST",
                config: {},
                csrfTokenByGet: "validToken",
                csrfTokenByFetch: null,
                executeRequestResolves: [true],
                executeRequestResult: [{
                    status: 204,
                    statusText: "OK",
                    responseText: "",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }
                    ]
                }]
            },
            expected: {
                resolve: true,
                response: {
                    status: 204,
                    statusText: "OK",
                    responseText: "",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }
                    ]
                }
            }
        }, {
            testDescription: "unsafe HTTP method - rejecting - rejected first executeRequest",
            input: {
                requestMethod: "POST",
                config: {},
                csrfTokenByGet: "validToken",
                csrfTokenByFetch: null,
                executeRequestResolves: [false],
                executeRequestResult: [{
                    status: 500,
                    statusText: "",
                    responseText: "ServerError",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }
                    ]
                }]
            },
            expected: {
                resolve: false,
                response: {
                    status: 500,
                    statusText: "",
                    responseText: "ServerError",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }
                    ]
                }
            }
        }, {
            testDescription: "unsafe HTTP method - resolving - invalid CSRF token from cache",
            input: {
                requestMethod: "POST",
                config: {},
                csrfTokenByGet: "invalidToken",
                csrfTokenByFetch: "validTokenFromServer",
                executeRequestResolves: [false, true],
                executeRequestResult: [{
                    status: 403,
                    statusText: "",
                    responseText: "ServerError",
                    responseHeaders: [
                        {
                            name: "x-csrf-token",
                            value: "Required"
                        }
                    ]
                }, {
                    status: 204,
                    statusText: "Ok",
                    responseText: "",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }
                    ]
                }
                ]
            },
            expected: {
                resolve: true,
                response: {
                    status: 204,
                    statusText: "Ok",
                    responseText: "",
                    responseHeaders: [
                        {
                            name: "a-header",
                            value: "a-header-value"
                        }
                    ]
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test(".executeRequestWithCsrfToken: when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async(),
                csrfTokenWriteToCacheDouble,
                oResultPromise,
                sUrl = "",
                executeRequestCounter = 0;

            // Arrange
            csrfTokenWriteToCacheDouble = sinon.spy();

            function executeRequestDouble(sRequestMethod, sUrl, oConfig) {
                var callCounter = executeRequestCounter;

                executeRequestCounter++;
                if (oFixture.input.executeRequestResolves[callCounter]) {
                    return Promise.resolve(oFixture.input.executeRequestResult[callCounter]);
                } else {
                    return Promise.reject(oFixture.input.executeRequestResult[callCounter]);
                }
            }

            function csrfTokenGetDouble(sUrl) {
                return Promise.resolve(oFixture.input.csrfTokenByGet);
            }

            function csrfTokenFetchDouble(sUrl) {
                return Promise.resolve(oFixture.input.csrfTokenByFetch);
            }


            // Act
            oResultPromise = oHttpClientInternals.executeRequestWithCsrfToken(
                // injected dependencies
                executeRequestDouble,
                csrfTokenWriteToCacheDouble,
                csrfTokenGetDouble,
                csrfTokenFetchDouble,
                oHttpClientInternals.csrfTokenAddToRequestHeader, // no double
                oHttpClientInternals.csrfTokenExtractFromResponseHeader, // no double
                oHttpClientInternals.isSafeHttpMethod, // no double
                // call params
                oFixture.input.requestMethod,
                sUrl,
                oFixture.input.config
            );
            // Assert
            oResultPromise
                .then(function (oResponse) {
                    assert.ok(
                        oFixture.expected.resolve,
                        "executeRequestWithCsrfToken has resolved"
                    );
                    assert.deepEqual(
                        oResponse,
                        oFixture.expected.response,
                        "executeRequestWithCsrfToken resolves with the expected response"
                    );
                    fnDone();
                })
                .catch(function (vError) {
                    assert.ok(
                        !oFixture.expected.resolve,
                        "executeRequestWithCsrfToken has resolved"
                    );
                    assert.deepEqual(
                        vError,
                        oFixture.expected.response,
                        "executeRequestWithCsrfToken rejects with the expected response"
                    );
                    fnDone();
                });
        });
    });

    // MODULE: CSRF Token
    QUnit.module("_HttpClient/internals - CSRF Token");

    // -- csrfTokenIsCached
    QUnit.test(".csrfTokenIsCached returns false when the cache is initial", function (assert) {
        var oInternals = oHttpClientInternals,
            bIsCachedAct;

        // Act
        bIsCachedAct = oInternals.csrfTokenIsCached();
        // Asssert
        assert.strictEqual(
            bIsCachedAct,
           false,
           "isCached does return the correct result"
        );
    });

    QUnit.test(".csrfTokenIsCached returns true when the cache is written upfront", function (assert) {
        var oInternals = oHttpClientInternals,
        bIsCachedAct;

        // Arrange
        oInternals.csrfTokenWriteToCache("TKNVlU")
        // Act
        bIsCachedAct = oInternals.csrfTokenIsCached();
        // Assert
        assert.strictEqual(
            bIsCachedAct,
           true,
           "isCached does return the correct result"
        );
    });

    // -- csrfTokenWriteToCache + csrfTokenReadFromCache
    QUnit.test(".csrfTokenWriteToCache + .csrfTokenReadFromCache", function (assert) {
        var oInternals = oHttpClientInternals,
            sTokenValueExp = "TKNVlU",
            sTokenValueAct;

        // Arrange
        oInternals.csrfTokenWriteToCache(sTokenValueExp);
        // Act
        sTokenValueAct = oInternals.csrfTokenReadFromCache();
        // Assert
        assert.strictEqual(
            sTokenValueAct,
            sTokenValueExp,
            "stored value via write value is retrieved via read"
        );
    });

    // -- csrfTokenAddToRequestHeader
    [
        {
            testDescription: "config has no headers member",
            input: {
                headerValue: "validToken",
                config: {}
            },
            expectedConfig: {
                headers: { "x-csrf-token": "validToken" }
            }
        }, {
            testDescription: "config has an empty headers member",
            input: {
                headerValue: "validToken",
                config: {
                    headers: {}
                }
            },
            expectedConfig: {
                headers: { "x-csrf-token": "validToken" }
            }
        }, {
            testDescription: "config has a non-empty headers member",
            input: {
                headerValue: "validToken",
                config: {
                    headers: {
                        "x-sap-lrep-time": "2ms"
                    }
                }
            },
            expectedConfig: {
                headers: {
                    "x-csrf-token": "validToken",
                    "x-sap-lrep-time": "2ms"
                }
            }
        }, {
            testDescription: "config has a non-empty headers member",
            input: {
                headerValue: "newToken",
                config: {
                    headers: {
                        "x-sap-lrep-time": "2ms",
                        "x-csrf-token": "oldToken"
                    }
                }
            },
            expectedConfig: {
                headers: {
                    "x-csrf-token": "newToken",
                    "x-sap-lrep-time": "2ms"
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test(".csrfTokenAddToRequestHeader succeeds when " + oFixture.testDescription, function (assert) {
            // Act
            var oResult = oHttpClientInternals.csrfTokenAddToRequestHeader(oFixture.input.headerValue, oFixture.input.config);

            // Assert
            assert.deepEqual(
                oResult,
                oFixture.expectedConfig,
                "csrfTokenAddToRequestHeader result"
            );
            assert.notStrictEqual(
                oResult,
                oFixture.input.config,
                "original config is not modified but cloned before extended"
            );
        });
    });

    // -- csrfTokenExtractFromResponseHeader
    [
        {
            testDescription: "headerValue is not a string",
            input: {
                headerValue: undefined,
                config: {}
            }
        },
        {
            testDescription: "config is undefined",
            input: {
                headerValue: "validToken",
                config: undefined
            }
        }, {
            testDescription: "config is not an object",
            input: {
                headerValue: "validToken",
                config: [1, 2]
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test(".csrfTokenAddToRequestHeader fails when " + oFixture.testDescription, function (assert) {
            QUnit.throws(function () {
                // Act
                oHttpClientInternals.csrfTokenAddToRequestHeader(oFixture.input.headerValue, oFixture.input.config);
            });
        });
    });

    [
        {
            testDescription: "response w/o responseHeaders given",
            inputResponse: {},
            expected: undefined
        }, {
            testDescription: "responseHeaders is not an array",
            inputResponse: { responseHeaders: {} },
            expected: undefined
        }, {
            testDescription: "responseHeaders is an empty array",
            inputResponse: { responseHeaders: [] },
            expected: undefined
        }, {
            testDescription: "responseHeaders has no CSRF token",
            inputResponse: {
                responseHeaders: [{
                    name: "x-sap-lrep-time",
                    value: "2ms"
                }]
            },
            expected: undefined
        }, {
            testDescription: "responseHeaders has a CSRF token with empty value",
            inputResponse: {
                responseHeaders: [{
                    name: "x-csrf-token",
                    value: ""
                }]
            },
            expected: undefined
        }, {
            testDescription: "responseHeaders has one item which is a valid CSRF token",
            inputResponse: {
                responseHeaders: [{
                    name: "x-csrf-token",
                    value: "validToken"
                }]
            },
            expected: "validToken"
        }, {
            testDescription: "responseHeaders has two items incl. a valid CSRF token",
            inputResponse: {
                responseHeaders: [{
                    name: "x-sap-lrep-time",
                    value: "2ms"
                }, {
                    name: "x-csrf-token",
                    value: "validToken"
                }]
            },
            expected: "validToken"
        }
    ].forEach(function (oFixture) {
        QUnit.test(".csrfTokenExtractFromResponseHeader succeeds when " + oFixture.testDescription, function (assert) {
            // Act
            var sResult = oHttpClientInternals.csrfTokenExtractFromResponseHeader(oFixture.inputResponse);

            // Assert
            assert.strictEqual(
                sResult,
                oFixture.expected,
                "csrfTokenExtractFromResponseHeader result"
            );
        });
    });

    // -- csrfTokenExtractFromResponseHeader
    [
        {
            testDescription: "response is null",
            inputResponse: null
        }
    ].forEach(function (oFixture) {
        QUnit.test(".csrfTokenExtractFromResponseHeader fails when " + oFixture.testDescription, function (assert) {
            QUnit.throws(function () {
                // Act
                oHttpClientInternals.csrfTokenExtractFromResponseHeader(oFixture.inputResponse);
            });
        });
    });

    // -- _csrfTokenFetch
    [
        {
            testDescription: "OPTIONS request succeeds",
            inputRequestSucceeds: true
        }, {
            testDescription: "OPTIONS request fails",
            inputRequestSucceeds: false
        }
    ].forEach(function (oFixture) {
        QUnit.test("._csrfTokenFetch is returning the correct value when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async(),
                oRequestPromise,
                csrfTokenExtractFromResponseHeaderDouble,
                requestDouble,
                oResultPromise,
                oFakeHttpResponse = { fake: "response" },
                sUrl = "foo/bar/personalization",
                sCsrfTokenExp = "validToken",
                sErrorExp = "Promise intentionally rejected";

            // Arrange
            oRequestPromise = new Promise(function (resolve, reject) {
                if (oFixture.inputRequestSucceeds) {
                    resolve(oFakeHttpResponse);
                } else {
                    reject(sErrorExp);
                }
            });
            requestDouble = sinon.stub()
                .returns(oRequestPromise);
            csrfTokenExtractFromResponseHeaderDouble = sinon.stub()
                .returns(sCsrfTokenExp);

            // Act
            oResultPromise = oHttpClientInternals._csrfTokenFetch(requestDouble,
                csrfTokenExtractFromResponseHeaderDouble, sUrl);

            // Assert
            assert.deepEqual(
                requestDouble.firstCall.args,
                [
                    "OPTIONS",
                    sUrl,
                    { headers: { "x-csrf-token": "fetch" } }
                ],
                "fnRequest args"
            );
            oResultPromise
                .then(function (sCsrfTokenAct) {
                    assert.deepEqual(
                        csrfTokenExtractFromResponseHeaderDouble.firstCall.args,
                        [oFakeHttpResponse],
                        "csrfTokenExtractFromResponseHeader args"
                    );
                    assert.strictEqual(
                        sCsrfTokenAct,
                        sCsrfTokenExp,
                        "Promise resolved to " + sCsrfTokenAct
                    );
                    fnDone();
                })
                .catch(function (sErrorAct) {
                    assert.strictEqual(
                        sErrorAct,
                        sErrorExp,
                        "Promise rejected with error " + sErrorAct
                    );
                    fnDone();
                });
        });
    });

    // -- _csrfTokenGet
    [
        {
            testDescription: "the cache is not null",
            input: {
                cacheValue: "validTokenInCache",
                fetchShallResolve: undefined,
                fetchResult: undefined
            },
            expected: {
                csrfToken: "validTokenInCache",
                fetchCalled: false,
                csrfTokenWrittenToCache: undefined
            }
        }, {
            testDescription: "the cache is empty and fetch resolves",
            input: {
                cacheValue: null,
                fetchShallResolve: true,
                fetchResult: "validTokenFetched"
            },
            expected: {
                csrfToken: "validTokenFetched",
                fetchCalled: true,
                csrfTokenWrittenToCache: "validTokenFetched"
            }
        }, {
            testDescription: "the cache is empty and fetch rejects",
            input: {
                cacheValue: null,
                fetchShallResolve: false,
                fetchResult: "validTokenFetched"
            },
            expected: {
                csrfToken: "validTokenFetched",
                fetchCalled: true,
                csrfTokenWrittenToCache: undefined
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("._csrfTokenGet is returning the correct value when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async(),
                csrfTokenIsCachedDouble,
                csrfTokenReadFromCacheDouble,
                csrfTokenWriteToCacheDouble,
                csrfTokenFetchDouble,
                oFetchPromise,
                sUrl = "foo/bar/personalization",
                oResultPromise,
                sErrorExp = "Promise intentionally rejected";

            // Arrange
            csrfTokenIsCachedDouble = sinon.stub()
                .returns(!!oFixture.input.cacheValue);
            csrfTokenReadFromCacheDouble = sinon.stub()
                .returns(oFixture.input.cacheValue);
            csrfTokenWriteToCacheDouble = sinon.spy();
            oFetchPromise = new Promise(function (resolve, reject) {
                if (oFixture.input.fetchShallResolve) {
                    resolve(oFixture.input.fetchResult);
                } else {
                    reject(sErrorExp);
                }
            });
            csrfTokenFetchDouble = sinon.stub()
                .returns(oFetchPromise);

            // Act
            oResultPromise = oHttpClientInternals._csrfTokenGet(
                // injected dependencies
                csrfTokenIsCachedDouble,
                csrfTokenReadFromCacheDouble,
                csrfTokenWriteToCacheDouble,
                csrfTokenFetchDouble,
                // params
                sUrl
            );

            // Assert
            oResultPromise
                .then(function (sCsrfTokenAct) {
                    assert.strictEqual(
                        sCsrfTokenAct,
                        oFixture.expected.csrfToken,
                        "Promise resolved to " + sCsrfTokenAct
                    );
                    assert.strictEqual(
                        csrfTokenFetchDouble.calledOnce,
                        oFixture.expected.fetchCalled,
                        "fetch is called / not called as expected"
                    );
                    if (oFixture.expected.fetchCalled) {
                        assert.strictEqual(
                            csrfTokenWriteToCacheDouble.args[0][0],
                            oFixture.expected.csrfTokenWrittenToCache,
                            "Expected CSRF token is written to cache"
                        );
                    }
                    fnDone();
                })
                .catch(function (sErrorAct) {
                    assert.strictEqual(
                        sErrorAct,
                        sErrorExp,
                        "Promise rejected with error " + sErrorAct
                    );
                    assert.strictEqual(
                        csrfTokenFetchDouble.calledOnce,
                        oFixture.expected.fetchCalled,
                        "fetch is called / not called as expected"
                    );
                    assert.ok(
                        !csrfTokenWriteToCacheDouble.calledOnce,
                        "csrfTokenwriteToCache was not called"
                    );
                    fnDone();
                });
        });
    });

    // MODULE: HttpClient
    QUnit.module("HttpClient");
    QUnit.test("constructor", function (assert) {
        var oHttpClient;

        oHttpClient = new HttpClient("base/url/", { /* common config */ });
        assert.ok(
            instanceExposesRequiredAPIMethods(oHttpClient),
            "when called with 'new', it constructs a new HttpClient instance"
        );

        oHttpClient = HttpClient("base/url/", { /* common config */ });
        assert.ok(
            instanceExposesRequiredAPIMethods(oHttpClient),
            "when called without 'new', it constructs an HttpClient instance"
        );

        [
            {
                testDescription: "when sBaseUrl is `null`, it throws",
                input: {
                    sBaseUrl: null
                }
            },
            {
                testDescription: "when sBaseUrl is `undefined`, it throws",
                input: {
                    /* sBaseUrl: undefined */
                }
            },
            {
                testDescription: "when sBaseUrl is constructed from any function other than `String`, it throws",
                input: {
                    sBaseUrl: {}
                }
            }
        ].forEach(function (oFixture) {
            assert.throws(
                HttpClient.bind(null, oFixture.input.sBaseUrl),
                /IllegalArgumentError/,
                oFixture.testDescription
            );
        });
    });

    function instanceExposesRequiredAPIMethods(oInstance) {
        var aAPIs = ["post", "get", "put", "delete", "options"];

        return aAPIs.every(function (sAPIName) {
            var fnAPI = oInstance[sAPIName];

            return typeof fnAPI === "function";
        });
    }
});
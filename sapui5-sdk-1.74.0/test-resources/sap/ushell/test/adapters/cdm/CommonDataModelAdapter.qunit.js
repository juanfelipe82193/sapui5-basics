// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.LaunchPageAdapter
 */
sap.ui.require([
    "sap/base/util/UriParameters",
    "sap/ushell/test/utils",
    "sap/ushell/adapters/cdm/CommonDataModelAdapter"
], function (UriParameters, testUtils, CommonDataModelAdapter) {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global sinon, jQuery, QUnit, sap */

    jQuery.sap.require("sap.ushell.services.Container");

    QUnit.module("CommonDataModelAdapter", {
        beforeEach: function (assert) {
            // local bootstrap, so not all needs to be done manually.
            // note: some adapters are stubbed later
            var setupDone = assert.async();
            sap.ushell.bootstrap("local").then(setupDone, setupDone);
        },
        afterEach: function () {
            delete this.oAdapter;
            delete sap.ushell.Container;
            testUtils.restoreSpies(
                jQuery.ajax,
                CommonDataModelAdapter.prototype._requestSiteData
            );
        }
    });

    QUnit.test("check Interface", function (assert) {
        sinon.stub(CommonDataModelAdapter.prototype, "_requestSiteData")
            .returns(new jQuery.Deferred().resolve({}).promise());
        this.oAdapter = new CommonDataModelAdapter(
            undefined, undefined, {
                config: {}
            });
        assert.strictEqual(typeof this.oAdapter.getSite, "function",
            "method getSite exists");
        assert.strictEqual(typeof this.oAdapter.getPersonalization, "function",
            "method getPersonalization exists");
    });

    QUnit.test("inject data via config", function (assert) {
        var oAdapter = new CommonDataModelAdapter(
            undefined, undefined, {
                config: { siteData: { "this": "is it" } }
            }),
            done = assert.async();

        oAdapter.getSite().done(function (oSite) {
            assert.deepEqual(oSite, { "this": "is it" }, "correct Site");
            done();
        });
    });

    QUnit.test("inject promise via config", function (assert) {
        var oDeferred = new jQuery.Deferred(),
            oAdapter = new CommonDataModelAdapter(
                undefined, undefined, {
                    config: { siteDataPromise: oDeferred }
                }),
            a = 1,
            done = assert.async();

        oAdapter.getSite().done(function (oSite) {
            assert.deepEqual(oSite, { "some": "data" }, "correct Site");
            assert.deepEqual(a, 2, "correct time");
            done();
        });
        a = 2;
        oDeferred.resolve({ "some": "data", "personalization": { "i am": "stripped" } });
    });

    [
        {
            testDescription: "cdmSiteUrl is defined",
            config: {
                cdmSiteUrl: "/unittest/site.json"
            }
        },
        {
            testDescription: "siteDataUrl is defined",
            config: {
                siteDataUrl: "/unittest/site.json"
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("get site via request URL in config when " + oFixture.testDescription, function (assert) {

            var done = assert.async();
            var oDeferred = new jQuery.Deferred();
            var oJSONAjaxCallArgs;
            var fnOriginalAjax = jQuery.ajax;
            sinon.stub(jQuery, "ajax", function () {
                // ui5 does ajax calls for module loading, so we have to filter on JSON calls
                if (typeof arguments[0] === "object" && (arguments[0].dataType === "json")) {
                    oJSONAjaxCallArgs = arguments[0];
                    return oDeferred.promise();
                } else {
                    fnOriginalAjax.apply(null, arguments);
                }
            });
            var oAdapter = new CommonDataModelAdapter(
                undefined, undefined, {
                    config: oFixture.config
                });
            var a = 1;
            oAdapter.getSite().then(function (oSite) {
                assert.strictEqual(Object.keys(oJSONAjaxCallArgs).length, 3,
                    "ajax request was made with 3 arguments");
                assert.strictEqual(oJSONAjaxCallArgs.dataType, "json", "got expected 'dataType' argument");
                assert.strictEqual(oJSONAjaxCallArgs.type, "GET", "got expected 'type' argument");

                var sExpectedUrlPattern = "^https?://[^/]+/unittest/site.json$";
                var reExpectedUrl = new RegExp(sExpectedUrlPattern);
                assert.strictEqual(reExpectedUrl.test(oJSONAjaxCallArgs.url), true, "the 'url' argument matches the pattern '" + sExpectedUrlPattern + "'");

                assert.deepEqual(oSite, { "wow": "data" }, "correct Site");
                assert.deepEqual(a, 2, "correct time");
                jQuery.ajax.restore();
            }, function (vError) {
                assert.ok(false, "Promise was rejected: " + vError);
            }).then(done, done);
            a = 2;
            oDeferred.resolve({ "wow": "data", "personalization": { "i am": "personalization" } });
        });
    });

    [
        {
            testDescription: "cdmSiteUrl is defined",
            config: {
                cdmSiteUrl: "./site.json"
            }
        },
        {
            testDescription: "siteDataUrl is defined",
            config: {
                siteDataUrl: "./site.json"
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("get site via request URL, consider base-tag when " + oFixture.testDescription, function (assert) {

            var done = assert.async();
            var oDeferred = new jQuery.Deferred();
            var oJSONAjaxCallArgs;
            var fnOriginalAjax = jQuery.ajax;

            // make sure it's a url path which is unlikely to happen on the server
            var sBaseUrl = "baseUrl" + new Date().getTime() + "/";
            var oBaseTag = document.createElement("base");
            oBaseTag.setAttribute("href", "./" + sBaseUrl);
            document.getElementById("qunit-fixture").appendChild(oBaseTag);

            sinon.stub(jQuery, "ajax", function () {
                // ui5 does ajax calls for module loading, so we have to filter on JSON calls
                if (typeof arguments[0] === "object" && (arguments[0].dataType === "json")) {
                    oJSONAjaxCallArgs = arguments[0];
                    return oDeferred.promise();
                } else {
                    fnOriginalAjax.apply(null, arguments);
                }
            });

            var oAdapter = new CommonDataModelAdapter(
                undefined, undefined, {
                    config: oFixture.config
                });

            oAdapter.getSite().then(function () {
                var sExpectedUrlPattern = "^https?://[^/]+.*" + sBaseUrl + "site.json$";
                var reExpectedUrl = new RegExp(sExpectedUrlPattern);
                assert.strictEqual(reExpectedUrl.test(oJSONAjaxCallArgs.url), true, "the 'url' argument matches the pattern '" + sExpectedUrlPattern + "'");
                jQuery.ajax.restore();
            }, function (vError) {
                assert.ok(false, "Promise was rejected: " + vError);
            }).then(done, done);

            oDeferred.resolve({});
        });
    });

    QUnit.test("get site is rejected if no siteData, siteDataPromise or URL specified in config", function (assert) {

        var done = assert.async();
        var oAjaxSpy = sinon.spy(jQuery, "ajax");
        var oAdapter = new CommonDataModelAdapter(
            undefined, undefined, {
                config: {
                }
            });

        oAdapter.getSite().then(
            function (oResult) {
                assert.ok(false, "Expected that promise is rejected");
            }, function (sError) {
                assert.strictEqual(sError, "Cannot load site: configuration property 'siteDataUrl' is missing for CommonDataModelAdapter.",
                    "Expected correct error message");
                // ui5 does ajax calls for module loading, so we have to filter on JSON calls
                assert.strictEqual(getJSONAjaxCalls(oAjaxSpy).length, 0, "Expected that jQuery.ajax is not called with dataType 'json'");
            }
        ).then(done, done);
    });

    [
        {
            testDescription: "url comes from adapter config cdmSiteUrl",
            oConfig: {
                cdmSiteUrl: "/unittest/site.json"
            },
            sExpectedUrl: "/unittest/site.json"
        }, {
            testDescription: "url comes from adapter config siteDataUrl",
            oConfig: {
                siteDataUrl: "/unittest/site.json"
            },
            sExpectedUrl: "/unittest/site.json"
        }, {
            testDescription: "url comes from adapter parameter and enabled usage of parameter",
            oConfig: {
                siteDataUrl: "/unittest/site.json",
                allowSiteSourceFromURLParameter: true
            },
            sParameterValue: "foo/bar",
            sExpectedUrl: "foo/bar"
        }, {
            testDescription: "url comes from adapter parameter but it is not enabled usage of parameter",
            oConfig: {
                siteDataUrl: "/unittest/site.json"
            },
            sParameterValue: "foo/bar",
            sExpectedUrl: "/unittest/site.json"
        }, {
            testDescription: "no config defined",
            oConfig: null,
            sExpectedUrl: null
        }
    ].forEach(function (oFixture) {
        QUnit.test("#_identifySiteUrlFromConfig calculates right URL when: " + oFixture.testDescription, function (assert) {
            var oJSONAjaxCallArgs,
                oDeferred = new jQuery.Deferred(),
                stub = sinon.stub(jQuery, "ajax", function () {
                    // ui5 does ajax calls for module loading, so we have to filter on JSON calls
                    if (typeof (arguments[0] === "object") && (arguments[0].dataType === "json")) {
                        oJSONAjaxCallArgs = arguments[0];
                        return oDeferred.promise();
                    } else {
                        fnOriginalAjax.apply(null, arguments);
                    }
                }),
                oAdapter = new CommonDataModelAdapter(
                    undefined, undefined, {
                        config: oFixture.oConfig
                    }),
                oParamStub = sinon.stub(UriParameters.prototype, "get", function () {
                    return oFixture.sParameterValue || null;
                }),
                sUrl = oAdapter._identifySiteUrlFromConfig({ config: oFixture.oConfig });
            assert.equal(sUrl, oFixture.sExpectedUrl, "url returned as expected");
            oParamStub.restore();
        });
    });

    function getJSONAjaxCalls(oAjaxSpy) {
        var aJSONAjaxCalls = [];
        if (oAjaxSpy.callCount > 0) {
            aJSONAjaxCalls = oAjaxSpy.getCalls().filter(function (oCall) {
                return oCall.args[0].dataType === "json";
            });
        }
        return aJSONAjaxCalls;
    }

    QUnit.module("getPersonlization", {
        beforeEach: function () {
            this.oSiteDataPromise = new jQuery.Deferred();
            this.oAdapter = new CommonDataModelAdapter(
                undefined, undefined, {
                    config: { siteDataPromise: this.oSiteDataPromise }
                });
        },
        afterEach: function () {
            delete this.oSiteDataPromise;
            delete this.oAdapter;
        }
    })

    QUnit.test("inject promise via config, getPersonalization", function (assert) {
        var done = assert.async();

        this.oAdapter.getPersonalization().done(function (oPersonalization) {
            assert.deepEqual(oPersonalization, { "i am": "personalization", "_version": "2.0.0" }, "correct Personalization");
            done();
        });
        this.oSiteDataPromise.resolve({ "some": "data", "personalization": { "i am": "personalization", "_version": "2.0.0" }, "_version": "2.0.0" });
    });

    QUnit.test("Personalization is loaded when Site version is 1.0.0 and no personalization version is provided", function (assert) {
        var done = assert.async(),
            oTestSite = { "some": "data", "personalization": { "i am": "personalization" }, "_version": "1.0.0"};

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, oTestSite.personalization, "Personalization was loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is loaded when Site version is 1.0.0 and personalization version is 1.0.0", function (assert) {
        var done = assert.async(),
            oTestSite = { "some": "data", "personalization": { "i am": "personalization", "_version": "1.0.0" }, "_version": "1.0.0"};

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, oTestSite.personalization, "Personalization was loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is loaded when Site version is 2.0.0 and personalization no version is provided", function (assert) {
        var done = assert.async(),
            oTestSite = { "some": "data", "personalization": { "i am": "personalization" }, "_version": "2.0.0"};

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, oTestSite.personalization, "Personalization was loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is loaded when Site version is 2.0.0 and personalization version is 2.0.0", function (assert) {
        var done = assert.async(),
            oTestSite = { "some": "data", "personalization": { "i am": "personalization", "_version": "2.0.0" }, "_version": "2.0.0"};

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, oTestSite.personalization, "Personalization was loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is NOT loaded when Site version is 2.0.0 and personalization version is 3.0.0", function (assert) {
        var done = assert.async(),
            oTestSite = { "some": "data", "personalization": { "i am": "personalization", "_version": "3.0.0" }, "_version": "2.0.0"};

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, undefined, "Personalization was not loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is NOT loaded when Site version is 3.0.0 and no personalization version is provided", function (assert) {
        var done = assert.async(),
            oTestSite = { "some": "data", "personalization": { "i am": "personalization" }, "_version": "3.0.0"};

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, undefined, "Personalization was not loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is NOT loaded when Site version is 3.0.0 and personalization version is 1.0.0", function (assert) {
        var done = assert.async(),
            oTestSite = { "some": "data", "personalization": { "i am": "personalization", "_version": "1.0.0" }, "_version": "3.0.0"};

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, undefined, "Personalization was not loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });

    QUnit.test("Personalization is NOT loaded when Site version is 3.0.0 and personalization version is 2.0.0", function (assert) {
        var done = assert.async();

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, undefined, "Personalization was not loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve({ "some": "data", "personalization": { "i am": "personalization", "_version": "2.0.0" }, "_version": "3.0.0"});
    });

    QUnit.test("Personalization is loaded when Site version is 3.0.0 and personalization version is 3.0.0", function (assert) {
        var done = assert.async(),
            oTestSite = { "some": "data", "personalization": { "i am": "personalization", "_version": "3.0.0" }, "_version": "3.0.0"};

        this.oAdapter.getPersonalization()
            .done(function (oData) {
                assert.ok(true, "Personalization promise was resolved");
                assert.deepEqual(oData, oTestSite.personalization, "Personalization was loaded");
                done();
            })
            .fail(function () {
                assert.ok(false, "Personalization promise was resolved");
                done();
            });

        this.oSiteDataPromise.resolve(oTestSite);
    });
});

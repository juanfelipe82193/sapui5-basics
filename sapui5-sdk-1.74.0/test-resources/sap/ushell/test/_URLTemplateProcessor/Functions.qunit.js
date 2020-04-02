// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.DependencyGraph
 */
sap.ui.require([
    "sap/ushell/_URLTemplateProcessor/Functions"
], function (oFunctions) {
    "use strict";
    /* global QUnit */

    QUnit.module("url()", function (hooks) {

        QUnit.test("Throws an exception when the function is called in pipe context", function (assert) {
            try {
                oFunctions.applyFunctionInPipeContext("url", []);
                assert.ok(false, "an exception is thrown");
            } catch (oError) {
                assert.ok(true, "an exception is thrown");
                var sErrorMessage = oError.message;
                assert.strictEqual(sErrorMessage, "The function 'url' cannot be executed in pipe context", "got expected error message");
            }
        });

        QUnit.test("Throws an exception when called with the wrong part", function (assert) {
            try {
                oFunctions.applyFunctionInPipeContext("url", ["some_strange_part"]);
                assert.ok(false, "an exception is thrown");
            } catch (oError) {
                assert.ok(true, "an exception is thrown");
                var sErrorMessage = oError.message;
                assert.strictEqual(sErrorMessage, "The function 'url' cannot be executed in pipe context", "got expected error message");
            }
        });

        QUnit.module("url with arguments", {
            beforeEach: function () {
                var that = this;
                var sMockedURL = "https://user:pass@my.example.com:8080/sites/index.html?mode=admin&helpset=fcc&system=U1YCLNT120#ContentPackages-Manage&/Detail/New_catalog_15";
                this.URIOriginal = sap.ui.require("sap/ui/thirdparty/URI");
                var FakeUri = function () {
                    return new that.URIOriginal(sMockedURL);
                };
                oFunctions._setURIDependency(FakeUri);
            },
            afterEach: function () {
                oFunctions._setURIDependency(this.URIOriginal);
            }
        });

        QUnit.test("Can return the expected URL part", function (assert) {

            var oExpectedUrlPart = {
                "protocol": "https",
                "scheme": "https",
                "username": "user",
                "password": "pass",
                "hostname": "my.example.com",
                "port": "8080",
                "host": "my.example.com:8080",
                "userinfo": "user:pass",
                "authority": "user:pass@my.example.com:8080",
                "origin": "https://user:pass@my.example.com:8080",
                "subdomain": "my",
                "domain": "example.com",
                "tld": "com",
                "pathname": "/sites/index.html",
                "path": "/sites/index.html",
                "directory": "/sites",
                "filename": "index.html",
                "suffix": "html",
                "search": "?mode=admin&helpset=fcc&system=U1YCLNT120",
                "query": "mode=admin&helpset=fcc&system=U1YCLNT120",
                "hash": "#ContentPackages-Manage&/Detail/New_catalog_15",
                "fragment": "ContentPackages-Manage&/Detail/New_catalog_15",
                "resource": "/sites/index.html?mode=admin&helpset=fcc&system=U1YCLNT120#ContentPackages-Manage&/Detail/New_catalog_15"
            };

            Object.keys(oExpectedUrlPart).forEach(function (sPart) {
                var sExpectedResult = oExpectedUrlPart[sPart];
                var oFunctionArgs = [sPart];
                var sResult = oFunctions.applyFunctionInValueContext("url", oFunctionArgs);

                assert.strictEqual(sResult, sExpectedResult, "Got the expected result for " + sPart);
            });
        });
    });

});

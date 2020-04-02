// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/_ApplicationType/utils",
    "sap/ushell/services/URLParsing"
], function (oUtils, URLParsing) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("sap.ushell.ApplicationType", {
        beforeEach: function () {
            var oGetServiceStub = sinon.stub();
            oGetServiceStub.withArgs("URLParsing").returns(new URLParsing());
            oGetServiceStub.throws("Service not mocked");
            sap.ushell.Container = {
               getService: oGetServiceStub
            };
        },
        afterEach: function () { }
    });

    QUnit.test("module exports an object", function (assert) {
        assert.strictEqual(
            Object.prototype.toString.apply(oUtils),
            "[object Object]",
            "got an object back"
        );
    });

    QUnit.test("appendParametersToIntentURL: simple case", function (assert) {
        var sUrl = "http://www.example.com/index.html#Frag-ment";
        var oParameters = {
            "p1": "v1"
        };

        var sExpectedUrl = "http://www.example.com/index.html#Frag-ment?p1=v1";

        var sResultUrl = oUtils.appendParametersToIntentURL(oParameters, sUrl);

        assert.strictEqual(sResultUrl, sExpectedUrl);
    });

    QUnit.test("appendParametersToIntentURL: multiple parameters", function (assert) {
        var sUrl = "http://www.example.com/index.html#Frag-ment";
        var oParameters = {
            "p1": "v1",
            "p2": "v2"
        };

        var sExpectedUrl = "http://www.example.com/index.html#Frag-ment?p1=v1&p2=v2";

        var sResultUrl = oUtils.appendParametersToIntentURL(oParameters, sUrl);

        assert.strictEqual(sResultUrl, sExpectedUrl);
    });

    QUnit.test("appendParametersToIntentURL: URL contains an intent parameter already", function (assert) {
        var sUrl = "http://www.example.com/index.html#Frag-ment?p1=v1";
        var oParameters = {
            "p1": "vX",
            "p2": "v2"
        };

        var sExpectedUrl = "http://www.example.com/index.html#Frag-ment?p1=vX&p2=v2";

        var sResultUrl = oUtils.appendParametersToIntentURL(oParameters, sUrl);

        assert.strictEqual(sResultUrl, sExpectedUrl);
    });

    QUnit.test("appendParametersToIntentURL: URL contains an intent parameter with special characters already", function (assert) {
        var sUrl = "http://www.example.com/index.html#Frag-ment?p1%3d=%3dv1";
        var oParameters = {
            "p2": "v2"
        };

        var sExpectedUrl = "http://www.example.com/index.html#Frag-ment?p1%253D=%253Dv1&p2=v2";

        var sResultUrl = oUtils.appendParametersToIntentURL(oParameters, sUrl);

        assert.strictEqual(sResultUrl, sExpectedUrl);
    });

    QUnit.test("appendParametersToIntentURL: special characters in parameter name and value", function (assert) {
        var sUrl = "http://www.example.com/index.html#Frag-ment";
        var oParameters = {
            "p@1": "100%"
        };

        var sExpectedUrl = "http://www.example.com/index.html#Frag-ment?p%25401=100%2525";

        var sResultUrl = oUtils.appendParametersToIntentURL(oParameters, sUrl);

        assert.strictEqual(sResultUrl, sExpectedUrl);
    });

    QUnit.test("appendParametersToIntentURL: URL contains no fragment", function (assert) {
        var sUrl = "http://www.example.com/index.html";
        var oParameters = {
            "p@1": "100%"
        };

        var sExpectedUrl = "http://www.example.com/index.html?p%401=100%25";

        var sResultUrl = oUtils.appendParametersToIntentURL(oParameters, sUrl);

        assert.strictEqual(sResultUrl, sExpectedUrl);
    });

});

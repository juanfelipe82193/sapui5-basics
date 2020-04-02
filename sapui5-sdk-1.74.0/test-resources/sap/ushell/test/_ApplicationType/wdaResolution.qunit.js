// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/_ApplicationType/wdaResolution"
], function (oWdaResolution) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell._ApplicationType.wdaResolution", {
        beforeEach: function () { },
        afterEach: function () { }
    });

    QUnit.test("module exports an object", function (assert) {
        assert.strictEqual(
            Object.prototype.toString.apply(oWdaResolution),
            "[object Object]",
            "got an object back"
        );
    });

    QUnit.test("resolveEasyAccessMenuIntentWDA: properly handles an Intent without sap-system", function (assert) {

        // Arrange
        var oIntent = {
                params: {
                    "sap-ui2-wd-app-id": ["app1"],
                    "sap-ui2-tcode": undefined,
                    "sap-system": undefined
                }
            },
            fnDone = assert.async();

        assert.expect(1);

        // stubs to get the promise rejected
        // sinon.stub(oSystemAlias, "spliceSapSystemIntoURI")
        //     .returns(new jQuery.Deferred().reject("Error test")
        //         .promise());

        oWdaResolution.resolveEasyAccessMenuIntentWDA(oIntent, null, null, null, null).then(function () {
            assert.ok(false, "Promise was rejected");
        }, function (oError) {
            assert.ok(true, "Promise was rejected");
            fnDone();
        });
    });

});

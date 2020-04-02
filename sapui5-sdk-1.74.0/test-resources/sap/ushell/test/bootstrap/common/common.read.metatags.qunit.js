// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for bootstrap common.read.metatags.js
 */

// If the no config meta tags are present, the code should not throw!
window["expectedMetaTags"] = [];

// check test configuration, whether to run with or without metatags
var testConfig = document.getElementsByName("testConfigurationWithMetaTags")[0];
if (testConfig && testConfig.getAttribute("content") === "true") {
    window["expectedMetaTags"] = [{
        "services": {
            "PluginManager": {
                "config": {
                    "loadPluginsFromSite": true
                }
            },
            "Container": {
                "adapter": {
                    "config": {
                        "systemProperties": {},
                        "userProfile": {
                            "defaults": {
                                "email": "john.doe@sap.com",
                                "firstName": "John",
                                "lastName": "Doe",
                                "fullName": "John Doe",
                                "id": "DOEJ",
                                "language": "EN",
                                "languageBcp47": "en",
                                "sapDateFormat": "1",
                                "tislcal": [],
                                "numberFormat": "",
                                "rtl": false,
                                "sapTimeFormat": "0",
                                "timeZone": "CET"
                            }
                        }
                    }
                }
            }
        }
    },
        {
            "services": {
                "AnotherService": {
                    "config": {
                        "someConfig": "SuperImportantConfiguration"
                    }
                }
            }
        }];
}


sap.ui.require([
    "sap/ushell/bootstrap/common/common.read.metatags"
], function (oMetaTestReader) {

    /* global QUnit */
    "use strict";

    QUnit.module("common.read.metatags", {
        setup: function () {
        },
        teardown: function () {
        }
    });

    [
        {
            testDescription: "provided valid Prefix",
            input: {
                sConfigMetaPrefix: "evaluatedPrefix" // Prefix in the HTML
            },
            expectedResult: window["expectedMetaTags"] || [] // Defined in the HTML
        },
        {
            testDescription: "provided no Prefix",
            input: {},
            expectedResult: []
        },
        {
            testDescription: "provided invalid Prefix (typo)",
            input: {
                sConfigMetaPrefix: "falsePrefix" // Prefix in the HTML
            },
            expectedResult: []
        },
        {
            testDescription: "provided invalid Prefix (wrong datatype: Object instead of String)",
            input: {
                sConfigMetaPrefix: {
                    value: "evaluatedPrefix"
                }
            },
            expectedResult: []
        }
    ].forEach(function (oFixture) {
        QUnit.test("read.metatags when " + oFixture.testDescription, function (assert) {
            var oResult;

            // arrange

            // act
            oResult = oMetaTestReader.readMetaTags(oFixture.input.sConfigMetaPrefix);

            // assert
            assert.deepEqual(oResult, oFixture.expectedResult);
        });
    });
    QUnit.test("read.metatags with a custom parser", function(assert) {
        var aResult;
        aResult = oMetaTestReader.readMetaTags("evaluatedPrefix.crossPlatformDefaults", function (sContent) {
            return Object.keys(JSON.parse(sContent)).length;
        });
        if (window["expectedMetaTags"].length > 0) {
            assert.equal(aResult[0], 1, "meta tag has parsed with custom parser");
        } else {
            assert.equal(aResult.length, 0, "no meta tag found");
        }
    });
});

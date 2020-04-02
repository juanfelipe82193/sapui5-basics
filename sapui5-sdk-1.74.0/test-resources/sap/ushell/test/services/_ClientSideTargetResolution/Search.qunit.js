// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's Search
 */
sap.ui.require([
    "sap/ushell/services/_ClientSideTargetResolution/Search",
    "sap/ushell/services/_ClientSideTargetResolution/VirtualInbounds",
    "sap/ushell/services/URLParsing",
    "sap/ushell/test/utils",
    "sap/ushell/utils"
], function (oSearch, oVirtualInbounds, URLParsing, testUtils, utils) {
    "use strict";

    /* global QUnit sinon */

    var O_COUNT_PARAMETERS = {
        "countDefaultedParams"           : true,
        "countFreeInboundParams"         : true,
        "countMatchingFilterParams"      : true,
        "countMatchingParams"            : true,
        "countMatchingRequiredParams"    : true,
        "countPotentiallyMatchingParams" : true
    };

    /*
     * Removes the count* parameters from each match result (output of
     * getMatchingInbounds) and the priority string.
     *
     * Returns the filtered result (that may contain shallow copies of
     * objects/arrays).
     */
    function removeCountsAndSortString (vMatchResults) {
        var bIsObject = jQuery.isPlainObject(vMatchResults);
        var aMatchResults = bIsObject ? [vMatchResults] : vMatchResults,
            aMutatedMatchResults = aMatchResults.map(function (oMatchResult) {

            return JSON.parse(JSON.stringify(oMatchResult, function (sKey, vVal) {

                return O_COUNT_PARAMETERS.hasOwnProperty(sKey) || sKey === "priorityString" ? undefined : vVal;
            }));
        });

        return bIsObject ? aMutatedMatchResults[0] : aMutatedMatchResults;
    }

    /*
     * Same as (new URLParsing()).parseShellHash(sHash), but removes keys with
     * an undefined value from the result. This makes QUnit happy when
     * comparing the returned results.
     */
    function fnParseShellHashNoUndefined (sHashFragment) {
        var oParsedHash = (new URLParsing).parseShellHash(sHashFragment);
        return Object.keys(oParsedHash).reduce(function (oParsedNoUndefined, sKey) {
            if (typeof oParsedHash[sKey] !== "undefined") {
                oParsedNoUndefined[sKey] = oParsedHash[sKey];
            }
            return oParsedNoUndefined;
        }, {});
    }

    QUnit.module("Search", {
        setup: function () { },
        teardown: function () { }
    });

    [
        /*
         * Test for _matchToInbound.
         *
         * Tests whether a match occurs and any missing references are
         * returned as expected.
         */
        {
            testDescription: "inbound has no signature parameters",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-aBC~CONTXT?ABC=3&DEF=4&/detail/1?A=B",
            oInbound: {
                semanticObject: "SO",
                action: "aBC",
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "inbound has no signature parameters and intent action is undefined",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-aBC~CONTXT?ABC=3&DEF=4&/detail/1?A=B",
            fnAmendParsedShellHash: function (oParsedShellHash) {
                oParsedShellHash.action = undefined; // matches all actions
            },
            oInbound: {
                semanticObject : "SO",
                action: "aBC",
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                }
            }

        },
        {
            testDescription: "inbound has semantic object '*'",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-aBC~CONTXT?ABC=3&DEF=4&/detail/1?A=B",
            oInbound: {
                semanticObject: "*",
                action: "aBC",
                signature: {
                    parameters: {
                        "DEF": {
                            required: true
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "inbound has a required parameter that is not in the hash",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-aBC~CONTXT?ABC=3&DEF=4&/detail/1?A=B",
            oInbound: {
                semanticObject: "*",
                action: "aBC",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "IMPORTANT": {
                            required: true
                        }
                    }
                }
            }

        },
        {
            testDescription: "inbound has a required parameter that is in the hash",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-aBC~CONTXT?ABC=3&DEF=4&/detail/1?A=B",
            oInbound: {
                semanticObject: "*",
                action: "aBC",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "DEF" : {
                            required: true
                        }
                    }
                }
            }

        },
        {
            testDescription: "P1 parameter is not required yet specified with right filter value in shell hash",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act~CONTXT?ABC=3&P1=4&/detail/1?A=B", // P1: 4 matching
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "P1": {
                            required : false,
                            filter: { value: "4" }
                        }
                    }
                }
            }
        },
        {
            testDescription: "plain filter with empty string is specified with required parameter, and not fulfilled",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act~CONTXT?ABC=3&RequiredParam=Value",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "RequiredParam": {
                            required : true,
                            filter: { value: "" }  // actually filters on ""
                        }
                    }
                }
            }
        },
        {
            testDescription: "plain filter with empty string is specified with required parameter, and fulfilled",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act~CONTXT?ABC=3&RequiredParam=",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "RequiredParam": {
                            required : true,
                            filter: { value: "" }  // actually filters on ""
                        }
                    }
                }
            }
        },
        {
            testDescription: "P1 parameter is not required yet specified as the only parameter with right filter value in shell hash",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?P1=4",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "P1": {
                            required: false,
                            filter: { value: "4" }
                        }
                    }
                }
            }
        },
        {
            testDescription: "P1 parameter is not required yet specified as the only parameter with wrong filter value in shell hash",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?P1=3",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "P1": {
                            required : false,
                            filter: { value: "4" }
                        }
                    }
                }
            }
        },
        {
            testDescription: "P1 parameter is not required and not specified but filter implies mandatory",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    additionalParameters: "allowed",
                    parameters: {
                        "P1": {
                            required : false,
                            filter: { value: "4" }
                        }
                    }
                }
            }
        },
        {
            testDescription: "inbound requires default value and regexp filter (5 or 6) for DEF, but DEF is not in shell hash",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?ABC=3&/detail/1?A=B",  // will default to 5
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        // DEF specified -> it can be 5 or 6
                        // DEF not specified -> will default to 5
                        "DEF": { required: true,
                                 filter: { value: "(5)|(6)", format: "regexp" },
                                 defaultValue: { value: "5" }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "inbound requires default value and regexp filter (5 or 6) for DEF, and DEF is 5",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?ABC=3&DEF=6&/detail/1?A=B",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "DEF": { required: true,
                                 filter: { value: "(5)|(6)", format: "regexp"},
                                 defaultValue: { value: "5" }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "inbound requires default value and regexp filter (5 or 6) for DEF, and DEF is 7",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#SO-act?ABC=3&DEF=7&/detail/1?A=B",
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "DEF": { required: true,
                                 filter: { value: "(5)|(6)", format: "regexp"},
                                 defaultValue: { value: "5" }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            /*
             * When a default reference appears in the Tm signature, but this
             * value is specified in oKnownUserDefaultRefsIn, the match occurs,
             * but the oMissingUserDefaultRefsOut object is updated with the
             * user default reference value, indicating the match is a
             * potential match, and could not be fully determined because of
             * one or more missing user default value.
             */
            testDescription: "default value refers to a non-specified user default value",
            expectedMatch: true,           // match occurs but is a potential match...
            expectedMissingUserDefaultRefsOut: {  // ... because the value of this default parameter is unknown
                "UserDefault.currency": true
            },
            sShellHash: "#SO-act",
            oKnownUserDefaultRefsIn: {}, // no user default parameters known
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "currency": {
                            required: false,
                            defaultValue: { // default value must be taken from a user default
                                format: "reference", value: "UserDefault.currency"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            /*
             * When a default reference appears in the Tm signature, and its
             * value is known (i.e., specified in oKnownUserDefaultRefsIn, the match
             * occurs and oMissingUserDefaultRefsOut is left empty, indicating all the
             * references of the Tm were fully resolved.
             */
            testDescription: "default value refers to a specified user default value",
            expectedMatch: true,
            expectedMissingUserDefaultRefsOut: {}, // no output refs as value was provided
            sShellHash: "#SO-act",
            oKnownUserDefaultRefsIn: { "UserDefault.currency" : "value" },  // default value is given
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "currency": {
                            required: false,
                            defaultValue: {
                                format: "reference",
                                value: "UserDefault.currency"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            /*
             * When a filter reference appears in the Inbound signature, and its
             * value is unknown (i.e., not specified in oKnownUserDefaultRefsIn),
             * the match occurs, but the oMissingUserDefaultRefsOut object is
             * updated with the filter reference indicating that the match is a
             * potential match.
             */
            testDescription: "reference value in inbound is unknown",
            expectedMatch: true,           // match occurs but is a potential match...
            expectedMissingUserDefaultRefsOut: {  // ... because the value of this default parameter is unknown
                "UserDefault.currency": true
            },
            sShellHash: "#SO-act?currency=EUR",
            oKnownUserDefaultRefsIn: {}, // no user default parameters known
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "currency": {
                            required: true,
                            filter: { // default value must be taken from a user default
                                format: "reference", value: "UserDefault.currency"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            /*
             * When a default reference appears in the Tm signature, and its
             * value is known (i.e., specified in oKnownUserDefaultRefsIn, the match
             * occurs and oMissingUserDefaultRefsOut is left empty, indicating all the
             * references of the Tm were fully resolved.
             */
            testDescription: "default value refers to a specified user env value",
            expectedMatch: true,
            expectedMissingUserDefaultRefsOut: {}, // no output refs as value was provided
            sShellHash: "#SO-act",
            oKnownUserDefaultRefsIn: { "User.env.sap-language" : "value" },  // default value is given
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "sap-language": {
                            required: false,
                            defaultValue: {
                                format: "reference",
                                value: "User.env.sap-language"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },

        {
            /*
             * When a filter reference appears in the Tm signature, and its
             * value is known (i.e., it's specified in
             * oKnownUserDefaultRefsIn), the match occurs, and the
             * oMissingUserDefaultRefsOut object is left empty, indicating that
             * no references must be resolved in order to determine that match.
             */
            testDescription: "filter reference is known and filter is matching",
            expectedMatch: true,
            expectedMissingUserDefaultRefsOut: {}, // no output refs as value was provided
            sShellHash: "#SO-act?currency=EUR",
            oKnownUserDefaultRefsIn: { "UserDefault.currency" : "EUR" },  // known user default
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "currency": {
                            required: false,
                            defaultValue: {
                                format: "reference",
                                value: "UserDefault.currency"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "filter reference is known and filter is not matching",
            expectedMatch: false,
            expectedMissingUserDefaultRefsOut: {},
            sShellHash: "#SO-act?currency=EUR",
            oKnownUserDefaultRefsIn: { "UserDefault.currency" : "USD" },  // NOTE: USD
            oInbound: {
                semanticObject: "SO", action: "act",
                signature: {
                    parameters: {
                        "currency": {
                            required: true,  // Required parameter
                            filter: {
                                format: "reference",
                                value: "UserDefault.currency"
                            }
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "formFactor is undefined",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#Object-action",
            fnAmendParsedShellHash: function (oParsedShellHash) {
                oParsedShellHash.formFactor = undefined;
            },
            oInbound: {
                semanticObject : "Object",
                action: "action",
                deviceTypes: {
                    desktop: false,
                    phone: false,
                    tablet: false
                },
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "formFactor is desktop",
            expectedMatch: false,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#Object-action",
            fnAmendParsedShellHash: function (oParsedShellHash) {
                oParsedShellHash.formFactor = "desktop";
            },
            oInbound: {
                semanticObject : "Object",
                action: "action",
                deviceTypes: {
                    desktop: false,
                    phone: false,
                    tablet: false
                },
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                }
            }
        },
        {
            testDescription: "required parameter but no filter value or default value is specified",
            expectedMatch: true,
            oKnownUserDefaultRefsIn: {},
            sShellHash: "#Object-action?REQ=",
            oInbound: {
                semanticObject : "Object",
                action: "action",
                deviceTypes: {
                    desktop: false,
                    phone: false,
                    tablet: false
                },
                signature: {
                    parameters: {
                        "REQ": {
                            required: true
                        }
                    },
                    additionalParameters: "allowed"
                }
            }
        }
    ].forEach(function (oFixture) {
        var sOccursOrNot = oFixture.expectedMatch ? "occurs" : "does not occur";

        QUnit.test("match: match " + sOccursOrNot + " when " + oFixture.testDescription, function (assert) {
            var fnCheckAsync = assert.async();

            var oParseSrvc = new URLParsing(),
                oParsedShellHash = oParseSrvc.parseShellHash(oFixture.sShellHash);

            // amend parsed shell hash if test fixture requests so
            if (oFixture.hasOwnProperty("fnAmendParsedShellHash")) {
                oFixture.fnAmendParsedShellHash(oParsedShellHash);
            }

            oSearch.match(
                oParsedShellHash,
                [oFixture.oInbound],
                oFixture.oKnownUserDefaultRefsIn
            ).then(function (oMatchResults) {
                assert.ok(true, "promise was resolved");

                var bMatches = oMatchResults.matchResults.length > 0;

                assert.strictEqual(bMatches, oFixture.expectedMatch,
                    "inbound and intent matching " + sOccursOrNot);

                if (oFixture.hasOwnProperty("expectedMissingUserDefaultRefsOut")) {
                    assert.deepEqual(
                        oMatchResults.missingReferences,
                        oFixture.expectedMissingUserDefaultRefsOut,
                        "obtained expected missing user default refs"
                    );
                }

            }, function () {
                assert.ok(false, "promise was resolved");
            }).then(fnCheckAsync);
        });
    });

    [
        /*
         * matchOne: test whether a match occurs against a test inbound.
         */
        { "url": "ABC=1&DEF=2"         , additionalParameters: "allowed", expectedMatch: true  },
        { "url": "ABC=1&DEF=2"         , additionalParameters: "notallowed", expectedMatch: false },
        { "url": "ABC=1&DEF=2"         , additionalParameters: "ignored", expectedMatch: true  },
        { "url": "ABC=1"               , additionalParameters: "allowed", expectedMatch: true  },
        { "url": "ABC=1&sap-a=true&sap-b=true", additionalParameters: "notallowed", expectedMatch: true  },
        { "url": "ABC=1"               , additionalParameters: "notallowed", expectedMatch: true  },
        { "url": "ABC=1&sap-system=123", additionalParameters: "notallowed", expectedMatch: true  }, // sap-system ignored!
        { "url": "ABC=1"               , additionalParameters: "ignored", expectedMatch: true  },
        { "url": ""                    , additionalParameters: "notallowed", expectedMatch: true  },
        { "url": ""                    , additionalParameters: "notallowed", expectedMatch: true  },
        { "url": ""                    , additionalParameters: "ignored", expectedMatch: true  },
        { "url": "DEF=3"               , additionalParameters: "allowed", expectedMatch: true  },
        { "url": "DEF=3"               , additionalParameters: "notallowed", expectedMatch: false },
        { "url": "DEF=3"               , additionalParameters: "ignored", expectedMatch: true  }
    ].forEach(function (oFixture) {
        var sOccursOrNot = oFixture.expectedMatch ? "occurs" : "does not occur";

        QUnit.test("matchOne: (additional parameters)" + JSON.stringify(oFixture) + " ", function(assert) {
            var oParseSrvc = new URLParsing(),
                oArgs = oParseSrvc.parseShellHash("#SO-aBC~CONTXT?" + oFixture.url);

            oArgs.action = undefined;
            var oMatchResult = oSearch.matchOne(oArgs, {
                    deviceTypes: {
                        desktop: true,
                        phone: true,
                        tablet: true
                    },
                    semanticObject: "SO",
                    action: "aBC",
                    signature: {
                        parameters: {
                            "ABC": {}
                        },
                        additionalParameters: oFixture.additionalParameters
                    }
                },
                {} /* oKnownUserDefaultRefsIn */,
                {} /* oMissingUserDefaultRefsOut */
            );

            assert.equal(oMatchResult.matches, oFixture.expectedMatch, "matching " + sOccursOrNot);
        });
    });

    QUnit.test("matchOne: adds user default parameters to the in/out parameter", function (assert) {
        var oTm = {
                semanticObject: "Object", action: "action",
                signature: {
                    parameters: {
                        userFilter  : { required : true , filter       : { format : "reference", value : "UserDefault.dynamic1" } },
                        userDefault : { required : false, defaultValue : { format : "reference", value : "UserDefault.dynamic2" } },
                        userDefaultExtended : { required : false, defaultValue : { format : "reference", value : "UserDefault.extended.dynamic3" } },
                        noFilter    : { required : true , filter       : { value  : "static1" } },
                        noDefault   : { required : false, defaultValue : { value  : "static2" } }
                    }
                }
            },
            oParsedShellHash = {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "noFilter": ["static1"],
                    // will be ignored, but still this required parameter must
                    // be supplied for the inbound to match.
                    "userFilter": ["DynamicValue1"]
                }
            };

        // Collects the references to user default parameters
        var oMissingUserDefaultRefsOut = {},
            oMatchResult = oSearch.matchOne(oParsedShellHash, oTm, {}, oMissingUserDefaultRefsOut);

        assert.strictEqual(oMatchResult.matches, true, "test shell hash matched one inbound");

        assert.deepEqual(oMissingUserDefaultRefsOut, {
            "UserDefault.dynamic1": true,
            "UserDefault.dynamic2": true,
            "UserDefault.extended.dynamic3": true
        }, "user default parameters were added to the user defaults set");
    });

    (function () {
        /*
         * matchOne: test whether a match occurs with expected result
         */
        var oSampleInboundWithParameterMapping = {
            "action": "toappwithparametermapping",
            "deviceTypes": { "desktop": true, "phone": true, "tablet": true },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample"
            },
            "semanticObject": "Action",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "parameterMapping": {
                "param1": { target: "param2" }
            },
            "title": "Application State Example (Icons)"
        };

        var oSampleInboundWithNoParameterMapping = jQuery.extend(true, {}, oSampleInboundWithParameterMapping);
        oSampleInboundWithNoParameterMapping.action = "toappwithnoparametermapping";
        oSampleInboundWithNoParameterMapping.parameterMapping = {};

        var oSampleInboundWithParameterMappingAndHideIntentLink = jQuery.extend(true, {}, oSampleInboundWithParameterMapping);
        oSampleInboundWithParameterMappingAndHideIntentLink.hideIntentLink = true;

        var oSampleInboundNoPars = {
            "action": "toappnopar",
            "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
            },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample"
            },
            "semanticObject": "Action",
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "title": "Application State Example (Icons)"
        };

        var oSampleInboundWithHideIntentLink = jQuery.extend(true, {}, oSampleInboundNoPars);
        oSampleInboundWithHideIntentLink.hideIntentLink = "propagatedValue"; // should be true or false in theory, but we test it's propagated as is
        oSampleInboundWithHideIntentLink.action = "tohiddentm";

        var oSampleInboundIgnoredPars = {
            "semanticObject": "Action",
            "action": "toappstatesample",
            "deviceTypes": { "desktop": true, "phone": true, "tablet": true },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample",
                "applicationDependencies": "{\"asyncHints\":{\"components\":[{\"name\":\"sap.ushell.demo.AppStateSample\"}]}}"
            },
            "signature": {
                "additionalParameters": "ignored",
                "parameters": {
                    "P1": { "required": true }
                }
            },
            "title": "Application State Example (Icons)"
        };

        var oSampleInbound = {
            "semanticObject": "Action",
            "action": "toappstatesample",
            "deviceTypes": { "desktop": true, "phone": true, "tablet": true },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample",
                "applicationDependencies": "{\"asyncHints\":{\"components\":[{\"name\":\"sap.ushell.demo.AppStateSample\"}]}}"
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {
                    "P1REQ": { "required": true },
                    "P2DEF": { "defaultValue": { "value": "V2Default" }, "required": false },
                    "P3Filter": { "filter": { "value": "P3FilterValue" }, "required": true },
                    "P4FilterRegex": { "filter": { "format": "regexp", "value": "(male)|(female)" }, "required": true }
                }
            },
            "title": "Application State Example (Icons)"
        };

        var oSampleStarInbound = {
            "semanticObject": "Action",
            "action": "*",
            "deviceTypes": { "desktop": true, "phone": true, "tablet": true },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample",
                "applicationDependencies": "{\"asyncHints\":{\"components\":[{\"name\":\"sap.ushell.demo.AppStateSample\"}]}}"
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {
                }
            },
            "title": "Application State Example (Icons)"
        };

        var oSampleInboundWithExtendedUserDefault = {
            "semanticObject": "Action",
            "action": "toappstatesample",
            "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
            },
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                "applicationType": "URL",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample",
                "applicationDependencies": "{\"asyncHints\":{\"components\":[{\"name\":\"sap.ushell.demo.AppStateSample\"}]}}"
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {
                    "P1REQ": { "required": true },
                    "P2DEF": { "defaultValue": { "value": "V2Default" }, "required": false },
                    "P3Filter": { "filter": { "value": "P3FilterValue" }, "required": true },
                    "P4FilterRegex": { "filter": { "format": "regexp", "value": "(male)|(female)" }, "required": true },
                    "P5ExtendedUserDefault": {
                        "defaultValue": {
                            "format": "reference",
                            "value": "UserDefault.extended.P5ExtendedUserDefault"
                        },
                        "required": false
                    }
                }
            },
            "title": "Application State Example (Icons)"
        };

        [
            {
                sShellHash: "#Action-toappstatesample?P1=val1&P2=val2",
                oInbound: oSampleInboundIgnoredPars,
                expectedResult: {
                    "intentParamsPlusAllDefaults": {
                        "P1": ["val1"]
                    },
                    "genericSO": false,
                    "defaultedParamNames": [],
                    "resolutionResult": {
                    },
                    "matches": true,
                    "matchesVirtualInbound": false,
                    "inbound": oSampleInboundIgnoredPars,
                    "parsedIntent": fnParseShellHashNoUndefined("#Action-toappstatesample?P1=val1&P2=val2")
                }
            },
            {
                sShellHash: "#Action-hello",
                oInbound: oSampleStarInbound,
                expectedResult: {
                    "genericSO": false,
                    "inbound": oSampleStarInbound,
                    "matches": false,
                    "noMatchReason": "Action \"hello\" did not match"
                }
            },
            {
                sShellHash: "#Action-toappstatesample?PADDED=123&P1REQ=ABC&P4FilterRegex=male&P3Filter=P3FilterValue",
                oInbound: oSampleInbound,
                expectedResult: {
                    "intentParamsPlusAllDefaults": {
                        "P1REQ": [ "ABC" ],
                        "P2DEF": [ "V2Default" ],
                        "P3Filter": [ "P3FilterValue" ],
                        "P4FilterRegex": [ "male" ],
                        "PADDED": [ "123" ]
                    },
                    "genericSO": false,
                    "defaultedParamNames": ["P2DEF"],
                    "resolutionResult": {},
                    "matches": true,
                    "parsedIntent": fnParseShellHashNoUndefined("#Action-toappstatesample?PADDED=123&P1REQ=ABC&P4FilterRegex=male&P3Filter=P3FilterValue"),
                    "matchesVirtualInbound": false,
                    "inbound": oSampleInbound
                }
            },
            {
                sShellHash: "#Action-toappstatesample?PADDED=123&P2DEF=AAA&P1REQ=ABC&P4FilterRegex=male&P3Filter=P3FilterValue",
                oInbound: oSampleInbound,
                expectedResult: {
                    "genericSO": false,
                    "defaultedParamNames": [],
                    "resolutionResult": {},
                    "matches": true,
                    "parsedIntent": fnParseShellHashNoUndefined("#Action-toappstatesample?PADDED=123&P2DEF=AAA&P1REQ=ABC&P4FilterRegex=male&P3Filter=P3FilterValue"),
                    "matchesVirtualInbound": false,
                    "inbound": oSampleInbound,
                    "intentParamsPlusAllDefaults": {
                        "P1REQ": [ "ABC" ],
                        "P2DEF": [ "AAA" ],
                        "P3Filter": [ "P3FilterValue" ],
                        "P4FilterRegex": [ "male" ],
                        "PADDED": [ "123" ]
                    }
                }
            },
            {
                sShellHash: "#Action-toappstatesample?PADDED=123&P2DEF=AAA&P1REQ=ABC&P4FilterRegex=male&P3Filter=P3FilterValue",
                oInbound: oSampleInboundWithExtendedUserDefault,
                expectedResult: {
                    "intentParamsPlusAllDefaults": {
                        "P1REQ": [ "ABC" ],
                        "P2DEF": [ "AAA" ],
                        "P3Filter": [ "P3FilterValue" ],
                        "P4FilterRegex": [ "male" ],
                        "PADDED": [ "123" ],
                        "P5ExtendedUserDefault": [ { "format": "reference", "value": "UserDefault.extended.P5ExtendedUserDefault" } ]
                    },
                    "genericSO": false,
                    "defaultedParamNames": [],
                    "resolutionResult": {},
                    "matches": true,
                    "parsedIntent": fnParseShellHashNoUndefined("#Action-toappstatesample?PADDED=123&P2DEF=AAA&P1REQ=ABC&P4FilterRegex=male&P3Filter=P3FilterValue"),
                    "matchesVirtualInbound": false,
                    "inbound": oSampleInboundWithExtendedUserDefault
                }
            },
            {
                sShellHash: "#SO-act?ABC=3&DEF=6&/detail/1?A=B",
                oInbound: oSampleInbound,
                expectedResult: {
                    "genericSO": false,
                    "matches": false,
                    "noMatchReason": "Semantic object \"SO\" did not match",
                    "inbound": oSampleInbound
                }
            },
            {
                sShellHash: "#Action-toappnopar",
                oInbound: oSampleInboundNoPars,
                expectedResult: {
                    "matches": true,
                    "parsedIntent": fnParseShellHashNoUndefined("#Action-toappnopar"),
                    "matchesVirtualInbound": false,
                    "inbound": oSampleInboundNoPars,
                    "genericSO": false,
                    "intentParamsPlusAllDefaults": {},
                    "defaultedParamNames": [],
                    "resolutionResult": {
                    }
                }
            },
            {
                /*
                 * Test that if the intent matches with
                 * additionalParameters = "ignore", the sap- parameters
                 * are always appended to the returned URL.
                 */
                sShellHash: "#Action-toappstatesample?sap-client=120&sap-user=USER&P1=requiredToMatch",
                oInbound: oSampleInboundIgnoredPars,
                expectedResult: {
                    "matches": true,
                    "parsedIntent": fnParseShellHashNoUndefined("#Action-toappstatesample?sap-client=120&sap-user=USER&P1=requiredToMatch"),
                    "matchesVirtualInbound": false,
                    "inbound": oSampleInboundIgnoredPars,
                    "genericSO": false,
                    "intentParamsPlusAllDefaults": {
                        "P1": [ "requiredToMatch" ],
                        "sap-client": [ "120" ],
                        "sap-user": [ "USER" ]
                    },
                    "defaultedParamNames": [],
                    "resolutionResult": {}
                }
            },
            {
                /*
                 * Test that hideIntentLink from the intent is not added to
                 * resolutionResult if present and set to true.
                 */
                 sShellHash: "#Action-tohiddentm",
                 oInbound: oSampleInboundWithHideIntentLink,
                 expectedResult: {
                     "inbound": oSampleInboundWithHideIntentLink,
                     "defaultedParamNames": [],
                     "genericSO": false,
                     "intentParamsPlusAllDefaults": {},
                     "matches": true,
                     "parsedIntent": fnParseShellHashNoUndefined("#Action-tohiddentm"),
                     "matchesVirtualInbound": false,
                     "resolutionResult": { }
                 }
            }
        ].forEach(function (oFixture) {

            QUnit.test("matchOne: returns expected result when sShellHash is " + oFixture.sShellHash, function (assert) {

                var oParseSrvc = new URLParsing(),
                    oMatchResult,
                    oParsedShellHash;

                oParsedShellHash = oParseSrvc.parseShellHash(oFixture.sShellHash);
                oMatchResult = removeCountsAndSortString(oSearch.matchOne(
                    oParsedShellHash,
                    oFixture.oInbound,
                    {} /* oKnownUserDefaultRefsIn */,
                    {} /* oMissingUserDefaultRefsOut */
                ));
                //compare full result but ignore property originalInbound
                assert.deepEqual(oMatchResult, oFixture.expectedResult, "expected result was returned");
            });
        });

    })();

    [
        { filter: { value: "(1000)|(2000)",             format: "regexp" },    value: "123410004565" , expectedMatch: false },
        { filter: { value: "(1000)|(2000)",             format: "regexp" },    value: "2000"         , expectedMatch: true  },
        { filter: { value: "(1000)|(2000)",             format: "regexp" },    value: "(1000)|(2000)", expectedMatch: false },
        { filter: { value: ".*",                        format: "regexp" },    value: "random text"  , expectedMatch: true  },
        { filter: { value: "2000",                      format: "regexp" },    value: "(1000)|(2000)", expectedMatch: false },
        { filter: { value: "(1000)|(2000)",             format: "plain"  },    value: "(1000)|(2000)", expectedMatch: true  },
        { filter: { value: "",                          format: "plain" },     value: ""             , expectedMatch: true  },
        { filter: { value: "",                          format: "plain" },     value: undefined      , expectedMatch: false },
        { filter: { value: "UserDefault.val",           format: "reference" }, value: "SomethingElse", expectedMatch: true  },
        { filter: { value: "UserDefault.extended.val",  format: "reference" }, value: "SomethingElse1", expectedMatch: false }
    ].forEach(function(oFixture) {

        function fnValToString(vVal) {
            /* eslint-disable no-nested-ternary */
            return (vVal === null ? "null"
                :  vVal === undefined ? "undefined"
                :  vVal === "" ? '""'
                : "" + vVal).replace("|", " or ");
            /* eslint-enable no-nested-ternary */
        }

        QUnit.test("matchesFilter: matching " + fnValToString(oFixture.value), function (assert) {
            var oMissingUserDefaultRefsOut = {},
                bRes = oSearch.matchesFilter(oFixture.value, oFixture.filter, {}, oMissingUserDefaultRefsOut);

            assert.strictEqual(bRes, oFixture.expectedMatch, "match was performed as expected");

            if (oFixture.filter.format === "reference") {
                if (oFixture.filter.value.indexOf(".extended.") < 0) {
                    // simple user default
                    assert.ok(oMissingUserDefaultRefsOut.hasOwnProperty(oFixture.filter.value),
                        "Filter value found in user default reference object");
                } else {
                    // extended user defaults are not allowed as filter
                    assert.ok(!oMissingUserDefaultRefsOut.hasOwnProperty(oFixture.filter.value),
                        "no Filter value found in user default reference object");
                }
            }
        });
    });

    [ /*
       * checkAdditionalParameters: tests this function for various input
       */
      { name : "none, allowed",
        Inbound: { signature : { additionalParameters : "allowed" }},
        params : "",
        expectedResult :  true },

      { name : "none, spurious, allowed",
        Inbound: { signature : { additionalParameters : "allowed" }},
        params : "P1=1",
        expectedResult : true },

      { name : "same, spurious, allowed",
        Inbound: { signature : { additionalParameters : "allowed",
        parameters : { "P1" : {} }}},
        params : "?P1=1",
        expectedResult : true },

      { name : "same, spurious, notallowed",
        Inbound: { signature : { additionalParameters : "notallowed",
        parameters : { "P1" : {} }}},
        params : "?P1=1",
        expectedResult : true },

      { name : "same, spurious, ignored",
        Inbound: { signature : { additionalParameters : "ignored", parameters : { "P1" : {} }}},
        params : "?P1=1",
        expectedResult : true },

      { name : "same, spurious, allowed",
        Inbound: { signature : { additionalParameters : "allowed",
        parameters : { "P1" : {} }}},
        params : "?P2=1",
        expectedResult : true },

      { name : "same, spurious, notallowed",
        Inbound: { signature : { additionalParameters : "notallowed",
        parameters : { "P1" : {} }}},
        params : "?P2=1",
        expectedResult : false },

      { name : "same, spurious, ignored",
        Inbound: { signature : { additionalParameters : "ignored",
        parameters : { "P1" : {} }}},
        params : "?P2=1",
        expectedResult : true }

    ].forEach(function(oFixture) {

        QUnit.test("checkAdditionalParameters: " + oFixture.name, function (assert) {
            var oEffectiveParams = (new URLParsing()).parseParameters(oFixture.params),
                oResult;

            oResult = oSearch.checkAdditionalParameters(oFixture.Inbound, oEffectiveParams);

            assert.deepEqual(oResult, oFixture.expectedResult,"expected result");
        });
    });

    [
        /*
         * addDefaultParameterValues: tests default parameters are added correctly
         */
        {
            name: "all empty",
            actual: {},
            signatureParameters: {},
            expectedResult: {},
            expectedDefaultedParameterNames: []
        },
        {
            name: "add signature parameter",
            actual: {},
            signatureParameters: {
                "P1": {
                    defaultValue: { value: "V1" }
                }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: { "P1": ["V1"] }
        },
        {
            name: "no change",
            actual: { "P1": ["P1act"] },
            signatureParameters: {
                "P1": {
                    defaultValue: { value: "V1" }
                }
            },
            expectedDefaultedParameterNames: [],
            expectedResult: { "P1": ["P1act"] }
        },
        {
            name: "merge parameters",
            actual: { "P1": ["P1act"] },
            signatureParameters: {
                "P2": {
                    defaultValue: { value: "V2" }
                }
            },
            expectedDefaultedParameterNames: ["P2"],
            expectedResult: {
                "P1": ["P1act"],
                "P2": ["V2"]
            }
        },
        {
            name: "add falsy parameter",
            actual: {},
            signatureParameters: {
                "P1": {
                    defaultValue: { value: false }
                }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: { "P1": [false] }
        },
        {
            name: "add empty parameter",
            actual: {},
            signatureParameters: {
                "P1": {
                    defaultValue: { value: "" }
                }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: { "P1": [""] }
        },
        {
            name: "add undefined parameter",
            actual: {},
            signatureParameters: {
                "P1": {
                    defaultValue: {
                        value: undefined
                    }
                }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: { "P1": [undefined] }
        },
        {
            name: "add reference parameter",
            actual: {},
            signatureParameters: {
                "P1": {
                    defaultValue: {
                        value: "UserDefault.someValue",
                        format: "reference"
                    }
                }
            },
            expectedDefaultedParameterNames: [],
            expectedResult: {
                "P1": [{
                    value: "UserDefault.someValue",
                    format: "reference"
                }]
            }
        },
        {
            name: "add reference and non-reference parameters",
            actual: {},
            signatureParameters: {
                "P1": { defaultValue: { value: "UserDefault.someValue", format: "reference" } },
                "P2": { defaultValue: { value: "Not a reference" } }
            },
            expectedDefaultedParameterNames: ["P2"],
            expectedResult: {
                "P1": [{ value: "UserDefault.someValue", format: "reference" }],
                "P2": ["Not a reference"]
            }
        },
        {
            name: "add empty default values from Inbound signature",
            actual: {},
            signatureParameters: {
                "P1": { defaultValue: { value: "" } }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: {
                "P1": [""]
            }
        },
        {
            name: "add empty default values from Inbound signature, explicit format",
            actual: {},
            signatureParameters: {
                "P1": { defaultValue: { value: "", format: "plain" } }
            },
            expectedDefaultedParameterNames: ["P1"],
            expectedResult: {
                "P1": [""]
            }
        },
        {
            name: "add empty default values from intent parameter",
            actual: {
                "P1": [""]
            },
            signatureParameters: { },
            expectedDefaultedParameterNames: [],
            expectedResult: {
                "P1": [""]
            }
        }
    ].forEach(function(oFixture) {

        QUnit.test("addDefaultParameterValues: " + oFixture.name + " case", function (assert) {
            var aGotDefaultParameters = [],
                oResult = oSearch.addDefaultParameterValues(oFixture.actual, oFixture.signatureParameters, {}, [], aGotDefaultParameters);

            assert.deepEqual(oResult, oFixture.expectedResult, "expected result");
            assert.deepEqual(aGotDefaultParameters.sort(), oFixture.expectedDefaultedParameterNames.sort(), "got expected default parameters");
        });
    });

    QUnit.test("addDefaultParameterValues: the user defaults reference array is filled correctly", function (assert) {
        var oTmParams = {
                "Aparam": { defaultValue: { value: "UserDefault.paramA", format: "reference" } },
                "Bparam": { defaultValue: { value: "UserDefault.paramB", format: "reference" } }
            },
            aUserDefaultRefsIfMatch = [],
            aGotDefaultParameters = [];

        oSearch.addDefaultParameterValues({} /* no intent params */, oTmParams, {}, aUserDefaultRefsIfMatch, aGotDefaultParameters);

        assert.deepEqual(aUserDefaultRefsIfMatch.sort(), ["UserDefault.paramA",  "UserDefault.paramB"].sort(),
            "found expected parameters in user defaults reference array");
        assert.deepEqual(aGotDefaultParameters.sort(), [].sort(), "got expected default parameters");
    });

    QUnit.test("addDefaultParameterValues", function (assert) {
        var oTmParams = {
            "P1": { defaultValue: { value: "4" } },
            "P2": { defaultValue: { value: "3" } }
        };

        var oIntentParams = {
            "P1": ["A", "B"],
            "P1A": ["X"]
        };

        var oIntentParamsPlusDefaults,
            aGotDefaultParameterValues = [];

        oIntentParamsPlusDefaults = oSearch.addDefaultParameterValues(oIntentParams, oTmParams, {}, [], aGotDefaultParameterValues);

        assert.ok(oIntentParamsPlusDefaults.hasOwnProperty("P1"), " P1 present");
        assert.ok(oIntentParamsPlusDefaults.hasOwnProperty("P2"), " P2 present");

        assert.deepEqual(oIntentParamsPlusDefaults, {
            "P1": ["A", "B"],
            "P1A": ["X"],
            "P2": ["3"]
        }, " values");

        oIntentParams.P1.push("C");

        assert.deepEqual(oIntentParamsPlusDefaults, {
            "P1": ["A", "B", "C"],
            "P1A": ["X"],
            "P2": ["3"]
        }, " currently shallow copy !");

        assert.deepEqual(aGotDefaultParameterValues, ["P2"],
            "got expected default parameter values");
    });

    QUnit.test("_matchToInbound: matchesVirtualInbound is set when _isVirtualInbound returns true", function (assert) {
        var oMatchResult,
            oParsedShellHash = {
                semanticObject: "Action",
                action: "search",
                params: Object
            };

        var oTestInbound = { semanticObject: "Action", action: "search", signature: { parameters: {} } };

        sinon.stub(oVirtualInbounds, "isVirtualInbound")
            .returns(true);

        oMatchResult = oSearch.matchOne(
            oParsedShellHash,
            oTestInbound,
            {}, /* refs in */
            {} /* refs out */
        );

        assert.strictEqual(oMatchResult.matches, true, "inbound and intent matching occurred");

        assert.strictEqual(oMatchResult.matchesVirtualInbound, true,
            "the match result has matchesVirtualInbound field set to true");
    });


    [
        { description: "undefined"                               , value: undefined  , expectedValue: undefined },
        { description: "floating point"                          , value: "+100.8"   , expectedValue: 100 }      ,
        { description: "integer"                                 , value: "10"       , expectedValue: 10  }      ,
        { description: "scientific notation"                     , value: "1.23E+5"  , expectedValue: 1   }      ,
        { description: "positive number with trailing characters", value: "+10ABC"   , expectedValue: 10  }      ,
        { description: "negative number"                         , value: "-20"      , expectedValue: -20 }      ,
        { description: "Infinity"                                , value: "Infinity" , expectedValue: undefined },
        { description: "NaN"                                     , value: "NaN"      , expectedValue: undefined },
        { description: "-Infinity"                               , value: "-Infinity", expectedValue: undefined }
    ].forEach(function (oFixture) {
       QUnit.test("_extractSapPriority works as expected when value is " + oFixture.description, function(assert) {
           var obj = {};

           oSearch.extractSapPriority({ "sap-priority" : [oFixture.value]}, obj);
           assert.equal(obj["sap-priority"], oFixture.expectedValue, "expected result");
       });
    });


    [
        {
            testDescription: "Sample inbound + additional parameters allowed",
            oInboundSignature: {
                parameters: {
                    "a": { required: true,  filter: { value: "fv1" }, defaultValue: { value: "fv1" } },
                    "b": { required: true,  filter: { value: "fv2" }                                 },
                    "c": { required: true                                                            },
                    "d": { required: false,                           defaultValue: { value: "dv1" } },
                    "e": { required: false                                                           },
                    "g": { required: true,  filter: { value: "fv3" }, defaultValue: { value: "fv3" } },
                    "i": { required: false,                           defaultValue: { value: "dv2" } },
                    "j": { required: false                                                           }
                },
                additionalParameters: "allowed"
            },
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "a": ["fv1"],
                    "b": ["fv2"],
                    "c": [""],
                    "d": ["dv1"],
                    "e": [""],
                    "l": [""]
                }
            },
            expectedSortString: "AIDM=0 x TECM=0 MTCH=005 MREQ=003 NFIL=002 NDEF=002 POT=006 RFRE=998 TECP=2"
        },
        {
            testDescription: "Sample inbound + additional parameters ignored",
            oInboundSignature: {
                parameters: {
                    "a": { required: true,  filter: { value: "fv1" }, defaultValue: { value: "fv1" } },
                    "b": { required: true,  filter: { value: "fv2" }                                 },
                    "c": { required: true                                                            },
                    "d": { required: false,                           defaultValue: { value: "dv1" } },
                    "e": { required: false                                                           },
                    "g": { required: true,  filter: { value: "fv3" }, defaultValue: { value: "fv3" } },
                    "i": { required: false,                           defaultValue: { value: "dv2" } },
                    "j": { required: false                                                           }
                },
                additionalParameters: "ignored"
            },
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "a": ["fv1"],
                    "b": ["fv2"],
                    "c": [""],
                    "d": ["dv1"],
                    "e": [""],
                    "l": [""],
                    "sap-ui-tech-hint" : ["WDA"]
                }
            },
            expectedSortString: "AIDM=0 x TECM=2 MTCH=005 MREQ=003 NFIL=002 NDEF=002 POT=005 RFRE=998 TECP=2"
        },
        {
            testDescription: "Sample inbound + additional parameters ignored, tech hint off",
            oInboundSignature: {
                parameters: {
                    "a": { required: true,  filter: { value: "fv1" }, defaultValue: { value: "fv1" } },
                    "b": { required: true,  filter: { value: "fv2" }                                 },
                    "c": { required: true                                                            },
                    "d": { required: false,                           defaultValue: { value: "dv1" } },
                    "e": { required: false                                                           },
                    "g": { required: true,  filter: { value: "fv3" }, defaultValue: { value: "fv3" } },
                    "i": { required: false,                           defaultValue: { value: "dv2" } },
                    "j": { required: false                                                           }
                },
                additionalParameters: "ignored"
            },
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "a": ["fv1"],
                    "b": ["fv2"],
                    "c": [""],
                    "d": ["dv1"],
                    "e": [""],
                    "l": [""],
                    "sap-ui-tech-hint" : ["GUI"]
                }
            },
            expectedSortString: "AIDM=0 x TECM=0 MTCH=005 MREQ=003 NFIL=002 NDEF=002 POT=005 RFRE=998 TECP=2"
        },
        {
            testDescription: "Sample inbound + additional parameters ignored, app id hint on",
            oInboundSignature: {
                parameters: {
                    "a": { required: true,  filter: { value: "fv1" }, defaultValue: { value: "fv1" } },
                    "b": { required: true,  filter: { value: "fv2" }                                 },
                    "c": { required: true                                                            },
                    "d": { required: false,                           defaultValue: { value: "dv1" } },
                    "e": { required: false                                                           },
                    "g": { required: true,  filter: { value: "fv3" }, defaultValue: { value: "fv3" } },
                    "i": { required: false,                           defaultValue: { value: "dv2" } },
                    "j": { required: false                                                           }
                },
                additionalParameters: "ignored"
            },
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "a": ["fv1"],
                    "b": ["fv2"],
                    "c": [""],
                    "d": ["dv1"],
                    "e": [""],
                    "l": [""],
                    "sap-ui-app-id-hint" : ["AppStateSample"]
                }
            },
            expectedSortString: "AIDM=1 x TECM=0 MTCH=005 MREQ=003 NFIL=002 NDEF=002 POT=005 RFRE=998 TECP=2"
        },
        {
            /*
             * This tests that the default (technical) parameter with a default
             * value does not increase the count of default parameters as it
             * would normally occur with a regular parameter.
             */
            testDescription: "Inbound with default technical parameter + additional parameters ignored",
            oInboundSignature: {
                "semanticobject": "object",
                "action": "action",
                "parameters": {
                   "sap-ach": {
                      "defaultValue": {
                         "value": "PP-PI-MD",
                         "format": "plain"
                      },
                      "required": false
                   }
                },
                "additionalParameters": "ignored"
            },
            oParsedShellHash: {
                "semanticobject": "object",
                "action": "action",
                "params": { }
            },
            expectedSortString: "AIDM=0 x TECM=0 MTCH=000 MREQ=000 NFIL=000 NDEF=000 POT=000 RFRE=999 TECP=2"
        },
        {
            /*
             * This tests that when a technical parameter appears in the intent
             * it has no influence on any counts a regular parameter would
             * otherwise increase.
             */
            testDescription: "Intent with technical parameter + inbound allowing additional parameters",
            oInboundSignature: {
                "semanticobject": "object",
                "action": "action",
                "parameters": {
                },
                "additionalParameters": "allowed"
            },
            oParsedShellHash: {
                "semanticobject": "object",
                "action": "action",
                "params": {
                    "sap-ach": ["SAP-DEMO"]
                }
            },
            expectedSortString: "AIDM=0 x TECM=0 MTCH=000 MREQ=000 NFIL=000 NDEF=000 POT=000 RFRE=999 TECP=2"
        },
        {
            /*
             * This tests that technical parameters do not influence the count
             * of filter parameters either.
             */
            testDescription: "Intent with technical parameter + inbound allowing additional parameters",
            oInboundSignature: {
                "semanticobject": "object",
                "action": "action",
                "parameters": {
                   "sap-ach": {
                      "filter": {
                         "value": "SAP-DEMO",
                         "format": "plain"
                      },
                      "required": true
                   }
                },
                "additionalParameters": "allowed"
            },
            oParsedShellHash: {
                "semanticobject": "object",
                "action": "action",
                "params": {
                    "sap-ach": ["SAP-DEMO"]
                }
            },
            expectedSortString: "AIDM=0 x TECM=0 MTCH=000 MREQ=000 NFIL=000 NDEF=000 POT=000 RFRE=999 TECP=2"
        }

    ].forEach(function (oFixture) {

        QUnit.test("_matchToInbound: returns expected sort string when " + oFixture.testDescription, function (assert) {
            var oSampleInbound = {
                "semanticObject": "Object", "action": "action",
                "deviceTypes": { "desktop": true, "phone": true, "tablet": true },
                "resolutionResult": {
                    "appId":"AppStateSample",
                    "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppStateSample",
                    "applicationType": "URL",
                    "sap.ui" : { "technology" : "WDA" },
                    "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppStateSample",
                    "applicationDependencies": "{\"asyncHints\":{\"components\":[{\"name\":\"sap.ushell.demo.AppStateSample\"}]}}"
                },

                "signature": oFixture.oInboundSignature,
                "title": "Application State Example (Icons)"
            },
            oMatchResult = oSearch.matchOne(oFixture.oParsedShellHash, oSampleInbound, {}, {});

            assert.strictEqual(oMatchResult.matches, true, "the intent has matched the inbound");
            if (!oMatchResult.matches) {
                return;
            }

            assert.strictEqual(oMatchResult.priorityString, oFixture.expectedSortString, "Got Expected priority string");
        });
    });
});

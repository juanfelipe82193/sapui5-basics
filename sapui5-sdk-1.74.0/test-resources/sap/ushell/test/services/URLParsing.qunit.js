// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.URLParsing
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ui/thirdparty/URI"
], function (
    testUtils,
    utils,
    URI
) {
    "use strict";
    /*global deepEqual, equal, jQuery, module, ok, sap, sinon, stop, start, strictEqual, test, throws*/

    jQuery.sap.require("sap.ushell.services.Container");

    module("sap.ushell.services.URLParsing", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            testUtils.restoreSpies(
                utils.Error
            );
            delete sap.ushell.Container;
        }
    });

    test("getServiceURLParser", function () {
        var oURLParsing = sap.ushell.Container.getService("URLParsing");
        ok(oURLParsing !== undefined);
    });

    test("getShellHash", function () {
        var oSrvc = sap.ushell.Container.getService("URLParsing");
        deepEqual(oSrvc.getShellHash("http://urlabc#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B"),
            "SO-ABC~CONTXT?ABC=3&DEF=4", "full qualified URL");
        deepEqual(oSrvc.getShellHash("#SO-ABC~CONTXT?ABC=3&DEF=4"),
            "SO-ABC~CONTXT?ABC=3&DEF=4", "hash incl #");
        deepEqual(oSrvc.getShellHash("#-st22~CONTXT?ABC=3&DEF=4"),
            "-st22~CONTXT?ABC=3&DEF=4", "empty SO"); // real example
    });

    test("getShellHash bad", function () {
        var oSrvc = sap.ushell.Container.getService("URLParsing");
        deepEqual(oSrvc.getShellHash("123445"), undefined, "bad url");
        deepEqual(oSrvc.getShellHash("SO-ABC~CONTXT?ABC=3&DEF=4"), undefined, "# missing");
    });

    test("getHash", function () {
        var sHash = sap.ushell.Container.getService("URLParsing").getHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        deepEqual(sHash, "SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
    });

    test("getHash", function () {
        var sHash = sap.ushell.Container.getService("URLParsing").getHash("#Sonicht#SO-action");
        deepEqual(sHash, "Sonicht#SO-action");
    });

    // hash parsing functions
    // breakdown a unified shell hash into segments
    // #SO-Action~CONTEXT?a=1&b=2;c=3&/def
    //

    test("parseShellHash SO-ABC", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SO-ABC?");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
        deepEqual(Object.hasOwnProperty(oShellHash, "contextRaw"), false);
        deepEqual(oShellHash.contextRaw, undefined);
    });

    test("parseShellHash SO-ABC2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SO-ABC");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
    });

    test("parseShellHash AppSpecificOnly", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("&/ABCDEF&/HIJ");
        deepEqual({
            "action" : undefined,
            "appSpecificRoute" : "&/ABCDEF&/HIJ",
            "semanticObject" : undefined,
            "contextRaw" : undefined,
            "params": {}
        }, oShellHash);
    });

    test("parseShellHash AppSpecificOnly2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("#&/ABCDEF&/HIJ");
        deepEqual({
            "action" : undefined,
            "appSpecificRoute" : "&/ABCDEF&/HIJ",
            "semanticObject" : undefined,
            "contextRaw" : undefined,
            "params": {}
        }, oShellHash);
    });


    test("parseShellHash #SO-ABC", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("#SO-ABC");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
    });

    test("parseShellHash full", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
        deepEqual(oShellHash.contextRaw, "CONTXT");
        deepEqual(oShellHash.params, { ABC : [ "3A" ], DEF: [ "4B" ]});
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    test("parseShellHash full duplicates", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("/Seman/tic-Action-name~AEFHIJ==?ABC=3&DEF=5&ABC=4&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "/Seman/tic");
        deepEqual(oShellHash.action, "Action-name");
        deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        deepEqual(oShellHash.params, { ABC : ["3", "4"], DEF: [ "5"] });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    test("parseShellHash only SO-ABC", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SO-ABC~CONTXT");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
        deepEqual(oShellHash.contextRaw, "CONTXT");
        deepEqual(oShellHash.params, { });
        deepEqual(oShellHash.appSpecificRoute, undefined);
    });


    test("parseShellHash no params", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SO-ABC~CONTXT&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
        deepEqual(oShellHash.contextRaw, "CONTXT");
        deepEqual(oShellHash.params, { });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });


    test("parseShellHash full no route", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("/Seman/tic-Action-name~AEFHIJ==?ABC=3&DEF=5&ABC=4%205");
        deepEqual(oShellHash.semanticObject, "/Seman/tic");
        deepEqual(oShellHash.action, "Action-name");
        deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        deepEqual(oShellHash.params, { ABC : [ "3", "4 5" ], DEF: [ "5" ] });
        deepEqual(oShellHash.hasOwnProperty("appSpecificRoute"), true);
        deepEqual(oShellHash.appSpecificRoute, undefined);
    });

    test("parseShellHash full no params", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("/Seman/tic-/Act/ion-name~AEFHIJ==?&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "/Seman/tic");
        deepEqual(oShellHash.action, "/Act/ion-name");
        deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        deepEqual(oShellHash.params, { });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    test("parseShellHash no context", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("/Seman/tic-/Act/ion-name?&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "/Seman/tic");
        deepEqual(oShellHash.action, "/Act/ion-name");
        deepEqual(oShellHash.contextRaw, undefined);
        deepEqual(oShellHash.params, { });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    test("parseShellHash only app specific part", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, undefined);
        deepEqual(oShellHash.action, undefined);
        deepEqual(oShellHash.action, undefined);
        deepEqual(oShellHash.contextRaw, undefined);
        deepEqual(oShellHash.params, { });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    test("parseParameters", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").parseParameters("?ABC=3A&DEF=4B");
        deepEqual(oRes, { ABC : [ "3A" ], DEF: [ "4B" ]});
    });

    test("parseParameters Empty", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").parseParameters("?");
        deepEqual(oRes, {});
    });

    test("parseParameters Empty2", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").parseParameters("");
        deepEqual(oRes, {});
    });

    test("parseParameters", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").parseParameters("?ABC=3A&DEF=4B");
        deepEqual(oRes, { ABC : [ "3A" ], DEF: [ "4B" ]});
    });

    test("constructShellHash FullNoRoute", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "/Seman/tic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                ABC : [ "3", "4" ],
                DEF : [ "5" ]
            }
        });
        deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4&DEF=5", sShellHash);
    });

    test("constructShellHash Param URL encoding", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "Semantic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                "/AB=D/EF" : [ "5" ],
                "/AB/C" : [ "3", "4 5" ]
            }
        });
        deepEqual(sShellHash, "Semantic-Action-name~AEFHIJ==?%2FAB%2FC=3&%2FAB%2FC=4%205&%2FAB%3DD%2FEF=5", " escaped");
    });

    test("constructShellHash Param URL encoding & parseShellHash decode ", function () {
        var oUrlParsingService,
            sShellHash,
            oShellHashInput,
            oShellHashOutput;
        // Arrange
        oUrlParsingService = sap.ushell.Container.getService("URLParsing");
        oShellHashInput = {
            target : {
                semanticObject : "Semantic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                "AB" : [ "Post", "P&G 4711" ],
                "CD" : [ "3", "4 5" ]
            }
        };
        // Act
        sShellHash = oUrlParsingService.constructShellHash(oShellHashInput);
        // Assert
        deepEqual(sShellHash, "Semantic-Action-name~AEFHIJ==?AB=Post&AB=P%26G%204711&CD=3&CD=4%205", " escaped");
        // Act
        oShellHashOutput = oUrlParsingService.parseShellHash(sShellHash);
        // Assert
        deepEqual(oShellHashOutput.params, oShellHashInput.params, " parsed");
    });

    test("constructShellHash URL encoding", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "Semantic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                DEF : [ "5" ],
                ABC : [ "3", "4 5" ]
            }
        });
        deepEqual("Semantic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5", sShellHash);
    });

    test("constructShellNoWarnOnNoArray", function () {
        var spyjQueryLogError = sinon.spy(jQuery.sap.log, "error"),
            sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
                target : {
                    semanticObject : "Semantic",
                    action : "Action-name"
                },
                params : {
                    DEF : [ "5" ],
                    ABC : [ "3" ]
                }
            });
        deepEqual("Semantic-Action-name?ABC=3&DEF=5", sShellHash);
        deepEqual(false, spyjQueryLogError.called, "Error not called");
        spyjQueryLogError.restore();
    });


    test("constructShellWarnOnArray", function () {
        var spyjQueryLogError = sinon.spy(jQuery.sap.log, "error"),
            sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
                target : {
                    semanticObject : "Semantic",
                    action : "Action-name"
                },
                params : {
                    DEF : [ "5" ],
                    ABC : [ "3", "4 5" ]
                }
            });
        deepEqual("Semantic-Action-name?ABC=3&ABC=4%205&DEF=5", sShellHash);
        deepEqual(true, spyjQueryLogError.called, "Error called");
        deepEqual(true, spyjQueryLogError.calledWith("Array startup parameters violate the designed intent of the Unified Shell Intent, use only single-valued parameters!"), "correct arg");
        spyjQueryLogError.restore();
    });


    test("constructShellHashOrder", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "/Seman/tic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                DEF : [ "5" ],
                ABC : [ "3", "4 5" ]
            },
            appSpecificRoute : "&/soso"
        });
        deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5&/soso", sShellHash);
    });

    test("constructApp State sap-xapp-state", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "/Seman/tic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                DEF : [ "5" ],
                ABC : [ "3", "4 5" ],
                aaa : 4,
                zzz : 5
            },
            appStateKey : "ODLORIS",
            appSpecificRoute : "&/soso"
        });
        deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5&aaa=4&sap-xapp-state=ODLORIS&zzz=5&/soso", sShellHash);
    });


    test("constructShellHashSemiFlat", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "/Seman/tic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                DEF : "5",
                ABC : [ "3", "4" ]
            }
        });
        deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4&DEF=5", sShellHash);
    });

    test("constructShellHashSpecified", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : "#ABC-def?ABC=%2520A"
            }
        });
        deepEqual("ABC-def?ABC=%2520A", sShellHash);
    });

    test("constructShellHashSpecifiedWithIntern", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : "ABC-def?ABC=%2520A&/ABC/HKL"
            }
        });
        deepEqual("ABC-def?ABC=%2520A&/ABC/HKL", sShellHash);
    });

    test("constructShellWithHash", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : "#"
            }
        });
        deepEqual("", sShellHash);
    });

    test("constructShellHashEmpty", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : ""
            }
        });
        deepEqual("", sShellHash);
    });

    test("constructShellHashUNDEF", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : undefined
            }
        });
        deepEqual("", sShellHash);
    });

    test("constructShellHashAppSpecific", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "ABC",
                action : "Hugo"
            },
            appSpecificRoute : "&/EINBAYER"
        });
        deepEqual("ABC-Hugo&/EINBAYER", sShellHash);
    });

    test("constructShellHashEmptyAppSpecific", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : ""
            },
            appSpecificRoute : "&/EINBAYER"
        });
        deepEqual("&/EINBAYER", sShellHash);
    });

    test("constructShellHashEmptyTarget", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {}
        });
        deepEqual("", sShellHash);
    });

    test("constructShell HashNoParam", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "/Seman/tic",
                action : "Action-name"
            }
        });
        deepEqual("/Seman/tic-Action-name", sShellHash);
    });

    test("splitHash", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash(
            "#Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH"
        );
        deepEqual({
            shellPart : "Object-name~AFE2==?PV1=PV2&PV4=V5",
            appSpecificRoute : "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    test("splitHash2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash(
            "Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH"
        );
        deepEqual({
            shellPart : "Object-name~AFE2==?PV1=PV2&PV4=V5",
            appSpecificRoute : "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    test("splitHash3", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("Object-name~AFE2==?PV1=PV2&/SOSO?DEF&/IST&k=3");
        deepEqual({
            shellPart : "Object-name~AFE2==?PV1=PV2",
            appSpecificRoute : "&/SOSO?DEF&/IST&k=3"
        }, sShellHash);
    });

    test("splitHashOnlyShellPart", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash("shell-Part?DEF=HIJ&K=B");
        deepEqual({
            shellPart : "shell-Part?DEF=HIJ&K=B",
            appSpecificRoute : undefined
        }, oShellHash);
    });

    test("splitHashOnlyBadShellPart", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash("shellPart?DEF-ABC");
        deepEqual({
        }, oShellHash);
    });

    test("splitHashOnlyAppSpecific", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash(
            "&/display/detail/7?UU=HH"
        );
        deepEqual({
            shellPart : "",
            appSpecificRoute : "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    test("splitHashRobust", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash("");
        deepEqual({}, oShellHash);
    });

    test("splitHashRobust2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#");
        deepEqual({}, oShellHash);
    });


    test("splitHashRobust3", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "" }, sShellHash);
    });

    test("splitHashParamApp", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#?HIJ=KLM&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "?HIJ=KLM" }, sShellHash);
    });

    test("splitHashRobust3b", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "" }, sShellHash);
    });

    test("splitHashRobust3c", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#A-B?&&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&" }, sShellHash);
    });

    test("splitHashRobustBadc", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#A-B&&/HIJ");
        deepEqual({ }, sShellHash);
    });

    test("splitHashRobustAmp", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#A-B?&&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&" }, sShellHash);
    });

    test("splitHashRobustAmpAmp", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#A-B?&&&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&&" }, sShellHash);
    });

    test("splitHashRobust4", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("NOTAHASH&/HIJ");
        deepEqual({ }, sShellHash);
    });

    test("splitHashRobust4b", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#YES-AHASH&/HIJ&/KLM");
        deepEqual({ appSpecificRoute : "&/HIJ&/KLM", shellPart : "YES-AHASH" }, sShellHash);
    });


    test("splitHashRobust4c", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("YES-AHASH&/HIJ&/KLM");
        deepEqual({ appSpecificRoute : "&/HIJ&/KLM", shellPart : "YES-AHASH" }, sShellHash);
    });

    test("splitHashRobust5", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("NOTAHASH&/HIJ&/KLM");
        deepEqual({ }, sShellHash);
    });

    test("parseShellHashBad1", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SOABC?");
        deepEqual(undefined, oShellHash);
    });

    test("parseShellHashAppOnly2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("&/DEF&/HIJ");
        deepEqual({
            "action": undefined,
            "appSpecificRoute": "&/DEF&/HIJ",
            "contextRaw": undefined,
            "params": {},
            "semanticObject": undefined
        }, oShellHash);
    });

    test("parseShellParamsAndHashOnly2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("?A=B&E=K&/DEF&/HIJ");
        deepEqual({
            "action": undefined,
            "appSpecificRoute": "&/DEF&/HIJ",
            "contextRaw": undefined,
            "params": { A: ["B"], E: ["K"]},
            "semanticObject": undefined
        }, oShellHash);
    });

    test("parseShellHashBad3", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("NOHASH&/DEF&/HIJ");
        deepEqual(undefined, oShellHash);
    });


    test("parseShellHashAppOnly3b", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("#&/DEF&/HIJ");
        deepEqual({
            "action": undefined,
            "appSpecificRoute": "&/DEF&/HIJ",
            "contextRaw": undefined,
            "params": {},
            "semanticObject": undefined
        }, oShellHash);
    });


    // end of hash breakdown

// sample usage

    test("getServiceURLParser", function () {
        //var oURLParsing = sap.ushell.Container.getService("URLParsing");
        var oURLParsing = sap.ushell.Container.getService("URLParsing"),
            sShellHash,
            sHash,
            oShellHash;

        ok(oURLParsing !== undefined);

        // extract hash from url

        sShellHash = oURLParsing.getShellHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        deepEqual("SO-ABC~CONTXT?ABC=3&DEF=4", sShellHash);

        sHash = oURLParsing.getHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        deepEqual("SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B", sHash);

        // break down hash into parts
        oShellHash = oURLParsing.parseShellHash("SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
        deepEqual(oShellHash.contextRaw, "CONTXT");
        deepEqual(oShellHash.params, { ABC : ["3A"], DEF: ["4B"] });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");

    });

    function testAddSystemToServiceUrl(sCurrentResolution, sUrl, sExpectedUrl, vComponentOrSystem) {
        var oURLParsing = sap.ushell.Container.getService("URLParsing"),
            oNTR = sap.ushell.Container.getService("NavTargetResolution");

        if (oNTR.getCurrentResolution.restore) {
            oNTR.getCurrentResolution.restore();
        }
        sinon.stub(oNTR, "getCurrentResolution").returns({
            url: sCurrentResolution
        });
        strictEqual(oURLParsing.addSystemToServiceUrl(sUrl, vComponentOrSystem), sExpectedUrl,
            "[" + sCurrentResolution + "] " + sUrl + " -> " + sExpectedUrl);

        ok(sap.ushell.Container.addRemoteSystemForServiceUrl.calledWith(sExpectedUrl));

    }

    test("addSystemToServiceUrl, success", function () {
        var oURLParsing = sap.ushell.Container.getService("URLParsing");

        sinon.spy(sap.ushell.Container, "addRemoteSystemForServiceUrl");

        strictEqual(oURLParsing.addSystemToServiceUrl("/sap/opu/odata/MyService"),
            "/sap/opu/odata/MyService");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService",
            "/sap/opu/odata/MyService");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService/MyEntities");

        // see corresponding tests in /services/src/main/webapp/test/sap/ui2/srvc/catalog.qunit.js
        // URLs without system and without parameters
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/",
            "/;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap",
            "/sap;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba/foo",
            "/sap/hba/foo;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba;o=quertz/foo",
            "/sap/hba;o=quertz/foo");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap;bar=baz/hba/foo",
            "/sap;bar=baz/hba/foo;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba/foo;bar=baz",
            "/sap/hba/foo;bar=baz;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=SYS/");

        // URLs with system (marker) and without parameters
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=",
            "/sap/opu/odata/MyService;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/Pages/$count",
            "/sap/opu/odata/MyService;o=SYS/Pages/$count");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=xyz/Pages/$count",
            "/sap/opu/odata/MyService;o=xyz/Pages/$count");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=xyz/",
            "/sap/opu/odata/MyService;o=xyz/");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=;a/",
            "/sap/opu/odata/MyService;o=SYS;a/");

        // URLs with parameters
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/?p1=v1&p2=v2",
            "/sap/opu/odata/MyService;o=SYS/?p1=v1&p2=v2");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=v1&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=v1&p2=v2");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=spec/ial&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=spec/ial&p2=v2");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=;o=/&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=;o=/&p2=v2");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=;o=XYZ&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=;o=XYZ&p2=v2");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/UI2/PAGE_BUILDER_CUST;o=?p=a/",
            "/sap/opu/odata/UI2/PAGE_BUILDER_CUST;o=SYS?p=a/");

        // system passed as parameter
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=system/",
            "system");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=system/MyEntities",
            "system");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=system/MyEntities",
            "system");

        // system is a component with startup parameters
        var oComponent = new sap.ui.core.Component({ componentData : { startupParameters : { "sap-system" : [ "SYS1"]}}});
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=SYS1/",
            oComponent);
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=SYS1/MyEntities",
            oComponent);
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
                "/sap/opu/odata/MyService",
                "/sap/opu/odata/MyService;o=SYS1",
                oComponent);
        // present segment is *not* overwritten
        testAddSystemToServiceUrl("irrelevant",
            "/sap/opu/odata/MyService;o=SYSA/MyEntities",
            "/sap/opu/odata/MyService;o=SYSA/MyEntities",
            oComponent);
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
                "/sap/hana/odata/MyService/",
                "/sap/hana/odata/MyService;o=SYS1/",
                oComponent);
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
                "/cus/srv/",
                "/cus/srv;o=SYS1/",
                oComponent);
        // if an ;mo segment is present, no amendment!
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
                "/sap/hana/odata/MyService;mo/",
                "/sap/hana/odata/MyService;mo/",
                oComponent);
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
                "/sap/hana/odata/MyService;o=SYSX/",
                "/sap/hana/odata/MyService;o=SYSX/",
                oComponent);

        // component without component data, no fallback to use NavTargetResolution result!
        oComponent = new sap.ui.core.Component({ componentData : { startupParameters : { "nosystem" : [ "SYS1"]}}});
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
                "/cus/srv/",
                "/cus/srv/",
                oComponent);
        // component without component data function, no fallback to use NavTargetResolution result!
        oComponent = new sap.ui.core.Component({ componentData : { startupParameters : { "sap-system" : [ "SYS1"]}}});
        oComponent.getComponentData = 1234;
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYSIRRELEVANT",
                "/cus/srv/",
                "/cus/srv/",
                oComponent, "no fallback");
    });

    test("addSystemToServiceUrl, failures", function () {
        var oURLParsing = sap.ushell.Container.getService("URLParsing");

        sinon.spy(utils, "Error");
        sinon.spy(sap.ushell.Container, "addRemoteSystemForServiceUrl");
        [undefined, "", "./foo", "sap/hba/foo", "//foo.com/bar",
             "http://foo.com/bar"].forEach(function (sUrl) {
                 utils.Error.reset();
            throws(function () {
                oURLParsing.addSystemToServiceUrl(sUrl);
            }, /Invalid URL/, "'" + sUrl + "' fails");
            ok(utils.Error.calledWith("Invalid URL: " + sUrl,
                "sap.ushell.services.URLParsing"));
            ok(sap.ushell.Container.addRemoteSystemForServiceUrl.notCalled);
        });
    });
    var ourURI = (new URI(window.location.href)).normalize();
    var ourUriFullResource = ourURI.protocol() + "://" + ourURI.host() + ourURI.pathname();
    [ { sUrl: "#SO-action?ABC=DEF&HIJ=KKK&/sogehts#doch", bResult : true },
      { sUrl: "#SOnixtion?ABC=DEF&HIJ=KKK&/sogehts#SO-action", bResult : false },
      { sUrl: "http://www.sap.com:8080/some/path#SO-action?ABC=DEF&HIJ=KKK", bResult : false },
      { sUrl: "this:\\:isnourlpath#SO-action?ABC=DEF&HIJ=KKK", bResult : false },
      { sUrl: "http://:8080/nourl/:8080/urlpath#SO-action?ABC=DEF&HIJ=KKK", bResult : false },
      { sUrl: "#", bResult : false },
      { sUrl: {}, bResult : false },
      { sUrl: ourUriFullResource + "#So-action", bResult : true },
      { sUrl: ourUriFullResource + "?irr=relevant#So-action", bResult : true },
      { sUrl: ourUriFullResource + "?irr=relevant#So-action~ctx?abc=def&aaa?=sxx=x&eee&/ddd", bResult : true },
      { sUrl: ourUriFullResource + "?irr=relevant#Sonicht", bResult : false },
      { sUrl: ourUriFullResource + "?irr=relevant", bResult : false }
    ].forEach(function (oFixture) {
        test("isIntentUrl : " + oFixture.sUrl, function () {
            var oURLParsing = sap.ushell.Container.getService("URLParsing"),
                bResult;
            //Test:
            bResult = oURLParsing.isIntentUrl(oFixture.sUrl);
            //Check:
            equal(bResult, oFixture.bResult, "expected result");
        });
      });
});

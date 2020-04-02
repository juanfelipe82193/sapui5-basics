// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.URLShortening
 */
sap.ui.require([], function () {
    "use strict";

    /* global deepEqual, equal, module, ok, stop, start, test, sinon */

    jQuery.sap.require("sap.ushell.services.Container");

    var oldURL_LENGTH_LIMIT = 1024,
        oldURL_PARAMS_LENGTH_LIMIT = 512;

    function saveLengthLimit (shortener) {
        oldURL_LENGTH_LIMIT = shortener.URL_LENGTH_LIMIT;
        shortener.URL_LENGTH_LIMIT = 60;
        oldURL_PARAMS_LENGTH_LIMIT = shortener.URL_PARAMS_LENGTH_LIMIT;
        shortener.URL_PARAMS_LENGTH_LIMIT = 20;
    }

    function restoreLengthLimit (shortener) {
        shortener.URL_LENGTH_LIMIT = oldURL_LENGTH_LIMIT;
        shortener.URL_PARAMS_LENGTH_LIMIT = oldURL_PARAMS_LENGTH_LIMIT;
    }

    module("sap.ushell.services.URLShortening", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        // This method is called after each test. Add every restoration code here.
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("getServiceURLShortening", function () {
        var oURLShortening = sap.ushell.Container.getService("URLShortening");
        ok(oURLShortening !== undefined);
    });

    test("shortenURLEmpty", function () {
        // prepare test
        var oService = sap.ushell.Container.getService("URLShortening");
        deepEqual({ hash: "#" }, oService.compactHash("#"));
        deepEqual({ hash: "#ABC-DEF~HIJ&/ABC=DEF" }, oService.compactHash("#ABC-DEF~HIJ&/ABC=DEF"));
    });

    test("testcheckHashLengthNoTruncation", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            aTruncatedURL,
            aLongUrl;
        saveLengthLimit(shortener);
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&/detail/1?A=B";
        sHash = shortener.checkHashLength(aLongUrl);
        aTruncatedURL = "#SO-ABC~CONTXT?ABC=3&/detail/1?A=B";
        deepEqual(sHash.hash, aTruncatedURL, " original url in hash");
        deepEqual(sHash.params, undefined, "no params as url fits length");
        restoreLengthLimit(shortener);
    });

    test("testcheckHashLengthTruncation", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            aTruncatedURL,
            aLongUrl;
        saveLengthLimit(shortener);
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&HIJ=AAAAAAAAAAAAAABBBBBBBBBBBB&AKLM=JJJJJJ&CFUN=JJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.checkHashLength(aLongUrl);
        aTruncatedURL = "#SO-ABC~CONTXT?ABC=3&AKLM=JJJJJJ&/detail/1?A=B";
        deepEqual(aTruncatedURL, sHash.hash);
        deepEqual({ "ABC": ["3"], "AKLM": ["JJJJJJ"] }, sHash.params);
        deepEqual({ HIJ: ["AAAAAAAAAAAAAABBBBBBBBBBBB"], "DEF": ["4"], CFUN: ["JJJJJJJJJJJJ"] }, sHash.skippedParams);
        restoreLengthLimit(shortener);
    });

    test("testcheckHashLength", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            aTruncatedURL,
            aLongUrl,
            stubLogError;
        saveLengthLimit(shortener);
        stubLogError = sinon.spy(jQuery.sap.log, "error");
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.checkHashLength(aLongUrl);
        aTruncatedURL = "#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B";
        deepEqual(aTruncatedURL, sHash.hash);
        deepEqual({ "ABC": ["3"], "DEF": ["4"] }, sHash.params);
        deepEqual({ "DEF": ["AAAAAAAAAAAAAABBBBBBBBBBBB", "JJJJJJJJJJJJJJJJJJ"] }, sHash.skippedParams);
        deepEqual(true, stubLogError.called, "LogError called");
        stubLogError.restore();
        restoreLengthLimit(shortener);
    });

    test("testcheckHashArrayWarn", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            aTruncatedURL,
            aLongUrl,
            stubLogError;
        saveLengthLimit(shortener);
        stubLogError = sinon.spy(jQuery.sap.log, "error");
        aLongUrl = "#SO-ABC~CONTXT?DEF=4&DEF=A&DEF=B&/detail/1?A=B&KKKK=DFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
        sHash = shortener.checkHashLength(aLongUrl);
        aTruncatedURL = "#SO-ABC~CONTXT?DEF=4&DEF=A&DEF=B&/detail/1?A=B&KKKK=DFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
        deepEqual(sHash.hash, aTruncatedURL, "Truncated URL ok");
        deepEqual(stubLogError.called, true, "LogError called");
        stubLogError.restore();
        restoreLengthLimit(shortener);
    });

    test("smokeShortenExpand", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl,
            store = {},
            stubRetrieve,
            stubStore;
        saveLengthLimit(shortener);
        stubStore = sinon.stub(shortener, "_storeValue", function (sKey, sValue) {
            store[sKey] = sValue;
        });
        stubRetrieve = sinon.stub(shortener, "_retrieveValue", function (sKey) {
            return store[sKey];
        });

        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.compactHash(aLongUrl, undefined, {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        deepEqual("#SO-ABC~CONTXT?ABC=3&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=AGUID&/detail/1?A=B", sHash);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(aLongUrl, sHashRestored, "expanded hash");
        stubRetrieve.restore();
        stubStore.restore();
        restoreLengthLimit(shortener);
    });
    test("smokeShortenExpandOrder", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl,
            store = {},
            stubRetrieve,
            stubStore;
        saveLengthLimit(shortener);
        stubStore = sinon.stub(shortener, "_storeValue", function (sKey, sValue) {
            store[sKey] = sValue;
        });
        stubRetrieve = sinon.stub(shortener, "_retrieveValue", function (sKey) {
            return store[sKey];
        });
        aLongUrl = "#SO-ABC~CONTXT?ARC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&ABC=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.compactHash(aLongUrl, undefined, {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        deepEqual(sHash, "#SO-ABC~CONTXT?" + shortener.ABBREV_PARAM_NAME + "=AGUID&/detail/1?A=B", "Compacted hash");
        sHashRestored = shortener.expandHash(sHash);
        deepEqual("#SO-ABC~CONTXT?ABC=JJJJJJJJJJJJJJJJJJ&ARC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&/detail/1?A=B", sHashRestored, "Compare restored hash");
        stubRetrieve.restore();
        stubStore.restore();
        restoreLengthLimit(shortener);
    });

    test("shortenExpandNoAppHash", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl,
            store = {},
            stubRetrieve,
            stubStore;
        saveLengthLimit(shortener);
        stubStore = sinon.stub(shortener, "_storeValue", function (sKey, sValue) {
            store[sKey] = sValue;
        });
        stubRetrieve = sinon.stub(shortener, "_retrieveValue", function (sKey) {
            return store[sKey];
        });
        aLongUrl = "#SO-ABC~CONTXT?A=3&A=4&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ";
        sHash = shortener.compactHash(aLongUrl, undefined, {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        deepEqual(sHash, "#SO-ABC~CONTXT?A=3&A=4&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=AGUID", "correct shortend hash");
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(sHashRestored, aLongUrl, "expansion worked");
        stubRetrieve.restore();
        stubStore.restore();
        restoreLengthLimit(shortener);
    });

    test("also Shortening for navResCtx (there use to be a WDA startup hack)", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl,
            store = {},
            stubRetrieve,
            stubStore;
        saveLengthLimit(shortener);
        stubStore = sinon.stub(shortener, "_storeValue", function (sKey, sValue) {
            store[sKey] = sValue;
        });
        stubRetrieve = sinon.stub(shortener, "_retrieveValue", function (sKey) {
            return store[sKey];
        });
        aLongUrl = "#SO-ABC~navResCtx?A=3&A=4&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ";
        sHash = shortener.compactHash(aLongUrl, undefined, {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        deepEqual(sHash, "#SO-ABC~navResCtx?A=3&A=4&DEF=4&sap-intent-param=AGUID", "shortening occurred");
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(aLongUrl, sHashRestored);
        stubRetrieve.restore();
        stubStore.restore();
        restoreLengthLimit(shortener);
    });

    test("shortenAndRawxappStateExpand", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl,
            cnt = 0,
            store = {},
            stubRetrieve,
            stubStore;
        saveLengthLimit(shortener);
        stubStore = sinon.stub(shortener, "_storeValue", function (sKey, sValue) {
            store[sKey] = sValue;
        });
        stubRetrieve = sinon.stub(shortener, "_retrieveValue", function (sKey) {
            return store[sKey];
        });
        aLongUrl = "#SO-ABC~CONTXT?A=3&A=4&DEF=4&sap-xapp-state=" + encodeURIComponent(JSON.stringify({ a: 1 })) + "&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ";
        sHash = shortener.compactHash(aLongUrl, undefined, {
            getNextKey: function () {
                cnt = cnt + 1;
                return "AGUID" + cnt;
            }
        }).hash;
        deepEqual(sHash, "#SO-ABC~CONTXT?" + shortener.ABBREV_PARAM_NAME + "=AGUID2&sap-xapp-state=AGUID1", "correct compacterd hash");
        equal(stubStore.callCount, 2);
        deepEqual(stubStore.args[0][0], "AGUID1", "correct key passed for storing sap-xapp-state");
        deepEqual(stubStore.args[0][1], { a: 1 }, "correct value passed for storing");
        deepEqual(stubStore.args[1][0], "AGUID2", "correct key passed for storing 2nd call (sap-intent-param)");
        deepEqual(stubStore.args[1][1], "A=3&A=4&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ", "correct value passed for storing");
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(sHashRestored, "#SO-ABC~CONTXT?A=3&A=4&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&sap-xapp-state=AGUID1", "correct expanded long url");
        stubRetrieve.restore();
        stubStore.restore();
        restoreLengthLimit(shortener);
    });

    test("expandNoStorage", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            unresolveableShortendURL,
            sHashRestored;
        saveLengthLimit(shortener);
        shortener.URL_LENGTH_LIMIT = 60;
        shortener.URL_PARAMS_LENGTH_LIMIT = 20;
        sHash = shortener.compactHash("#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B", undefined, {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        sHash = sHash.replace(/AGUID/, "BGUID");
        unresolveableShortendURL = "#SO-ABC~CONTXT?ABC=3&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=BGUID&/detail/1?A=B";
        deepEqual(unresolveableShortendURL, sHash);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(sHash, sHashRestored);
        restoreLengthLimit(shortener);
    });

    test("expandParamGivenRetrievalFunction", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sExpandedHash;
        sExpandedHash = shortener.expandParamGivenRetrievalFunction("#SO-Action?HIJ=5&ABC=3&DEF=4", "DEF", function (sKey) {
            deepEqual(sKey, "4", "correct Key");
            return "AAA=33&AAA=44&ZZZ=5";
        });
        deepEqual(sExpandedHash, "#SO-Action?AAA=33&AAA=44&ABC=3&HIJ=5&ZZZ=5", "expansion occurred");
    });

    test("expandParamGivenRetrievalFunction key not present", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sExpandedHash;
        sExpandedHash = shortener.expandParamGivenRetrievalFunction("#SO-Action?HIJ=5&ABC=3&DEF=4", "GIBTSNICHT", function () {
            return undefined;
        });
        deepEqual(sExpandedHash, "#SO-Action?HIJ=5&ABC=3&DEF=4", "original url returned");
    });

    test("expandParamGivenRetrievalFunction unretrievable key", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sExpandedHash;
        sExpandedHash = shortener.expandParamGivenRetrievalFunction("#SO-Action?HIJ=5&ABC=3&DEF=4", "DEF", function () {
            return undefined;
        });
        deepEqual(sExpandedHash, "#SO-Action?HIJ=5&ABC=3&DEF=4", "original url returned");
    });

    test("smokeShortenExpandTooLongAppHash", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl;
        saveLengthLimit(shortener);
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ";
        sHash = shortener.compactHash(aLongUrl, undefined, {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        deepEqual(aLongUrl, sHash);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(aLongUrl, sHashRestored);
        restoreLengthLimit(shortener);
    });

    test("noCompactParamPresent", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            aLongUrl;
        saveLengthLimit(shortener);
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=AGUID&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.compactHash(aLongUrl, undefined, {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        deepEqual(aLongUrl, sHash);
        restoreLengthLimit(shortener);
    });

    test("expandHashRobust", function () {
        var shortener = sap.ushell.Container.getService("URLShortening");
        deepEqual("", shortener.expandHash(""));
        deepEqual("#", shortener.expandHash("#"));
        deepEqual("#ABCDEF&/ABC", shortener.expandHash("#ABCDEF&/ABC"));
        deepEqual("#&/ABC", shortener.expandHash("#&/ABC"));
    });

    test("expand With app state (special paramter retained)", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            unresolveableShortendURL,
            sHashRestored;
        saveLengthLimit(shortener);
        shortener.URL_LENGTH_LIMIT = 60;
        shortener.URL_PARAMS_LENGTH_LIMIT = 20;
        sHash = shortener.compactHash("#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&sap-xapp-state=12A34&HIJ=1&/detail/1?A=B", ["HIJ"], {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        sHash = sHash.replace(/AGUID/, "BGUID");
        unresolveableShortendURL = "#SO-ABC~CONTXT?" + shortener.ABBREV_PARAM_NAME + "=BGUID&sap-xapp-state=12A34&/detail/1?A=B";
        deepEqual(sHash, unresolveableShortendURL);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(sHash, sHashRestored);
        restoreLengthLimit(shortener);
    });

    test("expand/compact With sap-system (special paramter retained)", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            unresolveableShortendURL,
            sHashRestored;
        saveLengthLimit(shortener);
        shortener.URL_LENGTH_LIMIT = 60;
        shortener.URL_PARAMS_LENGTH_LIMIT = 40;
        sHash = shortener.compactHash("#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&sap-system=ABC&DEF=JJJJJJJJJJJJJJJJJJ&sap-xapp-state=12A34&HIJ=1&/detail/1?A=B", ["HIJ"], {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        sHash = sHash.replace(/AGUID/, "BGUID");
        unresolveableShortendURL = "#SO-ABC~CONTXT?HIJ=1&" + shortener.ABBREV_PARAM_NAME + "=BGUID&sap-system=ABC&sap-xapp-state=12A34&/detail/1?A=B";
        deepEqual(sHash, unresolveableShortendURL);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(sHash, sHashRestored);
        restoreLengthLimit(shortener);
    });

    test("expand/compact With sap-system (special paramter retained HIJ does no longer fit)", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            unresolveableShortendURL,
            sHashRestored;
        saveLengthLimit(shortener);
        shortener.URL_LENGTH_LIMIT = 60;
        shortener.URL_PARAMS_LENGTH_LIMIT = 36;
        sHash = shortener.compactHash("#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&sap-system=ABC&DEF=JJJJJJJJJJJJJJJJJJ&sap-xapp-state=12A34&HIJ=1&/detail/1?A=B", ["HIJ"], {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        sHash = sHash.replace(/AGUID/, "BGUID");
        unresolveableShortendURL = "#SO-ABC~CONTXT?" + shortener.ABBREV_PARAM_NAME + "=BGUID&sap-system=ABC&sap-xapp-state=12A34&/detail/1?A=B";
        deepEqual(sHash, unresolveableShortendURL);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(sHash, sHashRestored);
        restoreLengthLimit(shortener);
    });

    test("expand With no app state (no special parameter)", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            unresolveableShortendURL,
            sHashRestored;
        saveLengthLimit(shortener);
        shortener.URL_LENGTH_LIMIT = 60;
        shortener.URL_PARAMS_LENGTH_LIMIT = 20;
        sHash = shortener.compactHash("#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&sap-uapp-state=1234&HIJ=1&OPQ=4&OPQ=R&/detail/1?A=B", ["HIJ", "OPQ", "KLM"], {
            getNextKey: function () {
                return "AGUID";
            }
        }).hash;
        sHash = sHash.replace(/AGUID/, "BGUID");
        unresolveableShortendURL = "#SO-ABC~CONTXT?ABC=3&HIJ=1&OPQ=4&OPQ=R&" + shortener.ABBREV_PARAM_NAME + "=BGUID&/detail/1?A=B";
        deepEqual(sHash, unresolveableShortendURL);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(sHash, sHashRestored);
        restoreLengthLimit(shortener);
    });

    [
        { desc: "test1", array: ["SAP-A", "SAP-*", "SAP-B"], value: "SAP-B", result: 2 },
        { desc: "test1", array: ["SAP-A", "SAP-*", "SAP-B"], value: "SAP-WDX", result: 1 },
        { desc: "test1", array: ["SAP-A", "SAP-*", "SAP-B"], value: "SAP-A", result: 0 },
        { desc: "test1", array: ["SAP-A", "SAP-*", "SAP-B"], value: "SAPWDY", result: -1 },
        { desc: "test1", array: ["SAP-A", "SAP-*", "SAP-B"], value: "SAP-", result: 1 }
    ].forEach(function (oFixture) {
        test("test indexOf" + oFixture.desc, function () {
            var shortener = sap.ushell.Container.getService("URLShortening");
            equal(shortener._findIndex(oFixture.array, oFixture.value), oFixture.result, " correct index");
        });
    });

    test("_cmpByList", function () {
        var shortener = sap.ushell.Container.getService("URLShortening");
        ok(shortener._cmpByList(["D", "C"], "A", "B") < 0, "compares 1");
        ok(shortener._cmpByList(["D", "C"], "B", "A") > 0, "compares 1");
        ok(shortener._cmpByList(["D", "C"], "A", "A") === 0, "compares 1");
        ok(shortener._cmpByList(["D", "C"], "A", "A") === 0, "compares 1");
        ok(shortener._cmpByList(["D", "C"], "D", "D") === 0, "compares 2");
        ok(shortener._cmpByList(["D", "C"], "C", "C") === 0, "compares 3");
        ok(shortener._cmpByList(["D", "C"], "A", "C") > 0, "compares 4");
        ok(shortener._cmpByList(["D", "C"], "D", "A") < 0, "compares 5");
        ok(shortener._cmpByList(["D", "C"], "D", "C") < 0, "compares 6");
        ok(shortener._cmpByList(["D", "C"], "C", "D") > 0, "compares less");
        ok(shortener._cmpByList(["D", "C"], "c", "D") > 0, "compares less");
        ok(shortener._cmpByList(["D", "C"], "A", "B") < 0, "compares less");
        ok(shortener._cmpByList(["D", "C"], "B", "A") > 0, "compares less");
        ok(shortener._cmpByList(["D", "C"], "a", "A") > 0, "compares less");
        ok(shortener._cmpByList(["D", "C"], "Z", "a") < 0, "compares less");
        ok(shortener._cmpByList(["D", "C"], "a", "Z") > 0, "compares less");
        ok(shortener._cmpByList(["D", "C"], "A", "D") > 0, "compares less");
        ok(shortener._cmpByList(["SAP*", "C"], "SAPABC", "C") < 0, "compares less a");
        ok(shortener._cmpByList(["C", "SAP*"], "SAPABC", "C") > 0, "compares less b");
        ok(shortener._cmpByList(["SAP*", "C"], "SAPABC", "X") < 0, "compares less c");
        ok(shortener._cmpByList(["SAP*", "C"], "SAPABC", "X") < 0, "compares less d");
        ok(shortener._cmpByList(["SAP*", "C"], "SAPA", "SAPB") < 0, "compares less e1");
        ok(shortener._cmpByList(["SAP*", "C"], "SAPB", "SAPA") > 0, "compares less e2");
        ok(shortener._cmpByList(["C", "SAP*"], "SAPABC", "C") > 0, "compares less e");
        ok(shortener._cmpByList(["D", "C"], "A", "D") > 0, "compares less");
    });

    test("_cmpByList", function () {
        var shortener = sap.ushell.Container.getService("URLShortening");
        deepEqual(shortener._sortByPriority(["a", "A", "A", "E", "D", "C", "B", "A"],
            ["D", "C"]),
            ["D", "C", "A", "A", "A", "B", "E", "a"],
            "sort list"
        );
    });

    test("_cmpByList", function () {
        var shortener = sap.ushell.Container.getService("URLShortening");
        deepEqual(shortener._sortByPriority(["a", "sap-y", "A", "sap-x", "E", "D", "C", "B", "sap-z", "A"],
            ["D", "sap-*", "C"]),
            ["D", "sap-x", "sap-y", "sap-z", "C", "A", "A", "B", "E", "a"],
            "sort list"
        );
    });

    [
        1, {}, undefined, "AS34567890123456789012345678901234567890"
    ].forEach(function (oFixture) {
        test("_replaceSapXAppStateRawWithKeyIfRequired already key or invalid raw value" + JSON.stringify(oFixture), function () {
            var shortener = sap.ushell.Container.getService("URLShortening");
            deepEqual(shortener._replaceSapXAppStateRawWithKeyIfRequired(oFixture, {}), oFixture, "value is returned unchanged");
        });
    });

    [
        1, { a: 1 }, 1234, "AS34567890123456789012345678901234567890"
    ].forEach(function (oFixture, sIndex) {
        test("_replaceSapXAppStateRawWithKeyIfRequired valid raw value" + JSON.stringify(oFixture), function () {
            var sNextKey = "ABC" + sIndex,
                aValue,
                shortener = sap.ushell.Container.getService("URLShortening"),
                oStoreContext = {
                    getNextKey: function () {
                        return sNextKey;
                    },
                    store: function (sValue) {
                        aValue = sValue;
                    }
                };
            deepEqual(shortener._replaceSapXAppStateRawWithKeyIfRequired(JSON.stringify(oFixture), oStoreContext), sNextKey, "value is replaced by key");
            deepEqual(aValue, oFixture, "correct value stored");
        });
    });
});

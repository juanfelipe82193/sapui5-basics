// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/thirdparty/URI",
    "sap/ushell/_ApplicationType/systemAlias"
], function (URI, oSystemAlias) {
    "use strict";

    /* global QUnit sinon */

    var O_LOCAL_SYSTEM_ALIAS = { // local system alias (hardcoded in the adapter for now)
           "http": {
               "id": "",
               "host": "",
               "port": 0,
               "pathPrefix": "/sap/bc/"
           },
           "https": {
               "id": "",
               "host": "",
               "port": 0,
               "pathPrefix": "/sap/bc/"
           },
           "rfc": {
               "id": "",
               "systemId": "",
               "host": "",
               "service": 0,
               "loginGroup": "",
               "sncNameR3": "",
               "sncQoPR3": ""
           },
           "id": "",
           "client": "",
           "language": ""
        };

    // a fake lookup table reporting data of all known system aliases (for all the tests)
    var oAdapterKnownSystemAliases = {
        "" : O_LOCAL_SYSTEM_ALIAS,
        "UR3CLNT120": {         // <- convenience index for this test
           http: {
               id: "UR3CLNT120_HTTP",
               host: "example.corp.com",
               port: 50055,
               pathPrefix: ""
           },
           https: {
               id: "UR3CLNT120_HTTPS",
               host: "example.corp.com",
               port: 44355,
               pathPrefix: ""
           },
           rfc: {
               id: "UR3CLNT120",
               systemId: "UR3",
               host: "example.corp.com",
               service: 0,
               loginGroup: "PUBLIC",
               sncNameR3: "p/secude:CN=UR3, O=SAP-AG, C=DE",
               sncQoPR3: "8"
           },
           id: "UR3CLNT120",
           client: "120",
           language: ""
        },
        "LANGEN": {
            https: {
                id: "LANGEN_120_HTTPS",
                host: "u1y.example.corp.com",
                port: 44355,
                pathPrefix: ""
            },
            rfc: {
                id: "LANGEN_120_RFC",
                systemId: "",
                host: "10.96.103.50",
                service: 55,
                loginGroup: "",
                sncNameR3: "",
                sncQoPR3: ""
            },
            id: "LANGEN",
            client: "000",
            language: "EN"
        },
        "CLIENT120": {
            "http": {
                "id": "PB8CLNT120_V1_HTTP",
                "host": "vmw.example.corp.com",
                "port": 44335,
                "pathPrefix": ""
            },
            "https": {
                "id": "PB8CLNT120_V1_HTTPS",
                "host": "vmw.example.corp.com",
                "port": 44335,
                "pathPrefix": ""
            },
            "rfc": {
                "id": "PB8CLNT120_V1",
                "systemId": "",
                "host": "10.66.50.245",
                "service": 35,
                "loginGroup": "",
                "sncNameR3": "p/secude:CN=PB8, O=SAP-AG, C=DE",
                "sncQoPR3": "1"
            },
            id: "CLIENT120",
            client: "120",
            language: ""
        },
        "CLIENT001LANGDE": {
            rfc: {
                id: "CLIENT001LANGDE",
                systemId: "CSS",
                host: "SERVPROD.EXAMPLE.CORP.COM",
                service: 0,
                loginGroup: "PUBLIC",
                sncNameR3: "",
                sncQoPR3: ""
            },
            https: {
                "id": "CLIENT001LANGDE_HTTPS",
                "host": "ur3.example.corp.com",
                "port": 44335,
                "pathPrefix": ""
            },
            id: "CLIENT001LANGDE",
            client: "001",
            language: "DE"
        }
    };


    QUnit.module("sap.ushell._ApplicationType.systemAlias", {
        beforeEach: function () { },
        afterEach: function () { }
    });

    QUnit.test("module exports an object", function (assert) {
        assert.strictEqual(
            Object.prototype.toString.apply(oSystemAlias),
            "[object Object]",
            "got an object back"
        );
    });

    [
        {
            testGoal: "URL is correctly stripped",
            testDescription: "system alias is undefined",
            sSystemAlias: undefined,
            sUrl: "https://u1y.example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN",
            sURIType: "WDA",
            expectedUrl: "/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/"
        },
        {
            testGoal: "sap-client and sap-language parameters are removed from url",
            testDescription: "system alias is undefined",
            sSystemAlias: undefined,
            sUrl: "https://uv2.example.corp.com:44355/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=&sap-client=120&sap-language=EN",
            sURIType: "TR",
            expectedUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&="
        },
        {
            testGoal: "strips local URL path prefix leaving leading forward slash in WDA urls",
            testDescription: 'system alias is ""', // note local system alias
            sSystemAlias: "", // local system alias does not result into path strip
            sUrl: "/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN",
            sURIType: "WDA",
            expectedUrl: "/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/"
        },
        {
            testGoal: "keeps URL path as is for TR urls",
            testDescription: 'system alias is ""',
            sSystemAlias: "", // local system alias does not result into path strip
            sUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&=",
            sURIType: "TR",
            expectedUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?SUID_ST_BNAME-BNAME=FORSTMANN&SUID_ST_NODE_LOGONDATA-USERALIAS=&="
        }
    ].forEach(function (oFixture) {
        QUnit.test("stripURI: " + oFixture.testGoal + " when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();
            var oURI = new URI(oFixture.sUrl);

            var fnAdapterSystemAliasResolver = function (sSystemAlias) {
                 if (oAdapterKnownSystemAliases.hasOwnProperty(sSystemAlias)) {
                     return new jQuery.Deferred().resolve(oAdapterKnownSystemAliases[sSystemAlias]).promise();
                 }
                 return new jQuery.Deferred().reject("Cannot resolve unknown system alias").promise();
            };

            // Act
            oSystemAlias.stripURI(oURI, oFixture.sSystemAlias, oFixture.sSystemDataSrc, oFixture.sURIType, fnAdapterSystemAliasResolver)
                .done(function (oGotURI){
                    assert.ok(true, "promise was resolved");
                    assert.strictEqual(oGotURI.toString(), oFixture.expectedUrl, "obtained expected URL");
                })
                .fail(function (){
                    assert.ok(false, "promise was resolved");
                })
                .always(function () {
                    fnDone();
                });
        });
    });


    [
        {
            testDescription: "relative app/transaction url, no sap-system interpolation",
            sSystemAlias: undefined, // one of aSystemAliasDataCollection
            sSapSystem: undefined,
            sSemantics: "applied",
            sUriType: "GUI",
            sUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",  // no system alias -> relative path (applied semantics)
            expectedUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN"
        },
        {
            testDescription: "relative app/transaction url, with sap-system interpolation",
            sSystemAlias: undefined,
            sSapSystem: "UR3CLNT120",
            sSemantics: "applied",
            sUriType: "GUI",
            sUrl: "/ui2/nwbc/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN",  // no system alias -> relative path
            expectedUrl: "https://example.corp.com:44355/sap/bc/ui5_ui5/ui2/ushell/shells/abap/~canvas;window=app/transaction/SU01?sap-client=120&sap-language=EN"
        },
        {
            testDescription: "absolute app/wda url with pre-filled client and language, with sap-system (with another client, empty language) interpolation",
            sSystemAlias: undefined, // user typed in absolute URL
            sSapSystem: "CLIENT120",
            sSemantics: "applied",
            sUrl: "https://u1y.example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN",
            expectedUrl: "https://vmw.example.corp.com:44335/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=120&sap-language=EN"
        },
        {
            testDescription: "absolute app/wda url with pre-filled client and language, with sap-system having DE language and another client interpolation",
            sSystemAlias: undefined,
            sSapSystem: "CLIENT001LANGDE",
            sSemantics: "applied",
            sUriType: "WDA",
            sUrl: "https://ur3.example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-client=120&sap-language=EN",
            expectedUrl: "https://ur3.example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/S_EPM_FPM_PD/?sap-client=001&sap-language=DE"
        },
        {
            testDescription: "relative gui url with local system alias and no sap-system",
            sSystemAlias: "",
            sSapSystem: undefined,
            sSemantics: "apply",
            sUriType: "NATIVEWEBGUI",
            sUrl: "/gui/sap/its/webgui?%7etransaction=/SAPSLL/CLSNR_01&%7enosplash=1",
            expectedUrl: "/gui/sap/its/webgui?%7etransaction=/SAPSLL/CLSNR_01&%7enosplash=1"
        }
    ].forEach(function (oFixture) {
        QUnit.test("_spliceSapSystemIntoURI: URI returns expected url when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();
            var oURI = new URI(oFixture.sUrl);

            var fnAdapterSystemAliasResolver = function (sSystemAlias) {
                if (oAdapterKnownSystemAliases.hasOwnProperty(sSystemAlias)) {
                    return new jQuery.Deferred().resolve(oAdapterKnownSystemAliases[sSystemAlias]).promise();
                }
                return new jQuery.Deferred().reject("Cannot resolve unknown system alias").promise();
            };

            window.sap = { ushell: { Container: { getUser: sinon.stub().returns() } } };

            oSystemAlias.spliceSapSystemIntoURI(oURI, oFixture.sSystemAlias, oFixture.sSapSystem, oFixture.sSapSystemSrc, oFixture.sUriType, oFixture.sSemantics, fnAdapterSystemAliasResolver)
                .done(function (oGotURI){
                    QUnit.ok(true, "promise was resolved");
                    QUnit.strictEqual(oGotURI.url, oFixture.expectedURL, "obtained expected URL");
                })
                .fail(function (){
                    QUnit.ok(false, "promise was resolved");
                })
                .always(function () {
                    fnDone();
                });
        });
    });


    [
        /*
         * Tests for _selectSystemAliasDataName: https is always preferred over http
         */
        {
            testDescription: "only https available and window.location protocol is 'http'",
            aAvailableSystemAliasData: ["https"],  // transformed in the test
            sWindowLocationProtocol: "http",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "only https available and window.location protocol is 'https'",
            aAvailableSystemAliasData: ["https"],  // transformed in the test
            sWindowLocationProtocol: "https",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "https and http are both available and window.location protocol is http",
            aAvailableSystemAliasData: ["https", "http"],  // transformed in the test
            sWindowLocationProtocol: "http",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "https and http are both available and window.location protocol is https",
            aAvailableSystemAliasData: ["https", "http"],  // transformed in the test
            sWindowLocationProtocol: "https",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "https and http are both available and window.location protocol is 'TEST'",
            aAvailableSystemAliasData: ["https", "http"],  // transformed in the test
            sWindowLocationProtocol: "TEST",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            // tests http fallback if https is not available
            testDescription: "only https is available and window.location protocol is 'TEST'",
            aAvailableSystemAliasData: ["https"],  // transformed in the test
            sWindowLocationProtocol: "TEST",
            expectedSystemAliasDataName: "https" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "only http is available and window.location protocol is 'https'",
            aAvailableSystemAliasData: ["http"],  // transformed in the test
            sWindowLocationProtocol: "https",
            expectedSystemAliasDataName: "http" // one of aSystemAliasDataCollection
        },
        {
            testDescription: "no http or https is provided in the list of available system alias data",
            aAvailableSystemAliasData: ["foo", "fie"],
            sWindowLocationProtocol: "http",
            expectedSystemAliasDataName: undefined
        }
    ].forEach(function (oFixture) {
        QUnit.test("selectSystemAliasDataName: selects " + oFixture.expectedSystemAliasDataName + " when " + oFixture.testDescription, function (assert) {
            var oSystemAliasCollection = {};

            // Transform the fixture to an object accepted as first argument
            oFixture.aAvailableSystemAliasData.forEach(function (sFixtureType) {
                oSystemAliasCollection[sFixtureType] = {};
            });

            // Act
            var sSelectedSystemAliasDataName = oSystemAlias.selectSystemAliasDataName(oSystemAliasCollection, oFixture.sWindowLocationProtocol);

            // Assert
            assert.strictEqual(sSelectedSystemAliasDataName, oFixture.expectedSystemAliasDataName, "selected expected data name");
        });
    });

    [
        {
            testDescription: "system alias 'rfc' section is empty",
            oSystemAliasRfc: { },
            sSystemAliasHttpHost: "www.example.com",
            expectedParameters: ""
        },
        {
            testDescription: "system alias 'rfc' section has the same host as the one from the http destination",
            oSystemAliasRfc: { host: "www.example.com" },
            sSystemAliasHttpHost: "www.eXaMpLE.com",
            expectedParameters: ""
        },
        {
            testDescription: "system alias 'rfc' section has a different host as the one from the http destination",
            oSystemAliasRfc: { host: "www.example.abc.com" },
            sSystemAliasHttpHost: "www.example.com",
            expectedParameters: "~rfcHostName=www.example.abc.com"
        },
        {
            testDescription: "host specifies a connection string",
            oSystemAliasRfc: { host: "/H/example.com/M/T10/S/3604/G/ALL" },
            sSystemAliasHttpHost: "www.example.com",
            expectedParameters: "~connectString=%2fH%2fexample.com%2fM%2fT10%2fS%2f3604%2fG%2fALL"
        },
        {
            testDescription: "load balanced configuration",
            oSystemAliasRfc: {
              "systemId": "YI2",
              "host": "example.com",
              "service": 32,
              "loginGroup": "PUBLIC"
            },
            sSystemAliasHttpHost: "example.com",
            expectedParameters: "~sysid=YI2;~loginGroup=PUBLIC"
        }
    ].forEach(function (oFixture) {
        QUnit.test("constructNativeWebguiParameters works as expected when " + oFixture.testDescription, function (assert) {
            assert.strictEqual(
                oSystemAlias.constructNativeWebguiParameters(oFixture.oSystemAliasRfc, oFixture.sSystemAliasHttpHost),
                oFixture.expectedParameters,
                "Obtained the expected parameters"
            );
        });
    });

});

// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for module "uri.transform" in "sap.ushell.adapters.cdm._LaunchPage"
 */

/* global sap, QUnit */

sap.ui.require([
    "sap/ushell/adapters/cdm/_LaunchPage/uri.transform"
], function ( fnUriTransform ) {

    "use strict";

    QUnit.module("uri.transform");

    // Check all properties of the result
    [
        {
            testDescription: "( 1) When called with (null, *, *, *) as parameters",
            input: {
                uri : null,
                uriParent : null,
                uriBase : null,
                uriNewBase : null
            },
            expected: {
                error : "Error: Parameter sUri is empty or not a string, use case not supported."
            },
            successMessage : 'uri.transform returns an error: { error : ... }'

        },
        {
            testDescription: "( 2) When called with (abs uri, null, null, null) as parameters",
            input: {
                uri : '/test/counts/count1.json',
                uriParent : null,
                uriBase : null,
                uriNewBase : null
            },
            expected: {
                uri : "/test/counts/count1.json",
                uriAbsolute : "/test/counts/count1.json"
            },
            successMessage : 'it returns { uri : abs uri, uriAbsolute : abs uri } properly calculated'
        },
        {
            testDescription: "( 3) When called with (relative uri, absolute uri, null, null) as parameters",
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/cdm/',
                uriBase : null,
                uriNewBase : null
            },
            expected: {
                uri : "test/counts/count1.json",
                uriParent : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/cdm/',
                uriAbsolute : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/cdm/test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriParent:, uriAbsolute: } properly calculated'
        },
        {
            testDescription: "( 4) When called with (relative uri, absolute uri, null, null) as parameters",
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/cdm/',
                uriBase : null,
                uriNewBase : null
            },
            expected: {
                uri : "test/counts/count1.json",
                uriParent : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/cdm/',
                uriAbsolute : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/cdm/test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriParent:, uriRelative:, uriBase:, uriAbsolute: } properly calculated'
        },
        {
            testDescription: "( 5) When called with (relative uri, relative uri, null, null) as parameters",
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriBase : null,     // Defaults to page uri,
                uriNewBase : null
            },
            someExpected: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriRelative : '../../test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriParent:, uriRelative: "../../../test/adapters/cdm/" } properly calculated'
        },
        {
            testDescription: "( 6) When called with (relative uri, relative uri, abs uri, abs uri) as parameters",
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriBase : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/',
                uriNewBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                uri : 'test/counts/count1.json',
                uriParent : '../../../../../',
                uriRelative : '../../../../../test/counts/count1.json',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriParent:, uriRelative:, uriBase:, uriAbsolute: } properly calculated'
        },
        {
            testDescription: "( 7) When called with (relative uri, relative uri, abs uri, abs uri) as parameters",
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/',
                uriNewBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                uri : 'test/counts/count1.json',
                uriParent : '../../../../../',
                uriRelative : '../../../../../test/counts/count1.json',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriParent:, uriRelative:, uriBase:, uriAbsolute: } properly calculated'
        },
        {
            testDescription: '( 8) When called with (relative uri, relative uri, abs uri (with host), abs uri (wo host)) as parameters',
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/',
                uriNewBase : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                uri : 'test/counts/count1.json',
                uriParent : '../../../../../',
                uriRelative : '../../../../../test/counts/count1.json',
                uriBase : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : '/sap/bc/ui5_ui5/ui2/ushell/test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriParent:, uriRelative:, uriBase: (with host), uriAbsolute: (wo host) } properly calculated'
        },
        {
            testDescription: '( 9) When called with (relative uri, relative uri, abs uri (host 1), abs uri (host 2)) as parameters',
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/',
                uriNewBase : 'https://x.y.z:8080/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                error : 'Error: Hosts of the parameters sUriBase and sUriNewBase are given but do not match.'
            },
            successMessage : 'uri.transform returns { error: }'
        },
        {
            testDescription: '(10) When called with (relative uri, relative uri, abs uri (host 1), relative uri) as parameters',
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/',
                uriNewBase : 'sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                error : 'Error: Parameter sUriNewBase is a relative uri, but must be absolute.'
            },
            successMessage : 'uri.transform returns { error: }'
        },
        {
            testDescription: '(11) When called with (relative uri, null, abs uri, abs uri) as parameters',
            input: {
                uri : '../../test/counts/count1.json',
                uriParent : null,
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/',
                uriNewBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                uri : '../../../../../test/counts/count1.json',
                uriRelative : '../../../../../test/counts/count1.json',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriRelative:, uriBase:, uriAbsolute: } properly calculated'
        },
        {
            testDescription: '(12) When called with (relative uri, relative uri, abs uri (wo host), abs uri (with host)) as parameters',
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriBase : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/',
                uriNewBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected: {
                uri : 'test/counts/count1.json',
                uriParent : '../../../../../',
                uriRelative : '../../../../../test/counts/count1.json',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriParent:, uriRelative:, uriBase: (with host), uriAbsolute: (wo host) } properly calculated'
        },
        {
            testDescription: '(13) When called with (escaped parameters only, relative uri, abs uri (wo host), abs uri (with host)) as parameters',
            input: {
                uri : 'some_escaped_sophisticated_parameters',
                uriParent : '../../',
                uriBase : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/',
                uriNewBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected: {
                uri : 'some_escaped_sophisticated_parameters',
                uriParent : '../../../../../',
                uriRelative : '../../../../../some_escaped_sophisticated_parameters',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/some_escaped_sophisticated_parameters'
            },
            successMessage : 'uri.transform returns { uri: escaped parameters only, uriParent: relative uri, uriRelative:, uriBase: with host, uriAbsolute: with host } properly calculated'
        },
        {
            testDescription: '(14) When called with (escaped parameters only, relative uri, abs uri (wo host), abs uri (with host)) as parameters',
            input: {
                uri : 'some_escaped_sophisticated_parameters',
                uriParent : '../../',
                uriBase : '../../../../demoapp/',
                uriNewBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                uri : 'some_escaped_sophisticated_parameters',
                uriParent : '../../../../../',
                uriRelative : '../../../../../some_escaped_sophisticated_parameters',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/some_escaped_sophisticated_parameters'
            },
            successMessage : 'uri.transform returns { uri: escaped parameters only, uriParent: relative uri, uriRelative:, uriBase: relative uri, uriAbsolute: with host } properly calculated'
        },
        {
            testDescription: '(15) When called with (relative uri, relative uri, abs uri, abs uri) as parameters',
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriBase : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/component.js',
                uriNewBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                uri : 'test/counts/count1.json',
                uriParent : '../../../../../',
                uriRelative : '../../../../../test/counts/count1.json',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriParent:, uriRelative:, uriBase:, uriAbsolute: } properly calculated'
        },
        {
            testDescription: '(16) When called with (relative uri, relative uri, abs uri, abs uri) as parameters',
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriBase : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp',
                uriNewBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                uri : 'test/counts/count1.json',
                uriParent : '../../../../../',
                uriRelative : '../../../../../test/counts/count1.json',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriParent:, uriRelative:, uriBase:, uriAbsolute: } properly calculated'
        },
        {
            testDescription: '(17) When called with (relative uri, relative uri, abs uri, abs uri) as parameters',
            input: {
                uri : 'test/counts/count1.json',
                uriParent : '../../',
                uriBase : '/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/component.js',
                uriNewBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                uri : 'test/counts/count1.json',
                uriParent : '../../../../../',
                uriRelative : '../../../../../test/counts/count1.json',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test/counts/count1.json'
            },
            successMessage : 'uri.transform returns { uri:, uriParent:, uriRelative:, uriBase:, uriAbsolute: } properly calculated'
        },
        {
            testDescription: '(18) When called with (relative uri with parameters, null, abs uri, abs uri) as parameters',
            input: {
                uri : '../../test/counts/count1.json?param1=1000&param2=foo',
                uriParent : null,
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/demoapp/',
                uriNewBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/fioriCDM.html?params'
            },
            expected:  {
                uri : '../../../../../test/counts/count1.json?param1=1000&param2=foo',
                uriRelative : '../../../../../test/counts/count1.json?param1=1000&param2=foo',
                uriBase : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/shells/cdm/',
                uriAbsolute : 'https://x.y.z:8443/sap/bc/ui5_ui5/ui2/ushell/test/counts/count1.json?param1=1000&param2=foo'
            },
            successMessage : 'uri.transform returns { uri:, uriRelative:, uriBase:, uriAbsolute: } properly calculated'
        }
    ].forEach( function ( oFixture ) {

        QUnit.test( oFixture.testDescription, function ( assert ) {

            var transformed =
                fnUriTransform(
                    oFixture.input.uri,
                    oFixture.input.uriParent,
                    oFixture.input.uriBase,
                    oFixture.input.uriNewBase );

            // Check result and expectation match 100%
            if (oFixture.expected) {

                assert.deepEqual( transformed, oFixture.expected, oFixture.successMessage );

            // Or check only the properties given in oFixture.expected
            } else if (oFixture.someExpected) {

                // Check only the properties
                for ( var property in oFixture.someExpected ) {
                    assert.equal( oFixture.someExpected[property], transformed[property] );
                }

            }

        });
    });

});

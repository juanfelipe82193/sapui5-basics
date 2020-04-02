// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.ContainerAdapter
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/System"
], function (testUtils, System) {
    "use strict";
    /*global sinon, jQuery, QUnit, sap, start */

    var oXMLHttpRequestStub;

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.adapters.cdm.ContainerAdapter");

    QUnit.module("sap.ushell.adapters.cdm.ContainerAdapter", {
        setup: function () {
            this.initialSystem = new System({
                alias: "initial_Alias",
                platform: "cdm"
            });
        },
        teardown: function () {
            //delete sap.ushell.Container;
            testUtils.restoreSpies(
                sap.ushell.utils.hasNativeLogoutCapability,
                sap.ushell.utils.getPrivateEpcm,
                oXMLHttpRequestStub
            );
        }
    });

    [{
        testDescription: "no userProfile in adapter config",
        input: {
            oConfig: {
            }
        },
        expected: {
            // everything should be undefined
        }
    }, {
        testDescription: "userProfile without personalization and metadata",
        input: {
            oConfig: {
                "userProfile": {
                    "defaults": {
                        "isJamActive": false,
                        "email": "john.doe@sap.com",
                        "firstName": "John",
                        "lastName": "Doe",
                        "fullName": "John Doe",
                        "id": "DOEJ",
                        "language": "EN",
                        "languageBcp47": "en",
                        "dateFormat": "1",
                        "tislcal": [],
                        "numberFormat": "",
                        "rtl": false,
                        "theme": "sap_belize",
                        "timeFormat": "0",
                        "timeZone": "CET"
                    }
                }
            }
        },
        expected: {
            email: "john.doe@sap.com",
            firstName: "John",
            lastName: "Doe",
            fullName: "John Doe",
            userId: "DOEJ",
            language: "EN",
            languageBcp47: "en",
            contentDensity: undefined,
            theme: "sap_belize"
        }
    }, {
        testDescription: "userProfile with personalization",
        input: {
            oConfig: {
                "userProfile": {
                    "metadata": {
                    },
                    "defaults": {
                        "isJamActive": false,
                        "email": "john.doe@sap.com",
                        "firstName": "John",
                        "lastName": "Doe",
                        "fullName": "John Doe",
                        "id": "DOEJ",
                        "language": "EN",
                        "languageBcp47": "en",
                        "dateFormat": "1",
                        "tislcal": [],
                        "numberFormat": "",
                        "rtl": false,
                        "theme": "sap_belize",
                        "timeFormat": "0",
                        "timeZone": "CET"
                    }
                },
                "userProfilePersonalization": {
                    // may come from separate request
                    "dateFormat": "1",
                    "theme": "sap_belize_plus",
                    "timeFormat": "0",
                    "timeZone": "CET",
                    "contentDensity": "cozy"
                }
            }
        },
        expected: {
            email: "john.doe@sap.com",
            firstName: "John",
            lastName: "Doe",
            fullName: "John Doe",
            userId: "DOEJ",
            language: "EN",
            languageBcp47: "en",
            contentDensity: "cozy",
            theme: "sap_belize_plus"
        }
    }, {
        testDescription: "isJamActive = true",
        input: {
            oConfig: {
                "userProfile": {
                    "defaults": {
                        "isJamActive": true
                    }
                }
            }
        },
        expected: {
            isJamActive: true
            // everything else should be undefined
        }
    }, {
        testDescription: "userProfile with metadata enabling editing of theme",
        input: {
            oConfig: {
                "userProfile": {
                    "metadata": {
                        "editablePropterties": [
                            "theme"
                        ]
                    }
                }
            }
        },
        expected: {
            isSetThemePermitted: true
            // everything else should be undefined
        }
    }, {
        testDescription: "userProfile with metadata enabling editing of accessibility",
        input: {
            oConfig: {
                "userProfile": {
                    "metadata": {
                        "editablePropterties": [
                            "accessibility"
                        ]
                    }
                }
            }
        },
        expected: {
            isSetAccessibilityPermitted: true
            // everything else should be undefined
        }
    }, {
        testDescription: "userProfile with metadata enabling editing of contentDensity",
        input: {
            oConfig: {
                "userProfile": {
                    "metadata": {
                        "editablePropterties": [
                            "contentDensity"
                        ]
                    }
                }
            }
        },
        expected: {
            isSetContentDensityPermitted: true
            // everything else should be undefined
        }
    }, {
        testDescription: "Theme fallback as user's personalized theme is not supported",
        input: {
            oConfig: {
                "userProfile": {
                    "metadata": {
                        "editablePropterties": [
                            "theme"
                        ],
                        "ranges": {
                            "theme": [{
                                "displayName": "SAP Belize",
                                "theme": "sap_belize",
                                "themeRoot": ""
                            }, {
                                "displayName": "SAP Belize Dark",
                                "name": "sap_belize_plus",
                                "themeRoot": ""
                            }]
                        }
                    },
                    "defaults": {
                        // fallback in case of deprecated personalized theme
                        "theme": "sap_belize"
                    }
                },
                "userProfilePersonalization": {
                    "theme": "sap_blue_crystal"
                }
            }
        },
        expected: {
            theme: "sap_blue_crystal",
            isSetThemePermitted: true
            // everything else is undefined
        }
    }].forEach(function (oFixture) {
        QUnit.test("getUser: " + oFixture.testDescription, function (assert) {
            var oUser,
                oAdapter;

            // act
            oAdapter = new sap.ushell.adapters.cdm.ContainerAdapter(this.initialSystem, undefined,
                {config: oFixture.input.oConfig});
            oUser = oAdapter.getUser();

            // assert
            assert.strictEqual(oUser.getEmail(), oFixture.expected.email, "Email");
            assert.strictEqual(oUser.getFirstName(), oFixture.expected.firstName, "First Name");
            assert.strictEqual(oUser.getLastName(), oFixture.expected.lastName, "Last Name");
            assert.strictEqual(oUser.getFullName(), oFixture.expected.fullName, "Full Name");
            assert.strictEqual(oUser.getId(), oFixture.expected.userId, "user id");
            assert.strictEqual(oUser.getLanguage(), oFixture.expected.language, "language");
            assert.strictEqual(oUser.getLanguageBcp47(), oFixture.expected.languageBcp47, "languageBcp47");
            assert.strictEqual(oUser.getContentDensity(), oFixture.expected.contentDensity, "contentDensity");
            assert.strictEqual(oUser.getTheme(),
                oFixture.expected.theme !== undefined ? oFixture.expected.theme : "",
                "theme (if ot set it should be an empty string");
            assert.strictEqual(oUser.isJamActive(), !!oFixture.expected.isJamActive, "isJamActive");

            // assert edit states. If not explicitly set to editable, they should return false
            assert.strictEqual(oUser.isSetAccessibilityPermitted(), !!oFixture.expected.isSetAccessibilityPermitted,
                "isSetAccessibilityPermitted");
            assert.strictEqual(oUser.isSetContentDensityPermitted(), !!oFixture.expected.isSetContentDensityPermitted,
                "isSetContentDensityPermitted");
            assert.strictEqual(oUser.isSetThemePermitted(), !!oFixture.expected.isSetThemePermitted,
                "isSetThemePermitted");
        });
    });

    QUnit.test("getUser: returns always the same instance", function (assert) {
        var oUser1,
            oUser2,
            oAdapter;

        // act
        oAdapter = new sap.ushell.adapters.cdm.ContainerAdapter(this.initialSystem, undefined,
            {
                config: {
                    userProperties: {
                        id: "DOEJ"
                    }
                }
            });
        oUser1 = oAdapter.getUser();
        oUser2 = oAdapter.getUser();

        // assert
        assert.strictEqual(oUser1, oUser2, "same user instance is returned on every getUser call");
        assert.ok(oUser1, "a user object has been returned");
    });

    [{
        testDescription: "Config without systemProperties",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "",
                platform: "cdm", // cannot be overwritten via config!
                baseUrl: "/base_url" // cannot be overwritten via config!
            },
            oConfig: {}
        },
        expected: {
            alias: "",
            platform: "cdm",
            baseUrl: "/base_url"
            // everything else should be undefined
        }
    }, {
        testDescription: "Config with empty systemProperties",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "initial_Alias",
                platform: "cdm", // cannot be overwritten via config!
                baseUrl: "/base_url" // cannot be overwritten via config!
            },
            oConfig: {
                systemProperties: {}
            }
        },
        expected: {
            alias: "initial_Alias",
            platform: "cdm",
            baseUrl: "/base_url"
            // everything else should be undefined
        }
    }, {
        testDescription: "SystemProperties config with alias",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "initial_Alias",
                platform: "cdm", // cannot be overwritten via config!
                baseUrl: "/base_url" // cannot be overwritten via config!
            },
            oConfig: {
                systemProperties: {
                    alias: "SYS_ALIAS"
                }
            }
        },
        expected: {
            alias: "SYS_ALIAS",
            platform: "cdm",
            baseUrl: "/base_url"
            // everything else should be undefined
        }
    }, {
        testDescription: "SystemProperties config with SID",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "initial_Alias",
                platform: "cdm", // cannot be overwritten via config!
                baseUrl: "/base_url" // cannot be overwritten via config!
            },
            oConfig: {
                systemProperties: {
                    SID: "SYS"
                }
            }
        },
        expected: {
            alias: "initial_Alias",
            platform: "cdm",
            name: "SYS",
            baseUrl: "/base_url"
            // everything else should be undefined
        }
    }, {
        testDescription: "SystemProperties config with client, no baseUrl",
        input: {
            oInitialSystemData: {
                // initial system object as sap.ushell.service Container creates it
                alias: "initial_Alias",
                platform: "cdm" // cannot be overwritten via config!
            },
            oConfig: {
                systemProperties: {
                    client: "001"
                }
            }
        },
        expected: {
            alias: "initial_Alias",
            platform: "cdm",
            client: "001"
            // everything else should be undefined
        }
    }].forEach(function (oFixture) {
        QUnit.test("getSystem: " + oFixture.testDescription, function (assert) {
            var oExpected = oFixture.expected,
                oAdapter,
                oInitialSystem = new System(oFixture.input.oInitialSystemData),
                oActualSystem;

            // act
            oAdapter = new sap.ushell.adapters.cdm.ContainerAdapter(oInitialSystem, undefined,
                {config: oFixture.input.oConfig});
            oActualSystem = oAdapter.getSystem();

            // assert
            assert.strictEqual(oActualSystem.getAlias(), oExpected.alias, "alias: " + oExpected.alias);
            assert.strictEqual(oActualSystem.getBaseUrl(), oExpected.baseUrl, "baseUrl: " + oExpected.baseUrl);
            assert.strictEqual(oActualSystem.getClient(), oExpected.client, "client: " + oExpected.client);
            assert.strictEqual(oActualSystem.getName(), oExpected.name, "name: " + oExpected.name);
            assert.strictEqual(oActualSystem.getPlatform(), oExpected.platform, "platform: " + oExpected.platform);
        });
    });

    QUnit.test("getSystem: returns always the same instance", function (assert) {
        var oSystem1,
            oSystem2,
            oAdapter;

        // act
        oAdapter = new sap.ushell.adapters.cdm.ContainerAdapter(this.initialSystem, undefined, {
                config: {}
            });
        oSystem1 = oAdapter.getSystem();
        oSystem2 = oAdapter.getSystem();

        // assert
        assert.strictEqual(oSystem1, oSystem2, "same system instance is returned on every getSystem call");
        assert.ok(oSystem1, "a system object has been returned");
    });

    [{
        testDescription: "SystemProperties config without logoutUrl -> default logoutUrl",
        input: {
            oConfig: {
                systemProperties: {
                }
            }
        },
        expected: {
            logoutUrl: "/sap/public/bc/icf/logoff"
        }
    }, {
        testDescription: "SystemProperties config with logoutUrl",
        input: {
            oConfig: {
                systemProperties: {
                    logoutUrl: "/a/b/c/d"
                }
            }
        },
        expected: {
            logoutUrl: "/a/b/c/d"
        }
    }].forEach(function (oFixture) {
        QUnit.test("LogoutUrl: " + oFixture.testDescription, function (assert) {
            var oExpected = oFixture.expected,
                oAdapter;

            // act
            oAdapter = new sap.ushell.adapters.cdm.ContainerAdapter(this.initialSystem, undefined,
                {config: oFixture.input.oConfig});

            // _getLogoutUrl may be removed as it is only used for the test
            assert.strictEqual(oAdapter._getLogoutUrl(), oExpected.logoutUrl, "logoutUrl: " + oExpected.logoutUrl);
        });
    });

    [
        {
            testDescription: "browser does not have native logout capability",
            input: {
                bHasNativeLogoutCapability: false,
                sFakeLocationHref: "https://somehost:44355/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=000#Shell-home",
                sLogoffUrl: "/sap/public/bc/icf/logoff",
                sSystemBaseUrl: "/base_url"
            },
            expected: {
                callCounts: {
                    logoutRedirect: 1,
                    _setDocumentLocation: 1,
                    adjustUrl: 1,
                    epcmDoLogOff: 0
                },
                sLogoffRedirectUrl: "/base_url/sap/public/bc/icf/logoff"
            }
        },
        {
            testDescription: "browser has native logout capability",
            input: {
                bHasNativeLogoutCapability: true,
                sFakeLocationHref: "https://somehost:44355/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=000#Shell-home",
                sLogoffUrl: "/sap/public/bc/icf/logoff",
                sSystemBaseUrl: "/base_url"
            },
            expected: {
                callCounts: {
                    logoutRedirect: 0,
                    _setDocumentLocation: 0,
                    adjustUrl: 0,
                    epcmDoLogOff: 1
                },
                sEpcmDoLogOffUrl: "https://somehost:44355/sap/public/bc/icf/logoff"
            }
        }
    ].forEach(function (oFixture) {
        QUnit.asyncTest("logout for Logon System works as expected when " + oFixture.testDescription, function (assert) {
            var oInitialSystem = new sap.ushell.System({baseUrl: oFixture.input.sSystemBaseUrl}),
                oAdapter = new sap.ushell.adapters.cdm.ContainerAdapter(oInitialSystem, undefined,
                    {config: {}}),
                oSystem = oAdapter.getSystem(), // may be a different instance than oInitialSystem
                sConfiguredLogoffUrl = oFixture.input.sLogoffUrl,
                fnDoLogOffStub = sinon.stub();

            // Arrange
            sinon.spy(oAdapter, "logoutRedirect");
            sinon.spy(oSystem, "adjustUrl"); // not stubbed in order to test the real behaviour
            sinon.stub(sap.ushell.utils, "hasNativeLogoutCapability")
                .returns(oFixture.input.bHasNativeLogoutCapability);
            sinon.stub(sap.ushell.utils, "getPrivateEpcm")
                .returns({
                    doLogOff: fnDoLogOffStub
                });
            sinon.stub(oAdapter, "getCurrentUrl")
                .returns(oFixture.input.sFakeLocationHref);
            sinon.stub(oAdapter, "_getLogoutUrl")
                .returns(sConfiguredLogoffUrl);
            sinon.stub(oAdapter, "_setDocumentLocation"); // avoid redirecting during test

            // Act
            oAdapter.logout(true).done(function () {
                // Assert
                // call counts:
                assert.strictEqual(
                    oAdapter.logoutRedirect.callCount,
                    oFixture.expected.callCounts.logoutRedirect,
                    "logoutRedirect method was called " + oFixture.expected.callCounts.logoutRedirect + " times"
                );
                assert.strictEqual(
                    oSystem.adjustUrl.callCount,
                    oFixture.expected.callCounts.adjustUrl,
                    "adjustUrl method was called " + oFixture.expected.callCounts.adjustUrl + " times"
                );
                assert.strictEqual(
                    oAdapter._setDocumentLocation.callCount,
                    oFixture.expected.callCounts._setDocumentLocation,
                    "_setDocumentLocation method was called " + oFixture.expected.callCounts._setDocumentLocation + " times"
                );
                assert.strictEqual(
                    fnDoLogOffStub.callCount,
                    oFixture.expected.callCounts.epcmDoLogOff,
                    "EPCM doLogoff method was called " + oFixture.expected.callCounts.epcmDoLogOff + " times"
                );

                if (oFixture.input.bHasNativeLogoutCapability) {
                    assert.strictEqual(
                        fnDoLogOffStub.firstCall.args[0],
                        oFixture.expected.sEpcmDoLogOffUrl,
                        "EPCM doLogoff called for URL: " + sConfiguredLogoffUrl
                    );
                } else {
                    assert.strictEqual(
                        oSystem.adjustUrl.firstCall.args[0],
                        sConfiguredLogoffUrl,
                        "adjustUrl called for URL: " + sConfiguredLogoffUrl
                    );
                    assert.strictEqual(
                        oAdapter._setDocumentLocation.firstCall.args[0],
                        oFixture.expected.sLogoffRedirectUrl,
                        "Redirect to logoff URL done: " + oFixture.expected.sLogoffRedirectUrl
                    );
                }

                start();
            });
        });
    });

    QUnit.test("getCurrentUrl: returns the URL on the address bar", function (assert) {
        var oAdapter = new sap.ushell.adapters
                .cdm.ContainerAdapter(this.initialSystem, undefined, { config: {
                        systemProperties: { }
                    } });

        assert.strictEqual(oAdapter.getCurrentUrl(), window.location.href, "Current URL is current location");
    });

    QUnit.test("load: returns a promise that is always resolved", function (assert) {
        var fnDone = assert.async();

        var oAdapter = new sap.ushell.adapters
                .cdm.ContainerAdapter(this.initialSystem, undefined, { config: {
                        systemProperties: { }
                    } });

        var fnLoaded = sinon.spy();
        var fnFailedLoading = sinon.spy();

        var fnCheckOutcome = function () {
            assert.ok(fnLoaded.calledOnce && fnFailedLoading.notCalled);
            fnDone();
        };

        oAdapter.load()
                .then(fnLoaded, fnFailedLoading)
                .then(fnCheckOutcome, fnCheckOutcome);
    });

    [{
        testDescription: "empty configuration",
        input: {
            oConfig: {
            }
        },
        expected: {
            sessionKeepAliveConfig: null
        }
    }, {
        testDescription: "no sessionKeepAlive configuration",
        input: {
            oConfig: {
                systemProperties: {
                }
            }
        },
        expected: {
            sessionKeepAliveConfig: null
        }
    }, {
        testDescription: "sessionKeepAlive configuration without 'url'",
        input: {
            oConfig: {
                systemProperties: {
                    "sessionKeepAlive": {
                    }
                }
            }
        },
        expected: {
            sessionKeepAliveConfig: null
        }
    }, {
        testDescription: "sessionKeepAlive configuration with 'url' but without method",
        input: {
            oConfig: {
                systemProperties: {
                    "sessionKeepAlive": {
                        "url": "/some/ping/service"
                    }
                }
            }
        },
        expected: {
            sessionKeepAliveConfig: {
                "method": "HEAD",
                "url": "/some/ping/service"
            }
        }
    }, {
        testDescription: "sessionKeepAlive configuration with 'url' and method GET",
        input: {
            oConfig: {
                systemProperties: {
                    "sessionKeepAlive": {
                        "method": "GET",
                        "url": "/some/ping/service"
                    }
                }
            }
        },
        expected: {
            sessionKeepAliveConfig: {
                "method": "GET",
                "url": "/some/ping/service"
            }
        }
    }, {
        testDescription: "sessionKeepAlive configuration with 'url' and invalid method",
        input: {
            oConfig: {
                systemProperties: {
                    "sessionKeepAlive": {
                        "method": "DELETE",
                        "url": "/some/ping/service"
                    }
                }
            }
        },
        expected: {
            sessionKeepAliveConfig: {
                "method": "HEAD",
                "url": "/some/ping/service"
            }
        }
    }].forEach(function (oFixture) {
        QUnit.test("Constructor - getSessionKeepAliveConfig: " + oFixture.testDescription, function (assert) {
            var oExpectedSessionKeepAliveConfig = oFixture.expected.sessionKeepAliveConfig,
                oAdapter;

            // act
            oAdapter = new sap.ushell.adapters.cdm.ContainerAdapter(this.initialSystem, undefined, {
                config: oFixture.input.oConfig
            });

            // assert
            assert.deepEqual(oAdapter._getSessionKeepAliveConfig(), oExpectedSessionKeepAliveConfig);
        });
    });

    QUnit.test("sessionKeepAlive: sends XHR request if sessionKeepAlive configured", function (assert) {
        // Arrange
        var oFakeXHRStub = {
            open: sinon.stub(),
            send: sinon.stub()
        };
        oXMLHttpRequestStub = sinon.stub(window, "XMLHttpRequest").returns(oFakeXHRStub);
        var oAdapter = new sap.ushell.adapters.cdm.ContainerAdapter(this.initialSystem, undefined, {
            config: {
                systemProperties: {
                    "sessionKeepAlive": {
                        "url": "/some/ping/service"
                    }
                }
            }
        });

        // Act
        oAdapter.sessionKeepAlive();

        // Assert
        assert.strictEqual(oXMLHttpRequestStub.callCount, 1, "XMLHttpRequest constructor was called exactly once");
        assert.strictEqual(oFakeXHRStub.open.callCount, 1, "open method of the XHR object was called exactly once");
        assert.deepEqual(oFakeXHRStub.open.getCall(0).args, [
            "HEAD", "/some/ping/service", true
        ], "XHR#open method was called with the expected arguments");
        assert.strictEqual(oFakeXHRStub.send.callCount, 1, "send method of the XHR object was called exactly once");
    });

    QUnit.test("sessionKeepAlive: sends no XHR request if sessionKeepAlive is not configured", function (assert) {
        // Arrange
        oXMLHttpRequestStub = sinon.stub(window, "XMLHttpRequest");
        var oAdapter = new sap.ushell.adapters.cdm.ContainerAdapter(this.initialSystem, undefined, {
            config: {
            }
        });

        // Act
        oAdapter.sessionKeepAlive();

        // Assert
        assert.strictEqual(oXMLHttpRequestStub.callCount, 0, "XMLHttpRequest constructor was not called");
    });

});
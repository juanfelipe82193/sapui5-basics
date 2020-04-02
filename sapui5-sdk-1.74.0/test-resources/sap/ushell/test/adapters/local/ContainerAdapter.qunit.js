// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.ContainerAdapter
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/utils"
], function (testUtils , utils) {
    "use strict";
    /*global assert, asyncTest, expect, module, start, stop,
    jQuery, sap, sinon, setTimeout*/

    jQuery.sap.require("sap.ushell.adapters.local.ContainerAdapter");
    jQuery.sap.require("sap.ushell.System");

    module("sap.ushell.adapters.local.ContainerAdapter", {
        setup: function () {
            sinon.stub(utils, "reload");
        },
        teardown: function () {
                testUtils.restoreSpies(
                utils.reload,
                sap.ui.getCore().getConfiguration().getLanguage
            );
        }
    });

    asyncTest("create Adapter", function () {
        var oSystem = {},
            oAdapter = new sap.ushell.adapters.local.ContainerAdapter(oSystem),
            oPromise;

        expect(5);
        assert.ok(typeof oAdapter.load === 'function', "adapter has load() function");
        assert.strictEqual(oAdapter.getSystem(), oSystem, "getSystem()");
        oPromise = oAdapter.load();
        assert.ok(typeof oPromise.done === "function", "load() returned a jQuery promise");
        assert.strictEqual(oPromise.resolve, undefined,
            "load() does not return the jQuery deferred object itself");
        oPromise.done(function () {
            assert.ok(true, "done function is called");
        }).always(function () {
            start();
        });
    });

    asyncTest("create adapter with config", function () {
        var oSystem = {},
            sParameter,
            oAdapterConfig,
            oAdapter,
            oUser;

        // Arrange
        expect(7);
        oAdapterConfig = {
            config: {
                id: "TEST_USER",
                firstName: "Tester",
                lastName: "Man",
                fullName: "Tester_Man",
                accessibility: true,
                language: "DE",
                theme: "sap_nocrystal",
                bootTheme: {
                    theme: "sap_greencrystal",
                    root: "root"
                },
                setAccessibilityPermitted: false,
                setThemePermitted: false,
                userProfile: [
                    {id: "THEME", value: "sap_redcrystal"},
                    {id: "TIME_ZONE", value: "GMT", editState: 1},
                    {id: "LANGUAGE", value: "en", editState: 1}
                ]
            }
        };
        // Act
        oAdapter = new sap.ushell.adapters.local.ContainerAdapter(oSystem, sParameter, oAdapterConfig);
        oAdapter.load().always(function () {
            oUser = oAdapter.getUser();
            // Assert
            start();
            assert.equal(typeof oUser, "object", "Success: User object was returned.");
            assert.equal(oUser.getAccessibilityMode(), oAdapterConfig.config.accessibility,
                    "Success: Accessibility on (" + oUser.getAccessibilityMode() + ") from adapter config is set correctly.");
            assert.equal(oUser.getFirstName(), oAdapterConfig.config.firstName,
                    "Success: First name (" + oUser.getFirstName() + ") from adapter config is set correctly.");
            assert.equal(oUser.getId(), oAdapterConfig.config.id,
                    "Success: ID (" + oUser.getId() + ") from adapter config is set correctly.");
            assert.equal(oUser.getLanguage(), oAdapterConfig.config.language,
                    "Success: Language (" + oUser.getLanguage() + ") from adapter config is set correctly.");
            assert.equal(oUser.isSetThemePermitted(), oAdapterConfig.config.setThemePermitted,
                    "Success: Set theme permitted (" + oUser.isSetThemePermitted() + ") from adapter config is set correctly.");
            assert.equal(oUser.getTheme(), oAdapterConfig.config.bootTheme.theme,
                    "Success: Theme (" + oUser.getTheme() + ") from adapter config is set correctly.");
        });
    });

    [
      {
         ui5Lang: undefined,
         expectedLang: "en"
      },
      {
          ui5Lang: "en-US",
          expectedLang: "en-US"
      },
      {
          ui5Lang: "de",
          expectedLang: "de"
      }
    ].forEach(function (oFixture) {
        asyncTest("create adapter with default config; UI5 language " + oFixture.ui5Lang , function () {
            var oSystem = {},
                sParameter,
                oAdapterConfig,
                oAdapterDefaultConfig,
                oAdapter,
                oUser;

            // fake UI5 language
            sinon.stub(sap.ui.getCore().getConfiguration(), "getLanguage").returns(oFixture.ui5Lang);

            // Arrange
            expect(7);
            oAdapterConfig = {};
            oAdapterDefaultConfig = { // default values copied form the adapter
                id: "DEFAULT_USER",
                firstName: "Default",
                lastName: "User",
                fullName: "Default User",
                accessibility: false,
                isJamActive: false,
                language: "en",
                bootTheme: {
                    theme: "sap_fiori_3",
                    root: ""
                },
                setAccessibilityPermitted: true,
                setThemePermitted: true
            };
            // Act
            oAdapter = new sap.ushell.adapters.local.ContainerAdapter(oSystem, sParameter, oAdapterConfig);
            oAdapter.load().always(function () {
                oUser = oAdapter.getUser();
                // Assert
                start();
                assert.equal(typeof oUser, "object", "Success: User object was returned.");
                assert.equal(oUser.getAccessibilityMode(), oAdapterDefaultConfig.accessibility,
                        "Success: Accessibility on (" + oUser.getAccessibilityMode() + ") from adapter config is set correctly.");
                assert.equal(oUser.getFirstName(), oAdapterDefaultConfig.firstName,
                        "Success: First name (" + oUser.getFirstName() + ") from adapter config is set correctly.");
                assert.equal(oUser.getId(), oAdapterDefaultConfig.id,
                        "Success: ID (" + oUser.getId() + ") from adapter config is set correctly.");
                assert.equal(oUser.getLanguage(), oFixture.expectedLang,
                        "Success: Language (" + oUser.getLanguage() + ") from adapter config is set correctly.");
                assert.equal(oUser.isSetThemePermitted(), oAdapterDefaultConfig.setThemePermitted,
                        "Success: Set theme permitted (" + oUser.isSetThemePermitted() + ") from adapter config is set correctly.");
                assert.equal(oUser.getTheme(), oAdapterDefaultConfig.bootTheme.theme,
                        "Success: Theme (" + oUser.getTheme() + ") from adapter config is set correctly.");
            });
        });
    });

    asyncTest("setUserCallback with namespace", function () {
        var oSystem = {},
            sParameter,
            oAdapterConfig,
            oAdapter,
            oUser,
            oUserName;

        // Arrange
        expect(5);
        oAdapterConfig = {
            config: {
                setUserCallback: "sap.mobile.setUser"
            }
        };
        oUserName = {
            id: "DELAYED_USER",
            firstName: "Delayed",
            lastName: "User",
            fullName: "Delayed User"
        };
        // Act
        jQuery.sap.getObject("sap.mobile", 0).setUser = function (oDeferred) {
            setTimeout(function () {
                oDeferred.resolve(oUserName);
            }, 500);
        };
        oAdapter = new sap.ushell.adapters.local.ContainerAdapter(oSystem, sParameter, oAdapterConfig);
        oUser = oAdapter.getUser();
        // Assert
        assert.equal(oUser, undefined, "User object is still undefined");
        // Act - set the username
        oAdapter.load().always(function () {
            oUser = oAdapter.getUser();
            // Assert
            start();
            assert.equal(oUser.getId(), oUserName.id,
                    "Success: User ID (" + oUser.getId() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getFirstName(), oUserName.firstName,
                    "Success: First name (" + oUser.getFirstName() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getLastName(), oUserName.lastName,
                    "Success: Last name (" + oUser.getLastName() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getFullName(), oUserName.fullName,
                    "Success: Full name (" + oUser.getFullName() + ") was set correctly via callback mechanism.");
        });
    });

    asyncTest("setUserCallback without namespace", function () {
        var oSystem = {},
            sParameter,
            oAdapterConfig,
            oAdapter,
            oUser,
            oUserName;

        // Arrange
        expect(5);
        oAdapterConfig = {
            config: {
                setUserCallback: "setUser"
            }
        };
        oUserName = {
            id: "DELAYED_USER",
            firstName: "Delayed",
            lastName: "User",
            fullName: "Delayed User"
        };
        // Act
        window.setUser = function (oDeferred) {
            setTimeout(function () {
                oDeferred.resolve(oUserName);
            }, 500);
        };
        oAdapter = new sap.ushell.adapters.local.ContainerAdapter(oSystem, sParameter, oAdapterConfig);
        oUser = oAdapter.getUser();
        // Assert
        assert.equal(oUser, undefined, "User object is still undefined");
        // Act - set the username
        oAdapter.load().always(function () {
            oUser = oAdapter.getUser();
            // Assert
            start();
            assert.equal(oUser.getId(), oUserName.id,
                    "Success: User ID (" + oUser.getId() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getFirstName(), oUserName.firstName,
                    "Success: First name (" + oUser.getFirstName() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getLastName(), oUserName.lastName,
                    "Success: Last name (" + oUser.getLastName() + ") was set correctly via callback mechanism.");
            assert.equal(oUser.getFullName(), oUserName.fullName,
                    "Success: Full name (" + oUser.getFullName() + ") was set correctly via callback mechanism.");
        });
    });

    asyncTest("logout()", function () {
        var oSystem = new sap.ushell.System({}),
            oSystemAdapter = new sap.ushell.adapters.local.ContainerAdapter(oSystem),
            oLogMock = testUtils.createLogMock()
                .info("Demo system logged out: " + oSystem.getAlias(), null,
                      "sap.ushell.adapters.local.ContainerAdapter");

        //code under test
        oSystemAdapter.logout().done(function () {
            start();
            oLogMock.verify();
            assert.ok(utils.reload.calledOnce, "reload called");
        });

    });
});

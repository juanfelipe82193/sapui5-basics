 // Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.require([

], function (AllMyApps) {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /* global module test ok */

    jQuery.sap.require("sap.ushell.services.Container");

    module(
        "sap.ushell.services.AllMyApps",
        {
            setup : function () {},
            teardown : function () {}
        }
    );

    test("test - service configuration", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = {
            services: {
                AllMyApps: {
                    config: {
                        enabled: true,
                        showHomePageApps: false,
                        showCatalogApps: true,
                        showExternalProviders: false
                    }
                }
            }
        };

        sap.ushell.bootstrap("local").then(function () {
            var oService = sap.ushell.Container.getService("AllMyApps");

            ok(oService.isEnabled() === true, "The value of isEnabled is according to the configuration");
            ok(oService.isHomePageAppsEnabled() === false, "The value of isShowHomePageApps is according to the configuration");
            ok(oService.isCatalogAppsEnabled() === true, "The value of isCatalogAppsEnabled is according to the configuration");
            ok(oService.isExternalProviderAppsEnabled() === false, "The value of isExternalProviderAppsEnabled is according to the configuration");
    
            delete sap.ushell.Container;
            done();
        });
    });

    test("test - service disabling by configuration", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = {
            services: {
                AllMyApps: {
                    config: {
                        enabled: false
                    }
                }
            }
        };

        sap.ushell.bootstrap("local").then(function () {
            var oService = sap.ushell.Container.getService("AllMyApps");

            ok(oService.isEnabled() === false, "The value of isEnabled is according to the configuration");
    
            delete sap.ushell.Container;
            done();
        });
    });

    test("test - default configuration 1", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = {
            services: {
                AllMyApps: {
                    config: {
                        enabled: true
                    }
                }
            }
        };

        sap.ushell.bootstrap("local").then(function () {
            var oService = sap.ushell.Container.getService("AllMyApps");

            ok(oService.isEnabled() === true, "The value of isEnabled is true by default");
            ok(oService.isHomePageAppsEnabled() === true, "The value of isShowHomePageApps is true by default");
            ok(oService.isCatalogAppsEnabled() === true, "The value of isCatalogAppsEnabled is true by default");
            ok(oService.isExternalProviderAppsEnabled() === true, "The value of isExternalProviderAppsEnabled is true by default");
    
            delete sap.ushell.Container;
            done();
        });
    });

    test("test - default configuration 2", function (assert) {
        var done = assert.async();
        window["sap-ushell-config"] = {
            services: {}
        };

        sap.ushell.bootstrap("local").then(function () {
            var oService = sap.ushell.Container.getService("AllMyApps");

            ok(oService.isEnabled() === true, "The value of isEnabled is true by default");
            ok(oService.isHomePageAppsEnabled() === true, "The value of isShowHomePageApps is true by default");
            ok(oService.isCatalogAppsEnabled() === true, "The value of isCatalogAppsEnabled is true by default");
            ok(oService.isExternalProviderAppsEnabled() === true, "The value of isExternalProviderAppsEnabled is true by default");
    
            delete sap.ushell.Container;
            done();
        });
    });

    test("test registerExternalProvider - validation of data_sources/providers registration", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            var oService = sap.ushell.Container.getService("AllMyApps"),
                oProviders,
                oDataSource1 = {
                    getTitle : function () {
                        return "Title1";
                    }
                },
                oDataSource2 = {
                    getTitle : function () {
                        return "Title2";
                    },
                    getData : function () {
                        return [];
                    }
                },
                oDataSource3 = {
                    getData : function () {
                        return [];
                    }
                },
                oDataSource4 = {
                    getTitle : function () {
                        return "Title4";
                    },
                    getData : function () {
                        return [{data: "Provider4_Data"}];
                    }
                };

            oService.registerExternalProvider("DataSource1", oDataSource1);
            oService.registerExternalProvider("DataSource2", oDataSource2);
            oService.registerExternalProvider("DataSource3", oDataSource3);
            oService.registerExternalProvider("DataSource4", oDataSource4);

            oProviders = oService.getDataProviders();
            ok(oProviders.DataSource1 === undefined, "DataSource1 does not exists");
            ok(oProviders.DataSource2 !== undefined, "DataSource2 exists");
            ok(oProviders.DataSource3 === undefined, "DataSource3 does not exists");
            ok(oProviders.DataSource4 !== undefined, "DataSource4 exists");
            ok(oProviders.DataSource4.getTitle() === "Title4", "DataSource4 getTitle function called");

            delete sap.ushell.Container;
            done();
        });
    });
});

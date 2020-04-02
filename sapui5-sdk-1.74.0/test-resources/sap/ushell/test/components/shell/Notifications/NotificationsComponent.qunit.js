// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.Notifications.Components
 *
 */
sap.ui.require([
    "sap/ushell/services/Container",
    "sap/ushell/Config",
    "sap/ushell/ui/shell/ShellHeadItem"
], function (Container, Config, ShellHeadItem) {
    "use strict";
    /*global module, test, sinon, sap, window */

    module("sap.ushell.renderers.fiori2.notifications.Notifications, Fiori 3 tests", {

        beforeEach: function () {
            window["sap-ushell-config"] = {
                "services": {
                    "Notifications": {
                        config: {
                            enabled: true
                        }
                    }
                },
                "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {
                                "enableNotificationsUI": true,
                                "applications": {
                                    "Shell-home": {}
                                },
                                "rootIntent": "Shell-home"
                            }
                        }
                    }
                }
            };
        },
        afterEach: function () {
            // delete Container; will not work have to use delete sap.ushell.Container;
            delete sap.ushell.Container;
        }
    });
    var createRenderer = function () {
        sap.ushell.Container.getRenderer = function () {
            return {
                getModelConfiguration: function () {
                    return {
                        enableNotificationsUI: true
                    };
                },
                getShellConfig: function () {
                    return {
                        enableNotificationsUI: false
                    };
                },
                addShellDanglingControl: function () {
                },
                oShellModel: {
                    getModel: function () {
                        return {
                            getProperty: function () {
                                return 10;
                            },
                            setProperty: function () {
                            }
                        };
                    }
                },
                shellCtrl: {
                    getModel: function () {
                        return {
                            setProperty: function () {
                            }
                        };
                    }
                }
            };
        };
    };

    test("Notification count is preset correctly", function (assert) {
        var done = assert.async();
        // arrange


        sap.ushell.bootstrap("local").then(function () {
            this.oService = sap.ushell.Container.getService("Notifications");
            this.init = sinon.stub(this.oService, "init").returns({
                fail: function () {
                },
                done: function () {
                }
            });
            createRenderer();
            var oNotificationCountButton = new ShellHeadItem("NotificationsCountButton");

            // act
            var oComponent = sap.ui.component({
                id: "sap-ushell-components-Notifications-component",
                name: "sap.ushell.components.shell.Notifications",
                componentData: {}
            });
            assert.equal(!!oComponent, true, "Notification component created");
            var oModel = sap.ushell.Container.getRenderer().oShellModel.getModel();
                assert.equal(oModel.getProperty("/notificationsCount"), 10, "expected Notification count returned");
            done();

            // clean up
            oComponent.destroy();
            oNotificationCountButton.destroy();
        });
    });


});



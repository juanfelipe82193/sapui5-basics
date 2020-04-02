// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Menu
 * @version 1.74.0
 */
sap.ui.require([
    "sap/ushell/services/Menu",
    "sap/ushell/utils"
], function (Menu, UShellUtils) {
    "use strict";
    /* global QUnit, sinon */

    QUnit.module("The function getMenuEntries", {
        beforeEach: function () {
            this.aMenuEntries = [];
            var oAdapter = {
                getMenuEntries: function () {
                    return Promise.resolve(this.aMenuEntries);
                }.bind(this)
            };
            this.oMenuService = new Menu(oAdapter);
            this.oGenerateUniqueIdStub = sinon.stub(UShellUtils, "generateUniqueId");
            this.oGenerateUniqueIdStub.onCall(0).returns("1");
            this.oGenerateUniqueIdStub.onCall(1).returns("2");
            this.oGenerateUniqueIdStub.onCall(2).returns("3");
        },
        afterEach: function () {
            this.oGenerateUniqueIdStub.restore();
        }
    });

    QUnit.test("Returns menu items sorted alphabetically and with added uid", function (assert) {
        // Arrange
        this.aMenuEntries = [
            {
                title: "ZTest space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "intent",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "ZTEST_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "ZTEST_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            },
            {
                title: "UI2 FLP Demo - Test Space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "intent",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "/UI2/FLP_DEMO_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "/UI2/FLP_DEMO_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            },
            {
                title: "ATest Space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "intent",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "ZTEST_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "ZTEST_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            }
        ];

        var aExpectedMenuEntries = [
            {
                uid: "3",
                title: "ATest Space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "intent",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "ZTEST_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "ZTEST_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            },
            {
                uid: "2",
                title: "UI2 FLP Demo - Test Space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "intent",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "/UI2/FLP_DEMO_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "/UI2/FLP_DEMO_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            },
            {
                uid: "1",
                title: "ZTest space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "intent",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "ZTEST_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "ZTEST_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            }
        ];

        // Act
        var oMenuPromise = this.oMenuService.getMenuEntries();

        // Assert
        return oMenuPromise.then(function (aMenuEntries) {
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "The menu items are sorted alphabetically.");
        });
    });
});
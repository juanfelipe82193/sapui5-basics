// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components._HomepageManager.PagingManager
 */
QUnit.config.autostart = false;

sap.ui.require([
    "sap/ushell/library",
    "sap/ushell/components/_HomepageManager/PagingManager",
    "sap/ushell/Config"
], function (Library, PagingManager, Config) {
    "use strict";

    /*global QUnit, stop, jQuery, sap, sinon */

    QUnit.module("sap.ushell.components._HomepageManager.PagingManager");

    QUnit.test("PagingManager create instance", function (assert) {
        var oPagingManager = new PagingManager('catalogPaging', {
            supportedElements: {
                tile: {className: 'sapUshellTile'},
                link: {className: 'sapUshellLinkTile'}
            },
            containerHeight: 500,
            containerWidth: 500
        });

        assert.ok(oPagingManager, 'PagingManager Instance was created');
    });

    QUnit.test("PagingManager number of tiles per page Size (500, 500)", function (assert) {
        var oPagingManager = new PagingManager('catalogPaging', {
            supportedElements: {
                tile: {className: 'sapUshellTile'},
                link: {className: 'sapUshellLinkTile'}
            },
            containerHeight: 500,
            containerWidth: 500
        });

        assert.ok(oPagingManager, 'PagingManager Instance was created');
        oPagingManager.moveToNextPage();
        assert.strictEqual(oPagingManager.getNumberOfAllocatedElements(), 325, 'PagingManager tiles in first page');
        oPagingManager.moveToNextPage();
        assert.strictEqual(oPagingManager.getNumberOfAllocatedElements(), 650, 'PagingManager tiles in second page');

    });

    QUnit.test("PagingManager number of tiles per page Size (100, 350)", function (assert) {
        var oPagingManager = new PagingManager('catalogPaging', {
            supportedElements: {
                tile: {className: 'sapUshellTile'},
                link: {className: 'sapUshellLinkTile'}
            },
            containerHeight: 100,
            containerWidth: 350
        });

        assert.ok(oPagingManager, 'PagingManager Instance was created');
        oPagingManager.moveToNextPage();
        assert.strictEqual(oPagingManager.getNumberOfAllocatedElements(), 45, 'PagingManager tiles in first page');
        oPagingManager.moveToNextPage();
        assert.strictEqual(oPagingManager.getNumberOfAllocatedElements(), 90, 'PagingManager tiles in secound page');
    });

    QUnit.test("PagingManager number of tiles per page Size (1000, 1000)", function (assert) {
        var oPagingManager = new PagingManager('catalogPaging', {
            supportedElements: {
                tile: {className: 'sapUshellTile'},
                link: {className: 'sapUshellLinkTile'}
            },
            containerHeight: 1000,
            containerWidth: 1000
        });

        assert.ok(oPagingManager, 'PagingManager Instance was created');
        oPagingManager.moveToNextPage();
        assert.strictEqual(oPagingManager.getNumberOfAllocatedElements(), 1250, 'PagingManager tiles in first page');
        oPagingManager.moveToNextPage();
        assert.strictEqual(oPagingManager.getNumberOfAllocatedElements(), 2500, 'PagingManager tiles in secound page');
    });

    QUnit.test("PagingManager number of tiles per page Size (10, 10)", function (assert) {
        var oPagingManager = new PagingManager('catalogPaging', {
            supportedElements: {
                tile: {className: 'sapUshellTile'},
                link: {className: 'sapUshellLinkTile'}
            },
            containerHeight: 10,
            containerWidth: 10
        });
        assert.ok(oPagingManager, 'PagingManager Instance was created');
        oPagingManager.moveToNextPage();
        assert.strictEqual(oPagingManager.getNumberOfAllocatedElements(), 10, 'PagingManager tiles in first page');
        oPagingManager.moveToNextPage();
        assert.strictEqual(oPagingManager.getNumberOfAllocatedElements(), 20, 'PagingManager tiles in secound page');
    });

    QUnit.test("PagingManager number of tiles per page Size (1000, 1000) before styles was loaded", function (assert) {
        var jQueryStub = sinon.stub(window, "jQuery");
        jQueryStub.withArgs("<div>").returns({
            addClass: function () {
                return this;
            },
            remove: function () {},
            height: function () {
                return 0;
            },
            width: function () {
                return 1000;
            }
        });
        jQueryStub.withArgs("body").returns({
            append: function () {}
        });

        var oPagingManager = new PagingManager('catalogPaging', {
            supportedElements: {
                tile: {className: 'sapUshellTile'}
            },
            containerHeight: 1000,
            containerWidth: 1000
        });

        oPagingManager.moveToNextPage();
        assert.ok(oPagingManager.getNumberOfAllocatedElements() == 100, 'PagingManager tiles in first page when styles was not loaded');
        jQueryStub.restore();
    });

    [
        {
            description: "return 0 for invisible group",
            oGroup: {
                isGroupVisible: false
            },
            expextedValue: 0
        },
        {
            description: "return 0 for empty default group",
            oGroup: {
                isDefaultGroup: true,
                tiles: []
            },
            expextedValue: 0
        },
        {
            description: "return 0 for empty locked group",
            oGroup: {
                isGroupLocked: true,
                tiles: []
            },
            expextedValue: 0
        },
        {
            description: "The height of the group header is return if there is no tiles",
            oGroup: {
                tiles: []
            },
            containerHeight: 48 + 8,
            expextedValue: 1
        },
        {
            description: "The group with one tile",
            oGroup: {
                tiles: [
                    {
                        isTileIntentSupported: true
                    }
                ]
            },
            containerHeight: 48 + 8 + 176 + 7,
            expextedValue: 1
        },
        {
            description: "The group with one tile and link",
            oGroup: {
                tiles: [
                    {
                        isTileIntentSupported: true
                    }
                ],
                links: [
                    {
                        title: "test"
                    }
                ]
            },
            containerHeight: 48 + 8 + 176 + 7 + 44,
            expextedValue: 1
        },
        {
            description: "The group with 2 rows",
            oGroup: {
                tiles: [
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    }
                ]
            },
            containerHeight: 48 + 8 + (176 + 7) * 2,
            expextedValue: 1
        }

    ].forEach(function (oTestCase) {
        QUnit.test("getGroupHeight with default size behavior: " + oTestCase.description, function (assert) {
            var oPagingManager,
                result;

            oPagingManager = new PagingManager('testPaging', {
                containerHeight: oTestCase.containerHeight || 1000,
                containerWidth: 1000
            });
            result = oPagingManager.getGroupHeight(oTestCase.oGroup);
            assert.equal(result.toFixed(3), oTestCase.expextedValue, "The result of getGroupHeight should be equal " + oTestCase.expextedValue);
        });
    });


    [
        {
            description: "The group with one tile",
            oGroup: {
                tiles: [
                    {
                        isTileIntentSupported: true
                    }
                ]
            },
            containerHeight: 48 + 8 + 148 + 7,
            expextedValue: 1
        },
        {
            description: "The group with one tile and link",
            oGroup: {
                tiles: [
                    {
                        isTileIntentSupported: true
                    }
                ],
                links: [
                    {
                        title: "test"
                    }
                ]
            },
            containerHeight: 48 + 8 + 148 + 7 + 44,
            expextedValue: 1
        },
        {
            description: "The group with 2 rows",
            oGroup: {
                tiles: [
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    },
                    {
                        isTileIntentSupported: true
                    }
                ]
            },
            containerHeight: 48 + 8 + (148 + 7) * 2,
            expextedValue: 1
        }

    ].forEach(function (oTestCase) {
        QUnit.test("getGroupHeight with small size behavior: " + oTestCase.description, function (assert) {
            var oPagingManager,
                result,
                oConfigLastStub = sinon.stub(Config, "last").returns("Small");

            oPagingManager = new PagingManager('testPaging', {
                containerHeight: oTestCase.containerHeight || 1000,
                containerWidth: 1000
            });
            result = oPagingManager.getGroupHeight(oTestCase.oGroup);
            assert.equal(result.toFixed(3), oTestCase.expextedValue, "The result of getGroupHeight should be equal " + oTestCase.expextedValue);
            oConfigLastStub.restore();
        });
    });

    QUnit.start();
});

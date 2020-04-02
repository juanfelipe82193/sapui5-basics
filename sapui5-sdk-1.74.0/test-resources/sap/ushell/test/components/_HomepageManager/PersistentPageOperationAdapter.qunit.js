
// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components._HomepageManager.PersistentPageOperationAdapter
 */


sap.ui.require([
    "sap/ushell/EventHub",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/library",
    "sap/ushell/components/_HomepageManager/PersistentPageOperationAdapter",
    "sap/ushell/Config",
    "sap/ushell/services/Container"
], function (EventHub, HomepageManager, Library, PersistentPageOperationAdapter, Config, Container) {
    "use strict";

    /*global QUnit, stop, jQuery, sap, sinon */
    // avoid creating the real local LaunchPageAdapter
    function overrideLaunchPageAdapter () {
        var oAdapter = sap.ushell.Container.getService("LaunchPage");
        jQuery.extend(oAdapter, {
            moveTile: function () { return jQuery.Deferred().resolve(); },
            getTileView: function () {
                var oDfd = jQuery.Deferred();
                oDfd.resolve({
                    destroy: function () {},
                    attachPress: function () {}
                });
                return oDfd.promise();
            },
            getTileId: function (oTile) {
                if (oTile) {
                    return oTile.id;
                }
            },
            getTileTarget: function () {
            },
            getTileTitle: function () {
                return "TileDummyTitle";
            },
            setTileVisible: function () {
            },
            isTileIntentSupported: function (oTile) {
                return (oTile.properties.formFactor.indexOf("Desktop") !== -1);
            },
            addTile: function (oCatalogTile, oGroup) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve(oCatalogTile);
                return oDfd.promise();
            },
            isCatalogsValid: function (oCatalog) {
                return true;
            },
            getGroups: function () {
                return jQuery.Deferred().resolve(mockData.groups);
            },
            addGroup: function (sTitle) {
                var oGroup = {
                    id: sTitle,
                    groupId: sTitle,
                    title: sTitle,
                    tiles: []
                };
                return jQuery.Deferred().resolve(oGroup);
            },
            getCatalogs: function () {
                var oDfd = jQuery.Deferred();

                //Simulate an async function with a loading delay of up to 5 sec
                // Simulates a progress call (the progress function of the promise will be called)
                mockData.catalogs.forEach(function (oCatalog) {
                    window.setTimeout(function () {
                        oDfd.notify(oCatalog);
                    }, 50);
                });
                // TODO: simulate a failure (which will trigger the fail function of the promise)
                //oDfd.reject();

                window.setTimeout(function () {
                    oDfd.resolve(mockData.catalogs);
                }, 350);

                return oDfd.promise();
            },
            getGroupId: function (oGroup) {
                return oGroup.id;
            },
            getDefaultGroup: function () {
                return jQuery.Deferred().resolve([mockData.groups[0]]);
            },
            getGroupTiles: function (oGroup) {
                return oGroup.tiles;
            },
            getGroupTitle: function (oGroup) {
                return oGroup.title;
            },
            setGroupTitle: function (oGroup, sTitle) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            moveGroup: function (oGroup, iIndex) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeGroup: function (oGroup, iIndex) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeTile: function (oGroup, oTile) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            isGroupRemovable: function () {
                return true;
            },
            getTileSize: function () {
                return "1x1";
            },
            getCatalogTileSize: function () {
                return "1x1";
            },
            getTileDebugInfo: function () {
                return "";
            },
            getCatalogError: function () {
                return "";
            },
            getCatalogId: function (oCatalog) {
                return oCatalog.id;
            },
            getCatalogTitle: function (oCatalog) {
                return oCatalog.title;
            },
            getCatalogTiles: function (oCatalog) {
                return jQuery.Deferred().resolve(oCatalog.tiles);
            },
            getCatalogTileTitle: function (oCatalogTile) {
                return oCatalogTile ? oCatalogTile.id : undefined;
            },
            getCatalogTileKeywords: function () {
                return [];
            },
            getCatalogTileId: function (oCatalogTile) {
                return oCatalogTile ? oCatalogTile.id : undefined;
            },
            getCatalogTileView: function () {
                return {destroy: function () {}};
            },
            isLinkPersonalizationSupported: function (oTile) {
                if (oTile) {
                    return oTile.isLinkPersonalizationSupported;
                }
                    return false;

            }
        });
        //mock data for jsview object
        sap.ui.jsview = function () {
            return {
                setWidth: function () {
                },
                setDisplayBlock: function () {
                },
                addEventDelegate: function () {
                }
            };
        };
    }

    var oHomepageManager = null,
        oPersistentPageOperationAdapter = null,
        oEventBus = sap.ui.getCore().getEventBus(),
        mockData,
        oldsap_ui_jsview,
        oUserRecentsStub,
        oUsageAnalyticsLogStub,
        i;

    function usageAnalyticsCheck (eventName, expectedFunctionCallCount, expectedEventType, expectedEventValue, expectedAdditionalProp) {
        ok(oUsageAnalyticsLogStub.callCount, expectedFunctionCallCount, eventName + " action should call logCustomEvent(UsageAnalytics) " + expectedFunctionCallCount + " times at this point");
        ok(oUsageAnalyticsLogStub.args[0][0] === expectedEventType, eventName + " action should call logCustomEvent(UsageAnalytics) with eventType: " + expectedEventType);
        ok(oUsageAnalyticsLogStub.args[0][1] === expectedEventValue, eventName + " action should call logCustomEvent(UsageAnalytics) with eventValue: " + expectedEventValue);
        if (expectedAdditionalProp && expectedAdditionalProp.length > 0) {
            for (i = 0; i < expectedAdditionalProp.length; i++) {
                if (expectedAdditionalProp[i] !== undefined) {
                    ok(oUsageAnalyticsLogStub.args[0][2][i] === expectedAdditionalProp[i], eventName + " action should call logCustomEvent(UsageAnalytics) with event property: " + expectedAdditionalProp);
                }
            }

        }
    }

    module("sap.ushell.components.HomepageManager", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                jQuery.sap.flpmeasure = {
                    end: function () {},
                    start: function () {},
                    endFunc: function () {},
                    startFunc: function () {}
                };

                jQuery("<div id=\"layoutWrapper\" style=\"position: absolute;\"></div>").width(1800).appendTo("body");
                oUserRecentsStub = sinon.stub(sap.ushell.Container.getService("UserRecents"), "addAppUsage");
                oUsageAnalyticsLogStub = sinon.stub(sap.ushell.Container.getService("UsageAnalytics"), "logCustomEvent");
                oldsap_ui_jsview = sap.ui.jsview;
                overrideLaunchPageAdapter();
                mockData = {
                    groups: [
                        {
                            id: "group_0",
                            groupId: "group_0",
                            title: "group_0",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 0,
                            object: {
                                id: "group_0",
                                groupId: "group_0",
                                title: "group_0",
                                tiles: [
                                    {
                                        id: "tile_00",
                                        uuid: "tile_00",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_00",
                                            uuid: "tile_00"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_01",
                                        uuid: "tile_01",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_01",
                                            uuid: "tile_01"
                                        },
                                        properties: {
                                            formFactor: "Tablet,Phone"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_02",
                                        uuid: "tile_02",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_02",
                                            uuid: "tile_02"
                                        },
                                        properties: {
                                            formFactor: "Desktop"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_03",
                                        uuid: "tile_03",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_03",
                                            uuid: "tile_03"
                                        },
                                        properties: {
                                            formFactor: "Phone"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_04",
                                        uuid: "tile_04",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_04",
                                            uuid: "tile_04"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Tablet"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_05",
                                        uuid: "tile_05",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_05",
                                            uuid: "tile_05"
                                        },
                                        properties: {
                                            formFactor: "Tablet"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_000",
                                        uuid: "tile_000",
                                        isTileIntentSupported: true,
                                        isLink: true,
                                        object: {
                                            id: "tile_000",
                                            uuid: "tile_000"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
                                        content: []
                                    }
                                ]
                            },
                            tiles: [
                                {
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: {
                                        formFactor: "Tablet,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_02",
                                    uuid: "tile_02",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_02",
                                        uuid: "tile_02"
                                    },
                                    properties: {
                                        formFactor: "Desktop"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_03",
                                    uuid: "tile_03",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_03",
                                        uuid: "tile_03"
                                    },
                                    properties: {
                                        formFactor: "Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_04",
                                    uuid: "tile_04",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_04",
                                        uuid: "tile_04"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Tablet"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_05",
                                    uuid: "tile_05",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_05",
                                        uuid: "tile_05"
                                    },
                                    properties: {
                                        formFactor: "Tablet"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_000",
                                    uuid: "tile_000",
                                    isTileIntentSupported: true,
                                    isLink: true,
                                    object: {
                                        id: "tile_000",
                                        uuid: "tile_000"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }
                            ],
                            pendingLinks: [
                                {
                                    id: "tile_001",
                                    uuid: "tile_001",
                                    size: "1x1",
                                    isLink: true,
                                    object: {
                                        id: "tile_000",
                                        uuid: "tile_000"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }
                            ],
                            links: [
                                {
                                    id: "tile_001",
                                    uuid: "tile_001",
                                    size: "1x1",
                                    isLink: true,
                                    object: {
                                        id: "tile_000",
                                        uuid: "tile_000"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }
                            ]
                        },
                        {
                            id: "group_1",
                            groupId: "group_1",
                            title: "group_1",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 1,
                            object: {
                                id: "group_1",
                                groupId: "group_1",
                                title: "group_1"
                            },
                            tiles: [],
                            pendingLinks: [],
                            links: []
                        },
                        {
                            id: "group_2",
                            groupId: "group_2",
                            title: "group_2",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 2,
                            object: {
                                id: "group_2",
                                groupId: "group_2",
                                title: "group_2",
                                tiles: [
                                    {
                                        id: "tile_00",
                                        uuid: "tile_00",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_00",
                                            uuid: "tile_00"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
                                        content: []
                                    }
                                ]
                            },
                            tiles: [
                                {
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }
                            ],
                            pendingLinks: [],
                            links: []
                        },
                        {
                            id: "group_hidden",
                            groupId: "group_hidden",
                            title: "group_hidden",
                            isGroupVisible: false,
                            isRendered: false,
                            index: 3,
                            object: {
                                id: "group_hidden",
                                groupId: "group_hidden",
                                title: "group_hidden"
                            },
                            tiles: [
                                {
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Tablet,Phone"
                                    },
                                    content: []
                                }
                            ],
                            pendingLinks: [],
                            links: []
                        },
                        {
                            id: "group_03",
                            groupId: "group_03",
                            title: "group_03",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 4,
                            object: {
                                id: "group_03",
                                groupId: "group_03",
                                title: "group_03"
                            },
                            tiles: [],
                            pendingLinks: [],
                            links: []
                        }
                    ],
                    catalogs: [
                        {
                            id: "catalog_0",
                            title: "catalog_0",
                            tiles: [
                                {
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: {
                                        formFactor: "Tablet,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_02",
                                    uuid: "tile_02",
                                    object: {
                                        id: "tile_02",
                                        uuid: "tile_02"
                                    },
                                    properties: {
                                        formFactor: "Desktop"
                                    },
                                    content: []
                                }
                            ]
                        },
                        {
                            id: "catalog_1",
                            title: "catalog_1",
                            tiles: [
                                {
                                    id: "tile_11",
                                    uuid: "tile_11",
                                    object: {
                                        id: "tile_11",
                                        uuid: "tile_11"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Tablet"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_12",
                                    uuid: "tile_12",
                                    properties: {
                                        formFactor: "Tablet"
                                    },
                                    content: []
                                }
                            ]
                        }
                    ],
                    catalogTiles: [
                        {
                            id: "tile_00",
                            uuid: "tile_00",
                            src: {
                                id: "tile_00",
                                uuid: "tile_00",
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties: {
                                    formFactor: "Desktop,Phone"
                                }
                            },
                            properties: {
                                formFactor: "Desktop,Phone"
                            },
                            associatedGroups: []
                        }, {
                            id: "tile_01",
                            uuid: "tile_01",
                            object: {
                                id: "tile_01",
                                uuid: "tile_01"
                            },
                            src: {
                                id: "tile_01",
                                uuid: "tile_01",
                                properties: {
                                    formFactor: "Tablet,Phone"
                                }
                            },
                            properties: {
                                formFactor: "Tablet,Phone"
                            },
                            associatedGroups: []
                        }, {
                            id: "tile_02",
                            uuid: "tile_02",
                            object: {
                                id: "tile_02",
                                uuid: "tile_02"
                            },
                            src: {
                                id: "tile_02",
                                uuid: "tile_02",
                                properties: {
                                    formFactor: "Desktop"
                                }
                            },
                            properties: {
                                formFactor: "Desktop"
                            },
                            associatedGroups: []
                        },
                        {
                            id: "tile_11",
                            uuid: "tile_11",
                            src: {
                                id: "tile_11",
                                uuid: "tile_11",
                                object: {
                                    id: "tile_11",
                                    uuid: "tile_11"
                                },
                                properties: {
                                    formFactor: "Desktop,Tablet"
                                }
                            },
                            properties: {
                                formFactor: "Desktop,Tablet"
                            },
                            associatedGroups: []
                        },
                        {
                            id: "tile_12",
                            uuid: "tile_12",
                            src: {
                                id: "tile_12",
                                uuid: "tile_12",
                                object: {
                                    id: "tile_12",
                                    uuid: "tile_12"
                                },
                                properties: {
                                    formFactor: "Tablet"
                                }
                            },
                            properties: {
                                formFactor: "Tablet"
                            },
                            associatedGroups: []
                        }
                    ],
                    tagList: []
                };
                start();
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            if (oHomepageManager) {
              oHomepageManager.destroy();
            }
            oHomepageManager = null;
            sap.ui.jsview = oldsap_ui_jsview;
            oUserRecentsStub.restore();
            oUsageAnalyticsLogStub.restore();
            delete sap.ushell.Container;
            EventHub._reset();
        }
    });
    // getPreparedTileModel _getTileModel

    test("getPreparedTileModel - returns the correct model when a tile is provided", function () {
        var oUidStub,
            oGetTileSizeStub,
            oGetTileIdStub,
            oGetCatalogTileIdStub,
            oEncodeURIComponentStub,
            oGetTileTargetStub,
            oGetTileDebugInfoStub,
            oIsTileIntentSupportedStub,
            oGetCardManifestStub,
            oGetIsAppBoxStub,
            oGetPropertyStub,
            oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
            oDummyTile = {
                controlId: "someId",
                object: "someObject",
                manifest: "someManifest",
                "isLinkPersonalizationSupported": true,
                _getIsAppBox:function() {return true;}
            },
            bIsGroupLocked = false,
            sTileType = "tile",
            oReturnValue,
            oExpectedReturnValue = {
                "isCustomTile": false,
                "object": oDummyTile,
                "isLinkPersonalizationSupported": true,
                "originalTileId": "someTileId",
                "uuid": "someUID",
                "tileCatalogId": "someCatalogTileId",
                "content": [],
                "long": false,
                "target": "someTarget",
                "debugInfo": "someTileDebugInfo",
                "isTileIntentSupported": true,
                "rgba": "",
                "isLocked": bIsGroupLocked,
                "showActionsIcon": false,
                "navigationMode": undefined
            };

        // Arrange
        oUidStub = sinon.stub(jQuery.sap, "uid").returns("someUID");
        oGetTileSizeStub = sinon.stub(oLaunchPageService, "getTileSize").returns("1x1");
        oGetTileIdStub = sinon.stub(oLaunchPageService, "getTileId").returns("someTileId");
        oGetCatalogTileIdStub = sinon.stub(oLaunchPageService, "getCatalogTileId");
        oEncodeURIComponentStub = sinon.stub(window, "encodeURIComponent").returns("someCatalogTileId");
        oGetTileTargetStub = sinon.stub(oLaunchPageService, "getTileTarget").returns("someTarget");
        oGetTileDebugInfoStub = sinon.stub(oLaunchPageService, "getTileDebugInfo").returns("someTileDebugInfo");
        oIsTileIntentSupportedStub = sinon.stub(oLaunchPageService, "isTileIntentSupported").returns(true);
        oGetCardManifestStub = sinon.stub(oLaunchPageService, "getCardManifest");

        var oPersistentPageOperationAdapter = PersistentPageOperationAdapter.getInstance();
        oGetIsAppBoxStub = sinon.stub(oPersistentPageOperationAdapter, "_getIsAppBox").returns(true);
        // oGetPropertyStub = sinon.stub(oPersistentPageOperationAdapter.oModel, "getProperty").returns(false);

        // Act
        oReturnValue = oPersistentPageOperationAdapter.getPreparedTileModel(oDummyTile, bIsGroupLocked, sTileType);

        // Assert
        oReturnValue.uuid = "someUID";//uid generated by sap/base/util/uid
        assert.deepEqual(oReturnValue, oExpectedReturnValue, "The tile model contains the expected data");

        // Cleanup
        oUidStub.restore();
        oGetTileSizeStub.restore();
        oGetTileIdStub.restore();
        oGetCatalogTileIdStub.restore();
        oEncodeURIComponentStub.restore();
        oGetTileTargetStub.restore();
        oGetTileDebugInfoStub.restore();
        oIsTileIntentSupportedStub.restore();
        oGetCardManifestStub.restore();
        oGetIsAppBoxStub.restore();
    });

    QUnit.test("create instance", function (assert) {
      oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
      oPersistentPageOperationAdapter = PersistentPageOperationAdapter.getInstance();
    assert.ok (true, "Instance was created");
    });


    // QUnit.module("sap.ushell.components._HomepageManager.PersistentPageOperationAdapter");

    // QUnit.test("PersistentPageOperationAdapter create instance", function (assert) {
    //     var done = assert.async();
    //     sap.ushell.bootstrap("local").then(function () {

    //         var oPersistentPageOperationAdapter = new PersistentPageOperationAdapter();
    //         assert.ok(oPersistentPageOperationAdapter, "PersistentPageOperationAdapter was created");
    //         done();
    //     });
    // });

});

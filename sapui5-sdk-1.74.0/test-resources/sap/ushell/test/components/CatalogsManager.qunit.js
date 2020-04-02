// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.CatalogsManager
 */
sap.ui.require([
    "sap/ushell/components/CatalogsManager",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/services/Container"
], function (CatalogsManager, HomepageManager, EventHub) {
    "use strict";
    /*global asyncTest, equal, expect, module,
     ok, start, stop, test,
     jQuery, sap, sinon */

    // avoid creating the real local LaunchPageAdapter
    function overrideLaunchPageAdapter () {
        var oAdapter = sap.ushell.Container.getService('LaunchPage');
        jQuery.extend(oAdapter, {
            moveTile : function () { return jQuery.Deferred().resolve(); },
            getTileView : function () {
                var oDfd = jQuery.Deferred();
                oDfd.resolve({
                    destroy : function () {},
                    attachPress: function () {}
                });
                return oDfd.promise();
            },
            getTileId : function (oTile) {
                if (oTile) {
                    return oTile.id;
                }
            },
            getTileTarget : function () {
            },
            getTileTitle : function () {
                return "TileDummyTitle";
            },
            setTileVisible: function () {
            },
            isTileIntentSupported : function (oTile) {
                return (oTile.properties.formFactor.indexOf("Desktop") !== -1);
            },
            addTile : function (oCatalogTile, oGroup) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve(oCatalogTile);
                return oDfd.promise();
            },
            isCatalogsValid : function (oCatalog) {
                return true;
            },
            getGroups : function () {
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
            getCatalogs : function () {
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
            getGroupId : function (oGroup) {
                return oGroup.id;
            },
            getDefaultGroup : function () {
                return jQuery.Deferred().resolve([mockData.groups[0]]);
            },
            getGroupTiles : function (oGroup) {
                return oGroup.tiles;
            },
            getGroupTitle : function (oGroup) {
                return oGroup.title;
            },
            setGroupTitle : function (oGroup, sTitle) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            moveGroup : function (oGroup, iIndex) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeGroup : function (oGroup, iIndex) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeTile : function (oGroup, oTile) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            isGroupRemovable : function () {
                return true;
            },
            getTileSize : function () {
                return "1x1";
            },
            getCatalogTileSize : function () {
                return "1x1";
            },
            getTileDebugInfo : function () {
                return "";
            },
            getCatalogError : function () {
                return "";
            },
            getCatalogId : function (oCatalog) {
                return oCatalog.id;
            },
            getCatalogTitle : function (oCatalog) {
                return oCatalog.title;
            },
            getCatalogTiles : function (oCatalog) {
                return jQuery.Deferred().resolve(oCatalog.tiles);
            },
            getCatalogTileTitle : function (oCatalogTile) {
                return oCatalogTile ? oCatalogTile.id : undefined;
            },
            getCatalogTileKeywords : function () {
                return [];
            },
            getCatalogTileId : function (oCatalogTile) {
                return oCatalogTile ? oCatalogTile.id : undefined;
            },
            getCatalogTileView : function () {
                return {destroy: function () {}};
            },
            isLinkPersonalizationSupported: function (oTile) {
                if (oTile) {
                    return oTile.isLinkPersonalizationSupported;
                } else {
                    return false;
                }
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

    var oCatalogsManager = null,
        oHomepageManager = null,
        oEventBus = sap.ui.getCore().getEventBus(),
        mockData,
        oldsap_ui_jsview,
        oUserRecentsStub,
        oUsageAnalyticsLogStub;

    module("sap.ushell.components.CatalogsManager", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                jQuery.sap.flpmeasure = {
                    end: function () {},
                    start: function () {},
                    endFunc: function () {},
                    startFunc : function () {}
                };

                jQuery('<div id="layoutWrapper" style="position: absolute;"></div>').width(1800).appendTo('body');
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
                            isRendered : false,
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
                            pendingLinks : [
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
                            links : [
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
                            isRendered : false,
                            index: 1,
                            object: {
                                id: "group_1",
                                groupId: "group_1",
                                title: "group_1"
                            },
                            tiles: [],
                            pendingLinks : [],
                            links : []
                        },
                        {
                            id: "group_2",
                            groupId: "group_2",
                            title: "group_2",
                            isGroupVisible: true,
                            isRendered : false,
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
                            pendingLinks : [],
                            links : []
                        },
                        {
                            id: "group_hidden",
                            groupId: "group_hidden",
                            title: "group_hidden",
                            isGroupVisible: false,
                            isRendered : false,
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
                            pendingLinks : [],
                            links : []
                        },
                        {
                            id: "group_03",
                            groupId: "group_03",
                            title: "group_03",
                            isGroupVisible: true,
                            isRendered : false,
                            index: 4,
                            object: {
                                id: "group_03",
                                groupId: "group_03",
                                title: "group_03"
                            },
                            tiles: [],
                            pendingLinks : [],
                            links : []
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
                    catalogTiles : [
                        {
                            id : "tile_00",
                            uuid : "tile_00",
                            src : {
                                id : "tile_00",
                                uuid : "tile_00",
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties : {
                                    formFactor : "Desktop,Phone"
                                }
                            },
                            properties : {
                                formFactor : "Desktop,Phone"
                            },
                            associatedGroups : []
                        }, {
                            id : "tile_01",
                            uuid : "tile_01",
                            object: {
                                id: "tile_01",
                                uuid: "tile_01"
                            },
                            src : {
                                id : "tile_01",
                                uuid : "tile_01",
                                properties : {
                                    formFactor : "Tablet,Phone"
                                }
                            },
                            properties : {
                                formFactor : "Tablet,Phone"
                            },
                            associatedGroups : []
                        }, {
                            id : "tile_02",
                            uuid : "tile_02",
                            object: {
                                id: "tile_02",
                                uuid: "tile_02"
                            },
                            src : {
                                id : "tile_02",
                                uuid : "tile_02",
                                properties : {
                                    formFactor : "Desktop"
                                }
                            },
                            properties : {
                                formFactor : "Desktop"
                            },
                            associatedGroups : []
                        },
                        {
                            id: "tile_11",
                            uuid: "tile_11",
                            src : {
                                id : "tile_11",
                                uuid : "tile_11",
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
                            associatedGroups : []
                        },
                        {
                            id: "tile_12",
                            uuid: "tile_12",
                            src : {
                                id : "tile_12",
                                uuid : "tile_12",
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
                            associatedGroups : []
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
            if (oCatalogsManager) {
              oCatalogsManager.destroy();
            }
            if (oHomepageManager) {
                oHomepageManager.destroy();
            }
            oCatalogsManager = null;
            oHomepageManager = null;
            sap.ui.jsview = oldsap_ui_jsview;
            oUserRecentsStub.restore();
            oUsageAnalyticsLogStub.restore();
            delete sap.ushell.Container;
        }
    });
    test("create instance", function () {
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        ok(oCatalogsManager, 'Instance was created');
    });


    test("update association after failure", function () {
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var oUpdateTilesAssociationStub = sinon.stub(oCatalogsManager,"updateTilesAssociation"),
            oNotifyStub = sinon.stub(oCatalogsManager,"notifyOnActionFailure"),
            oClock = sinon.useFakeTimers();

        oCatalogsManager.resetAssociationOnFailure('msg');
        oClock.tick(100);

        ok(oUpdateTilesAssociationStub.calledOnce, 'update association called after error');
        ok(oNotifyStub.calledOnce, 'Error should be notified');

        oUpdateTilesAssociationStub.restore();
        oNotifyStub.restore();
        oClock.restore();
    });

    test("notify on action failure", function () {
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var oMessagingHelper = sap.ui.require("sap/ushell/components/MessagingHelper"),
            oNotifyStub = sinon.stub(oMessagingHelper,"showLocalizedError"),
            oClock = sinon.useFakeTimers();

        oCatalogsManager.notifyOnActionFailure('msg');
        oClock.tick(100);

        ok(oNotifyStub.calledOnce, 'showLocalizedError should be called');

        oNotifyStub.restore();
        oClock.restore();
    });


    test("map tiles in groups", function () {
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager.mapCatalogTilesToGroups();
        var oTileGroups = oCatalogsManager.oTileCatalogToGroupsMap.tile_00;

        ok(oTileGroups.length === 2, "Two groups were mapped for 'tile_00'");

        oTileGroups = oCatalogsManager.oTileCatalogToGroupsMap.tile_01;
        ok(oTileGroups.length === 1, "One groups were mapped for 'tile_01'");
        oTileGroups = oCatalogsManager.oTileCatalogToGroupsMap.tile_11;
        ok(oTileGroups === undefined, "Zero groups were mapped for 'tile_11'");

        //check link
        oTileGroups = oCatalogsManager.oTileCatalogToGroupsMap.tile_000;
        ok(oTileGroups.length === 1, "One groups were mapped for 'tile_000'");

    });

    /*test("map tiles in groups - update model", function () {
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager.mapCatalogTilesToGroups();
        var oTileGroups = oCatalogsManager.oTileCatalogToGroupsMap.tile_00,
            catalogTiles,
            associatedGrps,
            index;

        ok(oTileGroups.length === 2, "Two groups were mapped for 'tile_00'");

        oCatalogsManager.updateCatalogTilesToGroupsMap();
        catalogTiles = oCatalogsManager.getModel().getProperty('/catalogTiles');
        for (index = 0; index < catalogTiles.length; index++) {
            if (catalogTiles[index].id === "tile_00") {
                associatedGrps = catalogTiles[index].associatedGroups;
                ok(associatedGrps.length === 2, "Two groups in associatedGrps of 'tile_00'");
            }
            if (catalogTiles[index].id === "tile_11") {
                associatedGrps = catalogTiles[index].associatedGroups;
                ok(associatedGrps.length === 0, "Zero groups in associatedGrps of 'tile_11'");
            }
        }
    });*/

    /*asyncTest("verify catalog drop down model", function () {
        expect(2);
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel({})});
        oEventBus.publish("renderCatalog", {});

        setTimeout(function () {//since the renderCatalog flow is asynchronous
            var oModel = oCatalogsManager.getModel(),
                aCatalogs = oModel.getProperty('/catalogs');

            equal(aCatalogs.length, 3, "catalog drop down array should contain 3 items");
            equal(aCatalogs[0].title, "All catalogs", "the first item in the catalog drop down should be 'All catalogs'");
            start();
        }, 1500);
    });*/


    asyncTest("deleteCatalogTileFromGroup: test remove tile from group", function () {
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups,
            oData,
            nTiles;

        aGroups = oCatalogsManager.getModel().getProperty('/groups');
        oData = {tileId: "tile_03", groupIndex: 0};
        nTiles = aGroups[0].tiles.length;

        oCatalogsManager.deleteCatalogTileFromGroup(oData);

         setTimeout(function () {
            aGroups = oCatalogsManager.getModel().getProperty('/groups');
            ok(aGroups[0].tiles.length === nTiles - 1, "Tile should be deleted from group");
            start();
        }, 1000);
    });

    asyncTest("deleteCatalogTileFromGroup: test remove link from group", function () {
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups,
            oData,
            nLinks;

        aGroups = oCatalogsManager.getModel().getProperty('/groups');
        oData = {tileId: "tile_000", groupIndex: 0};
        nLinks = aGroups[0].links.length;

        oCatalogsManager.deleteCatalogTileFromGroup(oData);

        setTimeout(function () {
            aGroups = oCatalogsManager.getModel().getProperty('/groups');
            ok(aGroups[0].links.length === nLinks - 1, "Link should be deleted from group");
            start();
        }, 1000);
    });



    asyncTest("verify tiles catalog model", function () {
        var isTileInMock = function (oTile) {
            var oCatalogs = mockData.catalogs,
                i,
                j;
            for (i = 0; i < oCatalogs.length; i++) {
                for (j = 0; j < oCatalogs[i].tiles.length; j++) {
                    if (oCatalogs[i].tiles[j].id == oTile.id) {
                        return true;
                    }
                }
            }
            return false;
        };

        expect(4);
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel({})});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel({})});
        oEventBus.publish("renderCatalog", {});

        setTimeout(function () {//since the showCatalog flow is asynchronous
            var oModel = oCatalogsManager.getModel(),
                aTileCatalogs = oModel.getProperty('/catalogs'),
                i,
                iIndexTiles;

            equal(aTileCatalogs.length, 2, "tile catalogs array should contain 2 items");
            for (i = 0; i < aTileCatalogs.length; i++) {
                for (iIndexTiles = 0; iIndexTiles < aTileCatalogs[i].customTiles.length; iIndexTiles++) {
                    equal(isTileInMock(aTileCatalogs[i].customTiles[iIndexTiles]), true, "tile with id " + aTileCatalogs[i].id + " should appear in the mock data");
                }
            }
            start();
        }, 1500);
    });

    asyncTest("verify catalogs order", function () {
        var isCatalogEqual = function (oCatalog, index) {
            var oCatalogs = mockData.catalogs;
            return oCatalog.title === oCatalogs[index].title;
        };
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel({})});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel({})});
        oEventBus.publish("renderCatalog", {});

        setTimeout(function () {//since the showCatalog flow is asynchronous
            var oModel = oCatalogsManager.getModel(),
                aTileCatalogs = oModel.getProperty('/catalogs'),
                i;

            equal(aTileCatalogs.length, 2, "tile catalogs array should contain 2 items");
            for (i = 0; i < aTileCatalogs.length; i++) {
                equal(isCatalogEqual(aTileCatalogs[i],i), true, "Catalogs are not in the right order");

            }
            start();
        }, 1500);
    });

    test("verify catalog tile tag list", function () {
        var aMockTagPool = ["tag2", "tag4", "tag2", "tag4", "tag1", "tag2", "tag2", "tag3", "tag1", "tag3", "tag2", "tag4"],
            aModelTagList;

        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager.tagsPool = aMockTagPool;

        // Calling the tested function:
        // Reads the tags from initialTagPool, aggregates them and inserts them to tagList property of the model
        oCatalogsManager.getTagList();
        // get tagList from model
        aModelTagList = oCatalogsManager.getModel().getProperty('/tagList');

        equal(aModelTagList.length, 4, "Length of tag list in the model is 4");
        equal(aModelTagList[0].occ, 5, "Tag2 appears 5 times");
        equal(aModelTagList[0].tag, "tag2", "Tag2 has the most occurrences");
        equal(aModelTagList[3].occ, 2, "Tag3 appears 2 times");
        equal(aModelTagList[3].tag, "tag3", "Tag3 has the least occurrences");
    });

    asyncTest("verify isTileIntentSupported property", function () {
        var getIsTileIntentSupportedFromMock = function (sTileId) {
            var oCatalogs = mockData.catalogs,
                aTiles,
                i,
                j;

            for (i = 0; i < oCatalogs.length; i++) {
                aTiles = oCatalogs[i].tiles;
                for (j = 0; j < aTiles.length; j++) {
                    if (aTiles[j].id == sTileId) {
                        return (aTiles[j].properties.formFactor.indexOf("Desktop") !== -1);
                    }
                }
            }
            return false;
        };

        expect(4);
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel({})});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel({})});
        oEventBus.publish("renderCatalog", {});

        setTimeout(function () {//since the showCatalog flow is asynchronous
            var oModel = oCatalogsManager.getModel(),
                aTileCatalogs = oModel.getProperty('/catalogs'),
                i,
                iIndexTiles;

            equal(aTileCatalogs.length, 2, "tile catalogs array should contain 2 items");

            for (i = 0; i < aTileCatalogs.length; i++) {
                for (iIndexTiles = 0; iIndexTiles < aTileCatalogs[i].customTiles.length; iIndexTiles++) {
                    equal(aTileCatalogs[i].customTiles[iIndexTiles].isTileIntentSupported, getIsTileIntentSupportedFromMock(aTileCatalogs[i].customTiles[iIndexTiles].id),
                        "tile " + aTileCatalogs[i].customTiles[iIndexTiles].id + " supposed not to be supported in Desktop");
                }
            }

            start();
        }, 1800);
    });

    asyncTest("create a new group and save tile", function () {
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var oModel = oCatalogsManager.getModel(),
            aGroups = oModel.getProperty('/groups'),
            iOriginalGroupsLength = aGroups.length,
            catalogTileContext = new sap.ui.model.Context(oModel, "/catalogTiles/0"),
            newGroupName = 'group_4',
            catalogTileId,
            newGroupTile;

        oCatalogsManager.createGroupAndSaveTile({
            catalogTileContext : catalogTileContext,
            newGroupName: newGroupName
        });

        setTimeout(function () {
            aGroups = oCatalogsManager.getModel().getProperty('/groups');
            catalogTileId = oCatalogsManager.getModel().getProperty("/catalogTiles/0/id");
            newGroupTile = aGroups[aGroups.length - 1].tiles[0].object.id;

            ok(aGroups.length === iOriginalGroupsLength + 1, "Original groups length increased by 1");
            equal(aGroups[aGroups.length - 1].title, "group_4", "Expected group was added");
            ok(newGroupTile === catalogTileId, "A tile was added to the new group");

            start();
        }, 1000);
    });

    asyncTest("verify new group creation and failure in adding tile", function () {
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var oModel = oCatalogsManager.getModel(),
            aGroups = oModel.getProperty('/groups'),
            iOriginalGroupsLength = aGroups.length,
            catalogTileContext = new sap.ui.model.Context(oModel, "/catalogTiles/0"),
            newGroupName = 'group_4',
            tmpFunction = oCatalogsManager.createTile,
            deferred;

        oCatalogsManager.createTile = function () {
            deferred = jQuery.Deferred();
            deferred.resolve({group: null, status: 0, action: 'add'}); // 0 - failure
            return deferred.promise();
        };

        oCatalogsManager.createGroupAndSaveTile({
            catalogTileContext : catalogTileContext,
            newGroupName: newGroupName
        });

        setTimeout(function () {
            var aGroups = oCatalogsManager.getModel().getProperty('/groups');

            ok(aGroups.length === iOriginalGroupsLength + 1, "Original groups length increased by 1");
            ok(aGroups[aGroups.length - 1].tiles.length === 0, "Tile was not added to the new group");
            start();

            oCatalogsManager.createTile = tmpFunction;
        }, 1000);
    });

    test("verify new group validity", function () {
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oCatalogsManager = new CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var oModel = oCatalogsManager.getModel(),
            aGroups = oModel.getProperty('/groups'),
            iOriginalGroupsLength = aGroups.length,
            catalogTileContext = new sap.ui.model.Context(oModel, "/catalogTiles/0"),
            newGroupName;

        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = '';
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = ' ';
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = undefined;
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = {a: "1", b: "2", c: "3"}; //object
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = new function () {};
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = 1;   //digit
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = true;    // boolean
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        aGroups = oCatalogsManager.getModel().getProperty('/groups');
        ok(aGroups.length === iOriginalGroupsLength, "New group was not added");
    });

});

// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.HomepageManager
 */
sap.ui.require([
    "sap/ushell/components/HomepageManager",
    "sap/ushell/EventHub",
    "sap/ushell/services/Container",
    "sap/ushell/components/homepage/ActionMode",
    "sap/ushell/components/ComponentKeysHandler"
], function (
    HomepageManager,
    EventHub
    // Container
    // ActionMode
    // ComponentKeysHandler
) {
    "use strict";

    /* global asyncTest, equal, module, ok, start, stop, test, sinon, assert */

    // avoid creating the real local LaunchPageAdapter
    function overrideLaunchPageAdapter() {
        var oAdapter = sap.ushell.Container.getService("LaunchPage");
        jQuery.extend(oAdapter, {
            moveTile: function () { return jQuery.Deferred().resolve(); },
            getTileView: function () {
                var oDfd = jQuery.Deferred();
                oDfd.resolve({
                    destroy: function () { },
                    attachPress: function () { }
                });
                return oDfd.promise();
            },
            getTileId: function (oTile) {
                if (oTile) {
                    return oTile.id;
                }
            },
            getTileTarget: function () { },
            getTileTitle: function () {
                return "TileDummyTitle";
            },
            setTileVisible: function () { },
            isTileIntentSupported: function (oTile) {
                return (oTile.properties.formFactor.indexOf("Desktop") !== -1);
            },
            addTile: function (oCatalogTile/*, oGroup*/) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve(oCatalogTile);
                return oDfd.promise();
            },
            isCatalogsValid: function (/*oCatalog*/) {
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

                // Simulate an async function with a loading delay of up to 5 sec
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
            setGroupTitle: function (/*oGroup, sTitle*/) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            moveGroup: function (/*oGroup, iIndex*/) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeGroup: function (/*oGroup, iIndex*/) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeTile: function (/*oGroup, oTile*/) {
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
                return { destroy: function () { } };
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
                setWidth: function () { },
                setDisplayBlock: function () { },
                addEventDelegate: function () { }
            };
        };
    }

    var oHomepageManager = null,
        oEventBus = sap.ui.getCore().getEventBus(),
        mockData,
        oldsap_ui_jsview,
        oUserRecentsStub,
        oUsageAnalyticsLogStub,
        i;

    function usageAnalyticsCheck(eventName, expectedFunctionCallCount, expectedEventType, expectedEventValue, expectedAdditionalProp) {
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
                    end: function () { },
                    start: function () { },
                    endFunc: function () { },
                    startFunc: function () { }
                };

                jQuery("<div id=\"layoutWrapper\" style=\"position: absolute;\"></div>").width(1800).appendTo("body");
                oUserRecentsStub = sinon.stub(sap.ushell.Container.getService("UserRecents"), "addAppUsage");
                oUsageAnalyticsLogStub = sinon.stub(sap.ushell.Container.getService("UsageAnalytics"), "logCustomEvent");
                oldsap_ui_jsview = sap.ui.jsview;
                overrideLaunchPageAdapter();
                mockData = {
                    groups: [{
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
                                    properties: { formFactor: "Desktop,Phone" },
                                    content: []
                                }, {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: { formFactor: "Tablet,Phone" },
                                    content: []
                                }, {
                                    id: "tile_02",
                                    uuid: "tile_02",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_02",
                                        uuid: "tile_02"
                                    },
                                    properties: { formFactor: "Desktop" },
                                    content: []
                                }, {
                                    id: "tile_03",
                                    uuid: "tile_03",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_03",
                                        uuid: "tile_03"
                                    },
                                    properties: { formFactor: "Phone" },
                                    content: []
                                }, {
                                    id: "tile_04",
                                    uuid: "tile_04",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_04",
                                        uuid: "tile_04"
                                    },
                                    properties: { formFactor: "Desktop,Tablet" },
                                    content: []
                                }, {
                                    id: "tile_05",
                                    uuid: "tile_05",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_05",
                                        uuid: "tile_05"
                                    },
                                    properties: { formFactor: "Tablet" },
                                    content: []
                                }, {
                                    id: "tile_000",
                                    uuid: "tile_000",
                                    isTileIntentSupported: true,
                                    isLink: true,
                                    object: {
                                        id: "tile_000",
                                        uuid: "tile_000"
                                    },
                                    properties: { formFactor: "Desktop,Phone" },
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
                                properties: { formFactor: "Desktop,Phone" },
                                content: []
                            }, {
                                id: "tile_01",
                                uuid: "tile_01",
                                isTileIntentSupported: false,
                                object: {
                                    id: "tile_01",
                                    uuid: "tile_01"
                                },
                                properties: { formFactor: "Tablet,Phone" },
                                content: []
                            }, {
                                id: "tile_02",
                                uuid: "tile_02",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_02",
                                    uuid: "tile_02"
                                },
                                properties: { formFactor: "Desktop" },
                                content: []
                            }, {
                                id: "tile_03",
                                uuid: "tile_03",
                                isTileIntentSupported: false,
                                object: {
                                    id: "tile_03",
                                    uuid: "tile_03"
                                },
                                properties: { formFactor: "Phone" },
                                content: []
                            }, {
                                id: "tile_04",
                                uuid: "tile_04",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_04",
                                    uuid: "tile_04"
                                },
                                properties: { formFactor: "Desktop,Tablet" },
                                content: []
                            }, {
                                id: "tile_05",
                                uuid: "tile_05",
                                isTileIntentSupported: false,
                                object: {
                                    id: "tile_05",
                                    uuid: "tile_05"
                                },
                                properties: { formFactor: "Tablet" },
                                content: []
                            }, {
                                id: "tile_000",
                                uuid: "tile_000",
                                isTileIntentSupported: true,
                                isLink: true,
                                object: {
                                    id: "tile_000",
                                    uuid: "tile_000"
                                },
                                properties: { formFactor: "Desktop,Phone" },
                                content: []
                            }
                        ],
                        pendingLinks: [{
                            id: "tile_001",
                            uuid: "tile_001",
                            size: "1x1",
                            isLink: true,
                            object: {
                                id: "tile_000",
                                uuid: "tile_000"
                            },
                            properties: { formFactor: "Desktop,Phone" },
                            content: []
                        }],
                        links: [{
                            id: "tile_001",
                            uuid: "tile_001",
                            size: "1x1",
                            isLink: true,
                            object: {
                                id: "tile_000",
                                uuid: "tile_000"
                            },
                            properties: { formFactor: "Desktop,Phone" },
                            content: []
                        }]
                    }, {
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
                    }, {
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
                            tiles: [{
                                id: "tile_00",
                                uuid: "tile_00",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties: { formFactor: "Desktop,Phone" },
                                content: []
                            }]
                        },
                        tiles: [{
                            id: "tile_00",
                            uuid: "tile_00",
                            isTileIntentSupported: true,
                            object: {
                                id: "tile_00",
                                uuid: "tile_00"
                            },
                            properties: { formFactor: "Desktop,Phone" },
                            content: []
                        }],
                        pendingLinks: [],
                        links: []
                    }, {
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
                                properties: { formFactor: "Desktop,Phone" },
                                content: []
                            }, {
                                id: "tile_01",
                                uuid: "tile_01",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_01",
                                    uuid: "tile_01"
                                },
                                properties: { formFactor: "Desktop,Tablet,Phone" },
                                content: []
                            }
                        ],
                        pendingLinks: [],
                        links: []
                    }, {
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
                    }],
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
                                    properties: { formFactor: "Desktop,Phone" },
                                    content: []
                                }, {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: { formFactor: "Tablet,Phone" },
                                    content: []
                                }, {
                                    id: "tile_02",
                                    uuid: "tile_02",
                                    object: {
                                        id: "tile_02",
                                        uuid: "tile_02"
                                    },
                                    properties: { formFactor: "Desktop" },
                                    content: []
                                }
                            ]
                        }, {
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
                                    properties: { formFactor: "Desktop,Tablet" },
                                    content: []
                                }, {
                                    id: "tile_12",
                                    uuid: "tile_12",
                                    properties: { formFactor: "Tablet" },
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
                                properties: { formFactor: "Desktop,Phone" }
                            },
                            properties: { formFactor: "Desktop,Phone" },
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
                                properties: { formFactor: "Tablet,Phone" }
                            },
                            properties: { formFactor: "Tablet,Phone" },
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
                                properties: { formFactor: "Desktop" }
                            },
                            properties: { formFactor: "Desktop" },
                            associatedGroups: []
                        }, {
                            id: "tile_11",
                            uuid: "tile_11",
                            src: {
                                id: "tile_11",
                                uuid: "tile_11",
                                object: {
                                    id: "tile_11",
                                    uuid: "tile_11"
                                },
                                properties: { formFactor: "Desktop,Tablet" }
                            },
                            properties: { formFactor: "Desktop,Tablet" },
                            associatedGroups: []
                        }, {
                            id: "tile_12",
                            uuid: "tile_12",
                            src: {
                                id: "tile_12",
                                uuid: "tile_12",
                                object: {
                                    id: "tile_12",
                                    uuid: "tile_12"
                                },
                                properties: { formFactor: "Tablet" }
                            },
                            properties: { formFactor: "Tablet" },
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

    test("create instance", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        ok(oHomepageManager, "Instance was created");
    });

    test("Test _addDraggableAttribute", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var done = assert.async(),
            isIeHtml5DnDStub = sinon.stub(oHomepageManager, "isIeHtml5DnD").returns(true),
            oLink = new sap.m.GenericTile({
                mode: sap.m.GenericTileMode.LineMode,
                subheader: "subtitle 1",
                header: "header 1"
            });
        oHomepageManager._addDraggableAttribute(oLink);
        oLink.placeAt(jQuery("#layoutWrapper"));

        setTimeout(function () {
            ok(oLink.$().attr("draggable"), "link should have draggable attribute");
            oLink.destroy();
            isIeHtml5DnDStub.restore();
            done();
        }, 0);
    });

    test("Test _getGroupIndex", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        ok(!oHomepageManager._getGroupIndex("bbb"), "if not found we will return undefined");
        equal(oHomepageManager._getGroupIndex("group_2"), 2);
    });

    test("Test _getIndexForConvert", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var result = oHomepageManager._getIndexForConvert("links", 0, 2, { tiles: [1, 2, 3] });
        equal(result.tileIndex, 3);
        equal(result.newTileIndex, 2);

        result = oHomepageManager._getIndexForConvert("tiles", 0, 2, { tiles: [1, 2, 3], groupId: "id1" }, { tiles: [1, 2, 3], groupId: "id1" });
        equal(result.tileIndex, 0);
        equal(result.newTileIndex, 4);

        result = oHomepageManager._getIndexForConvert("tiles", 0, 2, { tiles: [1, 2, 3], groupId: "id1" }, { tiles: [1, 2, 3], groupId: "id2" });
        equal(result.tileIndex, 0);
        equal(result.newTileIndex, 5);
    });

    test("test _changeLinkScope", function () {
        var setScopeCallCount = 0,
            setScopeParam,
            oLink = {
                getScope: function () {
                    return "Actions";
                },
                setScope: function (scope) {
                    setScopeCallCount++;
                    setScopeParam = scope;
                }
            };

        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        oHomepageManager.bLinkPersonalizationSupported = true;
        oHomepageManager._changeLinkScope(oLink, "Actions");
        ok(setScopeCallCount === 1, "setScope was called once");
        ok(setScopeParam === "Actions", "setScope was called with scope === Actions");
    });

    test("test _changeGroupLinksScope", function () {
        var setScopeCallCount = 0,
            oLink = {
                content: [{
                    getScope: function () {
                        return "Actions";
                    },
                    setScope: function (/*scope*/) {
                        setScopeCallCount++;
                    }
                }]
            },
            oGroup = { links: [oLink, oLink, oLink, oLink] };

        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        oHomepageManager.bLinkPersonalizationSupported = true;
        oHomepageManager._changeGroupLinksScope(oGroup, "Actions");
        ok(setScopeCallCount === 4, "setScope was called once");
    });

    test(" test _changeLinksScope", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var oEvent = {
            getSource: function () {
                return {
                    getValue: function () {
                        return true;
                    }
                };
            }
        },
            stubChangeLinkScope = sinon.stub(oHomepageManager, "_changeLinkScope");

        oHomepageManager.bLinkPersonalizationSupported = true;
        oHomepageManager._changeLinksScope(oEvent);
        ok(stubChangeLinkScope.callCount === 1, "all links scope was set to Actions");

        stubChangeLinkScope.restore();
    });

    test(" test _attachLinkPressHandlers - open action menu", function () {
        var oGenericTile = new sap.m.GenericTile({
            header: "header",
            subheader: "subheader",
            size: "Auto",
            scope: sap.m.GenericTileScope.Actions,
            tileContent: new sap.m.TileContent({
                size: "Auto",
                footer: "footer"
            })
        }),
            origActionsMode = sap.ushell.components.homepage.ActionMode,
            openActionsMenuCounter = 0;

        oGenericTile.getBindingContext = function () {
            return {
                getObject: function () {
                    return {
                        tileIsBeingMoved: false
                    };
                }
            };
        };

        sap.ushell.components.homepage.ActionMode = {
            _openActionsMenu: function () {
                openActionsMenuCounter++;
            }
        };

        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        oHomepageManager._attachLinkPressHandlers(oGenericTile);

        oGenericTile.firePress({ action: "Press" });

        ok(openActionsMenuCounter === 1, "action menu was opened");

        sap.ushell.components.homepage.ActionMode = origActionsMode;
    });

    test(" test _attachLinkPressHandlers - delete link", function () {
        var oGenericTile = new sap.m.GenericTile({
            header: "header",
            subheader: "subheader",
            size: "Auto",
            scope: sap.m.GenericTileScope.Actions,
            tileContent: new sap.m.TileContent({
                size: "Auto",
                footer: "footer"
            })
        }),
            oDeleteTileParams,
            publishEventStub = sinon.stub(sap.ui.getCore().getEventBus(), "publish", function () {
                if (arguments[1] === "deleteTile") {
                    oDeleteTileParams = arguments;
                }
            });

        oGenericTile.getBindingContext = function () {
            return {
                getObject: function () {
                    return {
                        tileIsBeingMoved: false,
                        uuid: "1"
                    };
                }
            };
        };

        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        oHomepageManager._attachLinkPressHandlers(oGenericTile);

        oGenericTile.firePress({ action: "Remove" });

        ok(oDeleteTileParams[1] === "deleteTile", "action menu was opened");

        publishEventStub.restore();
    });

    test("test instance is created with bLinkPersonalizationSupported parameter", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        ok(oHomepageManager.bLinkPersonalizationSupported !== undefined, "Instance was created");
    });

    test("test createMoveActionDialog function", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var moveActionDialog = oHomepageManager.createMoveActionDialog("moveDialog");
        ok(moveActionDialog && moveActionDialog.getId() === "moveDialog", "dialog has been created with correct id");
    });

    test("test publishMoveActionEvents function", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var oMoveTileEventParams,
            oScrollToGroupParams,
            publishEventStub = sinon.stub(sap.ui.getCore().getEventBus(), "publish", function () {
                if (arguments[1] === "movetile") {
                    oMoveTileEventParams = arguments;
                } else if (arguments[1] === "scrollToGroup") {
                    oScrollToGroupParams = arguments;
                }
            }),
            aContexts = [],
            oMockContext = {
                tileUuid: "0",
                tileType: "tile"
            };
        aContexts[0] = {
            getObject: function () {
                return {
                    groupId: "0",
                    tiles: [],
                    pendingLinks: []
                };
            }
        };

        oHomepageManager.publishMoveActionEvents.call(oMockContext, aContexts, "0");
        //check that the event is fired with the right properties
        ok(oMoveTileEventParams[2].hasOwnProperty("toIndex"), "event object has property toIndex");
        ok(oMoveTileEventParams[2].hasOwnProperty("toGroupId"), "event object has property toGroupId");
        ok(oMoveTileEventParams[2].hasOwnProperty("source"), "event object has property source");
        ok(oMoveTileEventParams[2].hasOwnProperty("sTileType"), "event object has property sTileType");
        ok(oMoveTileEventParams[2].hasOwnProperty("sTileId"), "event object has property sTileId");

        ok(oScrollToGroupParams[2].hasOwnProperty("groupId"), "event object has property groupId");
        publishEventStub.restore();
    });

    test("test _addFLPActionsToTile - check case: Link Personalization is supported on the platform", function () {
        var oTile = {
            id: "tile_001",
            title: "I am a long long long long long long long long long long long long link! 00",
            size: "1x1",
            tileType: "sap.ushell.ui.tile.StaticTile",
            isLinkPersonalizationSupported: true,
            isLink: true,
            properties: {
                title: "I am a long long long long long long long long long long long long link! 00",
                subtitle: "subtitle 00",
                icon: "sap-icon://syringe",
                href: "#Action-todefaultapp"
            }
        },
            aActions;
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        oHomepageManager.bLinkPersonalizationSupported = true;
        aActions = oHomepageManager._addFLPActionsToTile(oTile);
        ok(aActions.length === 2, "Link Personalization is Supported on platform and on tile, therefor there's 2 actions on the link");
    });

    test("test _addFLPActionsToTile - check case: platform Link Personalization not supported on the platform", function () {
        var oTile = {
            id: "tile_001",
            title: "I am a long long long long long long long long long long long long link! 00",
            size: "1x1",
            tileType: "sap.ushell.ui.tile.StaticTile",
            isLinkPersonalizationSupported: true,
            isLink: true,
            properties: {
                title: "I am a long long long long long long long long long long long long link! 00",
                subtitle: "subtitle 00",
                icon: "sap-icon://syringe",
                href: "#Action-todefaultapp"
            }
        },
            aActions;
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        oHomepageManager.bLinkPersonalizationSupported = false;
        aActions = oHomepageManager._addFLPActionsToTile(oTile);
        ok(aActions.length === 1, "Link Personalization not supported on platform, therefor there's 1 action on the link");
    });

    test("test _addFLPActionsToTile - check case: Link Personalization is supported on the platform, but the lnk does not support it", function () {
        var oTile = {
            id: "tile_001",
            title: "I am a long long long long long long long long long long long long link! 00",
            size: "1x1",
            tileType: "sap.ushell.ui.tile.StaticTile",
            isLinkPersonalizationSupported: false,
            isLink: true,
            properties: {
                title: "I am a long long long long long long long long long long long long link! 00",
                subtitle: "subtitle 00",
                icon: "sap-icon://syringe",
                href: "#Action-todefaultapp"
            }
        },
            aActions;
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        oHomepageManager.bLinkPersonalizationSupported = true;
        aActions = oHomepageManager._addFLPActionsToTile(oTile);
        ok(aActions.length === 1, "the link does not support Personalization, therefor there's 1 action on the link");
    });

    test("test _getConvertTileAction", function () {
        var oTile = {
            id: "tile_001",
            title: "I am a long long long long long long long long long long long long link! 00",
            size: "1x1",
            tileType: "sap.ushell.ui.tile.StaticTile",
            isLinkPersonalizationSupported: false,
            isLink: true,
            properties: {
                title: "I am a long long long long long long long long long long long long link! 00",
                subtitle: "subtitle 00",
                icon: "sap-icon://syringe",
                href: "#Action-todefaultapp"
            }
        },
            oAction,
            bConvertTileEventPublished = false,
            publishEventStub = sinon.stub(sap.ui.getCore().getEventBus(), "publish", function () {
                if (arguments[1] === "convertTile") {
                    bConvertTileEventPublished = true;
                }
            });
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        oAction = oHomepageManager._getConvertTileAction(oTile);
        oAction.press({
            getParent: function () {
                return {
                    getBindingContext: function () {
                        return {
                            getObject: function () {
                                return {
                                    groupId: "0"
                                };
                            }
                        };
                    }
                };
            }
        });
        ok(bConvertTileEventPublished, "convert tile event is published");
        publishEventStub.restore();
    });

    test("test _getMoveTileAction", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var oTile = {
            id: "tile_001",
            title: "I am a long long long long long long long long long long long long link! 00",
            size: "1x1",
            tileType: "sap.ushell.ui.tile.StaticTile",
            isLinkPersonalizationSupported: false,
            isLink: true,
            properties: {
                title: "I am a long long long long long long long long long long long long link! 00",
                subtitle: "subtitle 00",
                icon: "sap-icon://syringe",
                href: "#Action-todefaultapp"
            }
        },
            oAction,
            bOpen = false,
            bSetModel = false,
            oCreateMoveActionDialogStub = sinon.stub(oHomepageManager, "createMoveActionDialog").returns({
                open: function () {
                    bOpen = true;
                },
                setModel: function () {
                    bSetModel = true;
                },
                getBinding: function () {
                    return {
                        filter: function () {
                            return true;
                        }
                    };
                }
            });

        oAction = oHomepageManager._getMoveTileAction(oTile);
        oAction.press();

        ok(oCreateMoveActionDialogStub.called, "moveDialog was was created");
        ok(bOpen, "open function of moveDialog was called");
        ok(bSetModel, "setModel function of moveDialog was called");

        //call press the action in the second time (when moveDialog is already created)
        bSetModel = false;
        bOpen = false;
        oCreateMoveActionDialogStub.reset();
        oAction.press();
        ok(!oCreateMoveActionDialogStub.called, "moveDialog was was created");
        ok(!bSetModel, "setModel function of moveDialog was called");
        ok(bOpen, "open function of moveDialog was called");
        oCreateMoveActionDialogStub.restore();
    });

    test("test _handleTileAppearanceAnimation", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var oGenericTile = new sap.m.GenericTile({
            header: "header",
            subheader: "subheader",
            size: "Auto",
            tileContent: new sap.m.TileContent({
                size: "Auto",
                footer: "footer"
            })
        });

        oHomepageManager._handleTileAppearanceAnimation(oGenericTile);
        ok(oGenericTile.hasStyleClass("sapUshellTileEntrance"), "tile view has class sapUshellTileEntrance");
    });

    test("Split groups data to segments", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        oHomepageManager.PagingManager = {};
        oHomepageManager.PagingManager.getGroupHeight = sinon.stub().returns(0.1);
        oHomepageManager.segmentsStore.push = sinon.spy();
        oHomepageManager._splitGroups(mockData.groups);

        ok(oHomepageManager.segmentsStore.push.calledOnce, "oHomepageManager.push was not called once");
    });

    test("Check binding segment of mock data", function () {
        var groupsSkeleton,
            mergedGroups,
            groupindex,
            tilesIndex,
            oMergedGrp,
            oMockGrp,
            oMergedGrpTile,
            oMockGrpTile,
            oSeg;

        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        oHomepageManager.PagingManager = {
            getGroupHeight: function () {
                return 0.1;
            }
        };
        groupsSkeleton = oHomepageManager.createGroupsModelFrame(mockData.groups, true);

        oHomepageManager._splitGroups(mockData.groups);
        mergedGroups = groupsSkeleton;

        while (oHomepageManager.segmentsStore.length > 0) {
            oSeg = oHomepageManager.segmentsStore.shift();
            mergedGroups = oHomepageManager._bindSegment(mergedGroups, oSeg);
        }

        ok(mergedGroups.length === mockData.groups.length, "validate same number of groups in the model");

        //validate that the mockData and the mergedGroups contains all the tile / links.
        for (groupindex = 0; groupindex < mergedGroups.length; groupindex++) {
            oMergedGrp = mergedGroups[groupindex];
            oMockGrp = mockData.groups[groupindex];

            ok(oMergedGrp.tiles.length === oMockGrp.tiles.length, "validate group model [" + groupindex + "] has same number of tiles");

            for (tilesIndex = 0; tilesIndex < oMergedGrp.tiles.length; tilesIndex++) {
                oMockGrpTile = oMockGrp.tiles[tilesIndex];
                oMergedGrpTile = oMergedGrp.tiles[tilesIndex];

                ok(oMockGrpTile.id === oMergedGrpTile.id, "validate tile [" + tilesIndex + "] has same id");
            }
        }
    });

    test("move tile to empty group", function (assert) {
        var done = assert.async();

        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length,
            bUpdateGroupEventFired = false,
            oEventHubEmitStub = sinon.stub(EventHub, "emit", function (sEventName) {
                if (sEventName === "updateGroups") {
                    bUpdateGroupEventFired = true;
                }
            });
        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_1",
            toIndex: 2
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength - 1, "Original group length decreased by 1");
        ok(bUpdateGroupEventFired, "updateGroups event should be emitted");
        equal(aGroups[1].tiles[0].id, "tile_02", "Expected tile was moved to the second group");
        window.setTimeout(function () {
            usageAnalyticsCheck(
                "Move Tile",
                1,
                oHomepageManager.analyticsConstants.PERSONALIZATION,
                oHomepageManager.analyticsConstants.MOVE_TILE,
                [undefined, "group_0", "group_1", "tile_02"]
            );
            oEventHubEmitStub.restore();
            done();
        }, 0);
    });

    test("move tile to another group with null index", function (assert) {
        var done = assert.async();
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length,
            bUpdateGroupEventFired = false,
            oEventHubEmitStub = sinon.stub(EventHub, "emit", function (sEventName) {
                if (sEventName === "updateGroups") {
                    bUpdateGroupEventFired = true;
                }
            });

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_1",
            toIndex: null
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength - 1, "Original group length decreased by 1");
        equal(aGroups[1].tiles[aGroups[1].tiles.length - 1].id, "tile_02", "Tile which moved with null index should be added to the last position in the tiles array");
        window.setTimeout(function () {
            usageAnalyticsCheck(
                "Move Tile",
                1,
                oHomepageManager.analyticsConstants.PERSONALIZATION,
                oHomepageManager.analyticsConstants.MOVE_TILE,
                ["TileDummyTitle", "group_0", "group_1", "tile_02"]
            );
            ok(bUpdateGroupEventFired, "updateGroups event should be emitted");
            oEventHubEmitStub.restore();
            done();
        }, 0);
    });

    test("_checkRequestQueue check enqueue and dequque functionslity works", function (assert) {
        var done = assert.async();
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[2].tiles.length,
            iOriginalTileIndexInGroup = 1,
            bUpdateGroupEventFired = false,
            oEventHubEmitStub = sinon.stub(EventHub, "emit", function (sEventName) {
                if (sEventName === "updateGroups") {
                    bUpdateGroupEventFired = true;
                }
            });

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_0",
            toIndex: null
        });

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_1",
            toIndex: null
        });

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_2",
            toIndex: null
        });
        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            ok(aGroups[2].tiles.length === iOriginalGroupTilesLength + 1, "validate group 2 has an additional tile");
            equal(aGroups[2].tiles[iOriginalTileIndexInGroup].id, "tile_02", "Tile which moved with null index should stay in the same position as before");
            ok(bUpdateGroupEventFired, "updateGroups event should be emitted");
            oEventHubEmitStub.restore();
            done();
        }, 0);
    });

    test("move tile to the same group with null index", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length,
            iOriginalTileIndexInGroup = 2;

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_0",
            toIndex: null
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length stayed the same");
        equal(aGroups[0].tiles[iOriginalTileIndexInGroup].id, "tile_02", "Tile which moved with null index should stay in the same position as before");
        ok(oUsageAnalyticsLogStub.calledOnce === false, "logCustomEvent should not be called since tile did not  move ");
    });

    test("move tile to empty group and back", function (assert) {
        var done = assert.async();
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length,
            bUpdateGroupEventFired = false,
            oEventHubEmitStub = sinon.stub(EventHub, "emit", function (sEventName) {
                if (sEventName === "updateGroups") {
                    bUpdateGroupEventFired = true;
                }
            });

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_04",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_1",
            toIndex: 0
        });
        aGroups = oHomepageManager.getModel().getProperty("/groups");
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength - 1, "Original group length decreased by 1");
        equal(aGroups[1].tiles[0].id, "tile_04", "Expected tile was moved to the second group");

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_04",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_0",
            toIndex: 0
        });

        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length increased by 1");
        equal(aGroups[0].tiles[0].id, "tile_04", "Expected tile was moved back to the first group");
        window.setTimeout(function () {
            ok(oUsageAnalyticsLogStub.calledTwice === true, "logCustomEvent should called once after move tile");
            ok(bUpdateGroupEventFired, "updateGroups event should be emitted");
            oEventHubEmitStub.restore();
            done();
        }, 0);
    });

    test("move tile left in the same group with hidden tiles", function (assert) {
        var done = assert.async();
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_04",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_0",
            toIndex: 1
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length stayed the same");
        equal(aGroups[0].tiles[1].id, "tile_04", "Expected tile was moved to index 1 in the model (before the hidden tile)");
        window.setTimeout(function () {
            ok(oUsageAnalyticsLogStub.calledOnce === true, "logCustomEvent should called once after move tile");
            done();
        }, 0);
    });

    test("move tile right in the same group with hidden tiles", function (assert) {
        var done = assert.async();
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupTilesLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "movetile", {
            sTileId: "tile_02",
            sToItems: "tiles",
            sFromItems: "tiles",
            sTileType: "tiles",
            toGroupId: "group_0",
            toIndex: 2
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length stayed the same");
        equal(aGroups[0].tiles[4].id, "tile_02", "Expected tile was moved to index 4 in the model");
        window.setTimeout(function () {
            ok(oUsageAnalyticsLogStub.calledOnce === true, "logCustomEvent should called once after move tile");
            done();
        });
    });

    test("verify new group validity", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var oModel = oHomepageManager.getModel(),
            aGroups = oModel.getProperty("/groups"),
            iOriginalGroupsLength = aGroups.length,
            catalogTileContext = new sap.ui.model.Context(oModel, "/catalogTiles/0"),
            newGroupName;

        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = "";
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = " ";
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = undefined;
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = { a: "1", b: "2", c: "3" }; //object
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = function () { };
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = 1; //digit
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        newGroupName = true; // boolean
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
            catalogTileContext: catalogTileContext,
            newGroupName: newGroupName
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        ok(aGroups.length === iOriginalGroupsLength, "New group was not added");
    });

    test("verify change group title", function (assert) {
        var done = assert.async();
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            sOriginalGroupTitle = aGroups[0].title,
            sNewGroupTitle;

        oEventBus.publish("launchpad", "changeGroupTitle", {
            newTitle: "new_group_title",
            groupId: "group_0"
        });

        window.setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            sNewGroupTitle = aGroups[0].title;
            ok(sNewGroupTitle !== sOriginalGroupTitle, "Group title changed");
            equal(sNewGroupTitle, "new_group_title", "Expected title was set");
            ok(oUsageAnalyticsLogStub.calledOnce === true, "logCustomEvent should called once after change group name");
            usageAnalyticsCheck(
                "FLP: Rename Group",
                1,
                oHomepageManager.analyticsConstants.PERSONALIZATION,
                oHomepageManager.analyticsConstants.RENAME_GROUP,
                ["group_0", "new_group_title", "group_0"]
            );
            done();
        }, 0);
    });

    test("verify move group", function (assert) {
        var done = assert.async();
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            sGroup0Id = aGroups[0].id,
            sGroup1Id = aGroups[1].id,
            sGroup2Id = aGroups[2].id;

        oEventBus.publish("launchpad", "moveGroup", {
            fromIndex: 2,
            toIndex: 0
        });

        aGroups = oHomepageManager.getModel().getProperty("/groups");
        equal(aGroups[0].id, sGroup2Id, "Group 2 moved to index 0");
        equal(aGroups[1].id, sGroup0Id, "Group 0 moved to index 1");
        equal(aGroups[2].id, sGroup1Id, "Group 1 moved to index 2");
        window.setTimeout(function () {
            usageAnalyticsCheck(
                "Move Group",
                1,
                oHomepageManager.analyticsConstants.PERSONALIZATION,
                oHomepageManager.analyticsConstants.MOVE_GROUP,
                ["group_2", 2, 0, "group_2"]
            );
            done();
        }, 0);
    });

    test("verify move group with Hidden groups", function (assert) {
        var done = assert.async();
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            sGroup0Id = aGroups[0].id,
            sGroup1Id = aGroups[1].id,
            sGroup2Id = aGroups[2].id,
            sGroup3Id = aGroups[3].id, //hidden
            sGroup4Id = aGroups[4].id;

        oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
            fromIndex: 1,
            toIndex: 3
        });

        window.setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            equal(aGroups[4].id, sGroup1Id, "Group in index 1 moved to index 4 in the model");
            equal(aGroups[1].id, sGroup2Id, "Group in index 2 moved to index 1 in the model");
            equal(aGroups[2].id, sGroup3Id, "Group in index 3 moved to index 2 in the model");
            equal(aGroups[3].id, sGroup4Id, "Group in index 4 moved to index 3 in the model");
            usageAnalyticsCheck(
                "Move Group",
                1,
                oHomepageManager.analyticsConstants.PERSONALIZATION,
                oHomepageManager.analyticsConstants.MOVE_GROUP,
                ["group_1", 1, 4, "group_1"]
            );
            //sGroup0Id
            //sGroup2Id
            //sGroup3Id - hidden
            //sGroup4Id
            //sGroup1Id

            oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
                fromIndex: 0,
                toIndex: 1
            });

            window.setTimeout(function () {
                equal(aGroups[0].id, sGroup2Id, "Group in index 0 is 2");
                equal(aGroups[1].id, sGroup0Id, "Group in index 1 is 0");
                equal(aGroups[2].id, sGroup3Id, "Group in index 2 is 3");
                equal(aGroups[4].id, sGroup1Id, "Group in index 3 is 1");
                usageAnalyticsCheck(
                    "Move Group",
                    2,
                    oHomepageManager.analyticsConstants.PERSONALIZATION,
                    oHomepageManager.analyticsConstants.MOVE_GROUP,
                    ["group_1", 1, 4, "group_1"]
                );
                //sGroup2Id
                //sGroup0Id
                //sGroup3Id - hidden
                //sGroup4Id
                //sGroup1Id
                oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
                    fromIndex: 3,
                    toIndex: 1
                });

                window.setTimeout(function () {
                    equal(aGroups[0].id, sGroup2Id, "Group in index 0 is 2");
                    equal(aGroups[1].id, sGroup1Id, "Group in index 1 is 1");
                    equal(aGroups[2].id, sGroup0Id, "Group in index 2 is 0");
                    equal(aGroups[3].id, sGroup3Id, "Group in index 3 is 3");
                    usageAnalyticsCheck(
                        "Move Group",
                        3,
                        oHomepageManager.analyticsConstants.PERSONALIZATION,
                        oHomepageManager.analyticsConstants.MOVE_GROUP,
                        ["group_1", 1, 4, "group_1"]
                    );
                    //sGroup2Id
                    //sGroup1Id
                    //sGroup0Id
                    //sGroup3Id - hidden
                    //sGroup4Id
                    var model = oHomepageManager.getModel(),
                        groups = model.getProperty("/groups");
                    groups.push({
                        id: "group_007",
                        groupId: "group_007",
                        title: "group_007",
                        isGroupVisible: true,
                        object: {
                            id: "group_007",
                            groupId: "group_007"
                        },
                        tiles: []
                    });
                    model.setProperty("/groups", groups);
                    //sGroup2Id
                    //sGroup1Id
                    //sGroup0Id
                    //sGroup3Id - hidden
                    //sGroup4Id
                    //group_007

                    oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
                        fromIndex: 4,
                        toIndex: 3
                    });
                    window.setTimeout(function () {
                        equal(aGroups[2].id, sGroup0Id, "Group in index 2 is 0");
                        equal(aGroups[3].id, "group_007", "Group in index 3 is 007");
                        equal(aGroups[4].id, sGroup3Id, "Group in index 4 is 3");
                        equal(aGroups[5].id, sGroup4Id, "Group in index 5 is 4");
                        usageAnalyticsCheck(
                            "Move Group",
                            4,
                            oHomepageManager.analyticsConstants.PERSONALIZATION,
                            oHomepageManager.analyticsConstants.MOVE_GROUP,
                            ["group_1", 1, 4, "group_1"]
                        );

                        //sGroup2Id
                        //sGroup1Id
                        //sGroup0Id
                        //group_007
                        //sGroup3Id - hidden
                        //sGroup4Id

                        //Replace without hidden groups "impact"
                        oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
                            fromIndex: 0,
                            toIndex: 2
                        });
                        window.setTimeout(function () {
                            equal(aGroups[0].id, sGroup1Id, "Group in index 0 is 1");
                            equal(aGroups[1].id, sGroup0Id, "Group in index 1 is 0");
                            equal(aGroups[2].id, sGroup2Id, "Group in index 2 is 2");
                            ok(oUsageAnalyticsLogStub.callCount === 5, "logCustomEvent should called once after move group");
                            //sGroup1Id
                            //sGroup0Id
                            //sGroup2Id
                            //group_007
                            //sGroup3Id - hidden
                            //sGroup4Id
                            oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
                                fromIndex: 3,
                                toIndex: 1
                            });
                            equal(aGroups[0].id, sGroup1Id, "Group in index 0 is 1");
                            equal(aGroups[1].id, "group_007", "Group in index 1 is 007");
                            equal(aGroups[2].id, sGroup0Id, "Group in index 2 is 0");
                            equal(aGroups[3].id, sGroup2Id, "Group in index 3 is 2");
                            //sGroup1Id
                            //group_007
                            //sGroup0Id
                            //sGroup2Id
                            //sGroup3Id - hidden
                            //sGroup4Id
                            done();
                        }, 0);
                    }, 0);
                }, 0);
            }, 0);
        }, 0);
    });

    asyncTest("verify delete group", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupsLength = aGroups.length;

        oEventBus.publish("launchpad", "deleteGroup", {
            groupId: "group_0"
        });

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            equal(aGroups.length, iOriginalGroupsLength - 1, "Groups length decreased by 1");
            usageAnalyticsCheck(
                "Delete Group",
                1,
                oHomepageManager.analyticsConstants.PERSONALIZATION,
                oHomepageManager.analyticsConstants.DELETE_GROUP,
                ["group_0", "group_0"]
            );
            start();
        }, 0);
    });

    test("isBlindLoading true _processSegment", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            fHandleTilesVisibility = sinon.stub(sap.ushell.utils, "handleTilesVisibility");
        oHomepageManager.segmentsStore = [aGroups];
        oHomepageManager.getSegmentContentViews = sinon.spy();
        oHomepageManager._bindSegment = sinon.spy();
        oHomepageManager.isBlindLoading = function () {
            return true;
        };
        oHomepageManager._processSegment(aGroups);
        ok(oHomepageManager._bindSegment.callCount === 1, "sBlindLoading true and _bindSegment was called once");
        fHandleTilesVisibility.restore();
    });

    test("isBlindLoading false tab mode _processSegment", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            fHandleTilesVisibility = sinon.stub(sap.ushell.utils, "handleTilesVisibility");
        oHomepageManager.segmentsStore = [aGroups];
        oHomepageManager.getSegmentContentViews = sinon.spy();
        oHomepageManager._bindSegment = sinon.spy();

        oHomepageManager.getModel().setProperty("/homePageGroupDisplay", "tabs");
        oHomepageManager._processSegment(aGroups);
        ok(oHomepageManager._bindSegment.callCount === 1, "isBlindLoading false  with tab mode and _bindSegment was called once");

        oHomepageManager.getModel().setProperty("/homePageGroupDisplay", "");
        fHandleTilesVisibility.restore();
    });

    asyncTest("verify delete tile", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "deleteTile", {
            tileId: "tile_01",
            tileTitle: "tile 01"
        });

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            equal(aGroups[0].tiles.length, iOriginalGroupLength - 1, "Group length decreased by 1");
            usageAnalyticsCheck(
                "Delete Tile",
                1,
                oHomepageManager.analyticsConstants.PERSONALIZATION,
                oHomepageManager.analyticsConstants.DELETE_TILE,
                ["TileDummyTitle", "tile_01", "tile_01", "group_0"]
            );
            start();
        }, 1000);
    });

    asyncTest("verify delete link", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iOriginalGroupLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "deleteTile", {
            tileId: "tile_000",
            tileTitle: "tile 000"
        });

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            equal(aGroups[0].tiles.length, iOriginalGroupLength - 1, "Group length decreased by 1");
            usageAnalyticsCheck(
                "Delete Tile",
                1,
                oHomepageManager.analyticsConstants.PERSONALIZATION,
                oHomepageManager.analyticsConstants.DELETE_TILE,
                ["TileDummyTitle", "tile_000", "tile_000", "group_0"]
            );
            start();
        }, 1000);
    });

    asyncTest("verify link tile loaded correctly", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel() });
        var oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
            fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            aGroups;

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            equal(aGroups[0].links.length, 1, "Link type tile was added to the group model");

            start();
        }, 1000);
    });

    test("verify that handleFirstSegmentLoaded called after firstSegmentCompleteLoaded if there is blind loading", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(), view: {} });
        var done = assert.async(),
            oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
            fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            fHandleSegmentStub = sinon.stub(oHomepageManager, "handleFirstSegmentLoaded"),
            fProcessRemainingSegmentsStub = sinon.stub(oHomepageManager, "_processRemainingSegments"),
            fIsBlindLoadingStub = sinon.stub(oHomepageManager, "isBlindLoading");

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        fIsBlindLoadingStub.returns(true);
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            ok(oHomepageManager.bIsFirstSegmentViewLoaded === false, "The tile views load later if there is blind loading");
            ok(fHandleSegmentStub.notCalled, "handleFirstSegmentLoaded should not called before firstSegmentCompleteLoaded event from EventHub");
            ok(fProcessRemainingSegmentsStub.notCalled, "_processRemainingSegments should not called before firstSegmentCompleteLoaded event from EventHub");
            EventHub.emit("firstSegmentCompleteLoaded", true);
            setTimeout(function () {
                ok(fHandleSegmentStub.called, "handleFirstSegmentLoaded should called after firstSegmentCompleteLoaded event from EventHub");
                fGetDefaultGroupStub.restore();
                fHandleSegmentStub.restore();
                fProcessRemainingSegmentsStub.restore();
                fIsBlindLoadingStub.restore();
                done();
            }, 100);
        }, 500);
    });

    test("verify that _processRemainingSegments called without waiting firstSegmentCompleteLoaded event when loadGroupd is called from AppFinder", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel() });
        var done = assert.async(),
            oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
            fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            fHandleSegmentStub = sinon.stub(oHomepageManager, "handleFirstSegmentLoaded"),
            fProcessRemainingSegmentsStub = sinon.stub(oHomepageManager, "_processRemainingSegments"),
            fIsBlindLoadingStub = sinon.stub(oHomepageManager, "isBlindLoading");

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        fIsBlindLoadingStub.returns(true);
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            ok(oHomepageManager.bIsFirstSegmentViewLoaded === false, "The tile views load later if there is blind loading");
            ok(oHomepageManager.bStartLoadRemainSegment, "bStartLoadRemainSegment flag is set to true, in order to prevent recalling _processRemainingSegments");
            ok(fHandleSegmentStub.notCalled, "handleFirstSegmentLoaded should not called before firstSegmentCompleteLoaded event from EventHub");
            ok(fProcessRemainingSegmentsStub.called, "_processRemainingSegments should called when loadGroupd called not from home page");

            fGetDefaultGroupStub.restore();
            fHandleSegmentStub.restore();
            fProcessRemainingSegmentsStub.restore();
            fIsBlindLoadingStub.restore();
            done();
        }, 100);
    });

    test("verify the order of setting the group model", function (assert) {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(), view: {} });
        var done = assert.async(),
            fIsBlindLoadingStub = sinon.stub(oHomepageManager, "isBlindLoading"),
            fProcessRemainingSegmentsStub = sinon.stub(oHomepageManager, "_processRemainingSegments");

        oHomepageManager.PagingManager = {};
        oHomepageManager.PagingManager.getGroupHeight = sinon.stub().returns(1);
        fIsBlindLoadingStub.returns(true);
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            assert.equal(oHomepageManager.oModel.getProperty("/groups").length, 1, "Firstly, the only visible group is set during the first rendering");
            //-1 first visible group
            // _setGroupModel receives all groups including default group
            assert.equal(oHomepageManager.aGroupsFrame.length, mockData.groups.length - 1, "aGroupsFrame should be reset");
            EventHub.emit("firstSegmentCompleteLoaded", true);
            setTimeout(function () {
                assert.equal(oHomepageManager.oModel.getProperty("/groups").length, mockData.groups.length, "The rest groups is set after firstSegmentCompleteLoaded");
                assert.equal(oHomepageManager.aGroupsFrame, null, "aGroupsFrame should be reset");
                fIsBlindLoadingStub.restore();
                fProcessRemainingSegmentsStub.restore();
                done();
            }, 100);
        }, 500);
    });

    test("verify that firstSegmentCompleteLoaded is emitted if there is no blind loading", function (assert) {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(), view: {} });
        var done = assert.async();
        var oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
            fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            fIsBlindLoadingStub = sinon.stub(oHomepageManager, "isBlindLoading");

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        fIsBlindLoadingStub.returns(false);
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            assert.ok(oHomepageManager.bIsFirstSegmentViewLoaded, "The tile view is loaded during _setGroupModel if there is no blind loading");
            assert.ok(EventHub.last("firstSegmentCompleteLoaded"), "firstSegmentCompleteLoaded should be emitted if there is no blind loading");
            done();
        }, 250);
    });

    test("_processSegment called for each segment", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var done = assert.async(),
            aGroups = oHomepageManager.getModel().getProperty("/groups"),
            fgetSegmentContentViews = sinon.stub(oHomepageManager, "getSegmentContentViews"),
            fBindSegment = sinon.stub(oHomepageManager, "_bindSegment"),
            fHandleTilesVisibility = sinon.stub(sap.ushell.utils, "handleTilesVisibility");

        oHomepageManager.segmentsStore = [aGroups.slice(0, 1), aGroups.slice(1)];
        oHomepageManager.isBlindLoading = function () {
            return true;
        };
        oHomepageManager.bIsGroupsModelLoading = true;
        oHomepageManager._processRemainingSegments();

        setTimeout(function () {
            ok(fBindSegment.calledTwice, "_bindSegment should called for each segment");
            ok(fHandleTilesVisibility.calledOnce, "handleTilesVisibility should called once (when all segment was loaded)");
            ok(!oHomepageManager.bIsGroupsModelLoading, "bIsGroupsModelLoading should be set to false when all segments were loaded");
            fgetSegmentContentViews.restore();
            fBindSegment.restore();
            fHandleTilesVisibility.restore();
            done();
        }, 600);
    });

    test("Verify locked groups are sorted in lexicographic order", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: [] }) });

        var oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
            fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            numOfLockedGroup,
            isSorted = true,
            index,
            aGroups;

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);
        aGroups = oHomepageManager.getModel().getProperty("/groups");

        numOfLockedGroup = jQuery.grep(aGroups, function (group) {
            return group.isGroupLocked;
        }).length;

        for (index = 1; index < numOfLockedGroup; index++) {
            if (aGroups[index - 1].title.toLowerCase() > aGroups[index].title.toLowerCase()) {
                isSorted = false;
                break;
            }
        }

        ok(isSorted, "All locked groups sorted in lexicographic order correctly");
        fGetDefaultGroupStub.restore();
    });
    // todo move test to adapter
    // test("Verify featured groups are on the top of groups", function () {
    //     oHomepageManager = new HomepageManager("homepageMgr", {
    //         model: new sap.ui.model.json.JSONModel({
    //             groups: []
    //         })
    //     });

    //     var oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
    //         fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
    //         bIsSorted = false,
    //         index,
    //         aGroups,
    //         aFeaturedGroups = [
    //             {
    //                 id: "featuredGroup_01",
    //                 groupId: "featuredGroup_01",
    //                 title: "featuredGroup_01",
    //                 isGroupVisible: true,
    //                 isGroupLocked: true,
    //                 isFeatured: true,
    //                 isRendered: false,
    //                 index: 4,
    //                 object: {
    //                     id: "featuredGroup_01",
    //                     groupId: "featuredGroup_01",
    //                     title: "featuredGroup_01"
    //                 },
    //                 tiles: [],
    //                 pendingLinks: [],
    //                 links: []
    //             },
    //             {
    //                 id: "featuredGroup_02",
    //                 groupId: "featuredGroup_02",
    //                 title: "featuredGroup_02",
    //                 isGroupVisible: true,
    //                 isGroupLocked: true,
    //                 isFeatured: true,
    //                 isRendered: false,
    //                 index: 4,
    //                 object: {
    //                     id: "featuredGroup_02",
    //                     groupId: "featuredGroup_02",
    //                     title: "featuredGroup_02"
    //                 },
    //                 tiles: [],
    //                 pendingLinks: [],
    //                 links: []
    //             }
    //         ];

    //     fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
    //     oHomepageManager._setGroupModel(mockData.groups.concat(aFeaturedGroups));
    //     aGroups = oHomepageManager.getModel().getProperty("/groups");

    //     for (index = 0; index < aFeaturedGroups.length; index++) {
    //         bIsSorted = aGroups[index].title === aFeaturedGroups[index].title;
    //         if (!bIsSorted) {
    //             break;
    //         }
    //     }
    //     ok(bIsSorted, "All featured groups are sorted to the top of the groups");
    //     fGetDefaultGroupStub.restore();
    // });

    test("Verify no _addBookmarkToModel is not processing the model in parallel", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel() });
        var oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
            fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            fLoadPersonalizedGroupsStub = sinon.stub(oHomepageManager, "loadPersonalizedGroups");

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        fLoadPersonalizedGroupsStub.returns(function () { });
        oHomepageManager._addBookmarkToModel(undefined, undefined, { tile: undefined, group: undefined });
        oHomepageManager._addBookmarkToModel(undefined, undefined, { tile: undefined, group: undefined });

        ok(fLoadPersonalizedGroupsStub.calledOnce, "Validate loadgroups from area called once");

        fGetDefaultGroupStub.restore();
        fLoadPersonalizedGroupsStub.restore();
    });

    test("handleDisplayModeChange: skip update model when there is scroll mode and blindLoading", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var fIsBlindLoadingStub = sinon.stub(oHomepageManager, "isBlindLoading", function () {
            return true;
        }),
            fGetTileViewSpy = sinon.spy(oHomepageManager, "getTileView"),
            fRefreshSpy = sinon.spy(oHomepageManager.getModel(), "refresh");

        oHomepageManager.handleDisplayModeChange("scroll");

        ok(fRefreshSpy.notCalled, "refresh model should not be called");
        ok(fGetTileViewSpy.notCalled, "getTileView should not be called");
        fIsBlindLoadingStub.restore();
        fGetTileViewSpy.restore();
        fRefreshSpy.restore();
    });

    test("handleDisplayModeChange: update model when there is scroll mode and no blindLoading", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel() });
        var modelGroup = mockData.groups[0],
            fIsBlindLoadingStub = sinon.stub(oHomepageManager, "isBlindLoading", function () {
                return false;
            }),
            fGetTileViewSpy = sinon.stub(oHomepageManager, "getTileView"),
            fRefreshSpy = sinon.stub(oHomepageManager.getModel(), "refresh");

        oHomepageManager.getModel().setProperty("/groups", [modelGroup]);
        oHomepageManager.handleDisplayModeChange("scroll");

        equal(fGetTileViewSpy.callCount, modelGroup.tiles.length + modelGroup.links.length, "refresh model should be called once");
        ok(fRefreshSpy.calledOnce, "refresh model should be called once");
        fIsBlindLoadingStub.restore();
        fGetTileViewSpy.restore();
        fRefreshSpy.restore();
    });

    test("handleDisplayModeChange: update isGroupSelected of groups when there is tabs model", function () {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel(mockData) });
        var aGroups = oHomepageManager.getModel().getProperty("/groups"),
            iNewSelectedAnchorItem = 1;

        oHomepageManager.getModel().setProperty("/iSelectedGroup", iNewSelectedAnchorItem);
        oHomepageManager.handleDisplayModeChange("tabs");
        for (var i = 0; i < aGroups.length; i++) {
            if (i === iNewSelectedAnchorItem) {
                ok(aGroups[i].isGroupSelected, "The group " + iNewSelectedAnchorItem + " should be selected, because this anchorItem is selected");
            } else {
                ok(!aGroups[i].isGroupSelected, "The group " + i + " should not be selected");
            }
        }
    });

    test("Verify that the header is not hidden if there is only 1 visible group", function (assert) {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: [] }) });

        var fnDone = assert.async(),
            aGroups;

        oHomepageManager._setGroupModel(mockData.groups.slice(0, 1));

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.ok(aGroups[0].showGroupHeader !== false, "The header of the first visible group is shown, if there is only 1 group");
            fnDone();
        }, 500);
    });

    test("Verify that the header of the first group is hidden if there is more than 1 visible group", function (assert) {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: [] }) });

        var fnDone = assert.async(),
            oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
            fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            aGroups;

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");
            assert.equal(aGroups[0].showGroupHeader, false, "The header of the first visible group is shown, if there is only 1 group");
            fGetDefaultGroupStub.restore();
            fnDone();
        }, 500);
    });

    test("deleteTilesFromGroup: test tile deletion", function (assert) {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel() });

        var fnDone = assert.async(),
            oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
            fDeleteTilesFromGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            aGroups,
            aRemovedTilesIds = [],
            nTiles;

        fDeleteTilesFromGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");

            nTiles = aGroups[0].tiles.length;
            aRemovedTilesIds[0] = aGroups[0].tiles[0].uuid;
            oHomepageManager.deleteTilesFromGroup(aGroups[0].groupId, aRemovedTilesIds);

            aGroups = oHomepageManager.getModel().getProperty("/groups");

            assert.equal(aGroups[0].tiles.length, nTiles - 1, "Tile should be deleted from group");
            fDeleteTilesFromGroupStub.restore();
            fnDone();
        }, 500);
    });

    test("deleteTilesFromGroup: test link deletion", function (assert) {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel() });

        var fnDone = assert.async(),
            oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
            fDeleteTilesFromGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            aGroups,
            aRemovedLinksIds = [],
            nLinks;

        fDeleteTilesFromGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");

            nLinks = aGroups[0].links.length;
            aRemovedLinksIds[0] = aGroups[0].links[0].uuid;
            oHomepageManager.deleteTilesFromGroup(aGroups[0].groupId, aRemovedLinksIds);

            aGroups = oHomepageManager.getModel().getProperty("/groups");

            assert.equal(aGroups[0].links.length, nLinks - 1, "Link should be deleted from group");
            fDeleteTilesFromGroupStub.restore();
            fnDone();
        }, 500);
    });

    test("deleteTilesFromGroup: test tile and link deletion", function (assert) {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel() });

        var fnDone = assert.async(),
            oPageBuilderService = sap.ushell.Container.getService("LaunchPage"),
            fDeleteTilesFromGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            aGroups,
            aRemovedIds = [],
            nTiles,
            nLinks;

        fDeleteTilesFromGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oHomepageManager._setGroupModel(mockData.groups);

        setTimeout(function () {
            aGroups = oHomepageManager.getModel().getProperty("/groups");

            nTiles = aGroups[0].tiles.length;
            nLinks = aGroups[0].links.length;

            aRemovedIds[0] = aGroups[0].tiles[0].uuid;
            aRemovedIds[1] = aGroups[0].links[0].uuid;
            oHomepageManager.deleteTilesFromGroup(aGroups[0].groupId, aRemovedIds);

            aGroups = oHomepageManager.getModel().getProperty("/groups");

            // aGroups = mockData.groups;
            assert.equal(aGroups[0].tiles.length, nTiles - 1, "Tile should be deleted from group");
            assert.equal(aGroups[0].links.length, nLinks - 1, "Link should be deleted from group");
            fDeleteTilesFromGroupStub.restore();
            fnDone();
        }, 500);
    });

    test("Verify that group model will not load again until it is completly loaded", function (assert) {
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: [] }) });

        var fSplitGroupStub = sinon.spy(oHomepageManager, "_splitGroups");

        oHomepageManager._setGroupModel(mockData.groups);
        oHomepageManager._setGroupModel(mockData.groups);

        assert.ok(oHomepageManager.bIsGroupsModelLoading, "bIsGroupsModelLoading flag should be true until model completly loading of the model");
        assert.ok(fSplitGroupStub.calledOnce, "Group model loading should be processed only once");
        fSplitGroupStub.restore();
    });

    var aGroups,
        oTileContent;

    module("sap.ushell.components.HomepageManager-2", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                jQuery.sap.flpmeasure = {
                    end: function () { },
                    start: function () { },
                    endFunc: function () { },
                    startFunc: function () { }
                };

                oUserRecentsStub = sinon.stub(sap.ushell.Container.getService("UserRecents"), "addAppUsage");
                aGroups = [{
                    id: "group_0",
                    title: "KPIs",
                    isPreset: true,
                    tiles: [
                        {
                            id: "tile_00",
                            title: "Sales Performance",
                            size: "1x1",
                            tileType: "sap.ushell.ui.tile.DynamicTile"
                        }, {
                            id: "tile_01",
                            title: "WEB GUI",
                            size: "1x1",
                            tileType: "sap.ushell.ui.tile.TileBase"
                        }
                    ]
                }];
                oTileContent = { destroy: function () { } };
                start();
            });
        },
        // This method is called after each test. Add every restoration code here.
        teardown: function () {
            if (oHomepageManager) {
                oHomepageManager.destroy();
            }
            oHomepageManager = null;
            oUserRecentsStub.restore();
            delete sap.ushell.Container;
        }
    });

    test("getTileView - load tiles", function (assert) {
        var oLaunchPageService,
            fGetGroupsStub,
            fGetDefaultGroup,
            fGetTileView,
            aModelGroups,
            oLoadTileDataStub,
            fnDone = assert.async();

        oLaunchPageService = sap.ushell.Container.getService("LaunchPage");
        fGetGroupsStub = sinon.stub(oLaunchPageService, "getGroups");
        fGetGroupsStub.returns(jQuery.Deferred().resolve(aGroups));
        fGetDefaultGroup = sinon.stub(oLaunchPageService, "getDefaultGroup");
        fGetDefaultGroup.returns(jQuery.Deferred().resolve(aGroups[0]));
        fGetTileView = sinon.stub(oLaunchPageService, "getTileView");
        fGetTileView.returns(jQuery.Deferred().resolve(oTileContent));

        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: {} }) });
        oLoadTileDataStub = sinon.spy(oHomepageManager, "_loadTileData");

        var oPromise = oHomepageManager.loadPersonalizedGroups();
        oPromise.then(function () {
            aModelGroups = oHomepageManager.getModel().getProperty("/groups");
            ok(aModelGroups.length === 1, "groups length should be 1 :" + aModelGroups.length);
            ok(aModelGroups[0].tiles.length === 2, "tiles length should be 2 :" + aModelGroups[0].tiles.length);
            ok(aModelGroups[0].tiles[0].content[0] === oTileContent, "tile 0 view");
            ok(aModelGroups[0].tiles[1].content[0] === oTileContent, "tile 1 view");
            assert.ok(oLoadTileDataStub.called, "_loadTileData was called");

            fGetGroupsStub.restore();
            fGetDefaultGroup.restore();
            fGetTileView.restore();
            oLoadTileDataStub.restore();
            fnDone();
        })
    });

    test("getTileView - load cards", function () {
        var oLaunchPageService,
            oGetTileTypeStub,
            oSetTileVisibleStub,
            oLoadCardDataStub,
            oLoadTileDataStub,
            oDummyTile = { object: "someObject" };

        // Arrange
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: {} }) });
        oHomepageManager.loadPersonalizedGroups();

        oLaunchPageService = sap.ushell.Container.getService("LaunchPage");
        oHomepageManager.oDashboardLoadingManager = {
            isTileViewRequestIssued: sinon.stub().returns(false),
            setTileInProgress: sinon.stub()
        };
        oGetTileTypeStub = sinon.stub(oLaunchPageService, "getTileType").returns("card");
        oSetTileVisibleStub = sinon.stub(oLaunchPageService, "setTileVisible");
        oLoadCardDataStub = sinon.stub(oHomepageManager, "_loadCardData");
        oLoadTileDataStub = sinon.stub(oHomepageManager, "_loadTileData");

        // Act
        oHomepageManager.getTileView(oDummyTile);

        // Assert
        assert.ok(oGetTileTypeStub.called, "getTileType was called");
        assert.ok(oSetTileVisibleStub.called, "setTileVisible was called");
        assert.deepEqual(oLoadCardDataStub.args[0][0], oDummyTile, "_loadCardData was called with the correct argument");
        assert.ok(oLoadTileDataStub.notCalled, "_loadTileData was not called");

        // Cleanup
        oGetTileTypeStub.restore();
        oSetTileVisibleStub.restore();
        oLoadCardDataStub.restore();
        oLoadTileDataStub.restore();
    });

    test("getTileView - don't load tiles or cards when the loading has already been triggered", function () {
        var oLaunchPageService,
            oGetTileTypeStub,
            oSetTileVisibleStub,
            oLoadCardDataStub,
            oLoadTileDataStub,
            oDummyTile = { object: "someObject" };

        // Arrange
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: {} }) });

        oLaunchPageService = sap.ushell.Container.getService("LaunchPage");
        oHomepageManager.oDashboardLoadingManager = {
            isTileViewRequestIssued: sinon.stub().returns(true),
            setTileInProgress: sinon.stub()
        };
        oGetTileTypeStub = sinon.stub(oLaunchPageService, "getTileType").returns("card");
        oSetTileVisibleStub = sinon.stub(oLaunchPageService, "setTileVisible");
        oLoadCardDataStub = sinon.stub(oHomepageManager, "_loadCardData");
        oLoadTileDataStub = sinon.stub(oHomepageManager, "_loadTileData");

        // Act
        oHomepageManager.getTileView(oDummyTile);

        // Assert
        assert.ok(oGetTileTypeStub.called, "getTileType was called");
        assert.ok(oSetTileVisibleStub.notCalled, "setTileVisible was not called");
        assert.ok(oLoadCardDataStub.notCalled, "_loadCardData was not called");
        assert.ok(oLoadTileDataStub.notCalled, "_loadTileData was not called");

        // Cleanup
        oGetTileTypeStub.restore();
        oSetTileVisibleStub.restore();
        oLoadCardDataStub.restore();
        oLoadTileDataStub.restore();
    });

    test("_loadCardData - Set the proper properties when no blind loading is active", function () {
        var oGetCoreStub,
            oByIdStub,
            oPerformanceStartStub,
            oPerformanceEndStub,
            oIsBlindLoadingStub,
            oSetManifestStub,
            oSetTileResolvedStub,
            oDummyTile = {
                controlId: "someId",
                object: "someObject",
                manifest: "someManifest"
            };

        // Arrange
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: {} }) });

        oSetManifestStub = sinon.stub();
        oByIdStub = sinon.stub().returns({
            setManifest: oSetManifestStub
        });
        oGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
            byId: oByIdStub
        });
        oPerformanceStartStub = sinon.stub(jQuery.sap.flpmeasure, "startFunc");
        oPerformanceEndStub = sinon.stub(jQuery.sap.flpmeasure, "endFunc");
        oIsBlindLoadingStub = sinon.stub(oHomepageManager, "isBlindLoading").returns(false);
        oSetTileResolvedStub = sinon.stub(oHomepageManager.oDashboardLoadingManager, "setTileResolved");

        // Act
        oHomepageManager._loadCardData(oDummyTile);

        // Assert
        assert.deepEqual(oDummyTile.content, [oDummyTile.manifest], "The cards content is properly set");
        assert.ok(oGetCoreStub.called, "getCore was called");
        assert.ok(oByIdStub.called, "byId was called");
        assert.ok(oPerformanceStartStub.called, "Performance start point was set");
        assert.ok(oPerformanceEndStub.called, "Performance end point was set");
        assert.ok(oIsBlindLoadingStub.called, "isBlindLoading was called");
        assert.ok(oSetManifestStub.notCalled, "setManifest was not called");
        assert.ok(oSetTileResolvedStub.called, "setTileResolved was called");

        // Cleanup
        oGetCoreStub.restore();
        oPerformanceStartStub.restore();
        oPerformanceEndStub.restore();
        oIsBlindLoadingStub.restore();
        oSetTileResolvedStub.restore();
    });

    test("Verify that _addBookmarkToModel adds bookmark to default group if no target group was specified", function () {
        var oTempModel = new sap.ui.model.json.JSONModel(),
            oModelGroup,
            oPageBuilderService,
            fGetDefaultGroupStub,
            fLoadPersonalizedGroupsStub,
            fGetTileTypeStub,
            fGetTileViewStub,
            fUpdateTileModelStub,
            fUtilsCalcVisibilityStub,
            fGetGroupIdStub,
            fIsLockedGroup,
            oDefaultGroup = {
                isDefaultGroup: true,
                isGroupLocked: function () { return false; },
                visibilityModes: {},
                groupId: "group2ID",
                tiles: [],
                object: {
                    groupId: "group2ID",
                    isGroupLocked: false
                }
            };

        // Fill the model with 3 groups, the 2nd one (id: group2ID) is the default group
        oTempModel.setProperty(
            "/groups",
            [
                {
                    isDefaultGroup: false,
                    groupId: "group1ID",
                    object: { groupId: "group1ID" }
                },
                oDefaultGroup,
                {
                    isDefaultGroup: false,
                    groupId: "group3ID",
                    object: { groupId: "group3ID" }
                }
            ]
        );
        oHomepageManager = new HomepageManager("homepageMgr", { model: oTempModel });
        oPageBuilderService = sap.ushell.Container.getService("LaunchPage");

        // LaunchPage service stubs:
        fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup");
        fGetGroupIdStub = sinon.stub(oPageBuilderService, "getGroupId", function (oGroupObject) {
            return oGroupObject.groupId;
        });
        fIsLockedGroup = sinon.stub(oPageBuilderService, "isGroupLocked", function (oGroupObject) {
            return oGroupObject.isGroupLocked;
        });

        // HomepageManager stubs:
        fLoadPersonalizedGroupsStub = sinon.stub(oHomepageManager, "loadPersonalizedGroups");
        fGetTileTypeStub = sinon.stub(oPageBuilderService, "getTileType");
        fGetTileViewStub = sinon.stub(oHomepageManager, "getTileView");
        fUpdateTileModelStub = sinon.stub(oHomepageManager, "_updateModelWithTileView");

        fUtilsCalcVisibilityStub = sinon.stub(sap.ushell.utils, "calcVisibilityModes").returns({});

        oHomepageManager._addBookmarkToModel(undefined, undefined, { tile: {}, group: undefined });

        ok(fUtilsCalcVisibilityStub.args[0][0] === oDefaultGroup, "Function sap.ushell.utils.calcVisibilityModes is called with the default group");
        oModelGroup = oTempModel.getProperty("/groups/1");
        ok(oModelGroup.tiles.length === 1, "Verify adding the bookmark to the dafault group");

        fGetDefaultGroupStub.restore();
        fLoadPersonalizedGroupsStub.restore();
        fGetTileTypeStub.restore();
        fGetTileViewStub.restore();
        fUpdateTileModelStub.restore();
        fUtilsCalcVisibilityStub.restore();
        fGetGroupIdStub.restore();
        fIsLockedGroup.restore();
    });

    test("getTileViewFromArray - should set property for model only once when blindloading and standart tiles", function () {
        var oLaunchPageService,
            fIsBlindLoading,
            fGetTileView,
            fRefreshSpy,
            aRequestTileView;

        aRequestTileView = [
            {
                oTile: {
                    isCustomTile: true,
                    object: {
                        id: "tile0",
                        appIDHint: "App0"
                    },
                    content: [],
                    target: "#PUBLIC-App0Action",
                    navigationMode: "embedded"
                },
                iGroup: 1,
                bIsExtanded: false
            }, {
                oTile: {
                    isCustomTile: true,
                    object: {
                        id: "tile1",
                        appIDHint: "App1"
                    },
                    content: [],
                    target: "#PUBLIC-App1Action",
                    navigationMode: "embedded"
                },
                iGroup: 1,
                bIsExtanded: false
            }
        ];

        oLaunchPageService = sap.ushell.Container.getService("LaunchPage");
        fGetTileView = sinon.stub(oLaunchPageService, "getTileView");
        fGetTileView.returns(jQuery.Deferred().resolve(oTileContent));

        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: {} }) });
        fIsBlindLoading = sinon.stub(oHomepageManager, "isBlindLoading").returns(true);
        fRefreshSpy = sinon.spy(oHomepageManager.getModel(), "refresh");

        oHomepageManager.getTileViewsFromArray(aRequestTileView);
        ok(fRefreshSpy.calledOnce, "set property for the model should be called once");

        fGetTileView.restore();
        fIsBlindLoading.restore();
    });

    test("getTileViewFromArray - skip execution when empty input", function () {
        var fRefresh,
            aRequestTileView = [];

        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: {} }) });
        fRefresh = sinon.spy(oHomepageManager.getModel(), "refresh");

        oHomepageManager.getTileViewsFromArray(aRequestTileView);
        ok(!fRefresh.called, "getTileViewFromArray should skip execution when call with empty input");
    });

    test("Trigger handleTilesVisibility after a theme change", function (assert) {
        var done = assert.async(),
            oHandleTilesVisibilitySpy,
            sTheme,
            iCallCount;

        oHandleTilesVisibilitySpy = sinon.spy(sap.ushell.utils, "handleTilesVisibility");
        oHomepageManager = new HomepageManager("homepageMgr", { model: new sap.ui.model.json.JSONModel({ groups: {} }) });
        sTheme = sap.ui.getCore().getConfiguration().getTheme();

        sap.ui.getCore().attachThemeChanged(checkAndCleanup);
        // apply a dummy theme that is different from the current theme
        sap.ui.getCore().applyTheme(sTheme + new Date().getMilliseconds());

        function checkAndCleanup() {
            assert.ok(oHandleTilesVisibilitySpy.called, "The tile visibility was recalculated after the theme change");
            iCallCount = oHandleTilesVisibilitySpy.callCount;

            oHomepageManager = oHomepageManager.destroy();

            sap.ui.getCore().detachThemeChanged(checkAndCleanup);
            sap.ui.getCore().attachThemeChanged(cleanupAndDone);
            sap.ui.getCore().applyTheme(sTheme);
        }

        function cleanupAndDone() {
            assert.strictEqual(oHandleTilesVisibilitySpy.callCount, iCallCount, "The theme changed event handler was successfully deregistered during destroying the HomepageManager");
            sap.ui.getCore().detachThemeChanged(cleanupAndDone);
            oHandleTilesVisibilitySpy.restore();
            done();
        }
    });
});

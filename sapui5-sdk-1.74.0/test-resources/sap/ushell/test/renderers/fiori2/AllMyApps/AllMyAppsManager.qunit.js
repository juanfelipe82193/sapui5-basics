/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.AllMyAppsManager.
 * Testing the consumptions of groups data, external providers data and catalogs data
 * and how the model is updated in each use-case.
 *
 * Tested functions:
 * - _handleGroupsData
 * - _getGroupsData
 * - _handleExternalProvidersData
 * - _addCatalogToModel
 */
(function () {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon, window, hasher */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.renderers.fiori2.allMyApps.AllMyAppsManager");

    var oAllMyAppsManager,
        oGetGroupsDataRespone = [
            {
                title: "Group 0",
                apps: [{
                    title: "Tile 0",
                    url: "#a-b"
                }, {
                    title: "Tile 1",
                    url: "#a-b"
                }, {
                    title: "Tile 2",
                    url: "#a-b"
                }
                    ]
            }, {
                title: "Group 1",
                apps: [{
                    title: "Tile 0",
                    url: "#a-b"
                }, {
                    title: "Tile 1",
                    url: "#a-b"
                }, {
                    title: "Tile 2",
                    url: "#a-b"
                }
                    ]
            }, {
                title: "Group 2",
                apps: [{
                    title: "Tile 0",
                    url: "#a-b"
                }, {
                    title: "Tile 1",
                    url: "#a-b"
                }, {
                    title: "Tile 2",
                    url: "#a-b"
                }
                    ]
            }
        ],
        oLaunchPageGetGroupsResponse = [
            {
                id: "group_0",
                title: "Group 0",
                isPreset: true,
                isVisible: true,
                tiles: [
                    {
                        id: "tile_1",
                        title: "Tile 1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a long long long long long long long long long long long long link!",
                            href: "#a1-b1"
                        }
                    },
                    {
                        id: "tile_2",
                        title: "Tile 2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        isLink: true,
                        properties: {
                            text: "I am a link!",
                            href: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_3",
                        title: "Tile 3",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Tablet,Phone",
                        chipId: "catalogTile_34",
                        properties: {
                            title: "WEB GUI",
                            subtitle: "Opens WEB GUI",
                            targetURL: "#Action-WEBGUI"
                        }
                    },
                    {
                        id: "Tile_Intent_not_supported",
                        title: "Tile_Intent_not_supported",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Tablet,Phone",
                        chipId: "catalogTile_34",
                        properties: {
                            title: "Tile_Intent_not_supported",
                            subtitle: "Opens WEB GUI",
                            targetURL: "#Action-WEBGUI"
                        }
                    },
                    {
                        id: "Tile_no_title",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Tablet,Phone",
                        chipId: "catalogTile_34",
                        properties: {
                            subtitle: "Opens WEB GUI",
                            targetURL: "#Action-WEBGUI"
                        }
                    },
                    {
                        id: "Tile_No_Url",
                        title: "Tile No Url",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        formFactor: "Tablet,Phone",
                        chipId: "catalogTile_34",
                        properties: {
                            title: "WEB GUI",
                            subtitle: "Opens WEB GUI"
                        }
                    }
                ]
            },
            {
                id: "group_1",
                title: "Group 1",
                isPreset: false,
                isVisible: true,
                tiles: [
                    {
                        id: "tile_30",
                        title: "Long Tile 1",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Long Tile 1",
                            subtitle: "Long Tile 1",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_31",
                        title: "Long Tile 2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_38",
                        properties: {
                            title: "Long Tile 2",
                            subtitle: "Long Tile 2",
                            targetURL: "#Action-todefaultapp"
                        }
                    },
                    {
                        id: "tile_33",
                        title: "Regular Tile 2",
                        tileType: "sap.ushell.ui.tile.StaticTile",
                        chipId: "catalogTile_10",
                        properties: {
                            title: "Regular Tile 2",
                            subtitle: "Regular Tile 2",
                            targetURL: "http://www.heise.de"
                        }
                    }
                ]
            }, {
                id: "group_2",
                title: "Group 2",
                isPreset: true,
                isVisible: true,
                tiles: [
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        properties : {
                            title : "US Profit Margin is at",
                            targetURL : "#Action-toappnavsample"
                        }
                    }, {
                        chipId : "catalogTile_36",
                        title : "Gross Revenue under Target at",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        properties : {
                            title : "Gross Revenue under Target at",
                            targetURL : "#Action-approvepurchaseorders"
                        }
                    },
                    {
                        chipId : "catalogTile_35",
                        title : "US Profit Margin is at",
                        tileType : "sap.ushell.ui.tile.DynamicTile",
                        properties : {
                            title : "US Profit Margin is at",
                            targetURL : "#Action-toappnavsample"
                        }
                    }
                ]
            }, {
                id: "Hidden_Group",
                title: "Hidden Group",
                isPreset: true,
                isVisible: false,
                tiles: [{
                    id: "Hidden_tile_1_id",
                    title: "Hidden title 1",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    chipId: "catalogTile_38",
                    properties: {
                        title: "Long Tile 2",
                        subtitle: "Long Tile 1",
                        targetURL: "#Action-todefaultapp"
                    }
                }, {
                    id: "Hidden_tile_2_id",
                    title: "Hidden title 2",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    chipId: "catalogTile_38",
                    properties: {
                        title: "Long Tile 2",
                        subtitle: "Long Tile 2",
                        targetURL: "#Action-todefaultapp"
                    }
                }
                    ]
            }, {
                id: "group_No_Valid_Tiles",
                title: "No valid tiles",
                isPreset: true,
                isVisible: true,
                tiles: [{
                    id: "tile_no_title",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    chipId: "catalogTile_38",
                    properties: {
                        subtitle: "Long Tile 1",
                        targetURL: "#Action-todefaultapp"
                    }
                }, {
                    id: "tile_no_url",
                    title: "tile_no_url",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    chipId: "catalogTile_38",
                    properties: {
                        title: "Long Tile 2",
                        subtitle: "Long Tile 2"
                    }
                }
                    ]
            }
        ],
        aExternalProvider_0_Data = [
            { // Group 1
                title: "Group01",
                apps: [
                    {
                        title: "P0_G1_Title1",
                        subTitle: "P0_G1_SubTitle1",
                        url: "#Action-todefaultapp"
                    }, {
                        title: "P0_G1_Title2",
                        subTitle: "P0_G1_SubTitle2",
                        url: "https://www.youtube.com/"
                    }
                ]
            }, { // Group 2
                title: "Group02",
                apps: [
                    {
                        title: "P0_G2_Title1",
                        subTitle: "P0_G2_SubTitle1",
                        url: "http://www.ynet.co.il"
                    }, {
                        title: "P0_G2_Title2",
                        subTitle: "P0_G2_SubTitle2",
                        url: "#Action-todefaultapp"
                    }
                ]
            }
        ],
        aExternalProvider_1_Data = [
            { // Group 1
                title: "Group11",
                apps: [
                    {
                        title: "P1_G1_Title1",
                        subTitle: "P1_G1_SubTitle1",
                        url: "#Action-todefaultapp"
                    }, {
                        title: "P1_G1_Title2",
                        subTitle: "P1_G1_SubTitle2",
                        url: "https://www.youtube.com/"
                    }
                ]
            }, { // Group 2
                title: "Group12",
                apps: [
                    {
                        title: "P1_G2_Title1",
                        subTitle: "P1_G2_SubTitle1",
                        url: "http://www.ynet.co.il"
                    }, {
                        title: "P1_G2_Title2",
                        subTitle: "P1_G2_SubTitle2",
                        url: "#Action-todefaultapp"
                    }
                ]
            }
        ],
        oAllMyAppsGetDataProvidersResponse = {
            ExternalProvider0 : {
                getTitle : function () {
                    return "ExternalProvider0";
                },
                getData : function () {
                    var oDeferred = jQuery.Deferred();
                    oDeferred.resolve(aExternalProvider_0_Data);
                    return oDeferred.promise();
                }
            },
            ExternalProvider1 : {
                getTitle : function () {
                    return "ExternalProvider1";
                },
                getData : function () {
                    var oDeferred = jQuery.Deferred();
                    oDeferred.resolve(aExternalProvider_1_Data);
                    return oDeferred.promise();
                }
            }
        },

        // Only the 2nd tile (Catalog Tile 02) is valid and should be inserted to the model
        oCatalog0 =
            {
                id: "Catalog_0",
                title: "Catalog 0",
                tiles: [{
                    chipId: "catalogTile_01",
                    formFactor: "Desktop,Tablet,Phone",
                    id: "catalogTile_01_id",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    properties: {
                        subtitle: "",
                        targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
                        title: "" // No Title and no SubTitle => this tile should not be filtered out by _addCatalogToModel
                    }
                }, {
                    chipId: "catalogTile_02",
                    formFactor: "Tablet,Phone",
                    id: "catalogTile_02_id",
                    tileType: "sap.ushell.ui.tile.ImageTile",
                    properties: {
                        subtitle: "SubTitle 02",
                        targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
                        title: "Catalog Tile 02"
                    }
                }
                    ]
            },

        // Only the 2nd tile (Catalog Tile 12) is valid and should be inserted to the model
        oCatalog1 =
            {
                id: "Catalog_1",
                title: "Catalog 1",
                tiles: [{
                    chipId: "catalogTile_11",
                    formFactor: "Desktop,Tablet,Phone",
                    id: "catalogTile_11_id",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    properties: {
                        subtitle: "",
                        targetURL: "",
                        title: "Catalog Tile 11"
                    }
                }, {
                    chipId: "catalogTile_12",
                    formFactor: "Tablet,Phone",
                    id: "catalogTile_12_id",
                    tileType: "sap.ushell.ui.tile.ImageTile",
                    properties: {
                        subtitle: "SubTitle 12",
                        targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
                        title: "Catalog Tile 12"
                    }
                }
                    ]
            },

        // Only the 1st tile (Catalog Tile 12) is valid and should be inserted to the model
        oCatalog2 =
            {
                id: "Catalog_2",
                title: "Catalog 1", // Same title as the previous catalog => the two catalogs should be merged
                tiles: [{
                    chipId: "catalogTile_21",
                    formFactor: "Desktop,Tablet,Phone",
                    id: "catalogTile_1_id",
                    tileType: "sap.ushell.ui.tile.StaticTile",
                    properties: {
                        subtitle: "SubTitle 21",
                        targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
                        title: "Catalog Tile 21"
                    }
                }, {
                    chipId: "catalogTile_22",
                    formFactor: "Tablet,Phone",
                    tileType: "sap.ushell.ui.tile.ImageTile",
                    properties: {
                        subtitle: "",
                        targetURL: "", // No TargetUrl => this tile should not be filtered out by _addCatalogToModel
                        title: "Catalog Tile 22" // Title taken from here
                    }
                }
                    ]
            },

        // Only the 1st tile (Catalog Tile 12) is valid and should be inserted to the model
        oCatalog3 = {
            id: "Catalog_3",
            title: "Catalog 3 Custom", // Same title as the previous catalog => the two catalogs should be merged
            tiles: [{
                chipId: "catalogTile_31",
                formFactor: "Desktop,Tablet,Phone",
                id: "catalogTile_3_id",
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    subtitle: "SubTitle 31",
                    title: "Catalog Tile 31"
                }
            }, {
                chipId: "catalogTile_32",
                formFactor: "Desktop,Tablet,Phone",
                tileType: "sap.ushell.ui.tile.ImageTile",
                properties: {
                    subtitle: "",
                    targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
                    title: "Catalog Tile 32" // Title taken from here
                }
            }
            ]
        };

    module("sap.ushell.renderers.fiori2.AllMyApps.AllMyAppsManager", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                oAllMyAppsManager =  sap.ushell.renderers.fiori2.allMyApps.AllMyAppsManager;
                oAllMyAppsManager.oModel = new sap.ui.model.json.JSONModel();
                oAllMyAppsManager.oModel.setProperty("/AppsData", []);
                oAllMyAppsManager.iNumberOfProviders = 0;
                oAllMyAppsManager.aPromises = [];
                start();
            });
        },

        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    // -------------------------------------------------------------------------------
    // ----------------------------------   TESTS   ----------------------------------
    // -------------------------------------------------------------------------------

    test("test _handleGroupsData", function () {
        var oGetGroupsPromise,
            oGetGroupsDataStub = sinon.stub(oAllMyAppsManager, "_getGroupsData").returns(jQuery.Deferred().resolve(oGetGroupsDataRespone));

        oGetGroupsPromise = oAllMyAppsManager._handleGroupsData();

        ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].title === "Home Page Apps", "First element in AppsData (in the model) is Home");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].type === sap.ushell.Container.getService("AllMyApps").getProviderTypeEnum().HOME, "First element in AppsData (in the model) is of type HOME");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].groups.length === 3, "Home entry in AppsData has 3 elements (groups)");

        oGetGroupsDataStub.restore();
    });

    test("test _handleCatalogs first load", function () {
        var oOriginalGetService = sap.ushell.Container.getService,
            callCount = 0;

        sap.ushell.Container.getService = function () {
            return {
                getCatalogs: function() {
                    callCount++;
                    return {
                        done: function () {
                            return {
                                fail: function () {
                                    return {
                                      progress: function () {}
                                    };
                                }
                            };
                        }
                    };
                },
                isHomePageAppsEnabled: function() {
                    return true;
                }
            };
        }
        var oHandleNotFirstCatalogsLoadSpy = sinon.spy(oAllMyAppsManager, "_handleNotFirstCatalogsLoad");
        oAllMyAppsManager._handleCatalogs(true);
        ok(oHandleNotFirstCatalogsLoadSpy.calledOnce === false, "On first load of all my apps _handleNotFirstCatalogsLoad should not be called");
        sap.ushell.Container.getService = oOriginalGetService;
        oHandleNotFirstCatalogsLoadSpy.restore();
    });

    test("test _handleCatalogs second load", function () {
      var oOriginalGetService = sap.ushell.Container.getService,
          callCount = 0;

      sap.ushell.Container.getService = function () {
          return {
              getCatalogs: function() {
                  callCount++;
                  return {
                      done: function () {
                          return {
                              fail: function () {
                                  return {
                                    progress: function () {}
                                  };
                              }
                          };
                      }
                  };
              }
          };
      }
      var oHandleNotFirstCatalogsLoadSpy = sinon.stub(oAllMyAppsManager, "_handleNotFirstCatalogsLoad");
      oAllMyAppsManager._handleCatalogs(false);
      ok(oHandleNotFirstCatalogsLoadSpy.calledOnce === true, "On first load of all my apps _handleNotFirstCatalogsLoad should be called");
      sap.ushell.Container.getService = oOriginalGetService;
      oHandleNotFirstCatalogsLoadSpy.restore();
    });

    test("test _handleGroupsData - verify Home provider location is first", function () {
        var oGetGroupsPromise,
            oGetGroupsDataStub = sinon.stub(oAllMyAppsManager, "_getGroupsData").returns(jQuery.Deferred().resolve(oGetGroupsDataRespone)),
            oTempFirstProviderInModel = {
                title : "TempProvider",
                type : 1,
                groups : []
            };
        oAllMyAppsManager.oModel.setProperty("/AppsData/0", oTempFirstProviderInModel);

        oGetGroupsPromise = oAllMyAppsManager._handleGroupsData();

        ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].title === "Home Page Apps", "First element in AppsData (in the model) is Home");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[1].title === "TempProvider", "Second element in AppsData (in the model) is TempProvider");

        oGetGroupsDataStub.restore();
    });

    test("test _getGroupsData", function () {
        var oOriginalGetService = sap.ushell.Container.getService,
            oGetGroupsDataPromise;

        sap.ushell.Container.getService = function () {
            return {
                getGroups : function () {
                    return jQuery.Deferred().resolve(oLaunchPageGetGroupsResponse);
                },
                getDefaultGroup : function () {
                    return jQuery.Deferred().resolve(oLaunchPageGetGroupsResponse[0]);
                },
                getGroupId : function () {
                    return jQuery.Deferred().resolve(oLaunchPageGetGroupsResponse[0].id);
                },
                getGroupTitle : function (oGroup) {
                    return oGroup.title;
                },
                getGroupTiles : function (oGroup) {
                    return oGroup.tiles;
                },
                isGroupVisible : function (oGroup) {
                    return oGroup.isVisible;
                },
                isTileIntentSupported : function (oTile) {
                    return oTile.id !== "Tile_Intent_not_supported";
                },
                getTileTitle : function (oTile) {
                    return oTile.title;
                },
                getCatalogTitle : function (oCatalog) {
                    return oCatalog.title;
                },
                getProviderTypeEnum : function () {
                    return {
                        HOME : 0,
                        EXTERNAL : 1,
                        CATALOG : 2
                    };
                },
                getCatalogTilePreviewTitle : function (oCatlaogTile) {
                    return oCatlaogTile.properties.title;
                },
                getCatalogTilePreviewSubtitle : function (oCatlaogTile) {
                    return oCatlaogTile.properties.subtitle;
                },
                getCatalogTileTargetURL : function (oCatlaogTile) {
                    return oCatlaogTile.properties.targetURL;
                },
                getTileTarget : function (oTile) {
                    var sUrlFromTileProperties;

                    if (oTile.properties) {
                        sUrlFromTileProperties = oTile.properties.href || oTile.properties.targetURL;
                    }
                    return oTile.target_url || sUrlFromTileProperties || "";
                }
            };
        };

        oGetGroupsDataPromise = oAllMyAppsManager._getGroupsData();

        oGetGroupsDataPromise.done(function (oGetGroupsDataResponse) {
            ok(oGetGroupsDataResponse.length === 4, "4 groups returned, the 4th group is not included");
            ok(oGetGroupsDataResponse[0].title === "Group 0", "First group is correct");
            ok(oGetGroupsDataResponse[2].title === "Group 2", "Third group is correct");
            ok(oGetGroupsDataResponse[0].apps.length === 2, "First group contains 2 tiles");
            ok(oGetGroupsDataResponse[0].apps[0].title === "WEB GUI", "First group: 1st tile title correct");
            ok(oGetGroupsDataResponse[0].apps[1].title === "Opens WEB GUI", "First group: 2nd tile title correct");
            ok(oGetGroupsDataResponse[0].apps[0].url === "#Action-WEBGUI", "First group's tile utl correct");

            ok(oGetGroupsDataResponse[2].title === "Group 2", "Last group title correct");

        });

        sap.ushell.Container.getService = oOriginalGetService;
    });

    test("test _handleExternalProvidersData", function () {
        var oOriginalGetService = sap.ushell.Container.getService,
            aExternalProviders;

        sap.ushell.Container.getService = function () {
            return {
                getDataProviders : function () {
                    return oAllMyAppsGetDataProvidersResponse;
                },
                getProviderTypeEnum : function () {
                    return {
                        HOME : 0,
                        EXTERNAL : 1,
                        CATALOG : 2
                    };
                }
            };
        };

        oAllMyAppsManager._handleExternalProvidersData();

        ok(oAllMyAppsManager.oModel.getProperty("/AppsData").length === 2, "Two External providers inserted to the model");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].title === "ExternalProvider0", "1st provider title is ExternalProvider0");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[0].groups.length === 2, "1st provider has two groups");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[1].title === "ExternalProvider1", "2nd provider title is ExternalProvider1");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData")[1].groups.length === 2, "2nd provider has two groups");

        sap.ushell.Container.getService = oOriginalGetService;
    });

    test("test _addCatalogToModel", function () {
        var oOriginalGetService = sap.ushell.Container.getService,
            oDeferred;

        sap.ushell.Container.getService = function () {
            return {
                getCatalogTitle : function (oCatalog) {
                    return oCatalog.title;
                },
                getCatalogTiles: function (oCatalog) {
                    oDeferred = new jQuery.Deferred();
                    oDeferred.resolve(oCatalog.tiles);
                    return oDeferred.promise();
                },
                getProviderTypeEnum : function () {
                    return {
                        HOME : 0,
                        EXTERNAL : 1,
                        CATALOG : 2
                    };
                },
                isTileIntentSupported : function (oTile) {
                    return oTile.id !== "Tile_Intent_not_supported";
                },
                getCatalogTilePreviewTitle : function (oCatlaogTile) {
                    return oCatlaogTile.properties.title;
                },
                getCatalogTilePreviewSubtitle : function (oCatlaogTile) {
                    return oCatlaogTile.properties.subtitle;
                },
                getCatalogTileTargetURL : function (oCatlaogTile) {
                    return oCatlaogTile.properties.targetURL;
                }
            };
        };

        oAllMyAppsManager._addCatalogToModel(oCatalog0);
        oAllMyAppsManager._addCatalogToModel(oCatalog1);
        oAllMyAppsManager._addCatalogToModel(oCatalog2);

        ok(oAllMyAppsManager.oModel.getProperty("/AppsData").length === 2, "Two catalog providers inserted to the model");

        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/type") === sap.ushell.Container.getService("AllMyApps").getProviderTypeEnum().CATALOG, "First data_source (catalog) in the model is of type CATALOG");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/title") === "Catalog 0", "First data_source (catalog) in the model has title: Catalog 0");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/apps").length === 1, "First data_source (catalog) in the model has one app");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/apps/0").title === "Catalog Tile 02", "data_source/catalog tile/app in the model is correct");

        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/1/type") === sap.ushell.Container.getService("AllMyApps").getProviderTypeEnum().CATALOG, "Second data_source (catalog) in the model is of type CATALOG");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/1/title") === "Catalog 1", "Second data_source (catalog) in the model has title: Catalog 1");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/1/apps").length === 2, "Second data_source (catalog) in the model has two apps");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/1/apps/0").title === "Catalog Tile 12", "First data_source/catalog tile/app in the model is correct");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/1/apps/1").title === "Catalog Tile 21", "Second data_source/catalog tile/app in the model is correct");

        sap.ushell.Container.getService = oOriginalGetService;
    });

    test("test _CustomTileToModel", function () {
        var oOriginalGetService = sap.ushell.Container.getService,
            oDeferred;

        sap.ushell.Container.getService = function () {
            return {
                getCatalogTitle : function (oCatalog) {
                    return oCatalog.title;
                },
                getCatalogTiles: function (oCatalog) {
                    oDeferred = new jQuery.Deferred();
                    oDeferred.resolve(oCatalog.tiles);
                    return oDeferred.promise();
                },
                getProviderTypeEnum : function () {
                    return {
                        HOME : 0,
                        EXTERNAL : 1,
                        CATALOG : 2
                    };
                },
                getCatalogTilePreviewTitle : function (oCatlaogTile) {
                    return oCatlaogTile.properties.title;
                },
                getCatalogTilePreviewSubtitle : function (oCatlaogTile) {
                    return oCatlaogTile.properties.subtitle;
                },
                isTileIntentSupported : function (oTile) {
                    return oTile.id !== "Tile_Intent_not_supported";
                },
                getCatalogTileTargetURL : function (oCatlaogTile) {
                    return oCatlaogTile.properties.targetURL;
                }
            };
        };

        //oCatalogTilesPromise = oLaunchPageService.getCatalogTiles(oCatalog);

        oAllMyAppsManager._addCatalogToModel(oCatalog3);

        ok(oAllMyAppsManager.oModel.getProperty("/AppsData").length === 1, "One catalog providers inserted to the model");

        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/type") === sap.ushell.Container.getService("AllMyApps").getProviderTypeEnum().CATALOG, "First data_source (catalog) in the model is of type CATALOG");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/title") === "Catalog 3 Custom", "First data_source (catalog) in the model has title: Catalog 3");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/apps").length === 1, "First data_source (catalog) in the model has one app");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0/apps/0").title === "Catalog Tile 32", "data_source/catalog tile/app in the model is correct");
        ok(oAllMyAppsManager.oModel.getProperty("/AppsData/0").numberCustomTiles === 1, "We should have One custom tile");

        sap.ushell.Container.getService = oOriginalGetService;
    });
}());

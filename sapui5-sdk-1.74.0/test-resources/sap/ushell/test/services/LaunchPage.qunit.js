// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.LaunchPage
 */
sap.ui.require([
    "sap/ushell/services/LaunchPage",
    "sap/ushell/test/utils",
    "sap/ushell/adapters/local/LaunchPageAdapter",
    "sap/ushell/Config",
    "sap/ushell/services/_ContentExtensionAdapterFactory/ContentExtensionAdapterConfig",
    "sap/ushell/services/_ContentExtensionAdapterFactory/FeaturedGroupConfig",
    "sap/ushell/resources"
], function (LaunchPage, testUtils, LaunchPageAdapter, Config, AdapterFactoryConfig, FeaturedGroupMock) {
    "use strict";
    /*global asyncTest, deepEqual, module, throws ok, start, strictEqual, test, sinon */

    var sUshellTestRootPath = jQuery.sap.getResourcePath("sap/ushell").replace("resources", "test-resources"),
        oLastStub,
        oGetMockAdapterConfigStub,
        oGetConfigAdaptersStub,
        oLaunchPageConfig = {
            config: {
                pathToLocalizedContentResources: sUshellTestRootPath + "/test/services/resources/resources.properties",
                groups: [{
                    id: "group_0",
                    title: "test_group1",
                    isPreset: true,
                    isVisible: true,
                    isGroupLocked: false,
                    tiles: [{
                        id: "9a6eb46c-2d10-3a37-90d8-8f49f60cb111",
                        title: "test_tile_header",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        keywords: ["test_keywords"],
                        properties: {
                            chipId: "catalogTile_1",
                            title: "test_tile_header",
                            subtitle: "test_sub_tile_header",
                            infoState: "Neutral",
                            info: "test_info",
                            icon: "sap-icon://travel-expense-report",
                            targetURL: "#Action-todefaultapp",
                            formFactor: "Desktop,Tablet,Phone"
                        }
                    },
                        {
                            id: "tile_001",
                            title: "test_tile_preview_api",
                            size: "1x1",
                            tileType: "sap.ushell.ui.tile.TileBase",
                            keywords: ["test_keywords"],
                            properties: {
                                chipId: "catalogTile_1",
                                infoState: "Neutral",
                                info: "test_info",
                                formFactor: "Desktop,Tablet,Phone"
                            }
                        },
                        {
                            id: "tile_787",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            isLink: true,
                            properties: {
                                text: "I am a link!",
                                href: "#Action-todefaultapp"
                            }
                        },
                        {
                            id: "tile_777",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            isLink: true,
                            properties: {
                                text: "I am an external link!",
                                href: "http://www.google.com"
                            }
                        },
                        {
                            id: "tile_797",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            mode: "HeaderMode",
                            properties: {
                                title: "test_tile_header",
                                subtitle: "test_sub_tile_header"
                            }
                        },
                        {
                            id: "tile_807",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            mode: "ContentMode",
                            properties: {
                                title: "test_tile_header",
                                subtitle: "test_sub_tile_header"
                            }
                        }
                    ]
                }, {
                    id: "group_1",
                    title: "test_group2",
                    isPreset: true,
                    isVisible: true,
                    isGroupLocked: false,
                    tiles: [{}]
                }, {
                    id: "group_2",
                    title: "test_group3",
                    isPreset: true,
                    isVisible: true,
                    isGroupLocked: false,
                    tiles: [
                        {
                            id: "tile_102",
                            title: "Test component tile",
                            size: "1x1",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            moduleName: "sap.ushell.demo.demoTiles",
                            moduleType: "UIComponent",
                            namespace: "sap.ushell.demo.demoTiles",
                            path: sUshellTestRootPath + "/demoapps/demoTiles/",
                            properties: {
                                chipId: "catalogTile_38",
                                title: "Test component tile",
                                subtitle: "A tile wrapped in a component",
                                infoState: "Neutral",
                                info: "0 days running without bugs",
                                icon: "sap-icon://flight",
                                targetURL: "#Action-todefaultapp",
                                formFactor: "Desktop,Tablet"
                            }
                        },
                        {
                            id: "tile_103",
                            title: "Test view tile",
                            size: "1x1",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            moduleName: "sap.ushell.demo.demoTiles.TestViewTile",
                            moduleType: "JS",
                            namespace: "sap.ushell.demo.demoTiles",
                            path: sUshellTestRootPath + "/demoapps/demoTiles/",
                            properties: {
                                chipId: "catalogTile_38",
                                title: "Test view tile",
                                subtitle: "A tile wrapped in a view",
                                infoState: "Neutral",
                                info: "0 days running without bugs",
                                icon: "sap-icon://flight",
                                targetURL: "#Action-todefaultapp",
                                formFactor: "Desktop,Tablet"
                            }
                        }
                    ]
                }, {
                    id: "group_3",
                    title: "test_group4",
                    isPreset: true,
                    isVisible: true,
                    isGroupLocked: true,
                    tiles: [{}]
                }, {
                    id: "group_4",
                    title: "test_group5",
                    isPreset: true,
                    isVisible: false,
                    isGroupLocked: true,
                    tiles: [{}]
                }],
                catalogs: [
                    {
                        id: "test_catalog_01",
                        title: "test_catalog1",
                        tiles: [{}]
                    }, {
                        id: "test_catalog_02",
                        title: "test_catalog2",
                        tiles: [{}]
                    }
                ]
            }
        },
        aAdditionalAdapterConfig = [{
            name: "feature",
            adapter: "sap.ushell.adapters.local.LaunchPageAdapter",
            config: "/core/home/featuredGroup/enable",
            system: {
                alias: "",
                platform: "local"
            },
            configHandler: function () {
                var bEnableFrequentCard = true,
                    bEnableRecentCard = true;
                return FeaturedGroupMock.getMockAdapterConfig(bEnableFrequentCard, bEnableRecentCard);
            }
        }],
        oFeatureGroupConfig = {
            groups: [{
                "id": "featuredArea",
                "contentProvider": "feature",
                "isPersonalizationLocked": function () {
                    return true;
                },
                "getTitle": function () {
                    return "Featured";
                },
                "title": "Featured",
                "isFeatured": true,
                "isPreset": true,
                "isVisible": true,
                "isDefaultGroup": false,
                "isGroupLocked": true,
                "tiles": [{
                    "id": "tile_00",
                    "contentProvider": "feature",
                    "type": "recent",
                    "title": "[FEATURED] Sales Performance",
                    "text": "[FEATURED] Sales Performance",
                    "size": "1x1",
                    "tileType": "sap.ushell.ui.tile.DynamicTile",
                    "isLinkPersonalizationSupported": false,
                    "keywords": ["sales", "performance"],
                    "formFactor": "Desktop,Tablet,Phone",
                    "serviceRefreshInterval": 10,
                    "actions": [{
                        "text": "Go To Sample App",
                        "icon": "sap-icon://action",
                        "targetURL": "#Action-toappnavsample"
                    }, {
                        "text": "Go to stackoverflow",
                        "icon": "sap-icon://action",
                        "targetURL": "http://stackoverflow.com/"
                    }, {
                        "text": "Illigal URL",
                        "icon": "sap-icon://action",
                        "targetURL": "stackoverflow.com/"
                    }, {
                        "text": "Callback action",
                        "icon": "sap-icon://action-settings"
                    }],
                    "chipId": "catalogTile_33",
                    "properties": {
                        "title": "[FEATURED] Sales Performance",
                        "numberValue": 3.75,
                        "info": "Change to Last Month in %",
                        "numberFactor": "%",
                        "numberDigits": 2,
                        "numberState": "Positive",
                        "stateArrow": "Up",
                        "icon": "sap-icon://Fiori2/F0002",
                        "targetURL": "#Action-toappnavsample"
                    }
                }, {
                    "id": "tile_shelluiservicesample",
                    "contentProvider": "feature",
                    "type": "frequent",
                    "title": "[FEATURED] ShellUIService Sample App",
                    "size": "1x1",
                    "tileType": "sap.ushell.ui.tile.StaticTile",
                    "isLinkPersonalizationSupported": true,
                    "formFactor": "Desktop,Tablet",
                    "chipId": "catalogTile_45",
                    "properties": {
                        "title": "[FEATURED] Sample App for ShellUIService",
                        "text": "[FEATURED] Sample App for ShellUIService",
                        "subtitle": "",
                        "infoState": "Neutral",
                        "info": "#Action-toappshelluiservicesample",
                        "icon": "sap-icon://syringe",
                        "targetURL": "#Action-toappshelluiservicesample"
                    }
                }]
            }]
        };

    [
        {
            testDescription: "when enableFeaturedGroup is true",
            input: {
                enableFeaturedGroup: true
            },
            output: {
                numberOfFeaturedGroups: 1
            }
        },
        {
            testDescription: "when enableFeaturedGroup is false",
            input: {
                enableFeaturedGroup: false
            },
            output: {
                numberOfFeaturedGroups: 0
            }
        }
    ].forEach(function (oFixture) {

        module("sap.ushell.services.LaunchPage " + oFixture.testDescription, {

            beforeEach: function (assert) {
                oLastStub = sinon.stub(Config, 'last');
                oLastStub.withArgs("/core/spaces/enabled").returns(false);
                oLastStub.returns(oFixture.input.enableFeaturedGroup);

                oGetMockAdapterConfigStub = sinon.stub(FeaturedGroupMock, "getMockAdapterConfig").returns(
                    oFeatureGroupConfig
                );
                oGetConfigAdaptersStub = sinon.stub(AdapterFactoryConfig, "_getConfigAdapters").returns(
                    aAdditionalAdapterConfig
                );
            },
            teardown: function () {
                testUtils.restoreSpies(
                );
                oLastStub.restore();
                oGetMockAdapterConfigStub.restore();
                oGetConfigAdaptersStub.restore();
            }
        });

        test("addBookmark failures", function () {
            var oLaunchPageService = new LaunchPage();

            // code under test and tests
            throws(function () {
                oLaunchPageService.addBookmark();
            });
            throws(function () {
                oLaunchPageService.addBookmark("Test");
            });
            throws(function () {
                oLaunchPageService.addBookmark({});
            }, /Title missing in bookmark configuration/);
            throws(function () {
                oLaunchPageService.addBookmark({title: ""});
            }, /Title missing in bookmark configuration/);
            throws(function () {
                oLaunchPageService.addBookmark({title: "MyTitle"});
            }, /URL missing in bookmark configuration/);
        });

        test("addBookmark success", function () {
            var oActualPromise,
                oBookmarkConfig = { title: "MyTitle", url: "MyUrl" },
                oLaunchPageAdapter = {
                    addBookmark: sinon.stub().returns(new jQuery.Deferred().promise())
                },
                oLaunchPageService;

            // prepare test
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // code under test
            oActualPromise = oLaunchPageService.addBookmark(oBookmarkConfig);

            // test
            ok(oLaunchPageAdapter.addBookmark.calledOnce);
            ok(oLaunchPageAdapter.addBookmark.calledWith(oBookmarkConfig));
            strictEqual(oActualPromise, oLaunchPageAdapter.addBookmark.returnValues[0]);
        });

        test("setTileVisible", function () {
            var oTile = {},
                oLaunchPageAdapter = {
                    setTileVisible: sinon.spy()
                },
                oLaunchPageService;

            // prepare test
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // code under test
            oLaunchPageService.setTileVisible(oTile, true);

            // test
            ok(oLaunchPageAdapter.setTileVisible.calledOnce);
            ok(oLaunchPageAdapter.setTileVisible.calledWithExactly(oTile, true));
        });

        test("getCatalogError", function () {
            var oCatalog = {},
                oLaunchPageAdapter = {
                    getCatalogError: sinon.stub().returns("foo")
                },
                oLaunchPageService;

            // prepare test
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // code under test
            strictEqual(oLaunchPageService.getCatalogError(oCatalog), "foo");

            // test
            ok(oLaunchPageAdapter.getCatalogError.calledOnce);
            ok(oLaunchPageAdapter.getCatalogError.calledWithExactly(oCatalog));
        });

        test("isTileIntentSupported", function () {
            var oTile = {},
                oLaunchPageAdapter = {
                    isTileIntentSupported: sinon.stub().returns("foo") // deliberately no boolean
                },
                oLaunchPageService;

            // part 1: unsupported in adapter
            oLaunchPageService = new LaunchPage({});
            strictEqual(oLaunchPageService.isTileIntentSupported(oTile), true);

            // part 2: delegates to adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            strictEqual(oLaunchPageService.isTileIntentSupported(oTile), "foo");
            ok(oLaunchPageAdapter.isTileIntentSupported.calledOnce);
            ok(oLaunchPageAdapter.isTileIntentSupported.calledWithExactly(oTile));
        });

        test("getCardManifest", function () {
            var oCard = {},
                oLaunchPageAdapter = {
                    getCardManifest: sinon.stub().returns("Manifest")
                },
                oLaunchPageService;

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            strictEqual(oLaunchPageService.getCardManifest(oCard), "Manifest");
            ok(oLaunchPageAdapter.getCardManifest.calledOnce);
            ok(oLaunchPageAdapter.getCardManifest.calledWithExactly(oCard));
        });

        test("isGroupVisible", function () {
            var oGroup = {},
                oLaunchPageAdapter = {
                    isGroupVisible: sinon.stub().returns("visible")
                },
                oLaunchPageService;

            // part 1: unsupported in adapter - default value received from the service directly
            oLaunchPageService = new LaunchPage({});
            strictEqual(oLaunchPageService.isGroupVisible(oGroup), true);

            // part 2: delegates to adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            strictEqual(oLaunchPageService.isGroupVisible(oGroup), "visible");
            ok(oLaunchPageAdapter.isGroupVisible.calledOnce);
            ok(oLaunchPageAdapter.isGroupVisible.calledWithExactly(oGroup));
        });

        test("isGroupLocked", function () {
            var oGroup = {},
                oLaunchPageAdapter = {
                    isGroupLocked: sinon.stub().returns("foo")
                },
                oLaunchPageService;

            // part 1: unsupported in adapter - default value received from the service directly
            oLaunchPageService = new LaunchPage({});
            strictEqual(oLaunchPageService.isGroupLocked(oGroup), false);

            // part 2: delegates to adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            strictEqual(oLaunchPageService.isGroupLocked(oGroup), "foo");
            ok(oLaunchPageAdapter.isGroupLocked.calledOnce);
            ok(oLaunchPageAdapter.isGroupLocked.calledWithExactly(oGroup));
        });

        test("hideGroups", function () {
            var aGroups = [],
                oLaunchPageAdapter = {
                    hideGroups: sinon.stub().returns({
                        fail: function (f) {},
                        done: function (f) { return this; }
                    })
                },
                oLaunchPageService;

            // part 1: unsupported in adapter - A deferred object is expected which is in failed status
            oLaunchPageService = new LaunchPage({});
            var oDeferred = oLaunchPageService.hideGroups([]);
            strictEqual(oDeferred.state(), "rejected");

            // part 2: delegates to adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.hideGroups(aGroups);
            ok(oLaunchPageAdapter.hideGroups.calledOnce);
            ok(oLaunchPageAdapter.hideGroups.calledWithExactly(aGroups));
        });

        test("getCatalogData", function () {
            var oCatalog = {},
                oResult = {},
                oLaunchPageAdapter,
                oLaunchPageService,
                oLogMock = testUtils.createLogMock()
                    .filterComponent("sap.ushell.services.LaunchPage")
                    .warning("getCatalogData not implemented in adapter", null,
                        "sap.ushell.services.LaunchPage");

            // part 1: unsupported in adapter
            oLaunchPageService = new LaunchPage({
                getCatalogId: function (oCatalog0) {
                    strictEqual(oCatalog0, oCatalog);
                    return "foo";
                }
            });
            deepEqual(oLaunchPageService.getCatalogData(oCatalog), {id: "foo"});
            oLogMock.verify();

            // part 2: delegates to adapter
            oLaunchPageAdapter = {
                getCatalogData: sinon.stub().returns(oResult)
            };
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            strictEqual(oLaunchPageService.getCatalogData(oCatalog), oResult);
            ok(oLaunchPageAdapter.getCatalogData.calledOnce);
            ok(oLaunchPageAdapter.getCatalogData.calledWithExactly(oCatalog));
        });

        test("test countBookmarks", function () {
            var oActualPromise,
                oExpectedPromise = (new jQuery.Deferred()).promise(),
                oLaunchPageAdapter = {
                    countBookmarks: sinon.stub().returns(oExpectedPromise)
                },
                oLaunchPageService;

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            throws(function () {
                oLaunchPageService.countBookmarks();
            }, /Missing URL/);
            throws(function () {
                oLaunchPageService.countBookmarks("");
            }, /Missing URL/);
            throws(function () {
                oLaunchPageService.countBookmarks({});
            }, /Missing URL/);
            ok(oLaunchPageAdapter.countBookmarks.notCalled);

            oActualPromise = oLaunchPageService.countBookmarks("###");

            strictEqual(oActualPromise, oExpectedPromise);
            ok(oLaunchPageAdapter.countBookmarks.calledOnce);
            strictEqual(oLaunchPageAdapter.countBookmarks.args[0][0], "###");
        });

        test("test deleteBookmarks", function () {
            var oActualPromise,
                oExpectedPromise = (new jQuery.Deferred()).promise(),
                oLaunchPageAdapter = {
                    deleteBookmarks: sinon.stub().returns(oExpectedPromise)
                },
                oLaunchPageService;

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            throws(function () {
                oLaunchPageService.deleteBookmarks();
            }, /Missing URL/);
            throws(function () {
                oLaunchPageService.deleteBookmarks("");
            }, /Missing URL/);
            throws(function () {
                oLaunchPageService.deleteBookmarks({});
            }, /Missing URL/);
            ok(oLaunchPageAdapter.deleteBookmarks.notCalled);

            oActualPromise = oLaunchPageService.deleteBookmarks("###");

            strictEqual(oActualPromise, oExpectedPromise);
            ok(oLaunchPageAdapter.deleteBookmarks.calledOnce);
            strictEqual(oLaunchPageAdapter.deleteBookmarks.args[0][0], "###");
        });

        test("test updateBookmarks", function () {
            var oActualPromise,
                oExpectedPromise = (new jQuery.Deferred()).promise(),
                oLaunchPageAdapter = {
                    updateBookmarks: sinon.stub().returns(oExpectedPromise)
                },
                oLaunchPageService,
                oParameters = {
                    url: "foo"
                };

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            throws(function () {
                oLaunchPageService.updateBookmarks();
            }, /Missing URL/);
            throws(function () {
                oLaunchPageService.updateBookmarks("");
            }, /Missing URL/);
            throws(function () {
                oLaunchPageService.updateBookmarks({});
            }, /Missing URL/);
            throws(function () {
                oLaunchPageService.updateBookmarks("foo");
            }, /Missing parameters/);
            throws(function () {
                oLaunchPageService.updateBookmarks("foo", true);
            }, /Missing parameters/);
            ok(oLaunchPageAdapter.updateBookmarks.notCalled);

            oActualPromise = oLaunchPageService.updateBookmarks("###", oParameters);

            strictEqual(oActualPromise, oExpectedPromise);
            ok(oLaunchPageAdapter.updateBookmarks.calledOnce);
            strictEqual(oLaunchPageAdapter.updateBookmarks.args[0][0], "###");
            strictEqual(oLaunchPageAdapter.updateBookmarks.args[0][1], oParameters);
        });

        test("Tile actions", function () {
            var oTile = {},
                aInternalActions,
                aExternalActions1,
                aExternalActions2,
                oLaunchPageAdapter,
                oLaunchPageService;



            // part 1: no actions
            oLaunchPageAdapter = {};
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            deepEqual(oLaunchPageService.getTileActions(oTile), []);

            // part 2: internal actions
            aInternalActions = [{text: "InternalAction1"}, {text: "InternalAction2"}];
            oLaunchPageAdapter = {
                getTileActions: sinon.stub().returns(aInternalActions)
            };
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            deepEqual(oLaunchPageService.getTileActions(oTile), aInternalActions);
            ok(oLaunchPageAdapter.getTileActions.calledWithExactly(oTile));

            // part 3: external actions
            aExternalActions1 = [{text: "ExternalAction11"}, {text: "ExternalAction12"}];
            aExternalActions2 = [{text: "ExternalAction21"}, {text: "ExternalAction22"}];
            oLaunchPageAdapter = {};
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions1));
            oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions2));

            deepEqual(oLaunchPageService.getTileActions(oTile), aExternalActions1.concat(aExternalActions2));


            // part 4: internal and external actions
            aInternalActions = [{text: "InternalAction1"}, {text: "InternalAction2"}];
            oLaunchPageAdapter = {
                getTileActions: sinon.stub().returns(aInternalActions)
            };
            aExternalActions1 = [{text: "ExternalAction11"}, {text: "ExternalAction12"}];
            aExternalActions2 = [{text: "ExternalAction21"}, {text: "ExternalAction22"}];
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions1));
            oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions2));

            deepEqual(oLaunchPageService.getTileActions(oTile), aInternalActions.concat(aExternalActions1.concat(aExternalActions2)));

            ok(oLaunchPageAdapter.getTileActions.calledWithExactly(oTile));
        });

        test("getCatalogTileTargetURL", function () {
            var oLaunchPageService,
                sTargetUrl,
                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // part 1: TargetUrl exist in configuration
            sTargetUrl = oLaunchPageService.getCatalogTileTargetURL(oLaunchPageConfig.config.groups[0].tiles[0]);
            strictEqual(sTargetUrl, oLaunchPageConfig.config.groups[0].tiles[0].properties.targetURL, "TargetUrl as expected");

            // part 2: TargetUrl does not exist in configuration
            sTargetUrl = oLaunchPageService.getCatalogTileTargetURL(oLaunchPageConfig.config.groups[0].tiles[1]);
            strictEqual(sTargetUrl, null, "TargetUrl default value is null");

        });

        test("getCatalogTilePreviewTitle", function () {
            var oLaunchPageService,
                sPreviewTitle,
                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // part 1: Title exist in configuration
            sPreviewTitle = oLaunchPageService.getCatalogTilePreviewTitle(oLaunchPageConfig.config.groups[0].tiles[0]);
            strictEqual(sPreviewTitle, oLaunchPageConfig.config.groups[0].tiles[0].properties.title, "Preview title as expected");

            // part 2: Title does not exist in configuration
            sPreviewTitle = oLaunchPageService.getCatalogTilePreviewTitle(oLaunchPageConfig.config.groups[0].tiles[1]);
            strictEqual(sPreviewTitle, null, "Preview title default value is null");

        });

        test("getCatalogTilePreviewInfo", function () {
            // Arrange
            var oLaunchPageService,
                sPreviewInfo,
                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // Act
            sPreviewInfo = oLaunchPageService.getCatalogTilePreviewInfo(oLaunchPageConfig.config.groups[0].tiles[0]);

            // Assert
            strictEqual(sPreviewInfo, oLaunchPageConfig.config.groups[0].tiles[0].properties.info, "The function getCatalogTilePreviewInfo returns the correct catalog tile preview info.");
        });

        test("getCatalogTilePreviewSubtitle", function () {
            var oLaunchPageService,
                sPreviewSubtitle,
                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // part 1: Title exist in configuration
            sPreviewSubtitle = oLaunchPageService.getCatalogTilePreviewSubtitle(oLaunchPageConfig.config.groups[0].tiles[0]);
            strictEqual(sPreviewSubtitle, oLaunchPageConfig.config.groups[0].tiles[0].properties.subtitle, "Preview subtitle as expected");

            // part 2: Title does not exist in configuration
            sPreviewSubtitle = oLaunchPageService.getCatalogTilePreviewSubtitle(oLaunchPageConfig.config.groups[0].tiles[1]);
            strictEqual(sPreviewSubtitle, null, "Preview subtitle default value is null");

        });

        test("getCatalogTilePreviewIcon", function () {
            var oLaunchPageService,
                sPreviewIcon,
                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

            // part 1: Title exist in configuration
            sPreviewIcon = oLaunchPageService.getCatalogTilePreviewIcon(oLaunchPageConfig.config.groups[0].tiles[0]);
            strictEqual(sPreviewIcon, oLaunchPageConfig.config.groups[0].tiles[0].properties.icon, "Preview icon as expected");

            // part 2: Title does not exist in configuration
            sPreviewIcon = oLaunchPageService.getCatalogTilePreviewIcon(oLaunchPageConfig.config.groups[0].tiles[1]);
            strictEqual(sPreviewIcon, null, "Preview icon default value is null");

        });

        asyncTest("getCatalogWithTranslation", function () {
            var oLaunchPageService,

            oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.getCatalogs().done(function (aCatalogs) {
                start();
                strictEqual(aCatalogs[0].title, "Translated Catalog 1", "Correct catalog [0] title");
                strictEqual(aCatalogs[1].title, "Translated Catalog 2", "Correct catalog [1] title");
            });
        });

        asyncTest("getGroupsWithTranslation", function () {
            var oLaunchPageService,

                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            // part 1: unsupported in adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.getGroups().done(function (aGroups) {
                start();
                strictEqual(aGroups[0].title, "Translated Group 1", "Group translation error for aGroups[0].title");
                strictEqual(aGroups[1].title, "Translated Group 2", "Group translation error for aGroups[1].title");
            });
        });

        asyncTest("getGroupsWithFeatureGroup", function () {

            var iNumFeaturedGroups,

                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig),
                oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
                oLaunchPageService.getGroups().done(function (aGroups) {
                    start();
                    iNumFeaturedGroups = aGroups.filter(function (oGroup) {
                        return oGroup.contentProvider === "feature";
                    }).length;
                    strictEqual(iNumFeaturedGroups, oFixture.output.numberOfFeaturedGroups, "feature group loaded");
            });
        });

        asyncTest("getViewDataWithTranslation", function () {
            var oLaunchPageService,

                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            // part 1: unsupported in adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[0].tiles[0]).done(function (oView) {
                start();
                strictEqual(oView.getProperty("title"), "Translated Header title", "Translated title check");
                strictEqual(oView.getProperty("subtitle"), "Translated Sub Title", "Translated Sub Title");
                strictEqual(oView.getProperty("info"), "Translated Info", "Translated Info");
                strictEqual(oLaunchPageConfig.config.groups[0].tiles[0].keywords[0], "Translated Keyword", "Translated keywords");
            });

        });

        asyncTest("getViewForComponentTile", function () {
            var oLaunchPageService,

                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            // part 1: unsupported in adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[2].tiles[0]).done(function (oTileUI) {
                start();
                ok(oTileUI.getMetadata().getName() === "sap.ui.core.ComponentContainer", "Module path registered and Component wrapped with ComponentContainer");
            });

        });

        asyncTest("getViewForViewTileTile", function () {
            var oLaunchPageService,

                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
            // part 1: unsupported in adapter
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[2].tiles[1]).done(function (oTileUI) {
                start();
                ok(oTileUI.getMetadata().getName() === "sap.ui.core.mvc.JSView", "Modelu path registered and View tile retreived");
            });

        });

        asyncTest("getViewForHeaderModeTile", function () {
            var oLaunchPageService,
                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[0].tiles[4]).done(function (oTileUI) {
                start();
                ok(oTileUI.getProperty("mode") === "HeaderMode", "Tile is in Header Mode");
            });
        });

        asyncTest("getViewForContentModeTile", function () {
            var oLaunchPageService,
                oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[0].tiles[5]).done(function (oTileUI) {
                start();
                ok(oTileUI.getProperty("mode") === "ContentMode", "Tile is in Content Mode");
            });
        });

        test("isLinkPersonalizationSupported", function () {
            var oTile = {},
                oLaunchPageAdapter = {
                    isLinkPersonalizationSupported: sinon.stub().returns(true)
                },
                oLaunchPageService;

            oLaunchPageService = new LaunchPage({});
            strictEqual(oLaunchPageService.isLinkPersonalizationSupported(oTile), false);

            oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            strictEqual(oLaunchPageService.isLinkPersonalizationSupported(oTile), true);
            ok(oLaunchPageAdapter.isLinkPersonalizationSupported.calledOnce);
            ok(oLaunchPageAdapter.isLinkPersonalizationSupported.calledWithExactly(oTile));
        });

        test("getCatalogTileView", function () {
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig),
            oLaunchPageService = new LaunchPage(oLaunchPageAdapter),
            oTileData = {
                namespace: undefined,
                path: undefined,
                moduleType: undefined,
                tileType: "tileTypePart1.tileTypePart2.tileTypePart3",
                properties: {
                    title: "title",
                    subtitle: "subTitle",
                    info: "info",
                    targetURL: "#a-b"
                }
            },
            oView,
            oViewConstructor = function (oProps) {
                var oViewObject = {
                    oViewProperties: oProps
                };

                return oViewObject;
            },
            oHandleTilePressStub = sinon.stub(oLaunchPageAdapter, "_handleTilePress").returns({}),
            oApplyDynamicTileIfoStateStub = sinon.stub(oLaunchPageAdapter, "_applyDynamicTileIfoState").returns({}),
            oJQuaryRequireStub = sinon.stub(jQuery.sap, "require"),
            oJQuaryGetObjectStub = sinon.stub(jQuery.sap, "getObject").callsFake( function (sObjectPath) {
                if (sObjectPath === "tileTypePart1.tileTypePart2.tileTypePart3") {
                    return oViewConstructor;
                }
            }),
            oRiginalSapUiRequire = sap.ui.require;

            sap.ui.require = sinon.spy();

            oView = oLaunchPageService.getCatalogTileView(oTileData);

            ok(sap.ui.require.called, "sap.ui.require is called");
            ok(sap.ui.require.args[sap.ui.require.args.length - 1][0] === "tileTypePart1/tileTypePart2/tileTypePart3", "sap.ui.require called for the view path tileTypePart1/tileTypePart2/tileTypePart3");

            ok(oJQuaryGetObjectStub.calledTwice === true, "sap.ui.getObject calledTwice");
            ok(oJQuaryGetObjectStub.args[0][0] === "tileTypePart1.tileTypePart2.tileTypePart3", "1st call to sap.ui.getObject for tileTypePart1.tileTypePart2.tileTypePart3");
            ok(oJQuaryGetObjectStub.args[1][0] === "tileTypePart1.tileTypePart2.tileTypePart3", "2nd call to sap.ui.getObject for tileTypePart1.tileTypePart2.tileTypePart3");

            ok(oHandleTilePressStub.calledOnce === true, "_handleTilePressStub called once");
            ok(oApplyDynamicTileIfoStateStub.calledOnce === true, "_applyDynamicTileIfoState called once");
            ok(oView.oViewProperties.title === "title", "Returned view title is correct");

            sap.ui.require = oRiginalSapUiRequire;
            oJQuaryRequireStub.restore();
            oJQuaryGetObjectStub.restore();
            oHandleTilePressStub.restore();
            oApplyDynamicTileIfoStateStub.restore();
        });

        asyncTest("getCatalogTileViewControl", function () {
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig),
                oLaunchPageService = new LaunchPage(oLaunchPageAdapter),
                oTileData = {
                    namespace: undefined,
                    path: undefined,
                    moduleType: undefined,
                    tileType: "tileTypePart1.tileTypePart2.tileTypePart3",
                    properties: {
                        title: "title",
                        subtitle: "subTitle",
                        info: "info",
                        targetURL: "#a-b"
                    }
                },
                oViewConstructor = function (oProps) {
                    var oViewObject = {
                        oViewProperties: oProps
                    };

                    return oViewObject;
                },
                oOrigRequire = sap.ui.require,
                oGetImageContentStub = sinon.stub(oLaunchPageAdapter, "_getImageContent").returns({
                    addStyleClass: function () {}
                }),
                oRequireStub = sinon.stub(sap.ui, "require").callsFake( function (aRequirePath, fCallback) {
                    fCallback(oViewConstructor);
                }),
                oHandleTilePressStub = sinon.stub(oLaunchPageAdapter, "_handleTilePress").returns({}),
                oApplyDynamicTileIfoState = sinon.stub(oLaunchPageAdapter, "_applyDynamicTileIfoState").returns({});

            oLaunchPageService.getCatalogTileViewControl(oTileData).done(function (oView) {
                start();

                ok(oRequireStub.callCount === 1, "sap.ui.require called");
                ok(oRequireStub.args[0][0][0] === "tileTypePart1/tileTypePart2/tileTypePart3", "sap.ui.require called for tileTypePart1/tileTypePart2/tileTypePart3");
                ok(oHandleTilePressStub.calledOnce === true, "_handleTilePressStub called once");
                ok(oApplyDynamicTileIfoState.calledOnce === true, "_applyDynamicTileIfoState called once");
                ok(oView.oViewProperties.title === "title", "Returned view title is correct");

                sap.ui.require = oOrigRequire;
                oGetImageContentStub.restore();
                oHandleTilePressStub.restore();
                oApplyDynamicTileIfoState.restore();
            });
        });

        test("getCatalogTileViewRedirect", function () {
            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig),
                oLaunchPageService = new LaunchPage(oLaunchPageAdapter),
                oGetCatalogTileViewStub;

            oLaunchPageAdapter.getCatalogTileViewControl = undefined;

            oGetCatalogTileViewStub = sinon.stub(oLaunchPageAdapter, "getCatalogTileView").returns({text: "viewText"});

            oLaunchPageService.getCatalogTileViewControl().done(function (obj) {
                ok(oLaunchPageAdapter.getCatalogTileView.calledOnce === true, "When adapter function getCatalogTileViewControl does not exist - getCatalogTileView is called");
                ok(obj.text === "viewText", "Correct returned object");
                oGetCatalogTileViewStub.restore();
            });
        });
    });

    asyncTest("getGroupsForBookmarks when part of the groups are locked or not visable", function () {

        var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig),
        oLaunchPageService = new LaunchPage(oLaunchPageAdapter);

        oLaunchPageService.getGroupsForBookmarks().done(function (aGroups) {
            start();

            strictEqual(aGroups.length, 3, "groups were filtered correctly");
            strictEqual(aGroups[0].title, "My Home", "title was changed correctly");
        });
    });

    module("getGroups", function () {
        asyncTest("getGroups with pages enabled should return a promise resolving to an empty array",  function() {
            var oConfigStub = sinon.stub(Config, "last");
            oConfigStub.withArgs("/core/spaces/enabled").returns(true);

            var oLaunchPageAdapter = new LaunchPageAdapter(undefined, undefined, oLaunchPageConfig),
                oLaunchPageService = new LaunchPage(oLaunchPageAdapter);
            oLaunchPageService.getGroups().done(function (aGroups) {
                strictEqual(aGroups.length, 0, "an empty array is returned");
                start();
            });
        });
    });
});
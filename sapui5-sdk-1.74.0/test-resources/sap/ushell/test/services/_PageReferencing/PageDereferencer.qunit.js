// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for module "PageDereferencer" in "sap.ushell.services._PageReferencing"
 * "
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.require([
    "sap/ushell/services/_PageReferencing/PageDereferencer",
    "sap/ushell/services/_PageReferencing/AppForInbound"
], function (PageDereferencer, AppForInbound) {
    "use strict";

    QUnit.start();

    QUnit.module("The function dereference", {
        beforeEach: function () {
            this.oGetSiteInfoStub = sinon.stub(PageDereferencer, "_getSiteInfo").returns("siteInfo");
            this.oGetGroupsStub = sinon.stub(PageDereferencer, "_getGroups").returns("groups");
            this.oGetVisualizationsStub = sinon.stub(PageDereferencer, "_getVisualizations").returns("visualizations");
            this.oGetApplicationsStub = sinon.stub(PageDereferencer, "_getApplications").returns("applications");
        },
        afterEach: function () {
            this.oGetSiteInfoStub.restore();
            this.oGetGroupsStub.restore();
            this.oGetVisualizationsStub.restore();
            this.oGetApplicationsStub.restore();
        }
    });

    QUnit.test("Gets a site containing a site information, groups, visualizations, applications and viztypes", function (assert) {
        // Arrange
        var oNavigationData = {
            inbounds: [
                {
                    "id": "1",
                    "semanticObject": "semanticObject",
                    "action": "action",
                    "permanentKey": "permanent-key-1"
                },
                {
                    "id": "2",
                    "semanticObject": "semanticObject2",
                    "action": "action2",
                    "permanentKey": "permanent-key-2"
                }
            ],
            systemAliases: {
                "AAA": {},
                "BBB": {}
            }
        };

        var oPage = {
            id: "id",
            title: "title",
            description: "description",
            sections: [
                {
                    id: "group1",
                    title: "group1 title",
                    visualizations: [
                        {
                            inboundPermanentKey: "inbound-permanent-key-1",
                            vizId: "<visualization-id = ABAP-catalog-tile-id + inbound-permanent-key>"
                        }
                    ]
                },
                {
                    id: "group2",
                    title: "group2 title",
                    visualizations: [
                        {
                            inboundPermanentKey: "inbound-permanent-key-2",
                            vizId: "<visualization-id = ABAP-catalog-tile-id + inbound-permanent-key>"
                        }
                    ]
                }
            ]
        };

        // Act
        var oSite = PageDereferencer.dereference(oPage, {}, oNavigationData);

        // Assert
        assert.strictEqual(oSite.site, "siteInfo", "A site info gets created (via this._createSiteInfo).");
        assert.strictEqual(oSite.groups, "groups", "Groups get created (via this._createGroups).");
        assert.strictEqual(oSite.visualizations, "visualizations", "Visualizations get created (this._createGroupsVisualizations).");
        assert.strictEqual(oSite.applications, "applications", "Apps get created (this._createApplications).");
        assert.strictEqual(this.oGetApplicationsStub.getCall(0).args[0]["permanent-key-1"].id, "1", "A navigation hashmap has been created.");
        assert.strictEqual(Object.keys(this.oGetApplicationsStub.getCall(0).args[0]).length, 2, "The navigation hashmap has 2 properties.");
        assert.deepEqual(oSite.systemAliases, oNavigationData.systemAliases, "The system aliases are added to the site.");
        assert.notStrictEqual(oSite.systemAliases, oNavigationData.systemAliases, "The system aliases are copied from the navigation data to the site.");
        assert.ok(oSite.vizTypes[PageDereferencer._VISUALIZATION_TYPES.PLATFORM_VISUALIZATION], "The platform visualization type is added to the site");
    });

    QUnit.module("The function _getSiteInfo");

    QUnit.test("Gets an identification section from the page passed on", function (assert) {
        var oPage = {
            id: "id",
            title: "title",
            description: "description",
            sections: [
                {
                    id: "group1",
                    title: "group1 title",
                    visualizations: [
                        {
                            inboundPermanentKey: "inbound-permanent-key-1",
                            vizId: "<visualization-id = ABAP-catalog-tile-id + inbound-permanent-key>"
                        }
                    ]
                },
                {
                    id: "group2",
                    title: "group2 title",
                    visualizations: [
                        {
                            inboundPermanentKey: "inbound-permanent-key-2",
                            vizId: "<visualization-id = ABAP-catalog-tile-id + inbound-permanent-key>"
                        }
                    ]
                }
            ]
        };


        var oSiteInfoExpected = {
            identification: {
                id: "id",
                title: "title",
                description: "description"
            },
            payload: {
                groupsOrder: [
                    "group1",
                    "group2"
                ]
            }
        };

        // Act
        var oSiteInfo = PageDereferencer._getSiteInfo(oPage);

        // Assert
        assert.deepEqual(oSiteInfo, oSiteInfoExpected, "Page site info is taken over from page correctly.");
        assert.notStrictEqual(oSiteInfo.payload.groupsOrder, oSiteInfoExpected.payload.groupsOrder, "Groups order is a copy of the page segment.");
    });

    QUnit.test("Still works if some properties have no value", function (assert) {
        // Arrange
        var oPage = {
            id: undefined,
            title: undefined,
            description: undefined,
            sections: []
        };

        var oSiteInfoExpected = {
            identification: {
                id: undefined,
                title: undefined,
                description: undefined
            },
            payload: {
                groupsOrder: [
                ]
            }
        };

        // Act
        var oSiteInfo = PageDereferencer._getSiteInfo(oPage);

        // Assert
        assert.deepEqual(oSiteInfo, oSiteInfoExpected, "Page site segment is calculated.");
    });

    QUnit.module("The function _getGroups", {});

    QUnit.test("Gets the groups section from the page passed on", function (assert) {
        // Arrange
        var oPage = {
            id: "id",
            title: "title",
            description: "description",
            sections: [
                {
                    id: "group1",
                    title: "group1 title",
                    visualizations: [
                        {
                            id: "id-1",
                            inboundPermanentKey: "inbound-permanent-key-1",
                            vizId: "visualization-id-1"
                        }
                    ]
                },
                {
                    id: "group2",
                    title: "group2 title",
                    visualizations: [
                        {
                            id: "id-2",
                            inboundPermanentKey: "inbound-permanent-key-2",
                            vizId: "visualization-id-2"
                        }
                    ]
                }
            ]
        };

        var oGroupsExpected = {
            "group1": {
                identification: {
                    id: "group1",
                    title: "group1 title",
                    locked: true,
                    isPreset: true
                },
                payload: {
                    tiles: [
                        {
                            id: "id-1",
                            vizId: "visualization-id-1"
                        }
                    ],
                    links: []
                }
            },
            "group2": {
                identification: {
                    id: "group2",
                    title: "group2 title",
                    locked: true,
                    isPreset: true
                },
                payload: {
                    tiles: [
                        {
                            id: "id-2",
                            vizId: "visualization-id-2"
                        }
                    ],
                    links: []
                }
            }
        };

        // Act
        var oGroups = PageDereferencer._getGroups(oPage);

        // Assert
        assert.deepEqual(oGroups, oGroupsExpected, "Page groups are taken over from page correctly.");
        assert.notStrictEqual(oGroups, oGroupsExpected, "Page groups is a copy of the page groups segment.");
    });

    QUnit.module("The function _getVisualizations", {
        beforeEach: function () {
            this.oCreateVisualizationStub = sinon.stub(PageDereferencer, "_getVisualization").returns({});
        },
        afterEach: function () {
            this.oCreateVisualizationStub.restore();
        }
    });

    QUnit.test("Gets the visualizations from the page, the visualization and navigation data handed over as parameters", function (assert) {
        // Arrange
        var oPage = {
            id: "id",
            title: "title",
            description: "description",
            sections: [
                {
                    id: "group1",
                    title: "group1 title",
                    visualizations: [
                        {
                            inboundPermanentKey: "inbound-permanent-key-1",
                            vizId: "visualization-id-1"
                        }
                    ]
                },
                {
                    id: "group2",
                    title: "group2 title",
                    visualizations: [
                        {
                            inboundPermanentKey: "inbound-permanent-key-2",
                            vizId: "visualization-id-2"
                        }
                    ]
                }
            ]
        };

        var oVisualizationsExpected = {
            "visualization-id-1": {},
            "visualization-id-2": {}
        };

        var oExpectedPageVisualizationParameter = {
            inboundPermanentKey: "inbound-permanent-key-1",
            vizId: "visualization-id-1"
        };

        // Act
        var oVisualizations = PageDereferencer._getVisualizations(oPage, { "Some-Visualization": {} }, { inbounds: [], systemAliases: [] });

        // Assert
        assert.deepEqual(oVisualizations, oVisualizationsExpected, "There is a visualization for each visualization in the page.");
        assert.deepEqual(this.oCreateVisualizationStub.getCall(0).args[0], oExpectedPageVisualizationParameter, "The page visualization id is used to create the site visualization.");
        assert.deepEqual(this.oCreateVisualizationStub.getCall(0).args[1], { "Some-Visualization": {} }, "The visualization data is used as well.");
        assert.deepEqual(this.oCreateVisualizationStub.getCall(0).args[2], { inbounds: [], systemAliases: [] }, "The navigation data is used as well.");
    });

    QUnit.module("The function _getVisualization");

    QUnit.test("Gets a site visualization from the page of type 'sap.ushell.StaticAppLauncher'", function (assert) {
        // Arrange
        var oPageVisualization = {
            inboundPermanentKey: "inbound-permanent-key-1",
            vizId: "visualization-id-1"
        };

        var oVisualizationData = {
            "visualization-id-1": {
                title: "title",
                subTitle: "subTitle",
                icon: "icon",
                size: "tileSize",
                indicatorDataSource: undefined
            }
        };

        var oNavigationData = {
            "inbound-permanent-key-1": {
                id: "appID4711",
                permanentKey: "inbound-permanent-key-1"
            }
        };

        var oVisualizationExpected = {
            vizType: "sap.ushell.StaticAppLauncher",
            vizConfig: {
                "sap.app": {
                    title: "title",
                    subTitle: "subTitle",
                    info: undefined
                },
                "sap.ui": {
                    icons: {
                        icon: "icon"
                    }
                },
                "sap.flp": {
                    tileSize: "tileSize",
                    target: {
                        type: "IBN",
                        appId: "inbound-permanent-key-1",
                        inboundId: "appID4711"
                    },
                    indicatorDataSource: undefined
                }
            }
        };


        // Act
        var oSiteVisualization = PageDereferencer._getVisualization(
            oPageVisualization, oVisualizationData, oNavigationData
        );

        // Assert
        assert.deepEqual(oSiteVisualization, oVisualizationExpected, "The function _getVisualization returns the correct visualization.");
    });

    QUnit.test("Gets a site visualization from the page representing a URL tile", function (assert) {
        // Arrange
        var oPageVisualization = {
            inboundPermanentKey: "",
            vizId: "visualization-id-1"
        };

        var oVisualizationData = {
            "visualization-id-1": {
                title: "title",
                subTitle: "subTitle",
                icon: "icon",
                size: "tileSize",
                indicatorDataSource: undefined,
                url: "http://www.sap.com"
            }
        };

        var oNavigationData = {};

        var oVisualizationExpected = {
            vizType: "sap.ushell.StaticAppLauncher",
            vizConfig: {
                "sap.app": {
                    title: "title",
                    subTitle: "subTitle",
                    info: undefined
                },
                "sap.ui": {
                    icons: {
                        icon: "icon"
                    }
                },
                "sap.flp": {
                    tileSize: "tileSize",
                    target: {
                        type: "URL",
                        url: "http://www.sap.com"
                    },
                    indicatorDataSource: undefined
                }
            }
        };


        // Act
        var oSiteVisualization = PageDereferencer._getVisualization(
            oPageVisualization, oVisualizationData, oNavigationData
        );

        // Assert
        assert.deepEqual(oSiteVisualization, oVisualizationExpected, "The function _getVisualization returns the correct visualization.");
    });

    QUnit.test("Gets a site visualization from the page of type 'sap.ushell.DynamicAppLauncher'", function (assert) {
        // Arrange
        var oPageVisualization = {
            inboundPermanentKey: "inbound-permanent-key-1",
            vizId: "visualization-id-1"
        };

        var oVisualizationData = {
            "visualization-id-1": {
                title: "title",
                subTitle: "subTitle",
                icon: "icon",
                size: "tileSize",
                indicatorDataSource: {
                    path: "path/to/odata/service/$count",
                    refresh: 200
                }
            }
        };

        var oNavigationData = {
            "inbound-permanent-key-1": {
                id: "appID4711",
                permanentKey: "inbound-permanent-key-1"
            }
        };

        var oVisualizationExpected = {
            vizType: "sap.ushell.DynamicAppLauncher",
            vizConfig: {
                "sap.app": {
                    title: "title",
                    subTitle: "subTitle",
                    info: undefined
                },
                "sap.ui": {
                    icons: {
                        icon: "icon"
                    }
                },
                "sap.flp": {
                    tileSize: "tileSize",
                    target: {
                        type: "IBN",
                        appId: "inbound-permanent-key-1",
                        inboundId: "appID4711"
                    },
                    indicatorDataSource: {
                        path: "path/to/odata/service/$count",
                        refresh: 200
                    }
                }
            }
        };

        // Act
        var oSiteVisualization = PageDereferencer._getVisualization(
            oPageVisualization, oVisualizationData, oNavigationData
        );

        // Assert
        assert.deepEqual(oSiteVisualization, oVisualizationExpected, "The function _getVisualization returns the correct visualization.");
    });

    QUnit.test("Gets a site visualization from the page of type 'sap.ushell.PlatformVisualization'", function (assert) {
        // Arrange
        var oPageVisualization = {
            inboundPermanentKey: "inbound-permanent-key-1",
            vizId: "visualization-id-1"
        };

        var oVisualizationData = {
            "visualization-id-1": {
                title: "title",
                subTitle: "subTitle",
                icon: "icon",
                size: "tileSize",
                isCustomTile: true,
                indicatorDataSource: {
                    path: "path/to/odata/service/$count",
                    refresh: 200
                }
            }
        };

        var oNavigationData = {
            "inbound-permanent-key-1": {
                id: "appID4711",
                permanentKey: "inbound-permanent-key-1"
            }
        };

        var oVisualizationExpected = {
            vizType: "sap.ushell.PlatformVisualization",
            vizConfig: {
                "sap.app": {
                    title: "title",
                    subTitle: "subTitle",
                    info: undefined
                },
                "sap.ui": {
                    icons: {
                        icon: "icon"
                    }
                },
                "sap.flp": {
                    tileSize: "tileSize",
                    target: {
                        type: "IBN",
                        appId: "inbound-permanent-key-1",
                        inboundId: "appID4711"
                    },
                    indicatorDataSource: {
                        path: "path/to/odata/service/$count",
                        refresh: 200
                    }
                }
            }
        };

        // Act
        var oSiteVisualization = PageDereferencer._getVisualization(
            oPageVisualization, oVisualizationData, oNavigationData
        );

        // Assert
        assert.deepEqual(oSiteVisualization, oVisualizationExpected, "The function _getVisualization returns the correct visualization.");
    });

    QUnit.test("Still works if some properties have no values", function (assert) {
        // Arrange
        var oPageVisualization = {
            inboundPermanentKey: "inbound-permanent-key-1",
            vizId: "visualization-id-1"
        };

        var oVisualizationData = {
            "visualization-id-1": {}
        };

        var oNavigationData = {
            "inbound-permanent-key-1": {}
        };

        var oVisualizationExpected = {
            vizType: "sap.ushell.StaticAppLauncher",
            vizConfig: {
                "sap.app": {
                    title: undefined,
                    subTitle: undefined,
                    info: undefined
                },
                "sap.ui": {
                    icons: {
                        icon: undefined
                    }
                },
                "sap.flp": {
                    tileSize: undefined,
                    target: {
                        type: "IBN",
                        appId: "inbound-permanent-key-1",
                        inboundId: undefined
                    },
                    indicatorDataSource: undefined
                }
            }
        };

        // Act
        var oSiteVisualization = PageDereferencer._getVisualization(
            oPageVisualization, oVisualizationData, oNavigationData
        );

        // Assert
        assert.deepEqual(oSiteVisualization, oVisualizationExpected, "The site visualization is calculated correctly.");
    });

    QUnit.test("Still works if the referenced visualization and navigation data is not available", function (assert) {
        // Arrange
        var oPageVisualization = {
            inboundPermanentKey: "inbound-permanent-key-1",
            vizId: "visualization-id-1"
        };

        var oVisualizationData = {
            "visualization-id-1": {}
        };

        var oNavigationData = {};

        var oVisualizationExpected = {
            vizType: "sap.ushell.StaticAppLauncher",
            vizConfig: {
                "sap.app": {
                    title: undefined,
                    subTitle: undefined,
                    info: undefined
                },
                "sap.ui": {
                    icons: {
                        icon: undefined
                    }
                },
                "sap.flp": {
                    tileSize: undefined,
                    target: {
                        type: "IBN",
                        appId: "inbound-permanent-key-1",
                        inboundId: undefined
                    },
                    indicatorDataSource: undefined
                }
            }
        };

        // Act
        var oSiteVisualization = PageDereferencer._getVisualization(
            oPageVisualization, oVisualizationData, oNavigationData
        );

        // Assert
        assert.deepEqual(oSiteVisualization, oVisualizationExpected, "The site visualization is calculated correctly.");
    });

    QUnit.test("Return undefined if the visualization data for a specific vizId could not be determined", function (assert) {
        // Arrange
        var oPageVisualization = {
            inboundPermanentKey: "inbound-permanent-key-1",
            vizId: "non-existent-visualization-id"
        };

        var oVisualizationData = {
            "visualization-id-1": {}
        };

        var oNavigationData = {};

        // Act
        var oSiteVisualization = PageDereferencer._getVisualization(
            oPageVisualization, oVisualizationData, oNavigationData
        );

        // Assert
        assert.strictEqual(typeof oSiteVisualization, "undefined", "The site visualization is undefined.");
    });

    QUnit.module("The function _getApplications", {
        beforeEach: function () {
            this.oGetAppStub = sinon.stub(AppForInbound, "get").returns({});
        },
        afterEach: function () {
            this.oGetAppStub.restore();
        }
    });

    QUnit.test("Gets the applications from the navigation data handed over as parameter", function (assert) {
        // Arrange
        var oNavigationData = {
            "permanent-key-1": {
                permanentKey: "permanent-key-1"
            },
            "inbound-id-2": {
                id: "inbound-id-2"
            },
            "permanent-key-3": {
                permanentKey: "permanent-key-3"
            }
        };
        var oExpectedApplications = {
            "permanent-key-1": {},
            "inbound-id-2": {},
            "permanent-key-3": {}
        };

        // Act
        var oApplications = PageDereferencer._getApplications(oNavigationData);

        // Assert
        assert.deepEqual(oApplications, oExpectedApplications, "There is an app for each inbound.");
        assert.strictEqual(this.oGetAppStub.getCall(0).args[0], "permanent-key-1", "The inbound id is used to .get the application.");
        assert.strictEqual(this.oGetAppStub.getCall(0).args[1], oNavigationData["permanent-key-1"], "The inbound id is used as well.");
    });

});
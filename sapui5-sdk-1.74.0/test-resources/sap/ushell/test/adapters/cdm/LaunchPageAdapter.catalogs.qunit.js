// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.LaunchPageAdapter / CDM Version 3
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ushell/adapters/cdm/v3/LaunchPageAdapter",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ushell/services/Container"
], function (
    testUtils,
    utils,
    LaunchPageAdapter,
    oReadVisualization
    // Container
) {
    "use strict";

    /* global assert, asyncTest, deepEqual, strictEqual, module, ok, sinon, start, test, QUnit */

    var O_CDM_SITE_SERVICE_MOCK_DATA = sap.ushell.test.data.cdm.commonDataModelService,
        O_CDM_SITE = O_CDM_SITE_SERVICE_MOCK_DATA.site,
        O_CSTR = sap.ushell.test.data.cdm.ClientSideTargetResolution.resolvedTileHashes,
        O_LPA_CATALOGS_EXPOSED = sap.ushell.test.data.cdm.launchPageAdapter.catalogs,
        O_LPA_CATALOG_TILES_EXPOSED = sap.ushell.test.data.cdm.launchPageAdapter.catalogTiles,
        O_LPA_EXTENSION_CATALOG_TILES_EXPOSED = sap.ushell.test.data.cdm.launchPageAdapter.extensionCatalogTiles,
        fnResolveTileIntentSpy;

    /**
     * TODO: a possibly more efficient strategy would be to add required groups
     * instead of doing a heavy copy only to delete some of the copied groups later?
     *
     * @param {object} oFilters
     *  Filter collection
     * @param {array} oFilters.groupsFilter
     *  Filters the groups based on the given IDs.
     *  The order in this array also defines the order of the groups.
     * @param {object} oFilters.tilesFilter
     *  Map of groupIds. Maps to an array of tile IDs to be filtered for.
     *  Note: all groupIds must also be available in oFilters.groupsFilter (if set)
     * @returns {object}
     *  Returns a site copy where the defined filters have been applied
     */
    function getFilteredSite (oFilters) {
        // TODO: if the objects in O_CDM_SITE were immutable,
        // and the arrays were returned via a getter then the
        // following expensive extend call would not be need.
        var oSiteCopy = jQuery.extend(true, {}, O_CDM_SITE),
            bNotFound;

        if (oFilters && oFilters.groupsFilter) {
            // filter groups (based on oFilters.groupsFilter)
            Object.keys(oSiteCopy.groups).forEach(function (sGroupId) {
                // TODO: remove pointless immediately following if statement
                // because Object.keys always only return array of own
                // properties.
                if (!oSiteCopy.groups.hasOwnProperty(sGroupId)) {
                    return; // skip prototype properties
                }

                if (oFilters.groupsFilter.indexOf(sGroupId) === -1) {
                    // group must be filtered out
                    delete oSiteCopy.groups[sGroupId];
                    // entry in groupsOrder array needs to be adapted
                    oSiteCopy.site.payload.groupsOrder = jQuery.grep(oSiteCopy.site.payload.groupsOrder, function (sId) {
                        return sId !== sGroupId;
                    });
                }
            });

            // Overwrite groupsOrder based on oFilters.groupsFilter
            oSiteCopy.site.payload.groupsOrder = oFilters.groupsFilter;
        }

        if (oFilters && typeof oFilters.tilesFilter === "object") {
            // groups must be in groupsFilter if given
            if (oFilters.groupsFilter) {
                bNotFound = Object.keys(oFilters.tilesFilter).some(function (sGroupId) {
                    if (oFilters.groupsFilter.indexOf(sGroupId) === -1) {
                        // error: tiles for a group filtered which is not
                        return true;
                    }
                });

                if (bNotFound) {
                    ok(false, "not all groups contained in groupsFilter");
                }
            }

            // filter tiles
            //TODO
        }

        if (oFilters && typeof oFilters.catalogsFilter === "object") {
            var oFilteredCatalogs = {};

            oFilters.catalogsFilter.forEach(function (sCatalogId) {
                if (!oSiteCopy.catalogs.hasOwnProperty(sCatalogId)) {
                    ok(false, "not all groups contained in groupsFilter");
                    return;
                }

                oFilteredCatalogs[sCatalogId] = oSiteCopy.catalogs[sCatalogId];
            });

            oSiteCopy.catalogs = oFilteredCatalogs;
        }
        return oSiteCopy;
    }

    /**
     * Stubs the CommonDataModel and the ClientSideTargetResolution services
     *
     * @param {object} oSite
     *  The main site to be used
     *
     * @param {object} oServiceSpecifications
     *  An object indicating how a certain mocked service should behave
     *
     * @returns {object}
     *  Site Object based on the common data model
     */
    function stubUsedServices (oSite, oServiceSpecifications) {
        var fnGetServiceOriginal = sap.ushell.Container.getService,
            oCstrService,
            oCdmService;

        fnResolveTileIntentSpy = sinon.spy(function (sHash) {
            var oDeferred = new jQuery.Deferred();

            setTimeout(function () {
                // ignore the Hash parameters in order to simplify test data complexity
                var oHash = /(#[A-Za-z0-9-]+)(\?.+)?/.exec(sHash),
                    sHashWithoutParameters = oHash.length > 1 ? oHash[1] : sHash,
                    oResolutionResult = O_CSTR[sHashWithoutParameters];

                if (oResolutionResult) {
                    oDeferred.resolve(oResolutionResult);
                    return;
                }
                oDeferred.reject("stubed CSTR: no resolution result found for '" + sHash + "'");
            }, 0);

            return oDeferred.promise();
        });

        sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {
            if (sServiceName === "CommonDataModel") {
                if (!oCdmService) {
                    // singelton during one test so methods can be stubbed.
                    oCdmService = {
                        "getExtensionSites": function () {
                            var aExtensionSites = jQuery.sap.getObject(
                                "CommonDataModel.getExtensionSites.resolveWith",
                                undefined,
                                oServiceSpecifications
                            ) || [];

                            var oDeferred = new jQuery.Deferred();

                            aExtensionSites.reduce(function (oPreviousResolved, oNextSite) {

                                var oNextSiteResolvedPromise = new Promise(function (fnResolve, fnReject) {
                                    oPreviousResolved.then(function (oSite) {
                                        if (oSite !== null && oSite.success === true) {
                                            oDeferred.notify(oSite);
                                        }
                                        setTimeout(function () {
                                            fnResolve(oNextSite);
                                        }, 0);
                                    });
                                });

                                return oNextSiteResolvedPromise;
                            }, Promise.resolve(null)).then(function (oSite) {
                                if (oSite !== null && oSite.success === true) {
                                    oDeferred.notify(oSite);
                                }
                                oDeferred.resolve(aExtensionSites);
                            });

                            return oDeferred.promise();
                        },
                        "getSite": function () {
                            var oGetSiteDeferred = new jQuery.Deferred();

                            if (oServiceSpecifications && oServiceSpecifications.CommonDataModel &&
                                oServiceSpecifications.CommonDataModel.getSite &&
                                oServiceSpecifications.CommonDataModel.getSite.shouldReject === true) {
                                oGetSiteDeferred.reject(oServiceSpecifications.CommonDataModel.getSite.errorMessage || "");
                            } else {
                                oGetSiteDeferred.resolve(oSite);
                            }

                            return oGetSiteDeferred.promise();
                        },
                        "save": function () {
                            var oDeferred = new jQuery.Deferred();

                            if (oServiceSpecifications && oServiceSpecifications.CommonDataModel &&
                                oServiceSpecifications.CommonDataModel.save &&
                                oServiceSpecifications.CommonDataModel.save.shouldReject === true) {
                                oDeferred.reject(oServiceSpecifications.CommonDataModel.save.errorMessage || "");
                            } else {
                                oDeferred.resolve();
                            }

                            return oDeferred.promise();
                        },
                        "getGroupFromOriginalSite": function () {
                            var oDeferred = new jQuery.Deferred();

                            if (oServiceSpecifications && oServiceSpecifications.CommonDataModel &&
                                oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite &&
                                oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite.shouldReject === true) {
                                oDeferred.reject(oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite.errorMessage || "");
                            } else if (oServiceSpecifications && oServiceSpecifications.CommonDataModel &&
                                oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite &&
                                oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite.returnValue) {
                                oDeferred.resolve(jQuery.extend(true, {}, oServiceSpecifications.CommonDataModel.getGroupFromOriginalSite.returnValue));
                            }
                            return oDeferred.promise();
                        }
                    };
                }
                return oCdmService;
            }
            if (sServiceName === "ClientSideTargetResolution") {
                if (!oCstrService) {
                    // singelton during one test so methods can be stubbed.
                    oCstrService = {
                        resolveTileIntent: fnResolveTileIntentSpy,
                        resolveTileIntentInContext: function (aInbounds, sHash) {
                            var oDeferred = new jQuery.Deferred();

                            var oResolvedTileIntents = jQuery.sap.getObject(
                                "ClientSideTargetResolution.resolveTileIntentInContext.resolvedTileIntents",
                                undefined,
                                oServiceSpecifications
                            ) || {};

                            if (oResolvedTileIntents[sHash]) {
                                oDeferred.resolve(oResolvedTileIntents[sHash]);
                            } else {
                                oDeferred.reject("Could not resolve tile intent '" + sHash + "'");
                            }

                            return oDeferred.promise();
                        },
                        isInPlaceConfiguredFor: fnGetServiceOriginal(sServiceName).isInPlaceConfiguredFor
                    };
                }
                return oCstrService;
            }
            // unknown service, call original sap.ushell.Container.getService
            return fnGetServiceOriginal(sServiceName);
        });
        return oSite;
    }

    function okFalse (sMessage) {
        ok(false, "unexpected failure: " + sMessage);
    }

    function okFalseAndStart (sMessage) {
        okFalse(sMessage);
        start();
    }

    /**
     * Test equivalent of _getTileFromHash.
     * Creates an entry for _mResolvedTiles based on a group item (tile or link)
     * and a hash.
     *
     * @param {string} sHash
     *  hash referring to O_CSTR
     * @param {boolean} bIsLink
     *  Specifies if the tile is displayed as link
     * @param {boolean} bIsCatalogTile
     *  Specifies if the tile is a catalog tile
     *
     * @returns {object}
     *   the resolved tile
     *
     */
    function createResolvedTile (sHash, bIsLink, bIsCatalogTile) {
        var oResolvedTile = {
            tileIntent: sHash,
            tileResolutionResult: O_CSTR[sHash]
        };

        if (bIsCatalogTile === true) {
            oResolvedTile.id = sHash;
        }

        if (bIsLink !== undefined && bIsCatalogTile === false) {
            oResolvedTile.isLink = !!bIsLink;
        }

        return oResolvedTile;
    }

    /**
     * Prepares this.oAdapter to "know" the resolved tile information. This does the same as getGroups would do.
     * Calls createResolvedTile and adds the result to this.oAdapter._mResolvedTiles for oTile
     *
     * @param {object} [oLaunchPageAdapter]
     *  CDM LaunchPageAdapter instance to add the resolved tile to
     * @param {string} sHash
     *  hash referring to O_CSTR
     * @param {object} oTile
     *  tile as returned by this.oAdapter.getGroupTiles(oGroup)
     * @param {boolean} bIsLink
     *  Specifies if the tile is displayed as link
     * @param {boolean} bIsCatalogTile
     *  Specifies if the tile is a catalog tile
     *
     */
    function addResolvedTileToAdapter (oLaunchPageAdapter, sHash, oTile, bIsLink, bIsCatalogTile) {
        oLaunchPageAdapter = oLaunchPageAdapter || this.oAdapter;

        if (bIsCatalogTile === true) {
            oLaunchPageAdapter._mResolvedCatalogTiles[sHash] = createResolvedTile(sHash, false, true);
        } else {
            oLaunchPageAdapter._mResolvedTiles[oTile.id] = createResolvedTile(sHash, bIsLink, false);
        }
    }

    module("sap.ushell.adapters.cdm.v3.LaunchPageAdapter", {
        setup: function () {
            this.oAdapter = new LaunchPageAdapter(
                undefined, undefined, {
                    config: {}
                });

            // local bootstrap, so not all needs to be done manually.
            // note: some adapters are stubbed later
            stop();
            sap.ushell.bootstrap("local").done(function () {
                start();
            });
        },
        teardown: function () {
            delete this.oAdapter;
            delete sap.ushell.Container;
            testUtils.restoreSpies(
                utils.generateUniqueId,
                jQuery.sap.log.warning,
                sap.ui.core.ComponentContainer,
                sap.ui.core.createContainer,
                sap.ui.component,
                sap.m.GenericTile,
                sap.m.Link,
                sap.ui.model.json.JSONModel,
                sap.ushell.components.tiles.utilsRT.getTileSettingsAction,
                sap.ushell.utils.utilsCdm.mapOne,
                jQuery.sap.log.error
            );
        }
    });

    [
        {
            testDescription: "catalog tile with title and subtitle given",
            input: O_LPA_CATALOG_TILES_EXPOSED.AppDesc1,
            expected: [
                "title - Static App Launcher 1",
                "subtitle - Static App Launcher 1"
            ]
        }
    ].forEach(function (oFixture) {
        QUnit.test("getCatalogTileKeywords when " + oFixture.testDescription, function (assert) {
            var aActualKeywords,
                catalogTile = oFixture.input,
                //TODO: clarify other keywords like info, description
                aExpectedKeywords = oFixture.expected;

            // act
            aActualKeywords = this.oAdapter.getCatalogTileKeywords(catalogTile);

            // assert
            assert.deepEqual(aActualKeywords, aExpectedKeywords, "Keywords returned as expected");
        });
    });

    [
        {
            testDescription: "catalog tile",
            input: {
                oTile: O_LPA_CATALOG_TILES_EXPOSED.AppDesc1
            },
            expected: {
                title: "title - Static App Launcher 1",
                subTitle: "subtitle - Static App Launcher 1",
                icon: "sap-icon://Fiori2/F0018",
                info: "info - Static App Launcher 1",
                url: "#App1-viaStatic?sap-ui-app-id-hint=AppDesc1"
            }
        }, {
            testDescription: "custom catalog tile with target",
            input: {
                oTile: O_LPA_CATALOG_TILES_EXPOSED.CustomTileApplication
            },
            expected: {
                title: "title - Custom Tile",
                subTitle: "subtitle - Custom Tile",
                icon: "sap-icon://time-entry-request",
                info: "",
                url: "#Shell-customTileWithTargetOutbound"
            }
        }, {
            testDescription: "custom catalog tile w/o target",
            input: {
                oTile: O_LPA_CATALOG_TILES_EXPOSED.CustomTileApplicationWithoutTarget
            },
            expected: {
                title: "title - Custom Tile w/o Target",
                subTitle: "subtitle - Custom Tile w/o Target",
                icon: "sap-icon://time-entry-request",
                info: "info - Custom Tile w/o Target",
                url: "#Shell-customTileWithOutTargetOutbound"
            }
        }, {
            testDescription: "catalog tile data shines through when group tile has NO own properties",
            input: {
                sHash: "#App1-viaStatic",
                oTile: {
                    id: "012234553",
                    appId: "AppDesc1",
                    // no title, subTitle, icon & info
                    target: {
                        SemanticObject: "App1",
                        Action: "viaStatic"
                    }
                }
            },
            expected: {
                title: "title - Static App Launcher 1",
                subTitle: "subtitle - Static App Launcher 1",
                icon: "sap-icon://Fiori2/F0018",
                info: "info - Static App Launcher 1",
                url: "#App1-viaStatic"
            }
        }, {
            testDescription: "catalog tile data is hidden because group tile has own properties",
            input: {
                sHash: "#App1-viaStatic",
                oTile: {
                    id: "012234553",
                    appId: "AppDesc1",
                    title: "group tile title",
                    subTitle: "group tile subtitle",
                    icon: "group/tile/icon",
                    info: "group tile info",
                    target: {
                        SemanticObject: "App1",
                        Action: "viaStatic"
                    }
                }
            },
            expected: {
                title: "group tile title",
                subTitle: "group tile subtitle",
                icon: "group/tile/icon",
                info: "group tile info",
                url: "#App1-viaStatic"
            }
        }
    ].forEach(function (oFixture) {
        test("getCatalogTilePreviewTitle when " + oFixture.testDescription, function (assert) {
            // arrange
            if (oFixture.input.sHash) {
                addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, null, false);
            }
            // act
            var sValue = this.oAdapter.getCatalogTilePreviewTitle(oFixture.input.oTile);
            // assert
            assert.strictEqual(sValue, oFixture.expected.title, "title");
        });

        test("getCatalogTilePreviewSubtitle when " + oFixture.testDescription, function (assert) {
            // arrange
            if (oFixture.input.sHash) {
                addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, null, false);
            }
            // act
            var sValue = this.oAdapter.getCatalogTilePreviewSubtitle(oFixture.input.oTile);
            // assert
            assert.strictEqual(sValue, oFixture.expected.subTitle, "subTitle");
        });

        test("getCatalogTilePreviewIcon when " + oFixture.testDescription, function (assert) {
            // arrange
            if (oFixture.input.sHash) {
                addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, null, false);
            }
            // act
            var sValue = this.oAdapter.getCatalogTilePreviewIcon(oFixture.input.oTile);
            // assert
            assert.strictEqual(sValue, oFixture.expected.icon, "icon");
        });

        test("getCatalogTilePreviewInfo when " + oFixture.testDescription, function (assert) {
            // arrange
            if (oFixture.input.sHash) {
                addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, null, false);
            }
            // act
            var sValue = this.oAdapter.getCatalogTilePreviewInfo(oFixture.input.oTile);
            // assert
            assert.strictEqual(sValue, oFixture.expected.info, "info");
        });

        test("getCatalogTileTargetURL when " + oFixture.testDescription, function (assert) {
            // arrange
            if (oFixture.input.sHash) {
                addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, null, false);
            }
            // act
            var sValue = this.oAdapter.getCatalogTileTargetURL(oFixture.input.oTile);
            // assert
            assert.strictEqual(sValue, oFixture.expected.url, "url");
        });
    });

    [
        {
            testDescription: "null tile",
            inputTile: null
        }
    ].forEach(function (oFixture) {
        test("getCatalogTilePreviewTitle FAILS when " + oFixture.testDescription, function (assert) {
            assert.throws(function () {
                // act
                this.oAdapter.getCatalogTilePreviewTitle(oFixture.inputTile);
            });
        });

        test("getCatalogTilePreviewSubtitle FAILS when " + oFixture.testDescription, function (assert) {
            assert.throws(function () {
                // act
                this.oAdapter.getCatalogTilePreviewSubtitle(oFixture.inputTile);
            });
        });

        test("getCatalogTilePreviewIcon FAILS when " + oFixture.testDescription, function (assert) {
            assert.throws(function () {
                // act
                this.oAdapter.getCatalogTilePreviewIcon(oFixture.inputTile);
            });
        });

        test("getCatalogTilePreviewInfo FAILS when " + oFixture.testDescription, function (assert) {
            assert.throws(function () {
                // act
                this.oAdapter.getCatalogTilePreviewInfo(oFixture.inputTile);
            });
        });

        test("getCatalogTileTargetURL FAILS when " + oFixture.testDescription, function (assert) {
            assert.throws(function () {
                // act
                this.oAdapter.getCatalogTileTargetURL(oFixture.inputTile);
            });
        });
    });

    QUnit.test("getCatalogTileView: Get tile view for custom tile", function (assert) {
        // Arrange
        var oFakeComponent = { id: "FakeComponent" },
            oFakeComponentContainer = { id: "FakeComponentContainer" },
            oComponentStub = sinon.stub(sap.ui, "component").returns(oFakeComponent),
            oComponentContainerStub = sinon.stub(sap.ui.core, "ComponentContainer").returns(oFakeComponentContainer), // TODO: pending dependency migration
            oCatalogTile = createResolvedTile("#Shell-customTile", false, true);
        oCatalogTile.isCatalogTile = true;

        this.oAdapter._mResolvedTiles["#Shell-customTile"] = oCatalogTile;

        // Act
        var oComponentContainer = this.oAdapter.getCatalogTileView(oCatalogTile);

        // Assert
        assert.strictEqual(oCatalogTile.tileIntent, oComponentStub.getCall(0).args[0].componentData.properties.targetURL, "TargetURL is taken over into tile view");
        assert.strictEqual(oCatalogTile.tileResolutionResult.title, oComponentStub.getCall(0).args[0].componentData.properties.title, "Title is taken over into tile view");
        assert.strictEqual(oCatalogTile.tileResolutionResult.subTitle, oComponentStub.getCall(0).args[0].componentData.properties.subtitle, "Subtitle is taken over into tile view");
        assert.strictEqual(oCatalogTile.tileResolutionResult.icon, oComponentStub.getCall(0).args[0].componentData.properties.icon, "Icon is taken over into tile view");
        assert.deepEqual(oFakeComponent, oComponentContainerStub.getCall(0).args[0].component, "Tile view component added to component container");
        assert.deepEqual(oFakeComponentContainer, oComponentContainer, "Component container returned");
    });

    asyncTest("getCatalogTileViewControl: _getCatalogTileViewControl throws error", function () {
        var oAdapter = this.oAdapter,
            oCatalogTile = undefined;

        // Act and assert
        oAdapter.getCatalogTileViewControl(oCatalogTile)
            .fail(function () {
                ok(true, "Throws error as expected");
                start();
            })
            .done(okFalseAndStart);
    });

    asyncTest("_getCatalogTileViewControl : Returns correct tile ui", function () {
        var oAdapter = this.oAdapter,
            oCatalogTile = {},
            oCatalogTileUi = { foo: "bar" },
            oCatalogTileUiPromise = new jQuery.Deferred().resolve(oCatalogTileUi).promise();

        // Arrange
        sinon.stub(oAdapter, "_getTileUiComponentContainer").returns(oCatalogTileUiPromise);

        // Act
        oAdapter._getCatalogTileViewControl(oCatalogTile)
            .fail(okFalseAndStart)
            .done(function (oResult) {
                // Assert
                ok(oAdapter._getTileUiComponentContainer.called, "_getTileUiComponentContainer called");
                deepEqual(oResult, oCatalogTileUi, "correct value returned");
                start();
            });
    });

    [
        {
            testDescription: "_compareCatalogs A and B",
            input: {
                oCatalogA: {
                    identification: { id: "A" }
                },
                oCatalogB: {
                    identification: { id: "B" }
                }
            },
            expectedResult: -1
        }, {
            testDescription: "_compareCatalogs B and A",
            input: {
                oCatalogA: {
                    identification: { id: "B" }
                },
                oCatalogB: {
                    identification: { id: "A" }
                }
            },
            expectedResult: 1
        }
    ].forEach(function (oFixture) {
        test(oFixture.testDescription, function () {
            // act
            var comparison = this.oAdapter._compareCatalogs(oFixture.input.oCatalogA, oFixture.input.oCatalogB);
            // assert
            strictEqual(comparison, oFixture.expectedResult, "Catalog A bigger than Catalog B (-1 / false ) or Catalog B bigger than Catalog A (1 / true )");
        });
    });

    asyncTest("getCatalogTiles: empty catalog", function () {
        var that = this;

        // Arrange
        stubUsedServices(getFilteredSite());

        // Act
        that.oAdapter.getCatalogTiles({}) // note: empty
            .fail(function () {
                ok(false, "promise was resolved");
            })
            .done(function (aTiles) {
                ok(true, "promise was resolved");

                deepEqual(aTiles, [],
                    "promise was resolved with an empty array");
            })
            .always(function () {
                start();
            });
    });

    asyncTest("getCatalogs", function () {
        var aExpectedCatalogs = Object.keys(O_LPA_CATALOGS_EXPOSED)
            .map(function (sKey) {
                return O_LPA_CATALOGS_EXPOSED[sKey];
            }),
            aActualCatalogs = [],
            oSpySetTimeout;

        // Arrange
        stubUsedServices(getFilteredSite());
        oSpySetTimeout = sinon.spy(window, "setTimeout");

        // Act
        this.oAdapter.getCatalogs()
            .fail(function () {
                start();
                ok(false, "unexpected failure");
            })
            .progress(function (oCatalog) {
                // add the catalogs for later check in the done handler
                aActualCatalogs.push(oCatalog);
            })
            .done(function (aUnused) {
                // Assert
                strictEqual(oSpySetTimeout.callCount, 1, "setTimeout in getCatalogs called");
                deepEqual(aActualCatalogs, aExpectedCatalogs, "catalogs exposed as expected");
                oSpySetTimeout.restore();
                start();
            });
    });

    test("getCatalogId", function () {
        var oCatalog = O_LPA_CATALOGS_EXPOSED.cat1,
            sExpected = "cat1",
            sActual;

        // act
        sActual = this.oAdapter.getCatalogId(oCatalog);

        // assert
        strictEqual(sActual, sExpected, "catalog ID");
    });

    test("getCatalogTitle", function () {
        var oCatalog = O_LPA_CATALOGS_EXPOSED.cat2,
            sExpected = "Accounts Payable - Checks",
            sActual;

        // act
        sActual = this.oAdapter.getCatalogTitle(oCatalog);

        // assert
        strictEqual(sActual, sExpected, "catalog title");
    });

    [
        {
            testDescription: "Catalog cat1",
            input: O_LPA_CATALOGS_EXPOSED.cat1,
            expected: [
                O_LPA_CATALOG_TILES_EXPOSED.AppDesc1,
                O_LPA_CATALOG_TILES_EXPOSED.AppDesc2
            ]
        }, {
            testDescription: "Catalog cat2",
            input: O_LPA_CATALOGS_EXPOSED.cat2,
            expected: [
                O_LPA_CATALOG_TILES_EXPOSED.AppDesc1
                // "AppDesc3" does not exist
            ]
        }, {
            testDescription: "Catalog customTileCatalog",
            input: O_LPA_CATALOGS_EXPOSED.customTileCatalog,
            expected: [
                O_LPA_CATALOG_TILES_EXPOSED.CustomTileApplication1
            ]
        }, {
            testDescription: "Catalog urlTileCatalog",
            input: O_LPA_CATALOGS_EXPOSED.urlTileCatalog,
            expected: [
                O_LPA_CATALOG_TILES_EXPOSED.urlTile
            ]
        }, {
            testDescription: "Catalog pluginCatalog",
            input: O_LPA_CATALOGS_EXPOSED.pluginCatalog,
            expected: [
                O_LPA_CATALOG_TILES_EXPOSED.AppDesc1,
                // UIPLUGINSAMPLE is not exposed as a catalog tile
                O_LPA_CATALOG_TILES_EXPOSED.AppDesc2
            ]
        }
    ].forEach(function (oFixture) {
        asyncTest("getCatalogTiles for " + oFixture.testDescription, function () {
            var oCatalog = oFixture.input,
                aExpectedCatalogTiles = oFixture.expected,
                fnMapOne = sinon.spy(sap.ushell.utils.utilsCdm, "mapOne");

            // arrange
            stubUsedServices(getFilteredSite());

            // act
            this.oAdapter.getCatalogTiles(oCatalog)
                .done(function (aActualCatalogTiles) {
                    // assert
                    strictEqual(aActualCatalogTiles.length, aExpectedCatalogTiles.length,
                        "number of catalog tiles");
                    deepEqual(aActualCatalogTiles,
                        aExpectedCatalogTiles, "catalog tiles"
                    );

                    if (fnMapOne.callCount > 0) {
                        fnMapOne.args.forEach(function (oCallArgs) {
                            var sKey = oCallArgs[0],
                                oInbound = oCallArgs[1],
                                oApp = oCallArgs[2],
                                oVisualization = oCallArgs[3];

                            if (!utils.getMember(oReadVisualization.getConfig(oVisualization), "sap|flp.target.type") === "URL") {
                                assert.strictEqual(
                                    oInbound,
                                    oApp["sap.app"].crossNavigation.inbounds[sKey],
                                    "inbound is given as oSrc. So title, subtitle ... deviceTypes from inbound are considered"
                                );
                            }
                        });
                    }

                    start();
                });
        });
    });

    [
        {
            testDescription: "invalid input parameter 'undefined'",
            oCatalogs: undefined,
            expectedError: "Invalid input parameter 'undefined' passed to getCatalogTiles."
        }, {
            testDescription: "invalid string input parameter is provided",
            oCatalogs: "SomeCatalogId",
            expectedError: "Invalid input parameter 'SomeCatalogId' passed to getCatalogTiles."
        }, {
            testDescription: "invalid input parameter 'null'",
            oCatalogs: null,
            expectedError: "Invalid input parameter 'null' passed to getCatalogTiles."
        }
    ].forEach(function (oFixture) {
        asyncTest("getCatalogTiles: rejects promise with expected error message when " + oFixture.testDescription, function () {
            var that = this;
            // Arrange
            stubUsedServices(getFilteredSite());

            // Act
            that.oAdapter.getCatalogTiles(oFixture.oCatalogs)
                .fail(function (sErrorMessage) {
                    // Assert
                    ok(true, "promise was rejected");
                    strictEqual(sErrorMessage, oFixture.expectedError,
                        "correct error message rejected");
                    start();
                })
                .done(function (/*aCatalogTiles*/) {
                    ok(false, "promise was rejected");
                    start();
                });
        });
    });

    // TODO figure out if this test is still needed (ask Savio); Assumption: No!
    // asyncTest("getCatalogTiles: two erroneous calls yeld to the same result", function () {
    //     var oPromise2,
    //         oPromise1,
    //         that = this;
    //
    //     var iProcessedCount = 0;
    //     function processFail(sError) {
    //         iProcessedCount++;
    //         ok(false, "Promise " + iProcessedCount + " was resolved");
    //         if (iProcessedCount === 2) {
    //             checkErrorLogged();
    //             start();
    //         }
    //     }
    //     function processSuccess(aResults) {
    //         iProcessedCount++;
    //         ok(true, "Promise " + iProcessedCount + " was resolved");
    //         if (iProcessedCount === 2) {
    //             checkErrorLogged();
    //             start();
    //         }
    //     }
    //
    //     function checkErrorLogged() {
    //         strictEqual(jQuery.sap.log.error.callCount, 2,
    //             "jQuery.sap.log.error was called twice");
    //
    //         deepEqual(jQuery.sap.log.error.getCall(0).args, [
    //             "Hash '#Bad-intent' could not be resolved to a tile. stubed CSTR: no resolution result found for '#Bad-intent'",
    //             "sap.ushell.adapters.cdm.LaunchPageAdapter"
    //         ], "first log message was called with the expected arguments");
    //
    //         deepEqual(jQuery.sap.log.error.getCall(1).args, [
    //             "Hash '#Bad-intent' could not be resolved to a tile. stubed CSTR: no resolution result found for '#Bad-intent'",
    //             "sap.ushell.adapters.cdm.LaunchPageAdapter"
    //         ], "second log message was called with the expected arguments");
    //     }
    //
    //     // Arrange
    //     stubUsedServices(getFilteredSite());
    //
    //     sinon.stub(jQuery.sap.log, "error");
    //
    //     // Act
    //     var oTestCatalog = {
    //         id: "cat1",
    //         payload: {
    //             appDescriptors: [{
    //                 id: "Unresolvable"
    //             }]
    //         }
    //     };
    //
    //     // NOTE, triggering getCatalogTiles in sequence
    //     oPromise1 = that.oAdapter.getCatalogTiles(oTestCatalog);
    //     oPromise1.done(processSuccess);
    //     oPromise1.fail(processFail);
    //     oPromise1.always(function () {
    //         oPromise2 = that.oAdapter.getCatalogTiles(oTestCatalog);
    //         oPromise2.done(processSuccess);
    //         oPromise2.fail(processFail);
    //     });
    // });

    [
        {
            testDescription: "catalog tile is given",
            oGroupOrCatalogTile: O_LPA_CATALOG_TILES_EXPOSED.AppDesc1,
            expectedId: "AppDesc1"
        }, {
            testDescription: "group bookmark tile is given",
            oGroupOrCatalogTile: {
                "id": "id-1501141576030-244",
                "target": {
                    "url": "https://www.example.com"
                },
                "title": "SAPUI5",
                "icon": "sap-icon://some-icon",
                "subTitle": "Subtitle",
                "info": "Info",
                "isBookmark": true // note
            },
            expectedId: "https://www.example.com"
        }, {
            testDescription: "non-bookmark group tile is given",
            oGroupOrCatalogTile: {
                "id": "static_tile_id",
                "vizId": "static_tile_id",
                "icon": "sap-icon://family-care",
                "title": "Title and icon Overwritten on Group",
                "subTitle": "Ststic Tile - modified properties!",
                "target": {
                    "semanticObject": "Custom",
                    "action": "StaticTile",
                    "parameters": []
                }
            },
            oResolvedTiles: {
                "static_tile_id": {
                    // other fields irrelevant ...
                    tileIntent: "#Custom-StaticTile"
                }
            },
            expectedId: "static_tile_id"
        }, {
            testDescription: "non-bookmark failed group tile is given",
            oGroupOrCatalogTile: {
                // TODO still CDM 1.0 structure
                "id": "static_tile_id",
                "vizId": "static_tile_id",
                "icon": "sap-icon://family-care",
                "title": "Title and icon Overwritten on Group",
                "subTitle": "Ststic Tile - modified properties!",
                "target": {
                    "semanticObject": "Custom",
                    "action": "StaticTile",
                    "parameters": []
                }
            },
            oResolvedTiles: {
                "static_tile_id": { // it can't be, but still provide it to
                    // make sure that fail condition is evaluated before the success
                    // condition.
                    tileIntent: "#Custom-StaticTile"
                }
            },
            oFailedTiles: {
                "static_tile_id": true // note
            },
            expectedId: undefined
        }, {
            testDescription: "non-bookmark group tile is given but contract was not respected",
            oGroupOrCatalogTile: {
                "id": "static_tile_id",
                "icon": "sap-icon://family-care",
                "title": "Title and icon Overwritten on Group",
                "subTitle": "Ststic Tile - modified properties!",
                "target": {
                    "semanticObject": "Custom",
                    "action": "StaticTile",
                    "parameters": []
                }
            },
            oResolvedTiles: { // should have been resolved before!
            },
            expectedId: undefined // don't throw
        }
    ].forEach(function (oFixture) {
        test("getCatalogTileId: returns the expected id when " + oFixture.testDescription, function () {
            this.oAdapter._mResolvedTiles = oFixture.oResolvedTiles || {};
            this.oAdapter._mFailedResolvedTiles = oFixture.oFailedTiles || {};

            strictEqual(
                this.oAdapter.getCatalogTileId(oFixture.oGroupOrCatalogTile),
                oFixture.expectedId,
                "obtained the expected id"
            );
        });
    });

    //TODO add test which compares getCatalogTileId(GroupTile) with corresponding getCatalogTileId(CatalogTile)
    //     (app finder does this for the pin detection

    asyncTest("add Catalog Tile to a group: basic call", function () {
        var that = this,
            aCatalogs = [];

        // Arrange
        stubUsedServices(getFilteredSite({
            groupsFilter: ["ONE"]
        }));

        sinon.stub(utils, "generateUniqueId").returns("12345");

        // Act
        this.oAdapter.getCatalogs().done(function (oCatalogs) {
            // tests
            deepEqual(that.oAdapter.getCatalogId(aCatalogs[0]), "cat1", "id 1");
            deepEqual(that.oAdapter.getCatalogId(aCatalogs[1]), "cat2", "id 2");
            deepEqual(that.oAdapter.getCatalogTitle(aCatalogs[1]), "Accounts Payable - Checks", "title");
            that.oAdapter.getCatalogTiles(aCatalogs[0]).done(function (aTiles) {
                // Assert
                var oCatalogTile;

                deepEqual(aTiles.length, 2, "tile length ok");
                oCatalogTile = aTiles[1];

                strictEqual(that.oAdapter.getCatalogTileTargetURL(oCatalogTile), "#App2-viaStatic?sap-ui-app-id-hint=AppDesc2", "correct TargetURL");
                strictEqual(that.oAdapter.getCatalogTileSize(oCatalogTile), "1x1", "size ok");
                strictEqual(that.oAdapter.getCatalogTileTitle(oCatalogTile), "App desc 2 title", "title ok");
                that.oAdapter.getGroups().done(function (aGroups) {

                    var oGroup = aGroups[1]; // because group with index 0 is default group
                    that.oAdapter.addTile(oCatalogTile, oGroup)
                        .done(function (oNewTile) {
                            // check some things on the tile:
                            strictEqual(that.oAdapter.getTileId(oNewTile), "12345", "correct id");
                            strictEqual(oNewTile.vizId, "AppDesc2", "Correct app ID provided for added tile");
                            // TODO may be wrong: strictEqual(that.oAdapter.getTileTitle(oNewTile), "title - App2", "title ok");
                            that.oAdapter.getGroups().done(function (aGroups) {
                                var nLen = 3;
                                strictEqual(aGroups[1].payload.tiles.length, nLen, "new length ok"); // because group with index 0 is default group
                                start();
                            });
                        })
                        .fail(function () {
                            start();
                            ok(false, "unexpected addTile failure");
                        });
                });
            });
        }).progress(function (oCatalog) {
            aCatalogs.push(oCatalog);
        });
    });

    [
        {
            description: "no valid inbound",
            oInbound: {},
            expectedResult: false
        }, {
            description: "no Action",
            oInbound: {
                semanticObject: "SemanticObject",
                signature: {
                    parameters: {
                        "P1": { defaultValue: { value: "ABC" } }
                    }
                }
            },
            expectedResult: false
        }, {
            description: "no SemanticObject",
            oInbound: {
                action: "action",
                signature: {
                    parameters: {
                        "P1": { defaultValue: { value: "ABC" } }
                    }
                }
            },
            expectedResult: false
        }, {
            description: "no filter ok",
            oInbound: {
                semanticObject: "SemanticObject",
                action: "action",
                signature: {
                    parameters: {
                        "P1": { defaultValue: { value: "ABC" } }
                    }
                }
            },
            expectedResult: true
        }, {
            description: "filter bad",
            oInbound: {
                semanticObject: "SemanticObject",
                action: "action",
                signature: {
                    parameters: {
                        "P1": { defaultValue: { value: "ABC" } },
                        "P2": { filter: { value: "ABC", format: "regexp" } }
                    }
                }
            },
            expectedResult: false
        }, {
            description: "filter for sap-external-url w/o launcherValue",
            oInbound: {
                semanticObject: "SemanticObject",
                action: "action",
                signature: {
                    parameters: {
                        "P1": { defaultValue: { value: "ABC" } },
                        "sap-external-url": { filter: { value: "ABC" } }
                    }
                }
            },
            expectedResult: true
        }, {
            description: "filter for sap-external-url w launcherValue",
            oInbound: {
                semanticObject: "SemanticObject",
                action: "action",
                signature: {
                    parameters: {
                        "P1": { defaultValue: { value: "ABC" } },
                        "sap-external-url": { filter: { value: "ABC" }, launcherValue: { value: "ABC" } }
                    }
                }
            },
            expectedResult: true
        }, {
            description: "filter with launcherValue",
            oInbound: {
                semanticObject: "SemanticObject",
                action: "action",
                signature: {
                    parameters: {
                        "P1": { defaultValue: { value: "ABC" } },
                        "P2": { filter: { value: "DEF" }, launcherValue: { value: "DEF" } }
                    }
                }
            },
            expectedResult: true
        }, {
            description: "filter w/o launcher value",
            oInbound: {
                semanticObject: "SemanticObject",
                action: "action",
                signature: {
                    parameters: {
                        "P1": { defaultValue: { value: "ABC" } },
                        "P2": { filter: { value: "DEF" } }
                    }
                }
            },
            expectedResult: false
        }, {
            description: "Shell-plugin",
            oInbound: {
                semanticObject: "Shell",
                action: "plugin",
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                }
            },
            expectedResult: false
        }, {
            description: "Shell-bootConfig", // should never be the case
            oInbound: {
                semanticObject: "Shell",
                action: "bootConfig",
                signature: {
                    parameters: {},
                    additionalParameters: "allowed"
                }
            },
            expectedResult: false
        }
    ].forEach(function (oFixture) {
        test("isStartableInbound when " + oFixture.description, function () {
            var bResult = this.oAdapter._isStartableInbound(oFixture.oInbound);
            strictEqual(bResult, oFixture.expectedResult, "correct result");
        });
    });

    [
        {
            testDescription: "only main site is provided (basic call)",
            oMainSite: getFilteredSite(), // includes cat1, cat2 and customTileCatalog
            oExtensionSites: [],
            expectedCatalogs: [
                "cat1",
                "cat2",
                "customTileCatalog",
                "pluginCatalog",
                "urlTileCatalog"
            ],
            // Test that tiles from main site are returned
            expectedCatalogTiles: {
                // catalog id -> expected tiles
                "cat1": [
                    O_LPA_CATALOG_TILES_EXPOSED.AppDesc1,
                    O_LPA_CATALOG_TILES_EXPOSED.AppDesc2
                ],
                "customTileCatalog": [
                    O_LPA_CATALOG_TILES_EXPOSED.CustomTileApplication1
                ]
            }
        }, {
            testDescription: "one extension site with one catalog is provided",
            oMainSite: getFilteredSite(), // includes cat1, cat2 and customTileCatalog
            oExtensionSites: [
                {
                    providerId: "Provider",
                    success: true,
                    site: O_CDM_SITE_SERVICE_MOCK_DATA.contentProviderSiteWithOneCatalog
                }
            ],
            expectedCatalogs: [
                "3rdPartyCatalog1",
                "cat1",
                "cat2",
                "customTileCatalog",
                "pluginCatalog",
                "urlTileCatalog"
            ]
        }, {
            testDescription: "one extension site with one failing catalog is provided",
            oMainSite: getFilteredSite(), // includes cat1, cat2 and customTileCatalog
            oExtensionSites: [
                {
                    providerId: "Provider",
                    success: false,
                    error: "Something bad happened"
                }
            ],
            expectedCatalogs: [
                "Provider",
                "cat1",
                "cat2",
                "customTileCatalog",
                "pluginCatalog",
                "urlTileCatalog"
            ]
        }, {
            testDescription: "empty site, only one extension site with one catalog is provided",
            oMainSite: getFilteredSite({
                catalogsFilter: []
            }),
            oExtensionSites: [
                {
                    providerId: "Provider",
                    success: true,
                    site: O_CDM_SITE_SERVICE_MOCK_DATA.contentProviderSiteWithOneCatalog
                }
            ],
            expectedCatalogs: [
                "3rdPartyCatalog1"
            ],
            expectedCatalogTiles: {
                // catalog id -> expected tiles
                "3rdPartyCatalog1": [
                    O_LPA_EXTENSION_CATALOG_TILES_EXPOSED["3rdPartyApp1"],
                    O_LPA_EXTENSION_CATALOG_TILES_EXPOSED["3rdPartyApp2"]
                ]
            }
        }, {
            testDescription: "multiple extension sites with multiple catalogs are provided",
            oMainSite: getFilteredSite(), // includes cat1, cat2 and customTileCatalog
            oExtensionSites: [
                {
                    providerId: "Provider1",
                    success: true,
                    site: O_CDM_SITE_SERVICE_MOCK_DATA.contentProviderSiteWithMultipleCatalogs
                }, {
                    providerId: "Provider2",
                    success: true,
                    site: O_CDM_SITE_SERVICE_MOCK_DATA.contentProviderSiteWithOneCatalog
                }
            ],
            expectedCatalogs: [
                "3rdPartyCatalog1", // from contentProviderSiteWithOneCatalog
                "3rdPartyCatalogA", // from contentProviderSiteWithMultipleCatalogs
                "3rdPartyCatalogB", // from contentProviderSiteWithMultipleCatalogs
                "cat1", // from main site
                "cat2", // from main site
                "customTileCatalog", // from main site,
                "pluginCatalog", // from main site
                "urlTileCatalog" // from main site
            ]
        }
    ].forEach(function (oFixture) {
        function commonArrange () {
            stubUsedServices(oFixture.oMainSite, {
                CommonDataModel: {
                    getExtensionSites: {
                        resolveWith: oFixture.oExtensionSites
                    }
                }
            });
        }

        asyncTest("getCatalogs: returns the expected catalogs when " + oFixture.testDescription, function () {
            var that = this;

            commonArrange();

            // Act
            this.oAdapter.getCatalogs()
                .fail(function () {
                    start();
                    ok(false, "promise was resolved");
                })
                .done(function (aCatalogs) {
                    ok(true, "promise was resolved");

                    var aCatalogIds = aCatalogs.map(function (oSiteCatalog) {
                        return that.oAdapter.getCatalogId(oSiteCatalog);
                    });

                    // Assert
                    deepEqual(aCatalogIds, oFixture.expectedCatalogs,
                        "got the expected catalogs");

                    start();
                });
        });

        asyncTest("getCatalogs: promise progress handler is only notified with 'good' catalogs when " + oFixture.testDescription, function () {
            var aCatalogsFromProgress = [];

            // Arrange
            commonArrange();

            // Act
            this.oAdapter.getCatalogs()
                .progress(function (oCatalog) {
                    aCatalogsFromProgress.push(oCatalog);
                })
                .done(function () {
                    var bFail = aCatalogsFromProgress.some(function (oCatalog) {
                        return oCatalog.hasOwnProperty("error");
                    });

                    strictEqual(!bFail, true,
                        "only catalogs without errors are reported in progress handler");

                    start();
                });
        });

        if (oFixture.hasOwnProperty("expectedCatalogTiles")) {
            // pre-requisite check on the fixture
            var bFixtureOk = Object.keys(oFixture.expectedCatalogTiles).map(function (sExpectedCatalogFixture) {
                return oFixture.expectedCatalogs.indexOf(sExpectedCatalogFixture) > -1;
            }).every(function (bExists) {
                return bExists === true;
            });

            if (!bFixtureOk) {
                throw new Error("Fixture '" + oFixture.testDescription + "' is invalid. "
                    + "One or more of " + Object.keys(oFixture.expectedCatalogTiles).join(", ")
                    + " from expectedCatalogTiles should be also present in the 'expectedCatalogs' member of the fixture.");
            }

            asyncTest("getCatalogs, then getCatalogTiles: returns the expected tiles when " + oFixture.testDescription, function () {
                var that = this;

                commonArrange();

                this.oAdapter.getCatalogs() // only .done handler should be called (tested above)
                    .done(function (aCatalogs) {

                        // build index of id -> catalog for faster lookup
                        var oCatalogsById = {};
                        aCatalogs.forEach(function (oCatalog) {
                            var sCatalogId = that.oAdapter.getCatalogId(oCatalog);
                            oCatalogsById[sCatalogId] = oCatalog;
                        });

                        // check for each desired catalog
                        var aPromises = Object.keys(oFixture.expectedCatalogTiles)
                            .map(function (sExpectedCatalogId) {
                                var oCatalog = oCatalogsById[sExpectedCatalogId];

                                return that.oAdapter.getCatalogTiles(oCatalog)
                                    .fail(function () {
                                        ok(false, "getCatalogTiles promise was resolved for catalog '" + sExpectedCatalogId + "'");
                                    })
                                    .done(function (aTiles) {
                                        ok(true, "getCatalogTiles promise was resolved for catalog '" + sExpectedCatalogId + "'");
                                        deepEqual(aTiles, oFixture.expectedCatalogTiles[sExpectedCatalogId],
                                            "got the expected catalog tiles");
                                    });
                            });

                        jQuery.when.apply(jQuery, aPromises).then(function () {
                            start();
                        });
                    });
            });
        }
    }); // end of forEach

    test("getCatalogTilePreviewIndicatorDataSource: returns the indicator data source of the catalog or group tile", function () {
        // Arrange
        var oExpectedIndicatorDataSource = {
            path: "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/PageSets('%2FUI2%2FFiori2LaunchpadHome')/Pages/$count",
            refresh: 900
        };

        // Act
        var oIndicatorDataSource = this.oAdapter.getCatalogTilePreviewIndicatorDataSource(O_LPA_CATALOG_TILES_EXPOSED.CustomTileApplication);

        // Assert
        deepEqual(oIndicatorDataSource, oExpectedIndicatorDataSource, "The function getCatalogTilePreviewIndicatorDataSource returns the correct indicator data source.");
    });

    asyncTest("getCatalogs: adds contentProviderId only to catalogs that come from a content provider", function () {
        var that = this;

        // Arrange
        stubUsedServices(getFilteredSite(
            { catalogsFilter: ["cat1"] }), // one catalog from the main site
            {
                CommonDataModel: {
                    getExtensionSites: {
                        resolveWith: [{ // one site (with one catalog) from the extension site
                            providerId: "Provider",
                            success: true,
                            site: O_CDM_SITE_SERVICE_MOCK_DATA.contentProviderSiteWithOneCatalog
                        }]
                    }
                }
            });

        var aCatalogsFromProgress = [];

        // Act
        this.oAdapter.getCatalogs()
            .progress(function (oCatalog) {
                aCatalogsFromProgress.push(oCatalog);
            })
            .done(function (aCatalogs) {
                var oProviderCatalog,
                    oMainCatalog;

                aCatalogs.sort(function (oC1, oC2) {
                    // note: do not return a boolean as IE does not accept it
                    return that.oAdapter.getCatalogId(oC1) < that.oAdapter.getCatalogId(oC2) ? -1 : 1;
                });

                aCatalogsFromProgress.sort(function (oC1, oC2) {
                    // note: do not return a boolean as IE does not accept it
                    return that.oAdapter.getCatalogId(oC1) < that.oAdapter.getCatalogId(oC2) ? -1 : 1;
                });

                deepEqual(aCatalogs, aCatalogsFromProgress,
                    "the same catalogs that were notified are returned in the promise done handler");
                strictEqual(aCatalogs.length, 2,
                    "promise resolved with expected number of catalogs (one from main site, one from content provider)");

                oMainCatalog = aCatalogs.filter(function (oCatalog) {
                    return that.oAdapter.getCatalogId(oCatalog) === "cat1";
                })[0];

                oProviderCatalog = aCatalogs.filter(function (oCatalog) {
                    return that.oAdapter.getCatalogId(oCatalog) !== "cat1";
                })[0];

                strictEqual(oMainCatalog.hasOwnProperty("contentProviderId"), false,
                    "the main catalog does not have contentProviderId");
                strictEqual(oProviderCatalog.hasOwnProperty("contentProviderId"), true,
                    "the provider catalog has a contentProviderId member");
                strictEqual(oProviderCatalog.contentProviderId, "Provider",
                    "the provider catalog has the correct value for contentProviderId");

                start();
            });
    });
});

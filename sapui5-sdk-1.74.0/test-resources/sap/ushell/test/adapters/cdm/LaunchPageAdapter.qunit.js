// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.LaunchPageAdapter / CDM Version 3
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ushell/adapters/cdm/v3/LaunchPageAdapter",
    "sap/ushell/navigationMode",
    "sap/ushell/EventHub",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readHome",
    "sap/ushell/adapters/cdm/v3/utilsCdm",
    "sap/ushell/components/tiles/utils",
    "sap/ushell/services/Container"
], function (
    testUtils,
    utils,
    LaunchPageAdapter,
    navigationMode,
    oEventHub,
    ReadHomePageUtils,
    oUtilsCdm
    // tilesUtils
    // Container
) {
    "use strict";

    /* global assert, notStrictEqual, asyncTest, deepEqual, strictEqual, module, ok, sinon, start, test, QUnit */

    var O_CDM_SITE_SERVICE_MOCK_DATA = sap.ushell.test.data.cdm.commonDataModelService,
        O_CDM_SITE = O_CDM_SITE_SERVICE_MOCK_DATA.site,
        O_CSTR = sap.ushell.test.data.cdm.ClientSideTargetResolution.resolvedTileHashes,
        fnResolveTileIntentSpy,
        oLogLevel = jQuery.sap.log.Level;

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
                                var oNextSiteResolvedPromise = new Promise(function (fnResolve) {
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
                        isInPlaceConfiguredFor: function () { }
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
     * @returns {object} resolved tile
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

        if (!bIsCatalogTile) {
            oLaunchPageAdapter._mResolvedTiles[oTile.id] = createResolvedTile(sHash, bIsLink, false);
        }
    }

    /**
     * returns the resolved tile as cached within the adapter
     *
     * @param {object} [oLaunchPageAdapter]
     *  CDM LaunchPageAdapter instance to read the tile form
     * @param {object} sTileId
     *  tile to be read
     * @returns {object}
     *  resolved tile
     */
    function getResolvedTileFromAdapter (oLaunchPageAdapter, sTileId) {
        oLaunchPageAdapter = oLaunchPageAdapter || this.oAdapter;
        return oLaunchPageAdapter._mResolvedTiles[sTileId];
    }

    module("sap.ushell.adapters.cdm.v3.LaunchPageAdapter", {
        setup: function () {
            this.oAdapter = new LaunchPageAdapter(undefined, undefined, { config: {} });

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
                sap.ushell.navigationMode.computeNavigationModeForHomepageTiles,
                oUtilsCdm.mapOne,
                ReadHomePageUtils.getInbound,
                oEventHub.once,
                jQuery.sap.log.error
            );
        }
    });

    test("Confirm site with valid CDM version gets detected", function () {
        strictEqual(this.oAdapter.isSiteSupported({ "_version": "3.0.0" }), true, "3.0.0 is supported");
        strictEqual(this.oAdapter.isSiteSupported({ "_version": "3.0" }), true, "3.0 is supported");
        strictEqual(this.oAdapter.isSiteSupported({ "_version": "3" }), true, "3 is supported");
    });

    test("Confirm site with invalid CDM version gets detected", function () {
        strictEqual(this.oAdapter.isSiteSupported({ "_version": "2.0.0" }), false, "2.0.0 is not supported");
        strictEqual(this.oAdapter.isSiteSupported({ "_version": "3.0.1" }), false, "3.0.1 is not supported");
        strictEqual(this.oAdapter.isSiteSupported({ "site": "..." }), false, "missing version is not supported");
        strictEqual(this.oAdapter.isSiteSupported({ "_version": "Nonsense" }), false, "'Nonsense' is not supported");
    });

    test("Confirm max and min CDM versions supported by the adapter", function () {
        strictEqual(this.oAdapter.getCdmVersionsSupported().min.toString(), "3.0.0", "3.0.0 is the minimum version supported by the adapter");
        strictEqual(this.oAdapter.getCdmVersionsSupported().max.toString(), "3.0.0", "3.0.0 is the maximum version supported by the adapter");
    });

    test("check Interface", function () {
        strictEqual(typeof this.oAdapter.getGroups, "function", "method getGroups exists");
    });

    asyncTest("_ensureLoaded, success: bundle multiple parallel requests", function () {
        var that = this,
            oCurrentDeferred = new jQuery.Deferred(),
            oReturnedPromise1,
            oReturnedPromise2,
            oReturnedPromise3,
            fnGetSiteSpy = sinon.spy(function () {
                // store deferred, so it can be resolved later
                return oCurrentDeferred.promise();
            });

        sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {
            var fnGetServiceOriginal = sap.ushell.Container.getService;

            if (sServiceName === "CommonDataModel") {
                return { getSite: fnGetSiteSpy };
            }

            return fnGetServiceOriginal(sServiceName);
        });

        sinon.stub(that.oAdapter, "_ensureGroupItemsResolved", function () {
            return [new jQuery.Deferred().resolve([]).promise()];
        });

        // Act
        oReturnedPromise1 = that.oAdapter._ensureLoaded();
        oReturnedPromise2 = that.oAdapter._ensureLoaded();
        strictEqual(fnGetSiteSpy.callCount, 1, "callCount getSite");

        // Resolve to check that later calls are independent
        oCurrentDeferred.resolve(getFilteredSite({ groupsFilter: ["HOME"] }));

        // getSite returns new promise
        oCurrentDeferred = new jQuery.Deferred();

        oReturnedPromise1.done(function () {
            start();
            fnGetSiteSpy.reset();
            oReturnedPromise3 = that.oAdapter._ensureLoaded();
            // Assert
            strictEqual(fnGetSiteSpy.callCount, 1, "callCount getSite");
            strictEqual(oReturnedPromise1, oReturnedPromise2, "parallel requests are bundled");
            notStrictEqual(oReturnedPromise1, oReturnedPromise3, "later _ensureLoaded calls are independent");
        });
    });

    asyncTest("_ensureLoaded, failure: bundle multiple parallel requests", function () {
        var that = this,
            oCurrentDeferred = new jQuery.Deferred(),
            oReturnedPromise1,
            oReturnedPromise2,
            oReturnedPromise3,
            fnGetSiteSpy = sinon.spy(function () {
                // store deferred, so it can be resolved later
                return oCurrentDeferred.promise();
            });

        sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {
            var fnGetServiceOriginal = sap.ushell.Container.getService;

            if (sServiceName === "CommonDataModel") {
                return { getSite: fnGetSiteSpy };
            }

            return fnGetServiceOriginal(sServiceName);
        });

        sinon.stub(that.oAdapter, "_ensureGroupItemsResolved", function () {
            return [new jQuery.Deferred().resolve([]).promise()];
        });

        // Act
        oReturnedPromise1 = that.oAdapter._ensureLoaded();
        oReturnedPromise2 = that.oAdapter._ensureLoaded();
        strictEqual(fnGetSiteSpy.callCount, 1, "callCount getSite");

        // Resolve to check that later calls are independent
        oCurrentDeferred.reject("Failed by intention");

        // getSite returns new promise
        oCurrentDeferred = new jQuery.Deferred();

        oReturnedPromise1.done(function () {
            start();
            fnGetSiteSpy.reset();
            oReturnedPromise3 = that.oAdapter._ensureLoaded();
            // Assert
            strictEqual(fnGetSiteSpy.callCount, 1, "callCount getSite");
            strictEqual(oReturnedPromise1, oReturnedPromise2, "parallel requests are bundled");
            notStrictEqual(oReturnedPromise1, oReturnedPromise3, "later _ensureLoaded calls are independent");
        });
    });

    [
        {
            input: {
                sMethod: "addGroup",
                aParameters: ["My new group"]
            },
            output: { expectedFailHandlerArgs: ["Failed to add the group with title 'My new group' to the homepage. Cannot access site."] }
        }, {
            input: {
                sMethod: "setGroupTitle",
                aParameters: [
                    {
                        identification: {
                            id: "myGroupId",
                            title: "myOldTitle"
                        }
                    },
                    "My new title"
                ]
            },
            output: {
                expectedFailHandlerArgs: [
                    "myOldTitle",
                    "Failed to set new title for group with id 'myGroupId'. Cannot access site."
                ]
            }
        }, {
            input: {
                sMethod: "hideGroups",
                aParameters: [[]]
            },
            output: { expectedFailHandlerArgs: ["Failed to hide group. Cannot access site."] }
        }, {
            input: {
                sMethod: "moveGroup",
                aParameters: [
                    { identification: { id: "myGroupId" } },
                    3
                ]
            },
            output: { expectedFailHandlerArgs: ["Failed to move group with id 'myGroupId'. Cannot access site."] }
        }, {
            input: {
                sMethod: "removeGroup",
                aParameters: [{ identification: { id: "myGroupId" } }]
            },
            output: { expectedFailHandlerArgs: ["Failed to remove group with id 'myGroupId'. Cannot access site."] }
        }, {
            input: {
                sMethod: "resetGroup",
                aParameters: [{ identification: { id: "myGroupId" } }]
            },
            output: {
                expectedFailHandlerArgs: [
                    "Failed to reset group with id 'myGroupId'. Cannot access site.",
                    []
                ]
            }
        }, {
            input: {
                sMethod: "addTile",
                aParameters: [
                    {
                        id: "#App1-viaStatic",
                        appId: "AppDesc1",
                        tileIntent: "#App1-viaStatic",
                        isCatalogTile: true,
                        tileResolutionResult: O_CSTR["#App1-viaStatic"]
                    },
                    { identification: { id: "myGroupId" } }
                ],
                sForceUniqueId: "myCatalogTileId"
            },
            output: { expectedFailHandlerArgs: ["Failed to add tile with id 'myCatalogTileId' to group with id 'myGroupId'. Cannot access site."] }
        }, {
            input: {
                sMethod: "removeTile",
                aParameters: [
                    { identification: { id: "myGroupId" } },
                    { id: "myTileId" },
                    3
                ]
            },
            output: {
                expectedFailHandlerArgs: [
                    {},
                    "Failed to remove tile with id 'myTileId' from group with id 'myGroupId'. Cannot access site."
                ]
            }
        }, {
            input: {
                sMethod: "moveTile",
                aParameters: [
                    { id: "myTileId" },
                    3,
                    4,
                    { identification: { id: "mySourceGroupId" } },
                    { identification: { id: "myTargetGroupId" } }
                ]
            },
            output: { expectedFailHandlerArgs: ["Failed to move tile with id 'myTileId'. Cannot access site."] }
        }
    ].forEach(function (oFixture) {
        asyncTest("Personalization operation '" + oFixture.input.sMethod + "': getSite on CDM service fails", function () {
            var that = this,
                oServiceSpecifications,
                oGenerateUniqueIdStub,
                sGetSiteErrorMessage = "Cannot access site.";

            oServiceSpecifications = {
                CommonDataModel: {
                    getSite: {
                        errorMessage: sGetSiteErrorMessage,
                        shouldReject: true
                    }
                }
            };

            // Arrange
            stubUsedServices(getFilteredSite(), oServiceSpecifications);

            if (oFixture.input.aStubs) {
                oFixture.input.aStubs.forEach(function (oStubEntry) {
                    sinon.stub(jQuery.sap.getObject(oStubEntry.namespace, 0), oStubEntry.methodName).returns(oStubEntry.returnValue);
                });
            }

            if (oFixture.input.sForceUniqueId) {
                oGenerateUniqueIdStub = sinon.stub(utils, "generateUniqueId").returns(oFixture.input.sForceUniqueId);
            }

            // Act
            that.oAdapter[oFixture.input.sMethod].apply(that.oAdapter, oFixture.input.aParameters)
                .done(function () {
                    start();
                    ok(false, "Should never happen!");
                })
                .fail(function () {
                    // Assert
                    var oFailHandlerArgs = arguments;
                    start();
                    oFixture.output.expectedFailHandlerArgs.forEach(function (vArg, nIndex) {
                        deepEqual(oFailHandlerArgs[nIndex], vArg, "correct fail information passed");
                    });

                    // Restore stubs
                    if (oFixture.input.aStubs) {
                        oFixture.input.aStubs.forEach(function (oStubEntry) {
                            jQuery.sap.getObject(oStubEntry.namespace, 0)[oStubEntry.methodName].restore();
                        });
                    }
                    if (oFixture.input.sForceUniqueId) {
                        oGenerateUniqueIdStub.restore();
                    }
                });
        });
    });

    [
        {
            testDescription: "Call addGroup & pass the title",
            oInbound: {
                "semanticObject": "Shell",
                "action": "launchURL",
                "signature": {
                    "parameters": {
                        "sap-external-url": {
                            "required": true,
                            "filter": {
                                "value": "http://www.nytimes.com",
                                "format": "plain"
                            }
                        }
                    }
                }
            },
            sExpectedResult: "#Shell-launchURL?sap-external-url=http%3A%2F%2Fwww.nytimes.com"
        }, {
            testDescription: "more parameters",
            oInbound: {
                "semanticObject": "SO",
                "action": "action",
                "signature": {
                    "parameters": {
                        "abc": {
                            "required": true,
                            "filter": {
                                "value": "A B",
                                "format": "plain"
                            }
                        },
                        "def": {
                            "filter": {
                                "value": "UserDefaults.abc",
                                "format": "reference"
                            }
                        },
                        "hij": {
                            "required": true,
                            "defaultValue": { "value": "xyz" }
                        },
                        "klm": {
                            "required": true,
                            "filter": {
                                "value": "ko",
                                "format": "plain"
                            }
                        }
                    }
                }
            },
            sExpectedResult: "#SO-action?abc=A%20B&klm=ko"
        }, {
            testDescription: "no parameters",
            oInbound: {
                "semanticObject": "SO",
                "action": "abc",
                "signature": {}
            },
            sExpectedResult: "#SO-abc"
        }, {
            testDescription: "flawed",
            oInbound: {
                "semanticObject": "SO",
                "signature": {}
            },
            sExpectedResult: undefined
        }
    ].forEach(function (oFixture) {
        test("_toHashFromInbound: " + oFixture.testDescription, function () {
            // Act
            var sHash = this.oAdapter._toHashFromInbound(oFixture.oInbound, undefined);

            // assert
            deepEqual(sHash, oFixture.sExpectedResult, "correct inbound generated");
        });
    });

    [
        {
            testDescription: "targetOutbound w/o parameter",
            oOutbound: {
                "semanticObject": "Action",
                "action": "toappnavsample",
                "parameters": undefined
            },
            sExpectedHash: "#Action-toappnavsample"
        }, {
            testDescription: "targetOutbound with empty parameter object",
            oOutbound: {
                "semanticObject": "Action",
                "action": "toappnavsample",
                "parameters": {}
            },
            sExpectedHash: "#Action-toappnavsample"
        }, {
            testDescription: "targetOutbound with parameter malformatted",
            oOutbound: {
                "semanticObject": "Action",
                "action": "toappnavsample",
                "parameters": { "param1": { "value": "value1" } }
            },
            sExpectedHash: "#Action-toappnavsample"
        }, {
            testDescription: "targetOutbound with parameter",
            oOutbound: {
                "semanticObject": "Action",
                "action": "toappnavsample",
                "parameters": { "param1": { "value": { "value": "IamAValue" } } }
            },
            sExpectedHash: "#Action-toappnavsample?param1=IamAValue"
        }
    ].forEach(function (oFixture) {
        test("_toHashFromOutbound: " + oFixture.testDescription, function () {
            // Act
            var sHash = this.oAdapter._toHashFromOutbound(oFixture.oOutbound, undefined);

            // assert
            deepEqual(sHash, oFixture.sExpectedHash, "generated hash");
        });
    });

    [
        {
            testDescription: "when empty array of promises is provided",
            aMapToPromises: [],
            expectedResolveWith: []
        }, {
            testDescription: "when all promises are rejected",
            aMapToPromises: [
                { "reject": "error1" },
                { "reject": "error2" },
                { "reject": "error3" }
            ],
            expectedResolveWith: ["error1", "error2", "error3"]
        }, {
            testDescription: "when all promises are resolved",
            aMapToPromises: [
                { "resolve": "result1" },
                { "resolve": "result2" },
                { "resolve": "result3" }
            ],
            expectedResolveWith: ["result1", "result2", "result3"]
        }, {
            testDescription: "one promise resolves and one promise rejects",
            aMapToPromises: [ // test maps these value to resoved or rejected promises
                { "resolve": "result1" },
                { "reject": "error1" }
            ],
            expectedResolveWith: ["result1", "error1"]
        }
    ].forEach(function (oFixture) {
        asyncTest("_allPromisesDone: works as expected when " + oFixture.testDescription, function () {
            var iPromisesDone = 0;
            var aDeferreds = oFixture.aMapToPromises.map(function (/*oResolveOrReject*/) {
                return new jQuery.Deferred();
            });
            var aPromises = aDeferreds.map(function (oDeferred) {
                return oDeferred.promise();
            });

            this.oAdapter._allPromisesDone(aPromises).done(function (aPromiseResults) {
                ok(true, "promise was resolved");
                strictEqual(iPromisesDone, aPromises.length,
                    "promise was resolved after all the promises were resolved or rejected"
                );

                notStrictEqual(aPromiseResults, aPromises,
                    "the resulting promises are returned in a new array other than the original");

                deepEqual(aPromiseResults, oFixture.expectedResolveWith,
                    "promise resolved with the expected values");
            }).fail(function () {
                ok(false, "promise was resolved");
            }).always(function () {
                start();
            });

            aDeferreds.forEach(function (oDeferred, iIdx) {
                setTimeout(function () {
                    iPromisesDone++;
                    var oResolveReject = oFixture.aMapToPromises[iIdx];
                    var sResolveReject = Object.keys(oResolveReject)[0];
                    var sResolveRejectWith = oResolveReject[sResolveReject];
                    oDeferred[sResolveReject](sResolveRejectWith);
                }, 0);
            });
        });
    });

    [
        {
            testDescription: "no tiles or links are in the site group payload",
            oGroup: { payload: {} },
            aAssureGroupTilesResolvedStubReturns: [],
            aAssureGroupLinksResolvedStubReturns: [],
            expectedAssureGroupTilesCalled: false,
            expectedAssureGroupLinksCalled: false,
            expectedArrayOfPromiseLength: 0
        }, {
            testDescription: "only tiles are defined in the site group payload",
            oGroup: { payload: { tiles: [{ "the tiles": "group" }] } },
            aAssureGroupTilesResolvedStubReturns: [{ "tile1": "1" }, { "tile2": "2" }],
            aAssureGroupLinksResolvedStubReturns: [], // because no links were defined
            expectedAssureGroupTilesResolvedArgs: [[{ "the tiles": "group" }]],
            expectedAssureGroupLinksResolvedArgs: [],
            expectedAssureGroupTilesCalled: true,
            expectedAssureGroupLinksCalled: false,
            expectedArrayOfPromiseLength: 2
        }, {
            testDescription: "only links are defined in the site group payload",
            oGroup: {
                identification: { id: "some-id" }, // this is required when links are in the payload
                payload: { links: [{ "the links": "group" }] }
            },
            aAssureGroupTilesResolvedStubReturns: [],
            aAssureGroupLinksResolvedStubReturns: [{ "link1": "1" }, { "link2": "2" }], // because no links were defined
            expectedAssureGroupTilesResolvedArgs: [],
            expectedAssureGroupLinksResolvedArgs: [[{ "the links": "group" }]],
            expectedAssureGroupTilesCalled: false,
            expectedAssureGroupLinksCalled: true,
            expectedArrayOfPromiseLength: 2
        }, {
            testDescription: "both links and tiles are defined in the site group payload",
            oGroup: {
                identification: { id: "some-id" }, // this is required when links are in the payload
                payload: {
                    links: [{ "the links": "group" }],
                    tiles: [{ "the tiles": "group" }]
                }
            },
            aAssureGroupTilesResolvedStubReturns: [{ "tile1": "1" }, { "tile2": "2" }],
            aAssureGroupLinksResolvedStubReturns: [{ "link1": "1" }, { "link2": "2" }], // because no links were defined
            expectedAssureGroupTilesResolvedArgs: [[{ "the tiles": "group" }]],
            expectedAssureGroupLinksResolvedArgs: [[{ "the links": "group" }]],
            expectedAssureGroupTilesCalled: true,
            expectedAssureGroupLinksCalled: true,
            expectedArrayOfPromiseLength: 4
        }
    ].forEach(function (oFixture) {
        asyncTest("_ensureGroupItemsResolved: works as expected when " + oFixture.testDescription, function () {
            var oAssureGroupTilesResolvedStub = sinon.stub(this.oAdapter, "_ensureGroupTilesResolved"),
                oAssureGroupLinksResolvedStub = sinon.stub(this.oAdapter, "_ensureGroupLinksResolved"),
                oDummySite = { dummySite: true };

            oAssureGroupTilesResolvedStub.returns(oFixture.aAssureGroupTilesResolvedStubReturns);
            oAssureGroupLinksResolvedStub.returns(oFixture.aAssureGroupLinksResolvedStubReturns);

            var aPromisesGot = this.oAdapter._ensureGroupItemsResolved(oFixture.oGroup, oDummySite);

            strictEqual(jQuery.isArray(aPromisesGot), true,
                "returned an array");
            strictEqual(aPromisesGot.length, oFixture.expectedArrayOfPromiseLength,
                "the returned array contains the expected number of elements");

            var aPromisesExpected = [];
            // tiles get processed first
            oFixture.aAssureGroupTilesResolvedStubReturns.forEach(function (oResolvedTile) {
                aPromisesExpected.push(oResolvedTile);
            });
            oFixture.aAssureGroupLinksResolvedStubReturns.forEach(function (oResolvedLink) {
                aPromisesExpected.push(oResolvedLink);
            });

            deepEqual(aPromisesGot, aPromisesExpected, "method returned the expected result");


            var sNot1 = oFixture.expectedAssureGroupTilesCalled ? "" : "not";
            strictEqual(
                oAssureGroupTilesResolvedStub.callCount,
                oFixture.expectedAssureGroupTilesCalled ? 1 : 0,
                "the _ensureGroupTilesResolved method was " + sNot1 + " called"
            );

            var sNot2 = oFixture.expectedAssureGroupLinksCalled ? "" : "not";
            strictEqual(
                oAssureGroupLinksResolvedStub.callCount,
                oFixture.expectedAssureGroupLinksCalled ? 1 : 0,
                "the _ensureGroupLinksResolved method was " + sNot2 + " called"
            );

            if (oFixture.expectedAssureGroupTilesCalled) {
                deepEqual(
                    oAssureGroupTilesResolvedStub.getCall(0).args,
                    oFixture.expectedAssureGroupTilesResolvedArgs.concat(oDummySite),
                    "_ensureGroupTilesResolved was called with the expected arguments"
                );
            }

            if (oFixture.expectedAssureGroupLinksCalled) {
                deepEqual(
                    oAssureGroupLinksResolvedStub.getCall(0).args,
                    oFixture.expectedAssureGroupLinksResolvedArgs.concat(oDummySite),
                    "_ensureGroupLinksResolved was called with the expected arguments");
            }

            start();
        });
    });

    [
        {
            testDescription: "site tiles are undefined",
            aGroupTiles: undefined,
            resolveGroupTileStubReturns: [],
            expectedResolveGroupTileCallArgs: [/* no calls should be made */],
            expectedResolveGroupTileCalls: 0,
            expectedPromiseResult: []
        }, {
            testDescription: "no site tiles are given",
            aGroupTiles: [],
            resolveGroupTileStubReturns: [],
            expectedResolveGroupTileCallArgs: [/* no calls should be made */],
            expectedResolveGroupTileCalls: 0,
            expectedPromiseResult: []
        }, {
            testDescription: "a site tile is given and resolveGroupTilePromise resolves",
            aGroupTiles: [{ id: "tileId" }],
            resolveGroupTileStubReturns: ["resolve"], // a promise that resolves on the first call
            expectedResolveGroupTileCallArgs: [[{ "id": "tileId" }]],
            expectedResolveGroupTileCalls: 1,
            expectedPromiseResult: ["resolve"]
        }, {
            testDescription: "a site tile is given and resolveGroupTilePromise rejects",
            aGroupTiles: [{ id: "tileId" }],
            resolveGroupTileStubReturns: ["reject"],
            expectedResolveGroupTileCallArgs: [[{ "id": "tileId" }]],
            expectedResolveGroupTileCalls: 1,
            expectedPromiseResult: ["reject"]
        }, {
            testDescription: "two site tiles given and resolveGroupTilePromise resolves and rejects",
            aGroupTiles: [
                { id: "tileAId" },
                { id: "tileBId" }
            ],
            resolveGroupTileStubReturns: ["resolve", "reject"],
            expectedResolveGroupTileCallArgs: [
                [{ id: "tileAId" }], // first call
                [{ id: "tileBId" }] // second call
            ],
            expectedResolveGroupTileCalls: 2,
            expectedPromiseResult: ["resolve", "reject"]
        }
    ].forEach(function (oFixture) {
        asyncTest("_ensureGroupTilesResolved works as expected when "
            + oFixture.testDescription,
            function () {
                // arrange
                var oResolveGroupTileStub = sinon.stub(this.oAdapter, "_resolveGroupTile"),
                    oDummySite = {
                        dummySite: true
                    },
                    aActualResult = [];

                oFixture.resolveGroupTileStubReturns.forEach(function (sStubMethod, iCall) {
                    oResolveGroupTileStub.onCall(iCall).returns(
                        new jQuery.Deferred()[sStubMethod]({
                            resolveGroupTileStubReturns: sStubMethod
                        }).promise()
                    );
                });

                // act
                this.oAdapter._ensureGroupTilesResolved(oFixture.aGroupTiles, oDummySite).forEach(function (oPromise) {
                    oPromise.done(function () {
                        aActualResult.push("resolve");
                    }).fail(function () {
                        aActualResult.push("reject");
                    });
                });

                // assert
                strictEqual(oResolveGroupTileStub.callCount, oFixture.expectedResolveGroupTileCalls, "_resolveGroupTile was called " + oFixture.expectedResolveGroupTileCalls + " times");

                var iExpectedCallCount = oFixture.expectedResolveGroupTileCalls;
                for (var i = 0; i < iExpectedCallCount; i++) {
                    deepEqual(oResolveGroupTileStub.getCall(i).args, oFixture.expectedResolveGroupTileCallArgs[i].concat(oDummySite), "Call #" + (i + 1) + " to _resolveGroupTile was made with the expected arguments");
                }

                deepEqual(aActualResult, oFixture.expectedPromiseResult, "result is as expected");

                start();
            });
    });

    [
        {
            testDescription: "site tiles are undefined",
            aGroupLinks: undefined,
            resolveGroupTileStubReturns: [],
            expectedResolveGroupTileCallArgs: [ /* no calls should be made */],
            expectedResolveGroupTileCalls: 0,
            expectedPromiseResult: []
        }, {
            testDescription: "no site tiles are given",
            aGroupLinks: [],
            resolveGroupTileStubReturns: [],
            expectedResolveGroupTileCallArgs: [ /* no calls should be made */],
            expectedResolveGroupTileCalls: 0,
            expectedPromiseResult: []
        }, {
            testDescription: "a site tile is given and resolveGroupTilePromise resolves",
            aGroupLinks: [{ id: "tileId" }],
            resolveGroupTileStubReturns: ["resolve"], // a promise that resolves on the first call
            expectedResolveGroupTileCallArgs: [[{ "id": "tileId" }]],
            expectedResolveGroupTileCalls: 1,
            expectedPromiseResult: ["resolve"]
        }, {
            testDescription: "a site tile is given and resolveGroupTilePromise rejects",
            aGroupLinks: [{ id: "tileId" }],
            resolveGroupTileStubReturns: ["reject"],
            expectedResolveGroupTileCallArgs: [[{ "id": "tileId" }]],
            expectedResolveGroupTileCalls: 1,
            expectedPromiseResult: ["reject"]
        }, {
            testDescription: "two site tiles given and resolveGroupTilePromise resolves and rejects",
            aGroupLinks: [
                { id: "tileAId" },
                { id: "tileBId" }
            ],
            resolveGroupTileStubReturns: ["resolve", "reject"],
            expectedResolveGroupTileCallArgs: [
                [{ id: "tileAId" }], // first call
                [{ id: "tileBId" }] // second call
            ],
            expectedResolveGroupTileCalls: 2,
            expectedPromiseResult: ["resolve", "reject"]
        }
    ].forEach(function (oFixture) {
        asyncTest("_ensureGroupLinksResolved works as expected when "
            + oFixture.testDescription,
            function () {
                // arrange
                var oResolveGroupTileStub = sinon.stub(this.oAdapter, "_resolveGroupTile"),
                    oDummySite = {
                        dummySite: true
                    },
                    aActualResult = [];

                oFixture.resolveGroupTileStubReturns.forEach(function (sStubMethod, iCall) {
                    oResolveGroupTileStub.onCall(iCall).returns(
                        new jQuery.Deferred()[sStubMethod]({
                            resolveGroupTileStubReturns: sStubMethod
                        }).promise()
                    );
                });

                // act
                this.oAdapter._ensureGroupLinksResolved(oFixture.aGroupLinks, oDummySite).forEach(function (oPromise) {
                    oPromise.done(function () {
                        aActualResult.push("resolve");
                    }).fail(function () {
                        aActualResult.push("reject");
                    });
                });

                // assert
                strictEqual(oResolveGroupTileStub.callCount, oFixture.expectedResolveGroupTileCalls,
                    "_resolveGroupTile was called " + oFixture.expectedResolveGroupTileCalls + " times");

                var iExpectedCallCount = oFixture.expectedResolveGroupTileCalls;
                for (var i = 0; i < iExpectedCallCount; i++) {
                    deepEqual(oResolveGroupTileStub.getCall(i).args, oFixture.expectedResolveGroupTileCallArgs[i].concat(oDummySite), "Call #" + (i + 1) + " to _resolveGroupTile was made with the expected arguments");
                }

                deepEqual(aActualResult, oFixture.expectedPromiseResult, "result is as expected");

                start();
            });
    });

    [
        {
            testDescription: "oTile is undefined",
            oTile: undefined,
            oSite: {},
            expectedPromiseFailureResult: {
                logLevel: oLogLevel.ERROR,
                message: "Cannot resolve tile: oTile must be an object"
            }
        }, {
            testDescription: "oSite is undefined",
            oTile: { id: "tileId" },
            oSite: undefined,
            expectedPromiseFailureResult: {
                logLevel: oLogLevel.ERROR,
                message: "Cannot resolve tile: oSite must be an object"
            }
        }, {
            testDescription: "oTile.id is undefined",
            oTile: { id: "tileId" },
            oSite: {},
            expectedPromiseFailureResult: {
                logLevel: oLogLevel.ERROR,
                message: "Cannot resolve tile 'tileId': vizId must be specified"
            }
        }, {
            testDescription: "app not in site (dangling link)",
            oTile: { id: "tileId", vizId: "vizId" },
            oSite: {
                visualizations: {
                    vizId: {
                        vizType: "sap.ushell.StaticAppLauncher",
                        vizConfig: { "sap.flp": { target: { appId: "danglingAppRef" } } }
                    }
                },
                vizTypes: { "sap.ushell.StaticAppLauncher": {} }
            },
            expectedPromiseFailureResult: {
                logLevel: oLogLevel.INFO,
                message: "Tile 'tileId' filtered from result: no app descriptor found for appId 'danglingAppRef' (dangling app reference)"
            }
        }, {
            testDescription: "visualization not in site",
            oTile: { id: "tileId", vizId: "vizId" },
            oSite: {
                visualizations: {},
                vizTypes: { "sap.ushell.StaticAppLauncher": {} }
            },
            expectedPromiseFailureResult: {
                logLevel: oLogLevel.ERROR,
                message: "Cannot resolve tile 'tileId': no visualization found for vizId 'vizId'"
            }
        }, {
            testDescription: "visualization type not in site",
            oTile: { id: "tileId", vizId: "vizId" },
            oSite: {
                visualizations: {
                    vizId: {
                        vizType: "sap.ushell.StaticAppLauncher",
                        vizConfig: { "sap.flp": { target: { appId: "appId" } } }
                    }
                },
                vizTypes: {}
            },
            expectedPromiseFailureResult: {
                logLevel: oLogLevel.ERROR,
                message: "Cannot resolve tile 'tileId': no visualization type found for vizTypeId 'sap.ushell.StaticAppLauncher'"
            }
        }, {
            testDescription: "no inbound for referenced app",
            oTile: { id: "tileId", vizId: "vizId" },
            oSite: {
                visualizations: {
                    vizId: {
                        vizType: "sap.ushell.StaticAppLauncher",
                        vizConfig: { "sap.flp": { target: { appId: "appId" } } }
                    }
                },
                vizTypes: { "sap.ushell.StaticAppLauncher": {} },
                applications: {
                    appId: {
                        dummyAppDescriptor: true,
                        "sap.app": { crossNavigation: { inbounds: {} } }
                    }
                }
            },
            getInboundResult: undefined,
            expectedGetInboundFirstArgs: {
                dummyAppDescriptor: true,
                "sap.app": { crossNavigation: { inbounds: {} } }
            },
            expectedPromiseFailureResult: {
                logLevel: oLogLevel.ERROR,
                message: "Cannot resolve tile 'tileId': app 'appId' has no navigation inbound"
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("_resolveTileByVizId works as expected when " + oFixture.testDescription, function (assert) {
            // arrange
            var fnDone = assert.async(),
                oActualResult,
                fnGetInbound = sinon.spy(ReadHomePageUtils, "getInbound");

            // act
            oActualResult = this.oAdapter._resolveTileByVizId(oFixture.oTile, oFixture.oSite);

            // assert
            if (oFixture.expectedGetInboundArgs) {
                assert.strictEqual(fnGetInbound.callCount, 1, "expected getInbound to be called once");
                assert.deepEqual(fnGetInbound.firstCall.args[0], oFixture.expectedGetInboundArgs, "expected getInbound to be called with correct arguments");
            }
            if (oFixture.expectedPromiseFailureResult) {
                oActualResult.done(function () {
                    assert.fail("Expected promise to be rejected");
                }).fail(function (vFailureInfo) {
                    assert.deepEqual(vFailureInfo, oFixture.expectedPromiseFailureResult, "Result is as expected");
                });
            }

            fnDone();
        });
    });

    [
        {
            testDescription: "When navigation mode is present",
            navigationMode: "newWindow",
            oTile: { vizId: "tileId" },
            oSite: {
                visualizations: {
                    tileId: {
                        vizType: "sap.ushell.StaticAppLauncher",
                        vizConfig: {
                            "sap.flp": {
                                target: {
                                    appId: "appId",
                                    inboundId: "inboundId"
                                }
                            }
                        }
                    }
                },
                vizTypes: { "sap.ushell.StaticAppLauncher": {} },
                applications: { appId: { dummyAppDescriptor: true } }
            },
            getInboundResult: {
                inbound: {
                    action: "display",
                    semanticObject: "MobileTablet"
                }
            }
        }, {
            testDescription: "When navigation mode is not present",
            oTile: { vizId: "tileId" },
            oSite: {
                visualizations: {
                    tileId: {
                        vizType: "sap.ushell.StaticAppLauncher",
                        vizConfig: {
                            "sap.flp": {
                                target: {
                                    appId: "appId",
                                    inboundId: "inboundId"
                                }
                            }
                        }
                    }
                },
                vizTypes: { "sap.ushell.StaticAppLauncher": {} },
                applications: { appId: { dummyAppDescriptor: true } }
            },
            getInboundResult: {
                inbound: {
                    action: "staticTile",
                    semanticObject: "Shell"
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("_resolveTileByVizId works as expected with navigationMode " + oFixture.testDescription, function (assert) {
            // arrange
            var fnDone = assert.async(),
                fnMapOne = sinon.spy(oUtilsCdm, "mapOne"),
                oActualResult;

            sinon.stub(ReadHomePageUtils, "getInbound").returns(oFixture.getInboundResult);
            sinon.stub(navigationMode, "computeNavigationModeForHomepageTiles").returns(oFixture.navigationMode);

            // act
            oActualResult = this.oAdapter._resolveTileByVizId(oFixture.oTile, oFixture.oSite);

            // assert
            oActualResult.done(function (oResult) {
                assert.strictEqual(oResult.tileResolutionResult.navigationMode, oFixture.navigationMode, "correct nav Mode");
            });

            assert.strictEqual(fnMapOne.callCount, 1, "mapOne was called");
            assert.strictEqual(fnMapOne.firstCall.args[1], oFixture.getInboundResult.inbound,
                "inbound is given as oSrc. So title, subtitle ... deviceTypes from inbound are considered");
            fnDone();
        });
    });

    [
        {
            testDescription: "group tile",
            input: {
                sHash: "#App2-viaStatic",
                oTile: {
                    id: "foo",
                    target: {}
                }
            },
            expected: { isGroupTile: true }
        }, {
            testDescription: "oTile is undefined",
            input: {
                sHash: "#App2-viaStatic",
                oTile: undefined
            },
            expected: { isGroupTile: false }
        }, {
            testDescription: "empty object",
            input: {
                sHash: "#App2-viaStatic",
                oTile: {}
            },
            expected: { isGroupTile: false }
        }, {
            testDescription: "object with id only",
            input: {
                sHash: "#App2-viaStatic",
                oTile: {
                    id: "foo",
                    isCatalogTile: true
                }
            },
            expected: { isGroupTile: false }
        }, {
            testDescription: "object with target but without id",
            input: {
                sHash: "#App2-viaStatic",
                oTile: { target: {} }
            },
            expected: { isGroupTile: false }
        }
    ].forEach(function (oFixture) {
        // consider to move to LaunchPageAdapter.catalogs.qunit.js
        test("is*Tile methods for resolved tiles: " + oFixture.testDescription, function () {
            var bIsGroupTile,
                bIsFailedGroupTile,
                bIsFailedCatalogTile,
                oTile,
                bIsLink = false;
            // Arrange
            oTile = oFixture.input.oTile;
            // addResolvedTileToAdapter fails if tile is undefined
            addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oTile || { id: "x" }, bIsLink, false);

            // Act
            bIsGroupTile = this.oAdapter._isGroupTile(oFixture.input.oTile);
            bIsFailedGroupTile = this.oAdapter._isFailedGroupTile(oTile);
            bIsFailedCatalogTile = this.oAdapter._isFailedCatalogTile(oTile);

            // Assert
            strictEqual(bIsGroupTile, oFixture.expected.isGroupTile, "_isGroupTile");
            strictEqual(bIsFailedGroupTile, false, "_isFailedGroupTile is always false");
            strictEqual(bIsFailedCatalogTile, false, "_isFailedCatalogTile is always false");
        });
    });

    [
        {
            testDescription: "normal tile, bIsLink is undefined",
            input: {
                sHash: "#App1-viaStatic",
                oTile: {
                    "id": "tileId",
                    "bIsLink": undefined,
                    "target": {
                        "semanticObject": "SemanticObject",
                        "action": "action"
                    }
                }
            }
        }, {
            testDescription: "normal tile, bIsLink is false",
            input: {
                sHash: "#App1-viaStatic",
                oTile: {
                    "id": "tileId",
                    "bIsLink": false,
                    "target": {
                        "semanticObject": "SemanticObject",
                        "action": "action"
                    }
                }
            }
        }, {
            testDescription: "normal Link",
            input: {
                sHash: "#App1-viaStatic",
                oTile: {
                    "id": "tileId",
                    "target": {
                        "semanticObject": "SemanticObject",
                        "action": "action"
                    }
                }
            }
        }, {
            testDescription: "no group tile given",
            input: {
                sHash: "#App1-viaStatic",
                oTile: null
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("_getTileFromHash: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oExpectedResolvedTile = createResolvedTile(sHash);

            // Arrange
            stubUsedServices(getFilteredSite());

            // Act
            oAdapter._getTileFromHash(sHash)
                .fail(okFalseAndStart)
                .done(function (oResolvedTile) {
                    // Assert
                    deepEqual(oResolvedTile, oExpectedResolvedTile, "oResolvedTile");
                    start();
                });
        });
    });

    test("_getTileFromHash: multiple calls in parallel", function () {
        var oAdapter = this.oAdapter,
            oTileResolutionResult = {},
            fnResolveTileIntentSpy = sinon.spy(function () {
                var oDeferred = new jQuery.Deferred();

                setTimeout(function () {
                    oDeferred.resolve(oTileResolutionResult);
                }, 50); // should not resolve directly

                return oDeferred.promise(); // always returns a NEW deferred
            }),
            oStubClientSideTargetResolution = { resolveTileIntent: fnResolveTileIntentSpy },
            sHash = "#Hash-irrelevant",
            oTile = {};

        function attachHandlers (oDeferred) {
            oDeferred
                .fail(okFalseAndStart)
                .done(function (/*oResolvedTile*/) {
                    // Assert
                    // oResolvedTile is already tested in a different test
                    strictEqual(fnResolveTileIntentSpy.callCount, 1, "resolveTileIntent only called once");
                    start();
                });
        }

        // Arrange
        sinon.stub(sap.ushell.Container, "getService")
            .returns(oStubClientSideTargetResolution);

        // Act
        stop(2);
        attachHandlers(oAdapter._getTileFromHash(sHash, "", oTile));
        attachHandlers(oAdapter._getTileFromHash(sHash, "", oTile));
    });

    asyncTest("_getTileFromHash: Rejects as the resolution of a tile fails", function () {
        var that = this,
            sHash = "#Hash-irrelevant",
            oCstrStub = sinon.stub(sap.ushell.Container, "getService", function () {
                return {
                    resolveTileIntent: function () {
                        var oDeferred = new jQuery.Deferred();

                        setTimeout(function () {
                            oDeferred.reject("Something went wrong in CSTR!");
                        }, 0);

                        return oDeferred.promise();
                    }
                };
            });

        // Act
        that.oAdapter._getTileFromHash(sHash)
            .done(function () {
                start();
                ok(false, "should never happen!");
                oCstrStub.restore();
            })
            .fail(function (sErrorMessage) {
                start();
                strictEqual(sErrorMessage, "Hash '" + sHash + "' could not be resolved to a tile. Something went wrong in CSTR!", "correct error message returned");
                oCstrStub.restore();
            });
    });

    QUnit.test("getTileId FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileId();
        });
    });

    test("getTileId", function () {
        var oAdapter = this.oAdapter,
            sExpectedTileId = "tile_id",
            oInputTile = { id: sExpectedTileId },
            sId;

        // act
        sId = oAdapter.getTileId(oInputTile);

        // assert
        strictEqual(sId, sExpectedTileId, "tile id");
    });

    QUnit.test("getGroups, getGroupId, getGroupTitle FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getGroups();
        });
        // assert
        assert.throws(function () {
            // act
            oAdapter.getGroupId();
        });
        // assert
        assert.throws(function () {
            // act
            oAdapter.getGroupTitle();
        });
    });

    [
        {
            testDescription: "no groups",
            input: { aGroupIds: [] },
            output: {
                aExpectedGroupIds: ["generatedId"],
                aExpectedGroupTitles: ["Home"]
            }
        }, {
            testDescription: "home only",
            input: { aGroupIds: ["HOME"] },
            output: {
                aExpectedGroupIds: ["HOME"],
                aExpectedGroupTitles: ["HOME Apps"]
            }
        }, {
            testDescription: "two groups",
            input: { aGroupIds: ["HOME", "ONE"] },
            output: {
                aExpectedGroupIds: ["HOME", "ONE"],
                aExpectedGroupTitles: ["HOME Apps", "ONE Apps"]
            }
        }, {
            testDescription: "two groups (different order)",
            input: { aGroupIds: ["ONE", "HOME"] },
            output: {
                aExpectedGroupIds: ["ONE", "HOME"],
                aExpectedGroupTitles: ["ONE Apps", "HOME Apps"]
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("getGroups, getGroupId, getGroupTitle: returns groups in order - " + oFixture.testDescription, function () {
            var that = this;
            // arrange
            stubUsedServices(getFilteredSite({
                groupsFilter: oFixture.input.aGroupIds.slice() // create a copy of the array to avoid modification
            }));
            sinon.stub(utils, "generateUniqueId").returns("generatedId");
            sinon.stub(navigationMode, "computeNavigationModeForHomepageTiles").returns();

            // act
            this.oAdapter.getGroups().done(function (aGroups) {
                // assert
                strictEqual(aGroups.length, oFixture.output.aExpectedGroupIds.length,
                    "returned correct number of groups");
                oFixture.output.aExpectedGroupIds.forEach(function (sExpectedGroupId, iIndex) {
                    // as aGroups contains 'anonymous' objects which shall not be used directly
                    // getGroupId and getGroupTitle are used as a stable way to check that
                    var sGroupId = that.oAdapter.getGroupId(aGroups[iIndex]),
                        sGroupTitle = that.oAdapter.getGroupTitle(aGroups[iIndex]),
                        sExpectedGroupTitle = oFixture.output.aExpectedGroupTitles[iIndex];

                    strictEqual(sGroupId, sExpectedGroupId, "getGroupId '" + sGroupId + "'");
                    strictEqual(sGroupTitle, sExpectedGroupTitle, "getGroupTitle '" + sGroupTitle + "'");
                });
                start();
            });
        });
    });

    asyncTest("getGroups: Resolves to an empty array as _ensureLoaded failed", function () {
        var that = this;

        sinon.stub(that.oAdapter, "_ensureLoaded", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.reject("Something went wrong!");
            return oDeferred.promise();
        });

        that.oAdapter.getGroups()
            .fail(function () {
                start();
                ok(false, "should never happen");
            })
            .done(function (aGroups) {
                start();
                deepEqual(aGroups, [], "getGroups resolved to an empty array");
                ok(that.oAdapter._ensureLoaded.called, true, "_ensureLoaded has been called");
            });
    });

    asyncTest("getGroups: calling it twice will give the same result", function () {
        var that = this;

        // arrange
        stubUsedServices(getFilteredSite({
            groupsFilter: [
                // no default group!
                "GroupWithOneTile",
                "ONE",
                "TWO",
                "EMPTY"
            ]
        }));
        // Note: generateUniqueId is not stubbed on purpose!
        // This ensures that the default is only generated once!

        // act
        that.oAdapter.getGroups()
            .fail(function () {
                start();
                ok(false, "should never happen: first getGroups call failed");
            })
            .done(function (aGroupsFirstCall) {
                // remember a copy of the groups array so it can be ensured it
                // is not modified during the second call
                var aGroupsFirstCallCopy = aGroupsFirstCall.slice();

                that.oAdapter.getGroups()
                    .fail(function () {
                        start();
                        ok(false, "should never happen: second getGroups call failed");
                    })
                    .done(function (aGroupsSecondCall) {
                        start();

                        // assert
                        deepEqual(aGroupsFirstCallCopy, aGroupsSecondCall, "getGroups resolved to the same array content");
                        //  maybe it would be handy if it would resolve to the same array,
                        // but this cannot be ensured in all cases, e.g. if something was added
                        notStrictEqual(aGroupsFirstCall, aGroupsSecondCall, "getGroups resolved NOT to the same array");
                    });
            });
    });

    asyncTest("_ensureLoaded: Site could not be accessed", function () {
        var that = this,
            oServiceSpecifications;

        oServiceSpecifications = {
            CommonDataModel: {
                getSite: {
                    errorMessage: "Cannot get site",
                    shouldReject: true
                }
            }
        };

        // Arrange
        stubUsedServices(getFilteredSite({
            groupsFilter: ["HOME", "ONE"]
        }), oServiceSpecifications);

        // Act
        that.oAdapter._ensureLoaded()
            .done(function (aLoadedGroups) {
                // Assert
                start();
                deepEqual(aLoadedGroups, [], "Resolved to an empty array, as site could not be accessed!");
            })
            .fail(function (/*sErrorMessage*/) {
                start();
                ok(false, "Should never happen!");
            });
    });

    asyncTest("_ensureLoaded: One of the loaded groups is defined as default group", function () {
        var that = this,
            fnGetService = sap.ushell.Container.getService;

        // Arrange
        sinon.stub(navigationMode, "computeNavigationModeForHomepageTiles").returns();
        sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {
            if (sServiceName === "CommonDataModel") {
                return {
                    getSite: function () {
                        var oDeferred = new jQuery.Deferred(),
                            oSite = jQuery.extend(true, {}, O_CDM_SITE);
                        // Set first group as default group
                        oSite.groups.HOME.payload.isDefaultGroup = true;

                        oDeferred.resolve(oSite);
                        return oDeferred.promise();
                    }
                };
            }
            // call original sap.ushell.Container.getService
            return fnGetService(sServiceName);
        });

        // Act
        that.oAdapter._ensureLoaded()
            .done(function (aLoadedGroups) {
                that.oAdapter.getDefaultGroup()
                    .done(function (oDefaultGroup) {
                        // Assert
                        start();
                        deepEqual(oDefaultGroup, aLoadedGroups[0], "default group set correctly");
                    })
                    .fail(function () {
                        start();
                        ok(false, "Should never happen!");
                    });
            })
            .fail(function (/*sErrorMessage*/) {
                start();
                ok(false, "Should never happen!");
            });
    });

    asyncTest("getDefaultGroup: Rejects as _ensureLoaded fails", function () {
        var that = this;

        // Arrange
        that.oAdapter._oDefaultGroup = undefined;

        sinon.stub(that.oAdapter, "_ensureLoaded", function () {
            return new jQuery.Deferred().reject("Something went wrong!").promise();
        });

        // Act
        that.oAdapter.getDefaultGroup()
            .done(function () {
                start();
                ok(false, "Should never happen!");
            })
            .fail(function (sErrorMessage) {
                start();
                strictEqual(sErrorMessage, "Failed to access default group. Something went wrong!", "correct error message returned");
            });
    });

    [
        {
            testDescription: "link index given",
            input: {
                aGroupIds: ["ONE"],
                sTileId: "static_link_1",
                bTileIndexGiven: true
            },
            output: { aExpectedTileIdsInOrder: ["dyna_link_1"] }
        }, {
            testDescription: "link not index given",
            input: {
                aGroupIds: ["ONE"],
                sTileId: "static_link_1",
                bTileIndexGiven: false
            },
            output: { aExpectedTileIdsInOrder: ["dyna_link_1"] }
        }, {
            testDescription: "tile index given",
            input: {
                aGroupIds: ["ONE"],
                sTileId: "static_tile_1",
                bTileIndexGiven: true
            },
            output: { aExpectedTileIdsInOrder: ["dyna_tile_1"] }
        }, {
            testDescription: "without tile index given",
            input: {
                aGroupIds: ["ONE"],
                sTileId: "static_tile_1",
                bTileIndexGiven: false
            },
            output: { aExpectedTileIdsInOrder: ["dyna_tile_1"] }
        }
    ].forEach(function (oFixture) {
        asyncTest("removeTile - " + oFixture.testDescription, function () {
            // arrange
            var that = this,
                oGroup = O_CDM_SITE.groups[oFixture.input.aGroupIds[0]],
                oTileToBeRemoved,
                iTileIndex,
                sPayloadType = "tiles",
                oRiginalTileType = that.oAdapter.getTileType;

            ["tiles", "links"].forEach(function (tileType) {
                // Get tile which should be removed and the position in the tiles array
                O_CDM_SITE.groups[oFixture.input.aGroupIds[0]].payload[tileType].forEach(function (oTileEntry, iIndex) {
                    if (oTileEntry.id === oFixture.input.sTileId) {
                        if (oFixture.input.bTileIndexGiven === true) {
                            iTileIndex = iIndex;
                        }

                        if (tileType === "links") {
                            //The index of link should be added after the indexes of tiles
                            iTileIndex += O_CDM_SITE.groups[oFixture.input.aGroupIds[0]].payload.tiles.length;
                            sPayloadType = "links";

                            that.oAdapter.getTileType = function () {
                                return that.oAdapter.TileType.Link;
                            };
                        }

                        oTileToBeRemoved = oTileEntry;
                    }
                });
            });

            stubUsedServices(getFilteredSite({
                groupsFilter: oFixture.input.aGroupIds
            }));

            // act
            that.oAdapter.removeTile(oGroup, oTileToBeRemoved, iTileIndex).done(function () {
                // assert
                sap.ushell.Container.getService("CommonDataModel").getSite()
                    .done(function (oSite) {
                        start();
                        var aTileIds = oSite.groups[oFixture.input.aGroupIds[0]].payload[sPayloadType]
                            .map(function (oTileEntry) {
                                return oTileEntry.id;
                            });
                        deepEqual(aTileIds, oFixture.output.aExpectedTileIdsInOrder, "tile removed");
                    })
                    .fail(function (sErrorMsg) {
                        start();
                        ok(false, "should never happen!");
                    });
            }).fail(function () {
                start();
                ok(false, "should never happen!");
            });

            that.oAdapter.getTileType = oRiginalTileType;
        });
    });

    [
        {
            testDescription: "instantiated tile with visible handler notified that visibility changed to true (initially)",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: { tileSetVisible: sinon.stub() },
                bCachedVisibilityBefore: undefined,
                bNewVisibility: true
            },
            expected: {
                cachedVisibilityAfter: true,
                tileSetVisibleArgument: true
            }
        }, {
            testDescription: "instantiated tile with visible handler notified that visibility changed to false (initially)",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: { tileSetVisible: sinon.stub() },
                bCachedVisibilityBefore: undefined,
                bNewVisibility: false
            },
            expected: {
                cachedVisibilityAfter: false,
                tileSetVisibleArgument: false
            }
        }, {
            testDescription: "instantiated tile with visible handler notified that visibility changed to true (after false)",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: { tileSetVisible: sinon.stub() },
                bCachedVisibilityBefore: false, // earlier notified about this
                bNewVisibility: true
            },
            expected: {
                cachedVisibilityAfter: true,
                tileSetVisibleArgument: true
            }
        }, {
            testDescription: "instantiated tile with visible handler notified that visibility changed to false (after true)",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: { tileSetVisible: sinon.stub() },
                bCachedVisibilityBefore: true, // earlier notified about this
                bNewVisibility: false
            },
            expected: {
                cachedVisibilityAfter: false,
                tileSetVisibleArgument: false
            }
        }, {
            testDescription: "instantiated tile with visible handler NOT notified when called multiple times with true",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: { tileSetVisible: sinon.stub() },
                bCachedVisibilityBefore: true, // earlier notified about this
                bNewVisibility: true
            },
            expected: {
                cachedVisibilityAfter: true,
                tileSetVisibleArgument: null // do not notify again
            }
        }, {
            testDescription: "instantiated tile with visible handler NOT notified when called multiple times with false",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: { tileSetVisible: sinon.stub() },
                bCachedVisibilityBefore: false, // earlier notified about this
                bNewVisibility: false
            },
            expected: {
                cachedVisibilityAfter: false,
                tileSetVisibleArgument: null // do not notify again
            }
        }, {
            testDescription: "ignore instantiated tiles without visible handler",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: { /* no tileSetVisible handler */ },
                bCachedVisibilityBefore: undefined,
                bNewVisibility: true
            },
            expected: {
                cachedVisibilityAfter: true, // actually there is no need to cache it in this scenario,
                // but for simplicity and consistency it is cached
                tileSetVisibleArgument: null // notify not possible
            }
        }, {
            // NOTE: The DashboardManager does this!
            testDescription: "ignore non-instantiated tiles completely", //TODO this needs to be improved
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: undefined,
                bCachedVisibilityBefore: undefined,
                bNewVisibility: true
            },
            expected: {
                cachedVisibilityAfter: true, // cache it for later when the tile gets instantiated
                tileSetVisibleArgument: null // notify not possible
            }
        }
    ].forEach(function (oFixture) {
        test("setTileVisible: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oTile = oFixture.input.oTile,
                oTileComponent = oFixture.input.oTileComponent,
                bNewVisibility = oFixture.input.bNewVisibility,
                bExpectHandlerToBeCalled = typeof oFixture.expected.tileSetVisibleArgument === "boolean",
                oResolvedTile;

            // arrange
            addResolvedTileToAdapter(oAdapter, sHash, oTile, false);
            oResolvedTile = getResolvedTileFromAdapter(oAdapter, oTile.id);
            oResolvedTile.visibility = oFixture.input.bCachedVisibilityBefore;
            if (oTileComponent) {
                oResolvedTile.tileComponent = oTileComponent;
            }

            // act
            oAdapter.setTileVisible(oTile, bNewVisibility);

            // assert
            strictEqual(oResolvedTile.visibility, oFixture.expected.cachedVisibilityAfter, "visiblity is cached");
            if (oTileComponent && oTileComponent.tileSetVisible) { // tileSetVisible is optional to be implemented
                strictEqual(oTileComponent.tileSetVisible.callCount, bExpectHandlerToBeCalled ? 1 : 0, "tileSetVisible call count");
                if (bExpectHandlerToBeCalled) {
                    strictEqual(oTileComponent.tileSetVisible.firstCall.args[0], oFixture.expected.tileSetVisibleArgument, "tile component notified about visiblity");
                }
            }
        });
    });

    test("setTileVisible: ignore tiles which could not be resolved", function () {
        // arrange
        // on purpose do not call addResolvedTileToAdapter!

        // act
        this.oAdapter.setTileVisible({ id: "tile" }, true);

        // assert
        ok(true, "no exception was thrown; the tile was simply ignored");
    });

    [
        {
            testDescription: "instantiated tile with visible handler notified that visibility changed to true (initially)",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: { tileRefresh: sinon.stub() }
            },
            expected: { tileRefreshCalled: true }
        }, {
            testDescription: "ignore instantiated tiles without refresh handler",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: { /* no tileSetVisible handler */ }
            },
            expected: {
                ignored: true,
                tileRefreshCalled: false
            }
        }, {
            // NOTE: The DashboardManager does this!
            testDescription: "ignore non-instantiated tiles completely", //TODO this needs to be improved
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                oTileComponent: undefined
            },
            expected: {
                ignored: true,
                tileRefreshCalled: false
            }
        }
    ].forEach(function (oFixture) {
        test("refreshTile: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oTile = oFixture.input.oTile,
                oTileComponent = oFixture.input.oTileComponent,
                oResolvedTile;

            // arrange
            addResolvedTileToAdapter(oAdapter, sHash, oTile, false);
            oResolvedTile = getResolvedTileFromAdapter(oAdapter, oTile.id);
            if (oTileComponent) {
                oResolvedTile.tileComponent = oTileComponent;
            }

            // act
            oAdapter.refreshTile(oTile);

            // assert
            if (oFixture.expected.tileRefreshCalled) { // tileRefresh is optional to be implemented
                strictEqual(oTileComponent.tileRefresh.callCount, 1, "tileRefresh call count");
            }

            if (oFixture.expected.ignored) {
                ok(true, "no exception thrown");
            }
        });
    });

    test("refreshTile: ignore tiles which could not be resolved", function () {
        // arrange
        // on purpose do not call addResolvedTileToAdapter!

        // act
        this.oAdapter.refreshTile({ id: "tile" }, true);

        // assert
        ok(true, "no exception was thrown; the tile was simply ignored");
    });

    [
        {
            testDescription: "tile is notified to be visible directly after instantiation",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                bVisibilityBeforeInstantiation: false,
                bVisibilityAfterInstantiation: true
            },
            expected: {
                tileSetVisibleFinalCallCount: 2,
                tileSetVisibleCallArgs: [ // sinon args
                    [false], // first call
                    [true] // second call
                ]
            }
        }, {
            testDescription: "tile is notified only ONCE to be NOT visible directly after instantiation",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                bVisibilityBeforeInstantiation: false,
                bVisibilityAfterInstantiation: false
            },
            expected: {
                tileSetVisibleFinalCallCount: 1,
                tileSetVisibleCallArgs: [ // sinon args
                    [false] // first call
                ]
            }
        }, {
            testDescription: "tile is notified only ONCE to be visible directly after instantiation",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" },
                bVisibilityBeforeInstantiation: true,
                bVisibilityAfterInstantiation: true
            },
            expected: {
                tileSetVisibleFinalCallCount: 1,
                tileSetVisibleCallArgs: [ // sinon args
                    [true] // first call
                ]
            }
        }
    ].forEach(function (oFixture) {
        // NOTE:
        // In the FLP start-up flow the DashboardManager notifies all tiles that they
        // are not visible BEFORE their components are instantiated.
        // After instantiation only the visible tiles are informed about their new visibilty.

        asyncTest("Tile is notified about visibity directly after instantiation " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oTile = oFixture.input.oTile,
                oTileComponentFake = { tileSetVisible: sinon.stub() };

            // arrange
            addResolvedTileToAdapter(oAdapter, sHash, oTile, false);

            var oAppProperties = {
                componentHandle: {
                    getInstance: function () {
                        return oTileComponentFake;
                    }
                }
            };

            var oComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader");
            sinon.stub(oComponentLoader, "createComponent").returns(new jQuery.Deferred().resolve(oAppProperties).promise());

            // act #1
            oAdapter.setTileVisible( // BEFORE instantiation
                oTile,
                oFixture.input.bVisibilityBeforeInstantiation
            );
            oAdapter.getTileView(oTile).done(function () {
                // assert #1
                strictEqual(oTileComponentFake.tileSetVisible.callCount, 1,
                    "tileSetVisible was directly called after instantiation with the CACHED visibility");

                // act #2
                oAdapter.setTileVisible( // AFTER instantiation
                    oTile,
                    oFixture.input.bVisibilityAfterInstantiation
                );

                // assert #2
                strictEqual(
                    oTileComponentFake.tileSetVisible.callCount,
                    oFixture.expected.tileSetVisibleFinalCallCount,
                    "tileSetVisible final call count"
                );
                deepEqual(
                    oTileComponentFake.tileSetVisible.args,
                    oFixture.expected.tileSetVisibleCallArgs,
                    "tileSetVisible was called (1 or 2 calls) with the expected arguments"
                );
                start();
            });
        });
    });

    [
        {
            testDescription: "Empty group object",
            input: {
                oGroup: {},
                oTile: { id: "foo" },
                iIndex: 0
            },
            output: {
                oExpectedFailureGroup: {},
                sExpectedErrorMessage: "Failed to remove tile. No valid input parameters passed to removeTile method."
            }
        }, {
            testDescription: "undefined group object",
            input: {
                oGroup: undefined,
                oTile: { id: "foo" },
                iIndex: 0
            },
            output: {
                oExpectedFailureGroup: {},
                sExpectedErrorMessage: "Failed to remove tile. No valid input parameters passed to removeTile method."
            }
        }, {
            testDescription: "Empty tile object",
            input: {
                oGroup: { identification: { id: "foo" } },
                oTile: {},
                iIndex: 0
            },
            output: {
                oExpectedFailureGroup: {},
                sExpectedErrorMessage: "Failed to remove tile. No valid input parameters passed to removeTile method."
            }
        }, {
            testDescription: "undefined tile object",
            input: {
                oGroup: { identification: { id: "foo" } },
                oTile: undefined,
                iIndex: 0
            },
            output: {
                oExpectedFailureGroup: {},
                sExpectedErrorMessage: "Failed to remove tile. No valid input parameters passed to removeTile method."
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("removeTile fails - " + oFixture.testDescription, function () {
            // arrange
            stubUsedServices(getFilteredSite());
            // act
            this.oAdapter.removeTile(oFixture.input.oGroup, oFixture.input.oTile, oFixture.input.iIndex)
                .done(function (/*oMovedTile*/) {
                    start();
                    ok(false, "should never happen!");
                }).fail(function (oGroup, sErrorMsg) {
                    // assert
                    start();
                    deepEqual(oGroup, oFixture.output.oExpectedFailureGroup);
                    strictEqual(sErrorMsg, oFixture.output.sExpectedErrorMessage, "correct error message rejected.");
                });
        });
    });

    [
        {
            testDescription: "Move link within the same group in the link section.",
            input: {
                aGroupIds: ["ONE"],
                sSourceGroupId: "ONE",
                sTargetGroupId: "ONE",
                sTileIdToBeMoved: "static_link_1",
                iTargetIndex: 3,
                sTargetType: "link"
            },
            output: {
                aExpectedSourceGroupTileIdsInOrder: ["static_tile_1", "dyna_tile_1"],
                aExpectedTargetGroupTileIdsInOrder: ["dyna_link_1", "static_link_1"]
            }
        }, {
            testDescription: "Move link within group",
            input: {
                aGroupIds: ["ONE"],
                sSourceGroupId: "ONE",
                sTargetGroupId: "ONE",
                sTileIdToBeMoved: "static_link_1",
                iTargetIndex: 1,
                sTargetType: "tile"
            },
            output: { aExpectedSourceGroupTileIdsInOrder: ["static_tile_1", "static_link_1", "dyna_tile_1"] }
        }, {
            testDescription: "Move tile to link within group",
            input: {
                aGroupIds: ["ONE"],
                sSourceGroupId: "ONE",
                sTargetGroupId: "ONE",
                sTileIdToBeMoved: "static_tile_1",
                iTargetIndex: 3,
                sTargetType: "link"
            },
            output: { aExpectedSourceGroupTileIdsInOrder: ["dyna_tile_1"] }
        }, {
            testDescription: "Move link within different group",
            input: {
                aGroupIds: ["ONE", "HOME"],
                sSourceGroupId: "ONE",
                sTargetGroupId: "HOME",
                sTileIdToBeMoved: "static_link_1",
                iTargetIndex: 1,
                sTargetType: "link"
            },
            output: {
                aExpectedSourceGroupTileIdsInOrder: ["static_tile_1", "dyna_tile_1"],
                aExpectedTargetGroupTileIdsInOrder: ["static_link_1"]
            }
        }, {
            testDescription: "Move tile within group",
            input: {
                aGroupIds: ["ONE"],
                sSourceGroupId: "ONE",
                sTargetGroupId: "ONE",
                sTileIdToBeMoved: "static_tile_1",
                iTargetIndex: 1,
                sTargetType: "tile"
            },
            output: { aExpectedSourceGroupTileIdsInOrder: ["dyna_tile_1", "static_tile_1"] }
        }, {
            testDescription: "Move tile within group to the same position",
            input: {
                aGroupIds: ["ONE"],
                sSourceGroupId: "ONE",
                sTargetGroupId: "ONE",
                sTileIdToBeMoved: "static_tile_1",
                iTargetIndex: 0,
                sTargetType: "tile"
            },
            output: { aExpectedSourceGroupTileIdsInOrder: ["static_tile_1", "dyna_tile_1"] }
        }, {
            testDescription: "Move tile across groups",
            input: {
                aGroupIds: ["HOME", "ONE"],
                sSourceGroupId: "HOME",
                sTargetGroupId: "ONE",
                sTileIdToBeMoved: "static_tile_1",
                iTargetIndex: 2,
                sTargetType: "tile"
            },
            output: {
                aExpectedSourceGroupTileIdsInOrder: [],
                aExpectedTargetGroupTileIdsInOrder: ["static_tile_1", "dyna_tile_1", "static_tile_1"]
            }
        }, {
            testDescription: "Move tile from the middle to the end",
            input: {
                aGroupIds: ["DRAG_AND_DROP"],
                sSourceGroupId: "DRAG_AND_DROP",
                sTargetGroupId: "DRAG_AND_DROP",
                sTileIdToBeMoved: "static_tile_1",
                iTargetIndex: 4,
                sTargetType: "tile"
            },
            output: { aExpectedSourceGroupTileIdsInOrder: ["static_tile_0", "static_tile_2", "static_tile_3", "static_tile_4", "static_tile_1"] }
        }, {
            testDescription: "Move tiles in the middle of the group",
            input: {
                aGroupIds: ["DRAG_AND_DROP"],
                sSourceGroupId: "DRAG_AND_DROP",
                sTargetGroupId: "DRAG_AND_DROP",
                sTileIdToBeMoved: "static_tile_1",
                iTargetIndex: 3,
                sTargetType: "tile"
            },
            output: { aExpectedSourceGroupTileIdsInOrder: ["static_tile_0", "static_tile_2", "static_tile_3", "static_tile_1", "static_tile_4"] }
        }, {
            testDescription: "Move tiles from the end to the beginning of the group",
            input: {
                aGroupIds: ["DRAG_AND_DROP"],
                sSourceGroupId: "DRAG_AND_DROP",
                sTargetGroupId: "DRAG_AND_DROP",
                sTileIdToBeMoved: "static_tile_4",
                iTargetIndex: 0,
                sTargetType: "tile"
            },
            output: { aExpectedSourceGroupTileIdsInOrder: ["static_tile_4", "static_tile_0", "static_tile_1", "static_tile_2", "static_tile_3"] }
        }, {
            testDescription: "Move tiles back in the middle of the group",
            input: {
                aGroupIds: ["DRAG_AND_DROP"],
                sSourceGroupId: "DRAG_AND_DROP",
                sTargetGroupId: "DRAG_AND_DROP",
                sTileIdToBeMoved: "static_tile_3",
                iTargetIndex: 1,
                sTargetType: "tile"
            },
            output: { aExpectedSourceGroupTileIdsInOrder: ["static_tile_0", "static_tile_3", "static_tile_1", "static_tile_2", "static_tile_4"] }
        }
    ].forEach(function (oFixture) {
        asyncTest("moveTile - " + oFixture.testDescription, function () {
            // arrange
            var that = this,
                oTileToBeMoved,
                iSourceIndex,
                oSourceGroup = O_CDM_SITE.groups[oFixture.input.sSourceGroupId],
                oTargetGroup = O_CDM_SITE.groups[oFixture.input.sTargetGroupId],
                sTargetPayloadType = oFixture.input.sTargetType;

            // Get tile which should be moved and the source position in the tiles array
            ["tiles", "links"].forEach(function (tileType) {
                O_CDM_SITE.groups[oFixture.input.sSourceGroupId].payload[tileType].forEach(function (oTileEntry, iIndex) {
                    if (oTileEntry.id === oFixture.input.sTileIdToBeMoved) {
                        iSourceIndex = iIndex;
                        if (tileType === "links") {
                            iSourceIndex += O_CDM_SITE.groups[oFixture.input.aGroupIds[0]].payload.tiles.length;
                            sinon.stub(that.oAdapter, "getTileType").returns(that.oAdapter.TileType.Link); // returns "link";
                        }
                        oTileToBeMoved = oTileEntry;
                    }
                });
            });

            stubUsedServices(getFilteredSite({
                groupsFilter: oFixture.input.aGroupIds
            }));

            // act
            that.oAdapter.moveTile(oTileToBeMoved, iSourceIndex, oFixture.input.iTargetIndex, oSourceGroup, oTargetGroup, sTargetPayloadType).done(function (oMovedTile) {
                // assert
                sap.ushell.Container.getService("CommonDataModel").getSite()
                    .done(function (oSite) {
                        start();
                        var aSourceGroupTileIdsInOrder = oSite.groups[oFixture.input.sSourceGroupId].payload.tiles.map(function (oTileEntry) {
                            return oTileEntry.id;
                        }),
                            // move operation across groups
                            aTargetGroupTileIdsInOrder = oSite.groups[oFixture.input.sTargetGroupId].payload[sTargetPayloadType === "tile" ? "tiles" : "links"].map(function (oTileEntry) {
                                return oTileEntry.id;
                            });
                        if (oFixture.output.aExpectedSourceGroupTileIdsInOrder) {
                            deepEqual(aSourceGroupTileIdsInOrder, oFixture.output.aExpectedSourceGroupTileIdsInOrder);
                        }

                        if (oFixture.output.aExpectedTargetGroupTileIdsInOrder) {
                            deepEqual(aTargetGroupTileIdsInOrder, oFixture.output.aExpectedTargetGroupTileIdsInOrder);
                        }
                    })
                    .fail(function (/*sErrorMsg*/) {
                        start();
                        ok(false, "should never happen!");
                    });
            }).fail(function () {
                start();
                ok(false, "should never happen!");
            });
        });
    });

    [
        {
            testDescription: "Empty tile object",
            input: {
                oTile: {},
                iSourceIndex: 0,
                iTargetIndex: 0,
                oSourceGroup: { identification: { id: "foo" } },
                oTargetGroup: { identification: { id: "bar" } }
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "undefined tile object",
            input: {
                oTile: undefined,
                iSourceIndex: 0,
                iTargetIndex: 0,
                oSourceGroup: { identification: { id: "foo" } },
                oTargetGroup: { identification: { id: "bar" } }
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "undefined source index",
            input: {
                oTile: { id: "foo" },
                iSourceIndex: undefined,
                iTargetIndex: 0,
                oSourceGroup: { identification: { id: "foo" } },
                oTargetGroup: { identification: { id: "bar" } }
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "source index smaller than zero",
            input: {
                oTile: { id: "foo" },
                iSourceIndex: -1,
                iTargetIndex: 0,
                oSourceGroup: { identification: { id: "foo" } },
                oTargetGroup: { identification: { id: "bar" } }
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "undefined target index",
            input: {
                oTile: { id: "foo" },
                iSourceIndex: 0,
                iTargetIndex: undefined,
                oSourceGroup: { identification: { id: "foo" } },
                oTargetGroup: { identification: { id: "bar" } }
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "target index smaller than zero",
            input: {
                oTile: { id: "foo" },
                iSourceIndex: 0,
                iTargetIndex: -1,
                oSourceGroup: { identification: { id: "foo" } },
                oTargetGroup: { identification: { id: "bar" } }
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "undefined source group",
            input: {
                oTile: { id: "foo" },
                iSourceIndex: 0,
                iTargetIndex: -1,
                oSourceGroup: undefined,
                oTargetGroup: { identification: { id: "bar" } }
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "identification part of source group missing",
            input: {
                oTile: { id: "foo" },
                iSourceIndex: 0,
                iTargetIndex: -1,
                oSourceGroup: {},
                oTargetGroup: { identification: { id: "bar" } }
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "id of source group missing",
            input: {
                oTile: { id: "foo" },
                iSourceIndex: 0,
                iTargetIndex: -1,
                oSourceGroup: { identification: {} },
                oTargetGroup: { identification: { id: "bar" } }
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "undefined target group",
            input: {
                oTile: { id: "foo" },
                iSourceIndex: 0,
                iTargetIndex: -1,
                oSourceGroup: { identification: { id: "bar" } },
                oTargetGroup: undefined
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "identification part of target group missing",
            input: {
                oTile: { id: "foo" },
                iSourceIndex: 0,
                iTargetIndex: -1,
                oSourceGroup: { identification: { id: "bar" } },
                oTargetGroup: {}
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }, {
            testDescription: "id of target group missing",
            input: {
                oTile: { id: "foo" },
                iSourceIndex: 0,
                iTargetIndex: -1,
                oSourceGroup: { identification: { id: "bar" } },
                oTargetGroup: { identification: {} }
            },
            output: { sExpectedErrorMessage: "Invalid input parameters" }
        }
    ].forEach(function (oFixture) {
        asyncTest("moveTile fails - " + oFixture.testDescription, function () {
            // arrange
            stubUsedServices(getFilteredSite());
            // act
            this.oAdapter.moveTile(oFixture.input.oTile, oFixture.input.iSourceIndex,
                oFixture.input.iTargetIndex, oFixture.input.oSourceGroup, oFixture.input.oTargetGroup)
                .done(function (oMovedTile) {
                    start();
                    ok(false, "should never happen!");
                }).fail(function (sErrorMsg) {
                    // assert
                    start();
                    strictEqual(sErrorMsg, oFixture.output.sExpectedErrorMessage, "correct error message rejected.");
                });
        });
    });

    QUnit.test(
        "moveTile: handles error when call for `oCdmSiteService.getSite()` fails",
        function (assert) {
            var that = this;
            var fnGetServiceOriginal = sap.ushell.Container.getService;

            var fnDone = assert.async();
            var oFixture = {
                input: {
                    aGroupIds: ["ONE"],
                    sSourceGroupId: "ONE",
                    sTargetGroupId: "ONE",
                    sTileIdToBeMoved: "static_tile_1",
                    iTargetIndex: 0,
                    sTargetType: "tile"
                }
            };
            var sSaveFailedError = "site returned failed";

            var oTileToBeMoved,
                iSourceIndex,
                oSourceGroup = O_CDM_SITE.groups[oFixture.input.sSourceGroupId],
                oTargetGroup = O_CDM_SITE.groups[oFixture.input.sTargetGroupId],
                sTargetPayloadType = oFixture.input.sTargetType;

            // Arrange
            sinon.stub(jQuery.sap.log, "error");
            sap.ushell.Container.getService = function (sServiceName) {
                if (sServiceName !== "CommonDataModel") {
                    return fnGetServiceOriginal.apply(sap.ushell.Container, arguments);
                }

                return {
                    getSite: function () {
                        return (new jQuery.Deferred(function (oDeferred) {
                            oDeferred.reject("site returned failed");
                        }).promise());
                    }
                };
            };
            sap.ushell.Container.getService("CommonDataModel");

            // Get tile which should be moved and the source position in the tiles array
            ["tiles", "links"].forEach(function (tileType) {
                O_CDM_SITE.groups[oFixture.input.sSourceGroupId].payload[tileType].forEach(function (oTileEntry, iIndex) {
                    if (oTileEntry.id === oFixture.input.sTileIdToBeMoved) {
                        iSourceIndex = iIndex;
                        if (tileType === "links") {
                            iSourceIndex += O_CDM_SITE.groups[oFixture.input.aGroupIds[0]].payload.tiles.length;
                            sinon.stub(that.oAdapter, "getTileType").returns(that.oAdapter.TileType.Link); // returns "link";
                        }
                        oTileToBeMoved = oTileEntry;
                    }
                });
            });

            this.oAdapter.moveTile(oTileToBeMoved, iSourceIndex, oFixture.input.iTargetIndex, oSourceGroup, oTargetGroup, sTargetPayloadType)
                .done(function () {
                    assert.equal(jQuery.sap.log.error.callCount, 0, "No failure");
                    fnDone();
                })
                .fail(function (sError) {
                    var rErrorMessagePattern = new RegExp(sSaveFailedError);
                    var bLoggedErrorContainsSError = rErrorMessagePattern.test(jQuery.sap.log.error.args[0][0]);

                    assert.ok(jQuery.sap.log.error.calledOnce, "Logs an error message due to the failure");
                    assert.ok(bLoggedErrorContainsSError, "logged error message contains the error due to `site.save()`");
                    assert.ok(/site returned failed/.test(sError), "Expected error observed");
                    fnDone();
                });
        }
    );

    QUnit.test("moveTile: handles error when saving site fails", function (assert) {
        var that = this;
        var fnGetServiceOriginal = sap.ushell.Container.getService;
        var fnDone = assert.async();
        var oFixture = {
            input: {
                aGroupIds: ["ONE"],
                sSourceGroupId: "ONE",
                sTargetGroupId: "TWO",
                sTileIdToBeMoved: "static_tile_1",
                iTargetIndex: 1,
                sTargetType: "tile"
            }
        };
        var sSaveFailedError = "save failed";

        var oSite = stubUsedServices(getFilteredSite({
            groupsFilter: oFixture.input.aGroupIds
        }));

        var oTileToBeMoved,
            iSourceIndex,
            oSourceGroup = O_CDM_SITE.groups[oFixture.input.sSourceGroupId],
            oTargetGroup = O_CDM_SITE.groups[oFixture.input.sTargetGroupId],
            sTargetPayloadType = oFixture.input.sTargetType;

        // Arrange
        sinon.stub(jQuery.sap.log, "error");
        sap.ushell.Container.getService = function (sServiceName) {
            if (sServiceName !== "CommonDataModel") {
                return fnGetServiceOriginal.apply(sap.ushell.Container, arguments);
            }

            return {
                getSite: function () {
                    return jQuery.when(oSite);
                },
                save: function () {
                    return (new jQuery.Deferred(function (oDeferred) {
                        oDeferred.reject(sSaveFailedError);
                    }).promise());
                }
            };
        };
        sap.ushell.Container.getService("CommonDataModel");

        // Get tile which should be moved and the source position in the tiles array
        ["tiles", "links"].forEach(function (tileType) {
            O_CDM_SITE.groups[oFixture.input.sSourceGroupId].payload[tileType].forEach(function (oTileEntry, iIndex) {
                if (oTileEntry.id === oFixture.input.sTileIdToBeMoved) {
                    iSourceIndex = iIndex;
                    if (tileType === "links") {
                        iSourceIndex += O_CDM_SITE.groups[oFixture.input.aGroupIds[0]].payload.tiles.length;
                        sinon.stub(that.oAdapter, "getTileType").returns(that.oAdapter.TileType.Link); // returns "link";
                    }
                    oTileToBeMoved = oTileEntry;
                }
            });
        });

        this.oAdapter.moveTile(oTileToBeMoved, iSourceIndex, oFixture.input.iTargetIndex, oSourceGroup, oTargetGroup, sTargetPayloadType)
            .done(function () {
                assert.equal(jQuery.sap.log.error.callCount, 0, "Unexpected success");
                fnDone();
            })
            .fail(function (sError) {
                var rErrorMessagePattern = new RegExp(sSaveFailedError);
                var bLoggedErrorContainsSError = rErrorMessagePattern.test(jQuery.sap.log.error.args[0][0]);

                assert.ok(jQuery.sap.log.error.calledOnce, "Logs an error on failure");
                assert.ok(bLoggedErrorContainsSError, "logged error message contains the error due to `site.save()`");
                assert.ok(/save failed/.test(sError), "Expected error observed");
                fnDone();
            });
    });

    QUnit.test("getTileTitle: FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileTitle();
        });
    });

    [
        {
            testDescription: "Normal tile",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" }
            },
            expectedTitle: O_CSTR["#App1-viaStatic"].title
        }, {
            testDescription: "Tile overwrites title",
            input: {
                sHash: "#App1-viaStatic",
                oTile: {
                    id: "tile",
                    title: "title from tile"
                }
            },
            expectedTitle: "title from tile"
        }
    ].forEach(function (oFixture) {
        test("getTileTitle: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oTile = oFixture.input.oTile,
                sTitle;

            // arrange
            addResolvedTileToAdapter(oAdapter, sHash, oTile, false);

            // act
            sTitle = oAdapter.getTileTitle(oFixture.input.oTile);

            // assert
            strictEqual(sTitle, oFixture.expectedTitle, "returned title");
        });
    });

    [
        {
            testDescription: "tile does not have a title nor does the target resolution returns one",
            input: { oTile: { id: "unknown tile" } },
            expectedTitle: undefined
        }
    ].forEach(function (oFixture) {
        test("getTileTitle: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sTitle;

            // arrange

            // act
            sTitle = oAdapter.getTileTitle(oFixture.input.oTile);

            // assert
            strictEqual(sTitle, oFixture.expectedTitle, "returned Title");
        });
    });

    QUnit.test("getTileType: FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileType();
        });
    });

    QUnit.test("getTileType: Unregistered Tile", function (assert) {
        var oAdapter = this.oAdapter,
            oTile = {},
            sType,
            sExpectedType = "tile";

        // act
        sType = oAdapter.getTileType(oTile);

        // assert
        assert.strictEqual(sType, sExpectedType, "returned type");
    });

    [
        {
            testDescription: "Normal tile",
            input: {
                sHash: "#App1-viaStatic",
                bIsLink: false,
                oTile: { id: "tile" }
            },
            expectedType: "tile"
        }, {
            testDescription: "Link tile",
            input: {
                sHash: "#App1-viaStatic",
                bIsLink: true,
                oTile: { id: "tile" }
            },
            expectedType: "link"
        }, {
            testDescription: "Card",
            input: {
                sHash: "#App1-viaStatic-card",
                bIsLink: false,
                oTile: { id: "card" }
            },
            expectedType: "card"
        }, {
            testDescription: "Normal tile with no type provided.",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" }
            },
            expectedType: "tile"
        }
    ].forEach(function (oFixture) {
        QUnit.test("getTileType: " + oFixture.testDescription, function (assert) {
            var oAdapter = this.oAdapter,
                oTile = oFixture.input.oTile,
                sHash = oFixture.input.sHash,
                bIsLink = oFixture.input.bIsLink,
                sType;

            // arrange
            addResolvedTileToAdapter(oAdapter, sHash, oTile, bIsLink);

            // act
            sType = oAdapter.getTileType(oTile);

            // assert
            assert.strictEqual(sType, oFixture.expectedType, "returned type");
        });
    });

    QUnit.test("getLinkTiles: FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getLinkTiles();
        });
    });

    [
        {
            testDescription: "Group with links",
            input: {
                oGroup: {
                    identification: {
                        id: "some-id" // this is required when links are in the payload
                    },
                    payload: {
                        links: [{ "the links": "group" }],
                        // Note: Always there, see CommonDataModel service method
                        tiles: []
                    }
                }
            },
            expectedLinks: [{ "the links": "group" }]
        }, {
            testDescription: "Group with empty links array",
            input: {
                oGroup: {
                    payload: {
                        links: [],
                        // Note: Always there, see CommonDataModel service method
                        tiles: []
                    }
                }
            },
            expectedLinks: []
        }
    ].forEach(function (oFixture) {
        QUnit.test("getLinkTiles: " + oFixture.testDescription, function (assert) {
            var oAdapter = this.oAdapter,
                oGroup = oFixture.input.oGroup,
                aLinks;

            // act
            aLinks = oAdapter.getLinkTiles(oGroup);

            // assert
            assert.deepEqual(aLinks, oFixture.expectedLinks, "returned links");
        });
    });

    QUnit.test("isGroupVisible FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.isGroupVisible();
        });
    });

    [
        {
            testDescription: "Group visibility set to true",
            input: { oGroup: { identification: { isVisible: true } } },
            expectedVisibility: true
        }, {
            testDescription: "Group visibility set to false",
            input: { oGroup: { identification: { isVisible: false } } },
            expectedVisibility: false
        }, {
            testDescription: "Group visibility not set",
            input: { oGroup: { identification: {} } },
            expectedVisibility: true
        }
    ].forEach(function (oFixture) {
        QUnit.test("isGroupVisible: " + oFixture.testDescription, function (assert) {
            var oAdapter = this.oAdapter,
                oGroup = oFixture.input.oGroup,
                bIsVisible;

            // act
            bIsVisible = oAdapter.isGroupVisible(oGroup);

            // assert
            assert.strictEqual(bIsVisible, oFixture.expectedVisibility, "returned visibility");
        });
    });

    QUnit.test("getTileInfo FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileInfo();
        });
    });

    [
        {
            testDescription: "Normal tile",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" }
            },
            expectedInfo: O_CSTR["#App1-viaStatic"].info
        }, {
            testDescription: "Tile overwrites info",
            input: {
                sHash: "#App1-viaStatic",
                oTile: {
                    id: "tile",
                    info: "info from tile"
                }
            },
            expectedInfo: "info from tile"
        }
    ].forEach(function (oFixture) {
        test("getTileInfo: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oTile = oFixture.input.oTile,
                sInfo;

            // arrange
            addResolvedTileToAdapter(oAdapter, sHash, oTile, false);

            // act
            sInfo = oAdapter.getTileInfo(oFixture.input.oTile);

            // assert
            strictEqual(sInfo, oFixture.expectedInfo, "returned Info");
        });
    });

    QUnit.test("getTileSubtitle FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileSubtitle();
        });
    });

    [
        {
            testDescription: "Normal tile",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" }
            },
            expectedSubtitle: O_CSTR["#App1-viaStatic"].subTitle
        }, {
            testDescription: "Tile overwrites subtitle",
            input: {
                sHash: "#App1-viaStatic",
                oTile: {
                    id: "tile",
                    title: "title from tile",
                    subTitle: "subtitle from tile"
                }
            },
            expectedSubtitle: "subtitle from tile"
        }
    ].forEach(function (oFixture) {
        test("getTileSubtitle: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oTile = oFixture.input.oTile,
                sSubtitle;

            // arrange
            addResolvedTileToAdapter(oAdapter, sHash, oTile, false);

            // act
            sSubtitle = oAdapter.getTileSubtitle(oFixture.input.oTile);

            // assert
            strictEqual(sSubtitle, oFixture.expectedSubtitle, "returned subtitle");
        });
    });

    [
        {
            testDescription: "tile does not have a subtitle nor does the target resolution returns one",
            input: {
                oTile: {
                    id: "unknown tile",
                    title: "title from tile"
                }
            },
            expectedSubtitle: undefined
        }
    ].forEach(function (oFixture) {
        test("getTileSubtitle: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sSubtitle;

            // arrange

            // act
            sSubtitle = oAdapter.getTileSubtitle(oFixture.input.oTile);

            // assert
            strictEqual(sSubtitle, oFixture.expectedSubtitle, "returned subtitle");
        });
    });

    QUnit.test("getTileIcon FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileIcon();
        });
    });

    [
        {
            testDescription: "Normal tile",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" }
            },
            expectedIcon: O_CSTR["#App1-viaStatic"].icon
        }, {
            testDescription: "Tile overwrites icon",
            input: {
                sHash: "#App1-viaStatic",
                oTile: {
                    id: "tile",
                    title: "title from tile",
                    icon: "sap-icon://Fiori2/F0001"
                }
            },
            expectedIcon: "sap-icon://Fiori2/F0001"
        }
    ].forEach(function (oFixture) {
        test("getTileIcon: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oTile = oFixture.input.oTile,
                sIcon;

            // arrange
            addResolvedTileToAdapter(oAdapter, sHash, oTile, false);

            // act
            sIcon = oAdapter.getTileIcon(oFixture.input.oTile);

            // assert
            strictEqual(sIcon, oFixture.expectedIcon, "returned icon string");
        });
    });

    [
        {
            testDescription: "tile does not have an icon nor does the target resolution returns one",
            input: {
                oTile: {
                    id: "tile",
                    title: "title from tile"
                }
            },
            expectedIcon: undefined
        }
    ].forEach(function (oFixture) {
        test("getTileIcon: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sIcon;

            // arrange

            // act
            sIcon = oAdapter.getTileIcon(oFixture.input.oTile);

            // assert
            strictEqual(sIcon, oFixture.expectedIcon, "returned icon string");
        });
    });

    [
        {
            testDescription: "static applauncher",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" }
            },
            expectedResult: {}
        }, {
            testDescription: "dynamic applauncher",
            input: {
                sHash: "#App1-viaDynamic",
                oTile: { id: "tile" }
            },
            expectedResult: {
                indicatorDataSource: O_CSTR["#App1-viaDynamic"].indicatorDataSource
            }
        }, {
            testDescription: "dynamic applauncher but tile overwrites indicatorDataSource",
            input: {
                sHash: "#App1-viaDynamic",
                oTile: {
                    id: "tile",
                    title: "title from tile",
                    indicatorDataSource: {
                        "path": "/sap/opu/odata/snce/SRV;v=2/Foo$fitler=startswith(lastName, 'A') eq true", // entire service URL
                        "refresh": 10
                    }
                }
            },
            expectedResult: {
                indicatorDataSource: {
                    "path": "/sap/opu/odata/snce/SRV;v=2/Foo$fitler=startswith(lastName, 'A') eq true",
                    "refresh": 10
                }
            }
        }, {
            testDescription: "dynamic applauncher but tile overwrites indicatorDataSource incl datasource",
            input: {
                sHash: "#App1-viaDynamic",
                oTile: {
                    id: "tile",
                    title: "title from tile",
                    dataSource: {
                        foo: "bar" // any structure is taken (actually it would be the same structure as in sap.app/datasources/datasource)
                    },
                    indicatorDataSource: {
                        "path": "/sap/opu/odata/snce/SRV;v=2/Foo$fitler=startswith(lastName, 'A') eq true", // entire service URL
                        "refresh": 10
                    }
                }
            },
            expectedResult: {
                indicatorDataSource: {
                    "path": "/sap/opu/odata/snce/SRV;v=2/Foo$fitler=startswith(lastName, 'A') eq true",
                    "refresh": 10
                },
                dataSource: { foo: "bar" }
            }
        }, {
            testDescription: "dynamic applauncher: resolution with indicatorDataSouce but tile indicatorDataSource incl datasource are used",
            input: {
                sHash: "#Dynamic-dataSourceFromManifest",
                oTile: {
                    id: "tile",
                    title: "title from tile",
                    dataSource: {
                        foo: "bar" // any structure is taken (actually it would be the same structure as in sap.app/datasources/datasource)
                    },
                    indicatorDataSource: {
                        "path": "/sap/opu/odata/snce/SRV;v=2/Foo$fitler=startswith(lastName, 'A') eq true", // entire service URL
                        "refresh": 10
                    }
                }
            },
            expectedResult: {
                indicatorDataSource: {
                    "path": "/sap/opu/odata/snce/SRV;v=2/Foo$fitler=startswith(lastName, 'A') eq true",
                    "refresh": 10
                },
                dataSource: { foo: "bar" }
            }
        }, {
            testDescription: "resolved tile stays unchanged if the tile dataSource and indicatorDataSource are aligned with the component URI",
            input: {
                sHash: "#Dynamic-dataSourceAdjustToComponentUri",
                oTile: {
                    id: "tile",
                    title: "title from tile"
                },
                locationHref: "http://testhost.com/cp.portal/site#Shell-home"
            },
            expectedResult: {
                indicatorDataSource: {
                    dataSource: "odata",
                    "path": "TestTileDetails('TEST_TILE_DETAILS')"
                },
                dataSource: { uri: "../component.relative.uri/~12345678910~/test/test.odata.svc/" }
            }
        }, {
            testDescription: "dynamic applauncher with dataSource taken from app manifest",
            input: {
                sHash: "#Dynamic-dataSourceFromManifest",
                oTile: {}
            },
            expectedResult: {
                indicatorDataSource: {
                    "dataSource": "fooService",
                    "path": "/foo/bar/$count",
                    "refresh": 1000
                },
                dataSource: { "uri": "sap/opu/fooData/" }
            }
        }, {
            testDescription: "dynamic applauncher with indicatorDataSource w/o dataSource taken from app manifest",
            input: {
                sHash: "#Dynamic-noDataSourceFromManifest",
                oTile: {}
            },
            expectedResult: {
                indicatorDataSource: {
                    "path": "/foo/bar/$count",
                    "refresh": 1000
                }
            }
        }
    ].forEach(function (oFixture) {
        test("getTileIndicatorDatasource for : " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oTile = oFixture.input.oTile,
                oResult,
                oResolvedTileInitial,
                oResolvedTileResult,
                oStub;

            // arrange
            if (oFixture.input.locationHref) {
                oStub = sinon.stub(oAdapter, "getWindowLocationHref").returns(oFixture.input.locationHref);
            }
            addResolvedTileToAdapter(oAdapter, sHash, oTile, false);
            // keep a copy of an initially generated resolved tile
            oResolvedTileInitial = utils.clone(getResolvedTileFromAdapter(oAdapter, oTile.id));

            // act
            oResult = oAdapter.getTileIndicatorDataSource(oFixture.input.oTile);
            // get the state of the preserved tile after processing
            oResolvedTileResult = getResolvedTileFromAdapter(oAdapter, oTile.id);

            if (oFixture.input.locationHref) {
                oStub.restore();
            }

            // assert
            deepEqual(oResult, oFixture.expectedResult, "indicatorDataSource");
            // ensure the resolved tile is not changed.
            deepEqual(oResolvedTileResult, oResolvedTileInitial, "resolvedTile");
        });
    });

    QUnit.test("getTileSize FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileSize();
        });
    });

    [
        {
            testDescription: "1x1 tile",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" }
            },
            expectedSize: "1x1"
        }, {
            testDescription: "1x2 tile",
            input: {
                sHash: "#Shell-customTile",
                oTile: { id: "tile" }
            },
            expectedSize: O_CSTR["#Shell-customTile"].size
        }
    ].forEach(function (oFixture) {
        test("getTileSize: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oTile = oFixture.input.oTile,
                sSize;

            // arrange
            addResolvedTileToAdapter(oAdapter, sHash, oTile, false);

            // act
            sSize = oAdapter.getTileSize(oFixture.input.oTile);

            // assert
            strictEqual(sSize, oFixture.expectedSize, "returned size");
        });
    });

    QUnit.test("getTileTarget FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileTarget();
        });
    });

    [
        {
            testDescription: "Static App Launcher",
            input: {
                sHash: "#App1-viaStatic",
                oTile: { id: "tile" }
            },
            expectedUrl: "#App1-viaStatic"
        }, {
            testDescription: "Dynamic App Launcher",
            input: {
                sHash: "#App1-viaDynamic",
                oTile: { id: "tile" }
            },
            expectedUrl: "#App1-viaDynamic"
        }, {
            testDescription: "Custom tile",
            input: {
                sHash: "#Shell-customTile",
                oTile: { id: "tile" }
            },
            expectedUrl: "#Shell-customTile"
        }, {
            testDescription: "URL Bookmark tile",
            input: {
                sHash: null, // not needed as not resolved
                oTile: {
                    id: "tile",
                    title: "title",
                    target: { url: "http://www.sap.com" },
                    isBookmark: true
                }
            },
            expectedUrl: "http://www.sap.com"
        }
    ].forEach(function (oFixture) {
        test("getTileTarget: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sHash = oFixture.input.sHash,
                oTile = oFixture.input.oTile,
                sTarget;

            // arrange
            if (typeof sHash === "string") {
                addResolvedTileToAdapter(oAdapter, sHash, oTile, false);
            }

            // act
            sTarget = oAdapter.getTileTarget(oFixture.input.oTile);

            // assert
            strictEqual(sTarget, oFixture.expectedUrl, "returned URL");
        });
    });

    QUnit.test("getGroupTiles FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getGroupTiles();
        });
    });

    [
        {
            testDescription: "empty group",
            input: { sUsedGroupId: "EMPTY" },
            output: { aExpectedTiles: [] }
        }, {
            testDescription: "group with one tile",
            input: { sUsedGroupId: "GroupWithOneTile" },
            output: { aExpectedTiles: [{ id: "tile2", title: "title - Static App Launcher 1" }] }
        }, {
            testDescription: "group with multiple tiles and links",
            input: { sUsedGroupId: "ONE" },
            output: {
                aExpectedTiles: [
                    { id: "static_tile_1", title: "title - Static App Launcher 1" },
                    { id: "dyna_tile_1", title: "Overwrite me in ONE" },
                    { id: "static_link_1", title: "Link: title - Static App Launcher 1" },
                    {
                        id: "dyna_link_1",
                        title: "Link - Overwrite me in ONE",
                        indicatorDataSource: { path: "/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=10&srv=234132432" },
                        target: {
                            semanticObject: "App1",
                            action: "overwritten"
                        }
                    }
                ]
            }
        }, {
            testDescription: "group with redundant tiles",
            input: { sUsedGroupId: "REDUNDANT_TILES" },
            output: {
                aExpectedTiles: [
                    { id: "static_tile_1", title: "title - Static App Launcher 1" },
                    { id: "static_tile_2", title: "title - Static App Launcher 1" }
                ]
            }
        }, {
            testDescription: "group with URL tiles",
            input: { sUsedGroupId: "URL_TILES" },
            output: { aExpectedTiles: [{ id: "urlTile", title: "SAP Website" }] }
        }
    ].forEach(function (oFixture) {
        asyncTest("getGroupTiles: " + oFixture.testDescription, function () {
            var that = this;
            // arrange
            stubUsedServices(getFilteredSite({
                groupsFilter: [oFixture.input.sUsedGroupId] //only one group per test needed
            }));
            sinon.stub(navigationMode, "computeNavigationModeForHomepageTiles").returns();

            // act (getGroups)
            this.oAdapter.getGroups().done(function (aGroups) {
                // getGroups will return 2 groups because the groupsFilter is always set to a
                // single group + the generated default group
                var aTiles = that.oAdapter.getGroupTiles(aGroups[1]);

                // assert (getGroups)
                strictEqual(aTiles.length, oFixture.output.aExpectedTiles.length,
                    "returned correct number of groups");
                oFixture.output.aExpectedTiles.forEach(function (oExpectedTile, iIndex) {
                    var sTileId = that.oAdapter.getTileId(aTiles[iIndex]),
                        sTileTitle = that.oAdapter.getTileTitle(aTiles[iIndex]),
                        sTileIntent,
                        oResolvedTile;

                    strictEqual(sTileId, oExpectedTile.id, "getTileId '" + sTileId + "'");
                    strictEqual(sTileTitle, oExpectedTile.title, "getTileTitle '" + sTileTitle + "'");

                    // check, that group tile resolving will fill _mResolvedTiles and the
                    // list of resolved catalog tiles
                    // test at least for one propertie of the resolved tiles
                    oResolvedTile = that.oAdapter._mResolvedTiles[sTileId];
                    strictEqual(typeof oResolvedTile, "object", "Group tile was added to _mResolvedTiles");

                    sTileIntent = oResolvedTile.tileIntent;
                    strictEqual(typeof sTileIntent, "string", "tile intent");
                });
                start();
            });
        });
    });

    [
        {
            testDescription: "Navigation Mode is embedded", // nav mode truthy
            input: {
                oTile: { id: "tileId" },
                bIsCatalogTile: false,
                sNavigationMode: "embedded",
                oResources: { i18n: { getText: sinon.stub().returns("translatedmode") } }
            },
            expected: {
                fnGenericTileArg: {
                    "header": "TileTitle",
                    "subheader": "TileSubtitle"
                }
            }
        }, {
            testDescription: "Navigation Mode is new Window", // nav mode truthy
            input: {
                oTile: { id: "tileId" },
                bIsCatalogTile: true,
                sNavigationMode: "newWindow",
                oResources: { i18n: { getText: sinon.stub().returns("translatedmode") } }
            },
            expected: {
                fnGenericTileArg: {
                    "header": "CatalogTitle",
                    "subheader": "TileSubtitle"
                }
            }
        }, {
            testDescription: "Navigation mode is undefined", //navmode falsy
            input: {
                oTile: { id: "tileId" },
                bIsCatalogTile: true,
                sNavigationMode: undefined,
                oResources: { i18n: { getText: sinon.stub().returns("translatedmode") } }
            },
            expected: {
                fnGenericTileArg: {
                    "header": "CatalogTitle",
                    "subheader": "TileSubtitle"
                }
            }
        }, {
            testDescription: "Navigation mode is null", //navmode falsy
            input: {
                oTile: { id: "tileId" },
                bIsCatalogTile: true,
                sNavigationMode: null,
                oResources: { i18n: { getText: sinon.stub().returns("translatedmode") } }
            },
            expected: {
                fnGenericTileArg: {
                    "header": "CatalogTitle",
                    "subheader": "TileSubtitle"
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("_createLinkInstance: " + oFixture.testDescription, function (assert) {
            var oAdapter = this.oAdapter, oLinkControl, sHash = "#Stub-tileId";

            // Arrange
            sinon.stub(oAdapter, "getTileSubtitle").returns("TileSubtitle");
            sinon.stub(oAdapter, "getCatalogTileTitle").returns("CatalogTitle");
            sinon.stub(oAdapter, "getTileTitle").returns("TileTitle");
            sinon.stub(oAdapter, "_genericTilePressHandler");

            oLinkControl = { setAriaLabel: sinon.spy() };
            oFixture.input.fnGenericTile = sinon.stub().returns(oLinkControl);

            addResolvedTileToAdapter(
                oAdapter,
                sHash,
                oFixture.input.oTile,
                true, /*bIsLink*/
                false /*isCatalogTile*/
            );

            // Act
            oAdapter._createLinkInstance(oFixture.input.oTile, oFixture.input.bIsCatalogTile, oFixture.input.sNavigationMode, oFixture.input.fnGenericTile, oFixture.input.oResources);

            // Assert
            assert.ok(oAdapter.getTileSubtitle.calledOnce, "Calls `oAdapter.getTileSubtitle(oTile)` once to the tile subtitle");

            if (oFixture.input.bIsCatalogTile) {
                assert.ok(oAdapter.getCatalogTileTitle.calledOnce, "Calls `oAdapter.getCatalogTileTitle(oTile)` once to get the tile title");
                assert.notOk(oAdapter.getTileTitle.calledOnce, "Does NOT Call `oAdapter.getTileTitle(oTile)` for catalog tiles");
            } else {
                assert.ok(oAdapter.getTileTitle.calledOnce, " Calls `oAdapter.getTileTitle(oTile)` for catalog tiles");
                assert.notOk(oAdapter.getCatalogTileTitle.calledOnce, "Does NOT Call `oAdapter.getCatalogTileTitle(oTile)` once to get the tile title");
            }

            assert.ok(oFixture.input.fnGenericTile.calledOnce, "Calls `fnGenericTile` to create a link tile control");
            assert.equal(
                oFixture.input.fnGenericTile.args[0][0].header,
                oFixture.expected.fnGenericTileArg.header,
                "Calls `fnGenericTile` with an object argument which contains the property `header` as expected"
            );
            assert.equal(
                oFixture.input.fnGenericTile.args[0][0].subheader,
                oFixture.expected.fnGenericTileArg.subheader,
                "Calls `fnGenericTile` with an object argument which contains the property `subheader` as expected"
            );

            if (oFixture.expected.navigationMode) {
                assert.ok(oFixture.input.oResources.i18n.getText.calledOnce, "getText was called");
                assert.ok(oLinkControl.setAriaLabel.calledOnce, "setArialabel was called");
            }

            assert.equal(oAdapter._mResolvedTiles[oFixture.input.oTile.id].linkTileControl, oLinkControl, "--");
        });
    });

    [
        {
            testDescription: "when it return a promise that is rejected",
            input: {
                oGroupTile: {
                    id: "group_tile_id",
                    tileType: "group_tile_type"
                }
            },
            oTileUIPromise: (function () {
                return new jQuery.Deferred(function (oDeferred) {
                    oDeferred.reject(/* rejection reason */);
                }).promise();
            })(),
            expectedGetTileViewToReject: true
        }, {
            testDescription: "when it return a promise that is resolved, and `oTileUI` is falsy",
            input: { oGroupTile: {} },
            oTileUIPromise: jQuery.when(null)
        }, {
            testDescription: "when it return a promise that is resolved, and `oTileUI` is not falsy",
            input: { oGroupTile: {} },
            oTileUIPromise: jQuery.when({})
        }
    ].forEach(function (oFixture) {
        QUnit.test("getTileView - " + oFixture.testDescription, function (assert) {
            var oAdapter = this.oAdapter;
            var fnDone = assert.async();

            // Arrange
            sinon.stub(oAdapter, "_getTileView").returns(oFixture.oTileUIPromise);
            sinon.stub(jQuery.sap.log, "error");

            //Act
            oAdapter
                .getTileView(oFixture.input.oGroupTile)
                .then(function () {
                    assert.ok(oAdapter._getTileView.calledOnce, "calls _getTileView in every case");
                    fnDone();
                }, function (/* sReason */) {
                    assert.ok(oAdapter._getTileView.calledOnce, "calls _getTileView in every case");
                    if (oFixture.expectedGetTileViewToReject) {
                        assert.ok(jQuery.sap.log.error.calledOnce, "logs an error with `jQuery.sap.log.error`");
                    }
                    fnDone();
                });
        });
    });

    [
        {
            testDescription: "Custom tile app variant with URL",
            input: {
                sTileResolutionResultKey: "#Shell-customTileWithExcludeManifest",
                oTile: { id: "tileId" },
                isCustomtile: true,
                includingManifest: true
            },
            expectedCreateComponentCallArgs: [{
                "applicationConfiguration": {},
                "applicationDependencies": {
                    "asyncHints": {},
                    "manifest": "/url/to/manifest",
                    "name": "sap.ushell.demotiles.cdm.newstile",
                    "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile"
                },
                "componentData": {
                    "properties": {
                        "icon": "sap-icon://time-entry-request",
                        "manifest": "/url/to/manifest",
                        "navigationMode": undefined,
                        "subtitle": "subtitle - Custom Tile",
                        "title": "title - Custom Tile",
                        "targetURL": "#Shell-customTileWithExcludeManifest"
                    },
                    "startupParameters": {}
                },
                "loadCoreExt": true,
                "loadDefaultDependencies": false,
                "reservedParameters": {},
                "ui5ComponentName": "sap.ushell.demotiles.cdm.newstile",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile"
            }, {}, []]
        }, {
            testDescription: "Custom tile app variant with full manifest",
            input: {
                sTileResolutionResultKey: "#Shell-customTileWithIncludeManifest",
                oTile: { id: "tileId" },
                isCustomtile: true,
                includingManifest: true
            },
            expectedCreateComponentCallArgs: [{
                "applicationConfiguration": {},
                "applicationDependencies": {
                    "asyncHints": {},
                    "manifest": {// putting a real manifest here was not
                        // needed yet for the tests
                        "feel.free.to.extend": {}
                    },
                    "name": "sap.ushell.demotiles.cdm.newstile",
                    "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile"
                },
                "componentData": {
                    "properties": {
                        "title": "title - Custom Tile",
                        "subtitle": "subtitle - Custom Tile",
                        "icon": "sap-icon://time-entry-request",
                        "navigationMode": undefined,
                        "manifest": {// TODO: only temp workaround for SSB
                            "feel.free.to.extend": {}
                        },
                        "targetURL": "#Shell-customTileWithIncludeManifest"
                    },
                    "startupParameters": {}
                },
                "loadCoreExt": true,
                "loadDefaultDependencies": false,
                "reservedParameters": {},
                "ui5ComponentName": "sap.ushell.demotiles.cdm.newstile",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile"
            }, {}, []]
        }, {
            testDescription: "Static AppLauncher Tile",
            input: {
                sTileResolutionResultKey: "#App1-viaStatic",
                oTile: { id: "tileId" }
            },
            expectedCreateComponentCallArgs: [{
                "applicationConfiguration": {},
                "applicationDependencies": {
                    "name": "sap.ushell.components.tiles.cdm.applauncher"
                },
                "componentData": {
                    "properties": {
                        "icon": "sap-icon://Fiori2/F0018",
                        "info": "info - Static App Launcher 1",
                        "navigationMode": "embedded",
                        "subtitle": "subtitle - Static App Launcher 1",
                        "targetURL": "#App1-viaStatic",
                        "title": "title - Static App Launcher 1"
                    },
                    "startupParameters": {}
                },
                "loadCoreExt": false,
                "loadDefaultDependencies": false,
                "reservedParameters": {},
                "ui5ComponentName": "sap.ushell.components.tiles.cdm.applauncher",
                "url": undefined
            }, {}, []]
        }, {
            testDescription: "Dynamic AppLauncher tile (w/o DataSource)",
            input: {
                sTileResolutionResultKey: "#App1-viaDynamic",
                oTile: { id: "tileId" }
            },
            expectedCreateComponentCallArgs: [{
                "applicationConfiguration": {},
                "applicationDependencies": {
                    "name": "sap.ushell.components.tiles.cdm.applauncherdynamic"
                },
                "componentData": {
                    "properties": {
                        "icon": "sap-icon://Fiori2/F0018",
                        "indicatorDataSource": {
                            "path": "/sap/bc/service/$count",
                            "refresh": 1000
                        },
                        "navigationMode": "newWindow",
                        "subtitle": "subtitle - Dynamic App Launcher 1",
                        "targetURL": "#App1-viaDynamic",
                        "title": "title - Dynamic App Launcher 1"
                    },
                    "startupParameters": {}
                },
                "loadCoreExt": false,
                "loadDefaultDependencies": false,
                "reservedParameters": {},
                "ui5ComponentName": "sap.ushell.components.tiles.cdm.applauncherdynamic",
                "url": undefined
            }, {}, []]
        }, {
            testDescription: "Dynamic AppLauncher tile with indicatorDataSource DataSource coming from group tile",
            input: {
                sTileResolutionResultKey: "#App1-viaDynamic",
                oTile: {
                    id: "tileId",
                    dataSource: {
                        // same structure as in sap.app/datasources/datasource)
                        uri: "/sap/opu/odata/snce/SRV/",
                        foo: "bar" // any additional properties
                    },
                    indicatorDataSource: {
                        path: "FOO/$count",
                        refresh: 10
                    }
                }
            },
            expectedCreateComponentCallArgs: [{
                "applicationConfiguration": {},
                "applicationDependencies": {
                    "name": "sap.ushell.components.tiles.cdm.applauncherdynamic"
                },
                "componentData": {
                    "properties": {
                        "dataSource": {
                            "foo": "bar",
                            "uri": "/sap/opu/odata/snce/SRV/"
                        },
                        "icon": "sap-icon://Fiori2/F0018",
                        "indicatorDataSource": {
                            "path": "FOO/$count",
                            "refresh": 10
                        },
                        "navigationMode": "newWindow",
                        "subtitle": "subtitle - Dynamic App Launcher 1",
                        "targetURL": "#App1-viaDynamic",
                        "title": "title - Dynamic App Launcher 1"
                    },
                    "startupParameters": {}
                },
                "loadCoreExt": false,
                "loadDefaultDependencies": false,
                "reservedParameters": {},
                "ui5ComponentName": "sap.ushell.components.tiles.cdm.applauncherdynamic",
                "url": undefined
            }, {}, []]
        }, {
            testDescription: "Custom tile as tile",
            input: {
                sTileResolutionResultKey: "#Shell-customTile",
                oTile: { id: "tileId" },
                isCustomtile: true
            },
            expectedCreateComponentCallArgs: [{
                "applicationConfiguration": {},
                "applicationDependencies": {
                    "name": "sap.ushell.demotiles.cdm.newstile",
                    "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile"
                },
                "componentData": {
                    "properties": {
                        "icon": "sap-icon://time-entry-request",
                        "subtitle": "subtitle - Custom Tile",
                        "title": "title - Custom Tile",
                        "navigationMode": undefined,
                        "targetURL": "#Shell-customTile"
                    },
                    "startupParameters": {}
                },
                "loadCoreExt": true,
                "loadDefaultDependencies": false,
                "reservedParameters": {},
                "ui5ComponentName": "sap.ushell.demotiles.cdm.newstile",
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demotiles/cdm/newstile"
            }, {}, []]
        }
    ].forEach(function (oFixture) {
        asyncTest("getTileView for tiles: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                fnCreateComponent,
                sHash = oFixture.input.sTileResolutionResultKey,
                oInputTile = oFixture.input.oTile,
                oComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oAppProperties = {
                    componentHandle: {
                        getInstance: function () { return {}; }
                    }
                };

            // Arrange
            stubUsedServices(getFilteredSite());

            addResolvedTileToAdapter(oAdapter, sHash, oInputTile, /*bIsLink*/false, /*isCatalogTile*/false);

            sinon.stub(oAdapter, "getTileType").returns(oAdapter.TileType.Tile); // returns "tile"
            sinon.stub(oEventHub, "once", function () {
                return {
                    do: function (callback) { callback(); }
                };
            });

            sinon.spy(oAdapter, "_getTileView");
            sinon.spy(oAdapter, "_getTileUiComponentContainer");

            fnCreateComponent = sinon.stub(oComponentLoader, "createComponent").returns(new jQuery.Deferred().resolve(oAppProperties).promise());

            //act
            oAdapter.getTileView(oInputTile)
                .fail(okFalseAndStart)
                .done(function () {
                    ok(oAdapter._getTileView.called, "_getTileView called");
                    ok(oAdapter._getTileUiComponentContainer.called, "_getTileUiComponentContainer called");

                    strictEqual(fnCreateComponent.callCount, 1, "createComponent call count");
                    deepEqual(
                        fnCreateComponent.args[0],
                        oFixture.expectedCreateComponentCallArgs,
                        "Ui5ComponentLoader.createComponent was called with the expected arguments"
                    );
                    start();
                });
        });
    });

    asyncTest("getTileView catches for custom tile throwing an exception", function () {
        var oAdapter = this.oAdapter,
            oComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
            sOriginalError = "Error: thrown by sap.ui.component()",
            oFakeComponentContainer = { getComponentInstance: function () { } },
            sHash = "#Shell-customTile",
            oInputTile = { id: "tileId" };

        // Arrange
        stubUsedServices(getFilteredSite());
        addResolvedTileToAdapter(oAdapter, sHash, oInputTile, /*bIsLink*/false);
        sinon.stub(oAdapter, "getTileType")
            .returns(oAdapter.TileType.Tile); // returns "tile"
        sinon.stub(sap.ui.core, "ComponentContainer")
            .returns(oFakeComponentContainer);
        sinon.stub(oComponentLoader, "createComponent")
            .returns(new jQuery.Deferred().reject(sOriginalError).promise());
        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(oEventHub, "once", function () {
            return {
                do: function (callback) { callback(); }
            };
        });

        //act
        oAdapter.getTileView(oInputTile)
            .done(okFalseAndStart)
            .fail(function (sErrorMessage) {
                strictEqual(sErrorMessage, "Tile with ID 'tileId' could not be initialized:\n" + sOriginalError, "correct error message");

                strictEqual(jQuery.sap.log.error.callCount, 1, "jQuery.sap.log.error was called");

                ok((new RegExp(sOriginalError)).test(jQuery.sap.log.error.getCall(0).args[0]), "Rejects its promise when an error is thrown by sap.ui.component");

                start();
            });
    });

    asyncTest("getTileView: Rejects as an error occured while creating the tile ui", function () {
        // Arrange
        var oAdapter = this.oAdapter,
            oTile = {
                id: "#App1-viaStatic",
                target: {
                    semanticObject: "App1",
                    action: "viaStatic"
                }
            };

        sinon.stub(oAdapter, "_getTileView").returns(
            new jQuery.Deferred()
                .reject("An error occured while creating the tile ui of tile with id '#App1-viaStatic'.")
                .promise()
        );

        // Act
        oAdapter.getTileView(oTile)
            .done(okFalseAndStart)
            .fail(function (sErrorMessage) {
                start();
                // Assert
                strictEqual(sErrorMessage,
                    "Tile with ID '#App1-viaStatic' could not be initialized:\n" +
                    "An error occured while creating the tile ui of tile with id '#App1-viaStatic'.");
            });
    });

    // Need to rework tests as there is no local adapter of the CDM Service and to resolve tile CDM service is needed.
    asyncTest("_getTileView : check if _getTileUiComponentContainer is called", function (assert) {
        var oAdapter = this.oAdapter,
            that = this,
            oTile = { id: "#App1-viaStatic" },
            oResolvedTile = {
                tileIntent: "#App1-viaStatic",
                tileResolutionResult: O_CSTR["#App1-viaStatic"]
            };

        //Arrange
        oAdapter._mResolvedTiles[oTile.id] = oResolvedTile;
        sinon.stub(oAdapter, "_getTileUiComponentContainer").returns(jQuery.when());

        //Act
        oAdapter._getTileView(oTile)
            .done(function () {
                //Assert
                assert.ok(that.oAdapter._getTileUiComponentContainer.calledOnce, "_getTileUiComponentContainer is called once");
            }).always(function () {
                start();
            });
    });

    asyncTest("_getTileView: Rejects as _getTileUiComponentContainer throws an exception", function () {
        var oAdapter = this.oAdapter,
            oTile = { id: "#App1-viaStatic" },
            oResolvedTile = {
                tileIntent: "#App1-viaStatic",
                tileResolutionResult: O_CSTR["#App1-viaStatic"]
            },
            sOriginalError = "failed as expected",
            oComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader");

        sinon.stub(oComponentLoader, "createComponent")
            .returns(new jQuery.Deferred().reject(sOriginalError).promise());

        // Arrange
        oAdapter._mResolvedTiles[oTile.id] = oResolvedTile;
        sinon.stub(oAdapter, "_getTileUiComponentContainer")
            .returns(new jQuery.Deferred().reject(sOriginalError).promise());

        // Act
        oAdapter._getTileView(oTile)
            .done(okFalseAndStart)
            .fail(function (sErrorMessage) {
                start();
                // Assert
                strictEqual(sErrorMessage, sOriginalError, "correct error message thrown");
            });
    });

    asyncTest("_getTileView: Rejects because of invalid input parameter", function () {
        var oAdapter = this.oAdapter,
            oTile,
            oErrorLogSpy = sinon.spy(jQuery.sap.log, "error");

        // Act
        oAdapter._getTileView(oTile)
            .done(function (/*oTileUi*/) {
                start();
                // Assert
                ok(false, "should never happen");
                oErrorLogSpy.restore();
            })
            .fail(function (sErrorMessage) {
                start();
                // Assert
                strictEqual(sErrorMessage,
                    "Invalid input parameter passed to _getTileView: undefined",
                    "correct error message thrown"
                );
                ok(oErrorLogSpy.called, "error message logged to console");
                oErrorLogSpy.restore();
            });
    });

    test("getCatalogTileView: Returns catalog tile ui", function () {
        var oAdapter = this.oAdapter,
            oCatalogTile = {},
            oCatalogTileUi = {},
            oResult;

        // Arrange
        sinon.stub(oAdapter, "_getCatalogTileView").returns(oCatalogTileUi);

        // Act
        oResult = oAdapter.getCatalogTileView(oCatalogTile);

        // Assert
        ok(oAdapter._getCatalogTileView.called, "_getCatalogTileView called");
        deepEqual(oResult, {}, "correct value returned");
    });

    test("getCatalogTileView: _getCatalogTileView throws error", function () {
        var oAdapter = this.oAdapter,
            oCatalogTile;

        // Act and assert
        assert.throws(
            function () {
                oAdapter.getCatalogTileView(oCatalogTile);
            },
            "throwed an error as expected"
        );
    });

    test("_getCatalogTileView : Returns correct tile ui", function () {
        var oAdapter = this.oAdapter,
            oCatalogTile = {id: "testId"},
            oResult,
            oResolvedTile = {id: "foobar"};

        oAdapter._mResolvedTiles["testId"] = oResolvedTile;

        // Arrange
        var oGetTileUiComponentContainerSyncStub =  sinon.stub(oAdapter, "_getTileUiComponentContainerSync").returns({});

        // Act
        oResult = oAdapter._getCatalogTileView(oCatalogTile);

        // Assert
        ok(oAdapter._getTileUiComponentContainerSync.called, "_getTileUiComponentContainerSync called");
        strictEqual(oGetTileUiComponentContainerSyncStub.getCall(0).args[1], oResolvedTile, "correct resolved tile passed");
        deepEqual(oResult, {}, "correct value returned");
    });

    asyncTest("getCatalogTileViewControl: Returns catalog tile ui asynchronously", function () {
        var oAdapter = this.oAdapter,
            oCatalogTile = {},
            oCatalogTileUiPromise = new jQuery.Deferred().resolve(oCatalogTile).promise();

        // Arrange
        sinon.stub(oAdapter, "_getCatalogTileViewControl").returns(oCatalogTileUiPromise);

        // Act
        oAdapter.getCatalogTileViewControl(oCatalogTile)
            .fail(okFalseAndStart)
            .done(function (oResult) {
                // Assert
                ok(oAdapter._getCatalogTileViewControl.called, "_getCatalogTileViewControl called");
                deepEqual(oResult, oCatalogTile, "correct value returned");
                start();
            });
    });

    asyncTest("getCatalogTileViewControl: _getCatalogTileViewControl throws error", function () {
        var oAdapter = this.oAdapter,
            oCatalogTile;

        // Act and assert
        oAdapter.getCatalogTileViewControl(oCatalogTile)
            .fail(function () {
                ok(true, "Throws error as expected");
                start();
            })
            .done(okFalseAndStart);
    });

    asyncTest("_getCatalogTileViewControl : Returns correct tile ui asynchronously", function () {
        var oAdapter = this.oAdapter,
            oCatalogTile = {},
            oCatalogTileUiPromise = new jQuery.Deferred().resolve(oCatalogTile).promise();

        // Arrange
        sinon.stub(oAdapter, "_getTileUiComponentContainer").returns(oCatalogTileUiPromise);

        // Act
        oAdapter._getCatalogTileViewControl(oCatalogTile)
            .fail(okFalseAndStart)
            .done(function (oResult) {
                // Assert
                ok(oAdapter._getTileUiComponentContainer.called, "_getTileUiComponentContainer called");
                deepEqual(oResult, {}, "correct value returned");
                start();
            });
    });

    [
        {
            testDescription: "Static applauncher group tile",
            input: {
                tile: {
                    id: "#App1-viaStatic",
                    target: {
                        semanticObject: "App1",
                        action: "viaStatic"
                    }
                }
            }
        }, {
            testDescription: "Dynamic applauncher group tile",
            input: {
                tile: {
                    id: "#App1-viaDynamic",
                    target: {
                        semanticObject: "App1",
                        action: "viaDynamic"
                    }
                }
            }
        }, {
            testDescription: "Custom tile as group tile",
            input: {
                tile: {
                    id: "#Shell-customTile",
                    target: {
                        semanticObject: "Shell",
                        action: "customTile"
                    }
                }
            }
        }
    ].forEach(function (oFixture) {
        test("_getTileUiComponentContainerSync: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                oResolvedTile,
                oFakeComponentInstance = { "I am a component instance": true },
                oFakeComponentContainer = {
                    getComponentInstance: function () {
                        return oFakeComponentInstance;
                    }
                };

            // Arrange
            sinon.stub(sap.ui.core, "ComponentContainer")
                .returns(oFakeComponentContainer);

            sinon.stub(sap.ui, "component")
                .returns(oFakeComponentInstance);

            sinon.spy(oAdapter, "getCatalogTileTitle");
            sinon.spy(oAdapter, "getTileTitle");
            sinon.spy(oAdapter, "_createTileComponentData");

            addResolvedTileToAdapter(oAdapter, oFixture.input.tile.id, oFixture.input.tile, false, oFixture.input.isCatalogTile);
            oResolvedTile = oAdapter._mResolvedTiles[oFixture.input.tile.id];
            // Act
            oAdapter._getTileUiComponentContainerSync(oFixture.input.tile, oResolvedTile, oFixture.input.isCatalogTile);
            // Assert
            ok(oAdapter.getTileTitle.called, "getTileTitle called");
            deepEqual(oAdapter._createTileComponentData.firstCall.args, [oFixture.input.tile, false, oResolvedTile], "correct arguments applied to _createTileComponentData");
            strictEqual(oAdapter._mResolvedTiles[oFixture.input.tile.id].tileComponent, oFakeComponentInstance, "tileComponent attached to resolved tile");
        });
    });

    // _getTileUiComponentContainer error handling tests
    [
        {
            testDescription: "componentName is undefined in resolution result",
            oTile: {
                id: "#Shell-customTile",
                target: {
                    semanticObject: "Shell",
                    action: "customTile"
                }
            },
            fnModifyResolutionResult: function (oTileResolutionResultCopy) {
                // overwrite componentName to force _getTileUiComponentContainer returning null
                delete oTileResolutionResultCopy.tileComponentLoadInfo.componentName;
                return oTileResolutionResultCopy;
            }
            // expected return value is always null when error occured
        }, {
            testDescription: "tileComponentLoadInfo is undefined in resolution result",
            oTile: {
                id: "#Shell-customTile",
                target: {
                    semanticObject: "Shell",
                    action: "customTile"
                }
            },
            fnModifyResolutionResult: function (oTileResolutionResultCopy) {
                // overwrite componentName to force _getTileUiComponentContainer returning null
                delete oTileResolutionResultCopy.tileComponentLoadInfo;
                return oTileResolutionResultCopy;
            }
            // expected return value is always null when error occured
        }, {
            testDescription: "tileComponentLoadInfo is null in resolution result",
            oTile: {
                id: "#Shell-customTile",
                target: {
                    semanticObject: "Shell",
                    action: "customTile"
                }
            },
            fnModifyResolutionResult: function (oTileResolutionResultCopy) {
                // overwrite componentName to force _getTileUiComponentContainer returning null
                oTileResolutionResultCopy.tileComponentLoadInfo = null;
                return oTileResolutionResultCopy;
            }
            // expected return value is always null when error occured
        }
    ].forEach(function (oFixture) {
        test("_getTileUiComponentContainer returns null when " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                oTile = oFixture.oTile,
                oResolvedTile,
                oTileUiComponentContainer,
                oTileResolutionResultCopy;

            // arrange
            sinon.spy(oAdapter, "getCatalogTileTitle");
            sinon.spy(oAdapter, "getTileTitle");
            sinon.spy(oAdapter, "_createTileComponentData");

            addResolvedTileToAdapter(oAdapter, oTile.id, oTile, /*bIsLink*/false, /*bIsCatalogTile*/false);

            // modify the tile
            oResolvedTile = oAdapter._mResolvedTiles[oTile.id];
            // clone to avoid affecting other tests
            oTileResolutionResultCopy = jQuery.extend(true, {}, oResolvedTile.tileResolutionResult);
            oResolvedTile.tileResolutionResult = oFixture.fnModifyResolutionResult(oTileResolutionResultCopy);

            // act
            oTileUiComponentContainer = oAdapter._getTileUiComponentContainerSync(oTile, oResolvedTile, false);

            // assert
            ok(oAdapter.getTileTitle.called, "getTileTitle called");
            deepEqual(oAdapter._createTileComponentData.firstCall.args, [oTile, false, oResolvedTile], "correct arguments applied to _createTileComponentData");
            deepEqual(oTileUiComponentContainer, null, "tileComponent attached to resolved tile");
        });
    });

    asyncTest("_getTileUiComponentContainer: calls _createLinkInstance when `oResolvedTile.isLink` evaluates to `true`", function (assert) {
        var oAdapter = this.oAdapter,
            that = this;
        var oFixture = {
            testDescription: "calls _createLinkInstance constructor",
            input: {
                oTile: {},
                oResolvedTile: {
                    isLink: true,
                    tileResolutionResult: { navigationMode: "" }
                },
                bIsCatalogTile: true | false
            }
        };

        //Arrange
        sinon.stub(oAdapter, "_createTileComponentData").returns("");
        sinon.stub(oAdapter, "_createLinkInstance").returns("");

        //Act
        oAdapter._getTileUiComponentContainer(oFixture.input.oTile, oFixture.input.oResolvedTile, oFixture.input.bIsCatalogTile)
            .fail(okFalseAndStart)
            .done(function (/*oAppProperties*/) {
                //Assert
                assert.ok(that.oAdapter._createLinkInstance.calledOnce, "Create Link Instance function is called once");
                start();
            });
    });

    [
        {
            testDescription: "Static applauncher group tile",
            input: {
                tile: {
                    id: "#App1-viaStatic",
                    target: {
                        semanticObject: "App1",
                        action: "viaStatic"
                    }
                },
                isCatalogTile: false
            }
        }, {
            testDescription: "Dynamic applauncher group tile",
            input: {
                tile: {
                    id: "#App1-viaDynamic",
                    target: {
                        semanticObject: "App1",
                        action: "viaDynamic"
                    }
                },
                isCatalogTile: false
            }
        }, {
            testDescription: "Custom tile as group tile",
            input: {
                tile: {
                    id: "#Shell-customTile",
                    target: {
                        semanticObject: "Shell",
                        action: "customTile"
                    }
                },
                isCatalogTile: false
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("_getTileUiComponentContainer: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                oResolvedTile,
                oFakeComponentInstance = { "I am a component instance": true },
                oAppConfiguration = {
                    componentHandle: {
                        getInstance: function () {
                            return oFakeComponentInstance;
                        }
                    }
                },
                oComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader");

            // Arrange
            sinon.stub(oComponentLoader, "createComponent")
                .returns(new jQuery.Deferred().resolve(oAppConfiguration).promise());
            sinon.stub(sap.ui, "component").returns(oFakeComponentInstance);
            sinon.spy(oAdapter, "getCatalogTileTitle");
            sinon.spy(oAdapter, "getTileTitle");
            sinon.spy(oAdapter, "_createTileComponentData");
            sinon.stub(oEventHub, "once", function () {
                return {
                    do: function (callback) { callback(); }
                };
            });

            addResolvedTileToAdapter(oAdapter, oFixture.input.tile.id, oFixture.input.tile, false, oFixture.input.isCatalogTile);


            oResolvedTile = oAdapter._mResolvedTiles[oFixture.input.tile.id];
            // Act
            oAdapter._getTileUiComponentContainer(oFixture.input.tile, oResolvedTile, oFixture.input.isCatalogTile)
                .fail(okFalseAndStart)
                .done(function (/*oGotComponentContainer*/) {
                    // Assert
                    ok(oAdapter.getTileTitle.called, "getTileTitle called");
                    deepEqual(oAdapter._createTileComponentData.firstCall.args, [oFixture.input.tile, false, oResolvedTile], "correct arguments applied to _createTileComponentData");
                    strictEqual(oAdapter._mResolvedTiles[oFixture.input.tile.id].tileComponent, oFakeComponentInstance, "tileComponent attached to resolved tile");
                    start();
                });
        });
    });

    // _getTileUiComponentContainer error handling tests
    [
        {
            testDescription: "componentName is undefined in resolution result",
            oTile: {
                id: "#Shell-customTile",
                target: {
                    semanticObject: "Shell",
                    action: "customTile"
                }
            },
            fnModifyResolutionResult: function (oTileResolutionResultCopy) {
                // overwrite componentName to force _getTileUiComponentContainer returning null
                delete oTileResolutionResultCopy.tileComponentLoadInfo.componentName;
                return oTileResolutionResultCopy;
            }
            // expected return value is always null when error occured
        }, {
            testDescription: "tileComponentLoadInfo is undefined in resolution result",
            oTile: {
                id: "#Shell-customTile",
                target: {
                    semanticObject: "Shell",
                    action: "customTile"
                }
            },
            fnModifyResolutionResult: function (oTileResolutionResultCopy) {
                // overwrite componentName to force _getTileUiComponentContainer returning null
                delete oTileResolutionResultCopy.tileComponentLoadInfo;
                return oTileResolutionResultCopy;
            }
            // expected return value is always null when error occured
        }, {
            testDescription: "tileComponentLoadInfo is null in resolution result",
            oTile: {
                id: "#Shell-customTile",
                target: {
                    semanticObject: "Shell",
                    action: "customTile"
                }
            },
            fnModifyResolutionResult: function (oTileResolutionResultCopy) {
                // overwrite componentName to force _getTileUiComponentContainer returning null
                oTileResolutionResultCopy.tileComponentLoadInfo = null;
                return oTileResolutionResultCopy;
            }
            // expected return value is always null when error occured
        }
    ].forEach(function (oFixture) {
        asyncTest("_getTileUiComponentContainer rejects promise when " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                oTile = oFixture.oTile,
                oResolvedTile,
                oTileResolutionResultCopy;

            // arrange
            sinon.spy(oAdapter, "getCatalogTileTitle");
            sinon.spy(oAdapter, "getTileTitle");
            sinon.spy(oAdapter, "_createTileComponentData");

            addResolvedTileToAdapter(oAdapter, oTile.id, oTile, /*bIsLink*/false, /*bIsCatalogTile*/false);

            // modify the tile
            oResolvedTile = oAdapter._mResolvedTiles[oTile.id];
            // clone to avoid affecting other tests
            oTileResolutionResultCopy = jQuery.extend(true, {}, oResolvedTile.tileResolutionResult);
            oResolvedTile.tileResolutionResult = oFixture.fnModifyResolutionResult(oTileResolutionResultCopy);

            // act
            oAdapter._getTileUiComponentContainer(oTile, oResolvedTile, false)
                .fail(function (oError) {
                    // assert
                    ok(oAdapter.getTileTitle.called, "getTileTitle called");
                    deepEqual(oAdapter._createTileComponentData.firstCall.args, [oTile, false, oResolvedTile], "correct arguments applied to _createTileComponentData");
                    strictEqual(oError, "Cannot find name of tile component for tile with id: '#Shell-customTile'", "tileComponent attached to resolved tile");
                    start();
                })
                .done(okFalseAndStart);
        });
    });

    QUnit.test("_getTileUIComponentContainer: returns a platform visualization if indicated by the tile resolution result", function (assert) {
        var done = assert.async();
        assert.expect(1);

        // Arrange
        var oTile = {
            vizId: "12345"
        };
        var oResolvedTile = {
            tileResolutionResult: {
                isPlatformVisualization: true
            }
        };

        var oExpectedVisualizationView = { "The": "visualization view" };
        var oVisualizationDataProvider = {
            getVisualizationView: sinon.stub().withArgs("12345").returns(Promise.resolve(oExpectedVisualizationView))
        };
        sinon.stub(sap.ushell.Container, "getService").withArgs("VisualizationDataProvider").returns(oVisualizationDataProvider);

        // Act
        this.oAdapter._getTileUiComponentContainer(oTile, oResolvedTile, false)
        .done(function (oVisualizationView) {
            // Assert
            assert.deepEqual(oVisualizationView, oExpectedVisualizationView, "The platform visualization view is returned");
        })
        .always(function () {
            sap.ushell.Container.getService.restore();
            done();
        });
    });

    QUnit.test("_getTileUIComponentContainer: rejects with an error message when the creation of the platform visualization fails", function (assert) {
        var done = assert.async();
        assert.expect(1);

        // Arrange
        var oTile = {
            vizId: "12345"
        };
        var oResolvedTile = {
            tileResolutionResult: {
                isPlatformVisualization: true
            }
        };

        var sExpectedErrorMessage = "Error Error Error";
        var oVisualizationDataProvider = {
            getVisualizationView: sinon.stub().withArgs("12345").returns(Promise.reject(sExpectedErrorMessage))
        };
        sinon.stub(sap.ushell.Container, "getService").withArgs("VisualizationDataProvider").returns(oVisualizationDataProvider);

        // Act
        this.oAdapter._getTileUiComponentContainer(oTile, oResolvedTile, false)
        .fail(function (sErrorMessage) {
            // Assert
            assert.strictEqual(sErrorMessage, sExpectedErrorMessage, "The platform visualization view is returned");
        })
        .always(function () {
            sap.ushell.Container.getService.restore();
            //oGetServiceStub.restore();
            done();
        });
    });

    [
        {
            testDescription: "many props ok , no custom, thus startup not propagated",
            input: {
                sTileId: "static_tile_1",
                bIsCatalogTile: false,
                sHash: "#App1-viaStatic",
                tileResolutionResult: { startupParameters: { "A": ["VAL"] } }
            },
            expectedResult: {
                "properties": {
                    "icon": "sap-icon://Fiori2/F0018",
                    "subtitle": "subtitle - Static App Launcher 1",
                    navigationMode: undefined,
                    "targetURL": "#App1-viaStatic",
                    "title": "title - Static App Launcher 1",
                    "info": "info - Static App Launcher 1"
                },
                "startupParameters": {}
            }
        }, {
            testDescription: "many props ok and custom tile, startup propagated",
            input: {
                sTileId: "static_tile_1",
                bIsCatalogTile: false,
                sHash: "#App1-viaStatic",
                tileResolutionResult: {
                    isCustomTile: true,
                    startupParameters: { "A": ["VAL"] }
                }
            },
            expectedResult: {
                "properties": {
                    "icon": "sap-icon://Fiori2/F0018",
                    "subtitle": "subtitle - Static App Launcher 1",
                    "targetURL": "#App1-viaStatic",
                    "title": "title - Static App Launcher 1",
                    "info": "info - Static App Launcher 1",
                    "navigationMode": undefined
                },
                "startupParameters": { "A": ["VAL"] }
            }
        }
    ].forEach(function (oFixture) {
        test("_createTileComponentData with " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter;
            var oTile = O_CDM_SITE.groups.ONE.payload.tiles.filter(function (oTileEntry) {
                return oTileEntry.id === oFixture.input.sTileId;
            })[0];
            var oResolutionResult = O_CSTR[oFixture.input.sHash];

            oAdapter._mResolvedTiles[oTile.id] = createResolvedTile(oFixture.input.sHash, false, false);

            var richResolutionResult = jQuery.extend(true, {}, oResolutionResult);
            richResolutionResult.tileResolutionResult = oFixture.input.tileResolutionResult;

            var actualResult = oAdapter._createTileComponentData(oTile, oFixture.bIsCatalogTile, richResolutionResult);

            deepEqual(actualResult, oFixture.expectedResult, "result ok ");
        });
    });

    QUnit.test("getTileTitle FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileTitle();
        });
    });

    [
        {
            "id": "04",
            "icon": "sap-icon://family-care",
            "title": "Bookmark title 04",
            "subTitle": "Bookmark subtitle 04",
            "target": {
                "semanticObject": "SO",
                "action": "action"
            },
            "isBookmark": true
        }
    ].forEach(function (oTile) {
        QUnit.test("#getTileTitle() : for bookmarks.", function () {
            var sTitle = this.oAdapter.getTileTitle(oTile);

            strictEqual(oTile.title, sTitle);
        });
    });

    QUnit.test("getTileSubtitle FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileSubtitle();
        });
    });

    [
        {
            "id": "04",
            "icon": "sap-icon://family-care",
            "title": "Bookmark title 04",
            "subTitle": "Bookmark subtitle 04",
            "target": {
                "semanticObject": "SO",
                "action": "action"
            },
            "isBookmark": true
        }
    ].forEach(function (oTile) {
        QUnit.test("#getTileSubtitle() : for bookmarks.", function () {
            var sSubtitle = this.oAdapter.getTileSubtitle(oTile);

            strictEqual(oTile.subTitle, sSubtitle);
        });
    });

    QUnit.test("getTileIcon FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.getTileIcon();
        });
    });

    [
        {
            "id": "04",
            "icon": "sap-icon://family-care",
            "title": "Bookmark title 04",
            "subTitle": "Bookmark subtitle 04",
            "target": {
                "semanticObject": "SO",
                "action": "action"
            },
            "isBookmark": true
        }
    ].forEach(function (oTile) {
        QUnit.test("#getTileIcon() : for bookmarks.", function () {
            var sIcon = this.oAdapter.getTileIcon(oTile);

            strictEqual(oTile.icon, sIcon);
        });
    });

    QUnit.test("_isCustomTileComponent with the static tile component", function (assert) {
        var bResult = this.oAdapter._isCustomTileComponent("sap.ushell.components.tiles.cdm.applauncher");
        assert.strictEqual(bResult, false, "The static tile component is not identified as custom tile");
    });

    QUnit.test("_isCustomTileComponent with the dynamic tile component", function (assert) {
        var bResult = this.oAdapter._isCustomTileComponent("sap.ushell.components.tiles.cdm.applauncherdynamic");
        assert.strictEqual(bResult, false, "The static tile component is not identified as custom tile");
    });

    QUnit.test("_isCustomTileComponent with the news tile component", function (assert) {
        var bResult = this.oAdapter._isCustomTileComponent("sap.ushell.demotiles.cdm.newstile");
        assert.strictEqual(bResult, true, "The news tile component is identified as custom tile");
    });

    [
        {
            testDescription: "The only one group gets removed",
            input: {
                aGroupIds: ["HOME"],
                sGroupIdToBeRemoved: "HOME"
            },
            output: { aExpectedGroupIds: [] }
        }, {
            testDescription: "Two groups available, first group gets removed",
            input: {
                aGroupIds: ["ONE", "HOME"],
                sGroupIdToBeRemoved: "ONE"
            },
            output: { aExpectedGroupIds: ["HOME"] }
        }, {
            testDescription: "Three groups available in different order, the group in the middle gets removed",
            input: {
                aGroupIds: ["HOME", "ONE", "TWO"],
                sGroupIdToBeRemoved: "ONE"
            },
            output: { aExpectedGroupIds: ["HOME", "TWO"] }
        }
    ].forEach(function (oFixture) {
        asyncTest("removeGroup: " + oFixture.testDescription, function () {
            var that = this,
                oSite;

            // Arrange
            oSite = stubUsedServices(getFilteredSite({
                groupsFilter: oFixture.input.aGroupIds
            }));
            sinon.stub(navigationMode, "computeNavigationModeForHomepageTiles").returns();

            // Act
            that.oAdapter.getGroups()
                .done(function (aGroups) {
                    aGroups = jQuery.grep(
                        aGroups,
                        function (entry) { return entry.identification.id === oFixture.input.sGroupIdToBeRemoved; }
                    );
                    that.oAdapter.removeGroup(aGroups[0])
                        .done(function () {
                            var aGroupIds = [];

                            // extract all group ids
                            Object.keys(oSite.groups).forEach(function (sGroupId) {
                                aGroupIds.push(sGroupId);
                            });

                            // Assert
                            deepEqual(aGroupIds, oFixture.output.aExpectedGroupIds, "group/groups removed");
                            deepEqual(oSite.site.payload.groupsOrder, oFixture.output.aExpectedGroupIds, "groupsOrder adapted");
                            start();
                        })
                        .fail(function (/*sErrorMsg*/) {
                            start();
                            ok(false, "should never happen!");
                        });
                })
                .fail(function (/*sErrorMsg*/) {
                    start();
                    ok(false, "should never happen!");
                });
        });
    });

    [
        {
            testDescription: "undefined group",
            input: { oGroup: undefined },
            expectedErrorMessage: "invalid group parameter"
        }, {
            testDescription: "empty group object",
            input: { oGroup: {} },
            expectedErrorMessage: "group without id given"
        }, {
            testDescription: "group object without an identification property",
            input: { oGroup: { foo: "bar" } },
            expectedErrorMessage: "group without id given"
        }, {
            testDescription: "group object without an id property",
            input: { oGroup: { identification: { foo: "bar" } } },
            expectedErrorMessage: "group without id given"
        }
    ].forEach(function (oFixture) {
        asyncTest("removeGroup fails: " + oFixture.testDescription, function () {
            // Arrange
            stubUsedServices(getFilteredSite());

            // Act
            this.oAdapter.removeGroup(oFixture.input.oGroup)
                .done(function () {
                    // Assert
                    ok(false, "should never happen");
                    start();
                })
                .fail(function (sErrorMsg) {
                    start();
                    strictEqual(sErrorMsg, oFixture.expectedErrorMessage, "error message");
                });
        });
    });

    [
        {
            testDescription: "Call moveGroup & pass the index that is greater than the original",
            oGroupToMove: O_CDM_SITE.groups.HOME,
            nNewGroupIdx: 2,
            aExpectedGroupsOrder: ["ONE", "TWO", "HOME"],
            bStubDefaultCDMService: true
        }, {
            testDescription: "Call moveGroup & pass the index that is smaller than the original",
            oGroupToMove: O_CDM_SITE.groups.ONE,
            nNewGroupIdx: 0,
            aExpectedGroupsOrder: ["ONE", "HOME", "TWO"],
            bStubDefaultCDMService: true
        }, {
            testDescription: "Call moveGroup & pass no index",
            oGroupToMove: undefined,
            nNewGroupIdx: undefined,
            aExpectedGroupsOrder: ["HOME", "ONE", "TWO"],
            expectedErrorMessage: "Unable to move groups - invalid parameters",
            bStubDefaultCDMService: true
        }, {
            testDescription: "Call moveGroup & but the site have no groupsOrder array",
            oGroupToMove: O_CDM_SITE.groups.ONE,
            nNewGroupIdx: 1,
            aExpectedGroupsOrder: undefined,
            expectedErrorMessage: "groupsOrder not found - abort operation of adding a group.",
            bStubDefaultCDMService: false,
            fStubCDMService: function () {
                sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {
                    if (sServiceName === "CommonDataModel") {
                        return {
                            "getSite": function () {
                                var oGetSiteDeferred = new jQuery.Deferred(),
                                    oSite = getFilteredSite();
                                oSite.site.payload.groupsOrder = undefined;
                                setTimeout(function () {
                                    oGetSiteDeferred.resolve(oSite);
                                }, 0);
                                return oGetSiteDeferred.promise();
                            },
                            "save": function () {
                                var oDeferred = new jQuery.Deferred();
                                setTimeout(function () {
                                    oDeferred.resolve();
                                }, 0);
                                return oDeferred.promise();
                            }
                        };
                    }
                });
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("moveGroup: " + oFixture.testDescription, function () {
            // Arrange
            var that = this;
            if (oFixture.bStubDefaultCDMService) {
                stubUsedServices(getFilteredSite({
                    // filter and mock order groups to make the test
                    // stable even if site changes
                    groupsFilter: ["HOME", "ONE", "TWO"]
                }));
            } else {
                oFixture.fStubCDMService();
            }
            // Act & Assert
            that.oAdapter.moveGroup(oFixture.oGroupToMove, oFixture.nNewGroupIdx)
                .done(function () {
                    sap.ushell.Container.getService("CommonDataModel").getSite()
                        .done(function (oPersonalizedSite) {
                            start();
                            deepEqual(oPersonalizedSite.site.payload.groupsOrder, oFixture.aExpectedGroupsOrder, "Expected output");
                        });
                })
                .fail(function (sErrorMsg) {
                    if (!oFixture.expectedErrorMessage) {
                        start();
                        ok(false, "should never happen!");
                    } else {
                        strictEqual(sErrorMsg, oFixture.expectedErrorMessage, "Expected error message");
                        sap.ushell.Container.getService("CommonDataModel").getSite()
                            .done(function (oPersonalizedSite) {
                                start();
                                deepEqual(oPersonalizedSite.site.payload.groupsOrder, oFixture.aExpectedGroupsOrder, "Expected groups order array based on an error has been received");
                            });
                    }
                });
        });
    });

    QUnit.test("setGroupTitle FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.setGroupTitle();
        });
    });

    [
        {
            testDescription: "title set correctly",
            sGroupId: "HOME",
            sNewTitle: "I am a new title",
            expectedTitle: "I am a new title",
            expectedErrorMessage: undefined
        }, {
            testDescription: "title not set, group not existing",
            oGroup: {
                identification: {
                    id: "DOES_NOT_EXIST",
                    title: "My old title"
                }
            },
            sNewTitle: "I am a new title",
            expectedTitle: "HOME Apps",
            expectedErrorMessage: "My old title"
        }, {
            testDescription: "title not set, group undefined",
            oGroup: undefined,
            sNewTitle: "I am a new title",
            expectedTitle: "HOME Apps",
            expectedErrorMessage: "Unexpected group value"
        }, {
            testDescription: "title not set, title undefined",
            sGroupId: "HOME",
            sNewTitle: undefined,
            expectedTitle: "HOME Apps",
            expectedErrorMessage: "Unexpected oGroup title value"
        }, {
            testDescription: "title not set, group and title undefined",
            oGroup: undefined,
            sNewTitle: undefined,
            expectedTitle: "HOME Apps",
            expectedErrorMessage: "Unexpected group value"
        }, {
            testDescription: "title not set, empty group object",
            oGroup: { foo: "bar" },
            sNewTitle: "I am a new title",
            expectedTitle: "HOME Apps",
            expectedErrorMessage: "Unexpected group value"
        }
    ].forEach(function (oFixture) {
        asyncTest("setGroupTitle: " + oFixture.testDescription, function () {
            var that = this,
                oSite = getFilteredSite(),
                oGroup = oFixture.oGroup;

            stubUsedServices(oSite);

            if (oFixture.sGroupId) {
                oGroup = oSite.groups[oFixture.sGroupId];
            }

            that.oAdapter.setGroupTitle(oGroup, oFixture.sNewTitle)
                .done(function () {
                    sap.ushell.Container.getService("CommonDataModel").getSite()
                        .done(function (oSite) {
                            start();
                            strictEqual(oSite.groups.HOME.identification.title, oFixture.expectedTitle, "expected title, group has been renamed");
                        });
                })
                .fail(function (sErrorMsg) {
                    if (!oFixture.expectedErrorMessage) {
                        start();
                        ok(false, "should never happen!");
                    } else {
                        strictEqual(sErrorMsg, oFixture.expectedErrorMessage, "error message");
                        sap.ushell.Container.getService("CommonDataModel").getSite()
                            .done(function (oSite) {
                                start();
                                strictEqual(oSite.groups.HOME.identification.title, oFixture.expectedTitle, "expected title, no renaming");
                            });
                    }
                });
        });
    });

    QUnit.test("hideGroups FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter.hideGroups();
        });
    });

    [
        {
            testDescription: "Hide one group",
            input: {
                aGoupIds: ["ONE", "EMPTY"],
                aHiddenGroupIds: ["ONE"]
            },
            output: { aExpectedGroupsToBeHidden: ["ONE"] }
        }, {
            testDescription: "Hide all groups",
            input: {
                aGoupIds: ["ONE", "EMPTY"],
                aHiddenGroupIds: ["ONE", "EMPTY"]
            },
            output: { aExpectedGroupsToBeHidden: ["ONE", "EMPTY"] }
        }, {
            testDescription: "Display all groups",
            input: {
                aGoupIds: ["ONE", "EMPTY"],
                aHiddenGroupIds: []
            },
            output: { aExpectedGroupsToBeHidden: [] }
        }
    ].forEach(function (oFixture) {
        asyncTest("hideGroups: " + oFixture.testDescription, function () {
            var that = this;

            stubUsedServices(getFilteredSite({
                groupsFilter: oFixture.input.aGroupIds
            }));

            that.oAdapter.hideGroups(oFixture.input.aHiddenGroupIds)
                .done(function () {
                    sap.ushell.Container.getService("CommonDataModel").getSite()
                        .done(function (oPersonalizedSite) {
                            start();
                            oFixture.output.aExpectedGroupsToBeHidden.forEach(function (sGroupKey) {
                                strictEqual(oPersonalizedSite.groups[sGroupKey].identification.isVisible, false,
                                    "group with key '" + sGroupKey + "' has been set to invisible");
                            });

                            if (oFixture.output.aExpectedGroupsToBeHidden.length === 0) {
                                Object.keys(oPersonalizedSite.groups).forEach(function (sGroupKey) {
                                    strictEqual(oPersonalizedSite.groups[sGroupKey].identification.hasOwnProperty("isVisible"), false,
                                        "group with key '" + sGroupKey + "' isVisible");
                                });
                            }
                        });
                })
                .fail(function () {
                    start();
                    ok(false, "should never happen");
                });
        });
    });

    asyncTest("hideGroups: hide two groups, afterwards show one of the groups again and then make them all visible", function () {
        var that = this;

        stubUsedServices(getFilteredSite({
            groupsFilter: ["ONE", "EMPTY"]
        }));

        that.oAdapter.hideGroups(["ONE", "EMPTY"])
            .done(function () {
                sap.ushell.Container.getService("CommonDataModel").getSite()
                    .done(function (oPersonalizedSite) {
                        ["ONE", "EMPTY"].forEach(function (sGroupId) {
                            strictEqual(oPersonalizedSite.groups[sGroupId].identification.isVisible, false,
                                "group with id '" + sGroupId + "' has been set to invisible");
                        });

                        // show one of the two hidden groups again
                        that.oAdapter.hideGroups(["ONE"])
                            .done(function () {
                                sap.ushell.Container.getService("CommonDataModel").getSite()
                                    .done(function (oPersonalizedSite) {
                                        strictEqual(oPersonalizedSite.groups.ONE.identification.isVisible, false,
                                            "group 'ONE' is still be invisible");
                                        strictEqual(oPersonalizedSite.groups.EMPTY.identification.hasOwnProperty("isVisible"), false,
                                            "group 'EMPTY' is now visible again");

                                        that.oAdapter.hideGroups([])
                                            .done(function () {
                                                sap.ushell.Container.getService("CommonDataModel").getSite()
                                                    .done(function (oPersonalizedSite) {
                                                        start();
                                                        Object.keys(oPersonalizedSite.groups).forEach(function (sGroupId) {
                                                            strictEqual(oPersonalizedSite.groups[sGroupId].identification.hasOwnProperty("isVisible"), false,
                                                                "group with id '" + sGroupId + "' is visible");
                                                        });
                                                    });
                                            })
                                            .fail(function () {
                                                start();
                                                ok(false, "should never happen");
                                            });
                                    });
                            })
                            .fail(function () {
                                start();
                                ok(false, "should never happen");
                            });
                    });
            })
            .fail(function () {
                start();
                ok(false, "should never happen");
            });
    });

    QUnit.test("isGroupPreset FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter._isGroupPreset();
        });
    });

    [
        {
            testDescription: "default is true",
            inputGroup: {
                identification: { id: "foo" },
                payload: {}
            },
            expectedResult: true
        }, {
            testDescription: "Group preset=true",
            inputGroup: {
                identification: { id: "foo" },
                payload: { isPreset: true }
            },
            expectedResult: true
        }, {
            testDescription: "Group preset=false",
            inputGroup: {
                identification: { id: "foo" },
                payload: { isPreset: false }
            },
            expectedResult: false
        }, {
            testDescription: "Group preset is a string",
            inputGroup: {
                identification: { id: "foo" },
                payload: { isPreset: "preset" }
            },
            expectedResult: true
        }
    ].forEach(function (oFixture) {
        test("_isGroupPreset - " + oFixture.testDescription, function () {
            // Act
            var bResult = this.oAdapter._isGroupPreset(oFixture.inputGroup);
            // Assert
            strictEqual(bResult, oFixture.expectedResult, "_isGroupPreset result");
        });
    });

    QUnit.test("isGroupLocked FAILS when undefined parameter", function (assert) {
        var oAdapter = this.oAdapter;

        // assert
        assert.throws(function () {
            // act
            oAdapter._isGroupLocked();
        });
    });

    [
        {
            testDescription: "default is false",
            inputGroup: {
                identification: { id: "foo" },
                payload: {}
            },
            expectedResult: false
        }, {
            testDescription: "Group locked=true",
            inputGroup: {
                identification: { id: "foo" },
                payload: { locked: true }
            },
            expectedResult: true
        }, {
            testDescription: "Group locked=false",
            inputGroup: {
                identification: { id: "foo" },
                payload: { locked: false }
            },
            expectedResult: false
        }, {
            testDescription: "Group locked is a string",
            inputGroup: {
                identification: { id: "foo" },
                payload: { locked: "locked" }
            },
            expectedResult: true
        }
    ].forEach(function (oFixture) {
        test("_isGroupLocked - " + oFixture.testDescription, function () {
            // Act
            var bResult = this.oAdapter._isGroupLocked(oFixture.inputGroup);
            // Assert
            strictEqual(bResult, oFixture.expectedResult, "_isGroupLocked result");
        });
    });

    asyncTest("resetGroup: change title, then reset group", function () {
        var that = this,
            oSiteService,
            oServiceSpecifications;

        oServiceSpecifications = {
            CommonDataModel: {
                getGroupFromOriginalSite: {
                    returnValue: jQuery.extend(true, {}, O_CDM_SITE.groups.ONE)
                }
            }
        };

        stubUsedServices(getFilteredSite({
            groupsFilter: ["ONE"]
        }), oServiceSpecifications);

        sinon.stub(that.oAdapter, "isGroupRemovable", function () {
            return false;
        });

        sinon.stub(that.oAdapter, "isGroupLocked", function () {
            return false;
        });

        oSiteService = sap.ushell.Container.getService("CommonDataModel");

        oSiteService.getSite()
            .done(function (oSite) {
                // set a new group title
                that.oAdapter.setGroupTitle(oSite.groups.ONE, "My new title")
                    .done(function () {
                        strictEqual(that.oAdapter.getGroupTitle(oSite.groups.ONE), "My new title", "title set");

                        that.oAdapter.resetGroup(oSite.groups.ONE)
                            .done(function (oOriginalGroup) {
                                oSiteService.getSite()
                                    .done(function (oResultSite) {
                                        start();
                                        strictEqual(oResultSite.groups.ONE.identification.title, "ONE Apps", "title restored");
                                        deepEqual(oResultSite.groups.ONE, oOriginalGroup, "group reset");
                                    });
                            })
                            .fail(function () {
                                start();
                                ok(false, "should not happen");
                            });
                    })
                    .fail(function () {
                        start();
                        ok(false, "should not happen");
                    });
            });
    });

    asyncTest("resetGroup: fails because group is removable", function () {
        var that = this,
            oSiteService;

        stubUsedServices(getFilteredSite({
            groupsFilter: ["ONE"]
        }));

        sinon.stub(that.oAdapter, "isGroupRemovable", function () {
            return true;
        });

        sinon.stub(that.oAdapter, "isGroupLocked", function () {
            return false;
        });

        oSiteService = sap.ushell.Container.getService("CommonDataModel");

        oSiteService.getSite()
            .done(function (oSite) {
                // set a new group title
                that.oAdapter.setGroupTitle(oSite.groups.ONE, "My new title")
                    .done(function () {
                        strictEqual(that.oAdapter.getGroupTitle(oSite.groups.ONE), "My new title", "title set");

                        that.oAdapter.resetGroup(oSite.groups.ONE)
                            .done(function (/*oOriginalGroup*/) {
                                start();
                                ok(false, "should not happen");
                            })
                            .fail(function (sErrorMessage, aGroups) {
                                start();
                                strictEqual(sErrorMessage, "Group could not be reset as it was created by the user", "group not reset");
                                deepEqual(aGroups, Object.keys(oSite.groups).map(function (sGroupKey) {
                                    return oSite.groups[sGroupKey];
                                }), "groups collection returned");
                                strictEqual("My new title", aGroups[0].identification.title, "title was not reset");
                            });
                    })
                    .fail(function () {
                        start();
                        ok(false, "should not happen");
                    });
            });
    });

    asyncTest("resetGroup: succeeds even if group is locked", function () {
        var that = this,
            oSiteService,
            fnStubIsGroupLocked,
            sOldGroupTitle,
            oServiceSpecifications;

        oServiceSpecifications = {
            CommonDataModel: {
                getGroupFromOriginalSite: {
                    returnValue: jQuery.extend(true, {}, O_CDM_SITE.groups.ONE)
                }
            }
        };

        stubUsedServices(getFilteredSite({ groupsFilter: ["ONE"] }), oServiceSpecifications);

        sinon.stub(that.oAdapter, "isGroupRemovable", function () {
            return false;
        });

        // simulate, that group was personalized before it was locked
        fnStubIsGroupLocked = sinon.stub(that.oAdapter, "isGroupLocked")
            .returns(false);

        oSiteService = sap.ushell.Container.getService("CommonDataModel");

        oSiteService.getSite()
            .done(function (oSite) {
                sOldGroupTitle = that.oAdapter.getGroupTitle(oSite.groups.ONE);
                // set a new group title
                that.oAdapter.setGroupTitle(oSite.groups.ONE, "My new title")
                    .done(function () {
                        strictEqual(that.oAdapter.getGroupTitle(oSite.groups.ONE), "My new title", "title set");

                        // simulate, that group was locked after personalization
                        fnStubIsGroupLocked.returns(true);

                        that.oAdapter.resetGroup(oSite.groups.ONE)
                            .done(function (/*oOriginalGroup*/) {
                                start();
                                strictEqual(O_CDM_SITE.groups.ONE.identification.title, sOldGroupTitle,
                                    "title was reset");
                            })
                            .fail(function (/*sErrorMessage, oGroups*/) {
                                start();
                                ok(false, "should not happen");
                            });
                    })
                    .fail(function () {
                        start();
                        ok(false, "should not happen");
                    });
            });
    });

    asyncTest("resetGroup: fails because fetching the original group rejects", function () {
        var that = this,
            oSiteService,
            oServiceSpecifications;

        oServiceSpecifications = {
            CommonDataModel: {
                getGroupFromOriginalSite: {
                    errorMessage: "Cannot fetch original group",
                    shouldReject: true
                }
            }
        };

        stubUsedServices(getFilteredSite({
            groupsFilter: ["ONE"]
        }), oServiceSpecifications);

        sinon.stub(that.oAdapter, "isGroupRemovable", function () {
            return false;
        });

        sinon.stub(that.oAdapter, "isGroupLocked", function () {
            return false;
        });

        oSiteService = sap.ushell.Container.getService("CommonDataModel");

        oSiteService.getSite()
            .done(function (oSite) {
                // set a new group title
                that.oAdapter.setGroupTitle(oSite.groups.ONE, "My new title")
                    .done(function () {
                        strictEqual(that.oAdapter.getGroupTitle(oSite.groups.ONE), "My new title", "title set");

                        that.oAdapter.resetGroup(oSite.groups.ONE)
                            .done(function (/*oOriginalGroup*/) {
                                ok(false, "should not happen");
                            })
                            .fail(function (sErrorMessage, aGroups) {
                                start();
                                strictEqual(sErrorMessage, "Group could not be reset - Cannot fetch original group", "group not reset");
                                deepEqual(aGroups, Object.keys(oSite.groups).map(function (sGroupKey) {
                                    return oSite.groups[sGroupKey];
                                }), "groups collection returned");
                                strictEqual("My new title", aGroups[0].identification.title, "title was not reset");
                            });
                    })
                    .fail(function () {
                        start();
                        ok(false, "should not happen");
                    });
            });
    });

    [{
        testDescription: "Call addGroup & pass the title",
        sGroupIdToGenerate: "UniqueGroupId1",
        sGroupTitle: "Group - number one",
        oExpectedGroupObject: {
            "identification": {
                "id": "UniqueGroupId1",
                "namespace": "",
                "title": "Group - number one"
            }
        }
    }, {
        testDescription: "Call addGroup & pass no title",
        sGroupIdToGenerate: "UniqueGroupId2",
        sGroupTitle: undefined,
        oExpectedGroupObject: undefined,
        expectedErrorMessage: "No valid group title"
    }, {
        testDescription: "Call addGroup & pass the title with an incorrect type format",
        sGroupIdToGenerate: "UniqueGroupId3",
        sGroupTitle: 5345,
        oExpectedGroupObject: undefined,
        expectedErrorMessage: "No valid group title"
    }].forEach(function (oFixture) {
        asyncTest("addGroup: " + oFixture.testDescription, function () {
            // Arrange
            var that = this;
            stubUsedServices(getFilteredSite());
            sinon.stub(utils, "generateUniqueId", function () {
                return oFixture.sGroupIdToGenerate || "";
            });

            // Act & Assert
            that.oAdapter.addGroup(oFixture.sGroupTitle)
                .done(function () {
                    sap.ushell.Container.getService("CommonDataModel").getSite()
                        .done(function (oPersonalizedSite) {
                            start();
                            strictEqual(oPersonalizedSite.groups[oFixture.sGroupIdToGenerate].identification.title, oFixture.oExpectedGroupObject.identification.title,
                                "group has been added with the expected key (id) & the passed title");
                        });
                })
                .fail(function (sErrorMsg) {
                    if (!oFixture.expectedErrorMessage) {
                        start();
                        ok(false, "should never happen!");
                    } else {
                        strictEqual(sErrorMsg, oFixture.expectedErrorMessage, "Expected error message");
                        sap.ushell.Container.getService("CommonDataModel").getSite()
                            .done(function (oPersonalizedSite) {
                                start();
                                deepEqual(oPersonalizedSite.groups[oFixture.sGroupIdToGenerate], oFixture.oExpectedGroupObject,
                                    "Expected group object based on an error has been received");
                            });
                    }
                });
        });
    });

    [
        {
            testDescription: "Tile Settings added for normal group tile",
            input: {
                sHash: "#App2-viaStatic",
                oTile: {
                    id: "foo",
                    target: {} // is currently not relevant
                }
            },
            expected: {
                title: O_CSTR["#App2-viaStatic"].title,
                subtitle: O_CSTR["#App2-viaStatic"].subTitle
            }
        }, {
            testDescription: "Tile Settings added for custom group tile",
            input: {
                sHash: "#Shell-customTileWithTargetOutbound",
                oTile: {
                    id: "foo",
                    target: {} // is currently not relevant
                }
            },
            expected: {
                title: O_CSTR["#Shell-customTileWithTargetOutbound"].title,
                subtitle: O_CSTR["#Shell-customTileWithTargetOutbound"].subTitle
            }
        }, {
            testDescription: "Tile Settings added for group tile with personalized title",
            input: {
                sHash: "#App2-viaStatic",
                oTile: {
                    id: "foo",
                    title: "overwritten title",
                    target: {} // is currently not relevant
                }
            },
            expected: {
                title: "overwritten title",
                subtitle: O_CSTR["#App2-viaStatic"].subTitle
            }
        }, {
            testDescription: "Tile Settings added for group tile with personalized subtitle",
            input: {
                sHash: "#App2-viaStatic",
                oTile: {
                    id: "foo",
                    subTitle: "overwritten subtitle",
                    target: {} // is currently not relevant
                }
            },
            expected: {
                title: O_CSTR["#App2-viaStatic"].title,
                subtitle: "overwritten subtitle"
            }
        }, {
            testDescription: "Tile Settings added for group tile with personalized title + subtitle",
            input: {
                sHash: "#App2-viaStatic",
                oTile: {
                    id: "foo",
                    title: "overwritten title",
                    subTitle: "overwritten subtitle",
                    target: {} // is currently not relevant
                }
            },
            expected: {
                title: "overwritten title",
                subtitle: "overwritten subtitle"
            }
        }, {
            testDescription: "Tile Settings added for custom group tile with personalized title + subtitle",
            input: {
                sHash: "#Shell-customTileWithTargetOutbound",
                oTile: {
                    id: "foo",
                    title: "overwritten title",
                    subTitle: "overwritten subtitle",
                    target: {} // is currently not relevant
                }
            },
            expected: {
                title: "overwritten title",
                subtitle: "overwritten subtitle"
            }
        }
    ].forEach(function (oFixture) {
        test("getTileActions, success: " + oFixture.testDescription, function () {
            var aTileActions,
                oRuntimeUtilsSpy = sinon.spy(sap.ushell.components.tiles.utilsRT, "getTileSettingsAction");

            addResolvedTileToAdapter(this.oAdapter, oFixture.input.sHash, oFixture.input.oTile, false, false);

            // Act
            aTileActions = this.oAdapter.getTileActions(oFixture.input.oTile);

            // Assert
            strictEqual(oRuntimeUtilsSpy.callCount, 1, "Runtime utiles called");

            strictEqual(aTileActions.length, 1, "Returned tile actions array not empty");
            strictEqual(aTileActions[0].text, "Edit Tile Information", "Tile actions array contains Settings action");
            strictEqual(aTileActions[0].hasOwnProperty("press"), true, "Settings action contains a press handler");
        });
    });

    [
        {
            testDescription: "undefined",
            inputTile: undefined
        }, {
            testDescription: "empty tile object",
            inputTile: {}
        }
    ].forEach(function (oFixture) {
        test("getTileActions, failure: Invalid tile input - " + oFixture.testDescription, function () {
            // Arrange
            var aTileActions,
                oRuntimeUtilsSpy = sinon.spy(sap.ushell.components.tiles.utilsRT, "getTileSettingsAction");

            // Act
            aTileActions = this.oAdapter.getTileActions(oFixture.inputTile);

            // Assert
            strictEqual(oRuntimeUtilsSpy.callCount, 0, "Runtime utiles not called");
            strictEqual(aTileActions.length, 0, "Empty tile actions array returned");
        });
    });

    test("getTileActions, failure: tile could not be resolved", function () {
        var aTileActions,
            oRuntimeUtilsSpy,
            oTile = {
                id: "foo",
                target: {} // is currently not relevant
            };

        // Arrange
        // mock that the tile failed resolving ("Cannot load tile"-tile)
        this.oAdapter._mFailedResolvedTiles[oTile.id] = "previous error from resolving";
        oRuntimeUtilsSpy = sinon.spy(sap.ushell.components.tiles.utilsRT, "getTileSettingsAction");

        // Act
        aTileActions = this.oAdapter.getTileActions(oTile);

        // Assert
        strictEqual(oRuntimeUtilsSpy.callCount, 0, "Runtime utiles not called");
        strictEqual(aTileActions.length, 0, "Empty tile actions array returned");
    });

    asyncTest("_onTileSettingsSave: tile properties and site updated", function () {
        // Arrange
        var that = this,
            oTile = {
                id: "foo",
                target: {},
                title: "myOldTitle",
                subTitle: "myOldSubtitle",
                info: "myOldInfo",
                tileComponent: { tileSetVisualProperties: sinon.spy() }
            },
            oSettingsDialog = {
                oTitleInput: {
                    getValue: function () {
                        return "myNewTitle";
                    }
                },
                oSubTitleInput: {
                    getValue: function () {
                        return "myNewSubtitle";
                    }
                },
                oInfoInput: {
                    getValue: function () {
                        return "myNewInfo";
                    }
                }
            };

        stubUsedServices(getFilteredSite());
        that.oAdapter._mResolvedTiles = {};
        that.oAdapter._mResolvedTiles[oTile.id] = {
            tileComponent: {
                getComponentData: function () {
                    return {
                        properties: {
                            title: "myTitle",
                            subTitle: "mySubtitle"
                        }
                    };
                },
                tileSetVisualProperties: sinon.spy()
            }
        };

        // Act
        that.oAdapter._onTileSettingsSave(oTile, oSettingsDialog);

        // Assert
        sap.ushell.Container.getService("CommonDataModel").getSite()
            .done(function (oSite) {
                start();
                ok(that.oAdapter._mResolvedTiles[oTile.id].tileComponent.tileSetVisualProperties.calledOnce, true, "called tileSetVisualProperties on tile");
                strictEqual(oSite.modifiedTiles[oTile.id].title, "myNewTitle", "modifiedTiles section in site got updated");
                strictEqual(oSite.modifiedTiles[oTile.id].subTitle, "myNewSubtitle", "modifiedTiles section in site got updated");
                strictEqual(oTile.title, "myNewTitle", "title has been set");
                strictEqual(oTile.subTitle, "myNewSubtitle", "subtitle has been set");
            });
    });

    asyncTest("_onTileSettingsSave: link properties  updated", function () {
        // Arrange
        var that = this,
            oLink = {
                id: "fooLink",
                target: {},
                title: "myOldLinkTitle",
                subTitle: "myOldLinkSubtitle",
                info: "myOldInfo"
            },
            oSettingsDialog = {
                oTitleInput: {
                    getValue: function () {
                        return "myNewLinkTitle";
                    }
                },
                oSubTitleInput: {
                    getValue: function () {
                        return "myNewLinkSubtitle";
                    }
                },
                oInfoInput: {
                    getValue: function () {
                        return "myNewInfo";
                    }
                }
            };

        stubUsedServices(getFilteredSite());
        that.oAdapter._mResolvedTiles = {};
        that.oAdapter._mResolvedTiles[oLink.id] = {
            linkTileControl: {
                setHeader: sinon.spy(),
                setSubheader: sinon.spy(),
                rerender: sinon.spy()
            }
        };

        // Act
        that.oAdapter._onTileSettingsSave(oLink, oSettingsDialog);

        // Assert
        sap.ushell.Container.getService("CommonDataModel").getSite()
            .done(function (oSite) {
                start();
                ok(that.oAdapter._mResolvedTiles[oLink.id].linkTileControl.setHeader.calledOnce, true, "called setHeader on link");
                ok(that.oAdapter._mResolvedTiles[oLink.id].linkTileControl.setSubheader.calledOnce, true, "called setSubheader on link");
                ok(that.oAdapter._mResolvedTiles[oLink.id].linkTileControl.rerender.calledOnce, true, "called rerender on link");
                strictEqual(oSite.modifiedTiles[oLink.id].title, "myNewLinkTitle", "modifiedTiles section in site got updated");
                strictEqual(oSite.modifiedTiles[oLink.id].subTitle, "myNewLinkSubtitle", "modifiedTiles section in site got updated");
                strictEqual(oLink.title, "myNewLinkTitle", "title has been set");
                strictEqual(oLink.subTitle, "myNewLinkSubtitle", "subtitle has been set");
            });
    });

    test("_onTileSettingsSave: tile properties and site unchanged as dialog has been submitted with unchanged input field values", function () {
        // Arrange
        var that = this,
            oTile = {
                id: "foo",
                target: {},
                title: "myOldTitle",
                subTitle: "myOldSubtitle",
                info: "myOldInfo"
            },
            oResolvedTile = {
                tileIntent: "",
                tileResolutionResult: {},
                tileComponent: { tileSetVisualProperties: sinon.spy() }
            },
            oSettingsDialog = {
                oTitleInput: {
                    getValue: function () {
                        return "myOldTitle";
                    }
                },
                oSubTitleInput: {
                    getValue: function () {
                        return "myOldSubtitle";
                    }
                },
                oInfoInput: {
                    getValue: function () {
                        return "myOldInfo";
                    }
                }
            };

        stubUsedServices(getFilteredSite());
        that.oAdapter._mResolvedTiles = {};
        that.oAdapter._mResolvedTiles[oTile.id] = oResolvedTile;

        // Act
        that.oAdapter._onTileSettingsSave(oTile, oSettingsDialog);

        // Assert
        strictEqual(oResolvedTile.tileComponent.tileSetVisualProperties.called, false, "tileSetVisualProperties has not been called");
        strictEqual(oTile.title, "myOldTitle", "title unchanged");
        strictEqual(oTile.subTitle, "myOldSubtitle", "subtitle unchanged");
    });

    test("_onTileSettingsSave: getSite on CommonDataModel service rejects", function () {
        // Arrange
        var that = this,
            oServiceSpecifications = {
                CommonDataModel: {
                    getSite: {
                        errorMessage: "Cannot deliver site",
                        shouldReject: true
                    }
                }
            },
            oErrorLogSpy = sinon.spy(jQuery.sap.log, "error"),
            oTile = {
                id: "foo",
                target: {},
                title: "myOldTitle",
                subTitle: "myOldSubtitle",
                info: "myOldInfo",
                tileComponent: { tileSetVisualProperties: sinon.spy() }
            },
            oSettingsDialog = {
                oTitleInput: {
                    getValue: function () {
                        return "myNewTitle";
                    }
                },
                oSubTitleInput: {
                    getValue: function () {
                        return "myNewSubtitle";
                    }
                },
                oInfoInput: {
                    getValue: function () {
                        return "myNewInfo";
                    }
                }
            };

        stubUsedServices(getFilteredSite(), oServiceSpecifications);

        // Act
        that.oAdapter._onTileSettingsSave(oTile, oSettingsDialog);

        // Assert
        strictEqual(oErrorLogSpy.lastCall.args[0], "Cannot deliver site", "getSite() rejected");
        strictEqual(oTile.title, "myOldTitle", "title has not been changed");
        strictEqual(oTile.subTitle, "myOldSubtitle", "subtitle has not been changed");

        oErrorLogSpy.restore();
    });

    test("_onTileSettingsSave: save on CommonDataModel service rejects", function () {
        // Arrange
        var that = this,
            oServiceSpecifications = {
                CommonDataModel: {
                    save: {
                        errorMessage: "Cannot save personalization",
                        shouldReject: true
                    }
                }
            },
            oErrorLogSpy = sinon.spy(jQuery.sap.log, "error"),
            oTile = {
                id: "foo",
                target: {},
                title: "myOldTitle",
                subTitle: "myOldSubtitle",
                info: "myOldInfo",
                tileComponent: { tileSetVisualProperties: sinon.spy() }
            },
            oSettingsDialog = {
                oTitleInput: {
                    getValue: function () {
                        return "myNewTitle";
                    }
                },
                oSubTitleInput: {
                    getValue: function () {
                        return "myNewSubtitle";
                    }
                },
                oInfoInput: {
                    getValue: function () {
                        return "myNewInfo";
                    }
                }

            };
        that.oAdapter._mResolvedTiles = {};
        that.oAdapter._mResolvedTiles[oTile.id] = {
            tileComponent: {
                getComponentData: function () {
                    return {
                        properties: {
                            title: "myTitle",
                            subTitle: "mySubtitle"
                        }
                    };
                },
                tileSetVisualProperties: sinon.spy()
            }
        };

        stubUsedServices(getFilteredSite(), oServiceSpecifications);

        // Act
        that.oAdapter._onTileSettingsSave(oTile, oSettingsDialog);

        // Assert
        strictEqual(oErrorLogSpy.lastCall.args[0], "Cannot save personalization", "save() rejected");
        strictEqual(oTile.title, "myNewTitle", "title has been updated");
        strictEqual(oTile.subTitle, "myNewSubtitle", "subtitle has been updated");

        oErrorLogSpy.restore();
    });

    asyncTest("_onTileSettingsSave: invalid input", function () {
        // Arrange
        var that = this,
            oTile = {},
            oSettingsDialog = {};

        stubUsedServices(getFilteredSite());

        // Act
        that.oAdapter._onTileSettingsSave(oTile, oSettingsDialog);

        sap.ushell.Container.getService("CommonDataModel").getSite()
            .done(function (oSite) {
                start();
                // Assert
                strictEqual(oSite.hasOwnProperty("modifiedTiles"), false, "modifiedTiles section not part of site object");
            });
    });

    asyncTest("_onTileSettingsSave: invalid input", function () {
        // Arrange
        var that = this,
            oTile,
            oSettingsDialog;

        stubUsedServices(getFilteredSite());

        // Act
        that.oAdapter._onTileSettingsSave(oTile, oSettingsDialog);

        sap.ushell.Container.getService("CommonDataModel").getSite()
            .done(function (oSite) {
                start();
                // Assert
                strictEqual(oSite.hasOwnProperty("modifiedTiles"), false, "modifiedTiles section not part of site object");
            });
    });

    // Bookmark creation tests - success cases
    [
        {
            testDescription: "tile intent could be resolved",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    url: "#App1-viaStatic",
                    info: "Bookmark info"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "info": "Bookmark info",
                    "target": {
                        "semanticObject": "App1",
                        "action": "viaStatic",
                        "parameters": []
                    },
                    "isBookmark": true
                },
                resolvedTile: {
                    tileIntent: "#App1-viaStatic",
                    isLink: false,
                    tileResolutionResult: {
                        isCard: false,
                        isPlatformVisualization: false,
                        appId: "AppDesc1",
                        icon: "sap-icon://Fiori2/F0018",
                        subTitle: "subtitle - Static App Launcher 1",
                        tileComponentLoadInfo: { "componentName": "sap.ushell.components.tiles.cdm.applauncher" },
                        title: "title - Static App Launcher 1",
                        info: "info - Static App Launcher 1",
                        navigationMode: "embedded"
                    }
                }
            }
        }, {
            testDescription: "Given a group, #addBookmark() should create the respective bookmark in the group.",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    url: "#App1-viaStatic",
                    info: "Bookmark info"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "info": "Bookmark info",
                    "target": {
                        "semanticObject": "App1",
                        "action": "viaStatic",
                        "parameters": []
                    },
                    "isBookmark": true
                }
            }
        }, {
            testDescription: "When not given a group, #addBookmark() should create the respective bookmark in the default group.",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    url: "#App1-viaStatic"
                },
                useDefaultGroup: true
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "target": {
                        "semanticObject": "App1",
                        "action": "viaStatic",
                        "parameters": []
                    },
                    "isBookmark": true
                }
            }
        }, {
            testDescription: "Bookmark tile with parameters in the URL",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    url: "#App1-viaStatic?param1=foo&param2=bar"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "target": {
                        "semanticObject": "App1",
                        "action": "viaStatic",
                        "parameters": [
                            { "name": "param1", "value": "foo" },
                            { "name": "param2", "value": "bar" }
                        ]
                    },
                    "isBookmark": true
                }
            }
        }, {
            testDescription: "Bookmark tile arbitrary URL; no service URL",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    // URL is matching #SO-Action pattern but should not end-up in a target
                    url: "https://www.google.com"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "target": { url: "https://www.google.com" },
                    "isBookmark": true
                },
                resolvedTile: {
                    tileIntent: "#",
                    isLink: false,
                    tileResolutionResult: {
                        tileComponentLoadInfo: { componentName: "sap.ushell.components.tiles.cdm.applauncher" },
                        isCustomTile: false
                    }
                }
            }
        }, {
            testDescription: "Bookmark tile arbitrary URL matching SO-action pattern; no service URL",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    // URL is matching #SO-Action pattern but should not end-up in a target
                    url: "https://en.wikipedia.org/wiki/Web_2.0#Web-based_applications_and_desktops"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "target": { url: "https://en.wikipedia.org/wiki/Web_2.0#Web-based_applications_and_desktops" },
                    "isBookmark": true
                },
                resolvedTile: {
                    tileIntent: "#",
                    isLink: false,
                    tileResolutionResult: {
                        tileComponentLoadInfo: { componentName: "sap.ushell.components.tiles.cdm.applauncher" },
                        isCustomTile: false
                    }
                }
            }
        }, {
            testDescription: "Bookmark tile arbitrary URL; no service URL",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    // URL is matching #SO-Action pattern but should not end-up in a target
                    url: "https://www.google.com"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "target": { url: "https://www.google.com" },
                    "isBookmark": true
                },
                resolvedTile: {
                    tileIntent: "#",
                    isLink: false,
                    tileResolutionResult: {
                        tileComponentLoadInfo: { componentName: "sap.ushell.components.tiles.cdm.applauncher" },
                        isCustomTile: false
                    }
                }
            }
        }, {
            testDescription: "Bookmark tile arbitrary URL matching SO-action pattern; with service URL",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    // URL is matching #SO-Action pattern but should not end-up in a target
                    url: "https://en.wikipedia.org/wiki/Web_2.0#Web-based_applications_and_desktops",
                    serviceUrl: "/some/service/endpoint/$count"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "indicatorDataSource": { "path": "/some/service/endpoint/$count" },
                    "target": { url: "https://en.wikipedia.org/wiki/Web_2.0#Web-based_applications_and_desktops" },
                    "isBookmark": true
                },
                resolvedTile: {
                    tileIntent: "#",
                    isLink: false,
                    tileResolutionResult: {
                        tileComponentLoadInfo: { componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic" },
                        isCustomTile: false
                    }
                }
            }
        }, {
            testDescription: "Bookmark tile arbitrary URL; with service URL",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    // URL is matching #SO-Action pattern but should not end-up in a target
                    url: "https://www.google.com",
                    serviceUrl: "/some/service/endpoint/$count"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "indicatorDataSource": { "path": "/some/service/endpoint/$count" },
                    "target": { url: "https://www.google.com" },
                    "isBookmark": true
                },
                resolvedTile: {
                    tileIntent: "#",
                    isLink: false,
                    tileResolutionResult: {
                        tileComponentLoadInfo: { componentName: "sap.ushell.components.tiles.cdm.applauncherdynamic" },
                        isCustomTile: false
                    }
                }
            }
        }, {
            testDescription: "Bookmark tile arbitrary URL matching SO-action pattern; with service URL",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    // URL is matching #SO-Action pattern but should not end-up in a target
                    url: "https://en.wikipedia.org/wiki/Web_2.0#Web-based_applications_and_desktops"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "target": { url: "https://en.wikipedia.org/wiki/Web_2.0#Web-based_applications_and_desktops" },
                    "isBookmark": true
                },
                resolvedTile: {
                    tileIntent: "#",
                    isLink: false,
                    tileResolutionResult: {
                        tileComponentLoadInfo: { componentName: "sap.ushell.components.tiles.cdm.applauncher" },
                        isCustomTile: false
                    }
                }
            }
        }, {
            testDescription: "Bookmark tile with subtitle",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    subtitle: "Bookmark subtitle",
                    url: "#App1-viaStatic"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "subTitle": "Bookmark subtitle",
                    "target": {
                        "semanticObject": "App1",
                        "action": "viaStatic",
                        "parameters": []
                    },
                    "isBookmark": true
                }
            }
        }, {
            testDescription: "Bookmark tile with icon",
            input: {
                oParameters: {
                    title: "Bookmark title",
                    icon: "sap-icon://favorite",
                    url: "#App1-viaStatic"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title",
                    "icon": "sap-icon://favorite",
                    "target": {
                        "semanticObject": "App1",
                        "action": "viaStatic",
                        "parameters": []
                    },
                    "isBookmark": true
                }
            }
        }, {
            testDescription: "Bookmark tile with parameters and inner-app route in the URL",
            input: {
                oParameters: {
                    title: "Bookmark title with inner app route",
                    url: "#App1-viaStatic?param1=foo&param2=bar&/ShoppingCart(12345)"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title with inner app route",
                    "target": {
                        "semanticObject": "App1",
                        "action": "viaStatic",
                        "parameters": [
                            { "name": "param1", "value": "foo" },
                            { "name": "param2", "value": "bar" }
                        ],
                        "appSpecificRoute": "&/ShoppingCart(12345)"
                    },
                    "isBookmark": true
                }
            }
        }, {
            testDescription: "Bookmark tile with inner-app route in the URL",
            input: {
                oParameters: {
                    title: "Bookmark title with inner app route",
                    url: "#App1-viaStatic&/ShoppingCart(12345)"
                }
            },
            expected: {
                tile: {
                    "id": "000000-12345678",
                    "title": "Bookmark title with inner app route",
                    "target": {
                        "semanticObject": "App1",
                        "action": "viaStatic",
                        "parameters": [],
                        "appSpecificRoute": "&/ShoppingCart(12345)"
                    },
                    "isBookmark": true
                }
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("addBookmark succeeds when: " + oFixture.testDescription, function () {
            var sTileId = "000000-12345678";
            var oAdapter = this.oAdapter;

            // arrange
            sinon.stub(utils, "generateUniqueId").returns(sTileId);
            stubUsedServices(getFilteredSite({
                groupsFilter: ["EMPTY"]
            }));

            if (oFixture.useDefaultGroup) {
                oAdapter.getDefaultGroup().then(addBookmarkToGroup);
            } else {
                oAdapter.getGroups().then(function (aGroups) {
                    addBookmarkToGroup(aGroups[0]);
                });
            }

            function addBookmarkToGroup (oGroup) {
                var iInitialNumberOfTiles = oAdapter.getGroupTiles(oGroup).length;
                var oPromiseToAddBookmark = oAdapter.addBookmark(oFixture.input.oParameters, oGroup);

                oPromiseToAddBookmark.fail(function () {
                    // assert failure case
                    ok(false, "Could not add bookmark to group");
                    start();
                });

                oPromiseToAddBookmark.done(function () {
                    // assert success case part 1
                    // _mResolvedTiles must be tested before getGroups is called, as getGroups will overwrite
                    // _mResolvedTiles completely
                    if (oFixture.expected.resolvedTile) {
                        deepEqual(oAdapter._mResolvedTiles[sTileId], oFixture.expected.resolvedTile, "for URL bookmark tile an entry was added to _mResolvedTiles");
                    }
                    strictEqual(oAdapter._mFailedResolvedTiles[sTileId], undefined, "the tile resolution did not fail");

                    oAdapter.getGroups().then(function (aGroups) {
                        var aTiles = oAdapter.getGroupTiles(aGroups[0]);

                        // assert success case part 2
                        strictEqual(aTiles.length, iInitialNumberOfTiles + 1, "Calling #addBookmark() results in the creation of one tile.");
                        deepEqual(aTiles[0], oFixture.expected.tile, "Tile added as bookmark");

                        start();
                    });
                });
            }
        });
    });

    // Bookmark creation tests - failure cases
    [
        {
            testDescription: "tile intent could not be resolved (default group)",
            input: {
                useDefaultGroup: true, // note
                oParameters: {
                    title: "Bookmark title",
                    url: "#UnknownSemanticObject-unknownAction",
                    info: "Bookmark info"
                }
            },
            expectedErrorMessage: "Bookmark creation failed because: Hash '#UnknownSemanticObject-unknownAction' could not be resolved to a tile. stubed CSTR: no resolution result found for '#UnknownSemanticObject-unknownAction'"
        }, {
            testDescription: "tile intent could not be resolved (non-default group)",
            input: {
                useDefaultGroup: false, // note
                oParameters: {
                    title: "Bookmark title",
                    url: "#UnknownSemanticObject-unknownAction",
                    info: "Bookmark info"
                }
            },
            expectedErrorMessage: "Bookmark creation failed because: Hash '#UnknownSemanticObject-unknownAction' could not be resolved to a tile. stubed CSTR: no resolution result found for '#UnknownSemanticObject-unknownAction'"
        }
    ].forEach(function (oFixture) {
        asyncTest("addBookmark fails when: " + oFixture.testDescription, function () {
            var oAdapter = this.oAdapter,
                sTileId = "000000-12345678",
                aOriginalGroupTiles,
                fnSaveSpy;

            // arrange
            sinon.stub(utils, "generateUniqueId").returns(sTileId);
            stubUsedServices(getFilteredSite({ // here the failing is ensured
                groupsFilter: ["EMPTY"]
            }));
            fnSaveSpy = sinon.spy(sap.ushell.Container.getService("CommonDataModel"), "save");

            if (oFixture.useDefaultGroup) {
                oAdapter.getDefaultGroup().then(addBookmarkToGroup);

            } else {
                oAdapter.getGroups().then(function (aGroups) {
                    addBookmarkToGroup(aGroups[0]);
                });
            }

            function addBookmarkToGroup (oGroup) {
                aOriginalGroupTiles = oAdapter.getGroupTiles(oGroup).slice(0); // slice to clone

                // act
                oAdapter.addBookmark(oFixture.input.oParameters, oGroup)
                    .done(function () {
                        ok(false, "unexpected success");
                        start();
                    })
                    .fail(function (sErrorMessage) {
                        strictEqual(sErrorMessage, oFixture.expectedErrorMessage, "error message");
                        strictEqual(oAdapter._mFailedResolvedTiles[sTileId], undefined, "do not cache errors for not created tiles");
                        strictEqual(fnSaveSpy.callCount, 0, "Side should not be saved if the target could not be resolved");
                        deepEqual(aOriginalGroupTiles, oAdapter.getGroupTiles(oGroup), "Group must stay untouched as adding failed");
                        start();
                    });
            }
        });
    });

    // Bookmark tests
    (function () {
        function getFixtures () {
            return [
                {
                    url: "#SO-action",
                    description: "Should count bookmarks based on a simple URL without parameters.",
                    expectedCount: 3
                }, {
                    url: "#SO-action?foo=bar&boo=far",
                    description: "Should count bookmarks based on a URL with parameters.",
                    expectedCount: 2
                }, {
                    url: "#SO-action?boo=far&foo=bar",
                    description: "Order of URL parameter does not affect bookmark count.",
                    expectedCount: 2
                }, {
                    url: "#SO-action?boo=far",
                    description: "Bookmark counting takes whole content of URL parameters into consideration.",
                    expectedCount: 1
                }, {
                    url: "#SO-action?boo=ya!",
                    description: "Should really count bookmarks with any combination of URL parameters",
                    expectedCount: 1
                }, {
                    url: "http://www.sap.com?a=1",
                    description: "Arbitrary url bookmark count #1",
                    expectedCount: 2
                }, {
                    url: "http://www.sap.com",
                    description: "Arbitrary url bookmark count #2",
                    expectedCount: 1
                }
            ];
        }

        asyncTest("#visitBookmarks()", function () {
            var oAdapter,
                aCombinationOfCasesConsidered,
                aCasesConsideredWithVisitor,
                aCasesConsideredWithoutVisitor;

            oAdapter = this.oAdapter;

            // arrange
            stubUsedServices(getFilteredSite({
                groupsFilter: ["BOOKMARK_COUNT"]
            }));

            aCasesConsideredWithVisitor = getFixtures().map(function (oFixture) {
                oFixture.visitor = sinon.spy();

                return oAdapter
                    ._visitBookmarks(oFixture.url, oFixture.visitor)
                    .fail(function () {
                        assert.ok(false, "Counting failed for fixture with description: [" + oFixture.description + "]");
                    })
                    .then(function (iCount) {
                        oFixture.actualCount = iCount;
                        oFixture.withVisitor = true;

                        return oFixture;
                    });
            });

            aCasesConsideredWithoutVisitor = getFixtures().map(function (oFixture) {
                return oAdapter
                    ._visitBookmarks(oFixture.url)
                    .fail(function () {
                        assert.ok(false, "Counting (without visitor) failed for fixture with description: [" + oFixture.description + "]");
                    })
                    .then(function (iCount) {
                        oFixture.actualCount = iCount;

                        return oFixture;
                    });
            });

            aCombinationOfCasesConsidered = aCasesConsideredWithVisitor.concat(aCasesConsideredWithoutVisitor);

            jQuery.when
                .apply(jQuery, aCombinationOfCasesConsidered)
                .then(function () {
                    var aFixtureOutcomes = Array.prototype.slice.call(arguments);

                    aFixtureOutcomes.forEach(function (oFixtureOutcome) {
                        var sRegime = oFixtureOutcome.withVisitor
                            ? "[With visitor] "
                            : "[Without visitor] ";

                        assert.strictEqual(oFixtureOutcome.actualCount, oFixtureOutcome.expectedCount, sRegime + oFixtureOutcome.description);

                        if (oFixtureOutcome.withVisitor) {
                            assert.strictEqual(oFixtureOutcome.visitor.callCount, oFixtureOutcome.expectedCount, "~^~ Visitor was called as expected for the preceeding case. ~^~");
                        }
                    });
                })
                .then(start, start);
        });

        asyncTest("#countBookmarks()", function () {
            var oAdapter = this.oAdapter,
                oFixture = {
                    url: "#SO-action",
                    description: "Should count bookmarks based on a simple URL without parameters.",
                    expectedCount: 3
                },
                oSpyVisitBookmarks = sinon.spy(oAdapter, "_visitBookmarks");

            // arrange
            stubUsedServices(getFilteredSite({
                groupsFilter: ["BOOKMARK_COUNT"]
            }));

            oAdapter
                .countBookmarks("#SO-action")
                .then(function (iActualCount) {
                    assert.strictEqual(oFixture.expectedCount, iActualCount, oFixture.description);
                    assert.ok(oSpyVisitBookmarks.calledOnce, "countBookmarks delegates to visitBookmarks as expected.");
                })
                .then(start, start);
        });

        asyncTest("#updateBookmarks()", function () {
            var assertionsCompleted;
            var oAdapter = this.oAdapter;

            // arrange
            stubUsedServices(getFilteredSite({
                groupsFilter: ["BOOKMARK_COUNT"]
            }));

            assertionsCompleted = [
                {
                    description: "Should update action of a bookmark.",
                    initialState: { url: "#SO-action" },
                    finalState: {
                        url: "#SO-actionxyz",
                        expectedCountAfterUpdate: 3
                    }
                }, {
                    description: "Should update semantic object of a bookmark.",
                    initialState: { url: "#SO-action?foo=bar&boo=far" },
                    finalState: {
                        url: "#YO-action?foo=bar&boo=far",
                        expectedCountAfterUpdate: 2
                    }
                }, {
                    description: "Should update parameters of a bookmark.",
                    initialState: { url: "#SO-action?one=1&two=2" },
                    finalState: {
                        url: "SO-bulgogi?let=them&eat=kimchi",
                        expectedCountAfterUpdate: 2
                    }
                }, {
                    description: "Should update every URL attribute of a bookmark at a go.",
                    initialState: { url: "#SO-action?boo=far" },
                    finalState: {
                        url: "#SOON-fraction?boogie=fartty",
                        expectedCountAfterUpdate: 1
                    }
                }, {
                    description: "Should update no-identifying attributes of a bookmark without changing the count.",
                    initialState: {
                        url: "#SO-action?boo=ya!",
                        icon: "sap-icon://family-care"
                    },
                    finalState: {
                        url: "#SO-action?boo=ya!",
                        expectedCountAfterUpdate: 1
                    }
                }, {
                    description: "arbitrary URL unchanged",
                    initialState: {
                        url: "http://www.sap.com?a=1",
                        icon: "sap-icon://family-care"
                    },
                    finalState: {
                        url: "http://www.sap.com?a=1",
                        expectedCountAfterUpdate: 2
                    }
                }, {
                    // does not check the bTileViewPropertiesChanged flag
                    description: "arbitrary URL changed, tile component is notified about new URL of 2 tiles",
                    initialState: {
                        url: "http://www.sap.com?a=1",
                        icon: "sap-icon://family-care"
                    },
                    finalState: {
                        url: "http://www.sap.com?a=2",
                        expectedCountAfterUpdate: 2,
                        expectedTilesToBeNotified: ["07", "09"],
                        expectedComponentNotification: {
                            "title": undefined,
                            "targetURL": "http://www.sap.com?a=2"
                        }
                    }
                }, {
                    description: "Info changed, tile component is notified about new Info in all relavant tiles.",
                    initialState: {
                        url: "http://www.sap.com?a=10",
                        icon: "sap-icon://family-care"
                    },
                    finalState: {
                        info: "Changed Info",
                        url: "http://www.sap.com?a=10",
                        expectedCountAfterUpdate: 2,
                        expectedTilesToBeNotified: ["10", "11"],
                        expectedComponentNotification: { "info": "Changed Info" }
                    }
                }, {
                    // checks the bTileViewPropertiesChanged flag
                    description: "arbitrary URL changed, tile component is notified about new URL of one tile",
                    initialState: {
                        url: "http://www.sap.com?a=12",
                        icon: "sap-icon://family-care"
                    },
                    finalState: {
                        url: "http://www.sap.com?a=13",
                        expectedCountAfterUpdate: 1,
                        expectedTilesToBeNotified: ["12"],
                        expectedComponentNotification: { "targetURL": "http://www.sap.com?a=13" }
                    }
                }
            ].map(function (oFixture) {
                var aTilesToBeNotified = oFixture.finalState.expectedTilesToBeNotified,
                    aSetVisualPropertiesSpies = [];

                // arrange
                if (aTilesToBeNotified && aTilesToBeNotified.length > 0) {
                    aTilesToBeNotified.forEach(function (sTileId) {
                        var fnSpy = sinon.spy();
                        oAdapter._mResolvedTiles[sTileId] = {
                            tileComponent: {
                                tileSetVisualProperties: fnSpy
                            }
                        };
                        aSetVisualPropertiesSpies.push({
                            tileId: sTileId,
                            spy: fnSpy
                        });
                    });
                }

                // act
                return oAdapter.
                    updateBookmarks(oFixture.initialState.url, oFixture.finalState).
                    then(function () {
                        return oAdapter.countBookmarks(oFixture.finalState.url);
                    }).
                    then(function (iUpdatedCount) {
                        // assert
                        assert.strictEqual(iUpdatedCount,
                            oFixture.finalState.expectedCountAfterUpdate,
                            oFixture.description);
                        if (aSetVisualPropertiesSpies.length > 0) {
                            aSetVisualPropertiesSpies.forEach(function (fnSpy) {
                                assert.strictEqual(fnSpy.spy.callCount, 1, "tileSetVisualProperties called on tile " + fnSpy.tileId);
                                assert.deepEqual(fnSpy.spy.firstCall.args[0], oFixture.finalState.expectedComponentNotification, "tileSetVisualProperties arguments for tile " + fnSpy.tileId);
                            });
                        }
                    });
            });

            jQuery.when.apply(jQuery, assertionsCompleted).then(start, start);
        });

        asyncTest("#deleteBookmarks()", function () {
            var assertionsCompleted;
            var oAdapter = this.oAdapter;

            // arrange
            stubUsedServices(getFilteredSite({ groupsFilter: ["BOOKMARK_COUNT"] }));

            assertionsCompleted = [
                {
                    url: "#SO-action",
                    description: "Should be able to delete matching bookmarks simply made up of just its semantic object and action.",
                    expectedDeleteCount: 3
                }, {
                    url: "#SO-action?foo=bar&boo=far",
                    description: "Should be able to delete matching bookmarks consisting of multiple parameters.",
                    expectedDeleteCount: 2
                }, {
                    url: "#SO-action?boo=ya!",
                    description: "Should be able to delete matching bookmarks consisting of a single parameter.",
                    expectedDeleteCount: 1
                }, {
                    url: "http://www.sap.com?a=1",
                    description: "Arbitrary URL bookmark matched #1",
                    expectedDeleteCount: 2
                }, {
                    url: "http://www.sap.com",
                    description: "Arbitrary URL bookmark matched #2",
                    expectedDeleteCount: 1
                }
            ].map(function (oFixture) {
                return oAdapter.deleteBookmarks(oFixture.url)
                    .then(function (iCount0) {
                        var o = { reportedNumberOfDeletes: iCount0 };

                        return oAdapter.
                            countBookmarks(oFixture.url).
                            then(function (iCount1) {
                                o.countAfterDelete = iCount1;

                                return o;
                            });
                    })
                    .then(function (oResult) {
                        var ok = oResult.reportedNumberOfDeletes === oFixture.expectedDeleteCount && oResult.countAfterDelete === 0;

                        assert.ok(ok, oFixture.description);
                    });
            });

            jQuery.when.apply(jQuery, assertionsCompleted).then(start, start);
        });
    })();
});

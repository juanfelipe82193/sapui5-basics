// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.Bookmark
 */
sap.ui.require([
    "sap/ushell/services/Bookmark",
    "sap/ushell/test/utils",
    "sap/ushell/Config"
], function (Bookmark, testUtils, Config) {
    "use strict";
    /*global asyncTest, deepEqual, module, notStrictEqual, ok, start, strictEqual, test, sinon */

    // require early so that we can spy on them (and esp. try to restore the spies in teardown)

    var oBookmarkService,
        oLaunchPageService,
        oConfigStub;

    module("sap.ushell.services.Bookmark", {
        setup: function () {
            oLaunchPageService = {
                addBookmark: sinon.stub().returns(jQuery.Deferred().promise()),
                countBookmarks: sinon.stub().returns({}),
                deleteBookmarks: sinon.stub().returns(jQuery.Deferred().promise()),
                onCatalogTileAdded: sinon.stub(),
                updateBookmarks: sinon.stub().returns({}),
                getGroupId: function (oGroup) {
                    return oGroup.id;
                },
                getGroupTitle: function (oGroup) {
                    return oGroup.title;
                }
            };
            sap.ushell.Container = {
                getService: function (sName) {
                    strictEqual(sName, "LaunchPage", "requested the LaunchPage service");
                    return oLaunchPageService;
                }
            };
            oBookmarkService = new Bookmark();

            oConfigStub = sinon.stub(Config, "last");
            oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            testUtils.restoreSpies(
            );
            delete sap.ushell.Container;

            oConfigStub.restore();
        }
    });

    test("while personalization is disabled you cannot add a bookmark", function () {
        var oBookmarkConfig = {};

        // code under test
        oBookmarkService.addBookmark(oBookmarkConfig);

        // test
        ok(oLaunchPageService.addBookmark.notCalled);
    });

    test("while personalization is enabled you can add a bookmark", function () {
        var oBookmarkConfig = {};
        oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        // code under test
        oBookmarkService.addBookmark(oBookmarkConfig);

        // test
        ok(oLaunchPageService.addBookmark.calledOnce);
        ok(oLaunchPageService.addBookmark.calledWith(oBookmarkConfig));
    });

    test("addBookmarkByGroupId while personalization is disabled", function () {
        var oBookmarkConfig = {title: "AddedById", url: "#FioriToExtAppTarget-Action"},
            groupId = "group_0";

        oLaunchPageService.getGroups = function () {
            return (new jQuery.Deferred()).resolve([{id: "default"}, {id: "group_0"}]).promise();
        };

        // code under test
        oBookmarkService.addBookmarkByGroupId(oBookmarkConfig, groupId);

        // test
        ok(oLaunchPageService.addBookmark.notCalled);
    });

    test("addBookmarkByGroupId while personalization is enabled", function () {
        var oBookmarkConfig = {title: "AddedById", url: "#FioriToExtAppTarget-Action"},
            groupId = "group_0";
        oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        oLaunchPageService.getGroups = function () {
            return (new jQuery.Deferred()).resolve([{id: "default"}, {id: "group_0"}]).promise();
        };

        // code under test
        oBookmarkService.addBookmarkByGroupId(oBookmarkConfig, groupId);

        // test
        ok(oLaunchPageService.addBookmark.calledOnce);
        ok(oLaunchPageService.addBookmark.calledWith(oBookmarkConfig));
    });

    asyncTest("getGroupsIdsForBookmarks", function () {

        oLaunchPageService.getGroupsForBookmarks = function () {
            return (new jQuery.Deferred()).resolve([
                {id: "1", title: "group1", object: {id: 1, title: "group1"}},
                {id: "2", title: "group2", object: {id: 2, title: "group2"}},
                {id: "3", title: "group3", object: {id: 3, title: "group3"}}
            ]).promise();
        };

        oBookmarkService.getShellGroupIDs().done(function (aGroups) {
            start();

            strictEqual(aGroups.length, 3, "groups were filtered correctly");
            deepEqual(aGroups[0], {"id": 1, "title": "group1"});
            deepEqual(aGroups[1], {"id": 2, "title": "group2"});
            deepEqual(aGroups[2], {"id": 3, "title": "group3"});

        });
    });

    test("countBookmarks", function () {
        var oResult = oBookmarkService.countBookmarks("###");

        strictEqual(oLaunchPageService.countBookmarks.args[0][0], "###");
        strictEqual(oResult, oLaunchPageService.countBookmarks.returnValues[0]);
    });

    test("deleteBookmarks", function () {
        var oResult = oBookmarkService.deleteBookmarks("###");

        strictEqual(oLaunchPageService.deleteBookmarks.args[0][0], "###");
        strictEqual(oResult, oLaunchPageService.deleteBookmarks.returnValues[0]);
    });

    test("updateBookmarks", function () {
        var oParameters = {},
            oResult = oBookmarkService.updateBookmarks("###", oParameters);

        strictEqual(oLaunchPageService.updateBookmarks.args[0][0], "###");
        strictEqual(oLaunchPageService.updateBookmarks.args[0][1], oParameters);
        strictEqual(oResult, oLaunchPageService.updateBookmarks.returnValues[0]);
    });

    test("_isMatchingRemoteCatalog", function () {
        var oCatalog = {
            getCatalogData: sinon.stub().returns({remoteId: "foo", baseUrl: "/bar"})
        };

        oLaunchPageService.getCatalogData = function (oCatalog0) {
            return oCatalog0.getCatalogData();
        };
        // remote catalogs
        strictEqual(oBookmarkService._isMatchingRemoteCatalog(oCatalog,
            {remoteId: "bar", baseUrl: "/bar"}), false);
        strictEqual(oBookmarkService._isMatchingRemoteCatalog(oCatalog,
            {remoteId: "foo", baseUrl: "/baz"}), false);
        strictEqual(oBookmarkService._isMatchingRemoteCatalog(oCatalog,
            {remoteId: "foo", baseUrl: "/bar"}), true);
        strictEqual(oBookmarkService._isMatchingRemoteCatalog(oCatalog,
            {remoteId: "foo", baseUrl: "/bar/"}), true);
        oCatalog.getCatalogData.returns({remoteId: "foo", baseUrl: "/bar/"});
        strictEqual(oBookmarkService._isMatchingRemoteCatalog(oCatalog,
            {remoteId: "foo", baseUrl: "/bar"}), true);
    });

    /*
     * Resolve the promise with the given index and result or fail if it is bound to fail
     * currently.
     *
     * @param {number} iFailAtPromiseNo
     *   the index for which to fail
     * @param {number} iIndex
     *   the index of the current resolution
     * @param {object} oResult
     *   argument to jQuery.Deferred#resolve
     * @returns the given deferred object's promise
     */
    function resolveOrFail (iFailAtPromiseNo, iIndex, oResult) {
        var oDeferred = new jQuery.Deferred();
        // return results asynchronously, otherwise LPA.getCatalogs() reports only the last catalog
        // via progress
        sap.ushell.utils.call(function () {
            if (iFailAtPromiseNo === iIndex) {
                oDeferred.reject("Fail at promise #" + iFailAtPromiseNo);
            } else {
                if (sap.ushell.utils.isArray(oResult)) {
                    oResult.forEach(function (oSingleResult) {
                        oDeferred.notify(oSingleResult);
                    });
                }
                oDeferred.resolve(oResult);
            }
        }, testUtils.onError, true);
        return oDeferred.promise();
    }

    function testDoAddCatalogTileToGroup (iFailAtPromiseNo, sGroupId, bCatalogTileSuffix) {
        var bAddTileCalled = false,
            oCatalog = {},
            sCatalogTileId = "foo",
            fnResolveOrFail = resolveOrFail.bind(null, iFailAtPromiseNo);

        // stubs and tests
        oLaunchPageService.addTile = function (oCatalogTile, oGroup) {
            deepEqual(oCatalogTile, {id: sCatalogTileId});
            deepEqual(oGroup, {id: sGroupId});
            strictEqual(bAddTileCalled, false, "addTile() not yet called!");
            bAddTileCalled = true;
            return fnResolveOrFail(1);
        };
        oLaunchPageService.getCatalogId = function () {
            return "bar";
        };
        oLaunchPageService.getCatalogTileId = function (oCatalogTile) {
            if (bCatalogTileSuffix) {
                // see BCP 0020751295 0000142292 2017
                return oCatalogTile.id + "_SYS.ALIAS";
            }
            return oCatalogTile.id;
        };
        oLaunchPageService.getCatalogTiles = function (oCatalog0) {
            strictEqual(oCatalog0, oCatalog);
            return fnResolveOrFail(2,
                // simulate broken HANA catalog with duplicate CHIP IDs
                [{}, {id: sCatalogTileId}, {id: sCatalogTileId}]);
        };
        oLaunchPageService.getDefaultGroup = function () {
            return fnResolveOrFail(3, {id: undefined});
        };
        oLaunchPageService.getGroups = function () {
            return fnResolveOrFail(3, [{}, {id: sGroupId}]);
        };
        oLaunchPageService.getGroupId = function (oGroup) {
            return oGroup.id;
        };

        // code under test
        oBookmarkService._doAddCatalogTileToGroup(new jQuery.Deferred(), sCatalogTileId, oCatalog,
            sGroupId)
            .fail(function (sMessage) {
                start();
                notStrictEqual(iFailAtPromiseNo, 0, "Failure");
                strictEqual(sMessage, "Fail at promise #" + iFailAtPromiseNo);
            })
            .done(function () {
                start();
                strictEqual(iFailAtPromiseNo, 0, "Success");
            });
    }

    [true, false].forEach(function (bCatalogTileSuffix) {
        [0, 1, 2, 3].forEach(function (iFailAtPromiseNo) {
            var sTitle = "catalog tile ID " + (bCatalogTileSuffix ? "with" : "without") + " suffix; ";
            sTitle += (iFailAtPromiseNo > 0) ? "fail at #" + iFailAtPromiseNo : "success";

            asyncTest("_doAddCatalogTileToGroup (default); " + sTitle, function () {
                testDoAddCatalogTileToGroup(iFailAtPromiseNo, undefined, bCatalogTileSuffix);
            });

            asyncTest("_doAddCatalogTileToGroup (given); " + sTitle, function () {
                testDoAddCatalogTileToGroup(iFailAtPromiseNo, {}, bCatalogTileSuffix);
            });
        });
    });

    asyncTest("_doAddCatalogTileToGroup (missing group)", function () {
        var sGroupId = "unknown",
            oLogMock = testUtils.createLogMock()
                .filterComponent("sap.ushell.services.Bookmark")
                .error("Group 'unknown' is unknown", null, "sap.ushell.services.Bookmark");

        oLaunchPageService.getGroups = function () {
            return (new jQuery.Deferred()).resolve([{id: "default"}, {id: "bar"}]).promise();
        };
        oLaunchPageService.getGroupId = function (oGroup) {
            return oGroup.id;
        };

        // code under test
        oBookmarkService._doAddCatalogTileToGroup(new jQuery.Deferred(), "foo", {}, sGroupId)
            .fail(function (sMessage) {
                start();
                strictEqual(sMessage, "Group 'unknown' is unknown");
                oLogMock.verify();
            })
            .done(testUtils.onError);
    });

    asyncTest("_doAddCatalogTileToGroup (missing tile)", function () {
        var sError = "No tile 'foo' in catalog 'bar'",
            oLogMock = testUtils.createLogMock()
                .filterComponent("sap.ushell.services.Bookmark")
                .error(sError, null, "sap.ushell.services.Bookmark");

        oLaunchPageService.getDefaultGroup = function () {
            return (new jQuery.Deferred()).resolve({}).promise();
        };
        oLaunchPageService.getCatalogTiles = function (oCatalog) {
            return (new jQuery.Deferred()).resolve([{}, {}]).promise();
        };
        oLaunchPageService.getCatalogId = function () {
            return "bar";
        };
        oLaunchPageService.getCatalogTileId = function () {
            return "";
        };
        oLaunchPageService.getGroupId = function () {
            return "testGroupId";
        };

        // code under test
        oBookmarkService._doAddCatalogTileToGroup(new jQuery.Deferred(), "foo", {})
            .fail(function (sMessage) {
                start();
                strictEqual(sMessage, sError);
                oLogMock.verify();
            })
            .done(testUtils.onError);
    });

    function testAddCatalogTileToGroup (iFailAtPromiseNo, oTargetCatalog, oCatalogData) {
        var sCatalogTileId = "foo",
            oTestGroup = {},
            oSecondMatchingCatalog = JSON.parse(JSON.stringify(oTargetCatalog)),
            fnResolveOrFail = resolveOrFail.bind(null, iFailAtPromiseNo);

        // preparation
        sinon.stub(oBookmarkService, "_doAddCatalogTileToGroup",
            function (oDeferred, sTileId, oCatalog, oGroup) {
                strictEqual(sTileId, sCatalogTileId);
                strictEqual(oCatalog, oTargetCatalog);
                strictEqual(oGroup, oTestGroup);
                if (iFailAtPromiseNo === 2) {
                    oDeferred.reject("Fail at #" + iFailAtPromiseNo);
                } else {
                    oDeferred.resolve();
                }
            });
        oLaunchPageService.getCatalogs = function () {
            ok(oLaunchPageService.onCatalogTileAdded.calledWith(sCatalogTileId));
            return fnResolveOrFail(1, [{}, oTargetCatalog, oSecondMatchingCatalog]);
        };

        // code under test
        return oBookmarkService.addCatalogTileToGroup(sCatalogTileId, oTestGroup, oCatalogData)
            .fail(function (sMessage) {
                start();
                notStrictEqual(iFailAtPromiseNo, 0, "Failure");
                strictEqual(sMessage, "Fail at promise #" + iFailAtPromiseNo);
            })
            .done(function () {
                start();
                strictEqual(iFailAtPromiseNo, 0, "Success");
            });
        //TODO catalog refresh call with catalog ID
        //TODO enhance LPA.onCatalogTileAdded by optional sCatalogId parameter
    }

    [0, 1].forEach(function (iFailAtPromiseNo) {
        var sTitle = (iFailAtPromiseNo > 0) ? "fail at #" + iFailAtPromiseNo : "success";
        asyncTest("addCatalogTileToGroup (HANA legacy catalog), " + sTitle, function () {

            oLaunchPageService.getCatalogId = function (oCatalog) {
                return oCatalog.id;
            };

            testAddCatalogTileToGroup(iFailAtPromiseNo,
                {id: "X-SAP-UI2-HANA:hana?remoteId=HANA_CATALOG"});
        });
    });

    [0, 1].forEach(function (iFailAtPromiseNo) {
        var sTitle = (iFailAtPromiseNo > 0) ? "fail at #" + iFailAtPromiseNo : "success";
        asyncTest("addCatalogTileToGroup (remote catalog), " + sTitle, function () {
            var oCatalogData = {},
                oRemoteCatalog = {remoteId: "foo"},
                oLogMock = testUtils.createLogMock()
                    .filterComponent("sap.ushell.services.Bookmark")
                    .warning("More than one matching catalog: " + JSON.stringify(oCatalogData),
                        null, "sap.ushell.services.Bookmark");

            oBookmarkService._isMatchingRemoteCatalog = function (oCatalog, oCatalogData0) {
                return oCatalog.remoteId === "foo";
            };

            testAddCatalogTileToGroup(iFailAtPromiseNo, oRemoteCatalog, oCatalogData)
                .done(function () {
                    oLogMock.verify();
                });
        });
    });

    asyncTest("addCatalogTileToGroup (missing remote catalog)", function () {
        var sError = "No matching catalog found: {}",
            oLogMock = testUtils.createLogMock()
                .filterComponent("sap.ushell.services.Bookmark")
                .error(sError, null, "sap.ushell.services.Bookmark");

        oBookmarkService._isMatchingRemoteCatalog = function () {
            return false;
        };

        oLaunchPageService.getCatalogs = function () {
            return (new jQuery.Deferred()).resolve([{id: "default"}, {id: "bar"}]).promise();
        };

        // code under test
        oBookmarkService.addCatalogTileToGroup("foo", "groupId", {})
            .done(testUtils.onError)
            .fail(function (sMessage) {
                start();
                strictEqual(sMessage, sError);
                oLogMock.verify();
            });
    });

    asyncTest("addCatalogTileToGroup (missing legacy HANA catalog)", function () {
        var sError = "No matching catalog found: "
            + "{\"id\":\"X-SAP-UI2-HANA:hana?remoteId=HANA_CATALOG\"}",
            oLogMock = testUtils.createLogMock()
                .filterComponent("sap.ushell.services.Bookmark")
                .error(sError, null, "sap.ushell.services.Bookmark");

        oLaunchPageService.getCatalogs = function () {
            return (new jQuery.Deferred()).resolve([{id: "default"}, {id: "bar"}]).promise();
        };
        oLaunchPageService.getCatalogId = function (oCatalog) {
            return oCatalog.id;
        };

        // code under test
        oBookmarkService.addCatalogTileToGroup("foo", "groupId")
            .done(testUtils.onError)
            .fail(function (sMessage) {
                start();
                strictEqual(sMessage, sError);
                oLogMock.verify();
            });
    });

    asyncTest("No personalization in bookmarks", function () {

        var oResult = oBookmarkService.addBookmark();
        oResult.done(function () {
            strictEqual(arguments.length, 0, "The Promise has been resolved without parameters");
            start();
        });
        oResult.fail(function () {
            ok(false, "The Promise has been rejected");
            start();
        });
    });
});

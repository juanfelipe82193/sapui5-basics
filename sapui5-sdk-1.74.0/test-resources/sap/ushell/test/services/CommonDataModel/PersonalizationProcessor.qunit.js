// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.CommonDataModel.PersonalizationProcessor
 */
sap.ui.require([
    "sap/ushell/services/_CommonDataModel/PersonalizationProcessor"
], function (PersonalizationProcessor) {
    "use strict";

    /* global asyncTest, deepEqual, equal, module, ok, QUnit, start, assert, sinon, strictEqual, test */

    QUnit.dump.maxDepth = 20;

    /**
     * A function which ignores all of its arguments and just starts QUnit once.
     *
     * BEWARE: do not directly use <code>start</code> as a success handler if any arguments are passed to it!
     * Else QUnit's semaphore becomes NaN and you run into trouble.
     */
    function startBy1 () {
        start(1);
    }

    /**
     * Bundles the request logic for fetching test data
     *
     * @param {string} sPath File name of the test data file which should be requested
     * @returns {object} promise, the jQuery promise's done handler returns the parsed test data object.
     *   In case an error occured, the promise's fail handler returns an error message.
     */
    function requestData (sPath) {
        var oDataRequestDeferred = new jQuery.Deferred();

        jQuery.ajax({
            type: "GET",
            dataType: "json",
            url: sPath
        }).done(function (oResponseData) {
            oDataRequestDeferred.resolve(oResponseData);
        }).fail(function (oError) {
            jQuery.sap.log.error(oError.responseText);
            oDataRequestDeferred.reject("Data was requested but could not be loaded.");
        });

        return oDataRequestDeferred.promise();
    }

    module("sap.ushell.services.CommonDataModel.PersonalizationProcessor", {
        setup: function () { },
        teardown: function () { }
    });

    // Begin of test for method "_applyGroupVisibility":
    [{
        "testDescription": "Group was set to be invisible",
        "sGroupId": "SAP_UI2_TEST",
        "bGroupVisibility": false,
        "bGroupVisibilityHasBeenChanged": true,
        "expectedVisibility": false
    }, {
        "testDescription": "Group is is not exisiting",
        "sGroupId": "UNVALID",
        "bGroupVisibility": false,
        "bGroupVisibilityHasBeenChanged": false
    }, {
        "testDescription": "No group id passed as input parameter",
        "sGroupId": undefined,
        "bGroupVisibility": false,
        "bGroupVisibilityHasBeenChanged": false
    }, {
        "testDescription": "No visibility passed as input parameter",
        "sGroupId": "SAP_UI2_TEST",
        "bGroupVisibility": undefined,
        "bGroupVisibilityHasBeenChanged": false
    }, {
        "testDescription": "No visibility and no group id passed as input parameters",
        "sGroupId": undefined,
        "bGroupVisibility": undefined,
        "bGroupVisibilityHasBeenChanged": false
    }].forEach(function (oFixture) {
        asyncTest("_applyGroupVisibility: " + oFixture.testDescription, function () {
            var oTestDataPromise,
                oPersonalizationProcessor = new PersonalizationProcessor();

            oTestDataPromise = requestData("../../../cdmLiveSiteData/CommonDataModelAdapterDataTest.json");
            oTestDataPromise.done(function (oTestDataResponse) {
                var bGroupVisibilityHasBeenChanged = oPersonalizationProcessor._applyGroupVisibility(
                    oFixture.sGroupId, oFixture.bGroupVisibility, oTestDataResponse
                );

                start();
                equal(bGroupVisibilityHasBeenChanged, oFixture.bGroupVisibilityHasBeenChanged, "correct decision taken " +
                    "whether changing the visibility should take place or not");
                if (oFixture.bGroupVisibilityHasBeenChanged) {
                    strictEqual(
                        oTestDataResponse.groups[oFixture.sGroupId].identification.isVisible,
                        oFixture.expectedVisibility,
                        "correct visibility has been set"
                    );
                }
            });
        });
    });

    // Begin of test for method "_applyRenameGroup":
    [{
        "testDescription": "correct title set",
        "sGroupId": "SAP_UI2_TEST",
        "sNewTitle": "foobar",
        "bGroupHasBeenRenamed": true,
        "expectedTitle": "foobar"
    }, {
        "testDescription": "still old title, group was not part of original site",
        "sGroupId": "NotPartOfSite",
        "sNewTitle": "foobar",
        "bGroupHasBeenRenamed": false,
        "expectedTitle": undefined
    }, {
        "testDescription": "still old title, undefined group id",
        "sGroupId": undefined,
        "sNewTitle": "foobar",
        "bGroupHasBeenRenamed": false,
        "expectedTitle": undefined
    }, {
        "testDescription": "still old title, undefined new title",
        "sGroupId": "SAP_UI2_TEST",
        "sNewTitle": undefined,
        "bGroupHasBeenRenamed": false,
        "expectedTitle": undefined
    }, {
        "testDescription": "still old title, undefined new title and undefined group id",
        "sGroupId": undefined,
        "sNewTitle": undefined,
        "bGroupHasBeenRenamed": false,
        "expectedTitle": undefined
    }].forEach(function (oFixture) {
        asyncTest("_applyRenameGroup: " + oFixture.testDescription, function () {
            var oTestDataPromise,
                oPersonalizationProcessor = new PersonalizationProcessor();

            oTestDataPromise = requestData("../../../cdmLiveSiteData/CommonDataModelAdapterDataTest.json");
            oTestDataPromise.done(function (oTestDataResponse) {
                var bGroupHasBeenRenamed = oPersonalizationProcessor._applyRenameGroup(
                    oFixture.sGroupId, oFixture.sNewTitle, oTestDataResponse
                );

                start();
                equal(bGroupHasBeenRenamed, oFixture.bGroupHasBeenRenamed,
                    "correct decision taken whether renaming should take place or not");
                if (oFixture.bGroupHasBeenRenamed) {
                    strictEqual(
                        oTestDataResponse.groups[oFixture.sGroupId].identification.title,
                        oFixture.expectedTitle,
                        "correct title has been set"
                    );
                }
            });
        });
    });

    // Begin of test for method "_checkRenameGroup":
    [{
        "testDescription": "Extracts personalization delta correctly, empty initial personalization delta",
        "sGroupId": "foobar",
        "oLiveSiteGroups": { "foobar": { "identification": { "title": "Hello Renamed World!" } } },
        "oOriginalSiteGroups": { "foobar": { "identification": { "title": "Hello World!" } } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": { "groups": { "foobar": { "identification": { "title": "Hello Renamed World!" } } } }
    }, {
        "testDescription": "Extracts personalization delta correctly, filled initial personalization delta",
        "sGroupId": "foobar",
        "oLiveSiteGroups": { "foobar": { "identification": { "title": "Hello Renamed World!" } } },
        "oOriginalSiteGroups": { "foobar": { "identification": { "title": "Hello World!" } } },
        "oInitialPersonalizationDelta": { "groups": { "myGroup": { "identification": { "title": "That's my group" } } } },
        "expectedPersonalizationDelta": {
            "groups": {
                "foobar": { "identification": { "title": "Hello Renamed World!" } },
                "myGroup": { "identification": { "title": "That's my group" } }
            }
        }
    }, {
        "testDescription": "Extracts personalization delta correctly, undefined initial personalization delta",
        "sGroupId": "foobar",
        "oLiveSiteGroups": { "foobar": { "identification": { "title": "Hello Renamed World!" } } },
        "oOriginalSiteGroups": { "foobar": { "identification": { "title": "Hello World!" } } },
        "oInitialPersonalizationDelta": undefined,
        "expectedPersonalizationDelta": { "groups": { "foobar": { "identification": { "title": "Hello Renamed World!" } } } }
    }, {
        "testDescription": "No extraction, undefined group id",
        "sGroupId": undefined,
        "oLiveSiteGroups": { "foobar": { "identification": { "title": "Hello Renamed World!" } } },
        "oOriginalSiteGroups": { "foobar": { "identification": { "title": "Hello World!" } } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {}
    }, {
        "testDescription": "No extraction, undefined live site groups",
        "sGroupId": "foobar",
        "oLiveSiteGroups": undefined,
        "oOriginalSiteGroups": { "foobar": { "identification": { "title": "Hello World!" } } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {}
    }, {
        "testDescription": "No extraction, undefined original site groups",
        "sGroupId": "foobar",
        "oLiveSiteGroups": { "foobar": { "identification": { "title": "Hello Renamed World!" } } },
        "oOriginalSiteGroups": undefined,
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {}
    }, {
        "testDescription": "No extraction, group id not part of original site groups",
        "sGroupId": "foobar",
        "oLiveSiteGroups": { "foobar": { "identification": { "title": "Hello Renamed World!" } } },
        "oOriginalSiteGroups": { "myGroup": { "identification": { "title": "That's my group!" } } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {}
    }].forEach(function (oFixture) {
        test("_checkRenameGroup: " + oFixture.testDescription, function () {
            var oPersonalizationProcessor = new PersonalizationProcessor(),
                oPersonalizationDeltaResult;

            oPersonalizationDeltaResult = oPersonalizationProcessor._checkRenameGroup(
                oFixture.sGroupId,
                oFixture.oLiveSiteGroups,
                oFixture.oOriginalSiteGroups,
                oFixture.oInitialPersonalizationDelta
            );

            deepEqual(oPersonalizationDeltaResult, oFixture.expectedPersonalizationDelta, "correct personalization delta");
        });
    });

    // BEGIN:: _checkTileSettings tests.
    [{
        "testDescription": "when the settings of a tile was previously changed, another change can yet be made correctly.",
        "oSite": {
            modifiedTiles: {
                "A_tile_0": {
                    id: "A_tile_0",
                    title: "SOME TITLE [MODIFIED x 2]",
                    subTitle: "SOME SUBTITLE [MODIFIED x 2]"
                }
            }
        },
        "oInitialPersonalizationDelta": {
            modifiedTiles: {
                "A_tile_0": {
                    id: "A_tile_0",
                    title: "SOME TITLE [MODIFIED]",
                    subTitle: "SOME SUBTITLE [MODIFIED]"
                }
            }
        },
        "expectedPersonalizationDelta": {
            modifiedTiles: {
                "A_tile_0": {
                    id: "A_tile_0",
                    title: "SOME TITLE [MODIFIED x 2]",
                    subTitle: "SOME SUBTITLE [MODIFIED x 2]"
                }
            }
        }
    }, {
        "testDescription": "when setting of tile was not changed previously, the tile setting is correctly changed the first time.",
        "oSite": {
            modifiedTiles: {
                "A_tile_0": {
                    id: "A_tile_0",
                    title: "SOME TITLE [MODIFIED]",
                    subTitle: "SOME SUBTITLE [MODIFIED]"
                }
            }
        },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {
            modifiedTiles: {
                "A_tile_0": {
                    id: "A_tile_0",
                    title: "SOME TITLE [MODIFIED]",
                    subTitle: "SOME SUBTITLE [MODIFIED]"
                }
            }
        }
    }].forEach(function (oFixture) {
        var testDescription = "PersonalizationProcessor#_checkTileSettings(): " +
            oFixture.testDescription;

        QUnit.test(testDescription, function () {
            var oPersonalizationProcessor = new PersonalizationProcessor();
            var oPersonalizationDeltaResult = oFixture.oInitialPersonalizationDelta;

            oPersonalizationProcessor._checkTileSettings(
                oFixture.oSite,
                oPersonalizationDeltaResult
            );

            assert.deepEqual(oPersonalizationDeltaResult,
                oFixture.expectedPersonalizationDelta,
                "correct personalization delta");
        });
    });
    // END:: _checkTileSettings tests.

    // BEGIN:: _applyTileSettings tests.
    [{
        "testDescription": "User changes on tiles in the same group are correctly applied",
        "oSite": {
            groups: {
                "group_0": {
                    identification: {
                        id: "group_0",
                        title: "GROUP 0"
                    },
                    payload: {
                        tiles: [
                            {
                                id: "tile_0",
                                icon: "tile_0 icon",
                                title: "tile_0 title",
                                subTitle: "tile_0 subtitle",
                                target: {
                                    semanticObject: "foo_0",
                                    action: "bar_0",
                                    parameters: [{
                                        name: "boo_0",
                                        value: "ya_0"
                                    }]
                                }
                            }, {
                                id: "tile_1",
                                icon: "tile_1 icon",
                                title: "tile_1 title",
                                subTitle: "tile_1 subtitle",
                                target: {
                                    semanticObject: "foo_1",
                                    action: "bar_1",
                                    parameters: [{
                                        name: "boo_1",
                                        value: "ya_1"
                                    }]
                                }
                            }
                        ]
                    }
                }
            }
        },
        "oPersonalizationDelta": {
            modifiedTiles: {
                "tile_0": {
                    id: "tile_0",
                    title: "tile_0 title [MODIFIED]",
                    subTitle: "tile_0 subtitle [MODIFIED]"
                },
                "tile_1": {
                    id: "tile_1",
                    title: "tile_1 title [MODIFIED]",
                    info: "tile_1 info [MODIFIED]",
                    subTitle: "tile_1 subtitle [MODIFIED]"
                }
            }
        },
        "oExpectedPersonalizedSite": {
            groups: {
                "group_0": {
                    identification: {
                        id: "group_0",
                        title: "GROUP 0"
                    },
                    payload: {
                        tiles: [
                            {
                                id: "tile_0",
                                icon: "tile_0 icon",
                                title: "tile_0 title [MODIFIED]",
                                subTitle: "tile_0 subtitle [MODIFIED]",
                                target: {
                                    semanticObject: "foo_0",
                                    action: "bar_0",
                                    parameters: [{
                                        name: "boo_0",
                                        value: "ya_0"
                                    }]
                                }
                            }, {
                                id: "tile_1",
                                icon: "tile_1 icon",
                                title: "tile_1 title [MODIFIED]",
                                info: "tile_1 info [MODIFIED]",
                                subTitle: "tile_1 subtitle [MODIFIED]",
                                target: {
                                    semanticObject: "foo_1",
                                    action: "bar_1",
                                    parameters: [{
                                        name: "boo_1",
                                        value: "ya_1"
                                    }]
                                }
                            }
                        ]
                    }
                }
            },
            modifiedTiles: {
                "tile_0": {
                    id: "tile_0",
                    title: "tile_0 title [MODIFIED]",
                    subTitle: "tile_0 subtitle [MODIFIED]"
                },
                "tile_1": {
                    id: "tile_1",
                    title: "tile_1 title [MODIFIED]",
                    info: "tile_1 info [MODIFIED]",
                    subTitle: "tile_1 subtitle [MODIFIED]"
                }
            }
        }
    }, {
        "testDescription": "User changes on tiles across groups are correctly applied,"
            + " and unmodified tiles are correctly preserved",
        "oSite": {
            groups: {
                "group_0": {
                    identification: {
                        id: "group_0",
                        title: "GROUP 0"
                    },
                    payload: {
                        tiles: [
                            {
                                id: "group_0+tile_0",
                                icon: "group_0+tile_0 icon",
                                title: "group_0+tile_0 title",
                                subTitle: "group_0+tile_0 subtitle",
                                target: {
                                    semanticObject: "foo_0",
                                    action: "bar_0",
                                    parameters: [{
                                        name: "boo_0",
                                        value: "ya_0"
                                    }]
                                }
                            }, {
                                id: "group_0+tile_1",
                                icon: "group_0+tile_1 icon",
                                title: "group_0+tile_1 title",
                                subTitle: "group_0+tile_1 subtitle",
                                target: {
                                    semanticObject: "foo_1",
                                    action: "bar_1",
                                    parameters: [{
                                        name: "boo_1",
                                        value: "ya_1"
                                    }]
                                }
                            }
                        ]
                    }
                },
                "group_1": {
                    identification: {
                        id: "group_1",
                        title: "GROUP 1"
                    },
                    payload: {
                        tiles: [
                            {
                                id: "group_1+tile_0",
                                icon: "group_1+tile_0 icon",
                                title: "group_1+tile_0 title",
                                subTitle: "group_1+tile_0 subtitle",
                                target: {
                                    semanticObject: "foo_0",
                                    action: "bar_0",
                                    parameters: [{
                                        name: "boo_0",
                                        value: "ya_0"
                                    }]
                                }
                            }, {
                                id: "group_1+tile_1",
                                icon: "group_1+tile_1 icon",
                                title: "group_1+tile_1 title",
                                subTitle: "group_1+tile_1 subtitle",
                                target: {
                                    semanticObject: "foo_1",
                                    action: "bar_1",
                                    parameters: [{
                                        name: "boo_1",
                                        value: "ya_1"
                                    }]
                                }
                            }
                        ]
                    }
                }
            }
        },
        "oPersonalizationDelta": {
            modifiedTiles: {
                "group_0+tile_0": {
                    id: "group_0+tile_0",
                    title: "group_0+tile_0 title [MODIFIED]",
                    subTitle: "group_0+tile_0 subtitle [MODIFIED]"
                },
                "group_1+tile_1": {
                    id: "group_1+tile_1",
                    title: "group_1+tile_1 title [MODIFIED]",
                    subTitle: "group_1+tile_1 subtitle [MODIFIED]"
                }
            }
        },
        "oExpectedPersonalizedSite": {
            groups: {
                "group_0": {
                    identification: {
                        id: "group_0",
                        title: "GROUP 0"
                    },
                    payload: {
                        tiles: [
                            {
                                id: "group_0+tile_0",
                                icon: "group_0+tile_0 icon",
                                title: "group_0+tile_0 title [MODIFIED]",
                                subTitle: "group_0+tile_0 subtitle [MODIFIED]",
                                target: {
                                    semanticObject: "foo_0",
                                    action: "bar_0",
                                    parameters: [{
                                        name: "boo_0",
                                        value: "ya_0"
                                    }]
                                }
                            }, {
                                id: "group_0+tile_1",
                                icon: "group_0+tile_1 icon",
                                title: "group_0+tile_1 title",
                                subTitle: "group_0+tile_1 subtitle",
                                target: {
                                    semanticObject: "foo_1",
                                    action: "bar_1",
                                    parameters: [{
                                        name: "boo_1",
                                        value: "ya_1"
                                    }]
                                }
                            }
                        ]
                    }
                },
                "group_1": {
                    identification: {
                        id: "group_1",
                        title: "GROUP 1"
                    },
                    payload: {
                        tiles: [
                            {
                                id: "group_1+tile_0",
                                icon: "group_1+tile_0 icon",
                                title: "group_1+tile_0 title",
                                subTitle: "group_1+tile_0 subtitle",
                                target: {
                                    semanticObject: "foo_0",
                                    action: "bar_0",
                                    parameters: [{
                                        name: "boo_0",
                                        value: "ya_0"
                                    }]
                                }
                            }, {
                                id: "group_1+tile_1",
                                icon: "group_1+tile_1 icon",
                                title: "group_1+tile_1 title [MODIFIED]",
                                subTitle: "group_1+tile_1 subtitle [MODIFIED]",
                                target: {
                                    semanticObject: "foo_1",
                                    action: "bar_1",
                                    parameters: [{
                                        name: "boo_1",
                                        value: "ya_1"
                                    }]
                                }
                            }
                        ]
                    }
                }
            },
            modifiedTiles: {
                "group_0+tile_0": {
                    id: "group_0+tile_0",
                    title: "group_0+tile_0 title [MODIFIED]",
                    subTitle: "group_0+tile_0 subtitle [MODIFIED]"
                },
                "group_1+tile_1": {
                    id: "group_1+tile_1",
                    title: "group_1+tile_1 title [MODIFIED]",
                    subTitle: "group_1+tile_1 subtitle [MODIFIED]"
                }
            }
        }
    }].forEach(function (oFixture) {
        var testDescription = "PersonalizationProcessor#_applyTileSettings(): " +
            oFixture.testDescription;

        QUnit.test(testDescription, function () {
            var oPersonalizationProcessor = new PersonalizationProcessor();

            oPersonalizationProcessor._applyTileSettings(
                oFixture.oSite,
                oFixture.oPersonalizationDelta
            );

            assert.deepEqual(oFixture.oSite, oFixture.oExpectedPersonalizedSite,
                "applied personalization correctly.");
        });
    });
    // END:: _applyTileSettings tests.

    // Begin of test for method "_checkGroupVisibility":
    [{
        "testDescription": "Extracts personalization delta correctly, empty initial personalization delta",
        "sGroupId": "foobar",
        "oLiveSiteGroups": { "foobar": { "identification": { "isVisible": false } } },
        "oOriginalSiteGroups": { "foobar": { "identification": {} } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": { "groups": { "foobar": { "identification": { "isVisible": false } } } }
    }, {
        "testDescription": "Extracts personalization delta correctly, filled initial personalization delta",
        "sGroupId": "foobar",
        "oLiveSiteGroups": { "foobar": { "identification": { "isVisible": false } } },
        "oOriginalSiteGroups": { "foobar": { "identification": {} } },
        "oInitialPersonalizationDelta": { "groups": { "myGroup": { "identification": { "isVisible": false } } } },
        "expectedPersonalizationDelta": {
            "groups": {
                "foobar": { "identification": { "isVisible": false } },
                "myGroup": { "identification": { "isVisible": false } }
            }
        }
    }, {
        "testDescription": "Extracts personalization delta correctly, undefined initial personalization delta",
        "sGroupId": "foobar",
        "oLiveSiteGroups": { "foobar": { "identification": { "isVisible": false } } },
        "oOriginalSiteGroups": { "foobar": { "identification": {} } },
        "oInitialPersonalizationDelta": undefined,
        "expectedPersonalizationDelta": { "groups": { "foobar": { "identification": { "isVisible": false } } } }
    }, {
        "testDescription": "No extraction, undefined group id",
        "sGroupId": undefined,
        "oLiveSiteGroups": { "foobar": { "identification": { "isVisible": false } } },
        "oOriginalSiteGroups": { "foobar": { "identification": {} } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {}
    }, {
        "testDescription": "No extraction, undefined live site groups",
        "sGroupId": "foobar",
        "oLiveSiteGroups": undefined,
        "oOriginalSiteGroups": { "foobar": { "identification": {} } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {}
    }, {
        "testDescription": "No extraction, undefined original site groups",
        "sGroupId": "foobar",
        "oLiveSiteGroups": { "foobar": { "identification": { "isVisible": false } } },
        "oOriginalSiteGroups": undefined,
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {}
    }, {
        "testDescription": "No extraction, group id not part of original site groups",
        "sGroupId": "foobar",
        "oLiveSiteGroups": { "foobar": { "identification": { "isVisible": false } } },
        "oOriginalSiteGroups": { "myGroup": { "identification": {} } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {}
    }].forEach(function (oFixture) {
        test("_checkGroupVisibility: " + oFixture.testDescription, function () {
            var oPersonalizationProcessor = new PersonalizationProcessor(),
                oPersonalizationDeltaResult;

            oPersonalizationDeltaResult = oPersonalizationProcessor._checkGroupVisibility(
                oFixture.sGroupId,
                oFixture.oLiveSiteGroups,
                oFixture.oOriginalSiteGroups,
                oFixture.oInitialPersonalizationDelta
            );

            deepEqual(oPersonalizationDeltaResult, oFixture.expectedPersonalizationDelta, "correct personalization delta");
        });
    });

    // Test data that can be used to test mixin/extract alongside test data in test/js/sap/ushell/cdmLiveSiteData

    var aTestDataMap = [
        {
            "testDescription": "renameGroup",
            "sLiveSiteData": "CDMLiveSiteGroupRenamed.json",
            "sPersonalizationDeltaData": "CDMPersonalizationGroupRenamed.json"
        }, {
            "testDescription": "changeGroupVisibilityChanged",
            "sLiveSiteData": "CDMLiveSiteGroupVisibilityChanged.json",
            "sPersonalizationDeltaData": "CDMPersonalizationGroupVisibilityChanged.json"
        }, {
            "testDescription": "changeLinkSettings",
            "sLiveSiteData": "CDMLiveSiteLinkSettingsChanged.json",
            "sPersonalizationDeltaData": "CDMPersonalizationLinkSettingsChanged.json"
        }, {
            "testDescription": "changeTileSettings",
            "sLiveSiteData": "CDMLiveSiteTileSettingsChanged.json",
            "sPersonalizationDeltaData": "CDMPersonalizationTileSettingsChanged.json"
        }, {
            "testDescription": "removeGroup",
            "sLiveSiteData": "CDMLiveSiteGroupRemove.json",
            "sPersonalizationDeltaData": "CDMPersonalizationGroupRemove.json"
        }, {
            "testDescription": "addGroup",
            "sLiveSiteData": "CDMLiveSiteGroupAdded.json",
            "sPersonalizationDeltaData": "CDMPersonalizationGroupAdded.json"
        }, {
            "testDescription": "moveGroupInOrder",
            "sLiveSiteData": "CDMLiveSiteGroupOrderChanged.json",
            "sPersonalizationDeltaData": "CDMPersonalizationGroupOrderChanged.json"
        }, {
            "testDescription": "moveTiles",
            "sLiveSiteData": "CDMLiveSiteTileMoved.json",
            "sPersonalizationDeltaData": "CDMPersonalizationTileMoved.json"
        }, {
            "testDescription": "moveLinks",
            "sLiveSiteData": "CDMLiveSiteLinkMoved.json",
            "sPersonalizationDeltaData": "CDMPersonalizationLinkMoved.json"
        }, {
            "testDescription": "addLinkToGroup",
            "sLiveSiteData": "CDMLiveSiteLinkAdded.json",
            "sPersonalizationDeltaData": "CDMPersonalizationLinkAdded.json"
        }, {
            "testDescription": "addTileToGroup",
            "sLiveSiteData": "CDMLiveSiteTileAdded.json",
            "sPersonalizationDeltaData": "CDMPersonalizationTileAdded.json"
        }, {
            "testDescription": "addTile and addGroup when original site was empty before",
            "sOriginalSiteData": "CommonDataModelAdapterDataTestEmptySite.json",
            "sLiveSiteData": "CDMLiveSiteGroupAddedAndTileAddedToNewGroupToEmptySite.json",
            "sPersonalizationDeltaData": "CDMPersonalizationGroupAddedAndTileAddedToNewGroupToEmptySite.json"
        }, {
            "testDescription": "addGroupAndaddLinkToNewGroup",
            "sLiveSiteData": "CDMLiveSiteGroupAddedAndLinkAddedToNewGroup.json",
            "sPersonalizationDeltaData": "CDMPersonalizationGroupAddedAndLinkAddedToNewGroup.json"
        }, {
            "testDescription": "addGroupAndaddTileToNewGroup",
            "sLiveSiteData": "CDMLiveSiteGroupAddedAndTileAddedToNewGroup.json",
            "sPersonalizationDeltaData": "CDMPersonalizationGroupAddedAndTileAddedToNewGroup.json"
        }
    ];

    aTestDataMap.forEach(function (oFixture) {
        asyncTest("extractPersonalization: " + oFixture.testDescription, function () {
            var oOriginalSiteDataPromise,
                oLiveSiteDataPromise,
                oPersonalizationDeltaDataPromise,
                oPersonalizationProcessor = new PersonalizationProcessor();

            // request test data
            oOriginalSiteDataPromise = requestData("../../../cdmLiveSiteData/"
                + (oFixture.sOriginalSiteData || "CommonDataModelAdapterDataTest.json"));
            oLiveSiteDataPromise = requestData("../../../cdmLiveSiteData/" + oFixture.sLiveSiteData);
            oPersonalizationDeltaDataPromise
                = requestData("../../../cdmLiveSiteData/" + oFixture.sPersonalizationDeltaData);

            // sync promises
            jQuery.when(oOriginalSiteDataPromise, oLiveSiteDataPromise, oPersonalizationDeltaDataPromise)
                .done(function (oOriginalSiteData, oLiveSiteData, oPersonalizationDeltaData) {
                    oPersonalizationProcessor.extractPersonalization(oLiveSiteData, oOriginalSiteData)
                        .done(function (oPersonalizationDeltaResult) {
                            start();
                            // check for correct personalization delta
                            deepEqual(oPersonalizationDeltaResult, oPersonalizationDeltaData,
                                "correct personalization delta calculated");
                        });
                })
                .fail(startBy1);
        });
    });

    aTestDataMap.forEach(function (oFixture) {
        asyncTest("mixinPersonalization: " + oFixture.testDescription, function () {
            var oOriginalSiteDataPromise,
                oLiveSiteDataPromise,
                oPersonalizationDeltaDataPromise,
                oPersonalizationProcessor = new PersonalizationProcessor();

            sinon.spy(oPersonalizationProcessor, "_applyRenameGroup");
            sinon.spy(oPersonalizationProcessor, "_applyGroupVisibility");
            sinon.spy(oPersonalizationProcessor, "_applyRemoveGroup");
            sinon.spy(oPersonalizationProcessor, "_applyAddGroups");
            sinon.spy(oPersonalizationProcessor, "_applyMoveGroup");
            sinon.spy(oPersonalizationProcessor, "_applyTileSettings");

            // request test data
            oOriginalSiteDataPromise = requestData("../../../cdmLiveSiteData/"
                + (oFixture.sOriginalSiteData || "CommonDataModelAdapterDataTest.json"));
            oLiveSiteDataPromise = requestData("../../../cdmLiveSiteData/" + oFixture.sLiveSiteData);
            oPersonalizationDeltaDataPromise
                = requestData("../../../cdmLiveSiteData/" + oFixture.sPersonalizationDeltaData);

            // sync promises
            jQuery.when(oOriginalSiteDataPromise, oLiveSiteDataPromise, oPersonalizationDeltaDataPromise)
                .done(function (oOriginalSiteData, oLiveSiteData, oPersonalizationDeltaData) {
                    // Remove parts of input data which are not relevant for this test but cause test errors done to bugs in test data:
                    if (oOriginalSiteData.applications) { delete oOriginalSiteData.applications; }
                    if (oOriginalSiteData.catalogs) { delete oOriginalSiteData.catalogs; }
                    if (oLiveSiteData.applications) { delete oLiveSiteData.applications; }
                    if (oLiveSiteData.catalogs) { delete oLiveSiteData.catalogs; }
                    if (oOriginalSiteData.systemAliases) { delete oOriginalSiteData.systemAliases; }
                    if (oLiveSiteData.systemAliases) { delete oLiveSiteData.systemAliases; }
                    oPersonalizationProcessor.mixinPersonalization(oOriginalSiteData, oPersonalizationDeltaData)
                        .done(function (oLiveSiteResult) {
                            if (
                                (oFixture.testDescription === "addGroup" || oFixture.testDescription === "addGroupAndaddTileToNewGroup" || oFixture.testDescription === "addGroupAndaddLinkToNewGroup")
                                && oPersonalizationDeltaData
                                && oPersonalizationDeltaData.addedGroups
                            ) {
                                // TODO: add this flag to mixin or extract
                                // Hack data from "CDMLiveSiteTileAdded.json" to make test successfully:
                                Object.keys(oPersonalizationDeltaData.addedGroups).forEach(function (sGroupId) {
                                    oLiveSiteData.groups[sGroupId].payload.isPreset = false;
                                });
                            }
                            start();
                            // check for correct personalization delta
                            deepEqual(oLiveSiteResult, oLiveSiteData,
                                "correct live site created");

                            // check that all apply methods are called for its respective use case
                            if (oFixture.testDescription === "renameGroup") {
                                ok(oPersonalizationProcessor._applyRenameGroup.called,
                                    "_applyRenameGroup called");
                            } else if (oFixture.testDescription === "changeGroupVisibilityChanged") {
                                ok(oPersonalizationProcessor._applyGroupVisibility.called,
                                    "_applyGroupVisibility called");
                            } else if (oFixture.testDescription === "removeGroup") {
                                ok(oPersonalizationProcessor._applyRemoveGroup.called,
                                    "_applyRemoveGroup called");
                            } else if (oFixture.testDescription === "changeTileSettings" || oFixture.testDescription === "changeLinkSettings") {
                                ok(oPersonalizationProcessor._applyTileSettings.called,
                                    "_applyTileSettings called");
                            }

                            ok(oPersonalizationProcessor._applyAddGroups.called, "_applyAddedGroups called");
                            ok(oPersonalizationProcessor._applyMoveGroup.called, "_applyMoveGroup called");

                            oPersonalizationProcessor._applyRenameGroup.restore();
                            oPersonalizationProcessor._applyGroupVisibility.restore();
                            oPersonalizationProcessor._applyRemoveGroup.restore();
                            oPersonalizationProcessor._applyAddGroups.restore();
                            oPersonalizationProcessor._applyMoveGroup.restore();
                            oPersonalizationProcessor._applyTileSettings.restore();
                        })
                        .fail(function () {
                            start();
                            ok(false);
                        });
                })
                .fail(startBy1);
        });
    });

    // TODO: method "_checkRemoveGroup" was rewritten and needs completely new tests

    // Begin of test for method "_addGroupToPersonalizationDelta":
    // testDescription: completes sentence like "Does something WHEN ...":
    [{
        "testDescription": "new group was added to an empty personalizationDelta.",
        "oPersonalizedSite": {
            "site": {
                "payload": {
                    "groupsOrder": [
                        "group1",
                        "groupAdded"
                    ]
                }
            },
            "groups": {
                "group1": { "payload": { "tiles": [{ "id": "#tile1" }] } },
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": {
                        "links": [],
                        "tiles": []
                    }
                }
            }
        },
        "oInitialPersonalizationDelta": {},
        "sGroupId": "groupAdded",
        "expectedPersonalizationDelta": {
            "groupOrder": [
                "group1",
                "groupAdded"
            ],
            "addedGroups": {
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": {
                        "links": [],
                        "tiles": []
                    }
                }
            }
        }
    }, {
        "testDescription": "new group with one tile child was added to an empty personalizationDelta.",
        "oPersonalizedSite": {
            "site": {
                "payload": {
                    "groupsOrder": [
                        "group1",
                        "groupAdded"
                    ]
                }
            },
            "groups": {
                "group1": { "payload": { "tiles": [{ "id": "#tile1" }] } },
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": {
                        "tiles": [{
                            "id": "#My-tileAdded",
                            "target": {
                                "semanticObject": "Tile-Child",
                                "action": "tileAdded"
                            }
                        }]
                    }
                }
            }
        },
        "oInitialPersonalizationDelta": {},
        "sGroupId": "groupAdded",
        "expectedPersonalizationDelta": {
            "groupOrder": [
                "group1",
                "groupAdded"
            ],
            "addedGroups": {
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": {
                        "links": [],
                        "tiles": []
                    }
                }
            }
        }
    }, {
        "testDescription": "new group was added to a personalizationDelta with prefilled groupOrder array.",
        "oPersonalizedSite": {
            "site": {
                "payload": {
                    "groupsOrder": [
                        "group1",
                        "groupAdded"
                    ]
                }
            },
            "groups": {
                "group1": { "payload": { "tiles": [{ "id": "#tile1" }] } },
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": {
                        "links": [],
                        "tiles": []
                    }
                }
            }
        },
        "oInitialPersonalizationDelta": { "groupOrder": ["group1"] },
        "sGroupId": "groupAdded",
        "expectedPersonalizationDelta": {
            "groupOrder": [
                "group1",
                "groupAdded"
            ],
            "addedGroups": {
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": {
                        "links": [],
                        "tiles": []
                    }
                }
            }
        }
    }, {
        "testDescription": "nothing was added done to undefined personal site object.",
        "oPersonalizedSite": undefined,
        "oInitialPersonalizationDelta": {},
        "sGroupId": "groupAdded",
        "expectedPersonalizationDelta": {}
    }].forEach(function (oFixture) {
        test("_addGroupToPersonalizationDelta: Creates correct personalization delta when " + oFixture.testDescription, function () {
            var oPersonalizationProcessor = new PersonalizationProcessor(),
                bSuccess;

            sinon.spy(oPersonalizationProcessor, "_addGroupToPersonalizationDelta");
            bSuccess = oPersonalizationProcessor._addGroupToPersonalizationDelta(
                oFixture.oPersonalizedSite,
                oFixture.oInitialPersonalizationDelta,
                oFixture.sGroupId
            );
            if (bSuccess) {
                ok(bSuccess, "Building delta should be successfully.");
            } else {
                ok(!bSuccess, "Failed intentionally.");
            }
            deepEqual(
                oFixture.oInitialPersonalizationDelta,
                oFixture.expectedPersonalizationDelta,
                "correct personalization delta"
            );
            oPersonalizationProcessor._addGroupToPersonalizationDelta.restore();
        });
    });

    // Begin of test for method "_applyAddGroups":
    // testDescription: completes sentence like "Does something WHEN ...":
    [{
        "testDescription": "site object to personalize has NO group yet.",
        "oOriginalSite": {
            "site": { "payload": { "groupsOrder": [] } },
            "groups": {}
        },
        "oPersonalizationDelta": {
            "groupOrder": ["groupAdded"],
            "addedGroups": {
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": { "tiles": [] }
                }
            }
        },
        "expectedChangedOriginalSite": {
            "site": { "payload": { "groupsOrder": ["groupAdded"] } },
            "groups": {
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": {
                        "isPreset": false,
                        "tiles": []
                    }
                }
            }
        }
    }, {
        "testDescription": "Group got newly assigned to end user via role",
        "oOriginalSite": {
            "site": { "payload": { "groupsOrder": ["A", "B", "C", "D"] } },
            "groups": {
                "A": {
                    "identification": {
                        "id": "A",
                        "title": "I am group A"
                    },
                    "payload": { "tiles": [] }
                },
                "B": {
                    "identification": {
                        "id": "B",
                        "title": "I am group B"
                    },
                    "payload": { "tiles": [] }
                },
                "C": {
                    "identification": {
                        "id": "C",
                        "title": "I am group C"
                    },
                    "payload": { "tiles": [] }
                },
                "D": {
                    "identification": {
                        "id": "D",
                        "title": "I am group D and I got newly assigned to the end user via role assignment"
                    },
                    "payload": { "tiles": [] }
                }
            }
        },
        "oPersonalizationDelta": {
            "groupOrder": ["A", "C", "B"],
            "addedGroups": {
                "EndUserGroupId": {
                    "identification": {
                        "id": "EndUserGroupId",
                        "title": "I was added by the end user itself"
                    },
                    "payload": { "tiles": [] }
                }
            }
        },
        "expectedChangedOriginalSite": {
            "site": { "payload": { "groupsOrder": ["A", "C", "B", "D"] } },
            "groups": {
                "EndUserGroupId": {
                    "identification": {
                        "id": "EndUserGroupId",
                        "title": "I was added by the end user itself"
                    },
                    "payload": {
                        "isPreset": false,
                        "tiles": []
                    }
                },
                "A": {
                    "identification": {
                        "id": "A",
                        "title": "I am group A"
                    },
                    "payload": { "tiles": [] }
                },
                "B": {
                    "identification": {
                        "id": "B",
                        "title": "I am group B"
                    },
                    "payload": { "tiles": [] }
                },
                "C": {
                    "identification": {
                        "id": "C",
                        "title": "I am group C"
                    },
                    "payload": { "tiles": [] }
                },
                "D": {
                    "identification": {
                        "id": "D",
                        "title": "I am group D and I got newly assigned to the end user via role assignment"
                    },
                    "payload": { "tiles": [] }
                }
            }
        }
    }, {
        "testDescription": "site object to personalize has one group already.",
        "oOriginalSite": {
            "site": { "payload": { "groupsOrder": ["group1"] } },
            "groups": { "group1": { "payload": { "tiles": [{ "id": "#tile1" }] } } }
        },
        "oPersonalizationDelta": {
            "groupOrder": ["group1", "groupAdded"],
            "addedGroups": {
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": { "tiles": [] }
                }
            }
        },
        "expectedChangedOriginalSite": {
            "site": { "payload": { "groupsOrder": ["group1", "groupAdded"] } },
            "groups": {
                "group1": { "payload": { "tiles": [{ "id": "#tile1" }] } },
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": {
                        "isPreset": false,
                        "tiles": []
                    }
                }
            }
        }
    }, {
        "testDescription": "site object is empty.",
        "oOriginalSite": {},
        "oPersonalizationDelta": {
            "groupOrder": ["groupAdded"],
            "addedGroups": {
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": { "tiles": [] }
                }
            }
        },
        "expectedChangedOriginalSite": {
            "site": { "payload": { "groupsOrder": ["groupAdded"] } },
            "groups": {
                "groupAdded": {
                    "identification": {
                        "id": "groupAdded",
                        "title": "New added group"
                    },
                    "payload": {
                        "isPreset": false,
                        "tiles": []
                    }
                }
            }
        }
    }, {
        "testDescription": "personalization delta is empty.",
        "oOriginalSite": {
            "site": { "payload": { "groupsOrder": [] } },
            "groups": {}
        },
        "oPersonalizationDelta": {},
        "expectedChangedOriginalSite": {
            "site": { "payload": { "groupsOrder": [] } },
            "groups": {}
        }
    }].forEach(function (oFixture) {
        test("_applyAddGroups: Correctly mixin added groups from personalization delta when " + oFixture.testDescription, function () {
            var oPersonalizationProcessor = new PersonalizationProcessor();

            // Arrange
            sinon.spy(oPersonalizationProcessor, "_applyAddGroups");

            // Act
            oPersonalizationProcessor._applyAddGroups(
                oFixture.oOriginalSite,
                oFixture.oPersonalizationDelta
            );

            // Assert
            deepEqual(
                oFixture.oOriginalSite,
                oFixture.expectedChangedOriginalSite,
                "correct personalized Original site"
            );
            oPersonalizationProcessor._applyAddGroups.restore();
        });
    });

    // Begin of test for method "_checkMoveGroup":
    // testDescription: completes sentence like "Does something WHEN ...":
    [{
        "testDescription": "a group was moved in order, normal input data.",
        "oOriginalSite": { "site": { "payload": { "groupsOrder": ["group1", "group2"] } } },
        "oPersonalizedSite": { "site": { "payload": { "groupsOrder": ["group2", "group1"] } } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": { "groupOrder": ["group2", "group1"] },
        "bComment_DeltaChanged": true
    }, {
        "testDescription": "input data are invalid: Empty original site object.",
        "oOriginalSite": {},
        "oPersonalizedSite": { "site": { "payload": { "groupsOrder": ["group2", "group1"] } } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {},
        "bComment_DeltaChanged": false
    }, {
        "testDescription": "input data are invalid: Empty personalized site object, but full original site object..",
        "oOriginalSite": { "site": { "payload": { "groupsOrder": ["group1", "group2"] } } },
        "oPersonalizedSite": {},
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {},
        "bComment_DeltaChanged": false
    }, {
        "testDescription": "input data are invalid: Both -original and personalized- site objects have empty 'groupsOrder' array.",
        "oOriginalSite": { "site": { "payload": { "groupsOrder": [] } } },
        "oPersonalizedSite": { "site": { "payload": { "groupsOrder": [] } } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {},
        "bComment_DeltaChanged": false
    }, {
        "testDescription": "both -original and personalized- site objects have equal 'groupsOrder' arrays.",
        "oOriginalSite": { "site": { "payload": { "groupsOrder": ["group1", "group2"] } } },
        "oPersonalizedSite": { "site": { "payload": { "groupsOrder": ["group1", "group2"] } } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {},
        "bComment_DeltaChanged": false
    }, {
        "testDescription": "original and personalized site objects have 'groupsOrder' arrays of different length (e.g. 'add group' or 'remove group' does apply).",
        "oOriginalSite": { "site": { "payload": { "groupsOrder": ["group1"] } } },
        "oPersonalizedSite": { "site": { "payload": { "groupsOrder": ["group1", "group2"] } } },
        "oInitialPersonalizationDelta": {},
        "expectedPersonalizationDelta": {},
        "bComment_DeltaChanged": false // Not changed by "_checkMoveGroup" but handled by "_addGroupToPersonalizationDelta".
    }].forEach(function (oFixture) {
        test("_checkMoveGroup: Creates correct personalization delta when " + oFixture.testDescription, function () {
            var oPersonalizationProcessor = new PersonalizationProcessor(),
                bSuccess;

            sinon.spy(oPersonalizationProcessor, "_checkMoveGroup");
            bSuccess = oPersonalizationProcessor._checkMoveGroup(
                oFixture.oPersonalizedSite,
                oFixture.oOriginalSite,
                oFixture.oInitialPersonalizationDelta
            );
            ok(oFixture.bComment_DeltaChanged === bSuccess, "Delta change status is as expected. For value see next test.");
            if (bSuccess) {
                ok(bSuccess, "Building delta should be successfully.");
            } else {
                ok(!bSuccess, "Failed intentionally / personalized delta not changed.");
            }
            deepEqual(
                oFixture.oInitialPersonalizationDelta,
                oFixture.expectedPersonalizationDelta,
                "correct personalization delta"
            );
            oPersonalizationProcessor._checkMoveGroup.restore();
        });
    });

    // Begin of test for method "_applyMoveGroup":
    // testDescription: completes sentence like "Does something WHEN ...":
    [{
        "testDescription": "a group was moved in order, normal input data.",
        "oOriginalSite": { "site": { "payload": { "groupsOrder": ["group1", "group2"] } } },
        "oPersonalizationDelta": { "groupOrder": ["group2", "group1"] },
        "expectedChangedOriginalSite": { "site": { "payload": { "groupsOrder": ["group2", "group1"] } } },
        "bComment_SiteChanged": true
    }, {
        "testDescription": "input data are invalid: Empty personalization delta.",
        "oOriginalSite": { "site": { "payload": { "groupsOrder": ["group1", "group2"] } } },
        "oPersonalizationDelta": {},
        "expectedChangedOriginalSite": { "site": { "payload": { "groupsOrder": ["group1", "group2"] } } },
        "bComment_SiteChanged": false
    }, {
        "testDescription": "input data are invalid: Empty original site. Note: Original site will be changed, but gets group order NOT applied - so expectation for return is false.",
        "oOriginalSite": {},
        "oPersonalizationDelta": { "groupOrder": ["group2", "group1"] },
        "expectedChangedOriginalSite": { "site": { "payload": { "groupsOrder": [] } } },
        "bComment_SiteChanged": false // changed yes (empty groupsOrder only) - but content of groupsOrder will be set by "_applyAddGroups" some time.
    }].forEach(function (oFixture) {
        test("_applyMoveGroup: Correctly mixin a changed group order when  " + oFixture.testDescription, function () {
            var oPersonalizationProcessor = new PersonalizationProcessor(),
                bSuccess;

            sinon.spy(oPersonalizationProcessor, "_applyMoveGroup");
            bSuccess = oPersonalizationProcessor._applyMoveGroup(
                oFixture.oOriginalSite,
                oFixture.oPersonalizationDelta
            );
            ok(oFixture.bComment_SiteChanged === bSuccess, "Site change status is as expected. For value see next test.");
            if (bSuccess) {
                ok(bSuccess, "Mixin new group order successfully.");
            } else {
                ok(!bSuccess, "Failed intentionally / Group order not changed.");
            }
            deepEqual(
                oFixture.oOriginalSite,
                oFixture.expectedChangedOriginalSite,
                "correct personalized Original site"
            );
            oPersonalizationProcessor._applyMoveGroup.restore();
        });
    });
});

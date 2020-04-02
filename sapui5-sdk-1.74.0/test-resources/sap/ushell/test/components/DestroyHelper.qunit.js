// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.DestroyHelper.
 */

sap.ui.require([
    "sap/ushell/components/DestroyHelper"
],function (oDestroyHelper) {
    "use strict";

    /*global module test jQuery sap */

    module("sap.ushell.components.oDestroyHelper", {
        setup: function () {
        },

        teardown: function () {
        }
    });

    test("destroy Tile content", function (assert) {
        var bDestroyContentCalled = false,
            oTile = {
                id: "tile_00",
                uuid: "tile_00",
                isTileIntentSupported: true,
                content: [{
                    destroy: function () {
                        bDestroyContentCalled = true;
                    }
                }]
            };
            oDestroyHelper.destroyTileModel(oTile);
            assert.ok(bDestroyContentCalled, "Content of tile should be destroy");
    });

    test("destroy all tiles", function (assert) {
        var iDestroyTileCalls = 0,
            fnContentDestroy = function () {
                iDestroyTileCalls++;
            },
            aGroups = [
            {
                id: "group_0",
                groupId: "group 0",
                tiles: [
                    {
                        id: "tile_00",
                        uuid: "tile_00",
                        content: [
                            {
                                destroy: fnContentDestroy
                            }
                        ]
                    },
                    {
                        id: "tile_01",
                        uuid: "tile_01",
                        content: [
                            {
                                destroy: fnContentDestroy
                            }
                        ]
                    }
                ]
            },
            {
                id: "group_1",
                groupId: "group 1",
                tiles: [
                    {
                        id: "tile_10",
                        uuid: "tile_10",
                        content: [
                            {
                                destroy: fnContentDestroy
                            }
                        ]
                    }
                ]
            }
        ];

        oDestroyHelper.destroyFLPAggregationModels(aGroups);
        assert.equal(iDestroyTileCalls, 3, "All tiles should be destroyed");
    });

});
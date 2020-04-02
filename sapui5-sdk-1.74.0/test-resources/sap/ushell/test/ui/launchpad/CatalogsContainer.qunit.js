// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainerUtils");
    jQuery.sap.require("sap.ushell.ui.launchpad.CatalogsContainer");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.m.Button");

    var stub,
        bIsPhone = sap.ui.Device.system.phone,
        oCatalogsContainer,
        oGroupHeaderActionPanel,
        iContVisibleElements = 0,
        groupHeaderActionData = {
    			content : [],
    			tileActionModeActive : true,
    			isOverflow : false
            },
        testContainer,
        demiItemData = {
            catalogs: [{
                setVisible: function (bIsVisible) {
                    if (bIsVisible) {
                        iContVisibleElements++;
                    };
                },
                getVisible: function () {
                  return false;
                },
                getBindingContext: function () {
                    return {
                        getPath: function () {
                            return "catalogs/0";
                        }
                    }
                },
                appBoxes: [
                    {
                        associatedGroups: [],
                        icon: "sap-icon://create-leave-request",
                        id: "catalogTile_30",
                        src: {},
                        title: "test 1",
                        url: "#so-act1"
                    }
                ],
                customTiles: [
                    {
                        associatedGroups: [],
                        icon: "sap-icon://create-leave-request",
                        id: "catalogTile_30",
                        src: {},
                        title: "test 1",
                        url: "#so-act1"
                    }
                ],
                id: "catalog_1",
                numberTilesSupportedOnCurrectDevice: 0,
                static: false,
                title: "Employee Self Service"
            }]
        };


    module("sap.ushell.ui.launchpad.CatalogsContainer", {
        setup: function () {
            sap.ushell.bootstrap("local");
            oCatalogsContainer = new sap.ushell.ui.launchpad.CatalogsContainer();
            //This renderes the catalogs.

            sap.ushell.ui.launchpad.TileContainerUtils.addNewItem = function () {
                demiItemData.catalogs.push({
                    setVisible: function (bIsVisible) {
                        if (bIsVisible) {
                            iContVisibleElements++;
                        };
                    },
                    getVisible: function () {
                        return false;
                    },
                    getBindingContext: function () {
                        return {
                            getPath: function () {
                                return "catalogs/0";
                            }
                        }
                    },
                    appBoxes: [
                        {
                            associatedGroups: [],
                            icon: "sap-icon://create-leave-request",
                            id: "catalogTile_30",
                            src: {},
                            title: "test 1",
                            url: "#so-act1"
                        }
                    ],
                    customTiles: [
                        {
                            associatedGroups: [],
                            icon: "sap-icon://create-leave-request",
                            id: "catalogTile_30",
                            src: {},
                            title: "test 1",
                            url: "#so-act1"
                        }
                    ],
                    id: "catalog_1",
                    numberTilesSupportedOnCurrectDevice: 0,
                    static: false,
                    title: "Employee Self Service"
                });
            }
            oCatalogsContainer.getCatalogs = function () {
                return demiItemData.catalogs;
            };
            oCatalogsContainer.mBindingInfos["catalogs"] = {
                factory: function(sId, oContext) {
                  return {
                      setBindingContext: function () {
                          return {
                              this: "bala"
                          }
                      }
                  }
                },
                binding: {
                    destroy: function () {
                    },
                    detachEvents: function () {
                    },
                    detachRefresh: function () {
                    },
                    detachChange: function () {
                    },
                    getContexts: function() {
                        return [
                            {
                                getPath: function () {
                                    return "catalogs/0";
                                }
                            },
                            {
                                getPath: function () {
                                    return "catalogs/1";
                                },
                                getProperty: function () {
                                  return "catalog1";
                                }

                            }
                        ];
                    }
                }
            }
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oCatalogsContainer.destroy();
            delete sap.ushell.Container;
        }
    });


    test("CatalogsContainer filterElements", function () {
      oCatalogsContainer.nAllocatedUnits = 30;
        var indexingMaps = oCatalogsContainer.filterElements();
        ok(iContVisibleElements === 2, "Check that now we have 2 visible groups");
    });

    test("CatalogsContainer setCategoryFilter", function () {
        oCatalogsContainer.indexingMaps = {
            "onScreenPathIndexMap": {

            }
        };

        oCatalogsContainer.catalogPagination = {

        };

        var indexingMaps = oCatalogsContainer.addNewItem(oCatalogsContainer.mBindingInfos["catalogs"].binding.getContexts()[0], "catalogs");
        ok(iContVisibleElements === 2, "Check that now we have 2 visible groups");
        ok(oCatalogsContainer.indexingMaps.onScreenPathIndexMap["catalogs/0"].aItemsRefrenceIndex == 2, "validate the the newly added group index refrence is 2");
        ok(oCatalogsContainer.indexingMaps.onScreenPathIndexMap["catalogs/0"].isVisible== true, "validate the the newly added group is visible");
    });

}());

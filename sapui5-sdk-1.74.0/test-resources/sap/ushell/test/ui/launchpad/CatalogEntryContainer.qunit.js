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
    jQuery.sap.require("sap.ushell.ui.launchpad.CatalogEntryContainer");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.m.Button");

    var stub,
        bIsPhone = sap.ui.Device.system.phone,
        oCatalogEntryContainer,
        oGroupHeaderActionPanel,
        iContVisibleAppBoxesElements = 0,
        iContVisibleCustomTilesElements = 0,
        groupHeaderActionData = {
    			content : [],
    			tileActionModeActive : true,
    			isOverflow : false
            },
        testContainer,
        demiItemData = {
                appBoxesContainer: [
                    {
                        getVisible: function () {
                          return false;
                        },
                        setVisible: function () {
                            iContVisibleAppBoxesElements++;
                        },
                        getBindingContext: function (){
                            return {
                                getPath: function () {
                                    return "catalogs/0/appBoxes/0";
                                }
                            }
                        },
                        associatedGroups: [],
                        icon: "sap-icon://create-leave-request",
                        id: "catalogTile_30",
                        src: {},
                        title: "test 1",
                        url: "#so-act1"
                    }
                ],
            customTilesContainer: [
                    {
                        getVisible: function () {
                            return false;
                        },
                        setVisible: function () {
                            iContVisibleCustomTilesElements++;
                        },
                        getBindingContext: function (){
                            return {
                                getProperty: function (){
                                  return "some context";
                                },
                                getPath: function () {
                                    return "catalogs/0/customTiles/0";
                                }
                            }
                        },
                        associatedGroups: [],
                        icon: "sap-icon://create-leave-request",
                        id: "catalogTile_30",
                        src: {},
                        title: "test 1",
                        url: "#so-act1"
                    }
                ]
        };


    module("sap.ushell.ui.launchpad.CatalogEntryContainer", {
        setup: function () {
            iContVisibleAppBoxesElements = 0;
            iContVisibleCustomTilesElements = 0;

            stop(); // wait until the bootstrap finishes loading

            sap.ushell.bootstrap("local").then(function () {
                oCatalogEntryContainer = new sap.ushell.ui.launchpad.CatalogEntryContainer();
                //This renderes the catalogs.

                sap.ushell.ui.launchpad.TileContainerUtils.addNewItem = function (oNewCatalog, sName) {
                    demiItemData[sName].push({
                        getVisible: function () {
                            return false;
                        },
                        setVisible: function () {
                            if (sName === "appBoxesContainer") {
                                iContVisibleAppBoxesElements++;
                            } else {
                                iContVisibleCustomTilesElements++
                            }
                        },
                        getBindingContext: function () {
                            return {
                                getPath: function () {
                                    return "catalogs/0/appBoxes/1";
                                }
                            }
                        },
                        associatedGroups: [],
                        icon: "sap-icon://create-leave-request",
                        id: "catalogTile_31",
                        src: {},
                        title: "test 2",
                        url: "#so-act2"
                    });
                }

                oCatalogEntryContainer.getAppBoxesContainer = function () {
                    return demiItemData.appBoxesContainer;
                };
                oCatalogEntryContainer.getCustomTilesContainer = function () {
                    return demiItemData.customTilesContainer;
                };
                oCatalogEntryContainer.mBindingInfos = {
                    "appBoxesContainer": {
                        factory: function (sId, oContext) {
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
                            getContexts: function () {
                                return [
                                    {
                                        getPath: function () {
                                            return "catalogs/0/appBoxes/0";
                                        }
                                    }
                                ];
                            }
                        }
                    },
                    "customTilesContainer": {
                        unbindProperty: function () {

                        },
                        unbindAggregation: function () {

                        },
                        factory: function (sId, oContext) {
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
                            getContexts: function () {
                                return [
                                    {
                                        getProperty: function () {
                                            return ["some context"];
                                        },
                                        getPath: function () {
                                            return "catalogs/0/customTiles/0";
                                        }
                                    },
                                    {
                                        getProperty: function () {
                                            return ["some context"];
                                        },
                                        getPath: function () {
                                            return "catalogs/0/customTiles/1";
                                        }
                                    }
                                ];
                            }
                        }
                    }

                }

                sap.ushell.Container.getService = function () {
                    return {
                        getCatalogTileView: function () {
                            return "new view";
                        }
                    }
                };

                start();
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oCatalogEntryContainer.destroy(false);
            delete sap.ushell.Container;

        }
    });


    test("CatalogEntryContainer handleElements appBoxesContainer", function () {
        oCatalogEntryContainer.handleElements("appBoxesContainer");
        ok(iContVisibleAppBoxesElements === 1, "Check that now we have 1 visible app boex");
    });

    test("CatalogEntryContainer handleElements customTilesContainer", function () {
        oCatalogEntryContainer.handleElements("customTilesContainer");
        ok(iContVisibleCustomTilesElements === 2, "Check that now we have 2 visible custom tiles");
    });

    test("CatalogEntryContainer handleElements appBoxesContainer with no allocated units left", function () {
        oCatalogEntryContainer.getAllocatedUnits = function () {
          return 0;
        };
        oCatalogEntryContainer.catalogState = {
            "appBoxesContainer": "init"
        };
        var bIsAdded = oCatalogEntryContainer.addNewItem(oCatalogEntryContainer.mBindingInfos["appBoxesContainer"].binding.getContexts()[0], "appBoxesContainer");
        ok(bIsAdded === false, "Check That it did not create the AppBox");
    });

    test("CatalogEntryContainer handleElements appBoxesContainer with allocated units", function () {
        oCatalogEntryContainer.getAllocatedUnits = function () {
            return 5;
        };
        oCatalogEntryContainer.indexingMaps = {
            "appBoxesContainer" : {
                "onScreenPathIndexMap": {

                }
            }
        };
        oCatalogEntryContainer.catalogState = {
            "appBoxesContainer": "init"
        };
        var bIsAdded = oCatalogEntryContainer.addNewItem(oCatalogEntryContainer.mBindingInfos["appBoxesContainer"].binding.getContexts()[0], "appBoxesContainer");
        ok(bIsAdded === true, "Check That it did create the AppBox");
        ok(oCatalogEntryContainer.indexingMaps["appBoxesContainer"]["onScreenPathIndexMap"]["catalogs/0/appBoxes/0"].aItemsRefrenceIndex === 1, "Validate that new app box path is added correctly to the index mapping");

        ok(oCatalogEntryContainer.indexingMaps["appBoxesContainer"]["onScreenPathIndexMap"]["catalogs/0/appBoxes/0"].isVisible, "Validate that new app box visibility is added correctly to the index mapping");
    });

    test("CatalogEntryContainer handleElements customTilesContainer with no allocated units left", function () {
        oCatalogEntryContainer.getAllocatedUnits = function () {
            return 0;
        };
        oCatalogEntryContainer.catalogState = {
            "customTilesContainer": "init"
        };
        var bIsAdded = oCatalogEntryContainer.addNewItem(oCatalogEntryContainer.mBindingInfos["customTilesContainer"].binding.getContexts()[0], "customTilesContainer");
        ok(bIsAdded === false, "Check That it did not create the customTilesContainer");
    });

    test("CatalogEntryContainer handleElements customTilesContainer with allocated units", function () {
        oCatalogEntryContainer.getAllocatedUnits = function () {
            return 5;
        };
        oCatalogEntryContainer.indexingMaps = {
            "customTilesContainer" : {
                "onScreenPathIndexMap": {

                }
            }
        };
        oCatalogEntryContainer.catalogState = {
            "customTilesContainer": "init"
        };
        var bIsAdded = oCatalogEntryContainer.addNewItem(oCatalogEntryContainer.mBindingInfos["customTilesContainer"].binding.getContexts()[0], "customTilesContainer");
        ok(bIsAdded === true, "Check That it did create the AppBox");
    });

}());

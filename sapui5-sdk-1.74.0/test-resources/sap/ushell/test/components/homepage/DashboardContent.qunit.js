// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.homepage.DashboardContent
 */
sap.ui.require([
    "sap/ushell/components/HomepageManager",
    "sap/ushell/components/ComponentKeysHandler",
    "sap/ushell/services/Container",
    "sap/ushell/test/utils"
], function () {
    "use strict";

    /* global asyncTest, deepEqual, module, ok, start, stop, test, jQuery, sap, sinon */

    var aGroups = [
        {
            "isGroupVisible": true,
            "visibilityModes": [false]
        }, {
            "isGroupVisible": true,
            "visibilityModes": [true]
        }, {
            "isGroupVisible": true,
            "visibilityModes": [true]
        }, {
            "isGroupVisible": true,
            "visibilityModes": [true]
        }, {
            "isGroupVisible": true,
            "visibilityModes": [true]
        }, {
            "isGroupVisible": true,
            "visibilityModes": [true]
        }, {
            "isGroupVisible": true,
            "visibilityModes": [true]
        }, {
            "isGroupVisible": true,
            "visibilityModes": [true]
        }, {
            "isGroupVisible": true,
            "visibilityModes": [true]
        }, {
            "isGroupVisible": true,
            "visibilityModes": [true]
        }, {
            "isGroupVisible": false,
            "visibilityModes": [true]
        }
    ];

    // BCP 1780224822 - DashboardContent QUnit fails only in IE.
    // IE throws error in sap.ui.core.FocusHandler.prototype.getCurrentFocusedControlId function when stubbing sap.ui.core().byId function,
    // that is why we have overriden this function.
    sap.ui.core.FocusHandler.prototype.getCurrentFocusedControlId = function () { };

    var oController;
    var oEventHub = sap.ui.require("sap/ushell/EventHub");
    var oTestUtils = sap.ui.require("sap/ushell/test/utils");

    module("sap.ushell.components.flp.Component", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                oController = new sap.ui.controller("sap.ushell.components.homepage.DashboardContent");
                start();
            });
        },
        teardown: function () {
            delete sap.ushell.Container;
            oController.destroy();

            // Reset the EventHub to avoid multiple subscriptions
            oEventHub._reset();

            oTestUtils.restoreSpies(
                sap.ui.core.Component.getOwnerComponentFor,
                sap.ui.getCore().byId,
                sap.ui.getCore().getEventBus
            );
        }
    });

    [
        {
            testDescription: "short drop to a locked groups",
            oMockData: {
                dstArea: undefined,
                dstGroup: {
                    getBindingContext: function () {
                        return {
                            getProperty: function () {
                                return {
                                    isGroupLocked: true
                                };
                            }
                        };
                    }
                },
                dstGroupData: {},
                dstTileIndex: 3,
                srcArea: "links",
                srcGroup: {},
                tile: {
                    getBindingContext: function () {
                        return {
                            getObject: function () {
                                return {
                                    object: ""
                                };
                            }
                        };
                    }
                },
                tileMovedFlag: true
            },
            oExpected: {
                sPubType: "sortableStop",
                obj: { "sortableStop": undefined }
            }
        }, {
            testDescription: "convert tile to link in the group",
            oMockData: {
                dstArea: "links",
                dstGroup: {
                    getHeaderText: function () {
                        return "group4";
                    },
                    getBindingContext: function () {
                        return {
                            getProperty: function () {
                                return {
                                    isGroupLocked: false
                                };
                            }
                        };
                    }
                },
                dstGroupData: {
                    getGroupId: function () {
                        return "group4";
                    }
                },
                dstTileIndex: 5,
                srcArea: "tiles",
                srcGroup: {
                    getGroupId: function () {
                        return "group4";
                    }
                },
                tile: {
                    getMode: function () {
                        return "ContentMode";
                    },
                    getUuid: function () {
                        return "uuid1";
                    },
                    getBindingContext: function () {
                        return {
                            getPath: function () {
                                return "/groups/4/tiles/5";
                            },
                            getObject: function () {
                                return {
                                    object: ""
                                };
                            }
                        };
                    }

                },
                tileMovedFlag: true
            },
            oExpected: {
                sPubType: "convertTile",
                obj: {
                    "convertTile": {
                        callBack: undefined,
                        longDrop: undefined,
                        srcGroupId: "group4",
                        tile: undefined,
                        toGroupId: "group4",
                        toIndex: 5
                    }
                }
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("Test - _handleDrop" + oFixture.testDescription, function () {
            var oModel = new sap.ui.model.json.JSONModel({
                currentViewName: "home",
                tileActionModeActive: true,
                getProperty: function () {
                },
                groups: [
                    {}, {}, {}, {},
                    {
                        tiles: [
                            {}, {}, {}, {}, {},
                            { object: { title: "grp4 tile5" } }
                        ],
                        links: []
                    }

                ]
            }),
                oData = {
                    additionalInformation: {
                        indexOf: function (/*data*/) {
                            return -1;
                        }
                    }
                };
            oController.getOwnerComponent = function () {
                return {
                    getMetadata: function () {
                        return {
                            getComponentName: function () {
                                return 1;
                            }
                        };
                    }
                };
            };
            oController.getView = sinon.stub().returns({
                getModel: function () {
                    return oModel;
                }
            });
            jQuery.sap.require("sap.ushell.components.homepage.ActionMode");
            sap.ushell.components.homepage.ActionMode.init(oModel);

            sap.ushell.Layout.getLayoutEngine = function () {
                return {
                    layoutEndCallback: function () {
                        return oFixture.oMockData;
                    },
                    _toggleAnchorItemHighlighting: function () {
                        return;
                    }
                };
            };

            sap.m.MessageToast.show = function () {
            };

            var getEventBusStub = sinon.stub(sap.ui.getCore(), "getEventBus").returns({
                publish: function (sTopic, sMsg, oEventBusData) {
                    var oExpected = oFixture.oExpected.obj[sMsg];
                    if (oEventBusData) {
                        oEventBusData.callBack = undefined;
                    }
                    deepEqual(oEventBusData, oExpected, "Deep compare for: " + sMsg);
                }
            });
            setTimeout(function () {
                start();
                oController._handleDrop("", "", oData);
                getEventBusStub.restore();
            }, 0);
        });
    });

    test("Test - _appOpenedHandler", function () {
        var oModel = new sap.ui.model.json.JSONModel({
            currentViewName: "home",
            tileActionModeActive: true,
            getProperty: function () {
            }
        }),
            oData = {
                additionalInformation: {
                    indexOf: function (/*data*/) {
                        return -1;
                    }
                }
            };
        oController.getOwnerComponent = function () {
            return {
                getMetadata: function () {
                    return {
                        getComponentName: function () {
                            return 1;
                        }
                    };
                }
            };
        };
        oController.getView = sinon.stub().returns({
            getModel: function () {
                return oModel;
            }
        });

        oController.oDashboardUIActionsModule = {};
        oController.oDashboardUIActionsModule.disableAllDashboardUiAction = sinon.stub();

        jQuery.sap.require("sap.ushell.components.homepage.ActionMode");
        sap.ushell.components.homepage.ActionMode.init(oModel);

        ok(sap.ushell.components.homepage.ActionMode.oModel.getProperty("/tileActionModeActive") === true,
            "Action mode is true at start test");
        oController._appOpenedHandler("", "", oData);
        ok(sap.ushell.components.homepage.ActionMode.oModel.getProperty("/tileActionModeActive") === false,
            "Action mode is false after _appOpenedHandler ");
        ok(oController.oDashboardUIActionsModule.disableAllDashboardUiAction.calledOnce, "disableAllDashboardUiAction was called");
    });

    test("Test modelLoaded", function () {
        jQuery.sap.require("sap.ushell.components.homepage.DashboardUIActions");
        var fOriginalModelInitialized = oController.bModelInitialized,
            oLayoutStab = sap.ushell.Layout,
            uiActionsInitStub,
            oTempViewData = {
                bModelInitialized: false,
                getModel: function () {
                    return {};
                },
                getController: function () {
                    return oController;
                }
            };

        oController.bModelInitialized = false;
        uiActionsInitStub = sinon.stub(oController, "_initializeUIActions").returns();
        sap.ushell.Layout = {
            getInitPromise: function () {
                return jQuery.Deferred().resolve();
            }
        };
        oController.getView = function () {
            return oTempViewData;
        };

        oController._modelLoaded.apply(oController);

        ok(oController.bModelInitialized === true, "bModelInitialized is set to true");
        ok(uiActionsInitStub.calledOnce, "_handleUIActions is called once");

        uiActionsInitStub.restore();
        oController.bModelInitialized = fOriginalModelInitialized;
        sap.ushell.Layout = oLayoutStab;
    });

    test("Test scrollToGroup: no groups", function () {
        var oData = {};

        oController.oView = {
            oDashboardGroupsBox: {
                getGroups: function () {
                    return null;
                }
            }
        };
        oController.getView = function () {
            return {
                getModel: function () {
                    return {
                        getProperty: function () {
                            return null;
                        }
                    };
                }
            };
        };
        try {
            oController._scrollToGroup(null, null, oData);
        } catch (e) {
            ok(false, "scrollToGroup breaks on no-groups");
        }
        ok(true, "scrollToGroup works with no groups");
    });

    asyncTest("Test _onDashboardShown with home state", function () {
        var oModel = new sap.ui.model.json.JSONModel({
            currentViewName: "home",
            tileActionModeActive: false,
            getProperty: function () {
            }
        }),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                getCurrentViewportState: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                applyExtendedShellState: sinon.spy(),
                getRouter: sinon.stub().returns({
                    getRoute: sinon.stub().returns({
                        attachMatched: sinon.stub()
                    })
                }),
                showRightFloatingContainer: sinon.stub(),
                getCurrentCoreView: sinon.stub().returns("home")
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, "byId").returns({
                shiftCenterTransitionEnabled: function () { },
                shiftCenterTransition: function () { },
                attachAfterNavigate: function () { },
                enlargeCenterTransition: function (/*bFlag*/) { }
            }),
            oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });

        oView.setModel(oModel);

        oView.loaded().then(function () {
            var fnHandleTilesVisibilityStub = sinon.stub(sap.ushell.utils, "handleTilesVisibility"),
                fnRefreshTilesStub = sinon.stub(sap.ushell.utils, "refreshTiles"),
                fnGoToTileContainerStub = sinon.stub(sap.ushell.components.ComponentKeysHandler, "goToTileContainer");

            sap.ui.getCore().getEventBus().publish("launchpad", "contentRefresh");
            window.setTimeout(function () {
                ok(fnHandleTilesVisibilityStub.called, "handleTilesVisibility was called");
                ok(fnRefreshTilesStub.called, "refreshTiles was called");
                ok(fnGoToTileContainerStub.called, "goToTileContainer was called");

                oGetCoreByIdStub.restore();
                fnHandleTilesVisibilityStub.restore();
                fnRefreshTilesStub.restore();
                fnGoToTileContainerStub.restore();
                getRendererStub.restore();
                oView.destroy();
                start();
            }, 0);
        });
    });

    asyncTest("Test handleDashboardScroll", function () {
        var updateTopGroupInModelStub = sinon.stub(oController, "_updateTopGroupInModel"),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                addActionButton: sinon.spy(),
                getCurrentViewportState: function () {
                    return "Center";
                },
                showRightFloatingContainer: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                applyExtendedShellState: sinon.spy()
            }),
            handleTilesVisibilitySpy = sinon.spy(sap.ushell.utils, "handleTilesVisibility"),
            originView = oController.getView,
            reArrangeNavigationBarElementsSpy,
            closeOverflowPopupSpy,
            oModel = new sap.ui.model.json.JSONModel({
                scrollingToGroup: false
            }),
            oView = {
                oAnchorNavigationBar: {
                    reArrangeNavigationBarElements: function () { },
                    closeOverflowPopup: function () { }
                },
                getModel: function () {
                    return oModel;
                },
                _handleHeadsupNotificationsPresentation: sinon.spy()
            };

        oController.getView = function () {
            return oView;
        };

        reArrangeNavigationBarElementsSpy = sinon.spy(oController.getView().oAnchorNavigationBar, "reArrangeNavigationBarElements");
        closeOverflowPopupSpy = sinon.spy(oController.getView().oAnchorNavigationBar, "closeOverflowPopup");

        oController._handleDashboardScroll();

        setTimeout(function () {
            ok(updateTopGroupInModelStub.calledOnce, "updateTopGroupInModel is called once");
            ok(handleTilesVisibilitySpy.calledOnce, "handleTilesVisibility is called once");
            ok(reArrangeNavigationBarElementsSpy.calledOnce, "reArrangeNavigationBarElementsSpy is called once");
            ok(closeOverflowPopupSpy.calledOnce, "closeOverflowPopupSpy is called once");
            updateTopGroupInModelStub.restore();

            handleTilesVisibilitySpy.restore();
            getRendererStub.restore();
            oController.getView = originView;
            start();
        }, 1001);
    });

    test("Test - updateTopGroupInModel", function () {
        var oModel = new sap.ui.model.json.JSONModel({
            groups: aGroups
        }),
            originView = oController.getView;

        var oGetIndexOfTopGroupInViewPort = sinon.stub(oController, "_getIndexOfTopGroupInViewPort").returns(5);

        oController.getView = sinon.stub().returns({
            getModel: function () {
                return oModel;
            }
        });

        oController._updateTopGroupInModel();

        ok(oGetIndexOfTopGroupInViewPort.calledOnce, "getIndexOfTopGroupInViewPort is called once");

        ok(oModel.getProperty("/iSelectedGroup") === 6, "selected group in model is 6");
        ok(oModel.getProperty("/topGroupInViewPortIndex") === 5, "anchore bar tab number 5 is selected");

        oGetIndexOfTopGroupInViewPort.restore();
        oController.getView = originView;
    });

    test("Test - handleDrag update model", function () {
        var oModel = new sap.ui.model.json.JSONModel({
            draggedTileLinkPersonalizationSupported: false
        });

        oController.getView = sinon.stub().returns({
            getModel: function () {
                return oModel;
            }
        });

        var bIsLinkPersonalizationSupported = true;
        var oTestTile = {
            tile: {
                getBindingContext: function () {
                    return {
                        getObject: function () {
                            return {
                                isLinkPersonalizationSupported: bIsLinkPersonalizationSupported
                            };
                        }
                    };
                }
            }
        };

        sap.ushell.Layout.getLayoutEngine = function () {
            return {
                layoutEndCallback: function () {
                    return oTestTile;
                },
                _toggleAnchorItemHighlighting: function () {
                    return;
                }
            };
        };

        oController._handleDrag();
        ok(oModel.getProperty("/draggedTileLinkPersonalizationSupported"), "draggedTileLinkPersonalizationSupported has changed");

        bIsLinkPersonalizationSupported = false;
        oController._handleDrag();
        ok(!oModel.getProperty("/draggedTileLinkPersonalizationSupported"), "draggedTileLinkPersonalizationSupported has changed");
    });

    test("Test - Groups Layout is re-arranged only when the dashboard is visible", function () {
        var recalculateBottomSpaceStub = sinon.stub(sap.ushell.utils, "recalculateBottomSpace"),
            handleTilesVisibilitySpy = sinon.stub(sap.ushell.utils, "handleTilesVisibility"),
            jQueryStub = sinon.stub(jQuery, "filter").returns(["found"]),
            reRenderGroupsLayoutSpy = sinon.spy(sap.ushell.Layout, "reRenderGroupsLayout"),
            initializeUIActionsStub = sinon.stub(oController, "_initializeUIActions");

        oController.resizeHandler();
        ok(reRenderGroupsLayoutSpy.calledOnce, "Groups Layout should be re-arranged if dashBoardGroupsContainer is visible");
        jQueryStub.restore();

        jQueryStub = sinon.stub(jQuery, "filter").returns([]);
        oController.resizeHandler();
        ok(reRenderGroupsLayoutSpy.calledOnce, "Groups Layout should not be re-arranged if dashBoardGroupsContainer is invisible");

        jQueryStub.restore();
        recalculateBottomSpaceStub.restore();
        handleTilesVisibilitySpy.restore();
        initializeUIActionsStub.restore();
    });

    asyncTest("show hide groups invoked upon 'actionModeInactive' event", function () {
        var oModel = new sap.ui.model.json.JSONModel({}),
            oOwnerComponentStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor").returns({
                getModel: function () {
                    return oModel;
                }
            }),
            oEventBus = sap.ui.getCore().getEventBus(),
            oHomepageManager = new sap.ushell.components.HomepageManager("dashboardMgr", { "model": oModel }),
            getCurrentHiddenGroupIdsStub = sinon.stub(oHomepageManager, "getCurrentHiddenGroupIds").returns([]);

        oEventBus.publish("launchpad", "actionModeInactive", []);
        setTimeout(function () {
            ok(getCurrentHiddenGroupIdsStub.called, "getCurrentHiddenGroups is called");
            oOwnerComponentStub.restore();

            getCurrentHiddenGroupIdsStub.restore();
            start();
        }, 350);
    });

    var fnHandleGroupVisibilityChangesTestHelper = function (sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, bExpectedHideGroupsCalled) {
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
            addActionButton: sinon.spy(),
            getCurrentViewportState: function () {
                return "Center";
            },
            showRightFloatingContainer: sinon.spy(),
            createExtendedShellState: sinon.spy(),
            applyExtendedShellState: sinon.spy(),
            getRightFloatingContainerVisibility: sinon.spy(),
            getRouter: sinon.stub().returns({
                getRoute: sinon.stub().returns({
                    attachMatched: sinon.stub()
                })
            })
        }),
            oModel = new sap.ui.model.json.JSONModel({
                currentViewName: undefined
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, "byId").returns({
                shiftCenterTransitionEnabled: function () { },
                shiftCenterTransition: function () { },
                attachAfterNavigate: function () { },
                setEnableBounceAnimations: function (/*bFlag*/) {
                    return;
                },
                getCenterViewPort: function () {
                    return [{
                        getComponent: function () {
                            return "__renderer0---Shell-home-component";
                        }
                    }];
                },
                setRight: function () { }
            }),
            getEventBusStub = sinon.stub(oOrigCore, "getEventBus").returns({
                subscribe: sinon.spy()
            }),
            oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });

        oView.setModel(oModel);
        oView.loaded().then(function () {
            var getServiceStub = sinon.stub(sap.ushell.Container, "getService").returns({
                hideGroups: sinon.stub().returns(jQuery.Deferred().resolve())
            }),
                oTestController = oView.getController(),
                oHomepageManager = new sap.ushell.components.HomepageManager("dashboardMgr", { "model": oModel }),
                oGetCurrentHiddenGroupIdsStub = sinon.stub(oHomepageManager, "getCurrentHiddenGroupIds")
                    .returns(sCurrentHiddenGroupIds);

            oTestController._handleGroupVisibilityChanges("test", "test", aOrigHiddenGroupsIds);

            ok(getServiceStub().hideGroups.called === bExpectedHideGroupsCalled, "hideGroups is called");

            //Clean after tests.
            getRendererStub.restore();

            oGetCoreByIdStub.restore();
            getEventBusStub.restore();
            getServiceStub.restore();
            oGetCurrentHiddenGroupIdsStub.restore();
            oView.destroy();
            start();
        });
    };

    asyncTest("test show hide groups when user hides a group", function () {
        var sCurrentHiddenGroupIds = ["testGroupId1", "testGroupId2", "testGroupId3"],
            aOrigHiddenGroupsIds = ["testGroupId1", "testGroupId2"];

        fnHandleGroupVisibilityChangesTestHelper(sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, true);
    });

    asyncTest("test show hide groups when user un-hides a group", function () {
        var sCurrentHiddenGroupIds = ["testGroupId1"],
            aOrigHiddenGroupsIds = ["testGroupId1", "testGroupId2"];

        fnHandleGroupVisibilityChangesTestHelper(sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, true);
    });

    asyncTest("test show hide groups when originally hidden groups and the currentlly hidden groups are the same ", function () {
        var sCurrentHiddenGroupIds = ["testGroupId1", "testGroupId2"],
            aOrigHiddenGroupsIds = ["testGroupId1", "testGroupId2"];

        fnHandleGroupVisibilityChangesTestHelper(sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, false);
    });

    asyncTest("test show/hide groups when number of hidden groups does not change but the groups are different", function () {
        var sCurrentHiddenGroupIds = ["testGroupId1", "testGroupId2", "testGroupId3", "testGroupId4"],
            aOrigHiddenGroupsIds = ["testGroupId1", "testGroupId2", "testGroupId5", "testGroupId6"];

        fnHandleGroupVisibilityChangesTestHelper(sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, true);
    });

    asyncTest("Test deactivation of action/edit mode after click on 'Done' button of the footer", function () {
        jQuery.sap.require("sap.ushell.components.homepage.ActionMode");
        var oModel = new sap.ui.model.json.JSONModel({
            currentViewName: "home",
            tileActionModeActive: true,
            getProperty: function () { }
        }),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                getCurrentViewportState: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                applyExtendedShellState: sinon.spy(),
                getRouter: sinon.stub().returns({
                    getRoute: sinon.stub().returns({
                        attachMatched: sinon.stub()
                    })
                })
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, "byId").returns({
                shiftCenterTransitionEnabled: function () { },
                shiftCenterTransition: function () { },
                attachAfterNavigate: function () { },
                getCenterViewPort: function () {
                    return [{
                        getComponent: function () {
                            return "__renderer0---Shell-home-component";
                        }
                    }];
                },
                enlargeCenterTransition: function (/*bFlag*/) { }
            }),
            oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });

        oView.setModel(oModel);
        oView.loaded().then(function () {
            var oActionModeDeactivationStub = sinon.stub(sap.ushell.components.homepage.ActionMode, "_deactivate");

            oView._createFooter();
            window.setTimeout(function () {
                var oDoneBtn = oView.oPage.getFooter().getContentRight()[1];
                oDoneBtn.firePress();
                ok(oActionModeDeactivationStub.called, "Deactivate called after pressing on 'Done'");

                oActionModeDeactivationStub.restore();

                oGetCoreByIdStub.restore();
                getRendererStub.restore();
                oView.destroy();
                start();
            }, 0);
        });
    });

    asyncTest("Test exit method", function () {
        var oModel = new sap.ui.model.json.JSONModel({
            currentViewName: "home",
            tileActionModeActive: false,
            getProperty: function () { }
        }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, "byId").returns({
                shiftCenterTransitionEnabled: function () { },
                shiftCenterTransition: function () { },
                attachAfterNavigate: function () { },
                getCenterViewPort: function () {
                    return [{
                        getComponent: function () {
                            return "__renderer0---Shell-home-component";
                        }
                    }];
                },
                enlargeCenterTransition: function (/*bFlag*/) { }
            }),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                getCurrentViewportState: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                applyExtendedShellState: sinon.spy(),
                getRouter: sinon.stub().returns({
                    getRoute: sinon.stub().returns({
                        attachMatched: sinon.stub()
                    })
                })
            }),
            oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });

        oView.setModel(oModel);

        oView.loaded().then(function () {
            var handleExitSpy = sinon.spy(oView.oAnchorNavigationBar, "handleExit");
            oView.destroy();
            ok(handleExitSpy.called === true);
            oGetCoreByIdStub.restore();
            getRendererStub.restore();
            start();
        });
    });
});

// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.AppFinder
 */
sap.ui.require([
    "sap/ushell/resources",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/services/Container",
    "sap/ushell/components/CatalogsManager",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/EventHub"
], function () {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global asyncTest, equal, strictEqual, module,
     ok, start, stop, test,
     jQuery, sap, sinon */



    var oController,
        oEventHub,
        oHomepageManager;
    function createView () {
        var oView = sap.ui.view("appfinder", {
            viewName: "sap.ushell.components.appfinder.AppFinder",
            type: 'JS',
            viewData: {}
        });

        oController = oView.getController();
        oController.getView = function () {
            return oView;
        };

        return oView;
    }

    var fnRouterMock = function () {
        return {
            getRoute: function () {
                return {
                    attachMatched: function () {
                        return {};
                    },
                    attachPatternMatched: function () {
                        return {};
                    }
                };
            },
            navTo: function () {
                return;
            },
            attachRouteMatched: function () {
                return {};
            },
            initialize: function () {

            }
        };
    };

    module("sap.ushell.components.appfinder.AppFinder", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                sinon.stub(sap.ushell.Container.getService("Personalization"), "getPersonalizer").returns({getPersData : function () {return jQuery.Deferred().resolve("full");}});
                oEventHub = sap.ui.require("sap/ushell/EventHub");
                oController = new sap.ui.controller("sap.ushell.components.appfinder.AppFinder");
                oController.oSubHeaderModel = new sap.ui.model.json.JSONModel({search:{searchMode:true, searchTerm: 'for_testing'}}, "subHeaderModel");
                oHomepageManager = new sap.ushell.components.HomepageManager("homepageMsg", {model: new sap.ui.model.json.JSONModel()});
                start();
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            oController.destroy();
            oEventHub._reset();
            oHomepageManager.destroy();
        }
    });

    test("showOpenCloseSplitAppButton", function () {
        var bResult = !sap.ui.Device.orientation.landscape;
        ok(oController._showOpenCloseSplitAppButton() === bResult);
    });

    test("toggleView with classes tests", function () {
        jQuery.sap.require("sap.m.Page");
        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve([]);
                return oDeferred.promise();
            }
        );
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );

        var oAppFinderView = createView();
        oAppFinderView._showSearch = function () {
            return true;
        };
        oAppFinderView._showSearchTag = function () {
            return false;
        };

        //(1)
        oController._toggleViewWithSearchAndTagsClasses();
        ok(oAppFinderView.oPage.hasStyleClass('sapUshellAppFinderSearch'));
        ok(!oAppFinderView.oPage.hasStyleClass('sapUshellAppFinderTags'));

        //(2)
        oController._toggleViewWithToggleButtonClass(false);
        ok(!oAppFinderView.oPage.hasStyleClass('sapUshellAppFinderToggleButton'));

        //(3)
        oController._toggleViewWithToggleButtonClass(true);
        ok(oAppFinderView.oPage.hasStyleClass('sapUshellAppFinderToggleButton'));

        oAppFinderView._showSearch = function () {
            return false;
        };
        oAppFinderView._showSearchTag = function () {
            return true;
        };

        //(4)
        oController._toggleViewWithSearchAndTagsClasses();
        ok(!oAppFinderView.oPage.hasStyleClass('sapUshellAppFinderSearch'));
        ok(oAppFinderView.oPage.hasStyleClass('sapUshellAppFinderTags'));

        oAppFinderView.destroy();
        getEasyAccessSystemsStub.restore();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
    });

    test("updateSearchWithPlaceHolder String - according to menues", function () {
        jQuery.sap.require("sap.m.Page");
        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve([]);
                return oDeferred.promise();
            }
        );
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );

        var oAppFinderView = createView();
        oAppFinderView._showSearch = function () {
            return true;
        };

        oAppFinderView.updateSubHeader('catalog');
        oAppFinderView._updateSearchWithPlaceHolder('catalog');
        ok(oAppFinderView.oAppFinderSearchControl.getPlaceholder().indexOf('Search in catalog') === 0);

        oAppFinderView.updateSubHeader('userMenu');
        oAppFinderView._updateSearchWithPlaceHolder('userMenu');
        ok(oAppFinderView.oAppFinderSearchControl.getPlaceholder().indexOf('Search in user menu') === 0);

        oAppFinderView.updateSubHeader('sapMenu');
        oAppFinderView._updateSearchWithPlaceHolder('sapMenu');
        ok(oAppFinderView.oAppFinderSearchControl.getPlaceholder().indexOf('Search in SAP menu') === 0);

        oAppFinderView.destroy();
        getEasyAccessSystemsStub.restore();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
    });

    asyncTest("onShow WITHOUT systems and WITHOUT Search-Filtering, should show subHeader", function (assert) {
        jQuery.sap.require("sap.m.Page");
        var onShowEvent = {
            getParameter: function (){
                return {menu: "catalog"};
            }
        };
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        var oAppFinderView = createView();

        oController.onShow(onShowEvent);

        var oGetSystemsModelPromise = oController.getSystemsModels();
        oGetSystemsModelPromise.done(function (userMenuSystemsModel, sapMenuSystemsModel) {
            start();

            [userMenuSystemsModel, sapMenuSystemsModel].forEach(function (easyAccessMenuModel) {
                var aSapMenuSystemsList = easyAccessMenuModel.getProperty("/systemsList");
                ok(aSapMenuSystemsList, "property 'systemsList' exist");
                assert.equal(aSapMenuSystemsList.length, 0, "validate no systems are configured");
                ok(oAppFinderView.oPage.getShowSubHeader(), "showSubHeader property is set to true");
            });

            oAppFinderView.destroy();
            getOwnerComponentForStub.restore();
            getRendererStub.restore();
        });

    });

    test("onShow WITHOUT systems and with Search-Filtering should show subHeader", function () {
        jQuery.sap.require("sap.m.Page");
        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve([]);
                return oDeferred.promise();
            }
        );
        var onShowEvent = {
            getParameter: function (){
                return {menu: "catalog"};
            }
        };
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );

        var oAppFinderView = createView();
        oAppFinderView.showSearch = true;

        var getViewStub = sinon.stub(oController, "getView", function (assert) {
            return oAppFinderView;
        });

        oController.onShow(onShowEvent);

        var oGetSystemsModelPromise = oController.getSystemsModels();
        oGetSystemsModelPromise.done(function (userMenuModel, sapMenuModel){
            [userMenuModel, sapMenuModel].forEach(function (easyAccessSystemsModel) {
                var aSystemsList = easyAccessSystemsModel.getProperty("/systemsList");
                ok(aSystemsList, "property 'systemsList' exist");
                assert.equal(aSystemsList.length, 0, "validate no systems are configured");
                ok(oAppFinderView.oPage.getShowSubHeader(), "showSubHeader property is set to true");
            });
            oAppFinderView.destroy();
            getEasyAccessSystemsStub.restore();
            getOwnerComponentForStub.restore();
            getRendererStub.restore();
            getViewStub.restore();
        });
    });

    test("onShow with systems and WITHOUT Search-Filtering, should show subHeader", function (assert) {
        jQuery.sap.require("sap.m.Page");
        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var data = {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            TR: true,
                            WDA: true
                        }
                    },
                    XY1CLNT100: {
                        text: "HR Central",
                        appType: {
                            WDA: true
                        }
                    }
                };
                var oDeferred = new jQuery.Deferred();
                if (data) {
                    oDeferred.resolve(data);
                } else {
                    oDeferred.reject("some error");
                }


                return oDeferred.promise();
            }
        );
        var onShowEvent = {
            getParameter: function (){
                return {menu: "catalog"};
            }
        };
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        var oAppFinderView = createView();

        oController.onShow(onShowEvent);

        var oGetSystemsModelPromise = oController.getSystemsModels();
        oGetSystemsModelPromise.done(function (userMenuModel, sapMenuModel){
            [userMenuModel, sapMenuModel].forEach(function (easyAccessSystemsModel) {
                var aSystemsList = easyAccessSystemsModel.getProperty("/systemsList");
                ok(aSystemsList, "property 'systemsList' exist");
                assert.equal(aSystemsList.length, 2, "validate 3 systems are configured");
                ok(oAppFinderView.oPage.getShowSubHeader(), "showSubHeader property is set to true");
            });
            oAppFinderView.destroy();
            getEasyAccessSystemsStub.restore();
            getOwnerComponentForStub.restore();
            getRendererStub.restore();
        });

    });

    test("AppFinder Controller - get/set/reset Search Model & Search Handler", function () {
        var oCatalogsManager = new sap.ushell.components.CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel()});
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        var oAppFinderView = createView();
        var oModel = oController._getSubHeaderModel();
        ok(oController.oSubHeaderModel, "search model created on controller as a member");
        ok(oModel, "search model created");
        ok(!oModel.getProperty('/search/searchMode'), "search mode is false");
        ok(!oModel.getProperty('/search/searchTerm'), "search term is empty");
        ok(!oModel.getProperty('/activeMenu'), "active menu is not yet set");

        var oEvent = {
            getSource : function () {
                var fnGetValue = function () {
                        return "newTermForSearch";
                };
                return {
                    getValue : fnGetValue
                };
            },
            getParameter : function () {
            }
        };

        // simulate search event
        oController.searchHandler(oEvent);
        // check the search model again
        oModel = oController._getSubHeaderModel();
        ok(oModel.getProperty('/search/searchMode'), "search mode is true");
        ok(oModel.getProperty('/search/searchTerm') === "newTermForSearch", "search term is upadted");

        oAppFinderView.oPage.destroy();
        oAppFinderView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
        oCatalogsManager.destroy();
    });

    test("getSystems positive scenario(with systems), should resolve with a list of systems", function (assert) {

        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var data = {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            TR: true,
                            WDA: true
                        }
                    },
                    XY1CLNT100: {
                        text: "HR Central",
                        appType: {
                            WDA: true
                        }
                    }
                };
                var oDeferred = new jQuery.Deferred();
                if (data) {
                    oDeferred.resolve(data);
                } else {
                    oDeferred.reject("some error");
                }


                return oDeferred.promise();
            }
        );

        var oGetSystemsPromise = oController.getSystems();
        oGetSystemsPromise.done(function (aReturnSystems){
            assert.deepEqual(aReturnSystems,[{"systemName": "CRM Europe", "systemId": "AB1CLNT000"},{"systemName": "HR Central", "systemId":"XY1CLNT100"}]);
            getEasyAccessSystemsStub.restore();
        });
    });

    test("getSystems without system(empty object), should resolve with an empty list of systems", function (assert) {

        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var data = {};
                var oDeferred = new jQuery.Deferred();
                if (data) {
                    oDeferred.resolve(data);
                } else {
                    oDeferred.reject("some error");
                }

                return oDeferred.promise();
            }
        );


        var oGetSystemsPromise = oController.getSystems();
        oGetSystemsPromise.done(function (aReturnSystems){
            assert.deepEqual(aReturnSystems,[]);
            getEasyAccessSystemsStub.restore();
        });
    });

    test("getSystems with an error, should fail", function (assert) {

        var sExpectedError = "An error occurred while retrieving the systems:";

        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function () {
                var data = undefined;
                var oDeferred = new jQuery.Deferred();
                if (data) {
                    oDeferred.resolve(data);
                } else {
                    oDeferred.reject("some error");
                }
                return oDeferred.promise();
            }
        );

        var oGetSystemsPromise = oController.getSystems();
        oGetSystemsPromise.fail(function (error) {
            assert.equal(error.substring(0,sExpectedError.length), sExpectedError);
            getEasyAccessSystemsStub.restore();
        });
    });

    test("getSystems without clientService should reject", function (assert) {

        var sExpectedError = "cannot get ClientSideTargetResolution service";

        var getServiceStub = sinon.stub(sap.ushell.Container, "getService", function () {
            return undefined;
        });

        var oGetSystemsPromise = oController.getSystems();
        oGetSystemsPromise.fail(function (error) {
            assert.equal(error, sExpectedError);
        });
        getServiceStub.restore();
    });

    test("enableEasyAccess: false - oView.oPage.getContent() contains catalogView", function () {
        var oCatalogsManager = new sap.ushell.components.CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel()});
        var fGetRendereStub = sinon.stub(sap.ushell.Container, "getRenderer", function (name) {
            return {createExtendedShellState : function () {}};
        });
        jQuery.sap.require("sap.m.Page");
        var oModel = new sap.ui.model.json.JSONModel({});

        var oView = {
            getModel: function () {
                return oModel;
            },
            createSubHeader: function () {},
            setModel: function (oModel, sName) {},
            oPage: new sap.m.Page("appFinderPage", {}),
            showEasyAccessMenu: false,
            parentComponent: {
                getRouter: fnRouterMock,
                getModel: function () { return new sap.ui.model.json.JSONModel(); },
                getComponentData: function () {
                    return {config: {}};
                }
            },
            _showOpenCloseSplitAppButton: function () {return false;}
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });

        oController.onInit();

        ok(oView.oPage.getContent());

        fGetRendereStub.restore();
        oView.oPage.destroy();
        oCatalogsManager.destroy();
    });

    test("enableEasyAccess: true - oView.oPage.getContent() is empty", function () {
        var oCatalogsManager = new sap.ushell.components.CatalogsManager("catalogsMgr", {model: new sap.ui.model.json.JSONModel()});
        var fLoadPersonalizedGroupsSpy = sinon.spy(oHomepageManager, "loadPersonalizedGroups");
        jQuery.sap.require("sap.m.Page");
        var fGetRendereStub = sinon.stub(sap.ushell.Container, "getRenderer", function (name) {
            return {createExtendedShellState : function () {}};
        });

        var oModel = new sap.ui.model.json.JSONModel({groups: [{id: "dummygroup"}]});
        var oView = {
            getModel: function () {
                return oModel;
            },
            createSubHeader: function () {},
            setModel: function (oModel, sName) {},
            oPage: new sap.m.Page("appFinderPage", {
                showHeader: true,
                showSubHeader: true,
                showFooter: false,
                showNavButton: false,
                enableScrolling: false,
                title: "appFinderTitle"
            }),
            showEasyAccessMenu: true,
            parentComponent: {
                getRouter: fnRouterMock,
                getModel: function () { return new sap.ui.model.json.JSONModel(); },
                getComponentData: function () {
                    return {config: {}};
                }
            },
            _showOpenCloseSplitAppButton: function () {return false;}
        };

        var getViewStub = sinon.stub(oController, "getView", function () {
            return oView;
        });

        oController.onInit();

        ok(oView.oPage.getContent().length == 0);
        equal(fLoadPersonalizedGroupsSpy.callCount, 0, "Validate loadgroups are not called in case they are already loaded");

        fLoadPersonalizedGroupsSpy.restore();
        getViewStub.restore();
        fGetRendereStub.restore();
        oView.oPage.destroy();
        oController.catalogView.destroy();
        oCatalogsManager.destroy();
    });

    test("enableEasyAccess, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: all true - number of buttons in subHeader should be 3", function () {
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel({
                            enableEasyAccess: true,
                            enableEasyAccessSAPMenu: true,
                            enableEasyAccessUserMenu:true,
                            groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
            };
        }
        );

        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
        };
            }
        );

        var oAppFinderView = createView();
        oAppFinderView.updateSubHeader("",true);
        ok(oAppFinderView.oPage.getSubHeader().getContent()[1].getButtons().length === 3);

        oAppFinderView.destroy();
        oController.catalogView.destroy();
        getRendererStub.restore();
        getOwnerComponentForStub.restore();

    });

    test("enableEasyAccess, enableEasyAccessSAPMenu: true, enableEasyAccessUserMenu: false - number of buttons in subHeader should be 2", function () {
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel({
                            enableEasyAccess:true,
                            enableEasyAccessSAPMenu:true,
                            enableEasyAccessUserMenu:false,
                            groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );

        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );

        var oAppFinderView = createView();
        oAppFinderView.updateSubHeader("",true);
        ok(oAppFinderView.oPage.getSubHeader().getContent()[1].getButtons().length === 2);

        oAppFinderView.destroy();
        oController.catalogView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();

    });

    test("enableEasyAccess, enableEasyAccessUserMenu: true, enableEasyAccessSAPMenu: false - number of buttons in subHeader should be 2", function () {
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel({
                            enableEasyAccess:true,
                            enableEasyAccessSAPMenu:false,
                            enableEasyAccessUserMenu:true,
                            groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );

        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );

        var oAppFinderView = createView();

        oAppFinderView.updateSubHeader("",true);
        ok(oAppFinderView.oPage.getSubHeader().getContent()[1].getButtons().length === 2);


        oAppFinderView.destroy();
        oController.catalogView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();

    });

    test("enableEasyAccess: true, enableEasyAccessUserMenu, enableEasyAccessSAPMenu: false - no subHeader", function () {
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                enableEasyAccessSAPMenu:false,
                                enableEasyAccessUserMenu:false,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        var oAppFinderView = createView();

        ok(!oAppFinderView.showEasyAccessMenu, "showEasyAccessMenu property is set to false - no subHeader");
        ok(oAppFinderView.oPage.getContent());

        oAppFinderView.destroy();
        oController.catalogView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
    });

    test("enableEasyAccess, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: all true, on mobile system - no subHeader ", function () {
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                enableEasyAccessSAPMenu:true,
                                enableEasyAccessUserMenu:true,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        sap.ui.Device.system.phone = true;
        var oAppFinderView = createView();
        ok(!oAppFinderView.showEasyAccessMenu, "showEasyAccessMenu property is set to false");
        ok(oAppFinderView.oPage.getContent());

        oAppFinderView.destroy();
        oController.catalogView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
    });

    test("enableEasyAccess, enableEasyAccessSAPMenu: true, enableEasyAccessUserMenu: false, on mobile system - no subHeader ", function () {
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                enableEasyAccessSAPMenu:true,
                                enableEasyAccessUserMenu:false,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        sap.ui.Device.system.phone = true;
        var oAppFinderView = createView();
        ok(!oAppFinderView.showEasyAccessMenu, "showEasyAccessMenu property is set to false");
        ok(oAppFinderView.oPage.getContent());

        oAppFinderView.destroy();
        oController.catalogView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
    });

    test("enableEasyAccess: undefined, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: true - number of buttons in subHeader should be 3", function () {
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel({
                            enableEasyAccessSAPMenu:true,
                            enableEasyAccessUserMenu:true,
                            groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );

        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );

        var oAppFinderView = createView();
        oAppFinderView.updateSubHeader("",true);
        ok(oAppFinderView.oPage.getSubHeader().getContent()[1].getButtons().length === 3);


        oAppFinderView.destroy();
        oController.catalogView.destroy();
        getRendererStub.restore();
        getOwnerComponentForStub.restore();

    });

    test("enableEasyAccess: false, enableEasyAccessUserMenu, enableEasyAccessSAPMenu: true - no subHeader", function () {
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:false,
                                enableEasyAccessSAPMenu:true,
                                enableEasyAccessUserMenu:true,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        var oAppFinderView = createView();

        ok(!oAppFinderView.enableEasyAccess, "enableEasyAccess property is set to false - no subHeader");
        ok(oAppFinderView.oPage.getContent());

        oAppFinderView.destroy();
        oController.catalogView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
    });

    test("getSystemsModels with systems, should return a model with 'systemsList' property that contains array of systems", function (assert) {

        var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var getEasyAccessSystemsStub = sinon.stub(clientService, "getEasyAccessSystems",
            function (sMenuType) {
                var data = {
                    userMenu: {
                        AB1CLNT000: {
                            text: "CRM Europe",
                            appType: {
                                TR: true,
                                WDA: true,
                                URL: true
                            }
                        },
                        XY1CLNT100: {
                            text: "HR Central",
                            appType: {
                                WDA: true,
                                URL: true
                            }
                        },
                        U1YCLNT000: {
                            text: "Business Objects",
                            appType: {
                                URL: true
                            }
                        }
                    },
                    sapMenu: {
                        AB1CLNT000: {
                            text: "CRM Europe",
                            appType: {
                                TR: true,
                                WDA: true
                            }
                        },
                        XY1CLNT100: {
                            text: "HR Central",
                            appType: {
                                WDA: true
                            }
                        }
                    }
                };
                var oDeferred = new jQuery.Deferred();
                if (data[sMenuType]) {
                    oDeferred.resolve(data[sMenuType]);
                } else {
                    oDeferred.reject("some error");
                }
                return oDeferred.promise();
            }
        );

        var oGetSystemsModelPromise = oController.getSystemsModels();
        oGetSystemsModelPromise.done(function (userMenuModel, sapMenuModel) {

            strictEqual(getEasyAccessSystemsStub.callCount, 2, "getEasyAccessSystems was called once");
            ok(getEasyAccessSystemsStub.calledWith('userMenu'), "getEasyAccessSystemsStub was called with the 'userMenu' argument");
            ok(getEasyAccessSystemsStub.calledWith('sapMenu'), "getEasyAccessSystemsStub was called with the 'sapMenu' argument");

            var userMenuSystemList = userMenuModel.getProperty("/systemsList");
            ok(userMenuSystemList, "property 'systemsList' exists in user menu model");
            assert.deepEqual(userMenuSystemList, [{
                "systemName": "CRM Europe",
                "systemId": "AB1CLNT000"
            }, {
                "systemName": "HR Central",
                "systemId": "XY1CLNT100"
            }, {
                "systemName": "Business Objects",
                "systemId": "U1YCLNT000"
            }], "user menu system list is as expected");

            var sapMenuSystemList = sapMenuModel.getProperty("/systemsList");
            ok(sapMenuSystemList, "property 'systemsList' exist in sap menu model");
            assert.deepEqual(sapMenuSystemList, [{
                "systemName": "CRM Europe",
                "systemId": "AB1CLNT000"
            }, {
                "systemName": "HR Central",
                "systemId": "XY1CLNT100"
            }], "sap menu system list is as expected");

            getEasyAccessSystemsStub.restore();
        });

    });

    test("_navigateTo with group context should call navTo with filters", function (assert) {
        jQuery.sap.require("sap.ui.core.routing.Router");
        var oView = {
            getModel: function () {
                return new sap.ui.model.json.JSONModel({
                    groupContext: {path:"/somePath"}
                });
            }
        };

        var oRouter = new sap.ui.core.routing.Router;

        var navToSpy = sinon.stub(oRouter, "navTo", function (arg1, arg2, arg3) {
           return;
        });

        oController._navigateTo.apply({oView: oView, oRouter: oRouter},["catalog"]);
        assert.ok(navToSpy.calledWith("catalog", {filters: "{\"targetGroup\":\"%2FsomePath\"}"}, true));

        oRouter.navTo.restore();
    });

    test("_navigateTo without group context should call navTo without filters", function (assert) {
        jQuery.sap.require("sap.ui.core.routing.Router");
        var oView = {
            getModel: function () {
                return new sap.ui.model.json.JSONModel({});
            }
        };

        var oRouter = new sap.ui.core.routing.Router;

        var navToSpy = sinon.stub(oRouter, "navTo", function (arg1, arg2, arg3) {
            return;
        });

        oController._navigateTo.apply({oView: oView, oRouter: oRouter},["catalog"]);
        assert.ok(navToSpy.calledWith("catalog", {}, true));

        oRouter.navTo.restore();
    });

    test("onSegmentButtonClick with catalog should call _navigateTo with catalog", function (assert) {
        var oEvent = {
            getParameters: function (sValue) {
                return {id: "catalog"};
            }
        };

        var navigateToStub = sinon.stub(oController,"_navigateTo",function (arg1,arg2) {
            return;
        });
        oController.onSegmentButtonClick(oEvent);
        assert.ok(navigateToStub.calledWith("catalog"));
        oController._navigateTo.restore();
    });

    test("onSegmentButtonClick with userMenu should call _navigateTo with userMenu", function (assert) {
        var oEvent = {
            getParameters: function (sValue) {
                return {id: "userMenu"};
            }
        };

        var navigateToStub = sinon.stub(oController,"_navigateTo",function (arg1,arg2) {
            return;
        });
        oController.onSegmentButtonClick(oEvent);
        assert.ok(navigateToStub.calledWith("userMenu"));
        oController._navigateTo.restore();
    });

    test("onSegmentButtonClick with sapMenu should call _navigateTo with sapMenu", function (assert) {
        var oEvent = {
            getParameters: function (sValue) {
                return {id: "sapMenu"};
            }
        };

        var navigateToStub = sinon.stub(oController,"_navigateTo",function (arg1,arg2) {
            return;
        });
        oController.onSegmentButtonClick(oEvent);
        assert.ok(navigateToStub.calledWith("sapMenu"));
        oController._navigateTo.restore();
    });

    test("_updateModelWithGroupContext", function () {
        var oModel = new sap.ui.model.json.JSONModel({
            groups: [{title: "group1 title"}],
            groupContext: {}
        });

        var oView = {
            getModel: function () {
                return oModel;
            }
        };


        var getServiceStub = sinon.stub(sap.ushell.Container,"getService",function () {
            return {
                getGroupId : function () {
                    return "group1";
                }
            };
        });

        oController._updateModelWithGroupContext.apply({oView: oView},["/groups/0"]);
        assert.deepEqual(oModel.getProperty('/groupContext'),{path:"/groups/0", id: "group1",title: "group1 title"});
        getServiceStub.restore();
    });

    test("app finder - catalog - screen reader attributes test", function (assert) {
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );

        var oAppFinderView = createView();
        var oAppFinderController = oAppFinderView.getController();
        var oCatalogView = oAppFinderController.catalogView;
        var aCatalogCustomData = oCatalogView.getCustomData();
        var oCatalogCustomData = {};
        for (var i = 0; i < aCatalogCustomData.length ; i++) {
            oCatalogCustomData[aCatalogCustomData[i].getKey()] = aCatalogCustomData[i].getValue();
        }

        ok(oCatalogCustomData.role, "role attribute exist");
        ok(oCatalogCustomData["aria-label"], "aria-label attribute exist");
        assert.equal(oCatalogCustomData.role, "region", "The role attribute is region");
        assert.equal(oCatalogCustomData["aria-label"], "Catalog", "The aria-label attribute is Catalog");
        oAppFinderView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
        oController.catalogView.destroy();

    });

    test("app finder - subHeader aria values are correct", function(assert) {
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true, groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );

        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );

        var oAppFinderView = createView();
        oAppFinderView.updateSubHeader("",true);

        var oViewPage = oAppFinderView.getContent()[0];
        var oPageSubHeader = oViewPage.getSubHeader();

        var aPageSubHeaderCustomData = oPageSubHeader.getCustomData();

        var oSubHeaderLevelData = aPageSubHeaderCustomData.filter(function (oData) {
           return oData.getKey() == "aria-level";
        })[0];

        var oSubHeaderRoleData = aPageSubHeaderCustomData.filter(function (oData) {
            return oData.getKey() == "role";
        })[0];

        ok(oSubHeaderRoleData, "AppFinder sub header has role attribute.");
        assert.equal(oSubHeaderRoleData.getValue(), "heading", "AppFinder sub header role is heading");

        ok(oSubHeaderLevelData, "AppFinder sub header has aria-level attribute.");
        assert.equal(oSubHeaderLevelData.getValue(), 2, "AppFinder sub header aria-level is 2");

        var aButtons = oPageSubHeader.getContent()[1].getItems();

        aButtons.forEach(function (oButton) {
            var aButtonCustomData = oButton.getCustomData();
            var sId = oButton.getId();

            var aButtonControlData = aButtonCustomData.filter(function (oData) {
                return oData.getKey() == "aria-controls";
            })[0];

            ok(aButtonControlData, sId + " button has aria-controls attribute");
            assert.equal(aButtonControlData.getValue(), sId + "View", sId + " button aria-controls value is correct");
        });
        oAppFinderView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
        oController.catalogView.destroy();
    });

    test("onShow - make sure we do not show a disabled menu", function () {
        var oView = {
            showEasyAccessMenu: true,
            enableEasyAccessSAPMenu: true,
            enableEasyAccessUserMenu: true,
            oPage : {
                removeStyleClass : function () {
                },
                addStyleClass : function () {
                }
            },
            _showSearch: function () {
                return false;
            },
            _showSearchTag: function () {
                return false;
            }
        };

        oController.oView = oView;

        //all is enabled
        oController._updateCurrentMenuName("catalog");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog'");
        oController._updateCurrentMenuName("sapMenu");
        equal(oController.getCurrentMenuName(), "sapMenu", "current manu is 'sapMenu'");
        oController._updateCurrentMenuName("userMenu");
        equal(oController.getCurrentMenuName(), "userMenu", "current manu is 'userMenu'");

        //sapMenu is disabled
        oView.enableEasyAccessSAPMenu = false;
        oController._updateCurrentMenuName("catalog");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog'");
        oController._updateCurrentMenuName("sapMenu");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog' as sapMenu is disabled");
        oController._updateCurrentMenuName("userMenu");
        equal(oController.getCurrentMenuName(), "userMenu", "current manu is 'userMenu'");

        //userMenu is disabled
        oView.enableEasyAccessSAPMenu = true;
        oView.enableEasyAccessUserMenu = false;
        oController._updateCurrentMenuName("catalog");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog'");
        oController._updateCurrentMenuName("sapMenu");
        equal(oController.getCurrentMenuName(), "sapMenu", "current manu is 'sapMenu'");
        oController._updateCurrentMenuName("userMenu");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog' as userMenu is disabled");

        //userMenu & sap menu are disabled
        oView.enableEasyAccessSAPMenu = false;
        oView.enableEasyAccessUserMenu = false;
        oController._updateCurrentMenuName("catalog");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog'");
        oController._updateCurrentMenuName("sapMenu");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog' as sapMenu is disabled");
        oController._updateCurrentMenuName("userMenu");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog' as userMenu is disabled");

        //userMenu & sap menu are enabled but showEasyAccessMenu is turn off
        oView.showEasyAccessMenu = false;
        oView.enableEasyAccessSAPMenu = true;
        oView.enableEasyAccessUserMenu = true;
        oController._updateCurrentMenuName("catalog");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog'");
        oController._updateCurrentMenuName("sapMenu");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog' as sapMenu is disabled");
        oController._updateCurrentMenuName("userMenu");
        equal(oController.getCurrentMenuName(), "catalog", "current manu is 'catalog' as userMenu is disabled");


    });

    test("containsOnlyWhiteSpace", function () {
        equal(oController.containsOnlyWhiteSpac(' '), true);
        equal(oController.containsOnlyWhiteSpac('   '), true);
        equal(oController.containsOnlyWhiteSpac(' a b'), false);
        equal(oController.containsOnlyWhiteSpac(''), false);
        equal(oController.containsOnlyWhiteSpac(), false);

    });

    test("Catalog - tag filtering - event handler - selected tags exsist", function () {
        var oModel = new sap.ui.model.json.JSONModel({groups:['']}),
            getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return oModel;
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        var oAppFinderView = createView();
        var oAppFinderController = oAppFinderView.getController();
        var oEvent = {
            getSource: function () {
                return {
                    getModel: function () {
                        return oModel;
                    },
                    getSelectedItems: function () {
                        return [
                            {
                                getText: function (){
                                    return 'tag1';
                                }},
                            {
                                getText: function () {
                                    return 'tag2';
                                }
                            },{
                                getText: function () {
                                    return 'tag3';
                                }
                            }
                        ];
                    }
                };
            }
        };

        oController.currentMenu = 'catalog';
        oAppFinderController.onTagsFilter(oEvent);
        ok(oModel.getProperty('/activeMenu') === 'catalog', "active menu is Catalog");
        ok(oModel.getProperty('/tag').tagMode, 'tagMode is truthy');
        var aSelectedTagsKeys = oModel.getProperty('/tag').selectedTags;
        var bSelectedTagsPersisted = aSelectedTagsKeys.sort().join(',') === ['tag1', 'tag2', 'tag3'].sort().join(',');//Check that both arrays have same values.
        ok(bSelectedTagsPersisted, 'selected tags persisted in model successfully');

        //Clean after test.
        oAppFinderView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
        oController.catalogView.destroy();
    });

    test("Catalog - tag filtering - event handler - no selected tags", function () {
        var oModel = new sap.ui.model.json.JSONModel({groups:['']}),
            getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
                function () {
                    return {
                        getRouter: fnRouterMock,
                        getModel: function () {
                            return oModel;
                        },
                        getComponentData: function () {
                            return {config: {}};
                        }
                    };
                }
            );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        var oAppFinderView = createView();
        var oAppFinderController = oAppFinderView.getController();
        var oEvent = {
            getSource: function () {
                return {
                    getModel: function () {
                        return oModel;
                    },
                    getSelectedItems: function () {
                        return [];
                    }
                };
            }
        };

        oController.currentMenu = 'catalog';
        oAppFinderController.onTagsFilter(oEvent);
        ok(oModel.getProperty('/activeMenu') === 'catalog', "active menu is Catalog");
        ok(!oModel.getProperty('/tag').tagMode, 'tagMode is falsy');
        ok(!oModel.getProperty('/tag').selectedTags.length, 'no selected tags expected');

        //Clean after test.
        oAppFinderView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
        oController.catalogView.destroy();
    });

    test("onSegmentButtonClick calls should clean Search field", function (assert) {
        var oEvent = {
            getParameters: function (sValue) {
                return {id: "catalog"};
            }
        };

        var navigateToStub = sinon.stub(oController,"_navigateTo",function (arg1,arg2) {
            return;
        });
        oController.onSegmentButtonClick(oEvent);

        assert.deepEqual(oController.oSubHeaderModel.getProperty('/search'), {searchMode: false, searchTerm: ""});

        oController._navigateTo.restore();

    });


    test("Catalog - function handleSearchModelChanged invoked upon subheader model change and persists filtering data on URL", function () {
        var oModel = new sap.ui.model.json.JSONModel({
            groups:[''],
            dummy: {},
            tag: {
                tagMode: false,
                selectedTags: []
            },
            search: {
                searchMode: false,
                searchTerm: ''
            }
        }),
            getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
                function () {
                    return {
                        getRouter: fnRouterMock,
                        getModel: function () {
                            return oModel;
                        },
                        getComponentData: function () {
                            return {config: {}};
                        }
                    };
                }
            );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        var oAppFinderView = createView();
        var oAppFinderController = oAppFinderView.getController();
        var oCatalogView = oAppFinderController.catalogView;
        var oSubHeaderModel = oAppFinderView.getModel("subHeaderModel");
        //Check the scenario of entering search/tag mode when not in catalog view.
        var fnRestoreSelectedMasterItemSpy = sinon.spy(oCatalogView.getController(), "_restoreSelectedMasterItem");
        oController.currentMenu = 'catalog';
        oSubHeaderModel.setProperty('/tag/tagMode', true);
        ok(fnRestoreSelectedMasterItemSpy.notCalled, "current appFinder view isn't 'catalog' - selected master item restored");
        //Check category filter selection upon entering search/tag mode when the appfinder is in Catalog view
        oSubHeaderModel.setProperty('/activeMenu', 'catalogView');
        var fnSetCategoryFilter = sinon.spy(oCatalogView.getController(), "setCategoryFilter");
        oSubHeaderModel.setProperty('/tag/tagMode', false);
        ok(fnSetCategoryFilter.notCalled, 'catagory filter is set when in search/tag mode');
        //Check the scenario in which tag activ mode was changed but the selected tags remanined the same.
        var fnSetCategoryFilterSelection = sinon.spy(oCatalogView, "setCategoryFilterSelection");
        var fnIsTagFilteringChanged = sinon.stub(oCatalogView.getController(), "_isTagFilteringChanged");
        fnIsTagFilteringChanged.returns(false);
        var fnSUrlWithTagsAndSearchTerm = sinon.stub(oCatalogView.getController(), "_setUrlWithTagsAndSearchTerm");
        oSubHeaderModel.setProperty('/tag/tagMode', true);
        ok(fnSetCategoryFilterSelection.notCalled, 'category seleection is called');
        ok(fnIsTagFilteringChanged.notCalled, 'tagFilteringChanged is called');
        ok(!fnSUrlWithTagsAndSearchTerm.called, "tags filtering data shouldn't be persisted on url because selected tags wern't changed");
        //Check the scenario in which tag activ mode == true and the selected tags were changed.
        fnIsTagFilteringChanged.returns(true);
        oSubHeaderModel.setProperty('/tag/selectedTags', ['tag1', 'tag2']);
        ok(fnSUrlWithTagsAndSearchTerm.notCalled, "tags filtering data should be persisted on url because selected tags were changed");

        //Clean after test.
        oAppFinderView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
        fnRestoreSelectedMasterItemSpy.restore();
        fnSetCategoryFilter.restore();
        fnSetCategoryFilterSelection.restore();
        fnSUrlWithTagsAndSearchTerm.restore();
        fnIsTagFilteringChanged.restore();
        oController.catalogView.destroy();
    });

    test("onShow publish 'contentRendered'", function () {
        jQuery.sap.require("sap.m.Page");
        var onShowEvent = {
            getParameter: function (){
                return {menu: "catalog"};
            }
        };
        var getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
            function () {
                return {
                    getRouter: fnRouterMock,
                    getModel: function () {
                        return new sap.ui.model.json.JSONModel(
                            {enableEasyAccess:true,
                                groups:[""]});
                    },
                    getComponentData: function () {
                        return {config: {}};
                    }
                };
            }
        );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;},
                    applyExtendedShellState: function () {return true;}
                };
            }
        );
        var oAppFinderView = createView();
        var fnPublishEventSpy = sinon.spy(oEventHub, 'emit');
        var fnPreloadHandlerStub = sinon.stub(oController, "_preloadAppHandler", function (){return {};});

        oController._handleAppFinderNavigation(onShowEvent);
        ok(fnPublishEventSpy.args[0][0] === 'CenterViewPointContentRendered' && fnPublishEventSpy.args[0][1] == "appFinder",
            'contentRendered should be published upon AppFinder show');

        oAppFinderView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
        fnPreloadHandlerStub.restore();

    });

    test("Catalog - show no apps message when to catalogs are loaded", function () {
        var oModel = new sap.ui.model.json.JSONModel({
                groups:[''],
                catalogs: []
            }),
            getOwnerComponentForStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor",
                function () {
                    return {
                        getRouter: fnRouterMock,
                        getModel: function () {
                            return oModel;
                        },
                        getComponentData: function () {
                            return {config: {}};
                        }
                    };
                }
            );
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer",
            function (){
                return {
                    createExtendedShellState: function (){return true;}
                };
            }
        );
        var oAppFinderView = createView();
        var oAppFinderController = oAppFinderView.getController();
        var oCatalogView = oAppFinderController.catalogView;
        var oSubHeaderModel = oAppFinderView.getModel("subHeaderModel");
        oSubHeaderModel.setProperty('/activeMenu', 'catalogView');

        var fnCalculateDetailPageIdItemSpy = sinon.spy(oCatalogView, "_calculateDetailPageId");

        oCatalogView.getController().handleSearchModelChanged();
        ok(fnCalculateDetailPageIdItemSpy.calledOnce, "_calculateDetailPageId is called once");
        ok(fnCalculateDetailPageIdItemSpy.returned("catalogTilesDetailedPage"), "Catalog message page is shown");

        //Clean after test.
        oAppFinderView.destroy();
        getOwnerComponentForStub.restore();
        getRendererStub.restore();
        fnCalculateDetailPageIdItemSpy.restore();
        oController.catalogView.destroy();
    });

});

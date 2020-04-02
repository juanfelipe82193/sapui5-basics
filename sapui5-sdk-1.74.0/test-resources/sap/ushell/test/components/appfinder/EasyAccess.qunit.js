// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.EasyAccess
 */
(function () {
    "use strict";
    /*global asyncTest, equal, expect, module,
     ok, start, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ui.thirdparty.datajs");


    var oController;
    var oView;

    var ODataReadStub;
    var oResult;
    var bODataFailed;

    module("sap.ushell.components.appfinder.EasyAccess", {
        beforeEach: function () {
            sap.ushell.bootstrap("local");
            oController = new sap.ui.controller("sap.ushell.components.appfinder.EasyAccess");
            var oModel = new sap.ui.model.json.JSONModel();
            oView = {
                getModel: function () {
                    return oModel;
                },
                getViewData: function () {
                    return {menuName: "testName"};
                },
                getId: function () {
                    return "viewId";
                },
                splitApp: {
                    addDetailPage: function (oPage) {
                    },
                    toDetail: function (oPage) {
                    },
                    getCurrentDetailPage: function () {
                        return {};
                    }
                }
            };
            oController.getView = function () {
                return oView;
            };
            oController.oView = oView;
            oResult = {};
            bODataFailed = false;
            ODataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
                if (bODataFailed){
                    fail("Did not manage to read odata");
                } else {
                    success(oResult, {"statusCode": 200});
                }
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            delete sap.ushell.Container;
            ODataReadStub.restore();
            oController.destroy();
        }
    });

    test("invoke Controller Search Handler - non first time. ", function() {

        var spyAddDetailPage = sinon.spy(oView.splitApp, "addDetailPage");
        var spyToDetailPage = sinon.spy(oView.splitApp, "toDetail");
        var stubGetCurrentDetailPage = sinon.stub(oView.splitApp, "getCurrentDetailPage", function () {
            return {
                setBusy: function () {return;}
            }
        });

        var fnOrigGetSearchResults = oController._getSearchResults;
        oController._getSearchResults = function() {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve({results:[], count:0});
            return oDeferred.promise();
        };


        // just an object to simulate the search-results-view (hierarchy apps view)
        // so controller assumes it had been created before
        oController.easyAccessSearchResultsModel = new sap.ui.model.json.JSONModel();
        oController.hierarchyAppsSearchResults = {
            resultText: {
                updateProperty: function() {
                }
            },
            updateResultSetMessage : function () {}
        };


        // invoke the search
        oController.handleSearch("term");
        // no call to add page as the controller assumes the view created
        assert.equal(spyAddDetailPage.callCount,0);
        // call to navigation (page.go)
        assert.equal(spyToDetailPage.callCount,1);
        // call for navigating to the search-results-hierarchy-apps-page
        assert.equal(spyToDetailPage.getCall(0).args[0], "viewIdhierarchyAppsSearchResults");


        spyAddDetailPage.restore();
        spyToDetailPage.restore();
        stubGetCurrentDetailPage.restore();
        oController._getSearchResults = fnOrigGetSearchResults;
        delete oController.easyAccessSearchResultsModel;
        delete oController.hierarchyAppsSearchResults;
    });

    test("getMenuItems with configuration sapMenuServiceUrl=/someUrl, should call callODataService with /someUrl parameter", function () {
        var spyCallODataService = sinon.spy(oController, "_callODataService");
        oController.getView().getModel().setProperty("/sapMenuServiceUrl", "/someUrl");
        oController.getMenuItems("SAP_MENU", "UV2", "", 0);
        var url = "/someUrl;o=UV2/MenuItems?$filter=level lt '04'&$orderby=level,text";
        assert.equal(spyCallODataService.getCall(0).args[0].requestUri, url);
        spyCallODataService.restore();

    });

    test("getMenuItems with configuration userMenuServiceUrl=/someUrl, should call callODataService with /someUrl parameter", function () {
        oController.getView().getModel().setProperty("/userMenuServiceUrl", "/someUrl");
        var spyCallODataService = sinon.spy(oController, "_callODataService");
        oController.getMenuItems("USER_MENU", "UV2", "", 0);
        var url = "/someUrl;o=UV2/MenuItems?$filter=level lt '04'&$orderby=level,text";
        assert.equal(spyCallODataService.getCall(0).args[0].requestUri, url);
        spyCallODataService.restore();
    });

    test("getMenuItems with no configuration userMenuServiceUrl, should call callODataService with /sap/opu/odata/UI2/ parameter", function () {
        var spyCallODataService = sinon.spy(oController, "_callODataService");
        oController.getMenuItems("USER_MENU", "UV2", "", 0);
        var url = "/sap/opu/odata/UI2/USER_MENU;o=UV2/MenuItems?$filter=level lt '04'&$orderby=level,text";
        assert.equal(spyCallODataService.getCall(0).args[0].requestUri, url);
        spyCallODataService.restore();
    });

    test("getMenuItems with no configuration sapMenuServiceUrl, should call callODataService with /sap/opu/odata/UI2/ parameter", function () {
        var spyCallODataService = sinon.spy(oController, "_callODataService");
        oController.getMenuItems("SAP_MENU", "UV2", "", 0);
        var url = "/sap/opu/odata/UI2/EASY_ACCESS_MENU;o=UV2/MenuItems?$filter=level lt '04'&$orderby=level,text";
        assert.equal(spyCallODataService.getCall(0).args[0].requestUri, url);
        spyCallODataService.restore();
    });

    test("getMenuItems with invalid menu_type parameter should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("INVALID_MENU_TYPE", "UV2", "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid menuType parameter");
        });
    });

    test("getMenuItems with menu_type parameter = null should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems(null, "UV2", "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid menuType parameter");
        });
    });

    test("getMenuItems with menu_type parameter = undefined should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems(undefined, "UV2", "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid menuType parameter");
        });
    });

    test("getMenuItems with systemId parameter = \"\" should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "", "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid systemId parameter");
        });
    });

    test("getMenuItems with systemId parameter = null should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", null, "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid systemId parameter");
        });
    });

    test("getMenuItems with systemId parameter = undefined should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", undefined, "", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid systemId parameter");
        });
    });

    test("getMenuItems with entityId parameter = undefined should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", undefined, 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityId parameter");
        });
    });

    test("getMenuItems with entityId parameter = null should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", null, 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityId parameter");
        });
    });

    test("getMenuItems with entityId parameter not string should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", 1, 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityId parameter");
        });
    });

    test("getMenuItems with entityLevel parameter not an int should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", "", "1", 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityLevel parameter");
        });
    });

    test("getMenuItems with entityLevel parameter = null should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", "", null, 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityLevel parameter");
        });
    });

    test("getMenuItems with entityLevel parameter = undefined should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", "", undefined, 0);
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid entityLevel parameter");
        });
    });

    test("getMenuItems with numberOfNextLevels parameter not an int should fail ", function () {
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "UV2", "", 1, "1");
        oGetMenuItemsPromise.fail(function (error) {
            assert.equal(error, "Invalid numberOfNextLevels parameter");
        });
    });

    test("getMenuItems(\"SAP_MENU\",\"LOCAL\",\"\",0,2) should resolve an object with 2 levels from the root node", function () {
        var done = assert.async();
        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    icon: undefined,
                    subtitle: undefined,
                    level: 1,
                    folders: [
                        {
                            id: "id11",
                            text: "text11",
                            icon: undefined,
                            subtitle: undefined,
                            level: 2,
                            folders: undefined,
                            apps: undefined
                        }
                    ],
                    apps: []
                },
                {
                    id: "id2",
                    text: "text2",
                    icon: undefined,
                    subtitle: undefined,
                    level: 1,
                    folders: [],
                    apps: [
                        {
                            id: "id21",
                            text: "text21",
                            icon: undefined,
                            subtitle: undefined,
                            level: 2,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }

            ],
            apps: [
                {
                    id: "id3",
                    text: "text3",
                    icon: undefined,
                    subtitle: undefined,
                    level: 1,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        oResult = {
            "results": [
                {
                    "Id": "id1",
                    "level": "01",
                    "text": "text1",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id2",
                    "level": "01",
                    "text": "text2",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id3",
                    "level": "01",
                    "text": "text3",
                    "parentId": "",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id11",
                    "level": "02",
                    "text": "text11",
                    "parentId": "id1",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id21",
                    "level": "02",
                    "text": "text21",
                    "parentId": "id2",
                    "type": "INT",
                    "url": "#someIntent"
                }
            ]
        };

        var oGetMenuItemsPromise = oController.getMenuItems("SAP_MENU", "LOCAL", "", 0, 2);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"SAP_MENU\",\"LOCAL\",\"\",0) should resolve an object with 3 levels(default) from the root node", function () {

        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    icon: undefined,
                    subtitle: undefined,
                    level: 1,
                    folders: [
                        {
                            id: "id11",
                            text: "text11",
                            icon: undefined,
                            subtitle: undefined,
                            level: 2,
                            folders: [
                                {
                                    id: "id111",
                                    text: "text111",
                                    icon: undefined,
                                    subtitle: undefined,
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: []
                        },
                        {
                            id: "id12",
                            text: "text12",
                            icon: undefined,
                            subtitle: undefined,
                            level: 2,
                            folders: [
                                {
                                    id: "id121",
                                    text: "text121",
                                    icon: undefined,
                                    subtitle: undefined,
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id122",
                                    text: "text122",
                                    icon: undefined,
                                    subtitle: undefined,
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }
                            ],
                            apps: []
                        }
                    ],
                    apps: []
                },
                {
                    id: "id2",
                    text: "text2",
                    icon: undefined,
                    subtitle: undefined,
                    level: 1,
                    folders: [
                        {
                            id: "id21",
                            text: "text21",
                            icon: undefined,
                            subtitle: undefined,
                            level: 2,
                            folders: [],
                            apps: []
                        },
                        {
                            id: "id22",
                            text: "text22",
                            icon: undefined,
                            subtitle: undefined,
                            level: 2,
                            folders: [
                                {
                                    id: "id221",
                                    text: "text221",
                                    icon: undefined,
                                    subtitle: undefined,
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id222",
                                    text: "text222",
                                    icon: undefined,
                                    subtitle: undefined,
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: [
                                {
                                    id: "id223",
                                    text: "text223",
                                    icon: undefined,
                                    subtitle: undefined,
                                    level: 3,
                                    url: "#someIntent?sap-system=LOCAL"
                                }

                            ]
                        }
                    ],
                    apps: [
                        {
                            id: "id23",
                            text: "text23",
                            icon: undefined,
                            subtitle: undefined,
                            level: 2,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }

            ],
            apps: [
                {
                    id: "id3",
                    text: "text3",
                    icon: undefined,
                    subtitle: undefined,
                    level: 1,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        oResult = {
            "results": [
                {
                    "Id": "id1",
                    "level": "01",
                    "text": "text1",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id2",
                    "level": "01",
                    "text": "text2",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id3",
                    "level": "01",
                    "text": "text3",
                    "parentId": "",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id11",
                    "level": "02",
                    "text": "text11",
                    "parentId": "id1",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id23",
                    "level": "02",
                    "text": "text23",
                    "parentId": "id2",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id12",
                    "text": "text12",
                    "level": "02",
                    "type": "FL",
                    "parentId": "id1"
                },
                {
                    "Id": "id21",
                    "text": "text21",
                    "level": "02",
                    "type": "FL",
                    "parentId": "id2"
                },
                {
                    "Id": "id22",
                    "text": "text22",
                    "level": "02",
                    "type": "FL",
                    "parentId": "id2"
                },
                {
                    "Id": "id111",
                    "text": "text111",
                    "level": "03",
                    "type": "FL",
                    "parentId": "id11"
                },
                {
                    "Id": "id121",
                    "text": "text121",
                    "level": "03",
                    "type": "FL",
                    "parentId": "id12"
                },
                {
                    "Id": "id122",
                    "text": "text122",
                    "level": "03",
                    "type": "FL",
                    "parentId": "id12"
                },
                {
                    "Id": "id223",
                    "level": "03",
                    "text": "text223",
                    "parentId": "id22",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id221",
                    "text": "text221",
                    "level": "03",
                    "type": "FL",
                    "parentId": "id22"
                },
                {
                    "Id": "id222",
                    "text": "text222",
                    "level": "03",
                    "type": "FL",
                    "parentId": "id22"
                }
            ]
        };
        var done = assert.async();

        var oGetMenuItemsPromise = oController.getMenuItems("SAP_MENU", "LOCAL", "", 0);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"SAP_MENU\",\"LOCAL\",\"id1\",1,2) should resolve an object with 2 levels from the root node", function () {

        var expectedData = {
            id: "id1",
            folders: [
                {
                    id: "id11",
                    text: "text11",
                    icon: undefined,
                    subtitle: undefined,
                    level: 2,
                    folders: [
                        {
                            id: "id111",
                            text: "text111",
                            icon: undefined,
                            subtitle: undefined,
                            level: 3,
                            folders: undefined,
                            apps: undefined
                        },
                        {
                            id: "id112",
                            text: "text112",
                            icon: undefined,
                            subtitle: undefined,
                            level: 3,
                            folders: undefined,
                            apps: undefined
                        }
                    ],
                    apps: [
                        {
                            id: "id113",
                            text: "text113",
                            icon: undefined,
                            subtitle: undefined,
                            level: 3,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }
            ],
            apps: [
                {
                    id: "id12",
                    text: "text12",
                    icon: undefined,
                    subtitle: undefined,
                    level: 2,
                    url: "#someIntent?sap-system=LOCAL"
                },
                {
                    id: "id13",
                    text: "text13",
                    icon: undefined,
                    subtitle: undefined,
                    level: 2,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        oResult = {
            "results": [
                {
                    "Id": "id11",
                    "level": "02",
                    "text": "text11",
                    "parentId": "id1",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id12",
                    "level": "02",
                    "text": "text12",
                    "parentId": "id1",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id13",
                    "level": "02",
                    "text": "text13",
                    "parentId": "id1",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id111",
                    "level": "03",
                    "text": "text111",
                    "parentId": "id11",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id112",
                    "level": "03",
                    "text": "text112",
                    "parentId": "id11",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id113",
                    "level": "03",
                    "text": "text113",
                    "parentId": "id11",
                    "type": "INT",
                    "url": "#someIntent"
                }
            ]
        };
        var done = assert.async();

        var oGetMenuItemsPromise = oController.getMenuItems("SAP_MENU", "LOCAL", "id1", 1, 2);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"SAP_MENU\",\"LOCAL\",\"id1\",1) should resolve an object with 3 levels(default) from the root node", function () {
        var done = assert.async();
        var expectedData = {
            id: "id1",
            folders: [
                {
                    id: "id11",
                    text: "text11",
                    icon: undefined,
                    subtitle: undefined,
                    level: 2,
                    folders: [
                        {
                            id: "id111",
                            text: "text111",
                            icon: undefined,
                            subtitle: undefined,
                            level: 3,
                            folders: [
                                {
                                    id: "id1111",
                                    text: "text1111",
                                    icon: undefined,
                                    subtitle: undefined,
                                    level: 4,
                                    folders: undefined,
                                    apps: undefined
                                }
                            ],
                            apps: []
                        },
                        {
                            id: "id112",
                            text: "text112",
                            icon: undefined,
                            subtitle: undefined,
                            level: 3,
                            folders: [],
                            apps: [
                                {
                                    id: "id1121",
                                    text: "text1121",
                                    icon: undefined,
                                    subtitle: undefined,
                                    level: 4,
                                    url: "#someIntent?sap-system=LOCAL"
                                }
                            ]
                        }
                    ],
                    apps: [
                        {
                            id: "id113",
                            text: "text113",
                            icon: undefined,
                            subtitle: undefined,
                            level: 3,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }
            ],
            apps: [
                {
                    id: "id12",
                    text: "text12",
                    icon: undefined,
                    subtitle: undefined,
                    level: 2,
                    url: "#someIntent?sap-system=LOCAL"
                },
                {
                    id: "id13",
                    text: "text13",
                    icon: undefined,
                    subtitle: undefined,
                    level: 2,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        oResult = {
            "results": [
                {
                    "Id": "id11",
                    "level": "02",
                    "text": "text11",
                    "parentId": "id1",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id12",
                    "level": "02",
                    "text": "text12",
                    "parentId": "id1",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id13",
                    "level": "02",
                    "text": "text13",
                    "parentId": "id1",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id111",
                    "level": "03",
                    "text": "text111",
                    "parentId": "id11",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id112",
                    "level": "03",
                    "text": "text112",
                    "parentId": "id11",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id113",
                    "level": "03",
                    "text": "text113",
                    "parentId": "id11",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id1121",
                    "level": "04",
                    "text": "text1121",
                    "parentId": "id112",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id1111",
                    "level": "04",
                    "text": "text1111",
                    "parentId": "id111",
                    "type": "FL",
                    "url": ""
                }
            ]
        };

        var oGetMenuItemsPromise = oController.getMenuItems("SAP_MENU", "LOCAL", "id1", 1);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"USER_MENU\",\"LOCAL\",\"\",3,2) should resolve an object with 2 levels from the root node(the entityLevel is irrelevant)", function () {
        var done = assert.async();
        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    icon: undefined,
                    subtitle: undefined,
                    level: 1,
                    folders: [
                        {
                            id: "id11",
                            text: "text11",
                            icon: undefined,
                            subtitle: undefined,
                            level: 2,
                            folders: undefined,
                            apps: undefined
                        }
                    ],
                    apps: []
                },
                {
                    id: "id2",
                    text: "text2",
                    icon: undefined,
                    subtitle: undefined,
                    level: 1,
                    folders: [],
                    apps: [
                        {
                            id: "id21",
                            text: "text21",
                            icon: undefined,
                            subtitle: undefined,
                            level: 2,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }

            ],
            apps: [
                {
                    id: "id3",
                    text: "text3",
                    icon: undefined,
                    subtitle: undefined,
                    level: 1,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        oResult = {
            "results": [
                {
                    "Id": "id1",
                    "level": "01",
                    "text": "text1",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id2",
                    "level": "01",
                    "text": "text2",
                    "parentId": "",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id3",
                    "level": "01",
                    "text": "text3",
                    "parentId": "",
                    "type": "INT",
                    "url": "#someIntent"
                },
                {
                    "Id": "id11",
                    "level": "02",
                    "text": "text11",
                    "parentId": "id1",
                    "type": "FL",
                    "url": ""
                },
                {
                    "Id": "id21",
                    "level": "02",
                    "text": "text21",
                    "parentId": "id2",
                    "type": "INT",
                    "url": "#someIntent"
                }
            ]
        };

        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "", 3, 2);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("test level 02 with hidden parent", function () {
        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [],
            apps: []
        };

        oResult = {
            results: [
                {
                    Id: "id1",
                    level: "02",
                    text: "text1",
                    parentId: "",
                    type: "FL",
                    url: ""
                }
            ]
        };
        var done = assert.async();

        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "", 0);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("test level 0 with hidden parent", function () {
        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [],
            apps: []
        };

        oResult = {
            results: [
                {
                    apps: [],
                    id: "root",
                    level: 0,
                    text: "root"
                }
            ]
        };
        var done = assert.async();

        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "", 0);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("test level 0 with an undefined parent id", function () {
        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [],
            apps: []
        };

        oResult = {
            results: [
                {
                    apps: [],
                    id: "test2",
                    level: 0,
                    text: "test",
                    parentId: undefined
                }
            ]
        };
        var done = assert.async();

        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "", 0);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"USER_MENU\",\"LOCAL\",\"\",0) without results should return the root element", function () {

        var expectedData = {
            id: "root",
            text: "root",
            level: 0,
            folders: [],
            apps: []
        };

        oResult = {
            "results": []
        };
        var done = assert.async();

        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "", 0);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems(\"USER_MENU\",\"LOCAL\",\"someId\",3) without results should return the root element", function () {

        var expectedData = {
            id: "someId",
            folders: [],
            apps: []
        };

        oResult = {
            "results": []
        };
        var done = assert.async();

        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "someId", 3);
        oGetMenuItemsPromise.done(function (data) {
            assert.deepEqual(data, expectedData);
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("getMenuItems() with a failure in the odata call, should fail the promise", function () {

        bODataFailed = true;
        var oGetMenuItemsPromise = oController.getMenuItems("USER_MENU", "LOCAL", "someId", 3);
        var done = assert.async();
        oGetMenuItemsPromise.fail(function (message) {
            assert.deepEqual(message, "Did not manage to read odata");
            done();
        });
        oGetMenuItemsPromise.always(function () {
            OData.read.restore();
        });
    });

    test("checkIfSystemSelectedAndLoadData with no systemSelected should not call loadMenuItemsFirstTime function", function () {
        var testData = {};

        var oView = {
            getModel: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            },
            getViewData: function () {
                return {menuName: "testName"}
            },
            hierarchyFolders: {setModel: function(){}},
            hierarchyApps: {setModel: function(){}}
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });
        var spyLoadMenuItemsFirstTime = sinon.spy(oController, "loadMenuItemsFirstTime");
        oController.onInit();
        oController.checkIfSystemSelectedAndLoadData();
        assert.equal(spyLoadMenuItemsFirstTime.callCount, 0);
        oController.loadMenuItemsFirstTime.restore();
    });

    test("checkIfSystemSelectedAndLoadData with systemSelected should call loadMenuItemsFirstTime function and navigateHierarchy", function () {
        var testData = {systemSelected: {systemName: "system1", systemId: "systemId1"}};

        var oView = {
            getModel: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            },
            getViewData: function () {
                return {menuName: "testName"}
            },
            hierarchyFolders: {setModel: function(){}},
            hierarchyApps: {setModel: function(){}}
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });
        sinon.stub(oController, "loadMenuItemsFirstTime", function (arg1, arg2) {
            assert.equal(arg1, "testName");
            assert.equal(arg2.systemName, "system1");
            assert.equal(arg2.systemId, "systemId1");
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve();
            return oDeferred.promise();
        });
        sinon.stub(oController, "navigateHierarchy", function (arg1, arg2) {
            assert.equal(arg1, "");
            assert.equal(arg2, false);
        });

        oController.onInit();
        oController.checkIfSystemSelectedAndLoadData();
        oController.getView.restore();
        oController.loadMenuItemsFirstTime.restore();
        oController.navigateHierarchy.restore();
    }),

    test("navigateHierarchy with no path and data in model should call updatePageBindings with / path", function () {
        var testData = {
            id: "someSystem",
            text: "someSystem",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    level: 1,
                    folders: [],
                    apps: []
                }
            ],
            apps: [
                {
                    id: "id3",
                    text: "text3",
                    level: 1,
                    url: "#someIntent?sap-system=LOCAL"
                }
            ]
        };

        var testEasyAccessModel = new sap.ui.model.json.JSONModel();
        testEasyAccessModel.setData(testData);

        var oView = {
            easyAccessModel: testEasyAccessModel,
            hierarchyFolders: {
                updatePageBindings: function () {},
                setBusy: function () {},
                setModel: function(){}
            },
            hierarchyApps: {
                getController: function () {
                    return {
                        updatePageBindings: function (arg1) {
                            assert.equal(arg1, "");
                        }
                    }
                },
                setModel: function(){},
                setBusy: function () {}
            },
            getModel: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            },
            getViewData: function () {
                return {menuName: "testName"}
            }
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });

        sinon.stub(oView.hierarchyFolders, "updatePageBindings", function (arg1, arg2) {
            assert.equal(arg1, "");
            assert.equal(arg2, true);
        });

        var spyMasterMenuSetBusy = sinon.spy(oView.hierarchyFolders, "setBusy");
        jQuery.sap.require('sap.m.MessageBox');
        var stubMBError = sinon.stub(sap.m.MessageBox, "error");

        oController.onInit();
        oController.navigateHierarchy("", true);
        assert.ok(spyMasterMenuSetBusy.calledWith(false));

        stubMBError.restore();
        oController.getView.restore();
    });

    test("navigateHierarchy with path and data in model should call updatePageBindings with the path", function () {
        var testData = {
            id: "someSystem",
            text: "someSystem",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    level: 1,
                    folders: [
                        {
                            id: "id11",
                            text: "text11",
                            level: 2,
                            folders: [
                                {
                                    id: "id111",
                                    text: "text111",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: []
                        },
                        {
                            id: "id12",
                            text: "text12",
                            level: 2,
                            folders: [
                                {
                                    id: "id121",
                                    text: "text121",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id122",
                                    text: "text122",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }
                            ],
                            apps: []
                        }
                    ],
                    apps: []
                },
                {
                    id: "id2",
                    text: "text2",
                    level: 1,
                    folders: [
                        {
                            id: "id21",
                            text: "text21",
                            level: 2,
                            folders: [],
                            apps: []
                        },
                        {
                            id: "id22",
                            text: "text22",
                            level: 2,
                            folders: [
                                {
                                    id: "id221",
                                    text: "text221",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id222",
                                    text: "text222",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: [
                                {
                                    id: "id223",
                                    text: "text223",
                                    level: 3,
                                    url: "#someIntent?sap-system=LOCAL"
                                }

                            ]
                        }
                    ],
                    apps: [
                        {
                            id: "id23",
                            text: "text23",
                            level: 2,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }

            ],
        };

        var testEasyAccessModel = new sap.ui.model.json.JSONModel();
        testEasyAccessModel.setData(testData);


        var oView = {
            easyAccessModel: testEasyAccessModel,
            hierarchyFolders: {
                updatePageBindings: function () {},
                setBusy: function () {},
                setModel: function(){}
            },
            hierarchyApps: {
                getController: function () {
                    return {
                        updatePageBindings: function (arg1) {
                            assert.equal(arg1, "/folders/1/folders/1");
                        }
                    }
                },
                setModel: function(){}
            },
            getModel: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            },
            getViewData: function () {
                return {menuName: "testName"}
            }
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });

        sinon.stub(oView.hierarchyFolders, "updatePageBindings", function (arg1, arg2) {
            assert.equal(arg1, "/folders/1/folders/1");
            assert.equal(arg2, true);
        });

        var spyMasterMenuSetBusy = sinon.spy(oView.hierarchyFolders, "setBusy");

        oController.onInit();
        oController.easyAccessModel = testEasyAccessModel;
        oController.navigateHierarchy("/folders/1/folders/1", true);
        assert.ok(spyMasterMenuSetBusy.calledWith(false));

        oController.getView.restore();
    });

    test("navigateHierarchy with path and no data in model should call getMenuItems", function () {
        var testData = {
            id: "someSystem",
            text: "someSystem",
            level: 0,
            folders: [
                {
                    id: "id1",
                    text: "text1",
                    level: 1,
                    folders: [
                        {
                            id: "id11",
                            text: "text11",
                            level: 2,
                            folders: [
                                {
                                    id: "id111",
                                    text: "text111",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: []
                        },
                        {
                            id: "id12",
                            text: "text12",
                            level: 2,
                            folders: [
                                {
                                    id: "id121",
                                    text: "text121",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id122",
                                    text: "text122",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }
                            ],
                            apps: []
                        }
                    ],
                    apps: []
                },
                {
                    id: "id2",
                    text: "text2",
                    level: 1,
                    folders: [
                        {
                            id: "id21",
                            text: "text21",
                            level: 2,
                            folders: [],
                            apps: []
                        },
                        {
                            id: "id22",
                            text: "text22",
                            level: 2,
                            folders: [
                                {
                                    id: "id221",
                                    text: "text221",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                },
                                {
                                    id: "id222",
                                    text: "text222",
                                    level: 3,
                                    folders: undefined,
                                    apps: undefined
                                }

                            ],
                            apps: [
                                {
                                    id: "id223",
                                    text: "text223",
                                    level: 3,
                                    url: "#someIntent?sap-system=LOCAL"
                                }

                            ]
                        }
                    ],
                    apps: [
                        {
                            id: "id23",
                            text: "text23",
                            level: 2,
                            url: "#someIntent?sap-system=LOCAL"
                        }
                    ]
                }

            ],
        };

        var testEasyAccessModel = new sap.ui.model.json.JSONModel();
        testEasyAccessModel.setData(testData);


        var oView = {
            easyAccessModel: testEasyAccessModel,
            hierarchyFolders: {
                updatePageBindings: function () {},
                setBusy: function () {},
                setModel: function(){}
            },
            hierarchyApps: {
                getController: function () {
                    return {
                        updatePageBindings: function (arg1) {
                            assert.equal(arg1, "/folders/0/folders/0/folders/0");
                        }
                    }
                },
                setModel: function(){}
            },
            getModel: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(testData);
                return oModel;
            },
            getViewData: function () {
                return {menuName: "testName"}
            }
        };

        sinon.stub(oController, "getView", function () {
            return oView;
        });

        sinon.stub(oView.hierarchyFolders, "updatePageBindings", function (arg1, arg2) {
            assert.equal(arg1, "/folders/0/folders/0/folders/0");
            assert.equal(arg2, true);
        });

        sinon.stub(oController, "getMenuItems", function () {

            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve({
                folders: [{property1: "val1"}, {property2: "val2"}],
                apps: [{property3: "val3"}, {property4: "val4"}]
            });
            return oDeferred.promise();
        });

        var spyMasterMenuSetBusy = sinon.spy(oView.hierarchyFolders, "setBusy");

        oController.onInit();
        oController.easyAccessModel = testEasyAccessModel;
        oController.navigateHierarchy("/folders/0/folders/0/folders/0", true);
        assert.ok(spyMasterMenuSetBusy.calledWith(true));
        assert.ok(spyMasterMenuSetBusy.calledWith(false));
        assert.deepEqual(testEasyAccessModel.getProperty("/folders/0/folders/0/folders/0/folders"), [{property1: "val1"}, {property2: "val2"}]);
        assert.deepEqual(testEasyAccessModel.getProperty("/folders/0/folders/0/folders/0/apps"), [{property3: "val3"}, {property4: "val4"}]);

        oController.getView.restore();
        oController.getMenuItems.restore();
    });

    test("getErrorMessage for User Menu and error string", function () {

        oController.menuName = "USER_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage("some error message");
        assert.equal(result, "Cannot get User menu data: some error message");
    });

    test("getErrorMessage for User Menu and error with message", function () {

        oController.menuName = "USER_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage({message: "some error message"});
        assert.equal(result, "Cannot get User menu data: some error message");
    });

    test("getErrorMessage for User Menu and no error message", function () {

        oController.menuName = "USER_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage();
        assert.equal(result, "Cannot get User menu data");
    });

    test("getErrorMessage for SAP Menu and error string", function () {

        oController.menuName = "SAP_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage("some error message");
        assert.equal(result, "Cannot get SAP menu data: some error message");
    });

    test("getErrorMessage for User Menu and error with message", function () {

        oController.menuName = "SAP_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage({message: "some error message"});
        assert.equal(result, "Cannot get SAP menu data: some error message");
    });

    test("getErrorMessage for User Menu and and no error message", function () {

        oController.menuName = "SAP_MENU";
        oController.translationBundle = sap.ushell.resources.i18n;
        var result = oController.getErrorMessage();
        assert.equal(result, "Cannot get SAP menu data");
    });

    test("handleGetMenuItemsError for User Menu with error message", function () {
        var oView = {
            easyAccessModel: new sap.ui.model.json.JSONModel(),
            hierarchyFolders: {
                setBusy: function () {}
            },
            hierarchyApps :  {
                setBusy: function () {}
            }
        };
        var done = assert.async();

        oController.oView = oView;

        sinon.stub(oController, "getErrorMessage", function (error) {
            return error;
        });
        var errorSpy;

        oController.easyAccessModel = new sap.ui.model.json.JSONModel();

        sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
            errorSpy = sinon.stub(MessageBox, "error", function () {});
            oController.handleGetMenuItemsError("some error message");
            setTimeout(function () {
                assert.ok(errorSpy.calledWith("some error message"), "expected error message: some error message");
                MessageBox.error.restore();
                done();
            },200);
        });

    });

    test("handleGetMenuItemsError for User Menu", function () {
        var oView = {
            easyAccessModel: new sap.ui.model.json.JSONModel(),
            hierarchyFolders: {
                setBusy: function () {}
            },
            hierarchyApps :  {
                setBusy: function () {}
            }
        };
        oController.oView = oView;

        sinon.stub(oController, "getErrorMessage", function (error) {
            return error;
        });

        oController.easyAccessModel = new sap.ui.model.json.JSONModel();
        var setDataSpy = sinon.spy(oController.easyAccessModel, "setData");
        var setBusySpy = sinon.spy(oView.hierarchyFolders, "setBusy");
        oController.handleGetMenuItemsError("some error message");
        assert.ok(setDataSpy.calledWith(""), "setData was called with ''");
        assert.ok(setBusySpy.calledWith(false), "setBusy called with false");
        oController.easyAccessModel.setData.restore();
        oView.hierarchyFolders.setBusy.restore();

    });

    test("Test _appendSystemToUrl", function () {

        // initialize mock data
        var sSystemId = "U1YCLNT120";
        var aData = [
            {
                url: "#Shell-startTransaction?sap-ui2-tcode=PFCG",
                expected: "#Shell-startTransaction?sap-ui2-tcode=PFCG&sap-system=" + sSystemId,
                info: "url has one parameter already"
            },
            {
                url: "#Shell-startTransaction",
                expected: "#Shell-startTransaction?sap-system=" + sSystemId,
                info: "url has no parameters"
            },
            {
                url: "#Shell-startTransaction?sap-ui2-tcode=PFCG&anotherParam=someValue",
                expected: "#Shell-startTransaction?sap-ui2-tcode=PFCG&anotherParam=someValue&sap-system=" + sSystemId,
                info: "url has 2 parameters already"
            },
            {
                url: "#Shell-startTransaction?",
                expected: "#Shell-startTransaction?&sap-system=" + sSystemId,
                info: "url ends with '?'"
            },
            {
                url: undefined,
                expected: undefined,
                info: "url is undefined"
            }
        ];

        for (var i = 0; i < aData.length; i++) {
            // call the function under test
            var result = oController._appendSystemToUrl(aData[i], sSystemId);

            // assert
            assert.equal(result, aData[i].expected, aData[i].info);
        }

    });

    test("Test _getServiceUrl for SAP_MENU", function () {
        var oModel = new sap.ui.model.json.JSONModel();
        oView = {
            getModel: function () {
                return oModel;
            }
        };
        oController.getView = function () {
            return oView;
        };

        var result = oController._getServiceUrl("SAP_MENU");
        assert.equal(result, "/sap/opu/odata/UI2/EASY_ACCESS_MENU")
    });

    test("Test _getServiceUrl for USER_MENU", function () {
        var oModel = new sap.ui.model.json.JSONModel();
        oView = {
            getModel: function () {
                return oModel;
            }
        };
        oController.getView = function () {
            return oView;
        };

        var result = oController._getServiceUrl("USER_MENU");
        assert.equal(result, "/sap/opu/odata/UI2/USER_MENU")
    });

    test("Test _getODataRequestForSearchUrl(\"USER_MENU\",\"someId\",\"someTerm\")", function () {
        var getServiceUrlStub = sinon.stub(oController, "_getServiceUrl", function () {
            return "someUrl";
        });

        var result = oController._getODataRequestForSearchUrl("USER_MENU","someId","someTerm");
        assert.equal(result, "someUrl;o=someId/MenuItems?$filter=type ne 'FL' and substringof('someTerm', text) or substringof('someTerm', subtitle) or substringof('someTerm', url)&$orderby=text,subtitle,url&$inlinecount=allpages&$skip=0&$top=100");
        getServiceUrlStub.restore();
    });

    test("Test _getODataRequestForSearchUrl(\"SAP_MENU\",\"someId\",\"someTerm\",200)", function () {
        var getServiceUrlStub = sinon.stub(oController, "_getServiceUrl", function () {
            return "someUrl";
        });

        var result = oController._getODataRequestForSearchUrl("USER_MENU","someId","someTerm",200);
        assert.equal(result, "someUrl;o=someId/MenuItems?$filter=type ne 'FL' and substringof('someTerm', text) or substringof('someTerm', subtitle) or substringof('someTerm', url)&$orderby=text,subtitle,url&$inlinecount=allpages&$skip=200&$top=100");
        getServiceUrlStub.restore();
    });

    test("Test _getODataRequestForSearchUrl(\"SAP_MENU\",\"someId\",\"some*Term\",200)", function () {
        var getServiceUrlStub = sinon.stub(oController, "_getServiceUrl", function () {
            return "someUrl";
        });

        var result = oController._getODataRequestForSearchUrl("USER_MENU","someId","someTerm",200);
        assert.equal(result, "someUrl;o=someId/MenuItems?$filter=type ne 'FL' and substringof('someTerm', text) or substringof('someTerm', subtitle) or substringof('someTerm', url)&$orderby=text,subtitle,url&$inlinecount=allpages&$skip=200&$top=100");
        getServiceUrlStub.restore();
    });

    test("Test _getODataRequestForSearchUrl(\"SAP_MENU\",\"someId\",\"*\",200)", function () {
        var getServiceUrlStub = sinon.stub(oController, "_getServiceUrl", function () {
            return "someUrl";
        });

        var result = oController._getODataRequestForSearchUrl("USER_MENU","someId","*",200);
        assert.equal(result, "someUrl;o=someId/MenuItems?$filter=type ne 'FL' and substringof('', text) or substringof('', subtitle) or substringof('', url)&$orderby=text,subtitle,url&$inlinecount=allpages&$skip=200&$top=100");
        getServiceUrlStub.restore();
    });

    test("Test _getODataRequestForSearchUrl(\"SAP_MENU\",\"someId\",\"Term contains 'single quote's\",200)", function () {
        var getServiceUrlStub = sinon.stub(oController, "_getServiceUrl", function () {
            return "someUrl";
        });

        var result = oController._getODataRequestForSearchUrl("SAP_MENU","someId","Term contains 'single quote's",200);
        assert.equal(result, "someUrl;o=someId/MenuItems?$filter=type ne 'FL' and substringof('Term contains ''single quote''s', text) or substringof('Term contains ''single quote''s', subtitle) or substringof('Term contains ''single quote''s', url)&$orderby=text,subtitle,url&$inlinecount=allpages&$skip=200&$top=100");
        getServiceUrlStub.restore();
    });

    test("Test handleSuccessOnReadFilterResults", function () {
        oController.systemId = 'xxx';
        var result = oController.handleSuccessOnReadFilterResults({results: [{url: 'aaa'},{url: 'bbb'}],__count:"100"});
        assert.deepEqual(result.results, [{url: 'aaa?sap-system=xxx'},{url: 'bbb?sap-system=xxx'}]);
        assert.equal(result.count, "100");
    });

    test("Test handleSuccessOnReadMenuItems", function () {
        var oDataResultFormatterStub = sinon.stub(oController, "_oDataResultFormatter", function (a,b,c,d) {
            return {}
        });
        var result = oController.handleSuccessOnReadMenuItems({results: "results"}, {systemId: "systemId",iLevelFilter:"1"});
        ok(oDataResultFormatterStub.calledOnce);

        oDataResultFormatterStub.restore();
    });


    test("test _removeWildCards with *", function () {
        var result = oController._removeWildCards('C*r*oss*');
        equal(result, "Cross");
    });

    test("test _removeWildCards with *", function () {
        var result = oController._removeWildCards('Cross');
        equal(result, "Cross");
    });

    test("test getMoreSearchResults with response", function () {
        var getSearchResultsStub = sinon.stub(oController,"_getSearchResults", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve({
                results: [3,4,5],
                count: 100
            });
            return oDeferred.promise();
        });

        var oModel = oController.getView().getModel();
        oModel.setProperty("/search",{"searchTerm" : "someTerm"});
        oController.searchResultFrom = 1;
        oController.easyAccessSearchResultsModel = new sap.ui.model.json.JSONModel();
        oController.easyAccessSearchResultsModel.setProperty('/apps',[1,2]);
        oController.getMoreSearchResults();
        assert.deepEqual(oController.easyAccessSearchResultsModel.getProperty('/apps'),[1,2,3,4,5]);
        assert.equal(oController.searchResultFrom,5);
        getSearchResultsStub.restore();

    });

    test("test getMoreSearchResults with an error", function () {
        var handleGetMenuItemsErrorSpy = sinon.stub(oController,"handleGetMenuItemsError",function(x) {
            return x;
        });

        var getSearchResultsStub = sinon.stub(oController,"_getSearchResults", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.reject("some error message");
            return oDeferred.promise();
        });

        oController.getMoreSearchResults();
        assert.ok(handleGetMenuItemsErrorSpy.calledWith("some error message"));
        handleGetMenuItemsErrorSpy.restore();
        getSearchResultsStub.restore();
    });


}());